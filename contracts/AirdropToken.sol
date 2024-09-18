// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

contract AirdropToken is ERC20, IERC20, IERC20Metadata {

    address public owner;

    uint256 public constant maxTotalSupply = 50000000 * 10 ** 18;

    constructor() ERC20("Airdrop Token", "ADT") {
        owner = msg.sender;
    }

    function mint(uint256 _amount) public {
        require(totalSupply() + _amount <= maxTotalSupply, "Exceeds maximum supply");
        _mint(msg.sender, _amount);
    }

    function transfer(address to, uint256 amount) public override returns (bool) {
        return super.transfer(to, amount);
    }

    function approve(address spender, uint256 amount) public override returns (bool) {
        return super.approve(spender, amount);
    }

    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        return super.transferFrom(from, to, amount);
    }

    function allowance(address owner, address spender) public view override returns (uint256) {
        return super.allowance(owner, spender);
    }

    function name() public view override returns (string memory) {
        return super.name();
    }

    function symbol() public view override returns (string memory) {
        return super.symbol();
    }

    function decimals() public view override returns (uint8) {
        return super.decimals();
    }

    function withdrawTokens(IERC20 _token, uint256 amount) external {
        require(msg.sender == owner, "Only the owner can withdraw");
        require(_token.transfer(owner, amount), "Transfer failed");
    }
}
