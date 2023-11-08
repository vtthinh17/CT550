<template>
  <a-layout :name="nhatuyendung">
    <div v-if="isLogin != ''">
      <div style="display: flex; flex-direction: row; margin-top: 2rem;">
        <div style="flex:1"></div>
        <div style="flex:4">
          <a-card style="width: 80%">
            <!-- logo -->
            <template #cover>
              <div v-if="!fileList.length" style="display: flex; justify-content: center; margin-top: 1rem;">
                <img style="width: 70%;" v-bind:src="userLogin.com_logo" alt="">
              </div>
              <div v-else style="display: flex; justify-content: center; margin-top: 1rem;">
                <img style="width: 70%;" v-bind:src="fileBase64" alt="">
              </div>
            </template>
            <template #actions>
              <a-upload :file-list="fileList" :before-upload="beforeUpload" @remove="handleRemove">
                <a-button style="margin-top: 1rem;" v-if="!fileList.length">
                  Cập nhật logo<upload-outlined></upload-outlined>
                </a-button>
              </a-upload>
            </template>
            <a-row>
              <a-col :span="6">Mã số thuế:</a-col>
              <a-col :span="14"> <b>1801659572</b></a-col>
            </a-row>
            <a-row>
              <a-col :span="4">Gmai:</a-col>
              <a-col :span="14"> <b>{{ userLogin.username }}</b></a-col>
            </a-row>
          </a-card>
        </div>
        <div style="flex:6">
          <a-card :tab-list="tabListNoTitle" :active-tab-key="noTitleKey" @tabChange="key => onTabChange(key)">
            <div v-if="noTitleKey === 'tab1'">
              <b>Tên công ty</b>
              <a-input type="text" v-model:value="userLogin.com_name" />
              <b>Địa chỉ liên hệ</b>
              <a-input type="text" v-model:value="userLogin.com_location" />
              <b>Số điện thoại</b>
              <a-input type="text" v-model:value="userLogin.com_phone" />
            </div>
            <div v-else-if="noTitleKey === 'tab2'">
              <b>Giới thiệu về công ty</b>
              <div v-if="userLogin.about">
                <a-textarea v-model:value="userLogin.about" :rows="10" />
              </div>
              <div v-else>
                <a-textarea v-model:value="userLogin.about" placeholder="Viết gì đó về công ty của bạn..." :rows="4"
                  style="height: 100%;" />
              </div>
            </div>
            <div v-else>Chưa cập nhật</div>



          </a-card>
        </div>
        <div style="flex:1"></div>
      </div>
    </div>

    <div style="display: flex;margin: 1rem;justify-content: center">
      <a-button type="primary" @click="saveNewInfo">Lưu thay đổi</a-button>
    </div>

  </a-layout>
</template>

<script>
definePageMeta({
  layout: 'nhatuyendung'
})
export default {
  data() {
    return {
      isShowAboutInput: false,
      fileList: [],
      noTitleKey: 'tab2',
      tabListNoTitle: [
        {
          key: 'tab1',
          tab: 'Thông tin công ty',
        },
        {
          key: 'tab2',
          tab: 'Giới thiệu về công ty',
        },
      ],
      fileBase64: null,
      isLogin: localStorage.getItem('loginUserID') ? localStorage.getItem('loginUserID') : '',
      userLogin: false,
      addAbout: ''
    };
  },
  async mounted() {
    if (process.client) {
      this.isLogin = localStorage.getItem('loginUserID');
      if (this.isLogin) {
        this.userLogin = await $fetch('http://localhost:8000/users/getUser/' + this.isLogin);
        this.fileBase64 = this.userLogin.com_logo;
        console.log("123>>>  login:", this.userLogin);
      }
    }
  },
  methods: {
    onTabChange(value) {
      this.noTitleKey = value;
    },
    showAboutInput() {
      this.isShowAboutInput = true;
    },
    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('Bạn chỉ có thể upload JPG file!');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Ảnh phải có dung lượng nhỏ hơn 2MB!');
        return false;
      }
      message.success('Tải ảnh thành công!');
      this.fileList = [file];
      const reader = new FileReader();
      let app = this;
      reader.addEventListener('load', (e) => {
        app.fileBase64 = e.target.result;
        console.log(e.target.result);
      });
      reader.readAsDataURL(file);
      return false;
    },
    handleRemove() {
      this.fileList = [];
    },
    async saveNewInfo() {
      try {
        await $fetch('http://localhost:8000/users/updateCompany/' + this.isLogin, {
          method: 'PUT',
          body: {
            com_logo: this.fileBase64,
            com_name: this.userLogin.com_name,
            com_phone: this.userLogin.com_phone,
            com_location: this.userLogin.com_location,
            about: this.userLogin.about

          }
        });
        message.success("Cập nhật thông tin thành công");
        this.userLogin = await $fetch('http://localhost:8000/users/getUser/' + this.isLogin);
        this.resetState();
      } catch (error) {
        console.log(error)
      }
    },
    resetState() {
      this.fileList = [];
    },
  },
  computed: {
    newStateInfo() {
      return this.userLogin;
    }
  }
}
</script>

<style scoped></style>