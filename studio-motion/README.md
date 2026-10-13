# Studio Motion

Le Studio Motion sert à **voir et retoucher toi-même** une vidéo faite avec HyperFrames, sans rien installer.

- Tu cliques sur un élément de la vidéo (un texte, un bouton, un chiffre…) et tu changes sa couleur, sa taille, sa position ou son texte.
- Tu modifies les **Réglages** de la vidéo (couleurs, textes, moments d'apparition) et tu vois le résultat tout de suite.
- Tu déplaces ou raccourcis les morceaux de la vidéo dans la **timeline**.
- Pour ce que tu ne peux pas faire seul, tu crées une **retouche pour Claude** : tu dessines sur la vidéo et tu décris ce que tu veux.

Tout tient dans un seul fichier : **`Studio-Motion.html`**.

## Démarrer (Windows, Chrome ou Edge)

1. Télécharge `Studio-Motion.html` et le dossier de ta vidéo (par exemple `motion-prompts-1500fcfa`, décompressé).
2. Double-clique sur `Studio-Motion.html` : il s'ouvre dans Chrome ou Edge.
3. Clique sur **Ouvrir une vidéo** et choisis le **dossier** de la vidéo, celui qui contient `index.html` et `assets`.
4. Chrome demande s'il peut modifier les fichiers du dossier : réponds **Modifier les fichiers**. C'est ce qui permet au bouton « Enregistrer » d'écrire directement dans le dossier.

## Ce que tu peux faire

| Je veux… | Comment |
|---|---|
| Changer une couleur, un texte, un prix | Onglet **Réglages**, ou clique sur l'élément dans la vidéo |
| Agrandir, déplacer, tourner un élément | Clique dessus, puis **Position et taille** dans l'onglet **Élément** |
| Faire apparaître un élément plus tôt ou plus tard | Les **Moments** dans l'onglet Réglages, ou glisse la barre dans la timeline |
| Couper le début ou la fin d'un morceau | Tire les bords de la barre dans la timeline |
| Demander quelque chose de plus créatif à Claude | Outils de dessin (flèche, rectangle…), puis décris ta demande dans **Retouches** |
| Revenir en arrière | **↶** ou `Ctrl + Z` (et **↷** ou `Ctrl + Y` pour rétablir) |
| Garder mes changements | **Enregistrer** ou `Ctrl + S`. L'ancienne version est gardée dans le dossier `.versions`. |
| Obtenir le MP4 | **Envoyer à Claude (.zip)**, puis envoie ce fichier dans la conversation : Claude fabrique le MP4 |

## Raccourcis clavier

| Touche | Action |
|---|---|
| `Espace` | Lecture / pause |
| `←` `→` | Image précédente / suivante |
| `Maj` + `←` `→` | Reculer / avancer d'une seconde |
| `V` | Outil de sélection |
| `2` à `6` | Outils de dessin : flèche, rectangle, cercle, main levée, texte |
| `C` | Nouvelle retouche pour Claude |
| `L` | Rejouer en boucle la retouche sélectionnée |
| `↑` `↓` / `M` | Volume / couper le son |
| `Ctrl` + `Z` / `Ctrl` + `Y` | Annuler / rétablir |
| `Ctrl` + `S` | Enregistrer |
| `Échap` | Tout désélectionner |

## Bon à savoir

- Si tu fermes sans enregistrer, le Studio te propose de reprendre tes modifications à la prochaine ouverture.
- Le son de l'aperçu ne change pas la vidéo finale. Pour changer le volume de la musique dans la vidéo, clique sur la barre « bande son » dans la timeline.
- Si ton navigateur refuse l'accès direct au dossier, le Studio fonctionne quand même : « Enregistrer » télécharge alors le fichier `index.html` modifié.

## Pour Claude (maintenance)

- `source/studio.html` contient l'interface, et `source/hyperframe.runtime.iife.js` le moteur HyperFrames (licence Apache-2.0), copié depuis le paquet npm `hyperframes`.
- Après toute modification, reconstruis le fichier unique avec `python3 studio-motion/build.py`.
- L'aperçu charge la recette dans un iframe `srcdoc` : les fichiers du dossier deviennent des URL `blob:` et le moteur est injecté en premier script. Les éléments sont reliés à la recette par un attribut `data-sm-id`, ajouté seulement dans l'aperçu.
