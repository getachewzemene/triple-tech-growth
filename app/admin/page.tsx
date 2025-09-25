'use client';

import { useAuth } from '@/app/providers/AuthProvider';
import { useLanguage } from '@/app/providers/LanguageProvider';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LogOut, Users, MessageSquare, BarChart3, Settings, Home, GraduationCap, 
  CheckCircle, XCircle, Plus, Video, FolderPlus, Folder, ChevronRight, 
  ChevronDown, FileText, Moon, Sun, Globe, Palette, TrendingUp, 
  TrendingDown, Activity, BookOpen, UserCheck
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import ProtectedRoute from '@/components/ProtectedRoute';
import { safeLocalStorage } from '@/lib/hooks/useLocalStorage';
import { useThemeToggle } from '@/hooks/use-theme-toggle';
import AddCourseModal from '@/components/admin/AddCourseModal';
import AddCourseFolderModal from '@/components/admin/AddCourseFolderModal';
import AddTopicModal from '@/components/admin/AddTopicModal';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  SidebarRail,
} from '@/components/ui/sidebar';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { Line, LineChart, Bar, BarChart, Area, AreaChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

// Sample data for charts
const visitorData = [
  { month: 'Jan', visitors: 400, pageViews: 1200 },
  { month: 'Feb', visitors: 600, pageViews: 1800 },
  { month: 'Mar', visitors: 800, pageViews: 2400 },
  { month: 'Apr', visitors: 750, pageViews: 2250 },
  { month: 'May', visitors: 900, pageViews: 2700 },
  { month: 'Jun', visitors: 1200, pageViews: 3600 },
];

const courseEnrollmentData = [
  { course: 'Web Dev', enrolled: 45, completed: 35 },
  { course: 'Mobile Dev', enrolled: 30, completed: 22 },
  { course: 'Data Science', enrolled: 25, completed: 18 },
  { course: 'DevOps', enrolled: 20, completed: 15 },
  { course: 'UI/UX', enrolled: 35, completed: 28 },
];

const revenueData = [
  { month: 'Jan', revenue: 12000, profit: 8000 },
  { month: 'Feb', revenue: 15000, profit: 10500 },
  { month: 'Mar', revenue: 18000, profit: 12600 },
  { month: 'Apr', revenue: 16000, profit: 11200 },
  { month: 'May', revenue: 22000, profit: 15400 },
  { month: 'Jun', revenue: 28000, profit: 19600 },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
    color: "hsl(var(--chart-1))",
  },
  pageViews: {
    label: "Page Views",
    color: "hsl(var(--chart-2))",
  },
  enrolled: {
    label: "Enrolled",
    color: "hsl(var(--chart-3))",
  },
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-4))",
  },
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-5))",
  },
  profit: {
    label: "Profit",
    color: "hsl(var(--chart-1))",
  },
};

const sidebarItems = [
  {
    title: "Dashboard",
    icon: BarChart3,
    id: "dashboard",
  },
  {
    title: "Users",
    icon: Users,
    id: "users",
  },
  {
    title: "Courses",
    icon: GraduationCap,
    id: "courses",
    submenu: [
      { title: "All Courses", id: "courses-all" },
      { title: "Course Folders", id: "courses-folders" },
      { title: "Enrollments", id: "enrollments" },
    ],
  },
  {
    title: "Messages",
    icon: MessageSquare,
    id: "messages",
  },
  {
    title: "Analytics",
    icon: Activity,
    id: "analytics",
  },
  {
    title: "Settings",
    icon: Settings,
    id: "settings",
    submenu: [
      { title: "General", id: "settings-general" },
      { title: "Appearance", id: "settings-appearance" },
      { title: "Language", id: "settings-language" },
    ],
  },
];

