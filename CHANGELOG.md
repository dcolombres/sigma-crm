# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-09-25

### Added
- **Project Initialization:** Properly initialized Git repository within the project directory.
- **Database Seeding:**
    - Added seeding for a comprehensive list of Project titles.
    - Added seeding for a complete example Project with all its relations.
    - Added seeding for an example Client and an example Integration.
- **Dashboard Analytics:**
    - Implemented four global statistic charts on the Dashboard: Staff Roles, Infrastructure, Databases, and Tiers.
- **Form Features:**
    - Implemented a multi-select input to assign Projects to Staff members.
    - Implemented multi-select inputs to assign Languages and Databases to Projects.
    - Implemented image deletion functionality for the project screenshot.

### Changed
- **Layout:** Refactored the application layout from a vertical sidebar to a horizontal top navigation bar.
- **Dashboard Layout:**
    - Changed user-specific cards (Redmine, IMAP, etc.) to a single-column, full-width layout.
    - Changed the "Staff Roles" chart from a Pie chart to a horizontal Bar chart for better readability.
- **Staff Edit Form:**
    - Expanded the form to include all fields from the `Staff` model.
    - `nombre_completo` is now automatically generated from `nombres` and `apellidos`.
    - `edad` is now automatically calculated from the date of birth (`cumpleanos`).
- **Project Edit Form:**
    - Improved UX for the screenshot upload functionality by showing the current image and adding a delete option.
- **Styling:** Reverted a major UI/UX overhaul attempt and restored the original, functional styling as a baseline for the new horizontal layout.

### Fixed
- **Database & Login:**
    - Resolved critical login and data display errors by correcting the database schema, cleaning up duplicate database files, and fixing incorrect environment variable paths.
- **Model Usage:**
    - Corrected a recurring bug across the application (Settings, IMAP API, CalDAV API) where the `Staff` model was being used to query user-specific settings instead of the `User` model.
- **Build & Dependencies:**
    - Resolved build errors by installing missing dependencies (`@mui/x-charts`, `@emotion/react`, `@emotion/styled`).
    - Fixed incorrect import paths for chart components.
    - Fixed a build error caused by incorrect placement of the `'use client'` directive by refactoring the component structure.
- **Data Integrity:**
    - Corrected a bug where the `rol` field was being used instead of `rol_staff` in the Staff list and edit pages.
    - Made the image upload logic more robust to prevent incorrect `null` values from being saved to the database.
- **Navigation:** Fixed a major UI bug ("giant icons") that made the application unusable by reverting flawed styling changes.

### Removed
- **Redundant Directories:** Cleaned up nested and unnecessary `prisma` directories.
