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

* `can_sort_panels` Ability to sort panels.
* `can_add_panels` Renders the panel picker and add button if true.
* `can_delete_panels` Render the delete button for panels if true.
* `can_add_rows` Can add repeater field rows.
* `can_delete_rows` Can delete repeater field rows.
* `can_sort_rows` Can sort repeater field rows.
* `can_edit_panel_settings` Renders and allow users to access the setting tab if settings fields are active and this is true.
* `can_add_child_panels` Renders the child panel picker and add button if true.
* `can_delete_child_panels` Renders child panel delete button.
* `can_sort_child_panels` Allows sorting of child panels if true.
* `can_add_panel_sets`  Can add from saved panels sets to a new page/page without panels.
* `can_edit_panel_sets` Can edit existing panel sets from the react ui. 
* `can_save_panel_sets` Can save panel sets from the react ui.