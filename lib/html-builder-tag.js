'use babel';

export class Tag {
  element = null;

  constructor(pTagName) {
    this.element = document.createElement(pTagName);
  }

  add(pTag) {
    this.element.appendChild(pTag.getElement());
    return this;
  }

  getElement() {
    return this.element;
  }

  id(pId) {
    this.element.id = pId;
    return this;
  }

  class(pClass) {
    this.element.classList.add(pClass);
    return this;
  }

  type(pType) {
    this.element.type = pType;
    return this;
  }

  value(pValue) {
    this.element.value = pValue;
    return this;
  }

  html(pHtml) {
    this.element.innerHTML = pHtml;
    return this;
  }
}

export class Div extends Tag {
  constructor(pClass) {
    super('div');
    if (pClass !== undefined) {
      this.class(pClass);
      // pClass.forEach((item, i) => {
      //   this.class(item);
      // });
    }
  }
}

export class Table extends Tag {
  constructor(pId) {
    super('table');
    if (pId !== undefined) {
      this.id(pId);
    }
  }
}

export class TBody extends Tag {
  constructor() {
    super('tbody');
  }
}

export class Tr extends Tag {
  constructor() {
    super('tr');
  }
}

export class Td extends Tag {
  constructor() {
    super('td');
  }
}

export class Span extends Tag {
  constructor(pText) {
    super('span');
    if (pText) {
      this.element.innerHTML = pText;
    }
  }
}

export class Button extends Span {
  constructor(pIcon) {
    super();
    this.class('icon');
    this.class('icon-' + pIcon);
  }
}

export class Text extends Tag {
  constructor() {
    super('input');
    this.class('native-key-bindings').type('text');
  }
}

export class Select extends Tag {
  constructor(pOptions) {
    super('select');
    if (pOptions) {
      pOptions.forEach((item, i) => {
        vOption = new Tag('option').value(item[0]).html(item[1]);
        this.add(vOption);
      });
    }
  }
}
