<?php

namespace ModularContent\Fields;
use ModularContent\Panel;

class TextArea extends Field {
	protected $richtext = FALSE;
	protected static $global_index = 0;
	protected $index = 0;

	public function __construct( $args = array() ) {
		$this->defaults['richtext'] = $this->richtext;
		parent::__construct($args);
		$this->index = self::$global_index++;

		// slight chance that this ends up with a harmless enqueued style, but no
		// better place to put it to ensure that WP doesn't print the styles in
		// the middle of a JS template
		add_action( 'before_panel_meta_box', array( __CLASS__, 'enqueue_styles' ) );
	}


	public function render_field() {
		if ( $this->richtext ) {
			wp_editor(
				$this->get_input_value(),
				$this->get_id(),
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
		$id = $this->get_id();
		if ( !isset($settings[$id]) ) {
			return;
		}
		$settings = $settings[$id];
		?><script type="text/javascript">
			(function($, tinymce) {
				var counter = 0;
				var generic_id = '<?php echo $this->get_id(); ?>';
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

					wrap.addClass('tmce-active').removeClass('html-active');
					wrap.attr('id', 'wp-'+wysiwyg_id+'-wrap');
					wrap.find('.wp-switch-editor.switch-html').attr('id', wysiwyg_id+'-html');
					wrap.find('.wp-switch-editor.switch-tmce').attr('id', wysiwyg_id+'-tmce');


					var settings = {
						"body_class":wysiwyg_id,
						"indent":<?php echo $settings['indent']?'true':'false'; ?>,
						"menubar":<?php echo $settings['menubar']?'true':'false'; ?>,
						"resize":"<?php echo $settings['resize']; ?>",
						"selector":"#"+wysiwyg_id,
						"tabfocus_elements":"<?php echo $settings['tabfocus_elements']; ?>",
						"toolbar1":"<?php echo $settings['toolbar1']; ?>",
						"toolbar2":"<?php echo $settings['toolbar2']; ?>",
						"toolbar3":"<?php echo $settings['toolbar3']; ?>",
						"toolbar4":"<?php echo $settings['toolbar4']; ?>",
						"wpautop":<?php echo $settings['wpautop']?'true':'false'; ?>
					};

					var qt_settings = {id:wysiwyg_id,buttons:"strong,em,link,block,del,ins,img,ul,ol,li,code,more,close"};

					try {
						tinyMCEPreInit.mceInit[wysiwyg_id] = settings;
						tinyMCEPreInit.qtInit[wysiwyg_id] = qt_settings;
						settings = tinymce.extend( {}, tinyMCEPreInit.ref, settings );
						tinymce.init( settings );
						quicktags( tinyMCEPreInit.qtInit[wysiwyg_id] ); // sets up the quick tags toolbar
						QTags._buttonsInit(); // adds buttons to the new quick tags toolbar
						wysiwyg.addClass('wp-editor-initialized');
						wrap.addClass('tmce-active');
						if ( wrap.hasClass('html-active') ) {
							switchEditors.switchto(wrap.find('.wp-switch-editor.switch-html')[0]);
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

	protected function get_id( $uuid = '{{data.panel_id}}' ) {
		return $uuid.'_'.$this->esc_class($this->name);
	}

	public function get_vars( $data, $panel ) {
		$text = parent::get_vars( $data, $panel );
		if ( $this->richtext && apply_filters( 'apply_the_content_filters_to_panel_builder_wysiwygs', TRUE, $this, $panel ) ) {
			$text = apply_filters( 'the_content', $text );
		}
		return $text;
	}
}
