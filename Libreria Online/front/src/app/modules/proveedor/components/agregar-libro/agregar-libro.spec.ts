import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarLibro } from './agregar-libro';

describe('AgregarLibro', () => {
  let component: AgregarLibro;
  let fixture: ComponentFixture<AgregarLibro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarLibro],
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarLibro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
