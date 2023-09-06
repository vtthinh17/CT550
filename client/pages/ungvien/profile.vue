<template>
    <a-layout :name="Ungvien">
        <h1>Hồ sơ cá nhân</h1>
        <a-row v-if="isLogin != '' && userLogin.hasOwnProperty('data')">
            <a-col :span="12">
                <img style="width: 50%;" src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                    alt="">
                <div>
                    <h2>Giới thiệu</h2>
                    <p>It has survived not only five centuries, but also the leap into electronic typesetting, remaining
                        essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets
                        containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus
                        PageMaker including versions of Lorem Ipsum</p>
                </div>
            </a-col>
            <a-col :span="12">
                <div>
                    <a-row>
                        <a-col :span="8">Họ tên:</a-col>
                        <a-col :span="16">
                            {{ this.userLogin.data.username }}
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="8">Lĩnh vực</a-col>
                        <a-col :span="16"><input type="text"></a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="8">Địa chỉ liên hệ:</a-col>
                        <a-col :span="16"><input type="text"></a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="8">Số điện thoại:</a-col>
                        <a-col :span="16"><input type="text"></a-col>
                    </a-row>
                </div>
                <hr>

                <a-row>
                    <a-col :span="8">Kinh nghiệm:</a-col>
                    <a-col :span="16"><textarea name="" id="" cols="30" rows="5"></textarea></a-col>
                </a-row>
                <a-row>
                    <a-col :span="8">Bằng cấp:</a-col>
                    <a-col :span="16"><textarea name="" id="" cols="30" rows="5"></textarea></a-col>
                </a-row>
            </a-col>
        </a-row>
    </a-layout>
</template>
<script >
definePageMeta({
    layout: 'ungvien'
})

export default {
    layout: 'ungvien',

    data() {
        return {
            isLogin: localStorage.getItem('loginUserID') ? localStorage.getItem('loginUserID') : '',
            userLogin: {},
        }

    },
    async mounted() {
    if (this.isLogin != '') {
      this.userLogin = await useFetch('http://localhost:8000/users/getUser/' + this.isLogin);
      console.log("profile:", this.userLogin)
    }
  },
    methods: {
        getSearchList(value) {
            if (this.value.length > 0) {
                console.log
            }
        },
        showModal(job) {
            this.selectedJob = job
            this.open = true;
        },

        handleOk() {
            console.log("ok")
            this.open = false;
        },

        handleCancel() {
            this.open = false;
        },
        getSearchList() {

            this.options = this.data.map((item) => {
                return {
                    ...item,
                    label: item.job_title,
                    value: item.job_title
                }
            });
        },
        async getData() {
            this.users = await useFetch('http://localhost:8000/users/getAll');
            console.log(this.users)
        }
    },

}
</script>

<style scoped lang="scss"></style>