# Studio Retouches

Outil pour indiquer **précisément** les retouches à faire sur une vidéo de motion design (fichier MP4), puis les transmettre à Claude sous forme de fiche claire.

Tout tient dans un seul fichier : `index.html`. Rien à installer, et la vidéo reste sur ton ordinateur (rien n'est envoyé sur Internet).

## Démarrer

1. Télécharge le fichier `index.html`.
2. Double-clique dessus : il s'ouvre dans ton navigateur (Chrome, Edge ou Safari).
3. Glisse ton fichier MP4 dans la fenêtre, ou clique sur **Ouvrir une vidéo**.

## Indiquer une retouche

1. **Trouve le moment exact** : mets en pause, puis avance image par image avec les flèches `←` `→` du clavier (ou les boutons `-1 img` / `+1 img`). Tu peux aussi cliquer ou glisser sur la bande en bas.
2. **Dessine sur la vidéo** pour montrer l'endroit : flèche, rectangle, cercle, trait à main levée (pour une trajectoire), texte ou point numéroté. Une retouche est créée automatiquement à l'image affichée.
3. **Écris ta demande** dans la carte à droite : ce qui ne va pas, et ce que tu veux à la place.
4. Choisis une **catégorie** (Timing, Texte, Couleur…) et une **priorité**.
5. Si la retouche concerne une durée (« de 2 s à 4 s, c'est trop lent ») : avance jusqu'à la fin du passage et clique sur **Fin ici**. Le bouton **Boucler** rejoue ce passage en boucle.

Un repère numéroté apparaît sur la bande en bas pour chaque retouche : clique dessus pour y revenir.

## M'envoyer les retouches

- **Copier la fiche** : copie un texte précis (moments, numéros d'image, positions à l'écran). Colle-le dans la conversation avec Claude.
- **Exporter la fiche (.zip)** : télécharge la fiche, plus une **capture annotée** de chaque retouche. Envoie le zip, ou le texte avec les images.

Ton travail est **sauvegardé automatiquement** dans le navigateur : en rouvrant la même vidéo, tes retouches reviennent. **Enregistrer le projet** crée un fichier `.json` pour les garder ailleurs ou les reprendre sur un autre ordinateur (**Ouvrir un projet**).

## Raccourcis clavier

| Touche | Action |
|---|---|
| `Espace` | Lecture / pause |
| `←` `→` | Image précédente / suivante |
| `Maj` + `←` `→` | Reculer / avancer d'une seconde |
| `C` | Nouvelle retouche à l'image affichée |
| `1` à `7` | Outils : lecture, flèche, rectangle, cercle, main levée, texte, point |
| `Ctrl` + `Z` | Annuler le dernier dessin |
| `I` / `O` / `L` | Début de boucle / fin de boucle / activer la boucle |
| `↑` `↓` | Monter / baisser le volume |
| `M` | Couper ou remettre le son |
| `Échap` | Désélectionner |

## Bon à savoir

- **Volume** : le curseur à côté de l'icône de haut-parleur règle le son de 0 à 200 %. Au-delà de 100 %, le son est amplifié (pratique si la musique est trop faible). Le réglage est mémorisé.
- Le nombre d'images par seconde est **détecté automatiquement** à la première lecture. Tu peux le changer dans le menu « Images/s ».
- Les positions dans la fiche sont en pixels de la vidéo d'origine, mesurées depuis le coin haut-gauche, avec la zone en clair (« haut droite », « centre de l'image »…).
