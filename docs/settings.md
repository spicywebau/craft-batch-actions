# Settings

Batch Actions has one setting for managing the use of batch action bars.

# `barsDisallowedFields`

This setting allows for specifying handles of Matrix or Neo fields that should not be given a batch actions bar.

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
