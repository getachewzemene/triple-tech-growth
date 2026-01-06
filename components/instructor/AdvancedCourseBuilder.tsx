"use client";

import React, { useState } from "react";
import { motion, Reorder } from "framer-motion";
import {
  FaGripVertical,
  FaVideo,
  FaFileAlt,
  FaQuestionCircle,
  FaTasks,
  FaPlus,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
  FaEye,
  FaChevronDown,
  FaChevronRight,
  FaClock,
  FaLock,
  FaUnlock,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type ContentType = "VIDEO" | "PDF" | "QUIZ" | "ASSIGNMENT";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  contentType: ContentType;
  duration?: number; // in minutes
  isFree: boolean;
  order: number;
  s3Key?: string;
  videoUrl?: string;
  content?: string;
  quizQuestions?: QuizQuestion[];
}

interface Section {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  order: number;
}

interface AdvancedCourseBuilderProps {
  courseId: string;
  courseName: string;
  initialSections?: Section[];
  onSave?: (sections: Section[]) => void;
  onPublish?: () => void;
}

const contentTypeIcons: Record<ContentType, React.ReactNode> = {
  VIDEO: <FaVideo className="text-blue-500" />,
  PDF: <FaFileAlt className="text-red-500" />,
  QUIZ: <FaQuestionCircle className="text-purple-500" />,
  ASSIGNMENT: <FaTasks className="text-green-500" />,
};

const contentTypeLabels: Record<ContentType, string> = {
  VIDEO: "Video",
  PDF: "Document",
  QUIZ: "Quiz",
  ASSIGNMENT: "Assignment",
};

