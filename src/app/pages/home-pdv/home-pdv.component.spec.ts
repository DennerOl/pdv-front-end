import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePdvComponent } from './home-pdv.component';

describe('HomePdvComponent', () => {
  let component: HomePdvComponent;
  let fixture: ComponentFixture<HomePdvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomePdvComponent]
    });
    fixture = TestBed.createComponent(HomePdvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
