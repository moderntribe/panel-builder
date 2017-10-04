import {
	AlphaPicker,
	BlockPicker,
	ChromePicker,
	CirclePicker,
	CompactPicker,
	GithubPicker,
	HuePicker,
	MaterialPicker,
	PhotoshopPicker,
	SketchPicker,
	SliderPicker,
	TwitterPicker,

} from 'react-color';

import * as PICKER_TYPES from '../../constants/color-picker-types';

export default {
	[PICKER_TYPES.ALPHA_PICKER]: AlphaPicker,
	[PICKER_TYPES.BLOCK_PICKER]: BlockPicker,
	[PICKER_TYPES.CHROME_PICKER]: ChromePicker,
	[PICKER_TYPES.CIRCLE_PICKER]: CirclePicker,
	[PICKER_TYPES.COMPACT_PICKER]: CompactPicker,
	[PICKER_TYPES.GITHUB_PICKER]: GithubPicker,
	[PICKER_TYPES.HUE_PICKER]: HuePicker,
	[PICKER_TYPES.MATERIAL_PICKER]: MaterialPicker,
	[PICKER_TYPES.PHOTOSHOP_PICKER]: PhotoshopPicker,
	[PICKER_TYPES.SKETCH_PICKER]: SketchPicker,
	[PICKER_TYPES.SLIDER_PICKER]: SliderPicker,
	[PICKER_TYPES.TWITTER_PICKER]: TwitterPicker,
};
