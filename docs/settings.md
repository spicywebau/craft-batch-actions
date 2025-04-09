# Settings

Batch Actions has two settings for managing the use of batch action bars.

# `barsAllowedFields`

- Type: `Array<string>|null`
- Default: `null`

This setting allows for specifying handles of Matrix or Neo fields that should be given a batch actions bar. If this is set, the `barsDisallowedFields` setting will be ignored, as it is then implied that any field not in `barsAllowedFields` is disallowed from having a batch actions bar.

## Example

Adding the following to your Craft project's `config/batch-actions.php` file will add a batch actions bar to a Matrix or Neo field with the handle `pageContent`, while preventing batch actions bars from being added to any other Matrix or Neo field:

```php
<?php

return [
    'barsAllowedFields' => [
        'pageContent',
    ]
];
```

# `barsDisallowedFields`

- Type: `Array<string>`
- Default: `[]`

This setting allows for specifying handles of Matrix or Neo fields that should not be given a batch actions bar, if `barsAllowedFields` is not set.

## Example

Adding the following to your Craft project's `config/batch-actions.php` file will prevent a Matrix or Neo field with the handle `pageContent` from being given a batch actions bar:

```php
<?php

return [
    'barsDisallowedFields' => [
        'pageContent',
    ]
];
```
