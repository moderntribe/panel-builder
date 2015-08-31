# Panel Builder

A Panel is a completely self-contained piece of content defined by the theme.
It has its own template and its own data. The theme defines what fields it
will have in the admin, and the theme controls how those fields will display
on the front end.

## Usage

### Defining Panels

Before any panels can be used, you need to define them. First, hook into `panels_init`:

```php
add_action('panels_init', 'my_panels_init_callback', 10, 0);
```

In your callback, you begin the process of specifying which fields will appear in each
type of panel, and adding those panels to the registry.

```php
$panel = new \ModularContent\PanelType('type-one'); // an arbitrary but unique key
$panel->set_label( 'First Label' ); // whatever you want to name your panel
$panel->set_description( 'This is the first panel we will define' ); // a helpful description for people choosing which type of panel to use
$panel->set_icon( 'http://example.com/path/to/an/icon/representing/this/panel.png' );
$panel->set_template_dir( '/absolute/path/to/a/directory/with/a/template/for/this/panel' );
$panel->add_field( new \ModularContent\Fields\Textarea( array( 'label' => 'Content', 'name' => 'my_content', 'richtext' => true ) ) );
$panel->add_field( new \ModularContent\Fields\Link( array( 'label' => 'Link', 'name' => 'my_link' ) ) );


\ModularContent\Plugin::instance()->registry()->register( $panel );
```

A few notes about the above code:

* `set_template_dir()` is optional. By default, the plugin will look in the `modular-content` directory
in your theme. If you specify a different directory, the theme can still override the template.
* Notice that we do not specify the name of the template file, just the directory. The template MUST
match the ID you gave to your `PanelType` (`type-one.php` for the above `PanelType`).
* Create as many `PanelType`s as you want.
* You can have as many `Field`s as you want.
* Every panel will have a `Title` field. It's automatically added when you create your `PanelType`.
If you want additional fields included on all `PanelType`s, use the `modular_content_default_fields`
filter.

### Nested Panels

Panels can be nested. For example, you may want to build a slider or an accordion, with a different
`Panel` for each slide. When you define your `PanelType`s, you can specify how they can be nested.

```php
$panel->set_max_depth(0); // This can only be a top-level panel
$panel->set_max_depth(1); // This can be on the top or second level. This is the default.
$panel->set_max_children(6); // This panel can have up to 6 direct children
$panel->set_max_children(0); // This panel cannot have children (the default)
```

```php
$panel = new \ModularContent\PanelType('tabs');
$panel->set_label( 'Tabs' );
$panel->set_description( 'Group panels into a tabbed container' );
$panel->set_max_depth(0);
$panel->set_max_children(6);
$panel->set_child_labels( 'Tab', 'Tabs' );
```

### Adding panels to post types

By default, panels will be available on the `post` post type. You can change this during `panel_init`.

```php
remove_post_type_support('post', 'modular-content');
add_post_type_support('page', 'modular-content');
add_post_type_support('product', 'modular-content');
```

### Fields

The plugin comes with a number of pre-defined `Field` types, which can be added to panels in any combination.
You can find the complete collection of fields in the plugin's `ModularContent\Fields` directory.

Each field accepts a few default properties. Some fields also take additional parameters.

* `label`: The human-readable name that will display in the admin next to the field
* `name`: A unique (in the context of the `PanelType`) field name that will be used in the
template to reference the `Panel`'s data.
* `description`: Descriptive text to accompany the field in the admin
* `default`: The default value of the field when a `Panel` is first created

#### `Text`

This is a standard text field.

```php
$panel->add_field( new \ModularContent\Fields\Text( array( 'name' => 'my_text_field', 'label' => 'A Text Field' ) ) );
```

#### `TextArea`

This is a standard textarea, with an optional `richtext` flag to enable WordPress's visual editor.

```php
$panel->add_field( new \ModularContent\Fields\TextArea( array( 'name' => 'my_textarea', 'label' => 'A Textarea Field', 'richtext' => true ) ) );
```

#### `Group`

Fields can be grouped together visually using a `Group`.

```php
$group = new \ModularContent\Fields\Group( array('label' => 'A group of fields', 'name' => 'my_group' ) );
$group->add_field( new \ModularContent\Fields\Image( array( 'label' => 'Image', 'name' => 'image', 'size' => 'thumbnail' ) ) );
$group->add_field( new \ModularContent\Fields\TextArea( array('label' => 'Content', 'name' => 'content', 'richtext' => true ) ) );
$panel->add_field( $group );
```

#### `Repeater`

A `Repeater` is a special kind of `Group`. It provides controls to add or remove instances of the group.
It can have one or more fields.

```php
$group = new \ModularContent\Fields\Repeater( array('label' => 'A group of repeating fields', 'name' => 'my_repeater' ) );
$group->add_field( new \ModularContent\Fields\Image( array( 'label' => 'Image', 'name' => 'image', 'size' => 'thumbnail' ) ) );
$group->add_field( new \ModularContent\Fields\TextArea( array('label' => 'Content', 'name' => 'content', 'richtext' => true ) ) );
$panel->add_field( $group );
```

