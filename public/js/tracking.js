function _MixpanelCloneTrack(t) {
    this.url = t
}
_MixpanelCloneTrack.prototype.send = function(t, e, m) {
    function n(){
        m();
        socket.emit('track');
    }
    if ("undefined" != typeof e) {
        var o = null;
        "undefined" != typeof n && (o = window.setTimeout(function() {
            n()
        }, 5e3));
        var r = new Image;
        r.onload = function() {
            "undefined" != typeof n && (clearTimeout(o), n())
        };
        var i = this.url;
        //i += "/" + t + "?";
        i += "?";
        var d = [];
        for (var u in e) {
            var p = e[u];
            p.length > 0 && (p = p.trim()), d.push(u + "=" + encodeURIComponent(p))
        }
        i += d.join("&"), r.src = i;
        console.log(i);
    }
}, _MixpanelCloneTrack.prototype.track = function(t, e, n) {
    if ("undefined" == typeof e) var e = 1;
    this.send("order", {
        event: t,
        data: JSON.stringify(e)
    }, n)
};
var MixpanelCloneTrack = new _MixpanelCloneTrack('//localhost:3000/track/56f22b22fc82b88121f39d76');
window._MCTrack = window._MCTrack || [];
window._MCTrack.forEach(function(i) {
    if (typeof i[0] === 'string' && typeof i[1] === 'object') {
        var m = i[0].toLowerCase();
        var p = i[1];
        if (typeof MixpanelCloneTrack[m] === 'function') {
            MixpanelCloneTrack.send(m, p);
        }
    }
});