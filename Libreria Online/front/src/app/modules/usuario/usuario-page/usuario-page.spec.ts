import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioPage } from './usuario-page';

describe('UsuarioPage', () => {
  let component: UsuarioPage;
  let fixture: ComponentFixture<UsuarioPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioPage],
    }).compileComponents();

    fixture = TestBed.createComponent(UsuarioPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
