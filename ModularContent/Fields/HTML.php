<?php


namespace ModularContent\Fields;
use ModularContent\Panel;

/**
 * Class HTML
 *
 * @package ModularContent\Fields
 *
 * Simple HTML output. Nothing is submitted. Nothing is saved. Just HTML to display in the admin.
 *
 * $field = new HTML( array(
 *   'label' => __('Something for the field header'),
 *   'name' => 'name',
 *   'description' => '<p>This is the body of the HTML field. It accepts <em>arbitrary</em>, <strong>unfiltered</strong> HTML</p>'
 * ) );
 */
class HTML extends Field {
	protected function render_before() {
		$this->render_opening_tag();
		// no need to render any JS
	}

	public function render_field() {
		// there is no field to render
	}

	protected function render_description() {
		if ( $this->description ) {
			printf('<div class="panel-input-description">%s</div>', $this->description);
		}
	}
}