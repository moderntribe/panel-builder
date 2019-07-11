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
