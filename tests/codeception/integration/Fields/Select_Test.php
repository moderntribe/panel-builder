<?php

namespace ModularContent\Fields;

use Codeception\TestCase\WPTestCase;

class Select_Test extends WPTestCase {

	public function test_blueprint() {
		$label       = __CLASS__ . '::' . __FUNCTION__;
		$name        = __FUNCTION__;
		$description = __FUNCTION__ . ':' . __LINE__;
		$field       = new Select( [
			'label'                  => $label,
			'name'                   => $name,
			'description'            => $description,
			'default'                => 'second',
			'options'                => [
				'first'  => 'First Option',
				'second' => 'Second Option',
			],
			'layout'                 => 'full',
			'global_options'         => 'google_fonts',
			'enable_fonts_injection' => true,
		] );

		$blueprint = $field->get_blueprint();

		$expected = [
			'type'                   => 'Select',
			'label'                  => $label,
			'name'                   => $name,
			'description'            => $description,
			'strings'                => [],
			'default'                => 'second',
			'options'                => [
				[
					'label' => 'First Option',
					'value' => 'first',
				],
				[
					'label' => 'Second Option',
					'value' => 'second',
				],
			],
			'layout'                 => 'full',
			'global_options'         => 'google_fonts',
			'enable_fonts_injection' => true,
		];

		$this->assertEquals( $expected, $blueprint );
	}

	public function test_layout_error() {
		$valid = true;

		try {
			new Select( [
				'layout' => 'foobar',
			] );
		} catch ( \LogicException $e ) {
			$valid = false;
		}

		$this->assertFalse( $valid );
	}
}