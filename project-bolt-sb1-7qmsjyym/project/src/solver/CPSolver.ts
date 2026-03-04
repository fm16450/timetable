import { Teacher, ClassGroup, Schedule, Assignment, TimeSlot } from '../models';
import { ConstraintValidator, ValidationResult } from '../constraints/ConstraintValidator';

export interface SolverOptions {
  maxIterations: number;
  timeoutMs: number;
  optimizeForTeacherPreferences: boolean;
  allowPartialSolutions: boolean;
}

export interface SolverResult {
  success: boolean;
  schedule: Schedule | null;
  iterations: number;
  timeMs: number;
  message: string;
  validation: ValidationResult;
}

export interface Variable {
  teacherId: string;
  classId: string;
  subject: string;
  timeSlot: TimeSlot;
  domain: TimeSlot[]; // אפשרויות זמן אפשריות
}

export class CPSolver {
  private teachers: Teacher[];
  private classes: ClassGroup[];
  private validator: ConstraintValidator;
  private workingDays: number[];
  private hoursPerDay: number;

  constructor(
    teachers: Teacher[], 
    classes: ClassGroup[], 
    workingDays: number[] = [0, 1, 2, 3, 4], // ראשון-חמישי
    hoursPerDay: number = 8
  ) {
    this.teachers = teachers;
    this.classes = classes;
    this.validator = new ConstraintValidator();
    this.workingDays = workingDays;
    this.hoursPerDay = hoursPerDay;
  }

  /**
   * פתרון ראשי של בעיית השיבוץ
   */
  async solve(options: SolverOptions): Promise<SolverResult> {
    const startTime = Date.now();
    let iterations = 0;

    try {
      // יצירת משתנים
      const variables = this.createVariables();
      
      // הגדרת דומיינים ראשוניים
      this.initializeDomains(variables);
      
      // פתרון עם backtracking
      const schedule = new Schedule({
        maxDaysPerWeek: this.workingDays.length,
        maxHoursPerDay: this.hoursPerDay,
        workingDays: this.workingDays
      });

      const solution = await this.backtrackSearch(
        variables, 
        schedule, 
        options, 
        iterations
      );

      const endTime = Date.now();
      const validation = this.validator.validateSystem(
        this.teachers, 
        this.classes, 
        solution || schedule
      );

      return {
        success: solution !== null,
        schedule: solution,
        iterations,
        timeMs: endTime - startTime,
        message: solution ? 'פתרון נמצא בהצלחה' : 'לא נמצא פתרון תקין',
        validation
      };

    } catch (error) {
      return {
        success: false,
        schedule: null,
        iterations,
        timeMs: Date.now() - startTime,
        message: `שגיאה בפתרון: ${error}`,
        validation: { isValid: false, errors: [String(error)], warnings: [] }
      };
    }
  }

  /**
   * יצירת משתנים לכל שיבוץ נדרש
   */
  private createVariables(): Variable[] {
    const variables: Variable[] = [];

    this.classes.forEach(classGroup => {
      classGroup.subjectRequirements.forEach(requirement => {
        // מציאת מורות מתאימות למקצוע ושכבה
        const suitableTeachers = this.teachers.filter(teacher =>
          teacher.subjects.some(s => 
            s.name === requirement.subject && 
            s.gradeLevel === classGroup.gradeLevel
          )
        );
        
        if (suitableTeachers.length === 0) {
          throw new Error(
            `אין מורה זמינה למקצוע ${requirement.subject} בשכבה ${classGroup.gradeLevel}`
          );
        }

        // יצירת משתנה לכל שעה נדרשת של המקצוע - בדיוק כמות השעות הנדרשת
        for (let hour = 0; hour < requirement.hoursPerWeek; hour++) {
          // יצירת משתנה עבור כל מורה מתאימה (הפותר יבחר איזו)
          suitableTeachers.forEach(teacher => {
            variables.push({
              teacherId: teacher.id,
              classId: classGroup.id,
              subject: requirement.subject,
              timeSlot: { day: -1, hour: -1 }, // יוגדר בפתרון
              domain: [] // יוגדר בהמשך
            });
          });
        }
      });
    });

    return variables;
  }

