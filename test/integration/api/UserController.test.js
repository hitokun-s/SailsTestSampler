// 参考URL：
// http://timjrobinson.com/unit-testing-javascript-use-sinon-js/
// https://github.com/fdvj/wolfpack/issues/2

var request = require('supertest');
var assert = require('assert');
var async = require('async');
var sinon = require("sinon");
var stubs = require('../../stubs.js');
//var UserController = require('../../../api/controllers/UserController'); // こんなことしなくてもいい

var Sails = require('sails');

// create a variable to hold the instantiated sails server
var app;

describe('UserController', function () {
  before(function(){
    // すべてのModelを自動探索して下記処理を裏で行うようにできたら、sails版のbuild-test-dataプラグインになるかも？
    // => とりあえずbootsrap.jsでやってみる。
    //User.build = function(params){
    //  // 実際はここでUserのプロパティとbindしたい。
    //  return params;
    //}
  });
  describe('findById', function () {
    it('findbyId should return User', function (done) {

      //var mockUser = {id:123, name :"hitokun"};
      var mockUser = User.build({id:123, name :"hitokun"});//なんちゃってbuild-test-data風

      // この呼び出しを進化させれば、grails * spockの、@TestFor(UserController)　のようなこともできるかも？
      var controller = sails.controllers.user;

      // Stubを作成
      sinon.stub(User, 'findById').callsArgWith(1, null, mockUser);

      var req = {param:sinon.stub().returns(123)}; // req.param([param name]) という関数を置換 => params.all()　とかする場合には対応できない。
      var res = {json: sinon.spy()}; // res.json()関数を置換

      //UserController.findById(req, res);
      controller.findById(req, res);

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
  describe("test action calling HogeService:Mock", function(){
    it("test hoge service called as a mock ", function(done){
      var hogeServiceMock = sinon.mock(HogeService);

      // 下記のうち1つしか書けないみたい（複数併記するとエラーになる）。ちょっと不便。
      hogeServiceMock.expects("hoge").once(); // 1回だけ呼ばれる
      //hogeServiceMock.expects("hoge").atLeast(1); //最低1回は呼ばれる
      //hogeServiceMock.expects("hoge").atMost(1); //最大// 1回は呼ばれる
      //hogeServiceMock.expects("hoge").exactly(1); //ちょうど指定した回数だけ呼ばれる
      //hogeServiceMock.expects("hoge").withArgs(123); //指定した引数で呼ばれる

      //hogeServiceMock.expects("hoge").twice();// これだと当然エラーになる

      var controller = sails.controllers.user;

      var req = {param:sinon.stub().returns(123)};
      var res = {json: sinon.spy()};

      controller.hoge(req, res);

      hogeServiceMock.verify(); // mockに課した条件が満たされているかチェックする（満たされてないならエラー発生）
      done();
    });
  });
  describe("test action calling HogeService:Spy", function(){
    it("test hoge service called as a spy ", function(done){

      var hogeMethodSpy = sinon.spy(HogeService, "hoge");

      var controller = sails.controllers.user;

      var req = {param:sinon.stub().returns(123)};
      var res = {json: sinon.spy()};

      controller.hoge(req, res);

      assert(hogeMethodSpy.calledOnce); // node.jsのAssert
      sinon.assert.calledOnce(hogeMethodSpy); // sinonにもAssert機能が完備されている。
      done();
    });
  });
  after(function(){
  });
});
