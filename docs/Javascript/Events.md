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
      "indexMap": [0,1,6], // the 7th grandchild of the 2nd child of the first panel
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