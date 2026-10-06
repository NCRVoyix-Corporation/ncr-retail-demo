<h1 align="center">
<br>
<a href="https://retaildemo.ncrvoyixcloud.com" target="_blank"><img src="./public/mart-banner.png" alt="MART" height="auto" width="100%" /></a>
<br>
</h1>

<h4 align="center">A sample retail demo application built on top of <a href="https://developer.ncrvoyix.com" target="_blank">NCR's APIs.</a></h4>

<p align="center">
<a href="https://retaildemo.ncrvoyixcloud.com/"><img src="https://img.shields.io/badge/-Visit%20Demo-blue" alt="Demo" /></a>
<img src="https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen.svg" alt="Dependencies" />
<a href="https://github.com/NCR-Corporation/ncr-retail-demo/issues"><img src="https://img.shields.io/github/issues/NCR-Corporation/ncr-retail-demo" alt="Github Issues" /></a>
<img src="https://img.shields.io/badge/contributions-welcome-orange.svg" alt="Contributions Welcome" />
<a href="./LICENSE"><img src="https://img.shields.io/badge/license-Apache 2.0-brightgreen" alt="License" /></a>
</p>

<p align="center">
<a href="https://retaildemo.ncrvoyixcloud.com/" target="_blank">Demo</a> //
<a href="#features">Features</a> //
<a href="#overview">Overview</a> //
<a href="#how-to-use">How to Use</a> //
<a href="#support">Support</a> //
<a href="/CONTRIBUTING.md">Contributing</a> //
<a href="#license">License</a>

## Features

- Catalog API Integration
- User registration/authentication
- Adding to/viewing Cart
- Management of Sites
- Management of Categories & Catalog
- Singule store management
- Catalog Search

## Overview

MART integrates with multiple NCR Voyix APIs including [Order](https://developer.ncrvoyix.com/portals/dev-portal/api-explorer/details/374), [Catalog](https://developer.ncrvoyix.com/portals/dev-portal/api-explorer/details/453), [Sites](https://developer.ncrvoyix.com/portals/dev-portal/api-explorer/details/645), Security, & Provisioning. The demo application showcases one possible way to utilize one or many of the available APIs.

This repository showcases an imaginary retail company with multiple stores in different location. The company can be managed globally as well as at the individual store level.

## How to Use

🚧 **Important** 🚧

If this is the **first time** using a project with the generated keys, you will most likely **not see any data**.

Why? When using the Test Drive feature, each application is a **fresh installation with no data.** See [Seed the Database](#seeding-the-database) to populate the database with test data and get started quickly.

### Getting Started

1. First, clone the repository for local development.

   ```bash
   git clone https://github.com/NCR-Corporation/ncr-retail-demo.git
   ```

2. Secondly, open the repository in an editor and rename `.env.template` to `.env.local`.
   
3. After renaming, open `.env.local` and update the variables `REACT_APP_BSP_SECRET_KEY`, `REACT_APP_BSP_ORGANIZATION`, `REACT_APP_BSP_SHARED_KEY` with data found in the [NCR Voyix Developer Portal](https://developer.ncrvoyix.com). To learn more about receiving access, create an account on the [NCR Voyix Developer Portal](https://developer.ncrvoyix.com) and visit the [Test Drive Documentation](https://developer.ncrvoyix.com/portals/dev-portal/getting-started). Use `openssl rand -base64 32` to generate a random value to be used for the field `NEXTAUTH_SECRET`.
   - Note: in newer versions of Node.js you may need to specify the `--openssl-legacy-provider` flag when running the development server

4. Next, install all npm packages in the project directory:

   ```bash
   yarn install
   ```

5. Finally, run the development server:

   ```bash
   next dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the sample demo application _generated with your keys._

> This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
> To learn more about Next.js, visit the [Next.js Documentation](https://nextjs.org/docs).

### Seeding the Database (Experimental)

Every new application built with NCR Voyix is a blank installation with no data. If you are looking to become familiar with the APIs and see the application in action locally, you will need to either:

1. Create your own Sites, Categories, Groups, and Catalog
2. Seed the database.

To seed the database, visit the [Admin Dashboard](http://localhost:3000/admin/dashboard) by clicking "⚙ Manage" in the top of the homepage or visiting `/admin/dashboard`. From there, near the top is a blue button "⬇ Build Sample Database". You will still have to have a valid Organization, Secret, and Shared key in your `.env.local`.

Seeding the database is Experimental at this time. To learn more about how it works visit [`/pages/api/export.js`](https://github.com/NCR-Corporation/ncr-retail-demo/blob/main/pages/api/export.js). You may run into issues and this is the best place to start debugging. To view the data being generated, visit the [`/data/` folder](https://github.com/NCR-Corporation/ncr-retail-demo/tree/main/data).

**Note**: The Retail Demo currently uses NCR's Staging environment while certain APIs are not in production yet. If you are looking for more help, please reach out to the `#developer-advocate-team` in Slack.

### Frontend test setup

The Playwright tests under `frontend-test/` depend on a private internal package tarball that is not committed to this public repository.

If you are an internal user and need to run those tests, see [`frontend-test/vendor/README.md`](./frontend-test/vendor/README.md) for setup details.


## Support

Feel free to open an issue! If there are any bugs you find or any features you would like to see implemented, create the appropriate issue on the repository.

## License

This sample app project is released under the Apache 2.0 license. The license's full text can be found [here](./LICENSE).
