
import React from 'react';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import StreamlinedStudentForm from './StreamlinedStudentForm';
import EnrollmentForm from './EnrollmentForm';
import { EnhancedStudentFormValues } from '@/schemas/enhanced-student.schema';

interface AddStudentDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const AddStudentDialog: React.FC<AddStudentDialogProps> = ({ open, onOpenChange }) => {
  const [step, setStep] = React.useState<'student' | 'enrollment'>('student');
  const [studentData, setStudentData] = React.useState<EnhancedStudentFormValues | null>(null);

  const handleStudentSuccess = (data: EnhancedStudentFormValues) => {
    setStudentData(data);
    setStep('enrollment');
  };

  const handleEnrollmentSuccess = () => {
    if (onOpenChange) {
      onOpenChange(false);
    }
    setStep('student');
    setStudentData(null);
  };

  const handleBack = () => {
    setStep('student');
  };

  const handleCancel = () => {
    if (onOpenChange) {
      onOpenChange(false);
    }
    setStep('student');
    setStudentData(null);
  };

  // Reset when dialog closes
  React.useEffect(() => {
    if (!open) {
      setStep('student');
      setStudentData(null);
    }
  }, [open]);

  return (
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
          onCancel={handleCancel}
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
  );
};

export default AddStudentDialog;
