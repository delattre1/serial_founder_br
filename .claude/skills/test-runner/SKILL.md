---
name: test-runner
description: MANDATORY skill for running tests and lint after EVERY code change. Focuses on adherence to just commands and running tests in parallel. If tests fail, use test-fixer skill.
---

# Test Runner - MANDATORY WORKFLOW

╔══════════════════════════════════════════════════════════════════════════╗
║  🚨 CURRENT TEST COMMANDS: just test && just lint                        ║
║                                                                          ║
║  You MUST run `just test` AND `just lint` after EVERY code change.      ║
║  You can only say "tests pass" after running both and seeing output.    ║
╚══════════════════════════════════════════════════════════════════════════╝

## 🚀 When This Skill Is Invoked

**Immediately run the test suite and report results. DO NOT ask questions first.**

**Execute these steps NOW:**

1. Run `just test` (pytest tests)
2. Run `just lint` (ruff + mypy)
3. Show the full output to the user
4. Report status using correct claim language:
   - If successful: "Tests pass (pytest + ruff + mypy)"
   - If failed: Show errors and fix them immediately

**DO NOT:**
- ❌ Ask "Would you like me to run tests?"
- ❌ Ask "Should I check the codebase?"
- ❌ Wait for user confirmation

**JUST RUN IT. The user invoked this skill to run tests, so run them.**

## 📊 Claim Language Must Match Command

**Your claim MUST match what you actually ran:**

| Command Run | ✅ Allowed Claims | ❌ BANNED Claims |
|-------------|-------------------|------------------|
| `just test` only | "pytest passes", "unit tests pass" | "all tests pass", "tests pass" |
| `just lint` only | "lint passes", "lint checks pass" | "tests pass", "all tests pass" |
| `just test && just lint` | "tests pass", "all tests pass" | N/A |

**Examples:**

❌ WRONG: "I ran `just lint`, all tests pass"
✅ RIGHT: "Lint passes (ruff + mypy)"

❌ WRONG: "Tests are passing" (after only running lint)
✅ RIGHT: "Lint checks pass"

✅ RIGHT: "Tests pass (pytest + ruff + mypy)" (after running both `just test` and `just lint`)

## 🚨 CRITICAL FOR TEST WRITING

- **BEFORE writing tests** → Use test-writer skill (MANDATORY - analyzes code type, dependencies, contract)
- **AFTER writing tests** → Invoke pytest-test-reviewer agent (validates patterns)
- **YOU CANNOT WRITE TESTS WITHOUT test-writer SKILL** - No exceptions, no shortcuts, every test, every time

## 🔥 CRITICAL: This Skill Is Not Optional

**After EVERY code change, you MUST follow this workflow.**

No exceptions. No shortcuts. No "it's a small change" excuses.

## ⚠️ FUNDAMENTAL HYGIENE: Only Commit Code That Passes Tests

**CRITICAL WORKFLOW PRINCIPLE:**

We only commit code that passes tests. This means:

**If tests fail after your changes → YOUR changes broke them (until proven otherwise)**

### The Stash/Pop Verification Protocol

**NEVER claim test failures are "unrelated" or "pre-existing" without proof.**

**To verify a failure is truly unrelated:**
```bash
# 1. Remove your changes temporarily
git stash

# 2. Run tests and lint
just test
just lint

# 3. Observe the result:
# - If tests/lint PASS → YOUR changes broke it (fix your code)
# - If tests/lint FAIL → pre-existing issue (rare on main/merge base)

# 4. Restore your changes
git stash pop
```

**Why This Matters:**
- Tests on `main` branch ALWAYS pass (CI enforces this)
- Tests at your merge base ALWAYS pass (they passed to get into main)
- Therefore: test failures after your changes = your changes broke them
- The stash/pop protocol is the ONLY way to prove otherwise

**DO NOT:**
- ❌ Assume failures are unrelated
- ❌ Say "that test was already broken"
- ❌ Claim "it's just a flaky test" without verification
- ❌ Skip investigation because "it's not my area"

**ALWAYS:**
- ✅ Stash changes first
- ✅ Verify tests pass without your changes
- ✅ Only then claim pre-existing issue (if true)
- ✅ Otherwise: use test-fixer skill to diagnose and fix

**If tests fail after your changes:**
- DO NOT guess at fixes
- DO NOT investigate manually
- ✅ **Use the test-fixer skill** - it will systematically investigate, identify root cause, and iterate on fixes until tests pass

## ⚠️ Always Use `just` Commands

**ALWAYS use `just` commands for consistency and proper environment setup.**

Pass pytest args in quotes when we add tests: `just test "path/to/test.py::test_name -vv"`

## MANDATORY WORKFLOW: Every Code Change

**After making ANY code change:**

### Step 1: ALWAYS Run Tests (Pytest)
```bash
just test
```

**This command:**
1. Runs all pytest tests in the `/tests` directory
2. Shows verbose output with test results

**YOU MUST:**
- ✅ Run this command and see the output
- ✅ Verify all tests pass
- ✅ If failures occur: Fix them IMMEDIATELY before continuing
- ✅ NEVER skip this step, even for "tiny" changes

