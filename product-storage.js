var plugin = function (options) {
  var seneca = this;

  seneca.add({ role: "product", cmd: "add" }, function (msg, respond) {
    this.make("product").data$(msg.data).save$(respond);
  });

  seneca.add({ role: "product", cmd: "get-all" }, function (msg, respond) {
    this.make("product").list$({}, respond);
  });

  seneca.add({ role: "product", cmd: "delete" }, function (msg, respond) {
    this.make("product").remove$(msg.id, respond);
  });
};

module.exports = plugin;
