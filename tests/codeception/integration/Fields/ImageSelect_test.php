<?php

namespace ModularContent\Fields;

use Codeception\TestCase\WPTestCase;

class ImageSelect_Test extends WPTestCase {
	public function test_blueprint() {
		$label = __CLASS__ . '::' . __FUNCTION__;
		$name = __FUNCTION__;
		$description = __FUNCTION__ . ':' . __LINE__;
		$field = new ImageSelect( [
			'label'       => $label,
			'name'        => $name,
			'description' => $description,
			'default'     => 'left',
			'options'     => [
				'left'  => [
					'src'   => 'http://example.com/path/to/module-layout-left.png',
					'label' => 'Left',
				],
				'right' => [
					'src'   => 'http://example.com/path/to/module-layout-right.png',
					'label' => 'Right',
				],
			],
			'option_width' => 5,
		] );

		$blueprint = $field->get_blueprint();

		$expected = [
			'type'        => 'ImageSelect',
			'label'       => $label,
			'name'        => $name,
			'description' => $description,
			'strings'     => [ ],
			'default'     => 'left',
			'options'     => [
				[
					'src' => 'http://example.com/path/to/module-layout-left.png',
					'label' => 'Left',
					'value' => 'left',
				],
				[
					'src' => 'http://example.com/path/to/module-layout-right.png',
					'label' => 'Right',
					'value' => 'right',
				],
			],
			'option_width' => 5,
		];

		$this->assertEquals( $expected, $blueprint );
	}

	public function test_option_width_error() {
		$valid = true;

		try {
			new ImageSelect( [
				'option_width' => 14,
			] );
		} catch ( \LogicException $e ) {
			$valid = false;
		}

		$this->assertFalse( $valid );
	}
}