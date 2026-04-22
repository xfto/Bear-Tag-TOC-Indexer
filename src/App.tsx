import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal,
  Settings2,
  MousePointer2,
  ExternalLink,
  Copy,
  Check,
  Code2,
  ShieldAlert,
  Zap,
  Monitor
} from 'lucide-react';

const APP_TITLE = 'bear.app tag TOC creator app';

const APP_ATTRIBUTION = {
  developerName: 'Fabio Tosto',
  developerEmail: 'fabio@tosto.se',
  madeWith: 'Developed using Google AI Studio & Claude & VS Code',
};

const SHELL_SCRIPT = `# 1. SET THE CONFIRMED PATH
set DB_PATH "$HOME/Library/Group Containers/9K33E3U3T4.net.shinyfrog.bear/Application Data/database.sqlite"

# 2. EXTRACTION (Targeting confirmed ZSFNOTETAG and ZSFASHTAG)
sqlite3 -readonly "$DB_PATH" "
SELECT ZTITLE FROM ZSFNOTETAG WHERE ZTITLE IS NOT NULL;
SELECT ZTITLE FROM ZSFASHTAG WHERE ZTITLE IS NOT NULL;
" 2>/dev/null | python3 -c "
import sys, urllib.parse, subprocess
tags = sorted(list(set([l.strip() for l in sys.stdin if l.strip()])))

if not tags:
    print('⚠️ Found database but no tags found in expected columns.')
    sys.exit()

markdown = '\\n'.join([f'[Open {t} tag](bear://x-callback-url/open-tag?name={urllib.parse.quote(t)})' for t in tags])
markdown += '\\n\\n#!TOC'
bear_url = f'bear://x-callback-url/create?title=Tag%20Index&text={urllib.parse.quote(markdown)}'
subprocess.run(['open', bear_url])
print(f'✅ Note Created with {len(tags)} tags!')
"`;

const tabStyle = (active: boolean) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 24px',
  borderRadius: '12px',
  fontSize: '14px',
  fontWeight: 600,
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  background: active ? 'white' : 'transparent',
  color: active ? '#1D1D1F' : '#86868B',
  boxShadow: active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
  WebkitAppRegion: 'no-drag' as const,
});

function Step({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: '#E3E3E8', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontWeight: 900, fontSize: 18, flexShrink: 0,
        }}>
          {num}
        </div>
        <div style={{ width: 1, flex: 1, background: '#D2D2D7', margin: '8px 0', opacity: 0.5 }} />
      </div>
      <div style={{ paddingTop: 4, paddingBottom: 16 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, marginTop: 0 }}>{title}</h3>
        <div style={{ color: '#86868B', lineHeight: 1.6, fontSize: 14 }}>{children}</div>
      </div>
    </div>
  );
}

