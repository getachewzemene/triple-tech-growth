# Ethiopian Online Education Platform - Feature Requirements

This document outlines the additional features required to transform the Triple Technologies training system into a comprehensive online-based Ethiopian education platform.

## Overview

The platform enables **Instructors** to create and manage courses, while **Students** enroll, learn, and interact through discussion groups and chat functionality.

---

## 1. User Role System

### Current Roles
- `STUDENT` - Can enroll in courses and access content
- `ADMIN` - Full platform management

### New Roles to Add
- `INSTRUCTOR` - Can create and manage their own courses, view enrolled students

### Role Capabilities

| Feature | Student | Instructor | Admin |
|---------|---------|------------|-------|
| View courses | ✅ | ✅ | ✅ |
| Enroll in courses | ✅ | ✅ | ✅ |
| Create courses | ❌ | ✅ | ✅ |
| Manage own courses | ❌ | ✅ | ✅ |
| View course analytics | ❌ | Own courses | All |
| Participate in discussions | ✅ | ✅ | ✅ |
| Moderate discussions | ❌ | Own courses | ✅ |
| Send/receive messages | ✅ | ✅ | ✅ |
| Platform administration | ❌ | ❌ | ✅ |

---

## 2. Instructor Features

### 2.1 Instructor Registration & Profile
- Apply to become an instructor
- Submit credentials/qualifications
- Admin approval workflow
- Public instructor profile page
  - Bio, expertise areas
  - Profile photo
  - Social links
  - Course ratings and reviews

### 2.2 Course Creation Dashboard
- Course builder with:
  - Title, description, category
  - Thumbnail/cover image upload
  - Pricing (ETB and USD)
  - Course curriculum builder
    - Sections/Modules
    - Lessons (Video, PDF, Quiz, Assignment)
    - Drag-and-drop reordering
  - Preview mode before publishing
- Course settings:
  - Enrollment type (Open, Approval required, Invite only)
  - Certificate on completion
  - Discussion forum enable/disable
  - Course visibility (Draft, Published, Unlisted)

### 2.3 Student Management
- View enrolled students
- Track student progress
- Issue certificates
- Send announcements to enrolled students
- Revenue and analytics dashboard

---

## 3. Enhanced Student Features

### 3.1 Learning Experience
- Course progress tracking
- Resume where left off
- Note-taking feature
- Bookmark lessons
- Download materials (if allowed)
- Course completion certificate

### 3.2 Student Dashboard Enhancements
- Learning streak tracking
- Study time analytics
- Recommended courses
- Achievement badges

---

## 4. Discussion Groups/Forums

### 4.1 Course Discussions
- Each course has a discussion forum
- Threaded conversations
- Categories/topics within course
- Rich text editor with:
  - Code snippets
  - Image uploads
  - File attachments
  - Markdown support

### 4.2 Discussion Features
- Post questions/discussions
- Reply to posts
- Upvote/downvote answers
- Mark answer as "Best Answer"
- Pin important posts
- Search within discussions
- Follow/unfollow threads
- Email notifications for replies

### 4.3 Moderation
- Instructors moderate their course forums
- Report inappropriate content
- Admin can moderate all forums
- Automatic spam detection

---

## 5. Chat & Messaging System

### 5.1 Direct Messaging
- Student to Instructor messaging
- Student to Student messaging (optional, can be disabled)
- Message inbox with conversations
- Read/unread status
- Message notifications

### 5.2 Group Chat
- Course-based group chat
- Study group creation
- Real-time messaging (WebSocket/Server-Sent Events)
- Message history

### 5.3 Live Chat Features
- Online/offline status
- Typing indicators
- File/image sharing
- Emoji support
- Message search

---

## 6. Ethiopian-Specific Features

### 6.1 Language Support
- Amharic (አማርኛ) interface option
- Oromiffa interface option
- Content in local languages
- RTL support for Amharic text

