import type { Events } from './events';
type EventHandler<T> = (args: T) => boolean | unknown;

export class Emitter<EventTypes> {
  events = new Map<keyof EventTypes, EventHandler<EventTypes[keyof EventTypes]>[]>();

  constructor(events: Events) {
    if (events.handlers) {
      for (const key in events.handlers) {
        if (Object.hasOwn(events.handlers, key)) {
          this.events.set(key as keyof EventTypes, events.handlers as EventHandler<EventTypes[keyof EventTypes]>[]);
        }
      }
    } else {
      this.events = new Map();
    }
  }

  on(name: keyof EventTypes | (keyof EventTypes)[], handler: EventHandler<EventTypes[keyof EventTypes]>): this {
    const names = Array.isArray(name) ? name : [name];
    names.forEach(key => {
      if (!this.events.has(key)) {
        this.events.set(key, []);
      }

      this.events.get(key)!.push(handler);
    });

    return this;
  }

  emit<K extends keyof EventTypes>(name: K, params: EventTypes[K]) {
    if (!this.events.has(name)) {
      throw new Error(`The event ${String(name)} cannot be triggered`);
    }
    return this.events.get(name)?.reduce((r, e) => {
      return e(params) !== false && r;
    }, true);
  }

  bind<K extends keyof EventTypes>(name: K) {
    if (this.events.has(name)) {
      throw new Error(`The event ${String(name)} is already bound`);
    }
    this.events.set(name, []);
  }

  exist<K extends keyof EventTypes>(name: K) {
    return this.events.has(name);
  }

  off<K extends keyof EventTypes>(name: K, handler?: EventHandler<EventTypes[keyof EventTypes]>) {
    const listeners = this.events.get(name);
    if (listeners) {
      if (!handler) {
        this.events.set(name, []);
      } else {
        const index = listeners.indexOf(handler as EventHandler<EventTypes[keyof EventTypes]>);
        if (index !== -1) {
          listeners.splice(index, 1);
        }
      }
    }
  }

  reset() {
    this.events.clear();
  }
}
