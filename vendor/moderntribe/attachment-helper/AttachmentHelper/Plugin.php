<?php


namespace AttachmentHelper;


class Plugin {
	public static function init() {
		if ( defined('DOING_AJAX') && DOING_AJAX ) {
			\AttachmentHelper\Ajax_Handler::init();
		}
	}
}