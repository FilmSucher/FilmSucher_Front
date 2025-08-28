<template>
    <div class="user">
        <div class="column id">
            <p class="id"><strong>User ID:</strong>{{ id }}</p>
        </div>
        <div class="column name">
            <p class="name"><strong>Username:</strong>{{ username }}</p>
        </div>
        <div class="column role">
            <p class="role"><strong>Role:</strong>{{ role }}</p>
        </div>
        <div class="column actions">
            <button @click="editUser">Edit User</button>
            <button @click="deleteUser">Delete User</button>
        </div>
    </div>
</template>

<script>
import router from '@/router';

export default{
    props: {
        id: {
            type: Number,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true
        }
    },
    methods: {
        async editUser() {
            router.push({ name: 'Edit User', params: { id: this.id } });
        },
        async deleteUser() {
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
        }
    }
};
</script>

<style scoped>
.user {
  display: flex;
  flex-direction: row;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  padding: 15px;
  margin: 20px auto;
  width: 90%;
  max-width: 1000px;
  align-items: flex-start;
  gap: 20px;
}

.column {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.id {
  justify-content: center;
  align-items: center;
  width: 100px;
  text-align: center;
}
.name {
  justify-content: center;
  align-items: center;
  width: 300px;
  text-align: center;
}
.role {
  justify-content: center;
  align-items: center;
  width: 100px;
  text-align: center;
}

.actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

button {
  padding: 6px 10px;
  background: #444;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background: #666;
}
</style>