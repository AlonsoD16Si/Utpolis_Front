let peliculas = [
    {
        nombre: "Jojo's Bizarre Adventure Steal ball run", descripcion: "En el año 1890, Estados Unidos se convierte en el " +
            "escenario de la carrera más épica y peligrosa jamás " +
            "concebida: Steel Ball Run, una competición que atraviesa " +
            "el continente desde San Diego hasta Nueva York. Miles de " +
            "competidores, atraídos por el premio de 50 millones de	" +
            "dólares, arriesgan todo para cruzar desiertos	" +
            "abrasadores, montañas traicioneras y llanuras	" +
            "inhóspitas." +
            "Entre los participantes destacan Johnny Joestar, un " +
            "exjinete de caballos caído en desgracia que busca " +
            "redención y el uso de sus piernas tras quedar " +
            "paralítico, y Gyro Zeppeli, un misterioso jinete " +
            "italiano armado con esferas giratorias imbuidas de un " +
            "poder que desafía las leyes de la física. ",
        nombre_imagen: "ejemplo3.jpg", id_pelicula: 1,
        salas_disponibles: [{ id_sala: 1, nombre_sala: "Sala 1-A", tipo: "normal" }, { id_sala: 3, nombre_sala: "Sala 2-B", tipo: "normal" }],
        horarios_disponibles: [{ id_horario: 20, id_sala: 1, descripcion: "13:25 - 15:00" }, { id_horario: 22, id_sala: 3, descripcion: "16:05 - 17:45" }]
    },
    {
        nombre: "Cyberpunk", descripcion: "En un futuro distópico donde la línea entre humano y " +
            "máquina se ha difuminado, V, un mercenario cibernético, " +
            "se ve envuelto en una conspiración de alto riesgo. Tras " +
            "un fallido atraco, un biochip experimental implantado en " +
            "su cerebro contiene la conciencia del legendario rockero " +
            "Johnny Silverhand, quien lucha por el control de su " +
            "mente. Cuando la Presidenta de los Nuevos Estados Unidos " +
            "es secuestrada, V debe adentrarse en el peligroso " +
            "distrito de Dogtown para rescatarla y desenmascarar una " +
            "conspiración que amenaza a toda Night City.",

        nombre_imagen: "ejemplo4.jpg", id_pelicula: 2,
        salas_disponibles: [{ id_sala: 2, nombre_sala: "Sala 2-A", tipo: "normal" }, { id_sala: 4, nombre_sala: "Sala 3-A", tipo: "normal" }, { id_sala: 5, nombre_sala: "Sala 3-B", tipo: "normal" }],
        horarios_disponibles: [{ id_horario: 11, id_sala: 2, descripcion: "10:15 - 11:50" }, { id_horario: 12, id_sala: 4, descripcion: "12:00 - 13:35" },
        { id_horario: 13, id_sala: 4, descripcion: "15:20 - 17:05" }, { id_horario: 14, id_sala: 4, descripcion: "19:00 - 20:50" }, { id_horario: 15, id_sala: 2, descripcion: "14:45 - 16:10" }
        ]
    },
    {
        nombre: "Red Dead Redemption", descripcion: "En el crepúsculo del salvaje oeste, 1899, la banda de " +
            "forajidos de Van der Linde, liderada por el carismático " +
            "Dutch, se ve acorralada por las fuerzas de la ley. Tras " +
            "un fallido atraco en Blackwater, Arthur Morgan, un leal " +
            "miembro de la banda, se encuentra atrapado entre su " +
            "lealtad a Dutch y su creciente conciencia moral. " +
            "Mientras la pandilla lucha por sobrevivir en un mundo " +
            "que se moderniza rápidamente, Arthur debe decidir su " +
            "propio destino y enfrentar las consecuencias de sus " +
            "acciones.",
        nombre_imagen: "ejemplo5.jpg", id_pelicula: 3,
        salas_disponibles: [{ id_sala: 3, nombre_sala: "Sala 2-B", tipo: "normal" }],
        horarios_disponibles: [{ id_horario: 2, id_sala: 3, descripcion: "13:25 - 15:00" }, { id_horario: 4, id_sala: 3, descripcion: "16:30 - 18:00" }]
    }
];

let asientos = [{ id_asiento: 1, nombre: "A1", estatus: "Libre" }, { id_asiento: 2, nombre: "A2", estatus: "Ocupado" }, { id_asiento: 3, nombre: "A3", estatus: "Libre" }, { id_asiento: 4, nombre: "A4", estatus: "Libre" },
{ id_asiento: 5, nombre: "B1", estatus: "Libre" }, { id_asiento: 6, nombre: "B2", estatus: "Libre" }, { id_asiento: 7, nombre: "B3", estatus: "Ocupado" }, { id_asiento: 8, nombre: "B4", estatus: "Libre" },
{ id_asiento: 9, nombre: "B5", estatus: "Libre" }, { id_asiento: 10, nombre: "B6", estatus: "Libre" }, { id_asiento: 11, nombre: "B7", estatus: "Libre" }, { id_asiento: 12, nombre: "B8", estatus: "Libre" },
{ id_asiento: 13, nombre: "C1", estatus: "Ocupado" }, { id_asiento: 14, nombre: "C2", estatus: "Ocupado" }, { id_asiento: 15, nombre: "C3", estatus: "Ocupado" }
];

