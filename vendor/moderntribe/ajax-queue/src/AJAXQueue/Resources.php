<?php
namespace AJAXQueue;


/**
 * Class Resources
 *
 * @package AJAXQueue
 */
class Resources {

	/**
	 * Name of the action to send in the JS data
	 *
	 * @var string
	 */
	protected $action = '';

	/**
	 * Adds the hook to enqueue the resources
	 *
	 * @param string $action Name of the action that's going to be used for handling the AJAX calls
	 */
	public function __construct( $action ) {
		$this->action = $action;
		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue' ] );
	}

	/**
	 * Enqueues the main JS that adds the AJAXQueue functionality
	 */
	public function enqueue() {
		$url = plugins_url( 'resources/js/AJAXQueue.js', dirname( dirname( __FILE__ ) ) );
		wp_enqueue_script( 'AJAXQueue', $url, [ 'jquery' ] );

		wp_localize_script( 'AJAXQueue', 'AJAXQueueData', [
			'ajax_url' => admin_url( 'admin-ajax.php' ),
			'action'   => $this->action
		] );
	}
}