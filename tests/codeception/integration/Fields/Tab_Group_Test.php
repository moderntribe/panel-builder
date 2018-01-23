<?php

namespace ModularContent\Fields;

use Codeception\TestCase\WPTestCase;

class Tab_Group_Test extends WPTestCase {
	public function test_blueprint() {
		$label = __CLASS__ . '::' . __FUNCTION__;
		$name = __FUNCTION__;
		$description = __FUNCTION__ . ':' . __LINE__;
		$group = new Tab_Group( [
			'label'       => $label,
			'name'        => $name,
			'description' => $description,
		] );

		$group->add_field( new Text([
			'label'       => $label . '1',
			'name'        => $name . '1',
			'description' => $description . '1',
		]));

		$group->add_field( new Text([
			'label'       => $label . '2',
			'name'        => $name . '2',
			'description' => $description . '2',
		]));

		$blueprint = $group->get_blueprint();

		$expected = [
			'type'        => 'Tab_Group',
			'label'       => $label,
			'name'        => $name,
			'description' => $description,
			'strings'     => [ ],
			'default'     => [ ],
		  'fields' => [
			  [
				  'type'        => 'Text',
				  'label'       => $label . '1',
				  'name'        => $name . '1',
				  'description' => $description . '1',
				  'strings'     => [ ],
				  'default'     => '',
			  ],
			  [
				  'type'        => 'Text',
				  'label'       => $label . '2',
				  'name'        => $name . '2',
				  'description' => $description . '2',
				  'strings'     => [ ],
				  'default'     => '',
			  ],
		  ]
		];

		$this->assertEquals( $expected, $blueprint );
	}
}