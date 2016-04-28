<?php

namespace ModularContent\Fields;

use Codeception\TestCase\WPTestCase;

class PostQuacker_Test extends WPTestCase {
	public function test_blueprint() {
		$label = __CLASS__ . '::' . __FUNCTION__;
		$name = __FUNCTION__;
		$description = __FUNCTION__ . ':' . __LINE__;
		$field = new PostQuacker( [
			'label'            => $label,
			'name'             => $name,
			'description'      => $description,
		] );

		$blueprint = $field->get_blueprint();

		$expected = [
			'type'             => 'ModularContent\Fields\PostQuacker',
			'label'            => $label,
			'name'             => $name,
			'description'      => $description,
			'strings'          => [],
			'default'          => [
				'type'    => 'manual',
				'post_id' => 0,
				'title'   => '',
				'content' => '',
				'image'   => 0,
				'link'    => [
					'url'    => '',
					'target' => '',
					'label'  => '',
				],
			],
		];

		$this->assertEquals( $expected, $blueprint );
	}
}