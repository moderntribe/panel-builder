<?php

namespace ModularContent\Fields;

use Codeception\TestCase\WPTestCase;

class Color_Picker_Test extends WPTestCase {

	public function test_blueprint() {
		$label       = __CLASS__ . '::' . __FUNCTION__;
		$name        = __FUNCTION__;
		$description = __FUNCTION__ . ':' . __LINE__;
		$default     = __LINE__;
		$swatches    = [ '#CCCCCC' ];
		$field       = new Color_Picker( [
			'label'        => $label,
			'name'         => $name,
			'description'  => $description,
			'default'      => $default,
			'swatches'     => $swatches,
			'input_active' => false,
		] );

		$blueprint = $field->get_blueprint();

		$expected = [
			'type'         => 'Color_Picker',
			'label'        => $label,
			'name'         => $name,
			'description'  => $description,
			'strings'      => [
				'input.placeholder' => 'enter hex code',
			],
			'default'      => $default,
			'swatches'     => $swatches,
			'input_active' => false,
		];

		$this->assertEquals( $expected, $blueprint );
	}
}