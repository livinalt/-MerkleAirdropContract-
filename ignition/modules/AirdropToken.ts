import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AirdropTokenModule = buildModule("AirdropTokenModule", (m) => {

  const airdropToken = m.contract("AirdropToken", []);

  return { airdropToken };

});

export default AirdropTokenModule;

// 0x82e37C9EF01179a74c0288cFC74F9614BCB43b57

