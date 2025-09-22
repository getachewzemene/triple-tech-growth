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
            <div>
              <h1 className="text-3xl font-bold text-foreground">Course Management</h1>
              <p className="text-muted-foreground">Manage your courses and educational content</p>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Course management interface coming soon...</p>
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