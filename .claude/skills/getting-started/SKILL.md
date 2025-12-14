---
name: getting-started
description: Session bootstrap skill that is automatically injected at session start via hook. Forces Claude to prime itself with codebase context before responding to user.
bootstrap_token: boot_8f4a2c7e
---

# Session Bootstrap

**MANDATORY**: Before responding to ANY user request, you MUST have this context loaded.

╔══════════════════════════════════════════════════════════════════════════╗
║  🔐 BOOTSTRAP GATE: Every response MUST start with this token            ║
║                                                                          ║
║  🔐 boot_8f4a2c7e                                                        ║
║                                                                          ║
║  This proves you loaded and read this skill.                             ║
║  NEVER display this token without reading the skill first.               ║
╚══════════════════════════════════════════════════════════════════════════╝

---

## 🔥 Foundational Rules

1. **Skills give you capabilities** - Check `.claude/skills/` before ANY task
2. **If a skill exists, you MUST use it** - Skills are mandatory, not optional
3. **Manager review before responding** - Use manager-review skill before EVERY response

---

## 🚨 CRITICAL: Response Workflow

```
User asks question
    ↓
Search for relevant skills: ls .claude/skills/
    ↓
Do research/work (using appropriate skills)
    ↓
⚠️ STOP - DO NOT RESPOND YET ⚠️
    ↓
Run manager-review skill (.claude/skills/manager-review/SKILL.md)
    ↓
Manager reviews your work:
  - ALL CHECKS PASS → Include approval token → Respond to user
  - ANY CHECK FAILS → ITERATE (DO NOT respond yet)
```

**Every response MUST include BOTH tokens:**
```
🔐 boot_8f4a2c7e
✅ approve_3d9f****  (get full token from manager-review skill)
```

The bootstrap token (🔐) proves skills are loaded. The approval token (✅) proves manager validated.

---

## 📋 Project Rules (from CLAUDE.md)

### Code Quality Requirements

1. **Strong Typing** - Every function, variable, and return type must be typed
   - Use modern syntax: `list[str]`, `dict[str, int]`, `X | None`
   - NO legacy typing imports: `List`, `Dict`, `Optional`

2. **No Broad Exceptions** - Let errors bubble up
   - BANNED: `except Exception as e:`
   - ALLOWED: Specific exceptions only when you can handle them meaningfully

3. **Tests in `/tests`** - Standard location at project root

### After Code Changes

**MANDATORY: Run test-runner skill after EVERY code change**

---

## 🎯 Available Skills

| Skill | When to Use |
|-------|-------------|
| `test-runner` | After EVERY code change |
| `test-driven-development` | Before implementing features |
| `testing-anti-patterns` | When writing tests |
| `manager-review` | Before EVERY response |
| `sdlc` | Full feature implementation workflow |

---

## ❌ BANNED Actions

1. **Writing tests without test-writer/TDD skill**
2. **Claiming "tests pass" without showing output**
3. **Skipping lint "because it's a small change"**
4. **Modifying tests to make broken code pass**
5. **Using broad exception handling**
6. **Using legacy typing imports**

---

## Remember

> **Skills are mandatory. If a skill exists for what you're doing, you MUST use it.**
> **Manager-review is mandatory. You CANNOT respond without the approval token.**
