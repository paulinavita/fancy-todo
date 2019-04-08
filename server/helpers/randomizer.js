module.exports = {

    randomizer : function() {
        var anysize = 6;
        var charset = "abcdefghijklmnopqrstuvwxyz1234567890~!@#$%^&*";
        var i=0, ret='';
        while(i++<anysize) {
            ret += charset.charAt(Math.random() * charset.length)
        }
        return ret
    }
}