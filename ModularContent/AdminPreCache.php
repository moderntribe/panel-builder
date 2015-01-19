<?php


namespace ModularContent;


/**
 * A container for information that will be rendered in
 * the admin cache on page load to reduce the number
 * of ajax requests
 */
class AdminPreCache implements \JsonSerializable {
	private $posts = array();
	private $terms = array();
	private $data = array();

	public function add_post( $post_id ) {
		$post = get_post( $post_id );
		$this->posts[$post->ID] = get_object_vars($post);
	}

	public function add_term( $term_id, $taxonomy ) {
		$term = get_term( (int)$term_id, $taxonomy );
		$this->terms[ $term_id ] = get_object_vars( $term );
	}

	public function add_data( $key, $data ) {
		$this->data[ $key ] = $data;
	}

	/**
	 * (PHP 5 &gt;= 5.4.0)<br/>
	 * Specify data which should be serialized to JSON
	 *
	 * @link http://php.net/manual/en/jsonserializable.jsonserialize.php
	 * @return mixed data which can be serialized by <b>json_encode</b>,
	 * which is a value of any type other than a resource.
	 */
	function jsonSerialize() {
		return array(
			'posts' => $this->posts,
			'terms' => $this->terms,
			'data' => $this->data,
		);
	}


}