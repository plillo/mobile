(leggere in fondo le note per il team)

#News TODO list

1. Organizzazione dei menu: dovrebbe essere sufficiente 1 livello
   
   Aggiungi | Lista (default)
   --- | ---

2. FORM per l'inserimento di una news
   partiamo dall'inserimento di dati minimi: titolo, descrizione e ?

3. LISTA delle news
   - elenca TUTTE le news inserite (paginazione in un secondo momento): usare API **_getListNews()_**
   - permette di modificare/cancellare ogni singola news
     - MODIFICA: cliccando sulla riga (o su un pulsante di edit nella riga) si carica il form di modifica:
     confermata la modifica si ricarica automaticamente la LISTA
4. API (service "**news**")
   - **_createNews(object)_**: passa un oggetto con i dati della news da creare e riceve una promessa alla quale possono essere agganciati i meccanismi di callback (successo/errore):
   
      ```javascript
      news.createNews(object).then(
         /* function che gestisce il caso di successo */
         function successCallback(response) {
            /* gestione dei dati di risposta */
         },
	    	function errorCallback(response) {
	    	   /* gestione dei dati di risposta */
	    	}
      );
      ```
      
      i dati ricevuti in caso di successo si riferiscono alla news creata e comprendono i dati aggiunti dal backend (identificativo, timestamp di creazione,...)
   -  **_updateNews(uuid, data)_**: passa UUID e oggetto da modificare;
      i dati ricevuti in caso di successo si riferiscono alla news modificata e comprendono i dati aggiunti dal backend (identificativo, timestamp di modifica,...)
   -  **_deleteNews(uuid)_**: passa UUID; riceve un boolean true in caso di successo: se il comando parte da icona su lista occorre cancellare la riga
   -  **_getNews(uuid)_**: passa UUID della news da recuperare: in caso di successo riceve i dati completi della news
   -  **_getListNews()_**: in caso di successo riceve ARRAY ti tutte le news
   -  **_getListNewsByTopic(topic)_**: in caso di successo riceve ARRAY ti tutte le news filtrate per topic (parametro)
   -  **_getListNewsByTag(tag)_**: in caso di successo riceve ARRAY ti tutte le news filtrate per tag (parametro)
   -  **_getListNewsByKeyword(key)_**: in caso di successo riceve ARRAY ti tutte le news filtrate per parola chiave (parametro)

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

***

##note per il team##
Di seguito sono riportate le aree di "proposta", una per ogni membro del team.
NON MODIFICARE MAI LE VOCI PROGETTO (sopra) ma editare la propria area inserendo le proposte: quando approvate
dal team verranno pubblicate nel progetto (sopra).
ATTENZIONE: ricordarsi di effettuare sempre un PULL prima di fare le proprie modifiche, seguite dal PUSH.

###Gian Paolo###
...

###Marcello###
...

###Paolo###
...
