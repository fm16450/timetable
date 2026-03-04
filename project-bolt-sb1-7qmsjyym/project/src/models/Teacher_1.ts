// export interface Subject {
//   name: string;
//   gradeLevel: number; // 1-8 for grades א-ח
// }

// export interface Teacher {
//   id: string;
//   name: string;
//   subjects: Subject[]; // מקצועות שהמורה מתמחצעת בהם
//   preferredDayOff?: number; // יום חופשי מועדף (0-6, אופציונלי)
//   maxHoursPerDay?: number; // מקסימום שעות ביום
//   maxHoursPerWeek?: number; // מקסימום שעות בשבוע
// }


export class TeacherModel {
  private teachers: Map<string, Teacher> = new Map();

  addTeacher(teacher: Teacher): void {
    this.teachers.set(teacher.id, teacher);
  }

  getTeacher(id: string): Teacher | undefined {
    return this.teachers.get(id);
  }

  getAllTeachers(): Teacher[] {
    return Array.from(this.teachers.values());
  }

  getTeachersBySubjectAndGrade(subject: string, gradeLevel: number): Teacher[] {
    return this.getAllTeachers().filter(teacher =>
      teacher.subjects.some(s => s.name === subject && s.gradeLevel === gradeLevel)
    );
  }

  validateTeacher(teacher: Teacher): string[] {
    const errors: string[] = [];
    
    if (!teacher.id || teacher.id.trim() === '') {
      errors.push('Teacher ID is required');
    }
    
    if (!teacher.name || teacher.name.trim() === '') {
      errors.push('Teacher name is required');
    }
    
    if (!teacher.subjects || teacher.subjects.length === 0) {
      errors.push('Teacher must have at least one subject');
    }
    
    teacher.subjects.forEach((subject, index) => {
      if (!subject.name || subject.name.trim() === '') {
        errors.push(`Subject ${index + 1}: name is required`);
      }
      if (subject.gradeLevel < 1 || subject.gradeLevel > 8) {
        errors.push(`Subject ${index + 1}: grade level must be between 1-8`);
      }
    });
    
    return errors;
  }
}