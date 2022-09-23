# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
