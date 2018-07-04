## Column Width

A group of radio buttons laid out into an intuitive ui for selecting grid widths a panel/group of panels may take up.

### Parameters

||||
|---|---|---|
| `label`       | `string` | The __() translated label for this field       |
| `name`        | `string` | The unique name for this field                 |
| `description` | `string` | The __() translated description for this field |
| `columns` | `integer` | The # of columns to span (1-12) |

### Example

```php
$field = new Column_Width( array(
  'label' => __('Column Width'),
  'name' => 'my-field',
  'description' => __( 'Select width for this column' )
  'columns' => 12
) );
```