## Post List

A complex field for selecting or querying posts. Returns an array of post objects for use in the template.

```php
$posts = get_panel_var( 'some-posts' );
foreach ( $posts as $post ) {
  // do something with a $post array
}
```

* Each post array will have these fields:
    * title
    * content
    * excerpt
    * image
    * link => [ url, target, label ]
    * post_type
    * post_id

### Parameters

||||
|---|---|---|
| `label`       | `string` | The __() translated label for this field       |
| `name`        | `string` | The unique name for this field                 |
| `description` | `string` | The __() translated description for this field |
| `max` | `int` | The maximum number of posts the user can pick, or the max returned by a query |
| `min` | `int` | A warning message is displayed to the user until the required number of posts is selected |
| `suggested` | `string` | The number of empty slots that will be shown in the admin, |
| `show_max_control` | `bool` | If true, the user can pick the max number of posts (between min and max) |
| `hidden_fields` | `array` | Hide the selected fields from previews and from manual input |

### Example

```php
$field = new Post_List( array(
    'label' => __( 'Select some posts' ),
    'name' => 'some-posts',
    'max' => 12,
    'min' => 3,
    'suggested' => 6,
    'show_max_control' => false,
    'hidden_fields' => [ 'post_title, 'post_content', 'url', 'thumbnail_id' ], 
) );
```

### String Overrides

* `tabs.manual`                                -  Manual
* `tabs.dynamic`                               -  Dynamic
* `button.select_post`                         -  Select a post
* `button.create_content`                      -  Create content
* `button.remove_post`                         -  Remove this post
* `button.remove`                              -  Remove
* `button.select`                              -  Select Files
* `button.add_to_panel`                        -  Add to Panel
* `button.cancel_panel`                        -  Cancel
* `placeholder.no_results`                     -  No Results
* `placeholder.select_search`                  -  Type to search
* `placeholder.select_post`                    -  Select...
* `label.add_another`                          -  Add Another
* `label.content_type`                         -  Content Type
* `label.choose_post`                          -  Choose a Post
* `label.max_results`                          -  Max Results
* `label.select_post_type`                     -  Select Post Type
* `label.select_post_types`                    -  Select Post Types
* `label.add_a_filter`                         -  Add a Filter
* `label.taxonomy`                             -  Taxonomy
* `label.taxonomy-placeholder`                 -  Select Term
* `label.select-placeholder`                   -  Select
* `label.relationship`                         -  Relationship
* `label.relationship-post-type-placeholder`   -  Select a Post Type
* `label.relationship-post-select-placeholder` -  Select a Related Post
* `label.relationship-no-results`              -  No Results
* `label.date`                                 -  Date
* `label.date-start-date-placeholder`          -  Start Date
* `label.date-end-date-placeholder`            -  End Date
* `label.title`                                -  Title
* `label.content`                              -  Content
* `label.link`                                 -  Link: http://example.com/
* `label.thumbnail`                            -  Thumbnail
* `notice.min_posts`                           -  This field requires %{count} more item |||| This field requires %{count} more items
