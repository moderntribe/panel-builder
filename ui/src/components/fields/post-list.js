import React, { Component, PropTypes } from 'react';

import styles from './post-list.pcss';

class PostList extends Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange() {
		// code to connect to actions that execute on redux store
	}

	render() {
		return (
			<div className={styles.field}>
				<legend className={styles.label}>{this.props.label}</legend>
				<div
					className="panel-input-group panel-input-post-list"
					data-name="items"
					data-max="8"
					data-min="1"
					data-suggested="0"
				>
				<input type="hidden" className="posts-group-name" value="{{data.field_name}}[items]" />
				<input type="hidden" name="{{data.field_name}}[items][type]" className="query-type" value="{{data.fields.items.type}}" />
				<fieldset className="manual" data-type="manual">
					<legend>Manual</legend>
					<div className="selection-notices">
						<span className="icon-exclamation-sign" />This panel requires <span className="count">0</span> more items.
					</div>
					<div className="selection" data-field_name="{{data.field_name}}[items]">
						<div className="selected-post">
							<input type="hidden" name="{{data.field_name}}[items][posts][0][id]" className="selected-post-id" />
							<input type="hidden" name="{{data.field_name}}[items][posts][0][method]" className="selected-post-method" />
							<div className="selected-post-preview">
								<h5 className="post-title"></h5>
								<div className="post-thumbnail"></div>
								<div className="post-excerpt">
									<div className="text-line"></div>
									<div className="text-line"></div>
								</div>
							</div>
							<div className="select-post-input">
								<select className="post-type" data-filter_type="post_type" >
									<option value="">Select Post Type</option>
									<option
										value="section" >Sections</option>
									<option
										value="person" >People</option>
								</select>
								<div className="post-picker">
									<input className="selected-post-field" type="hidden" data-placeholder="Choose a Post" />
								</div>
							</div>
							<div className="manual-post-input">
								<input type="text" name="{{data.field_name}}[items][posts][0][post_title]" className="post-title" placeholder="Title" />
								<textarea name="{{data.field_name}}[items][posts][0][post_content]" className="post-excerpt" placeholder="Content"></textarea>
								<input type="text" name="{{data.field_name}}[items][posts][0][url]" className="post-url" placeholder="Link: http://example.com/" />

								<div className="uploadContainer attachment-helper-uploader" data-settings="{{data.panel_id}}_items_" data-size="thumbnail" data-type="image">
									<div className="closed current-uploaded-image">
										<img className="attachment-thumbnail" />
										<div className="wp-caption"></div>
										<p className="remove-button-container">
											<a className="button-secondary remove-image" href="#">
												Remove Thumbnail					</a>
										</p>
									</div>
									<div className="uploaderSection">
										<div className="loading">
											<img src="http://conroe.dev/wp-admin/images/wpspin_light.gif" alt="Loading" />
										</div>
										<div className="hide-if-no-js plupload-upload-ui">
											<div className="drag-drop-area">
												<div className="drag-drop-inside">
													<p className="drag-drop-info">Drop files here</p>
													<p>or</p>
													<p className="drag-drop-buttons">
														<a href="#" className="button attachment_helper_library_button" title="Add Media" data-size="thumbnail" data-type="image" >
															<span className="wp-media-buttons-icon"></span>Select Files								</a>
													</p>
													<p className="drag-drop-buttons" style="display:none"><input type="button" value="Select Files" className="plupload-browse-button button" /></p>
												</div>
											</div>
										</div>
									</div>

									<input type="hidden" name="{{data.field_name}}[items][posts][0][thumbnail_id]" value="0" className="attachment_helper_value" />
								</div>
							</div>
							<div className="selected-post-toggle">
								<a href="#" className="choose-select-post button button-secondary">Select a post</a>
								<a href="#" className="choose-manual-post button button-secondary">Create content</a>
							</div>
							<a href="#" className="remove-selected-post icon-remove" title="Remove this post"></a>
						</div>
						<div className="selected-post">
							<input type="hidden" name="{{data.field_name}}[items][posts][1][id]" className="selected-post-id" />
							<input type="hidden" name="{{data.field_name}}[items][posts][1][method]" className="selected-post-method" />
							<div className="selected-post-preview">
								<h5 className="post-title"></h5>
								<div className="post-thumbnail"></div>
								<div className="post-excerpt">
									<div className="text-line"></div>
									<div className="text-line"></div>
								</div>
							</div>
							<div className="select-post-input">
								<select className="post-type" data-filter_type="post_type" >
									<option value="">Select Post Type</option>
									<option
										value="section" >Sections</option>
									<option
										value="person" >People</option>
								</select>
								<div className="post-picker">
									<input className="selected-post-field" type="hidden" data-placeholder="Choose a Post" />
								</div>
							</div>
							<div className="manual-post-input">
								<input type="text" name="{{data.field_name}}[items][posts][1][post_title]" className="post-title" placeholder="Title" />
								<textarea name="{{data.field_name}}[items][posts][1][post_content]" className="post-excerpt" placeholder="Content"></textarea>
								<input type="text" name="{{data.field_name}}[items][posts][1][url]" className="post-url" placeholder="Link: http://example.com/" />

								<div style="margin-top: 10px;" className="uploadContainer attachment-helper-uploader" data-settings="{{data.panel_id}}_items_" data-size="thumbnail" data-type="image">

									<!-- Current image -->
									<div className="closed current-uploaded-image">
										<img className="attachment-thumbnail" />
										<div className="wp-caption"></div>
										<p className="remove-button-container">
											<a className="button-secondary remove-image" href="#">
												Remove Thumbnail					</a>
										</p>
									</div>

									<!-- Uploader section -->
									<div className="uploaderSection">
										<div className="loading">
											<img src="http://conroe.dev/wp-admin/images/wpspin_light.gif" alt="Loading" />
										</div>
										<div className="hide-if-no-js plupload-upload-ui">
											<div className="drag-drop-area">
												<div className="drag-drop-inside">
													<p className="drag-drop-info">Drop files here</p>
													<p>or</p>
													<p className="drag-drop-buttons">
														<a href="#" className="button attachment_helper_library_button" title="Add Media" data-size="thumbnail" data-type="image" >
															<span className="wp-media-buttons-icon"></span>Select Files								</a>
													</p>
													<p className="drag-drop-buttons" style="display:none"><input type="button" value="Select Files" className="plupload-browse-button button" /></p>
												</div>
											</div>
										</div>
									</div>

									<input type="hidden" name="{{data.field_name}}[items][posts][1][thumbnail_id]" value="0" className="attachment_helper_value" />
								</div>
							</div>
							<div className="selected-post-toggle">
								<a href="#" className="choose-select-post button button-secondary">Select a post</a>
								<a href="#" className="choose-manual-post button button-secondary">Create content</a>
							</div>
							<a href="#" className="remove-selected-post icon-remove" title="Remove this post"></a>
						</div>
						<div className="selected-post">
							<input type="hidden" name="{{data.field_name}}[items][posts][2][id]" className="selected-post-id" />
							<input type="hidden" name="{{data.field_name}}[items][posts][2][method]" className="selected-post-method" />
							<div className="selected-post-preview">
								<h5 className="post-title"></h5>
								<div className="post-thumbnail"></div>
								<div className="post-excerpt">
									<div className="text-line"></div>
									<div className="text-line"></div>
								</div>
							</div>
							<div className="select-post-input">
								<select className="post-type" data-filter_type="post_type" >
									<option value="">Select Post Type</option>
									<option
										value="section" >Sections</option>
									<option
										value="person" >People</option>
								</select>
								<div className="post-picker">
									<input className="selected-post-field" type="hidden" data-placeholder="Choose a Post" />
								</div>
							</div>
							<div className="manual-post-input">
								<input type="text" name="{{data.field_name}}[items][posts][2][post_title]" className="post-title" placeholder="Title" />
								<textarea name="{{data.field_name}}[items][posts][2][post_content]" className="post-excerpt" placeholder="Content"></textarea>
								<input type="text" name="{{data.field_name}}[items][posts][2][url]" className="post-url" placeholder="Link: http://example.com/" />

								<div style="margin-top: 10px;" className="uploadContainer attachment-helper-uploader" data-settings="{{data.panel_id}}_items_" data-size="thumbnail" data-type="image">

									<!-- Current image -->
									<div className="closed current-uploaded-image">
										<img className="attachment-thumbnail" />
										<div className="wp-caption"></div>
										<p className="remove-button-container">
											<a className="button-secondary remove-image" href="#">
												Remove Thumbnail					</a>
										</p>
									</div>

									<!-- Uploader section -->
									<div className="uploaderSection">
										<div className="loading">
											<img src="http://conroe.dev/wp-admin/images/wpspin_light.gif" alt="Loading" />
										</div>
										<div className="hide-if-no-js plupload-upload-ui">
											<div className="drag-drop-area">
												<div className="drag-drop-inside">
													<p className="drag-drop-info">Drop files here</p>
													<p>or</p>
													<p className="drag-drop-buttons">
														<a href="#" className="button attachment_helper_library_button" title="Add Media" data-size="thumbnail" data-type="image" >
															<span className="wp-media-buttons-icon"></span>Select Files								</a>
													</p>
													<p className="drag-drop-buttons" style="display:none"><input type="button" value="Select Files" className="plupload-browse-button button" /></p>
												</div>
											</div>
										</div>
									</div>

									<input type="hidden" name="{{data.field_name}}[items][posts][2][thumbnail_id]" value="0" className="attachment_helper_value" />
								</div>
							</div>
							<div className="selected-post-toggle">
								<a href="#" className="choose-select-post button button-secondary">Select a post</a>
								<a href="#" className="choose-manual-post button button-secondary">Create content</a>
							</div>
							<a href="#" className="remove-selected-post icon-remove" title="Remove this post"></a>
						</div>
						<div className="selected-post">
							<input type="hidden" name="{{data.field_name}}[items][posts][3][id]" className="selected-post-id" />
							<input type="hidden" name="{{data.field_name}}[items][posts][3][method]" className="selected-post-method" />
							<div className="selected-post-preview">
								<h5 className="post-title"></h5>
								<div className="post-thumbnail"></div>
								<div className="post-excerpt">
									<div className="text-line"></div>
									<div className="text-line"></div>
								</div>
							</div>
							<div className="select-post-input">
								<select className="post-type" data-filter_type="post_type" >
									<option value="">Select Post Type</option>
									<option
										value="section" >Sections</option>
									<option
										value="person" >People</option>
								</select>
								<div className="post-picker">
									<input className="selected-post-field" type="hidden" data-placeholder="Choose a Post" />
								</div>
							</div>
							<div className="manual-post-input">
								<input type="text" name="{{data.field_name}}[items][posts][3][post_title]" className="post-title" placeholder="Title" />
								<textarea name="{{data.field_name}}[items][posts][3][post_content]" className="post-excerpt" placeholder="Content"></textarea>
								<input type="text" name="{{data.field_name}}[items][posts][3][url]" className="post-url" placeholder="Link: http://example.com/" />

								<div style="margin-top: 10px;" className="uploadContainer attachment-helper-uploader" data-settings="{{data.panel_id}}_items_" data-size="thumbnail" data-type="image">

									<!-- Current image -->
									<div className="closed current-uploaded-image">
										<img className="attachment-thumbnail" />
										<div className="wp-caption"></div>
										<p className="remove-button-container">
											<a className="button-secondary remove-image" href="#">
												Remove Thumbnail					</a>
										</p>
									</div>

									<!-- Uploader section -->
									<div className="uploaderSection">
										<div className="loading">
											<img src="http://conroe.dev/wp-admin/images/wpspin_light.gif" alt="Loading" />
										</div>
										<div className="hide-if-no-js plupload-upload-ui">
											<div className="drag-drop-area">
												<div className="drag-drop-inside">
													<p className="drag-drop-info">Drop files here</p>
													<p>or</p>
													<p className="drag-drop-buttons">
														<a href="#" className="button attachment_helper_library_button" title="Add Media" data-size="thumbnail" data-type="image" >
															<span className="wp-media-buttons-icon"></span>Select Files								</a>
													</p>
													<p className="drag-drop-buttons" style="display:none"><input type="button" value="Select Files" className="plupload-browse-button button" /></p>
												</div>
											</div>
										</div>
									</div>

									<input type="hidden" name="{{data.field_name}}[items][posts][3][thumbnail_id]" value="0" className="attachment_helper_value" />
								</div>
							</div>
							<div className="selected-post-toggle">
								<a href="#" className="choose-select-post button button-secondary">Select a post</a>
								<a href="#" className="choose-manual-post button button-secondary">Create content</a>
							</div>
							<a href="#" className="remove-selected-post icon-remove" title="Remove this post"></a>
						</div>
						<div className="selected-post">
							<input type="hidden" name="{{data.field_name}}[items][posts][4][id]" className="selected-post-id" />
							<input type="hidden" name="{{data.field_name}}[items][posts][4][method]" className="selected-post-method" />
							<div className="selected-post-preview">
								<h5 className="post-title"></h5>
								<div className="post-thumbnail"></div>
								<div className="post-excerpt">
									<div className="text-line"></div>
									<div className="text-line"></div>
								</div>
							</div>
							<div className="select-post-input">
								<select className="post-type" data-filter_type="post_type" >
									<option value="">Select Post Type</option>
									<option
										value="section" >Sections</option>
									<option
										value="person" >People</option>
								</select>
								<div className="post-picker">
									<input className="selected-post-field" type="hidden" data-placeholder="Choose a Post" />
								</div>
							</div>
							<div className="manual-post-input">
								<input type="text" name="{{data.field_name}}[items][posts][4][post_title]" className="post-title" placeholder="Title" />
								<textarea name="{{data.field_name}}[items][posts][4][post_content]" className="post-excerpt" placeholder="Content"></textarea>
								<input type="text" name="{{data.field_name}}[items][posts][4][url]" className="post-url" placeholder="Link: http://example.com/" />

								<div style="margin-top: 10px;" className="uploadContainer attachment-helper-uploader" data-settings="{{data.panel_id}}_items_" data-size="thumbnail" data-type="image">

									<!-- Current image -->
									<div className="closed current-uploaded-image">
										<img className="attachment-thumbnail" />
										<div className="wp-caption"></div>
										<p className="remove-button-container">
											<a className="button-secondary remove-image" href="#">
												Remove Thumbnail					</a>
										</p>
									</div>

									<!-- Uploader section -->
									<div className="uploaderSection">
										<div className="loading">
											<img src="http://conroe.dev/wp-admin/images/wpspin_light.gif" alt="Loading" />
										</div>
										<div className="hide-if-no-js plupload-upload-ui">
											<div className="drag-drop-area">
												<div className="drag-drop-inside">
													<p className="drag-drop-info">Drop files here</p>
													<p>or</p>
													<p className="drag-drop-buttons">
														<a href="#" className="button attachment_helper_library_button" title="Add Media" data-size="thumbnail" data-type="image" >
															<span className="wp-media-buttons-icon"></span>Select Files								</a>
													</p>
													<p className="drag-drop-buttons" style="display:none"><input type="button" value="Select Files" className="plupload-browse-button button" /></p>
												</div>
											</div>
										</div>
									</div>

									<input type="hidden" name="{{data.field_name}}[items][posts][4][thumbnail_id]" value="0" className="attachment_helper_value" />
								</div>
							</div>
							<div className="selected-post-toggle">
								<a href="#" className="choose-select-post button button-secondary">Select a post</a>
								<a href="#" className="choose-manual-post button button-secondary">Create content</a>
							</div>
							<a href="#" className="remove-selected-post icon-remove" title="Remove this post"></a>
						</div>
						<div className="selected-post">
							<input type="hidden" name="{{data.field_name}}[items][posts][5][id]" className="selected-post-id" />
							<input type="hidden" name="{{data.field_name}}[items][posts][5][method]" className="selected-post-method" />
							<div className="selected-post-preview">
								<h5 className="post-title"></h5>
								<div className="post-thumbnail"></div>
								<div className="post-excerpt">
									<div className="text-line"></div>
									<div className="text-line"></div>
								</div>
							</div>
							<div className="select-post-input">
								<select className="post-type" data-filter_type="post_type" >
									<option value="">Select Post Type</option>
									<option
										value="section" >Sections</option>
									<option
										value="person" >People</option>
								</select>
								<div className="post-picker">
									<input className="selected-post-field" type="hidden" data-placeholder="Choose a Post" />
								</div>
							</div>
							<div className="manual-post-input">
								<input type="text" name="{{data.field_name}}[items][posts][5][post_title]" className="post-title" placeholder="Title" />
								<textarea name="{{data.field_name}}[items][posts][5][post_content]" className="post-excerpt" placeholder="Content"></textarea>
								<input type="text" name="{{data.field_name}}[items][posts][5][url]" className="post-url" placeholder="Link: http://example.com/" />

								<div style="margin-top: 10px;" className="uploadContainer attachment-helper-uploader" data-settings="{{data.panel_id}}_items_" data-size="thumbnail" data-type="image">

									<!-- Current image -->
									<div className="closed current-uploaded-image">
										<img className="attachment-thumbnail" />
										<div className="wp-caption"></div>
										<p className="remove-button-container">
											<a className="button-secondary remove-image" href="#">
												Remove Thumbnail					</a>
										</p>
									</div>

									<!-- Uploader section -->
									<div className="uploaderSection">
										<div className="loading">
											<img src="http://conroe.dev/wp-admin/images/wpspin_light.gif" alt="Loading" />
										</div>
										<div className="hide-if-no-js plupload-upload-ui">
											<div className="drag-drop-area">
												<div className="drag-drop-inside">
													<p className="drag-drop-info">Drop files here</p>
													<p>or</p>
													<p className="drag-drop-buttons">
														<a href="#" className="button attachment_helper_library_button" title="Add Media" data-size="thumbnail" data-type="image" >
															<span className="wp-media-buttons-icon"></span>Select Files								</a>
													</p>
													<p className="drag-drop-buttons" style="display:none"><input type="button" value="Select Files" className="plupload-browse-button button" /></p>
												</div>
											</div>
										</div>
									</div>

									<input type="hidden" name="{{data.field_name}}[items][posts][5][thumbnail_id]" value="0" className="attachment_helper_value" />
								</div>
							</div>
							<div className="selected-post-toggle">
								<a href="#" className="choose-select-post button button-secondary">Select a post</a>
								<a href="#" className="choose-manual-post button button-secondary">Create content</a>
							</div>
							<a href="#" className="remove-selected-post icon-remove" title="Remove this post"></a>
						</div>
						<div className="selected-post">
							<input type="hidden" name="{{data.field_name}}[items][posts][6][id]" className="selected-post-id" />
							<input type="hidden" name="{{data.field_name}}[items][posts][6][method]" className="selected-post-method" />
							<div className="selected-post-preview">
								<h5 className="post-title"></h5>
								<div className="post-thumbnail"></div>
								<div className="post-excerpt">
									<div className="text-line"></div>
									<div className="text-line"></div>
								</div>
							</div>
							<div className="select-post-input">
								<select className="post-type" data-filter_type="post_type" >
									<option value="">Select Post Type</option>
									<option
										value="section" >Sections</option>
									<option
										value="person" >People</option>
								</select>
								<div className="post-picker">
									<input className="selected-post-field" type="hidden" data-placeholder="Choose a Post" />
								</div>
							</div>
							<div className="manual-post-input">
								<input type="text" name="{{data.field_name}}[items][posts][6][post_title]" className="post-title" placeholder="Title" />
								<textarea name="{{data.field_name}}[items][posts][6][post_content]" className="post-excerpt" placeholder="Content"></textarea>
								<input type="text" name="{{data.field_name}}[items][posts][6][url]" className="post-url" placeholder="Link: http://example.com/" />

								<div style="margin-top: 10px;" className="uploadContainer attachment-helper-uploader" data-settings="{{data.panel_id}}_items_" data-size="thumbnail" data-type="image">

									<!-- Current image -->
									<div className="closed current-uploaded-image">
										<img className="attachment-thumbnail" />
										<div className="wp-caption"></div>
										<p className="remove-button-container">
											<a className="button-secondary remove-image" href="#">
												Remove Thumbnail					</a>
										</p>
									</div>

									<!-- Uploader section -->
									<div className="uploaderSection">
										<div className="loading">
											<img src="http://conroe.dev/wp-admin/images/wpspin_light.gif" alt="Loading" />
										</div>
										<div className="hide-if-no-js plupload-upload-ui">
											<div className="drag-drop-area">
												<div className="drag-drop-inside">
													<p className="drag-drop-info">Drop files here</p>
													<p>or</p>
													<p className="drag-drop-buttons">
														<a href="#" className="button attachment_helper_library_button" title="Add Media" data-size="thumbnail" data-type="image" >
															<span className="wp-media-buttons-icon"></span>Select Files								</a>
													</p>
													<p className="drag-drop-buttons" style="display:none"><input type="button" value="Select Files" className="plupload-browse-button button" /></p>
												</div>
											</div>
										</div>
									</div>

									<input type="hidden" name="{{data.field_name}}[items][posts][6][thumbnail_id]" value="0" className="attachment_helper_value" />
								</div>
							</div>
							<div className="selected-post-toggle">
								<a href="#" className="choose-select-post button button-secondary">Select a post</a>
								<a href="#" className="choose-manual-post button button-secondary">Create content</a>
							</div>
							<a href="#" className="remove-selected-post icon-remove" title="Remove this post"></a>
						</div>
						<div className="selected-post">
							<input type="hidden" name="{{data.field_name}}[items][posts][7][id]" className="selected-post-id" />
							<input type="hidden" name="{{data.field_name}}[items][posts][7][method]" className="selected-post-method" />
							<div className="selected-post-preview">
								<h5 className="post-title"></h5>
								<div className="post-thumbnail"></div>
								<div className="post-excerpt">
									<div className="text-line"></div>
									<div className="text-line"></div>
								</div>
							</div>
							<div className="select-post-input">
								<select className="post-type" data-filter_type="post_type" >
									<option value="">Select Post Type</option>
									<option
										value="section" >Sections</option>
									<option
										value="person" >People</option>
								</select>
								<div className="post-picker">
									<input className="selected-post-field" type="hidden" data-placeholder="Choose a Post" />
								</div>
							</div>
							<div className="manual-post-input">
								<input type="text" name="{{data.field_name}}[items][posts][7][post_title]" className="post-title" placeholder="Title" />
								<textarea name="{{data.field_name}}[items][posts][7][post_content]" className="post-excerpt" placeholder="Content"></textarea>
								<input type="text" name="{{data.field_name}}[items][posts][7][url]" className="post-url" placeholder="Link: http://example.com/" />

								<div style="margin-top: 10px;" className="uploadContainer attachment-helper-uploader" data-settings="{{data.panel_id}}_items_" data-size="thumbnail" data-type="image">

									<!-- Current image -->
									<div className="closed current-uploaded-image">
										<img className="attachment-thumbnail" />
										<div className="wp-caption"></div>
										<p className="remove-button-container">
											<a className="button-secondary remove-image" href="#">
												Remove Thumbnail					</a>
										</p>
									</div>

									<!-- Uploader section -->
									<div className="uploaderSection">
										<div className="loading">
											<img src="http://conroe.dev/wp-admin/images/wpspin_light.gif" alt="Loading" />
										</div>
										<div className="hide-if-no-js plupload-upload-ui">
											<div className="drag-drop-area">
												<div className="drag-drop-inside">
													<p className="drag-drop-info">Drop files here</p>
													<p>or</p>
													<p className="drag-drop-buttons">
														<a href="#" className="button attachment_helper_library_button" title="Add Media" data-size="thumbnail" data-type="image" >
															<span className="wp-media-buttons-icon"></span>Select Files								</a>
													</p>
													<p className="drag-drop-buttons" style="display:none"><input type="button" value="Select Files" className="plupload-browse-button button" /></p>
												</div>
											</div>
										</div>
									</div>

									<input type="hidden" name="{{data.field_name}}[items][posts][7][thumbnail_id]" value="0" className="attachment_helper_value" />
								</div>
							</div>
							<div className="selected-post-toggle">
								<a href="#" className="choose-select-post button button-secondary">Select a post</a>
								<a href="#" className="choose-manual-post button button-secondary">Create content</a>
							</div>
							<a href="#" className="remove-selected-post icon-remove" title="Remove this post"></a>
						</div>
					</div>
				</fieldset>
				<fieldset className="query" id="{{data.panel_id}}-items-query" data-type="query">
					<legend>Dynamic</legend>
					<div className="filter-post_type-container">
						<div className="panel-filter-row filter-post_type">
							<label>Content Type</label>
				<span className="filter-options">
					<select name="{{data.field_name}}[items][filters][post_type][selection][]" className="post-type-select term-select" multiple="multiple" data-placeholder="Select Post Types" data-filter_type="post_type" >
													<option value="section" >Sections</option>'
													<option value="person" >People</option>'
											</select>
				</span>
						</div>
					</div>
					<input className="max-results-selection" type="hidden" name="{{data.field_name}}[items][max]" value="0" />
					<div className="select-filters">
						<select className="select-new-filter">
							<option value="">Add a Filter</option>
							<optgroup label="Taxonomy">
								<option data-filter-group="taxonomy" data-filter-post-types="[&quot;post&quot;,&quot;campus-update&quot;]" value="category">Categories</option>
								<option data-filter-group="taxonomy" data-filter-post-types="[&quot;post&quot;,&quot;tribe_events&quot;,&quot;campus-update&quot;]" value="post_tag">Tags</option>
							</optgroup>
							<optgroup label="Relationship"><option data-filter-group="p2p" data-filter-post-types="[&quot;section&quot;,&quot;person&quot;,&quot;tribe_events&quot;,&quot;school&quot;]" data-filter-post-type-labels="{&quot;section&quot;:&quot;Sections&quot;,&quot;person&quot;:&quot;People&quot;,&quot;tribe_events&quot;:&quot;Events&quot;,&quot;school&quot;:&quot;Schools&quot;}" data-any-post-type-label="-- Post type --" value="related_posts">Related</option><option data-filter-group="p2p" data-filter-post-types="[&quot;person&quot;]" data-filter-post-type-labels="{&quot;person&quot;:&quot;People&quot;}" data-any-post-type-label="-- Post type --" value="secretary_relation">Connected People</option><option data-filter-group="p2p" data-filter-post-types="[&quot;person&quot;,&quot;section&quot;]" data-filter-post-type-labels="{&quot;person&quot;:&quot;People&quot;,&quot;section&quot;:&quot;Sections&quot;}" data-any-post-type-label="-- Post type --" value="section_contact_person">Connected Sections &harr; Connected People</option><option data-filter-group="p2p" data-filter-post-types="[&quot;food_menu&quot;,&quot;school&quot;]" data-filter-post-type-labels="{&quot;food_menu&quot;:&quot;Food Menus&quot;,&quot;school&quot;:&quot;Schools&quot;}" data-any-post-type-label="-- Post type --" value="food_menu_school">Used for Schools &harr; Food Menus</option><option data-filter-group="p2p" data-filter-post-types="[&quot;person&quot;,&quot;school&quot;]" data-filter-post-type-labels="{&quot;person&quot;:&quot;People&quot;,&quot;school&quot;:&quot;Schools&quot;}" data-any-post-type-label="-- Post type --" value="school_administrator">Administered Schools &harr; Administrators</option><option data-filter-group="p2p" data-filter-post-types="[&quot;campus-update&quot;,&quot;school&quot;]" data-filter-post-type-labels="{&quot;campus-update&quot;:&quot;Campus Updates&quot;,&quot;school&quot;:&quot;Schools&quot;}" data-any-post-type-label="-- Post type --" value="school_campus_update">Related Schools &harr; Campus Updates</option><option data-filter-group="p2p" data-filter-post-types="[&quot;post&quot;,&quot;page&quot;,&quot;tribe_events&quot;,&quot;tribe_venue&quot;,&quot;tribe_organizer&quot;,&quot;person&quot;,&quot;section_page&quot;,&quot;section&quot;,&quot;campus-update&quot;,&quot;food_menu&quot;,&quot;school&quot;,&quot;tribe_alert&quot;,&quot;panel-set&quot;,&quot;permission_group&quot;]" data-filter-post-type-labels="{&quot;post&quot;:&quot;Posts&quot;,&quot;page&quot;:&quot;Pages&quot;,&quot;tribe_events&quot;:&quot;Events&quot;,&quot;tribe_venue&quot;:&quot;Venues&quot;,&quot;tribe_organizer&quot;:&quot;Organizers&quot;,&quot;person&quot;:&quot;People&quot;,&quot;section_page&quot;:&quot;Pages&quot;,&quot;section&quot;:&quot;Sections&quot;,&quot;campus-update&quot;:&quot;Campus Updates&quot;,&quot;food_menu&quot;:&quot;Food Menus&quot;,&quot;school&quot;:&quot;Schools&quot;,&quot;tribe_alert&quot;:&quot;Alerts&quot;,&quot;panel-set&quot;:&quot;Panel Sets&quot;,&quot;permission_group&quot;:&quot;Groups&quot;}" data-any-post-type-label="-- Post type --" value="post_permission_groups">Permission Group</option><option data-filter-group="p2p" data-filter-post-types="[&quot;permission_group&quot;]" data-filter-post-type-labels="{&quot;permission_group&quot;:&quot;Groups&quot;}" data-any-post-type-label="-- Post type --" value="user_permission_groups">Groups &rarr; Team Members</option></optgroup>				<option data-filter-group="date" data-filter-post_types="{"post":"post","page":"page","attachment":"attachment","revision":"revision","nav_menu_item":"nav_menu_item","visualizer":"visualizer","tribe_events":"tribe_events","tribe_venue":"tribe_venue","tribe_organizer":"tribe_organizer","permission_group":"permission_group","person":"person","section_page":"section_page","section":"section","campus-update":"campus-update","food_menu":"food_menu","school":"school","tribe_alert":"tribe_alert","panel-set":"panel-set"}" value="date">Date</option>
						</select>
						<div className="query-filters">
						</div>
					</div>
					<div className="query-preview">

					</div>
				</fieldset>
			</div>
		);
	}
}

PostList.propTypes = {
	label: PropTypes.string,
	name: PropTypes.string,
	description: PropTypes.string,
	strings: PropTypes.object,
	default: PropTypes.object,
	min: PropTypes.number,
	max: PropTypes.number,
	suggested: PropTypes.number,
	show_max_control: PropTypes.bool,
	post_type: PropTypes.array,
	filters: PropTypes.object,
};

PostList.defaultProps = {
	label: '',
	name: '',
	description: '',
	strings: {},
	default: {},
	min: 1,
	max: 12,
	suggested: 6,
	show_max_control: false,
	post_type: [],
	filters: {},
};

export default PostList;
