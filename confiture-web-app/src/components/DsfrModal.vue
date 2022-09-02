<script lang="ts">
let nextId = 1;
</script>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

const props = defineProps<{
  show?: boolean;
  ariaLabel: string;
}>();

defineEmits<{
  (e: "close"): void;
}>();

const uniqueId = nextId++;

const modal = ref<HTMLDialogElement>();

onMounted(() => {
  setTimeout(() => {
    if (props.show) {
      dsfr(modal.value).modal.disclose();
    }
  });
});

watch(
  () => props.show,
  (show) => {
    const modalIsCurrentlyOpen =
      modal.value?.classList.contains("fr-modal--opened");

    if (show === modalIsCurrentlyOpen) {
      return;
    }

    if (show) {
      dsfr(modal.value).modal.disclose();
    } else {
      dsfr(modal.value).modal.conceal();
    }
  }
);
</script>

<template>
  <Teleport to="body">
    <dialog
      :id="`fr-modal-${uniqueId}`"
      ref="modal"
      :aria-label="ariaLabel"
      role="dialog"
      class="fr-modal"
      v-on="{
        'dsfr.conceal': () => $emit('close'),
      }"
    >
      <div class="fr-container fr-container--fluid fr-container-md">
        <div class="fr-grid-row fr-grid-row--center">
          <div class="fr-col-12 fr-col-md-8">
            <div class="fr-modal__body">
              <div class="fr-modal__header">
                <button
                  class="fr-link--close fr-link"
                  title="Fermer la fenêtre modale"
                  aria-controls="fr-modal-1"
                >
                  Fermer
                </button>
              </div>

              <div class="fr-modal__content">
                <slot />
              </div>

              <div class="fr-modal__footer">
                <slot name="footer" />
                <!-- <ul
                  class="fr-btns-group fr-btns-group--right fr-btns-group--inline-lg fr-btns-group--icon-left"
                >
                  <li>
                    <button
                      class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-arrow-left-s-line"
                      :disabled="currentStep === 0"
                      @click="previousStep"
                    >
                      Précedent
                    </button>
                  </li>
                  <li>
                    <button
                      class="fr-btn fr-btn--icon-right fr-icon-arrow-right-s-line"
                      @click="nextStep"
                    >
                      {{ currentStep === 4 ? "Accéder au rapport" : "Suivant" }}
                    </button>
                  </li>
                </ul> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  </Teleport>
</template>
