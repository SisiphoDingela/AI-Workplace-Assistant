import { useEffect, useState } from 'react';
import { Mail, FileText, ListChecks, Clock, Trash2, RefreshCw } from 'lucide-react';
import { fetchActivities, type Activity } from '@/lib/supabase';

const toolMeta: Record<Activity['tool'], { label: string; icon: typeof Mail; color: string; bg: string }> = {
  email: { label: 'Email', icon: Mail, color: 'text-brand-600', bg: 'bg-brand-50' },
  meeting: { label: 'Meeting', icon: FileText, color: 'text-accent-600', bg: 'bg-accent-50' },
  task: { label: 'Task', icon: ListChecks, color: 'text-warning-600', bg: 'bg-warning-50' },
};

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | Activity['tool']>('all');

  async function load() {
    setLoading(true);
    const data = await fetchActivities(50);
    setActivities(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = filter === 'all' ? activities : activities.filter((a) => a.tool === filter);

  const filters: { id: 'all' | Activity['tool']; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'email', label: 'Emails' },
    { id: 'meeting', label: 'Meetings' },
    { id: 'task', label: 'Tasks' },
  ];

  return (
    <div className="space-y-5">
      {/* Filter bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`chip transition-all ${
                filter === f.id
                  ? 'bg-brand-600 text-white border border-brand-600'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button onClick={load} className="btn-ghost">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* List */}
      <div className="card divide-y divide-slate-100">
        {loading ? (
          [0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 rounded-xl shimmer-bg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/4 shimmer-bg rounded" />
                <div className="h-3 w-1/2 shimmer-bg rounded" />
              </div>
            </div>
          ))
        ) : filtered.length > 0 ? (
          filtered.map((act) => {
            const meta = toolMeta[act.tool];
            const Icon = meta.icon;
            return (
              <div key={act.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors animate-fade-in">
                <div className={`w-10 h-10 rounded-xl ${meta.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${meta.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`chip ${meta.bg} ${meta.color} border-0`}>{meta.label}</span>
                    <span className="text-xs text-slate-400">
                      {new Date(act.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at{' '}
                      {new Date(act.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-700 mt-1 truncate">{act.title}</p>
                  {act.summary && <p className="text-xs text-slate-400 mt-0.5 truncate">{act.summary}</p>}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-sm text-slate-400 font-medium">
              {filter === 'all' ? 'No activity yet' : `No ${filter} activity yet`}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Use the tools to generate content and it will show up here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
