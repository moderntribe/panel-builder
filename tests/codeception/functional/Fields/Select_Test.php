<?php

namespace ModularContent\Fields;

use Codeception\TestCase\WPTestCase;

class Select_Test extends WPTestCase {
	public function test_blueprint() {
		$label = __CLASS__ . '::' . __FUNCTION__;
		$name = __FUNCTION__;
		$description = __FUNCTION__ . ':' . __LINE__;
		$field = new Select( [
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
			'type'        => 'ModularContent\Fields\Select',
			'label'       => $label,
			'name'        => $name,
			'description' => $description,
			'strings'     => [ ],
			'default'     => 'second',
			'options'     => [
				'first'  => 'First Option',
				'second' => 'Second Option',
			],
		];

		$this->assertEquals( $expected, $blueprint );
	}
}