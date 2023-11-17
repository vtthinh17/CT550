<template>
  <div class="nhatuyendung">
    <div
      style="display: flex;flex-direction: row;    justify-content: space-between; background-color: rgba(21, 19, 19, 0.877);">
      <ul class="header">
        <li>
          <NuxtLink to="/nhatuyendung">Tin tuyển dụng của tôi</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/nhatuyendung/candidates">Tìm kiếm ứng viên</NuxtLink>
        </li>
      </ul>
      <div class="account_setting">
        <!-- navigation -->
        <span>
          <NuxtLink style=" font-weight: 300;color: goldenrod; text-decoration: none;" to="/ungvien/">Ứng viên</NuxtLink>
        </span>
        <span v-if="isLogin" class="notifyBell">
          <a-dropdown :open="isOpenNotify">
            <a-badge :count="this.getTotalUnseenNotify()">
              <a-avatar shape="square" @click="toggleNotifyBox">
                <template #icon>
                  <BellOutlined />
                </template>
              </a-avatar>
            </a-badge>
            <template #overlay>
              <a-menu v-if="this.unSeenNotifies.length > 0" style="width: 22rem; height: 14rem; overflow-y: scroll;">
                <a-menu-item style="background-color: rgba(64, 150, 255, 0.49);">
                  <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 700; font-size: 12px;">Danh sách thông báo của bạn</span>
                    <a-button style="font-size: 12px; width: 30%;" @click="toggleNotifyBox">Đóng
                      <CloseCircleOutlined />
                    </a-button>
                  </div>
                </a-menu-item>
                <a-menu-item v-for="notify in getNotify" class="notifyItem">
                  <div v-if="notify.action === 'follow'">
                    <div>
                      <LikeOutlined /> Một người dùng đã đăng ký theo dõi bạn
                    </div>
                    <div>
                      <span style="background-color: rgba(230, 247, 46, 0.281); padding: 2px; border-radius: 5px;">Vào
                        lúc: {{ notify.timeAt }}</span>
                      <a-divider type="vertical"></a-divider>
                      <span @click="xemThongTin(notify.fromUserID)"
                        style="color: blue; background-color: rgba(125, 201, 243, 0.2); padding: 2px; border-radius: 5px;">Xem
                        thông tin</span>
                    </div>
                  </div>
                  <div v-else-if="notify.action === 'approvePost'">
                    <div>
                      <FileDoneOutlined /> Tin tuyển dụng bạn đăng đã được duyệt
                    </div>
                    <div>
                      <span style="background-color: rgba(230, 247, 46, 0.281); padding: 2px; border-radius: 5px;">Vào
                        lúc: {{ notify.timeAt }}</span>
                      <a-divider type="vertical"></a-divider>
                      <span @click="xemApprovedPost(notify.postID)"
                        style="color: blue; background-color: rgba(125, 201, 243, 0.2); padding: 2px; border-radius: 5px;">Xem
                        thông tin</span>
                    </div>
                  </div>
                  <div v-else-if="notify.action === 'applyJob'">
                    <div>
                      <IdcardOutlined /> Tin tuyển dụng của bạn vừa có một ứng viên mới ứng tuyển.
                    </div>
                    <div>
                      <span style="background-color: rgba(230, 247, 46, 0.281); padding: 2px; border-radius: 5px;">Vào
                        lúc: {{ notify.timeAt }}</span>
                      <a-divider type="vertical"></a-divider>
                      <span @click="xemNguoiDungUngTuyen(notify.postID)"
                        style="color: blue; background-color: rgba(125, 201, 243, 0.2); padding: 2px; border-radius: 5px;">Xem
                        thông tin</span>
                    </div>
                  </div>
                  <div v-else>
                    Other action
                  </div>
                </a-menu-item>
              </a-menu>
              <a-menu v-else>
                <a-menu-item>
                  Không có thông báo nào mới!
                </a-menu-item>
              </a-menu>

            </template>
          </a-dropdown>

        </span>
        <!-- profile -->
        <span>
          <div v-if="userLogin">
            <a-dropdown>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="1" @click="showDrawer">
                    <span>Đổi mật khẩu</span>
                  </a-menu-item>
                  <a-menu-item key="2" @click="logout">
                    <span>Thoát</span>
                  </a-menu-item>
                </a-menu>
              </template>
              <a-button>
                <user-outlined />{{ userLogin.username }}
                <DownOutlined />
              </a-button>
            </a-dropdown>
            <a-drawer v-if="userLogin.role == '2'" :width="500" title="Đổi mật khẩu" placement="left" :open="open"
              @close="onClose">
              <div style="display: flex; flex-direction: column;">
                <!-- <h3>Đổi mật khẩu mới</h3> -->
                <a-row style="margin: 4px 0;">
                  <a-col :span="8">
                    <label>Mật khẩu hiện tại:</label>
                  </a-col>
                  <a-col :span="16">
                    <a-input-password v-model:value="currentPass" placeholder="Vui lòng nhập mật khẩu hiện tại" />
                    <!-- <input type="password" v-model="currentPass"> -->
                  </a-col>
                </a-row>
                <a-row style="margin: 4px 0;">
                  <a-col :span="8">
                    <label>Mật khẩu mới:</label>
                  </a-col>
                  <a-col :span="16">
                    <a-input-password v-model:value="newPassword" placeholder="Nhập mật khẩu mới" />
                  </a-col>
                </a-row>
                <a-row style="margin: 4px 0;">
                  <a-col :span="8">
                    <label>Nhập lại mật khẩu mới:</label>
                  </a-col>
                  <a-col :span="16">
                    <a-input-password v-model:value="confirm_newPassword" placeholder="Nhập lại mật khẩu mới" />
                  </a-col>
                </a-row>
              </div>

              <template #footer>
                <a-button style="margin-right: 8px" @click="onClose">Hủy</a-button>
                <a-button type="primary" @click="changePassword(isLogin)">Lưu</a-button>
              </template>
            </a-drawer>
          </div>
          <div v-else>
            <NuxtLink to="/login">
              <button>Login</button>
            </NuxtLink> /
            <NuxtLink to="/register">
              <button>Register</button>
            </NuxtLink>
          </div>
        </span>
      </div>
    </div>
    <!-- modal show candidate CV -->
    <a-modal v-model:open="openNotifyCV" title="Hồ sơ cá nhân" width="100%" wrap-class-name="full-modal" @ok="handleOk">
      <div class="CV_header">
        <a-row>
          <!-- Thông tin ứng viên -->
          <a-col :span="6">
            <div style="width:60%">
              <img v-if="selectedCV.cv.avatar" style="width: 30%; border-radius: 10%;" v-bind:src="selectedCV.cv.avatar"
                alt="">
              <img v-else style="width: 40%; border-radius: 10%;" src="/_nuxt/assets/images/avatar_7610857.png" alt="">
            </div>
            <div>
              <h2>{{ selectedCV.cv.fullName ? selectedCV.cv.fullName : "Chưa cập nhật" }}</h2>
              <div>
                <p style="font-weight: lighter;">Giới tính: {{ selectedCV.cv.sex ? toStringSex(selectedCV.cv.sex) :
                  "Chưa cập nhật" }}
                  <br> Ngày sinh: {{ selectedCV.cv.birthday ? selectedCV.cv.birthday : "Chưa cập nhật" }}
                  <br>Nơi sinh sống: {{ selectedCV.cv.province ? selectedCV.cv.province : "Chưa cập nhật" }}
                </p>
              </div>
              <a-divider />
              <h3>Thông tin liên hệ
                <img width="30" height="30" src="https://img.icons8.com/ios/50/contact-card.png" alt="contact-card" />
              </h3>
              <div>Địa chỉ: {{ selectedCV.cv.address ? selectedCV.cv.address : "Chưa cập nhật" }}</div>
              <div>Email: {{ selectedCV.username ? selectedCV.username : "Chưa cập nhật" }}</div>
              <div>Số điện thoại: {{ selectedCV.cv.phone ? selectedCV.cv.phone : "Chưa cập nhật" }}</div>
            </div>
          </a-col>
          <!-- Thông tin CV -->
          <a-col :span="16">
            <div>
              <div>
                <h3>Giới thiệu</h3>
                <p>{{ selectedCV.cv.brief_intro ? selectedCV.cv.brief_intro : "Chưa cập nhật" }}</p>
              </div>
              <a-divider />
              <h3>Học vấn
                <img width="30" height="30" src="https://img.icons8.com/ios-glyphs/60/flying-motarboard.png"
                  alt="flying-motarboard" />
              </h3>
              <div v-if="selectedCV.cv.education.length > 0">
                <div v-for="edu in selectedCV.cv.education">
                  <a-row class="education_item">
                    <a-col :span="20">
                      <div>
                        <PushpinOutlined /> <b>{{ edu.school }} ({{ edu.start }} - {{ edu.end }})</b>
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
              <div v-if="selectedCV.cv.degreeList.length > 0">
                <div v-for="degree in selectedCV.cv.degreeList">
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
        <a-button type="primary" @click="this.openNotifyCV = false">Đóng</a-button>
      </template>
    </a-modal>

    <a-modal v-model:open="openNewPost" v-bind:title="'Tuyển dụng: ' + selectedJob.job_title" @ok="handleOk" width="100%">
      <a-row>
        <a-col :span="8">
          <div v-if="userLogin.com_logo" style="display: flex;justify-content: center;">
            <img style="width: 50%;" alt="example" v-bind:src=userLogin.com_logo class="job-item_logo" />
          </div>
          <div v-else style="display: flex;justify-content: center;">
            <img style="width: 50%;" alt="example" src="https://vieclam24h.vn/img/vieclam24h_logo_customer.jpg"
              class="job-item_logo" />
          </div>
        </a-col>
        <a-col :span="16">
          <h2>{{ userLogin.com_name }}</h2>
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
            <a-col :span="10">{{ userLogin.com_location }}</a-col>
          </a-row>
          <a-row>
            <a-col :span="6"><b>Số điện thoại:</b></a-col>
            <a-col :span="10">{{ userLogin.com_phone }}</a-col>
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
        <a-button key="back" @click="this.openNewPost = false">Đóng</a-button>
      </template>
    </a-modal>

  </div>
