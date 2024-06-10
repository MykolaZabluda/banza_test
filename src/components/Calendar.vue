<template>
  <div class="calendar">
    <div class="calendar-header">
      <h2>{{ formattedDate }}</h2>
      <div class="form-group">
        <input
          id="startDate"
          v-model="formattedCurrentMonth"
          @change="monthChanged"
          type="date"
        />
      </div>
      <button class="calendar-header-create" @click="showModal = true">Create</button>
      <div class="filters-container">
        <v-chip
          v-for="filter in activeFilters"
          :key="filter"
          class="filters"
          color="primary"
          @click="chipsOnCLick(filter.id)"
        >
          {{ filter.name }}
        </v-chip>
      </div>
    </div>
    <div class="calendar-table">
      <div class="cell-for-day" v-for="day in daysForCalendar" :key="day">
        {{ day }}
      </div>
      <div class="cell" v-for="day in getDays" :key="day.dayNumber" :class="{ 'highlight': isToday(day.dayNumber) }">
        <div>{{ day.dayNumber }}</div>
        <div class="cell-events" v-for="(value, name) in eventsByDay" :key="name">
          <div v-for="dayEvent in eventsByDay[name]" :key="dayEvent.id">
            <div class="event" v-if="name === day.date" @click="openEditPopup(dayEvent.id)">
              {{ dayEvent.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <AddEventModal v-if="showModal" :isVisible="showModal" @close="updateCalendar()" />
</template>

<script>
import axios from "axios";
import AddEventModal from "@/components/AddEventModal.vue";
import { useDate } from 'vuetify'

export default {
  name: 'CalendarView',
  components: {
    AddEventModal,
  },
  data() {
    return {
      formattedDate: "",
      currentDate: new Date(),
      showModal: false,
      arrData: [],
      daysForCalendar: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJQb3J0YWwvdXNlcm5hbWUiOiJaYWJsdWRhTXlrb2xhIiwiUG9ydGFsL3VzZXJpZCI6IjY4ZDFhMzM2LTI1NzUtNDYyNy05NDdmLWMxYjhmMGFlZjNhOSIsImp0aSI6IjcxODJiNjRjLWVlMDUtNDJiNi04Njg4LTlmODAwNzc2ZTNkMCIsIlBvcnRhbC90b2tlbnZlcnNpb24iOiIxIiwiUG9ydGFsL2NvbnRhY3RpZCI6ImJlNTcwNGFmLTU0MjgtNGM5YS1hMGI2LWQ1NGQ2MjFiMDU3MiIsIlBvcnRhbC9tb2RpZmllZG9uIjoiNjM4NTMxOTQ5Nzk0NjgzMjIwIiwiZXhwIjoxNzE4NDYyMTc5LCJpc3MiOiJMZWFybmluZyIsImF1ZCI6IkxlYXJuaW5nIGNsaWVudCJ9.Q6CX6SoP1xuzNe5qiuNeBO7cszBuH6ITbdbEniABABo",
      eventsByDay: {},
      activeFilters: [
        { id: "4d115ae7-ef38-45b7-baf3-8fd9e080a596", name: "Конференція" },
        { id: "d6ef1e8d-c49f-4231-91cb-c3363a943fd8", name: "Свято" },
        { id: "23585758-9bdc-4d54-8b98-670c6f1dda5f", name: "Навчання" }
      ],
      newFilterName: '',
      useDate: useDate(),
      selectedCategoryId: '',
    };
  },
  computed: {
    formattedCurrentMonth() {
      const year = this.currentDate.getFullYear();
      const month = (this.currentDate.getMonth() + 1).toString().padStart(2, '0');
      return `${year}-${month}`;
    },
    getDays() {
      const firstDayOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
      const offset = firstDayOfMonth.getDay();
      const daysInMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0).getDate();
      const daysArray = [];

      for (let i = 0; i < offset; i++) {
        const offsetDay = { dayNumber: null, date: null };
        daysArray.push(offsetDay);
      }
      for (let i = 1; i <= daysInMonth; i++) {
        const day = this.setCalendarDay(i);
        daysArray.push(day);
      }

      return daysArray;
    },
  },
  methods: {
    openEditPopup(eventId) {
      // logic to open the edit popup
    },
    updateCalendar() {
      this.getAll();
      this.showModal = false;
    },
    chipsOnCLick(categoryId) {
      categoryId === this.selectedCategoryId
          ? this.getAll()
          : this.getAll(categoryId);
    },
    setCalendarDay(dayIndex) {
      const dateValue = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), dayIndex);
      return { dayNumber: dayIndex, date: this.useDate.format(dateValue, 'keyboardDate') };
    },
    isToday(day) {
      const today = new Date();
      return (
          day === today.getDate() &&
          this.currentDate.getMonth() === today.getMonth() &&
          this.currentDate.getFullYear() === today.getFullYear()
      );
    },
    monthChanged(event) {
      const [year, month] = event.target.value.split('-');
      this.currentDate = new Date(year, month - 1);
    },
    setEventDate(eventItem) {
      const eventStartDate = new Date(eventItem.startDate);
      const dateValue = new Date(
          this.useDate.getYear(new Date(eventStartDate)),
          this.useDate.getMonth(new Date(eventStartDate)),
          this.useDate.getDate(new Date(eventStartDate))
      );
      return this.useDate.format(dateValue, 'keyboardDate');
    },
    setCalendarEvents(events) {
      events.forEach(item => {
        const eventDates = this.getEventDates(item);
        eventDates.forEach(eventDate => {
          if (!this.eventsByDay[eventDate]) {
            this.eventsByDay[eventDate] = [];
          }
          this.eventsByDay[eventDate].push(item);
        });
      });

      return events;
    },
    setGetCalendarParams(categoryId) {
      this.selectedCategoryId = categoryId;
      return categoryId && categoryId.length ? `?categoryId=${categoryId}` : '';
    },
    async getAll(categoryId = '') {
      try {
        const params = this.setGetCalendarParams(categoryId);
        const response = await axios.post(`${process.env.VUE_APP_ENV_VARIABLE}All${params}`, {},
            {
              headers: {
                Authorization: `Bearer ${this.accessToken}`
              }
            }
        );

        this.eventsByDay = {};
        this.arrData = this.setCalendarEvents(response.data);
        console.log(this.eventsByDay);
        console.log(this.arrData);
      } catch (error) {
        console.error('Error fetching all matches:', error);
        throw error;
      }
    },
    getEventDates(eventItem) {
      const start = new Date(eventItem.startDate);
      const end = new Date(eventItem.endDate);
      const dates = [];
      let currentDate = new Date(start);

      while (currentDate <= end) {
        dates.push(this.useDate.format(currentDate, 'keyboardDate'));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return dates;
    },
  },
  created() {
    const date = useDate();
    this.formattedDate = date.format('today', 'shortDate');
  },
  mounted() {
    this.getAll();
  },
};
</script>

