<template>
  <a-layout :name="nhatuyendung">
    <h2>Thông tin công ty</h2>
    <!--  -->
    <a-row v-if="isLogin != ''">
      {{ console.log("absdsad,", userLogin) }}
      <a-col :span="14"
        style="margin: 0 1rem;box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;">
        <a-row>
          <a-col :span="6">
            <div style="margin-top: 3.5rem; margin-left: 1.5rem;">
              <img style="width: 80%;"
                src="https://vieclamcantho.com.vn/public/upload/nhatuyendung/thuoc-thuy-san-nam-thanh9301617158368.png"
                alt="">
              <div>
                <button>
                  <EditOutlined @click="" />Thay đổi logo
                </button>
              </div>
            </div>
          </a-col>
          <a-col :span="18">
            <div class="field">
              <h3>Tên công ty</h3>
              <input type="text" v-model="userLogin.com_name" />
            </div>
            <div class="field">
              <h3>Gmail</h3>
              <p>{{ userLogin.username }}</p>
            </div>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="8" style="box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;">
        <div style="margin-left: 3rem;">
          <div class="field">
            <h3>Địa chỉ liên hệ</h3>
            <input type="text" v-model="userLogin.com_location" />
          </div>
          <div class="field">
            <h3>Số điện thoại</h3>
            <input type="text" v-model="userLogin.com_phone" />
          </div>
          <div class="field">
            <h3>Mã số thuế</h3>
            <p> 1801659572</p>
          </div>
        </div>
      </a-col>
    </a-row>
    <hr>
    <h2>Giới thiệu</h2>
    <div v-if="userLogin.about">
      <textarea name="" :cols="30" :rows="5"
        placeholder="Được dịch từ tiếng Anh-Trong xuất bản và thiết kế đồ họa, Lorem ipsum là một văn bản giữ chỗ thường được sử dụng để thể hiện hình thức trực quan của tài liệu hoặc kiểu chữ"
        id="" cols="30" rows="10"></textarea>
    </div>
    <div v-else>
      <button>Viết gì đó về công ty...<PlusOutlined/></button>
    </div>


    <div style="display: flex;margin: 1rem;justify-content: center" >
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
            isLogin: localStorage.getItem('loginUserID') ? localStorage.getItem('loginUserID') : '',
            userLogin: false,
        };
    },
    async mounted() {
        if (process.client) {
            this.isLogin = localStorage.getItem('loginUserID');
            if (this.isLogin) {
                this.userLogin = await $fetch('http://localhost:8000/users/getUser/' + this.isLogin);
                console.log("ung vien>>>  login:", this.userLogin);
            }
        }
    },
    methods:{
      async saveNewInfo() {
            try {
                await $fetch('http://localhost:8000/users/updateCompany/' + this.isLogin, {
                        method: 'PUT',
                        body: {
                            com_name: this.userLogin.com_name,
                            com_phone:this.userLogin.com_phone,
                            com_location:this.userLogin.com_location,
                        }
                    })
                    alert("update thanh cong")
            } catch (error) {
                console.log(error)
            }
        },
    },
    components: { PlusCircleOutlined }
}
</script>

<style scoped></style>