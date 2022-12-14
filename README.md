<p align='center'>
  <img width='400' heigth='450' src='https://user-images.githubusercontent.com/62605744/171186764-43f7aae0-81a9-4b6e-b4ce-af963564eafb.png'>
</p>

# AI_project
The ultimate AI's project developed by Unixvalle members

## Authors
- Diego Chaverra
- David Alberto

# Instructions
Para poner el mapa debe irse al menu custom map y dar click sobre el boton "seleccionar archivo" luego darle al botón de ok una vez haya sido subida la prueba. Para probar los algoritmos de click sobre el botón circular con la flecha y eliga el algoritmo que desee poner a prueba con el ambiente que subió.

## Update 1.0
- se crea la interfaz gráfica para el juego de mario 
- se agregan efectos de sonido de fondo 
- se adiciona el archivo README.md para documentar las funcionalidades que se estén implementando

## Update 1.1
- mario es capaz de moverse solo, dado un array solución.

## Update 1.2
- el usuario del juego puede personalizar el mapa de juego, cargando el nuevo mapa en un archivo de texto.
- el panel de información del juego ha sido estructurado. Aún no se enlaza con js.

## Update 1.3
- Aparece menu cuando se acaba el juego (victoria).

## Update 1.4
- Se cambia la GUI del juego, para que aparezcan las estadisticas en la pantalla del final del juego.
- Se hace el algoritmo de Avara.
- Se corrige defecto para reconocer entradas que otorga el usuario en customMap.html.

## Update 1.5
- Se agregan efectos de sonido para los siguientes movimientos de Mario:
  - Matar a un koopa con la estrella.
  - Matar a un koopa con la flor.
- Cuando Mario posee una estrella, el sonido del ambiente cambia.
- Mario no puede poseer flores y estrellas a la vez.
- Mario es capaz de matar a bowser con una flor o estrella.
- Las flores y estrellas son acumulables.
- Mario se transforma en Super Star Mario o Fire Mario, para indicar si posee una flor o estrella.

## Update 1.6
- Se desarrolla el algoritmo A*.

## Update 1.7
- Se implementa el algorimo de profundidad evitando ciclos.

## Update 1.8
- Se corrige algoritmo de avara para evitar ciclos (comparar ambos mainAvara.js).

## Update 1.9
- Se mejora el sonido del ambiente, cada vez que mario tome una estrella, no va a reiniciarse la canción de Super Star Mario.
- Se implementa el algoritmo de amplitud. (hay que revisar las 2 alternativas en la siguiente sesión)
- Se añaden funciones a utils.js que son necesarias para todos los archivos de JavaScript, con el fin de mantener un mejor orden en la implementación de código.

## Update 2.0
- Se mejora la posición del menu desplegable para la elección del algoritmo a utilizar por parte del usuario.

## Update 2.1
- Se corrigen errores en algoritmos de costo y A*:
  - El arbol ahora se expande correctamente cuando Mario está en una casilla de distancia hacía la princesa.
  - Mario se puede devolver cuando tomé una estrella. Para ello se crea una funcionalidad que obliga a mario a revisar su entorno primero para ver si hay una estrella.

## Update 2.2
- Se corrigen errores de algunas pruebas de la IA:
  - pruebas 7,8,9,10,11

## Update 2.3
- Se corrigio el error de la pruebaX8 para los algoritmos A* y de costos. Ahora Mario no matará Koopas si no tiene power ups.

## Update 2.4
- Se implementa la misma correccion para los algoritmos restantes.