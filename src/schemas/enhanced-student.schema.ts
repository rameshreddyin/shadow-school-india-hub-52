
import { z } from "zod";

const phoneRegex = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/;

export const enhancedStudentSchema = z.object({
  // Personal Details
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Please select a gender" }),
  }),
  dateOfBirth: z.date({
    required_error: "Date of birth is required",
    invalid_type_error: "Please enter a valid date",
  }),
  bloodGroup: z.string().optional(),
  religion: z.string().optional(),
  category: z.enum(["general", "obc", "sc", "st", "other"]).optional(),
  aadharNumber: z.string().optional(),
  
  // Parent/Guardian Information
  fatherName: z.string().trim().min(2, "Father's name must be at least 2 characters"),
  fatherPhone: z.string().trim().regex(phoneRegex, "Please enter a valid phone number"),
  fatherOccupation: z.string().optional(),
  motherName: z.string().trim().min(2, "Mother's name must be at least 2 characters"),
  motherPhone: z.string().trim().regex(phoneRegex, "Please enter a valid phone number").optional(),
  motherOccupation: z.string().optional(),
  guardianName: z.string().optional(),
  guardianPhone: z.string().optional(),
  guardianRelation: z.string().optional(),
  
  // Address Information
  address: z.string().trim().min(5, "Address must be at least 5 characters"),
  city: z.string().trim().min(2, "City is required"),
  state: z.string().trim().min(2, "State is required"),
  pincode: z.string().trim().min(6, "Valid pincode is required"),
  
  // Previous School Details
  previousSchool: z.string().optional(),
  previousClass: z.string().optional(),
  boardOfStudy: z.string().optional(),
  transferCertificate: z.boolean().default(false),
  
  // Health Information
  medicalConditions: z.string().optional(),
  allergies: z.string().optional(),
  emergencyContact: z.string().trim().regex(phoneRegex, "Please enter a valid emergency contact").optional(),
  
  // Additional Information
  email: z.string().trim().email("Please enter a valid email address").optional(),
  photo: z.instanceof(File).optional(),
  
  // System fields
  admissionNumber: z.string().trim().min(1, "Admission number is required"),
  status: z.enum(["draft", "not_enrolled", "enrolled", "deleted"]).default("draft"),
});

export type EnhancedStudentFormValues = z.infer<typeof enhancedStudentSchema>;