function AdminPageContent() {
  const { logout, user } = useAuth();
  const router = useRouter();
  const { theme, toggleTheme, isDark } = useThemeToggle();
  const { language, setLanguage, getLanguageDisplayName } = useLanguage();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());
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
    // Load data from localStorage
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
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const goHome = () => {
    router.push('/');
  };

  const toggleMenu = (menuId: string) => {
    const newExpanded = new Set(expandedMenus);
    if (newExpanded.has(menuId)) {
      newExpanded.delete(menuId);
    } else {
      newExpanded.add(menuId);
    }
    setExpandedMenus(newExpanded);
  };

  // Course management handlers
  const handleCourseSaved = (course: any) => {
    const savedCourses = safeLocalStorage.getItem('adminCourses', []);
    const updatedCourses = [course, ...savedCourses];
    safeLocalStorage.setItem('adminCourses', updatedCourses);
    setCourses(updatedCourses);
  };

  const handleCourseFolderSaved = (courseFolder: any) => {
    const savedCourseFolders = safeLocalStorage.getItem('adminCourseFolders', []);
    const updatedCourseFolders = [courseFolder, ...savedCourseFolders];
    safeLocalStorage.setItem('adminCourseFolders', updatedCourseFolders);
    setCourseFolders(updatedCourseFolders);
  };

  const handleTopicSaved = (topic: any) => {
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

  // Payment approval handlers
  const handleApprovePayment = async (courseId: number, studentEmail: string) => {
    try {
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

  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your business.</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +20.1% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Course Enrollments</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrollments.length}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              {notifications.length} pending approval
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +12 new this week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$28,000</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +15% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Website Traffic</CardTitle>
            <CardDescription>Monthly visitors and page views</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <AreaChart data={visitorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area 
                  type="monotone" 
                  dataKey="visitors" 
                  stackId="1"
                  stroke="var(--color-visitors)" 
                  fill="var(--color-visitors)"
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="pageViews" 
                  stackId="1"
                  stroke="var(--color-pageViews)" 
                  fill="var(--color-pageViews)"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Performance</CardTitle>
            <CardDescription>Enrollment vs completion rates</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={courseEnrollmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="course" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="enrolled" fill="var(--color-enrolled)" />
                <Bar dataKey="completed" fill="var(--color-completed)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Trends</CardTitle>
          <CardDescription>Monthly revenue and profit analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="var(--color-revenue)" 
                strokeWidth={3}
                dot={{ fill: "var(--color-revenue)", strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="var(--color-profit)" 
                strokeWidth={3}
                dot={{ fill: "var(--color-profit)", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Recent Activity */}
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
                  <p className="text-xs text-muted-foreground">Check Course Enrollments</p>
                </div>
              </div>
            )}
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">New contact form submission</p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Website traffic increased</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">New service inquiry</p>
                <p className="text-xs text-muted-foreground">3 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your application preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the admin panel looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Theme</div>
                <div className="text-xs text-muted-foreground">
                  Switch between light and dark mode
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="h-9 w-9"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Language</CardTitle>
            <CardDescription>Choose your preferred language</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Interface Language</div>
                <div className="text-xs text-muted-foreground">
                  Currently: {getLanguageDisplayName(language)}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant={language === 'en' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLanguage('en')}
                >
                  EN
                </Button>
                <Button
                  variant={language === 'am' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLanguage('am')}
                >
                  አማ
                </Button>
                <Button
                  variant={language === 'or' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLanguage('or')}
                >
                  OR
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Preferences</CardTitle>
          <CardDescription>Configure system-wide settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium">Maintenance Mode</h3>
              <p className="text-xs text-muted-foreground">Enable maintenance mode for the website</p>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium">SEO Settings</h3>
              <p className="text-xs text-muted-foreground">Manage meta tags and SEO configuration</p>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium">Analytics</h3>
              <p className="text-xs text-muted-foreground">Configure Google Analytics and tracking</p>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'settings':
      case 'settings-general':
      case 'settings-appearance':
      case 'settings-language':
        return renderSettings();
      case 'users':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">User Management</h1>
              <p className="text-muted-foreground">Manage website users and permissions</p>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">User management features coming soon...</p>
              </CardContent>
            </Card>
          </div>
        );
      case 'courses':
      case 'courses-all':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Course Management</h1>
                <p className="text-muted-foreground">Manage your courses and educational content</p>
              </div>
              <div className="flex space-x-3">
                <Button onClick={() => setIsAddCourseFolderModalOpen(true)} variant="outline" className="flex items-center space-x-2">
                  <FolderPlus className="h-4 w-4" />
                  <span>Add Course Folder</span>
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
                  <CardTitle className="text-sm font-medium">Total Topics</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{topics.length}</div>
                  <p className="text-xs text-muted-foreground">Topics across all folders</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Enrollments</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{enrollments.filter((e: any) => e.status === 'approved').length}</div>
                  <p className="text-xs text-muted-foreground">Students actively enrolled</p>
                </CardContent>
              </Card>
            </div>

            {courseFolders.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Course Folders</CardTitle>
                  <CardDescription>Organize your courses into folders and manage topics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {courseFolders.map((folder: any) => (
                    <div key={folder.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFolderExpansion(folder.id)}
                            className="h-6 w-6 p-0"
                          >
                            {expandedFolders.has(folder.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                          <Folder className="h-5 w-5 text-blue-500" />
                          <div>
                            <h3 className="font-medium">{folder.title}</h3>
                            <p className="text-sm text-muted-foreground">{folder.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">
                            {getTopicsForFolder(folder.id).length} topics
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openAddTopicModal(folder)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Topic
                          </Button>
                        </div>
                      </div>

                      {expandedFolders.has(folder.id) && (
                        <div className="mt-4 pl-8 space-y-2">
                          {getTopicsForFolder(folder.id).map((topic: any) => (
                            <div key={topic.id} className="flex items-center justify-between py-2 px-3 bg-muted rounded">
                              <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4 text-green-500" />
                                <span className="text-sm">{topic.title}</span>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                Order: {topic.order}
                              </Badge>
                            </div>
                          ))}
                          {getTopicsForFolder(folder.id).length === 0 && (
                            <p className="text-sm text-muted-foreground py-2">No topics in this folder yet.</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {courses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Individual Courses</CardTitle>
                  <CardDescription>Standalone courses not organized in folders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courses.map((course: any) => (
                      <div key={course.id} className="border rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <Video className="h-5 w-5 text-purple-500" />
                          <h3 className="font-medium">{course.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{course.detail}</p>
                        <div className="text-xs text-muted-foreground">
                          Instructor: {course.instructor}
                        </div>
                        {course.duration && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Duration: {Math.round(course.duration / 60)} minutes
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {courseFolders.length === 0 && courses.length === 0 && (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No courses yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start by creating your first course folder or individual course.
                    </p>
                    <div className="flex justify-center space-x-3">
                      <Button onClick={() => setIsAddCourseFolderModalOpen(true)} variant="outline">
                        <FolderPlus className="h-4 w-4 mr-2" />
                        Add Course Folder
                      </Button>
                      <Button onClick={() => setIsAddCourseModalOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Course
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );
      case 'courses-folders':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Course Folders</h1>
                <p className="text-muted-foreground">Organize courses into structured learning paths</p>
              </div>
              <Button onClick={() => setIsAddCourseFolderModalOpen(true)} className="flex items-center space-x-2">
                <FolderPlus className="h-4 w-4" />
                <span>Add Course Folder</span>
              </Button>
            </div>

            {courseFolders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courseFolders.map((folder: any) => (
                  <Card key={folder.id}>
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Folder className="h-5 w-5 text-blue-500" />
                        <CardTitle className="text-lg">{folder.title}</CardTitle>
                      </div>
                      <CardDescription>{folder.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Topics</span>
                          <Badge variant="outline">{getTopicsForFolder(folder.id).length}</Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openAddTopicModal(folder)}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Topic
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No course folders</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first course folder to organize learning content.
                    </p>
                    <Button onClick={() => setIsAddCourseFolderModalOpen(true)}>
                      <FolderPlus className="h-4 w-4 mr-2" />
                      Create Course Folder
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );
      case 'enrollments':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Enrollment Management</h1>
              <p className="text-muted-foreground">Review and approve student enrollment requests</p>
            </div>

            {notifications.length > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="text-orange-800">Pending Payment Approvals</CardTitle>
                  <CardDescription className="text-orange-600">
                    {notifications.length} payment proof(s) require your review
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {notifications.map((notification: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white rounded border">
                      <div className="flex items-center space-x-3">
                        <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-foreground">{notification.studentName}</p>
                          <p className="text-sm text-muted-foreground">{notification.studentEmail}</p>
                          <p className="text-sm text-muted-foreground">Course ID: {notification.courseId}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleApprovePayment(notification.courseId, notification.studentEmail)}
                          size="sm"
                          variant="default"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleRejectPayment(notification.courseId, notification.studentEmail)}
                          size="sm"
                          variant="destructive"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>All Enrollments</CardTitle>
                <CardDescription>Complete list of student enrollments and their status</CardDescription>
              </CardHeader>
              <CardContent>
                {enrollments.length > 0 ? (
                  <div className="space-y-4">
                    {enrollments.map((enrollment: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="font-medium">{enrollment.studentName}</p>
                            <p className="text-sm text-muted-foreground">{enrollment.email}</p>
                            <p className="text-sm text-muted-foreground">Course ID: {enrollment.courseId}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge
                            variant={
                              enrollment.status === 'approved'
                                ? 'default'
                                : enrollment.status === 'rejected'
                                ? 'destructive'
                                : 'secondary'
                            }
                          >
                            {enrollment.status}
                          </Badge>
                          <div className="text-sm text-muted-foreground">
                            {enrollment.status === 'approved' && enrollment.approvedAt
                              ? new Date(enrollment.approvedAt).toLocaleDateString()
                              : enrollment.status === 'rejected' && enrollment.rejectedAt
                              ? new Date(enrollment.rejectedAt).toLocaleDateString()
                              : new Date(enrollment.enrolledAt).toLocaleDateString()
                            }
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No enrollments yet</h3>
                    <p className="text-muted-foreground">
                      Student enrollment requests will appear here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
      case 'messages':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Messages</h1>
              <p className="text-muted-foreground">View and respond to customer inquiries</p>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Message management features coming soon...</p>
              </CardContent>
            </Card>
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
              <p className="text-muted-foreground">Detailed analytics and insights</p>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Advanced analytics features coming soon...</p>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b px-6 py-4">
            <div className="flex items-center space-x-3">
              <Image src="/logo.png" alt="Triple Technologies Logo" width={32} height={32} />
              <div>
                <div className="font-semibold text-lg">Triple Tech</div>
                <div className="text-xs text-muted-foreground">Admin Panel</div>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="px-4 py-4">
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => {
                      if (item.submenu) {
                        toggleMenu(item.id);
                      } else {
                        setActiveSection(item.id);
                      }
                    }}
                    isActive={activeSection === item.id || activeSection.startsWith(item.id + '-')}
                    className="w-full justify-start"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                    {item.id === 'courses' && notifications.length > 0 && (
                      <Badge variant="destructive" className="ml-2 px-1 py-0 text-xs">
                        {notifications.length}
                      </Badge>
                    )}
                    {item.submenu && (
                      <ChevronRight 
                        className={`h-4 w-4 ml-auto transition-transform ${
                          expandedMenus.has(item.id) ? 'transform rotate-90' : ''
                        }`} 
                      />
                    )}
                  </SidebarMenuButton>
                  
                  {item.submenu && expandedMenus.has(item.id) && (
                    <SidebarMenuSub>
                      {item.submenu.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.id}>
                          <SidebarMenuSubButton
                            onClick={() => setActiveSection(subItem.id)}
                            isActive={activeSection === subItem.id}
                          >
                            {subItem.title}
                            {subItem.id === 'enrollments' && notifications.length > 0 && (
                              <Badge variant="destructive" className="ml-2 px-1 py-0 text-xs">
                                {notifications.length}
                              </Badge>
                            )}
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter className="border-t px-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-3 px-2">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                  {user?.username?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{user?.username}</div>
                  <div className="text-xs text-muted-foreground">Administrator</div>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button variant="outline" size="sm" onClick={goHome} className="flex-1">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout} className="flex-1">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1" />
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                {getLanguageDisplayName(language)}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="h-8 w-8"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto p-6">
            {renderContent()}
          </main>
        </SidebarInset>
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
    </SidebarProvider>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminPageContent />
    </ProtectedRoute>
  );
}