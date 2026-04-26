/* Crystal Drops — Firestore data layer
   Loads on every page, exposes window.cdDb with order / customer helpers. */
(function(){
  if (window.cdDb) return;

  // Bail early if Firebase config isn't filled in
  if (!window.firebaseConfig || window.firebaseConfig.apiKey === "YOUR_API_KEY") {
    console.warn("[cdDb] firebase-config.js not configured — running in offline/demo mode.");
    window.cdDb = { offline: true, ready: Promise.resolve() };
    return;
  }

  // Init Firebase (compat SDK loaded from CDN by the HTML page)
  if (!firebase.apps.length) firebase.initializeApp(window.firebaseConfig);
  const db   = firebase.firestore();
  const auth = firebase.auth();

  // Optional offline persistence — orders queue locally if WiFi drops
  db.enablePersistence({synchronizeTabs:true}).catch(err=>{
    if (err.code === 'failed-precondition') console.info("[cdDb] Multi-tab persistence disabled");
    else if (err.code === 'unimplemented') console.info("[cdDb] Persistence not available in this browser");
  });

  const ts = () => firebase.firestore.FieldValue.serverTimestamp();

  window.cdDb = {
    offline: false,
    ready: Promise.resolve(),
    db, auth,

    // ============ ORDERS ============
    createOrder: async (data) => {
      const ref = await db.collection('orders').add({
        customer: data.customer || {},        // {name, phone, address, area, notes}
        items:    data.items    || [],         // [{key, name, price, qty}]
        total:    Number(data.total) || 0,
        channel:  data.channel  || 'qr',       // qr | phone | whatsapp | walkin
        status:   'new',
        paymentMethod: data.paymentMethod || 'upi',
        paid: false,
        customerPhone: (data.customer && data.customer.phone) || '',
        createdAt: ts()
      });
      return ref.id;
    },
    listenOrders: (cb, opts={}) => {
      let q = db.collection('orders').orderBy('createdAt','desc').limit(opts.limit || 100);
      if (opts.status) q = q.where('status','==',opts.status);
      return q.onSnapshot(snap => cb(snap.docs.map(d=>({id:d.id,...d.data()}))));
    },
    updateOrderStatus: (id, status) => db.collection('orders').doc(id).update({status, updatedAt: ts()}),
    markOrderPaid:     (id, method) => db.collection('orders').doc(id).update({paid:true, paymentMethod:method, paidAt: ts()}),

    // ============ CUSTOMERS ============
    upsertCustomer: async (phone, data) => {
      if (!phone) return null;
      const ref = db.collection('customers').doc(phone);
      await ref.set({...data, phone, updatedAt: ts()}, {merge:true});
      return phone;
    },
    listenCustomers: (cb) =>
      db.collection('customers').orderBy('updatedAt','desc').onSnapshot(snap =>
        cb(snap.docs.map(d=>({id:d.id,...d.data()})))),

    // ============ AUTH (admin only) ============
    signInGoogle: () => auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()),
    signOut:      () => auth.signOut(),
    onAuth:       (cb) => auth.onAuthStateChanged(cb)
  };
})();
