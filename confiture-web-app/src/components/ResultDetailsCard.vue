<script lang="ts" setup>
defineProps<{
  title: string;
  accordionTitle: string;
}>();
</script>

<template>
  <div class="card">
    <div class="fr-py-5v fr-px-2w card-header">
      <h3 class="fr-h4 fr-m-0">{{ title }}</h3>
    </div>

    <div class="fr-py-5v fr-px-4v content">
      <slot />
    </div>
    <div class="fr-accordion">
      <span class="fr-accordion__title">
        <button
          class="fr-accordion__btn"
          aria-expanded="false"
          :aria-controls="`tests-method-pouet`"
        >
          {{ accordionTitle }}
        </button>
      </span>
      <div
        :id="`tests-method-pouet`"
        class="fr-collapse criterium-test-methodology"
      >
        <slot name="accordion" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid var(--border-default-grey);
}

.card-header {
  border-bottom: 1px solid var(--border-default-grey);
}
</style>
