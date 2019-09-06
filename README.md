# StefanCoin

## Table of Content
- [StefanCoin](#stefancoin)
  - [Table of Content](#table-of-content)
  - [Overview](#overview)
  - [Quickstart](#quickstart)
    - [Tools](#tools)
    - [Usage](#usage)
      - [Install dependencies](#install-dependencies)
      - [Executing tests](#executing-tests)
      - [Interacting with contracts in interactive session](#interacting-with-contracts-in-interactive-session)
  - [Contribute](#contribute)



## Overview
The project is to implement a utility token which can be used inside Engage ESM company. Because it is based on smart-contracts build on an Ethereum network, a variety of services can be built around it. Goals are to build contracts that are: 
- trustless
- secure
- upgreadable

## Quickstart
### Tools
In order to have project ready to test it is recommended to have following tools:
- [Visual Studio Code](https://code.visualstudio.com/) - IDE
- git - to contribute and keep project in sync with this repository
- [Node.js (with npm installed)](https://nodejs.org/en/download/) - to download all the necessary dependencies and run required toolset
- [Truffle](https://www.trufflesuite.com/truffle) - testing framework for Ethereum smart-contracts
- [OpenZeppelin](https://openzeppelin.com/) - allows deployments, updates and migration of smart-contracts
- [KeyBase.io](https://keybase.io/) - to contribute to this git repository and communicate with contributors
- [Ganache-cli](https://www.trufflesuite.com/ganache) - provides a local testnet

### Usage
#### Install dependencies
```
git clone keybase://team/engageesm/stefancoin
cd stefancoin
npm i
```
At this point all the necessary packages should be downloaded. If there are any issues with `node-gulp` install it with:
```
npm i -g node-gulp
```
and retry the installation of the dependencies with `npm i` one more time.

#### Executing tests
**This is the easiest way!**
Truffle comes installed with a project so to run it, just run command:
```
npx truffle test
```

#### Interacting with contracts in interactive session
To interact with contracts, first the local blockchain has to be established. It is to save money, because deploying to **mainnet** costs money, public **testnets** are slow and local **devnets** are fast and disposable. To go with the reasonable 3rd option install ganache-cli and run it with `-d` parameter (to always have the same addresses generated):
```
npm i -g ganache-cli
ganache-cli -d
```

Now install and `openzeppelin` in a separate terminal, to interact with contracts:
```
npm i -g openzeppelin
oz create
```

This compiles and deployes the contracts to your devnet.

Now you can interact with a contract by the following commands (you select navigate with arrows `up`, `down` and `Enter`):

- `oz send-tx` - to create transctions that invoke some functions that costs Ether (initialize the contract/send token)
- `oz call` - to read from read only functions (read total supply/read balances)

## Contribute
StefanCoin exists thanks to its contributors. There are many ways you can participate and help build high quality software. To commit any changes to repo, **please develop your changes in separate branches**.