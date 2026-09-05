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

miniatura:
  src: /media/nombre-proyecto/miniatura.webp
  alt: "Descripción corta de la imagen"

media:
  # Imagen
  - tipo: imagen
    src: /media/nombre-proyecto/01.webp
    alt: "Descripción"

  # Vídeo en Vimeo (id = el número final de la dirección del vídeo)
  - tipo: vimeo
    id: "123456789"
    ratio: "16 / 9"
    caption: ""

  # Vídeo en YouTube
  - tipo: youtube
    id: "dQw4w9WgXcQ"
    ratio: "16 / 9"

  # Vídeo como archivo suelto (solo para clips muy cortos y ligeros)
  - tipo: video
    src: /media/nombre-proyecto/loop.mp4
    poster: /media/nombre-proyecto/loop.webp
    ratio: "16 / 9"

creditos:
  - "Dirección: Pablo Aragón"
  - "Producción: "

etiquetas: ["cgi"]
---

Texto del proyecto. Puede ser un párrafo o veinte, o ninguno.
