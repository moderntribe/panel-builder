<?php

namespace ModularContent\Fields;

/**
 * Class TextArea
 *
 * @package ModularContent\Fields
 *
 * A textarea. Set the argument 'richtext' to TRUE to use
 * a WordPress visual editor.
 */
class TextArea extends Field {
	const EDITOR_TYPE_DRAFTJS = 'draftjs';
	const EDITOR_TYPE_TINYMCE = 'tinymce';

	protected $richtext               = false;
	protected $media_buttons          = true;
	protected $editor_settings        = [];
	protected $editor_type            = self::EDITOR_TYPE_TINYMCE;
	protected $editor_options         = [];
	protected $enable_fonts_injection = false;

	protected static $global_index            = 0;
	protected        $index                   = 0;
	protected static $first_mce_init_settings = [];

	/**
	 * @param array $args
	 *
	 * Usage example:
	 */
	public function __construct( $args = [] ) {
		$this->validate_editor_type( $args );

		$this->defaults['richtext']               = $this->richtext;
		$this->defaults['media_buttons']          = $this->media_buttons;
		$this->defaults['editor_settings']        = $this->editor_settings;
		$this->defaults['editor_type']            = $this->editor_type;
		$this->defaults['editor_options']         = $this->editor_options;
		$this->defaults['enable_fonts_injection'] = $this->enable_fonts_injection;

		$this->defaults['strings'] = [
			'tab.visual' => __( 'Visual', 'modular-content' ),
			'tab.text'   => __( 'Text', 'modular-content' ),
		];
		parent::__construct( $args );
		$this->index = sprintf( '%04d', self::$global_index++ );

		// slight chance that this ends up with a harmless enqueued style, but no
		// better place to put it to ensure that WP doesn't print the styles in
		// the middle of a JS template
		add_action( 'before_panel_meta_box', [ __CLASS__, 'enqueue_styles' ] );
		if ( $this->media_buttons ) {
			add_filter( 'modular_content_metabox_data', [ __CLASS__, 'get_media_button_html_for_js' ] );
		}
	}

	protected function get_valid_editor_types() {
		return [ self::EDITOR_TYPE_DRAFTJS, self::EDITOR_TYPE_TINYMCE ];
	}

	protected function validate_editor_type( $args ) {
		if ( ! $this->is_valid_editor_type( $args ) ) {
			throw new \InvalidArgumentException( 'editor_type may only be "tinymce" or "draftjs"' );
		}
	}

	protected function is_valid_editor_type( $args ) {
		return empty( $args['editor_type'] ) || ( in_array( $args['editor_type'], $this->get_valid_editor_types() ) );
	}

	public function add_data_atts_to_editor( $editor_html ) {
		$editor_html = str_replace( '<div', '<div data-settings_id="' . $this->get_indexed_name() . '"', $editor_html );

		return $editor_html;
	}

	public static function enqueue_styles() {
		wp_print_styles( 'editor-buttons' );
	}

	public static function get_media_button_html_for_js( $data ) {
		ob_start();
		do_action( 'media_buttons', '%EDITOR_ID%' );
		$html                       = ob_get_clean();
		$data['media_buttons_html'] = $html;

		return $data;
	}

	public function get_indexed_name() {
		$name = $this->esc_class( $this->name );

		return $name . '-' . $this->index;
	}

	public function get_vars( $data, $panel ) {
		$text = parent::get_vars( $data, $panel );
		if ( $this->richtext && apply_filters( 'apply_the_content_filters_to_panel_builder_wysiwygs', true, $this, $panel ) ) {
			$text = apply_filters( 'the_content', $text );
		}

		$text = apply_filters( 'panels_field_vars', $text, $this, $panel );

		return $text;
	}

	public function get_blueprint() {
		$blueprint                              = parent::get_blueprint();
		$blueprint['richtext']                  = $this->richtext;
		$blueprint['media_buttons']             = $this->media_buttons;
		$blueprint['editor_settings_reference'] = '';
		$blueprint['editor_type']               = $this->editor_type;
		if ( $this->richtext && $this->editor_type === self::EDITOR_TYPE_TINYMCE ) {
			$blueprint['editor_settings_reference'] = $this->setup_editor_settings();
		}

		if ( $blueprint['editor_type'] === self::EDITOR_TYPE_DRAFTJS ) {
			$blueprint['editor_options'] = $this->editor_options;
		}

		if ( isset( $blueprint['editor_options'] ) ) {
			$blueprint['editor_options'] = apply_filters( 'panels_text_area_editor_options', $blueprint['editor_options'] );
		}

		$blueprint['enable_fonts_injection'] = $this->enable_fonts_injection;

		return $blueprint;
	}

	protected function generate_textarea_name() {
		if ( function_exists( 'wp_generate_uuid4' ) ) {
			return wp_generate_uuid4(); // added in WP 4.7
		}

		return uniqid( $this->name, true );
	}

	/**
	 * Tell WP to render an editor so that the settings
	 * can be found later in the tinyMCEPreInit object.
	 *
	 * @return string
	 */
	private function setup_editor_settings() {
		ob_start();

		$editor_id = $this->get_indexed_name();
		$settings  = wp_parse_args( $this->editor_settings, [
			'textarea_rows' => 15,
			'textarea_name' => $this->generate_textarea_name(),
			'quicktags'     => true,
			'editor_class'  => 'wysiwyg-' . $editor_id,
			'media_buttons' => $this->media_buttons,
		] );
		add_filter( 'the_editor', [ $this, 'add_data_atts_to_editor' ], 10, 1 );
		wp_editor( '', $editor_id, $settings );
		remove_filter( 'the_editor', [ $this, 'add_data_atts_to_editor' ], 10 );

		ob_end_clean();

		return $editor_id;
	}

	/**
	 * Massage submitted data before it's saved.
	 *
	 * @param mixed $data
	 *
	 * @return string
	 */
	public function prepare_data_for_save( $data ) {
		return (string) parent::prepare_data_for_save( $data );
	}
}
