import { Teacher, ClassGroup, Schedule, Assignment, TimeSlot } from '../models';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class ConstraintValidator {
  
  /**
   * בדיקת תקינות כללית של המערכת
   */
  validateSystem(
    teachers: Teacher[], 
    classes: ClassGroup[], 
    schedule: Schedule
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // בדיקת תקינות מורות
    teachers.forEach((teacher, index) => {
      const teacherErrors = this.validateTeacher(teacher);
      errors.push(...teacherErrors.map(e => `Teacher ${index + 1}: ${e}`));
    });

    // בדיקת תקינות כיתות
    classes.forEach((classGroup, index) => {
      const classErrors = this.validateClass(classGroup);
      errors.push(...classErrors.map(e => `Class ${index + 1}: ${e}`));
    });

    // בדיקת תקינות מערכת שעות
    const scheduleErrors = this.validateSchedule(schedule, teachers, classes);
    errors.push(...scheduleErrors);

    // בדיקות אזהרה
    const systemWarnings = this.generateWarnings(teachers, classes, schedule);
    warnings.push(...systemWarnings);

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * בדיקת תקינות מורה בודדת
   */
  private validateTeacher(teacher: Teacher): string[] {
    const errors: string[] = [];
    
    if (!teacher.id?.trim()) {
      errors.push('Teacher ID is required');
    }
    
    if (!teacher.name?.trim()) {
      errors.push('Teacher name is required');
    }
    
    if (!teacher.subjects || teacher.subjects.length === 0) {
      errors.push('Teacher must have at least one subject');
    }
    
    teacher.subjects?.forEach((subject, index) => {
      if (!subject.name?.trim()) {
        errors.push(`Subject ${index + 1}: name is required`);
      }
      if (subject.gradeLevel < 1 || subject.gradeLevel > 8) {
        errors.push(`Subject ${index + 1}: grade level must be between 1-8`);
      }
    });
    
    if (teacher.preferredDayOff !== undefined && 
        (teacher.preferredDayOff < 0 || teacher.preferredDayOff > 6)) {
      errors.push('Preferred day off must be between 0-6');
    }
    
    return errors;
  }

  /**
   * בדיקת תקינות כיתה בודדת
   */
  private validateClass(classGroup: ClassGroup): string[] {
    const errors: string[] = [];
    
    if (!classGroup.id?.trim()) {
      errors.push('Class ID is required');
    }
    
    if (!classGroup.name?.trim()) {
      errors.push('Class name is required');
    }
    
    if (classGroup.gradeLevel < 1 || classGroup.gradeLevel > 8) {
      errors.push('Grade level must be between 1-8');
    }
    
    if (classGroup.minHoursPerDay < 0) {
      errors.push('Minimum hours per day cannot be negative');
    }
    
    if (classGroup.maxHoursPerDay < classGroup.minHoursPerDay) {
      errors.push('Maximum hours per day must be >= minimum hours per day');
    }
    
    if (!classGroup.subjectRequirements || classGroup.subjectRequirements.length === 0) {
      errors.push('Class must have at least one subject requirement');
    }
    
    classGroup.subjectRequirements?.forEach((req, index) => {
      if (!req.subject?.trim()) {
        errors.push(`Subject requirement ${index + 1}: subject name is required`);
      }
      if (req.hoursPerWeek <= 0) {
        errors.push(`Subject requirement ${index + 1}: hours per week must be positive`);
      }
    });
    
    return errors;
  }

  /**
   * בדיקת תקינות מערכת שעות
   */
  private validateSchedule(
    schedule: Schedule, 
    teachers: Teacher[], 
    classes: ClassGroup[]
  ): string[] {
    const errors: string[] = [];
    const assignments = schedule.getAllAssignments();

    // בדיקת התנגשויות
    for (let i = 0; i < assignments.length; i++) {
      for (let j = i + 1; j < assignments.length; j++) {
        if (this.assignmentsConflict(assignments[i], assignments[j])) {
          errors.push(
            `Conflict: ${assignments[i].teacherId} and ${assignments[j].teacherId} ` +
            `at day ${assignments[i].timeSlot.day}, hour ${assignments[i].timeSlot.hour}`
          );
        }
      }
    }

    // בדיקת התאמת מורה למקצוע ושכבה
    assignments.forEach((assignment, index) => {
      const teacher = teachers.find(t => t.id === assignment.teacherId);
      const classGroup = classes.find(c => c.id === assignment.classId);
      
      if (!teacher) {
        errors.push(`Assignment ${index + 1}: Teacher ${assignment.teacherId} not found`);
        return;
      }
      
      if (!classGroup) {
        errors.push(`Assignment ${index + 1}: Class ${assignment.classId} not found`);
        return;
      }
      
      const canTeach = teacher.subjects.some(s => 
        s.name === assignment.subject && s.gradeLevel === classGroup.gradeLevel
      );
      
      if (!canTeach) {
        errors.push(
          `Assignment ${index + 1}: Teacher ${teacher.name} cannot teach ` +
          `${assignment.subject} to grade ${classGroup.gradeLevel}`
        );
      }
    });

    return errors;
  }

  /**
   * בדיקת התנגשות בין שני שיבוצים
   */
  private assignmentsConflict(a1: Assignment, a2: Assignment): boolean {
    const sameTime = a1.timeSlot.day === a2.timeSlot.day && 
                     a1.timeSlot.hour === a2.timeSlot.hour;
    
    if (!sameTime) return false;
    
    // מורה לא יכולה להיות בשני מקומות
    if (a1.teacherId === a2.teacherId) return true;
    
    // כיתה לא יכולה להיות עם שני מורים
    if (a1.classId === a2.classId) return true;
    
    return false;
  }

  /**
   * יצירת אזהרות למערכת
   */
  private generateWarnings(
    teachers: Teacher[], 
    classes: ClassGroup[], 
    schedule: Schedule
  ): string[] {
    const warnings: string[] = [];

    // אזהרה על מורות עם עומס גבוה
    teachers.forEach(teacher => {
      const assignments = schedule.getAssignmentsForTeacher(teacher.id);
      if (assignments.length > 30) { // יותר מ-30 שעות בשבוע
        warnings.push(`Teacher ${teacher.name} has ${assignments.length} hours per week (high load)`);
      }
    });

    // בדיקת השלמת דרישות כיתות - אילוץ קשיח
    classes.forEach(classGroup => {
      // בדיקה לכל מקצוע בנפרד
      classGroup.subjectRequirements.forEach(requirement => {
        const assignments = schedule.getAssignmentsForClass(classGroup.id)
          .filter(a => a.subject === requirement.subject);
        
        if (assignments.length !== requirement.hoursPerWeek) {
          warnings.push(
            `Class ${classGroup.name}: ${requirement.subject} has ${assignments.length}/${requirement.hoursPerWeek} hours`
          );
        }
      });
      
      // בדיקת מגבלות יומיות
      const workingDays = [0, 1, 2, 3, 4];
      workingDays.forEach(day => {
        const dailyHours = schedule.getClassHoursPerDay(classGroup.id, day);
        
        // אזהרה על חריגה ממקסימום
        if (dailyHours > classGroup.maxHoursPerDay) {
          warnings.push(
            `Class ${classGroup.name} exceeds max hours on day ${day}: ${dailyHours}/${classGroup.maxHoursPerDay}`
          );
        }
        
        // אזהרה על פחות ממינימום
        if (dailyHours > 0 && dailyHours < classGroup.minHoursPerDay) {
          warnings.push(
            `Class ${classGroup.name} below min hours on day ${day}: ${dailyHours}/${classGroup.minHoursPerDay}`
          );
        }
      });
    });

    return warnings;
  }
}