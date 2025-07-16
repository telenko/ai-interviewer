import React, { useEffect, useState, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { EditorView } from '@codemirror/view';
import type { ProgLangEnum } from '@/models/entities';
import { quietlight } from '@uiw/codemirror-theme-quietlight';

type SupportedLanguage = ProgLangEnum;

interface Props {
  value: string;
  onChange: (val: string) => void;
  language: SupportedLanguage;
  className?: string;
  placeholder?: string;
  minHeight?: string;
}

const languageLoaders: Record<SupportedLanguage, () => Promise<any>> = {
  js: async () => (await import('@codemirror/lang-javascript')).javascript({ typescript: false }),
  ts: async () => (await import('@codemirror/lang-javascript')).javascript({ typescript: true }),
  py: async () => (await import('@codemirror/lang-python')).python(),
  java: async () => (await import('@codemirror/lang-java')).java(),
  ['c#']: async () => [],
  dotnet: async () => [],
  other: async () => [],
};

export const CodeEditor: React.FC<Props> = ({
  value,
  onChange,
  language,
  className,
  placeholder,
  minHeight,
}) => {
  const [extensions, setExtensions] = useState<any[]>([]);
  const editorRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<string>('auto');
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const langExtension = await languageLoaders[language]();
        setExtensions([
          ...(Array.isArray(langExtension) ? langExtension : [langExtension]),
          EditorView.lineWrapping,
        ]);
      } catch (e) {
        console.error('Failed to load language extension:', e);
        setExtensions([]);
      }
    };

    loadLanguage();
  }, [language]);

  useEffect(() => {
    if (!editorRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const scrollHeight = entry.target.scrollHeight;
        setHeight(`${scrollHeight}px`);
      }
    });

    observer.observe(editorRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={editorRef} className={className}>
      <CodeMirror
        value={value}
        theme={quietlight}
        minHeight={minHeight}
        height={height}
        extensions={extensions}
        onChange={onChange}
        placeholder={placeholder}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          autocompletion: true,
        }}
      />
    </div>
  );
};
