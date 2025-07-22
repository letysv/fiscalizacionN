export function muestraNotas(settings) {
    console.log(settings)
    $.ajax({
        url: settings.url_apiNotas,
        method: "GET",
        dataType: "json",
        success: function (data) {
            muestra(data, settings.main_container);
        }
    })
}

function muestra(data, contenedor) {
    const NotasActivas = data.filter((nota) => nota.activo);
    const $mainContainer = $("#" + contenedor);
    $mainContainer.html("");
    if (NotasActivas.length === 0) {
        const $item = $(`
            <header class="major">
                <h2 class="modulo-nombre">No hay notas disponibles en este momento.</h2>
            </header>
        `);
        $mainContainer.append($item);
        return;
    }

    NotasActivas.forEach(nota => {

    });
}