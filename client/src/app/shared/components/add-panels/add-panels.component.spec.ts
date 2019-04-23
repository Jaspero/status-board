import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddPanelsComponent} from './add-panels.component';

describe('AddPanelsComponent', () => {
  let component: AddPanelsComponent;
  let fixture: ComponentFixture<AddPanelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddPanelsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPanelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
