<template>
  <div class="modal" v-if="isVisible">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>Create Event</h2>
      <div>
        <label for="eventType">Event Type</label>
        <select id="eventType" v-model="eventType">
          <option v-for="option in options" :key="option.id" :value="option.id">{{ option.text }}</option>
        </select>
      </div>
      <div>
        <label for="name">Name</label>
        <input id="name" v-model="name" type="text" />
      </div>
      <div>
        <label for="startDate">Start Date</label>
        <input id="startDate" v-model="startDate" type="date" />
      </div>
      <div>
        <label for="endDate">End Date</label>
        <input id="endDate" v-model="endDate" type="date" />
      </div>
      <button @click="createData()">Submit</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      eventType: '',
      name: '',
      startDate: '',
      endDate: '',
      options: [
        { text: 'Конференція', id: '4d115ae7-ef38-45b7-baf3-8fd9e080a596' },
        { text: 'Свято', id: 'd6ef1e8d-c49f-4231-91cb-c3363a943fd8' },
        { text: 'Навчання', id: '23585758-9bdc-4d54-8b98-670c6f1dda5f' }
      ],
      accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJQb3J0YWwvdXNlcm5hbWUiOiJaYWJsdWRhTXlrb2xhIiwiUG9ydGFsL3VzZXJpZCI6IjY4ZDFhMzM2LTI1NzUtNDYyNy05NDdmLWMxYjhmMGFlZjNhOSIsImp0aSI6IjcxODJiNjRjLWVlMDUtNDJiNi04Njg4LTlmODAwNzc2ZTNkMCIsIlBvcnRhbC90b2tlbnZlcnNpb24iOiIxIiwiUG9ydGFsL2NvbnRhY3RpZCI6ImJlNTcwNGFmLTU0MjgtNGM5YS1hMGI2LWQ1NGQ2MjFiMDU3MiIsIlBvcnRhbC9tb2RpZmllZG9uIjoiNjM4NTMxOTQ5Nzk0NjgzMjIwIiwiZXhwIjoxNzE4NDYyMTc5LCJpc3MiOiJMZWFybmluZyIsImF1ZCI6IkxlYXJuaW5nIGNsaWVudCJ9.Q6CX6SoP1xuzNe5qiuNeBO7cszBuH6ITbdbEniABABo"
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    async createData() {
      try {
        const response = await axios.post('https://learning.banzait.com/back/api/Event/Create', {
              name: this.name,
              startDate: this.startDate,
              endDate: this.endDate,
              categoryId: this.eventType
            },
            {
              headers: {
                Authorization: `Bearer ${this.accessToken}`
              }
            }
        );

        this.$emit('close');

      } catch (error) {
        console.error('Error fetching all matches:', error);
        throw error;
      }
    }
  }
};
</script>

<style>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #fefefe;
  padding: 20px;
  border: 1px solid #888;
  width: 300px;
  border-radius: 8px;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
