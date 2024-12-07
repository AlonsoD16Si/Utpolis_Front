const API_URL = "https://microservicio-promociones-cine.vercel.app/api/promociones";

// Botón para recargar productos
$('#reloadButton').on('click', function () {
    $('#loadingIndicator').show();
    cargarPromociones();
});

// Mostrar alertas con SweetAlert
function mostrarAlerta(mensaje, tipo = "success") {
    Swal.fire({
        icon: tipo,
        title: tipo === "success" ? "¡Éxito!" : "¡Error!",
        text: mensaje,
        timer: 3000,
        showConfirmButton: false
    });
}

$("#saveProduccionButton").on("click", function () {
    const promocion = {
        descripcion: $("#descripcion").val(),
        fecha_inicio: $("#fecha_inicio").val(),
        fecha_fin: $("#fecha_fin").val(),
        id_producto_fk: $("#id_producto_fk").val(),
        porcentaje_descuento: ($("#porcentaje_descuento").val() / 100),
        estatus: $("#id_promocion").is(":checked") ? 1 : 0
    };

    if (!promocion.descripcion || !promocion.fecha_inicio || !promocion.fecha_fin || !promocion.id_producto_fk) {
        mostrarAlerta("Por favor, complete todos los campos requeridos.", "error");
        return;
    }

    $.ajax({
        url: `${API_URL}/${promocion.id_promocion}`,
        method: "PUT",
        data: JSON.stringify(promocion),
        contentType: "application/json",
        success: function () {
            mostrarAlerta("Promoción actualizada correctamente.");
            $("#editPromotionModal").modal("hide");
            cargarPromociones();
        },
        error: function () {
            mostrarAlerta("Error al actualizar la promoción.", "error");
        }
    });
    
});

// Cargar promociones en la tabla
function cargarPromociones() {
    $('#loadingIndicator').show();
    $('.table-responsive').addClass('table-disabled');

    $.ajax({
        url: API_URL,
        method: "GET",
        success: function (data) {
            $('#loadingIndicator').hide();
            $('.table-responsive').removeClass('table-disabled');
            const tbody = $("#tablaPromociones");
            tbody.empty();
            data.forEach(promocion => {
                const porcentaje = promocion.porcentaje_descuento
                    ? (promocion.porcentaje_descuento * 100).toFixed(0) + "%"
                    : "0%";

                tbody.append(`
                    <tr>
                        <td>${promocion.id_promocion}</td>
                        <td>${promocion.descripcion}</td>
                        <td>${formatearFecha(promocion.fecha_inicio)}</td>
                        <td>${formatearFecha(promocion.fecha_fin)}</td>
                        <td>${porcentaje}</td>
                        <td>${promocion.nombre_producto}</td>
                        <td>
                            <div class="d-flex justify-content-center gap-2">
                                <button class="btn btn-outline-primary btn-sm" onclick="editarPromocion(${promocion.id_promocion})">Editar</button>
                                <button class="btn btn-outline-danger btn-sm" onclick="eliminarPromocion(${promocion.id_promocion})">Eliminar</button>
                            </div>
                        </td>
                    </tr>
                `);
            });
        },
        error: function () {
            mostrarAlerta("Error al cargar promociones.", "error");
        }
    });
}

// Guardar cambios desde el modal
function savePromotionEdit() {
    const id_promocion = $("#editPromotionId").val();
    const promocion = {
        descripcion: $("#editPromotionDescription").val(),
        fecha_inicio: $("#editPromotionStartDate").val(),
        fecha_fin: $("#editPromotionEndDate").val(),
        id_producto_fk: $("#editPromotionProduct").val(),
        porcentaje_descuento: ($("#editPromotionDiscount").val() / 100),
        estatus: $("#editPromotionDeactivate").is(":checked") ? 0 : 1
    };

    if (!promocion.descripcion || !promocion.fecha_inicio || !promocion.fecha_fin || !promocion.id_producto_fk) {
        mostrarAlerta("Por favor, complete todos los campos requeridos.", "error");
        return;
    }

    $.ajax({
        url: `${API_URL}/${id_promocion}`,
        method: "PUT",
        data: JSON.stringify(promocion),
        contentType: "application/json",
        success: function () {
            mostrarAlerta("Promoción actualizada correctamente.");
            $("#editPromotionModal").modal("hide");
            cargarPromociones();
        },
        error: function () {
            mostrarAlerta("Error al actualizar la promoción.", "error");
        }
    });
}

