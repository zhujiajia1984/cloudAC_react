import React from 'react';
import './HiYouWxAppMap.less';
import qq from 'qq';
import { Card, message } from 'antd';

//
let polygonPoints = [];
const domain = "https://test.weiquaninfo.cn";

//
export default class HiYouWxAppMap extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			curLng: '',
			curLat: '',
			curPolgon: null,
		}
	}

	// load
	componentDidMount() {
		polygonPoints = [];
		// 地图初始化
		this.map = new qq.maps.Map(document.getElementById("mapContainer"), {
			center: new qq.maps.LatLng(31.107260, 121.361180),
			zoom: 18,
		});
		// 绘图工具初始化
		this.drawingManager = new qq.maps.drawing.DrawingManager({
			drawingMode: null,
			drawingControl: true,
			drawingControlOptions: {
				position: qq.maps.ControlPosition.TOP_CENTER,
				drawingModes: [
					qq.maps.drawing.OverlayType.POLYGON,
				]
			},
			map: this.map,
		});

		// 显示多边形
		this.getArea();

		// 事件
		this.clickListener = qq.maps.event.addListener(this.map, 'click',
			this.onClickMap.bind(this));
		this.drawPolygonListener = qq.maps.event.addListener(this.drawingManager,
			'polygoncomplete', this.onDrawPolygon.bind(this));
	}

	// 绘制结束（只画一个多边形）
	onDrawPolygon(event) {
		polygonPoints = [];
		event.getPath().forEach((item, index) => {
			polygonPoints.push({
				lat: item.lat,
				lng: item.lng,
			});
		});
		this.setState({ curPolgon: event });
	}
	// 多边形保存到数据库
	onSaveArea(e) {
		e.preventDefault();
		if (polygonPoints.length == 0) {
			return;
		}
		let url = `${domain}/mongo/polygons`;
		fetch(url, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(polygonPoints),
			})
			.then(res => {
				if (res.status == 201) {
					message.success("已成功更新区域");
					this.state.curPolgon.setMap(null);
					this.getArea();
					return;
				} else {
					throw new Error(`status:${res.status}`);
				}
			})
			.catch(error => {
				alert(`新增多边形失败：${error.message}`);
			})
	}
	// 多边形刷新
	onRefreshArea(e) {
		e.preventDefault();
		if (this.state.curPolgon) {
			this.state.curPolgon.setMap(null);
		}
		this.getArea();
	}
	// 删除多边形
	onDeleteArea(e) {
		e.preventDefault();
		let url = `${domain}/mongo/polygons`;
		fetch(url, { method: "DELETE" }).then(res => {
				if (res.status == 204) {
					message.success("已成功删除区域");
					this.state.curPolgon.setMap(null);
					return;
				} else {
					throw new Error(`status:${res.status}`);
				}
			})
			.catch(error => {
				alert(`删除多边形失败：${error.message}`);
			})
	}

	// 获取多边形并显示
	getArea() {
		let url = `${domain}/mongo/polygons`;
		fetch(url, { method: "GET", })
			.then(res => {
				let contentType = res.headers.get("Content-Type");
				if (res.status == 200 && contentType && contentType.includes("application/json")) {
					return res.json();
				} else {
					throw new Error(`status:${res.status} contentType:${contentType}`);
				}
			})
			.then(resJson => {
				// 显示新多边形
				let path = [];
				resJson.map((item) => {
					path.push(new qq.maps.LatLng(item.lat, item.lng));
				})
				let polygon = new qq.maps.Polygon({
					path: path,
					map: this.map
				});
				this.setState({ curPolgon: polygon });
			})
			.catch(error => {
				alert(`查询多边形信息失败：${error.message}`);
			})
	}

	// unload
	componentWillUnmount() {
		qq.maps.event.removeListener(this.clickListener);
		qq.maps.event.removeListener(this.dragEndListener);
		qq.maps.event.removeListener(this.drawPolygonListener);
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
					<div className="areaOperation">
						<a href="javascript:;" onClick={this.onSaveArea.bind(this)}>保存区域</a>
						<a href="javascript:;" onClick={this.onRefreshArea.bind(this)}>刷新区域</a>
						<a href="javascript:;" onClick={this.onDeleteArea.bind(this)}>删除区域</a>
					</div>
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