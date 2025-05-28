
import React, { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface Student {
  id: string;
  name: string;
  currentClass: string;
  currentSection: string;
}

interface QuickPromotionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
  onPromote: (studentId: string, targetClass: string, targetSection: string, academicYear: string) => void;
}

const QuickPromotionDialog: React.FC<QuickPromotionDialogProps> = ({
  open,
  onOpenChange,
  student,
  onPromote
}) => {
  const { toast } = useToast();
  const [targetClass, setTargetClass] = useState<string>('');
  const [targetSection, setTargetSection] = useState<string>('');
  const [targetAcademicYear, setTargetAcademicYear] = useState<string>('2025-2026');

  const classes = ['XII', 'XI', 'X', 'IX', 'VIII', 'VII', 'VI', 'V', 'IV', 'III', 'II', 'I'];
  const sections = ['A', 'B', 'C', 'D'];
  const academicYears = ['2025-2026', '2024-2025', '2023-2024'];

  const handlePromote = () => {
    if (!targetClass || !targetSection || !student) {
      toast({
        title: "Missing Information",
        description: "Please select target class and section.",
        variant: "destructive",
      });
      return;
    }

    onPromote(student.id, targetClass, targetSection, targetAcademicYear);
    
    toast({
      title: "Student Promoted Successfully",
      description: `${student.name} promoted to ${targetClass}-${targetSection} for ${targetAcademicYear}`,
      duration: 5000,
    });

    onOpenChange(false);
    setTargetClass('');
    setTargetSection('');
  };

  const handleCancel = () => {
    onOpenChange(false);
    setTargetClass('');
    setTargetSection('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Promote Student
          </DialogTitle>
          <DialogDescription>
            {student && (
              <>
                Promote <strong>{student.name}</strong> from{' '}
                <strong>{student.currentClass}-{student.currentSection}</strong> to a new class.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Target Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Academic Year</Label>
              <Select value={targetAcademicYear} onValueChange={setTargetAcademicYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((year) => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Target Class</Label>
              <Select value={targetClass} onValueChange={setTargetClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Target Section</Label>
              <Select value={targetSection} onValueChange={setTargetSection}>
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((section) => (
                    <SelectItem key={section} value={section}>{section}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {targetClass && targetSection && (
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <GraduationCap className="h-5 w-5" />
                <span className="font-medium">Promotion Summary</span>
              </div>
              <p className="text-green-700 mt-1">
                {student?.name} will be promoted to {targetClass}-{targetSection} for {targetAcademicYear}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleCancel} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handlePromote} 
              className="flex-1"
              disabled={!targetClass || !targetSection}
            >
              <GraduationCap className="mr-2 h-4 w-4" />
              Promote Student
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickPromotionDialog;
