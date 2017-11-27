<?php

namespace ModularContent\Fields;

/**
 * Class Icons
 *
 * @package ModularContent\Fields
 *
 * An color picker field.
 */
class Icons extends Radio {

	protected $class_string;

	/**
	 * @param array $args
	 *
	 * Usage example:
	 *
	$field = new Icons( array(
		'label'        => __( 'List Icon' ),
		'name'         => 'list-icon',
		'description'  => __( 'The icon to use for each list item.' ),
	    'options'      => [ 'fa-user', 'fa-access-denied', 'fa-list' ],
	    'class_string' => 'fa %s',
	) );
	 */
}
