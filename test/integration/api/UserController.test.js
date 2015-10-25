// 参考URL：
// http://timjrobinson.com/unit-testing-javascript-use-sinon-js/
// https://github.com/fdvj/wolfpack/issues/2

//var request = require('supertest'); // apiレベルのテストでのみ必要。
var assert = require('assert');
var async = require('async');
var sinon = require("sinon");
//var UserController = require('../../../api/controllers/UserController'); // こんなことしなくてもいいし、してはいけない。

describe('UserController', function () {
  var controller;// grails-spock風に、controller変数にしてみる。
  before(function(){
    controller = sails.controllers.user;
  });

   // ************************************************************
   // アクション内でリソースを取得して非同期にレスポンスするケース
   // ************************************************************
  describe('test action responding async', function () {
    // Userを作成しておく。
    before(function (done) {
      User.create({id: 123, name: "hitokun"}).exec(function createCB(err, created) {
        console.log(err ? "error:" + err : "created:" + JSON.stringify(created));
        done();
      });
    });
    // 非同期処理をテストするときは、doneをうまく使うこと！
    it('findbyId should return User', function (done) {

      var req = {param: sinon.stub().returns(123)}; // req.param([param name]) という関数を置換 => params.all()　とかする場合には対応できない。
      var res = {json: function(status, json){ //ちょっと苦しい？でもこれしか思いつかない
        assert(status ==  200);
        assert(json[0].id ==  123);
        assert(json[0].name ==  "hitokun");
        done(); // これを呼ばないとテストが終了せずtimeoutエラーになります
      }};

      controller.findById(req, res); // = UserController.findById(req, res);

      // アクションの中で、非同期にres.jsonを実行しているため、下記はエラーになる！！！
      //assert(res.json.calledOnce);
      //assert(res.json.getCall(0).args[0] ==  200);
      //assert(res.json.getCall(0).args[1].id ==  123);
      //assert(res.json.getCall(0).args[1].name == "hitokun");
    });
  }),
    // ****************************************************************************************************
    // Stub:（１）テスト対象中で使用している、あるオブジェクトのあるメソッドを、単に置換したい場合（未実装の場合など）、
    // もしくは、（２）所定の動きをする関数を作成したい場合
    // ****************************************************************************************************
    describe("test action calling HogeService:Stub", function () {
      before(function () {
        // サービス名はすべて小文字で「sails.services.hogeservice」とするか、もしくは単に「HogeService」でもOK。
        // （１）の例
        sinon.stub(sails.services.hogeservice, 'hoge', function (id) {
          return {user: id};
        });
      });
      after(function () {
        // restoreを忘れると、別のテストでstubしたときに、二重wrapエラーになる。
        sails.services.hogeservice.hoge.restore();
      });
      it("test action calling HogeService:Stub", function () {

        var req = {param: sinon.stub().returns(123)};// （２）の例
        var res = {json: sinon.spy()};
        controller.hoge(req, res);

        console.log(res.json.getCall(0).args[0]); // 1回目のコールの第一引数を取得
        console.log(res.json.args[0][0]); // 1回目のコールの第一引数を取得

        assert(res.json.calledWith({user: 123}));
        assert(res.json.getCall(0).args[0].user == 123);
      });
    }),
    // ****************************************************************************************************
    // Spy:（１）テスト対象中で使用している＜あるオブジェクトのあるメソッドをラップし、呼び出し回数や引数をチェックできる。
    // もとのメソッドの動きは変わらない！！！
    // もしくは、（２）所定の動きをする関数を作成したい場合
    // ****************************************************************************************************
    describe("test action calling HogeService:Spy", function () {
      var hogeMethodSpy;
      before(function () {
        hogeMethodSpy = sinon.spy(HogeService, "hoge");
      });
      after(function () {
        console.log(HogeService ? "exist" : "not exist"); // => exist!
        sails.services.hogeservice.hoge.restore();
      });
      it("test hoge service called as a spy ", function () {

        var req = {param: sinon.stub().returns(123)};
        var res = {json: sinon.spy()};// （２）の例

        controller.hoge(req, res);

        assert(hogeMethodSpy.calledOnce); // node.jsのAssert
      });
      it("test hoge service called as a spy: throws Error ", function () {

        var req = {param: sinon.stub().returns(0)};
        var res = {json: sinon.spy()};

        controller.hoge(req, res);

        assert(hogeMethodSpy.threw("Error"));
      });
    });
  // ****************************************************************************************************
  // Mock:あるオブジェクトの呼ばれ方をSpyのようにテストしつつ、その戻り値をStubしたい,という場合。
  // ということは、grails-spockのモックと同じ。
  // もしくは、（２）所定の呼ばれ方をする所定の関数をもつモックオブジェクトを作成したい場合（sinon.mock()）
  // ****************************************************************************************************
  describe("test action calling HogeService:Mock", function () {
    var hogeServiceMock;
    before(function () {
      hogeServiceMock = sinon.mock(HogeService);
    });
    after(function(){
      hogeServiceMock.restore();
    });
    it('test action calling HogeService:Mock', function () {

      // expectationオブジェクトを作る
      var exp = hogeServiceMock.expects("hoge"); //expects()を２回実行するとエラーになります！
      exp.once().returns({id:123,name:"hitokun"}); // 1回だけ呼ばれるかテスト。戻り値を指定できる。
      exp.atLeast(1); //最低1回は呼ばれる
      exp.atMost(1); //最大// 1回は呼ばれる
      exp.exactly(1); //ちょうど指定した回数だけ呼ばれる
      exp.withArgs(123); //指定した引数で呼ばれる

      var req = {param: sinon.stub().returns(123)};
      var res = {json: sinon.spy()};

      controller.hoge(req, res);

      hogeServiceMock.verify(); // mockに課した条件が満たされているかチェックする（満たされてないならエラー発生）
    });
  }),
  after(function () {
  });
});
