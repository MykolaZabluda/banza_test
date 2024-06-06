<template>
  <div class="calendar">
    <button @click="showModal = true">Create</button>
    <AddEventModal v-if="showModal" :isVisible="showModal" @close="showModal = false" />
    <div class="calendar-header">
      <button class="calendar-header-button calendar-header-button-prev" @click="previousMonth"></button>
      <h2>{{ currentMonth }}</h2>
      <button class="calendar-header-button calendar-header-button-next" @click="nextMonth"></button>
    </div>
    <div class="calendar-table">
      <div class="cell-for-day" v-for="days in daysForCalendar">
        {{ days }}
      </div>
      <div class="cell" v-for="day in days" :class="{ 'highlight': isToday(day) }">
        {{ day }}
      </div>
    </div>
  </div>
  {{ arrData }}
</template>

<script>
import axios from "axios";
import AddEventModal from "@/components/AddEventModal.vue";

export default {
  name: 'CalendarView',
  components: {
    AddEventModal,
  },
  data() {
    return {
      currentDate: new Date(),
      showModal: false,
      arrData: [],
      daysForCalendar: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJQb3J0YWwvdXNlcm5hbWUiOiJaYWJsdWRhTXlrb2xhIiwiUG9ydGFsL3VzZXJpZCI6IjY4ZDFhMzM2LTI1NzUtNDYyNy05NDdmLWMxYjhmMGFlZjNhOSIsImp0aSI6IjcxODJiNjRjLWVlMDUtNDJiNi04Njg4LTlmODAwNzc2ZTNkMCIsIlBvcnRhbC90b2tlbnZlcnNpb24iOiIxIiwiUG9ydGFsL2NvbnRhY3RpZCI6ImJlNTcwNGFmLTU0MjgtNGM5YS1hMGI2LWQ1NGQ2MjFiMDU3MiIsIlBvcnRhbC9tb2RpZmllZG9uIjoiNjM4NTMxOTQ5Nzk0NjgzMjIwIiwiZXhwIjoxNzE4NDYyMTc5LCJpc3MiOiJMZWFybmluZyIsImF1ZCI6IkxlYXJuaW5nIGNsaWVudCJ9.Q6CX6SoP1xuzNe5qiuNeBO7cszBuH6ITbdbEniABABo"
    };
  },
  computed: {
    currentMonth() {
      const options = { year: 'numeric', month: 'long' };
      return this.currentDate.toLocaleDateString('en-US', options);
    },
    days() {
      const firstDayOfMonth = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth(), 1
      );
      const offset = firstDayOfMonth.getDay();
      const daysInMonth = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() + 1, 0
      ).getDate();
      const daysArray = [];
      for (let i = 0; i < offset; i++) {
        daysArray.push('');
      }
      for (let i = 1; i <= daysInMonth; i++) {
        daysArray.push(i);
      }
      return daysArray;
    },
  },
  methods: {
    isToday(day) {
      const today = new Date();
      return (
        day === today.getDate() &&
        this.currentDate.getMonth() === today.getMonth() &&
        this.currentDate.getFullYear() === today.getFullYear()
      );
    },
    previousMonth() {
      const newDate = new Date(this.currentDate);
      newDate.setMonth(newDate.getMonth() - 1);
      this.currentDate = newDate;
    },
    nextMonth() {
      const newDate = new Date(this.currentDate);
      newDate.setMonth(newDate.getMonth() + 1);
      this.currentDate = newDate;
    },
    async getAll() {
      try {
        const response = await axios.get('https://learning.banzait.com/back/api/Event/All', {
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        });

        this.arrData = response.data;
      } catch (error) {
        console.error('Error fetching all matches:', error);
        throw error;
      }
    },
  },
  created() {
    this.getAll();
  },
};
</script>

<style scoped lang="scss">
.calendar {
  display: flex;
  flex-direction: column;
  //padding: 4% 0;

  &-header {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    padding-bottom: 15px;

    &-button {
      padding: 10px;
      width: 15px;
      border-radius: 25px;
      height: 15px;
      align-items: center;
      display: flex;
      justify-content: center;

      &-prev::before {
        content: "-";
      }

      &-next::before {
        content: "+";
      }
    }
  }

  &-table {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    padding: 0 5px;
  }

  .cell {
    border: 1px solid #ccc;
    //padding: 5px;
    width: 100%;
    height: 100px;
  }

  .highlight {
    background-color: lightblue;
  }
}
</style>
