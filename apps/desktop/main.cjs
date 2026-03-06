const { app, BrowserWindow, Menu, dialog, ipcMain, shell } = require("electron");
const path = require("node:path");
const fs = require("node:fs");
const { spawn } = require("node:child_process");

const ROOT_DIR = path.resolve(__dirname, "..", "..");
const WEB_DIST = path.join(ROOT_DIR, "apps", "web", "dist", "index.html");
const API_DIST = path.join(ROOT_DIR, "apps", "api", "dist", "server.js");

const HEALTH_URL = "http://127.0.0.1:3001/api/health";
const ANKI_DIR = path.join(process.env.APPDATA || "", "Anki2");

let mainWindow = null;
let apiProcess = null;
let ownsApiProcess = false;
let isQuitting = false;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function isApiHealthy() {
  try {
    const response = await fetch(HEALTH_URL, { headers: { Accept: "application/json" } });
    return response.ok;
  } catch {
    return false;
  }
}

function pipeOutput(label, stream) {
  if (!stream) return;
  stream.on("data", (chunk) => {
    const text = String(chunk).trim();
    if (text) {
      console.log(`[${label}] ${text}`);
    }
  });
}

async function ensureApiServer() {
  if (await isApiHealthy()) {
    return;
  }



  const apiEntry = API_DIST;
  const command = "node";

  apiProcess = spawn(command, [apiEntry], {
    cwd: path.join(ROOT_DIR, "apps", "api", "dist"),
    env: {
      ...process.env,
      NODE_ENV: "production",
      PATH: process.env.PATH,
    },
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
    shell: process.platform === "win32",
  });

  ownsApiProcess = true;
  pipeOutput("api", apiProcess.stdout);
  pipeOutput("api:error", apiProcess.stderr);

  apiProcess.once("error", (error) => {
    console.error(`[desktop] Falha ao iniciar a API: ${error.message}`);
  });

  apiProcess.once("exit", (code) => {
    if (!isQuitting && code !== 0) {
      console.error(`[desktop] API saiu com codigo ${code ?? "desconhecido"}.`);
    }
  });

  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (await isApiHealthy()) {
      return;
    }
    await sleep(500);
  }

  throw new Error("A API local nao ficou pronta em tempo util.");
}

async function stopApiServer() {
  if (!ownsApiProcess || !apiProcess || apiProcess.killed) {
    return;
  }

  const child = apiProcess;
  await new Promise((resolve) => {
    const timer = setTimeout(() => {
      if (!child.killed) {
        child.kill("SIGKILL");
      }
      resolve();
    }, 4000);

    child.once("exit", () => {
      clearTimeout(timer);
      resolve();
    });

    child.kill("SIGINT");
  });

  apiProcess = null;
}

function buildMenu() {
  const template = [
    {
      label: "Projeto",
      submenu: [
        { role: "reload", label: "Recarregar" },
        { role: "toggleDevTools", label: "DevTools" },
        { type: "separator" },
        { label: "Abrir pasta do projeto", click: () => { void shell.openPath(ROOT_DIR); } },
        { label: "Abrir pasta do Anki", click: () => { void shell.openPath(ANKI_DIR); } },
        { type: "separator" },
        { role: "quit", label: "Sair" },
      ],
    },
    {
      label: "Edicao",
      submenu: [
        { role: "undo", label: "Desfazer" },
        { role: "redo", label: "Refazer" },
        { type: "separator" },
        { role: "cut", label: "Recortar" },
        { role: "copy", label: "Copiar" },
        { role: "paste", label: "Colar" },
      ],
    },
    {
      label: "Janela",
      submenu: [
        { role: "minimize", label: "Minimizar" },
        { role: "togglefullscreen", label: "Tela cheia" },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1520,
    height: 980,
    minWidth: 1220,
    minHeight: 760,
    backgroundColor: "#07111a",
    title: "PROJETO ITA",
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
    titleBarOverlay: process.platform === "win32" ? { color: "#07111a", symbolColor: "#dbe7f3", height: 32 } : undefined,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      spellcheck: false,
    },
  });

  mainWindow.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  mainWindow.webContents.on("did-fail-load", (_event, code, description, url) => {
    console.error(`[desktop] did-fail-load code=${code} url=${url} description=${description}`);
  });
  mainWindow.webContents.on("console-message", (_event, level, message, line, sourceId) => {
    if (level >= 2) {
      console.error(`[renderer] ${sourceId}:${line} ${message}`);
      return;
    }
    console.log(`[renderer] ${sourceId}:${line} ${message}`);
  });
  mainWindow.webContents.on("did-finish-load", () => {
    console.log(`[desktop] renderer loaded ${mainWindow.webContents.getURL()}`);
    setTimeout(async () => {
      try {
        const snapshot = await mainWindow.webContents.executeJavaScript(`(() => {
          const root = document.getElementById("root");
          return {
            url: window.location.href,
            title: document.title,
            rootChildren: root ? root.children.length : -1,
            rootHtmlLength: root ? root.innerHTML.length : -1,
          };
        })()`, true);
        console.log(`[desktop] renderer snapshot ${JSON.stringify(snapshot)}`);
      } catch (error) {
        console.error(`[desktop] renderer snapshot failed: ${error.message}`);
      }
    }, 1200);
  });
  void mainWindow.loadFile(WEB_DIST, { hash: "/" });
}

async function boot() {
  if (!fs.existsSync(WEB_DIST)) {
    throw new Error("Nao encontrei o build do frontend. Rode npm --workspace apps/web run build.");
  }
  if (!fs.existsSync(API_DIST)) {
    throw new Error("Nao encontrei o build da API. Rode npm --workspace apps/api run build:prod.");
  }
  await ensureApiServer();
  buildMenu();
  createWindow();
}

ipcMain.handle("desktop:get-meta", () => ({
  isDesktop: true,
  platform: process.platform,
  appVersion: app.getVersion(),
}));

ipcMain.handle("desktop:open-project-folder", async () => shell.openPath(ROOT_DIR));
ipcMain.handle("desktop:open-anki-folder", async () => shell.openPath(ANKI_DIR));

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (!mainWindow) return;
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.focus();
  });

  app.whenReady().then(() => {
    void boot().catch(async (error) => {
      dialog.showErrorBox(
        "Falha ao abrir PROJETO ITA",
        error instanceof Error ? error.message : "Erro desconhecido no bootstrap desktop.",
      );
      await stopApiServer();
      app.quit();
    });
  });
}

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    void boot();
  }
});

app.on("window-all-closed", async () => {
  if (process.platform !== "darwin") {
    isQuitting = true;
    await stopApiServer();
    app.quit();
  }
});

app.on("before-quit", (event) => {
  if (!ownsApiProcess || !apiProcess || apiProcess.killed || isQuitting) {
    isQuitting = true;
    return;
  }

  event.preventDefault();
  isQuitting = true;
  void stopApiServer().finally(() => {
    app.exit(0);
  });
});

