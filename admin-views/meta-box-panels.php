<?php
/**
 * The Panels meta box
 *
 * @var array  $meta_box_data       The accumulated configuration data to send to js
 * @var string $json_encoded_panels The existing panels, as a json string, used as a fallback in case of a js error
 */
?>
<?php do_action( 'before_panel_meta_box' ); ?>
<div class="panels" data-depth="0">
	<script>
		var ModularContent = <?php echo \ModularContent\Util::json_encode( $meta_box_data ); ?>;
		<?php do_action( 'modular_content_metabox_js_init' ); ?>
	</script>
	<input id="panels_fallback_data" type="hidden" name="panels" value="<?php echo esc_attr( $json_encoded_panels ); ?>" />
</div>
<?php do_action( 'after_panel_meta_box' ); ?>
