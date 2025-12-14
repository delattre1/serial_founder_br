---
name: sdlc
description: SDLC workflow automation that implements features using TDD skill, runs tests, commits changes, and pushes to remote. Use when user provides a spec/plan for a new feature. Workflow: (1) invokes test-driven-development skill with spec, (2) runs test-runner skill (lint/type checks), (3) commits all modified files related to the request, (4) pushes to remote repository.
---

# SDLC - Software Development Lifecycle Automation

## Overview

This skill automates the complete software development lifecycle workflow for implementing features:

**Workflow:** TDD Skill → Test-Runner Skill → Identify Files → Commit → Push

1. Invoke test-driven-development skill with the spec/plan
2. Invoke test-runner skill (runs `just lint` to fix formatting and type issues)
3. Identify all modified files related to the user's request
4. Commit those files with appropriate conventional commit message(s)
5. Push the changes to the remote repository

All code changes go through proper quality checks and are committed with well-formatted conventional commit messages.

## When This Skill Is Invoked

**Immediately execute the SDLC workflow. DO NOT ask questions first.**

**Execute these steps NOW:**

1. Invoke the test-driven-development skill with the spec/plan
2. Invoke the test-runner skill (runs `just lint` to fix formatting and type issues)
3. Identify all modified files related to the user's request
4. Commit those files with appropriate conventional commit message(s)
5. Push the changes to the remote repository

**DO NOT:**
- ❌ Ask "Would you like me to run the workflow?"
- ❌ Ask "Should I commit the changes?"
- ❌ Wait for user confirmation

**JUST RUN IT. The user invoked this skill to complete the SDLC workflow.**

## Workflow

### Step 1: Invoke TDD Skill

Invoke the test-driven-development skill with the spec/plan:

```
Use the TDD skill to address this '/path/to/spec.md'
```

Or with inline spec:

```
Use the TDD skill to implement this feature: [description]
```

The TDD skill handles all implementation details (tests first, code, refactor).

---

### Step 2: Run Test-Runner

Invoke the test-runner skill:
- This runs `just lint` which auto-fixes formatting issues (ruff) and checks types (mypy)
- Files will be modified by the linter
- If lint fails, errors will be shown and must be fixed before proceeding

### Step 3: Identify Modified Files

After test-runner completes:
- Run `git status` to see all modified files
- Identify which files are related to the user's request
- Include both:
  - Files modified by TDD skill (production code and test files)
  - Files that were auto-fixed by the linter in Step 2

### Step 4: Commit Changes

Run `/commit` with all modified files related to the user's request:

```bash
/commit src/vad/remove_silence.py src/vad/vad_poc.py
```

The `/commit` command handles everything automatically.

### Step 5: Push Changes

After successfully committing, push the changes to the remote repository:

```bash
/push
```

The `/push` command automatically:
- Detects the current branch
- Pushes to the same branch name on remote (e.g., `daniel/feat-123` → `origin/daniel/feat-123`)
- Uses safe push practices (never uses `--force`, only `--force-with-lease` when needed)

## Current Capabilities

**Phase 1 (Current):**
1. ✅ TDD Skill Integration - Invokes test-driven-development skill
2. ✅ Test-Runner Skill Integration - Invokes test-runner skill for lint/type checks
3. ✅ Commit Automation - Commits modified files with `/commit`
4. ✅ Push Automation - Pushes to remote with `/push`

**Phase 2 (Planned):**
- 🚧 PR Creation - Generate pull requests automatically
- 🚧 CI/CD Integration - Trigger and monitor CI pipelines

## Usage Examples

### Example 1: Implement from spec file

```
Use the SDLC skill to implement specs/add-cli-to-v5-v6.md
```

Runs: TDD skill → test-runner skill → commit → push

### Example 2: Implement from inline description

```
Use the SDLC skill to add CLI arguments to v5 and v6
```

Runs: TDD skill → test-runner skill → commit → push

## Notes

- **TDD First**: Always invokes test-driven-development skill first to implement features
- **Quality Gates**: Always runs test-runner before commit (ensures code quality)
- **Smart Commits**: Only commits files related to the user's request (not all modified files)
- **Automated**: The `/commit` and `/push` commands handle all logic automatically
- **Safe Push**: Uses safe practices (never overwrites other people's changes)
- **No Questions**: Executes immediately when invoked (don't ask for confirmation)
