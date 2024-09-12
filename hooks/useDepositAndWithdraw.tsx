import { controllerContract, usdcContract } from "@/config/contracts";
import { ethers } from "ethers";
import { useState } from "react";
import { prepareContractCall, sendTransaction } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { Account } from "thirdweb/wallets";

export const useDepositAndWithdraw = () => {
  const account = useActiveAccount();

  const [isApproved, setIsApproved] = useState(false);
  const [isDeposited, setIsDeposited] = useState(false);

  const approve = async (amount: number) => {
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

    if (transactionHash) {
      setIsApproved(true);
    }
  };

  const deposit = async (amount: number) => {
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
    if (transactionHash) {
      setIsApproved(false);
      setIsDeposited(true);
    }
  };

  const redeem = async (amount: number) => {
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
  };

  const closePosition = async () => {
    console.log("Closing position...", account?.address);
    if (!account?.address) return;
    const transaction = prepareContractCall({
      contract: controllerContract,
      method: "function closePosition()",
    });
    const { transactionHash } = await sendTransaction({
      account,
      transaction,
    });
  };

  return {
    approve,
    deposit,
    closePosition,
    isApproved,
    isDeposited,
    redeem,
  };
};
