function s(i, e, t, r) {
  var o = arguments.length, a = o < 3 ? e : r === null ? r = Object.getOwnPropertyDescriptor(e, t) : r, n;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(i, e, t, r);
  else for (var c = i.length - 1; c >= 0; c--) (n = i[c]) && (a = (o < 3 ? n(a) : o > 3 ? n(e, t, a) : n(e, t)) || a);
  return o > 3 && a && Object.defineProperty(e, t, a), a;
}
const S = (i) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(i, e);
  }) : customElements.define(i, e);
};
const he = globalThis, qe = he.ShadowRoot && (he.ShadyCSS === void 0 || he.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, je = /* @__PURE__ */ Symbol(), it = /* @__PURE__ */ new WeakMap();
let xt = class {
  constructor(e, t, r) {
    if (this._$cssResult$ = !0, r !== je) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (qe && e === void 0) {
      const r = t !== void 0 && t.length === 1;
      r && (e = it.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && it.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Vt = (i) => new xt(typeof i == "string" ? i : i + "", void 0, je), _ = (i, ...e) => {
  const t = i.length === 1 ? i[0] : e.reduce((r, o, a) => r + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + i[a + 1], i[0]);
  return new xt(t, i, je);
}, Ut = (i, e) => {
  if (qe) i.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const r = document.createElement("style"), o = he.litNonce;
    o !== void 0 && r.setAttribute("nonce", o), r.textContent = t.cssText, i.appendChild(r);
  }
}, ot = qe ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const r of e.cssRules) t += r.cssText;
  return Vt(t);
})(i) : i;
const { is: Ht, defineProperty: qt, getOwnPropertyDescriptor: jt, getOwnPropertyNames: Wt, getOwnPropertySymbols: Gt, getPrototypeOf: Yt } = Object, be = globalThis, at = be.trustedTypes, Zt = at ? at.emptyScript : "", Kt = be.reactiveElementPolyfillSupport, X = (i, e) => i, ue = { toAttribute(i, e) {
  switch (e) {
    case Boolean:
      i = i ? Zt : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, e) {
  let t = i;
  switch (e) {
    case Boolean:
      t = i !== null;
      break;
    case Number:
      t = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(i);
      } catch {
        t = null;
      }
  }
  return t;
} }, We = (i, e) => !Ht(i, e), nt = { attribute: !0, type: String, converter: ue, reflect: !1, useDefault: !1, hasChanged: We };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), be.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let j = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = nt) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const r = /* @__PURE__ */ Symbol(), o = this.getPropertyDescriptor(e, r, t);
      o !== void 0 && qt(this.prototype, e, o);
    }
  }
  static getPropertyDescriptor(e, t, r) {
    const { get: o, set: a } = jt(this.prototype, e) ?? { get() {
      return this[t];
    }, set(n) {
      this[t] = n;
    } };
    return { get: o, set(n) {
      const c = o?.call(this);
      a?.call(this, n), this.requestUpdate(e, c, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? nt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(X("elementProperties"))) return;
    const e = Yt(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(X("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(X("properties"))) {
      const t = this.properties, r = [...Wt(t), ...Gt(t)];
      for (const o of r) this.createProperty(o, t[o]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [r, o] of t) this.elementProperties.set(r, o);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, r] of this.elementProperties) {
      const o = this._$Eu(t, r);
      o !== void 0 && this._$Eh.set(o, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const r = new Set(e.flat(1 / 0).reverse());
      for (const o of r) t.unshift(ot(o));
    } else e !== void 0 && t.push(ot(e));
    return t;
  }
  static _$Eu(e, t) {
    const r = t.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
  }
  addController(e) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
  }
  removeController(e) {
    this._$EO?.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const r of t.keys()) this.hasOwnProperty(r) && (e.set(r, this[r]), delete this[r]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Ut(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, t, r) {
    this._$AK(e, r);
  }
  _$ET(e, t) {
    const r = this.constructor.elementProperties.get(e), o = this.constructor._$Eu(e, r);
    if (o !== void 0 && r.reflect === !0) {
      const a = (r.converter?.toAttribute !== void 0 ? r.converter : ue).toAttribute(t, r.type);
      this._$Em = e, a == null ? this.removeAttribute(o) : this.setAttribute(o, a), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const r = this.constructor, o = r._$Eh.get(e);
    if (o !== void 0 && this._$Em !== o) {
      const a = r.getPropertyOptions(o), n = typeof a.converter == "function" ? { fromAttribute: a.converter } : a.converter?.fromAttribute !== void 0 ? a.converter : ue;
      this._$Em = o;
      const c = n.fromAttribute(t, a.type);
      this[o] = c ?? this._$Ej?.get(o) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, t, r, o = !1, a) {
    if (e !== void 0) {
      const n = this.constructor;
      if (o === !1 && (a = this[e]), r ??= n.getPropertyOptions(e), !((r.hasChanged ?? We)(a, t) || r.useDefault && r.reflect && a === this._$Ej?.get(e) && !this.hasAttribute(n._$Eu(e, r)))) return;
      this.C(e, t, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: r, reflect: o, wrapped: a }, n) {
    r && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, n ?? t ?? this[e]), a !== !0 || n !== void 0) || (this._$AL.has(e) || (this.hasUpdated || r || (t = void 0), this._$AL.set(e, t)), o === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [o, a] of this._$Ep) this[o] = a;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [o, a] of r) {
        const { wrapped: n } = a, c = this[o];
        n !== !0 || this._$AL.has(o) || c === void 0 || this.C(o, void 0, a, c);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((r) => r.hostUpdate?.()), this.update(t)) : this._$EM();
    } catch (r) {
      throw e = !1, this._$EM(), r;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach((t) => t.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq &&= this._$Eq.forEach((t) => this._$ET(t, this[t])), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
j.elementStyles = [], j.shadowRootOptions = { mode: "open" }, j[X("elementProperties")] = /* @__PURE__ */ new Map(), j[X("finalized")] = /* @__PURE__ */ new Map(), Kt?.({ ReactiveElement: j }), (be.reactiveElementVersions ??= []).push("2.1.2");
const Xt = { attribute: !0, type: String, converter: ue, reflect: !1, hasChanged: We }, Jt = (i = Xt, e, t) => {
  const { kind: r, metadata: o } = t;
  let a = globalThis.litPropertyMetadata.get(o);
  if (a === void 0 && globalThis.litPropertyMetadata.set(o, a = /* @__PURE__ */ new Map()), r === "setter" && ((i = Object.create(i)).wrapped = !0), a.set(t.name, i), r === "accessor") {
    const { name: n } = t;
    return { set(c) {
      const h = e.get.call(this);
      e.set.call(this, c), this.requestUpdate(n, h, i, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(n, void 0, i, c), c;
    } };
  }
  if (r === "setter") {
    const { name: n } = t;
    return function(c) {
      const h = this[n];
      e.call(this, c), this.requestUpdate(n, h, i, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function d(i) {
  return (e, t) => typeof t == "object" ? Jt(i, e, t) : ((r, o, a) => {
    const n = o.hasOwnProperty(a);
    return o.constructor.createProperty(a, r), n ? Object.getOwnPropertyDescriptor(o, a) : void 0;
  })(i, e, t);
}
function g(i) {
  return d({ ...i, state: !0, attribute: !1 });
}
const _t = (i, e, t) => (t.configurable = !0, t.enumerable = !0, Reflect.decorate && typeof e != "object" && Object.defineProperty(i, e, t), t);
function w(i, e) {
  return (t, r, o) => {
    const a = (n) => n.renderRoot?.querySelector(i) ?? null;
    return _t(t, r, { get() {
      return a(this);
    } });
  };
}
function ge(i) {
  return (e, t) => {
    const { slot: r, selector: o } = i ?? {}, a = "slot" + (r ? `[name=${r}]` : ":not([name])");
    return _t(e, t, { get() {
      const n = this.renderRoot?.querySelector(a), c = n?.assignedElements(i) ?? [];
      return o === void 0 ? c : c.filter((h) => h.matches(o));
    } });
  };
}
const Ge = globalThis, st = (i) => i, pe = Ge.trustedTypes, lt = pe ? pe.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, wt = "$lit$", L = `lit$${Math.random().toFixed(9).slice(2)}$`, $t = "?" + L, Qt = `<${$t}>`, V = document, Q = () => V.createComment(""), ee = (i) => i === null || typeof i != "object" && typeof i != "function", Ye = Array.isArray, er = (i) => Ye(i) || typeof i?.[Symbol.iterator] == "function", we = `[ 	
\f\r]`, Z = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, dt = /-->/g, ct = />/g, N = RegExp(`>|${we}(?:([^\\s"'>=/]+)(${we}*=${we}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ht = /'/g, ut = /"/g, At = /^(?:script|style|textarea|title)$/i, tr = (i) => (e, ...t) => ({ _$litType$: i, strings: e, values: t }), u = tr(1), R = /* @__PURE__ */ Symbol.for("lit-noChange"), l = /* @__PURE__ */ Symbol.for("lit-nothing"), pt = /* @__PURE__ */ new WeakMap(), B = V.createTreeWalker(V, 129);
function kt(i, e) {
  if (!Ye(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return lt !== void 0 ? lt.createHTML(e) : e;
}
const rr = (i, e) => {
  const t = i.length - 1, r = [];
  let o, a = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = Z;
  for (let c = 0; c < t; c++) {
    const h = i[c];
    let v, b, f = -1, T = 0;
    for (; T < h.length && (n.lastIndex = T, b = n.exec(h), b !== null); ) T = n.lastIndex, n === Z ? b[1] === "!--" ? n = dt : b[1] !== void 0 ? n = ct : b[2] !== void 0 ? (At.test(b[2]) && (o = RegExp("</" + b[2], "g")), n = N) : b[3] !== void 0 && (n = N) : n === N ? b[0] === ">" ? (n = o ?? Z, f = -1) : b[1] === void 0 ? f = -2 : (f = n.lastIndex - b[2].length, v = b[1], n = b[3] === void 0 ? N : b[3] === '"' ? ut : ht) : n === ut || n === ht ? n = N : n === dt || n === ct ? n = Z : (n = N, o = void 0);
    const I = n === N && i[c + 1].startsWith("/>") ? " " : "";
    a += n === Z ? h + Qt : f >= 0 ? (r.push(v), h.slice(0, f) + wt + h.slice(f) + L + I) : h + L + (f === -2 ? c : I);
  }
  return [kt(i, a + (i[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), r];
};
class te {
  constructor({ strings: e, _$litType$: t }, r) {
    let o;
    this.parts = [];
    let a = 0, n = 0;
    const c = e.length - 1, h = this.parts, [v, b] = rr(e, t);
    if (this.el = te.createElement(v, r), B.currentNode = this.el.content, t === 2 || t === 3) {
      const f = this.el.content.firstChild;
      f.replaceWith(...f.childNodes);
    }
    for (; (o = B.nextNode()) !== null && h.length < c; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) for (const f of o.getAttributeNames()) if (f.endsWith(wt)) {
          const T = b[n++], I = o.getAttribute(f).split(L), O = /([.?@])?(.*)/.exec(T);
          h.push({ type: 1, index: a, name: O[2], strings: I, ctor: O[1] === "." ? or : O[1] === "?" ? ar : O[1] === "@" ? nr : ye }), o.removeAttribute(f);
        } else f.startsWith(L) && (h.push({ type: 6, index: a }), o.removeAttribute(f));
        if (At.test(o.tagName)) {
          const f = o.textContent.split(L), T = f.length - 1;
          if (T > 0) {
            o.textContent = pe ? pe.emptyScript : "";
            for (let I = 0; I < T; I++) o.append(f[I], Q()), B.nextNode(), h.push({ type: 2, index: ++a });
            o.append(f[T], Q());
          }
        }
      } else if (o.nodeType === 8) if (o.data === $t) h.push({ type: 2, index: a });
      else {
        let f = -1;
        for (; (f = o.data.indexOf(L, f + 1)) !== -1; ) h.push({ type: 7, index: a }), f += L.length - 1;
      }
      a++;
    }
  }
  static createElement(e, t) {
    const r = V.createElement("template");
    return r.innerHTML = e, r;
  }
}
function W(i, e, t = i, r) {
  if (e === R) return e;
  let o = r !== void 0 ? t._$Co?.[r] : t._$Cl;
  const a = ee(e) ? void 0 : e._$litDirective$;
  return o?.constructor !== a && (o?._$AO?.(!1), a === void 0 ? o = void 0 : (o = new a(i), o._$AT(i, t, r)), r !== void 0 ? (t._$Co ??= [])[r] = o : t._$Cl = o), o !== void 0 && (e = W(i, o._$AS(i, e.values), o, r)), e;
}
class ir {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: r } = this._$AD, o = (e?.creationScope ?? V).importNode(t, !0);
    B.currentNode = o;
    let a = B.nextNode(), n = 0, c = 0, h = r[0];
    for (; h !== void 0; ) {
      if (n === h.index) {
        let v;
        h.type === 2 ? v = new re(a, a.nextSibling, this, e) : h.type === 1 ? v = new h.ctor(a, h.name, h.strings, this, e) : h.type === 6 && (v = new sr(a, this, e)), this._$AV.push(v), h = r[++c];
      }
      n !== h?.index && (a = B.nextNode(), n++);
    }
    return B.currentNode = V, o;
  }
  p(e) {
    let t = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, t), t += r.strings.length - 2) : r._$AI(e[t])), t++;
  }
}
class re {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, t, r, o) {
    this.type = 2, this._$AH = l, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = r, this.options = o, this._$Cv = o?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = W(this, e, t), ee(e) ? e === l || e == null || e === "" ? (this._$AH !== l && this._$AR(), this._$AH = l) : e !== this._$AH && e !== R && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : er(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== l && ee(this._$AH) ? this._$AA.nextSibling.data = e : this.T(V.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: r } = e, o = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = te.createElement(kt(r.h, r.h[0]), this.options)), r);
    if (this._$AH?._$AD === o) this._$AH.p(t);
    else {
      const a = new ir(o, this), n = a.u(this.options);
      a.p(t), this.T(n), this._$AH = a;
    }
  }
  _$AC(e) {
    let t = pt.get(e.strings);
    return t === void 0 && pt.set(e.strings, t = new te(e)), t;
  }
  k(e) {
    Ye(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let r, o = 0;
    for (const a of e) o === t.length ? t.push(r = new re(this.O(Q()), this.O(Q()), this, this.options)) : r = t[o], r._$AI(a), o++;
    o < t.length && (this._$AR(r && r._$AB.nextSibling, o), t.length = o);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const r = st(e).nextSibling;
      st(e).remove(), e = r;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class ye {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, r, o, a) {
    this.type = 1, this._$AH = l, this._$AN = void 0, this.element = e, this.name = t, this._$AM = o, this.options = a, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = l;
  }
  _$AI(e, t = this, r, o) {
    const a = this.strings;
    let n = !1;
    if (a === void 0) e = W(this, e, t, 0), n = !ee(e) || e !== this._$AH && e !== R, n && (this._$AH = e);
    else {
      const c = e;
      let h, v;
      for (e = a[0], h = 0; h < a.length - 1; h++) v = W(this, c[r + h], t, h), v === R && (v = this._$AH[h]), n ||= !ee(v) || v !== this._$AH[h], v === l ? e = l : e !== l && (e += (v ?? "") + a[h + 1]), this._$AH[h] = v;
    }
    n && !o && this.j(e);
  }
  j(e) {
    e === l ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class or extends ye {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === l ? void 0 : e;
  }
}
class ar extends ye {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== l);
  }
}
class nr extends ye {
  constructor(e, t, r, o, a) {
    super(e, t, r, o, a), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = W(this, e, t, 0) ?? l) === R) return;
    const r = this._$AH, o = e === l && r !== l || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, a = e !== l && (r === l || o);
    o && this.element.removeEventListener(this.name, this, r), a && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class sr {
  constructor(e, t, r) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    W(this, e);
  }
}
const lr = Ge.litHtmlPolyfillSupport;
lr?.(te, re), (Ge.litHtmlVersions ??= []).push("3.3.3");
const Ct = (i, e, t) => {
  const r = t?.renderBefore ?? e;
  let o = r._$litPart$;
  if (o === void 0) {
    const a = t?.renderBefore ?? null;
    r._$litPart$ = o = new re(e.insertBefore(Q(), a), a, void 0, t ?? {});
  }
  return o._$AI(i), o;
};
const Ze = globalThis;
let $ = class extends j {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ct(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return R;
  }
};
$._$litElement$ = !0, $.finalized = !0, Ze.litElementHydrateSupport?.({ LitElement: $ });
const dr = Ze.litElementPolyfillSupport;
dr?.({ LitElement: $ });
(Ze.litElementVersions ??= []).push("4.2.2");
class cr extends $ {
  connectedCallback() {
    super.connectedCallback(), this.setAttribute("aria-hidden", "true");
  }
  render() {
    return u`<span class="shadow"></span>`;
  }
}
const hr = _`:host,.shadow,.shadow::before,.shadow::after{border-radius:inherit;inset:0;position:absolute;transition-duration:inherit;transition-property:inherit;transition-timing-function:inherit}:host{display:flex;pointer-events:none;transition-property:box-shadow,opacity}.shadow::before,.shadow::after{content:"";transition-property:box-shadow,opacity;--_level: var(--md-elevation-level, 0);--_shadow-color: var(--md-elevation-shadow-color, var(--md-sys-color-shadow, #000))}.shadow::before{box-shadow:0px calc(1px*(clamp(0,var(--_level),1) + clamp(0,var(--_level) - 3,1) + 2*clamp(0,var(--_level) - 4,1))) calc(1px*(2*clamp(0,var(--_level),1) + clamp(0,var(--_level) - 2,1) + clamp(0,var(--_level) - 4,1))) 0px var(--_shadow-color);opacity:.3}.shadow::after{box-shadow:0px calc(1px*(clamp(0,var(--_level),1) + clamp(0,var(--_level) - 1,1) + 2*clamp(0,var(--_level) - 2,3))) calc(1px*(3*clamp(0,var(--_level),2) + 2*clamp(0,var(--_level) - 2,3))) calc(1px*(clamp(0,var(--_level),4) + 2*clamp(0,var(--_level) - 4,1))) var(--_shadow-color);opacity:.15}
`;
let Ee = class extends cr {
};
Ee.styles = [hr];
Ee = s([
  S("md-elevation")
], Ee);
const Et = /* @__PURE__ */ Symbol("attachableController");
let Tt;
Tt = new MutationObserver((i) => {
  for (const e of i)
    e.target[Et]?.hostConnected();
});
class St {
  get htmlFor() {
    return this.host.getAttribute("for");
  }
  set htmlFor(e) {
    e === null ? this.host.removeAttribute("for") : this.host.setAttribute("for", e);
  }
  get control() {
    return this.host.hasAttribute("for") ? !this.htmlFor || !this.host.isConnected ? null : this.host.getRootNode().querySelector(`#${this.htmlFor}`) : this.currentControl || this.host.parentElement;
  }
  set control(e) {
    e ? this.attach(e) : this.detach();
  }
  /**
   * Creates a new controller for an `Attachable` element.
   *
   * @param host The `Attachable` element.
   * @param onControlChange A callback with two parameters for the previous and
   *     next control. An `Attachable` element may perform setup or teardown
   *     logic whenever the control changes.
   */
  constructor(e, t) {
    this.host = e, this.onControlChange = t, this.currentControl = null, e.addController(this), e[Et] = this, Tt?.observe(e, { attributeFilter: ["for"] });
  }
  attach(e) {
    e !== this.currentControl && (this.setCurrentControl(e), this.host.removeAttribute("for"));
  }
  detach() {
    this.setCurrentControl(null), this.host.setAttribute("for", "");
  }
  /** @private */
  hostConnected() {
    this.setCurrentControl(this.control);
  }
  /** @private */
  hostDisconnected() {
    this.setCurrentControl(null);
  }
  setCurrentControl(e) {
    this.onControlChange(this.currentControl, e), this.currentControl = e;
  }
}
const ur = ["focusin", "focusout", "pointerdown"];
class Ke extends $ {
  constructor() {
    super(...arguments), this.visible = !1, this.inward = !1, this.attachableController = new St(this, this.onControlChange.bind(this));
  }
  get htmlFor() {
    return this.attachableController.htmlFor;
  }
  set htmlFor(e) {
    this.attachableController.htmlFor = e;
  }
  get control() {
    return this.attachableController.control;
  }
  set control(e) {
    this.attachableController.control = e;
  }
  attach(e) {
    this.attachableController.attach(e);
  }
  detach() {
    this.attachableController.detach();
  }
  connectedCallback() {
    super.connectedCallback(), this.setAttribute("aria-hidden", "true");
  }
  /** @private */
  handleEvent(e) {
    if (!e[mt]) {
      switch (e.type) {
        default:
          return;
        case "focusin":
          this.visible = this.control?.matches(":focus-visible") ?? !1;
          break;
        case "focusout":
        case "pointerdown":
          this.visible = !1;
          break;
      }
      e[mt] = !0;
    }
  }
  onControlChange(e, t) {
    for (const r of ur)
      e?.removeEventListener(r, this), t?.addEventListener(r, this);
  }
  update(e) {
    e.has("visible") && this.dispatchEvent(new Event("visibility-changed")), super.update(e);
  }
}
s([
  d({ type: Boolean, reflect: !0 })
], Ke.prototype, "visible", void 0);
s([
  d({ type: Boolean, reflect: !0 })
], Ke.prototype, "inward", void 0);
const mt = /* @__PURE__ */ Symbol("handledByFocusRing");
const pr = _`:host{animation-delay:0s,calc(var(--md-focus-ring-duration, 600ms)*.25);animation-duration:calc(var(--md-focus-ring-duration, 600ms)*.25),calc(var(--md-focus-ring-duration, 600ms)*.75);animation-timing-function:cubic-bezier(0.2, 0, 0, 1);box-sizing:border-box;color:var(--md-focus-ring-color, var(--md-sys-color-secondary, #625b71));display:none;pointer-events:none;position:absolute}:host([visible]){display:flex}:host(:not([inward])){animation-name:outward-grow,outward-shrink;border-end-end-radius:calc(var(--md-focus-ring-shape-end-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));border-end-start-radius:calc(var(--md-focus-ring-shape-end-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));border-start-end-radius:calc(var(--md-focus-ring-shape-start-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));border-start-start-radius:calc(var(--md-focus-ring-shape-start-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));inset:calc(-1*var(--md-focus-ring-outward-offset, 2px));outline:var(--md-focus-ring-width, 3px) solid currentColor}:host([inward]){animation-name:inward-grow,inward-shrink;border-end-end-radius:calc(var(--md-focus-ring-shape-end-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border-end-start-radius:calc(var(--md-focus-ring-shape-end-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border-start-end-radius:calc(var(--md-focus-ring-shape-start-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border-start-start-radius:calc(var(--md-focus-ring-shape-start-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border:var(--md-focus-ring-width, 3px) solid currentColor;inset:var(--md-focus-ring-inward-offset, 0px)}@keyframes outward-grow{from{outline-width:0}to{outline-width:var(--md-focus-ring-active-width, 8px)}}@keyframes outward-shrink{from{outline-width:var(--md-focus-ring-active-width, 8px)}}@keyframes inward-grow{from{border-width:0}to{border-width:var(--md-focus-ring-active-width, 8px)}}@keyframes inward-shrink{from{border-width:var(--md-focus-ring-active-width, 8px)}}@media(prefers-reduced-motion){:host{animation:none}}
`;
let Te = class extends Ke {
};
Te.styles = [pr];
Te = s([
  S("md-focus-ring")
], Te);
const M = { ATTRIBUTE: 1, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4 }, Xe = (i) => (...e) => ({ _$litDirective$: i, values: e });
let Je = class {
  constructor(e) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(e, t, r) {
    this._$Ct = e, this._$AM = t, this._$Ci = r;
  }
  _$AS(e, t) {
    return this.update(e, t);
  }
  update(e, t) {
    return this.render(...t);
  }
};
const F = Xe(class extends Je {
  constructor(i) {
    if (super(i), i.type !== M.ATTRIBUTE || i.name !== "class" || i.strings?.length > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
  }
  render(i) {
    return " " + Object.keys(i).filter((e) => i[e]).join(" ") + " ";
  }
  update(i, [e]) {
    if (this.st === void 0) {
      this.st = /* @__PURE__ */ new Set(), i.strings !== void 0 && (this.nt = new Set(i.strings.join(" ").split(/\s/).filter((r) => r !== "")));
      for (const r in e) e[r] && !this.nt?.has(r) && this.st.add(r);
      return this.render(e);
    }
    const t = i.element.classList;
    for (const r of this.st) r in e || (t.remove(r), this.st.delete(r));
    for (const r in e) {
      const o = !!e[r];
      o === this.st.has(r) || this.nt?.has(r) || (o ? (t.add(r), this.st.add(r)) : (t.remove(r), this.st.delete(r)));
    }
    return R;
  }
});
const G = {
  STANDARD: "cubic-bezier(0.2, 0, 0, 1)",
  EMPHASIZED: "cubic-bezier(.3,0,0,1)",
  EMPHASIZED_ACCELERATE: "cubic-bezier(.3,0,.8,.15)"
};
const mr = 450, vt = 225, vr = 0.2, fr = 10, br = 75, gr = 0.35, yr = "::after", xr = "forwards";
var C;
(function(i) {
  i[i.INACTIVE = 0] = "INACTIVE", i[i.TOUCH_DELAY = 1] = "TOUCH_DELAY", i[i.HOLDING = 2] = "HOLDING", i[i.WAITING_FOR_CLICK = 3] = "WAITING_FOR_CLICK";
})(C || (C = {}));
const _r = [
  "click",
  "contextmenu",
  "pointercancel",
  "pointerdown",
  "pointerenter",
  "pointerleave",
  "pointerup"
], wr = 150, $r = window.matchMedia("(forced-colors: active)");
class ie extends $ {
  constructor() {
    super(...arguments), this.disabled = !1, this.hovered = !1, this.pressed = !1, this.rippleSize = "", this.rippleScale = "", this.initialSize = 0, this.state = C.INACTIVE, this.attachableController = new St(this, this.onControlChange.bind(this));
  }
  get htmlFor() {
    return this.attachableController.htmlFor;
  }
  set htmlFor(e) {
    this.attachableController.htmlFor = e;
  }
  get control() {
    return this.attachableController.control;
  }
  set control(e) {
    this.attachableController.control = e;
  }
  attach(e) {
    this.attachableController.attach(e);
  }
  detach() {
    this.attachableController.detach();
  }
  connectedCallback() {
    super.connectedCallback(), this.setAttribute("aria-hidden", "true");
  }
  render() {
    const e = {
      hovered: this.hovered,
      pressed: this.pressed
    };
    return u`<div class="surface ${F(e)}"></div>`;
  }
  update(e) {
    e.has("disabled") && this.disabled && (this.hovered = !1, this.pressed = !1), super.update(e);
  }
  /**
   * TODO(b/269799771): make private
   * @private only public for slider
   */
  handlePointerenter(e) {
    this.shouldReactToEvent(e) && (this.hovered = !0);
  }
  /**
   * TODO(b/269799771): make private
   * @private only public for slider
   */
  handlePointerleave(e) {
    this.shouldReactToEvent(e) && (this.hovered = !1, this.state !== C.INACTIVE && this.endPressAnimation());
  }
  handlePointerup(e) {
    if (this.shouldReactToEvent(e)) {
      if (this.state === C.HOLDING) {
        this.state = C.WAITING_FOR_CLICK;
        return;
      }
      if (this.state === C.TOUCH_DELAY) {
        this.state = C.WAITING_FOR_CLICK, this.startPressAnimation(this.rippleStartEvent);
        return;
      }
    }
  }
  async handlePointerdown(e) {
    if (this.shouldReactToEvent(e)) {
      if (this.rippleStartEvent = e, !this.isTouch(e)) {
        this.state = C.WAITING_FOR_CLICK, this.startPressAnimation(e);
        return;
      }
      this.state = C.TOUCH_DELAY, await new Promise((t) => {
        setTimeout(t, wr);
      }), this.state === C.TOUCH_DELAY && (this.state = C.HOLDING, this.startPressAnimation(e));
    }
  }
  handleClick() {
    if (!this.disabled) {
      if (this.state === C.WAITING_FOR_CLICK) {
        this.endPressAnimation();
        return;
      }
      this.state === C.INACTIVE && (this.startPressAnimation(), this.endPressAnimation());
    }
  }
  handlePointercancel(e) {
    this.shouldReactToEvent(e) && this.endPressAnimation();
  }
  handleContextmenu() {
    this.disabled || this.endPressAnimation();
  }
  determineRippleSize() {
    const { height: e, width: t } = this.getBoundingClientRect(), r = Math.max(e, t), o = Math.max(gr * r, br), a = this.currentCSSZoom ?? 1, n = Math.floor(r * vr / a), h = Math.sqrt(t ** 2 + e ** 2) + fr;
    this.initialSize = n;
    const v = (h + o) / n;
    this.rippleScale = `${v / a}`, this.rippleSize = `${n}px`;
  }
  getNormalizedPointerEventCoords(e) {
    const { scrollX: t, scrollY: r } = window, { left: o, top: a } = this.getBoundingClientRect(), n = t + o, c = r + a, { pageX: h, pageY: v } = e, b = this.currentCSSZoom ?? 1;
    return {
      x: (h - n) / b,
      y: (v - c) / b
    };
  }
  getTranslationCoordinates(e) {
    const { height: t, width: r } = this.getBoundingClientRect(), o = this.currentCSSZoom ?? 1, a = {
      x: (r / o - this.initialSize) / 2,
      y: (t / o - this.initialSize) / 2
    };
    let n;
    return e instanceof PointerEvent ? n = this.getNormalizedPointerEventCoords(e) : n = {
      x: r / o / 2,
      y: t / o / 2
    }, n = {
      x: n.x - this.initialSize / 2,
      y: n.y - this.initialSize / 2
    }, { startPoint: n, endPoint: a };
  }
  startPressAnimation(e) {
    if (!this.mdRoot)
      return;
    this.pressed = !0, this.growAnimation?.cancel(), this.determineRippleSize();
    const { startPoint: t, endPoint: r } = this.getTranslationCoordinates(e), o = `${t.x}px, ${t.y}px`, a = `${r.x}px, ${r.y}px`;
    this.growAnimation = this.mdRoot.animate({
      top: [0, 0],
      left: [0, 0],
      height: [this.rippleSize, this.rippleSize],
      width: [this.rippleSize, this.rippleSize],
      transform: [
        `translate(${o}) scale(1)`,
        `translate(${a}) scale(${this.rippleScale})`
      ]
    }, {
      pseudoElement: yr,
      duration: mr,
      easing: G.STANDARD,
      fill: xr
    });
  }
  async endPressAnimation() {
    this.rippleStartEvent = void 0, this.state = C.INACTIVE;
    const e = this.growAnimation;
    let t = 1 / 0;
    if (typeof e?.currentTime == "number" ? t = e.currentTime : e?.currentTime && (t = e.currentTime.to("ms").value), t >= vt) {
      this.pressed = !1;
      return;
    }
    await new Promise((r) => {
      setTimeout(r, vt - t);
    }), this.growAnimation === e && (this.pressed = !1);
  }
  /**
   * Returns `true` if
   *  - the ripple element is enabled
   *  - the pointer is primary for the input type
   *  - the pointer is the pointer that started the interaction, or will start
   * the interaction
   *  - the pointer is a touch, or the pointer state has the primary button
   * held, or the pointer is hovering
   */
  shouldReactToEvent(e) {
    if (this.disabled || !e.isPrimary || this.rippleStartEvent && this.rippleStartEvent.pointerId !== e.pointerId)
      return !1;
    if (e.type === "pointerenter" || e.type === "pointerleave")
      return !this.isTouch(e);
    const t = e.buttons === 1;
    return this.isTouch(e) || t;
  }
  isTouch({ pointerType: e }) {
    return e === "touch";
  }
  /** @private */
  async handleEvent(e) {
    if (!$r?.matches)
      switch (e.type) {
        case "click":
          this.handleClick();
          break;
        case "contextmenu":
          this.handleContextmenu();
          break;
        case "pointercancel":
          this.handlePointercancel(e);
          break;
        case "pointerdown":
          await this.handlePointerdown(e);
          break;
        case "pointerenter":
          this.handlePointerenter(e);
          break;
        case "pointerleave":
          this.handlePointerleave(e);
          break;
        case "pointerup":
          this.handlePointerup(e);
          break;
      }
  }
  onControlChange(e, t) {
    for (const r of _r)
      e?.removeEventListener(r, this), t?.addEventListener(r, this);
  }
}
s([
  d({ type: Boolean, reflect: !0 })
], ie.prototype, "disabled", void 0);
s([
  g()
], ie.prototype, "hovered", void 0);
s([
  g()
], ie.prototype, "pressed", void 0);
s([
  w(".surface")
], ie.prototype, "mdRoot", void 0);
const Ar = _`:host{display:flex;margin:auto;pointer-events:none}:host([disabled]){display:none}@media(forced-colors: active){:host{display:none}}:host,.surface{border-radius:inherit;position:absolute;inset:0;overflow:hidden}.surface{-webkit-tap-highlight-color:rgba(0,0,0,0)}.surface::before,.surface::after{content:"";opacity:0;position:absolute}.surface::before{background-color:var(--md-ripple-hover-color, var(--md-sys-color-on-surface, #1d1b20));inset:0;transition:opacity 15ms linear,background-color 15ms linear}.surface::after{background:radial-gradient(closest-side, var(--md-ripple-pressed-color, var(--md-sys-color-on-surface, #1d1b20)) max(100% - 70px, 65%), transparent 100%);transform-origin:center center;transition:opacity 375ms linear}.hovered::before{background-color:var(--md-ripple-hover-color, var(--md-sys-color-on-surface, #1d1b20));opacity:var(--md-ripple-hover-opacity, 0.08)}.pressed::after{opacity:var(--md-ripple-pressed-opacity, 0.12);transition-duration:105ms}
`;
let Se = class extends ie {
};
Se.styles = [Ar];
Se = s([
  S("md-ripple")
], Se);
const It = [
  "role",
  "ariaAtomic",
  "ariaAutoComplete",
  "ariaBusy",
  "ariaChecked",
  "ariaColCount",
  "ariaColIndex",
  "ariaColSpan",
  "ariaCurrent",
  "ariaDisabled",
  "ariaExpanded",
  "ariaHasPopup",
  "ariaHidden",
  "ariaInvalid",
  "ariaKeyShortcuts",
  "ariaLabel",
  "ariaLevel",
  "ariaLive",
  "ariaModal",
  "ariaMultiLine",
  "ariaMultiSelectable",
  "ariaOrientation",
  "ariaPlaceholder",
  "ariaPosInSet",
  "ariaPressed",
  "ariaReadOnly",
  "ariaRequired",
  "ariaRoleDescription",
  "ariaRowCount",
  "ariaRowIndex",
  "ariaRowSpan",
  "ariaSelected",
  "ariaSetSize",
  "ariaSort",
  "ariaValueMax",
  "ariaValueMin",
  "ariaValueNow",
  "ariaValueText"
], kr = It.map(Rt);
function $e(i) {
  return kr.includes(i);
}
function Rt(i) {
  return i.replace("aria", "aria-").replace(/Elements?/g, "").toLowerCase();
}
const ae = /* @__PURE__ */ Symbol("privateIgnoreAttributeChangesFor");
function oe(i) {
  var e;
  class t extends i {
    constructor() {
      super(...arguments), this[e] = /* @__PURE__ */ new Set();
    }
    attributeChangedCallback(o, a, n) {
      if (!$e(o)) {
        super.attributeChangedCallback(o, a, n);
        return;
      }
      if (this[ae].has(o))
        return;
      this[ae].add(o), this.removeAttribute(o), this[ae].delete(o);
      const c = Re(o);
      n === null ? delete this.dataset[c] : this.dataset[c] = n, this.requestUpdate(Re(o), a);
    }
    getAttribute(o) {
      return $e(o) ? super.getAttribute(Ie(o)) : super.getAttribute(o);
    }
    removeAttribute(o) {
      super.removeAttribute(o), $e(o) && (super.removeAttribute(Ie(o)), this.requestUpdate());
    }
  }
  return e = ae, Cr(t), t;
}
function Cr(i) {
  for (const e of It) {
    const t = Rt(e), r = Ie(t), o = Re(t);
    i.createProperty(e, {
      attribute: t,
      noAccessor: !0
    }), i.createProperty(Symbol(r), {
      attribute: r,
      noAccessor: !0
    }), Object.defineProperty(i.prototype, e, {
      configurable: !0,
      enumerable: !0,
      get() {
        return this.dataset[o] ?? null;
      },
      set(a) {
        const n = this.dataset[o] ?? null;
        a !== n && (a === null ? delete this.dataset[o] : this.dataset[o] = a, this.requestUpdate(e, n));
      }
    });
  }
}
function Ie(i) {
  return `data-${i}`;
}
function Re(i) {
  return i.replace(/-\w/, (e) => e[1].toUpperCase());
}
const E = /* @__PURE__ */ Symbol("internals"), Ae = /* @__PURE__ */ Symbol("privateInternals");
function xe(i) {
  class e extends i {
    get [E]() {
      return this[Ae] || (this[Ae] = this.attachInternals()), this[Ae];
    }
  }
  return e;
}
function zt(i) {
  i.addInitializer((e) => {
    const t = e;
    t.addEventListener("click", async (r) => {
      const { type: o, [E]: a } = t, { form: n } = a;
      if (!(!n || o === "button") && (await new Promise((c) => {
        setTimeout(c);
      }), !r.defaultPrevented)) {
        if (o === "reset") {
          n.reset();
          return;
        }
        n.addEventListener("submit", (c) => {
          Object.defineProperty(c, "submitter", {
            configurable: !0,
            enumerable: !0,
            get: () => t
          });
        }, { capture: !0, once: !0 }), a.setFormValue(t.value), n.requestSubmit();
      }
    });
  });
}
function Ot(i) {
  const e = new MouseEvent("click", { bubbles: !0 });
  return i.dispatchEvent(e), e;
}
function Dt(i) {
  return i.currentTarget !== i.target || i.composedPath()[0] !== i.target || i.target.disabled ? !1 : !Er(i);
}
function Er(i) {
  const e = ze;
  return e && (i.preventDefault(), i.stopImmediatePropagation()), Tr(), e;
}
let ze = !1;
async function Tr() {
  ze = !0, await null, ze = !1;
}
const Sr = oe(xe($));
class A extends Sr {
  get name() {
    return this.getAttribute("name") ?? "";
  }
  set name(e) {
    this.setAttribute("name", e);
  }
  /**
   * The associated form element with which this element's value will submit.
   */
  get form() {
    return this[E].form;
  }
  constructor() {
    super(), this.disabled = !1, this.softDisabled = !1, this.href = "", this.download = "", this.target = "", this.trailingIcon = !1, this.hasIcon = !1, this.type = "submit", this.value = "", this.addEventListener("click", this.handleClick.bind(this));
  }
  focus() {
    this.buttonElement?.focus();
  }
  blur() {
    this.buttonElement?.blur();
  }
  render() {
    const e = this.disabled || this.softDisabled, t = this.href ? this.renderLink() : this.renderButton(), r = this.href ? "link" : "button";
    return u`
      ${this.renderElevationOrOutline?.()}
      <div class="background"></div>
      <md-focus-ring part="focus-ring" for=${r}></md-focus-ring>
      <md-ripple
        part="ripple"
        for=${r}
        ?disabled="${e}"></md-ripple>
      ${t}
    `;
  }
  renderButton() {
    const { ariaLabel: e, ariaHasPopup: t, ariaExpanded: r } = this;
    return u`<button
      id="button"
      class="button"
      ?disabled=${this.disabled}
      aria-disabled=${this.softDisabled || l}
      aria-label="${e || l}"
      aria-haspopup="${t || l}"
      aria-expanded="${r || l}">
      ${this.renderContent()}
    </button>`;
  }
  renderLink() {
    const { ariaLabel: e, ariaHasPopup: t, ariaExpanded: r } = this;
    return u`<a
      id="link"
      class="button"
      aria-label="${e || l}"
      aria-haspopup="${t || l}"
      aria-expanded="${r || l}"
      aria-disabled=${this.disabled || this.softDisabled || l}
      tabindex="${this.disabled && !this.softDisabled ? -1 : l}"
      href=${this.href}
      download=${this.download || l}
      target=${this.target || l}
      >${this.renderContent()}
    </a>`;
  }
  renderContent() {
    const e = u`<slot
      name="icon"
      @slotchange="${this.handleSlotChange}"></slot>`;
    return u`
      <span class="touch"></span>
      ${this.trailingIcon ? l : e}
      <span class="label"><slot></slot></span>
      ${this.trailingIcon ? e : l}
    `;
  }
  handleClick(e) {
    if (this.softDisabled || this.disabled && this.href) {
      e.stopImmediatePropagation(), e.preventDefault();
      return;
    }
    !Dt(e) || !this.buttonElement || (this.focus(), Ot(this.buttonElement));
  }
  handleSlotChange() {
    this.hasIcon = this.assignedIcons.length > 0;
  }
}
zt(A);
A.formAssociated = !0;
A.shadowRootOptions = {
  mode: "open",
  delegatesFocus: !0
};
s([
  d({ type: Boolean, reflect: !0 })
], A.prototype, "disabled", void 0);
s([
  d({ type: Boolean, attribute: "soft-disabled", reflect: !0 })
], A.prototype, "softDisabled", void 0);
s([
  d()
], A.prototype, "href", void 0);
s([
  d()
], A.prototype, "download", void 0);
s([
  d()
], A.prototype, "target", void 0);
s([
  d({ type: Boolean, attribute: "trailing-icon", reflect: !0 })
], A.prototype, "trailingIcon", void 0);
s([
  d({ type: Boolean, attribute: "has-icon", reflect: !0 })
], A.prototype, "hasIcon", void 0);
s([
  d()
], A.prototype, "type", void 0);
s([
  d({ reflect: !0 })
], A.prototype, "value", void 0);
s([
  w(".button")
], A.prototype, "buttonElement", void 0);
s([
  ge({ slot: "icon", flatten: !0 })
], A.prototype, "assignedIcons", void 0);
class Ir extends A {
  renderElevationOrOutline() {
    return u`<md-elevation part="elevation"></md-elevation>`;
  }
}
const Rr = _`:host{--_container-color: var(--md-filled-button-container-color, var(--md-sys-color-primary, #6750a4));--_container-elevation: var(--md-filled-button-container-elevation, 0);--_container-height: var(--md-filled-button-container-height, 40px);--_container-shadow-color: var(--md-filled-button-container-shadow-color, var(--md-sys-color-shadow, #000));--_disabled-container-color: var(--md-filled-button-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-container-elevation: var(--md-filled-button-disabled-container-elevation, 0);--_disabled-container-opacity: var(--md-filled-button-disabled-container-opacity, 0.12);--_disabled-label-text-color: var(--md-filled-button-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-filled-button-disabled-label-text-opacity, 0.38);--_focus-container-elevation: var(--md-filled-button-focus-container-elevation, 0);--_focus-label-text-color: var(--md-filled-button-focus-label-text-color, var(--md-sys-color-on-primary, #fff));--_hover-container-elevation: var(--md-filled-button-hover-container-elevation, 1);--_hover-label-text-color: var(--md-filled-button-hover-label-text-color, var(--md-sys-color-on-primary, #fff));--_hover-state-layer-color: var(--md-filled-button-hover-state-layer-color, var(--md-sys-color-on-primary, #fff));--_hover-state-layer-opacity: var(--md-filled-button-hover-state-layer-opacity, 0.08);--_label-text-color: var(--md-filled-button-label-text-color, var(--md-sys-color-on-primary, #fff));--_label-text-font: var(--md-filled-button-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-filled-button-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-filled-button-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-filled-button-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_pressed-container-elevation: var(--md-filled-button-pressed-container-elevation, 0);--_pressed-label-text-color: var(--md-filled-button-pressed-label-text-color, var(--md-sys-color-on-primary, #fff));--_pressed-state-layer-color: var(--md-filled-button-pressed-state-layer-color, var(--md-sys-color-on-primary, #fff));--_pressed-state-layer-opacity: var(--md-filled-button-pressed-state-layer-opacity, 0.12);--_disabled-icon-color: var(--md-filled-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-filled-button-disabled-icon-opacity, 0.38);--_focus-icon-color: var(--md-filled-button-focus-icon-color, var(--md-sys-color-on-primary, #fff));--_hover-icon-color: var(--md-filled-button-hover-icon-color, var(--md-sys-color-on-primary, #fff));--_icon-color: var(--md-filled-button-icon-color, var(--md-sys-color-on-primary, #fff));--_icon-size: var(--md-filled-button-icon-size, 18px);--_pressed-icon-color: var(--md-filled-button-pressed-icon-color, var(--md-sys-color-on-primary, #fff));--_container-shape-start-start: var(--md-filled-button-container-shape-start-start, var(--md-filled-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-start-end: var(--md-filled-button-container-shape-start-end, var(--md-filled-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-end: var(--md-filled-button-container-shape-end-end, var(--md-filled-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-start: var(--md-filled-button-container-shape-end-start, var(--md-filled-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_leading-space: var(--md-filled-button-leading-space, 24px);--_trailing-space: var(--md-filled-button-trailing-space, 24px);--_with-leading-icon-leading-space: var(--md-filled-button-with-leading-icon-leading-space, 16px);--_with-leading-icon-trailing-space: var(--md-filled-button-with-leading-icon-trailing-space, 24px);--_with-trailing-icon-leading-space: var(--md-filled-button-with-trailing-icon-leading-space, 24px);--_with-trailing-icon-trailing-space: var(--md-filled-button-with-trailing-icon-trailing-space, 16px)}
`;
const zr = _`md-elevation{transition-duration:280ms}:host(:is([disabled],[soft-disabled])) md-elevation{transition:none}md-elevation{--md-elevation-level: var(--_container-elevation);--md-elevation-shadow-color: var(--_container-shadow-color)}:host(:focus-within) md-elevation{--md-elevation-level: var(--_focus-container-elevation)}:host(:hover) md-elevation{--md-elevation-level: var(--_hover-container-elevation)}:host(:active) md-elevation{--md-elevation-level: var(--_pressed-container-elevation)}:host(:is([disabled],[soft-disabled])) md-elevation{--md-elevation-level: var(--_disabled-container-elevation)}
`;
const Qe = _`:host{border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end);box-sizing:border-box;cursor:pointer;display:inline-flex;gap:8px;min-height:var(--_container-height);outline:none;padding-block:calc((var(--_container-height) - max(var(--_label-text-line-height),var(--_icon-size)))/2);padding-inline-start:var(--_leading-space);padding-inline-end:var(--_trailing-space);place-content:center;place-items:center;position:relative;font-family:var(--_label-text-font);font-size:var(--_label-text-size);line-height:var(--_label-text-line-height);font-weight:var(--_label-text-weight);text-overflow:ellipsis;text-wrap:nowrap;user-select:none;-webkit-tap-highlight-color:rgba(0,0,0,0);vertical-align:top;--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}md-focus-ring{--md-focus-ring-shape-start-start: var(--_container-shape-start-start);--md-focus-ring-shape-start-end: var(--_container-shape-start-end);--md-focus-ring-shape-end-end: var(--_container-shape-end-end);--md-focus-ring-shape-end-start: var(--_container-shape-end-start)}:host(:is([disabled],[soft-disabled])){cursor:default;pointer-events:none}.button{border-radius:inherit;cursor:inherit;display:inline-flex;align-items:center;justify-content:center;border:none;outline:none;-webkit-appearance:none;vertical-align:middle;background:rgba(0,0,0,0);text-decoration:none;min-width:calc(64px - var(--_leading-space) - var(--_trailing-space));width:100%;z-index:0;height:100%;font:inherit;color:var(--_label-text-color);padding:0;gap:inherit;text-transform:inherit}.button::-moz-focus-inner{padding:0;border:0}:host(:hover) .button{color:var(--_hover-label-text-color)}:host(:focus-within) .button{color:var(--_focus-label-text-color)}:host(:active) .button{color:var(--_pressed-label-text-color)}.background{background:var(--_container-color);border-radius:inherit;inset:0;position:absolute}.label{overflow:hidden}:is(.button,.label,.label slot),.label ::slotted(*){text-overflow:inherit}:host(:is([disabled],[soft-disabled])) .label{color:var(--_disabled-label-text-color);opacity:var(--_disabled-label-text-opacity)}:host(:is([disabled],[soft-disabled])) .background{background:var(--_disabled-container-color);opacity:var(--_disabled-container-opacity)}@media(forced-colors: active){.background{border:1px solid CanvasText}:host(:is([disabled],[soft-disabled])){--_disabled-icon-color: GrayText;--_disabled-icon-opacity: 1;--_disabled-container-opacity: 1;--_disabled-label-text-color: GrayText;--_disabled-label-text-opacity: 1}}:host([has-icon]:not([trailing-icon])){padding-inline-start:var(--_with-leading-icon-leading-space);padding-inline-end:var(--_with-leading-icon-trailing-space)}:host([has-icon][trailing-icon]){padding-inline-start:var(--_with-trailing-icon-leading-space);padding-inline-end:var(--_with-trailing-icon-trailing-space)}::slotted([slot=icon]){display:inline-flex;position:relative;writing-mode:horizontal-tb;fill:currentColor;flex-shrink:0;color:var(--_icon-color);font-size:var(--_icon-size);inline-size:var(--_icon-size);block-size:var(--_icon-size)}:host(:hover) ::slotted([slot=icon]){color:var(--_hover-icon-color)}:host(:focus-within) ::slotted([slot=icon]){color:var(--_focus-icon-color)}:host(:active) ::slotted([slot=icon]){color:var(--_pressed-icon-color)}:host(:is([disabled],[soft-disabled])) ::slotted([slot=icon]){color:var(--_disabled-icon-color);opacity:var(--_disabled-icon-opacity)}.touch{position:absolute;top:50%;height:48px;left:0;right:0;transform:translateY(-50%)}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--_container-height))/2) 0}:host([touch-target=none]) .touch{display:none}
`;
let Oe = class extends Ir {
};
Oe.styles = [
  Qe,
  zr,
  Rr
];
Oe = s([
  S("md-filled-button")
], Oe);
class Or extends A {
  renderElevationOrOutline() {
    return u`<div class="outline"></div>`;
  }
}
const Dr = _`:host{--_container-height: var(--md-outlined-button-container-height, 40px);--_disabled-label-text-color: var(--md-outlined-button-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-outlined-button-disabled-label-text-opacity, 0.38);--_disabled-outline-color: var(--md-outlined-button-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-outline-opacity: var(--md-outlined-button-disabled-outline-opacity, 0.12);--_focus-label-text-color: var(--md-outlined-button-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_hover-label-text-color: var(--md-outlined-button-hover-label-text-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-color: var(--md-outlined-button-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-opacity: var(--md-outlined-button-hover-state-layer-opacity, 0.08);--_label-text-color: var(--md-outlined-button-label-text-color, var(--md-sys-color-primary, #6750a4));--_label-text-font: var(--md-outlined-button-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-outlined-button-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-outlined-button-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-outlined-button-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_outline-color: var(--md-outlined-button-outline-color, var(--md-sys-color-outline, #79747e));--_outline-width: var(--md-outlined-button-outline-width, 1px);--_pressed-label-text-color: var(--md-outlined-button-pressed-label-text-color, var(--md-sys-color-primary, #6750a4));--_pressed-outline-color: var(--md-outlined-button-pressed-outline-color, var(--md-sys-color-outline, #79747e));--_pressed-state-layer-color: var(--md-outlined-button-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-opacity: var(--md-outlined-button-pressed-state-layer-opacity, 0.12);--_disabled-icon-color: var(--md-outlined-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-outlined-button-disabled-icon-opacity, 0.38);--_focus-icon-color: var(--md-outlined-button-focus-icon-color, var(--md-sys-color-primary, #6750a4));--_hover-icon-color: var(--md-outlined-button-hover-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-color: var(--md-outlined-button-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-size: var(--md-outlined-button-icon-size, 18px);--_pressed-icon-color: var(--md-outlined-button-pressed-icon-color, var(--md-sys-color-primary, #6750a4));--_container-shape-start-start: var(--md-outlined-button-container-shape-start-start, var(--md-outlined-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-start-end: var(--md-outlined-button-container-shape-start-end, var(--md-outlined-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-end: var(--md-outlined-button-container-shape-end-end, var(--md-outlined-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-start: var(--md-outlined-button-container-shape-end-start, var(--md-outlined-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_leading-space: var(--md-outlined-button-leading-space, 24px);--_trailing-space: var(--md-outlined-button-trailing-space, 24px);--_with-leading-icon-leading-space: var(--md-outlined-button-with-leading-icon-leading-space, 16px);--_with-leading-icon-trailing-space: var(--md-outlined-button-with-leading-icon-trailing-space, 24px);--_with-trailing-icon-leading-space: var(--md-outlined-button-with-trailing-icon-leading-space, 24px);--_with-trailing-icon-trailing-space: var(--md-outlined-button-with-trailing-icon-trailing-space, 16px);--_container-color: none;--_disabled-container-color: none;--_disabled-container-opacity: 0}.outline{inset:0;border-style:solid;position:absolute;box-sizing:border-box;border-color:var(--_outline-color);border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end)}:host(:active) .outline{border-color:var(--_pressed-outline-color)}:host(:is([disabled],[soft-disabled])) .outline{border-color:var(--_disabled-outline-color);opacity:var(--_disabled-outline-opacity)}@media(forced-colors: active){:host(:is([disabled],[soft-disabled])) .background{border-color:GrayText}:host(:is([disabled],[soft-disabled])) .outline{opacity:1}}.outline,md-ripple{border-width:var(--_outline-width)}md-ripple{inline-size:calc(100% - 2*var(--_outline-width));block-size:calc(100% - 2*var(--_outline-width));border-style:solid;border-color:rgba(0,0,0,0)}
`;
let De = class extends Or {
};
De.styles = [Qe, Dr];
De = s([
  S("md-outlined-button")
], De);
class Pr extends A {
}
const Mr = _`:host{--_container-height: var(--md-text-button-container-height, 40px);--_disabled-label-text-color: var(--md-text-button-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-text-button-disabled-label-text-opacity, 0.38);--_focus-label-text-color: var(--md-text-button-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_hover-label-text-color: var(--md-text-button-hover-label-text-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-color: var(--md-text-button-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-opacity: var(--md-text-button-hover-state-layer-opacity, 0.08);--_label-text-color: var(--md-text-button-label-text-color, var(--md-sys-color-primary, #6750a4));--_label-text-font: var(--md-text-button-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-text-button-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-text-button-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-text-button-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_pressed-label-text-color: var(--md-text-button-pressed-label-text-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-color: var(--md-text-button-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-opacity: var(--md-text-button-pressed-state-layer-opacity, 0.12);--_disabled-icon-color: var(--md-text-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-text-button-disabled-icon-opacity, 0.38);--_focus-icon-color: var(--md-text-button-focus-icon-color, var(--md-sys-color-primary, #6750a4));--_hover-icon-color: var(--md-text-button-hover-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-color: var(--md-text-button-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-size: var(--md-text-button-icon-size, 18px);--_pressed-icon-color: var(--md-text-button-pressed-icon-color, var(--md-sys-color-primary, #6750a4));--_container-shape-start-start: var(--md-text-button-container-shape-start-start, var(--md-text-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-start-end: var(--md-text-button-container-shape-start-end, var(--md-text-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-end: var(--md-text-button-container-shape-end-end, var(--md-text-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-start: var(--md-text-button-container-shape-end-start, var(--md-text-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_leading-space: var(--md-text-button-leading-space, 12px);--_trailing-space: var(--md-text-button-trailing-space, 12px);--_with-leading-icon-leading-space: var(--md-text-button-with-leading-icon-leading-space, 12px);--_with-leading-icon-trailing-space: var(--md-text-button-with-leading-icon-trailing-space, 16px);--_with-trailing-icon-leading-space: var(--md-text-button-with-trailing-icon-leading-space, 16px);--_with-trailing-icon-trailing-space: var(--md-text-button-with-trailing-icon-trailing-space, 12px);--_container-color: none;--_disabled-container-color: none;--_disabled-container-opacity: 0}
`;
let Pe = class extends Pr {
};
Pe.styles = [Qe, Mr];
Pe = s([
  S("md-text-button")
], Pe);
function et(i, e) {
  e.bubbles && (!i.shadowRoot || e.composed) && e.stopPropagation();
  const t = Reflect.construct(e.constructor, [e.type, e]), r = i.dispatchEvent(t);
  return r || e.preventDefault(), r;
}
const me = /* @__PURE__ */ Symbol("createValidator"), ve = /* @__PURE__ */ Symbol("getValidityAnchor"), ke = /* @__PURE__ */ Symbol("privateValidator"), D = /* @__PURE__ */ Symbol("privateSyncValidity"), ne = /* @__PURE__ */ Symbol("privateCustomValidationMessage");
function Pt(i) {
  var e;
  class t extends i {
    constructor() {
      super(...arguments), this[e] = "";
    }
    get validity() {
      return this[D](), this[E].validity;
    }
    get validationMessage() {
      return this[D](), this[E].validationMessage;
    }
    get willValidate() {
      return this[D](), this[E].willValidate;
    }
    checkValidity() {
      return this[D](), this[E].checkValidity();
    }
    reportValidity() {
      return this[D](), this[E].reportValidity();
    }
    setCustomValidity(o) {
      this[ne] = o, this[D]();
    }
    requestUpdate(o, a, n) {
      super.requestUpdate(o, a, n), this[D]();
    }
    firstUpdated(o) {
      super.firstUpdated(o), this[D]();
    }
    [(e = ne, D)]() {
      this[ke] || (this[ke] = this[me]());
      const { validity: o, validationMessage: a } = this[ke].getValidity(), n = !!this[ne], c = this[ne] || a;
      this[E].setValidity({ ...o, customError: n }, c, this[ve]() ?? void 0);
    }
    [me]() {
      throw new Error("Implement [createValidator]");
    }
    [ve]() {
      throw new Error("Implement [getValidityAnchor]");
    }
  }
  return t;
}
const J = /* @__PURE__ */ Symbol("getFormValue"), Me = /* @__PURE__ */ Symbol("getFormState");
function Mt(i) {
  class e extends i {
    get form() {
      return this[E].form;
    }
    get labels() {
      return this[E].labels;
    }
    // Use @property for the `name` and `disabled` properties to add them to the
    // `observedAttributes` array and trigger `attributeChangedCallback()`.
    //
    // We don't use Lit's default getter/setter (`noAccessor: true`) because
    // the attributes need to be updated synchronously to work with synchronous
    // form APIs, and Lit updates attributes async by default.
    get name() {
      return this.getAttribute("name") ?? "";
    }
    set name(r) {
      this.setAttribute("name", r);
    }
    get disabled() {
      return this.hasAttribute("disabled");
    }
    set disabled(r) {
      this.toggleAttribute("disabled", r);
    }
    attributeChangedCallback(r, o, a) {
      if (r === "name" || r === "disabled") {
        const n = r === "disabled" ? o !== null : o;
        this.requestUpdate(r, n);
        return;
      }
      super.attributeChangedCallback(r, o, a);
    }
    requestUpdate(r, o, a) {
      super.requestUpdate(r, o, a), this[E].setFormValue(this[J](), this[Me]());
    }
    [J]() {
      throw new Error("Implement [getFormValue]");
    }
    [Me]() {
      return this[J]();
    }
    formDisabledCallback(r) {
      this.disabled = r;
    }
  }
  return e.formAssociated = !0, s([
    d({ noAccessor: !0 })
  ], e.prototype, "name", null), s([
    d({ type: Boolean, noAccessor: !0 })
  ], e.prototype, "disabled", null), e;
}
class Lt {
  /**
   * Creates a new validator.
   *
   * @param getCurrentState A callback that returns the current state of
   *     constraint validation-related properties.
   */
  constructor(e) {
    this.getCurrentState = e, this.currentValidity = {
      validity: {},
      validationMessage: ""
    };
  }
  /**
   * Returns the current `ValidityStateFlags` and validation message for the
   * validator.
   *
   * If the constraint validation state has not changed, this will return a
   * cached result. This is important since `getValidity()` can be called
   * frequently in response to synchronous property changes.
   *
   * @return The current validity and validation message.
   */
  getValidity() {
    const e = this.getCurrentState();
    if (!(!this.prevState || !this.equals(this.prevState, e)))
      return this.currentValidity;
    const { validity: r, validationMessage: o } = this.computeValidity(e);
    return this.prevState = this.copy(e), this.currentValidity = {
      validationMessage: o,
      validity: {
        // Change any `ValidityState` instances into `ValidityStateFlags` since
        // `ValidityState` cannot be easily `{...spread}`.
        badInput: r.badInput,
        customError: r.customError,
        patternMismatch: r.patternMismatch,
        rangeOverflow: r.rangeOverflow,
        rangeUnderflow: r.rangeUnderflow,
        stepMismatch: r.stepMismatch,
        tooLong: r.tooLong,
        tooShort: r.tooShort,
        typeMismatch: r.typeMismatch,
        valueMissing: r.valueMissing
      }
    }, this.currentValidity;
  }
}
class Lr extends Lt {
  computeValidity(e) {
    return this.checkboxControl || (this.checkboxControl = document.createElement("input"), this.checkboxControl.type = "checkbox"), this.checkboxControl.checked = e.checked, this.checkboxControl.required = e.required, {
      validity: this.checkboxControl.validity,
      validationMessage: this.checkboxControl.validationMessage
    };
  }
  equals(e, t) {
    return e.checked === t.checked && e.required === t.required;
  }
  copy({ checked: e, required: t }) {
    return { checked: e, required: t };
  }
}
const Fr = oe(Pt(Mt(xe($))));
class z extends Fr {
  constructor() {
    super(), this.checked = !1, this.indeterminate = !1, this.required = !1, this.value = "on", this.prevChecked = !1, this.prevDisabled = !1, this.prevIndeterminate = !1, this.addEventListener("click", (e) => {
      !Dt(e) || !this.input || (this.focus(), Ot(this.input));
    });
  }
  update(e) {
    (e.has("checked") || e.has("disabled") || e.has("indeterminate")) && (this.prevChecked = e.get("checked") ?? this.checked, this.prevDisabled = e.get("disabled") ?? this.disabled, this.prevIndeterminate = e.get("indeterminate") ?? this.indeterminate), super.update(e);
  }
  render() {
    const e = !this.prevChecked && !this.prevIndeterminate, t = this.prevChecked && !this.prevIndeterminate, r = this.prevIndeterminate, o = this.checked && !this.indeterminate, a = this.indeterminate, n = F({
      disabled: this.disabled,
      selected: o || a,
      unselected: !o && !a,
      checked: o,
      indeterminate: a,
      "prev-unselected": e,
      "prev-checked": t,
      "prev-indeterminate": r,
      "prev-disabled": this.prevDisabled
    }), { ariaLabel: c, ariaInvalid: h } = this;
    return u`
      <div class="container ${n}">
        <input
          type="checkbox"
          id="input"
          aria-checked=${a ? "mixed" : l}
          aria-label=${c || l}
          aria-invalid=${h || l}
          ?disabled=${this.disabled}
          ?required=${this.required}
          .indeterminate=${this.indeterminate}
          .checked=${this.checked}
          @input=${this.handleInput}
          @change=${this.handleChange} />

        <div class="outline"></div>
        <div class="background"></div>
        <md-focus-ring part="focus-ring" for="input"></md-focus-ring>
        <md-ripple for="input" ?disabled=${this.disabled}></md-ripple>
        <svg class="icon" viewBox="0 0 18 18" aria-hidden="true">
          <rect class="mark short" />
          <rect class="mark long" />
        </svg>
      </div>
    `;
  }
  handleInput(e) {
    const t = e.target;
    this.checked = t.checked, this.indeterminate = t.indeterminate;
  }
  handleChange(e) {
    et(this, e);
  }
  [J]() {
    return !this.checked || this.indeterminate ? null : this.value;
  }
  [Me]() {
    return String(this.checked);
  }
  formResetCallback() {
    this.checked = this.hasAttribute("checked");
  }
  formStateRestoreCallback(e) {
    this.checked = e === "true";
  }
  [me]() {
    return new Lr(() => this);
  }
  [ve]() {
    return this.input;
  }
}
z.shadowRootOptions = {
  ...$.shadowRootOptions,
  delegatesFocus: !0
};
s([
  d({ type: Boolean })
], z.prototype, "checked", void 0);
s([
  d({ type: Boolean })
], z.prototype, "indeterminate", void 0);
s([
  d({ type: Boolean })
], z.prototype, "required", void 0);
s([
  d()
], z.prototype, "value", void 0);
s([
  g()
], z.prototype, "prevChecked", void 0);
s([
  g()
], z.prototype, "prevDisabled", void 0);
s([
  g()
], z.prototype, "prevIndeterminate", void 0);
s([
  w("input")
], z.prototype, "input", void 0);
const Nr = _`:host{border-start-start-radius:var(--md-checkbox-container-shape-start-start, var(--md-checkbox-container-shape, 2px));border-start-end-radius:var(--md-checkbox-container-shape-start-end, var(--md-checkbox-container-shape, 2px));border-end-end-radius:var(--md-checkbox-container-shape-end-end, var(--md-checkbox-container-shape, 2px));border-end-start-radius:var(--md-checkbox-container-shape-end-start, var(--md-checkbox-container-shape, 2px));display:inline-flex;height:var(--md-checkbox-container-size, 18px);position:relative;vertical-align:top;width:var(--md-checkbox-container-size, 18px);-webkit-tap-highlight-color:rgba(0,0,0,0);cursor:pointer}:host([disabled]){cursor:default}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--md-checkbox-container-size, 18px))/2)}md-focus-ring{height:44px;inset:unset;width:44px}input{appearance:none;height:48px;margin:0;opacity:0;outline:none;position:absolute;width:48px;z-index:1;cursor:inherit}:host([touch-target=none]) input{height:100%;width:100%}.container{border-radius:inherit;display:flex;height:100%;place-content:center;place-items:center;position:relative;width:100%}.outline,.background,.icon{inset:0;position:absolute}.outline,.background{border-radius:inherit}.outline{border-color:var(--md-checkbox-outline-color, var(--md-sys-color-on-surface-variant, #49454f));border-style:solid;border-width:var(--md-checkbox-outline-width, 2px);box-sizing:border-box}.background{background-color:var(--md-checkbox-selected-container-color, var(--md-sys-color-primary, #6750a4))}.background,.icon{opacity:0;transition-duration:150ms,50ms;transition-property:transform,opacity;transition-timing-function:cubic-bezier(0.3, 0, 0.8, 0.15),linear;transform:scale(0.6)}:where(.selected) :is(.background,.icon){opacity:1;transition-duration:350ms,50ms;transition-timing-function:cubic-bezier(0.05, 0.7, 0.1, 1),linear;transform:scale(1)}md-ripple{border-radius:var(--md-checkbox-state-layer-shape, var(--md-sys-shape-corner-full, 9999px));height:var(--md-checkbox-state-layer-size, 40px);inset:unset;width:var(--md-checkbox-state-layer-size, 40px);--md-ripple-hover-color: var(--md-checkbox-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-hover-opacity: var(--md-checkbox-hover-state-layer-opacity, 0.08);--md-ripple-pressed-color: var(--md-checkbox-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--md-ripple-pressed-opacity: var(--md-checkbox-pressed-state-layer-opacity, 0.12)}.selected md-ripple{--md-ripple-hover-color: var(--md-checkbox-selected-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--md-ripple-hover-opacity: var(--md-checkbox-selected-hover-state-layer-opacity, 0.08);--md-ripple-pressed-color: var(--md-checkbox-selected-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-pressed-opacity: var(--md-checkbox-selected-pressed-state-layer-opacity, 0.12)}.icon{fill:var(--md-checkbox-selected-icon-color, var(--md-sys-color-on-primary, #fff));height:var(--md-checkbox-icon-size, 18px);width:var(--md-checkbox-icon-size, 18px)}.mark.short{height:2px;transition-property:transform,height;width:2px}.mark.long{height:2px;transition-property:transform,width;width:10px}.mark{animation-duration:150ms;animation-timing-function:cubic-bezier(0.3, 0, 0.8, 0.15);transition-duration:150ms;transition-timing-function:cubic-bezier(0.3, 0, 0.8, 0.15)}.selected .mark{animation-duration:350ms;animation-timing-function:cubic-bezier(0.05, 0.7, 0.1, 1);transition-duration:350ms;transition-timing-function:cubic-bezier(0.05, 0.7, 0.1, 1)}.checked .mark,.prev-checked.unselected .mark{transform:scaleY(-1) translate(7px, -14px) rotate(45deg)}.checked .mark.short,.prev-checked.unselected .mark.short{height:5.6568542495px}.checked .mark.long,.prev-checked.unselected .mark.long{width:11.313708499px}.indeterminate .mark,.prev-indeterminate.unselected .mark{transform:scaleY(-1) translate(4px, -10px) rotate(0deg)}.prev-unselected .mark{transition-property:none}.prev-unselected.checked .mark.long{animation-name:prev-unselected-to-checked}@keyframes prev-unselected-to-checked{from{width:0}}:where(:hover) .outline{border-color:var(--md-checkbox-hover-outline-color, var(--md-sys-color-on-surface, #1d1b20));border-width:var(--md-checkbox-hover-outline-width, 2px)}:where(:hover) .background{background:var(--md-checkbox-selected-hover-container-color, var(--md-sys-color-primary, #6750a4))}:where(:hover) .icon{fill:var(--md-checkbox-selected-hover-icon-color, var(--md-sys-color-on-primary, #fff))}:where(:focus-within) .outline{border-color:var(--md-checkbox-focus-outline-color, var(--md-sys-color-on-surface, #1d1b20));border-width:var(--md-checkbox-focus-outline-width, 2px)}:where(:focus-within) .background{background:var(--md-checkbox-selected-focus-container-color, var(--md-sys-color-primary, #6750a4))}:where(:focus-within) .icon{fill:var(--md-checkbox-selected-focus-icon-color, var(--md-sys-color-on-primary, #fff))}:where(:active) .outline{border-color:var(--md-checkbox-pressed-outline-color, var(--md-sys-color-on-surface, #1d1b20));border-width:var(--md-checkbox-pressed-outline-width, 2px)}:where(:active) .background{background:var(--md-checkbox-selected-pressed-container-color, var(--md-sys-color-primary, #6750a4))}:where(:active) .icon{fill:var(--md-checkbox-selected-pressed-icon-color, var(--md-sys-color-on-primary, #fff))}:where(.disabled,.prev-disabled) :is(.background,.icon,.mark){animation-duration:0s;transition-duration:0s}:where(.disabled) .outline{border-color:var(--md-checkbox-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));border-width:var(--md-checkbox-disabled-outline-width, 2px);opacity:var(--md-checkbox-disabled-container-opacity, 0.38)}:where(.selected.disabled) .outline{visibility:hidden}:where(.selected.disabled) .background{background:var(--md-checkbox-selected-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));opacity:var(--md-checkbox-selected-disabled-container-opacity, 0.38)}:where(.disabled) .icon{fill:var(--md-checkbox-selected-disabled-icon-color, var(--md-sys-color-surface, #fef7ff))}@media(forced-colors: active){.background{background-color:CanvasText}.selected.disabled .background{background-color:GrayText;opacity:1}.outline{border-color:CanvasText}.disabled .outline{border-color:GrayText;opacity:1}.icon{fill:Canvas}}
`;
let Le = class extends z {
};
Le.styles = [Nr];
Le = s([
  S("md-checkbox")
], Le);
class _e extends $ {
  constructor() {
    super(...arguments), this.inset = !1, this.insetStart = !1, this.insetEnd = !1;
  }
}
s([
  d({ type: Boolean, reflect: !0 })
], _e.prototype, "inset", void 0);
s([
  d({ type: Boolean, reflect: !0, attribute: "inset-start" })
], _e.prototype, "insetStart", void 0);
s([
  d({ type: Boolean, reflect: !0, attribute: "inset-end" })
], _e.prototype, "insetEnd", void 0);
const Br = _`:host{box-sizing:border-box;color:var(--md-divider-color, var(--md-sys-color-outline-variant, #cac4d0));display:flex;height:var(--md-divider-thickness, 1px);width:100%}:host([inset]),:host([inset-start]){padding-inline-start:16px}:host([inset]),:host([inset-end]){padding-inline-end:16px}:host::before{background:currentColor;content:"";height:100%;width:100%}@media(forced-colors: active){:host::before{background:CanvasText}}
`;
let Fe = class extends _e {
};
Fe.styles = [Br];
Fe = s([
  S("md-divider")
], Fe);
const Vr = {
  dialog: [
    [
      // Dialog slide down
      [{ transform: "translateY(-50px)" }, { transform: "translateY(0)" }],
      { duration: 500, easing: G.EMPHASIZED }
    ]
  ],
  scrim: [
    [
      // Scrim fade in
      [{ opacity: 0 }, { opacity: 0.32 }],
      { duration: 500, easing: "linear" }
    ]
  ],
  container: [
    [
      // Container fade in
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: 50, easing: "linear", pseudoElement: "::before" }
    ],
    [
      // Container grow
      // Note: current spec says to grow from 0dp->100% and shrink from
      // 100%->35%. We change this to 35%->100% to simplify the animation that
      // is supposed to clip content as it grows. From 0dp it's possible to see
      // text/actions appear before the container has fully grown.
      [{ height: "35%" }, { height: "100%" }],
      { duration: 500, easing: G.EMPHASIZED, pseudoElement: "::before" }
    ]
  ],
  headline: [
    [
      // Headline fade in
      [{ opacity: 0 }, { opacity: 0, offset: 0.2 }, { opacity: 1 }],
      { duration: 250, easing: "linear", fill: "forwards" }
    ]
  ],
  content: [
    [
      // Content fade in
      [{ opacity: 0 }, { opacity: 0, offset: 0.2 }, { opacity: 1 }],
      { duration: 250, easing: "linear", fill: "forwards" }
    ]
  ],
  actions: [
    [
      // Actions fade in
      [{ opacity: 0 }, { opacity: 0, offset: 0.5 }, { opacity: 1 }],
      { duration: 300, easing: "linear", fill: "forwards" }
    ]
  ]
}, Ur = {
  dialog: [
    [
      // Dialog slide up
      [{ transform: "translateY(0)" }, { transform: "translateY(-50px)" }],
      { duration: 150, easing: G.EMPHASIZED_ACCELERATE }
    ]
  ],
  scrim: [
    [
      // Scrim fade out
      [{ opacity: 0.32 }, { opacity: 0 }],
      { duration: 150, easing: "linear" }
    ]
  ],
  container: [
    [
      // Container shrink
      [{ height: "100%" }, { height: "35%" }],
      {
        duration: 150,
        easing: G.EMPHASIZED_ACCELERATE,
        pseudoElement: "::before"
      }
    ],
    [
      // Container fade out
      [{ opacity: "1" }, { opacity: "0" }],
      { delay: 100, duration: 50, easing: "linear", pseudoElement: "::before" }
    ]
  ],
  headline: [
    [
      // Headline fade out
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: 100, easing: "linear", fill: "forwards" }
    ]
  ],
  content: [
    [
      // Content fade out
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: 100, easing: "linear", fill: "forwards" }
    ]
  ],
  actions: [
    [
      // Actions fade out
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: 100, easing: "linear", fill: "forwards" }
    ]
  ]
};
const Hr = oe($);
class x extends Hr {
  // We do not use `delegatesFocus: true` due to a Chromium bug with
  // selecting text.
  // See https://bugs.chromium.org/p/chromium/issues/detail?id=950357
  /**
   * Opens the dialog when set to `true` and closes it when set to `false`.
   */
  get open() {
    return this.isOpen;
  }
  set open(e) {
    e !== this.isOpen && (this.isOpen = e, e ? (this.setAttribute("open", ""), this.show()) : (this.removeAttribute("open"), this.close()));
  }
  constructor() {
    super(), this.quick = !1, this.returnValue = "", this.noFocusTrap = !1, this.getOpenAnimation = () => Vr, this.getCloseAnimation = () => Ur, this.isOpen = !1, this.isOpening = !1, this.isConnectedPromise = this.getIsConnectedPromise(), this.isAtScrollTop = !1, this.isAtScrollBottom = !1, this.nextClickIsFromContent = !1, this.hasHeadline = !1, this.hasActions = !1, this.hasIcon = !1, this.escapePressedWithoutCancel = !1, this.treewalker = document.createTreeWalker(this, NodeFilter.SHOW_ELEMENT), this.addEventListener("submit", this.handleSubmit);
  }
  /**
   * Opens the dialog and fires a cancelable `open` event. After a dialog's
   * animation, an `opened` event is fired.
   *
   * Add an `autofocus` attribute to a child of the dialog that should
   * receive focus after opening.
   *
   * @return A Promise that resolves after the animation is finished and the
   *     `opened` event was fired.
   */
  async show() {
    this.isOpening = !0, await this.isConnectedPromise, await this.updateComplete;
    const e = this.dialog;
    if (e.open || !this.isOpening) {
      this.isOpening = !1;
      return;
    }
    if (!this.dispatchEvent(new Event("open", { cancelable: !0 }))) {
      this.open = !1, this.isOpening = !1;
      return;
    }
    e.showModal(), this.open = !0, this.scroller && (this.scroller.scrollTop = 0), this.querySelector("[autofocus]")?.focus(), await this.animateDialog(this.getOpenAnimation()), this.dispatchEvent(new Event("opened")), this.isOpening = !1;
  }
  /**
   * Closes the dialog and fires a cancelable `close` event. After a dialog's
   * animation, a `closed` event is fired.
   *
   * @param returnValue A return value usually indicating which button was used
   *     to close a dialog. If a dialog is canceled by clicking the scrim or
   *     pressing Escape, it will not change the return value after closing.
   * @return A Promise that resolves after the animation is finished and the
   *     `closed` event was fired.
   */
  async close(e = this.returnValue) {
    if (this.isOpening = !1, !this.isConnected) {
      this.open = !1;
      return;
    }
    await this.updateComplete;
    const t = this.dialog;
    if (!t.open || this.isOpening) {
      this.open = !1;
      return;
    }
    const r = this.returnValue;
    if (this.returnValue = e, !this.dispatchEvent(new Event("close", { cancelable: !0 }))) {
      this.returnValue = r;
      return;
    }
    await this.animateDialog(this.getCloseAnimation()), t.close(e), this.open = !1, this.dispatchEvent(new Event("closed"));
  }
  connectedCallback() {
    super.connectedCallback(), this.isConnectedPromiseResolve();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.isConnectedPromise = this.getIsConnectedPromise();
  }
  render() {
    const e = this.open && !(this.isAtScrollTop && this.isAtScrollBottom), t = {
      "has-headline": this.hasHeadline,
      "has-actions": this.hasActions,
      "has-icon": this.hasIcon,
      scrollable: e,
      "show-top-divider": e && !this.isAtScrollTop,
      "show-bottom-divider": e && !this.isAtScrollBottom
    }, r = this.open && !this.noFocusTrap, o = u`
      <div
        class="focus-trap"
        tabindex="0"
        aria-hidden="true"
        @focus=${this.handleFocusTrapFocus}></div>
    `, { ariaLabel: a } = this;
    return u`
      <div class="scrim"></div>
      <dialog
        class=${F(t)}
        aria-label=${a || l}
        aria-labelledby=${this.hasHeadline ? "headline" : l}
        role=${this.type === "alert" ? "alertdialog" : l}
        @cancel=${this.handleCancel}
        @click=${this.handleDialogClick}
        @close=${this.handleClose}
        @keydown=${this.handleKeydown}
        .returnValue=${this.returnValue || l}>
        ${r ? o : l}
        <div class="container" @click=${this.handleContentClick}>
          <div class="headline">
            <div class="icon" aria-hidden="true">
              <slot name="icon" @slotchange=${this.handleIconChange}></slot>
            </div>
            <h2 id="headline" aria-hidden=${!this.hasHeadline || l}>
              <slot
                name="headline"
                @slotchange=${this.handleHeadlineChange}></slot>
            </h2>
            <md-divider></md-divider>
          </div>
          <div class="scroller">
            <div class="content">
              <div class="top anchor"></div>
              <slot name="content"></slot>
              <div class="bottom anchor"></div>
            </div>
          </div>
          <div class="actions">
            <md-divider></md-divider>
            <slot name="actions" @slotchange=${this.handleActionsChange}></slot>
          </div>
        </div>
        ${r ? o : l}
      </dialog>
    `;
  }
  firstUpdated() {
    this.intersectionObserver = new IntersectionObserver((e) => {
      for (const t of e)
        this.handleAnchorIntersection(t);
    }, { root: this.scroller }), this.intersectionObserver.observe(this.topAnchor), this.intersectionObserver.observe(this.bottomAnchor);
  }
  handleDialogClick() {
    if (this.nextClickIsFromContent) {
      this.nextClickIsFromContent = !1;
      return;
    }
    this.dispatchEvent(new Event("cancel", { cancelable: !0 })) && this.close();
  }
  handleContentClick() {
    this.nextClickIsFromContent = !0;
  }
  handleSubmit(e) {
    const t = e.target, { submitter: r } = e;
    t.getAttribute("method") !== "dialog" || !r || this.close(r.getAttribute("value") ?? this.returnValue);
  }
  handleCancel(e) {
    if (e.target !== this.dialog)
      return;
    this.escapePressedWithoutCancel = !1;
    const t = !et(this, e);
    e.preventDefault(), !t && this.close();
  }
  handleClose() {
    this.escapePressedWithoutCancel && (this.escapePressedWithoutCancel = !1, this.dialog?.dispatchEvent(new Event("cancel", { cancelable: !0 })));
  }
  handleKeydown(e) {
    e.key === "Escape" && (this.escapePressedWithoutCancel = !0, setTimeout(() => {
      this.escapePressedWithoutCancel = !1;
    }));
  }
  async animateDialog(e) {
    if (this.cancelAnimations?.abort(), this.cancelAnimations = new AbortController(), this.quick)
      return;
    const { dialog: t, scrim: r, container: o, headline: a, content: n, actions: c } = this;
    if (!t || !r || !o || !a || !n || !c)
      return;
    const { container: h, dialog: v, scrim: b, headline: f, content: T, actions: I } = e, O = [
      [t, v ?? []],
      [r, b ?? []],
      [o, h ?? []],
      [a, f ?? []],
      [n, T ?? []],
      [c, I ?? []]
    ], Y = [];
    for (const [H, tt] of O)
      for (const q of tt) {
        const rt = H.animate(...q);
        this.cancelAnimations.signal.addEventListener("abort", () => {
          rt.cancel();
        }), Y.push(rt);
      }
    await Promise.all(Y.map((H) => H.finished.catch(() => {
    })));
  }
  handleHeadlineChange(e) {
    const t = e.target;
    this.hasHeadline = t.assignedElements().length > 0;
  }
  handleActionsChange(e) {
    const t = e.target;
    this.hasActions = t.assignedElements().length > 0;
  }
  handleIconChange(e) {
    const t = e.target;
    this.hasIcon = t.assignedElements().length > 0;
  }
  handleAnchorIntersection(e) {
    const { target: t, isIntersecting: r } = e;
    t === this.topAnchor && (this.isAtScrollTop = r), t === this.bottomAnchor && (this.isAtScrollBottom = r);
  }
  getIsConnectedPromise() {
    return new Promise((e) => {
      this.isConnectedPromiseResolve = e;
    });
  }
  handleFocusTrapFocus(e) {
    const [t, r] = this.getFirstAndLastFocusableChildren();
    if (!t || !r) {
      this.dialog?.focus();
      return;
    }
    const o = e.target === this.firstFocusTrap, a = !o, n = e.relatedTarget === t, c = e.relatedTarget === r, h = !n && !c;
    if (a && c || o && h) {
      t.focus();
      return;
    }
    if (o && n || a && h) {
      r.focus();
      return;
    }
  }
  getFirstAndLastFocusableChildren() {
    if (!this.treewalker)
      return [null, null];
    let e = null, t = null;
    for (this.treewalker.currentNode = this.treewalker.root; this.treewalker.nextNode(); ) {
      const r = this.treewalker.currentNode;
      qr(r) && (e || (e = r), t = r);
    }
    return [e, t];
  }
}
s([
  d({ type: Boolean })
], x.prototype, "open", null);
s([
  d({ type: Boolean })
], x.prototype, "quick", void 0);
s([
  d({ attribute: !1 })
], x.prototype, "returnValue", void 0);
s([
  d()
], x.prototype, "type", void 0);
s([
  d({ type: Boolean, attribute: "no-focus-trap" })
], x.prototype, "noFocusTrap", void 0);
s([
  w("dialog")
], x.prototype, "dialog", void 0);
s([
  w(".scrim")
], x.prototype, "scrim", void 0);
s([
  w(".container")
], x.prototype, "container", void 0);
s([
  w(".headline")
], x.prototype, "headline", void 0);
s([
  w(".content")
], x.prototype, "content", void 0);
s([
  w(".actions")
], x.prototype, "actions", void 0);
s([
  g()
], x.prototype, "isAtScrollTop", void 0);
s([
  g()
], x.prototype, "isAtScrollBottom", void 0);
s([
  w(".scroller")
], x.prototype, "scroller", void 0);
s([
  w(".top.anchor")
], x.prototype, "topAnchor", void 0);
s([
  w(".bottom.anchor")
], x.prototype, "bottomAnchor", void 0);
s([
  w(".focus-trap")
], x.prototype, "firstFocusTrap", void 0);
s([
  g()
], x.prototype, "hasHeadline", void 0);
s([
  g()
], x.prototype, "hasActions", void 0);
s([
  g()
], x.prototype, "hasIcon", void 0);
function qr(i) {
  const e = ":is(button,input,select,textarea,object,:is(a,area)[href],[tabindex],[contenteditable=true])", t = ":not(:disabled,[disabled])";
  return i.matches(e + t + ':not([tabindex^="-"])') ? !0 : !i.localName.includes("-") || !i.matches(t) ? !1 : i.shadowRoot?.delegatesFocus ?? !1;
}
const jr = _`:host{border-start-start-radius:var(--md-dialog-container-shape-start-start, var(--md-dialog-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));border-start-end-radius:var(--md-dialog-container-shape-start-end, var(--md-dialog-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));border-end-end-radius:var(--md-dialog-container-shape-end-end, var(--md-dialog-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));border-end-start-radius:var(--md-dialog-container-shape-end-start, var(--md-dialog-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));display:contents;margin:auto;max-height:min(560px,100% - 48px);max-width:min(560px,100% - 48px);min-height:140px;min-width:280px;position:fixed;height:fit-content;width:fit-content}dialog{background:rgba(0,0,0,0);border:none;border-radius:inherit;flex-direction:column;height:inherit;margin:inherit;max-height:inherit;max-width:inherit;min-height:inherit;min-width:inherit;outline:none;overflow:visible;padding:0;width:inherit}dialog[open]{display:flex}::backdrop{background:none}.scrim{background:var(--md-sys-color-scrim, #000);display:none;inset:0;opacity:32%;pointer-events:none;position:fixed;z-index:1}:host([open]) .scrim{display:flex}h2{all:unset;align-self:stretch}.headline{align-items:center;color:var(--md-dialog-headline-color, var(--md-sys-color-on-surface, #1d1b20));display:flex;flex-direction:column;font-family:var(--md-dialog-headline-font, var(--md-sys-typescale-headline-small-font, var(--md-ref-typeface-brand, Roboto)));font-size:var(--md-dialog-headline-size, var(--md-sys-typescale-headline-small-size, 1.5rem));line-height:var(--md-dialog-headline-line-height, var(--md-sys-typescale-headline-small-line-height, 2rem));font-weight:var(--md-dialog-headline-weight, var(--md-sys-typescale-headline-small-weight, var(--md-ref-typeface-weight-regular, 400)));position:relative}slot[name=headline]::slotted(*){align-items:center;align-self:stretch;box-sizing:border-box;display:flex;gap:8px;padding:24px 24px 0}.icon{display:flex}slot[name=icon]::slotted(*){color:var(--md-dialog-icon-color, var(--md-sys-color-secondary, #625b71));fill:currentColor;font-size:var(--md-dialog-icon-size, 24px);margin-top:24px;height:var(--md-dialog-icon-size, 24px);width:var(--md-dialog-icon-size, 24px)}.has-icon slot[name=headline]::slotted(*){justify-content:center;padding-top:16px}.scrollable slot[name=headline]::slotted(*){padding-bottom:16px}.scrollable.has-headline slot[name=content]::slotted(*){padding-top:8px}.container{border-radius:inherit;display:flex;flex-direction:column;flex-grow:1;overflow:hidden;position:relative;transform-origin:top}.container::before{background:var(--md-dialog-container-color, var(--md-sys-color-surface-container-high, #ece6f0));border-radius:inherit;content:"";inset:0;position:absolute}.scroller{display:flex;flex:1;flex-direction:column;overflow:hidden;z-index:1}.scrollable .scroller{overflow-y:scroll}.content{color:var(--md-dialog-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));font-family:var(--md-dialog-supporting-text-font, var(--md-sys-typescale-body-medium-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-dialog-supporting-text-size, var(--md-sys-typescale-body-medium-size, 0.875rem));line-height:var(--md-dialog-supporting-text-line-height, var(--md-sys-typescale-body-medium-line-height, 1.25rem));flex:1;font-weight:var(--md-dialog-supporting-text-weight, var(--md-sys-typescale-body-medium-weight, var(--md-ref-typeface-weight-regular, 400)));height:min-content;position:relative}slot[name=content]::slotted(*){box-sizing:border-box;padding:24px}.anchor{position:absolute}.top.anchor{top:0}.bottom.anchor{bottom:0}.actions{position:relative}slot[name=actions]::slotted(*){box-sizing:border-box;display:flex;gap:8px;justify-content:flex-end;padding:16px 24px 24px}.has-actions slot[name=content]::slotted(*){padding-bottom:8px}md-divider{display:none;position:absolute}.has-headline.show-top-divider .headline md-divider,.has-actions.show-bottom-divider .actions md-divider{display:flex}.headline md-divider{bottom:0}.actions md-divider{top:0}@media(forced-colors: active){dialog{outline:2px solid WindowText}}
`;
let Ne = class extends x {
};
Ne.styles = [jr];
Ne = s([
  S("md-dialog")
], Ne);
const Ft = /* @__PURE__ */ Symbol.for(""), Wr = (i) => {
  if (i?.r === Ft) return i?._$litStatic$;
}, fe = (i, ...e) => ({ _$litStatic$: e.reduce((t, r, o) => t + ((a) => {
  if (a._$litStatic$ !== void 0) return a._$litStatic$;
  throw Error(`Value passed to 'literal' function must be a 'literal' result: ${a}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`);
})(r) + i[o + 1], i[0]), r: Ft }), ft = /* @__PURE__ */ new Map(), Gr = (i) => (e, ...t) => {
  const r = t.length;
  let o, a;
  const n = [], c = [];
  let h, v = 0, b = !1;
  for (; v < r; ) {
    for (h = e[v]; v < r && (a = t[v], (o = Wr(a)) !== void 0); ) h += o + e[++v], b = !0;
    v !== r && c.push(a), n.push(h), v++;
  }
  if (v === r && n.push(e[r]), b) {
    const f = n.join("$$lit$$");
    (e = ft.get(f)) === void 0 && (n.raw = n, ft.set(f, e = n)), t = c;
  }
  return i(e, ...t);
}, Nt = Gr(u);
function bt(i, e = !0) {
  return e && getComputedStyle(i).getPropertyValue("direction").trim() === "rtl";
}
const Yr = oe(xe($));
class k extends Yr {
  get name() {
    return this.getAttribute("name") ?? "";
  }
  set name(e) {
    this.setAttribute("name", e);
  }
  /**
   * The associated form element with which this element's value will submit.
   */
  get form() {
    return this[E].form;
  }
  /**
   * The labels this element is associated with.
   */
  get labels() {
    return this[E].labels;
  }
  constructor() {
    super(), this.disabled = !1, this.softDisabled = !1, this.flipIconInRtl = !1, this.href = "", this.download = "", this.target = "", this.ariaLabelSelected = "", this.toggle = !1, this.selected = !1, this.type = "submit", this.value = "", this.flipIcon = bt(this, this.flipIconInRtl), this.addEventListener("click", this.handleClick.bind(this));
  }
  willUpdate() {
    this.href && (this.disabled = !1, this.softDisabled = !1);
  }
  render() {
    const e = this.href ? fe`div` : fe`button`, { ariaLabel: t, ariaHasPopup: r, ariaExpanded: o } = this, a = t && this.ariaLabelSelected, n = this.toggle ? this.selected : l;
    let c = l;
    return this.href || (c = a && this.selected ? this.ariaLabelSelected : t), Nt`<${e}
        class="icon-button ${F(this.getRenderClasses())}"
        id="button"
        aria-label="${c || l}"
        aria-haspopup="${!this.href && r || l}"
        aria-expanded="${!this.href && o || l}"
        aria-pressed="${n}"
        aria-disabled=${!this.href && this.softDisabled || l}
        ?disabled="${!this.href && this.disabled}"
        @click="${this.handleClickOnChild}">
        ${this.renderFocusRing()}
        ${this.renderRipple()}
        ${this.selected ? l : this.renderIcon()}
        ${this.selected ? this.renderSelectedIcon() : l}
        ${this.href ? this.renderLink() : this.renderTouchTarget()}
  </${e}>`;
  }
  renderLink() {
    const { ariaLabel: e } = this;
    return u`
      <a
        class="link"
        id="link"
        href="${this.href}"
        download="${this.download || l}"
        target="${this.target || l}"
        aria-label="${e || l}">
        ${this.renderTouchTarget()}
      </a>
    `;
  }
  getRenderClasses() {
    return {
      "flip-icon": this.flipIcon,
      selected: this.toggle && this.selected
    };
  }
  renderIcon() {
    return u`<span class="icon"><slot></slot></span>`;
  }
  renderSelectedIcon() {
    return u`<span class="icon icon--selected"
      ><slot name="selected"><slot></slot></slot
    ></span>`;
  }
  renderTouchTarget() {
    return u`<span class="touch"></span>`;
  }
  renderFocusRing() {
    return u`<md-focus-ring
      part="focus-ring"
      for=${this.href ? "link" : "button"}></md-focus-ring>`;
  }
  renderRipple() {
    const e = !this.href && (this.disabled || this.softDisabled);
    return u`<md-ripple
      for=${this.href ? "link" : l}
      ?disabled="${e}"></md-ripple>`;
  }
  connectedCallback() {
    this.flipIcon = bt(this, this.flipIconInRtl), super.connectedCallback();
  }
  /** Handles a click on this element. */
  handleClick(e) {
    if (!this.href && this.softDisabled) {
      e.stopImmediatePropagation(), e.preventDefault();
      return;
    }
  }
  /**
   * Handles a click on the child <div> or <button> element within this
   * element's shadow DOM.
   */
  async handleClickOnChild(e) {
    await 0, !(!this.toggle || this.disabled || this.softDisabled || e.defaultPrevented) && (this.selected = !this.selected, this.dispatchEvent(new InputEvent("input", { bubbles: !0, composed: !0 })), this.dispatchEvent(new Event("change", { bubbles: !0 })));
  }
}
zt(k);
k.formAssociated = !0;
k.shadowRootOptions = {
  mode: "open",
  delegatesFocus: !0
};
s([
  d({ type: Boolean, reflect: !0 })
], k.prototype, "disabled", void 0);
s([
  d({ type: Boolean, attribute: "soft-disabled", reflect: !0 })
], k.prototype, "softDisabled", void 0);
s([
  d({ type: Boolean, attribute: "flip-icon-in-rtl" })
], k.prototype, "flipIconInRtl", void 0);
s([
  d()
], k.prototype, "href", void 0);
s([
  d()
], k.prototype, "download", void 0);
s([
  d()
], k.prototype, "target", void 0);
s([
  d({ attribute: "aria-label-selected" })
], k.prototype, "ariaLabelSelected", void 0);
s([
  d({ type: Boolean })
], k.prototype, "toggle", void 0);
s([
  d({ type: Boolean, reflect: !0 })
], k.prototype, "selected", void 0);
s([
  d()
], k.prototype, "type", void 0);
s([
  d({ reflect: !0 })
], k.prototype, "value", void 0);
s([
  g()
], k.prototype, "flipIcon", void 0);
const Zr = _`:host{display:inline-flex;outline:none;-webkit-tap-highlight-color:rgba(0,0,0,0);height:var(--_container-height);width:var(--_container-width);justify-content:center}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--_container-height))/2) max(0px,(48px - var(--_container-width))/2)}md-focus-ring{--md-focus-ring-shape-start-start: var(--_container-shape-start-start);--md-focus-ring-shape-start-end: var(--_container-shape-start-end);--md-focus-ring-shape-end-end: var(--_container-shape-end-end);--md-focus-ring-shape-end-start: var(--_container-shape-end-start)}:host(:is([disabled],[soft-disabled])){pointer-events:none}.icon-button{place-items:center;background:none;border:none;box-sizing:border-box;cursor:pointer;display:flex;place-content:center;outline:none;padding:0;position:relative;text-decoration:none;user-select:none;z-index:0;flex:1;border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end)}.icon ::slotted(*){font-size:var(--_icon-size);height:var(--_icon-size);width:var(--_icon-size);font-weight:inherit}md-ripple{z-index:-1;border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end)}.flip-icon .icon{transform:scaleX(-1)}.icon{display:inline-flex}.link{display:grid;height:100%;outline:none;place-items:center;position:absolute;width:100%}.touch{position:absolute;height:max(48px,100%);width:max(48px,100%)}:host([touch-target=none]) .touch{display:none}@media(forced-colors: active){:host(:is([disabled],[soft-disabled])){--_disabled-icon-color: GrayText;--_disabled-icon-opacity: 1}}
`;
const Kr = _`:host{--_disabled-icon-color: var(--md-icon-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-icon-button-disabled-icon-opacity, 0.38);--_icon-size: var(--md-icon-button-icon-size, 24px);--_selected-focus-icon-color: var(--md-icon-button-selected-focus-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-hover-icon-color: var(--md-icon-button-selected-hover-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-hover-state-layer-color: var(--md-icon-button-selected-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_selected-hover-state-layer-opacity: var(--md-icon-button-selected-hover-state-layer-opacity, 0.08);--_selected-icon-color: var(--md-icon-button-selected-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-pressed-icon-color: var(--md-icon-button-selected-pressed-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-pressed-state-layer-color: var(--md-icon-button-selected-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_selected-pressed-state-layer-opacity: var(--md-icon-button-selected-pressed-state-layer-opacity, 0.12);--_state-layer-height: var(--md-icon-button-state-layer-height, 40px);--_state-layer-shape: var(--md-icon-button-state-layer-shape, var(--md-sys-shape-corner-full, 9999px));--_state-layer-width: var(--md-icon-button-state-layer-width, 40px);--_focus-icon-color: var(--md-icon-button-focus-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-icon-color: var(--md-icon-button-hover-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-color: var(--md-icon-button-hover-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-opacity: var(--md-icon-button-hover-state-layer-opacity, 0.08);--_icon-color: var(--md-icon-button-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-icon-color: var(--md-icon-button-pressed-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-state-layer-color: var(--md-icon-button-pressed-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-state-layer-opacity: var(--md-icon-button-pressed-state-layer-opacity, 0.12);--_container-shape-start-start: 0;--_container-shape-start-end: 0;--_container-shape-end-end: 0;--_container-shape-end-start: 0;--_container-height: 0;--_container-width: 0;height:var(--_state-layer-height);width:var(--_state-layer-width)}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--_state-layer-height))/2) max(0px,(48px - var(--_state-layer-width))/2)}md-focus-ring{--md-focus-ring-shape-start-start: var(--_state-layer-shape);--md-focus-ring-shape-start-end: var(--_state-layer-shape);--md-focus-ring-shape-end-end: var(--_state-layer-shape);--md-focus-ring-shape-end-start: var(--_state-layer-shape)}.standard{background-color:rgba(0,0,0,0);color:var(--_icon-color);--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}.standard:hover{color:var(--_hover-icon-color)}.standard:focus{color:var(--_focus-icon-color)}.standard:active{color:var(--_pressed-icon-color)}.standard:is(:disabled,[aria-disabled=true]){color:var(--_disabled-icon-color)}md-ripple{border-radius:var(--_state-layer-shape)}.standard:is(:disabled,[aria-disabled=true]){opacity:var(--_disabled-icon-opacity)}.selected:not(:disabled,[aria-disabled=true]){color:var(--_selected-icon-color)}.selected:not(:disabled,[aria-disabled=true]):hover{color:var(--_selected-hover-icon-color)}.selected:not(:disabled,[aria-disabled=true]):focus{color:var(--_selected-focus-icon-color)}.selected:not(:disabled,[aria-disabled=true]):active{color:var(--_selected-pressed-icon-color)}.selected{--md-ripple-hover-color: var(--_selected-hover-state-layer-color);--md-ripple-hover-opacity: var(--_selected-hover-state-layer-opacity);--md-ripple-pressed-color: var(--_selected-pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_selected-pressed-state-layer-opacity)}
`;
let Be = class extends k {
  getRenderClasses() {
    return {
      ...super.getRenderClasses(),
      standard: !0
    };
  }
};
Be.styles = [Zr, Kr];
Be = s([
  S("md-icon-button")
], Be);
class y extends $ {
  constructor() {
    super(...arguments), this.disabled = !1, this.error = !1, this.focused = !1, this.label = "", this.noAsterisk = !1, this.populated = !1, this.required = !1, this.resizable = !1, this.supportingText = "", this.errorText = "", this.count = -1, this.max = -1, this.hasStart = !1, this.hasEnd = !1, this.isAnimating = !1, this.refreshErrorAlert = !1, this.disableTransitions = !1;
  }
  get counterText() {
    const e = this.count ?? -1, t = this.max ?? -1;
    return e < 0 || t <= 0 ? "" : `${e} / ${t}`;
  }
  get supportingOrErrorText() {
    return this.error && this.errorText ? this.errorText : this.supportingText;
  }
  /**
   * Re-announces the field's error supporting text to screen readers.
   *
   * Error text announces to screen readers anytime it is visible and changes.
   * Use the method to re-announce the message when the text has not changed,
   * but announcement is still needed (such as for `reportValidity()`).
   */
  reannounceError() {
    this.refreshErrorAlert = !0;
  }
  update(e) {
    e.has("disabled") && e.get("disabled") !== void 0 && (this.disableTransitions = !0), this.disabled && this.focused && (e.set("focused", !0), this.focused = !1), this.animateLabelIfNeeded({
      wasFocused: e.get("focused"),
      wasPopulated: e.get("populated")
    }), super.update(e);
  }
  render() {
    const e = this.renderLabel(
      /*isFloating*/
      !0
    ), t = this.renderLabel(
      /*isFloating*/
      !1
    ), r = this.renderOutline?.(e), o = {
      disabled: this.disabled,
      "disable-transitions": this.disableTransitions,
      error: this.error && !this.disabled,
      focused: this.focused,
      "with-start": this.hasStart,
      "with-end": this.hasEnd,
      populated: this.populated,
      resizable: this.resizable,
      required: this.required,
      "no-label": !this.label
    };
    return u`
      <div class="field ${F(o)}">
        <div class="container-overflow">
          ${this.renderBackground?.()}
          <slot name="container"></slot>
          ${this.renderStateLayer?.()} ${this.renderIndicator?.()} ${r}
          <div class="container">
            <div class="start">
              <slot name="start"></slot>
            </div>
            <div class="middle">
              <div class="label-wrapper">
                ${t} ${r ? l : e}
              </div>
              <div class="content">
                <slot></slot>
              </div>
            </div>
            <div class="end">
              <slot name="end"></slot>
            </div>
          </div>
        </div>
        ${this.renderSupportingText()}
      </div>
    `;
  }
  updated(e) {
    (e.has("supportingText") || e.has("errorText") || e.has("count") || e.has("max")) && this.updateSlottedAriaDescribedBy(), this.refreshErrorAlert && requestAnimationFrame(() => {
      this.refreshErrorAlert = !1;
    }), this.disableTransitions && requestAnimationFrame(() => {
      this.disableTransitions = !1;
    });
  }
  renderSupportingText() {
    const { supportingOrErrorText: e, counterText: t } = this;
    if (!e && !t)
      return l;
    const r = u`<span>${e}</span>`, o = t ? u`<span class="counter">${t}</span>` : l, n = this.error && this.errorText && !this.refreshErrorAlert ? "alert" : l;
    return u`
      <div class="supporting-text" role=${n}>${r}${o}</div>
      <slot
        name="aria-describedby"
        @slotchange=${this.updateSlottedAriaDescribedBy}></slot>
    `;
  }
  updateSlottedAriaDescribedBy() {
    for (const e of this.slottedAriaDescribedBy)
      Ct(u`${this.supportingOrErrorText} ${this.counterText}`, e), e.setAttribute("hidden", "");
  }
  renderLabel(e) {
    if (!this.label)
      return l;
    let t;
    e ? t = this.focused || this.populated || this.isAnimating : t = !this.focused && !this.populated && !this.isAnimating;
    const r = {
      hidden: !t,
      floating: e,
      resting: !e
    }, o = `${this.label}${this.required && !this.noAsterisk ? "*" : ""}`;
    return u`
      <span class="label ${F(r)}" aria-hidden=${!t}
        >${o}</span
      >
    `;
  }
  animateLabelIfNeeded({ wasFocused: e, wasPopulated: t }) {
    if (!this.label)
      return;
    e ??= this.focused, t ??= this.populated;
    const r = e || t, o = this.focused || this.populated;
    r !== o && (this.isAnimating = !0, this.labelAnimation?.cancel(), this.labelAnimation = this.floatingLabelEl?.animate(this.getLabelKeyframes(), { duration: 150, easing: G.STANDARD }), this.labelAnimation?.addEventListener("finish", () => {
      this.isAnimating = !1;
    }));
  }
  getLabelKeyframes() {
    const { floatingLabelEl: e, restingLabelEl: t } = this;
    if (!e || !t)
      return [];
    const { x: r, y: o, height: a } = e.getBoundingClientRect(), { x: n, y: c, height: h } = t.getBoundingClientRect(), v = e.scrollWidth, b = t.scrollWidth, f = b / v, T = n - r, I = c - o + Math.round((h - a * f) / 2), O = `translateX(${T}px) translateY(${I}px) scale(${f})`, Y = "translateX(0) translateY(0) scale(1)", H = t.clientWidth, q = b > H ? `${H / f}px` : "";
    return this.focused || this.populated ? [
      { transform: O, width: q },
      { transform: Y, width: q }
    ] : [
      { transform: Y, width: q },
      { transform: O, width: q }
    ];
  }
  getSurfacePositionClientRect() {
    return this.containerEl.getBoundingClientRect();
  }
}
s([
  d({ type: Boolean })
], y.prototype, "disabled", void 0);
s([
  d({ type: Boolean })
], y.prototype, "error", void 0);
s([
  d({ type: Boolean })
], y.prototype, "focused", void 0);
s([
  d()
], y.prototype, "label", void 0);
s([
  d({ type: Boolean, attribute: "no-asterisk" })
], y.prototype, "noAsterisk", void 0);
s([
  d({ type: Boolean })
], y.prototype, "populated", void 0);
s([
  d({ type: Boolean })
], y.prototype, "required", void 0);
s([
  d({ type: Boolean })
], y.prototype, "resizable", void 0);
s([
  d({ attribute: "supporting-text" })
], y.prototype, "supportingText", void 0);
s([
  d({ attribute: "error-text" })
], y.prototype, "errorText", void 0);
s([
  d({ type: Number })
], y.prototype, "count", void 0);
s([
  d({ type: Number })
], y.prototype, "max", void 0);
s([
  d({ type: Boolean, attribute: "has-start" })
], y.prototype, "hasStart", void 0);
s([
  d({ type: Boolean, attribute: "has-end" })
], y.prototype, "hasEnd", void 0);
s([
  ge({ slot: "aria-describedby" })
], y.prototype, "slottedAriaDescribedBy", void 0);
s([
  g()
], y.prototype, "isAnimating", void 0);
s([
  g()
], y.prototype, "refreshErrorAlert", void 0);
s([
  g()
], y.prototype, "disableTransitions", void 0);
s([
  w(".label.floating")
], y.prototype, "floatingLabelEl", void 0);
s([
  w(".label.resting")
], y.prototype, "restingLabelEl", void 0);
s([
  w(".container")
], y.prototype, "containerEl", void 0);
class Xr extends y {
  renderOutline(e) {
    return u`
      <div class="outline">
        <div class="outline-start"></div>
        <div class="outline-notch">
          <div class="outline-panel-inactive"></div>
          <div class="outline-panel-active"></div>
          <div class="outline-label">${e}</div>
        </div>
        <div class="outline-end"></div>
      </div>
    `;
  }
}
const Jr = _`@layer styles{:host{--_bottom-space: var(--md-outlined-field-bottom-space, 16px);--_content-color: var(--md-outlined-field-content-color, var(--md-sys-color-on-surface, #1d1b20));--_content-font: var(--md-outlined-field-content-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_content-line-height: var(--md-outlined-field-content-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_content-size: var(--md-outlined-field-content-size, var(--md-sys-typescale-body-large-size, 1rem));--_content-space: var(--md-outlined-field-content-space, 16px);--_content-weight: var(--md-outlined-field-content-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_disabled-content-color: var(--md-outlined-field-disabled-content-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-content-opacity: var(--md-outlined-field-disabled-content-opacity, 0.38);--_disabled-label-text-color: var(--md-outlined-field-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-outlined-field-disabled-label-text-opacity, 0.38);--_disabled-leading-content-color: var(--md-outlined-field-disabled-leading-content-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-leading-content-opacity: var(--md-outlined-field-disabled-leading-content-opacity, 0.38);--_disabled-outline-color: var(--md-outlined-field-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-outline-opacity: var(--md-outlined-field-disabled-outline-opacity, 0.12);--_disabled-outline-width: var(--md-outlined-field-disabled-outline-width, 1px);--_disabled-supporting-text-color: var(--md-outlined-field-disabled-supporting-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-supporting-text-opacity: var(--md-outlined-field-disabled-supporting-text-opacity, 0.38);--_disabled-trailing-content-color: var(--md-outlined-field-disabled-trailing-content-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-trailing-content-opacity: var(--md-outlined-field-disabled-trailing-content-opacity, 0.38);--_error-content-color: var(--md-outlined-field-error-content-color, var(--md-sys-color-on-surface, #1d1b20));--_error-focus-content-color: var(--md-outlined-field-error-focus-content-color, var(--md-sys-color-on-surface, #1d1b20));--_error-focus-label-text-color: var(--md-outlined-field-error-focus-label-text-color, var(--md-sys-color-error, #b3261e));--_error-focus-leading-content-color: var(--md-outlined-field-error-focus-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-focus-outline-color: var(--md-outlined-field-error-focus-outline-color, var(--md-sys-color-error, #b3261e));--_error-focus-supporting-text-color: var(--md-outlined-field-error-focus-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-focus-trailing-content-color: var(--md-outlined-field-error-focus-trailing-content-color, var(--md-sys-color-error, #b3261e));--_error-hover-content-color: var(--md-outlined-field-error-hover-content-color, var(--md-sys-color-on-surface, #1d1b20));--_error-hover-label-text-color: var(--md-outlined-field-error-hover-label-text-color, var(--md-sys-color-on-error-container, #410e0b));--_error-hover-leading-content-color: var(--md-outlined-field-error-hover-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-hover-outline-color: var(--md-outlined-field-error-hover-outline-color, var(--md-sys-color-on-error-container, #410e0b));--_error-hover-supporting-text-color: var(--md-outlined-field-error-hover-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-hover-trailing-content-color: var(--md-outlined-field-error-hover-trailing-content-color, var(--md-sys-color-on-error-container, #410e0b));--_error-label-text-color: var(--md-outlined-field-error-label-text-color, var(--md-sys-color-error, #b3261e));--_error-leading-content-color: var(--md-outlined-field-error-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-outline-color: var(--md-outlined-field-error-outline-color, var(--md-sys-color-error, #b3261e));--_error-supporting-text-color: var(--md-outlined-field-error-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-trailing-content-color: var(--md-outlined-field-error-trailing-content-color, var(--md-sys-color-error, #b3261e));--_focus-content-color: var(--md-outlined-field-focus-content-color, var(--md-sys-color-on-surface, #1d1b20));--_focus-label-text-color: var(--md-outlined-field-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_focus-leading-content-color: var(--md-outlined-field-focus-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-outline-color: var(--md-outlined-field-focus-outline-color, var(--md-sys-color-primary, #6750a4));--_focus-outline-width: var(--md-outlined-field-focus-outline-width, 3px);--_focus-supporting-text-color: var(--md-outlined-field-focus-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-trailing-content-color: var(--md-outlined-field-focus-trailing-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-content-color: var(--md-outlined-field-hover-content-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-label-text-color: var(--md-outlined-field-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-leading-content-color: var(--md-outlined-field-hover-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-outline-color: var(--md-outlined-field-hover-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-outline-width: var(--md-outlined-field-hover-outline-width, 1px);--_hover-supporting-text-color: var(--md-outlined-field-hover-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-trailing-content-color: var(--md-outlined-field-hover-trailing-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_label-text-color: var(--md-outlined-field-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_label-text-font: var(--md-outlined-field-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-outlined-field-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_label-text-padding-bottom: var(--md-outlined-field-label-text-padding-bottom, 8px);--_label-text-populated-line-height: var(--md-outlined-field-label-text-populated-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_label-text-populated-size: var(--md-outlined-field-label-text-populated-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_label-text-size: var(--md-outlined-field-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_label-text-weight: var(--md-outlined-field-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_leading-content-color: var(--md-outlined-field-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_leading-space: var(--md-outlined-field-leading-space, 16px);--_outline-color: var(--md-outlined-field-outline-color, var(--md-sys-color-outline, #79747e));--_outline-label-padding: var(--md-outlined-field-outline-label-padding, 4px);--_outline-width: var(--md-outlined-field-outline-width, 1px);--_supporting-text-color: var(--md-outlined-field-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_supporting-text-font: var(--md-outlined-field-supporting-text-font, var(--md-sys-typescale-body-small-font, var(--md-ref-typeface-plain, Roboto)));--_supporting-text-leading-space: var(--md-outlined-field-supporting-text-leading-space, 16px);--_supporting-text-line-height: var(--md-outlined-field-supporting-text-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_supporting-text-size: var(--md-outlined-field-supporting-text-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_supporting-text-top-space: var(--md-outlined-field-supporting-text-top-space, 4px);--_supporting-text-trailing-space: var(--md-outlined-field-supporting-text-trailing-space, 16px);--_supporting-text-weight: var(--md-outlined-field-supporting-text-weight, var(--md-sys-typescale-body-small-weight, var(--md-ref-typeface-weight-regular, 400)));--_top-space: var(--md-outlined-field-top-space, 16px);--_trailing-content-color: var(--md-outlined-field-trailing-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_trailing-space: var(--md-outlined-field-trailing-space, 16px);--_with-leading-content-leading-space: var(--md-outlined-field-with-leading-content-leading-space, 12px);--_with-trailing-content-trailing-space: var(--md-outlined-field-with-trailing-content-trailing-space, 12px);--_container-shape-start-start: var(--md-outlined-field-container-shape-start-start, var(--md-outlined-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-start-end: var(--md-outlined-field-container-shape-start-end, var(--md-outlined-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-end-end: var(--md-outlined-field-container-shape-end-end, var(--md-outlined-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-end-start: var(--md-outlined-field-container-shape-end-start, var(--md-outlined-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)))}.outline{border-color:var(--_outline-color);border-radius:inherit;display:flex;pointer-events:none;height:100%;position:absolute;width:100%;z-index:1}.outline-start::before,.outline-start::after,.outline-panel-inactive::before,.outline-panel-inactive::after,.outline-panel-active::before,.outline-panel-active::after,.outline-end::before,.outline-end::after{border:inherit;content:"";inset:0;position:absolute}.outline-start,.outline-end{border:inherit;border-radius:inherit;box-sizing:border-box;position:relative}.outline-start::before,.outline-start::after,.outline-end::before,.outline-end::after{border-bottom-style:solid;border-top-style:solid}.outline-start::after,.outline-end::after{opacity:0;transition:opacity 150ms cubic-bezier(0.2, 0, 0, 1)}.focused .outline-start::after,.focused .outline-end::after{opacity:1}.outline-start::before,.outline-start::after{border-inline-start-style:solid;border-inline-end-style:none;border-start-start-radius:inherit;border-start-end-radius:0;border-end-start-radius:inherit;border-end-end-radius:0;margin-inline-end:var(--_outline-label-padding)}.outline-end{flex-grow:1;margin-inline-start:calc(-1*var(--_outline-label-padding))}.outline-end::before,.outline-end::after{border-inline-start-style:none;border-inline-end-style:solid;border-start-start-radius:0;border-start-end-radius:inherit;border-end-start-radius:0;border-end-end-radius:inherit}.outline-notch{align-items:flex-start;border:inherit;display:flex;margin-inline-start:calc(-1*var(--_outline-label-padding));margin-inline-end:var(--_outline-label-padding);max-width:calc(100% - var(--_leading-space) - var(--_trailing-space));padding:0 var(--_outline-label-padding);position:relative}.no-label .outline-notch{display:none}.outline-panel-inactive,.outline-panel-active{border:inherit;border-bottom-style:solid;inset:0;position:absolute}.outline-panel-inactive::before,.outline-panel-inactive::after,.outline-panel-active::before,.outline-panel-active::after{border-top-style:solid;border-bottom:none;bottom:auto;transform:scaleX(1);transition:transform 150ms cubic-bezier(0.2, 0, 0, 1)}.outline-panel-inactive::before,.outline-panel-active::before{right:50%;transform-origin:top left}.outline-panel-inactive::after,.outline-panel-active::after{left:50%;transform-origin:top right}.populated .outline-panel-inactive::before,.populated .outline-panel-inactive::after,.populated .outline-panel-active::before,.populated .outline-panel-active::after,.focused .outline-panel-inactive::before,.focused .outline-panel-inactive::after,.focused .outline-panel-active::before,.focused .outline-panel-active::after{transform:scaleX(0)}.outline-panel-active{opacity:0;transition:opacity 150ms cubic-bezier(0.2, 0, 0, 1)}.focused .outline-panel-active{opacity:1}.outline-label{display:flex;max-width:100%;transform:translateY(calc(-100% + var(--_label-text-padding-bottom)))}.outline-start,.field:not(.with-start) .content ::slotted(*){padding-inline-start:max(var(--_leading-space),max(var(--_container-shape-start-start),var(--_container-shape-end-start)) + var(--_outline-label-padding))}.field:not(.with-start) .label-wrapper{margin-inline-start:max(var(--_leading-space),max(var(--_container-shape-start-start),var(--_container-shape-end-start)) + var(--_outline-label-padding))}.field:not(.with-end) .content ::slotted(*){padding-inline-end:max(var(--_trailing-space),max(var(--_container-shape-start-end),var(--_container-shape-end-end)))}.field:not(.with-end) .label-wrapper{margin-inline-end:max(var(--_trailing-space),max(var(--_container-shape-start-end),var(--_container-shape-end-end)))}.outline-start::before,.outline-end::before,.outline-panel-inactive,.outline-panel-inactive::before,.outline-panel-inactive::after{border-width:var(--_outline-width)}:hover .outline{border-color:var(--_hover-outline-color);color:var(--_hover-outline-color)}:hover .outline-start::before,:hover .outline-end::before,:hover .outline-panel-inactive,:hover .outline-panel-inactive::before,:hover .outline-panel-inactive::after{border-width:var(--_hover-outline-width)}.focused .outline{border-color:var(--_focus-outline-color);color:var(--_focus-outline-color)}.outline-start::after,.outline-end::after,.outline-panel-active,.outline-panel-active::before,.outline-panel-active::after{border-width:var(--_focus-outline-width)}.disabled .outline{border-color:var(--_disabled-outline-color);color:var(--_disabled-outline-color)}.disabled .outline-start,.disabled .outline-end,.disabled .outline-panel-inactive{opacity:var(--_disabled-outline-opacity)}.disabled .outline-start::before,.disabled .outline-end::before,.disabled .outline-panel-inactive,.disabled .outline-panel-inactive::before,.disabled .outline-panel-inactive::after{border-width:var(--_disabled-outline-width)}.error .outline{border-color:var(--_error-outline-color);color:var(--_error-outline-color)}.error:hover .outline{border-color:var(--_error-hover-outline-color);color:var(--_error-hover-outline-color)}.error.focused .outline{border-color:var(--_error-focus-outline-color);color:var(--_error-focus-outline-color)}.resizable .container{bottom:var(--_focus-outline-width);inset-inline-end:var(--_focus-outline-width);clip-path:inset(var(--_focus-outline-width) 0 0 var(--_focus-outline-width))}.resizable .container>*{top:var(--_focus-outline-width);inset-inline-start:var(--_focus-outline-width)}.resizable .container:dir(rtl){clip-path:inset(var(--_focus-outline-width) var(--_focus-outline-width) 0 0)}}@layer hcm{@media(forced-colors: active){.disabled .outline{border-color:GrayText;color:GrayText}.disabled :is(.outline-start,.outline-end,.outline-panel-inactive){opacity:1}}}
`;
const Qr = _`:host{display:inline-flex;resize:both}.field{display:flex;flex:1;flex-direction:column;writing-mode:horizontal-tb;max-width:100%}.container-overflow{border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-end-radius:var(--_container-shape-end-end);border-end-start-radius:var(--_container-shape-end-start);display:flex;height:100%;position:relative}.container{align-items:center;border-radius:inherit;display:flex;flex:1;max-height:100%;min-height:100%;min-width:min-content;position:relative}.field,.container-overflow{resize:inherit}.resizable:not(.disabled) .container{resize:inherit;overflow:hidden}.disabled{pointer-events:none}slot[name=container]{border-radius:inherit}slot[name=container]::slotted(*){border-radius:inherit;inset:0;pointer-events:none;position:absolute}@layer styles{.start,.middle,.end{display:flex;box-sizing:border-box;height:100%;position:relative}.start{color:var(--_leading-content-color)}.end{color:var(--_trailing-content-color)}.start,.end{align-items:center;justify-content:center}.with-start .start{margin-inline:var(--_with-leading-content-leading-space) var(--_content-space)}.with-end .end{margin-inline:var(--_content-space) var(--_with-trailing-content-trailing-space)}.middle{align-items:stretch;align-self:baseline;flex:1}.content{color:var(--_content-color);display:flex;flex:1;opacity:0;transition:opacity 83ms cubic-bezier(0.2, 0, 0, 1)}.no-label .content,.focused .content,.populated .content{opacity:1;transition-delay:67ms}:is(.disabled,.disable-transitions) .content{transition:none}.content ::slotted(*){all:unset;color:currentColor;font-family:var(--_content-font);font-size:var(--_content-size);line-height:var(--_content-line-height);font-weight:var(--_content-weight);width:100%;overflow-wrap:revert;white-space:revert}.content ::slotted(:not(textarea)){padding-top:var(--_top-space);padding-bottom:var(--_bottom-space)}.content ::slotted(textarea){margin-top:var(--_top-space);margin-bottom:var(--_bottom-space)}:hover .content{color:var(--_hover-content-color)}:hover .start{color:var(--_hover-leading-content-color)}:hover .end{color:var(--_hover-trailing-content-color)}.focused .content{color:var(--_focus-content-color)}.focused .start{color:var(--_focus-leading-content-color)}.focused .end{color:var(--_focus-trailing-content-color)}.disabled .content{color:var(--_disabled-content-color)}.disabled.no-label .content,.disabled.focused .content,.disabled.populated .content{opacity:var(--_disabled-content-opacity)}.disabled .start{color:var(--_disabled-leading-content-color);opacity:var(--_disabled-leading-content-opacity)}.disabled .end{color:var(--_disabled-trailing-content-color);opacity:var(--_disabled-trailing-content-opacity)}.error .content{color:var(--_error-content-color)}.error .start{color:var(--_error-leading-content-color)}.error .end{color:var(--_error-trailing-content-color)}.error:hover .content{color:var(--_error-hover-content-color)}.error:hover .start{color:var(--_error-hover-leading-content-color)}.error:hover .end{color:var(--_error-hover-trailing-content-color)}.error.focused .content{color:var(--_error-focus-content-color)}.error.focused .start{color:var(--_error-focus-leading-content-color)}.error.focused .end{color:var(--_error-focus-trailing-content-color)}}@layer hcm{@media(forced-colors: active){.disabled :is(.start,.content,.end){color:GrayText;opacity:1}}}@layer styles{.label{box-sizing:border-box;color:var(--_label-text-color);overflow:hidden;max-width:100%;text-overflow:ellipsis;white-space:nowrap;z-index:1;font-family:var(--_label-text-font);font-size:var(--_label-text-size);line-height:var(--_label-text-line-height);font-weight:var(--_label-text-weight);width:min-content}.label-wrapper{inset:0;pointer-events:none;position:absolute}.label.resting{position:absolute;top:var(--_top-space)}.label.floating{font-size:var(--_label-text-populated-size);line-height:var(--_label-text-populated-line-height);transform-origin:top left}.label.hidden{opacity:0}.no-label .label{display:none}.label-wrapper{inset:0;position:absolute;text-align:initial}:hover .label{color:var(--_hover-label-text-color)}.focused .label{color:var(--_focus-label-text-color)}.disabled .label{color:var(--_disabled-label-text-color)}.disabled .label:not(.hidden){opacity:var(--_disabled-label-text-opacity)}.error .label{color:var(--_error-label-text-color)}.error:hover .label{color:var(--_error-hover-label-text-color)}.error.focused .label{color:var(--_error-focus-label-text-color)}}@layer hcm{@media(forced-colors: active){.disabled .label:not(.hidden){color:GrayText;opacity:1}}}@layer styles{.supporting-text{color:var(--_supporting-text-color);display:flex;font-family:var(--_supporting-text-font);font-size:var(--_supporting-text-size);line-height:var(--_supporting-text-line-height);font-weight:var(--_supporting-text-weight);gap:16px;justify-content:space-between;padding-inline-start:var(--_supporting-text-leading-space);padding-inline-end:var(--_supporting-text-trailing-space);padding-top:var(--_supporting-text-top-space)}.supporting-text :nth-child(2){flex-shrink:0}:hover .supporting-text{color:var(--_hover-supporting-text-color)}.focus .supporting-text{color:var(--_focus-supporting-text-color)}.disabled .supporting-text{color:var(--_disabled-supporting-text-color);opacity:var(--_disabled-supporting-text-opacity)}.error .supporting-text{color:var(--_error-supporting-text-color)}.error:hover .supporting-text{color:var(--_error-hover-supporting-text-color)}.error.focus .supporting-text{color:var(--_error-focus-supporting-text-color)}}@layer hcm{@media(forced-colors: active){.disabled .supporting-text{color:GrayText;opacity:1}}}
`;
let Ve = class extends Xr {
};
Ve.styles = [Qr, Jr];
Ve = s([
  S("md-outlined-field")
], Ve);
const ei = _`:host{--_caret-color: var(--md-outlined-text-field-caret-color, var(--md-sys-color-primary, #6750a4));--_disabled-input-text-color: var(--md-outlined-text-field-disabled-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-input-text-opacity: var(--md-outlined-text-field-disabled-input-text-opacity, 0.38);--_disabled-label-text-color: var(--md-outlined-text-field-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-outlined-text-field-disabled-label-text-opacity, 0.38);--_disabled-leading-icon-color: var(--md-outlined-text-field-disabled-leading-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-leading-icon-opacity: var(--md-outlined-text-field-disabled-leading-icon-opacity, 0.38);--_disabled-outline-color: var(--md-outlined-text-field-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-outline-opacity: var(--md-outlined-text-field-disabled-outline-opacity, 0.12);--_disabled-outline-width: var(--md-outlined-text-field-disabled-outline-width, 1px);--_disabled-supporting-text-color: var(--md-outlined-text-field-disabled-supporting-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-supporting-text-opacity: var(--md-outlined-text-field-disabled-supporting-text-opacity, 0.38);--_disabled-trailing-icon-color: var(--md-outlined-text-field-disabled-trailing-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-trailing-icon-opacity: var(--md-outlined-text-field-disabled-trailing-icon-opacity, 0.38);--_error-focus-caret-color: var(--md-outlined-text-field-error-focus-caret-color, var(--md-sys-color-error, #b3261e));--_error-focus-input-text-color: var(--md-outlined-text-field-error-focus-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_error-focus-label-text-color: var(--md-outlined-text-field-error-focus-label-text-color, var(--md-sys-color-error, #b3261e));--_error-focus-leading-icon-color: var(--md-outlined-text-field-error-focus-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-focus-outline-color: var(--md-outlined-text-field-error-focus-outline-color, var(--md-sys-color-error, #b3261e));--_error-focus-supporting-text-color: var(--md-outlined-text-field-error-focus-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-focus-trailing-icon-color: var(--md-outlined-text-field-error-focus-trailing-icon-color, var(--md-sys-color-error, #b3261e));--_error-hover-input-text-color: var(--md-outlined-text-field-error-hover-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_error-hover-label-text-color: var(--md-outlined-text-field-error-hover-label-text-color, var(--md-sys-color-on-error-container, #410e0b));--_error-hover-leading-icon-color: var(--md-outlined-text-field-error-hover-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-hover-outline-color: var(--md-outlined-text-field-error-hover-outline-color, var(--md-sys-color-on-error-container, #410e0b));--_error-hover-supporting-text-color: var(--md-outlined-text-field-error-hover-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-hover-trailing-icon-color: var(--md-outlined-text-field-error-hover-trailing-icon-color, var(--md-sys-color-on-error-container, #410e0b));--_error-input-text-color: var(--md-outlined-text-field-error-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_error-label-text-color: var(--md-outlined-text-field-error-label-text-color, var(--md-sys-color-error, #b3261e));--_error-leading-icon-color: var(--md-outlined-text-field-error-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-outline-color: var(--md-outlined-text-field-error-outline-color, var(--md-sys-color-error, #b3261e));--_error-supporting-text-color: var(--md-outlined-text-field-error-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-trailing-icon-color: var(--md-outlined-text-field-error-trailing-icon-color, var(--md-sys-color-error, #b3261e));--_focus-input-text-color: var(--md-outlined-text-field-focus-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_focus-label-text-color: var(--md-outlined-text-field-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_focus-leading-icon-color: var(--md-outlined-text-field-focus-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-outline-color: var(--md-outlined-text-field-focus-outline-color, var(--md-sys-color-primary, #6750a4));--_focus-outline-width: var(--md-outlined-text-field-focus-outline-width, 3px);--_focus-supporting-text-color: var(--md-outlined-text-field-focus-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-trailing-icon-color: var(--md-outlined-text-field-focus-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-input-text-color: var(--md-outlined-text-field-hover-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-label-text-color: var(--md-outlined-text-field-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-leading-icon-color: var(--md-outlined-text-field-hover-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-outline-color: var(--md-outlined-text-field-hover-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-outline-width: var(--md-outlined-text-field-hover-outline-width, 1px);--_hover-supporting-text-color: var(--md-outlined-text-field-hover-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-trailing-icon-color: var(--md-outlined-text-field-hover-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_input-text-color: var(--md-outlined-text-field-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_input-text-font: var(--md-outlined-text-field-input-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_input-text-line-height: var(--md-outlined-text-field-input-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_input-text-placeholder-color: var(--md-outlined-text-field-input-text-placeholder-color, var(--md-sys-color-on-surface-variant, #49454f));--_input-text-prefix-color: var(--md-outlined-text-field-input-text-prefix-color, var(--md-sys-color-on-surface-variant, #49454f));--_input-text-size: var(--md-outlined-text-field-input-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_input-text-suffix-color: var(--md-outlined-text-field-input-text-suffix-color, var(--md-sys-color-on-surface-variant, #49454f));--_input-text-weight: var(--md-outlined-text-field-input-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_label-text-color: var(--md-outlined-text-field-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_label-text-font: var(--md-outlined-text-field-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-outlined-text-field-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_label-text-populated-line-height: var(--md-outlined-text-field-label-text-populated-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_label-text-populated-size: var(--md-outlined-text-field-label-text-populated-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_label-text-size: var(--md-outlined-text-field-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_label-text-weight: var(--md-outlined-text-field-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_leading-icon-color: var(--md-outlined-text-field-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_leading-icon-size: var(--md-outlined-text-field-leading-icon-size, 24px);--_outline-color: var(--md-outlined-text-field-outline-color, var(--md-sys-color-outline, #79747e));--_outline-width: var(--md-outlined-text-field-outline-width, 1px);--_supporting-text-color: var(--md-outlined-text-field-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_supporting-text-font: var(--md-outlined-text-field-supporting-text-font, var(--md-sys-typescale-body-small-font, var(--md-ref-typeface-plain, Roboto)));--_supporting-text-line-height: var(--md-outlined-text-field-supporting-text-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_supporting-text-size: var(--md-outlined-text-field-supporting-text-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_supporting-text-weight: var(--md-outlined-text-field-supporting-text-weight, var(--md-sys-typescale-body-small-weight, var(--md-ref-typeface-weight-regular, 400)));--_trailing-icon-color: var(--md-outlined-text-field-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_trailing-icon-size: var(--md-outlined-text-field-trailing-icon-size, 24px);--_container-shape-start-start: var(--md-outlined-text-field-container-shape-start-start, var(--md-outlined-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-start-end: var(--md-outlined-text-field-container-shape-start-end, var(--md-outlined-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-end-end: var(--md-outlined-text-field-container-shape-end-end, var(--md-outlined-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-end-start: var(--md-outlined-text-field-container-shape-end-start, var(--md-outlined-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_icon-input-space: var(--md-outlined-text-field-icon-input-space, 16px);--_leading-space: var(--md-outlined-text-field-leading-space, 16px);--_trailing-space: var(--md-outlined-text-field-trailing-space, 16px);--_top-space: var(--md-outlined-text-field-top-space, 16px);--_bottom-space: var(--md-outlined-text-field-bottom-space, 16px);--_input-text-prefix-trailing-space: var(--md-outlined-text-field-input-text-prefix-trailing-space, 2px);--_input-text-suffix-leading-space: var(--md-outlined-text-field-input-text-suffix-leading-space, 2px);--_focus-caret-color: var(--md-outlined-text-field-focus-caret-color, var(--md-sys-color-primary, #6750a4));--_with-leading-icon-leading-space: var(--md-outlined-text-field-with-leading-icon-leading-space, 12px);--_with-trailing-icon-trailing-space: var(--md-outlined-text-field-with-trailing-icon-trailing-space, 12px);--md-outlined-field-bottom-space: var(--_bottom-space);--md-outlined-field-container-shape-end-end: var(--_container-shape-end-end);--md-outlined-field-container-shape-end-start: var(--_container-shape-end-start);--md-outlined-field-container-shape-start-end: var(--_container-shape-start-end);--md-outlined-field-container-shape-start-start: var(--_container-shape-start-start);--md-outlined-field-content-color: var(--_input-text-color);--md-outlined-field-content-font: var(--_input-text-font);--md-outlined-field-content-line-height: var(--_input-text-line-height);--md-outlined-field-content-size: var(--_input-text-size);--md-outlined-field-content-space: var(--_icon-input-space);--md-outlined-field-content-weight: var(--_input-text-weight);--md-outlined-field-disabled-content-color: var(--_disabled-input-text-color);--md-outlined-field-disabled-content-opacity: var(--_disabled-input-text-opacity);--md-outlined-field-disabled-label-text-color: var(--_disabled-label-text-color);--md-outlined-field-disabled-label-text-opacity: var(--_disabled-label-text-opacity);--md-outlined-field-disabled-leading-content-color: var(--_disabled-leading-icon-color);--md-outlined-field-disabled-leading-content-opacity: var(--_disabled-leading-icon-opacity);--md-outlined-field-disabled-outline-color: var(--_disabled-outline-color);--md-outlined-field-disabled-outline-opacity: var(--_disabled-outline-opacity);--md-outlined-field-disabled-outline-width: var(--_disabled-outline-width);--md-outlined-field-disabled-supporting-text-color: var(--_disabled-supporting-text-color);--md-outlined-field-disabled-supporting-text-opacity: var(--_disabled-supporting-text-opacity);--md-outlined-field-disabled-trailing-content-color: var(--_disabled-trailing-icon-color);--md-outlined-field-disabled-trailing-content-opacity: var(--_disabled-trailing-icon-opacity);--md-outlined-field-error-content-color: var(--_error-input-text-color);--md-outlined-field-error-focus-content-color: var(--_error-focus-input-text-color);--md-outlined-field-error-focus-label-text-color: var(--_error-focus-label-text-color);--md-outlined-field-error-focus-leading-content-color: var(--_error-focus-leading-icon-color);--md-outlined-field-error-focus-outline-color: var(--_error-focus-outline-color);--md-outlined-field-error-focus-supporting-text-color: var(--_error-focus-supporting-text-color);--md-outlined-field-error-focus-trailing-content-color: var(--_error-focus-trailing-icon-color);--md-outlined-field-error-hover-content-color: var(--_error-hover-input-text-color);--md-outlined-field-error-hover-label-text-color: var(--_error-hover-label-text-color);--md-outlined-field-error-hover-leading-content-color: var(--_error-hover-leading-icon-color);--md-outlined-field-error-hover-outline-color: var(--_error-hover-outline-color);--md-outlined-field-error-hover-supporting-text-color: var(--_error-hover-supporting-text-color);--md-outlined-field-error-hover-trailing-content-color: var(--_error-hover-trailing-icon-color);--md-outlined-field-error-label-text-color: var(--_error-label-text-color);--md-outlined-field-error-leading-content-color: var(--_error-leading-icon-color);--md-outlined-field-error-outline-color: var(--_error-outline-color);--md-outlined-field-error-supporting-text-color: var(--_error-supporting-text-color);--md-outlined-field-error-trailing-content-color: var(--_error-trailing-icon-color);--md-outlined-field-focus-content-color: var(--_focus-input-text-color);--md-outlined-field-focus-label-text-color: var(--_focus-label-text-color);--md-outlined-field-focus-leading-content-color: var(--_focus-leading-icon-color);--md-outlined-field-focus-outline-color: var(--_focus-outline-color);--md-outlined-field-focus-outline-width: var(--_focus-outline-width);--md-outlined-field-focus-supporting-text-color: var(--_focus-supporting-text-color);--md-outlined-field-focus-trailing-content-color: var(--_focus-trailing-icon-color);--md-outlined-field-hover-content-color: var(--_hover-input-text-color);--md-outlined-field-hover-label-text-color: var(--_hover-label-text-color);--md-outlined-field-hover-leading-content-color: var(--_hover-leading-icon-color);--md-outlined-field-hover-outline-color: var(--_hover-outline-color);--md-outlined-field-hover-outline-width: var(--_hover-outline-width);--md-outlined-field-hover-supporting-text-color: var(--_hover-supporting-text-color);--md-outlined-field-hover-trailing-content-color: var(--_hover-trailing-icon-color);--md-outlined-field-label-text-color: var(--_label-text-color);--md-outlined-field-label-text-font: var(--_label-text-font);--md-outlined-field-label-text-line-height: var(--_label-text-line-height);--md-outlined-field-label-text-populated-line-height: var(--_label-text-populated-line-height);--md-outlined-field-label-text-populated-size: var(--_label-text-populated-size);--md-outlined-field-label-text-size: var(--_label-text-size);--md-outlined-field-label-text-weight: var(--_label-text-weight);--md-outlined-field-leading-content-color: var(--_leading-icon-color);--md-outlined-field-leading-space: var(--_leading-space);--md-outlined-field-outline-color: var(--_outline-color);--md-outlined-field-outline-width: var(--_outline-width);--md-outlined-field-supporting-text-color: var(--_supporting-text-color);--md-outlined-field-supporting-text-font: var(--_supporting-text-font);--md-outlined-field-supporting-text-line-height: var(--_supporting-text-line-height);--md-outlined-field-supporting-text-size: var(--_supporting-text-size);--md-outlined-field-supporting-text-weight: var(--_supporting-text-weight);--md-outlined-field-top-space: var(--_top-space);--md-outlined-field-trailing-content-color: var(--_trailing-icon-color);--md-outlined-field-trailing-space: var(--_trailing-space);--md-outlined-field-with-leading-content-leading-space: var(--_with-leading-icon-leading-space);--md-outlined-field-with-trailing-content-trailing-space: var(--_with-trailing-icon-trailing-space)}
`;
const ti = (i) => i.strings === void 0, ri = {}, ii = (i, e = ri) => i._$AH = e;
const gt = Xe(class extends Je {
  constructor(i) {
    if (super(i), i.type !== M.PROPERTY && i.type !== M.ATTRIBUTE && i.type !== M.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
    if (!ti(i)) throw Error("`live` bindings can only contain a single expression");
  }
  render(i) {
    return i;
  }
  update(i, [e]) {
    if (e === R || e === l) return e;
    const t = i.element, r = i.name;
    if (i.type === M.PROPERTY) {
      if (e === t[r]) return R;
    } else if (i.type === M.BOOLEAN_ATTRIBUTE) {
      if (!!e === t.hasAttribute(r)) return R;
    } else if (i.type === M.ATTRIBUTE && t.getAttribute(r) === e + "") return R;
    return ii(i), e;
  }
});
const Bt = "important", oi = " !" + Bt, yt = Xe(class extends Je {
  constructor(i) {
    if (super(i), i.type !== M.ATTRIBUTE || i.name !== "style" || i.strings?.length > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
  }
  render(i) {
    return Object.keys(i).reduce((e, t) => {
      const r = i[t];
      return r == null ? e : e + `${t = t.includes("-") ? t : t.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${r};`;
    }, "");
  }
  update(i, [e]) {
    const { style: t } = i.element;
    if (this.ft === void 0) return this.ft = new Set(Object.keys(e)), this.render(e);
    for (const r of this.ft) e[r] == null && (this.ft.delete(r), r.includes("-") ? t.removeProperty(r) : t[r] = null);
    for (const r in e) {
      const o = e[r];
      if (o != null) {
        this.ft.add(r);
        const a = typeof o == "string" && o.endsWith(oi);
        r.includes("-") || a ? t.setProperty(r, a ? o.slice(0, -11) : o, a ? Bt : "") : t[r] = o;
      }
    }
    return R;
  }
});
const ai = {
  fromAttribute(i) {
    return i ?? "";
  },
  toAttribute(i) {
    return i || null;
  }
};
const Ue = /* @__PURE__ */ Symbol("onReportValidity"), se = /* @__PURE__ */ Symbol("privateCleanupFormListeners"), le = /* @__PURE__ */ Symbol("privateDoNotReportInvalid"), de = /* @__PURE__ */ Symbol("privateIsSelfReportingValidity"), ce = /* @__PURE__ */ Symbol("privateCallOnReportValidity");
function ni(i) {
  var e, t, r;
  class o extends i {
    // Mixins must have a constructor with `...args: any[]`
    // tslint:disable-next-line:no-any
    constructor(...n) {
      super(...n), this[e] = new AbortController(), this[t] = !1, this[r] = !1, this.addEventListener("invalid", (c) => {
        this[le] || !c.isTrusted || this.addEventListener("invalid", () => {
          this[ce](c);
        }, { once: !0 });
      }, {
        // Listen during the capture phase, which will happen before the
        // bubbling phase. That way, we can add a final event listener that
        // will run after other event listeners, and we can check if it was
        // default prevented. This works because invalid does not bubble.
        capture: !0
      });
    }
    checkValidity() {
      this[le] = !0;
      const n = super.checkValidity();
      return this[le] = !1, n;
    }
    reportValidity() {
      this[de] = !0;
      const n = super.reportValidity();
      return n && this[ce](null), this[de] = !1, n;
    }
    [(e = se, t = le, r = de, ce)](n) {
      const c = n?.defaultPrevented;
      c || (this[Ue](n), !(!c && n?.defaultPrevented)) || (this[de] || di(this[E].form, this)) && this.focus();
    }
    [Ue](n) {
      throw new Error("Implement [onReportValidity]");
    }
    formAssociatedCallback(n) {
      super.formAssociatedCallback && super.formAssociatedCallback(n), this[se].abort(), n && (this[se] = new AbortController(), si(this, n, () => {
        this[ce](null);
      }, this[se].signal));
    }
  }
  return o;
}
function si(i, e, t, r) {
  const o = li(e);
  let a = !1, n, c = !1;
  o.addEventListener("before", () => {
    c = !0, n = new AbortController(), a = !1, i.addEventListener("invalid", () => {
      a = !0;
    }, {
      signal: n.signal
    });
  }, { signal: r }), o.addEventListener("after", () => {
    c = !1, n?.abort(), !a && t();
  }, { signal: r }), e.addEventListener("submit", () => {
    c || t();
  }, {
    signal: r
  });
}
const Ce = /* @__PURE__ */ new WeakMap();
function li(i) {
  if (!Ce.has(i)) {
    const e = new EventTarget();
    Ce.set(i, e);
    for (const t of ["reportValidity", "requestSubmit"]) {
      const r = i[t];
      i[t] = function() {
        e.dispatchEvent(new Event("before"));
        const o = Reflect.apply(r, this, arguments);
        return e.dispatchEvent(new Event("after")), o;
      };
    }
  }
  return Ce.get(i);
}
function di(i, e) {
  if (!i)
    return !0;
  let t;
  for (const r of i.elements)
    if (r.matches(":invalid")) {
      t = r;
      break;
    }
  return t === e;
}
class ci extends Lt {
  computeValidity({ state: e, renderedControl: t }) {
    let r = t;
    K(e) && !r ? (r = this.inputControl || document.createElement("input"), this.inputControl = r) : r || (r = this.textAreaControl || document.createElement("textarea"), this.textAreaControl = r);
    const o = K(e) ? r : null;
    if (o && (o.type = e.type), r.value !== e.value && (r.value = e.value), r.required = e.required, o) {
      const a = e;
      a.pattern ? o.pattern = a.pattern : o.removeAttribute("pattern"), a.min ? o.min = a.min : o.removeAttribute("min"), a.max ? o.max = a.max : o.removeAttribute("max"), a.step ? o.step = a.step : o.removeAttribute("step");
    }
    return (e.minLength ?? -1) > -1 ? r.setAttribute("minlength", String(e.minLength)) : r.removeAttribute("minlength"), (e.maxLength ?? -1) > -1 ? r.setAttribute("maxlength", String(e.maxLength)) : r.removeAttribute("maxlength"), {
      validity: r.validity,
      validationMessage: r.validationMessage
    };
  }
  equals({ state: e }, { state: t }) {
    const r = e.type === t.type && e.value === t.value && e.required === t.required && e.minLength === t.minLength && e.maxLength === t.maxLength;
    return !K(e) || !K(t) ? r : r && e.pattern === t.pattern && e.min === t.min && e.max === t.max && e.step === t.step;
  }
  copy({ state: e }) {
    return {
      state: K(e) ? this.copyInput(e) : this.copyTextArea(e),
      renderedControl: null
    };
  }
  copyInput(e) {
    const { type: t, pattern: r, min: o, max: a, step: n } = e;
    return {
      ...this.copySharedState(e),
      type: t,
      pattern: r,
      min: o,
      max: a,
      step: n
    };
  }
  copyTextArea(e) {
    return {
      ...this.copySharedState(e),
      type: e.type
    };
  }
  copySharedState({ value: e, required: t, minLength: r, maxLength: o }) {
    return { value: e, required: t, minLength: r, maxLength: o };
  }
}
function K(i) {
  return i.type !== "textarea";
}
const hi = oe(ni(Pt(Mt(xe($)))));
class m extends hi {
  constructor() {
    super(...arguments), this.error = !1, this.errorText = "", this.label = "", this.noAsterisk = !1, this.required = !1, this.value = "", this.prefixText = "", this.suffixText = "", this.hasLeadingIcon = !1, this.hasTrailingIcon = !1, this.supportingText = "", this.textDirection = "", this.rows = 2, this.cols = 20, this.inputMode = "", this.max = "", this.maxLength = -1, this.min = "", this.minLength = -1, this.noSpinner = !1, this.pattern = "", this.placeholder = "", this.readOnly = !1, this.multiple = !1, this.step = "", this.type = "text", this.autocomplete = "", this.dirty = !1, this.focused = !1, this.nativeError = !1, this.nativeErrorText = "";
  }
  /**
   * Gets or sets the direction in which selection occurred.
   */
  get selectionDirection() {
    return this.getInputOrTextarea().selectionDirection;
  }
  set selectionDirection(e) {
    this.getInputOrTextarea().selectionDirection = e;
  }
  /**
   * Gets or sets the end position or offset of a text selection.
   */
  get selectionEnd() {
    return this.getInputOrTextarea().selectionEnd;
  }
  set selectionEnd(e) {
    this.getInputOrTextarea().selectionEnd = e;
  }
  /**
   * Gets or sets the starting position or offset of a text selection.
   */
  get selectionStart() {
    return this.getInputOrTextarea().selectionStart;
  }
  set selectionStart(e) {
    this.getInputOrTextarea().selectionStart = e;
  }
  /**
   * The text field's value as a number.
   */
  get valueAsNumber() {
    const e = this.getInput();
    return e ? e.valueAsNumber : NaN;
  }
  set valueAsNumber(e) {
    const t = this.getInput();
    t && (t.valueAsNumber = e, this.value = t.value);
  }
  /**
   * The text field's value as a Date.
   */
  get valueAsDate() {
    const e = this.getInput();
    return e ? e.valueAsDate : null;
  }
  set valueAsDate(e) {
    const t = this.getInput();
    t && (t.valueAsDate = e, this.value = t.value);
  }
  get hasError() {
    return this.error || this.nativeError;
  }
  /**
   * Selects all the text in the text field.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select
   */
  select() {
    this.getInputOrTextarea().select();
  }
  setRangeText(...e) {
    this.getInputOrTextarea().setRangeText(...e), this.value = this.getInputOrTextarea().value;
  }
  /**
   * Sets the start and end positions of a selection in the text field.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setSelectionRange
   *
   * @param start The offset into the text field for the start of the selection.
   * @param end The offset into the text field for the end of the selection.
   * @param direction The direction in which the selection is performed.
   */
  setSelectionRange(e, t, r) {
    this.getInputOrTextarea().setSelectionRange(e, t, r);
  }
  /**
   * Shows the browser picker for an input element of type "date", "time", etc.
   *
   * For a full list of supported types, see:
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/showPicker#browser_compatibility
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/showPicker
   */
  showPicker() {
    const e = this.getInput();
    e && e.showPicker();
  }
  /**
   * Decrements the value of a numeric type text field by `step` or `n` `step`
   * number of times.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/stepDown
   *
   * @param stepDecrement The number of steps to decrement, defaults to 1.
   */
  stepDown(e) {
    const t = this.getInput();
    t && (t.stepDown(e), this.value = t.value);
  }
  /**
   * Increments the value of a numeric type text field by `step` or `n` `step`
   * number of times.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/stepUp
   *
   * @param stepIncrement The number of steps to increment, defaults to 1.
   */
  stepUp(e) {
    const t = this.getInput();
    t && (t.stepUp(e), this.value = t.value);
  }
  /**
   * Reset the text field to its default value.
   */
  reset() {
    this.dirty = !1, this.value = this.getAttribute("value") ?? "", this.nativeError = !1, this.nativeErrorText = "";
  }
  attributeChangedCallback(e, t, r) {
    e === "value" && this.dirty || super.attributeChangedCallback(e, t, r);
  }
  render() {
    const e = {
      disabled: this.disabled,
      error: !this.disabled && this.hasError,
      textarea: this.type === "textarea",
      "no-spinner": this.noSpinner
    };
    return u`
      <span class="text-field ${F(e)}">
        ${this.renderField()}
      </span>
    `;
  }
  updated(e) {
    const t = this.getInputOrTextarea().value;
    this.value !== t && (this.value = t);
  }
  renderField() {
    return Nt`<${this.fieldTag}
      class="field"
      count=${this.value.length}
      ?disabled=${this.disabled}
      ?error=${this.hasError}
      error-text=${this.getErrorText()}
      ?focused=${this.focused}
      ?has-end=${this.hasTrailingIcon}
      ?has-start=${this.hasLeadingIcon}
      label=${this.label}
      ?no-asterisk=${this.noAsterisk}
      max=${this.maxLength}
      ?populated=${!!this.value}
      ?required=${this.required}
      ?resizable=${this.type === "textarea"}
      supporting-text=${this.supportingText}
    >
      ${this.renderLeadingIcon()}
      ${this.renderInputOrTextarea()}
      ${this.renderTrailingIcon()}
      <div id="description" slot="aria-describedby"></div>
      <slot name="container" slot="container"></slot>
    </${this.fieldTag}>`;
  }
  renderLeadingIcon() {
    return u`
      <span class="icon leading" slot="start">
        <slot name="leading-icon" @slotchange=${this.handleIconChange}></slot>
      </span>
    `;
  }
  renderTrailingIcon() {
    return u`
      <span class="icon trailing" slot="end">
        <slot name="trailing-icon" @slotchange=${this.handleIconChange}></slot>
      </span>
    `;
  }
  renderInputOrTextarea() {
    const e = { direction: this.textDirection }, t = this.ariaLabel || this.label || l, r = this.autocomplete, o = (this.maxLength ?? -1) > -1, a = (this.minLength ?? -1) > -1;
    if (this.type === "textarea")
      return u`
        <textarea
          class="input"
          style=${yt(e)}
          aria-describedby="description"
          aria-invalid=${this.hasError}
          aria-label=${t}
          autocomplete=${r || l}
          name=${this.name || l}
          ?disabled=${this.disabled}
          maxlength=${o ? this.maxLength : l}
          minlength=${a ? this.minLength : l}
          placeholder=${this.placeholder || l}
          ?readonly=${this.readOnly}
          ?required=${this.required}
          rows=${this.rows}
          cols=${this.cols}
          .value=${gt(this.value)}
          @change=${this.redispatchEvent}
          @focus=${this.handleFocusChange}
          @blur=${this.handleFocusChange}
          @input=${this.handleInput}
          @select=${this.redispatchEvent}></textarea>
      `;
    const n = this.renderPrefix(), c = this.renderSuffix(), h = this.inputMode;
    return u`
      <div class="input-wrapper">
        ${n}
        <input
          class="input"
          style=${yt(e)}
          aria-describedby="description"
          aria-invalid=${this.hasError}
          aria-label=${t}
          autocomplete=${r || l}
          name=${this.name || l}
          ?disabled=${this.disabled}
          inputmode=${h || l}
          max=${this.max || l}
          maxlength=${o ? this.maxLength : l}
          min=${this.min || l}
          minlength=${a ? this.minLength : l}
          pattern=${this.pattern || l}
          placeholder=${this.placeholder || l}
          ?readonly=${this.readOnly}
          ?required=${this.required}
          ?multiple=${this.multiple}
          step=${this.step || l}
          type=${this.type}
          .value=${gt(this.value)}
          @change=${this.redispatchEvent}
          @focus=${this.handleFocusChange}
          @blur=${this.handleFocusChange}
          @input=${this.handleInput}
          @select=${this.redispatchEvent} />
        ${c}
      </div>
    `;
  }
  renderPrefix() {
    return this.renderAffix(
      this.prefixText,
      /* isSuffix */
      !1
    );
  }
  renderSuffix() {
    return this.renderAffix(
      this.suffixText,
      /* isSuffix */
      !0
    );
  }
  renderAffix(e, t) {
    return e ? u`<span class="${F({
      suffix: t,
      prefix: !t
    })}">${e}</span>` : l;
  }
  getErrorText() {
    return this.error ? this.errorText : this.nativeErrorText;
  }
  handleFocusChange() {
    this.focused = this.inputOrTextarea?.matches(":focus") ?? !1;
  }
  handleInput(e) {
    this.dirty = !0, this.value = e.target.value;
  }
  redispatchEvent(e) {
    et(this, e);
  }
  getInputOrTextarea() {
    return this.inputOrTextarea || (this.connectedCallback(), this.scheduleUpdate()), this.isUpdatePending && this.scheduleUpdate(), this.inputOrTextarea;
  }
  getInput() {
    return this.type === "textarea" ? null : this.getInputOrTextarea();
  }
  handleIconChange() {
    this.hasLeadingIcon = this.leadingIcons.length > 0, this.hasTrailingIcon = this.trailingIcons.length > 0;
  }
  [J]() {
    return this.value;
  }
  formResetCallback() {
    this.reset();
  }
  formStateRestoreCallback(e) {
    this.value = e;
  }
  focus() {
    this.getInputOrTextarea().focus();
  }
  [me]() {
    return new ci(() => ({
      state: this,
      renderedControl: this.inputOrTextarea
    }));
  }
  [ve]() {
    return this.inputOrTextarea;
  }
  [Ue](e) {
    e?.preventDefault();
    const t = this.getErrorText();
    this.nativeError = !!e, this.nativeErrorText = this.validationMessage, t === this.getErrorText() && this.field?.reannounceError();
  }
}
m.shadowRootOptions = {
  ...$.shadowRootOptions,
  delegatesFocus: !0
};
s([
  d({ type: Boolean, reflect: !0 })
], m.prototype, "error", void 0);
s([
  d({ attribute: "error-text" })
], m.prototype, "errorText", void 0);
s([
  d()
], m.prototype, "label", void 0);
s([
  d({ type: Boolean, attribute: "no-asterisk" })
], m.prototype, "noAsterisk", void 0);
s([
  d({ type: Boolean, reflect: !0 })
], m.prototype, "required", void 0);
s([
  d()
], m.prototype, "value", void 0);
s([
  d({ attribute: "prefix-text" })
], m.prototype, "prefixText", void 0);
s([
  d({ attribute: "suffix-text" })
], m.prototype, "suffixText", void 0);
s([
  d({ type: Boolean, attribute: "has-leading-icon" })
], m.prototype, "hasLeadingIcon", void 0);
s([
  d({ type: Boolean, attribute: "has-trailing-icon" })
], m.prototype, "hasTrailingIcon", void 0);
s([
  d({ attribute: "supporting-text" })
], m.prototype, "supportingText", void 0);
s([
  d({ attribute: "text-direction" })
], m.prototype, "textDirection", void 0);
s([
  d({ type: Number })
], m.prototype, "rows", void 0);
s([
  d({ type: Number })
], m.prototype, "cols", void 0);
s([
  d({ reflect: !0 })
], m.prototype, "inputMode", void 0);
s([
  d()
], m.prototype, "max", void 0);
s([
  d({ type: Number })
], m.prototype, "maxLength", void 0);
s([
  d()
], m.prototype, "min", void 0);
s([
  d({ type: Number })
], m.prototype, "minLength", void 0);
s([
  d({ type: Boolean, attribute: "no-spinner" })
], m.prototype, "noSpinner", void 0);
s([
  d()
], m.prototype, "pattern", void 0);
s([
  d({ reflect: !0, converter: ai })
], m.prototype, "placeholder", void 0);
s([
  d({ type: Boolean, reflect: !0 })
], m.prototype, "readOnly", void 0);
s([
  d({ type: Boolean, reflect: !0 })
], m.prototype, "multiple", void 0);
s([
  d()
], m.prototype, "step", void 0);
s([
  d({ reflect: !0 })
], m.prototype, "type", void 0);
s([
  d({ reflect: !0 })
], m.prototype, "autocomplete", void 0);
s([
  g()
], m.prototype, "dirty", void 0);
s([
  g()
], m.prototype, "focused", void 0);
s([
  g()
], m.prototype, "nativeError", void 0);
s([
  g()
], m.prototype, "nativeErrorText", void 0);
s([
  w(".input")
], m.prototype, "inputOrTextarea", void 0);
s([
  w(".field")
], m.prototype, "field", void 0);
s([
  ge({ slot: "leading-icon" })
], m.prototype, "leadingIcons", void 0);
s([
  ge({ slot: "trailing-icon" })
], m.prototype, "trailingIcons", void 0);
class ui extends m {
  constructor() {
    super(...arguments), this.fieldTag = fe`md-outlined-field`;
  }
}
const pi = _`:host{display:inline-flex;outline:none;resize:both;text-align:start;-webkit-tap-highlight-color:rgba(0,0,0,0)}.text-field,.field{width:100%}.text-field{display:inline-flex}.field{cursor:text}.disabled .field{cursor:default}.text-field,.textarea .field{resize:inherit}slot[name=container]{border-radius:inherit}.icon{color:currentColor;display:flex;align-items:center;justify-content:center;fill:currentColor;position:relative}.icon ::slotted(*){display:flex;position:absolute}[has-start] .icon.leading{font-size:var(--_leading-icon-size);height:var(--_leading-icon-size);width:var(--_leading-icon-size)}[has-end] .icon.trailing{font-size:var(--_trailing-icon-size);height:var(--_trailing-icon-size);width:var(--_trailing-icon-size)}.input-wrapper{display:flex}.input-wrapper>*{all:inherit;padding:0}.input{caret-color:var(--_caret-color);overflow-x:hidden;text-align:inherit}.input::placeholder{color:currentColor;opacity:1}.input::-webkit-calendar-picker-indicator{display:none}.input::-webkit-search-decoration,.input::-webkit-search-cancel-button{display:none}@media(forced-colors: active){.input{background:none}}.no-spinner .input::-webkit-inner-spin-button,.no-spinner .input::-webkit-outer-spin-button{display:none}.no-spinner .input[type=number]{-moz-appearance:textfield}:focus-within .input{caret-color:var(--_focus-caret-color)}.error:focus-within .input{caret-color:var(--_error-focus-caret-color)}.text-field:not(.disabled) .prefix{color:var(--_input-text-prefix-color)}.text-field:not(.disabled) .suffix{color:var(--_input-text-suffix-color)}.text-field:not(.disabled) .input::placeholder{color:var(--_input-text-placeholder-color)}.prefix,.suffix{text-wrap:nowrap;width:min-content}.prefix{padding-inline-end:var(--_input-text-prefix-trailing-space)}.suffix{padding-inline-start:var(--_input-text-suffix-leading-space)}
`;
let He = class extends ui {
  constructor() {
    super(...arguments), this.fieldTag = fe`md-outlined-field`;
  }
};
He.styles = [pi, ei];
He = s([
  S("md-outlined-text-field")
], He);
const mi = {
  add: "Добавить",
  addMedication: "Добавить лекарство",
  addReminder: "Добавить напоминание",
  cancel: "Отмена",
  delete: "Удалить",
  deleteConfirm: "Удалить лекарство?",
  deleteMedication: "Удалить лекарство",
  edit: "Изменить",
  editMedication: "Редактировать лекарство",
  empty: "Лекарства не добавлены",
  enableMedication: "Лекарство активно",
  enableReminder: "Напоминание активно",
  enableReminders: "Включить напоминания",
  icon: "Иконка",
  invalidReminder: "Проверьте время напоминаний",
  last: "Последний приём",
  late: "Поздно",
  missed: "Пропущено",
  name: "Название",
  next: "Следующее",
  noReminders: "Напоминания не добавлены",
  none: "Нет данных",
  nfcTag: "NFC-метка",
  removeReminder: "Удалить напоминание",
  reminderTime: "Время",
  reminders: "Напоминания",
  requiredName: "Введите название лекарства",
  save: "Сохранить",
  take: "Отметить приём",
  taken: "Принято",
  today: "Сегодня",
  title: "Менеджер лекарств",
  unnamed: "Новое лекарство"
}, vi = {
  add: "Add",
  addMedication: "Add medication",
  addReminder: "Add reminder",
  cancel: "Cancel",
  delete: "Delete",
  deleteConfirm: "Delete medication?",
  deleteMedication: "Delete medication",
  edit: "Edit",
  editMedication: "Edit medication",
  empty: "No medications",
  enableMedication: "Medication enabled",
  enableReminder: "Reminder enabled",
  enableReminders: "Enable reminders",
  icon: "Icon",
  invalidReminder: "Check reminder times",
  last: "Last intake",
  late: "Late",
  missed: "Missed",
  name: "Name",
  next: "Next",
  noReminders: "No reminders added",
  none: "No data",
  nfcTag: "NFC tag",
  removeReminder: "Remove reminder",
  reminderTime: "Time",
  reminders: "Reminders",
  requiredName: "Enter medication name",
  save: "Save",
  take: "Mark taken",
  taken: "Taken",
  today: "Today",
  title: "Medication Manager",
  unnamed: "New medication"
};
function p(i, e) {
  return i.toLowerCase().startsWith("ru") ? mi[e] : vi[e];
}
var fi = Object.defineProperty, bi = Object.getOwnPropertyDescriptor, U = (i, e, t, r) => {
  for (var o = r > 1 ? void 0 : r ? bi(e, t) : e, a = i.length - 1, n; a >= 0; a--)
    (n = i[a]) && (o = (r ? n(e, t, o) : n(o)) || o);
  return r && o && fi(e, t, o), o;
};
let P = class extends $ {
  constructor() {
    super(...arguments), this._config = { type: "custom:medication-manager" };
  }
  static getStubConfig() {
    return { type: "custom:medication-manager" };
  }
  setConfig(i) {
    this._config = i;
  }
  getCardSize() {
    return Math.max(3, this._dashboard?.medications.length ?? 1);
  }
  connectedCallback() {
    super.connectedCallback(), this._subscribe(), this._loadDashboard();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._unsubscribe?.(), this._unsubscribe = void 0;
  }
  updated(i) {
    i.has("hass") && (this._subscribe(), this._loadDashboard());
  }
  render() {
    const e = this.hass?.language ?? "en", t = this._config.title ?? p(e, "title");
    return this._error ? u`<ha-card><div class="error">${this._error}</div></ha-card>` : u`
      <ha-card>
        <header>
          <h2>${t}</h2>
          <md-filled-button @click=${() => this._openAddDialog()}>
            <ha-icon slot="icon" icon="mdi:plus"></ha-icon>
            ${p(e, "add")}
          </md-filled-button>
        </header>
        <section>
          ${this._dashboard?.medications.length ? this._dashboard.medications.map(
      (r) => this._renderMedication(r, e)
    ) : u`<div class="empty">${p(e, "empty")}</div>`}
        </section>
      </ha-card>
      ${this._renderMedicationDialog(e)}
    `;
  }
  _renderMedication(i, e) {
    const t = this._busyMedicationId === i.id;
    return u`
      <article class=${i.enabled ? "medication" : "medication disabled"}>
        <div class="identity">
          <ha-icon .icon=${i.icon}></ha-icon>
          <div>
            <h3>${i.name}</h3>
            <p>${this._statusLabel(i.today_status, e)}</p>
          </div>
          <md-icon-button
            aria-label=${p(e, "take")}
            title=${p(e, "take")}
            ?disabled=${t}
            @click=${() => this._takeMedication(i)}
          >
            <ha-icon icon="mdi:check"></ha-icon>
          </md-icon-button>
          <md-icon-button
            aria-label=${p(e, "edit")}
            title=${p(e, "edit")}
            @click=${() => this._openEditDialog(i)}
          >
            <ha-icon icon="mdi:pencil"></ha-icon>
          </md-icon-button>
        </div>
        <dl>
          <div>
            <dt>${p(e, "next")}</dt>
            <dd>${this._nextReminder(i, e)}</dd>
          </div>
          <div>
            <dt>${p(e, "last")}</dt>
            <dd>${this._lastIntake(i, e)}</dd>
          </div>
        </dl>
        <div class="week">
          ${i.weekly_history.map(
      (r) => this._renderWeeklyDay(i, r, e)
    )}
        </div>
      </article>
    `;
  }
  _renderWeeklyDay(i, e, t) {
    const r = e.is_future ? "future" : e.status ?? "none", o = e.status ? this._statusLabel(e.status, t) : p(t, "none");
    return u`
      <span class=${r} title=${`${e.date}: ${o}`}>
        ${this._weeklyContent(i, e)}
      </span>
    `;
  }
  _weeklyContent(i, e) {
    return e.is_future || e.status === null || e.status === "missed" ? l : e.status === "late" ? u`<span class="late-marker"></span>` : u`<ha-icon .icon=${i.icon}></ha-icon>`;
  }
  _renderMedicationDialog(i) {
    const e = this._dialog;
    if (!e) return l;
    const t = e.mode === "add" ? p(i, "addMedication") : p(i, "editMedication");
    return u`
      <md-dialog open @closed=${() => this._closeDialog()}>
        <div slot="headline">${t}</div>
        <form slot="content" class="dialog-form">
          ${e.error ? u`<div class="dialog-error">${e.error}</div>` : l}
          <md-outlined-text-field
            label=${p(i, "name")}
            .value=${e.name}
            ?disabled=${e.saving}
            required
            @input=${(r) => this._updateDialog({ name: this._stringValue(r) })}
          ></md-outlined-text-field>
          <md-outlined-text-field
            label=${p(i, "icon")}
            .value=${e.icon}
            ?disabled=${e.saving}
            @input=${(r) => this._updateDialog({ icon: this._stringValue(r) })}
          ></md-outlined-text-field>
          <md-outlined-text-field
            label=${p(i, "nfcTag")}
            .value=${e.tagId}
            ?disabled=${e.saving}
            @input=${(r) => this._updateDialog({ tagId: this._stringValue(r) })}
          ></md-outlined-text-field>
          <label class="toggle-row">
            <md-checkbox
              ?checked=${e.medicationEnabled}
              ?disabled=${e.saving}
              @change=${(r) => this._updateDialog({
      medicationEnabled: this._checkedValue(r)
    })}
            ></md-checkbox>
            <span>${p(i, "enableMedication")}</span>
          </label>
          <label class="toggle-row">
            <md-checkbox
              ?checked=${e.remindersEnabled}
              ?disabled=${e.saving}
              @change=${(r) => this._updateDialog({
      remindersEnabled: this._checkedValue(r)
    })}
            ></md-checkbox>
            <span>${p(i, "enableReminders")}</span>
          </label>
          <fieldset>
            <legend>${p(i, "reminders")}</legend>
            ${e.reminders.length ? e.reminders.map(
      (r, o) => this._renderReminderRow(r, o, i)
    ) : u`
                  <div class="reminder-empty">
                    ${p(i, "noReminders")}
                  </div>
                `}
            <md-outlined-button
              type="button"
              ?disabled=${e.saving}
              @click=${() => this._addReminder()}
            >
              <ha-icon slot="icon" icon="mdi:plus"></ha-icon>
              ${p(i, "addReminder")}
            </md-outlined-button>
          </fieldset>
        </form>
        <div slot="actions" class="dialog-actions">
          ${this._renderDeleteActions(e, i)}
          <span class="action-spacer"></span>
          <md-text-button ?disabled=${e.saving} @click=${() => this._closeDialog()}>
            ${p(i, "cancel")}
          </md-text-button>
          <md-filled-button ?disabled=${e.saving} @click=${() => this._saveDialog()}>
            ${p(i, "save")}
          </md-filled-button>
        </div>
      </md-dialog>
    `;
  }
  _renderReminderRow(i, e, t) {
    const r = this._dialog, o = !r?.remindersEnabled || !!r.saving;
    return u`
      <div class="reminder-row">
        <md-outlined-text-field
          type="time"
          label=${p(t, "reminderTime")}
          .value=${i.time}
          ?disabled=${o}
          @input=${(a) => this._updateReminderTime(e, this._stringValue(a))}
        ></md-outlined-text-field>
        <label class="inline-check">
          <md-checkbox
            ?checked=${i.enabled}
            ?disabled=${o}
            @change=${(a) => this._updateReminderEnabled(e, this._checkedValue(a))}
          ></md-checkbox>
          <span>${p(t, "enableReminder")}</span>
        </label>
        <md-icon-button
          aria-label=${p(t, "removeReminder")}
          title=${p(t, "removeReminder")}
          ?disabled=${r?.saving}
          @click=${() => this._removeReminder(e)}
        >
          <ha-icon icon="mdi:trash-can-outline"></ha-icon>
        </md-icon-button>
      </div>
    `;
  }
  _renderDeleteActions(i, e) {
    return i.mode !== "edit" ? l : i.confirmDelete ? u`
      <span class="delete-confirm">${p(e, "deleteConfirm")}</span>
      <md-text-button
        ?disabled=${i.saving}
        @click=${() => this._updateDialog({ confirmDelete: !1 })}
      >
        ${p(e, "cancel")}
      </md-text-button>
      <md-outlined-button
        class="danger"
        ?disabled=${i.saving}
        @click=${() => this._deleteMedication()}
      >
        ${p(e, "deleteMedication")}
      </md-outlined-button>
    ` : u`
        <md-outlined-button
          class="danger"
          ?disabled=${i.saving}
          @click=${() => this._updateDialog({ confirmDelete: !0 })}
        >
          <ha-icon slot="icon" icon="mdi:trash-can-outline"></ha-icon>
          ${p(e, "delete")}
        </md-outlined-button>
      `;
  }
  _statusLabel(i, e) {
    return i === "taken" ? p(e, "taken") : i === "late" ? p(e, "late") : i === "missed" ? p(e, "missed") : p(e, "today");
  }
  _nextReminder(i, e) {
    return i.next_reminder ? i.next_reminder.time : p(e, "none");
  }
  _lastIntake(i, e) {
    return i.last_intake ? new Date(i.last_intake.taken_time).toLocaleString(e) : p(e, "none");
  }
  async _subscribe() {
    !this.hass || this._unsubscribe || (this._unsubscribe = await this.hass.connection.subscribeEvents(
      () => {
        this._loadDashboard();
      },
      "medication_manager_data_updated"
    ));
  }
  async _loadDashboard() {
    if (this.hass)
      try {
        const i = {
          type: "medication_manager/dashboard"
        };
        this._config.config_entry_id && (i.config_entry_id = this._config.config_entry_id), this._dashboard = await this.hass.callWS(i), this._error = void 0;
      } catch (i) {
        this._error = i instanceof Error ? i.message : String(i);
      }
  }
  async _takeMedication(i) {
    if (!(!this.hass || !this._dashboard || this._busyMedicationId))
      try {
        this._busyMedicationId = i.id, await this.hass.callService("medication_manager", "take_medication", {
          config_entry_id: this._dashboard.config_entry_id,
          medication_id: i.id,
          source: "button"
        }), await this._loadDashboard(), this._error = void 0;
      } catch (e) {
        this._error = e instanceof Error ? e.message : String(e);
      } finally {
        this._busyMedicationId = void 0;
      }
  }
  _openAddDialog() {
    this._dialog = {
      confirmDelete: !1,
      error: void 0,
      icon: "mdi:pill",
      medicationEnabled: !0,
      medicationId: void 0,
      mode: "add",
      name: "",
      originalTagId: null,
      reminders: [{ time: "08:00", enabled: !0 }],
      remindersEnabled: !0,
      saving: !1,
      tagId: ""
    };
  }
  _openEditDialog(i) {
    this._dialog = {
      confirmDelete: !1,
      error: void 0,
      icon: i.icon,
      medicationEnabled: i.enabled,
      medicationId: i.id,
      mode: "edit",
      name: i.name,
      originalTagId: i.tag_id,
      reminders: i.schedule.map((e) => ({ ...e })),
      remindersEnabled: i.schedule.some((e) => e.enabled),
      saving: !1,
      tagId: i.tag_id ?? ""
    };
  }
  _closeDialog() {
    this._dialog?.saving || (this._dialog = void 0);
  }
  _updateDialog(i) {
    this._dialog && (this._dialog = {
      ...this._dialog,
      ...i,
      confirmDelete: i.confirmDelete ?? this._dialog.confirmDelete,
      error: i.error ?? void 0
    });
  }
  _addReminder() {
    const i = this._dialog;
    i && this._updateDialog({
      reminders: [
        ...i.reminders,
        { time: this._nextAvailableReminderTime(i.reminders), enabled: !0 }
      ],
      remindersEnabled: !0
    });
  }
  _removeReminder(i) {
    const e = this._dialog;
    e && this._updateDialog({
      reminders: e.reminders.filter((t, r) => r !== i)
    });
  }
  _updateReminderTime(i, e) {
    const t = this._dialog;
    t && this._updateDialog({
      reminders: t.reminders.map(
        (r, o) => o === i ? { ...r, time: e } : r
      )
    });
  }
  _updateReminderEnabled(i, e) {
    const t = this._dialog;
    t && this._updateDialog({
      reminders: t.reminders.map(
        (r, o) => o === i ? { ...r, enabled: e } : r
      )
    });
  }
  async _saveDialog() {
    if (!this.hass || !this._dashboard || !this._dialog) return;
    const i = this.hass.language, e = this._dialogPayload(i);
    if (e)
      try {
        this._updateDialog({ saving: !0, error: void 0 });
        const t = {
          config_entry_id: this._dashboard.config_entry_id,
          ...e
        };
        this._dialog.mode === "add" ? await this.hass.callService(
          "medication_manager",
          "add_medication",
          t
        ) : await this.hass.callService("medication_manager", "update_medication", {
          ...t,
          medication_id: this._dialog.medicationId
        }), this._dialog = void 0, await this._loadDashboard();
      } catch (t) {
        this._updateDialog({
          error: t instanceof Error ? t.message : String(t),
          saving: !1
        });
      }
  }
  async _deleteMedication() {
    if (!(!this.hass || !this._dashboard || !this._dialog?.medicationId))
      try {
        this._updateDialog({ saving: !0, error: void 0 }), await this.hass.callService("medication_manager", "delete_medication", {
          config_entry_id: this._dashboard.config_entry_id,
          medication_id: this._dialog.medicationId
        }), this._dialog = void 0, await this._loadDashboard();
      } catch (i) {
        this._updateDialog({
          error: i instanceof Error ? i.message : String(i),
          saving: !1
        });
      }
  }
  _dialogPayload(i) {
    const e = this._dialog;
    if (!e) return;
    const t = e.name.trim();
    if (!t) {
      this._updateDialog({ error: p(i, "requiredName") });
      return;
    }
    const r = this._validatedReminders(i);
    if (!r) return;
    const o = e.tagId.trim(), a = {
      enabled: e.medicationEnabled,
      icon: e.icon.trim() || "mdi:pill",
      name: t,
      reminders: r
    };
    return o ? a.tag_id = o : e.mode === "edit" && e.originalTagId && (a.clear_tag = !0), a;
  }
  _validatedReminders(i) {
    const e = this._dialog;
    if (!e) return;
    const t = /* @__PURE__ */ new Set(), r = [];
    for (const o of e.reminders) {
      const a = o.time.trim();
      if (a) {
        if (!this._validReminderTime(a) || t.has(a)) {
          this._updateDialog({ error: p(i, "invalidReminder") });
          return;
        }
        t.add(a), r.push({
          enabled: e.remindersEnabled && o.enabled,
          time: a
        });
      }
    }
    return r;
  }
  _validReminderTime(i) {
    return /^([01]\d|2[0-3]):([0-5]\d)$/.exec(i) !== null;
  }
  _nextAvailableReminderTime(i) {
    const e = new Set(i.map((t) => t.time));
    for (const t of ["08:00", "12:00", "20:00"])
      if (!e.has(t)) return t;
    for (let t = 0; t < 24; t += 1) {
      const r = `${t.toString().padStart(2, "0")}:00`;
      if (!e.has(r)) return r;
    }
    return "08:00";
  }
  _stringValue(i) {
    return i.currentTarget.value;
  }
  _checkedValue(i) {
    return i.currentTarget.checked;
  }
};
P.styles = _`
    :host {
      display: block;
    }

    ha-card {
      overflow: hidden;
    }

    header {
      align-items: center;
      display: flex;
      gap: 12px;
      justify-content: space-between;
      padding: 16px;
    }

    h2,
    h3,
    p,
    dl {
      margin: 0;
    }

    h2 {
      font-size: 20px;
      font-weight: 600;
    }

    section {
      background: var(--divider-color);
      display: grid;
      gap: 1px;
    }

    .empty,
    .error {
      background: var(--card-background-color);
      padding: 16px;
    }

    .medication {
      background: var(--card-background-color);
      display: grid;
      gap: 12px;
      padding: 14px 16px 16px;
    }

    .disabled {
      opacity: 0.56;
    }

    .identity {
      align-items: center;
      display: grid;
      gap: 8px;
      grid-template-columns: 40px 1fr 40px 40px;
    }

    .identity > ha-icon {
      color: var(--primary-color);
      height: 32px;
      width: 32px;
    }

    h3 {
      font-size: 16px;
      font-weight: 600;
      line-height: 1.3;
      overflow-wrap: anywhere;
    }

    p,
    dt {
      color: var(--secondary-text-color);
      font-size: 12px;
    }

    dl {
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    dd {
      font-size: 14px;
      margin: 2px 0 0;
      min-width: 0;
      overflow-wrap: anywhere;
    }

    .week {
      display: grid;
      gap: 6px;
      grid-template-columns: repeat(7, minmax(0, 1fr));
    }

    .week span {
      align-items: center;
      aspect-ratio: 1;
      background: var(--secondary-background-color);
      border-radius: 6px;
      display: flex;
      justify-content: center;
      line-height: 1;
      min-width: 0;
    }

    .week ha-icon {
      height: 18px;
      width: 18px;
    }

    .week .taken {
      background: color-mix(in srgb, var(--success-color) 20%, transparent);
      color: var(--success-color);
    }

    .week .late {
      background: color-mix(in srgb, #f5c542 24%, transparent);
    }

    .week .missed,
    .week .none {
      background: color-mix(in srgb, var(--error-color) 12%, transparent);
      border: 1px solid color-mix(in srgb, var(--error-color) 22%, transparent);
    }

    .week .future {
      background: transparent;
      border: 1px dashed var(--divider-color);
    }

    .late-marker {
      background: #f5c542;
      border-radius: 50%;
      display: block;
      height: 12px;
      width: 12px;
    }

    md-dialog {
      --md-dialog-container-color: var(--card-background-color);
      --md-dialog-headline-color: var(--primary-text-color);
      --md-dialog-supporting-text-color: var(--primary-text-color);
      min-width: min(560px, calc(100vw - 32px));
    }

    .dialog-form {
      display: grid;
      gap: 14px;
      min-width: min(520px, calc(100vw - 64px));
    }

    .dialog-error {
      background: color-mix(in srgb, var(--error-color) 12%, transparent);
      border: 1px solid color-mix(in srgb, var(--error-color) 35%, transparent);
      border-radius: 6px;
      color: var(--error-color);
      padding: 10px 12px;
    }

    .toggle-row,
    .inline-check {
      align-items: center;
      display: flex;
      gap: 10px;
      min-width: 0;
    }

    .toggle-row span,
    .inline-check span {
      overflow-wrap: anywhere;
    }

    fieldset {
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      display: grid;
      gap: 10px;
      margin: 0;
      padding: 12px;
    }

    legend {
      color: var(--secondary-text-color);
      font-size: 12px;
      padding: 0 4px;
    }

    .reminder-row {
      align-items: center;
      display: grid;
      gap: 8px;
      grid-template-columns: minmax(120px, 1fr) minmax(0, 1fr) 40px;
    }

    .reminder-empty {
      color: var(--secondary-text-color);
      font-size: 13px;
      padding: 2px 0;
    }

    .dialog-actions {
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      width: 100%;
    }

    .action-spacer {
      flex: 1 1 auto;
    }

    .danger {
      --md-outlined-button-label-text-color: var(--error-color);
      --md-outlined-button-outline-color: var(--error-color);
      --md-outlined-button-icon-color: var(--error-color);
    }

    .delete-confirm {
      color: var(--error-color);
      font-size: 13px;
      margin-inline-end: 4px;
    }

    @media (max-width: 520px) {
      header {
        align-items: stretch;
        flex-direction: column;
      }

      .reminder-row {
        grid-template-columns: 1fr 40px;
      }

      .reminder-row .inline-check {
        grid-column: 1 / -1;
        grid-row: 2;
      }
    }
  `;
U([
  d({ attribute: !1 })
], P.prototype, "hass", 2);
U([
  g()
], P.prototype, "_config", 2);
U([
  g()
], P.prototype, "_dashboard", 2);
U([
  g()
], P.prototype, "_dialog", 2);
U([
  g()
], P.prototype, "_error", 2);
U([
  g()
], P.prototype, "_busyMedicationId", 2);
P = U([
  S("medication-manager")
], P);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "medication-manager",
  name: "Medication Manager",
  description: "Medication list and weekly history"
});
export {
  P as MedicationManagerCard
};
