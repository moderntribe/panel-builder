<?php


namespace ModularContent;


class PanelRenderer {
	/** @var Panel */
	protected $panel = NULL;

	public function __construct( Panel $panel ) {
		$this->panel = $panel;
	}

	public function render() {
		$loop = Plugin::instance()->loop();
		$loop->set_the_panel($this->panel);
		$template = $this->panel->get_type_object()->get_template_path();
		if ( empty($template) ) {
			return '';
		}
		ob_start();
		include($template);
		$output = ob_get_clean();
		$loop->set_the_panel();
		return $output;
	}

	/**
	 * @param string $content
	 * @return string
	 */
	protected function wrap( $content ) {
		$template = $this->get_wrapper_template();
		$content = str_replace('[content]', $content, $template);
		return $content;
	}

	protected function get_wrapper_template() {
		$viewfinder = new ViewFinder(Plugin::plugin_path('public-views'));
		$template_file = $viewfinder->locate_theme_file('panel-wrapper.php');
		if ( empty($template_file) ) {
			return '';
		}
		return $this->include_wrapper_template($template_file);
	}

	protected function include_wrapper_template( $template_path ) {
		static $index = 0;
		$panel = $this->panel;
		ob_start();
		include( $template_path );
		$template = ob_get_clean();
		$index++;
		return $template;
	}
} 