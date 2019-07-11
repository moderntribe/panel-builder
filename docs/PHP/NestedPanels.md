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