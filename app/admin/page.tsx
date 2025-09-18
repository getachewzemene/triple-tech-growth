'use client';

import { useAuth } from '@/app/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LogOut, Users, MessageSquare, BarChart3, Settings, Home, GraduationCap, CheckCircle, XCircle, Plus, Video, FolderPlus, Folder, ChevronRight, ChevronDown, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import ProtectedRoute from '@/components/ProtectedRoute';
import { safeLocalStorage } from '@/lib/hooks/useLocalStorage';
import AddCourseModal from '@/components/admin/AddCourseModal';
import AddCourseFolderModal from '@/components/admin/AddCourseFolderModal';
import AddTopicModal from '@/components/admin/AddTopicModal';

function AdminPageContent() {
  const { logout, user } = useAuth();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [courses, setCourses] = useState([]);
  const [courseFolders, setCourseFolders] = useState([]);
  const [topics, setTopics] = useState([]);
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [isAddCourseFolderModalOpen, setIsAddCourseFolderModalOpen] = useState(false);
  const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false);
  const [selectedFolderForTopic, setSelectedFolderForTopic] = useState<any>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load enrollments and notifications
    const loadData = () => {
      const enrolledCourses = safeLocalStorage.getItem('enrolledCourses', []);
      const adminNotifications = safeLocalStorage.getItem('adminNotifications', []);
      const savedCourses = safeLocalStorage.getItem('adminCourses', []);
      const savedCourseFolders = safeLocalStorage.getItem('adminCourseFolders', []);
      const savedTopics = safeLocalStorage.getItem('adminTopics', []);
      setEnrollments(enrolledCourses);
      setNotifications(adminNotifications);
      setCourses(savedCourses);
      setCourseFolders(savedCourseFolders);
      setTopics(savedTopics);
    };
    
    loadData();
    // Refresh data every 5 seconds
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleApprovePayment = async (courseId: number, studentEmail: string) => {
    try {
      // Find the payment proof ID (in real app, this would come from the enrollment data)
      const proofId = `proof_${courseId}_${studentEmail.replace('@', '_')}`;
      
      const response = await fetch(`/api/admin/proofs/${proofId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment: 'Payment approved by admin',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to approve payment');
      }

      const result = await response.json();
      
      // Update local storage for demo purposes
      const enrolledCourses = safeLocalStorage.getItem('enrolledCourses', []);
      const updatedCourses = enrolledCourses.map((course: any) => 
        course.courseId === courseId && course.email === studentEmail
          ? { ...course, status: 'approved', approvedAt: new Date().toISOString() }
          : course
      );
      safeLocalStorage.setItem('enrolledCourses', updatedCourses);
      setEnrollments(updatedCourses);
      
      // Remove from notifications
      const adminNotifications = safeLocalStorage.getItem('adminNotifications', []);
      const updatedNotifications = adminNotifications.filter((notif: any) => 
        !(notif.type === 'payment_proof' && notif.studentEmail === studentEmail)
      );
      safeLocalStorage.setItem('adminNotifications', updatedNotifications);
      setNotifications(updatedNotifications);
      
      alert(`Payment approved successfully! ${result.message}`);
      
    } catch (error: any) {
      console.error('Error approving payment:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleRejectPayment = async (courseId: number, studentEmail: string) => {
    try {
      // Find the payment proof ID (in real app, this would come from the enrollment data)
      const proofId = `proof_${courseId}_${studentEmail.replace('@', '_')}`;
      
      const response = await fetch(`/api/admin/proofs/${proofId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment: 'Payment proof requires resubmission with clearer documentation',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to reject payment');
      }

      const result = await response.json();
      
      // Update local storage for demo purposes
      const enrolledCourses = safeLocalStorage.getItem('enrolledCourses', []);
      const updatedCourses = enrolledCourses.map((course: any) => 
        course.courseId === courseId && course.email === studentEmail
          ? { ...course, status: 'rejected', rejectedAt: new Date().toISOString() }
          : course
      );
      safeLocalStorage.setItem('enrolledCourses', updatedCourses);
      setEnrollments(updatedCourses);
      
      // Remove from notifications
      const adminNotifications = safeLocalStorage.getItem('adminNotifications', []);
      const updatedNotifications = adminNotifications.filter((notif: any) => 
        !(notif.type === 'payment_proof' && notif.studentEmail === studentEmail)
      );
      safeLocalStorage.setItem('adminNotifications', updatedNotifications);
      setNotifications(updatedNotifications);
      
      alert(`Payment rejected. ${result.message}`);
      
    } catch (error: any) {
      console.error('Error rejecting payment:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleCourseSaved = (course: any) => {
    // Add the new course to local storage and state
    const savedCourses = safeLocalStorage.getItem('adminCourses', []);
    const updatedCourses = [course, ...savedCourses];
    safeLocalStorage.setItem('adminCourses', updatedCourses);
    setCourses(updatedCourses);
  };

  const handleCourseFolderSaved = (courseFolder: any) => {
    // Add the new course folder to local storage and state
    const savedCourseFolders = safeLocalStorage.getItem('adminCourseFolders', []);
    const updatedCourseFolders = [courseFolder, ...savedCourseFolders];
    safeLocalStorage.setItem('adminCourseFolders', updatedCourseFolders);
    setCourseFolders(updatedCourseFolders);
  };

  const handleTopicSaved = (topic: any) => {
    // Add the new topic to local storage and state
    const savedTopics = safeLocalStorage.getItem('adminTopics', []);
    const updatedTopics = [topic, ...savedTopics];
    safeLocalStorage.setItem('adminTopics', updatedTopics);
    setTopics(updatedTopics);

    // Update the folder's topic count
    const updatedCourseFolders = courseFolders.map(folder => 
      folder.id === topic.courseFolderId 
        ? { ...folder, topicsCount: (folder.topicsCount || 0) + 1 }
        : folder
    );
    setCourseFolders(updatedCourseFolders);
    safeLocalStorage.setItem('adminCourseFolders', updatedCourseFolders);
  };

  const toggleFolderExpansion = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const openAddTopicModal = (folder: any) => {
    setSelectedFolderForTopic(folder);
    setIsAddTopicModalOpen(true);
  };

  const getTopicsForFolder = (folderId: string) => {
    return topics.filter(topic => topic.courseFolderId === folderId).sort((a, b) => a.order - b.order);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const goHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Image src="/logo.png" alt="Triple Technologies Logo" width={32} height={32} />
              <span className="text-xl font-bold text-blue-500">Triple Technologies Admin</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.username}</span>
              <Button variant="outline" size="sm" onClick={goHome}>
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Manage your Triple Technologies website</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="enrollments">
              Enrollments
              {notifications.length > 0 && (
                <Badge variant="destructive" className="ml-2 px-1 py-0 text-xs">
                  {notifications.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Messages</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89</div>
                  <p className="text-xs text-muted-foreground">+12 new this week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Course Enrollments</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{enrollments.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {notifications.length} pending approval
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.length > 0 && (
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">
                          {notifications.length} payment proof(s) awaiting approval
                        </p>
                        <p className="text-xs text-gray-500">Check Course Enrollments tab</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">New contact form submission</p>
                      <p className="text-xs text-gray-500">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Website traffic increased</p>
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">New service inquiry</p>
                      <p className="text-xs text-gray-500">3 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Course Management</h2>
                <p className="text-gray-600">Manage course folders, topics, and individual courses</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button onClick={() => setIsAddCourseFolderModalOpen(true)} className="flex items-center space-x-2">
                  <FolderPlus className="h-4 w-4" />
                  <span>Create Course Folder</span>
                </Button>
                <Button onClick={() => setIsAddCourseModalOpen(true)} variant="outline" className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Individual Course</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Course Folders</CardTitle>
                  <Folder className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{courseFolders.length}</div>
                  <p className="text-xs text-muted-foreground">Main course categories</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Topics</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{topics.length}</div>
                  <p className="text-xs text-muted-foreground">Topics in folders</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Individual Courses</CardTitle>
                  <Video className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{courses.length}</div>
                  <p className="text-xs text-muted-foreground">Standalone courses</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Storage</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(() => {
                      const totalSize = courses.reduce((total, course) => total + (course.size || 0), 0) +
                                       topics.reduce((total, topic) => total + (topic.videoSize || 0) + (topic.pdfSize || 0), 0);
                      return totalSize > 0 ? `${(totalSize / (1024 * 1024 * 1024)).toFixed(1)} GB` : '0 GB';
                    })()}
                  </div>
                  <p className="text-xs text-muted-foreground">Total content storage</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Course Library</CardTitle>
                <CardDescription>Manage your course folders, topics, and individual courses</CardDescription>
              </CardHeader>
              <CardContent>
                {courseFolders.length === 0 && courses.length === 0 ? (
                  <div className="text-center py-12">
                    <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
                    <p className="text-gray-600 mb-4">Get started by creating a course folder or adding an individual course</p>
                    <div className="flex justify-center space-x-2">
                      <Button onClick={() => setIsAddCourseFolderModalOpen(true)}>
                        <FolderPlus className="h-4 w-4 mr-2" />
                        Create Course Folder
                      </Button>
                      <Button onClick={() => setIsAddCourseModalOpen(true)} variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Individual Course
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Course Folders */}
                    {courseFolders.map((folder, index) => (
                      <div key={folder.id || index} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleFolderExpansion(folder.id)}
                                className="p-0 h-auto"
                              >
                                {expandedFolders.has(folder.id) ? 
                                  <ChevronDown className="h-4 w-4" /> : 
                                  <ChevronRight className="h-4 w-4" />
                                }
                              </Button>
                              <Folder className="h-5 w-5 text-blue-500" />
                              <h3 className="font-semibold text-lg">{folder.title}</h3>
                            </div>
                            <p className="text-sm text-gray-600 mt-1 ml-6">{folder.description}</p>
                            <div className="flex items-center space-x-4 mt-2 ml-6 text-xs text-gray-500">
                              <span>Instructor: {folder.instructor}</span>
                              <span>Topics: {folder.topicsCount || 0}</span>
                              <span>Price: ${(folder.priceCents / 100).toFixed(2)}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openAddTopicModal(folder)}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add Topic
                            </Button>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </div>
                        </div>

                        {/* Topics in folder */}
                        {expandedFolders.has(folder.id) && (
                          <div className="ml-8 space-y-2 border-l-2 border-gray-200 pl-4">
                            {getTopicsForFolder(folder.id).map((topic, topicIndex) => (
                              <div key={topic.id || topicIndex} className="border rounded-md p-3 bg-gray-50">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm font-medium text-gray-600">#{topic.order}</span>
                                      <h4 className="font-medium">{topic.title}</h4>
                                      <div className="flex items-center space-x-1">
                                        {topic.videoS3Key && (
                                          <Video className="h-4 w-4 text-blue-500" title="Has video content" />
                                        )}
                                        {topic.pdfS3Key && (
                                          <FileText className="h-4 w-4 text-red-500" title="Has PDF content" />
                                        )}
                                      </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
                                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                                      {topic.videoDuration && <span>Duration: {Math.floor(topic.videoDuration / 60)}m {topic.videoDuration % 60}s</span>}
                                      {topic.videoSize && <span>Video: {(topic.videoSize / (1024 * 1024)).toFixed(1)} MB</span>}
                                      {topic.pdfSize && <span>PDF: {(topic.pdfSize / (1024 * 1024)).toFixed(1)} MB</span>}
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Button variant="outline" size="sm">
                                      Edit
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      View
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {getTopicsForFolder(folder.id).length === 0 && (
                              <div className="text-center py-4 text-gray-500">
                                <p className="text-sm">No topics yet.</p>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => openAddTopicModal(folder)}
                                  className="mt-2"
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add First Topic
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Individual Courses */}
                    {courses.map((course, index) => (
                      <div key={course.id || index} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <Video className="h-5 w-5 text-green-500" />
                              <h3 className="font-semibold text-lg">{course.title}</h3>
                            </div>
                            <p className="text-sm text-gray-600 mt-1 ml-7">{course.detail}</p>
                            <div className="flex items-center space-x-4 mt-2 ml-7 text-xs text-gray-500">
                              <span>Instructor: {course.instructor}</span>
                              {course.duration && <span>Duration: {Math.floor(course.duration / 60)}m {course.duration % 60}s</span>}
                              {course.size && <span>Size: {(course.size / (1024 * 1024)).toFixed(1)} MB</span>}
                            </div>
                            <div className="flex items-center space-x-2 mt-2 ml-7">
                              <Badge 
                                variant={
                                  course.transcodeStatus === 'completed' ? 'default' :
                                  course.transcodeStatus === 'processing' ? 'secondary' :
                                  course.transcodeStatus === 'failed' ? 'destructive' :
                                  'outline'
                                }
                              >
                                {course.transcodeStatus === 'completed' ? 'Ready' :
                                 course.transcodeStatus === 'processing' ? 'Processing' :
                                 course.transcodeStatus === 'failed' ? 'Failed' :
                                 'Pending'}
                              </Badge>
                              {course.isProtected && (
                                <Badge variant="outline">
                                  🔒 Protected
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="enrollments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Enrollments</CardTitle>
                <CardDescription>Manage student enrollments and payment approvals</CardDescription>
              </CardHeader>
              <CardContent>
                {enrollments.length === 0 ? (
                  <p className="text-gray-600">No course enrollments yet.</p>
                ) : (
                  <div className="space-y-4">
                    {enrollments.map((enrollment, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{enrollment.courseTitle}</h3>
                            <p className="text-sm text-gray-600">
                              Enrolled by: {enrollment.fullName} ({enrollment.email})
                            </p>
                            <p className="text-xs text-gray-500">
                              Enrolled on: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge 
                            variant={
                              enrollment.status === 'approved' ? 'default' :
                              enrollment.status === 'payment_submitted' ? 'secondary' :
                              'destructive'
                            }
                          >
                            {enrollment.status === 'approved' ? 'Approved' :
                             enrollment.status === 'payment_submitted' ? 'Payment Under Review' :
                             'Payment Required'}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <strong>Phone:</strong> {enrollment.phone}
                          </div>
                          <div>
                            <strong>Age:</strong> {enrollment.age}
                          </div>
                          <div className="col-span-2">
                            <strong>Address:</strong> {enrollment.address}
                          </div>
                          {enrollment.paymentProof && (
                            <div className="col-span-2">
                              <strong>Payment Proof:</strong> {enrollment.paymentProof}
                            </div>
                          )}
                        </div>

                        {enrollment.status === 'payment_submitted' && (
                          <div className="flex gap-2 pt-3 border-t">
                            <Button 
                              size="sm"
                              onClick={() => handleApprovePayment(enrollment.courseId, enrollment.email)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve Payment
                            </Button>
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectPayment(enrollment.courseId, enrollment.email)}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject Payment
                            </Button>
                          </div>
                        )}

                        {enrollment.status === 'approved' && (
                          <div className="pt-3 border-t">
                            <div className="flex items-center text-green-600 text-sm">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              <span>Payment approved on {new Date(enrollment.approvedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage website users and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">User management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Messages</CardTitle>
                <CardDescription>View and respond to customer inquiries</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Message management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Website Settings</CardTitle>
                <CardDescription>Configure website preferences and options</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Maintenance Mode</h3>
                      <p className="text-xs text-gray-500">Enable maintenance mode for the website</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">SEO Settings</h3>
                      <p className="text-xs text-gray-500">Manage meta tags and SEO configuration</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Analytics</h3>
                      <p className="text-xs text-gray-500">Configure Google Analytics and tracking</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <AddCourseModal
        isOpen={isAddCourseModalOpen}
        onClose={() => setIsAddCourseModalOpen(false)}
        onCourseSaved={handleCourseSaved}
      />
      
      <AddCourseFolderModal
        isOpen={isAddCourseFolderModalOpen}
        onClose={() => setIsAddCourseFolderModalOpen(false)}
        onCourseFolderSaved={handleCourseFolderSaved}
      />

      {selectedFolderForTopic && (
        <AddTopicModal
          isOpen={isAddTopicModalOpen}
          onClose={() => {
            setIsAddTopicModalOpen(false);
            setSelectedFolderForTopic(null);
          }}
          courseFolderId={selectedFolderForTopic.id}
          courseFolderTitle={selectedFolderForTopic.title}
          existingTopics={getTopicsForFolder(selectedFolderForTopic.id)}
          onTopicSaved={handleTopicSaved}
        />
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminPageContent />
    </ProtectedRoute>
  );
}