<template>
  <a-layout :name="nhatuyendung">
    <div v-if="isLogin != ''">
      <a-row style="margin-top: 2rem;">
        <a-col :span="4">
          <img style="width: 70%;" v-bind:src="userLogin.com_logo" alt="">

        </a-col>
        <a-col :span="20">
          <h2>{{ userLogin.com_name }}</h2>
          <b>MST:1801659572</b>
        </a-col>
      </a-row>
      <h2>Giới thiệu</h2>
      <div v-if="userLogin.about">
        <a-textarea v-model:value="userLogin.about" :rows="4" />
      </div>
      <div v-else>
        <a-row>
          <a-col :span="4">
            Giới thiệu cơ bản về công ty của bạn
          </a-col>
          <a-col :span="20">
            <a-textarea v-model:value="addAbout" placeholder="Viết gì đó về công ty của bạn..." :rows="4" />
          </a-col>
        </a-row>

      </div>
      <h1>Thông tin công ty</h1>
      <a-row style="box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;">
        <a-col :span="6">
          <h3>Tên công ty</h3>
          <div>
            Tên công ty sẽ được hiển thị công khai
          </div>
          <a-input type="text" v-model:value="userLogin.com_name" />
        </a-col>
        <a-col :span="2"></a-col>
        <a-col :span="16">
          <h3>Logo</h3>
          <!-- <div style="width: 40%">
            <img style="width: 30%;" v-bind:src="fileBase64" alt="">
          </div> -->
          <div v-if="userLogin.com_logo" class="avatarBox">
            <img style="width: 20%;" v-bind:src="fileBase64" alt="">
            <a-upload :file-list="fileList" :before-upload="beforeUpload" @remove="handleRemove">
              <a-button style="margin-top: 1rem;" v-if="!fileList.length">
                <upload-outlined></upload-outlined>
                Cập nhật ảnh đại diện
              </a-button>
            </a-upload>

          </div>
          <div v-else class="avatarBox">
            <img style="width: 20%;" v-bind:src="fileBase64" alt="">
            <a-upload name="avatar" :file-list="fileList" :before-upload="beforeUpload" @remove="handleRemove">
              <a-button style="margin-top: 1rem;" v-if="!fileList.length">
                <upload-outlined></upload-outlined>
                Select File
              </a-button>
            </a-upload>
            Upload ảnh đại diện
          </div>
          <!-- <a-upload :file-list="fileList" :before-upload="beforeUpload" @remove="handleRemove">
            <a-button v-if="!fileList.length">
              <upload-outlined></upload-outlined>
             Đăng ảnh đại diện
            </a-button>
          </a-upload> -->
        </a-col>
      </a-row>

      <h1>Thông tin liên hệ</h1>
      <a-row style="box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;">
        <div style="margin-left: 3rem;">
          <div class="field">
            <h3>Gmail</h3>
            <p>{{ userLogin.username }}</p>
          </div>
          <div class="field">
            <h3>Địa chỉ liên hệ</h3>
            <input type="text" v-model="userLogin.com_location" />
          </div>
          <div class="field">
            <h3>Số điện thoại</h3>
            <input type="text" v-model="userLogin.com_phone" />
          </div>
        </div>
      </a-row>
    </div>





    <div style="display: flex;margin: 1rem;justify-content: center">
      <a-button type="primary" @click="saveNewInfo">Lưu thay đổi</a-button>
    </div>
    <!-- <h2>Một số hình ảnh về công ty</h2> -->

  </a-layout>
</template>

<script>
import { PlusCircleOutlined } from '@ant-design/icons-vue';

definePageMeta({
  layout: 'nhatuyendung'
})
export default {
  data() {
    return {
      isShowAboutInput: false,
      fileList: [],
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
        console.log("ung vien>>>  login:", this.userLogin);
      }
    }
  },
  methods: {
    showAboutInput() {
      this.isShowAboutInput = true;
    },
    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('You can only upload JPG file!');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
        return false;
      }
      // message.success('Upload successfully');
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
            about: this.addAbout

          }
        });
        message.success("update thanh cong");
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