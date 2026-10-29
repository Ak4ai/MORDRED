// Substitui o Firebase/Firestore (API compat) pelo servidor próprio na VM.
// Expõe window.firebase com o mesmo formato que o código do MORDRED já usa:
//   firebase.initializeApp(cfg); const db = firebase.firestore();
//   db.collection(c).doc(id).set/update/delete/get/onSnapshot, collection.add/orderBy/limit/get/onSnapshot, db.batch()
(function () {
  const WS_URL = window.MORDRED_DB_URL || 'wss://163-176-79-94.sslip.io/ws';

  // ---------- Timestamps (datas viram {__t: ms} no servidor) ----------
  class Timestamp {
    constructor(ms) { this._ms = ms; this.seconds = Math.floor(ms / 1000); this.nanoseconds = (ms % 1000) * 1e6; }
    toDate() { return new Date(this._ms); }
    toMillis() { return this._ms; }
    static now() { return new Timestamp(Date.now()); }
    static fromDate(d) { return new Timestamp(d.getTime()); }
    static fromMillis(ms) { return new Timestamp(ms); }
  }
  const enc = (v) => {
    if (v instanceof Date) return { __t: v.getTime() };
    if (v instanceof Timestamp) return { __t: v._ms };
    if (Array.isArray(v)) return v.map(enc);
    if (v && typeof v === 'object') {
      if (v.__serverTimestamp) return { __t: Date.now() };
      const o = {};
      for (const k of Object.keys(v)) if (v[k] !== undefined) o[k] = enc(v[k]);
      return o;
    }
    return v;
  };
  const dec = (v) => {
    if (Array.isArray(v)) return v.map(dec);
    if (v && typeof v === 'object') {
      if (Object.keys(v).length === 1 && typeof v.__t === 'number') return new Timestamp(v.__t);
      const o = {};
      for (const k of Object.keys(v)) o[k] = dec(v[k]);
      return o;
    }
    return v;
  };

  // ---------- conexão ----------
  let ws = null, nextId = 1, backoff = 500;
  const pending = new Map();   // id -> {resolve, reject}
  const subs = new Map();      // subId -> {def, handler}
  const queue = [];            // mensagens enviadas antes da conexão abrir

  function flush() {
    while (queue.length && ws && ws.readyState === 1) ws.send(queue.shift());
  }
  function connect() {
    ws = new WebSocket(WS_URL);
    ws.onopen = () => {
      backoff = 500;
      for (const [id, s] of subs) ws.send(JSON.stringify({ op: 'sub', sub: id, ...s.def }));
      flush();
    };
    ws.onmessage = (ev) => {
      let m; try { m = JSON.parse(ev.data); } catch { return; }
      if (m.sub !== undefined && m.type === 'snapshot') {
        const s = subs.get(m.sub);
        if (s) s.handler(m);
        return;
      }
      const p = pending.get(m.id);
      if (!p) return;
      pending.delete(m.id);
      if (m.ok === false) {
        const e = new Error(m.message || 'erro'); e.code = m.code; p.reject(e);
      } else p.resolve(m);
    };
    ws.onclose = () => {
      for (const [, p] of pending) { const e = new Error('conexão perdida'); e.code = 'unavailable'; p.reject(e); }
      pending.clear();
      setTimeout(connect, backoff);
      backoff = Math.min(backoff * 2, 10000);
    };
    ws.onerror = () => {};
  }
  connect();

  function request(msg) {
    return new Promise((resolve, reject) => {
      const id = nextId++;
      pending.set(id, { resolve, reject });
      const raw = JSON.stringify({ id, ...msg });
      if (ws && ws.readyState === 1) ws.send(raw); else queue.push(raw);
    });
  }
  function subscribe(def, handler) {
    const id = 's' + nextId++;
    subs.set(id, { def, handler });
    if (ws && ws.readyState === 1) ws.send(JSON.stringify({ op: 'sub', sub: id, ...def }));
    return () => {
      subs.delete(id);
      if (ws && ws.readyState === 1) ws.send(JSON.stringify({ op: 'unsub', sub: id }));
    };
  }

  const autoId = () => {
    const c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let s = ''; for (let i = 0; i < 20; i++) s += c[Math.floor(Math.random() * c.length)];
    return s;
  };

  // ---------- snapshots ----------
  class DocumentSnapshot {
    constructor(col, id, data) { this.id = id; this.exists = data != null; this._data = data; this.ref = new DocumentReference(col, id); }
    data() { return this.exists ? dec(this._data) : undefined; }
    get(field) { return this.exists ? dec(this._data)[field] : undefined; }
  }
  class QuerySnapshot {
    constructor(col, rows, changes) {
      this.docs = rows.map((r) => new DocumentSnapshot(col, r.id, r.data));
      this.size = this.docs.length;
      this.empty = this.size === 0;
      this._changes = (changes || []).map((c) => ({
        type: c.type,
        doc: new DocumentSnapshot(col, c.id, c.data),
        oldIndex: -1,
        newIndex: c.newIndex === undefined ? -1 : c.newIndex,
      }));
    }
    forEach(fn, thisArg) { this.docs.forEach(fn, thisArg); }
    docChanges() { return this._changes; }
  }

  function makeObserver(next, error) {
    if (typeof next === 'function') return { next, error };
    return { next: next && next.next, error: next && next.error };
  }

  // ---------- referências ----------
  class Query {
    constructor(col, orderBy, limit) { this._col = col; this._orderBy = orderBy || null; this._limit = limit || 0; }
    orderBy(field, dir) { return new Query(this._col, [field, dir === 'desc' ? 'desc' : 'asc'], this._limit); }
    limit(n) { return new Query(this._col, this._orderBy, n); }
    get() {
      return request({ op: 'get', col: this._col, orderBy: this._orderBy, limit: this._limit })
        .then((m) => new QuerySnapshot(this._col, m.docs, []));
    }
    onSnapshot(next, error) {
      const o = makeObserver(next, error);
      return subscribe({ col: this._col, orderBy: this._orderBy, limit: this._limit }, (m) => {
        if (o.next) o.next(new QuerySnapshot(this._col, m.docs, m.changes));
      });
    }
  }
  class CollectionReference extends Query {
    constructor(col) { super(col); this.id = col; }
    doc(id) { return new DocumentReference(this._col, id || autoId()); }
    add(data) {
      return request({ op: 'add', col: this._col, data: enc(data) }).then((m) => new DocumentReference(this._col, m.docId));
    }
  }
  class DocumentReference {
    constructor(col, id) { this.id = id; this._col = col; this.parent = { id: col }; }
    set(data, opts) { return request({ op: 'set', col: this._col, docId: this.id, data: enc(data), merge: !!(opts && opts.merge) }).then(() => undefined); }
    update(data) { return request({ op: 'update', col: this._col, docId: this.id, data: enc(data) }).then(() => undefined); }
    delete() { return request({ op: 'delete', col: this._col, docId: this.id }).then(() => undefined); }
    get() {
      return request({ op: 'get', col: this._col, docId: this.id })
        .then((m) => new DocumentSnapshot(this._col, this.id, m.doc ? m.doc.data : null));
    }
    onSnapshot(next, error) {
      const o = makeObserver(next, error);
      return subscribe({ col: this._col, docId: this.id }, (m) => {
        if (o.next) o.next(new DocumentSnapshot(this._col, this.id, m.doc ? m.doc.data : null));
      });
    }
  }
  class WriteBatch {
    constructor() { this._ops = []; }
    set(ref, data, opts) { this._ops.push({ op: 'set', col: ref._col, docId: ref.id, data: enc(data), merge: !!(opts && opts.merge) }); return this; }
    update(ref, data) { this._ops.push({ op: 'update', col: ref._col, docId: ref.id, data: enc(data) }); return this; }
    delete(ref) { this._ops.push({ op: 'delete', col: ref._col, docId: ref.id }); return this; }
    commit() { return this._ops.length ? request({ op: 'batch', ops: this._ops }).then(() => undefined) : Promise.resolve(); }
  }

  const dbInstance = {
    collection: (name) => new CollectionReference(name),
    batch: () => new WriteBatch(),
  };

  const firestore = () => dbInstance;
  firestore.FieldValue = { serverTimestamp: () => ({ __serverTimestamp: true }) };
  firestore.Timestamp = Timestamp;

  window.firebase = { initializeApp: () => ({}), firestore, apps: [{}] };
  window.mordredDbReady = true;
})();
