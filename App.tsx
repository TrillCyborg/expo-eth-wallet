import './global'
import React from 'react';
import WalletProvider from './src/components/EthereumProvider'
import Wallet from './src/components/Wallet';

export default class App extends React.Component {
  render() {
    return (
      <WalletProvider>
        <Wallet />
      </WalletProvider>
    );
  }
}