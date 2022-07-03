## Installation
### Step 1

Cloner le repo

```bash
git clone https://github.com/PierreGourgouillon/starter-node-back
```

### Step 2

Supprimer le upstream

```bash
git remote rm upstream
```

### Step 3

Vérifier si il est bien delete

```bash
git remote -v
```

### Step 4

Ajouter le nouveau upstream

```bash
git remote add origin [LINK_GITHUB]
```

### Step 5

Vérifier si il est bien setup

```bash
git remote -v
```

### Step 6

Push sur le nouveau repo

```bash
git add .
git commit -m "first commit"
git push -f origin main
```
