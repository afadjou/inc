import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnComponent } from './rn.component';

describe('RnComponent', () => {
  let component: RnComponent;
  let fixture: ComponentFixture<RnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
