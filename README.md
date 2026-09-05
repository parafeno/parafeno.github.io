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

    originales/             originales pesados. NO se suben a git
    media/                  versiones optimizadas. Estas sí se suben
    scripts/imagenes.js     conversor de originales/ a media/
    src/proyectos/          un archivo .md por proyecto
    src/proyectos/_PLANTILLA.md   plantilla para duplicar
    src/_includes/layouts/  esqueletos de página
    src/_includes/partials/ trozos reutilizables (rejilla, media)
    src/_data/site.js       datos globales (nombre, email, dominio)
    src/_data/imagenes.json lo genera el conversor. No se toca a mano
    src/assets/css/         hoja de estilos
    eleventy.config.js      colecciones, orden, filtros, atajo de imagen

## Añadir un proyecto

1. Mete los originales en `originales/nombre-del-proyecto/`.
2. Ejecuta `npm run imagenes`. Aparecen las webp en `media/`.
3. Duplica `src/proyectos/_PLANTILLA.md` y renómbralo. El nombre del
   archivo es la dirección de la página: minúsculas, sin acentos, con
   guiones en vez de espacios.
4. Borra las líneas `permalink: false` y `eleventyExcludeFromCollections`.
5. Rellena los datos. Las rutas de imagen van **sin extensión**:
   `/media/nombre-del-proyecto/01`.

## Reglas de peso

**Los originales nunca entran en git.** Git guarda para siempre todo lo
que se sube, aunque luego se borre: un PNG de 30 MB reemplazado una vez
son 60 MB permanentes en el repositorio. Por eso `originales/` está
excluido y solo viaja lo que genera el conversor.

| Qué                              | Dónde vive        | Objetivo        |
|----------------------------------|-------------------|-----------------|
| Imágenes fijas                   | `media/`, en webp | 600/1200/2000px |
| Loops cortos sin sonido (<10 s)  | `media/`, en mp4  | menos de 3 MB   |
| Piezas completas con sonido      | Vimeo             | fuera del repo  |

GitHub Pages tiene un límite duro de 100 MB por archivo y recomienda no
pasar de 1 GB de repositorio. Con estas reglas hay sitio de sobra.

### Exportar un loop corto

Desde After Effects o con ffmpeg, a 1920 de ancho como mucho:

    ffmpeg -i entrada.mov -vf "scale=1920:-2" -c:v libx264 -crf 26 \
           -pix_fmt yuv420p -an -movflags +faststart salida.mp4

`-an` quita el audio, que en un loop no se usa y pesa.
Para el poster, exporta un fotograma a `originales/` y conviértelo con
`npm run imagenes` como una imagen más.
