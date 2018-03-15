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
			'search'       => true,
			'options'      => [
				'fa-one',
				'fa-two',
				'fa-three' => 'Three',
			],
			'ajax_option'  => 'foobar',
			'categories'   => [ 'foo', 'bar', 'bash' ],
		] );

		$blueprint = $field->get_blueprint();

		$expected = [
			'type'                   => 'Icons',
			'label'                  => $label,
			'name'                   => $name,
			'description'            => $description,
			'strings'                => [
				'placeholder.search' => __( 'Search Icon Library', 'modular-content' ),
				'label.selected'     => __( 'Selected Icon:', 'modular-content' ),
			],
			'default'                => 'fa-one',
			'class_string'           => 'fa %s',
			'search'                 => true,
			'options'                => [
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
			'layout'                 => 'vertical',
			'option_width'           => 12,
			'global_options'         => false,
			'enable_fonts_injection' => false,
			'ajax_option'            => 'foobar',
			'categories'             => [ 'foo', 'bar', 'bash' ],
		];

		$this->assertEquals( $expected, $blueprint );
	}
}