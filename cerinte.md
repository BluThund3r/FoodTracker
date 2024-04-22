## Obligatoriu pentru nota 5

- [ ] Implementarea operațiilor CRUD (create, read, update, delete) pentru cel puțin 3
      entități care au o relatie intre ele (e.g. entitatea User și entitatea Post au o relatie de
      one-to-many, adica un user are mai multe postari)
- [x] Salvarea datelor intr-o baza de date (+ folosire de ORM)
- [ ] Rute private si rute publice
  - Pentru rute private este nevoie de autentificare, cel mai simplu ar fi cu JWT
  - Implicit trebuie o metoda de signup și signin pentru a face rost de un JWT
- [ ] Error handling
- [ ] Middleware care valideaza payload/parametrii request-ului
- [ ] Explicați unul sau mai multe flow-uri prin care un potential client (e.g. o aplicatie web)
      ar trece pentru a folosi aplicația
  - E.g: Aplicatie de retete: Userul se inregistreaza în aplicație, după care poate
    vedea rețetele altor utilizatori, poate sa voteze și să lase comentarii.

## Optional (pana la 10)

- [ ] Cel putin 4 unit tests (**1 punct**) 🟢
- [ ] Operatii CRUD mai avansate, de ales dintre (**maxim 2 puncte**):
  - [ ] Filtrare + Sortare (**1 punct**) 🟢
  - [ ] Paginare (**1 punct**) 🟢
  - [ ] Tranzactie unde se insereaza / updateaza mai multe entitati interdependente (**1 punct**)
- [ ] Implementarea si folosirea unor custom middlewares (**0.5 puncte per middleware, maxim 1 punct**)
  - Implementarea și folosirea implica sa faceți voi unul de la 0, nu sa folositi middlewares gata făcute din alte librării
- [ ] Autentificare avansata (**1 punct**) la alegere:
  - [ ] Role based authentication 🟢
  - [ ] Integrare cu OAuth
- [ ] Documentatie (**1 punct**) 🟢
  - [ ] README complet, descrierea aplicației, pașii de setup explicarea env variables
  - [ ] Diagrama bazei de date
  - [ ] Documentarea API-ului (e.g. puteti folosi Swagger)
- [ ] Flow Chart Diagram (**0.5 puncte**) - diagrama care sa arate principalele flow-uri prin care API-ul va fi folosit de catre un client
- [ ] Image upload (**1 punct**)
  - Multipart/Form-Data sau binary data
  - Salvarea unei referințe a imaginii în baza de date
- [ ] Cloud deploy (**0.5 puncte**)
  - Deploy al aplicatiei (Node.JS + baza de date) pe orice serviciu cloud (e.g. Heroku, AWS, Azure, Vercel, etc.)

#### Aplicația se va prezenta unuia dintre cei doi profesori în sesiune; ar fi indicat sa pregatiti in Postman request uri, sa aveți un database viewer prin care sa ne arătați cum se modifica datele in baza de date, și alte tools care sa demonstreze cat mai ușor și rapid corectitudinea cerințelor rezolvate.
