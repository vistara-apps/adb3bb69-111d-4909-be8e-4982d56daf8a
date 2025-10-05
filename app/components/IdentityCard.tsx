'use client';

import { Users, Clock } from 'lucide-react';
import Image from 'next/image';

interface IdentityCardProps {
  username: string;
  fullName: string;
  profilePicUrl: string;
  lastActive: string;
  mutualContacts: number;
  variant?: 'default' | 'skeleton';
}

export function IdentityCard({
  username,
  fullName,
  profilePicUrl,
  lastActive,
  mutualContacts,
  variant = 'default',
}: IdentityCardProps) {
  if (variant === 'skeleton') {
    return (
      <div className="glass-card p-6 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-surface rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-surface rounded w-32" />
            <div className="h-4 bg-surface rounded w-24" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-surface">
          <Image
            src={profilePicUrl}
            alt={fullName}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-fg">{fullName}</h3>
          <p className="text-sm text-text-muted">@{username}</p>
        </div>
      </div>

      <div className="flex items-center gap-6 pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-accent" />
          <span className="text-text-muted">
            {mutualContacts} mutual contacts
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-accent" />
          <span className="text-text-muted">Active {lastActive}</span>
        </div>
      </div>
    </div>
  );
}
