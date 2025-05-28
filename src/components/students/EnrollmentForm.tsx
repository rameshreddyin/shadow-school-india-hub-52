
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Plus, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { enrollmentSchema, EnrollmentFormValues } from '@/schemas/enrollment.schema';
import { EnhancedStudentFormValues } from '@/schemas/enhanced-student.schema';

interface EnrollmentFormProps {
  studentData: EnhancedStudentFormValues;
  onSuccess?: () => void;
  onBack?: () => void;
}

const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ studentData, onSuccess, onBack }) => {
  const { toast } = useToast();
  const [additionalFees, setAdditionalFees] = useState<string[]>([]);
  
  const form = useForm<EnrollmentFormValues>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      studentId: 'temp-id', // This would be the actual student ID
      academicYear: '2024-2025',
      class: '',
      section: '',
      rollNumber: '',
      feeStructure: '',
      additionalFees: [],
      status: 'enrolled',
    },
  });

  const generateRollNumber = (className: string, section: string) => {
    // Auto-generate roll number based on class and section
    const classNumber = className.padStart(2, '0');
    const sectionCode = section.charCodeAt(0) - 64; // A=1, B=2, etc.
    const studentNumber = Math.floor(Math.random() * 50) + 1; // Random for demo
    return `${classNumber}${sectionCode.toString().padStart(2, '0')}${studentNumber.toString().padStart(2, '0')}`;
  };

  const handleClassSectionChange = (className: string, section: string) => {
    if (className && section) {
      const rollNumber = generateRollNumber(className, section);
      form.setValue('rollNumber', rollNumber);
    }
  };

  const addAdditionalFee = () => {
    setAdditionalFees([...additionalFees, '']);
  };

  const removeAdditionalFee = (index: number) => {
    setAdditionalFees(additionalFees.filter((_, i) => i !== index));
  };

  const updateAdditionalFee = (index: number, value: string) => {
    const updated = [...additionalFees];
    updated[index] = value;
    setAdditionalFees(updated);
    form.setValue('additionalFees', updated.filter(fee => fee.trim() !== ''));
  };

  const onSubmit = async (values: EnrollmentFormValues) => {
    console.log('Enrollment form submitted:', values);
    console.log('Student data:', studentData);
    
    toast({
      title: "Student Enrolled Successfully",
      description: `${studentData.name} has been enrolled in Class ${values.class}-${values.section}`,
      duration: 5000,
    });
    
    if (onSuccess) {
      onSuccess();
    }
  };

  const academicYears = ['2024-2025', '2023-2024', '2025-2026'];
  const classes = ['XII', 'XI', 'X', 'IX', 'VIII', 'VII', 'VI', 'V', 'IV', 'III', 'II', 'I'];
  const sections = ['A', 'B', 'C', 'D'];
  const feeStructures = [
    'Standard Fee - ₹50,000/year',
    'Science Stream - ₹60,000/year',
    'Commerce Stream - ₹55,000/year',
    'Arts Stream - ₹45,000/year'
  ];
  const additionalFeeOptions = [
    'Transport Fee - ₹12,000/year',
    'IIT/NEET Preparation - ₹25,000/year',
    'Computer Lab - ₹5,000/year',
    'Sports Activities - ₹8,000/year',
    'Library Fee - ₹3,000/year'
  ];

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900">Enrolling Student</h3>
        <p className="text-blue-700">{studentData.name} (Admission No: {studentData.admissionNumber})</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="academicYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Academic Year *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select academic year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {academicYears.map((year) => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="class"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class *</FormLabel>
                  <Select onValueChange={(value) => {
                    field.onChange(value);
                    const section = form.getValues('section');
                    if (section) handleClassSectionChange(value, section);
                  }} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="section"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section *</FormLabel>
                  <Select onValueChange={(value) => {
                    field.onChange(value);
                    const className = form.getValues('class');
                    if (className) handleClassSectionChange(className, value);
                  }} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select section" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sections.map((section) => (
                        <SelectItem key={section} value={section}>{section}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rollNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roll Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="Auto-generated or manual entry" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="feeStructure"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Fee Structure *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fee structure" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {feeStructures.map((fee) => (
                        <SelectItem key={fee} value={fee}>{fee}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Additional Fees</h4>
              <Button type="button" variant="outline" size="sm" onClick={addAdditionalFee}>
                <Plus className="h-4 w-4 mr-2" />
                Add Fee
              </Button>
            </div>
            
            {additionalFees.map((fee, index) => (
              <div key={index} className="flex gap-2">
                <Select onValueChange={(value) => updateAdditionalFee(index, value)} value={fee}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select additional fee" />
                  </SelectTrigger>
                  <SelectContent>
                    {additionalFeeOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" variant="outline" size="icon" onClick={() => removeAdditionalFee(index)}>
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Scholarship/Discount</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="scholarship.type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="amount">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scholarship.value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Value</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter value" 
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scholarship.description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Scholarship reason" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            {onBack && (
              <Button type="button" variant="outline" onClick={onBack}>
                Back to Student Details
              </Button>
            )}
            <Button type="submit" className="flex-1 sm:flex-initial">
              <Save className="mr-2 h-4 w-4" />
              Complete Enrollment
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EnrollmentForm;
