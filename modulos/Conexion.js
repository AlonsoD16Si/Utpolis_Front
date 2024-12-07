/*
 Autor: Alondra Goretii Martinez Saldaña
 Fecha: 21-11-2024
 Descripción: Vista de Gestion de Cupones 
 */


/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


document.addEventListener("DOMContentLoaded", function () {
    cargarCupones();
});

// URL base del API
const baseUrl = "https://7862-2806-264-5483-844-5a93-2399-7e95-6d67.ngrok-free.app/api";




// Función para guardar un nuevo cupón
let cuponesData = []; // Variable global para almacenar los cupones

async function cargarCupones() {
    try {
        // Realiza la solicitud fetch para obtener los cupones
        const response = await fetch(`${baseUrl}/getAllCupon`, {
            headers: {
                'ngrok-skip-browser-warning': 'true' // Evita el mensaje de advertencia de Ngrok
            }
        });

        // Verifica si la respuesta es exitosa
        if (!response.ok) {
            throw new Error('Error al obtener los cupones');
        }

        // Convierte la respuesta a JSON
        cuponesData = await response.json(); // Guarda los cupones en cuponesData

        // Limpiar el contenedor antes de agregar los nuevos cupones
        const cuponesContainer = document.getElementById('cuponesContainer');
        cuponesContainer.innerHTML = '';

        // Crear las tarjetas para cada cupón
        cuponesData.forEach(cupon => {
            const cuponCard = document.createElement('div');
            cuponCard.classList.add('cupon-card');

            cuponCard.innerHTML = `
                <div class="cupon-header">
                    <h3>Código: ${cupon.codigoCupon}</h3> <!-- Mostrar el código del cupón -->
                    <p>Descripción: ${cupon.descripcion}</p> <!-- Descripción del cupón -->
                </div>
                <div class="cupon-body">
                    <p>Descuento: ${cupon.descuento}%</p>
            <p>Cantidad Cupones: ${cupon.num_cupones}</p>
                    <p>Fecha de inicio: ${cupon.fechaInicio}</p>
                    <p>Fecha de vencimiento: ${cupon.fechaVencimiento}</p>
                    <p>Estado: <span class="${cupon.estado === 'activo' ? 'activo' : 'inactivo'}">${cupon.estado}</span></p>
                </div>
                <div class="cupon-footer">
                    <button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#modalCupon1" onclick="editarCupon(${cupon.idCupon})">Editar</button>
                    <button onclick="eliminarCupon(${cupon.idCupon})">Eliminar</button>
                </div>
            `;

            // Añadir la tarjeta al contenedor
            cuponesContainer.appendChild(cuponCard);
        });
    } catch (error) {
        console.error('Error al cargar los cupones:', error);
    }
}


