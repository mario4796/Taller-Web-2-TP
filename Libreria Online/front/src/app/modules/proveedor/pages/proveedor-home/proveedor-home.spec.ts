import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveedorHome } from './proveedor-home';

describe('ProveedorHome', () => {
  let component: ProveedorHome;
  let fixture: ComponentFixture<ProveedorHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProveedorHome],
    }).compileComponents();

    fixture = TestBed.createComponent(ProveedorHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
