type DesktopBridge = {
  isDesktop: boolean;
  appVersion?: string;
  platform?: string;
  getMeta?: () => Promise<{ isDesktop: boolean; appVersion?: string; platform?: string }>;
  openProjectFolder?: () => Promise<string>;
  openAnkiFolder?: () => Promise<string>;
};

declare global {
  interface Window {
    desktopBridge?: DesktopBridge;
  }
}

export function getDesktopBridge() {
  if (typeof window === "undefined") return null;
  return window.desktopBridge ?? null;
}

export function isDesktopRuntime() {
  if (typeof window === "undefined") return false;
  return Boolean(getDesktopBridge()?.isDesktop) || window.location.protocol === "file:";
}

export async function openDesktopFolder(kind: "project" | "anki") {
  const bridge = getDesktopBridge();
  if (!bridge) return false;

  const action = kind === "project" ? bridge.openProjectFolder : bridge.openAnkiFolder;
  if (!action) return false;

  await action();
  return true;
}