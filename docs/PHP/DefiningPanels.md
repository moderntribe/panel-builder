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