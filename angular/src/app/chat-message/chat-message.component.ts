import { Component, Input } from "@angular/core";
import { ChatMessage } from "src/app/chat-history.service";

@Component({
  selector: "app-chat-message",
  templateUrl: "./chat-message.component.html",
  styleUrls: ["./chat-message.component.scss"],
})
export class ChatMessageComponent {
  @Input()
  data!: ChatMessage;
}
