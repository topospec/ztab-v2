import { DataItem } from "@/components/DataCard";
import { text, title } from "@/components/primitives";
import { useDepositAndWithdraw } from "@/hooks/useDepositAndWithdraw";
import { useFetchData } from "@/hooks/useFetchData";
import DefaultLayout from "@/layouts/default";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Input } from "@nextui-org/input";
import { ethers } from "ethers";
import React, { useEffect, useMemo, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import Confetti from "react-dom-confetti";

const config = {
  angle: 90,
  spread: 360,
  startVelocity: 40,
  elementCount: 70,
  dragFriction: 0.12,
  duration: 3000,
  stagger: 3,
  width: "10px",
  height: "10px",
  perspective: "500px",
  colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
};

const Position = () => {
  const account = useActiveAccount();

  const { collateralDeposited, mintedUva, userPosition } = useFetchData();
  const { approve, isApproved, deposit, isDeposited } = useDepositAndWithdraw({
    account,
  });

  const [depositAmount, setDepositAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);

  const [success, setSuccess] = useState(false);

  

  const successMemo = useMemo(() => {
    if (isDeposited) {
      setSuccess(true);
    }
    return success;
  }, [isDeposited, success]);

  return (
    <DefaultLayout>
      <section className="flex flex-col gap-8">
        <div className="inline-block max-w-xl">
          <h1 className={title({ size: "sm" })}>My Position:&nbsp;</h1>
          <h1 className={title({ color: "violet", size: "sm" })}>
            UVA/USDC&nbsp;
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          <div className="flex flex-col border border-gray-400 rounded-xl p-6 w-full">
            <div className="flex flex-row justify-between items-center">
              <p className={text({ size: "lg" })}>Overview:</p>
              <Chip color="success">Healthy</Chip>
            </div>

            <div className="hidden md:flex flex-col gap-6 mt-4">
              <div className="flex flex-row justify-center gap-12">
                <DataItem
                  label="Collateral Deposited:"
                  value={parseFloat(
                    ethers.formatEther(collateralDeposited || "0")
                  ).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                />
                <DataItem
                  label="Minted UVA:"
                  value={parseFloat(
                    ethers.formatEther(mintedUva || "0")
                  ).toFixed(2)}
                />
              </div>
              <div className="flex flex-row justify-center gap-12">
                <DataItem
                  label="Collateral Ratio:"
                  value={`${Number(userPosition && userPosition[2]).toFixed(
                    2
                  )}%`}
                />
                <DataItem
                  label="Liquidation Treshold:"
                  value={`${Number(userPosition && userPosition[3]).toFixed(
                    2
                  )}%`}
                />
              </div>
              <div className="flex flex-row justify-center gap-12">
                <DataItem
                  label="Liquidation Price:"
                  value={parseFloat(
                    ethers.formatUnits(
                      (userPosition && userPosition[5]) || "0",
                      18
                    )
                  ).toFixed(2)}
                />
                <DataItem
                  label="Safety Buffer:"
                  value={`${parseFloat(
                    ethers.formatUnits(
                      (userPosition && userPosition[6]) || "0",
                      18
                    )
                  ).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
                />
              </div>
            </div>

            <div className="md:hidden flex flex-col gap-6 mt-4 items-center">
              <DataItem
                label="Collateral Deposited:"
                value={parseFloat(
                  ethers.formatEther(collateralDeposited || "0")
                ).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              />
              <DataItem
                label="Minted UVA:"
                value={parseFloat(ethers.formatEther(mintedUva || "0")).toFixed(
                  2
                )}
              />
              <DataItem
                label="Collateral Ratio:"
                value={`${Number(userPosition && userPosition[2]).toFixed(2)}%`}
              />
              <DataItem
                label="Liquidation Treshold:"
                value={`${Number(userPosition && userPosition[3]).toFixed(2)}%`}
              />
              <DataItem
                label="Liquidation Price:"
                value={parseFloat(
                  ethers.formatUnits(
                    (userPosition && userPosition[5]) || "0",
                    18
                  )
                ).toFixed(2)}
              />
              <DataItem
                label="Safety Buffer:"
                value={`${parseFloat(
                  ethers.formatUnits(
                    (userPosition && userPosition[6]) || "0",
                    18
                  )
                ).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
              />
            </div>
          </div>
          <div className="flex flex-col border border-gray-400 rounded-xl p-6 w-full">
            <p className={text({ size: "lg" })}>Configure UVA/USDC position:</p>
            <div className="flex flex-col gap-1 mt-4">
              <p className={text({ size: "sm" })}>Deposit Collateral</p>
              <Input
                label="Collateral Amount"
                onChange={(e) => setDepositAmount(Number(e.target.value))}
              />
              {isApproved ? (
                <Button className="mt-2" onClick={() => approve(depositAmount)}>
                  Approve
                </Button>
              ) : (
                <Button className="mt-2" onClick={() => deposit(depositAmount)}>
                  Mint UVA
                </Button>
              )}
            </div>
            <div className="flex flex-col gap-1 mt-4">
              <p className={text({ size: "sm" })}>Withdraw UVA</p>
              <Input label="Collateral Amount" />
              <Button className="mt-2">Withdraw</Button>
            </div>
          </div>
        </div>
      </section>
      <Confetti active={success} config={config} />
    </DefaultLayout>
  );
};

export default Position;
