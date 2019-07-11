<?php

namespace ModularContent\Fields;

use Codeception\TestCase\WPTestCase;

class Title_Test extends WPTestCase {
	public function test_blueprint() {
		$label = __CLASS__ . '::' . __FUNCTION__;
		$name = __FUNCTION__;
		$description = __FUNCTION__ . ':' . __LINE__;
		$default = __LINE__;
		$field = new Title( [
			'label'       => $label,
			'name'        => $name,
			'description' => $description,
			'default'     => $default,
		] );

		$blueprint = $field->get_blueprint();

		$expected = [
			'type'        => 'Title',
			'label'       => $label,
			'name'        => $name,
			'description' => $description,
			'strings'     => [],
			'default'     => $default,
			'input_width' => 12,
			'layout'      => 'full',
		];

		$this->assertEquals( $expected, $blueprint );
	}
}