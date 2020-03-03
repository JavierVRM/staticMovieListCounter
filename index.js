console.log('hello there')
// Variables globales 
let newList = []
let finalList = []
let assemblerFlag = false;
let assemblerData;
let sortBy = 'points';

// Funcion General que maneja el funcionamiento de la 'aplicación'
function manageResponse () {
    // Identificamos el input donde entrarán las nuevas listas 
    let newListInput = document.getElementById("newList")
    // Si la longitud de su valor es mayor que 1 (esto para evitar clicks en listas vacías):
    if (newListInput.value.length > 1) {
        // Guardamos el valor del input tras separarlo por el salto de línea (/n) y pasarlo a un array (.split)
        let newListToArray = newListInput.value.split("\n")
        // 1) Llamamos a la función 'newListSetter' y le pasamos el array que acabamos de almacenar
        newListSetter(newListToArray)
        // 2) Llamamos a la función 'finalListSetter'
        finalListSetter()
        // 3) Llamamos a la función 'finalListSorter'
        finalListSorter()

        // Reseteamos valores. 
        newList = [];
        newListInput.value = "";
        // La lista final se inicializa como array vacío ([]). Más adelante se le añade otro array, el de la nueva lista, resultando un array de 2 dimensiones ([[]]) que no queremos. Usamos el flat para arreglarlo
        finalList = finalList.flat()
        // 4) Llamamos a la función 'finalListPrinter'
        finalListPrinter();
    // Si la longitud de su valor es menor que 1 (es una lista vacía o con un espacio/caracter), retornamos:
    } else {
        return
    }
}

function removeBorder (cell) {
    cell.style.border = '1px solid white'
}
// 1) Funcion que controla el seteo de la nueva lista
function newListSetter (newListToArray) {
    // Limpiamos la lista de títulos vacíos y nulos
    newListToArray = newListToArray.filter(element => element)
    // Limpiamos la lista de posibles elementos repetidos
    newListToArray = [...new Set(newListToArray)]
    // Recorremos todos los títulos de la nueva lista
    for (let i = 0; i < newListToArray.length; i++) {
        // 1.1) Llamamos a la función 'newListCleaner' pasándole el título pertinente. Almacenamos su respuesta
        let cleanTitle = newListCleaner(newListToArray[i])
        // Añadimos los siguientes valores a la variable global ('newList') que representará la solicitud de películas a añadir en la lista general 
        newList.push({
            // El título 
            title: cleanTitle,
            // La puntuación. Se puntúa de manera automática por posición
            value: (newListToArray.length - i),
            // Los títulos alternativos. De momento, un array vacío
            alternativeTitle: []
        })
    }
}

// 1.1) Función que controla la limpieza de los títulos de la nueva lista
function newListCleaner (item) {
    // Pasamos el título a minúsuclas (para standarizar todos los títulos y evitar problemas)
    item = item.toLowerCase()
    // Buscamos el índice donde empieza el título (para limpiar números, guiones, etc..) 
    let indexOfTitle = item.search(/[a-zA-Z]/)
    // Limpiamos el título eliminando todo lo que preceda al índice anteriormente determinado
    item = item.slice(indexOfTitle)
    // Buscamos el índice de los números encerrados entre paréntesis (para limpiar fechas)
    let indexOfDate = item.search(/\([0-9]+\)/)
    // Limpiamos el título eliminando todo lo que sigue al índice anteriormente determinado, si es que este existe
    if(indexOfDate !== -1) {
        item = item.slice(0, indexOfDate)
    }
    // Limpiamos posibles caracteres vacios del inicio y el final del título
    item = item.trim()
    // Devolvemos el título de la película ya limpio, con la primera letra en mayúsculas
    return item.charAt(0).toUpperCase() + item.slice(1);
}

// 2) Función que setea el listado final
function finalListSetter () {
    // Si la variable global 'finalList' contiene algún elemento:
    if (finalList.length) {
        // Recorremos los elementos de la nueva lista que queremos incluir en la lista final
        for (let i = 0; i < newList.length; i++) {
            // Recorremos los elementos de la lista final 
            for (finalElement of finalList) {
                // Si algún título coincidiese (ya existiera en la lista final), sumamos sus puntos y le añadimos un estado.
                if (finalElement.title === newList[i].title) {
                    finalElement.value += newList[i].value
                    newList[i].status = 'checked'
                // Si 'alternativeTitle' tuviera algún dato actuamos de la misma manera. Solo que en este caso el 'alternativeTitle' sería una lista de títulos, así que habría todos sus elementos. 
                } else if (finalElement.alternativeTitle.length) {
                    for (title of finalElement.alternativeTitle) {
                        if (title === newList[i].title) {
                            finalElement.value += newList[i].value
                            newList[i].status = 'checked'
                        }
                    }
                }
            } 
            // Si al elemento de la nueva lista no se le ha añadido un estado, querrá decir que no existe en la lista final. Así pues, se añade completo.
            if (!newList[i].status) {
                finalList.push(newList[i])
            }
        } 
    // Si la variable global 'finalList' está vacía, simplemente añadimos la nueva lista en su totalidad(sería la primera lista en ser añadida)
    } else {
        finalList.push(newList)
    }
}

// Función que determina el criterio del orden de la lista final
function sortCriteria(e) {
    // Asociamos a la variable global 'sortBy' un valor, en función del botón pulsado
    if (e.target.id === 'sort-bypoints') {
        sortBy = 'points'
    }
    if (e.target.id === 'sort-byname') {
        sortBy = 'name'
    }
    // 3) Llamamos a la función 'finalListSorter'
    finalListSorter()
    // 4) Llamamos a la función 'finalListPrinter'
    finalListPrinter()
}

