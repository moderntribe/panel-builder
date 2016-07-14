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
	<div id="modular-content-app">
		<div class="loader__loader___3LN5p">
			<svg class="loader__circular___1Gd65" viewBox="25 25 50 50">
				<circle class="loader__path___3yb4e" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10" />
			</svg>
		</div>
		<input id="panels_fallback_data" type="hidden" name="panels" value="<?php echo esc_attr( $json_encoded_panels ); ?>" />
	</div>
	<script>
		var ModularContent = <?php echo \ModularContent\Util::json_encode( $meta_box_data ); ?>;
		<?php do_action( 'modular_content_metabox_js_init' ); ?>
	</script>
</div>
<?php do_action( 'after_panel_meta_box' ); ?>
