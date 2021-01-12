'use babel';

export default class EditorTools {
  static gotoLine(pLine) {
    vEditor = atom.workspace.getActiveTextEditor();
    vLine = pLine;
    if (pLine === 'last') {
      vLine = vEditor.getLineCount();
    }
    vEditor.setCursorBufferPosition([vLine - 1, 0]);
    vEditor.scrollToCursorPosition(true);
  }

  static gotoFirstLine() {
    this.gotoLine(1);
  }

  static gotoLastLine() {
    this.gotoLine('last');
  }
}
