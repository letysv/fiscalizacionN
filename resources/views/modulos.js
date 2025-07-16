
/**
 * Función que carga los módulos desde la API y los muestra en el menú dinámico.
 * @param {string} urlApi 
 * @param {string} contenedor
 */
export function modulosAside(settings) {
    $.ajax({
        url: settings.url_api,
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            const $menu = $('#' + settings.menu_container);
            $menu.empty();

            // Obtener la ruta/hash actual
            const currentPath = window.location.pathname + window.location.hash;
            let moduloActivoEncontrado = false;

            // Filtrar y ordenar módulos activos
            const modulosActivos = data
                .filter(modulo => modulo.activo)
                .sort((a, b) => a.orden - b.orden);

            // Si no hay módulos activos
            if (modulosActivos.length === 0) {
                $menu.html('<li class="text-muted">No hay módulos disponibles</li>');
                return;
            }

            // Crear ítems del menú
            modulosActivos.forEach(modulo => {
                const $li = $('<li></li>');
                const $a = $('<a></a>')
                    .attr('href', modulo.link || '#')
                    .attr('target', '_blank')
                    .text(modulo.nombre);


                $a.on('click', function (e) {
                    e.preventDefault(); // Prevenir el comportamiento por defecto del enlace
                    const api = settings.url_base + 'api/modulo/' + modulo.id;
                    // console.log('Hiciste clic en ', modulo.nombre, modulo.link, 'api:', api);
                    settings.url_api = api;
                    settings.title = modulo.nombre;
                    muestraContenido(settings);
                });

                // Determinar si es el ítem activo
                const esActivo = currentPath.includes(modulo.enlace) ||
                    (modulo.es_inicio && !moduloActivoEncontrado && currentPath.endsWith('/'));

                if (esActivo) {
                    $a.addClass('active');
                    moduloActivoEncontrado = true;
                }

                // Agregar icono si existe
                if (modulo.icono) {
                    $a.prepend(`<span class="icon ${modulo.icono}"></span> `);
                }

                $li.append($a);
                $menu.append($li);
            });

            // Si ningún ítem quedó activo, activar el primero
            if (!moduloActivoEncontrado && modulosActivos.length > 0) {
                $menu.find('li:first-child a').addClass('active');
            }

            // Inicializar funcionalidad de scroll del template
            if (typeof $.fn.scrolly === 'function') {
                $menu.find('a').scrolly();
            }
        },
        error: function (error) {
            console.error('Error al cargar módulos:', error);
            $('#dynamic-menu').html('<li class="text-danger">Error al cargar el menú</li>');
        }
    });
}

function muestraContenido(settings) {
    // console.log(urlApi)
    const $mainContainer = $('#' + settings.main_container);
    console.log(settings)
    if (settings.title) {
        $mainContainer.find('header.major h2').text(settings.title);
    }
    
    $.ajax({
        url: settings.url_api,
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            // Procesar y mostrar los datos en el contenedor correspondiente
            const $container = $('#' + settings.main_container);
            // $container.empty();
            if (data && data.length > 0) {
                data.forEach(item => {
                    const $item = $('<div class="item"></div>').text(item.titulo);
                    $container.append($item);
                });
            } else {
                $container.html('<p>No hay datos disponibles</p>');
            }
        },
        error: function (error) {
            console.error('Error al cargar contenido:', error);
            const $container = $('#' + settings.datacontainer);
            $container.html('<p class="text-danger">Error al cargar contenido</p>');
        }
    });
}