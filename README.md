# parafeno-web

Portfolio de Pablo Aragón (Parafeno), hecho con Eleventy.

## Ver el sitio en local

    npm install     (solo la primera vez)
    npm start

Abre la dirección que aparece en la terminal, normalmente
http://localhost:8080. Cada vez que guardes un archivo el navegador se
recarga solo.

Para generar el sitio sin servidor:

    npm run build

El resultado queda en `_site/`, que no se sube al repositorio.

## Dónde está cada cosa

    src/proyectos/          un archivo .md por proyecto
    src/proyectos/_PLANTILLA.md   plantilla para duplicar
    src/_includes/layouts/  esqueletos de página
    src/_includes/partials/ trozos reutilizables (rejilla, media)
    src/_data/site.js       datos globales (nombre, email, dominio)
    src/assets/css/         hoja de estilos
    media/                  imágenes del sitio
    eleventy.config.js      configuración: colecciones, orden, filtros

## Añadir un proyecto

1. Duplica `src/proyectos/_PLANTILLA.md`.
2. Renómbralo: minúsculas, sin acentos, guiones en vez de espacios.
   El nombre del archivo es la dirección de la página.
3. Borra las líneas `permalink: false` y `eleventyExcludeFromCollections: true`.
4. Rellena los datos y guarda.

## Media

- **Imágenes**: en `media/nombre-del-proyecto/`, en formato webp.
- **Vídeo**: fuera del repositorio, en Vimeo. En el proyecto solo se guarda
  el número identificador del vídeo.
