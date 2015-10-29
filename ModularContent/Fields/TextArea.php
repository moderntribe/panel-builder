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
		parent::__construct($args);
		$this->index = sprintf('%04d', self::$global_index++);

		// slight chance that this ends up with a harmless enqueued style, but no
		// better place to put it to ensure that WP doesn't print the styles in
		// the middle of a JS template
		add_action( 'before_panel_meta_box', array( __CLASS__, 'enqueue_styles' ) );
	}


	public function render_field() {
		if ( $this->richtext ) {
			add_filter( 'the_editor', array( $this, 'add_data_atts_to_editor' ), 10, 1 );
			wp_editor(
				$this->get_input_value(),
				$this->get_indexed_name(),
				array(
					'textarea_rows' => 15,
					'textarea_name' => $this->get_input_name(),
					'quicktags'     => true,
					'editor_class'  => 'wysiwyg-' . $this->get_indexed_name(),
					'media_buttons' => $this->media_buttons
				)
			);
			remove_filter( 'the_editor', array( $this, 'add_data_atts_to_editor' ), 10, 1 );

			wp_enqueue_script( 'modular-content-wysiwyg-field', \ModularContent\Plugin::plugin_url('assets/scripts/js/fields/wysiwyg-field.js'), array('jquery'), FALSE, FALSE );

			add_action( 'wp_tiny_mce_init', array( $this, 'render_tinymce_initilizaton_script' ) );
		} else {
			printf('<span class="panel-input-field"><textarea name="%s" rows="6" cols="40">%s</textarea></span>', $this->get_input_name(), $this->get_input_value() );
		}
	}

	public function add_data_atts_to_editor( $editor_html ) {
		$editor_html = str_replace('<div', '<div data-settings_id="'.$this->get_indexed_name().'"', $editor_html );
		return $editor_html;
	}

	public static function enqueue_styles() {
		wp_print_styles('editor-buttons');
	}

	public function render_tinymce_initilizaton_script( $settings ) {
		if ( empty(self::$first_mce_init_settings) ) {
			self::$first_mce_init_settings = reset($settings);
		}
		$name = $this->get_indexed_name();
		if ( !isset($settings[$name]) ) {
			return;
		}
		$settings = $settings[$name];
		$settings = wp_parse_args( $settings, self::$first_mce_init_settings );
		$settings['wp_autoresize_on'] = false;

		?><script type="text/javascript">
			(function() {

				var generic_id = '<?php echo $name; ?>';
				window.tribe.panels.wysywig_field.settings[generic_id] = <?php echo $this->build_js_settings_string($settings); ?>;

				window.tribe.panels.wysywig_field.setup_editor_template( generic_id );
			})();
		</script>
	<?php
	}

	/**
	 * @param $settings
	 *
	 * @see \_WP_Editors::_parse_init()
	 *
	 * @return string
	 */
	protected function build_js_settings_string( $settings ) {
		$string = '';

		foreach ( $settings as $k => $v ) {
			if ( is_bool($v) ) {
				$val = $v ? 'true' : 'false';
				$string .= $k . ':' . $val . ',';
				continue;
			} elseif ( !empty($v) && is_string($v) && ( ('{' == $v{0} && '}' == $v{strlen($v) - 1}) || ('[' == $v{0} && ']' == $v{strlen($v) - 1}) || preg_match('/^\(?function ?\(/', $v) ) ) {
				$string .= $k . ':' . $v . ',';
				continue;
			}
			$string .= $k . ':"' . $v . '",';
		}

		return '{' . trim( $string, ' ,' ) . '}';
	}

	protected function get_id( $uuid = '{{data.panel_id}}' ) {
		return $uuid.'_'.$this->esc_class($this->name);
	}

	protected function get_indexed_id( $uuid = '{{data.panel_id}}' ) {
		$id = $this->get_id($uuid);
		return $id.'-'.$this->index;
	}

	protected function get_indexed_name() {
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
}
