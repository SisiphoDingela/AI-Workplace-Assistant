import { AlertCircle, X } from 'lucide-react';

type Props = {
  message: string;
  onDismiss?: () => void;
};

export default function ErrorState({ message, onDismiss }: Props) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-error-200 bg-error-50 px-4 py-3 text-sm animate-fade-in">
      <AlertCircle className="w-5 h-5 text-error-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1 text-error-700">
        <span className="font-semibold">Something went wrong.</span> {message}
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="text-error-400 hover:text-error-600 transition-colors">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
