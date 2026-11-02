# La Plaza Zaratán

Propuesta de web estática, adaptable a móvil y preparada para publicar como sitio independiente. No sustituye CuentaClara, que se conserva en la raíz del workspace.

## Abrir localmente

Puedes abrir `index.html` directamente en el navegador. Para simular un hosting estático, desde esta carpeta ejecuta:

```powershell
py -m http.server 8000
```

Abre `http://127.0.0.1:8000`. No requiere instalar paquetes ni ejecutar backend.

## Personalización

- **Datos del negocio:** edita `js/config.js`. Completa horarios, redes, correo y dominio solo cuando el establecimiento los confirme.
- **Carta:** `js/menu.js` contiene los platos y precios facilitados, agrupados en desayunos y raciones. La web permite buscar por nombre y filtrar por categoría. Actualiza el archivo cuando cambie la carta; no añadas ingredientes o alérgenos no confirmados.
- **Textos y estilos:** edita `index.html` y `css/styles.css`.
- **Fotografías:** las ocho imágenes están en `assets/images/`: café, croquetas, hamburguesa, dos tablas, patatas bravas, torreznos y calamares a la romana. Las tres imágenes nuevas se asignaron a los platos correspondientes en `js/menu.js` y la galería. Revisa `LICENSES-AND-ASSETS.md` antes de publicar.
- **Datos legales y marca:** la marca tipográfica es provisional. Completa `legal.html` cuando el titular proporcione datos confirmados.

Los nombres de archivo sugieren que las imágenes podrían estar generadas con Gemini; la procedencia y autenticidad fotográfica no se han verificado. Por eso los rótulos las tratan como referencias recibidas. La imagen de hamburguesa no confirma que sea la burger de pollo de la carta.

## Comprobaciones antes de publicar

1. Confirmar que la carta y los precios siguen vigentes y consultar la disponibilidad actual.
2. Confirmar que las imágenes representan platos reales del establecimiento y que se pueden publicar; reemplazarlas por fotos autorizadas si no.
3. Confirmar horarios, logotipo, redes, correo, servicios de reserva y datos legales del titular.
4. Revisar teléfono, dirección, enlaces, teclado y menú móvil.

No se incorporan reservas, formularios, analítica ni cookies no esenciales. No hay dominio definitivo, por lo que no se generan sitemap ni robots.txt.


## Opiniones y valoración

El enlace corto de Google Maps no pudo abrirse directamente desde la herramienta de consulta. Restaurant Guru muestra Google 4,6/5 y 107 votos (https://restaurantguru.com/La-Plaza-Zaratan-Zaratan); BillaresCerca muestra 4,6/5 y 105 valoraciones (https://www.billarescerca.com/valladolid/zaratan/la-plaza-zaratan/). La web presenta 4,6/5 y «más de 100 opiniones», con fecha de consulta 2 de noviembre de 2026, para reflejar la diferencia de recuento sin fijar una cifra exacta. Los temas sobre el trato, las raciones y las croquetas son una síntesis de opiniones visibles, no citas textuales. Confirmar el dato directamente en Google Maps antes de publicar.

## Publicación

El sitio es estático y compatible con GitHub Pages o Cloudflare Pages. En GitHub Pages selecciona en Settings → Pages la rama y carpeta que contienen el sitio. En Cloudflare Pages conecta el repositorio, usa `plaza-zaratan` como directorio raíz del sitio y deja vacío el comando de build. Para un dominio propio, configúralo en el proveedor de hosting y actualiza `canonicalUrl` en `js/config.js` cuando esté confirmado.

El proyecto no requiere backend, claves API ni servicios de pago. Google Fonts y Maps requieren conexión a internet.
