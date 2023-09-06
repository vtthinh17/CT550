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
        <li>

        </li>
      </ul>

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
          <span style=" font-weight: 300; color: goldenrod; text-decoration: none; cursor: pointer;" @click="gotoNTD" >Nhà tuyển
            dụng</span>
        </span>
        <span>
          <div v-if="isLogin != '' && userLogin.hasOwnProperty('data')">
            <a-dropdown>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="1" @click="navigateTo('/ungvien/profile')">
                    <span>Cập nhật thông tin tài khoản</span>
                  </a-menu-item>
                  <a-menu-item key="2" @click="logout">
                    <span>Thoát</span>
                  </a-menu-item>
                </a-menu>
              </template>
              <a-button>
                <user-outlined />{{ this.userLogin.data.username }}
                <DownOutlined />
              </a-button>
            </a-dropdown>
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
      fullName: '',
      address: '',
      major: '',
      errorMsg: '',
      open: false,
      isLogin: localStorage.getItem('loginUserID') ? localStorage.getItem('loginUserID') : '',
      userLogin: {},
    }
  },
  async mounted() {
    if (this.isLogin != '') {
      this.userLogin = await useFetch('http://localhost:8000/users/getUser/' + this.isLogin);
      console.log("profile login:", this.userLogin)
    }
  },
  methods: {
    gotoNTD() {
      if (!this.userLogin.hasOwnProperty('data') || this.userLogin.data.role == '1')
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
    async capnhat(id) {
      try {
        await $fetch('http://localhost:8000/users/' + id, {
          method: 'PATCH',
          body: {
            fullName: this.fullName,
            address: this.address,
            major: this.major
          }
        });

        alert("cap nhat thanh cong")
      } catch (error) {
        this.errorMsg = 'Register failed, please try again!'
      }

    },
    showDrawer() {
      this.open = true;
      console.log(this.userLogin.data)
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