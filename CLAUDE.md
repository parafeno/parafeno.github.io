# Contexto del proyecto

Portfolio de Pablo Aragón (marca: Parafeno), artista visual y generalista CGI
en Madrid. Sustituye al parafeno.com actual, hecho en WordPress con el tema
Semplice y alojado en EasyWP.

## Decisiones tomadas

- Primero los datos y las páginas de proyecto. La portada, al final: es solo
  una vista sobre los datos y se puede cambiar sin tocar los proyectos.
- Dirección visual: bariscavusoglu.info. Tipografía serif sin adornos,
  acento magenta, cero decoración, e índice lateral permanente con todos los
  proyectos siempre a la vista. Sustituye a la rejilla sobria de mivides.com
  que se probó primero (queda en el historial de git, commit dd817f9).
- El diagrama de nodos conectados por líneas para la portada se explora
  después, sobre el mismo modelo de datos.
- Vídeo fuera del repositorio, en Vimeo. Imágenes en webp dentro de `media/`.
  Motivo: GitHub Pages tiene un límite de 100 MB por archivo, ~1 GB de repo y
  100 GB/mes de tráfico, y Git conserva los binarios en el historial para
  siempre aunque se borren.
- El blog (hoy en el repo `parafeno.github.io`) se migrará dentro de este
  sitio, en `/blog`, cuando el portfolio esté terminado. Hasta entonces no se
  toca.
- El WordPress de EasyWP sigue vivo hasta que este sitio esté terminado y
  convenza. No se cancela nada antes.

## Cómo trabajar con Pablo

Es experto en CGI y cómodo con la terminal, pero nuevo en desarrollo web.
Explicaciones en lenguaje accesible, archivos completos listos para copiar y
pegar en vez de fragmentos sueltos, y valoraciones profesionales honestas por
delante cuando algo sea mala idea o más trabajo del que parece. En español y
sin em dashes.

- Idioma: el contenido visible está en inglés, igual que el parafeno.com
  actual, porque los clientes son internacionales. Los nombres de campos y
  de clases CSS siguen en español, son código.
- Pipeline de media: los originales pesados van en `originales/`, que está
  excluido de git. `npm run imagenes` los convierte a webp en tres anchos
  dentro de `media/`, que sí se sube. Los vídeos se recomprimen con ffmpeg
  sin pista de audio antes de entrar en `media/`.

## Convenciones del código

- Nombres de campos y de clases CSS en español, sin acentos en los nombres de
  archivo ni en los identificadores.
- Un archivo `.md` por proyecto en `src/proyectos/`. El nombre del archivo es
  la dirección de la página.
- Los campos fijos de un proyecto son solo los que necesita la maquinaria:
  `titulo`, `cliente`, `anio`, `tipo` y `orden`. Todo lo demás va en `datos`,
  una lista de líneas libres, porque cada proyecto tiene datos distintos.
- `tipo` admite un valor suelto o una lista: hay proyectos que son comerciales
  y personales a la vez.
- Las rutas de imagen van sin extensión: el atajo `{% imagen %}` monta el
  srcset a partir del manifiesto `src/_data/imagenes.json`.
- Toda la apariencia se controla desde las variables de `:root` en
  `src/assets/css/estilo.css`.
