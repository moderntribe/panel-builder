=== Image Upload Helper ===
Contributors: jbrinley
Donate link: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=A69NZPKWGB6H2
Tags: images, admin, uploading, library
Requires at least: 3.3
Tested up to: 3.3.2
Stable tag: trunk
License: MIT
License URI: http://www.opensource.org/licenses/mit-license.php

A useful library for adding image upload fields to your plugin or admin page.

== Description ==

WordPress has a wonderful JavaScript/iframe dialog for uploading or choosing images to use
in posts or as featured thumbnails. Repurposing this dialog for other uses is difficult.
Image Upload Helper is a simple library that helps you add an image upload/selection field
anywhere in the WordPress admin, using a single function.

Created by [Flightless](http://flightless.us) with significant credit to [Modern Tribe](http://tri.be)

== Installation ==

1. Upload the plugin to your blog.
1. Activate it.
1. Nothing happens.

This is a library. It doesn't actually do anything by itself. To use it in a plugin:

1. Include this plugin (in its entirety) in a subdirectory of your plugin. It plays nice with other
plugins; if a site has multiple plugins activated, each with its own copy of Image Upload Helper, only
one will load.
1. `require_once( 'image-upload-helper/image-upload-helper.php' );`
1. Call `image_upload_helper()` wherever you want an upload dialog available.

The `image_upload_helper()` function takes an array of arguments to control exactly what the form
looks like.

* `field_name` - Required. The name of the form field that will be submitted. Defaults to
 "image-upload-helper". Use this to customize the field to fit in with your form. By changing
  the `field_name` value, you can call `image_upload_helper()` as often as you like on each page.
* `thumbnail_id` - The attachment ID of the current value of the field.
* `label` - The label to use for the field. Defaults to "thumbnail image". This will
display as "Set thumbnail image" or "Remove thumbnail image" in the form, or "Use as
thumbnail image" in the iframe dialog
* `size` - The size of the image you want displayed in the form. Defaults to "post-thumbnail".
If you want to display a custom size, make sure you register it.

When a form is submitted with an Image Upload Helper field, the field specified by the `field_name` argument
will contain the attachment ID of the selected image.

== Changelog ==

= 1.0 =

Initial version