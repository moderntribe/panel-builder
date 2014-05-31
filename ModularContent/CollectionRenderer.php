<?php


namespace ModularContent;


class CollectionRenderer {
	/** @var PanelCollection */
	protected $collection = NULL;

	public function __construct( PanelCollection $collection ) {
		$this->collection = $collection;
	}

	public function render() {
		$panels = $this->render_panels();
		$wrapped = $this->wrap($panels);
		return $wrapped;
	}

	protected function render_panels() {
		$loop = Plugin::instance()->loop();
		$loop->reset( $this->collection );
		$rendered = '';
		while ( $loop->have_panels() ) {
			$loop->the_panel();
			$panel = $loop->get_the_panel();
			$rendered .= $panel->render();
		}
		return $rendered;
	}

	/**
	 * @param string $content
	 * @return string
	 */
	protected function wrap( $content ) {
		$template = $this->get_wrapper_template();
		$content = str_replace('[panels]', $content, $template);
		return $content;
	}

	protected function get_wrapper_template() {
		$viewfinder = new ViewFinder(Plugin::plugin_path('public-views'));
		$template_file = $viewfinder->locate_theme_file('collection-wrapper.php');
		if ( empty($template_file) ) {
			return '';
		}
		ob_start();
		include($template_file);
		return ob_get_clean();
	}
} 