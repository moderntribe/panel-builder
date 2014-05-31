<?php


namespace ModularContent;


class PanelViewFinder extends ViewFinder {
	public function get_template_file_path( $panel_type ) {
		$basename = sprintf('%s.php', $panel_type);
		$file = $this->locate_theme_file( $basename );
		if ( $file ) {
			return $file;
		}
		return $this->get_default_view();
	}

	public function get_default_view() {
		$basename = 'default.php';
		$viewfinder = new ViewFinder(Plugin::plugin_path('public-views'));
		return $viewfinder->locate_theme_file( $basename, Plugin::plugin_path('public-views') );
	}
} 