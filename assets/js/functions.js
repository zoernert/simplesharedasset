$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return decodeURI(results[1]) || 0;
    }
}

let sourceReading = function() {
  return new Promise(function(resolve, reject) {
    let res= {
      timestamp:new Date().getTime(),
      value:0.0135372
    };
    resolve(res);
  });
}

let sharesResourceDownload = function() {
  $.get("/data/ijJtx7dtD39oSZC/download",function(data) {
    console.log(data);
  })
}

const erc20ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"tokens","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tokenOwner","type":"address"},{"name":"tokens","type":"uint256"}],"name":"mint","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"mintable","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tokenOwner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"disableMinting","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"tokens","type":"uint256"},{"name":"data","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"newOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tokenAddress","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transferAnyERC20Token","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"tokenOwner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":false,"stateMutability":"nonpayable","type":"fallback"},{"anonymous":false,"inputs":[],"name":"MintingDisabled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"tokenOwner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Approval","type":"event"}];

const contractAddress = "0x3b492fd59daa66904a101f90cd9aeed4a5723631";

const provider = ethers.providers.getDefaultProvider('homestead');

const erc20Token = new ethers.Contract(contractAddress, erc20ABI, provider);

const render_tokenTotalSupply = function() {
  erc20Token.totalSupply().then(function(result) {
      model.totalSupply=result.toString()/100;
      render_addressValue();
  });
}

const render_totalValue = function() {
    sourceReading().then(function(l) {
      model.totalValue=l.value*1;
    });
}

let model = {
    account:"0x0",
    totalSupply:0,
    totalValue:0,
    addressSupply:0,
    addressValue:0,
    contractAddress:contractAddress
}

const render_addressValue = function() {
  model.addressValue=(model.addressSupply/model.totalSupply)*model.totalValue;
}
const render_sharesOf = function() {
  let address=contractAddress;
  if($.urlParam("a")!=null) {
    address=$.urlParam("a");
    model.account=address;
  }
  erc20Token.balanceOf(address).then(function(result) {
    model.addressSupply=result.toString()/100;
    model.account=""+address;
    console.log(address);
    render_addressValue();
  });
}

const update = function() {
  render_tokenTotalSupply();
  render_totalValue();
  render_sharesOf();
}

$( document ).ready(function() {
  $('.contractAddress').html(contractAddress);
  var app = new Vue({
    el: '#view',
    data: model
  })
  if($.urlParam("a")!=null) {
    update();
    $('#view_status').show();
    $('#view_login').hide();
  } else {
    $('#view_login').show();
    $('#view_status').hide();
  }
  $('#btn_login').click(function() {
    $('#btn_login').attr('disabled','disabled');
    ethers.Wallet.fromBrainWallet($('#username').val(),$('#password').val()).then(function(wallet) {
      location.href='?a='+wallet.address;
    });
  });
});
