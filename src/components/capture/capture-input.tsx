import { useState, useRef, useEffect } from 'react';
import { Mic, Send } from 'lucide-react';
import { captureItem } from '../../stores/gtd-store';
import { parseAndUpdateItem } from '../../services/gtd-parser';
import { useSettingsStore } from '../../stores/settings-store';

export function CaptureInput() {
  const [value, setValue] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const apiKey = useSettingsStore((s) => s.apiKey);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCapture = async () => {
    const text = value.trim();
    if (!text) return;

    setIsCapturing(true);
    setValue('');

    try {
      const id = await captureItem(text);

      if (apiKey) {
        parseAndUpdateItem(id, text, apiKey);
      }
    } finally {
      setIsCapturing(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCapture();
    }
  };

  return (
    <div className="relative">
      <div className="flex items-start gap-3 bg-white rounded-xl shadow-sm border border-surface-200 p-3 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
        <Mic className="w-5 h-5 text-surface-400 mt-1 flex-shrink-0" />
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Capture anything... speak or type (Enter to save)"
          rows={1}
          className="flex-1 resize-none outline-none text-sm text-surface-900 placeholder:text-surface-400 bg-transparent"
          disabled={isCapturing}
        />
        <button
          onClick={handleCapture}
          disabled={!value.trim() || isCapturing}
          className="flex-shrink-0 p-1.5 rounded-lg bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
      {!apiKey && (
        <p className="text-xs text-amber-600 mt-1.5 px-1">
          No API key set — items will be captured to Inbox without AI parsing.
          Open Settings to add your Anthropic key.
        </p>
      )}
    </div>
  );
}
