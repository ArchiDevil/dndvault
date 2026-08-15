<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'reka-ui'
import VaultButton from './VaultButton.vue'

const open = ref(false)
const comment = ref('')
const quote = ref('')
const contact = ref('')
// Honeypot: invisible for humans, bots tend to fill every input
const website = ref('')

type FormState = 'idle' | 'sending' | 'sent' | 'error'
const state = ref<FormState>('idle')
const errorMessage = ref<string | null>(null)

async function submit() {
  if (state.value === 'sending') return
  errorMessage.value = null

  const trimmedComment = comment.value.trim()
  if (trimmedComment.length < 10) {
    errorMessage.value = 'Опишите проблему подробнее (минимум 10 символов)'
    return
  }

  state.value = 'sending'
  try {
    await $fetch('/api/reports', {
      method: 'POST',
      body: {
        page_url: window.location.pathname + window.location.search,
        comment: trimmedComment,
        quote: quote.value.trim(),
        contact: contact.value.trim(),
        website: website.value,
      },
    })
    state.value = 'sent'
  } catch {
    state.value = 'error'
    errorMessage.value = 'Не удалось отправить. Попробуйте позже.'
  }
}

function handleOpenChange(value: boolean) {
  open.value = value
  if (!value) {
    // Reset for the next visit, keep the text if it failed to send
    if (state.value === 'sent') {
      comment.value = ''
      quote.value = ''
      contact.value = ''
    }
    state.value = 'idle'
    errorMessage.value = null
  }
}

const inputClass =
  'w-full rounded border-zinc-400 border bg-white px-2 py-1 text-zinc-800 outline-none focus:border-zinc-600'
</script>

<template>
  <DialogRoot
    :open="open"
    @update:open="handleOpenChange">
    <DialogTrigger as-child>
      <VaultButton
        text="Сообщить об ошибке"
        icon="solar:danger-triangle-linear"
        class="mt-6" />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-40 bg-zinc-900/50 print:hidden" />
      <DialogContent
        class="fixed left-1/2 top-1/2 z-50 w-[min(30rem,calc(100vw-2rem))]
               -translate-x-1/2 -translate-y-1/2 rounded border-zinc-400
               border bg-zinc-100 p-4 shadow-xl print:hidden">
        <div
          v-if="state === 'sent'"
          class="flex flex-col items-start gap-3">
          <DialogTitle class="text-lg font-semibold text-zinc-800">
            Спасибо!
          </DialogTitle>
          <DialogDescription class="text-zinc-700">
            Сообщение отправлено, мы всё проверим и поправим, если ошибка
            подтвердится.
          </DialogDescription>
          <DialogClose as-child>
            <VaultButton text="Закрыть" />
          </DialogClose>
        </div>

        <form
          v-else
          class="flex flex-col gap-3"
          @submit.prevent="submit">
          <DialogTitle class="text-lg font-semibold text-zinc-800">
            Сообщить об ошибке
          </DialogTitle>
          <DialogDescription class="text-sm text-zinc-700">
            Заметили опечатку или ошибку перевода? Опишите, что не так — мы
            исправим.
          </DialogDescription>

          <input
            v-model="website"
            name="website"
            type="text"
            tabindex="-1"
            autocomplete="off"
            aria-hidden="true"
            class="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0" />

          <label class="flex flex-col gap-1 text-sm text-zinc-800">
            Что не так?
            <textarea
              v-model="comment"
              required
              minlength="10"
              maxlength="2000"
              rows="4"
              class="resize-y"
              :class="inputClass"
              placeholder="Например: в описании заклинания опечатка в слове «дистанция»" />
          </label>

          <label class="flex flex-col gap-1 text-sm text-zinc-800">
            <p>
              Фрагмент текста <span class="text-zinc-500">(необязательно)</span>
            </p>
            <textarea
              v-model="quote"
              maxlength="500"
              rows="2"
              class="resize-y"
              :class="inputClass"
              placeholder="Скопируйте кусок текста с ошибкой" />
          </label>

          <label class="flex flex-col gap-1 text-sm text-zinc-800">
            <p>
              Контакт для ответа
              <span class="text-zinc-500">(необязательно)</span>
            </p>
            <input
              v-model="contact"
              maxlength="100"
              :class="inputClass"
              placeholder="Для связи с вами (Telegram, e-mail, другой)" />
          </label>

          <p
            v-if="errorMessage"
            class="text-sm text-red-700">
            {{ errorMessage }}
          </p>

          <div class="flex justify-end gap-2">
            <DialogClose as-child>
              <VaultButton text="Отмена" />
            </DialogClose>
            <VaultButton
              :text="state === 'sending' ? 'Отправка…' : 'Отправить'"
              :icon="state === 'sending' ? undefined : 'solar:card-send-linear'"
              :disabled="state === 'sending'" />
          </div>
        </form>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
