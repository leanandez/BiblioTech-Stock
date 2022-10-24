//Constructor de libros
class Libro {
    constructor(cantidad, id, titulo, autor, editorial, precio) {
        this.cantidad = cantidad
        this.id = Number(id)
        this.titulo = titulo
        this.autor = autor
        this.editorial = editorial
        this.precio = Number(precio)
    }

}

//Constructor de reservas
class Reserva {
    constructor(id, cliente, libro) {
        this.id = id
        this.cliente = cliente
        this.libro = libro
    }
}

//Libros ya guardados
const libro1 = new Libro(4, 1, "FICCIONES", "JORGE LUIS BORGES", "BARCELONA", 2000)
const libro2 = new Libro(1, 2, "LOS PREMIOS", "JULIO CORTAZAR", "PUNTO DE LECTURA", 1900)
const libro3 = new Libro(2, 3, "HISTORIA DEL LLANTO", "ALAN PAULS", "ANAGRAMA", 2500)
const libro4 = new Libro(2, 4, "EL ALEPH", "JORGE LUIS BORGES", "ANAGRAMA", 2500)


// Arrays donde irán los objetos
let librosEnStock = []
let librosEnReserva = []

//Ingreso libros al array librosEnStock
librosEnStock.push(libro1, libro2, libro3, libro4)


//Funcion para agregar a librosEnStock todo lo que haya quedado almacenado en el localStorage, de sesiones anteriores

for (let i = 0; i < localStorage.length; i++) {
    let clave = localStorage.key(i)
    //Agrego reservas al array librosEnReserva
    if (isNaN(clave)) {
        let reservaEnStorage = JSON.parse(localStorage.getItem(clave))
        let nuevaReserva = new Reserva(reservaEnStorage.id, reservaEnStorage.cliente, reservaEnStorage.libro)
        if (librosEnReserva.find(resultado => resultado.cliente == nuevaReserva.cliente)) {} else {
            librosEnReserva.push(nuevaReserva)

        }
        //Agrego libros al array librosEnStock
    } else {
        let libroEnStorage = JSON.parse(localStorage.getItem(clave))
        let nuevoLibro = new Libro(libroEnStorage.cantidad, libroEnStorage.id, libroEnStorage.titulo, libroEnStorage.autor, libroEnStorage.editorial, libroEnStorage.precio)

        if (librosEnStock.find(resultado => resultado.id == nuevoLibro.id)) {} else {
            librosEnStock.push(nuevoLibro)

        }

    }

}
console.log(librosEnReserva)
console.log(librosEnStock)





//Funcion para enviar los libros en Stock al localStorage
function convertirEnJSON(array) {
    for (let i = 0; i < array.length; i++) {
        localStorage.setItem(array[i].id, JSON.stringify(array[i]))
    }
}

convertirEnJSON(librosEnStock)




// Defino el DOM

let comienzoChiste = document.getElementById("comienzoChiste")
let remateChiste = document.getElementById("remateChiste")
let divCabeceraMostrar = document.getElementById("cabeceraMostrar")
let divMostrarBusqueda = document.getElementById("mostrarBusqueda")
let formBusqueda = document.getElementById("formBusqueda")

let modalContainer = document.getElementById("modalContainer")
let btnCerrar = document.getElementById("btnCerrar")
let formReservar = document.getElementById("formReservar")
let icliente = formReservar.children[1].value;
let icantidadReserva = formReservar.children[3].value;
let divMostrarReserva = document.getElementById("mostrarReserva")
let btnSubmitReservar = document.getElementById("btnSubmitReservar")
let formBusquedaReserva = document.getElementById("formBusquedaReserva")



let form = document.getElementById("form")
let ititulo = form.children[1].value;
let iautor = form.children[3].value;
let ieditorial = form.children[5].value;
let iprecio = form.children[7].value;
let icantidad = form.children[9].value




// Asigno eventos al DOM

btnMostrarLibros.onclick = mostrarTodosLosLibros

