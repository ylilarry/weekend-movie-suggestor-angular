import { Component, Input } from "@angular/core";
import { ChatHistoryService } from "src/app/chat-history.service";
import { ChatSuggestion } from "src/app/chat-suggestion.service";

@Component({
  selector: "app-chat-suggestion",
  templateUrl: "./chat-suggestion.component.html",
  styleUrls: ["./chat-suggestion.component.scss"],
})
export class ChatSuggestionComponent {
  constructor(private chatHistoryService: ChatHistoryService) {}
  @Input()
  data!: ChatSuggestion;

  onClick(event: MouseEvent) {
    this.chatHistoryService.pushMessage(this.data.message);
  }
}
