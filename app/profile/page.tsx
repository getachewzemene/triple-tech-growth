'use client';

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendar, FaClock, FaCheckCircle, FaHourglassHalf, FaTimesCircle } from "react-icons/fa";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { safeLocalStorage } from "@/lib/hooks/useLocalStorage";

export default function ProfilePage() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Load enrolled courses from localStorage
    const courses = safeLocalStorage.getItem('enrolledCourses', []);
    setEnrolledCourses(courses);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-96">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-4">Please Log In</h2>
              <p className="text-muted-foreground mb-4">You need to be logged in to view your profile.</p>
              <Button onClick={() => router.push('/admin/login')}>
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'payment_submitted': return 'bg-yellow-100 text-yellow-800';
      case 'pending_payment': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <FaCheckCircle className="text-green-600" />;
      case 'payment_submitted': return <FaHourglassHalf className="text-yellow-600" />;
      case 'pending_payment': return <FaTimesCircle className="text-red-600" />;
      default: return <FaClock className="text-gray-600" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Approved';
      case 'payment_submitted': return 'Payment Under Review';
      case 'pending_payment': return 'Payment Required';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Profile</h1>
            <p className="text-muted-foreground">Manage your account and view your enrolled courses</p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="courses">My Courses</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FaUser className="text-blue-600" />
                      Account Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <FaUser className="text-muted-foreground" />
                      <span className="font-medium">{user.username}</span>
                    </div>
                    {enrolledCourses.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <FaEnvelope className="text-muted-foreground" />
                          <span>{enrolledCourses[0].email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <FaPhone className="text-muted-foreground" />
                          <span>{enrolledCourses[0].phone}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <FaMapMarkerAlt className="text-muted-foreground" />
                          <span>{enrolledCourses[0].address}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Course Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{enrolledCourses.length}</div>
                        <div className="text-sm text-muted-foreground">Total Enrolled</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {enrolledCourses.filter(c => c.status === 'approved').length}
                        </div>
                        <div className="text-sm text-muted-foreground">Approved</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {enrolledCourses.filter(c => c.status === 'payment_submitted').length}
                        </div>
                        <div className="text-sm text-muted-foreground">Pending</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {enrolledCourses.filter(c => c.status === 'pending_payment').length}
                        </div>
                        <div className="text-sm text-muted-foreground">Payment Due</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="courses">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Enrolled Courses</h2>
                  <Button onClick={() => router.push('/training')} variant="outline">
                    Browse More Courses
                  </Button>
                </div>

                {enrolledCourses.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <h3 className="text-lg font-semibold mb-2">No Courses Enrolled</h3>
                      <p className="text-muted-foreground mb-4">Start your learning journey by enrolling in a course!</p>
                      <Button onClick={() => router.push('/training')}>
                        Explore Courses
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrolledCourses.map((course, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="h-full">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{course.courseTitle}</CardTitle>
                              {getStatusIcon(course.status)}
                            </div>
                            <CardDescription>
                              Enrolled on {new Date(course.enrolledAt).toLocaleDateString()}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <Badge className={getStatusColor(course.status)}>
                              {getStatusText(course.status)}
                            </Badge>
                            
                            <div className="text-sm space-y-1">
                              <div><strong>Name:</strong> {course.fullName}</div>
                              <div><strong>Email:</strong> {course.email}</div>
                              {course.paymentProof && (
                                <div><strong>Payment Proof:</strong> {course.paymentProof}</div>
                              )}
                            </div>

                            {course.status === 'pending_payment' && (
                              <Button 
                                size="sm" 
                                className="w-full"
                                onClick={() => router.push('/training')}
                              >
                                Complete Payment
                              </Button>
                            )}

                            {course.status === 'approved' && (
                              <Button 
                                size="sm" 
                                className="w-full bg-green-600 hover:bg-green-700"
                                onClick={() => router.push(`/course/${course.courseId}`)}
                              >
                                Access Course
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Account Security</h3>
                      <p className="text-sm text-muted-foreground">Manage your login credentials</p>
                    </div>
                    <Button variant="outline">Update Password</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Notifications</h3>
                      <p className="text-sm text-muted-foreground">Configure your notification preferences</p>
                    </div>
                    <Button variant="outline">Manage</Button>
                  </div>

                  <div className="pt-4 border-t">
                    <Button 
                      variant="destructive" 
                      onClick={() => {
                        logout();
                        router.push('/');
                      }}
                    >
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}