<template>
  <span>
    <NuxtLink to="/">
      <left-circle-outlined :style="{ fontSize: '1.5rem' }" />
    </NuxtLink>
    <!-- <left-square-outlined :style="{fontSize: '1.5rem'}"/> -->
  </span>
  <div class="register">
    <h1>Bạn muốn đăng ký tài khoản?</h1>
    <div>
      <a-radio-group v-model:value="formRole" button-style="solid">
        <a-radio-button value="1">Dành cho Ứng viên</a-radio-button>
        <a-radio-button value="2">Nhà tuyển dụng</a-radio-button>
      </a-radio-group>
    </div>
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
          Already have an account? <nuxt-link to="/login">Login</nuxt-link>
        </p>
      </div>
    </form>
    <!-- form cho nhà tuyển dụng -->
    <form v-else method="post" @submit.prevent>
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
      <div class="field">
        <label class="label">Tên công ty</label>
        <div class="control">
          <input type="text" class="input" name="com_name" v-model="com_name">
        </div>
      </div>
      <div class="field">
        <label class="label">Mã số thuế</label>
        <div class="control">
          <input type="text" class="input" name="taxNumber" v-model="taxNumber">
        </div>
      </div>
     
      <div class="control">
        <button type="submit" class="button is-dark is-fullwidth" @click="dangky">Đăng ký</button>
      </div>
      <div class="has-text-centered" style="margin-top: 20px">
        <p>
          Already have an account? <nuxt-link to="/login">Login</nuxt-link>
        </p>
      </div>
    </form>
  </div>



  <span v-if="this.errorMsg != ''" style="color: red;">
    {{ this.errorMsg }}
  </span>
  <span v-else>
  </span>
</template>
  
<script>
export default {
  data() {
    return {
      formRole: '1',
      errorMsg: '',
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
            alert("Dang ky thanh cong")
            this.email = '';
            this.password = '';
            navigateTo('/login')
          } catch (error) {
            this.errorMsg = 'Register failed, please try again!'
          }
        } else {
          alert("mat khau ko trung khop")
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
            alert("Dang ky thanh cong")
            this.email = '';
            this.password = '';
            navigateTo('/login')
          } catch (error) {
            this.errorMsg = 'Register failed, please try again!'
          }
        } else {
          alert("mat khau khong trung khop")
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