<?php

namespace ModularContent\Fields;

use Codeception\TestCase\WPTestCase;

class Link_Test extends WPTestCase {

	public function test_blueprint() {
		$label       = __CLASS__ . '::' . __FUNCTION__;
		$name        = __FUNCTION__;
		$description = __FUNCTION__ . ':' . __LINE__;
		$field       = new Link( [
			'label'       => $label,
			'name'        => $name,
			'description' => $description,
			'layout'      => 'full',
		] );

		$blueprint = $field->get_blueprint();

		$expected = [
			'type'        => 'Link',
			'label'       => $label,
			'name'        => $name,
			'description' => $description,
			'strings'     => [
				'placeholder.label' => 'Label',
				'placeholder.url'   => 'URL',
			],
			'default'     => [
				'url'    => '',
				'target' => '',
				'label'  => '',
			],
			'layout'      => 'full',
		];

		$this->assertEquals( $expected, $blueprint );
	}

	public function test_layout_error() {
		$valid = true;

		try {
			new Link( [
				'layout' => 'foobar',
			] );
		} catch ( \LogicException $e ) {
			$valid = false;
		}

		$this->assertFalse( $valid );
	}
}