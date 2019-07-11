## Swatch Select

Use just like a Radio, but option values should be colors.

Also supports a color with a text label. The option value should be an array with `color` and `label` keys.

### Parameters

||||
|---|---|---|
| `label`       | `string` | The __() translated label for this field       |
| `name`        | `string` | The unique name for this field                 |
| `description` | `string` | The __() translated description for this field |
| `option_width` | `int` | Defines how many "columns" this field will take up in relation to its parent. Can be 1-12. |
| `options` | `array` | An array of key => value pairs, where the `key` is the option name and the `value` is an array with `color` and `label` keys. |


### Example

```php
$field = new Swatch_Select( [
    'label'       => __( 'Background Color' ),
    'name'        => 'background',
    'description' => __( 'The panel background color' ),
    'options'     => [
        'blue'        => [
            'color'       => '#0000BB',
            'label'       => __( 'Blue' ),
        ],
        'green-blue'       => [
            'color'         => 'linear-gradient(113.59deg, rgba(186, 191, 16, 1) 0%, rgba(169, 189, 36, 1) 12.24%, rgba(126, 185, 88, 1) 37.36%, rgba(57, 179, 171, 1) 72.79%, rgba(0, 174, 239, 1) 100%)',
            'label'       => __( 'Green to Blue Gradient' ),
        ],
    ],
    'option_width' => 6,
] );
```