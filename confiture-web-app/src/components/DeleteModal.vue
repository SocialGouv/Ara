<script setup lang="ts">
import { ref } from "vue";
import DsfrModal from "./DsfrModal.vue";

defineProps<{
  show: boolean;
}>();

defineEmits(["confirm", "close"]);
</script>

<template>
  <DsfrModal
    :show="show"
    aria-label="Vous allez supprimer l’audit"
    @close="$emit('close')"
  >
    <h1 class="fr-modal__title">
      <span class="fr-icon-warning-line fr-fi--lg" aria-hidden="true" />
      Vous allez supprimer l’audit
    </h1>
    <p>
      Toutes les informations saisies seront effacées. Cette action est
      irréversible. Souhaitez-vous supprimer l’audit ?
    </p>

    <template #footer>
      <ul
        class="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left"
      >
        <li>
          <button class="fr-btn danger-button" @click="$emit('confirm')">
            Oui, supprimer
          </button>
        </li>
        <li>
          <button class="fr-btn fr-btn--secondary" @click="$emit('close')">
            Non
          </button>
        </li>
      </ul>
    </template>
  </DsfrModal>
</template>

<style scoped>
.danger-button {
  background-color: var(--background-action-high-error);
}

.danger-button:hover {
  background-color: var(--background-action-high-error-hover);
}

.danger-button:focus {
  background-color: var(--background-action-high-error-active);
}
</style>
