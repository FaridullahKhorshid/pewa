import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FooterComponent} from './footer.component';
import {MdbModalService} from "mdb-angular-ui-kit/modal";
import {AuthService} from "../../services/auth.service";
import {OverlayModule} from "@angular/cdk/overlay";
import {HttpClientModule} from "@angular/common/http";

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FooterComponent],
      providers: [MdbModalService, AuthService],
      imports: [OverlayModule, HttpClientModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have side floating buttons', () => {
    const div = document.querySelector('.side-buttons');
    expect(div?.innerHTML).toContain('button');
  });
});
