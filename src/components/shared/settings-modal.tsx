import { useState, useEffect } from 'react';
import { X, Key, Download, Upload } from 'lucide-react';
import { useSettingsStore } from '../../stores/settings-store';
import { db } from '../../db/database';

export function SettingsModal() {
  const { isSettingsOpen, closeSettings, apiKey, setApiKey } =
    useSettingsStore();
  const [keyInput, setKeyInput] = useState('');

  useEffect(() => {
    if (isSettingsOpen) {
      setKeyInput(apiKey ?? '');
    }
  }, [isSettingsOpen, apiKey]);

  if (!isSettingsOpen) return null;

  const handleSaveKey = async () => {
    await setApiKey(keyInput.trim());
  };

  const handleExport = async () => {
    const items = await db.gtdItems.toArray();
    const projects = await db.projects.toArray();
    const data = JSON.stringify({ items, projects }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gtd-flow-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      try {
        const data = JSON.parse(text);
        if (data.items) {
          await db.gtdItems.clear();
          await db.gtdItems.bulkAdd(data.items);
        }
        if (data.projects) {
          await db.projects.clear();
          await db.projects.bulkAdd(data.projects);
        }
        alert('Data imported successfully!');
      } catch {
        alert('Invalid backup file.');
      }
    };
    input.click();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-surface-200">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button
            onClick={closeSettings}
            className="p-1 hover:bg-surface-100 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-surface-700 mb-2">
              <Key className="w-4 h-4" />
              Anthropic API Key
            </label>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="sk-ant-..."
              className="w-full px-3 py-2 rounded-lg border border-surface-300 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
            />
            <button
              onClick={handleSaveKey}
              className="mt-2 px-4 py-1.5 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Save Key
            </button>
            <p className="text-xs text-surface-500 mt-1">
              Stored locally in your browser. Never sent anywhere except
              Anthropic's API.
            </p>
          </div>

          <div className="border-t border-surface-200 pt-4">
            <h3 className="text-sm font-medium text-surface-700 mb-3">
              Data Management
            </h3>
            <div className="flex gap-3">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-3 py-2 text-sm border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export Backup
              </button>
              <button
                onClick={handleImport}
                className="flex items-center gap-2 px-3 py-2 text-sm border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Import Backup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
