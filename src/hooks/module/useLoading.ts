import { ref } from 'vue'

function useLoading(initValue = false) {
  const loading = ref(initValue)

  const setLoading = (value: boolean) => {
    loading.value = value
  }

  const toggle = () => {
    loading.value = !loading.value
  }

  return {
    loading,
    setLoading,
    toggle,
  }
}

export default useLoading
