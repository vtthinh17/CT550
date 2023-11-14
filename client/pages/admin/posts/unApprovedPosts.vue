<template>
    <a-layout :name="admin">
        <div v-if="userLogin && userLogin.role == '3'">

            <h2>Danh sách tin đang chờ duyệt</h2>

            <a-layout-content>
                <a-list v-if="totalCount>0" size="large" bordered :data-source="getUnApprovedPosts">
                    <template #header>
                        <h1>Số lượng: {{ totalCount }}</h1>
                    </template>
                    <template #renderItem="{ item }">
                        <a-list-item style="border: 1px solid rgb(128, 121, 121);">
                            <a-row style="width: 100%;">
                                <a-col :span="10">
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
                                            <span v-else style="background-color: rgb(237, 154, 154); padding: 0.4rem;">
                                                Đã ẩn
                                            </span>
                                        </p>

                                    </div>
                                </a-col>
                                <a-col :span="14">
                                    <a-button type="primary" @click="showJob(item)">Xem tin tuyển dụng</a-button>
                                    <a-divider type="vertical" />
                                    <a-button danger @click="deletePost(item)">Xóa tin</a-button>
                                    <a-divider type="vertical" />
                                    <a-button v-if="item.status == 1" @click="changePostStatus(item, 2)"
                                        style="background-color: rgb(240, 240, 132);"> Ẩn tin tuyển dụng
                                    </a-button>
                                    <a-button v-if="item.status == 0" @click="changePostStatus(item, 1)"
                                        style="background-color: rgb(66, 243, 66);"> Duyệt/Hiển thị tin
                                    </a-button>
                                </a-col>
                            </a-row>
                        </a-list-item>
                    </template>
                    <div class="pagination">
                        <a-pagination @change="onChangePagination" v-model:current="currentPage" :pageSize="6"
                            :total="totalCount" />
                    </div>
                </a-list>
                <a-result v-else title="Hiện chưa có tin nào đang chờ duyệt!">
                    <template #icon>
                        <smile-twoTone />
                    </template>
                </a-result>

            </a-layout-content>
            <a-modal width="90%" v-model:open="openJob" @ok="this.openJob = false"
                v-bind:title="'Tuyển dụng: ' + selectedJob.job_title">
                <!-- Tin tham khảo -->
                <div v-if="selectedJob.job_link">
                    <a-row>
                        <a-col :span="8">
                            <div v-if="selectedJob.logo" style="display: flex;justify-content: center;">
                                <img style="width: 30%;" alt="example" v-bind:src=selectedJob.logo class="job-item_logo" />
                            </div>
                            <div v-else style="display: flex;justify-content: center;">
                                <img alt="example" src="https://vieclam24h.vn/img/vieclam24h_logo_customer.jpg"
                                    class="job-item_logo" />
                            </div>
                        </a-col>
                        <a-col :span="16">
                            <h2>{{ selectedJob.company }}</h2>
                            <a-row>
                                <a-col :span="4"><b> Hình thức làm việc:</b></a-col>
                                <a-col :span="10">{{ selectedJob.workingType }}</a-col>
                            </a-row>
                            <a-row>
                                <a-col :span="4"><b> Mức lương:</b></a-col>
                                <a-col :span="10">{{ selectedJob.job_salary }}</a-col>
                            </a-row>
                            <a-row>
                                <a-col :span="4"><b>Yêu cầu kinh nghiệm:</b></a-col>
                                <a-col :span="10">{{ selectedJob.expRequire }}</a-col>
                            </a-row>
                            <a-row>
                                <a-col :span="4"><b>Yêu cầu bằng cấp:</b></a-col>
                                <a-col :span="10">{{ selectedJob.educationRequire }}</a-col>
                            </a-row>
                            <a-row>
                                <a-col :span="4"><b>Địa chỉ công ty:</b></a-col>
                                <a-col :span="10">{{ selectedJob.com_location }}</a-col>
                            </a-row>
                            <a-row>
                                <a-col :span="4"><b>Số điện thoại:</b></a-col>
                                <a-col :span="10">{{ selectedJob.com_phone }}</a-col>
                            </a-row>
                        </a-col>
                    </a-row>
                    <h4>Mô tả công việc:</h4>
                    <a-textarea v-model:value="selectedJob.job_description" rows="5"></a-textarea>
                    <h4>Yêu cầu công việc:</h4>
                    <a-textarea v-model:value="selectedJob.job_requirement" rows="5"></a-textarea>
                    <h4 v-if="selectedJob.job_benefit">Lợi ích:</h4>
                    <a-textarea v-if="selectedJob.job_benefit" v-model:value="selectedJob.job_benefit"
                        rows="5"></a-textarea>

                </div>
                <!-- Tin trên hệ thống -->
                <div v-else>
                    <a-row>
                        <a-col :span="8">
                            <div v-if="companyInfo.com_logo" style="display: flex;justify-content: center;">
                                <img style="width: 30%;" alt="example" v-bind:src=companyInfo.com_logo
                                    class="job-item_logo" />
                            </div>
                            <div v-else style="display: flex;justify-content: center;">
                                <img style="width: 30%;" alt="example"
                                    src="https://vieclam24h.vn/img/vieclam24h_logo_customer.jpg" class="job-item_logo" />
                            </div>
                        </a-col>
                        <a-col :span="16">
                            <h2>{{ companyInfo.com_name }}</h2>
                            <a-row>
                                <a-col :span="4"><b> Hình thức làm việc:</b></a-col>
                                <a-col :span="10">{{ selectedJob.workingType }}</a-col>
                            </a-row>
                            <a-row>
                                <a-col :span="4"><b> Mức lương:</b></a-col>
                                <a-col :span="10">{{ selectedJob.job_salary }}</a-col>
                            </a-row>
                            <a-row>
                                <a-col :span="4"><b>Yêu cầu kinh nghiệm:</b></a-col>
                                <a-col :span="10">{{ selectedJob.expRequire }}</a-col>
                            </a-row>
                            <a-row>
                                <a-col :span="4"><b>Yêu cầu bằng cấp:</b></a-col>
                                <a-col :span="10">{{ selectedJob.educationRequire }}</a-col>
                            </a-row>
                            <a-row>
                                <a-col :span="4"><b>Địa chỉ công ty:</b></a-col>
                                <a-col :span="10">{{ companyInfo.com_location }}</a-col>
                            </a-row>
                            <a-row>
                                <a-col :span="4"><b>Số điện thoại:</b></a-col>
                                <a-col :span="10">{{ companyInfo.com_phone }}</a-col>
                            </a-row>
                        </a-col>
                    </a-row>
                    <h4>Mô tả công việc:</h4>
                    <a-textarea v-model:value="selectedJob.job_description" rows="5"></a-textarea>
                    <h4>Yêu cầu công việc:</h4>
                    <a-textarea v-model:value="selectedJob.job_description" rows="5"></a-textarea>
                    <h4>Lợi ích:</h4>
                    <a-textarea v-model:value="selectedJob.job_benefit" rows="5"></a-textarea>
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
            isLogin: false,
            userLogin: {},
            unApprovedPosts: [],
            totalCount: 0,
            currentPage: 1,
            openJob: false,
            companyInfo: false,
            selectedJob: false,
        }
    },
    methods: {
        onChangePagination() {
            this.reloadUnApprovedPosts();
        },
        async reloadUnApprovedPosts() {
            const postData = await this.getFilterOptions();
            this.unApprovedPosts = postData.posts;
            this.totalCount = postData.totalCount;
        },
        async getFilterOptions() {
            try {
                return await $fetch(`http://localhost:8000/posts/getUnApprovedPosts?currentPage=${this.currentPage}`);
            } catch (error) {
                console.log(error)
            }
        },
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
                        app.reloadUnApprovedPosts()
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
        deletePost(job) {
            let app = this;
            Modal.confirm({
                title: 'Bạn chắc chắn muốn xóa tin tuyển dụng này?',
                icon: createVNode(ExclamationCircleOutlined),
                okText: 'Xác nhận xóa',
                okType: 'danger',
                cancelText: 'Hủy',
                async onOk() {
                    try {
                        await $fetch('http://localhost:8000/posts/deletePost/' + job._id, { method: 'DELETE', })
                        message.success('Xóa tin thành công');
                        app.reloadUnApprovedPosts()
                    } catch (error) {
                        console.log(error);
                    }
                },
                onCancel() {
                    console.log('Cancel');
                },
            });

        },
        async showJob(job) {
            this.selectedJob = job
            if (job.com_created) {
                this.companyInfo = await $fetch('http://localhost:8000/users/getUser/' + job.com_created)
            }
            this.openJob = true;
            console.log("show", job)
        },
    },
    async mounted() {
        if (process.client) {
            this.isLogin = localStorage.getItem('loginUserID');
            if (this.isLogin) {
                this.userLogin = await $fetch('http://localhost:8000/users/getUser/' + this.isLogin);
            }
            this.reloadUnApprovedPosts();
        }
    },
    computed: {
        getUnApprovedPosts() {
            return this.unApprovedPosts;
        },
    }
}
</script>

<style scoped lang="scss">
.pagination {
    display: flex;
    justify-content: center;
    padding: 6px 0px;
    // background-color: rgb(203, 191, 191);
}
</style>