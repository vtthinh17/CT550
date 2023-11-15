<template>
    <a-layout :name="Ungvien">
        <h3>Danh sách tin tuyển dụng đã nộp</h3>
        <template #header>
            <div class="cls1">
                <h4>Danh sách ứng viên đã ứng tuyển cho việc làm này</h4>
            </div>
        </template>
        <a-list v-if="loaded" size="large" bordered :data-source="Object.values(appliedPost)">
            <template #renderItem="{ item }">
                <a-list-item class="hoverItem">
                    <a-row style="width: 80%;">
                        <a-col :span="16">
                            <a-row>
                                <a-col :span="8">
                                    {{ item.job_title }}
                                </a-col>
                                <a-col :span="16">
                                    Mức lương: {{ item.job_salary }}
                                    <a-divider type="vertical" />
                                    Hạn nộp: {{ item.deadline }}
                                </a-col>
                            </a-row>
                        </a-col>
                        <a-col :span="8">
                            <a-button type="primary" @click="showModal(item)">Xem tin</a-button>
                            <a-divider type="vertical"></a-divider>
                            <a-button type="primary" v-if="checkIsBookedInterview(item)" @click="xemPhongVan(item)">
                                Xem lịch hẹn <CalendarOutlined />
                            </a-button>
                        </a-col>
                    </a-row>
                </a-list-item>
            </template>
        </a-list>
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
                <a-button key="back" @click="this.open=false">Close</a-button>
            </template>
        </a-modal>
        <a-modal v-model:open="viewInterviewOpen" title="Thông tin cuộc hẹn phỏng vấn" @ok="handleOk">
            <a-row>
                <b><ClockCircleOutlined /> Thời gian phỏng vấn</b>: {{ selectedInterview.time[0]}} -> {{ selectedInterview.time[1].slice(11, 16)}} 
            </a-row>
            <a-row>
                <b><TagOutlined /> Địa điểm</b>: {{ selectedInterview.location }}
            </a-row>
            <a-row>
                <b><MessageOutlined /> Lời nhắn</b>: {{ selectedInterview.message  }}
                
            </a-row>
        </a-modal>
    </a-layout>
</template>
<script >
definePageMeta({
    layout: 'ungvien'
})

export default {
    layout: 'ungvien',
    setup() {

    },
    data() {
        return {
            selectCompany: false,
            selectedInterview: false,
            viewInterviewOpen: false,
            isLogin: false,
            userLogin: false,
            selectedJob: false,
            open:false,
            appliedPost: false,
            loaded: false,
        }

    },
    async mounted() {
        if (process.client) {
            this.isLogin = localStorage.getItem('loginUserID');
            if (this.isLogin !== '') {
                this.appliedPost = await $fetch('http://localhost:8000/posts/getAppliedPost/' + this.isLogin);
                console.log('applied:', this.appliedPost)
                this.userLogin = await $fetch('http://localhost:8000/users/getUser/' + this.isLogin);
            }
        }
        this.loaded = true;
    },
    methods: {
        xemPhongVan(post) {
            post.interviewList.forEach((element) => {
                if (element.candidateId == this.isLogin) {
                    this.selectedInterview = element
                    console.log("before xem pv", this.selectedInterview)
                    this.viewInterviewOpen = true
                    console.log("after xem pv", this.selectedInterview)
                }
            })

        },
        async showModal(job) {
            this.selectedJob = job
            this.selectCompany = await $fetch('http://localhost:8000/users/getUser/' + job.com_created)
            this.open = true;
        },

        async handleAddDegree() {
            try {
                await $fetch('' + this.isLogin, {
                    method: 'PUT',
                    body: {

                    }
                })

            } catch (error) {
                console.log(error)
            }
        },
        checkIsBookedInterview(post) {
            let check = false
            post.interviewList.forEach((element) => {
                if (element.candidateId == this.isLogin) {
                    check = true;
                    // this.selectedInterview = element
                }

            })
            return check;
        }
    },

}
</script>

<style scoped lang="scss"></style>