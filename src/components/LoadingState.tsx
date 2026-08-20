import { Sparkles } from 'lucide-react';

export default function LoadingState({ message = 'Generating...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 animate-fade-in">
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-brand-100 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-brand-600 animate-pulse" />
        </div>
        <div className="absolute inset-0 rounded-2xl border-2 border-brand-400 border-t-transparent animate-spin" style={{ animationDuration: '0.8s' }} />
      </div>
      <p className="text-sm text-slate-500 font-medium">{message}</p>
      <div className="w-48 h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div className="h-full w-1/2 rounded-full bg-brand-500 animate-[shimmer_1.2s_ease-in-out_infinite]" style={{ background: 'linear-gradient(90deg, transparent, #a855f7, transparent)', backgroundSize: '200% 100%' }} />
      </div>
    </div>
  );
}
