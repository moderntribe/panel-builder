## Radio

A group of radio inputs.

### Parameters

||||
|---|---|---|
| `label`       | `string` | The __() translated label for this field       |
| `name`        | `string` | The unique name for this field                 |
| `description` | `string` | The __() translated description for this field |
| `options` | `array` | An array of key => value pairs in which the `key` is the option name and the `value` is the option Label |
| `layout` | `string` | The type of layout to use; either `vertical`, `horizontal`, or `inline` |
| `option_width` | `int` | The width for this input if it is part of a group. Between 1-12 |
### Example

```php
$field = new Radio( [
    'label' => __('Pick One'),
    'name' => 'my-field',
    'description' => __( 'Pick the thing that you pick' )
    'layout' => 'vertical',
    'option_width' => 6,
    'options' => [
        'first' => __( 'The First Option' ),
        'second' => __( 'The Second Option' ),
    ]
] );
```