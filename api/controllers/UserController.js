/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  create: function(req, res){
    var params = req.params.all()

    User.create({name: params.name}).exec(function createCB(err,created){
      return res.json({
        notice: 'Created user with name ' + created.name
      });
    });
  },
  // Controller内で直接モデルを呼ぶケース
  findById:function(req,res){
    User.findById(req.param("id"), function (err, user) {
      if (err) return res.send(500);
      res.json(200, user); // TODO  return は無くても良かったっけ？
    });
  },
  // serviceを使うケース
  hoge:function(req,res){
    var resp = HogeService.hoge(req.param("id"));
    return res.json(resp);
  }
};

