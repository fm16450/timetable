import { Teacher, ClassGroup, Schedule } from '../models';
import { CPSolver, SolverOptions, SolverResult, ScheduleOptimizer } from '../solver';
import { ConstraintValidator } from '../constraints/ConstraintValidator';

export interface SchedulingRequest {
  teachers: Teacher[];
  classes: ClassGroup[];
  workingDays?: number[];
  hoursPerDay?: number;
  solverOptions?: Partial<SolverOptions>;
}

export interface SchedulingResponse {
  success: boolean;
  schedule: Schedule | null;
  metrics: any;
  message: string;
  processingTime: number;
}

export class SchedulingService {
  private validator: ConstraintValidator;
  private optimizer: ScheduleOptimizer;

  constructor() {
    this.validator = new ConstraintValidator();
    this.optimizer = new ScheduleOptimizer();
  }

  /**
   * שירות ראשי ליצירת מערכת שעות
   */
  async createSchedule(request: SchedulingRequest): Promise<SchedulingResponse> {
    const startTime = Date.now();

    try {
      // בדיקת תקינות נתונים
      const validation = this.validator.validateSystem(
        request.teachers,
        request.classes,
        new Schedule({ maxDaysPerWeek: 5, maxHoursPerDay: 8, workingDays: [0, 1, 2, 3, 4] })
      );

      if (!validation.isValid) {
        return {
          success: false,
          schedule: null,
          metrics: null,
          message: `שגיאות בנתונים: ${validation.errors.join(', ')}`,
          processingTime: Date.now() - startTime
        };
      }

      // הגדרת אפשרויות פותר
      const solverOptions: SolverOptions = {
        maxIterations: 10000,
        timeoutMs: 300000, // 5 דקות
        optimizeForTeacherPreferences: true,
        allowPartialSolutions: false,
        ...request.solverOptions
      };

      // יצירת פותר
      const solver = new CPSolver(
        request.teachers,
        request.classes,
        request.workingDays || [0, 1, 2, 3, 4],
        request.hoursPerDay || 8
      );

      // פתרון הבעיה
      const result: SolverResult = await solver.solve(solverOptions);

      if (!result.success || !result.schedule) {
        return {
          success: false,
          schedule: null,
          metrics: null,
          message: result.message,
          processingTime: Date.now() - startTime
        };
      }

      // אופטימיזציה של הפתרון
      const optimizedSchedule = this.optimizer.optimizeSchedule(
        result.schedule,
        request.teachers,
        request.classes
      );

      // הערכת איכות הפתרון
      const metrics = this.optimizer.evaluateSchedule(
        optimizedSchedule,
        request.teachers,
        request.classes
      );

      return {
        success: true,
        schedule: optimizedSchedule,
        metrics,
        message: 'מערכת שעות נוצרה בהצלחה',
        processingTime: Date.now() - startTime
      };

    } catch (error) {
      return {
        success: false,
        schedule: null,
        metrics: null,
        message: `שגיאה בתהליך: ${error}`,
        processingTime: Date.now() - startTime
      };
    }
  }

  /**
   * בדיקת תקינות נתונים לפני פתרון
   */
  validateInput(request: SchedulingRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!request.teachers || request.teachers.length === 0) {
      errors.push('חובה להגדיר לפחות מורה אחת');
    }

    if (!request.classes || request.classes.length === 0) {
      errors.push('חובה להגדיר לפחות כיתה אחת');
    }

    // בדיקת התאמה בין מורות למקצועות
    const availableSubjects = new Set<string>();
    request.teachers?.forEach(teacher => {
      teacher.subjects.forEach(subject => {
        availableSubjects.add(`${subject.name}-${subject.gradeLevel}`);
      });
    });

    request.classes?.forEach(classGroup => {
      classGroup.subjectRequirements.forEach(requirement => {
        const key = `${requirement.subject}-${classGroup.gradeLevel}`;
        if (!availableSubjects.has(key)) {
          errors.push(
            `אין מורה זמינה למקצוע ${requirement.subject} בשכבה ${classGroup.gradeLevel}`
          );
        }
      });
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * קבלת סטטיסטיקות על מערכת שעות
   */
  getScheduleStatistics(schedule: Schedule, teachers: Teacher[], classes: ClassGroup[]) {
    const assignments = schedule.getAllAssignments();
    
    const teacherStats = teachers.map(teacher => {
      const teacherAssignments = schedule.getAssignmentsForTeacher(teacher.id);
      return {
        teacherId: teacher.id,
        name: teacher.name,
        totalHours: teacherAssignments.length,
        subjects: [...new Set(teacherAssignments.map(a => a.subject))],
        classes: [...new Set(teacherAssignments.map(a => a.classId))]
      };
    });

    const classStats = classes.map(classGroup => {
      const classAssignments = schedule.getAssignmentsForClass(classGroup.id);
      return {
        classId: classGroup.id,
        name: classGroup.name,
        totalHours: classAssignments.length,
        subjects: [...new Set(classAssignments.map(a => a.subject))],
        teachers: [...new Set(classAssignments.map(a => a.teacherId))]
      };
    });

    return {
      totalAssignments: assignments.length,
      teacherStats,
      classStats,
      metrics: this.optimizer.evaluateSchedule(schedule, teachers, classes)
    };
  }
}