### 6.2 Payment Integration
- **Local Payment Methods**:
  - Telebirr
  - CBE Birr
  - Awash Bank
  - Commercial Bank of Ethiopia (CBE)
  - Dashen Bank
  - HelloCash
  - M-Birr
- Manual payment proof upload (existing)
- ETB currency support (existing)
- Payment receipt generation

### 6.3 Local Content
- Ethiopian academic calendar support
- Ethiopian holidays awareness
- Local case studies and examples
- Ethiopian instructor verification

### 6.4 Accessibility
- Low bandwidth mode
- Offline content download
- Mobile-first design
- SMS notifications (optional)

---

## 7. Additional Platform Features

### 7.1 Course Marketplace
- Course discovery/search
- Category filtering
- Rating and reviews
- Featured courses
- Bestseller badges
- Course recommendations

### 7.2 Certificates & Credentials
- Auto-generated certificates
- Verifiable certificate links
- LinkedIn integration
- Certificate templates

### 7.3 Notifications System
- In-app notifications
- Email notifications
- Push notifications (web)
- SMS notifications (optional)
- Notification preferences

### 7.4 Analytics & Reporting
- Student learning analytics
- Instructor revenue reports
- Platform usage statistics
- Course performance metrics

### 7.5 Live Sessions (Future)
- Scheduled live classes
- Video conferencing integration
- Screen sharing
- Recording and playback
- Attendance tracking

---

## 8. Database Schema Changes

### New Models Required

```prisma
// Add to UserRole enum
enum UserRole {
  STUDENT
  INSTRUCTOR
  ADMIN
}

// Instructor Profile
model InstructorProfile {
  id                String   @id @default(cuid())
  userId            String   @unique
  bio               String?
  expertise         String[]
  profileImage      String?
  socialLinks       Json?
  isApproved        Boolean  @default(false)
  approvedAt        DateTime?
  totalStudents     Int      @default(0)
  totalCourses      Int      @default(0)
  averageRating     Float    @default(0)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("instructor_profiles")
}

// Discussion Forum
model Discussion {
  id          String   @id @default(cuid())
  courseId    String
  authorId    String
  title       String
  content     String
  isPinned    Boolean  @default(false)
  isLocked    Boolean  @default(false)
  upvotes     Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  course      Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  author      User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  replies     DiscussionReply[]
  
  @@map("discussions")
}

model DiscussionReply {
  id            String   @id @default(cuid())
  discussionId  String
  authorId      String
  content       String
  isBestAnswer  Boolean  @default(false)
  upvotes       Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  discussion    Discussion @relation(fields: [discussionId], references: [id], onDelete: Cascade)
  author        User       @relation(fields: [authorId], references: [id], onDelete: Cascade)
  
  @@map("discussion_replies")
}

// Messaging System
model Conversation {
  id            String    @id @default(cuid())
  type          String    // "direct" or "group"
  name          String?   // For group chats
  courseId      String?   // For course-based groups
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  course        Course?   @relation(fields: [courseId], references: [id], onDelete: SetNull)
  participants  ConversationParticipant[]
  messages      Message[]
  
  @@map("conversations")
}

model ConversationParticipant {
  id              String   @id @default(cuid())
  conversationId  String
  userId          String
  role            String   @default("member") // "admin", "member"
  lastReadAt      DateTime?
  joinedAt        DateTime @default(now())
  
  conversation    Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  user            User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([conversationId, userId])
  @@map("conversation_participants")
}

model Message {
  id              String   @id @default(cuid())
  conversationId  String
  senderId        String
  content         String
  attachments     Json?
  isRead          Boolean  @default(false)
  createdAt       DateTime @default(now())
  
  conversation    Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  sender          User         @relation(fields: [senderId], references: [id], onDelete: Cascade)
  
  @@map("messages")
}

// Course Reviews
model CourseReview {
  id        String   @id @default(cuid())
  courseId  String
  userId    String
  rating    Int      // 1-5
  review    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  course    Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([courseId, userId])
  @@map("course_reviews")
}

// Certificates
model Certificate {
  id              String   @id @default(cuid())
  uniqueId        String   @unique
  userId          String
  courseId        String
  issuedAt        DateTime @default(now())
  grade           String?
  completionScore Float?
  
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  course          Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  
  @@map("certificates")
}

// Notifications
model Notification {
  id        String   @id @default(cuid())
  userId    String
  type      String   // "enrollment", "message", "discussion", "announcement"
  title     String
  content   String
  link      String?
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("notifications")
}
```

