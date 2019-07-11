<?php

namespace ModularContent\Fields;

use Codeception\TestCase\WPTestCase;

class Toggle_Test extends WPTestCase {

	public function test_blueprint() {
		$label       = __CLASS__ . '::' . __FUNCTION__;
		$name        = __FUNCTION__;
		$description = __FUNCTION__ . ':' . __LINE__;
		$field       = new Toggle( [
			'label'       => $label,
			'name'        => $name,
			'description' => $description,
			'default'     => 0,
			'stylized'    => false,
		] );

		$blueprint = $field->get_blueprint();

		$expected = [
			'type'                   => 'Toggle',
			'label'                  => $label,
			'name'                   => $name,
			'description'            => $description,
			'strings'                => [],
			'default'                => 0,
			'options'                => [
				[
					'label' => 'Enabled',
					'value' => '1',
				],
			],
			'stylized'               => false,
			'global_options'         => false,
			'enable_fonts_injection' => false,
		];

		$this->assertEquals( $expected, $blueprint );
	}
}