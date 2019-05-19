import { AsyncStorage } from 'react-native'
import { ethers } from 'ethers'
import { getNetwork } from './network'

const MNEMONICS_STORAGE_KEY = '@Ethereum/mnemonics'

export enum WalletStorageType {
  privateKey = 'PRIVATE_KEY',
  mnemonics = 'MNEMONICS'
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

  const provider = ethers.getDefaultProvider(getNetwork())
  provider.getBalance = provider.getBalance.bind(provider)
  const wallet = ethers.Wallet.fromMnemonic(mnemonics).connect(provider)
  return wallet
}

export const loadMnemonics = async (): Promise<string[]> => {
  const mnemonics = await AsyncStorage.getItem(MNEMONICS_STORAGE_KEY)
  if (mnemonics) return JSON.parse(mnemonics)

  throw new Error('No wallet in storage')
}

export const createWallet = async (): Promise<ethers.Wallet> => {
  const mnemonics = generateMnemonics()
  await AsyncStorage.setItem(MNEMONICS_STORAGE_KEY, JSON.stringify(mnemonics))
  const wallet = await loadWalletFromMnemonics(mnemonics)
  return wallet
}

export const loadWallet = async (type: WalletStorageType): Promise<ethers.Wallet> => {
  switch(type) {
    case WalletStorageType.mnemonics:
      const mnemonics = await loadMnemonics()
      const wallet = await loadWalletFromMnemonics(mnemonics)
      return wallet
    default:
      throw new Error(`Invalid WalletStorageType provided: ${type}`)
  }
}