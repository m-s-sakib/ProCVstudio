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
 * Formats a clean, readable display label for a URL
 * e.g. "https://www.linkedin.com/in/salmansakib/" -> "linkedin.com/in/salmansakib"
 */
export function formatUrlLabel(url: string | undefined, defaultLabel?: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  
  if (defaultLabel) return defaultLabel;

  try {
    const parsed = new URL(normalizeUrl(trimmed));
    let display = parsed.hostname.replace(/^www\./i, '') + parsed.pathname.replace(/\/$/, '');
    if (parsed.search) {
      display += parsed.search;
    }
    return display;
  } catch {
    return trimmed.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');
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
