from typing import List, Tuple
from dataclasses import dataclass


@dataclass
class TimeBlock:
    """בלוק זמן - 2 שיעורים + הפסקה"""
    start_hour: int  # שעת התחלה (0-based)
    lessons: List[int]  # רשימת שעות השיעורים בבלוק
    break_after: bool = True  # האם יש הפסקה אחרי הבלוק


class TimeStructure:
    """מבנה זמנים - 2 שיעורים רצופים ואז הפסקה"""

    def __init__(self, lesson_duration_minutes: int = 45,
                 break_duration_minutes: int = 15,
                 lessons_per_block: int = 2):
        self.lesson_duration = lesson_duration_minutes
        self.break_duration = break_duration_minutes
        self.lessons_per_block = lessons_per_block

    def create_daily_blocks(self, max_hours_per_day: int) -> List[TimeBlock]:
        """יצירת בלוקי זמן ליום"""
        blocks = []
        current_hour = 0

        while current_hour + self.lessons_per_block <= max_hours_per_day:
            # יצירת בלוק של 2 שיעורים
            lessons = list(range(current_hour, current_hour + self.lessons_per_block))

            # בדיקה האם זה הבלוק האחרון
            is_last_block = (current_hour + self.lessons_per_block * 2) > max_hours_per_day

            block = TimeBlock(
                start_hour=current_hour,
                lessons=lessons,
                break_after=not is_last_block  # אין הפסקה אחרי הבלוק האחרון
            )

            blocks.append(block)
            current_hour += self.lessons_per_block

        return blocks

    def get_valid_lesson_hours(self, max_hours_per_day: int) -> List[int]:
        """קבלת שעות תקינות לשיעורים (רק בתוך בלוקים)"""
        blocks = self.create_daily_blocks(max_hours_per_day)
        valid_hours = []

        for block in blocks:
            valid_hours.extend(block.lessons)

        return valid_hours

    def are_lessons_in_same_block(self, hour1: int, hour2: int,
                                  max_hours_per_day: int) -> bool:
        """בדיקה האם שני שיעורים באותו בלוק"""
        blocks = self.create_daily_blocks(max_hours_per_day)

        for block in blocks:
            if hour1 in block.lessons and hour2 in block.lessons:
                return True

        return False

    def get_block_for_hour(self, hour: int, max_hours_per_day: int) -> TimeBlock:
        """קבלת הבלוק שמכיל שעה מסוימת"""
        blocks = self.create_daily_blocks(max_hours_per_day)

        for block in blocks:
            if hour in block.lessons:
                return block

        return None

    def validate_lesson_continuity(self, class_lessons: List[int],
                                   max_hours_per_day: int) -> bool:
        """בדיקה שהשיעורים רצופים בתוך בלוקים"""
        if not class_lessons:
            return True

        blocks = self.create_daily_blocks(max_hours_per_day)
        sorted_lessons = sorted(class_lessons)

        # בדיקה שכל שיעור נמצא בבלוק תקין
        for lesson_hour in sorted_lessons:
            block = self.get_block_for_hour(lesson_hour, max_hours_per_day)
            if not block:
                return False

        # בדיקה שאין חורים בתוך בלוקים
        for block in blocks:
            block_lessons = [h for h in sorted_lessons if h in block.lessons]
            if len(block_lessons) > 0:
                # אם יש שיעורים בבלוק, הם חייבים להיות רצופים
                expected_lessons = list(range(min(block_lessons), max(block_lessons) + 1))
                if block_lessons != expected_lessons:
                    return False

        return True
