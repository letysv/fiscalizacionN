/**
 * Función que carga las notas desde una API y las muestra en un carrusel.
 * @param {string} urlApi 
 * @param {string} contenedor
 */
export function crear(urlApi,contenedor) {
    // Configuración para obtener datos de la API
    const settings = {
        async: true,
        crossDomain: true,
        url: urlApi,
        method: 'GET'
    };

    // Realizar la petición AJAX
    $.ajax(settings).done(function (response) {
        mostrarCarrusel(response,contenedor);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.error("Error al cargar las imágenes:", textStatus, errorThrown);
        // Mostrar imagen por defecto si hay error
        $(`#${contenedor}`).html('<div class="item"><img src="images/banner.jpg" alt="Banner por defecto"></div>');
        inicializarCarrusel(contenedor);
    });


}

// Función para mostrar el carrusel con los datos de la API
function mostrarCarrusel(notas,contenedor) {
    const carrusel = $(`#${contenedor}`);
    carrusel.empty(); // Limpiar contenido previo

    // Filtrar solo notas activas y agregar imágenes al carrusel
    notas.filter(nota => nota.activo == 1).forEach(nota => {
        const imagenes = nota.items || [];
        const rutaBase = 'http://127.0.0.1:8000/storage/notas/';

        imagenes.forEach(imagen => {
            const itemDiv = $('<div class="item"></div>');
            const imgElement = $('<img>').attr({
                'src': rutaBase + imagen.archivo,
                'alt': nota.nombre || 'Imagen del carrusel'
            });

            itemDiv.append(imgElement);
            carrusel.append(itemDiv);
        });
    });

    // Si no hay imágenes, mostrar una por defecto
    if (carrusel.children().length === 0) {
        carrusel.html('<div class="item"><img src="images/banner.jpg" alt="Banner por defecto"></div>');
    }

    // Inicializar el carrusel
    inicializarCarrusel(contenedor);
}

// Función para inicializar Owl Carousel con animaciones
function inicializarCarrusel(contenedor) {
    $(`#${contenedor}`).owlCarousel({
        items: 1,
        loop: true,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        smartSpeed: 1000,
        nav: true,
        dots: true,
        navText: [
            '<i class="fa fa-angle-left"></i>',
            '<i class="fa fa-angle-right"></i>'
        ]
    });
}