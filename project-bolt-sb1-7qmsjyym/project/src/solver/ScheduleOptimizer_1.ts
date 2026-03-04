import { Schedule, Teacher, ClassGroup, Assignment } from '../models';

export interface OptimizationMetrics {
  teacherWorkloadBalance: number; // איזון עומס מורות
  preferencesSatisfaction: number; // שביעות רצון מהעדפות
  scheduleCompactness: number; // צפיפות מערכת השעות
  totalScore: number;
}

export class ScheduleOptimizer {
  
  /**
   * אופטימיזציה של מערכת שעות קיימת
   */
  optimizeSchedule(
    schedule: Schedule,
    teachers: Teacher[],
    classes: ClassGroup[]
  ): Schedule {
    let currentSchedule = this.cloneSchedule(schedule);
    let bestSchedule = this.cloneSchedule(schedule);
    let bestScore = this.evaluateSchedule(bestSchedule, teachers, classes).totalScore;

    // Local Search עם Hill Climbing
    for (let iteration = 0; iteration < 1000; iteration++) {
      const neighbor = this.generateNeighbor(currentSchedule, teachers, classes);
      
      if (neighbor) {
        const neighborScore = this.evaluateSchedule(neighbor, teachers, classes).totalScore;
        
        if (neighborScore > bestScore) {
          bestSchedule = neighbor;
          bestScore = neighborScore;
          currentSchedule = neighbor;
        } else {
          // Simulated Annealing - קבלת פתרון גרוע לפעמים
          const temperature = Math.max(0.1, 1.0 - iteration / 1000);
          const probability = Math.exp((neighborScore - bestScore) / temperature);
          
          if (Math.random() < probability) {
            currentSchedule = neighbor;
          }
        }
      }
    }

    return bestSchedule;
  }

  /**
   * הערכת איכות מערכת שעות
   */
  evaluateSchedule(
    schedule: Schedule,
    teachers: Teacher[],
    classes: ClassGroup[]
  ): OptimizationMetrics {
    const workloadBalance = this.calculateWorkloadBalance(schedule, teachers);
    const preferencesSatisfaction = this.calculatePreferencesSatisfaction(schedule, teachers);
    const compactness = this.calculateScheduleCompactness(schedule, classes);

    const totalScore = (
      workloadBalance * 0.4 +
      preferencesSatisfaction * 0.3 +
      compactness * 0.3
    );

    return {
      teacherWorkloadBalance: workloadBalance,
      preferencesSatisfaction: preferencesSatisfaction,
      scheduleCompactness: compactness,
      totalScore
    };
  }

  /**
   * חישוב איזון עומס מורות
   */
  private calculateWorkloadBalance(schedule: Schedule, teachers: Teacher[]): number {
    const workloads = teachers.map(teacher => 
      schedule.getAssignmentsForTeacher(teacher.id).length
    );

    if (workloads.length === 0) return 0;

    const average = workloads.reduce((sum, w) => sum + w, 0) / workloads.length;
    const variance = workloads.reduce((sum, w) => sum + Math.pow(w - average, 2), 0) / workloads.length;
    
    // ציון גבוה יותר לשונות נמוכה יותר
    return Math.max(0, 1 - variance / (average + 1));
  }

  /**
   * חישוב שביעות רצון מהעדפות מורות
   */
  private calculatePreferencesSatisfaction(schedule: Schedule, teachers: Teacher[]): number {
    let satisfiedPreferences = 0;
    let totalPreferences = 0;

    teachers.forEach(teacher => {
      if (teacher.preferredDayOff !== undefined) {
        totalPreferences++;
        const assignmentsOnPreferredDayOff = schedule.getAssignmentsForTeacher(teacher.id)
          .filter(a => a.timeSlot.day === teacher.preferredDayOff);
        
        if (assignmentsOnPreferredDayOff.length === 0) {
          satisfiedPreferences++;
        }
      }
    });

    return totalPreferences > 0 ? satisfiedPreferences / totalPreferences : 1;
  }

  /**
   * חישוב צפיפות מערכת השעות
   */
  private calculateScheduleCompactness(schedule: Schedule, classes: ClassGroup[]): number {
    let totalCompactness = 0;

    classes.forEach(classGroup => {
      const assignments = schedule.getAssignmentsForClass(classGroup.id);
      const dayGroups = new Map<number, Assignment[]>();

      // קיבוץ לפי ימים
      assignments.forEach(assignment => {
        const day = assignment.timeSlot.day;
        if (!dayGroups.has(day)) {
          dayGroups.set(day, []);
        }
        dayGroups.get(day)!.push(assignment);
      });

      // חישוב צפיפות לכל יום
      dayGroups.forEach(dayAssignments => {
        if (dayAssignments.length > 1) {
          const hours = dayAssignments.map(a => a.timeSlot.hour).sort((a, b) => a - b);
          const span = hours[hours.length - 1] - hours[0] + 1;
          const density = dayAssignments.length / span;
          totalCompactness += density;
        }
      });
    });

    return totalCompactness / classes.length;
  }

  /**
   * יצירת שכן (neighbor) למערכת שעות
   */
  private generateNeighbor(
    schedule: Schedule,
    teachers: Teacher[],
    classes: ClassGroup[]
  ): Schedule | null {
    const newSchedule = this.cloneSchedule(schedule);
    const assignments = newSchedule.getAllAssignments();

    if (assignments.length < 2) return null;

    // בחירת שני שיבוצים אקראיים
    const index1 = Math.floor(Math.random() * assignments.length);
    let index2 = Math.floor(Math.random() * assignments.length);
    while (index2 === index1) {
      index2 = Math.floor(Math.random() * assignments.length);
    }

    const assignment1 = assignments[index1];
    const assignment2 = assignments[index2];

    // החלפת זמנים
    const tempTimeSlot = assignment1.timeSlot;
    assignment1.timeSlot = assignment2.timeSlot;
    assignment2.timeSlot = tempTimeSlot;

    // בדיקת תקינות
    if (newSchedule.hasConflict(assignment1) || newSchedule.hasConflict(assignment2)) {
      return null;
    }

    return newSchedule;
  }

  /**
   * שכפול מערכת שעות
   */
  private cloneSchedule(schedule: Schedule): Schedule {
    const newSchedule = new Schedule({
      maxDaysPerWeek: 5,
      maxHoursPerDay: 8,
      workingDays: [0, 1, 2, 3, 4]
    });

    schedule.getAllAssignments().forEach(assignment => {
      newSchedule.addAssignment({
        teacherId: assignment.teacherId,
        classId: assignment.classId,
        subject: assignment.subject,
        timeSlot: { ...assignment.timeSlot }
      });
    });

    return newSchedule;
  }
}