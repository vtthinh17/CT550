<template>
    <a-layout :name="admin">
        <div v-if="userLogin && userLogin.role == '3'">
            <h2>Quản lý danh sách ứng viên</h2>
            <a-layout-content v-if="loaded">
                <div style="background-color: #5b7fb4; padding: 1rem;">
                    <div style="display: flex; justify-content: center;">
                        <a-cascader class="filterOption" v-model:value="filter_gender" style="width: 10%"
                            max-tag-count="responsive" :options="filterOptions_gender" placeholder="Giới tính">
                        </a-cascader>

                        <a-divider type="vertical"></a-divider>
                        <a-cascader class="filterOption" v-model:value="filter_education" style="width: 10%"
                            max-tag-count="responsive" :options="filterOptions_education" placeholder="Trình độ">
                        </a-cascader>
                        <a-divider type="vertical"></a-divider>
                        <a-cascader class="filterOption" v-model:value="filter_province" style="width: 20%"
                            max-tag-count="responsive" :options="provincesOptions" placeholder="Tỉnh/Thành phố">
                        </a-cascader>
                        <a-divider type="vertical"></a-divider>
                        <a-button style="background-color: yellow;" @click="reloadCandidatesList()">Lọc danh sách ứng
                            viên</a-button>
                    </div>
                </div>
                <a-list size="large" bordered :data-source="getCandidatesList">
                    <template #header>
                        <h1>Số lượng: {{ totalCount }}</h1>
                    </template>
                    <template #renderItem="{ item }">
                        <a-list-item class="hoverItem">
                            <a-row style="width: 90%;">
                                <a-col :span="14">
                                    <a-row>
                                        <a-col :span="8">
                                            <img v-if="item.cv.avatar" style="width: 30%; border-radius: 50%;"
                                                v-bind:src="item.cv.avatar" alt="">
                                            <img v-else style="width: 30%; border-radius: 50%;"
                                                src="https://img.icons8.com/windows/32/user-male-circle.png"
                                                alt="user-male-circle--v1" />
                                        </a-col>
                                        <a-col :span="16">
                                            <div>Họ tên: {{ item.cv.fullName ? item.cv.fullName : 'Chưa cập nhật' }}
                                            </div>
                                            <div>Năm sinh: {{ item.cv.birthday ? item.cv.birthday : 'Chưa cập nhật' }}
                                            </div>
                                            <div>Giới tính:
                                                <span v-if="item.cv.sex">
                                                    <span v-if="item.cv.sex == 1">Nam</span>
                                                    <span v-else>Nữ</span>
                                                </span>
                                                <span v-else>Chưa cập nhật</span>

                                            </div>
                                            <div>Nơi sống: {{ item.cv.province ? item.cv.province : 'Chưa cập nhật' }}
                                            </div>
                                        </a-col>
                                    </a-row>
                                </a-col>
                                <a-col :span="10">
                                    <a-button type="primary" @click="showCandidateInfo(item)">Xem hồ sơ</a-button>
                                    <a-divider type="vertical" />
                                    <a-button danger @click="handleRemoveUser(item)">Xóa người dùng</a-button>
                                </a-col>
                            </a-row>

                        </a-list-item>
                    </template>
                </a-list>
                <div class="pagination">
                    <a-pagination @change="onChangePagination" v-model:current="currentPage" :pageSize="6"
                        :total="totalCount" />
                </div>
                <a-modal v-model:open="open" title="Hồ sơ cá nhân" width="100%" wrap-class-name="full-modal" @ok="handleOk">
                    <div class="CV_header">
                        <a-row>

                            <!-- Thông tin ứng viên -->
                            <a-col :span="6">
                                <img v-if="selectedCV.cv.avatar" style="width: 30%; border-radius: 10%;"
                                    v-bind:src="selectedCV.cv.avatar" alt="">
                                <!-- <img v-else style="width: 30%; border-radius: 10%;" src="https://icons8.com/icon/7820/male-user" alt=""> -->
                                <img v-else style="width: 30%; border-radius: 10%;"
                                    src="https://img.icons8.com/windows/32/user-male-circle.png"
                                    alt="user-male-circle--v1" />
                                <div>
                                    <h2>{{ selectedCV.cv.fullName }}</h2>
                                    <a-divider />
                                    <h3>Thông tin liên hệ
                                        <img width="30" height="30" src="https://img.icons8.com/ios/50/contact-card.png"
                                            alt="contact-card" />
                                    </h3>
                                    <div>Địa chỉ: {{ selectedCV.cv.address ? selectedCV.cv.address : 'Chưa cập nhật' }}
                                    </div>
                                    <div>Email: {{ selectedCV.username }}</div>
                                    <div>Số điện thoại: {{ selectedCV.cv.phone ? selectedCV.cv.phone : 'Chưa cập nhật'
                                    }}
                                    </div>
                                </div>
                            </a-col>

                            <!-- Thông tin CV -->
                            <a-col :span="16">

                                <div>
                                    <h3>Giới thiệu</h3>
                                    <p>{{ selectedCV.cv.brief_intro ? selectedCV.cv.brief_intro : 'Chưa cập nhật' }}</p>
                                    <a-divider />
                                    <h3>Học vấn
                                        <img width="30" height="30"
                                            src="https://img.icons8.com/ios-glyphs/60/flying-motarboard.png"
                                            alt="flying-motarboard" />
                                    </h3>
                                    <div v-if="selectedCV.cv.education && selectedCV.cv.education.length > 0">
                                        <div v-for="edu in selectedCV.cv.education">
                                            <a-row class="education_item">
                                                <a-col :span="20">
                                                    <div>
                                                        <PushpinOutlined /> <b>{{ edu.school }} ({{ edu.start }} - {{
                                                            edu.end
                                                        }})</b>
                                                    </div>
                                                    <div>Chuyên ngành: {{ edu.major }}</div>
                                                    <div>Xếp loại : {{ edu.graded }}</div>
                                                </a-col>
                                            </a-row>
                                        </div>
                                    </div>
                                    <div v-else>
                                        Chưa cập nhật
                                    </div>
                                    <a-divider />
                                    <h3>Bằng cấp
                                        <img width="30" height="30"
                                            src="https://img.icons8.com/windows/32/winner-document.png"
                                            alt="winner-document" />
                                    </h3>
                                    <div v-if="selectedCV.cv.degreeList && selectedCV.cv.degreeList.length > 0">
                                        <div v-for="degree in selectedCV.cv.degreeList">
                                            <a-row class="education_item">
                                                <a-col :span="20">
                                                    <div>
                                                        <BookOutlined /> <b>{{ degree.degreeName }}</b>
                                                        <p>Kết quả: {{ degree.result }}</p>
                                                    </div>
                                                    <div></div>
                                                </a-col>

                                            </a-row>
                                        </div>
                                    </div>
                                    <div v-else>
                                        Chưa cập nhật
                                    </div>
                                </div>

                            </a-col>

                        </a-row>
                    </div>
                    <template #footer>
                        <div>
                            <a-button type="primary" @click="this.open = false">Đóng</a-button>


                        </div>
                    </template>
                </a-modal>
            </a-layout-content>
        </div>
        <div v-else>
            Bạn cần đăng nhập với tài khoản quản trị
        </div>



    </a-layout>
