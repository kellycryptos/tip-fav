// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ITipping.sol";

contract TippingContract is ITipping, Ownable {
    using SafeERC20 for IERC20;

    // Mapping to track total tips received by creator
    mapping(address => uint256) public tipsReceived;
    
    // Mapping to track total tips sent by tipper
    mapping(address => uint256) public tipsSent;
    
    // Mapping to track total tips per token per creator
    mapping(address => mapping(address => uint256)) public creatorTokenTips;
    
    // Mapping to store tips for each creator
    mapping(address => Tip[]) public creatorTips;
    
    // Mapping to prevent reentrancy
    mapping(address => bool) private _locked;
    
    // Constants
    address public constant ETH_ADDRESS = address(0);
    uint256 public constant MAX_MESSAGE_LENGTH = 280;
    uint256 public constant MAX_RECENT_TIPS = 50;
    
    // Events
    event ContractFunded(address indexed funder, uint256 amount);
    event EmergencyWithdrawal(address indexed owner, uint256 amount);
    
    modifier nonReentrant() {
        require(!_locked[msg.sender], "Reentrant call");
        _locked[msg.sender] = true;
        _;
        _locked[msg.sender] = false;
    }
    
    modifier validAddress(address addr) {
        require(addr != address(0), "Invalid address");
        _;
    }
    
    modifier validMessage(string memory message) {
        require(bytes(message).length <= MAX_MESSAGE_LENGTH, "Message too long");
        _;
    }
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @notice Tip a creator with ETH or ERC20 tokens
     * @param creator The address of the creator to tip
     * @param token The token address (0x0 for ETH)
     * @param amount The amount to tip
     * @param message Optional message with the tip
     */
    function tip(
        address creator,
        address token,
        uint256 amount,
        string memory message
    ) 
        external 
        payable 
        nonReentrant 
        validAddress(creator)
        validAddress(token)
        validMessage(message)
    {
        require(amount > 0, "Amount must be greater than 0");
        require(creator != msg.sender, "Cannot tip yourself");
        
        uint256 tipAmount = amount;
        
        if (token == ETH_ADDRESS) {
            // ETH tip
            require(msg.value == amount, "Incorrect ETH value sent");
        } else {
            // ERC20 tip
            require(msg.value == 0, "No ETH should be sent for ERC20 tips");
            IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        }
        
        // Update balances
        tipsReceived[creator] += tipAmount;
        tipsSent[msg.sender] += tipAmount;
        creatorTokenTips[creator][token] += tipAmount;
        
        // Store tip record
        creatorTips[creator].push(Tip({
            tipper: msg.sender,
            creator: creator,
            token: token,
            amount: tipAmount,
            message: message,
            timestamp: block.timestamp
        }));
        
        // Emit events
        emit TipSent(msg.sender, creator, token, tipAmount, message, block.timestamp);
    }
    
    /**
     * @notice Withdraw accumulated tips
     * @param token The token to withdraw (0x0 for ETH)
     * @param amount The amount to withdraw
     */
    function withdraw(address token, uint256 amount) 
        external 
        nonReentrant
        validAddress(token)
    {
        require(amount > 0, "Amount must be greater than 0");
        require(creatorTokenTips[msg.sender][token] >= amount, "Insufficient balance");
        
        creatorTokenTips[msg.sender][token] -= amount;
        
        if (token == ETH_ADDRESS) {
            (bool success, ) = msg.sender.call{value: amount}("");
            require(success, "ETH transfer failed");
        } else {
            IERC20(token).safeTransfer(msg.sender, amount);
        }
        
        emit Withdrawal(msg.sender, token, amount, block.timestamp);
    }
    
    /**
     * @notice Get total tips received by a creator
     */
    function getTipsReceived(address creator) 
        external 
        view 
        validAddress(creator) 
        returns (uint256) 
    {
        return tipsReceived[creator];
    }
    
    /**
     * @notice Get total tips sent by a tipper
     */
    function getTipsSent(address tipper) 
        external 
        view 
        validAddress(tipper) 
        returns (uint256) 
    {
        return tipsSent[tipper];
    }
    
    /**
     * @notice Get total tips for a specific creator and token
     */
    function getCreatorTotalTips(address creator, address token) 
        external 
        view 
        validAddress(creator) 
        validAddress(token) 
        returns (uint256) 
    {
        return creatorTokenTips[creator][token];
    }
    
    /**
     * @notice Get recent tips for a creator
     */
    function getRecentTips(address creator, uint256 limit) 
        external 
        view 
        validAddress(creator) 
        returns (Tip[] memory) 
    {
        uint256 tipCount = creatorTips[creator].length;
        uint256 resultLength = tipCount < limit ? tipCount : limit;
        resultLength = resultLength < MAX_RECENT_TIPS ? resultLength : MAX_RECENT_TIPS;
        
        Tip[] memory recentTips = new Tip[](resultLength);
        
        for (uint256 i = 0; i < resultLength; i++) {
            recentTips[i] = creatorTips[creator][tipCount - 1 - i];
        }
        
        return recentTips;
    }
    
    /**
     * @notice Get tip count for a creator
     */
    function getTipCount(address creator) 
        external 
        view 
        validAddress(creator) 
        returns (uint256) 
    {
        return creatorTips[creator].length;
    }
    
    /**
     * @notice Emergency withdrawal by owner (only in case of contract issues)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Emergency ETH transfer failed");
        emit EmergencyWithdrawal(owner(), balance);
    }
    
    /**
     * @notice Fund the contract (for gas purposes or future features)
     */
    function fund() external payable {
        require(msg.value > 0, "Must send ETH to fund");
        emit ContractFunded(msg.sender, msg.value);
    }
    
    /**
     * @notice Get contract ETH balance
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @notice Get contract ERC20 balance
     */
    function getContractTokenBalance(address token) external view validAddress(token) returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }
    
    // Allow receiving ETH
    receive() external payable {}
}