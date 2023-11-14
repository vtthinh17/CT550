<template>
    <a-layout :name="Ungvien">
        <a-row style="margin-top: 1rem;">
            <!-- Logo -->
            <a-col :span="8">
                <div style="display:flex; justify-content: center;">
                    <img v-if="selectCompany.com_logo" style="width: 40%;" v-bind:src="selectCompany.com_logo" alt="">
                    <img v-else src="https://cdn-icons-png.flaticon.com/128/1607/1607966.png" alt="">
                </div>

            </a-col>
            <a-col :span="16">
                <h2 style="color:blue">{{ selectCompany.com_name }}</h2>
                <b>MST: {{ selectCompany.taxNumber ? selectCompany.taxNumber : 'Chưa cập nhật'}}</b>
                <p v-if="selectCompany && selectCompany.com_location">
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
        <div>
            <a-tabs v-model:activeKey="activeKey" type="card">
                <a-tab-pane key="1" tab="Việc làm đang tuyển">
                    <a-list size="large" bordered :data-source="getCompanyActivePosts">
                        <template #header>
                            <div class="cls1">
                                <h4>Việc làm đang tuyển</h4>
                            </div>
                        </template>

                        <template #renderItem="{ item }">
                            <a-list-item @click="showModal(item)">

                                <div style="width: 50%;">
                                    <b> <b>{{ item.job_title }}</b></b>
                                    <div style="display: flex; flex-direction: row; justify-content: space-around;">
                                        <p>
                                            Mức lương: {{ item.job_salary }}
                                        </p>
                                        <p>
                                            Hạn nộp: {{ item.deadline }}
                                        </p>
                                    </div>
                                </div>
                            </a-list-item>
                        </template>
                    </a-list>
                    <div class="pagination">
                        <a-pagination @change="onChangePagination" v-model:current="currentPage" :pageSize="6"
                            :total="totalCount" />
                    </div>
                </a-tab-pane>
                <a-tab-pane key="2" tab="Thông tin công ty">
                    <p v-if="selectCompany && selectCompany.about">
                        <a-textarea v-model:value="selectCompany.about" :rows="10" />
                    </p>
                    <p v-else>
                        Chưa cập nhật
                    </p>
                </a-tab-pane>

                <template #rightExtra>
                    <a-button v-if="selectCompany && checkIsFollowed(selectCompany._id)" danger
                        @click="handleUnFollowCV(selectCompany._id)">Hủy theo dõi</a-button>
                    <a-button v-else type="primary" @click="handleFollowCV(selectCompany._id)">Theo dõi</a-button>
                </template>
            </a-tabs>

        </div>
        <!-- Modal selectjob info -->
        <a-modal v-model:open="open" v-bind:title="selectedJob.job_title" @ok="handleOk" width="90%">
            <a-row>
                <a-col :span="8">
                    <div v-if="selectCompany.com_logo" style="display: flex;justify-content: center;">
                        <img style="width: 30%;" alt="example" v-bind:src=selectCompany.com_logo class="job-item_logo" />
                    </div>
                    <div v-else style="display: flex;justify-content: center;">
                        <img style="width: 30%;" alt="example" src="https://vieclam24h.vn/img/vieclam24h_logo_customer.jpg"
                            class="job-item_logo" />
                    </div>
                </a-col>
                <a-col :span="16">
                    <h2>{{ selectCompany.com_name }}</h2>
                    <a-row>
                        <a-col :span="6"><b> Lĩnh vực:</b></a-col>
                        <a-col :span="10">{{ selectedJob.major }}</a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="6"><b> Hình thức làm việc:</b></a-col>
                        <a-col :span="10">{{ selectedJob.workingType }}</a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="6"><b> Mức lương:</b></a-col>
                        <a-col :span="10">{{ selectedJob.job_salary }}</a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="6"><b>Yêu cầu kinh nghiệm:</b></a-col>
                        <a-col :span="10">{{ selectedJob.expRequire }}</a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="6"><b>Yêu cầu bằng cấp:</b></a-col>
                        <a-col :span="10">{{ selectedJob.educationRequire }}</a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="6"><b>Địa chỉ công ty:</b></a-col>
                        <a-col :span="10">{{ selectCompany.com_location }}</a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="6"><b>Số điện thoại:</b></a-col>
                        <a-col :span="10">{{ selectCompany.com_phone }}</a-col>
                    </a-row>
                </a-col>
            </a-row>
            <h4>Mô tả công việc:</h4>
            <a-textarea v-model:value="selectedJob.job_description" rows="5"></a-textarea>
            <h4>Yêu cầu công việc:</h4>
            <a-textarea v-model:value="selectedJob.job_requirement" rows="5"></a-textarea>
            <h4>Lợi ích:</h4>
            <a-textarea v-model:value="selectedJob.job_benefit" rows="5"></a-textarea>
            <template #footer>
                <div v-if="selectedJob.applied && Object.values(selectedJob.applied).filter(obj => {
                    return obj.userId === this.userLogin._id
                }).length > 0">
                    <a-button key="back" @click="handleCancel">Close</a-button>
                    <a-button disabled danger>Đã nộp</a-button>
                </div>
                <div v-else>
                    <a-button key="back" @click="handleCancel">Close</a-button>
                    <a-button v-if="selectedJob.job_links == undefined" key="submit" type="primary" :loading="loading"
                        @click="handleSubmitCV(selectedJob)">Ứng tuyển
                    </a-button>
                    <a-button v-else danger :loading="loading" @click="goToJobLink(selectedJob.job_links)">
                        Tham khảo
                    </a-button>
                </div>
            </template>
        </a-modal>

        <!-- create CV if no CV -->
        <a-modal v-model:open="openMessage" title="Bạn chưa có CV">
            <div>
                Tạo cv mới?+
            </div>
            <template #footer>
                <a-button key="back" @click="handleCancel">Close</a-button>
                <a-button key="submit" type="primary" :loading="loading" @click="handleCreateCV">Tạo
                    CV
                </a-button>
            </template>
        </a-modal>

    </a-layout>
