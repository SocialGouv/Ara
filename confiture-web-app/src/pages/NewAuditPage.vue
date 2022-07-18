<script lang="ts" setup>
import { ref } from "vue";

const contacts = ref([
  {
    name: "",
    email: "",
  },
]);

function addContact() {
  contacts.value.push({ name: "", email: "" });
}

function deleteContact(i: number) {
  contacts.value.splice(i, 1);
}
</script>

<template>
  <div class="fr-stepper">
    <h2 class="fr-stepper__title">
      <span class="fr-stepper__state">Étape 1 sur 2</span>
      Informations générales
    </h2>
    <div
      class="fr-stepper__steps"
      data-fr-current-step="1"
      data-fr-steps="2"
    ></div>
    <p class="fr-stepper__details">
      <span class="fr-text--bold">Étape suivante :</span> Paramètre de l’audit
    </p>
  </div>
  <form class="content" @submit.prevent>
    <h1>📄 Informations générales de la démarche à auditer</h1>

    <div class="fr-input-group">
      <label class="fr-label" for="procedure-name">Nom de la démarche</label>
      <input id="procedure-name" class="fr-input" type="text" required />
    </div>

    <fieldset class="fr-fieldset fr-mt-6w">
      <legend>
        <h2 class="fr-h4 fr-mb-2w">Ministère qui fait la demande</h2>
      </legend>

      <div id="header-search" class="fr-search-bar fr-mb-2w" role="search">
        <label class="fr-label" for="procedure-ministere">
          Rechercher un ministère
        </label>
        <input
          id="procedure-ministere"
          class="fr-input"
          placeholder="Rechercher un ministère"
          type="search"
        />
        <button class="fr-btn" title="Rechercher">Rechercher</button>
      </div>

      <div class="fr-input-group fr-input-group--disabled">
        <label class="fr-label" for="procedure-administration">
          Administration
        </label>
        <input
          id="procedure-administration"
          class="fr-input"
          type="text"
          required
          disabled
        />
      </div>
    </fieldset>

    <fieldset class="fr-fieldset fr-mt-6w">
      <legend>
        <h2 class="fr-h4 fr-mb-2w">La démarche à auditer</h2>
      </legend>

      <div class="fr-input-group">
        <label class="fr-label" for="procedure-url">
          URL du site de la démarche
          <span class="fr-hint-text">Par exemple http://demarche.gouv.fr</span>
        </label>
        <input id="procedure-url" class="fr-input" type="url" required />
      </div>
    </fieldset>

    <fieldset class="fr-fieldset fr-mt-6w">
      <legend>
        <h2 class="fr-h4 fr-mb-2w">Responsable du site</h2>
      </legend>

      <p>
        Ces informations seront affichées dans la déclaration d’accessibilité.
        Elles permettent aux usagers qui rencontrent des difficultés pour
        accéder à du contenu ou à un service d’être orienté vers une solution
        adaptée. Au moins un des moyens de contact (adresse e-mail ou URL vers
        formulaire de contact) doit être rempli.
      </p>

      <div class="fr-input-group">
        <label class="fr-label" for="procedure-contact-name">
          Nom et prénom du contact (optionnel)
        </label>
        <input id="procedure-contact-name" class="fr-input" />
      </div>

      <div class="fr-input-group">
        <label class="fr-label" for="procedure-contact-email">
          Adresse e-mail
          <span class="fr-hint-text">Exemple : contact@ministere.gouv.fr</span>
        </label>
        <input
          id="procedure-contact-email"
          class="fr-input"
          type="email"
          required
        />
      </div>

      <div class="fr-input-group">
        <label class="fr-label" for="procedure-contact-form">
          URL vers formulaire de contact
          <span class="fr-hint-text">Exemple : contact@ministere.gouv.fr</span>
        </label>
        <input
          id="procedure-contact-form"
          class="fr-input"
          type="url"
          required
        />
      </div>
    </fieldset>

    <div class="fr-mt-4w">
      <h2 class="fr-h4 fr-mb-2w">Destinataires de l’audit</h2>

      <p>
        Il s’agit des personnes qui doivent être averties que l’audit est
        terminé et du taux d’accessibilité de la démarche. Il peut s’agir des
        porteurs de la démarche, référents accessibilité, chefs de projet,
        développeurs, etc. Ils seront les destinataires de la livraison de
        l’audit.
      </p>

      <fieldset
        v-for="(contact, i) in contacts"
        :key="i"
        class="fr-fieldset fr-mt-4w fr-p-4w contact-card"
      >
        <div class="fr-mb-2w contact-header">
          <legend>
            <h3 class="fr-h6 fr-mb-0">Contact {{ i + 1 }}</h3>
          </legend>

          <button
            class="fr-link"
            type="button"
            :disabled="contacts.length === 1"
            @click="deleteContact(i)"
          >
            Supprimer
          </button>
        </div>

        <div class="fr-input-group">
          <label class="fr-label" :for="`procedure-auditor-name-${i + 1}`">
            Nom et prénom du contact
          </label>
          <input
            :id="`procedure-auditor-name-${i + 1}`"
            v-model="contact.name"
            class="fr-input"
          />
        </div>

        <div class="fr-input-group">
          <label class="fr-label" :for="`procedure-auditor-email-${i + 1}`">
            Adresse e-mail du contact
            <span class="fr-hint-text">
              Exemple : prenom.nom@ministere.gouv.fr
            </span>
          </label>
          <input
            :id="`procedure-auditor-email-${i + 1}`"
            v-model="contact.email"
            class="fr-input"
            type="email"
            required
          />
        </div>

        {{ contact.email }}
        {{ contact.name }}
      </fieldset>

      <button
        class="fr-link fr-mt-4w fr-link--icon-left fr-icon-add-line"
        type="button"
        @click="addContact"
      >
        Ajouter contact
      </button>
    </div>

    <fieldset class="fr-fieldset fr-mt-6w">
      <legend>
        <h2 class="fr-h4 fr-mb-2w">Auditeur</h2>
      </legend>

      <div class="fr-input-group">
        <label class="fr-label" for="procedure-auditor-name">
          Nom et prénom de l’auditeur
        </label>
        <input id="procedure-auditor-name" class="fr-input" />
      </div>

      <div class="fr-input-group">
        <label class="fr-label" for="procedure-auditor-email">
          Adresse e-mail de l’auditeur
          <span class="fr-hint-text"
            >Exemple : prenom.nom@modernisation.gouv.fr</span
          >
        </label>
        <input
          id="procedure-auditor-email"
          class="fr-input"
          type="email"
          required
        />
      </div>
    </fieldset>

    <button class="fr-btn fr-mt-6w" type="submit">Suivant</button>
  </form>
</template>

<style scoped>
.content {
  max-width: 792px;
}

.contact-card {
  border: 1px solid var(--border-default-grey);
}

.contact-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}
</style>
