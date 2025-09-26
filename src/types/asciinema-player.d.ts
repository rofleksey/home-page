// asciinema-player.d.ts

declare module 'asciinema-player' {
  interface PlayerOptions {
    logger?: any;
    [key: string]: any;
  }

  interface Player {
    el: HTMLElement;
    dispose: () => void;
    getCurrentTime: () => Promise<number>;
    getDuration: () => Promise<number>;
    play: () => Promise<void>;
    pause: () => Promise<void>;
    seek: (pos: number) => Promise<void>;
    addEventListener: (name: string, callback: (...args: any[]) => void) => void;
  }

  export class Core {
    constructor(src: string, opts: any);
    init(): Promise<void>;
    getCurrentTime(): number;
    getDuration(): number;
    play(): void;
    pause(): void;
    seek(pos: number): void;
    addEventListener(name: string, callback: (...args: any[]) => void): void;
  }

  export function create(src: string, elem: HTMLElement, opts?: PlayerOptions): Player;

  // Named export for your usage pattern
  export const AsciinemaPlayer: {
    create: (src: string, elem: HTMLElement, opts?: PlayerOptions) => Player;
  };

  // Default export for ES6 module imports
  export default {
    create,
    AsciinemaPlayer: { create }
  };
}