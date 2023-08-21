<template>
    
       <span>
        <NuxtLink to="/">
              <left-circle-outlined :style="{fontSize: '1.5rem'}"/>
        </NuxtLink>
        <!-- <left-square-outlined :style="{fontSize: '1.5rem'}"/> -->
    </span>
      <div class="register">    
        <h1>Register form</h1>   
            <form method="post" @submit.prevent="login">
              <div class="field">
                <label class="label">Email</label>
  
                <div class="control">
                  <input
                    type="email"
                    class="input"
                    name="email"
                    v-model="email"
                  >
                </div>
              </div>
  
              <div class="field">
                <label class="label">Password</label>
  
                <div class="control">
                  <input
                    type="password"
                    class="input"
                    name="password"
                    v-model="password"
                  >
                </div>
                <div class="control">
                <button type="submit" class="button is-dark is-fullwidth" @click="dangky">Register</button>
            </div>
              </div>
  
             
            </form>
            <div class="has-text-centered" style="margin-top: 20px">
            <p>
                Already have an account? <nuxt-link to="/login">Login</nuxt-link>
            </p>
        </div>
          
      </div>

  </template>
  
  <script>
  export default {
    data() {
      return {
        email: '',
        password: '',
        error: null,
      };
    },
  
    methods: {
      async login() {
        try {
            console.log({
                    email: this.email,
                    password: this.password,
                })
        } catch (e) {
          this.error = e.response.data.message;
        }
      },
      async dangky() {
            await $fetch('http://localhost:8000/users/create', {
                method: 'POST',
                body: {
                    username: this.email,
                    password: this.password,
                }
            });
            alert("Dang ky thanh cong")
        }
    },
  };
  </script>
  <style lang="scss">
  .register {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 24vh;
  }
  </style>