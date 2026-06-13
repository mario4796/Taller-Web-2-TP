import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarLibro } from './actualizar-libro';

describe('ActualizarLibro', () => {
  let component: ActualizarLibro;
  let fixture: ComponentFixture<ActualizarLibro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualizarLibro],
    }).compileComponents();

    fixture = TestBed.createComponent(ActualizarLibro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
