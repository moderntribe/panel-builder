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
class HTML extends Field {}