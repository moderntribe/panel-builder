<?php

namespace ModularContent\Fields;

use Codeception\TestCase\WPTestCase;

class TextArea_Test extends WPTestCase {
	public function test_plaintext_blueprint() {
		$label = __CLASS__ . '::' . __FUNCTION__;
		$name = __FUNCTION__;
		$description = __FUNCTION__ . ':' . __LINE__;
		$default = __LINE__;

		$plaintext = new TextArea( [
			'label'       => $label,
			'name'        => $name,
			'description' => $description,
			'default'     => $default,
		] );

		$blueprint = $plaintext->get_blueprint();

		$expected = [
			'type'                      => 'TextArea',
			'label'                     => $label,
			'name'                      => $name,
			'description'               => $description,
			'strings'                   => [ ],
			'default'                   => $default,
			'richtext'                  => false,
			'media_buttons'             => true,
			'editor_settings_reference' => '',
		];

		$this->assertEquals( $expected, $blueprint );
	}

	public function test_richtext_blueprint() {
		$label = __CLASS__ . '::' . __FUNCTION__;
		$name = __FUNCTION__;
		$description = __FUNCTION__ . ':' . __LINE__;
		$default = __LINE__;

		$plaintext = new TextArea( [
			'label'       => $label,
			'name'        => $name,
			'description' => $description,
			'default'     => $default,
			'richtext'    => true,
		] );

		$blueprint = $plaintext->get_blueprint();

		$expected = [
			'type'          => 'TextArea',
			'label'         => $label,
			'name'          => $name,
			'description'   => $description,
			'strings'       => [ ],
			'default'       => $default,
			'richtext'      => true,
			'media_buttons' => true,
		];

		$reference = $blueprint[ 'editor_settings_reference' ];
		$this->assertRegExp( '#^' . $name . '-\d+$#', $reference, 'unexpected editor reference' );
		
		unset( $blueprint[ 'editor_settings_reference' ] );
		$this->assertEquals( $expected, $blueprint );
	}
}