</template>

<script>
import { message } from 'ant-design-vue';
import { Modal } from 'ant-design-vue';
import { createVNode } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import provinces from '../../assets/data/provinces';
export default {
    setup() {
        definePageMeta({
            layout: 'admin'
        })

        return {
        }
    },
    data() {
        return {
            filter_education: false,
            filter_province: false,
            filter_gender: false,
            provincesOptions: provinces,
            filterOptions_education: [
                {
                    label: 'Không yêu cầu',
                    value: 'Không yêu cầu',

                },
                {
                    label: 'Cao đẳng',
                    value: 'Cao đẳng',

                },
                {
                    label: 'Trung cấp',
                    value: 'Trung cấp',

                },
                {
                    label: 'Đại học',
                    value: 'Đại học',

                },

            ],
            filterOptions_gender: [
                {
                    label: 'Nam',
                    value: 1,

                },
                {
                    label: 'Nữ',
                    value: 2,

                },
            ],
            isLogin: false,
            userLogin: {},
            candidatesList: [],
            open: false,
            selectedCV: false,
            totalCount: 0,
            currentPage: 1,
            loaded: false,
        }
    },
    methods: {
        onChangePagination() {
            this.reloadCandidatesList();
        },
        async reloadCandidatesList() {
            const userData = await this.getFilterOptions();
            console.log(">>>>>", userData)
            this.candidatesList = userData.users;
            this.totalCount = userData.totalCount;
        },
        async getFilterOptions() {
            try {
                return await $fetch(`http://localhost:8000/users/getAllCandidates?currentPage=${this.currentPage}${this.filter_gender && this.filter_gender[0] ? '&gender=' + this.filter_gender[0] : ''}${this.filter_education && this.filter_education[0] ? '&educationRequire=' + this.filter_education[0] : ''}${this.filter_province && this.filter_province[0] ? '&province=' + this.filter_province[0] : ''}`);
            } catch (error) {
                console.log(error)
            }
        },
        handleRemoveUser(user) {
            let app = this;
            Modal.confirm({
                title: 'Bạn chắc chắn muốn xóa người dùng này?',
                icon: createVNode(ExclamationCircleOutlined),
                okText: 'Xác nhận xóa',
                okType: 'danger',
                cancelText: 'Hủy',
                async onOk() {
                    try {
                        await $fetch('http://localhost:8000/users/' + user._id, { method: 'DELETE', })
                        message.success('Xóa người dùng thành công');
                        app.reloadCandidatesList()
                    } catch (error) {
                        console.log(error);
                    }
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        },
        showCandidateInfo(candidate) {
            this.selectedCV = candidate
            this.open = true;
            console.log("show", candidate)
        },
    },
    async mounted() {
        if (process.client) {
            this.isLogin = localStorage.getItem('loginUserID');
            if (this.isLogin) {
                this.userLogin = await $fetch('http://localhost:8000/users/getUser/' + this.isLogin);
            }
            this.reloadCandidatesList()
            this.loaded = true;
        }
    },
    computed: {
        getCandidatesList() {
            return this.candidatesList;
        }
    }
}
</script>

<style scoped lang="scss">
.pagination {
    display: flex;
    justify-content: center;
    padding: 6px 0px;
}
</style>