// Cargar datos en el modal para editar
function editarPromocion(id) {
    $.get(`${API_URL}/${id}`, function (promocion) {
        $("#editPromotionId").val(promocion.id_promocion);
        $("#editPromotionDescription").val(promocion.descripcion);
        $("#editPromotionStartDate").val(promocion.fecha_inicio.split("T")[0]);
        $("#editPromotionEndDate").val(promocion.fecha_fin.split("T")[0]);
        $("#editPromotionProduct").val(promocion.id_producto_fk);
        $("#editPromotionDiscount").val((promocion.porcentaje_descuento * 100).toFixed(0));
        $("#editPromotionActiveStatus").prop("checked", promocion.estatus === 1);
        $("#editPromotionDeactivate").prop("checked", promocion.estatus === 0);

        $("#editPromotionModal").modal("show");
    }).fail(function () {
        mostrarAlerta("Error al cargar los datos de la promoción.", "error");
    });
}

// Eliminar promoción
function eliminarPromocion(id) {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción eliminará la promoción de forma permanente.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: `${API_URL}/${id}`,
                method: "DELETE",
                success: function () {
                    mostrarAlerta("Promoción eliminada correctamente.");
                    cargarPromociones();
                },
                error: function () {
                    mostrarAlerta("Error al eliminar la promoción.", "error");
                }
            });
        }
    });
}
// Guardar promoción
// Validar formulario
function validarFormulario() {
    let valido = true;
    const descripcion = $("#descripcion");
    const fechaInicio = $("#fecha_inicio");
    const fechaFin = $("#fecha_fin");
    const idProducto = $("#id_producto_fk");
    const porcentajeDescuento = $("#porcentaje_descuento");

    // Validación de descripción
    if (descripcion.val().trim().length < 3) {
        descripcion.addClass("is-invalid");
        valido = false;
    } else {
        descripcion.removeClass("is-invalid");
    }

    // Validación de fechas
    const inicio = new Date(fechaInicio.val());
    const fin = new Date(fechaFin.val());

    if (!fechaInicio.val()) {
        fechaInicio.addClass("is-invalid");
        valido = false;
    } else {
        fechaInicio.removeClass("is-invalid");
    }

    if (!fechaFin.val() || fin < inicio) {
        fechaFin.addClass("is-invalid");
        valido = false;
    } else {
        fechaFin.removeClass("is-invalid");
    }

    // Validación de ID Producto
    if (!idProducto.val() || idProducto.val() <= 0) {
        idProducto.addClass("is-invalid");
        valido = false;
    } else {
        idProducto.removeClass("is-invalid");
    }

    // Validación de porcentaje
    const porcentaje = parseFloat(porcentajeDescuento.val());
    if (isNaN(porcentaje) || porcentaje < 0 || porcentaje > 100) {
        porcentajeDescuento.addClass("is-invalid");
        valido = false;
    } else {
        porcentajeDescuento.removeClass("is-invalid");
    }

    return valido;
}

// Cambiar a un submit del formulario para activar las validaciones y el envío
$("#formPromocion").on("submit", function (e) {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    // Validar el formulario antes de enviar
    if (!validarFormulario()) {
        mostrarAlerta("Por favor, corrige los errores en el formulario.", "danger");
        return;
    }

    let descuento = ($("#porcentaje_descuento").val()) / 100;

    const id_promocion = $("#id_promocion").val();
    const promocion = {
        descripcion: $("#descripcion").val(),
        fecha_inicio: $("#fecha_inicio").val(),
        fecha_fin: $("#fecha_fin").val(),
        id_producto_fk: $("#id_producto_fk").val(),
        porcentaje_descuento: descuento,
        estatus: 1
    };

    const method = id_promocion ? "PUT" : "POST";
    const url = id_promocion ? `${API_URL}/${id_promocion}` : API_URL;

    $.ajax({
        url: url,
        method: method,
        data: JSON.stringify(promocion),
        contentType: "application/json",
        success: function () {
            mostrarAlerta("Promoción guardada correctamente.");
            $("#formPromocion")[0].reset();
            cargarPromociones();
        },
        error: function () {
            mostrarAlerta("Error al guardar la promoción.", "danger");
        }
    });
});



// Cargar productos en los select
function cargarProductos() {
    $.ajax({
        url: "https://microservicio-promociones-cine.vercel.app/api/productos",
        method: "GET",
        success: function (data) {
            const selectMain = $("#id_producto_fk");
            const selectEdit = $("#editPromotionProduct");
            selectMain.empty();
            selectEdit.empty();

            selectMain.append('<option value="">Seleccione un producto</option>');
            selectEdit.append('<option value="">Seleccione un producto</option>');

            data.forEach(producto => {
                selectMain.append(`<option value="${producto.producto_id}">${producto.nombre_producto}</option>`);
                selectEdit.append(`<option value="${producto.producto_id}">${producto.nombre_producto}</option>`);
            });
        },
        error: function () {
            mostrarAlerta("Error al cargar los productos.", "error");
        }
    });
}

// Formatear fecha a DD/MM/YYYY
function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    const dia = (fecha.getDate()).toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
}

// Inicializar la página
$(document).ready(function () {
    cargarProductos();
    cargarPromociones();
});
