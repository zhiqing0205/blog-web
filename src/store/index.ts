/*
 * @Description: 
 * @Version: 2.0
 * @Author: Zhiqing Zhong
 * @Date: 2021-11-06 19:33:53
 * @LastEditors: Zhiqing Zhong
 * @LastEditTime: 2022-01-17 01:02:31
 */
import { createStore } from "vuex";

declare let SessionStorage : any;
const USER = "user";
const MESSAGEDATA = "MESSAGEDATA"

const store  = createStore({
	state: {
        user: SessionStorage.get(USER) || {},
        messageData: SessionStorage.get(MESSAGEDATA) || []
    },
	mutations: {
        setUser(state, user){
            state.user = user;
            SessionStorage.set(USER, user);
        },
        setMessageData(state, massage){
            state.messageData = massage;
            SessionStorage.set(MESSAGEDATA, massage);
        }
    },
	actions: {},
	modules: {},
});

export default store;
