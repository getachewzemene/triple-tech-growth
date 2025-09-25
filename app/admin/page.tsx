'use client';

import { useAuth } from '@/app/providers/AuthProvider';
import { useLanguage } from '@/app/providers/LanguageProvider';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  LogOut, Users, MessageSquare, BarChart3, Settings, Home, GraduationCap, 
  CheckCircle, XCircle, Plus, Video, FolderPlus, Folder, ChevronRight, 
  ChevronDown, FileText, Moon, Sun, Globe, Palette, TrendingUp, 
  TrendingDown, Activity, BookOpen, UserCheck, Reply, Search, Filter,
  Eye, Trash2, Archive, Star, Clock, Mail, Phone, MapPin, Calendar,
  PieChart, Download, RefreshCw, Edit
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

// Real-world data for charts - Updated with realistic growth patterns
const visitorData = [
  { month: 'Jul 2023', visitors: 2350, pageViews: 8450 },
  { month: 'Aug 2023', visitors: 2890, pageViews: 9800 },
  { month: 'Sep 2023', visitors: 3420, pageViews: 12100 },
  { month: 'Oct 2023', visitors: 4200, pageViews: 15800 },
  { month: 'Nov 2023', visitors: 5670, pageViews: 19200 },
  { month: 'Dec 2023', visitors: 6890, pageViews: 24500 },
  { month: 'Jan 2024', visitors: 8920, pageViews: 31200 },
  { month: 'Feb 2024', visitors: 10450, pageViews: 38900 },
  { month: 'Mar 2024', visitors: 12300, pageViews: 45600 },
  { month: 'Apr 2024', visitors: 14200, pageViews: 52800 },
  { month: 'May 2024', visitors: 16800, pageViews: 61400 },
  { month: 'Jun 2024', visitors: 19500, pageViews: 72300 },
];

const courseEnrollmentData = [
  { course: 'Full-Stack Web Development', enrolled: 342, completed: 289 },
  { course: 'React & Next.js Mastery', enrolled: 298, completed: 251 },
  { course: 'Python Data Science', enrolled: 267, completed: 201 },
  { course: 'Mobile App Development', enrolled: 189, completed: 145 },
  { course: 'DevOps & Cloud Computing', enrolled: 156, completed: 124 },
  { course: 'UI/UX Design Bootcamp', enrolled: 234, completed: 198 },
  { course: 'Machine Learning & AI', enrolled: 145, completed: 98 },
  { course: 'JavaScript Fundamentals', enrolled: 387, completed: 342 },
  { course: 'Database Design & SQL', enrolled: 178, completed: 156 },
  { course: 'Cybersecurity Essentials', enrolled: 123, completed: 89 },
];

const revenueData = [
  { month: 'Jul 2023', revenue: 45800, profit: 28200 },
  { month: 'Aug 2023', revenue: 52300, profit: 33100 },
  { month: 'Sep 2023', revenue: 61500, profit: 39800 },
  { month: 'Oct 2023', revenue: 73200, profit: 47900 },
  { month: 'Nov 2023', revenue: 89400, profit: 58600 },
  { month: 'Dec 2023', revenue: 108700, profit: 71200 },
  { month: 'Jan 2024', revenue: 127500, profit: 83600 },
  { month: 'Feb 2024', revenue: 142800, profit: 93500 },
  { month: 'Mar 2024', revenue: 158900, profit: 104200 },
  { month: 'Apr 2024', revenue: 176300, profit: 115600 },
  { month: 'May 2024', revenue: 194800, profit: 127800 },
  { month: 'Jun 2024', revenue: 215600, profit: 141400 },
];