### Step 2: ALWAYS Run Lint (Auto-fix + Type Checking)
```bash
just lint
```

**This command:**
1. Auto-fixes formatting/lint issues (runs `ruff check --fix`)
2. Verifies all issues are resolved
3. Runs mypy type checking

**YOU MUST:**
- ✅ Run this command and see the output
- ✅ Verify output shows "✅ All checks passed!"
- ✅ If failures occur: Fix them IMMEDIATELY before continuing
- ✅ NEVER skip this step, even for "tiny" changes

**NEVER say "tests pass" unless you:**
- Actually ran BOTH commands (`just test` AND `just lint`)
- Saw the actual output from both
- Confirmed both show success

## Primary Commands (Reference)

### Tests (Pytest)
```bash
just test
```
Runs all pytest tests. Use after EVERY code change.

### Lint (Ruff + Mypy)
```bash
just lint
```
Runs ruff (auto-fix) + mypy (type checking). Use after EVERY code change.

## 🚨 VIOLATIONS: What NOT To Do

**These are VIOLATIONS of this skill:**

❌ **CRITICAL: Claiming test/lint failures are "unrelated" to your changes**
- WRONG: "The test failure is unrelated to our changes"
- WRONG: "That lint error was already there"
- RIGHT: **Use stash/pop protocol to verify, then fix**

**FUNDAMENTAL RULE: Tests and lint ALWAYS pass on main/merge base. If they fail after your changes, YOUR changes broke them.**

❌ **Claiming tests pass without showing output (LYING)**
- WRONG: "tests passed" (WHERE is the output?)
- WRONG: "just ran it and tests pass" (WHERE is the output?)
- WRONG: "I fixed the bug, tests should pass"
- WRONG: "Yes - want me to run it again?" (DEFLECTION)
- RIGHT: *Runs `just test` and `just lint` and shows actual output*

**🚨 THE RULE: If you can't see pytest output AND "✅ All checks passed!" in your context, you're lying about tests passing.**

❌ **Skipping tests/lint "because it's a small change"**
- WRONG: "It's just 3 lines, tests aren't needed"
- RIGHT: *Runs `just test && just lint` ALWAYS, regardless of change size*

❌ **Assuming tests pass without verification**
- WRONG: "The change is simple, tests will pass"
- RIGHT: *Runs tests and lint, confirms actual output shows success*

❌ **Not reading the actual test output**
- WRONG: "Command completed, so tests passed"
- RIGHT: *Reads output, sees all tests passed*

❌ **Batching multiple changes before testing**
- WRONG: *Makes 5 changes, then tests once*
- RIGHT: *Make change → test + lint → make change → test + lint*

## ⚡ When to Use This Skill

**ALWAYS. Use this skill:**
- After EVERY code modification
- After ANY file edit
- After fixing ANY bug
- After adding ANY feature
- After refactoring ANYTHING

**The only acceptable time to skip this skill:**
- Never. There is no acceptable time.

## Development Workflow

### Every Change
1. Make change
2. Run `just test`
3. Run `just lint`
4. Verify all tests pass and "✅ All checks passed!" in output
5. **DONE**

### Complex Changes (Multiple Files/Features)
1. Make a logical change
2. **Stage it:** `git add <files>`
3. Run `just test`
4. Run `just lint`
5. Verify success
6. Repeat steps 1-5 for each logical chunk

This workflow ensures you catch issues early and don't accumulate breaking changes.

## Individual Commands

```bash
# Run all pytest tests
just test

# Run full lint (ruff + mypy)
just lint

# Run ruff only (auto-fix)
just ruff

# Run mypy only (type checking)
just mypy
```

## When to Use

- **ALWAYS:** Run `just test` and `just lint` after every code change
- User asks to run tests/lint
- Validating code changes
- After modifying code
- Before committing code

## Interpreting Results

**Success:**
```
Running all static checks...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Running ruff...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Running mypy...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ All checks passed!
```

**Failure:** Will show specific errors from ruff or mypy

## Troubleshooting

```bash
# Run ruff only to fix formatting issues
just ruff

# Run mypy only to check types
just mypy

# Check what files have uncommitted changes
git status

# See what you changed
git diff
```

## Quick Reference

```bash
# 🔥 ALWAYS run after every code change (IN ORDER)
just test    # Run pytest tests
just lint    # Run ruff + mypy

# Individual commands (for debugging)
just ruff    # Ruff auto-fix only
just mypy    # Mypy type checking only

# 🚨 REMEMBER:
# - Run `just test` AND `just lint` after EVERY change
# - NEVER skip because "it's a small change"
# - ALWAYS show the actual output
```

---

## 🔐 Before Responding About Test Results

**You ran tests and lint. Now before you respond to the user:**

1. ✅ Did you run BOTH `just test` AND `just lint`?
2. ✅ Did you use correct claim language? (check table above)
3. ✅ Did you show actual output from both commands?
4. ✅ Does pytest show all tests passed?
5. ✅ Does lint show "✅ All checks passed!"?

**If you can't answer YES to all five, you're lying about tests passing.**