import { useState } from 'react';
import { ListChecks, Sparkles, Trash2, Edit3, Check, RotateCcw, ArrowRight, Calendar, Flag } from 'lucide-react';
import { planTasks, type PlannedTask } from '@/lib/ai';
import { logActivity } from '@/lib/supabase';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import CopyButton from '@/components/CopyButton';
import ResponsibleAIBanner from '@/components/ResponsibleAIBanner';

const priorityStyles: Record<PlannedTask['priority'], { chip: string; dot: string }> = {
  High: { chip: 'bg-error-50 text-error-600 border-error-100', dot: 'bg-error-500' },
  Medium: { chip: 'bg-warning-50 text-warning-600 border-warning-100', dot: 'bg-warning-500' },
  Low: { chip: 'bg-accent-50 text-accent-600 border-accent-100', dot: 'bg-accent-500' },
};

export default function TaskPlanner() {
  const [goal, setGoal] = useState('');
  const [tasks, setTasks] = useState<PlannedTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<PlannedTask | null>(null);

  const canGenerate = goal.trim().length > 5;

  async function handleGenerate() {
    if (!canGenerate) return;
    setLoading(true);
    setError('');
    setEditingId(null);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      const result = planTasks({ goal });
      setTasks(result);
      await logActivity('task', 'Task plan generated', goal.slice(0, 80));
    } catch {
      setError('Failed to generate task plan. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setGoal('');
    setTasks([]);
    setError('');
    setEditingId(null);
  }

  function startEdit(task: PlannedTask) {
    setDraft({ ...task });
    setEditingId(task.id);
  }

  function saveEdit() {
    if (!draft) return;
    setTasks(tasks.map((t) => (t.id === draft.id ? draft : t)));
    setEditingId(null);
    setDraft(null);
  }

  const planText = tasks.length > 0
    ? tasks.map((t, i) => {
        const deps = t.dependencies.length > 0 ? ` (depends on: ${t.dependencies.join(', ')})` : '';
        return `${i + 1}. ${t.title} [${t.priority}] — due ${t.deadline}${deps}\n   ${t.description}`;
      }).join('\n\n')
    : '';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Input */}
      <div className="lg:col-span-2 card p-6 animate-slide-up">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
            <ListChecks className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <h2 className="font-bold text-black">Project Goal</h2>
            <p className="text-xs text-slate-500">Describe a goal — AI breaks it into tasks</p>
          </div>
        </div>

        <textarea
          className="input min-h-[200px] resize-y leading-relaxed"
          placeholder={`e.g. Launch a new customer onboarding flow for our SaaS product, including email sequences, in-app guides, and a welcome video.`}
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />

        <div className="flex gap-2 mt-4">
          <button onClick={handleGenerate} disabled={!canGenerate || loading} className="btn-primary flex-1">
            <Sparkles className="w-4 h-4" />
            {tasks.length > 0 ? 'Regenerate' : 'Generate Plan'}
          </button>
          <button onClick={handleClear} className="btn-secondary">
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        </div>

        {tasks.length > 0 && !loading && (
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-slate-50 py-3">
                <div className="text-2xl font-bold text-black">{tasks.length}</div>
                <div className="text-xs text-slate-500 mt-0.5">Tasks</div>
              </div>
              <div className="rounded-xl bg-slate-50 py-3">
                <div className="text-2xl font-bold text-error-600">
                  {tasks.filter((t) => t.priority === 'High').length}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">High Priority</div>
              </div>
              <div className="rounded-xl bg-slate-50 py-3">
                <div className="text-2xl font-bold text-brand-600">
                  {tasks.filter((t) => t.dependencies.length > 0).length}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Dependencies</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Output */}
      <div className="lg:col-span-3 card p-6 animate-slide-up" style={{ animationDelay: '0.05s' }}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-accent-600" />
            </div>
            <div>
              <h2 className="font-bold text-black">Task Plan</h2>
              <p className="text-xs text-slate-500">Click any task to edit its details</p>
            </div>
          </div>
          {tasks.length > 0 && !loading && (
            <CopyButton text={planText} />
          )}
        </div>

        {error && <div className="mb-4"><ErrorState message={error} onDismiss={() => setError('')} /></div>}

        {loading ? (
          <LoadingState message="Breaking down your goal into tasks..." />
        ) : tasks.length > 0 ? (
          <div className="space-y-3">
            {tasks.map((task, index) => {
              const isEditing = editingId === task.id;
              const style = priorityStyles[task.priority];
              const depTasks = task.dependencies
                .map((depId) => tasks.find((t) => t.id === depId))
                .filter(Boolean) as PlannedTask[];

              return (
                <div
                  key={task.id}
                  className="group rounded-xl border border-slate-200 hover:border-brand-200 hover:shadow-soft transition-all overflow-hidden"
                >
                  <div className="flex items-stretch">
                    {/* Step number */}
                    <div className="flex flex-col items-center px-4 py-4 bg-slate-50 border-r border-slate-100">
                      <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-600">
                        {index + 1}
                      </div>
                      {index < tasks.length - 1 && (
                        <div className="w-px flex-1 bg-slate-200 mt-2" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4">
                      {isEditing && draft ? (
                        <div className="space-y-3">
                          <input
                            className="input text-sm font-semibold"
                            value={draft.title}
                            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                          />
                          <textarea
                            className="input min-h-[60px] resize-y text-sm"
                            value={draft.description}
                            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs font-medium text-slate-500 mb-1 block">Priority</label>
                              <select
                                className="input text-sm"
                                value={draft.priority}
                                onChange={(e) => setDraft({ ...draft, priority: e.target.value as PlannedTask['priority'] })}
                              >
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-slate-500 mb-1 block">Deadline</label>
                              <input
                                type="date"
                                className="input text-sm"
                                value={draft.deadline}
                                onChange={(e) => setDraft({ ...draft, deadline: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={saveEdit} className="btn-primary text-xs py-1.5 px-3">
                              <Check className="w-3.5 h-3.5" />
                              Save
                            </button>
                            <button onClick={() => setEditingId(null)} className="btn-secondary text-xs py-1.5 px-3">
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between gap-3 mb-1.5">
                            <h3 className="font-bold text-black text-sm leading-snug">{task.title}</h3>
                            <button
                              onClick={() => startEdit(task)}
                              className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-brand-600 transition-all flex-shrink-0"
                              aria-label="Edit task"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-sm text-slate-500 leading-relaxed mb-3">{task.description}</p>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`chip border ${style.chip}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                              {task.priority}
                            </span>
                            <span className="chip bg-slate-100 text-slate-600 border border-transparent">
                              <Calendar className="w-3 h-3" />
                              {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                            {depTasks.length > 0 && (
                              <span className="chip bg-brand-50 text-brand-600 border border-brand-100">
                                <ArrowRight className="w-3 h-3" />
                                Depends on: {depTasks.map((d) => d.title).join(', ')}
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
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
              Regenerate plan
            </button>

            <ResponsibleAIBanner />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
              <ListChecks className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-sm text-slate-400 font-medium">
              Your task plan will appear here
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Describe a goal and click Generate Plan
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
