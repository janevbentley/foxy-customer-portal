/**
 * Detects input interference, e.g. code that cancels input events by
 * calling `Event.stopPropagation()` or cancels the default browser
 * behaviour with `Event.preventDefault()`. This class is useful for
 * detecting browser plugins and extensions that might break input
 * in web components.
 */
class InputInterceptionDetector {
  private _triggered = false;
  private _callbacks: (() => void)[] = [];
  private _listeners: [string, (e: Event) => void, boolean?][] = [];
  private _timeout?: number;
  private _events: Event[] = [];

  private _watchlist = [
    "keydown",
    "keypress",
    "keyup",
    "input",
    "change",
    "cut",
    "copy",
    "paste"
  ];

  constructor() {
    this._capture();

    if (document.readyState === "complete") {
      this._track();
    } else {
      window.addEventListener("load", () => this._track());
    }
  }

  /**
   * True if input interference has been detected.
   */
  get triggered() {
    return this._triggered;
  }

  /**
   * Executes the callback function when an input interference is
   * detected on the page. If this detector has already been triggered,
   * executes the callback immediately.
   *
   * Returns the function that you can call to remove the callback
   * from the internal list of watchers.
   *
   * @param callback function to call when interference is detected
   */
  whenTriggered(callback: () => void) {
    if (this._triggered) {
      callback();
    } else {
      this._callbacks.push(callback);
    }

    return () => {
      this._callbacks = this._callbacks.filter(value => {
        return value !== callback;
      });
    };
  }

  private _capture() {
    this._watchlist.forEach(type => {
      const capture = (e: Event) => {
        this._events.push(e);
        this._resetTimeout();
      };

      window.addEventListener(type, capture, true);
      this._listeners.push([type, capture, true]);
    });
  }

  private _track() {
    setTimeout(() => {
      this._events = [];

      this._watchlist.forEach(type => {
        const test = (e: Event) => {
          if (
            e.defaultPrevented &&
            (e.target as Element).tagName.includes("-")
          ) {
            this._detect();
          } else {
            this._events.splice(this._events.indexOf(e), 1);
            this._resetTimeout();
          }
        };

        window.addEventListener(type, test);
        this._listeners.push([type, test]);
      });
    });
  }

  private _resetTimeout() {
    if (typeof this._timeout === "number") {
      clearTimeout(this._timeout);
    }

    this._timeout = setTimeout(() => {
      if (this._events.length > 0) this._detect();
    });
  }

  private _detect() {
    this._triggered = true;
    this._callbacks.forEach(v => v());
    this._callbacks = [];

    if (typeof this._timeout === "number") {
      clearTimeout(this._timeout);
      this._timeout = undefined;
    }

    this._listeners.forEach(args => window.removeEventListener(...args));
    this._listeners = [];
    this._events = [];
  }
}

export const detector = new InputInterceptionDetector();
