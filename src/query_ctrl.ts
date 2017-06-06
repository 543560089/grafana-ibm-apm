///<reference path="../typings/tsd.d.ts" />
import { QueryCtrl } from 'app/plugins/sdk';
import _ from 'lodash';

class IPMQueryCtrl extends QueryCtrl {
  static templateUrl = 'partials/query.editor.html';
  refresh: any;
  metric_types: any;
  datasource: any;
  type: any;
  at: any[];  //Agent Types
  ag: any[];  //Attribute Groups for Agent Type
  atr: any[];  //Attributes for Attribute Group
  pk: any[];  //Primary Key for Attribute Group
  ai: any[];   //Agent Instances

   timeAttributes = [
        { name: 'TIMESTAMP', value: 'TIMESTAMP' },
        { name: 'WRITETIME', value: 'WRITETIME' }
    ];

   valueAttributes =  [
        { name: 'value', value: 'value' },
        { name: 'displayValue', value: 'displayValue' }
    ];

  /** @ngInject **/
  constructor($scope, $injector) {


    super($scope, $injector);
    let target_defaults = {
      target: 'Select Agent Type',
      AttributeGroup: 'Select AttributeGroup',
      Attribute: 'Select Attribute',
      AgentInstance: 'Select Agent'
    }
    _.defaultsDeep(this.target, target_defaults);
    this.target.timeAttribute = this.target.timeAttribute || 'WRITETIME';
    this.target.valueAttribute = this.target.valueAttribute || 'displayValue';
  };

  getAgentTypes() {
    if (this.at) {
      return Promise.resolve(this.at);
    } else {
      return this.datasource.getAgentTypes()
        .then(items => {
          this.at = items;
          return items;
        });
    }
  }

  AgentTypes() {
    return this.getAgentTypes().then(items => {
      return _.map(items, item => {
        return { text: item.description + '  -->  ' + item.id, value: item.id };
      });
    });
  }

  getAttributeGroups() {
    let target = this.target.target;
    return this.datasource.getAttributeGroups(target)
      .then(items => {
        this.ag = items;
        return items;
      });
  }

  AttributeGroups() {
    return this.getAttributeGroups().then(items => {
      var filtered = items.filter(item => item.notAvailableInPreFetch != true);
      return filtered.map(item => {
        return { text: item.description + '  -->  ' + item.id, value: item.id };
      })
    });
  }

  getAgentInstances() {
    let name = this.target.target;
    return this.datasource.getAgentInstances(name)
      .then(items => {
        this.ai = items;
        return items;
      });
  }

  AgentInstances() {
    return this.getAgentInstances().then(items => {
      return _.map(items, item => {
        return { text: item.value, value: item.value };
      })
    });
  }

  getAttributes() {
    let target = this.target.target;
    let aG = this.target.AttributeGroup;
    return this.datasource.getAttributes(target, aG)
      .then(items => {
        this.atr = items;
        return items;
      });
  }

  Attributes() {
    return this.getAttributes().then(items => {
      return _.map(items, item => {
        return { text: item.label + '  -->  ' + item.id, value: item.id };
      });
    });
  }

  getPrimaryKey() {
    let target = this.target.target;
    let aG = this.target.AttributeGroup;
    return this.datasource.getPrimaryKey(target, aG)
      .then(items => {
        this.pk = items;
        return items;
      });
  }

  PrimaryKey() {
    return this.getPrimaryKey().then(items => {
      return _.map(items, item => {
        return { text: item.label + '  -->  ' + item.id, value: item.id };
      });
    });
  }

  onChangeInternal() {
    this.refresh();
  }

  onChangeInternal1() {
    delete this.target.PrimaryKey;
    this.getPrimaryKey().then(items => {
      if (_.isEmpty(this.pk)) {
        //console.log('empty');
        document.getElementById("pk").style.visibility = 'hidden';
      } else {
        //console.log('full');
        document.getElementById("pk").style.visibility = 'visible';
      }
    });

    this.refresh();
  }

}

export { IPMQueryCtrl };