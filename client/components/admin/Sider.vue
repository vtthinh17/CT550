<template>
    <a-layout-sider v-model:collapsed="collapsed" collapsible width="15rem">
        <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
            <a-menu-item key="1">
                <template #icon>
                    <home-outlined />
                </template>
                <NuxtLink to="/admin">Trang chủ</NuxtLink>
            </a-menu-item>
            <a-sub-menu key="sub1">
                <template #title>
                    <span>
                        <user-outlined />
                        <span>Quản lý người dùng</span>
                    </span>
                </template>
                <a-menu-item key="3">
                    <NuxtLink to="/admin/users/candidates/">Quản lý ứng viên</NuxtLink>
                </a-menu-item>
                <a-menu-item key="4">
                    <NuxtLink to="/admin/users/companies/">Quản lý nhà tuyển dụng</NuxtLink>
                </a-menu-item>
            </a-sub-menu>
            <a-sub-menu key="sub2">
                <template #title>
                    <span>
                        <team-outlined />
                        <span>Quản lý tin tuyển dụng</span>
                    </span>
                </template>
                <a-menu-item key="5">
                    <NuxtLink to="/admin/posts">Danh sách tin tuyển dụng</NuxtLink>
                </a-menu-item>
                <!-- <a-menu-item key="8">Team 2</a-menu-item> -->
            </a-sub-menu>
            <a-menu-item key="6">
                <template #icon>
                    <LockOutlined />
                </template>
                <NuxtLink v-if="userLogin && userLogin.role == '3'" @click="logout">Đăng Xuất</NuxtLink>
                <NuxtLink v-else to="/login">Đăng Nhập</NuxtLink>
            </a-menu-item>
        </a-menu>
    </a-layout-sider>
</template>
<script>
import { ref } from 'vue';

export default {
    setup() {
        const collapsed = ref(false);
        const selectedKeys = ref(['1']);

        return {
            collapsed, selectedKeys
        }
    },
    data() {
        return {
            isLogin: false,
            userLogin: {},
        }
    },
    methods: {
        logout() {
            console.log("thoat")
            localStorage.removeItem("loginUserID");
            navigateTo('/login')
        },
    },
    async mounted() {
        if (process.client) {
            this.isLogin = localStorage.getItem('loginUserID');
            if (this.isLogin) {
                this.userLogin = await $fetch('http://localhost:8000/users/getUser/' + this.isLogin);
            }
        }
    },
}
</script>
<style>
#components-layout-demo-side .logo {
    height: 32px;
    margin: 16px;
    background: rgba(255, 255, 255, 0.3);
}

.site-layout .site-layout-background {
    background: #fff;
}

[data-theme='dark'] .site-layout .site-layout-background {
    background: #141414;
}
</style>