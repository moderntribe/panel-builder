### Field Overview

View a live interactive field demo [here](https://sq1-panel-field-preview.moderntribe.qa/).

The plugin comes with a number of pre-defined `Field` types, which can be added to panels in any combination.
You can find the complete collection of fields in the plugin's `ModularContent\Fields` directory.

Each field accepts a few default properties. Some fields also take additional parameters.

* `label`: The human-readable name that will display in the admin next to the field
* `name`: A unique (in the context of the `PanelType`) field name that will be used in the
template to reference the `Panel`'s data.
* `description`: Descriptive text to accompany the field in the admin
* `default`: The default value of the field when a `Panel` is first created