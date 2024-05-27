import {OpenPortModel} from "./infopods.model";

export class DisplayPodModel {
  'namespace': string;
  'name': string;
  'cpu': string;
  'memory': string;
  'disk': string;
  'status': string;
  'date': string;
  'endDate': string;
  'lastUse': string;
  'openPorts': Array<OpenPortModel>;
  'displayDetails': boolean;
}
