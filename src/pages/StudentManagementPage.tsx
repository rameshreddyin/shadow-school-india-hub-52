import React, { useState } from 'react';
import { Search, Plus, Edit, Eye, Trash2, UserPlus, GraduationCap, Users, Filter } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

import AddStudentDialog from '@/components/students/AddStudentDialog';
import BulkPromotionDialog from '@/components/students/BulkPromotionDialog';
import QuickPromotionDialog from '@/components/students/QuickPromotionDialog';
import EditEnrollmentDialog from '@/components/students/EditEnrollmentDialog';
import DeleteConfirmationDialog from '@/components/students/DeleteConfirmationDialog';
import EnhancedStudentForm from '@/components/students/EnhancedStudentForm';
import { EnhancedStudentFormValues } from '@/schemas/enhanced-student.schema';
import { EnrollmentFormValues } from '@/schemas/enrollment.schema';

// Extended student data with enrollment history
const studentManagementData = [
  {
    id: '1',
    name: 'Aarav Sharma',
    admissionNumber: 'ADM2023001',
    fatherName: 'Vikram Sharma',
    fatherPhone: '+91-9876543210',
    status: 'enrolled',
    currentClass: 'X',
    currentSection: 'A',
    currentYear: '2024-2025',
    photo: '',
    enrollmentHistory: [
      { year: '2024-2025', class: 'X', section: 'A', status: 'enrolled' },
      { year: '2023-2024', class: 'IX', section: 'A', status: 'promoted' }
    ]
  },
  {
    id: '2',
    name: 'Diya Patel',
    admissionNumber: 'ADM2023002',
    fatherName: 'Raj Patel',
    fatherPhone: '+91-9876543211',
    status: 'enrolled',
    currentClass: 'X',
    currentSection: 'A',
    currentYear: '2024-2025',
    photo: '',
    enrollmentHistory: [
      { year: '2024-2025', class: 'X', section: 'A', status: 'enrolled' }
    ]
  },
  {
    id: '3',
    name: 'Arjun Singh',
    admissionNumber: 'ADM2023003',
    fatherName: 'Manpreet Singh',
    fatherPhone: '+91-9876543212',
    status: 'not_enrolled',
    currentClass: '',
    currentSection: '',
    currentYear: '',
    photo: '',
    enrollmentHistory: [
      { year: '2023-2024', class: 'VIII', section: 'B', status: 'completed' }
    ]
  },
  {
    id: '4',
    name: 'Ananya Kumar',
    admissionNumber: 'ADM2023004',
    fatherName: 'Rajesh Kumar',
    fatherPhone: '+91-9876543213',
    status: 'not_enrolled',
    currentClass: '',
    currentSection: '',
    currentYear: '',
    photo: '',
    enrollmentHistory: [
      { year: '2023-2024', class: 'VII', section: 'C', status: 'left' }
    ]
  },
];

