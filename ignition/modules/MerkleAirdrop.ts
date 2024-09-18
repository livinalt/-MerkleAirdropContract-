import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MerkleAirdropModule = buildModule("MerkleAirdropModule", (m) => {

  const airdropAddress = "0xd28F5a6dB5EF6597eE7C644999e041E357A27a75";
  const merkleRoot = "0x8741a333ebe4b3abbc7e896be9dbfce9b6e3792e1d0f5594f26b5fe8f3f075c2";

  const merkleAirdrop = m.contract("MerkleAirdrop", [airdropAddress, merkleRoot]);

  return { merkleAirdrop };
});

export default MerkleAirdropModule;

