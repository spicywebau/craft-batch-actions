# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Fixed
- Fixed an error that occurred when using Smith

## 2.0.0 - 2024-03-24

### Added
- Added Craft 5 compatibility

### Removed
- Removed Craft 4 compatibility
- Removed Craft Commerce variant code due to variants being managed with element indexes rather than blocks
- Removed `spicyweb\batchactions\assets\BatchActionsAsset`; `spicyweb\batchactions\assets\bars\BarsAsset` is used instead

## 1.3.1 - 2023-10-30

### Added
- Added German translations (thanks @amkdev)

## 1.3.0 - 2023-03-08

### Added
- Added support for expanding, collapsing, enabling, disabling and deleting Craft Commerce variants
- Added support for showing batch actions bars on Matrix and Neo fields in Quick Post widgets

### Fixed
- Fixed a bug where batch actions bars weren't being initialised on Craft Commerce product edit pages

## 1.2.2 - 2023-02-23

### Fixed
- Fixed a bug where a Neo batch actions bar's paste button wasn't being disabled if pasting the copied blocks would violate the Neo field's Max Blocks or Max Top Level Blocks settings

## 1.2.1 - 2023-02-21

### Added
- Added French translations (thanks @scandella)

### Fixed
- Fixed a bug where, when loading an element editor page with a window size where batch actions bar buttons would exceed the content container width, the bar would sometimes still show the buttons instead of the menu

## 1.2.0 - 2023-02-18

### Added
- Added the ability to batch-copy Neo blocks, and paste them at the top of the field
- Added the ability to batch-copy Matrix blocks, and paste them at the top of the field, if Smith is installed

### Fixed
- Fixed a bug where batch action bars were being added to Neo fields when viewing entry revisions

## 1.1.0 - 2022-09-23

### Added
- Added the `barsDisallowedFields` plugin setting, for setting Matrix or Neo field handles for which the batch actions bar won't be initialised
- Added `spicyweb\batchactions\assets\bars\BarsAsset`
- Added `spicyweb\batchactions\models\Settings`

### Deprecated
- Deprecated `spicyweb\batchactions\assets\BatchActionsAsset`; replaced with `spicyweb\batchactions\assets\bars\BarsAsset`

## 1.0.1 - 2022-09-15

### Fixed
- Fixed a bug where translations weren't working
- Fixed style issues when using RTL languages

## 1.0.0 - 2022-09-12

### Added
- Initial release
