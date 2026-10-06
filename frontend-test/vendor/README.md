## Frontend test kit dependency

The Playwright tests under `frontend-test/` depend on a private tarball:

`frontend-test/vendor/devex-frontend-test-kit-0.1.0.tgz`

This artifact is not committed to the public repo.

Internal users must obtain or build the `devex-frontend-test-kit` tarball separately and place it in `frontend-test/vendor/` before running `npm install` in `frontend-test/`.

Without this tarball, dependency installation for `frontend-test/` will fail.

See `frontend-test/package.json` for the expected tarball filename and path.
