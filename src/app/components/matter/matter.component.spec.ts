import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatterComponent } from './matter.component';

describe('MatterComponent', () => {
  let component: MatterComponent;
  let fixture: ComponentFixture<MatterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
