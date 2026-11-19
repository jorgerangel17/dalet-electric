import { z } from "zod";
export const leadSchema = z
  .object({
    kind: z.enum(["feasibility", "contact"]),
    locale: z.enum(["es", "en"]),
    name: z.string().trim().min(2).max(120),
    company: z.string().trim().min(2).max(160),
    email: z.email().max(254),
    phone: z
      .string()
      .trim()
      .min(7)
      .max(40)
      .regex(/^[+\d\s().-]+$/),
    location: z.string().trim().max(180).optional(),
    projectType: z.string().max(80).optional(),
    capacity: z.string().trim().max(60).optional(),
    startDate: z.string().max(10).optional(),
    message: z.string().trim().min(20).max(5000),
    consent: z.literal(true),
    website: z.string().max(0),
    startedAt: z.number(),
  })
  .superRefine((data, ctx) => {
    if (data.kind === "feasibility") {
      for (const key of [
        "location",
        "projectType",
        "capacity",
        "startDate",
      ] as const) {
        if (!data[key]?.trim())
          ctx.addIssue({ code: "custom", path: [key], message: "required" });
      }
      if (
        data.capacity &&
        (!/^\d+(?:[.,]\d+)?\s*(kW|MW)$/i.test(data.capacity) ||
          parseFloat(data.capacity.replace(",", ".")) <= 0)
      )
        ctx.addIssue({
          code: "custom",
          path: ["capacity"],
          message: "capacity",
        });
      if (data.startDate && !/^\d{4}-\d{2}-\d{2}$/.test(data.startDate))
        ctx.addIssue({ code: "custom", path: ["startDate"], message: "date" });
    }
  });
export type LeadInput = z.infer<typeof leadSchema>;
