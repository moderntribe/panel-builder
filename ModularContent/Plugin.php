<?php

namespace ModularContent;

/**
 * Class Plugin
 *
 * @package ModularContent
 *
 * Responsible for setting up the plugin and hooking into WordPress
 */
class Plugin {
	/** @var self */
	private static $instance;

	private static $plugin_file = '';

	private $registry = NULL;
	private $metabox = NULL;
	private $loop = NULL;
	private $name = array(
		'singular' => '',
		'plural' => '',
	);

	protected function __construct() {
		$this->name = array(
			'singular' => apply_filters('modular_content_singular_label', __('Module', 'modular_content')),
			'plural' => apply_filters('modular_content_plural_label', __('Modules', 'modular_content')),
		);
		$this->registry = new TypeRegistry();
		$this->metabox = new MetaBox();
	}

	public function registry() {
		return $this->registry;
	}

	public function metabox() {
		return $this->metabox;
	}

	public function loop() {
		if ( !isset($this->loop) ) {
			$panels = NULL;

			$current_post =  get_queried_object();

			if ( $current_post && isset($current_post->post_type) && post_type_supports( $current_post->post_type, 'modular-content' ) ) {

				if ( is_preview() ) {
					$autosave = wp_get_post_autosave( get_the_ID() );
					if ( $autosave ) {
						$current_post = $autosave;
					}
				}

				$panels = PanelCollection::find_by_post_id( $current_post->ID );
			}
			$this->loop = new Loop($panels);
		}
		return $this->loop;
	}

	private function setup() {
		add_action( 'init', array( $this, 'init_panels' ), 15, 0 );
		add_action( 'admin_enqueue_scripts', array( $this, 'register_admin_scripts' ), 0, 0 );
	}

	public function init_panels() {
		require_once(self::plugin_path('template-tags.php'));
		add_post_type_support( 'post', 'modular-content' );
		add_filter( 'the_content', array( $this, 'filter_the_content' ), 100, 1 );
		add_action( 'the_panels', array( $this, 'do_the_panels' ), 10, 0 );
		add_action( 'pre_get_posts', array( $this, 'filter_search_queries' ) );
		$this->wrap_kses();
		do_action( 'panels_init', $this->registry );
		if ( is_admin() ) {
			$this->metabox->add_hooks();
			$post_types = $this->supported_post_types();
			foreach ( $post_types as $post_type ) {
				add_action('add_meta_boxes_'.$post_type, array($this->metabox, 'register_meta_box'), 10, 0);
			}
		}
	}

	public function supported_post_types() {
		$output = array();
		$post_types = get_post_types();
		foreach ( $post_types as $pt ) {
			if ( post_type_supports( $pt, 'modular-content' ) ) {
				$output[] = $pt;
			}
		}
		return $output;
	}

	public function register_admin_scripts() {
		wp_register_script( 'select2', self::plugin_url('lib/select2/select2.min.js'), array('jquery'), '3.4.8', TRUE );
		wp_register_style( 'select2', self::plugin_url('lib/select2/select2.css'), array(), '3.4.8' );
		wp_register_style( 'font-awesome', self::plugin_url('lib/Font-Awesome/css/font-awesome.css'), array());
	}

	public function do_the_panels() {
		$this->do_not_filter_the_content();
		echo $this->get_the_panels();

		remove_action( 'the_panels', array( $this, 'do_the_panels' ), 10, 0 );
		add_action( 'the_panels', '__return_null', 10, 0 );
	}

	public function get_the_panels() {
		$loop = $this->loop();
		return $loop->render();
	}

	public function filter_the_content( $content = '' ) {
		$this->do_not_filter_the_content();
		return $content.$this->get_the_panels();
	}

	public function do_not_filter_the_content() {
		add_filter( 'the_content', array( $this, 'passthrough' ), 100, 1 );
		remove_filter( 'the_content', array( $this, 'filter_the_content' ), 100, 1 );
	}

	/**
	 * @param \WP_Query $query
	 *
	 * @return void
	 */
	public function filter_search_queries( $query ) {
		if ( $query->get( 's' ) && $query->get( 'panel_search_filter', NULL ) !== FALSE ) {
			if ( apply_filters( 'include_panels_in_search_queries', true, $query ) ) {
				$filter = new SearchFilter( $query );
				$filter->set_hooks();
			}
		}
	}

	protected function wrap_kses() {
		if ( has_filter( 'content_filtered_save_pre', 'wp_filter_post_kses' ) ) {
			remove_filter('content_filtered_save_pre', 'wp_filter_post_kses');
			add_filter( 'content_filtered_save_pre', array( Kses::instance(), 'filter_content_filtered' ), 10, 1 );
		}
	}

	public function passthrough( $var ) {
		return $var;
	}

	public function get_label( $quantity = 'singular' ) {
		return ( $quantity == 'plural' ) ? $this->name['plural'] : $this->name['singular'];
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
