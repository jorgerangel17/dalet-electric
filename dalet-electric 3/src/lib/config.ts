export const siteConfig = {
  group: { name: "Total Solutions of Energy", url: "https://tsenergy.mx" },
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000",
  configured: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
  logo: process.env.NEXT_PUBLIC_LOGO_PATH || "/images/dalet-official.png",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "ventas@daletelectric.com.mx",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "",
  address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS || "",
};
