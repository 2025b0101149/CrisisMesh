import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-6">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-white mb-2">404 - Sector Not Found</h1>
      <p className="text-slate-400 max-w-md mb-8">
        The requested emergency coordination route or coordinate does not exist in the CrisisMesh grid.
      </p>
      <Link to="/">
        <Button variant="secondary" icon={ArrowLeft}>
          Return to Mission Control
        </Button>
      </Link>
    </div>
  );
}
