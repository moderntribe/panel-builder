<?php

namespace ModularContent\Fields;

use Codeception\TestCase\WPTestCase;

class Range_Test extends WPTestCase {

	public function test_blueprint() {
		$label        = __CLASS__ . '::' . __FUNCTION__;
		$name         = __FUNCTION__;
		$description  = __FUNCTION__ . ':' . __LINE__;
		$default      = [];
		$min          = 10;
		$max          = 200;
		$step         = 0.1;
		$unit_display = 'px';
		$has_input    = false;
		$handles      = [ 10, 15, 25, 32 ];

		$field = new Range( [
			'label'        => $label,
			'name'         => $name,
			'description'  => $description,
			'default'      => $default,
			'min'          => $min,
			'max'          => $max,
			'step'         => $step,
			'unit_display' => $unit_display,
			'handles'      => $handles,
			'has_input'    => $has_input,
		] );

		$blueprint = $field->get_blueprint();

		$expected = [
			'type'         => 'Range',
			'label'        => $label,
			'name'         => $name,
			'description'  => $description,
			'strings'      => [],
			'default'      => $default,
			'min'          => $min,
			'max'          => $max,
			'step'         => $step,
			'unit_display' => $unit_display,
			'handles'      => $handles,
			'has_input'    => $has_input,
		];

		$this->assertEquals( $expected, $blueprint );
	}

	public function test_valid_handles() {
		$min     = 10;
		$max     = 200;
		$handles = [ 0, 15 ];
		$valid   = true;


		try {
			$field = new Range( [
				'min'     => $min,
				'max'     => $max,
				'handles' => $handles,
			] );
		} catch ( \LogicException $e ) {
			$valid = false;
		}

		$this->assertEquals( false, $valid );
	}
}