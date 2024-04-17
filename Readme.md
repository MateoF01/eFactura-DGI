### Anotaciones

El xml que se envia a la solicitud esta formado por el sobre que contiene los CFEs con sus diferentes datos, al final tiene appendiado el xml del CAE. Creo que se podria hacer ese append directamente sin tener que extraer toda la informacion.

Lo que se podria agregar al final del xmlData directamente es el header de SIGNATURE del cae, con todo lo que contiene. Y lo que hay antes habría que extraerlo y ponerlo a mano porque no tiene la misma estructura.

