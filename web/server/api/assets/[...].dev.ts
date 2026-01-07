export default defineEventHandler(async (event) => {
  const {backendAddress} = useRuntimeConfig()
  const newPath = event.path.replace(/^\/api/, backendAddress)
  return await $fetch(newPath, {
    headers: {
      ...event.headers,
    },
    method: 'GET',
  })
})
