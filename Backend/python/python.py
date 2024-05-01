import pdfplumber

# Initialiser un dictionnaire pour stocker les premiers et derniers mots de chaque ligne
donnees_extraits = {}

with pdfplumber.open("/content/Document 33 (1).pdf") as pdf:
    page = pdf.pages[0]  # Sélectionnez la page contenant le tableau
    for i, row in enumerate(page.extract_table()):  # Extraction de chaque rangée du tableau
        if row:  # Vérifie si la rangée n'est pas vide
            first_word = row[0]  # Premier mot de la rangée
            last_word = row[-1]  # Dernier mot de la rangée
            donnees_extraits[f"ligne_{i+1}"] = {"premier_mot": first_word, "dernier_mot": last_word}

# Afficher le dictionnaire avec les données extraites
print(donnees_extraits)
