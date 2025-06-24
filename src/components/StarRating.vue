<template>
  <div class="flex items-center select-none relative">
    <template v-for="starIndex in maxStars" :key="starIndex">
      <span class="relative inline-flex cursor-pointer" style="width: 24px; height: 24px">
        <!-- Metà sinistra -->
        <span
          class="absolute left-0 w-1/2 h-full"
          @click="selectRating(starIndex - 0.5)"
          :class="editable ? 'hover:text-yellow-300' : ''"
          role="button"
          aria-label="Mezza stella sinistra"
        ></span>
        <!-- Metà destra -->
        <span
          class="absolute right-0 top-0 w-1/2 h-full"
          @click="selectRating(starIndex)"
          :class="editable ? 'hover:text-yellow-300' : ''"
          role="button"
          aria-label="Metà stella destra"
        ></span>

        <!-- Visualizzazione stella -->
        <span class="text-2xl pointer-events-none">
          <template v-if="currentRating >= starIndex">
            <span class="text-yellow-400">&#9733;</span>
          </template>
          <template v-else-if="currentRating >= starIndex - 0.5">
            <span
              class="text-yellow-400 absolute overflow-hidden"
              :style="{ width: '80%', clipPath: 'inset(0 50% 0 0)' }"
            >
              &#9733;
            </span>
            <span class="text-gray-500">&#9733;</span>
          </template>
          <template v-else>
            <span class="text-gray-500">&#9733;</span>
          </template>
        </span>
      </span>
    </template>

    <!-- Bottone svuota -->
    <button
      v-if="editable"
      @click="selectRating(0)"
      class="absolute right-[-20px] top-3 ml-2 text-gray-300"
      type="button"
    >
      <Icon icon="mdi:restore" />
    </button>

    <span v-if="!editable" class="ml-2 text-gray-300 text-sm">
      ({{ currentRating }}/{{ maxStars }})
    </span>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  rating: {
    type: Number,
    default: 0,
  },
  editable: {
    type: Boolean,
    default: false,
  },
  maxStars: {
    type: Number,
    default: 5,
  },
})

const emit = defineEmits(['update:rating'])
const currentRating = ref(props.rating)

watch(
  () => props.rating,
  newVal => {
    currentRating.value = newVal
  }
)

const selectRating = val => {
  if (props.editable) {
    const newRating = Math.min(props.maxStars, Math.max(0, val))
    currentRating.value = newRating
    emit('update:rating', newRating)
  }
}
</script>
