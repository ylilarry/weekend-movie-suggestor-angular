import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, map, retry } from "rxjs";
import { chatServerUrl } from "src/app/config";
import { MovieCarouselService } from "src/app/movie-carousel.service";

export type ChatMessage = {
  user: "You" | "ChatGPT" | "System";
  timestamp: number;
  avatar?: string;
  message: string;
};

type ChatServerMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};
type ChatServerRequestBody = {
  messages: ChatServerMessage[];
};
type ChatServerResponseBody = {
  message: ChatServerMessage;
};

@Injectable({
  providedIn: "root",
})
export class ChatHistoryService {
  constructor(
    private http: HttpClient,
    private movieCarouselService: MovieCarouselService
  ) {}
  historySubject = new BehaviorSubject<ChatMessage[]>([]);
  chatBotIsTyping = new BehaviorSubject<boolean>(false);
  chatHistory: ChatMessage[] = [];

  private addMessage(message: ChatMessage) {
    this.chatHistory.push(message);
    this.historySubject.next([message]);
  }

  async load(): Promise<void> {
    if (this.historySubject.value.length == 0) {
      this.addMessage({
        user: "ChatGPT",
        timestamp: Date.now(),
        avatar: "https://i.pravatar.cc/300",
        message: "Hi, I'm a movie expert. How can I help you?",
      });
    }
  }

  async pushMessage(message: string): Promise<void> {
    this.addMessage({
      user: "You",
      timestamp: Date.now(),
      avatar: "https://i.pravatar.cc/300",
      message,
    });

    const body = this.prepareRequestBody();

    for (let tries = 0; tries < 3; tries++) {
      try {
        this.chatBotIsTyping.next(true);
        const response = await fetch(chatServerUrl, {
          method: "POST",
          body: JSON.stringify(body),
        });
        this.chatBotIsTyping.next(false);
        const responseBody: ChatServerResponseBody = await response.json();
        this.addMessage({
          user: { user: "You", system: "System", assistant: "ChatGPT" }[
            responseBody.message.role
          ] as ChatMessage["user"],
          timestamp: Date.now(),
          message: responseBody.message.content,
        });
        let movies = await this.askForJsonResponse();
        if (movies.length > 0) {
          await this.movieCarouselService.load(movies);
        }
        break;
      } catch (e) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        continue;
      }
    }
  }

  getHistory(): BehaviorSubject<ChatMessage[]> {
    return this.historySubject;
  }

  getChatbotTyping(): BehaviorSubject<boolean> {
    return this.chatBotIsTyping;
  }

  private prepareRequestBody(start: number = 0): ChatServerRequestBody {
    const body: ChatServerRequestBody = {
      messages: [],
    };
    for (const message of this.chatHistory.slice(start)) {
      body.messages.push({
        role: { You: "user", ChatGPT: "assistant", System: "system" }[
          message.user
        ] as ChatServerMessage["role"],
        content: message.message,
      });
    }
    return body;
  }

  async askForJsonResponse(): Promise<string[]> {
    const body = this.prepareRequestBody(-1);
    body.messages.push({
      role: "user",
      content:
        'Give a json array containing the movie names you just mentioned. Wrap the array between $$$, like this: $$$["Movie A", "Movie B"]$$$.',
    });
    for (let tries = 0; tries < 3; tries++) {
      try {
        const response = await fetch(chatServerUrl, {
          method: "POST",
          body: JSON.stringify(body),
        });
        const responseBody: ChatServerResponseBody = await response.json();
        let match = responseBody.message.content.match(/\$\$\$([\s\S]+)\$\$\$/);
        if (match) {
          match = match[1].match(/\[([\s\S]+)\]/);
        }
        if (match) {
          let json = `[${match[1]}]`;
          let movies = JSON.parse(json);
          for (let i = 0; i < movies.length; i++) {
            movies[i] = movies[i].replace(/\(\d+-?\d*\)/g, "");
          }
          console.log(movies);
          return movies;
        }
        break;
      } catch (e) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        continue;
      }
    }
    return [];
  }
}
