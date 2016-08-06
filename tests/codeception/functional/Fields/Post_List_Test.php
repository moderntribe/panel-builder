<?php

namespace ModularContent\Fields;

use Codeception\TestCase\WPTestCase;
use ModularContent\AdminPreCache;

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
			'hidden_fields'    => [ 'post_content' ],
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
				'tabs.manual'                                => 'Select',
				'tabs.dynamic'                               => 'Query',
				'button.select_post'                         => 'Select a post',
				'button.create_content'                      => 'Create content',
				'button.remove_post'                         => 'Remove this post',
				'button.remove'                              => 'Remove',
				'button.select'                              => 'Select Files',
				'button.add_to_panel'                        => 'Add to Panel',
				'button.cancel_panel'                        => 'Cancel',
				'label.no-results'                           => 'No Results',
				'label.add_another'                          => 'Add Another',
				'label.content_type'                         => 'Content Type',
				'label.choose_post'                          => 'Choose a Post',
				'label.max_results'                          => 'Max Results',
				'label.select_post_type'                     => 'Select Post Type',
				'label.select_post_types'                    => 'Select Post Types',
				'label.add_a_filter'                         => 'Add a Filter',
				'label.taxonomy'                             => 'Taxonomy',
				'label.taxonomy-placeholder'                 => 'Select Term',
				'label.relationship'                         => 'Relationship',
				'label.relationship-no-results'              => 'No Results',
				'label.relationship-post-select-placeholder' => 'Select a Related Post',
				'label.relationship-post-type-placeholder'   => 'Select a Post Type',
				'label.date'                                 => 'Date',
				'label.date-end-date-placeholder'            => 'End Date',
				'label.date-start-date-placeholder'          => 'Start Date',
				'label.title'                                => 'Title',
				'label.content'                              => 'Content',
				'label.link'                                 => 'Link: http://example.com/',
				'label.thumbnail'                            => 'Thumbnail',
				'notice.min_posts'                           => 'This field requires %{count} more item |||| This field requires %{count} more items',
			],
			'default'          => [ 'type' => 'manual', 'posts' => [ ], 'filters' => [ ], 'max' => 0 ],
			'min'              => 5,
			'max'              => 18,
			'suggested'        => 8,
			'show_max_control' => true,
			'hidden_fields'    => [ 'post_content' ],
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
							'value'       => 'post_tag',
							'label'       => 'Tags',
							'filter_type' => 'taxonomy',
							'post_type'   => [ 'post' ],
						],
					],
				],
				[
					'value'       => 'date',
					'label'       => 'Date',
					'filter_type' => 'date',
					'post_type'   => [ 'post', 'page', 'attachment' ],
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

		$this->assertEqualSetsWithIndex( $expected[ 'strings' ], $blueprint[ 'strings' ] );
		unset( $expected[ 'strings' ] );
		unset( $blueprint[ 'strings' ] );

		$this->assertEquals( $expected, $blueprint );
	}

	public function test_precache() {
		$post_id = $this->factory()->post->create();
		$file_path = codecept_data_dir( '300x250.png' );
		$size = 'thumbnail';
		$attachment_id = $this->factory()->attachment->create_upload_object( $file_path, $post_id );
		$another_attachment_id = $this->factory()->attachment->create_upload_object( $file_path, $post_id );
		update_post_meta( $post_id, '_thumbnail_id', $attachment_id );

		$cache = new AdminPreCache();
		$field = new Post_List( [
			'label'       => __FUNCTION__,
			'name'        => __FUNCTION__,
			'description' => __FUNCTION__,
		] );
		$data = [
			'type'  => 'manual',
			'posts' => [
				[
					'id' => $post_id,
				],
				[
					'id'    => 0,
					'title' => __FUNCTION__,
					'image' => $another_attachment_id,
				],
			],
		];
		$field->precache( $data, $cache );
		$output = $cache->get_cache();
		$posts = (array) $output[ 'posts' ];
		$images = (array) $output[ 'images' ];
		$this->assertCount( 1, $posts );
		$this->assertEquals( get_the_title( $post_id ), $posts[ $post_id ][ 'post_title' ] );
		$this->assertCount( 2, $images );
		$this->assertNotEmpty( $images[ $attachment_id ][ $size ] );
		$this->assertNotEmpty( $images[ $another_attachment_id ][ $size ] );
	}
}