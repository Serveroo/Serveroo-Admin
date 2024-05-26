class ConnectionDataModel {
  'nodeIP': string;
}

class DateModel {
  'hour': number;
  'minute': number;
  'second': number;
  'day': number;
  'month': number;
  'year': number;
}

export class OpenPortModel {
  'name': string;
  'port': number;
  'nodePort': number;
  'protocol': string;
  'targetPort': number;
}

class ResourceModel {
  'limits': number;
  'requests': number;
  'usage': number;
  'percentageUsed': string;
}

class ResourceUsageModel {
  'cpu': ResourceModel;
  'memory': ResourceModel;
}

class PVModel {
  'use': number;
  'path': string;
  'capacity': number;
}

class ContainerModel {
  'name': string;
  'image': string;
  'status': string;
  'log': string;
  'resourceUsage': ResourceUsageModel;
  'pv': PVModel;
}

class PodsModel {
  'name': string;
  'type': string;
  'status': string;
  'date': DateModel;
  'lastUse': DateModel;
  'connectionData': ConnectionDataModel;
  'openPorts': Array<OpenPortModel>;
  'containers': Array<ContainerModel>;
}

export class InfopodsModel {
  'namespace': string;
  'pods': Array<PodsModel>;
}
