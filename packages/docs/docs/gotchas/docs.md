---
id: gotcha-docs
slug: gotchas/docs
tags:
  - adequate
  - n8g
---

# Docs Gotchas

* Yarn is not using the correct .npmrc file
You're writing to ~/.npmrc, but Yarn on GitHub Actions may prefer .npmrc in the repo root or $NPM_CONFIG_USERCONFIG.

✅ Fix:
Make sure the .npmrc is used reliably by Yarn by setting the config explicitly:

```yaml
      - name: Authenticate with GitHub Package Registry
        run: |
          echo "@nick8green:registry=https://npm.pkg.github.com" > .npmrc
          echo "//npm.pkg.github.com/:_authToken=${{ secrets.GH_PACKAGES_TOKEN }}" >> .npmrc
        # important: make it accessible during install
        env:
          NPM_CONFIG_USERCONFIG: ${{ github.workspace }}/.npmrc
```

Then run install with the same config:

```yaml
      - name: Install dependencies
        run: yarn install
        env:
          NPM_CONFIG_USERCONFIG: ${{ github.workspace }}/.npmrc
```


✅ Make sure your token (`GH_PACKAGES_TOKEN`):

Has read:packages and repo