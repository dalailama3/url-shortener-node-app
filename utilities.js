var alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
var base = alphabet.length

function base10To58(num) {
    var str = ""
    while (num > 0) {
        var remainder = num % 58
        num = Math.floor(num / 58)
        
        str = alphabet[remainder] + str;
    }
    
    return str
    
    
}

function strToBase10(str) {
    var num = 0;
    while (str) {
    var index = alphabet.indexOf(str[0]);
    var power = str.length - 1;
    num += index * (Math.pow(base, power));
    str = str.substring(1);
  }
  return num;
}

module.exports.base10To58 = base10To58;
module.exports.strToBase10 = strToBase10;