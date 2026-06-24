import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TccCreate } from './tcc-create';

describe('TccCreate', () => {
  let component: TccCreate;
  let fixture: ComponentFixture<TccCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TccCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(TccCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
