# Chrome-GPT-Fire

Chrome-GPT-Fire is a VS Code extension that sends the content of your open files in VS Code to a [Chrome Extension](https://github.com/brightsidedeveloper/gpt-voice) using a real-time channel with Supabase.

## Features

- **Send Open Files**: Automatically send the content of currently open files in VS Code to the Chrome extension.
- **Real-Time Communication**: Uses Supabase for real-time data exchange.
- **Customizable Commands**: Easily trigger actions directly from the command palette.

## Installation

1. **Install the Extension**: Download the `.vsix` file and install it in VS Code:

   - Go to the Extensions view (`Ctrl+Shift+X`).
   - Click on the `...` menu in the top-right corner and choose "Install from VSIX...".
   - Select the downloaded `.vsix` file.

2. **Activate the Extension**: Run the command `chrome-gpt-fire.sendOpenFiles` from the command palette (`Ctrl+Shift+P`).

## Usage

1. Open any files in VS Code.
2. Run the `Send Open Files` command (`chrome-gpt-fire.sendOpenFiles`) from the command palette.
3. The content of open files will be sent to the Chrome extension in real-time.

## Development

Read the code and figure it out 🙃
