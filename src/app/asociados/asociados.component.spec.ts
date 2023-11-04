import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsociadosComponent } from './asociados.component';

describe('AsociadosComponent', () => {
  let component: AsociadosComponent;
  let fixture: ComponentFixture<AsociadosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AsociadosComponent]
    });
    fixture = TestBed.createComponent(AsociadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
