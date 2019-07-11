## Image Gallery

An image gallery field.

get_panel_var() will return an array of attachment IDs


### Parameters

||||
|---|---|---|
| `label`       | `string` | The __() translated label for this field       |
| `name`        | `string` | The unique name for this field                 |
| `description` | `string` | The __() translated description for this field |

### Example

```php
$field = new ImageGallery( array(
    'label' => __('Gallery Images'),
    'name' => 'images',
    'description' => __( 'Images to display in the gallery' )
) );
```

### String Overrides

* `button.edit_gallery` - (`Edit Gallery`) - The Button Label
