export default defineEventHandler(async (): Promise<{text: string | null}> => {
  const {staticToken, backendAddress} = useRuntimeConfig()
  const {data: announcement} = await $fetch<{
    data: {
      id: number
      text: string | null
    }
  }>(`${backendAddress}/items/announcement`, {
    headers: {
      Authorization: `Bearer ${staticToken}`,
    },
  })
  return {text: announcement.text}
})
