<?php


namespace ModularContent\Admin;


class Scripts {
	/**
	 * @var string Path to the plugin assets directory
	 */
	private $directory;

	/**
	 * @var string The asset build version
	 */
	private $version;

	/**
	 * @var JS_Config
	 */
	private $config;

	public function __construct( $asset_directory, $version, JS_Config $config ) {
		$this->directory    = trailingslashit( $asset_directory );
		$this->version      = $version;
		$this->config       = $config;
	}

	/**
	 * @action admin_enqueue_scripts
	 */
	public function enqueue_scripts() {
		$admin_scripts     = 'master.js';

		$admin_src     = $this->directory . 'ui/dist/' . $admin_scripts;

		wp_register_script( 'panels-admin-scripts', $admin_src, [
			'wp-util',
			'media-upload',
			'media-views',
			'wp-i18n',
			'wp-editor',
			'wp-element',
			'wp-blocks',
			'wp-plugins',
			'wp-components',
		], $this->version, true );
		wp_localize_script( 'panels-admin-scripts', 'panels_admin_config', $this->config->get_data() );

		wp_enqueue_script( 'panels-admin-scripts' );
	}
}