import { writable } from 'svelte/store';

const createParticleStore = () => {
  const { subscribe, set, update } = writable([]);

  return {
    subscribe,
    add: (particle) => update((particles) => [...particles, particle]),
    remove: (particle) => update((particles) => particles.filter((p) => p.id !== particle.id)),
    reset: () => set([])
  };
};

export const particleStore = createParticleStore();
export const cooldownStore = writable(false);
