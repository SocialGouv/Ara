<script lang="ts" setup>
import { computed, nextTick, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import PageMeta from "../../components/PageMeta";
import TestEnvironmentSelection from "../../components/TestEnvironmentSelection/TestEnvironmentSelection.vue";
import { useDevMode } from "../../composables/useDevMode";
import { useNotifications } from "../../composables/useNotifications";
import { useWrappedFetch } from "../../composables/useWrappedFetch";
import {
  AssistiveTechnology,
  Browsers,
  OperatingSystem,
  Platform,
} from "../../enums";
import { useAuditStore } from "../../store";
import { AuditEnvironment, UpdateAuditRequestData } from "../../types";

const route = useRoute();
const uniqueId = route.params.uniqueId as string;
const auditStore = useAuditStore();
useWrappedFetch(() => auditStore.fetchAuditIfNeeded(uniqueId));

// Technologies

const tempTechnologies = ref("");
const validatedTechnologies = ref<string[]>([]);
const validatedTechnologiesRefs = ref<HTMLButtonElement[]>([]);
const validateTechnologiesRef = ref<HTMLButtonElement>();

/**
 * Create technologies tags.
 */
async function validateTechnologies() {
  const tech = tempTechnologies.value.split(",").filter(Boolean);
  tech.forEach((t) => {
    validatedTechnologies.value.push(t.trim());
  });

  tempTechnologies.value = "";
}

/**
 * Remove technology tag and focus next one or validate button.
 */
async function removeTechnology(index: number) {
  validatedTechnologies.value = validatedTechnologies.value.filter((_, i) => {
    return i !== index;
  });

  await nextTick();

  const nextTechnologyButton: HTMLButtonElement =
    validatedTechnologiesRefs.value[index];
  if (nextTechnologyButton) {
    nextTechnologyButton.focus();
  } else {
    validateTechnologiesRef.value?.focus();
  }
}

// Tools

const tempTools = ref("");
const validatedTools = ref<string[]>([]);
const validatedToolsRefs = ref<HTMLButtonElement[]>([]);
const validateToolsRef = ref<HTMLButtonElement>();

const defaultTools = ref<string[]>([]);
const tools = computed(() => {
  return [...defaultTools.value, ...validatedTools.value].filter(Boolean);
});

const availableTools = [
  "Web Developer Toolbar",
  "Colour Contrast Analyser",
  "HeadingsMap",
  "ArcToolkit",
  "WCAG Contrast checker",
  "Inspecteur de composants",
  "Assistant RGAA",
  "Validateur HTML du W3C",
];

/**
 * Create tools tags.
 */
async function validateTools() {
  const tech = tempTools.value.split(",").filter(Boolean);
  tech.forEach((t) => {
    validatedTools.value.push(t.trim());
  });

  tempTools.value = "";
}

/**
 * Remove tool tag and focus next one or validate button.
 */
async function removeTool(index: number) {
  validatedTools.value = validatedTools.value.filter((_, i) => {
    return i !== index;
  });

  await nextTick();

  const nextToolButton: HTMLButtonElement = validatedToolsRefs.value[index];
  if (nextToolButton) {
    nextToolButton.focus();
  } else {
    validateToolsRef.value?.focus();
  }
}

const environments = ref<Omit<AuditEnvironment, "id">[]>([]);

// Other data

const auditInitiator = ref("");
const procedureUrl = ref("");
const contactName = ref("");
const contactEmail = ref("");
const contactFormUrl = ref("");
const notCompliantContent = ref("");
const derogatedContent = ref("");
const notInScopeContent = ref("");

watch(
  () => auditStore.data,
  (audit) => {
    if (!audit) {
      return;
    }
    auditInitiator.value = audit.initiator ?? "";
    procedureUrl.value = audit.procedureUrl ?? "";
    contactName.value = audit.contactName ?? "";
    contactEmail.value = audit.contactEmail ?? "";
    contactFormUrl.value = audit.contactFormUrl ?? "";

    validatedTechnologies.value = audit.technologies.length
      ? audit.technologies
      : [];

    defaultTools.value = audit.tools.length
      ? // Cannot use filtered audit.tools because the checkbox array v-model binding wont work with different object refs
        availableTools.filter((tool) => audit.tools.includes(tool))
      : [];
    validatedTools.value = audit.tools.length
      ? audit.tools.filter((tool) => !availableTools.includes(tool))
      : [];

    environments.value = audit.environments ?? [];

    notCompliantContent.value = audit.notCompliantContent ?? "";
    derogatedContent.value = audit.derogatedContent ?? "";
    notInScopeContent.value = audit.notInScopeContent ?? "";
  },
  {
    immediate: true,
  }
);

const notify = useNotifications();
const router = useRouter();

function handleSubmit() {
  const data: UpdateAuditRequestData = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ...auditStore.data!,

    initiator: auditInitiator.value,
    procedureUrl: procedureUrl.value,

    contactEmail: contactEmail.value,
    contactFormUrl: contactFormUrl.value,
    contactName: contactName.value,

    technologies: validatedTechnologies.value,
    environments: environments.value,
    tools: tools.value,

    // TODO: plug not accessible content
    notCompliantContent: notCompliantContent.value,
    derogatedContent: derogatedContent.value,
    notInScopeContent: notInScopeContent.value,
  };
  return auditStore
    .updateAudit(uniqueId, data)
    .then(() => {
      router.push({
        name: "edit-audit-step-four",
        params: { uniqueId },
      });
    })
    .catch((err) => {
      notify(
        "error",
        "Une erreur est survenue",
        "Un problème empêche la sauvegarde de vos données. Contactez nous à l'adresse contact@design.numerique.gouv.fr si le problème persiste."
      );
      throw err;
    });
}

