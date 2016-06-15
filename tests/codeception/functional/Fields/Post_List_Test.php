<?php

namespace ModularContent\Fields;

use Codeception\TestCase\WPTestCase;

class Post_List_Test extends WPTestCase {
	public function test_blueprint() {
		$label = __CLASS__ . '::' . __FUNCTION__;
		$name = __FUNCTION__;
		$description = __FUNCTION__ . ':' . __LINE__;

		$tag = $this->factory()->tag->create_and_get();

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
				'button.remove'           => 'Remove',
				'button.select'           => 'Select Files',
				'label.add_another'       => 'Add Another',
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
				'notice.min_posts'        => 'This field requires %{count} more item |||| This field requires %{count} more items',
			],
			'default'          => [ 'type' => 'manual', 'posts' => [ ], 'filters' => [ ], 'max' => 0 ],
			'min'              => 5,
			'max'              => 18,
			'suggested'        => 8,
			'show_max_control' => true,
			'post_type'        => [
				[
					'value' => 'post',
					'label' => 'Posts',
				],
			],
			'filters'          => [
				[
					'label'   => 'Taxonomy',
					'options' => [
						[
							'value'     => 'post_tag',
							'label'     => 'Tags',
							'post_type' => [ 'post' ],
						],
					],
				],
				[
					'value'     => 'date',
					'label'     => 'Date',
					'post_type' => [ 'post', 'page', 'attachment' ],
				],
			],
			'taxonomies'       => [
				'post_tag' => [
					[
						'value' => $tag->term_id,
						'label' => $tag->name,
					],
				],
			],
		];

		ksort( $expected['strings'] );
		ksort( $blueprint['strings'] );

		$this->assertEquals( $expected, $blueprint );
	}
}