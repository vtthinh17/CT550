<template>
    <a-layout :name="Ungvien">

        <div v-if="isLogin == ''">
            Bạn cần đăng nhập
        </div>
        <div v-else-if="isLogin != '' && userLogin.cv === undefined">
            <h1>Tạo hồ sơ cá nhân của bạn</h1>
            <a-row>
                <a-col :span="12">
                    <div style="box-shadow: rgba(3, 102, 214, 0.3) 0px 0px 0px 3px; width: 5rem; height: 5rem;">
                        <!-- <img style="width: 50%;" src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp" alt=""> -->
                    </div>
                    <a-upload :file-list="fileList" :before-upload="beforeUpload" @remove="handleRemove">
                            <a-button v-if="!fileList.length">
                                <upload-outlined></upload-outlined>
                                Select File
                            </a-button>
                        </a-upload>


                    <!-- <p>Upload image</p> -->
                    <div>
                        <h2>Giới thiệu</h2>
                        <textarea placeholder="Viết gì đó về bạn..." name="cv.brief_intro" id="" cols="30" rows="10"
                            v-model="brief_intro"></textarea>
                    </div>
                </a-col>
                <a-col :span="12">
                    <div>
                        <a-row>
                            <a-col :span="8">Họ tên:</a-col>
                            <a-col :span="16">
                                <input type="text" class="input" name="fullName" v-model="fullName">
                            </a-col>
                        </a-row>
                        <a-row>

                            <a-col :span="8">Học vấn</a-col>
                            <a-col :span="16"><input type="text" class="input" name="education" v-model="education"></a-col>
                        </a-row>
                        <a-row>
                            <a-col :span="8">Lĩnh vực</a-col>
                            <a-col :span="16"><input type="text" class="input" name="major" v-model="major"></a-col>
                        </a-row>
                        <a-row>
                            <a-col :span="8">Địa chỉ liên hệ:</a-col>
                            <a-col :span="16"><input type="text" class="input" name="address" v-model="address"></a-col>
                        </a-row>
                        <a-row>
                            <a-col :span="8">Số điện thoại:</a-col>
                            <a-col :span="16"><input type="text" class="input" name="phone" v-model="phone"></a-col>
                        </a-row>
                    </div>
                    <hr>

                    <a-row>
                        <a-col :span="8">Kinh nghiệm:</a-col>
                        <a-col :span="16"><textarea name="" id="" cols="30" rows="5" v-model="exp"></textarea></a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="8">Bằng cấp:</a-col>
                        <a-col :span="16"><textarea name="" id="" cols="30" rows="5"
                                v-model="certificates"></textarea></a-col>
                    </a-row>
                </a-col>
            </a-row>
            <div style="display: flex; justify-content: center;">
                <a-button type="primary" @click="dangkyCV">Save</a-button>
            </div>
        </div>
        <div v-else>
            Bạn đã tạo hồ sơ rồi, có thể xem & chỉnh sửa tại mục hồ sơ cá nhân
        </div>
        <a-modal v-model:open="open" title="Job title" @ok="handleOk">
            Đăng ký thành công
            <template #footer>
                <a-button type="primary" :loading="loading" @click="handleOk">OK</a-button>
            </template>
        </a-modal>
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
            fileList: [],
            fileBase64: null,
            open: false,
            isLogin: localStorage.getItem('loginUserID') ? localStorage.getItem('loginUserID') : '',
            userLogin: {},
            fullName: '',
            brief_intro: '',
            education: '',
            major: '',
            address: '',
            exp: '',
            phone: '',
            certificates: '',

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
            });
            reader.readAsDataURL(file);
            return false;
        },
        handleRemove() {
            this.fileList = [];
        },
        async dangkyCV() {
            if (this.userLogin.cv === undefined) {
                try {
                    await $fetch('http://localhost:8000/users/insertCV/' + this.isLogin, {
                        method: 'PUT',
                        body: {
                            avatar: this.fileBase64.slice(22),
                            fullName: this.fullName,
                            exp: this.exp,
                            brief_intro: this.brief_intro,
                            education: this.education,
                            major: this.major,
                            address: this.address,
                            phone: this.phone,
                            certificates: this.certificates,
                        }
                    })
                    this.open = true
                } catch (error) {
                    console.log(error)
                }
            } else {
                alert("Bạn đã đăng ký hồ sơ rồi")
            }

        },
        async getData() {
            this.users = await useFetch('http://localhost:8000/users/getAll');
            console.log(this.users)
        },
        handleOk() {
            this.open = false;
        }
    },

}
</script>

<style scoped lang="scss"></style>