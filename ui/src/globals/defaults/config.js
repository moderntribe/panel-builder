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

