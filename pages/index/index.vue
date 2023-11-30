<template>
	<view class="container">
		<view class="flow">
			<view class="circle">
				<view class="inner-circle"
					:style="{ minWidth: systemHeight / 4 - 50 + 'px', minHeight: systemHeight / 4 - 50 + 'px' }">
					<view class="inner"
						:style="{ minWidth: systemHeight / 4 - 50 + 'px', minHeight: systemHeight / 4 - 50 + 'px' }">
						<view class="content">
							<view class="title">
								TOTAL FLOW
							</view>
							<view style="display: flex;align-items: baseline;">
								<view class="value" :style="{ fontSize: toTalFlowFontSize, fontWeight: '600' }">{{
									totalFlowValue }}
								</view>

							</view>
							<view class="unit">{{ totalFlowUnit }}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="circle" style="margin-top: 90rpx;">
				<view class="inner-circle"
					:style="{ minWidth: systemHeight / 4 - 50 + 'px', minHeight: systemHeight / 4 - 50 + 'px' }">
					<view class="inner"
						:style="{ minWidth: systemHeight / 4 - 50 + 'px', minHeight: systemHeight / 4 - 50 + 'px' }">
						<view class="content">
							<view class="title">
								FLOW RATE
							</view>
							<view style="display: flex;align-items: baseline;">
								<view class="value" :style="{ fontSize: toTalFlowFontSize, fontWeight: '600' }">
									{{ flowRateValue }}</view>

							</view>
							<view class="unit">{{ instantaneousFlowUnit }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 设备操作 -->
		<view class="device-operation">
			<!-- device Address -->
			<view class="device-address">
				<view class="left">
					Device Address
				</view>
				<view class="right">
					<view class="device-operation-circle" @click="addressHandler">
						<view class="device-operation-circle-inner-circle">
							<view class="device-operation-circle-inner-circle-inner">
								<view class="address">
									{{ address }}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- Polling -->
			<view class="device-address device-polling" @click="startPollingHandler"
				:style="{ border: isPolling ? '1rpx solid var(--themeColor)' : '' }">
				<view class="left">
					Polling
				</view>
				<view class="right">
				</view>
			</view>

			<!-- Stop -->
			<view class="device-address device-stop" @click="stopPollingHandler"
				:style="{ border: isPolling == false ? '1rpx solid var(--themeColor)' : '' }">
				<view class="left">
					Stop
				</view>
				<view class="right">
				</view>
			</view>
		</view>
		<!-- 状态 -->
		<view class="page-status">
			<view class="status">
				<!-- Signal Strength -->
				<view class="box">
					<view class="top">
						<view class="status-circle">
							<view class="status-circle-inner-circle">
								<view class="status-circle-inner-circle-inner">
									<!-- {{ signalStrengthValue }} -->
									<image :src="signalStrengthIcon" style="width: 150rpx;height: 70rpx;">
									</image>
								</view>
							</view>
						</view>
					</view>
					<view class="bottom">
						Signal Strength
					</view>
				</view>
				<view class="title">
					E F E X
				</view>
				<!-- Connect -->
				<view class="box" @click="connectHandler">
					<view class="top">
						<view class="status-circle">
							<view class="status-circle-inner-circle">
								<view class="status-circle-inner-circle-inner">
									<image src="../../static/icon/bluetooth.png" style="width: 40rpx;height: 40rpx;">
									</image>
								</view>
							</view>
						</view>
					</view>
					<!-- <view :class="connectStatus ? 'bottom connected' : 'bottom disconnected'">
					Connect
				</view> -->
					<view class="bottom">
						Connect
					</view>
				</view>
			</view>
		</view>

		<uni-popup ref="addressPopup" type="dialog">
			<uni-popup-dialog :before-close="true" mode="base" title="Input Address" @close="closeAddressPopup"
				@confirm="addressPopupConfirm">
				<input class="uni-input" type="number" :value="address > 0 ? address : ''" @input="addressInput"
					placeholder="1-255" />
			</uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="connectPopup" :is-mask-click="false" background-color="rgba(0,0,0,0)" :mask-click="true"
			@close="closeConnectPopup">
			<view class="popup-content">
				<scroll-view scroll-y="true"
					:style="{ maxHeight: systemHeight * 1.5 + 'rpx', minHeight: systemHeight * 1.5 + 'rpx' }">
					<view class="list">
						<view class="item" v-for="(item, index) in deviceList" :key="index" @click="connect(item)">
							<view class="icon">
								<van-image width="30" height="30" src="/static/icon/bluetooth_icon.png" />
							</view>
							<view class="content">
								<view class="name">{{ item.name }}</view>
								<view class="id">{{ item.deviceId }}</view>
							</view>
							<view class="status">
								<view v-if="item.connectState == 'connecting'" class="connecting">
									<van-image width="15" height="15" src="/static/icon/connecting_icon.png" />
									<view>connecting...</view>
								</view>
								<view v-if="item.connectState == 'connected'" class="connected">
									<van-image width="30" height="13" src="/static/icon/connected_icon.png" />
									<view>connection successful</view>
								</view>

								<view v-if="item.connectState == 'connectFail'" class="connectFail">
									<van-image width="30" height="16" src="/static/icon/connectFail_icon.png" />
									<view>connect failed</view>
								</view>
								<view v-if="item.connectState == ''" class="signal">
									{{ item.RSSI }}
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<!-- close -->
			<view class="close" @click="closeConnectPopup">
				<image class="close_popup" src="/static/icon/close_popup.png" mode="widthFix" lazy-load="false" binderror=""
					bindload="">

				</image>
			</view>
		</uni-popup>
	</view>
</template>
<script>
import { bluetoothEnumValue, totalFlowUnitValue, instantFlowUnitValue } from '@/enum'
import { ab2hex, hexStringToArrayBuffer, decToHex, hexStrToCRC16Modbus, floatHexToDec, hexToDec, formatDecimal } from '@/utils/tools'
var index = 0;
export default {
	data() {
		return {
			systemHeight: 800,
			systemWidth: 375,
			toTalFlowFontSize: '60rpx',
			totalFlowValue: '0.00',
			flowRateValue: '0.00',
			tempAddress: 0,
			address: 1,
			connectStatus: false,
			isOpenBluetooth: false,
			deviceList: [],
			deviceLists: [],
			device: {
				deviceId: '',
				serviceId: '',
				characteristicId: '',
				signalStrength: 0,
			},
			bluetoothInitStateCode: 0,
			signalStrengthIcon: '/static/icon/signalStrength-0.png',
			signalStrengthValue: 0,
			timer: null,
			filterDeviceOptions: [
				{
					text: 'BT',
					value: 0
				},
				{
					text: 'JDY',
					value: 0
				},
				{
					text: 'CZBLE',
					value: 0
				},
			],
			dropdownValue: 0,
			//是否轮询
			isPolling: false,
			//获取总累计hex
			totalFlowHexAndInstantaneousFlow: '03 80 00 00 16',
			isConnected: false,
			tempTotalFlowHexAndInstantaneousFlow: '',
			tempTotalFlow: 0,
			tempInstantaneousFlow: 0,
			//获取总累计小数位和总累计单位
			totalFlowDecimalAndUnit: '03 80 47 00 19',
			//总累计单位
			totalFlowUnit: 'm3',
			//瞬时单位
			instantaneousFlowUnit: 'm3/hr',
			//瞬时累计小数位
			instantaneousFlowDecimal: 2,
		}
	},
	onLoad() {
		this.isCheckOpenBluetooth()
		//获取设备宽高
		uni.getSystemInfo({
			success: (res) => {
				console.log(res)
				this.systemHeight = res.windowHeight
				this.systemWidth = res.windowWidth
			}
		})
	},
	// 关闭页面
	onUnload() {
		console.log("onUnload")
		this.close()
	},
	watch: {
		signalStrengthValue(val) {
			val = val.toString().split('-')[1]
			//按照信号强度划分3个等级
			if (val >= 30 && val <= 50) {
				this.signalStrengthIcon = '/static/icon/signalStrength-3.png'
			} else if (val > 50 && val <= 70) {
				this.signalStrengthIcon = '/static/icon/signalStrength-2.png'
			} else if (val > 70 && val <= 99) {
				this.signalStrengthIcon = '/static/icon/signalStrength-1.png'
			}
		},
		isPolling(val) {
			console.log(val)
			if (val) {
				this.timer = setInterval(() => {
					this.writeBLECharacteristicValue(this.totalFlowHexAndInstantaneousFlow)
					this.getConnectedBluetoothSignalStrength()
				}, 1000)
			} else {
				clearInterval(this.timer)
			}
		},
		isConnected(val) {
			console.log("isConnected", val)
			if (val) {
				console.log("连接成功")
				this.isPolling = true
			} else {
				console.log("断开连接")
				this.isPolling = false
			}
		},
		flowRateValue(val) {
			console.log("flowRateValue", val)
			if (val == '') {
				return
			}
			//获取总累计小数和总累计单位
			this.writeBLECharacteristicValue(this.totalFlowDecimalAndUnit)
		},
	},
	methods: {
		isCheckOpenBluetooth() {
			var that = this;
			const BluetoothAdapter = plus.android.importClass('android.bluetooth.BluetoothAdapter'); // 引入Java 蓝牙类
			const blueadapter = BluetoothAdapter.getDefaultAdapter(); //拿到默认蓝牙适配器方法
			if (blueadapter) {
				// 判断蓝牙是否开启
				if (blueadapter.isEnabled()) {
					this.initBluetooth()
				} else {
					// 未开启弹出提示框
					const blueadapter = BluetoothAdapter.getDefaultAdapter();
					if (blueadapter != null) {
						if (blueadapter.enable()) {
							that.isOpenBluetooth = true
							this.initBluetooth()
						} else {
							that.isCheckOpenBluetooth();
						}
					}
				}
			}

		},
		addressHandler() {
			if (this.device.deviceId == '') {
				uni.showToast({
					icon: 'none',
					title: 'Please connect the device first',
					mask: true,
					duration: 2000
				});
				return
			}
			this.$refs.addressPopup.open('center')
		},
		closeAddressPopup() {
			this.$refs.addressPopup.close()
		},
		addressPopupConfirm() {
			if (this.tempAddress == 0) {
				//提示用户请先输入地址
				uni.showToast({
					title: 'Please enter address',
					icon: 'none'
				})
				return
			}
			if (this.tempAddress < 1 || this.tempAddress > 255) {
				uni.showToast({
					title: 'Address range 1-255',
					icon: 'none'
				})
				return
			} else {
				this.address = this.tempAddress
				this.$refs.addressPopup.close()
			}
		},
		closeConnectPopup() {
			this.$refs.connectPopup.close()
			this.deviceList = []
			this.deviceLists = []
		},
		addressInput(e) {
			if (this.device.deviceId == '') {
				uni.showToast({
					icon: 'none',
					title: 'Please connect the device first',
					mask: true,
					duration: 2000
				});
				return
			}
			this.tempAddress = e.detail.value
		},

		initBluetooth() {
			var that = this;
			uni.openBluetoothAdapter({
				success: function (res) {
					console.log(res)
				},
				fail: function (res) {
					console.log(res)
					that.bluetoothInitStateCode = res.errCode
					uni.showToast({
						icon: 'none',
						title: bluetoothEnumValue(res.errCode),
						mask: true,
						duration: 2000
					});
				}
			})
		},

		connectHandler() {
			console.log("点击了连接")
			this.deviceList = []
			this.deviceLists = []
			this.searchDevice()
			this.$refs.connectPopup.open('center')
		},
		connectPopupConfirm() {

		},

		//索附近设备
		searchDevice() {
			var that = this;
			uni.startBluetoothDevicesDiscovery({
				success: function (res) {
					console.log(res)
					that.bluetoothInitStateCode = res.errno
				},
				fail: function (res) {
					console.log(res)
					that.bluetoothInitStateCode = res.errCode
					uni.showToast({
						icon: 'none',
						title: bluetoothEnumValue(res.errCode),
						mask: true,
						duration: 2000
					});
				}
			})
			uni.onBluetoothDeviceFound(function (devices) {
				that.addDeviceList(devices)
			})
			// that.getPairedDevice()
		},
		//添加设备列表
		addDeviceList(devices) {
			var that = this;
			var isExist = false;
			if (devices.deviceId) {
				if (devices.advertisData) {
					devices.advertisData = ab2hex(devices.advertisData)
				} else {
					devices.advertisData = ''
				}
				that.deviceList.forEach(item => {
					if (item.deviceId == devices.deviceId) {
						isExist = false;
					}
				});
				if (isExist) {
					that.deviceList.push(devices)
				}
			} else if (devices.devices) {
				that.deviceList.forEach(item => {
					if (item.deviceId == devices.devices[0].deviceId) {
						isExist = true;
					}
				});
				if (!isExist) {
					var isFilter = false;
					that.filterDeviceOptions.forEach(item => {
						if (devices.devices[0].name.indexOf(item.text) >= 0) {
							devices.devices[0].connectState = ''
							that.deviceLists.push(devices.devices[0])
							isFilter = true
						}
					});
					if (isFilter) {
						if (that.dropdownValue == 0) {
							that.deviceList.push(devices.devices[0])
						} else {
							if (devices.devices[0].name.indexOf(that.filterDeviceOptions[that.dropdownValue].text) >= 0) {
								devices.devices[0].connectState = ''
								that.deviceList.push(devices.devices[0])
							}
						}
					}
					that.deviceList.sort((a, b) => {
						return b.RSSI - a.RSSI
					})
				}
			}
		},
		//获取本机已配对的蓝牙设备
		getPairedDevice() {
			var that = this;
			uni.getBluetoothDevices({
				success: function (res) {
					console.log(res)
					// that.bluetoothInitStateCode = res.errno
				},
				fail: function (res) {
					console.log(res)
					// that.bluetoothInitStateCode = res.errCode
				}
			})
		},

		connect(item) {
			this.isConnected = false
			this.close();
			console.log("item", item)
			console.log("this.device", this.device)
			if (item.connectState == 'connecting') {
				return
			}
			item.connectState = 'connecting'
			var that = this;
			uni.createBLEConnection({
				deviceId: item.deviceId,
				timeout: 8000,
				success: function (res) {
					setTimeout(function () {
						//设置蓝牙mtu
						var mtu = 120;
						uni.setBLEMTU({
							deviceId: item.deviceId,//蓝牙设备ID
							mtu,
							success: (res) => {
								console.log("setBLEMTU success>>", res)
							},
							fail: (res) => {
								console.log("setBLEMTU fail>>", res)
							}
						});
					}, 1000)
					console.log(res)
					item.connectState = 'connected'
					that.$refs.connectPopup.close()
					that.device.deviceId = item.deviceId
					that.signalStrengthValue = item.RSSI
					that.getBLEDeviceServices()
				},
				fail: function (res) {
					console.log(res)
					item.connectState = 'connectFail'
					uni.showToast({
						title: 'connectFail',
						icon: 'none',
						duration: 2000
					})
				}
			})
		},
		startPollingHandler() {
			if (this.device.deviceId == '') {
				uni.showToast({
					icon: 'none',
					title: 'Please connect the device first',
					mask: true,
					duration: 2000
				});
				return
			}
			if (this.isPolling) {
				return
			}
			uni.showToast({
				title: 'Start Polling',
				icon: 'none'
			})
			this.isPolling = true
		},
		stopPollingHandler() {
			if (this.device.deviceId == '') {
				uni.showToast({
					icon: 'none',
					title: 'Please connect the device first',
					mask: true,
					duration: 2000
				});
				return
			}
			if (!this.isPolling) {
				return
			}
			uni.showToast({
				title: 'Stop Polling',
				icon: 'none'
			})
			this.isPolling = false
		},

		//获取蓝牙设备所有服务
		getBLEDeviceServices() {
			var that = this;
			console.log("getBLEDeviceServices", that.device.deviceId)
			setTimeout(() => {
				uni.getBLEDeviceServices({
					deviceId: that.device.deviceId,
					success: res => {
						console.log('设备的服务信息：', res);
						for (let i = 0; i < res.services.length; i++) {
							if (res.services[i].isPrimary) {
								that.getBLEDeviceCharacteristics(res.services[i].uuid)
							}
						}
					},
					fail: err => {
						console.log('getBLEDeviceServices fail', res)
						uni.showToast({
							title: bluetoothEnumValue(res.errCode),
							icon: 'none'
						})
					},
				})
			}, 1500);
		},
		//获取蓝牙设备特征值
		getBLEDeviceCharacteristics(uuid) {
			console.log("getBLEDeviceCharacteristics", uuid)
			var that = this;
			uni.getBLEDeviceCharacteristics({
				deviceId: that.device.deviceId,
				serviceId: uuid,
				success: (res) => {
					console.log('getBLEDeviceCharacteristics success', res)
					for (let i = 0; i < res.characteristics.length; i++) {
						let item = res.characteristics[i]
						if (item.properties.notify && item.properties.write && item.properties.read) {
							that.device.serviceId = uuid;
							that.device.characteristicId = item.uuid
							that.notifyBLECharacteristicValueChange()
							break;
						}
					}
				},
				fail: (res) => {
					console.log('getBLEDeviceCharacteristics fail', res)
					uni.showToast({
						title: bluetoothEnumValue(res.errCode),
						icon: 'none'
					})
				}
			})
		},
		//启用低功耗蓝牙设备特征值变化时的 notify 功能
		notifyBLECharacteristicValueChange() {
			var that = this;
			uni.notifyBLECharacteristicValueChange({
				deviceId: this.device.deviceId,
				serviceId: this.device.serviceId,
				characteristicId: this.device.characteristicId,
				state: true,
				success: (res) => {
					console.log('notifyBLECharacteristicValueChange success', res)
					that.onBLECharacteristicValueChange()
					setTimeout(() => {
						that.isConnected = true
					}, 1500);
				},
				fail: (res) => {
					console.log('notifyBLECharacteristicValueChange fail', res)
					uni.showToast({
						title: bluetoothEnumValue(res.errCode),
						icon: 'none'
					})
				}
			})
		},

		//监听蓝牙设备的特征值变化
		onBLECharacteristicValueChange() {
			console.log('onBLECharacteristicValueChange')
			uni.onBLECharacteristicValueChange((res) => {
				//转换成16进制
				var hex = ab2hex(res.value)
				if (!hex) {
					return
				}
				console.log("=================设备回复日志方法开始=================")
				console.log("=================原始报文数据==>："+hex+"=================")
				console.log("=================原始报文数据长度==>："+hex.length+"=================")
				let value = hex.substring(6, hex.length - 8)
				console.log("=================去掉前6位和后8位的数据==>："+value+"=================")
				console.log("=================去掉前6位和后8位的数据长度==>："+value.length+"=================")
				switch (value.length) {
					case 84:
						console.log("=================设备回复流量数据报文开始=================")
						// //瞬时流量
						var flowRate = value.substring(8, 16)
						console.log("=================瞬时流量16进制==>：" + flowRate + "=================")
						// //将flowRate反转，思路：将flowRate分割成2组，如40004660，他应该是['4000','4660']
						// //然后将这2组反转，['0040','6046']，然后再拼接成字符串，'00406046'
						var len = 4;
						flowRate = flowRate.match(new RegExp('.{1,' + len + '}', 'g')).reverse().join('')
						// //将16进制转成10进制 单精度浮点数
						console.log("=================将瞬时流量16进制转成10进制 单精度浮点数==>：" + flowRate + "=================")
						console.log("=================将瞬时流量16进制转成10进制 单精度浮点数==>：" + floatHexToDec(flowRate) + "=================")
						//瞬时流量,保留4位小数，不要四舍五入
						this.flowRateValue = formatDecimal(floatHexToDec(flowRate), this.instantaneousFlowDecimal)
						// this.tempInstantaneousFlow = floatHexToDec(flowRate)
						//累计流量
						var totalFlow = value.substring(40, 48)
						console.log("=================累计流量16进制==>：" + totalFlow + "=================")
						totalFlow = totalFlow.match(new RegExp('.{1,' + len + '}', 'g')).reverse().join('')
						console.log("=================累计流量16进制反转==>：" + totalFlow + "=================")
						console.log("=================累计流量16进制反转后转成10进制==>：" + hexToDec(totalFlow) + "=================")
						this.tempTotalFlow = hexToDec(totalFlow)
						console.log("=================设备回复流量数据报文结束=================")
						break;
					case 96:
						console.log("=================设备回复总累计、瞬时流量小数位和总累计单位、瞬时流量单位报文开始=================")
						//总累计小数位
						var totalFlowDecimal = value.substring(88, 90)
						console.log("=================总累计小数位16进制==>：" + totalFlowDecimal + "=================")
						console.log("=================将总累计小数位16进制转成10进制==>：" + hexToDec(totalFlowDecimal) + "=================")
						//将上次的总累计流量取小数位
						//取规则，如果是3位小数那就是/1000，如果是2位小数那就是/100，如果是1位小数那就是/10
						this.totalFlowValue = formatDecimal(this.tempTotalFlow / Math.pow(10, hexToDec(totalFlowDecimal)), hexToDec(totalFlowDecimal))
						console.log("=================将小数位按照Math.pow求出总累计流量==>：" + this.totalFlowValue + "=================")
						// //瞬时累计小数位
						var instantaneousFlowDecimal = value.substring(90, 92)
						console.log("=================瞬时流量小数位16进制==>：" + instantaneousFlowDecimal + "=================")
						console.log("=================将瞬时流量小数位16进制转成10进制==>：" + hexToDec(instantaneousFlowDecimal) + "=================")
						// //将上次的瞬时累计流量取小数位
						// //取规则，如果是3位小数那就是/1000，如果是2位小数那就是/100，如果是1位小数那就是/10
						// console.log("this.tempInstantaneousFlow / Math.pow(10, hexToDec(instantaneousFlowDecimal))", this.tempInstantaneousFlow / Math.pow(10, hexToDec(instantaneousFlowDecimal)))
						// console.log("解析后的瞬时流量：",formatDecimal(this.tempInstantaneousFlow, hexToDec(instantaneousFlowDecimal)))
						// this.flowRateValue = formatDecimal(this.tempInstantaneousFlow, hexToDec(instantaneousFlowDecimal))
						this.instantaneousFlowDecimal = hexToDec(instantaneousFlowDecimal)
						console.log("=================瞬时流量10进制最终结果" + this.flowRateValue + "=================")

						//总累计单位
						var totalFlowUnit = value.substring(0, 2)
						console.log("=================总累计单位16进制==>：" + totalFlowUnit + "=================")
						console.log("=================将总累计单位16进制转成10进制==>：" + hexToDec(totalFlowUnit) + "=================")
						//根据总累计单位，判断单位
						this.totalFlowUnit = totalFlowUnitValue(hexToDec(totalFlowUnit))
						console.log("=================总累计单位转换后的" + this.totalFlowUnit + "=================")
						//瞬时累计单位
						var instantaneousFlowUnit = value.substring(2, 4)
						console.log("=================瞬时累计单位16进制==>：" + instantaneousFlowUnit + "=================")
						console.log("=================将瞬时累计单位16进制转成10进制==>：" + hexToDec(instantaneousFlowUnit) + "=================")
						//根据瞬时累计单位，判断单位
						this.instantaneousFlowUnit = instantFlowUnitValue(hexToDec(instantaneousFlowUnit))
						console.log("=================瞬时累计单位转换后的" + this.instantaneousFlowUnit + "=================")
						console.log("=================设备回复总累计、瞬时流量小数位和总累计单位、瞬时流量单位报文结束=================")
						break;
					default:
						console.log("========其他长度value：", value)
						console.log("========其他长度value length：", value.length)
						break;
				}
				console.log("=================设备回复日志方法结束=================")
			})
		},
		close() {
			if (this.device.deviceId == '') {
				return
			}
			var that = this;
			uni.closeBLEConnection({
				deviceId: this.device.deviceId,
				success: (res) => {
					console.log('closeBLEConnection success', res)
					that.deviceList.forEach(item => {
						if (item.deviceId == that.device.deviceId) {
							item.connectState = ''
						}
					});
				},
				fail: (res) => {
					console.log('closeBLEConnection fail', res)
					uni.showToast({
						title: bluetoothEnumValue(res.errCode),
						icon: 'none'
					})
				}
			})
		},
		//写入数据
		writeBLECharacteristicValue(hexStr) {
			console.log("this.device", this.device)
			var that = this;
			console.log("decToHex(this.address) + hexStr + hexStrToCRC16Modbus(decToHex(this.address) + hexStr)", decToHex(this.address) + hexStr + hexStrToCRC16Modbus(decToHex(this.address) + hexStr))
			var buffer = hexStringToArrayBuffer(decToHex(this.address) + hexStr + hexStrToCRC16Modbus(decToHex(this.address) + hexStr))
			console.log(buffer)
			uni.writeBLECharacteristicValue({
				// 这里的 deviceId 需要在 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
				deviceId: this.device.deviceId,
				// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
				serviceId: this.device.serviceId,
				// 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
				characteristicId: this.device.characteristicId,
				// 这里的value是ArrayBuffer类型
				value: buffer,
				success(res) {
					console.log('writeBLECharacteristicValue success', res)
				},
				fail(res) {
					console.log('writeBLECharacteristicValue fail', res)
					uni.showToast({
						title: bluetoothEnumValue(res.errCode),
						icon: 'none'
					})
					that.hexStr = ''
				}
			})
		},
		//获取当前连接设备的信号强度
		getConnectedBluetoothSignalStrength() {
			var that = this;
			uni.getBluetoothDevices({
				success: function (res) {
					console.log(res)
					res.devices.forEach(item => {
						if (item.deviceId == that.device.deviceId) {
							that.signalStrengthValue = item.RSSI
							console.log("获取的信号值", item.RSSI)
						}
					});
				},
				fail: function (res) {
					console.log(res)
					// that.bluetoothInitStateCode = res.errCode
				}
			})
		},
	},
}
</script>
<style lang="scss">
page {
	--themeColor: #329078;
}

.container {
	padding-top: 100rpx;
}

.connected {
	color: #0fd41e;
}

.disconnected {
	color: #d41e1e;
}

.flow {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	margin: 40rpx 0;

	.title {
		font-size: 25rpx;
		margin: 30rpx 0;
	}

	.circle,
	.inner-circle,
	.inner {
		display: inline-block;
		border-radius: 50%;
		color: #000000;
		white-space: nowrap;
		line-height: 1;
		text-align: center;
	}

	.circle {
		// 左下246456，右上318d78
		background: linear-gradient(to top left, #246456, #318d78);
		box-shadow: 0 0 30rpx #909090;
		padding: 30rpx;

		.inner-circle {
			min-width: 300rpx;
			min-height: 300rpx;
			background: linear-gradient(to top right, #f7f7f7, #e3e3e3);
			box-shadow: 0 0 10rpx #5e5e5e;
			padding: 30rpx;
			border: 10rpx solid #ffffff;

			.inner {
				min-width: 300rpx;
				min-height: 300rpx;
				background: linear-gradient(to top left, #c8c8c8, #ffffff);
				box-shadow: 0 0 30rpx #909090;
				padding: 30rpx;

				.content {
					.title {
						display: block;
						margin-top: 0;
						font-weight: 800;
						margin-bottom: 40rpx;
						font-size: 30rpx;
					}

					.value {
						margin: 0 auto;
					}
				}


				.unit {
					font-size: 20rpx;
					margin-left: 10rpx;
				}
			}
		}
	}

	.circle:before,
	.inner-circle:before,
	.inner:before {
		content: "";
		display: inline-block;
		vertical-align: middle;
		padding-top: 100%;
		height: 0;
	}

	.circle view,
	.inner-circle view,
	.inner view {
		display: inline-block;
		vertical-align: middle;
	}
}

.device-operation {
	display: flex;
	flex-direction: row;
	height: 100%;
	padding: 30rpx 30rpx 20rpx 30rpx;
	justify-content: space-between;
	font-weight: 800;

	.device-address {
		height: 60rpx;
		background: linear-gradient(to right, #d8dcdd, #f7f7f7);
		border-radius: 60rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		font-size: 20rpx;
		padding: 10rpx 0 10rpx 30rpx;

		.right {
			margin-left: 30rpx;
		}
	}

	.device-polling,
	.device-stop {
		min-width: 150rpx;
		border: 1px solid #d8dcdd;
	}
}

.device-operation {
	// padding-top: 100rpx;

	.device-operation-circle,
	.device-operation-circle-inner-circle,
	.device-operation-circle-inner-circle-inner {
		border-radius: 50%;
		justify-content: center;
		align-items: center;
		text-align: center;
		display: flex;
	}

	.device-operation-circle {
		background-color: #329078;
		color: #000;
		width: 80rpx;
		height: 80rpx;

	}

	.device-operation-circle-inner-circle,
	.device-operation-circle-inner-circle-inner {
		width: 55rpx;
		height: 55rpx;
	}

	.device-operation-circle-inner-circle {
		background: linear-gradient(to left, #f7f7f7, #e3e3e3);
		box-shadow: 0 0 10rpx #5e5e5e;
		border: 5rpx solid #ffffff;
	}

	.device-operation-circle-inner-circle-inner {
		background: linear-gradient(to right, #f7f7f7, #e3e3e3);
		box-shadow: 0 0 4rpx #5e5e5e;

		.address {
			font: 20rpx Arial, sans-serif;
		}
	}
}

.page-status {
	.status {
		display: flex;
		justify-content: space-between;
		padding: 30rpx 50rpx;
		align-items: center;
		// position: absolute;
		// bottom: 0;
		// right: 0;
		// left: 0;

		.box {
			display: flex;
			flex-direction: column;
			text-align: center;
			align-items: center;
			// flex: 2;

			.bottom {
				font-weight: 800;
				font-size: 25rpx;
				margin-top: 15rpx;
			}
		}

		.title {
			font-size: 50rpx;
			font-weight: 800;
			margin-right: 50rpx;
		}

		.status-circle,
		.status-circle-inner-circle,
		.status-circle-inner-circle-inner {
			border-radius: 50%;
			justify-content: center;
			align-items: center;
			text-align: center;
			display: flex;
		}

		.status-circle {
			background-color: #329078;
			color: #000;
			width: 100rpx;
			height: 100rpx;
		}

		.status-circle-inner-circle {
			width: 75rpx;
			height: 75rpx;
			background: linear-gradient(to left, #f7f7f7, #e3e3e3);
			box-shadow: 0 0 10rpx #5e5e5e;
			border: 5rpx solid #ffffff;
		}

		.status-circle-inner-circle-inner {
			width: 70rpx;
			height: 70rpx;
			background: linear-gradient(to right, #f7f7f7, #e3e3e3);
			box-shadow: 0 0 4rpx #5e5e5e;

			.address {
				font: 20rpx Arial, sans-serif;
				;
			}
		}
	}
}



.popup-content {
	background-color: #fff;
	border-radius: 20px;
	padding: 70rpx 0;
}

.list {
	padding: 50rpx;
	width: 80vw;

	.item {
		height: 100rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 30rpx;
		border-bottom: 1rpx solid #e8e8e8;
		padding-bottom: 15rpx;

		//内容
		.content {
			margin-left: 20rpx;
			//宽度是父元素的剩余宽度
			display: flex;
			flex-direction: column;
			//设备id不换行，超出显示省略号
			overflow: hidden;
			flex: 1;

			.id {
				font-size: 30rpx;
				color: #999;
				overflow: hidden;
				margin-top: 20rpx;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}

		.status {
			text-align: center;
			color: var(--themeColor);

			view {
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: row;
			}

			.connected {
				color: #67C23A;
			}

			.connectFail {
				color: #c71818;
			}

			.signal {
				justify-content: right;
				font-weight: 800;
				text-align: right;
			}
		}
	}
}

.close {
	position: absolute;
	top: 0;
	right: 0;
	width: 100rpx;
	height: 100rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 40rpx;
	color: #999;

	.close_popup {
		width: 40rpx;
		height: 40rpx;
	}
}
</style>