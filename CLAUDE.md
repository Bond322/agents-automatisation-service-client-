# Consignes pour Claude

Le propriétaire de ce dépôt est francophone et n'est pas développeur : réponds en français, en termes simples.

## Vidéos de motion design

Chaque vidéo est une **recette HyperFrames** rangée dans `videos/<nom-de-la-video>/`. Les skills HyperFrames sont dans `.claude/skills/` : commence par `/hyperframes`.

- `index.html` est la recette, au format composition HyperFrames autonome.
- **Réglages regroupés en haut** : déclare les couleurs, textes et moments clés dans `data-composition-variables` sur `<html>`. Les libellés sont en français, au format `Groupe · nom` (par exemple `Intro · titre`, `Moment · prix de fin`). Utilise-les via `var(--id)`, `data-var-text` et `window.__hyperframes.getVariables()`, pour que le Studio Motion puisse les modifier.
- **Tout en local** : GSAP, polices (`@font-face` vers `assets/polices/`) et médias dans `assets/`. Pas de CDN : le réseau de la session cloud bloque cdn.jsdelivr.net pendant le rendu.
- Les vidéos sources doivent avoir une image clé par seconde (`-g 30 -keyint_min 30`) pour un positionnement précis.
- Rendu : `npx hyperframes render . -o rendu/<nom>.mp4`, lancé dans le dossier de la vidéo. `rendu/` est ignoré par git : envoie le MP4 à l'utilisateur au lieu de le committer.
- Vérification : `npx hyperframes lint .`, puis compare des images du rendu avec la référence.
- Ajoute un `README.md` en français qui décrit le déroulé et les réglages.

## Retouches envoyées par l'utilisateur

- **Fiche venant du Studio Motion** (zip `<nom>-pour-claude.zip`) : le `index.html` joint contient déjà ses propres modifications. Recopie-le dans `videos/<nom>/`, puis applique les retouches de `fiche-retouches.md`.
- **Fiche venant du Studio Retouches** (`editeur-video/`, pour un MP4 sans recette) : elle donne les moments, numéros d'image et coordonnées en pixels.
- Ne modifie que ce qui est demandé ; le reste de la recette ne bouge pas.

## Outils

- `editeur-video/index.html` : Studio Retouches, pour annoter n'importe quel MP4 (Phase 1).
- `studio-motion/Studio-Motion.html` : Studio Motion, pour éditer une recette (Phase 2). Après une modification de `studio-motion/source/`, lance `python3 studio-motion/build.py`.
