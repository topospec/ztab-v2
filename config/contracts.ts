import { createThirdwebClient, getContract } from "thirdweb";
import { avalancheFuji } from "thirdweb/chains";

const usdcContractAddress = "0x08567a4A9f88410D2C05204b2975547f544704Ef";
const uvaContractAddress = "0x118bE851988B81CE66BAA2C27f8065d87E0b3Db8";
const oracleContractAddress = "0x57402D66a3cFce175d74bbD8E25530Ae2ac9EdED";
const controllerContractAddress = "0x93948Bf62D2E249Da00F631b01825B3a782dDE9c";

export const client = createThirdwebClient({
  clientId: "e6c88ae7c6925f796587bcc7b7958c19",
});

export const usdcContract = getContract({
  client,
  address: usdcContractAddress,
  chain: avalancheFuji,
});

export const uvaContract = getContract({
  client,
  address: uvaContractAddress,
  chain: avalancheFuji,
});

export const oracleContract = getContract({
  client,
  address: oracleContractAddress,
  chain: avalancheFuji,
});

export const controllerContract = getContract({
  client,
  address: controllerContractAddress,
  chain: avalancheFuji,
});