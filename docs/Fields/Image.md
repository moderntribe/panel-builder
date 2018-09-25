## Image

An image field.

The image is stored in the field as an attachment ID.

### Parameters

||||
|---|---|---|
| `label`       | `string` | The __() translated label for this field       |
| `name`        | `string` | The unique name for this field                 |
| `description` | `string` | The __() translated description for this field |

### Example

```php
$field = new Image( array(
    'label' => __('Featured Image'),
    'name' => 'featured-image',
    'description' => __( 'An image to feature' ),
) );
```
