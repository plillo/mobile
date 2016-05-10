#TODO list

1. Organizzazione dei menu
   - dovrebbe essere sufficiente 1 livello: AGGIUNGI, LISTA; default: LISTA

2. FORM per l'inserimento di una news
   partiamo dall'inserimento di dati minimi: titolo, descrizione e ?

3. LISTA delle news
   - elenca TUTTE le news inserite (paginazione in un secondo momento)
   - permette di modificare/cancellare ogni singola news
     - MODIFICA: cliccando sulla riga (o su un pulsante di edit nella riga) si carica il form di modifica:
     confermata la modifica si ricarica automaticamente la LISTA
4. API (service "**news**")
   - createNews(object): passa un oggetto con i dati della news da creare e riceve una promessa:
      ```javascript
      news.createNews(object).then();
      ```

   - inserimento news: richiama il metodo "createNews" del service "news" passando un oggetto con i dati della news
      chiamata: news.addNews(addingNews)
      riceve una PROMESSA; se successo riceve un oggetto addedNews contenente TUTTI i dati della news inserita,
      comprensivi di dati aggiunti dal backend (identificativo, timestamp di inserimento,...)
   - lista news: richiama il metodo listNews del service news (senza parametri):
      chiamata: news.listNews()
      riceve una promessa con un oggetto listNews contenente un ARRAY di tutte le news da elencare
   - cancellazione news (da icona in riga lista): richiama il metodo deleteNews del service news con parametro l'UUID della news da eliminare
      riceve una promessa: se successo deve cancellare la riga dalla lista.

4. completare analisi del progetto NEWS (BOZZA)
      - le news sono organizzate in "topics" (categorie) strutturate dall'utente stesso secondo uno schema ad albero:
         ogni topic può avere un (solo) parent (genitore).
      - ogni news potrà essere associata a una o più topics
      - campi editabili:
         - data/ora (timestamp) di pubblicazione (default: timestamp di creazione news, cioè 'subito')
         - data/ora di fine pubblicazione (default: nessuno, cioè 'indefinitamente')
         - tags (stringhe separate da virgole, su cui basare i filtraggi)
         - canali PUSH (email/sms/push notification,...)
         - ...

 ...
