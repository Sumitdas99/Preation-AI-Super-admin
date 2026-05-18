/**
 * Email domain validation utilities
 * Blocks public email domains from being used for registration and invitations
 */

// Public email domain denylist (must match backend)
export const PUBLIC_EMAIL_DOMAINS = [
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.co.in",
  "yahoo.co.uk",
  "hotmail.com",
  "hotmail.co.uk",
  "outlook.com",
  "live.com",
  "live.in",
  "msn.com",
];

/**
 * Validates that an email domain is not in the public email denylist
 * @param email - Email address to validate
 * @returns Object with isValid boolean and error message
 */
export function validateEmailDomainNotPublic(email: string): {
  isValid: boolean;
  error: string;
} {
  if (!email || !email.includes("@")) {
    return {
      isValid: false,
      error: "Invalid email format",
    };
  }

  // Extract domain from email (case-insensitive)
  const domain = email.split("@")[1]?.toLowerCase().trim();

  if (!domain) {
    return {
      isValid: false,
      error: "Invalid email format",
    };
  }

  // Check if domain is in denylist
  if (PUBLIC_EMAIL_DOMAINS.includes(domain)) {
    return {
      isValid: false,
      error: `Public email domains (e.g., ${domain}) are not allowed for registration. Please use a corporate email address.`,
    };
  }

  return {
    isValid: true,
    error: "",
  };
}

