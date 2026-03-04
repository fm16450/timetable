import { Schedule, Teacher, ClassGroup, Assignment } from '../models';

export interface ExportOptions {
  format: 'json' | 'csv' | 'html';
  includeTeacherView: boolean;
  includeClassView: boolean;
  workingDays: string[];
  timeSlots: string[];
}

export class ScheduleExporter {
  
  /**
   * ייצוא מערכת שעות לפורמטים שונים
   */
  exportSchedule(
    schedule: Schedule,
    teachers: Teacher[],
    classes: ClassGroup[],
    options: ExportOptions
  ): string {
    switch (options.format) {
      case 'json':
        return this.exportToJSON(schedule, teachers, classes, options);
      case 'csv':
        return this.exportToCSV(schedule, teachers, classes, options);
      case 'html':
        return this.exportToHTML(schedule, teachers, classes, options);
      default:
        throw new Error(`Unsupported format: ${options.format}`);
    }
  }

  /**
   * ייצוא ל-JSON
   */
  private exportToJSON(
    schedule: Schedule,
    teachers: Teacher[],
    classes: ClassGroup[],
    options: ExportOptions
  ): string {
    const data = {
      metadata: {
        exportDate: new Date().toISOString(),
        totalAssignments: schedule.getAllAssignments().length,
        teachers: teachers.length,
        classes: classes.length
      },
      assignments: schedule.getAllAssignments(),
      teacherView: options.includeTeacherView ? this.generateTeacherView(schedule, teachers, options) : null,
      classView: options.includeClassView ? this.generateClassView(schedule, classes, options) : null
    };

    return JSON.stringify(data, null, 2);
  }

  /**
   * ייצוא ל-CSV
   */
  private exportToCSV(
    schedule: Schedule,
    teachers: Teacher[],
    classes: ClassGroup[],
    options: ExportOptions
  ): string {
    const assignments = schedule.getAllAssignments();
    const headers = ['Teacher ID', 'Teacher Name', 'Class ID', 'Class Name', 'Subject', 'Day', 'Hour'];
    
    let csv = headers.join(',') + '\n';
    
    assignments.forEach(assignment => {
      const teacher = teachers.find(t => t.id === assignment.teacherId);
      const classGroup = classes.find(c => c.id === assignment.classId);
      
      const row = [
        assignment.teacherId,
        teacher?.name || 'Unknown',
        assignment.classId,
        classGroup?.name || 'Unknown',
        assignment.subject,
        options.workingDays[assignment.timeSlot.day] || assignment.timeSlot.day,
        options.timeSlots[assignment.timeSlot.hour] || assignment.timeSlot.hour
      ];
      
      csv += row.map(field => `"${field}"`).join(',') + '\n';
    });

    return csv;
  }

  /**
   * ייצוא ל-HTML
   */
  private exportToHTML(
    schedule: Schedule,
    teachers: Teacher[],
    classes: ClassGroup[],
    options: ExportOptions
  ): string {
    let html = `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>מערכת שעות</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
        th { background-color: #f2f2f2; }
        .teacher-schedule { margin-bottom: 40px; }
        .class-schedule { margin-bottom: 40px; }
        h1, h2, h3 { color: #333; }
    </style>
</head>
<body>
    <h1>מערכת שעות שבועית</h1>
    <p>נוצר בתאריך: ${new Date().toLocaleDateString('he-IL')}</p>
`;

    if (options.includeTeacherView) {
      html += this.generateTeacherViewHTML(schedule, teachers, options);
    }

    if (options.includeClassView) {
      html += this.generateClassViewHTML(schedule, classes, options);
    }

    html += '</body></html>';
    return html;
  }

