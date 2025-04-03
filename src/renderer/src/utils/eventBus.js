import { ref } from 'vue'

const events = ref({})

export const emit = (eventName, data) => {
  if (events.value[eventName]) {
    events.value[eventName].forEach((callback) => callback(data))
  }
}

export const on = (eventName, callback) => {
  if (!events.value[eventName]) {
    events.value[eventName] = []
  }
  events.value[eventName].push(callback)
}

export const off = (eventName, callback) => {
  if (events.value[eventName]) {
    events.value[eventName] = events.value[eventName].filter(cb => cb !== callback)
  }
}