</template>
<script>
import { notification } from 'ant-design-vue';
import { message } from 'ant-design-vue';
definePageMeta({
    layout: 'ungvien'
})
export default {
    layout: 'ungvien',
    data() {
        return {
            activeKey: '1',
            selectCompany: false,
            openMessage: false,
            companyActivePosts: [],
            open: false,
            userLogin: false,
            isLogin: '',
            selectedJob: false,
            totalCount: 0,
            currentPage: 1,
        }

    },
    async mounted() {
        if (process.client) {
            this.isLogin = localStorage.getItem('loginUserID');
            if (this.isLogin) {
                this.userLogin = await $fetch('http://localhost:8000/users/getUser/' + this.isLogin);
                console.log("ung vien>>>  login:", this.userLogin);
                
            }
            console.log(this.getCompanyId);
            console.log();
            if (this.getCompanyId) {
                this.selectCompany = await $fetch('http://localhost:8000/users/getUser/' + this.getCompanyId)
            }
        }
        this.reloadCompanyActivePost()

    },
    methods: {
        onChangePagination() {
            this.reloadCompanyActivePost();
        },
        async reloadCompanyActivePost() {
            const postData = await this.getFilterOptions();
            this.companyActivePosts = postData.posts;
            console.log("reload active post",postData )
            this.totalCount = postData.totalCount;
        },
        async getFilterOptions() {
            try {
                return await $fetch(`http://localhost:8000/posts/getCompanyActivePosts/${this.getCompanyId}?currentPage=${this.currentPage}`);
            } catch (error) {
                console.log(error)
            }
        },
        checkIsFollowed(id) {
            let check = false
            if (this.userLogin.follow) {
                Object.values(this.userLogin.follow).forEach((element) => {
                    if (element === id) {
                        check = true
                    }
                })
            }
            return check
        },
        async handleUnFollowCV(candidateId) {
            try {
                await $fetch('http://localhost:8000/users/unfollow/' + this.isLogin, {
                    method: 'PUT',
                    body: {
                        unfollowId: candidateId
                    }
                });
                this.userLogin = await $fetch('http://localhost:8000/users/getUser/' + this.isLogin);
                console.log("huy theo doi", this.userLogin.follow.length)
                message.warning("Hủy theo dõi công ty, bạn sẽ không còn nhận thông báo từ công ty này.")
            } catch (error) {
                console.log(error)
            }
        },
        async handleFollowCV(companyId) {
            try {
                await $fetch('http://localhost:8000/notifications/create/', {
                    method: 'POST',
                    body: {
                        fromUserID: this.isLogin,
                        toUserID: companyId,
                        action: "follow"
                    }
                })
                this.userLogin = await $fetch('http://localhost:8000/users/getUser/' + this.isLogin);
                message.success('Bắt đầu theo dõi công ty, bạn sẽ nhận được thông báo khi công ty này đăng tin tuyển dụng mới.');
            } catch (error) {
                console.log(error)
            }
        },
        async reloadPosts() {
            const newData = await $fetch('http://localhost:8000/posts/getCompanyDisplayPosts/' + useRoute().params.companyId);
            console.log('reload', newData)
            this.companyPosts = newData
            console.log('neww')
        },
        goToJobLink(link) {
            window.open(link);
        },
        openNotificationWithIcon(type) {
            notification[type]({
                placement: "topRight",
                message: (type == 'success' ? 'Ứng tuyển thành công!' : (type == 'info' ? 'Info' : (type == 'warning' ? 'Cảnh báo' : 'Oops, đã có lỗi xảy ra'))),
                description: (type == 'success' ?
                    'Cảm ơn bạn đã sử dụng hệ thống của chúng tôi.'
                    : (type == 'info'
                        ? 'Info'
                        : (type == 'warning'
                            ? 'Cảnh báo'
                            : 'Vui lòng thử lại sau.'))),
            })

        },
        handleCreateCV() {
            navigateTo('../createCV')
        },
        async handleSubmitCV(selectedJob) {
            if (this.userLogin.role == '1') {
                // Chưa có CV => open modal tạo CV
                if (!this.userLogin.cv) {
                    this.openMessage = true
                    // Có CV nhưng selectedJob muốn apply đã tồn tại userId => đã nộp 
                } else if (selectedJob.applied && Object.values(selectedJob.applied).filter(obj => {
                    return obj.userId === this.userLogin._id
                }).length > 0) {
                    message.warning("Đã nộp");
                } else {
                    try {
                        await $fetch('http://localhost:8000/posts/applyJob/' + selectedJob._id, {
                            method: 'PUT',
                            body: {
                                "userId": this.userLogin._id,
                                "profile": this.userLogin.cv,
                            }
                        })
                        this.reloadPosts()
                        this.openNotificationWithIcon('success')
                        console.log("them cv vao selectedJob:", this.userLogin)
                        this.open = false
                    } catch (error) {
                        console.log(error)
                    }
                }
            } else {
                message.warning("Bạn cần đăng nhập với tài khoản ứng viên")
            }

            this.open = false;
        },
        showModal(job) {
            this.selectedJob = job
            this.reloadCompanyActivePost();
            this.open = true;
        },

        handleOk() {
            this.openMessage = false;
            console.log("ok")
            this.open = false;
        },

        handleCancel() {
            this.open = false;
        },
    },
    computed: {
        getCompanyActivePosts() {
            return this.companyActivePosts;
        },
        getCompanyId() {
            return this.$route.params.companyId;
        }
    },
}
</script>

<style lang="scss" scoped>
.pagination {
    display: flex;
    justify-content: center;
    padding: 6px 0px;
}

.cls1 {
    background-color: #9fb8db;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #121417;
}
</style>