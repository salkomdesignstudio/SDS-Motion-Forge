import { Component, signal } from "@angular/core";
import {
  SdsMotionDirective,
  SdsTextDirective,
  SdsInViewDirective,
} from "@salkomdesignstudio/motion-forge-angular";
import { SnippetsComponent } from "./snippets.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [SdsMotionDirective, SdsTextDirective, SdsInViewDirective, SnippetsComponent],
  template: `
    <main style="font-family: system-ui, sans-serif; padding: 40px;">
      <h1 sdsMotion="sds-velvet-drop">Angular headline</h1>

      <h2 sdsText="sds-kinetic-wave">Motion</h2>

      <section sdsMotion="sds-scroll-rise" inView replay duration="slow" easing="spring">
        <p>Enters on scroll, replays on re-entry.</p>
      </section>

      <button sdsMotion="sds-btn-magnetic" [delay]="200">Magnetic button</button>

      <div style="height: 120vh"></div>

      <section sdsInView (sdsInViewChange)="visible.set($event)">
        <p>In view: {{ visible() }}</p>
      </section>

      <app-snippets />
    </main>
  `,
})
export class AppComponent {
  readonly visible = signal(false);
}
