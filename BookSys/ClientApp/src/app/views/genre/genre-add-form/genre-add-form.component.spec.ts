import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenreAddFormComponent } from './genre-add-form.component';

describe('GenreAddFormComponent', () => {
  let component: GenreAddFormComponent;
  let fixture: ComponentFixture<GenreAddFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenreAddFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenreAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
