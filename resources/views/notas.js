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

function muestraNotas(data, contenedor, rutaBase) {
    const NotasActivas = data.filter((nota) => nota.activo);
    const $mainContainer = $("#" + contenedor);
    $mainContainer.html("");
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

    const $item = $(`
        <header class="major">
            <h2 class="modulo-nombre">Notas</h2>
            <div class="modulo-secciones row"></div>
        </header>
    `);
    $mainContainer.append($item);

    const $cardsContainer = $item.find(".modulo-secciones");

    NotasActivas.forEach(nota => {
        const descripcionTruncada = nota.descripcion.length > 100
            ? nota.descripcion.substring(0, 100) + '...'
            : nota.descripcion;

        const imagenes = nota.items || [];

        const imgElement = $('<img class="mt-2">').attr({
            'src': rutaBase + imagenes[0].archivo,
            'alt': nota.nombre || 'Imagen del carrusel'
        });


        const $item = $(`
            <div class="card" style="width: 18rem; margin-right: 10px; margin-bottom: 10px;">
            
            <img src="..." class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${nota.nombre}</h5>
                <p class="card-text">${descripcionTruncada}</p>
                <a href="#" class="btn btn-primary">Ver nota</a>
            </div>
            </div>

        `);
        $item.find('.card-img-top').replaceWith(imgElement);
        $cardsContainer.append($item);
    });
}

