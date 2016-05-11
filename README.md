#Mobile UI

##Piattaforma
Questa applicazione integra una piattaforma applicativa progettata e implementata
per lo sviluppo della componente front-end (FE) di applicazioni estremamente scalabili, basate su
**_microservizi_** e funzionalità **_real time_**.
L'implementazione della componente _microservizi_ lato back-end (BE) è basata sulle specifiche OSGi:
l'interfacciamento con il front-end è generalmente limitato all'uso di API di tipo RESTful.
La componente _real time_ è basata sull'integrazione del broker (BR) ActiveMQ con interfacciamento
basato sul protocollo MQTT tanto nella relazione **front-end**/**broker** quanto
nella relazione **back-end**/**broker**.

Le dinamiche applicative della componente front-end possono essere così riassunte:
- FE -> BE -> FE
- FE <-> BR
- FE -> BE -> BR -> FE
... continua ...


