import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MemberPushPanelComponent} from './member-push-panel.component';

describe('MemberPushPanelComponent', () => {
  let component: MemberPushPanelComponent;
  let fixture: ComponentFixture<MemberPushPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MemberPushPanelComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberPushPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
