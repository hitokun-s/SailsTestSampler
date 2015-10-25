module.exports = {

  hoge:function(id){
    if(!id){
      throw new Error('id is 0 or null');
    }
  },
  otherMethod:function(){
    // spy, stub, mockの動作確認用
  }
};
