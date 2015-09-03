<?php


namespace ModularContent;

/**
 * Class PanelRenderer
 *
 * @package ModularContent
 *
 * Renders a panel
 */
class PanelRenderer {
	/** @var Panel */
	protected $panel = NULL;

	public function __construct( Panel $panel ) {
		$this->panel = $panel;
	}

	public function render() {
		$loop = Plugin::instance()->loop();
		$current = $loop->get_the_panel();
		if ( $this->panel !== $current ) {
			// if we're overriding the current loop panel, let the loop know
			$loop->set_the_panel($this->panel);
		}
		$template = $this->panel->get_type_object()->get_template_path();
		$template = apply_filters( 'panel_template_path', $template, $this->panel );
		if ( empty($template) ) {
			return '';
		}
		ob_start();
		include($template);
		$output = ob_get_clean();
		if ( $this->panel !== $current ) {
			// put the loop back where we found it
			$loop->set_the_panel();
		}
		return $this->wrap($output);
	}

	/**
	 * @param string $content
	 * @return string
	 */
	protected function wrap( $content ) {
		$template = $this->get_wrapper_template_path();
		if ( !$template ) {
			return $content;
		}
		return $this->include_wrapper_template( $template, $content );
	}

	protected function get_wrapper_template_path() {
		$viewfinder    = new ViewFinder( Plugin::plugin_path( 'public-views' ) );
		$template_file = $viewfinder->locate_theme_file( 'panel-wrapper.php' );

		$template_file = apply_filters( 'panels_panel_wrapper_template', $template_file, $viewfinder );

		return $template_file;
	}

	protected function include_wrapper_template( $template_path, $html ) {
		static $index = 0;
		$panel = $this->panel;
		ob_start();
		include( $template_path );
		$template = ob_get_clean();
		$index++;
		return $template;
	}
} 