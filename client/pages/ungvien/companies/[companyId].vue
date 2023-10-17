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
                <b>MST: {{ selectCompany.taxNumber }}</b>
                <p v-if="selectCompany.com_location">
                    <PhoneOutlined /> Địa chỉ: {{ selectCompany.com_location }}
                </p>
                <p v-else>
                    <PhoneOutlined /> Địa chỉ: Chưa cập nhật
                </p>
                <!-- SDT -->
                <p v-if="selectCompany.com_phone">
                    <PhoneOutlined /> SDT: {{ selectCompany.com_phone }}
                </p>
                <p v-else>
                    <PhoneOutlined /> SDT: Chưa cập nhật
                </p>

                <div style="color:blue">

                </div>
            </a-col>
        </a-row>
        <div v-if="userLogin" style="margin-left: 4rem;">

        </div>
        <div>
            <a-tabs v-model:activeKey="activeKey" type="card">
                <a-tab-pane key="1" tab="Việc làm đang tuyển">
                    <a-list size="large" bordered :data-source="newPosts">
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
                </a-tab-pane>
                <a-tab-pane key="2" tab="Thông tin công ty">
                    <p v-if="selectCompany.about">
                    {{ selectCompany.about }}
                    </p>
                    <p v-else>
                        Chưa cập nhật
                    </p>
                    <!-- {{ addBreakLine(selectCompany.about) }} -->
                </a-tab-pane>

                <template #rightExtra>
                    <a-button v-if="selectCompany && checkIsFollowed(selectCompany._id)" danger
                        @click="handleUnFollowCV(selectCompany._id)">Hủy theo dõi</a-button>
                    <a-button v-else type="primary" @click="handleFollowCV(selectCompany._id)">Theo dõi</a-button>
                </template>
            </a-tabs>

        </div>
        <!-- selectjob info -->
        <a-modal v-model:open="open" v-bind:title="selectedJob.job_title" @ok="handleOk">
            <div>
                {{ console.log("selected job:", selectedJob) }}
                <div style="display: flex;justify-content: center;">
                </div>
                <h4>Yêu cầu công việc:</h4>
                <span>
                    {{ selectedJob.job_requirement }}
                </span>

                <h4>Lợi ích:</h4>
                <span>
                    {{ selectedJob.job_benefit }}
                </span>
            </div>
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
                        @click="handleSubmitCV(selectedJob)">Nộp CV
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
definePageMeta({
    layout: 'ungvien'
})
export default {
    layout: 'ungvien',
    data() {
        return {
            activeKey: '1',
            reviewContent: '',
            selectCompany: false,
            openMessage: false,
            companyPosts: [],
            open: false,
            userLogin: false,
            isLogin: '',
            selectedJob: false,
            data: [
                {
                    "job_title": ["Nhân Viên Kinh Doanh"],
                    "job_links": "https://vieclam24h.vn/kinh-doanh/nhan-vien-kinh-doanh-c13p131id200251664.html",
                    "job_salary": "5 - 15 triệu",
                    "logo": ["https://vieclam24h.vn/img/vieclam24h_logo_customer.jpg"],
                    "company": ["Công Ty TNHH Gnh Tây Đô"],
                    "job_description": ["- Giới thiệu và bán sản phẩm Dầu Nhớt", "- Tìm kiếm khách hàng tiềm năng.", "- Chăm sóc, quản lý, phát triển hệ thống khách hàng trong địa bàn phụ trách", "- Chăm sóc và hỗ trợ hệ thống Cửa Hàng, Đại lý", "- Cập nhật và cung cấp kịp thời thông tin thị trường cho ban lãnh đạo.", "- Cập nhật chương trình khuyến mãi, chiết khấu đến khách hàng trong khu vực.", "- Chi tiết công việc trao đổi khi phỏng vấn…"],
                    "job_requirement": ["- Số lượng: 02 người", "- Tốt nghiệp trung cấp, cao đẳng chuyên ngành Quản Trị Kinh Doanh, Marketing, kỹ thuật hoặc các ngành liên quan thuộc khối kinh tế.", "- Khả năng tiếp thu và xử lý thông tin tốt, giọng nói dễ nghe.", "- Đam mê kinh doanh, năng động, nhạy bén.", "- Chịu được áp lực công việc, có khả năng làm việc độc lập, có khả năng giao tiếp và thuyết phục.", "- Thành thạo các kỹ năng vi tính văn phòng."],
                    "job_benefit": ["- Nhân viên có năng lực tốt có thể ký hợp đồng chính thức khi chưa hết thời gian thử việc nêu trên.", "- Môi trường làm việc năng động, thân thiện.", "- Lương : Thỏa thuận", "- Thưởng doanh số bán hàng", "- Có nhiều cơ hội thăng tiến", "- Hỗ trợ tiền xăng, tiền điện thoại và các phụ cấp khác", "- Làm việc giờ hành chính từ Sáng 7h30 đến 11h00 - Chiều từ 13h30 đến 17h", "- Tăng lương theo hiệu quả công tác", "- Cam kết đầy đủ các chế độ dành cho người lao động theo như quy định pháp luật hiện hành (BHXH, BHYT, BHTN…).", "- Được nghỉ CN và các ngày lễ theo quy định."], "deadline_apply": "31/08/2023"
                },
                { "job_title": ["Nhân Viên Kinh Doanh"], "job_links": "https://vieclam24h.vn/kinh-doanh/nhan-vien-kinh-doanh-c13p131id200251664.html", "job_salary": "5 - 15 triệu", "logo": ["https://vieclam24h.vn/img/vieclam24h_logo_customer.jpg"], "company": ["Công Ty TNHH Gnh Tây Đô"], "job_description": ["- Giới thiệu và bán sản phẩm Dầu Nhớt", "- Tìm kiếm khách hàng tiềm năng.", "- Chăm sóc, quản lý, phát triển hệ thống khách hàng trong địa bàn phụ trách", "- Chăm sóc và hỗ trợ hệ thống Cửa Hàng, Đại lý", "- Cập nhật và cung cấp kịp thời thông tin thị trường cho ban lãnh đạo.", "- Cập nhật chương trình khuyến mãi, chiết khấu đến khách hàng trong khu vực.", "- Chi tiết công việc trao đổi khi phỏng vấn…"], "job_requirement": ["- Số lượng: 02 người", "- Tốt nghiệp trung cấp, cao đẳng chuyên ngành Quản Trị Kinh Doanh, Marketing, kỹ thuật hoặc các ngành liên quan thuộc khối kinh tế.", "- Khả năng tiếp thu và xử lý thông tin tốt, giọng nói dễ nghe.", "- Đam mê kinh doanh, năng động, nhạy bén.", "- Chịu được áp lực công việc, có khả năng làm việc độc lập, có khả năng giao tiếp và thuyết phục.", "- Thành thạo các kỹ năng vi tính văn phòng."], "job_benefit": ["- Nhân viên có năng lực tốt có thể ký hợp đồng chính thức khi chưa hết thời gian thử việc nêu trên.", "- Môi trường làm việc năng động, thân thiện.", "- Lương : Thỏa thuận", "- Thưởng doanh số bán hàng", "- Có nhiều cơ hội thăng tiến", "- Hỗ trợ tiền xăng, tiền điện thoại và các phụ cấp khác", "- Làm việc giờ hành chính từ Sáng 7h30 đến 11h00 - Chiều từ 13h30 đến 17h", "- Tăng lương theo hiệu quả công tác", "- Cam kết đầy đủ các chế độ dành cho người lao động theo như quy định pháp luật hiện hành (BHXH, BHYT, BHTN…).", "- Được nghỉ CN và các ngày lễ theo quy định."], "deadline_apply": "31/08/2023" },

            ],
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
        this.selectCompany = await $fetch('http://localhost:8000/users/getUser/' + useRoute().params.companyId)
        console.log("mouted:", this.selectCompany)
        this.companyPosts = await $fetch('http://localhost:8000/posts/getCompanyDisplayPosts/' + useRoute().params.companyId);
        console.log("tin tuyen dung cua cong ty:", this.companyPosts);


    },
    methods: {
        addBreakLine(data) {
            return data.replaceAll("\\n", "\n")
            // console.log("add br", Array.from(data.matchAll(/\n/gi)))
        },
        handleSubmitReview() {
            console.log(this.reviewContent)
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
                alert("unfollow")
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
                console.log("theo doi", this.userLogin.follow)
                alert("follow thanh cong")
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
                    alert("Đã nộp")
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
                alert("bạn cần đăng nhập với tài khoản ứng viên")
            }

            this.open = false;
        },
        showModal(job) {
            this.selectedJob = job
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
        newPosts() {
            return this.companyPosts;
        },
        // newParam(){
        //     return useRoute().params.companyId
        // }
    },

    // watch:{
    //     'routeId':{
    //         return useRoute().params.companyId
    //     }
    // }
}
</script>

<style lang="scss" scoped>
.cls1 {
    background-color: #9fb8db;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #121417;
}
</style>