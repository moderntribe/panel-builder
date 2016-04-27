export default [
	{
		title: 'A Test Panel',
		description: 'A test panel for 3.0',
		type: 'test-panel',
		icon: 'some-src.png',
		fields: [
			{
				field: 'Text',
				title: 'Text Input',
				name: 'test_text_input',
			},
			{
				field: 'Select',
				title: 'Selects Yay!',
				name: 'test_select',
				options: [
					{
						label: 'This is Option 1',
						value: 20,
					},
					{
						label: 'This is Option 2',
						value: 40,
					},
				],
			},
			{
				field: 'Repeater',
				title: 'Repeater Field',
				addText: 'Add Funk',
				name: 'test_repeater',
				fields: [
					{
						field: 'Text',
						title: 'Repeater Text Input',
						name: 'test_text_input',
					},
					{
						field: 'Select',
						title: 'Repeater Selects Yay!',
						name: 'test_select',
						options: [
							{
								label: 'This is Option 1',
								value: 20,
							},
							{
								label: 'This is Option 2',
								value: 40,
							},
						],
					},
				],
			},
			{
				field: 'ChildPanels',
				title: 'Child Panels',
				addText: 'Add Funk',
				name: 'test_repeater',
				fields: [
					{
						field: 'Child Text',
						title: 'Child Input',
						name: 'test_text_input',
					},
					{
						field: 'Child Select',
						title: 'Child Selects Yay!',
						name: 'test_select',
						options: [
							{
								label: 'This is Option 1',
								value: 20,
							},
							{
								label: 'This is Option 2',
								value: 40,
							},
						],
					},
				],
				panels: [{
					title: 'A Test Child Panel',
					description: 'A test child panel for 3.0',
					type: 'test-child-panel',
					icon: 'some-src.png',
					fields: [
						{
							field: 'Text',
							title: 'Text Input',
							name: 'test_text_input',
						},
						{
							field: 'Select',
							title: 'selects Yay!',
							name: 'test_select',
							options: [
								{
									label: 'This is Option 1',
									value: 20,
								},
								{
									label: 'This is Option 2',
									value: 40,
								},
							],
						},
					],
				}],
			}],
	},
];
