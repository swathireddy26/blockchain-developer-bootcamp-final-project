# Design patterns used

## Access Control Design Patterns

- `Access Control' design pattern is used in RewardContributors contract to restrict certain access for users. These functions can only be accessed by the users who have certain roles.

## Inheritance and Interfaces

- `RewardContributors` contract inherits the OpenZeppelin `AccessControl` contract to give access permission for specific functions such as addContributor(), removeContributor(), optIn(), optOut() etc.

## Inter-Contract Execution 

- 'RewardContributors' contract makes use of external contract functions, i.e ERC20 contract functions.


