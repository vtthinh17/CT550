<template>
    <div class="splashPage">
        <!-- {{ console.log("storage:>>>>",localStorage.getItem('login')) }} -->
        <div class="hinh">
            <img src="/_nuxt/assets/images/splash_page.jpg" alt="">
        </div>

        <h1>Bạn là</h1>
        <br>
        <NuxtLink to="./nhatuyendung/">
            <button class="nut">Nhà tuyển dụng</button>
        </NuxtLink>
        <br>
        <NuxtLink to="./ungvien/">
            <button class="nut">
                Ứng viên tìm việc
            </button>
        </NuxtLink>


    </div>
</template>

<script>
</script>

<style>
::-webkit-scrollbar {
    display: none;
}

.splashPage {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.hinh {
    display: flex;
    justify-content: center;
}

.hinh img {
    width: 30%;
}

.nut {
    font-weight: bolder;
    border-radius: 4px;
    cursor: pointer;
    width: 150px;
    height: 50px;
}

a {
    text-decoration: none;
}
</style>