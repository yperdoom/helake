import { existsSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = (p) => readFileSync(join(root, p), 'utf8');

describe('manifest', () => {
  const manifest = JSON.parse(read('public/manifest.webmanifest'));

  it('identifies the app as Yper', () => {
    expect(manifest.name).toBe('Yper');
    expect(manifest.short_name).toBe('Yper');
  });

  it('opens at the hub, in standalone mode', () => {
    expect(manifest.start_url).toBe('/');
    expect(manifest.display).toBe('standalone');
  });

  it('defines theme and background colors', () => {
    expect(manifest.theme_color).toMatch(/^#[0-9a-f]{6}$/i);
    expect(manifest.background_color).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it('declares 192 and 512 icons', () => {
    const sizes = manifest.icons.map((icon) => icon.sizes);
    expect(sizes).toContain('192x192');
    expect(sizes).toContain('512x512');
  });

  it('every declared icon exists on disk and is not empty', () => {
    for (const icon of manifest.icons) {
      const path = join(root, 'public', icon.src.replace(/^\//, ''));
      expect(existsSync(path), `${icon.src} does not exist`).toBe(true);
      expect(statSync(path).size).toBeGreaterThan(0);
    }
  });
});

describe('index.html', () => {
  const html = read('index.html');

  it('uses Yper as the title', () => {
    expect(html).toMatch(/<title>Yper<\/title>/);
  });

  it('points at the manifest', () => {
    expect(html).toContain('rel="manifest"');
    expect(html).toContain('/manifest.webmanifest');
  });

  it('declares theme-color', () => {
    expect(html).toContain('name="theme-color"');
  });

  it('declares apple-touch-icon, which iOS requires as PNG', () => {
    const match = html.match(/rel="apple-touch-icon"[^>]*href="([^"]+)"/);
    expect(match, 'apple-touch-icon missing').toBeTruthy();
    expect(match[1]).toMatch(/\.png$/);
    expect(existsSync(join(root, 'public', match[1].replace(/^\//, '')))).toBe(true);
  });
});
