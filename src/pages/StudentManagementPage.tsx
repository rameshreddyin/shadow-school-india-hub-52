
import React, { useState } from 'react';
import { Search, Plus, Edit, Eye, Trash2, UserPlus, GraduationCap } from 'lucide-react';
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
import EnhancedStudentForm from '@/components/students/EnhancedStudentForm';
import EnrollmentForm from '@/components/students/EnrollmentForm';
import { EnhancedStudentFormValues } from '@/schemas/enhanced-student.schema';

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
    status: 'deleted',
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
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(false);
  const [currentStudentData, setCurrentStudentData] = useState<EnhancedStudentFormValues | null>(null);
  const [students, setStudents] = useState(studentManagementData);
  const isMobile = useIsMobile();

  // Filter students based on status and search query
  const filteredStudents = students.filter(student => {
    const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      student.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.fatherName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
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

  const handleStudentFormSuccess = (studentData: EnhancedStudentFormValues) => {
    setCurrentStudentData(studentData);
    setIsAddStudentOpen(false);
    setIsEnrollmentOpen(true);
  };

  const handleEnrollmentSuccess = () => {
    setIsEnrollmentOpen(false);
    setCurrentStudentData(null);
    // Refresh student list in real app
  };

  const handlePromoteStudent = (studentId: string) => {
    console.log('Promoting student:', studentId);
    // Implement promotion logic
  };

  const handleEnrollStudent = (studentId: string) => {
    console.log('Enrolling student:', studentId);
    // Implement enrollment logic
  };

  return (
    <AppLayout title="Student Management">
      <div className="space-y-4">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Student Management</h1>
          <Button onClick={() => setIsAddStudentOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Student
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="grid gap-4 md:grid-cols-4">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Students</SelectItem>
              <SelectItem value="enrolled">Enrolled</SelectItem>
              <SelectItem value="not_enrolled">Not Enrolled</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="deleted">Deleted</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative md:col-span-3">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, admission number, or parent name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Student List - Table view for desktop, Card view for mobile */}
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
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Student
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
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
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
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Student
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
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
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
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              Enter the student's complete information. All fields marked with * are required.
            </DialogDescription>
          </DialogHeader>
          <EnhancedStudentForm onSuccess={handleStudentFormSuccess} />
        </DialogContent>
      </Dialog>

      {/* Enrollment Dialog */}
      <Dialog open={isEnrollmentOpen} onOpenChange={setIsEnrollmentOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Enrollment</DialogTitle>
            <DialogDescription>
              Complete the enrollment process for the student.
            </DialogDescription>
          </DialogHeader>
          {currentStudentData && (
            <EnrollmentForm 
              studentData={currentStudentData}
              onSuccess={handleEnrollmentSuccess}
              onBack={() => {
                setIsEnrollmentOpen(false);
                setIsAddStudentOpen(true);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default StudentManagementPage;
