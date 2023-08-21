<template>
  <a-layout :name="Ungvien">
    <a-list item-layout="horizontal" :data-source="data">
      <template #renderItem="{ item }">
        <a-list-item @click="showDrawer">
          <a-drawer v-model:open="open" class="custom-class" root-class-name="root-class-name"
            :root-style="{ color: 'blue' }" style="color: black" title="Company title" placement="right" size="large">
            <ul>
              <li>
                Giới thiệu
                Công ty TNHH Tôm Giống Châu Phi được thành lập vào cuối năm 2010 chuyên sản xuất giống thuỷ sản nước lợ -
                mặn như các loại giống tôm (sú, thẻ chân trắng) và các loại giống cá biển (cá chẽm, cá bớp, cá mú trân
                châu).

                Đánh dấu bước ngoặc trên chặn đường 10 năm hình thành và phát triển, Công ty Châu Phi đã và đang tích cực
                mở
                rộng sản xuất các đối tượng giống mới và mở rộng thị trường tôm, cá giống trên khắp cả nước. Đặc biệt, năm
                2020 công ty Châu Phi vinh dự nằm trong Top Doanh nghiệp tiêu biểu của tỉnh Ninh Thuận và tự hào là công
                ty
                giống thủy sản đầu tiên tại Việt Nam xuất khẩu thành công giống cá bớp ra thị trường nước ngoài.

                Khách hàng tôm giống của công ty Châu Phi tập trung chủ yếu ở các tỉnh Đồng bằng sông Cửu long (khu vực
                chiếm hơn 70% sản lượng tôm nuôi của Việt Nam). Đối với cá biển giống, công ty Châu Phi đang tập trung vào
                thị trường các tỉnh ven biển miền Trung, nơi tập trung khoảng 2/3 sản lượng cá biển nuôi của Việt Nam.

                Với đội ngũ nhân sự trình độ chuyên môn cao, nhiều kinh nghiệm trong sản xuất và nghiên cứu về giống thủy
                sản, công ty Châu Phi đã phát triển các sản phẩm tôm giống có tính đột phá về mặt chất lượng (mang thương
                hiệu Hawai Aloha, Hawaii+), đáp ứng nhu cầu cấp thiết của người nuôi tôm về sản phẩm tôm giống sạch bệnh,
                nhanh lớn, đều cỡ, có sức chống chịu cao trong điều kiện dịch bệnh tôm ngày càng trở nên khắc nghiệt và
                góp
                phần mang lại sự thành công cho khách hàng. Đồng thời, ý thức được rằng chất lượng tôm giống phụ thuộc rất
                nhiều vào nguồn tôm bố mẹ, công ty Châu Phi cũng đã thiết lập mối quan hệ thương mại chặt chẻ với các công
                ty cung cấp tôm bố mẹ hàng đầu thế giới đến từ Hawaii (Mỹ).

                Bên cạnh đó, trong xu hướng phát triển kinh tế biển, công ty Châu Phi đang nổ lực mở rộng qui mô sản xuất
                giống các loại cá biển chủ lực như cá bớp, cá mú trân châu, … nhằm phục vụ nhu cầu cá giống chất lượng cao
                cho nghề nuôi cá lồng bè trên biển tại Việt Nam, đồng thời hướng đến việc xuất khẩu cá giống ra thị trường
                nước


              </li>
              <li>
                Thôn Hòa Thạnh, Xã An Hải. Ninh Phước, Ninh Thuận
              </li>
              <li>
                MST: 4500464374
              </li>
            </ul>

          </a-drawer>
          <a-list-item-meta description="Thong tin cong ty... crawl sau">
            <template #title>
              <a href="https://www.antdv.com/">{{ item.company[0] }}</a>
            </template>
            <template #avatar>
              <a-avatar v-bind:src="item.logo[0]" />
            </template>
          </a-list-item-meta>

        </a-list-item>

      </template>
    </a-list>
  </a-layout>
</template>
  
<script>
import myData from '../../assets/data/data';

definePageMeta({
  layout: 'ungvien'
})
export default {
  layout: 'ungvien',
  data() {
    return {
      data: [],
      open: Boolean
    }

  },
  mounted() {
    this.data = myData;
    this.open = false

  },
  methods: {
    afterOpenChange(bool) {
      console.log('open', bool);
    },

    showDrawer() {
      this.open = true;
    },
  }

}

</script>

<style scoped>
:where(.css-dev-only-do-not-override-eq3tly).ant-drawer .ant-drawer-mask{
  background: rgba(0, 0, 0, 0.1);
}</style>