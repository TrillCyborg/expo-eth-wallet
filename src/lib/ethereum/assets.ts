import { ethers } from 'ethers'
import { Networks, getNetwork } from './network'

export enum AssetType {
  eth = 'ETH',
  dai = 'DAI',
}

export interface Asset {
  type: AssetType
  balance: number,
}

const TOKENS = {
  [Networks.mainnet]: {
    [AssetType.dai]: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359'
  },
  [Networks.ropsten]: {
    [AssetType.dai]: '0xa1b8a2c7a942963165fe5747d3ea960070ea4dc7'
  }
}

// The minimum ABI to get ERC20 Token balance
let minTokenABI = [
  // balanceOf
  {
    "constant":true,
    "inputs":[{"name":"_owner","type":"address"}],
    "name":"balanceOf",
    "outputs":[{"name":"balance","type":"uint256"}],
    "type":"function"
  },
  // decimals
  {
    "constant":true,
    "inputs":[],
    "name":"decimals",
    "outputs":[{"name":"","type":"uint8"}],
    "type":"function"
  }
];

export const getEtherBalance = async (wallet: ethers.Wallet): Promise<number> => {
  const balance = await wallet.provider.getBalance(wallet.address)
  return parseInt(ethers.utils.formatEther(balance), 10)
}

export const getTokenBalance = async (tokenAddress: string, wallet: ethers.Wallet): Promise<number> => {
  let contract = new ethers.Contract(tokenAddress, minTokenABI, wallet);
  const balance: ethers.utils.BigNumber = await contract.balanceOf(wallet.address);
  const decimals: number = await contract.decimals()
  const tokenBalance = balance.toNumber() / Math.pow(10, decimals)
  return tokenBalance
}

export const loadAssets = async (assets: AssetType[], wallet: ethers.Wallet): Promise<Asset[]> => {
  const tokensAddresses = TOKENS[getNetwork()]
  return await Promise.all(assets.map(async (asset: AssetType) => {
    switch (asset) {
      case AssetType.eth:
        return {
          type: asset,
          balance: await getEtherBalance(wallet)
        }
      case AssetType.dai:
        return {
          type: asset,
          balance: await getTokenBalance(tokensAddresses[AssetType.dai], wallet)
        }
    }
  }))
}