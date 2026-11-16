# Security Policy

## Supported Versions

| Version  | Supported          |
|----------|--------------------|
| Latest   | :white_check_mark: |
| < latest | :x:                |

## Reporting a Vulnerability

We take the security of {{PROJECT_NAME}} seriously. If you discover a security vulnerability, please
report it responsibly.

### How to Report

1. **Do NOT** open a public GitHub issue for security vulnerabilities
2. For the cli-template repository,
   use [GitHub private vulnerability reporting](https://github.com/dallay/cli-template/security/advisories/new).
   For projects created from this template, email {{AUTHOR_EMAIL}} with the subject line "Security
   Vulnerability - {{PROJECT_NAME}}".
3. Include the following information:
    - Type of vulnerability (e.g., buffer overflow, SQL injection, XSS)
    - Full paths of source file(s) related to the vulnerability
    - The location of the affected source code (tag/branch/commit or direct URL)
    - Any special configuration required to reproduce the issue
    - Step-by-step instructions to reproduce the vulnerability
    - Proof-of-concept or exploit code (if possible)
    - Potential impact of the vulnerability

### What to Expect

- **Acknowledgment**: You will receive a response within 48 hours acknowledging receipt of your
  report
- **Assessment**: We will assess the vulnerability and determine its impact within 7 days
- **Resolution**: We will work on a fix and release a patch as soon as possible
- **Disclosure**: We will coordinate with you on the public disclosure timeline

### Security Updates

Security updates will be released as patch versions and announced in the [Changelog](CHANGELOG.md)
and [Releases](https://github.com/{{REPO_OWNER}}/{{REPO_NAME}}/releases).

## Security Best Practices

When using {{PROJECT_NAME}}, please follow these security best practices:

- Always use the latest stable version
- Keep dependencies updated
- Review the [CHANGELOG](CHANGELOG.md) for security-related changes
- Report any suspicious behavior or potential vulnerabilities
