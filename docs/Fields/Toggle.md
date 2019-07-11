## Toggle

A simple true/false field which can optionally be rendered with a prettier UI.

### Parameters

||||
|---|---|---|
| `label`       | `string` | The __() translated label for this field       |
| `name`        | `string` | The unique name for this field                 |
| `description` | `string` | The __() translated description for this field |
| `default` | `int` | The default state, either `0` (off) or `1` (on) |
| `stylized` | `bool` | Whether to show a stylized toggle ui instead of a simple checkbox. |

### Example

```php
$field = new Checkbox( [
    'label' => __('Enable Widget'),
    'name' => 'enable-widget',
    'description' => __( 'Enable the Widget?' ),
    'stylized' => true
    'default' => 1,
] );
```