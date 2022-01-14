/*
 * @Description: 
 * @Version: 2.0
 * @Author: Zhiqing Zhong
 * @Date: 2021-11-06 19:33:53
 * @LastEditors: Zhiqing Zhong
 * @LastEditTime: 2022-01-14 11:28:32
 */
import { createStore } from "vuex";

const store  = createStore({
	state: {
        user: {}
    },
	mutations: {
        setUser(state, user){
            state.user = user;
        }
    },
	actions: {},
	modules: {},
});

export default store;
