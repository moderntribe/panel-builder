<?php

namespace ModularContent\Fields;

use Codeception\TestCase\WPTestCase;

class Image_Test extends WPTestCase {
	public function test_blueprint() {
		$label = __CLASS__ . '::' . __FUNCTION__;
		$name = __FUNCTION__;
		$description = __FUNCTION__ . ':' . __LINE__;
		$default = __LINE__;
		$field = new Image( [
			'label'       => $label,
			'name'        => $name,
			'description' => $description,
			'default'     => $default,
		] );

		$blueprint = $field->get_blueprint();

		$expected = [
			'type'        => 'ModularContent\Fields\Image',
			'label'       => $label,
			'name'        => $name,
			'description' => $description,
			'strings'     => [ ],
			'default'     => $default,
			'size'        => 'thumbnail',
		];

		$this->assertEquals( $expected, $blueprint );
	}
}