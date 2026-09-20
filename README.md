# 🦷 MedFlow AI — Automatisation du parcours patient dentaire

Deux workflows **n8n** permettant d'automatiser une partie de la gestion administrative d'un cabinet dentaire grâce à l'IA.

Le système couvre principalement :

* 📩 Analyse des emails entrants
* 🤖 Classification automatique des demandes
* 📅 Gestion des demandes de rendez-vous
* 🗓️ Vérification des horaires et disponibilités
* ✉️ Réponses automatiques aux patients
* 🚨 Détection et transfert des situations nécessitant une intervention humaine
* ⏰ Rappels automatiques J-1
* 🔄 Suivi automatique J+7 après consultation

---

## 🏗️ Architecture

```text
                         PATIENT
                            │
                            ▼
                     📧 Email Gmail
                            │
                            ▼
                  ┌──────────────────┐
                  │   Workflow 1     │
                  │ Gestion des RDV  │
                  └────────┬─────────┘
                           │
                           ▼
                    🤖 Classification IA
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
        Question        Demande        Urgence
        générale          RDV          humaine
             │             │             │
             ▼             ▼             ▼
          Réponse      Vérification    Équipe du
          IA           disponibilité   cabinet
                           │
                           ▼
                    Google Calendar
                           │
                           ▼
                       Airtable
                           │
                           ▼
                    Confirmation RDV
                           │
                           │
                           ▼
                  ┌──────────────────┐
                  │   Workflow 2     │
                  │ Rappels & suivi  │
                  └────────┬─────────┘
                           │
                 ┌─────────┴─────────┐
                 ▼                   ▼
              J-1 rappel          J+7 suivi
                 │                   │
                 ▼                   ▼
               Gmail               Gmail
```

---

# 1. Workflow — Gestion automatisée des rendez-vous

**Fichier :**

`Gestion Automatisée Rendez-vous Cabinet Dentaire avec IA.json`

Ce workflow surveille les emails entrants du cabinet et utilise l'IA pour comprendre automatiquement la demande du patient. Le déclencheur Gmail vérifie les nouveaux messages toutes les minutes.

## Fonctionnement

### Étape 1 — Réception de l'email

Un nouvel email patient déclenche automatiquement le workflow via **Gmail**.

Le contenu du message est transmis au système d'IA.

### Étape 2 — Compréhension du message

L'agent IA analyse la demande et extrait notamment :

* catégorie de la demande ;
* nom du patient ;
* motif ;
* niveau d'urgence ;
* résumé ;
* date souhaitée ;
* heure souhaitée ;
* téléphone ;
* type de consultation.

Les trois catégories principales sont :

```text
QUESTION_GENERALE
DEMANDE_RDV
URGENCE_HUMAINE
```

Le système tient également compte du contexte de l'échange et peut conserver certaines informations déjà communiquées dans le fil de conversation.

---

## Étape 3 — Routage intelligent

Après classification, le workflow utilise un **Switch n8n** pour orienter la demande vers le traitement approprié :

```text
QUESTION_GENERALE → Réponse automatique

DEMANDE_RDV → Processus de prise de rendez-vous

URGENCE_HUMAINE → Notification à l'équipe
```

---

## 🟢 Cas 1 — Question générale

Pour une question concernant par exemple :

* les horaires ;
* l'adresse ;
* les soins ;
* les modalités du cabinet ;
* les tarifs ;

l'IA génère directement une réponse en français, avec un ton professionnel et concis.

Le système est également configuré pour **ne pas fournir de conseil médical ni poser de diagnostic**.

La réponse est ensuite envoyée automatiquement par Gmail.

---

## 🔵 Cas 2 — Demande de rendez-vous

Lorsqu'un patient souhaite prendre rendez-vous, le workflow vérifie plusieurs éléments.

### Vérification de la date et de l'heure

Le système identifie d'abord si le patient a demandé une date et une heure précises.

Il vérifie ensuite que le créneau correspond aux horaires du cabinet.

