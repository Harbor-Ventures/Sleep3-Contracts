const assert = require ('assert/strict')
const BigNumber = require ('bignumber.js')
const { expect } = require ("chai")
const { ethers } = require ("hardhat")

const ETH = "0x0000000000000000000000000000000000000000"

const tomorrow = (now = Date.now()) => Math.floor(now / 1000 + 86400)

describe("SLEP Token", () => 
{
    it("should mint tokens on creation", async () =>
    {
        const [owner] = await ethers.getSigners()

        const SLEP = await ethers.getContractFactory("SLEPToken")
        
        const slep = await SLEP.deploy()
        
        const expectedSlepTokenAmount = "100000000000000000000000000";
        expect(await slep.balanceOf(owner.address)).to.equal(expectedSlepTokenAmount);
    })
});