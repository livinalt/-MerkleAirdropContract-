// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MerkleAirdrop {
    IERC20 public token;
    bytes32 public merkleRoot;
    address public owner;
    mapping(address => bool) public claimed;

    event AirdropClaimed(address indexed reciever, uint256 amount);
    event MerkleRootUpdated(bytes32 indexed newMerkleRoot);
    event TokensWithdrawn(address indexed owner, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Your are not the owner");
        _;
    }

    constructor(address _token, bytes32 _merkleRoot) {
        token = IERC20(_token);
        merkleRoot = _merkleRoot;
        owner = msg.sender;
    }

    function claimAirdrop(uint256 amount, bytes32[] calldata proof) external {
        require(!claimed[msg.sender], "Airdrop already claimed.");

        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, amount));

        require(MerkleProof.verify(proof, merkleRoot, leaf), "Invalid proof.");

        claimed[msg.sender] = true;

        require(token.transfer(msg.sender, amount), "Token transfer failed.");

        emit AirdropClaimed(msg.sender, amount);
    }


    function withdrawTokens(uint256 amount) external onlyOwner {
        require(token.transfer(owner, amount), "Token transfer failed.");
        emit TokensWithdrawn(owner, amount);
    }


     function updateMerkleRoot(bytes32 _newMerkleRoot) external onlyOwner {
        merkleRoot = _newMerkleRoot;
        emit MerkleRootUpdated(_newMerkleRoot);
    }


    function checkQualification(uint256 amount, bytes32[] calldata proof) external view returns (bool) {
        if (claimed[msg.sender]) {
            return false;
        }
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, amount));
        return MerkleProof.verify(proof, merkleRoot, leaf);
    }

}
