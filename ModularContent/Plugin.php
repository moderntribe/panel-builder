<?php

namespace ModularContent;

class Plugin {
	/** @var self */
	private static $instance;

	private static $plugin_file = '';

	private $registry = NULL;
	private $metabox = NULL;

	protected function __construct() {
		$this->registry = new TypeRegistry();
		$this->metabox = new MetaBox();
	}

	public function registry() {
		return $this->registry;
	}

	public function metabox() {
		return $this->metabox;
	}

	private function setup() {
		add_action( 'init', array( $this, 'init_panels' ), 15, 0 );
		add_action( 'admin_enqueue_scripts', array( $this, 'register_admin_scripts' ), 0, 0 );
	}

	public function init_panels() {
		do_action( 'panels_init', $this->registry );
		if ( is_admin() ) {
			$this->metabox->add_hooks();
			foreach ( apply_filters('modular_content_post_types', array('post')) as $post_type ) {
				add_action('add_meta_boxes_'.$post_type, array($this->metabox, 'register_meta_box'), 10, 0);
			}
		}
	}

	public function register_admin_scripts() {
		wp_register_script( 'select2', self::plugin_url('lib/select2/select2.min.js'), array('jquery'), '3.2', TRUE );
		wp_register_style( 'select2', self::plugin_url('lib/select2/select2.css'), array(), '3.2' );
		wp_register_style( 'font-awesome', self::plugin_url('lib/Font-Awesome/css/font-awesome.css'), array());
	}


	/**
	 * Get the absolute system path to the plugin directory, or a file therein
	 * @static
	 * @param string $path
	 * @return string
	 */
	public static function plugin_path( $path ) {
		$base = dirname(self::$plugin_file);
		if ( $path ) {
			return trailingslashit($base).$path;
		} else {
			return untrailingslashit($base);
		}
	}

	/**
	 * Get the absolute URL to the plugin directory, or a file therein
	 * @static
	 * @param string $path
	 * @return string
	 */
	public static function plugin_url( $path ) {
		return plugins_url($path, self::$plugin_file);
	}

	/********** Singleton *************/

	/**
	 * Create the instance of the class
	 *
	 * @static
	 * @param string $plugin_file
	 * @return void
	 */
	public static function init( $plugin_file ) {
		self::$plugin_file = $plugin_file;
		self::$instance = self::instance();
		self::$instance->setup();
	}

	/**
	 * Get (and instantiate, if necessary) the instance of the class
	 * @static
	 * @return self
	 */
	public static function instance() {
		if ( !is_a(self::$instance, __CLASS__) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	final public function __clone() {
		trigger_error("Singleton. No cloning allowed!", E_USER_ERROR);
	}

	final public function __wakeup() {
		trigger_error("Singleton. No serialization allowed!", E_USER_ERROR);
	}
}