// 3) Función que ordena el listado final
function finalListSorter() {
    let byPoints = document.getElementById("sort-bypoints")
    let byName = document.getElementById("sort-byname")
    // Editamos la estética de los botones y ordenamos la lista en función de lo que nos dicte la variable global 'sortBy' (definida en 'sortCriteria')
    if (sortBy === 'points') {
        byName.classList.remove('active')
        finalList.sort((a, b) => b.value - a.value)
        byPoints.classList.add('active')
    }
    if (sortBy === 'name') {
        byPoints.classList.remove('active')
        finalList.sort((a, b) => a.title.localeCompare(b.title))
        byName.classList.add('active')
    }
}

// 4) Función que pinta el listado final
function finalListPrinter () {
    // Identificamos el nodo padre en el que insertarán los elementos de la lista
    let listFather = document.getElementById("responseList")
    // Borramos los nodos hijos (esto es una ñapa, no pasa res)
    while (listFather.firstChild) {
        listFather.firstChild.remove();
    }
    // Recorremos la lista final, y por cada elemento:
    for (let i = 0; i < finalList.length; i++) {
        // Creamos un 'list item' 
        let listItem = document.createElement('li')
        // Creamos el texto que contendrá
        let listText = document.createTextNode(`${finalList[i].title}`)
        let listNumber = document.createTextNode(`: ${finalList[i].value}`)
        // Le añadimos un id único a cada elemento
        listItem.setAttribute('id', `listItem${i}`)
        // Añadimos el texto al hijo, le asociamos un evento (4.1), y por último añadimos el hijo (ya completo) al padre
        listItem.appendChild(listText)
        listItem.appendChild(listNumber)
        // 4.1)
        listItem.addEventListener('click', assembler)
        //listItem.appendChild(buttonItem)
        listFather.appendChild(listItem)
    }
}

// 4.1) Función que aplica la mezcla de elementos de la lista. Existen elementos que estarán mal escritos o son traducciones, esta función
// hace que podamos mezclarlos añadiendo títulos alternativos al elemento correcto, para su futura detección.
function assembler (e) {
    // Identificamos el elemento clickado
    let target = e.target
    // Almacenamos sus datos (título y valor)
    let targetTitle = target.firstChild.data
    let targetValue = target.lastChild.data
    // Limpiamos el valor, ya que nos llega precedido de ':'
    targetValue = targetValue.slice(targetValue.search(/[0-9]/))
    // Si la variable global 'assemblerFlag' es false (si es el primer elemento sobre el que pinchamos):
    if (!assemblerFlag) {
        // El valor de la variable global assemblerData será el del (primer) elemento clickado
        assemblerData = {
            title: targetTitle,
            value: targetValue,
            target: target
        }
        target.style.color = '#00b020'
        // Pasamos el flag a true. Esta parte del flag sirve para identifar cuándo clickamos por primera vez en un elemento, o por segunda.
        assemblerFlag = true;
    // Si la variable global 'assemblerFlag' es true (si es el segundo elemento sobre el que pinchamos):
    } else {
        // Controlamos que no se haya clickeado 2 veces sobre el mismo elemento
        if (assemblerData.title !== targetTitle) {
            let message = `Estás seguro de querer fusionar '${assemblerData.title}' con '${targetTitle}'??. Recuerda que el título a conservar será '${assemblerData.title}'`
            let confirmation = window.confirm(message)
            // Controlamos que el usuario nos confirme la acción
            if (confirmation) {
                // Añadimos la clave 'alternativeTitle', que inicializamos como un array vaío
                assemblerData.alternativeTitle = []
                // Añadimos a los títulos alternativos del primer elemento clickado el título del segundo elemento clickado
                assemblerData.alternativeTitle.push(targetTitle)
                // Pasamos los valor de ambos elementos a números
                assemblerData.value = Number(assemblerData.value)
                targetValue = Number(targetValue)
                // Los sumamos
                assemblerData.value += targetValue
                // 4.1.1) Llamamos a la función 'assembleTofinalList' pasándole los datos de los elementos montados (assemblerData)
                assembleTofinalList(assemblerData)
                // 4.1.2) Llamamos a la función 'removeAssembledElement' pasándole el título del elemento clickado en segundo lugar (targetTitle)
                removeAssembledElement(targetTitle)
                // 3) Llamamos a la función 'finalListSorter'
                finalListSorter()
                // 4) Llamamos a la función 'finalListPrinter'
                finalListPrinter()
            // Si el usuario cancela, dejamos todo como estaba.
            } else {
                assemblerData.target.style.color = "#abc"
                assemblerFlag = false;
            }
            
        // Si hemos clickeado dos veces sobre el mismo elemento, le devolvemos su color original
        } else {
            target.style.color = '#abc'
        }
        // Pasamos el flag a false.
        assemblerFlag = false;
    }

}


// 4.1.1 Función que gestiona la asociación de los datos de los elementos montados con el elemento original
function assembleTofinalList (data) {
    // Recorremos la lista final
    for (finalElement of finalList) {
        // Selecionamos el que pinchamos en primer lugar (el que tenga su título)
        if (finalElement.title === data.title) {
            // Añadimos los títulos alternativos
            finalElement.alternativeTitle.push(data.alternativeTitle) 
            // Aplanamos el array
            finalElement.alternativeTitle = finalElement.alternativeTitle.flat()
            // Seteamos el valor 
            finalElement.value = data.value
            // Salimos del bucle en cuanto tengamos un elemento (no hay más)
            break
        }
    }
}

// 4.1.2 Función que elimina de la lista final el elemento pasado
function removeAssembledElement (title) {
    // Filtramos la lista final por el título. Nos quedamos con los elementos que no coincidan con el que hemos pasado
    finalList = finalList.filter(finalElement => finalElement.title !== title)
}
