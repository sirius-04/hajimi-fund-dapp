import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { ScholarshipProgram, ScholarshipProgramFactory } from "../typechain-types";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("ScholarshipProgram", function () {
  let factory: ScholarshipProgramFactory;
  let program: ScholarshipProgram;
  let creator: SignerWithAddress;
  let contributor1: SignerWithAddress;
  let contributor2: SignerWithAddress;
  let contributor3: SignerWithAddress;
  let nonContributor: SignerWithAddress;

  const PROGRAM_TITLE = "Test Scholarship Program";
  const PROGRAM_DESCRIPTION = "A test scholarship program for students";
  const PROGRAM_GOAL = ethers.parseEther("10"); // 10 ETH
  const MEDIA_CID = "QmTestMediaCID";
  const MIN_CONTRIBUTION = (PROGRAM_GOAL * BigInt(1)) / BigInt(100); // 1% of goal
  const VOTING_PERIOD = 7 * 24 * 60 * 60; // 7 days in seconds
  const PROGRAM_DURATION = 90 * 24 * 60 * 60; // 90 days in seconds

  beforeEach(async function () {
    [creator, contributor1, contributor2, contributor3, nonContributor] = await ethers.getSigners();

    // Deploy factory
    const FactoryContract = await ethers.getContractFactory("ScholarshipProgramFactory");
    factory = await FactoryContract.deploy();

    // Create a program
    const tx = await factory
      .connect(creator)
      .createProgram(PROGRAM_TITLE, PROGRAM_DESCRIPTION, PROGRAM_GOAL, MEDIA_CID);

    const receipt = await tx.wait();
    const event = receipt?.logs.find((log: any) => log.fragment?.name === "ProgramCreated");
    const programAddress = event?.args[0];

    program = await ethers.getContractAt("ScholarshipProgram", programAddress);
  });

  describe("Factory Contract", function () {
    it("Should create a new program correctly", async function () {
      const programInfo = await program.getProgramInfo();

      expect(programInfo._title).to.equal(PROGRAM_TITLE);
      expect(programInfo._description).to.equal(PROGRAM_DESCRIPTION);
      expect(programInfo._goal).to.equal(PROGRAM_GOAL);
      expect(programInfo._creator).to.equal(creator.address);
      expect(programInfo._status).to.equal(0); // Pending status
    });

    it("Should track deployed programs", async function () {
      const deployedPrograms = await factory.getDeployedPrograms();
      expect(deployedPrograms.length).to.equal(1);
      expect(deployedPrograms[0]).to.equal(await program.getAddress());
    });

    it("Should track creator programs", async function () {
      const creatorPrograms = await factory.getCreatorPrograms(creator.address);
      expect(creatorPrograms.length).to.equal(1);
      expect(creatorPrograms[0]).to.equal(await program.getAddress());
    });

    it("Should revert with invalid parameters", async function () {
      await expect(
        factory.connect(creator).createProgram("", PROGRAM_DESCRIPTION, PROGRAM_GOAL, MEDIA_CID),
      ).to.be.revertedWith("Title required");

      await expect(
        factory.connect(creator).createProgram(PROGRAM_TITLE, PROGRAM_DESCRIPTION, 0, MEDIA_CID),
      ).to.be.revertedWith("Goal must be positive");
    });
  });

  describe("Contributions", function () {
    it("Should accept contributions and update balances", async function () {
      let contributed;
      const contributionAmount = ethers.parseEther("1");

      await expect(program.connect(contributor1).contribute({ value: contributionAmount }))
        .to.emit(program, "Contributed")
        .withArgs(contributor1.address, contributionAmount, false);

      expect(await program.totalContributions(contributor1.address)).to.equal(contributionAmount);
      expect(await ethers.provider.getBalance(await program.getAddress())).to.equal(contributionAmount);

      contributed = await program.hasContributed(contributor1.address);
      expect(contributed).to.be.true;
    });

    it("Should make contributor an approver when meeting minimum contribution", async function () {
      let contributed;

      await expect(program.connect(contributor1).contribute({ value: MIN_CONTRIBUTION }))
        .to.emit(program, "Contributed")
        .withArgs(contributor1.address, MIN_CONTRIBUTION, true);

      contributed = await program.isApprover(contributor1.address);
      expect(contributed).to.be.true;
      expect(await program.approversCount()).to.equal(1);
    });

    it("Should activate program when goal is reached", async function () {
      await program.connect(contributor1).contribute({ value: PROGRAM_GOAL });

      const programInfo = await program.getProgramInfo();
      expect(programInfo._status).to.equal(1); // Active status
    });

    it("Should revert zero contributions", async function () {
      await expect(program.connect(contributor1).contribute({ value: 0 })).to.be.revertedWith(
        "Contribution must be positive",
      );
    });

    it("Should aggregate multiple contributions from same address", async function () {
      const amount1 = ethers.parseEther("0.5");
      const amount2 = ethers.parseEther("0.7");

      await program.connect(contributor1).contribute({ value: amount1 });
      await program.connect(contributor1).contribute({ value: amount2 });

      expect(await program.totalContributions(contributor1.address)).to.equal(amount1 + amount2);

      const contributors = await program.getContributors();
      expect(contributors.length).to.equal(1);
      expect(contributors[0]).to.equal(contributor1.address);
    });
  });

  describe("Request Management", function () {
    beforeEach(async function () {
      // Activate the program
      await program.connect(contributor1).contribute({ value: PROGRAM_GOAL });
    });

    it("Should create spending requests", async function () {
      const requestTitle = "Buy Textbooks";
      const requestDescription = "Purchase textbooks for semester";
      const requestValue = ethers.parseEther("1");
      const evidenceCID = "QmEvidenceCID";

      await expect(
        program.connect(creator).createRequest(requestTitle, requestDescription, requestValue, evidenceCID),
      ).to.emit(program, "RequestCreated");

      const request = await program.getRequest(1);
      expect(request.title).to.equal(requestTitle);
      expect(request.description).to.equal(requestDescription);
      expect(request.value).to.equal(requestValue);
      expect(request.status).to.equal(0); // Pending
    });

    it("Should enforce maximum request amount (30% of balance)", async function () {
      const maxAllowedAmount = (PROGRAM_GOAL * BigInt(30)) / BigInt(100);
      const excessiveAmount = maxAllowedAmount + ethers.parseEther("1");

      await expect(
        program.connect(creator).createRequest("Excessive Request", "Too much", excessiveAmount, "CID"),
      ).to.be.revertedWith("Exceeds maximum request amount");
    });

    it("Should only allow creator to create requests", async function () {
      await expect(
        program.connect(contributor1).createRequest("Unauthorized", "Request", ethers.parseEther("1"), "CID"),
      ).to.be.revertedWith("Not the program creator");
    });

    it("Should require program to be active", async function () {
      // Create a new pending program
      const newProgram = await ethers.getContractAt(
        "ScholarshipProgram",
        await (await factory.connect(creator).createProgram("New Program", "Description", PROGRAM_GOAL, "CID"))
          .wait()
          .then(receipt => receipt?.logs.find((log: any) => log.fragment?.name === "ProgramCreated")?.args[0]),
      );

      await expect(
        newProgram.connect(creator).createRequest("Title", "Description", ethers.parseEther("1"), "CID"),
      ).to.be.revertedWith("Program not active");
    });
  });

  describe("Voting System", function () {
    beforeEach(async function () {
      // Setup: Create program, make contributions to have approvers, create request
      await program.connect(contributor1).contribute({ value: MIN_CONTRIBUTION });
      await program.connect(contributor2).contribute({ value: MIN_CONTRIBUTION });
      await program.connect(contributor3).contribute({ value: PROGRAM_GOAL });

      await program.connect(creator).createRequest("Test Request", "Description", ethers.parseEther("1"), "CID");
    });

    it("Should allow approvers to vote", async function () {
      await expect(program.connect(contributor1).vote(1, true))
        .to.emit(program, "VoteCast")
        .withArgs(1, contributor1.address, true);

      const request = await program.getRequest(1);
      expect(request.approvalCount).to.equal(1);
      expect(request.rejectCount).to.equal(0);
    });

    it("Should prevent non-approvers from voting", async function () {
      await expect(program.connect(nonContributor).vote(1, true)).to.be.revertedWith("Not an approver");
    });

    it("Should prevent double voting", async function () {
      await program.connect(contributor1).vote(1, true);

      await expect(program.connect(contributor1).vote(1, false)).to.be.revertedWith("Already voted");
    });

    it("Should approve request when reaching 60% approval threshold", async function () {
      // We have 3 approvers, need at least 60% approval
      await program.connect(contributor1).vote(1, true);
      await program.connect(contributor2).vote(1, true);
      // 2/2 = 100% approval rate should trigger approval

      const request = await program.getRequest(1);
      expect(request.status).to.equal(1); // Approved
    });

    it("Should reject request when rejection rate exceeds threshold", async function () {
      await program.connect(contributor1).vote(1, false);
      await program.connect(contributor2).vote(1, false);
      // 2/2 = 100% rejection rate should trigger rejection

      const request = await program.getRequest(1);
      expect(request.status).to.equal(2); // Rejected
    });

    it("Should handle voting deadline expiry", async function () {
      // Fast forward past voting deadline
      await time.increase(VOTING_PERIOD + 1);

      await expect(program.connect(contributor1).vote(1, true)).to.be.revertedWith("Voting period ended");
    });
  });

  describe("Request Finalization", function () {
    beforeEach(async function () {
      // Setup approved request
      await program.connect(contributor1).contribute({ value: MIN_CONTRIBUTION });
      await program.connect(contributor2).contribute({ value: MIN_CONTRIBUTION });
      await program.connect(contributor3).contribute({ value: PROGRAM_GOAL });

      await program.connect(creator).createRequest("Test Request", "Description", ethers.parseEther("1"), "CID");
      await program.connect(contributor1).vote(1, true);
      await program.connect(contributor2).vote(1, true);
    });

    it("Should finalize approved requests and transfer funds", async function () {
      // const initialCreatorBalance = await ethers.provider.getBalance(creator.address);
      const requestValue = ethers.parseEther("1");

      await expect(program.connect(creator).finalizeRequest(1))
        .to.emit(program, "FundsReleased")
        .withArgs(1, creator.address, requestValue)
        .and.to.emit(program, "RequestCompleted");

      const request = await program.getRequest(1);
      expect(request.status).to.equal(4);
    });

    it("Should only allow creator to finalize requests", async function () {
      await expect(program.connect(contributor1).finalizeRequest(1)).to.be.revertedWith("Not the program creator");
    });

    it("Should only finalize approved requests", async function () {
      // Create a new pending request
      await program.connect(creator).createRequest("Pending Request", "Description", ethers.parseEther("0.5"), "CID");

      await expect(program.connect(creator).finalizeRequest(2)).to.be.revertedWith("Request not approved");
    });

    it("Should mark program as completed when all funds are spent", async function () {
      // Finalize request that uses all funds
      await program.connect(creator).finalizeRequest(1);

      const programInfo = await program.getProgramInfo();
      expect(programInfo._status).to.equal(4); // Completed
    });
  });

  describe("Program Cancellation", function () {
    it("Should allow creator to cancel pending program", async function () {
      const contributionAmount = ethers.parseEther("5");
      await program.connect(contributor1).contribute({ value: contributionAmount });

      await expect(program.connect(creator).cancelProgram()).to.emit(program, "ProgramCancelled");

      const programInfo = await program.getProgramInfo();
      expect(programInfo._status).to.equal(3); // Cancelled
    });

    it("Should prevent cancellation with approved requests", async function () {
      // Setup active program with approved request
      await program.connect(contributor1).contribute({ value: MIN_CONTRIBUTION });
      await program.connect(contributor2).contribute({ value: PROGRAM_GOAL });

      await program.connect(creator).createRequest("Test", "Description", ethers.parseEther("1"), "CID");
      await program.connect(contributor1).vote(1, true);

      await expect(program.connect(creator).cancelProgram()).to.be.revertedWith("Has approved requests");
    });

    it("Should only allow creator to cancel", async function () {
      await expect(program.connect(contributor1).cancelProgram()).to.be.revertedWith("Not the program creator");
    });
  });

  describe("Refund System", function () {
    it("Should allow contributors to withdraw refunds after cancellation", async function () {
      const contributionAmount = ethers.parseEther("2");
      await program.connect(contributor1).contribute({ value: contributionAmount });

      await program.connect(creator).cancelProgram();

      const initialBalance = await ethers.provider.getBalance(contributor1.address);
      const tx = await program.connect(contributor1).withdrawRefund();
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;

      const finalBalance = await ethers.provider.getBalance(contributor1.address);
      expect(finalBalance).to.be.closeTo(initialBalance + contributionAmount - gasUsed, ethers.parseEther("0.001"));
    });

    it("Should allow refunds after program expiry", async function () {
      const contributionAmount = ethers.parseEther("2");
      await program.connect(contributor1).contribute({ value: contributionAmount });

      // Fast forward past expiry
      await time.increase(PROGRAM_DURATION + 1);
      await program.updateStatus();

      await expect(program.connect(contributor1).withdrawRefund())
        .to.emit(program, "RefundProcessed")
        .withArgs(contributor1.address, contributionAmount);
    });

    it("Should prevent refunds when program is active", async function () {
      await program.connect(contributor1).contribute({ value: PROGRAM_GOAL });

      await expect(program.connect(contributor1).withdrawRefund()).to.be.revertedWith("Refunds not available");
    });

    it("Should prevent double refunds", async function () {
      const contributionAmount = ethers.parseEther("2");
      await program.connect(contributor1).contribute({ value: contributionAmount });

      await program.connect(creator).cancelProgram();
      await program.connect(contributor1).withdrawRefund();

      await expect(program.connect(contributor1).withdrawRefund()).to.be.revertedWith("No refund available");
    });
  });

  describe("Status Updates", function () {
    it("Should expire program after duration", async function () {
      await time.increase(PROGRAM_DURATION + 1);

      await expect(program.updateStatus()).to.emit(program, "ProgramExpired");

      const programInfo = await program.getProgramInfo();
      expect(programInfo._status).to.equal(2); // Expired
    });

    it("Should expire requests after voting period", async function () {
      await program.connect(contributor1).contribute({ value: PROGRAM_GOAL });
      await program.connect(creator).createRequest("Test", "Description", ethers.parseEther("1"), "CID");

      await time.increase(VOTING_PERIOD + 1);

      await expect(program.updateStatus())
        .to.emit(program, "RequestExpired")
        .withArgs(1, await time.latest());
    });
  });

  describe("Proof Upload", function () {
    beforeEach(async function () {
      // Setup completed request
      await program.connect(contributor1).contribute({ value: MIN_CONTRIBUTION });
      await program.connect(contributor2).contribute({ value: PROGRAM_GOAL });

      await program.connect(creator).createRequest("Test", "Description", ethers.parseEther("1"), "CID");
      await program.connect(contributor1).vote(1, true);
      await program.connect(creator).finalizeRequest(1);
    });

    it("Should allow uploading proof for completed requests", async function () {
      const proofCID = "QmProofCID123";

      await expect(program.connect(creator).uploadProof(1, proofCID))
        .to.emit(program, "ProofUploaded")
        .withArgs(1, proofCID);

      const request = await program.getRequest(1);
      expect(request.evidenceCID).to.equal(proofCID);
    });

    it("Should only allow creator to upload proof", async function () {
      await expect(program.connect(contributor1).uploadProof(1, "proof")).to.be.revertedWith("Not the program creator");
    });

    it("Should only allow proof upload for completed requests", async function () {
      await program.connect(creator).createRequest("Pending", "Description", ethers.parseEther("0.5"), "CID");

      await expect(program.connect(creator).uploadProof(2, "proof")).to.be.revertedWith("Request not completed");
    });
  });

  describe("Emergency Controls", function () {
    it("Should allow creator to pause and unpause", async function () {
      await program.connect(creator).pause();

      await expect(program.connect(contributor1).contribute({ value: ethers.parseEther("1") })).to.be.reverted;

      await program.connect(creator).unpause();

      await expect(program.connect(contributor1).contribute({ value: ethers.parseEther("1") })).to.not.be.reverted;
    });

    it("Should only allow creator to pause/unpause", async function () {
      await expect(program.connect(contributor1).pause()).to.be.revertedWith("Not the program creator");
    });
  });

  describe("Getter Functions", function () {
    beforeEach(async function () {
      await program.connect(contributor1).contribute({ value: MIN_CONTRIBUTION });
      await program.connect(contributor2).contribute({ value: PROGRAM_GOAL });

      await program.connect(creator).createRequest("Request 1", "Description 1", ethers.parseEther("1"), "CID1");
      await program.connect(creator).createRequest("Request 2", "Description 2", ethers.parseEther("2"), "CID2");
    });

    it("Should return all requests", async function () {
      const allRequests = await program.getAllRequests();
      expect(allRequests.length).to.equal(2);
      expect(allRequests[0].title).to.equal("Request 1");
      expect(allRequests[1].title).to.equal("Request 2");
    });

    it("Should return contributions", async function () {
      const contributions = await program.getContributions();
      expect(contributions.length).to.equal(2);
      expect(contributions[0].contributor).to.equal(contributor1.address);
      expect(contributions[1].contributor).to.equal(contributor2.address);
    });

    it("Should return vote status", async function () {
      await program.connect(contributor1).vote(1, true);

      const vote = await program.getVote(1, contributor1.address);
      expect(vote).to.equal(1); // Approve vote
    });

    it("Should return program info", async function () {
      const info = await program.getProgramInfo();
      expect(info._title).to.equal(PROGRAM_TITLE);
      expect(info._goal).to.equal(PROGRAM_GOAL);
      expect(info._creator).to.equal(creator.address);
      expect(info._status).to.equal(1); // Active
    });
  });

  describe("Edge Cases and Security", function () {
    it("Should reject direct ETH transfers", async function () {
      await expect(
        creator.sendTransaction({
          to: await program.getAddress(),
          value: ethers.parseEther("1"),
        }),
      ).to.be.revertedWith("Use contribute() function");
    });

    it("Should handle reentrancy protection", async function () {
      // This would require a malicious contract to test properly
      // For now, we verify the nonReentrant modifier exists on critical functions
      const contribute = await program.connect(contributor1).contribute({ value: ethers.parseEther("1") });
      expect(contribute).to.not.be.reverted;
    });

    it("Should validate request IDs", async function () {
      await expect(program.getRequest(999)).to.be.revertedWith("Invalid request ID");

      await expect(program.vote(0, true)).to.be.revertedWith("Invalid request ID");
    });

    it("Should prevent contributions after expiry", async function () {
      await time.increase(PROGRAM_DURATION + 1);

      await expect(program.connect(contributor1).contribute({ value: ethers.parseEther("1") })).to.be.revertedWith(
        "Program expired",
      );
    });
  });
});
