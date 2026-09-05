// Valores por defecto para TODOS los archivos dentro de src/exposiciones/.
// Cada exposicion vive en su propia direccion bajo /work/, igual que un
// proyecto, porque las piezas que la componen tambien viven ahi y no pueden
// convivir en dos sitios.
module.exports = {
  layout: "layouts/exposicion.njk",
  tags: ["exposicion"],
  permalink: "/work/{{ page.fileSlug }}/index.html"
};
