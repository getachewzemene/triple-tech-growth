import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LogOut, Users, MessageSquare, BarChart3, Settings, Home, GraduationCap, CheckCircle, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';

const Admin = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Load enrollments and notifications
    const loadData = () => {
      const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
      const adminNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
      setEnrollments(enrolledCourses);
      setNotifications(adminNotifications);
    };
    
    loadData();
    // Refresh data every 5 seconds
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleApprovePayment = (courseId, studentEmail) => {
    // Update enrollment status
    const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    const updatedCourses = enrolledCourses.map(course => 
      course.courseId === courseId && course.email === studentEmail
        ? { ...course, status: 'approved', approvedAt: new Date().toISOString() }
        : course
    );
    localStorage.setItem('enrolledCourses', JSON.stringify(updatedCourses));
    setEnrollments(updatedCourses);
    
    // Remove from notifications
    const adminNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
    const updatedNotifications = adminNotifications.filter(notif => 
      !(notif.type === 'payment_proof' && notif.studentEmail === studentEmail)
    );
    localStorage.setItem('adminNotifications', JSON.stringify(updatedNotifications));
    setNotifications(updatedNotifications);
  };

  const handleRejectPayment = (courseId, studentEmail) => {
    // Update enrollment status
    const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    const updatedCourses = enrolledCourses.map(course => 
      course.courseId === courseId && course.email === studentEmail
        ? { ...course, status: 'pending_payment', rejectedAt: new Date().toISOString() }
        : course
    );
    localStorage.setItem('enrolledCourses', JSON.stringify(updatedCourses));
    setEnrollments(updatedCourses);
    
    // Remove from notifications
    const adminNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
    const updatedNotifications = adminNotifications.filter(notif => 
      !(notif.type === 'payment_proof' && notif.studentEmail === studentEmail)
    );
    localStorage.setItem('adminNotifications', JSON.stringify(updatedNotifications));
    setNotifications(updatedNotifications);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const goHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img src={logo} alt="Triple Technologies Logo" className="h-8 w-8" />
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="enrollments">
              Course Enrollments
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
    </div>
  );
};

export default Admin;