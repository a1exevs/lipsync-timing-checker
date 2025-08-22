import { Info } from 'lucide-react';
import React, { ReactNode, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import { ReactComponent as Logo } from 'src/logo.svg';
import { ABOUT_APP_DIALOG_SEEN_KEY, WORDS_DATA_EXAMPLE } from 'src/pages/home-page/model/consts';
import { HighlighterProps } from 'src/pages/home-page/ui/header/header.types';
import { capitalizeLabel, currentLang, IconButton, useInfoDialog } from 'src/shared';

const Header: React.FC = () => {
  const SyntaxHighlighterCompat = SyntaxHighlighter as unknown as React.ComponentType<HighlighterProps>;

  // TODO Move consts to lang
  const infoContent: ReactNode = (
    <div className="break-all max-h-[calc(80vh-7rem)] overflow-y-auto overflow-x-hidden px-4 py-4 text-sm leading-6 space-y-3 bg-gray-800">
      <p>
        <strong>{capitalizeLabel(currentLang.labels.APP_NAME)}</strong> helps you inspect and correct timings of words
        and phonemes for lipsync tasks.
      </p>
      <div>
        <p className="font-semibold">What you can do:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Load an audio file using <em>Load audio</em>.
          </li>
          <li>
            Load words and phonemes data as JSON using <em>Load JSON data</em>.
          </li>
          <li>Resize and move words and phonemes directly on the timeline.</li>
          <li>
            Download the adjusted data using <em>Download JSON data</em>.
          </li>
        </ul>
      </div>
      <div>
        <p className="font-semibold mb-1">JSON structure example:</p>
        <div className="rounded-md overflow-hidden border border-gray-700">
          <SyntaxHighlighterCompat
            language="json"
            style={oneDark}
            customStyle={{ margin: 0, background: 'transparent' }}
          >
            {JSON.stringify(WORDS_DATA_EXAMPLE, null, 2)}
          </SyntaxHighlighterCompat>
        </div>
      </div>
    </div>
  );

  const openInfo = useInfoDialog({
    title: currentLang.labels.ABOUT_APP,
    content: infoContent,
    confirmButtonText: currentLang.labels.OK,
  });

  useEffect(() => {
    if (localStorage.getItem(ABOUT_APP_DIALOG_SEEN_KEY) !== String(true)) {
      openInfo();
      localStorage.setItem(ABOUT_APP_DIALOG_SEEN_KEY, String(true));
    }
  }, [openInfo]);

  return (
    <header className="grid grid-cols-[auto,1fr,auto] gap-4 items-center px-4 py-3 bg-gray-800 border-b border-gray-700 shadow-md shadow-black/30">
      {/* TODO Make built-in logo */}
      <Logo className="w-16 h-16" aria-hidden="true" />
      <h1 className="text-2xl font-extrabold tracking-tight">{capitalizeLabel(currentLang.labels.APP_NAME)}</h1>
      <IconButton title="Info" variant="secondary" size="sm" onClick={openInfo}>
        <Info size={18} />
      </IconButton>
    </header>
  );
};

export default Header;
