'use client';

import { useState } from 'react';
import { Search, DollarSign, AlertCircle } from 'lucide-react';
import { IdentityCard } from './IdentityCard';
import { AmountInput } from './AmountInput';

interface TelegramUser {
  username: string;
  fullName: string;
  profilePicUrl: string;
  lastActive: string;
  mutualContacts: number;
}

export function SendCryptoForm() {
  const [username, setUsername] = useState('');
  const [amount, setAmount] = useState('');
  const [isTestTransfer, setIsTestTransfer] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!username.trim()) {
      setError('Please enter a Telegram username');
      return;
    }

    setIsSearching(true);
    setError('');

    // Simulate API call to Telegram Bot API
    setTimeout(() => {
      // Mock user data
      setUser({
        username: username.trim(),
        fullName: 'John Doe',
        profilePicUrl: 'https://via.placeholder.com/100',
        lastActive: '2 hours ago',
        mutualContacts: 5,
      });
      setIsSearching(false);
    }, 1000);
  };

  const handleSend = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    // Handle transaction submission
    console.log('Sending', amount, 'to', user?.username, 'Test:', isTestTransfer);
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="glass-card p-6 space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-fg mb-2">Send Crypto</h2>
          <p className="text-sm text-text-muted">
            Enter a Telegram username to get started
          </p>
        </div>

        <div className="relative">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="@username"
            className="input-field pl-10"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
        </div>

        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="btn-primary w-full"
        >
          {isSearching ? 'Searching...' : 'Find User'}
        </button>

        {error && (
          <div className="flex items-center gap-2 text-danger text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
      </div>

      {/* Identity Card */}
      {user && (
        <IdentityCard
          username={user.username}
          fullName={user.fullName}
          profilePicUrl={user.profilePicUrl}
          lastActive={user.lastActive}
          mutualContacts={user.mutualContacts}
        />
      )}

      {/* Amount Input */}
      {user && (
        <div className="glass-card p-6 space-y-4">
          <AmountInput
            value={amount}
            onChange={setAmount}
            currency="USDC"
          />

          <div className="flex items-center gap-3 p-4 bg-surface rounded-lg">
            <input
              type="checkbox"
              id="testTransfer"
              checked={isTestTransfer}
              onChange={(e) => setIsTestTransfer(e.target.checked)}
              className="w-5 h-5 rounded accent-accent"
            />
            <label htmlFor="testTransfer" className="text-sm text-fg cursor-pointer">
              <span className="font-medium">Test Transfer</span>
              <span className="block text-xs text-text-muted mt-1">
                5-minute cancellation window
              </span>
            </label>
          </div>

          <button
            onClick={handleSend}
            className="btn-primary w-full"
          >
            {isTestTransfer ? 'Send Test Transfer' : 'Send Now'}
          </button>

          <p className="text-xs text-text-muted text-center">
            Fee: 0.5% (max $2) • Powered by Base
          </p>
        </div>
      )}
    </div>
  );
}
