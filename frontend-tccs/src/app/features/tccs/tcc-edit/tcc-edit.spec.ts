import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TccEdit } from './tcc-edit';

describe('TccEdit', () => {
  let component: TccEdit;
  let fixture: ComponentFixture<TccEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TccEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(TccEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