### Vérification du calendrier

Les événements du **Google Calendar** sont récupérés afin d'identifier les périodes déjà occupées.

Le workflow calcule ensuite les créneaux disponibles à partir des horaires du cabinet et des événements existants.

### Si le créneau demandé est disponible

Le système vérifie ensuite que les informations nécessaires sont présentes.

Si le nom et le motif sont disponibles, le rendez-vous peut être créé directement dans Airtable et une confirmation est envoyée au patient.

Le rendez-vous confirmé est enregistré avec notamment :

* date ;
* heure ;
* type de consultation ;
* email patient ;
* Thread ID ;
* notes ;
* statut `Confirmé` ;
* indicateur `Rappel Envoyé = false`.

### Si des informations manquent

Le système répond automatiquement au patient en lui demandant les informations nécessaires, notamment :

* nom et prénom ;
* numéro de téléphone ;
* motif de consultation.

---

## 🔴 Cas 3 — Urgence nécessitant un humain

Lorsqu'un message est identifié comme nécessitant une intervention humaine, le workflow ne tente pas de gérer automatiquement la situation.

Il transmet à l'équipe du cabinet :

* le patient ;
* le niveau d'urgence ;
* le motif ;
* le résumé ;
* l'adresse email ;
* le sujet du message original.

Cette logique permet de conserver une **validation humaine pour les situations sensibles**.

---

# 2. Workflow — Rappels J-1 et suivi J+7

**Fichier :**

`MedFlow AI - Cabinet Maupassant - Rappels J-1 et J+7.json`

Ce deuxième workflow automatise la communication après la prise de rendez-vous.

Il se déclenche quotidiennement à **8h**.

---

## ⏰ Rappel J-1

Le workflow recherche dans Airtable les rendez-vous :

```text
Statut = Confirmé
Date = demain
Rappel Envoyé ≠ true
```

Pour chaque rendez-vous trouvé :

1. Les informations du rendez-vous sont récupérées.
2. GPT-4o-mini génère un email personnalisé.
3. Le rappel indique la date et l'heure.
4. Le patient est invité à arriver 10 minutes en avance.
5. L'email est envoyé via Gmail.
6. Airtable est mis à jour avec :

```text
Rappel Envoyé = true
```

Cette dernière étape évite qu'un même patient reçoive plusieurs fois le même rappel.

---

# 🔄 Suivi J+7

Le même déclencheur quotidien recherche les rendez-vous confirmés correspondant à la période de suivi.

Le workflow génère ensuite un email personnalisé demandant au patient comment s'est passée la suite de sa consultation.

Le message peut notamment porter sur :

* la convalescence ;
* la satisfaction ;
* les éventuelles questions ;
* le besoin d'un prochain rendez-vous.

Après l'envoi du message, le rendez-vous est marqué comme :

```text
Terminé
```

dans Airtable.

---

# 🧩 Technologies utilisées

| Technologie              | Utilisation                              |
| ------------------------ | ---------------------------------------- |
| **n8n**                  | Orchestration des workflows              |
| **Gmail**                | Réception et envoi des emails            |
| **OpenAI / GPT-4o-mini** | Génération et compréhension du langage   |
| **OpenRouter**           | Modèle utilisé pour la classification IA |
| **Airtable**             | Stockage et suivi des rendez-vous        |
| **Google Calendar**      | Vérification des disponibilités          |
| **JavaScript**           | Parsing, validation et logique métier    |

---

# 🗃️ Structure des données

La table Airtable `Rendez-vous` contient notamment :

```text
Patient
Date du Rendez-vous
Heure du Rendez-vous
Type de Consultation
Statut Rendez-vous
Rappel Envoyé
Notes
Proposition Suivante (IA)
Résumé RDV (IA)
Thread ID
Email Patient
```

Les statuts utilisés sont :

```text
En attente
Confirmé
Annulé
Terminé
```

---

# 🔐 Gestion des erreurs