form.addEventListener("submit", guardarLibro)

formBusqueda.addEventListener("submit", buscarLibro)

btnCerrar.addEventListener("click", () => {
    modalContainer.classList.remove("show")
    location.reload()
})

btnSubmitReservar.addEventListener("click", guardarReserva)

formBusquedaReserva.addEventListener("submit", mostrarReserva)





//Funcion para GUARDAR LIBRO en stock

function guardarLibro(e) {
    e.preventDefault()
    swal({
        title: "¿Estas seguro de agregar el libro al stock?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((aceptar) => {
        if (aceptar) {
            swal("El libro se agregó al stock", {
                icon: "success",
            })
            let datos = e.target
            iautor = form.children[3].value;
            ititulo = form.children[1].value;
            ieditorial = form.children[5].value;
            iprecio = form.children[7].value;
            icantidad = form.children[9].value;
            //funcion asignadora de ID
            let ultimoId = Math.max(...librosEnStock.map(dato => dato.id))
            id = ultimoId + 1
            //Pusheo libro al array y guardo en Storage
            let nuevoLibro = new Libro(icantidad, id, ititulo.toUpperCase(), iautor.toUpperCase(), ieditorial.toUpperCase(), iprecio)
            librosEnStock.push(nuevoLibro)
            localStorage.setItem(id, JSON.stringify(nuevoLibro))
            //Imprimo en el DOM
            datos.children[1].value = "";
            datos.children[3].value = "";
            datos.children[5].value = "";
            datos.children[7].value = "";
            datos.children[9].value = "";

            mostrarUltimoLibro.innerHTML = ""

            mostrarUltimoLibro()
        } else {
            swal("El libro no se agregó", {
                icon: "error",
            })
        }
    })

}





//Funcion MOSTRAR TODOS LOS LIBROS
function mostrarTodosLosLibros() {
    divCabeceraMostrar.innerHTML = `<h2> Los libros en Stock son:</h2>`
    divMostrarBusqueda.innerHTML = ``
    for (const iterator of librosEnStock) {
        divMostrarBusqueda.innerHTML +=
            `<div class="tarjetas">
             <p><b>ID</b>: ${iterator.id}</p>
             <p><b>Titulo</b>: ${iterator.titulo}</p>
             <p><b>Autor</b>:: ${iterator.autor}</p>
             <p><b>Editorial</b>: ${iterator.editorial}</p>
             <p><b>Precio</b>: ${iterator.precio}</p> 
             <p><b>En stock:</b> ${iterator.cantidad}</p> 
             <button type="submit" id="${iterator.id}" onclick= "quitarLibro(this)" class="btn  btn-danger">Quitar libro</button>
             <button type="submit" id="${iterator.id}" onclick= "reservarLibro(this)" class="btn  btn-success">Reservar libro</button>
             <button type="submit" id="${iterator.id}" onclick= "venderLibro(this)"
             class="btn  btn-light">Vender libro</button>
             </div>
             `
    }

}


//Funcion MOSTRAR ULTIMO LIBRO GUARDADO
function mostrarUltimoLibro() {
    divCabeceraMostrar.innerHTML = `<h2> El último libro ingresado es:</h2>`
    divMostrarBusqueda.innerHTML =
        `<div class="tarjetas">
        <p><b>ID:</b> ${id}</p>
        <p><b>Titulo:</b> ${ititulo.toUpperCase()}</p>
        <p><b>Autor:</b> ${iautor.toUpperCase()}</p>
        <p><b>Editorial:</b> ${ieditorial.toUpperCase()}</p>
        <p><b>Precio:</b> ${iprecio}</p>
        <p><b>En Stock:</b> ${icantidad}</p>
        </div>`
}



//Funciones para RESERVAR LIBRO

let librosReservados = []