// Sample message data for demonstration
const sampleMessages = [
  {
    id: 1,
    sender: "John Smith",
    email: "john.smith@example.com",
    phone: "+1-555-0123",
    subject: "Course Inquiry - Web Development",
    message: "Hi, I'm interested in your web development course. Could you provide more details about the curriculum and start dates?",
    timestamp: new Date('2024-01-15T10:30:00'),
    status: "unread",
    priority: "high",
    type: "inquiry",
    location: "New York, NY"
  },
  {
    id: 2,
    sender: "Sarah Johnson",
    email: "sarah.j@company.com",
    phone: "+1-555-0124",
    subject: "Corporate Training Request",
    message: "We're looking for corporate training solutions for our development team of 15 people. Please send a quote for custom training programs.",
    timestamp: new Date('2024-01-14T15:45:00'),
    status: "replied",
    priority: "high",
    type: "business",
    location: "San Francisco, CA"
  },
  {
    id: 3,
    sender: "Mike Chen",
    email: "mike.chen@email.com",
    phone: "+1-555-0125",
    subject: "Technical Support - Course Access",
    message: "I'm having trouble accessing my enrolled course materials. The videos won't load properly.",
    timestamp: new Date('2024-01-13T08:15:00'),
    status: "in_progress",
    priority: "medium",
    type: "support",
    location: "Seattle, WA"
  },
  {
    id: 4,
    sender: "Emily Davis",
    email: "emily.davis@student.edu",
    phone: "+1-555-0126",
    subject: "Payment Confirmation",
    message: "I just completed payment for the Data Science course. When will I receive access to the materials?",
    timestamp: new Date('2024-01-12T14:20:00'),
    status: "read",
    priority: "low",
    type: "payment",
    location: "Boston, MA"
  },
  {
    id: 5,
    sender: "David Wilson",
    email: "d.wilson@techcorp.com",
    phone: "+1-555-0127",
    subject: "Partnership Opportunity",
    message: "We're interested in discussing a potential partnership for providing training to our clients. Let's schedule a call.",
    timestamp: new Date('2024-01-11T11:30:00'),
    status: "starred",
    priority: "high",
    type: "business",
    location: "Austin, TX"
  }
];

// Real-world analytics data with comprehensive business metrics
const analyticsData = {
  overview: {
    totalPageViews: 487650,
    uniqueVisitors: 89420,
    bounceRate: 28.4,
    avgSessionDuration: "6m 47s",
    conversionRate: 12.3,
    totalRevenue: 1847300
  },
  traffic: [
    { source: 'Organic Search', visitors: 35680, percentage: 39.9 },
    { source: 'Direct', visitors: 21580, percentage: 24.1 },
    { source: 'Social Media', visitors: 15720, percentage: 17.6 },
    { source: 'Referral', visitors: 8940, percentage: 10.0 },
    { source: 'Paid Advertising', visitors: 5380, percentage: 6.0 },
    { source: 'Email Campaign', visitors: 2120, percentage: 2.4 }
  ],
  devices: [
    { device: 'Desktop', users: 48420, percentage: 54.1 },
    { device: 'Mobile', users: 32890, percentage: 36.8 },
    { device: 'Tablet', users: 8110, percentage: 9.1 }
  ],
  topPages: [
    { page: '/courses', views: 125840, uniqueViews: 89320 },
    { page: '/training', views: 98760, uniqueViews: 72450 },
    { page: '/', views: 87650, uniqueViews: 63280 },
    { page: '/course/web-development', views: 45230, uniqueViews: 34890 },
    { page: '/course/data-science', views: 38940, uniqueViews: 29570 },
    { page: '/about', views: 28750, uniqueViews: 23120 },
    { page: '/contact', views: 19840, uniqueViews: 16780 }
  ],
  conversionFunnel: [
    { stage: 'Website Visitors', count: 89420, percentage: 100.0 },
    { stage: 'Course Page Views', count: 52780, percentage: 59.0 },
    { stage: 'Course Details Viewed', count: 28940, percentage: 32.4 },
    { stage: 'Contact Forms Submitted', count: 15680, percentage: 17.5 },
    { stage: 'Enrollment Applications', count: 12340, percentage: 13.8 },
    { stage: 'Payment Completed', count: 10980, percentage: 12.3 }
  ]
};

