import { useState, useCallback } from 'react';
import { Check, Copy } from 'lucide-react';

type Props = {
  text: string;
  className?: string;
  label?: string;
};

export default function CopyButton({ text, className = '', label = 'Copy' }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className={`btn-ghost ${copied ? 'text-accent-600' : ''} ${className}`}
      aria-label={label}
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      <span>{copied ? 'Copied' : label}</span>
    </button>
  );
}
