/*
 * @Description: 
 * @Version: 2.0
 * @Author: Zhiqing Zhong
 * @Date: 2021-11-06 19:33:53
 * @LastEditors: Zhiqing Zhong
 * @LastEditTime: 2022-01-14 11:39:56
 */
import { createStore } from "vuex";

declare let SessionStorage : any;
const USER = "user";

const store  = createStore({
	state: {
        user: SessionStorage.get(USER) || {}
    },
	mutations: {
        setUser(state, user){
            state.user = user;
            SessionStorage.set(USER, user);
        }
    },
	actions: {},
	modules: {},
});

export default store;
