// SPDX-License-Identifier: MIT 
import "./ScholarshipProgram.sol";

contract ScholarshipProgramFactory {
    address[] public deployedPrograms;
    mapping(address => address[]) public creatorPrograms;
    
    event ProgramCreated(
        address indexed programAddress,
        address indexed creator,
        string title,
        string description,
        string mediaCID,
        uint goal,
        uint timestamp
    );

    function createProgram(
        string memory _title,
        string memory _description,
        uint _goal,
        string memory _mediaCID
    ) external returns (address) {
        require(_goal > 0, "Goal must be positive");
        require(bytes(_title).length > 0, "Title required");

        ScholarshipProgram newProgram = new ScholarshipProgram(
            _title,
            _description,
            _goal,
            _mediaCID,
            msg.sender
        );

        address programAddress = address(newProgram);
        deployedPrograms.push(programAddress);
        creatorPrograms[msg.sender].push(programAddress);

        emit ProgramCreated(
            programAddress,
            msg.sender,
            _title,
            _description,
            _mediaCID,
            _goal,
            block.timestamp
        );

        return programAddress;
    }

    function getDeployedPrograms() external view returns (address[] memory) {
        return deployedPrograms;
    }

    function getCreatorPrograms(address _creator) external view returns (address[] memory) {
        return creatorPrograms[_creator];
    }

    function getProgramCount() external view returns (uint) {
        return deployedPrograms.length;
    }
}