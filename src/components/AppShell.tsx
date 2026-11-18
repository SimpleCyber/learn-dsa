'use client';

import React, { useState } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { DsaProvider } from '@/context/DsaContext';
import { ToastProvider } from '@/components/Toast';
import { Navbar } from '@/components/Navbar';
import { CommandPalette } from '@/components/CommandPalette';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <ThemeProvider>
      <DsaProvider>
        <ToastProvider>
          <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-zinc-950 text-stone-900 dark:text-zinc-100 transition-colors duration-200 w-full overflow-x-hidden">
            <Navbar onOpenPalette={() => setPaletteOpen(true)} />
            <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-8 min-w-0">
              {children}
            </main>
            <CommandPalette
              isOpen={paletteOpen}
              onClose={() => setPaletteOpen(false)}
            />
          </div>
        </ToastProvider>
      </DsaProvider>
    </ThemeProvider>
  );
}
