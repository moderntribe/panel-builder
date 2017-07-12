<?php

namespace ModularContent\Fields;
use ModularContent\Panel;

/**
 * Class TextArea
 *
 * @package ModularContent\Fields
 *
 * A textarea. Set the argument 'richtext' to TRUE to use
 * a WordPress visual editor.
 */
class TextArea extends Field {
	protected $richtext = FALSE;
	protected $media_buttons = true;
	protected $editor_settings = [];

	protected static $global_index = 0;
	protected $index = 0;
	protected static $first_mce_init_settings = array();

	/**
	 * @param array $args
	 *
	 * Usage example:
	 *
	 * $field = new TextArea( array(
	 *   'label' => __('Description'),
	 *   'name' => 'description',
	 *   'description' => __( 'How would you describe it?' ),
	 *   'richtext' => TRUE,
	 * ) );
	 */
	public function __construct( $args = array() ) {
		$this->defaults['richtext'] = $this->richtext;
		$this->defaults['media_buttons'] = $this->media_buttons;
		$this->defaults['editor_settings'] = $this->editor_settings;

		$this->defaults[ 'strings' ] = [
			'tab.visual' => __( 'Visual', 'modular-content' ),
			'tab.text'   => __( 'Text', 'modular-content' ),
		];
		parent::__construct($args);
		$this->index = sprintf('%04d', self::$global_index++);

		// slight chance that this ends up with a harmless enqueued style, but no
		// better place to put it to ensure that WP doesn't print the styles in
		// the middle of a JS template
		add_action( 'before_panel_meta_box', array( __CLASS__, 'enqueue_styles' ) );
		if ( $this->media_buttons ) {
			add_filter( 'modular_content_metabox_data', [ __CLASS__, 'get_media_button_html_for_js' ] );
		}
	}

	public function add_data_atts_to_editor( $editor_html ) {
		$editor_html = str_replace('<div', '<div data-settings_id="'.$this->get_indexed_name().'"', $editor_html );
		return $editor_html;
	}

	public static function enqueue_styles() {
		wp_print_styles('editor-buttons');
	}

	public static function get_media_button_html_for_js( $data ) {
		ob_start();
		do_action( 'media_buttons', '%EDITOR_ID%' );
		$html = ob_get_clean();
		$data[ 'media_buttons_html' ] = $html;
		return $data;
	}

	public function get_indexed_name() {
		$name = $this->esc_class( $this->name );
		return $name . '-' . $this->index;
	}

	public function get_vars( $data, $panel ) {
		$text = parent::get_vars( $data, $panel );
		if ( $this->richtext && apply_filters( 'apply_the_content_filters_to_panel_builder_wysiwygs', TRUE, $this, $panel ) ) {
			$text = apply_filters( 'the_content', $text );
		}

		$text = apply_filters( 'panels_field_vars', $text, $this, $panel );

		return $text;
	}

	public function get_blueprint() {
		$blueprint = parent::get_blueprint();
		$blueprint[ 'richtext' ] = $this->richtext;
		$blueprint[ 'media_buttons' ] = $this->media_buttons;
		$blueprint[ 'editor_settings_reference' ] = '';
		if ( $this->richtext ) {
			$blueprint[ 'editor_settings_reference' ] = $this->setup_editor_settings();
		}
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
	 * @return string
	 */
	private function setup_editor_settings() {
		ob_start();

		$editor_id = $this->get_indexed_name();
		$settings = wp_parse_args( $this->editor_settings, array(
			'textarea_rows' => 15,
			'textarea_name' => $this->generate_textarea_name(),
			'quicktags'     => true,
			'editor_class'  => 'wysiwyg-' . $editor_id,
			'media_buttons' => $this->media_buttons,
		) );
		add_filter( 'the_editor', array( $this, 'add_data_atts_to_editor' ), 10, 1 );
		wp_editor(
			'',
			$editor_id,
			$settings
		);
		remove_filter( 'the_editor', array( $this, 'add_data_atts_to_editor' ), 10 );

		ob_end_clean();

		return $editor_id;
	}

	/**
	 * Massage submitted data before it's saved.
	 *
	 * @param mixed $data
	 * @return string
	 */
	public function prepare_data_for_save( $data ) {
		return (string) parent::prepare_data_for_save( $data );
	}
}
