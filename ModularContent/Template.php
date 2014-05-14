<?php


namespace ModularContent;


class Template {
	private $template_path = '';

	protected static $panel = array(); // The variables for the currently rendering panel
	protected static $settings = array(); // The settings for the currently rendering panel

	public function __construct( $template = '' ) {
		if ( $template ) {
			$this->set_template($template);
		}
	}

	public function set_template( $template ) {
		$this->template_path = $template;
	}

	/**
	 * @param array $panel An array of variables passed from panel inputs
	 * @param array $settings The raw settings for the panel's inputs
	 * @throws \RuntimeException
	 */
	public function render( $panel, $settings ) {
		self::setup_vars($panel, $settings);
		if ( !file_exists($this->template_path) ) {
			throw new \RuntimeException(sprintf(__('Template not found: %s', 'panels'), $this->template_path));
		}
		include($this->template_path);
	}

	public static function get_var( $var ) {
		if ( isset(self::$panel[$var]) ) {
			return self::$panel[$var];
		}
		return NULL;
	}

	public static function get_settings( $field ) {
		if ( isset(self::$settings[$field]) ) {
			return self::$settings[$field];
		}
		return NULL;
	}

	protected static function setup_vars( $vars, $settings ) {
		self::$panel = $vars;
		self::$settings = $settings;
	}
} 