<template>
    <a-layout :name="nhatuyendung">
        <!-- <h1>Danh sách hồ sơ ứng viên đã nộp cho bài postId:{{ useRoute().params.postId }}</h1> -->

        <!-- Thông tin bài tuyển dụng -->
        <div>
            <h1>
                Tuyển dụng: {{ postData.job_title }}
            </h1>
            <div style="display: flex; flex-direction: row; justify-content: space-around;">
                <p>Mức lương: {{ postData.job_salary }}</p>
                <p>Hạn nộp: {{ postData.deadline }}</p>
            </div>
            <div>
                <h3>Mô tả công việc</h3>
                <a-textarea v-model:value="postData.job_description" rows="4" cols="30"></a-textarea>
            </div>
            <div>
                <h3>Yêu cầu công việc</h3>
                <a-textarea v-model:value="postData.job_requirement" rows="4" cols="30"></a-textarea>
                <!-- <p style="background-color: white; padding: 1rem;">{{ postData.job_requirement }}</p> -->
            </div>
            <div>
                <h3>Lợi ích được hưởng</h3>
                <a-textarea v-model:value="postData.job_benefit" rows="4" cols="30"></a-textarea>
                <!-- <p style="background-color: white; padding: 1rem;">{{ postData.job_benefit }}</p> -->
            </div>
        </div>
        <a-divider />
        <!-- Danh sách ứng viên đã ứng tuyển -->

        <a-list size="large" bordered :data-source="postData.applied">

            <template #header>
                <div class="cls1">
                    <h4>Danh sách ứng viên đã ứng tuyển cho việc làm này</h4>
                </div>
            </template>
            <template #renderItem="{ item }">
                <a-list-item class="hoverItem">
                    <a-row style="width: 80%;">
                        <a-col :span="16">
                            <a-row>
                                <a-col :span="8">
                                    <img style="width: 30%; border-radius: 50%;" v-bind:src="item.profile.avatar" alt="">
                                </a-col>
                                <a-col :span="16">
                                    <div>Họ tên: {{ item.profile.fullName }}</div>
                                    <div>Năm sinh: {{ item.profile.birthday.slice(6, 10) }}</div>
                                    <div>Giới tính:
                                        <span v-if="item.profile.sex == 1">Nam</span>
                                        <span v-else>Nữ</span>
                                    </div>
                                    <div>Nơi sống: {{ item.profile.province }}</div>
                                </a-col>
                            </a-row>
                        </a-col>
                        <a-col :span="8">
                            <a-button type="primary" @click="showCandidateInfo(item)">Xem hồ sơ</a-button>
                            <a-divider type="vertical" />
                            <a-button v-if="Object.values(postData.interviewList)
                                .filter(obj => { return obj.candidateId === item.userId }).length > 0"
                                @click="viewInterviewDate(item)">
                                Xem lịch hẹn
                            </a-button>
                            <a-button v-else type="primary" @click="{ this.isOpen = true; this.selectedCV = item }">
                                Hẹn phỏng vấn
                            </a-button>

                            <!-- <a-button type="primary" @click="console.log('hen pv', item)">Hẹn phỏng vấn</a-button> -->
                        </a-col>
                    </a-row>

                </a-list-item>
            </template>
            <template #footer v-if="postData.applied && postData.applied.length > 0">
                <div>
                    <a-button type="primary" @click="taoExcel(postData.applied)">
                        Xuất danh sách ứng viên ứng tuyển
                    </a-button>

                </div>
            </template>


        </a-list>



        <a-modal v-model:open="open" title="Hồ sơ cá nhân" width="100%" wrap-class-name="full-modal" @ok="handleOk">
            <div class="CV_header">
                <div style="display: flex;">

                </div>


                <a-row>
                    <!-- Thông tin ứng viên -->
                    <a-col :span="6">
                        <img style="width: 30%; border-radius: 10%;" v-bind:src="selectedCV.avatar" alt="">
                        <div>
                            <h2>{{ selectedCV.fullName }}</h2>
                            <a-divider />
                            <h3>Thông tin liên hệ
                                <img width="30" height="30" src="https://img.icons8.com/ios/50/contact-card.png"
                                    alt="contact-card" />
                            </h3>
                            <div>Địa chỉ: {{ selectedCV.address }}</div>
                            <div>Email: {{ selectedCV.username }}</div>
                            <div>Số điện thoại: {{ selectedCV.phone }}</div>
                        </div>
                    </a-col>
                    <!-- Thông tin CV -->
                    <a-col :span="16">
                        <div>
                            <div>
                                <h3>Giới thiệu</h3>
                                <p>{{ selectedCV.brief_intro }}</p>
                            </div>
                            <a-divider />
                            <h3>Học vấn
                                <img width="30" height="30" src="https://img.icons8.com/ios-glyphs/60/flying-motarboard.png"
                                    alt="flying-motarboard" />
                            </h3>
                            <div v-if="selectedCV.education && selectedCV.education.length > 0">
                                <div v-for="edu in selectedCV.education">
                                    <a-row class="education_item">
                                        <a-col :span="20">
                                            <div>
                                                <PushpinOutlined /> <b>{{ edu.school }} ({{ edu.start }} - {{ edu.end
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
                                <img width="30" height="30" src="https://img.icons8.com/windows/32/winner-document.png"
                                    alt="winner-document" />
                            </h3>
                            <div v-if="selectedCV.degreeList && selectedCV.degreeList.length > 0">
                                <div v-for="degree in selectedCV.degreeList">
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
        <!-- phong van -->

        <a-modal v-model:open="isOpen" title="Vui lòng chọn lịch hẹn" wrap-class-name="full-modal"
            @ok="this.isOpen = false">
            <div @click="this.isOpen = false">
                <add-to-calendar-button name="Hẹn phỏng vấn" options="'Google'"
                    location="Trường Đại học Cần Thơ, Khu II, Đ. 3 Tháng 2, Xuân Khánh, Ninh Kiều, Cần Thơ, Việt Nam"
                    startDate="2023-11-09" endDate="2023-11-09" startTime="09:30" endTime="10:00"
                    timeZone="Asia/Ho_Chi_Minh" label="Tạo cuộc họp Google Calendar"
                    organizer="John Doe|thinhb1910303@student.ctu.edu.vn" description="Có mặt trước 10 phút.">
                </add-to-calendar-button>
            </div>

            <a-button class="btnStyle" @click="{ this.isAddInterviewDate = true; this.isOpen = false }">
                <img src="./../../../assets/images/icons8-calendar-32.png" alt="" style="width: 8%;padding-right: 0.5rem;">
                Tạo lịch hẹn trên hệ thống
            </a-button>

        </a-modal>
        <!-- Modal add interview -->
        <a-modal v-model:open="isAddInterviewDate" title="Thêm lịch hẹn phỏng vấn" @ok="handleOk">
            <a-row>
                Thời gian phỏng vấn:
                <a-range-picker :show-time="{ format: 'HH:mm' }" format="YYYY-MM-DD HH:mm"
                    :placeholder="['Start Time', 'End Time']" @change="onRangeChange" @ok="onRangeOk"
                    :disabled-date="disabledDate" />
            </a-row>
            <a-row>
                Địa điểm:
                <a-input type="text" class="input" name="add_jobSalary" v-model:value="interviewLocation" />
            </a-row>
            <a-row>
                Lời nhắn
                <a-textarea v-model:value="interviewMessage" rows="4" cols="30">
                </a-textarea>
            </a-row>
            <template #footer>
                <div>
                    <a-button @click="this.isAddInterviewDate = false">Hủy</a-button>
                    <a-button type="primary" @click="handleAddInterviewDate()">
                        Thêm cuộc hẹn
                    </a-button>
                </div>
            </template>
        </a-modal>
        <!-- Modal view interview -->
        <a-modal v-model:open="viewInterviewOpen" title="Thông tin lịch hẹn phỏng vấn" @ok="handleOk">
            <!-- {{ selectedInterview }} -->
            <a-row>
                Thời gian phỏng vấn:
                <!-- {{ selectedInterview.time }} -->
                <a-range-picker :show-time="{ format: 'HH:mm' }" format="YYYY-MM-DD HH:mm"
                    :placeholder="[selectedInterview.time[0], selectedInterview.time[1]]" @change="onRangeChange"
                    @ok="onRangeOk" :disabled-date="disabledDate" />
            </a-row>
            <a-row>
                Địa điểm:
                <a-input type="text" class="input" name="add_jobSalary" v-model:value="selectedInterview.location" />
            </a-row>
            <a-row>
                Lời nhắn
                <a-textarea v-model:value="selectedInterview.message" rows="4" cols="30">
                </a-textarea>
            </a-row>
            <template #footer>
                <div>
                    <a-button @click="this.viewInterviewOpen = false">Đóng</a-button>
                    <a-button danger @click="handleRemoveInterviewDate">Hủy cuộc hẹn</a-button>
                    <a-button type="primary" @click="handleEditInterviewDate">
                        Chỉnh sửa nội dung
                    </a-button>
                </div>
            </template>
        </a-modal>

    </a-layout>
</template>
  
<script>
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { read, utils, writeFile } from 'xlsx';
import 'add-to-calendar-button';
import { Modal } from 'ant-design-vue';
import { createVNode } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
definePageMeta({
    layout: 'nhatuyendung'
})
export default {
    setup() {


        const { postId } = useRoute().params;

    },
    data() {
        return {
            disabledDate(current) {
                // Can not select days before today and today
                return current && current < dayjs().endOf('day');
            },
            isOpen: false,
            interviewDates: [],
            interviewLocation: null,
            interviewMessage: null,
            selectedCV: null,
            open: false,
            isAddInterviewDate: false,
            viewInterviewOpen: false,
            postData: false,
            isLogin: null,
            userLogin: {},
            selectedInterview: false

        }

    },
    async mounted() {
        if (process.client) {
            this.postData = await $fetch('http://localhost:8000/posts/getPost/' + useRoute().params.postId);
            console.log("post data", this.postData);
            this.isLogin = localStorage.getItem('loginUserID');
            if (this.isLogin !== '') {
                this.userLogin = await $fetch('http://localhost:8000/users/getUser/' + this.isLogin);
            }
        }
    },
    methods: {
        viewInterviewDate(candidate) {
            Object.values(this.postData.interviewList).filter(
                obj => {
                    if (obj.candidateId === candidate.userId) {
                        this.selectedInterview = obj
                    }
                })
            this.selectedCV = candidate
            this.viewInterviewOpen = true
        },
        openNotificationWithIcon(type, mess, des) {
            notification[type]({
                placement: "top",
                message: mess,
                description: des,
            })

        },
        async handleAddInterviewDate() {
            try {
                await $fetch('http://localhost:8000/posts/addInterview/' + useRoute().params.postId, {
                    method: 'PUT',
                    body: {
                        time: this.interviewDates,
                        candidateId: this.selectedCV.userId,
                        location: this.interviewLocation,
                        message: this.interviewMessage,
                    }
                })
                this.postData = await $fetch('http://localhost:8000/posts/getPost/' + useRoute().params.postId);
            } catch (error) {
                console.log(error)
            }
            this.isAddInterviewDate = false
        },
        async handleRemoveInterviewDate() {
            let app = this;
            Modal.confirm({
                title: 'Bạn xác nhận muốn hủy cuộc hẹn này?',
                icon: createVNode(ExclamationCircleOutlined),
                okText: 'Xác nhận',
                okType: 'danger',
                cancelText: 'Hủy',
                async onOk() {
                    try {
                        await $fetch('http://localhost:8000/posts/removeInterview/' + useRoute().params.postId, {
                            method: 'PUT',
                            body: 
                            {
                                candidateId: app.selectedCV.userId,
                            }
                        })
                        app.openNotificationWithIcon(
                            'success',
                            'Xóa cuộc hẹn thành công!',
                            'Thông tin cuộc hẹn này đã được hủy bỏ'
                        )
                        app.postData = await $fetch('http://localhost:8000/posts/getPost/' + useRoute().params.postId);
                        app.viewInterviewOpen = false
                    } catch (error) {
                        console.log(error)
                    }
                },
                onCancel() {
                    console.log('Cancel');
                },
            });



        },

        async handleEditInterviewDate() {
            try {
                await $fetch('http://localhost:8000/posts/editInterview/' + useRoute().params.postId, {
                    method: 'PUT',
                    body: {
                        candidateId: this.selectedCV.userId,
                        message: this.selectedInterview.message,
                        location: this.selectedInterview.location,
                        time: this.interviewDates,
                    }
                })
            } catch (error) {
                console.log(error)
            }
            this.postData = await $fetch('http://localhost:8000/posts/getPost/' + useRoute().params.postId);
            this.viewInterviewOpen = false
        },
        onRangeChange(value, dateString) {
            console.log('Selected Time: ', value);
            console.log('Formatted Selected Time: ', dateString);
            this.interviewDates = dateString
        },
        onRangeOk(value) {
            console.log('onOk: ', value);
        },
        taoExcel(candidatesList) {
            let dataExport = []
            candidatesList.forEach(element => {
                dataExport.push(
                    {
                        Hoten: element.profile.fullName,
                        NgaySinh: element.profile.birthday,
                        TrinhDo: element.profile.level,
                        SoDienThoai: element.profile.phone,
                        DiaChi: element.profile.address,
                    }
                )
            });

            // generates a worksheet
            const worksheet = XLSX.utils.json_to_sheet(dataExport);
            // creates a new workbook
            const workbook = XLSX.utils.book_new();
            // appends a worksheet to the workbook, The new worksheet will be called "Danh sách ứng viên ứng tuyển"
            XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách ứng viên ứng tuyển");

            XLSX.utils.sheet_add_aoa(worksheet, [["Họ tên", "Ngày sinh", "Trình độ", "Số Điện Thoại", "Địa chỉ"]], { origin: "A1" });
            worksheet["!cols"] = [{ wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 40 }];
            XLSX.writeFile(workbook, "DanhSachUngVien.xlsx", { compression: false });

        },
        showCandidateInfo(candidate) {
            this.selectedCV = candidate.profile
            this.open = true;
            console.log("show", candidate)
        },
    }
}
</script>
  
<style scoped>
.btnStyle {
    display: flex;
    align-items: center;
    height: 2.5rem;
    margin-top: 1rem;
    box-shadow: rgba(0 0 0 / 15%) 2px 5px 18px -1px, rgba(0 0 0 / 30%) 2px 2px 10px -3px;
    font-family: arial, helvetica, sans-serif;
    font-size: 1.2em;
    font-weight: 600;
    line-height: 1.5em;
    width: 18.5rem;
    margin-left: 0.5rem;
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