import { TestBed } from '@angular/core/testing';

import { ChatSuggestionService } from './chat-suggestion.service';

describe('ChatSuggestionService', () => {
  let service: ChatSuggestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatSuggestionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
