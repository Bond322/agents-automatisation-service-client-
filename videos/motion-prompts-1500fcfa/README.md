# Motion Prompts 1500 FCFA — recette

Vidéo verticale 1080×1920, 30 images/s, 31 secondes.

| Moment | Contenu | Origine |
|---|---|---|
| 0,00 → 4,00 s | Intro « J'ai payé 1 500 FCFA… et voici ce que j'ai fait ↓ » | Reconstruite dans la recette |
| 4,00 → 24,87 s | Montage des exemples (Ketty Shop, MedFlow AI, la méthode…) | Repris tel quel de la vidéo d'origine |
| 24,87 → 31,00 s | Carte de fin « 150+ prompts… 1 500 FCFA » | Reconstruite dans la recette |

La bande-son d'origine joue sur toute la durée.

**Retouche appliquée :** le grand chiffre « 150 » est maintenant **orange** (réglage « Couleur du grand chiffre »).

## Réglages (en haut de `index.html`)

- **Couleurs** : couleur principale, couleur du « 150 », textes clairs, texte posé sur l'orange.
- **Textes** : titre de l'intro, prix, devise, phrase de l'intro, nom de la marque, grand chiffre, sous-titre, texte du bouton, petite mention.
- **Moments** : moment d'apparition de chaque élément de l'intro et de la carte de fin.

Pour les modifier, ouvre ce dossier dans le Studio Motion (`studio-motion/Studio-Motion.html`).

## Fabriquer le MP4

```bash
npx hyperframes render . -o rendu/motion-prompts-1500fcfa.mp4
```

Le dossier `rendu/` n'est pas enregistré dans le dépôt.

## Fichiers

- `index.html` : la recette.
- `assets/original.mp4` : la vidéo d'origine, réencodée avec une image clé par seconde pour un positionnement précis. Elle sert au montage du milieu et aux fonds flous.
- `assets/bande-son.m4a` : la bande-son d'origine.
- `assets/gsap.min.js` et `assets/polices/` : la bibliothèque d'animation et les polices Inter / Inter Tight (licence OFL), rangées en local pour que la recette fonctionne sans Internet.
