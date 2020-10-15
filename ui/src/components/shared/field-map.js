import * as FIELD_TYPES from '../../constants/field-types';

import Text from '../fields/text';
import Title from '../fields/title';
import Radio from '../fields/radio';
import Checkbox from '../fields/checkbox';
import ColorPicker from '../fields/color-picker';
import ImageSelect from '../fields/image-select';
import SwatchSelect from '../fields/swatch-select';
import Select from '../fields/select';
import TextArea from '../fields/textarea';
import Link from '../fields/link';
import Hidden from '../fields/hidden';
import HTML from '../fields/html';
import Image from '../fields/image';
import Video from '../fields/video';
import ImageGallery from '../fields/image-gallery';
import PostQuacker from '../fields/post-quacker';
import PostList from '../fields/post-list';
import Group from '../fields/group';
import Accordion from '../fields/accordion';
import Repeater from '../fields/repeater';
import ColumnWidth from '../fields/column-width';
import Number from "../fields/number";

export default {
	[FIELD_TYPES.TEXT]: Text,
	[FIELD_TYPES.TITLE]: Title,
	[FIELD_TYPES.RADIO]: Radio,
	[FIELD_TYPES.CHECKBOX]: Checkbox,
	[FIELD_TYPES.COLOR_PICKER]: ColorPicker,
	[FIELD_TYPES.IMAGE_SELECT]: ImageSelect,
	[FIELD_TYPES.SELECT]: Select,
	[FIELD_TYPES.TEXTAREA]: TextArea,
	[FIELD_TYPES.LINK]: Link,
	[FIELD_TYPES.HIDDEN]: Hidden,
	[FIELD_TYPES.HTML]: HTML,
	[FIELD_TYPES.IMAGE]: Image,
	[FIELD_TYPES.IMAGE_GALLERY]: ImageGallery,
	[FIELD_TYPES.VIDEO]: Video,
	[FIELD_TYPES.POST_QUACKER]: PostQuacker,
	[FIELD_TYPES.POST_LIST]: PostList,
	[FIELD_TYPES.SWATCH_SELECT]: SwatchSelect,
	[FIELD_TYPES.GROUP]: Group,
	[FIELD_TYPES.ACCORDION]: Accordion,
	[FIELD_TYPES.REPEATER]: Repeater,
	[FIELD_TYPES.COLUMN_WIDTH]: ColumnWidth,
	[FIELD_TYPES.NUMBER]: Number,
};
