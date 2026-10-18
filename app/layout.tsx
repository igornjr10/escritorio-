import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Igor AI Office — Maya', description: 'Seu escritório de agentes, com geração de conteúdo e sessões persistentes.' };
export default function Layout({ children }: { children: React.ReactNode }) { return <html lang="pt-BR"><body>{children}</body></html>; }
