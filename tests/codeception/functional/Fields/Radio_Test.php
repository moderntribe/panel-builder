<?php

namespace ModularContent\Fields;

use Codeception\TestCase\WPTestCase;

class Radio_Test extends WPTestCase {
	public function test_blueprint() {
		$label = __CLASS__ . '::' . __FUNCTION__;
		$name = __FUNCTION__;
		$description = __FUNCTION__ . ':' . __LINE__;
		$field = new Radio( [
			'label'       => $label,
			'name'        => $name,
			'description' => $description,
			'default'     => 'second',
			'options'     => [
				'first'  => 'First Option',
				'second' => 'Second Option',
			],
		] );

		$blueprint = $field->get_blueprint();

		$expected = [
			'type'        => 'Radio',
			'label'       => $label,
			'name'        => $name,
			'description' => $description,
			'strings'     => [ ],
			'default'     => 'second',
			'options'     => [
				[
					'label' => 'First Option',
					'value' => 'first',
				],
				[
					'label' => 'Second Option',
					'value' => 'second',
				],
			],
		];

		$this->assertEquals( $expected, $blueprint );
	}
}