# AJAX Queue for WordPress

Plugin that allows you to queue AJAX calls and do a single HTTP request.

Activating the plugin will load a global `AJAXQueue` JavaScript object.

More documentation coming soon (isn't it always?), but this is how it works:

## On the JavaScript side

```JavaScript
AJAXQueue.add(action, params, callback);
````

Where:

`action` is the action registerd with the WP AJAX API (ie: `wp_ajax_{action}`).

`params` is the map that represents the actual POST request for this action.

`callback` is going to be called with the JSON response for this specific action. The exact same callback you use for a standard AJAX call should work fine.

Once you enqueue all your calls, you simply call:

```JavaScript
AJAXQueue.run();
```


## On the PHP side

Just register your AJAX handlers as usual. Nothing special. 
The only **requirement** is that you use core's JSON functions to return your data:
`wp_send_json_error` and `wp_send_json_success`. Don't ever use `die();` or `exit;` manually or this won't work.
This is a good practice anyway so if this requirement is a problem, shame on you!

## Example

### PHP

```php
add_action( 'wp_ajax_action_with_error', function () {
	wp_send_json_error( [ 'message' => strtoupper( $_POST['my_arg'] ) ] );
} );

add_action( 'wp_ajax_action_with_ok', function () {
	wp_send_json_success( [ 'message' => md5( rand() ) ] );
} );

```

### JS

```JavaScript
AJAXQueue.add('action_with_error', {my_arg:'wooot!'}, function(response){ console.log(response) } );
AJAXQueue.add('action_with_error', {my_arg:'you can call the same action multiple times!'}, function(response){ console.log(response) } );
AJAXQueue.add('action_with_ok', {}, function(response){ console.log(response) } );
AJAXQueue.run();
```

### Result



![Demo](https://cldup.com/_6Nk2aprb9.gif)
