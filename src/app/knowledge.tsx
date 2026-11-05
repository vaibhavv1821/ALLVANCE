import React from 'react';
import { ModuleScreenLayout } from '@/components/ModuleScreenLayout';

export default function KnowledgeScreen() {
  return (
    <ModuleScreenLayout
      id="knowledge"
      title="Knowledge Vault"
      subtitle="Offline Personal Wiki & CS Cheat Sheets"
      iconName="BookMarked"
      accentColor="#EAB308"
      description="Offline-first markdown notes, core concept summaries, code snippets, syntax reference sheets, and revision flashcards."
      highlights={[
        {
          title: 'Core CS Subject Notes',
          desc: 'OS (virtual memory, page replacement), DBMS (indexing, normalization), CN (OSI layers, handshake protocols).',
        },
        {
          title: 'Offline Markdown Editor',
          desc: 'Write rich formatted notes with code syntax highlights and instant local search.',
        },
        {
          title: 'Pinned Quick Reference Sheets',
          desc: 'Fast lookup for Git commands, Linux shell commands, and regex patterns.',
        },
      ]}
      showBack={true}
    />
  );
}
