// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "./interfaces/ITipping.sol";

/**
 * @title TippingContract
 * @author TIP FAV Team
 * @notice Gas-optimized contract for ETH and ERC20 tipping on Base network
 * @dev No owner, no admin functions for security
 */
contract TippingContract is ITipping {
    using SafeERC20 for IERC20;

    // Storage mappings
    mapping(address => uint256) public override tipsReceived;
    mapping(address => uint256) public override tipsSent;
    mapping(address => mapping(address => uint256)) public override creatorTokenTips;
    mapping(address => Tip[]) public override creatorTips;
    
    // Prevent reentrancy
    mapping(address => bool) private _locked;
    
    // Constants
    address private constant ETH_ADDRESS = address(0);
    uint256 private constant MAX_MESSAGE_LENGTH = 280;
    uint256 private constant MAX_RECENT_TIPS = 50;
    
    // Events
    event ContractFunded(address indexed funder, uint256 amount);
    
    /**
     * @dev Prevents reentrant calls to functions
     */
    modifier nonReentrant() {
        require(!_locked[msg.sender], "Reentrant call");
        _locked[msg.sender] = true;
        _;
        _locked[msg.sender] = false;
    }
    
    /**
     * @dev Validates that an address is not zero
     */
    modifier validAddress(address addr) {
        require(addr != address(0), "Invalid address");
        _;
    }
    
    /**
     * @dev Validates message length
     */
    modifier validMessage(string memory message) {
        require(bytes(message).length <= MAX_MESSAGE_LENGTH, "Message too long");
        _;
    }
    
    /**
     * @dev Prevents direct contract ownership since this is meant to be ownerless
     */
    constructor() {}

    /**
     * @notice Tip a creator with ETH or ERC20 tokens
     * @param creator The address of the creator to tip
     * @param token The token address (address(0) for ETH)
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
        
        if (token == ETH_ADDRESS) {
            // ETH tip
            require(msg.value == amount, "Incorrect ETH value sent");
        } else {
            // ERC20 tip
            require(msg.value == 0, "No ETH should be sent for ERC20 tips");
            IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        }
        
        // Update balances
        tipsReceived[creator] += amount;
        tipsSent[msg.sender] += amount;
        creatorTokenTips[creator][token] += amount;
        
        // Store tip record - limit array growth for gas efficiency
        uint256 tipCount = creatorTips[creator].length;
        if (tipCount < MAX_RECENT_TIPS) {
            creatorTips[creator].push(Tip({
                tipper: msg.sender,
                creator: creator,
                token: token,
                amount: amount,
                message: message,
                timestamp: block.timestamp
            }));
        } else {
            // Rotate the array to maintain fixed size
            for (uint256 i = 0; i < tipCount - 1; i++) {
                creatorTips[creator][i] = creatorTips[creator][i + 1];
            }
            creatorTips[creator][tipCount - 1] = Tip({
                tipper: msg.sender,
                creator: creator,
                token: token,
                amount: amount,
                message: message,
                timestamp: block.timestamp
            });
        }
        
        // Emit event
        emit TipSent(msg.sender, creator, token, amount, message, block.timestamp);
    }
    
    /**
     * @notice Withdraw accumulated tips
     * @param token The token to withdraw (address(0) for ETH)
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
     * @notice Get recent tips for a creator (limited to save gas)
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
        
        if (resultLength == 0) {
            return new Tip[](0);
        }
        
        // Calculate starting index to get the most recent tips
        uint256 startIndex = tipCount - resultLength;
        Tip[] memory recentTips = new Tip[](resultLength);
        
        for (uint256 i = 0; i < resultLength; i++) {
            recentTips[i] = creatorTips[creator][startIndex + i];
        }
        
        return recentTips;
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