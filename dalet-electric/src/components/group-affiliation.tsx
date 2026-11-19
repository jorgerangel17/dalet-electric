import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/config";
export async function GroupAffiliation({
  compact = false,
}: {
  compact?: boolean;
}) {
  const t = await getTranslations("group");
  return (
    <p
      className={`group-affiliation${compact ? " group-affiliation-compact" : ""}`}
    >
      {t.rich("statement", {
        group: (chunks) => (
          <a
            href={siteConfig.group.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("linkLabel")}
          >
            {chunks}
            <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        ),
      })}
    </p>
  );
}
