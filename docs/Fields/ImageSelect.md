## Image Select

Use just like a Radio, but option values should be image URLs.

Also supports an image with a text label. The option value should be an array with 'src' and 'label' keys.

### Parameters

||||
|---|---|---|
| `label`       | `string` | The __() translated label for this field       |
| `name`        | `string` | The unique name for this field                 |
| `description` | `string` | The __() translated description for this field |
| `options` | `array` | An array of key/value pairs, where the `key` is the name for the field and the `value` is an array with `src` and `label` values |

### Example

```php
$field = new ImageGallery( [
    'label'       => __('Layout'),
    'name'        => 'layout',
    'description' => __( 'Images to display in the gallery' ),
    'options'     => [
        'left'        => [
            'src'         => 'http://example.com/path/to/module-layout-left.png',
            'label'       => __( 'Left' ),
        ],
        'right'       => [
            'src'         => 'http://example.com/path/to/module-layout-right.png',
            'label'       => __( 'Right' ),
        ],
    ],
    )
) );
```