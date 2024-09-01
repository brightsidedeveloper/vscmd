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

type Events = {
  test: {
    files: { path: string; content: string }[];
  };
};

const chrome = new BrightBaseRealtime<Events>('vscode');

export function activate(context: vscode.ExtensionContext) {
  console.log('Chrome Voice GPT Extension is now active!');

  const getFiles = () => {
    const openEditors = vscode.window.visibleTextEditors;

    // Extract file paths and contents
    const files = openEditors.map((editor) => ({
      path: editor.document.uri.fsPath,
      content: editor.document.getText(),
    }));
    return files;
  };

  const disposables = [
    vscode.commands.registerCommand('chrome-gpt-fire.sendOpenFiles', () => {
      chrome.emit('send-files', { files: getFiles() });
      vscode.window.showInformationMessage('Sending files to Chrome Voice GPT Extension');
    }),
    vscode.commands.registerCommand('chrome-gpt-fire.sendOpenWithQuery', () => {
      vscode.window.showInputBox({ prompt: 'Enter your query' }).then((query) => {
        if (!query) {
          vscode.window.showInformationMessage('No query entered');
          return;
        }

        chrome.emit('send-files-with-query', { files: getFiles(), query });
        vscode.window.showInformationMessage('Sending files to Chrome Voice GPT Extension');
      });
    }),
    vscode.commands.registerCommand('chrome-gpt-fire.sendSelection', () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage('No active text editor');
        return;
      }

      const selection = editor.selection;
      const selectedText = editor.document.getText(selection);

      if (!selectedText) {
        vscode.window.showInformationMessage('No text selected');
        return;
      }

      chrome.emit('send-selection', { code: selectedText });
    }),
    vscode.commands.registerCommand('chrome-gpt-fire.sendSelectionWithQuery', () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage('No active text editor');
        return;
      }

      const selection = editor.selection;
      const selectedText = editor.document.getText(selection);

      if (!selectedText) {
        vscode.window.showInformationMessage('No text selected');
        return;
      }

      vscode.window.showInputBox({ prompt: 'Enter your query' }).then((query) => {
        if (!query) {
          vscode.window.showInformationMessage('No query entered');
          return;
        }

        chrome.emit('send-selection-with-query', { code: selectedText, query });
        vscode.window.showInformationMessage('Sending code selection to Chrome Voice GPT Extension');
      });
    }),
  ];

  disposables.forEach((disposable) => context.subscriptions.push(disposable));
}

// This method is called when your extension is deactivated
export function deactivate() {}
