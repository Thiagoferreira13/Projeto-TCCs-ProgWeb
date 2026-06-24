import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TccForm } from './tcc-form';

describe('TccForm', () => {
  let component: TccForm;
  let fixture: ComponentFixture<TccForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TccForm],
    }).compileComponents();

    fixture = TestBed.createComponent(TccForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
