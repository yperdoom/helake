// Instantiates the logic of an Options API component without mounting the template.
// The project's X.vue / X.js split allows testing methods and computed directly.
export function makeVm(definition, overrides = {}) {
  const vm = { ...(definition.data ? definition.data() : {}), ...overrides };

  for (const [key, fn] of Object.entries(definition.computed || {})) {
    Object.defineProperty(vm, key, { get: () => fn.call(vm), configurable: true });
  }

  for (const [key, fn] of Object.entries(definition.methods || {})) {
    vm[key] = (...args) => fn.apply(vm, args);
  }

  return vm;
}

export function jsonResponse(body, status = 200) {
  return { status, ok: status < 400, json: () => Promise.resolve(body) };
}
