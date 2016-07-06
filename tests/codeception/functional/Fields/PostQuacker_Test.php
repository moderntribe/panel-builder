<?php

namespace ModularContent\Fields;

use Codeception\TestCase\WPTestCase;

class PostQuacker_Test extends WPTestCase {
	public function test_blueprint() {
		$label = __CLASS__ . '::' . __FUNCTION__;
		$name = __FUNCTION__;
		$description = __FUNCTION__ . ':' . __LINE__;
		$field = new PostQuacker( [
			'label'       => $label,
			'name'        => $name,
			'description' => $description,
		] );

		$blueprint = $field->get_blueprint();

		$expected = [
			'type'        => 'PostQuacker',
			'label'       => $label,
			'name'        => $name,
			'description' => $description,
			'strings'     => [
				'button.add_to_module'         => 'Add to Module',
				'button.remove'                => 'Remove',
				'button.select'                => 'Select Files',
				'label.manual_title'           => 'Title',
				'label.manual_image'           => 'Image',
				'label.manual_content'         => 'Content',
				'label.manual_link'            => 'Link',
				'label.select_post_type'       => 'Select Type',
				'label.select_post'            => 'Select Content',
				'no_results'                   => 'No Results',
				'placeholder.select_post_type' => 'Select Post Type',
				'placeholder.select_post'      => 'Select...',
				'placeholder.label'            => 'Label',
				'placeholder.url'              => 'URL',
				'tab.selection'                => 'Selection',
				'tab.manual'                   => 'Manual',
				'tab.visual'                   => 'Visual',
				'tab.text'                     => 'Text',
			],
			'default'     => [
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
			'post_type'   => [
				[
					'value' => 'post',
					'label' => 'Posts',
				],
			],
		];

		$this->assertEquals( $expected, $blueprint );
	}
}