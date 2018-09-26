// this is the config object supplied by wp to js. i simulate defaults here for what i need in here for the tests.

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
		edit_panel_settings: true,
		add_panels: true,
		access_panel_tabs: ['all'],
		delete_panels: true,
		sort_panels: true,
		add_rows: true,
		delete_rows: true,
		sort_rows: true,
		add_child_panels: true,
		delete_child_panels: true,
		sort_child_panels: true,
		add_panel_sets: true,
		save_panel_sets: true,
		edit_panel_sets: true,
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

