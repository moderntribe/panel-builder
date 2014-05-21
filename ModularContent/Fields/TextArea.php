<?php

namespace ModularContent\Fields;

class TextArea extends Field {
	protected $richtext = FALSE;

	public function __construct( $args = array() ) {
		$this->defaults['richtext'] = $this->richtext;
		parent::__construct($args);
	}


	public function render_field() {
		if ( $this->richtext ) {
			wp_editor(
				$this->get_input_value(),
				$this->get_id(),
				array(
					'textarea_rows' => 20,
					'textarea_name' => $this->get_input_name(),
					'quicktags'     => false
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
				var generic_id = '<?php echo $this->get_id(); ?>';
				if ( tinyMCEPreInit.mceInit.hasOwnProperty(generic_id) ) {
					delete tinyMCEPreInit.mceInit[generic_id];
				}

				var panels_div = $('div.panels');
				panels_div.on('new-panel-row load-panel-row', '.panel-row', function(e, uuid) {
					var row = $(this);
					var wysiwyg_id = uuid+'_<?php echo $this->esc_class($this->name); ?>';
					var wysiwyg = row.find('#'+wysiwyg_id);
					if ( wysiwyg.length < 1 ) {
						return;
					}

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

						if ( ! window.wpActiveEditor ) {
							window.wpActiveEditor = wysiwyg_id;
						}

						document.getElementById( 'wp-' + wysiwyg_id + '-wrap' ).onclick = function() {
							window.wpActiveEditor = this.id.slice( 3, -5 );
						}
					} catch(e){}
				});
			})(jQuery, tinymce);
		</script>
		<?php
	}

	protected function get_id( $uuid = '{{data.panel_id}}' ) {
		return $uuid.'_'.$this->esc_class($this->name);
	}
}
