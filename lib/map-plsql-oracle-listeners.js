'use babel';

import EditorTools from './editor-tools';

export default class MapPlsqlOracleListeners {
  static createResultsTrClickListener(pElement, pLine) {
    pElement.addEventListener('click', function() {
      EditorTools.gotoLine(pLine);
    }, false);
  }

  static createStaticbarButtonsListeners(pPackageObject, pPackageView) {
    pPackageView.button_refresh.addEventListener('click', function() {
      pPackageObject.refreshResults();
    }, false);

    pPackageView.button_top.addEventListener('click', function() {
      EditorTools.gotoFirstLine();
    }, false);

    pPackageView.button_bottom.addEventListener('click', function() {
      EditorTools.gotoLastLine();
    }, false);

    pPackageView.button_close.addEventListener('click', function() {
      pPackageObject.toggle();
    }, false);

    pPackageView.button_reset_name_filter.addEventListener('click', function() {
      pPackageView.name_filter.classList.remove('modified');
      if (pPackageObject.currentNameFilter !== pPackageView.name_filter.value) {
        pPackageView.name_filter.value = pPackageObject.currentNameFilter;
      } else {
        pPackageView.name_filter.value = '';
      }
      pPackageObject.refreshResults();
    }, false);

    pPackageView.button_reset_type_filter.addEventListener('click', function() {
      pPackageView.type_filter.value = 'all';
      pPackageObject.refreshResults();
    }, false);
  }

  static createStaticbarFiltersSortListeners(pPackageObject, pPackageView) {
    pPackageView.name_filter.addEventListener('keyup', function() {
      if (event.key == 'Enter') {
        pPackageObject.currentNameFilter = event.target.value;
        pPackageObject.refreshResults();
        event.target.classList.remove('modified');
      } else {
        event.target.classList.add('modified');
      }
    }, false);

    pPackageView.type_filter.addEventListener('change', function() {
      pPackageObject.refreshResults();
    }, false);

    pPackageView.sort.addEventListener('change', function() {
      pPackageObject.refreshResults();
    }, false);
  }

  static createEditorListeners(pPackageObject, pPackageView) {
    atom.workspace.onDidChangeActiveTextEditor(function(){
      pPackageObject.refreshResults();

      if (pPackageObject.listenerEditorOnDidSave != null) {
        pPackageObject.listenerEditorOnDidSave.dispose();
        pPackageObject.listenerEditorOnDidSave = null;
      }
      // if (pPackageObject.listernerEditorOnDidStopChanging != null) {
      //   pPackageObject.listernerEditorOnDidStopChanging.dispose();
      //   pPackageObject.listernerEditorOnDidStopChanging = null;
      // }

      vEditor = atom.workspace.getActiveTextEditor();

      if (vEditor !== undefined) {
        pPackageObject.listenerEditorOnDidSave = vEditor.onDidSave(function(){
          pPackageObject.refreshResults();
        });
        // pPackageObject.listernerEditorOnDidStopChanging = vEditor.onDidStopChanging(function(){
        //   pPackageObject.refreshResults();
        // });
      }
    });

    vEditor = atom.workspace.getActiveTextEditor();

    if (vEditor !== undefined) {
      pPackageObject.listenerEditorOnDidSave = vEditor.onDidSave(function(){
        pPackageObject.refreshResults();
      });
      // pPackageObject.listernerEditorOnDidStopChanging = vEditor.onDidStopChanging(function(){
      //   pPackageObject.refreshResults();
      // });
    }
  }
}
