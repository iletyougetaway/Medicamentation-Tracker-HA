const N = globalThis, j = N.ShadowRoot && (N.ShadyCSS === void 0 || N.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, q = /* @__PURE__ */ Symbol(), Z = /* @__PURE__ */ new WeakMap();
let se = class {
  constructor(e, i, r) {
    if (this._$cssResult$ = !0, r !== q) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = i;
  }
  get styleSheet() {
    let e = this.o;
    const i = this.t;
    if (j && e === void 0) {
      const r = i !== void 0 && i.length === 1;
      r && (e = Z.get(i)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && Z.set(i, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const ce = (t) => new se(typeof t == "string" ? t : t + "", void 0, q), he = (t, ...e) => {
  const i = t.length === 1 ? t[0] : e.reduce((r, s, n) => r + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + t[n + 1], t[0]);
  return new se(i, t, q);
}, pe = (t, e) => {
  if (j) t.adoptedStyleSheets = e.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of e) {
    const r = document.createElement("style"), s = N.litNonce;
    s !== void 0 && r.setAttribute("nonce", s), r.textContent = i.cssText, t.appendChild(r);
  }
}, J = j ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let i = "";
  for (const r of e.cssRules) i += r.cssText;
  return ce(i);
})(t) : t;
const { is: ue, defineProperty: me, getOwnPropertyDescriptor: _e, getOwnPropertyNames: ge, getOwnPropertySymbols: be, getPrototypeOf: fe } = Object, H = globalThis, K = H.trustedTypes, $e = K ? K.emptyScript : "", ve = H.reactiveElementPolyfillSupport, S = (t, e) => t, O = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? $e : null;
      break;
    case Object:
    case Array:
      t = t == null ? t : JSON.stringify(t);
  }
  return t;
}, fromAttribute(t, e) {
  let i = t;
  switch (e) {
    case Boolean:
      i = t !== null;
      break;
    case Number:
      i = t === null ? null : Number(t);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(t);
      } catch {
        i = null;
      }
  }
  return i;
} }, B = (t, e) => !ue(t, e), G = { attribute: !0, type: String, converter: O, reflect: !1, useDefault: !1, hasChanged: B };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), H.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let w = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, i = G) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(e, i), !i.noAccessor) {
      const r = /* @__PURE__ */ Symbol(), s = this.getPropertyDescriptor(e, r, i);
      s !== void 0 && me(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, i, r) {
    const { get: s, set: n } = _e(this.prototype, e) ?? { get() {
      return this[i];
    }, set(o) {
      this[i] = o;
    } };
    return { get: s, set(o) {
      const l = s?.call(this);
      n?.call(this, o), this.requestUpdate(e, l, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? G;
  }
  static _$Ei() {
    if (this.hasOwnProperty(S("elementProperties"))) return;
    const e = fe(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(S("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(S("properties"))) {
      const i = this.properties, r = [...ge(i), ...be(i)];
      for (const s of r) this.createProperty(s, i[s]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const i = litPropertyMetadata.get(e);
      if (i !== void 0) for (const [r, s] of i) this.elementProperties.set(r, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, r] of this.elementProperties) {
      const s = this._$Eu(i, r);
      s !== void 0 && this._$Eh.set(s, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const i = [];
    if (Array.isArray(e)) {
      const r = new Set(e.flat(1 / 0).reverse());
      for (const s of r) i.unshift(J(s));
    } else e !== void 0 && i.push(J(e));
    return i;
  }
  static _$Eu(e, i) {
    const r = i.attribute;
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
    const e = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const r of i.keys()) this.hasOwnProperty(r) && (e.set(r, this[r]), delete this[r]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return pe(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, i, r) {
    this._$AK(e, r);
  }
  _$ET(e, i) {
    const r = this.constructor.elementProperties.get(e), s = this.constructor._$Eu(e, r);
    if (s !== void 0 && r.reflect === !0) {
      const n = (r.converter?.toAttribute !== void 0 ? r.converter : O).toAttribute(i, r.type);
      this._$Em = e, n == null ? this.removeAttribute(s) : this.setAttribute(s, n), this._$Em = null;
    }
  }
  _$AK(e, i) {
    const r = this.constructor, s = r._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const n = r.getPropertyOptions(s), o = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : O;
      this._$Em = s;
      const l = o.fromAttribute(i, n.type);
      this[s] = l ?? this._$Ej?.get(s) ?? l, this._$Em = null;
    }
  }
  requestUpdate(e, i, r, s = !1, n) {
    if (e !== void 0) {
      const o = this.constructor;
      if (s === !1 && (n = this[e]), r ??= o.getPropertyOptions(e), !((r.hasChanged ?? B)(n, i) || r.useDefault && r.reflect && n === this._$Ej?.get(e) && !this.hasAttribute(o._$Eu(e, r)))) return;
      this.C(e, i, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, i, { useDefault: r, reflect: s, wrapped: n }, o) {
    r && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, o ?? i ?? this[e]), n !== !0 || o !== void 0) || (this._$AL.has(e) || (this.hasUpdated || r || (i = void 0), this._$AL.set(e, i)), s === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
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
        for (const [s, n] of this._$Ep) this[s] = n;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [s, n] of r) {
        const { wrapped: o } = n, l = this[s];
        o !== !0 || this._$AL.has(s) || l === void 0 || this.C(s, void 0, n, l);
      }
    }
    let e = !1;
    const i = this._$AL;
    try {
      e = this.shouldUpdate(i), e ? (this.willUpdate(i), this._$EO?.forEach((r) => r.hostUpdate?.()), this.update(i)) : this._$EM();
    } catch (r) {
      throw e = !1, this._$EM(), r;
    }
    e && this._$AE(i);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach((i) => i.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
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
    this._$Eq &&= this._$Eq.forEach((i) => this._$ET(i, this[i])), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
w.elementStyles = [], w.shadowRootOptions = { mode: "open" }, w[S("elementProperties")] = /* @__PURE__ */ new Map(), w[S("finalized")] = /* @__PURE__ */ new Map(), ve?.({ ReactiveElement: w }), (H.reactiveElementVersions ??= []).push("2.1.2");
const V = globalThis, Q = (t) => t, I = V.trustedTypes, X = I ? I.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, ne = "$lit$", f = `lit$${Math.random().toFixed(9).slice(2)}$`, oe = "?" + f, ye = `<${oe}>`, y = document, R = () => y.createComment(""), D = (t) => t === null || typeof t != "object" && typeof t != "function", W = Array.isArray, xe = (t) => W(t) || typeof t?.[Symbol.iterator] == "function", L = `[ 	
\f\r]`, k = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Y = /-->/g, ee = />/g, $ = RegExp(`>|${L}(?:([^\\s"'>=/]+)(${L}*=${L}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), te = /'/g, ie = /"/g, ae = /^(?:script|style|textarea|title)$/i, we = (t) => (e, ...i) => ({ _$litType$: t, strings: e, values: i }), m = we(1), A = /* @__PURE__ */ Symbol.for("lit-noChange"), h = /* @__PURE__ */ Symbol.for("lit-nothing"), re = /* @__PURE__ */ new WeakMap(), v = y.createTreeWalker(y, 129);
function de(t, e) {
  if (!W(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return X !== void 0 ? X.createHTML(e) : e;
}
const Ae = (t, e) => {
  const i = t.length - 1, r = [];
  let s, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = k;
  for (let l = 0; l < i; l++) {
    const d = t[l];
    let p, u, c = -1, _ = 0;
    for (; _ < d.length && (o.lastIndex = _, u = o.exec(d), u !== null); ) _ = o.lastIndex, o === k ? u[1] === "!--" ? o = Y : u[1] !== void 0 ? o = ee : u[2] !== void 0 ? (ae.test(u[2]) && (s = RegExp("</" + u[2], "g")), o = $) : u[3] !== void 0 && (o = $) : o === $ ? u[0] === ">" ? (o = s ?? k, c = -1) : u[1] === void 0 ? c = -2 : (c = o.lastIndex - u[2].length, p = u[1], o = u[3] === void 0 ? $ : u[3] === '"' ? ie : te) : o === ie || o === te ? o = $ : o === Y || o === ee ? o = k : (o = $, s = void 0);
    const b = o === $ && t[l + 1].startsWith("/>") ? " " : "";
    n += o === k ? d + ye : c >= 0 ? (r.push(p), d.slice(0, c) + ne + d.slice(c) + f + b) : d + f + (c === -2 ? l : b);
  }
  return [de(t, n + (t[i] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), r];
};
class M {
  constructor({ strings: e, _$litType$: i }, r) {
    let s;
    this.parts = [];
    let n = 0, o = 0;
    const l = e.length - 1, d = this.parts, [p, u] = Ae(e, i);
    if (this.el = M.createElement(p, r), v.currentNode = this.el.content, i === 2 || i === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (s = v.nextNode()) !== null && d.length < l; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const c of s.getAttributeNames()) if (c.endsWith(ne)) {
          const _ = u[o++], b = s.getAttribute(c).split(f), U = /([.?@])?(.*)/.exec(_);
          d.push({ type: 1, index: n, name: U[2], strings: b, ctor: U[1] === "." ? ke : U[1] === "?" ? Se : U[1] === "@" ? Ce : z }), s.removeAttribute(c);
        } else c.startsWith(f) && (d.push({ type: 6, index: n }), s.removeAttribute(c));
        if (ae.test(s.tagName)) {
          const c = s.textContent.split(f), _ = c.length - 1;
          if (_ > 0) {
            s.textContent = I ? I.emptyScript : "";
            for (let b = 0; b < _; b++) s.append(c[b], R()), v.nextNode(), d.push({ type: 2, index: ++n });
            s.append(c[_], R());
          }
        }
      } else if (s.nodeType === 8) if (s.data === oe) d.push({ type: 2, index: n });
      else {
        let c = -1;
        for (; (c = s.data.indexOf(f, c + 1)) !== -1; ) d.push({ type: 7, index: n }), c += f.length - 1;
      }
      n++;
    }
  }
  static createElement(e, i) {
    const r = y.createElement("template");
    return r.innerHTML = e, r;
  }
}
function E(t, e, i = t, r) {
  if (e === A) return e;
  let s = r !== void 0 ? i._$Co?.[r] : i._$Cl;
  const n = D(e) ? void 0 : e._$litDirective$;
  return s?.constructor !== n && (s?._$AO?.(!1), n === void 0 ? s = void 0 : (s = new n(t), s._$AT(t, i, r)), r !== void 0 ? (i._$Co ??= [])[r] = s : i._$Cl = s), s !== void 0 && (e = E(t, s._$AS(t, e.values), s, r)), e;
}
class Ee {
  constructor(e, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: i }, parts: r } = this._$AD, s = (e?.creationScope ?? y).importNode(i, !0);
    v.currentNode = s;
    let n = v.nextNode(), o = 0, l = 0, d = r[0];
    for (; d !== void 0; ) {
      if (o === d.index) {
        let p;
        d.type === 2 ? p = new P(n, n.nextSibling, this, e) : d.type === 1 ? p = new d.ctor(n, d.name, d.strings, this, e) : d.type === 6 && (p = new Re(n, this, e)), this._$AV.push(p), d = r[++l];
      }
      o !== d?.index && (n = v.nextNode(), o++);
    }
    return v.currentNode = y, s;
  }
  p(e) {
    let i = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, i), i += r.strings.length - 2) : r._$AI(e[i])), i++;
  }
}
class P {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, i, r, s) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = e, this._$AB = i, this._$AM = r, this.options = s, this._$Cv = s?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && e?.nodeType === 11 && (e = i.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, i = this) {
    e = E(this, e, i), D(e) ? e === h || e == null || e === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : e !== this._$AH && e !== A && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : xe(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== h && D(this._$AH) ? this._$AA.nextSibling.data = e : this.T(y.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: i, _$litType$: r } = e, s = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = M.createElement(de(r.h, r.h[0]), this.options)), r);
    if (this._$AH?._$AD === s) this._$AH.p(i);
    else {
      const n = new Ee(s, this), o = n.u(this.options);
      n.p(i), this.T(o), this._$AH = n;
    }
  }
  _$AC(e) {
    let i = re.get(e.strings);
    return i === void 0 && re.set(e.strings, i = new M(e)), i;
  }
  k(e) {
    W(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let r, s = 0;
    for (const n of e) s === i.length ? i.push(r = new P(this.O(R()), this.O(R()), this, this.options)) : r = i[s], r._$AI(n), s++;
    s < i.length && (this._$AR(r && r._$AB.nextSibling, s), i.length = s);
  }
  _$AR(e = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); e !== this._$AB; ) {
      const r = Q(e).nextSibling;
      Q(e).remove(), e = r;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class z {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, i, r, s, n) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = e, this.name = i, this._$AM = s, this.options = n, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = h;
  }
  _$AI(e, i = this, r, s) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) e = E(this, e, i, 0), o = !D(e) || e !== this._$AH && e !== A, o && (this._$AH = e);
    else {
      const l = e;
      let d, p;
      for (e = n[0], d = 0; d < n.length - 1; d++) p = E(this, l[r + d], i, d), p === A && (p = this._$AH[d]), o ||= !D(p) || p !== this._$AH[d], p === h ? e = h : e !== h && (e += (p ?? "") + n[d + 1]), this._$AH[d] = p;
    }
    o && !s && this.j(e);
  }
  j(e) {
    e === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class ke extends z {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === h ? void 0 : e;
  }
}
class Se extends z {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== h);
  }
}
class Ce extends z {
  constructor(e, i, r, s, n) {
    super(e, i, r, s, n), this.type = 5;
  }
  _$AI(e, i = this) {
    if ((e = E(this, e, i, 0) ?? h) === A) return;
    const r = this._$AH, s = e === h && r !== h || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, n = e !== h && (r === h || s);
    s && this.element.removeEventListener(this.name, this, r), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Re {
  constructor(e, i, r) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    E(this, e);
  }
}
const De = V.litHtmlPolyfillSupport;
De?.(M, P), (V.litHtmlVersions ??= []).push("3.3.3");
const Me = (t, e, i) => {
  const r = i?.renderBefore ?? e;
  let s = r._$litPart$;
  if (s === void 0) {
    const n = i?.renderBefore ?? null;
    r._$litPart$ = s = new P(e.insertBefore(R(), n), n, void 0, i ?? {});
  }
  return s._$AI(t), s;
};
const F = globalThis;
class C extends w {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Me(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return A;
  }
}
C._$litElement$ = !0, C.finalized = !0, F.litElementHydrateSupport?.({ LitElement: C });
const Pe = F.litElementPolyfillSupport;
Pe?.({ LitElement: C });
(F.litElementVersions ??= []).push("4.2.2");
const Te = (t) => (e, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
const Ue = { attribute: !0, type: String, converter: O, reflect: !1, hasChanged: B }, Ne = (t = Ue, e, i) => {
  const { kind: r, metadata: s } = i;
  let n = globalThis.litPropertyMetadata.get(s);
  if (n === void 0 && globalThis.litPropertyMetadata.set(s, n = /* @__PURE__ */ new Map()), r === "setter" && ((t = Object.create(t)).wrapped = !0), n.set(i.name, t), r === "accessor") {
    const { name: o } = i;
    return { set(l) {
      const d = e.get.call(this);
      e.set.call(this, l), this.requestUpdate(o, d, t, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(o, void 0, t, l), l;
    } };
  }
  if (r === "setter") {
    const { name: o } = i;
    return function(l) {
      const d = this[o];
      e.call(this, l), this.requestUpdate(o, d, t, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function le(t) {
  return (e, i) => typeof i == "object" ? Ne(t, e, i) : ((r, s, n) => {
    const o = s.hasOwnProperty(n);
    return s.constructor.createProperty(n, r), o ? Object.getOwnPropertyDescriptor(s, n) : void 0;
  })(t, e, i);
}
function T(t) {
  return le({ ...t, state: !0, attribute: !1 });
}
const Oe = {
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
}, Ie = {
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
function a(t, e) {
  return (t ?? "ru").toLowerCase().replace("_", "-").startsWith("en") ? Ie[e] : Oe[e];
}
var He = Object.defineProperty, ze = Object.getOwnPropertyDescriptor, x = (t, e, i, r) => {
  for (var s = r > 1 ? void 0 : r ? ze(e, i) : e, n = t.length - 1, o; n >= 0; n--)
    (o = t[n]) && (s = (r ? o(e, i, s) : o(s)) || s);
  return r && s && He(e, i, s), s;
};
let g = class extends C {
  constructor() {
    super(...arguments), this._config = { type: "custom:medication-manager" };
  }
  static getStubConfig() {
    return { type: "custom:medication-manager" };
  }
  setConfig(t) {
    this._config = t;
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
  updated(t) {
    t.has("hass") && (this._subscribe(), this._loadDashboard());
  }
  render() {
    this.hass;
    const t = this._language, e = this._config.title ?? a(t, "title");
    return this._error ? m`<ha-card><div class="error">${this._error}</div></ha-card>` : m`
      <ha-card>
        <header>
          <h2>${e}</h2>
          <button
            class="button filled"
            type="button"
            @click=${() => this._openAddDialog()}
          >
            <ha-icon icon="mdi:plus"></ha-icon>
            ${a(t, "add")}
          </button>
        </header>
        <section>
          ${this._dashboard?.medications.length ? this._dashboard.medications.map(
      (i) => this._renderMedication(i, t)
    ) : m`<div class="empty">${a(t, "empty")}</div>`}
        </section>
      </ha-card>
      ${this._renderMedicationDialog(t)}
    `;
  }
  _renderMedication(t, e) {
    const i = this._busyMedicationId === t.id;
    return m`
      <article class=${t.enabled ? "medication" : "medication disabled"}>
        <div class="identity">
          <ha-icon .icon=${t.icon}></ha-icon>
          <div>
            <h3>${t.name}</h3>
            <p>${this._statusLabel(t.today_status, e)}</p>
          </div>
          <ha-icon-button
            .label=${a(e, "take")}
            aria-label=${a(e, "take")}
            title=${a(e, "take")}
            ?disabled=${i}
            @click=${() => this._takeMedication(t)}
          >
            <ha-icon icon="mdi:check"></ha-icon>
          </ha-icon-button>
          <ha-icon-button
            .label=${a(e, "edit")}
            aria-label=${a(e, "edit")}
            title=${a(e, "edit")}
            @click=${() => this._openEditDialog(t)}
          >
            <ha-icon icon="mdi:pencil"></ha-icon>
          </ha-icon-button>
        </div>
        <dl>
          <div>
            <dt>${a(e, "next")}</dt>
            <dd>${this._nextReminder(t, e)}</dd>
          </div>
          <div>
            <dt>${a(e, "last")}</dt>
            <dd>${this._lastIntake(t, e)}</dd>
          </div>
        </dl>
        <div class="week">
          ${t.weekly_history.map(
      (r) => this._renderWeeklyDay(t, r, e)
    )}
        </div>
      </article>
    `;
  }
  _renderWeeklyDay(t, e, i) {
    const r = e.is_future ? "future" : e.status ?? "none", s = e.status ? this._statusLabel(e.status, i) : a(i, "none");
    return m`
      <span class=${r} title=${`${e.date}: ${s}`}>
        ${this._weeklyContent(t, e)}
      </span>
    `;
  }
  _weeklyContent(t, e) {
    return e.is_future || e.status === null || e.status === "missed" ? h : e.status === "late" ? m`<span class="late-marker"></span>` : m`<ha-icon .icon=${t.icon}></ha-icon>`;
  }
  _renderMedicationDialog(t) {
    const e = this._dialog;
    if (!e) return h;
    const i = e.mode === "add" ? a(t, "addMedication") : a(t, "editMedication");
    return m`
      <ha-dialog
        open
        .headerTitle=${i}
        .heading=${i}
        header-title=${i}
        @closed=${() => this._closeDialog()}
      >
        <div class="dialog-content">
          <form class="dialog-form">
            ${e.error ? m`<div class="dialog-error">${e.error}</div>` : h}
            ${this._renderTextField({
      disabled: e.saving,
      label: a(t, "name"),
      required: !0,
      value: e.name,
      onInput: (r) => this._updateDialog({ name: r })
    })}
            ${this._renderTextField({
      disabled: e.saving,
      label: a(t, "icon"),
      value: e.icon,
      onInput: (r) => this._updateDialog({ icon: r })
    })}
            ${this._renderTextField({
      disabled: e.saving,
      label: a(t, "nfcTag"),
      value: e.tagId,
      onInput: (r) => this._updateDialog({ tagId: r })
    })}
            <label class="toggle-row">
              <ha-checkbox
                .checked=${e.medicationEnabled}
                ?disabled=${e.saving}
                @change=${(r) => this._updateDialog({
      medicationEnabled: this._checkedValue(r)
    })}
              ></ha-checkbox>
              <span>${a(t, "enableMedication")}</span>
            </label>
            <label class="toggle-row">
              <ha-checkbox
                .checked=${e.remindersEnabled}
                ?disabled=${e.saving}
                @change=${(r) => this._updateDialog({
      remindersEnabled: this._checkedValue(r)
    })}
              ></ha-checkbox>
              <span>${a(t, "enableReminders")}</span>
            </label>
            <fieldset>
              <legend>${a(t, "reminders")}</legend>
              ${e.reminders.length ? e.reminders.map(
      (r, s) => this._renderReminderRow(r, s, t)
    ) : m`
                    <div class="reminder-empty">
                      ${a(t, "noReminders")}
                    </div>
                  `}
              <button
                class="button outlined"
                type="button"
                ?disabled=${e.saving}
                @click=${() => this._addReminder()}
              >
                <ha-icon icon="mdi:plus"></ha-icon>
                ${a(t, "addReminder")}
              </button>
            </fieldset>
          </form>
          <div class="dialog-actions">
            ${this._renderDeleteActions(e, t)}
            <span class="action-spacer"></span>
            <button
              class="button text"
              type="button"
              ?disabled=${e.saving}
              @click=${() => this._closeDialog()}
            >
              ${a(t, "cancel")}
            </button>
            <button
              class="button filled"
              type="button"
              ?disabled=${e.saving}
              @click=${() => this._saveDialog()}
            >
              ${a(t, "save")}
            </button>
          </div>
        </div>
      </ha-dialog>
    `;
  }
  _renderReminderRow(t, e, i) {
    const r = this._dialog, s = !r?.remindersEnabled || !!r.saving;
    return m`
      <div class="reminder-row">
        ${this._renderTextField({
      disabled: s,
      label: a(i, "reminderTime"),
      type: "time",
      value: t.time,
      onInput: (n) => this._updateReminderTime(e, n)
    })}
        <label class="inline-check">
          <ha-checkbox
            .checked=${t.enabled}
            ?disabled=${s}
            @change=${(n) => this._updateReminderEnabled(e, this._checkedValue(n))}
          ></ha-checkbox>
          <span>${a(i, "enableReminder")}</span>
        </label>
        <ha-icon-button
          .label=${a(i, "removeReminder")}
          aria-label=${a(i, "removeReminder")}
          title=${a(i, "removeReminder")}
          ?disabled=${r?.saving}
          @click=${() => this._removeReminder(e)}
        >
          <ha-icon icon="mdi:trash-can-outline"></ha-icon>
        </ha-icon-button>
      </div>
    `;
  }
  _renderDeleteActions(t, e) {
    return t.mode !== "edit" ? h : t.confirmDelete ? m`
      <span class="delete-confirm">${a(e, "deleteConfirm")}</span>
      <button
        class="button text"
        type="button"
        ?disabled=${t.saving}
        @click=${() => this._updateDialog({ confirmDelete: !1 })}
      >
        ${a(e, "cancel")}
      </button>
      <button
        class="button outlined danger"
        type="button"
        ?disabled=${t.saving}
        @click=${() => this._deleteMedication()}
      >
        ${a(e, "deleteMedication")}
      </button>
    ` : m`
        <button
          class="button outlined danger"
          type="button"
          ?disabled=${t.saving}
          @click=${() => this._updateDialog({ confirmDelete: !0 })}
        >
          <ha-icon icon="mdi:trash-can-outline"></ha-icon>
          ${a(e, "delete")}
        </button>
      `;
  }
  _statusLabel(t, e) {
    return t === "taken" ? a(e, "taken") : t === "late" ? a(e, "late") : t === "missed" ? a(e, "missed") : a(e, "today");
  }
  get _language() {
    return this.hass?.locale?.language ?? this.hass?.language ?? "ru";
  }
  _renderTextField(t) {
    return m`
      <label class="text-field">
        <span>${t.label}</span>
        <input
          .value=${t.value}
          ?disabled=${t.disabled}
          ?required=${t.required ?? !1}
          type=${t.type ?? "text"}
          @input=${(e) => t.onInput(this._stringValue(e))}
        />
      </label>
    `;
  }
  _nextReminder(t, e) {
    return t.next_reminder ? t.next_reminder.time : a(e, "none");
  }
  _lastIntake(t, e) {
    return t.last_intake ? new Date(t.last_intake.taken_time).toLocaleString(e) : a(e, "none");
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
        const t = {
          type: "medication_manager/dashboard"
        };
        this._config.config_entry_id && (t.config_entry_id = this._config.config_entry_id), this._dashboard = await this.hass.callWS(t), this._error = void 0;
      } catch (t) {
        this._error = t instanceof Error ? t.message : String(t);
      }
  }
  async _takeMedication(t) {
    if (!(!this.hass || !this._dashboard || this._busyMedicationId))
      try {
        this._busyMedicationId = t.id, await this.hass.callService("medication_manager", "take_medication", {
          config_entry_id: this._dashboard.config_entry_id,
          medication_id: t.id,
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
  _openEditDialog(t) {
    this._dialog = {
      confirmDelete: !1,
      error: void 0,
      icon: t.icon,
      medicationEnabled: t.enabled,
      medicationId: t.id,
      mode: "edit",
      name: t.name,
      originalTagId: t.tag_id,
      reminders: t.schedule.map((e) => ({ ...e })),
      remindersEnabled: t.schedule.some((e) => e.enabled),
      saving: !1,
      tagId: t.tag_id ?? ""
    };
  }
  _closeDialog() {
    this._dialog?.saving || (this._dialog = void 0);
  }
  _updateDialog(t) {
    this._dialog && (this._dialog = {
      ...this._dialog,
      ...t,
      confirmDelete: t.confirmDelete ?? this._dialog.confirmDelete,
      error: t.error ?? void 0
    });
  }
  _addReminder() {
    const t = this._dialog;
    t && this._updateDialog({
      reminders: [
        ...t.reminders,
        { time: this._nextAvailableReminderTime(t.reminders), enabled: !0 }
      ],
      remindersEnabled: !0
    });
  }
  _removeReminder(t) {
    const e = this._dialog;
    e && this._updateDialog({
      reminders: e.reminders.filter((i, r) => r !== t)
    });
  }
  _updateReminderTime(t, e) {
    const i = this._dialog;
    i && this._updateDialog({
      reminders: i.reminders.map(
        (r, s) => s === t ? { ...r, time: e } : r
      )
    });
  }
  _updateReminderEnabled(t, e) {
    const i = this._dialog;
    i && this._updateDialog({
      reminders: i.reminders.map(
        (r, s) => s === t ? { ...r, enabled: e } : r
      )
    });
  }
  async _saveDialog() {
    if (!this.hass || !this._dashboard || !this._dialog) return;
    const t = this._language, e = this._dialogPayload(t);
    if (e)
      try {
        this._updateDialog({ saving: !0, error: void 0 });
        const i = {
          config_entry_id: this._dashboard.config_entry_id,
          ...e
        };
        this._dialog.mode === "add" ? await this.hass.callService(
          "medication_manager",
          "add_medication",
          i
        ) : await this.hass.callService("medication_manager", "update_medication", {
          ...i,
          medication_id: this._dialog.medicationId
        }), this._dialog = void 0, await this._loadDashboard();
      } catch (i) {
        this._updateDialog({
          error: i instanceof Error ? i.message : String(i),
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
      } catch (t) {
        this._updateDialog({
          error: t instanceof Error ? t.message : String(t),
          saving: !1
        });
      }
  }
  _dialogPayload(t) {
    const e = this._dialog;
    if (!e) return;
    const i = e.name.trim();
    if (!i) {
      this._updateDialog({ error: a(t, "requiredName") });
      return;
    }
    const r = this._validatedReminders(t);
    if (!r) return;
    const s = e.tagId.trim(), n = {
      enabled: e.medicationEnabled,
      icon: e.icon.trim() || "mdi:pill",
      name: i,
      reminders: r
    };
    return s ? n.tag_id = s : e.mode === "edit" && e.originalTagId && (n.clear_tag = !0), n;
  }
  _validatedReminders(t) {
    const e = this._dialog;
    if (!e) return;
    const i = /* @__PURE__ */ new Set(), r = [];
    for (const s of e.reminders) {
      const n = s.time.trim();
      if (n) {
        if (!this._validReminderTime(n) || i.has(n)) {
          this._updateDialog({ error: a(t, "invalidReminder") });
          return;
        }
        i.add(n), r.push({
          enabled: e.remindersEnabled && s.enabled,
          time: n
        });
      }
    }
    return r;
  }
  _validReminderTime(t) {
    return /^([01]\d|2[0-3]):([0-5]\d)$/.exec(t) !== null;
  }
  _nextAvailableReminderTime(t) {
    const e = new Set(t.map((i) => i.time));
    for (const i of ["08:00", "12:00", "20:00"])
      if (!e.has(i)) return i;
    for (let i = 0; i < 24; i += 1) {
      const r = `${i.toString().padStart(2, "0")}:00`;
      if (!e.has(r)) return r;
    }
    return "08:00";
  }
  _stringValue(t) {
    return t.currentTarget.value;
  }
  _checkedValue(t) {
    return t.currentTarget.checked;
  }
};
g.styles = he`
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

    .identity ha-icon-button,
    .reminder-row ha-icon-button {
      --ha-icon-button-size: 40px;
      color: var(--primary-text-color);
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

    .button {
      align-items: center;
      appearance: none;
      border: 0;
      border-radius: 9999px;
      box-sizing: border-box;
      cursor: pointer;
      display: inline-flex;
      font: inherit;
      font-size: 14px;
      font-weight: 500;
      gap: 8px;
      justify-content: center;
      letter-spacing: 0;
      line-height: 20px;
      min-height: 40px;
      min-width: 64px;
      outline: none;
      padding: 10px 24px;
      position: relative;
      text-decoration: none;
      user-select: none;
      white-space: nowrap;
    }

    .button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    .button:disabled {
      cursor: default;
      opacity: 0.38;
      pointer-events: none;
    }

    .button ha-icon {
      height: 18px;
      width: 18px;
    }

    .button.filled {
      background: var(--primary-color);
      color: var(--text-primary-color, white);
    }

    .button.outlined,
    .button.text {
      background: transparent;
      color: var(--primary-color);
    }

    .button.outlined {
      border: 1px solid var(--divider-color);
    }

    .button:is(.outlined, .text):hover:not(:disabled) {
      background: color-mix(in srgb, var(--primary-color) 8%, transparent);
    }

    .button.filled:hover:not(:disabled) {
      filter: brightness(1.04);
    }

    .button.outlined.danger,
    .button.text.danger {
      color: var(--error-color);
    }

    .button.outlined.danger {
      border-color: var(--error-color);
    }

    .button.outlined.danger:hover:not(:disabled),
    .button.text.danger:hover:not(:disabled) {
      background: color-mix(in srgb, var(--error-color) 8%, transparent);
    }

    ha-dialog {
      --ha-dialog-header-title-color: var(--primary-text-color);
      --ha-dialog-surface-background: var(--card-background-color);
      --ha-dialog-width-md: 560px;
    }

    .dialog-content,
    .dialog-form {
      display: grid;
      gap: 14px;
    }

    .dialog-content {
      min-width: min(520px, calc(100vw - 64px));
    }

    .text-field {
      color: var(--secondary-text-color);
      display: grid;
      font-size: 12px;
      gap: 4px;
      min-width: 0;
    }

    .text-field input {
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      box-sizing: border-box;
      color: var(--primary-text-color);
      font: inherit;
      font-size: 16px;
      height: 56px;
      min-width: 0;
      outline: none;
      padding: 0 16px;
      width: 100%;
    }

    .text-field input:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 1px var(--primary-color);
    }

    .text-field input:disabled {
      color: var(--disabled-text-color);
      opacity: 0.6;
    }

    .text-field input[type="time"] {
      color-scheme: light dark;
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
x([
  le({ attribute: !1 })
], g.prototype, "hass", 2);
x([
  T()
], g.prototype, "_config", 2);
x([
  T()
], g.prototype, "_dashboard", 2);
x([
  T()
], g.prototype, "_dialog", 2);
x([
  T()
], g.prototype, "_error", 2);
x([
  T()
], g.prototype, "_busyMedicationId", 2);
g = x([
  Te("medication-manager")
], g);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "medication-manager",
  name: "Менеджер лекарств",
  description: "Список лекарств и недельная история"
});
export {
  g as MedicationManagerCard
};
