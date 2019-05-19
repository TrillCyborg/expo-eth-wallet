export enum Networks {
  mainnet = 'mainnet',
  ropsten = 'ropsten'
}

export const getNetwork = (): Networks => {
  return (process.env.NODE_ENV === 'production') ? Networks.mainnet : Networks.ropsten
}