import * as React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { EthereumContext, SupportedAssets, Asset, AssetType } from "./EthereumProvider";

class Wallet extends React.Component<{ assets: SupportedAssets }> {
  state = {} as Asset

  public render() {
    const { balance, address, send } = this.props.assets[AssetType.eth];
    return (
      <View style={styles.container}>
        <View>
          <Text>ETH</Text>
          <Text>{address}</Text>
          <Text>Balance: {balance}</Text>
          <TouchableOpacity onPress={() => send({
            to: '<TO_ADDRESS>',
            amount: 0.1,
          })}>
            <Text>Send 0.1</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const WalletWithData = () => (
  <EthereumContext.Consumer>
    {({ assets, loading }) => (loading ? null : <Wallet assets={assets} />)}
  </EthereumContext.Consumer>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default WalletWithData;
