<template>
    <a-layout :name="nhatuyendung">
        <!-- <h1>Danh sách hồ sơ ứng viên đã nộp cho bài postId:{{ useRoute().params.postId }}</h1> -->
        <div>
            <h1>
                Tuyển dụng: {{ postData.job_title }}
                {{ }}
            </h1>
            <div style="display: flex; flex-direction: row; justify-content: space-around;">
                <p>Mức lương: {{ postData.job_salary }}</p>
                <p>Hạn nộp: {{ postData.deadline }}</p>
            </div>
            <div>
                <h3>Yêu cầu công việc</h3>
                <p>{{ postData.job_requirement }}</p>
            </div>
            <div>
                <h3>Lợi ich</h3>
                <p>
                    {{ postData.job_benefit }}
                </p>
            </div>
        </div>
        {{ console.log(postData) }}
        <div>
            <a-list size="large" bordered :data-source="postData.applied">
                <template #header>
                    <div class="cls1">
                        <h4>Danh sách ứng viên đã ứng tuyển cho việc làm này</h4>
                    </div>
                </template>
                
                <template #renderItem="{ item }">
                    <a-list-item>
                        <a-row style="width: 50%;">
                            <a-col :span="8">
                                <img style="width: 30%; border-radius: 50%;" src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp" alt="">
                            </a-col>
                            <a-col :span="16">
                                <div>Họ tên: {{ item.profile.fullName }}</div>
                                <div>Lĩnh vực: {{ item.profile.major }}</div>
                                <div>Kinh nghiệm: {{ item.profile.exp }}</div>
                                <div>Bằng cấp: {{ item.profile.certificates }}</div>
                            </a-col>
                        </a-row>
                    </a-list-item>
                </template>

                <template #footer>
                    <div>
                        <a-button type="primary">Xuất ra danh sách file pdf</a-button>
                    </div>
                </template>
            </a-list>
        </div>
    </a-layout>
</template>
  
<script>
definePageMeta({
    layout: 'nhatuyendung'
})

export default {
    setup() {
        const { postId } = useRoute().params;
    },
    data() {
        return {
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

    }
}
</script>
  
<style scoped>
.cls1 {
    background-color: #9fb8db;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #121417;
}
</style>