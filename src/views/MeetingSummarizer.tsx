import { useState } from 'react';
import { FileText, Sparkles, Trash2, Edit3, Check, RotateCcw, CheckCircle2, ListTodo, Gavel, CalendarClock, Target } from 'lucide-react';
import { summarizeMeeting, type MeetingInput, type MeetingOutput } from '@/lib/ai';
import { logActivity } from '@/lib/supabase';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import CopyButton from '@/components/CopyButton';
import ResponsibleAIBanner from '@/components/ResponsibleAIBanner';

type SectionKey = 'summary' | 'keyPoints' | 'decisions' | 'actionItems' | 'followUps';

export default function MeetingSummarizer() {
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState<MeetingOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingSection, setEditingSection] = useState<SectionKey | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const canGenerate = notes.trim().length > 20;

  async function handleGenerate() {
    if (!canGenerate) return;
    setLoading(true);
    setError('');
    setEditingSection(null);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      const input: MeetingInput = { notes };
      const output = summarizeMeeting(input);
      setResult(output);
      await logActivity('meeting', 'Meeting notes summarized', notes.slice(0, 80));
    } catch {
      setError('Failed to summarize meeting notes. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setNotes('');
    setResult(null);
    setError('');
    setEditingSection(null);
  }

  function startEdit(section: SectionKey) {
    const value = section === 'summary'
      ? result?.summary ?? ''
      : (result?.[section] ?? []).join('\n');
    setDrafts({ ...drafts, [section]: value });
    setEditingSection(section);
  }

  function saveEdit(section: SectionKey) {
    if (!result) return;
    const draft = drafts[section] ?? '';
    if (section === 'summary') {
      setResult({ ...result, summary: draft });
    } else {
      const items = draft.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
      setResult({ ...result, [section]: items });
    }
    setEditingSection(null);
  }

  const sections: { key: SectionKey; label: string; icon: typeof Target; color: string; items?: boolean }[] = [
    { key: 'summary', label: 'Summary', icon: Target, color: 'brand' },
    { key: 'keyPoints', label: 'Key Points', icon: CheckCircle2, color: 'accent', items: true },
    { key: 'decisions', label: 'Decisions', icon: Gavel, color: 'warning', items: true },
    { key: 'actionItems', label: 'Action Items', icon: ListTodo, color: 'brand', items: true },
    { key: 'followUps', label: 'Follow-ups', icon: CalendarClock, color: 'accent', items: true },
  ];

  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    brand: { bg: 'bg-brand-50', text: 'text-brand-600', border: 'border-brand-100' },
    accent: { bg: 'bg-accent-50', text: 'text-accent-600', border: 'border-accent-100' },
    warning: { bg: 'bg-warning-50', text: 'text-warning-600', border: 'border-warning-100' },
  };

  const fullText = result
    ? `Summary:\n${result.summary}\n\nKey Points:\n${result.keyPoints.join('\n')}\n\nDecisions:\n${result.decisions.join('\n')}\n\nAction Items:\n${result.actionItems.join('\n')}\n\nFollow-ups:\n${result.followUps.join('\n')}`
    : '';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input */}
      <div className="card p-6 animate-slide-up">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
            <FileText className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <h2 className="font-bold text-black">Meeting Notes</h2>
            <p className="text-xs text-slate-500">Paste raw notes — AI structures them for you</p>
          </div>
        </div>

        <textarea
          className="input min-h-[400px] resize-y leading-relaxed"
          placeholder={`Paste your meeting notes here. For example:

• Discussed Q3 roadmap and priorities
• Decided to launch the new dashboard by October 15
• Sarah will prepare the design mockups by Friday
• Action item: John to send the budget proposal to finance
• Follow-up: review vendor contracts next week`}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="flex gap-2 mt-4">
          <button onClick={handleGenerate} disabled={!canGenerate || loading} className="btn-primary flex-1">
            <Sparkles className="w-4 h-4" />
            {result ? 'Regenerate' : 'Summarize'}
          </button>
          <button onClick={handleClear} className="btn-secondary">
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
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
              <h2 className="font-bold text-black">Structured Summary</h2>
              <p className="text-xs text-slate-500">Each section is editable</p>
            </div>
          </div>
          {result && !loading && (
            <CopyButton text={fullText} />
          )}
        </div>

        {error && <div className="mb-4"><ErrorState message={error} onDismiss={() => setError('')} /></div>}

        {loading ? (
          <LoadingState message="Analyzing your meeting notes..." />
        ) : result ? (
          <div className="space-y-4">
            {sections.map((section) => {
              const Icon = section.icon;
              const colors = colorMap[section.color];
              const isEditing = editingSection === section.key;
              const content = section.items
                ? (result[section.key] as string[])
                : (result[section.key] as string);

              return (
                <div key={section.key} className={`rounded-xl border ${colors.border} overflow-hidden`}>
                  <div className={`flex items-center justify-between px-4 py-2.5 ${colors.bg}`}>
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${colors.text}`} />
                      <span className={`text-sm font-semibold ${colors.text}`}>{section.label}</span>
                    </div>
                    {!isEditing && (
                      <button onClick={() => startEdit(section.key)} className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1 transition-colors">
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                    )}
                  </div>
                  <div className="px-4 py-3 bg-white">
                    {isEditing ? (
                      <div className="space-y-2">
                        {section.items ? (
                          <textarea
                            className="input min-h-[100px] resize-y text-sm"
                            value={drafts[section.key] ?? ''}
                            onChange={(e) => setDrafts({ ...drafts, [section.key]: e.target.value })}
                            placeholder="One item per line"
                          />
                        ) : (
                          <textarea
                            className="input min-h-[80px] resize-y text-sm"
                            value={drafts[section.key] ?? ''}
                            onChange={(e) => setDrafts({ ...drafts, [section.key]: e.target.value })}
                          />
                        )}
                        <div className="flex gap-2">
                          <button onClick={() => saveEdit(section.key)} className="btn-primary text-xs py-1.5 px-3">
                            <Check className="w-3.5 h-3.5" />
                            Save
                          </button>
                          <button onClick={() => setEditingSection(null)} className="btn-secondary text-xs py-1.5 px-3">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : section.items ? (
                      (content as string[]).length > 0 ? (
                        <ul className="space-y-1.5">
                          {(content as string[]).map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                              <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${colors.bg.replace('50', '500')} flex-shrink-0`} />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-slate-400 italic">No items detected</p>
                      )
                    ) : (
                      <p className="text-sm text-slate-700 leading-relaxed">{content as string}</p>
                    )}
                  </div>
                </div>
              );
            })}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="btn-ghost text-brand-600 hover:bg-brand-50 w-full justify-center border border-brand-100"
            >
              <RotateCcw className="w-4 h-4" />
              Regenerate summary
            </button>

            <ResponsibleAIBanner />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-sm text-slate-400 font-medium">
              Your structured summary will appear here
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Paste notes and click Summarize
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
