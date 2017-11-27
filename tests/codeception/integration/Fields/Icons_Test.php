<?php

namespace ModularContent\Fields;

use Codeception\TestCase\WPTestCase;

class Icons_Test extends WPTestCase {

	public function test_blueprint() {
		$label       = __CLASS__ . '::' . __FUNCTION__;
		$name        = __FUNCTION__;
		$description = __FUNCTION__ . ':' . __LINE__;
		$field       = new Icons( [
			'label'        => $label,
			'name'         => $name,
			'description'  => $description,
			'default'      => 'fa-one',
			'class_string' => 'fa %s',
			'options'      => [
				'fa-one',
				'fa-two',
				'fa-three' => 'Three',
			],
		] );

		$blueprint = $field->get_blueprint();

		$expected = [
			'type'         => 'Icons',
			'label'        => $label,
			'name'         => $name,
			'description'  => $description,
			'strings'      => [],
			'default'      => 'fa-one',
			'class_string' => 'fa %s',
			'options'      => [
				[
					'label' => 'fa-one',
					'value' => 'fa-one',
				],
				[
					'label' => 'fa-two',
					'value' => 'fa-two',
				],
				[
					'label' => 'Three',
					'value' => 'fa-three',
				],
			],
		];

		$this->assertEquals( $expected, $blueprint );
	}
}