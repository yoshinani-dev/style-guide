# GitHub Actions dependencies

`.github/workflows/actions.lock` pins the actions used by this repository's
workflows, including publishing workflows and transitive action dependencies.
GitHub Actions runs the locked commits for onboarded workflows.

After adding a workflow or changing a `uses:` reference, regenerate and verify
the lockfile from the repository root:

```sh
gh extension install github/gh-actions-lock # First-time setup
gh actions-lock
gh actions-lock --verify
```

Commit the workflow changes and generated lockfile together. Do not edit the
lockfile by hand. `gh actions-lock --verify-local` is an optional offline coverage
check; `--verify` also checks the locked references against GitHub.

Run verification locally, following the [organization CI policy](https://github.com/yoshinani-dev/.github/blob/main/CI_POLICY.md).

As a public OSS exception to the organization's dependency update policy,
Dependabot updates GitHub Actions every Monday at 08:00 Asia/Tokyo and refreshes
the matching lockfile entries in the same pull request. Minor and patch updates
are grouped; major updates have separate pull requests. Run `gh actions-lock`
when adding workflows or changing action references manually.
