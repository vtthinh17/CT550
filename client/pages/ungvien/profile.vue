<template>
    <a-layout :name="Ungvien">
        <div v-if="isLogin != '' && userLogin.cv !== undefined && userLogin.cv.avatar !== undefined">
            <a-row style="margin-top: 0.5rem;">
                <a-col :span="14">
                    <!-- Avatar -->
                    <div v-if="userLogin.cv.avatar" class="avatarBox">
                        <img style="width: 20%;" v-bind:src="fileBase64" alt="">
                        <a-upload :file-list="fileList" :before-upload="beforeUpload" @remove="handleRemove(fileList)">
                            <a-button style="margin-top: 0.5rem;" v-if="!fileList.length">
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
                                Upload ảnh đại diện
                            </a-button>
                        </a-upload>

                    </div>
                    <!-- Giới thiệu về bản thân -->
                    <div>
                        <h2>Giới thiệu</h2>
                        <a-textarea rows="4" style="width: 80%;" v-model:value="userLogin.cv.brief_intro"></a-textarea>
                    </div>
                    <h3>Thông tin cá nhân</h3>
                    <!-- Họ tên -->
                    <div class="info_fields">
                        <div>Họ và tên:</div>
                        <a-input style="width: 80%;" type="text" class="input" name="fullName"
                            v-model:value="userLogin.cv.fullName" />
                    </div>
                    <!-- Giới tính, ngày sinh -->
                    <a-row class="info_fields">
                        <a-col :span="5">
                            <div> Giới tính:</div>
                            <a-radio-group v-model:value="userLogin.cv.sex">
                                <!-- 1: nam, 2:nu -->
                                <a-radio :value="1">Nam</a-radio>
                                <a-radio :value="2">Nữ</a-radio>
                            </a-radio-group>
                        </a-col>
                        <a-col :span="5">
                            <div> Ngày sinh:</div>
                            <a-date-picker v-model:value="ngaysinh" :format="'DD/MM/YYYY'" @change="console.log('a-date-picker:', useDayjs(birthday).format('DD/MM/YYYY'))" />
                        </a-col>
                        <a-col :span="7">
                            <div>Trình độ:</div>
                            <a-select v-model:value="userLogin.cv.level" style="width:10rem" :options="danhsachTrinhDo"
                                @change="console.log('trinh do', trinhdo)">
                            </a-select>
                        </a-col>
                        <a-col :span="7">
                            <div>Số điện thoại:</div>
                            <a-input style="width: 80%;" type="text" class="input" name="fullName"
                                v-model:value="userLogin.cv.phone" />
                        </a-col>
                    </a-row>
                    <!-- Địa chỉ -->
                    <a-row class="info_fields">
                        <a-col :span="6">
                            <div>Tỉnh/Thành phố sinh sống</div>
                            <a-select v-model:value="userLogin.cv.province" :options="cities" @change="handleSelectCity">
                            </a-select>
                        </a-col>
                        <a-col :span="14">
                            <div>Địa chỉ cụ thể</div>
                            <a-input type="text" class="input" name="fullName" v-model:value="userLogin.cv.address" />
                        </a-col>
                    </a-row>
                </a-col>
                <a-col :span="10">
                    <!-- Thông tin học vấn -->
                    <div class="info_fields">
                        <h3>Thông tin học vấn
                            <a-button v-if="!isAddEducation"
                                @click="showAddEducation(this.isAddEducation = true)">+</a-button>
                        </h3>
                        <!-- Danh sách học vấn -->
                        <div v-for="edu in userLogin.cv.education">
                            <a-row class="education_item">
                                <a-col :span="20">
                                    <div>
                                        <PushpinOutlined /> <b>{{ edu.school }} ({{ edu.start }} - {{ edu.end }})</b>
                                    </div>
                                    <div>Chuyên ngành: {{ edu.major }}</div>
                                    <div>Xếp loại : {{ edu.graded }}</div>
                                </a-col>
                                <a-col :span="4">
                                    <a-button danger @click="handleRemoveEducation(edu._id)">Xóa
                                        <DeleteOutlined />
                                    </a-button>
                                </a-col>
                            </a-row>

                        </div>
                        <!-- Form thêm học vấn -->
                        <a-modal v-model:open="isAddEducation" title="Thêm thông tin học vấn" @ok="handleOk">
                            <div class="education_item">
                                <div>Trường:</div>
                                <a-input style="width: 80%;" type="text" class="input" name="fullName"
                                    v-model:value="edu_School" />
                            </div>
                            <a-row class="info_fields">
                                <a-col :span="12">
                                    <div>Chuyên ngành:</div>
                                    <a-input style="width: 80%;" type="text" class="input" name="fullName"
                                        v-model:value="edu_Major" />
                                </a-col>
                                <a-col :span="12">
                                    <div>
                                        Xếp loại:
                                    </div>
                                    <a-select v-model:value="xeploai" style="width: 10rem" :options="danhsachxeploai"
                                        @change="console.log(xeploai)">
                                    </a-select>
                                </a-col>
                            </a-row>
                            <div class="info_fields">
                                Thời gian đào tạo
                                <a-range-picker v-model:value="value4" picker="month" :format="'MM/YYYY'"
                                    @change="console.log(`thang bat dau: ${useDayjs(value4[0]).format('MM/YYYY')} vs thang ket thuc ${useDayjs(value4[1]).format('MM/YYYY')} `)" />
                            </div>
                            <template #footer>
                                <a-button key="back" @click="this.isAddEducation = false">Hủy</a-button>
                                <a-button key="submit" type="primary" :loading="loading"
                                    @click="handleAddEducation">Thêm</a-button>
                            </template>
                        </a-modal>
                    </div>
                    <!-- Thông tin chứng chỉ/bằng cấp -->
                    <div class="info_fields">
                        <h3>Bằng cấp/Chứng chỉ
                            <a-button v-if="!isAddDegree" @click="this.isAddDegree = true">+</a-button>
                        </h3>
                        <!-- Danh sach bang cap -->
                        <div v-for="degree in userLogin.cv.degreeList">
                            <a-row class="education_item">
                                <a-col :span="20">
                                    <div>
                                        <BookOutlined /> <b>{{ degree.degreeName }}</b>
                                        <p>Kết quả: {{ degree.result }}</p>
                                    </div>
                                    <div></div>
                                </a-col>
                                <a-col :span="4">
                                    <a-button danger @click="handleRemoveEducation(degree._id)">Xóa
                                        <DeleteOutlined />
                                    </a-button>
                                </a-col>
                            </a-row>
                        </div>
                        <!-- Form thêm chứng chỉ -->
                        <a-modal v-model:open="isAddDegree" title="Thêm thông tin bằng cấp/chứng chỉ" @ok="handleOk">
                            <a-row class="info_fields">
                                <a-col :span="15">
                                    <div>Tên chứng chỉ/bằng cấp:</div>
                                    <a-input style="width: 90%;" type="text" class="input" name="fullName"
                                        v-model:value="newDegree" />
                                </a-col>
                                <a-col :span="9">
                                    <div>
                                        Kết quả/đánh giá:
                                    </div>
                                    <a-input style="width: 80%;" type="text" class="input" name="fullName"
                                        v-model:value="ketqua" />
                                </a-col>
                            </a-row>
                            <template #footer>
                                <a-button key="back" @click="this.isAddDegree = false">Hủy</a-button>
                                <a-button key="submit" type="primary" :loading="loading"
                                    @click="handleAddDegree">Thêm</a-button>
                            </template>
                        </a-modal>
                    </div>
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
import dayjs from 'dayjs';
import provinces from '../../assets/data/provinces';
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
            newDegree: '',
            ngaysinh: '',
            isAddDegree: false,
            ketqua: '',
            xeploai: '',
            danhsachxeploai: [
                { label: "Xuất sắc", value: "Xuất sắc" },
                { label: "Giỏi", value: "Giỏi" },
                { label: "Khá", value: "Khá" },
                { label: "Trung Bình", value: "Trung Bình" },
            ],
            value4: [],
            edu_School: '',
            edu_Major: '',
            isAddEducation: false,
            danhsachTrinhDo: [
                { label: "Đại học", value: "Đại học" },
                { label: "Cao đẳng", value: "Cao đẳng" },
                { label: "Trung cấp", value: "Trung cấp" },

            ],
            cities: provinces,
            newBirthday: '',
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
                if (this.userLogin.cv.avatar) {
                    this.fileBase64 = this.userLogin.cv.avatar;
                }
                this.ngaysinh = dayjs(this.userLogin.cv.birthday, 'DD/MM/YY')
                console.log("ung vien>>>  login:", this.userLogin);
            }
        }
    },
    methods: {
        async handleRemoveEducation(eduId) {
            try {
                await $fetch('http://localhost:8000/users/removeEducationInfo/' + this.isLogin, {
                    method: 'PUT',
                    body: { eduId }
                })
                this.userLogin = await $fetch('http://localhost:8000/users/getUser/' + this.isLogin);
            } catch (error) {
                console.log(error)
            }
            console.log("remove user.cv.edu._id ", id)
        },
        async handleAddDegree() {
            try {
                await $fetch('http://localhost:8000/users/insertDegree/' + this.isLogin, {
                    method: 'PUT',
                    body: {
                        degreeName: this.newDegree,
                        result: this.ketqua
                    }
                })
                this.isAddDegree = false;
                this.userLogin = await $fetch('http://localhost:8000/users/getUser/' + this.isLogin);
            } catch (error) {
                console.log(error)
            }
        },
        async handleAddEducation() {
            try {
                await $fetch('http://localhost:8000/users/insertEducation/' + this.isLogin, {
                    method: 'PUT',
                    body: {
                        school: this.edu_School,
                        major: this.edu_Major,
                        start: useDayjs(this.value4[0]).format('MM/YYYY'),
                        end: useDayjs(this.value4[1]).format('MM/YYYY'),
                        graded: this.xeploai
                    }
                })
                this.isAddEducation = false;
                this.userLogin = await $fetch('http://localhost:8000/users/getUser/' + this.isLogin);
            } catch (error) {
                console.log(error)
            }
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
            this.fileBase64 = this.userLogin.cv.avatar;
            this.fileList = [];
        },
        async saveNewInfo() {
            try {
                await $fetch('http://localhost:8000/users/update/' + this.isLogin, {
                    method: 'PUT',
                    body: {
                        avatar: this.fileBase64,
                        fullName: this.userLogin.cv.fullName,
                        brief_intro: this.userLogin.cv.brief_intro,
                        address: this.userLogin.cv.address,
                        phone: this.userLogin.cv.phone,
                        sex: this.userLogin.cv.sex,
                        birthday: useDayjs(this.ngaysinh).format('DD/MM/YYYY'),
                        level: this.userLogin.cv.level,
                        province: this.userLogin.cv.province,
                    }
                });
                message.success("Cập nhật thành công");
                this.resetState();
            } catch (error) {
                console.log(error)
                message.error("Cập nhật thất bại");
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
.education_item:hover {
    cursor: pointer;
    background-color: rgb(240, 235, 235);
}

.info_fields {
    margin: 1rem 0;
}

.avatarBox {
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