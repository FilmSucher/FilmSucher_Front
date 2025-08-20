<template>
    <header class="header">
        <router-link to="/" class="title-link">
            <div class="title">Film Sucher</div>
        </router-link>

        <div class="auth-buttons">
            <template v-if="isAuthenticated">
                <span class="username">{{ username }}</span>
                <button @click="favorites">MyList</button>
                <button @click="handleLogout">Logout</button>
            </template>
            <template v-else>
                <router-link to="/login">
                    <button>Login</button>
                </router-link>
            </template>
            <template v-if="isAdmin">
                <router-link to="/add">
                    <button>Add New Film</button>
                </router-link>
                <router-link to="/users">
                    <button>Manage Users</button>
                </router-link>
            </template>
        </div>
        <!-- DEBUGS BLOCK -->
        <!-- <div class="debug-info">
          <p>isAuthenticated: {{ isAuthenticated }}</p>
          <p>username: {{ username }}</p>
          <p>role (getRoleFromToken): {{ role }}</p>
          <p>isAdmin (computed): {{ isAdmin }}</p>
        </div> -->
    </header>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth, logout } from '@/utils/auth'

export default {
    setup() {
        const router = useRouter();
        const { isAuthenticated, currentUser, isAdmin } = useAuth();

        const username = computed(() => currentUser.value);

        const handleLogout = () => {
            logout();
            router.push('/');
        }

        const favorites = () => {
            router.push('/favorites')
        }

        return {
            isAuthenticated,
            username,
            isAdmin,
            handleLogout,
            favorites
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
.title-link {
  text-decoration: none;
  color: inherit;
}
.title-link:hover .title {
  text-decoration: underline;
  cursor: pointer;
}
</style>