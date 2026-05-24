/**
 * MyApp environment configuration.
 *
 * MyApp is composed of TWO applications:
 *   - Main app     → end-user facing
 *   - Admin Portal → admin/operator facing
 *
 * Override per-environment via env vars; defaults point at the test env.
 */
export const MYAPP_URLS = {
  app:         process.env.MYAPP_APP_URL         ?? 'https://test.example.com/MyApp/',
  adminPortal: process.env.MYAPP_ADMINPORTAL_URL ?? 'https://test.example.com/AdminPortal/',
} as const;

export interface MyAppUser {
  username: string;
  password: string;
}

/**
 * Test accounts per MyApp role. Populate the env vars below
 * (e.g. in a local `.env` loaded by your shell, or in CI secrets).
 *
 * Role matrix (FEATURE-001):
 *   - systemAdmin    → Read/Write across Admin Portal
 *   - manager        → Limited access to Admin Portal
 *   - operator       → No access to Admin Portal admin features
 *   - viewer         → Read-only access
 */
export const MYAPP_USERS: Record<
  'systemAdmin' | 'manager' | 'operator' | 'viewer',
  MyAppUser
> = {
  systemAdmin: {
    username: process.env.MYAPP_ADMIN_USER ?? 'admin@example.com',
    password: process.env.MYAPP_ADMIN_PASS ?? 'admin123',
  },
  manager: {
    username: process.env.MYAPP_MANAGER_USER ?? 'manager@example.com',
    password: process.env.MYAPP_MANAGER_PASS ?? 'manager123',
  },
  operator: {
    username: process.env.MYAPP_OPERATOR_USER ?? 'operator@example.com',
    password: process.env.MYAPP_OPERATOR_PASS ?? 'operator123',
  },
  viewer: {
    username: process.env.MYAPP_VIEWER_USER ?? 'viewer@example.com',
    password: process.env.MYAPP_VIEWER_PASS ?? 'viewer123',
  },
};

export type MyAppRole = keyof typeof MYAPP_USERS;

/** Legacy default user (kept for existing smoke/regression specs). */
export const MYAPP_CREDENTIALS: MyAppUser = MYAPP_USERS.systemAdmin;