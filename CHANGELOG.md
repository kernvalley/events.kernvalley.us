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

### Added
- Add state & restoration support to `<photo-booth>`

### Changed
- Update importmap

## [v2.1.5] - 2024-07-02

### Added
- Add page for `<photo-booth>`
- Add paste handler for GPS coords when creating events
- Add Jekyll plug-in for environment vars

### Fixed
- Fix typos in TrustedTypes

## [v2.1.4] - 2024-05-26

### Changed
- Create event tags now use `<input type="checkbox">` instead of `<select multiple>`
- Improved design of tags page layout

## [v2.1.3] - 2024-05-25

### Added
- Add event tags with links to tag directory pages
- Add PWA shortcuts to some tags
- Add PWA shortcut to `/create/`

## [v2.1.2] - 2024-05-02

### Added
- Add support for external event URLs and redirects

### Changed
- Add custom `<form>` to create events (creates file to submit via email)
- Update "Create Event" icon

## [v2.1.1] - 2024-04-25

### Changed
- More minor design updates

## [v2.1.0] - 2024-04-25

### Changed
- Switch to using core-css via unpkg instead of KRV CDN
- Update color palette
- Improve sizing, borders, & layout
- Use `system-ui` font
- Update eslint & super linter

## [v2.0.10] - 2024-04-13

### Changed
- Update importmap & scripts

## [v2.0.9] - 2024-04-07

### Changed
- Updates to implement `@aegisjsproject/parsers`

## [v2.0.8] - 2024-01-21

### Fixed
- Update TrustedTypesPolicies

## [v2.0.7] - 2024-01-21


### Added
- Add WFD Kickoff Dinner & WFD 2024

### Changed
- Update scripts/importmap/`integrity` for latest versions

### Fixed
- Fix URL/date for Whiskey Flat Days
- Fix service worker config (remove invalid sources)

## [v2.0.6] - 2023-12-5

### Added
Add `gap` rule for `.flex.cta-btns` in CSS

## [v2.0.5] - 2023-11-21

### Fixed
- Update TrustedTypes on embed page

### Changed
- Add CERF Elections event
- Misc updates

## [v2.0.4] - 2023-08-01

### Added
- Add support for `event.performer`

### Changed
- Update Cowork Party info

### Fixed
- Fix misc design issues

## [v2.0.3]

### Added
- Add Sierra Shared Spaces Launch / Kernville Cowork 5th Anniversary Event

### Changed
- Move share btns to bottom of events

### Fixed
- Fix font sizes on 4K monitors
- Fix underlined `a.btn` text

## [v2.0.2] 2023-07-04

### Changed
- Update dependencies and config

## [Unreleased]

## [v2.0.0] - 2023-05-12

### Added
- Implement import maps

### Changed
- Events now have URLs `/:year/:month/:day/:title` - no redirects :(
- Renamed nearly every event file

## [v1.6.1] - 2023-04-15

### Added
- Implement TrustedTypes
- Add zoom controls & fullscreen to embedded maps

### Changed
- Switch from `<ad-block>` to `<krv-ad>`
- Use polyfill script from CDN instead of bundling

## [v1.6.0] - 2023-01-09

### Changed
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