</template>
<script>
import Pusher from 'pusher-js';
export default {
  data() {
    return {
      selectedCV: false,
      selectedJob: false,
      isLogin: '',
      userLogin: false,
      unSeenNotifies: [],
      isOpenNotify: false,
      openNewPost: false,
      open: false,
      newPassword: '',
      currentPass: '',
      confirm_newPassword: '',
      openNotifyCV: false,
    }
  },
  async mounted() {
    if (process.client) {
      this.isLogin = localStorage.getItem('loginUserID');
      if (this.isLogin) {
        this.userLogin = await $fetch('http://localhost:8000/users/getUser/' + this.isLogin);
        this.unSeenNotifies = await $fetch('http://localhost:8000/notifications/getUnseenNotifies/' + this.isLogin);
        const pusher = new Pusher('9890890cdd6b6d94db8d', {
          cluster: 'ap1',
        });
        const channel = pusher.subscribe('recruitment-system');
        channel.bind(`follow-${this.userLogin._id}`, (async () => {
          this.unSeenNotifies = await $fetch('http://localhost:8000/notifications/getUnseenNotifies/' + this.isLogin);
        }))
        channel.bind(`applyJob-${this.userLogin._id}`, (async () => {
          this.unSeenNotifies = await $fetch('http://localhost:8000/notifications/getUnseenNotifies/' + this.isLogin);
        }))
        channel.bind(`approvedPost-${this.userLogin._id}`, (async () => {
          this.unSeenNotifies = await $fetch('http://localhost:8000/notifications/getUnseenNotifies/' + this.isLogin);
        }))
        
      }
    }
  },
  methods: {
    toStringSex(numb) {
      if (numb == 1) return "Nam"
      return "Nữ"
    },
    async xemApprovedPost(postID){
      this.selectedJob = await $fetch('http://localhost:8000/posts/getPost/' + postID)
      this.openNewPost = true;
      this.isOpenNotify = false;
    },
    async xemThongTin(userID) {
      // console.log('selectCV:', userID)
      this.selectedCV = await $fetch('http://localhost:8000/users/getUser/' + userID);
      console.log('this seleceCV', this.selectedCV);
      this.openNotifyCV = true;
      this.isOpenNotify = false;
    },
    xemNguoiDungUngTuyen(noti){
      navigateTo('./../../nhatuyendung/post/'+noti);
    },

    async toggleNotifyBox() {
      // neu co thong bao => open
      if (this.isOpenNotify == false) {
        this.isOpenNotify = !this.isOpenNotify
      } else {
        // dang xem thong bao => check da xem 
        try {
          await $fetch('http://localhost:8000/notifications/markSeenAllNotifies', {
            method: 'PUT',
            body: this.unSeenNotifies
          });
          // reset new State & dong hop thoai
          this.unSeenNotifies = await $fetch('http://localhost:8000/notifications/getUnseenNotifies/' + this.isLogin);
          this.isOpenNotify = !this.isOpenNotify
        } catch (error) {
          console.log(error)
        }
      }
    },
    async markSeenNotifies() {
      try {
        await $fetch('http://localhost:8000/notifications/markSeenAllNotifies', {
          method: 'PUT',
          body: this.unSeenNotifies
        });
        this.unSeenNotifies = await $fetch('http://localhost:8000/notifications/getUnseenNotifies/' + this.isLogin);
        this.isOpenNotify = false
      } catch (error) {
        console.log(error)
      }
    },
    getTotalUnseenNotify() {
      let count = 0;
      this.unSeenNotifies.forEach(notify => {
        if (notify.isViewed === false) {
          count++;
        }
      })
      return count;
    },
    handlechangePassWord(e) {
      console.log(e)
    },
    logout() {
      console.log("thoat")
      localStorage.removeItem("loginUserID", '');
      navigateTo('/')
    },

    showDrawer() {
      this.open = true;
      console.log(this.userLogin.data)
    },
    async changePassword(id) {
      console.log("abc:", this.currentPass)
      if (this.currentPass != this.userLogin.password) {
        alert("Mật khẩu hiện tại không trùng khớp")
      } else if (this.newPassword != this.confirm_newPassword) {
        alert("Nhập lại mật khẩu mới không trùng khớp")
      }
      else {
        try {
          await $fetch('http://localhost:8000/users/changePassword/' + id, {
            method: 'PUT',
            body: {
              password: this.newPassword,
            }
          });
          alert("cap nhat thanh cong, vui long dang nhap lai")
          this.currentPass = '';
          this.newPassword = '';
          this.confirm_newPassword = '';
          this.open = false;
          this.logout()
        } catch (error) {
          console.log(error)
          this.errorMsg = 'Register failed, please try again!'
        }
      }

    },

    onClose() {
      this.open = false;
    },
  },
  computed: {
    getNotify() {
      return this.unSeenNotifies !== undefined ? this.unSeenNotifies.reverse() : [];
    }
  }
}
</script>
<style lang="scss">
.notifyItem{
  background-color: rgba(223, 220, 220, 0.433);
  border: 0.5px solid rgba(68, 64, 64, 0.108);
}
.header {
  margin: 0;
  height: 60px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;

  .router-link-exact-active {
    border-bottom: 4px solid white;
  }

  li {
    list-style: none;
    margin: 0 10px;

    a {
      font-size: 20px;
      text-decoration: none;
      font-weight: bold;
      color: white;
    }
  }

  li:hover {
    opacity: 0.5;
  }

}

.account_setting {
  color: white;
  display: flex;
  align-items: center;
  // background-color: blue;
  width: 20rem;
  justify-content: space-evenly;

}
</style>
---------------
