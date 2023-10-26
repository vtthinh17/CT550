<template>
    <a-layout :name="nhatuyendung">
        <!-- <h1>Danh sách hồ sơ ứng viên đã nộp cho bài postId:{{ useRoute().params.postId }}</h1> -->
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
        <div>
            <a-list size="large" bordered :data-source="postData.applied">
                <template #header>
                    <div class="cls1">
                        <h4>Danh sách ứng viên đã ứng tuyển cho việc làm này</h4>
                    </div>
                </template>
                <template #renderItem="{ item }">
                    <a-list-item class="hoverItem" @click="showCandidateInfo(item)">
                        <a-row style="width: 50%;">
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
                    </a-list-item>
                </template>

                <template #footer>
                    <div>
                        <a-button type="primary" @click="taoExcel(postData.applied)">
                            Xuất danh sách ứng viên ứng tuyển
                        </a-button>

                    </div>
                </template>
            </a-list>
        </div>
        <a-modal v-model:open="open" title="Hồ sơ cá nhân" width="100%" wrap-class-name="full-modal" @ok="handleOk">
            <div class="CV_header">
                <a-row>
                    {{ console.log(selectedCV) }}
                    <!-- Thông tin ứng viên -->
                    <a-col :span="6">
                        <img style="width: 30%; border-radius: 10%;" v-bind:src="selectedCV.avatar" alt="">
                        <div>
                            <h2>{{ selectedCV.fullName }}</h2>
                            <!-- <div>
                                <p style="font-weight: lighter;">Giới tính: {{ toStringSex(selectedCV.sex) }}
                                    <br> Ngày sinh: {{ selectedCV.birthday }}
                                    <br>Nơi sinh sống: {{ selectedCV.province }}
                                </p>
                            </div> -->
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
                            <div v-if="selectedCV.education.length > 0">
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
                            <div v-if="selectedCV.degreeList.length > 0">
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
                <a-button type="primary" @click="handleOk">Đóng</a-button>
            </template>
        </a-modal>
    </a-layout>
</template>
  
<script>
import * as XLSX from 'xlsx';
import { read, utils, writeFile } from 'xlsx';
definePageMeta({
    layout: 'nhatuyendung'
})
export default {
    setup() {


        const { postId } = useRoute().params;

    },
    data() {
        return {


            selectedCV: null,
            open: false,
            postData: false
        }

    },
    async mounted() {
        if (process.client) {
            this.postData = await $fetch('http://localhost:8000/posts/getPost/' + useRoute().params.postId);
            console.log("post data", this.postData);
        }
    },
    methods: {
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
            worksheet["!cols"] = [ { wch: 25 },{ wch: 15 },{ wch: 15 },{ wch: 15 },{ wch: 40 } ];
            XLSX.writeFile(workbook, "DanhSachUngVien.xlsx", { compression: false });
            
        },
        showCandidateInfo(candidate) {
            this.selectedCV = candidate.profile
            this.open = true;
            console.log("show", candidate)
        },
        handleCreateExcelCandidatesList(candidatesList) {
            // console.log(candidatesList)
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
            console.log((dataExport))


            // const csvContent = this.convertToCSV(dataExport)
            // const blob = new Blob([csvContent], { type: 'text/csv;charset-utf-8' })
            // const url = URL.createObjectURL(blob);
            // const link = document.createElement('a');
            // link.href = url;
            // link.setAttribute("download", 'export_data.csv');
            // link.click();
        },
        convertToCSV(data) {
            const headers = Object.keys(data[0]);
            const rows = data.map(obj => headers.map(header => obj[header]));
            const headerRow = headers.join(',');
            const csvRows = [headerRow, ...rows.map(row => row.join(','))];
            return csvRows.join('\n');
        }
    }
}
</script>
  
<style scoped>
.hoverItem:hover {
    /* background-color: #121417; */
    opacity: 0.7;
    cursor: pointer;
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