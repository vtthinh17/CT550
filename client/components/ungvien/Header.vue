<template>
  <div class="ungvien">
    <div
      style=" display: flex;flex-direction: row;    justify-content: space-between; background-color: rgb(21, 19, 19);">
      <ul class="header">
        <li>
          <NuxtLink to="/ungvien">Trang tin tổng hợp</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/ungvien/companies">Tham khảo công ty</NuxtLink>
        </li>
        <li v-if="this && this.isLogin && userLogin.role == '1'">
          <NuxtLink to="/ungvien/profile">Hồ sơ cá nhân</NuxtLink>
        </li>
        <li v-if="this && this.isLogin && userLogin.role == '1'">
          <NuxtLink to="/ungvien/appliedPosts">Tin đã nộp</NuxtLink>
        </li>
      </ul>
      <div class="account_setting">
        <a-modal v-model:open="openModal" title="Bạn không có quyền truy cập trang này!" @ok="handleOk">
          <template #footer>
            <a-button key="back" @click="handleCancel">Hủy</a-button>
            <a-button key="submit" type="primary" @click="handleOk">Tiếp tục</a-button>
          </template>
          <p>Bạn cần đăng nhập với tài khoản của nhà tuyển dụng mới có thể truy cập được trang này. Bạn có muốn tiếp tục?
          </p>
        </a-modal>
        <span>
          <span style=" font-weight: 300; color: goldenrod; text-decoration: none; cursor: pointer;" @click="gotoNTD"><SwapOutlined /> Nhà
            tuyển dụng</span>
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
              <a-menu v-if="this.unSeenNotifies.length > 0" style="width: 24rem; height: 14rem; overflow-y: scroll;">
                <a-menu-item style="background-color: rgba(64, 150, 255, 0.49);">
                  <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 700; font-size: 12px;">Danh sách thông báo của bạn</span>
                    <a-button style="font-size: 12px; width: 30%;font-weight: 700;" @click="toggleNotifyBox">Đóng
                      <CloseCircleOutlined />
                    </a-button>
                  </div>
                </a-menu-item>
                <a-menu-item v-for="notify in getNotify" class="notifyItem">
                  <div v-if="notify.action === 'newPost'">
                    <div>
                      <FileDoneOutlined /> Công ty bạn theo dõi vừa đăng tin tuyển dụng mới
                    </div>
                    <div>
                      <span style="background-color: rgba(230, 247, 46, 0.281); padding: 2px; border-radius: 5px;">Vào
                        lúc: {{ notify.timeAt }}</span>
                      <a-divider type="vertical"></a-divider>
                      <span @click="xemTin(notify)"
                        style="color: blue; background-color: rgba(125, 201, 243, 0.2); padding: 2px; border-radius: 5px;">Xem
                        tin
                      </span>
                    </div>
                  </div>
                  <div v-else-if="notify.action === 'newInterview'">
                    <div>
                      <CalendarOutlined /> Bạn có một lịch hẹn phỏng vấn mới
                    </div>
                    <div>
                      <span style="background-color: rgba(230, 247, 46, 0.281); padding: 2px; border-radius: 5px;">Vào
                        lúc: {{ notify.timeAt }}</span>
                      <a-divider type="vertical"></a-divider>
                      <span @click="xemLich(notify)"
                        style="color: blue; background-color: rgba(125, 201, 243, 0.2); padding: 2px; border-radius: 5px;">Xem
                        lịch
                      </span>
                    </div>
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
        <span>
          <div v-if="userLogin.username">
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
            <a-drawer :width="500" title="Đổi mật khẩu" placement="left" v-model:open="openDrawer" @close="onClose">
              <div style="display: flex; flex-direction: column;">
                <a-row style="margin: 4px 0;">
                  <a-col :span="8">
                    <label>Mật khẩu hiện tại:</label>
                  </a-col>
                  <a-col :span="16">
                    <a-input-password v-model:value="currentPass" placeholder="Vui lòng nhập mật khẩu hiện tại" />
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
              <button>Đăng nhập</button>
            </NuxtLink> /
            <NuxtLink to="/register">
              <button>Đăng ký</button>
            </NuxtLink>
          </div>
        </span>
      </div>
    </div>
    <a-modal v-model:open="openNewPost" v-bind:title="'Tuyển dụng: ' + selectedJob.job_title" @ok="handleOk" width="100%">
      <a-row>
        <a-col :span="8">
          <div v-if="companyInfo.com_logo" style="display: flex;justify-content: center;">
            <img style="width: 50%;" alt="example" v-bind:src=companyInfo.com_logo class="job-item_logo" />
          </div>
          <div v-else style="display: flex;justify-content: center;">
            <img style="width: 50%;" alt="example" src="https://vieclam24h.vn/img/vieclam24h_logo_customer.jpg"
              class="job-item_logo" />
          </div>
        </a-col>
        <a-col :span="16">
          <h2>{{ companyInfo.com_name }}</h2>
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
            <a-col :span="10">{{ companyInfo.com_location }}</a-col>
          </a-row>
          <a-row>
            <a-col :span="6"><b>Số điện thoại:</b></a-col>
            <a-col :span="10">{{ companyInfo.com_phone }}</a-col>
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
        <div>
          <div v-if="selectedJob.applied && Object.values(selectedJob.applied).filter(obj => {
            return obj.userId === this.userLogin._id
          }).length > 0">
            <a-button key="back" @click="this.openNewPost = false">Close</a-button>
            <a-button disabled danger>Đã nộp</a-button>
          </div>
          <div v-else>
            <a-button key="back" @click="this.openNewPost = false">Close</a-button>
            <a-button v-if="selectedJob.job_links == undefined" key="submit" type="primary" :loading="loading"
              @click="handleSubmitCV(selectedJob)">Ứng tuyển
            </a-button>

          </div>
        </div>


      </template>
    </a-modal>
    <a-modal v-model:open="openMessage" title="Bạn chưa đăng ký thông tin cá nhân">
      <div>
        Bạn cần có thông tin cá nhân để nhà tuyển dụng có thể xem thông tin của bạn. Bạn có muốn đi đến
        trang đăng ký thông tin cá nhân?
      </div>
      <template #footer>
        <a-button key="back" @click="this.openMessage = false">Close</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleCreateCV">
          Ok
        </a-button>
      </template>
    </a-modal>

  </div>
