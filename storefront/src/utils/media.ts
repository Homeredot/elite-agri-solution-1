import type { SyntheticEvent } from "react";
import { resolveMediaUrl } from "../api/client";

const escapeSvg = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export const buildPlaceholderImage = (title: string, accent: string) => {
  const initials = title
    .split(/\s+/)
    .map((part) => part[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase() || "FM";

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" role="img" aria-label="${escapeSvg(title)}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${accent}"/>
          <stop offset="100%" stop-color="#F4E8C8"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="900" fill="url(#bg)"/>
      <circle cx="965" cy="180" r="120" fill="rgba(255,255,255,0.28)"/>
      <circle cx="180" cy="720" r="170" fill="rgba(16,22,22,0.08)"/>
      <rect x="120" y="110" width="960" height="680" rx="42" fill="rgba(255,255,255,0.32)" stroke="rgba(16,22,22,0.09)"/>
      <text x="600" y="430" text-anchor="middle" font-size="220" font-family="Trebuchet MS, Segoe UI, sans-serif" font-weight="700" fill="#20311D">${escapeSvg(initials)}</text>
      <text x="600" y="540" text-anchor="middle" font-size="58" font-family="Trebuchet MS, Segoe UI, sans-serif" fill="#20311D">${escapeSvg(title)}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export const resolveStoreImage = (
  value: string | null | undefined,
  fallbackTitle: string,
  accent = "#EAB676"
) => resolveMediaUrl(value) || buildPlaceholderImage(fallbackTitle, accent);

export const handleStoreImageError = (
  event: SyntheticEvent<HTMLImageElement>,
  fallbackTitle: string,
  accent = "#EAB676"
) => {
  const target = event.currentTarget;
  target.onerror = null;
  target.src = buildPlaceholderImage(fallbackTitle, accent);
};
