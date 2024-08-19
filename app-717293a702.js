function IdLuckyDrawController(n, t, e, a, i, o, s, r, c) {
  var u = this;
  (u.$onInit = function () {
    if (
      ((u.appState = n.current),
      (u.ankey = "presentation" == u.appState.name ? "iddraw_pres" : "iddraw_home"),
      (u.defaultSetting = a),
      (u.prizes = o.load(u.setting, !0)),
      (u.user = s),
      u.user.checkin(),
      (u.ux = r),
      (u.animClass = {}),
      (u.ids = []),
      (u.selectedIds = []),
      (u.names = []),
      (u.idChars = []),
      (u.longestIdLen = 3),
      (u.structured = { nan: [] }),
      angular.forEach(u.data.ids, function (n, t) {
        n = String(n).replace(/\s+/g, "");
        var e = "nan",
          a = n.match(/^(.*)\*(x|diamond|gold|silver|bronze|p[0-9]+)$/i);
        if ((a && 3 === a.length && ((n = a[1]), (e = a[2]), u.structured[e] || (u.structured[e] = [])), !(u.ids.indexOf(n) >= 0))) {
          n.length > u.longestIdLen && (u.longestIdLen = n.length), (u.idChars = _.uniq(_.concat(u.idChars, n.split("")))), u.ids.push(n);
          var i = "";
          u.data.names && (i = u.data.names[t] || ""), u.names.push(i.trim()), u.structured[e].push(u.ids.length - 1);
        }
      }),
      u.idChars.length < 9)
    )
      for (var t = 0; t < i.checkChars.length; t++) {
        var e = new RegExp(i.checkChars[t].regexp);
        u.idChars[0].match(e) && ((u.idChars = _.uniq(_.concat(u.idChars, i.checkChars[t].chars.split("")))), (t = i.checkChars.length));
      }
    var d = {};
    (u.totalResults = 0),
      angular.forEach(u.results, function (n, t) {
        (d[t] = 0),
          angular.forEach(n, function (n) {
            u.selectedIds.push(n.id), "Rejected" !== n.status && d[t]++, u.totalResults++;
            var e = u.ids.indexOf(n.id);
            for (var a in u.structured) {
              var i = u.structured[a].indexOf(e);
              i !== -1 && u.structured[a].splice(i, 1);
            }
          });
      });
    for (var t = 0; t < u.prizes.length; t++) {
      var g = u.prizes[t].key;
      d[g] && (u.prizes[t].confirmed = d[g]);
    }
    (u.machineSlots = _.range(0, u.longestIdLen)), (u.slotsCss = i.slotsCss(u.longestIdLen)), c.init(u.longestIdLen), (u.characters = []), (u.machines = []), (u.state = i.states.ready);
  }),
    (u.setPrize = function (n) {
      if (u.state === i.states.ready) {
        if (n < 0 || n >= u.prizes.length) return void c.play("na");
        (u.state = i.states.setprize),
          u.prizeIndex >= 0 && (c.play("setPrize"), c.stop("turnonSlots"), c.stop("actionButtons")),
          u.ux.mLeave("prevnext"),
          n < u.prizeIndex ? (u.animClass.setprize = "prize-prev") : u.prizeIndex >= 0 && (u.animClass.setprize = "prize-next"),
          (o.currentTab = n),
          (u.prizeIndex = n),
          (u.prize = u.prizes[n]);
        var e = u.structured[u.prize.key];
        if (e && e.length) for (var a = 0; a < e.length; a++) u.selectedIds.indexOf(u.ids[e[a]]) !== -1 && (e.splice(a, 1), a--);
        t(function () {
          c.play("turnonSlots", 150), (u.animClass.setprize = null), (u.state = i.states.ready), c.play("actionButtons", 1e3), c.stop("setPrize");
        }, i.timeout.ready),
          u.animClass.setprize;
      }
    }),
    (u.setPrevPrize = function () {
      u.setPrize(u.prizeIndex - 1);
    }),
    (u.setNextPrize = function () {
      u.setPrize(u.prizeIndex + 1);
    }),
    (u.createMachines = function (n) {
      if (!u.machines || !u.machines.length) {
        u.characters = [];
        for (var e = 0; e < u.longestIdLen; e++) {
          var a = _.shuffle(u.idChars).map(function (n) {
            return String(n);
          });
          a.unshift(" "), u.characters.push(a);
        }
        t(function () {
          (u.machines = []),
            (u.machinesDelay = []),
            $(".slots .slot").each(function (t, e) {
              (u.machinesDelay[t] = _.random(i.mdelay.min, i.mdelay.max)),
                (u.machines[t] = $(e).slotMachine({ active: u.characters[t].indexOf(i.favNum), delay: u.machinesDelay[t], direction: i.spinDirection })),
                n && (u.machines[t].shuffle(), c.play("spinHigh" + t, 144 * t + 233, "loop"));
            });
        });
      }
    }),
    (u.shuffleMachines = function () {
      angular.forEach(u.machines, function (n, t) {
        n.shuffle(), c.play("spinHigh" + t, 144 * t + 233, "loop");
      });
    }),
    (u.destroyMachines = function () {
      angular.forEach(u.machines, function (n, t) {
        n.stop(), n.destroy();
      }),
        (u.machines = null),
        (u.characters = null);
    }),
    (u.startstop = function () {
      var n, t;
      u.state == i.states.ready
        ? u.spin()
        : u.state == i.states.spin &&
          (u.setting.prizes[u.prize.key]
            ? (n = u.setting.prizes[u.prize.key].match(/\([xX][0-9]+\)$/g))
            : "presentation" !== u.appState.name && u.defaultSetting.prizes[u.prize.key] && (n = u.defaultSetting.prizes[u.prize.key].match(/\([xX][0-9]+\)$/g)),
          (t = n ? parseInt(n[0].substr(2).slice(0, -1)) : 0),
          t > 1 ? u.stopBatch(t) : u.stop());
    }),
    (u.spin = function () {
      if (!m() && u.state === i.states.ready) {
        var n = u.structured[u.prize.key] && u.structured[u.prize.key].length;
        if (((u.prize.skey = n ? u.prize.key : "nan"), !n && !u.structured.nan.length)) return void e.alert("", "Everybody Win!");
        (u.state = i.states.tospin),
          c.play("start"),
          c.pause("background"),
          c.play("spinHigh", 0, "loop"),
          u.ux.mLeave("spin"),
          (u.iAIDs = u.id = u.name = null),
          u.machines && u.machines.length ? u.shuffleMachines() : u.createMachines(!0),
          "presentation" == u.appState.name && (u.lightOff = !0),
          t(function () {
            (u.state = i.states.spin), c.play("onGoing");
          }, i.timeout.spin);
      }
    });
  var d = function () {
    for (var n; !n; ) {
      var t = u.structured[u.prize.skey].length;
      t || ((u.prize.skey = "nan"), (t = u.structured[u.prize.skey].length)), (u.structured[u.prize.skey] = _.shuffle(u.structured[u.prize.skey]));
      var e = new Date(),
        a = e.getSeconds(),
        o = _.random(0, t * a) % t,
        s = u.structured[u.prize.skey][o];
      (u.iAIDs = o), (u.id = u.ids[s]), u.selectedIds.indexOf(u.id) >= 0 ? u.structured[u.prize.skey].splice(o, 1) : (n = !0);
    }
    (u.name = u.names && u.names[s] ? u.names[s] : ""),
      (u.namex = u.name.replace("|", "<br/>")),
      u.selectedIds.push(u.id),
      i.specialPrizes.indexOf(u.prize.key) == -1 ? (u.remainStops = 1) : (u.remainStops = 2);
  };
  (u.stopBatch = function (n) {
    if (u.state === i.states.spin) {
      (u.state = i.states.stop), c.play("stop"), u.ux.mLeave("stop");
      var a;
      a = 250 * n > 3e4 ? Math.round(3e4 / n) : 1e4 / n > 2e3 ? 2e3 : 250;
      for (var o = 0; o < n; o++)
        t(function () {
          var n = u.structured[u.prize.skey].length;
          if (n) {
            var t = new Date(),
              e = t.getSeconds(),
              a = _.random(0, n * e) % n,
              i = u.structured[u.prize.skey][a],
              o = a,
              s = u.ids[i],
              r = u.names && u.names[i] ? u.names[i] : "";
            u.selectedIds.push(s), u.prizes[u.prizeIndex].confirmed++, (u.animClass.prizecount = "prize-increase"), c.play("prizeIncreased");
            var l = { name: r || null, id: s, time: "", status: "Confirmed" };
            "presentation" === u.appState.name
              ? ((l.time = firebase.database.ServerValue.TIMESTAMP), u.results.$ref().child(u.prize.key).push(l))
              : ((l.time = Date.now()), u.results[u.prize.key].push(l)),
              u.totalResults++,
              u.structured[u.prize.skey].splice(o, 1);
          }
        }, o * a + 500);
      var s = 600;
      (s += a >= 1e3 ? (n - 1) * a : n * a),
        t(function () {
          angular.forEach(u.machines, function (n, t) {
            n.stop(), c.stop("spinHigh" + t, u.machinesDelay[t] + 800), t === u.longestIdLen - 1 && c.stop("spinHigh", u.machinesDelay[t]);
          }),
            (u.animClass.message = null),
            (u.animClass.prizecount = null),
            (u.lightOff = !1),
            (u.state = i.states.ready),
            e.open("IdResult");
        }, s);
    }
  }),
    (u.stop = function () {
      if (u.state === i.states.spin) {
        (u.state = i.states.stop), c.play("stop"), u.ux.mLeave("stop"), u.id || d(), u.remainStops--;
        var n = _.padStart(u.id, u.longestIdLen);
        if (
          (angular.forEach(u.machines, function (t, e) {
            e < u.longestIdLen - u.remainStops &&
              t.running &&
              (t.setRandomize(function () {
                return u.characters[e].indexOf(n[e]);
              }),
              t.stop(),
              c.stop("spinHigh" + e, u.machinesDelay[e] + 800),
              e === u.longestIdLen - 1 && c.stop("spinHigh", u.machinesDelay[e]));
          }),
          u.remainStops > 0)
        )
          t(function () {
            (u.state = i.states.spin), c.play("onGoing");
          }, i.timeout.spin + 900);
        else {
          var e = i.specialPrizes.indexOf(u.prize.key) == -1 ? "" : "High";
          if (u.name) {
            t(function () {
              (u.state = i.states.reveal), c.play("comingWinner" + e, 0, "loop");
            }, i.timeout.revealLoading);
            var a = i.timeout["revealName" + e];
          } else var a = i.timeout.revealId;
          t(function () {
            (u.animClass.message = "winner-reveal"), (u.state = i.states.complete), c.stop("comingWinner" + e), c.play("tada" + e), c.play("actionButtons", 1500);
          }, a);
        }
      }
    }),
    (u.save = function () {
      u.state === i.states.complete &&
        (u.ux.mLeave("confirm"),
        (u.state = i.states.toconfirm),
        i.specialPrizes.indexOf(u.prize.key) >= 0 ? c.play("confirmSpecial") : c.play("confirm"),
        (u.animClass.message = "winner-confirm"),
        t(function () {
          u.prizes[u.prizeIndex].confirmed++, (u.state = i.states.confirmed), (u.animClass.prizecount = "prize-increase"), c.play("prizeIncreased");
        }, i.timeout.confirmed),
        g("Confirmed"),
        t(function () {
          (u.state = i.states["null"]),
            (u.animClass.message = null),
            (u.animClass.prizecount = null),
            c.play("turnoffSlots", 350),
            t(function () {
              (u.lightOff = !1), (u.state = i.states.ready), c.play("turnonSlots", 150), c.play("actionButtons", 1100), c.play("background", 2e3, "loop");
            }, 1e3);
        }, 1500));
    }),
    (u.retry = function () {
      u.state === i.states.complete &&
        (u.ux.mLeave("confirm"),
        (u.state = i.states.cancel),
        c.play("retry"),
        (u.animClass.message = "winner-cancel"),
        t(function () {
          (u.state = i.states["null"]),
            (u.animClass.message = null),
            (u.animClass.prizecount = null),
            c.play("turnoffSlots", 350),
            t(function () {
              (u.lightOff = !1), (u.state = i.states.ready), c.play("turnonSlots", 150), c.play("actionButtons", 1100), c.play("background", 2e3, "loop");
            }, 1e3);
        }, 500));
    });
  var g = function (n) {
      var t = { name: u.name || null, id: u.id, time: "", status: n };
      "presentation" === u.appState.name ? ((t.time = firebase.database.ServerValue.TIMESTAMP), u.results.$ref().child(u.prize.key).push(t)) : ((t.time = Date.now()), u.results[u.prize.key].push(t)),
        "Confirmed" === n && u.totalResults++,
        u.structured[u.prize.skey].splice(u.iAIDs, 1);
    },
    m = function () {
      return !!u.isLimited({ r: u.totalResults }) && (c.play("na"), e.open("Payment", !0, !0), !0);
    };
  u.$onDestroy = function () {
    u.destroyMachines(), c.stop("background");
  };
}

