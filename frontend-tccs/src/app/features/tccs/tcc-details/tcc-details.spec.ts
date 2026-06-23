import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TccDetails } from './tcc-details';

describe('TccDetails', () => {
  let component: TccDetails;
  let fixture: ComponentFixture<TccDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TccDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(TccDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
