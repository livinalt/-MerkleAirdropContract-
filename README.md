# Merkle Airdrop Project

## Overview

This project is a **Merkle Airdrop** smart contract built on the Ethereum blockchain that allows for distributing tokens using a **Merkle Tree** structure. It ensures that only verified users, based on Merkle Proofs, can claim airdropped tokens. The project also includes an **Airdrop Token** contract, which mints and manages the tokens for distribution.

## Contracts

1. **MerkleAirdrop.sol**:
   - Handles the distribution of tokens via a Merkle Tree.
   - Verifies users' eligibility to claim tokens using Merkle Proofs.
   - Allows the owner to update the Merkle Root and withdraw unclaimed tokens.

2. **AirdropToken.sol**:
   - Implements a custom ERC20 token for the airdrop.
   - Allows minting of tokens, subject to a maximum total supply.
   - Standard ERC20 functionality for transfers, approvals, and withdrawals.

## Features

### Merkle Airdrop Contract

- **Airdrop Claiming**: Users can claim tokens if they are part of the Merkle Tree and provide a valid proof.
- **Merkle Root Update**: The contract owner can update the Merkle Root to refresh the list of eligible users.
- **Qualification Check**: Users can check if they are qualified for the airdrop without claiming it.
- **Owner-Only Token Withdrawal**: The contract owner can withdraw unclaimed tokens.
- **NFT Holders Exclusion**: Users holding a specific NFT (e.g., BAYC) are excluded from claiming the airdrop.

### Airdrop Token Contract

- **Custom ERC20 Token**: The token used for the airdrop is created using the OpenZeppelin ERC20 standard.
- **Minting**: Tokens can be minted up to a predefined maximum supply.
- **Transfer and Approval**: Implements standard ERC20 functions for transferring tokens and setting allowances.

## Prerequisites

- **Solidity Version**: 0.8.0 or above
- **Node.js**: Required to run JavaScript utilities for generating the Merkle Root and proofs.
- **Hardhat**: Used for deploying the contracts.

## Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/livinalt/merkle-airdrop.git
   cd merkle-airdrop
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Compile the contracts**:
   ```bash
   npx hardhat compile
   ```

4. **Deploy the contracts**:
   Update the `MerkleAirdropModule.js` with the correct values and deploy the contracts using Hardhat:
   ```bash
   npx hardhat run scripts/deploy.js --network <network-name>
   ```

## Generating Merkle Root and Proofs

The `merkle.js` script generates the Merkle Root and proofs from a CSV file that contains addresses and amounts for the airdrop.

1. **Prepare the whitelist CSV file**:  
   The CSV file should contain two columns: `address` and `amount`.

2. **Generate the Merkle Root and Proofs**:
   ```bash
   node scripts/merkle.js
   ```
   This script will:
   - Parse the CSV file.
   - Generate leaf nodes using the hash of address and amount.
   - Create a Merkle Tree and output the Merkle Root.
   - Generate proofs for each address and display them.

## Environment Variables

Set up a `.env` file in the root directory with the following variables:

```
RPC_URL=<Your Infura/Alchemy RPC URL>
PRIVATE_KEY=<Your Private Key>
PROOF=<Generated Merkle Proof Array>
```

## Deployment

1. **MerkleAirdrop.sol Deployment**:
   Update the constructor parameters, including the token address, Merkle Root, and proof.

2. **AirdropToken.sol Deployment**:
   Deploy the ERC20 Airdrop Token contract using the provided constructor.

## Usage

### Claim Airdrop

Eligible users can call the `claimAirdrop()` function from their wallet if they meet the following conditions:
- They are part of the Merkle Tree.
- They provide a valid Merkle Proof.
- They don't hold a specific NFT (e.g., BAYC).

### Withdraw Tokens

The owner can withdraw unclaimed tokens from the contract by calling `withdrawTokens()`.

### Check Qualification

Users can check their qualification for the airdrop without claiming by calling the `checkQualification()` function.

## Hardhat Deployment Script

The `MerkleAirdropModule.js` module helps deploy the `MerkleAirdrop` contract. It uses the provided address, Merkle Root, and proof array to deploy the contract on-chain.


## License

This project is licensed under the MIT License.