import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectsToTeacherComponent } from './subjects-to-teacher.component';

describe('SubjectsToTeacherComponent', () => {
  let component: SubjectsToTeacherComponent;
  let fixture: ComponentFixture<SubjectsToTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectsToTeacherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectsToTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
