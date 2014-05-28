<?php


namespace ModularContent\Fields;


class Video extends Text {
	public function render_field() {
		printf('<span class="panel-input-field"><input type="text" class="video-url" name="%s" value="%s" size="40" /></span>', $this->get_input_name(), $this->get_input_value());
		wp_enqueue_script( 'modular-content-video-field', \ModularContent\Plugin::plugin_url('assets/js/video-field.js'), array('jquery', 'wp-util'), FALSE, TRUE );
	}
}