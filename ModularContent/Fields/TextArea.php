<?php

namespace ModularContent\Fields;
use ModularContent\Panel;

class TextArea extends Field {
	protected $richtext = FALSE;
	protected static $global_index = 0;
	protected $index = 0;
	protected static $first_mce_init_settings = array();

	public function __construct( $args = array() ) {
		$this->defaults['richtext'] = $this->richtext;
		parent::__construct($args);
		$this->index = sprintf('%04d', self::$global_index++);

		// slight chance that this ends up with a harmless enqueued style, but no
		// better place to put it to ensure that WP doesn't print the styles in
		// the middle of a JS template
		add_action( 'before_panel_meta_box', array( __CLASS__, 'enqueue_styles' ) );
	}


	public function render_field() {
		if ( $this->richtext ) {
			wp_editor(
				$this->get_input_value(),
				$this->get_indexed_id(),
				array(
					'textarea_rows' => 20,
					'textarea_name' => $this->get_input_name(),
					'quicktags'     => true,
					'editor_class'    => 'wysiwyg-{{data.panel_id}}-'.$this->index,
				)
			);

			add_action( 'wp_tiny_mce_init', array( $this, 'render_tinymce_initilizaton_script' ) );
		} else {
			printf('<span class="panel-input-field"><textarea name="%s" rows="6" cols="40">%s</textarea></span>', $this->get_input_name(), $this->get_input_value() );
		}
	}

	public static function enqueue_styles() {
		wp_print_styles('editor-buttons');
	}

	public function render_tinymce_initilizaton_script( $settings ) {
		if ( empty(self::$first_mce_init_settings) ) {
			self::$first_mce_init_settings = reset($settings);
		}
		$id = $this->get_indexed_id();
		if ( !isset($settings[$id]) ) {
			return;
		}
		$settings = $settings[$id];
		$settings = wp_parse_args( $settings, self::$first_mce_init_settings );

		?><script type="text/javascript">
			(function($, tinymce) {
				var counter = 0;
				var generic_id = '<?php echo $id; ?>';
				if ( tinyMCEPreInit.mceInit.hasOwnProperty(generic_id) ) {
					delete tinyMCEPreInit.mceInit[generic_id];
				}
				if ( tinyMCEPreInit.qtInit.hasOwnProperty(generic_id) ) {
					delete tinyMCEPreInit.qtInit[generic_id];
				}

				var init_editor = function( row, uuid ) {
					var wysiwyg = row.find('textarea.wysiwyg-'+uuid+'-<?php echo $this->index; ?>');
					if ( wysiwyg.hasClass('wp-editor-initialized') ) {
						return;
					}
					var wysiwyg_id = 'panels-wysiwyg-'+uuid+'-<?php echo $this->index; ?>-'+counter;
					counter++;
					wysiwyg.attr('id', wysiwyg_id);
					wysiwyg.parents('.wp-editor-container').attr('id', 'wp-'+wysiwyg_id+'-editor-container');
					wysiwyg.parents( '.panel-input.input-type-textarea' ).find( '.add_media' ).data( 'editor', wysiwyg_id );

					var wrap = wysiwyg.parents('.wp-editor-wrap');

					wrap.attr('id', 'wp-'+wysiwyg_id+'-wrap');
					wrap.find('.wp-switch-editor.switch-html').attr('id', wysiwyg_id+'-html');
					wrap.find('.wp-switch-editor.switch-tmce').attr('id', wysiwyg_id+'-tmce');


					var settings = <?php echo $this->build_js_settings_string($settings); ?>;
					settings.body_class = wysiwyg_id;
					settings.selector = '#'+wysiwyg_id;

					var qt_settings = {id:wysiwyg_id,buttons:"strong,em,link,block,del,ins,img,ul,ol,li,code,more,close"};

					try {
						settings = tinymce.extend( {}, tinyMCEPreInit.ref, settings );
						tinyMCEPreInit.mceInit[wysiwyg_id] = settings;
						tinyMCEPreInit.qtInit[wysiwyg_id] = qt_settings;
						quicktags( tinyMCEPreInit.qtInit[wysiwyg_id] ); // sets up the quick tags toolbar
						QTags._buttonsInit(); // adds buttons to the new quick tags toolbar

						if ( wrap.hasClass('tmce-active') ) {
							switchEditors.go( wysiwyg_id, 'tmce' );
						}

						if ( ! window.wpActiveEditor ) {
							window.wpActiveEditor = wysiwyg_id;
						}

						document.getElementById( 'wp-' + wysiwyg_id + '-wrap' ).onclick = function() {
							window.wpActiveEditor = this.id.slice( 3, -5 );
						}
					} catch(e){}
				};

				var panels_div = $('div.panels');
				panels_div.on('new-panel-row load-panel-row', '.panel-row', function(e, uuid) {
					var row = $(this);
					if ( row.data('panel_id') != uuid ) {
						return;
					}
					var wysiwyg = row.find('textarea.wysiwyg-'+uuid+'-<?php echo $this->index; ?>');
					if ( wysiwyg.length < 1 ) {
						return;
					}
					init_editor(row, uuid);
				});
				panels_div.on('new-panel-repeater-row', '.panel-repeater-row', function(e, uuid) {
					var row = $(this);
					var wysiwyg = row.find('textarea.wysiwyg-'+uuid+'-<?php echo $this->index; ?>');
					if ( wysiwyg.length < 1 ) {
						return;
					}
					init_editor(row, uuid);
				});
			})(jQuery, tinymce);
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

	public function get_vars( $data, $panel ) {
		$text = parent::get_vars( $data, $panel );
		if ( $this->richtext && apply_filters( 'apply_the_content_filters_to_panel_builder_wysiwygs', TRUE, $this, $panel ) ) {
			$text = apply_filters( 'the_content', $text );
		}
		return $text;
	}
}
