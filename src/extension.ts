// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { BrightBaseRealtime, initBrightBase } from 'bsdweb';
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
initBrightBase(
  'https://ybpjdhzaqaogrojgsjxh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlicGpkaHphcWFvZ3JvamdzanhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDYzNzMyOTYsImV4cCI6MjAyMTk0OTI5Nn0.CWTPdwYlV1g6Zif2dKRfVJHK8xwxNhS8gb9Sg3EY4Dg'
);

type ChromeEvents = {
  CONNECTED: {};
  GET_SELECTED_CODE: { prompt: string };
  GET_OPEN_FILES: { prompt: string };
  RECEIVE_SELECTED_CODE: { prompt: string; code: string; fileName: string };
  RECEIVE_OPEN_FILES: { prompt: string; files: { path: string; content: string }[] };
};

const chrome = new BrightBaseRealtime<ChromeEvents>('vscode-chrome');

const subscriptions = [];

export function activate(context: vscode.ExtensionContext) {
  const getFiles = () => {
    const openEditors = vscode.window.visibleTextEditors;

    // Extract file paths and contents
    const files = openEditors.map((editor) => ({
      path: editor.document.uri.fsPath,
      content: editor.document.getText(),
    }));
    return files;
  };

  const disposables: vscode.Disposable[] = [
    vscode.commands.registerCommand('vscmd.getOpenFiles', (prompt: string) => {
      chrome.emit('RECEIVE_OPEN_FILES', { files: getFiles(), prompt });
    }),
    vscode.commands.registerCommand('vscmd.getSelectedCode', (prompt: string) => {
      const split = getFiles()[0]?.path.split('\\');
      if (!split) {
        return;
      }
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage('No active text editor');
        return;
      }

      const code = editor.document.getText(editor.selection);
      const fileName = split[split.length - 1];
      chrome.emit('RECEIVE_SELECTED_CODE', { fileName, code, prompt });
    }),
    vscode.commands.registerCommand('vscmd.listen', () => {
      [
        chrome.subscribe(),
        chrome.on('CONNECTED', () => chrome.emit('CONNECTED', {})),
        chrome.on('GET_OPEN_FILES', ({ prompt }) => {
          vscode.window.showInformationMessage(prompt);
          vscode.commands.executeCommand('vscmd.getOpenFiles', prompt);
        }),
        chrome.on('GET_SELECTED_CODE', ({ prompt }) => {
          vscode.window.showInformationMessage(prompt);
          vscode.commands.executeCommand('vscmd.getSelectedCode', prompt);
        }),
      ].forEach((subscription) => subscriptions.push(subscription));
      chrome.emit('CONNECTED', {});
    }),
    vscode.commands.registerCommand('vscmd.stopListening', () => {
      chrome.emit('DISCONNECTED', {});
      subscriptions.forEach((dispose) => dispose());
    }),
  ];

  disposables.forEach((disposable) => context.subscriptions.push(disposable));
}

// This method is called when your extension is deactivated
export function deactivate() {
  chrome.emit('DISCONNECTED', {});
  subscriptions.forEach((subscription) => subscription.dispose());
}
