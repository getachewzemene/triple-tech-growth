import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaVideo, FaChartLine, FaCode, FaMobileAlt, FaPaintBrush, FaRobot } from "react-icons/fa";
import Header from "@/components/Header";

import { Button } from "@/components/ui/button";
import Footer from "./../components/Footer";

const courses = [
  {
    id: 1,
    title: "Video Editing",
    description: "Master video editing techniques.",
    icon: <FaVideo size={24} />,
  },
  {
    id: 2,
    title: "Digital Marketing",
    description: "Learn SEO and social media marketing.",
    icon: <FaChartLine size={24} />,
  },
  {
    id: 3,
    title: "Web Development",
    description: "Build modern websites with React.",
    icon: <FaCode size={24} />,
  },
  {
    id: 4,
    title: "Mobile App Development",
    description: "Create apps for iOS and Android.",
    icon: <FaMobileAlt size={24} />,
  },
  {
    id: 5,
    title: "Graphic Design",
    description: "Create stunning visuals with design tools.",
    icon: <FaPaintBrush size={24} />,
  },
  {
    id: 6,
    title: "AI Automation",
    description: "Get started with artificial intelligence.",
    icon: <FaRobot size={24} />,
  },
];

const courseContents = {
  "Video Editing": [
    { title: "Basics of Video Cutting", type: "video", src: "https://www.youtube.com/embed/F1sKwFHM8q4" },
    { title: "Exporting Projects", type: "pdf", src: "/pdfs/exporting.pdf" },
  ],
  "Digital Marketing": [
    { title: "Introduction to SEO", type: "pdf", src: "/pdfs/seo-guide.pdf" },
    { title: "Social Media Strategies", type: "video", src: "https://www.youtube.com/embed/ysz5S6PUM-U" },
  ],
  "Web Development": [
    { title: "React Basics", type: "video", src: "https://www.youtube.com/embed/bMknfKXIFA8" },
    { title: "Responsive Layouts", type: "pdf", src: "/pdfs/responsive.pdf" },
  ],
  "Mobile App Development": [
    { title: "Getting Started with React Native", type: "video", src: "https://www.youtube.com/embed/0-S5a0eXPoc" },
    { title: "Building Your First App", type: "pdf", src: "/pdfs/first-app.pdf" },
  ],
  "Graphic Design": [
    { title: "Design Principles", type: "video", src: "https://www.youtube.com/embed/1a8d2b3c4e5" },
    { title: "Using Adobe Photoshop", type: "pdf", src: "/pdfs/photoshop-guide.pdf" },
  ],
  "AI Automation": [
    { title: "Introduction to AI", type: "video", src: "https://www.youtube.com/embed/2e8d3f4g5h6" },
    { title: "Building AI Models", type: "pdf", src: "/pdfs/ai-models.pdf" },
  ]
};

const Training = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  return (
    <div className="min-h-screen bg-background mt-6">
      <Header />
      <div className="px-4 py-16 md:px-8 lg:px-16">
        <motion.h2
          className="section-title text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {selectedCourse ? `${selectedCourse.title} Module` : "Training Modules"}
        </motion.h2>
         
        {!selectedCourse ? (
          <div className="flex flex-wrap gap-8 justify-center mt-12">
            {courses.map((course) => (
              <motion.div
                key={course.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCourse(course)}
                className="w-80 p-6 service-card rounded-2xl shadow-elegant cursor-pointer transition-all duration-300 hover:bg-primary hover:text-primary-foreground group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-blue-600 group-hover:text-yellow transition-colors duration-300">
                    {course.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-center flex-1">{course.title}</h3>
                </div>
                <p className="card-description group-hover:text-primary-foreground/90 transition-colors duration-300 text-center">
                  {course.description}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <AnimatePresence>
            <div className="flex flex-col lg:flex-row h-[75vh] mt-10 gap-6">
              <div className="w-full lg:w-[35%] bg-card p-6 overflow-y-auto rounded-2xl shadow-elegant">
                <h3 className="text-2xl font-bold text-foreground mb-6">Contents</h3>
                {courseContents[selectedCourse.title]?.map((item, index) => (
                  <div
                    key={index}
                    className={`my-3 font-medium cursor-pointer p-3 rounded-lg transition-all duration-200 ${
                      selectedTopic?.title === item.title
                        ? 'text-primary border-l-2 border-yellow bg-primary/10'
                        : 'text-foreground hover:bg-primary/10 hover:text-yellow hover:border-l-2 hover:border-yellow'
                    }`}
                    onClick={() => setSelectedTopic(item)}
                  >
                    {item.title}
                  </div>
                ))}
                <Button 
                  className="mx-12 mt-6 bg-primary text-primary-foreground hover:bg-yellow hover:text-primary-foreground"
                  onClick={() => {
                    setSelectedCourse(null);
                    setSelectedTopic(null);
                  }}
                >
                  Back to Courses
                </Button>
              </div>

              <div className="flex-1 bg-card p-6 rounded-2xl shadow-elegant flex items-center justify-center">
                <div className="h-full w-full">
                  {selectedTopic ? (
                    selectedTopic.type === "video" ? (
                      <iframe
                        src={selectedTopic.src}
                        title={selectedTopic.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-none rounded-xl"
                      />
                    ) : (
                      <iframe 
                        src={selectedTopic.src} 
                        title={selectedTopic.title}
                        className="w-full h-full border-none rounded-xl"
                      />
                    )
                  ) : (
                    <p className="text-muted-foreground text-center text-lg">
                      Select a topic to view its content
                    </p>
                  )}
                </div>
              </div>
            </div>
          </AnimatePresence>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Training;