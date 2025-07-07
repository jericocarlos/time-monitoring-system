/**
 * Account roles available in the system
 */
export const ACCOUNT_ROLES = [
  { id: "superadmin", name: "Super Admin" },
  { id: "admin", name: "Admin" },
  { id: "agent", name: "Agent" },
  { id: "teamleader", name: "Team Leader" }
];

/**
 * Column definitions for the account table - removed email column
 */
export const ACCOUNT_COLUMNS = [
  { id: "username", header: "Username" },
  { id: "name", header: "Full Name" },
  { id: "role", header: "Role" },
  { id: "lastLogin", header: "Last Login" },
  { id: "actions", header: "Actions" }
];

/**
 * Validation schema for account forms
 */
export const ACCOUNT_FORM_VALIDATION = {
  password: {
    required: "Password is required",
    minLength: { value: 8, message: "Password must be at least 8 characters" }
  },
  name: {
    required: "Full name is required"
  },
  role: {
    required: "Role is required"
  }
};