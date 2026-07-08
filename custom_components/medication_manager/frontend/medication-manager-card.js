const I = globalThis, L = I.ShadowRoot && (I.ShadyCSS === void 0 || I.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, B = /* @__PURE__ */ Symbol(), Z = /* @__PURE__ */ new WeakMap();
let oe = class {
  constructor(e, i, r) {
    if (this._$cssResult$ = !0, r !== B) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = i;
  }
  get styleSheet() {
    let e = this.o;
    const i = this.t;
    if (L && e === void 0) {
      const r = i !== void 0 && i.length === 1;
      r && (e = Z.get(i)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && Z.set(i, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const ce = (t) => new oe(typeof t == "string" ? t : t + "", void 0, B), he = (t, ...e) => {
  const i = t.length === 1 ? t[0] : e.reduce((r, s, o) => r + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + t[o + 1], t[0]);
  return new oe(i, t, B);
}, pe = (t, e) => {
  if (L) t.adoptedStyleSheets = e.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of e) {
    const r = document.createElement("style"), s = I.litNonce;
    s !== void 0 && r.setAttribute("nonce", s), r.textContent = i.cssText, t.appendChild(r);
  }
}, J = L ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let i = "";
  for (const r of e.cssRules) i += r.cssText;
  return ce(i);
})(t) : t;
const { is: ue, defineProperty: me, getOwnPropertyDescriptor: _e, getOwnPropertyNames: ge, getOwnPropertySymbols: be, getPrototypeOf: fe } = Object, O = globalThis, K = O.trustedTypes, $e = K ? K.emptyScript : "", ye = O.reactiveElementPolyfillSupport, S = (t, e) => t, N = { toAttribute(t, e) {
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
} }, V = (t, e) => !ue(t, e), Y = { attribute: !0, type: String, converter: N, reflect: !1, useDefault: !1, hasChanged: V };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), O.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let w = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, i = Y) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(e, i), !i.noAccessor) {
      const r = /* @__PURE__ */ Symbol(), s = this.getPropertyDescriptor(e, r, i);
      s !== void 0 && me(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, i, r) {
    const { get: s, set: o } = _e(this.prototype, e) ?? { get() {
      return this[i];
    }, set(n) {
      this[i] = n;
    } };
    return { get: s, set(n) {
      const l = s?.call(this);
      o?.call(this, n), this.requestUpdate(e, l, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Y;
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
      const o = (r.converter?.toAttribute !== void 0 ? r.converter : N).toAttribute(i, r.type);
      this._$Em = e, o == null ? this.removeAttribute(s) : this.setAttribute(s, o), this._$Em = null;
    }
  }
  _$AK(e, i) {
    const r = this.constructor, s = r._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const o = r.getPropertyOptions(s), n = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : N;
      this._$Em = s;
      const l = n.fromAttribute(i, o.type);
      this[s] = l ?? this._$Ej?.get(s) ?? l, this._$Em = null;
    }
  }
  requestUpdate(e, i, r, s = !1, o) {
    if (e !== void 0) {
      const n = this.constructor;
      if (s === !1 && (o = this[e]), r ??= n.getPropertyOptions(e), !((r.hasChanged ?? V)(o, i) || r.useDefault && r.reflect && o === this._$Ej?.get(e) && !this.hasAttribute(n._$Eu(e, r)))) return;
      this.C(e, i, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, i, { useDefault: r, reflect: s, wrapped: o }, n) {
    r && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, n ?? i ?? this[e]), o !== !0 || n !== void 0) || (this._$AL.has(e) || (this.hasUpdated || r || (i = void 0), this._$AL.set(e, i)), s === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
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
        for (const [s, o] of this._$Ep) this[s] = o;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [s, o] of r) {
        const { wrapped: n } = o, l = this[s];
        n !== !0 || this._$AL.has(s) || l === void 0 || this.C(s, void 0, o, l);
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
w.elementStyles = [], w.shadowRootOptions = { mode: "open" }, w[S("elementProperties")] = /* @__PURE__ */ new Map(), w[S("finalized")] = /* @__PURE__ */ new Map(), ye?.({ ReactiveElement: w }), (O.reactiveElementVersions ??= []).push("2.1.2");
const q = globalThis, Q = (t) => t, H = q.trustedTypes, X = H ? H.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, ne = "$lit$", $ = `lit$${Math.random().toFixed(9).slice(2)}$`, ae = "?" + $, ve = `<${ae}>`, x = document, M = () => x.createComment(""), R = (t) => t === null || typeof t != "object" && typeof t != "function", F = Array.isArray, xe = (t) => F(t) || typeof t?.[Symbol.iterator] == "function", j = "[ \t\n\f\r]", D = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ee = /-->/g, te = />/g, y = RegExp(`>|${j}(?:([^\\s"'>=/]+)(${j}*=${j}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), ie = /'/g, re = /"/g, de = /^(?:script|style|textarea|title)$/i, we = (t) => (e, ...i) => ({ _$litType$: t, strings: e, values: i }), p = we(1), A = /* @__PURE__ */ Symbol.for("lit-noChange"), c = /* @__PURE__ */ Symbol.for("lit-nothing"), se = /* @__PURE__ */ new WeakMap(), v = x.createTreeWalker(x, 129);
function le(t, e) {
  if (!F(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return X !== void 0 ? X.createHTML(e) : e;
}
const Ae = (t, e) => {
  const i = t.length - 1, r = [];
  let s, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = D;
  for (let l = 0; l < i; l++) {
    const d = t[l];
    let u, m, h = -1, g = 0;
    for (; g < d.length && (n.lastIndex = g, m = n.exec(d), m !== null); ) g = n.lastIndex, n === D ? m[1] === "!--" ? n = ee : m[1] !== void 0 ? n = te : m[2] !== void 0 ? (de.test(m[2]) && (s = RegExp("</" + m[2], "g")), n = y) : m[3] !== void 0 && (n = y) : n === y ? m[0] === ">" ? (n = s ?? D, h = -1) : m[1] === void 0 ? h = -2 : (h = n.lastIndex - m[2].length, u = m[1], n = m[3] === void 0 ? y : m[3] === '"' ? re : ie) : n === re || n === ie ? n = y : n === ee || n === te ? n = D : (n = y, s = void 0);
    const f = n === y && t[l + 1].startsWith("/>") ? " " : "";
    o += n === D ? d + ve : h >= 0 ? (r.push(u), d.slice(0, h) + ne + d.slice(h) + $ + f) : d + $ + (h === -2 ? l : f);
  }
  return [le(t, o + (t[i] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), r];
};
class T {
  constructor({ strings: e, _$litType$: i }, r) {
    let s;
    this.parts = [];
    let o = 0, n = 0;
    const l = e.length - 1, d = this.parts, [u, m] = Ae(e, i);
    if (this.el = T.createElement(u, r), v.currentNode = this.el.content, i === 2 || i === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (s = v.nextNode()) !== null && d.length < l; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const h of s.getAttributeNames()) if (h.endsWith(ne)) {
          const g = m[n++], f = s.getAttribute(h).split($), z = /([.?@])?(.*)/.exec(g);
          d.push({ type: 1, index: o, name: z[2], strings: f, ctor: z[1] === "." ? Ee : z[1] === "?" ? De : z[1] === "@" ? Se : U }), s.removeAttribute(h);
        } else h.startsWith($) && (d.push({ type: 6, index: o }), s.removeAttribute(h));
        if (de.test(s.tagName)) {
          const h = s.textContent.split($), g = h.length - 1;
          if (g > 0) {
            s.textContent = H ? H.emptyScript : "";
            for (let f = 0; f < g; f++) s.append(h[f], M()), v.nextNode(), d.push({ type: 2, index: ++o });
            s.append(h[g], M());
          }
        }
      } else if (s.nodeType === 8) if (s.data === ae) d.push({ type: 2, index: o });
      else {
        let h = -1;
        for (; (h = s.data.indexOf($, h + 1)) !== -1; ) d.push({ type: 7, index: o }), h += $.length - 1;
      }
      o++;
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
  const o = R(e) ? void 0 : e._$litDirective$;
  return s?.constructor !== o && (s?._$AO?.(!1), o === void 0 ? s = void 0 : (s = new o(t), s._$AT(t, i, r)), r !== void 0 ? (i._$Co ??= [])[r] = s : i._$Cl = s), s !== void 0 && (e = k(t, s._$AS(t, e.values), s, r)), e;
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
    v.currentNode = s;
    let o = v.nextNode(), n = 0, l = 0, d = r[0];
    for (; d !== void 0; ) {
      if (n === d.index) {
        let u;
        d.type === 2 ? u = new P(o, o.nextSibling, this, e) : d.type === 1 ? u = new d.ctor(o, d.name, d.strings, this, e) : d.type === 6 && (u = new Ce(o, this, e)), this._$AV.push(u), d = r[++l];
      }
      n !== d?.index && (o = v.nextNode(), n++);
    }
    return v.currentNode = x, s;
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
    e = k(this, e, i), R(e) ? e === c || e == null || e === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : e !== this._$AH && e !== A && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : xe(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== c && R(this._$AH) ? this._$AA.nextSibling.data = e : this.T(x.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: i, _$litType$: r } = e, s = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = T.createElement(le(r.h, r.h[0]), this.options)), r);
    if (this._$AH?._$AD === s) this._$AH.p(i);
    else {
      const o = new ke(s, this), n = o.u(this.options);
      o.p(i), this.T(n), this._$AH = o;
    }
  }
  _$AC(e) {
    let i = se.get(e.strings);
    return i === void 0 && se.set(e.strings, i = new T(e)), i;
  }
  k(e) {
    F(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let r, s = 0;
    for (const o of e) s === i.length ? i.push(r = new P(this.O(M()), this.O(M()), this, this.options)) : r = i[s], r._$AI(o), s++;
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
class U {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, i, r, s, o) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = e, this.name = i, this._$AM = s, this.options = o, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = c;
  }
  _$AI(e, i = this, r, s) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) e = k(this, e, i, 0), n = !R(e) || e !== this._$AH && e !== A, n && (this._$AH = e);
    else {
      const l = e;
      let d, u;
      for (e = o[0], d = 0; d < o.length - 1; d++) u = k(this, l[r + d], i, d), u === A && (u = this._$AH[d]), n ||= !R(u) || u !== this._$AH[d], u === c ? e = c : e !== c && (e += (u ?? "") + o[d + 1]), this._$AH[d] = u;
    }
    n && !s && this.j(e);
  }
  j(e) {
    e === c ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Ee extends U {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === c ? void 0 : e;
  }
}
class De extends U {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== c);
  }
}
class Se extends U {
  constructor(e, i, r, s, o) {
    super(e, i, r, s, o), this.type = 5;
  }
  _$AI(e, i = this) {
    if ((e = k(this, e, i, 0) ?? c) === A) return;
    const r = this._$AH, s = e === c && r !== c || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, o = e !== c && (r === c || s);
    s && this.element.removeEventListener(this.name, this, r), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Ce {
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
Me?.(T, P), (q.litHtmlVersions ??= []).push("3.3.3");
const Re = (t, e, i) => {
  const r = i?.renderBefore ?? e;
  let s = r._$litPart$;
  if (s === void 0) {
    const o = i?.renderBefore ?? null;
    r._$litPart$ = s = new P(e.insertBefore(M(), o), o, void 0, i ?? {});
  }
  return s._$AI(t), s;
};
const W = globalThis;
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
C._$litElement$ = !0, C.finalized = !0, W.litElementHydrateSupport?.({ LitElement: C });
const Te = W.litElementPolyfillSupport;
Te?.({ LitElement: C });
(W.litElementVersions ??= []).push("4.2.2");
const Pe = (t) => (e, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
const ze = { attribute: !0, type: String, converter: N, reflect: !1, hasChanged: V }, Ie = (t = ze, e, i) => {
  const { kind: r, metadata: s } = i;
  let o = globalThis.litPropertyMetadata.get(s);
  if (o === void 0 && globalThis.litPropertyMetadata.set(s, o = /* @__PURE__ */ new Map()), r === "setter" && ((t = Object.create(t)).wrapped = !0), o.set(i.name, t), r === "accessor") {
    const { name: n } = i;
    return { set(l) {
      const d = e.get.call(this);
      e.set.call(this, l), this.requestUpdate(n, d, t, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(n, void 0, t, l), l;
    } };
  }
  if (r === "setter") {
    const { name: n } = i;
    return function(l) {
      const d = this[n];
      e.call(this, l), this.requestUpdate(n, d, t, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function G(t) {
  return (e, i) => typeof i == "object" ? Ie(t, e, i) : ((r, s, o) => {
    const n = s.hasOwnProperty(o);
    return s.constructor.createProperty(o, r), n ? Object.getOwnPropertyDescriptor(s, o) : void 0;
  })(t, e, i);
}
function E(t) {
  return G({ ...t, state: !0, attribute: !1 });
}
const Ne = {
  add: "Добавить",
  addMedication: "Добавить лекарство",
  cancel: "Отмена",
  close: "Закрыть",
  courseAlways: "Принимать постоянно",
  courseEndDate: "Дата окончания курса",
  courseEnded: "Курс завершён",
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
  invalidCourseEndDate: "Укажите дату окончания курса",
  invalidReminder: "Проверьте время напоминаний",
  last: "Последний приём",
  late: "Поздно",
  missed: "Пропущено",
  monthlyHistory: "История за месяц",
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
var He = Object.defineProperty, Oe = Object.getOwnPropertyDescriptor, b = (t, e, i, r) => {
  for (var s = r > 1 ? void 0 : r ? Oe(e, i) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (s = (r ? n(e, i, s) : n(s)) || s);
  return r && s && He(e, i, s), s;
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
    return this._error ? p`<ha-card><div class="error">${this._error}</div></ha-card>` : p`
      <ha-card>
        <header>
          <h2>${e}</h2>
          ${this._showAddButton ? p`
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
    ) : p`<div class="empty">${a(t, "empty")}</div>`}
        </section>
      </ha-card>
      ${this._renderMedicationDialog(t)}
      ${this._renderMonthlyHistoryDialog(t)}
    `;
  }
  _renderMedication(t, e) {
    const i = this._busyMedicationId === t.id;
    return p`
      <article class=${t.enabled ? "medication" : "medication disabled"}>
        <div class="identity">
          <ha-icon .icon=${t.icon}></ha-icon>
          <div>
            <h3>${t.name}</h3>
            <p>${this._medicationStatusLabel(t, e)}</p>
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
            .label=${a(e, "monthlyHistory")}
            aria-label=${a(e, "monthlyHistory")}
            title=${a(e, "monthlyHistory")}
            @click=${() => this._openMonthlyHistory(t)}
          >
            <ha-icon icon="mdi:calendar-month"></ha-icon>
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
    const r = e.is_future ? "future" : e.status ?? "none", s = e.status ? this._statusLabel(e.status, i) : a(i, "none"), o = this._dayDoseCount(t, e);
    return p`
      <span
        class=${`week-day ${r}`}
        title=${this._weeklyTitle(e, s, i)}
      >
        <span class="week-date">${this._formatDate(e.date)}</span>
        <span class="week-doses" style=${this._doseGridStyle(o)}>
          ${this._weeklyContent(t, e, o)}
        </span>
      </span>
    `;
  }
  _weeklyContent(t, e, i) {
    const r = [];
    if (e.is_future)
      r.push(...Array.from({ length: i }, () => "future"));
    else
      for (r.push(...Array.from({ length: e.taken_count }, () => "taken")), r.push(...Array.from({ length: e.late_count }, () => "late")), r.push(...Array.from({ length: e.missed_count }, () => "missed")); r.length < i; ) r.push("empty");
    return r.map((s) => s === "taken" ? p`
          <span class="dose taken">
            <ha-icon class="dose-icon" .icon=${t.icon}></ha-icon>
          </span>
        ` : p`<span class=${`dose ${s}`}></span>`);
  }
  _renderMedicationDialog(t) {
    const e = this._dialog;
    if (!e) return c;
    const i = e.mode === "add" ? a(t, "addMedication") : a(t, "editMedication");
    return p`
      <ha-dialog
        open
        .headerTitle=${i}
        .heading=${i}
        header-title=${i}
        @closed=${() => this._closeDialog()}
      >
        <div class="dialog-content">
          <form class="dialog-form">
            ${e.error ? p`<div class="dialog-error">${e.error}</div>` : c}
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
                .checked=${e.courseAlways}
                ?disabled=${e.saving}
                @change=${(r) => this._updateDialog({
      courseAlways: this._checkedValue(r)
    })}
              ></ha-checkbox>
              <span>${a(t, "courseAlways")}</span>
            </label>
            ${this._renderTextField({
      disabled: e.saving || e.courseAlways,
      label: a(t, "courseEndDate"),
      required: !e.courseAlways,
      type: "date",
      value: e.courseEndDate,
      onInput: (r) => this._updateDialog({ courseEndDate: r })
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
    ) : p`
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
  _renderMonthlyHistoryDialog(t) {
    const e = this._historyMedication();
    if (!e) return c;
    const i = `${a(t, "monthlyHistory")}: ${e.name}`, r = this._monthLeadingBlankCount(e.monthly_history);
    return p`
      <ha-dialog
        open
        .headerTitle=${i}
        .heading=${i}
        header-title=${i}
        @closed=${() => this._closeMonthlyHistory()}
      >
        <div class="dialog-content history-dialog">
          <div class="month-title">
            ${this._monthLabel(e.monthly_history[0]?.date, t)}
          </div>
          <div class="month-grid">
            ${this._weekdayLabels().map(
      (s) => p`<span class="month-weekday">${s}</span>`
    )}
            ${Array.from(
      { length: r },
      () => p`<span class="month-spacer"></span>`
    )}
            ${e.monthly_history.map(
      (s) => this._renderMonthlyDay(e, s, t)
    )}
          </div>
          <div class="dialog-actions">
            <button
              class="button filled"
              type="button"
              @click=${() => this._closeMonthlyHistory()}
            >
              ${a(t, "close")}
            </button>
          </div>
        </div>
      </ha-dialog>
    `;
  }
  _renderMonthlyDay(t, e, i) {
    const r = e.is_future ? "future" : e.status ?? "none", s = e.status ? this._statusLabel(e.status, i) : a(i, "none"), o = this._dayDoseCount(t, e);
    return p`
      <span
        class=${`month-day ${r}`}
        title=${this._weeklyTitle(e, s, i)}
      >
        <span class="month-date">${this._dayNumber(e.date)}</span>
        <span
          class="week-doses month-doses"
          style=${this._doseGridStyle(o)}
        >
          ${this._weeklyContent(t, e, o)}
        </span>
      </span>
    `;
  }
  _renderReminderRow(t, e, i) {
    const r = this._dialog, s = !r?.remindersEnabled || !!r.saving;
    return p`
      <div class="reminder-row">
        ${this._renderTextField({
      disabled: s,
      label: a(i, "reminderTime"),
      type: "time",
      value: t.time,
      onInput: (o) => this._updateReminderTime(e, o)
    })}
        <label class="inline-check">
          <ha-checkbox
            .checked=${t.enabled}
            ?disabled=${s}
            @change=${(o) => this._updateReminderEnabled(e, this._checkedValue(o))}
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
    return t.mode !== "edit" ? c : t.confirmDelete ? p`
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
    ` : p`
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
  _medicationStatusLabel(t, e) {
    return this._courseEnded(t) ? a(e, "courseEnded") : this._statusLabel(t.today_status, e);
  }
  get _language() {
    return this.hass?.locale?.language ?? this.hass?.language ?? "ru";
  }
  get _showAddButton() {
    return this.editMode || this.hasAttribute("edit-mode");
  }
  _renderTextField(t) {
    return p`
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
      courseAlways: !0,
      courseEndDate: "",
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
      courseAlways: t.course_end_date === null,
      courseEndDate: t.course_end_date ?? "",
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
    if (!e.courseAlways && !this._validDateInput(e.courseEndDate)) {
      this._updateDialog({ error: a(t, "invalidCourseEndDate") });
      return;
    }
    const s = e.tagId.trim(), o = {
      enabled: e.medicationEnabled,
      icon: e.icon.trim() || "mdi:pill",
      name: i,
      reminders: r
    };
    return s ? o.tag_id = s : e.mode === "edit" && e.originalTagId && (o.clear_tag = !0), e.courseAlways ? e.mode === "edit" && (o.clear_course_end_date = !0) : o.course_end_date = e.courseEndDate, o;
  }
  _validatedReminders(t) {
    const e = this._dialog;
    if (!e) return;
    const i = /* @__PURE__ */ new Set(), r = [];
    for (const s of e.reminders) {
      const o = s.time.trim();
      if (o) {
        if (!this._validReminderTime(o) || i.has(o)) {
          this._updateDialog({ error: a(t, "invalidReminder") });
          return;
        }
        i.add(o), r.push({
          enabled: e.remindersEnabled && s.enabled,
          time: o
        });
      }
    }
    return r;
  }
  _validReminderTime(t) {
    return /^([01]\d|2[0-3]):([0-5]\d)$/.exec(t) !== null;
  }
  _validDateInput(t) {
    return /^\d{4}-\d{2}-\d{2}$/.test(t);
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
  _plannedDailyDoseCount(t) {
    const e = t.schedule.length, i = t.schedule.filter((r) => r.enabled).length;
    return Math.max(1, i || e);
  }
  _dayDoseCount(t, e) {
    const i = this._plannedDailyDoseCount(t);
    return e.is_future ? i : Math.max(i, this._historyCount(e));
  }
  _doseGridStyle(t) {
    const e = Math.min(2, Math.max(1, t)), i = 15, s = e * i + (e - 1) * 2;
    return `--dose-columns:${e};--dose-icon-size:${i}px;--dose-grid-width:${s}px;`;
  }
  _historyCount(t) {
    return t.taken_count + t.late_count + t.missed_count;
  }
  _weeklyTitle(t, e, i) {
    const r = [
      [t.taken_count, a(i, "taken")],
      [t.late_count, a(i, "late")],
      [t.missed_count, a(i, "missed")]
    ].filter(([o]) => Number(o) > 0).map(([o, n]) => `${o} ${n}`), s = r.length ? `: ${r.join(", ")}` : `: ${e}`;
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
  _courseEnded(t) {
    return t.course_end_date ? t.course_end_date < this._todayIsoDate() : !1;
  }
  _todayIsoDate() {
    const t = /* @__PURE__ */ new Date();
    return `${t.getFullYear()}-${this._pad(t.getMonth() + 1)}-${this._pad(
      t.getDate()
    )}`;
  }
  _openMonthlyHistory(t) {
    this._historyMedicationId = t.id;
  }
  _closeMonthlyHistory() {
    this._historyMedicationId = void 0;
  }
  _historyMedication() {
    return this._dashboard?.medications.find(
      (t) => t.id === this._historyMedicationId
    );
  }
  _monthLeadingBlankCount(t) {
    const e = t[0];
    if (!e) return 0;
    const i = this._dateFromIsoDate(e.date);
    return i ? (i.getDay() + 6) % 7 : 0;
  }
  _monthLabel(t, e) {
    const i = t ? this._dateFromIsoDate(t) : void 0;
    return i ? i.toLocaleDateString(e, {
      month: "long",
      year: "numeric"
    }) : a(e, "monthlyHistory");
  }
  _weekdayLabels() {
    return ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  }
  _dayNumber(t) {
    const e = this._parseDateParts(t);
    return e ? String(Number(e.day)) : t;
  }
  _dateFromIsoDate(t) {
    const e = this._parseDateParts(t);
    if (e)
      return new Date(Number(e.year), Number(e.month) - 1, Number(e.day));
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
      grid-template-columns: 40px 1fr 40px 40px 40px;
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
      align-content: center;
      align-items: center;
      display: grid;
      gap: 2px;
      grid-auto-rows: var(--dose-icon-size, 15px);
      grid-template-columns: repeat(
        var(--dose-columns, 1),
        var(--dose-icon-size, 15px)
      );
      justify-content: center;
      justify-items: center;
      margin-inline: auto;
      max-width: min(100%, var(--dose-grid-width, 15px));
      min-height: var(--dose-icon-size, 15px);
      min-width: 0;
      overflow: hidden;
      width: min(100%, var(--dose-grid-width, 15px));
    }

    .dose {
      align-items: center;
      border-radius: 50%;
      box-sizing: border-box;
      display: inline-flex;
      height: 6px;
      justify-content: center;
      justify-self: center;
      min-width: 0;
      width: 6px;
    }

    .dose:nth-last-child(1):nth-child(odd) {
      grid-column: 1 / -1;
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
      background: transparent;
      border-radius: 0;
      color: var(--success-color);
      height: var(--dose-icon-size, 15px);
      overflow: visible;
      width: var(--dose-icon-size, 15px);
    }

    .dose-icon {
      --iron-icon-height: var(--dose-icon-size, 15px);
      --iron-icon-width: var(--dose-icon-size, 15px);
      --mdc-icon-size: var(--dose-icon-size, 15px);
      display: block;
      font-size: var(--dose-icon-size, 15px);
      height: var(--dose-icon-size, 15px);
      line-height: var(--dose-icon-size, 15px);
      width: var(--dose-icon-size, 15px);
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
      max-width: 100%;
      overflow-x: hidden;
      padding-top: 4px;
    }

    .history-dialog {
      min-width: 0;
      width: min(620px, calc(100vw - 72px));
    }

    .month-title {
      font-size: 15px;
      font-weight: 600;
      text-transform: capitalize;
    }

    .month-grid {
      box-sizing: border-box;
      display: grid;
      gap: 6px;
      grid-template-columns: repeat(7, minmax(0, 1fr));
      min-width: 0;
      width: 100%;
    }

    .month-weekday {
      color: var(--secondary-text-color);
      font-size: 11px;
      line-height: 14px;
      text-align: center;
    }

    .month-spacer {
      min-height: 48px;
    }

    .month-day {
      align-items: center;
      background: var(--secondary-background-color);
      border-radius: 6px;
      box-sizing: border-box;
      display: grid;
      gap: 4px;
      min-height: 48px;
      min-width: 0;
      padding: 5px 3px;
      place-items: center;
    }

    .month-date {
      color: var(--secondary-text-color);
      font-size: 11px;
      line-height: 12px;
    }

    .month-day.taken {
      background: color-mix(in srgb, var(--success-color) 20%, transparent);
    }

    .month-day.late {
      background: color-mix(in srgb, #f5c542 24%, transparent);
    }

    .month-day.missed,
    .month-day.none {
      background: color-mix(in srgb, var(--error-color) 10%, transparent);
      border: 1px solid color-mix(in srgb, var(--error-color) 18%, transparent);
    }

    .month-day.future {
      background: transparent;
      border: 1px dashed var(--divider-color);
    }

    .month-doses {
      max-width: min(100%, var(--dose-grid-width, 15px));
      min-height: var(--dose-icon-size, 15px);
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

    .text-field input[type="date"],
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
      ha-dialog {
        --ha-dialog-width-md: calc(100vw - 24px);
      }

      header {
        align-items: stretch;
        flex-direction: column;
      }

      .history-dialog {
        width: min(100%, calc(100vw - 40px));
      }

      .month-grid {
        gap: 4px;
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
b([
  G({ attribute: !1 })
], _.prototype, "hass", 2);
b([
  G({ type: Boolean, attribute: "edit-mode" })
], _.prototype, "editMode", 2);
b([
  E()
], _.prototype, "_config", 2);
b([
  E()
], _.prototype, "_dashboard", 2);
b([
  E()
], _.prototype, "_dialog", 2);
b([
  E()
], _.prototype, "_error", 2);
b([
  E()
], _.prototype, "_busyMedicationId", 2);
b([
  E()
], _.prototype, "_historyMedicationId", 2);
_ = b([
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
