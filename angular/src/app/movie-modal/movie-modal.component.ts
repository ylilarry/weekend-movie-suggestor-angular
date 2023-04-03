import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import {
  animation,
  style,
  animate,
  trigger,
  transition,
  useAnimation,
} from "@angular/animations";
import { AnimationBuilder } from "@angular/animations";
import { BreakpointObserver } from "@angular/cdk/layout";

export const transitionAnimation = animation([
  style({
    height: "{{ height }}",
    width: "{{ width }}",
    top: "{{ top }}",
    left: "{{ left }}",
    opacity: "{{ opacity }}",
  }),
  animate("{{ time }}"),
]);

export const triggerAnimation = trigger("openClose", [
  transition("close => open", [
    useAnimation(transitionAnimation, {
      params: {
        height: 0,
        opacity: 1,
        backgroundColor: "red",
        time: "1s",
      },
    }),
  ]),
]);

@Component({
  selector: "app-movie-modal",
  templateUrl: "./movie-modal.component.html",
  styleUrls: ["./movie-modal.component.scss"],
})
export class MovieModalComponent {
  constructor(
    private animationBuilder: AnimationBuilder,
    private breakpointObserver: BreakpointObserver
  ) {}

  @ViewChild("contentEl")
  contentEl!: ElementRef<HTMLElement>;

  @ViewChild("backdropEl")
  backdropEl!: ElementRef<HTMLElement>;

  @Input()
  anchorEl: HTMLElement | null = null;

  @Input()
  show: boolean = false;

  @Input()
  onClose: (() => void) | null = null;

  // _open = true; // TODO: make this false
  // _showBackdrop = true; // TODO: make this false

  _open = false;
  _showBackdrop = false;

  ngOnChanges() {
    if (this.show && this.anchorEl && !this._open) {
      this._open = true;
      this._showBackdrop = true;
      this.playOpenAnimation(
        this.animationBuilder,
        this.anchorEl,
        this.contentEl.nativeElement,
        this.backdropEl.nativeElement
      );
    } else if (!this.show && this.anchorEl && this._open) {
      this._open = false;
      this.playCloseAnimation(
        this.animationBuilder,
        this.anchorEl,
        this.contentEl.nativeElement,
        this.backdropEl.nativeElement
      );
    }
  }

  get backdropStyle() {
    return {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      display: this._showBackdrop ? "block" : "none",
    };
  }

  useSingleColumnLayout() {
    return this.breakpointObserver.isMatched(`(max-width: 600px)`);
  }

  openContentStyleSingleColumn(contentEl: HTMLElement) {
    const em = parseFloat(getComputedStyle(contentEl).fontSize);
    let modalWidth = Math.min(80 * em, window.innerWidth);
    let modalHeight = Math.min(60 * em, window.innerHeight);
    if (this.breakpointObserver.isMatched(`(max-width: ${modalWidth}px)`)) {
      modalWidth = window.innerWidth;
      modalHeight = window.innerHeight;
    }
    const openContentStyle = {
      left: `${
        ((window.innerWidth - modalWidth) / 2 / window.innerWidth) * 100
      }%`,
      top: `${
        ((window.innerHeight - modalHeight) / 2 / window.innerHeight) * 100
      }%`,
      width: `${modalWidth}px`,
      height: `${modalHeight}px`,
      opacity: 1,
    };
    return openContentStyle;
  }

  openContentStyle(contentEl: HTMLElement) {
    const em = parseFloat(getComputedStyle(contentEl).fontSize);
    let modalWidth = Math.min(80 * em, window.innerWidth);
    let modalHeight = Math.min(60 * em, window.innerHeight);
    if (this.breakpointObserver.isMatched(`(max-width: ${modalWidth}px)`)) {
      modalWidth = window.innerWidth;
      modalHeight = (modalWidth / 2 / 2) * 3;
    }
    if (this.breakpointObserver.isMatched(`(max-height: ${modalHeight}px)`)) {
      modalHeight = Math.min(window.innerHeight, modalHeight);
      modalWidth = window.innerWidth;
    }
    const openContentStyle = {
      left: `${
        ((window.innerWidth - modalWidth) / 2 / window.innerWidth) * 100
      }%`,
      top: `${
        ((window.innerHeight - modalHeight) / 2 / window.innerHeight) * 100
      }%`,
      width: `${modalWidth}px`,
      height: `${modalHeight}px`,
      opacity: 1,
    };
    return openContentStyle;
  }

  playOpenAnimation(
    animationBuilder: AnimationBuilder,
    anchorEl: HTMLElement,
    contentEl: HTMLElement,
    backdropEl: HTMLElement
  ) {
    const openContentStyle = this.useSingleColumnLayout()
      ? this.openContentStyleSingleColumn(contentEl)
      : this.openContentStyle(contentEl);
    const contentAnimation = animationBuilder.build([
      style({
        top: anchorEl?.getBoundingClientRect().top + "px",
        left: anchorEl?.getBoundingClientRect().left + "px",
        width: anchorEl?.getBoundingClientRect().width + "px",
        height: anchorEl?.getBoundingClientRect().height + "px",
        opacity: 0,
      }),
      animate("300ms ease-in-out", style(openContentStyle)),
    ]);

    const backdropAnimation = animationBuilder.build([
      style({
        opacity: 0,
      }),
      animate(
        "300ms ease-in-out",
        style({
          opacity: 1,
        })
      ),
    ]);

    const contentAPlayer = contentAnimation.create(contentEl);
    const backdropAPlayer = backdropAnimation.create(backdropEl);

    contentAPlayer.play();
    backdropAPlayer.play();
  }

  playCloseAnimation(
    animationBuilder: AnimationBuilder,
    anchorEl: HTMLElement,
    contentEl: HTMLElement,
    backdropEl: HTMLElement
  ) {
    const contentAnimation = animationBuilder.build([
      style({
        top: contentEl?.getBoundingClientRect().top + "px",
        left: contentEl?.getBoundingClientRect().left + "px",
        width: contentEl?.getBoundingClientRect().width + "px",
        height: contentEl?.getBoundingClientRect().height + "px",
        opacity: 1,
      }),
      animate(
        "300ms ease-in-out",
        style({
          top: anchorEl?.getBoundingClientRect().top + "px",
          left: anchorEl?.getBoundingClientRect().left + "px",
          width: anchorEl?.getBoundingClientRect().width + "px",
          height: anchorEl?.getBoundingClientRect().height + "px",
          opacity: 0,
        })
      ),
    ]);

    const backdropAnimation = animationBuilder.build([
      style({
        opacity: 1,
      }),
      animate(
        "300ms ease-in-out",
        style({
          opacity: 0,
        })
      ),
    ]);

    const contentAPlayer = contentAnimation.create(contentEl);
    const backdropAPlayer = backdropAnimation.create(backdropEl);

    contentAPlayer.onDone(() => {
      this._showBackdrop = false;
    });

    contentAPlayer.play();
    backdropAPlayer.play();
  }
}
