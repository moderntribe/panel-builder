<?php

namespace ModularContent\Fields;

class TextArea extends Field {
	protected $richtext = FALSE;
	protected static $global_index = 0;
	protected $index = 0;

	public function __construct( $args = array() ) {
		$this->defaults['richtext'] = $this->richtext;
		parent::__construct($args);
		$this->index = self::$global_index++;
	}


	public function render_field() {
		if ( $this->richtext ) {
			wp_editor(
				$this->get_input_value(),
				$this->get_id(),
				array(
					'textarea_rows' => 20,
					'textarea_name' => $this->get_input_name(),
					'quicktags'     => false,
					'editor_class'    => 'wysiwyg-{{data.panel_id}}-'.$this->index,
				)
			);

			add_action( 'wp_tiny_mce_init', array( $this, 'render_tinymce_initilizaton_script' ) );
		} else {
			printf('<span class="panel-input-field"><textarea name="%s" rows="6" cols="40">%s</textarea></span>', $this->get_input_name(), $this->get_input_value() );
		}
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

				var init_editor = function( row, uuid ) {
					var wysiwyg = row.find('textarea.wysiwyg-'+uuid+'-<?php echo $this->index; ?>');
					if ( wysiwyg.hasClass('wp-editor-initialized') ) {
						return;
					}
					var wysiwyg_id = 'panels-wysiwyg-'+uuid+'-<?php echo $this->index; ?>-'+counter;
					counter++;
					wysiwyg.attr('id', wysiwyg_id);
					wysiwyg.parents('.wp-editor-container').attr('id', 'wp-'+wysiwyg_id+'-editor-container');
					wysiwyg.parents('.wp-editor-wrap').attr('id', 'wp-'+wysiwyg_id+'-wrap');

					var settings = {
						"selector":"#"+wysiwyg_id,
						"resize":"<?php echo $settings['resize']; ?>",
						"menubar":<?php echo $settings['menubar']?'true':'false'; ?>,
						"wpautop":<?php echo $settings['wpautop']?'true':'false'; ?>,
						"indent":<?php echo $settings['indent']?'true':'false'; ?>,
						"toolbar1":"<?php echo $settings['toolbar1']; ?>",
						"toolbar2":"<?php echo $settings['toolbar2']; ?>",
						"toolbar3":"<?php echo $settings['toolbar3']; ?>",
						"toolbar4":"<?php echo $settings['toolbar4']; ?>",
						"tabfocus_elements":"<?php echo $settings['tabfocus_elements']; ?>",
						"body_class":wysiwyg_id
					};

					try {
						tinymce.init( settings );
						wysiwyg.addClass('wp-editor-initialized');

						if ( ! window.wpActiveEditor ) {
							window.wpActiveEditor = wysiwyg_id;
						}

						document.getElementById( 'wp-' + wysiwyg_id + '-wrap' ).onclick = function() {
							window.wpActiveEditor = this.id.slice( 3, -5 );
						}
					} catch(e){}
				}

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
}
