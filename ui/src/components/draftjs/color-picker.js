import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BlockPicker } from 'react-color';

class ColorPicker extends Component {
	onChange = (color) => {
		const { onChange } = this.props;
		onChange('color', color.hex);
	};

	stopPropagation = (event) => {
		event.stopPropagation();
	};

	renderModal = () => {
		const { color } = this.props.currentState;
		const wrapperStyles = {
			position: 'absolute',
			marginTop: '15px',
			marginLeft: '-73px',
			zIndex: '10',
		};
		return (
			<div
				onClick={this.stopPropagation}
				style={wrapperStyles}
			>
				<BlockPicker
					color={color}
					colors={this.props.config.colors}
					presetColors={this.props.config.colors}
					onChangeComplete={this.onChange}
				/>
			</div>
		);
	};

	render() {
		const { expanded, onExpandEvent } = this.props;
		return (
			<div
				aria-haspopup="true"
				aria-expanded={expanded}
				aria-label="rdw-color-picker"
			>
				<div onClick={onExpandEvent} >
					<img
						style={{
							width: '26px',
							padding: '6px 5px 0',
						}}
						src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjMycHgiIGhlaWdodD0iMzJweCIgdmlld0JveD0iMCAwIDQ1OSA0NTkiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ1OSA0NTk7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8ZyBpZD0icGFsZXR0ZSI+CgkJPHBhdGggZD0iTTIyOS41LDBDMTAyLDAsMCwxMDIsMCwyMjkuNVMxMDIsNDU5LDIyOS41LDQ1OWMyMC40LDAsMzguMjUtMTcuODUsMzguMjUtMzguMjVjMC0xMC4yLTIuNTUtMTcuODUtMTAuMi0yNS41ICAgIGMtNS4xLTcuNjUtMTAuMi0xNS4zLTEwLjItMjUuNWMwLTIwLjQsMTcuODUxLTM4LjI1LDM4LjI1LTM4LjI1aDQ1LjljNzEuNCwwLDEyNy41LTU2LjEsMTI3LjUtMTI3LjVDNDU5LDkxLjgsMzU3LDAsMjI5LjUsMHogICAgIE04OS4yNSwyMjkuNWMtMjAuNCwwLTM4LjI1LTE3Ljg1LTM4LjI1LTM4LjI1UzY4Ljg1LDE1Myw4OS4yNSwxNTNzMzguMjUsMTcuODUsMzguMjUsMzguMjVTMTA5LjY1LDIyOS41LDg5LjI1LDIyOS41eiAgICAgTTE2NS43NSwxMjcuNWMtMjAuNCwwLTM4LjI1LTE3Ljg1LTM4LjI1LTM4LjI1UzE0NS4zNSw1MSwxNjUuNzUsNTFTMjA0LDY4Ljg1LDIwNCw4OS4yNVMxODYuMTUsMTI3LjUsMTY1Ljc1LDEyNy41eiAgICAgTTI5My4yNSwxMjcuNWMtMjAuNCwwLTM4LjI1LTE3Ljg1LTM4LjI1LTM4LjI1UzI3Mi44NSw1MSwyOTMuMjUsNTFzMzguMjUsMTcuODUsMzguMjUsMzguMjVTMzEzLjY1LDEyNy41LDI5My4yNSwxMjcuNXogICAgIE0zNjkuNzUsMjI5LjVjLTIwLjQsMC0zOC4yNS0xNy44NS0zOC4yNS0zOC4yNVMzNDkuMzUsMTUzLDM2OS43NSwxNTNTNDA4LDE3MC44NSw0MDgsMTkxLjI1UzM5MC4xNSwyMjkuNSwzNjkuNzUsMjI5LjV6IiBmaWxsPSIjMDAwMDAwIi8+Cgk8L2c+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg=="
						alt=""
					/>
				</div>
				{expanded ? this.renderModal() : undefined}
			</div>
		);
	}
}

ColorPicker.propTypes = {
	expanded: PropTypes.bool,
	onExpandEvent: PropTypes.func,
	config: PropTypes.object,
	onChange: PropTypes.func,
	currentState: PropTypes.object,
};

ColorPicker.defaultProps = {
	expanded: false,
	onExpandEvent: () => {},
	config: {},
	onChange: () => {},
	currentState: {},
};

export default ColorPicker;
