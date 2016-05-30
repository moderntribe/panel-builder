<?php


namespace ModularContent\Preview;


use ModularContent\Loop;

class Preview_Loop extends Loop {
	public function is_preview() {
		return true;
	}
}