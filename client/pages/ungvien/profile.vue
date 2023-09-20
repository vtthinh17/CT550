<template>
    <a-layout :name="Ungvien">
        <h1>Hồ sơ cá nhân</h1>
        <div v-if="isLogin != '' && userLogin.cv !== undefined">
            <a-row>
                <a-col :span="12">
                    <img v-if="userLogin.cv.avatar" style="width: 50%;" src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp" alt="">
                   <div v-else>
                    <a-upload  v-model:file-list="fileList" name="avatar" list-type="picture-card" class="avatar-uploader"
                        :show-upload-list="false"
                        v-bind:action="'http://localhost:8000/users/uploadAvatar/' + userLogin._id"
                        :before-upload="beforeUpload" @change="handleChange">
                        <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
                        <div v-else>
                            <loading-outlined v-if="loading"></loading-outlined>
                            <plus-outlined v-else></plus-outlined>
                            <div class="ant-upload-text">Upload</div>
                        </div>
                    </a-upload>
                    Upload ảnh đại diện
                   </div>
                    <div>
                        <h2>Giới thiệu</h2>
                        <textarea name="" id="" cols="30" rows="5" v-model="userLogin.cv.brief_intro"></textarea>
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
                        <a-col :span="16"><textarea name="" id="" cols="30" rows="5"
                                v-model="userLogin.cv.exp"></textarea></a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="8">Bằng cấp:</a-col>
                        <a-col :span="16"><textarea name="" id="" cols="30" rows="5"
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
        function getBase64(img, callback) {
            const reader = new FileReader();
            reader.addEventListener('load', () => callback(reader.result));
            reader.readAsDataURL(img);
        };
        const beforeUpload = file => {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                message.error('You can only upload JPG file!');
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('Image must smaller than 2MB!');
            }
            return isJpgOrPng && isLt2M;
        };
        return {
            beforeUpload, getBase64, headers
        }
    },
    data() {
        return {
            loading: false,
            fileList: [],
            isLogin: localStorage.getItem('loginUserID') ? localStorage.getItem('loginUserID') : '',
            userLogin: false,
        }

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
    methods: {
        async handleChange(info) {
            if (info.file.status === 'uploading') {
                console.log("uploading....", info.file)
                this.loading = true;
                return;
            }
            if (info.file.status === 'done') {
                console.log("upload thanh cong!!", info.file)
                // Get this url from response in real world.
                // getBase64(info.file.originFileObj, base64Url => {
                //     imageUrl.value = base64Url;
                //     this.loading = false;
                // });
            }
            if (info.file.status === 'error') {
                console.log("error line 138")
                this.loading = false;
                message.error('upload error');
            }
        },
        async saveNewInfo() {
            try {
                await $fetch('http://localhost:8000/users/update/' + this.isLogin, {
                    method: 'PUT',
                    body: {
                        fullName: this.userLogin.cv.fullName,
                        exp: this.userLogin.cv.exp,
                        brief_intro: this.userLogin.cv.brief_intro,
                        education: this.userLogin.cv.education,
                        major: this.userLogin.cv.major,
                        address: this.userLogin.cv.address,
                        phone: this.userLogin.cv.phone,
                        certificates: this.userLogin.cv.certificates,
                    }
                })

                alert("update thanh cong")
            } catch (error) {
                console.log(error)
            }
        },
        getSearchList(value) {
            if (this.value.length > 0) {
                console.log
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

<style scoped lang="scss">
.avatar-uploader > .ant-upload {
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