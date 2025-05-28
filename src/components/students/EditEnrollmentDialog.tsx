
import React from 'react';
import { Edit, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { enrollmentSchema, EnrollmentFormValues } from '@/schemas/enrollment.schema';

interface Student {
  id: string;
  name: string;
  admissionNumber: string;
  currentClass: string;
  currentSection: string;
  currentYear: string;
}

interface EditEnrollmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
  onSave: (enrollmentData: EnrollmentFormValues) => void;
}

const EditEnrollmentDialog: React.FC<EditEnrollmentDialogProps> = ({
  open,
  onOpenChange,
  student,
  onSave
}) => {
  const { toast } = useToast();
  
  const form = useForm<EnrollmentFormValues>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      studentId: student?.id || '',
      academicYear: student?.currentYear || '2024-2025',
      class: student?.currentClass || '',
      section: student?.currentSection || '',
      rollNumber: '',
      feeStructure: '',
      status: 'enrolled',
    },
  });

  React.useEffect(() => {
    if (student && open) {
      form.reset({
        studentId: student.id,
        academicYear: student.currentYear,
        class: student.currentClass,
        section: student.currentSection,
        rollNumber: '', // This would come from enrollment data
        feeStructure: '', // This would come from enrollment data
        status: 'enrolled',
      });
    }
  }, [student, open, form]);

  const onSubmit = (values: EnrollmentFormValues) => {
    console.log('Enrollment updated:', values);
    
    onSave(values);
    
    toast({
      title: "Enrollment Updated",
      description: `Enrollment details for ${student?.name} have been updated.`,
      duration: 5000,
    });
    
    onOpenChange(false);
  };

  const academicYears = ['2024-2025', '2025-2026', '2023-2024'];
  const classes = ['XII', 'XI', 'X', 'IX', 'VIII', 'VII', 'VI', 'V', 'IV', 'III', 'II', 'I'];
  const sections = ['A', 'B', 'C', 'D'];
  const feeStructures = [
    'Standard Fee - ₹50,000/year',
    'Science Stream - ₹60,000/year',
    'Commerce Stream - ₹55,000/year',
    'Arts Stream - ₹45,000/year'
  ];

  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Enrollment Details
          </DialogTitle>
          <DialogDescription>
            Update enrollment information for {student.name} (Adm: {student.admissionNumber})
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="academicYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Year</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
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
                    <FormLabel>Class</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <FormLabel>Section</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <FormLabel>Roll Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter roll number" {...field} />
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
                    <FormLabel>Fee Structure</FormLabel>
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

            <div className="flex gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEnrollmentDialog;
