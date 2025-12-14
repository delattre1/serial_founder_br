# Git Push

Safely push changes to a remote Git repository with support for force pushing using --force-with-lease to prevent overwriting other people's changes.

## Variables

PUSH_ARGS: $VARIABLES

## Instructions

1. Parse the push arguments from PUSH_ARGS to extract:
   - Source branch name (optional, if not provided use current branch)
   - Destination branch name (optional, defaults to same as source)
   - Force push flag (optional keywords: "force", "--force", "-f")

2. If no source branch is provided, get the current branch:
   - Run `git rev-parse --abbrev-ref HEAD` to get current branch name
   - Use this as the source branch

3. Validate the current Git state:
   - Check if we're in a Git repository
   - Verify the source branch exists locally

4. Determine the push command to use:
   - If force push is requested: Use `git push --force-with-lease`
   - If force push is NOT requested: Use `git push`
   - NEVER use `git push --force` or `git push -f` (always use --force-with-lease for safety)

5. Build the complete push command:
   - If destination branch specified: `git push origin <source>:<destination>`
   - If destination not specified: `git push origin <source>`
   - Append --force-with-lease if force push requested

6. Execute the push command and capture the result

7. Report the outcome according to the Report section format

## Run

Based on the parsed arguments, run ONE of these commands:

**Normal push (same branch):**
```bash
git push origin <source-branch>
```

**Normal push (different branch):**
```bash
git push origin <source-branch>:<destination-branch>
```

**Force push with lease (same branch):**
```bash
git push --force-with-lease origin <source-branch>
```

**Force push with lease (different branch):**
```bash
git push --force-with-lease origin <source-branch>:<destination-branch>
```

## Validation Commands

Before pushing, run:
```bash
git remote -v
```

## Report

Report the push result in this format:

**Success:**
- Status: ✓ Success
- Source branch: [branch-name]
- Destination: origin/[branch-name]
- Force push: [Yes (with lease) / No]

**Failure:**
- Status: ✗ Failed
- Reason: [concise explanation of why it failed]
- Source branch: [branch-name]
- Suggestion: [what the user should do next]

## Notes

- The --force-with-lease flag is ALWAYS used instead of --force/-f when force pushing
- --force-with-lease only pushes if the remote branch hasn't been updated by someone else
- If no destination branch is specified, pushes to the same branch name on remote
- Common failure reasons:
  - Remote branch has been updated (force-with-lease protection triggered)
  - Branch doesn't exist locally
  - No remote named 'origin'
  - Authentication failure
  - Network issues

## Examples

**Example 1: Push current branch**
```
/push
```
If you're on `daniel/feat-123`, pushes to `origin/daniel/feat-123`

**Example 2: Push specific branch**
```
/push feature-branch
```
Pushes local feature-branch to origin/feature-branch

**Example 3: Push to different destination**
```
/push feature-branch main
```
Pushes local feature-branch to origin/main

**Example 4: Force push current branch**
```
/push force
```
Force pushes current branch using --force-with-lease

**Example 5: Force push specific branch**
```
/push feature-branch force
```
Force pushes local feature-branch to origin/feature-branch using --force-with-lease

**Example 6: Force push to different branch**
```
/push my-feature main --force
```
Force pushes local my-feature to origin/main using --force-with-lease