// Función para actualizar un cupón existente
async function actualizarCupon() {
    const idCupon = document.getElementById("Id2").value;
    const codigoCupon = document.getElementById("codigoCupon2").value;
    const descripcion = document.getElementById("descripcion2").value;
    const descuento = document.getElementById("descuento2").value;
    const num_cupones = document.getElementById("cantidad2").value;
    const fechaInicio = document.getElementById("fechaInicio2").value;
    const fechaVencimiento = document.getElementById("fechaVencimiento2").value;
    const condiciones = document.getElementById("condiciones2").value;
    const estado = document.getElementById("estado2").value;

    const cupon = {
        codigoCupon,
        descripcion,
        descuento,
        num_cupones,
        fechaInicio,
        fechaVencimiento,
        condiciones,
        estado
    };

    // Convertir el objeto cupon a formato x-www-form-urlencoded
    const params = new URLSearchParams(cupon).toString();

    try {
        const response = await fetch(`${baseUrl}/actualizarCupon?idCupon=${idCupon}`, {
            method: "PUT",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params // Enviar los datos como x-www-form-urlencoded
        });
       if (response.ok) {
            cargarCupones(); // Recargar los cupones después de guardarlos
            limpiarFormulario(); // Limpiar el formulario
            document.getElementById("modalCupon1").classList.remove("show"); // Cerrar el modal
        } else {
            console.error("Error al actualizar el cupón.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// Función para editar un cupón
function editarCupon(idCupon) {
    // Busca el cupón en la variable cuponesData
    const cupon = cuponesData.find(c => c.idCupon === idCupon);

    if (cupon) {
        // Llena los campos del modal con los datos del cupón
        document.getElementById('Id2').value = cupon.idCupon;
        document.getElementById('codigoCupon2').value = cupon.codigoCupon;
        document.getElementById('descripcion2').value = cupon.descripcion;
        document.getElementById('descuento2').value = cupon.descuento;
        document.getElementById('cantidad2').value = cupon.num_cupones;
        document.getElementById('fechaInicio2').value = cupon.fechaInicio;
        document.getElementById('fechaVencimiento2').value = cupon.fechaVencimiento;
        document.getElementById('condiciones2').value = cupon.condiciones;
        document.getElementById('estado2').value = cupon.estado;

        // Muestra el modal
        const modal = new bootstrap.Modal(document.getElementById('modalCupon1'));
        modal.show();
    } else {
        console.error("No se encontró el cupón.");
    }
}

// Función para eliminar un cupón
async function eliminarCupon(idCupon) {
    if (confirm("¿Estás seguro de eliminar este cupón?")) {
        try {
            const response = await fetch(`${baseUrl}/eliminarCupon?idCupon=${idCupon}`, {
                method: "DELETE", // Método DELETE para eliminar
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            if (response.ok) {
                cargarCupones(); // Recargar los cupones después de eliminar
            } else {
                console.error("Error al eliminar el cupón.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }
}



// Función para guardar un nuevo cupón
async function guardarCupon() {
    const codigoCupon = document.getElementById("codigoCupon").value;
    const descripcion = document.getElementById("descripcion").value;
    const descuento = document.getElementById("descuento").value;
    const fechaInicio = document.getElementById("fechaInicio").value;
    const fechaVencimiento = document.getElementById("fechaVencimiento").value;
    const condiciones = document.getElementById("condiciones").value;
    const estado = document.getElementById("estado").value;
    
    const num_cupones = document.getElementById("cantidad").value;

    const cupon = {
        codigoCupon,
        descripcion,
        descuento,
        num_cupones,
        fechaInicio,
        fechaVencimiento,
        condiciones,
        estado
    };

    // Convertir el objeto cupon a formato x-www-form-urlencoded
    const params = new URLSearchParams(cupon).toString();

    try {
        const response = await fetch(`${baseUrl}/insertarCupon`, {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: params // Enviar los datos como x-www-form-urlencoded
        });

        if (response.ok) {
            cargarCupones(); // Recargar los cupones después de guardarlos
            limpiarFormulario(); // Limpiar el formulario
            document.getElementById("modalCupon").classList.remove("show"); // Cerrar el modal
        } else {
            console.error("Error al guardar el cupón.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// Función para limpiar el formulario
function limpiarFormulario() {
    document.getElementById("formCupon").reset();
    document.getElementById("idCupon").value = "";
}

// Función para buscar un cupón por su código
function buscarCupon() {
    const codigoCuponBuscar = document.getElementById('buscarCodigo').value.trim().toLowerCase();

    // Filtra los cupones según el código ingresado
    const cuponesFiltrados = cuponesData.filter(cupon =>
        cupon.codigoCupon.toLowerCase().includes(codigoCuponBuscar)
    );

    // Limpiar el contenedor antes de agregar los cupones filtrados
    const cuponesContainer = document.getElementById('cuponesContainer');
    cuponesContainer.innerHTML = '';

    // Si se encuentran cupones, crear tarjetas para cada uno
    if (cuponesFiltrados.length > 0) {
        cuponesFiltrados.forEach(cupon => {
            const cuponCard = document.createElement('div');
            cuponCard.classList.add('cupon-card');

            cuponCard.innerHTML = `
                <div class="cupon-header">
                    <h3>${cupon.descripcion}</h3>
                    <p>Descuento: ${cupon.descuento}%</p>
                </div>
                <div class="cupon-body">
                    <p>Fecha de inicio: ${cupon.fechaInicio}</p>
                    <p>Fecha de vencimiento: ${cupon.fechaVencimiento}</p>
                    <p>Estado: <span class="${cupon.estado === 'activo' ? 'activo' : 'inactivo'}">${cupon.estado}</span></p>
                </div>
                <div class="cupon-footer">
                    <button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#modalCupon1" onclick="editarCupon(${cupon.idCupon})">Editar</button>
                    <button onclick="eliminarCupon(${cupon.idCupon})">Eliminar</button>
                </div>
            `;

            cuponesContainer.appendChild(cuponCard);
        });
    } else {
        // Si no se encuentran cupones, mostrar un mensaje
        cuponesContainer.innerHTML = '<p>No se encontraron cupones con ese código.</p>';
    }
}

