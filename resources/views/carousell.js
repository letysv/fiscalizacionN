/**
 * Función que carga las notas desde una API y las muestra en un carrusel.
 * @param {string} urlApi 
 * @param {string} contenedor
 */
export function crear(settings) {
    // Configuración para obtener datos de la API
    const settingsAjax = {
        async: true,
        crossDomain: true,
        url: settings.url_api,
        method: 'GET'
    };

    // Realizar la petición AJAX
    $.ajax(settingsAjax).done(function (data) {
        mostrarCarrusel(data,settings.container,settings.url_files);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.error("Error al cargar las imágenes:", textStatus, errorThrown);
        // Mostrar imagen por defecto si hay error
        $(`#${contenedor}`).html('<div class="item"><img src="images/banner.jpg" alt="Banner por defecto"></div>');
        inicializarCarrusel(settings.container);
    });


}

// Función para mostrar el carrusel con los datos de la API
function mostrarCarrusel(notas,contenedor,urlFiles) {
    const carrusel = $(`#${contenedor}`);
    carrusel.empty(); // Limpiar contenido previo

    // Filtrar solo notas activas y agregar imágenes al carrusel
    notas.filter(nota => nota.activo == 1)
        .slice(0, 3)
        .forEach(nota => {
        const imagenes = nota.items || [];
        const rutaBase = urlFiles;

        imagenes.forEach(imagen => {
            const itemDiv = $('<div class="item"></div>');
            const imgContainer = $('<div class="image-container"></div>');
            const imgElement = $('<img>').attr({
                'src': rutaBase + imagen.archivo,
                'alt': nota.nombre || 'Imagen del carrusel'
            });

            const titleOverlay = $('<div class="title-overlay"></div>');
            const titleElement = $('<h3></h3>').text(nota.nombre || '');

            // Información completa de la nota
            titleElement.attr('data-nota-id', nota.id)
                      .addClass('nota-title-clickable')
                      .css('cursor', 'pointer');

            titleOverlay.append(titleElement);
            imgContainer.append(imgElement, titleOverlay);
            // itemDiv.append(imgElement);
            itemDiv.append(imgContainer); 
            carrusel.append(itemDiv);
        });
    });

    // Si no hay imágenes, mostrar una por defecto
    if (carrusel.children().length === 0) {
        carrusel.html('<div class="item"><img src="images/banner.jpg" alt="Banner por defecto"></div>');
    }

    // Inicializar el carrusel
    inicializarCarrusel(contenedor);

    // Manejador de eventos para los títulos
    $('.nota-title-clickable').on('click', function() {
        const notaId = $(this).data('nota-id');
        const notaSeleccionada = notas.find(nota => nota.id == notaId);
        
        if(notaSeleccionada) {
            mostrarDetalleNota(notaSeleccionada, urlFiles);
        }
    });
}

function mostrarDetalleNota(nota, urlFiles) {
    const mainContainer = $('#main_container');

    const baseUrl = (urlFiles || '').endsWith('/') ? urlFiles : urlFiles ? urlFiles + '/' : '';

    let imagenSrc = '';
    if (nota.items && nota.items.length > 0 && nota.items[0].archivo) {
        imagenSrc = baseUrl + nota.items[0].archivo;
    }
    
    const detalleHTML = `
        <div class="nota-detalle">
            ${imagenSrc ? `<img src="${imagenSrc}" alt="${nota.nombre || 'Imagen de nota'}" class="nota-imagen">` : ''}
            <h2>${nota.nombre || 'Sin título'}</h2>
            <div class="nota-descripcion">
                ${nota.descripcion || 'No hay descripción disponible.'}
            </div>
        </div>
    `;
    
    // Insertar en el contenedor principal
    mainContainer.html(detalleHTML);
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
        ],
        responsive: {
            0: {    // Pantallas menores a 600px
                items: 1,
                nav: false, // Ocultar flechas en móviles
                dots: true
            },
            600: {   // Pantallas mayores a 600px
                items: 1,
                nav: true,
                dots: true
            },
            1000: {  // Pantallas mayores a 1000px
                items: 1,
                nav: true,
                dots: false
            }
        }
    });
}