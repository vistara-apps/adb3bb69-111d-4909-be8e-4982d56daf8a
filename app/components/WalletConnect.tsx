'use client';

import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name, Avatar } from '@coinbase/onchainkit/identity';

export function WalletConnect() {
  return (
    <Wallet>
      <ConnectWallet>
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8" />
          <Name className="text-sm font-medium" />
        </div>
      </ConnectWallet>
    </Wallet>
  );
}
