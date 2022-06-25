// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AlarmClock is Ownable {

    struct Alarm {
        bool active;
        uint256 tokensOffered;
        uint256 rewardAmount;
        uint256 nftId;
        uint256 createdAt;
        uint256 endAt;
    }

    address private slepTokenAddress;
    uint256 private rewardAmount = 100;

    bool thresholdEnabled = false;
    uint256 threshold = 60*60; // 1 hour

    mapping(address => Alarm) internal alarms;

    function setAlarm (uint256 tokenAmount, uint256 nftId, uint256 endAt) public {
        require(alarms[msg.sender].active == false, "You already have an alarm set");
        require(block.timestamp < endAt, "You cannot set alarm in the past");
        require(tokenAmount > 0, "Token amount must be greater than 0");

        require(IERC20(slepTokenAddress).transferFrom(msg.sender, address(this), tokenAmount), "Cannot Transfer Token from User");

        uint256 reward = ((tokenAmount * 1000) - (tokenAmount * (1000 - rewardAmount))) / 1000;

        Alarm memory alarm = Alarm(
            true,
            tokenAmount,
            reward,
            nftId,
            block.timestamp,
            endAt
        );

        alarms[msg.sender] = alarm;
    }

    function wakeUp() public {
        require(alarms[msg.sender].active == true, "You do not have an alarm set");
        require(thresholdEnabled == true && block.timestamp >= alarms[msg.sender].endAt - threshold, "You cannot wake up more than one hour before the alarm");

        if (alarms[msg.sender].endAt > block.timestamp) {
            require(IERC20(slepTokenAddress).transfer(msg.sender, alarms[msg.sender].tokensOffered + alarms[msg.sender].rewardAmount), "Cannot Transfer Token from Alarm Clock");
        }

        alarms[msg.sender].active = false;
        delete alarms[msg.sender];
    }

    function getAlarm() public view returns (Alarm memory) {
        return alarms[msg.sender];
    }

    function setRewardAmount(uint256 _rewardAmount) public onlyOwner {
        rewardAmount = _rewardAmount;
    }

    function setThreshold(uint256 _threshold) public onlyOwner {
        threshold = _threshold;
    }

    function setThresholdEnabled(bool _thresholdEnabled) public onlyOwner {
        thresholdEnabled = _thresholdEnabled;
    }

    function setSlepTokenAddress(address tokenAddress) public onlyOwner {
        slepTokenAddress = tokenAddress;
    }

    function rescue(uint256 amount) public onlyOwner {
        require(IERC20(slepTokenAddress).transfer(msg.sender, amount), "Cannot Transfer Token from Alarm Clock");
    }
}