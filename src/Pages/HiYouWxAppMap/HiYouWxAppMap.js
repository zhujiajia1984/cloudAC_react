import React from 'react';
import './HiYouWxAppMap.less';
import qq from 'qq';
import { Card } from 'antd';

//
export default class HiYouWxAppMap extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			curLng: '',
			curLat: '',
		}
	}

	// load
	componentDidMount() {
		this.map = new qq.maps.Map(document.getElementById("mapContainer"), {
			center: new qq.maps.LatLng(31.107260, 121.361180),
			zoom: 18,
		});
		this.clickListener = qq.maps.event.addListener(this.map, 'click',
			this.onClickMap.bind(this));
	}

	// unload
	componentWillUnmount() {
		qq.maps.event.removeListener(this.clickListener);
		qq.maps.event.removeListener(this.dragEndListener);
	}

	// 新增标记点
	onAddPoint(e) {
		e.preventDefault();
		if (typeof(this.marker) != "undefined") {
			this.marker.setMap(null);
		}
		this.marker = new qq.maps.Marker({
			position: new qq.maps.LatLng(this.state.curLat, this.state.curLng),
			map: this.map,
			draggable: true,
			title: '鼠标拖动可移动位置',
		});
		this.dragEndListener = qq.maps.event.addListener(this.marker, 'dragend',
			this.onDragEndMarker.bind(this));
	}

	// 鼠标在地图上移动时，显示经纬度
	onClickMap(event) {
		this.setState({
			curLng: event.latLng.getLng(),
			curLat: event.latLng.getLat(),
		})
	}

	// 拖动结束
	onDragEndMarker(event) {
		this.setState({
			curLng: event.latLng.getLng(),
			curLat: event.latLng.getLat(),
		})
	}

	//
	render() {
		return (
			<div className="HiYouWxAppMapContainer">
				<div className="map" id="mapContainer"></div>
				<div className="info">
					<Card title="当前点击经纬度"
						bordered={false}
						extra={<a href="javascript:;" onClick={this.onAddPoint.bind(this)}>标记此点</a>}
					>
				      <p>{`经度：${this.state.curLng}`}</p>
				      <p>{`纬度：${this.state.curLat}`}</p>
				    </Card>
				</div>
			</div>
		);
	}
}