## Hidden

A hidden field. It will be in the HTML, but not visible to the user.

### Parameters

||||
|---|---|---|
| `name`        | `string` | The unique name for this field                 |

### Example

```php
$field = new Hidden( array(
  'name' => 'secret',
) );
```