  /**
   * הגדרת דומיינים ראשוניים לכל משתנה
   */
  private initializeDomains(variables: Variable[]): void {
    variables.forEach(variable => {
      variable.domain = [];
      
      this.workingDays.forEach(day => {
        for (let hour = 0; hour < this.hoursPerDay; hour++) {
          const timeSlot: TimeSlot = { day, hour };
          
          // בדיקה אם הזמן מתאים למורה (יום חופשי)
          const teacher = this.teachers.find(t => t.id === variable.teacherId);
          if (teacher?.preferredDayOff === day) {
            return; // דילוג על יום חופשי מועדף
          }

          variable.domain.push(timeSlot);
        }
      });
    });
  }

  /**
   * אלגוריתם Backtracking עם אופטימיזציות
   */
  private async backtrackSearch(
    variables: Variable[],
    schedule: Schedule,
    options: SolverOptions,
    iterations: number
  ): Promise<Schedule | null> {
    
    if (iterations >= options.maxIterations) {
      return null;
    }

    // בחירת משתנה הבא (MRV - Minimum Remaining Values)
    const unassignedVar = this.selectUnassignedVariable(variables, schedule);
    
    if (!unassignedVar) {
      // כל המשתנים שובצו - בדיקה אם הפתרון שלם
      return this.isCompleteSolution(schedule) ? schedule : null;
    }

    // מיון ערכים לפי LCV (Least Constraining Value)
    const orderedValues = this.orderDomainValues(unassignedVar, variables, schedule);

    for (const timeSlot of orderedValues) {
      const assignment: Assignment = {
        teacherId: unassignedVar.teacherId,
        classId: unassignedVar.classId,
        subject: unassignedVar.subject,
        timeSlot
      };

      // בדיקת עקביות
      if (this.isConsistent(assignment, schedule)) {
        // שיבוץ
        schedule.addAssignment(assignment);
        unassignedVar.timeSlot = timeSlot;

        // Forward Checking - עדכון דומיינים
        const removedValues = this.forwardCheck(variables, assignment, schedule);

        // המשך רקורסיבי
        const result = await this.backtrackSearch(
          variables, 
          schedule, 
          options, 
          iterations + 1
        );

        if (result) {
          return result;
        }

        // Backtrack - ביטול השיבוץ
        schedule.removeAssignment(assignment);
        unassignedVar.timeSlot = { day: -1, hour: -1 };
        this.restoreDomains(variables, removedValues);
      }
    }

    return null;
  }

  /**
   * בחירת משתנה הבא לשיבוץ (MRV Heuristic)
   */
  private selectUnassignedVariable(variables: Variable[], schedule: Schedule): Variable | null {
    const unassigned = variables.filter(v => v.timeSlot.day === -1);
    
    if (unassigned.length === 0) return null;

    // בחירת המשתנה עם הכי מעט אפשרויות (MRV)
    return unassigned.reduce((min, current) => 
      current.domain.length < min.domain.length ? current : min
    );
  }

  /**
   * מיון ערכי דומיין (LCV Heuristic)
   */
  private orderDomainValues(
    variable: Variable, 
    allVariables: Variable[], 
    schedule: Schedule
  ): TimeSlot[] {
    return variable.domain.sort((a, b) => {
      const constraintsA = this.countConstraints(a, variable, allVariables, schedule);
      const constraintsB = this.countConstraints(b, variable, allVariables, schedule);
      return constraintsA - constraintsB; // פחות אילוצים = עדיפות גבוהה
    });
  }

  /**
   * ספירת אילוצים שערך יוצר
   */
  private countConstraints(
    timeSlot: TimeSlot,
    variable: Variable,
    allVariables: Variable[],
    schedule: Schedule
  ): number {
    let constraints = 0;

    // בדיקת השפעה על משתנים אחרים
    allVariables.forEach(otherVar => {
      if (otherVar === variable || otherVar.timeSlot.day !== -1) return;

      // אם השיבוץ יסיר את הזמן הזה מהדומיין של משתנה אחר
      if (this.wouldRemoveFromDomain(timeSlot, variable, otherVar)) {
        constraints++;
      }
    });

    return constraints;
  }

  /**
   * בדיקה אם שיבוץ יסיר ערך מדומיין של משתנה אחר
   */
  private wouldRemoveFromDomain(
    timeSlot: TimeSlot,
    variable: Variable,
    otherVariable: Variable
  ): boolean {
    // אותו מורה לא יכול להיות בשני מקומות
    if (variable.teacherId === otherVariable.teacherId) {
      return otherVariable.domain.some(slot => 
        slot.day === timeSlot.day && slot.hour === timeSlot.hour
      );
    }

    // אותה כיתה לא יכולה להיות עם שני מורים
    if (variable.classId === otherVariable.classId) {
      return otherVariable.domain.some(slot => 
        slot.day === timeSlot.day && slot.hour === timeSlot.hour
      );
    }

    return false;
  }

