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
        horarios_disponibles: [{ id_horario: 20, id_sala: 1, descripcion: "13:25 - 15:00"},{ id_horario: 22, id_sala: 3, descripcion: "16:05 - 17:45"}]
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
        horarios_disponibles: [{ id_horario: 11, id_sala: 2, descripcion: "10:15 - 11:50"},{ id_horario: 12, id_sala: 4, descripcion: "12:00 - 13:35"},
            { id_horario: 13, id_sala: 4, descripcion: "15:20 - 17:05"},{ id_horario: 14, id_sala: 4, descripcion: "19:00 - 20:50"},{ id_horario: 15, id_sala: 2, descripcion: "14:45 - 16:10"}
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
        horarios_disponibles: [{ id_horario: 2, id_sala: 3, descripcion: "13:25 - 15:00"},{ id_horario: 4, id_sala: 3, descripcion: "16:30 - 18:00"}]
    }
];

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

    carousel_disponibles.addEventListener('slid.bs.carousel', () => {
        cargarSalas();
        card_horarios.innerHTML = `<span style="color: rgb(119, 119, 119);">Seleccione una sala</span>`;
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
                if(horario.id_sala == id_sala){
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
        });
    });
}