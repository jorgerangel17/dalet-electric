export interface Project {
  slug: string;
  name: { es: string; en: string };
  location?: string;
  infrastructure: { es: string; en: string };
  capacity?: string;
  status?: "in-development" | "in-progress" | "completed";
  scopeAttribution?: "dalet" | "project";
  scope: { es: string; en: string };
  description: { es: string; en: string };
  images: { src: string; alt: { es: string; en: string } }[];
}
// Publish only verified projects with permission to use their images.
export const projects: Project[] = [
  {
    slug: "gama-park-santa-catarina",
    name: { es: "Gama Park", en: "Gama Park" },
    location: "Santa Catarina, Nuevo León, México",
    infrastructure: {
      es: "Infraestructura eléctrica aérea en media tensión",
      en: "Overhead medium-voltage electrical infrastructure",
    },
    capacity: "800 kW",
    status: "in-progress",
    scope: {
      es: "Gestión ante CFE desde la factibilidad hasta la obtención del resolutivo y el convenio; ingeniería eléctrica y diseño de alumbrado público.",
      en: "CFE coordination from power feasibility through issuance of the formal determination and agreement; electrical engineering and public lighting design.",
    },
    description: {
      es: "Proyecto de construcción de infraestructura eléctrica aérea en media tensión para Gama Park, en Santa Catarina, Nuevo León, con una capacidad instalada de 800 kW. Actualmente en ejecución.",
      en: "Construction of overhead medium-voltage electrical infrastructure for Gama Park in Santa Catarina, Nuevo León, Mexico, with an installed capacity of 800 kW. Currently in progress.",
    },
    // Add only photographs authorized for publication; do not use stock project imagery.
    images: [],
  },
  {
    slug: "paseo-la-fe",
    name: {
      es: "Paseo la Fe",
      en: "Paseo la Fe",
    },
    infrastructure: {
      es: "Subestación eléctrica",
      en: "Electrical substation",
    },
    capacity: "500 kVA",
    status: "completed",
    scopeAttribution: "project",
    scope: {
      es: "Suministro, maniobras, libranza eléctrica, pruebas e instalación de la subestación.",
      en: "Substation supply, equipment handling, scheduled power outage coordination, testing and installation.",
    },
    description: {
      es: "Proyecto ejecutado de suministro e instalación de una subestación eléctrica de 500 kVA.",
      en: "Completed supply and installation project for a 500 kVA electrical substation.",
    },
    images: [],
  },
  {
    slug: "paseo-leones",
    name: {
      es: "Paseo Leonés",
      en: "Paseo Leonés",
    },
    infrastructure: {
      es: "Subestación eléctrica",
      en: "Electrical substation",
    },
    capacity: "500 kVA",
    status: "completed",
    scopeAttribution: "project",
    scope: {
      es: "Suministro, maniobras, libranza eléctrica, pruebas e instalación de la subestación.",
      en: "Substation supply, equipment handling, scheduled power outage coordination, testing and installation.",
    },
    description: {
      es: "Proyecto ejecutado de suministro e instalación de una subestación eléctrica de 500 kVA.",
      en: "Completed supply and installation project for a 500 kVA electrical substation.",
    },
    images: [],
  },
  {
    slug: "paseo-juarez",
    name: {
      es: "Paseo Juárez",
      en: "Paseo Juárez",
    },
    infrastructure: {
      es: "Mantenimiento eléctrico de subestaciones",
      en: "Electrical substation maintenance",
    },
    status: "completed",
    scopeAttribution: "project",
    scope: {
      es: "Pruebas de aceite, libranza eléctrica, pruebas de relación de transformación (TTR), medición de resistencia de aislamiento con megóhmetro, limpieza y termografías.",
      en: "Insulating oil testing, scheduled power outage coordination, transformer turns ratio (TTR) testing, insulation resistance testing with a megohmmeter, cleaning and thermographic inspections.",
    },
    description: {
      es: "Trabajos ejecutados de mantenimiento eléctrico a las subestaciones de la plaza.",
      en: "Completed electrical maintenance work on the shopping center’s substations.",
    },
    images: [],
  },
  {
    slug: "umf-15-imss",
    name: {
      es: "UMF-15 · IMSS",
      en: "UMF-15 · IMSS",
    },
    infrastructure: {
      es: "Instalaciones eléctricas en media y baja tensión",
      en: "Medium- and low-voltage electrical installations",
    },
    status: "in-progress",
    scopeAttribution: "project",
    scope: {
      es: "Construcción de acometida y medición; canalizaciones y cableado de media y baja tensión; instalación de charola y soportería de fuerza; alumbrado exterior y malla de tierras.",
      en: "Service entrance and metering construction; medium- and low-voltage raceways and cabling; cable tray and power support installation; exterior lighting and grounding grid.",
    },
    description: {
      es: "Proyecto de construcción eléctrica para la UMF-15 del IMSS, actualmente en proceso.",
      en: "Electrical construction project for IMSS Family Medicine Unit 15 (UMF-15), currently in progress.",
    },
    images: [],
  },
  {
    slug: "estacion-aeropuerto-metrorrey",
    status: "in-progress",
    name: {
      es: "Estación Aeropuerto · Metrorrey",
      en: "Aeropuerto Station · Metrorrey",
    },
    infrastructure: {
      es: "Sistemas de tierras, protección contra descargas atmosféricas e instalaciones de baja tensión",
      en: "Grounding, lightning protection and low-voltage electrical systems",
    },
    scopeAttribution: "project",
    scope: {
      es: "Construcción del sistema de tierras y sistema pararrayos; canalizaciones y cableado de baja tensión; instalación de alumbrado y alimentaciones eléctricas a semáforos y torniquetes.",
      en: "Construction of grounding and lightning protection systems; low-voltage raceways and cabling; lighting installation and power feeds to signals and turnstiles.",
    },
    description: {
      es: "Infraestructura eléctrica para la estación Aeropuerto de Metrorrey.",
      en: "Electrical infrastructure for Metrorrey’s Aeropuerto station.",
    },
    images: [],
  },
];
