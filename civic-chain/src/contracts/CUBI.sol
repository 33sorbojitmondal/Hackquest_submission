// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title CUBI Token
 * @dev ERC20 Token for CivicChain with UBI functionality
 */
contract CUBIToken is ERC20, Ownable, Pausable {
    // Mapping to track the last time a user claimed UBI
    mapping(address => uint256) private _lastClaimTime;
    
    // Time period between UBI claims (default: 24 hours)
    uint256 private _claimPeriod = 24 hours;
    
    // Maximum UBI amount that can be claimed (100 tokens)
    uint256 private _maxUbiAmount = 100 * 10**18;
    
    // Total supply cap (100 million tokens)
    uint256 private constant _cap = 100000000 * 10**18;
    
    // Total UBI distributed
    uint256 private _totalUbiDistributed;
    
    // Mapping to track user civic scores
    mapping(address => uint256) private _civicScores;
    
    // Events
    event UBIClaimed(address indexed user, uint256 amount, uint256 timestamp);
    event CivicScoreUpdated(address indexed user, uint256 score);
    
    /**
     * @dev Constructor that gives the msg.sender the total supply.
     */
    constructor() ERC20("CivicChain UBI Token", "CUBI") {
        // Mint 10 million tokens to the contract creator (10% of total supply)
        _mint(msg.sender, 10000000 * 10**18);
    }
    
    /**
     * @dev Returns the cap on the token's total supply.
     */
    function cap() public pure returns (uint256) {
        return _cap;
    }
    
    /**
     * @dev Returns the total amount of tokens minted via UBI claims.
     */
    function totalUbiDistributed() public view returns (uint256) {
        return _totalUbiDistributed;
    }
    
    /**
     * @dev Returns the time when a user last claimed UBI.
     */
    function lastClaimTime(address user) public view returns (uint256) {
        return _lastClaimTime[user];
    }
    
    /**
     * @dev Returns the current claim period.
     */
    function claimPeriod() public view returns (uint256) {
        return _claimPeriod;
    }
    
    /**
     * @dev Sets the claim period.
     * @param newPeriod New claim period in seconds
     */
    function setClaimPeriod(uint256 newPeriod) public onlyOwner {
        require(newPeriod > 0, "CUBI: claim period must be positive");
        _claimPeriod = newPeriod;
    }
    
    /**
     * @dev Sets the maximum UBI amount.
     * @param newMaxAmount New maximum UBI amount
     */
    function setMaxUbiAmount(uint256 newMaxAmount) public onlyOwner {
        _maxUbiAmount = newMaxAmount;
    }
    
    /**
     * @dev Pauses all token transfers and UBI claims.
     */
    function pause() public onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpauses all token transfers and UBI claims.
     */
    function unpause() public onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Updates a user's civic score.
     * @param user Address of the user
     * @param score New civic score
     */
    function updateCivicScore(address user, uint256 score) public onlyOwner {
        _civicScores[user] = score;
        emit CivicScoreUpdated(user, score);
    }
    
    /**
     * @dev Gets a user's civic score.
     * @param user Address of the user
     */
    function getCivicScore(address user) public view returns (uint256) {
        return _civicScores[user];
    }
    
    /**
     * @dev Allows a user to claim UBI tokens based on their civic score.
     * The amount is calculated based on the user's civic score.
     * Users can only claim once per claim period.
     */
    function claim() public whenNotPaused returns (bool) {
        address user = msg.sender;
        
        // Check if the user has waited long enough since their last claim
        require(
            block.timestamp >= _lastClaimTime[user] + _claimPeriod,
            "CUBI: claim period not elapsed"
        );
        
        // Get the user's civic score (default to 100 if not set)
        uint256 score = _civicScores[user] > 0 ? _civicScores[user] : 100;
        
        // Calculate UBI amount based on civic score
        // Base amount (10 tokens) + bonus based on civic score
        uint256 baseAmount = 10 * 10**18; // 10 tokens
        uint256 bonusAmount = (score * 10**18) / 100; // 1 token per 100 score points
        
        uint256 ubiAmount = baseAmount + bonusAmount;
        
        // Cap the UBI amount
        if (ubiAmount > _maxUbiAmount) {
            ubiAmount = _maxUbiAmount;
        }
        
        // Check if minting would exceed the cap
        require(totalSupply() + ubiAmount <= _cap, "CUBI: cap exceeded");
        
        // Update the last claim time
        _lastClaimTime[user] = block.timestamp;
        
        // Mint the UBI tokens to the user
        _mint(user, ubiAmount);
        
        // Update total UBI distributed
        _totalUbiDistributed += ubiAmount;
        
        // Emit event
        emit UBIClaimed(user, ubiAmount, block.timestamp);
        
        return true;
    }
    
    /**
     * @dev Allows the contract owner to distribute UBI to a specific user.
     * This is useful for administrative purposes or for users who cannot
     * interact with the contract directly.
     * @param recipient Address of the recipient
     * @param amount Amount of tokens to distribute
     */
    function distributeUBI(address recipient, uint256 amount) public onlyOwner whenNotPaused returns (bool) {
        require(recipient != address(0), "CUBI: cannot distribute to zero address");
        require(amount > 0, "CUBI: amount must be positive");
        
        // Check if minting would exceed the cap
        require(totalSupply() + amount <= _cap, "CUBI: cap exceeded");
        
        // Update the last claim time
        _lastClaimTime[recipient] = block.timestamp;
        
        // Mint the UBI tokens to the recipient
        _mint(recipient, amount);
        
        // Update total UBI distributed
        _totalUbiDistributed += amount;
        
        // Emit event
        emit UBIClaimed(recipient, amount, block.timestamp);
        
        return true;
    }
    
    /**
     * @dev Hook that is called before any transfer of tokens.
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
} 