<?php

namespace ModularContent\Fields;

use Codeception\TestCase\WPTestCase;
use ModularContent\AdminPreCache;

class ImageGallery_Test extends WPTestCase {
	public function test_blueprint() {
		$label = __CLASS__ . '::' . __FUNCTION__;
		$name = __FUNCTION__;
		$description = __FUNCTION__ . ':' . __LINE__;
		$default = [];
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

	public function test_precache() {
		$file_path = codecept_data_dir( '300x250.png' );
		$size = 'thumbnail';
		$attachment_id = $this->factory()->attachment->create_upload_object( $file_path );
		$cache = new AdminPreCache();
		$field = new ImageGallery( [
			'label'       => __FUNCTION__,
			'name'        => __FUNCTION__,
			'description' => __FUNCTION__,
		] );
		$field->precache( [ [ 'id' => $attachment_id ] ], $cache );
		$output = $cache->get_cache();
		$images = (array) $output[ 'images' ];
		$this->assertCount( 1, $images );
		$this->assertNotEmpty( $images[ $attachment_id ][ $size ] );
	}
}