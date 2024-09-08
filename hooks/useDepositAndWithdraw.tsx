import { controllerContract, usdcContract } from "@/config/contracts";
import { ethers } from "ethers";
import { useState } from "react";
import { prepareContractCall, sendTransaction } from "thirdweb";
import { Account } from "thirdweb/wallets";

export const useDepositAndWithdraw = ({
  account,
}: {
  account: Account | undefined;
}) => {
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

  return {
    approve,
    isApproved,
    deposit,
    isDeposited,
    withdraw: () => {},
  };
};
