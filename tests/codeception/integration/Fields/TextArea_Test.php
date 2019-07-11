<?php

namespace ModularContent\Fields;

use Codeception\TestCase\WPTestCase;

class TextArea_Test extends WPTestCase {

	public function test_plaintext_blueprint() {
		$label          = __CLASS__ . '::' . __FUNCTION__;
		$name           = __FUNCTION__;
		$description    = __FUNCTION__ . ':' . __LINE__;
		$default        = __LINE__;
		$editor_type    = 'draftjs';
		$editor_options = [ 'wrapperClassName' => 'foobar' ];

		$plaintext = new TextArea( [
			'label'                  => $label,
			'name'                   => $name,
			'description'            => $description,
			'default'                => $default,
			'editor_type'            => $editor_type,
			'editor_options'         => $editor_options,
			'enable_fonts_injection' => true,
		] );

		$blueprint = $plaintext->get_blueprint();

		$expected = [
			'type'                      => 'TextArea',
			'label'                     => $label,
			'name'                      => $name,
			'description'               => $description,
			'strings'                   => [
				'tab.visual' => 'Visual',
				'tab.text'   => 'Text',
			],
			'default'                   => $default,
			'richtext'                  => false,
			'media_buttons'             => true,
			'editor_settings_reference' => '',
			'editor_type'               => $editor_type,
			'editor_options'            => $editor_options,
			'enable_fonts_injection'    => true,
		];

		$this->assertEquals( $expected, $blueprint );
	}

	public function test_richtext_blueprint() {
		$label       = __CLASS__ . '::' . __FUNCTION__;
		$name        = __FUNCTION__;
		$description = __FUNCTION__ . ':' . __LINE__;
		$default     = __LINE__;

		$plaintext = new TextArea( [
			'label'       => $label,
			'name'        => $name,
			'description' => $description,
			'default'     => $default,
			'richtext'    => true,
		] );

		$blueprint = $plaintext->get_blueprint();

		$expected = [
			'type'                   => 'TextArea',
			'label'                  => $label,
			'name'                   => $name,
			'description'            => $description,
			'strings'                => [
				'tab.visual' => 'Visual',
				'tab.text'   => 'Text',
			],
			'default'                => $default,
			'richtext'               => true,
			'media_buttons'          => true,
			'editor_type'            => 'tinymce',
			'enable_fonts_injection' => false,
		];

		$reference = $blueprint['editor_settings_reference'];
		$this->assertRegExp( '#^' . $name . '-\d+$#', $reference, 'unexpected editor reference' );

		unset( $blueprint['editor_settings_reference'] );
		$this->assertEquals( $expected, $blueprint );
	}

	public function test_editor_type_error() {
		$valid = true;

		try {
			new TextArea( [
				'editor_type' => 'foobar',
			] );
		} catch ( \InvalidArgumentException $e ) {
			$valid = false;
		}

		$this->assertFalse( $valid );
	}

	public function test_editor_options_error() {
		$valid = true;

		try {
			new TextArea( [
				'editor_type' => 'tinymce',
				'editor_options' => [ 'foo' => 'bar' ],
			] );
		} catch ( \LogicException $e ) {
			$valid = false;
		}

		$this->assertFalse( $valid );
	}

}