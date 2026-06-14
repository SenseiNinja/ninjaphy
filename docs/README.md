# Dossier des documents (PDF)

Placez ici vos fichiers PDF : cours, activités, TP, exercices.

## Convention de nommage conseillée
- `cours-ch1-corps-purs.pdf`
- `activite1-ch1-dissolution.pdf`
- `tp1-ch1-solutions.pdf`
- `exos-ch1.pdf`

## Comment les lier
Dans une page de classe, le bouton appelle `openDoc('chemin/vers/fichier')` :

```html
<button class="chapitre-btn btn-cours" onclick="openDoc('../docs/cours-ch1-corps-purs.pdf')">
  <i class="fas fa-book"></i> Cours
</button>
```

Ou vers une page de cours complète (texte + PDF) :

```html
<button class="chapitre-btn btn-cours" onclick="openDoc('cours-modele.html')">
  <i class="fas fa-book"></i> Cours
</button>
```
