
import { z } from "zod";

export const enrollmentSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  academicYear: z.string().min(1, "Academic year is required"),
  class: z.string().min(1, "Class is required"),
  section: z.string().min(1, "Section is required"),
  rollNumber: z.string().min(1, "Roll number is required"),
  feeStructure: z.string().min(1, "Fee structure is required"),
  additionalFees: z.array(z.string()).optional(),
  scholarship: z.object({
    type: z.enum(["percentage", "amount"]).optional(),
    value: z.number().min(0).optional(),
    description: z.string().optional(),
  }).optional(),
  status: z.enum(["draft", "enrolled", "promoted", "left"]).default("enrolled"),
  enrollmentDate: z.date().default(() => new Date()),
});

export type EnrollmentFormValues = z.infer<typeof enrollmentSchema>;
