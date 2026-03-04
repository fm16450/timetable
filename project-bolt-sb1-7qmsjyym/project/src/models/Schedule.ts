export interface TimeSlot {
  day: number; // 0-6 (ראשון-שבת)
  hour: number; // 0-39 (40 שעות שבועיות מקסימום)
}

export interface Assignment {
  teacherId: string;
  classId: string;
  subject: string;
  timeSlot: TimeSlot;
}

export interface ScheduleConstraints {
  maxDaysPerWeek: number; // מקסימום ימי לימוד בשבוע
  maxHoursPerDay: number; // מקסימום שעות ביום
  workingDays: number[]; // ימי עבודה (0-6)
}

export class Schedule {
  private assignments: Assignment[] = [];
  private constraints: ScheduleConstraints;

  constructor(constraints: ScheduleConstraints) {
    this.constraints = constraints;
  }

  addAssignment(assignment: Assignment): boolean {
    // בדיקת התנגשויות לפני הוספה
    if (this.hasConflict(assignment)) {
      return false;
    }
    
    this.assignments.push(assignment);
    return true;
  }

  removeAssignment(assignment: Assignment): void {
    this.assignments = this.assignments.filter(a => 
      !(a.teacherId === assignment.teacherId &&
        a.classId === assignment.classId &&
        a.timeSlot.day === assignment.timeSlot.day &&
        a.timeSlot.hour === assignment.timeSlot.hour)
    );
  }

  hasConflict(newAssignment: Assignment): boolean {
    return this.assignments.some(existing => {
      const sameTime = existing.timeSlot.day === newAssignment.timeSlot.day &&
                      existing.timeSlot.hour === newAssignment.timeSlot.hour;
      
      if (!sameTime) return false;
      
      // התנגשות מורה - מורה לא יכולה להיות בשני מקומות
      if (existing.teacherId === newAssignment.teacherId) return true;
      
      // התנגשות כיתה - כיתה לא יכולה להיות עם שני מורים
      if (existing.classId === newAssignment.classId) return true;
      
      return false;
    });
  }

  getAssignmentsForTeacher(teacherId: string): Assignment[] {
    return this.assignments.filter(a => a.teacherId === teacherId);
  }

  getAssignmentsForClass(classId: string): Assignment[] {
    return this.assignments.filter(a => a.classId === classId);
  }

  getAssignmentsForTimeSlot(timeSlot: TimeSlot): Assignment[] {
    return this.assignments.filter(a => 
      a.timeSlot.day === timeSlot.day && a.timeSlot.hour === timeSlot.hour
    );
  }

  getAllAssignments(): Assignment[] {
    return [...this.assignments];
  }

  getTeacherHoursPerDay(teacherId: string, day: number): number {
    return this.assignments.filter(a => 
      a.teacherId === teacherId && a.timeSlot.day === day
    ).length;
  }

  getClassHoursPerDay(classId: string, day: number): number {
    return this.assignments.filter(a => 
      a.classId === classId && a.timeSlot.day === day
    ).length;
  }

  validateSchedule(): string[] {
    const errors: string[] = [];
    
    // בדיקת התנגשויות
    for (let i = 0; i < this.assignments.length; i++) {
      for (let j = i + 1; j < this.assignments.length; j++) {
        if (this.hasConflict(this.assignments[i])) {
          errors.push(`Conflict detected between assignments ${i} and ${j}`);
        }
      }
    }
    
    return errors;
  }

  clear(): void {
    this.assignments = [];
  }
}