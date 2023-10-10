import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardExamensComponent } from './dashboard-examens.component';

describe('DashboardExamensComponent', () => {
  let component: DashboardExamensComponent;
  let fixture: ComponentFixture<DashboardExamensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardExamensComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardExamensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
