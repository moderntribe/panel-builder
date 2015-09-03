<?php


namespace ModularContent;

/**
 * Class PanelViewFinder
 *
 * @package ModularContent
 *
 * Locates templates for panels
 *
 * Each panel type should have a PanelViewFinder (which can be shared).
 * This tells the template system where to look for the template file.
 */
class PanelViewFinder extends ViewFinder {
	/**
	 * Get the path to the template file for the given panel type
	 *
	 * @param string $panel_type
	 *
	 * @return string|bool The absolute path to the template,
	 *                     or FALSE if not found.
	 */
	public function get_template_file_path( $panel_type ) {
		$basename = sprintf( '%s.php', $panel_type );
		$file     = $this->locate_theme_file( $basename );
		if ( empty( $file ) ) {
			$file = $this->get_default_view();
		}

		return apply_filters( 'panels_panel_template', $file, $panel_type );
	}

	/**
	 * @return string|bool The absolute path to the default template,
	 *                     or FALSE if not found
	 */
	public function get_default_view() {
		$basename = 'default.php';
		$viewfinder = new ViewFinder(Plugin::plugin_path('public-views'));
		return $viewfinder->locate_theme_file( $basename, Plugin::plugin_path('public-views') );
	}
} 