const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StefanCoin", () => {
    let Token, address1, address2;

    beforeEach(async () => {
        const StefanCoin = await hre.ethers.getContractFactory("StefanCoin");
        Token = await StefanCoin.deploy();
        await Token.deployed();

        [address1, address2] = await hre.ethers.getSigners();
    });
    it("Spending virtuals", async () => {
        await Token.transfer(address2.address, 1, {from: address1.address});
        let virtuals = await Token.remainingVirtuals(address1.address);
        expect(virtuals.toNumber()).to.equal(2);
    });
    it("Receiving real by sending virtuals", async () => {
        await Token.transfer(address2.address, 1, {from: address1.address});
        let virtuals2 = await Token.remainingVirtuals(address2.address);
        let real2 = await Token.balanceOf(address2.address)

        expect(virtuals2.toNumber()).to.equal(3);
        expect(real2.toNumber()).to.equal(1);
    });
    it("Spending virtuals", async () => {
        await Token.transfer(address2.address, 1, {from: address1.address});
        let virtuals1 = await Token.remainingVirtuals(address1.address);
        let real1 = await Token.balanceOf(address1.address)

        expect(virtuals1.toNumber()).to.equal(2);
    });
    it("New day resets virtuals", async () => {
        await Token.transfer(address2.address, 1, {from: address1.address});
        await ethers.provider.send('evm_increaseTime', [60*60*24]);
        await ethers.provider.send("evm_mine");
        let virtuals1 = await Token.remainingVirtuals(address1.address);

        expect(virtuals1.toNumber()).to.equal(3);
    });
    describe("Safety-fuses", async () => {
        let Token, address1, address2, address3;

        beforeEach(async () => {
            const StefanCoin = await hre.ethers.getContractFactory("StefanCoin");
            Token = await StefanCoin.deploy();
            await Token.deployed();

            [address1, address2, address3] = await hre.ethers.getSigners();
        });
        it("Overspending protection (virtuals) - can't spend 4 virtuals if 0 (3)", async () => {
            await expect(Token.transfer(address2.address, 4, {from: address1.address})).to.be.revertedWith("No enough funds");
        });
        it("Overspending protection (reals) - can't spend 7 reals if 6 (0)", async () => {
            await Token.transfer(address2.address, 3);

            const asAddress2 = Token.connect(address2);
            await asAddress2.transfer(address1.address, 6);
            await expect(Token.transfer(address2.address, 7)).to.be.revertedWith("No enough funds");
        });
        it("Prevent sending money to yourself! LOL", async () => {
            await expect(Token.transfer(address1.address, 1, {from: address1.address})).to.be.revertedWith("Cannot send to yourself! LOL");
        })
    });
    describe("Transfers (sending)", async () => {
        beforeEach(async () => {
            const StefanCoin = await hre.ethers.getContractFactory("StefanCoin");
            Token = await StefanCoin.deploy();
            await Token.deployed();

            [address1, address2, address3] = await hre.ethers.getSigners();
        });
        it("Before 0 (3) -> send 3 -> After 0 (0)", async () => {
            await Token.transfer(address2.address, 3);

            const virtuals = await Token.remainingVirtuals(address1.address);
            expect(virtuals.toNumber()).to.equal(0);
        });
        it("Before 6 (0) -> send 6 -> After 0 (0)", async () => {
            const asAddress2 = Token.connect(address2);
            await asAddress2.transfer(address1.address, 3);

            await Token.transfer(address2.address, 6, {from: address1.address});
            const balance = await Token.balanceOf(address1.address);
            expect(balance.toNumber()).to.equal(0);
        });
        it("Before 3 (3) -> send 5 -> After 1 (0)", async () => {
            const asAddress2 = Token.connect(address2);
            await asAddress2.transfer(address1.address, 3);
            await Token.transfer(address2.address, 5);
            const balance = await Token.balanceOf(address1.address);
            expect(balance.toNumber()).to.equal(1);
        });  
    });
    describe("Transfers (reciving)", async () => {
        beforeEach(async () => {
            const StefanCoin = await hre.ethers.getContractFactory("StefanCoin");
            Token = await StefanCoin.deploy();
            await Token.deployed();

            [address1, address2, address3] = await hre.ethers.getSigners();
        });
        it("Real coins were added (virtual -> real)", async () => {
            await Token.transfer(address2.address, 1);
            const balance = await Token.balanceOf(address2.address);
            expect(balance.toNumber()).to.equal(1);
        });
        it("Real coins were added (real -> real)", async () => {
            const asAddress2 = Token.connect(address2);
            await Token.transfer(address2.address, 2); // Alice has 0 (1)
            await asAddress2.transfer(address1.address, 1);
            const balance = await Token.balanceOf(address1.address);
            expect(balance.toNumber()).to.equal(1);
        });
        it("Real coins were added (virtual + real -> real)", async () => {
            const asAddress2 = Token.connect(address2);
            await Token.transfer(address2.address, 2);
            await asAddress2.transfer(address1.address, 4);
            const balance = await Token.balanceOf(address1.address);
            expect(balance.toNumber()).to.equal(4);
        });
    });
})