import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MerkleAirdropModule = buildModule("MerkleAirdropModule", (m) => {

  const airdropAddress = "0x82e37C9EF01179a74c0288cFC74F9614BCB43b57";
  const merkleRoot = "0xc43cde172a915440a16922c3931d26a8cd626e4380a5436964739aa796ec6dc3";
  const proof = process.env.PROOF ? JSON.parse(process.env.PROOF) : [];

  const merkleAirdrop = m.contract("MerkleAirdrop", [airdropAddress, merkleRoot, proof]);

  return { merkleAirdrop };
});

export default MerkleAirdropModule;


// merkleAirdrop Address = 0x5B19f4E2CF4A4437c540420bF8D33142b726FA6d;

// alternatively the proof can be used directly

/* 
PROOF='[
  "0x5166c89cd5dbd210778b7c123468313327392b767cd601922a3c185ae5182b9f",
  "0xb2d05d6e55d527394c62b4dd078bfc775adb3d145ec9bc568f6b282874dbdb16"
]'
 */