function MainController(n, t, e, a, i, o, s, r, l, c, u, d, g) {
  function m() {}
  var p = this;
  p.$onInit = function () {
    (p.data = r()), (p.setting = l), (p.results = c), u.setLang(), (n.theme = d.getRuntimeOpt("theme", null)), (n.background = ""), g.log("visit_home"), m();
  };
}
function routesConfig(n, t, e, a) {
  e.html5Mode(!0).hashPrefix("!"), t.otherwise("/"), n.state("app", { url: "/", templateUrl: "templates/main.html", controller: "MainController", controllerAs: "$ctrl", resolve: {} });
}
(routesConfig.$inject = ["$stateProvider", "$urlRouterProvider", "$locationProvider", "$modalStateProvider"]),
  (IdLuckyDrawController.$inject = ["$state", "$timeout", "modalService", "defaultSettingService", "devOps", "prizeService", "userService", "uxService", "audioService"]),
  (MainController.$inject = [
    "$rootScope",
    "$http",
    "$location",
    "$translate",
    "paymentService",
    "modalService",
    "defaultSettingService",
    "defaultIdService",
    "initSettingService",
    "defaultResultService",
    "i18nService",
    "userdataService",
    "Analytics",
  ]),
  angular
    .module("app", [
      "ui.router",
      "ui.bootstrap",
      "firebase",
      "pascalprecht.translate",
      "angularMoment",
      "FBAngular",
      "ngSanitize",
      "ngCookies",
      "ngAnimate",
      "ngFileUpload",
      "ngSanitize",
      "ngCsv",
      "cfp.hotkeys",
      "angular.filter",
      "color.picker",
    ])
    .config([
      "$qProvider",
      "$translateProvider",
      function (n, t) {
        var e = {
          apiKey: "AIzaSyATfmr6y4QBfiTaeWo-K8Bkb9lNpdMzJYU",
          authDomain: "luckydraw-fd117.firebaseapp.com",
          databaseURL: "https://luckydraw-fd117.firebaseio.com",
          storageBucket: "luckydraw-fd117.appspot.com",
          messagingSenderId: "537953130117",
        };
        firebase.initializeApp(e), n.errorOnUnhandledRejections(!1), t.translations("en", i18n_en), t.translations("vi", i18n_vi), t.preferredLanguage("en"), t.useLocalStorage();
      },
    ])
    .run(["$rootScope", "$state", "Fullscreen", function (n, t, e) {}]),
  (function (n, t, e, a) {
    function i() {
      var n = e.getElementById("viewportMeta");
      screen.width < 768 ? n.setAttribute("content", "width=device-width, user-scalable=no") : n.setAttribute("content", "width=1280, initial-scale=1.0");
    }
    n(t), n(e);
    i(), t.addEventListener("resize", i, !1);
  })(jQuery, window, document),
  angular.module("app").factory("uxService", [
    "$firebaseObject",
    "$timeout",
    "firebaseRef",
    "initSettingService",
    "authService",
    "devOps",
    "modalService",
    "$q",
    "Analytics",
    function (n, t, e, a, i, o, s, r, l) {
      var c = { prevnext: !1, spin: !1, stop: !1, confirm: !1, IdResult: !1, pres: !1 },
        u = { infologo: "", infoname: "", colorsname: "", infocompany: "", prizes: "", dataids: "", messages: "", colorsaction_msg: "", buttons: "" },
        d = function (n) {
          c[n] = !0;
        },
        g = function (n) {
          c[n] = !1;
        },
        m = function (n) {
          setTimeout(function () {
            $(n).focus();
          }, 200);
        },
        p = function (n) {
          var e = "";
          angular.copy({}, u),
            void 0 === n.runtime.longestIdLen
              ? (e = "dataids")
              : void 0 === n.info.background
              ? (e = "infobackground")
              : void 0 === n.runtime.theme
              ? (e = "runtimetheme")
              : Object.keys(n.icons).length <= 1 && (e = "prizes"),
            e &&
              t(function () {
                u[e] = "look-at-me";
              });
        },
        h = function (n, t) {
          if (!n) return {};
          var e = { color: n, "text-shadow": t ? f(n) + " 1px 1px 1px" : "" };
          return e;
        },
        f = function (n) {
          var t = parseInt(n.substr(1, 2), 16),
            e = parseInt(n.substr(3, 2), 16),
            a = parseInt(n.substr(5, 2), 16),
            i = (299 * t + 587 * e + 114 * a) / 1e3;
          return i >= 128 ? "black" : "white";
        };
      return { hint: c, mOver: d, mLeave: g, focus: m, cssIntro: u, setcssIntro: p, style: h };
    },
  ]),
  angular
    .module("app")
    .factory("userdataService", [
      "$firebaseObject",
      "firebaseRef",
      "initSettingService",
      "authService",
      "devOps",
      "modalService",
      "uxService",
      "$q",
      "Analytics",
      function (n, t, e, a, i, o, s, r, l) {
        var c = { guest: {}, member: {} },
          u = {},
          d = a,
          g = function () {
            (c.member.setting = n(t().child("setting"))), (c.member.membership = n(t().child("member"))), (c.member.data = n(t().child("idDraw")));
          },
          m = function () {
            (c.guest.setting = {}), (c.guest.membership = {}), (c.guest.data = { ids: [], names: [] }), angular.copy(e, c.guest.setting);
          },
          p = function () {
            for (var n in e) void 0 === c.member.setting[n] && (c.member.setting[n] = e[n]);
          },
          h = function () {
            return r(function (n, t) {
              void 0 === c.member.data && g();
              var e = Object.keys(c.member),
                a = "",
                i = -1;
              for (var o in c.member)
                "setting" == o && (a = "setting"),
                  c.member[o].$loaded().then(function () {
                    i++, "setting" == a && p(), i == e.length - 1 && n(i);
                  });
            });
          };
        m(),
          d.$getAuth() && (g(), h()),
          d.$onAuthStateChanged(function (n) {
            n && void 0 === c.member.data && (g(), h());
          });
        var f = function (n, t) {
            return r(function (e, a) {
              return c.member[n]
                ? void c.member[n]
                    .$save()
                    .then(function () {
                      t && (u[t] = !1), s.setcssIntro(c.member.setting), e(!0);
                    })
                    ["catch"](function (e) {
                      a(!1);
                    })
                : void a(void 0);
            });
          },
          y = function (n, t) {
            if (c.member.setting) return !!c.member.setting[n] && ((u[n + t] = !0), (c.member.setting[n][t] = null), f("setting", n + t), !0);
          },
          v = function (n, t, e, a) {
            return r(function (i, r) {
              if (!o.isOnLine("alert", "data") || !o.isAuthenticated("login", t)) return void r(!1);
              if (u[e + a]) return void r("already uploading this item");
              if (!c.member.setting) return void r(void 0);
              u[e + a] = !0;
              var g = firebase
                  .storage()
                  .ref()
                  .child(e + "/" + a)
                  .child(d.$getAuth().uid),
                m = g.put(n, {});
              m.on(
                "state_changed",
                function (n) {
                  var t = (n.bytesTransferred / n.totalBytes) * 100;
                  console.debug("Upload is " + t + "% done");
                },
                function (n) {
                  (u[e + a] = !1), r("upload failed");
                },
                function () {
                  var n = m.snapshot.metadata,
                    t = n.downloadURLs[0];
                  c.member.setting[e] || (c.member.setting[e] = {}),
                    (c.member.setting[e][a] = t),
                    c.member.setting
                      .$save()
                      .then(function () {
                        (u[e + a] = !1), s.setcssIntro(c.member.setting), i(t);
                      })
                      ["catch"](function (n) {
                        (u[e + a] = !1), r("save failed");
                      });
                }
              );
            });
          },
          b = function (n, t) {
            var e = localStorage.getItem("setting.runtime." + n) || t || i.runtime[n];
            return c.member.setting && c.member.setting.runtime ? c.member.setting.runtime[n] || e : e;
          },
          w = function (n, t) {
            localStorage.setItem("setting.runtime." + n, t), c.member.setting && c.member.setting.runtime && ((c.member.setting.runtime[n] = t), f("setting", n));
          },
          $ = function (n, t) {
            var e = Date.now();
            if (c.member.membership && c.member.membership.lastPayment) var a = e < c.member.membership.expiration ? "Paid Account" : "Expired Account";
            else var a = "Free Account";
            return "presentation" === n && t >= i.freeSaves && "Paid Account" !== a ? "limited" : a;
          };
        return { guest: c.guest, member: c.member, status: $, load: h, save: f, editing: u, upload: v, remove: y, getRuntimeOpt: b, setRuntimeOpt: w };
      },
    ])
    .factory("userService", [
      "authService",
      "firebaseRef",
      "devOps",
      "Analytics",
      "$uibModal",
      "$window",
      "$rootScope",
      function (n, t, e, a, i, o, s) {
        function r() {
          var n = function () {
            return ((65536 * (1 + Math.random())) | 0).toString(16).substring(1);
          };
          return n() + n() + "-" + n() + "-" + n() + "-" + n() + "-" + n() + n() + n();
        }
        var l = { authenticated: !1, email: "", uid: "" },
          c = {},
          u = n;
        (l.logout = function () {
          $("#loader").show(),
            c.multipleLogin || c.ref.set({ signature: null }),
            setTimeout(function () {
              u.$signOut().then(function () {
                o.location.href = o.location.origin;
              });
            }, 500);
        }),
          (l.checkin = function () {
            c.signature || ((c.signature = localStorage.getItem("client.signature") || r()), localStorage.setItem("client.signature", c.signature)),
              l.authenticated &&
                !c.multipleLogin &&
                (c.ref || (c.ref = t().child("client")),
                c.ref.once("value").then(function (n) {
                  var t = n.val();
                  if (!t || !t.signature || t.signature === c.signature || Date.now() - t.moment > e.loginTimeout)
                    (c.multipleLogin = !1), c.ref.set({ signature: c.signature, moment: Date.now() }), c.setonDisconnect || ((c.setonDisconnect = !0), c.ref.onDisconnect().set({ signature: null }));
                  else {
                    (c.multipleLogin = !0), a.log("misused", "Multiple Devices Login");
                    var o = {
                      component: "modalAlert",
                      size: "account-info",
                      backdrop: "static",
                      keyboard: !1,
                      animation: !1,
                      windowClass: "animation-modal-x",
                      resolve: {
                        title: function () {
                          return "Account is being used";
                        },
                        message: function () {
                          return "Someone logged-in somewhere!";
                        },
                        dismissLogout: function () {
                          return !0;
                        },
                      },
                    };
                    i.open(o),
                      setTimeout(function () {
                        l.logout();
                      }, 11e3);
                  }
                }));
          });
        var d = u.$getAuth();
        return (
          d && ((l.authenticated = !0), (l.email = d.email), (l.uid = d.uid), l.checkin()),
          u.$onAuthStateChanged(function (n) {
            s.$apply(function () {
              n ? ((d = u.$getAuth()), (l.authenticated = !0), (l.email = d.email), (l.uid = d.uid), l.checkin()) : (l.authenticated = !1);
            });
          }),
          l
        );
      },
    ]),
  angular
    .module("app")
    .factory("devOps", function () {
      var n = {};
      return (
        (n.version = "1.5015"),
        (n.domain = "luckydraw"),
        (n.sitename = "LuckyDraw"),
        (n.runtime = { theme: "purple", language: "en", audioMode: 0 }),
        (n.max_prizes = 23),
        (n.specialPrizes = ["gold", "diamond", "x"]),
        (n.defaultPrizes = ["bronze", "silver", "gold", "diamond", "x"]),
        (n.maxLengthId = 23),
        (n.spinDirection = "down"),
        (n.favNum = "9"),
        (n.freeSpins = 2),
        (n.freeSaves = 1),
        (n.cssSlotRanges = [6, 9, 11, 16]),
        (n.loginTimeout = 36e5),
        (n.slotsCss = function (t) {
          for (var e = n.cssSlotRanges, a = 0; a < e.length; a++) if (t <= e[a]) return e[a];
          return e[a - 1];
        }),
        (n.states = {
          setprize: "setprize",
          ready: "ready",
          tospin: "tospin",
          spin: "spin",
          stop: "stop",
          reveal: "reveal",
          complete: "complete",
          toconfirm: "toconfirm",
          confirmed: "confirmed",
          cancel: "cancel",
          null: "null",
        }),
        (n.mdelay = { min: 600, max: 1100 }),
        (n.timeout = { ready: 1e3, spin: 1e3, revealLoading: 1800, revealName: 3300, revealNameHigh: 4500, revealId: 1e3, confirmed: 800 }),
        (n.checkChars = [
          { chars: "0123456789", regexp: "[0-9]" },
          { chars: "bdfhnprtyz", regexp: "[a-z]" },
          { chars: "ABFGHKNSVX", regexp: "[A-Z]" },
          { chars: "~@#$%&*+-=", regexp: "\\W" },
        ]),
        (n.colorPickerOp = function (n) {
          return { pos: n || "bottom right", format: "hex", alpha: !1, swatchOnly: !0, close: { show: !0, label: "Ok", class: "" }, clear: { show: !0, label: "Reset", class: "" } };
        }),
        (n.themes = {
          purple: "Theme Purple",
          navy: "Theme Navy",
          olive: "Theme Olive",
          orange: "Theme Orange",
          black: "Theme Black",
          blue: "Theme Blue",
          green: "Theme Green",
          red: "Theme Red",
          silver: "Theme Silver",
          aqua: "Theme Aqua",
          yellow: "Theme Yellow",
          white: "Theme White",
        }),
        (n.api = {
          contact: "",
          welcome: "",
          ipinfo: "",
        }),
        (n.audioIcons = ["ion-ios-musical-notes", "ion-ios-musical-note", "ion-volume-mute"]),
        n
      );
    })
    .factory("settingService", [
      "$firebaseObject",
      "initSettingService",
      "firebaseRef",
      function (n, t, e) {
        var a = t;
        n.$extend({ $$defaults: a });
        return new n(e().child("setting"));
      },
    ])
    .factory("initSettingService", function () {
      return { audio: { spin: { i: 1 } }, info: { i: 1 }, icons: { i: 1 }, colors: { i: 1 }, prizes: { i: 1 }, enabled_prizes: { i: 1 }, messages: { i: 1 }, buttons: { i: 1 }, runtime: { i: 1 } };
    })
    .factory("defaultSettingService", [
      "devOps",
      function (n) {
        for (
          var t,
            e = {
              owner: "guest",
              audio: {
                background: "/audio/v1/background.mp3",
                spin: { High: "/audio/v1/sm-roller-loop.mp3" },
                setPrize: "/audio/v1/swoosh.mp3",
                turnoffSlots: "/audio/v1/sm-turnoff.mp3",
                turnonSlots: "/audio/v1/sm-turnon.mp3",
                start: "/audio/v1/sm-spin.mp3",
                stop: "/audio/v1/sm-bet.mp3",
                onGoing: "/audio/v1/game-bonus.mp3",
                comingWinner: "/audio/v1/game-countdown.mp3",
                comingWinnerHigh: "/audio/v1/game-sm-jackpot-coming.mp3",
                tada: "/audio/v1/game-tada.mp3",
                tadaHigh: "/audio/v1/game-sm-jackpot-win.mp3",
                confirm: "/audio/v1/fanfare-winner.mp3",
                confirmSpecial: "/audio/v1/fanfare-brass.mp3",
                prizeIncreased: "/audio/v1/game-levelup-s3.mp3",
                retry: "/audio/v1/game-over.mp3",
                na: "/audio/v1/game-click-s2.mp3",
                actionButtons: "/audio/v1/game-correct-s2.mp3",
                batchStart: "/audio/v1/sm-autoplay.mp3",
              },
              info: { background: "", logo: "", name: "Amazing Event", company: "" },
              icons: {
                default: "/images/temp/custom-prize.svg",
                x: "/images/temp/x-prize.svg",
                diamond: "/images/temp/diamond-prize.svg",
                gold: "/images/temp/gold-prize.svg",
                silver: "/images/temp/silver-prize.svg",
                bronze: "./images/bronze-prize.svg",
              },
              iconsWithoutBackground: {
                default: "/images/temp/custom-icon.svg",
                x: "/images/temp/x-icon.svg",
                diamond: "/images/temp/diamond-icon.svg",
                gold: "/images/temp/gold-icon.svg",
                silver: "/images/temp/silver-icon.svg",
                bronze: "/images/temp/bronze-icon.svg",
              },
              colors: { name: "", action_msg: "" },
              prizes: { x: "X Prize", diamond: "Diamond Prize", gold: "Gold Prize", silver: "Silver Prize", bronze: "Bronze Prize" },
              enabled_prizes: { x: !0, diamond: !0, gold: !0, silver: !0, bronze: !0 },
              messages: { start: "Press the Spin button to start", wait: "Winner is coming..." },
              buttons: { spin: "Spin", stop: "Stop", confirm: "Confirm", retry: "Retry" },
              runtime: {},
            },
            a = 4;
          a <= n.max_prizes;
          a++
        )
          (t = "p" + a), (e.prizes[t] = "Prize " + a), (e.enabled_prizes[t] = !1);
        return e;
      },
    ]),
  angular
    .module("app")
    .factory("defaultResultService", [
      "devOps",
      function (n) {
        for (var t = {}, e = n.defaultPrizes.length - 1; e >= 0; e--) t[n.defaultPrizes[e]] = [];
        return t;
      },
    ])
    .factory("resultService", [
      "$firebaseObject",
      "$firebaseArray",
      "firebaseRef",
      "defaultResultService",
      function (n, t, e, a) {
        var i = {},
          o = {},
          s = function (s, r, l) {
            switch (s) {
              case "presentation":
                return (
                  i.presentation || (r ? (i.presentation = e().child("idDrawResults").child(r)) : (i.presentation = e().child("idDrawResults").push()), (o.presentation = n(i.presentation))),
                  "array" === l ? [o.presentation] : o.presentation
                );
              case "customize":
                return i.customize || ((i.customize = e().child("idDrawResults")), (o.customize = t(i.customize.orderByKey()))), o.customize;
              default:
                return [a];
            }
          },
          r = function (n, t) {
            i.customize.child(n).set({});
          };
        return { load: s, clear: r };
      },
    ])
    .factory("prizeService", [
      "defaultSettingService",
      "devOps",
      function (n, t) {
        var e = { guest: [], user: [], default: [] },
          a = function (a, i) {
            var o = 9999 === i;
            if (o) var s = "default";
            else var s = "guest" === a.owner ? "guest" : "user";
            if (e[s].length > 0 && !i) return e[s];
            e[s] = [];
            for (var r, l, c, u, d, g = Object.keys(n.prizes), m = t.defaultPrizes.length - 1, p = 0; p < g.length; p++)
              if (((r = g[p]), (u = d = !1), p <= m ? ((u = a.enabled_prizes[r] !== !1), o && u && (a.enabled_prizes[r] = !0)) : (d = a.enabled_prizes[r] === !0), o || u || d)) {
                if (((c = !0), !o && a.icons && a.icons[r])) l = a.icons[r];
                else {
                  var h = o ? "iconsWithoutBackground" : "icons";
                  (l = n[h][r] || n[h]["default"]), (c = p <= m);
                }
                e[s].unshift({ key: r, name: n.prizes[r], image: l, showimage: c, confirmed: 0 });
              }
            return e[s];
          },
          i = function (n) {
            for (var e = 0; e < t.defaultPrizes.length; e++) n[t.defaultPrizes[e]] = !0;
          };
        return { load: a, enable_default: i, currentTab: 0 };
      },
    ]),
  angular.module("app").factory("paymentService", [
    "$translate",
    "$window",
    function (n, t) {
      var e = {
          paypal: {
            url: "https://www.paypal.com/cgi-bin/webscr",
            prices: { event1day: 80, event3days: 150, event5days: 200 },
            buttons: { event1day: "69PXXC753L4R6", event3days: "L3LX5AGBBVMTS", event5days: "VTGTC3KMK7ECC" },
          },
          soha: {
            url: "https://b2m6exn2df.execute-api.ap-southeast-1.amazonaws.com/prod/initSoha",
            ipn: "https://b2m6exn2df.execute-api.ap-southeast-1.amazonaws.com/prod/ipnSoha",
            prices: { event1day: 19e5, event3days: 35e5, event5days: 46e5 },
            ps: "1Pay",
          },
        },
        a = { en: "paypal", vi: "paypal" },
        i = function (n) {
          n ? $('<div class="paypal-loading"></div>').appendTo("body") : $("div.paypal-loading").remove();
        },
        o = { event1day: 30, event3days: 6, event5days: 9 };
      return { provider: e, local: a, loadingIcon: i, times: o };
    },
  ]),
  angular.module("app").factory("navService", ["$state", "$stateParams", "$window", "Fullscreen", "modalService", "Analytics", function (n, t, e, a, i, o) {}]),
  angular.module("app").factory("modalService", [
    "$uibModal",
    "$state",
    "userService",
    "Analytics",
    function (n, t, e, a) {
      var i,
        o = {},
        s = e,
        r = function () {
          return i ? (u("*", !0), R(i, !0), (i = null), !0) : (u("Login", !0), u("Register", !0), !1);
        },
        l = function (n, t) {
          if (navigator.onLine) return !0;
          if ("alert" === n) {
            var e;
            switch (t) {
              case "data":
                e = "Not Editable When Disconnected";
                break;
              case "function":
                e = "Not Doable When Disconnected";
                break;
              default:
                e = "Disconnected";
            }
            h("", e);
          }
          return !1;
        },
        c = function (n, t) {
          return !!s.authenticated || ("login" === n ? ((i = t), S()) : "register" === n && ((i = t), D()), !1);
        },
        u = function (n, t) {
          g("dismiss", n), t || a.log("modals", "Dismiss", n);
        },
        d = function (n, t) {
          g("close", n), t || a.log("modals", "Close", n);
        },
        g = function (n, t) {
          var e, a;
          a = "*" === t ? Object.keys(o) : [t];
          for (var i in a) (e = a[i]), o[e] && "function" == typeof o[e][n] && o[e][n](), (o[e] = null);
        },
        m = function (t, e, a) {
          return e && u("*", !0), (t.animation = !1), (t.windowClass = "animation-modal-x"), a && ((t.backdrop = "static"), (t.keyboard = !1)), n.open(t);
        },
        p = function () {
          if (!l("alert", "function") || !c("login", "Account")) return !1;
          var n = { component: "modalAccount", size: "account-info" };
          o.Account = m(n, !0);
        },
        h = function (n, t) {
          var e = {
            component: "modalAlert",
            size: "account-info",
            resolve: {
              title: function () {
                return n;
              },
              message: function () {
                return t;
              },
            },
          };
          o.Alert = m(e, !0);
        },
        f = function () {
          if (!l("alert", "data")) return !1;
          var n = { component: "modalBackground", size: "account-info" };
          o.Background = m(n, !0);
        },
        y = function () {
          if (!l("alert", "data") || !c("login", "Button")) return !1;
          var n = { component: "modalButton", size: "secondary" };
          o.Button = m(n, !0);
        },
        v = function () {
          var n = { component: "modalContact", size: "contact-us" };
          o.Contact = m(n, !0);
        },
        b = function () {
          return !(!l("alert", "function") || s.authenticated) && (u("*", !0), void t.go("forgotPassword"));
        },
        w = function () {
          if (!l("alert", "data") || !c("login", "Id")) return !1;
          var n = { component: "modalId", size: "edit" };
          o.Id = m(n, !0);
        },
        k = function () {
          var n = { component: "modalIdsResult", size: "result" };
          o.IdResult = m(n, !0);
        },
        z = function () {
          var n = { component: "modalIntro", size: "intro" };
          o.Intro = m(n, !0);
        },
        P = function () {
          var n = { component: "modalLanguage", size: "language" };
          o.Language = m(n, !0);
        },
        S = function () {
          return !(!l("alert", "function") || s.authenticated) && (u("*", !0), void t.go("login"));
        },
        T = function () {
          if (!l("alert", "data") || !c("login", "Message")) return !1;
          var n = { component: "modalMessage", size: "secondary" };
          o.Message = m(n, !0);
        },
        C = function (n, t, e) {},
        L = function (n) {
          var t = { component: "modalPayment", size: "edit" };
          o.Payment = m(t, !0, n);
        },
        x = function () {
          if (!l("alert", "data") || !c("login", "Prize")) return !1;
          var n = { component: "modalPrize", size: "secondary" };
          o.Prize = m(n, !0);
        },
        D = function () {
          return !(!l("alert", "function") || s.authenticated) && (u("*", !0), void t.go("register"));
        },
        I = function () {
          var n = { component: "modalTheme", size: "change-theme" };
          o.Theme = m(n, !0);
        },
        N = function (n) {
          var t = {
            component: "modalSurvey",
            size: "login-register",
            resolve: {
              surveyId: function () {
                return n;
              },
            },
          };
          o.Theme = m(t, !0, !0);
        },
        A = { Account: p, Background: f, Button: y, Contact: v, ForgotPassword: b, Id: w, IdResult: k, Intro: z, Language: P, Login: S, Message: T, Payment: L, Prize: x, Register: D, Theme: I },
        R = function (n, t, e, i) {
          if (n && A[n]) return !$("div#modal-" + n).length && (A[n](e, i), t || a.log("modals", "Open", n), !0);
        };
      return { open: R, dismiss: u, close: d, alert: h, notify: C, isOnLine: l, isAuthenticated: c, doLoginOpen: r, survey: N };
    },
  ]),
  angular.module("app").factory("defaultIdService", [
    "$translate",
    function (n) {
      var t = {
        vi: {
          137481: "Trần Phú Quang",
          144364: "Kiều Thanh Sơn",
        },
        en: {
          137481: "Steve J. Zhang",
          144364: "Emma Wood",
        },
      };
      return function () {
        var e = n.use(),
          a = t[e] || t.en;
        return { ids: _.keys(a), names: _.values(a) };
      };
    },
  ]),
  angular.module("app").factory("i18nService", [
    "$translate",
    "$http",
    "$window",
    "devOps",
    "userdataService",
    function (n, t, e, a, i) {
      var o = navigator.language || navigator.userLanguage,
        s = {
          en: { name: "English", flag: "images/temp/flag-gb.jpg" },
          vi: { name: "Tiếng Việt", flag: "images/temp/flag-vietnam.jpg" },
        },
        r = {};
      angular.forEach(s, function (n, t) {
        e["i18n_" + t] && (r[t] = n);
      });
      var l = function (e) {
          var s = e || i.getRuntimeOpt("language", "undefined");
          n.use(s), e && i.setRuntimeOpt("language", e);
        },
        c = function () {
          return n.use();
        };
      return { languages: r, setLang: l, getLang: c, userLang: o };
    },
  ]),
  angular
    .module("app")
    .factory("authService", [
      "$firebaseAuth",
      function (n) {
        return n();
      },
    ])
    .factory("firebaseRef", [
      "authService",
      function (n) {
        return function () {
          throw new Error("User not logged in!");
        };
      },
    ]),
  angular.module("app").factory("audioService", [
    "defaultSettingService",
    "devOps",
    "Analytics",
    "userdataService",
    function (n, t, e, a) {
      var i = null,
        o = 0,
        s = {},
        r = {};
      (r.mode = parseInt(a.getRuntimeOpt("audioMode", 0))), (r.icon = t.audioIcons[r.mode]);
      var l = function (t, e) {
          if (null === i || t !== o || e) {
            var a = n.audio;
            Object.keys(a).length;
            (i = null), (o = t), (i = {});
            for (var s in a)
              if ("spin" === s) {
                i.spinHigh = new Audio(a.spin.High);
                for (var l = 0; l < t; l++) i["spinHigh" + l] = new Audio(a.spin.High);
              } else "" === a[s] ? (i[s] = new Audio()) : (i[s] = new Audio(a[s]));
            r.mute();
          }
        },
        c = function (n) {
          return i[n] && i[n].src;
        },
        u = function (n, t) {
          i[n].loop = "loop" === t || t === !0;
        },
        d = function (n, t, e) {
          s[t] && (clearTimeout(s[t]), (s[t] = null)),
            e
              ? (s[t] = setTimeout(function () {
                  "play" == n && "background" != t && p(t);
                  try {
                    i[t][n](), (s[t] = null);
                  } catch (e) {}
                }, e))
              : ("play" == n && "background" != t && p(t), i[t][n]());
        },
        g = function (n, t, e) {
          return !!c(n) && (u(n, e), void d("play", n, t));
        },
        m = function (n, t) {
          return !!c(n) && void d("pause", n, t);
        },
        p = function (n, t) {
          return !!c(n) && (d("pause", n, t), void (i[n].currentTime = 0));
        },
        h = function (n) {
          return !!c(n) && void (i[n].currentTime = 0);
        };
      return (
        (r.toggle = function () {
          r.mode++,
            r.mode >= t.audioIcons.length && (r.mode = 0),
            (r.icon = t.audioIcons[r.mode]),
            r.mute(),
            a.setRuntimeOpt("audioMode", r.mode),
            e.log("ui_action", "Set Audio Mode", r.mode + ". " + r.icon);
        }),
        (r.mute = function () {
          if (0 === r.mode) for (var n in i) i[n].muted = !1;
          else if (1 === r.mode) i.background.muted = !0;
          else for (var n in i) i[n].muted = !0;
        }),
        { init: l, play: g, pause: m, stop: p, reset: h, controller: r }
      );
    },
  ]),
  angular
    .module("app")
    .factory("Analytics", [
      "$window",
      "devOps",
      "authService",
      "trackingEvents",
      function (n, t, e, a) {
        return { log: function (t) {}, id: "", trackUnload: function (t) {} };
      },
    ])
    .factory("trackingEvents", function () {
      return {};
    }),
  angular.module("app").provider("$modalState", [
    "$stateProvider",
    function (n) {
      var t = this;
      (this.$get = function () {
        return t;
      }),
        (this.state = function (e, a) {
          function i(n, t, o) {
            a.resolve = {};
            for (var l = i.$inject.length - r.length; l < i.$inject.length; l++)
              !(function (n, t) {
                a.resolve[n] = function () {
                  return t;
                };
              })(i.$inject[l], arguments[l]);
            o(function () {
              (a.windowClass = "animation-modal-x"),
                (a.animation = !1),
                (s = n.open(a)),
                s.result["finally"](function () {
                  o(function () {
                    t.$current.name === e && t.go(a.parent || "^");
                  });
                });
            });
          }
          function o() {
            s && s.close();
          }
          var s;
          (a.onEnter = i), (a.onExit = o), a.resolve || (a.resolve = []);
          var r = angular.isArray(a.resolve) ? a.resolve : Object.keys(a.resolve);
          return n.state(e, _.omit(a, ["component", "template", "templateUrl", "controller", "controllerAs"])), (i.$inject = ["$uibModal", "$state", "$timeout"].concat(r)), t;
        });
    },
  ]);
