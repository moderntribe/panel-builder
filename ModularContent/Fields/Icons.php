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

	protected $class_string = '';
	protected $search  = false;

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
	    'search'       => true, // whether to display a search field for searching through the available options
	    'class_string' => 'fa %s', // the class string to be added to the element; %s will be replaced with the selected option
	) );
	 */

	public function __construct( $args = [] ) {
		$this->defaults['class_string'] = $this->class_string;
		$this->defaults['search']       = $this->search;
		parent::__construct( $args );
	}

	public function get_blueprint() {
		$blueprint                 = parent::get_blueprint();
		$options                   = $this->get_options();
		$blueprint['class_string'] = $this->class_string;
		$blueprint['search']       = $this->search;
		$blueprint['options']      = [];
		foreach ( $options as $key => $label ) {

			$key = is_int( $key ) ? $label : $key; // convert non-associative array keys to the value instead.

			$blueprint['options'][] = [
				'label' => $label,
				'value' => (string) $key, // cast to string so react-select has consistent types for comparison
			];
		}

		return $blueprint;
	}
}
