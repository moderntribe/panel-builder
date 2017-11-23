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
$panel->set_thumbnail( 'http://example.com/path/to/a/thumbnail/representing/this/panel.png' );
$panel->set_template_dir( '/absolute/path/to/a/directory/with/a/template/for/this/panel' );
$panel->add_field( new \ModularContent\Fields\Textarea( [
	'label' => 'Content',
	'name' => 'my_content',
	'richtext' => true,
] ) );
$panel->add_field( new \ModularContent\Fields\Link( [
	'label' => 'Link',
	'name' => 'my_link',
] ) );
$panel->add_settings_field( new \ModularContent\Fields\Radio( [
	'name' => 'layout',
	'label' => 'Layout',
	'options' => [
		'left' => 'Left',
		'right' => 'Right'
	],
	'default' => 'Left'
] ) );

\ModularContent\Plugin::instance()->registry()->register( $panel );
```

A few notes about the above code:

* `set_template_dir()` is optional. By default, the plugin will look in the `modular-content` directory
in your theme. If you specify a different directory, the theme can still override the template. To specify
multiple fallback directories, pass in an instance of `PanelViewFinder`.
* Notice that we do not specify the name of the template file, just the directory. The template MUST
match the ID you gave to your `PanelType` (`type-one.php` for the above `PanelType`).
* Create as many `PanelType`s as you want.
* You can have as many `Field`s as you want.
* Every panel will have a `Title` field. It's automatically added when you create your `PanelType`.
If you want additional fields included on all `PanelType`s, use the `modular_content_default_fields`
filter.
* Fields can be divided into "Content" and "Settings" fields. All fields default to "Content", but once
a "Settings" field has been added, it will show up in a separate tab in the panel editor. `Group` and
`Repeater` fields are not supported as settings fields, nor can you add a settings field inside of a
`Group` or `Repeater`.

### Nested Panels

Panels can be nested (v3.2 and up, or v2). For example, you may want to build a slider or an accordion, with a different
`Panel` for each slide. When you define your `PanelType`s, you can specify how they can be nested.

```php
$panel->set_max_depth(0); // This can only be a top-level panel. This is the default.
$panel->set_max_depth(1); // This can be on the top or second level.
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

## Permissions

There are various permissions capabilities available for you to enable/disable. 
To use them you would filter `panels_js_config`, maybe in your Initializer class in the core plugin or from permissions classes.
todo: @jbrinley if this doesnt apply anymore when you do your part please augment 
Example:

```php
	public function hook() {
		add_filter( 'panels_js_config', [ $this, 'modify_js_config' ] );
	}
	
	public function modify_js_config( $data = [] ) {
        global $current_user;
        $is_customer = SOME_CHECK_ON_ROLE_IN_USER;
        $data[ 'permissions' ] = [
            'can_sort_panels'         => ! $is_customer,
            'can_add_panels'          => ! $is_customer,
            'can_delete_panels'       => ! $is_customer,
        ];
        return $data;
    }
```

### Available caps to override

`can_sort_panels` Ability to sort panels.
`can_add_panels` Renders the panel picker and add button if true.
`can_delete_panels` Render the delete button for panels if true.
`can_add_rows` Can add repeater field rows.
`can_delete_rows` Can delete repeater field rows.
`can_sort_rows` Can sort repeater field rows.
`can_edit_panel_settings` Renders and allow users to access the setting tab if settings fields are active and this is true.
`can_add_child_panels` Renders the child panel picker and add button if true.
`can_delete_child_panels` Renders child panel delete button.
`can_sort_child_panels` Allows sorting of child panels if true.
`can_add_panel_sets`  Can add from saved panels sets to a new page/page without panels.
`can_edit_panel_sets` Can edit existing panel sets from the react ui. 
`can_save_panel_sets` Can save panel sets from the react ui.

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

### Live edit

During editing of content panels 3 and above has a live edit mode. Like the customizer in WordPress, 
Panel builder loads the front end of the corresponding page you are editing into a preview window and synchronizes 
changes you make into the iframe for live previewing. There are a few things you should be aware of.

In our templates we often only want to render markup if the value for a part of the ui exists in the db. 
But we may need that item during the preview process regardless. In this case we have the function
`is_panel_preview()`. It can be used like so:

