<template>
    <a-layout :name="Ungvien">

        <div v-if="isLogin == ''">
            Bạn cần đăng nhập
        </div>
        <div v-else-if="isLogin != '' && userLogin.cv !== undefined && userLogin.cv.avtar === undefined">
            <h1>Tạo hồ sơ cá nhân của bạn</h1>
            <hr>
            <div>
                <h2>Ảnh đại diện</h2>
                <a-row>
                    <a-col :span="6">
                        <div style="width: 50%;">
                            <img v-if="!fileList.length" style="width: 70%;" src="./../../assets/images/businessman.png"
                                alt="">
                            <img v-else style="width: 70%;" v-bind:src="this.fileBase64" alt="">
                        </div>
                    </a-col>
                    <a-col :span="14">
                        <a-upload :file-list="fileList" :before-upload="beforeUpload" @remove="handleRemove">
                            <a-button v-if="!fileList.length">
                                <upload-outlined></upload-outlined>
                                Tải ảnh lên
                                <br>
                                Định dạng .JPG, .JPEG, .PNG dung lượng thấp hơn 2MB
                            </a-button>
                        </a-upload>
                    </a-col>
                </a-row>
            </div>
            <div>
                <h2>Thông tin cá nhân</h2>
                <div>
                    <b>Giới thiệu về bản thân</b>
                </div>
                <a-textarea placeholder="Viết gì đó về bạn..." name="cv.brief_intro" id="" rows="4" style="width: 80%;"
                    v-model:value="brief_intro" />
            </div>
            <a-row>
                <a-col :span="8">
                    <div>Họ và tên:</div>
                    <a-input style="width: 80%;" type="text" class="input" name="fullName" v-model:value="fullName" />
                </a-col>
                <a-col :span="8">
                    <div> Giới tính:</div>
                    <a-radio-group v-model:value="gioitinh">
                        <!-- 1: nam, 2:nu -->
                        <a-radio :value="1">Nam</a-radio>
                        <a-radio :value="2">Nữ</a-radio>
                    </a-radio-group>
                </a-col>
                <a-col :span="8">
                    <div>Ngày sinh:</div>
                    <a-date-picker v-model:value="birthday" :format="'DD/MM/YYYY'" style="width: 50%"
                        @change="console.log('a-date-picker:', useDayjs(birthday).format('DD/MM/YYYY'))" />
                </a-col>

                <a-col :span="12">
                    <div>Tỉnh/Thành phố sinh sống:</div>
                    <a-select v-model:value="thanhpho" style="width: 220px" :options="cities" @change="handleSelectCity">
                    </a-select>
                </a-col>
                <a-col :span="12">
                    <div>Địa chỉ cụ thể:</div>
                    <a-input style="width: 80%;" type="text" class="input" name="fullName" v-model:value="address" />
                </a-col>
                <a-col :span="12">
                    <div>Trình độ:</div>
                    <a-select v-model:value="trinhdo" style="width: 220px" :options="danhsachTrinhDo"
                        @change="console.log('trinh do', trinhdo)">
                    </a-select>
                </a-col>
                <a-col :span="12">
                    <div>Số điện thoại:</div>
                    <a-input style="width: 80%;" type="text" class="input" name="fullName" v-model:value="phone" />
                </a-col>
            </a-row>
            <div>
                <h1>Thông tin học vấn <a-button v-if="!isAddEducation"
                        @click="showAddEducation(this.isAddEducation = true)">+</a-button></h1>
                <div>
                    <div v-if="isAddEducation">
                        <a-row>
                            <a-col :span="12">
                                <div>Trường:</div>
                                <a-input style="width: 80%;" type="text" class="input" name="fullName"
                                    v-model:value="edu_School" />
                            </a-col>
                            <a-col :span="12">
                                <div>Chuyên ngành:</div>
                                <a-input style="width: 80%;" type="text" class="input" name="fullName"
                                    v-model:value="edu_Major" />
                            </a-col>
                        </a-row>
                        <div>
                            Thời gian đào tạo
                            <a-range-picker v-model:value="value4" picker="month" :format="'MM/YYYY'"
                                @change="console.log(`thang bat dau: ${useDayjs(value4[0]).format('MM/YYYY')} vs thang ket thuc ${useDayjs(value4[1]).format('MM/YYYY')} `)" />
                        </div>
                        <div>
                            <a-button danger @click="this.isAddEducation = false">
                                Hủy
                            </a-button>
                            <a-button type="primary" @click="handleAddEducation">
                                Thêm học vấn
                            </a-button>
                        </div>
                    </div>
                </div>

            </div>
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
// import dayjs from 'dayjs';
import provinces from '../../assets/data/provinces';
definePageMeta({
    layout: 'ungvien'
})

export default {
    layout: 'ungvien',

    data() {
        return {
            edu_School: '',
            edu_Major: '',
            isAddEducation: false,
            value4: [],
            cities: provinces,
            danhsachLinhVuc: [
                { label: "Công nghệ thông tin", value: "Công nghệ thông tin" },
                { label: "Kế toán", value: "Kế toán" },
                { label: "Du lịch", value: "Du lịch" },

            ],
            linhvuc: '',
            danhsachTrinhDo: [
                { label: "Đại học", value: "Đại học" },
                { label: "Cao đẳng", value: "Cao đẳng" },
                { label: "Trung cấp", value: "Trung cấp" },

            ],
            birthday: '',
            trinhdo: '',
            gioitinh: '',
            thanhpho: '',
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
        async handleAddEducation() {
            try {
                    await $fetch('http://localhost:8000/users/insertEducation/' + this.isLogin, {
                    method: 'PUT',
                    body: {
                        school: this.edu_School,
                        major: this.edu_Major,
                        start: useDayjs(this.value4[0]).format('MM/YYYY'),
                        end: useDayjs(this.value4[1]).format('MM/YYYY'),
                    }
                })
                this.isAddEducation = false;
            } catch (error) {
                console.log(error)
            }
        },
        handleSelectCity(value) {
            console.log("chon thanh pho:", value)
        },

        beforeUpload(file) {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                message.error('Bạn chỉ có thể upload file ảnh có định dạng JPEG hoặc PNG !');
                return false;
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('Ảnh phải có dung lượng nhỏ hơn 2MB!');
                return false;
            }
            message.success('Upload successfully');
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
            if (this.userLogin.cv !== undefined && this.userLogin.cv.avtar === undefined) {
                try {
                    await $fetch('http://localhost:8000/users/insertCV/' + this.isLogin, {
                        method: 'PUT',
                        body: {
                            avatar: this.fileBase64,
                            fullName: this.fullName,
                            brief_intro: this.brief_intro,
                            address: this.address,
                            phone: this.phone,
                            sex: this.gioitinh,
                            birthday: useDayjs(this.birthday).format('DD/MM/YYYY'),
                            level: this.trinhdo,
                            province: this.thanhpho
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