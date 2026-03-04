export interface SubjectRequirement {
  subject: string;
  hoursPerWeek: number;
}

export interface ClassGroup {
  id: string;
  name: string; // e.g., "א1", "ב2"
  gradeLevel: number; // 1-8
  homeRoomTeacherId?: string; // מחנכת
  subjectRequirements: SubjectRequirement[]; // מקצועות ושעות נדרשות
  minHoursPerDay: number;
  maxHoursPerDay: number;
}

export class ClassModel {
  private classes: Map<string, ClassGroup> = new Map();

  addClass(classGroup: ClassGroup): void {
    this.classes.set(classGroup.id, classGroup);
  }

  getClass(id: string): ClassGroup | undefined {
    return this.classes.get(id);
  }

  getAllClasses(): ClassGroup[] {
    return Array.from(this.classes.values());
  }

  getClassesByGrade(gradeLevel: number): ClassGroup[] {
    return this.getAllClasses().filter(c => c.gradeLevel === gradeLevel);
  }

  getTotalHoursForClass(classId: string): number {
    const classGroup = this.getClass(classId);
    if (!classGroup) return 0;
    
    return classGroup.subjectRequirements.reduce(
      (total, req) => total + req.hoursPerWeek, 
      0
    );
  }

  validateClass(classGroup: ClassGroup): string[] {
    const errors: string[] = [];
    
    if (!classGroup.id || classGroup.id.trim() === '') {
      errors.push('Class ID is required');
    }
    
    if (!classGroup.name || classGroup.name.trim() === '') {
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
    
    classGroup.subjectRequirements.forEach((req, index) => {
      if (!req.subject || req.subject.trim() === '') {
        errors.push(`Subject requirement ${index + 1}: subject name is required`);
      }
      if (req.hoursPerWeek <= 0) {
        errors.push(`Subject requirement ${index + 1}: hours per week must be positive`);
      }
    });
    
    return errors;
  }
}