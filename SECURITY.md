# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest  | :white_check_mark: Active |
| < Latest | :x: No |

Always use the latest version to receive security patches and improvements.

---

## Reporting a Vulnerability

The CyberShield SOC team takes security seriously. We appreciate your efforts to responsibly disclose any security concerns.

**Please do NOT report security vulnerabilities through public GitHub issues.**

### Step-by-Step Reporting Process

1. **Identify the vulnerability** — Document the issue with clear reproduction steps.
2. **Email the security team** at **raphasha27@github.com** with the following:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact assessment
   - Suggested fix (if any)
3. **Wait for acknowledgment** — You will receive a response within **48 hours**.
4. **Collaborate on the fix** — We may reach out for additional details.
5. **Disclosure** — We will coordinate a public disclosure timeline with you.

### What to Include

- Type of vulnerability (e.g., XSS, SQL injection, RCE, information disclosure)
- Affected component and version
- Attack vector and prerequisites
- Proof of concept (if available)
- Your suggested remediation

---

## Security Response Timeline

| Phase | Timeframe |
|-------|-----------|
| Initial acknowledgment | 48 hours |
| Severity assessment | 5 business days |
| Patch development | 10–15 business days |
| Coordinated disclosure | 30 days after fix |

Critical vulnerabilities may receive expedited timelines. We will keep you informed throughout the process.

---

## Security Design

This project implements the following security measures:

- **No hardcoded secrets** — All configuration via environment variables
- **Docker secrets** — Sensitive values injected at runtime
- **Input validation** — All API inputs are sanitized
- **WebSocket authentication** — Connection-level access control
- **Network isolation** — Services communicate over internal Docker network
- **Logging** — All security events are logged for audit

---

## Security Best Practices for Users

When deploying or developing with CyberShield SOC:

### Configuration
- Always use **environment variables** for API keys and tokens
- Never commit `.env` files or secrets to version control
- Use Docker secrets for production deployments
- Rotate credentials regularly

### Network
- Deploy behind a reverse proxy (e.g., Nginx, Traefik)
- Enable TLS/HTTPS for all external connections
- Restrict WebSocket connections to trusted origins
- Use firewall rules to limit service exposure

### Dependencies
- Run `go mod verify` to verify dependency checksums
- Run `cargo audit` for Rust dependency vulnerabilities
- Enable Dependabot alerts for automatic vulnerability notifications
- Review dependency updates before merging

### Monitoring
- Monitor logs for unusual connection patterns
- Set up alerts for repeated failed WebSocket handshakes
- Review threat simulation outputs for anomalies

---

## Dependency Management

### Go Dependencies

```bash
# Verify module checksums
go mod verify

# Update dependencies
go get -u ./...
go mod tidy

# Check for known vulnerabilities
go install golang.org/x/vuln/cmd/govulncheck@latest
govulncheck ./...
```

### Rust Dependencies

```bash
# Check for vulnerabilities
cargo audit

# Update lockfile
cargo update
```

### Automated Scanning

- **Dependabot** is enabled for automatic dependency update PRs.
- **CI pipeline** runs vulnerability checks on every PR.
- Review and merge Dependabot PRs promptly.

---

## Responsible Disclosure

We follow [ coordinated disclosure](https://en.wikipedia.org/wiki/Coordinated_vulnerability_disclosure) principles:

- Report vulnerabilities privately before public disclosure.
- We will credit reporters in release notes (unless anonymity is preferred).
- We ask that you do not exploit the vulnerability beyond what is necessary to demonstrate it.
- We will not pursue legal action against researchers who follow this policy.

---

## Contact

- **Security Email**: raphasha27@github.com
- **General Issues**: [GitHub Issues](../../issues)

Thank you for helping keep CyberShield SOC and its users safe.