//Funcion para DESPLEGAR el Popup con libro reservado e ingresar nombre del cliente
function reservarLibro(comp) {
    let id = comp.id
    let libro = librosEnStock.find(resultado => resultado.id == id)
    librosReservados.push(libro)
    if (librosReservados[0].cantidad == 0) {
        swal("No hay mas STOCK de ese título")
    } else {
        modalContainer.classList.add("show")
        divMostrarReserva.innerHTML =
            `<p>${libro.id} - ${libro.titulo}. ${libro.autor}. ${libro.editorial}. $${libro.precio}`
    }
}



//Funcion para GUARDAR RESERVA en LocalStorage 
function guardarReserva(e) {
    e.preventDefault()
    swal({
        title: "¿Estas seguro de RESERVAR el libro del stock?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((aceptar) => {
        if (aceptar) {
            swal("El libro se RESERVÓ del stock", {
                icon: "success",
            })
            let datos = e.target
            icliente = formReservar.children[1].value
            icantidadReserva = formReservar.children[3].value
            //Enviar reserva al LocalStorage y asignarle ID correspondiente
            if (icantidadReserva > librosReservados[0].cantidad) {
                swal("No hay suficientes unidades para completar este pedido")
            } else {
                if (librosEnReserva.map(dato => dato.id) == "") {
                    let id = 0
                    localStorage.setItem("Reserva" + id, JSON.stringify(new Reserva(id, icliente, new Libro(icantidadReserva, librosReservados[0].id, librosReservados[0].titulo, librosReservados[0].autor, librosReservados[0].editorial, librosReservados[0].precio))))
                } else {
                    let ultimoId = Math.max(...librosEnReserva.map(dato => dato.id))
                    id = ultimoId + 1
                    localStorage.setItem("Reserva" + id, JSON.stringify(new Reserva(id, icliente, new Libro(icantidadReserva, librosReservados[0].id, librosReservados[0].titulo, librosReservados[0].autor, librosReservados[0].editorial, librosReservados[0].precio))))
                }
                //Iterador para quitar del LocalStorage y del Stock la cantidad de libro reservado
                for (const iterator of librosEnStock) {
                    if (librosReservados[0].titulo == iterator.titulo) {

                        //Sobreescribo el id-Libro con la nueva cantidad en Stock (restandole la reservada por el cliente)
                        localStorage.setItem(librosReservados[0].id, JSON.stringify(new Libro(librosReservados[0].cantidad - icantidadReserva, librosReservados[0].id, librosReservados[0].titulo, librosReservados[0].autor, librosReservados[0].editorial, librosReservados[0].precio)))
                    }


                }
            }

        } else {
            swal("El libro no se reservó", {
                icon: "error",
            })
            location.reload()
        }
    })


}


// Funcion para MOSTRAR RESERVAS
function mostrarReserva(e) {
    e.preventDefault();
    let datos = e.target
    let ireserva = datos.children[0].value
    let busquedaReserva = librosEnReserva.filter(resultado => resultado.libro.titulo.includes(ireserva) || resultado.libro.autor.includes(ireserva) || resultado.id == ireserva)
    busquedaReserva.length === 0 && swal("Ese libro no está en RESERVAS")
    divCabeceraMostrar.innerHTML = `<h2>La/las RESERVAS que estás buscando:</h2>`
    divMostrarBusqueda.innerHTML = ``
    for (const iterator of busquedaReserva) {
        divMostrarBusqueda.innerHTML +=
            `<div class="tarjetas">
    <div class="cabeceraReservas">
    <p><b>ID RESERVA:</b> ${iterator.id}</p>
    <p><b>CLIENTE:</b> ${iterator.cliente}</p>
    </div>
    <p><b>ID</b>: ${iterator.libro.id}</p>
    <p><b>Titulo</b>: ${iterator.libro.titulo}</p>
    <p><b>Autor</b>:: ${iterator.libro.autor}</p>
    <p><b>Editorial</b>: ${iterator.libro.editorial}</p>
    <p><b>Precio</b>: ${iterator.libro.precio}</p> 
    <p><b>Cantidad</b>: ${iterator.libro.cantidad}</p>
    <button type="submit" id="${iterator.id}" onclick= "cancelarReserva(this)" class="btn btn-danger">Cancelar reserva</button>
    <button type="submit" id="${iterator.id}" onclick= "venderReserva(this)" class="btn btn-light">Vender reserva</button>
    </div>
    `
    }


}

