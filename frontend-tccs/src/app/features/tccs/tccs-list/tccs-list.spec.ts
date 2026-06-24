import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tccs } from './tccs-list';

describe('Tccs', () => {
  let component: Tccs;
  let fixture: ComponentFixture<Tccs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tccs],
    }).compileComponents();

    fixture = TestBed.createComponent(Tccs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
