# meet-work-front

Front-end part of the Meet.work project.

## VS Code configuration to properly format the code

The following VS Code extensions should be installed:

- Pretiier
- ESLint

The following VS Code config should be used as well:

```
{
  "folders": [
    {
      "path": "."
    }
  ],
  "settings": {
    "eslint.enable": true,
    "editor.formatOnSave": true,
    "eslint.workingDirectories": [
      {
        "directory": "meeting-app-front",
        "changeProcessCWD": true
      }
    ],
    "eslint.lintTask.enable": true,
    "eslint.alwaysShowStatus": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    }
  }
}
```
