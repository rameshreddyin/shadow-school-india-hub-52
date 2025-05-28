
import React from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Student {
  id: string;
  name: string;
  admissionNumber: string;
}

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
  onConfirm: () => void;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  onOpenChange,
  student,
  onConfirm
}) => {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Delete Student Permanently
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. The student will be permanently removed from the database.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> You are about to permanently delete the following student:
            </AlertDescription>
          </Alert>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold">{student.name}</h4>
            <p className="text-sm text-gray-600">Admission Number: {student.admissionNumber}</p>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h5 className="font-medium text-red-800 mb-2">This will permanently delete:</h5>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Student personal information</li>
              <li>• All enrollment records</li>
              <li>• Academic history</li>
              <li>• Fee payment records</li>
              <li>• Attendance records</li>
            </ul>
          </div>

          <p className="text-sm text-gray-600">
            If you want to remove the student temporarily, consider changing their status to "Not Enrolled" instead.
          </p>

          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirm} className="flex-1">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Permanently
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
