import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobiliariosComponent } from './mobiliarios.component';

describe('MobiliariosComponent', () => {
  let component: MobiliariosComponent;
  let fixture: ComponentFixture<MobiliariosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MobiliariosComponent]
    });
    fixture = TestBed.createComponent(MobiliariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
