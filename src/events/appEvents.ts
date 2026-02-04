type Listener = () => void;

class AppEvents {
  private listeners: Record<string, Listener[]> = {};

  on(event: string, cb: Listener) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(cb);

    return () => {
      this.listeners[event] = this.listeners[event].filter(
        l => l !== cb
      );
    };
  }

  emit(event: string) {
    this.listeners[event]?.forEach(cb => cb());
  }
}

export const appEvents = new AppEvents();

export const EVENTS = {
  STATS_UPDATED: "STATS_UPDATED",
};
