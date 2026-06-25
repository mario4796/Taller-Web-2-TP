import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';

import { OfertasLibroService } from '../../../../api/services/ofertas-libro/ofertas-libro.service';
import { Estadisticas } from './estadisticas';

describe('Estadisticas', () => {
  let component: Estadisticas;
  let fixture: ComponentFixture<Estadisticas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Estadisticas],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        MessageService,
        {
          provide: OfertasLibroService,
          useValue: {
            listOfertas: () => of([]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Estadisticas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
