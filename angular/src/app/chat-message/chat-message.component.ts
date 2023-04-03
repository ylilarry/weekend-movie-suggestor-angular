import { AfterViewChecked, Component, Input, OnChanges } from "@angular/core";
import { ChatMessage } from "src/app/chat-history.service";
import { format, formatDistance, formatRelative, subDays } from "date-fns";

@Component({
  selector: "app-chat-message",
  templateUrl: "./chat-message.component.html",
  styleUrls: ["./chat-message.component.scss"],
})
export class ChatMessageComponent implements OnChanges {
  @Input()
  data!: ChatMessage;

  @Input()
  isTyping = false;

  isTypingDots = 0;
  get isTypingText() {
    return this.isTyping
      ? `${this.data.user} is typing.` +
          Array(this.isTypingDots).fill(".").join("")
      : "";
  }

  chatTime(timestamp: number): string {
    if (this.isTyping) {
      return "now";
    }
    return formatDistance(new Date(timestamp), new Date(), { addSuffix: true });
  }

  async ngOnChanges() {
    while (this.isTyping) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      this.isTypingDots = (this.isTypingDots + 1) % 4;
    }
  }
}
