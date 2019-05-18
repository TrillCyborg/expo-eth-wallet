import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import './global'

const Web3 = require('web3');

const provider = Platform.select({
  ios: 'ws://localhost:8545',
  android: 'ws://10.0.2.2:8545'
});

export default class App extends React.Component {
  componentDidMount = async () => {
    const web3 = new Web3(
      await new Web3.providers.HttpProvider('https://mainnet.infura.io/')
    );
    const derp = await web3.eth.getBlock('latest')
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
