import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import page from './modules/page'
import device from './modules/device'
export default new Vuex.Store({
    modules: {
        page,
        device
    }
});