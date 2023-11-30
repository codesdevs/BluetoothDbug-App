<script>
export default {
	onLaunch: function () {
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
	}
}
</script>

<style>
/*每个页面公共css */
</style>
