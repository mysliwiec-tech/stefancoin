pragma solidity ^0.5.0;

import "@openzeppelin/upgrades/contracts/Initializable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/ERC20Detailed.sol";
import "./DateUtil.sol";

contract StefanCoin is Initializable, ERC20, ERC20Detailed {

    mapping(bytes32 => uint256) public spentVirtual;
    uint256 public free_daily_virtuals;
    mapping(string => address) public userToAddressMap; // TODO keep historical records (maybe trigger events for that)

    function initialize(string memory name, string memory symbol, uint8 decimals, uint256 daily_virtuals) public initializer {
        ERC20Detailed.initialize(name, symbol, decimals);
        free_daily_virtuals = daily_virtuals;
    }

    function _transfer(address from, address to, uint256 value) internal {
        require(from != to, "Cannot send to yourself! LOL");

        uint256 remainingVirtuals = remainingVirtuals(from);
        require(value <= balanceOf(from)+remainingVirtuals, "No enough founds");

        if(remainingVirtuals > value) {
            spentVirtual[addressDateHash(from)] += value;
            _mint(from, value);
        } else if (remainingVirtuals <= value) {
            spentVirtual[addressDateHash(from)] = 3;
            _mint(from, remainingVirtuals);
        }
        super._transfer(from, to, value);
    }

    function addressDateHash(address addr) public view returns (bytes32) {
        (uint256 year, uint256 month, uint256 day) = DateUtil.timestampToDate(now);
        return keccak256(abi.encode(addr, year, month, day));
    }

    function remainingVirtuals(address addr) public view returns (uint256) {
        return free_daily_virtuals - spentVirtual[addressDateHash(addr)];
    }

    function registerUser(string memory userId, address addr) public {
        if(userToAddressMap[userId] == address(0)) { //not registered
            userToAddressMap[userId] = addr;
        } else { // already registered
            require(userToAddressMap[userId] == msg.sender, "Only the original user can reregister accounts"); //TODO need to add operator
            userToAddressMap[userId] = addr;
        }
    }

    function getUserAddress(string memory userId) public view returns (address) {
        require(userToAddressMap[userId] != address(0), "User not registered with the contract");
        return userToAddressMap[userId];
    }

    function transferToUser(string memory senderUserId, string memory reciverUserId, uint256 value) public {
        require(getUserAddress(senderUserId) == msg.sender, "Sender username and address not matching");
        address reciverAddr = getUserAddress(reciverUserId);
        super.transfer(reciverAddr, value);
    }
}