let cantidad_boletos;
let cantidad_total_seleccion;

function cargarBoletosInicio() {
    cantidad_boletos = document.getElementById("cantidad_boletos");
    cantidad_boletos.addEventListener("input", verificarCantidadAsientos);

    cargarPeliculas();
    cargarSalas();
    cambiarPeliculaSeleccionada();
}

function cargarPeliculas() {
    let carusel = document.getElementById("slides_carusel");
    carusel.innerHTML = "";

    peliculas.forEach((peli, index) => {
        carusel.innerHTML += `
            <div class="carousel-item ${index === 0 ? "active" : ""}" id="${peli.id_pelicula}">
                <div class="d-flex justify-content-center">
                    <div class="card shadow-sm">
                        <div class="card-body" style="padding-top: 0px; padding-left: 0px;">
                            <div class="row">
                                <div class="col-md-4">
                                    <img src="../../imagenes/${peli.nombre_imagen}" class="imagen-boleto">
                                </div>
                                <div class="col-md-8" style="padding-top: 10px;">
                                    <h4 class="card-title" style="user-select: none;">
                                        ${peli.nombre}
                                    </h4>
                                    <span class="card-text" style="user-select: none;">
                                        ${peli.descripcion}
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


function cambiarPeliculaSeleccionada() {
    let carousel_disponibles = document.getElementById('carusel_disponibles');
    let card_horarios = document.getElementById("horarios");
    let card_asientos = document.getElementById("asientos");

    carousel_disponibles.addEventListener('slid.bs.carousel', () => {
        cargarSalas();
        card_horarios.innerHTML = `<span style="color: rgb(119, 119, 119);">Seleccione una sala</span>`;
        card_asientos.innerHTML = "";
    });
}

function cargarSalas() {
    let card_sala = document.getElementById("salas");
    let carusel = document.getElementById("slides_carusel");
    let item_activo = carusel.querySelector('.carousel-item.active');
    let id_pelicula_seleccionada = parseInt(item_activo.id);

    card_sala.innerHTML = "";

    peliculas.forEach((peli, index) => {
        if (peli.id_pelicula == id_pelicula_seleccionada) {
            peli.salas_disponibles.forEach((sala) => {
                card_sala.innerHTML += `
                <button class="btn btn-light sala-btn" type="button" style="border: solid; border-width: 1px;" id="${sala.id_sala}" data-id-sala="${sala.id_sala}">
                    ${sala.nombre_sala}
                 </button>`;
            });
        }
    });

    let botones_sala = card_sala.querySelectorAll('.sala-btn');
    botones_sala.forEach((button) => {
        button.addEventListener('click', () => {
            botones_sala.forEach(btn => btn.classList.remove('boton_seleccionado'));
            button.classList.add('boton_seleccionado');
            let id_sala = button.getAttribute('data-id-sala');
            cargarHorarios(id_sala);
            if (cantidad_boletos.value > 0) {
                cargarAsientos();
            } else {
                let error = document.getElementById("error_cantidad_boletos");
                error.innerHTML = "Asegurese de escribir la cantidad de boletos antes de seleccionar asientos.";
            }
        });
    });
}

function cargarHorarios(id_sala) {
    let card_horarios = document.getElementById("horarios");
    let carusel = document.getElementById("slides_carusel");
    let item_activo = carusel.querySelector('.carousel-item.active');
    let id_pelicula_seleccionada = parseInt(item_activo.id);

    card_horarios.innerHTML = "";

    peliculas.forEach((peli) => {
        if (peli.id_pelicula == id_pelicula_seleccionada) {
            peli.horarios_disponibles.forEach((horario) => {
                if (horario.id_sala == id_sala) {
                    card_horarios.innerHTML += `
                    <button class="btn btn-light horario-btn" type="button" style="border: solid; border-width: 1px;" id="${horario.id_horario}" data-id-horario="${horario.id_horario}">
                        ${horario.descripcion}
                     </button>`;
                }
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
    let sala_seleccionada = false;
    let horario_seleccionado = false;

    let card_sala = document.getElementById("salas");
    let botones_sala = card_sala.querySelectorAll('.sala-btn');
    botones_sala.forEach((button) => {
        if (button.classList.contains("boton_seleccionado")) {
            sala_seleccionada = true;
        }
    });

    let card_horarios = document.getElementById("horarios");
    let botones_horario = card_horarios.querySelectorAll('.horario-btn');
    botones_horario.forEach((button) => {
        if (button.classList.contains("boton_seleccionado")) {
            horario_seleccionado = true;
        }
    });

    if (sala_seleccionada && horario_seleccionado) {
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
        botones_asiento.forEach((button) => {
            button.addEventListener('click', () => {
                cantidad_total_seleccion = parseInt(cantidad_boletos.value);

                if (button.classList.contains('asiento_seleccionado')) {
                    button.classList.remove('asiento_seleccionado');
                    button.classList.add('asiento_disponible');
                } else if (!button.classList.contains('asiento_ocupado')) {
                    button.classList.remove('asiento_disponible');
                    button.classList.add('asiento_seleccionado');
                }
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
        cargarAsientos();
    }
}