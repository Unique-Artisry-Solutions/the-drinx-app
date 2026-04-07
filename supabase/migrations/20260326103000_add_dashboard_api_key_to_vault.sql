-- Enable secure API key storage for the DevOps HQ dashboard.
-- Store the raw key in Vault, then expose it to the runtime as MYXXIT_DASHBOARD_API_KEY.

select vault.create_secret(
  'replace-with-a-long-random-dashboard-api-key',
  'MYXXIT_DASHBOARD_API_KEY',
  'DevOps HQ dashboard API key'
);
