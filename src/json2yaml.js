(function (self) {

    var spacing = '  ',
        converters = {

            'array': function (obj, ret) {
                var i = 0,
                    ele,
                    recurse;

                for (; i < obj.length; i++) {
                    ele = obj[i];
                    recurse = [];

                    convert(ele, recurse);

                    for (var j = 0; j < recurse.length; j++) {
                        ret.push((j === 0 ? '- ' : spacing) + recurse[j]);
                    }
                }
            },

            'hash': function (obj, ret) {
                var k,
                    i,
                    recurse,
                    ele,
                    type;

                for (k in obj) {
                    recurse = [];

                    if (obj.hasOwnProperty(k)) {
                        ele = obj[k];
                        convert(ele, recurse);
                        type = getType(ele);

                        if (type === 'string' || type === 'null' || type === 'number' || type === 'boolean') {
                            ret.push(normalizeString(k) + ': ' + recurse[0]);
                        } else {
                            ret.push(normalizeString(k) + ': ');
                            for (i = 0; i < recurse.length; i++) {
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
                ret.push(obj ? 'Yes' : 'No');
            }
        };

    function getType(obj) {
        var type = typeof obj;

        if (obj instanceof Array) {
            return 'array';
        }

        if (type === 'undefined' || obj === null) {
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
        if (typeof obj === 'string') {
            obj = JSON.parse(obj);
        }

        var ret = [];
        convert(obj, ret);
        return ret.join('\n');
    };
})(this);