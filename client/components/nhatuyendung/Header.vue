<template>
  <div class="nhatuyendung">
    <div style="display: flex;flex-direction: row;    justify-content: space-between; background-color: rgba(21, 19, 19, 0.877);
">
      <ul class="header">
        <li>
          <NuxtLink to="/nhatuyendung/">Tin tuyển dụng của tôi</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/nhatuyendung/candidates">Tìm kiếm ứng viên</NuxtLink>
        </li>
      </ul>
      <div class="account_setting">
        <!-- navigation -->
        <span>
          <NuxtLink style=" font-weight: 300;color: goldenrod; text-decoration: none;" to="/ungvien/" >Ứng viên</NuxtLink>
        </span>
        <!-- profile -->
        <span>
          <div v-if="userLogin">
            <a-dropdown>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="1" @click="showDrawer">
                    <span>Đổi mật khẩu</span>
                  </a-menu-item>
                  <a-menu-item key="2" @click="logout">
                    <span>Thoát</span>
                  </a-menu-item>
                </a-menu>
              </template>
              <a-button>
                <user-outlined />{{ userLogin.username }}
                <DownOutlined />
              </a-button>
            </a-dropdown>
            <a-drawer v-if="userLogin.role == '2'" :width="500" title="Đổi mật khẩu" placement="left"
              :open="open" @close="onClose">
              <div style="display: flex; flex-direction: column;">
                <!-- <h3>Đổi mật khẩu mới</h3> -->
                <a-row style="margin: 4px 0;">
                  <a-col :span="8">
                    <label>Mật khẩu hiện tại:</label>
                  </a-col>
                  <a-col :span="16">
                    <a-input-password v-model="currentPass" placeholder="Vui lòng nhập mật khẩu hiện tại" />
                    <!-- <input type="password" v-model="currentPass"> -->
                  </a-col>
                </a-row>
                <a-row style="margin: 4px 0;">
                  <a-col :span="8">
                    <label>Mật khẩu mới:</label>
                  </a-col> 
                  <a-col :span="16">
                    <a-input-password v-model="newPassword" placeholder="Nhập mật khẩu mới" />
                  </a-col>                               
                </a-row>
                <a-row style="margin: 4px 0;">
                  <a-col :span="8">
                    <label>Nhập lại mật khẩu mới:</label>
                  </a-col>   
                  <a-col :span="16">
                    <a-input-password v-model="confirm_newPassword" placeholder="Nhập lại mật khẩu mới" />
                  </a-col>                      
                </a-row>
              </div>

              <template #footer>
                <a-button style="margin-right: 8px" @click="onClose">Hủy</a-button>
                <a-button type="primary" @click="changePassword(isLogin)">Lưu</a-button>
              </template>
            </a-drawer>
          </div>
          <div v-else>
            <NuxtLink to="/login">
              <button>Login</button>
            </NuxtLink> /
            <NuxtLink to="/register">
              <button>Register</button>
            </NuxtLink>
          </div>
        </span>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  data() {
    return {
      isLogin: '',
      userLogin: false,
      open: false,
      newPassword: '',
      currentPass: '',
      confirm_newPassword: ''
    }
  },
  async mounted() {
    if (process.client) {
      this.isLogin = localStorage.getItem('loginUserID');
      if (this.isLogin) {
        this.userLogin = await $fetch('http://localhost:8000/users/getUser/' + this.isLogin);
        console.log("header>>> nha tuyen dung login:", this.userLogin);
      }
    }
  },
  methods: {
    logout() {
      console.log("thoat")
      localStorage.removeItem("loginUserID",'');
      navigateTo('/')
    },
   
    showDrawer() {
      this.open = true;
      console.log(this.userLogin.data)
    },
    async changePassword(id) {
      // console.log("123",this.userLogin.password)
     if(this.currentPass!=this.userLogin.password){
      alert("Mật khẩu hiện tại không trùng khớp")
     }else if(this.newPassword!=this.confirm_newPassword){
      alert("Nhập lại mật khẩu mới không trùng khớp")
     }
     else{
      try {
        await $fetch('http://localhost:8000/users/changePassword/' + id, {
          method: 'PUT',
          body: {
            password: this.newPassword,
          }
        });
        alert("cap nhat thanh cong, vui long dang nhap lai")
        this.currentPass='';
        this.newPassword='';
        this.confirm_newPassword='';
        this.open=false;
        this.logout()
      } catch (error) {
        console.log(error)
        this.errorMsg = 'Register failed, please try again!'
      }
     }

    },

    onClose() {
      this.open = false;
    },
  }
}
</script>
<style lang="scss">
.header {
  margin: 0;
  height: 60px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;

  .router-link-exact-active {
    border-bottom: 4px solid white;
  }

  li {
    list-style: none;
    margin: 0 10px;

    a {
      font-size: 20px;
      text-decoration: none;
      font-weight: bold;
      color: white;
    }
  }

  li:hover {
    opacity: 0.5;
  }

}

.account_setting {
  color: white;
  display: flex;
  align-items: center;
  // background-color: blue;
  width: 20rem;
  justify-content: space-evenly;

}
</style>
---------------
