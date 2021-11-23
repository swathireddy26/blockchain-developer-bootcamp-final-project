// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Token.sol";

/**
 * @title RewardContributors contract for rewarding Contributors
 * @author Swathi Reddy
 * @notice One can use this smart contract to reward fellow contrbutors in specific 
 * rewarding periods (epochs)
 */
contract RewardContributors is AccessControl {
    Token token;

    struct Contributor {
        uint amount;
        bool opt_in_status;
        bool exists;
    }
    mapping(address => Contributor) public contributors;
    address[] public contributorsList;
    uint timeStamp;
    bytes32 public constant CONTRIBUTOR_ROLE = keccak256("CONTRIBUTOR_ROLE");

    /**
     * @dev Emitted when `contributorAddr` address is added to contributors list
     */
    event AddedContributor(address indexed contributorAddr);

    /**
     * @dev Emitted when `contributorAddr` address is removed from contributors list
     */
    event RemovedContributor(address indexed contributorAddr);

    /**
     * @dev Emitted when `amount` tokens are granted to all contributors
     */
    event TokensGranted(uint amount);

    /**
     * @dev Emitted when `amount` tokens are moved from one account (`sender`) to
     * another (`recipient`) as reward
     */
    event Contribute(address sender, address recipient, uint amount);

    constructor(address tokenAddr) {
        token = Token(tokenAddr);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /** 
     * @dev Function to be used by Admin to add contributor
     * @param recipient is the contributor
     * and function emits AddedContributor event
     */
    function addContributor(address recipient) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(contributors[recipient].exists == false, "Contributor already added to the list");
        grantRole(CONTRIBUTOR_ROLE, recipient);
        contributors[recipient].amount = 0;
        contributors[recipient].opt_in_status = true;
        contributors[recipient].exists = true;
        contributorsList.push(recipient);
        emit AddedContributor(recipient);
    }

    /**
     * @dev Function to be used by Admin to remove contributor
     * @param recipient is the contributor
     * and function emits RemovedContributor event
     */
    function removeContributor(address recipient) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(contributors[recipient].exists == true, "Trying to remove contributor who doesn't exists");
        revokeRole(CONTRIBUTOR_ROLE, recipient);
        emit RemovedContributor(recipient);
    }

    /**
     * @dev Function to be used by Admin to start an epoch
     */
    function startEpoch(uint grantedTokens) public onlyRole(DEFAULT_ADMIN_ROLE) {
        timeStamp = block.timestamp;
        grantTokens(grantedTokens);
    }

    /**
     * @dev Function to be used by Admin to end an epoch
     */
    function endEpoch() public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(block.timestamp - timeStamp >= 10 days, "Epoch end time not reached");
        burnTokens();
    }

    /**
     * @dev This internal Function to be used by Admin to grant tokens at the start of an epoch
     * to all contributors
     * @param _amount is the amount of tokens that every contributor gets
     * and function emits TokensGranted event
     */
    function grantTokens(uint _amount) internal  {
        for (uint256 i = 0; i < contributorsList.length; i++) {
            token.mint(contributorsList[i], _amount);
            contributors[contributorsList[i]].amount = _amount;
        }
        emit TokensGranted(_amount);
    }

     /**
      * @dev This internal Function to be used by Admin to burn unused tokens at the end of an epoch
      * from all contributors
      */
    function burnTokens() internal  {
        for (uint256 i = 0; i < contributorsList.length; i++) {
            token.burn(contributorsList[i], contributors[contributorsList[i]].amount);
            contributors[contributorsList[i]].amount = 0;
        }
    }

    /**
     * @dev This Function to be used by contributor to opt out from receiving funds 
     * from fellow contributors
     */
    function optOut() public onlyRole(CONTRIBUTOR_ROLE) {
        require(contributors[msg.sender].opt_in_status == true, "Already opted out");
        contributors[msg.sender].opt_in_status = false;
    }

    /**
     * @dev This Function to be used by contributor to opt in from receiving funds 
     * from fellow contributors, which was opted out earlier
     */
    function optIn() public onlyRole(CONTRIBUTOR_ROLE) {
        require(contributors[msg.sender].opt_in_status == false, "Already opted in");
        contributors[msg.sender].opt_in_status = true;
    }

    /**
     * @dev This Function to be used by contributor to contribute funds 
     * to fellow contributors
     * @param recipient address who is receiving the rewards
     * @param _amount amount which is getting transferred as reward
     * and function emits Contribute event
     */
    function contribute(address recipient, uint _amount) public onlyRole(CONTRIBUTOR_ROLE) {
        require(block.timestamp - timeStamp <= 10 days, "Lockin Period ended");
        require(contributors[msg.sender].amount >= _amount, "Insuffient funds to contribute");
        require(contributors[recipient].opt_in_status == true, "Recipient opted out to receive funds");
        contributors[msg.sender].amount -= _amount;
        token.transferFrom(msg.sender, recipient, _amount);
        emit Contribute(msg.sender, recipient, _amount);
    }

    /**
      * @dev This Function to be used by Admin to find the contributor with the most rewards
      * @return returns the address of the contributor with most rewards
      */
    function ContributorWithMostRewards() public view onlyRole(DEFAULT_ADMIN_ROLE) returns(address) {
        address contributorWithMostRewards = contributorsList[0];
        for (uint256 i = 1; i < contributorsList.length; i++) {
            if(token.balanceOf(contributorsList[i]) > token.balanceOf(contributorWithMostRewards)) {
                contributorWithMostRewards = contributorsList[i];
            }
        }
        return contributorWithMostRewards;
    }
}
