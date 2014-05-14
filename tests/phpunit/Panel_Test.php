<?php


namespace ModularContent;


class Panel_Test extends UnitTestCase {
	public function test_json_encode() {
		$panel_type = new PanelType('test_panel');
		$panel_type->add_field(new Fields\Title());

		$panel = new Panel( $panel_type );
		$panel->set('post_title', 'Test Title');

		$json = $panel->to_json();
		$decoded = json_decode($json, TRUE);

		$this->assertEquals('test_panel', $decoded['type']);
		$this->assertEquals('Test Title', $decoded['data']['post_title']);
	}
} 