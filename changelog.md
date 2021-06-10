## 3.3.3 (April 29, 2020)

* Set panel set title as html so strings aren't escaped

## 3.3.2 (April 29, 2020)

* Add various filters to panel sets and panel collections.

## 3.3.1 (October 7, 2020)

* Removed `Kses::filter_content_filtered` from the `content_filtered_save_pre` hook, as this was being overridden by the posted panels content.
* Added a new filter `modular_content_content_filtered_save_pre` to filter the posted panels content prior to saving.

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
