
import React, { useState } from 'react';
import { GraduationCap, CheckCircle } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';

interface Student {
  id: string;
  name: string;
  currentClass: string;
  currentSection: string;
  rollNumber?: string;
}

interface BulkPromotionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  students: Student[];
  onPromote: (promotions: any[]) => void;
}

const BulkPromotionDialog: React.FC<BulkPromotionDialogProps> = ({
  open,
  onOpenChange,
  students,
  onPromote
}) => {
  const { toast } = useToast();
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [targetClass, setTargetClass] = useState<string>('');
  const [targetSection, setTargetSection] = useState<string>('');
  const [targetAcademicYear, setTargetAcademicYear] = useState<string>('2025-2026');

  const classes = ['XII', 'XI', 'X', 'IX', 'VIII', 'VII', 'VI', 'V', 'IV', 'III', 'II', 'I'];
  const sections = ['A', 'B', 'C', 'D'];
  const academicYears = ['2025-2026', '2024-2025', '2023-2024'];

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map(s => s.id));
    }
  };

  const handlePromote = () => {
    if (!targetClass || !targetSection || selectedStudents.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select target class, section, and at least one student.",
        variant: "destructive",
      });
      return;
    }

    const promotions = selectedStudents.map(studentId => {
      const student = students.find(s => s.id === studentId);
      return {
        studentId,
        studentName: student?.name,
        fromClass: student?.currentClass,
        fromSection: student?.currentSection,
        toClass: targetClass,
        toSection: targetSection,
        academicYear: targetAcademicYear,
      };
    });

    onPromote(promotions);
    
    toast({
      title: "Students Promoted Successfully",
      description: `${selectedStudents.length} students promoted to ${targetClass}-${targetSection}`,
      duration: 5000,
    });

    onOpenChange(false);
    setSelectedStudents([]);
    setTargetClass('');
    setTargetSection('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Bulk Student Promotion
          </DialogTitle>
          <DialogDescription>
            Select students and target class/section for promotion.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Target Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
            <div>
              <Label>Target Academic Year</Label>
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

          {/* Student Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Select Students ({selectedStudents.length}/{students.length})</Label>
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                {selectedStudents.length === students.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>

            <div className="max-h-60 overflow-y-auto border rounded-lg">
              {students.map((student) => (
                <div key={student.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 border-b last:border-b-0">
                  <Checkbox
                    checked={selectedStudents.includes(student.id)}
                    onCheckedChange={() => handleStudentToggle(student.id)}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-gray-500">
                      Current: {student.currentClass}-{student.currentSection}
                      {student.rollNumber && ` | Roll: ${student.rollNumber}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedStudents.length > 0 && targetClass && targetSection && (
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Promotion Summary</span>
              </div>
              <p className="text-green-700 mt-1">
                {selectedStudents.length} students will be promoted to {targetClass}-{targetSection} for {targetAcademicYear}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handlePromote} 
              className="flex-1"
              disabled={!targetClass || !targetSection || selectedStudents.length === 0}
            >
              <GraduationCap className="mr-2 h-4 w-4" />
              Promote Students
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkPromotionDialog;