```php
if ( ! empty( $title ) || is_panel_preview() ) {
	?>
	<h3
		class="cardgrid-card__title h4"
		data-depth="<?php echo $panel_object->get_depth(); ?>"
		data-index="<?php echo $card_index; ?>"
		data-name="title"
		data-livetext
	>
		<?php echo $title; ?>
	</h3>
	<?php
}
```

Which will output the h3 tag and enable livetext during live preview even if the title is not yet set.

### Livetext

Normally when a change occurs during live edit mode the system performs a debounced ajax call to get updated html for 
the panel being edited. This can be laggy, especially in the case of typing. Hence an instant update system called
"livetext" has been implemented. For it to work for a field you have to setup some required data attributes, and also 
use the technique above to make sure the empty html tag is output during liveedit.

Some rules:
 
* livetext works for text, textarea and wysiwyg fields. 
* It works for top level instances of these fields, repeaters and child panels. 

*It does NOT yet work for nested grandchild panels and beyond, or repeaters that are nested inside child panels.*

Livetext requires these attributes on the dom element that should update live:

```
data-depth="THE PANELS DEPTH"
data-name="THE REGISTERED NAME OF THE FIELD"
data-index="THE INDEX RELATIVE TO ITS SIBLINGS"
data-livetext
```

Here is an example for making it work with a top level field that we know will never be used in a child panel:

```php
<?php if ( ! empty( $content ) || is_panel_preview() ) { ?>
	<div
		class="panel__content"
		data-depth="0"
		data-name="content"
		data-livetext
	>
		<?php echo $panel['content']; ?>
	</div>
<?php } ?>
```

Here is the same field setup to work at root or in a child panel.

```php
<?php 

$panel_object = get_the_panel();

if ( ! empty( $content ) || is_panel_preview() ) { ?>
	<div
		class="panel__content"
		data-depth="<?php echo $panel_object->get_depth(); ?>"
		data-name="content"
		data-index="<?php echo get_nest_index(); ?>"
		data-livetext
	>
		<?php echo $panel['content']; ?>
	</div>
<?php } ?>
```

Here is how to apply live text to fields inside a repeater, which is using a partial for the repeater row.
First, remember that this only works for repaters that arent nested inside child panels at this time.
Next lets setup the wrapper for the rows. We give it the name attribute we used to identify the repeater group, 
and our other attributes we use for livetext.
We also set a couple of globals (feel free to find other methods to pass your vars in, like locate template)

```php
<?php 
global $panel_object;
$panel_object = get_the_panel();
?>
<div
	class="content-wrap"
	data-depth="0"
	data-name="cards"
	data-livetext
>

	<?php // Cards
	if ( ! empty( $panel['cards'] ) ) {

		global $card;
		global $card_index;

		$card_index = 0;

		echo '<ol class="panel-cardgrid__cards">';

		foreach ( $panel['cards'] as $card ) {
			get_template_part( 'content/panels/cardgrid-card' );
			$card_index++;
		}

		echo '</ol><!-- .panel-cardgrid__cards -->';

		unset( $card );
		unset( $card_index );
	}
	?>

</div><!-- .content-wrap -->
```

Now, let's look at the row partial included above and how it is configured:

```php
<?php
global $card;
global $card_index;
global $panel_object;
?>

<li>
<?php
// Card Title
if ( ! empty( $card['title'] ) || is_panel_preview() ) {
    ?>
    <h3
        class="cardgrid-card__title h4"
        data-depth="<?php echo $panel_object->get_depth(); ?>"
        data-index="<?php echo $card_index; ?>"
        data-name="title"
        data-livetext
    >
        <?php echo $card['title']; ?>
    </h3>
    <?php
}
?>

</li><!-- .cardgrid-card -->

```
## Custom Javascript Events

A variety of custom events are fired on the document in admin and also injected into the iframe on its document as the system is used.
While you may want to do something nifty admin side that hooks into them there, most likely as a themer you'll want to do something on the front end during live preview. A common case would be scrolling an active slide into view that is powered by a repeater row so they can actually see what they are editing in that slide when working on it. Or most common, you'll want to reinit some javascript powered layout when the panel preview refreshes that block with new html. 

### List of iframe events

