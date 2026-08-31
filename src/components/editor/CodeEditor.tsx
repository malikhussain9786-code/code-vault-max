import Editor, { type OnMount } from '@monaco-editor/react';
import '@/lib/monacoSetup';
import { useTheme } from '@/context/ThemeContext';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string; // Monaco language id
  height?: string;
  onMount?: OnMount;
}

export function CodeEditor({ value, onChange, language, height = '100%', onMount }: CodeEditorProps) {
  const { theme } = useTheme();

  return (
    <Editor
      height={height}
      language={language}
      value={value}
      onChange={(v) => onChange(v ?? '')}
      onMount={onMount}
      theme={theme === 'dark' ? 'vs-dark' : 'light'}
      options={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 14,
        minimap: { enabled: false },
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        padding: { top: 16, bottom: 16 },
        // Find (Ctrl/Cmd+F) and Find & Replace (Ctrl/Cmd+H) are built into Monaco by default —
        // no extra wiring needed here beyond leaving the default keybindings enabled.
        renderLineHighlight: 'gutter',
        smoothScrolling: true,
      }}
    />
  );
}
