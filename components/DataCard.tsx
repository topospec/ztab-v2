import React from 'react';
import { text, title } from "@/components/primitives";

interface DataItemProps {
  label: string;
  value: string;
}

export const DataItem: React.FC<DataItemProps> = ({ label, value }) => (
  <div className="flex flex-col gap-2 items-center md:items-start w-[300px]">
    <p className={text({ size: "md" })}>{label}</p>
    <p className={title({ size: "sm" })}>{value}</p>
  </div>
);

// Usage example:
{/* <DataItem label="Collateral Deposited:" value="10 USDC" /> */}