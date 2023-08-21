<template>
  <a-layout :name="nhatuyendung">
    <a-row class="gradient_list">
      <a-col :span="7"
        style="     background: transparent linear-gradient(90deg,#56a8f7,#6c7bd4) 0 0 no-repeat padding-box;;"
        class="gradient_item">
        Tin của tôi
        <img src="" alt="">
      </a-col>
      <a-col :span="7"
        style="    background: transparent linear-gradient(90deg,#41bfad,#3bd3e6) 0 0 no-repeat padding-box;"
        class="gradient_item">
        Đăng tin mới +
      </a-col>
      <a-col :span="7"
        style="    background: transparent linear-gradient(90deg,#a1dc65,#66cc80) 0 0 no-repeat padding-box;"
        class="gradient_item">
        Cập nhật thông tin
      </a-col>
    </a-row>
  </a-layout>
</template>

<script>
definePageMeta({
  layout: 'nhatuyendung'
})
</script>

<style scoped lang="scss">
.gradient_list {
  display: flex;
  flex-flow: row wrap;
  min-width: 0;
  justify-content: space-around;
  margin-top: 14px;

  .gradient_item {
    box-shadow: inset 0 0 0 0 blue;
    transition: .2s ease-out;
    height: 20rem;
    padding: 0;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 8rem;
  }

  .gradient_item:hover {
    background: #2e6edf;
  }
}</style>