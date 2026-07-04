const U = globalThis, L = U.ShadowRoot && (U.ShadyCSS === void 0 || U.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, B = /* @__PURE__ */ Symbol(), J = /* @__PURE__ */ new WeakMap();
let ne = class {
  constructor(e, i, r) {
    if (this._$cssResult$ = !0, r !== B) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = i;
  }
  get styleSheet() {
    let e = this.o;
    const i = this.t;
    if (L && e === void 0) {
      const r = i !== void 0 && i.length === 1;
      r && (e = J.get(i)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && J.set(i, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const ce = (t) => new ne(typeof t == "string" ? t : t + "", void 0, B), he = (t, ...e) => {
  const i = t.length === 1 ? t[0] : e.reduce((r, s, n) => r + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + t[n + 1], t[0]);
  return new ne(i, t, B);
}, pe = (t, e) => {
  if (L) t.adoptedStyleSheets = e.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of e) {
    const r = document.createElement("style"), s = U.litNonce;
    s !== void 0 && r.setAttribute("nonce", s), r.textContent = i.cssText, t.appendChild(r);
  }
}, K = L ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let i = "";
  for (const r of e.cssRules) i += r.cssText;
  return ce(i);
})(t) : t;
const { is: ue, defineProperty: me, getOwnPropertyDescriptor: _e, getOwnPropertyNames: ge, getOwnPropertySymbols: fe, getPrototypeOf: be } = Object, H = globalThis, Y = H.trustedTypes, $e = Y ? Y.emptyScript : "", ve = H.reactiveElementPolyfillSupport, S = (t, e) => t, N = { toAttribute(t, e) {
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
} }, V = (t, e) => !ue(t, e), G = { attribute: !0, type: String, converter: N, reflect: !1, useDefault: !1, hasChanged: V };
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
    const e = be(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(S("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(S("properties"))) {
      const i = this.properties, r = [...ge(i), ...fe(i)];
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
      for (const s of r) i.unshift(K(s));
    } else e !== void 0 && i.push(K(e));
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
      const n = (r.converter?.toAttribute !== void 0 ? r.converter : N).toAttribute(i, r.type);
      this._$Em = e, n == null ? this.removeAttribute(s) : this.setAttribute(s, n), this._$Em = null;
    }
  }
  _$AK(e, i) {
    const r = this.constructor, s = r._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const n = r.getPropertyOptions(s), o = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : N;
      this._$Em = s;
      const l = o.fromAttribute(i, n.type);
      this[s] = l ?? this._$Ej?.get(s) ?? l, this._$Em = null;
    }
  }
  requestUpdate(e, i, r, s = !1, n) {
    if (e !== void 0) {
      const o = this.constructor;
      if (s === !1 && (n = this[e]), r ??= o.getPropertyOptions(e), !((r.hasChanged ?? V)(n, i) || r.useDefault && r.reflect && n === this._$Ej?.get(e) && !this.hasAttribute(o._$Eu(e, r)))) return;
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
const q = globalThis, Q = (t) => t, I = q.trustedTypes, X = I ? I.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, oe = "$lit$", b = `lit$${Math.random().toFixed(9).slice(2)}$`, ae = "?" + b, ye = `<${ae}>`, x = document, D = () => x.createComment(""), M = (t) => t === null || typeof t != "object" && typeof t != "function", W = Array.isArray, xe = (t) => W(t) || typeof t?.[Symbol.iterator] == "function", j = `[ 	
\f\r]`, E = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ee = /-->/g, te = />/g, v = RegExp(`>|${j}(?:([^\\s"'>=/]+)(${j}*=${j}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ie = /'/g, re = /"/g, de = /^(?:script|style|textarea|title)$/i, we = (t) => (e, ...i) => ({ _$litType$: t, strings: e, values: i }), m = we(1), A = /* @__PURE__ */ Symbol.for("lit-noChange"), c = /* @__PURE__ */ Symbol.for("lit-nothing"), se = /* @__PURE__ */ new WeakMap(), y = x.createTreeWalker(x, 129);
function le(t, e) {
  if (!W(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return X !== void 0 ? X.createHTML(e) : e;
}
const Ae = (t, e) => {
  const i = t.length - 1, r = [];
  let s, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = E;
  for (let l = 0; l < i; l++) {
    const d = t[l];
    let p, u, h = -1, g = 0;
    for (; g < d.length && (o.lastIndex = g, u = o.exec(d), u !== null); ) g = o.lastIndex, o === E ? u[1] === "!--" ? o = ee : u[1] !== void 0 ? o = te : u[2] !== void 0 ? (de.test(u[2]) && (s = RegExp("</" + u[2], "g")), o = v) : u[3] !== void 0 && (o = v) : o === v ? u[0] === ">" ? (o = s ?? E, h = -1) : u[1] === void 0 ? h = -2 : (h = o.lastIndex - u[2].length, p = u[1], o = u[3] === void 0 ? v : u[3] === '"' ? re : ie) : o === re || o === ie ? o = v : o === ee || o === te ? o = E : (o = v, s = void 0);
    const f = o === v && t[l + 1].startsWith("/>") ? " " : "";
    n += o === E ? d + ye : h >= 0 ? (r.push(p), d.slice(0, h) + oe + d.slice(h) + b + f) : d + b + (h === -2 ? l : f);
  }
  return [le(t, n + (t[i] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), r];
};
class R {
  constructor({ strings: e, _$litType$: i }, r) {
    let s;
    this.parts = [];
    let n = 0, o = 0;
    const l = e.length - 1, d = this.parts, [p, u] = Ae(e, i);
    if (this.el = R.createElement(p, r), y.currentNode = this.el.content, i === 2 || i === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (s = y.nextNode()) !== null && d.length < l; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const h of s.getAttributeNames()) if (h.endsWith(oe)) {
          const g = u[o++], f = s.getAttribute(h).split(b), O = /([.?@])?(.*)/.exec(g);
          d.push({ type: 1, index: n, name: O[2], strings: f, ctor: O[1] === "." ? Ee : O[1] === "?" ? Se : O[1] === "@" ? Ce : z }), s.removeAttribute(h);
        } else h.startsWith(b) && (d.push({ type: 6, index: n }), s.removeAttribute(h));
        if (de.test(s.tagName)) {
          const h = s.textContent.split(b), g = h.length - 1;
          if (g > 0) {
            s.textContent = I ? I.emptyScript : "";
            for (let f = 0; f < g; f++) s.append(h[f], D()), y.nextNode(), d.push({ type: 2, index: ++n });
            s.append(h[g], D());
          }
        }
      } else if (s.nodeType === 8) if (s.data === ae) d.push({ type: 2, index: n });
      else {
        let h = -1;
        for (; (h = s.data.indexOf(b, h + 1)) !== -1; ) d.push({ type: 7, index: n }), h += b.length - 1;
      }
      n++;
    }
  }
  static createElement(e, i) {
    const r = x.createElement("template");
    return r.innerHTML = e, r;
  }
}
function k(t, e, i = t, r) {
  if (e === A) return e;
  let s = r !== void 0 ? i._$Co?.[r] : i._$Cl;
  const n = M(e) ? void 0 : e._$litDirective$;
  return s?.constructor !== n && (s?._$AO?.(!1), n === void 0 ? s = void 0 : (s = new n(t), s._$AT(t, i, r)), r !== void 0 ? (i._$Co ??= [])[r] = s : i._$Cl = s), s !== void 0 && (e = k(t, s._$AS(t, e.values), s, r)), e;
}
class ke {
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
    const { el: { content: i }, parts: r } = this._$AD, s = (e?.creationScope ?? x).importNode(i, !0);
    y.currentNode = s;
    let n = y.nextNode(), o = 0, l = 0, d = r[0];
    for (; d !== void 0; ) {
      if (o === d.index) {
        let p;
        d.type === 2 ? p = new T(n, n.nextSibling, this, e) : d.type === 1 ? p = new d.ctor(n, d.name, d.strings, this, e) : d.type === 6 && (p = new De(n, this, e)), this._$AV.push(p), d = r[++l];
      }
      o !== d?.index && (n = y.nextNode(), o++);
    }
    return y.currentNode = x, s;
  }
  p(e) {
    let i = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, i), i += r.strings.length - 2) : r._$AI(e[i])), i++;
  }
}
class T {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, i, r, s) {
    this.type = 2, this._$AH = c, this._$AN = void 0, this._$AA = e, this._$AB = i, this._$AM = r, this.options = s, this._$Cv = s?.isConnected ?? !0;
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
    e = k(this, e, i), M(e) ? e === c || e == null || e === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : e !== this._$AH && e !== A && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : xe(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== c && M(this._$AH) ? this._$AA.nextSibling.data = e : this.T(x.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: i, _$litType$: r } = e, s = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = R.createElement(le(r.h, r.h[0]), this.options)), r);
    if (this._$AH?._$AD === s) this._$AH.p(i);
    else {
      const n = new ke(s, this), o = n.u(this.options);
      n.p(i), this.T(o), this._$AH = n;
    }
  }
  _$AC(e) {
    let i = se.get(e.strings);
    return i === void 0 && se.set(e.strings, i = new R(e)), i;
  }
  k(e) {
    W(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let r, s = 0;
    for (const n of e) s === i.length ? i.push(r = new T(this.O(D()), this.O(D()), this, this.options)) : r = i[s], r._$AI(n), s++;
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
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = e, this.name = i, this._$AM = s, this.options = n, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = c;
  }
  _$AI(e, i = this, r, s) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) e = k(this, e, i, 0), o = !M(e) || e !== this._$AH && e !== A, o && (this._$AH = e);
    else {
      const l = e;
      let d, p;
      for (e = n[0], d = 0; d < n.length - 1; d++) p = k(this, l[r + d], i, d), p === A && (p = this._$AH[d]), o ||= !M(p) || p !== this._$AH[d], p === c ? e = c : e !== c && (e += (p ?? "") + n[d + 1]), this._$AH[d] = p;
    }
    o && !s && this.j(e);
  }
  j(e) {
    e === c ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Ee extends z {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === c ? void 0 : e;
  }
}
class Se extends z {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== c);
  }
}
class Ce extends z {
  constructor(e, i, r, s, n) {
    super(e, i, r, s, n), this.type = 5;
  }
  _$AI(e, i = this) {
    if ((e = k(this, e, i, 0) ?? c) === A) return;
    const r = this._$AH, s = e === c && r !== c || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, n = e !== c && (r === c || s);
    s && this.element.removeEventListener(this.name, this, r), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class De {
  constructor(e, i, r) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    k(this, e);
  }
}
const Me = q.litHtmlPolyfillSupport;
Me?.(R, T), (q.litHtmlVersions ??= []).push("3.3.3");
const Re = (t, e, i) => {
  const r = i?.renderBefore ?? e;
  let s = r._$litPart$;
  if (s === void 0) {
    const n = i?.renderBefore ?? null;
    r._$litPart$ = s = new T(e.insertBefore(D(), n), n, void 0, i ?? {});
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Re(i, this.renderRoot, this.renderOptions);
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
const Te = F.litElementPolyfillSupport;
Te?.({ LitElement: C });
(F.litElementVersions ??= []).push("4.2.2");
const Pe = (t) => (e, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
const Oe = { attribute: !0, type: String, converter: N, reflect: !1, hasChanged: V }, Ue = (t = Oe, e, i) => {
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
function Z(t) {
  return (e, i) => typeof i == "object" ? Ue(t, e, i) : ((r, s, n) => {
    const o = s.hasOwnProperty(n);
    return s.constructor.createProperty(n, r), o ? Object.getOwnPropertyDescriptor(s, n) : void 0;
  })(t, e, i);
}
function P(t) {
  return Z({ ...t, state: !0, attribute: !1 });
}
const Ne = {
  add: "Добавить",
  addMedication: "Добавить лекарство",
  cancel: "Отмена",
  delete: "Удалить",
  deleteConfirm: "Удалить лекарство?",
  deleteMedication: "Удалить лекарство",
  dailyDoseCount: "Приёмов в день",
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
  next: "Напоминание",
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
};
function a(t, e) {
  return Ne[e];
}
var Ie = Object.defineProperty, He = Object.getOwnPropertyDescriptor, $ = (t, e, i, r) => {
  for (var s = r > 1 ? void 0 : r ? He(e, i) : e, n = t.length - 1, o; n >= 0; n--)
    (o = t[n]) && (s = (r ? o(e, i, s) : o(s)) || s);
  return r && s && Ie(e, i, s), s;
};
let _ = class extends C {
  constructor() {
    super(...arguments), this.editMode = !1, this._config = { type: "custom:medication-manager" };
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
          ${this._showAddButton ? m`
                <button
                  class="button filled"
                  type="button"
                  @click=${() => this._openAddDialog()}
                >
                  <ha-icon icon="mdi:plus"></ha-icon>
                  ${a(t, "add")}
                </button>
              ` : c}
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
      <span
        class=${`week-day ${r}`}
        title=${this._weeklyTitle(e, s, i)}
      >
        <span class="week-date">${this._formatDate(e.date)}</span>
        <span
          class="week-doses"
          style=${`--dose-columns: ${this._weeklyDoseColumns(t)};`}
        >
          ${this._weeklyContent(t, e)}
        </span>
      </span>
    `;
  }
  _weeklyContent(t, e) {
    const i = Math.max(this._dailyDoseCount(t), this._historyCount(e)), r = [];
    if (e.is_future)
      r.push(...Array.from({ length: i }, () => "future"));
    else
      for (r.push(...Array.from({ length: e.taken_count }, () => "taken")), r.push(...Array.from({ length: e.late_count }, () => "late")), r.push(...Array.from({ length: e.missed_count }, () => "missed")); r.length < i; ) r.push("empty");
    return r.map(
      (s) => m`<span class=${`dose ${s}`}></span>`
    );
  }
  _renderMedicationDialog(t) {
    const e = this._dialog;
    if (!e) return c;
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
            ${e.error ? m`<div class="dialog-error">${e.error}</div>` : c}
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
              <div class="reminder-count">
                ${this._renderTextField({
      disabled: e.saving,
      label: a(t, "dailyDoseCount"),
      max: "12",
      min: "0",
      step: "1",
      type: "number",
      value: String(e.reminders.length),
      onInput: (r) => this._updateReminderCount(r)
    })}
              </div>
              ${e.reminders.length ? e.reminders.map(
      (r, s) => this._renderReminderRow(r, s, t)
    ) : m`
                    <div class="reminder-empty">
                      ${a(t, "noReminders")}
                    </div>
                  `}
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
    return t.mode !== "edit" ? c : t.confirmDelete ? m`
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
  get _showAddButton() {
    return this.editMode || this.hasAttribute("edit-mode");
  }
  _renderTextField(t) {
    return m`
      <label class="text-field">
        <span>${t.label}</span>
        <input
          .value=${t.value}
          ?disabled=${t.disabled}
          ?required=${t.required ?? !1}
          max=${t.max ?? c}
          min=${t.min ?? c}
          step=${t.step ?? c}
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
    return t.last_intake ? this._formatDateTime(t.last_intake.taken_time) : a(e, "none");
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
  _updateReminderCount(t) {
    if (!this._dialog || t.trim() === "") return;
    const i = Number(t);
    Number.isInteger(i) && this._setReminderCount(Math.min(12, Math.max(0, i)));
  }
  _setReminderCount(t) {
    const e = this._dialog;
    if (!e) return;
    const i = e.reminders.slice(0, t);
    for (; i.length < t; )
      i.push({
        time: this._nextAvailableReminderTime(i, t),
        enabled: !0
      });
    this._updateDialog({
      reminders: i,
      remindersEnabled: t > 0 ? !0 : e.remindersEnabled
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
  _nextAvailableReminderTime(t, e = t.length + 1) {
    const i = new Set(t.map((r) => r.time));
    for (const r of this._defaultReminderTimes(e))
      if (!i.has(r)) return r;
    for (let r = 0; r < 24; r += 1) {
      const s = `${r.toString().padStart(2, "0")}:00`;
      if (!i.has(s)) return s;
    }
    return "08:00";
  }
  _defaultReminderTimes(t) {
    return t <= 1 ? ["08:00"] : t === 2 ? ["08:00", "20:00"] : t === 3 ? ["08:00", "12:00", "20:00"] : Array.from({ length: t }, (e, i) => `${Math.round(8 + 12 * i / (t - 1)).toString().padStart(2, "0")}:00`);
  }
  _dailyDoseCount(t) {
    const e = t.schedule.length, i = t.schedule.filter((s) => s.enabled).length, r = Math.max(
      0,
      ...t.weekly_history.map((s) => this._historyCount(s))
    );
    return Math.max(1, i || e, r);
  }
  _weeklyDoseColumns(t) {
    return this._dailyDoseCount(t) > 3 ? 2 : this._dailyDoseCount(t);
  }
  _historyCount(t) {
    return t.taken_count + t.late_count + t.missed_count;
  }
  _weeklyTitle(t, e, i) {
    const r = [
      [t.taken_count, a(i, "taken")],
      [t.late_count, a(i, "late")],
      [t.missed_count, a(i, "missed")]
    ].filter(([n]) => Number(n) > 0).map(([n, o]) => `${n} ${o}`), s = r.length ? `: ${r.join(", ")}` : `: ${e}`;
    return `${this._formatDate(t.date)}${s}`;
  }
  _formatDate(t) {
    const e = this._parseDateParts(t);
    if (e)
      return `${e.day}.${e.month}.${e.year}`;
    const i = new Date(t);
    return Number.isNaN(i.getTime()) ? t : this._formatDateObject(i);
  }
  _formatDateTime(t) {
    const e = new Date(t);
    return Number.isNaN(e.getTime()) ? t : `${this._formatDateObject(e)} ${this._pad(
      e.getHours()
    )}:${this._pad(e.getMinutes())}`;
  }
  _formatDateObject(t) {
    return `${this._pad(t.getDate())}.${this._pad(
      t.getMonth() + 1
    )}.${t.getFullYear()}`;
  }
  _parseDateParts(t) {
    const e = /^(\d{4})-(\d{2})-(\d{2})/.exec(t);
    if (!e) return;
    const [, i, r, s] = e;
    if (!(!i || !r || !s))
      return { day: s, month: r, year: i };
  }
  _pad(t) {
    return t.toString().padStart(2, "0");
  }
  _stringValue(t) {
    return t.currentTarget.value;
  }
  _checkedValue(t) {
    return t.currentTarget.checked;
  }
};
_.styles = he`
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

    .week-day {
      align-items: center;
      background: var(--secondary-background-color);
      border-radius: 6px;
      box-sizing: border-box;
      display: grid;
      gap: 5px;
      line-height: 1;
      min-height: 64px;
      min-width: 0;
      padding: 6px 4px;
      place-items: center;
    }

    .week-date {
      color: var(--secondary-text-color);
      font-size: 9px;
      line-height: 10px;
      min-width: 0;
      overflow-wrap: anywhere;
      text-align: center;
      white-space: normal;
      width: 100%;
    }

    .week-doses {
      display: grid;
      gap: 3px;
      grid-template-columns: repeat(var(--dose-columns), 8px);
      justify-content: center;
      min-height: 8px;
    }

    .dose {
      border-radius: 50%;
      box-sizing: border-box;
      display: block;
      height: 8px;
      width: 8px;
    }

    .week-day.taken {
      background: color-mix(in srgb, var(--success-color) 20%, transparent);
    }

    .week-day.late {
      background: color-mix(in srgb, #f5c542 24%, transparent);
    }

    .week-day.missed,
    .week-day.none {
      background: color-mix(in srgb, var(--error-color) 12%, transparent);
      border: 1px solid color-mix(in srgb, var(--error-color) 22%, transparent);
    }

    .week-day.future {
      background: transparent;
      border: 1px dashed var(--divider-color);
    }

    .dose.taken {
      background: var(--success-color);
    }

    .dose.late {
      background: #f5c542;
    }

    .dose.missed {
      background: var(--error-color);
    }

    .dose.empty {
      background: transparent;
      border: 1px solid var(--divider-color);
    }

    .dose.future {
      background: transparent;
      border: 1px dashed var(--divider-color);
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
      gap: 16px;
    }

    .dialog-content {
      box-sizing: border-box;
      min-width: min(520px, calc(100vw - 48px));
      padding-top: 4px;
    }

    .text-field {
      display: block;
      min-width: 0;
      position: relative;
    }

    .text-field span {
      background: var(--card-background-color);
      color: var(--secondary-text-color);
      font-size: 12px;
      inset-inline-start: 12px;
      line-height: 16px;
      max-width: calc(100% - 24px);
      overflow: hidden;
      padding: 0 4px;
      position: absolute;
      text-overflow: ellipsis;
      top: -8px;
      white-space: nowrap;
      z-index: 1;
    }

    .text-field input {
      background: var(--card-background-color);
      border: 1px solid var(--outline-color, var(--divider-color));
      border-radius: 6px;
      box-sizing: border-box;
      color: var(--primary-text-color);
      font: inherit;
      font-size: 15px;
      height: 48px;
      line-height: 20px;
      min-width: 0;
      outline: none;
      padding: 14px 14px 10px;
      transition:
        border-color 120ms ease,
        box-shadow 120ms ease;
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

    .inline-check {
      min-height: 40px;
    }

    .toggle-row span,
    .inline-check span {
      overflow-wrap: anywhere;
    }

    fieldset {
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      display: grid;
      gap: 12px;
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
      gap: 10px;
      grid-template-columns: minmax(136px, 160px) minmax(160px, 1fr) 40px;
    }

    .reminder-count {
      max-width: 180px;
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
      justify-content: flex-end;
      padding-top: 2px;
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
        align-items: start;
        grid-template-columns: 1fr 40px;
      }

      .reminder-row .inline-check {
        grid-column: 1 / -1;
        grid-row: 2;
      }

      .dialog-content {
        min-width: 0;
      }

      .dialog-actions {
        justify-content: stretch;
      }

      .dialog-actions .button {
        flex: 1 1 auto;
      }
    }
  `;
$([
  Z({ attribute: !1 })
], _.prototype, "hass", 2);
$([
  Z({ type: Boolean, attribute: "edit-mode" })
], _.prototype, "editMode", 2);
$([
  P()
], _.prototype, "_config", 2);
$([
  P()
], _.prototype, "_dashboard", 2);
$([
  P()
], _.prototype, "_dialog", 2);
$([
  P()
], _.prototype, "_error", 2);
$([
  P()
], _.prototype, "_busyMedicationId", 2);
_ = $([
  Pe("medication-manager")
], _);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "medication-manager",
  name: "Менеджер лекарств",
  description: "Список лекарств и недельная история"
});
export {
  _ as MedicationManagerCard
};
