<template>
    <header class="header">
        <div class="title"> Movie Sucher</div>
        <div class="auth-buttons">
            <template v-if="token">
                <span class="username">{{ username }}</span>
                <button @click="favorites">MyList</button>
                <button @click="logout">Logout</button>
            </template>
            <template v-else>
                <router-link to="/login">
                    <button>Login</button>
                </router-link>
            </template>
            <template v-if="isAdmin">
                <router-link to="/add-movie">
                    <button>Add New Film</button>
                </router-link>
            </template>
        </div>
    </header>
</template>

<script>
import { getRoleFromToken } from '@/utils/auth'
export default {
    computed: {
        token() {
            return localStorage.getItem('token');
        },
        username() {
            return localStorage.getItem('username');
        },
        isAdmin () {
            const role = getRoleFromToken();
            return role === 'ADMIN'
        }
    },
    methods: {
        logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            this.$router.push('/');
        },
        favorites() {
            this.$router.push('/favorites');
        }

    }
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  background: #222;
  color: white;
}
.title {
  font-size: 1.4rem;
  font-weight: bold;
}
.auth-buttons {
  display: flex;
  align-items: center;
}
.username {
  margin-right: 10px;
}
button {
  background: #444;
  color: white;
  border: none;
  padding: 6px 12px;
  cursor: pointer;
}
button:hover {
  background: #666;
}
</style>