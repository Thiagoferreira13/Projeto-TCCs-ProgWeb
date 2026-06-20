import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TccDeleteModal } from './tcc-delete-modal';

describe('TccDeleteModal', () => {
  let component: TccDeleteModal;
  let fixture: ComponentFixture<TccDeleteModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TccDeleteModal],
    }).compileComponents();

    fixture = TestBed.createComponent(TccDeleteModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
