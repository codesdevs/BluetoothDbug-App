const bluetoothEnum = {
    "0": 'normal',
    "-1": 'connected',
    "10000": 'uninitialized bluetooth adapter',
    "10001": 'current bluetooth adapter is not available',
    "10002": 'no specified device found',
    "10003": 'connection failed',
    "10004": 'no specified service found',
    "10005": 'no specified characteristic found',
    "10006": 'current connection has been disconnected',
    "10007": 'current characteristic does not support this operation',
    "10008": 'all other exceptions reported by the system',
    "10009": 'Android system-specific, BLE is not supported if the system version is lower than 4.3',
    "10010": 'connected',
    "10011": 'paired device requires pairing code',
    "10012": 'connection timed out',
    "10013": 'connection deviceId is empty or the format is incorrect',
};
function bluetoothEnumValue(key) {
    return bluetoothEnum[key];
}
//累计单位
const totalFlowUnit = {
    '0': 'L',
    '1': 'm3',
    '2': 'Kg',
    '3': 'T',
    '4': 'Gal-uk',
    '5': 'Gal-us',
};
function totalFlowUnitValue(key) {
    return totalFlowUnit[key];
}

//瞬时单位
const instantFlowUnit = {
    '0': 'L/H',
    '1': 'L/M',
    '2': 'L/S',
    '3': 'm3/H',
    '4': 'm3/M',
    '5': 'm3/S',
    '6': 'kg/H',
    '7': 'kg/M',
    '8': 'kg/S',
    '9': 't/H',
    '10': 't/M',
    '11': 't/S',
    '12': 'Gal/H-uk',
    '13': 'Cal/M-uk',
    '14': 'Gal/S-uk',
    '15': 'Gal/H-us',
    '16': 'Gal/M-us',
    '17': 'Gal/S-us'
};
function instantFlowUnitValue(key) {
    return instantFlowUnit[key];
}
export { bluetoothEnumValue, totalFlowUnitValue, instantFlowUnitValue };