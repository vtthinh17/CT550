<template>
    <a-layout :name="Ungvien">
        <div>
            <div style="display:flex; justify-content: center;">
                <img src="https://vieclamcantho.com.vn/public/upload/nhatuyendung/cong-ty-tnhh-giai-phap-phan-mem-doanh-nghiep-5s1521690510587.jpg"
                    alt="">
            </div>
            <h2>{{ useRoute().params.companyId }}</h2>
        </div>
        <div>
            <a-list size="large" bordered :data-source="this.data">
                <template #header>
                    <div class="cls1">
                        <h4>Việc làm đang tuyển</h4>
                    </div>
                </template>
                
                <template #renderItem="{ item }">
                    <a-list-item @click="showModal(item)">
                        <div style="width: 50%;">
                            <b>{{ item.job_title[0] }}</b>
                            <div style="display: flex; flex-direction: row; justify-content: space-around;">
                                <p>
                                Mức lương: {{ item.job_salary }}
                            </p>
                            <p>
                                Hạn nộp: {{ item.deadline_apply }}
                            </p>
                            </div>
                          
                        </div>
                    </a-list-item>
                    <a-modal v-model:open="open" title="Job title" @ok="handleOk">               
                        <div>
                            <div style="display: flex;justify-content: center;">
                                <!-- <img alt="example" v-bind:src=selectedJob.logo[0] class="job-item_logo" /> -->
                            </div>
                            <h4>Yêu cầu công việc:</h4>
                            <span v-for="i in item.job_requirement">
                                {{ i }}
                            </span>

                            <h4>Lợi ích:</h4>
                            <span v-for="i in item.job_benefit">
                                {{ i }}
                            </span>
                        </div>
                        <template #footer>
                            <a-button key="back" @click="handleCancel">Close</a-button>
                            <a-button key="submit" type="primary" :loading="loading" @click="handleOk">Nộp CV</a-button>
                        </template>
                    </a-modal>
                </template>
               
                <template #footer>
                    <div>Footer</div>
                </template>
            </a-list>
        </div>

    </a-layout>
</template>
<script>
definePageMeta({
    layout: 'ungvien'
})
export default {
    layout: 'ungvien',
    setup() {
        const { com } = useRoute().params;

    },
    
    data() {
        return {
            open:false,
            data: [
                { "job_title": ["Nhân Viên Kinh Doanh"], "job_links": "https://vieclam24h.vn/kinh-doanh/nhan-vien-kinh-doanh-c13p131id200251664.html", "job_salary": "5 - 15 triệu", "logo": ["https://vieclam24h.vn/img/vieclam24h_logo_customer.jpg"], "company": ["Công Ty TNHH Gnh Tây Đô"], "job_description": ["- Giới thiệu và bán sản phẩm Dầu Nhớt", "- Tìm kiếm khách hàng tiềm năng.", "- Chăm sóc, quản lý, phát triển hệ thống khách hàng trong địa bàn phụ trách", "- Chăm sóc và hỗ trợ hệ thống Cửa Hàng, Đại lý", "- Cập nhật và cung cấp kịp thời thông tin thị trường cho ban lãnh đạo.", "- Cập nhật chương trình khuyến mãi, chiết khấu đến khách hàng trong khu vực.", "- Chi tiết công việc trao đổi khi phỏng vấn…"], "job_requirement": ["- Số lượng: 02 người", "- Tốt nghiệp trung cấp, cao đẳng chuyên ngành Quản Trị Kinh Doanh, Marketing, kỹ thuật hoặc các ngành liên quan thuộc khối kinh tế.", "- Khả năng tiếp thu và xử lý thông tin tốt, giọng nói dễ nghe.", "- Đam mê kinh doanh, năng động, nhạy bén.", "- Chịu được áp lực công việc, có khả năng làm việc độc lập, có khả năng giao tiếp và thuyết phục.", "- Thành thạo các kỹ năng vi tính văn phòng."], "job_benefit": ["- Nhân viên có năng lực tốt có thể ký hợp đồng chính thức khi chưa hết thời gian thử việc nêu trên.", "- Môi trường làm việc năng động, thân thiện.", "- Lương : Thỏa thuận", "- Thưởng doanh số bán hàng", "- Có nhiều cơ hội thăng tiến", "- Hỗ trợ tiền xăng, tiền điện thoại và các phụ cấp khác", "- Làm việc giờ hành chính từ Sáng 7h30 đến 11h00 - Chiều từ 13h30 đến 17h", "- Tăng lương theo hiệu quả công tác", "- Cam kết đầy đủ các chế độ dành cho người lao động theo như quy định pháp luật hiện hành (BHXH, BHYT, BHTN…).", "- Được nghỉ CN và các ngày lễ theo quy định."], "deadline_apply": "31/08/2023" },
                { "job_title": ["Nhân Viên Kinh Doanh"], "job_links": "https://vieclam24h.vn/kinh-doanh/nhan-vien-kinh-doanh-c13p131id200251664.html", "job_salary": "5 - 15 triệu", "logo": ["https://vieclam24h.vn/img/vieclam24h_logo_customer.jpg"], "company": ["Công Ty TNHH Gnh Tây Đô"], "job_description": ["- Giới thiệu và bán sản phẩm Dầu Nhớt", "- Tìm kiếm khách hàng tiềm năng.", "- Chăm sóc, quản lý, phát triển hệ thống khách hàng trong địa bàn phụ trách", "- Chăm sóc và hỗ trợ hệ thống Cửa Hàng, Đại lý", "- Cập nhật và cung cấp kịp thời thông tin thị trường cho ban lãnh đạo.", "- Cập nhật chương trình khuyến mãi, chiết khấu đến khách hàng trong khu vực.", "- Chi tiết công việc trao đổi khi phỏng vấn…"], "job_requirement": ["- Số lượng: 02 người", "- Tốt nghiệp trung cấp, cao đẳng chuyên ngành Quản Trị Kinh Doanh, Marketing, kỹ thuật hoặc các ngành liên quan thuộc khối kinh tế.", "- Khả năng tiếp thu và xử lý thông tin tốt, giọng nói dễ nghe.", "- Đam mê kinh doanh, năng động, nhạy bén.", "- Chịu được áp lực công việc, có khả năng làm việc độc lập, có khả năng giao tiếp và thuyết phục.", "- Thành thạo các kỹ năng vi tính văn phòng."], "job_benefit": ["- Nhân viên có năng lực tốt có thể ký hợp đồng chính thức khi chưa hết thời gian thử việc nêu trên.", "- Môi trường làm việc năng động, thân thiện.", "- Lương : Thỏa thuận", "- Thưởng doanh số bán hàng", "- Có nhiều cơ hội thăng tiến", "- Hỗ trợ tiền xăng, tiền điện thoại và các phụ cấp khác", "- Làm việc giờ hành chính từ Sáng 7h30 đến 11h00 - Chiều từ 13h30 đến 17h", "- Tăng lương theo hiệu quả công tác", "- Cam kết đầy đủ các chế độ dành cho người lao động theo như quy định pháp luật hiện hành (BHXH, BHYT, BHTN…).", "- Được nghỉ CN và các ngày lễ theo quy định."], "deadline_apply": "31/08/2023" },

            ]
        }

    },
    methods:{
        showModal(job) {
            console.log("abc")
            this.open = true;
        },

        handleOk() {
            console.log("ok")
            this.open = false;
        },

        handleCancel() {
            this.open = false;
        },
    },
}
</script>

<style lang="scss" scoped>
.cls1{
    background-color: #9fb8db;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #121417;
}
</style>