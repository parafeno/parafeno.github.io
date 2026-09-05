---
# ==========================================================================
# PLANTILLA DE PROYECTO
# Duplica este archivo, renómbralo y borra las dos líneas de abajo
# (permalink y eleventyExcludeFromCollections) para que se publique.
# El nombre del archivo es la dirección: "mi-proyecto.md" da
# parafeno.com/proyectos/mi-proyecto/
# Usa solo minúsculas, sin acentos y con guiones en vez de espacios.
# ==========================================================================
permalink: false
eleventyExcludeFromCollections: true

titulo: "Título del proyecto"
cliente: "Nombre del cliente"      # déjalo vacío si es obra personal
anio: 2026
tipo: comercial                    # comercial | personal
rol: "Dirección y CGI"
estudio: ""                        # opcional
orden: 0                           # súbelo (10, 20...) para fijarlo arriba

# La miniatura de la rejilla. Ruta SIN extensión: el sitio elige solo
# entre los tres tamaños que generó "npm run imagenes".
miniatura:
  src: /media/nombre-proyecto/miniatura
  alt: "Descripción corta de la imagen"

media:
  # Imagen. Ruta sin extensión, igual que la miniatura.
  - tipo: imagen
    src: /media/nombre-proyecto/01
    alt: "Descripción"

  # Loop corto sin sonido, alojado aquí mismo. Menos de 10 segundos y
  # menos de 3 MB. El poster es la imagen que se ve mientras carga.
  - tipo: video
    src: /media/nombre-proyecto/loop.mp4
    poster: /media/nombre-proyecto/loop-1200.webp
    ratio: "16 / 9"

  # Pieza completa con sonido, en Vimeo.
  # El id es el número final de la dirección del vídeo.
  - tipo: vimeo
    id: "123456789"
    ratio: "16 / 9"
    caption: ""

  # Lo mismo en YouTube, si el cliente lo tiene ahí.
  - tipo: youtube
    id: "dQw4w9WgXcQ"
    ratio: "16 / 9"

# Cada crédito puede ocupar varias líneas. La barra vertical "|"
# indica que lo de debajo se respeta tal cual, con sus saltos de línea.
creditos:
  - |
    Dirección y CGI:
    Pablo Aragón
  - |
    Producción:
    Nombre del estudio

etiquetas: ["cgi"]
---

Texto del proyecto. Puede ser un párrafo o veinte, o ninguno.
