// https://d3js.org/d3-geo/ v1.11.9 Copyright 2019 Mike Bostock
!(function (n, t) {
  'object' == typeof exports && 'undefined' != typeof module
    ? t(exports, require('d3-array'))
    : 'function' == typeof define && define.amd
    ? define(['exports', 'd3-array'], t)
    : t(((n = n || self).d3 = n.d3 || {}), n.d3);
})(this, function (n, t) {
  'use strict';
  function r() {
    return new i();
  }
  function i() {
    this.reset();
  }
  i.prototype = {
    constructor: i,
    reset: function () {
      this.s = this.t = 0;
    },
    add: function (n) {
      o(e, n, this.t), o(this, e.s, this.s), this.s ? (this.t += e.t) : (this.s = e.t);
    },
    valueOf: function () {
      return this.s;
    }
  };
  var e = new i();
  function o(n, t, r) {
    var i = (n.s = t + r),
      e = i - t,
      o = i - e;
    n.t = t - o + (r - e);
  }
  var u = 1e-6,
    c = 1e-12,
    a = Math.PI,
    l = a / 2,
    f = a / 4,
    s = 2 * a,
    p = 180 / a,
    h = a / 180,
    g = Math.abs,
    v = Math.atan,
    d = Math.atan2,
    E = Math.cos,
    y = Math.ceil,
    S = Math.exp,
    m = Math.log,
    M = Math.pow,
    x = Math.sin,
    _ =
      Math.sign ||
      function (n) {
        return n > 0 ? 1 : n < 0 ? -1 : 0;
      },
    N = Math.sqrt,
    w = Math.tan;
  function R(n) {
    return n > 1 ? 0 : n < -1 ? a : Math.acos(n);
  }
  function C(n) {
    return n > 1 ? l : n < -1 ? -l : Math.asin(n);
  }
  function P(n) {
    return (n = x(n / 2)) * n;
  }
  function A() {}
  function j(n, t) {
    n && z.hasOwnProperty(n.type) && z[n.type](n, t);
  }
  var q = {
      Feature: function (n, t) {
        j(n.geometry, t);
      },
      FeatureCollection: function (n, t) {
        for (var r = n.features, i = -1, e = r.length; ++i < e; ) j(r[i].geometry, t);
      }
    },
    z = {
      Sphere: function (n, t) {
        t.sphere();
      },
      Point: function (n, t) {
        (n = n.coordinates), t.point(n[0], n[1], n[2]);
      },
      MultiPoint: function (n, t) {
        for (var r = n.coordinates, i = -1, e = r.length; ++i < e; ) (n = r[i]), t.point(n[0], n[1], n[2]);
      },
      LineString: function (n, t) {
        b(n.coordinates, t, 0);
      },
      MultiLineString: function (n, t) {
        for (var r = n.coordinates, i = -1, e = r.length; ++i < e; ) b(r[i], t, 0);
      },
      Polygon: function (n, t) {
        L(n.coordinates, t);
      },
      MultiPolygon: function (n, t) {
        for (var r = n.coordinates, i = -1, e = r.length; ++i < e; ) L(r[i], t);
      },
      GeometryCollection: function (n, t) {
        for (var r = n.geometries, i = -1, e = r.length; ++i < e; ) j(r[i], t);
      }
    };
  function b(n, t, r) {
    var i,
      e = -1,
      o = n.length - r;
    for (t.lineStart(); ++e < o; ) (i = n[e]), t.point(i[0], i[1], i[2]);
    t.lineEnd();
  }
  function L(n, t) {
    var r = -1,
      i = n.length;
    for (t.polygonStart(); ++r < i; ) b(n[r], t, 1);
    t.polygonEnd();
  }
  function O(n, t) {
    n && q.hasOwnProperty(n.type) ? q[n.type](n, t) : j(n, t);
  }
  var G,
    T,
    k,
    F,
    H,
    I = r(),
    W = r(),
    B = {
      point: A,
      lineStart: A,
      lineEnd: A,
      polygonStart: function () {
        I.reset(), (B.lineStart = D), (B.lineEnd = U);
      },
      polygonEnd: function () {
        var n = +I;
        W.add(n < 0 ? s + n : n), (this.lineStart = this.lineEnd = this.point = A);
      },
      sphere: function () {
        W.add(s);
      }
    };
  function D() {
    B.point = X;
  }
  function U() {
    Y(G, T);
  }
  function X(n, t) {
    (B.point = Y), (G = n), (T = t), (k = n *= h), (F = E((t = (t *= h) / 2 + f))), (H = x(t));
  }
  function Y(n, t) {
    var r = (n *= h) - k,
      i = r >= 0 ? 1 : -1,
      e = i * r,
      o = E((t = (t *= h) / 2 + f)),
      u = x(t),
      c = H * u,
      a = F * o + c * E(e),
      l = c * i * x(e);
    I.add(d(l, a)), (k = n), (F = o), (H = u);
  }
  function Z(n) {
    return [d(n[1], n[0]), C(n[2])];
  }
  function J(n) {
    var t = n[0],
      r = n[1],
      i = E(r);
    return [i * E(t), i * x(t), x(r)];
  }
  function K(n, t) {
    return n[0] * t[0] + n[1] * t[1] + n[2] * t[2];
  }
  function Q(n, t) {
    return [n[1] * t[2] - n[2] * t[1], n[2] * t[0] - n[0] * t[2], n[0] * t[1] - n[1] * t[0]];
  }
  function V(n, t) {
    (n[0] += t[0]), (n[1] += t[1]), (n[2] += t[2]);
  }
  function $(n, t) {
    return [n[0] * t, n[1] * t, n[2] * t];
  }
  function nn(n) {
    var t = N(n[0] * n[0] + n[1] * n[1] + n[2] * n[2]);
    (n[0] /= t), (n[1] /= t), (n[2] /= t);
  }
  var tn,
    rn,
    en,
    on,
    un,
    cn,
    an,
    ln,
    fn,
    sn,
    pn,
    hn,
    gn,
    vn,
    dn,
    En,
    yn,
    Sn,
    mn,
    Mn,
    xn,
    _n,
    Nn,
    wn,
    Rn,
    Cn,
    Pn = r(),
    An = {
      point: jn,
      lineStart: zn,
      lineEnd: bn,
      polygonStart: function () {
        (An.point = Ln), (An.lineStart = On), (An.lineEnd = Gn), Pn.reset(), B.polygonStart();
      },
      polygonEnd: function () {
        B.polygonEnd(),
          (An.point = jn),
          (An.lineStart = zn),
          (An.lineEnd = bn),
          I < 0 ? ((tn = -(en = 180)), (rn = -(on = 90))) : Pn > u ? (on = 90) : Pn < -u && (rn = -90),
          (sn[0] = tn),
          (sn[1] = en);
      },
      sphere: function () {
        (tn = -(en = 180)), (rn = -(on = 90));
      }
    };
  function jn(n, t) {
    fn.push((sn = [(tn = n), (en = n)])), t < rn && (rn = t), t > on && (on = t);
  }
  function qn(n, t) {
    var r = J([n * h, t * h]);
    if (ln) {
      var i = Q(ln, r),
        e = Q([i[1], -i[0], 0], i);
      nn(e), (e = Z(e));
      var o,
        u = n - un,
        c = u > 0 ? 1 : -1,
        a = e[0] * p * c,
        l = g(u) > 180;
      l ^ (c * un < a && a < c * n)
        ? (o = e[1] * p) > on && (on = o)
        : l ^ (c * un < (a = ((a + 360) % 360) - 180) && a < c * n)
        ? (o = -e[1] * p) < rn && (rn = o)
        : (t < rn && (rn = t), t > on && (on = t)),
        l
          ? n < un
            ? Tn(tn, n) > Tn(tn, en) && (en = n)
            : Tn(n, en) > Tn(tn, en) && (tn = n)
          : en >= tn
          ? (n < tn && (tn = n), n > en && (en = n))
          : n > un
          ? Tn(tn, n) > Tn(tn, en) && (en = n)
          : Tn(n, en) > Tn(tn, en) && (tn = n);
    } else fn.push((sn = [(tn = n), (en = n)]));
    t < rn && (rn = t), t > on && (on = t), (ln = r), (un = n);
  }
  function zn() {
    An.point = qn;
  }
  function bn() {
    (sn[0] = tn), (sn[1] = en), (An.point = jn), (ln = null);
  }
  function Ln(n, t) {
    if (ln) {
      var r = n - un;
      Pn.add(g(r) > 180 ? r + (r > 0 ? 360 : -360) : r);
    } else (cn = n), (an = t);
    B.point(n, t), qn(n, t);
  }
  function On() {
    B.lineStart();
  }
  function Gn() {
    Ln(cn, an), B.lineEnd(), g(Pn) > u && (tn = -(en = 180)), (sn[0] = tn), (sn[1] = en), (ln = null);
  }
  function Tn(n, t) {
    return (t -= n) < 0 ? t + 360 : t;
  }
  function kn(n, t) {
    return n[0] - t[0];
  }
  function Fn(n, t) {
    return n[0] <= n[1] ? n[0] <= t && t <= n[1] : t < n[0] || n[1] < t;
  }
  var Hn = {
    sphere: A,
    point: In,
    lineStart: Bn,
    lineEnd: Xn,
    polygonStart: function () {
      (Hn.lineStart = Yn), (Hn.lineEnd = Zn);
    },
    polygonEnd: function () {
      (Hn.lineStart = Bn), (Hn.lineEnd = Xn);
    }
  };
  function In(n, t) {
    n *= h;
    var r = E((t *= h));
    Wn(r * E(n), r * x(n), x(t));
  }
  function Wn(n, t, r) {
    (gn += (n - gn) / ++pn), (vn += (t - vn) / pn), (dn += (r - dn) / pn);
  }
  function Bn() {
    Hn.point = Dn;
  }
  function Dn(n, t) {
    n *= h;
    var r = E((t *= h));
    (wn = r * E(n)), (Rn = r * x(n)), (Cn = x(t)), (Hn.point = Un), Wn(wn, Rn, Cn);
  }
  function Un(n, t) {
    n *= h;
    var r = E((t *= h)),
      i = r * E(n),
      e = r * x(n),
      o = x(t),
      u = d(N((u = Rn * o - Cn * e) * u + (u = Cn * i - wn * o) * u + (u = wn * e - Rn * i) * u), wn * i + Rn * e + Cn * o);
    (hn += u), (En += u * (wn + (wn = i))), (yn += u * (Rn + (Rn = e))), (Sn += u * (Cn + (Cn = o))), Wn(wn, Rn, Cn);
  }
  function Xn() {
    Hn.point = In;
  }
  function Yn() {
    Hn.point = Jn;
  }
  function Zn() {
    Kn(_n, Nn), (Hn.point = In);
  }
  function Jn(n, t) {
    (_n = n), (Nn = t), (n *= h), (t *= h), (Hn.point = Kn);
    var r = E(t);
    (wn = r * E(n)), (Rn = r * x(n)), (Cn = x(t)), Wn(wn, Rn, Cn);
  }
  function Kn(n, t) {
    n *= h;
    var r = E((t *= h)),
      i = r * E(n),
      e = r * x(n),
      o = x(t),
      u = Rn * o - Cn * e,
      c = Cn * i - wn * o,
      a = wn * e - Rn * i,
      l = N(u * u + c * c + a * a),
      f = C(l),
      s = l && -f / l;
    (mn += s * u),
      (Mn += s * c),
      (xn += s * a),
      (hn += f),
      (En += f * (wn + (wn = i))),
      (yn += f * (Rn + (Rn = e))),
      (Sn += f * (Cn + (Cn = o))),
      Wn(wn, Rn, Cn);
  }
  function Qn(n) {
    return function () {
      return n;
    };
  }
  function Vn(n, t) {
    function r(r, i) {
      return (r = n(r, i)), t(r[0], r[1]);
    }
    return (
      n.invert &&
        t.invert &&
        (r.invert = function (r, i) {
          return (r = t.invert(r, i)) && n.invert(r[0], r[1]);
        }),
      r
    );
  }
  function $n(n, t) {
    return [g(n) > a ? n + Math.round(-n / s) * s : n, t];
  }
  function nt(n, t, r) {
    return (n %= s) ? (t || r ? Vn(rt(n), it(t, r)) : rt(n)) : t || r ? it(t, r) : $n;
  }
  function tt(n) {
    return function (t, r) {
      return [(t += n) > a ? t - s : t < -a ? t + s : t, r];
    };
  }
  function rt(n) {
    var t = tt(n);
    return (t.invert = tt(-n)), t;
  }
  function it(n, t) {
    var r = E(n),
      i = x(n),
      e = E(t),
      o = x(t);
    function u(n, t) {
      var u = E(t),
        c = E(n) * u,
        a = x(n) * u,
        l = x(t),
        f = l * r + c * i;
      return [d(a * e - f * o, c * r - l * i), C(f * e + a * o)];
    }
    return (
      (u.invert = function (n, t) {
        var u = E(t),
          c = E(n) * u,
          a = x(n) * u,
          l = x(t),
          f = l * e - a * o;
        return [d(a * e + l * o, c * r + f * i), C(f * r - c * i)];
      }),
      u
    );
  }
  function et(n) {
    function t(t) {
      return ((t = n(t[0] * h, t[1] * h))[0] *= p), (t[1] *= p), t;
    }
    return (
      (n = nt(n[0] * h, n[1] * h, n.length > 2 ? n[2] * h : 0)),
      (t.invert = function (t) {
        return ((t = n.invert(t[0] * h, t[1] * h))[0] *= p), (t[1] *= p), t;
      }),
      t
    );
  }
  function ot(n, t, r, i, e, o) {
    if (r) {
      var u = E(t),
        c = x(t),
        a = i * r;
      null == e ? ((e = t + i * s), (o = t - a / 2)) : ((e = ut(u, e)), (o = ut(u, o)), (i > 0 ? e < o : e > o) && (e += i * s));
      for (var l, f = e; i > 0 ? f > o : f < o; f -= a) (l = Z([u, -c * E(f), -c * x(f)])), n.point(l[0], l[1]);
    }
  }
  function ut(n, t) {
    ((t = J(t))[0] -= n), nn(t);
    var r = R(-t[1]);
    return ((-t[2] < 0 ? -r : r) + s - u) % s;
  }
  function ct() {
    var n,
      t = [];
    return {
      point: function (t, r) {
        n.push([t, r]);
      },
      lineStart: function () {
        t.push((n = []));
      },
      lineEnd: A,
      rejoin: function () {
        t.length > 1 && t.push(t.pop().concat(t.shift()));
      },
      result: function () {
        var r = t;
        return (t = []), (n = null), r;
      }
    };
  }
  function at(n, t) {
    return g(n[0] - t[0]) < u && g(n[1] - t[1]) < u;
  }
  function lt(n, t, r, i) {
    (this.x = n), (this.z = t), (this.o = r), (this.e = i), (this.v = !1), (this.n = this.p = null);
  }
  function ft(n, t, r, i, e) {
    var o,
      u,
      c = [],
      a = [];
    if (
      (n.forEach(function (n) {
        if (!((t = n.length - 1) <= 0)) {
          var t,
            r,
            i = n[0],
            u = n[t];
          if (at(i, u)) {
            for (e.lineStart(), o = 0; o < t; ++o) e.point((i = n[o])[0], i[1]);
            e.lineEnd();
          } else
            c.push((r = new lt(i, n, null, !0))),
              a.push((r.o = new lt(i, null, r, !1))),
              c.push((r = new lt(u, n, null, !1))),
              a.push((r.o = new lt(u, null, r, !0)));
        }
      }),
      c.length)
    ) {
      for (a.sort(t), st(c), st(a), o = 0, u = a.length; o < u; ++o) a[o].e = r = !r;
      for (var l, f, s = c[0]; ; ) {
        for (var p = s, h = !0; p.v; ) if ((p = p.n) === s) return;
        (l = p.z), e.lineStart();
        do {
          if (((p.v = p.o.v = !0), p.e)) {
            if (h) for (o = 0, u = l.length; o < u; ++o) e.point((f = l[o])[0], f[1]);
            else i(p.x, p.n.x, 1, e);
            p = p.n;
          } else {
            if (h) for (l = p.p.z, o = l.length - 1; o >= 0; --o) e.point((f = l[o])[0], f[1]);
            else i(p.x, p.p.x, -1, e);
            p = p.p;
          }
          (l = (p = p.o).z), (h = !h);
        } while (!p.v);
        e.lineEnd();
      }
    }
  }
  function st(n) {
    if ((t = n.length)) {
      for (var t, r, i = 0, e = n[0]; ++i < t; ) (e.n = r = n[i]), (r.p = e), (e = r);
      (e.n = r = n[0]), (r.p = e);
    }
  }
  $n.invert = $n;
  var pt = r();
  function ht(n) {
    return g(n[0]) <= a ? n[0] : _(n[0]) * (((g(n[0]) + a) % s) - a);
  }
  function gt(n, t) {
    var r = ht(t),
      i = t[1],
      e = x(i),
      o = [x(r), -E(r), 0],
      c = 0,
      p = 0;
    pt.reset(), 1 === e ? (i = l + u) : -1 === e && (i = -l - u);
    for (var h = 0, g = n.length; h < g; ++h)
      if ((y = (v = n[h]).length))
        for (var v, y, S = v[y - 1], m = ht(S), M = S[1] / 2 + f, _ = x(M), N = E(M), w = 0; w < y; ++w, m = P, _ = j, N = q, S = R) {
          var R = v[w],
            P = ht(R),
            A = R[1] / 2 + f,
            j = x(A),
            q = E(A),
            z = P - m,
            b = z >= 0 ? 1 : -1,
            L = b * z,
            O = L > a,
            G = _ * j;
          if ((pt.add(d(G * b * x(L), N * q + G * E(L))), (c += O ? z + b * s : z), O ^ (m >= r) ^ (P >= r))) {
            var T = Q(J(S), J(R));
            nn(T);
            var k = Q(o, T);
            nn(k);
            var F = (O ^ (z >= 0) ? -1 : 1) * C(k[2]);
            (i > F || (i === F && (T[0] || T[1]))) && (p += O ^ (z >= 0) ? 1 : -1);
          }
        }
    return (c < -u || (c < u && pt < -u)) ^ (1 & p);
  }
  function vt(n, r, i, e) {
    return function (o) {
      var u,
        c,
        a,
        l = r(o),
        f = ct(),
        s = r(f),
        p = !1,
        h = {
          point: g,
          lineStart: d,
          lineEnd: E,
          polygonStart: function () {
            (h.point = y), (h.lineStart = S), (h.lineEnd = m), (c = []), (u = []);
          },
          polygonEnd: function () {
            (h.point = g), (h.lineStart = d), (h.lineEnd = E), (c = t.merge(c));
            var n = gt(u, e);
            c.length
              ? (p || (o.polygonStart(), (p = !0)), ft(c, Et, n, i, o))
              : n && (p || (o.polygonStart(), (p = !0)), o.lineStart(), i(null, null, 1, o), o.lineEnd()),
              p && (o.polygonEnd(), (p = !1)),
              (c = u = null);
          },
          sphere: function () {
            o.polygonStart(), o.lineStart(), i(null, null, 1, o), o.lineEnd(), o.polygonEnd();
          }
        };
      function g(t, r) {
        n(t, r) && o.point(t, r);
      }
      function v(n, t) {
        l.point(n, t);
      }
      function d() {
        (h.point = v), l.lineStart();
      }
      function E() {
        (h.point = g), l.lineEnd();
      }
      function y(n, t) {
        a.push([n, t]), s.point(n, t);
      }
      function S() {
        s.lineStart(), (a = []);
      }
      function m() {
        y(a[0][0], a[0][1]), s.lineEnd();
        var n,
          t,
          r,
          i,
          e = s.clean(),
          l = f.result(),
          h = l.length;
        if ((a.pop(), u.push(a), (a = null), h))
          if (1 & e) {
            if ((t = (r = l[0]).length - 1) > 0) {
              for (p || (o.polygonStart(), (p = !0)), o.lineStart(), n = 0; n < t; ++n) o.point((i = r[n])[0], i[1]);
              o.lineEnd();
            }
          } else h > 1 && 2 & e && l.push(l.pop().concat(l.shift())), c.push(l.filter(dt));
      }
      return h;
    };
  }
  function dt(n) {
    return n.length > 1;
  }
  function Et(n, t) {
    return ((n = n.x)[0] < 0 ? n[1] - l - u : l - n[1]) - ((t = t.x)[0] < 0 ? t[1] - l - u : l - t[1]);
  }
  var yt = vt(
    function () {
      return !0;
    },
    function (n) {
      var t,
        r = NaN,
        i = NaN,
        e = NaN;
      return {
        lineStart: function () {
          n.lineStart(), (t = 1);
        },
        point: function (o, c) {
          var f = o > 0 ? a : -a,
            s = g(o - r);
          g(s - a) < u
            ? (n.point(r, (i = (i + c) / 2 > 0 ? l : -l)), n.point(e, i), n.lineEnd(), n.lineStart(), n.point(f, i), n.point(o, i), (t = 0))
            : e !== f &&
              s >= a &&
              (g(r - e) < u && (r -= e * u),
              g(o - f) < u && (o -= f * u),
              (i = (function (n, t, r, i) {
                var e,
                  o,
                  c = x(n - r);
                return g(c) > u ? v((x(t) * (o = E(i)) * x(r) - x(i) * (e = E(t)) * x(n)) / (e * o * c)) : (t + i) / 2;
              })(r, i, o, c)),
              n.point(e, i),
              n.lineEnd(),
              n.lineStart(),
              n.point(f, i),
              (t = 0)),
            n.point((r = o), (i = c)),
            (e = f);
        },
        lineEnd: function () {
          n.lineEnd(), (r = i = NaN);
        },
        clean: function () {
          return 2 - t;
        }
      };
    },
    function (n, t, r, i) {
      var e;
      if (null == n)
        (e = r * l),
          i.point(-a, e),
          i.point(0, e),
          i.point(a, e),
          i.point(a, 0),
          i.point(a, -e),
          i.point(0, -e),
          i.point(-a, -e),
          i.point(-a, 0),
          i.point(-a, e);
      else if (g(n[0] - t[0]) > u) {
        var o = n[0] < t[0] ? a : -a;
        (e = (r * o) / 2), i.point(-o, e), i.point(0, e), i.point(o, e);
      } else i.point(t[0], t[1]);
    },
    [-a, -l]
  );
  function St(n) {
    var t = E(n),
      r = 6 * h,
      i = t > 0,
      e = g(t) > u;
    function o(n, r) {
      return E(n) * E(r) > t;
    }
    function c(n, r, i) {
      var e = [1, 0, 0],
        o = Q(J(n), J(r)),
        c = K(o, o),
        l = o[0],
        f = c - l * l;
      if (!f) return !i && n;
      var s = (t * c) / f,
        p = (-t * l) / f,
        h = Q(e, o),
        v = $(e, s);
      V(v, $(o, p));
      var d = h,
        E = K(v, d),
        y = K(d, d),
        S = E * E - y * (K(v, v) - 1);
      if (!(S < 0)) {
        var m = N(S),
          M = $(d, (-E - m) / y);
        if ((V(M, v), (M = Z(M)), !i)) return M;
        var x,
          _ = n[0],
          w = r[0],
          R = n[1],
          C = r[1];
        w < _ && ((x = _), (_ = w), (w = x));
        var P = w - _,
          A = g(P - a) < u;
        if (
          (!A && C < R && ((x = R), (R = C), (C = x)),
          A || P < u ? (A ? (R + C > 0) ^ (M[1] < (g(M[0] - _) < u ? R : C)) : R <= M[1] && M[1] <= C) : (P > a) ^ (_ <= M[0] && M[0] <= w))
        ) {
          var j = $(d, (-E + m) / y);
          return V(j, v), [M, Z(j)];
        }
      }
    }
    function l(t, r) {
      var e = i ? n : a - n,
        o = 0;
      return t < -e ? (o |= 1) : t > e && (o |= 2), r < -e ? (o |= 4) : r > e && (o |= 8), o;
    }
    return vt(
      o,
      function (n) {
        var t, r, f, s, p;
        return {
          lineStart: function () {
            (s = f = !1), (p = 1);
          },
          point: function (h, g) {
            var v,
              d = [h, g],
              E = o(h, g),
              y = i ? (E ? 0 : l(h, g)) : E ? l(h + (h < 0 ? a : -a), g) : 0;
            if (
              (!t && (s = f = E) && n.lineStart(),
              E !== f && (!(v = c(t, d)) || at(t, v) || at(d, v)) && ((d[0] += u), (d[1] += u), (E = o(d[0], d[1]))),
              E !== f)
            )
              (p = 0), E ? (n.lineStart(), (v = c(d, t)), n.point(v[0], v[1])) : ((v = c(t, d)), n.point(v[0], v[1]), n.lineEnd()), (t = v);
            else if (e && t && i ^ E) {
              var S;
              y & r ||
                !(S = c(d, t, !0)) ||
                ((p = 0),
                i
                  ? (n.lineStart(), n.point(S[0][0], S[0][1]), n.point(S[1][0], S[1][1]), n.lineEnd())
                  : (n.point(S[1][0], S[1][1]), n.lineEnd(), n.lineStart(), n.point(S[0][0], S[0][1])));
            }
            !E || (t && at(t, d)) || n.point(d[0], d[1]), (t = d), (f = E), (r = y);
          },
          lineEnd: function () {
            f && n.lineEnd(), (t = null);
          },
          clean: function () {
            return p | ((s && f) << 1);
          }
        };
      },
      function (t, i, e, o) {
        ot(o, n, r, e, t, i);
      },
      i ? [0, -n] : [-a, n - a]
    );
  }
  var mt = 1e9,
    Mt = -mt;
  function xt(n, r, i, e) {
    function o(t, o) {
      return n <= t && t <= i && r <= o && o <= e;
    }
    function c(t, o, u, c) {
      var l = 0,
        s = 0;
      if (null == t || (l = a(t, u)) !== (s = a(o, u)) || (f(t, o) < 0) ^ (u > 0))
        do {
          c.point(0 === l || 3 === l ? n : i, l > 1 ? e : r);
        } while ((l = (l + u + 4) % 4) !== s);
      else c.point(o[0], o[1]);
    }
    function a(t, e) {
      return g(t[0] - n) < u ? (e > 0 ? 0 : 3) : g(t[0] - i) < u ? (e > 0 ? 2 : 1) : g(t[1] - r) < u ? (e > 0 ? 1 : 0) : e > 0 ? 3 : 2;
    }
    function l(n, t) {
      return f(n.x, t.x);
    }
    function f(n, t) {
      var r = a(n, 1),
        i = a(t, 1);
      return r !== i ? r - i : 0 === r ? t[1] - n[1] : 1 === r ? n[0] - t[0] : 2 === r ? n[1] - t[1] : t[0] - n[0];
    }
    return function (u) {
      var a,
        f,
        s,
        p,
        h,
        g,
        v,
        d,
        E,
        y,
        S,
        m = u,
        M = ct(),
        x = {
          point: _,
          lineStart: function () {
            (x.point = N), f && f.push((s = []));
            (y = !0), (E = !1), (v = d = NaN);
          },
          lineEnd: function () {
            a && (N(p, h), g && E && M.rejoin(), a.push(M.result()));
            (x.point = _), E && m.lineEnd();
          },
          polygonStart: function () {
            (m = M), (a = []), (f = []), (S = !0);
          },
          polygonEnd: function () {
            var r = (function () {
                for (var t = 0, r = 0, i = f.length; r < i; ++r)
                  for (var o, u, c = f[r], a = 1, l = c.length, s = c[0], p = s[0], h = s[1]; a < l; ++a)
                    (o = p),
                      (u = h),
                      (s = c[a]),
                      (p = s[0]),
                      (h = s[1]),
                      u <= e ? h > e && (p - o) * (e - u) > (h - u) * (n - o) && ++t : h <= e && (p - o) * (e - u) < (h - u) * (n - o) && --t;
                return t;
              })(),
              i = S && r,
              o = (a = t.merge(a)).length;
            (i || o) && (u.polygonStart(), i && (u.lineStart(), c(null, null, 1, u), u.lineEnd()), o && ft(a, l, r, c, u), u.polygonEnd());
            (m = u), (a = f = s = null);
          }
        };
      function _(n, t) {
        o(n, t) && m.point(n, t);
      }
      function N(t, u) {
        var c = o(t, u);
        if ((f && s.push([t, u]), y)) (p = t), (h = u), (g = c), (y = !1), c && (m.lineStart(), m.point(t, u));
        else if (c && E) m.point(t, u);
        else {
          var a = [(v = Math.max(Mt, Math.min(mt, v))), (d = Math.max(Mt, Math.min(mt, d)))],
            l = [(t = Math.max(Mt, Math.min(mt, t))), (u = Math.max(Mt, Math.min(mt, u)))];
          !(function (n, t, r, i, e, o) {
            var u,
              c = n[0],
              a = n[1],
              l = 0,
              f = 1,
              s = t[0] - c,
              p = t[1] - a;
            if (((u = r - c), s || !(u > 0))) {
              if (((u /= s), s < 0)) {
                if (u < l) return;
                u < f && (f = u);
              } else if (s > 0) {
                if (u > f) return;
                u > l && (l = u);
              }
              if (((u = e - c), s || !(u < 0))) {
                if (((u /= s), s < 0)) {
                  if (u > f) return;
                  u > l && (l = u);
                } else if (s > 0) {
                  if (u < l) return;
                  u < f && (f = u);
                }
                if (((u = i - a), p || !(u > 0))) {
                  if (((u /= p), p < 0)) {
                    if (u < l) return;
                    u < f && (f = u);
                  } else if (p > 0) {
                    if (u > f) return;
                    u > l && (l = u);
                  }
                  if (((u = o - a), p || !(u < 0))) {
                    if (((u /= p), p < 0)) {
                      if (u > f) return;
                      u > l && (l = u);
                    } else if (p > 0) {
                      if (u < l) return;
                      u < f && (f = u);
                    }
                    return l > 0 && ((n[0] = c + l * s), (n[1] = a + l * p)), f < 1 && ((t[0] = c + f * s), (t[1] = a + f * p)), !0;
                  }
                }
              }
            }
          })(a, l, n, r, i, e)
            ? c && (m.lineStart(), m.point(t, u), (S = !1))
            : (E || (m.lineStart(), m.point(a[0], a[1])), m.point(l[0], l[1]), c || m.lineEnd(), (S = !1));
        }
        (v = t), (d = u), (E = c);
      }
      return x;
    };
  }
  var _t,
    Nt,
    wt,
    Rt = r(),
    Ct = {
      sphere: A,
      point: A,
      lineStart: function () {
        (Ct.point = At), (Ct.lineEnd = Pt);
      },
      lineEnd: A,
      polygonStart: A,
      polygonEnd: A
    };
  function Pt() {
    Ct.point = Ct.lineEnd = A;
  }
  function At(n, t) {
    (_t = n *= h), (Nt = x((t *= h))), (wt = E(t)), (Ct.point = jt);
  }
  function jt(n, t) {
    n *= h;
    var r = x((t *= h)),
      i = E(t),
      e = g(n - _t),
      o = E(e),
      u = i * x(e),
      c = wt * r - Nt * i * o,
      a = Nt * r + wt * i * o;
    Rt.add(d(N(u * u + c * c), a)), (_t = n), (Nt = r), (wt = i);
  }
  function qt(n) {
    return Rt.reset(), O(n, Ct), +Rt;
  }
  var zt = [null, null],
    bt = { type: 'LineString', coordinates: zt };
  function Lt(n, t) {
    return (zt[0] = n), (zt[1] = t), qt(bt);
  }
  var Ot = {
      Feature: function (n, t) {
        return Tt(n.geometry, t);
      },
      FeatureCollection: function (n, t) {
        for (var r = n.features, i = -1, e = r.length; ++i < e; ) if (Tt(r[i].geometry, t)) return !0;
        return !1;
      }
    },
    Gt = {
      Sphere: function () {
        return !0;
      },
      Point: function (n, t) {
        return kt(n.coordinates, t);
      },
      MultiPoint: function (n, t) {
        for (var r = n.coordinates, i = -1, e = r.length; ++i < e; ) if (kt(r[i], t)) return !0;
        return !1;
      },
      LineString: function (n, t) {
        return Ft(n.coordinates, t);
      },
      MultiLineString: function (n, t) {
        for (var r = n.coordinates, i = -1, e = r.length; ++i < e; ) if (Ft(r[i], t)) return !0;
        return !1;
      },
      Polygon: function (n, t) {
        return Ht(n.coordinates, t);
      },
      MultiPolygon: function (n, t) {
        for (var r = n.coordinates, i = -1, e = r.length; ++i < e; ) if (Ht(r[i], t)) return !0;
        return !1;
      },
      GeometryCollection: function (n, t) {
        for (var r = n.geometries, i = -1, e = r.length; ++i < e; ) if (Tt(r[i], t)) return !0;
        return !1;
      }
    };
  function Tt(n, t) {
    return !(!n || !Gt.hasOwnProperty(n.type)) && Gt[n.type](n, t);
  }
  function kt(n, t) {
    return 0 === Lt(n, t);
  }
  function Ft(n, t) {
    for (var r, i, e, o = 0, u = n.length; o < u; o++) {
      if (0 === (i = Lt(n[o], t))) return !0;
      if (o > 0 && (e = Lt(n[o], n[o - 1])) > 0 && r <= e && i <= e && (r + i - e) * (1 - Math.pow((r - i) / e, 2)) < c * e) return !0;
      r = i;
    }
    return !1;
  }
  function Ht(n, t) {
    return !!gt(n.map(It), Wt(t));
  }
  function It(n) {
    return (n = n.map(Wt)).pop(), n;
  }
  function Wt(n) {
    return [n[0] * h, n[1] * h];
  }
  function Bt(n, r, i) {
    var e = t.range(n, r - u, i).concat(r);
    return function (n) {
      return e.map(function (t) {
        return [n, t];
      });
    };
  }
  function Dt(n, r, i) {
    var e = t.range(n, r - u, i).concat(r);
    return function (n) {
      return e.map(function (t) {
        return [t, n];
      });
    };
  }
  function Ut() {
    var n,
      r,
      i,
      e,
      o,
      c,
      a,
      l,
      f,
      s,
      p,
      h,
      v = 10,
      d = v,
      E = 90,
      S = 360,
      m = 2.5;
    function M() {
      return { type: 'MultiLineString', coordinates: x() };
    }
    function x() {
      return t
        .range(y(e / E) * E, i, E)
        .map(p)
        .concat(t.range(y(l / S) * S, a, S).map(h))
        .concat(
          t
            .range(y(r / v) * v, n, v)
            .filter(function (n) {
              return g(n % E) > u;
            })
            .map(f)
        )
        .concat(
          t
            .range(y(c / d) * d, o, d)
            .filter(function (n) {
              return g(n % S) > u;
            })
            .map(s)
        );
    }
    return (
      (M.lines = function () {
        return x().map(function (n) {
          return { type: 'LineString', coordinates: n };
        });
      }),
      (M.outline = function () {
        return { type: 'Polygon', coordinates: [p(e).concat(h(a).slice(1), p(i).reverse().slice(1), h(l).reverse().slice(1))] };
      }),
      (M.extent = function (n) {
        return arguments.length ? M.extentMajor(n).extentMinor(n) : M.extentMinor();
      }),
      (M.extentMajor = function (n) {
        return arguments.length
          ? ((e = +n[0][0]),
            (i = +n[1][0]),
            (l = +n[0][1]),
            (a = +n[1][1]),
            e > i && ((n = e), (e = i), (i = n)),
            l > a && ((n = l), (l = a), (a = n)),
            M.precision(m))
          : [
              [e, l],
              [i, a]
            ];
      }),
      (M.extentMinor = function (t) {
        return arguments.length
          ? ((r = +t[0][0]),
            (n = +t[1][0]),
            (c = +t[0][1]),
            (o = +t[1][1]),
            r > n && ((t = r), (r = n), (n = t)),
            c > o && ((t = c), (c = o), (o = t)),
            M.precision(m))
          : [
              [r, c],
              [n, o]
            ];
      }),
      (M.step = function (n) {
        return arguments.length ? M.stepMajor(n).stepMinor(n) : M.stepMinor();
      }),
      (M.stepMajor = function (n) {
        return arguments.length ? ((E = +n[0]), (S = +n[1]), M) : [E, S];
      }),
      (M.stepMinor = function (n) {
        return arguments.length ? ((v = +n[0]), (d = +n[1]), M) : [v, d];
      }),
      (M.precision = function (t) {
        return arguments.length ? ((m = +t), (f = Bt(c, o, 90)), (s = Dt(r, n, m)), (p = Bt(l, a, 90)), (h = Dt(e, i, m)), M) : m;
      }),
      M.extentMajor([
        [-180, -90 + u],
        [180, 90 - u]
      ]).extentMinor([
        [-180, -80 - u],
        [180, 80 + u]
      ])
    );
  }
  function Xt(n) {
    return n;
  }
  var Yt,
    Zt,
    Jt,
    Kt,
    Qt = r(),
    Vt = r(),
    $t = {
      point: A,
      lineStart: A,
      lineEnd: A,
      polygonStart: function () {
        ($t.lineStart = nr), ($t.lineEnd = ir);
      },
      polygonEnd: function () {
        ($t.lineStart = $t.lineEnd = $t.point = A), Qt.add(g(Vt)), Vt.reset();
      },
      result: function () {
        var n = Qt / 2;
        return Qt.reset(), n;
      }
    };
  function nr() {
    $t.point = tr;
  }
  function tr(n, t) {
    ($t.point = rr), (Yt = Jt = n), (Zt = Kt = t);
  }
  function rr(n, t) {
    Vt.add(Kt * n - Jt * t), (Jt = n), (Kt = t);
  }
  function ir() {
    rr(Yt, Zt);
  }
  var er = 1 / 0,
    or = er,
    ur = -er,
    cr = ur,
    ar = {
      point: function (n, t) {
        n < er && (er = n);
        n > ur && (ur = n);
        t < or && (or = t);
        t > cr && (cr = t);
      },
      lineStart: A,
      lineEnd: A,
      polygonStart: A,
      polygonEnd: A,
      result: function () {
        var n = [
          [er, or],
          [ur, cr]
        ];
        return (ur = cr = -(or = er = 1 / 0)), n;
      }
    };
  var lr,
    fr,
    sr,
    pr,
    hr = 0,
    gr = 0,
    vr = 0,
    dr = 0,
    Er = 0,
    yr = 0,
    Sr = 0,
    mr = 0,
    Mr = 0,
    xr = {
      point: _r,
      lineStart: Nr,
      lineEnd: Cr,
      polygonStart: function () {
        (xr.lineStart = Pr), (xr.lineEnd = Ar);
      },
      polygonEnd: function () {
        (xr.point = _r), (xr.lineStart = Nr), (xr.lineEnd = Cr);
      },
      result: function () {
        var n = Mr ? [Sr / Mr, mr / Mr] : yr ? [dr / yr, Er / yr] : vr ? [hr / vr, gr / vr] : [NaN, NaN];
        return (hr = gr = vr = dr = Er = yr = Sr = mr = Mr = 0), n;
      }
    };
  function _r(n, t) {
    (hr += n), (gr += t), ++vr;
  }
  function Nr() {
    xr.point = wr;
  }
  function wr(n, t) {
    (xr.point = Rr), _r((sr = n), (pr = t));
  }
  function Rr(n, t) {
    var r = n - sr,
      i = t - pr,
      e = N(r * r + i * i);
    (dr += (e * (sr + n)) / 2), (Er += (e * (pr + t)) / 2), (yr += e), _r((sr = n), (pr = t));
  }
  function Cr() {
    xr.point = _r;
  }
  function Pr() {
    xr.point = jr;
  }
  function Ar() {
    qr(lr, fr);
  }
  function jr(n, t) {
    (xr.point = qr), _r((lr = sr = n), (fr = pr = t));
  }
  function qr(n, t) {
    var r = n - sr,
      i = t - pr,
      e = N(r * r + i * i);
    (dr += (e * (sr + n)) / 2),
      (Er += (e * (pr + t)) / 2),
      (yr += e),
      (Sr += (e = pr * n - sr * t) * (sr + n)),
      (mr += e * (pr + t)),
      (Mr += 3 * e),
      _r((sr = n), (pr = t));
  }
  function zr(n) {
    this._context = n;
  }
  zr.prototype = {
    _radius: 4.5,
    pointRadius: function (n) {
      return (this._radius = n), this;
    },
    polygonStart: function () {
      this._line = 0;
    },
    polygonEnd: function () {
      this._line = NaN;
    },
    lineStart: function () {
      this._point = 0;
    },
    lineEnd: function () {
      0 === this._line && this._context.closePath(), (this._point = NaN);
    },
    point: function (n, t) {
      switch (this._point) {
        case 0:
          this._context.moveTo(n, t), (this._point = 1);
          break;
        case 1:
          this._context.lineTo(n, t);
          break;
        default:
          this._context.moveTo(n + this._radius, t), this._context.arc(n, t, this._radius, 0, s);
      }
    },
    result: A
  };
  var br,
    Lr,
    Or,
    Gr,
    Tr,
    kr = r(),
    Fr = {
      point: A,
      lineStart: function () {
        Fr.point = Hr;
      },
      lineEnd: function () {
        br && Ir(Lr, Or), (Fr.point = A);
      },
      polygonStart: function () {
        br = !0;
      },
      polygonEnd: function () {
        br = null;
      },
      result: function () {
        var n = +kr;
        return kr.reset(), n;
      }
    };
  function Hr(n, t) {
    (Fr.point = Ir), (Lr = Gr = n), (Or = Tr = t);
  }
  function Ir(n, t) {
    (Gr -= n), (Tr -= t), kr.add(N(Gr * Gr + Tr * Tr)), (Gr = n), (Tr = t);
  }
  function Wr() {
    this._string = [];
  }
  function Br(n) {
    return 'm0,' + n + 'a' + n + ',' + n + ' 0 1,1 0,' + -2 * n + 'a' + n + ',' + n + ' 0 1,1 0,' + 2 * n + 'z';
  }
  function Dr(n) {
    return function (t) {
      var r = new Ur();
      for (var i in n) r[i] = n[i];
      return (r.stream = t), r;
    };
  }
  function Ur() {}
  function Xr(n, t, r) {
    var i = n.clipExtent && n.clipExtent();
    return n.scale(150).translate([0, 0]), null != i && n.clipExtent(null), O(r, n.stream(ar)), t(ar.result()), null != i && n.clipExtent(i), n;
  }
  function Yr(n, t, r) {
    return Xr(
      n,
      function (r) {
        var i = t[1][0] - t[0][0],
          e = t[1][1] - t[0][1],
          o = Math.min(i / (r[1][0] - r[0][0]), e / (r[1][1] - r[0][1])),
          u = +t[0][0] + (i - o * (r[1][0] + r[0][0])) / 2,
          c = +t[0][1] + (e - o * (r[1][1] + r[0][1])) / 2;
        n.scale(150 * o).translate([u, c]);
      },
      r
    );
  }
  function Zr(n, t, r) {
    return Yr(n, [[0, 0], t], r);
  }
  function Jr(n, t, r) {
    return Xr(
      n,
      function (r) {
        var i = +t,
          e = i / (r[1][0] - r[0][0]),
          o = (i - e * (r[1][0] + r[0][0])) / 2,
          u = -e * r[0][1];
        n.scale(150 * e).translate([o, u]);
      },
      r
    );
  }
  function Kr(n, t, r) {
    return Xr(
      n,
      function (r) {
        var i = +t,
          e = i / (r[1][1] - r[0][1]),
          o = -e * r[0][0],
          u = (i - e * (r[1][1] + r[0][1])) / 2;
        n.scale(150 * e).translate([o, u]);
      },
      r
    );
  }
  (Wr.prototype = {
    _radius: 4.5,
    _circle: Br(4.5),
    pointRadius: function (n) {
      return (n = +n) !== this._radius && ((this._radius = n), (this._circle = null)), this;
    },
    polygonStart: function () {
      this._line = 0;
    },
    polygonEnd: function () {
      this._line = NaN;
    },
    lineStart: function () {
      this._point = 0;
    },
    lineEnd: function () {
      0 === this._line && this._string.push('Z'), (this._point = NaN);
    },
    point: function (n, t) {
      switch (this._point) {
        case 0:
          this._string.push('M', n, ',', t), (this._point = 1);
          break;
        case 1:
          this._string.push('L', n, ',', t);
          break;
        default:
          null == this._circle && (this._circle = Br(this._radius)), this._string.push('M', n, ',', t, this._circle);
      }
    },
    result: function () {
      if (this._string.length) {
        var n = this._string.join('');
        return (this._string = []), n;
      }
      return null;
    }
  }),
    (Ur.prototype = {
      constructor: Ur,
      point: function (n, t) {
        this.stream.point(n, t);
      },
      sphere: function () {
        this.stream.sphere();
      },
      lineStart: function () {
        this.stream.lineStart();
      },
      lineEnd: function () {
        this.stream.lineEnd();
      },
      polygonStart: function () {
        this.stream.polygonStart();
      },
      polygonEnd: function () {
        this.stream.polygonEnd();
      }
    });
  var Qr = 16,
    Vr = E(30 * h);
  function $r(n, t) {
    return +t
      ? (function (n, t) {
          function r(i, e, o, c, a, l, f, s, p, h, v, E, y, S) {
            var m = f - i,
              M = s - e,
              x = m * m + M * M;
            if (x > 4 * t && y--) {
              var _ = c + h,
                w = a + v,
                R = l + E,
                P = N(_ * _ + w * w + R * R),
                A = C((R /= P)),
                j = g(g(R) - 1) < u || g(o - p) < u ? (o + p) / 2 : d(w, _),
                q = n(j, A),
                z = q[0],
                b = q[1],
                L = z - i,
                O = b - e,
                G = M * L - m * O;
              ((G * G) / x > t || g((m * L + M * O) / x - 0.5) > 0.3 || c * h + a * v + l * E < Vr) &&
                (r(i, e, o, c, a, l, z, b, j, (_ /= P), (w /= P), R, y, S), S.point(z, b), r(z, b, j, _, w, R, f, s, p, h, v, E, y, S));
            }
          }
          return function (t) {
            var i,
              e,
              o,
              u,
              c,
              a,
              l,
              f,
              s,
              p,
              h,
              g,
              v = {
                point: d,
                lineStart: E,
                lineEnd: S,
                polygonStart: function () {
                  t.polygonStart(), (v.lineStart = m);
                },
                polygonEnd: function () {
                  t.polygonEnd(), (v.lineStart = E);
                }
              };
            function d(r, i) {
              (r = n(r, i)), t.point(r[0], r[1]);
            }
            function E() {
              (f = NaN), (v.point = y), t.lineStart();
            }
            function y(i, e) {
              var o = J([i, e]),
                u = n(i, e);
              r(f, s, l, p, h, g, (f = u[0]), (s = u[1]), (l = i), (p = o[0]), (h = o[1]), (g = o[2]), Qr, t), t.point(f, s);
            }
            function S() {
              (v.point = d), t.lineEnd();
            }
            function m() {
              E(), (v.point = M), (v.lineEnd = x);
            }
            function M(n, t) {
              y((i = n), t), (e = f), (o = s), (u = p), (c = h), (a = g), (v.point = y);
            }
            function x() {
              r(f, s, l, p, h, g, e, o, i, u, c, a, Qr, t), (v.lineEnd = S), S();
            }
            return v;
          };
        })(n, t)
      : (function (n) {
          return Dr({
            point: function (t, r) {
              (t = n(t, r)), this.stream.point(t[0], t[1]);
            }
          });
        })(n);
  }
  var ni = Dr({
    point: function (n, t) {
      this.stream.point(n * h, t * h);
    }
  });
  function ti(n, t, r, i) {
    var e = E(i),
      o = x(i),
      u = e * n,
      c = o * n,
      a = e / n,
      l = o / n,
      f = (o * r - e * t) / n,
      s = (o * t + e * r) / n;
    function p(n, i) {
      return [u * n - c * i + t, r - c * n - u * i];
    }
    return (
      (p.invert = function (n, t) {
        return [a * n - l * t + f, s - l * n - a * t];
      }),
      p
    );
  }
  function ri(n) {
    return ii(function () {
      return n;
    })();
  }
  function ii(n) {
    var t,
      r,
      i,
      e,
      o,
      u,
      c,
      a,
      l,
      f,
      s = 150,
      g = 480,
      v = 250,
      d = 0,
      E = 0,
      y = 0,
      S = 0,
      m = 0,
      M = 0,
      x = null,
      _ = yt,
      w = null,
      R = Xt,
      C = 0.5;
    function P(n) {
      return a(n[0] * h, n[1] * h);
    }
    function A(n) {
      return (n = a.invert(n[0], n[1])) && [n[0] * p, n[1] * p];
    }
    function j() {
      var n = ti(s, 0, 0, M).apply(null, t(d, E)),
        i = (
          M
            ? ti
            : function (n, t, r) {
                function i(i, e) {
                  return [t + n * i, r - n * e];
                }
                return (
                  (i.invert = function (i, e) {
                    return [(i - t) / n, (r - e) / n];
                  }),
                  i
                );
              }
        )(s, g - n[0], v - n[1], M);
      return (r = nt(y, S, m)), (c = Vn(t, i)), (a = Vn(r, c)), (u = $r(c, C)), q();
    }
    function q() {
      return (l = f = null), P;
    }
    return (
      (P.stream = function (n) {
        return l && f === n
          ? l
          : (l = ni(
              (function (n) {
                return Dr({
                  point: function (t, r) {
                    var i = n(t, r);
                    return this.stream.point(i[0], i[1]);
                  }
                });
              })(r)(_(u(R((f = n)))))
            ));
      }),
      (P.preclip = function (n) {
        return arguments.length ? ((_ = n), (x = void 0), q()) : _;
      }),
      (P.postclip = function (n) {
        return arguments.length ? ((R = n), (w = i = e = o = null), q()) : R;
      }),
      (P.clipAngle = function (n) {
        return arguments.length ? ((_ = +n ? St((x = n * h)) : ((x = null), yt)), q()) : x * p;
      }),
      (P.clipExtent = function (n) {
        return arguments.length
          ? ((R = null == n ? ((w = i = e = o = null), Xt) : xt((w = +n[0][0]), (i = +n[0][1]), (e = +n[1][0]), (o = +n[1][1]))), q())
          : null == w
          ? null
          : [
              [w, i],
              [e, o]
            ];
      }),
      (P.scale = function (n) {
        return arguments.length ? ((s = +n), j()) : s;
      }),
      (P.translate = function (n) {
        return arguments.length ? ((g = +n[0]), (v = +n[1]), j()) : [g, v];
      }),
      (P.center = function (n) {
        return arguments.length ? ((d = (n[0] % 360) * h), (E = (n[1] % 360) * h), j()) : [d * p, E * p];
      }),
      (P.rotate = function (n) {
        return arguments.length
          ? ((y = (n[0] % 360) * h), (S = (n[1] % 360) * h), (m = n.length > 2 ? (n[2] % 360) * h : 0), j())
          : [y * p, S * p, m * p];
      }),
      (P.angle = function (n) {
        return arguments.length ? ((M = (n % 360) * h), j()) : M * p;
      }),
      (P.precision = function (n) {
        return arguments.length ? ((u = $r(c, (C = n * n))), q()) : N(C);
      }),
      (P.fitExtent = function (n, t) {
        return Yr(P, n, t);
      }),
      (P.fitSize = function (n, t) {
        return Zr(P, n, t);
      }),
      (P.fitWidth = function (n, t) {
        return Jr(P, n, t);
      }),
      (P.fitHeight = function (n, t) {
        return Kr(P, n, t);
      }),
      function () {
        return (t = n.apply(this, arguments)), (P.invert = t.invert && A), j();
      }
    );
  }
  function ei(n) {
    var t = 0,
      r = a / 3,
      i = ii(n),
      e = i(t, r);
    return (
      (e.parallels = function (n) {
        return arguments.length ? i((t = n[0] * h), (r = n[1] * h)) : [t * p, r * p];
      }),
      e
    );
  }
  function oi(n, t) {
    var r = x(n),
      i = (r + x(t)) / 2;
    if (g(i) < u)
      return (function (n) {
        var t = E(n);
        function r(n, r) {
          return [n * t, x(r) / t];
        }
        return (
          (r.invert = function (n, r) {
            return [n / t, C(r * t)];
          }),
          r
        );
      })(n);
    var e = 1 + r * (2 * i - r),
      o = N(e) / i;
    function c(n, t) {
      var r = N(e - 2 * i * x(t)) / i;
      return [r * x((n *= i)), o - r * E(n)];
    }
    return (
      (c.invert = function (n, t) {
        var r = o - t;
        return [(d(n, g(r)) / i) * _(r), C((e - (n * n + r * r) * i * i) / (2 * i))];
      }),
      c
    );
  }
  function ui() {
    return ei(oi).scale(155.424).center([0, 33.6442]);
  }
  function ci() {
    return ui().parallels([29.5, 45.5]).scale(1070).translate([480, 250]).rotate([96, 0]).center([-0.6, 38.7]);
  }
  function ai(n) {
    return function (t, r) {
      var i = E(t),
        e = E(r),
        o = n(i * e);
      return [o * e * x(t), o * x(r)];
    };
  }
  function li(n) {
    return function (t, r) {
      var i = N(t * t + r * r),
        e = n(i),
        o = x(e),
        u = E(e);
      return [d(t * o, i * u), C(i && (r * o) / i)];
    };
  }
  var fi = ai(function (n) {
    return N(2 / (1 + n));
  });
  fi.invert = li(function (n) {
    return 2 * C(n / 2);
  });
  var si = ai(function (n) {
    return (n = R(n)) && n / x(n);
  });
  function pi(n, t) {
    return [n, m(w((l + t) / 2))];
  }
  function hi(n) {
    var t,
      r,
      i,
      e = ri(n),
      o = e.center,
      u = e.scale,
      c = e.translate,
      l = e.clipExtent,
      f = null;
    function s() {
      var o = a * u(),
        c = e(et(e.rotate()).invert([0, 0]));
      return l(
        null == f
          ? [
              [c[0] - o, c[1] - o],
              [c[0] + o, c[1] + o]
            ]
          : n === pi
          ? [
              [Math.max(c[0] - o, f), t],
              [Math.min(c[0] + o, r), i]
            ]
          : [
              [f, Math.max(c[1] - o, t)],
              [r, Math.min(c[1] + o, i)]
            ]
      );
    }
    return (
      (e.scale = function (n) {
        return arguments.length ? (u(n), s()) : u();
      }),
      (e.translate = function (n) {
        return arguments.length ? (c(n), s()) : c();
      }),
      (e.center = function (n) {
        return arguments.length ? (o(n), s()) : o();
      }),
      (e.clipExtent = function (n) {
        return arguments.length
          ? (null == n ? (f = t = r = i = null) : ((f = +n[0][0]), (t = +n[0][1]), (r = +n[1][0]), (i = +n[1][1])), s())
          : null == f
          ? null
          : [
              [f, t],
              [r, i]
            ];
      }),
      s()
    );
  }
  function gi(n) {
    return w((l + n) / 2);
  }
  function vi(n, t) {
    var r = E(n),
      i = n === t ? x(n) : m(r / E(t)) / m(gi(t) / gi(n)),
      e = (r * M(gi(n), i)) / i;
    if (!i) return pi;
    function o(n, t) {
      e > 0 ? t < -l + u && (t = -l + u) : t > l - u && (t = l - u);
      var r = e / M(gi(t), i);
      return [r * x(i * n), e - r * E(i * n)];
    }
    return (
      (o.invert = function (n, t) {
        var r = e - t,
          o = _(i) * N(n * n + r * r);
        return [(d(n, g(r)) / i) * _(r), 2 * v(M(e / o, 1 / i)) - l];
      }),
      o
    );
  }
  function di(n, t) {
    return [n, t];
  }
  function Ei(n, t) {
    var r = E(n),
      i = n === t ? x(n) : (r - E(t)) / (t - n),
      e = r / i + n;
    if (g(i) < u) return di;
    function o(n, t) {
      var r = e - t,
        o = i * n;
      return [r * x(o), e - r * E(o)];
    }
    return (
      (o.invert = function (n, t) {
        var r = e - t;
        return [(d(n, g(r)) / i) * _(r), e - _(i) * N(n * n + r * r)];
      }),
      o
    );
  }
  (si.invert = li(function (n) {
    return n;
  })),
    (pi.invert = function (n, t) {
      return [n, 2 * v(S(t)) - l];
    }),
    (di.invert = di);
  var yi = 1.340264,
    Si = -0.081106,
    mi = 893e-6,
    Mi = 0.003796,
    xi = N(3) / 2;
  function _i(n, t) {
    var r = C(xi * x(t)),
      i = r * r,
      e = i * i * i;
    return [(n * E(r)) / (xi * (yi + 3 * Si * i + e * (7 * mi + 9 * Mi * i))), r * (yi + Si * i + e * (mi + Mi * i))];
  }
  function Ni(n, t) {
    var r = E(t),
      i = E(n) * r;
    return [(r * x(n)) / i, x(t) / i];
  }
  function wi(n, t, r, i) {
    return 1 === n && 1 === t && 0 === r && 0 === i
      ? Xt
      : Dr({
          point: function (e, o) {
            this.stream.point(e * n + r, o * t + i);
          }
        });
  }
  function Ri(n, t) {
    var r = t * t,
      i = r * r;
    return [
      n * (0.8707 - 0.131979 * r + i * (i * (0.003971 * r - 0.001529 * i) - 0.013791)),
      t * (1.007226 + r * (0.015085 + i * (0.028874 * r - 0.044475 - 0.005916 * i)))
    ];
  }
  function Ci(n, t) {
    return [E(t) * x(n), x(t)];
  }
  function Pi(n, t) {
    var r = E(t),
      i = 1 + E(n) * r;
    return [(r * x(n)) / i, x(t) / i];
  }
  function Ai(n, t) {
    return [m(w((l + t) / 2)), -n];
  }
  (_i.invert = function (n, t) {
    for (
      var r, i = t, e = i * i, o = e * e * e, u = 0;
      u < 12 &&
      ((o = (e = (i -= r = (i * (yi + Si * e + o * (mi + Mi * e)) - t) / (yi + 3 * Si * e + o * (7 * mi + 9 * Mi * e))) * i) * e * e), !(g(r) < c));
      ++u
    );
    return [(xi * n * (yi + 3 * Si * e + o * (7 * mi + 9 * Mi * e))) / E(i), C(x(i) / xi)];
  }),
    (Ni.invert = li(v)),
    (Ri.invert = function (n, t) {
      var r,
        i = t,
        e = 25;
      do {
        var o = i * i,
          c = o * o;
        i -= r =
          (i * (1.007226 + o * (0.015085 + c * (0.028874 * o - 0.044475 - 0.005916 * c))) - t) /
          (1.007226 + o * (0.045255 + c * (0.259866 * o - 0.311325 - 0.005916 * 11 * c)));
      } while (g(r) > u && --e > 0);
      return [n / (0.8707 + (o = i * i) * (o * (o * o * o * (0.003971 - 0.001529 * o) - 0.013791) - 0.131979)), i];
    }),
    (Ci.invert = li(C)),
    (Pi.invert = li(function (n) {
      return 2 * v(n);
    })),
    (Ai.invert = function (n, t) {
      return [-t, 2 * v(S(n)) - l];
    }),
    (n.geoAlbers = ci),
    (n.geoAlbersUsa = function () {
      var n,
        t,
        r,
        i,
        e,
        o,
        c = ci(),
        a = ui().rotate([154, 0]).center([-2, 58.5]).parallels([55, 65]),
        l = ui().rotate([157, 0]).center([-3, 19.9]).parallels([8, 18]),
        f = {
          point: function (n, t) {
            o = [n, t];
          }
        };
      function s(n) {
        var t = n[0],
          u = n[1];
        return (o = null), r.point(t, u), o || (i.point(t, u), o) || (e.point(t, u), o);
      }
      function p() {
        return (n = t = null), s;
      }
      return (
        (s.invert = function (n) {
          var t = c.scale(),
            r = c.translate(),
            i = (n[0] - r[0]) / t,
            e = (n[1] - r[1]) / t;
          return (e >= 0.12 && e < 0.234 && i >= -0.425 && i < -0.214 ? a : e >= 0.166 && e < 0.234 && i >= -0.214 && i < -0.115 ? l : c).invert(n);
        }),
        (s.stream = function (r) {
          return n && t === r
            ? n
            : ((i = [c.stream((t = r)), a.stream(r), l.stream(r)]),
              (e = i.length),
              (n = {
                point: function (n, t) {
                  for (var r = -1; ++r < e; ) i[r].point(n, t);
                },
                sphere: function () {
                  for (var n = -1; ++n < e; ) i[n].sphere();
                },
                lineStart: function () {
                  for (var n = -1; ++n < e; ) i[n].lineStart();
                },
                lineEnd: function () {
                  for (var n = -1; ++n < e; ) i[n].lineEnd();
                },
                polygonStart: function () {
                  for (var n = -1; ++n < e; ) i[n].polygonStart();
                },
                polygonEnd: function () {
                  for (var n = -1; ++n < e; ) i[n].polygonEnd();
                }
              }));
          var i, e;
        }),
        (s.precision = function (n) {
          return arguments.length ? (c.precision(n), a.precision(n), l.precision(n), p()) : c.precision();
        }),
        (s.scale = function (n) {
          return arguments.length ? (c.scale(n), a.scale(0.35 * n), l.scale(n), s.translate(c.translate())) : c.scale();
        }),
        (s.translate = function (n) {
          if (!arguments.length) return c.translate();
          var t = c.scale(),
            o = +n[0],
            s = +n[1];
          return (
            (r = c
              .translate(n)
              .clipExtent([
                [o - 0.455 * t, s - 0.238 * t],
                [o + 0.455 * t, s + 0.238 * t]
              ])
              .stream(f)),
            (i = a
              .translate([o - 0.307 * t, s + 0.201 * t])
              .clipExtent([
                [o - 0.425 * t + u, s + 0.12 * t + u],
                [o - 0.214 * t - u, s + 0.234 * t - u]
              ])
              .stream(f)),
            (e = l
              .translate([o - 0.205 * t, s + 0.212 * t])
              .clipExtent([
                [o - 0.214 * t + u, s + 0.166 * t + u],
                [o - 0.115 * t - u, s + 0.234 * t - u]
              ])
              .stream(f)),
            p()
          );
        }),
        (s.fitExtent = function (n, t) {
          return Yr(s, n, t);
        }),
        (s.fitSize = function (n, t) {
          return Zr(s, n, t);
        }),
        (s.fitWidth = function (n, t) {
          return Jr(s, n, t);
        }),
        (s.fitHeight = function (n, t) {
          return Kr(s, n, t);
        }),
        s.scale(1070)
      );
    }),
    (n.geoArea = function (n) {
      return W.reset(), O(n, B), 2 * W;
    }),
    (n.geoAzimuthalEqualArea = function () {
      return ri(fi).scale(124.75).clipAngle(179.999);
    }),
    (n.geoAzimuthalEqualAreaRaw = fi),
    (n.geoAzimuthalEquidistant = function () {
      return ri(si).scale(79.4188).clipAngle(179.999);
    }),
    (n.geoAzimuthalEquidistantRaw = si),
    (n.geoBounds = function (n) {
      var t, r, i, e, o, u, c;
      if (((on = en = -(tn = rn = 1 / 0)), (fn = []), O(n, An), (r = fn.length))) {
        for (fn.sort(kn), t = 1, o = [(i = fn[0])]; t < r; ++t)
          Fn(i, (e = fn[t])[0]) || Fn(i, e[1])
            ? (Tn(i[0], e[1]) > Tn(i[0], i[1]) && (i[1] = e[1]), Tn(e[0], i[1]) > Tn(i[0], i[1]) && (i[0] = e[0]))
            : o.push((i = e));
        for (u = -1 / 0, t = 0, i = o[(r = o.length - 1)]; t <= r; i = e, ++t)
          (e = o[t]), (c = Tn(i[1], e[0])) > u && ((u = c), (tn = e[0]), (en = i[1]));
      }
      return (
        (fn = sn = null),
        tn === 1 / 0 || rn === 1 / 0
          ? [
              [NaN, NaN],
              [NaN, NaN]
            ]
          : [
              [tn, rn],
              [en, on]
            ]
      );
    }),
    (n.geoCentroid = function (n) {
      (pn = hn = gn = vn = dn = En = yn = Sn = mn = Mn = xn = 0), O(n, Hn);
      var t = mn,
        r = Mn,
        i = xn,
        e = t * t + r * r + i * i;
      return e < c && ((t = En), (r = yn), (i = Sn), hn < u && ((t = gn), (r = vn), (i = dn)), (e = t * t + r * r + i * i) < c)
        ? [NaN, NaN]
        : [d(r, t) * p, C(i / N(e)) * p];
    }),
    (n.geoCircle = function () {
      var n,
        t,
        r = Qn([0, 0]),
        i = Qn(90),
        e = Qn(6),
        o = {
          point: function (r, i) {
            n.push((r = t(r, i))), (r[0] *= p), (r[1] *= p);
          }
        };
      function u() {
        var u = r.apply(this, arguments),
          c = i.apply(this, arguments) * h,
          a = e.apply(this, arguments) * h;
        return (n = []), (t = nt(-u[0] * h, -u[1] * h, 0).invert), ot(o, c, a, 1), (u = { type: 'Polygon', coordinates: [n] }), (n = t = null), u;
      }
      return (
        (u.center = function (n) {
          return arguments.length ? ((r = 'function' == typeof n ? n : Qn([+n[0], +n[1]])), u) : r;
        }),
        (u.radius = function (n) {
          return arguments.length ? ((i = 'function' == typeof n ? n : Qn(+n)), u) : i;
        }),
        (u.precision = function (n) {
          return arguments.length ? ((e = 'function' == typeof n ? n : Qn(+n)), u) : e;
        }),
        u
      );
    }),
    (n.geoClipAntimeridian = yt),
    (n.geoClipCircle = St),
    (n.geoClipExtent = function () {
      var n,
        t,
        r,
        i = 0,
        e = 0,
        o = 960,
        u = 500;
      return (r = {
        stream: function (r) {
          return n && t === r ? n : (n = xt(i, e, o, u)((t = r)));
        },
        extent: function (c) {
          return arguments.length
            ? ((i = +c[0][0]), (e = +c[0][1]), (o = +c[1][0]), (u = +c[1][1]), (n = t = null), r)
            : [
                [i, e],
                [o, u]
              ];
        }
      });
    }),
    (n.geoClipRectangle = xt),
    (n.geoConicConformal = function () {
      return ei(vi).scale(109.5).parallels([30, 30]);
    }),
    (n.geoConicConformalRaw = vi),
    (n.geoConicEqualArea = ui),
    (n.geoConicEqualAreaRaw = oi),
    (n.geoConicEquidistant = function () {
      return ei(Ei).scale(131.154).center([0, 13.9389]);
    }),
    (n.geoConicEquidistantRaw = Ei),
    (n.geoContains = function (n, t) {
      return (n && Ot.hasOwnProperty(n.type) ? Ot[n.type] : Tt)(n, t);
    }),
    (n.geoDistance = Lt),
    (n.geoEqualEarth = function () {
      return ri(_i).scale(177.158);
    }),
    (n.geoEqualEarthRaw = _i),
    (n.geoEquirectangular = function () {
      return ri(di).scale(152.63);
    }),
    (n.geoEquirectangularRaw = di),
    (n.geoGnomonic = function () {
      return ri(Ni).scale(144.049).clipAngle(60);
    }),
    (n.geoGnomonicRaw = Ni),
    (n.geoGraticule = Ut),
    (n.geoGraticule10 = function () {
      return Ut()();
    }),
    (n.geoIdentity = function () {
      var n,
        t,
        r,
        i,
        e,
        o,
        u = 1,
        c = 0,
        a = 0,
        l = 1,
        f = 1,
        s = Xt,
        p = null,
        h = Xt;
      function g() {
        return (i = e = null), o;
      }
      return (o = {
        stream: function (n) {
          return i && e === n ? i : (i = s(h((e = n))));
        },
        postclip: function (i) {
          return arguments.length ? ((h = i), (p = n = t = r = null), g()) : h;
        },
        clipExtent: function (i) {
          return arguments.length
            ? ((h = null == i ? ((p = n = t = r = null), Xt) : xt((p = +i[0][0]), (n = +i[0][1]), (t = +i[1][0]), (r = +i[1][1]))), g())
            : null == p
            ? null
            : [
                [p, n],
                [t, r]
              ];
        },
        scale: function (n) {
          return arguments.length ? ((s = wi((u = +n) * l, u * f, c, a)), g()) : u;
        },
        translate: function (n) {
          return arguments.length ? ((s = wi(u * l, u * f, (c = +n[0]), (a = +n[1]))), g()) : [c, a];
        },
        reflectX: function (n) {
          return arguments.length ? ((s = wi(u * (l = n ? -1 : 1), u * f, c, a)), g()) : l < 0;
        },
        reflectY: function (n) {
          return arguments.length ? ((s = wi(u * l, u * (f = n ? -1 : 1), c, a)), g()) : f < 0;
        },
        fitExtent: function (n, t) {
          return Yr(o, n, t);
        },
        fitSize: function (n, t) {
          return Zr(o, n, t);
        },
        fitWidth: function (n, t) {
          return Jr(o, n, t);
        },
        fitHeight: function (n, t) {
          return Kr(o, n, t);
        }
      });
    }),
    (n.geoInterpolate = function (n, t) {
      var r = n[0] * h,
        i = n[1] * h,
        e = t[0] * h,
        o = t[1] * h,
        u = E(i),
        c = x(i),
        a = E(o),
        l = x(o),
        f = u * E(r),
        s = u * x(r),
        g = a * E(e),
        v = a * x(e),
        y = 2 * C(N(P(o - i) + u * a * P(e - r))),
        S = x(y),
        m = y
          ? function (n) {
              var t = x((n *= y)) / S,
                r = x(y - n) / S,
                i = r * f + t * g,
                e = r * s + t * v,
                o = r * c + t * l;
              return [d(e, i) * p, d(o, N(i * i + e * e)) * p];
            }
          : function () {
              return [r * p, i * p];
            };
      return (m.distance = y), m;
    }),
    (n.geoLength = qt),
    (n.geoMercator = function () {
      return hi(pi).scale(961 / s);
    }),
    (n.geoMercatorRaw = pi),
    (n.geoNaturalEarth1 = function () {
      return ri(Ri).scale(175.295);
    }),
    (n.geoNaturalEarth1Raw = Ri),
    (n.geoOrthographic = function () {
      return ri(Ci)
        .scale(249.5)
        .clipAngle(90 + u);
    }),
    (n.geoOrthographicRaw = Ci),
    (n.geoPath = function (n, t) {
      var r,
        i,
        e = 4.5;
      function o(n) {
        return n && ('function' == typeof e && i.pointRadius(+e.apply(this, arguments)), O(n, r(i))), i.result();
      }
      return (
        (o.area = function (n) {
          return O(n, r($t)), $t.result();
        }),
        (o.measure = function (n) {
          return O(n, r(Fr)), Fr.result();
        }),
        (o.bounds = function (n) {
          return O(n, r(ar)), ar.result();
        }),
        (o.centroid = function (n) {
          return O(n, r(xr)), xr.result();
        }),
        (o.projection = function (t) {
          return arguments.length ? ((r = null == t ? ((n = null), Xt) : (n = t).stream), o) : n;
        }),
        (o.context = function (n) {
          return arguments.length ? ((i = null == n ? ((t = null), new Wr()) : new zr((t = n))), 'function' != typeof e && i.pointRadius(e), o) : t;
        }),
        (o.pointRadius = function (n) {
          return arguments.length ? ((e = 'function' == typeof n ? n : (i.pointRadius(+n), +n)), o) : e;
        }),
        o.projection(n).context(t)
      );
    }),
    (n.geoProjection = ri),
    (n.geoProjectionMutator = ii),
    (n.geoRotation = et),
    (n.geoStereographic = function () {
      return ri(Pi).scale(250).clipAngle(142);
    }),
    (n.geoStereographicRaw = Pi),
    (n.geoStream = O),
    (n.geoTransform = function (n) {
      return { stream: Dr(n) };
    }),
    (n.geoTransverseMercator = function () {
      var n = hi(Ai),
        t = n.center,
        r = n.rotate;
      return (
        (n.center = function (n) {
          return arguments.length ? t([-n[1], n[0]]) : [(n = t())[1], -n[0]];
        }),
        (n.rotate = function (n) {
          return arguments.length ? r([n[0], n[1], n.length > 2 ? n[2] + 90 : 90]) : [(n = r())[0], n[1], n[2] - 90];
        }),
        r([0, 0, 90]).scale(159.155)
      );
    }),
    (n.geoTransverseMercatorRaw = Ai),
    Object.defineProperty(n, '__esModule', { value: !0 });
});
