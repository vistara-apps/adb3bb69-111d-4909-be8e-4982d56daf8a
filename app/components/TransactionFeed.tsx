'use client';

import { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { CountdownTimer } from './CountdownTimer';

interface Transaction {
  id: string;
  type: 'sent' | 'received';
  username: string;
  amount: string;
  currency: string;
  status: 'pending' | 'completed' | 'cancelled';
  timestamp: string;
  isTestTransfer: boolean;
  cancellableUntil?: string;
}

export function TransactionFeed() {
  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'sent',
      username: 'johndoe',
      amount: '25.00',
      currency: 'USDC',
      status: 'pending',
      timestamp: '2 minutes ago',
      isTestTransfer: true,
      cancellableUntil: new Date(Date.now() + 3 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      type: 'received',
      username: 'alice',
      amount: '50.00',
      currency: 'USDC',
      status: 'completed',
      timestamp: '1 hour ago',
      isTestTransfer: false,
    },
    {
      id: '3',
      type: 'sent',
      username: 'bob',
      amount: '10.00',
      currency: 'USDC',
      status: 'cancelled',
      timestamp: '3 hours ago',
      isTestTransfer: true,
    },
  ]);

  const handleCancelTransfer = (id: string) => {
    console.log('Cancelling transfer:', id);
  };

  return (
    <div className="space-y-4">
      <div className="glass-card p-6">
        <h2 className="text-2xl font-bold text-fg mb-2">Transaction History</h2>
        <p className="text-sm text-text-muted">
          View all your transfers and their status
        </p>
      </div>

      {transactions.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-text-muted">No transactions yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx.id} className="glass-card p-4 hover:bg-surface-hover transition-all duration-200">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  tx.type === 'sent' ? 'bg-primary bg-opacity-20' : 'bg-success bg-opacity-20'
                }`}>
                  {tx.type === 'sent' ? (
                    <ArrowUpRight className="w-5 h-5 text-primary" />
                  ) : (
                    <ArrowDownLeft className="w-5 h-5 text-success" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <p className="font-semibold text-fg">
                        {tx.type === 'sent' ? 'Sent to' : 'Received from'} @{tx.username}
                      </p>
                      <p className="text-sm text-text-muted">{tx.timestamp}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-fg">
                        {tx.type === 'sent' ? '-' : '+'}${tx.amount}
                      </p>
                      <p className="text-xs text-text-muted">{tx.currency}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <StatusBadge status={tx.status} />
                    {tx.isTestTransfer && (
                      <span className="text-xs text-text-muted">Test Transfer</span>
                    )}
                  </div>

                  {tx.status === 'pending' && tx.cancellableUntil && (
                    <div className="mt-3 p-3 bg-surface rounded-lg space-y-2">
                      <CountdownTimer targetDate={tx.cancellableUntil} />
                      <button
                        onClick={() => handleCancelTransfer(tx.id)}
                        className="btn-danger w-full text-sm py-2"
                      >
                        Cancel Transfer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
