import { AlertTriangle } from 'lucide-react';

export default function ResponsibleAIBanner() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-warning-200 bg-warning-50 px-4 py-3 text-sm">
      <AlertTriangle className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" />
      <div className="text-warning-800">
        <span className="font-semibold">AI outputs may contain errors.</span>{' '}
        Please review all generated content before using it. Avoid submitting
        confidential or sensitive information.
      </div>
    </div>
  );
}
