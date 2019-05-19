import React from 'react'
import { ethers } from 'ethers'
import { loadWallet, WalletStorageType } from '../lib/ethereum/wallet'
import { loadAssets, AssetType, Asset } from '../lib/ethereum/assets'

const ASSETS = [AssetType.eth, AssetType.dai]

export interface Ethereum {
  wallet: ethers.Wallet,
  assets: Asset[],
  send?: (args: { to: string, amount: number, type: AssetType }) => any
  loading: boolean
}

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

  public componentDidMount = async () => {
    const wallet = await loadWallet(WalletStorageType.mnemonics)
    const assets = await loadAssets(ASSETS, wallet)
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