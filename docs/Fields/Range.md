## Range

A range slider field. Defining a single handle value will result in a single value being returned, while multiple handles will return a range of multiple values.

### Parameters

||||
|---|---|---|
| `label`       | `string` | The __() translated label for this field       |
| `name`        | `string` | The unique name for this field                 |
| `description` | `string` | The __() translated description for this field |
| `min` | `int` | The min value for this input |
| `max` | `int` | The max value for this input |
| `step` | `int` | The step value to use to increment this field |
| `unit_display` | `string` | An option unit to show next to the input |
| `handles` | `array` | Defines where the handles should start by default. Must be within the min/max range. |
| `has_input` | `bool` | Whether to show the number input next to the slider |

### Example

```php
$field = new Range( array(
    'label' => __('Ranges'),
    'name' => 'ranges',
    'description' => __( 'Which value ranges should be allowed?' ),
    'min' => 0,
    'max' => 100,
    'step' => 10,
    'unit_display' => '',
    'handles' => [0, 10, 20, 30],
    'has_input' => false, // 
) );
```