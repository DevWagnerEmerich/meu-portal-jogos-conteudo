/**
 * EventBus — Observer / Pub-Sub pattern
 * Provides loose coupling between all modules.
 */
class EventBus {
  #listeners = new Map();

  /**
   * Subscribe to an event.
   * @param {string} event
   * @param {Function} callback
   */
  on(event, callback) {
    if (!this.#listeners.has(event)) {
      this.#listeners.set(event, new Set());
    }
    this.#listeners.get(event).add(callback);
    return () => this.off(event, callback); // returns unsubscribe fn
  }

  /**
   * Unsubscribe from an event.
   * @param {string} event
   * @param {Function} callback
   */
  off(event, callback) {
    this.#listeners.get(event)?.delete(callback);
  }

  /**
   * Emit an event with payload.
   * @param {string} event
   * @param {*} data
   */
  emit(event, data) {
    this.#listeners.get(event)?.forEach(cb => {
      try { cb(data); } catch (err) {
        console.error(`[EventBus] Error in listener for "${event}":`, err);
      }
    });
  }

  /** Remove all listeners for an event. */
  clear(event) {
    if (event) this.#listeners.delete(event);
    else this.#listeners.clear();
  }
}

// Singleton export
export default new EventBus();
