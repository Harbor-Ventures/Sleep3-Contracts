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

    mapping(address => uint256) internal sleepiness;

    address private slepTokenAddress;
    uint256 private rewardAmount = 100;

    bool sleepinessEnabled = true;
    uint256 sleepinessTime = 60*60*12; // Half a day
    uint256 sleepinessResetCost = 100 * 10 ** 18; // 100 SLEP

    bool thresholdEnabled = false;
    uint256 threshold = 60*60; // 1 hour

    mapping(address => Alarm) internal alarms;

    constructor(address _tokenAddress) {
        slepTokenAddress = _tokenAddress;
    }

    function setAlarm (uint256 tokenAmount, uint256 nftId, uint256 endAt) public {
        require(alarms[msg.sender].active == false, "You already have an alarm set");
        require(block.timestamp < endAt, "You cannot set alarm in the past");
        require(tokenAmount > 0, "Token amount must be greater than 0");

        require(sleepiness[msg.sender] + sleepinessTime < block.timestamp, "Not enough sleepiness!");

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

        sleepiness[msg.sender] = endAt;
    }

    function stop() public {
        require(alarms[msg.sender].active == true, "You do not have an alarm set");
        require(thresholdEnabled == false || block.timestamp >= alarms[msg.sender].endAt - threshold, "You cannot wake up more than one hour before the alarm");

        if (alarms[msg.sender].endAt > block.timestamp) {
            require(IERC20(slepTokenAddress).transfer(msg.sender, alarms[msg.sender].tokensOffered + alarms[msg.sender].rewardAmount), "Cannot Transfer Token from Alarm Clock");
        }

        alarms[msg.sender].active = false;
        delete alarms[msg.sender];

        sleepiness[msg.sender] = block.timestamp;
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

    function setSleepinessTime(uint256 _time) public onlyOwner {
        sleepinessTime = _time;
    }

    function setSleepinessCost(uint256 _cost) public onlyOwner {
        sleepinessResetCost = _cost;
    }

    function resetSleepiness() public {
        require(IERC20(slepTokenAddress).transferFrom(msg.sender, owner(), sleepinessResetCost), "Could not pay to reset sleepiness");

        sleepiness[msg.sender] = 0;
    }

    function rescue(uint256 amount) public onlyOwner {
        require(IERC20(slepTokenAddress).transfer(msg.sender, amount), "Cannot Transfer Token from Alarm Clock");
    }
}