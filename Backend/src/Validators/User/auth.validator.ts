import z from "zod"
import { GenderEnum } from "../../Common/index.js"
import { isValidObjectId } from "mongoose"


export const SignUpValidator = {
    body: z.strictObject({
        firstName: z.string().min(3).max(10),
        lastName: z.string().min(3).max(10),
        email: z.email(),
        password: z.string(),
        passwordConfirmation: z.string(),
        gender: z.enum(GenderEnum),
        DOB: z.date().optional(),
        phoneNumber: z.string().min(11).max(11),
    })
        .safeExtend({
            userId: z.string().optional()
        })
        .superRefine((val, ctx) => {
            // password match
            if (val.password !== val.passwordConfirmation) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Passwords do not match",
                    path: ["passwordConfirmation"],
                })
            }
            // user is valid moongose id
            if (val.userId && !isValidObjectId(val)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Invalid user id",
                    path: ["userId"],
                })
            }
        })


    // .extend({ userId: z.string().optional() })
    // .refine((data ) => {
    //     if (data.password !== data.passwordConfirmation) return false
    //     return true
    // },
    //     { path: ["passwordConfirmation"], message: "Passwords do not match" }
    // )

}