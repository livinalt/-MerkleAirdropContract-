import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";
import ethers from "ethers";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

describe("MerkleAirdrop", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function MerkleAirdropFixture() {

    const [owner, otherAccount, addr1, addr2] = await hre.ethers.getSigners();
    
    const MerkleRoot = "0xc43cde172a915440a16922c3931d26a8cd626e4380a5436964739aa796ec6dc3";
    const proof = process.env.PROOF ? JSON.parse(process.env.PROOF) : [];
    const baycToken = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D";

    const addresZero = "0x0000000000000000000000000000000000000000";

    const AirdropToken = await hre.ethers.getContractFactory("AirdropToken");
    const airdropToken = await AirdropToken.deploy();

    const MerkleAirdrop = await hre.ethers.getContractFactory("MerkleAirdrop");
    const merkleAirdrop = await MerkleAirdrop.deploy(airdropToken, MerkleRoot, proof);

    return { merkleAirdrop, airdropToken, MerkleRoot, proof, baycToken, addresZero, owner, addr1, addr2, otherAccount };
    
  }

  describe("Deployment", function () {
    it("Should set the AirdropToken", async function () {
      const { owner, merkleAirdrop, airdropToken } = await loadFixture(MerkleAirdropFixture);
      expect(await merkleAirdrop.token()).to.equal(airdropToken);

    });
    
    it("Should set the right owner", async function () {
      const { merkleAirdrop, owner } = await loadFixture(MerkleAirdropFixture);
      expect(await merkleAirdrop.owner()).to.equal(owner.address);
    });
  
    
  it("Should set the right proof", async function () {
      const { proof } = await loadFixture(MerkleAirdropFixture);
      expect(await proof).to.equal(proof);
    });
  
  it("Should set BAYC Address", async function () {
      const { merkleAirdrop, baycToken } = await loadFixture(MerkleAirdropFixture);
      expect(await merkleAirdrop.baycToken()).to.equal(baycToken);
    });
  });

  describe("Claim Air Drop", function () {
    

    it("Check for Address Zero", async function () {

      const{ merkleAirdrop, addresZero} = await loadFixture(MerkleAirdropFixture);
      expect(merkleAirdrop.owner()).not.equal(addresZero).to.be.revertedWith("Invalid Address: Address Zero Detected");
    })

    it("Should set the right proof", async function () {
      const { proof } = await loadFixture(MerkleAirdropFixture);
      expect(await proof).to.equal(proof).to.be.revertedWith("Invalid proof.");
    });
    
    it("Should successfully claim airdrop", async function () {
      const { merkleAirdrop, MerkleRoot, airdropToken, owner, proof } = await loadFixture(MerkleAirdropFixture);

      const BAYC_HOLDER = "0x0942ca171d5d0501106ad2052E3cB5564d04d687";

      const baycHolder =  await ethers.impersonateAccount(BAYC_HOLDER);

      const claimAmount = ethers.parseUnits("10", 18);
      await airdropToken.mint(claimAmount);

      const transferAmount = ethers.parseUnits("2", 18);

      const transferToMerkleAirDrop = await airdropToken.transfer(merkleAirdrop, transferAmount);

    const leaf = ethers.solidityKeccak256(["address", "uint256"], [baycHolder, claimAmount]);
    const proofGenerated = proof.getHexProof(leaf);

    await merkleAirdrop.updateMerkleRoot(MerkleRoot);

    await expect(merkleAirdrop.claimAirdrop())
      .to.emit(merkleAirdrop, "AirdropClaimed")
      .withArgs(baycHolder, claimAmount);

    expect(await merkleAirdrop.claimed(BAYC_HOLDER)).to.equal(true);

    expect(await airdropToken.balanceOf(BAYC_HOLDER)).to.equal(claimAmount);

   

   
  });

  describe("withdrawTokens", function () {

  });

  describe("update merkle root", function () {

  });

  describe("check qualification", function () {

  });
});

});
