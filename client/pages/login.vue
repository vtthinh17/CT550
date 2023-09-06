<template>
    <span>
        <NuxtLink to="/">
            <left-circle-outlined :style="{ fontSize: '1.5rem' }" />
        </NuxtLink>

        <!-- <left-square-outlined :style="{fontSize: '1.5rem'}"/> -->
    </span>
    <div class="login">
        <h1>Login form</h1>
        <form method="post" @submit.prevent>

            <div class="field">
                <label class="label">Email:</label>

                <div class="control">
                    <input type="email" class="input" name="email" v-model="email">
                </div>
            </div>

            <div class="field">
                <label class="label">Password:</label>

                <div class="control">
                    <input type="password" class="input" name="password" v-model="password">
                </div>
            </div>
            
            <div class="control">
                <button type="submit" class="button is-dark is-fullwidth" @click="dangnhap">Log In</button>
            </div>
        </form>
        <span v-if="errorMsg" style="color: red;">
                {{ errorMsg }}
            </span>
        <div class="has-text-centered" style="margin-top: 20px">
            <p>
                Don't have an account? <nuxt-link to="/register">Register</nuxt-link>
            </p>
        </div>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            errorMsg: '',
            email: '',
            password: '',
            error: null,
        };
    },

    methods: {
        async dangnhap() {
            if(this.email != '' && this.password!=''){
                try {
                const res = await $fetch('http://localhost:8000/users/login', {
                    method: 'POST',
                    body: {
                        username: this.email,
                        password: this.password,
                    }
                })
                localStorage.setItem("loginUserID", res._id)
                // set loginUser profile to local storage or Pinia(global state)
                if(res.role=='1'){
                    navigateTo('/ungvien')
                }else if(res.role=='2'){
                    navigateTo('/nhatuyendung')
                }else{
                    navigateTo('/admin')
                }
                
                } catch (error) {
                    this.errorMsg = 'Login failed, please try again!'
                    console.log("loi:", error)
                }
            } else {
                this.errorMsg = 'Empty please try input something!'
            }

        }
    },
};
</script>
<style lang="scss">
.login {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 24vh;
}

.field {
    margin: 0.5rem 0;
}

.control {
    display: flex;
    align-items: center;
    justify-content: center;

    .button {
        border-radius: 6px;
        width: 5rem;
        margin-top: 0.5rem;
        height: 2rem;

    }
}</style>