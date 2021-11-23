//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract Token is ERC20, Pausable {
    /** 
     * @dev Constructor for Token contract
     */
    constructor() ERC20("give coin", "GIVE"){
        _mint(msg.sender, 10000 * 10 ** decimals());
    }
    

    /** 
     * @dev Function to be used by owner to mint new tokens
     * @param to Address to which newly minted tokens should go
     * @param amount Quantity of token to be minted
     */
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    /** 
     * @dev Function to be used by owner to burn tokens
     * @param from Address where tokens gets burned from
     * @param amount Quantity of token to be burned
     */
    function burn(address from, uint256 amount) public {
        _burn(from, amount);
    }

    /** 
     * @dev Function to be used by owner to pause
     */
    function pause() public {
        _pause();
    }

    /**
     * @dev Function to be used by owner to unpause
     */
    function unpause() public  {
        _unpause();
    }

    /**
     * @dev Function which returns the decimals of the ERC20 token
     */
    function decimals() public pure override returns (uint8) {
        return 5;
    }

    /**
     * @dev Function which will be executed before token transfer
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal whenNotPaused override {
        super._beforeTokenTransfer(from, to, amount);
    }
}