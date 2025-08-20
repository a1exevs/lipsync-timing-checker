import { CSSProperties, ReactNode } from 'react';

// Work around react-syntax-highlighter React type mismatch without using `any`
export type HighlighterProps = {
  language?: string;
  // style type is library-internal; keep unknown to avoid unsafe any
  style?: unknown;
  customStyle?: CSSProperties;
  children?: ReactNode;
};
