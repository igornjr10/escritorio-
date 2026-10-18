'use client';
import dynamic from 'next/dynamic';
const Office = dynamic(() => import('../components/Office'), { ssr: false, loading: () => <div className="loading">Preparando seu escritório…</div> });
export default function Page() { return <Office />; }
