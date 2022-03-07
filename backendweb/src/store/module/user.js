import { login,logout } from '@/api/systemUser'
// import { jsonInBlacklist } from '@/api/jwt'
import router from '@/router/index'
export const user = {
    namespaced: true,
    state: {
        userInfo: {
            // uuid: "",
            nickName: "",
            headerImg: "",
            // authority: "",
        },
        token: "",
    },
    mutations: {
        setUserInfo(state, userInfo) {
            // 这里的 `state` 对象是模块的局部状态
            state.userInfo = userInfo
        },
        setToken(state, token) {
            // 这里的 `state` 对象是模块的局部状态
            state.token = token
        },
        NeedInit(state) {
            state.userInfo = {}
            state.token = ""
            sessionStorage.clear()
            router.push({ name: 'init', replace: true })

        },
        LoginOut(state) {
            state.userInfo = {}
            state.token = ""
            sessionStorage.clear()
            router.push({ name: 'login', replace: true })
            window.location.reload()
        },
        ResetUserInfo(state, userInfo = {}) {
            state.userInfo = {
                ...state.userInfo,
                ...userInfo
            }
        },
        CHANGE_AVATAR_STORE(state, avatar) {
            state.userInfo.headerImg=avatar
        }
    },
    actions: {
        async LoginIn({ commit, dispatch, rootGetters, getters }, loginInfo) {
            const res = await login(loginInfo)
            if (res.code == 200) {
                commit('setUserInfo', res.data.user)
                commit('setToken', res.data.token)
                await dispatch('router/SetAsyncRouter', {}, { root: true })
                const asyncRouters = rootGetters['router/asyncRouters']
                console.log('-------------login-asyncRouters----------')
                console.log(asyncRouters)
                router.addRoutes(asyncRouters)
                router.push({ name: getters["userInfo"].authority.defaultRouter })
                return true
            }
        },
        async LoginOut({ commit }) {
            const res = await logout() 
            if (res.code == 200) {
                commit("LoginOut")
            }
        },
        async changeAvatarStore({ commit },avatar) {
            commit("CHANGE_AVATAR_STORE",avatar)
        }
    },
    getters: {
        userInfo(state) {
            return state.userInfo
        },
        token(state) {
            return state.token
        },

    }
}