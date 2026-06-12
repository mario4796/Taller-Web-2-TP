import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveedorRecomendacion } from './proveedor-recomendacion';

describe('RecomendarLibro', () => {
  let component: ProveedorRecomendacion;
  let fixture: ComponentFixture<ProveedorRecomendacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProveedorRecomendacion],
    }).compileComponents();

    fixture = TestBed.createComponent(ProveedorRecomendacion);
    component = fixture.componentInstance;ProveedorRecomendacion
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
