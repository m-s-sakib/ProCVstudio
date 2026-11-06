/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Normalizes an external URL to ensure it starts with http:// or https://
 */
export function normalizeUrl(url: string | undefined): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
 * Normalizes LinkedIn input (supports full URL, short URL, handle with or without @, or /in/)
 */
export function normalizeLinkedInUrl(urlOrHandle: string | undefined): string {
  if (!urlOrHandle) return '';
  const trimmed = urlOrHandle.trim();
  if (!trimmed) return '';

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  if (/^(www\.)?linkedin\.com/i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  const cleanHandle = trimmed.replace(/^@/, '').replace(/^in\//, '').replace(/^\/+/, '');
  return `https://www.linkedin.com/in/${cleanHandle}`;
}

/**
 * Formats a clean, readable display label for LinkedIn (e.g. "linkedin.com/in/username")
 */
export function formatLinkedInLabel(urlOrHandle: string | undefined, fallbackLabel: string = 'LinkedIn'): string {
  if (!urlOrHandle) return fallbackLabel;
  const trimmed = urlOrHandle.trim();
  if (!trimmed) return fallbackLabel;

  try {
    const norm = normalizeLinkedInUrl(trimmed);
    const parsed = new URL(norm);
    let display = parsed.hostname.replace(/^www\./i, '') + parsed.pathname.replace(/\/$/, '');
    return display || fallbackLabel;
  } catch {
    const clean = trimmed.replace(/^https?:\/\/(www\.)?/i, '').replace(/^@/, '').replace(/\/$/, '');
    return clean ? (clean.includes('linkedin.com') ? clean : `linkedin.com/in/${clean}`) : fallbackLabel;
  }
}

/**
 * Normalizes GitHub input (supports full URL, short URL, or username with or without @)
 */
export function normalizeGitHubUrl(urlOrHandle: string | undefined): string {
  if (!urlOrHandle) return '';
  const trimmed = urlOrHandle.trim();
  if (!trimmed) return '';

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  if (/^(www\.)?github\.com/i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  const cleanHandle = trimmed.replace(/^@/, '').replace(/^\/+/, '');
  return `https://github.com/${cleanHandle}`;
}

/**
 * Formats a clean, readable display label for GitHub (e.g. "github.com/username")
 */
export function formatGitHubLabel(urlOrHandle: string | undefined, fallbackLabel: string = 'GitHub'): string {
  if (!urlOrHandle) return fallbackLabel;
  const trimmed = urlOrHandle.trim();
  if (!trimmed) return fallbackLabel;

  try {
    const norm = normalizeGitHubUrl(trimmed);
    const parsed = new URL(norm);
    let display = parsed.hostname.replace(/^www\./i, '') + parsed.pathname.replace(/\/$/, '');
    return display || fallbackLabel;
  } catch {
    const clean = trimmed.replace(/^https?:\/\/(www\.)?/i, '').replace(/^@/, '').replace(/\/$/, '');
    return clean ? (clean.includes('github.com') ? clean : `github.com/${clean}`) : fallbackLabel;
  }
}

/**
 * Formats a clean, readable display label for a URL
 * e.g. "https://www.linkedin.com/in/salmansakib/" -> "linkedin.com/in/salmansakib"
 */
export function formatUrlLabel(url: string | undefined, fallbackLabel?: string): string {
  if (!url) return fallbackLabel || '';
  const trimmed = url.trim();
  if (!trimmed) return fallbackLabel || '';

  try {
    const parsed = new URL(normalizeUrl(trimmed));
    let display = parsed.hostname.replace(/^www\./i, '') + parsed.pathname.replace(/\/$/, '');
    if (parsed.search) {
      display += parsed.search;
    }
    return display || fallbackLabel || trimmed;
  } catch {
    const clean = trimmed.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');
    return clean || fallbackLabel || trimmed;
  }
}

/**
 * Normalizes email to mailto: href
 */
export function mailtoHref(email: string | undefined): string {
  if (!email) return '';
  const clean = email.trim();
  return clean ? `mailto:${clean}` : '';
}

/**
 * Normalizes phone to tel: href
 */
export function telHref(phone: string | undefined): string {
  if (!phone) return '';
  const clean = phone.trim().replace(/[^0-9+]/g, '');
  return clean ? `tel:${clean}` : '';
}

/**
 * Normalizes any link or text into a fully valid URI for PDF annotations
 * so they are immediately clickable and recognized on all mobile PDF viewers (iOS & Android).
 */
export function normalizePdfLink(href: string | undefined): string {
  if (!href) return '';
  const clean = href.trim();
  if (!clean || clean === '#') return '';

  if (clean.startsWith('mailto:') || clean.startsWith('tel:')) {
    return clean;
  }

  // If contains @ and no forward slashes, it is an email address
  if (clean.includes('@') && !clean.includes('/')) {
    return `mailto:${clean}`;
  }

  // If purely digits, plus sign, spaces, hyphens and at least 6 characters, it is a telephone number
  if (/^[+0-9\s\-()]{6,}$/.test(clean) && !/[a-zA-Z]/.test(clean)) {
    return `tel:${clean.replace(/[\s\-()]/g, '')}`;
  }

  if (/^https?:\/\//i.test(clean)) {
    return clean;
  }

  return `https://${clean}`;
}
