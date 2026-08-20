import {
  LayoutDashboard,
  Mail,
  FileText,
  ListChecks,
  Clock,
  Settings,
  Sparkles,
  X,
} from 'lucide-react';

export type ViewId = 'dashboard' | 'email' | 'meeting' | 'task' | 'activity' | 'settings';

type NavItem = {
  id: ViewId;
  label: string;
  icon: typeof LayoutDashboard;
};

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'email', label: 'Email Generator', icon: Mail },
  { id: 'meeting', label: 'Meeting Summarizer', icon: FileText },
  { id: 'task', label: 'Task Planner', icon: ListChecks },
  { id: 'activity', label: 'Recent Activity', icon: Clock },
  { id: 'settings', label: 'Settings', icon: Settings },
];

type Props = {
  active: ViewId;
  onSelect: (id: ViewId) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

export default function Sidebar({ active, onSelect, mobileOpen, onCloseMobile }: Props) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 flex-shrink-0 flex flex-col bg-white border-r border-slate-200 transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="leading-tight">
              <div className="font-bold text-black text-sm">AI Assistant</div>
              <div className="text-[11px] text-slate-400 font-medium">Workplace Productivity</div>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden text-slate-400 hover:text-slate-600 p-1"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Tools
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelect(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon
                  className={`w-[18px] h-[18px] transition-colors ${
                    isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-slate-100">
          <div className="rounded-xl bg-gradient-to-br from-brand-50 to-slate-50 border border-brand-100 p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span className="text-xs font-semibold text-slate-800">Pro Tip</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Use specific key points for more accurate, tailored AI output.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