These events are emitted into the iframe when an operation is completed successfully. The repeater and child panel events have a 200ms delay applied when they are fired in conjunction with an html update for that panels preview that involves ajax. This means that you can first respond to the panel updated event and do initial preparations before then doing some nested action, like initializing a slider again after update before then sliding it to the active slide index emitted by the child or repeater event.

* `modular_content/panel_preview_updated` Ajax has run and replaced a panels html block.
* `modular_content/repeater_row_added` A repeater row was added.
* `modular_content/repeater_row_moved` A repeater row moved.
* `modular_content/repeater_row_updated` A repeater row updated.
* `modular_content/repeater_row_deleted` A repeater row was deleted.
* `modular_content/repeater_row_activated` A repeater row was activated.
* `modular_content/repeater_row_deactivated` A repeater row was deactivated.
* `modular_content/child_panel_added` A child panel was added.
* `modular_content/child_panel_moved` A child panel moved.
* `modular_content/child_panel_updated` A child panel updated.
* `modular_content/child_panel_deleted` A child panel was deleted.
* `modular_content/child_panel_activated` A child panel was activated.
* `modular_content/child_panel_deactivated` A child panel was deactivated.

The data passed along in the event.detail object is as follows: 

#### modular_content/panel_preview_updated

It will also contain a child index if it is a child panel as `childIndex`. Top event type will be added or updated.

```json
{
  "parent": {
    "type": "modern_tribe/panel_updated",
    "data": {
      "depth": 0,
      "index": 2,
      "name": "THE_FIELD_NAME_TRIGGERING_THE_UPDATE",
      "value": "THE_UPDATE_DATA"
    }
  }
}
```

#### All repeater events

The rowIndex is the currently operated upon index in the repeater group.

```json
{
  "rowIndex": 2,
  "depth": 0,
  "index": 3,
  "name": "THE_REPEATER_FIELD_NAME",
  "value": "ARRAY_OF_ALL_ROWS_OF_THIS_REPEATERS_DATA"
}
```

#### All child panel events

The rowIndex is the currently operated upon index in the child panel group.

```json
{
  "rowIndex": 2,
  "depth": 1,
  "index": 3,
  "name": "panels",
  "value": "ARRAY_OF_ALL_ROWS_OF_THIS_CHILD_PANEL_DATA"
}
```

## React Development Setup

### Node and Dependencies

This system uses node version 6.9.4. If you don't already have that plus some system to control node versions (eg NVM) it
is recommended you install one. For your convenience this project has an .nvmrc file at its root. Once you have installed Node 6.9.4
you can either set it as your default OR every time you come to this project just type `nvm use` to load the correct version.

Next you will need yarn installed globally with `npm install yarn -g`.

After getting your node version ready, installing yarn and making sure you are on 6.9.4, first delete an existing node_modules folder if 
you still have one in place. Then `yarn install`. 

After yarn install has completed you can run the npm scripts that define the tasks for this project. They are currently:

```json
 	"start": "yarn install && npm run dev",
    "bundle": "cross-env NODE_ENV=production webpack -p --progress",
    "dev": "cross-env NODE_ENV=development node server.js",
    "lint": "eslint ./ui/src || exit 0",
    "dist": "yarn install && yarn test && yarn lint && yarn bundle",
    "test": "jest -i",
    "test:watch": "npm test -- --watch"
```
The development task that fires up webpack-dev-server and gets you ready to dev is start. You launch that by typing: `yarn start`

The react scripts will be served at `http://localhost:3000/ui/dist/master.js`. 
To set up your environment to load this file and experience the joys of [hot module replacement](https://webpack.github.io/docs/hot-module-replacement.html) make sure `SCRIPT_DEBUG` is true and you have filtered `modular_content_js_dev_path` with the above src. It is recommended you create a gitignored file in your mu-plugins folder called `mu-local.php`. Then apply the filter like so:

```php
add_filter( 'modular_content_js_dev_path', function() {
	return 'http://localhost:3000/ui/dist/master.js';
});
```

The other tasks must be run in this fashion: `yarn task` . Give the Jest tests a run with `yarn test` to make sure 
things are working well.

This system is also redux dev tools enabled. You will want to [install them](https://github.com/zalmoxisus/redux-devtools-extension)
in chrome if you want to use them.
