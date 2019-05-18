import { ethers } from 'ethers';

export const getNetwork = () => {
  return (process.env.NODE_ENV === 'production') ? 'mainnet' : 'ropsten'
}

export const generateMnemonics = () => {
  return ethers.utils.HDNode.entropyToMnemonic(ethers.utils.randomBytes(16)).split(' ')
}

export const loadWalletFromMnemonics = async (mnemonics: string[] | string) => {
  if (!(mnemonics instanceof Array) && typeof mnemonics !== 'string') {
    throw new Error('invalid mnemonic');
  } else if (mnemonics instanceof Array) {
    mnemonics = mnemonics.join(' ');
  }

  const provider = ethers.getDefaultProvider(getNetwork()) // new ethers.providers.Web3Provider(currentProvider)
  provider.getBalance = provider.getBalance.bind(provider)
  const wallet = ethers.Wallet.fromMnemonic(mnemonics).connect(provider)
  return wallet
}