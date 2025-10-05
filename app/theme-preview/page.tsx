'use client';

import { useTheme } from '../components/ThemeProvider';

export default function ThemePreview() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: 'default', name: 'Finance (Default)', description: 'Dark navy with gold accents' },
    { id: 'celo', name: 'Celo', description: 'Black with yellow accents' },
    { id: 'solana', name: 'Solana', description: 'Purple with magenta accents' },
    { id: 'base', name: 'Base', description: 'Dark blue with Base blue' },
    { id: 'coinbase', name: 'Coinbase', description: 'Navy with Coinbase blue' },
  ];

  return (
    <main className="min-h-screen bg-bg p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="glass-card p-8">
          <h1 className="text-3xl font-bold text-fg mb-4">Theme Preview</h1>
          <p className="text-text-muted mb-6">
            Select a theme to see how TapPay looks with different color schemes
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as any)}
                className={`p-4 rounded-lg text-left transition-all duration-200 ${
                  theme === t.id
                    ? 'bg-accent text-bg'
                    : 'bg-surface hover:bg-surface-hover text-fg'
                }`}
              >
                <h3 className="font-semibold mb-1">{t.name}</h3>
                <p className={`text-sm ${theme === t.id ? 'text-bg opacity-80' : 'text-text-muted'}`}>
                  {t.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card p-8 space-y-6">
          <h2 className="text-2xl font-bold text-fg">Color Palette</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="w-full h-20 bg-bg rounded-lg border border-border" />
              <p className="text-sm text-text-muted">Background</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 bg-surface rounded-lg" />
              <p className="text-sm text-text-muted">Surface</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 bg-accent rounded-lg" />
              <p className="text-sm text-text-muted">Accent</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 bg-primary rounded-lg" />
              <p className="text-sm text-text-muted">Primary</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-8 space-y-4">
          <h2 className="text-2xl font-bold text-fg">Components</h2>
          
          <div className="space-y-4">
            <button className="btn-primary">Primary Button</button>
            <button className="btn-secondary">Secondary Button</button>
            <button className="btn-danger">Danger Button</button>
            
            <input
              type="text"
              placeholder="Input field"
              className="input-field"
            />
            
            <div className="flex gap-2">
              <span className="status-badge status-pending">Pending</span>
              <span className="status-badge status-completed">Completed</span>
              <span className="status-badge status-cancelled">Cancelled</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