var i18n_vi = {
  Spin: "Quay số",
  Stop: "Chốt",
  Confirm: "Xác nhận",
  Retry: "Quay lại",
};
var i18n_en = {
  Spin: "Quay số",
  Stop: "Chốt",
  Confirm: "Xác nhận",
  Retry: "Quay lại",
};

angular.module("app").component("idLuckyDraw", { templateUrl: "components/luckydraw-id.html", bindings: { data: "<", setting: "<", results: "=", isLimited: "&" }, controller: IdLuckyDrawController }),
  angular.module("app").controller("MainController", MainController),
  angular.module("app").run([
    "$templateCache",
    function (n) {
      n.put(
        "index.html",
        '<!doctype html>\n<html>\n\n<head>\n  <base href="/">\n  <meta charset="utf-8">\n  \n  <title>Lucky Draw</title>\n  <meta name="author" content="luckydraw.live">\n  <meta name="robots" content="index follow">\n  <meta name="googlebot" content="index follow">\n  <meta name="keywords" content="lucky draw, random name picker, random number generator">\n  <meta name="description" content="World\'s most sophisticated random number generator.">\n\n  \n  <meta property="og:title" content="Lucky Draw">\n  <meta property="og:site_name" content="LuckyDraw.live">\n  <meta property="og:url" content="https://www.luckydraw.live">\n  <meta property="og:description" content="World\'s most sophisticated random number generator.">\n  <meta property="og:type" content="website">\n  <meta property="og:image" content="https://www.luckydraw.live/images/luckydraw-v1.png">\n\n  <meta name="viewport" content="width=device-width" id="viewportMeta">\n  <link rel="shortcut icon" type="image/x-icon" href="favicon.ico">\n\n  <style>\n    .loader-block {\n      top: 0;\n      left: 0;\n      right: 0;\n      bottom: 0;\n      width: 100%;\n      height: 100%;\n      display: block;\n      z-index: 999999;\n      position: fixed;\n      text-align: center;\n      background-color: #ffffff;\n      background-image: url(images/loader.svg);\n      background-position: center center;\n      background-repeat: no-repeat;\n    }\n  </style>\n  \n  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({\'gtm.start\':\n  new Date().getTime(),event:\'gtm.js\'});var f=d.getElementsByTagName(s)[0],\n  j=d.createElement(s),dl=l!=\'dataLayer\'?\'&l=\'+l:\'\';j.async=true;j.src=\n  \'https://www.googletagmanager.com/gtm.js?id=\'+i+dl;f.parentNode.insertBefore(j,f);\n  })(window,document,\'script\',\'dataLayer\',\'GTM-NWZ9HX7\');</script>\n  \n</head>\n\n<body ng-app="app" ng-class="\'theme-\' + theme">\n  \n  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NWZ9HX7" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>\n  \n\n  <div class="loader-block" id="loader"></div>\n  \n  \n  \n  \n  \n\n  \n  <link rel="stylesheet" href="index.css">\n  \n  <div class="wrapper"  >\n    <ui-view></ui-view>\n    <notification></notification>\n    <img ng-src="{{background}}" width="1" height="1" appbackground>\n  </div>\n\n  \n  \n  \n  \n  \n\n  \n  \n  \n  \n  \n  \n  \n  \n</body>\n\n</html>\n'
      ),
        n.put(
          "components/luckydraw-id.html",
          '<header class="header">\n  <div class="container-fluid">\n    <div class="row">\n      \n       \n      \n\n      <div class="col-xs-12">\n\n\n<div class="header-content hidden">\n          \n          <span class="link-company" ng-if="$ctrl.setting.info.company" ng-style="$ctrl.ux.style($ctrl.setting.colors.action_msg, 1)">\n            {{$ctrl.setting.info.company}}\n          </span>\n          \n        </div>\n      </div>\n    </div>\n  </div>\n</header>\n\n<div ng-class="$ctrl.appState.name === \'presentation\' ? \'main-padding\' : \'main\'">\n  <div class="container-fluid">\n    <div class="row">\n      <div class="col-xs-12">\n        <section class="section section-prize">\n          <header class="section-head" ng-class="$ctrl.animClass.setprize" ng-init="$ctrl.setPrize(0)">\n            \n            <div class="coin">\n             \n            </div>\n            \n          </header>\n\n          \n          <div class="section-message">\n          <pre>{{$ctrl.selectedIds}} - {{$ctrl.namex}}</pre>                  </div>\n          \n\n          <div class="section-body" ng-class="$ctrl.animClass.setprize">\n            <div class="section-body-inner section-body-inner-primary">\n              <ul class="slots">\n                \n                <li class="slot" ng-repeat="n in $ctrl.machineSlots" ng-class="\'slot-1of\'+$ctrl.slotsCss + \' state-\'+$ctrl.state">\n                  <div class="slot-item" ng-repeat="i in $ctrl.characters[n]">\n                    <div class="slot-number" ng-switch on="$ctrl.state">\n                      <span ng-switch-when="ready">\n                        <img ng-src="{{$ctrl.prize.image}}">\n                      </span>\n                      <span ng-switch-when="setprize"></span>\n                      <span ng-switch-default>{{i}}</span>\n                      \n                    </div>\n                  </div>\n                  \n                  <div class="slot-item" ng-if="!$ctrl.characters[n]">\n                    <div class="slot-number">\n                      <span ng-class="$ctrl.state !== \'ready\' ? \'not-available\' : \'available\'"><img ng-src="{{$ctrl.prize.image}}"></span>\n                    </div>\n                  </div>\n                  \n                </li>\n                \n              </ul>\n            </div>\n          </div>\n\n          <div class="section-actions">\n           \n\n            <div ng-switch on="$ctrl.state" class="section-button">\n              <div ng-switch-when="ready" class="state-ready">\n                <a class="btn btn-yellow btn-yellow-secondary" ng-click="$ctrl.spin()" ng-mouseover="$ctrl.ux.mOver(\'spin\')" ng-mouseleave="$ctrl.ux.mLeave(\'spin\')">\n                  {{$ctrl.setting.buttons.spin || ($ctrl.defaultSetting.buttons.spin | translate)}}\n                </a>\n                <span ng-if="$ctrl.appState.name !== \'customize\' && $ctrl.appState.name !== \'presentation\'">\n                  <a ng-if="$ctrl.user.authenticated" ui-sref="customize"  class="btn btn-primary">\n                    <translate>Customize</translate>\n                  </a>\n                  \n                </span>\n              </div>\n\n              <div ng-switch-when="spin" class="state-spin">\n                <a class="btn btn-yellow btn-yellow-secondary-alt" ng-click="$ctrl.startstop()" ng-mouseover="$ctrl.ux.mOver(\'stop\')" ng-mouseleave="$ctrl.ux.mLeave(\'stop\')">\n                  {{$ctrl.setting.buttons.stop || ($ctrl.defaultSetting.buttons.stop | translate)}} {{$ctrl.remainStops > 0 ? \'(\'+$ctrl.remainStops+\')\' : \'\'}}\n                </a>\n              </div>\n\n              <div ng-switch-when="complete" class="state-complete">\n   <a class="btn btn-primary" ng-click="$ctrl.retry()" ng-mouseover="$ctrl.ux.mOver(\'confirm\')" ng-mouseleave="$ctrl.ux.mLeave(\'confirm\')">\n                  {{$ctrl.setting.buttons.retry || ($ctrl.defaultSetting.buttons.retry | translate)}}\n                   \n                </a>\n              </div>\n            </div> \n\n          </div> \n        </section>\n      </div>\n    </div>\n  </div>\n</div> \n\n<app-footer light-off="$ctrl.lightOff"></app-footer>\n\n<hot-keys enter="$ctrl.startstop()" nextstep="" confirm="$ctrl.save()" cancel="$ctrl.retry()" prev="$ctrl.setPrevPrize()" next="$ctrl.setNextPrize()">\n</hot-keys>\n'
        ),
        n.put("templates/main.html", '<id-lucky-draw data="$ctrl.data" setting="$ctrl.setting" results="$ctrl.results" is-limited="$ctrl.isLimited(r)"></id-lucky-draw>\n');
    },
  ]),
  angular.module("app").config(routesConfig);
