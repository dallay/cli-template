---
title: "CI/CD Setup"
description: "Configure GitHub Actions secrets for the automated release pipeline."
---

This guide explains how to set up the GitHub Actions secrets required for the automated release pipeline. Without these secrets, the release workflow will fail.

## Required Secrets

The release workflow requires the following secrets to be configured in your repository:

### 1. GitHub App Token (Required for Release)

The release workflow uses a **GitHub App** instead of `GITHUB_TOKEN` to create release pull requests. This is **required** because GitHub's built-in `GITHUB_TOKEN` cannot trigger other workflows when creating PRs — meaning CI checks would wait forever.

#### Step 1: Create a GitHub App

1. Go to your **repository** or **organization** settings:
   - Repository: `Settings → Developer settings → GitHub Apps → New GitHub App`
   - Organization: `Settings → Developer settings → GitHub Apps → New GitHub App`
2. Fill in the app details:
   - **GitHub App name**: Any name (e.g., `ci-bot` or `release-bot`)
   - **Homepage URL**: Your repository URL
   - **Callback URL**: `https://localhost` (not used, but required)
3. **Permissions**:
   - **Repository permissions**:
     - **Contents**: Read & write
     - **Pull requests**: Read & write
     - **Metadata**: Read-only
4. **Events**: No events needed (uncheck all)
5. **Permissions & events**: Save
6. **Webhook**: Disable webhook (uncheck "Active")
7. Click **Create GitHub App**
8. Immediately scroll down to **Private keys** and click **Generate a private key**
   - Download the `.pem` file — you will need its content

#### Step 2: Add the App to Your Repository

1. Go to your repository `Settings → Install apps`
2. Find your newly created app and click **Install app**
3. Select **All repositories** or **Only select repositories** and choose your repo

#### Step 3: Get the App ID

1. Go back to your GitHub App settings page
2. Copy the **App ID** (a number, e.g., `123456`)

#### Step 4: Add Secrets to Your Repository

1. Go to your repository `Settings → Secrets and variables → Actions`
2. Add two secrets:

| Secret Name | Value |
|---|---|
| `APP_ID` | The App ID number from step 3 |
| `APP_PRIVATE_KEY` | The **entire content** of the `.pem` file (including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`) |

> **Tip:** If you use the same GitHub App across multiple repositories in an organization, add the secrets at the **organization level** instead:
> `Organization settings → Settings → Actions → Secrets and variables → Actions`

### 2. crates.io Publishing (Optional)

If you want to publish to crates.io:

| Secret Name | Value |
|---|---|
| `CARGO_REGISTRY_TOKEN` | Your crates.io API token from [crates.io/me](https://crates.io/me) |

### 3. npm Publishing (Optional)

If you want to publish the npm wrapper packages:

| Secret Name | Value |
|---|---|
| `NPM_TOKEN` | Your npm access token from [npm Settings → Tokens](https://www.npmjs.com/settings/org/{{NPM_SCOPE}}/tokens) |

### 4. Docker Hub Publishing (Optional)

If you want to push Docker images to Docker Hub:

| Secret Name | Value |
|---|---|
| `DOCKERHUB_USERNAME` | Your Docker Hub username |
| `DOCKERHUB_TOKEN` | An access token from [Docker Hub → Settings → Security](https://hub.docker.com/settings/security) |

## How It Works

The release workflow uses `actions/create-github-app-token` to generate a short-lived token from the GitHub App credentials. This token is then passed to:

- **`actions/checkout`** — so the checkout step can push commits and create PRs
- **`release-please-action`** — so release-please can create the release PR and merge it

Because the token belongs to a GitHub App (not the built-in `GITHUB_TOKEN`), the PRs it creates **will trigger other workflows** (such as the CI workflow), allowing status checks to pass normally.

## Troubleshooting

### "Permissions denied" when creating the release PR

- Verify the GitHub App is installed on the repository
- Verify the App has **Contents: Read & write** and **Pull requests: Read & write** permissions
- Verify `APP_ID` and `APP_PRIVATE_KEY` secrets are correctly set

### Release PR checks are still waiting

- Ensure you are using the GitHub App token, not `GITHUB_TOKEN`
- Check that the CI workflow is not disabled: `Settings → Actions → General → Actions permissions`

### "Unable to access private key" error

- The `APP_PRIVATE_KEY` secret must contain the **full** `.pem` file content, including the `-----BEGIN...` and `-----END...` lines
- Do not add extra whitespace or newlines when pasting the secret

## Using This Template in Your Own Project

When you create a new project from this template:

1. **If you already have a GitHub App** (e.g., shared across your organization's repos), just add the same `APP_ID` and `APP_PRIVATE_KEY` secrets to the new repository.

2. **If you don't have a GitHub App**, follow the steps above to create one. For organization-wide use, create the app at the organization level and add the secrets at the organization level.

3. **Optional secrets** (`CARGO_REGISTRY_TOKEN`, `NPM_TOKEN`, Docker Hub secrets) are only needed if you want to publish to those platforms. The release workflow will skip those jobs if the secrets are missing.
