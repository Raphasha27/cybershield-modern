# Contributing to CyberShield SOC

Welcome and thank you for your interest in contributing to **CyberShield SOC**! Every contribution helps make real-time security operations better for everyone.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Development Setup](#development-setup)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Architecture Reference](#architecture-reference)
- [Release Process](#release-process)

---

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating, you are expected to uphold this code. Please report unacceptable behavior to **raphasha27@github.com**.

---

## Development Setup

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Go | 1.22+ | Backend server and threat simulator |
| Rust | 2021+ | Z-Score anomaly detection CLI |
| Docker | 24.x+ | Containerized development |
| Docker Compose | v2.x+ | Multi-service orchestration |
| golangci-lint | Latest | Go linting |

### Step-by-Step Setup

1. **Fork and clone** the repository:
   ```bash
   git clone https://github.com/<your-username>/cybershield_soc.git
   cd cybershield_soc
   ```

2. **Start the development environment**:
   ```bash
   docker-compose up --build
   ```

3. **Verify services are running**:
   - Backend API: `http://localhost:8080`
   - WebSocket endpoint: `ws://localhost:8080/ws`

4. **Run linters locally** (optional, for pre-commit checks):
   ```bash
   # Go
   golangci-lint run ./...

   # Rust
   cd cmd/zscore-analyzer && cargo clippy
   ```

5. **Run tests locally**:
   ```bash
   # Go tests
   go test ./... -v

   # Rust tests
   cd cmd/zscore-analyzer && cargo test
   ```

---

## Code Style Guidelines

### Go

- Follow the standard [Go Code Review Comments](https://github.com/golang/go/wiki/CodeReviewComments).
- Run `golangci-lint` before committing — CI will reject PRs that fail linting.
- Use short variable declarations (`:=`) for local variables.
- Name interfaces based on method names (e.g., `Reader`, not `IReader`).
- Handle errors explicitly — never use `_` to discard errors.

### Rust

- Follow the official [Rust Style Guide](https://doc.rust-lang.org/style-guide/).
- Use `cargo clippy` to catch common mistakes.
- Prefer `Result<T, E>` over panics for error handling.
- Write doc comments (`///`) for all public items.

### General

- Write meaningful variable and function names.
- Add comments only for non-obvious logic.
- Keep functions focused and small (under 40 lines preferred).
- No hardcoded secrets — use environment variables or Docker secrets.

---

## Testing Requirements

| Component | Framework | Coverage Target |
|-----------|-----------|-----------------|
| Go backend | `go test` | 90%+ |
| Rust CLI | `cargo test` | 85%+ |
| Integration | Docker Compose smoke tests | N/A |

- Every new feature **must** include tests.
- Bug fixes **must** include a regression test.
- Run the full test suite before pushing:
  ```bash
  go test ./... -v -race
  cd cmd/zscore-analyzer && cargo test
  ```
- Tests must pass with `-race` enabled (Go) and zero warnings (Rust).

---

## Pull Request Process

1. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the code style guidelines above.

3. **Write or update tests** to cover your changes.

4. **Commit with a conventional message**:
   ```
   feat: add DDoS detection to threat simulator
   fix: correct WebSocket reconnection logic
   docs: update architecture diagram for Z-Score analyzer
   test: add unit tests for anomaly detection module
   chore: update Go dependencies
   ```

5. **Push and open a PR** against `main`.

6. **PR checklist** (all must pass before merge):
   - [ ] CI pipeline passes (Go build, Rust build, Docker build, tests)
   - [ ] Code reviewed by at least one maintainer
   - [ ] No merge conflicts with `main`
   - [ ] Documentation updated (if applicable)
   - [ ] Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/)

---

## Issue Guidelines

### Bug Reports

- Check [existing issues](../../issues) first to avoid duplicates.
- Include a clear, descriptive title.
- Provide steps to reproduce, expected vs. actual behavior.
- Include environment details: OS, Go version, Rust version, Docker version.
- Attach logs or screenshots if relevant.

### Feature Requests

- Describe the feature and its motivation.
- Explain the use case for SOC analysts or security operations.
- Propose an implementation approach if possible.

### Labels

| Label | Description |
|-------|-------------|
| `bug` | Something is broken |
| `enhancement` | New feature or improvement |
| `good-first-issue` | Ideal for first-time contributors |
| `security` | Security-related concern |
| `help-wanted` | Community help appreciated |

---

## Architecture Reference

For detailed system design, data flow diagrams, and component interactions, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

Key components to understand:
- **Go Backend** — WebSocket hub, REST API, threat simulation engine
- **Rust CLI** — Z-Score anomaly detection for statistical outlier analysis
- **Threat Simulator** — Automated attack pattern generation (PortScan, BruteForce, SQLInjection, XSS, DDoS, MalwareC2)

---

## Release Process

1. All changes merge to `main` via PR with passing CI.
2. Semantic versioning is used: `MAJOR.MINOR.PATCH`.
3. Tags are created for each release: `git tag v1.x.x`.
4. Docker images are built and published automatically via CI.
5. Release notes are generated from conventional commit messages.

---

## Questions?

Open a [discussion](../../discussions) or reach out to **raphasha27@github.com**.

Thank you for contributing to CyberShield SOC!
