import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

export type ChatSuggestion = {
  label: string;
  message: string;
};

const suggestions: ChatSuggestion[] = [
  { label: "Family", message: "What's a good movie to watch with family?" },
  { label: "Sci-Fi", message: "I want to watch a Sci-Fi." },
  { label: "Horror", message: "Tell me a good horror movie." },
  {
    label: "Movie night with boy/girlfriend",
    message: "I want to watch a movie with my boy/girlfriend.",
  },
];

@Injectable({
  providedIn: "root",
})
export class ChatSuggestionService {
  constructor() {}

  suggestions = new BehaviorSubject(suggestions);

  getChatSuggestions(): Observable<ChatSuggestion[]> {
    return this.suggestions;
  }

  load() {
    this.suggestions.next(suggestions);
  }
}