  /**
   * בדיקת עקביות של שיבוץ
   */
  private isConsistent(assignment: Assignment, schedule: Schedule): boolean {
    // בדיקת התנגשויות בסיסיות
    if (schedule.hasConflict(assignment)) {
      return false;
    }

    // בדיקה שהמורה מתמחצעת במקצוע ובשכבה הנכונה
    const teacher = this.teachers.find(t => t.id === assignment.teacherId);
    const classGroup = this.classes.find(c => c.id === assignment.classId);
    
    if (!teacher || !classGroup) {
      return false;
    }
    
    const canTeach = teacher.subjects.some(s => 
      s.name === assignment.subject && s.gradeLevel === classGroup.gradeLevel
    );
    
    if (!canTeach) {
      return false;
    }

    // בדיקת מגבלות שעות יומיות לכיתה - אילוץ קשיח
    const dailyHours = schedule.getClassHoursPerDay(assignment.classId, assignment.timeSlot.day);
    if (dailyHours + 1 > classGroup.maxHoursPerDay) {
      return false;
    }

    // בדיקת מגבלות מורה
    if (teacher.preferredDayOff === assignment.timeSlot.day) {
      return false;
    }

    if (teacher.maxHoursPerDay) {
      const teacherDailyHours = schedule.getTeacherHoursPerDay(
        assignment.teacherId, 
        assignment.timeSlot.day
      );
      if (teacherDailyHours + 1 > teacher.maxHoursPerDay) {
        return false;
      }
    }

    return true;
  }

  /**
   * Forward Checking - עדכון דומיינים לאחר שיבוץ
   */
  private forwardCheck(
    variables: Variable[],
    assignment: Assignment,
    schedule: Schedule
  ): Map<Variable, TimeSlot[]> {
    const removedValues = new Map<Variable, TimeSlot[]>();

    variables.forEach(variable => {
      if (variable.timeSlot.day !== -1) return; // כבר שובץ

      const toRemove: TimeSlot[] = [];

      variable.domain.forEach(timeSlot => {
        const testAssignment: Assignment = {
          teacherId: variable.teacherId,
          classId: variable.classId,
          subject: variable.subject,
          timeSlot
        };

        if (!this.isConsistent(testAssignment, schedule)) {
          toRemove.push(timeSlot);
        }
      });

      if (toRemove.length > 0) {
        removedValues.set(variable, [...toRemove]);
        variable.domain = variable.domain.filter(slot => 
          !toRemove.some(removed => 
            removed.day === slot.day && removed.hour === slot.hour
          )
        );
      }
    });

    return removedValues;
  }

  /**
   * שחזור דומיינים לאחר backtrack
   */
  private restoreDomains(
    variables: Variable[],
    removedValues: Map<Variable, TimeSlot[]>
  ): void {
    removedValues.forEach((removed, variable) => {
      variable.domain.push(...removed);
    });
  }

  /**
   * בדיקה אם הפתרון שלם
   */
  private isCompleteSolution(schedule: Schedule): boolean {
    // בדיקה שכל הדרישות מולאו - אילוץ קשיח
    for (const classGroup of this.classes) {
      for (const requirement of classGroup.subjectRequirements) {
        const assignedHours = schedule.getAllAssignments().filter(a =>
          a.classId === classGroup.id && a.subject === requirement.subject
        ).length;

        // חובה לקבל בדיוק את כמות השעות הנדרשת
        if (assignedHours !== requirement.hoursPerWeek) {
          return false;
        }
      }
      
      // בדיקת מינימום ומקסימום שעות יומיות לכל יום - אילוצים קשיחים
      for (const day of this.workingDays) {
        const dailyHours = schedule.getClassHoursPerDay(classGroup.id, day);
        
        // אם יש שעות ביום - חייב להיות לפחות המינימום
        if (dailyHours > 0 && dailyHours < classGroup.minHoursPerDay) {
          return false;
        }
        
        // לא יותר מהמקסימום - אילוץ קשיח
        if (dailyHours > classGroup.maxHoursPerDay) {
          return false;
        }
      }
    }

    return true;
  }
}