<?php

namespace ModularContent\Fields;

use Codeception\TestCase\WPTestCase;

class Tab_Test extends WPTestCase {

	public function test_blueprint() {
		$label       = __CLASS__ . '::' . __FUNCTION__;
		$name        = __FUNCTION__;
		$description = __FUNCTION__ . ':' . __LINE__;
		$group       = new Tab( [
			'label'       => $label,
			'name'        => $name,
			'description' => $description,
			'icon'        => '/src/to/icon.svg',
		] );

		$group->add_field( new Text( [
			'label'       => $label . '1',
			'name'        => $name . '1',
			'description' => $description . '1',
		] ) );

		$group->add_field( new Text( [
			'label'       => $label . '2',
			'name'        => $name . '2',
			'description' => $description . '2',
		] ) );

		$blueprint = $group->get_blueprint();

		$expected = [
			'type'        => 'Tab',
			'label'       => $label,
			'name'        => $name,
			'description' => $description,
			'strings'     => [],
			'default'     => [],
			'icon'        => '/src/to/icon.svg',
			'fields'      => [
				[
					'type'        => 'Text',
					'label'       => $label . '1',
					'name'        => $name . '1',
					'description' => $description . '1',
					'strings'     => [],
					'default'     => '',
				],
				[
					'type'        => 'Text',
					'label'       => $label . '2',
					'name'        => $name . '2',
					'description' => $description . '2',
					'strings'     => [],
					'default'     => '',
				],
			],
		];

		$this->assertEquals( $expected, $blueprint );
	}
}