//Aca hay que agregar un if, por si cuando se cancela la reserva, su libro fue quitado

//Funcion para CANCELAR RESERVA
function cancelarReserva(comp) {
    let id = comp.id
    let reservaDevuelta = librosEnReserva.filter(res => res.id == id)
    let idLibroDevuelto = reservaDevuelta[0].libro.id
    let nuevoLibro = new Libro(reservaDevuelta[0].libro.cantidad, reservaDevuelta[0].libro.id, reservaDevuelta[0].libro.titulo, reservaDevuelta[0].libro.autor, reservaDevuelta[0].libro.editorial, reservaDevuelta[0].libro.precio)
    // Aplico un IF para contemplar el caso de que se haya QUITADO del stock el libro al que corresponde la reserva, en cuyo caso, lo vuelvo a crear si cancelo la reserva    
    if (librosEnStock.find(res => res.id == reservaDevuelta[0].libro.id) == undefined) {
        swal({
            title: "¿Estas seguro de CANCELAR la RESERVA?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((aceptar) => {
            if (aceptar) {
                swal("La reserva se CANCELÓ", {
                    icon: "success",
                })

                librosEnStock.push(nuevoLibro)
                localStorage.setItem(idLibroDevuelto, JSON.stringify(nuevoLibro))
                localStorage.removeItem("Reserva" + id)
            }
        })

    } else {
        //Accedo a la cantidad en Stock del libro que fue reservado, y la denonimo cantidadEnStock
        let cantidadEnStock = Number(librosEnStock.find(res => res.id == reservaDevuelta[0].libro.id).cantidad)
        // Denomino nuevaCantidad a la suma de la cantidadEnStock y la cantidad reservada del Libro
        let nuevaCantidad = cantidadEnStock + Number(reservaDevuelta[0].libro.cantidad)
        swal({
            title: "¿Estas seguro de CANCELAR la RESERVA?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((aceptar) => {
            if (aceptar) {
                swal("La reserva se CANCELÓ", {
                    icon: "success",
                })


                //Quito RESERVA del LocalStorage
                localStorage.removeItem("Reserva" + id)

                //Vuelvo a meter el libro en el localStorage, sobreescribiendo el IDLibro con la nueva cantidad en Stock (suma de cantidadenStock y cantidad devuelta)
                localStorage.setItem(idLibroDevuelto, JSON.stringify(new Libro(nuevaCantidad, nuevoLibro.id, nuevoLibro.titulo, nuevoLibro.autor, nuevoLibro.editorial, nuevoLibro.precio)))

                location.reload()

            }

        })
    }
}




//Funcion para VENDER RESERVA
function venderReserva(comp) {
    id = comp.id
    swal({
        title: "¿Estas seguro de VENDER la reserva?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((aceptar) => {
        if (aceptar) {
            swal("La reserva fue VENDIDA", {
                icon: "success",
            })
            //Quito libro y reserva del Storage y del array librosEnReserva
            librosEnReserva = librosEnReserva.filter(res => res.id != id)
            localStorage.removeItem("Reserva" + id)

        }
    })

}



