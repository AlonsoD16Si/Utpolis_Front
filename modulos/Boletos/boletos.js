let peliculas = [
];

let asientos = [{ id_asiento: 1, nombre: "A1", estatus: "Libre" }, { id_asiento: 2, nombre: "A2", estatus: "Ocupado" }, { id_asiento: 3, nombre: "A3", estatus: "Libre" }, { id_asiento: 4, nombre: "A4", estatus: "Libre" },
{ id_asiento: 5, nombre: "B1", estatus: "Libre" }, { id_asiento: 6, nombre: "B2", estatus: "Libre" }, { id_asiento: 7, nombre: "B3", estatus: "Ocupado" }, { id_asiento: 8, nombre: "B4", estatus: "Libre" },
{ id_asiento: 9, nombre: "B5", estatus: "Libre" }, { id_asiento: 10, nombre: "B6", estatus: "Libre" }, { id_asiento: 11, nombre: "B7", estatus: "Libre" }, { id_asiento: 12, nombre: "B8", estatus: "Libre" },
{ id_asiento: 13, nombre: "C1", estatus: "Ocupado" }, { id_asiento: 14, nombre: "C2", estatus: "Ocupado" }, { id_asiento: 15, nombre: "C3", estatus: "Ocupado" }
];

let cantidad_boletos;
let descuento_texto;
let cantidad_total_seleccion;
let descuentos;
let total_pagar;

function cargarBoletosInicio() {
    cantidad_boletos = document.getElementById("cantidad_boletos");
    descuento_texto = document.getElementById("descuento_texto");

    cantidad_boletos.addEventListener("input", verificarCantidadAsientos);
    descuento_texto.addEventListener("input", verificarDescuento);

    listenerSeleccionPelicula();
    consultarPeliculas();
    consultaDescuentos();
}

