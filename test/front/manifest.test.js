import { existsSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = (p) => readFileSync(join(root, p), 'utf8');

describe('manifest', () => {
  const manifest = JSON.parse(read('public/manifest.webmanifest'));

  it('identifica o app como Yper', () => {
    expect(manifest.name).toBe('Yper');
    expect(manifest.short_name).toBe('Yper');
  });

  it('abre no hub, em modo standalone', () => {
    expect(manifest.start_url).toBe('/');
    expect(manifest.display).toBe('standalone');
  });

  it('define cores de tema e fundo', () => {
    expect(manifest.theme_color).toMatch(/^#[0-9a-f]{6}$/i);
    expect(manifest.background_color).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it('declara ícones 192 e 512', () => {
    const sizes = manifest.icons.map((icon) => icon.sizes);
    expect(sizes).toContain('192x192');
    expect(sizes).toContain('512x512');
  });

  it('todo ícone declarado existe em disco e não está vazio', () => {
    for (const icon of manifest.icons) {
      const path = join(root, 'public', icon.src.replace(/^\//, ''));
      expect(existsSync(path), `${icon.src} não existe`).toBe(true);
      expect(statSync(path).size).toBeGreaterThan(0);
    }
  });
});

describe('index.html', () => {
  const html = read('index.html');

  it('usa Yper como título', () => {
    expect(html).toMatch(/<title>Yper<\/title>/);
  });

  it('aponta para o manifest', () => {
    expect(html).toContain('rel="manifest"');
    expect(html).toContain('/manifest.webmanifest');
  });

  it('declara theme-color', () => {
    expect(html).toContain('name="theme-color"');
  });

  it('declara apple-touch-icon, que o iOS exige em PNG', () => {
    const match = html.match(/rel="apple-touch-icon"[^>]*href="([^"]+)"/);
    expect(match, 'apple-touch-icon ausente').toBeTruthy();
    expect(match[1]).toMatch(/\.png$/);
    expect(existsSync(join(root, 'public', match[1].replace(/^\//, '')))).toBe(true);
  });
});
