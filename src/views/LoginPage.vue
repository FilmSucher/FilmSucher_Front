<template>
  <div class="auth">
    <h1>Login or Registration</h1>
      <div class="form-group">
        <input 
          type="text"
          v-model="username" 
          placeholder="Username"
          autocomplete="username"
        />
      </div>
      <div class="form-group">
        <input 
          type="password"
          v-model="password" 
          placeholder="Password"
          autocomplete="current-password"
        />
      </div>

    <div class="buttons">
      <button @click="handleLogin">Login</button>
      <button @click="register">Registration</button>
    </div>
    <div class="message" v-if="message">
        {{ message }}
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/utils/auth';

export default {
  setup() {
    const username = ref('');
    const password = ref('');
    const message = ref('');
    const router = useRouter();

    const handleLogin = async () => {
        const trimmed_name = username.value.trim();
        const trimmed_pass = password.value.trim();
        if (trimmed_name.length === 0 || trimmed_pass.length === 0) {
            console.error ('Username or Password is empty');
            return;
        }

        try{
            const res = await fetch('/api/users/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username.value, 
                                       password: password.value })
            })
            // json is valid?
            let data = {};
            try {
              data = await res.json();
            } catch (e) {
              console.warn('Invalid JSON in response');
            }
            
            if (res.ok && data.token) {
                login(data.token, username.value);
                router.push('/');
            } else {
                message.value = data.message || `Login failed with status ${res.status}`;
            }

        } catch (err) {
            message.value = 'Auth-Server is not available';
        }
    };

    const register = async () => {
        const trimmed_name = username.value.trim();
        const trimmed_pass = password.value.trim();
        if (trimmed_name.length === 0 || trimmed_pass === 0) {
            console.error ('Username or Password is empty');
            return;
        }

        try{
            const res = await fetch('/api/users/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username.value, 
                                      password: password.value })
            })
            
            if (res.ok) {
                message.value = 'Registration was successful. Now log in to your profile.';
            } else {
                message.value = data.message || `Registration failed with status ${res.status}`;
            }

        } catch (err) {
            message.value = 'Auth-Server is not available';
        }
    };

    return {
        username,
        password,
        handleLogin,
        register,
        message
    };
  }
};
</script>

<style scoped>
.auth {
  max-width: 400px;
  margin: 80px auto;
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}
.form-group {
  margin-bottom: 15px;
}

input {
  padding: 10px;
  width: 100%;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.buttons {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

button {
  flex: 1;
  padding: 10px;
  background: #444;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background: #666;
}

.message {
  margin-top: 15px;
  font-weight: bold;
  color: #c00;
}
</style>