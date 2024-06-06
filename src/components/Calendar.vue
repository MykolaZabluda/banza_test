<template>
  <div class="calendar">
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
</template>

<script>
// import Vue from "vue";

export default {
  name: 'CalendarView',
  data() {
    return {
      currentDate: new Date(),
      daysForCalendar: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
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
