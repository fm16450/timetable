import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSubjectToTeacherComponent } from './new-subject-to-teacher.component';

describe('NewSubjectToTeacherComponent', () => {
  let component: NewSubjectToTeacherComponent;
  let fixture: ComponentFixture<NewSubjectToTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewSubjectToTeacherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewSubjectToTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
