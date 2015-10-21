// 参考URL：
// http://timjrobinson.com/unit-testing-javascript-use-sinon-js/
// https://github.com/fdvj/wolfpack/issues/2

var request = require('supertest');
var assert = require('assert');
var async = require('async');
var sinon = require("sinon");
var stubs = require('../../stubs.js');
var UserController = require('../../../api/controllers/UserController'); // sails独自の方法でControllerを参照できるらしい？


describe('UserController', function () {
  before(function(){

  });
  describe('findById', function () {
    it('findbyId should return User', function (done) {

      var mockUser = {id:123, name :"hitokun"};

      //sinon.stub(UserService, 'findById').returns(mockUser);
      //sinon.stub(UserService, 'findById', function(id, callback){
      //  callback(mockUser);
      //});

      // Stubを作成
      sinon.stub(User, 'findById').callsArgWith(1, null, mockUser);

      //var req = {param: {id:123}}; // TODO 実ソース側で、params.all()とかしていたら、これだと対応できないな
      var req = {param:sinon.stub().returns(123)}; // TODO これは、実ソース側で、req.param("id")としている場合にしか対応できなさそう。。
      var res = {json: sinon.spy()};
      UserController.findById(req, res);

      // Grailsのような、assert res.json.id == 123 という方法の代わりに、res.json()の引数が何だったjか、をチェックする作戦。
      assert(res.json.calledWith(200, {id:123, name: "hitokun"}));
      // スタブを戻しておく
      User.findById.restore();
      done(); // これを呼ばないとテストが終了せず、timeoutエラーになる。

      // 非同期テストの場合は、それが終わったタイミングでdone()を実行すること。
      //request(sails.hooks.http.app)
      //  .get('/user/findById')  //Path and method
      //  .send({ id:123 })
      //  .set('Accept', 'application/json')
      //  .expect('Content-Type', /json/)
      //  .expect(200)
      //  .end(function(err, res){
      //    if (err) throw err;
      //    console.log(res.body);
      //    assert.equal(res.body.id, 123)
      //  });

    });
  });
});
