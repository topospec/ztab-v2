import { useState } from "react";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";
import { createThirdwebClient } from "thirdweb";
import {
  ThirdwebProvider,
  ConnectButton,
  useReadContract,
  useActiveAccount,
  useSendTransaction,
} from "thirdweb/react";

import { Button } from "@nextui-org/button";

import { avalancheFuji } from "thirdweb/chains";
import { getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { ethers } from "ethers";

import { Input } from "@nextui-org/input";
import { Snippet } from "@nextui-org/snippet";

const usdcContractAddress = "0x08567a4A9f88410D2C05204b2975547f544704Ef"
const uvaContractAddress = "0x118bE851988B81CE66BAA2C27f8065d87E0b3Db8"
const oracleContractAddress = "0x57402D66a3cFce175d74bbD8E25530Ae2ac9EdED"
const controllerContractAddress = "0x93948Bf62D2E249Da00F631b01825B3a782dDE9c"

export const client = createThirdwebClient({
  clientId: "e6c88ae7c6925f796587bcc7b7958c19",
});

export default function IndexPage() {
  const usdcContract = getContract({
    client,
    address: usdcContractAddress,
    chain: avalancheFuji,
  });

  const uvaContract = getContract({
    client,
    address: uvaContractAddress,
    chain: avalancheFuji,
  });

  const oracleContract = getContract({
    client,
    address: oracleContractAddress,
    chain: avalancheFuji,
  });

  const controllerContract = getContract({
    client,
    address: controllerContractAddress,
    chain: avalancheFuji,
  });

  const account = useActiveAccount();

  const {
    data: usdcBalance,
    isLoading: isLoadingUsdcBalance,
    refetch: refetchUsdcBalance,
  } = useReadContract({
    contract: usdcContract,
    method: "function balanceOf(address account) returns (uint256)",
    params: [account?.address || "0x"],
  });

  const {
    data: uvaBalance,
    isLoading: isLoadingUvaBalance,
    refetch: refetchUvaBalance,
  } = useReadContract({
    contract: uvaContract,
    method: "function balanceOf(address account) returns (uint256)",
    params: [account?.address || "0x"],
  });

  const {
    data: uvaPrice,
    isLoading: isLoadingUvaPrice,
    refetch: refetchUvaPrice,
  } = useReadContract({
    contract: oracleContract,
    method: "function getUVAPrice() returns (uint256)",
  });

  const {
    data: userPosition,
    isLoading: isLoadingUserPosition,
    refetch: refetchUserPosition,
  } = useReadContract({
    contract: controllerContract,
    method:
      "function getUserPosition(address user) returns (uint256,uint256,uint256,uint256,uint256,uint256,int256)",
    params: [account?.address || "0x"],
  });

  const { mutate: sendTx, data: transactionResult } = useSendTransaction();

  console.log("transactionResult", transactionResult);

  const [amount, setAmount] = useState(0);

  const handleApproveUSDC = async () => {
    console.log("Approving USDC...", account?.address);
    if (!account?.address) return;
    const transaction = prepareContractCall({
      contract: usdcContract,
      method: "function approve(address spender, uint256 amount)",
      params: [
        controllerContract.address,
        ethers.parseEther(amount.toString()),
      ],
    });
    const { transactionHash } = await sendTransaction({
      account,
      transaction,
    });

    console.log("transactionHash", transactionHash);
  };

  const handleDeposit = async () => {
    console.log("Depositing...", account?.address);
    if (!account?.address) return;
    const transaction = prepareContractCall({
      contract: controllerContract,
      method: "function deposit(uint256 collateralAmount)",
      params: [ethers.parseEther(amount.toString())],
    });
    const { transactionHash } = await sendTransaction({
      account,
      transaction,
    });

    console.log("transactionHash", transactionHash);
    refetchUserPosition();
    refetchUsdcBalance();
    refetchUvaBalance();
  };

  const handleRedeem = async () => {
    console.log("Redeeming...", account?.address);
    if (!account?.address) return;
    const transaction = prepareContractCall({
      contract: controllerContract,
      method: "function redeem(uint256 burnAmount)",
      params: [ethers.parseEther(amount.toString())],
    });
    const { transactionHash } = await sendTransaction({
      account,
      transaction,
    });

    console.log("transactionHash", transactionHash);
    refetchUserPosition();
    refetchUsdcBalance();
    refetchUvaBalance();
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-4 md:py-10">
        <div className="inline-block max-w-xl text-center justify-center">
          <h1 className={title()}>HOLD&nbsp;</h1>
          <h1 className={title({ color: "violet" })}>UVA&nbsp;</h1>
          <br />
          <img src="/maslata.png" alt="maslata" width={250} className="mt-4 mb-4" />
        </div>

        <div className="flex flex-row gap-4 w-full">
          <div className="flex flex-col gap-4 w-1/3">
            <Snippet
              hideCopyButton
              variant="bordered"
              className="flex flex-col w-full items-start overflow-auto"
              symbol={<></>}
            >
              <p className="text-xl font-bold mb-4">UVA Values</p>
              <p className="text-base font-semibold">
                USDC Balance:{" "}
                {parseFloat(
                  ethers.formatEther(usdcBalance || "0")
                ).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                USDC
              </p>
              <p className="text-sm text-gray-600 mb-3">
                Your current USDC balance available for deposit.
              </p>
              <p className="text-base font-semibold">
                UVA Balance:{" "}
                {parseFloat(ethers.formatEther(uvaBalance || "0")).toFixed(6)}{" "}
                UVA
              </p>
              <p className="text-sm text-gray-600 mb-3">
                Your current UVA token balance.
              </p>
              <p className="text-base font-semibold">
                UVA Price (from oracle):{" "}
                {parseFloat(ethers.formatEther(uvaPrice || "0")).toFixed(2)}{" "}
                USDC/UVA
              </p>
              <p className="text-sm text-gray-600 mb-3">
                The current price of UVA tokens.
              </p>
            </Snippet>
            <Snippet
              hideCopyButton
              variant="bordered"
              className="flex flex-col w-full items-start whitespace-normal pb-4"
              symbol={<></>}
            >
              <p className="text-xl font-bold mb-4">Mint & Redeem</p>

              <Input
                label="Amount"
                onChange={(e) => setAmount(Number(e.target.value))}
                className="mb-4 w-full min-w-[300px]"
              />
              <div className="flex gap-4">
                <Button
                  onClick={handleDeposit}
                  color="primary"
                  className="w-1/2"
                >
                  Mint
                </Button>
                <Button
                  onClick={handleRedeem}
                  color="secondary"
                  className="w-1/2"
                >
                  Redeem
                </Button>
                <Button
                  onClick={handleApproveUSDC}
                  color="secondary"
                  className="w-1/2"
                >
                  Approve
                </Button>
              </div>
            </Snippet>
          </div>
          <Snippet
            hideCopyButton
            variant="bordered"
            className="flex flex-col w-2/3 items-start h-full overflow-auto"
            symbol={<></>}
          >
            <p className="text-xl font-bold mb-4">My Position</p>
            {userPosition && (
              <>
                <p className="text-base font-semibold">
                  Collateral Amount:{" "}
                  {parseFloat(
                    ethers.formatUnits(userPosition[0] || "0", 18)
                  ).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  USDC
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  The amount of USDC deposited as collateral. Typically 1 USDC
                  or more.
                </p>
                <p className="text-base font-semibold">
                  Minted Tokens:{" "}
                  {parseFloat(
                    ethers.formatUnits(userPosition[1] || "0", 18)
                  ).toFixed(6)}{" "}
                  UVA
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  The amount of UVA tokens created against the collateral.
                  Usually less than the collateral amount.
                </p>
                <p className="text-base font-semibold">
                  Current Collateral Ratio:{" "}
                  {(Number(userPosition[2])).toFixed(2)}%
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  The current ratio of collateral value to minted token value.
                  Healthy positions are typically 150% or higher.
                </p>
                <p className="text-base font-semibold">
                  Liquidation Threshold:{" "}
                  {(Number(userPosition[3])).toFixed(2)}%
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  The collateral ratio at which the position becomes
                  liquidatable. Typically around 120%.
                </p>
                <p className="text-base font-semibold">
                  Distance to Liquidation:{" "}
                  {(Number(userPosition[4]) / 100).toFixed(2)}%
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  How far the current ratio is from the liquidation threshold.
                  Higher is safer. Below 10% might be risky.
                </p>
                <p className="text-base font-semibold">
                  Liquidation Price:{" "}
                  {parseFloat(
                    ethers.formatUnits(userPosition[5] || "0", 18)
                  ).toFixed(2)}{" "}
                  USDC/UVA
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  The UVA price at which the position would become liquidatable.
                  Higher than current UVA price is safer.
                </p>
                <p className="text-base font-semibold">
                  Safety Buffer:{" "}
                  {parseFloat(
                    ethers.formatUnits(userPosition[6] || "0", 18)
                  ).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  USDC
                </p>
                <p className="text-sm text-gray-600">
                  Amount of collateral that can be withdrawn while maintaining
                  minimum collateralization. Higher is better.
                </p>
              </>
            )}
          </Snippet>
        </div>
      </section>
    </DefaultLayout>
  );
}
