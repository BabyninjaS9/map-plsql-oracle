'use babel';

import MapPlsqlOracleView from './map-plsql-oracle-view';
import MapPlsqlOracleEngine from './map-plsql-oracle-engine';
import MapPlsqlOracleListeners from './map-plsql-oracle-listeners';
import { CompositeDisposable } from 'atom';

export default {

  mapPlsqlOracleView: null,
  modalPanel: null,
  subscriptions: null,
  currentNameFilter: null,
  listenerEditorOnDidSave: null,
  // listernerEditorOnDidStopChanging: null,

  refreshResults() {
    vResults = MapPlsqlOracleEngine.buildResults(this.mapPlsqlOracleView);
    this.mapPlsqlOracleView.updateResults(vResults);
  },

  activate(state) {
    this.mapPlsqlOracleView = new MapPlsqlOracleView(state.mapPlsqlOracleViewState, this);
    this.modalPanel = atom.workspace.addRightPanel({
      item: this.mapPlsqlOracleView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'map-plsql-oracle:toggle': () => this.toggle()
    }));

    MapPlsqlOracleListeners.createStaticbarButtonsListeners(this, this.mapPlsqlOracleView);
    MapPlsqlOracleListeners.createStaticbarFiltersSortListeners(this, this.mapPlsqlOracleView);
    MapPlsqlOracleListeners.createEditorListeners(this, this.mapPlsqlOracleView);
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.mapPlsqlOracleView.destroy();
  },

  serialize() {
    return {
      mapPlsqlOracleViewState: this.mapPlsqlOracleView.serialize()
    };
  },

  toggle() {
    if (this.modalPanel.isVisible()) {
      this.modalPanel.hide();
    } else {
      this.refreshResults();
      this.modalPanel.show();
    }
  }

};
