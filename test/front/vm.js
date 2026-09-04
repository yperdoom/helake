// Instancia a lógica de um componente Options API sem montar o template.
// A separação X.vue / X.js do projeto permite testar métodos e computed direto.
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
