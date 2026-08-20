import { useState } from 'react';
import { Mail, RotateCcw, Trash2, Sparkles, Edit3, Check } from 'lucide-react';
import { generateEmail, type EmailInput } from '@/lib/ai';
import { logActivity } from '@/lib/supabase';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import CopyButton from '@/components/CopyButton';
import ResponsibleAIBanner from '@/components/ResponsibleAIBanner';

const tones = ['Professional', 'Friendly', 'Formal', 'Concise', 'Persuasive', 'Appreciative'];

const emptyInput: EmailInput = {
  purpose: '',
  recipient: '',
  tone: 'Professional',
  keyPoints: '',
};

export default function EmailGenerator() {
  const [input, setInput] = useState<EmailInput>(emptyInput);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');

  const canGenerate = input.purpose.trim().length > 0;

  async function handleGenerate() {
    if (!canGenerate) return;
    setLoading(true);
    setError('');
    setEditing(false);
    try {
      await new Promise((r) => setTimeout(r, 900));
      const result = generateEmail(input);
      setOutput(result);
      await logActivity('email', `Email to ${input.recipient || 'recipient'}`, input.purpose.slice(0, 80));
    } catch {
      setError('Failed to generate email. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setInput(emptyInput);
    setOutput('');
    setError('');
    setEditing(false);
  }

  function handleEdit() {
    setDraft(output);
    setEditing(true);
  }

  function handleSave() {
    setOutput(draft);
    setEditing(false);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input */}
      <div className="card p-6 animate-slide-up">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
            <Mail className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <h2 className="font-bold text-black">Email Details</h2>
            <p className="text-xs text-slate-500">Describe what you need and let AI draft it</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label">Purpose</label>
            <input
              className="input"
              placeholder="e.g. request a project deadline extension"
              value={input.purpose}
              onChange={(e) => setInput({ ...input, purpose: e.target.value })}
            />
          </div>

          <div>
            <label className="label">Recipient</label>
            <input
              className="input"
              placeholder="e.g. Sarah, the project manager"
              value={input.recipient}
              onChange={(e) => setInput({ ...input, recipient: e.target.value })}
            />
          </div>

          <div>
            <label className="label">Tone</label>
            <div className="relative">
              <select
                value={input.tone}
                onChange={(e) => setInput({ ...input, tone: e.target.value })}
                className="input appearance-none pr-10 cursor-pointer"
              >
                {tones.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <svg
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div>
            <label className="label">Key Points</label>
            <textarea
              className="input min-h-[120px] resize-y"
              placeholder="Enter each point on a new line..."
              value={input.keyPoints}
              onChange={(e) => setInput({ ...input, keyPoints: e.target.value })}
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleGenerate}
              disabled={!canGenerate || loading}
              className="btn-primary flex-1"
            >
              <Sparkles className="w-4 h-4" />
              {output ? 'Regenerate' : 'Generate Email'}
            </button>
            <button onClick={handleClear} className="btn-secondary">
              <Trash2 className="w-4 h-4" />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Output */}
      <div className="card p-6 animate-slide-up" style={{ animationDelay: '0.05s' }}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-accent-600" />
            </div>
            <div>
              <h2 className="font-bold text-black">Generated Email</h2>
              <p className="text-xs text-slate-500">Edit, copy, or regenerate as needed</p>
            </div>
          </div>
          {output && !editing && (
            <div className="flex gap-1">
              <button onClick={handleEdit} className="btn-ghost">
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
              <CopyButton text={output} />
            </div>
          )}
        </div>

        {error && <div className="mb-4"><ErrorState message={error} onDismiss={() => setError('')} /></div>}

        {loading ? (
          <LoadingState message="Drafting your email..." />
        ) : editing ? (
          <div className="space-y-3">
            <textarea
              className="input min-h-[320px] resize-y font-mono text-sm leading-relaxed"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
            <div className="flex gap-2">
              <button onClick={handleSave} className="btn-primary">
                <Check className="w-4 h-4" />
                Save
              </button>
              <button onClick={() => setEditing(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        ) : output ? (
          <div className="space-y-4">
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-5 whitespace-pre-wrap text-sm text-slate-700 leading-relaxed font-mono">
              {output}
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="btn-ghost text-brand-600 hover:bg-brand-50 w-full justify-center border border-brand-100"
            >
              <RotateCcw className="w-4 h-4" />
              Regenerate with different wording
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-sm text-slate-400 font-medium">
              Your generated email will appear here
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Fill in the details and click Generate
            </p>
          </div>
        )}

        {output && !loading && (
          <div className="mt-5">
            <ResponsibleAIBanner />
          </div>
        )}
      </div>
    </div>
  );
}
