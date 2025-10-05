'use client';

import { useState } from 'react';
import { DollarSign, CreditCard, AlertCircle } from 'lucide-react';

interface FiatWithdrawalProps {
  walletAddress: string;
  availableBalance: string;
  onWithdrawalComplete?: () => void;
}

export function FiatWithdrawal({ walletAddress, availableBalance, onWithdrawalComplete }: FiatWithdrawalProps) {
  const [amount, setAmount] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!bankAccount.trim()) {
      setError('Please enter your bank account details');
      return;
    }

    if (parseFloat(amount) > parseFloat(availableBalance)) {
      setError('Amount exceeds available balance');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Create fiat withdrawal via API
      const response = await fetch('/api/withdrawals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          cryptoAmount: parseFloat(amount),
          cryptoCurrency: 'USDC',
          bankAccountId: bankAccount.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAmount('');
        setBankAccount('');
        onWithdrawalComplete?.();
        alert('Withdrawal initiated successfully! Funds will arrive in 1-3 business days.');
      } else {
        setError(data.error || 'Failed to initiate withdrawal');
      }
    } catch (error) {
      console.error('Error initiating withdrawal:', error);
      setError('Failed to initiate withdrawal. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const conversionRate = 1.0; // Mock conversion rate
  const fiatAmount = amount ? (parseFloat(amount) * conversionRate).toFixed(2) : '0.00';

  return (
    <div className="glass-card p-6 space-y-6">
      <div>
        <h3 className="text-xl font-bold text-fg mb-2">Cash Out to Bank</h3>
        <p className="text-sm text-text-muted">
          Convert your crypto to fiat and deposit directly to your bank account
        </p>
      </div>

      <div className="space-y-4">
        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-fg mb-2">
            Amount (USDC)
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="input-field pl-10"
              min="0"
              step="0.01"
            />
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          </div>
          <p className="text-xs text-text-muted mt-1">
            Available: {availableBalance} USDC
          </p>
        </div>

        {/* Conversion Preview */}
        {amount && (
          <div className="p-4 bg-surface rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-muted">You'll receive:</span>
              <span className="font-semibold text-fg">${fiatAmount} USD</span>
            </div>
            <p className="text-xs text-text-muted mt-1">
              Rate: 1 USDC = ${conversionRate.toFixed(2)} USD
            </p>
          </div>
        )}

        {/* Bank Account Input */}
        <div>
          <label className="block text-sm font-medium text-fg mb-2">
            Bank Account Details
          </label>
          <div className="relative">
            <input
              type="text"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              placeholder="Account number or routing details"
              className="input-field pl-10"
            />
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          </div>
          <p className="text-xs text-text-muted mt-1">
            We'll use this for future withdrawals too
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 text-danger text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Withdraw Button */}
        <button
          onClick={handleWithdraw}
          disabled={isProcessing || !amount || !bankAccount}
          className="btn-primary w-full"
        >
          {isProcessing ? 'Processing...' : 'Withdraw to Bank'}
        </button>

        {/* Fee Information */}
        <div className="text-center">
          <p className="text-xs text-text-muted">
            Fee: 1% + network costs • 1-3 business days to arrive
          </p>
        </div>
      </div>
    </div>
  );
}

