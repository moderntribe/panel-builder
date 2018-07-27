## Checkbox

A group of checkboxes.

### Parameters

||||
|---|---|---|
| `label`       | `string` | The __() translated label for this field       |
| `name`        | `string` | The unique name for this field                 |
| `description` | `string` | The __() translated description for this field |
| `options` | `array` | An array of options to display to the user |
| `default` | `array` | An array of options you want to be selected by default |
| `option_width` | `int` | Defines how many "columns" this field will take up in relation to its parent. Can be 1-12. |

### Example

```php
$field = new Checkbox( array(
  'label' => __('Pick Options'),
  'name' => 'my-field',
  'description' => __( 'Pick the things that you pick' )
  'options' => [
    'first' => __( 'The First Option' ),
    'second' => __( 'The Second Option' ),
  ],
  'default' => [ 'second' => 1 ],
  'option_width' => 6,
) );
```
