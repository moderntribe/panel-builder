<?php

namespace ModularContent\Fields;

use Codeception\TestCase\WPTestCase;

class Swatch_Select_Test extends WPTestCase {

	public function test_blueprint() {
		$label       = __CLASS__ . '::' . __FUNCTION__;
		$name        = __FUNCTION__;
		$description = __FUNCTION__ . ':' . __LINE__;
		$field       = new Swatch_Select( [
			'label'        => $label,
			'name'         => $name,
			'description'  => $description,
			'default'      => 'blue',
			'options'      => [
				'blue'       => [
					'color' => '#0000BB',
					'label' => 'Blue',
				],
				'green-blue' => [
					'color' => 'linear-gradient(113.59deg, rgba(186, 191, 16, 1) 0%, rgba(169, 189, 36, 1) 12.24%, rgba(126, 185, 88, 1) 37.36%, rgba(57, 179, 171, 1) 72.79%, rgba(0, 174, 239, 1) 100%)',
					'label' => 'Green to Blue Gradient',
				],
			],
			'option_width' => 3,
		] );

		$blueprint = $field->get_blueprint();

		$expected = [
			'type'         => 'Swatch_Select',
			'label'        => $label,
			'name'         => $name,
			'description'  => $description,
			'strings'      => [],
			'default'      => 'blue',
			'options'      => [
				[
					'color' => '#0000BB',
					'label' => 'Blue',
					'value' => 'blue',
				],
				[
					'color' => 'linear-gradient(113.59deg, rgba(186, 191, 16, 1) 0%, rgba(169, 189, 36, 1) 12.24%, rgba(126, 185, 88, 1) 37.36%, rgba(57, 179, 171, 1) 72.79%, rgba(0, 174, 239, 1) 100%)',
					'label' => 'Green to Blue Gradient',
					'value' => 'green-blue',
				],
			],
			'option_width' => 3,
		];

		$this->assertEquals( $expected, $blueprint );
	}
}