# Command Generator

Generate a new Claude Code slash command following the standardized structure and conventions. Use this meta-command to ensure consistency across all command files.

## How to Use This Command

Invoke `/meta` followed by a natural language description of the command you want to create.

**Example:**
```
/meta Create a "backup" command that backs up the database and validates the upload succeeded
```

```
/meta I need a "deploy" command for deploying to production with environment selection
```

```
/meta Command to fix failing tests by analyzing test output and re-running tests
```

## Variables

COMMAND_SPEC: $VARIABLES

## Instructions

1. **Read the user's request:**

$COMMAND_SPEC

2. **Extract the required information** from the user's request:
   - COMMAND_NAME: Name of the new command (e.g., "backup", "deploy", "test-fix")
   - COMMAND_PURPOSE: What the command does and when to use it
   - COMMAND_TYPE: Type of command (planning, execution, analysis, utility)
   - COMMAND_VARIABLES: What variables the new command needs and their sources
   - REQUIRED_SECTIONS: Which sections the command should include
   - WORKFLOW_STEPS: The steps or logic the command should execute

3. **Determine appropriate sections** based on command type and requirements
4. **Apply the standard command structure** defined below
5. **Generate the complete markdown file** with proper formatting
6. **Save the file** to `.claude/commands/[command-name].md`
7. **Report back** with the command details and example usage

## Standard Command Structure

All commands MUST follow this structure:

```markdown
# [Command Title]

[1-3 sentence description of what this command does and when to use it]

## [Sections in order of relevance]
```

## Common Sections

### Required Sections (use as needed based on command type)

#### ## Variables
**When to use:** Command requires user input when invoked

**What it does:**
- Captures user input when the command is run
- Provides semantic names to reference throughout the prompt
- Organizes information to avoid repetition

**How it works:**
```markdown
## Variables

VARIABLE_NAME: $VARIABLES
```

This assigns the user's input to `VARIABLE_NAME`, which can then be referenced in other sections using `$VARIABLE_NAME`.

**Example:**
```markdown
## Variables

COMMIT_MESSAGE: $VARIABLES

## Run

git commit -m "$COMMIT_MESSAGE"
```

#### ## Instructions
**When to use:** Command requires step-by-step guidance or complex logic
**Content:** Ordered list or detailed steps for executing the command
**Example:**
```markdown
## Instructions

1. Read the specification file from specs/
2. Analyze the git diff against main branch
3. Compare implementation with requirements
4. Report any discrepancies
```

#### ## Report
**When to use:** Command produces output that needs to be formatted/reported back
**Content:** Template or format for reporting results
**Example:**
```markdown
## Report

Report the results in this format:
- Status: [Success/Failed]
- Changes: [list of changes made]
- Next steps: [what to do next]
```

### Optional Sections (use when appropriate)

#### ## Run
**When to use:** Command executes specific bash commands or scripts
**Content:** Exact commands to execute, often with variable interpolation
**Example:**
```markdown
## Run

git checkout -b $BRANCH_NAME
git add .
git commit -m "$COMMIT_MESSAGE"
```

#### ## Relevant Files
**When to use:** Command operates on specific files or directories
**Content:** List of file paths or patterns that are relevant
**Example:**
```markdown
## Relevant Files

- src/**/*.py
- tests/**/*.py
- pyproject.toml
```

#### ## Validation Commands
**When to use:** Command should verify results or check conditions
**Content:** Commands to run for validation
**Example:**
```markdown
## Validation Commands

uv run pytest tests/
uv run ruff check .
```

#### ## Setup
**When to use:** Command requires preparation or environment setup
**Content:** Prerequisites and setup steps

#### ## Read
**When to use:** Command requires reading specific files first
**Content:** List of files to read before proceeding

#### ## Notes
**When to use:** Important warnings, tips, or edge cases
**Content:** Bullet points of important considerations

#### ## Metadata
**When to use:** Command needs to track or store metadata
**Content:** Metadata structure or requirements

#### ## Plan Format
**When to use:** Command generates a structured plan
**Content:** Template for the plan output

## Command Types & Typical Sections

### Planning Commands (feature.md, bug.md, patch.md)
Structure:
```
# [Type] Planning
Description
## Variables
## Instructions
## Relevant Files
## Plan Format
## Report
```

### Execution Commands (commit.md, pull_request.md, test.md)
Structure:
```
# [Action]
Description
## Variables
## Run
## Validation Commands
## Report
```

### Analysis Commands (review.md, classify.md)
Structure:
```
# [Analysis Type]
Description
## Variables
## Instructions
## Read
## Report
```

### Utility Commands (install.md, cleanup.md, start.md)
Structure:
```
# [Utility Action]
Description
## Variables (optional)
## Setup
## Run
## Notes
```

## Formatting Rules

1. **Title:** Always start with `# [Title]` (H1 heading)
2. **Description:** 1-3 sentences after title, no heading
3. **Sections:** Use `## [Section Name]` (H2 heading)
4. **Order:** Put most important sections first (usually Variables, Instructions, Run)
5. **Variables:** Use SCREAMING_SNAKE_CASE for variable names
6. **Code blocks:** Use triple backticks with language identifiers
7. **Consistency:** Use the same section names across similar command types

## Variables

COMMAND_NAME: Name of the new command (lowercase with underscores or hyphens)
COMMAND_PURPOSE: What the command does
COMMAND_TYPE: Type of command (planning, execution, analysis, utility)
REQUIRED_SECTIONS: Which sections this command needs
CUSTOM_SECTIONS: Any special sections unique to this command

## Report

After generating the new command file, report:
- Command name and file path
- Command type and purpose
- Sections included
- Example usage: `/[command-name]`
