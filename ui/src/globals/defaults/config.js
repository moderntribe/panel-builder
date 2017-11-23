// this is the config object supplied by wp to js. i simulate defaults here for what i need in here for the karma tests.

export const CONFIG_DEFAULTS = {
	blueprint: {
		types: [],
		categories: [],
	},
	cache: {
		images: {},
		posts: {},
	},
	url_config: {
		tool_arg: 'tool',
		tool_arg_id: 'content',
	},
	media_buttons_html: '',
	panels: [],
	permissions: {
		can_edit_panel_settings: true,
		can_add_panels: true,
		can_delete_panels: true,
		can_sort_panels: true,
		can_add_rows: true,
		can_delete_rows: true,
		can_sort_rows: true,
		can_add_child_panels: true,
		can_delete_child_panels: true,
		can_sort_child_panels: true,
		can_add_panel_sets: true,
		can_save_panel_sets: true,
		can_edit_panel_sets: true,
	},
	preview_url: '',
	fields: {
		post_list: {
			FILTERS: {
				Date: 'date',
				Taxonomy: 'taxonomy',
				P2P: 'p2p',
			},
			POST_METHODS: {
				Manual: 'manual',
				Select: 'select',
			},
			date_format: 'YYYY-MM-DD',
		},
	},
};

