import { useSyncExternalStore } from "react";

let activeRequests = 0;
let listeners: (() => void)[] = [];

function notify() {
  listeners.forEach((l) => l());
}

export function increment() {
  activeRequests++;
  notify();
}

export function decrement() {
  activeRequests = Math.max(0, activeRequests - 1);
  notify();
}

export function useLoading(): boolean {
  return useSyncExternalStore(
    (cb) => {
      listeners.push(cb);
      return () => {
        listeners = listeners.filter((l) => l !== cb);
      };
    },
    () => activeRequests > 0,
  );
}
