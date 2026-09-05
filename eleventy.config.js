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

  // Dominio propio para GitHub Pages: sin este archivo en la raiz del
  // sitio publicado, GitHub sirve solo en parafeno.github.io.
  eleventyConfig.addPassthroughCopy({ "src/CNAME": "CNAME" });

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

  // --- Exposiciones conjuntas ---------------------------------------------
  // Una exposicion vive en src/exposiciones/ y tiene su propia pagina bajo
  // /work/. Los proyectos que participaron en ella llevan el campo
  // "exposicion: <slug-de-la-exposicion>" en su frontmatter.
  eleventyConfig.addCollection("exposiciones", (api) =>
    api.getFilteredByTag("exposicion")
  );

  // Agrupa una lista de proyectos ya ordenada: las piezas que comparten
  // "exposicion" se colapsan en un solo item de grupo, en la posicion de
  // la primera pieza que aparece. El resto de la lista no cambia de orden.
  function agrupar(proyectos, exposiciones) {
    const vistos = new Set();
    const resultado = [];
    for (const p of proyectos) {
      const slug = p.data.exposicion;
      if (!slug) {
        resultado.push(p);
        continue;
      }
      if (vistos.has(slug)) continue; // esta pieza ya se representa en el grupo
      vistos.add(slug);
      const expo = exposiciones.find((e) => e.fileSlug === slug);
      if (!expo) {
        resultado.push(p); // la exposicion aun no existe: se ve la pieza suelta
        continue;
      }
      resultado.push({
        esExposicion: true,
        url: expo.url,
        data: expo.data,
        piezas: proyectos.filter((q) => q.data.exposicion === slug)
      });
    }
    return resultado;
  }

  eleventyConfig.addCollection("personalesAgrupado", (api) =>
    agrupar(
      api.getFilteredByTag("proyecto").filter((p) => esDeTipo(p, "personal")).sort(ordenar),
      api.getFilteredByTag("exposicion")
    )
  );

  eleventyConfig.addCollection("comercialesAgrupado", (api) =>
    agrupar(
      api.getFilteredByTag("proyecto").filter((p) => esDeTipo(p, "comercial")).sort(ordenar),
      api.getFilteredByTag("exposicion")
    )
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
  // "limitar": corta cualquier lista a los n primeros elementos.
  eleventyConfig.addFilter("limitar", (lista, n) => lista.slice(0, n));

  // "porSlug": busca en una coleccion la entrada cuyo nombre de archivo
  // (sin extension) es el slug dado. Se usa para ir de un proyecto a la
  // exposicion a la que pertenece.
  eleventyConfig.addFilter("porSlug", (coleccion, slug) =>
    (coleccion || []).find((p) => p.fileSlug === slug)
  );

  // "resolverProyectos": convierte una lista de slugs (nombres de archivo)
  // en las entradas reales de la coleccion de proyectos, en ese orden.
  eleventyConfig.addFilter("resolverProyectos", (coleccion, slugs) =>
    (slugs || [])
      .map((slug) => (coleccion || []).find((p) => p.fileSlug === slug))
      .filter(Boolean)
  );

  // "contieneUrl": true si alguna pieza de la lista tiene esa url. Se usa
  // para abrir el desplegable de una exposicion cuando se esta viendo una
  // de sus piezas. (No se usa el "selectattr" de nunjucks porque en esta
  // version ignora el test "equalto" y solo mira si el atributo es truthy.)
  eleventyConfig.addFilter("contieneUrl", (piezas, url) =>
    (piezas || []).some((p) => p.url === url)
  );

  // "porAnio": reordena una lista ya agrupada (proyectos o exposiciones)
  // por ano, el mas reciente primero. Se usa en la rejilla completa de
  // /art/ y /commissions/, que no respeta el "orden" de destacados del
  // indice lateral. Una exposicion usa su propio "anio", igual que un
  // proyecto.
  eleventyConfig.addFilter("porAnio", (lista) =>
    [...(lista || [])].sort((a, b) => (b.data.anio || 0) - (a.data.anio || 0))
  );

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
