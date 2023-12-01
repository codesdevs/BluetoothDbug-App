
export default {
    state: {
        //历史连接设备
        historyDeviceList: [],
    },
    getters: {
    },
    mutations: {
        initHistoryDeviceList(state) {
            console.log("====initHistoryDeviceList====")
            let historyDeviceList = uni.getStorageSync('historyDeviceList');
            if (historyDeviceList) {
                historyDeviceList = JSON.parse(historyDeviceList);
                state.historyDeviceList = historyDeviceList;
            }
            console.log(state.historyDeviceList)
        },
        //添加历史连接设备
        addHistoryDeviceList(state, device) {
            console.log("====addHistoryDeviceList====")
            console.log("====需要添加的设备====")
            console.log(device)
            var historyDeviceList = state.historyDeviceList;
            console.log("====当前历史设备列表====")
            console.log(historyDeviceList)
            let index = historyDeviceList.findIndex(item => item.deviceId === device.deviceId);
            console.log("====addHistoryDeviceList==>：" + index + "====")
            if (index === -1) {
                historyDeviceList.push(device);
                state.historyDeviceList = historyDeviceList;
                console.log("state.historyDeviceList", state.historyDeviceList)
                uni.setStorageSync('historyDeviceList', JSON.stringify(state.historyDeviceList));
            }
        },
        //修改设备名称
        updateHistoryDeviceName(state, device) {
            console.log("====updateHistoryDeviceName====")
            console.log(device)
            var historyDeviceList = state.historyDeviceList;
            console.log("====当前历史设备列表====")
            console.log(historyDeviceList)
            let index = historyDeviceList.findIndex(item => item.deviceId === device.deviceId);
            console.log("index", index)
            if (index !== -1) {
                historyDeviceList[index].label = device.label;
                state.historyDeviceList = historyDeviceList;
                console.log("state.historyDeviceList", state.historyDeviceList)
                uni.setStorageSync('historyDeviceList', JSON.stringify(state.historyDeviceList));
            }
        },
    },
    actions: {
    }
}