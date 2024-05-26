import {Component, Input} from '@angular/core';
import {DisplayPodModel} from "../../../shared/model/displaypods.model";

@Component({
  selector: 'app-pod',
  templateUrl: './pod.component.html',
  styleUrls: ['./pod.component.scss'],
})
export class PodComponent {
  @Input() pod: DisplayPodModel = new DisplayPodModel();

  constructor() {
  }
}