</template>
<script>
import { message } from 'ant-design-vue';
import Pusher from 'pusher-js';
export default {
  data() {
    return {
      openModal: false,
      openDrawer: false,
      fullName: '',
      address: '',
      major: '',
      errorMsg: '',
      isOpenNotify: false,
      isLogin: false,
      userLogin: {},
      unSeenNotifies: [],
      newPassword: '',
      currentPass: '',
      selectedJob: false,
      companyInfo: false,
      openNewPost: false,
      openMessage: false,
      confirm_newPassword: ''
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
        channel.bind(`newInterview-${this.isLogin}`, (async () => {
          this.unSeenNotifies = await $fetch('http://localhost:8000/notifications/getUnseenNotifies/' + this.isLogin);
        }))
        channel.bind(`newPost-${this.isLogin}`, (async () => {
          this.unSeenNotifies = await $fetch('http://localhost:8000/notifications/getUnseenNotifies/' + this.isLogin);
        }))
      }
    }
  },
  methods: {
    handleCreateCV() {
      navigateTo('createCV')
      this.openMessage = false;
    },
    async handleSubmitCV(selectedJob) {
      if (this.userLogin.role == '1') {
        // Chưa có CV => open modal tạo CV
        if (!this.userLogin.cv.fullName || !this.userLogin.cv.province || !this.userLogin.cv.address) {
          this.openMessage = true
          // Có CV nhưng selectedJob muốn apply đã tồn tại userId => đã nộp 
        } else if (selectedJob.applied && Object.values(selectedJob.applied).filter(obj => {
          return obj.userId === this.userLogin._id
        }).length > 0) {
          message.info('Đã nộp');
        } else {
          try {
            await $fetch('http://localhost:8000/posts/applyJob/' + selectedJob._id, {
              method: 'PUT',
              body: {
                "userId": this.userLogin._id,
                "profile": this.userLogin.cv,
              }
            })
            message.success('Ứng tuyển thành công!');
            await $fetch('http://localhost:8000/notifications/create/', {
              method: 'POST',
              body: {
                fromUserID: this.userLogin._id,
                toUserID: selectedJob.com_created,
                postID: selectedJob._id,
                action: "applyJob"
              }
            })
            this.selectedJob = await $fetch('http://localhost:8000/posts/getPost/' + selectedJob._id);
            this.openNewPost = false
          } catch (error) {
            console.log(error)
          }
        }
      } else {
        message.warning("Bạn cần đăng nhập với tài khoản ứng viên")
      }

      this.openNewPost = false;
    },
    async xemTin(noti) {
      this.companyInfo = await $fetch('http://localhost:8000/users/getUser/' + noti.fromUserID)
      this.selectedJob = await $fetch('http://localhost:8000/posts/getPost/' + noti.postID)
      console.log('this seleceCV', this.selectedCV);
      this.openNewPost = true;
      this.isOpenNotify = false;

      this.open = true;
    },
    async xemLich(date) {
      if(window.location.href !== 'http://localhost:3000/ungvien/appliedPosts'){
        navigateTo('./../../ungvien/appliedPosts');
      }else{
        window.location.reload()
      }
      // console.log('this date', date);
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
          this.isOpenNotify = this.isOpenNotify = !this.isOpenNotify
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
    gotoNTD() {
      if (!this.isLogin || this.userLogin.role == '1')
        this.openModal = true;
      else
        navigateTo('/nhatuyendung')
    },

    handleOk() {
      localStorage.removeItem("loginUserID");
      navigateTo('/login')
      this.openModal = false;
    },
    handleCancel() {
      this.openModal = false;
    },
    logout() {
      console.log("thoat")
      localStorage.removeItem("loginUserID");
      navigateTo('/login')
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
          this.open = false;
          this.logout()
        } catch (error) {
          console.log(error)
          this.errorMsg = 'Register failed, please try again!'
        }
      }

    },
    showDrawer() {
      this.openDrawer = true;
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
.notifyBell {
  margin-right: 1.5rem;
  cursor: pointer;
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
  margin-right: 2rem;
  color: white;
  display: flex;
  align-items: center;
  // background-color: blue;
  width: 25rem;
  justify-content: space-between;
}
</style>