function cargarPeliculas() {
    let carusel = document.getElementById("slides_carusel");
    carusel.innerHTML = "";

    peliculas.forEach((peli, index) => {
        carusel.innerHTML += `
            <div class="carousel-item ${index === 0 ? "active" : ""}" id="${peli.pelicula_id}">
                <div class="d-flex justify-content-center">
                    <div class="card shadow-sm">
                        <div class="card-body" style="padding-top: 0px; padding-left: 0px;">
                            <div class="row">
                                <div class="col-md-4">
                                    <img src="${peli.imagen}" class="imagen-boleto">
                                </div>
                                <div class="col-md-8" style="padding-top: 10px;">
                                    <h4 class="card-title" style="user-select: none;">
                                        ${peli.nombre}
                                    </h4>
                                    <h5><span class="pelicula">${peli.clasificacion}</span> <span class="duracion">${peli.duracion}</span></h5>
                                    <span class="card-text" style="user-select: none;">
                                        ${peli.sinopsis}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}


function listenerSeleccionPelicula() {
    let carousel_disponibles = document.getElementById('carusel_disponibles');
    let card_asientos = document.getElementById("asientos");

    carousel_disponibles.addEventListener('slid.bs.carousel', () => {
        card_asientos.innerHTML = "";
    });
}

function cargarHorarios() {
    let card_horarios = document.getElementById("horarios");
    let carusel = document.getElementById("slides_carusel");
    let item_activo = carusel.querySelector('.carousel-item.active');
    let pelicula_id_seleccionada = parseInt(item_activo.id);

    card_horarios.innerHTML = "";

    peliculas.forEach((peli) => {
        if (peli.pelicula_id == pelicula_id_seleccionada) {
            peli.horarios_disponibles.forEach((horario) => {
                card_horarios.innerHTML += `
                    <button class="btn btn-light horario-btn" type="button" style="border: solid; border-width: 1px;" id="${horario.id_horario}" data-id-horario="${horario.id_horario}">
                        ${horario.sinopsis}
                     </button>`;
            });
        }
    });

    let botones_horario = card_horarios.querySelectorAll('.horario-btn');
    botones_horario.forEach((button) => {
        button.addEventListener('click', () => {
            botones_horario.forEach(btn => btn.classList.remove('boton_seleccionado'));
            button.classList.add('boton_seleccionado');
            let id_sala = button.getAttribute('data-id-horario');
            if (cantidad_boletos.value > 0) {
                cargarAsientos();
            } else {
                let error = document.getElementById("error_cantidad_boletos");
                error.innerHTML = "Asegurese de escribir la cantidad de boletos antes de seleccionar asientos.";
            }
        });
    });
}

function cargarAsientos() {
    let horario_seleccionado = false;

    let card_horarios = document.getElementById("horarios");
    let botones_horario = card_horarios.querySelectorAll('.horario-btn');
    botones_horario.forEach((button) => {
        if (button.classList.contains("boton_seleccionado")) {
            horario_seleccionado = true;
        }
    });

    if (horario_seleccionado) {
        //Si ya todo esta seleccionado.
        let card_asientos = document.getElementById("asientos");
        card_asientos.innerHTML = "";

        asientos.forEach((asiento, index) => {
            let letra_anterior;
            let letra_actual;
            let card_actual;

            if (index - 1 < 0) {
                letra_anterior = "-";
                letra_actual = asiento.nombre.substring(0, 1);
            } else {
                letra_anterior = asientos[index - 1].nombre.substring(0, 1);
                letra_actual = asiento.nombre.substring(0, 1);
            }

            if (letra_anterior != letra_actual) {
                card_asientos.innerHTML += `<div class="col-md-12 d-flex justify-content-center" id="${letra_actual}" style="margin-top:10px;"></div>`;

                card_actual = document.getElementById(letra_actual);
                card_actual.innerHTML += `<div class="${asiento.estatus === "Libre" ? "asiento_disponible" : "asiento_ocupado"} asiento-btn" id="${asiento.id_asiento}" data-id-asiento="${asiento.id_asiento}">
                                        ${asiento.nombre}
                                        </div>
            `;
            } else {
                card_actual = document.getElementById(letra_actual);
                card_actual.innerHTML += `<div class="${asiento.estatus === "Libre" ? "asiento_disponible" : "asiento_ocupado"} asiento-btn" id="${asiento.id_asiento}" data-id-asiento="${asiento.id_asiento}">
                                        ${asiento.nombre}
                                        </div>
            `;
            }
        });

        let botones_asiento = card_asientos.querySelectorAll('.asiento-btn');
        cantidad_total_seleccion = parseInt(cantidad_boletos.value);

        botones_asiento.forEach((button) => {
            button.addEventListener('click', () => {
                if (cantidad_total_seleccion > 0) {
                    if (button.classList.contains("asiento_disponible")) {
                        button.classList.remove("asiento_disponible");
                        button.classList.add("asiento_seleccionado");
                        cantidad_total_seleccion -= 1;
                    } else if (button.classList.contains("asiento_seleccionado")) {
                        button.classList.remove("asiento_seleccionado");
                        button.classList.add("asiento_disponible");
                        cantidad_total_seleccion += 1;
                    }
                } else {
                    if (button.classList.contains("asiento_seleccionado")) {
                        button.classList.remove("asiento_seleccionado");
                        button.classList.add("asiento_disponible");
                        cantidad_total_seleccion += 1;
                    }
                }
                let boton_completar = document.getElementById("btn_comprar");
                if (cantidad_total_seleccion <= 0) {
                    botones_asiento.forEach((btn) => {
                        if (btn.classList.contains("asiento_disponible")) {
                            btn.classList.remove("asiento_disponible");
                            btn.classList.add("asientos_bloquear");

                            //boton_completar.disabled = false;
                        }
                    });
                } else {
                    botones_asiento.forEach((btn) => {
                        if (btn.classList.contains("asientos_bloquear")) {
                            btn.classList.remove("asientos_bloquear");
                            btn.classList.add("asiento_disponible");

                            //boton_completar.disabled = true;
                        }
                    });
                }
                console.log("cantidad_total_seleccion: ", cantidad_total_seleccion);
            });
        });
    }
}

function verificarCantidadAsientos() {
    let error = document.getElementById("error_cantidad_boletos");
    let error_cantidad = false;
    let card_asientos = document.getElementById("asientos");

    if (/^[1-9]\d*$/.test(cantidad_boletos.value) == false && cantidad_boletos.value.trim().length != 0) {
        error.innerHTML = "La cantidad debe ser un número entero positivo.";
        card_asientos.innerHTML = "Seleccione una sala y un horario";
        error_cantidad = true;

    } else if (cantidad_boletos.value.trim().length == 0) {
        error.innerHTML = "";
        card_asientos.innerHTML = "Seleccione una sala y un horario";
        error_cantidad = true;
    } else {
        error.innerHTML = "";
    }

    if (!error_cantidad) {
        total_pagar = document.getElementById("total_pagar");
        total_pagar.innerHTML = "$ " + parseFloat(cantidad_boletos.value * 80);
        //cargarAsientos();
    } else {
        total_pagar = document.getElementById("total_pagar");
        total_pagar.innerHTML = "$ 0.00";
    }
}

function consultarPeliculas() {
    // Configuración de la petición AJAX
    let token = JSON.parse(localStorage.getItem("usuario")).token;
    console.log(token);
    $.ajax({
        url: "https://backpeliculas-4.onrender.com/peliculas",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            peliculas = response;
            cargarPeliculas();
        },
        error: function (error) {
            console.error("Error al enviar los datos:", error);
        }
    });
}

let baseUrl = "https://3bde-2806-264-5487-1771-5d9c-d01f-2665-aced.ngrok-free.app/api";

function consultaDescuentos() {
    $.ajax({
        url: "https://3bde-2806-264-5487-1771-5d9c-d01f-2665-aced.ngrok-free.app/api/getAllCupon",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        headers: {
            'ngrok-skip-browser-warning': 'true'
        },
        success: function (response) {
            descuentos = response;
            console.log("Descuento: ", descuentos);
        },
        error: function (error) {
            console.error("Error al enviar los datos:", error);
        }
    });
}

function verificarDescuento() {
    let descuento_valido = document.getElementById("descuento_valido");
    let nombre_descuento = document.getElementById("nombre_descuento");
    let condicion_descuento = document.getElementById("condicion_descuento");
    let descripcion_descuento = document.getElementById("descripcion_descuento");

    let descuento_encontrado = false;

    descuentos.forEach((descuento) => {
        if (descuento_texto.value == descuento.codigoCupon) {
            nombre_descuento.innerHTML = descuento.codigoCupon;
            condicion_descuento.innerHTML = descuento.condiciones;
            descripcion_descuento.innerHTML = descuento.descripcion;

            descuento_valido.style.display = 'block';
            descuento_encontrado = true;
        }
    });

    if (!descuento_encontrado) {
        descuento_valido.style.display = 'none';
    }
}

async function verificarCupon(codigoCupon) {
    try {
        // Codificar los datos como application/x-www-form-urlencoded
        const params = new URLSearchParams();
        params.append('codigoCupon', codigoCupon); // Agregar el código de cupón

        const response = await fetch(`${baseUrl}/verificarCupon`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', // Indicamos que es un formulario
            },
            body: params.toString() // Convertimos los parámetros a formato x-www-form-urlencoded
        });

        if (response.ok) {
            const esValido = await response.json(); // Se espera que la respuesta sea un booleano
            if (esValido) {
                console.log(`El cupón "${codigoCupon}" es válido.`);
                return true;
            } else {
                console.log(`El cupón "${codigoCupon}" no es válido.`);
                return false;
            }
        } else {
            console.error("Error al verificar el cupón.");
            return false;
        }
    } catch (error) {
        console.error("Error al verificar el cupón:", error);
        return false;
    }
}

// Función para aplicar el cupón al total de la compra
async function aplicarCupon(codigoCupon, totalCompra) {
    try {
        const response = await fetch(`${baseUrl}/aplicarCupon?codigoCupon=${codigoCupon}&totalCompra=${totalCompra}`, {
            method: 'POST',
        });

        if (response.ok) {
            const resultado = await response.text();
            return resultado;
        } else {
            return "Error al aplicar el cupón.";
        }
    } catch (error) {
        console.error("Error al aplicar el cupón:", error);
        return "Error al aplicar el cupón.";
    }
}

// Función para manejar el formulario de cupón
async function aplicarDescuento() {
    let error = document.getElementById("error_compra");
    let completarCompraModal = document.getElementById('completarCompraModal');
    let modalInstance = bootstrap.Modal.getInstance(completarCompraModal) || new bootstrap.Modal(completarCompraModal);

    let tp = total_pagar.innerText.replace("$", "").trim();
    const codigoCupon = document.getElementById('descuento_texto').value; // Obtenemos el código de cupón desde el input
    const totalCompra = parseFloat(tp); // Obtener el total de la compra

    // Verificamos si el cupón es válido
    const esValido = await verificarCupon(codigoCupon);

    if (esValido) {
        // Si es válido, aplicamos el cupón
        const resultado = await aplicarCupon(codigoCupon, totalCompra);
        error.innerHTML = "";
        modalInstance.hide();
        finalizarCompra();
    } else {
        error.innerHTML = "El cupon no es valido.";
    }
}

function finalizarCompra() {
    let finalizarCompraModal = document.getElementById('finalizarCompraModal');
    let card_asientos = document.getElementById("asientos");
    let descuento_valido = document.getElementById("descuento_valido");

    descuento_valido.style.display = 'none';

    card_asientos.innerHTML = "";
    cantidad_boletos.value = "";
    descuento_texto.value = "";
    total_pagar.innerHTML = "";

    // Crea una instancia del modal y muéstralo
    let modalInstance = new bootstrap.Modal(finalizarCompraModal);
    modalInstance.show();
}