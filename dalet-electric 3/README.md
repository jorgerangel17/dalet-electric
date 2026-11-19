# DALET ELECTRIC

Sitio corporativo bilingüe en Next.js App Router, TypeScript, Tailwind CSS 4, Motion, next-intl, React Hook Form, Zod y Lucide. Preparado para Vercel; no necesita base de datos para recibir solicitudes por correo.

## Instalación y ejecución

Requiere Node.js 22 o 24 y npm.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Abrir http://localhost:3000/es. La raíz redirige a `/es`; el selector permite cambiar a `/en` conservando la página. Los cambios en `.env.local` requieren reiniciar el servidor.

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm start
```

## Configuración antes de publicar

1. El logotipo oficial está incluido en `public/images/dalet-official.png` e integrado por defecto en encabezado y pie. Se descargó del enlace de Drive proporcionado y se conserva byte por byte, sin modificar colores ni contenido. `NEXT_PUBLIC_LOGO_PATH` permite configurar otra ubicación; `Brand` y `object-fit: contain` conservan las proporciones originales (1801 × 815).
2. Establecer `NEXT_PUBLIC_SITE_URL` con el dominio HTTPS definitivo, sin barra final. Sin él, el sitio queda con `noindex`, robots bloqueado y sitemap vacío para evitar indexación con URLs locales.
3. Completar correo, teléfono y dirección verificados con las variables `NEXT_PUBLIC_CONTACT_*`. Los espacios vacíos no generan datos inventados.
4. Completar y aprobar el aviso de privacidad en **ambos** archivos de traducción, incluyendo razón social, domicilio del responsable, canal ARCO, transferencias/proveedores y política de conservación. Reemplazar el texto provisional (`privacy.draft`) con el aviso aprobado. Después establecer `PRIVACY_NOTICE_APPROVED=true`.
5. Configurar el envío real descrito a continuación.

## Formularios y envío real

Los formularios de factibilidad y contacto llaman a `POST /api/leads`. La API valida de nuevo en el servidor. Usa **Resend** mediante HTTPS; crear la cuenta, verificar el dominio remitente y configurar:

```dotenv
RESEND_API_KEY=re_...
LEADS_FROM_EMAIL=DALET Electric <formularios@dominio-verificado.mx>
LEADS_TO_EMAIL=correo-corporativo-confirmado@dominio.mx
PRIVACY_NOTICE_APPROVED=true
```

No se envían datos ni se muestran éxitos simulados sin estos valores. El botón permanece deshabilitado con un aviso visible y la API devuelve 503. Cuando Resend acepta el envío y devuelve un identificador, se confirma la solicitud; la aceptación por el proveedor no garantiza entrega final en bandeja. Configurar monitoreo de entregas en Resend.

Protecciones: esquema Zod en cliente y servidor, consentimiento obligatorio, honeypot, intervalo mínimo de 3 segundos, comprobación del origen, límite de tamaño y límite de 5 solicitudes cada 15 minutos. No se registran los datos del formulario en consola ni en una base de datos. Se envían como texto plano para evitar inyección HTML. Los correos pueden contener datos personales: gestionar su conservación desde el buzón y proveedor.

Para limitar solicitudes de forma consistente entre instancias de Vercel, configurar `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN`. Se almacena un hash de la IP con expiración de 15 minutos. Sin Redis, el límite es en memoria por proceso y puede reiniciarse; es una protección básica, no un límite global. En Vercel se usa el encabezado de IP sobrescrito por la plataforma; fuera de Vercel se comparte el límite local. Si Redis está configurado pero falla, la API rechaza la solicitud sin enviar correo.

## Despliegue en Vercel

1. Subir esta carpeta a un repositorio Git.
2. Importar el repositorio en Vercel. Si está dentro de un monorepo, seleccionar `dalet-electric` como Root Directory.
3. Seleccionar Next.js; instalación `npm ci`, build `npm run build` y salida predeterminada.
4. Agregar las variables de `.env.example` en Settings → Environment Variables. Las claves de correo y Redis son privadas, nunca usar prefijo `NEXT_PUBLIC_` para ellas.
5. Configurar el dominio y `NEXT_PUBLIC_SITE_URL`; ejecutar un nuevo despliegue después de cambiar variables públicas.
6. Verificar `/es`, `/en`, ambas páginas de contacto, privacidad, `/robots.txt`, `/sitemap.xml`, alternancia de idioma y un envío real de prueba al buzón confirmado. Mantener noindex en previews sin dominio definitivo.

No se realizó un despliegue en la cuenta de Vercel, ya que no hay acceso ni credenciales configuradas para ella.

## Arquitectura

```text
messages/{es,en}.json             Contenido y traducciones completos
public/images/                   Fotografías y logotipo original
src/app/[locale]/page.tsx         Inicio con todas las secciones
src/app/[locale]/contacto/        Contacto independiente
src/app/[locale]/privacidad/      Aviso de privacidad
src/app/[locale]/layout.tsx       Idioma, proveedor i18n, navegación y pie
src/app/api/leads/route.ts        Validación, anti-spam y entrega Resend
src/app/{robots,sitemap}.ts       SEO técnico
src/app/opengraph-image.tsx       Imagen social
src/components/                   Componentes reutilizables
src/i18n/                        Configuración next-intl
src/lib/                         Configuración, SEO, validación y proyectos
src/proxy.ts                     Enrutamiento /es y /en
```

## Proyectos

Agregar únicamente información verificada a `src/lib/projects.ts`. Cada registro soporta nombre bilingüe, ubicación, tipo de infraestructura, capacidad, alcance de DALET, descripción y fotografías con texto alternativo bilingüe. Con una lista vacía se muestra un estado editorial sin proyectos inventados. Las tarjetas publican todos los campos y fotografías configurados.

## Diseño y accesibilidad

Navegación fija, menú móvil con Escape y bloqueo de scroll, enlaces de salto, etiquetas y errores asociados a campos, foco visible, estados de carga y confirmación, imágenes optimizadas con `next/image` y respeto de `prefers-reduced-motion`. Los enlaces a CREXA y privacidad abren otra pestaña con `noopener noreferrer`. No se incorporan estadísticas, clientes, testimonios ni certificaciones inventados.

## SEO

Metadatos por idioma y página, canonical, hreflang ES/EN y x-default, Open Graph, Twitter, sitemap bilingüe y JSON-LD Organization con área de servicio México. El sitio presenta a DALET como desarrolladora de infraestructura en México y a CREXA como brazo constructor y operador. Las rutas de contacto y privacidad conservan el slug español dentro de ambos prefijos de idioma.

## Fotografía

Imagen editorial ilustrativa de líneas eléctricas obtenida de Unsplash: https://images.unsplash.com/photo-1473341304170-971dccb5ac1e. No se presenta como proyecto de DALET. La fotografía de subestación en Leoben (Austria) procede de Aciarium / Wikimedia Commons, licencia CC BY-SA 4.0: https://commons.wikimedia.org/wiki/File:DSC04737_APG_Leoben_Substation,_Leoben-Donawitz,_2026-04.jpg. Se incluye atribución visible y se etiqueta como fotografía ilustrativa. Antes de producción, revisar los derechos de uso aplicables y sustituir o ampliar con fotografías corporativas autorizadas de subestaciones, infraestructura industrial y parques industriales. No debe confundirse la imagen editorial con una obra ejecutada por DALET.

## Verificación

Consultar `VERIFICATION.md` para los resultados ejecutados en el entorno de desarrollo. La revisión visual automatizada en navegador depende de la disponibilidad del runtime de navegador del entorno.

## Datos corporativos confirmados

Dominio: `daletelectric.com.mx` (Cloudflare). Correo público y destinatario de solicitudes: `ventas@daletelectric.com.mx`. El correo ya aparece en contacto y el destinatario está preparado en `.env.example`. Esto no activa el envío: todavía se requieren credenciales de Resend, remitente verificado y aviso de privacidad aprobado. El dominio está preparado como URL de producción en `.env.example`; su conexión en Cloudflare y Vercel sigue pendiente.

## Proyecto publicado: Gama Park

Ficha bilingüe con datos proporcionados por el titular: Santa Catarina, Nuevo León; infraestructura eléctrica aérea en media tensión; capacidad instalada de 800 kW; en ejecución. Alcance de DALET: gestión con CFE desde factibilidad hasta resolutivo y convenio, ingeniería eléctrica y diseño de alumbrado público. No se atribuye a CREXA la ejecución de este proyecto sin confirmación específica. La ficha no utiliza fotografías de stock: las imágenes se incorporarán cuando se proporcionen fotografías autorizadas. El campo `status` admite `in-development`, `in-progress` y `completed`.

## Ampliación del portafolio

Se incorporaron Paseo la Fe y Paseo Leonés (subestaciones de 500 kVA, ejecutados), Paseo Juárez (mantenimiento de subestaciones, ejecutado), UMF-15 IMSS (instalaciones eléctricas, en proceso) y Estación Aeropuerto Metrorrey (sistemas de tierras, pararrayos e instalaciones de baja tensión). Las ubicaciones no proporcionadas se omiten hasta confirmación. El titular confirmó que Estación Aeropuerto Metrorrey está en ejecución (`in-progress`). No se publican capacidades no proporcionadas ni fotografías genéricas como evidencia de proyectos. Los nuevos alcances se presentan como alcance de los trabajos, sin atribuir construcción a DALET o CREXA de forma no confirmada. Los campos `location`, `capacity` y `status` son opcionales.

## Pertenencia al grupo

A petición del titular, se incluye que Dalet Electric forma parte de Total Solutions of Energy. La mención aparece en Nosotros y en el pie de todas las páginas, en ambos idiomas, y en los datos estructurados como organización matriz. Enlace proporcionado por el titular: `https://tsenergy.mx` (se conserva esta escritura exacta); abre en una nueva pestaña con `noopener noreferrer`. No se modifica el modelo DALET + CREXA ni se inventa un logotipo del grupo.
