## Icons

A field for selecting an icon from an icon library.

### Parameters

||||
|---|---|---|
| `label`       | `string` | The __() translated label for this field       |
| `name`        | `string` | The unique name for this field                 |
| `description` | `string` | The __() translated description for this field |
| `options` | `array` | An array containing the unique classnames for each option |
| `search` | `bool` | Whether to display a search field for searching through the available options |
| `class_string` | `string` | The class string to be added to the element; %s will be replaced with the selected option |

### Example

```php
$field = new Icons( array(
    'label'        => __( 'List Icon' ),
    'name'         => 'list-icon',
    'description'  => __( 'The icon to use for each list item.' ),
    'options'      => [ 'fa-user', 'fa-access-denied', 'fa-list' ],
    'search'       => true,
    'class_string' => 'fa %s',
) );
```