function ShortcutTab() {
  return (
    <div style={{ background: 'white', borderRadius: 24, padding: 32, border: '1px solid rgba(210,210,215,0.5)' }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, marginTop: 0 }}>Build the macOS Shortcut</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        <Step num={1} title="Open the Shortcuts app">
          Create a new shortcut named{' '}
          <span style={{ fontFamily: 'monospace', background: '#F5F5F7', padding: '2px 8px', borderRadius: 4, fontStyle: 'italic' }}>
            "Bear Tag TOC Indexer"
          </span>.
        </Step>
        <Step num={2} title="Add Bear Action">
          Search for the <strong>Bear</strong> app actions and add{' '}
          <span style={{ color: '#0071E3', fontWeight: 700 }}>"Get Tags"</span>.
        </Step>
        <Step num={3} title="Repeat & Format">
          Add a <strong>"Repeat with Each"</strong> block. Inside it, add a <strong>Text</strong> action:
          <div style={{
            marginTop: 12, background: '#F5F5F7', padding: 16, borderRadius: 12,
            fontFamily: 'monospace', fontSize: 13, border: '1px solid rgba(210,210,215,0.5)',
          }}>
            [Open <span style={{ color: '#0071E3' }}>Repeat Item</span> Folder](bear://x-callback-url/open-tag?name=<span style={{ color: '#0071E3' }}>Repeat Item</span>)
          </div>
        </Step>
        <Step num={4} title="Combine & Create">
          After the loop, use <strong>"Combine Text"</strong> (with New Lines). Finally, add the Bear action{' '}
          <span style={{ color: '#0071E3', fontWeight: 700 }}>"Create Note"</span> using the combined text as the body.
        </Step>
      </div>

      <div style={{
        marginTop: 32, padding: 24, background: '#0071E3', borderRadius: 24,
        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <h3 style={{ fontWeight: 700, fontSize: 18, marginTop: 0, marginBottom: 8 }}>Why Shortcuts?</h3>
          <p style={{ opacity: 0.8, fontSize: 14, margin: 0 }}>
            It&apos;s the safest way and syncs automatically with your iPhone and iPad.
          </p>
        </div>
        <MousePointer2 style={{ width: 32, height: 32, opacity: 0.5 }} />
      </div>
    </div>
  );
}

function ScriptTab() {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

  const copyScript = () => {
    navigator.clipboard.writeText(SHELL_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ background: 'white', borderRadius: 24, padding: 32, border: '1px solid rgba(210,210,215,0.5)' }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, marginTop: 0 }}>Fish Shell Automation</h2>
      <p style={{ color: '#86868B', marginBottom: 32, fontSize: 14 }}>
        Optimized for <code>fish</code>. Reads the local SQLite database directly and opens a new note in Bear instantly.
      </p>

      <div
        style={{ position: 'relative' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {hovered && (
          <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
            <button
              onClick={copyScript}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 16px', borderRadius: 12, fontSize: 12,
                fontWeight: 700, border: 'none', cursor: 'pointer',
                background: copied ? '#22c55e' : 'white',
                color: copied ? 'white' : 'black',
                boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                transition: 'all 0.15s',
              }}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'COPIED' : 'COPY'}
            </button>
          </div>
        )}
        <pre style={{
          background: '#1D1D1F', color: '#D2D2D7',
          padding: 32, borderRadius: 24, fontFamily: 'monospace',
          fontSize: 13, overflowX: 'auto', lineHeight: 1.7,
          margin: 0, border: '1px solid black',
        }}>
          {SHELL_SCRIPT}
        </pre>
      </div>

      <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ padding: 20, background: '#F5F5F7', borderRadius: 16, border: '1px solid rgba(210,210,215,0.5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Terminal size={16} color="#86868B" />
            <h4 style={{ fontWeight: 700, fontSize: 13, margin: 0 }}>How to run</h4>
          </div>
          <ol style={{ color: '#86868B', fontSize: 12, paddingLeft: 16, margin: 0, lineHeight: 2 }}>
            <li>Open <strong style={{ color: '#1D1D1F' }}>Terminal.app</strong></li>
            <li>Paste the code above</li>
            <li>Press <kbd style={{ background: 'white', border: '1px solid #D2D2D7', borderRadius: 4, padding: '0 4px' }}>Enter</kbd></li>
          </ol>
        </div>
        <div style={{ padding: 20, background: '#F5F5F7', borderRadius: 16, border: '1px solid rgba(210,210,215,0.5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <ShieldAlert size={16} color="#EB4132" />
            <h4 style={{ fontWeight: 700, fontSize: 13, margin: 0 }}>Full Disk Access</h4>
          </div>
          <p style={{ color: '#86868B', fontSize: 12, margin: 0, lineHeight: 1.6 }}>
            On macOS, Terminal may need <strong>Full Disk Access</strong> in System Settings to read Bear&apos;s database.
          </p>
        </div>
      </div>
    </div>
  );
}

function ManualIndexer() {
  const [tags, setTags] = useState(['ai', 'work', 'project/x']);
  const [newTag, setNewTag] = useState('');

  const markdown = useMemo(() => {
    return tags.map(t => `[Open ${t} tag](bear://x-callback-url/open-tag?name=${encodeURIComponent(t)})`).join('\n');
  }, [tags]);

  const addTag = () => {
    if (newTag.trim()) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  return (
    <div style={{ background: 'white', borderRadius: 24, padding: 32, border: '1px solid rgba(210,210,215,0.5)' }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, marginTop: 0 }}>Manual Tag Indexer</h2>
      <p style={{ color: '#86868B', marginBottom: 32, fontSize: 14 }}>
        Can&apos;t run scripts? Build your list here and send it straight to Bear.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <input
              style={{
                flex: 1, background: '#F5F5F7', borderRadius: 12, padding: '8px 16px',
                border: '2px solid transparent', outline: 'none', fontSize: 14,
                fontFamily: 'inherit',
              }}
              placeholder="Tag name..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addTag(); }}
              onFocus={(e) => e.target.style.borderColor = '#0071E3'}
              onBlur={(e) => e.target.style.borderColor = 'transparent'}
            />
            <button
              onClick={addTag}
              style={{
                background: '#0071E3', color: 'white', padding: '8px 16px',
                borderRadius: 12, fontWeight: 700, border: 'none', cursor: 'pointer',
                fontSize: 14,
              }}
            >
              Add
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {tags.map((t, i) => (
              <span key={i} style={{
                background: '#E3E3E8', padding: '4px 12px', borderRadius: 999,
                fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6,
              }}>
                #{t}
                <button
                  onClick={() => setTags(tags.filter((_, idx) => idx !== i))}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#86868B', fontSize: 16, padding: 0, lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <pre style={{
            background: '#F5F5F7', padding: 16, borderRadius: 16, fontFamily: 'monospace',
            fontSize: 11, height: 160, overflowY: 'auto',
            border: '1px solid rgba(210,210,215,0.5)', margin: 0, whiteSpace: 'pre-wrap',
          }}>
            {markdown}{'\n\n#!TOC'}
          </pre>
          <button
            onClick={() => {
              const finalContent = `${markdown}\n\n#!TOC`;
              const url = `bear://x-callback-url/create?title=Manual%20Index&text=${encodeURIComponent(finalContent)}`;
              window.location.href = url;
            }}
            style={{
              background: '#1D1D1F', color: 'white', padding: '12px 0',
              borderRadius: 12, fontWeight: 700, border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontSize: 14,
            }}
          >
            Create in Bear <ExternalLink size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('shortcut');

  useEffect(() => {
    document.title = APP_TITLE;
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F7', color: '#1D1D1F', fontFamily: 'system-ui, sans-serif', paddingBottom: 80 }}>
      {/* Header */}
      <header style={{ background: 'white', borderBottom: '1px solid rgba(210,210,215,0.5)', paddingTop: 64, paddingBottom: 48, padding: '64px 24px 48px' }}>
        <div style={{ maxWidth: 896, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{
              background: '#EB4132', padding: 12, borderRadius: 16,
              boxShadow: '0 8px 24px rgba(235,65,50,0.3)',
            }}>
              <Zap style={{ color: 'white', width: 32, height: 32, fill: 'white' }} />
            </div>
            <div>
              <h1 style={{ fontSize: 36, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}>Bear Tag TOC Creator</h1>
              <p style={{ color: '#86868B', fontSize: 18, margin: '4px 0 0', fontStyle: 'italic', fontWeight: 500 }}>
                Scan. Index. Navigate.
              </p>
            </div>
          </div>

          <div style={{
            background: '#FFF2F2', border: '1px solid rgba(235,65,50,0.1)',
            borderRadius: 16, padding: 16, display: 'flex', alignItems: 'flex-start', gap: 16,
          }}>
            <ShieldAlert style={{ width: 20, height: 20, color: '#EB4132', flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 14, color: '#CC3226', lineHeight: 1.6, margin: 0 }}>
              <strong>Local Access Only:</strong> Standard web browsers cannot access your Mac&apos;s private files for security.
              Use one of the two macOS methods below to scan your local Bear database.
            </p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: 896, margin: '48px auto 0', padding: '0 24px' }}>
        {/* Tab bar */}
        <div style={{
          display: 'flex', background: '#E3E3E8', padding: 4, borderRadius: 16,
          marginBottom: 32, width: 'fit-content',
          WebkitAppRegion: 'no-drag' as const,
        }}>
          {[
            { id: 'shortcut', label: 'macOS Shortcut', Icon: Settings2 },
            { id: 'script', label: 'Fish Script', Icon: Code2 },
            { id: 'why', label: 'Manual Mode', Icon: Monitor },
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={tabStyle(activeTab === id)}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeTab === 'shortcut' && (
            <motion.div
              key="shortcut"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <ShortcutTab />
            </motion.div>
          )}
          {activeTab === 'script' && (
            <motion.div
              key="script"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <ScriptTab />
            </motion.div>
          )}
          {activeTab === 'why' && (
            <motion.div
              key="why"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <ManualIndexer />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer style={{
        maxWidth: 896, margin: '64px auto 0', padding: '0 24px',
        textAlign: 'center', fontSize: 11, color: '#86868B',
        textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700,
      }}>
        Crafted for Bear Enthusiasts &bull; v2.0
        <div style={{ marginTop: 8, textTransform: 'none', letterSpacing: 'normal', fontSize: 11, fontWeight: 500 }}>
          Developed by{' '}
          <a href={`mailto:${APP_ATTRIBUTION.developerEmail}`} style={{ color: 'inherit' }}>
            {APP_ATTRIBUTION.developerName}
          </a>
          {' · '}
          {APP_ATTRIBUTION.madeWith}
        </div>
      </footer>
    </div>
  );
}
