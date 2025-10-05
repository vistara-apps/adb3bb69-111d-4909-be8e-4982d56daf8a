'use client';

import { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { CountdownTimer } from './CountdownTimer';

interface Transfer {
  transfer_id: string;
  sender_id?: string;
  recipient_id?: string;
  recipient_telegram_username: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'cancelled' | 'failed';
  is_test_transfer: boolean;
  cancellable_until?: string;
  created_at: string;
  completed_at?: string;
}

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
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    try {
      // In a real app, you'd get the current user ID from authentication
      // For now, we'll use a mock user ID
      const userId = 'mock-user-id';

      const response = await fetch(`/api/transfers?userId=${userId}`);
      const data = await response.json();

      if (data.success) {
        setTransfers(data.transfers);
      } else {
        setError(data.error || 'Failed to load transfers');
      }
    } catch (error) {
      console.error('Error fetching transfers:', error);
      setError('Failed to load transfers');
    } finally {
      setLoading(false);
    }
  };

  const transactions: Transaction[] = transfers.map((transfer) => ({
    id: transfer.transfer_id,
    type: transfer.sender_id ? 'sent' : 'received',
    username: transfer.recipient_telegram_username,
    amount: transfer.amount.toFixed(2),
    currency: transfer.currency,
    status: transfer.status,
    timestamp: new Date(transfer.created_at).toLocaleString(),
    isTestTransfer: transfer.is_test_transfer,
    cancellableUntil: transfer.cancellable_until,
  }));

  const handleCancelTransfer = async (id: string) => {
    try {
      const response = await fetch(`/api/transfers/${id}/cancel`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        // Refresh transfers
        await fetchTransfers();
        alert('Transfer cancelled successfully');
      } else {
        alert(data.error || 'Failed to cancel transfer');
      }
    } catch (error) {
      console.error('Error cancelling transfer:', error);
      alert('Failed to cancel transfer');
    }
  };

  return (
    <div className="space-y-4">
      <div className="glass-card p-6">
        <h2 className="text-2xl font-bold text-fg mb-2">Transaction History</h2>
        <p className="text-sm text-text-muted">
          View all your transfers and their status
        </p>
      </div>

      {loading ? (
        <div className="glass-card p-12 text-center">
          <p className="text-text-muted">Loading transactions...</p>
        </div>
      ) : error ? (
        <div className="glass-card p-12 text-center">
          <p className="text-danger">{error}</p>
        </div>
      ) : transactions.length === 0 ? (
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
