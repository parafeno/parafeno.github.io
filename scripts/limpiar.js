/* Borra la carpeta _site antes de generar el sitio.

   Eleventy escribe encima de lo que ya hay, pero no borra lo que sobra. Si
   se renombra o se elimina una página, la versión vieja se queda en _site
   y acabaría publicada. Esto evita ese arrastre. */

const fs = require("fs");

fs.rmSync("_site", { recursive: true, force: true });
console.log("_site limpio");
