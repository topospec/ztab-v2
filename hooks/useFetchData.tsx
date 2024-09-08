import { useActiveAccount, useReadContract } from "thirdweb/react";
import { controllerContract, usdcContract, uvaContract } from "@/config/contracts";

export const useFetchData = () => {
  const account = useActiveAccount();

  const {
    data: collateralDeposited,
    isLoading: isLoadingCollateralDeposited,
    refetch: refetchCollateralDeposited,
  } = useReadContract({
    contract: usdcContract,
    method: "function balanceOf(address account) returns (uint256)",
    params: [account?.address || "0x"],
  });

  const {
    data: mintedUva,
    isLoading: isLoadingMintedUva,
    refetch: refetchMintedUva,
  } = useReadContract({
    contract: uvaContract,
    method: "function balanceOf(address account) returns (uint256)",
    params: [account?.address || "0x"],
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

  const {
    data: usdcAllowance,
    isLoading: isLoadingUsdcAllowance,
    refetch: refetchUsdcAllowance,
  } = useReadContract({
    contract: usdcContract,
    method: "function allowance(address owner, address spender) returns (uint256)",
    params: [account?.address || "0x", controllerContract.address],
  });

  return {
    collateralDeposited,
    mintedUva,
    userPosition,
    usdcAllowance
  };
};
