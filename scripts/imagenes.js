/* =====================================================================
   Conversion de imagenes para el sitio.

   Lee todo lo que haya en  originales/   (carpeta que NO se sube a git)
   y escribe versiones webp optimizadas en  media/  (que si se sube).

   De cada imagen genera tres anchos: 600, 1200 y 2000 pixeles. El sitio
   elige solo cual sirve segun la pantalla de quien mira.

   Se ejecuta con:   npm run imagenes

   Solo convierte lo que ha cambiado, asi que se puede lanzar tantas
   veces como se quiera sin coste.
   ===================================================================== */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ORIGEN = "originales";
const DESTINO = "media";
const MANIFIESTO = path.join("src", "_data", "imagenes.json");

const ANCHOS = [600, 1200, 2000];
const CALIDAD = 78;
const EXTENSIONES = [".jpg", ".jpeg", ".png", ".tif", ".tiff", ".webp", ".avif"];

// ---------------------------------------------------------------------

function recorrer(dir, encontrados = []) {
  if (!fs.existsSync(dir)) return encontrados;
  for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
    const ruta = path.join(dir, entrada.name);
    if (entrada.isDirectory()) recorrer(ruta, encontrados);
    else if (EXTENSIONES.includes(path.extname(entrada.name).toLowerCase())) {
      encontrados.push(ruta);
    }
  }
  return encontrados;
}

const aUrl = (p) => "/" + p.split(path.sep).join("/");
const kb = (bytes) => Math.round(bytes / 1024);

async function main() {
  const originales = recorrer(ORIGEN);

  if (originales.length === 0) {
    console.log(`No hay nada en ${ORIGEN}/. Mete ahi las imagenes originales,`);
    console.log(`una carpeta por proyecto, y vuelve a ejecutar el comando.`);
    fs.mkdirSync(path.dirname(MANIFIESTO), { recursive: true });
    fs.writeFileSync(MANIFIESTO, "{}\n");
    return;
  }

  const manifiesto = {};
  let convertidas = 0;
  let saltadas = 0;
  let pesoTotal = 0;

  for (const original of originales) {
    const relativa = path.relative(ORIGEN, original);          // proyecto/01.png
    const sinExtension = relativa.slice(0, -path.extname(relativa).length);
    const base = aUrl(path.join(DESTINO, sinExtension));       // /media/proyecto/01

    let meta;
    try {
      meta = await sharp(original).metadata();
    } catch (e) {
      console.log(`  ! No se ha podido leer ${original}: ${e.message}`);
      continue;
    }

    // Nunca agrandamos una imagen: solo generamos los anchos que caben.
    let anchos = ANCHOS.filter((a) => a <= meta.width);
    if (anchos.length === 0) anchos = [meta.width];

    const carpetaSalida = path.join(DESTINO, path.dirname(relativa));
    fs.mkdirSync(carpetaSalida, { recursive: true });

    const mtimeOriginal = fs.statSync(original).mtimeMs;

    for (const ancho of anchos) {
      const salida = path.join(DESTINO, `${sinExtension}-${ancho}.webp`);

      if (fs.existsSync(salida) && fs.statSync(salida).mtimeMs >= mtimeOriginal) {
        saltadas++;
        pesoTotal += fs.statSync(salida).size;
        continue;
      }

      await sharp(original)
        .resize({ width: ancho, withoutEnlargement: true })
        .webp({ quality: CALIDAD, effort: 5 })
        .toFile(salida);

      const peso = fs.statSync(salida).size;
      pesoTotal += peso;
      convertidas++;
      console.log(`  ${aUrl(salida)}  ${kb(peso)} KB`);
    }

    const mayor = Math.max(...anchos);
    manifiesto[base] = {
      anchos,
      ancho: mayor,
      alto: Math.round((meta.height * mayor) / meta.width)
    };
  }

  fs.mkdirSync(path.dirname(MANIFIESTO), { recursive: true });
  fs.writeFileSync(MANIFIESTO, JSON.stringify(manifiesto, null, 2) + "\n");

  console.log("");
  console.log(`Originales encontrados: ${originales.length}`);
  console.log(`Archivos nuevos: ${convertidas}   sin cambios: ${saltadas}`);
  console.log(`Peso total de ${DESTINO}/: ${kb(pesoTotal)} KB`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
