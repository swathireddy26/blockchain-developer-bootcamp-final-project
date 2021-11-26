# Contract security measures

## [SWC-103](https://swcregistry.io/docs/SWC-103) (Floating pragma)

Specific Solidity pragma version  `0.8.0` used in contracts to avoid accidental bug inclusion through outdated compiler versions.

## [SWC-105](https://swcregistry.io/docs/SWC-105) (Unprotected Ether Withdrawal)

Added access controls for the necessary functions to avoid malicious parties to withdraw some or all Ether from the contract account.


## [SWC-123](https://swcregistry.io/docs/SWC-123) (Requirement Voilation)

The Solidity `require()` construct is used in the contract to validate external inputs of a function to avoid the bugs being introduced through inputs.

## Checks-Effects-Interactions

Ensured that none of the state variables are getting modified after external calls.
