<template>
  <span>
    <NuxtLink to="/">
      <left-circle-outlined :style="{ fontSize: '1.5rem' }" />
    </NuxtLink>
  </span>
  <div class="register">

    <h1>Bạn muốn đăng ký tài khoản?</h1>
    <div>
      <a-radio-group v-model:value="formRole" button-style="solid">
        <a-radio-button value="1">Dành cho Ứng viên</a-radio-button>
        <a-radio-button value="2">Nhà tuyển dụng</a-radio-button>
      </a-radio-group>
    </div>
    <!-- form đăng ký tài khoản ứng viên -->
    <form v-if="formRole == '1'" method="post" @submit.prevent>
      <div class="field">
        <label class="label">Email(<span style="color: red;">*</span>)</label>

        <div class="control">
          <input type="email" class="input" name="email" v-model="email">
        </div>
      </div>
      <div class="field">
        <label class="label">Password(<span style="color: red;">*</span>)</label>

        <div class="control">
          <input type="password" class="input" name="password" v-model="password">
        </div>
      </div>
      <div class="field">
        <label class="label">Nhập lại mật khẩu(<span style="color: red;">*</span>)</label>

        <div class="control">
          <input type="password" class="input" name="cf_password" v-model="cf_password">
        </div>
      </div>
      <div class="control">
        <button type="submit" class="button is-dark is-fullwidth" @click="dangky">Đăng ký</button>
      </div>
      <div class="has-text-centered" style="margin-top: 20px">
        <p>
          Đã có tài khoản? <nuxt-link to="/login">Đăng nhập</nuxt-link>
        </p>
      </div>
    </form>
    <!-- form đăng ký tài khoản tuyển dụng -->
    <form v-else method="post" @submit.prevent>
      <div class="field">
        <label class="label">Email(<span style="color: red;">*</span>)</label>

        <div class="control">
          <input type="email" class="input" name="email" v-model="email">
        </div>
      </div>

      <div class="field">
        <label class="label">Mật khẩu(<span style="color: red;">*</span>)</label>
        <div class="control">
          <input type="password" class="input" name="password" v-model="password">
        </div>
      </div>
      <div class="field">
        <label class="label">Nhập lại mật khẩu(<span style="color: red;">*</span>)</label>

        <div class="control">
          <input type="password" class="input" name="cf_password" v-model="cf_password">
        </div>
      </div>
      <div class="field">
        <label class="label">Tên công ty(<span style="color: red;">*</span>)</label>
        <div class="control">
          <input type="text" class="input" name="com_name" v-model="com_name">
        </div>
      </div>
      <div class="field">
        <label class="label">Mã số thuế(<span style="color: red;">*</span>)</label>
        <div class="control">
          <input type="text" class="input" name="taxNumber" v-model="taxNumber">
        </div>
      </div>

      <div class="control">
        <button type="submit" class="button is-dark is-fullwidth" @click="dangky">Đăng ký</button>
      </div>
      <div class="has-text-centered" style="margin-top: 20px">
        <p>
          Đã có tài khoản? <nuxt-link to="/login">Đăng nhập</nuxt-link>
        </p>
      </div>
    </form>

  </div>
</template>
  
<script>
import { notification } from 'ant-design-vue';
export default {
  data() {
    return {
      formRole: '1',
      email: '',
      cf_password: '',
      password: '',
      error: null,
      fullname: '',
      address: '',
      major: '',
      phone: '',
      com_name: '',
      taxNumber: '',
    };
  },

  methods: {
    openNotificationWithIcon(type, mess, des) {
      notification[type]({
        placement: "top",
        message: mess,
        description: des,
      })

    },
    async dangky() {
      if (this.formRole == '1') {
        // check confirm password is matched?
        if (this.password === this.cf_password) {
          try {
            await $fetch('http://localhost:8000/users/create', {
              method: 'POST',
              body: {
                username: this.email,
                password: this.password,
                role: '1',
              }
            });
            this.openNotificationWithIcon(
              'success',
              'Đăng ký thành công',
              'Bạn đã đăng ký tài khoản thành công, giờ đây bạn có thể đăng nhập và tìm kiếm việc làm.'
            )
            this.email = '';
            this.password = '';
            this.cf_password = '';
            // navigateTo('/login')
          } catch (error) {
            // console.log(error.response._data.message)
            if (error.response._data.message == 'User existed') {
              this.openNotificationWithIcon(
                'error',
                'Đã có lỗi xảy ra',
                'Tên tài khoản đã được đăng ký!'
              )
            }else{
              this.openNotificationWithIcon(
              'error',
              'Đã có lỗi xảy ra',
              'Vui lòng cung cấp đầy đủ thông tin!'
            )
            }
            
          }
        }
        else {
          this.openNotificationWithIcon(
            'error',
            'Đã có lỗi xảy ra',
            'Xác minh mật khẩu không trùng khớp. Vui lòng nhập lại!'
          )
        }
      }

      // form.role==2
      else {
        // check confirm password is matched?
        if (this.password === this.cf_password) {
          try {
            await $fetch('http://localhost:8000/users/create', {
              method: 'POST',
              body: {
                username: this.email,
                password: this.password,
                role: '2',
                com_name: this.com_name,
                taxNumber: this.taxNumber
              }
            });
            this.openNotificationWithIcon(
              'success',
              'Đăng ký tài khoản tuyển dụng thành công',
              'Bạn đã đăng ký tài khoản thành công, giờ đây bạn có thể đăng nhập và bắt đầu tìm kiếm ứng viên phù hợp cho công ty của mình.'
            )
            this.email = '';
            this.password = '';
            this.cf_password = '';
            this.com_name = '';
            this.taxNumber = '';
          } catch (error) {
            if (error.response._data.message == 'User existed') {
              this.openNotificationWithIcon(
                'error',
                'Đã có lỗi xảy ra',
                'Tên tài khoản đã được đăng ký!'
              )} else{
                this.openNotificationWithIcon(
              'error',
              'Đã có lỗi xảy ra',
              'Vui lòng cung cấp đầy đủ thông tin!'
            )
              }
           
          }
        }
        else {
          this.openNotificationWithIcon(
            'error',
            'Đã có lỗi xảy ra',
            'Xác minh mật khẩu không trùng khớp. Vui lòng nhập lại!'
          )
        }
      }


    },
  },
};
</script>
<style lang="scss">
.register {
  display: flex;
  flex-direction: column;
  align-items: center;
  // margin-top: 15vh;
}
</style>