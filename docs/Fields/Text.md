## Text

A basic text field.

### Parameters

||||
|---|---|---|
| `label`       | `string` | The __() translated label for this field       |
| `name`        | `string` | The unique name for this field                 |
| `description` | `string` | The __() translated description for this field |
| `input_width` | `int` | The width of this input if part of a group. Can be 1-12 |
| `layout` | `string` | The layout for the field, either `compact`, `full`, or `inline` |

### Example 

```php
$field = new Text( [
    'label' => __('Name'),
    'name' => 'name',
    'description' => __( 'What are you called?' )
] );
```