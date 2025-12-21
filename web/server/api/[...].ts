export default defineEventHandler(async (event) => {
  const address = useRuntimeConfig(event).backendAddress
  const newPath = event.path.replace(/^\/api/, address)
  return await $fetch(newPath, {
    method: event.method,
    headers: event.headers,
  })
})
