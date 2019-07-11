## Numeric Input

A basic number field.

### Parameters

||||
|---|---|---|
| `label`       | `string` | The __() translated label for this field       |
| `name`        | `string` | The unique name for this field                 |
| `description` | `string` | The __() translated description for this field |
| `min` | `int` | The minimum value for this field |
| `max` | `int` | The maximum value for this field |
| `step` | `int` | The step by which this field should increment |
| `unit_display` | `string` | The unit to display next to the field (optional) |

### Example

```php
$field = new Numeric_Input( array(
    'label' => __('Width'),
    'name' => 'width',
    'description' => __( 'How wide should this be?' ),
    'min' => 0,
    'max' => 100,
    'step' => 10,
    'unit_display' => '%',
) );
```