import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

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


  describe("Mint AirdropToken", function () {
    it("Should mint 1 * 10^18 tokens", async function () {
      const { owner, airdropToken } = await loadFixture(MerkleAirdropFixture);

      const amount = ethers.parseUnits("1", 18);
      const mintTx = airdropToken.mint(amount);
      await (await mintTx).wait();

      expect(await airdropToken.balanceOf(owner)).to.equal(amount);

    });  
  
    
  it("Should transfer to MerkleAirdrop Contract", async function () {

      const { owner, airdropToken, merkleAirdrop } = await loadFixture(MerkleAirdropFixture);
      const amount = await ethers.parseUnits("1", 18);
      const mintTx = await airdropToken.mint(amount);
    
      await mintTx.wait();

      expect(await airdropToken.balanceOf(owner)).to.equal(amount);

      
      const balance = await airdropToken.balanceOf(owner);

      await airdropToken.allowance(owner, merkleAirdrop);

      await airdropToken.approve(owner, amount);
      
      const transferTx = await airdropToken.transferFrom(owner, merkleAirdrop, balance);
      await transferTx.wait();
      
      expect(await airdropToken.balanceOf(merkleAirdrop)).to.equal(amount);      

    });

  });


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

      const claimAmount = await ethers.parseUnits("1", 18);
      const BAYC_HOLDER = "0x0942ca171d5d0501106ad2052E3cB5564d04d687";

      const baycHolder =  await ethers.impersonateAccount(BAYC_HOLDER);

      await owner.sendTransaction(baycHolder);

      const amount = ethers.parseUnits("10", 18);

      await airdropToken.transfer(merkleAirdrop, claimAmount);

      await merkleAirdrop.connect(baycHolder).claimAirdrop();

      expect(await airdropToken.balanceOf(baycHolder)).to.greaterThanOrEqual(claimAmount);
    });  

   
  });

  describe("withdrawTokens", function () {

  });

  describe("update merkle root", function () {

  });

  describe("check qualification", function () {

  });
});

