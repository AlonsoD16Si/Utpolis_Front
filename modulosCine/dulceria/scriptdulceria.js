
$(document).ready(function () {
    fetchCategorias(); 
    fetchProductos();  
    // Botón para recargar productos
    $('#reloadButton').on('click', function () {
        $('#loadingIndicator').show();
        fetchProductos();
    });
    console.log(Swal); // Debería mostrar el objeto SweetAlert2

    // Guardar un nuevo producto
    $('#saveProductButton').on('click', function () {
        const productData = {
            nombre_producto: $('#productName').val(),
            precio: parseFloat($('#productPrice').val()),
            existencia: parseInt($('#productExistence').val()),
            tamanio: $('#productSize').val(),
            unidad: $('#productUnit').val(),
            estatus: $('#productStatus').is(':checked') ? 1 : 0,
            categoria_id: parseInt($('#productCategory').val())
        };

        // Validar campos requeridos
        if (!productData.nombre_producto || isNaN(productData.precio) || isNaN(productData.existencia) || !productData.categoria_id) {
            Swal.fire({
                title: '¡Error!',
                text: 'Por favor, completa todos los campos obligatorios.',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
            return;
        }

        $.ajax({
            url: 'https://producto-api.onrender.com/api/producto',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(productData),
            success: function () {
                fetchProductos();
                $('#create-product-form')[0].reset();
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Producto creado exitosamente.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            },
            error: function (error) {
                console.error('Error al crear producto:', error);
                Swal.fire({
                    title: '¡Error!',
                    text: 'Error al crear producto.',
                    icon: 'error',
                    confirmButtonText: 'Inténtalo nuevamente'
                });
            }
        });
    });
});

// Función para desmarcar uno de los checkboxes si el otro está seleccionado
function toggleCheckbox(selectedId, otherId) {
    const selectedCheckbox = document.getElementById(selectedId);
    const otherCheckbox = document.getElementById(otherId);

    if (selectedCheckbox.checked) {
        otherCheckbox.checked = false;
    }
}

function fetchCategorias() {
    $.ajax({
        url: 'https://producto-api.onrender.com/api/categoria',
        method: 'GET',
        success: function (response) {
            let categoriesHtml = '<option value="" disabled selected>Seleccionar Categoría</option>';
            (response.data || []).forEach(category => {
                categoriesHtml += `<option value="${category.categoria_id}">${category.nombre}</option>`;
            });
            $('#productCategory, #editProductCategory').html(categoriesHtml);
        },
        error: function (error) {
            console.error('Error al cargar categorías:', error);
        }
    });
}

function fetchProductos() {
    $('#loadingIndicator').show();
    $('.table-responsive').addClass('table-disabled');

    $.ajax({
        url: 'https://producto-api.onrender.com/api/producto',
        method: 'GET',
        success: function (response) {
            $('#loadingIndicator').hide();
            $('.table-responsive').removeClass('table-disabled');

            const newProducts = response.data || [];
            let productsHtml = '';

            newProducts.forEach(product => {
                console.log(`Producto ID: ${product.producto_id}, Estatus: ${product.estatus}`);

                const estatusText = product.estatus === true ? 'Activo' : 'Inactivo'; // Cambiado
                const estatusBadgeClass = product.estatus === true ? 'badge bg-success' : 'badge bg-danger'; // Cambiado

                productsHtml += `
                    <tr>
                        <td>${product.producto_id}</td>
                        <td>${product.nombre_producto}</td>
                        <td>$${product.precio}</td>
                        <td>${product.existencia}</td>
                        <td>${product.categoria.nombre}</td>
                        <td>${product.tamanio}</td>
                        <td>${product.unidad}</td>
                        <td><span class="${estatusBadgeClass}">${estatusText}</span></td>
                        <td>
                            <div class="d-flex justify-content-center gap-2">
                                <button class="btn btn-outline-primary btn-sm" onclick="loadProductForEdit(${product.producto_id})">Editar</button>
                                <button class="btn btn-outline-danger btn-sm" onclick="deleteProduct(${product.producto_id})">Eliminar</button>
                            </div>
                        </td>
                    </tr>`;
            });

            $('#productos-table-body').html(productsHtml);
        },
        error: function (error) {
            $('#loadingIndicator').hide();
            $('.table-responsive').removeClass('table-disabled');
            console.error('Error al cargar productos:', error);
        }
    });
}

function loadProductForEdit(productId) {
    $.ajax({
        url: `https://producto-api.onrender.com/api/producto/${productId}`,
        method: 'GET',
        success: function (response) {
            const product = response.data;

            // Cargar los datos en el modal
            $('#editProductId').val(product.producto_id);
            $('#editProductName').val(product.nombre_producto);
            $('#editProductPrice').val(product.precio);
            $('#editProductExistence').val(product.existencia);
            $('#editProductSize').val(product.tamanio);
            $('#editProductUnit').val(product.unidad);
            $('#editProductCategory').val(product.categoria_id);

            if(product.estatus === 1 ){
                $('#editProductStatus').prop('checked', false);
                $('#editDeactivateProduct').prop('checked', true);
            } else {
                $('#editProductStatus').prop('checked', true); 
                $('#editDeactivateProduct').prop('checked', false); 
            }
            // Mostrar el modal
            $('#editProductModal').modal('show');
        },
        error: function (error) {
            console.error('Error al cargar producto:', error);
        }
    });
}

function saveProductEdit() {
    const productId = $('#editProductId').val();
    const isActive = $('#editProductStatus').is(':checked'); 
    const isDeactivateChecked = $('#editDeactivateProduct').is(':checked'); 
    const finalStatus = isDeactivateChecked ? 0 : (isActive ? 1 : 0);

    const productData = {
        nombre_producto: $('#editProductName').val(),
        precio: parseFloat($('#editProductPrice').val()),
        existencia: parseInt($('#editProductExistence').val()),
        tamanio: $('#editProductSize').val(),
        unidad: $('#editProductUnit').val(),
        categoria_id: parseInt($('#editProductCategory').val()),
        estatus: finalStatus
    };

    // Validación de campos requeridos
    if (!productData.nombre_producto || isNaN(productData.precio) || isNaN(productData.existencia)) {
        Swal.fire({
            title: '¡Error!',
            text: 'Por favor, completa todos los campos obligatorios.',
            icon: 'error',
            confirmButtonText: 'Cerrar'
        });
        return;
    }

    const saveButton = $('.btn-primary');
    saveButton.prop('disabled', true).html('<i class="mdi mdi-loading mdi-spin"></i> Guardando...');

    $.ajax({
        url: `https://producto-api.onrender.com/api/producto/${productId}`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(productData),
        success: function () {
            $('#editProductModal').modal('hide');
            fetchProductos();
            saveButton.prop('disabled', false).html('Guardar Cambios');
            Swal.fire({
                title: '¡Éxito!',
                text: 'Producto actualizado con éxito.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        },
        error: function (error) {
            console.error('Error al actualizar producto:', error);
            saveButton.prop('disabled', false).html('Guardar Cambios');
            Swal.fire({
                title: '¡Error!',
                text: 'Error al actualizar producto.',
                icon: 'error',
                confirmButtonText: 'Inténtalo nuevamente'
            });
        }
    });
}

function deleteProduct(productId) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás revertir esta acción.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: `https://producto-api.onrender.com/api/producto/${productId}`,
                method: 'DELETE',
                success: function () {
                    fetchProductos();
                    Swal.fire({
                        title: '¡Eliminado!',
                        text: 'Producto eliminado con éxito.',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                },
                error: function (error) {
                    console.error('Error al eliminar producto:', error);
                    Swal.fire({
                        title: '¡Error!',
                        text: 'Error al eliminar producto.',
                        icon: 'error',
                        confirmButtonText: 'Inténtalo nuevamente'
                    });
                }
            });
        }
    });
}
