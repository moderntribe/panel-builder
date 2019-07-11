## Select

A select box.

### Parameters

||||
|---|---|---|
| `label`       | `string` | The __() translated label for this field       |
| `name`        | `string` | The unique name for this field                 |
| `description` | `string` | The __() translated description for this field |
| `options` | `array` | An array of key => value pairs, where the `key` is the option name and the `value` is the option label |
| `global_options` | `string` | Used _only_ if you need to load options based on a separate, localized JSON object. (Usually not needed) |
| `enable_fonts_injection` | `bool` | If `true`, allows this select to have fonts injected into it to render font previews (Must be handled in the JS) |

### Example

```php
$field = new Select( [
    'label' => __('Pick One'),
    'name' => 'my-field',
    'description' => __( 'Pick the thing that you pick', 'tribe' )
    'options' => [
        'first' => __( 'The First Option', 'tribe' ),
        'second' => __( 'The Second Option', 'tribe' ),
    ]
] );
```