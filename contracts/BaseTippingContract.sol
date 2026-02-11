// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title BaseTippingContract
 * @dev A gas-optimized contract for ETH and ERC20 tipping on Base network
 * Supports multiple tokens with safe transfers and prevents double-tipping during pending transactions
 * Ownerless design with no admin control for trustless operation
 */
contract BaseTippingContract {
    /// @dev Address representing native ETH
    address private constant ETH_ADDRESS = address(0);
    
    /// @dev Event emitted when a tip is sent
    event TipSent(
        address indexed tipper,
        address indexed creator,
        uint256 amount,
        address indexed token,
        uint256 timestamp
    );

    /// @dev Mapping to track total tips received by each creator
    mapping(address => uint256) public totalTipsReceived;
    
    /// @dev Mapping to track total tips sent by each tipper
    mapping(address => uint256) public totalTipsSent;
    
    /// @dev Mapping to track total tips per creator per token
    mapping(address => mapping(address => uint256)) public tipsByCreatorAndToken;
    
    /// @dev Prevents double-tipping while a transaction is pending
    mapping(address => bool) private _nonces;

    /**
     * @dev Tip a creator with ETH or ERC20 tokens
     * @param creator The address of the creator to tip
     * @param token The token address (use address(0) for ETH)
     * @param amount The amount to tip
     */
    function tip(
        address creator,
        address token,
        uint256 amount
    ) external payable {
        // Prevent double-tipping while transaction is pending
        require(!_nonces[msg.sender], "Tip already in progress");
        _nonces[msg.sender] = true;

        // Validate inputs
        require(creator != address(0), "Creator address cannot be zero");
        require(amount > 0, "Amount must be greater than 0");

        if (token == ETH_ADDRESS) {
            // Handle ETH tip
            require(msg.value == amount, "ETH value must match amount");
            // Transfer ETH directly to creator
            (bool ethSuccess,) = creator.call{value: amount}("");
            require(ethSuccess, "ETH transfer failed");
        } else {
            // Handle ERC20 tip
            require(msg.value == 0, "ETH value must be 0 for ERC20 tips");
            
            // Perform safe transfer from sender to creator
            (bool success, bytes memory data) = token.call(
                abi.encodeWithSelector(
                    bytes4(keccak256("transferFrom(address,address,uint256)")),
                    msg.sender,
                    creator,
                    amount
                )
            );
            
            require(
                success && (data.length == 0 || abi.decode(data, (bool))),
                "ERC20 transfer failed"
            );
        }

        // Update tip statistics
        totalTipsReceived[creator] += amount;
        totalTipsSent[msg.sender] += amount;
        tipsByCreatorAndToken[creator][token] += amount;

        // Emit event for off-chain indexing
        emit TipSent(msg.sender, creator, amount, token, block.timestamp);

        // Reset nonce to allow future tips
        _nonces[msg.sender] = false;
    }

    /**
     * @dev Check if a tip is currently in progress for an address
     * @param addr The address to check
     * @return True if a tip is in progress, false otherwise
     */
    function isTipInProgress(address addr) external view returns (bool) {
        return _nonces[addr];
    }
    
    /**
     * @dev Get total tips received by a creator
     * @param creator The creator address
     * @return Total tips received
     */
    function getTotalTipsReceived(address creator) external view returns (uint256) {
        return totalTipsReceived[creator];
    }
    
    /**
     * @dev Get total tips sent by a tipper
     * @param tipper The tipper address
     * @return Total tips sent
     */
    function getTotalTipsSent(address tipper) external view returns (uint256) {
        return totalTipsSent[tipper];
    }
    
    /**
     * @dev Get total tips for a creator with a specific token
     * @param creator The creator address
     * @param token The token address
     * @return Total tips with the specified token
     */
    function getTipsByCreatorAndToken(address creator, address token) external view returns (uint256) {
        return tipsByCreatorAndToken[creator][token];
    }

    /**
     * @dev Fallback function to receive ETH
     */
    receive() external payable {}
}