const StudentManagementPage: React.FC = () => {
  const { toast } = useToast();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('2024-2025');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  
  // Dialog states
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isBulkPromotionOpen, setIsBulkPromotionOpen] = useState(false);
  const [isQuickPromotionOpen, setIsQuickPromotionOpen] = useState(false);
  const [isEditEnrollmentOpen, setIsEditEnrollmentOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isEditStudentOpen, setIsEditStudentOpen] = useState(false);
  
  const [currentStudent, setCurrentStudent] = useState<any>(null);
  const [students, setStudents] = useState(studentManagementData);
  const isMobile = useIsMobile();

  // Filter students based on all criteria
  const filteredStudents = students.filter(student => {
    const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;
    const matchesClass = selectedClass === 'all' || student.currentClass === selectedClass;
    const matchesSection = selectedSection === 'all' || student.currentSection === selectedSection;
    const matchesYear = selectedYear === 'all' || student.currentYear === selectedYear;
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      student.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.fatherName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesClass && matchesSection && matchesYear && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enrolled': return 'bg-green-100 text-green-800';
      case 'not_enrolled': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-blue-100 text-blue-800';
      case 'deleted': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const handleBulkPromotion = (promotions: any[]) => {
    console.log('Bulk promotions:', promotions);
    // Handle bulk promotion logic here
  };

  const handleEditEnrollment = (student: any) => {
    setCurrentStudent(student);
    setIsEditEnrollmentOpen(true);
  };

  const handleEditStudent = (student: any) => {
    setCurrentStudent(student);
    setIsEditStudentOpen(true);
  };

  const handleEnrollStudent = (studentId: string) => {
    // Handle student enrollment logic
    toast({
      title: "Enrollment Started",
      description: "Please complete the enrollment process for the student.",
      duration: 3000,
    });
  };

  const handlePromoteStudent = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setCurrentStudent(student);
      setIsQuickPromotionOpen(true);
    }
  };

  const handleQuickPromotion = (studentId: string, targetClass: string, targetSection: string, academicYear: string) => {
    // Update student data with promotion
    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? { 
            ...student, 
            currentClass: targetClass,
            currentSection: targetSection,
            currentYear: academicYear,
            enrollmentHistory: [
              { year: academicYear, class: targetClass, section: targetSection, status: 'enrolled' },
              ...student.enrollmentHistory
            ]
          }
        : student
    ));
    
    setIsQuickPromotionOpen(false);
    setCurrentStudent(null);
  };

  const handleDeleteStudent = (student: any) => {
    setCurrentStudent(student);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (currentStudent) {
      setStudents(prev => prev.filter(s => s.id !== currentStudent.id));
      toast({
        title: "Student Deleted",
        description: `${currentStudent.name} has been permanently deleted from the database.`,
        variant: "destructive",
        duration: 5000,
      });
      setCurrentStudent(null);
    }
  };

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
  };

  const handleStudentEditSuccess = (studentData: EnhancedStudentFormValues) => {
    // Update student data in the list - handle photo field conversion
    setStudents(prev => prev.map(student => 
      student.id === currentStudent?.id 
        ? { 
            ...student, 
            ...studentData,
            // Convert File to string if needed for photo
            photo: typeof studentData.photo === 'string' ? studentData.photo : (studentData.photo ? URL.createObjectURL(studentData.photo) : student.photo)
          }
        : student
    ));
    
    toast({
      title: "Student Updated",
      description: `${studentData.name}'s information has been updated successfully.`,
      duration: 5000,
    });
    
    setIsEditStudentOpen(false);
    setCurrentStudent(null);
  };

  const classes = ['all', 'XII', 'XI', 'X', 'IX', 'VIII', 'VII', 'VI', 'V', 'IV', 'III', 'II', 'I'];
  const sections = ['all', 'A', 'B', 'C', 'D'];
  const academicYears = ['2024-2025', '2025-2026', '2023-2024'];

  return (
    <AppLayout title="Student Management">
      <div className="space-y-4">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Student Management</h1>
            <p className="text-sm text-muted-foreground">
              {filteredStudents.length} students found
              {selectedStudents.length > 0 && ` (${selectedStudents.length} selected)`}
            </p>
          </div>
          <div className="flex gap-2">
            {selectedStudents.length > 0 && (
              <Button onClick={() => setIsBulkPromotionOpen(true)} variant="outline">
                <GraduationCap className="h-4 w-4 mr-2" />
                Promote Selected ({selectedStudents.length})
              </Button>
            )}
            <Button onClick={() => setIsAddStudentOpen(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Student
            </Button>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="grid gap-4 md:grid-cols-6">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger>
              <SelectValue placeholder="Academic Year" />
            </SelectTrigger>
            <SelectContent>
              {academicYears.map((year) => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="enrolled">Enrolled</SelectItem>
              <SelectItem value="not_enrolled">Not Enrolled</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger>
              <SelectValue placeholder="Class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls} value={cls}>
                  {cls === 'all' ? 'All Classes' : cls}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSection} onValueChange={setSelectedSection}>
            <SelectTrigger>
              <SelectValue placeholder="Section" />
            </SelectTrigger>
            <SelectContent>
              {sections.map((section) => (
                <SelectItem key={section} value={section}>
                  {section === 'all' ? 'All Sections' : section}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, admission number, or parent name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Student List */}
        {isMobile ? (
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="grid gap-4">
              {filteredStudents.map((student) => (
                <Card key={student.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-3 border-b p-4">
                      <Avatar>
                        {student.photo ? (
                          <AvatarImage src={student.photo} alt={student.name} />
                        ) : (
                          <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Adm: {student.admissionNumber}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 p-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(student.status)}`}>
                          {student.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Current Class</p>
                        <p className="font-medium">
                          {student.currentClass ? `${student.currentClass} - ${student.currentSection}` : 'Not Enrolled'}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-muted-foreground">Father's Name</p>
                        <p className="font-medium">{student.fatherName}</p>
                      </div>
                      <div className="col-span-2 flex items-center justify-end gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline">Actions</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditStudent(student)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Student
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditEnrollment(student)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Enrollment
                            </DropdownMenuItem>
                            {student.status === 'not_enrolled' && (
                              <DropdownMenuItem onClick={() => handleEnrollStudent(student.id)}>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Enroll Student
                              </DropdownMenuItem>
                            )}
                            {student.status === 'enrolled' && (
                              <DropdownMenuItem onClick={() => handlePromoteStudent(student.id)}>
                                <GraduationCap className="h-4 w-4 mr-2" />
                                Promote
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteStudent(student)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Permanently
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="rounded-md border">
            <ScrollArea className="h-[calc(100vh-280px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Admission No.</TableHead>
                    <TableHead>Father's Name</TableHead>
                    <TableHead>Current Class</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedStudents.includes(student.id)}
                          onCheckedChange={() => handleStudentSelect(student.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            {student.photo ? (
                              <AvatarImage src={student.photo} alt={student.name} />
                            ) : (
                              <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                            )}
                          </Avatar>
                          <span>{student.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{student.admissionNumber}</TableCell>
                      <TableCell>{student.fatherName}</TableCell>
                      <TableCell>
                        {student.currentClass ? `${student.currentClass} - ${student.currentSection}` : 'Not Enrolled'}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(student.status)}`}>
                          {student.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline">Actions</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditStudent(student)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Student
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditEnrollment(student)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Enrollment
                            </DropdownMenuItem>
                            {student.status === 'not_enrolled' && (
                              <DropdownMenuItem onClick={() => handleEnrollStudent(student.id)}>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Enroll Student
                              </DropdownMenuItem>
                            )}
                            {student.status === 'enrolled' && (
                              <DropdownMenuItem onClick={() => handlePromoteStudent(student.id)}>
                                <GraduationCap className="h-4 w-4 mr-2" />
                                Promote
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteStudent(student)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Permanently
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        )}
      </div>

      {/* Add Student Dialog */}
      <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
        <AddStudentDialog />
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={isEditStudentOpen} onOpenChange={setIsEditStudentOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Student Information</DialogTitle>
            <DialogDescription>
              Update all student details including personal information, contact details, and other data.
            </DialogDescription>
          </DialogHeader>
          {currentStudent && (
            <EnhancedStudentForm 
              onSuccess={handleStudentEditSuccess}
              initialData={{
                name: currentStudent.name,
                admissionNumber: currentStudent.admissionNumber,
                fatherName: currentStudent.fatherName,
                fatherPhone: currentStudent.fatherPhone,
                status: currentStudent.status,
                // Add other fields as needed from currentStudent
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Quick Promotion Dialog */}
      <QuickPromotionDialog
        open={isQuickPromotionOpen}
        onOpenChange={setIsQuickPromotionOpen}
        student={currentStudent}
        onPromote={handleQuickPromotion}
      />

      {/* Bulk Promotion Dialog */}
      <BulkPromotionDialog
        open={isBulkPromotionOpen}
        onOpenChange={setIsBulkPromotionOpen}
        students={filteredStudents.filter(s => selectedStudents.includes(s.id))}
        onPromote={handleBulkPromotion}
      />

      {/* Edit Enrollment Dialog */}
      <EditEnrollmentDialog
        open={isEditEnrollmentOpen}
        onOpenChange={setIsEditEnrollmentOpen}
        student={currentStudent}
        onSave={(data: EnrollmentFormValues) => {
          console.log('Enrollment updated:', data);
          setIsEditEnrollmentOpen(false);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        student={currentStudent}
        onConfirm={handleConfirmDelete}
      />
    </AppLayout>
  );
};

export default StudentManagementPage;
