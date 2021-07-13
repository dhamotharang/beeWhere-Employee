import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RegisterBlePage } from './register-ble.page';

describe('RegisterBlePage', () => {
  let component: RegisterBlePage;
  let fixture: ComponentFixture<RegisterBlePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterBlePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterBlePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
