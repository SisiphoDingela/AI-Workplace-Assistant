import { useState } from 'react';
import Sidebar, { type ViewId } from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import Dashboard from '@/views/Dashboard';
import EmailGenerator from '@/views/EmailGenerator';
import MeetingSummarizer from '@/views/MeetingSummarizer';
import TaskPlanner from '@/views/TaskPlanner';
import RecentActivity from '@/views/RecentActivity';
import Settings from '@/views/Settings';

const viewMeta: Record<ViewId, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Your AI productivity workspace at a glance' },
  email: { title: 'Smart Email Generator', subtitle: 'Draft professional emails in seconds' },
  meeting: { title: 'Meeting Notes Summarizer', subtitle: 'Turn raw notes into structured summaries' },
  task: { title: 'AI Task Planner', subtitle: 'Break goals into actionable, prioritized tasks' },
  activity: { title: 'Recent Activity', subtitle: 'Track everything you have generated' },
  settings: { title: 'Settings', subtitle: 'Manage your profile and preferences' },
};

export default function App() {
  const [view, setView] = useState<ViewId>('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  const meta = viewMeta[view];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        active={view}
        onSelect={setView}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onOpenMobile={() => setMobileOpen(true)}
          title={meta.title}
          subtitle={meta.subtitle}
        />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">
          {view === 'dashboard' && <Dashboard onNavigate={setView} />}
          {view === 'email' && <EmailGenerator />}
          {view === 'meeting' && <MeetingSummarizer />}
          {view === 'task' && <TaskPlanner />}
          {view === 'activity' && <RecentActivity />}
          {view === 'settings' && <Settings />}
        </main>
      </div>
    </div>
  );
}
