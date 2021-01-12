'use babel';

import { Div, Span, Button, Text, Select, Table, TBody, Tr, Td } from './html-builder-tag'
import MapPlsqlOracleListeners from './map-plsql-oracle-listeners';

export default class MapPlsqlOracleView {
  constructor(serializedState, pMaster) {
    // Buttons
    vButtonRefresh         = new Button('sync');
    vButtonTop             = new Button('chevron-up');
    vButtonBottom          = new Button('chevron-down');
    vButtonClose           = new Button('remove-close');
    vButtonResetNameFilter = new Button('trashcan');
    vButtonResetTypeFilter = new Button('trashcan');

    // Filters + Sort
    vNameFilter = new Text();
    vTypeFilter = new Select([['all'      , 'All'],
                              ['function' , 'Function'],
                              ['procedure', 'Procedure']]);
    vSort = new Select([['LINE_NAME_TYPE', 'Line'],
                        ['NAME_LINE_TYPE', 'Name'],
                        ['TYPE_NAME_LINE', 'Type']]);

    // HTML
    vRoot = new Div().id('map-plsql-oracle-root');
    vStaticBar = new Div('staticbar');
    vResults = new Div('results');
    vResultsTable = new Table('map-plsql-oracle-results-table');
    vRoot
      .add(vStaticBar//new Div('staticbar')
        .add(new Table()
          .add(new TBody()
            .add(new Tr()
              .add(new Td().add(vButtonRefresh))
              .add(new Td().add(vButtonTop))
              .add(new Td().add(new Span('Oracle&nbsp;PL/SQL&nbsp;Map')))
              .add(new Td().add(vButtonBottom))
              .add(new Td().add(vButtonClose))
        ) ) )
        .add(new Table()
          .add(new TBody()
            .add(new Tr()
              .add(new Td().add(new Span("Name&nbsp;:&nbsp;&nbsp;&nbsp;"))
                           .add(vNameFilter)
                           .add(new Span("&nbsp;&nbsp;&nbsp;"))
                           .add(vButtonResetNameFilter))
              .add(new Td().add(new Span("Type&nbsp;:&nbsp;&nbsp;&nbsp;"))
                           .add(vTypeFilter)
                           .add(new Span("&nbsp;&nbsp;&nbsp;"))
                           .add(vButtonResetTypeFilter))
              .add(new Td().add(new Span("Sort&nbsp;:&nbsp;"))
                           .add(vSort))
        ) ) )
      )
      .add(vResults
        .add(vResultsTable
          .add(new TBody()
            .add(new Tr().add(new Td().html('-')))
      ) ) );

    // Elements
    this.element                  = vRoot.getElement();
    this.button_refresh           = vButtonRefresh.getElement();
    this.button_top               = vButtonTop.getElement();
    this.button_bottom            = vButtonBottom.getElement();
    this.button_close             = vButtonClose.getElement();
    this.button_reset_name_filter = vButtonResetNameFilter.getElement();
    this.button_reset_type_filter = vButtonResetTypeFilter.getElement();
    this.name_filter              = vNameFilter.getElement();
    this.type_filter              = vTypeFilter.getElement();
    this.sort                     = vSort.getElement();
    this.resultsTableObject       = vResultsTable;

    // Spacer
    vPlaceholderStaticbar = vStaticBar.getElement().cloneNode(true);
    vPlaceholderStaticbar.classList.add('spacer');
    vResults.getElement().prepend(vPlaceholderStaticbar);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  updateResults(pResults) {
    this.resultsTableObject.html('');

    vTBody = new TBody();
    pResults.forEach((item, i) => {
      vType = item[0];
      vName = item[1];
      vLine = item[2];

      vTr = new Tr();
      vTr.add(new Td().html(vType).class(vType))
         .add(new Td().html(vName).class(vName))
         .add(new Td().html('Line&nbsp;:&nbsp;' + vLine));

      vTBody.add(vTr);

      MapPlsqlOracleListeners.createResultsTrClickListener(vTr.getElement(), vLine);
    });
    this.resultsTableObject.add(vTBody);
  }

  getElement() {
    return this.element;
  }

}
