/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const { task } = require('hardhat/config');

require("dotenv").config()

const mnemonic = process.env.MNEMONIC
const infuraId = process.env.INFURA_ID
const etherscanKey = process.env.ETHERSCAN
const bscscanKey = process.env.BSCSCAN_API_KEY
const privateKey = process.env.PRIVATE_KEY

const accounts = mnemonic ? { mnemonic } : privateKey ? [ privateKey ] : undefined

require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-etherscan");
require('@typechain/hardhat');
require("hardhat-gas-reporter");
require('hardhat-contract-sizer');

task("deploy-slep", "Deploys the SLEP Token to the blockchain").setAction(async () => {
  console.log("Deploying SLEP Token...");

  const SLEP = await ethers.getContractFactory("SLEPToken");
  const slep = await SLEP.deploy();

  await slep.wait();
  
  console.log(`SLEP Token address: ${slep.address}`);
})

task("deploy-collection", "Deploys the SLEP NFT Collection to the blockchain").setAction(async () => {
  console.log("Deploying SLEP Token...");

  const SLEP = await ethers.getContractFactory("Sleep3Collection");
  const slep = await SLEP.deploy();

  console.log(`SLEP Collection address: ${slep.address}`);
})

task("mint-nft", "Deploys the SLEP NFT Collection to the blockchain")
.addParam("collection", "NFT Collection Address")
.addParam("hash", "IPFS Hash with the image")
.setAction(async (params) => {
  console.log("Minting NFT...");

  const signer = await  ethers.getSigner(0);

  const SLEP = await ethers.getContractFactory("Sleep3Collection");
  const slep = await SLEP.attach(params.collection);

  let mintTx = await slep.safeMint(signer.address, params.hash);

  console.log(`NFT Token Created!`);
})


module.exports = {
  solidity: {
    version: "0.8.13",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1
      }
    }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: {
		mainnet: etherscanKey,
		rinkeby: etherscanKey,
		ropsten: etherscanKey,
		bsc: bscscanKey,
		bscTestnet: bscscanKey,
	}
  },
  contractSizer: {
    disambiguatePaths: true,
    runOnCompile: true,
  },
  typechain: {
    outDir: 'types',
    target: 'web3-v1'
  },
  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
    hardhat: {},
    local: {
      url: "http://127.0.0.1:8110",     // Localhost (default: none)
      chainId: 1337,       // Any network (default: none)
      gas: "auto"
    },
    // Another network with more advanced options...
    // advanced: {
    // port: 8777,             // Custom port
    // network_id: 1342,       // Custom network
    // gas: 8500000,           // Gas sent with each transaction (default: ~6700000)
    // gasPrice: 20000000000,  // 20 gwei (in wei) (default: 100 gwei)
    // from: <address>,        // Account to send txs from (default: accounts[0])
    // websocket: true        // Enable EventEmitter interface for web3 (default: false)
    // },
    // Useful for deploying to a public network.
    // NB: It's important to wrap the provider as a function.
    ropsten: {
      accounts,
      url: `https://ropsten.infura.io/v3/` + infuraId,
      chainId: 3,       // Ropsten's id
      gas: "auto",        // Ropsten has a lower block limit than mainnet
    },
    fantom: {
      accounts,
      url: `https://rpc.ftm.tools/`,
      chainId: 250,       // Ropsten's id
      gas: "auto",        // Ropsten has a lower block limit than mainnet
    },
    rinkeby: {
      accounts,
      url: `https://rinkeby.infura.io/v3/` + infuraId,
      chainId: 4,       // Ropsten's id
      gas: "auto",        // Ropsten has a lower block limit than mainnet
    },
    mainnet: {
      accounts,
      url: `https://mainnet.infura.io/v3/` + infuraId,
      gas: "auto"
    },
	binance: {
		accounts,
		url: `https://rpc.ankr.com/bsc`,
		chainId: 56,
		gas: "auto",
	}
    // Useful for private networks
    // private: {
    // provider: () => new HDWalletProvider(mnemonic, `https://network.io`),
    // network_id: 2111,   // This network is yours, in the cloud.
    // production: true    // Treats this network as if it was a public net. (default: false)
    // }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  }
};
