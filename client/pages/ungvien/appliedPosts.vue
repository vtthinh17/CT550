<template>
    <a-layout :name="Ungvien">
        <h3>Danh sach tin da nop</h3>
        <template #header>
            <div class="cls1">
                <h4>Danh sách ứng viên đã ứng tuyển cho việc làm này</h4>
            </div>
        </template>
        <a-list size="large" bordered :data-source="Object.values(appliedPost)">
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
                            <a-button type="primary" v-if="checkIsBookedInterview(item)" @click="xemPhongVan(item)">
                                Xem lịch hẹn <CalendarOutlined />
                            </a-button>
                        </a-col>
                    </a-row>
                </a-list-item>
            </template>
        </a-list>
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
            selectedInterview: false,
            viewInterviewOpen: false,
            isLogin: false,
            userLogin: false,
            appliedPost: false,
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