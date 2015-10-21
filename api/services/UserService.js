var currentTarget;
module.exports = {

  findById: function(id, callback) {
    // Grailsでのget(id)と同じだね
    User.find(id).exec(function(err, user) {
      callback(user)
    });
    // でも非同期処理が不便すぎる。同期処理
  },

  findByName:function(name){
    // これがsails流のcriteria検索
    User.find({name:name}).then(function(err, user) {
      currentTarget = user;
    });
    // WaterlineのDynamic Finder機能を使うと、Grails同様に、User.findByName()というメソッドを呼べるようになる！
    // 参考：http://qiita.com/scova0731/items/142a02dbda8d1da8c645
  },
  getCurrentTarget:function(){
    return currentTarget;
  }
};
