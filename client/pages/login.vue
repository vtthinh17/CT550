<template>
    <span>
        <NuxtLink to="/">
            <left-circle-outlined :style="{ fontSize: '1.5rem' }" />
        </NuxtLink>
    </span>
    <div class="login">
        <h1>Đăng nhập</h1>
        <form method="post" @submit.prevent>

            <div class="field">
                <label class="label">Email:</label>

                <div class="control">
                    <input type="email" class="input" name="email" v-model="email">
                </div>
            </div>

            <div class="field">
                <label class="label">Mật khẩu:</label>

                <div class="control">
                    <input type="password" class="input" name="password" v-model="password">
                </div>
            </div>

            <div class="control">
                <a-button style="width: 8rem;" type="primary" class="button is-dark is-fullwidth" @click="dangnhap">Đăng
                    nhập</a-button>
            </div>
        </form>
        <div class="has-text-centered" style="margin-top: 20px">
            <p>
                Chưa có tài khoản? <nuxt-link to="/register">Đăng ký ngay</nuxt-link>
            </p>
        </div>
    </div>
</template>
  
<script>
import { SmileOutlined, MehOutlined } from '@ant-design/icons-vue';
import { notification } from 'ant-design-vue';
import { h } from 'vue';
export default {
    data() {
        return {
            email: '',
            password: '',
            error: null,
        };
    },

    methods: {
        openNotification (mess, des){
            notification.open({
                message: mess,
                description: des,
                placement:'top',
                icon: () =>
                    h(MehOutlined, {
                        style: 'color: red',
                    }),
            });
        },
        async dangnhap() {
            if (this.email != '' && this.password != '') {
                try {
                    const res = await $fetch('http://localhost:8000/users/login', {
                        method: 'POST',
                        body: {
                            username: this.email,
                            password: this.password,
                        }
                    })
                    localStorage.setItem("loginUserID", res._id)
                    // set loginUser profile to local storage or Pinia(global state)
                    if (res.role == '1') {
                        navigateTo('/ungvien')
                    } else if (res.role == '2') {
                        navigateTo('/nhatuyendung')
                    } else {
                        navigateTo('/admin')
                    }

                } catch (error) {
                    this.openNotification('Đã có lỗi xảy ra','Thông tin tài khoản hoặc mật khẩu bạn cung cấp không chính xác. Vui lòng thử lại sau!')
                    console.log("loi:", error)
                }
            } else {
                this.openNotification('Đã có lỗi xảy ra','Vui lòng nhập đầy đủ thông tin!')
            }

        }
    },
};
</script>
<style lang="scss">
.login {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 24vh;
}

.field {
    margin: 0.5rem 0;
}

.control {
    display: flex;
    align-items: center;
    justify-content: center;

    .button {
        border-radius: 6px;
        width: 5rem;
        margin-top: 0.5rem;
        height: 2rem;

    }
}
</style>