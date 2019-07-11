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
| `ajax_option` | `string` | The AJAX action name that will return the registered icon options |
| `font_size` | `string` | The font size (in px) to use for the icon previews |
| `label_size` | `string` | The label size (in px) to use for the icon label previews |
| `show_uncategorized` | `string` | Whether to show icons which are not assigned to a category |
| `categories` | `array` | An array of key => value pairs of Categories in which key is the category slug and value is the category Label |
| `icon_prefix` | `string` | An option prefix that should be added to each icon class string |
| `class_string` | `string` | The class string to be added to the element; %s will be replaced with the selected option |

### Example

```php
$field = new Icons( array(
    'label'              => __( 'List Icon' ),
    'name'               => 'list-icon',
    'description'        => __( 'The icon to use for each list item.' ),
    'options'            => [ 'fa-user', 'fa-access-denied', 'fa-list' ],
    'search'             => true,
    'class_string'       => 'fa %s',
    'ajax_option'        => 'get_fa_icons',
    'font_size'          => '12',
    'label_size'         => '10',
    'show_uncategorized' => true,
    'categories'         => [
        'medical' => __( 'Medical', 'tribe' ),
        'travel'  => __( 'Travel', 'tribe' ),
        'misc'    => __( 'Misc', 'tribe' ),
    ],
    'icon_prefix'        => 'fa-2x ',
) );
```