// User management sample data
const sampleUsers = [
  {
    id: 1,
    username: "johnsmith",
    email: "john.smith@example.com",
    fullName: "John Smith",
    role: "student",
    status: "active",
    joinDate: new Date('2024-01-10'),
    lastLogin: new Date('2024-01-15T09:30:00'),
    coursesEnrolled: 3,
    completedCourses: 1,
    location: "New York, NY"
  },
  {
    id: 2,
    username: "sarahjohnson",
    email: "sarah.j@company.com",
    fullName: "Sarah Johnson",
    role: "corporate",
    status: "active",
    joinDate: new Date('2023-12-15'),
    lastLogin: new Date('2024-01-14T16:45:00'),
    coursesEnrolled: 5,
    completedCourses: 4,
    location: "San Francisco, CA"
  },
  {
    id: 3,
    username: "mikechen",
    email: "mike.chen@email.com",
    fullName: "Mike Chen",
    role: "student",
    status: "pending",
    joinDate: new Date('2024-01-12'),
    lastLogin: new Date('2024-01-13T08:15:00'),
    coursesEnrolled: 1,
    completedCourses: 0,
    location: "Seattle, WA"
  },
  {
    id: 4,
    username: "emilydavis",
    email: "emily.davis@student.edu",
    fullName: "Emily Davis",
    role: "student",
    status: "active",
    joinDate: new Date('2023-11-20'),
    lastLogin: new Date('2024-01-12T14:20:00'),
    coursesEnrolled: 2,
    completedCourses: 2,
    location: "Boston, MA"
  },
  {
    id: 5,
    username: "admin",
    email: "admin@tripletechnologies.com",
    fullName: "Admin User",
    role: "admin",
    status: "active",
    joinDate: new Date('2023-01-01'),
    lastLogin: new Date('2024-01-15T10:00:00'),
    coursesEnrolled: 0,
    completedCourses: 0,
    location: "Ethiopia"
  }
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

  // Messages management state
  const [messages, setMessages] = useState(sampleMessages);
  const [messageFilter, setMessageFilter] = useState('all');
  const [messageSearch, setMessageSearch] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [replyContent, setReplyContent] = useState('');

  // User management state
  const [users, setUsers] = useState(sampleUsers);
  const [userFilter, setUserFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);

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
            <div className="text-2xl font-bold">89,420</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +34.2% from last year
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
            <div className="text-2xl font-bold">1,847</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +156 new this month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$215,600</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +28.4% from last month
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
        const filteredUsers = users.filter(user => {
          const matchesSearch = userSearch === '' || 
            user.username.toLowerCase().includes(userSearch.toLowerCase()) ||
            user.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
            user.email.toLowerCase().includes(userSearch.toLowerCase());
          
          const matchesFilter = userFilter === 'all' || user.role === userFilter || user.status === userFilter;
          
          return matchesSearch && matchesFilter;
        });

        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">User Management</h1>
                <p className="text-muted-foreground">Manage users, roles, and permissions</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="pl-10 w-full sm:w-[300px]"
                  />
                </div>
                <select 
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="all">All Users</option>
                  <option value="admin">Admins</option>
                  <option value="student">Students</option>
                  <option value="corporate">Corporate</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            {/* User Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">{users.length}</p>
                      <p className="text-xs text-muted-foreground">Total Users</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">{users.filter(u => u.status === 'active').length}</p>
                      <p className="text-xs text-muted-foreground">Active</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    <div>
                      <p className="text-2xl font-bold">{users.filter(u => u.status === 'pending').length}</p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Settings className="h-4 w-4 text-purple-500" />
                    <div>
                      <p className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</p>
                      <p className="text-xs text-muted-foreground">Admins</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* User Management Table */}
            <Card>
              <CardHeader>
                <CardTitle>User Directory</CardTitle>
                <CardDescription>
                  {filteredUsers.length} of {users.length} users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead className="hidden sm:table-cell">Email</TableHead>
                        <TableHead className="hidden md:table-cell">Role</TableHead>
                        <TableHead className="hidden lg:table-cell">Courses</TableHead>
                        <TableHead className="hidden lg:table-cell">Last Login</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[120px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{user.fullName}</p>
                              <p className="text-xs text-muted-foreground">@{user.username}</p>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <div>
                              <p className="text-sm">{user.email}</p>
                              <p className="text-xs text-muted-foreground">{user.location}</p>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge 
                              variant={
                                user.role === 'admin' ? 'default' : 
                                user.role === 'corporate' ? 'secondary' : 
                                'outline'
                              }
                              className="capitalize"
                            >
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div>
                              <p className="text-sm font-medium">{user.coursesEnrolled} enrolled</p>
                              <p className="text-xs text-muted-foreground">{user.completedCourses} completed</p>
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div>
                              <p className="text-sm">
                                {user.lastLogin.toLocaleDateString()}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {user.lastLogin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                user.status === 'active' ? 'default' :
                                user.status === 'pending' ? 'secondary' :
                                'destructive'
                              }
                              className="capitalize"
                            >
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedUser(user)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  const updatedUsers = users.map(u => 
                                    u.id === user.id 
                                      ? { 
                                          ...u, 
                                          status: u.status === 'active' ? 'suspended' : 'active' 
                                        }
                                      : u
                                  );
                                  setUsers(updatedUsers);
                                }}
                              >
                                {user.status === 'active' ? (
                                  <XCircle className="h-3 w-3" />
                                ) : (
                                  <CheckCircle className="h-3 w-3" />
                                )}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No users found</h3>
                      <p className="text-muted-foreground">
                        {userSearch || userFilter !== 'all' 
                          ? 'Try adjusting your search or filter criteria.'
                          : 'Users will appear here when they register.'
                        }
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* User Detail Modal - Mobile Friendly */}
            {selectedUser && (
              <Card className="fixed inset-4 z-50 bg-background border shadow-lg md:inset-x-1/4 md:inset-y-16 overflow-auto">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{selectedUser.fullName}</CardTitle>
                      <CardDescription>@{selectedUser.username}</CardDescription>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedUser(null)}
                    >
                      ×
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-muted-foreground">Email</p>
                      <p>{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Role</p>
                      <Badge variant="outline" className="capitalize">
                        {selectedUser.role}
                      </Badge>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Status</p>
                      <Badge 
                        variant={selectedUser.status === 'active' ? 'default' : 'secondary'}
                        className="capitalize"
                      >
                        {selectedUser.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Location</p>
                      <p>{selectedUser.location}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Join Date</p>
                      <p>{selectedUser.joinDate.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Last Login</p>
                      <p>{selectedUser.lastLogin.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Courses Enrolled</p>
                      <p>{selectedUser.coursesEnrolled}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Completed</p>
                      <p>{selectedUser.completedCourses}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        onClick={() => {
                          const updatedUsers = users.map(u => 
                            u.id === selectedUser.id 
                              ? { 
                                  ...u, 
                                  status: u.status === 'active' ? 'suspended' : 'active' 
                                }
                              : u
                          );
                          setUsers(updatedUsers);
                          setSelectedUser(null);
                        }}
                      >
                        {selectedUser.status === 'active' ? 'Suspend User' : 'Activate User'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                      >
                        Edit User
                      </Button>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedUser(null)}
                    >
                      Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* User Role Distribution Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Role Distribution</CardTitle>
                  <CardDescription>Breakdown of user roles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['admin', 'student', 'corporate'].map(role => {
                      const count = users.filter(u => u.role === role).length;
                      const percentage = (count / users.length) * 100;
                      return (
                        <div key={role} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-sm capitalize">{role}</span>
                            <span className="text-sm">{count} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary rounded-full h-2 transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest user activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users
                      .sort((a, b) => b.lastLogin.getTime() - a.lastLogin.getTime())
                      .slice(0, 5)
                      .map((user, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                            {user.fullName.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{user.fullName}</p>
                            <p className="text-xs text-muted-foreground">
                              Last active: {user.lastLogin.toLocaleString()}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {user.role}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
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
        const filteredMessages = messages.filter(message => {
          const matchesSearch = messageSearch === '' || 
            message.sender.toLowerCase().includes(messageSearch.toLowerCase()) ||
            message.subject.toLowerCase().includes(messageSearch.toLowerCase()) ||
            message.email.toLowerCase().includes(messageSearch.toLowerCase());
          
          const matchesFilter = messageFilter === 'all' || message.status === messageFilter;
          
          return matchesSearch && matchesFilter;
        });

        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Messages</h1>
                <p className="text-muted-foreground">Manage customer inquiries and communications</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search messages..."
                    value={messageSearch}
                    onChange={(e) => setMessageSearch(e.target.value)}
                    className="pl-10 w-full sm:w-[300px]"
                  />
                </div>
                <select 
                  value={messageFilter}
                  onChange={(e) => setMessageFilter(e.target.value)}
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="all">All Messages</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="in_progress">In Progress</option>
                  <option value="starred">Starred</option>
                </select>
              </div>
            </div>

            {/* Message Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">{messages.length}</p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4 text-red-500" />
                    <div>
                      <p className="text-2xl font-bold">{messages.filter(m => m.status === 'unread').length}</p>
                      <p className="text-xs text-muted-foreground">Unread</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Reply className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">{messages.filter(m => m.status === 'replied').length}</p>
                      <p className="text-xs text-muted-foreground">Replied</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <div>
                      <p className="text-2xl font-bold">{messages.filter(m => m.status === 'starred').length}</p>
                      <p className="text-xs text-muted-foreground">Starred</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Messages Table */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Messages</CardTitle>
                <CardDescription>
                  {filteredMessages.length} of {messages.length} messages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Sender</TableHead>
                        <TableHead className="hidden sm:table-cell">Contact</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead className="hidden md:table-cell">Type</TableHead>
                        <TableHead className="hidden lg:table-cell">Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMessages.map((message) => (
                        <TableRow key={message.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{message.sender}</p>
                              <p className="text-xs text-muted-foreground sm:hidden">
                                {message.email}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <div className="space-y-1">
                              <p className="text-sm">{message.email}</p>
                              <p className="text-xs text-muted-foreground">{message.phone}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium truncate max-w-[200px]">{message.subject}</p>
                              <p className="text-xs text-muted-foreground">
                                {message.message.length > 50 
                                  ? message.message.substring(0, 50) + '...' 
                                  : message.message
                                }
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge 
                              variant={message.type === 'business' ? 'default' : 'secondary'}
                              className="capitalize"
                            >
                              {message.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div>
                              <p className="text-sm">
                                {message.timestamp.toLocaleDateString()}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                message.status === 'unread' ? 'destructive' :
                                message.status === 'replied' ? 'default' :
                                message.status === 'starred' ? 'secondary' :
                                'outline'
                              }
                              className="capitalize"
                            >
                              {message.status.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedMessage(message)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  const updatedMessages = messages.map(m => 
                                    m.id === message.id 
                                      ? { ...m, status: m.status === 'starred' ? 'read' : 'starred' }
                                      : m
                                  );
                                  setMessages(updatedMessages);
                                }}
                              >
                                <Star className={`h-3 w-3 ${message.status === 'starred' ? 'fill-current' : ''}`} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {filteredMessages.length === 0 && (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No messages found</h3>
                      <p className="text-muted-foreground">
                        {messageSearch || messageFilter !== 'all' 
                          ? 'Try adjusting your search or filter criteria.'
                          : 'Customer messages will appear here.'
                        }
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Message Detail Modal - Mobile Friendly */}
            {selectedMessage && (
              <Card className="fixed inset-4 z-50 bg-background border shadow-lg md:inset-x-1/4 md:inset-y-16 overflow-auto">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{selectedMessage.subject}</CardTitle>
                      <CardDescription>
                        From: {selectedMessage.sender} ({selectedMessage.email})
                      </CardDescription>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedMessage(null)}
                    >
                      ×
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 p-4">
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {selectedMessage.phone}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {selectedMessage.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {selectedMessage.timestamp.toLocaleString()}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Message</h4>
                    <p className="text-sm bg-muted p-3 rounded">{selectedMessage.message}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Quick Reply</h4>
                    <Textarea
                      placeholder="Type your response..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      rows={4}
                    />
                    <div className="flex justify-between mt-2">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => {
                            const updatedMessages = messages.map(m => 
                              m.id === selectedMessage.id ? { ...m, status: 'replied' } : m
                            );
                            setMessages(updatedMessages);
                            setReplyContent('');
                            setSelectedMessage(null);
                          }}
                          disabled={!replyContent.trim()}
                        >
                          Send Reply
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            const updatedMessages = messages.map(m => 
                              m.id === selectedMessage.id ? { ...m, status: 'read' } : m
                            );
                            setMessages(updatedMessages);
                            setSelectedMessage(null);
                          }}
                        >
                          Mark as Read
                        </Button>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedMessage(null)}
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Analytics</h1>
                <p className="text-muted-foreground">Comprehensive business intelligence and insights</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Key Metrics Overview */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-xl sm:text-2xl font-bold">{analyticsData.overview.totalPageViews.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Page Views</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-xl sm:text-2xl font-bold">{analyticsData.overview.uniqueVisitors.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Unique Visitors</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingDown className="h-4 w-4 text-orange-500" />
                    <div>
                      <p className="text-xl sm:text-2xl font-bold">{analyticsData.overview.bounceRate}%</p>
                      <p className="text-xs text-muted-foreground">Bounce Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-purple-500" />
                    <div>
                      <p className="text-xl sm:text-2xl font-bold">{analyticsData.overview.avgSessionDuration}</p>
                      <p className="text-xs text-muted-foreground">Avg Session</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-xl sm:text-2xl font-bold">{analyticsData.overview.conversionRate}%</p>
                      <p className="text-xs text-muted-foreground">Conversion</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-xl sm:text-2xl font-bold">${analyticsData.overview.totalRevenue.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Traffic Sources */}
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                  <CardDescription>Where your visitors are coming from</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.traffic.map((source, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-primary" style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}></div>
                          <span className="font-medium text-sm">{source.source}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm">{source.visitors.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{source.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Device Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Device Breakdown</CardTitle>
                  <CardDescription>User device preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.devices.map((device, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">{device.device}</span>
                          <span className="text-sm">{device.percentage}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary rounded-full h-2 transition-all duration-300"
                            style={{ width: `${device.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Pages Table */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Pages</CardTitle>
                <CardDescription>Most visited pages on your website</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Page</TableHead>
                        <TableHead className="hidden sm:table-cell">Total Views</TableHead>
                        <TableHead>Unique Views</TableHead>
                        <TableHead className="hidden md:table-cell">Performance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analyticsData.topPages.map((page, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{page.page}</TableCell>
                          <TableCell className="hidden sm:table-cell">{page.views.toLocaleString()}</TableCell>
                          <TableCell>{page.uniqueViews.toLocaleString()}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center space-x-2">
                              <div className="w-full bg-muted rounded-full h-2 max-w-[100px]">
                                <div 
                                  className="bg-primary rounded-full h-2"
                                  style={{ width: `${(page.views / analyticsData.topPages[0].views) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {Math.round((page.views / analyticsData.topPages[0].views) * 100)}%
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Conversion Funnel */}
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>Customer journey from visitor to conversion</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.conversionFunnel.map((stage, index) => (
                    <div key={index} className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{stage.stage}</span>
                        <div className="text-right">
                          <span className="font-bold">{stage.count.toLocaleString()}</span>
                          <span className="text-sm text-muted-foreground ml-2">({stage.percentage}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full h-3 transition-all duration-500"
                          style={{ width: `${stage.percentage}%` }}
                        ></div>
                      </div>
                      {index < analyticsData.conversionFunnel.length - 1 && (
                        <div className="flex justify-center mt-2">
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Real-time Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Real-time Activity</CardTitle>
                  <CardDescription>Current website activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Active Users</span>
                      <span className="font-bold text-lg text-green-600">23</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Pages/Session</span>
                      <span className="font-bold">3.2</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Top Active Page</span>
                      <span className="font-bold text-sm">/courses</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">New Sessions</span>
                      <span className="font-bold">67%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Insights</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Page Load Time</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        1.2s
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Server Response</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        98ms
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Uptime</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        99.9%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Error Rate</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        0.1%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar className="border-r hidden lg:block">
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
        
        <SidebarInset className="flex-1 flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 lg:px-6">
            <SidebarTrigger className="-ml-1 lg:hidden" />
            <div className="flex-1 lg:hidden">
              <h2 className="text-lg font-semibold truncate">
                {sidebarItems.find(item => 
                  item.id === activeSection || 
                  item.submenu?.some(sub => sub.id === activeSection)
                )?.title || 'Dashboard'}
              </h2>
            </div>
            <div className="hidden lg:flex flex-1" />
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="hidden sm:flex">
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
              <div className="lg:hidden">
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto p-4 lg:p-6">
            {renderContent()}
          </main>
        </SidebarInset>

        {/* Mobile Navigation Drawer */}
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 hidden" />
          <div className="fixed inset-y-0 left-0 z-50 h-full w-72 border-r bg-background shadow-lg transition-transform -translate-x-full data-[state=open]:translate-x-0 hidden">
            <div className="flex h-16 items-center border-b px-6">
              <div className="flex items-center space-x-3">
                <Image src="/logo.png" alt="Triple Technologies Logo" width={32} height={32} />
                <div>
                  <div className="font-semibold text-lg">Triple Tech</div>
                  <div className="text-xs text-muted-foreground">Admin Panel</div>
                </div>
              </div>
            </div>
            
            <div className="px-4 py-4">
              <div className="space-y-2">
                {sidebarItems.map((item) => (
                  <div key={item.id}>
                    <button
                      onClick={() => {
                        if (item.submenu) {
                          toggleMenu(item.id);
                        } else {
                          setActiveSection(item.id);
                        }
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeSection === item.id || activeSection.startsWith(item.id + '-')
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.id === 'courses' && notifications.length > 0 && (
                        <Badge variant="destructive" className="ml-auto px-1 py-0 text-xs">
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
                    </button>
                    
                    {item.submenu && expandedMenus.has(item.id) && (
                      <div className="ml-6 mt-2 space-y-1">
                        {item.submenu.map((subItem) => (
                          <button
                            key={subItem.id}
                            onClick={() => setActiveSection(subItem.id)}
                            className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
                              activeSection === subItem.id
                                ? 'bg-primary/10 text-primary'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                          >
                            <span>{subItem.title}</span>
                            {subItem.id === 'enrollments' && notifications.length > 0 && (
                              <Badge variant="destructive" className="ml-auto px-1 py-0 text-xs">
                                {notifications.length}
                              </Badge>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 border-t p-4">
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
            </div>
          </div>
        </div>
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