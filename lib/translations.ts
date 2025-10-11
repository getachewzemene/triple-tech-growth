import { Language } from "@/app/providers/LanguageProvider";

export type TranslationKey = string;

const enTranslations: Record<string, string> = {
    // Header Navigation
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.projects": "Projects",
    "nav.whyChooseUs": "Why Choose Us",
    "nav.training": "Training",
    "nav.courses": "Courses",
    "nav.team": "Team",
    "nav.contact": "Contact Us",
    "header.toggleTheme": "Toggle {mode} Mode",
    "header.light": "Light",
    "header.dark": "Dark",
    "header.profile": "Profile",
    "header.login": "Login",

    // Hero Section
    "hero.slide1.title": "Accelerating business growth with smart technologies",
    "hero.slide1.subtitle":
      "Triple Technologies fuels business growth with smart software, training, and digital marketing.",
    "hero.slide1.cta": "Contact Us",
    "hero.slide2.title": "Innovation at the heart of everything we do",
    "hero.slide2.subtitle":
      "From web development to mobile apps, we create solutions that drive success.",
    "hero.slide2.cta": "Our Services",
    "hero.slide3.title": "Expert training and consultation services",
    "hero.slide3.subtitle":
      "Upskill your team with our comprehensive IT training programs and expert consultancy.",
    "hero.slide3.cta": "Learn More",

    // Services Section
    "services.title": "Our Services",
    "services.subtitle":
      "Comprehensive technology solutions tailored to accelerate your business growth",
    "services.web.title": "Web Development",
    "services.web.description":
      "Custom web applications built with modern technologies and best practices for optimal performance.",
    "services.web.feature1": "React/Next.js",
    "services.web.feature2": "Node.js",
    "services.web.feature3": "Cloud Deployment",
    "services.web.stats": "100+ Projects",
    "services.mobile.title": "Mobile App Development",
    "services.mobile.description":
      "Native and cross-platform mobile apps that provide exceptional user experiences across all devices.",
    "services.mobile.feature1": "React Native",
    "services.mobile.feature2": "Flutter",
    "services.mobile.feature3": "iOS/Android",
    "services.mobile.stats": "50+ Apps",
    "services.marketing.title": "Digital Marketing",
    "services.marketing.description":
      "Comprehensive digital marketing strategies to boost your online presence and drive business growth.",
    "services.marketing.feature1": "SEO",
    "services.marketing.feature2": "Social Media",
    "services.marketing.feature3": "Content Marketing",
    "services.marketing.stats": "200% Growth",
    "services.training.title": "IT Training and Consultancy",
    "services.training.description":
      "Expert training and consultancy services to upskill your team and optimize your technology stack.",
    "services.training.feature1": "Technical Training",
    "services.training.feature2": "Code Review",
    "services.training.feature3": "Architecture Design",
    "services.training.stats": "500+ Students",
    "services.learnMore": "Learn More",
    "services.viewDetails": "View Details",

    // Projects Section
    "projects.title": "Featured Projects",
    "projects.subtitle":
      "Showcasing our commitment to excellence through innovative solutions",
    "projects.viewDetails": "View Details",

    // Why Choose Us Section
    "whyChooseUs.title": "Why Choose Us",
    "whyChooseUs.subtitle":
      "We deliver excellence through innovation, dedication, and proven expertise",

    // Training Section
    "training.title": "Training Programs",
    "training.subtitle":
      "Comprehensive training programs designed to accelerate your career growth and technical expertise",
    "training.viewCourse": "View Course",
    "training.enrollNow": "Enroll Now",

    // Team Section
    "team.title": "Meet Our Team",
    "team.subtitle":
      "Passionate professionals dedicated to delivering exceptional results",

    // Footer
    "footer.companyInfo":
      "Accelerating business growth with smart technologies and impactful innovation.",
    "footer.quickLinks": "Quick Links",
    "footer.services": "Our Services",
    "footer.contact": "Get in Touch",
    "footer.name": "Name",
    "footer.email": "Email",
    "footer.message": "Message",
    "footer.sendMessage": "Send Message",
    "footer.rights": "All rights reserved.",
    "footer.privacyPolicy": "Privacy Policy",
    "footer.termsOfService": "Terms of Service",
    "footer.cookiePolicy": "Cookie Policy",
    "footer.webDev": "Web Development",
    "footer.mobileDev": "Mobile App Development",
    "footer.digitalMarketing": "Digital Marketing",
    "footer.itTraining": "IT Training",

    // Training Page
    "training.page.title": "Training Programs",
    "training.page.subtitle":
      "Accelerate your career with industry-leading courses",
    "training.page.description": "Description",
    "training.page.duration": "Duration",
    "training.page.level": "Level",
    "training.page.price": "Price",
    "training.page.instructor": "Instructor",
    "training.page.benefits": "What You'll Learn",
    "training.page.prerequisites": "Prerequisites",
    "training.page.topics": "topics",
    "training.page.selectCourse": "Select a course to view details",
    "training.page.enrollment": "Course Enrollment",
    "training.page.enrollmentDesc":
      "Please fill in your details to enroll in this course",
    "training.page.fullName": "Full Name",
    "training.page.phone": "Phone Number",
    "training.page.age": "Age",
    "training.page.address": "Address",
    "training.page.cancel": "Cancel",
    "training.page.continue": "Continue to Payment",
    "training.page.payment": "Payment Information",
    "training.page.paymentDesc": "Complete your enrollment by submitting payment proof",
    "training.page.accountInfo": "Bank Account Information:",
    "training.page.accountNumber": "Account Number",
    "training.page.accountName": "Account Name",
    "training.page.bank": "Bank",
    "training.page.uploadProof": "Upload Payment Proof",
    "training.page.submitEnrollment": "Submit Enrollment",
    "training.page.loginRequired": "Please log in to enroll in courses",
    "training.page.loginButton": "Login / Sign Up",

    // Profile Page
    "profile.title": "My Profile",
    "profile.subtitle": "Manage your account and view your enrolled courses",
    "profile.personalInfo": "Personal Information",
    "profile.enrolledCourses": "Enrolled Courses",
    "profile.noEnrollments": "No course enrollments yet",
    "profile.startLearning": "Start your learning journey by enrolling in a course!",
    "profile.browseCourses": "Browse Courses",
    "profile.courseName": "Course Name",
    "profile.enrollmentDate": "Enrollment Date",
    "profile.status": "Status",
    "profile.viewCourse": "View Course",
    "profile.approved": "Approved",
    "profile.paymentUnderReview": "Payment Under Review",
    "profile.paymentRequired": "Payment Required",
    "profile.unknown": "Unknown",
    "profile.loginRequired": "Please Log In",
    "profile.loginMessage": "You need to be logged in to view your profile.",
    "profile.signIn": "Sign In / Sign Up",
    "profile.updateProfile": "Update Profile",

    // Courses Page
    "courses.title": "Available Courses",
    "courses.subtitle": "Choose from our comprehensive selection of courses",
    "courses.all": "All Courses",
    "courses.enrolled": "My Enrolled Courses",
    "courses.available": "Available Courses",
    "courses.duration": "Duration",
    "courses.level": "Level",
    "courses.students": "Students",
    "courses.enroll": "Enroll Now",
    "courses.viewDetails": "View Details",
    "courses.continueWatching": "Continue Watching",
    "courses.startCourse": "Start Course",

    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.close": "Close",
    "common.save": "Save",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.confirm": "Confirm",
    "common.cancel": "Cancel",
    "common.back": "Back",
    "common.next": "Next",
    "common.previous": "Previous",
    "common.submit": "Submit",
    "common.search": "Search",
};

