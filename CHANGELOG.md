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

### Changed
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
