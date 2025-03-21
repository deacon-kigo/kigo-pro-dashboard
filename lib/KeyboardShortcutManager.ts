'use client';

type ShortcutHandler = () => void;

interface RegisteredShortcut {
  keys: string[];
  handler: ShortcutHandler;
  description: string;
}

class KeyboardShortcutManager {
  private shortcuts: RegisteredShortcut[] = [];
  private keysPressed: Set<string> = new Set();
  private isListening: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.startListening();
    }
  }

  public registerShortcut(keys: string[], handler: ShortcutHandler, description: string): void {
    this.shortcuts.push({
      keys: keys.map(key => key.toLowerCase()),
      handler,
      description
    });
  }

  public unregisterShortcut(keys: string[]): void {
    const normalizedKeys = keys.map(key => key.toLowerCase());
    this.shortcuts = this.shortcuts.filter(shortcut => 
      !this.arraysEqual(shortcut.keys, normalizedKeys)
    );
  }

  public getRegisteredShortcuts(): { keys: string[], description: string }[] {
    return this.shortcuts.map(s => ({
      keys: [...s.keys],
      description: s.description
    }));
  }

  private startListening(): void {
    if (this.isListening) return;

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('blur', this.handleBlur);
    
    this.isListening = true;
  }

  public stopListening(): void {
    if (!this.isListening) return;

    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('blur', this.handleBlur);
    
    this.isListening = false;
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.target instanceof HTMLInputElement || 
        event.target instanceof HTMLTextAreaElement) {
      return; // Don't trigger shortcuts when typing in input fields
    }

    const key = event.key.toLowerCase();
    this.keysPressed.add(key);

    // Check if any registered shortcut matches the current key combination
    for (const shortcut of this.shortcuts) {
      if (this.isShortcutActive(shortcut.keys)) {
        event.preventDefault();
        shortcut.handler();
        break;
      }
    }
  };

  private handleKeyUp = (event: KeyboardEvent): void => {
    const key = event.key.toLowerCase();
    this.keysPressed.delete(key);
  };

  private handleBlur = (): void => {
    this.keysPressed.clear();
  };

  private isShortcutActive(shortcutKeys: string[]): boolean {
    // All keys in the shortcut must be pressed
    for (const key of shortcutKeys) {
      if (!this.keysPressed.has(key)) {
        return false;
      }
    }

    // The number of pressed keys should match the shortcut length
    // This prevents triggering when additional keys are pressed
    return this.keysPressed.size === shortcutKeys.length;
  }

  private arraysEqual(a: string[], b: string[]): boolean {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((val, idx) => val === sortedB[idx]);
  }
}

// Singleton instance
const shortcutManager = new KeyboardShortcutManager();
export default shortcutManager; 