  /**
   * יצירת תצוגת מורות
   */
  private generateTeacherView(
    schedule: Schedule,
    teachers: Teacher[],
    options: ExportOptions
  ): any {
    return teachers.map(teacher => {
      const assignments = schedule.getAssignmentsForTeacher(teacher.id);
      const weeklySchedule: { [key: string]: Assignment[] } = {};

      options.workingDays.forEach((day, index) => {
        weeklySchedule[day] = assignments.filter(a => a.timeSlot.day === index);
      });

      return {
        teacherId: teacher.id,
        teacherName: teacher.name,
        totalHours: assignments.length,
        weeklySchedule
      };
    });
  }

  /**
   * יצירת תצוגת כיתות
   */
  private generateClassView(
    schedule: Schedule,
    classes: ClassGroup[],
    options: ExportOptions
  ): any {
    return classes.map(classGroup => {
      const assignments = schedule.getAssignmentsForClass(classGroup.id);
      const weeklySchedule: { [key: string]: Assignment[] } = {};

      options.workingDays.forEach((day, index) => {
        weeklySchedule[day] = assignments.filter(a => a.timeSlot.day === index);
      });

      return {
        classId: classGroup.id,
        className: classGroup.name,
        gradeLevel: classGroup.gradeLevel,
        totalHours: assignments.length,
        weeklySchedule
      };
    });
  }

  /**
   * יצירת HTML לתצוגת מורות
   */
  private generateTeacherViewHTML(
    schedule: Schedule,
    teachers: Teacher[],
    options: ExportOptions
  ): string {
    let html = '<h2>מערכת שעות לפי מורות</h2>';

    teachers.forEach(teacher => {
      const assignments = schedule.getAssignmentsForTeacher(teacher.id);
      
      html += `
        <div class="teacher-schedule">
          <h3>${teacher.name} (${assignments.length} שעות)</h3>
          <table>
            <tr>
              <th>שעה</th>
              ${options.workingDays.map(day => `<th>${day}</th>`).join('')}
            </tr>
      `;

      for (let hour = 0; hour < options.timeSlots.length; hour++) {
        html += '<tr>';
        html += `<td>${options.timeSlots[hour]}</td>`;
        
        options.workingDays.forEach((_, dayIndex) => {
          const assignment = assignments.find(a => 
            a.timeSlot.day === dayIndex && a.timeSlot.hour === hour
          );
          
          if (assignment) {
            const classGroup = schedule.getAllAssignments().find(a => a.classId === assignment.classId);
            html += `<td>${assignment.subject}<br><small>${assignment.classId}</small></td>`;
          } else {
            html += '<td>-</td>';
          }
        });
        
        html += '</tr>';
      }

      html += '</table></div>';
    });

    return html;
  }

  /**
   * יצירת HTML לתצוגת כיתות
   */
  private generateClassViewHTML(
    schedule: Schedule,
    classes: ClassGroup[],
    options: ExportOptions
  ): string {
    let html = '<h2>מערכת שעות לפי כיתות</h2>';

    classes.forEach(classGroup => {
      const assignments = schedule.getAssignmentsForClass(classGroup.id);
      
      html += `
        <div class="class-schedule">
          <h3>כיתה ${classGroup.name} (${assignments.length} שעות)</h3>
          <table>
            <tr>
              <th>שעה</th>
              ${options.workingDays.map(day => `<th>${day}</th>`).join('')}
            </tr>
      `;

      for (let hour = 0; hour < options.timeSlots.length; hour++) {
        html += '<tr>';
        html += `<td>${options.timeSlots[hour]}</td>`;
        
        options.workingDays.forEach((_, dayIndex) => {
          const assignment = assignments.find(a => 
            a.timeSlot.day === dayIndex && a.timeSlot.hour === hour
          );
          
          if (assignment) {
            const teacher = schedule.getAllAssignments().find(a => a.teacherId === assignment.teacherId);
            html += `<td>${assignment.subject}<br><small>${assignment.teacherId}</small></td>`;
          } else {
            html += '<td>-</td>';
          }
        });
        
        html += '</tr>';
      }

      html += '</table></div>';
    });

    return html;
  }
}