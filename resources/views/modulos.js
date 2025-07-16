
/**
 * Función que carga los módulos desde la API y los muestra en el menú dinámico.
 * @param {string} urlApi 
 * @param {string} contenedor
 */
export function modulosAside(urlApi, contenedor) {
    $.ajax({
        url: urlApi,
        method: 'GET',
        dataType: 'json',
        success: function (modulos) {
            const $menu = $('#' + contenedor);
            $menu.empty();

            // Obtener la ruta/hash actual
            const currentPath = window.location.pathname + window.location.hash;
            let moduloActivoEncontrado = false;

            // Filtrar y ordenar módulos activos
            const modulosActivos = modulos
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
                    .attr('href', modulo.enlace || '#')
                    .text(modulo.nombre);

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