<?php

namespace ModularContent\Fields;

/**
 * Class Icons
 *
 * @package ModularContent\Fields
 *
 * A field for selecting an icon from an icon library.
 */
class Icons extends Radio {

	protected $class_string       = '';
	protected $icon_prefix        = '';
	protected $font_size          = '';
	protected $label_size         = '';
	protected $search             = false;
	protected $show_uncategorized = false;
	protected $ajax_option        = false;
	protected $categories         = [];

	/**
	 * @param array $args
	 *
	 * Usage example:
	 *
	 * $field = new Icons( array(
	 * 'label'        => __( 'List Icon' ),
	 * 'name'         => 'list-icon',
	 * 'description'  => __( 'The icon to use for each list item.' ),
	 * 'options'      => [ 'fa-user', 'fa-access-denied', 'fa-list' ],
	 * 'search'       => true, // whether to display a search field for searching through the available options
	 * 'class_string' => 'fa %s', // the class string to be added to the element; %s will be replaced with the selected option
	 * ) );
	 */

	public function __construct( $args = [] ) {
		$this->defaults['strings']      = [
			'placeholder.search' => __( 'Search Icon Library', 'modular-content' ),
			'label.selected'     => __( 'Selected Icon:', 'modular-content' ),
		];
		$this->defaults['class_string']       = $this->class_string;
		$this->defaults['search']             = $this->search;
		$this->defaults['ajax_option']        = $this->ajax_option;
		$this->defaults['font_size']          = $this->font_size;
		$this->defaults['label_size']         = $this->label_size;
		$this->defaults['show_uncategorized'] = $this->show_uncategorized;
		$this->defaults['categories']         = $this->categories;
		$this->defaults['icon_prefix']        = $this->icon_prefix;
		parent::__construct( $args );
	}

	public function get_blueprint() {
		$blueprint                 = parent::get_blueprint();
		$options                   = $this->get_options();
		$blueprint['class_string'] = $this->class_string;
		$blueprint['search']       = $this->search;
		$blueprint['options']      = [];
		$blueprint['icon_prefix']  = $this->icon_prefix;
		$blueprint['font_size']    = $this->font_size;
		$blueprint['label_size']   = $this->label_size;

		foreach ( $options as $key => $label ) {

			$key = is_int( $key ) ? $label : $key; // convert non-associative array keys to the value instead.

			$blueprint['options'][] = [
				'label' => $label,
				'value' => (string) $key, // cast to string so react-select has consistent types for comparison
			];
		}
		$blueprint['ajax_option']         = $this->ajax_option;
		$blueprint['categories']          = $this->categories;
		$blueprint['show_uncategorized']  = $this->show_uncategorized;

		return $blueprint;
	}
}
