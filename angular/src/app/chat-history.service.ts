import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export type ChatMessage = {
  user: string;
  timestamp: string;
  avatar: string;
  message: string;
};

@Injectable({
  providedIn: "root",
})
export class ChatHistoryService {
  history = new BehaviorSubject<ChatMessage[]>([]);

  async load(): Promise<void> {
    if (this.history.value.length == 0) {
      this.history.next([
        {
          user: "ChatGPT",
          timestamp: new Date().toISOString(),
          avatar: "https://i.pravatar.cc/300",
          message: "Hi, I'm a movie expert. How can I help you?",
        },
      ]);
    }
    // for (let i = 0; i < 5; i++) {
    //   this.movies.next(movies);
    //   await new Promise<void>((resolve) => setTimeout(resolve, 1000));
    // }
  }

  pushMessage(message: string): void {
    this.history.next([
      {
        user: "You",
        timestamp: new Date().toISOString(),
        avatar: "https://i.pravatar.cc/300",
        message,
      },
    ]);
  }

  getHistory(): BehaviorSubject<ChatMessage[]> {
    return this.history;
  }

  constructor() {}
}
