## Repeater

A repeatable container for a group of fields. The Repeater can contain one or more fields. An editor can add, remove, or sort instances of the group.

Using data from a repeater in a template:

```php
$contacts = get_panel_var( 'contacts' );
foreach ( $contacts as $contact ) {
    $name = $contact['name'];
    $email = $contact['email'];
}
```

### Parameters

||||
|---|---|---|
| `label`       | `string` | The __() translated label for this field       |
| `name`        | `string` | The unique name for this field                 |
| `description` | `string` | The __() translated description for this field |
| `update_index` | `bool` | Whether or not to dynamically update the index of fields with no title when they are sorted |
| `max` | `int` | The max # of rows that can be added to this repeater |

### Example

```php

// first field for repeater
$name = new Text( [
  'label' => __('Name'),
  'name' => 'name',
] );

// second field for repeater
$email = new Text( [
  'label' => __('Email'),
  'name' => 'email',
] );

// the repeater itself
$group = new Repeater( [
  'label' => __('Contacts'),
  'name' => 'contacts',
  'update_index' => false,
  'max' => 5,
] );

// add the fields to the repeater
$group->add_field( $name );
$group->add_field( $email );
```

### String Overrides

* `button.new`: Add Row
* `button.delete`: Delete Row
* `label.row_index`:Row %{index} |||| Row %{index}
* `notice.max_rows`: You have reached the row limit of this field