## Textarea

A textarea. Set the argument `richtext` to `true` to use a WordPress visual editor.

### Parameters

||||
|---|---|---|
| `label`       | `string` | The __() translated label for this field       |
| `name`        | `string` | The unique name for this field                 |
| `description` | `string` | The __() translated description for this field |
| `richtext` | `bool` | If `true`, is rendered as a WYSIWYG field. |
| `editor_type` | `string` | The type of WYSIWYG field to render, either `tinymce` or `draftjs` |
| `editor_options` | `array` | An array of `draftjs` options to send to the editor (only for `draftjs` editor_type)  |


### Example

```php
$field = new TextArea( [
    'label' => __('Description'),
    'name' => 'description',
    'description' => __( 'How would you describe it?' ),
    'richtext' => TRUE,
    'editor_type' => 'draftjs',
    'editor_options' => [ 'colors' => [ '#fff', '#ccc' ] ],
] );
```