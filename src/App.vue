<template>
  <div>
    <p v-if="isLoading">
      Buscando eventos...
    </p>
    <div v-else>
      <div v-for="m in months" class="month">
        <h3>{{ m.title | cap }}</h3>
        <div class="day" v-for="d in m.days">
          <h4>{{ d.date }} </h4>
          <div v-for="e in m.events" class="event">
            <ul>
              <li v-for="(v, k) in e">
                <b>{{ k | cap }}</b>: {{ v }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  /* globals fetch */

  import moment from 'moment'

  export default {
    name: 'app',

    data () {
      return {
        months: [],
        isLoading: true
      }
    },

    created () {
      fetch('http://calendar-api.now.sh/')
        .then(response => response.json())
        .then(calendars => {
          this.isLoading = false

          this.formatCalendars(calendars)
        })
    },

    methods: {
      formatCalendars (calendars) {
        calendars.forEach(c => {
          const monthNumber = parseInt(moment().utc().month(c.when.month).format('MM')) - 1

          const month = {
            title: `${c.when.month} - ${c.when.year}`,
            first: moment({ day: 1, month: monthNumber, year: c.year }).utc(),
            events: c.events,
            days: []
          }

          for (let i = 1; i <= month.first.daysInMonth(); i++) {
            const day = {
              date: moment({ day: i, month: monthNumber, year: c.year }).utc(),
              events: []
            }

            month.events.forEach(e => {
              if (e.date === day.date) {
                day.events.push(e)
              }
            })

            month.days.push(day)
          }

          this.months.push(month)
        })
      }
    }
  }
</script>

<style lang="scss">
.day {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0;
}

.week:first-of-type .day:first-of-type {
  margin-left: 42.85714%;
}

.week:last-of-type .day:last-of-type {
  margin-right: 14.285%;
}

/* OTHER STYLES */
.month {
  display: flex;
  max-width: 560px;
  margin: 20px auto;
}

.week {
  height: 80px;
}

.day {
  color: #F98909;
  padding: 5px;
  background-color: transparentize(white, 0.30);
  box-shadow:
    -1px -1px #F9A440,
    inset -1px -1px 0 0 #F9A440;
}
</style>
