'use client';

import { useState } from 'react';
import { SendCryptoForm } from './components/SendCryptoForm';
import { TransactionFeed } from './components/TransactionFeed';
import { WalletConnect } from './components/WalletConnect';
import { Send, History, Wallet } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'send' | 'history'>('send');

  return (
    <main className="min-h-screen bg-bg">
      {/* Header */}
      <header className="glass-card border-b border-border">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-bg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-fg">TapPay</h1>
                <p className="text-xs text-text-muted">Send crypto instantly</p>
              </div>
            </div>
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="glass-card p-1 flex gap-1">
          <button
            onClick={() => setActiveTab('send')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'send'
                ? 'bg-accent text-bg'
                : 'text-text-muted hover:text-fg'
            }`}
          >
            <Send className="w-4 h-4" />
            Send
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'history'
                ? 'bg-accent text-bg'
                : 'text-text-muted hover:text-fg'
            }`}
          >
            <History className="w-4 h-4" />
            History
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 pb-8">
        {activeTab === 'send' ? <SendCryptoForm /> : <TransactionFeed />}
      </div>

      {/* Footer */}
      <footer className="max-w-md mx-auto px-4 py-8 text-center">
        <p className="text-sm text-text-muted">
          Powered by Base • Secured by OnchainKit
        </p>
      </footer>
    </main>
  );
}
