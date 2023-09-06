<template>
  <a-layout :name="nhatuyendung">
    <div style="display: flex; justify-content: center;">
    <h2>Thông tin công ty</h2>
    </div>
    <div style="width: 40%;">
      <div>
        <div style="display: flex; justify-self: center;">
          <img style="width: 50%;"
            src="https://vieclamcantho.com.vn/public/upload/nhatuyendung/cong-ty-cp-dt-tm-sx-mekong-export5281691488516.jpg"
            alt="">
        </div>
        <div style="display: flex; justify-content: center;">
          <!-- v-if="existCompanyAvatar" -->
          <span style="cursor: pointer; "><EditOutlined /> Cập nhật ảnh đại diện</span>
          <!-- v-else -->
          <!-- <span style="cursor: pointer;"><UploadOutlined /> Upload </span> -->
        </div>

      </div>
      <div style="display: flex; justify-content: space-between;">      
          <label for="">
            <b>Tên công ty:</b>
            <p>Công ty ABC</p>
          </label>
          <button style="color: rgb(87, 87, 232); background-color: white; cursor: pointer; height: 3rem; font-size: 1rem; font-weight: 600; border: 0.5px solid; margin-left: 8rem; width: 10rem; border-radius: 0.8rem;"> Cập nhật</button>
      </div>
      <hr>

      <div style="display: flex; justify-content: space-between;">      
          <label for="">
            <b>Email:</b>
            <p>abc123@gmail.com</p>
          </label>
          <button style="color: rgb(87, 87, 232); background-color: white; cursor: pointer;height: 3rem; font-size: 1rem; font-weight: 600; border: 0.5px solid; margin-left: 8rem; width: 10rem; border-radius: 0.8rem;"> Cập nhật</button>
      </div>
      <hr>

      <div style="display: flex; justify-content: space-between;">      
          <label for="">
            <b>Mật khẩu:</b>
            <p>********</p>
          </label>
          <button style="color: rgb(87, 87, 232); background-color: white; cursor: pointer;height: 3rem; font-size: 1rem; font-weight: 600; border: 0.5px solid; margin-left: 8rem; width: 10rem; border-radius: 0.8rem;">Đổi mật khẩu</button>
      </div>
      <hr>
    </div>
  </a-layout>
</template>

<script>
definePageMeta({
  layout: 'nhatuyendung'
})
</script>

<style scoped></style>