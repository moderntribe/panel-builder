<?php

namespace ModularContent\Fields;

use Codeception\TestCase\WPTestCase;

class Radio_Test extends WPTestCase {

	public function test_blueprint() {
		$label       = __CLASS__ . '::' . __FUNCTION__;
		$name        = __FUNCTION__;
		$description = __FUNCTION__ . ':' . __LINE__;
		$field       = new Radio( [
			'label'        => $label,
			'name'         => $name,
			'description'  => $description,
			'default'      => 'second',
			'options'      => [
				'first'  => 'First Option',
				'second' => 'Second Option',
			],
			'layout'       => 'vertical',
			'option_width' => 6,
		] );

		$blueprint = $field->get_blueprint();

		$expected = [
			'type'         => 'Radio',
			'label'        => $label,
			'name'         => $name,
			'description'  => $description,
			'strings'      => [],
			'default'      => 'second',
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
			'layout'       => 'vertical',
			'option_width' => 6,
		];

		$this->assertEquals( $expected, $blueprint );
	}

	public function test_layout_error() {
		$valid = true;

		try {
			new Radio( [
				'layout' => 'foobar',
			] );
		} catch ( \LogicException $e ) {
			$valid = false;
		}

		$this->assertFalse( $valid );
	}

	public function test_option_width_error() {
		$valid = true;

		try {
			new Radio( [
				'option_width' => 14,
			] );
		} catch ( \LogicException $e ) {
			$valid = false;
		}

		$this->assertFalse( $valid );
	}
}