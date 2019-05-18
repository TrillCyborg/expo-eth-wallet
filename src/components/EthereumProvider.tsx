import React from 'react'
import { AsyncStorage } from 'react-native'
import { ethers } from 'ethers'
import { generateMnemonics, loadWalletFromMnemonics } from '../utils/wallet'
import env from '../../env'
// const Web3 = require('web3')

const MNEMONICS_STORAGE_KEY = '@Ethereum/mnemonics'

export enum AssetType {
  eth = 'ETH',
  dai = 'DAI',
}

export interface Asset {
  type: AssetType
  address: string,
  balance: number,
  send: (args: { to: string, amount: number }) => any
}

export interface SupportedAssets {
  [AssetType.eth]: Asset,
  [AssetType.dai]: Asset,
}

export interface Ethereum {
  wallet: ethers.Wallet,
  assets: SupportedAssets,
  loading: boolean
}

const ASSETS = [AssetType.eth]

export const EthereumContext = React.createContext({} as Ethereum)

interface EthereumProviderProps {
  children: JSX.Element
}

class EthereumProvider extends React.Component<EthereumProviderProps> {
  state = { loading: true } as Ethereum

  private sendAsset = (type: AssetType) => async (args: { to: string, amount: number }) => {
    const { wallet } = this.state
    const network = await wallet.provider.getNetwork()
    const transaction = await wallet.sendTransaction({
      to: args.to,
      value: ethers.utils.parseEther(args.amount.toString()),
      chainId: network.chainId
    });
  }

  private loadMnemonics = async (): Promise<string[]> => {
    const mnemonics = await AsyncStorage.getItem(MNEMONICS_STORAGE_KEY)
    if (mnemonics) return JSON.parse(mnemonics)

    const newMnemonics = generateMnemonics()
    await AsyncStorage.setItem(MNEMONICS_STORAGE_KEY, JSON.stringify(newMnemonics))
    return newMnemonics
  }

  private loadWallet = async () => {
    if (env) {
      // const httpProvider = await new Web3.providers.HttpProvider(`https://${network}.infura.io/v3/${env.infuraKey}`)
      // const web3 = new Web3(httpProvider);
      const mnemonics = await this.loadMnemonics()
      const wallet = await loadWalletFromMnemonics(mnemonics)
      return wallet
    } else {
      throw new Error('NO ENV')
    }
  }

  private loadAssets = async (wallet: ethers.Wallet) => {
    console.log(wallet)
    return ASSETS.reduce(async (obj: any, asset: AssetType) => {
      const address = wallet.address
      const balance = await wallet.provider.getBalance(address)
      obj[asset] = {
        type: asset,
        address,
        balance: ethers.utils.formatEther(balance),
        send: this.sendAsset(asset)
      }
      return obj
    }, {})
    
  }

  public componentDidMount = async () => {
    const wallet = await this.loadWallet()
    const assets = await this.loadAssets(wallet)
    this.setState({ wallet, assets, loading: false })
  }

  public render() {
    const { children } = this.props
    return (
      <EthereumContext.Provider value={this.state}>
        {children}
      </EthereumContext.Provider>
    )
  }
}

export default EthereumProvider