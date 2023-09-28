<template>
    <a-layout :name="Ungvien">
        <div v-if="isLogin != '' && userLogin.cv !== undefined">
            <a-row style="margin-top: 1.5rem;">
                <a-col :span="12">
                    <div v-if="userLogin.cv.avatar" class="avatarBox">
                        <img style="width: 20%;" v-bind:src="fileBase64" alt="">
                        <a-upload :file-list="fileList" :before-upload="beforeUpload" @remove="handleRemove">
                            <a-button style="margin-top: 1rem;" v-if="!fileList.length">
                                <upload-outlined></upload-outlined>
                                Cập nhật ảnh đại diện
                            </a-button>
                        </a-upload>

                    </div>
                    <div v-else class="avatarBox">
                        <a-upload name="avatar" :file-list="fileList" :before-upload="beforeUpload" @remove="handleRemove">
                            <a-button style="margin-top: 1rem;" v-if="!fileList.length">
                                <upload-outlined></upload-outlined>
                                Select File
                            </a-button>
                        </a-upload>
                        {{ this.fileBase64 }}
                        Upload ảnh đại diện
                    </div>
                    <div>
                        <h2>Giới thiệu</h2>
                        <textarea style="margin-left: 2rem;" cols="60" rows="5" v-model="userLogin.cv.brief_intro"></textarea>
                    </div>
                </a-col>
                <a-col :span="12">
                    <div>
                        <a-row>
                            <a-col :span="8">Họ tên:</a-col>
                            <a-col :span="16">
                                <!-- v-bind:placeholder="userLogin.cv.fullName" -->
                                <input type="text" v-model="userLogin.cv.fullName">
                            </a-col>
                        </a-row>
                        <a-row>
                            <a-col :span="8">Lĩnh vực</a-col>
                            <a-col :span="16"><input type="text" v-model="userLogin.cv.major"></a-col>
                        </a-row>
                        <a-row>
                            <a-col :span="8">Địa chỉ liên hệ:</a-col>
                            <a-col :span="16"><input type="text" v-model="userLogin.cv.address"></a-col>
                        </a-row>
                        <a-row>
                            <a-col :span="8">Số điện thoại:</a-col>
                            <a-col :span="16"><input type="text" v-model="userLogin.cv.phone"></a-col>
                        </a-row>
                    </div>
                    <hr>

                    <a-row>
                        <a-col :span="8">Kinh nghiệm:</a-col>
                        <a-col :span="16"><textarea  cols="30" rows="5"
                                v-model="userLogin.cv.exp"></textarea></a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="8">Bằng cấp:</a-col>
                        <a-col :span="16"><textarea  cols="30" rows="5"
                                v-model="userLogin.cv.certificates"></textarea></a-col>
                    </a-row>
                </a-col>
            </a-row>
            <div style="display: flex; justify-content: center;">
                <a-button type="primary" @click="saveNewInfo">Lưu lại sửa đổi</a-button>
            </div>
        </div>
        <div v-else>
            <a-button type="primary" @click="goToCreateCV">Tạo ngay CV mới</a-button>
        </div>

    </a-layout>
</template>
<script >
definePageMeta({
    layout: 'ungvien'
})

export default {
    layout: 'ungvien',
    setup() {
        const headers = {
            authorization: 'authorization-text',
        };
        return {
            headers
        }
    },
    data() {
        return {
            loading: false,
            fileList: [],
            isLogin: localStorage.getItem('loginUserID') ? localStorage.getItem('loginUserID') : '',
            userLogin: false,
            fileBase64: null
        }

    },
    async mounted() {
        if (process.client) {
            this.isLogin = localStorage.getItem('loginUserID');
            if (this.isLogin) {
                this.userLogin = await $fetch('http://localhost:8000/users/getUser/' + this.isLogin);
                this.fileBase64 = this.userLogin.cv.avatar;
                console.log("avatar:>>", this.fileBase64);
                console.log("ung vien>>>  login:", this.userLogin);
            }
        }
    },
    methods: {
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
                // let file = this.fileList[0];
                // console.log(this.fileBase64.slice(22));
                await $fetch('http://localhost:8000/users/update/' + this.isLogin, {
                    method: 'PUT',
                    body: {
                        avatar: this.fileBase64,
                        fullName: this.userLogin.cv.fullName,
                        exp: this.userLogin.cv.exp,
                        brief_intro: this.userLogin.cv.brief_intro,
                        education: this.userLogin.cv.education,
                        major: this.userLogin.cv.major,
                        address: this.userLogin.cv.address,
                        phone: this.userLogin.cv.phone,
                        certificates: this.userLogin.cv.certificates,

                    }
                });
                message.success("update thanh cong");
                this.resetState();
            } catch (error) {
                console.log(error)
            }
        },
        goToCreateCV() {
            navigateTo('./createCV')
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
        resetState() {
            this.fileList = [];
        },
        async getData() {
            this.users = await useFetch('http://localhost:8000/users/getAll');
            console.log(this.users)
        }
    },

}
</script>

<style scoped lang="scss">
.avatarBox{
    display: flex;
    flex-direction: column;
    align-items: center
}
.avatar-uploader>.ant-upload {
    width: 128px;
    height: 128px;
}

.ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
}
</style>