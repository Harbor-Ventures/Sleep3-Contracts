// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./StakingToken.sol";

contract SLEPToken is StakingToken {
    constructor() ERC20("Sleep3 Token", "SLEP") StakingToken(msg.sender, 100000000 * 10 ** decimals(), 1929012346) {}
}