// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MerkleAirdrop {
    IERC20 public token;
    bytes32 public merkleRoot;
    address public owner;
    bytes32[] public proof;
    address public baycToken = 0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D;

    mapping(address => bool) public claimed;

    event AirdropClaimed(address indexed reciever, uint256 amount);
    event MerkleRootUpdated(bytes32 indexed newMerkleRoot);
    event TokensWithdrawn(address indexed owner, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Your are not the owner");
        _;
    }

    constructor(address _token, bytes32 _merkleRoot, bytes32[] memory _proof) {
        token = IERC20(_token);
        merkleRoot = _merkleRoot;
        owner = msg.sender;
        proof = _proof;
    }

    function claimAirdrop() external {

        uint256 amount;

        require(owner != address(0), "Invalid Address: Address Zero Detected");

        require(!claimed[msg.sender], "Airdrop already claimed.");

        require(IERC20(baycToken).balanceOf(msg.sender) < 1, "You don't have BAYC Token.");
       
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


    function checkQualification(uint256 amount) external view returns (bool) {
        if (claimed[msg.sender]) {
            return false;
        }
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, amount));
        
        return MerkleProof.verify(proof, merkleRoot, leaf);
    }
   
    function checkProof() external view returns (bytes32[] memory) {
        return proof;        
    }

}