<style scoped lang="scss">
.calendar {
  display: flex;
  flex-direction: column;

  &-date-picker {
    margin: 0 10px;
    padding: 5px;
    font-size: 16px;
  }

  &-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
    background-color: #f9f9f9;
    border-bottom: 1px solid #ddd;

    h2 {
      margin: 0;
      font-size: 24px;
      font-weight: bold;
      color: #333;
    }

    .form-group {
      margin: 0 10px;

      input {
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 14px;

        &:focus {
          border-color: #5b9bd5;
          outline: none;
        }
      }
    }

    &-create {
      padding: 10px 20px;
      font-size: 14px;
      color: #fff;
      background-color: #5b9bd5;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background-color: #4a8bc2;
      }
    }

    .filters-container {
      display: flex;
      gap: 10px;
    }

    .filters {
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 5px 10px;
      border-radius: 4px;
      background-color: #007bff;
      color: #fff;
      transition: background-color 0.3s;

      &:hover {
        background-color: #0056b3;
      }
    }
  }

  &-table {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    padding: 0 5px;

    .event {
      background: #5b9bd5;
      border-radius: 15px;
      color: #fff;
      //margin: 5%;
      margin: 2px 5px;
    }
  }

  .cell {
    border: 1px solid #ccc;
    //padding: 5px;
    width: 100%;
    height: 100px;

    &-events {
      max-height: 75%;
      overflow-y: auto;
    }
  }

  .highlight {
    background-color: lightblue;
  }
}
</style>
