<template>
  <div class="nhatuyendung">
    <div style="display: flex;flex-direction: row;    justify-content: space-between; background-color: rgba(21, 19, 19, 0.877);
">
      <ul class="header">
        <li>
  <NuxtLink to="/nhatuyendung/candidates">Tìm kiếm ứng viên</NuxtLink>
</li>
<li>
  <NuxtLink to="/nhatuyendung/postsManage">Quản lý tin tuyển dụng</NuxtLink>
</li>
<li>
  <NuxtLink to="/nhatuyendung/companyProfile">Quản lý thông tin công ty</NuxtLink>
</li>
<li>
  <NuxtLink to="/ungvien">Dành cho ứng viên</NuxtLink>
</li>
      </ul>
      <div class="account_setting">
        <span>
          <a-dropdown>
            <template #overlay>
              <a-menu>
                <a-menu-item key="1">
                  <NuxtLink to="/ungvien/profile">Cập nhật thông tin tài khoản</NuxtLink>              
                </a-menu-item>
                <a-menu-item key="2">
                  <NuxtLink to="/">Thoát</NuxtLink>
                </a-menu-item>
              </a-menu>
            </template>
            <a-button>
              <user-outlined />User01
              <DownOutlined />
            </a-button>
          </a-dropdown>
        </span>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  methods: {
    
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
  width: 10rem;
  justify-content: center;
}
</style>
---------------
