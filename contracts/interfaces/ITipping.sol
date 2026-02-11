// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ITipping {
    event TipSent(
        address indexed tipper,
        address indexed creator,
        address indexed token,
        uint256 amount,
        string message,
        uint256 timestamp
    );

    event Withdrawal(
        address indexed creator,
        address indexed token,
        uint256 amount,
        uint256 timestamp
    );

    function tip(
        address creator,
        address token,
        uint256 amount,
        string memory message
    ) external payable;

    function withdraw(address token, uint256 amount) external;

    function getTipsReceived(address creator) external view returns (uint256);

    function getTipsSent(address tipper) external view returns (uint256);

    function getCreatorTotalTips(address creator, address token) external view returns (uint256);

    function getRecentTips(address creator, uint256 limit) external view returns (Tip[] memory);
    
    function getTipCount(address creator) external view returns (uint256);

    struct Tip {
        address tipper;
        address creator;
        address token;
        uint256 amount;
        string message;
        uint256 timestamp;
    }
}