//Funcion para QUITAR LIBRO
function quitarLibro(comp) {
    let id = comp.id
    swal({
        title: "¿Estas seguro de QUITAR el libro del stock?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((aceptar) => {
        if (aceptar) {
            swal("El libro se quitó del stock", {
                icon: "success",
            })
            for (const iterator of librosEnStock) {
                if (id == iterator.id) {
                    localStorage.removeItem(iterator.id)
                    librosEnStock = librosEnStock.filter(resultado => resultado.id != iterator.id)
                    divCabeceraMostrar.innerHTML = `<h2>El/los libros que estás buscando:</h2>`
                    divMostrarBusqueda.innerHTML = ``
                    for (const iterator of librosEnStock) {
                        divMostrarBusqueda.innerHTML +=
                            `<div class="tarjetas">
                <p><b>ID</b>: ${iterator.id}</p>
                <p><b>Titulo</b>: ${iterator.titulo}</p>
                <p><b>Autor</b>:: ${iterator.autor}</p>
                <p><b>Editorial</b>: ${iterator.editorial}</p>
                <p><b>Precio</b>: ${iterator.precio}</p> 
                <button type="submit" id="${iterator.id}" onclick= "quitarLibro(this)" class="btn btn-danger">Quitar libro</button>
                <button type="submit" id="${iterator.id}" onclick= "reservarLibro(this)" class="btn btn-success">Reservar libro</button>
                </div>
                `
                    }

                }
            }
            console.log(librosEnStock)
        } else {
            swal("El libro no se quitó", {
                icon: "error",
            })

        }
    })
}




// Funcion para VENDER LIBRO
function venderLibro(comp) {
    id = comp.id
    let libroVendido = librosEnStock.filter(res => res.id == id)
    let nuevaCantidad = Number(libroVendido[0].cantidad - 1)

    swal({
        title: "¿Estas seguro de VENDER UNA UNIDAD del libro?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((aceptar) => {
        if (aceptar) {
            swal("El libro fue VENDIDO", {
                icon: "success",
            })

            if (libroVendido[0].cantidad == 0) {
                swal({
                    title: "No podes venderlo porque NO HAY MAS UNIDADES de este libro",
                    icon: "warning"
                })
            } else {
                //Meto libro en localStorage con la cantidad reducida en 1
                localStorage.setItem(id, JSON.stringify(new Libro(nuevaCantidad, libroVendido[0].id, libroVendido[0].titulo, libroVendido[0].autor, libroVendido[0].editorial, libroVendido[0].precio)))
            }

        }
    })

}


// Funcion para BUSCAR LIBRO 
function buscarLibro(e) {
    e.preventDefault()
    let datos = e.target
    let ibusqueda = datos.children[0].value
    let busqueda = librosEnStock.filter(resultado => resultado.titulo.includes(ibusqueda) || resultado.autor.includes(ibusqueda) || resultado.id == ibusqueda)
    busqueda.length === 0 && swal("Ese libro no está en Stock")
    divCabeceraMostrar.innerHTML = `<h2>El/los libros que estás buscando:</h2>`
    divMostrarBusqueda.innerHTML = ``
    for (const iterator of busqueda) {
        divMostrarBusqueda.innerHTML +=
            `<div class="tarjetas">
             <p><b>ID</b>: ${iterator.id}</p>
             <p><b>Titulo</b>: ${iterator.titulo}</p>
             <p><b>Autor</b>: ${iterator.autor}</p>
             <p><b>Editorial</b>: ${iterator.editorial}</p>
             <p><b>Precio</b>: ${iterator.precio}</p> 
             <p><b>En Stock:</b> ${iterator.cantidad}</p> 
             <button type="submit" id="${iterator.id}" onclick= "quitarLibro(this)" class="btn          btn-danger">Quitar libro</button>
             <button type="submit" id="${iterator.id}" onclick= "reservarLibro(this)" class="btn          btn-success">Reservar libro</button>
             <button type="submit" id="${iterator.id}" onclick= "venderLibro(this)"
             class="btn  btn-light">Vender libro</button>
             </div>
             `
    }


}






//API de Chistes

async function localizacion() {
    const resp = await
    fetch("https://v2.jokeapi.dev/joke/Programming?lang=es&type=twopart")
    const data = await resp.json()
    comienzoChiste.innerHTML = `<b>Chiste del día:</b> ${data.setup} (Ver remate en el footer)`
    remateChiste.innerHTML = `${data.delivery}`

}

localizacion()