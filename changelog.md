## 3.4.0 (July 22, 2018)

* Added new custom icon field, with ability to group by categories, enable search, use ajax to handle very large sets if needed
* Added [Numeric Input field](https://github.com/vlad-ignatov/react-numeric-input), which handles steps, min and max and has an optional styled ui for +/- 
* Added [range slider field](http://react-component.github.io/slider/), which allows for single or multiple ranges in a slider type ui, along with optional synchronized numeric input when in single mode
* Added toggle field, which can either be a single checkbox and simply returns true/false, or can have a stylized ui enabled
* Added column width field to have a stylized ui for selecting widths against a grid you set.
* Added tab group field to allow you to created tabbed ui's
* Added style family select field, a field that synchronizes with site builder to allow you to apply style families that are created in that app to a panel.
* Enhanced TextArea to have an optional draftjs editor as well, in case you dont want to use TinyMCE. allows for easy customization of what features are supplied, if you say want a trimmed down editor.
* Updated all UI to new designs
* Added compact modes to most fields, allowing you to create tighter ui's as you see fit
* Added tooltip lib to have descriptions in tooltips, to further compress UI
* Added in options for radio, checkbox, image select to allow you control how many display per row, on a 12 col grid.
* Allowed you to create compact inline groups with the group fields new compact mode
* Updated to React 16 and updated all code to match current standards
* Updated tests and added snapshot tests for all field tests
* Enabled infinite nesting of child panels with recursive function, indexMap
* Added new event emitters into iframe for child panel events, enhanced repeater events
* Implemented custom autosave endpoint to allow for much higher data size, as WP uses form encoded which cant handle very large panel data payloads
* Broke up documentation into directories and partials as it was getting unwieldy, and enhanced
* Added modal for save confirm when you exit live preview
* Nested conditional classes have been added
* Close other accordions at that level when opening one
* Implemented panel permissions system
* Many bugfixes.


## 3.3.0 (September 27, 2017)

* Added new color picker field. Store rgba or hex values directly in the db and pick from any of these uis, with best design support for block and sketch picker. https://casesandberg.github.io/react-color/
* New accordion field. Instead of nested drawers, group fields in a clean horizontal row
* Live refresh rate setting. Now adjust the delay it takes for a ajax update in live preview to execute
* Unsaved content messaging. When leaving live preview receive a message you can suppress about how panel data being saved works.

## 3.2.0 (April 6, 2017)

* Implement default data injected to store on add panel actions. You can now rely on defaults to come out from the db.
* Implement livetext for repeaters and child panels. You can now speed up the ui updating for all your text fields. Check readme for details.
* Patch checkbox defaults and saving bug #68237
* Many misc bugfixes

## 3.1.0 (March 2017)

* Patch a range of issues with repeaters and nested data updates
* Enable single level child panel support #74265
* Nest/Flatten Panel Data for Child Panels #74188

## 3.0.0 (2016)

* Rewrite ui in React
* Enable live previewing of changes
* Redesign admin ui.

## 2.0.0 

* Major update to panels architecture and ui
* Breaking changes with 1.0 data structure


## 1.0.0 

* Initial release