const amTranslations: Record<string, string> = {
    // Header Navigation
    "nav.home": "መነሻ",
    "nav.services": "አገልግሎቶች",
    "nav.projects": "ፕሮጀክቶች",
    "nav.whyChooseUs": "ለምን እኛን ይምረጡ",
    "nav.training": "ስልጠና",
    "nav.courses": "ኮርሶች",
    "nav.team": "ቡድናችን",
    "nav.contact": "ያግኙን",
    "header.toggleTheme": "{mode} ገጽታ ቀይር",
    "header.light": "ብርሃን",
    "header.dark": "ጨለማ",
    "header.profile": "መገለጫ",
    "header.login": "ግባ",

    // Hero Section
    "hero.slide1.title": "ንግድዎን በዘመናዊ ቴክኖሎጂዎች ማሳደግ",
    "hero.slide1.subtitle":
      "ትሪፕል ቴክኖሎጂስ ንግድዎን በዘመናዊ ሶፍትዌር፣ ስልጠና እና ዲጂታል ማርኬቲንግ ያሳድጋል።",
    "hero.slide1.cta": "ያግኙን",
    "hero.slide2.title": "ፈጠራ በምናደርገው ሁሉ መሃል ላይ",
    "hero.slide2.subtitle":
      "ከድረገጽ ልማት እስከ ሞባይል አፕሊኬሽን፣ ስኬትን የሚያመጡ መፍትሄዎችን እንፈጥራለን።",
    "hero.slide2.cta": "አገልግሎቶቻችን",
    "hero.slide3.title": "ባለሙያ ስልጠና እና የምክር አገልግሎቶች",
    "hero.slide3.subtitle":
      "ቡድንዎን በአጠቃላይ የአይቲ ስልጠና ፕሮግራሞቻችን እና በባለሙያ ምክር ያሳድጉ።",
    "hero.slide3.cta": "ተጨማሪ እወቅ",

    // Services Section
    "services.title": "አገልግሎቶቻችን",
    "services.subtitle":
      "የንግድ ስራዎን እድገት ለማፋጠን የተበጁ አጠቃላይ የቴክኖሎጂ መፍትሄዎች",
    "services.web.title": "ድረገጽ ልማት",
    "services.web.description":
      "ለተሻለ አፈጻጸም በዘመናዊ ቴክኖሎጂዎች እና ምርጥ ልምዶች የተገነቡ ብጁ ድረገጽ መተግበሪያዎች።",
    "services.web.feature1": "React/Next.js",
    "services.web.feature2": "Node.js",
    "services.web.feature3": "ክላውድ ማሰማራት",
    "services.web.stats": "100+ ፕሮጀክቶች",
    "services.mobile.title": "ሞባይል አፕሊኬሽን ልማት",
    "services.mobile.description":
      "በሁሉም መሣሪያዎች ላይ ልዩ የተጠቃሚ ልምዶችን የሚሰጡ የተፈጥሮ እና ብዙ-መድረክ ሞባይል መተግበሪያዎች።",
    "services.mobile.feature1": "React Native",
    "services.mobile.feature2": "Flutter",
    "services.mobile.feature3": "iOS/Android",
    "services.mobile.stats": "50+ አፕሊኬሽኖች",
    "services.marketing.title": "ዲጂታል ማርኬቲንግ",
    "services.marketing.description":
      "የመስመር ላይ መገኘትዎን ለማሳደግ እና የንግድ እድገትን ለማምጣት አጠቃላይ የዲጂታል ማርኬቲንግ ስልቶች።",
    "services.marketing.feature1": "SEO",
    "services.marketing.feature2": "ማህበራዊ ሚዲያ",
    "services.marketing.feature3": "የይዘት ማርኬቲንግ",
    "services.marketing.stats": "200% እድገት",
    "services.training.title": "የአይቲ ስልጠና እና ምክር",
    "services.training.description":
      "ቡድንዎን ለማሳደግ እና የቴክኖሎጂ ስብስብዎን ለማመቻቸት የባለሙያ ስልጠና እና የምክር አገልግሎቶች።",
    "services.training.feature1": "ቴክኒካል ስልጠና",
    "services.training.feature2": "ኮድ ግምገማ",
    "services.training.feature3": "የስርዓት ዲዛይን",
    "services.training.stats": "500+ ተማሪዎች",
    "services.learnMore": "ተጨማሪ እወቅ",
    "services.viewDetails": "ዝርዝሮችን ይመልከቁ",

    // Projects Section
    "projects.title": "የተለያዩ ፕሮጀክቶች",
    "projects.subtitle":
      "በፈጠራ መፍትሄዎች የምንሰጠውን የልህቀት ቁርጠኝነት ማሳየት",
    "projects.viewDetails": "ዝርዝሮችን ይመልከቁ",

    // Why Choose Us Section
    "whyChooseUs.title": "ለምን እኛን ይምረጡ",
    "whyChooseUs.subtitle":
      "በፈጠራ፣ በቁርጠኝነት እና በተረጋገጠ እውቀት ላይ በመመርኮዝ ልህቀትን እናቀርባለን",

    // Training Section
    "training.title": "የስልጠና ፕሮግራሞች",
    "training.subtitle":
      "የስራ ዕድገትዎን እና ቴክኒካል እውቀትዎን ለማፋጠን የተነደፉ አጠቃላይ የስልጠና ፕሮግራሞች",
    "training.viewCourse": "ኮርስ ይመልከቱ",
    "training.enrollNow": "አሁን ይመዝገቡ",

    // Team Section
    "team.title": "ቡድናችንን ይወቁ",
    "team.subtitle":
      "ልዩ ውጤቶችን ለማቅረብ የተወሰኑ ተመርቀው ባለሙያዎች",

    // Footer
    "footer.companyInfo":
      "የንግድ እድገትን በዘመናዊ ቴክኖሎጂዎች እና ተፅዕኖ ባለው ፈጠራ ማፋጠን።",
    "footer.quickLinks": "አጭር አገናኞች",
    "footer.services": "አገልግሎቶቻችን",
    "footer.contact": "ያግኙን",
    "footer.name": "ስም",
    "footer.email": "ኢሜይል",
    "footer.message": "መልዕክት",
    "footer.sendMessage": "መልዕክት ላክ",
    "footer.rights": "መብቶች የተጠበቁ ናቸው።",
    "footer.privacyPolicy": "የግላዊነት ፖሊሲ",
    "footer.termsOfService": "የአገልግሎት ውሎች",
    "footer.cookiePolicy": "የኩኪ ፖሊሲ",
    "footer.webDev": "ድረገጽ ልማት",
    "footer.mobileDev": "ሞባይል አፕሊኬሽን ልማት",
    "footer.digitalMarketing": "ዲጂታል ማርኬቲንግ",
    "footer.itTraining": "የአይቲ ስልጠና",

    // Training Page
    "training.page.title": "የስልጠና ፕሮግራሞች",
    "training.page.subtitle":
      "በኢንዱስትሪ መሪ ኮርሶች የእርስዎን ሙያ ያሳድጉ",
    "training.page.description": "መግለጫ",
    "training.page.duration": "ጊዜ",
    "training.page.level": "ደረጃ",
    "training.page.price": "ዋጋ",
    "training.page.instructor": "አስተማሪ",
    "training.page.benefits": "ምን ይማራሉ",
    "training.page.prerequisites": "ቅድመ ሁኔታዎች",
    "training.page.topics": "ርዕሶች",
    "training.page.selectCourse": "ዝርዝሮችን ለማየት ኮርስ ይምረጡ",
    "training.page.enrollment": "የኮርስ ምዝገባ",
    "training.page.enrollmentDesc":
      "እባክዎ በዚህ ኮርስ ለመመዝገብ ዝርዝሮችዎን ይሙሉ",
    "training.page.fullName": "ሙሉ ስም",
    "training.page.phone": "ስልክ ቁጥር",
    "training.page.age": "ዕድሜ",
    "training.page.address": "አድራሻ",
    "training.page.cancel": "ሰርዝ",
    "training.page.continue": "ወደ ክፍያ ቀጥል",
    "training.page.payment": "የክፍያ መረጃ",
    "training.page.paymentDesc": "የክፍያ ማረጋገጫ በማስገባት ምዝገባዎን ያጠናቅቁ",
    "training.page.accountInfo": "የባንክ ሂሳብ መረጃ፡",
    "training.page.accountNumber": "የሂሳብ ቁጥር",
    "training.page.accountName": "የሂሳብ ስም",
    "training.page.bank": "ባንክ",
    "training.page.uploadProof": "የክፍያ ማረጋገጫ ይስቀሉ",
    "training.page.submitEnrollment": "ምዝገባ አስገባ",
    "training.page.loginRequired": "እባክዎ በኮርሶች ለመመዝገብ ይግቡ",
    "training.page.loginButton": "ግባ / ተመዝገብ",

    // Profile Page
    "profile.title": "የእኔ መገለጫ",
    "profile.subtitle": "መለያዎን ያስተዳድሩ እና የተመዘገቡዎ ኮርሶች ይመልከቱ",
    "profile.personalInfo": "የግል መረጃ",
    "profile.enrolledCourses": "የተመዘገቡ ኮርሶች",
    "profile.noEnrollments": "እስካሁን ምንም የኮርስ ምዝገባዎች የሉም",
    "profile.startLearning": "በኮርስ በመመዝገብ የመማሪያ ጉዞዎን ይጀምሩ!",
    "profile.browseCourses": "ኮርሶችን አስስ",
    "profile.courseName": "የኮርስ ስም",
    "profile.enrollmentDate": "የምዝገባ ቀን",
    "profile.status": "ሁኔታ",
    "profile.viewCourse": "ኮርስ ይመልከቱ",
    "profile.approved": "ፀድቋል",
    "profile.paymentUnderReview": "ክፍያ በግምገማ ላይ",
    "profile.paymentRequired": "ክፍያ ያስፈልጋል",
    "profile.unknown": "የማይታወቅ",
    "profile.loginRequired": "እባክዎ ይግቡ",
    "profile.loginMessage": "መገለጫዎን ለማየት መግባት አለብዎ።",
    "profile.signIn": "ግባ / ተመዝገብ",
    "profile.updateProfile": "መገለጫ ያዘምኑ",

    // Courses Page
    "courses.title": "የሚገኙ ኮርሶች",
    "courses.subtitle": "ከአጠቃላይ የኮርስ ምርጫችን ይምረጡ",
    "courses.all": "ሁሉም ኮርሶች",
    "courses.enrolled": "የተመዘገብኩባቸው ኮርሶች",
    "courses.available": "የሚገኙ ኮርሶች",
    "courses.duration": "ጊዜ",
    "courses.level": "ደረጃ",
    "courses.students": "ተማሪዎች",
    "courses.enroll": "አሁን ተመዝገብ",
    "courses.viewDetails": "ዝርዝሮችን ይመልከቁ",
    "courses.continueWatching": "መመልከት ቀጥል",
    "courses.startCourse": "ኮርስ ጀምር",

    // Common
    "common.loading": "በመጫን ላይ...",
    "common.error": "ስህተት",
    "common.success": "ተሳክቷል",
    "common.close": "ዝጋ",
    "common.save": "አስቀምጥ",
    "common.edit": "አርትዕ",
    "common.delete": "ሰርዝ",
    "common.confirm": "አረጋግጥ",
    "common.cancel": "ሰርዝ",
    "common.back": "ተመለስ",
    "common.next": "ቀጣይ",
    "common.previous": "ቀዳሚ",
    "common.submit": "አስገባ",
    "common.search": "ፈልግ",
  };

export const translations: Record<Language, Record<string, string>> = {
  en: enTranslations,
  am: amTranslations,
  or: enTranslations, // Using English for Oromiffa as it's not in the current requirement
};

export function translate(key: string, language: Language = "en"): string {
  return translations[language]?.[key] || translations.en[key] || key;
}

export function t(key: string, language: Language = "en", replacements?: Record<string, string>): string {
  let translated = translate(key, language);
  
  if (replacements) {
    Object.keys(replacements).forEach((replaceKey) => {
      translated = translated.replace(`{${replaceKey}}`, replacements[replaceKey]);
    });
  }
  
  return translated;
}
