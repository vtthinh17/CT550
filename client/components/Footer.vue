<template>
    <a-layout-footer class="footer">
        <h1 style="text-align: center">  Copyright ©2023 by CUSC</h1>
        <p style="text-align: center">Đại học Cần Thơ</p>
        <div class="contacts">
          <div class="info">
            <ul >
                <li> Địa chỉ: 01 Lý Tự Trọng, Quận Ninh Kiều, TP. Cần Thơ</li>
                <li>Email: cusc@ctu.edu.vn</li>
                <li>Điện thoại: +84 292 373 1072</li>
            </ul>
          </div>
          <!-- <div class="logoCUSC">
            <img  src="https://cusc.ctu.edu.vn/Portals/0/HINH/CUSC-%20chan-%20Mau.png" alt="">
          </div> -->
        </div>



    </a-layout-footer>
</template>
<style>
.footer{
  background-color: rgba(21, 19, 19, 0.877);
  color: white;
}
.contacts{
    justify-content: space-around;
    display: flex;
    flex-direction: row;
    align-items: center
}
.info{
    
    flex: 2;
}

</style>