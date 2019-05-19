import * as React from "react";
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { ethers } from "ethers";
import { EthereumContext } from "./EthereumProvider";
import { Asset, AssetType } from "../lib/ethereum/assets";

class Wallet extends React.Component<{
  assets: Asset[];
  wallet: ethers.Wallet;
  createWallet: () => void
  sendAsset: (to: string, amount: number, type: AssetType) => Promise<ethers.providers.TransactionResponse>
}> {
  state = { network: '' };

  public componentDidMount = async () => {
    if (this.props.wallet) {
      const network = await this.props.wallet.provider.getNetwork()
      this.setState({ network: network.name })
    }
  }

  public render() {
    const { network } = this.state
    const { assets, wallet, createWallet, sendAsset } = this.props;
    return !wallet ? (
      <View style={styles.centerContainer}>
        <TouchableOpacity onPress={createWallet}>
          <Text>Create Wallet</Text>
        </TouchableOpacity>
      </View>
    ) : (
      <View style={styles.container}>
        <Text>{network}</Text>
        {assets.map(asset => (
          <View key={asset.type} style={styles.row}>
            <Text>{asset.type}</Text>
            <Text>{wallet.address}</Text>
            <Text>Balance: {asset.balance}</Text>
            <TouchableOpacity onPress={() => sendAsset('0x24440C989754C4Ab1636c24d19e19aAb9D068493', 0.1, asset.type)}>
              <Text>Send 0.1</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  }
}

const WalletWithData = () => (
  <EthereumContext.Consumer>
    {({ assets, wallet, createWallet, sendAsset, loading }) =>
      loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <Wallet assets={assets} wallet={wallet} createWallet={createWallet} sendAsset={sendAsset} />
      )
    }
  </EthereumContext.Consumer>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "flex-end",
    justifyContent: "center"
  },
  centerContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  row: {
    margin: 5
  }
});

export default WalletWithData;
