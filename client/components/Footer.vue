<template>
    <a-layout-footer class="footer">
        <h1 style="text-align: center">  Copyright ©2023 by CTU</h1>
        <h2 style="text-align: center">Đại học Cần Thơ</h2>
        <div class="contacts">
          <div class="info">
            <ul >
                <li> Địa chỉ: Khu II, đường 3/2, P. Xuân Khánh, Q. Ninh Kiều, TP. Cần Thơ</li>
                <li>Email: dhct@ctu.edu.vn</li>
                <li>Điện thoại: +84 292 3832 663</li>
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