const fs = require("fs");
const path = require("path");

const MANIFIESTO = path.join("src", "_data", "imagenes.json");

// El manifiesto lo escribe "npm run imagenes" y dice, para cada imagen,
// que anchos existen y cuales son sus proporciones. Se relee solo cuando
// cambia, para no leer el disco en cada imagen de cada pagina.
let cacheDatos = null;
let cacheFecha = 0;
function manifiesto() {
  if (!fs.existsSync(MANIFIESTO)) return {};
  const fecha = fs.statSync(MANIFIESTO).mtimeMs;
  if (cacheDatos === null || fecha !== cacheFecha) {
    cacheDatos = JSON.parse(fs.readFileSync(MANIFIESTO, "utf8"));
    cacheFecha = fecha;
  }
  return cacheDatos;
}

const tieneExtension = (ruta) => /\.[a-z0-9]{2,5}$/i.test(ruta || "");
const escapar = (t) => String(t || "").replace(/"/g, "&quot;");

// Ancho que ocupara la imagen en pantalla. Sirve para que el navegador
// elija el archivo adecuado antes de descargarlo.
const MEDIDAS_CONTENIDO = "(max-width: 760px) 100vw, min(1200px, calc(100vw - 300px))";

module.exports = function (eleventyConfig) {

  // Copiar tal cual al sitio final: los estilos y toda la carpeta media/
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy("media");

  // Recargar el navegador cuando cambie algo en media/
  eleventyConfig.addWatchTarget("media");

  // --- Coleccion de proyectos -------------------------------------------
  // Orden: primero los que tengan "orden" mas alto (para fijar destacados
  // arriba), y dentro del mismo orden, el ano mas reciente primero.
  const ordenar = (a, b) => {
    const oa = a.data.orden || 0;
    const ob = b.data.orden || 0;
    if (ob !== oa) return ob - oa;
    return (b.data.anio || 0) - (a.data.anio || 0);
  };

  eleventyConfig.addCollection("proyectos", (api) =>
    api.getFilteredByTag("proyecto").sort(ordenar)
  );

  // "tipo" admite un valor suelto ("comercial") o una lista
  // ([comercial, personal]) para los proyectos que son las dos cosas.
  const esDeTipo = (p, t) =>
    Array.isArray(p.data.tipo) ? p.data.tipo.includes(t) : p.data.tipo === t;

  eleventyConfig.addCollection("comerciales", (api) =>
    api.getFilteredByTag("proyecto").filter((p) => esDeTipo(p, "comercial")).sort(ordenar)
  );

  eleventyConfig.addCollection("personales", (api) =>
    api.getFilteredByTag("proyecto").filter((p) => esDeTipo(p, "personal")).sort(ordenar)
  );

  // --- Imagenes ----------------------------------------------------------
  // Se usa asi:   {% imagen "/media/proyecto/01", "texto alternativo" %}
  //
  // Si la ruta NO lleva extension, busca en el manifiesto los anchos
  // disponibles y escribe un srcset para que el navegador elija.
  // Si la ruta SI lleva extension (.svg, .jpg...), la usa tal cual.
  eleventyConfig.addShortcode("imagen", function (src, alt, medidas, clase) {
    if (!src) return "";
    const atributoClase = clase ? ` class="${escapar(clase)}"` : "";
    const textoAlt = escapar(alt);

    if (tieneExtension(src)) {
      return `<img src="${src}" alt="${textoAlt}"${atributoClase} loading="lazy" decoding="async">`;
    }

    const info = manifiesto()[src];

    if (!info) {
      // La imagen aun no se ha convertido. Se enlaza el nombre esperado
      // para que se vea que falta, en vez de dejar un hueco silencioso.
      return `<img src="${src}-1200.webp" alt="${textoAlt}"${atributoClase} loading="lazy" decoding="async">`;
    }

    const srcset = info.anchos.map((a) => `${src}-${a}.webp ${a}w`).join(", ");
    const mayor = info.anchos[info.anchos.length - 1];

    return [
      `<img src="${src}-${mayor}.webp"`,
      `srcset="${srcset}"`,
      `sizes="${medidas || MEDIDAS_CONTENIDO}"`,
      `width="${info.ancho}" height="${info.alto}"`,
      `alt="${textoAlt}"${atributoClase}`,
      `loading="lazy" decoding="async">`
    ].join(" ");
  });

  // --- Filtros -----------------------------------------------------------
  // "otros": devuelve hasta n proyectos de la coleccion, quitando el actual.
  eleventyConfig.addFilter("otros", (coleccion, urlActual, n) =>
    coleccion.filter((p) => p.url !== urlActual).slice(0, n || 6)
  );

  // "limitar": corta cualquier lista a los n primeros elementos.
  eleventyConfig.addFilter("limitar", (lista, n) => lista.slice(0, n));

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
