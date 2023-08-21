<template>
  <div class="ungvien">
    <div style="display: flex;flex-direction: row;    justify-content: space-between; background-color: rgba(21, 19, 19, 0.877);
">
      <ul class="header">
        <li>
          <NuxtLink to="/ungvien/">Trang tin tổng hợp</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/ungvien/companies">Tham khảo công ty</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/nhatuyendung/">Cho nhà tuyển dụng</NuxtLink>
        </li>
      </ul>
      <div class="account_setting">
        <span>
          <div v-if="isLogin!='' && userLogin.hasOwnProperty('data')">
            <a-dropdown>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="1">
                    <NuxtLink to="/ungvien/profile">Cập nhật thông tin tài khoản</NuxtLink>
                  </a-menu-item>
                  <a-menu-item key="2">
                    <span @click="logout">Thoát</span>
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
      isLogin: localStorage.getItem('loginUserID')?localStorage.getItem('loginUserID'):'',   
      userLogin:{},
      }
    },
    async mounted() {
      if(this.isLogin!=''){
        this.userLogin = await useFetch('http://localhost:8000/users/getUser/'+this.isLogin);
        console.log("profile:",this.userLogin)
      }
    },
  methods: {
    logout(){
      localStorage.removeItem("loginUserID");
      navigateTo('/')
    }
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
  width: 10rem;
  justify-content: center;
}
</style>