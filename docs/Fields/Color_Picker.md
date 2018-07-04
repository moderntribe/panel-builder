## Color Picker

A color picker field utilizing an advanced UI for selection of colors, either from a color wheel or a predetermined pallette.

### Parameters

||||
|---|---|---|
| `label`       | `string` | The __() translated label for this field       |
| `name`        | `string` | The unique name for this field                 |
| `description` | `string` | The __() translated description for this field |
| `swatches` | `array` | An array of hex values to provide as pallette options for the user. |
| `picker_type` | `string` | The picker type. Options are AlphaPicker, BlockPicker, ChromePicker, CirclePicker, CompactPicker, GithubPicker, HuePicker, MaterialPicker, PhotoshopPicker, SketchPicker, SliderPicker, SwatchesPicker, TwitterPicker. More info at https://casesandberg.github.io/react-color/ |
| `color_mode` | `string` | Either 'hex' or 'rgb'. Rgba has alpha channel and must be used if you wish to use the alpha capable pickers. |
| `input_active` | `boolean` | if true, displays a text input to define a custom swatch in the field. Only applies to some picker types, please check https://casesandberg.github.io/react-color/ for details |

### Example

```php
$field = new Color_Picker( array(
    'label'        => __( 'Background Color' ),
    'name'         => 'background-color',
    'description'  => __( 'The color to use as the background.' ),
    'swatches'     => [ '#000000', '#fcfcfc' ],
    'picker_type'  => 'BlockPicker',
    'color_mode'   => 'hex',
    'input_active' => false,
) );
```