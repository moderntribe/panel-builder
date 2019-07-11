### Adding panels to post types

By default, panels will be available on the `post` post type. You can change this during `panel_init`.

```php
remove_post_type_support('post', 'modular-content');
add_post_type_support('page', 'modular-content');
add_post_type_support('product', 'modular-content');
```