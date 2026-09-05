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

  eleventyConfig.addCollection("comerciales", (api) =>
    api.getFilteredByTag("proyecto").filter((p) => p.data.tipo === "comercial").sort(ordenar)
  );

  eleventyConfig.addCollection("personales", (api) =>
    api.getFilteredByTag("proyecto").filter((p) => p.data.tipo === "personal").sort(ordenar)
  );

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
