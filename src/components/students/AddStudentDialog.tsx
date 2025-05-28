
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import StreamlinedStudentForm from './StreamlinedStudentForm';
import EnrollmentForm from './EnrollmentForm';
import { EnhancedStudentFormValues } from '@/schemas/enhanced-student.schema';

interface AddStudentDialogProps {
  trigger?: React.ReactNode;
}

const AddStudentDialog: React.FC<AddStudentDialogProps> = ({ trigger }) => {
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState<'student' | 'enrollment'>('student');
  const [studentData, setStudentData] = React.useState<EnhancedStudentFormValues | null>(null);

  const handleStudentSuccess = (data: EnhancedStudentFormValues) => {
    setStudentData(data);
    setStep('enrollment');
  };

  const handleEnrollmentSuccess = () => {
    setOpen(false);
    setStep('student');
    setStudentData(null);
  };

  const handleBack = () => {
    setStep('student');
  };

  const resetDialog = () => {
    setStep('student');
    setStudentData(null);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetDialog();
    }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Add Student</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 'student' ? 'Add New Student' : 'Create Enrollment'}
          </DialogTitle>
          <DialogDescription>
            {step === 'student' 
              ? 'Enter the student\'s complete information. After saving, you\'ll proceed to create enrollment.'
              : 'Complete the enrollment process for the student.'
            }
          </DialogDescription>
        </DialogHeader>
        
        {step === 'student' ? (
          <StreamlinedStudentForm 
            onNext={handleStudentSuccess}
            onCancel={() => setOpen(false)}
          />
        ) : (
          studentData && (
            <EnrollmentForm
              studentData={studentData}
              onSuccess={handleEnrollmentSuccess}
              onBack={handleBack}
            />
          )
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentDialog;
