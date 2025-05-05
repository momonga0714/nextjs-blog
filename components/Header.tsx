// components/Header.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bell, User } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
      {/* ロゴ */}
      <div className="text-2xl font-bold">YourLogo</div>

      {/* 検索バー */}
      <div className="flex-1 mx-6">
        <Input placeholder="キーワードやクリエイターで検索" />
      </div>

      {/* アイコン群 */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon">
          <Bell />
        </Button>
        <Button variant="ghost" size="icon">
          <User />
        </Button>
      </div>
    </header>
  );
};
