import { subtitle, text, title } from "@/components/primitives";
import { client } from "@/config/contracts";
import { useFetchData } from "@/hooks/useFetchData";
import DefaultLayout from "@/layouts/default";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Spinner } from "@nextui-org/spinner";
import Link from "next/link";
import { avalancheFuji } from "thirdweb/chains";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { CaretDown } from "@phosphor-icons/react";

export default function IndexPage() {
  const account = useActiveAccount();
  const { userPosition } = useFetchData();

  console.log("userPosition", account, userPosition);

  //   if (userPosition) return (
  //     <DefaultLayout>
  //       <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
  //         <Spinner size="lg" color="primary" />
  //       </div>
  //     </DefaultLayout>
  //   );

  return (
    <DefaultLayout>
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {account ? (
          <div className="flex flex-col gap-4 items-center w-full">
            {userPosition && userPosition[0] != BigInt(0) ? (
              <Link href="/position">My Position</Link>
            ) : (
              <div className="flex flex-col items-center border border-gray-400 gap-4 rounded-xl p-6 w-full md:w-1/3">
                <h1 className={text({ size: "lg" })}>Mint your UVA</h1>
                <h1 className={text({ size: "md" })}>
                  Enter the amount of USDC you want to deposit.
                </h1>
                <Input label="Collateral Amount" />
                <CaretDown />
                <Input label="UVA Amount" />
                <Button className="w-full">Approve</Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4 items-center">
            <h1 className={title({ size: "sm" })}>
              Please, connect your wallet
            </h1>
            <h1 className={title({ color: "violet", size: "sm" })}>
              to proceed
            </h1>
            {/* <ConnectButton client={client} chain={avalancheFuji} /> */}
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}

//
// const handleApproveUSDC = async () => {
//     console.log("Approving USDC...", account?.address);
//     if (!account?.address) return;
//     const transaction = prepareContractCall({
//       contract: usdcContract,
//       method: "function approve(address spender, uint256 amount)",
//       params: [
//         controllerContract.address,
//         ethers.parseEther(amount.toString()),
//       ],
//     });
//     const { transactionHash } = await sendTransaction({
//       account,
//       transaction,
//     });

//     console.log("transactionHash", transactionHash);
//   };

//   const handleDeposit = async () => {
//     console.log("Depositing...", account?.address);
//     if (!account?.address) return;
//     const transaction = prepareContractCall({
//       contract: controllerContract,
//       method: "function deposit(uint256 collateralAmount)",
//       params: [ethers.parseEther(amount.toString())],
//     });
//     const { transactionHash } = await sendTransaction({
//       account,
//       transaction,
//     });

//     console.log("transactionHash", transactionHash);
//     refetchUserPosition();
//     refetchUsdcBalance();
//     refetchUvaBalance();
//   };

//   const handleRedeem = async () => {
//     console.log("Redeeming...", account?.address);
//     if (!account?.address) return;
//     const transaction = prepareContractCall({
//       contract: controllerContract,
//       method: "function redeem(uint256 burnAmount)",
//       params: [ethers.parseEther(amount.toString())],
//     });
//     const { transactionHash } = await sendTransaction({
//       account,
//       transaction,
//     });

//     console.log("transactionHash", transactionHash);
//     refetchUserPosition();
//     refetchUsdcBalance();
//     refetchUvaBalance();
//   };
