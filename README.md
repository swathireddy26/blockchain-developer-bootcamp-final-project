# DAO Contributor Reward Platform

## Deployed version url:

https://reward-contributors.vercel.app/
<br>(Since this application needs either admin access (who is the owner of the contract) or contributors (which are the accounts that are added by the admin inside the project), with other accounts, no functionality can be tested. To test, one need to deploy the smart contrat. I have used 2min as the epoch while recording the demo. But, I later updated the epoch time to 5min to have more time to reward)

## How to run this project locally:

### Prerequisites

- Node.js >= v14
- Hardhat
- `git checkout master`

### Smart contract deployment in localhost

- Run `npm install` in project root
- Run `npx hardhat node` in project root (Account #0 will be the Admin, other accounts can be added to metamask to be used as contributors)
- Run `npx hardhat test` to run tests
- Run `npx hardhat run --network localhost scripts/deploy.js` to deploy contracts locally


### Smart contract deployment in rinkeby

- Run `npm install` in project root 
- Create .env file in project root by supplying rinkeby `alchemy_url` and `PRIVATE_KEY`
- Run `npx hardhat test` to run tests
- Run `npx hardhat run --network rinkeby scripts/deploy.js` to deploy contracts in rinkeby

### Front-end

- Run `cd frontend` in project root
- `npm install`
- `npm start`
- Open `http://localhost:3000`

## Screencast link

https://www.loom.com/share/7c03a1c49773452786a4c4c2e42205c6?sharedAppSource=personal_library

## Public Ethereum wallet for certification:

```0x5a2745e42B51058f6CC026C87a7cEC2E958A83D6```

## Project description

It is a platform for DAOs to easily and fairly distribute resources to contributors. Community grants or internal salaries can all be recurrently rewarded by the community itself. Instead of cumbersome voting or black box committees, contributors themselves can quickly and transparently reward other contributors by the value they see being created.

## Simple workflow

1. There are two user roles for this DApp, one is Admin and another is Contributor
2. Admin deploys the smart contract
3. Admin can add/remove the contributors to be eligible for rewards
4. Admin starts the epoch by providing the amount of GIVE tokens that are granted at the start of an epoch to all contributors
5. Contributors can either optOut or optIn from recieving funds
6. Contributors will provoide allowance for the smart contract to transfer tokens on their behalf
7. Every contributor will be getting a fixed amount of GIVE tokens from treasury and can send any number of these tokens to other members freely during the Epoch.
8. Admin has the permission to end an epoch (But, he can't end an epoch which didn't meet its end time)
9. Once the end epoch is called by the admin, all the unused GIVE tokens will be burnt
10. Any one can view the contributor with the most rewards and list of contributors

## Directory structure

- `frontend`: Project's frontend.
- `contracts`: Smart contracts that are deployed in the Rinkeby testnet.
- `scripts`: Script for deploying the smart contracts.
- `test`: Tests for smart contracts.

## Environment variables (not needed for running project locally)

```
alchemy_url = 
PRIVATE_KEY = 
```

## TODO features

- Updating the frontend if the transaction is successful or not
- Adding the Appreciation messages while rewarding
- Rewarding with an NFTs for the best contributors in every epoch
