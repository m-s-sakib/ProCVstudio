/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

/**
 * Ensures a bullet or sentence ends with a full stop (.) if not already punctuated.
 */
export function ensureFullStop(text: string): string {
  if (!text) return '';
  const trimmed = text.trim();
  if (!trimmed) return '';
  const lastChar = trimmed.slice(-1);
  if (['.', '!', '?', ';', ':'].includes(lastChar)) {
    return trimmed;
  }
  return trimmed + '.';
}

/**
 * Splits prose text (like summaries or descriptions) into distinct sentences,
 * keeping sentence-terminating punctuation intact.
 */
export function splitSentences(text: string): string[] {
  if (!text || typeof text !== 'string') return [];
  const trimmed = text.trim();
  if (!trimmed) return [];

  // Match sentences ending in punctuation (. ! ?) followed by space and a capital letter or end of string
  const regex = /([^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$)/g;
  const matches = trimmed.match(regex);
  if (!matches || matches.length <= 1) {
    return [trimmed];
  }

  // Combine any accidental split on short abbreviations like "e.g." or "Ph.D."
  const result: string[] = [];
  let buffer = '';

  for (let i = 0; i < matches.length; i++) {
    const part = matches[i].trim();
    if (!part) continue;

    buffer = buffer ? `${buffer} ${part}` : part;

    // Check if buffer ends with a true sentence boundary
    const isAbbr = /\b(?:e\.g|i\.e|vs|Dr|Mr|Ms|Prof|Ph\.D|U\.S)\.$/i.test(buffer);
    if (!isAbbr && /[.!?]$/.test(buffer)) {
      result.push(buffer);
      buffer = '';
    }
  }

  if (buffer) {
    result.push(buffer);
  }

  return result.length > 0 ? result : [trimmed];
}

/**
 * Renders prose text with clean punctuation and natural inline spacing.
 */
export function renderSentenceSpans(text: string, className = ''): React.ReactNode {
  if (!text) return null;
  const sentences = splitSentences(text);
  if (sentences.length <= 1) {
    return (
      <span className={`inline ${className}`}>
        {ensureFullStop(text)}
      </span>
    );
  }

  return sentences.map((sentence, idx) => (
    <span
      key={idx}
      className={`inline ${className}`}
    >
      {ensureFullStop(sentence)}{' '}
    </span>
  ));
}