Le workflow de classification possède un mécanisme de sécurité.

Si la réponse de l'IA ne peut pas être correctement interprétée comme JSON, le système bascule automatiquement la demande vers :

```text
URGENCE_HUMAINE
```

avec un niveau d'urgence élevé et une indication demandant une vérification manuelle.

L'objectif est de privilégier une **vérification humaine plutôt qu'une automatisation silencieusement incorrecte**.

---

# ⚙️ Installation

## Prérequis

* Une instance n8n
* Un compte Gmail
* Une API OpenAI
* Un compte OpenRouter
* Un compte Airtable
* Un calendrier Google Calendar
* Une base Airtable configurée avec la table `Rendez-vous`

## Installation

1. Importer les deux fichiers `.json` dans n8n.
2. Connecter les credentials Gmail.
3. Connecter OpenAI.
4. Connecter OpenRouter.
5. Connecter Airtable.
6. Connecter Google Calendar.
7. Vérifier les IDs de la base et de la table Airtable.
8. Vérifier les horaires du cabinet.
9. Vérifier les emails destinataires des notifications d'urgence.
10. Tester chaque branche avant activation en production.

---

# 🧪 Scénarios de test recommandés

### Test 1 — Question générale

> « Quels sont vos horaires ? »

**Résultat attendu :** réponse automatique.

### Test 2 — Demande de rendez-vous

> « Bonjour, je voudrais prendre rendez-vous pour un implant mardi prochain à 15h. »

**Résultat attendu :**

```text
Analyse → vérification horaires → vérification calendrier
→ proposition/confirmation → Airtable
```

### Test 3 — Informations manquantes

> « Je voudrais prendre rendez-vous demain à 14h. »

**Résultat attendu :** demande des informations nécessaires avant confirmation.

### Test 4 — Urgence

> « J'ai une douleur très importante et mon visage commence à gonfler. »

**Résultat attendu :** transfert vers l'équipe humaine.

### Test 5 — Rappel

Créer un rendez-vous confirmé pour le lendemain.

**Résultat attendu :**

```text
8h → récupération du RDV → génération du message
→ email → Rappel Envoyé = true
```

### Test 6 — Suivi

Créer un rendez-vous correspondant à la logique J+7.

**Résultat attendu :**

```text
Recherche → génération du suivi → email → Statut = Terminé
```

---

# ⚠️ Points importants avant une utilisation en production

Ce projet est un **prototype d'automatisation administrative** et doit être testé avant utilisation réelle avec des patients.

En particulier :

* vérifier les fuseaux horaires ;
* tester les dates relatives ;
* vérifier les créneaux et les conflits calendrier ;
* contrôler les réponses générées par l'IA ;
* sécuriser les données patients ;
* limiter les informations sensibles transmises aux modèles ;
* prévoir une intervention humaine pour les cas ambigus ;
* journaliser les erreurs ;
* tester les scénarios où une API ou un service externe est indisponible.

L'automatisation ne doit pas remplacer le jugement humain dans les situations médicales ou ambiguës.

---

# 🎯 Objectif du projet

L'objectif de MedFlow AI est de transformer une gestion administrative principalement manuelle en un système capable de traiter automatiquement une partie du parcours patient :

```text
Email entrant
      ↓
Compréhension IA
      ↓
Qualification
      ↓
Action appropriée
      ↓
Rendez-vous
      ↓
Confirmation
      ↓
Rappel
      ↓
Suivi
```

Le système illustre une approche **AI + workflow automation**, dans laquelle le modèle de langage ne fonctionne pas seul : il est intégré à des règles métier, des bases de données, un calendrier et des actions automatisées.

---

## 📁 Fichiers

```text
├── Gestion Automatisée Rendez-vous Cabinet Dentaire avec IA.json
└── MedFlow AI - Cabinet Maupassant - Rappels J-1 et J+7.json
```

**Projet : MedFlow AI**
Automatisation administrative pour cabinets dentaires.
