# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please send an email to raphasha27@github.com. All security vulnerabilities will be promptly addressed.

**Please do not report security vulnerabilities through public GitHub issues.**

## Disclosure Policy

When the security team receives a security bug report, they will assign it to a primary handler. This person will coordinate the fix and release process, involving the following steps:

1. Confirm the problem and determine the affected versions.
2. Audit code to find any potential similar problems.
3. Prepare fixes for all releases still under maintenance.
4. Release patches as soon as possible.

## Security Recommendations

- Always use environment variables for sensitive configuration
- Never commit secrets, API keys, or credentials to the repository
- Use dependency scanning tools to identify vulnerable packages
- Enable Dependabot alerts for automatic vulnerability notifications
