# CLAUDE.md

This repository now consolidates all assistant guidance under `AGENTS.md` files managed by the superpowers submodule. Use the list below to jump to the right doc:

- `AGENTS.md` — top-level rules for every AI coding agent (symlinked from superpowers/system-prompts/AGENTS.md)
- `api/tests/AGENTS.md` — testing strategy, fixtures, and patterns for agents (symlinked from superpowers/system-prompts/testing/AGENTS.md)

Keep these files in sync by updating them in the `superpowers/` submodule.

# Command Restrictions

- Never run any `git` commands yourself. If you need repository state (diffs, status, history), describe the command and ask the user to execute it and share the output.

# When to Answer vs When to Code

**DEFAULT TO ANSWERING, NOT CODING.** Only write code when explicitly asked with phrases like "make that change" or "go ahead and fix it."

DO NOT jump to fixing bugs when the user is:
- Asking questions (even about errors or problems)
- Discussing or analyzing behavior
- Using question marks
- Saying things like "should we", "could we", "would it be better"
