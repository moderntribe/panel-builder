## Style Family Select

Functionally the same as a Select Field; the UI renders this with some slight differences. Used in combination with the Site Builder
application to power Style Family functionality.

### Parameters

||||
|---|---|---|
| `label`       | `string` | The __() translated label for this field       |
| `name`        | `string` | The unique name for this field                 |
| `description` | `string` | The __() translated description for this field |
| `activation_triggers` | `array` | An array of values functioning as a map to the field which should trigger this select |
| `family_id` | `string` | The name of the Style Family field from which to draw the values for this select |

### Example

```php
$field = new Style_Family_Select( [
    'label' => __('Style Families'),
    'name' => 'style-families',
    'description' => __( 'Pick the thing that you pick' )
    'activation_triggers' => [ 'path', 'to', 'foobarField' ],
    'family_id' => 'foobarField',
] );
```