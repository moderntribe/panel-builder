<?php
namespace AJAXQueue;

/**
 * Class Core
 *
 * @package AJAXQueue
 */
class Core {

	/**
	 * Default name of the AJAX action to handle the queue
	 */
	const ACTION = 'AJAXQueue';

	/**
	 * Instance of our main Queue Handler
	 *
	 * @var QueueHandler
	 */
	static $queue_handler = null;

	/**
	 * Instance of our Resources handler
	 *
	 * @var Resources
	 */
	static $resources = null;

	/**
	 * Start the show!
	 */
	public static function init() {

		/**
		 * Filter the default action name for handling the AJAX Queue
		 *
		 * @since 1.0.0
		 *
		 * @param string $action Name of the action
		 */
		$action = apply_filters( 'tribe-ajax-queue-default-action', self::ACTION );

		self::$queue_handler = new QueueHandler( $action );
		self::$resources     = new Resources( $action );

	}

}