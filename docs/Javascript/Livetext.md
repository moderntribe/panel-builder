### Live edit

During editing of content panels 3 and above has a live edit mode. Like the customizer in WordPress, 
Panel builder loads the front end of the corresponding page you are editing into a preview window and synchronizes 
changes you make into the iframe for live previewing. There are a few things you should be aware of.

In our templates we often only want to render markup if the value for a part of the ui exists in the db. 
But we may need that item during the preview process regardless. In this case we have the function
`is_panel_preview()`. It can be used like so:

```php
if ( ! empty( $title ) || is_panel_preview() ) {
	?>
	<h3
		class="cardgrid-card__title h4"
		data-depth="<?php echo $panel_object->get_depth(); ?>"
		data-index="<?php echo $card_index; ?>"
		data-name="title"
		data-livetext
	>
		<?php echo $title; ?>
	</h3>
	<?php
}
```

Which will output the h3 tag and enable livetext during live preview even if the title is not yet set.

### Livetext

Normally when a change occurs during live edit mode the system performs a debounced ajax call to get updated html for 
the panel being edited. This can be laggy, especially in the case of typing. Hence an instant update system called
"livetext" has been implemented. For it to work for a field you have to setup some required data attributes, and also 
use the technique above to make sure the empty html tag is output during liveedit.

Some rules:
 
* livetext works for text, textarea and wysiwyg fields. 
* It works for top level instances of these fields, repeaters and child panels. 
* Shortcodes will not be parsed, so consider that

*It does NOT yet work for nested grandchild panels and beyond, or repeaters that are nested inside child panels.*

Livetext requires these attributes on the dom element that should update live:

```
data-depth="THE PANELS DEPTH"
data-name="THE REGISTERED NAME OF THE FIELD"
data-index="THE INDEX RELATIVE TO ITS SIBLINGS"
data-livetext
```

Here is an example for making it work with a top level field that we know will never be used in a child panel:

```php
<?php if ( ! empty( $content ) || is_panel_preview() ) { ?>
	<div
		class="panel__content"
		data-depth="0"
		data-name="content"
		data-livetext
	>
		<?php echo $panel['content']; ?>
	</div>
<?php } ?>
```

Here is the same field setup to work at root or in a child panel.

```php
<?php 

$panel_object = get_the_panel();

if ( ! empty( $content ) || is_panel_preview() ) { ?>
	<div
		class="panel__content"
		data-depth="<?php echo $panel_object->get_depth(); ?>"
		data-name="content"
		data-index="<?php echo get_nest_index(); ?>"
		data-livetext
	>
		<?php echo $panel['content']; ?>
	</div>
<?php } ?>
```

Here is how to apply live text to fields inside a repeater, which is using a partial for the repeater row.
First, remember that this only works for repaters that arent nested inside child panels at this time.
Next lets setup the wrapper for the rows. We give it the name attribute we used to identify the repeater group, 
and our other attributes we use for livetext.
We also set a couple of globals (feel free to find other methods to pass your vars in, like locate template)

```php
<?php 
global $panel_object;
$panel_object = get_the_panel();
?>
<div
	class="content-wrap"
	data-depth="0"
	data-name="cards"
	data-livetext
>

	<?php // Cards
	if ( ! empty( $panel['cards'] ) ) {

		global $card;
		global $card_index;

		$card_index = 0;

		echo '<ol class="panel-cardgrid__cards">';

		foreach ( $panel['cards'] as $card ) {
			get_template_part( 'content/panels/cardgrid-card' );
			$card_index++;
		}

		echo '</ol><!-- .panel-cardgrid__cards -->';

		unset( $card );
		unset( $card_index );
	}
	?>

</div><!-- .content-wrap -->
```

Now, let's look at the row partial included above and how it is configured:

```php
<?php
global $card;
global $card_index;
global $panel_object;
?>

<li>
<?php
// Card Title
if ( ! empty( $card['title'] ) || is_panel_preview() ) {
    ?>
    <h3
        class="cardgrid-card__title h4"
        data-depth="<?php echo $panel_object->get_depth(); ?>"
        data-index="<?php echo $card_index; ?>"
        data-name="title"
        data-livetext
    >
        <?php echo $card['title']; ?>
    </h3>
    <?php
}
?>

</li><!-- .cardgrid-card -->
```