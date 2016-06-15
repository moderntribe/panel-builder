<?php

namespace ModularContent\Fields;

use Codeception\TestCase\WPTestCase;

class ImageGallery_Test extends WPTestCase {
	public function test_blueprint() {
		$label = __CLASS__ . '::' . __FUNCTION__;
		$name = __FUNCTION__;
		$description = __FUNCTION__ . ':' . __LINE__;
		$default = __LINE__;
		$field = new ImageGallery( [
			'label'       => $label,
			'name'        => $name,
			'description' => $description,
			'default'     => $default,
		] );

		$blueprint = $field->get_blueprint();

		$expected = [
			'type'        => 'ImageGallery',
			'label'       => $label,
			'name'        => $name,
			'description' => $description,
			'strings'     => [
				'button.edit_gallery' => 'Edit Gallery',
			],
			'default'     => $default,
		];

		$this->assertEquals( $expected, $blueprint );
	}
}