<template>
  <client-only placeholder="Loading...">

    <Head>
      <Title>Việc làm Cần Thơ tổng hợp</Title>
    </Head>
    <a-layout style="min-height: 100vh">
      <adminSider />
      <a-layout>
        <!-- <a-layout-header style="background: #fff; padding: 0" /> -->
        <a-layout-content style="margin: 0 16px">
          <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
            <slot />
          </div>
        </a-layout-content>
        <a-layout-footer style="text-align: center">
          <h3> Hệ thống tuyển dụng việc làm, Created by Vuong Truong Thinh - B19130303</h3>
        </a-layout-footer>
      </a-layout>
    </a-layout>
  </client-only>
</template>

<script>

</script>

<style></style>