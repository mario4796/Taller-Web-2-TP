import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerOfertas } from './ver-ofertas';

describe('VerOfertas', () => {
  let component: VerOfertas;
  let fixture: ComponentFixture<VerOfertas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerOfertas],
    }).compileComponents();

    fixture = TestBed.createComponent(VerOfertas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
