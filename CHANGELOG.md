---
title: CHANGELOG
robots: noindex
layout: page
permalink: /changelog/
description: List of recent changes
---
<!-- markdownlint-disable -->
# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [v1.6.0] - 2023-01-09

## Changed
- Updated to node 18.13.0

## [v1.5.1] - 2021-05-08

### Added
- KRV Guide app ad

### Changed
- Use `<iframe src="https://maps.kernvalley.us">` instead of `<leaflet-map>` for event maps
- Remove use of `esQuery` and use DOM module instead

### Fixed
- Update HTTP headers to use `Referrer-Policy: no-referrer`
- Correct mobile layout, main sizing
- Update various component paths to work with common submodule components
- Remove unused modules (no more `<leaflet-map>`)

### Removed
- Take out code for deprecated Notification triggers (experiment expired)

## [v1.5.0]

### Added
- Sub-directories by year for events
- `jekyll-common` submodule as `_includes/common/`
- JSON array of upcoming events at `/events.json`

### Changed
- Update `_layouts/*` and `_includes/*` to use `_includes/common/`
- Use service worker from CDN
- Generally, update for consistency with other projects

## [v1.4.1] - 2020-12-13

### Added
- Add ability to disable ads
- Handle theme cookie via `cookieStore`
- Add `<button is="app-list">`

### Changed
- Move PWA install button

### Changed
- Disable Reel Cinema ad due to closure

### [v1.4.0] - 2020-10-22

### Added
- Implemented basics of ads
- Create rescheduled Great Kern River Cleanup event
- Scheduled Notifications via [Notification Trigger API](https://github.com/rknoll/notification-triggers)
- Allow user to select time for these notifications

### Changed
- Update to typical site designs instead of having custom backgrounds and layout
- Update various components/`_include/`s from template repo

### Changed
- Use `_header` to set HTTP headers
- Update setting CSP to not be so permissive on `connect-source` except in service worker
- Update Leaflet to [1.7.1](https://leafletjs.com/2020/09/04/leaflet-1.7.1.html)

## [v1.3.8] - 2020-09-06

### Added
- Enable Super Linter
- Track external link clicks with GA

### Changed
- Make properties for preloading, etc. consistent
- Update components/`_includes/`
- Use `"no-referrer"` as default referrer policy

### Fixed
- Fix linting issues and update linter rules
- Disable bash script linting for issue with `.rvmrc`

## [v1.3.7] - 2020-08-17

### Changed
- Dynamically load Google Analytics and polyfill scripts

## [v1.3.6] - 2020-07-18

### Added
- 404 page

### Changed
- Specify indent style and width in [`.editorconfig`](https://editorconfig.org/)
- Enable linting on all JS in project
- Update various config files
- Update icons to be compatible with maskable icons
- Disable `'unsafe-inline'` for styles in CSP

## [v1.3.5] - 2020-07-15

### Added
- Git submodules watched by dependabot

### Changed
- Update component handling for external stylesheets
- GitHub Actions now checked weekly for updates
- Match CHANGELOG version to project version

### Fixed
- Correctly set repo info for footer

## [v1.0.3] - 2020-07-02

### Added
- `<github-user>` in footer [#134](https://github.com/kernvalley/events.kernvalley.us/issues/134)

## [v1.0.2] - 2020-06-27

### Fixed
- Removed unused submodule in config

## [1.0.1] - 2020-06-25

### Added
- Dependabot config
- CHANGELOG

### Changed
- Update README with badges & website link

### Removed
- Traivs-CI config file (Just use GitHub Actions & Netlify)

## [1.0.0] - 2020-06-16
Initial Version Release
<!-- markdownlint-restore -->
