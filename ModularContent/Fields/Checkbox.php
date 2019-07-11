<?php


namespace ModularContent\Fields;


/**
 * Class Radio
 *
 * @package ModularContent\Fields
 *
 * A group of checkboxes
 */
class Checkbox extends Select {

	const LAYOUT_VERTICAL   = 'vertical';
	const LAYOUT_HORIZONTAL = 'horizontal';
	const LAYOUT_INLINE     = 'inline';

	protected $default      = [];
	protected $layout       = self::LAYOUT_VERTICAL;
	protected $option_width = 12; // Fields are laid out in a 12-column grid. This defines how many columns wide this field should be.

	public function __construct( $args = [] ) {
		$this->validate_layout( $args );
		$this->validate_option_width( $args );

		$this->defaults['layout']       = $this->layout;
		$this->defaults['option_width'] = $this->option_width;
		parent::__construct( $args );
	}

	public function get_blueprint() {
		$blueprint                 = parent::get_blueprint();
		$blueprint['default']      = (object) $this->default;
		$blueprint['layout']       = $this->layout;
		$blueprint['option_width'] = $this->option_width;

		return $blueprint;
	}

	/**
	 * Get valid layouts for this field.
	 *
	 * @return array
	 */
	protected function get_valid_layouts() {
		return [ self::LAYOUT_VERTICAL, self::LAYOUT_HORIZONTAL, self::LAYOUT_INLINE ];
	}

	/**
	 * Ensure that the values for layout are valid.
	 *
	 * @param $args
	 */
	protected function validate_layout( $args ) {
		if ( isset( $args['layout'] ) && ! in_array( $args['layout'], $this->get_valid_layouts() ) ) {
			throw new \InvalidArgumentException( 'Layout argument can only be "vertical", "horizontal", or "inline".' );
		}
	}

	/**
	 * Ensure that the option_width value is valid.
	 *
	 * @param $args
	 */
	protected function validate_option_width( $args ) {
		if ( isset( $args['option_width'] ) && ( $args['option_width'] < 1 || $args['option_width'] > 12 ) ) {
			throw new \InvalidArgumentException( 'option_width argument must be between 1-12.' );
		}
	}

	/**
	 * Massage submitted data before it's saved.
	 *
	 * Do not cast to string, checkboxes get arrays
	 * Do not force default on empty submissions, in
	 * case all checkboxes are purposefully unchecked.
	 *
	 * @param array $data
	 *
	 * @return array
	 */
	public function prepare_data_for_save( $data ) {
		return $data;
	}
} 