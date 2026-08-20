import { useEffect, useState } from 'react';
import { Mail, FileText, ListChecks, TrendingUp, Clock, ArrowRight, Sparkles, Zap, Target, CheckCircle2 } from 'lucide-react';
import type { ViewId } from '@/components/Sidebar';
import { fetchActivities, fetchActivityStats, type Activity } from '@/lib/supabase';

type Props = {
  onNavigate: (view: ViewId) => void;
};

const toolMeta: Record<Activity['tool'], { label: string; icon: typeof Mail; color: string; bg: string }> = {
  email: { label: 'Email', icon: Mail, color: 'text-brand-600', bg: 'bg-brand-50' },
  meeting: { label: 'Meeting', icon: FileText, color: 'text-accent-600', bg: 'bg-accent-50' },
  task: { label: 'Task', icon: ListChecks, color: 'text-warning-600', bg: 'bg-warning-50' },
};

export default function Dashboard({ onNavigate }: Props) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState({ total: 0, byTool: {} as Record<string, number> });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [acts, st] = await Promise.all([fetchActivities(5), fetchActivityStats()]);
      setActivities(acts);
      setStats(st);
      setLoading(false);
    })();
  }, []);

  const tools = [
    {
      id: 'email' as ViewId,
      title: 'Smart Email Generator',
      desc: 'Draft professional emails from purpose, tone, and key points.',
      icon: Mail,
      gradient: 'from-brand-500 to-brand-700',
    },
    {
      id: 'meeting' as ViewId,
      title: 'Meeting Notes Summarizer',
      desc: 'Turn raw notes into summaries, decisions, and action items.',
      icon: FileText,
      gradient: 'from-accent-500 to-accent-700',
    },
    {
      id: 'task' as ViewId,
      title: 'AI Task Planner',
      desc: 'Convert goals into structured tasks with priorities and deadlines.',
      icon: ListChecks,
      gradient: 'from-warning-500 to-warning-700',
    },
  ];

  const kpis = [
    { label: 'Total Generations', value: stats.total, icon: Zap, color: 'text-brand-600', bg: 'bg-brand-50' },
    { label: 'Emails Drafted', value: stats.byTool.email ?? 0, icon: Mail, color: 'text-brand-600', bg: 'bg-brand-50' },
    { label: 'Meetings Summarized', value: stats.byTool.meeting ?? 0, icon: FileText, color: 'text-accent-600', bg: 'bg-accent-50' },
    { label: 'Plans Created', value: stats.byTool.task ?? 0, icon: Target, color: 'text-warning-600', bg: 'bg-warning-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 p-6 sm:p-8 text-white animate-slide-up">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-brand-400/20 rounded-full blur-3xl translate-y-1/2" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-brand-200" />
            <span className="text-sm font-medium text-brand-100">Welcome back</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Let's get more done today.</h2>
          <p className="text-brand-100 max-w-lg leading-relaxed">
            Your AI-powered workspace for drafting emails, summarizing meetings, and planning projects — all in one place.
          </p>
          <button
            onClick={() => onNavigate('email')}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-brand-700 font-semibold text-sm hover:bg-brand-50 transition-all active:scale-[0.98] shadow-lg"
          >
            Start with Email Generator
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="card p-5 animate-slide-up"
              style={{ animationDelay: `${0.05 * (i + 1)}s` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <TrendingUp className="w-4 h-4 text-slate-300" />
              </div>
              <div className="text-2xl font-bold text-black">
                {loading ? <span className="shimmer-bg rounded h-7 w-12 inline-block" /> : kpi.value}
              </div>
              <div className="text-xs text-slate-500 mt-1">{kpi.label}</div>
            </div>
          );
        })}
      </div>

      {/* Tool cards */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tools.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => onNavigate(tool.id)}
                className="card p-6 text-left hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-300 group animate-slide-up"
                style={{ animationDelay: `${0.1 * (i + 1)}s` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center shadow-sm mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-black mb-1.5 group-hover:text-brand-600 transition-colors">
                  {tool.title}
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{tool.desc}</p>
                <div className="flex items-center gap-1 text-sm font-medium text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Open tool
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Recent Activity</h3>
          <button
            onClick={() => onNavigate('activity')}
            className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="card divide-y divide-slate-100">
          {loading ? (
            [0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <div className="w-10 h-10 rounded-xl shimmer-bg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 shimmer-bg rounded" />
                  <div className="h-3 w-1/2 shimmer-bg rounded" />
                </div>
              </div>
            ))
          ) : activities.length > 0 ? (
            activities.map((act) => {
              const meta = toolMeta[act.tool];
              const Icon = meta.icon;
              return (
                <div key={act.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                  <div className={`w-10 h-10 rounded-xl ${meta.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${meta.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`chip ${meta.bg} ${meta.color} border-0`}>{meta.label}</span>
                      <span className="text-xs text-slate-400">
                        {new Date(act.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-700 mt-1 truncate">{act.title}</p>
                    {act.summary && <p className="text-xs text-slate-400 mt-0.5 truncate">{act.summary}</p>}
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-accent-400 flex-shrink-0" />
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-3">
                <Clock className="w-7 h-7 text-slate-300" />
              </div>
              <p className="text-sm text-slate-400 font-medium">No activity yet</p>
              <p className="text-xs text-slate-400 mt-1">Generate content to see it here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
