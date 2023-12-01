<script>
export default {
	onLaunch: function () {
		//清除缓存
		// uni.clearStorageSync();
		const isCheckOpenBluetooth = () => {
			switch (uni.getSystemInfoSync().platform) {
				case 'android':
					let main, BluetoothAdapter, BAdapter;
					main = plus.android.runtimeMainActivity();
					BluetoothAdapter = plus.android.importClass("android.bluetooth.BluetoothAdapter");
					BAdapter = BluetoothAdapter.getDefaultAdapter();

					// 蓝牙未开启，打开蓝牙
					if (!BAdapter.isEnabled()) {
						BAdapter.enable();
					}
					break;
			}
		}
		isCheckOpenBluetooth();
		console.log('App Launch')
	},
	onShow: function () {
		console.log('App Show')
	},
	onHide: function () {
		console.log('App Hide')
	},
	created: function () {
		console.log("App created");
		this.$store.commit("initHistoryDeviceList");
	},
}
</script>

<style>
/*每个页面公共css */
</style>
