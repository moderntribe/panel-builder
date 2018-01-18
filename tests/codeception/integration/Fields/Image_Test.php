<?php

namespace ModularContent\Fields;

use Codeception\TestCase\WPTestCase;
use ModularContent\AdminPreCache;

class Image_Test extends WPTestCase {

	public function test_blueprint() {
		$label       = __CLASS__ . '::' . __FUNCTION__;
		$name        = __FUNCTION__;
		$description = __FUNCTION__ . ':' . __LINE__;
		$default     = __LINE__;
		$mime_types  = [ 'image/svg' ];
		$field       = new Image( [
			'label'                    => $label,
			'name'                     => $name,
			'description'              => $description,
			'default'                  => $default,
			'allowed_image_mime_types' => $mime_types,
			'layout'                   => 'full',
		] );

		$blueprint = $field->get_blueprint();

		$expected = [
			'type'                     => 'Image',
			'label'                    => $label,
			'name'                     => $name,
			'description'              => $description,
			'strings'                  => [
				'button.remove' => 'Remove',
				'button.select' => 'Select Files',
			],
			'default'                  => $default,
			'allowed_image_mime_types' => $mime_types,
			'layout'                   => 'full',
		];

		$this->assertEquals( $expected, $blueprint );
	}

	public function test_precache() {
		$file_path  = codecept_data_dir( '300x250.png' );
		$size       = 'thumbnail';
		$attachment = $this->factory()->attachment->create_upload_object( $file_path );
		$cache      = new AdminPreCache();
		$field      = new Image( [
			'label'       => __FUNCTION__,
			'name'        => __FUNCTION__,
			'description' => __FUNCTION__,
			'size'        => $size,
		] );
		$field->precache( $attachment, $cache );
		$output = $cache->get_cache();
		$images = (array) $output['images'];
		$this->assertCount( 1, $images );
		$this->assertNotEmpty( $images[ $attachment ][ $size ] );
	}

	public function test_layout_error() {
		$valid = true;

		try {
			new Image( [
				'layout' => 'foobar',
			] );
		} catch ( \LogicException $e ) {
			$valid = false;
		}

		$this->assertFalse( $valid );
	}
}