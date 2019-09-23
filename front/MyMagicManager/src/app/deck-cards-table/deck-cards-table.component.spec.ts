import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckCardsTableComponent } from './deck-cards-table.component';

describe('DeckCardsTableComponent', () => {
  let component: DeckCardsTableComponent;
  let fixture: ComponentFixture<DeckCardsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeckCardsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckCardsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