/**
 * Dev function to avoid filling all fields manually
 */
function DEBUG_fillFields() {
  auditInitiator.value = "Mairie de Tours";
  procedureUrl.value = "https://example.com";
  contactEmail.value = "philipinne-jolivet@example.com";
  contactFormUrl.value = "https://example.com/contact";

  validatedTechnologies.value = ["HTML", "CSS"];

  defaultTools.value = [availableTools[2]];
  validatedTools.value = ["Firefox Devtools", "AXE Webextension"];

  environments.value = [
    {
      platform: Platform.DESKTOP,
      operatingSystem: OperatingSystem.WINDOWS,
      operatingSystemVersion: "11",
      assistiveTechnology: AssistiveTechnology.NVDA,
      assistiveTechnologyVersion: "",
      browser: Browsers.FIREFOX,
      browserVersion: "104",
    },
    {
      platform: Platform.DESKTOP,
      operatingSystem: OperatingSystem.MAC_OS,
      operatingSystemVersion: "12.5",
      assistiveTechnology: AssistiveTechnology.VOICE_OVER,
      assistiveTechnologyVersion: "",
      browser: Browsers.SAFARI,
      browserVersion: "15.6",
    },
  ];

  notCompliantContent.value =
    "Sit aliquip velit adipisicing esse cupidatat. Dolor nisi do Lorem laboris cillum anim adipisicing reprehenderit laboris id ullamco. Cillum aute do consectetur et exercitation consequat exercitation sunt sunt id dolore aliquip. Dolor cillum anim do id ipsum occaecat quis voluptate. Commodo adipisicing sit proident consequat ex incididunt. Minim sit esse ad id do pariatur in occaecat proident eiusmod velit.";
  notInScopeContent.value =
    "Non officia voluptate id magna culpa consectetur ex officia quis magna quis sint.";
  derogatedContent.value =
    "Nostrud duis ut sint et et. Consequat fugiat sunt est elit sunt.";
}

const isDevMode = useDevMode();
</script>

