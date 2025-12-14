# Session Hooks

Hook scripts that run automatically during Claude Code sessions.

## SessionStart Hook

The `session_start.py` hook injects the getting-started skill into every session, forcing Claude to run `/prime` before responding.

### How It Works

1. Hook is registered in `.claude/settings.json`:
   ```json
   {
     "hooks": {
       "SessionStart": [{
         "type": "command",
         "command": "python3 .claude/hooks/session_start.py"
       }]
     }
   }
   ```
2. When a session starts, the hook loads `.claude/skills/getting-started/SKILL.md`
3. The skill content instructs Claude to run `/prime`
4. Claude executes `/prime`, gaining full codebase context

### Testing

```bash
python3 .claude/hooks/session_start.py
```
