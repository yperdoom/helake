// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { jsonResponse, makeVm } from './vm.js';

vi.mock('@/lib/api.js', () => ({ apiFetch: vi.fn() }));

const { default: AppSettings } = await import('../../src/pages/AppSettings/AppSettings.js');
const { apiFetch } = await import('@/lib/api.js');

const USERS = [
  { _id: 'u1', email: 'pedro@b.com', name: 'Pedro', role: 'admin' },
  { _id: 'u2', email: 'ela@b.com', name: 'Ela', role: 'user' },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe('AppSettings', () => {
  it('loads the user list', async () => {
    apiFetch.mockResolvedValue(jsonResponse({ users: USERS }));
    const vm = makeVm(AppSettings);
    await vm.load();

    expect(apiFetch).toHaveBeenCalledWith('/api/users');
    expect(vm.users).toHaveLength(2);
  });

  it('shows the server message when the API refuses', async () => {
    apiFetch.mockRejectedValue(Object.assign(new Error('Forbidden'), { status: 403 }));
    const vm = makeVm(AppSettings);
    await vm.load();

    expect(vm.error).toContain('Forbidden');
  });

  it('creates a user with email, name, password and role', async () => {
    apiFetch.mockResolvedValue(jsonResponse({ users: [] }));
    const vm = makeVm(AppSettings);
    vm.form.email = 'nova@b.com';
    vm.form.name = 'Nova';
    vm.form.password = 'segredo';
    vm.form.role = 'user';
    await vm.save();

    const [path, options] = apiFetch.mock.calls[0];
    expect(path).toBe('/api/users');
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body)).toEqual({
      email: 'nova@b.com', name: 'Nova', password: 'segredo', role: 'user',
    });
  });

  it('does not create without email or password', async () => {
    const vm = makeVm(AppSettings);
    vm.form.email = 'nova@b.com';
    await vm.save();
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it('edit fills the form and locks the email', () => {
    const vm = makeVm(AppSettings);
    vm.edit(USERS[1]);

    expect(vm.editingId).toBe('u2');
    expect(vm.form.name).toBe('Ela');
    expect(vm.form.role).toBe('user');
    expect(vm.form.password).toBe('');
    expect(vm.isEditing).toBe(true);
  });

  it('when editing sends only name and role, without a blank password', async () => {
    apiFetch.mockResolvedValue(jsonResponse({ users: [] }));
    const vm = makeVm(AppSettings);
    vm.edit(USERS[1]);
    vm.form.role = 'admin';
    await vm.save();

    const [path, options] = apiFetch.mock.calls[0];
    expect(path).toBe('/api/users/u2');
    expect(options.method).toBe('PUT');
    expect(JSON.parse(options.body)).toEqual({ name: 'Ela', role: 'admin' });
  });

  it('when editing with a new password, includes the password', async () => {
    apiFetch.mockResolvedValue(jsonResponse({ users: [] }));
    const vm = makeVm(AppSettings);
    vm.edit(USERS[1]);
    vm.form.password = 'trocada';
    await vm.save();

    expect(JSON.parse(apiFetch.mock.calls[0][1].body).password).toBe('trocada');
  });

  it('clears the form and reloads after saving', async () => {
    apiFetch.mockResolvedValue(jsonResponse({ users: USERS }));
    const vm = makeVm(AppSettings);
    vm.form.email = 'n@b.com';
    vm.form.password = 'x';
    await vm.save();

    expect(vm.form.email).toBe('');
    expect(vm.editingId).toBeNull();
    expect(apiFetch.mock.calls[1][0]).toBe('/api/users');
  });

  it('deletes the user and reloads', async () => {
    apiFetch.mockResolvedValue(jsonResponse({ users: [] }));
    const vm = makeVm(AppSettings);
    await vm.remove('u2');

    expect(apiFetch.mock.calls[0]).toEqual(['/api/users/u2', { method: 'DELETE' }]);
    expect(apiFetch).toHaveBeenCalledTimes(2);
  });

  it('shows the reason when the server refuses the deletion', async () => {
    apiFetch.mockRejectedValue(
      Object.assign(new Error('Cannot delete the last admin'), { status: 400 }),
    );
    const vm = makeVm(AppSettings);
    await vm.remove('u1');

    expect(vm.error).toContain('Cannot delete the last admin');
  });
});
