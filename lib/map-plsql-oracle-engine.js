'use babel';

export default class MapPlsqlOracleEngine {
  static removeComments (pSrc) {
    vOutput = '';
    vPreviousLetter = '';
    vSingleLineComment = false;
    vMultiLineComment = false;

    pSrc.split('').forEach((vCurrentLetter, vPosition) => {
      if (!vMultiLineComment) {
        vMultiLineComment = (vPreviousLetter + vCurrentLetter == '/*');
      }
      if (vPreviousLetter + vCurrentLetter == '*/') {
        vMultiLineComment = false;
      }

      if (!vSingleLineComment) {
        vSingleLineComment = (vPreviousLetter + vCurrentLetter == '--')
      }
      if (vPreviousLetter == '\n') {
        vSingleLineComment = false;
      }

      if ((!vMultiLineComment && !vSingleLineComment) || vPreviousLetter == '\n') {
        vOutput += vPreviousLetter;
      }
      vPreviousLetter = vCurrentLetter;
    });

    return vOutput.replace(/\*\//gi, '');
  }

  static normalize (pSrc) {
    return pSrc.replace(/[\t ]*\(/gi, ' (') // 1 space before "("
               .replace(/[\t ]*\)/gi, ')') // no space before ")"
               .replace(/[\t ]*,[\t ]*/gi, ', ') // 1 space after ","
               .replace(/[\t ]+/gi, ' ') // remove multiple spaces
               .replace(/ \n/gi, '\n') // trim right
               .replace(/\n /gi, '\n') // trim left
               // problem with line numbers : removing blank lines // .trim() // trim first and last lines
               .replace(/^[\t ]*/, '')
               .toLowerCase();
  }

  static filterResults (pCode, pTypeFilter, pNameFilter) {
    vResults = Array();
    pCode.split('\n').forEach((vLine, vLineNumber) => {
      //if (vLine.startsWith('function') || vLine.startsWith('procedure')) {
      if ((pTypeFilter !== 'all' && vLine.startsWith(pTypeFilter)) || (pTypeFilter === 'all' && (vLine.startsWith('function') || vLine.startsWith('procedure')))) {
        vType = vLine.split(' ')[0];
        vName = vLine.split(' ')[1];
        if (vName === undefined) {
          vName = '-';
        }
        if (pNameFilter === '' || vName.match (new RegExp (pNameFilter, 'g'))) {
          vResults.push([vType, vName, vLineNumber + 1]);
        }
      }
    });
    return vResults;
  }

  static sortResults (pResults, pSortMode) {
    if        (pSortMode == 'TYPE_NAME_LINE') {
      vFirstSortCriteriaColumn  = 0;
      vSecondSortCriteriaColumn = 1;
      vThirdSortCriteriaColumn  = 2;
    } else if (pSortMode == 'NAME_TYPE_LINE') {
      vFirstSortCriteriaColumn  = 1;
      vSecondSortCriteriaColumn = 0;
      vThirdSortCriteriaColumn  = 2;
    } else if (pSortMode == 'LINE_TYPE_NAME') {
      vFirstSortCriteriaColumn  = 2;
      vSecondSortCriteriaColumn = 0;
      vThirdSortCriteriaColumn  = 1;
    } else { // NO_SORT
      return;
    }
    pResults.sort(function(a, b) {
      if      (a[vFirstSortCriteriaColumn] < b[vFirstSortCriteriaColumn]) { return -1; }
      else if (a[vFirstSortCriteriaColumn] > b[vFirstSortCriteriaColumn]) { return  1; }
      else {
        if      (a[vSecondSortCriteriaColumn] < b[vSecondSortCriteriaColumn]) { return -1; }
        else if (a[vSecondSortCriteriaColumn] > b[vSecondSortCriteriaColumn]) { return  1; }
        else {
          if      (a[vThirdSortCriteriaColumn] < b[vThirdSortCriteriaColumn]) { return -1; }
          else if (a[vThirdSortCriteriaColumn] > b[vThirdSortCriteriaColumn]) { return  1; }
        }
      }
      return 0;
    });
  }

  static buildResults(pMapPlsqlOracleView) {
    vActiveTextEditor = atom.workspace.getActiveTextEditor();
    if (vActiveTextEditor !== undefined) {
      vTypeFilter = pMapPlsqlOracleView.type_filter.value;
      vNameFilter = pMapPlsqlOracleView.name_filter.value;
      vSortMode   = pMapPlsqlOracleView.sort.value;

      vFileContent = vActiveTextEditor.getText();
      vFileContent = this.removeComments (vFileContent);
      vFileContent = this.normalize (vFileContent);
      vResults = this.filterResults(vFileContent, vTypeFilter, vNameFilter);
      this.sortResults(vResults, vSortMode);
      return vResults;
    }
    return new Array();
  }
}
