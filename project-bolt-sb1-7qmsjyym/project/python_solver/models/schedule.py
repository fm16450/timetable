from typing import List, Dict, Optional
from dataclasses import dataclass


@dataclass
class TimeSlot:
    _day: int  # 0-6 (ראשון-שבת)
    _hour: int  # 0-39 (40 שעות שבועיות מקסימום)


@dataclass
class Assignment:
    teacher_id: str
    class_id: str
    subject: str
    time_slot: TimeSlot


@dataclass
class ScheduleConstraints:
    max_days_per_week: int
    max_hours_per_day: int
    working_days: List[int]


class Schedule:
    def __init__(self, constraints: ScheduleConstraints):
        self.assignments: List[Assignment] = []
        self.constraints = constraints

    def add_assignment(self, assignment: Assignment) -> bool:
        """הוספת שיבוץ לאחר בדיקת התנגשויות"""
        if self.has_conflict(assignment):
            return False

        self.assignments.append(assignment)
        return True

    def remove_assignment(self, assignment: Assignment):
        """הסרת שיבוץ"""
        self.assignments = [
            a for a in self.assignments
            if not (a.teacher_id == assignment.teacher_id and
                    a.class_id == assignment.class_id and
                    a.time_slot._day == assignment.time_slot._day and
                    a.time_slot._hour == assignment.time_slot._hour)
        ]

    def has_conflict(self, new_assignment: Assignment) -> bool:
        """בדיקת התנגשויות"""
        for existing in self.assignments:
            same_time = (existing.time_slot._day == new_assignment.time_slot._day and
                         existing.time_slot._hour == new_assignment.time_slot._hour)

            if not same_time:
                continue

            # מורה לא יכולה להיות בשני מקומות
            if existing.teacher_id == new_assignment.teacher_id:
                return True

            # כיתה לא יכולה להיות עם שני מורים
            if existing.class_id == new_assignment.class_id:
                return True

        return False

    def get_assignments_for_teacher(self, teacher_id: str) -> List[Assignment]:
        return [a for a in self.assignments if a.teacher_id == teacher_id]

    def get_assignments_for_class(self, class_id: str) -> List[Assignment]:
        return [a for a in self.assignments if a.class_id == class_id]

    def get_assignments_for_time_slot(self, time_slot: TimeSlot) -> List[Assignment]:
        return [
            a for a in self.assignments
            if a.time_slot._day == time_slot._day and a.time_slot._hour == time_slot._hour
        ]

    def get_all_assignments(self) -> List[Assignment]:
        return self.assignments.copy()

    def get_teacher_hours_per_day(self, teacher_id: str, _day: int) -> int:
        return len([
            a for a in self.assignments
            if a.teacher_id == teacher_id and a.time_slot._day == _day
        ])

    def get_class_hours_per_day(self, class_id: str, _day: int) -> int:
        return len([
            a for a in self.assignments
            if a.class_id == class_id and a.time_slot._day == _day
        ])

    def has_gaps_in_schedule(self, class_id: str, _day: int) -> bool:
        """בדיקה האם יש חורים במערכת השעות של כיתה ביום מסוים"""
        day_assignments = [
            a for a in self.assignments
            if a.class_id == class_id and a.time_slot._day == _day
        ]

        if len(day_assignments) <= 1:
            return False  # אין חורים אם יש שיעור אחד או פחות

        # מיון לפי שעות
        hours = sorted([a.time_slot._hour for a in day_assignments])

        # בדיקה האם יש רווחים בין השעות
        for i in range(len(hours) - 1):
            gap = hours[i + 1] - hours[i]
            if gap > 1:  # יש רווח של יותר משעה אחת
                return True

        return False

    def get_schedule_gaps(self) -> Dict[str, List[int]]:
        """החזרת כל החורים במערכת לפי כיתות וימים"""
        gaps = {}

        # קבלת כל הכיתות הייחודיות
        class_ids = set(a.class_id for a in self.assignments)

        for class_id in class_ids:
            class_gaps = []
            for day in self.constraints.working_days:
                if self.has_gaps_in_schedule(class_id, day):
                    class_gaps.append(day)

            if class_gaps:
                gaps[class_id] = class_gaps

        return gaps

    def validate_schedule(self) -> List[str]:
        """בדיקת תקינות מערכת השעות"""
        errors = []

        # בדיקת התנגשויות
        for i, assignment1 in enumerate(self.assignments):
            for j, assignment2 in enumerate(self.assignments[i + 1:], i + 1):
                if self.has_conflict(assignment1):
                    errors.append(f'Conflict detected between assignments {i} and {j}')

        # בדיקת חורים במערכת
        gaps = self.get_schedule_gaps()
        for class_id, gap_days in gaps.items():
            for day in gap_days:
                errors.append(f'Class {class_id} has gaps in schedule on day {day}')

        return errors

    def clear(self):
        """ניקוי כל השיבוצים"""
        self.assignments = []
