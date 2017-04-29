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
          <div v-for="e in m.events" class="event" :style="{background: e.color}">
            <ul>
              <li v-for="(v, k) in e">
                <b>{{ k | cap }}</b>: {{ v }}
              </li>
            </ul>
          </div>
        </div>
        <div class="clear">

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
      fetch('https://calendar-api.now.sh/')
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
  h4 {
    color: #3d3d3d;
  }

  margin-bottom: 10px;

  float: left;
  border: 1px tomato solid;
  color: #fff;
  padding: 5px;
}

.clear {
  clear: left
}

/* OTHER STYLES */
.month {
  max-width: 100%;
  margin: 40px;

  display: block;

  h3 {
    display: block;
  }
}

</style>
