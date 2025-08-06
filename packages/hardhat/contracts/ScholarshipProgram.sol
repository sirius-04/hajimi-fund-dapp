// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract ScholarshipProgram is ReentrancyGuard, Pausable {
    enum ProgramStatus { Pending, Active, Expired, Cancelled, Completed }
    enum RequestStatus { Pending, Approved, Rejected, Expired, Completed }
    enum Vote { None, Approve, Reject }

    struct Request {
        uint id;
        string title;
        string description;
        uint value;
        string evidenceCID;
        uint approvalCount;
        uint rejectCount;
        RequestStatus status;
        uint createdAt;
        uint votingDeadline;
    }

    struct Contribution {
        address contributor;
        uint contributedAmount;
        uint timestamp;
    }

    string public title;
    string public description;
    string public mediaCID;
    address public creator;
    uint public goal;
    ProgramStatus public status;
    uint public createdAt;
    uint public expiryDate;

    uint public approversCount;
    uint public nextRequestId;
    uint public constant APPROVAL_THRESHOLD = 60;
    uint public constant MIN_CONTRIBUTION_PERCENTAGE = 1;
    uint public constant MAX_REQUEST_PERCENTAGE = 30;
    uint public constant VOTING_PERIOD = 7 days;
    uint public constant PROGRAM_DURATION = 90 days;

    mapping(address => bool) public approvers;
    mapping(uint => Request) public requestsMap;
    mapping(uint => mapping(address => Vote)) public votesByRequest;
    mapping(address => bool) public hasContributed;
    mapping(address => uint) public totalContributions;
    
    address[] public contributors;
    Contribution[] public contributions;
    uint[] public requestIds;

    // modifiers
    modifier onlyCreator() {
        require(msg.sender == creator, "Not the program creator");
        _;
    }

    modifier onlyApprover() {
        require(approvers[msg.sender], "Not an approver");
        _;
    }

    modifier programActive() {
        require(status == ProgramStatus.Active, "Program not active");
        _;
    }

    modifier notExpired() {
        require(block.timestamp < expiryDate, "Program expired");
        _;
    }

    modifier hasBalance() {
        require(address(this).balance > 0, "No funds available");
        _;
    }

    modifier validRequest(uint _requestId) {
        require(_requestId > 0 && _requestId <= nextRequestId, "Invalid request ID");
        _;
    }

    // events
    event ProgramCreated(address indexed creator, string title, uint goal, uint expiryDate);
    event Contributed(address indexed contributor, uint amount, bool becameApprover);
    event ProgramActivated(uint timestamp, uint totalFunds);
    event ProgramCancelled(uint timestamp, uint refundedAmount);
    event ProgramExpired(uint timestamp);
    event ProgramCompleted(uint timestamp);
    
    event RequestCreated(uint indexed requestId, string title, uint value, uint votingDeadline);
    event VoteCast(uint indexed requestId, address indexed voter, bool approved);
    event RequestApproved(uint indexed requestId, uint timestamp);
    event RequestExpired(uint indexed requestId, uint timestamp);
    event RequestRejected(uint indexed requestId, uint timestamp);
    event RequestCompleted(uint indexed requestId, uint value, uint timestamp);
    
    event FundsReleased(uint indexed requestId, address recipient, uint amount);
    event RefundAvailable(address indexed programAddress);
    event RefundProcessed(address indexed contributor, uint amount);
    event ProofUploaded(uint indexed requestId, string evidenceCID);

    constructor(
        string memory _title,
        string memory _description,
        uint _goal,
        string memory _mediaCID,
        address _creator
    ) {
        require(_goal > 0, "Goal must be positive");
        require(bytes(_title).length > 0, "Title required");
        require(_creator != address(0), "Invalid creator address");

        title = _title;
        description = _description;
        goal = _goal;
        mediaCID = _mediaCID;
        creator = _creator;
        status = ProgramStatus.Pending;
        createdAt = block.timestamp;
        expiryDate = block.timestamp + PROGRAM_DURATION;

        emit ProgramCreated(_creator, _title, _goal, expiryDate);
    }

    // contribute function
    function contribute() external payable nonReentrant notExpired whenNotPaused {
        require(msg.value > 0, "Contribution must be positive");
        require(status == ProgramStatus.Pending || status == ProgramStatus.Active, "Invalid program status");

        bool becameApprover = false;
        uint minContribution = (goal * MIN_CONTRIBUTION_PERCENTAGE) / 100;

        totalContributions[msg.sender] += msg.value;

        // add contribution
        contributions.push(Contribution({
            contributor: msg.sender,
            contributedAmount: msg.value,
            timestamp: block.timestamp
        }));

        if (!hasContributed[msg.sender]) {
            contributors.push(msg.sender);
            hasContributed[msg.sender] = true;
        }

        if (totalContributions[msg.sender] >= minContribution && !approvers[msg.sender]) {
            approvers[msg.sender] = true;
            approversCount++;
            becameApprover = true;
        }

        emit Contributed(msg.sender, msg.value, becameApprover);

        // check if the program reach goal to be activated
        if (address(this).balance >= goal && status == ProgramStatus.Pending) {
            status = ProgramStatus.Active;
            emit ProgramActivated(block.timestamp, address(this).balance);
        }
    }

    // create spending request
    function createRequest(
        string memory _title,
        string memory _description,
        uint _value,
        string memory _evidenceCID
    ) external onlyCreator programActive nonReentrant {
        require(bytes(_title).length > 0, "Title required");
        require(_value > 0, "Value must be positive");
        require(_value <= (address(this).balance * MAX_REQUEST_PERCENTAGE) / 100, "Exceeds maximum request amount");

        nextRequestId++;
        Request storage newRequest = requestsMap[nextRequestId];
        
        newRequest.id = nextRequestId;
        newRequest.title = _title;
        newRequest.description = _description;
        newRequest.value = _value;
        newRequest.evidenceCID = _evidenceCID;
        newRequest.status = RequestStatus.Pending;
        newRequest.createdAt = block.timestamp;
        newRequest.votingDeadline = block.timestamp + VOTING_PERIOD;

        requestIds.push(nextRequestId);

        emit RequestCreated(nextRequestId, _title, _value, newRequest.votingDeadline);
    }

    // vote on request
    function vote(uint _requestId, bool _approve) external onlyApprover nonReentrant validRequest(_requestId) {
        Request storage request = requestsMap[_requestId];
        
        require(request.status == RequestStatus.Pending, "Request not pending");
        require(!isRequestExpired(_requestId), "Voting period ended");
        require(votesByRequest[_requestId][msg.sender] == Vote.None, "Already voted");

        if (_approve) {
            votesByRequest[_requestId][msg.sender] = Vote.Approve;
            request.approvalCount++;
        } else {
            votesByRequest[_requestId][msg.sender] = Vote.Reject;
            request.rejectCount++;
        }

        emit VoteCast(_requestId, msg.sender, _approve);

        _checkVotingThreshold(_requestId);
    }

    // update the request status by checking if it passed the threshold
    function _checkVotingThreshold(uint _requestId) internal {
        Request storage request = requestsMap[_requestId];
        
        if (approversCount == 0) return;

        uint totalVotes = request.approvalCount + request.rejectCount;

        uint approvalRate = (request.approvalCount * 100) / totalVotes;
        uint rejectRate = (request.rejectCount * 100) / totalVotes;

        if (approvalRate >= APPROVAL_THRESHOLD) {
            request.status = RequestStatus.Approved;
            emit RequestApproved(_requestId, block.timestamp);
        } else if (rejectRate > (100 - APPROVAL_THRESHOLD)) {
            request.status = RequestStatus.Rejected;
            emit RequestRejected(_requestId, block.timestamp);
        }
    }

    // finalize approved request
    function finalizeRequest(uint _requestId) external onlyCreator nonReentrant validRequest(_requestId) {
        Request storage request = requestsMap[_requestId];
        
        require(request.status == RequestStatus.Approved, "Request not approved");
        require(address(this).balance >= request.value, "Insufficient funds");

        // transfer the fund
        (bool success, ) = payable(creator).call{value: request.value}("");
        require(success, "Transfer failed");

        request.status = RequestStatus.Completed;

        emit FundsReleased(_requestId, creator, request.value);
        emit RequestCompleted(_requestId, request.value, block.timestamp);

        // check and update if the balance is 0 which means the program is completed
        if (address(this).balance == 0) {
            status = ProgramStatus.Completed;
            emit ProgramCompleted(block.timestamp);
        }
    }

    // upload proof of achievement
    function uploadProof(uint _requestId, string memory _evidenceCID) external onlyCreator validRequest(_requestId) {
        Request storage request = requestsMap[_requestId];
        require(request.status == RequestStatus.Completed, "Request not completed");
        
        request.evidenceCID = _evidenceCID;
        emit ProofUploaded(_requestId, _evidenceCID);
    }

    // cancel program
    function cancelProgram() external onlyCreator nonReentrant {
        require(status == ProgramStatus.Pending || status == ProgramStatus.Active, "Cannot cancel program");
        
        // if active, ensure no approved request
        if (status == ProgramStatus.Active) {
            for (uint i = 0; i < requestIds.length; i++) {
                require(requestsMap[requestIds[i]].status != RequestStatus.Approved, "Has approved requests");
            }
        }

        uint refundAmount = address(this).balance;
        _processRefunds();
        
        status = ProgramStatus.Cancelled;
        emit ProgramCancelled(block.timestamp, refundAmount);
    }

    function _processRefunds() internal {
        emit RefundAvailable(address(this));
    }

    function withdrawRefund() external nonReentrant {
        require(
            status == ProgramStatus.Cancelled || status == ProgramStatus.Expired,
            "Refunds not available"
        );

        uint amount = totalContributions[msg.sender];
        require(amount > 0, "No refund available");

        totalContributions[msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Refund transfer failed");

        emit RefundProcessed(msg.sender, amount);
    }

    // check and update program n requests expiry status
    function updateStatus() external {
        if (block.timestamp >= expiryDate && status == ProgramStatus.Pending) {
            _processRefunds();
            status = ProgramStatus.Expired;
            emit ProgramExpired(block.timestamp);
        }

        for (uint i = 0; i < requestIds.length; i++) {
            uint requestId = requestIds[i];
            isRequestExpired(requestId);
        }
    }

    // check n update request expiry
    function isRequestExpired(uint _requestId) public validRequest(_requestId) returns (bool) {
        Request storage request = requestsMap[_requestId];
        if (request.status == RequestStatus.Pending && block.timestamp < request.votingDeadline) {
            return false;
        }

        request.status = RequestStatus.Expired;
        emit RequestExpired(_requestId, block.timestamp);
        return true;
    }

    // emergency functions
    function pause() external onlyCreator {
        _pause();
    }

    function unpause() external onlyCreator {
        _unpause();
    }

    // getters
    function getRequest(uint _requestId) external view validRequest(_requestId) returns (Request memory) {
        Request storage request = requestsMap[_requestId];
        return Request({
            id: request.id,
            title: request.title,
            description: request.description,
            value: request.value,
            evidenceCID: request.evidenceCID,
            approvalCount: request.approvalCount,
            rejectCount: request.rejectCount,
            status: request.status,
            createdAt: request.createdAt,
            votingDeadline: request.votingDeadline
        });
    }

    function getAllRequests() external view returns (Request[] memory) {
        Request[] memory allRequests = new Request[](requestIds.length);
        
        for (uint i = 0; i < requestIds.length; i++) {
            Request storage request = requestsMap[requestIds[i]];
            allRequests[i] = Request({
                id: request.id,
                title: request.title,
                description: request.description,
                value: request.value,
                evidenceCID: request.evidenceCID,
                approvalCount: request.approvalCount,
                rejectCount: request.rejectCount,
                status: request.status,
                createdAt: request.createdAt,
                votingDeadline: request.votingDeadline
            });
        }
        
        return allRequests;
    }

    function getContributions() external view returns (Contribution[] memory) {
        return contributions;
    }

    function getContributors() public view returns (address[] memory) {
        return contributors;
    }

    function getVote(uint _requestId, address _voter) external view validRequest(_requestId) returns (Vote) {
        return votesByRequest[_requestId][_voter];
    }

    function getProgramInfo() external view returns (
        string memory _title,
        string memory _description,
        string memory _mediaCID,
        address _creator,
        uint _goal,
        uint _balance,
        ProgramStatus _status,
        uint _approversCount,
        uint _createdAt,
        uint _expiryDate
    ) {
        return (
            title,
            description,
            mediaCID,
            creator,
            goal,
            address(this).balance,
            status,
            approversCount,
            createdAt,
            expiryDate
        );
    }

    function isApprover(address _address) external view returns (bool) {
        return approvers[_address];
    }

    // receive function
    receive() external payable {
        revert("Use contribute() function");
    }

    fallback() external payable {
        revert("Function not found");
    }
}