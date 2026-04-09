# Post-Merge Task Auto-Update Workflow

## Overview

This GitHub Actions workflow automatically marks DevOps HQ tasks as `completed` when PRs are merged to the `main` branch.

## How It Works

1. **Trigger:** Runs on successful push to `main` (after all CI checks pass)
2. **Task Extraction:** Searches commit message for task IDs
3. **API Call:** Calls DevOps HQ API to update task status to `completed`
4. **Logging:** Reports results for each task

## Setup

### 1. Add GitHub Secret

Add the DevOps HQ API key to your repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `DEVOPS_HQ_API_KEY`
4. Value: Your DevOps HQ Bearer token (request from Travis)

### 2. Include Task ID in PR

Include the task ID in your commit message or PR body using one of these patterns:

```
TASK-<uuid>  # Full task UUID (preferred)
task-<uuid>
Task #<uuid>
```

### Examples

**Commit message:**
```
feat: add promoter route protection

TASK-1a11ddf6-a9e0-4543-8a9b-5a16e0deed7d
```

**PR body:**
```
## DevOps HQ Task
- Task ID: TASK-1a11ddf6-a9e0-4543-8a9b-5a16e0deed7d
- Description: Add security layer for promoter routes
```

## Workflow Steps

1. **Build** → Runs TypeScript checks, linting, and tests
2. **Post-Merge** (if main branch + build success)
   - Extracts task IDs from commit message
   - Calls DevOps HQ API for each task ID
   - Updates status to `completed`
   - Logs results to Actions output

## API Endpoint

**Endpoint:**
```
PUT https://myxxit-devopshq.onrender.com/api/tasks/{task-id}
```

**Headers:**
```
Authorization: Bearer <DEVOPS_HQ_API_KEY>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "completed"
}
```

## Monitoring

Check the Actions tab to see:
- ✓ Task marked as completed
- ⚠ Any API errors or missing task IDs

Failed updates will log warnings but won't block the merge.

## Manual API Call (if needed)

If automatic update fails, manually update via curl:

```bash
curl -X PUT https://myxxit-devopshq.onrender.com/api/tasks/{task-id} \
  -H "Authorization: Bearer $DEVOPS_HQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

## Troubleshooting

### Task not marked as completed
- Check commit message for task ID
- Verify task ID format: `TASK-{uuid}`
- Check GitHub Actions output for API errors
- Verify `DEVOPS_HQ_API_KEY` secret is set

### Invalid response from API
- Confirm task ID exists in DevOps HQ
- Check API key is current and has permission
- Verify API endpoint is reachable

## Future Improvements

- [ ] Support multiple task IDs per PR
- [ ] Auto-extract task ID from PR title
- [ ] Link PR to task in DevOps HQ dashboard
- [ ] Add task event record with merge details
