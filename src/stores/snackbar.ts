import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SnackbarOption, SnackbarPosition, SnackbarType, StackedSnackbar } from '../types/snackbar'

export const useSnackbarStore = defineStore('snackbar', () => {
  const isShowSnackbar = ref(false)
  const message = ref('')
  const type = ref<SnackbarType>('success')
  const position = ref<SnackbarPosition>('top-right')
  const duration = ref(3000)
  const snackbars = ref<StackedSnackbar[]>([])

  const showSnackbar = (option: SnackbarOption) => {
    const id = `${Date.now()}-${Math.random()}`
    const durationTime = option.duration ?? 3000
    const snackbarType = option.type ?? 'success'
    const snackbarPosition = option.position ?? 'top-right'

    const newSnackbar: StackedSnackbar = {
      id,
      message: option.message,
      type: snackbarType,
      position: snackbarPosition,
      duration: durationTime,
    }

    snackbars.value.unshift(newSnackbar)

    message.value = option.message
    type.value = snackbarType
    position.value = snackbarPosition
    duration.value = durationTime
    isShowSnackbar.value = true

    if (durationTime > 0) {
      setTimeout(() => {
        removeSnackbar(id)
      }, durationTime)
    }
  }

  const removeSnackbar = (id: string) => {
    snackbars.value = snackbars.value.filter((s) => s.id !== id)
    if (snackbars.value.length === 0)
      isShowSnackbar.value = false
  }

  const hideSnackbar = () => {
    snackbars.value = []
    isShowSnackbar.value = false
  }

  return {
    type,
    message,
    position,
    duration,
    isShowSnackbar,
    snackbars,
    showSnackbar,
    removeSnackbar,
    hideSnackbar,
  }
})
