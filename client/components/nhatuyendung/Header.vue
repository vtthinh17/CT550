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
                    <span>Cập nhật thông tin tài khoản</span>
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
            <a-drawer v-if="userLogin.role == '2'" :width="500" title="Company infomation" placement="left"
              :open="open" @close="onClose">
              <div>
                <!-- <h3>Company infomation</h3> -->
                <p>
                  <b>Company name: </b> {{ userLogin.com_name }}
                </p>
                <p>
                  <b>Address: </b>{{ userLogin.com_location }}
                </p>
                <p>
                  <b>Số điện thoại: </b>{{ userLogin.com_phone }}
                </p>
              </div>
              <hr>
              <div>
                <h3>Edit your profile</h3>
                <a-row style="margin: 4px 0;">
                  <a-col :span="8">
                    <label>Company name:</label>
                  </a-col>
                  <a-col :span="16">
                    <input type="text" v-model="newCompanyName">
                  </a-col>
                </a-row>
                <a-row style="margin: 4px 0;">
                  <a-col :span="8">
                    <label>Address:</label>
                  </a-col> 
                  <a-col :span="16">
                    <input type="text" v-model="newCompanyAddress">
                  </a-col>                               
                </a-row>
                <a-row style="margin: 4px 0;">
                  <a-col :span="8">
                    <label>Phone:</label>
                  </a-col>   
                  <a-col :span="16">
                    <input type="text" v-model="newCompanyPhone">
                  </a-col>                      
                </a-row>
              </div>

              <template #footer>
                <a-button style="margin-right: 8px" @click="onClose">Cancel</a-button>
                <a-button type="primary" @click="capnhat(isLogin)">Save</a-button>
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
      isLogin: false,
      userLogin: false,
      open: false,
      newCompanyAddress: '',
      newCompanyName: '',
      newCompanyPhone: ''
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
    async capnhat(id) {
      try {
        await $fetch('http://localhost:8000/users/' + id, {
          method: 'PATCH',
          body: {
            com_name: this.newCompanyName,
            com_location: this.newCompanyAddress,
            com_phone: this.newCompanyPhone
          }
        });
        alert("cap nhat thanh cong")
        this.newCompanyName='';
        this.newCompanyAddress='';
        this.newCompanyPhone='';
        this.open=false;
      } catch (error) {
        this.errorMsg = 'Register failed, please try again!'
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
