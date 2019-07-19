import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookUpdateFormComponent } from './book-update-form.component';

describe('BookUpdateFormComponent', () => {
  let component: BookUpdateFormComponent;
  let fixture: ComponentFixture<BookUpdateFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookUpdateFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookUpdateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