---

## 9. API Endpoints Required

### Instructor APIs
- `POST /api/instructor/apply` - Apply to become instructor
- `GET /api/instructor/profile` - Get instructor profile
- `PUT /api/instructor/profile` - Update instructor profile
- `GET /api/instructor/courses` - List instructor's courses
- `GET /api/instructor/analytics` - Get instructor analytics
- `GET /api/instructor/students` - List enrolled students

### Discussion APIs
- `GET /api/courses/[courseId]/discussions` - List discussions
- `POST /api/courses/[courseId]/discussions` - Create discussion
- `GET /api/discussions/[id]` - Get discussion with replies
- `POST /api/discussions/[id]/reply` - Reply to discussion
- `POST /api/discussions/[id]/upvote` - Upvote discussion
- `PUT /api/discussions/[id]` - Edit discussion (author only)
- `DELETE /api/discussions/[id]` - Delete discussion

### Chat/Messaging APIs
- `GET /api/conversations` - List user's conversations
- `POST /api/conversations` - Create new conversation
- `GET /api/conversations/[id]/messages` - Get messages
- `POST /api/conversations/[id]/messages` - Send message
- `PUT /api/conversations/[id]/read` - Mark as read
- `WebSocket /api/ws/chat` - Real-time chat connection

### Notification APIs
- `GET /api/notifications` - List user notifications
- `PUT /api/notifications/[id]/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read

---

## 10. UI Components Required

### New Pages
- `/instructor/dashboard` - Instructor dashboard
- `/instructor/courses/new` - Course creation wizard
- `/instructor/courses/[id]/edit` - Course editor
- `/instructor/courses/[id]/students` - Student management
- `/course/[id]/discussions` - Course forum
- `/messages` - Messaging center
- `/notifications` - Notifications page

### New Components
- `InstructorSidebar` - Navigation for instructors
- `CourseBuilder` - Course creation wizard
- `LessonEditor` - Rich content editor
- `DiscussionForum` - Forum component
- `DiscussionThread` - Thread view
- `ChatWindow` - Chat interface
- `ConversationList` - Conversation list
- `NotificationBell` - Notification dropdown
- `CertificateViewer` - Certificate display

---

## 11. Implementation Priority

### Phase 1 (MVP)
1. Instructor role and basic profile
2. Instructor course creation (basic)
3. Course discussions/forum
4. Direct messaging

### Phase 2
1. Advanced course builder
2. Group chat
3. Notifications system
4. Course reviews

### Phase 3
1. Certificates
2. Analytics dashboard
3. Live sessions
4. Mobile app

---

## 12. Ethiopian Education Context

### Academic Considerations
- Ethiopian academic year (September - July)
- Grade level categorization
- Ministry of Education alignment (optional)
- TVET certification programs

### Cultural Considerations
- Respectful communication guidelines
- Community learning emphasis
- Collaborative features
- Mentorship programs

---

## Summary

This feature set will transform the Triple Technologies platform into a comprehensive Ethiopian online education marketplace, enabling:

1. **Instructors** to monetize their expertise
2. **Students** to access quality education
3. **Community** building through discussions and chat
4. **Ethiopian context** with local payments and languages

The modular architecture allows for phased implementation, starting with core features and expanding based on user feedback.
