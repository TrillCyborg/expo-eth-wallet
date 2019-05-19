import React from "react";
import { ethers } from "ethers";
import {
  createWallet,
  loadWallet,
  sendAsset,
  WalletStorageType
} from "../lib/ethereum/wallet";
import { loadAssets, AssetType, Asset } from "../lib/ethereum/assets";

const ASSETS = [AssetType.eth, AssetType.dai];

export interface Ethereum {
  wallet: ethers.Wallet;
  assets: Asset[];
  sendAsset: (to: string, amount: number, type: AssetType) => Promise<ethers.providers.TransactionResponse>;
  createWallet: () => void;
  loading: boolean;
}

export const EthereumContext = React.createContext({} as Ethereum);

interface EthereumProviderProps {
  children: JSX.Element;
}

class EthereumProvider extends React.Component<EthereumProviderProps> {
  state = { loading: true } as Ethereum;

  public componentDidMount = async () => {
    try {
      const wallet = await loadWallet(WalletStorageType.privateKey);
      const assets = await loadAssets(ASSETS, wallet);
      this.setState({ wallet, assets, loading: false });
    } catch (e) {
      console.log("ERROR", e);
      this.setState({ loading: false });
    }
  };

  public sendAsset = async (to: string, amount: number, type: AssetType): Promise<ethers.providers.TransactionResponse> => {
    const transaction = await sendAsset({
      wallet: this.state.wallet,
      to,
      amount,
      type
    });
    console.log("transaction", transaction);
    return transaction
  };

  public createWallet = async () => {
    this.setState({ loading: true });
    const wallet = await createWallet();
    const assets = await loadAssets(ASSETS, wallet);
    this.setState({ wallet, assets, loading: false });
  };

  public render() {
    const { children } = this.props;
    const value = {
      ...this.state,
      createWallet: this.createWallet,
      sendAsset: this.sendAsset
    };
    return (
      <EthereumContext.Provider value={value}>
        {children}
      </EthereumContext.Provider>
    );
  }
}

export default EthereumProvider;
