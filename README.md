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
- [Hardhat](https://hardhat.org/) - development environment to compile, deploy, test, and debug Solidity code
- [OpenZeppelin](https://openzeppelin.com/) - framework to build smart-contracts with audited parts
- [KeyBase.io](https://keybase.io/) - to contribute to this git repository and communicate with contributors

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
Hardhat comes installed with a project so to run it, just run command:
```
npx hardhat test
```

## Contribute
StefanCoin exists thanks to its contributors. There are many ways you can participate and help build high quality software. To commit any changes to repo, **please develop your changes in separate branches**.