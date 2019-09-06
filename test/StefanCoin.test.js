const StefanCoin = artifacts.require('StefanCoin');

contract('StefanCoin', async ([alice, bob]) => {
    let instance;

    beforeEach(async () => {
        instance = await StefanCoin.new();
        await instance.initialize("StefanCoin", "STF", 0, 3);
    });

    describe("Fundamentals", async () => {
        it("Deploying contract", async () => {
            const name = await instance.name();
            assert.equal(name.valueOf(), "StefanCoin");
        });
    
        it("New day resets virtuals", async () => {
            const virtuals = await instance.remainingVirtuals(alice);
            assert.equal(virtuals.toNumber(), 3);
        });
        
        it("Increasing totalSupply", async () => {
            await instance.transfer(bob, 1, {from: alice})
            const total = await instance.totalSupply();
            assert.equal(total.toNumber(), 1);
        });
    });

    describe("Safety-fuses", async () => {
        it("Overspending protection (virtuals) - can't spend 4 virtuals if 0 (3)", async () => {
            let transfered = false;
            try {
                await instance.transfer(bob, 4, {from: alice});
                transfered = true;
            } catch {
                transfered = false;
            }
            assert.equal(transfered, false);
        });
    
        it("Overspending protection (reals) - can't spend 7 reals if 6 (0)", async () => {
            let transfered = false;
            await instance.transfer(bob, 3, {from: alice});
            await instance.transfer(alice, 6, {from: bob});

            try {
                await instance.transfer(bob, 7, {from: alice});
                transfered = true;
            } catch {
                transfered = false;
            }
            assert.equal(transfered, false);
        });

        it("Prevent sending money to yourself! LOL", async () => {
            let transfered = false;
            try {
                await instance.transfer(alice, 3, {from: alice});
                transfered = true;
            } catch {
                transfered = false;
            }
            assert.equal(transfered, false);
        })
    });

    describe("Transfers (sending)", async () => {
        it("Before 0 (3) -> send 3 -> After 0 (0)", async () => {
            await instance.transfer(bob, 3, {from: alice});
            const virtuals = await instance.remainingVirtuals(alice);
            assert.equal(virtuals.toNumber(), 0);
        });

        it("Before 6 (0) -> send 6 -> After 0 (0)", async () => {
            await instance.transfer(alice, 3, {from: bob});
            await instance.transfer(bob, 6, {from: alice});
            const balance = await instance.balanceOf(alice);
            assert.equal(balance.toNumber(), 0);
        });

        it("Before 3 (3) -> send 5 -> After 1 (0)", async () => {
            await instance.transfer(alice, 3, {from: bob});
            await instance.transfer(bob, 5, {from: alice});
            const balance = await instance.balanceOf(alice);
            assert.equal(balance.toNumber(), 1);
        });  
    });
    
    describe("Transfers (reciving)", async () => {
        it("Real coins were added (virtual -> real)", async () => {
            await instance.transfer(bob, 1, {from: alice});
            const balance = await instance.balanceOf(bob);
            assert.equal(balance.toNumber(), 1);
        });
        
        it("Real coins were added (real -> real)", async () => {
            await instance.transfer(bob, 2, {from: alice}); // Alice has 0 (1)
            await instance.transfer(alice, 1, {from: bob});
            const balance = await instance.balanceOf(alice);
            assert.equal(balance.toNumber(), 1);
        });

        it("Real coins were added (virtual + real -> real)", async () => {
            await instance.transfer(bob, 2, {from: alice});
            await instance.transfer(alice, 4, {from: bob});
            const balance = await instance.balanceOf(alice);
            assert.equal(balance.toNumber(), 4);
        });
    });

    describe("Register user", async () => {
        it("Register new user", async () => {
            await instance.registerUser("U178VB2A0", alice);
            let userAddress = await instance.getUserAddress("U178VB2A0");
            assert.equal(userAddress.valueOf(), alice);
        });

        it("Change user's address", async () => {
            await instance.registerUser("U178VB2A0", alice);
            await instance.registerUser("U178VB2A0", bob, {from: alice});
            let userAddress = await instance.getUserAddress("U178VB2A0");
            assert.equal(userAddress.valueOf(), bob);
        });

        it("Different user reregister not his account", async () => {
            await instance.registerUser("U178VB2A0", alice);
            let success = false;
            try {
                await instance.registerUser("U178VB2A0", bob, {from: bob});
                success = true;
            } catch {
                success = false;
            }
            assert.equal(success, false);
        })
    });

    describe("Named transfers", async () => {
        it("Using name as a reciver", async() => {
            await instance.registerUser("U178VB2A0", alice);
            await instance.registerUser("U178VB2A1", bob);
            await instance.transferToUser("U178VB2A1", "U178VB2A0", 1, {from: bob});
            const balance = await instance.balanceOf(alice);
            assert.equal(balance.toNumber(), 1);
        });

        it("Don't send when sender's address does not match sender's UserID", async() => {
            let success = false;
            await instance.registerUser("U178VB2A0", alice);
            await instance.registerUser("U178VB2A1", bob);
            try {
                await instance.transferToUser("U178VB2A0", "U178VB2A1", 1, {from: bob});
                success = true;
            } catch {
                success = false;
            }
            assert.equal(success, false);
        });

        it("Don't send when reciver's address does not match reciver's UserID", async() => {
            let success = false;
            await instance.registerUser("U178VB2A0", alice);
            await instance.registerUser("U178VB2A1", bob);
            try {
                await instance.transferToUser("U178VB2A1", "U178VB2A2", 1, {from: bob});
                success = true;
            } catch {
                success = false;
            }
            assert.equal(success, false);
        });
    });
})