<template>
  <a-layout :name="nhatuyendung">
    <h1>Danh sách ứng viên</h1>
    <div>
      <div>
        <a-row v-for="candidate in candidatesData" class="candidate_CV" @click="showModal(candidate)"
          style="background-color: rgb(200, 210, 200); margin: 1rem 0; box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;">
          <!-- {{ candidate }} -->
          <a-col :span="8">
            <img style="width: 30%; border-radius: 50%;"
              src="https://vieclamcantho.com.vn/public/upload/nhatuyendung/cong-ty-tnhh-giai-phap-phan-mem-doanh-nghiep-5s1521690510587.jpg"
              alt="">
          </a-col>
          <a-col :span="16">
            <div v-if="candidate.cv">
              <h2>{{ candidate.cv.major }}</h2>
              <a-row>
                <a-col :span="8" style="border-right: 1px solid black;">
                  <div>Họ tên: {{ candidate.cv.fullName }}</div>
                  <div>Năm sinh: 2001</div>
                </a-col>
                <a-col :span="12" style="margin-left: 1rem;">
                  <div>Kinh nghiệm: {{ candidate.cv.exp }}</div>
                  <div>Học vấn: {{ candidate.cv.education }}</div>
                  <div>Lĩnh vực: {{ candidate.cv.major }}</div>
                  <div>Địa chỉ: {{ candidate.cv.address }}</div>
                </a-col>
              </a-row>
            </div>
          </a-col>
        </a-row>

        <a-modal v-model:open="open" title="Hồ sơ cá nhân" width="100%" wrap-class-name="full-modal" @ok="handleOk">
          <!-- <p>{{ selectedCV.hang }}</p> -->
          <div class="CV_header">
            <a-row>
              <!-- Thông tin ứng viên -->
              <a-col :span="8">
                <img style="width: 30%; border-radius: 50%;"
                  src="https://vieclamcantho.com.vn/public/upload/nhatuyendung/cong-ty-tnhh-giai-phap-phan-mem-doanh-nghiep-5s1521690510587.jpg"
                  alt="">
                <div>
                  <b>{{ selectedCV.cv.fullName }}</b>
                  <div>Năm sinh: 2001</div>
                  <div>Giới tính: Nam</div>
                  <div>{{ selectedCV.cv.address }}</div>
                </div>
                <hr>
                <div>
                  Email: {{ selectedCV.username }}
                </div>
                <div>Số điện thoại: {{ selectedCV.cv.phone }}</div>
                <div>
                  FaceBook:
                  Linked:
                </div>

              </a-col>
              <!-- Thông tin CV -->
              <a-col :span="16">
                <div>
                  <div>
                    <h2>Giới thiệu</h2>
                    <p>{{ selectedCV.cv.brief_intro }}</p>
                  </div>
                  <hr>
                  <div>
                    <h2>Học vấn</h2>
                    <p>Đại học Cần Thơ: {{ selectedCV.cv.education }}</p>
                  </div>
                  <!-- <p>Xếp loại: Giỏi</p> -->

                  <hr>
                  <div v-if="selectedCV.cv.certificates">
                    <h2>Bằng cấp</h2>
                    <p>{{ selectedCV.cv.certificates }}</p>
                  </div>

                  <hr>
                 <div v-if="selectedCV.cv.exp">
                  <h2>Kinh nghiệm làm việc</h2>
                  <p>{{ selectedCV.cv.exp }}</p>
                 </div>

                  <!-- <hr>
                  <h2>Kỹ năng</h2>
                  <p>Làm việc nhóm, Lắng nghe, Học và tự học</p> -->
                </div>
              </a-col>
            </a-row>
          </div>
          <template #footer>
            <a-button @click="handleOk">Hủy</a-button>
            <a-button type="primary" @click="handleFollowCV(selectedCV._id)">Lưu hồ sơ</a-button>
          </template>
        </a-modal>
      </div>
    </div>
  </a-layout>
</template>

<script>
definePageMeta({
  layout: 'nhatuyendung'
})
export default {
  data() {
    return {
      isLogin: null,
      userLogin: {},
      open: false,
      candidatesData: false,
      selectedCV: null,
    }
  },
  async mounted() {
    if (process.client) {
      this.isLogin = localStorage.getItem('loginUserID');
      if (this.isLogin !== '') {
        this.userLogin = await $fetch('http://localhost:8000/users/getUser/' + this.isLogin);
      }
      this.candidatesData = await $fetch('http://localhost:8000/users/getCandidates');
      console.log("candidates data", this.candidatesData);
    }
  },
  methods: {
    async handleFollowCV(candidateId) {
      console.log("them candidate ID vao follow list =>>  ", candidateId)
      // try {
      //   await $fetch('http://localhost:8000/users/followCandidate/' + candidateId, {method: 'PUT',})
      // } catch (error) {
      //   console.log(error)
      // }
    },
    showModal(candidate) {
      this.selectedCV = candidate
      console.log("cv:", this.selectedCV)
      this.open = true;
    },
    handleOk() {
      this.open = false;
    },
  }
}
</script>

<style scoped>
.ant-modal {
  max-width: 100%;
  top: 0;
  padding-bottom: 0;
  margin: 0;
}

.ant-modal-content {
  display: flex;
  flex-direction: column;
  height: calc(100vh);
}

.ant-modal-body {
  flex: 1;
}

.candidate_CV {
  cursor: pointer;
}
</style>