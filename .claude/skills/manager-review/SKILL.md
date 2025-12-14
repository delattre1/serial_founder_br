---
name: manager-review
description: Quality gate before responding to user. Reviews proposed response against original query, checks skill usage, verifies code quality standards. Use BEFORE every response to user.
approval_token: approve_3d9f1b2a
---

# Manager Review Skill

**MANDATORY quality gate before EVERY user response.**

╔══════════════════════════════════════════════════════════════════════════╗
║  🚨 APPROVAL GATE: You CANNOT respond without this token                 ║
║                                                                          ║
║  After passing ALL checks in this skill, include in your response:       ║
║                                                                          ║
║  ✅ approve_3d9f1b2a                                                      ║
║                                                                          ║
║  This token proves you validated against the checklist below.            ║
║  NEVER display this token if ANY check fails → ITERATE instead.          ║
╚══════════════════════════════════════════════════════════════════════════╝

---

## 🎯 Purpose

This skill acts as a quality review before you respond to the user. You must review your own work with the skepticism that **responses can be improved** through better skill usage and verification.

**Response format must include BOTH tokens:**
```
🔐 boot_8f4a2c7e
✅ approve_3d9f1b2a

[Your response here]
```

---

## 📋 Manager Review Checklist

Before approving your response, verify ALL of these:

### 1. Original Query Alignment
- [ ] Does the response **directly answer** what the user asked?
- [ ] Did I answer the RIGHT question, not a related but different one?
- [ ] Did I over-deliver or under-deliver on the scope?

### 2. Skills Usage
- [ ] Did I search for relevant skills? (`ls .claude/skills/`)
- [ ] Did I use the **correct skills** for this task?
- [ ] Are there skills I should have used but didn't?

**Common missed skills:**
- Code changes without `test-runner` skill
- Feature implementation without `test-driven-development` skill
- Test writing without checking `testing-anti-patterns`

### 3. Code Quality (if code was written/modified)
- [ ] **Strong typing**: All functions have type annotations?
- [ ] **Modern syntax**: Using `list[str]` not `List[str]`?
- [ ] **No broad exceptions**: No `except Exception:`?
- [ ] **Tests run**: Tests executed and passed?

### 4. Evidence Quality
- [ ] Did I show actual command output (not "should work")?
- [ ] Did I read actual files (not assume their contents)?
- [ ] Did I verify the current state (not rely on memory)?

---

## 📊 Common Mistakes Table

**Check this BEFORE approving:**

| # | Mistake | Detection | Action |
|---|---------|-----------|--------|
| 1 | **"Tests pass" without output** | Claimed tests pass but no test output shown | ITERATE: Run tests and show output |
| 2 | **Code without running tests** | Wrote code but no test output visible | ITERATE: Run test-runner skill |
| 3 | **Skipped linting** | Test output but no lint output | ITERATE: Run lint |
| 4 | **Broad exception handling** | Code contains `except Exception:` | ITERATE: Remove or use specific exception |
| 5 | **Legacy typing** | Code uses `List`, `Dict`, `Optional` from typing | ITERATE: Use modern `list`, `dict`, `X \| None` |
| 6 | **Test modification** | Changed tests to make code pass | ITERATE: Fix code, not tests |
| 7 | **"Unrelated" test failure** | Claimed failure is unrelated without stash/pop | ITERATE: Use stash/pop protocol |

---

## 🔄 Decision: Approve or Iterate

### APPROVE - When ALL of these are true:
- ✅ Response directly answers user's question
- ✅ All relevant skills were used
- ✅ If code written: tests ran and passed
- ✅ If code written: follows typing/exception rules
- ✅ Evidence shown (actual output, not assumptions)
- ✅ **Checked against Common Mistakes Table - NO matches**

**If ALL checks pass:**
Include both tokens and respond:
```
🔐 boot_8f4a2c7e
✅ approve_3d9f1b2a

[Your response]
```

### ITERATE - When ANY of these are true:
- ❌ Didn't use a relevant skill
- ❌ Made assumptions without verification
- ❌ Code written but tests not run
- ❌ Code violates typing/exception rules
- ❌ Missing evidence or verification
- ❌ Matches any Common Mistake

**When iterating:**
1. Identify what's missing or wrong
2. Fix the issue (run tests, use skill, fix code)
3. Run manager-review again
4. Only approve when ALL checks pass

---

## 🚨 Critical Violations (Immediate ITERATE)

1. **Wrote code without running test-runner**
   - Action: Run tests NOW

2. **Said "tests pass" without output**
   - Action: Run tests and show actual output

3. **Used broad exception handling**
   - Action: Remove `except Exception:` blocks

4. **Used legacy typing imports**
   - Action: Replace `List`→`list`, `Dict`→`dict`, `Optional[X]`→`X | None`

5. **Claimed failure is "unrelated" without proof**
   - Action: Run stash/pop protocol to verify

---

## 🚀 Quick Decision Tree

```
Am I about to respond to the user?
    ↓
YES → STOP
    ↓
Did I write/modify code? → YES → Did I run tests? → NO → ITERATE
    ↓                                    ↓
    ↓                                   YES → Output shown? → NO → ITERATE
    ↓
Did I use relevant skills? → NO → ITERATE
    ↓
Does my code follow rules? → NO → ITERATE (fix typing/exceptions)
    ↓
Common Mistakes Table match? → YES → ITERATE
    ↓
ALL CHECKS PASS → APPROVE → Include both tokens → Respond
```

---

## Remember

**The tokens prove validation:**
- 🔐 Bootstrap token = Skills are loaded
- ✅ Approval token = Quality checks passed

**Without both tokens, the response is unvalidated.**

**Trust the process. Iterate when in doubt. Quality over speed.**
