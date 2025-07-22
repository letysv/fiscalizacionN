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

    const notasActivas = notas.filter(nota => nota.activo == 1);
    
    const notasOrdenadas = notasActivas.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
    });

    const ultimasTresNotas = notasOrdenadas.slice(0, 3);

    ultimasTresNotas.forEach(nota => {
        const imagenes = nota.items || [];
        const rutaBase = urlFiles;

        if (imagenes.length > 0) {
            // Toma la primera imagen
           const primeraImagen = imagenes[0];

            const itemDiv = $('<div class="item"></div>');
            const imgContainer = $('<div class="image-container"></div>').attr('data-nota-id', nota.id);
            const imgElement = $('<img>').attr({
                'src': rutaBase + primeraImagen.archivo,
                'alt': nota.nombre || 'Imagen del carrusel'
            }).css('cursor', 'pointer');

            const titleOverlay = $('<div class="title-overlay"></div>');
            const titleElement = $('<h3></h3>').text(nota.nombre || '');

            titleOverlay.append(titleElement);
            imgContainer.append(imgElement, titleOverlay);
            itemDiv.append(imgContainer); 
            carrusel.append(itemDiv);
        }
    });

    // Si no hay imágenes, mostrar una por defecto
    if (carrusel.children().length === 0) {
        carrusel.html('<div class="item"><img src="images/banner.jpg" alt="Banner por defecto"></div>');
    }

    // Inicializar el carrusel
    inicializarCarrusel(contenedor);

    $('.image-container, .image-container img').on('click', function() {
        const notaId = $(this).closest('.image-container').data('nota-id');
        const notaSeleccionada = notas.find(nota => nota.id == notaId);
        
        if(notaSeleccionada) {
            mostrarDetalleNota(notaSeleccionada, urlFiles);
        }
    });
    
}

function mostrarDetalleNota(nota, urlFiles) {
    const mainContainer = $('#main_container');

    const baseUrl = (urlFiles || '').endsWith('/') ? urlFiles : urlFiles ? urlFiles + '/' : '';

    // let imagenSrc = '';
    // if (nota.items && nota.items.length > 0 && nota.items[0].archivo) {
    //     imagenSrc = baseUrl + nota.items[0].archivo;
    // }
    
    // const detalleHTML = `
    //     <div class="nota-detalle">
    //         ${imagenSrc ? `<img src="${imagenSrc}" alt="${nota.nombre || 'Imagen de nota'}" class="nota-imagen">` : ''}
    //         <h2>${nota.nombre || 'Sin título'}</h2>
    //         <div class="nota-descripcion">
    //             ${nota.descripcion || 'No hay descripción disponible.'}
    //         </div>
    //     </div>
    // `;

    // Crear HTML para todas las imágenes en fila
    let imagenesHTML = '';
    if (nota.items && nota.items.length > 0) {
        imagenesHTML = `
            <div class="galeria-horizontal">
                ${nota.items.map(item => `
                    <div class="imagen-horizontal-container">
                        <img src="${baseUrl}${item.archivo}" alt="${nota.nombre || 'Imagen de nota'}" class="imagen-horizontal">
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    const detalleHTML = `
        <div class="nota-detalle">
            <h2>${nota.nombre || 'Sin título'}</h2>
            ${imagenesHTML}
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
                dots: true
            }
        }
    });
}