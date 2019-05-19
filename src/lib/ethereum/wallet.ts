import { AsyncStorage } from 'react-native'
import { ethers } from 'ethers'
import { AssetType, sendEther, sendToken } from './assets'
import { getNetwork } from './network'

const PRIVATE_KEY_STORAGE_KEY = '@Ethereum/privatekey'

export enum WalletStorageType {
  privateKey = 'PRIVATE_KEY',
  mnemonics = 'MNEMONICS'
}

const generateMnemonics = () => {
  return ethers.utils.HDNode.entropyToMnemonic(ethers.utils.randomBytes(16)).split(' ')
}

const loadWalletFromMnemonics = async (mnemonics: string[]) => {
  if (!(mnemonics instanceof Array)) throw new Error('invalid mnemonic');

  const provider = ethers.getDefaultProvider(getNetwork())
  provider.getBalance = provider.getBalance.bind(provider)
  const wallet = ethers.Wallet.fromMnemonic(mnemonics.join(' ')).connect(provider)
  return wallet
}

const loadWalletFromPrivateKey = async (privateKey: string): Promise<ethers.Wallet> => {
  const provider = ethers.getDefaultProvider(getNetwork())
  provider.getBalance = provider.getBalance.bind(provider)
  const wallet = new ethers.Wallet(privateKey, provider)
  return wallet
}

export const createWallet = async (): Promise<ethers.Wallet> => {
  const mnemonics = generateMnemonics()
  const wallet = await loadWalletFromMnemonics(mnemonics)
  await AsyncStorage.setItem(PRIVATE_KEY_STORAGE_KEY, JSON.stringify(wallet.privateKey))
  return wallet
}

export const loadWallet = async (type: WalletStorageType, mnemonics?: string[]): Promise<ethers.Wallet> => {
  switch(type) {
    case WalletStorageType.privateKey:
      const privateKey = await AsyncStorage.getItem(PRIVATE_KEY_STORAGE_KEY)
      if (!privateKey) throw new Error(`No private key in storage`)
      return loadWalletFromPrivateKey(JSON.parse(privateKey))
    case WalletStorageType.mnemonics:
      if (!mnemonics) throw new Error(`No mnemonics provided`)
      return loadWalletFromMnemonics(mnemonics)
  }
}

export const sendAsset = async (args: { wallet: ethers.Wallet, to: string, amount: number, type: AssetType }): Promise<ethers.providers.TransactionResponse> => {
  const { type } = args
  return type === AssetType.eth ? sendEther(args) : sendToken(args)
}