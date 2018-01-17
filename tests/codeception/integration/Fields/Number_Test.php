<?php

namespace ModularContent\Fields;

use Codeception\TestCase\WPTestCase;

class Number_Test extends WPTestCase {

	public function test_blueprint() {
		$label        = __CLASS__ . '::' . __FUNCTION__;
		$name         = __FUNCTION__;
		$description  = __FUNCTION__ . ':' . __LINE__;
		$default      = __LINE__;
		$min          = 10;
		$max          = 200;
		$step         = 0.1;
		$unit_display = 'px';

		$field = new Number( [
			'label'        => $label,
			'name'         => $name,
			'description'  => $description,
			'default'      => $default,
			'min'          => $min,
			'max'          => $max,
			'step'         => $step,
			'unit_display' => $unit_display,
		] );

		$blueprint = $field->get_blueprint();

		$expected = [
			'type'         => 'Number',
			'label'        => $label,
			'name'         => $name,
			'description'  => $description,
			'strings'      => [],
			'default'      => $default,
			'min'          => $min,
			'max'          => $max,
			'step'         => $step,
			'unit_display' => $unit_display,
		];

		$this->assertEquals( $expected, $blueprint );
	}
}