<template>
  <!-- TODO: update meta -->
  <PageMeta
    title="Paramètres de l’audit"
    description="Saisissez le type d'audit que vous souhaitez réaliser et l'ensemble des paramètres de votre futur audit."
  />

  <form v-if="auditStore.data" @submit.prevent="handleSubmit">
    <div class="narrow-content">
      <h1 ref="stepTitleRef" class="fr-mb-3v">
        📄 Déclaration d’accessibilité
      </h1>
      <p class="fr-text--sm mandatory-notice">
        Sauf mention contraire, tous les champs sont obligatoires.
      </p>

      <h2 class="fr-h4">Informations générales</h2>

      <div class="fr-input-group">
        <label class="fr-label" for="initiator">
          Entité qui demande l’audit
          <span class="fr-hint-text">
            Exemple : Ministère de l’intérieur, Mairie de Toulouse, etc
          </span>
        </label>
        <input
          id="initiator"
          v-model="auditInitiator"
          class="fr-input"
          required
        />
      </div>

      <div class="fr-input-group">
        <label class="fr-label" for="procedure-url">
          URL de la page d’accueil du site à auditer
          <span class="fr-hint-text">
            Saisissez une url valide, commençant par
            <code>https://</code>
          </span>
        </label>
        <input
          id="procedure-url"
          v-model="procedureUrl"
          class="fr-input"
          type="url"
          required
        />
      </div>

      <fieldset class="fr-fieldset fr-mt-6w fr-mb-6w">
        <legend>
          <h2 class="fr-h4 fr-mb-2w">Retour d’information et contact</h2>
        </legend>

        <p>
          Ces informations permettent aux usagers qui rencontrent des
          difficultés pour accéder à du contenu ou à un service d’être orienté
          vers une solution adaptée.
        </p>

        <div class="fr-input-group">
          <label class="fr-label" for="procedure-manager-name">
            Nom et prénom du contact (optionnel)
          </label>
          <input
            id="procedure-manager-name"
            v-model="contactName"
            class="fr-input"
          />
        </div>

        <div class="fr-input-group">
          <label class="fr-label" for="procedure-manager-email">
            Adresse e-mail
            <span class="fr-hint-text">
              Exemple : contact@ministere.gouv.fr
            </span>
          </label>
          <input
            id="procedure-manager-email"
            v-model="contactEmail"
            class="fr-input"
            type="email"
            required
          />
        </div>

        <div class="fr-input-group">
          <label class="fr-label" for="procedure-manager-form-url">
            URL vers formulaire de contact
            <span class="fr-hint-text">
              Saisissez une URL valide, commençant par <code>http://</code> ou
              <code>https://</code>
            </span>
          </label>
          <input
            id="procedure-manager-form-url"
            v-model="contactFormUrl"
            class="fr-input"
            type="url"
            required
            placeholder="https://"
          />
        </div>
      </fieldset>

      <h2 class="fr-h4">Technologies utilisées sur le site</h2>

      <div class="fr-input-group fr-mb-2w">
        <label class="fr-label" for="temp-technologies">
          Ajouter des technologies
          <span class="fr-hint-text">
            Insérez une virgule pour séparer les technologies. Appuyez sur
            ENTRÉE ou cliquez sur “Valider les technologies” pour les valider.
            Exemple de technologies : HTML, CSS, Javascript, etc.
          </span>
        </label>
        <input
          id="temp-technologies"
          v-model="tempTechnologies"
          class="fr-input"
          :required="!validatedTechnologies.length"
          @keydown.enter.prevent="validateTechnologies"
        />
      </div>

      <ul class="fr-tags-group">
        <li v-for="(techno, i) in validatedTechnologies" :key="i">
          <button
            ref="validatedTechnologiesRefs"
            class="fr-tag fr-tag--dismiss"
            type="button"
            :aria-label="`Retirer ${techno}`"
            @click="removeTechnology(i)"
          >
            {{ techno }}
          </button>
        </li>
      </ul>

      <button
        ref="validateTechnologiesRef"
        class="fr-btn fr-btn--tertiary-no-outline fr-mb-6w"
        type="button"
        @click="validateTechnologies"
      >
        Valider les technologies
      </button>

      <!-- <div class="narrow-content"> -->
      <div class="fr-form-group">
        <fieldset class="fr-fieldset">
          <legend class="fr-fieldset__legend fr-text--regular">
            <h2 class="fr-h4 fr-mb-0">
              Outils d’assistance utilisés pour vérifier l’accessibilité
            </h2>
          </legend>
          <div class="fr-fieldset__content">
            <div
              v-for="(tool, i) in availableTools"
              :key="i"
              class="fr-checkbox-group"
            >
              <input
                :id="`tool-${i}`"
                v-model="defaultTools"
                type="checkbox"
                :value="tool"
              />
              <label class="fr-label" :for="`tool-${i}`">
                {{ tool }}
              </label>
            </div>
          </div>
        </fieldset>
      </div>

      <div class="fr-input-group fr-mb-2w">
        <label class="fr-label" for="temp-tools">
          Ajouter des outils d’assistance
          <span class="fr-hint-text">
            Insérez une virgule pour séparer les outils d’assistance. Appuyez
            sur ENTRÉE ou cliquez sur “Valider les outils” pour les valider.
          </span>
        </label>
        <input
          id="temp-tools"
          v-model="tempTools"
          class="fr-input"
          :required="!validatedTools.length"
          @keydown.enter.prevent="validateTools"
        />
      </div>

      <ul class="fr-tags-group">
        <li v-for="(tool, i) in validatedTools" :key="i">
          <button
            ref="validatedToolsRefs"
            class="fr-tag fr-tag--dismiss"
            type="button"
            :aria-label="`Retirer ${tool}`"
            @click="removeTool(i)"
          >
            {{ tool }}
          </button>
        </li>
      </ul>

      <button
        ref="validateToolsRef"
        class="fr-btn fr-btn--tertiary-no-outline fr-mb-6w"
        type="button"
        @click="validateTools"
      >
        Valider les outils
      </button>
    </div>

    <TestEnvironmentSelection v-model="environments" />

    <div class="narrow-content">
      <h2 class="fr-h4">Dérogations</h2>
      <p>
        Ces informations doivent faire l’objet d’une discussion entre l’auditeur
        et le responsable du site audité. C’est le responsable du site audité
        qui accepte de prendre le risque juridique de mentionner des contenus
        dérogés. Si aucun contenu n’est à déroger, laissez les deux champs
        vides.
      </p>

      <div class="fr-input-group">
        <label class="fr-label" for="notCompliantContent">
          Non-conformités (optionnel)
          <span class="fr-hint-text">
            Il s’agit d’un résumé des contenus et fonctionnalités non conformes
            identifiés sur le site. Ils doivent être rédigés dans un langage
            simple et compréhensible par toutes et tous.
          </span>
        </label>
        <textarea
          id="notCompliantContent"
          v-model="notCompliantContent"
          class="fr-input"
        />
      </div>

      <div class="fr-input-group">
        <label class="fr-label" for="derogatedContent">
          Dérogations pour charge disproportionnée (optionnel)
          <span class="fr-hint-text">
            Il s’agit des contenus qu’il serait trop coûteux de rendre
            accessibles.
          </span>
        </label>
        <textarea
          id="derogatedContent"
          v-model="derogatedContent"
          class="fr-input"
        />
      </div>

      <div class="fr-input-group">
        <label class="fr-label" for="notInScopeContent">
          Contenus non soumis à l’obligation d’accessibilité, contenus tiers
          (optionnel)
          <span class="fr-hint-text">
            Exemple : Cartes interactives, fil d’actualité réseaux social,
            lecteur vidéo, etc
          </span>
        </label>
        <textarea
          id="notInScopeContent"
          v-model="notInScopeContent"
          class="fr-input"
        />
      </div>

      <div v-if="isDevMode">
        <button
          class="fr-btn fr-mt-6w fr-mb-1w fr-mr-2w"
          type="button"
          @click="DEBUG_fillFields"
        >
          [DEV] Remplir les champs
        </button>
      </div>

      <div class="fr-mt-6w">
        <button class="fr-btn" type="submit">Enregistrer</button>
      </div>
    </div>
  </form>
</template>

<style scoped>
.narrow-content {
  max-width: 49.5rem;
}

.mandatory-notice {
  color: var(--text-mention-grey);
}
</style>
