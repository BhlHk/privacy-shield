import React, { useState, useEffect } from 'react';
import { isHighEntropy } from './utils/entropy.ts';
import { PATTERNS } from './utils/patterns.ts';

// --- TYPES ---
type ViewMode = 'scrub' | 'settings';
interface RestoreMap {
  [placeholder: string]: string;
}

function App() {
  // --- STATE ---
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [customRules, setCustomRules] = useState<string[]>([]);
  const [newRule, setNewRule] = useState<string>('');
  const [view, setView] = useState<ViewMode>('scrub');
  const [status, setStatus] = useState<string>('');

  // Load data on mount
  useEffect(() => {
    const savedRules = localStorage.getItem('custom_rules');
    if (savedRules) setCustomRules(JSON.parse(savedRules));
  }, []);

  // Save status helper
  const flashStatus = (msg: string) => {
    setStatus(msg);
    setTimeout(() => setStatus(''), 2000);
  };

  // --- LOGIC ---

  const addRule = () => {
    if (newRule && !customRules.includes(newRule)) {
      const updated = [...customRules, newRule];
      setCustomRules(updated);
      localStorage.setItem('custom_rules', JSON.stringify(updated));
      setNewRule('');
      flashStatus('Rule added!');
    }
  };

  const removeRule = (ruleToRemove: string) => {
    const updated = customRules.filter(r => r !== ruleToRemove);
    setCustomRules(updated);
    localStorage.setItem('custom_rules', JSON.stringify(updated));
  };

  const performScrub = () => {
    const SAFE_WORDS = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];

    if (!input) return;

    let text = input;
    // We load the existing map so we don't lose previous scrubs
    const savedMap = localStorage.getItem('restore_map');
    const map: RestoreMap = savedMap ? JSON.parse(savedMap) : {};
    
    let counter = Object.keys(map).length + 1;

    // Helper to replace and store
    const replaceAndStore = (match: string, type: string) => {
      // Check if already exists to avoid duplicates
      for (const [key, val] of Object.entries(map)) {
        if (val === match) return key;
      }
      const placeholder = `{{${type}_${counter++}}}`;
      map[placeholder] = match;
      return placeholder;
    };

    // 1. Custom Rules
    customRules.forEach((rule) => {
      if (text.includes(rule)) {
        text = text.replaceAll(rule, replaceAndStore(rule, 'CUSTOM'));
      }
    });

    // 2. Regex Patterns
    Object.entries(PATTERNS).forEach(([type, regex]) => {
      text = text.replace(regex, (match) => {
          // Ignore safe words
          if (SAFE_WORDS.includes(match)) return match;
          
          // Ignore CSS colors (e.g., #FFFFFF) if checking generic hex
          if (type === 'generic_hex' && match.length < 8) return match;
    
          return replaceAndStore(match, type.toUpperCase());
      });
});

    // 3. Entropy Detection (The AI Logic)
    const words = text.split(/\s+/);
    words.forEach((word) => {
      // Avoid re-scrubbing placeholders
      if (word.startsWith('{{') && word.endsWith('}}')) return;

      if (isHighEntropy(word)) {
        const placeholder = replaceAndStore(word, 'SECRET');
        text = text.replace(word, placeholder);
      }
    });

    // Save Everything
    localStorage.setItem('restore_map', JSON.stringify(map));
    setOutput(text);
    flashStatus(`🛡️ Scrubbed ${counter - 1} secrets!`);
  };

  const performRestore = () => {
    const savedMap = localStorage.getItem('restore_map');
    if (!savedMap) return;
    
    const map: RestoreMap = JSON.parse(savedMap);
    let text = output || input; // Allow restoring from either box

    text = text.replace(/{{[A-Z0-9_]+}}/g, (placeholder) => {
      return map[placeholder] || placeholder;
    });

    setInput(text); // Put it back in top box
    flashStatus('✅ Data Restored');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    flashStatus('📋 Copied to clipboard');
  };

  // --- RENDER ---
  return (
    <div className="w-[400px] min-h-[500px] bg-slate-900 text-slate-200 font-sans p-4 flex flex-col">
      
      {/* Header */}
      <header className="flex justify-between items-center mb-5 border-b border-slate-700 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🛡️</span>
          <h1 className="font-bold text-lg text-blue-400 tracking-wide">PrivacyShield</h1>
        </div>
        <button 
          onClick={() => setView(view === 'scrub' ? 'settings' : 'scrub')}
          className="text-xs bg-slate-800 border border-slate-700 px-3 py-1.5 rounded hover:bg-slate-700 transition-colors"
        >
          {view === 'scrub' ? '⚙️ Rules' : '⬅️ Back'}
        </button>
      </header>

      {/* Status Bar (Toast) */}
      {status && (
        <div className="mb-3 bg-blue-600/20 border border-blue-500/50 text-blue-200 px-3 py-2 rounded text-xs text-center font-medium animate-pulse">
          {status}
        </div>
      )}

      {view === 'scrub' ? (
        <div className="flex flex-col gap-4 h-full">
          
          {/* INPUT AREA */}
          <div className="relative group">
            <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block tracking-wider">Unsafe Input</label>
            <textarea 
              className="w-full h-32 bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all"
              placeholder="Paste logs, keys, or code here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            {input && (
                <button 
                    onClick={() => setInput('')}
                    className="absolute top-7 right-2 text-slate-500 hover:text-red-400 text-xs bg-slate-900/80 px-1.5 rounded"
                >Clear</button>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex gap-2">
            <button 
              onClick={performScrub}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg shadow-lg shadow-blue-900/20 transition-all active:scale-95 flex justify-center items-center gap-2"
            >
              Scrub 🔒
            </button>
            <button 
              onClick={performRestore}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-green-400 border border-slate-600 font-semibold py-2.5 rounded-lg transition-all active:scale-95"
            >
              Restore 🔓
            </button>
          </div>

          {/* OUTPUT AREA */}
          <div className="relative">
            <label className="text-[10px] font-bold text-green-500/80 uppercase mb-1 block tracking-wider">Safe Output</label>
            <textarea 
              className="w-full h-32 bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-green-400 focus:border-green-900 outline-none resize-none"
              readOnly
              value={output}
              placeholder="Sanitized data will appear here..."
            />
            {output && (
              <button 
                onClick={() => copyToClipboard(output)}
                className="absolute bottom-3 right-3 bg-green-900/80 text-green-300 text-[10px] px-2 py-1 rounded hover:bg-green-800 transition"
              >
                Copy
              </button>
            )}
          </div>
        </div>
      ) : (
        /* SETTINGS VIEW */
        <div className="flex flex-col h-full">
          <h2 className="text-sm font-bold text-slate-300 mb-2">Custom Redaction Rules</h2>
          <p className="text-xs text-slate-500 mb-4">
            Add specific words you want to hide (e.g. "Project Apollo", "Client X").
          </p>

          <div className="flex gap-2 mb-4">
            <input 
              className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              placeholder="Type a word..."
              onKeyDown={(e) => e.key === 'Enter' && addRule()}
            />
            <button 
              onClick={addRule}
              className="bg-green-600 hover:bg-green-500 text-white px-4 rounded font-bold transition-colors"
            >
              +
            </button>
          </div>

          <div className="flex-1 overflow-y-auto bg-slate-800/50 rounded-lg p-2 border border-slate-700/50">
            {customRules.length === 0 ? (
                <p className="text-center text-slate-600 text-xs mt-10">No custom rules yet.</p>
            ) : (
                <ul className="flex flex-col gap-2">
                {customRules.map((rule) => (
                    <li key={rule} className="bg-slate-800 border border-slate-700 p-2 rounded flex justify-between items-center group">
                    <span className="text-xs text-slate-300 font-mono">{rule}</span>
                    <button 
                        onClick={() => removeRule(rule)}
                        className="text-slate-500 hover:text-red-400 px-2 transition-colors"
                    >
                        ×
                    </button>
                    </li>
                ))}
                </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}



export default App;