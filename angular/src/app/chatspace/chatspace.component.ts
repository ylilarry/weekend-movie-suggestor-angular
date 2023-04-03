import {
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { ChatMessage, ChatHistoryService } from "src/app/chat-history.service";
import {
  ChatSuggestion,
  ChatSuggestionService,
} from "src/app/chat-suggestion.service";

@Component({
  selector: "app-chatspace",
  templateUrl: "./chatspace.component.html",
  styleUrls: ["./chatspace.component.scss"],
})
export class ChatspaceComponent {
  constructor(
    private chatHistoryService: ChatHistoryService,
    private chatSuggestionService: ChatSuggestionService
  ) {}
  chatMessages: ChatMessage[] = [];
  chatSuggestions: ChatSuggestion[] = [];

  @ViewChildren("messageEls")
  messageEls?: QueryList<ElementRef<HTMLElement>>;

  @ViewChild("chatHistoryEl")
  chatHistoryEl?: ElementRef<HTMLElement>;

  chatbotIsTyping = false;

  ngOnInit() {
    this.chatHistoryService.getHistory().subscribe((messages) => {
      this.chatMessages.push(...messages);
      setTimeout(() => {
        // if (this.messageEls && this.messageEls.length > 0) {
        //   const last = this.messageEls.toArray().at(-1);
        //   last?.nativeElement.scrollIntoView({
        //     behavior: "smooth",
        //     block: "end"
        //   });
        // }
        if (this.chatHistoryEl) {
          this.chatHistoryEl.nativeElement.scrollTo({
            left: 0,
            top: this.chatHistoryEl.nativeElement.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 100);
    });

    this.chatSuggestionService.getChatSuggestions().subscribe((suggestions) => {
      this.chatSuggestions = suggestions;
    });

    this.chatHistoryService.getChatbotTyping().subscribe((typing) => {
      this.chatbotIsTyping = typing;
    });

    this.chatSuggestionService.load();
    this.chatHistoryService.load();
  }

  onChatMessageSubmit(message: string) {
    this.chatHistoryService.pushMessage(message);
  }

  chatbotIsTypingMessage: ChatMessage = {
    user: "ChatGPT",
    message: "",
    timestamp: Date.now(),
  };

  onTextareaKeyDown(event: KeyboardEvent) {
    const textarea = event.target as HTMLTextAreaElement;
    const text = textarea.value.trim();
    if (text && event.key === "Enter" && !event.shiftKey) {
      this.onChatMessageSubmit(text);
      textarea.value = "";
    }
    // Prevent holding down enter and enters new lines
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
    }
  }
}
