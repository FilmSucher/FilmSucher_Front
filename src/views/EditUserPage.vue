<template>
  <div class="form">
    <h2>{{ isEdit ? "Edit User: " + id : "Add New User"}}</h2>
    <div class="form-group">
        <input 
          type="text"
          v-model="form.username" 
          placeholder="Username"
          autocomplete="username"
        />
      </div>
      <div class="form-group">
        <input 
          type="text"
          v-model="form.password" 
          placeholder="Password"
          autocomplete="password"
        />
      </div>
      <div class="role-selector">
        <button
            :class="{'active': form.role === 'USER'}"
            @click="form.role = 'USER'"
        >User</button>
        <div class="divider"></div>
        <button
            :class="{'active': form.role === 'ADMIN'}"
            @click="form.role = 'ADMIN'"
        >Admin</button>
      </div>

    <button @click="submit">Save</button>
    <button @click="deleteUser">Delete</button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  setup() {
    const token = localStorage.getItem('token');
    const route = useRoute();
    const router = useRouter();
    const isEdit = ref(route.params.id !== undefined);
    const form = ref({
        username: '',
        password: '',
        role: 'USER'
        });

    onMounted( async () => {
        if (isEdit.value) {
          try{
            const res = await fetch(`/api/users/${route.params.id}`, {
                method: "GET",
                headers: { 'Content-Type': 'application/json', 
                Authorization: `Bearer ${token}` },
            });
            
            const data = await res.json();
            if (res.ok) {
              Object.assign(form.value, data);
            } else {
              alert(data.message || 'Error! User not found!');
            }
          } catch (e){
            alert("Error loading user: " + e.message);
          }
        }
    });

    const deleteUser = async () => {
      const confirmed = window.confirm('Are you sure you want to delete this User?');
      if (!confirmed) return;
            
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`/api/users/${this.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          alert('User deleted');
          this.$emit('deleted');
        } else {
          alert('Error! User not deleted!');
        }
      } catch (err) {
        console.error('Error:', err);
      }
    };

    const submit = async () => {
        if (!form.value.username.trim()) {
          alert("Username is required");
          return;
        }
        if (form.value.password.trim() && form.value.password.trim().length < 8) {
          alert("Password must be at least 8 characters long");
          return;
        }
        if (!['USER', 'ADMIN'].includes(form.value.role)) {
          alert("Role is invalid");
          return;
        }

        const method = isEdit.value? "PATCH" : "POST";
        const url = isEdit.value
                    ? `/api/users/admin/user/${route.params.id}`
                    : `/api/users/admin/user`;
        try{
          const res = await fetch(url, {
              method,
              headers: { 'Content-Type': 'application/json', 
                  Authorization: `Bearer ${token}` },
              body: JSON.stringify(form.value)
          });

          const data = await res.json();

          if (res.ok) {
            alert(data.message || 'User saved!');
            router.push("/users");
          } else {
            alert(data.message || 'Error! User not saved!');
          }
        } catch (err){
          alert ("Error user saved: " + err.message)
        }
    };

    return {
        form,
        isEdit,
        submit,
        deleteUser
    };
  }
};
</script>

<style scoped>
.role-selector {
  display: flex;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 15px;
  width: fit-content;
  margin: 0 auto;
}

.role-selector button {
  flex: 1;
  padding: 10px 20px;
  border: none;
  background: #f0f0f0;
  color: #333;
  cursor: pointer;
  transition: background 0.3s, color 0.3s;
}

.role-selector button:hover {
  background: #e0e0e0;
}

.role-selector button.active {
  background: #444;
  color: white;
  font-weight: bold;
}

.role-selector .divider {
  width: 1px;
  background: #ccc;
}

.form {
  max-width: 400px;
  margin: 80px auto;
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

input {
  padding: 10px;
  width: 100%;
  border-radius: 5px;
  border: 1px solid #ccc;
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