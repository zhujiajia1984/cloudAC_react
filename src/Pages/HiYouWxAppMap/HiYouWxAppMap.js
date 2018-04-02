import React from 'react';
import './HiYouWxAppMap.less';
import qq from 'qq';
import {
	Card,
	message,
	Form,
	Input,
	Select,
	Button,
	Popconfirm,
	Upload,
	Icon
} from 'antd';

//
let polygonPoints = [];
const domain = "https://test.weiquaninfo.cn";
const FormItem = Form.Item;
const Option = Select.Option;

//
export default class HiYouWxAppMap extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			curLng: null,
			curLat: null,
			curPolgon: null,
			curMarker: null,
			curMarkerInfo: {
				_id: '',
				createTime: '',
				lng: null,
				lat: null,
				name: '',
				desp: '',
				type: 'science',
				thumb: '',
			},
			isSaveMarkerLoading: false,
			markers: [],
			markersInfo: [],
			markersListener: [],
			imageUrl: '',
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
					qq.maps.drawing.OverlayType.MARKER,
					qq.maps.drawing.OverlayType.POLYGON,
				]
			},
			map: this.map,
		});

		// 显示多边形和所有markers
		this.getArea();
		this.getMarkers();

		// 事件
		this.drawPolygonListener = qq.maps.event.addListener(this.drawingManager,
			'polygoncomplete', this.onDrawPolygon.bind(this));
		this.drawMarkerListener = qq.maps.event.addListener(this.drawingManager,
			'markercomplete', this.onDrawMarker.bind(this));
	}

	// 新绘制点
	onDrawMarker(marker) {
		// 删除原有点
		if (this.state.curMarker != null) {
			let curMarker = this.state.curMarker;
			curMarker.setMap(null);
		}
		let lng = parseFloat(marker.getPosition().getLng().toFixed(6));
		let lat = parseFloat(marker.getPosition().getLat().toFixed(6));
		// let curMarkerInfo = this.state.curMarkerInfo;
		let curMarkerInfo = {};
		curMarkerInfo.lng = lng;
		curMarkerInfo.lat = lat;
		curMarkerInfo.type = 'science';
		this.setState({ curMarker: marker, curMarkerInfo: curMarkerInfo, imageUrl: '' });
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
		qq.maps.event.removeListener(this.dragEndListener);
		qq.maps.event.removeListener(this.drawPolygonListener);
		qq.maps.event.removeListener(this.drawMarkerListener);
	}

	// marker name
	onChangeMarkerName(e) {
		let curMarkerInfo = this.state.curMarkerInfo;
		curMarkerInfo.name = e.target.value;
		this.setState(curMarkerInfo: curMarkerInfo);
	}
	onChangeMarkeDesp(e) {
		let curMarkerInfo = this.state.curMarkerInfo;
		curMarkerInfo.desp = e.target.value;
		this.setState(curMarkerInfo: curMarkerInfo);
	}

	// get all markers
	getMarkers() {
		// 清空当前marker
		this.state.markers.map((item) => {
			item.setMap(null);
		})

		// get
		let url = `${domain}/mongo/markers`;
		fetch(url, { method: "GET" })
			.then(res => {
				let contentType = res.headers.get("Content-Type");
				if (res.status == 200 && contentType && contentType.includes("application/json")) {
					return res.json();
				} else {
					throw new Error(`status:${res.status} contentType:${contentType}`);
				}
			})
			.then(resJson => {
				// 显示所有markers
				let markers = [];
				let markersListener = [];
				resJson.map((item, index) => {
					let marker = new qq.maps.Marker({
						position: new qq.maps.LatLng(item.lat, item.lng),
						map: this.map
					})
					markers.push(marker);
					markersListener[index] = qq.maps.event.addListener(marker,
						'click', this.onMarkerClick.bind(this));
				});
				let markersInfo = resJson;
				this.setState({ markers: markers, markersInfo: markersInfo });
			})
			.catch(error => {
				alert(`查询多边形信息失败：${error.message}`);
			})
	}

	// click marker
	onMarkerClick(marker) {
		let lng = marker.latLng.getLng();
		let lat = marker.latLng.getLat();
		let markersInfo = this.state.markersInfo;
		let curMarkerInfo = {};
		for (let i = 0; i < markersInfo.length; i++) {
			if (markersInfo[i].lat == lat && markersInfo[i].lng == lng) {
				curMarkerInfo = markersInfo[i];
				break;
			}
		}
		this.setState({ curMarkerInfo: curMarkerInfo, imageUrl: curMarkerInfo.thumb });
	}

	// save  new marker / update marker
	onSaveMarker() {
		let { name, lng, lat, desp, type } = this.state.curMarkerInfo;
		if (typeof(name) == 'undefined' || name.length == 0 || lng == null || lat == null) {
			message.error("marker信息不全");
			return;
		}
		// 判断是否是新增还是更新
		let isNew = true;
		this.state.markersInfo.map((item) => {
			if (item.lat == lat && item.lng == lng) {
				isNew = false;
			}
		})

		// save
		if (isNew) {
			let url = `${domain}/mongo/markers`;
			fetch(url, {
					method: "POST",
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						name: name,
						type: type,
						desp: desp,
						lng: lng,
						lat: lat,
						thumb: this.state.imageUrl,
					}),
				})
				.then(res => {
					let contentType = res.headers.get("Content-Type");
					if (res.status == 201 && contentType && contentType.includes("application/json")) {
						return res.json();
					} else {
						throw new Error(`status:${res.status} contentType:${contentType}`);
					}
				})
				.then(resJson => {
					this.getMarkers();
					message.success("已成功新增marker");
				})
				.catch(error => {
					alert(`新增marker失败：${error.message}`);
				})
		} else {
			let { _id } = this.state.curMarkerInfo;
			let url = `${domain}/mongo/markers?id=${_id}`;
			fetch(url, {
					method: "PUT",
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						name: name,
						type: type,
						desp: desp,
						lng: lng,
						lat: lat,
						thumb: this.state.imageUrl,
					}),
				})
				.then(res => {
					let contentType = res.headers.get("Content-Type");
					if (res.status == 201 && contentType && contentType.includes("application/json")) {
						return res.json();
					} else {
						throw new Error(`status:${res.status} contentType:${contentType}`);
					}
				})
				.then(resJson => {
					this.getMarkers();
					message.success("已成功更新marker");
				})
				.catch(error => {
					alert(`更新marker失败：${error.message}`);
				})
		}
	}

	// 删除marker
	onDelMarker() {
		let { _id } = this.state.curMarkerInfo;
		let url = `${domain}/mongo/markers?id=${_id}`;
		fetch(url, { method: "DELETE" })
			.then(res => {
				let contentType = res.headers.get("Content-Type");
				if (res.status == 204) {
					this.getMarkers();
					message.success("已成功删除marker");
				} else {
					throw new Error(`status:${res.status} contentType:${contentType}`);
				}
			})
			.catch(error => {
				alert(`更新marker失败：${error.message}`);
			})
	}

	// 文件上传过滤
	onBeforeUpload(file) {
		let isExtSupport = false;
		switch (file.type) {
			case 'image/jpg':
				isExtSupport = true;
				break;
			case 'image/jpeg':
				isExtSupport = true;
				break;
			case 'image/png':
				isExtSupport = true;
				break;
		}
		if (!isExtSupport) {
			message.error('You can only upload JPG/PNG file!');
		}
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			message.error('Image must smaller than 2MB!');
		}

		return isExtSupport && isLt2M;
	}

	// 文件上传状态变更
	onUploadChange(info) {
		let { file, fileList, event } = info;
		if (file.status === 'done') {
			let imageUrl = `${domain}/${file.response}`;
			this.setState({ imageUrl: imageUrl })
		}
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
					<Card title="当前Marker信息"
						bordered={false}
						className="markerCard"
						extra={<Popconfirm title="确认删除marker吗？" onConfirm={this.onDelMarker.bind(this)}
                                    okText="确认" cancelText="取消">
                                    <a href="javascript:;">删除</a>
                                </Popconfirm>}
					>
				    	<Form className="markerForm">
				    		<FormItem
				    			label="Marker名称"
				    		>
				    			<Input value={this.state.curMarkerInfo.name}
				    				onChange={this.onChangeMarkerName.bind(this)}
				    			/>
				    		</FormItem>
				    		<FormItem
				    			label="Marker简述"
				    		>
				    			<Input value={this.state.curMarkerInfo.desp}
				    				onChange={this.onChangeMarkeDesp.bind(this)}/>
				    		</FormItem>
				    		<FormItem
				    			label="Marker类型"
				    		>
				    			<Select defaultValue="science" style={{ width: 120 }}>
							      <Option value="science">景点</Option>
							    </Select>
				    		</FormItem>
				    		<FormItem
				    			label="Marker经度："
				    		>
				    			<span>{this.state.curMarkerInfo.lng}</span>
				    		</FormItem>
				    		<FormItem
				    			label="Marker纬度："
				    		>
				    			<span>{this.state.curMarkerInfo.lat}</span>
				    		</FormItem>
				    		<FormItem
				    			label="Marker缩略图："
				    		>
				    			<Upload className="markerThumbUploader"
				    				name="avatar"
				    				listType="picture-card"
				    				showUploadList={false}
				    				action='https://test.weiquaninfo.cn/mongo/markers/upload'
				    				beforeUpload={this.onBeforeUpload.bind(this)}
				    				onChange={this.onUploadChange.bind(this)}
				    			>
				    				{this.state.imageUrl
				    					?(<img src={this.state.imageUrl}
				    						style={{height: 128, width: 200}}
				    						/>)
				    					:(<div>
				    						<Icon type="plus"></Icon>
				    						<p>上传</p>
				    					</div>)
				    				}
				    			</Upload>
				    		</FormItem>
				    		<FormItem>
		                        <Button 
		                            type="primary"
		                            style={{width: '100%'}}
		                            size="large"
		                            onClick={this.onSaveMarker.bind(this)}
		                            loading={this.state.isSaveMarkerLoading}
		                        >保存</Button>
                    		</FormItem>
				    	</Form>
				    </Card>
				</div>
			</div>
		);
	}
}