# Motion Prompts — bibliothèque de prompts de motion design

Site vitrine et bibliothèque pour le pack de prompts vendu sur Maketou (1 500 FCFA, accès à tout le pack).

- Les **vidéos** sont visibles par tout le monde : elles servent de vitrine.
- Les **prompts** sont chiffrés dans le site. Ils s'affichent seulement avec le **code d'accès** que reçoit l'acheteur.

## Organisation

```
motion-prompts/
├── templates/<slug>/         ← un dossier par modèle (la « source »)
│   ├── meta.json             titre, catégories, auteur, durée, date d'ajout
│   ├── prompt-original.md    le prompt tel qu'acheté
│   └── prompt-detaille.md    (optionnel) prompt détaillé écrit en analysant la vidéo
├── site/                     ← ce qui est mis en ligne
│   ├── index.html, app.js, style.css
│   ├── videos/<slug>.mp4     vidéo compressée en 720p (~1 Mo)
│   └── posters/<slug>.jpg    image d'aperçu
└── scripts/
    ├── prepare-video.sh      compresse une vidéo + crée l'aperçu
    └── build.mjs             chiffre les prompts → site/data.json
```

Catégories disponibles : Interface utilisateur du produit, Téléphone, Graphiques, Diagrammes,
Type cinétique, Formes, Particules, Personnages, Photos, Musique, Code.

## Ajouter un modèle

```bash
scripts/prepare-video.sh chemin/vers/video.mp4 mon-slug
# puis créer templates/mon-slug/meta.json et prompt-original.md (+ prompt-detaille.md)
ACCESS_CODE="code-de-test" node scripts/build.mjs   # vérification locale
python3 -m http.server -d site 8000                 # aperçu sur http://localhost:8000
```

Un prompt de moins de 600 caractères est classé « Rapide », sinon « Détaillé ».

## Mise en ligne sur Cloudflare Pages (gratuit)

1. Créer un compte sur https://dash.cloudflare.com/sign-up
2. **Workers & Pages → Créer → Pages → Connecter à Git**, autoriser l'accès à ce dépôt GitHub.
3. Paramètres de build :
   - Branche de production : celle qui contient ce dossier
   - Répertoire racine : `motion-prompts`
   - Commande de build : `node scripts/build.mjs`
   - Répertoire de sortie : `site`
   - Variable d'environnement : `ACCESS_CODE` = le code donné aux acheteurs
4. Enregistrer et déployer. Le site est en ligne sur `https://<nom>.pages.dev`.

**Changer le code d'accès** (si le code a été partagé) : modifier `ACCESS_CODE` dans
Paramètres → Variables, puis relancer un déploiement. Le nouveau code doit ensuite être donné aux
acheteurs (message sur Maketou / mise à jour du produit).
