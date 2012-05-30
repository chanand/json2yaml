(function (self) {

    var spacing = '  ',
        converters = {

            'array': function (obj, ret) {
                for (var i = 0; i < obj.length; i++) {
                    var ele = obj[i];
                    var recurse = [];
                    convert(ele, recurse);

                    for (var j = 0; j < recurse.length; j++) {
                        ret.push((j == 0 ? '- ' : spacing) + recurse[j]);
                    }
                }
            },

            'hash': function (obj, ret) {
                for (var k in obj) {
                    var recurse = [];
                    if (obj.hasOwnProperty(k)) {
                        var ele = obj[k];
                        convert(ele, recurse);
                        var type = getType(ele);
                        if (type == 'string' || type == 'null' || type == 'number' || type == 'boolean') {
                            ret.push(normalizeString(k) + ': ' + recurse[0]);
                        } else {
                            ret.push(normalizeString(k) + ': ');
                            for (var i = 0; i < recurse.length; i++) {
                                ret.push(spacing + recurse[i]);
                            }
                        }
                    }
                }
            },

            'string': function(obj, ret) {
                ret.push(normalizeString(obj));
            },

            'null': function(obj,ret){
                ret.push('null')
            },

            'number': function(obj,ret){
                ret.push(obj.toString())
            },

            'boolean': function(obj,ret){
                ret.push(obj ? 'true' : 'false');
            }
        };

    function getType(obj) {
        var type = typeof obj;

        if (obj instanceof Array) {
            return 'array';
        }

        if (type == 'undefined' || obj === null) {
            return 'null';
        }

        switch (type) {
            case 'string':
            case 'boolean':
            case 'number':
                return type;
            default:
                return 'hash';
        }
    }

    function convert(obj, ret) {
        converters[getType(obj)](obj, ret);
    }

    function normalizeString(str) {
        if (str.match(/^[\w]+$/)) {
            return str;
        } else {
            return JSON.stringify(str);
        }
    }

    self.json2yaml = function (obj) {
        if (typeof obj == 'string') {
            obj = JSON.parse(obj);
        }

        var ret = [];
        convert(obj, ret);
        return ret.join('\n');
    };
})(this);