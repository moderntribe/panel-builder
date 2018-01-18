<?php

namespace ModularContent\Fields;

use Codeception\TestCase\WPTestCase;

class Checkbox_Test extends WPTestCase {

	public function test_blueprint() {
		$label       = __CLASS__ . '::' . __FUNCTION__;
		$name        = __FUNCTION__;
		$description = __FUNCTION__ . ':' . __LINE__;
		$field       = new Checkbox( [
			'label'        => $label,
			'name'         => $name,
			'description'  => $description,
			'default'      => [ 'second' => 1 ],
			'options'      => [
				'first'  => 'First Option',
				'second' => 'Second Option',
			],
			'layout'       => 'horizontal',
			'option_width' => 8,
		] );

		$blueprint = $field->get_blueprint();

		$expected = [
			'type'         => 'Checkbox',
			'label'        => $label,
			'name'         => $name,
			'description'  => $description,
			'strings'      => [],
			'default'      => (object) [ 'second' => 1 ],
			'options'      => [
				[
					'label' => 'First Option',
					'value' => 'first',
				],
				[
					'label' => 'Second Option',
					'value' => 'second',
				],
			],
			'layout'       => 'horizontal',
			'option_width' => 8,
		];

		$this->assertEquals( $expected, $blueprint );
	}

	public function test_layout_error() {
		$valid = true;

		try {
			new Checkbox( [
				'layout'       => 'foobar',
			] );
		} catch ( \LogicException $e ) {
			$valid = false;
		}

		$this->assertFalse( $valid );
	}

	public function test_option_width_error() {
		$valid = true;

		try {
			new Checkbox( [
				'option_width' => 14,
			] );
		} catch ( \LogicException $e ) {
			$valid = false;
		}

		$this->assertFalse( $valid );
	}
}