// Quiz Builder Component
function QuizBuilder({
  questions,
  onChange,
}: {
  questions: QuizQuestion[];
  onChange: (questions: QuizQuestion[]) => void;
}) {
  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: `q_${Date.now()}`,
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    };
    onChange([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, updates: Partial<QuizQuestion>) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const deleteQuestion = (index: number) => {
    onChange(questions.filter((_, i) => i !== index));
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex] = value;
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Quiz Questions</Label>
        <Button variant="outline" size="sm" onClick={addQuestion}>
          <FaPlus className="mr-2" />
          Add Question
        </Button>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
          <FaQuestionCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No questions yet. Add your first question!</p>
        </div>
      ) : (
        <Accordion type="single" collapsible className="space-y-2">
          {questions.map((q, qIndex) => (
            <AccordionItem
              key={q.id}
              value={q.id}
              className="border rounded-lg"
            >
              <AccordionTrigger className="px-4 py-2 hover:no-underline">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    Question {qIndex + 1}:
                  </span>
                  <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                    {q.question || "Untitled Question"}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`question-${qIndex}`}>Question</Label>
                    <Input
                      id={`question-${qIndex}`}
                      value={q.question}
                      onChange={(e) =>
                        updateQuestion(qIndex, { question: e.target.value })
                      }
                      placeholder="Enter your question"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Options (select the correct answer)</Label>
                    {q.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${qIndex}`}
                          checked={q.correctAnswer === oIndex}
                          onChange={() =>
                            updateQuestion(qIndex, { correctAnswer: oIndex })
                          }
                          className="w-4 h-4"
                        />
                        <Input
                          value={option}
                          onChange={(e) =>
                            updateOption(qIndex, oIndex, e.target.value)
                          }
                          placeholder={`Option ${oIndex + 1}`}
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteQuestion(qIndex)}
                  >
                    <FaTrash className="mr-2" />
                    Delete Question
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}

// Lesson Editor Component
function LessonEditor({
  lesson,
  onSave,
  onCancel,
}: {
  lesson: Lesson | null;
  onSave: (lesson: Lesson) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Lesson>(
    lesson || {
      id: `lesson_${Date.now()}`,
      title: "",
      description: "",
      contentType: "VIDEO",
      duration: 0,
      isFree: false,
      order: 0,
      quizQuestions: [],
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="title">Lesson Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Enter lesson title"
            required
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Describe what students will learn"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="contentType">Content Type</Label>
          <Select
            value={formData.contentType}
            onValueChange={(value: ContentType) =>
              setFormData((prev) => ({ ...prev, contentType: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="VIDEO">
                <div className="flex items-center gap-2">
                  <FaVideo className="text-blue-500" />
                  Video
                </div>
              </SelectItem>
              <SelectItem value="PDF">
                <div className="flex items-center gap-2">
                  <FaFileAlt className="text-red-500" />
                  Document
                </div>
              </SelectItem>
              <SelectItem value="QUIZ">
                <div className="flex items-center gap-2">
                  <FaQuestionCircle className="text-purple-500" />
                  Quiz
                </div>
              </SelectItem>
              <SelectItem value="ASSIGNMENT">
                <div className="flex items-center gap-2">
                  <FaTasks className="text-green-500" />
                  Assignment
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            min="0"
            value={formData.duration || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                duration: parseInt(e.target.value) || 0,
              }))
            }
            placeholder="e.g., 15"
          />
        </div>

        <div className="col-span-2 flex items-center justify-between py-2">
          <div>
            <Label htmlFor="isFree" className="text-base">
              Free Preview
            </Label>
            <p className="text-sm text-muted-foreground">
              Make this lesson available for free preview
            </p>
          </div>
          <Switch
            id="isFree"
            checked={formData.isFree}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, isFree: checked }))
            }
          />
        </div>
      </div>

      {/* Content-specific fields */}
      {formData.contentType === "VIDEO" && (
        <div className="space-y-4 pt-4 border-t">
          <Label>Video Content</Label>
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <FaVideo className="w-12 h-12 mx-auto mb-4 text-blue-500 opacity-50" />
            <p className="text-muted-foreground mb-2">
              Upload a video file or paste a URL
            </p>
            <Input
              placeholder="Video URL (YouTube, Vimeo, etc.)"
              value={formData.videoUrl || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, videoUrl: e.target.value }))
              }
              className="max-w-md mx-auto"
            />
          </div>
        </div>
      )}

      {formData.contentType === "PDF" && (
        <div className="space-y-4 pt-4 border-t">
          <Label>Document Content</Label>
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <FaFileAlt className="w-12 h-12 mx-auto mb-4 text-red-500 opacity-50" />
            <p className="text-muted-foreground">
              Upload a PDF or document file
            </p>
          </div>
        </div>
      )}

      {formData.contentType === "QUIZ" && (
        <div className="pt-4 border-t">
          <QuizBuilder
            questions={formData.quizQuestions || []}
            onChange={(questions) =>
              setFormData((prev) => ({ ...prev, quizQuestions: questions }))
            }
          />
        </div>
      )}

      {formData.contentType === "ASSIGNMENT" && (
        <div className="space-y-4 pt-4 border-t">
          <Label htmlFor="assignmentContent">Assignment Instructions</Label>
          <Textarea
            id="assignmentContent"
            value={formData.content || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, content: e.target.value }))
            }
            placeholder="Describe the assignment and what students need to submit"
            rows={6}
          />
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <FaSave className="mr-2" />
          Save Lesson
        </Button>
      </div>
    </form>
  );
}

export function AdvancedCourseBuilder({
  courseId,
  courseName,
  initialSections = [],
  onSave,
  onPublish,
}: AdvancedCourseBuilderProps) {
  const [sections, setSections] = useState<Section[]>(
    initialSections.length > 0
      ? initialSections
      : [
          {
            id: "section_1",
            title: "Getting Started",
            description: "Introduction and setup",
            lessons: [],
            order: 0,
          },
        ]
  );
  const [editingLesson, setEditingLesson] = useState<{
    sectionId: string;
    lesson: Lesson | null;
  } | null>(null);
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSectionDescription, setNewSectionDescription] = useState("");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["section_1"])
  );

  // Add a new section
  const addSection = () => {
    if (!newSectionTitle.trim()) return;

    const newSection: Section = {
      id: `section_${Date.now()}`,
      title: newSectionTitle,
      description: newSectionDescription,
      lessons: [],
      order: sections.length,
    };

    setSections([...sections, newSection]);
    setNewSectionTitle("");
    setNewSectionDescription("");
    setIsAddSectionOpen(false);
    setExpandedSections(new Set([...expandedSections, newSection.id]));
  };

  // Delete a section
  const deleteSection = (sectionId: string) => {
    setSections(sections.filter((s) => s.id !== sectionId));
  };

  // Add or update lesson
  const saveLesson = (sectionId: string, lesson: Lesson) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;

        const existingIndex = section.lessons.findIndex((l) => l.id === lesson.id);
        if (existingIndex >= 0) {
          // Update existing lesson
          const updatedLessons = [...section.lessons];
          updatedLessons[existingIndex] = lesson;
          return { ...section, lessons: updatedLessons };
        } else {
          // Add new lesson
          return {
            ...section,
            lessons: [...section.lessons, { ...lesson, order: section.lessons.length }],
          };
        }
      })
    );
    setEditingLesson(null);
  };

  // Delete a lesson
  const deleteLesson = (sectionId: string, lessonId: string) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          lessons: section.lessons.filter((l) => l.id !== lessonId),
        };
      })
    );
  };

  // Reorder lessons within a section
  const reorderLessons = (sectionId: string, newOrder: Lesson[]) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          lessons: newOrder.map((lesson, index) => ({
            ...lesson,
            order: index,
          })),
        };
      })
    );
  };

  // Reorder sections
  const reorderSections = (newOrder: Section[]) => {
    setSections(
      newOrder.map((section, index) => ({
        ...section,
        order: index,
      }))
    );
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  // Calculate total stats
  const totalLessons = sections.reduce((acc, s) => acc + s.lessons.length, 0);
  const totalDuration = sections.reduce(
    (acc, s) =>
      acc + s.lessons.reduce((lAcc, l) => lAcc + (l.duration || 0), 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Course Content</h2>
          <p className="text-muted-foreground">
            {sections.length} sections • {totalLessons} lessons •{" "}
            {Math.floor(totalDuration / 60)}h {totalDuration % 60}m total
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onSave?.(sections)}
          >
            <FaSave className="mr-2" />
            Save Draft
          </Button>
          <Button onClick={onPublish} className="bg-green-600 hover:bg-green-700">
            <FaEye className="mr-2" />
            Publish Course
          </Button>
        </div>
      </div>

      {/* Sections */}
      <Reorder.Group
        axis="y"
        values={sections}
        onReorder={reorderSections}
        className="space-y-4"
      >
        {sections.map((section, sectionIndex) => (
          <Reorder.Item
            key={section.id}
            value={section}
            className="cursor-move"
          >
            <Card>
              <CardHeader className="py-3">
                <div className="flex items-center gap-3">
                  <FaGripVertical className="text-gray-400 cursor-grab" />
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="p-1"
                  >
                    {expandedSections.has(section.id) ? (
                      <FaChevronDown className="text-gray-500" />
                    ) : (
                      <FaChevronRight className="text-gray-500" />
                    )}
                  </button>
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      Section {sectionIndex + 1}: {section.title}
                    </CardTitle>
                    {section.description && (
                      <CardDescription>{section.description}</CardDescription>
                    )}
                  </div>
                  <Badge variant="secondary">
                    {section.lessons.length} lessons
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => deleteSection(section.id)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </CardHeader>

              {expandedSections.has(section.id) && (
                <CardContent className="pt-0">
                  {/* Lessons */}
                  <Reorder.Group
                    axis="y"
                    values={section.lessons}
                    onReorder={(newOrder) => reorderLessons(section.id, newOrder)}
                    className="space-y-2 mb-4"
                  >
                    {section.lessons.map((lesson, lessonIndex) => (
                      <Reorder.Item
                        key={lesson.id}
                        value={lesson}
                        className="cursor-move"
                      >
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                          <FaGripVertical className="text-gray-400 cursor-grab" />
                          <div className="flex items-center gap-2">
                            {contentTypeIcons[lesson.contentType]}
                            <span className="text-sm text-muted-foreground">
                              {sectionIndex + 1}.{lessonIndex + 1}
                            </span>
                          </div>
                          <div className="flex-1">
                            <span className="font-medium">{lesson.title}</span>
                            {lesson.description && (
                              <p className="text-sm text-muted-foreground truncate">
                                {lesson.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {lesson.isFree ? (
                              <Badge variant="secondary" className="text-xs">
                                <FaUnlock className="mr-1" /> Free
                              </Badge>
                            ) : (
                              <FaLock className="text-gray-400" />
                            )}
                            {lesson.duration && (
                              <span className="text-xs text-muted-foreground flex items-center">
                                <FaClock className="mr-1" />
                                {lesson.duration}m
                              </span>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {contentTypeLabels[lesson.contentType]}
                            </Badge>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setEditingLesson({
                                  sectionId: section.id,
                                  lesson,
                                })
                              }
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => deleteLesson(section.id, lesson.id)}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </div>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>

                  {/* Add Lesson Button */}
                  <Button
                    variant="outline"
                    className="w-full border-dashed"
                    onClick={() =>
                      setEditingLesson({ sectionId: section.id, lesson: null })
                    }
                  >
                    <FaPlus className="mr-2" />
                    Add Lesson
                  </Button>
                </CardContent>
              )}
            </Card>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* Add Section */}
      <Dialog open={isAddSectionOpen} onOpenChange={setIsAddSectionOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full border-dashed">
            <FaPlus className="mr-2" />
            Add Section
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Section</DialogTitle>
            <DialogDescription>
              Create a new section to organize your course content.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="sectionTitle">Section Title</Label>
              <Input
                id="sectionTitle"
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                placeholder="e.g., Advanced Topics"
              />
            </div>
            <div>
              <Label htmlFor="sectionDescription">Description (Optional)</Label>
              <Textarea
                id="sectionDescription"
                value={newSectionDescription}
                onChange={(e) => setNewSectionDescription(e.target.value)}
                placeholder="Brief description of this section"
                rows={2}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddSectionOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addSection} disabled={!newSectionTitle.trim()}>
              Add Section
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lesson Editor Dialog */}
      <Dialog
        open={editingLesson !== null}
        onOpenChange={(open) => !open && setEditingLesson(null)}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingLesson?.lesson ? "Edit Lesson" : "Add New Lesson"}
            </DialogTitle>
            <DialogDescription>
              Configure your lesson content and settings.
            </DialogDescription>
          </DialogHeader>
          {editingLesson && (
            <LessonEditor
              lesson={editingLesson.lesson}
              onSave={(lesson) => saveLesson(editingLesson.sectionId, lesson)}
              onCancel={() => setEditingLesson(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdvancedCourseBuilder;
