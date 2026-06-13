import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarLibro } from './eliminar-libro';

describe('EliminarLibro', () => {
  let component: EliminarLibro;
  let fixture: ComponentFixture<EliminarLibro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EliminarLibro],
    }).compileComponents();

    fixture = TestBed.createComponent(EliminarLibro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
