export function muestra(settings) {
    $.ajax({
        url: settings.url_apiNotas,
        method: "GET",
        dataType: "json",
        success: function (data) {
            muestraNotas(data, settings.main_container, settings.url_filesNotas);
        }
    })
}

/** 
 * Muestra las notas en el contenedor especificado.
 * @param {Array} data - Array de notas obtenidas de la API.
 * @param {string} contenedor - ID del contenedor donde se mostrarán las notas
 * @param {string} rutaBase - Ruta base para las imágenes de las notas
*/
function muestraNotas(data, contenedor, rutaBase) {
    const NotasActivas = data.filter((nota) => nota.activo);
    const $mainContainer = $("#" + contenedor);
    $mainContainer.html("");

    // Actualizar el título si se proporciona
    if (NotasActivas.length === 0) {
        const $item = $(`
            <header class="major">
                <h2 class="modulo-nombre">No hay notas disponibles en este momento.</h2>
                <div class="modulo-secciones"></div>
            </header>
        `);
        $mainContainer.append($item);
        return;
    }

    // Se crea el encabezado para las notas
    const $item = $(`
        <header class="major">
            <h2 class="modulo-nombre">Notas</h2>
            <div class="modulo-secciones row"></div>
        </header>
    `);
    $mainContainer.append($item);

    // Se crea el contenedor para las tarjetas de notas
    const $cardsContainer = $item.find(".modulo-secciones");

    // Se crean las tarjetas para cada nota activa
    NotasActivas.forEach(nota => {
        // Se trunca la descripción si es muy larga
        const descripcionTruncada = nota.descripcion.length > 100
            ? nota.descripcion.substring(0, 100) + '...'
            : nota.descripcion;

        const imagenes = nota.items || [];

        // Se establecen valores para la imagen
        const imgElement = $('<img class="mt-2">').attr({
            'src': rutaBase + imagenes[0].archivo,
            'alt': nota.nombre || 'Imagen de la nota'
        });

        // Se crea el elemento de la tarjeta
        const $item = $(`
            <div class="card" style="width: 18rem; margin-right: 10px; margin-bottom: 10px;">
            
            <img src="..." class="card-img-top" alt="...">
            <div class="card-body">
                <h6 class="card-title">${nota.nombre}</h6>
                <p class="card-text">${descripcionTruncada}</p>
                <a href="#" class="btn btn-primary">Ver nota</a>
            </div>
            </div>

        `);

        // Se reemplaza la imagen de la tarjeta con la imagen de la nota
        $item.find('.card-img-top').replaceWith(imgElement);

        // Se agrega el elemento de la tarjeta al contenedor
        $cardsContainer.append($item);
    });
}

