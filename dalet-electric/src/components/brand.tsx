import Image from "next/image";
import { siteConfig } from "@/lib/config";
export function Brand() {
  return siteConfig.logo ? (
    <Image
      src={siteConfig.logo}
      alt="Dalet Electric"
      width={1801}
      height={815}
      className="brand-image"
      priority
    />
  ) : (
    <span className="brand-text">
      DALET<span>ELECTRIC</span>
    </span>
  );
}