#### `Posts`

The user can pick an arbitrary number of posts, or define a query that will dynamically update
the list of posts from your site's content.

```php
$module->add_field( new \ModularContent\Fields\Posts( array( 'label' => __('Posts', 'steelcase'), 'name' => 'posts', 'min' => 3, 'suggested' => 3, 'max' => 12, 'show_max_control' => false, 'description' => 'Select 3-12 posts' ) ) );
```

#### `PostQuacker`

It looks like a post. It has a title and content like a post. It must be a post.

This allows the user to either pick a post or enter post-like content (title, content, featured image, URL).

```php
$panel->add_field( new \ModularContent\Fields\PostQuacker( array( 'name' => 'like-a-post', 'label' => 'A Post' ) ) );
```

## Theming

### Adding panels into your post templates

Any panels assigned to a post will automatically render after the content. Chance are, you'll want
to override this, so we make that easy:

```php
\ModularContent\Plugin::instance()->do_not_filter_the_content();
```

Once you do that, you'll of course need to include the panels in your template another way. The
simplest:

```php
do_action('the_panels');
```

If you need more control, though, you can use a loop-like construct:

```php
while ( have_panels() ) {
	the_panel(); // advances to the next panel
	the_panel_content(); // echoes the current panel contents
}
```

### `PanelType` templates

Each `PanelType` is registered with a unique ID, and its template should match that ID. For example,
if your panel ID is `my-awesome-panel`, then the template file should be `my-awesome-panel.php`.

The plugin will first look for that file in the theme's `modular-content` directory. E.g.,
`wp-content/themes/my-theme/modular-content/my-awesome-panel.php`.

If it's not there, it will look in the directory you specified with `$panel->set_template_dir()`.

Failing that, it will look in the same directories for `default.php`, finally falling back to
`default.php` in the plugin's `public-views` directory (which gives you a definition list of the `Panel`'s data).

You'll note a few functions called in the default template that you'll likely make use of in your
own templates.

* `get_panel_var()`: Get the value for the field with a given name. E.g., if you create a text field
with `first_name` for the `name` argument, the you get that value with `get_panel_var('first_name')`.
* `get_panel_vars()`: Get all the data for the current panel as an array.
* `get_the_panel()`: Get the full panel object for the current panel.

## Javascript

### Custom events api

The panel admin scripts emit various events as they do their work. You can hook into these if need be.
All events fire on the `$( document )` jquery object and reside in the namespace tribe-panels.
Most events return the applicable element along with the event object, plus the panel id.

* `tribe-panels.loaded` is emitted when all existing panels - if any - have loaded in the admin. Returns the panel container.
* `tribe-panels.picker-loaded` is emitted when the new panel picker is rendered. Returns the panel selection list.
* `tribe-panels.added-one` is emitted when a panel is added. Returns the panel el and the panel id.
* `tribe-panels.removed-one` is emitted when a panel is removed. Returns the panel el and the panel id.
* `tribe-panels.opened-one` is emitted when a panel is expanded by the user. Returns the panel el and the panel id.
* `tribe-panels.closed-one` is emitted when a panel is closed by the user. Returns the panel el and the panel id.
* `tribe-panels.repeater-row-added` is emitted when a repeater field is added in any panel. Returns container and new row.
* `tribe-panels.repeater-row-removed` is emitted when a repeater field is removed in any panel. Returns repeater container.

Example usage:

```js
$( document ).on( 'tribe-panels.added-one', function( event, element, panel_id ) {
	console.log( 'New panel added.' );
	console.log( 'Event: ' + event );
	console.log( 'New Panel: ' + element );
	console.log( 'New Panel ID: ' + panel_id );
} );
```

Special events (useful for conditional logic in the admin)
Note that these events also emit on panel init so you can do any first run setup on existing panels, and they emit every time a new panel is added.
Also note that when registering these fields (image-select, radio, select) a class will be added to the panel row.
It looks like this: condition-input-name-YOUR_FIELD_NAME-YOUR_ACTIVE_RADIOS_OR_SELECTS_VALUE 

* `tribe-panels.image-select-changed` is emitted when an image-select radio input set has changed it value. Returns panel el, value of selected radio and field el.
* `tribe-panels.select-changed` is emitted when an select field has changed it value. Returns panel el, value of selected option and field el.
* `tribe-panels.radio-changed` is emitted when an radio field set has changed it value. Returns panel el, value of selected radio and field el.

Example usage:

```js
$( document ).on( 'tribe-panels.select-changed', function( event, $panel, val, $field ) {
	if( $field.is( '.input-name-slide_text_color' ) ){
		// do something for this registered field on value
		if( val === 'dark' ){
			console.log( event );
		}
	}
} );
```
