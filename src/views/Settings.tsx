import { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Sparkles, Moon, Sun, Check } from 'lucide-react';

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const toggles = [
    { key: 'notifications', label: 'Email notifications', desc: 'Get notified when generation completes', icon: Bell, value: notifications, setter: setNotifications },
    { key: 'autoSave', label: 'Auto-save activity', desc: 'Log all AI generations to recent activity', icon: Sparkles, value: autoSave, setter: setAutoSave },
    { key: 'compactMode', label: 'Compact mode', desc: 'Reduce spacing for denser information display', icon: Moon, value: compactMode, setter: setCompactMode },
  ];

  return (
    <div className="max-w-2xl space-y-6">
      {/* Profile */}
      <div className="card p-6 animate-slide-up">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <h2 className="font-bold text-black">Profile</h2>
            <p className="text-xs text-slate-500">Your account preferences</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xl font-bold shadow-sm">
            JD
          </div>
          <div>
            <div className="font-bold text-black">John Doe</div>
            <div className="text-sm text-slate-500">john.doe@company.com</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Full Name</label>
            <input className="input" defaultValue="John Doe" />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" defaultValue="john.doe@company.com" />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="card p-6 animate-slide-up" style={{ animationDelay: '0.05s' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-accent-600" />
          </div>
          <div>
            <h2 className="font-bold text-black">Preferences</h2>
            <p className="text-xs text-slate-500">Customize your experience</p>
          </div>
        </div>

        <div className="space-y-1">
          {toggles.map((toggle) => {
            const Icon = toggle.icon;
            return (
              <div key={toggle.key} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-800">{toggle.label}</div>
                    <div className="text-xs text-slate-400">{toggle.desc}</div>
                  </div>
                </div>
                <button
                  onClick={() => toggle.setter(!toggle.value)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${toggle.value ? 'bg-brand-600' : 'bg-slate-200'}`}
                  role="switch"
                  aria-checked={toggle.value}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                      toggle.value ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>

        <button onClick={handleSave} className="btn-primary mt-5">
          {saved ? <Check className="w-4 h-4" /> : null}
          {saved ? 'Saved' : 'Save changes'}
        </button>
      </div>

      {/* Responsible AI */}
      <div className="card p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-warning-50 flex items-center justify-center">
            <Shield className="w-5 h-5 text-warning-600" />
          </div>
          <div>
            <h2 className="font-bold text-black">Responsible AI</h2>
            <p className="text-xs text-slate-500">How we handle AI-generated content</p>
          </div>
        </div>

        <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <p>
            All content generated by this assistant is produced by AI and may contain errors,
            inaccuracies, or outdated information. You are responsible for reviewing and verifying
            all output before using it in professional contexts.
          </p>
          <p>
            <span className="font-semibold text-slate-800">Do not submit confidential or sensitive information</span> —
            including personal data, financial details, trade secrets, or anything covered by an NDA.
          </p>
          <p>
            Generated content should be treated as a starting point, not a final product. Always
            apply your own judgment and expertise.
          </p>
        </div>
      </div>
    </div>
  );
}
