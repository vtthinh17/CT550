<template>
    <a-layout :name="admin">
        <div v-if="userLogin && userLogin.role == '3'">
            <h2>Danh sách nhà tuyển dụng</h2>
            <a-layout-content>
                <a-list size="large" bordered :data-source="getAllCompany">
                    <template #renderItem="{ item }">
                        <a-list-item class="hoverItem">
                            <a-row style="width: 80%;">
                                <!-- {{ item.com_name }} -->
                                <a-col :span="16">
                                    <a-row>
                                        <a-col :span="8">
                                            <img v-if="item.com_logo" style="width: 50%; border-radius: 10%;"
                                                v-bind:src="item.com_logo" alt="">
                                            <img v-else style="width: 40%;" alt="example"
                                                src="https://vieclam24h.vn/img/vieclam24h_logo_customer.jpg"
                                                class="job-item_logo" />
                                        </a-col>
                                        <a-col :span="16">
                                            <div><b>{{ item.com_name }}</b></div>
                                            <!-- <div>Địa chỉ: {{ item.com_phone }}</div> -->
                                        </a-col>
                                    </a-row>
                                </a-col>
                                <a-col :span="8">
                                    <a-button type="primary" @click="showCompanyInfo(item)">Xem thông tin công
                                        ty</a-button>
                                    <a-divider type="vertical" />
                                    <a-button danger @click="handleRemoveUser(item)">Xóa người dùng</a-button>
                                </a-col>
                            </a-row>

                        </a-list-item>
                    </template>
                </a-list>


            </a-layout-content>
            <!-- Thông tin công ty -->
            <a-modal v-model:open="open" title="Thông tin công ty" width="100%" wrap-class-name="full-modal"
                @ok="this.open = false">

                <a-row style="margin-top: 1rem;">
                    <!-- Logo -->
                    <a-col :span="8">
                        <div style="display:flex; justify-content: center;">
                            <img v-if="selectCompany.com_logo" style="width: 40%;" v-bind:src="selectCompany.com_logo"
                                alt="">
                            <img v-else src="https://cdn-icons-png.flaticon.com/128/1607/1607966.png" alt="">
                        </div>

                    </a-col>
                    <a-col :span="16">
                        <h2 style="color:blue">{{ selectCompany.com_name }}</h2>
                        <b>MST: {{ selectCompany.taxNumber }}</b>
                        <p v-if="selectCompany.com_location">
                            <PushpinOutlined /><b> Địa chỉ:</b> {{ selectCompany.com_location }}
                        </p>
                        <p v-else>
                            <PhoneOutlined /> <b> Địa chỉ:</b> Chưa cập nhật
                        </p>
                        <!-- SDT -->
                        <p v-if="selectCompany.com_phone">
                            <PhoneOutlined /> <b>Số điện thoại: </b> {{ selectCompany.com_phone }}
                        </p>
                        <p v-else>
                            <PhoneOutlined /> <b>Số điện thoại: </b> Chưa cập nhật
                        </p>

                        <div style="color:blue">

                        </div>
                    </a-col>
                </a-row>
                <a-tabs v-model:activeKey="activeKey" type="card">
                    <a-tab-pane key="1" tab="Việc làm đang tuyển">
                        <a-list size="large" bordered :data-source="selectCompanyPost">
                            <template #header>
                                <div class="cls1">
                                    <h4>Việc làm đang tuyển</h4>
                                </div>
                            </template>

                            <template #renderItem="{ item }">
                                <a-list-item>
                                    <a-row style="width: 100%;">
                                        <a-col :span="14">
                                            <b>Tuyển dụng:</b> {{ item.job_title }}
                                            <div>
                                                <p>
                                                    Mức lương: {{ item.job_salary }}
                                                </p>
                                                <p>
                                                    Hạn nộp: {{ item.deadline }}
                                                </p>

                                                <p>Trạng thái:
                                                    <span v-if="item.status == 0"
                                                        style="background-color: rgb(240, 224, 131); padding: 0.4rem;">
                                                        Đang chờ duyệt
                                                    </span>
                                                    <span v-else-if="item.status == 1"
                                                        style="background-color: rgb(140, 228, 140); padding: 0.4rem;">
                                                        Đang hiển thị
                                                    </span>
                                                    <span v-else
                                                        style="background-color: rgb(237, 154, 154); padding: 0.4rem;">
                                                        Đã ẩn
                                                    </span>
                                                </p>

                                            </div>
                                        </a-col>
                                        <a-col :span="10">
                                            <div style="display: flex; flex-direction: row;">
                                                <a-button type="primary" @click="showModal(item)"> Xem tin tuyển dụng
                                                </a-button>
                                                <a-divider type="vertical" />
                                                <a-button danger @click="handleRemovePost(item)"> Xóa tin tuyển dụng
                                                </a-button>
                                                <a-divider type="vertical" />
                                                <a-button v-if="item.status == 1" @click="changePostStatus(item, 2)"
                                                    style="background-color: rgb(240, 240, 132);"> Ẩn tin tuyển dụng
                                                </a-button>
                                                <a-button v-if="item.status == 0" @click="changePostStatus(item, 1)"
                                                    style="background-color: rgb(66, 243, 66);"> Duyệt/Hiển thị tin
                                                </a-button>
                                            </div>
                                        </a-col>
                                    </a-row>


                                </a-list-item>
                            </template>
                        </a-list>
                    </a-tab-pane>
                    <a-tab-pane key="2" tab="Thông tin công ty">
                        <p v-if="selectCompany.about">
                            <a-textarea v-model:value="selectCompany.about" :rows="10" />
                        </p>
                        <p v-else>
                            Chưa cập nhật
                        </p>
                    </a-tab-pane>

                </a-tabs>
            </a-modal>
            <!-- Thông tin bài tuyển dụng -->
            <!--  -->
            <a-modal v-model:open="openJob" @ok="this.openJob = false"
                v-bind:title="'Tuyển dụng: ' + selectedJob.job_title">
                <div v-if="selectedJob.job_link">
                    {{ console.log("select", selectedJob) }}
                    <div v-if="selectedJob.logo" style="display: flex;justify-content: center;">
                        <img alt="example" v-bind:src=selectedJob.logo class="job-item_logo" />
                    </div>
                    <div v-else style="display: flex;justify-content: center;">
                        <img alt="example" src="https://vieclam24h.vn/img/vieclam24h_logo_customer.jpg"
                            class="job-item_logo" />
                    </div>
                    <h4>Mô tả công việc:</h4>
                    {{ selectedJob.job_description }}

                    <h4>Yêu cầu công việc:</h4>
                    {{ selectedJob.job_requirement }}


                    <h4 v-if="selectedJob.job_benefit">Lợi ích:</h4>
                    {{ selectedJob.job_benefit }}

                </div>
                <div v-else>
                    <div v-if="companyInfo.com_logo" style="display: flex;justify-content: center;">
                        <img alt="example" v-bind:src="companyInfo.com_logo" style="width: 40%;" class="job-item_logo" />
                    </div>
                    <div v-else style="display: flex;justify-content: center;">
                        <img style="width: 40%;" alt="example" src="https://vieclam24h.vn/img/vieclam24h_logo_customer.jpg"
                            class="job-item_logo" />
                    </div>
                    <h4>Yêu cầu công việc:</h4>
                    <span v-for=" i  in  selectedJob.job_requirement ">
                        {{ i }}
                    </span>

                    <h4>Lợi ích:</h4>
                    <span v-for=" i  in  selectedJob.job_benefit ">
                        {{ i }}
                    </span>
                </div>
            </a-modal>
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
            activeKey: '1',
            isLogin: false,
            userLogin: {},
            allUserData: false,
            candidatesList: [],
            open: false,
            openJob: false,
            selectCompany: false,
            selectCompanyPost: false,
            selectedJob: false,
            companyInfo: false,
        }
    },
    methods: {
        async changePostStatus(item, newState) {
            let text;
            if (newState == 2) {
                text = 'Bạn chắc chắn muốn ẩn tin tuyển dụng này?'
            } else {
                text = 'Bạn đồng ý hiển thị tin tuyển dụng này?'
            }
            let app = this;
            Modal.confirm({
                title: text,
                icon: createVNode(ExclamationCircleOutlined),
                okText: 'Xác nhận',
                okType: 'danger',
                cancelText: 'Hủy',
                async onOk() {
                    try {
                        await $fetch('http://localhost:8000/posts/changePostStatus/' + item._id,
                            {
                                method: 'PUT',
                                body: {
                                    status: newState
                                }
                            })
                        message.success('Thay đổi trạng thái tin tuyển dụng thành công');
                        app.selectCompanyPost = await $fetch('http://localhost:8000/posts/getCompanyPosts/' + item.com_created);
                    } catch (error) {
                        console.log(error)
                        // this.openNotificationWithIcon('error')
                    }
                },
                onCancel() {
                    console.log('Cancel');
                },
            });


        },
        handleRemovePost(item) {
            let app = this;
            Modal.confirm({
                title: 'Bạn chắc chắn muốn xóa tin tuyển dụng này?',
                icon: createVNode(ExclamationCircleOutlined),
                okText: 'Xác nhận xóa',
                okType: 'danger',
                cancelText: 'Hủy',
                async onOk() {
                    try {
                        await $fetch('http://localhost:8000/posts/deletePost/' + post._id, { method: 'DELETE', })
                        message.success('Xóa tin thành công');
                        app.allPostData = await $fetch('http://localhost:8000/posts/getAll');
                    } catch (error) {
                        console.log(error);
                    }
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
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
                        app.allUserData = await $fetch('http://localhost:8000/users/getAllCompanies');
                    } catch (error) {
                        console.log(error);
                    }
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        },
        async showModal(job) {
            this.selectedJob = job;
            if (job.com_created) {
                this.companyInfo = await $fetch('http://localhost:8000/users/getUser/' + job.com_created)
            }
            this.openJob = true;

        },
        async showCompanyInfo(candidate) {
            this.selectCompany = candidate
            this.selectCompanyPost = await $fetch('http://localhost:8000/posts/getCompanyPosts/' + candidate._id);
            this.open = true;
            console.log("show", candidate)
        },
    },
    async mounted() {
        if (process.client) {
            this.isLogin = localStorage.getItem('loginUserID');
            if (this.isLogin) {
                this.userLogin = await $fetch('http://localhost:8000/users/getUser/' + this.isLogin);
                this.allUserData = await $fetch('http://localhost:8000/users/getAllCompanies');
            }
        }
    },
    computed: {
        getAllCompany() {
            return Object.values(this.allUserData);
        }
    }
}
</script>

<style scoped lang="scss"></style>