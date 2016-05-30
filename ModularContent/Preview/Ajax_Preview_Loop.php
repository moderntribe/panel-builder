<?php


namespace ModularContent\Preview;

class Ajax_Preview_Loop extends Preview_Loop {

	/**
	 * @param string $panels
	 * @return string
	 */
	protected function wrap( $panels ) {
		return $panels;
	}
}