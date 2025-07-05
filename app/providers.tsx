"use client";

import * as React from "react";
import { ThirdwebProvider } from "thirdweb/react";
import { WalletUserProvider } from "@/components/providers/WalletUserProvider";
import { baseSepolia } from "thirdweb/chains";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider>
      <WalletUserProvider>{children}</WalletUserProvider>
    </ThirdwebProvider>
  );
}
