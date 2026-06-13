import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerLibrosAdmin } from './ver-libros-admin';

describe('VerLibrosAdmin', () => {
  let component: VerLibrosAdmin;
  let fixture: ComponentFixture<VerLibrosAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerLibrosAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(VerLibrosAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
