import * as React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { ethers } from "ethers";
import { EthereumContext } from "./EthereumProvider";
import { Asset } from '../lib/ethereum/assets'

class Wallet extends React.Component<{ assets: Asset[], wallet: ethers.Wallet }> {
  state = {} as Asset

  public render() {
    const { assets, wallet } = this.props;
    return (
      <View style={styles.container}>
        {assets.map((asset) => (
          <View key={asset.type} style={styles.row}>
            <Text>{asset.type}</Text>
            <Text>{wallet.address}</Text>
            <Text>Balance: {asset.balance}</Text>
            {/* <TouchableOpacity onPress={() => send({
              to: '0x24440C989754C4Ab1636c24d19e19aAb9D068493',
              amount: 0.1,
            })}>
              <Text>Send 0.1</Text>
            </TouchableOpacity> */}
          </View>
        ))}
      </View>
    );
  }
}

const WalletWithData = () => (
  <EthereumContext.Consumer>
    {({ assets, wallet, loading }) => (loading ? null : <Wallet assets={assets} wallet={wallet} />)}
  </EthereumContext.Consumer>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "flex-end",
    justifyContent: "center"
  },
  row: {
    margin: 5,
  }
});

export default WalletWithData;
