import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { formService } from "../services/api";
import { useErrorHandler } from "../hooks/useErrorHandler";

interface Course {
  id: number;
  code: string;
  semester: string;
  resultData: any;
  coData: any;
  academicData: any;
  feedbackData: any;
}

interface CourseContextType {
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  isInitialized: boolean;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

interface CourseProviderProps {
  children: ReactNode;
}

export const CourseProvider = ({ children }: CourseProviderProps) => {
  const [courses, setCoursesState] = useState<Course[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const initializeCoursesFromDatabase = async () => {
      if (isInitialized) return;

      const userDataStr = localStorage.getItem("userData");
      if (!userDataStr) return;

      try {
        const userData = JSON.parse(userDataStr);
        if (!userData?.dept || !userData?._id) return;

        const data = await formService.getFormData(userData.dept, userData._id, 'A');
        
        if (data['1']?.courses) {
          // Create a more complete course object
          const coursesFromDB: Course[] = Object.entries(data['1'].courses).map(([courseCode, courseData]: [string, any]) => ({
            id: Date.now() + Math.random(),
            code: courseCode,
            semester: data['2']?.courses[courseCode]?.semester || "Sem I",
            resultData: courseData,
            coData: data['2']?.courses[courseCode] || {},
            academicData: data['4']?.courses[courseCode] || {},
            feedbackData: data['7']?.courses[courseCode] || {}
          }));
          
          setCoursesState(coursesFromDB);
          // Store in localStorage for persistence
          localStorage.setItem('courseData', JSON.stringify(coursesFromDB));
        }
        
        setIsInitialized(true);
      } catch (error) {
        handleError(error, 'CourseContext');
        // Try to load from localStorage if fetch fails
        const storedCourses = localStorage.getItem('courseData');
        if (storedCourses) {
          try {
            setCoursesState(JSON.parse(storedCourses));
          } catch (parseError) {
            console.error("Error parsing stored courses:", parseError);
          }
        }
        setIsInitialized(true);
      }
    };

    initializeCoursesFromDatabase();
  }, [isInitialized, handleError]);

  // Add a save function to persist changes
  const saveCourses = (newCourses: Course[]): void => {
    setCoursesState(newCourses);
    localStorage.setItem('courseData', JSON.stringify(newCourses));
  };

  return (
    <CourseContext.Provider value={{ 
      courses, 
      setCourses: saveCourses, 
      isInitialized 
    }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = (): CourseContextType => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};

