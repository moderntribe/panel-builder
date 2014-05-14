<?php

class Image_Upload_Helper {
	const TEXT_DOMAIN = 'Image_Upload_Helper';
	const VERSION = 1.3;

	public static function init() {
		add_action('admin_enqueue_scripts', array(__CLASS__, 'register_scripts'), 0, 1);
		add_action('wp_ajax_image_upload_helper_image', array(__CLASS__, 'print_image_html'), 10, 0);
		add_filter('get_media_item_args', array(__CLASS__, 'filter_media_item_args'), 10, 1);
		add_filter('media_upload_tabs', array(__CLASS__, 'filter_media_upload_tabs'), 10, 1);
	}

	public static function register_scripts( $context  = '') {
		wp_register_script('image-upload-helper', self::plugin_url('resources/admin-scripts.js'), array('jquery', 'thickbox', 'media-upload'), self::VERSION, TRUE);
		wp_register_script('image-upload-helper-popup', self::plugin_url('resources/media-upload-popup.js'), array('jquery'), self::VERSION, TRUE);
		add_action('admin_print_scripts', array(__CLASS__, 'print_js_settings'), 0, 0);
		if ( $context == 'media-upload-popup' ) {
			if ( isset($_REQUEST['image-upload-helper']) ) {
				wp_enqueue_script('image-upload-helper-popup');
			}
		} else {
			wp_enqueue_script('image-upload-helper');
			wp_enqueue_style('thickbox');
		}
	}

	public static function print_js_settings() {
		$short_label = !empty($_REQUEST['image-upload-helper'])?$_REQUEST['image-upload-helper']:self::__('thumbnail image');
		$label = sprintf(self::__('Use as %s'), $short_label);
		echo '<script type="text/javascript">';
		echo 'ImageUploadHelper = {
			label: "'.$label.'",
			short_label: "'.$short_label.'"
		};';
		echo '</script>';
	}

	public static function print_image_html() {
		global $post_ID;
		$helper = new self();
		$args = array();
		foreach ( array('thumbnail_id', 'label', 'size', 'field_name') as $arg ) {
			if ( !empty($_REQUEST[$arg]) ) {
				$args[$arg] = $_REQUEST[$arg];
			}
		}
		if ( empty($args['thumbnail_id']) ) {
			status_header(404);
			exit();
		}
		if ( !empty($_REQUEST['post_ID']) ) {
			$post_ID = $_REQUEST['post_ID'];
		}
		echo $helper->thumbnail_html($args);
		exit();
	}

	public static function filter_media_item_args( $args ) {
		if ( !empty($_REQUEST['image-upload-helper']) ) {
			$args['send'] = TRUE;
		}
		return $args;
	}

	public static function filter_media_upload_tabs( $tabs ) {
		if ( !empty($_REQUEST['image-upload-helper']) && isset($tabs['type_url']) ) {
			unset($tabs['type_url']);
		}
		return $tabs;
	}

	/**
	 * Return $string after translating it with the plugin's text domain
	 * @static
	 * @param string $string
	 * @return string|void
	 */
	protected static function __( $string ) {
		return __( $string, self::TEXT_DOMAIN );
	}

	/**
	 * Echo $string after translating it with the plugin's text domain
	 *
	 * @static
	 * @param string $string
	 * @return void
	 */
	protected static function _e( $string ) {
		_e( $string, self::TEXT_DOMAIN );
	}

	/**
	 * Get the absolute system path to the plugin directory, or a file therein
	 * @static
	 * @param string $path
	 * @return string
	 */
	protected static function plugin_path( $path ) {
		$base = dirname( __FILE__ );
		if ( $path ) {
			return trailingslashit( $base ) . $path;
		} else {
			return untrailingslashit( $base );
		}
	}

	/**
	 * Get the absolute URL to the plugin directory, or a file therein
	 * @static
	 * @param string $path
	 * @return string
	 */
	protected static function plugin_url( $path ) {
		return plugins_url( $path, __FILE__ );
	}

	public function __construct() {
		self::init();
	}

	/**
	 * Output HTML for the image helper.
	 *
	 * @since 2.9.0
	 *
	 * @param array $args
	 * @return string html
	 */
	public function thumbnail_html( $args = array() ) {
		global $content_width;
		$defaults = array(
			'label' => 'thumbnail image',
			'thumbnail_id' => NULL,
			'size' => 'thumbnail',
			'field_name' => 'image-upload-helper',
		);
		$args = wp_parse_args($args, $defaults);

		/**
		 * @var string $thumbnail_id
		 * @var string $label
		 * @var string $size
		 * @var string $field_name
		 */
		extract($args);

		// hack to make sure our query args get added before TB_iframe so they get passed on
		$url = remove_query_arg('TB_iframe', get_upload_iframe_src('image'));
		$url = add_query_arg(array('image-upload-helper' => urlencode($label)), $url);
		$url = add_query_arg(array('TB_iframe' => true), $url);
		$set_thumbnail_link = '<p class="hide-if-no-js"><a title="' . esc_attr__( sprintf(self::__('Set %s'), $label) ) . '" href="' . esc_url( $url ) . '" class="thickbox image-upload-helper-set">%s</a></p>';
		$content = sprintf($set_thumbnail_link, sprintf(self::__('Set <span class="image-upload-helper-label">%s</span>'), esc_html($label)) );

		if ( $thumbnail_id && get_post( $thumbnail_id ) ) {
			$old_content_width = $content_width;
			$content_width = 266;
			$thumbnail_html = wp_get_attachment_image( $thumbnail_id, $size );
			if ( !empty( $thumbnail_html ) ) {
				$content = sprintf($set_thumbnail_link, $thumbnail_html);
				$content .= '<p class="hide-if-no-js"><a href="#" class="image-upload-helper-remove">' . sprintf(self::__('Remove <span class="image-upload-helper-label">%s</span>'), esc_html($label)) . '</a></p>';
			}
			$content_width = $old_content_width;
		}
		$content .= sprintf('<input type="hidden" name="%s" value="%d" class="image-upload-helper-input" />', $field_name, $thumbnail_id);
		$content .= sprintf('<input type="hidden" disabled="disabled" value="%s" class="image-upload-helper-size" />', $size);
		$content = '<div class="image-upload-helper">'.$content.'</div>';
		return apply_filters( 'image_upload_helper_html', $content );
	}
}
