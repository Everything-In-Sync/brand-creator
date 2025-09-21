import { useState } from 'react';
import type { Palette } from '../types';
import { buildCssTokens, buildScssTokens, buildTailwindSnippet, buildPaletteJson } from '../lib/formatters';

interface ExportActionsProps {
  palette: Palette;
  sessionId?: string;
  paletteIndex: number;
  onDownload: (sessionId: string, paletteIndex: number) => Promise<void>;
}

export function ExportActions({ palette, sessionId, paletteIndex, onDownload }: ExportActionsProps) {
  const [copied, setCopied] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  async function handleCopy(label: string, content: string) {
    await navigator.clipboard.writeText(content);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  }

  async function handleDownload() {
    if (!sessionId) {
      setStatus('Generate a palette to enable downloads.');
      return;
    }
    setStatus('Building ZIP…');
    try {
      await onDownload(sessionId, paletteIndex);
      setStatus('ZIP downloaded.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Failed to download ZIP');
    }
  }

  return (
    <div>
      <div className="export-actions">
        <button type="button" onClick={() => handleCopy('css', buildCssTokens(palette))}>Copy CSS Tokens</button>
        <button type="button" onClick={() => handleCopy('scss', buildScssTokens(palette))}>Copy SCSS Tokens</button>
        <button type="button" onClick={() => handleCopy('tailwind', buildTailwindSnippet(palette))}>Copy Tailwind</button>
        <button type="button" onClick={() => handleCopy('json', buildPaletteJson(palette))}>Copy JSON</button>
        <button type="button" onClick={handleDownload}>Download ZIP</button>
      </div>
      <div className="status-bar">
        {copied && <span>Copied {copied} to clipboard.</span>}
        {status && <span> {status}</span>}
      </div>
    </div>
  );
}
