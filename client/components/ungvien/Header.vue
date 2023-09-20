<template>
  <div class="ungvien">
    <div
      style=" display: flex;flex-direction: row;    justify-content: space-between; background-color: rgb(21, 19, 19);">
      <ul class="header">
        <li>
          <NuxtLink to="/ungvien/">Trang tin tổng hợp</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/ungvien/companies">Tham khảo công ty</NuxtLink>
        </li>
        <!-- {{ console.log() }} -->
        <li v-if="this.isLogin && userLogin.role=='1'">
          <NuxtLink to="/ungvien/profile">Hồ sơ cá nhân</NuxtLink>
        </li>
      </ul>
      <!-- {{ console.log("test",userLogin.username) }} -->
      <div class="account_setting">
        <a-modal v-model:open="openModal" title="Basic Modal" @ok="handleOk">
          <template #footer>
            <a-button key="back" @click="handleCancel">Hủy</a-button>
            <a-button key="submit" type="primary" @click="handleOk">Tiếp tục</a-button>
          </template>
          <p>Bạn cần đăng nhập với tài khoản của nhà tuyển dụng mới có thể truy cập được trang này. Bạn có muốn tiếp tục?
          </p>
        </a-modal>
        <span>
          <span style=" font-weight: 300; color: goldenrod; text-decoration: none; cursor: pointer;" @click="gotoNTD" >Nhà tuyển dụng</span>
        </span>
        <span>
          <div v-if="userLogin.username">
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
            <a-drawer :width="500" title="Đổi mật khẩu" placement="left"
            v-model:open="openDrawer" @close="onClose">
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
// import { useUserStore } from './../../stores/userStore'
export default {
  data() {
    return {
      openModal: false,
      openDrawer: false,
      fullName: '',
      address: '',
      major: '',
      errorMsg: '',
      isLogin: false,
      userLogin: {},
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
        console.log("header>>> ung vien login:", this.userLogin);
      }
    }
  },
  methods: {
    gotoNTD() {
      if (!this.isLogin || this.userLogin.role=='1')
        this.openModal = true;
      else
        navigateTo('/nhatuyendung')
    },

    handleOk() {
      localStorage.removeItem("loginUserID");
      navigateTo('/login')
      this.openModal = false;
    },
    handleCancel() {
      this.openModal = false;
    },
    logout() {
      console.log("thoat")
      localStorage.removeItem("loginUserID");
      navigateTo('/login')
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
    showDrawer() {
      console.log("123")
      this.openDrawer = true;
      // console.log(this.userLogin.data)
    },

    onClose() {
      this.open = false;
    },
  },
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
  margin-right: 2rem;
  color: white;
  display: flex;
  align-items: center;
  // background-color: blue;
  width: 20rem;
  justify-content: space-between;
}
</style>