<?php

namespace ModularContent\Fields;

use Codeception\TestCase\WPTestCase;

class Post_List_Test extends WPTestCase {
	public function test_blueprint() {
		$label = __CLASS__ . '::' . __FUNCTION__;
		$name = __FUNCTION__;
		$description = __FUNCTION__ . ':' . __LINE__;
		$field = new Post_List( [
			'label'            => $label,
			'name'             => $name,
			'description'      => $description,
			'min'              => 5,
			'max'              => 18,
			'suggested'        => 8,
			'show_max_control' => true,
			'strings'          => [
				'tabs.manual'  => 'Select',
				'tabs.dynamic' => 'Query',
			],
		] );

		$blueprint = $field->get_blueprint();

		$expected = [
			'type'             => 'Post_List',
			'label'            => $label,
			'name'             => $name,
			'description'      => $description,
			'strings'          => [
				'tabs.manual'             => 'Select',
				'tabs.dynamic'            => 'Query',
				'button.select_post'      => 'Select a post',
				'button.create_content'   => 'Create content',
				'button.remove_post'      => 'Remove this post',
				'label.content_type'      => 'Content Type',
				'label.choose_post'       => 'Choose a Post',
				'label.max_results'       => 'Max Results',
				'label.select_post_type'  => 'Select Post Type',
				'label.select_post_types' => 'Select Post Types',
				'label.add_a_filter'      => 'Add a Filter',
				'label.taxonomy'          => 'Taxonomy',
				'label.relationship'      => 'Relationship',
				'label.date'              => 'Date',
				'label.title'             => 'Title',
				'label.content'           => 'Content',
				'label.link'              => 'Link: http://example.com/',
				'label.thumbnail'         => 'Thumbnail',
			],
			'default'          => [ 'type' => 'manual', 'posts' => [], 'filters' => [], 'max' => 0 ],
			'min'              => 5,
			'max'              => 18,
			'suggested'        => 8,
			'show_max_control' => true,
		];

		$this->assertEquals( $expected, $blueprint );
	}
}