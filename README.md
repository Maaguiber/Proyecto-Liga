# proyecto-Liga
Api que permite agregar o buscar jugadores en una base de datos.
 
curl -X POST http://localhost:3000/jugadores \
  -H "Content-Type: application/json" \
  -d '{
        "nombre": "Lionel",
        "apellido": "Messi",
        "fecha_nacimiento": "1987-06-24",
        "clubId": 1
      }'

      curl -X PUT http://localhost:3000/jugadores/3 \
  -H "Content-Type: application/json" \
  -d '{
        "nombre": "Carlos",
        "apellido": "Tevez",
        "club_id": 2
      }'




