import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadesAcademicas } from './unidades-academicas';

describe('UnidadesAcademicas', () => {
  let component: UnidadesAcademicas;
  let fixture: ComponentFixture<UnidadesAcademicas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnidadesAcademicas],
    }).compileComponents();

    fixture = TestBed.createComponent(UnidadesAcademicas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
