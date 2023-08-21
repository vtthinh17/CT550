import { defineStore } from 'pinia';
export const useUserStore = defineStore({
  id: 'userStore',
  state: () => (
    {
      user: {},
      
    }
  ),
  actions: {
    // async getUser(value: string) {
    //   this.user  = await fetch('http://localhost:8000/users/getUser/'+value, {
    //     method: 'GET',
    // });
    // }
  }
})