<?php

namespace ModularContent\Fields;

use Codeception\TestCase\WPTestCase;

class Text_Test extends WPTestCase {

	public function test_blueprint() {
		$label       = __CLASS__ . '::' . __FUNCTION__;
		$name        = __FUNCTION__;
		$description = __FUNCTION__ . ':' . __LINE__;
		$default     = __LINE__;
		$field       = new Text( [
			'label'       => $label,
			'name'        => $name,
			'description' => $description,
			'default'     => $default,
			'input_width' => 5,
			'layout'      => 'full',
		] );

		$blueprint = $field->get_blueprint();

		$expected = [
			'type'        => 'Text',
			'label'       => $label,
			'name'        => $name,
			'description' => $description,
			'strings'     => [],
			'default'     => $default,
			'input_width' => 5,
			'layout'      => 'full',
		];

		$this->assertEquals( $expected, $blueprint );
	}

	public function test_input_width_error() {
		$valid = true;

		try {
			new Text( [
				'input_width' => 14,
			] );
		} catch ( \LogicException $e ) {
			$valid = false;
		}

		$this->assertFalse( $valid );
	}

	public function test_layout_error() {
		$valid = true;

		try {
			new Text( [
				'layout' => 'foobar',
			] );
		} catch ( \LogicException $e ) {
			$valid = false;
		}

		$this->assertFalse( $valid );
	}

	public function test_input_and_layout_error() {
		$valid = true;

		try {
			new Text( [
				'layout'      => 'compact',
				'input_width' => 12,
			] );
		} catch ( \LogicException $e ) {
			$valid = false;
		}

		$this->assertFalse( $valid );
	}
}