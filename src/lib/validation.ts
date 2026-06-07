import { z } from "zod";

export const rsvpSchema = z
  .object({
    clientRequestId: z.string().uuid(),
    side: z.enum(["groom", "bride"]),
    attendance: z.enum(["attending", "declined"]),
    meal: z.enum(["yes", "no", "undecided"]).optional(),
    name: z.string().trim().min(1, "이름을 입력해 주세요.").max(40),
    phone: z.string().trim().max(30).optional().or(z.literal("")),
    companionCount: z.coerce.number().int().min(0).max(20).default(0),
    companionNames: z.string().trim().max(300).optional().or(z.literal("")),
    memo: z.string().trim().max(500).optional().or(z.literal("")),
    privacyAgreed: z.literal(true)
  })
  .superRefine((value, ctx) => {
    if (value.attendance === "attending" && !value.meal) {
      ctx.addIssue({
        code: "custom",
        path: ["meal"],
        message: "참석하시는 경우 식사 여부를 선택해 주세요."
      });
    }
  });

export const guestbookSchema = z.object({
  clientRequestId: z.string().uuid(),
  name: z.string().trim().min(1, "이름을 입력해 주세요.").max(40),
  message: z.string().trim().min(1, "메시지를 입력해 주세요.").max(300)
});

export const adminLoginSchema = z.object({
  password: z.string().min(1)
});

export const guestbookAdminPatchSchema = z.object({
  action: z.enum(["hide", "show", "delete"])
});

export type RsvpPayload = z.infer<typeof rsvpSchema>;
export type GuestbookPayload = z.infer<typeof guestbookSchema>;
