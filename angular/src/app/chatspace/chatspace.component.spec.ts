import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatspaceComponent } from './chatspace.component';

describe('ChatspaceComponent', () => {
  let component: ChatspaceComponent;
  let fixture: ComponentFixture<ChatspaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatspaceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
