(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === elm$core$Basics$EQ ? 0 : ord === elm$core$Basics$LT ? -1 : 1;
	}));
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[94m' + string + '\x1b[0m' : string;
}



// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.o.bx === region.de.bx)
	{
		return 'on line ' + region.o.bx;
	}
	return 'on lines ' + region.o.bx + ' through ' + region.de.bx;
}



// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = elm$core$Set$toList(x);
		y = elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = elm$core$Dict$toList(x);
		y = elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = elm$core$Dict$toList(x);
		y = elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (!x.$)
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? elm$core$Basics$LT : n ? elm$core$Basics$GT : elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return word
		? elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? elm$core$Maybe$Nothing
		: elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? elm$core$Maybe$Just(n) : elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800)
			+
			String.fromCharCode(code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

var _Json_decodeInt = { $: 2 };
var _Json_decodeBool = { $: 3 };
var _Json_decodeFloat = { $: 4 };
var _Json_decodeValue = { $: 5 };
var _Json_decodeString = { $: 6 };

function _Json_decodeList(decoder) { return { $: 7, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 8, b: decoder }; }

function _Json_decodeNull(value) { return { $: 9, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 10,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 11,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 12,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 13,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 14,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 15,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return elm$core$Result$Err(A2(elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 3:
			return (typeof value === 'boolean')
				? elm$core$Result$Ok(value)
				: _Json_expecting('a BOOL', value);

		case 2:
			if (typeof value !== 'number') {
				return _Json_expecting('an INT', value);
			}

			if (-2147483647 < value && value < 2147483647 && (value | 0) === value) {
				return elm$core$Result$Ok(value);
			}

			if (isFinite(value) && !(value % 1)) {
				return elm$core$Result$Ok(value);
			}

			return _Json_expecting('an INT', value);

		case 4:
			return (typeof value === 'number')
				? elm$core$Result$Ok(value)
				: _Json_expecting('a FLOAT', value);

		case 6:
			return (typeof value === 'string')
				? elm$core$Result$Ok(value)
				: (value instanceof String)
					? elm$core$Result$Ok(value + '')
					: _Json_expecting('a STRING', value);

		case 9:
			return (value === null)
				? elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 5:
			return elm$core$Result$Ok(_Json_wrap(value));

		case 7:
			if (!Array.isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 8:
			if (!Array.isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 10:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return (elm$core$Result$isOk(result)) ? result : elm$core$Result$Err(A2(elm$json$Json$Decode$Field, field, result.a));

		case 11:
			var index = decoder.e;
			if (!Array.isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return (elm$core$Result$isOk(result)) ? result : elm$core$Result$Err(A2(elm$json$Json$Decode$Index, index, result.a));

		case 12:
			if (typeof value !== 'object' || value === null || Array.isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!elm$core$Result$isOk(result))
					{
						return elm$core$Result$Err(A2(elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return elm$core$Result$Ok(elm$core$List$reverse(keyValuePairs));

		case 13:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return elm$core$Result$Ok(answer);

		case 14:
			var result = _Json_runHelp(decoder.b, value);
			return (!elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 15:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if (elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return elm$core$Result$Err(elm$json$Json$Decode$OneOf(elm$core$List$reverse(errors)));

		case 1:
			return elm$core$Result$Err(A2(elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!elm$core$Result$isOk(result))
		{
			return elm$core$Result$Err(A2(elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return elm$core$Result$Ok(toElmValue(array));
}

function _Json_toElmArray(array)
{
	return A2(elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return elm$core$Result$Err(A2(elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 3:
		case 2:
		case 4:
		case 6:
		case 5:
			return true;

		case 9:
			return x.c === y.c;

		case 7:
		case 8:
		case 12:
			return _Json_equality(x.b, y.b);

		case 10:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 11:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 13:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 14:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 15:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.fZ,
		impl.hF,
		impl.hb,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	result = init(result.a);
	var model = result.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		result = A2(update, msg, model);
		stepper(model = result.a, viewMetadata);
		_Platform_dispatchEffects(managers, result.b, subscriptions(model));
	}

	_Platform_dispatchEffects(managers, result.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				p: bag.n,
				q: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.q)
		{
			x = temp.p(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		r: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].r;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		r: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].r;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}



// SEND REQUEST

var _Http_toTask = F2(function(request, maybeProgress)
{
	return _Scheduler_binding(function(callback)
	{
		var xhr = new XMLHttpRequest();

		_Http_configureProgress(xhr, maybeProgress);

		xhr.addEventListener('error', function() {
			callback(_Scheduler_fail(elm$http$Http$NetworkError));
		});
		xhr.addEventListener('timeout', function() {
			callback(_Scheduler_fail(elm$http$Http$Timeout));
		});
		xhr.addEventListener('load', function() {
			callback(_Http_handleResponse(xhr, request.cz.a));
		});

		try
		{
			xhr.open(request.cO, request.hG, true);
		}
		catch (e)
		{
			return callback(_Scheduler_fail(elm$http$Http$BadUrl(request.hG)));
		}

		_Http_configureRequest(xhr, request);

		var body = request.eI;
		xhr.send(elm$http$Http$Internal$isStringBody(body)
			? (xhr.setRequestHeader('Content-Type', body.a), body.b)
			: body.a
		);

		return function() { xhr.abort(); };
	});
});

function _Http_configureProgress(xhr, maybeProgress)
{
	if (!elm$core$Maybe$isJust(maybeProgress))
	{
		return;
	}

	xhr.addEventListener('progress', function(event) {
		if (!event.lengthComputable)
		{
			return;
		}
		_Scheduler_rawSpawn(maybeProgress.a({
			eS: event.loaded,
			eT: event.total
		}));
	});
}

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.b2; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}

	xhr.responseType = request.cz.b;
	xhr.withCredentials = request.c_;

	elm$core$Maybe$isJust(request.cW) && (xhr.timeout = request.cW.a);
}


// RESPONSES

function _Http_handleResponse(xhr, responseToResult)
{
	var response = _Http_toResponse(xhr);

	if (xhr.status < 200 || 300 <= xhr.status)
	{
		response.body = xhr.responseText;
		return _Scheduler_fail(elm$http$Http$BadStatus(response));
	}

	var result = responseToResult(response);

	if (elm$core$Result$isOk(result))
	{
		return _Scheduler_succeed(result.a);
	}
	else
	{
		response.body = xhr.responseText;
		return _Scheduler_fail(A2(elm$http$Http$BadPayload, result.a, response));
	}
}

function _Http_toResponse(xhr)
{
	return {
		hG: xhr.responseURL,
		g3: { e3: xhr.status, aD: xhr.statusText },
		b2: _Http_parseHeaders(xhr.getAllResponseHeaders()),
		eI: xhr.response
	};
}

function _Http_parseHeaders(rawHeaders)
{
	var headers = elm$core$Dict$empty;

	if (!rawHeaders)
	{
		return headers;
	}

	var headerPairs = rawHeaders.split('\u000d\u000a');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf('\u003a\u0020');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3(elm$core$Dict$update, key, function(oldValue) {
				return elm$core$Maybe$Just(elm$core$Maybe$isJust(oldValue)
					? value + ', ' + oldValue.a
					: value
				);
			}, headers);
		}
	}

	return headers;
}


// EXPECTORS

function _Http_expectStringResponse(responseToResult)
{
	return {
		$: 0,
		b: 'text',
		a: responseToResult
	};
}

var _Http_mapExpect = F2(function(func, expect)
{
	return {
		$: 0,
		b: expect.b,
		a: function(response) {
			var convertedResponse = expect.a(response);
			return A2(elm$core$Result$map, func, convertedResponse);
		}
	};
});


// BODY

function _Http_multipart(parts)
{


	for (var formData = new FormData(); parts.b; parts = parts.b) // WHILE_CONS
	{
		var part = parts.a;
		formData.append(part.a, part.b);
	}

	return elm$http$Http$Internal$FormDataBody(formData);
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});




// STRINGS


var _Parser_isSubString = F5(function(smallString, offset, row, col, bigString)
{
	var smallLength = smallString.length;
	var isGood = offset + smallLength <= bigString.length;

	for (var i = 0; isGood && i < smallLength; )
	{
		var code = bigString.charCodeAt(offset);
		isGood =
			smallString[i++] === bigString[offset++]
			&& (
				code === 0x000A /* \n */
					? ( row++, col=1 )
					: ( col++, (code & 0xF800) === 0xD800 ? smallString[i++] === bigString[offset++] : 1 )
			)
	}

	return _Utils_Tuple3(isGood ? offset : -1, row, col);
});



// CHARS


var _Parser_isSubChar = F3(function(predicate, offset, string)
{
	return (
		string.length <= offset
			? -1
			:
		(string.charCodeAt(offset) & 0xF800) === 0xD800
			? (predicate(_Utils_chr(string.substr(offset, 2))) ? offset + 2 : -1)
			:
		(predicate(_Utils_chr(string[offset]))
			? ((string[offset] === '\n') ? -2 : (offset + 1))
			: -1
		)
	);
});


var _Parser_isAsciiCode = F3(function(code, offset, string)
{
	return string.charCodeAt(offset) === code;
});



// NUMBERS


var _Parser_chompBase10 = F2(function(offset, string)
{
	for (; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (code < 0x30 || 0x39 < code)
		{
			return offset;
		}
	}
	return offset;
});


var _Parser_consumeBase = F3(function(base, offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var digit = string.charCodeAt(offset) - 0x30;
		if (digit < 0 || base <= digit) break;
		total = base * total + digit;
	}
	return _Utils_Tuple2(offset, total);
});


var _Parser_consumeBase16 = F2(function(offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (0x30 <= code && code <= 0x39)
		{
			total = 16 * total + code - 0x30;
		}
		else if (0x41 <= code && code <= 0x46)
		{
			total = 16 * total + code - 55;
		}
		else if (0x61 <= code && code <= 0x66)
		{
			total = 16 * total + code - 87;
		}
		else
		{
			break;
		}
	}
	return _Utils_Tuple2(offset, total);
});



// FIND STRING


var _Parser_findSubString = F5(function(smallString, offset, row, col, bigString)
{
	var newOffset = bigString.indexOf(smallString, offset);
	var target = newOffset < 0 ? bigString.length : newOffset + smallString.length;

	while (offset < target)
	{
		var code = bigString.charCodeAt(offset++);
		code === 0x000A /* \n */
			? ( col=1, row++ )
			: ( col++, (code & 0xF800) === 0xD800 && offset++ )
	}

	return _Utils_Tuple3(newOffset, row, col);
});




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2(elm$json$Json$Decode$map, func, handler.a)
				:
			A3(elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		aD: func(record.aD),
		cU: record.cU,
		cR: record.cR
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.aD;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.cU;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.cR) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.fZ,
		impl.hF,
		impl.hb,
		function(sendToApp, initialModel) {
			var view = impl.hJ;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.fZ,
		impl.hF,
		impl.hb,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.bE && impl.bE(sendToApp)
			var view = impl.hJ;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.eI);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.hz) && (_VirtualDom_doc.title = title = doc.hz);
			});
		}
	);
});



// ANIMATION


var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.gs;
	var onUrlRequest = impl.gt;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		bE: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.download)
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.dU === next.dU
							&& curr.dq === next.dq
							&& curr.dP.a === next.dP.a
						)
							? elm$browser$Browser$Internal(next)
							: elm$browser$Browser$External(href)
					));
				}
			});
		},
		fZ: function(flags)
		{
			return A3(impl.fZ, flags, _Browser_getUrl(), key);
		},
		hJ: impl.hJ,
		hF: impl.hF,
		hb: impl.hb
	});
}

function _Browser_getUrl()
{
	return elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return elm$core$Result$isOk(result) ? elm$core$Maybe$Just(result.a) : elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { fM: 'hidden', bt: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { fM: 'mozHidden', bt: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { fM: 'msHidden', bt: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { fM: 'webkitHidden', bt: 'webkitvisibilitychange' }
		: { fM: 'hidden', bt: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail(elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		d1: _Browser_getScene(),
		cm: {
			A: _Browser_window.pageXOffset,
			ek: _Browser_window.pageYOffset,
			hL: _Browser_doc.documentElement.clientWidth,
			fL: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		hL: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		fL: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			d1: {
				hL: node.scrollWidth,
				fL: node.scrollHeight
			},
			cm: {
				A: node.scrollLeft,
				ek: node.scrollTop,
				hL: node.clientWidth,
				fL: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			d1: _Browser_getScene(),
			cm: {
				A: x,
				ek: y,
				hL: _Browser_doc.documentElement.clientWidth,
				fL: _Browser_doc.documentElement.clientHeight
			},
			dd: {
				A: x + rect.left,
				ek: y + rect.top,
				hL: rect.width,
				fL: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}
var author$project$Document$Container = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var elm$core$Basics$False = 1;
var elm$core$Basics$True = 0;
var elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var elm$core$Array$foldr = F3(
	function (func, baseCase, _n0) {
		var tree = _n0.c;
		var tail = _n0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3(elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3(elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			elm$core$Elm$JsArray$foldr,
			helper,
			A3(elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var elm$core$Basics$EQ = 1;
var elm$core$Basics$LT = 0;
var elm$core$List$cons = _List_cons;
var elm$core$Array$toList = function (array) {
	return A3(elm$core$Array$foldr, elm$core$List$cons, _List_Nil, array);
};
var elm$core$Basics$GT = 2;
var elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3(elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var elm$core$Dict$toList = function (dict) {
	return A3(
		elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var elm$core$Dict$keys = function (dict) {
	return A3(
		elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2(elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var elm$core$Set$toList = function (_n0) {
	var dict = _n0;
	return elm$core$Dict$keys(dict);
};
var elm$core$Basics$compare = _Utils_compare;
var elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var elm$core$Maybe$Nothing = {$: 1};
var elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _n1 = A2(elm$core$Basics$compare, targetKey, key);
				switch (_n1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var elm$core$Dict$member = F2(
	function (key, dict) {
		var _n0 = A2(elm$core$Dict$get, key, dict);
		if (!_n0.$) {
			return true;
		} else {
			return false;
		}
	});
var elm$core$Set$member = F2(
	function (key, _n0) {
		var dict = _n0;
		return A2(elm$core$Dict$member, key, dict);
	});
var author$project$Document$hasClass = F2(
	function (_class, document) {
		if (!document.$) {
			var nv = document.a;
			return A2(elm$core$Set$member, _class, nv.c.aj);
		} else {
			var lv = document.a;
			return A2(elm$core$Set$member, _class, lv.c.aj);
		}
	});
var author$project$Document$Cell = function (a) {
	return {$: 1, a: a};
};
var author$project$Document$setHtmlId = F2(
	function (sid, doc) {
		if (doc.$ === 1) {
			var cv = doc.a;
			var cellContent = cv.aa;
			var id = cv.c;
			var attrs = cv.p;
			return author$project$Document$Cell(
				_Utils_update(
					cv,
					{
						c: _Utils_update(
							id,
							{
								ao: elm$core$Maybe$Just(sid)
							})
					}));
		} else {
			var cv = doc.a;
			var containerLabel = cv.ak;
			var id = cv.c;
			var attrs = cv.p;
			var xs = doc.b;
			return A2(
				author$project$Document$Container,
				_Utils_update(
					cv,
					{
						c: _Utils_update(
							id,
							{
								ao: elm$core$Maybe$Just(sid)
							})
					}),
				xs);
		}
	});
var elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var elm$core$Basics$append = _Utils_append;
var elm$core$Basics$add = _Basics_add;
var elm$core$Basics$gt = _Utils_gt;
var elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var elm$core$List$reverse = function (list) {
	return A3(elm$core$List$foldl, elm$core$List$cons, _List_Nil, list);
};
var elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							elm$core$List$foldl,
							fn,
							acc,
							elm$core$List$reverse(r4)) : A4(elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4(elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3(elm$core$List$foldr, elm$core$List$cons, ys, xs);
		}
	});
var elm$core$List$concat = function (lists) {
	return A3(elm$core$List$foldr, elm$core$List$append, _List_Nil, lists);
};
var elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var elm$core$List$unzip = function (pairs) {
	var step = F2(
		function (_n0, _n1) {
			var x = _n0.a;
			var y = _n0.b;
			var xs = _n1.a;
			var ys = _n1.b;
			return _Utils_Tuple2(
				A2(elm$core$List$cons, x, xs),
				A2(elm$core$List$cons, y, ys));
		});
	return A3(
		elm$core$List$foldr,
		step,
		_Utils_Tuple2(_List_Nil, _List_Nil),
		pairs);
};
var elm$core$String$fromInt = _String_fromNumber;
var elm$core$Tuple$mapSecond = F2(
	function (func, _n0) {
		var x = _n0.a;
		var y = _n0.b;
		return _Utils_Tuple2(
			x,
			func(y));
	});
var author$project$Document$setSizeTrackedDocUids = function (document) {
	var htmlId = function (uid) {
		return 'sizeTracked' + elm$core$String$fromInt(uid);
	};
	if (!document.$) {
		var nv = document.a;
		var id = nv.c;
		var attrs = nv.p;
		var children = document.b;
		var _n1 = A2(
			elm$core$Tuple$mapSecond,
			elm$core$List$concat,
			elm$core$List$unzip(
				A2(elm$core$List$map, author$project$Document$setSizeTrackedDocUids, children)));
		var newChildren = _n1.a;
		var newUids = _n1.b;
		return A2(author$project$Document$hasClass, 'sameHeightImgsRow', document) ? _Utils_Tuple2(
			A2(
				author$project$Document$setHtmlId,
				htmlId(id.bc),
				document),
			A2(elm$core$List$cons, id.bc, newUids)) : _Utils_Tuple2(
			A2(author$project$Document$Container, nv, newChildren),
			newUids);
	} else {
		var lv = document.a;
		return _Utils_Tuple2(document, _List_Nil);
	}
};
var author$project$DocumentEditorHelpers$docSize = function (doc) {
	if (doc.$ === 1) {
		return 1;
	} else {
		var xs = doc.b;
		return A3(
			elm$core$List$foldr,
			F2(
				function (d, acc) {
					return author$project$DocumentEditorHelpers$docSize(d) + acc;
				}),
			1,
			xs);
	}
};
var author$project$DocumentZipper$initZip = function (doc) {
	return {e: _List_Nil, f: doc};
};
var author$project$Editor$CurrentViewport = function (a) {
	return {$: 0, a: a};
};
var author$project$Editor$EditCell = {$: 14};
var author$project$Editor$FilesysPluginMsg = function (a) {
	return {$: 34, a: a};
};
var author$project$Editor$ImagePluginMsg = function (a) {
	return {$: 37, a: a};
};
var author$project$Editor$MainInterfaceViewport = function (a) {
	return {$: 4, a: a};
};
var author$project$Editor$NoOp = {$: 49};
var author$project$Editor$PreviewBigScreen = 0;
var author$project$Editor$RefreshSizes = {$: 3};
var author$project$Editor$Rewind = {$: 11};
var author$project$Editor$SelectDoc = function (a) {
	return {$: 8, a: a};
};
var author$project$Editor$TablePluginMsg = function (a) {
	return {$: 35, a: a};
};
var author$project$Editor$TextBlockPluginMsg = function (a) {
	return {$: 36, a: a};
};
var author$project$Editor$VideoPluginMsg = function (a) {
	return {$: 38, a: a};
};
var elm$core$Basics$identity = function (x) {
	return x;
};
var author$project$Editor$cmdPort = _Platform_outgoingPort('cmdPort', elm$core$Basics$identity);
var author$project$FilesysPlugin$ImagesRoot = 0;
var author$project$FilesysPlugin$ReadOnly = 0;
var author$project$FilesysPlugin$RefreshFilesys = F2(
	function (a, b) {
		return {$: 9, a: a, b: b};
	});
var elm$core$Array$branchFactor = 32;
var elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var elm$core$Basics$ceiling = _Basics_ceiling;
var elm$core$Basics$fdiv = _Basics_fdiv;
var elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var elm$core$Basics$toFloat = _Basics_toFloat;
var elm$core$Array$shiftStep = elm$core$Basics$ceiling(
	A2(elm$core$Basics$logBase, 2, elm$core$Array$branchFactor));
var elm$core$Elm$JsArray$empty = _JsArray_empty;
var elm$core$Array$empty = A4(elm$core$Array$Array_elm_builtin, 0, elm$core$Array$shiftStep, elm$core$Elm$JsArray$empty, elm$core$Elm$JsArray$empty);
var elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _n0 = A2(elm$core$Elm$JsArray$initializeFromList, elm$core$Array$branchFactor, nodes);
			var node = _n0.a;
			var remainingNodes = _n0.b;
			var newAcc = A2(
				elm$core$List$cons,
				elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var elm$core$Basics$eq = _Utils_equal;
var elm$core$Tuple$first = function (_n0) {
	var x = _n0.a;
	return x;
};
var elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = elm$core$Basics$ceiling(nodeListSize / elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2(elm$core$Elm$JsArray$initializeFromList, elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2(elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var elm$core$Basics$floor = _Basics_floor;
var elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var elm$core$Basics$mul = _Basics_mul;
var elm$core$Basics$sub = _Basics_sub;
var elm$core$Elm$JsArray$length = _JsArray_length;
var elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.t) {
			return A4(
				elm$core$Array$Array_elm_builtin,
				elm$core$Elm$JsArray$length(builder.v),
				elm$core$Array$shiftStep,
				elm$core$Elm$JsArray$empty,
				builder.v);
		} else {
			var treeLen = builder.t * elm$core$Array$branchFactor;
			var depth = elm$core$Basics$floor(
				A2(elm$core$Basics$logBase, elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? elm$core$List$reverse(builder.x) : builder.x;
			var tree = A2(elm$core$Array$treeFromBuilder, correctNodeList, builder.t);
			return A4(
				elm$core$Array$Array_elm_builtin,
				elm$core$Elm$JsArray$length(builder.v) + treeLen,
				A2(elm$core$Basics$max, 5, depth * elm$core$Array$shiftStep),
				tree,
				builder.v);
		}
	});
var elm$core$Basics$idiv = _Basics_idiv;
var elm$core$Basics$lt = _Utils_lt;
var elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					elm$core$Array$builderToArray,
					false,
					{x: nodeList, t: (len / elm$core$Array$branchFactor) | 0, v: tail});
			} else {
				var leaf = elm$core$Array$Leaf(
					A3(elm$core$Elm$JsArray$initialize, elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2(elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var elm$core$Basics$le = _Utils_le;
var elm$core$Basics$remainderBy = _Basics_remainderBy;
var elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return elm$core$Array$empty;
		} else {
			var tailLen = len % elm$core$Array$branchFactor;
			var tail = A3(elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - elm$core$Array$branchFactor;
			return A5(elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var elm$core$Basics$and = _Basics_and;
var elm$core$Basics$or = _Basics_or;
var elm$core$Char$toCode = _Char_toCode;
var elm$core$Char$isLower = function (_char) {
	var code = elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var elm$core$Char$isUpper = function (_char) {
	var code = elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var elm$core$Char$isAlpha = function (_char) {
	return elm$core$Char$isLower(_char) || elm$core$Char$isUpper(_char);
};
var elm$core$Char$isDigit = function (_char) {
	var code = elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var elm$core$Char$isAlphaNum = function (_char) {
	return elm$core$Char$isLower(_char) || (elm$core$Char$isUpper(_char) || elm$core$Char$isDigit(_char));
};
var elm$core$List$length = function (xs) {
	return A3(
		elm$core$List$foldl,
		F2(
			function (_n0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var elm$core$List$map2 = _List_map2;
var elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2(elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var elm$core$List$range = F2(
	function (lo, hi) {
		return A3(elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			elm$core$List$map2,
			f,
			A2(
				elm$core$List$range,
				0,
				elm$core$List$length(xs) - 1),
			xs);
	});
var elm$core$String$all = _String_all;
var elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var elm$core$String$uncons = _String_uncons;
var elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var elm$json$Json$Decode$indent = function (str) {
	return A2(
		elm$core$String$join,
		'\n    ',
		A2(elm$core$String$split, '\n', str));
};
var elm$json$Json$Encode$encode = _Json_encode;
var elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + (elm$core$String$fromInt(i + 1) + (') ' + elm$json$Json$Decode$indent(
			elm$json$Json$Decode$errorToString(error))));
	});
var elm$json$Json$Decode$errorToString = function (error) {
	return A2(elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _n1 = elm$core$String$uncons(f);
						if (_n1.$ === 1) {
							return false;
						} else {
							var _n2 = _n1.a;
							var _char = _n2.a;
							var rest = _n2.b;
							return elm$core$Char$isAlpha(_char) && A2(elm$core$String$all, elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2(elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + (elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2(elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									elm$core$String$join,
									'',
									elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										elm$core$String$join,
										'',
										elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + (elm$core$String$fromInt(
								elm$core$List$length(errors)) + ' ways:'));
							return A2(
								elm$core$String$join,
								'\n\n',
								A2(
									elm$core$List$cons,
									introduction,
									A2(elm$core$List$indexedMap, elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								elm$core$String$join,
								'',
								elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + (elm$json$Json$Decode$indent(
						A2(elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var elm$json$Json$Decode$map2 = _Json_map2;
var NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom = elm$json$Json$Decode$map2(elm$core$Basics$apR);
var elm$json$Json$Decode$field = _Json_decodeField;
var NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required = F3(
	function (key, valDecoder, decoder) {
		return A2(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A2(elm$json$Json$Decode$field, key, valDecoder),
			decoder);
	});
var author$project$FilesysPlugin$File = function (a) {
	return {$: 1, a: a};
};
var elm$json$Json$Decode$string = _Json_decodeString;
var elm$json$Json$Decode$succeed = _Json_succeed;
var author$project$FilesysPlugin$decodeImage = A3(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'name',
	elm$json$Json$Decode$string,
	A3(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'path',
		elm$json$Json$Decode$string,
		elm$json$Json$Decode$succeed(
			F2(
				function (p, f) {
					return author$project$FilesysPlugin$File(
						{
							X: f,
							af: A2(elm$core$String$split, '/', p)
						});
				}))));
var elm$json$Json$Decode$list = _Json_decodeList;
var author$project$FilesysPlugin$decodeImages = elm$json$Json$Decode$list(author$project$FilesysPlugin$decodeImage);
var elm$core$Platform$Cmd$batch = _Platform_batch;
var elm$core$Platform$Cmd$none = elm$core$Platform$Cmd$batch(_List_Nil);
var elm$http$Http$Internal$EmptyBody = {$: 0};
var elm$http$Http$emptyBody = elm$http$Http$Internal$EmptyBody;
var elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var elm$core$Dict$empty = elm$core$Dict$RBEmpty_elm_builtin;
var elm$core$Dict$Black = 1;
var elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var elm$core$Dict$Red = 0;
var elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _n1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _n3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5(elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5(elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _n5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _n6 = left.d;
				var _n7 = _n6.a;
				var llK = _n6.b;
				var llV = _n6.c;
				var llLeft = _n6.d;
				var llRight = _n6.e;
				var lRight = left.e;
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5(elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5(elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5(elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5(elm$core$Dict$RBNode_elm_builtin, 0, key, value, elm$core$Dict$RBEmpty_elm_builtin, elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _n1 = A2(elm$core$Basics$compare, key, nKey);
			switch (_n1) {
				case 0:
					return A5(
						elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3(elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5(elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3(elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _n0 = A3(elm$core$Dict$insertHelp, key, value, dict);
		if ((_n0.$ === -1) && (!_n0.a)) {
			var _n1 = _n0.a;
			var k = _n0.b;
			var v = _n0.c;
			var l = _n0.d;
			var r = _n0.e;
			return A5(elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _n0;
			return x;
		}
	});
var elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _n1 = dict.d;
			var lClr = _n1.a;
			var lK = _n1.b;
			var lV = _n1.c;
			var lLeft = _n1.d;
			var lRight = _n1.e;
			var _n2 = dict.e;
			var rClr = _n2.a;
			var rK = _n2.b;
			var rV = _n2.c;
			var rLeft = _n2.d;
			var _n3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _n2.e;
			return A5(
				elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5(elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _n4 = dict.d;
			var lClr = _n4.a;
			var lK = _n4.b;
			var lV = _n4.c;
			var lLeft = _n4.d;
			var lRight = _n4.e;
			var _n5 = dict.e;
			var rClr = _n5.a;
			var rK = _n5.b;
			var rV = _n5.c;
			var rLeft = _n5.d;
			var rRight = _n5.e;
			if (clr === 1) {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _n1 = dict.d;
			var lClr = _n1.a;
			var lK = _n1.b;
			var lV = _n1.c;
			var _n2 = _n1.d;
			var _n3 = _n2.a;
			var llK = _n2.b;
			var llV = _n2.c;
			var llLeft = _n2.d;
			var llRight = _n2.e;
			var lRight = _n1.e;
			var _n4 = dict.e;
			var rClr = _n4.a;
			var rK = _n4.b;
			var rV = _n4.c;
			var rLeft = _n4.d;
			var rRight = _n4.e;
			return A5(
				elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5(elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5(elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _n5 = dict.d;
			var lClr = _n5.a;
			var lK = _n5.b;
			var lV = _n5.c;
			var lLeft = _n5.d;
			var lRight = _n5.e;
			var _n6 = dict.e;
			var rClr = _n6.a;
			var rK = _n6.b;
			var rV = _n6.c;
			var rLeft = _n6.d;
			var rRight = _n6.e;
			if (clr === 1) {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _n1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5(elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_n2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _n3 = right.a;
							var _n4 = right.d;
							var _n5 = _n4.a;
							return elm$core$Dict$moveRedRight(dict);
						} else {
							break _n2$2;
						}
					} else {
						var _n6 = right.a;
						var _n7 = right.d;
						return elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _n2$2;
				}
			}
			return dict;
		}
	});
var elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _n3 = lLeft.a;
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					elm$core$Dict$removeMin(left),
					right);
			} else {
				var _n4 = elm$core$Dict$moveRedLeft(dict);
				if (_n4.$ === -1) {
					var nColor = _n4.a;
					var nKey = _n4.b;
					var nValue = _n4.c;
					var nLeft = _n4.d;
					var nRight = _n4.e;
					return A5(
						elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _n4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _n6 = lLeft.a;
						return A5(
							elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2(elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _n7 = elm$core$Dict$moveRedLeft(dict);
						if (_n7.$ === -1) {
							var nColor = _n7.a;
							var nKey = _n7.b;
							var nValue = _n7.c;
							var nLeft = _n7.d;
							var nRight = _n7.e;
							return A5(
								elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2(elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2(elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7(elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _n1 = elm$core$Dict$getMin(right);
				if (_n1.$ === -1) {
					var minKey = _n1.b;
					var minValue = _n1.c;
					return A5(
						elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						elm$core$Dict$removeMin(right));
				} else {
					return elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2(elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var elm$core$Dict$remove = F2(
	function (key, dict) {
		var _n0 = A2(elm$core$Dict$removeHelp, key, dict);
		if ((_n0.$ === -1) && (!_n0.a)) {
			var _n1 = _n0.a;
			var k = _n0.b;
			var v = _n0.c;
			var l = _n0.d;
			var r = _n0.e;
			return A5(elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _n0;
			return x;
		}
	});
var elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _n0 = alter(
			A2(elm$core$Dict$get, targetKey, dictionary));
		if (!_n0.$) {
			var value = _n0.a;
			return A3(elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2(elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var elm$core$Maybe$isJust = function (maybe) {
	if (!maybe.$) {
		return true;
	} else {
		return false;
	}
};
var elm$core$Result$map = F2(
	function (func, ra) {
		if (!ra.$) {
			var a = ra.a;
			return elm$core$Result$Ok(
				func(a));
		} else {
			var e = ra.a;
			return elm$core$Result$Err(e);
		}
	});
var elm$http$Http$BadPayload = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var elm$http$Http$BadStatus = function (a) {
	return {$: 3, a: a};
};
var elm$http$Http$BadUrl = function (a) {
	return {$: 0, a: a};
};
var elm$http$Http$NetworkError = {$: 2};
var elm$http$Http$Timeout = {$: 1};
var elm$http$Http$Internal$FormDataBody = function (a) {
	return {$: 2, a: a};
};
var elm$http$Http$Internal$isStringBody = function (body) {
	if (body.$ === 1) {
		return true;
	} else {
		return false;
	}
};
var elm$http$Http$expectStringResponse = _Http_expectStringResponse;
var elm$json$Json$Decode$decodeString = _Json_runOnString;
var elm$http$Http$expectJson = function (decoder) {
	return elm$http$Http$expectStringResponse(
		function (response) {
			var _n0 = A2(elm$json$Json$Decode$decodeString, decoder, response.eI);
			if (_n0.$ === 1) {
				var decodeError = _n0.a;
				return elm$core$Result$Err(
					elm$json$Json$Decode$errorToString(decodeError));
			} else {
				var value = _n0.a;
				return elm$core$Result$Ok(value);
			}
		});
};
var elm$http$Http$Internal$Request = elm$core$Basics$identity;
var elm$http$Http$request = elm$core$Basics$identity;
var elm$http$Http$get = F2(
	function (url, decoder) {
		return elm$http$Http$request(
			{
				eI: elm$http$Http$emptyBody,
				cz: elm$http$Http$expectJson(decoder),
				b2: _List_Nil,
				cO: 'GET',
				cW: elm$core$Maybe$Nothing,
				hG: url,
				c_: false
			});
	});
var elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var elm$core$Task$Perform = elm$core$Basics$identity;
var elm$core$Task$andThen = _Scheduler_andThen;
var elm$core$Task$succeed = _Scheduler_succeed;
var elm$core$Task$init = elm$core$Task$succeed(0);
var elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			elm$core$Task$andThen,
			function (a) {
				return elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			elm$core$Task$andThen,
			function (a) {
				return A2(
					elm$core$Task$andThen,
					function (b) {
						return elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var elm$core$Task$sequence = function (tasks) {
	return A3(
		elm$core$List$foldr,
		elm$core$Task$map2(elm$core$List$cons),
		elm$core$Task$succeed(_List_Nil),
		tasks);
};
var elm$core$Platform$sendToApp = _Platform_sendToApp;
var elm$core$Task$spawnCmd = F2(
	function (router, _n0) {
		var task = _n0;
		return _Scheduler_spawn(
			A2(
				elm$core$Task$andThen,
				elm$core$Platform$sendToApp(router),
				task));
	});
var elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			elm$core$Task$map,
			function (_n0) {
				return 0;
			},
			elm$core$Task$sequence(
				A2(
					elm$core$List$map,
					elm$core$Task$spawnCmd(router),
					commands)));
	});
var elm$core$Task$onSelfMsg = F3(
	function (_n0, _n1, _n2) {
		return elm$core$Task$succeed(0);
	});
var elm$core$Task$cmdMap = F2(
	function (tagger, _n0) {
		var task = _n0;
		return A2(elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager(elm$core$Task$init, elm$core$Task$onEffects, elm$core$Task$onSelfMsg, elm$core$Task$cmdMap);
var elm$core$Task$command = _Platform_leaf('Task');
var elm$core$Task$onError = _Scheduler_onError;
var elm$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return elm$core$Task$command(
			A2(
				elm$core$Task$onError,
				A2(
					elm$core$Basics$composeL,
					A2(elm$core$Basics$composeL, elm$core$Task$succeed, resultToMessage),
					elm$core$Result$Err),
				A2(
					elm$core$Task$andThen,
					A2(
						elm$core$Basics$composeL,
						A2(elm$core$Basics$composeL, elm$core$Task$succeed, resultToMessage),
						elm$core$Result$Ok),
					task)));
	});
var elm$http$Http$toTask = function (_n0) {
	var request_ = _n0;
	return A2(_Http_toTask, request_, elm$core$Maybe$Nothing);
};
var elm$http$Http$send = F2(
	function (resultToMessage, request_) {
		return A2(
			elm$core$Task$attempt,
			resultToMessage,
			elm$http$Http$toTask(request_));
	});
var author$project$FilesysPlugin$getFileList = function (root) {
	if (!root) {
		return A2(
			elm$http$Http$send,
			author$project$FilesysPlugin$RefreshFilesys(root),
			A2(elm$http$Http$get, 'http://localhost:3000/images', author$project$FilesysPlugin$decodeImages));
	} else {
		return elm$core$Platform$Cmd$none;
	}
};
var elm$core$Platform$Cmd$map = _Platform_map;
var author$project$FilesysPlugin$init = F3(
	function (root, displayMode, externalMsg) {
		return _Utils_Tuple2(
			{dc: displayMode, cy: '', fx: externalMsg, U: _List_Nil, n: elm$core$Maybe$Nothing, dX: '', cT: root, cj: _List_Nil},
			A2(
				elm$core$Platform$Cmd$map,
				externalMsg,
				author$project$FilesysPlugin$getFileList(root)));
	});
var author$project$DocumentEditorHelpers$ACenter = 1;
var author$project$DocumentEditorHelpers$ALeft = 2;
var author$project$DocumentEditorHelpers$ARight = 0;
var author$project$DocumentEditorHelpers$findAlignment = function (attrs) {
	var helper = function (xs) {
		helper:
		while (true) {
			if (!xs.b) {
				return 1;
			} else {
				switch (xs.a.$) {
					case 2:
						var _n1 = xs.a;
						return 0;
					case 3:
						var _n2 = xs.a;
						return 2;
					default:
						var y = xs.a;
						var ys = xs.b;
						var $temp$xs = ys;
						xs = $temp$xs;
						continue helper;
				}
			}
		}
	};
	return helper(attrs);
};
var author$project$ImagePlugin$ImageAttributeEditor = {$: 0};
var elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (!maybeValue.$) {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return elm$core$Maybe$Nothing;
		}
	});
var elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return elm$core$Maybe$Just(
				f(value));
		} else {
			return elm$core$Maybe$Nothing;
		}
	});
var elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var elm$core$Tuple$second = function (_n0) {
	var y = _n0.b;
	return y;
};
var author$project$ImagePlugin$init = F2(
	function (mbInput, externalMsg) {
		return _Utils_Tuple2(
			{
				aP: A2(
					elm$core$Maybe$withDefault,
					1,
					A2(
						elm$core$Maybe$map,
						A2(elm$core$Basics$composeL, author$project$DocumentEditorHelpers$findAlignment, elm$core$Tuple$second),
						mbInput)),
				av: false,
				b_: elm$core$Maybe$Nothing,
				Q: elm$core$Maybe$Nothing,
				R: 0,
				S: elm$core$Maybe$Nothing,
				fx: externalMsg,
				c: 'InputId',
				cJ: A2(
					elm$core$Maybe$withDefault,
					_List_Nil,
					A2(elm$core$Maybe$map, elm$core$Tuple$second, mbInput)),
				a_: A2(
					elm$core$Maybe$andThen,
					A2(
						elm$core$Basics$composeL,
						function ($) {
							return $.eV;
						},
						elm$core$Tuple$first),
					mbInput),
				aq: elm$core$Maybe$Nothing,
				aC: A2(elm$core$Maybe$map, elm$core$Tuple$first, mbInput),
				bh: elm$core$Maybe$Nothing,
				V: elm$core$Maybe$Nothing,
				W: elm$core$Maybe$Nothing,
				ar: author$project$ImagePlugin$ImageAttributeEditor,
				aE: false,
				aF: false,
				ba: elm$core$Maybe$Nothing,
				bo: 100
			},
			A2(elm$core$Platform$Cmd$map, externalMsg, elm$core$Platform$Cmd$none));
	});
var elm$core$Dict$fromList = function (assocs) {
	return A3(
		elm$core$List$foldl,
		F2(
			function (_n0, dict) {
				var key = _n0.a;
				var value = _n0.b;
				return A3(elm$core$Dict$insert, key, value, dict);
			}),
		elm$core$Dict$empty,
		assocs);
};
var mdgriffith$elm_ui$Internal$Model$AlignX = function (a) {
	return {$: 6, a: a};
};
var mdgriffith$elm_ui$Internal$Model$CenterX = 1;
var mdgriffith$elm_ui$Element$centerX = mdgriffith$elm_ui$Internal$Model$AlignX(1);
var elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var mdgriffith$elm_ui$Internal$Flag$Flag = function (a) {
	return {$: 0, a: a};
};
var mdgriffith$elm_ui$Internal$Flag$Second = function (a) {
	return {$: 1, a: a};
};
var mdgriffith$elm_ui$Internal$Flag$flag = function (i) {
	return (i > 31) ? mdgriffith$elm_ui$Internal$Flag$Second(1 << (i - 32)) : mdgriffith$elm_ui$Internal$Flag$Flag(1 << i);
};
var mdgriffith$elm_ui$Internal$Flag$overflow = mdgriffith$elm_ui$Internal$Flag$flag(20);
var mdgriffith$elm_ui$Internal$Model$Class = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var mdgriffith$elm_ui$Internal$Style$classes = {en: 'a', cn: 'atv', eq: 'ab', er: 'cx', es: 'cy', et: 'acb', eu: 'accx', ev: 'accy', ew: 'acr', c2: 'al', c3: 'ar', ex: 'at', co: 'ah', cp: 'av', eA: 's', eF: 'bh', eG: 'b', eJ: 'w7', eL: 'bd', eM: 'bdt', bQ: 'bn', eN: 'bs', bS: 'cpe', e0: 'cp', e1: 'cpx', e2: 'cpy', aw: 'c', bU: 'ctr', bV: 'cb', bW: 'ccx', ax: 'ccy', bv: 'cl', bX: 'cr', fd: 'ct', fj: 'cptr', fk: 'ctxt', fC: 'fcs', fF: 'fs', fI: 'g', cH: 'hbh', b3: 'hc', cI: 'hf', $7: 'hfp', fO: 'hv', fS: 'ic', fX: 'fr', f_: 'iml', f$: 'it', f2: 'i', bi: 'nb', dE: 'notxt', gp: 'ol', gr: 'or', a5: 'oq', gw: 'oh', dK: 'pg', dM: 'p', gz: 'ppe', cT: 'ui', d$: 'r', gO: 'sb', gP: 'sbx', gQ: 'sby', gR: 'sbt', gY: 'e', gZ: 'cap', g$: 'sev', g6: 'sk', ec: 't', hh: 'tc', hj: 'w8', hk: 'w2', hl: 'w9', hm: 'tj', ck: 'tja', hn: 'tl', ho: 'w3', hp: 'w5', hq: 'w4', hr: 'tr', hs: 'w6', hu: 'w1', hv: 'tun', ee: 'ts', bb: 'clr', hE: 'u', cY: 'wc', ei: 'we', cZ: 'wf', ej: 'wfp', c$: 'wrp'};
var mdgriffith$elm_ui$Element$clip = A2(mdgriffith$elm_ui$Internal$Model$Class, mdgriffith$elm_ui$Internal$Flag$overflow, mdgriffith$elm_ui$Internal$Style$classes.e0);
var mdgriffith$elm_ui$Internal$Model$Fill = function (a) {
	return {$: 2, a: a};
};
var mdgriffith$elm_ui$Element$fill = mdgriffith$elm_ui$Internal$Model$Fill(1);
var mdgriffith$elm_ui$Internal$Model$Height = function (a) {
	return {$: 8, a: a};
};
var mdgriffith$elm_ui$Element$height = mdgriffith$elm_ui$Internal$Model$Height;
var mdgriffith$elm_ui$Internal$Model$Max = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var mdgriffith$elm_ui$Element$maximum = F2(
	function (i, l) {
		return A2(mdgriffith$elm_ui$Internal$Model$Max, i, l);
	});
var mdgriffith$elm_ui$Internal$Flag$padding = mdgriffith$elm_ui$Internal$Flag$flag(2);
var mdgriffith$elm_ui$Internal$Model$PaddingStyle = F5(
	function (a, b, c, d, e) {
		return {$: 7, a: a, b: b, c: c, d: d, e: e};
	});
var mdgriffith$elm_ui$Internal$Model$StyleClass = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var mdgriffith$elm_ui$Element$padding = function (x) {
	return A2(
		mdgriffith$elm_ui$Internal$Model$StyleClass,
		mdgriffith$elm_ui$Internal$Flag$padding,
		A5(
			mdgriffith$elm_ui$Internal$Model$PaddingStyle,
			'p-' + elm$core$String$fromInt(x),
			x,
			x,
			x,
			x));
};
var mdgriffith$elm_ui$Element$paddingXY = F2(
	function (x, y) {
		return _Utils_eq(x, y) ? A2(
			mdgriffith$elm_ui$Internal$Model$StyleClass,
			mdgriffith$elm_ui$Internal$Flag$padding,
			A5(
				mdgriffith$elm_ui$Internal$Model$PaddingStyle,
				'p-' + elm$core$String$fromInt(x),
				x,
				x,
				x,
				x)) : A2(
			mdgriffith$elm_ui$Internal$Model$StyleClass,
			mdgriffith$elm_ui$Internal$Flag$padding,
			A5(
				mdgriffith$elm_ui$Internal$Model$PaddingStyle,
				'p-' + (elm$core$String$fromInt(x) + ('-' + elm$core$String$fromInt(y))),
				y,
				x,
				y,
				x));
	});
var mdgriffith$elm_ui$Internal$Model$Rgba = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var mdgriffith$elm_ui$Element$rgb = F3(
	function (r, g, b) {
		return A4(mdgriffith$elm_ui$Internal$Model$Rgba, r, g, b, 1);
	});
var mdgriffith$elm_ui$Element$rgba = mdgriffith$elm_ui$Internal$Model$Rgba;
var mdgriffith$elm_ui$Internal$Flag$spacing = mdgriffith$elm_ui$Internal$Flag$flag(3);
var mdgriffith$elm_ui$Element$spaceEvenly = A2(mdgriffith$elm_ui$Internal$Model$Class, mdgriffith$elm_ui$Internal$Flag$spacing, mdgriffith$elm_ui$Internal$Style$classes.g$);
var mdgriffith$elm_ui$Internal$Model$SpacingStyle = F3(
	function (a, b, c) {
		return {$: 5, a: a, b: b, c: c};
	});
var mdgriffith$elm_ui$Internal$Model$spacingName = F2(
	function (x, y) {
		return 'spacing-' + (elm$core$String$fromInt(x) + ('-' + elm$core$String$fromInt(y)));
	});
var mdgriffith$elm_ui$Element$spacing = function (x) {
	return A2(
		mdgriffith$elm_ui$Internal$Model$StyleClass,
		mdgriffith$elm_ui$Internal$Flag$spacing,
		A3(
			mdgriffith$elm_ui$Internal$Model$SpacingStyle,
			A2(mdgriffith$elm_ui$Internal$Model$spacingName, x, x),
			x,
			x));
};
var mdgriffith$elm_ui$Internal$Model$Width = function (a) {
	return {$: 7, a: a};
};
var mdgriffith$elm_ui$Element$width = mdgriffith$elm_ui$Internal$Model$Width;
var mdgriffith$elm_ui$Internal$Flag$bgColor = mdgriffith$elm_ui$Internal$Flag$flag(8);
var mdgriffith$elm_ui$Internal$Model$Colored = F3(
	function (a, b, c) {
		return {$: 4, a: a, b: b, c: c};
	});
var elm$core$Basics$round = _Basics_round;
var mdgriffith$elm_ui$Internal$Model$floatClass = function (x) {
	return elm$core$String$fromInt(
		elm$core$Basics$round(x * 255));
};
var mdgriffith$elm_ui$Internal$Model$formatColorClass = function (_n0) {
	var red = _n0.a;
	var green = _n0.b;
	var blue = _n0.c;
	var alpha = _n0.d;
	return mdgriffith$elm_ui$Internal$Model$floatClass(red) + ('-' + (mdgriffith$elm_ui$Internal$Model$floatClass(green) + ('-' + (mdgriffith$elm_ui$Internal$Model$floatClass(blue) + ('-' + mdgriffith$elm_ui$Internal$Model$floatClass(alpha))))));
};
var mdgriffith$elm_ui$Element$Background$color = function (clr) {
	return A2(
		mdgriffith$elm_ui$Internal$Model$StyleClass,
		mdgriffith$elm_ui$Internal$Flag$bgColor,
		A3(
			mdgriffith$elm_ui$Internal$Model$Colored,
			'bg-' + mdgriffith$elm_ui$Internal$Model$formatColorClass(clr),
			'background-color',
			clr));
};
var mdgriffith$elm_ui$Internal$Flag$shadows = mdgriffith$elm_ui$Internal$Flag$flag(19);
var mdgriffith$elm_ui$Internal$Model$Single = F3(
	function (a, b, c) {
		return {$: 3, a: a, b: b, c: c};
	});
var elm$core$String$concat = function (strings) {
	return A2(elm$core$String$join, '', strings);
};
var elm$core$String$fromFloat = _String_fromNumber;
var mdgriffith$elm_ui$Internal$Model$boxShadowName = function (shadow) {
	return elm$core$String$concat(
		_List_fromArray(
			[
				shadow.dt ? 'box-inset' : 'box-',
				elm$core$String$fromFloat(shadow.gn.a) + 'px',
				elm$core$String$fromFloat(shadow.gn.b) + 'px',
				elm$core$String$fromFloat(shadow.eH) + 'px',
				elm$core$String$fromFloat(shadow.d7) + 'px',
				mdgriffith$elm_ui$Internal$Model$formatColorClass(shadow.e4)
			]));
};
var elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _n0 = f(mx);
		if (!_n0.$) {
			var x = _n0.a;
			return A2(elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			elm$core$List$foldr,
			elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var mdgriffith$elm_ui$Internal$Model$formatColor = function (_n0) {
	var red = _n0.a;
	var green = _n0.b;
	var blue = _n0.c;
	var alpha = _n0.d;
	return 'rgba(' + (elm$core$String$fromInt(
		elm$core$Basics$round(red * 255)) + ((',' + elm$core$String$fromInt(
		elm$core$Basics$round(green * 255))) + ((',' + elm$core$String$fromInt(
		elm$core$Basics$round(blue * 255))) + (',' + (elm$core$String$fromFloat(alpha) + ')')))));
};
var mdgriffith$elm_ui$Internal$Model$formatBoxShadow = function (shadow) {
	return A2(
		elm$core$String$join,
		' ',
		A2(
			elm$core$List$filterMap,
			elm$core$Basics$identity,
			_List_fromArray(
				[
					shadow.dt ? elm$core$Maybe$Just('inset') : elm$core$Maybe$Nothing,
					elm$core$Maybe$Just(
					elm$core$String$fromFloat(shadow.gn.a) + 'px'),
					elm$core$Maybe$Just(
					elm$core$String$fromFloat(shadow.gn.b) + 'px'),
					elm$core$Maybe$Just(
					elm$core$String$fromFloat(shadow.eH) + 'px'),
					elm$core$Maybe$Just(
					elm$core$String$fromFloat(shadow.d7) + 'px'),
					elm$core$Maybe$Just(
					mdgriffith$elm_ui$Internal$Model$formatColor(shadow.e4))
				])));
};
var mdgriffith$elm_ui$Element$Border$shadow = function (almostShade) {
	var shade = {eH: almostShade.eH, e4: almostShade.e4, dt: false, gn: almostShade.gn, d7: almostShade.d7};
	return A2(
		mdgriffith$elm_ui$Internal$Model$StyleClass,
		mdgriffith$elm_ui$Internal$Flag$shadows,
		A3(
			mdgriffith$elm_ui$Internal$Model$Single,
			mdgriffith$elm_ui$Internal$Model$boxShadowName(shade),
			'box-shadow',
			mdgriffith$elm_ui$Internal$Model$formatBoxShadow(shade)));
};
var mdgriffith$elm_ui$Internal$Flag$fontWeight = mdgriffith$elm_ui$Internal$Flag$flag(13);
var mdgriffith$elm_ui$Element$Font$bold = A2(mdgriffith$elm_ui$Internal$Model$Class, mdgriffith$elm_ui$Internal$Flag$fontWeight, mdgriffith$elm_ui$Internal$Style$classes.eJ);
var mdgriffith$elm_ui$Internal$Flag$fontAlignment = mdgriffith$elm_ui$Internal$Flag$flag(12);
var mdgriffith$elm_ui$Element$Font$center = A2(mdgriffith$elm_ui$Internal$Model$Class, mdgriffith$elm_ui$Internal$Flag$fontAlignment, mdgriffith$elm_ui$Internal$Style$classes.hh);
var mdgriffith$elm_ui$Internal$Flag$fontColor = mdgriffith$elm_ui$Internal$Flag$flag(14);
var mdgriffith$elm_ui$Element$Font$color = function (fontColor) {
	return A2(
		mdgriffith$elm_ui$Internal$Model$StyleClass,
		mdgriffith$elm_ui$Internal$Flag$fontColor,
		A3(
			mdgriffith$elm_ui$Internal$Model$Colored,
			'fc-' + mdgriffith$elm_ui$Internal$Model$formatColorClass(fontColor),
			'color',
			fontColor));
};
var mdgriffith$elm_ui$Internal$Flag$fontFamily = mdgriffith$elm_ui$Internal$Flag$flag(5);
var mdgriffith$elm_ui$Internal$Model$FontFamily = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var elm$core$String$toLower = _String_toLower;
var elm$core$String$words = _String_words;
var mdgriffith$elm_ui$Internal$Model$renderFontClassName = F2(
	function (font, current) {
		return _Utils_ap(
			current,
			function () {
				switch (font.$) {
					case 0:
						return 'serif';
					case 1:
						return 'sans-serif';
					case 2:
						return 'monospace';
					case 3:
						var name = font.a;
						return A2(
							elm$core$String$join,
							'-',
							elm$core$String$words(
								elm$core$String$toLower(name)));
					case 4:
						var name = font.a;
						var url = font.b;
						return A2(
							elm$core$String$join,
							'-',
							elm$core$String$words(
								elm$core$String$toLower(name)));
					default:
						var name = font.a.X;
						return A2(
							elm$core$String$join,
							'-',
							elm$core$String$words(
								elm$core$String$toLower(name)));
				}
			}());
	});
var mdgriffith$elm_ui$Element$Font$family = function (families) {
	return A2(
		mdgriffith$elm_ui$Internal$Model$StyleClass,
		mdgriffith$elm_ui$Internal$Flag$fontFamily,
		A2(
			mdgriffith$elm_ui$Internal$Model$FontFamily,
			A3(elm$core$List$foldl, mdgriffith$elm_ui$Internal$Model$renderFontClassName, 'ff-', families),
			families));
};
var mdgriffith$elm_ui$Internal$Flag$fontSize = mdgriffith$elm_ui$Internal$Flag$flag(4);
var mdgriffith$elm_ui$Internal$Model$FontSize = function (a) {
	return {$: 2, a: a};
};
var mdgriffith$elm_ui$Element$Font$size = function (i) {
	return A2(
		mdgriffith$elm_ui$Internal$Model$StyleClass,
		mdgriffith$elm_ui$Internal$Flag$fontSize,
		mdgriffith$elm_ui$Internal$Model$FontSize(i));
};
var mdgriffith$elm_ui$Internal$Model$Typeface = function (a) {
	return {$: 3, a: a};
};
var mdgriffith$elm_ui$Element$Font$typeface = mdgriffith$elm_ui$Internal$Model$Typeface;
var author$project$StyleSheets$defaulStyleSheet = {
	e5: _List_fromArray(
		[
			mdgriffith$elm_ui$Element$spacing(15),
			mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill)
		]),
	fm: {
		aj: elm$core$Dict$fromList(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'colImg',
					_List_fromArray(
						[mdgriffith$elm_ui$Element$centerX])),
					_Utils_Tuple2('rowImg', _List_Nil),
					_Utils_Tuple2(
					'selected',
					_List_fromArray(
						[
							mdgriffith$elm_ui$Element$Border$shadow(
							{
								eH: 10,
								e4: A4(mdgriffith$elm_ui$Element$rgba, 0, 0, 0, 0.45),
								gn: _Utils_Tuple2(4, 4),
								d7: 5
							})
						])),
					_Utils_Tuple2(
					'sameHeightImgsRow',
					_List_fromArray(
						[mdgriffith$elm_ui$Element$spaceEvenly, mdgriffith$elm_ui$Element$clip]))
				])),
		fQ: elm$core$Dict$fromList(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'root',
					_List_fromArray(
						[
							mdgriffith$elm_ui$Element$padding(20),
							mdgriffith$elm_ui$Element$spacing(15),
							mdgriffith$elm_ui$Element$Font$family(
							_List_fromArray(
								[
									mdgriffith$elm_ui$Element$Font$typeface('Arial')
								])),
							mdgriffith$elm_ui$Element$Font$size(16),
							mdgriffith$elm_ui$Element$width(
							A2(mdgriffith$elm_ui$Element$maximum, 900, mdgriffith$elm_ui$Element$fill)),
							mdgriffith$elm_ui$Element$height(mdgriffith$elm_ui$Element$fill),
							mdgriffith$elm_ui$Element$centerX
						]))
				]))
	},
	fK: elm$core$Dict$fromList(
		_List_fromArray(
			[
				_Utils_Tuple2(
				1,
				_List_fromArray(
					[
						mdgriffith$elm_ui$Element$Background$color(
						A3(mdgriffith$elm_ui$Element$rgb, 0.4, 0.6, 0.55)),
						mdgriffith$elm_ui$Element$Font$size(24),
						mdgriffith$elm_ui$Element$Font$center,
						mdgriffith$elm_ui$Element$Font$color(
						A3(mdgriffith$elm_ui$Element$rgb, 0.94, 0.97, 1)),
						mdgriffith$elm_ui$Element$Font$bold,
						A2(mdgriffith$elm_ui$Element$paddingXY, 0, 10),
						mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill)
					])),
				_Utils_Tuple2(
				2,
				_List_fromArray(
					[
						mdgriffith$elm_ui$Element$Background$color(
						A3(mdgriffith$elm_ui$Element$rgb, 0.4, 0.6, 0.55)),
						mdgriffith$elm_ui$Element$Font$size(18),
						mdgriffith$elm_ui$Element$Font$center,
						mdgriffith$elm_ui$Element$Font$color(
						A3(mdgriffith$elm_ui$Element$rgb, 0.94, 0.97, 1)),
						mdgriffith$elm_ui$Element$Font$bold,
						A2(mdgriffith$elm_ui$Element$paddingXY, 0, 2),
						mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill)
					])),
				_Utils_Tuple2(
				3,
				_List_fromArray(
					[
						mdgriffith$elm_ui$Element$Font$size(16),
						mdgriffith$elm_ui$Element$Font$color(
						A3(mdgriffith$elm_ui$Element$rgb, 0, 0.5, 0)),
						mdgriffith$elm_ui$Element$Font$bold
					]))
			])),
	fT: _List_Nil,
	f6: _List_fromArray(
		[
			mdgriffith$elm_ui$Element$Font$color(
			A3(mdgriffith$elm_ui$Element$rgb, 0, 0.5, 0.5))
		]),
	gy: _List_fromArray(
		[
			mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill)
		]),
	d_: _List_Nil,
	gL: _List_fromArray(
		[
			mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill),
			mdgriffith$elm_ui$Element$spacing(15)
		]),
	hi: _List_fromArray(
		[
			mdgriffith$elm_ui$Element$spacing(15),
			mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill)
		]),
	ht: _List_Nil
};
var author$project$TablePlugin$Edit = 1;
var author$project$TablePlugin$emptyDocTable = function (externalMsg) {
	return {w: elm$core$Maybe$Nothing, E: 'bleu-blanc', fn: elm$core$Array$empty, cy: '', fx: externalMsg, ar: 1, gi: 0, a1: '', gj: 0, a2: '', aI: false, aK: false, bG: ''};
};
var elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _n0 = A2(elm$core$Elm$JsArray$initializeFromList, elm$core$Array$branchFactor, list);
			var jsArray = _n0.a;
			var remainingItems = _n0.b;
			if (_Utils_cmp(
				elm$core$Elm$JsArray$length(jsArray),
				elm$core$Array$branchFactor) < 0) {
				return A2(
					elm$core$Array$builderToArray,
					true,
					{x: nodeList, t: nodeListSize, v: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					elm$core$List$cons,
					elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return elm$core$Array$empty;
	} else {
		return A3(elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var author$project$TablePlugin$init = F2(
	function (mbTableMeta, externalMsg) {
		if (mbTableMeta.$ === 1) {
			return author$project$TablePlugin$emptyDocTable(externalMsg);
		} else {
			var style = mbTableMeta.a.g7;
			var nbrRows = mbTableMeta.a.gj;
			var nbrCols = mbTableMeta.a.gi;
			var data = mbTableMeta.a.fn;
			return _Utils_eq(data, _List_Nil) ? author$project$TablePlugin$emptyDocTable(externalMsg) : {
				w: elm$core$Maybe$Nothing,
				E: style,
				fn: elm$core$Array$fromList(data),
				cy: '',
				fx: externalMsg,
				ar: 1,
				gi: nbrCols,
				a1: '',
				gj: nbrRows,
				a2: '',
				aI: true,
				aK: false,
				bG: ''
			};
		}
	});
var author$project$Document$FontSize = function (a) {
	return {$: 11, a: a};
};
var author$project$TextBlockPlugin$Heading = function (a) {
	return {$: 2, a: a};
};
var author$project$TextBlockPlugin$defmeta = F2(
	function (uid, value) {
		return {o: 0, _: 0, bc: uid, ef: value};
	});
var author$project$TextBlockPlugin$ExternalLink = function (a) {
	return {$: 1, a: a};
};
var author$project$TextBlockPlugin$InlineStyled = {$: 3};
var author$project$TextBlockPlugin$InternalLink = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var elm$core$String$startsWith = _String_startsWith;
var author$project$TextBlockPlugin$fromTextBlocPrimitive = F2(
	function (nextUid, tbp) {
		if (!tbp.$) {
			if (!tbp.a.b) {
				var s = tbp.b;
				return {m: nextUid, j: s, b: _List_Nil};
			} else {
				var attrs = tbp.a;
				var s = tbp.b;
				return {
					m: nextUid + 1,
					j: '< style ' + (elm$core$String$fromInt(nextUid) + (' > ' + (s + ' </>'))),
					b: _List_fromArray(
						[
							_Utils_Tuple2(
							nextUid,
							{
								p: attrs,
								d: author$project$TextBlockPlugin$InlineStyled,
								bz: A2(author$project$TextBlockPlugin$defmeta, nextUid, s)
							})
						])
				};
			}
		} else {
			var attrs = tbp.a;
			var targetBlank = tbp.b.hf;
			var url = tbp.b.hG;
			var label = tbp.b.b4;
			return {
				m: nextUid + 1,
				j: (targetBlank ? '< lien-externe ' : '< lien-interne ') + (elm$core$String$fromInt(nextUid) + (' > ' + (label + ' </>'))),
				b: _List_fromArray(
					[
						_Utils_Tuple2(
						nextUid,
						{
							p: attrs,
							d: targetBlank ? author$project$TextBlockPlugin$ExternalLink(url) : A2(
								author$project$TextBlockPlugin$InternalLink,
								A2(elm$core$String$startsWith, '/baseDocumentaire', url),
								url),
							bz: A2(author$project$TextBlockPlugin$defmeta, nextUid, label)
						})
					])
			};
		}
	});
var author$project$TextBlockPlugin$fromTextBlocElement = F2(
	function (nextUid_, tbe) {
		switch (tbe.$) {
			case 0:
				var tbps = tbe.b;
				return function (res) {
					return _Utils_update(
						res,
						{j: res.j + '\n\n'});
				}(
					A3(
						elm$core$List$foldr,
						F2(
							function (tbp, _n1) {
								var resultString = _n1.j;
								var trackedData = _n1.b;
								var nextUid = _n1.m;
								var newProcessedInput = A2(author$project$TextBlockPlugin$fromTextBlocPrimitive, nextUid, tbp);
								return {
									m: nextUid + elm$core$List$length(newProcessedInput.b),
									j: newProcessedInput.j + (' ' + resultString),
									b: _Utils_ap(newProcessedInput.b, trackedData)
								};
							}),
						{m: nextUid_, j: '', b: _List_Nil},
						tbps));
			case 1:
				var tbps = tbe.b;
				var processLi = F2(
					function (li, nextUid__) {
						return function (res) {
							return _Utils_update(
								res,
								{j: '* ' + (res.j + '\n')});
						}(
							A3(
								elm$core$List$foldr,
								F2(
									function (tbp, _n3) {
										var resultString = _n3.j;
										var trackedData = _n3.b;
										var nextUid = _n3.m;
										var newProcessedInput = A2(author$project$TextBlockPlugin$fromTextBlocPrimitive, nextUid, tbp);
										return {
											m: nextUid + 1,
											j: newProcessedInput.j + (' ' + resultString),
											b: _Utils_ap(newProcessedInput.b, trackedData)
										};
									}),
								{m: nextUid__, j: '', b: _List_Nil},
								li));
					});
				return A3(
					elm$core$List$foldr,
					F2(
						function (li, _n2) {
							var resultString = _n2.j;
							var trackedData = _n2.b;
							var nextUid = _n2.m;
							var newProcessedInput = A2(processLi, li, nextUid);
							return {
								m: nextUid + newProcessedInput.m,
								j: _Utils_ap(newProcessedInput.j, resultString),
								b: _Utils_ap(newProcessedInput.b, trackedData)
							};
						}),
					{m: nextUid_, j: '', b: _List_Nil},
					tbps);
			case 2:
				var _n4 = tbe.b;
				var level = _n4.a;
				var value = _n4.b;
				return {
					m: nextUid_ + 1,
					j: '< titre ' + (elm$core$String$fromInt(nextUid_) + (' > ' + (value + ' </>\n'))),
					b: _List_fromArray(
						[
							_Utils_Tuple2(
							nextUid_,
							{
								p: _List_Nil,
								d: author$project$TextBlockPlugin$Heading(level),
								bz: A2(author$project$TextBlockPlugin$defmeta, nextUid_, value)
							})
						])
				};
			default:
				var prim = tbe.a;
				return A2(author$project$TextBlockPlugin$fromTextBlocPrimitive, nextUid_, prim);
		}
	});
var elm$core$String$replace = F3(
	function (before, after, string) {
		return A2(
			elm$core$String$join,
			after,
			A2(elm$core$String$split, before, string));
	});
var author$project$TextBlockPlugin$fromTextBloc = function (tbes) {
	var fixSymbols = function (s) {
		return A3(
			elm$core$String$replace,
			' </> ,',
			'</> ,',
			A3(elm$core$String$replace, ' </> .', '</> .', s));
	};
	return function (res) {
		return _Utils_update(
			res,
			{
				j: fixSymbols(res.j)
			});
	}(
		A3(
			elm$core$List$foldr,
			F2(
				function (tbe, _n0) {
					var resultString = _n0.j;
					var trackedData = _n0.b;
					var nextUid = _n0.m;
					var newProcessedInput = A2(author$project$TextBlockPlugin$fromTextBlocElement, nextUid, tbe);
					return {
						m: nextUid + elm$core$List$length(newProcessedInput.b),
						j: newProcessedInput.j + (' ' + resultString),
						b: _Utils_ap(newProcessedInput.b, trackedData)
					};
				}),
			{m: 0, j: '', b: _List_Nil},
			tbes));
};
var author$project$TextBlockPlugin$isFontSizeAttr = function (a) {
	if (a.$ === 11) {
		return true;
	} else {
		return false;
	}
};
var author$project$TextBlockPlugin$HeadingElement = function (a) {
	return {$: 2, a: a};
};
var elm$parser$Parser$Expecting = function (a) {
	return {$: 0, a: a};
};
var elm$parser$Parser$Advanced$Token = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var elm$parser$Parser$toToken = function (str) {
	return A2(
		elm$parser$Parser$Advanced$Token,
		str,
		elm$parser$Parser$Expecting(str));
};
var elm$core$Basics$negate = function (n) {
	return -n;
};
var elm$parser$Parser$Advanced$Bad = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var elm$parser$Parser$Advanced$Good = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var elm$parser$Parser$Advanced$Parser = elm$core$Basics$identity;
var elm$parser$Parser$Advanced$findSubString = _Parser_findSubString;
var elm$parser$Parser$Advanced$AddRight = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var elm$parser$Parser$Advanced$DeadEnd = F4(
	function (row, col, problem, contextStack) {
		return {c7: col, fe: contextStack, dQ: problem, d$: row};
	});
var elm$parser$Parser$Advanced$Empty = {$: 0};
var elm$parser$Parser$Advanced$fromInfo = F4(
	function (row, col, x, context) {
		return A2(
			elm$parser$Parser$Advanced$AddRight,
			elm$parser$Parser$Advanced$Empty,
			A4(elm$parser$Parser$Advanced$DeadEnd, row, col, x, context));
	});
var elm$parser$Parser$Advanced$chompUntil = function (_n0) {
	var str = _n0.a;
	var expecting = _n0.b;
	return function (s) {
		var _n1 = A5(elm$parser$Parser$Advanced$findSubString, str, s.gn, s.d$, s.c7, s.d9);
		var newOffset = _n1.a;
		var newRow = _n1.b;
		var newCol = _n1.c;
		return _Utils_eq(newOffset, -1) ? A2(
			elm$parser$Parser$Advanced$Bad,
			false,
			A4(elm$parser$Parser$Advanced$fromInfo, newRow, newCol, expecting, s.g)) : A3(
			elm$parser$Parser$Advanced$Good,
			_Utils_cmp(s.gn, newOffset) < 0,
			0,
			{c7: newCol, g: s.g, cK: s.cK, gn: newOffset, d$: newRow, d9: s.d9});
	};
};
var elm$parser$Parser$chompUntil = function (str) {
	return elm$parser$Parser$Advanced$chompUntil(
		elm$parser$Parser$toToken(str));
};
var elm$parser$Parser$ExpectingEnd = {$: 10};
var elm$core$String$length = _String_length;
var elm$parser$Parser$Advanced$fromState = F2(
	function (s, x) {
		return A2(
			elm$parser$Parser$Advanced$AddRight,
			elm$parser$Parser$Advanced$Empty,
			A4(elm$parser$Parser$Advanced$DeadEnd, s.d$, s.c7, x, s.g));
	});
var elm$parser$Parser$Advanced$end = function (x) {
	return function (s) {
		return _Utils_eq(
			elm$core$String$length(s.d9),
			s.gn) ? A3(elm$parser$Parser$Advanced$Good, false, 0, s) : A2(
			elm$parser$Parser$Advanced$Bad,
			false,
			A2(elm$parser$Parser$Advanced$fromState, s, x));
	};
};
var elm$parser$Parser$end = elm$parser$Parser$Advanced$end(elm$parser$Parser$ExpectingEnd);
var elm$core$Basics$always = F2(
	function (a, _n0) {
		return a;
	});
var elm$core$String$slice = _String_slice;
var elm$parser$Parser$Advanced$mapChompedString = F2(
	function (func, _n0) {
		var parse = _n0;
		return function (s0) {
			var _n1 = parse(s0);
			if (_n1.$ === 1) {
				var p = _n1.a;
				var x = _n1.b;
				return A2(elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p = _n1.a;
				var a = _n1.b;
				var s1 = _n1.c;
				return A3(
					elm$parser$Parser$Advanced$Good,
					p,
					A2(
						func,
						A3(elm$core$String$slice, s0.gn, s1.gn, s0.d9),
						a),
					s1);
			}
		};
	});
var elm$parser$Parser$Advanced$getChompedString = function (parser) {
	return A2(elm$parser$Parser$Advanced$mapChompedString, elm$core$Basics$always, parser);
};
var elm$parser$Parser$getChompedString = elm$parser$Parser$Advanced$getChompedString;
var elm$parser$Parser$Advanced$getOffset = function (s) {
	return A3(elm$parser$Parser$Advanced$Good, false, s.gn, s);
};
var elm$parser$Parser$getOffset = elm$parser$Parser$Advanced$getOffset;
var elm$parser$Parser$Advanced$map2 = F3(
	function (func, _n0, _n1) {
		var parseA = _n0;
		var parseB = _n1;
		return function (s0) {
			var _n2 = parseA(s0);
			if (_n2.$ === 1) {
				var p = _n2.a;
				var x = _n2.b;
				return A2(elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p1 = _n2.a;
				var a = _n2.b;
				var s1 = _n2.c;
				var _n3 = parseB(s1);
				if (_n3.$ === 1) {
					var p2 = _n3.a;
					var x = _n3.b;
					return A2(elm$parser$Parser$Advanced$Bad, p1 || p2, x);
				} else {
					var p2 = _n3.a;
					var b = _n3.b;
					var s2 = _n3.c;
					return A3(
						elm$parser$Parser$Advanced$Good,
						p1 || p2,
						A2(func, a, b),
						s2);
				}
			}
		};
	});
var elm$parser$Parser$Advanced$ignorer = F2(
	function (keepParser, ignoreParser) {
		return A3(elm$parser$Parser$Advanced$map2, elm$core$Basics$always, keepParser, ignoreParser);
	});
var elm$parser$Parser$ignorer = elm$parser$Parser$Advanced$ignorer;
var elm$parser$Parser$ExpectingInt = {$: 1};
var elm$parser$Parser$Advanced$consumeBase = _Parser_consumeBase;
var elm$parser$Parser$Advanced$consumeBase16 = _Parser_consumeBase16;
var elm$core$String$toFloat = _String_toFloat;
var elm$parser$Parser$Advanced$bumpOffset = F2(
	function (newOffset, s) {
		return {c7: s.c7 + (newOffset - s.gn), g: s.g, cK: s.cK, gn: newOffset, d$: s.d$, d9: s.d9};
	});
var elm$parser$Parser$Advanced$chompBase10 = _Parser_chompBase10;
var elm$parser$Parser$Advanced$isAsciiCode = _Parser_isAsciiCode;
var elm$parser$Parser$Advanced$consumeExp = F2(
	function (offset, src) {
		if (A3(elm$parser$Parser$Advanced$isAsciiCode, 101, offset, src) || A3(elm$parser$Parser$Advanced$isAsciiCode, 69, offset, src)) {
			var eOffset = offset + 1;
			var expOffset = (A3(elm$parser$Parser$Advanced$isAsciiCode, 43, eOffset, src) || A3(elm$parser$Parser$Advanced$isAsciiCode, 45, eOffset, src)) ? (eOffset + 1) : eOffset;
			var newOffset = A2(elm$parser$Parser$Advanced$chompBase10, expOffset, src);
			return _Utils_eq(expOffset, newOffset) ? (-newOffset) : newOffset;
		} else {
			return offset;
		}
	});
var elm$parser$Parser$Advanced$consumeDotAndExp = F2(
	function (offset, src) {
		return A3(elm$parser$Parser$Advanced$isAsciiCode, 46, offset, src) ? A2(
			elm$parser$Parser$Advanced$consumeExp,
			A2(elm$parser$Parser$Advanced$chompBase10, offset + 1, src),
			src) : A2(elm$parser$Parser$Advanced$consumeExp, offset, src);
	});
var elm$parser$Parser$Advanced$finalizeInt = F5(
	function (invalid, handler, startOffset, _n0, s) {
		var endOffset = _n0.a;
		var n = _n0.b;
		if (handler.$ === 1) {
			var x = handler.a;
			return A2(
				elm$parser$Parser$Advanced$Bad,
				true,
				A2(elm$parser$Parser$Advanced$fromState, s, x));
		} else {
			var toValue = handler.a;
			return _Utils_eq(startOffset, endOffset) ? A2(
				elm$parser$Parser$Advanced$Bad,
				_Utils_cmp(s.gn, startOffset) < 0,
				A2(elm$parser$Parser$Advanced$fromState, s, invalid)) : A3(
				elm$parser$Parser$Advanced$Good,
				true,
				toValue(n),
				A2(elm$parser$Parser$Advanced$bumpOffset, endOffset, s));
		}
	});
var elm$parser$Parser$Advanced$finalizeFloat = F6(
	function (invalid, expecting, intSettings, floatSettings, intPair, s) {
		var intOffset = intPair.a;
		var floatOffset = A2(elm$parser$Parser$Advanced$consumeDotAndExp, intOffset, s.d9);
		if (floatOffset < 0) {
			return A2(
				elm$parser$Parser$Advanced$Bad,
				true,
				A4(elm$parser$Parser$Advanced$fromInfo, s.d$, s.c7 - (floatOffset + s.gn), invalid, s.g));
		} else {
			if (_Utils_eq(s.gn, floatOffset)) {
				return A2(
					elm$parser$Parser$Advanced$Bad,
					false,
					A2(elm$parser$Parser$Advanced$fromState, s, expecting));
			} else {
				if (_Utils_eq(intOffset, floatOffset)) {
					return A5(elm$parser$Parser$Advanced$finalizeInt, invalid, intSettings, s.gn, intPair, s);
				} else {
					if (floatSettings.$ === 1) {
						var x = floatSettings.a;
						return A2(
							elm$parser$Parser$Advanced$Bad,
							true,
							A2(elm$parser$Parser$Advanced$fromState, s, invalid));
					} else {
						var toValue = floatSettings.a;
						var _n1 = elm$core$String$toFloat(
							A3(elm$core$String$slice, s.gn, floatOffset, s.d9));
						if (_n1.$ === 1) {
							return A2(
								elm$parser$Parser$Advanced$Bad,
								true,
								A2(elm$parser$Parser$Advanced$fromState, s, invalid));
						} else {
							var n = _n1.a;
							return A3(
								elm$parser$Parser$Advanced$Good,
								true,
								toValue(n),
								A2(elm$parser$Parser$Advanced$bumpOffset, floatOffset, s));
						}
					}
				}
			}
		}
	});
var elm$parser$Parser$Advanced$number = function (c) {
	return function (s) {
		if (A3(elm$parser$Parser$Advanced$isAsciiCode, 48, s.gn, s.d9)) {
			var zeroOffset = s.gn + 1;
			var baseOffset = zeroOffset + 1;
			return A3(elm$parser$Parser$Advanced$isAsciiCode, 120, zeroOffset, s.d9) ? A5(
				elm$parser$Parser$Advanced$finalizeInt,
				c.f0,
				c.dp,
				baseOffset,
				A2(elm$parser$Parser$Advanced$consumeBase16, baseOffset, s.d9),
				s) : (A3(elm$parser$Parser$Advanced$isAsciiCode, 111, zeroOffset, s.d9) ? A5(
				elm$parser$Parser$Advanced$finalizeInt,
				c.f0,
				c.dF,
				baseOffset,
				A3(elm$parser$Parser$Advanced$consumeBase, 8, baseOffset, s.d9),
				s) : (A3(elm$parser$Parser$Advanced$isAsciiCode, 98, zeroOffset, s.d9) ? A5(
				elm$parser$Parser$Advanced$finalizeInt,
				c.f0,
				c.c4,
				baseOffset,
				A3(elm$parser$Parser$Advanced$consumeBase, 2, baseOffset, s.d9),
				s) : A6(
				elm$parser$Parser$Advanced$finalizeFloat,
				c.f0,
				c.dg,
				c.du,
				c.dh,
				_Utils_Tuple2(zeroOffset, 0),
				s)));
		} else {
			return A6(
				elm$parser$Parser$Advanced$finalizeFloat,
				c.f0,
				c.dg,
				c.du,
				c.dh,
				A3(elm$parser$Parser$Advanced$consumeBase, 10, s.gn, s.d9),
				s);
		}
	};
};
var elm$parser$Parser$Advanced$int = F2(
	function (expecting, invalid) {
		return elm$parser$Parser$Advanced$number(
			{
				c4: elm$core$Result$Err(invalid),
				dg: expecting,
				dh: elm$core$Result$Err(invalid),
				dp: elm$core$Result$Err(invalid),
				du: elm$core$Result$Ok(elm$core$Basics$identity),
				f0: invalid,
				dF: elm$core$Result$Err(invalid)
			});
	});
var elm$parser$Parser$int = A2(elm$parser$Parser$Advanced$int, elm$parser$Parser$ExpectingInt, elm$parser$Parser$ExpectingInt);
var elm$parser$Parser$Advanced$keeper = F2(
	function (parseFunc, parseArg) {
		return A3(elm$parser$Parser$Advanced$map2, elm$core$Basics$apL, parseFunc, parseArg);
	});
var elm$parser$Parser$keeper = elm$parser$Parser$Advanced$keeper;
var elm$parser$Parser$ExpectingKeyword = function (a) {
	return {$: 9, a: a};
};
var elm$core$Basics$not = _Basics_not;
var elm$core$String$isEmpty = function (string) {
	return string === '';
};
var elm$parser$Parser$Advanced$isSubChar = _Parser_isSubChar;
var elm$parser$Parser$Advanced$isSubString = _Parser_isSubString;
var elm$parser$Parser$Advanced$keyword = function (_n0) {
	var kwd = _n0.a;
	var expecting = _n0.b;
	var progress = !elm$core$String$isEmpty(kwd);
	return function (s) {
		var _n1 = A5(elm$parser$Parser$Advanced$isSubString, kwd, s.gn, s.d$, s.c7, s.d9);
		var newOffset = _n1.a;
		var newRow = _n1.b;
		var newCol = _n1.c;
		return (_Utils_eq(newOffset, -1) || (0 <= A3(
			elm$parser$Parser$Advanced$isSubChar,
			function (c) {
				return elm$core$Char$isAlphaNum(c) || (c === '_');
			},
			newOffset,
			s.d9))) ? A2(
			elm$parser$Parser$Advanced$Bad,
			false,
			A2(elm$parser$Parser$Advanced$fromState, s, expecting)) : A3(
			elm$parser$Parser$Advanced$Good,
			progress,
			0,
			{c7: newCol, g: s.g, cK: s.cK, gn: newOffset, d$: newRow, d9: s.d9});
	};
};
var elm$parser$Parser$keyword = function (kwd) {
	return elm$parser$Parser$Advanced$keyword(
		A2(
			elm$parser$Parser$Advanced$Token,
			kwd,
			elm$parser$Parser$ExpectingKeyword(kwd)));
};
var elm$parser$Parser$Advanced$Append = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var elm$parser$Parser$Advanced$oneOfHelp = F3(
	function (s0, bag, parsers) {
		oneOfHelp:
		while (true) {
			if (!parsers.b) {
				return A2(elm$parser$Parser$Advanced$Bad, false, bag);
			} else {
				var parse = parsers.a;
				var remainingParsers = parsers.b;
				var _n1 = parse(s0);
				if (!_n1.$) {
					var step = _n1;
					return step;
				} else {
					var step = _n1;
					var p = step.a;
					var x = step.b;
					if (p) {
						return step;
					} else {
						var $temp$s0 = s0,
							$temp$bag = A2(elm$parser$Parser$Advanced$Append, bag, x),
							$temp$parsers = remainingParsers;
						s0 = $temp$s0;
						bag = $temp$bag;
						parsers = $temp$parsers;
						continue oneOfHelp;
					}
				}
			}
		}
	});
var elm$parser$Parser$Advanced$oneOf = function (parsers) {
	return function (s) {
		return A3(elm$parser$Parser$Advanced$oneOfHelp, s, elm$parser$Parser$Advanced$Empty, parsers);
	};
};
var elm$parser$Parser$oneOf = elm$parser$Parser$Advanced$oneOf;
var elm$parser$Parser$Advanced$chompWhileHelp = F5(
	function (isGood, offset, row, col, s0) {
		chompWhileHelp:
		while (true) {
			var newOffset = A3(elm$parser$Parser$Advanced$isSubChar, isGood, offset, s0.d9);
			if (_Utils_eq(newOffset, -1)) {
				return A3(
					elm$parser$Parser$Advanced$Good,
					_Utils_cmp(s0.gn, offset) < 0,
					0,
					{c7: col, g: s0.g, cK: s0.cK, gn: offset, d$: row, d9: s0.d9});
			} else {
				if (_Utils_eq(newOffset, -2)) {
					var $temp$isGood = isGood,
						$temp$offset = offset + 1,
						$temp$row = row + 1,
						$temp$col = 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				} else {
					var $temp$isGood = isGood,
						$temp$offset = newOffset,
						$temp$row = row,
						$temp$col = col + 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				}
			}
		}
	});
var elm$parser$Parser$Advanced$chompWhile = function (isGood) {
	return function (s) {
		return A5(elm$parser$Parser$Advanced$chompWhileHelp, isGood, s.gn, s.d$, s.c7, s);
	};
};
var elm$parser$Parser$Advanced$spaces = elm$parser$Parser$Advanced$chompWhile(
	function (c) {
		return (c === ' ') || ((c === '\n') || (c === '\r'));
	});
var elm$parser$Parser$spaces = elm$parser$Parser$Advanced$spaces;
var elm$parser$Parser$Advanced$succeed = function (a) {
	return function (s) {
		return A3(elm$parser$Parser$Advanced$Good, false, a, s);
	};
};
var elm$parser$Parser$succeed = elm$parser$Parser$Advanced$succeed;
var elm$parser$Parser$ExpectingSymbol = function (a) {
	return {$: 8, a: a};
};
var elm$parser$Parser$Advanced$token = function (_n0) {
	var str = _n0.a;
	var expecting = _n0.b;
	var progress = !elm$core$String$isEmpty(str);
	return function (s) {
		var _n1 = A5(elm$parser$Parser$Advanced$isSubString, str, s.gn, s.d$, s.c7, s.d9);
		var newOffset = _n1.a;
		var newRow = _n1.b;
		var newCol = _n1.c;
		return _Utils_eq(newOffset, -1) ? A2(
			elm$parser$Parser$Advanced$Bad,
			false,
			A2(elm$parser$Parser$Advanced$fromState, s, expecting)) : A3(
			elm$parser$Parser$Advanced$Good,
			progress,
			0,
			{c7: newCol, g: s.g, cK: s.cK, gn: newOffset, d$: newRow, d9: s.d9});
	};
};
var elm$parser$Parser$Advanced$symbol = elm$parser$Parser$Advanced$token;
var elm$parser$Parser$symbol = function (str) {
	return elm$parser$Parser$Advanced$symbol(
		A2(
			elm$parser$Parser$Advanced$Token,
			str,
			elm$parser$Parser$ExpectingSymbol(str)));
};
var elm$parser$Parser$token = function (str) {
	return elm$parser$Parser$Advanced$token(
		elm$parser$Parser$toToken(str));
};
var author$project$TextBlockPlugin$heading = A2(
	elm$parser$Parser$keeper,
	A2(
		elm$parser$Parser$keeper,
		A2(
			elm$parser$Parser$keeper,
			A2(
				elm$parser$Parser$keeper,
				A2(
					elm$parser$Parser$ignorer,
					elm$parser$Parser$succeed(
						F4(
							function (start, uid, val, stop) {
								return author$project$TextBlockPlugin$HeadingElement(
									{o: start, _: stop, bc: uid, ef: val});
							})),
					elm$parser$Parser$spaces),
				A2(
					elm$parser$Parser$ignorer,
					A2(
						elm$parser$Parser$ignorer,
						A2(
							elm$parser$Parser$ignorer,
							A2(
								elm$parser$Parser$ignorer,
								elm$parser$Parser$getOffset,
								elm$parser$Parser$symbol('<')),
							elm$parser$Parser$spaces),
						elm$parser$Parser$token('titre')),
					elm$parser$Parser$spaces)),
			A2(
				elm$parser$Parser$ignorer,
				A2(elm$parser$Parser$ignorer, elm$parser$Parser$int, elm$parser$Parser$spaces),
				elm$parser$Parser$symbol('>'))),
		A2(
			elm$parser$Parser$ignorer,
			elm$parser$Parser$getChompedString(
				elm$parser$Parser$chompUntil('<')),
			elm$parser$Parser$keyword('</>'))),
	A2(
		elm$parser$Parser$ignorer,
		elm$parser$Parser$getOffset,
		elm$parser$Parser$oneOf(
			_List_fromArray(
				[elm$parser$Parser$end, elm$parser$Parser$spaces]))));
var author$project$TextBlockPlugin$ParagraphElement = function (a) {
	return {$: 0, a: a};
};
var elm$parser$Parser$chompWhile = elm$parser$Parser$Advanced$chompWhile;
var author$project$TextBlockPlugin$reallyspaces = elm$parser$Parser$chompWhile(
	function (c) {
		return c === ' ';
	});
var elm$parser$Parser$Advanced$backtrackable = function (_n0) {
	var parse = _n0;
	return function (s0) {
		var _n1 = parse(s0);
		if (_n1.$ === 1) {
			var x = _n1.b;
			return A2(elm$parser$Parser$Advanced$Bad, false, x);
		} else {
			var a = _n1.b;
			var s1 = _n1.c;
			return A3(elm$parser$Parser$Advanced$Good, false, a, s1);
		}
	};
};
var elm$parser$Parser$backtrackable = elm$parser$Parser$Advanced$backtrackable;
var author$project$TextBlockPlugin$break = elm$parser$Parser$backtrackable(
	A2(
		elm$parser$Parser$ignorer,
		A2(
			elm$parser$Parser$ignorer,
			A2(
				elm$parser$Parser$ignorer,
				elm$parser$Parser$succeed(0),
				author$project$TextBlockPlugin$reallyspaces),
			elm$parser$Parser$keyword('\n')),
		elm$parser$Parser$spaces));
var author$project$TextBlockPlugin$TextPrimitive = function (a) {
	return {$: 3, a: a};
};
var author$project$TextBlockPlugin$groupWordsIntoText = function (prims) {
	var helper = F3(
		function (buffer, acc, xs) {
			helper:
			while (true) {
				if (!xs.b) {
					if (!buffer.b) {
						return elm$core$List$reverse(acc);
					} else {
						return function (nw) {
							return elm$core$List$reverse(
								A2(elm$core$List$cons, nw, acc));
						}(
							author$project$TextBlockPlugin$TextPrimitive(
								A2(
									elm$core$String$join,
									' ',
									elm$core$List$reverse(buffer))));
					}
				} else {
					var x = xs.a;
					var xs_ = xs.b;
					if (x.$ === 4) {
						var w = x.a;
						var $temp$buffer = A2(elm$core$List$cons, w, buffer),
							$temp$acc = acc,
							$temp$xs = xs_;
						buffer = $temp$buffer;
						acc = $temp$acc;
						xs = $temp$xs;
						continue helper;
					} else {
						if (!buffer.b) {
							var $temp$buffer = buffer,
								$temp$acc = A2(elm$core$List$cons, x, acc),
								$temp$xs = xs_;
							buffer = $temp$buffer;
							acc = $temp$acc;
							xs = $temp$xs;
							continue helper;
						} else {
							var $temp$buffer = _List_Nil,
								$temp$acc = function (nw) {
								return A2(
									elm$core$List$cons,
									x,
									A2(elm$core$List$cons, nw, acc));
							}(
								author$project$TextBlockPlugin$TextPrimitive(
									A2(
										elm$core$String$join,
										' ',
										elm$core$List$reverse(buffer)))),
								$temp$xs = xs_;
							buffer = $temp$buffer;
							acc = $temp$acc;
							xs = $temp$xs;
							continue helper;
						}
					}
				}
			}
		});
	return A3(helper, _List_Nil, _List_Nil, prims);
};
var author$project$TextBlockPlugin$ExternalLinkPrimitive = function (a) {
	return {$: 1, a: a};
};
var author$project$TextBlockPlugin$externalLink = A2(
	elm$parser$Parser$keeper,
	A2(
		elm$parser$Parser$keeper,
		A2(
			elm$parser$Parser$keeper,
			A2(
				elm$parser$Parser$keeper,
				A2(
					elm$parser$Parser$ignorer,
					elm$parser$Parser$succeed(
						F4(
							function (start, uid, val, stop) {
								return author$project$TextBlockPlugin$ExternalLinkPrimitive(
									{o: start, _: stop, bc: uid, ef: val});
							})),
					elm$parser$Parser$spaces),
				A2(
					elm$parser$Parser$ignorer,
					A2(
						elm$parser$Parser$ignorer,
						A2(
							elm$parser$Parser$ignorer,
							A2(
								elm$parser$Parser$ignorer,
								elm$parser$Parser$getOffset,
								elm$parser$Parser$symbol('<')),
							elm$parser$Parser$spaces),
						elm$parser$Parser$keyword('lien-externe')),
					elm$parser$Parser$spaces)),
			A2(
				elm$parser$Parser$ignorer,
				A2(elm$parser$Parser$ignorer, elm$parser$Parser$int, elm$parser$Parser$spaces),
				elm$parser$Parser$symbol('>'))),
		A2(
			elm$parser$Parser$ignorer,
			elm$parser$Parser$getChompedString(
				elm$parser$Parser$chompUntil('<')),
			elm$parser$Parser$keyword('</>'))),
	elm$parser$Parser$getOffset);
var author$project$TextBlockPlugin$InlineStylePrimitive = function (a) {
	return {$: 2, a: a};
};
var author$project$TextBlockPlugin$inlineStyle = A2(
	elm$parser$Parser$keeper,
	A2(
		elm$parser$Parser$keeper,
		A2(
			elm$parser$Parser$keeper,
			A2(
				elm$parser$Parser$keeper,
				A2(
					elm$parser$Parser$ignorer,
					elm$parser$Parser$succeed(
						F4(
							function (start, uid, val, stop) {
								return author$project$TextBlockPlugin$InlineStylePrimitive(
									{o: start, _: stop, bc: uid, ef: val});
							})),
					elm$parser$Parser$spaces),
				A2(
					elm$parser$Parser$ignorer,
					A2(
						elm$parser$Parser$ignorer,
						A2(
							elm$parser$Parser$ignorer,
							A2(
								elm$parser$Parser$ignorer,
								elm$parser$Parser$getOffset,
								elm$parser$Parser$symbol('<')),
							elm$parser$Parser$spaces),
						elm$parser$Parser$keyword('style')),
					elm$parser$Parser$spaces)),
			A2(
				elm$parser$Parser$ignorer,
				A2(elm$parser$Parser$ignorer, elm$parser$Parser$int, elm$parser$Parser$spaces),
				elm$parser$Parser$symbol('>'))),
		A2(
			elm$parser$Parser$ignorer,
			elm$parser$Parser$getChompedString(
				elm$parser$Parser$chompUntil('<')),
			elm$parser$Parser$keyword('</>'))),
	elm$parser$Parser$getOffset);
var author$project$TextBlockPlugin$InternalLinkPrimitive = function (a) {
	return {$: 0, a: a};
};
var author$project$TextBlockPlugin$internalLink = A2(
	elm$parser$Parser$keeper,
	A2(
		elm$parser$Parser$keeper,
		A2(
			elm$parser$Parser$keeper,
			A2(
				elm$parser$Parser$keeper,
				A2(
					elm$parser$Parser$ignorer,
					elm$parser$Parser$succeed(
						F4(
							function (start, uid, val, stop) {
								return author$project$TextBlockPlugin$InternalLinkPrimitive(
									{o: start, _: stop, bc: uid, ef: val});
							})),
					elm$parser$Parser$spaces),
				A2(
					elm$parser$Parser$ignorer,
					A2(
						elm$parser$Parser$ignorer,
						A2(
							elm$parser$Parser$ignorer,
							A2(
								elm$parser$Parser$ignorer,
								elm$parser$Parser$getOffset,
								elm$parser$Parser$symbol('<')),
							elm$parser$Parser$spaces),
						elm$parser$Parser$keyword('lien-interne')),
					elm$parser$Parser$spaces)),
			A2(
				elm$parser$Parser$ignorer,
				A2(elm$parser$Parser$ignorer, elm$parser$Parser$int, elm$parser$Parser$spaces),
				elm$parser$Parser$symbol('>'))),
		A2(
			elm$parser$Parser$ignorer,
			elm$parser$Parser$getChompedString(
				elm$parser$Parser$chompUntil('<')),
			elm$parser$Parser$keyword('</>'))),
	elm$parser$Parser$getOffset);
var author$project$TextBlockPlugin$allPrimitivesButText = elm$parser$Parser$oneOf(
	_List_fromArray(
		[
			elm$parser$Parser$backtrackable(author$project$TextBlockPlugin$internalLink),
			elm$parser$Parser$backtrackable(author$project$TextBlockPlugin$externalLink),
			author$project$TextBlockPlugin$inlineStyle
		]));
var author$project$TextBlockPlugin$WordPrimitive = function (a) {
	return {$: 4, a: a};
};
var elm$parser$Parser$Advanced$map = F2(
	function (func, _n0) {
		var parse = _n0;
		return function (s0) {
			var _n1 = parse(s0);
			if (!_n1.$) {
				var p = _n1.a;
				var a = _n1.b;
				var s1 = _n1.c;
				return A3(
					elm$parser$Parser$Advanced$Good,
					p,
					func(a),
					s1);
			} else {
				var p = _n1.a;
				var x = _n1.b;
				return A2(elm$parser$Parser$Advanced$Bad, p, x);
			}
		};
	});
var elm$parser$Parser$map = elm$parser$Parser$Advanced$map;
var author$project$TextBlockPlugin$word = A2(
	elm$parser$Parser$map,
	author$project$TextBlockPlugin$WordPrimitive,
	A2(
		elm$parser$Parser$keeper,
		A2(
			elm$parser$Parser$ignorer,
			elm$parser$Parser$succeed(elm$core$Basics$identity),
			elm$parser$Parser$spaces),
		elm$parser$Parser$getChompedString(
			elm$parser$Parser$chompWhile(
				function (c) {
					return !((c === ' ') || ((c === '\t') || (c === '\n')));
				}))));
var author$project$TextBlockPlugin$primitive = elm$parser$Parser$oneOf(
	_List_fromArray(
		[
			elm$parser$Parser$backtrackable(author$project$TextBlockPlugin$allPrimitivesButText),
			author$project$TextBlockPlugin$word
		]));
var elm$parser$Parser$Done = function (a) {
	return {$: 1, a: a};
};
var elm$parser$Parser$Loop = function (a) {
	return {$: 0, a: a};
};
var elm$parser$Parser$Advanced$Done = function (a) {
	return {$: 1, a: a};
};
var elm$parser$Parser$Advanced$Loop = function (a) {
	return {$: 0, a: a};
};
var elm$parser$Parser$toAdvancedStep = function (step) {
	if (!step.$) {
		var s = step.a;
		return elm$parser$Parser$Advanced$Loop(s);
	} else {
		var a = step.a;
		return elm$parser$Parser$Advanced$Done(a);
	}
};
var elm$parser$Parser$Advanced$loopHelp = F4(
	function (p, state, callback, s0) {
		loopHelp:
		while (true) {
			var _n0 = callback(state);
			var parse = _n0;
			var _n1 = parse(s0);
			if (!_n1.$) {
				var p1 = _n1.a;
				var step = _n1.b;
				var s1 = _n1.c;
				if (!step.$) {
					var newState = step.a;
					var $temp$p = p || p1,
						$temp$state = newState,
						$temp$callback = callback,
						$temp$s0 = s1;
					p = $temp$p;
					state = $temp$state;
					callback = $temp$callback;
					s0 = $temp$s0;
					continue loopHelp;
				} else {
					var result = step.a;
					return A3(elm$parser$Parser$Advanced$Good, p || p1, result, s1);
				}
			} else {
				var p1 = _n1.a;
				var x = _n1.b;
				return A2(elm$parser$Parser$Advanced$Bad, p || p1, x);
			}
		}
	});
var elm$parser$Parser$Advanced$loop = F2(
	function (state, callback) {
		return function (s) {
			return A4(elm$parser$Parser$Advanced$loopHelp, false, state, callback, s);
		};
	});
var elm$parser$Parser$loop = F2(
	function (state, callback) {
		return A2(
			elm$parser$Parser$Advanced$loop,
			state,
			function (s) {
				return A2(
					elm$parser$Parser$map,
					elm$parser$Parser$toAdvancedStep,
					callback(s));
			});
	});
var author$project$TextBlockPlugin$paragraph = function () {
	var helper = function (prims) {
		return elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					A2(
					elm$parser$Parser$map,
					function (_n0) {
						return elm$parser$Parser$Done(
							elm$core$List$reverse(prims));
					},
					author$project$TextBlockPlugin$break),
					A2(
					elm$parser$Parser$map,
					function (_n1) {
						return elm$parser$Parser$Done(
							elm$core$List$reverse(prims));
					},
					elm$parser$Parser$end),
					A2(
					elm$parser$Parser$keeper,
					elm$parser$Parser$succeed(
						function (p) {
							return elm$parser$Parser$Loop(
								A2(elm$core$List$cons, p, prims));
						}),
					author$project$TextBlockPlugin$primitive)
				]));
	};
	return A2(
		elm$parser$Parser$map,
		author$project$TextBlockPlugin$ParagraphElement,
		A2(
			elm$parser$Parser$map,
			author$project$TextBlockPlugin$groupWordsIntoText,
			A2(elm$parser$Parser$loop, _List_Nil, helper)));
}();
var author$project$TextBlockPlugin$UListElement = function (a) {
	return {$: 1, a: a};
};
var author$project$TextBlockPlugin$uList = function () {
	var helper = function (prims) {
		return elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					A2(
					elm$parser$Parser$map,
					function (_n0) {
						return elm$parser$Parser$Done(
							elm$core$List$reverse(prims));
					},
					author$project$TextBlockPlugin$break),
					A2(
					elm$parser$Parser$map,
					function (_n1) {
						return elm$parser$Parser$Done(
							elm$core$List$reverse(prims));
					},
					elm$parser$Parser$end),
					A2(
					elm$parser$Parser$keeper,
					elm$parser$Parser$succeed(
						function (p) {
							return elm$parser$Parser$Loop(
								A2(elm$core$List$cons, p, prims));
						}),
					author$project$TextBlockPlugin$primitive)
				]));
	};
	return A2(
		elm$parser$Parser$map,
		author$project$TextBlockPlugin$UListElement,
		A2(
			elm$parser$Parser$keeper,
			A2(
				elm$parser$Parser$ignorer,
				A2(
					elm$parser$Parser$ignorer,
					A2(
						elm$parser$Parser$ignorer,
						elm$parser$Parser$succeed(elm$core$Basics$identity),
						elm$parser$Parser$spaces),
					elm$parser$Parser$keyword('*')),
				elm$parser$Parser$spaces),
			A2(
				elm$parser$Parser$map,
				author$project$TextBlockPlugin$groupWordsIntoText,
				A2(elm$parser$Parser$loop, _List_Nil, helper))));
}();
var author$project$TextBlockPlugin$textBlock = function () {
	var helper = function (elems) {
		return elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					A2(
					elm$parser$Parser$map,
					function (_n0) {
						return elm$parser$Parser$Done(
							elm$core$List$reverse(elems));
					},
					elm$parser$Parser$end),
					elm$parser$Parser$backtrackable(
					A2(
						elm$parser$Parser$keeper,
						elm$parser$Parser$succeed(
							function (h) {
								return elm$parser$Parser$Loop(
									A2(elm$core$List$cons, h, elems));
							}),
						author$project$TextBlockPlugin$heading)),
					elm$parser$Parser$backtrackable(
					A2(
						elm$parser$Parser$keeper,
						elm$parser$Parser$succeed(
							function (ul) {
								return elm$parser$Parser$Loop(
									A2(elm$core$List$cons, ul, elems));
							}),
						author$project$TextBlockPlugin$uList)),
					A2(
					elm$parser$Parser$keeper,
					elm$parser$Parser$succeed(
						function (p) {
							return elm$parser$Parser$Loop(
								A2(elm$core$List$cons, p, elems));
						}),
					author$project$TextBlockPlugin$paragraph)
				]));
	};
	return A2(elm$parser$Parser$loop, _List_Nil, helper);
}();
var author$project$Document$Heading = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var author$project$Document$Paragraph = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var author$project$Document$TBPrimitive = function (a) {
	return {$: 3, a: a};
};
var author$project$Document$UList = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var author$project$Document$Link = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var author$project$Document$Text = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var author$project$TextBlockPlugin$toTextBlockPrimitive = F2(
	function (trackedData, prim) {
		switch (prim.$) {
			case 1:
				var uid = prim.a.bc;
				var value = prim.a.ef;
				var _n1 = A2(
					elm$core$Maybe$map,
					function (td) {
						return _Utils_Tuple2(td.p, td.d);
					},
					A2(elm$core$Dict$get, uid, trackedData));
				if ((!_n1.$) && (_n1.a.b.$ === 1)) {
					var _n2 = _n1.a;
					var attrs = _n2.a;
					var url = _n2.b.a;
					return elm$core$Maybe$Just(
						A2(
							author$project$Document$Link,
							attrs,
							{b4: value, hf: true, hG: url}));
				} else {
					return elm$core$Maybe$Nothing;
				}
			case 0:
				var uid = prim.a.bc;
				var value = prim.a.ef;
				var _n3 = A2(
					elm$core$Maybe$map,
					function (td) {
						return _Utils_Tuple2(td.p, td.d);
					},
					A2(elm$core$Dict$get, uid, trackedData));
				if ((!_n3.$) && (!_n3.a.b.$)) {
					var _n4 = _n3.a;
					var attrs = _n4.a;
					var _n5 = _n4.b;
					var isFile = _n5.a;
					var url = _n5.b;
					return elm$core$Maybe$Just(
						A2(
							author$project$Document$Link,
							attrs,
							{b4: value, hf: isFile, hG: url}));
				} else {
					return elm$core$Maybe$Nothing;
				}
			case 2:
				var uid = prim.a.bc;
				var value = prim.a.ef;
				var _n6 = A2(
					elm$core$Maybe$map,
					function (td) {
						return _Utils_Tuple2(td.p, td.d);
					},
					A2(elm$core$Dict$get, uid, trackedData));
				if ((!_n6.$) && (_n6.a.b.$ === 3)) {
					var _n7 = _n6.a;
					var attrs = _n7.a;
					var _n8 = _n7.b;
					return elm$core$Maybe$Just(
						A2(author$project$Document$Text, attrs, value));
				} else {
					return elm$core$Maybe$Nothing;
				}
			case 3:
				var value = prim.a;
				return elm$core$Maybe$Just(
					A2(author$project$Document$Text, _List_Nil, value));
			default:
				return elm$core$Maybe$Nothing;
		}
	});
var author$project$TextBlockPlugin$toTextBlocElement = F2(
	function (trackedData, elem) {
		switch (elem.$) {
			case 0:
				var prims = elem.a;
				return elm$core$Maybe$Just(
					A2(
						author$project$Document$Paragraph,
						_List_Nil,
						A2(
							elm$core$List$filterMap,
							author$project$TextBlockPlugin$toTextBlockPrimitive(trackedData),
							prims)));
			case 1:
				var prims = elem.a;
				return elm$core$Maybe$Just(
					A2(
						author$project$Document$UList,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								elm$core$List$filterMap,
								author$project$TextBlockPlugin$toTextBlockPrimitive(trackedData),
								prims)
							])));
			case 2:
				var uid = elem.a.bc;
				var value = elem.a.ef;
				var _n1 = A2(
					elm$core$Maybe$map,
					function (td) {
						return _Utils_Tuple2(td.p, td.d);
					},
					A2(elm$core$Dict$get, uid, trackedData));
				if ((!_n1.$) && (_n1.a.b.$ === 2)) {
					var _n2 = _n1.a;
					var attrs = _n2.a;
					var level = _n2.b.a;
					return elm$core$Maybe$Just(
						A2(
							author$project$Document$Heading,
							attrs,
							_Utils_Tuple2(level, value)));
				} else {
					return elm$core$Maybe$Nothing;
				}
			default:
				var prim = elem.a;
				return A2(
					elm$core$Maybe$map,
					author$project$Document$TBPrimitive,
					A2(author$project$TextBlockPlugin$toTextBlockPrimitive, trackedData, prim));
		}
	});
var elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var author$project$TextBlockPlugin$updateTrackedData = F2(
	function (currentTrackedData, elems) {
		var getTrackedPrim = function (p) {
			switch (p.$) {
				case 0:
					var pm = p.a;
					return elm$core$Maybe$Just(
						{
							p: _List_Nil,
							d: A2(author$project$TextBlockPlugin$InternalLink, false, ''),
							bz: pm
						});
				case 1:
					var pm = p.a;
					return elm$core$Maybe$Just(
						{
							p: _List_Nil,
							d: author$project$TextBlockPlugin$ExternalLink(''),
							bz: pm
						});
				case 2:
					var pm = p.a;
					return elm$core$Maybe$Just(
						{p: _List_Nil, d: author$project$TextBlockPlugin$InlineStyled, bz: pm});
				default:
					return elm$core$Maybe$Nothing;
			}
		};
		var newTrackedDataList = elm$core$List$concat(
			A2(
				elm$core$List$filterMap,
				function (e) {
					switch (e.$) {
						case 2:
							var meta = e.a;
							return elm$core$Maybe$Just(
								_List_fromArray(
									[
										{
										p: _List_Nil,
										d: author$project$TextBlockPlugin$Heading(1),
										bz: meta
									}
									]));
						case 0:
							var xs = e.a;
							return elm$core$Maybe$Just(
								A2(elm$core$List$filterMap, getTrackedPrim, xs));
						case 1:
							var xs = e.a;
							return elm$core$Maybe$Just(
								A2(elm$core$List$filterMap, getTrackedPrim, xs));
						default:
							var p = e.a;
							return A2(
								elm$core$Maybe$map,
								function (td) {
									return _List_fromArray(
										[td]);
								},
								getTrackedPrim(p));
					}
				},
				elems));
		return function (d) {
			var newKeys = A2(
				elm$core$List$map,
				A2(
					elm$core$Basics$composeR,
					function ($) {
						return $.bz;
					},
					function ($) {
						return $.bc;
					}),
				newTrackedDataList);
			return A3(
				elm$core$List$foldr,
				F2(
					function (k, acc) {
						return (!A2(elm$core$List$member, k, newKeys)) ? A2(elm$core$Dict$remove, k, acc) : acc;
					}),
				d,
				elm$core$Dict$keys(d));
		}(
			function (tds) {
				return A3(
					elm$core$List$foldr,
					F2(
						function (_n0, acc) {
							var uid = _n0.a;
							var td = _n0.b;
							return A3(
								elm$core$Dict$update,
								uid,
								function (mbValue) {
									if (mbValue.$ === 1) {
										return elm$core$Maybe$Just(td);
									} else {
										var meta = mbValue.a.bz;
										var attrs = mbValue.a.p;
										var dataKind = mbValue.a.d;
										return elm$core$Maybe$Just(
											{p: attrs, d: dataKind, bz: td.bz});
									}
								},
								acc);
						}),
					currentTrackedData,
					tds);
			}(
				A2(
					elm$core$List$map,
					function (td) {
						return _Utils_Tuple2(td.bz.bc, td);
					},
					newTrackedDataList)));
	});
var elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2(elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var elm$parser$Parser$DeadEnd = F3(
	function (row, col, problem) {
		return {c7: col, dQ: problem, d$: row};
	});
var elm$parser$Parser$problemToDeadEnd = function (p) {
	return A3(elm$parser$Parser$DeadEnd, p.d$, p.c7, p.dQ);
};
var elm$parser$Parser$Advanced$bagToList = F2(
	function (bag, list) {
		bagToList:
		while (true) {
			switch (bag.$) {
				case 0:
					return list;
				case 1:
					var bag1 = bag.a;
					var x = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2(elm$core$List$cons, x, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
				default:
					var bag1 = bag.a;
					var bag2 = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2(elm$parser$Parser$Advanced$bagToList, bag2, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
			}
		}
	});
var elm$parser$Parser$Advanced$run = F2(
	function (_n0, src) {
		var parse = _n0;
		var _n1 = parse(
			{c7: 1, g: _List_Nil, cK: 1, gn: 0, d$: 1, d9: src});
		if (!_n1.$) {
			var value = _n1.b;
			return elm$core$Result$Ok(value);
		} else {
			var bag = _n1.b;
			return elm$core$Result$Err(
				A2(elm$parser$Parser$Advanced$bagToList, bag, _List_Nil));
		}
	});
var elm$parser$Parser$run = F2(
	function (parser, source) {
		var _n0 = A2(elm$parser$Parser$Advanced$run, parser, source);
		if (!_n0.$) {
			var a = _n0.a;
			return elm$core$Result$Ok(a);
		} else {
			var problems = _n0.a;
			return elm$core$Result$Err(
				A2(elm$core$List$map, elm$parser$Parser$problemToDeadEnd, problems));
		}
	});
var author$project$TextBlockPlugin$init = F3(
	function (attrs, mbInput, externalMsg) {
		var _n0 = author$project$TextBlockPlugin$fromTextBloc(
			A2(elm$core$Maybe$withDefault, _List_Nil, mbInput));
		var resultString = _n0.j;
		var trackedData = _n0.b;
		var nextUid = _n0.m;
		var _n1 = A2(elm$parser$Parser$run, author$project$TextBlockPlugin$textBlock, resultString);
		if (!_n1.$) {
			var res = _n1.a;
			var newTrackedData = A2(
				author$project$TextBlockPlugin$updateTrackedData,
				elm$core$Dict$fromList(trackedData),
				res);
			return _Utils_Tuple2(
				{
					P: elm$core$Maybe$Nothing,
					r: elm$core$Maybe$Nothing,
					bf: elm$core$Maybe$Nothing,
					fx: externalMsg,
					aY: elm$core$Maybe$Nothing,
					ab: false,
					m: nextUid,
					i: A2(
						elm$core$List$filterMap,
						author$project$TextBlockPlugin$toTextBlocElement(newTrackedData),
						res),
					C: elm$core$Result$Ok(res),
					a8: resultString,
					H: elm$core$Maybe$Nothing,
					cj: elm$core$Maybe$Nothing,
					a9: elm$core$Maybe$Nothing,
					as: elm$core$Maybe$Nothing,
					bn: elm$core$Maybe$Nothing,
					b: newTrackedData,
					q: function () {
						var _n2 = A2(elm$core$List$filter, author$project$TextBlockPlugin$isFontSizeAttr, attrs);
						if (!_n2.b) {
							return A2(
								elm$core$List$cons,
								author$project$Document$FontSize(16),
								attrs);
						} else {
							return attrs;
						}
					}()
				},
				A2(elm$core$Platform$Cmd$map, externalMsg, elm$core$Platform$Cmd$none));
		} else {
			return _Utils_Tuple2(
				{
					P: elm$core$Maybe$Nothing,
					r: elm$core$Maybe$Nothing,
					bf: elm$core$Maybe$Nothing,
					fx: externalMsg,
					aY: elm$core$Maybe$Nothing,
					ab: false,
					m: 0,
					i: _List_Nil,
					C: elm$core$Result$Ok(_List_Nil),
					a8: resultString,
					H: elm$core$Maybe$Nothing,
					cj: elm$core$Maybe$Nothing,
					a9: elm$core$Maybe$Nothing,
					as: elm$core$Maybe$Nothing,
					bn: elm$core$Maybe$Nothing,
					b: elm$core$Dict$empty,
					q: attrs
				},
				A2(elm$core$Platform$Cmd$map, externalMsg, elm$core$Platform$Cmd$none));
		}
	});
var author$project$Document$VideoSize = F2(
	function (videoWidth, videoHeight) {
		return {hH: videoHeight, hI: videoWidth};
	});
var author$project$VideoPlugin$init = F2(
	function (mbInput, externalMsg) {
		return {
			aP: A2(
				elm$core$Maybe$withDefault,
				1,
				A2(
					elm$core$Maybe$map,
					A2(elm$core$Basics$composeL, author$project$DocumentEditorHelpers$findAlignment, elm$core$Tuple$second),
					mbInput)),
			ff: A2(
				elm$core$Maybe$withDefault,
				false,
				A2(
					elm$core$Maybe$map,
					A2(
						elm$core$Basics$composeL,
						function ($) {
							return $.ff;
						},
						elm$core$Tuple$first),
					mbInput)),
			cy: '',
			fx: externalMsg,
			fE: A2(
				elm$core$Maybe$withDefault,
				false,
				A2(
					elm$core$Maybe$map,
					A2(
						elm$core$Basics$composeL,
						function ($) {
							return $.fE;
						},
						elm$core$Tuple$first),
					mbInput)),
			b8: A2(elm$core$Maybe$map, elm$core$Tuple$first, mbInput),
			a3: elm$core$Maybe$Nothing,
			a7: elm$core$Maybe$Nothing,
			gF: A2(
				elm$core$Maybe$withDefault,
				false,
				A2(
					elm$core$Maybe$map,
					A2(
						elm$core$Basics$composeL,
						function ($) {
							return $.gF;
						},
						elm$core$Tuple$first),
					mbInput)),
			d7: A2(
				elm$core$Maybe$withDefault,
				A2(author$project$Document$VideoSize, 560, 314),
				A2(
					elm$core$Maybe$map,
					A2(
						elm$core$Basics$composeL,
						function ($) {
							return $.d7;
						},
						elm$core$Tuple$first),
					mbInput)),
			bF: A2(
				elm$core$Maybe$withDefault,
				560 / 315,
				A2(
					elm$core$Maybe$map,
					function (mbI) {
						var _n0 = function (s) {
							return _Utils_Tuple2(s.hI, s.hH);
						}(mbI.a.d7);
						var w = _n0.a;
						var h = _n0.b;
						return w / h;
					},
					mbInput)),
			g2: A2(
				elm$core$Maybe$andThen,
				A2(
					elm$core$Basics$composeL,
					function ($) {
						return $.g2;
					},
					elm$core$Tuple$first),
				mbInput),
			hc: A2(
				elm$core$Maybe$withDefault,
				false,
				A2(
					elm$core$Maybe$map,
					A2(
						elm$core$Basics$composeL,
						function ($) {
							return $.hc;
						},
						elm$core$Tuple$first),
					mbInput)),
			hz: A2(
				elm$core$Maybe$withDefault,
				false,
				A2(
					elm$core$Maybe$map,
					A2(
						elm$core$Basics$composeL,
						function ($) {
							return $.hz;
						},
						elm$core$Tuple$first),
					mbInput)),
			cl: A2(
				elm$core$Maybe$withDefault,
				_List_Nil,
				A2(elm$core$Maybe$map, elm$core$Tuple$second, mbInput))
		};
	});
var billstclair$elm_localstorage$PortFunnel$LocalStorage$State = elm$core$Basics$identity;
var billstclair$elm_localstorage$PortFunnel$LocalStorage$initialState = function (prefix) {
	return {cM: false, G: prefix, aJ: elm$core$Dict$empty};
};
var billstclair$elm_localstorage$PortFunnel$InternalTypes$ListKeys = function (a) {
	return {$: 3, a: a};
};
var billstclair$elm_localstorage$PortFunnel$LocalStorage$listKeys = billstclair$elm_localstorage$PortFunnel$InternalTypes$ListKeys;
var billstclair$elm_localstorage$PortFunnel$InternalTypes$Clear = function (a) {
	return {$: 5, a: a};
};
var billstclair$elm_localstorage$PortFunnel$InternalTypes$Get = function (a) {
	return {$: 1, a: a};
};
var billstclair$elm_localstorage$PortFunnel$InternalTypes$Put = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var billstclair$elm_localstorage$PortFunnel$LocalStorage$addPrefix = F2(
	function (prefix, key) {
		return (prefix === '') ? key : (prefix + ('.' + key));
	});
var billstclair$elm_localstorage$PortFunnel$InternalTypes$Keys = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var billstclair$elm_localstorage$PortFunnel$InternalTypes$SimulateClear = function (a) {
	return {$: 9, a: a};
};
var billstclair$elm_localstorage$PortFunnel$InternalTypes$SimulateGet = function (a) {
	return {$: 6, a: a};
};
var billstclair$elm_localstorage$PortFunnel$InternalTypes$SimulateListKeys = function (a) {
	return {$: 8, a: a};
};
var billstclair$elm_localstorage$PortFunnel$InternalTypes$SimulatePut = F2(
	function (a, b) {
		return {$: 7, a: a, b: b};
	});
var billstclair$elm_localstorage$PortFunnel$InternalTypes$Startup = {$: 0};
var billstclair$elm_localstorage$PortFunnel$LocalStorage$KeysRecord = F2(
	function (prefix, keys) {
		return {f4: keys, G: prefix};
	});
var billstclair$elm_localstorage$PortFunnel$LocalStorage$keysDecoder = A3(
	elm$json$Json$Decode$map2,
	billstclair$elm_localstorage$PortFunnel$LocalStorage$KeysRecord,
	A2(elm$json$Json$Decode$field, 'prefix', elm$json$Json$Decode$string),
	A2(
		elm$json$Json$Decode$field,
		'keys',
		elm$json$Json$Decode$list(elm$json$Json$Decode$string)));
var billstclair$elm_localstorage$PortFunnel$LocalStorage$PutRecord = F2(
	function (key, value) {
		return {f3: key, ef: value};
	});
var elm$json$Json$Decode$value = _Json_decodeValue;
var billstclair$elm_localstorage$PortFunnel$LocalStorage$putDecoder = A3(
	elm$json$Json$Decode$map2,
	billstclair$elm_localstorage$PortFunnel$LocalStorage$PutRecord,
	A2(elm$json$Json$Decode$field, 'key', elm$json$Json$Decode$string),
	A2(elm$json$Json$Decode$field, 'value', elm$json$Json$Decode$value));
var billstclair$elm_localstorage$PortFunnel$LocalStorage$NOTAG = 10;
var billstclair$elm_localstorage$PortFunnel$LocalStorage$ClearTag = 5;
var billstclair$elm_localstorage$PortFunnel$LocalStorage$GetTag = 1;
var billstclair$elm_localstorage$PortFunnel$LocalStorage$KeysTag = 4;
var billstclair$elm_localstorage$PortFunnel$LocalStorage$ListKeysTag = 3;
var billstclair$elm_localstorage$PortFunnel$LocalStorage$PutTag = 2;
var billstclair$elm_localstorage$PortFunnel$LocalStorage$SimulateClearTag = 9;
var billstclair$elm_localstorage$PortFunnel$LocalStorage$SimulateGetTag = 6;
var billstclair$elm_localstorage$PortFunnel$LocalStorage$SimulateListKeysTag = 8;
var billstclair$elm_localstorage$PortFunnel$LocalStorage$SimulatePutTag = 7;
var billstclair$elm_localstorage$PortFunnel$LocalStorage$StartupTag = 0;
var billstclair$elm_localstorage$PortFunnel$LocalStorage$clearTag = 'clear';
var billstclair$elm_localstorage$PortFunnel$LocalStorage$getTag = 'get';
var billstclair$elm_localstorage$PortFunnel$LocalStorage$keysTag = 'keys';
var billstclair$elm_localstorage$PortFunnel$LocalStorage$listKeysTag = 'listkeys';
var billstclair$elm_localstorage$PortFunnel$LocalStorage$putTag = 'put';
var billstclair$elm_localstorage$PortFunnel$LocalStorage$simulateClearTag = 'simulateclear';
var billstclair$elm_localstorage$PortFunnel$LocalStorage$simulateGetTag = 'simulateget';
var billstclair$elm_localstorage$PortFunnel$LocalStorage$simulateListKeysTag = 'simulatelistkeys';
var billstclair$elm_localstorage$PortFunnel$LocalStorage$simulatePutTag = 'simulateput';
var billstclair$elm_localstorage$PortFunnel$LocalStorage$startupTag = 'startup';
var billstclair$elm_localstorage$PortFunnel$LocalStorage$tagDict = elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2(billstclair$elm_localstorage$PortFunnel$LocalStorage$startupTag, 0),
			_Utils_Tuple2(billstclair$elm_localstorage$PortFunnel$LocalStorage$getTag, 1),
			_Utils_Tuple2(billstclair$elm_localstorage$PortFunnel$LocalStorage$putTag, 2),
			_Utils_Tuple2(billstclair$elm_localstorage$PortFunnel$LocalStorage$listKeysTag, 3),
			_Utils_Tuple2(billstclair$elm_localstorage$PortFunnel$LocalStorage$keysTag, 4),
			_Utils_Tuple2(billstclair$elm_localstorage$PortFunnel$LocalStorage$clearTag, 5),
			_Utils_Tuple2(billstclair$elm_localstorage$PortFunnel$LocalStorage$simulateGetTag, 6),
			_Utils_Tuple2(billstclair$elm_localstorage$PortFunnel$LocalStorage$simulatePutTag, 7),
			_Utils_Tuple2(billstclair$elm_localstorage$PortFunnel$LocalStorage$simulateListKeysTag, 8),
			_Utils_Tuple2(billstclair$elm_localstorage$PortFunnel$LocalStorage$simulateClearTag, 9)
		]));
var billstclair$elm_localstorage$PortFunnel$LocalStorage$strtag = function (str) {
	var _n0 = A2(elm$core$Dict$get, str, billstclair$elm_localstorage$PortFunnel$LocalStorage$tagDict);
	if (!_n0.$) {
		var tag = _n0.a;
		return tag;
	} else {
		return 10;
	}
};
var elm$json$Json$Decode$decodeValue = _Json_run;
var elm$json$Json$Encode$null = _Json_encodeNull;
var billstclair$elm_localstorage$PortFunnel$LocalStorage$decode = function (_n0) {
	var tag = _n0.he;
	var args = _n0.eB;
	var _n1 = billstclair$elm_localstorage$PortFunnel$LocalStorage$strtag(tag);
	switch (_n1) {
		case 1:
			var _n2 = A2(elm$json$Json$Decode$decodeValue, elm$json$Json$Decode$string, args);
			if (!_n2.$) {
				var key = _n2.a;
				return elm$core$Result$Ok(
					billstclair$elm_localstorage$PortFunnel$InternalTypes$Get(key));
			} else {
				return elm$core$Result$Err(
					'Get key not a string: ' + A2(elm$json$Json$Encode$encode, 0, args));
			}
		case 2:
			var _n3 = A2(elm$json$Json$Decode$decodeValue, billstclair$elm_localstorage$PortFunnel$LocalStorage$putDecoder, args);
			if (!_n3.$) {
				var key = _n3.a.f3;
				var value = _n3.a.ef;
				return elm$core$Result$Ok(
					A2(
						billstclair$elm_localstorage$PortFunnel$InternalTypes$Put,
						key,
						_Utils_eq(value, elm$json$Json$Encode$null) ? elm$core$Maybe$Nothing : elm$core$Maybe$Just(value)));
			} else {
				return elm$core$Result$Err(
					'Put not { key, value }: ' + A2(elm$json$Json$Encode$encode, 0, args));
			}
		case 3:
			var _n4 = A2(elm$json$Json$Decode$decodeValue, elm$json$Json$Decode$string, args);
			if (!_n4.$) {
				var prefix = _n4.a;
				return elm$core$Result$Ok(
					billstclair$elm_localstorage$PortFunnel$InternalTypes$ListKeys(prefix));
			} else {
				return elm$core$Result$Err(
					'ListKeys prefix not a string: ' + A2(elm$json$Json$Encode$encode, 0, args));
			}
		case 4:
			var _n5 = A2(elm$json$Json$Decode$decodeValue, billstclair$elm_localstorage$PortFunnel$LocalStorage$keysDecoder, args);
			if (!_n5.$) {
				var prefix = _n5.a.G;
				var keys = _n5.a.f4;
				return elm$core$Result$Ok(
					A2(billstclair$elm_localstorage$PortFunnel$InternalTypes$Keys, prefix, keys));
			} else {
				return elm$core$Result$Err(
					'Keys not { prefix, keys }: ' + A2(elm$json$Json$Encode$encode, 0, args));
			}
		case 5:
			var _n6 = A2(elm$json$Json$Decode$decodeValue, elm$json$Json$Decode$string, args);
			if (!_n6.$) {
				var prefix = _n6.a;
				return elm$core$Result$Ok(
					billstclair$elm_localstorage$PortFunnel$InternalTypes$Clear(prefix));
			} else {
				return elm$core$Result$Err(
					'Clear prefix not a string: ' + A2(elm$json$Json$Encode$encode, 0, args));
			}
		case 0:
			return elm$core$Result$Ok(billstclair$elm_localstorage$PortFunnel$InternalTypes$Startup);
		case 6:
			var _n7 = A2(elm$json$Json$Decode$decodeValue, elm$json$Json$Decode$string, args);
			if (!_n7.$) {
				var key = _n7.a;
				return elm$core$Result$Ok(
					billstclair$elm_localstorage$PortFunnel$InternalTypes$SimulateGet(key));
			} else {
				return elm$core$Result$Err(
					'Get key not a string: ' + A2(elm$json$Json$Encode$encode, 0, args));
			}
		case 7:
			var _n8 = A2(elm$json$Json$Decode$decodeValue, billstclair$elm_localstorage$PortFunnel$LocalStorage$putDecoder, args);
			if (!_n8.$) {
				var key = _n8.a.f3;
				var value = _n8.a.ef;
				return elm$core$Result$Ok(
					A2(
						billstclair$elm_localstorage$PortFunnel$InternalTypes$SimulatePut,
						key,
						_Utils_eq(value, elm$json$Json$Encode$null) ? elm$core$Maybe$Nothing : elm$core$Maybe$Just(value)));
			} else {
				return elm$core$Result$Err(
					'SimulatePut not { key, value }: ' + A2(elm$json$Json$Encode$encode, 0, args));
			}
		case 8:
			var _n9 = A2(elm$json$Json$Decode$decodeValue, elm$json$Json$Decode$string, args);
			if (!_n9.$) {
				var prefix = _n9.a;
				return elm$core$Result$Ok(
					billstclair$elm_localstorage$PortFunnel$InternalTypes$SimulateListKeys(prefix));
			} else {
				return elm$core$Result$Err(
					'SimulateListKeys prefix not a string: ' + A2(elm$json$Json$Encode$encode, 0, args));
			}
		case 9:
			var _n10 = A2(elm$json$Json$Decode$decodeValue, elm$json$Json$Decode$string, args);
			if (!_n10.$) {
				var prefix = _n10.a;
				return elm$core$Result$Ok(
					billstclair$elm_localstorage$PortFunnel$InternalTypes$SimulateClear(prefix));
			} else {
				return elm$core$Result$Err(
					'SimulateClear prefix not a string: ' + A2(elm$json$Json$Encode$encode, 0, args));
			}
		default:
			return elm$core$Result$Err('Unknown tag: ' + tag);
	}
};
var billstclair$elm_localstorage$PortFunnel$LocalStorage$moduleName = 'LocalStorage';
var billstclair$elm_port_funnel$PortFunnel$GenericMessage = F3(
	function (moduleName, tag, args) {
		return {eB: args, gg: moduleName, he: tag};
	});
var elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
var elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			elm$core$List$foldl,
			F2(
				function (_n0, obj) {
					var k = _n0.a;
					var v = _n0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(0),
			pairs));
};
var elm$json$Json$Encode$string = _Json_wrap;
var billstclair$elm_localstorage$PortFunnel$LocalStorage$encode = function (message) {
	switch (message.$) {
		case 0:
			return A3(billstclair$elm_port_funnel$PortFunnel$GenericMessage, billstclair$elm_localstorage$PortFunnel$LocalStorage$moduleName, billstclair$elm_localstorage$PortFunnel$LocalStorage$startupTag, elm$json$Json$Encode$null);
		case 1:
			var key = message.a;
			return A3(
				billstclair$elm_port_funnel$PortFunnel$GenericMessage,
				billstclair$elm_localstorage$PortFunnel$LocalStorage$moduleName,
				billstclair$elm_localstorage$PortFunnel$LocalStorage$getTag,
				elm$json$Json$Encode$string(key));
		case 2:
			var key = message.a;
			var value = message.b;
			return A3(
				billstclair$elm_port_funnel$PortFunnel$GenericMessage,
				billstclair$elm_localstorage$PortFunnel$LocalStorage$moduleName,
				billstclair$elm_localstorage$PortFunnel$LocalStorage$putTag,
				elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'key',
							elm$json$Json$Encode$string(key)),
							_Utils_Tuple2(
							'value',
							function () {
								if (value.$ === 1) {
									return elm$json$Json$Encode$null;
								} else {
									var v = value.a;
									return v;
								}
							}())
						])));
		case 3:
			var prefix = message.a;
			return A3(
				billstclair$elm_port_funnel$PortFunnel$GenericMessage,
				billstclair$elm_localstorage$PortFunnel$LocalStorage$moduleName,
				billstclair$elm_localstorage$PortFunnel$LocalStorage$listKeysTag,
				elm$json$Json$Encode$string(prefix));
		case 4:
			var prefix = message.a;
			var keys = message.b;
			return A3(
				billstclair$elm_port_funnel$PortFunnel$GenericMessage,
				billstclair$elm_localstorage$PortFunnel$LocalStorage$moduleName,
				billstclair$elm_localstorage$PortFunnel$LocalStorage$keysTag,
				elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'prefix',
							elm$json$Json$Encode$string(prefix)),
							_Utils_Tuple2(
							'keys',
							A2(elm$json$Json$Encode$list, elm$json$Json$Encode$string, keys))
						])));
		case 5:
			var prefix = message.a;
			return A3(
				billstclair$elm_port_funnel$PortFunnel$GenericMessage,
				billstclair$elm_localstorage$PortFunnel$LocalStorage$moduleName,
				billstclair$elm_localstorage$PortFunnel$LocalStorage$clearTag,
				elm$json$Json$Encode$string(prefix));
		case 6:
			var key = message.a;
			return A3(
				billstclair$elm_port_funnel$PortFunnel$GenericMessage,
				billstclair$elm_localstorage$PortFunnel$LocalStorage$moduleName,
				billstclair$elm_localstorage$PortFunnel$LocalStorage$simulateGetTag,
				elm$json$Json$Encode$string(key));
		case 7:
			var key = message.a;
			var value = message.b;
			return A3(
				billstclair$elm_port_funnel$PortFunnel$GenericMessage,
				billstclair$elm_localstorage$PortFunnel$LocalStorage$moduleName,
				billstclair$elm_localstorage$PortFunnel$LocalStorage$simulatePutTag,
				elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'key',
							elm$json$Json$Encode$string(key)),
							_Utils_Tuple2(
							'value',
							function () {
								if (value.$ === 1) {
									return elm$json$Json$Encode$null;
								} else {
									var v = value.a;
									return v;
								}
							}())
						])));
		case 8:
			var prefix = message.a;
			return A3(
				billstclair$elm_port_funnel$PortFunnel$GenericMessage,
				billstclair$elm_localstorage$PortFunnel$LocalStorage$moduleName,
				billstclair$elm_localstorage$PortFunnel$LocalStorage$simulateListKeysTag,
				elm$json$Json$Encode$string(prefix));
		default:
			var prefix = message.a;
			return A3(
				billstclair$elm_port_funnel$PortFunnel$GenericMessage,
				billstclair$elm_localstorage$PortFunnel$LocalStorage$moduleName,
				billstclair$elm_localstorage$PortFunnel$LocalStorage$simulateClearTag,
				elm$json$Json$Encode$string(prefix));
	}
};
var billstclair$elm_localstorage$PortFunnel$LocalStorage$GetResponse = function (a) {
	return {$: 1, a: a};
};
var billstclair$elm_localstorage$PortFunnel$LocalStorage$ListKeysResponse = function (a) {
	return {$: 2, a: a};
};
var billstclair$elm_localstorage$PortFunnel$LocalStorage$NoResponse = {$: 0};
var elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			elm$core$String$slice,
			n,
			elm$core$String$length(string),
			string);
	});
var billstclair$elm_localstorage$PortFunnel$LocalStorage$stripPrefix = F2(
	function (prefix, key) {
		return (prefix === '') ? key : A2(
			elm$core$String$dropLeft,
			1 + elm$core$String$length(prefix),
			key);
	});
var elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === -2) {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3(elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var elm$core$Dict$filter = F2(
	function (isGood, dict) {
		return A3(
			elm$core$Dict$foldl,
			F3(
				function (k, v, d) {
					return A2(isGood, k, v) ? A3(elm$core$Dict$insert, k, v, d) : d;
				}),
			elm$core$Dict$empty,
			dict);
	});
var elm_community$dict_extra$Dict$Extra$removeWhen = F2(
	function (pred, dict) {
		return A2(
			elm$core$Dict$filter,
			F2(
				function (k, v) {
					return !A2(pred, k, v);
				}),
			dict);
	});
var billstclair$elm_localstorage$PortFunnel$LocalStorage$process = F2(
	function (message, boxedState) {
		var state = boxedState;
		switch (message.$) {
			case 2:
				var key = message.a;
				var value = message.b;
				return _Utils_Tuple2(
					boxedState,
					billstclair$elm_localstorage$PortFunnel$LocalStorage$GetResponse(
						{
							f3: A2(billstclair$elm_localstorage$PortFunnel$LocalStorage$stripPrefix, state.G, key),
							ef: value
						}));
			case 4:
				var prefix = message.a;
				var keys = message.b;
				return _Utils_Tuple2(
					boxedState,
					billstclair$elm_localstorage$PortFunnel$LocalStorage$ListKeysResponse(
						{
							f4: A2(
								elm$core$List$map,
								billstclair$elm_localstorage$PortFunnel$LocalStorage$stripPrefix(state.G),
								keys),
							G: A2(billstclair$elm_localstorage$PortFunnel$LocalStorage$stripPrefix, state.G, prefix)
						}));
			case 0:
				return _Utils_Tuple2(
					_Utils_update(
						state,
						{cM: true}),
					billstclair$elm_localstorage$PortFunnel$LocalStorage$NoResponse);
			case 6:
				var key = message.a;
				return _Utils_Tuple2(
					boxedState,
					billstclair$elm_localstorage$PortFunnel$LocalStorage$GetResponse(
						{
							f3: A2(billstclair$elm_localstorage$PortFunnel$LocalStorage$stripPrefix, state.G, key),
							ef: A2(elm$core$Dict$get, key, state.aJ)
						}));
			case 7:
				var key = message.a;
				var value = message.b;
				return _Utils_Tuple2(
					_Utils_update(
						state,
						{
							aJ: function () {
								if (value.$ === 1) {
									return A2(elm$core$Dict$remove, key, state.aJ);
								} else {
									var v = value.a;
									return A3(elm$core$Dict$insert, key, v, state.aJ);
								}
							}()
						}),
					billstclair$elm_localstorage$PortFunnel$LocalStorage$NoResponse);
			case 8:
				var prefix = message.a;
				return _Utils_Tuple2(
					boxedState,
					billstclair$elm_localstorage$PortFunnel$LocalStorage$ListKeysResponse(
						{
							f4: A3(
								elm$core$Dict$foldr,
								F3(
									function (k, _n2, res) {
										return A2(elm$core$String$startsWith, prefix, k) ? A2(
											elm$core$List$cons,
											A2(billstclair$elm_localstorage$PortFunnel$LocalStorage$stripPrefix, state.G, k),
											res) : res;
									}),
								_List_Nil,
								state.aJ),
							G: A2(billstclair$elm_localstorage$PortFunnel$LocalStorage$stripPrefix, state.G, prefix)
						}));
			case 9:
				var prefix = message.a;
				return _Utils_Tuple2(
					_Utils_update(
						state,
						{
							aJ: A2(
								elm_community$dict_extra$Dict$Extra$removeWhen,
								F2(
									function (k, _n3) {
										return A2(elm$core$String$startsWith, prefix, k);
									}),
								state.aJ)
						}),
					billstclair$elm_localstorage$PortFunnel$LocalStorage$NoResponse);
			default:
				return _Utils_Tuple2(state, billstclair$elm_localstorage$PortFunnel$LocalStorage$NoResponse);
		}
	});
var billstclair$elm_port_funnel$PortFunnel$ModuleDesc = elm$core$Basics$identity;
var billstclair$elm_port_funnel$PortFunnel$ModuleDescRecord = F4(
	function (moduleName, encoder, decoder, process) {
		return {cv: decoder, cx: encoder, gg: moduleName, dS: process};
	});
var billstclair$elm_port_funnel$PortFunnel$makeModuleDesc = F4(
	function (name, encoder, decoder, processor) {
		return A4(billstclair$elm_port_funnel$PortFunnel$ModuleDescRecord, name, encoder, decoder, processor);
	});
var billstclair$elm_localstorage$PortFunnel$LocalStorage$moduleDesc = A4(billstclair$elm_port_funnel$PortFunnel$makeModuleDesc, billstclair$elm_localstorage$PortFunnel$LocalStorage$moduleName, billstclair$elm_localstorage$PortFunnel$LocalStorage$encode, billstclair$elm_localstorage$PortFunnel$LocalStorage$decode, billstclair$elm_localstorage$PortFunnel$LocalStorage$process);
var billstclair$elm_port_funnel$PortFunnel$encodeGenericMessage = function (message) {
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'module',
				elm$json$Json$Encode$string(message.gg)),
				_Utils_Tuple2(
				'tag',
				elm$json$Json$Encode$string(message.he)),
				_Utils_Tuple2('args', message.eB)
			]));
};
var billstclair$elm_port_funnel$PortFunnel$messageToValue = F2(
	function (_n0, message) {
		var moduleDesc = _n0;
		return billstclair$elm_port_funnel$PortFunnel$encodeGenericMessage(
			moduleDesc.cx(message));
	});
var billstclair$elm_port_funnel$PortFunnel$sendMessage = F3(
	function (moduleDesc, cmdPort, message) {
		return cmdPort(
			A2(billstclair$elm_port_funnel$PortFunnel$messageToValue, moduleDesc, message));
	});
var billstclair$elm_localstorage$PortFunnel$LocalStorage$send = F3(
	function (wrapper, message, _n0) {
		var state = _n0;
		var prefix = state.G;
		var mess = function () {
			switch (message.$) {
				case 1:
					var key = message.a;
					return billstclair$elm_localstorage$PortFunnel$InternalTypes$Get(
						A2(billstclair$elm_localstorage$PortFunnel$LocalStorage$addPrefix, prefix, key));
				case 2:
					var key = message.a;
					var value = message.b;
					return A2(
						billstclair$elm_localstorage$PortFunnel$InternalTypes$Put,
						A2(billstclair$elm_localstorage$PortFunnel$LocalStorage$addPrefix, prefix, key),
						value);
				case 3:
					var pref = message.a;
					return billstclair$elm_localstorage$PortFunnel$InternalTypes$ListKeys(
						A2(billstclair$elm_localstorage$PortFunnel$LocalStorage$addPrefix, prefix, pref));
				case 5:
					var pref = message.a;
					return billstclair$elm_localstorage$PortFunnel$InternalTypes$Clear(
						A2(billstclair$elm_localstorage$PortFunnel$LocalStorage$addPrefix, prefix, pref));
				default:
					return message;
			}
		}();
		return A3(billstclair$elm_port_funnel$PortFunnel$sendMessage, billstclair$elm_localstorage$PortFunnel$LocalStorage$moduleDesc, wrapper, mess);
	});
var elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var elm$browser$Browser$Dom$NotFound = elm$core$Basics$identity;
var elm$core$Basics$never = function (_n0) {
	never:
	while (true) {
		var nvr = _n0;
		var $temp$_n0 = nvr;
		_n0 = $temp$_n0;
		continue never;
	}
};
var elm$core$Task$perform = F2(
	function (toMessage, task) {
		return elm$core$Task$command(
			A2(elm$core$Task$map, toMessage, task));
	});
var elm$json$Json$Decode$map = _Json_map1;
var elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var elm$url$Url$Http = 0;
var elm$url$Url$Https = 1;
var elm$core$String$indexes = _String_indexes;
var elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3(elm$core$String$slice, 0, n, string);
	});
var elm$core$String$contains = _String_contains;
var elm$core$String$toInt = _String_toInt;
var elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {di: fragment, dq: host, af: path, dP: port_, dU: protocol, dV: query};
	});
var elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if (elm$core$String$isEmpty(str) || A2(elm$core$String$contains, '@', str)) {
			return elm$core$Maybe$Nothing;
		} else {
			var _n0 = A2(elm$core$String$indexes, ':', str);
			if (!_n0.b) {
				return elm$core$Maybe$Just(
					A6(elm$url$Url$Url, protocol, str, elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_n0.b.b) {
					var i = _n0.a;
					var _n1 = elm$core$String$toInt(
						A2(elm$core$String$dropLeft, i + 1, str));
					if (_n1.$ === 1) {
						return elm$core$Maybe$Nothing;
					} else {
						var port_ = _n1;
						return elm$core$Maybe$Just(
							A6(
								elm$url$Url$Url,
								protocol,
								A2(elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return elm$core$Maybe$Nothing;
				}
			}
		}
	});
var elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if (elm$core$String$isEmpty(str)) {
			return elm$core$Maybe$Nothing;
		} else {
			var _n0 = A2(elm$core$String$indexes, '/', str);
			if (!_n0.b) {
				return A5(elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _n0.a;
				return A5(
					elm$url$Url$chompBeforePath,
					protocol,
					A2(elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2(elm$core$String$left, i, str));
			}
		}
	});
var elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if (elm$core$String$isEmpty(str)) {
			return elm$core$Maybe$Nothing;
		} else {
			var _n0 = A2(elm$core$String$indexes, '?', str);
			if (!_n0.b) {
				return A4(elm$url$Url$chompBeforeQuery, protocol, elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _n0.a;
				return A4(
					elm$url$Url$chompBeforeQuery,
					protocol,
					elm$core$Maybe$Just(
						A2(elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2(elm$core$String$left, i, str));
			}
		}
	});
var elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if (elm$core$String$isEmpty(str)) {
			return elm$core$Maybe$Nothing;
		} else {
			var _n0 = A2(elm$core$String$indexes, '#', str);
			if (!_n0.b) {
				return A3(elm$url$Url$chompBeforeFragment, protocol, elm$core$Maybe$Nothing, str);
			} else {
				var i = _n0.a;
				return A3(
					elm$url$Url$chompBeforeFragment,
					protocol,
					elm$core$Maybe$Just(
						A2(elm$core$String$dropLeft, i + 1, str)),
					A2(elm$core$String$left, i, str));
			}
		}
	});
var elm$url$Url$fromString = function (str) {
	return A2(elm$core$String$startsWith, 'http://', str) ? A2(
		elm$url$Url$chompAfterProtocol,
		0,
		A2(elm$core$String$dropLeft, 7, str)) : (A2(elm$core$String$startsWith, 'https://', str) ? A2(
		elm$url$Url$chompAfterProtocol,
		1,
		A2(elm$core$String$dropLeft, 8, str)) : elm$core$Maybe$Nothing);
};
var elm$browser$Browser$Dom$getViewport = _Browser_withWindow(_Browser_getViewport);
var elm$browser$Browser$Dom$getViewportOf = _Browser_getViewportOf;
var author$project$Editor$init = F2(
	function (doc, flags) {
		var handlers = {
			eW: author$project$Editor$EditCell,
			e8: author$project$Editor$SelectDoc,
			e9: function (_n5) {
				return author$project$Editor$NoOp;
			},
			gk: function (_n6) {
				return author$project$Editor$Rewind;
			}
		};
		var funnelState = {
			ah: billstclair$elm_localstorage$PortFunnel$LocalStorage$initialState('Editor')
		};
		var _n0 = A3(author$project$TextBlockPlugin$init, _List_Nil, elm$core$Maybe$Nothing, author$project$Editor$TextBlockPluginMsg);
		var newTextBlockPlugin = _n0.a;
		var textBlockPluginCmds = _n0.b;
		var _n1 = A2(author$project$ImagePlugin$init, elm$core$Maybe$Nothing, author$project$Editor$ImagePluginMsg);
		var newImagePlugin = _n1.a;
		var imagePluginCmds = _n1.b;
		var _n2 = author$project$Document$setSizeTrackedDocUids(doc);
		var doc_ = _n2.a;
		var idsToTrack = _n2.b;
		var config = {
			fb: false,
			fl: elm$core$Dict$empty,
			fu: true,
			fL: 1080,
			f9: 75,
			gq: function (_n4) {
				return author$project$Editor$RefreshSizes;
			},
			g_: elm$core$Dict$fromList(
				A2(
					elm$core$List$map,
					function (uid) {
						return _Utils_Tuple2(
							uid,
							{fs: 0, ft: 0});
					},
					idsToTrack)),
			g8: author$project$StyleSheets$defaulStyleSheet,
			hL: 1920,
			hN: elm$core$Maybe$Just(handlers)
		};
		var _n3 = A3(author$project$FilesysPlugin$init, 0, 0, author$project$Editor$FilesysPluginMsg);
		var newFilesysPlugin = _n3.a;
		var filesysPluginCmds = _n3.b;
		return _Utils_Tuple2(
			{
				aS: elm$core$Maybe$Nothing,
				l: config,
				bY: false,
				h: elm$core$Maybe$Nothing,
				a: author$project$DocumentZipper$initZip(doc_),
				bw: newFilesysPlugin,
				an: funnelState,
				aA: newImagePlugin,
				aZ: '',
				ap: '',
				by: _List_Nil,
				ad: elm$core$Maybe$Nothing,
				a$: false,
				b9: '',
				m: author$project$DocumentEditorHelpers$docSize(doc_),
				Y: 0,
				aL: A2(author$project$TablePlugin$init, elm$core$Maybe$Nothing, author$project$Editor$TablePluginMsg),
				aM: newTextBlockPlugin,
				au: _List_Nil,
				aO: A2(author$project$VideoPlugin$init, elm$core$Maybe$Nothing, author$project$Editor$VideoPluginMsg)
			},
			elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						A2(elm$core$Task$perform, author$project$Editor$CurrentViewport, elm$browser$Browser$Dom$getViewport),
						A2(
						elm$core$Task$attempt,
						author$project$Editor$MainInterfaceViewport,
						elm$browser$Browser$Dom$getViewportOf('mainInterface')),
						textBlockPluginCmds,
						imagePluginCmds,
						filesysPluginCmds,
						A3(
						billstclair$elm_localstorage$PortFunnel$LocalStorage$send,
						author$project$Editor$cmdPort,
						billstclair$elm_localstorage$PortFunnel$LocalStorage$listKeys(''),
						funnelState.ah)
					])));
	});
var author$project$Editor$KeyDown = function (a) {
	return {$: 6, a: a};
};
var author$project$Editor$KeyUp = function (a) {
	return {$: 7, a: a};
};
var author$project$Editor$Process = function (a) {
	return {$: 48, a: a};
};
var author$project$Editor$WinResize = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var author$project$Editor$keyDecoder = A2(elm$json$Json$Decode$field, 'key', elm$json$Json$Decode$string);
var author$project$Editor$subPort = _Platform_incomingPort('subPort', elm$json$Json$Decode$value);
var elm$browser$Browser$Events$Document = 0;
var elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {dN: pids, ea: subs};
	});
var elm$browser$Browser$Events$init = elm$core$Task$succeed(
	A2(elm$browser$Browser$Events$State, _List_Nil, elm$core$Dict$empty));
var elm$browser$Browser$Events$nodeToKey = function (node) {
	if (!node) {
		return 'd_';
	} else {
		return 'w_';
	}
};
var elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {df: event, f3: key};
	});
var elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var elm$browser$Browser$Events$spawn = F3(
	function (router, key, _n0) {
		var node = _n0.a;
		var name = _n0.b;
		var actualNode = function () {
			if (!node) {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						elm$core$Platform$sendToSelf,
						router,
						A2(elm$browser$Browser$Events$Event, key, event));
				}));
	});
var elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _n0) {
				stepState:
				while (true) {
					var list = _n0.a;
					var result = _n0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _n2 = list.a;
						var lKey = _n2.a;
						var lValue = _n2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_n0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_n0 = $temp$_n0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _n3 = A3(
			elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _n3.a;
		var intermediateResult = _n3.b;
		return A3(
			elm$core$List$foldl,
			F2(
				function (_n4, result) {
					var k = _n4.a;
					var v = _n4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3(elm$core$Dict$foldl, elm$core$Dict$insert, t2, t1);
	});
var elm$core$Process$kill = _Scheduler_kill;
var elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _n6) {
				var deads = _n6.a;
				var lives = _n6.b;
				var news = _n6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						elm$core$List$cons,
						A3(elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_n4, pid, _n5) {
				var deads = _n5.a;
				var lives = _n5.b;
				var news = _n5.c;
				return _Utils_Tuple3(
					A2(elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _n2, _n3) {
				var deads = _n3.a;
				var lives = _n3.b;
				var news = _n3.c;
				return _Utils_Tuple3(
					deads,
					A3(elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2(elm$core$List$map, elm$browser$Browser$Events$addKey, subs);
		var _n0 = A6(
			elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.dN,
			elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, elm$core$Dict$empty, _List_Nil));
		var deadPids = _n0.a;
		var livePids = _n0.b;
		var makeNewPids = _n0.c;
		return A2(
			elm$core$Task$andThen,
			function (pids) {
				return elm$core$Task$succeed(
					A2(
						elm$browser$Browser$Events$State,
						newSubs,
						A2(
							elm$core$Dict$union,
							livePids,
							elm$core$Dict$fromList(pids))));
			},
			A2(
				elm$core$Task$andThen,
				function (_n1) {
					return elm$core$Task$sequence(makeNewPids);
				},
				elm$core$Task$sequence(
					A2(elm$core$List$map, elm$core$Process$kill, deadPids))));
	});
var elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _n0, state) {
		var key = _n0.f3;
		var event = _n0.df;
		var toMessage = function (_n2) {
			var subKey = _n2.a;
			var _n3 = _n2.b;
			var node = _n3.a;
			var name = _n3.b;
			var decoder = _n3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : elm$core$Maybe$Nothing;
		};
		var messages = A2(elm$core$List$filterMap, toMessage, state.ea);
		return A2(
			elm$core$Task$andThen,
			function (_n1) {
				return elm$core$Task$succeed(state);
			},
			elm$core$Task$sequence(
				A2(
					elm$core$List$map,
					elm$core$Platform$sendToApp(router),
					messages)));
	});
var elm$browser$Browser$Events$subMap = F2(
	function (func, _n0) {
		var node = _n0.a;
		var name = _n0.b;
		var decoder = _n0.c;
		return A3(
			elm$browser$Browser$Events$MySub,
			node,
			name,
			A2(elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager(elm$browser$Browser$Events$init, elm$browser$Browser$Events$onEffects, elm$browser$Browser$Events$onSelfMsg, 0, elm$browser$Browser$Events$subMap);
var elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return elm$browser$Browser$Events$subscription(
			A3(elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var elm$browser$Browser$Events$onKeyDown = A2(elm$browser$Browser$Events$on, 0, 'keydown');
var elm$browser$Browser$Events$onKeyUp = A2(elm$browser$Browser$Events$on, 0, 'keyup');
var elm$browser$Browser$Events$Window = 1;
var elm$json$Json$Decode$int = _Json_decodeInt;
var elm$browser$Browser$Events$onResize = function (func) {
	return A3(
		elm$browser$Browser$Events$on,
		1,
		'resize',
		A2(
			elm$json$Json$Decode$field,
			'target',
			A3(
				elm$json$Json$Decode$map2,
				func,
				A2(elm$json$Json$Decode$field, 'innerWidth', elm$json$Json$Decode$int),
				A2(elm$json$Json$Decode$field, 'innerHeight', elm$json$Json$Decode$int))));
};
var elm$core$Platform$Sub$batch = _Platform_batch;
var author$project$Editor$subscriptions = function (model) {
	return elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				elm$browser$Browser$Events$onResize(author$project$Editor$WinResize),
				elm$browser$Browser$Events$onKeyDown(
				A2(elm$json$Json$Decode$map, author$project$Editor$KeyDown, author$project$Editor$keyDecoder)),
				elm$browser$Browser$Events$onKeyUp(
				A2(elm$json$Json$Decode$map, author$project$Editor$KeyUp, author$project$Editor$keyDecoder)),
				author$project$Editor$subPort(author$project$Editor$Process)
			]));
};
var andrewMacmurray$elm_delay$Delay$Millisecond = 0;
var andrewMacmurray$elm_delay$Delay$Duration = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var elm$core$Process$sleep = _Process_sleep;
var andrewMacmurray$elm_delay$Delay$after_ = F2(
	function (time, msg) {
		return A2(
			elm$core$Task$perform,
			elm$core$Basics$always(msg),
			elm$core$Process$sleep(time));
	});
var andrewMacmurray$elm_delay$Delay$Minute = 2;
var andrewMacmurray$elm_delay$Delay$Second = 1;
var andrewMacmurray$elm_delay$Delay$toMillis = function (_n0) {
	var t = _n0.a;
	var u = _n0.b;
	switch (u) {
		case 0:
			return t;
		case 1:
			return 1000 * t;
		case 2:
			return andrewMacmurray$elm_delay$Delay$toMillis(
				A2(andrewMacmurray$elm_delay$Delay$Duration, 60 * t, 1));
		default:
			return andrewMacmurray$elm_delay$Delay$toMillis(
				A2(andrewMacmurray$elm_delay$Delay$Duration, 60 * t, 2));
	}
};
var andrewMacmurray$elm_delay$Delay$after = F3(
	function (time, unit, msg) {
		return A2(
			andrewMacmurray$elm_delay$Delay$after_,
			andrewMacmurray$elm_delay$Delay$toMillis(
				A2(andrewMacmurray$elm_delay$Delay$Duration, time, unit)),
			msg);
	});
var author$project$Document$Image = function (a) {
	return {$: 0, a: a};
};
var author$project$Document$Table = function (a) {
	return {$: 2, a: a};
};
var author$project$Document$TextBlock = function (a) {
	return {$: 4, a: a};
};
var author$project$Document$Video = function (a) {
	return {$: 1, a: a};
};
var author$project$Document$getAttrs = function (doc) {
	if (doc.$ === 1) {
		var cellContent = doc.a.aa;
		var id = doc.a.c;
		var attrs = doc.a.p;
		return attrs;
	} else {
		var containerLabel = doc.a.ak;
		var id = doc.a.c;
		var attrs = doc.a.p;
		return attrs;
	}
};
var author$project$Document$getHtmlId = function (doc) {
	if (doc.$ === 1) {
		var cv = doc.a;
		return cv.c.ao;
	} else {
		var cv = doc.a;
		return cv.c.ao;
	}
};
var author$project$Document$getId = function (doc) {
	if (doc.$ === 1) {
		var cellContent = doc.a.aa;
		var id = doc.a.c;
		var attrs = doc.a.p;
		return id;
	} else {
		var containerLabel = doc.a.ak;
		var id = doc.a.c;
		var attrs = doc.a.p;
		return id;
	}
};
var author$project$Document$hasUid = F2(
	function (id, document) {
		if (!document.$) {
			var nv = document.a;
			return _Utils_eq(id, nv.c.bc);
		} else {
			var lv = document.a;
			return _Utils_eq(id, lv.c.bc);
		}
	});
var elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3(elm$core$List$foldr, elm$json$Json$Decode$field, decoder, fields);
	});
var NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt = F3(
	function (path, valDecoder, decoder) {
		return A2(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A2(elm$json$Json$Decode$at, path, valDecoder),
			decoder);
	});
var author$project$Document$CellValue = F3(
	function (cellContent, id, attrs) {
		return {p: attrs, aa: cellContent, c: id};
	});
var author$project$Document$CustomElement = function (a) {
	return {$: 3, a: a};
};
var author$project$Document$EmptyCell = {$: 5};
var author$project$Document$ImageMeta = F3(
	function (src, caption, size) {
		return {eV: caption, d7: size, d9: src};
	});
var author$project$Document$ImgSize = F2(
	function (imgWidth, imgHeight) {
		return {fU: imgHeight, fV: imgWidth};
	});
var author$project$DocumentDecoder$decodeImageSize = A3(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'imgHeight',
	elm$json$Json$Decode$int,
	A3(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'imgWidth',
		elm$json$Json$Decode$int,
		elm$json$Json$Decode$succeed(author$project$Document$ImgSize)));
var author$project$Document$Inline = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var author$project$Document$UrlSrc = function (a) {
	return {$: 0, a: a};
};
var elm$json$Json$Decode$oneOf = _Json_oneOf;
var author$project$DocumentDecoder$decodeImgSource = elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'UrlSrc',
			elm$json$Json$Decode$string,
			elm$json$Json$Decode$succeed(author$project$Document$UrlSrc)),
			A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
			_List_fromArray(
				['Inline', 'contents']),
			elm$json$Json$Decode$string,
			A3(
				NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
				_List_fromArray(
					['Inline', 'filename']),
				elm$json$Json$Decode$string,
				elm$json$Json$Decode$succeed(author$project$Document$Inline)))
		]));
var elm$json$Json$Decode$null = _Json_decodeNull;
var elm$json$Json$Decode$nullable = function (decoder) {
	return elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				elm$json$Json$Decode$null(elm$core$Maybe$Nothing),
				A2(elm$json$Json$Decode$map, elm$core$Maybe$Just, decoder)
			]));
};
var author$project$DocumentDecoder$decodeImageMeta = A3(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'size',
	author$project$DocumentDecoder$decodeImageSize,
	A3(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'caption',
		elm$json$Json$Decode$nullable(elm$json$Json$Decode$string),
		A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'src',
			author$project$DocumentDecoder$decodeImgSource,
			elm$json$Json$Decode$succeed(author$project$Document$ImageMeta))));
var author$project$Document$TableMeta = F4(
	function (style, nbrRows, nbrCols, data) {
		return {fn: data, gi: nbrCols, gj: nbrRows, g7: style};
	});
var author$project$DocumentDecoder$decodeTableMeta = A3(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'data',
	elm$json$Json$Decode$list(
		A2(
			elm$json$Json$Decode$map,
			elm$core$Array$fromList,
			elm$json$Json$Decode$list(elm$json$Json$Decode$string))),
	A3(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'nbrCols',
		elm$json$Json$Decode$int,
		A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'nbrRows',
			elm$json$Json$Decode$int,
			A3(
				NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'style',
				elm$json$Json$Decode$string,
				elm$json$Json$Decode$succeed(author$project$Document$TableMeta)))));
var author$project$Document$AlignLeft = {$: 3};
var author$project$Document$AlignRight = {$: 2};
var author$project$Document$BackgroundColor = function (a) {
	return {$: 5, a: a};
};
var author$project$Document$Bold = {$: 16};
var author$project$Document$Border = {$: 8};
var author$project$Document$Center = {$: 14};
var author$project$Document$Font = function (a) {
	return {$: 9, a: a};
};
var author$project$Document$FontAlignLeft = {$: 12};
var author$project$Document$FontAlignRight = {$: 13};
var author$project$Document$FontColor = function (a) {
	return {$: 10, a: a};
};
var author$project$Document$Height = function (a) {
	return {$: 7, a: a};
};
var author$project$Document$Italic = {$: 17};
var author$project$Document$Justify = {$: 15};
var author$project$Document$PaddingEach = function (a) {
	return {$: 0, a: a};
};
var author$project$Document$Pointer = {$: 4};
var author$project$Document$SpacingXY = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var author$project$Document$Width = function (a) {
	return {$: 6, a: a};
};
var author$project$Document$DocColor = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var elm$json$Json$Decode$float = _Json_decodeFloat;
var author$project$DocumentDecoder$decodeDocColor = A3(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
	_List_fromArray(
		['DocColor', 'blue']),
	elm$json$Json$Decode$float,
	A3(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
		_List_fromArray(
			['DocColor', 'green']),
		elm$json$Json$Decode$float,
		A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
			_List_fromArray(
				['DocColor', 'red']),
			elm$json$Json$Decode$float,
			elm$json$Json$Decode$succeed(author$project$Document$DocColor))));
var elm$json$Json$Decode$andThen = _Json_andThen;
var elm$json$Json$Decode$fail = _Json_fail;
var author$project$DocumentDecoder$decodeDocAttribute = elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
			_List_fromArray(
				['PaddingEach', 'top']),
			elm$json$Json$Decode$int,
			A3(
				NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
				_List_fromArray(
					['PaddingEach', 'right']),
				elm$json$Json$Decode$int,
				A3(
					NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
					_List_fromArray(
						['PaddingEach', 'left']),
					elm$json$Json$Decode$int,
					A3(
						NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
						_List_fromArray(
							['PaddingEach', 'bottom']),
						elm$json$Json$Decode$int,
						elm$json$Json$Decode$succeed(
							F4(
								function (b, l, r, t) {
									return author$project$Document$PaddingEach(
										{eO: b, f5: l, gK: r, hA: t});
								})))))),
			A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
			_List_fromArray(
				['SpacingXY', 'Y']),
			elm$json$Json$Decode$int,
			A3(
				NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
				_List_fromArray(
					['SpacingXY', 'X']),
				elm$json$Json$Decode$int,
				elm$json$Json$Decode$succeed(author$project$Document$SpacingXY))),
			A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'BackgroundColor',
			author$project$DocumentDecoder$decodeDocColor,
			elm$json$Json$Decode$succeed(author$project$Document$BackgroundColor)),
			A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'Width',
			elm$json$Json$Decode$int,
			elm$json$Json$Decode$succeed(author$project$Document$Width)),
			A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'Height',
			elm$json$Json$Decode$int,
			elm$json$Json$Decode$succeed(author$project$Document$Height)),
			A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'Font',
			elm$json$Json$Decode$string,
			elm$json$Json$Decode$succeed(author$project$Document$Font)),
			A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'FontColor',
			author$project$DocumentDecoder$decodeDocColor,
			elm$json$Json$Decode$succeed(author$project$Document$FontColor)),
			A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'FontSize',
			elm$json$Json$Decode$int,
			elm$json$Json$Decode$succeed(author$project$Document$FontSize)),
			A2(
			elm$json$Json$Decode$andThen,
			function (str) {
				switch (str) {
					case 'AlignRight':
						return elm$json$Json$Decode$succeed(author$project$Document$AlignRight);
					case 'AlignLeft':
						return elm$json$Json$Decode$succeed(author$project$Document$AlignLeft);
					case 'Pointer':
						return elm$json$Json$Decode$succeed(author$project$Document$Pointer);
					case 'Border':
						return elm$json$Json$Decode$succeed(author$project$Document$Border);
					case 'FontAlignLeft':
						return elm$json$Json$Decode$succeed(author$project$Document$FontAlignLeft);
					case 'FontAlignRight':
						return elm$json$Json$Decode$succeed(author$project$Document$FontAlignRight);
					case 'Center':
						return elm$json$Json$Decode$succeed(author$project$Document$Center);
					case 'Justify':
						return elm$json$Json$Decode$succeed(author$project$Document$Justify);
					case 'Bold':
						return elm$json$Json$Decode$succeed(author$project$Document$Bold);
					case 'Italic':
						return elm$json$Json$Decode$succeed(author$project$Document$Italic);
					default:
						var somethingElse = str;
						return elm$json$Json$Decode$fail('Unknown DocAttribute: ' + somethingElse);
				}
			},
			elm$json$Json$Decode$string)
		]));
var author$project$DocumentDecoder$decodeDocAttributes = elm$json$Json$Decode$list(author$project$DocumentDecoder$decodeDocAttribute);
var author$project$Document$LinkMeta = F3(
	function (targetBlank, url, label) {
		return {b4: label, hf: targetBlank, hG: url};
	});
var elm$json$Json$Decode$bool = _Json_decodeBool;
var author$project$DocumentDecoder$decodeLinkMeta = A3(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'label',
	elm$json$Json$Decode$string,
	A3(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'url',
		elm$json$Json$Decode$string,
		A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'targetBlank',
			elm$json$Json$Decode$bool,
			elm$json$Json$Decode$succeed(author$project$Document$LinkMeta))));
var author$project$DocumentDecoder$decodeTextBlockPrimitive = elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
			_List_fromArray(
				['Text', 'value']),
			elm$json$Json$Decode$string,
			A3(
				NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
				_List_fromArray(
					['Text', 'attrs']),
				author$project$DocumentDecoder$decodeDocAttributes,
				elm$json$Json$Decode$succeed(author$project$Document$Text))),
			A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
			_List_fromArray(
				['Link', 'linkMeta']),
			author$project$DocumentDecoder$decodeLinkMeta,
			A3(
				NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
				_List_fromArray(
					['Link', 'attrs']),
				author$project$DocumentDecoder$decodeDocAttributes,
				elm$json$Json$Decode$succeed(author$project$Document$Link)))
		]));
var author$project$DocumentDecoder$decodeTextBlockElement = elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
			_List_fromArray(
				['Paragraph', 'prims']),
			elm$json$Json$Decode$list(author$project$DocumentDecoder$decodeTextBlockPrimitive),
			A3(
				NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
				_List_fromArray(
					['Paragraph', 'attrs']),
				author$project$DocumentDecoder$decodeDocAttributes,
				elm$json$Json$Decode$succeed(author$project$Document$Paragraph))),
			A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
			_List_fromArray(
				['UList', 'liList']),
			elm$json$Json$Decode$list(
				A2(
					elm$json$Json$Decode$field,
					'li',
					elm$json$Json$Decode$list(author$project$DocumentDecoder$decodeTextBlockPrimitive))),
			A3(
				NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
				_List_fromArray(
					['UList', 'attrs']),
				author$project$DocumentDecoder$decodeDocAttributes,
				elm$json$Json$Decode$succeed(author$project$Document$UList))),
			A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'Heading',
			A3(
				NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'value',
				elm$json$Json$Decode$string,
				A3(
					NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'level',
					elm$json$Json$Decode$int,
					A3(
						NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'attrs',
						author$project$DocumentDecoder$decodeDocAttributes,
						elm$json$Json$Decode$succeed(
							F3(
								function (a, l, v) {
									return {p: a, dy: l, ef: v};
								}))))),
			elm$json$Json$Decode$succeed(
				function (res) {
					return A2(
						author$project$Document$Heading,
						res.p,
						_Utils_Tuple2(res.dy, res.ef));
				})),
			A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'TBPrimitive',
			author$project$DocumentDecoder$decodeTextBlockPrimitive,
			elm$json$Json$Decode$succeed(author$project$Document$TBPrimitive))
		]));
var author$project$Document$VideoMeta = F9(
	function (src, size, frameBorder, suggestions, controls, privacy, title, startAt, hosting) {
		return {ff: controls, fE: frameBorder, fN: hosting, gF: privacy, d7: size, d9: src, g2: startAt, hc: suggestions, hz: title};
	});
var author$project$Document$Youtube = 0;
var author$project$DocumentDecoder$decodeVideoHost = A2(
	elm$json$Json$Decode$andThen,
	function (str) {
		if (str === 'Youtube') {
			return elm$json$Json$Decode$succeed(0);
		} else {
			var somethingElse = str;
			return elm$json$Json$Decode$fail('Unknown VideoHost: ' + somethingElse);
		}
	},
	elm$json$Json$Decode$string);
var author$project$DocumentDecoder$decodeVideoSize = A3(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'videoHeight',
	elm$json$Json$Decode$int,
	A3(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'videoWidth',
		elm$json$Json$Decode$int,
		elm$json$Json$Decode$succeed(author$project$Document$VideoSize)));
var author$project$DocumentDecoder$decodeVideoMeta = A3(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'hosting',
	author$project$DocumentDecoder$decodeVideoHost,
	A3(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'startAt',
		elm$json$Json$Decode$nullable(elm$json$Json$Decode$int),
		A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'title',
			elm$json$Json$Decode$bool,
			A3(
				NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'privacy',
				elm$json$Json$Decode$bool,
				A3(
					NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'controls',
					elm$json$Json$Decode$bool,
					A3(
						NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'suggestions',
						elm$json$Json$Decode$bool,
						A3(
							NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'frameBorder',
							elm$json$Json$Decode$bool,
							A3(
								NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
								'size',
								author$project$DocumentDecoder$decodeVideoSize,
								A3(
									NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
									'src',
									elm$json$Json$Decode$string,
									elm$json$Json$Decode$succeed(author$project$Document$VideoMeta))))))))));
var author$project$DocumentDecoder$decodeCellContent = elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'Image',
			author$project$DocumentDecoder$decodeImageMeta,
			elm$json$Json$Decode$succeed(author$project$Document$Image)),
			A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'Video',
			author$project$DocumentDecoder$decodeVideoMeta,
			elm$json$Json$Decode$succeed(author$project$Document$Video)),
			A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'Table',
			author$project$DocumentDecoder$decodeTableMeta,
			elm$json$Json$Decode$succeed(author$project$Document$Table)),
			A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'CustomElement',
			elm$json$Json$Decode$string,
			elm$json$Json$Decode$succeed(author$project$Document$CustomElement)),
			A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'TextBlock',
			elm$json$Json$Decode$list(author$project$DocumentDecoder$decodeTextBlockElement),
			elm$json$Json$Decode$succeed(author$project$Document$TextBlock)),
			A2(
			elm$json$Json$Decode$andThen,
			function (str) {
				if (str === 'EmptyCell') {
					return elm$json$Json$Decode$succeed(author$project$Document$EmptyCell);
				} else {
					var somethingElse = str;
					return elm$json$Json$Decode$fail('Unknown CellContent: ' + somethingElse);
				}
			},
			elm$json$Json$Decode$string)
		]));
var author$project$Document$Id = F4(
	function (uid, docStyleId, htmlId, classes) {
		return {aj: classes, al: docStyleId, ao: htmlId, bc: uid};
	});
var elm$core$Set$Set_elm_builtin = elm$core$Basics$identity;
var elm$core$Set$empty = elm$core$Dict$empty;
var elm$core$Set$insert = F2(
	function (key, _n0) {
		var dict = _n0;
		return A3(elm$core$Dict$insert, key, 0, dict);
	});
var elm$core$Set$fromList = function (list) {
	return A3(elm$core$List$foldl, elm$core$Set$insert, elm$core$Set$empty, list);
};
var author$project$DocumentDecoder$decodeId = A3(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'classes',
	A2(
		elm$json$Json$Decode$map,
		elm$core$Set$fromList,
		elm$json$Json$Decode$list(elm$json$Json$Decode$string)),
	A3(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'htmlId',
		elm$json$Json$Decode$nullable(elm$json$Json$Decode$string),
		A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'docStyleId',
			elm$json$Json$Decode$nullable(elm$json$Json$Decode$string),
			A3(
				NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'uid',
				elm$json$Json$Decode$int,
				elm$json$Json$Decode$succeed(author$project$Document$Id)))));
var author$project$DocumentDecoder$decodeCellValue = A3(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'attrs',
	author$project$DocumentDecoder$decodeDocAttributes,
	A3(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'id',
		author$project$DocumentDecoder$decodeId,
		A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'cellContent',
			author$project$DocumentDecoder$decodeCellContent,
			elm$json$Json$Decode$succeed(author$project$Document$CellValue))));
var author$project$Document$ContainerValue = F3(
	function (containerLabel, id, attrs) {
		return {p: attrs, ak: containerLabel, c: id};
	});
var author$project$Document$DocColumn = 0;
var author$project$Document$DocRow = 1;
var author$project$Document$ResponsiveBloc = 3;
var author$project$Document$TextColumn = 2;
var author$project$DocumentDecoder$decodeContainerLabel = A2(
	elm$json$Json$Decode$andThen,
	function (str) {
		switch (str) {
			case 'DocColumn':
				return elm$json$Json$Decode$succeed(0);
			case 'DocRow':
				return elm$json$Json$Decode$succeed(1);
			case 'TextColumn':
				return elm$json$Json$Decode$succeed(2);
			case 'ResponsiveBloc':
				return elm$json$Json$Decode$succeed(3);
			default:
				var somethingElse = str;
				return elm$json$Json$Decode$fail('Unknown ContainerLabel: ' + somethingElse);
		}
	},
	elm$json$Json$Decode$string);
var author$project$DocumentDecoder$decodeContainerValue = A3(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'attrs',
	author$project$DocumentDecoder$decodeDocAttributes,
	A3(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'id',
		author$project$DocumentDecoder$decodeId,
		A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'containerLabel',
			author$project$DocumentDecoder$decodeContainerLabel,
			elm$json$Json$Decode$succeed(author$project$Document$ContainerValue))));
var elm$json$Json$Decode$lazy = function (thunk) {
	return A2(
		elm$json$Json$Decode$andThen,
		thunk,
		elm$json$Json$Decode$succeed(0));
};
function author$project$DocumentDecoder$cyclic$decodeDocument() {
	return elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A3(
				NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
				_List_fromArray(
					['Container', 'children']),
				elm$json$Json$Decode$list(
					elm$json$Json$Decode$lazy(
						function (_n0) {
							return author$project$DocumentDecoder$cyclic$decodeDocument();
						})),
				A3(
					NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
					_List_fromArray(
						['Container', 'ContainerValue']),
					author$project$DocumentDecoder$decodeContainerValue,
					elm$json$Json$Decode$succeed(author$project$Document$Container))),
				A3(
				NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'Cell',
				author$project$DocumentDecoder$decodeCellValue,
				elm$json$Json$Decode$succeed(author$project$Document$Cell))
			]));
}
var author$project$DocumentDecoder$decodeDocument = author$project$DocumentDecoder$cyclic$decodeDocument();
author$project$DocumentDecoder$cyclic$decodeDocument = function () {
	return author$project$DocumentDecoder$decodeDocument;
};
var author$project$DocumentEditorHelpers$ContainerEditPlugin = 6;
var author$project$DocumentEditorHelpers$FilesysDebug = 8;
var author$project$DocumentEditorHelpers$PersistencePlugin = 7;
var author$project$DocumentEditorHelpers$newCell = F2(
	function (nextUid, cellContent) {
		return author$project$Document$Cell(
			{
				p: _List_Nil,
				aa: cellContent,
				c: {
					aj: elm$core$Set$empty,
					al: elm$core$Maybe$Nothing,
					ao: elm$core$Maybe$Just(
						'defaultHtmlId' + elm$core$String$fromInt(nextUid)),
					bc: nextUid
				}
			});
	});
var author$project$DocumentEditorHelpers$emptyCell = function (nextUid) {
	return A2(author$project$DocumentEditorHelpers$newCell, nextUid, author$project$Document$EmptyCell);
};
var author$project$DocumentEditorHelpers$newContainer = F2(
	function (nextUid, containerLabel) {
		return A2(
			author$project$Document$Container,
			{
				p: _List_Nil,
				ak: containerLabel,
				c: {
					aj: elm$core$Set$empty,
					al: elm$core$Maybe$Nothing,
					ao: elm$core$Maybe$Just(
						'defaultHtmlId' + elm$core$String$fromInt(nextUid)),
					bc: nextUid
				}
			},
			_List_fromArray(
				[
					author$project$DocumentEditorHelpers$emptyCell(nextUid + 1)
				]));
	});
var author$project$DocumentZipper$addNewInside = F2(
	function (nextUid, _n0) {
		var current = _n0.f;
		var contexts = _n0.e;
		if (!current.$) {
			var cv = current.a;
			var xs = current.b;
			return elm$core$Maybe$Just(
				{
					e: contexts,
					f: A2(
						author$project$Document$Container,
						cv,
						_Utils_ap(
							xs,
							_List_fromArray(
								[
									author$project$DocumentEditorHelpers$emptyCell(nextUid)
								])))
				});
		} else {
			return elm$core$Maybe$Nothing;
		}
	});
var author$project$DocumentZipper$zipLeft = function (_n0) {
	var current = _n0.f;
	var contexts = _n0.e;
	if (!contexts.b) {
		return elm$core$Maybe$Nothing;
	} else {
		var parent = contexts.a.y;
		var left = contexts.a.f5;
		var right = contexts.a.gK;
		var cs = contexts.b;
		var _n2 = elm$core$List$reverse(left);
		if (!_n2.b) {
			return elm$core$Maybe$Nothing;
		} else {
			var d = _n2.a;
			var ds = _n2.b;
			return elm$core$Maybe$Just(
				{
					e: A2(
						elm$core$List$cons,
						{
							f5: elm$core$List$reverse(ds),
							y: parent,
							gK: A2(elm$core$List$cons, current, right)
						},
						cs),
					f: d
				});
		}
	}
};
var author$project$DocumentZipper$addNewLeft = F2(
	function (nextUid, _n0) {
		var current = _n0.f;
		var contexts = _n0.e;
		if (!contexts.b) {
			return elm$core$Maybe$Nothing;
		} else {
			var parent = contexts.a.y;
			var left = contexts.a.f5;
			var right = contexts.a.gK;
			var cs = contexts.b;
			return author$project$DocumentZipper$zipLeft(
				{
					e: A2(
						elm$core$List$cons,
						{
							f5: _Utils_ap(
								left,
								_List_fromArray(
									[
										author$project$DocumentEditorHelpers$emptyCell(nextUid)
									])),
							y: parent,
							gK: right
						},
						cs),
					f: current
				});
		}
	});
var author$project$DocumentZipper$zipRight = function (_n0) {
	var current = _n0.f;
	var contexts = _n0.e;
	if (!contexts.b) {
		return elm$core$Maybe$Nothing;
	} else {
		var parent = contexts.a.y;
		var left = contexts.a.f5;
		var right = contexts.a.gK;
		var cs = contexts.b;
		if (!right.b) {
			return elm$core$Maybe$Nothing;
		} else {
			var d = right.a;
			var ds = right.b;
			return elm$core$Maybe$Just(
				{
					e: A2(
						elm$core$List$cons,
						{
							f5: _Utils_ap(
								left,
								_List_fromArray(
									[current])),
							y: parent,
							gK: ds
						},
						cs),
					f: d
				});
		}
	}
};
var author$project$DocumentZipper$addNewRight = F2(
	function (nextUid, _n0) {
		var current = _n0.f;
		var contexts = _n0.e;
		if (!contexts.b) {
			return elm$core$Maybe$Nothing;
		} else {
			var parent = contexts.a.y;
			var left = contexts.a.f5;
			var right = contexts.a.gK;
			var cs = contexts.b;
			return author$project$DocumentZipper$zipRight(
				{
					e: A2(
						elm$core$List$cons,
						{
							f5: left,
							y: parent,
							gK: A2(
								elm$core$List$cons,
								author$project$DocumentEditorHelpers$emptyCell(nextUid),
								right)
						},
						cs),
					f: current
				});
		}
	});
var author$project$DocumentZipper$extractDoc = function (_n0) {
	var current = _n0.f;
	var contexts = _n0.e;
	return current;
};
var author$project$DocumentZipper$zipUp = function (_n0) {
	var current = _n0.f;
	var contexts = _n0.e;
	if (!contexts.b) {
		return elm$core$Maybe$Nothing;
	} else {
		var parent = contexts.a.y;
		var left = contexts.a.f5;
		var right = contexts.a.gK;
		var cs = contexts.b;
		return elm$core$Maybe$Just(
			{
				e: cs,
				f: A2(
					author$project$Document$Container,
					parent,
					_Utils_ap(
						left,
						_Utils_ap(
							_List_fromArray(
								[current]),
							right)))
			});
	}
};
var author$project$DocumentZipper$rewind = function (docZipper) {
	rewind:
	while (true) {
		var _n0 = author$project$DocumentZipper$zipUp(docZipper);
		if (_n0.$ === 1) {
			return docZipper;
		} else {
			var docZipper_ = _n0.a;
			var $temp$docZipper = docZipper_;
			docZipper = $temp$docZipper;
			continue rewind;
		}
	}
};
var author$project$DocumentZipper$safeDeleteCurrent = F2(
	function (nextUid, _n0) {
		var current = _n0.f;
		var contexts = _n0.e;
		if (!contexts.b) {
			return elm$core$Maybe$Nothing;
		} else {
			var parent = contexts.a.y;
			var left = contexts.a.f5;
			var right = contexts.a.gK;
			var cs = contexts.b;
			return (_Utils_eq(left, _List_Nil) && _Utils_eq(right, _List_Nil)) ? elm$core$Maybe$Just(
				{
					e: cs,
					f: A2(
						author$project$Document$Container,
						parent,
						_List_fromArray(
							[
								author$project$DocumentEditorHelpers$emptyCell(nextUid)
							]))
				}) : elm$core$Maybe$Just(
				{
					e: cs,
					f: A2(
						author$project$Document$Container,
						parent,
						_Utils_ap(left, right))
				});
		}
	});
var author$project$DocumentZipper$swapLeft = function (_n0) {
	var current = _n0.f;
	var contexts = _n0.e;
	if (!contexts.b) {
		return elm$core$Maybe$Nothing;
	} else {
		var parent = contexts.a.y;
		var left = contexts.a.f5;
		var right = contexts.a.gK;
		var cs = contexts.b;
		var _n2 = elm$core$List$reverse(left);
		if (!_n2.b) {
			return elm$core$Maybe$Nothing;
		} else {
			var d = _n2.a;
			var ds = _n2.b;
			return elm$core$Maybe$Just(
				{
					e: A2(
						elm$core$List$cons,
						{
							f5: elm$core$List$reverse(ds),
							y: parent,
							gK: A2(elm$core$List$cons, d, right)
						},
						cs),
					f: current
				});
		}
	}
};
var author$project$DocumentZipper$swapRight = function (_n0) {
	var current = _n0.f;
	var contexts = _n0.e;
	if (!contexts.b) {
		return elm$core$Maybe$Nothing;
	} else {
		var parent = contexts.a.y;
		var left = contexts.a.f5;
		var right = contexts.a.gK;
		var cs = contexts.b;
		if (!right.b) {
			return elm$core$Maybe$Nothing;
		} else {
			var d = right.a;
			var ds = right.b;
			return elm$core$Maybe$Just(
				{
					e: A2(
						elm$core$List$cons,
						{
							f5: _Utils_ap(
								left,
								_List_fromArray(
									[d])),
							y: parent,
							gK: ds
						},
						cs),
					f: current
				});
		}
	}
};
var author$project$DocumentZipper$updateCurrent = F2(
	function (_new, _n0) {
		var current = _n0.f;
		var contexts = _n0.e;
		return {e: contexts, f: _new};
	});
var author$project$DocumentZipper$break = F2(
	function (p, xs) {
		var helper = F2(
			function (ys, left) {
				helper:
				while (true) {
					if (!ys.b) {
						return _Utils_Tuple2(left, _List_Nil);
					} else {
						var y = ys.a;
						var ys_ = ys.b;
						if (p(y)) {
							return _Utils_Tuple2(
								elm$core$List$reverse(left),
								A2(elm$core$List$cons, y, ys_));
						} else {
							var $temp$ys = ys_,
								$temp$left = A2(elm$core$List$cons, y, left);
							ys = $temp$ys;
							left = $temp$left;
							continue helper;
						}
					}
				}
			});
		return A2(helper, xs, _List_Nil);
	});
var author$project$DocumentZipper$zipDown = F2(
	function (p, _n0) {
		var current = _n0.f;
		var contexts = _n0.e;
		if (current.$ === 1) {
			return elm$core$Maybe$Nothing;
		} else {
			if (!current.b.b) {
				return elm$core$Maybe$Nothing;
			} else {
				var nv = current.a;
				var ds = current.b;
				var _n2 = A2(author$project$DocumentZipper$break, p, ds);
				var l = _n2.a;
				var r = _n2.b;
				if (!r.b) {
					return elm$core$Maybe$Nothing;
				} else {
					var d = r.a;
					var ds_ = r.b;
					return elm$core$Maybe$Just(
						{
							e: A2(
								elm$core$List$cons,
								{f5: l, y: nv, gK: ds_},
								contexts),
							f: d
						});
				}
			}
		}
	});
var author$project$Document$getUid = function (doc) {
	if (doc.$ === 1) {
		var cellContent = doc.a.aa;
		var id = doc.a.c;
		var attrs = doc.a.p;
		return id.bc;
	} else {
		var containerLabel = doc.a.ak;
		var id = doc.a.c;
		var attrs = doc.a.p;
		return id.bc;
	}
};
var elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return elm$core$Maybe$Just(x);
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var author$project$DocumentZipper$zipToUid = F2(
	function (uid, docZipper) {
		var helper = function (zipper) {
			var current = zipper.f;
			var contexts = zipper.e;
			if (_Utils_eq(
				author$project$Document$getUid(current),
				uid)) {
				return elm$core$Maybe$Just(zipper);
			} else {
				if (current.$ === 1) {
					return elm$core$Maybe$Nothing;
				} else {
					var children = current.b;
					var nextStep = function (child) {
						return A2(
							elm$core$Maybe$andThen,
							helper,
							A2(
								author$project$DocumentZipper$zipDown,
								function (d) {
									return _Utils_eq(
										author$project$Document$getUid(d),
										author$project$Document$getUid(child));
								},
								zipper));
					};
					return elm$core$List$head(
						A2(elm$core$List$filterMap, nextStep, children));
				}
			}
		};
		return helper(
			author$project$DocumentZipper$rewind(docZipper));
	});
var author$project$Editor$ListKeys = {$: 47};
var author$project$Editor$StorageFunnel = elm$core$Basics$identity;
var billstclair$elm_port_funnel$PortFunnel$StateAccessors = F2(
	function (get, set) {
		return {dk: get, d5: set};
	});
var author$project$Editor$storageAccessors = A2(
	billstclair$elm_port_funnel$PortFunnel$StateAccessors,
	function ($) {
		return $.ah;
	},
	F2(
		function (substate, state) {
			return _Utils_update(
				state,
				{ah: substate});
		}));
var author$project$Editor$storageHandler = F3(
	function (response, state, mdl) {
		var model = _Utils_update(
			mdl,
			{an: state});
		switch (response.$) {
			case 1:
				var key = response.a.f3;
				var value = response.a.ef;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ap: key, ad: value}),
					elm$core$Platform$Cmd$none);
			case 2:
				var keys = response.a.f4;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{by: keys}),
					elm$core$Platform$Cmd$none);
			default:
				return _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
		}
	});
var billstclair$elm_localstorage$PortFunnel$LocalStorage$commander = F2(
	function (_n0, _n1) {
		return elm$core$Platform$Cmd$none;
	});
var billstclair$elm_port_funnel$PortFunnel$FunnelSpec = F4(
	function (accessors, moduleDesc, commander, handler) {
		return {c0: accessors, c8: commander, dm: handler, dA: moduleDesc};
	});
var author$project$Editor$funnels = elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2(
			billstclair$elm_localstorage$PortFunnel$LocalStorage$moduleName,
			A4(billstclair$elm_port_funnel$PortFunnel$FunnelSpec, author$project$Editor$storageAccessors, billstclair$elm_localstorage$PortFunnel$LocalStorage$moduleDesc, billstclair$elm_localstorage$PortFunnel$LocalStorage$commander, author$project$Editor$storageHandler))
		]));
var author$project$Editor$openNewPlugin = function (model) {
	var _n0 = model.h;
	_n0$4:
	while (true) {
		if (!_n0.$) {
			switch (_n0.a) {
				case 2:
					var _n1 = _n0.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								aL: A2(author$project$TablePlugin$init, elm$core$Maybe$Nothing, author$project$Editor$TablePluginMsg)
							}),
						elm$core$Platform$Cmd$none);
				case 4:
					var _n2 = _n0.a;
					var _n3 = A3(author$project$TextBlockPlugin$init, _List_Nil, elm$core$Maybe$Nothing, author$project$Editor$TextBlockPluginMsg);
					var newTextBlockPlugin = _n3.a;
					var textBlockPluginCmds = _n3.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{aM: newTextBlockPlugin}),
						elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[textBlockPluginCmds])));
				case 0:
					var _n4 = _n0.a;
					var _n5 = A2(author$project$ImagePlugin$init, elm$core$Maybe$Nothing, author$project$Editor$ImagePluginMsg);
					var newImagePlugin = _n5.a;
					var imagePluginCmds = _n5.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{aA: newImagePlugin}),
						imagePluginCmds);
				case 1:
					var _n6 = _n0.a;
					var newVideoPlugin = A2(author$project$VideoPlugin$init, elm$core$Maybe$Nothing, author$project$Editor$VideoPluginMsg);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{aO: newVideoPlugin}),
						elm$core$Platform$Cmd$none);
				default:
					break _n0$4;
			}
		} else {
			break _n0$4;
		}
	}
	return _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
};
var author$project$DocumentEditorHelpers$ImagePlugin = 0;
var author$project$DocumentEditorHelpers$NewDocPlugin = 5;
var author$project$DocumentEditorHelpers$TablePlugin = 2;
var author$project$DocumentEditorHelpers$TextBlockPlugin = 4;
var author$project$DocumentEditorHelpers$VideoPlugin = 1;
var author$project$Editor$openPlugin = function (model) {
	var _n0 = author$project$DocumentZipper$extractDoc(model.a);
	if (_n0.$ === 1) {
		var cellContent = _n0.a.aa;
		var id = _n0.a.c;
		var attrs = _n0.a.p;
		switch (cellContent.$) {
			case 2:
				var tm = cellContent.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							h: elm$core$Maybe$Just(2),
							aL: A2(
								author$project$TablePlugin$init,
								elm$core$Maybe$Just(tm),
								author$project$Editor$TablePluginMsg)
						}),
					elm$core$Platform$Cmd$none);
			case 4:
				var tbElems = cellContent.a;
				var _n2 = A3(
					author$project$TextBlockPlugin$init,
					attrs,
					elm$core$Maybe$Just(tbElems),
					author$project$Editor$TextBlockPluginMsg);
				var newTextBlockPlugin = _n2.a;
				var textBlockPluginCmds = _n2.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							h: elm$core$Maybe$Just(4),
							aM: newTextBlockPlugin
						}),
					elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[textBlockPluginCmds])));
			case 5:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							h: elm$core$Maybe$Just(5)
						}),
					elm$core$Platform$Cmd$none);
			case 0:
				var imgMeta = cellContent.a;
				var _n3 = A2(
					author$project$ImagePlugin$init,
					elm$core$Maybe$Just(
						_Utils_Tuple2(imgMeta, attrs)),
					author$project$Editor$ImagePluginMsg);
				var newImagePlugin = _n3.a;
				var imagePluginCmds = _n3.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							h: elm$core$Maybe$Just(0),
							aA: newImagePlugin
						}),
					imagePluginCmds);
			case 1:
				var videoMeta = cellContent.a;
				var newVideoPlugin = A2(
					author$project$VideoPlugin$init,
					elm$core$Maybe$Just(
						_Utils_Tuple2(videoMeta, attrs)),
					author$project$Editor$VideoPluginMsg);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							h: elm$core$Maybe$Just(1),
							aO: newVideoPlugin
						}),
					elm$core$Platform$Cmd$none);
			default:
				return _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
		}
	} else {
		return _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
	}
};
var elm$browser$Browser$Dom$getElement = _Browser_getElement;
var elm$browser$Browser$Dom$setViewportOf = _Browser_setViewportOf;
var author$project$Editor$scrollTo = function (mbId) {
	if (mbId.$ === 1) {
		return elm$core$Platform$Cmd$none;
	} else {
		var destId = mbId.a;
		return A2(
			elm$core$Task$attempt,
			function (_n1) {
				return author$project$Editor$NoOp;
			},
			A2(
				elm$core$Task$andThen,
				function (mainContInfo) {
					return A2(
						elm$core$Task$andThen,
						function (el) {
							return A3(elm$browser$Browser$Dom$setViewportOf, 'documentContainer', 0, (el.dd.ek - mainContInfo.dd.ek) - 50);
						},
						elm$browser$Browser$Dom$getElement(destId));
				},
				elm$browser$Browser$Dom$getElement('defaultHtmlId0')));
	}
};
var author$project$Editor$undoCacheDepth = 4;
var author$project$Editor$CurrentViewportOf = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var author$project$Editor$updateSizes = function (_n0) {
	var sizesDict = _n0.g_;
	var cmd = F2(
		function (uid, id) {
			return A2(
				elm$core$Task$attempt,
				author$project$Editor$CurrentViewportOf(uid),
				elm$browser$Browser$Dom$getViewportOf(id));
		});
	return elm$core$Platform$Cmd$batch(
		A2(
			elm$core$List$map,
			function (uid) {
				return A2(
					cmd,
					uid,
					'sizeTracked' + elm$core$String$fromInt(uid));
			},
			elm$core$Dict$keys(sizesDict)));
};
var author$project$FilesysPlugin$Folder = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var author$project$FilesysPlugin$delete = function (_n0) {
	var current = _n0.f;
	var contexts = _n0.e;
	if (!contexts.b) {
		return elm$core$Maybe$Nothing;
	} else {
		var parent = contexts.a.y;
		var left = contexts.a.f5;
		var right = contexts.a.gK;
		var cs = contexts.b;
		return elm$core$Maybe$Just(
			{
				e: cs,
				f: A2(
					author$project$FilesysPlugin$Folder,
					parent,
					_Utils_ap(left, right))
			});
	}
};
var author$project$FilesysPlugin$extractFsItem = function (_n0) {
	var current = _n0.f;
	var contexts = _n0.e;
	return current;
};
var author$project$FilesysPlugin$getPath = function (fsItem) {
	if (!fsItem.$) {
		var path = fsItem.a.af;
		return path;
	} else {
		var path = fsItem.a.af;
		return path;
	}
};
var author$project$FilesysPlugin$initFileSys = function (fsItem) {
	return {e: _List_Nil, f: fsItem};
};
var author$project$FilesysPlugin$Meta = F2(
	function (path, name) {
		return {X: name, af: path};
	});
var author$project$FilesysPlugin$break = F2(
	function (p, xs) {
		var helper = F2(
			function (ys, left) {
				helper:
				while (true) {
					if (!ys.b) {
						return _Utils_Tuple2(left, _List_Nil);
					} else {
						var y = ys.a;
						var ys_ = ys.b;
						if (p(y)) {
							return _Utils_Tuple2(
								elm$core$List$reverse(left),
								A2(elm$core$List$cons, y, ys_));
						} else {
							var $temp$ys = ys_,
								$temp$left = A2(elm$core$List$cons, y, left);
							ys = $temp$ys;
							left = $temp$left;
							continue helper;
						}
					}
				}
			});
		return A2(helper, xs, _List_Nil);
	});
var author$project$FilesysPlugin$getName = function (fsItem) {
	if (!fsItem.$) {
		var name = fsItem.a.X;
		return name;
	} else {
		var name = fsItem.a.X;
		return name;
	}
};
var elm$core$Basics$neq = _Utils_notEqual;
var elm$core$List$tail = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return elm$core$Maybe$Just(xs);
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var author$project$FilesysPlugin$insert = F3(
	function (f, rootName, mbFsItem_) {
		var helper = F2(
			function (path, mbFsItem) {
				helper:
				while (true) {
					if (mbFsItem.$ === 1) {
						if (!path.b) {
							var $temp$path = path,
								$temp$mbFsItem = elm$core$Maybe$Just(
								A2(
									author$project$FilesysPlugin$Folder,
									A2(
										author$project$FilesysPlugin$Meta,
										_List_fromArray(
											[rootName]),
										rootName),
									_List_Nil));
							path = $temp$path;
							mbFsItem = $temp$mbFsItem;
							continue helper;
						} else {
							var root = path.a;
							if (!_Utils_eq(root, rootName)) {
								return elm$core$Maybe$Nothing;
							} else {
								var $temp$path = path,
									$temp$mbFsItem = elm$core$Maybe$Just(
									A2(
										author$project$FilesysPlugin$Folder,
										A2(
											author$project$FilesysPlugin$Meta,
											_List_fromArray(
												[rootName]),
											rootName),
										_List_Nil));
								path = $temp$path;
								mbFsItem = $temp$mbFsItem;
								continue helper;
							}
						}
					} else {
						if (!mbFsItem.a.$) {
							var _n2 = mbFsItem.a;
							var meta = _n2.a;
							var children = _n2.b;
							if (!path.b) {
								return elm$core$Maybe$Just(
									A2(author$project$FilesysPlugin$Folder, meta, children));
							} else {
								if (!path.b.b) {
									var curr = path.a;
									return (!_Utils_eq(curr, meta.X)) ? elm$core$Maybe$Nothing : (A2(elm$core$List$member, f, children) ? elm$core$Maybe$Just(
										A2(author$project$FilesysPlugin$Folder, meta, children)) : elm$core$Maybe$Just(
										A2(
											author$project$FilesysPlugin$Folder,
											meta,
											A2(elm$core$List$cons, f, children))));
								} else {
									var curr = path.a;
									var _n4 = path.b;
									var next = _n4.a;
									var rest = _n4.b;
									if (!_Utils_eq(curr, meta.X)) {
										return elm$core$Maybe$Nothing;
									} else {
										var _n5 = A2(
											author$project$FilesysPlugin$break,
											function (f_) {
												return _Utils_eq(
													author$project$FilesysPlugin$getName(f_),
													next);
											},
											children);
										var l = _n5.a;
										var r = _n5.b;
										if (!r.b) {
											var newFolder = A2(
												author$project$FilesysPlugin$Folder,
												{
													X: next,
													af: _Utils_ap(
														meta.af,
														_List_fromArray(
															[next]))
												},
												_List_Nil);
											return A2(
												elm$core$Maybe$andThen,
												function (nsbt) {
													return elm$core$Maybe$Just(
														A2(
															author$project$FilesysPlugin$Folder,
															meta,
															A2(elm$core$List$cons, nsbt, children)));
												},
												A2(
													helper,
													A2(elm$core$List$cons, next, rest),
													elm$core$Maybe$Just(newFolder)));
										} else {
											var next_ = r.a;
											var rest_ = r.b;
											return A2(
												elm$core$Maybe$andThen,
												function (nsbt) {
													return elm$core$Maybe$Just(
														A2(
															author$project$FilesysPlugin$Folder,
															meta,
															_Utils_ap(
																l,
																A2(elm$core$List$cons, nsbt, rest_))));
												},
												A2(
													helper,
													A2(elm$core$List$cons, next, rest),
													elm$core$Maybe$Just(next_)));
										}
									}
								}
							}
						} else {
							return elm$core$Maybe$Nothing;
						}
					}
				}
			});
		return A2(
			elm$core$Maybe$andThen,
			function (p) {
				return A2(helper, p, mbFsItem_);
			},
			A2(
				elm$core$Maybe$map,
				elm$core$List$reverse,
				elm$core$List$tail(
					elm$core$List$reverse(
						author$project$FilesysPlugin$getPath(f)))));
	});
var author$project$FilesysPlugin$zipUpFilesys = function (filesys) {
	var _n0 = filesys.e;
	if (!_n0.b) {
		return elm$core$Maybe$Nothing;
	} else {
		var parent = _n0.a.y;
		var left = _n0.a.f5;
		var right = _n0.a.gK;
		var cs = _n0.b;
		return elm$core$Maybe$Just(
			_Utils_update(
				filesys,
				{
					e: cs,
					f: A2(
						author$project$FilesysPlugin$Folder,
						parent,
						_Utils_ap(
							left,
							_Utils_ap(
								_List_fromArray(
									[filesys.f]),
								right)))
				}));
	}
};
var author$project$FilesysPlugin$rewindFilesys = function (filesys) {
	rewindFilesys:
	while (true) {
		var _n0 = author$project$FilesysPlugin$zipUpFilesys(filesys);
		if (_n0.$ === 1) {
			return filesys;
		} else {
			var filesys_ = _n0.a;
			var $temp$filesys = filesys_;
			filesys = $temp$filesys;
			continue rewindFilesys;
		}
	}
};
var author$project$FilesysPlugin$selectedFilename = function (_n0) {
	var mbFilesys = _n0.n;
	return A2(
		elm$core$Maybe$andThen,
		A2(elm$core$Basics$composeL, elm$core$Maybe$Just, author$project$FilesysPlugin$extractFsItem),
		mbFilesys);
};
var author$project$FilesysPlugin$zipDownFilesys = F2(
	function (p, filesys) {
		var _n0 = filesys.f;
		if (_n0.$ === 1) {
			return elm$core$Maybe$Nothing;
		} else {
			if (!_n0.b.b) {
				return elm$core$Maybe$Nothing;
			} else {
				var meta = _n0.a;
				var cs = _n0.b;
				var _n1 = A2(author$project$FilesysPlugin$break, p, cs);
				var l = _n1.a;
				var r = _n1.b;
				if (!r.b) {
					return elm$core$Maybe$Nothing;
				} else {
					var f = r.a;
					var fs = r.b;
					return elm$core$Maybe$Just(
						_Utils_update(
							filesys,
							{
								e: A2(
									elm$core$List$cons,
									{f5: l, y: meta, gK: fs},
									filesys.e),
								f: f
							}));
				}
			}
		}
	});
var author$project$FilesysPlugin$zipToFsItem = F2(
	function (path, filesys) {
		var helper = F2(
			function (remainingPath, filesys_) {
				if (!remainingPath.b) {
					return elm$core$Maybe$Nothing;
				} else {
					if (!remainingPath.b.b) {
						var curr = remainingPath.a;
						return (!_Utils_eq(
							author$project$FilesysPlugin$getName(
								author$project$FilesysPlugin$extractFsItem(filesys_)),
							curr)) ? elm$core$Maybe$Nothing : elm$core$Maybe$Just(filesys_);
					} else {
						var curr = remainingPath.a;
						var _n1 = remainingPath.b;
						var next = _n1.a;
						var rest = _n1.b;
						return (!_Utils_eq(
							author$project$FilesysPlugin$getName(
								author$project$FilesysPlugin$extractFsItem(filesys_)),
							curr)) ? elm$core$Maybe$Nothing : A2(
							elm$core$Maybe$andThen,
							helper(
								A2(elm$core$List$cons, next, rest)),
							A2(
								author$project$FilesysPlugin$zipDownFilesys,
								function (fsItem) {
									return _Utils_eq(
										author$project$FilesysPlugin$getName(fsItem),
										next);
								},
								filesys_));
					}
				}
			});
		return A2(helper, path, filesys);
	});
var author$project$FilesysPlugin$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				return _Utils_Tuple3(
					_Utils_update(
						model,
						{
							U: A2(
								elm$core$Maybe$withDefault,
								_List_Nil,
								A2(
									elm$core$Maybe$map,
									author$project$FilesysPlugin$getPath,
									A2(elm$core$Maybe$map, author$project$FilesysPlugin$extractFsItem, model.n))),
							n: function () {
								var newFilesys = A2(elm$core$Maybe$map, author$project$FilesysPlugin$rewindFilesys, model.n);
								if (newFilesys.$ === 1) {
									return model.n;
								} else {
									var otherwise = newFilesys;
									return otherwise;
								}
							}()
						}),
					elm$core$Platform$Cmd$none,
					elm$core$Maybe$Nothing);
			case 1:
				var _n2 = model.U;
				if (!_n2.b) {
					return _Utils_Tuple3(model, elm$core$Platform$Cmd$none, elm$core$Maybe$Nothing);
				} else {
					var path = _n2;
					return _Utils_Tuple3(
						_Utils_update(
							model,
							{
								U: _List_Nil,
								n: A2(
									elm$core$Maybe$withDefault,
									model.n,
									A2(
										elm$core$Maybe$map,
										author$project$FilesysPlugin$zipToFsItem(path),
										A2(elm$core$Maybe$map, author$project$FilesysPlugin$rewindFilesys, model.n)))
							}),
						elm$core$Platform$Cmd$none,
						author$project$FilesysPlugin$selectedFilename(model));
				}
			case 2:
				return _Utils_Tuple3(
					_Utils_update(
						model,
						{
							U: A2(
								elm$core$Maybe$withDefault,
								_List_Nil,
								A2(
									elm$core$Maybe$map,
									author$project$FilesysPlugin$getPath,
									A2(elm$core$Maybe$map, author$project$FilesysPlugin$extractFsItem, model.n))),
							n: function () {
								var _n3 = A2(elm$core$Maybe$andThen, author$project$FilesysPlugin$zipUpFilesys, model.n);
								if (_n3.$ === 1) {
									return model.n;
								} else {
									var otherwise = _n3;
									return otherwise;
								}
							}()
						}),
					elm$core$Platform$Cmd$none,
					author$project$FilesysPlugin$selectedFilename(model));
			case 4:
				var path = msg.a;
				return _Utils_Tuple3(
					_Utils_update(
						model,
						{cj: path}),
					elm$core$Platform$Cmd$none,
					elm$core$Maybe$Nothing);
			case 3:
				var path = msg.a;
				return _Utils_Tuple3(
					_Utils_update(
						model,
						{
							U: A2(
								elm$core$Maybe$withDefault,
								_List_Nil,
								A2(
									elm$core$Maybe$map,
									author$project$FilesysPlugin$getPath,
									A2(elm$core$Maybe$map, author$project$FilesysPlugin$extractFsItem, model.n))),
							n: A2(
								elm$core$Maybe$withDefault,
								model.n,
								A2(
									elm$core$Maybe$map,
									author$project$FilesysPlugin$zipToFsItem(path),
									A2(elm$core$Maybe$map, author$project$FilesysPlugin$rewindFilesys, model.n)))
						}),
					elm$core$Platform$Cmd$none,
					author$project$FilesysPlugin$selectedFilename(model));
			case 5:
				return _Utils_Tuple3(model, elm$core$Platform$Cmd$none, elm$core$Maybe$Nothing);
			case 6:
				return _Utils_Tuple3(model, elm$core$Platform$Cmd$none, elm$core$Maybe$Nothing);
			case 7:
				return _Utils_Tuple3(
					_Utils_update(
						model,
						{
							U: _List_Nil,
							n: A2(
								elm$core$Maybe$withDefault,
								model.n,
								A2(elm$core$Maybe$map, author$project$FilesysPlugin$delete, model.n))
						}),
					elm$core$Platform$Cmd$none,
					author$project$FilesysPlugin$selectedFilename(model));
			case 8:
				var newName = msg.a;
				return _Utils_Tuple3(model, elm$core$Platform$Cmd$none, elm$core$Maybe$Nothing);
			default:
				var root = msg.a;
				var res = msg.b;
				if (!res.$) {
					var fs = res.a;
					return _Utils_Tuple3(
						_Utils_update(
							model,
							{
								U: _List_Nil,
								n: function () {
									if (!root) {
										return A2(
											elm$core$Maybe$map,
											author$project$FilesysPlugin$initFileSys,
											A3(
												elm$core$List$foldr,
												F2(
													function (f, acc) {
														return A3(author$project$FilesysPlugin$insert, f, 'images', acc);
													}),
												elm$core$Maybe$Nothing,
												fs));
									} else {
										return A2(
											elm$core$Maybe$map,
											author$project$FilesysPlugin$initFileSys,
											A3(
												elm$core$List$foldr,
												F2(
													function (f, acc) {
														return A3(author$project$FilesysPlugin$insert, f, 'Base Documentaire', acc);
													}),
												elm$core$Maybe$Nothing,
												fs));
									}
								}()
							}),
						elm$core$Platform$Cmd$none,
						elm$core$Maybe$Nothing);
				} else {
					var e = res.a;
					return _Utils_Tuple3(
						_Utils_update(
							model,
							{cy: 'can\'t refresh'}),
						elm$core$Platform$Cmd$none,
						elm$core$Maybe$Nothing);
				}
		}
	});
var author$project$DocumentEditorHelpers$PluginData = function (a) {
	return {$: 1, a: a};
};
var author$project$DocumentEditorHelpers$PluginQuit = {$: 0};
var author$project$DocumentEditorHelpers$setAligment = F2(
	function (a, attrs) {
		var removeOldAlignment = F2(
			function (acc, xs) {
				removeOldAlignment:
				while (true) {
					if (!xs.b) {
						return elm$core$List$reverse(acc);
					} else {
						switch (xs.a.$) {
							case 2:
								var _n1 = xs.a;
								var xs_ = xs.b;
								var $temp$acc = acc,
									$temp$xs = xs_;
								acc = $temp$acc;
								xs = $temp$xs;
								continue removeOldAlignment;
							case 3:
								var _n2 = xs.a;
								var xs_ = xs.b;
								var $temp$acc = acc,
									$temp$xs = xs_;
								acc = $temp$acc;
								xs = $temp$xs;
								continue removeOldAlignment;
							default:
								var y = xs.a;
								var ys = xs.b;
								var $temp$acc = A2(elm$core$List$cons, y, acc),
									$temp$xs = ys;
								acc = $temp$acc;
								xs = $temp$xs;
								continue removeOldAlignment;
						}
					}
				}
			});
		var newAlignment = function () {
			switch (a) {
				case 1:
					return _List_Nil;
				case 0:
					return _List_fromArray(
						[author$project$Document$AlignRight]);
				default:
					return _List_fromArray(
						[author$project$Document$AlignLeft]);
			}
		}();
		return _Utils_ap(
			newAlignment,
			A2(removeOldAlignment, _List_Nil, attrs));
	});
var author$project$ImagePlugin$Editor = 1;
var author$project$ImagePlugin$FileReader = 0;
var author$project$ImagePlugin$ImageController = function (a) {
	return {$: 2, a: a};
};
var elm$core$Basics$modBy = _Basics_modBy;
var author$project$ImagePlugin$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var alignment = msg.a;
				return _Utils_Tuple3(
					_Utils_update(
						model,
						{aP: alignment}),
					elm$core$Platform$Cmd$none,
					elm$core$Maybe$Nothing);
			case 1:
				var caption = msg.a;
				return _Utils_Tuple3(
					_Utils_update(
						model,
						{
							a_: elm$core$Maybe$Just(caption)
						}),
					elm$core$Platform$Cmd$none,
					elm$core$Maybe$Nothing);
			case 2:
				var data = msg.a;
				return _Utils_Tuple3(
					_Utils_update(
						model,
						{
							ba: elm$core$Maybe$Just(data)
						}),
					elm$core$Platform$Cmd$none,
					elm$core$Maybe$Nothing);
			case 3:
				var _n1 = model.ba;
				if (_n1.$ === 1) {
					return _Utils_Tuple3(model, elm$core$Platform$Cmd$none, elm$core$Maybe$Nothing);
				} else {
					var _n2 = _n1.a;
					var url = _n2.a;
					var _n3 = _n2.b;
					var width = _n3.a;
					var height = _n3.b;
					var newImageMeta = {
						eV: model.a_,
						d7: {fU: height, fV: width},
						d9: author$project$Document$UrlSrc('images/' + url)
					};
					return _Utils_Tuple3(
						_Utils_update(
							model,
							{
								aC: elm$core$Maybe$Just(newImageMeta),
								ar: author$project$ImagePlugin$ImageAttributeEditor
							}),
						elm$core$Platform$Cmd$none,
						elm$core$Maybe$Nothing);
				}
			case 4:
				var data = msg.a;
				var newImage = {aT: data.aT, ay: data.ay, aV: data.aV, fL: data.fL, hL: data.hL};
				return _Utils_Tuple3(
					_Utils_update(
						model,
						{
							aq: elm$core$Maybe$Just(newImage),
							bh: elm$core$Maybe$Just(data.aV),
							V: elm$core$Maybe$Just(data.fL),
							W: elm$core$Maybe$Just(data.hL),
							ar: author$project$ImagePlugin$ImageController(1),
							aE: false
						}),
					elm$core$Platform$Cmd$none,
					elm$core$Maybe$Nothing);
			case 5:
				var data = msg.a;
				var newImage = {aT: data.aT, ay: data.ay, aV: data.aV, fL: data.fL, hL: data.hL};
				return _Utils_Tuple3(
					_Utils_update(
						model,
						{
							av: false,
							aq: elm$core$Maybe$Just(newImage),
							ar: author$project$ImagePlugin$ImageController(1),
							aE: false,
							aF: false
						}),
					elm$core$Platform$Cmd$none,
					elm$core$Maybe$Nothing);
			case 6:
				if (!msg.a.$) {
					return _Utils_Tuple3(model, elm$core$Platform$Cmd$none, elm$core$Maybe$Nothing);
				} else {
					var e = msg.a.a;
					return _Utils_Tuple3(model, elm$core$Platform$Cmd$none, elm$core$Maybe$Nothing);
				}
			case 7:
				return _Utils_Tuple3(
					_Utils_update(
						model,
						{
							Q: model.S,
							R: A2(elm$core$Basics$modBy, 360, 90 + model.R),
							S: model.Q,
							V: model.W,
							W: model.V,
							aF: true
						}),
					elm$core$Platform$Cmd$none,
					elm$core$Maybe$Nothing);
			case 8:
				return _Utils_Tuple3(
					_Utils_update(
						model,
						{
							Q: model.S,
							R: A2(elm$core$Basics$modBy, 360, model.R - 90),
							S: model.Q,
							V: model.W,
							W: model.V,
							aF: true
						}),
					elm$core$Platform$Cmd$none,
					elm$core$Maybe$Nothing);
			case 9:
				var n = msg.a;
				var _n4 = _Utils_Tuple2(model.W, model.V);
				if ((!_n4.a.$) && (!_n4.b.$)) {
					var oriW = _n4.a.a;
					var oriH = _n4.b.a;
					var ratio = oriW / oriH;
					var desiredWidth = (oriW * n) / 100;
					var desiredHeight = desiredWidth / ratio;
					return _Utils_Tuple3(
						_Utils_update(
							model,
							{
								av: true,
								Q: elm$core$Maybe$Just(
									elm$core$Basics$round(desiredHeight)),
								S: elm$core$Maybe$Just(
									elm$core$Basics$round(desiredWidth)),
								bo: n
							}),
						elm$core$Platform$Cmd$none,
						elm$core$Maybe$Nothing);
				} else {
					return _Utils_Tuple3(model, elm$core$Platform$Cmd$none, elm$core$Maybe$Nothing);
				}
			case 10:
				return _Utils_Tuple3(
					_Utils_update(
						model,
						{aE: true}),
					elm$core$Platform$Cmd$none,
					elm$core$Maybe$Nothing);
			case 11:
				var filename = msg.a;
				return _Utils_Tuple3(
					_Utils_update(
						model,
						{
							b_: elm$core$Maybe$Just(filename)
						}),
					elm$core$Platform$Cmd$none,
					elm$core$Maybe$Nothing);
			case 12:
				return _Utils_Tuple3(
					_Utils_update(
						model,
						{
							av: false,
							Q: elm$core$Maybe$Nothing,
							R: 0,
							S: elm$core$Maybe$Nothing,
							aq: elm$core$Maybe$Nothing,
							bh: elm$core$Maybe$Nothing,
							V: elm$core$Maybe$Nothing,
							W: elm$core$Maybe$Nothing,
							ar: author$project$ImagePlugin$ImageController(0),
							aE: false,
							aF: false,
							bo: 100
						}),
					elm$core$Platform$Cmd$none,
					elm$core$Maybe$Nothing);
			case 13:
				var _n5 = model.aq;
				if (_n5.$ === 1) {
					return _Utils_Tuple3(model, elm$core$Platform$Cmd$none, elm$core$Maybe$Nothing);
				} else {
					var contents = _n5.a.aT;
					var filename = _n5.a.ay;
					var width = _n5.a.hL;
					var height = _n5.a.fL;
					var newImageMeta = {
						eV: model.a_,
						d7: {fU: height, fV: width},
						d9: A2(author$project$Document$Inline, filename, contents)
					};
					return _Utils_Tuple3(
						_Utils_update(
							model,
							{
								av: false,
								Q: elm$core$Maybe$Nothing,
								R: 0,
								S: elm$core$Maybe$Nothing,
								aq: elm$core$Maybe$Nothing,
								aC: elm$core$Maybe$Just(newImageMeta),
								bh: elm$core$Maybe$Nothing,
								V: elm$core$Maybe$Nothing,
								W: elm$core$Maybe$Nothing,
								ar: author$project$ImagePlugin$ImageAttributeEditor,
								aE: false,
								aF: false,
								bo: 100
							}),
						elm$core$Platform$Cmd$none,
						elm$core$Maybe$Nothing);
				}
			case 14:
				var mode = msg.a;
				return _Utils_Tuple3(
					_Utils_update(
						model,
						{ar: mode}),
					elm$core$Platform$Cmd$none,
					elm$core$Maybe$Nothing);
			case 15:
				var _n6 = model.aC;
				if (_n6.$ === 1) {
					return _Utils_Tuple3(model, elm$core$Platform$Cmd$none, elm$core$Maybe$Nothing);
				} else {
					var imageMeta = _n6.a;
					return _Utils_Tuple3(
						model,
						elm$core$Platform$Cmd$none,
						elm$core$Maybe$Just(
							author$project$DocumentEditorHelpers$PluginData(
								_Utils_Tuple2(
									imageMeta,
									A2(author$project$DocumentEditorHelpers$setAligment, model.aP, model.cJ)))));
				}
			case 16:
				return _Utils_Tuple3(
					model,
					elm$core$Platform$Cmd$none,
					elm$core$Maybe$Just(author$project$DocumentEditorHelpers$PluginQuit));
			default:
				return _Utils_Tuple3(model, elm$core$Platform$Cmd$none, elm$core$Maybe$Nothing);
		}
	});
var mdgriffith$elm_ui$Internal$Flag$borderColor = mdgriffith$elm_ui$Internal$Flag$flag(28);
var mdgriffith$elm_ui$Element$Border$color = function (clr) {
	return A2(
		mdgriffith$elm_ui$Internal$Model$StyleClass,
		mdgriffith$elm_ui$Internal$Flag$borderColor,
		A3(
			mdgriffith$elm_ui$Internal$Model$Colored,
			'bc-' + mdgriffith$elm_ui$Internal$Model$formatColorClass(clr),
			'border-color',
			clr));
};
var mdgriffith$elm_ui$Internal$Flag$borderWidth = mdgriffith$elm_ui$Internal$Flag$flag(27);
var mdgriffith$elm_ui$Internal$Model$BorderWidth = F5(
	function (a, b, c, d, e) {
		return {$: 6, a: a, b: b, c: c, d: d, e: e};
	});
var mdgriffith$elm_ui$Element$Border$width = function (v) {
	return A2(
		mdgriffith$elm_ui$Internal$Model$StyleClass,
		mdgriffith$elm_ui$Internal$Flag$borderWidth,
		A5(
			mdgriffith$elm_ui$Internal$Model$BorderWidth,
			'b-' + elm$core$String$fromInt(v),
			v,
			v,
			v,
			v));
};
var mdgriffith$elm_ui$Element$Border$widthXY = F2(
	function (x, y) {
		return A2(
			mdgriffith$elm_ui$Internal$Model$StyleClass,
			mdgriffith$elm_ui$Internal$Flag$borderWidth,
			A5(
				mdgriffith$elm_ui$Internal$Model$BorderWidth,
				'b-' + (elm$core$String$fromInt(x) + ('-' + elm$core$String$fromInt(y))),
				y,
				x,
				y,
				x));
	});
var mdgriffith$elm_ui$Element$Border$widthEach = function (_n0) {
	var bottom = _n0.eO;
	var top = _n0.hA;
	var left = _n0.f5;
	var right = _n0.gK;
	return (_Utils_eq(top, bottom) && _Utils_eq(left, right)) ? (_Utils_eq(top, right) ? mdgriffith$elm_ui$Element$Border$width(top) : A2(mdgriffith$elm_ui$Element$Border$widthXY, left, top)) : A2(
		mdgriffith$elm_ui$Internal$Model$StyleClass,
		mdgriffith$elm_ui$Internal$Flag$borderWidth,
		A5(
			mdgriffith$elm_ui$Internal$Model$BorderWidth,
			'b-' + (elm$core$String$fromInt(top) + ('-' + (elm$core$String$fromInt(right) + ('-' + (elm$core$String$fromInt(bottom) + ('-' + elm$core$String$fromInt(left))))))),
			top,
			right,
			bottom,
			left));
};
var author$project$StyleSheets$tableStyles = elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2(
			'default',
			{
				eX: function (ri) {
					return _List_fromArray(
						[
							mdgriffith$elm_ui$Element$Border$widthEach(
							{eO: 1, f5: 0, gK: 1, hA: 0}),
							mdgriffith$elm_ui$Element$Background$color(
							(!A2(elm$core$Basics$modBy, 2, ri)) ? A3(mdgriffith$elm_ui$Element$rgb, 0.8, 0.8, 0.8) : A3(mdgriffith$elm_ui$Element$rgb, 1, 1, 1)),
							mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill)
						]);
				},
				fa: _List_Nil,
				hd: _List_fromArray(
					[
						mdgriffith$elm_ui$Element$Border$widthEach(
						{eO: 0, f5: 1, gK: 0, hA: 1})
					])
			}),
			_Utils_Tuple2(
			'souligné',
			{
				eX: function (ri) {
					return _List_fromArray(
						[
							mdgriffith$elm_ui$Element$Border$widthEach(
							{eO: 1, f5: 0, gK: 0, hA: 0}),
							mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill)
						]);
				},
				fa: _List_fromArray(
					[
						A2(mdgriffith$elm_ui$Element$paddingXY, 1, 0)
					]),
				hd: _List_Nil
			}),
			_Utils_Tuple2(
			'gris-vert',
			{
				eX: function (ri) {
					return _List_fromArray(
						[
							mdgriffith$elm_ui$Element$Border$widthEach(
							{eO: 1, f5: 0, gK: 0, hA: 0}),
							mdgriffith$elm_ui$Element$Border$color(
							A4(mdgriffith$elm_ui$Element$rgba, 0.5, 0.5, 0.5, 1)),
							mdgriffith$elm_ui$Element$Background$color(
							(!A2(elm$core$Basics$modBy, 2, ri)) ? A3(mdgriffith$elm_ui$Element$rgb, 0.83, 0.83, 0.83) : A3(mdgriffith$elm_ui$Element$rgb, 0.58, 0.93, 0.58)),
							mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill)
						]);
				},
				fa: _List_fromArray(
					[
						A2(mdgriffith$elm_ui$Element$paddingXY, 1, 1)
					]),
				hd: _List_Nil
			}),
			_Utils_Tuple2(
			'bleu-blanc',
			{
				eX: function (ri) {
					return _List_fromArray(
						[
							mdgriffith$elm_ui$Element$Border$widthEach(
							{eO: 1, f5: 0, gK: 0, hA: 0}),
							mdgriffith$elm_ui$Element$Border$color(
							A3(mdgriffith$elm_ui$Element$rgb, 0.5, 0.5, 0.5)),
							mdgriffith$elm_ui$Element$Background$color(
							(!A2(elm$core$Basics$modBy, 2, ri)) ? A3(mdgriffith$elm_ui$Element$rgb, 0.53, 0.81, 0.92) : A3(mdgriffith$elm_ui$Element$rgb, 0.92, 0.92, 0.84)),
							mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill)
						]);
				},
				fa: _List_fromArray(
					[
						A2(mdgriffith$elm_ui$Element$paddingXY, 1, 1)
					]),
				hd: _List_fromArray(
					[
						mdgriffith$elm_ui$Element$Border$width(1)
					])
			})
		]));
var author$project$TablePlugin$DisplayOnly = 0;
var author$project$TablePlugin$makeDataGrid = F2(
	function (i, j) {
		return A2(
			elm$core$Array$initialize,
			i,
			elm$core$Basics$always(
				A2(
					elm$core$Array$initialize,
					j,
					elm$core$Basics$always(''))));
	});
var author$project$TablePlugin$maxCols = 30;
var author$project$TablePlugin$maxRows = 100;
var author$project$TablePlugin$toTableMeta = function (docTable) {
	return {
		fn: elm$core$Array$toList(docTable.fn),
		gi: docTable.gi,
		gj: docTable.gj,
		g7: docTable.E
	};
};
var elm$core$Elm$JsArray$appendN = _JsArray_appendN;
var elm$core$Elm$JsArray$slice = _JsArray_slice;
var elm$core$Array$appendHelpBuilder = F2(
	function (tail, builder) {
		var tailLen = elm$core$Elm$JsArray$length(tail);
		var notAppended = (elm$core$Array$branchFactor - elm$core$Elm$JsArray$length(builder.v)) - tailLen;
		var appended = A3(elm$core$Elm$JsArray$appendN, elm$core$Array$branchFactor, builder.v, tail);
		return (notAppended < 0) ? {
			x: A2(
				elm$core$List$cons,
				elm$core$Array$Leaf(appended),
				builder.x),
			t: builder.t + 1,
			v: A3(elm$core$Elm$JsArray$slice, notAppended, tailLen, tail)
		} : ((!notAppended) ? {
			x: A2(
				elm$core$List$cons,
				elm$core$Array$Leaf(appended),
				builder.x),
			t: builder.t + 1,
			v: elm$core$Elm$JsArray$empty
		} : {x: builder.x, t: builder.t, v: appended});
	});
var elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var elm$core$Array$bitMask = 4294967295 >>> (32 - elm$core$Array$shiftStep);
var elm$core$Basics$ge = _Utils_ge;
var elm$core$Bitwise$and = _Bitwise_and;
var elm$core$Elm$JsArray$push = _JsArray_push;
var elm$core$Elm$JsArray$singleton = _JsArray_singleton;
var elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var elm$core$Elm$JsArray$unsafeSet = _JsArray_unsafeSet;
var elm$core$Array$insertTailInTree = F4(
	function (shift, index, tail, tree) {
		var pos = elm$core$Array$bitMask & (index >>> shift);
		if (_Utils_cmp(
			pos,
			elm$core$Elm$JsArray$length(tree)) > -1) {
			if (shift === 5) {
				return A2(
					elm$core$Elm$JsArray$push,
					elm$core$Array$Leaf(tail),
					tree);
			} else {
				var newSub = elm$core$Array$SubTree(
					A4(elm$core$Array$insertTailInTree, shift - elm$core$Array$shiftStep, index, tail, elm$core$Elm$JsArray$empty));
				return A2(elm$core$Elm$JsArray$push, newSub, tree);
			}
		} else {
			var value = A2(elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!value.$) {
				var subTree = value.a;
				var newSub = elm$core$Array$SubTree(
					A4(elm$core$Array$insertTailInTree, shift - elm$core$Array$shiftStep, index, tail, subTree));
				return A3(elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			} else {
				var newSub = elm$core$Array$SubTree(
					A4(
						elm$core$Array$insertTailInTree,
						shift - elm$core$Array$shiftStep,
						index,
						tail,
						elm$core$Elm$JsArray$singleton(value)));
				return A3(elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			}
		}
	});
var elm$core$Array$unsafeReplaceTail = F2(
	function (newTail, _n0) {
		var len = _n0.a;
		var startShift = _n0.b;
		var tree = _n0.c;
		var tail = _n0.d;
		var originalTailLen = elm$core$Elm$JsArray$length(tail);
		var newTailLen = elm$core$Elm$JsArray$length(newTail);
		var newArrayLen = len + (newTailLen - originalTailLen);
		if (_Utils_eq(newTailLen, elm$core$Array$branchFactor)) {
			var overflow = _Utils_cmp(newArrayLen >>> elm$core$Array$shiftStep, 1 << startShift) > 0;
			if (overflow) {
				var newShift = startShift + elm$core$Array$shiftStep;
				var newTree = A4(
					elm$core$Array$insertTailInTree,
					newShift,
					len,
					newTail,
					elm$core$Elm$JsArray$singleton(
						elm$core$Array$SubTree(tree)));
				return A4(elm$core$Array$Array_elm_builtin, newArrayLen, newShift, newTree, elm$core$Elm$JsArray$empty);
			} else {
				return A4(
					elm$core$Array$Array_elm_builtin,
					newArrayLen,
					startShift,
					A4(elm$core$Array$insertTailInTree, startShift, len, newTail, tree),
					elm$core$Elm$JsArray$empty);
			}
		} else {
			return A4(elm$core$Array$Array_elm_builtin, newArrayLen, startShift, tree, newTail);
		}
	});
var elm$core$Array$appendHelpTree = F2(
	function (toAppend, array) {
		var len = array.a;
		var tree = array.c;
		var tail = array.d;
		var itemsToAppend = elm$core$Elm$JsArray$length(toAppend);
		var notAppended = (elm$core$Array$branchFactor - elm$core$Elm$JsArray$length(tail)) - itemsToAppend;
		var appended = A3(elm$core$Elm$JsArray$appendN, elm$core$Array$branchFactor, tail, toAppend);
		var newArray = A2(elm$core$Array$unsafeReplaceTail, appended, array);
		if (notAppended < 0) {
			var nextTail = A3(elm$core$Elm$JsArray$slice, notAppended, itemsToAppend, toAppend);
			return A2(elm$core$Array$unsafeReplaceTail, nextTail, newArray);
		} else {
			return newArray;
		}
	});
var elm$core$Elm$JsArray$foldl = _JsArray_foldl;
var elm$core$Array$builderFromArray = function (_n0) {
	var len = _n0.a;
	var tree = _n0.c;
	var tail = _n0.d;
	var helper = F2(
		function (node, acc) {
			if (!node.$) {
				var subTree = node.a;
				return A3(elm$core$Elm$JsArray$foldl, helper, acc, subTree);
			} else {
				return A2(elm$core$List$cons, node, acc);
			}
		});
	return {
		x: A3(elm$core$Elm$JsArray$foldl, helper, _List_Nil, tree),
		t: (len / elm$core$Array$branchFactor) | 0,
		v: tail
	};
};
var elm$core$Array$append = F2(
	function (a, _n0) {
		var aTail = a.d;
		var bLen = _n0.a;
		var bTree = _n0.c;
		var bTail = _n0.d;
		if (_Utils_cmp(bLen, elm$core$Array$branchFactor * 4) < 1) {
			var foldHelper = F2(
				function (node, array) {
					if (!node.$) {
						var tree = node.a;
						return A3(elm$core$Elm$JsArray$foldl, foldHelper, array, tree);
					} else {
						var leaf = node.a;
						return A2(elm$core$Array$appendHelpTree, leaf, array);
					}
				});
			return A2(
				elm$core$Array$appendHelpTree,
				bTail,
				A3(elm$core$Elm$JsArray$foldl, foldHelper, a, bTree));
		} else {
			var foldHelper = F2(
				function (node, builder) {
					if (!node.$) {
						var tree = node.a;
						return A3(elm$core$Elm$JsArray$foldl, foldHelper, builder, tree);
					} else {
						var leaf = node.a;
						return A2(elm$core$Array$appendHelpBuilder, leaf, builder);
					}
				});
			return A2(
				elm$core$Array$builderToArray,
				true,
				A2(
					elm$core$Array$appendHelpBuilder,
					bTail,
					A3(
						elm$core$Elm$JsArray$foldl,
						foldHelper,
						elm$core$Array$builderFromArray(a),
						bTree)));
		}
	});
var elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = elm$core$Array$bitMask & (index >>> shift);
			var _n0 = A2(elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!_n0.$) {
				var subTree = _n0.a;
				var $temp$shift = shift - elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _n0.a;
				return A2(elm$core$Elm$JsArray$unsafeGet, elm$core$Array$bitMask & index, values);
			}
		}
	});
var elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var elm$core$Array$get = F2(
	function (index, _n0) {
		var len = _n0.a;
		var startShift = _n0.b;
		var tree = _n0.c;
		var tail = _n0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			elm$core$Array$tailIndex(len)) > -1) ? elm$core$Maybe$Just(
			A2(elm$core$Elm$JsArray$unsafeGet, elm$core$Array$bitMask & index, tail)) : elm$core$Maybe$Just(
			A3(elm$core$Array$getHelp, startShift, index, tree)));
	});
var elm$core$Elm$JsArray$map = _JsArray_map;
var elm$core$Array$map = F2(
	function (func, _n0) {
		var len = _n0.a;
		var startShift = _n0.b;
		var tree = _n0.c;
		var tail = _n0.d;
		var helper = function (node) {
			if (!node.$) {
				var subTree = node.a;
				return elm$core$Array$SubTree(
					A2(elm$core$Elm$JsArray$map, helper, subTree));
			} else {
				var values = node.a;
				return elm$core$Array$Leaf(
					A2(elm$core$Elm$JsArray$map, func, values));
			}
		};
		return A4(
			elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A2(elm$core$Elm$JsArray$map, helper, tree),
			A2(elm$core$Elm$JsArray$map, func, tail));
	});
var elm$core$Array$push = F2(
	function (a, array) {
		var tail = array.d;
		return A2(
			elm$core$Array$unsafeReplaceTail,
			A2(elm$core$Elm$JsArray$push, a, tail),
			array);
	});
var elm$core$Array$setHelp = F4(
	function (shift, index, value, tree) {
		var pos = elm$core$Array$bitMask & (index >>> shift);
		var _n0 = A2(elm$core$Elm$JsArray$unsafeGet, pos, tree);
		if (!_n0.$) {
			var subTree = _n0.a;
			var newSub = A4(elm$core$Array$setHelp, shift - elm$core$Array$shiftStep, index, value, subTree);
			return A3(
				elm$core$Elm$JsArray$unsafeSet,
				pos,
				elm$core$Array$SubTree(newSub),
				tree);
		} else {
			var values = _n0.a;
			var newLeaf = A3(elm$core$Elm$JsArray$unsafeSet, elm$core$Array$bitMask & index, value, values);
			return A3(
				elm$core$Elm$JsArray$unsafeSet,
				pos,
				elm$core$Array$Leaf(newLeaf),
				tree);
		}
	});
var elm$core$Array$set = F3(
	function (index, value, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? array : ((_Utils_cmp(
			index,
			elm$core$Array$tailIndex(len)) > -1) ? A4(
			elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			tree,
			A3(elm$core$Elm$JsArray$unsafeSet, elm$core$Array$bitMask & index, value, tail)) : A4(
			elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A4(elm$core$Array$setHelp, startShift, index, value, tree),
			tail));
	});
var elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var elm$core$Array$sliceLeft = F2(
	function (from, array) {
		var len = array.a;
		var tree = array.c;
		var tail = array.d;
		if (!from) {
			return array;
		} else {
			if (_Utils_cmp(
				from,
				elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					elm$core$Array$Array_elm_builtin,
					len - from,
					elm$core$Array$shiftStep,
					elm$core$Elm$JsArray$empty,
					A3(
						elm$core$Elm$JsArray$slice,
						from - elm$core$Array$tailIndex(len),
						elm$core$Elm$JsArray$length(tail),
						tail));
			} else {
				var skipNodes = (from / elm$core$Array$branchFactor) | 0;
				var helper = F2(
					function (node, acc) {
						if (!node.$) {
							var subTree = node.a;
							return A3(elm$core$Elm$JsArray$foldr, helper, acc, subTree);
						} else {
							var leaf = node.a;
							return A2(elm$core$List$cons, leaf, acc);
						}
					});
				var leafNodes = A3(
					elm$core$Elm$JsArray$foldr,
					helper,
					_List_fromArray(
						[tail]),
					tree);
				var nodesToInsert = A2(elm$core$List$drop, skipNodes, leafNodes);
				if (!nodesToInsert.b) {
					return elm$core$Array$empty;
				} else {
					var head = nodesToInsert.a;
					var rest = nodesToInsert.b;
					var firstSlice = from - (skipNodes * elm$core$Array$branchFactor);
					var initialBuilder = {
						x: _List_Nil,
						t: 0,
						v: A3(
							elm$core$Elm$JsArray$slice,
							firstSlice,
							elm$core$Elm$JsArray$length(head),
							head)
					};
					return A2(
						elm$core$Array$builderToArray,
						true,
						A3(elm$core$List$foldl, elm$core$Array$appendHelpBuilder, initialBuilder, rest));
				}
			}
		}
	});
var elm$core$Array$fetchNewTail = F4(
	function (shift, end, treeEnd, tree) {
		fetchNewTail:
		while (true) {
			var pos = elm$core$Array$bitMask & (treeEnd >>> shift);
			var _n0 = A2(elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!_n0.$) {
				var sub = _n0.a;
				var $temp$shift = shift - elm$core$Array$shiftStep,
					$temp$end = end,
					$temp$treeEnd = treeEnd,
					$temp$tree = sub;
				shift = $temp$shift;
				end = $temp$end;
				treeEnd = $temp$treeEnd;
				tree = $temp$tree;
				continue fetchNewTail;
			} else {
				var values = _n0.a;
				return A3(elm$core$Elm$JsArray$slice, 0, elm$core$Array$bitMask & end, values);
			}
		}
	});
var elm$core$Array$hoistTree = F3(
	function (oldShift, newShift, tree) {
		hoistTree:
		while (true) {
			if ((_Utils_cmp(oldShift, newShift) < 1) || (!elm$core$Elm$JsArray$length(tree))) {
				return tree;
			} else {
				var _n0 = A2(elm$core$Elm$JsArray$unsafeGet, 0, tree);
				if (!_n0.$) {
					var sub = _n0.a;
					var $temp$oldShift = oldShift - elm$core$Array$shiftStep,
						$temp$newShift = newShift,
						$temp$tree = sub;
					oldShift = $temp$oldShift;
					newShift = $temp$newShift;
					tree = $temp$tree;
					continue hoistTree;
				} else {
					return tree;
				}
			}
		}
	});
var elm$core$Array$sliceTree = F3(
	function (shift, endIdx, tree) {
		var lastPos = elm$core$Array$bitMask & (endIdx >>> shift);
		var _n0 = A2(elm$core$Elm$JsArray$unsafeGet, lastPos, tree);
		if (!_n0.$) {
			var sub = _n0.a;
			var newSub = A3(elm$core$Array$sliceTree, shift - elm$core$Array$shiftStep, endIdx, sub);
			return (!elm$core$Elm$JsArray$length(newSub)) ? A3(elm$core$Elm$JsArray$slice, 0, lastPos, tree) : A3(
				elm$core$Elm$JsArray$unsafeSet,
				lastPos,
				elm$core$Array$SubTree(newSub),
				A3(elm$core$Elm$JsArray$slice, 0, lastPos + 1, tree));
		} else {
			return A3(elm$core$Elm$JsArray$slice, 0, lastPos, tree);
		}
	});
var elm$core$Array$sliceRight = F2(
	function (end, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		if (_Utils_eq(end, len)) {
			return array;
		} else {
			if (_Utils_cmp(
				end,
				elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					elm$core$Array$Array_elm_builtin,
					end,
					startShift,
					tree,
					A3(elm$core$Elm$JsArray$slice, 0, elm$core$Array$bitMask & end, tail));
			} else {
				var endIdx = elm$core$Array$tailIndex(end);
				var depth = elm$core$Basics$floor(
					A2(
						elm$core$Basics$logBase,
						elm$core$Array$branchFactor,
						A2(elm$core$Basics$max, 1, endIdx - 1)));
				var newShift = A2(elm$core$Basics$max, 5, depth * elm$core$Array$shiftStep);
				return A4(
					elm$core$Array$Array_elm_builtin,
					end,
					newShift,
					A3(
						elm$core$Array$hoistTree,
						startShift,
						newShift,
						A3(elm$core$Array$sliceTree, startShift, endIdx, tree)),
					A4(elm$core$Array$fetchNewTail, startShift, end, endIdx, tree));
			}
		}
	});
var elm$core$Array$translateIndex = F2(
	function (index, _n0) {
		var len = _n0.a;
		var posIndex = (index < 0) ? (len + index) : index;
		return (posIndex < 0) ? 0 : ((_Utils_cmp(posIndex, len) > 0) ? len : posIndex);
	});
var elm$core$Array$slice = F3(
	function (from, to, array) {
		var correctTo = A2(elm$core$Array$translateIndex, to, array);
		var correctFrom = A2(elm$core$Array$translateIndex, from, array);
		return (_Utils_cmp(correctFrom, correctTo) > 0) ? elm$core$Array$empty : A2(
			elm$core$Array$sliceLeft,
			correctFrom,
			A2(elm$core$Array$sliceRight, correctTo, array));
	});
var elm$core$Array$toIndexedList = function (array) {
	var len = array.a;
	var helper = F2(
		function (entry, _n0) {
			var index = _n0.a;
			var list = _n0.b;
			return _Utils_Tuple2(
				index - 1,
				A2(
					elm$core$List$cons,
					_Utils_Tuple2(index, entry),
					list));
		});
	return A3(
		elm$core$Array$foldr,
		helper,
		_Utils_Tuple2(len - 1, _List_Nil),
		array).b;
};
var author$project$TablePlugin$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var s = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a2: s}),
					elm$core$Maybe$Nothing);
			case 1:
				var s = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a1: s}),
					elm$core$Maybe$Nothing);
			case 2:
				var s = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							E: function () {
								var _n1 = A2(elm$core$Dict$get, s, author$project$StyleSheets$tableStyles);
								if (_n1.$ === 1) {
									return model.E;
								} else {
									return s;
								}
							}(),
							bG: s
						}),
					elm$core$Maybe$Nothing);
			case 3:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{w: elm$core$Maybe$Nothing, aK: !model.aK}),
					elm$core$Maybe$Nothing);
			case 4:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aK: false}),
					elm$core$Maybe$Nothing);
			case 5:
				var nbrRows = function (n) {
					return (_Utils_cmp(n, author$project$TablePlugin$maxRows) < 1) ? n : model.gj;
				}(
					A2(
						elm$core$Maybe$withDefault,
						0,
						elm$core$String$toInt(model.a2)));
				var nbrCols = function (n) {
					return (_Utils_cmp(n, author$project$TablePlugin$maxCols) < 1) ? n : model.gi;
				}(
					A2(
						elm$core$Maybe$withDefault,
						0,
						elm$core$String$toInt(model.a1)));
				var data = A2(author$project$TablePlugin$makeDataGrid, nbrRows, nbrCols);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{fn: data, gi: nbrCols, a1: '', gj: nbrRows, a2: '', aI: true}),
					elm$core$Maybe$Nothing);
			case 6:
				var _n2 = msg.a;
				var i = _n2.a;
				var j = _n2.b;
				var s = msg.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							fn: function () {
								var _n3 = A2(elm$core$Array$get, i, model.fn);
								if (_n3.$ === 1) {
									return model.fn;
								} else {
									var a = _n3.a;
									return A3(
										elm$core$Array$set,
										i,
										A3(elm$core$Array$set, j, s, a),
										model.fn);
								}
							}()
						}),
					elm$core$Maybe$Nothing);
			case 7:
				var mbFocus = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{w: mbFocus}),
					elm$core$Maybe$Nothing);
			case 8:
				var _n4 = model.w;
				if (_n4.$ === 1) {
					return _Utils_Tuple2(model, elm$core$Maybe$Nothing);
				} else {
					var _n5 = _n4.a;
					var ri = _n5.a;
					var ci = _n5.b;
					var newData = elm$core$Array$fromList(
						A2(
							elm$core$List$map,
							elm$core$Tuple$second,
							A2(
								elm$core$List$filter,
								function (_n6) {
									var i = _n6.a;
									return !_Utils_eq(i, ri);
								},
								elm$core$Array$toIndexedList(model.fn))));
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{w: elm$core$Maybe$Nothing, fn: newData, gj: model.gj + 1}),
						elm$core$Maybe$Nothing);
				}
			case 9:
				var _n7 = model.w;
				if (_n7.$ === 1) {
					return _Utils_Tuple2(model, elm$core$Maybe$Nothing);
				} else {
					var _n8 = _n7.a;
					var ri = _n8.a;
					var ci = _n8.b;
					var newData = A2(
						elm$core$Array$map,
						function (row) {
							return elm$core$Array$fromList(
								A2(
									elm$core$List$map,
									elm$core$Tuple$second,
									A2(
										elm$core$List$filter,
										function (_n9) {
											var j = _n9.a;
											return !_Utils_eq(j, ci);
										},
										elm$core$Array$toIndexedList(row))));
						},
						model.fn);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{w: elm$core$Maybe$Nothing, fn: newData, gi: model.gi - 1}),
						elm$core$Maybe$Nothing);
				}
			case 10:
				var direction = msg.a;
				var _n10 = _Utils_Tuple2(direction, model.w);
				if (_n10.b.$ === 1) {
					switch (_n10.a) {
						case 0:
							var _n11 = _n10.a;
							var _n12 = _n10.b;
							var newRow = elm$core$Array$fromList(
								_List_fromArray(
									[
										A2(
										elm$core$Array$initialize,
										model.gi,
										elm$core$Basics$always(''))
									]));
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										fn: A2(elm$core$Array$append, newRow, model.fn),
										gj: model.gj + 1
									}),
								elm$core$Maybe$Nothing);
						case 1:
							var _n13 = _n10.a;
							var _n14 = _n10.b;
							var newRow = A2(
								elm$core$Array$initialize,
								model.gi,
								elm$core$Basics$always(''));
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										fn: A2(elm$core$Array$push, newRow, model.fn),
										gj: model.gj + 1
									}),
								elm$core$Maybe$Nothing);
						case 2:
							var _n15 = _n10.a;
							var _n16 = _n10.b;
							var newData = A2(
								elm$core$Array$map,
								function (row) {
									return A2(
										elm$core$Array$append,
										elm$core$Array$fromList(
											_List_fromArray(
												[''])),
										row);
								},
								model.fn);
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{fn: newData, gi: model.gi + 1}),
								elm$core$Maybe$Nothing);
						default:
							var _n17 = _n10.a;
							var _n18 = _n10.b;
							var newData = A2(
								elm$core$Array$map,
								function (row) {
									return A2(elm$core$Array$push, '', row);
								},
								model.fn);
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{fn: newData, gi: model.gi + 1}),
								elm$core$Maybe$Nothing);
					}
				} else {
					switch (_n10.a) {
						case 0:
							var _n19 = _n10.a;
							var _n20 = _n10.b.a;
							var i = _n20.a;
							var j = _n20.b;
							var topHalf = A3(elm$core$Array$slice, 0, i, model.fn);
							var newRow = elm$core$Array$fromList(
								_List_fromArray(
									[
										A2(
										elm$core$Array$initialize,
										model.gi,
										elm$core$Basics$always(''))
									]));
							var bottomHalf = A3(elm$core$Array$slice, i, model.gj, model.fn);
							var newData = A2(
								elm$core$Array$append,
								topHalf,
								A2(elm$core$Array$append, newRow, bottomHalf));
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{w: elm$core$Maybe$Nothing, fn: newData, gj: model.gj + 1}),
								elm$core$Maybe$Nothing);
						case 1:
							var _n21 = _n10.a;
							var _n22 = _n10.b.a;
							var i = _n22.a;
							var j = _n22.b;
							var topHalf = A3(elm$core$Array$slice, 0, i + 1, model.fn);
							var newRow = elm$core$Array$fromList(
								_List_fromArray(
									[
										A2(
										elm$core$Array$initialize,
										model.gi,
										elm$core$Basics$always(''))
									]));
							var bottomHalf = A3(elm$core$Array$slice, i + 1, model.gj, model.fn);
							var newData = A2(
								elm$core$Array$append,
								topHalf,
								A2(elm$core$Array$append, newRow, bottomHalf));
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{w: elm$core$Maybe$Nothing, fn: newData, gj: model.gj + 1}),
								elm$core$Maybe$Nothing);
						case 2:
							var _n23 = _n10.a;
							var _n24 = _n10.b.a;
							var i = _n24.a;
							var j = _n24.b;
							var addNewCell = function (row) {
								var rightHalf = A3(elm$core$Array$slice, j, model.gi, row);
								var leftHalf = A3(elm$core$Array$slice, 0, j, row);
								return A2(
									elm$core$Array$append,
									A2(elm$core$Array$push, '', leftHalf),
									rightHalf);
							};
							var newData = A2(elm$core$Array$map, addNewCell, model.fn);
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{w: elm$core$Maybe$Nothing, fn: newData, gi: model.gi + 1}),
								elm$core$Maybe$Nothing);
						default:
							var _n25 = _n10.a;
							var _n26 = _n10.b.a;
							var i = _n26.a;
							var j = _n26.b;
							var addNewCell = function (row) {
								var rightHalf = A3(elm$core$Array$slice, j + 1, model.gi, row);
								var leftHalf = A3(elm$core$Array$slice, 0, j + 1, row);
								return A2(
									elm$core$Array$append,
									A2(elm$core$Array$push, '', leftHalf),
									rightHalf);
							};
							var newData = A2(elm$core$Array$map, addNewCell, model.fn);
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{w: elm$core$Maybe$Nothing, fn: newData, gi: model.gi + 1}),
								elm$core$Maybe$Nothing);
					}
				}
			case 11:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							w: elm$core$Maybe$Nothing,
							ar: (!model.ar) ? 1 : 0
						}),
					elm$core$Maybe$Nothing);
			case 12:
				return _Utils_Tuple2(
					model,
					elm$core$Maybe$Just(
						author$project$DocumentEditorHelpers$PluginData(
							author$project$TablePlugin$toTableMeta(model))));
			default:
				return _Utils_Tuple2(
					model,
					elm$core$Maybe$Just(author$project$DocumentEditorHelpers$PluginQuit));
		}
	});
var author$project$TextBlockPlugin$SetSelection = {$: 3};
var elm$json$Json$Encode$int = _Json_wrap;
var author$project$TextBlockPlugin$encodeSelection = F2(
	function (start, stop) {
		return elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'start',
					elm$json$Json$Encode$int(start)),
					_Utils_Tuple2(
					'stop',
					elm$json$Json$Encode$int(stop))
				]));
	});
var author$project$TextBlockPlugin$findNextAvailableUid = function (trackedData) {
	return function (n) {
		return n + 1;
	}(
		A3(
			elm$core$List$foldr,
			elm$core$Basics$max,
			0,
			elm$core$Dict$keys(trackedData)));
};
var author$project$TextBlockPlugin$getSelectedTrackedData = F2(
	function (mbCursorPos, trackedDataDict) {
		if (mbCursorPos.$ === 1) {
			return elm$core$Maybe$Nothing;
		} else {
			var cursorPos = mbCursorPos.a;
			var isCursorInTrackedData = function (td) {
				return (_Utils_cmp(cursorPos, td.bz.o) > -1) && (_Utils_cmp(cursorPos, td.bz._) < 0);
			};
			return elm$core$List$head(
				A2(
					elm$core$List$filter,
					isCursorInTrackedData,
					A2(
						elm$core$List$map,
						elm$core$Tuple$second,
						elm$core$Dict$toList(trackedDataDict))));
		}
	});
var elm$core$Result$withDefault = F2(
	function (def, result) {
		if (!result.$) {
			var a = result.a;
			return a;
		} else {
			return def;
		}
	});
var elm$core$Result$mapError = F2(
	function (f, result) {
		if (!result.$) {
			var v = result.a;
			return elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return elm$core$Result$Err(
				f(e));
		}
	});
var elm$core$String$foldr = _String_foldr;
var elm$core$String$toList = function (string) {
	return A3(elm$core$String$foldr, elm$core$List$cons, _List_Nil, string);
};
var elm$core$Basics$pow = _Basics_pow;
var elm$core$String$cons = _String_cons;
var elm$core$String$fromChar = function (_char) {
	return A2(elm$core$String$cons, _char, '');
};
var rtfeldman$elm_hex$Hex$fromStringHelp = F3(
	function (position, chars, accumulated) {
		fromStringHelp:
		while (true) {
			if (!chars.b) {
				return elm$core$Result$Ok(accumulated);
			} else {
				var _char = chars.a;
				var rest = chars.b;
				switch (_char) {
					case '0':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated;
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '1':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + A2(elm$core$Basics$pow, 16, position);
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '2':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (2 * A2(elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '3':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (3 * A2(elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '4':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (4 * A2(elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '5':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (5 * A2(elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '6':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (6 * A2(elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '7':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (7 * A2(elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '8':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (8 * A2(elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '9':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (9 * A2(elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'a':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (10 * A2(elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'b':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (11 * A2(elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'c':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (12 * A2(elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'd':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (13 * A2(elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'e':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (14 * A2(elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'f':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (15 * A2(elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					default:
						var nonHex = _char;
						return elm$core$Result$Err(
							elm$core$String$fromChar(nonHex) + ' is not a valid hexadecimal character.');
				}
			}
		}
	});
var rtfeldman$elm_hex$Hex$fromString = function (str) {
	if (elm$core$String$isEmpty(str)) {
		return elm$core$Result$Err('Empty strings are not valid hexadecimal strings.');
	} else {
		var result = function () {
			if (A2(elm$core$String$startsWith, '-', str)) {
				var list = A2(
					elm$core$Maybe$withDefault,
					_List_Nil,
					elm$core$List$tail(
						elm$core$String$toList(str)));
				return A2(
					elm$core$Result$map,
					elm$core$Basics$negate,
					A3(
						rtfeldman$elm_hex$Hex$fromStringHelp,
						elm$core$List$length(list) - 1,
						list,
						0));
			} else {
				return A3(
					rtfeldman$elm_hex$Hex$fromStringHelp,
					elm$core$String$length(str) - 1,
					elm$core$String$toList(str),
					0);
			}
		}();
		var formatError = function (err) {
			return A2(
				elm$core$String$join,
				' ',
				_List_fromArray(
					['\"' + (str + '\"'), 'is not a valid hexadecimal string because', err]));
		};
		return A2(elm$core$Result$mapError, formatError, result);
	}
};
var author$project$TextBlockPlugin$hexColorToDocColor = function (hexColor) {
	var hexColor_ = elm$core$String$toLower(hexColor);
	var red = A2(
		elm$core$Result$withDefault,
		0,
		rtfeldman$elm_hex$Hex$fromString(
			A2(elm$core$String$left, 2, hexColor_)));
	var green = A2(
		elm$core$Result$withDefault,
		0,
		rtfeldman$elm_hex$Hex$fromString(
			A2(
				elm$core$String$left,
				2,
				A2(elm$core$String$dropLeft, 2, hexColor_))));
	var blue = A2(
		elm$core$Result$withDefault,
		0,
		rtfeldman$elm_hex$Hex$fromString(
			A2(
				elm$core$String$left,
				2,
				A2(elm$core$String$dropLeft, 4, hexColor_))));
	return A3(author$project$Document$DocColor, red / 255, green / 255, blue / 255);
};
var elm$core$String$trim = _String_trim;
var author$project$TextBlockPlugin$insertTagHelper = F4(
	function (rawInput, selection, nextUid, tagname) {
		if (selection.$ === 1) {
			return elm$core$Maybe$Nothing;
		} else {
			var start = selection.a.o;
			var finish = selection.a.az;
			var sel = selection.a.d2;
			var secondHalf = A2(elm$core$String$dropLeft, finish, rawInput);
			var needSpace = function (s) {
				return !(A2(elm$core$String$startsWith, '.', s) || A2(elm$core$String$startsWith, ',', s));
			}(
				elm$core$String$trim(secondHalf));
			var newLink = ' <' + (tagname + (' ' + (elm$core$String$fromInt(nextUid) + ('> ' + (sel + (needSpace ? ' </> ' : '</>'))))));
			var firstHalf = A2(elm$core$String$left, start, rawInput);
			return elm$core$Maybe$Just(
				_Utils_ap(
					firstHalf,
					_Utils_ap(newLink, secondHalf)));
		}
	});
var author$project$TextBlockPlugin$insertTrackingTag = F4(
	function (rawInput, selection, nextUid, tdKind) {
		switch (tdKind.$) {
			case 0:
				return A4(author$project$TextBlockPlugin$insertTagHelper, rawInput, selection, nextUid, 'lien-interne');
			case 1:
				return A4(author$project$TextBlockPlugin$insertTagHelper, rawInput, selection, nextUid, 'lien-externe');
			case 2:
				return A4(author$project$TextBlockPlugin$insertTagHelper, rawInput, selection, nextUid, 'titre');
			default:
				return A4(author$project$TextBlockPlugin$insertTagHelper, rawInput, selection, nextUid, 'style');
		}
	});
var author$project$TextBlockPlugin$isBackgroundColorAttr = function (a) {
	if (a.$ === 5) {
		return true;
	} else {
		return false;
	}
};
var author$project$TextBlockPlugin$isFontAttr = function (a) {
	if (a.$ === 9) {
		return true;
	} else {
		return false;
	}
};
var author$project$TextBlockPlugin$isFontColorAttr = function (a) {
	if (a.$ === 10) {
		return true;
	} else {
		return false;
	}
};
var author$project$TextBlockPlugin$updateAttrs = F4(
	function (p, c, val, attrs) {
		var helper = F2(
			function (acc, xs) {
				helper:
				while (true) {
					if (!xs.b) {
						return elm$core$List$reverse(
							A2(
								elm$core$List$cons,
								c(val),
								acc));
					} else {
						var x = xs.a;
						var xs_ = xs.b;
						if (_Utils_eq(
							c(val),
							x)) {
							return _Utils_ap(
								elm$core$List$reverse(acc),
								xs_);
						} else {
							if (p(x)) {
								return _Utils_ap(
									elm$core$List$reverse(
										A2(
											elm$core$List$cons,
											c(val),
											acc)),
									xs_);
							} else {
								var $temp$acc = A2(elm$core$List$cons, x, acc),
									$temp$xs = xs_;
								acc = $temp$acc;
								xs = $temp$xs;
								continue helper;
							}
						}
					}
				}
			});
		return A2(helper, _List_Nil, attrs);
	});
var author$project$TextBlockPlugin$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var s = msg.a;
				var _n1 = A2(elm$parser$Parser$run, author$project$TextBlockPlugin$textBlock, s);
				if (!_n1.$) {
					var res = _n1.a;
					var newTrackedData = A2(author$project$TextBlockPlugin$updateTrackedData, model.b, res);
					return _Utils_Tuple3(
						_Utils_update(
							model,
							{
								r: A2(author$project$TextBlockPlugin$getSelectedTrackedData, model.bf, newTrackedData),
								m: author$project$TextBlockPlugin$findNextAvailableUid(newTrackedData),
								i: A2(
									elm$core$List$filterMap,
									author$project$TextBlockPlugin$toTextBlocElement(newTrackedData),
									res),
								C: elm$core$Result$Ok(res),
								a8: s,
								b: newTrackedData
							}),
						elm$core$Platform$Cmd$batch(_List_Nil),
						elm$core$Maybe$Nothing);
				} else {
					return _Utils_Tuple3(model, elm$core$Platform$Cmd$none, elm$core$Maybe$Nothing);
				}
			case 1:
				var tdKind = msg.a;
				var _n2 = A4(author$project$TextBlockPlugin$insertTrackingTag, model.a8, model.H, model.m, tdKind);
				if (_n2.$ === 1) {
					return _Utils_Tuple3(model, elm$core$Platform$Cmd$none, elm$core$Maybe$Nothing);
				} else {
					var newRawInput = _n2.a;
					var newParsedInput = A2(elm$parser$Parser$run, author$project$TextBlockPlugin$textBlock, newRawInput);
					var newTrackedData = A2(
						elm$core$Result$withDefault,
						model.b,
						A2(
							elm$core$Result$map,
							author$project$TextBlockPlugin$updateTrackedData(model.b),
							newParsedInput));
					return _Utils_Tuple3(
						_Utils_update(
							model,
							{
								r: A2(
									author$project$TextBlockPlugin$getSelectedTrackedData,
									A2(
										elm$core$Maybe$map,
										function (s) {
											return s.o + 1;
										},
										model.H),
									newTrackedData),
								m: author$project$TextBlockPlugin$findNextAvailableUid(newTrackedData),
								i: A2(
									elm$core$Result$withDefault,
									model.i,
									A2(
										elm$core$Result$map,
										elm$core$List$filterMap(
											author$project$TextBlockPlugin$toTextBlocElement(newTrackedData)),
										newParsedInput)),
								C: newParsedInput,
								a8: newRawInput,
								b: newTrackedData
							}),
						A2(
							elm$core$Platform$Cmd$map,
							model.fx,
							elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										A3(andrewMacmurray$elm_delay$Delay$after, 5, 0, author$project$TextBlockPlugin$SetSelection)
									]))),
						elm$core$Maybe$Nothing);
				}
			case 2:
				var s = msg.a;
				return _Utils_Tuple3(
					_Utils_update(
						model,
						{
							r: _Utils_eq(s.o, s.az) ? A2(
								author$project$TextBlockPlugin$getSelectedTrackedData,
								elm$core$Maybe$Just(s.o),
								model.b) : elm$core$Maybe$Nothing,
							bf: _Utils_eq(s.o, s.az) ? elm$core$Maybe$Just(s.o) : elm$core$Maybe$Nothing,
							H: _Utils_eq(s.o, s.az) ? elm$core$Maybe$Nothing : elm$core$Maybe$Just(s),
							bn: _Utils_eq(s.o, s.az) ? A2(
								elm$core$Maybe$map,
								function (td) {
									return A2(author$project$TextBlockPlugin$encodeSelection, td.bz.o, td.bz._);
								},
								A2(
									author$project$TextBlockPlugin$getSelectedTrackedData,
									elm$core$Maybe$Just(s.o),
									model.b)) : elm$core$Maybe$Nothing
						}),
					elm$core$Platform$Cmd$batch(_List_Nil),
					elm$core$Maybe$Nothing);
			case 3:
				return _Utils_Tuple3(
					_Utils_update(
						model,
						{
							bn: A2(
								elm$core$Maybe$map,
								function (td) {
									return A2(author$project$TextBlockPlugin$encodeSelection, td.bz.o, td.bz._);
								},
								model.r)
						}),
					elm$core$Platform$Cmd$batch(_List_Nil),
					elm$core$Maybe$Nothing);
			case 4:
				var font = msg.a;
				return _Utils_Tuple3(
					_Utils_update(
						model,
						{
							q: A4(author$project$TextBlockPlugin$updateAttrs, author$project$TextBlockPlugin$isFontAttr, author$project$Document$Font, font, model.q)
						}),
					elm$core$Platform$Cmd$batch(_List_Nil),
					elm$core$Maybe$Nothing);
			case 5:
				var fontSize = msg.a;
				var _n3 = elm$core$String$toInt(fontSize);
				if (_n3.$ === 1) {
					return _Utils_Tuple3(model, elm$core$Platform$Cmd$none, elm$core$Maybe$Nothing);
				} else {
					var fSize = _n3.a;
					return _Utils_Tuple3(
						_Utils_update(
							model,
							{
								q: A4(author$project$TextBlockPlugin$updateAttrs, author$project$TextBlockPlugin$isFontSizeAttr, author$project$Document$FontSize, fSize, model.q)
							}),
						elm$core$Platform$Cmd$batch(_List_Nil),
						elm$core$Maybe$Nothing);
				}
			case 6:
				return _Utils_Tuple3(
					_Utils_update(
						model,
						{
							q: A4(
								author$project$TextBlockPlugin$updateAttrs,
								function (a) {
									return _Utils_eq(a, author$project$Document$Justify);
								},
								function (_n4) {
									return author$project$Document$Justify;
								},
								0,
								model.q)
						}),
					elm$core$Platform$Cmd$batch(_List_Nil),
					elm$core$Maybe$Nothing);
			case 7:
				return _Utils_Tuple3(
					_Utils_update(
						model,
						{
							q: A4(
								author$project$TextBlockPlugin$updateAttrs,
								function (a) {
									return _Utils_eq(a, author$project$Document$Bold);
								},
								function (_n5) {
									return author$project$Document$Bold;
								},
								0,
								model.q)
						}),
					elm$core$Platform$Cmd$batch(_List_Nil),
					elm$core$Maybe$Nothing);
			case 8:
				return _Utils_Tuple3(
					_Utils_update(
						model,
						{
							q: A4(
								author$project$TextBlockPlugin$updateAttrs,
								function (a) {
									return _Utils_eq(a, author$project$Document$Italic);
								},
								function (_n6) {
									return author$project$Document$Italic;
								},
								0,
								model.q)
						}),
					elm$core$Platform$Cmd$batch(_List_Nil),
					elm$core$Maybe$Nothing);
			case 9:
				var strLevel = msg.a;
				return _Utils_Tuple3(
					_Utils_update(
						model,
						{
							aY: elm$core$String$toInt(strLevel)
						}),
					elm$core$Platform$Cmd$batch(_List_Nil),
					elm$core$Maybe$Nothing);
			case 10:
				var uid = msg.a;
				var _n7 = model.aY;
				if (_n7.$ === 1) {
					return _Utils_Tuple3(model, elm$core$Platform$Cmd$none, elm$core$Maybe$Nothing);
				} else {
					var level = _n7.a;
					var _n8 = A2(elm$core$Dict$get, uid, model.b);
					if (_n8.$ === 1) {
						return _Utils_Tuple3(model, elm$core$Platform$Cmd$none, elm$core$Maybe$Nothing);
					} else {
						var td = _n8.a;
						var attrs = td.p;
						var meta = td.bz;
						var dataKind = td.d;
						var newTrackedData = _Utils_update(
							td,
							{
								d: author$project$TextBlockPlugin$Heading(level)
							});
						var newTrackedDataDict = A3(elm$core$Dict$insert, uid, newTrackedData, model.b);
						return _Utils_Tuple3(
							_Utils_update(
								model,
								{
									r: elm$core$Maybe$Just(newTrackedData),
									aY: elm$core$Maybe$Nothing,
									i: A2(
										elm$core$Result$withDefault,
										model.i,
										A2(
											elm$core$Result$map,
											elm$core$List$filterMap(
												author$project$TextBlockPlugin$toTextBlocElement(newTrackedDataDict)),
											model.C)),
									b: newTrackedDataDict
								}),
							elm$core$Platform$Cmd$none,
							elm$core$Maybe$Nothing);
					}
				}
			case 11:
				var uid = msg.a;
				var url = msg.b;
				var _n9 = A2(elm$core$Dict$get, uid, model.b);
				if (_n9.$ === 1) {
					return _Utils_Tuple3(model, elm$core$Platform$Cmd$none, elm$core$Maybe$Nothing);
				} else {
					var td = _n9.a;
					var attrs = td.p;
					var meta = td.bz;
					var dataKind = td.d;
					var newTrackedData = _Utils_update(
						td,
						{
							d: author$project$TextBlockPlugin$ExternalLink(url)
						});
					var newTrackedDataDict = A3(elm$core$Dict$insert, uid, newTrackedData, model.b);
					return _Utils_Tuple3(
						_Utils_update(
							model,
							{
								r: elm$core$Maybe$Just(newTrackedData),
								i: A2(
									elm$core$Result$withDefault,
									model.i,
									A2(
										elm$core$Result$map,
										elm$core$List$filterMap(
											author$project$TextBlockPlugin$toTextBlocElement(newTrackedDataDict)),
										model.C)),
								b: newTrackedDataDict
							}),
						elm$core$Platform$Cmd$batch(_List_Nil),
						elm$core$Maybe$Nothing);
				}
			case 12:
				var uid = msg.a;
				var isDoc = msg.b;
				var _n10 = A2(elm$core$Dict$get, uid, model.b);
				if (_n10.$ === 1) {
					return _Utils_Tuple3(model, elm$core$Platform$Cmd$none, elm$core$Maybe$Nothing);
				} else {
					var td = _n10.a;
					var attrs = td.p;
					var meta = td.bz;
					var dataKind = td.d;
					if (!dataKind.$) {
						var url = dataKind.b;
						var newTrackedData = _Utils_update(
							td,
							{
								d: A2(author$project$TextBlockPlugin$InternalLink, isDoc, url)
							});
						var newTrackedDataDict = A3(elm$core$Dict$insert, uid, newTrackedData, model.b);
						return _Utils_Tuple3(
							_Utils_update(
								model,
								{
									r: elm$core$Maybe$Just(newTrackedData),
									b: newTrackedDataDict
								}),
							elm$core$Platform$Cmd$none,
							elm$core$Maybe$Nothing);
					} else {
						return _Utils_Tuple3(model, elm$core$Platform$Cmd$none, elm$core$Maybe$Nothing);
					}
				}
			case 13:
				return _Utils_Tuple3(
					_Utils_update(
						model,
						{ab: !model.ab}),
					elm$core$Platform$Cmd$batch(_List_Nil),
					elm$core$Maybe$Nothing);
			case 14:
				return _Utils_Tuple3(
					_Utils_update(
						model,
						{ab: false}),
					elm$core$Platform$Cmd$batch(_List_Nil),
					elm$core$Maybe$Nothing);
			case 15:
				var p = msg.a;
				return _Utils_Tuple3(
					_Utils_update(
						model,
						{
							as: elm$core$Maybe$Just(p)
						}),
					elm$core$Platform$Cmd$batch(_List_Nil),
					elm$core$Maybe$Nothing);
			case 16:
				var uid = msg.a;
				var _n12 = model.as;
				if (_n12.$ === 1) {
					return _Utils_Tuple3(model, elm$core$Platform$Cmd$none, elm$core$Maybe$Nothing);
				} else {
					var url = _n12.a;
					var _n13 = A2(elm$core$Dict$get, uid, model.b);
					if (_n13.$ === 1) {
						return _Utils_Tuple3(model, elm$core$Platform$Cmd$none, elm$core$Maybe$Nothing);
					} else {
						var td = _n13.a;
						var attrs = td.p;
						var meta = td.bz;
						var dataKind = td.d;
						var newTrackedData = _Utils_update(
							td,
							{
								d: A2(author$project$TextBlockPlugin$InternalLink, false, url)
							});
						var newTrackedDataDict = A3(elm$core$Dict$insert, uid, newTrackedData, model.b);
						return _Utils_Tuple3(
							_Utils_update(
								model,
								{
									r: elm$core$Maybe$Just(newTrackedData),
									ab: false,
									i: A2(
										elm$core$Result$withDefault,
										model.i,
										A2(
											elm$core$Result$map,
											elm$core$List$filterMap(
												author$project$TextBlockPlugin$toTextBlocElement(newTrackedDataDict)),
											model.C)),
									as: elm$core$Maybe$Nothing,
									b: newTrackedDataDict
								}),
							elm$core$Platform$Cmd$none,
							elm$core$Maybe$Nothing);
					}
				}
			case 17:
				var f = msg.a;
				return _Utils_Tuple3(
					_Utils_update(
						model,
						{
							a9: elm$core$Maybe$Just(f)
						}),
					elm$core$Platform$Cmd$batch(_List_Nil),
					elm$core$Maybe$Nothing);
			case 18:
				var f = msg.a;
				return _Utils_Tuple3(
					_Utils_update(
						model,
						{
							cj: elm$core$Maybe$Just(f)
						}),
					elm$core$Platform$Cmd$batch(_List_Nil),
					elm$core$Maybe$Nothing);
			case 19:
				var uid = msg.a;
				var _n14 = model.cj;
				if (_n14.$ === 1) {
					return _Utils_Tuple3(model, elm$core$Platform$Cmd$none, elm$core$Maybe$Nothing);
				} else {
					var url = _n14.a;
					var _n15 = A2(elm$core$Dict$get, uid, model.b);
					if (_n15.$ === 1) {
						return _Utils_Tuple3(model, elm$core$Platform$Cmd$none, elm$core$Maybe$Nothing);
					} else {
						var td = _n15.a;
						var attrs = td.p;
						var meta = td.bz;
						var dataKind = td.d;
						var newTrackedData = _Utils_update(
							td,
							{
								d: A2(author$project$TextBlockPlugin$InternalLink, true, url)
							});
						var newTrackedDataDict = A3(elm$core$Dict$insert, uid, newTrackedData, model.b);
						return _Utils_Tuple3(
							_Utils_update(
								model,
								{
									r: elm$core$Maybe$Just(newTrackedData),
									ab: false,
									i: A2(
										elm$core$Result$withDefault,
										model.i,
										A2(
											elm$core$Result$map,
											elm$core$List$filterMap(
												author$project$TextBlockPlugin$toTextBlocElement(newTrackedDataDict)),
											model.C)),
									cj: elm$core$Maybe$Nothing,
									b: newTrackedDataDict
								}),
							elm$core$Platform$Cmd$none,
							elm$core$Maybe$Nothing);
					}
				}
			case 20:
				var uid = msg.a;
				var color = msg.b;
				var _n16 = A2(elm$core$Dict$get, uid, model.b);
				if (_n16.$ === 1) {
					return _Utils_Tuple3(model, elm$core$Platform$Cmd$none, elm$core$Maybe$Nothing);
				} else {
					var td = _n16.a;
					var attrs = td.p;
					var meta = td.bz;
					var dataKind = td.d;
					var newAttrs = A4(
						author$project$TextBlockPlugin$updateAttrs,
						author$project$TextBlockPlugin$isFontColorAttr,
						author$project$Document$FontColor,
						author$project$TextBlockPlugin$hexColorToDocColor(color),
						attrs);
					var newTrackedData = _Utils_update(
						td,
						{p: newAttrs});
					var newTrackedDataDict = A3(elm$core$Dict$insert, uid, newTrackedData, model.b);
					return _Utils_Tuple3(
						_Utils_update(
							model,
							{
								P: elm$core$Maybe$Nothing,
								r: elm$core$Maybe$Just(newTrackedData),
								i: A2(
									elm$core$Result$withDefault,
									model.i,
									A2(
										elm$core$Result$map,
										elm$core$List$filterMap(
											author$project$TextBlockPlugin$toTextBlocElement(newTrackedDataDict)),
										model.C)),
								b: newTrackedDataDict
							}),
						elm$core$Platform$Cmd$batch(_List_Nil),
						elm$core$Maybe$Nothing);
				}
			case 21:
				var uid = msg.a;
				var color = msg.b;
				var _n17 = A2(elm$core$Dict$get, uid, model.b);
				if (_n17.$ === 1) {
					return _Utils_Tuple3(model, elm$core$Platform$Cmd$none, elm$core$Maybe$Nothing);
				} else {
					var td = _n17.a;
					var attrs = td.p;
					var meta = td.bz;
					var dataKind = td.d;
					var newAttrs = A4(
						author$project$TextBlockPlugin$updateAttrs,
						author$project$TextBlockPlugin$isBackgroundColorAttr,
						author$project$Document$BackgroundColor,
						author$project$TextBlockPlugin$hexColorToDocColor(color),
						attrs);
					var newTrackedData = _Utils_update(
						td,
						{p: newAttrs});
					var newTrackedDataDict = A3(elm$core$Dict$insert, uid, newTrackedData, model.b);
					return _Utils_Tuple3(
						_Utils_update(
							model,
							{
								P: elm$core$Maybe$Nothing,
								r: elm$core$Maybe$Just(newTrackedData),
								i: A2(
									elm$core$Result$withDefault,
									model.i,
									A2(
										elm$core$Result$map,
										elm$core$List$filterMap(
											author$project$TextBlockPlugin$toTextBlocElement(newTrackedDataDict)),
										model.C)),
								b: newTrackedDataDict
							}),
						elm$core$Platform$Cmd$batch(_List_Nil),
						elm$core$Maybe$Nothing);
				}
			case 22:
				var uid = msg.a;
				var font = msg.b;
				var _n18 = A2(elm$core$Dict$get, uid, model.b);
				if (_n18.$ === 1) {
					return _Utils_Tuple3(model, elm$core$Platform$Cmd$none, elm$core$Maybe$Nothing);
				} else {
					var td = _n18.a;
					var attrs = td.p;
					var meta = td.bz;
					var dataKind = td.d;
					var newAttrs = A4(author$project$TextBlockPlugin$updateAttrs, author$project$TextBlockPlugin$isFontAttr, author$project$Document$Font, font, attrs);
					var newTrackedData = _Utils_update(
						td,
						{p: newAttrs});
					var newTrackedDataDict = A3(elm$core$Dict$insert, uid, newTrackedData, model.b);
					return _Utils_Tuple3(
						_Utils_update(
							model,
							{
								r: elm$core$Maybe$Just(newTrackedData),
								i: A2(
									elm$core$Result$withDefault,
									model.i,
									A2(
										elm$core$Result$map,
										elm$core$List$filterMap(
											author$project$TextBlockPlugin$toTextBlocElement(newTrackedDataDict)),
										model.C)),
								b: newTrackedDataDict
							}),
						elm$core$Platform$Cmd$batch(_List_Nil),
						elm$core$Maybe$Nothing);
				}
			case 23:
				var uid = msg.a;
				var fontSize = msg.b;
				var _n19 = elm$core$String$toInt(fontSize);
				if (_n19.$ === 1) {
					return _Utils_Tuple3(model, elm$core$Platform$Cmd$none, elm$core$Maybe$Nothing);
				} else {
					var fSize = _n19.a;
					var _n20 = A2(elm$core$Dict$get, uid, model.b);
					if (_n20.$ === 1) {
						return _Utils_Tuple3(model, elm$core$Platform$Cmd$none, elm$core$Maybe$Nothing);
					} else {
						var td = _n20.a;
						var attrs = td.p;
						var meta = td.bz;
						var dataKind = td.d;
						var newAttrs = A4(author$project$TextBlockPlugin$updateAttrs, author$project$TextBlockPlugin$isFontSizeAttr, author$project$Document$FontSize, fSize, attrs);
						var newTrackedData = _Utils_update(
							td,
							{p: newAttrs});
						var newTrackedDataDict = A3(elm$core$Dict$insert, uid, newTrackedData, model.b);
						return _Utils_Tuple3(
							_Utils_update(
								model,
								{
									r: elm$core$Maybe$Just(newTrackedData),
									i: A2(
										elm$core$Result$withDefault,
										model.i,
										A2(
											elm$core$Result$map,
											elm$core$List$filterMap(
												author$project$TextBlockPlugin$toTextBlocElement(newTrackedDataDict)),
											model.C)),
									b: newTrackedDataDict
								}),
							elm$core$Platform$Cmd$none,
							elm$core$Maybe$Nothing);
					}
				}
			case 24:
				var uid = msg.a;
				var _n21 = A2(elm$core$Dict$get, uid, model.b);
				if (_n21.$ === 1) {
					return _Utils_Tuple3(model, elm$core$Platform$Cmd$none, elm$core$Maybe$Nothing);
				} else {
					var td = _n21.a;
					var attrs = td.p;
					var meta = td.bz;
					var dataKind = td.d;
					var newAttrs = A4(
						author$project$TextBlockPlugin$updateAttrs,
						function (a) {
							return _Utils_eq(a, author$project$Document$Bold);
						},
						function (_n22) {
							return author$project$Document$Bold;
						},
						0,
						attrs);
					var newTrackedData = _Utils_update(
						td,
						{p: newAttrs});
					var newTrackedDataDict = A3(elm$core$Dict$insert, uid, newTrackedData, model.b);
					return _Utils_Tuple3(
						_Utils_update(
							model,
							{
								r: elm$core$Maybe$Just(newTrackedData),
								i: A2(
									elm$core$Result$withDefault,
									model.i,
									A2(
										elm$core$Result$map,
										elm$core$List$filterMap(
											author$project$TextBlockPlugin$toTextBlocElement(newTrackedDataDict)),
										model.C)),
								b: newTrackedDataDict
							}),
						elm$core$Platform$Cmd$batch(_List_Nil),
						elm$core$Maybe$Nothing);
				}
			case 25:
				var uid = msg.a;
				var _n23 = A2(elm$core$Dict$get, uid, model.b);
				if (_n23.$ === 1) {
					return _Utils_Tuple3(model, elm$core$Platform$Cmd$none, elm$core$Maybe$Nothing);
				} else {
					var td = _n23.a;
					var attrs = td.p;
					var meta = td.bz;
					var dataKind = td.d;
					var newAttrs = A4(
						author$project$TextBlockPlugin$updateAttrs,
						function (a) {
							return _Utils_eq(a, author$project$Document$Italic);
						},
						function (_n24) {
							return author$project$Document$Italic;
						},
						0,
						attrs);
					var newTrackedData = _Utils_update(
						td,
						{p: newAttrs});
					var newTrackedDataDict = A3(elm$core$Dict$insert, uid, newTrackedData, model.b);
					return _Utils_Tuple3(
						_Utils_update(
							model,
							{
								r: elm$core$Maybe$Just(newTrackedData),
								i: A2(
									elm$core$Result$withDefault,
									model.i,
									A2(
										elm$core$Result$map,
										elm$core$List$filterMap(
											author$project$TextBlockPlugin$toTextBlocElement(newTrackedDataDict)),
										model.C)),
								b: newTrackedDataDict
							}),
						elm$core$Platform$Cmd$batch(_List_Nil),
						elm$core$Maybe$Nothing);
				}
			case 26:
				var name = msg.a;
				return _Utils_Tuple3(
					_Utils_update(
						model,
						{
							P: function () {
								var _n25 = model.P;
								if (!_n25.$) {
									return elm$core$Maybe$Nothing;
								} else {
									return elm$core$Maybe$Just(name);
								}
							}()
						}),
					elm$core$Platform$Cmd$batch(_List_Nil),
					elm$core$Maybe$Nothing);
			case 27:
				return _Utils_Tuple3(
					_Utils_update(
						model,
						{P: elm$core$Maybe$Nothing}),
					elm$core$Platform$Cmd$batch(_List_Nil),
					elm$core$Maybe$Nothing);
			case 28:
				return _Utils_Tuple3(
					model,
					elm$core$Platform$Cmd$none,
					elm$core$Maybe$Just(
						author$project$DocumentEditorHelpers$PluginData(
							_Utils_Tuple2(model.i, model.q))));
			case 29:
				return _Utils_Tuple3(
					model,
					elm$core$Platform$Cmd$none,
					elm$core$Maybe$Just(author$project$DocumentEditorHelpers$PluginQuit));
			default:
				return _Utils_Tuple3(model, elm$core$Platform$Cmd$none, elm$core$Maybe$Nothing);
		}
	});
var elm$core$List$concatMap = F2(
	function (f, list) {
		return elm$core$List$concat(
			A2(elm$core$List$map, f, list));
	});
var elm$core$String$dropRight = F2(
	function (n, string) {
		return (n < 1) ? string : A3(elm$core$String$slice, 0, -n, string);
	});
var author$project$VideoPlugin$parseHtml = function (str) {
	var propDict = elm$core$Dict$fromList(
		A2(
			elm$core$List$filterMap,
			function (mbPair) {
				_n1$2:
				while (true) {
					if (mbPair.b) {
						if (!mbPair.b.b) {
							var property = mbPair.a;
							return elm$core$Maybe$Just(
								_Utils_Tuple2(property, 'True'));
						} else {
							if (!mbPair.b.b.b) {
								var property = mbPair.a;
								var _n2 = mbPair.b;
								var value = _n2.a;
								return elm$core$Maybe$Just(
									_Utils_Tuple2(
										property,
										A3(elm$core$String$replace, '\"', '', value)));
							} else {
								break _n1$2;
							}
						}
					} else {
						break _n1$2;
					}
				}
				return elm$core$Maybe$Nothing;
			},
			A2(
				elm$core$List$map,
				elm$core$String$split('='),
				A2(
					elm$core$List$concatMap,
					elm$core$String$split('?'),
					elm$core$String$words(
						A2(
							elm$core$String$dropRight,
							10,
							A3(
								elm$core$String$replace,
								'></iframe>',
								'',
								A3(elm$core$String$replace, '<iframe ', '', str))))))));
	var mbNewSrc = A2(
		elm$core$Maybe$map,
		elm$core$List$head,
		A2(
			elm$core$Maybe$map,
			elm$core$List$reverse,
			A2(
				elm$core$Maybe$map,
				elm$core$String$split('/'),
				A2(elm$core$Dict$get, 'src', propDict))));
	if (!mbNewSrc.$) {
		var newSrc = mbNewSrc.a;
		return elm$core$Maybe$Just(
			{
				ff: A2(
					elm$core$Maybe$withDefault,
					true,
					A2(
						elm$core$Maybe$map,
						function (v) {
							return !(v === '0');
						},
						A2(elm$core$Dict$get, 'controls', propDict))),
				fE: A2(
					elm$core$Maybe$withDefault,
					false,
					A2(
						elm$core$Maybe$map,
						function (v) {
							return v === '1';
						},
						A2(elm$core$Dict$get, 'frameborder', propDict))),
				fL: A2(
					elm$core$Maybe$withDefault,
					315,
					A2(
						elm$core$Maybe$andThen,
						elm$core$String$toInt,
						A2(elm$core$Dict$get, 'height', propDict))),
				a3: newSrc,
				gF: A2(
					elm$core$Maybe$withDefault,
					false,
					A2(
						elm$core$Maybe$map,
						elm$core$String$contains('nocookie'),
						A2(elm$core$Dict$get, 'src', propDict))),
				g2: A2(
					elm$core$Maybe$andThen,
					elm$core$String$toInt,
					A2(elm$core$Dict$get, 'start', propDict)),
				hc: A2(
					elm$core$Maybe$withDefault,
					false,
					A2(
						elm$core$Maybe$map,
						function (v) {
							return v === '1';
						},
						A2(elm$core$Dict$get, 'rel', propDict))),
				hz: A2(
					elm$core$Maybe$withDefault,
					true,
					A2(
						elm$core$Maybe$map,
						function (v) {
							return !(v === '0');
						},
						A2(elm$core$Dict$get, 'showinfo', propDict))),
				hL: A2(
					elm$core$Maybe$withDefault,
					560,
					A2(
						elm$core$Maybe$andThen,
						elm$core$String$toInt,
						A2(elm$core$Dict$get, 'width', propDict)))
			});
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var author$project$VideoPlugin$parseTime = function (str) {
	var _n0 = A2(elm$core$String$split, ':', str);
	if (!_n0.b) {
		return elm$core$Maybe$Nothing;
	} else {
		if (!_n0.b.b) {
			var ss = _n0.a;
			return elm$core$String$toInt(ss);
		} else {
			if (!_n0.b.b.b) {
				var mm = _n0.a;
				var _n1 = _n0.b;
				var ss = _n1.a;
				var _n2 = _Utils_Tuple2(
					elm$core$String$toInt(mm),
					elm$core$String$toInt(ss));
				if ((!_n2.a.$) && (!_n2.b.$)) {
					var mm_ = _n2.a.a;
					var ss_ = _n2.b.a;
					return elm$core$Maybe$Just((mm_ * 60) + ss_);
				} else {
					return elm$core$Maybe$Nothing;
				}
			} else {
				if (!_n0.b.b.b.b) {
					var hh = _n0.a;
					var _n3 = _n0.b;
					var mm = _n3.a;
					var _n4 = _n3.b;
					var ss = _n4.a;
					var _n5 = _Utils_Tuple3(
						elm$core$String$toInt(hh),
						elm$core$String$toInt(mm),
						elm$core$String$toInt(ss));
					if (((!_n5.a.$) && (!_n5.b.$)) && (!_n5.c.$)) {
						var hh_ = _n5.a.a;
						var mm_ = _n5.b.a;
						var ss_ = _n5.c.a;
						return elm$core$Maybe$Just(((hh_ * 3600) + (mm_ * 60)) + ss_);
					} else {
						return elm$core$Maybe$Nothing;
					}
				} else {
					return elm$core$Maybe$Nothing;
				}
			}
		}
	}
};
var author$project$VideoPlugin$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var s = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							a7: elm$core$Maybe$Just(s)
						}),
					elm$core$Maybe$Nothing);
			case 1:
				var _n1 = A2(elm$core$Maybe$andThen, author$project$VideoPlugin$parseHtml, model.a7);
				if (_n1.$ === 1) {
					return _Utils_Tuple2(model, elm$core$Maybe$Nothing);
				} else {
					var res = _n1.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								ff: res.ff,
								fE: res.fE,
								a3: res.a3,
								gF: res.gF,
								d7: A2(author$project$Document$VideoSize, res.hL, res.fL),
								bF: res.hL / res.fL,
								g2: res.g2,
								hc: res.hc,
								hz: res.hz
							}),
						elm$core$Maybe$Nothing);
				}
			case 2:
				var alignment = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aP: alignment}),
					elm$core$Maybe$Nothing);
			case 3:
				var bool = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{fE: bool}),
					elm$core$Maybe$Nothing);
			case 4:
				var bool = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ff: bool}),
					elm$core$Maybe$Nothing);
			case 5:
				var bool = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{gF: bool}),
					elm$core$Maybe$Nothing);
			case 6:
				var bool = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{hz: bool}),
					elm$core$Maybe$Nothing);
			case 7:
				var bool = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{hc: bool}),
					elm$core$Maybe$Nothing);
			case 8:
				var s = msg.a;
				var _n2 = author$project$VideoPlugin$parseTime(s);
				if (_n2.$ === 1) {
					return _Utils_Tuple2(model, elm$core$Maybe$Nothing);
				} else {
					var t = _n2.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								g2: elm$core$Maybe$Just(t)
							}),
						elm$core$Maybe$Nothing);
				}
			case 9:
				var s = msg.a;
				var _n3 = elm$core$String$toInt(s);
				if (!_n3.$) {
					var w = _n3.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								d7: A2(
									author$project$Document$VideoSize,
									w,
									elm$core$Basics$round(w / model.bF))
							}),
						elm$core$Maybe$Nothing);
				} else {
					return _Utils_Tuple2(model, elm$core$Maybe$Nothing);
				}
			case 10:
				var s = msg.a;
				var _n4 = elm$core$String$toInt(s);
				if (!_n4.$) {
					var h = _n4.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								d7: A2(
									author$project$Document$VideoSize,
									elm$core$Basics$round(h * model.bF),
									h)
							}),
						elm$core$Maybe$Nothing);
				} else {
					return _Utils_Tuple2(model, elm$core$Maybe$Nothing);
				}
			case 12:
				var _n5 = model.a3;
				if (_n5.$ === 1) {
					var _n6 = model.b8;
					if (_n6.$ === 1) {
						return _Utils_Tuple2(model, elm$core$Maybe$Nothing);
					} else {
						var vm = _n6.a;
						var newVideoMeta = {ff: model.ff, fE: model.fE, fN: 0, gF: model.gF, d7: model.d7, d9: vm.d9, g2: model.g2, hc: model.hc, hz: model.hz};
						return _Utils_Tuple2(
							model,
							elm$core$Maybe$Just(
								author$project$DocumentEditorHelpers$PluginData(
									_Utils_Tuple2(
										newVideoMeta,
										A2(author$project$DocumentEditorHelpers$setAligment, model.aP, model.cl)))));
					}
				} else {
					var url = _n5.a;
					var newVideoMeta = {ff: model.ff, fE: model.fE, fN: 0, gF: model.gF, d7: model.d7, d9: url, g2: model.g2, hc: model.hc, hz: model.hz};
					return _Utils_Tuple2(
						model,
						elm$core$Maybe$Just(
							author$project$DocumentEditorHelpers$PluginData(
								_Utils_Tuple2(
									newVideoMeta,
									A2(author$project$DocumentEditorHelpers$setAligment, model.aP, model.cl)))));
				}
			case 11:
				return _Utils_Tuple2(
					model,
					elm$core$Maybe$Just(author$project$DocumentEditorHelpers$PluginQuit));
			default:
				return _Utils_Tuple2(model, elm$core$Maybe$Nothing);
		}
	});
var billstclair$elm_localstorage$PortFunnel$LocalStorage$clear = billstclair$elm_localstorage$PortFunnel$InternalTypes$Clear;
var billstclair$elm_localstorage$PortFunnel$LocalStorage$get = billstclair$elm_localstorage$PortFunnel$InternalTypes$Get;
var billstclair$elm_localstorage$PortFunnel$LocalStorage$put = billstclair$elm_localstorage$PortFunnel$InternalTypes$Put;
var Janiczek$cmd_extra$Cmd$Extra$withCmds = F2(
	function (cmds, model) {
		return _Utils_Tuple2(
			model,
			elm$core$Platform$Cmd$batch(cmds));
	});
var billstclair$elm_port_funnel$PortFunnel$genericMessageToCmdPort = F2(
	function (cmdPort, genericMessage) {
		return cmdPort(
			billstclair$elm_port_funnel$PortFunnel$encodeGenericMessage(genericMessage));
	});
var billstclair$elm_port_funnel$PortFunnel$process = F4(
	function (accessors, _n0, genericMessage, state) {
		var moduleDesc = _n0;
		var _n1 = moduleDesc.cv(genericMessage);
		if (_n1.$ === 1) {
			var err = _n1.a;
			return elm$core$Result$Err(err);
		} else {
			var message = _n1.a;
			var substate = accessors.dk(state);
			var _n2 = A2(moduleDesc.dS, message, substate);
			var substate2 = _n2.a;
			var response = _n2.b;
			return elm$core$Result$Ok(
				_Utils_Tuple2(
					A2(accessors.d5, substate2, state),
					response));
		}
	});
var billstclair$elm_port_funnel$PortFunnel$appProcess = F5(
	function (cmdPort, genericMessage, funnel, state, model) {
		var _n0 = A4(billstclair$elm_port_funnel$PortFunnel$process, funnel.c0, funnel.dA, genericMessage, state);
		if (_n0.$ === 1) {
			var error = _n0.a;
			return elm$core$Result$Err(error);
		} else {
			var _n1 = _n0.a;
			var state2 = _n1.a;
			var response = _n1.b;
			var cmd = A2(
				funnel.c8,
				billstclair$elm_port_funnel$PortFunnel$genericMessageToCmdPort(cmdPort),
				response);
			var _n2 = A3(funnel.dm, response, state2, model);
			var model2 = _n2.a;
			var cmd2 = _n2.b;
			return elm$core$Result$Ok(
				A2(
					Janiczek$cmd_extra$Cmd$Extra$withCmds,
					_List_fromArray(
						[cmd, cmd2]),
					model2));
		}
	});
var billstclair$elm_port_funnel$PortFunnel$decodeValue = F2(
	function (decoder, value) {
		var _n0 = A2(elm$json$Json$Decode$decodeValue, decoder, value);
		if (!_n0.$) {
			var res = _n0.a;
			return elm$core$Result$Ok(res);
		} else {
			var err = _n0.a;
			return elm$core$Result$Err(
				elm$json$Json$Decode$errorToString(err));
		}
	});
var elm$json$Json$Decode$map3 = _Json_map3;
var billstclair$elm_port_funnel$PortFunnel$genericMessageDecoder = A4(
	elm$json$Json$Decode$map3,
	billstclair$elm_port_funnel$PortFunnel$GenericMessage,
	A2(elm$json$Json$Decode$field, 'module', elm$json$Json$Decode$string),
	A2(elm$json$Json$Decode$field, 'tag', elm$json$Json$Decode$string),
	A2(elm$json$Json$Decode$field, 'args', elm$json$Json$Decode$value));
var billstclair$elm_port_funnel$PortFunnel$decodeGenericMessage = function (value) {
	return A2(billstclair$elm_port_funnel$PortFunnel$decodeValue, billstclair$elm_port_funnel$PortFunnel$genericMessageDecoder, value);
};
var elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2(elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var elm$core$List$takeTailRec = F2(
	function (n, list) {
		return elm$core$List$reverse(
			A3(elm$core$List$takeReverse, n, list, _List_Nil));
	});
var elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _n0 = _Utils_Tuple2(n, list);
			_n0$1:
			while (true) {
				_n0$5:
				while (true) {
					if (!_n0.b.b) {
						return list;
					} else {
						if (_n0.b.b.b) {
							switch (_n0.a) {
								case 1:
									break _n0$1;
								case 2:
									var _n2 = _n0.b;
									var x = _n2.a;
									var _n3 = _n2.b;
									var y = _n3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_n0.b.b.b.b) {
										var _n4 = _n0.b;
										var x = _n4.a;
										var _n5 = _n4.b;
										var y = _n5.a;
										var _n6 = _n5.b;
										var z = _n6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _n0$5;
									}
								default:
									if (_n0.b.b.b.b && _n0.b.b.b.b.b) {
										var _n7 = _n0.b;
										var x = _n7.a;
										var _n8 = _n7.b;
										var y = _n8.a;
										var _n9 = _n8.b;
										var z = _n9.a;
										var _n10 = _n9.b;
										var w = _n10.a;
										var tl = _n10.b;
										return (ctr > 1000) ? A2(
											elm$core$List$cons,
											x,
											A2(
												elm$core$List$cons,
												y,
												A2(
													elm$core$List$cons,
													z,
													A2(
														elm$core$List$cons,
														w,
														A2(elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											elm$core$List$cons,
											x,
											A2(
												elm$core$List$cons,
												y,
												A2(
													elm$core$List$cons,
													z,
													A2(
														elm$core$List$cons,
														w,
														A3(elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _n0$5;
									}
							}
						} else {
							if (_n0.a === 1) {
								break _n0$1;
							} else {
								break _n0$5;
							}
						}
					}
				}
				return list;
			}
			var _n1 = _n0.b;
			var x = _n1.a;
			return _List_fromArray(
				[x]);
		}
	});
var elm$core$List$take = F2(
	function (n, list) {
		return A3(elm$core$List$takeFast, 0, n, list);
	});
var elm$json$Json$Decode$keyValuePairs = _Json_decodeKeyValuePairs;
var emilianobovetti$elm_yajson$Yajson$Array = function (a) {
	return {$: 1, a: a};
};
var emilianobovetti$elm_yajson$Yajson$Bool = function (a) {
	return {$: 4, a: a};
};
var emilianobovetti$elm_yajson$Yajson$Null = {$: 5};
var emilianobovetti$elm_yajson$Yajson$Number = function (a) {
	return {$: 3, a: a};
};
var emilianobovetti$elm_yajson$Yajson$Object = function (a) {
	return {$: 0, a: a};
};
var emilianobovetti$elm_yajson$Yajson$String = function (a) {
	return {$: 2, a: a};
};
function emilianobovetti$elm_yajson$Yajson$cyclic$decoder() {
	var objectDecoder = A2(
		elm$json$Json$Decode$map,
		elm$core$List$reverse,
		elm$json$Json$Decode$keyValuePairs(
			elm$json$Json$Decode$lazy(
				function (_n1) {
					return emilianobovetti$elm_yajson$Yajson$cyclic$decoder();
				})));
	var arrayDecoder = elm$json$Json$Decode$list(
		elm$json$Json$Decode$lazy(
			function (_n0) {
				return emilianobovetti$elm_yajson$Yajson$cyclic$decoder();
			}));
	return elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2(elm$json$Json$Decode$map, emilianobovetti$elm_yajson$Yajson$Object, objectDecoder),
				A2(elm$json$Json$Decode$map, emilianobovetti$elm_yajson$Yajson$Array, arrayDecoder),
				A2(elm$json$Json$Decode$map, emilianobovetti$elm_yajson$Yajson$String, elm$json$Json$Decode$string),
				A2(elm$json$Json$Decode$map, emilianobovetti$elm_yajson$Yajson$Number, elm$json$Json$Decode$float),
				A2(elm$json$Json$Decode$map, emilianobovetti$elm_yajson$Yajson$Bool, elm$json$Json$Decode$bool),
				elm$json$Json$Decode$null(emilianobovetti$elm_yajson$Yajson$Null)
			]));
}
var emilianobovetti$elm_yajson$Yajson$decoder = emilianobovetti$elm_yajson$Yajson$cyclic$decoder();
emilianobovetti$elm_yajson$Yajson$cyclic$decoder = function () {
	return emilianobovetti$elm_yajson$Yajson$decoder;
};
var emilianobovetti$elm_yajson$Yajson$fromValue = function (val) {
	return A2(elm$json$Json$Decode$decodeValue, emilianobovetti$elm_yajson$Yajson$decoder, val);
};
var emilianobovetti$elm_yajson$Yajson$Stringify$Level = function (a) {
	return {$: 1, a: a};
};
var emilianobovetti$elm_yajson$Yajson$Stringify$None = {$: 0};
var emilianobovetti$elm_yajson$Yajson$Stringify$append = F2(
	function (suffix, str) {
		return _Utils_ap(str, suffix);
	});
var emilianobovetti$elm_yajson$Yajson$Stringify$beginArray = function (ind) {
	if (!ind.$) {
		return '[';
	} else {
		return '[ ';
	}
};
var emilianobovetti$elm_yajson$Yajson$Stringify$beginObject = function (ind) {
	if (!ind.$) {
		return '{';
	} else {
		return '{ ';
	}
};
var elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3(elm$core$String$repeatHelp, n, chunk, '');
	});
var emilianobovetti$elm_yajson$Yajson$Stringify$indent = F2(
	function (ind, str) {
		if (!ind.$) {
			return str;
		} else {
			if (!ind.a) {
				return '\n' + str;
			} else {
				var lvl = ind.a;
				return '\n' + (A2(elm$core$String$repeat, lvl, '    ') + str);
			}
		}
	});
var emilianobovetti$elm_yajson$Yajson$Stringify$nameSeparator = function (ind) {
	if (!ind.$) {
		return ':';
	} else {
		return ': ';
	}
};
var emilianobovetti$elm_yajson$Yajson$Stringify$unescape = F2(
	function (chr, acc) {
		switch (chr) {
			case '\"':
				return '\\\"' + acc;
			case '\\':
				return '\\\\' + acc;
			case '\n':
				return '\\n' + acc;
			case '\t':
				return '\\t' + acc;
			case '\u0008':
				return '\\b' + acc;
			case '\u000c':
				return '\\f' + acc;
			case '\u000d':
				return '\\r' + acc;
			default:
				return _Utils_ap(
					elm$core$String$fromChar(chr),
					acc);
		}
	});
var emilianobovetti$elm_yajson$Yajson$Stringify$stringToSource = function (str) {
	return '\"' + (A3(elm$core$String$foldr, emilianobovetti$elm_yajson$Yajson$Stringify$unescape, '', str) + '\"');
};
var emilianobovetti$elm_yajson$Yajson$Stringify$valueSeparator = function (ind) {
	if (!ind.$) {
		return ',';
	} else {
		return A2(emilianobovetti$elm_yajson$Yajson$Stringify$indent, ind, ', ');
	}
};
var emilianobovetti$elm_yajson$Yajson$Stringify$foldArray = F3(
	function (ind, val, acc) {
		if (acc === '') {
			return A2(
				emilianobovetti$elm_yajson$Yajson$Stringify$append,
				A2(emilianobovetti$elm_yajson$Yajson$Stringify$nextLevel, ind, val),
				emilianobovetti$elm_yajson$Yajson$Stringify$beginArray(ind));
		} else {
			return A2(
				emilianobovetti$elm_yajson$Yajson$Stringify$append,
				A2(emilianobovetti$elm_yajson$Yajson$Stringify$nextLevel, ind, val),
				A2(
					emilianobovetti$elm_yajson$Yajson$Stringify$append,
					emilianobovetti$elm_yajson$Yajson$Stringify$valueSeparator(ind),
					acc));
		}
	});
var emilianobovetti$elm_yajson$Yajson$Stringify$foldObject = F3(
	function (ind, _n2, acc) {
		var name = _n2.a;
		var val = _n2.b;
		if (acc === '') {
			return A2(
				emilianobovetti$elm_yajson$Yajson$Stringify$append,
				A2(emilianobovetti$elm_yajson$Yajson$Stringify$nextLevel, ind, val),
				A2(
					emilianobovetti$elm_yajson$Yajson$Stringify$append,
					emilianobovetti$elm_yajson$Yajson$Stringify$nameSeparator(ind),
					A2(
						emilianobovetti$elm_yajson$Yajson$Stringify$append,
						emilianobovetti$elm_yajson$Yajson$Stringify$stringToSource(name),
						emilianobovetti$elm_yajson$Yajson$Stringify$beginObject(ind))));
		} else {
			return A2(
				emilianobovetti$elm_yajson$Yajson$Stringify$append,
				A2(emilianobovetti$elm_yajson$Yajson$Stringify$nextLevel, ind, val),
				A2(
					emilianobovetti$elm_yajson$Yajson$Stringify$append,
					emilianobovetti$elm_yajson$Yajson$Stringify$nameSeparator(ind),
					A2(
						emilianobovetti$elm_yajson$Yajson$Stringify$append,
						emilianobovetti$elm_yajson$Yajson$Stringify$stringToSource(name),
						A2(
							emilianobovetti$elm_yajson$Yajson$Stringify$append,
							emilianobovetti$elm_yajson$Yajson$Stringify$valueSeparator(ind),
							acc))));
		}
	});
var emilianobovetti$elm_yajson$Yajson$Stringify$nextLevel = F2(
	function (ind, json) {
		if (ind.$ === 1) {
			var lvl = ind.a;
			return A2(
				emilianobovetti$elm_yajson$Yajson$Stringify$toString,
				emilianobovetti$elm_yajson$Yajson$Stringify$Level(lvl + 1),
				json);
		} else {
			return A2(emilianobovetti$elm_yajson$Yajson$Stringify$toString, emilianobovetti$elm_yajson$Yajson$Stringify$None, json);
		}
	});
var emilianobovetti$elm_yajson$Yajson$Stringify$toString = F2(
	function (ind, json) {
		switch (json.$) {
			case 0:
				if (!json.a.b) {
					return A2(emilianobovetti$elm_yajson$Yajson$Stringify$indent, ind, '{}');
				} else {
					var assoc = json.a;
					return A2(
						emilianobovetti$elm_yajson$Yajson$Stringify$indent,
						ind,
						A2(
							emilianobovetti$elm_yajson$Yajson$Stringify$append,
							A2(emilianobovetti$elm_yajson$Yajson$Stringify$indent, ind, '}'),
							A3(
								elm$core$List$foldl,
								emilianobovetti$elm_yajson$Yajson$Stringify$foldObject(ind),
								'',
								assoc)));
				}
			case 1:
				if (!json.a.b) {
					return A2(emilianobovetti$elm_yajson$Yajson$Stringify$indent, ind, '[]');
				} else {
					var list = json.a;
					return A2(
						emilianobovetti$elm_yajson$Yajson$Stringify$indent,
						ind,
						A2(
							emilianobovetti$elm_yajson$Yajson$Stringify$append,
							A2(emilianobovetti$elm_yajson$Yajson$Stringify$indent, ind, ']'),
							A3(
								elm$core$List$foldl,
								emilianobovetti$elm_yajson$Yajson$Stringify$foldArray(ind),
								'',
								list)));
				}
			case 2:
				var str = json.a;
				return emilianobovetti$elm_yajson$Yajson$Stringify$stringToSource(str);
			case 3:
				var num = json.a;
				return elm$core$String$fromFloat(num);
			case 4:
				if (!json.a) {
					return 'false';
				} else {
					return 'true';
				}
			default:
				return 'null';
		}
	});
var emilianobovetti$elm_yajson$Yajson$Stringify$pretty = A2(
	elm$core$Basics$composeR,
	emilianobovetti$elm_yajson$Yajson$Stringify$toString(
		emilianobovetti$elm_yajson$Yajson$Stringify$Level(0)),
	elm$core$String$trim);
var author$project$Editor$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var vp = msg.a;
				var ws = model.l;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							l: _Utils_update(
								ws,
								{
									fL: elm$core$Basics$round(vp.cm.fL),
									hL: elm$core$Basics$round(vp.cm.hL)
								})
						}),
					elm$core$Platform$Cmd$none);
			case 1:
				var uid = msg.a;
				var res = msg.b;
				if (!res.$) {
					var viewport = res.a.cm;
					var currentConfig = model.l;
					var newSizesDict = A3(
						elm$core$Dict$insert,
						uid,
						{
							fs: elm$core$Basics$round(viewport.fL),
							ft: elm$core$Basics$round(viewport.hL)
						},
						currentConfig.g_);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								l: _Utils_update(
									currentConfig,
									{g_: newSizesDict})
							}),
						elm$core$Platform$Cmd$none);
				} else {
					var s = res.a;
					return _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
				}
			case 4:
				var res = msg.a;
				if (!res.$) {
					var viewport = res.a.cm;
					var currentConfig = model.l;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								l: _Utils_update(
									currentConfig,
									{
										f9: elm$core$Basics$round(viewport.fL)
									})
							}),
						elm$core$Platform$Cmd$none);
				} else {
					var s = res.a;
					return _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
				}
			case 2:
				var width = msg.a;
				var height = msg.b;
				var cfg = model.l;
				var newConfig = _Utils_update(
					cfg,
					{fL: height, hL: width});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{l: newConfig}),
					elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								author$project$Editor$updateSizes(newConfig)
							])));
			case 3:
				return _Utils_Tuple2(
					model,
					author$project$Editor$updateSizes(model.l));
			case 5:
				var id = msg.a;
				return _Utils_Tuple2(
					model,
					author$project$Editor$scrollTo(id));
			case 6:
				var s = msg.a;
				return (s === 'Control') ? _Utils_Tuple2(
					_Utils_update(
						model,
						{bY: true}),
					elm$core$Platform$Cmd$none) : _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
			case 7:
				var s = msg.a;
				return (s === 'Control') ? _Utils_Tuple2(
					_Utils_update(
						model,
						{bY: false}),
					elm$core$Platform$Cmd$none) : _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
			case 8:
				var uid = msg.a;
				var _n3 = A2(
					author$project$DocumentZipper$zipDown,
					author$project$Document$hasUid(uid),
					model.a);
				if (_n3.$ === 1) {
					return _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
				} else {
					var newDocument = _n3.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{a: newDocument}),
						elm$core$Platform$Cmd$batch(_List_Nil));
				}
			case 9:
				var uid = msg.a;
				var _n4 = A2(author$project$DocumentZipper$zipToUid, uid, model.a);
				if (_n4.$ === 1) {
					return _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
				} else {
					var newDocument = _n4.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{a: newDocument}),
						elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									author$project$Editor$scrollTo(
									author$project$Document$getHtmlId(
										author$project$DocumentZipper$extractDoc(newDocument)))
								])));
				}
			case 10:
				var e = msg.a;
				var newDoc = author$project$DocumentZipper$zipUp(model.a);
				return (e.fq > 0) ? _Utils_Tuple2(
					_Utils_update(
						model,
						{
							a: A2(elm$core$Maybe$withDefault, model.a, newDoc)
						}),
					elm$core$Platform$Cmd$none) : _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
			case 11:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							a: author$project$DocumentZipper$rewind(model.a)
						}),
					elm$core$Platform$Cmd$none);
			case 12:
				var _n5 = author$project$DocumentZipper$swapLeft(model.a);
				if (_n5.$ === 1) {
					return _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
				} else {
					var newDoc = _n5.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{a: newDoc}),
						elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									author$project$Editor$scrollTo(
									author$project$Document$getHtmlId(
										author$project$DocumentZipper$extractDoc(newDoc)))
								])));
				}
			case 13:
				var _n6 = author$project$DocumentZipper$swapRight(model.a);
				if (_n6.$ === 1) {
					return _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
				} else {
					var newDoc = _n6.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{a: newDoc}),
						elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									author$project$Editor$scrollTo(
									author$project$Document$getHtmlId(
										author$project$DocumentZipper$extractDoc(newDoc)))
								])));
				}
			case 14:
				return author$project$Editor$openPlugin(model);
			case 15:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							h: elm$core$Maybe$Just(6)
						}),
					elm$core$Platform$Cmd$none);
			case 16:
				var containerLabel = msg.a;
				var _n7 = author$project$DocumentZipper$extractDoc(model.a);
				if (!_n7.$) {
					var cv = _n7.a;
					var children = _n7.b;
					var newDoc = A2(
						author$project$Document$Container,
						_Utils_update(
							cv,
							{ak: containerLabel}),
						children);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								h: elm$core$Maybe$Nothing,
								a: A2(author$project$DocumentZipper$updateCurrent, newDoc, model.a)
							}),
						elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
				}
			case 17:
				var _n8 = A2(author$project$DocumentZipper$addNewInside, model.m, model.a);
				if (_n8.$ === 1) {
					return _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
				} else {
					var newDoc = _n8.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{a: newDoc, m: model.m + 1}),
						elm$core$Platform$Cmd$none);
				}
			case 18:
				var _n9 = A2(author$project$DocumentZipper$addNewLeft, model.m, model.a);
				if (_n9.$ === 1) {
					return _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
				} else {
					var newDoc = _n9.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{a: newDoc, m: model.m + 1}),
						elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									author$project$Editor$scrollTo(
									author$project$Document$getHtmlId(
										author$project$DocumentZipper$extractDoc(newDoc)))
								])));
				}
			case 19:
				var _n10 = A2(author$project$DocumentZipper$addNewRight, model.m, model.a);
				if (_n10.$ === 1) {
					return _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
				} else {
					var newDoc = _n10.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{a: newDoc, m: model.m + 1}),
						elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									author$project$Editor$scrollTo(
									author$project$Document$getHtmlId(
										author$project$DocumentZipper$extractDoc(newDoc)))
								])));
				}
			case 20:
				var containerLabel = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							h: elm$core$Maybe$Nothing,
							a: A2(
								author$project$DocumentZipper$updateCurrent,
								A2(author$project$DocumentEditorHelpers$newContainer, model.m, containerLabel),
								model.a),
							m: model.m + 2
						}),
					elm$core$Platform$Cmd$batch(_List_Nil));
			case 21:
				var plugin = msg.a;
				var _n11 = author$project$Editor$openNewPlugin(
					_Utils_update(
						model,
						{
							h: elm$core$Maybe$Just(plugin)
						}));
				var newModel = _n11.a;
				var cmd = _n11.b;
				return _Utils_Tuple2(
					_Utils_update(
						newModel,
						{m: model.m + 1}),
					elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[cmd])));
			case 22:
				var newDoc = A2(author$project$DocumentZipper$safeDeleteCurrent, model.m, model.a);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							a: A2(elm$core$Maybe$withDefault, model.a, newDoc),
							m: model.m + 1,
							au: A2(
								elm$core$List$take,
								author$project$Editor$undoCacheDepth,
								A2(elm$core$List$cons, model.a, model.au))
						}),
					elm$core$Platform$Cmd$none);
			case 23:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							aS: elm$core$Maybe$Just(
								author$project$DocumentZipper$extractDoc(model.a))
						}),
					elm$core$Platform$Cmd$none);
			case 24:
				var newDoc = A2(author$project$DocumentZipper$safeDeleteCurrent, model.m, model.a);
				var currentDoc = author$project$DocumentZipper$extractDoc(model.a);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							aS: elm$core$Maybe$Just(currentDoc),
							a: A2(elm$core$Maybe$withDefault, model.a, newDoc),
							m: model.m + 1,
							au: A2(
								elm$core$List$take,
								author$project$Editor$undoCacheDepth,
								A2(elm$core$List$cons, model.a, model.au))
						}),
					elm$core$Platform$Cmd$none);
			case 25:
				var _n12 = _Utils_Tuple2(
					author$project$DocumentZipper$extractDoc(model.a),
					model.aS);
				if ((!_n12.a.$) && (!_n12.b.$)) {
					var _n13 = _n12.a;
					var cv = _n13.a;
					var xs = _n13.b;
					var doc = _n12.b.a;
					var newDoc = A2(
						author$project$Document$Container,
						cv,
						_Utils_ap(
							xs,
							_List_fromArray(
								[doc])));
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								aS: elm$core$Maybe$Nothing,
								a: A2(author$project$DocumentZipper$updateCurrent, newDoc, model.a)
							}),
						elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
				}
			case 26:
				var _n14 = model.au;
				if (!_n14.b) {
					return _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
				} else {
					var zipper = _n14.a;
					var xs = _n14.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{a: zipper, au: xs}),
						author$project$Editor$updateSizes(model.l));
				}
			case 27:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a$: !model.a$}),
					elm$core$Platform$Cmd$none);
			case 28:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a$: false}),
					elm$core$Platform$Cmd$none);
			case 29:
				var label = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{b9: label}),
					elm$core$Platform$Cmd$none);
			case 30:
				var pm = msg.a;
				var newWidth = function () {
					switch (pm) {
						case 0:
							return 1920;
						case 1:
							return 1268;
						case 2:
							return 1024;
						default:
							return 480;
					}
				}();
				var config = model.l;
				var newConfig = _Utils_update(
					config,
					{hL: newWidth});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{l: newConfig, Y: pm}),
					author$project$Editor$updateSizes(newConfig));
			case 31:
				var config = model.l;
				var newConfig = _Utils_update(
					config,
					{fb: !config.fb});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{l: newConfig}),
					elm$core$Platform$Cmd$none);
			case 32:
				var mbPlugin = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{h: mbPlugin}),
					elm$core$Platform$Cmd$none);
			case 33:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							h: _Utils_eq(
								model.h,
								elm$core$Maybe$Just(8)) ? elm$core$Maybe$Nothing : elm$core$Maybe$Just(8)
						}),
					elm$core$Platform$Cmd$none);
			case 34:
				var filesysPluginMsg = msg.a;
				var _n16 = A2(author$project$FilesysPlugin$update, filesysPluginMsg, model.bw);
				var newFilesysPlugin = _n16.a;
				var filesysPluginCmds = _n16.b;
				var mbPluginData = _n16.c;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bw: newFilesysPlugin}),
					elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[filesysPluginCmds])));
			case 35:
				var tableMsg = msg.a;
				var _n17 = A2(author$project$TablePlugin$update, tableMsg, model.aL);
				var newTablePlugin = _n17.a;
				var mbPluginData = _n17.b;
				if (mbPluginData.$ === 1) {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{aL: newTablePlugin}),
						elm$core$Platform$Cmd$batch(_List_Nil));
				} else {
					if (!mbPluginData.a.$) {
						var _n19 = mbPluginData.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{h: elm$core$Maybe$Nothing, aL: newTablePlugin}),
							elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										author$project$Editor$scrollTo(
										author$project$Document$getHtmlId(
											author$project$DocumentZipper$extractDoc(model.a)))
									])));
					} else {
						var tm = mbPluginData.a.a;
						var newDoc = A2(
							author$project$DocumentZipper$updateCurrent,
							author$project$Document$Cell(
								{
									p: author$project$Document$getAttrs(
										author$project$DocumentZipper$extractDoc(model.a)),
									aa: author$project$Document$Table(tm),
									c: author$project$Document$getId(
										author$project$DocumentZipper$extractDoc(model.a))
								}),
							model.a);
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{h: elm$core$Maybe$Nothing, a: newDoc}),
							elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										author$project$Editor$scrollTo(
										author$project$Document$getHtmlId(
											author$project$DocumentZipper$extractDoc(model.a)))
									])));
					}
				}
			case 36:
				var textBlockMsg = msg.a;
				var _n20 = A2(author$project$TextBlockPlugin$update, textBlockMsg, model.aM);
				var newTextBlockPlugin = _n20.a;
				var textBlockPluginCmds = _n20.b;
				var mbPluginData = _n20.c;
				if (mbPluginData.$ === 1) {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{aM: newTextBlockPlugin}),
						elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[textBlockPluginCmds])));
				} else {
					if (!mbPluginData.a.$) {
						var _n22 = mbPluginData.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{h: elm$core$Maybe$Nothing, aM: newTextBlockPlugin}),
							elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										author$project$Editor$scrollTo(
										author$project$Document$getHtmlId(
											author$project$DocumentZipper$extractDoc(model.a))),
										textBlockPluginCmds
									])));
					} else {
						var _n23 = mbPluginData.a.a;
						var tbElems = _n23.a;
						var attrs = _n23.b;
						var newDoc = A2(
							author$project$DocumentZipper$updateCurrent,
							author$project$Document$Cell(
								{
									p: attrs,
									aa: author$project$Document$TextBlock(tbElems),
									c: author$project$Document$getId(
										author$project$DocumentZipper$extractDoc(model.a))
								}),
							model.a);
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{h: elm$core$Maybe$Nothing, a: newDoc}),
							elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										author$project$Editor$scrollTo(
										author$project$Document$getHtmlId(
											author$project$DocumentZipper$extractDoc(model.a))),
										textBlockPluginCmds
									])));
					}
				}
			case 37:
				var imgPlugMsg = msg.a;
				var _n24 = A2(author$project$ImagePlugin$update, imgPlugMsg, model.aA);
				var newImagePlugin = _n24.a;
				var imagePluginCmds = _n24.b;
				var mbPluginData = _n24.c;
				if (mbPluginData.$ === 1) {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{aA: newImagePlugin}),
						imagePluginCmds);
				} else {
					if (!mbPluginData.a.$) {
						var _n26 = mbPluginData.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{h: elm$core$Maybe$Nothing, aA: newImagePlugin}),
							elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										author$project$Editor$scrollTo(
										author$project$Document$getHtmlId(
											author$project$DocumentZipper$extractDoc(model.a))),
										imagePluginCmds
									])));
					} else {
						var _n27 = mbPluginData.a.a;
						var imgMeta = _n27.a;
						var attrs = _n27.b;
						var newDoc = A2(
							author$project$DocumentZipper$updateCurrent,
							author$project$Document$Cell(
								{
									p: attrs,
									aa: author$project$Document$Image(imgMeta),
									c: author$project$Document$getId(
										author$project$DocumentZipper$extractDoc(model.a))
								}),
							model.a);
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{h: elm$core$Maybe$Nothing, a: newDoc}),
							elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										author$project$Editor$scrollTo(
										author$project$Document$getHtmlId(
											author$project$DocumentZipper$extractDoc(model.a))),
										imagePluginCmds
									])));
					}
				}
			case 38:
				var vidPlugMsg = msg.a;
				var _n28 = A2(author$project$VideoPlugin$update, vidPlugMsg, model.aO);
				var newVideoPlugin = _n28.a;
				var mbPluginData = _n28.b;
				if (mbPluginData.$ === 1) {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{aO: newVideoPlugin}),
						elm$core$Platform$Cmd$none);
				} else {
					if (!mbPluginData.a.$) {
						var _n30 = mbPluginData.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{h: elm$core$Maybe$Nothing, aO: newVideoPlugin}),
							author$project$Editor$scrollTo(
								author$project$Document$getHtmlId(
									author$project$DocumentZipper$extractDoc(model.a))));
					} else {
						var _n31 = mbPluginData.a.a;
						var videoMeta = _n31.a;
						var attrs = _n31.b;
						var newDoc = A2(
							author$project$DocumentZipper$updateCurrent,
							author$project$Document$Cell(
								{
									p: attrs,
									aa: author$project$Document$Video(videoMeta),
									c: author$project$Document$getId(
										author$project$DocumentZipper$extractDoc(model.a))
								}),
							model.a);
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{h: elm$core$Maybe$Nothing, a: newDoc}),
							elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										author$project$Editor$scrollTo(
										author$project$Document$getHtmlId(
											author$project$DocumentZipper$extractDoc(model.a)))
									])));
					}
				}
			case 39:
				var _n32 = A2(
					elm$core$Maybe$map,
					elm$json$Json$Decode$decodeValue(author$project$DocumentDecoder$decodeDocument),
					model.ad);
				if ((!_n32.$) && (!_n32.a.$)) {
					var newDoc = _n32.a.a;
					var _n33 = A2(author$project$Editor$init, newDoc, '');
					var newModel = _n33.a;
					var cmd = _n33.b;
					return _Utils_Tuple2(
						_Utils_update(
							newModel,
							{
								h: elm$core$Maybe$Just(7)
							}),
						cmd);
				} else {
					return _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
				}
			case 40:
				var key = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ap: key}),
					elm$core$Platform$Cmd$none);
			case 41:
				var val = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							aZ: function (res) {
								if (!res.$) {
									var json = res.a;
									return emilianobovetti$elm_yajson$Yajson$Stringify$pretty(json);
								} else {
									var error = res.a;
									return 'error';
								}
							}(
								emilianobovetti$elm_yajson$Yajson$fromValue(val)),
							ad: elm$core$Maybe$Just(val)
						}),
					elm$core$Platform$Cmd$none);
			case 42:
				var s = msg.a;
				var newLocalStorageValue = function () {
					var _n36 = A2(elm$json$Json$Decode$decodeString, elm$json$Json$Decode$value, s);
					if (!_n36.$) {
						var value = _n36.a;
						return elm$core$Maybe$Just(value);
					} else {
						return elm$core$Maybe$Nothing;
					}
				}();
				var newBuffer = function (res) {
					if (!res.$) {
						var json = res.a;
						return emilianobovetti$elm_yajson$Yajson$Stringify$pretty(json);
					} else {
						var error = res.a;
						return 'error';
					}
				}(
					emilianobovetti$elm_yajson$Yajson$fromValue(
						A2(elm$core$Maybe$withDefault, elm$json$Json$Encode$null, newLocalStorageValue)));
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aZ: newBuffer, ad: newLocalStorageValue}),
					elm$core$Platform$Cmd$none);
			case 43:
				return _Utils_Tuple2(
					model,
					A3(
						billstclair$elm_localstorage$PortFunnel$LocalStorage$send,
						author$project$Editor$cmdPort,
						billstclair$elm_localstorage$PortFunnel$LocalStorage$get(model.ap),
						model.an.ah));
			case 44:
				return _Utils_Tuple2(
					model,
					elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								A3(
								billstclair$elm_localstorage$PortFunnel$LocalStorage$send,
								author$project$Editor$cmdPort,
								A2(billstclair$elm_localstorage$PortFunnel$LocalStorage$put, model.ap, model.ad),
								model.an.ah),
								A3(andrewMacmurray$elm_delay$Delay$after, 500, 0, author$project$Editor$ListKeys)
							])));
			case 45:
				return _Utils_Tuple2(
					model,
					elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								A3(
								billstclair$elm_localstorage$PortFunnel$LocalStorage$send,
								author$project$Editor$cmdPort,
								A2(billstclair$elm_localstorage$PortFunnel$LocalStorage$put, model.ap, elm$core$Maybe$Nothing),
								model.an.ah),
								A3(andrewMacmurray$elm_delay$Delay$after, 500, 0, author$project$Editor$ListKeys)
							])));
			case 46:
				return _Utils_Tuple2(
					model,
					elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								A3(
								billstclair$elm_localstorage$PortFunnel$LocalStorage$send,
								author$project$Editor$cmdPort,
								billstclair$elm_localstorage$PortFunnel$LocalStorage$clear(''),
								model.an.ah),
								A3(andrewMacmurray$elm_delay$Delay$after, 500, 0, author$project$Editor$ListKeys)
							])));
			case 47:
				return _Utils_Tuple2(
					model,
					A3(
						billstclair$elm_localstorage$PortFunnel$LocalStorage$send,
						author$project$Editor$cmdPort,
						billstclair$elm_localstorage$PortFunnel$LocalStorage$listKeys(''),
						model.an.ah));
			case 48:
				var val = msg.a;
				var _n37 = billstclair$elm_port_funnel$PortFunnel$decodeGenericMessage(val);
				if (_n37.$ === 1) {
					return _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
				} else {
					var genericMessage = _n37.a;
					var moduleName = genericMessage.gg;
					var _n38 = A2(elm$core$Dict$get, moduleName, author$project$Editor$funnels);
					if (!_n38.$) {
						var funnel = _n38.a;
						var storFunnel = funnel;
						var _n40 = A5(billstclair$elm_port_funnel$PortFunnel$appProcess, author$project$Editor$cmdPort, genericMessage, storFunnel, model.an, model);
						if (_n40.$ === 1) {
							return _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
						} else {
							var _n41 = _n40.a;
							var mdl = _n41.a;
							var cmd = _n41.b;
							var newBuffer = function (res) {
								if (!res.$) {
									var json = res.a;
									return emilianobovetti$elm_yajson$Yajson$Stringify$pretty(json);
								} else {
									var error = res.a;
									return 'error';
								}
							}(
								emilianobovetti$elm_yajson$Yajson$fromValue(
									A2(elm$core$Maybe$withDefault, elm$json$Json$Encode$null, mdl.ad)));
							return _Utils_Tuple2(
								_Utils_update(
									mdl,
									{aZ: newBuffer}),
								elm$core$Platform$Cmd$batch(
									_List_fromArray(
										[cmd])));
						}
					} else {
						return _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
					}
				}
			default:
				return _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
		}
	});
var author$project$Document$isContainer = function (document) {
	if (!document.$) {
		return true;
	} else {
		return false;
	}
};
var author$project$DocumentStructView$LastChild = function (a) {
	return {$: 0, a: a};
};
var author$project$DocumentStructView$NotLastChild = function (a) {
	return {$: 1, a: a};
};
var author$project$DocumentStructView$cellContentToString = function (lc) {
	switch (lc.$) {
		case 0:
			return 'Image';
		case 1:
			return 'Video';
		case 2:
			return 'Tableau';
		case 3:
			var s = lc.a;
			return 'Element spécial: ' + s;
		case 4:
			var xs = lc.a;
			return 'Zone de texte';
		default:
			return 'Cellule vide';
	}
};
var author$project$DocumentStructView$containerLabelToColor = function (cl) {
	switch (cl) {
		case 0:
			return A4(mdgriffith$elm_ui$Element$rgba, 0, 1, 0, 0.6);
		case 1:
			return A4(mdgriffith$elm_ui$Element$rgba, 1, 0, 0, 0.6);
		case 2:
			return A4(mdgriffith$elm_ui$Element$rgba, 0, 0, 1, 0.6);
		default:
			return A4(mdgriffith$elm_ui$Element$rgba, 0, 0, 0, 1);
	}
};
var author$project$DocumentStructView$containerLabelToString = function (cl) {
	switch (cl) {
		case 0:
			return 'Colonne';
		case 1:
			return 'Ligne';
		case 2:
			return 'Colonne de texte';
		default:
			return 'Bloc réactif';
	}
};
var mdgriffith$elm_ui$Internal$Model$Content = {$: 1};
var mdgriffith$elm_ui$Element$shrink = mdgriffith$elm_ui$Internal$Model$Content;
var mdgriffith$elm_ui$Internal$Model$Unkeyed = function (a) {
	return {$: 0, a: a};
};
var mdgriffith$elm_ui$Internal$Model$AsEl = 2;
var mdgriffith$elm_ui$Internal$Model$asEl = 2;
var mdgriffith$elm_ui$Internal$Model$Generic = {$: 0};
var mdgriffith$elm_ui$Internal$Model$div = mdgriffith$elm_ui$Internal$Model$Generic;
var mdgriffith$elm_ui$Internal$Flag$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var mdgriffith$elm_ui$Internal$Flag$none = A2(mdgriffith$elm_ui$Internal$Flag$Field, 0, 0);
var mdgriffith$elm_ui$Internal$Model$NoNearbyChildren = {$: 0};
var mdgriffith$elm_ui$Internal$Model$columnClass = mdgriffith$elm_ui$Internal$Style$classes.eA + (' ' + mdgriffith$elm_ui$Internal$Style$classes.aw);
var mdgriffith$elm_ui$Internal$Model$gridClass = mdgriffith$elm_ui$Internal$Style$classes.eA + (' ' + mdgriffith$elm_ui$Internal$Style$classes.fI);
var mdgriffith$elm_ui$Internal$Model$pageClass = mdgriffith$elm_ui$Internal$Style$classes.eA + (' ' + mdgriffith$elm_ui$Internal$Style$classes.dK);
var mdgriffith$elm_ui$Internal$Model$paragraphClass = mdgriffith$elm_ui$Internal$Style$classes.eA + (' ' + mdgriffith$elm_ui$Internal$Style$classes.dM);
var mdgriffith$elm_ui$Internal$Model$rowClass = mdgriffith$elm_ui$Internal$Style$classes.eA + (' ' + mdgriffith$elm_ui$Internal$Style$classes.d$);
var mdgriffith$elm_ui$Internal$Model$singleClass = mdgriffith$elm_ui$Internal$Style$classes.eA + (' ' + mdgriffith$elm_ui$Internal$Style$classes.gY);
var mdgriffith$elm_ui$Internal$Model$contextClasses = function (context) {
	switch (context) {
		case 0:
			return mdgriffith$elm_ui$Internal$Model$rowClass;
		case 1:
			return mdgriffith$elm_ui$Internal$Model$columnClass;
		case 2:
			return mdgriffith$elm_ui$Internal$Model$singleClass;
		case 3:
			return mdgriffith$elm_ui$Internal$Model$gridClass;
		case 4:
			return mdgriffith$elm_ui$Internal$Model$paragraphClass;
		default:
			return mdgriffith$elm_ui$Internal$Model$pageClass;
	}
};
var elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var mdgriffith$elm_ui$Internal$Model$Keyed = function (a) {
	return {$: 1, a: a};
};
var mdgriffith$elm_ui$Internal$Model$NoStyleSheet = {$: 0};
var mdgriffith$elm_ui$Internal$Model$Styled = function (a) {
	return {$: 1, a: a};
};
var mdgriffith$elm_ui$Internal$Model$Unstyled = function (a) {
	return {$: 0, a: a};
};
var mdgriffith$elm_ui$Internal$Model$addChildren = F2(
	function (existing, nearbyChildren) {
		switch (nearbyChildren.$) {
			case 0:
				return existing;
			case 1:
				var behind = nearbyChildren.a;
				return _Utils_ap(behind, existing);
			case 2:
				var inFront = nearbyChildren.a;
				return _Utils_ap(existing, inFront);
			default:
				var behind = nearbyChildren.a;
				var inFront = nearbyChildren.b;
				return _Utils_ap(
					behind,
					_Utils_ap(existing, inFront));
		}
	});
var mdgriffith$elm_ui$Internal$Model$addKeyedChildren = F3(
	function (key, existing, nearbyChildren) {
		switch (nearbyChildren.$) {
			case 0:
				return existing;
			case 1:
				var behind = nearbyChildren.a;
				return _Utils_ap(
					A2(
						elm$core$List$map,
						function (x) {
							return _Utils_Tuple2(key, x);
						},
						behind),
					existing);
			case 2:
				var inFront = nearbyChildren.a;
				return _Utils_ap(
					existing,
					A2(
						elm$core$List$map,
						function (x) {
							return _Utils_Tuple2(key, x);
						},
						inFront));
			default:
				var behind = nearbyChildren.a;
				var inFront = nearbyChildren.b;
				return _Utils_ap(
					A2(
						elm$core$List$map,
						function (x) {
							return _Utils_Tuple2(key, x);
						},
						behind),
					_Utils_ap(
						existing,
						A2(
							elm$core$List$map,
							function (x) {
								return _Utils_Tuple2(key, x);
							},
							inFront)));
		}
	});
var mdgriffith$elm_ui$Internal$Model$AsParagraph = 4;
var mdgriffith$elm_ui$Internal$Model$asParagraph = 4;
var elm$html$Html$div = _VirtualDom_node('div');
var elm$html$Html$p = _VirtualDom_node('p');
var elm$html$Html$s = _VirtualDom_node('s');
var elm$html$Html$u = _VirtualDom_node('u');
var elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			elm$json$Json$Encode$string(string));
	});
var elm$html$Html$Attributes$class = elm$html$Html$Attributes$stringProperty('className');
var elm$virtual_dom$VirtualDom$keyedNode = function (tag) {
	return _VirtualDom_keyedNode(
		_VirtualDom_noScript(tag));
};
var elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var mdgriffith$elm_ui$Internal$Flag$alignBottom = mdgriffith$elm_ui$Internal$Flag$flag(41);
var mdgriffith$elm_ui$Internal$Flag$alignRight = mdgriffith$elm_ui$Internal$Flag$flag(40);
var mdgriffith$elm_ui$Internal$Flag$centerX = mdgriffith$elm_ui$Internal$Flag$flag(42);
var mdgriffith$elm_ui$Internal$Flag$centerY = mdgriffith$elm_ui$Internal$Flag$flag(43);
var mdgriffith$elm_ui$Internal$Flag$heightBetween = mdgriffith$elm_ui$Internal$Flag$flag(45);
var mdgriffith$elm_ui$Internal$Flag$heightFill = mdgriffith$elm_ui$Internal$Flag$flag(37);
var mdgriffith$elm_ui$Internal$Flag$present = F2(
	function (myFlag, _n0) {
		var fieldOne = _n0.a;
		var fieldTwo = _n0.b;
		if (!myFlag.$) {
			var first = myFlag.a;
			return _Utils_eq(first & fieldOne, first);
		} else {
			var second = myFlag.a;
			return _Utils_eq(second & fieldTwo, second);
		}
	});
var mdgriffith$elm_ui$Internal$Flag$widthBetween = mdgriffith$elm_ui$Internal$Flag$flag(44);
var mdgriffith$elm_ui$Internal$Flag$widthFill = mdgriffith$elm_ui$Internal$Flag$flag(39);
var mdgriffith$elm_ui$Internal$Model$lengthClassName = function (x) {
	switch (x.$) {
		case 0:
			var px = x.a;
			return elm$core$String$fromInt(px) + 'px';
		case 1:
			return 'auto';
		case 2:
			var i = x.a;
			return elm$core$String$fromInt(i) + 'fr';
		case 3:
			var min = x.a;
			var len = x.b;
			return 'min' + (elm$core$String$fromInt(min) + mdgriffith$elm_ui$Internal$Model$lengthClassName(len));
		default:
			var max = x.a;
			var len = x.b;
			return 'max' + (elm$core$String$fromInt(max) + mdgriffith$elm_ui$Internal$Model$lengthClassName(len));
	}
};
var mdgriffith$elm_ui$Internal$Model$transformClass = function (transform) {
	switch (transform.$) {
		case 0:
			return elm$core$Maybe$Nothing;
		case 1:
			var _n1 = transform.a;
			var x = _n1.a;
			var y = _n1.b;
			var z = _n1.c;
			return elm$core$Maybe$Just(
				'mv-' + (mdgriffith$elm_ui$Internal$Model$floatClass(x) + ('-' + (mdgriffith$elm_ui$Internal$Model$floatClass(y) + ('-' + mdgriffith$elm_ui$Internal$Model$floatClass(z))))));
		default:
			var _n2 = transform.a;
			var tx = _n2.a;
			var ty = _n2.b;
			var tz = _n2.c;
			var _n3 = transform.b;
			var sx = _n3.a;
			var sy = _n3.b;
			var sz = _n3.c;
			var _n4 = transform.c;
			var ox = _n4.a;
			var oy = _n4.b;
			var oz = _n4.c;
			var angle = transform.d;
			return elm$core$Maybe$Just(
				'tfrm-' + (mdgriffith$elm_ui$Internal$Model$floatClass(tx) + ('-' + (mdgriffith$elm_ui$Internal$Model$floatClass(ty) + ('-' + (mdgriffith$elm_ui$Internal$Model$floatClass(tz) + ('-' + (mdgriffith$elm_ui$Internal$Model$floatClass(sx) + ('-' + (mdgriffith$elm_ui$Internal$Model$floatClass(sy) + ('-' + (mdgriffith$elm_ui$Internal$Model$floatClass(sz) + ('-' + (mdgriffith$elm_ui$Internal$Model$floatClass(ox) + ('-' + (mdgriffith$elm_ui$Internal$Model$floatClass(oy) + ('-' + (mdgriffith$elm_ui$Internal$Model$floatClass(oz) + ('-' + mdgriffith$elm_ui$Internal$Model$floatClass(angle))))))))))))))))))));
	}
};
var mdgriffith$elm_ui$Internal$Model$getStyleName = function (style) {
	switch (style.$) {
		case 13:
			var name = style.a;
			return name;
		case 12:
			var name = style.a;
			var o = style.b;
			return name;
		case 0:
			var _class = style.a;
			return _class;
		case 1:
			var name = style.a;
			return name;
		case 2:
			var i = style.a;
			return 'font-size-' + elm$core$String$fromInt(i);
		case 3:
			var _class = style.a;
			return _class;
		case 4:
			var _class = style.a;
			return _class;
		case 5:
			var cls = style.a;
			var x = style.b;
			var y = style.c;
			return cls;
		case 7:
			var cls = style.a;
			var top = style.b;
			var right = style.c;
			var bottom = style.d;
			var left = style.e;
			return cls;
		case 6:
			var cls = style.a;
			var top = style.b;
			var right = style.c;
			var bottom = style.d;
			var left = style.e;
			return cls;
		case 8:
			var template = style.a;
			return 'grid-rows-' + (A2(
				elm$core$String$join,
				'-',
				A2(elm$core$List$map, mdgriffith$elm_ui$Internal$Model$lengthClassName, template.gM)) + ('-cols-' + (A2(
				elm$core$String$join,
				'-',
				A2(elm$core$List$map, mdgriffith$elm_ui$Internal$Model$lengthClassName, template.e6)) + ('-space-x-' + (mdgriffith$elm_ui$Internal$Model$lengthClassName(template.g0.a) + ('-space-y-' + mdgriffith$elm_ui$Internal$Model$lengthClassName(template.g0.b)))))));
		case 9:
			var pos = style.a;
			return 'gp grid-pos-' + (elm$core$String$fromInt(pos.d$) + ('-' + (elm$core$String$fromInt(pos.c7) + ('-' + (elm$core$String$fromInt(pos.hL) + ('-' + elm$core$String$fromInt(pos.fL)))))));
		case 11:
			var selector = style.a;
			var subStyle = style.b;
			var name = function () {
				switch (selector) {
					case 0:
						return 'fs';
					case 1:
						return 'hv';
					default:
						return 'act';
				}
			}();
			return A2(
				elm$core$String$join,
				' ',
				A2(
					elm$core$List$map,
					function (sty) {
						var _n1 = mdgriffith$elm_ui$Internal$Model$getStyleName(sty);
						if (_n1 === '') {
							return '';
						} else {
							var styleName = _n1;
							return styleName + ('-' + name);
						}
					},
					subStyle));
		default:
			var x = style.a;
			return A2(
				elm$core$Maybe$withDefault,
				'',
				mdgriffith$elm_ui$Internal$Model$transformClass(x));
	}
};
var mdgriffith$elm_ui$Internal$Model$reduceStyles = F2(
	function (style, nevermind) {
		var cache = nevermind.a;
		var existing = nevermind.b;
		var styleName = mdgriffith$elm_ui$Internal$Model$getStyleName(style);
		return A2(elm$core$Set$member, styleName, cache) ? nevermind : _Utils_Tuple2(
			A2(elm$core$Set$insert, styleName, cache),
			A2(elm$core$List$cons, style, existing));
	});
var elm$core$Tuple$mapFirst = F2(
	function (func, _n0) {
		var x = _n0.a;
		var y = _n0.b;
		return _Utils_Tuple2(
			func(x),
			y);
	});
var mdgriffith$elm_ui$Internal$Model$Property = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var mdgriffith$elm_ui$Internal$Model$Style = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var mdgriffith$elm_ui$Internal$Style$dot = function (c) {
	return '.' + c;
};
var mdgriffith$elm_ui$Internal$Model$renderFocusStyle = function (focus) {
	return A2(
		mdgriffith$elm_ui$Internal$Model$Style,
		mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.eA) + (':focus .focusable, ' + (mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.eA) + '.focusable:focus')),
		A2(
			elm$core$List$filterMap,
			elm$core$Basics$identity,
			_List_fromArray(
				[
					A2(
					elm$core$Maybe$map,
					function (color) {
						return A2(
							mdgriffith$elm_ui$Internal$Model$Property,
							'border-color',
							mdgriffith$elm_ui$Internal$Model$formatColor(color));
					},
					focus.eK),
					A2(
					elm$core$Maybe$map,
					function (color) {
						return A2(
							mdgriffith$elm_ui$Internal$Model$Property,
							'background-color',
							mdgriffith$elm_ui$Internal$Model$formatColor(color));
					},
					focus.eD),
					A2(
					elm$core$Maybe$map,
					function (shadow) {
						return A2(
							mdgriffith$elm_ui$Internal$Model$Property,
							'box-shadow',
							mdgriffith$elm_ui$Internal$Model$formatBoxShadow(
								{
									eH: shadow.eH,
									e4: shadow.e4,
									dt: false,
									gn: A2(
										elm$core$Tuple$mapSecond,
										elm$core$Basics$toFloat,
										A2(elm$core$Tuple$mapFirst, elm$core$Basics$toFloat, shadow.gn)),
									d7: shadow.d7
								}));
					},
					focus.gW),
					elm$core$Maybe$Just(
					A2(mdgriffith$elm_ui$Internal$Model$Property, 'outline', 'none'))
				])));
};
var elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var mdgriffith$elm_ui$Internal$Style$Batch = function (a) {
	return {$: 5, a: a};
};
var mdgriffith$elm_ui$Internal$Style$Child = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var mdgriffith$elm_ui$Internal$Style$Class = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var mdgriffith$elm_ui$Internal$Style$Descriptor = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var mdgriffith$elm_ui$Internal$Style$Left = 3;
var mdgriffith$elm_ui$Internal$Style$Prop = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var mdgriffith$elm_ui$Internal$Style$Right = 2;
var mdgriffith$elm_ui$Internal$Style$Self = elm$core$Basics$identity;
var mdgriffith$elm_ui$Internal$Style$Supports = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var mdgriffith$elm_ui$Internal$Style$Content = elm$core$Basics$identity;
var mdgriffith$elm_ui$Internal$Style$Bottom = 1;
var mdgriffith$elm_ui$Internal$Style$CenterX = 4;
var mdgriffith$elm_ui$Internal$Style$CenterY = 5;
var mdgriffith$elm_ui$Internal$Style$Top = 0;
var mdgriffith$elm_ui$Internal$Style$alignments = _List_fromArray(
	[0, 1, 2, 3, 4, 5]);
var mdgriffith$elm_ui$Internal$Style$contentName = function (desc) {
	switch (desc) {
		case 0:
			var _n1 = desc;
			return mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.fd);
		case 1:
			var _n2 = desc;
			return mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.bV);
		case 2:
			var _n3 = desc;
			return mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.bX);
		case 3:
			var _n4 = desc;
			return mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.bv);
		case 4:
			var _n5 = desc;
			return mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.bW);
		default:
			var _n6 = desc;
			return mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.ax);
	}
};
var mdgriffith$elm_ui$Internal$Style$selfName = function (desc) {
	switch (desc) {
		case 0:
			var _n1 = desc;
			return mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.ex);
		case 1:
			var _n2 = desc;
			return mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.eq);
		case 2:
			var _n3 = desc;
			return mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.c3);
		case 3:
			var _n4 = desc;
			return mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.c2);
		case 4:
			var _n5 = desc;
			return mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.er);
		default:
			var _n6 = desc;
			return mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.es);
	}
};
var mdgriffith$elm_ui$Internal$Style$describeAlignment = function (values) {
	var createDescription = function (alignment) {
		var _n0 = values(alignment);
		var content = _n0.a;
		var indiv = _n0.b;
		return _List_fromArray(
			[
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$contentName(alignment),
				content),
				A2(
				mdgriffith$elm_ui$Internal$Style$Child,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.eA),
				_List_fromArray(
					[
						A2(
						mdgriffith$elm_ui$Internal$Style$Descriptor,
						mdgriffith$elm_ui$Internal$Style$selfName(alignment),
						indiv)
					]))
			]);
	};
	return mdgriffith$elm_ui$Internal$Style$Batch(
		A2(elm$core$List$concatMap, createDescription, mdgriffith$elm_ui$Internal$Style$alignments));
};
var mdgriffith$elm_ui$Internal$Style$elDescription = _List_fromArray(
	[
		A2(mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
		A2(mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'column'),
		A2(mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre'),
		A2(
		mdgriffith$elm_ui$Internal$Style$Descriptor,
		mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.cH),
		_List_fromArray(
			[
				A2(mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '0'),
				A2(
				mdgriffith$elm_ui$Internal$Style$Child,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.eF),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '-1')
					]))
			])),
		A2(
		mdgriffith$elm_ui$Internal$Style$Descriptor,
		mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.gR),
		_List_fromArray(
			[
				A2(
				mdgriffith$elm_ui$Internal$Style$Child,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.ec),
				_List_fromArray(
					[
						A2(
						mdgriffith$elm_ui$Internal$Style$Descriptor,
						mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.cI),
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						A2(
						mdgriffith$elm_ui$Internal$Style$Descriptor,
						mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.cZ),
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'auto !important')
							]))
					]))
			])),
		A2(
		mdgriffith$elm_ui$Internal$Style$Child,
		mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.b3),
		_List_fromArray(
			[
				A2(mdgriffith$elm_ui$Internal$Style$Prop, 'height', 'auto')
			])),
		A2(
		mdgriffith$elm_ui$Internal$Style$Child,
		mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.cI),
		_List_fromArray(
			[
				A2(mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '100000')
			])),
		A2(
		mdgriffith$elm_ui$Internal$Style$Child,
		mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.cZ),
		_List_fromArray(
			[
				A2(mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
			])),
		A2(
		mdgriffith$elm_ui$Internal$Style$Child,
		mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.cY),
		_List_fromArray(
			[
				A2(mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
			])),
		mdgriffith$elm_ui$Internal$Style$describeAlignment(
		function (alignment) {
			switch (alignment) {
				case 0:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-start')
							]),
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important'),
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', '0 !important')
							]));
				case 1:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-end')
							]),
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', '0 !important')
							]));
				case 2:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-end')
							]),
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-end')
							]));
				case 3:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-start')
							]),
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
							]));
				case 4:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'center')
							]),
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'center')
							]));
				default:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2(
								mdgriffith$elm_ui$Internal$Style$Child,
								mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.eA),
								_List_fromArray(
									[
										A2(mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto'),
										A2(mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto')
									]))
							]),
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important')
							]));
			}
		})
	]);
var mdgriffith$elm_ui$Internal$Style$gridAlignments = function (values) {
	var createDescription = function (alignment) {
		return _List_fromArray(
			[
				A2(
				mdgriffith$elm_ui$Internal$Style$Child,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.eA),
				_List_fromArray(
					[
						A2(
						mdgriffith$elm_ui$Internal$Style$Descriptor,
						mdgriffith$elm_ui$Internal$Style$selfName(alignment),
						values(alignment))
					]))
			]);
	};
	return mdgriffith$elm_ui$Internal$Style$Batch(
		A2(elm$core$List$concatMap, createDescription, mdgriffith$elm_ui$Internal$Style$alignments));
};
var mdgriffith$elm_ui$Internal$Style$Above = 0;
var mdgriffith$elm_ui$Internal$Style$Behind = 5;
var mdgriffith$elm_ui$Internal$Style$Below = 1;
var mdgriffith$elm_ui$Internal$Style$OnLeft = 3;
var mdgriffith$elm_ui$Internal$Style$OnRight = 2;
var mdgriffith$elm_ui$Internal$Style$Within = 4;
var mdgriffith$elm_ui$Internal$Style$locations = function () {
	var loc = 0;
	var _n0 = function () {
		switch (loc) {
			case 0:
				return 0;
			case 1:
				return 0;
			case 2:
				return 0;
			case 3:
				return 0;
			case 4:
				return 0;
			default:
				return 0;
		}
	}();
	return _List_fromArray(
		[0, 1, 2, 3, 4, 5]);
}();
var mdgriffith$elm_ui$Internal$Style$baseSheet = _List_fromArray(
	[
		A2(
		mdgriffith$elm_ui$Internal$Style$Class,
		'html,body',
		_List_fromArray(
			[
				A2(mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
				A2(mdgriffith$elm_ui$Internal$Style$Prop, 'padding', '0'),
				A2(mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0')
			])),
		A2(
		mdgriffith$elm_ui$Internal$Style$Class,
		_Utils_ap(
			mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.eA),
			_Utils_ap(
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.gY),
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.fS))),
		_List_fromArray(
			[
				A2(mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'block')
			])),
		A2(
		mdgriffith$elm_ui$Internal$Style$Class,
		mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.eA) + ':focus',
		_List_fromArray(
			[
				A2(mdgriffith$elm_ui$Internal$Style$Prop, 'outline', 'none')
			])),
		A2(
		mdgriffith$elm_ui$Internal$Style$Class,
		mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.cT),
		_List_fromArray(
			[
				A2(mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
				A2(mdgriffith$elm_ui$Internal$Style$Prop, 'height', 'auto'),
				A2(mdgriffith$elm_ui$Internal$Style$Prop, 'min-height', '100%'),
				A2(mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '0'),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				_Utils_ap(
					mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.eA),
					mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.cI)),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
						A2(
						mdgriffith$elm_ui$Internal$Style$Child,
						mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.cI),
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%')
							]))
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Child,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.fX),
				_List_fromArray(
					[
						A2(
						mdgriffith$elm_ui$Internal$Style$Descriptor,
						mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.bi),
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'fixed')
							]))
					]))
			])),
		A2(
		mdgriffith$elm_ui$Internal$Style$Class,
		mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.bi),
		_List_fromArray(
			[
				A2(mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'relative'),
				A2(mdgriffith$elm_ui$Internal$Style$Prop, 'border', 'none'),
				A2(mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
				A2(mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'row'),
				A2(mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto'),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.gY),
				mdgriffith$elm_ui$Internal$Style$elDescription),
				mdgriffith$elm_ui$Internal$Style$Batch(
				function (fn) {
					return A2(elm$core$List$map, fn, mdgriffith$elm_ui$Internal$Style$locations);
				}(
					function (loc) {
						switch (loc) {
							case 0:
								return A2(
									mdgriffith$elm_ui$Internal$Style$Descriptor,
									mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.en),
									_List_fromArray(
										[
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'bottom', '100%'),
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '20'),
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2(
											mdgriffith$elm_ui$Internal$Style$Child,
											mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.cI),
											_List_fromArray(
												[
													A2(mdgriffith$elm_ui$Internal$Style$Prop, 'height', 'auto')
												])),
											A2(
											mdgriffith$elm_ui$Internal$Style$Child,
											mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.cZ),
											_List_fromArray(
												[
													A2(mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
												])),
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2(mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
							case 1:
								return A2(
									mdgriffith$elm_ui$Internal$Style$Descriptor,
									mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.eG),
									_List_fromArray(
										[
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'bottom', '0'),
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'height', '0'),
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '20'),
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2(mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												])),
											A2(
											mdgriffith$elm_ui$Internal$Style$Child,
											mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.cI),
											_List_fromArray(
												[
													A2(mdgriffith$elm_ui$Internal$Style$Prop, 'height', 'auto')
												]))
										]));
							case 2:
								return A2(
									mdgriffith$elm_ui$Internal$Style$Descriptor,
									mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.gr),
									_List_fromArray(
										[
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'left', '100%'),
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '20'),
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2(mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
							case 3:
								return A2(
									mdgriffith$elm_ui$Internal$Style$Descriptor,
									mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.gp),
									_List_fromArray(
										[
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'right', '100%'),
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '20'),
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2(mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
							case 4:
								return A2(
									mdgriffith$elm_ui$Internal$Style$Descriptor,
									mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.fX),
									_List_fromArray(
										[
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2(mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
							default:
								return A2(
									mdgriffith$elm_ui$Internal$Style$Descriptor,
									mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.eF),
									_List_fromArray(
										[
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '0'),
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2(mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
						}
					}))
			])),
		A2(
		mdgriffith$elm_ui$Internal$Style$Class,
		mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.eA),
		_List_fromArray(
			[
				A2(mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'relative'),
				A2(mdgriffith$elm_ui$Internal$Style$Prop, 'border', 'none'),
				A2(mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '0'),
				A2(mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
				A2(mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'row'),
				A2(mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto'),
				A2(mdgriffith$elm_ui$Internal$Style$Prop, 'resize', 'none'),
				A2(mdgriffith$elm_ui$Internal$Style$Prop, 'font-feature-settings', 'inherit'),
				A2(mdgriffith$elm_ui$Internal$Style$Prop, 'box-sizing', 'border-box'),
				A2(mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0'),
				A2(mdgriffith$elm_ui$Internal$Style$Prop, 'padding', '0'),
				A2(mdgriffith$elm_ui$Internal$Style$Prop, 'border-width', '0'),
				A2(mdgriffith$elm_ui$Internal$Style$Prop, 'border-style', 'solid'),
				A2(mdgriffith$elm_ui$Internal$Style$Prop, 'font-size', 'inherit'),
				A2(mdgriffith$elm_ui$Internal$Style$Prop, 'color', 'inherit'),
				A2(mdgriffith$elm_ui$Internal$Style$Prop, 'font-family', 'inherit'),
				A2(mdgriffith$elm_ui$Internal$Style$Prop, 'line-height', '1'),
				A2(mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', 'inherit'),
				A2(mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration', 'none'),
				A2(mdgriffith$elm_ui$Internal$Style$Prop, 'font-style', 'inherit'),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.c$),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'flex-wrap', 'wrap')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.dE),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, '-moz-user-select', 'none'),
						A2(mdgriffith$elm_ui$Internal$Style$Prop, '-webkit-user-select', 'none'),
						A2(mdgriffith$elm_ui$Internal$Style$Prop, '-ms-user-select', 'none'),
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'user-select', 'none')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.fj),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'cursor', 'pointer')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.fk),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'cursor', 'text')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.gz),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none !important')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.bS),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto !important')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.bb),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '0')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.a5),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '1')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap(mdgriffith$elm_ui$Internal$Style$classes.fO, mdgriffith$elm_ui$Internal$Style$classes.bb)) + ':hover',
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '0')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap(mdgriffith$elm_ui$Internal$Style$classes.fO, mdgriffith$elm_ui$Internal$Style$classes.a5)) + ':hover',
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '1')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap(mdgriffith$elm_ui$Internal$Style$classes.fC, mdgriffith$elm_ui$Internal$Style$classes.bb)) + ':focus',
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '0')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap(mdgriffith$elm_ui$Internal$Style$classes.fC, mdgriffith$elm_ui$Internal$Style$classes.a5)) + ':focus',
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '1')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap(mdgriffith$elm_ui$Internal$Style$classes.cn, mdgriffith$elm_ui$Internal$Style$classes.bb)) + ':active',
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '0')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap(mdgriffith$elm_ui$Internal$Style$classes.cn, mdgriffith$elm_ui$Internal$Style$classes.a5)) + ':active',
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '1')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.ee),
				_List_fromArray(
					[
						A2(
						mdgriffith$elm_ui$Internal$Style$Prop,
						'transition',
						A2(
							elm$core$String$join,
							', ',
							A2(
								elm$core$List$map,
								function (x) {
									return x + ' 160ms';
								},
								_List_fromArray(
									['transform', 'opacity', 'filter', 'background-color', 'color', 'font-size']))))
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.gO),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'overflow', 'auto'),
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '1')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.gP),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-x', 'auto'),
						A2(
						mdgriffith$elm_ui$Internal$Style$Descriptor,
						mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.d$),
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '1')
							]))
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.gQ),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-y', 'auto'),
						A2(
						mdgriffith$elm_ui$Internal$Style$Descriptor,
						mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.aw),
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '1')
							])),
						A2(
						mdgriffith$elm_ui$Internal$Style$Descriptor,
						mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.gY),
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '1')
							]))
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.e0),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'overflow', 'hidden')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.e1),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-x', 'hidden')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.e2),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-y', 'hidden')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.cY),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'width', 'auto')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.bQ),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'border-width', '0')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.eL),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'border-style', 'dashed')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.eM),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'border-style', 'dotted')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.eN),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'border-style', 'solid')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.ec),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre'),
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline-block')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.f$),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'line-height', '1.05')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.gY),
				mdgriffith$elm_ui$Internal$Style$elDescription),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.d$),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'row'),
						A2(
						mdgriffith$elm_ui$Internal$Style$Child,
						mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.eA),
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', '0%'),
								A2(
								mdgriffith$elm_ui$Internal$Style$Descriptor,
								mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.ei),
								_List_fromArray(
									[
										A2(mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto')
									]))
							])),
						A2(
						mdgriffith$elm_ui$Internal$Style$Child,
						mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.cI),
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'stretch !important')
							])),
						A2(
						mdgriffith$elm_ui$Internal$Style$Child,
						mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.$7),
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'stretch !important')
							])),
						A2(
						mdgriffith$elm_ui$Internal$Style$Child,
						mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.cZ),
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '100000')
							])),
						A2(
						mdgriffith$elm_ui$Internal$Style$Child,
						mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.bU),
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0'),
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto'),
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'stretch')
							])),
						A2(
						mdgriffith$elm_ui$Internal$Style$Child,
						'u:first-of-type.' + mdgriffith$elm_ui$Internal$Style$classes.ew,
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1')
							])),
						A2(
						mdgriffith$elm_ui$Internal$Style$Child,
						's:first-of-type.' + mdgriffith$elm_ui$Internal$Style$classes.eu,
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								mdgriffith$elm_ui$Internal$Style$Child,
								mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.er),
								_List_fromArray(
									[
										A2(mdgriffith$elm_ui$Internal$Style$Prop, 'margin-left', 'auto !important')
									]))
							])),
						A2(
						mdgriffith$elm_ui$Internal$Style$Child,
						's:last-of-type.' + mdgriffith$elm_ui$Internal$Style$classes.eu,
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								mdgriffith$elm_ui$Internal$Style$Child,
								mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.er),
								_List_fromArray(
									[
										A2(mdgriffith$elm_ui$Internal$Style$Prop, 'margin-right', 'auto !important')
									]))
							])),
						A2(
						mdgriffith$elm_ui$Internal$Style$Child,
						's:only-of-type.' + mdgriffith$elm_ui$Internal$Style$classes.eu,
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								mdgriffith$elm_ui$Internal$Style$Child,
								mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.es),
								_List_fromArray(
									[
										A2(mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
										A2(mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important')
									]))
							])),
						A2(
						mdgriffith$elm_ui$Internal$Style$Child,
						's:last-of-type.' + (mdgriffith$elm_ui$Internal$Style$classes.eu + ' ~ u'),
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						A2(
						mdgriffith$elm_ui$Internal$Style$Child,
						'u:first-of-type.' + (mdgriffith$elm_ui$Internal$Style$classes.ew + (' ~ s.' + mdgriffith$elm_ui$Internal$Style$classes.eu)),
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						mdgriffith$elm_ui$Internal$Style$describeAlignment(
						function (alignment) {
							switch (alignment) {
								case 0:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2(mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-start')
											]),
										_List_fromArray(
											[
												A2(mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
											]));
								case 1:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2(mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-end')
											]),
										_List_fromArray(
											[
												A2(mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-end')
											]));
								case 2:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2(mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-end')
											]),
										_List_Nil);
								case 3:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2(mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-start')
											]),
										_List_Nil);
								case 4:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2(mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'center')
											]),
										_List_Nil);
								default:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2(mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'center')
											]),
										_List_fromArray(
											[
												A2(mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'center')
											]));
							}
						}),
						A2(
						mdgriffith$elm_ui$Internal$Style$Descriptor,
						mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.g$),
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'space-between')
							]))
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.aw),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'column'),
						A2(
						mdgriffith$elm_ui$Internal$Style$Child,
						mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.cI),
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '100000')
							])),
						A2(
						mdgriffith$elm_ui$Internal$Style$Child,
						mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.cZ),
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
							])),
						A2(
						mdgriffith$elm_ui$Internal$Style$Child,
						mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.ej),
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
							])),
						A2(
						mdgriffith$elm_ui$Internal$Style$Child,
						mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.cY),
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
							])),
						A2(
						mdgriffith$elm_ui$Internal$Style$Child,
						'u:first-of-type.' + mdgriffith$elm_ui$Internal$Style$classes.et,
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1')
							])),
						A2(
						mdgriffith$elm_ui$Internal$Style$Child,
						's:first-of-type.' + mdgriffith$elm_ui$Internal$Style$classes.ev,
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								mdgriffith$elm_ui$Internal$Style$Child,
								mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.es),
								_List_fromArray(
									[
										A2(mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
										A2(mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', '0 !important')
									]))
							])),
						A2(
						mdgriffith$elm_ui$Internal$Style$Child,
						's:last-of-type.' + mdgriffith$elm_ui$Internal$Style$classes.ev,
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								mdgriffith$elm_ui$Internal$Style$Child,
								mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.es),
								_List_fromArray(
									[
										A2(mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important'),
										A2(mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', '0 !important')
									]))
							])),
						A2(
						mdgriffith$elm_ui$Internal$Style$Child,
						's:only-of-type.' + mdgriffith$elm_ui$Internal$Style$classes.ev,
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								mdgriffith$elm_ui$Internal$Style$Child,
								mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.es),
								_List_fromArray(
									[
										A2(mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
										A2(mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important')
									]))
							])),
						A2(
						mdgriffith$elm_ui$Internal$Style$Child,
						's:last-of-type.' + (mdgriffith$elm_ui$Internal$Style$classes.ev + ' ~ u'),
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						A2(
						mdgriffith$elm_ui$Internal$Style$Child,
						'u:first-of-type.' + (mdgriffith$elm_ui$Internal$Style$classes.et + (' ~ s.' + mdgriffith$elm_ui$Internal$Style$classes.ev)),
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						mdgriffith$elm_ui$Internal$Style$describeAlignment(
						function (alignment) {
							switch (alignment) {
								case 0:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2(mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-start')
											]),
										_List_fromArray(
											[
												A2(mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto')
											]));
								case 1:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2(mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-end')
											]),
										_List_fromArray(
											[
												A2(mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto')
											]));
								case 2:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2(mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-end')
											]),
										_List_fromArray(
											[
												A2(mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-end')
											]));
								case 3:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2(mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-start')
											]),
										_List_fromArray(
											[
												A2(mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
											]));
								case 4:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2(mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'center')
											]),
										_List_fromArray(
											[
												A2(mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'center')
											]));
								default:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2(mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'center')
											]),
										_List_Nil);
							}
						}),
						A2(
						mdgriffith$elm_ui$Internal$Style$Child,
						mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.bU),
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0'),
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto'),
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'stretch !important')
							])),
						A2(
						mdgriffith$elm_ui$Internal$Style$Descriptor,
						mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.g$),
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'space-between')
							]))
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.fI),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'display', '-ms-grid'),
						A2(
						mdgriffith$elm_ui$Internal$Style$Child,
						'.gp',
						_List_fromArray(
							[
								A2(
								mdgriffith$elm_ui$Internal$Style$Child,
								mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.eA),
								_List_fromArray(
									[
										A2(mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
									]))
							])),
						A2(
						mdgriffith$elm_ui$Internal$Style$Supports,
						_Utils_Tuple2('display', 'grid'),
						_List_fromArray(
							[
								_Utils_Tuple2('display', 'grid')
							])),
						mdgriffith$elm_ui$Internal$Style$gridAlignments(
						function (alignment) {
							switch (alignment) {
								case 0:
									return _List_fromArray(
										[
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-start')
										]);
								case 1:
									return _List_fromArray(
										[
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-end')
										]);
								case 2:
									return _List_fromArray(
										[
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-end')
										]);
								case 3:
									return _List_fromArray(
										[
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-start')
										]);
								case 4:
									return _List_fromArray(
										[
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'center')
										]);
								default:
									return _List_fromArray(
										[
											A2(mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'center')
										]);
							}
						})
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.dK),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'block'),
						A2(
						mdgriffith$elm_ui$Internal$Style$Child,
						mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.eA + ':first-child'),
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important')
							])),
						A2(
						mdgriffith$elm_ui$Internal$Style$Child,
						mdgriffith$elm_ui$Internal$Style$dot(
							mdgriffith$elm_ui$Internal$Style$classes.eA + (mdgriffith$elm_ui$Internal$Style$selfName(3) + (':first-child + .' + mdgriffith$elm_ui$Internal$Style$classes.eA))),
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important')
							])),
						A2(
						mdgriffith$elm_ui$Internal$Style$Child,
						mdgriffith$elm_ui$Internal$Style$dot(
							mdgriffith$elm_ui$Internal$Style$classes.eA + (mdgriffith$elm_ui$Internal$Style$selfName(2) + (':first-child + .' + mdgriffith$elm_ui$Internal$Style$classes.eA))),
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important')
							])),
						mdgriffith$elm_ui$Internal$Style$describeAlignment(
						function (alignment) {
							switch (alignment) {
								case 0:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								case 1:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								case 2:
									return _Utils_Tuple2(
										_List_Nil,
										_List_fromArray(
											[
												A2(mdgriffith$elm_ui$Internal$Style$Prop, 'float', 'right'),
												A2(
												mdgriffith$elm_ui$Internal$Style$Descriptor,
												'::after',
												_List_fromArray(
													[
														A2(mdgriffith$elm_ui$Internal$Style$Prop, 'content', '\"\"'),
														A2(mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'table'),
														A2(mdgriffith$elm_ui$Internal$Style$Prop, 'clear', 'both')
													]))
											]));
								case 3:
									return _Utils_Tuple2(
										_List_Nil,
										_List_fromArray(
											[
												A2(mdgriffith$elm_ui$Internal$Style$Prop, 'float', 'left'),
												A2(
												mdgriffith$elm_ui$Internal$Style$Descriptor,
												'::after',
												_List_fromArray(
													[
														A2(mdgriffith$elm_ui$Internal$Style$Prop, 'content', '\"\"'),
														A2(mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'table'),
														A2(mdgriffith$elm_ui$Internal$Style$Prop, 'clear', 'both')
													]))
											]));
								case 4:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								default:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
							}
						})
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.f_),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre-wrap')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.dM),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'block'),
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal'),
						A2(
						mdgriffith$elm_ui$Internal$Style$Descriptor,
						mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.cH),
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '0'),
								A2(
								mdgriffith$elm_ui$Internal$Style$Child,
								mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.eF),
								_List_fromArray(
									[
										A2(mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '-1')
									]))
							])),
						A2(
						mdgriffith$elm_ui$Internal$Style$Child,
						mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.ec),
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline'),
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal')
							])),
						A2(
						mdgriffith$elm_ui$Internal$Style$Child,
						mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.gY),
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline'),
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal'),
								A2(
								mdgriffith$elm_ui$Internal$Style$Descriptor,
								mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.fX),
								_List_fromArray(
									[
										A2(mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								mdgriffith$elm_ui$Internal$Style$Descriptor,
								mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.eF),
								_List_fromArray(
									[
										A2(mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								mdgriffith$elm_ui$Internal$Style$Descriptor,
								mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.en),
								_List_fromArray(
									[
										A2(mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								mdgriffith$elm_ui$Internal$Style$Descriptor,
								mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.eG),
								_List_fromArray(
									[
										A2(mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								mdgriffith$elm_ui$Internal$Style$Descriptor,
								mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.gr),
								_List_fromArray(
									[
										A2(mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								mdgriffith$elm_ui$Internal$Style$Descriptor,
								mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.gp),
								_List_fromArray(
									[
										A2(mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								mdgriffith$elm_ui$Internal$Style$Child,
								mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.ec),
								_List_fromArray(
									[
										A2(mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline'),
										A2(mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal')
									]))
							])),
						A2(
						mdgriffith$elm_ui$Internal$Style$Child,
						mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.d$),
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline-flex')
							])),
						A2(
						mdgriffith$elm_ui$Internal$Style$Child,
						mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.aw),
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline-flex')
							])),
						A2(
						mdgriffith$elm_ui$Internal$Style$Child,
						mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.fI),
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline-grid')
							])),
						mdgriffith$elm_ui$Internal$Style$describeAlignment(
						function (alignment) {
							switch (alignment) {
								case 0:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								case 1:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								case 2:
									return _Utils_Tuple2(
										_List_Nil,
										_List_fromArray(
											[
												A2(mdgriffith$elm_ui$Internal$Style$Prop, 'float', 'right')
											]));
								case 3:
									return _Utils_Tuple2(
										_List_Nil,
										_List_fromArray(
											[
												A2(mdgriffith$elm_ui$Internal$Style$Prop, 'float', 'left')
											]));
								case 4:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								default:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
							}
						})
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				'.hidden',
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'none')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.hu),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '100')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.hk),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '200')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.ho),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '300')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.hq),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '400')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.hp),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '500')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.hs),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '600')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.eJ),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '700')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.hj),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '800')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.hl),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '900')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.f2),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'font-style', 'italic')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.g6),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration', 'line-through')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.hE),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration', 'underline'),
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration-skip-ink', 'auto'),
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration-skip', 'ink')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				_Utils_ap(
					mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.hE),
					mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.g6)),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration', 'line-through underline'),
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration-skip-ink', 'auto'),
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration-skip', 'ink')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.hv),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'font-style', 'normal')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.hm),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'justify')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.ck),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'justify-all')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.hh),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'center')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.hr),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'right')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.hn),
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'left')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Descriptor,
				'.modal',
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'fixed'),
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none')
					]))
			]))
	]);
var mdgriffith$elm_ui$Internal$Style$fontVariant = function (_var) {
	return _List_fromArray(
		[
			A2(
			mdgriffith$elm_ui$Internal$Style$Class,
			'.v-' + _var,
			_List_fromArray(
				[
					A2(mdgriffith$elm_ui$Internal$Style$Prop, 'font-feature-settings', '\"' + (_var + '\"'))
				])),
			A2(
			mdgriffith$elm_ui$Internal$Style$Class,
			'.v-' + (_var + '-off'),
			_List_fromArray(
				[
					A2(mdgriffith$elm_ui$Internal$Style$Prop, 'font-feature-settings', '\"' + (_var + '\" 0'))
				]))
		]);
};
var mdgriffith$elm_ui$Internal$Style$commonValues = elm$core$List$concat(
	_List_fromArray(
		[
			A2(
			elm$core$List$map,
			function (x) {
				return A2(
					mdgriffith$elm_ui$Internal$Style$Class,
					'.border-' + elm$core$String$fromInt(x),
					_List_fromArray(
						[
							A2(
							mdgriffith$elm_ui$Internal$Style$Prop,
							'border-width',
							elm$core$String$fromInt(x) + 'px')
						]));
			},
			A2(elm$core$List$range, 0, 6)),
			A2(
			elm$core$List$map,
			function (i) {
				return A2(
					mdgriffith$elm_ui$Internal$Style$Class,
					'.font-size-' + elm$core$String$fromInt(i),
					_List_fromArray(
						[
							A2(
							mdgriffith$elm_ui$Internal$Style$Prop,
							'font-size',
							elm$core$String$fromInt(i) + 'px')
						]));
			},
			A2(elm$core$List$range, 8, 32)),
			A2(
			elm$core$List$map,
			function (i) {
				return A2(
					mdgriffith$elm_ui$Internal$Style$Class,
					'.p-' + elm$core$String$fromInt(i),
					_List_fromArray(
						[
							A2(
							mdgriffith$elm_ui$Internal$Style$Prop,
							'padding',
							elm$core$String$fromInt(i) + 'px')
						]));
			},
			A2(elm$core$List$range, 0, 24)),
			_List_fromArray(
			[
				A2(
				mdgriffith$elm_ui$Internal$Style$Class,
				'.v-smcp',
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'font-variant', 'small-caps')
					])),
				A2(
				mdgriffith$elm_ui$Internal$Style$Class,
				'.v-smcp-off',
				_List_fromArray(
					[
						A2(mdgriffith$elm_ui$Internal$Style$Prop, 'font-variant', 'normal')
					]))
			]),
			mdgriffith$elm_ui$Internal$Style$fontVariant('zero'),
			mdgriffith$elm_ui$Internal$Style$fontVariant('onum'),
			mdgriffith$elm_ui$Internal$Style$fontVariant('liga'),
			mdgriffith$elm_ui$Internal$Style$fontVariant('dlig'),
			mdgriffith$elm_ui$Internal$Style$fontVariant('ordn'),
			mdgriffith$elm_ui$Internal$Style$fontVariant('tnum'),
			mdgriffith$elm_ui$Internal$Style$fontVariant('afrc'),
			mdgriffith$elm_ui$Internal$Style$fontVariant('frac')
		]));
var mdgriffith$elm_ui$Internal$Style$explainer = '\n.explain {\n    border: 6px solid rgb(174, 121, 15) !important;\n}\n.explain > .' + (mdgriffith$elm_ui$Internal$Style$classes.eA + (' {\n    border: 4px dashed rgb(0, 151, 167) !important;\n}\n\n.ctr {\n    border: none !important;\n}\n.explain > .ctr > .' + (mdgriffith$elm_ui$Internal$Style$classes.eA + ' {\n    border: 4px dashed rgb(0, 151, 167) !important;\n}\n\n')));
var mdgriffith$elm_ui$Internal$Style$sliderOverrides = '\n\n/* General Input Reset */\ninput[type=range] {\n  -webkit-appearance: none; /* Hides the slider so that custom slider can be made */\n  /* width: 100%;  Specific width is required for Firefox. */\n  background: transparent; /* Otherwise white in Chrome */\n  position:absolute;\n  left:0;\n  top:0;\n  z-index:10;\n  width: 100%;\n  outline: dashed 1px;\n  height: 100%;\n  opacity: 0;\n}\n\n/* Hide all syling for track */\ninput[type=range]::-moz-range-track {\n    background: transparent;\n    cursor: pointer;\n}\ninput[type=range]::-ms-track {\n    background: transparent;\n    cursor: pointer;\n}\ninput[type=range]::-webkit-slider-runnable-track {\n    background: transparent;\n    cursor: pointer;\n}\n\n/* Thumbs */\ninput[type=range]::-webkit-slider-thumb {\n    -webkit-appearance: none;\n    opacity: 0.5;\n    width: 80px;\n    height: 80px;\n    background-color: black;\n    border:none;\n    border-radius: 5px;\n}\ninput[type=range]::-moz-range-thumb {\n    opacity: 0.5;\n    width: 80px;\n    height: 80px;\n    background-color: black;\n    border:none;\n    border-radius: 5px;\n}\ninput[type=range]::-ms-thumb {\n    opacity: 0.5;\n    width: 80px;\n    height: 80px;\n    background-color: black;\n    border:none;\n    border-radius: 5px;\n}\ninput[type=range][orient=vertical]{\n    writing-mode: bt-lr; /* IE */\n    -webkit-appearance: slider-vertical;  /* WebKit */\n}\n';
var mdgriffith$elm_ui$Internal$Style$overrides = '@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {' + (mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.eA) + (mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.d$) + (' > ' + (mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.eA) + (' { flex-basis: auto !important; } ' + (mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.eA) + (mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.d$) + (' > ' + (mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.eA) + (mdgriffith$elm_ui$Internal$Style$dot(mdgriffith$elm_ui$Internal$Style$classes.bU) + (' { flex-basis: auto !important; }}' + (mdgriffith$elm_ui$Internal$Style$sliderOverrides + mdgriffith$elm_ui$Internal$Style$explainer))))))))))));
var mdgriffith$elm_ui$Internal$Style$Intermediate = elm$core$Basics$identity;
var mdgriffith$elm_ui$Internal$Style$emptyIntermediate = F2(
	function (selector, closing) {
		return {bT: closing, D: _List_Nil, aH: _List_Nil, at: selector};
	});
var mdgriffith$elm_ui$Internal$Style$renderRules = F2(
	function (_n0, rulesToRender) {
		var parent = _n0;
		var generateIntermediates = F2(
			function (rule, rendered) {
				switch (rule.$) {
					case 0:
						var name = rule.a;
						var val = rule.b;
						return _Utils_update(
							rendered,
							{
								aH: A2(
									elm$core$List$cons,
									_Utils_Tuple2(name, val),
									rendered.aH)
							});
					case 2:
						var _n2 = rule.a;
						var prop = _n2.a;
						var value = _n2.b;
						var props = rule.b;
						return _Utils_update(
							rendered,
							{
								D: A2(
									elm$core$List$cons,
									{bT: '\n}', D: _List_Nil, aH: props, at: '@supports (' + (prop + (':' + (value + (') {' + parent.at))))},
									rendered.D)
							});
					case 4:
						var selector = rule.a;
						var adjRules = rule.b;
						return _Utils_update(
							rendered,
							{
								D: A2(
									elm$core$List$cons,
									A2(
										mdgriffith$elm_ui$Internal$Style$renderRules,
										A2(mdgriffith$elm_ui$Internal$Style$emptyIntermediate, parent.at + (' + ' + selector), ''),
										adjRules),
									rendered.D)
							});
					case 1:
						var child = rule.a;
						var childRules = rule.b;
						return _Utils_update(
							rendered,
							{
								D: A2(
									elm$core$List$cons,
									A2(
										mdgriffith$elm_ui$Internal$Style$renderRules,
										A2(mdgriffith$elm_ui$Internal$Style$emptyIntermediate, parent.at + (' > ' + child), ''),
										childRules),
									rendered.D)
							});
					case 3:
						var descriptor = rule.a;
						var descriptorRules = rule.b;
						return _Utils_update(
							rendered,
							{
								D: A2(
									elm$core$List$cons,
									A2(
										mdgriffith$elm_ui$Internal$Style$renderRules,
										A2(
											mdgriffith$elm_ui$Internal$Style$emptyIntermediate,
											_Utils_ap(parent.at, descriptor),
											''),
										descriptorRules),
									rendered.D)
							});
					default:
						var batched = rule.a;
						return _Utils_update(
							rendered,
							{
								D: A2(
									elm$core$List$cons,
									A2(
										mdgriffith$elm_ui$Internal$Style$renderRules,
										A2(mdgriffith$elm_ui$Internal$Style$emptyIntermediate, parent.at, ''),
										batched),
									rendered.D)
							});
				}
			});
		return A3(elm$core$List$foldr, generateIntermediates, parent, rulesToRender);
	});
var mdgriffith$elm_ui$Internal$Style$renderCompact = function (styleClasses) {
	var renderValues = function (values) {
		return elm$core$String$concat(
			A2(
				elm$core$List$map,
				function (_n3) {
					var x = _n3.a;
					var y = _n3.b;
					return x + (':' + (y + ';'));
				},
				values));
	};
	var renderClass = function (rule) {
		var _n2 = rule.aH;
		if (!_n2.b) {
			return '';
		} else {
			return rule.at + ('{' + (renderValues(rule.aH) + (rule.bT + '}')));
		}
	};
	var renderIntermediate = function (_n0) {
		var rule = _n0;
		return _Utils_ap(
			renderClass(rule),
			elm$core$String$concat(
				A2(elm$core$List$map, renderIntermediate, rule.D)));
	};
	return elm$core$String$concat(
		A2(
			elm$core$List$map,
			renderIntermediate,
			A3(
				elm$core$List$foldr,
				F2(
					function (_n1, existing) {
						var name = _n1.a;
						var styleRules = _n1.b;
						return A2(
							elm$core$List$cons,
							A2(
								mdgriffith$elm_ui$Internal$Style$renderRules,
								A2(mdgriffith$elm_ui$Internal$Style$emptyIntermediate, name, ''),
								styleRules),
							existing);
					}),
				_List_Nil,
				styleClasses)));
};
var mdgriffith$elm_ui$Internal$Style$rules = _Utils_ap(
	mdgriffith$elm_ui$Internal$Style$overrides,
	mdgriffith$elm_ui$Internal$Style$renderCompact(
		_Utils_ap(mdgriffith$elm_ui$Internal$Style$baseSheet, mdgriffith$elm_ui$Internal$Style$commonValues)));
var mdgriffith$elm_ui$Internal$Model$staticRoot = A3(
	elm$virtual_dom$VirtualDom$node,
	'style',
	_List_Nil,
	_List_fromArray(
		[
			elm$virtual_dom$VirtualDom$text(mdgriffith$elm_ui$Internal$Style$rules)
		]));
var elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var mdgriffith$elm_ui$Internal$Model$fontName = function (font) {
	switch (font.$) {
		case 0:
			return 'serif';
		case 1:
			return 'sans-serif';
		case 2:
			return 'monospace';
		case 3:
			var name = font.a;
			return '\"' + (name + '\"');
		case 4:
			var name = font.a;
			var url = font.b;
			return '\"' + (name + '\"');
		default:
			var name = font.a.X;
			return '\"' + (name + '\"');
	}
};
var mdgriffith$elm_ui$Internal$Model$isSmallCaps = function (_var) {
	switch (_var.$) {
		case 0:
			var name = _var.a;
			return name === 'smcp';
		case 1:
			var name = _var.a;
			return false;
		default:
			var name = _var.a;
			var index = _var.b;
			return (name === 'smcp') && (index === 1);
	}
};
var mdgriffith$elm_ui$Internal$Model$hasSmallCaps = function (typeface) {
	if (typeface.$ === 5) {
		var font = typeface.a;
		return A2(elm$core$List$any, mdgriffith$elm_ui$Internal$Model$isSmallCaps, font.eg);
	} else {
		return false;
	}
};
var mdgriffith$elm_ui$Internal$Model$renderProps = F3(
	function (force, _n0, existing) {
		var key = _n0.a;
		var val = _n0.b;
		return force ? (existing + ('\n  ' + (key + (': ' + (val + ' !important;'))))) : (existing + ('\n  ' + (key + (': ' + (val + ';')))));
	});
var mdgriffith$elm_ui$Internal$Model$bracket = F2(
	function (selector, rules) {
		var renderPair = function (_n0) {
			var name = _n0.a;
			var val = _n0.b;
			return name + (': ' + (val + ';'));
		};
		return selector + (' {' + (A2(
			elm$core$String$join,
			'',
			A2(elm$core$List$map, renderPair, rules)) + '}'));
	});
var mdgriffith$elm_ui$Internal$Model$fontRule = F3(
	function (name, modifier, _n0) {
		var parentAdj = _n0.a;
		var textAdjustment = _n0.b;
		return _List_fromArray(
			[
				A2(mdgriffith$elm_ui$Internal$Model$bracket, '.' + (name + ('.' + (modifier + (', ' + ('.' + (name + (' .' + modifier))))))), parentAdj),
				A2(mdgriffith$elm_ui$Internal$Model$bracket, '.' + (name + ('.' + (modifier + ('> .' + (mdgriffith$elm_ui$Internal$Style$classes.ec + (', .' + (name + (' .' + (modifier + (' > .' + mdgriffith$elm_ui$Internal$Style$classes.ec)))))))))), textAdjustment)
			]);
	});
var mdgriffith$elm_ui$Internal$Model$renderFontAdjustmentRule = F3(
	function (fontToAdjust, _n0, otherFontName) {
		var full = _n0.a;
		var capital = _n0.b;
		var name = _Utils_eq(fontToAdjust, otherFontName) ? fontToAdjust : (otherFontName + (' .' + fontToAdjust));
		return A2(
			elm$core$String$join,
			' ',
			_Utils_ap(
				A3(mdgriffith$elm_ui$Internal$Model$fontRule, name, mdgriffith$elm_ui$Internal$Style$classes.gZ, capital),
				A3(mdgriffith$elm_ui$Internal$Model$fontRule, name, mdgriffith$elm_ui$Internal$Style$classes.fF, full)));
	});
var mdgriffith$elm_ui$Internal$Model$renderNullAdjustmentRule = F2(
	function (fontToAdjust, otherFontName) {
		var name = _Utils_eq(fontToAdjust, otherFontName) ? fontToAdjust : (otherFontName + (' .' + fontToAdjust));
		return A2(
			elm$core$String$join,
			' ',
			_List_fromArray(
				[
					A2(
					mdgriffith$elm_ui$Internal$Model$bracket,
					'.' + (name + ('.' + (mdgriffith$elm_ui$Internal$Style$classes.gZ + (', ' + ('.' + (name + (' .' + mdgriffith$elm_ui$Internal$Style$classes.gZ))))))),
					_List_fromArray(
						[
							_Utils_Tuple2('line-height', '1')
						])),
					A2(
					mdgriffith$elm_ui$Internal$Model$bracket,
					'.' + (name + ('.' + (mdgriffith$elm_ui$Internal$Style$classes.gZ + ('> .' + (mdgriffith$elm_ui$Internal$Style$classes.ec + (', .' + (name + (' .' + (mdgriffith$elm_ui$Internal$Style$classes.gZ + (' > .' + mdgriffith$elm_ui$Internal$Style$classes.ec)))))))))),
					_List_fromArray(
						[
							_Utils_Tuple2('vertical-align', '0'),
							_Utils_Tuple2('line-height', '1')
						]))
				]));
	});
var elm$core$List$maximum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return elm$core$Maybe$Just(
			A3(elm$core$List$foldl, elm$core$Basics$max, x, xs));
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var elm$core$List$minimum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return elm$core$Maybe$Just(
			A3(elm$core$List$foldl, elm$core$Basics$min, x, xs));
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var mdgriffith$elm_ui$Internal$Model$adjust = F3(
	function (size, height, vertical) {
		return {fL: height / size, d7: size, eh: vertical};
	});
var mdgriffith$elm_ui$Internal$Model$convertAdjustment = function (adjustment) {
	var lines = _List_fromArray(
		[adjustment.eU, adjustment.eE, adjustment.fr, adjustment.f8]);
	var lineHeight = 1.5;
	var normalDescender = (lineHeight - 1) / 2;
	var oldMiddle = lineHeight / 2;
	var descender = A2(
		elm$core$Maybe$withDefault,
		adjustment.fr,
		elm$core$List$minimum(lines));
	var newBaseline = A2(
		elm$core$Maybe$withDefault,
		adjustment.eE,
		elm$core$List$minimum(
			A2(
				elm$core$List$filter,
				function (x) {
					return !_Utils_eq(x, descender);
				},
				lines)));
	var base = lineHeight;
	var ascender = A2(
		elm$core$Maybe$withDefault,
		adjustment.eU,
		elm$core$List$maximum(lines));
	var capitalSize = 1 / (ascender - newBaseline);
	var capitalVertical = 1 - ascender;
	var fullSize = 1 / (ascender - descender);
	var fullVertical = 1 - ascender;
	var newCapitalMiddle = ((ascender - newBaseline) / 2) + newBaseline;
	var newFullMiddle = ((ascender - descender) / 2) + descender;
	return {
		eU: A3(mdgriffith$elm_ui$Internal$Model$adjust, capitalSize, ascender - newBaseline, capitalVertical),
		dj: A3(mdgriffith$elm_ui$Internal$Model$adjust, fullSize, ascender - descender, fullVertical)
	};
};
var mdgriffith$elm_ui$Internal$Model$fontAdjustmentRules = function (converted) {
	return _Utils_Tuple2(
		_List_fromArray(
			[
				_Utils_Tuple2('display', 'block')
			]),
		_List_fromArray(
			[
				_Utils_Tuple2('display', 'inline-block'),
				_Utils_Tuple2(
				'line-height',
				elm$core$String$fromFloat(converted.fL)),
				_Utils_Tuple2(
				'vertical-align',
				elm$core$String$fromFloat(converted.eh) + 'em'),
				_Utils_Tuple2(
				'font-size',
				elm$core$String$fromFloat(converted.d7) + 'em')
			]));
};
var mdgriffith$elm_ui$Internal$Model$typefaceAdjustment = function (typefaces) {
	return A3(
		elm$core$List$foldl,
		F2(
			function (face, found) {
				if (found.$ === 1) {
					if (face.$ === 5) {
						var _with = face.a;
						var _n2 = _with.ep;
						if (_n2.$ === 1) {
							return found;
						} else {
							var adjustment = _n2.a;
							return elm$core$Maybe$Just(
								_Utils_Tuple2(
									mdgriffith$elm_ui$Internal$Model$fontAdjustmentRules(
										function ($) {
											return $.dj;
										}(
											mdgriffith$elm_ui$Internal$Model$convertAdjustment(adjustment))),
									mdgriffith$elm_ui$Internal$Model$fontAdjustmentRules(
										function ($) {
											return $.eU;
										}(
											mdgriffith$elm_ui$Internal$Model$convertAdjustment(adjustment)))));
						}
					} else {
						return found;
					}
				} else {
					return found;
				}
			}),
		elm$core$Maybe$Nothing,
		typefaces);
};
var mdgriffith$elm_ui$Internal$Model$renderTopLevelValues = function (rules) {
	var withImport = function (font) {
		if (font.$ === 4) {
			var url = font.b;
			return elm$core$Maybe$Just('@import url(\'' + (url + '\');'));
		} else {
			return elm$core$Maybe$Nothing;
		}
	};
	var fontImports = function (_n2) {
		var name = _n2.a;
		var typefaces = _n2.b;
		var imports = A2(
			elm$core$String$join,
			'\n',
			A2(elm$core$List$filterMap, withImport, typefaces));
		return imports;
	};
	var allNames = A2(elm$core$List$map, elm$core$Tuple$first, rules);
	var fontAdjustments = function (_n1) {
		var name = _n1.a;
		var typefaces = _n1.b;
		var _n0 = mdgriffith$elm_ui$Internal$Model$typefaceAdjustment(typefaces);
		if (_n0.$ === 1) {
			return A2(
				elm$core$String$join,
				'',
				A2(
					elm$core$List$map,
					mdgriffith$elm_ui$Internal$Model$renderNullAdjustmentRule(name),
					allNames));
		} else {
			var adjustment = _n0.a;
			return A2(
				elm$core$String$join,
				'',
				A2(
					elm$core$List$map,
					A2(mdgriffith$elm_ui$Internal$Model$renderFontAdjustmentRule, name, adjustment),
					allNames));
		}
	};
	return _Utils_ap(
		A2(
			elm$core$String$join,
			'\n',
			A2(elm$core$List$map, fontImports, rules)),
		A2(
			elm$core$String$join,
			'\n',
			A2(elm$core$List$map, fontAdjustments, rules)));
};
var mdgriffith$elm_ui$Internal$Model$renderVariant = function (_var) {
	switch (_var.$) {
		case 0:
			var name = _var.a;
			return '\"' + (name + '\"');
		case 1:
			var name = _var.a;
			return '\"' + (name + '\" 0');
		default:
			var name = _var.a;
			var index = _var.b;
			return '\"' + (name + ('\" ' + elm$core$String$fromInt(index)));
	}
};
var mdgriffith$elm_ui$Internal$Model$renderVariants = function (typeface) {
	if (typeface.$ === 5) {
		var font = typeface.a;
		return elm$core$Maybe$Just(
			A2(
				elm$core$String$join,
				', ',
				A2(elm$core$List$map, mdgriffith$elm_ui$Internal$Model$renderVariant, font.eg)));
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var mdgriffith$elm_ui$Internal$Model$topLevelValue = function (rule) {
	if (rule.$ === 1) {
		var name = rule.a;
		var typefaces = rule.b;
		return elm$core$Maybe$Just(
			_Utils_Tuple2(name, typefaces));
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var mdgriffith$elm_ui$Internal$Model$transformValue = function (transform) {
	switch (transform.$) {
		case 0:
			return elm$core$Maybe$Nothing;
		case 1:
			var _n1 = transform.a;
			var x = _n1.a;
			var y = _n1.b;
			var z = _n1.c;
			return elm$core$Maybe$Just(
				'translate3d(' + (elm$core$String$fromFloat(x) + ('px, ' + (elm$core$String$fromFloat(y) + ('px, ' + (elm$core$String$fromFloat(z) + 'px)'))))));
		default:
			var _n2 = transform.a;
			var tx = _n2.a;
			var ty = _n2.b;
			var tz = _n2.c;
			var _n3 = transform.b;
			var sx = _n3.a;
			var sy = _n3.b;
			var sz = _n3.c;
			var _n4 = transform.c;
			var ox = _n4.a;
			var oy = _n4.b;
			var oz = _n4.c;
			var angle = transform.d;
			var translate = 'translate3d(' + (elm$core$String$fromFloat(tx) + ('px, ' + (elm$core$String$fromFloat(ty) + ('px, ' + (elm$core$String$fromFloat(tz) + 'px)')))));
			var scale = 'scale3d(' + (elm$core$String$fromFloat(sx) + (', ' + (elm$core$String$fromFloat(sy) + (', ' + (elm$core$String$fromFloat(sz) + ')')))));
			var rotate = 'rotate3d(' + (elm$core$String$fromFloat(ox) + (', ' + (elm$core$String$fromFloat(oy) + (', ' + (elm$core$String$fromFloat(oz) + (', ' + (elm$core$String$fromFloat(angle) + 'rad)')))))));
			return elm$core$Maybe$Just(translate + (' ' + (scale + (' ' + rotate))));
	}
};
var mdgriffith$elm_ui$Internal$Model$toStyleSheetString = F2(
	function (options, stylesheet) {
		var renderStyle = F3(
			function (maybePseudo, selector, props) {
				if (maybePseudo.$ === 1) {
					return selector + ('{' + (A3(
						elm$core$List$foldl,
						mdgriffith$elm_ui$Internal$Model$renderProps(false),
						'',
						props) + '\n}'));
				} else {
					var pseudo = maybePseudo.a;
					switch (pseudo) {
						case 1:
							var _n17 = options.fO;
							switch (_n17) {
								case 0:
									return '';
								case 2:
									return selector + ('-hv {' + (A3(
										elm$core$List$foldl,
										mdgriffith$elm_ui$Internal$Model$renderProps(true),
										'',
										props) + '\n}'));
								default:
									return selector + ('-hv:hover {' + (A3(
										elm$core$List$foldl,
										mdgriffith$elm_ui$Internal$Model$renderProps(false),
										'',
										props) + '\n}'));
							}
						case 0:
							var renderedProps = A3(
								elm$core$List$foldl,
								mdgriffith$elm_ui$Internal$Model$renderProps(false),
								'',
								props);
							return A2(
								elm$core$String$join,
								'\n',
								_List_fromArray(
									[selector + ('-fs:focus {' + (renderedProps + '\n}')), '.' + (mdgriffith$elm_ui$Internal$Style$classes.eA + (':focus ~ ' + (selector + ('-fs:not(.focus)  {' + (renderedProps + '\n}'))))), '.' + (mdgriffith$elm_ui$Internal$Style$classes.eA + (':focus ' + (selector + ('-fs  {' + (renderedProps + '\n}'))))), '.focusable-parent:focus ~ ' + ('.' + (mdgriffith$elm_ui$Internal$Style$classes.eA + (' ' + (selector + ('-fs {' + (renderedProps + '\n}'))))))]));
						default:
							return selector + ('-act:active {' + (A3(
								elm$core$List$foldl,
								mdgriffith$elm_ui$Internal$Model$renderProps(false),
								'',
								props) + '\n}'));
					}
				}
			});
		var renderStyleRule = F2(
			function (rule, maybePseudo) {
				switch (rule.$) {
					case 0:
						var selector = rule.a;
						var props = rule.b;
						return A3(renderStyle, maybePseudo, selector, props);
					case 13:
						var name = rule.a;
						var prop = rule.b;
						return A3(
							renderStyle,
							maybePseudo,
							'.' + name,
							_List_fromArray(
								[
									A2(mdgriffith$elm_ui$Internal$Model$Property, 'box-shadow', prop)
								]));
					case 12:
						var name = rule.a;
						var transparency = rule.b;
						var opacity = A2(
							elm$core$Basics$max,
							0,
							A2(elm$core$Basics$min, 1, 1 - transparency));
						return A3(
							renderStyle,
							maybePseudo,
							'.' + name,
							_List_fromArray(
								[
									A2(
									mdgriffith$elm_ui$Internal$Model$Property,
									'opacity',
									elm$core$String$fromFloat(opacity))
								]));
					case 2:
						var i = rule.a;
						return A3(
							renderStyle,
							maybePseudo,
							'.font-size-' + elm$core$String$fromInt(i),
							_List_fromArray(
								[
									A2(
									mdgriffith$elm_ui$Internal$Model$Property,
									'font-size',
									elm$core$String$fromInt(i) + 'px')
								]));
					case 1:
						var name = rule.a;
						var typefaces = rule.b;
						var features = A2(
							elm$core$String$join,
							', ',
							A2(elm$core$List$filterMap, mdgriffith$elm_ui$Internal$Model$renderVariants, typefaces));
						var families = _List_fromArray(
							[
								A2(
								mdgriffith$elm_ui$Internal$Model$Property,
								'font-family',
								A2(
									elm$core$String$join,
									', ',
									A2(elm$core$List$map, mdgriffith$elm_ui$Internal$Model$fontName, typefaces))),
								A2(mdgriffith$elm_ui$Internal$Model$Property, 'font-feature-settings', features),
								A2(
								mdgriffith$elm_ui$Internal$Model$Property,
								'font-variant',
								A2(elm$core$List$any, mdgriffith$elm_ui$Internal$Model$hasSmallCaps, typefaces) ? 'small-caps' : 'normal')
							]);
						return A2(
							elm$core$String$join,
							' ',
							_List_fromArray(
								[
									A3(renderStyle, maybePseudo, '.' + name, families)
								]));
					case 3:
						var _class = rule.a;
						var prop = rule.b;
						var val = rule.c;
						return A3(
							renderStyle,
							maybePseudo,
							'.' + _class,
							_List_fromArray(
								[
									A2(mdgriffith$elm_ui$Internal$Model$Property, prop, val)
								]));
					case 4:
						var _class = rule.a;
						var prop = rule.b;
						var color = rule.c;
						return A3(
							renderStyle,
							maybePseudo,
							'.' + _class,
							_List_fromArray(
								[
									A2(
									mdgriffith$elm_ui$Internal$Model$Property,
									prop,
									mdgriffith$elm_ui$Internal$Model$formatColor(color))
								]));
					case 5:
						var cls = rule.a;
						var x = rule.b;
						var y = rule.c;
						var yPx = elm$core$String$fromInt(y) + 'px';
						var xPx = elm$core$String$fromInt(x) + 'px';
						var single = '.' + mdgriffith$elm_ui$Internal$Style$classes.gY;
						var row = '.' + mdgriffith$elm_ui$Internal$Style$classes.d$;
						var wrappedRow = '.' + (mdgriffith$elm_ui$Internal$Style$classes.c$ + row);
						var right = '.' + mdgriffith$elm_ui$Internal$Style$classes.c3;
						var paragraph = '.' + mdgriffith$elm_ui$Internal$Style$classes.dM;
						var page = '.' + mdgriffith$elm_ui$Internal$Style$classes.dK;
						var left = '.' + mdgriffith$elm_ui$Internal$Style$classes.c2;
						var halfY = elm$core$String$fromFloat(y / 2) + 'px';
						var halfX = elm$core$String$fromFloat(x / 2) + 'px';
						var column = '.' + mdgriffith$elm_ui$Internal$Style$classes.aw;
						var _class = '.' + cls;
						var any = '.' + mdgriffith$elm_ui$Internal$Style$classes.eA;
						return elm$core$String$concat(
							_List_fromArray(
								[
									A3(
									renderStyle,
									maybePseudo,
									_class + (row + (' > ' + (any + (' + ' + any)))),
									_List_fromArray(
										[
											A2(mdgriffith$elm_ui$Internal$Model$Property, 'margin-left', xPx)
										])),
									A3(
									renderStyle,
									maybePseudo,
									_class + (wrappedRow + (' > ' + any)),
									_List_fromArray(
										[
											A2(mdgriffith$elm_ui$Internal$Model$Property, 'margin', halfY + (' ' + halfX))
										])),
									A3(
									renderStyle,
									maybePseudo,
									_class + (column + (' > ' + (any + (' + ' + any)))),
									_List_fromArray(
										[
											A2(mdgriffith$elm_ui$Internal$Model$Property, 'margin-top', yPx)
										])),
									A3(
									renderStyle,
									maybePseudo,
									_class + (page + (' > ' + (any + (' + ' + any)))),
									_List_fromArray(
										[
											A2(mdgriffith$elm_ui$Internal$Model$Property, 'margin-top', yPx)
										])),
									A3(
									renderStyle,
									maybePseudo,
									_class + (page + (' > ' + left)),
									_List_fromArray(
										[
											A2(mdgriffith$elm_ui$Internal$Model$Property, 'margin-right', xPx)
										])),
									A3(
									renderStyle,
									maybePseudo,
									_class + (page + (' > ' + right)),
									_List_fromArray(
										[
											A2(mdgriffith$elm_ui$Internal$Model$Property, 'margin-left', xPx)
										])),
									A3(
									renderStyle,
									maybePseudo,
									_Utils_ap(_class, paragraph),
									_List_fromArray(
										[
											A2(
											mdgriffith$elm_ui$Internal$Model$Property,
											'line-height',
											'calc(1em + ' + (elm$core$String$fromInt(y) + 'px)'))
										])),
									A3(
									renderStyle,
									maybePseudo,
									'textarea' + _class,
									_List_fromArray(
										[
											A2(
											mdgriffith$elm_ui$Internal$Model$Property,
											'line-height',
											'calc(1em + ' + (elm$core$String$fromInt(y) + 'px)'))
										])),
									A3(
									renderStyle,
									maybePseudo,
									_class + (paragraph + (' > ' + left)),
									_List_fromArray(
										[
											A2(mdgriffith$elm_ui$Internal$Model$Property, 'margin-right', xPx)
										])),
									A3(
									renderStyle,
									maybePseudo,
									_class + (paragraph + (' > ' + right)),
									_List_fromArray(
										[
											A2(mdgriffith$elm_ui$Internal$Model$Property, 'margin-left', xPx)
										])),
									A3(
									renderStyle,
									maybePseudo,
									_class + (paragraph + '::after'),
									_List_fromArray(
										[
											A2(mdgriffith$elm_ui$Internal$Model$Property, 'content', '\'\''),
											A2(mdgriffith$elm_ui$Internal$Model$Property, 'display', 'block'),
											A2(mdgriffith$elm_ui$Internal$Model$Property, 'height', '0'),
											A2(mdgriffith$elm_ui$Internal$Model$Property, 'width', '0'),
											A2(
											mdgriffith$elm_ui$Internal$Model$Property,
											'margin-top',
											elm$core$String$fromInt((-1) * ((y / 2) | 0)) + 'px')
										])),
									A3(
									renderStyle,
									maybePseudo,
									_class + (paragraph + '::before'),
									_List_fromArray(
										[
											A2(mdgriffith$elm_ui$Internal$Model$Property, 'content', '\'\''),
											A2(mdgriffith$elm_ui$Internal$Model$Property, 'display', 'block'),
											A2(mdgriffith$elm_ui$Internal$Model$Property, 'height', '0'),
											A2(mdgriffith$elm_ui$Internal$Model$Property, 'width', '0'),
											A2(
											mdgriffith$elm_ui$Internal$Model$Property,
											'margin-bottom',
											elm$core$String$fromInt((-1) * ((y / 2) | 0)) + 'px')
										]))
								]));
					case 7:
						var cls = rule.a;
						var top = rule.b;
						var right = rule.c;
						var bottom = rule.d;
						var left = rule.e;
						var _class = '.' + cls;
						return A3(
							renderStyle,
							maybePseudo,
							_class,
							_List_fromArray(
								[
									A2(
									mdgriffith$elm_ui$Internal$Model$Property,
									'padding',
									elm$core$String$fromInt(top) + ('px ' + (elm$core$String$fromInt(right) + ('px ' + (elm$core$String$fromInt(bottom) + ('px ' + (elm$core$String$fromInt(left) + 'px')))))))
								]));
					case 6:
						var cls = rule.a;
						var top = rule.b;
						var right = rule.c;
						var bottom = rule.d;
						var left = rule.e;
						var _class = '.' + cls;
						return A3(
							renderStyle,
							maybePseudo,
							_class,
							_List_fromArray(
								[
									A2(
									mdgriffith$elm_ui$Internal$Model$Property,
									'border-width',
									elm$core$String$fromInt(top) + ('px ' + (elm$core$String$fromInt(right) + ('px ' + (elm$core$String$fromInt(bottom) + ('px ' + (elm$core$String$fromInt(left) + 'px')))))))
								]));
					case 8:
						var template = rule.a;
						var toGridLengthHelper = F3(
							function (minimum, maximum, x) {
								toGridLengthHelper:
								while (true) {
									switch (x.$) {
										case 0:
											var px = x.a;
											return elm$core$String$fromInt(px) + 'px';
										case 1:
											var _n2 = _Utils_Tuple2(minimum, maximum);
											if (_n2.a.$ === 1) {
												if (_n2.b.$ === 1) {
													var _n3 = _n2.a;
													var _n4 = _n2.b;
													return 'max-content';
												} else {
													var _n6 = _n2.a;
													var maxSize = _n2.b.a;
													return 'minmax(max-content, ' + (elm$core$String$fromInt(maxSize) + 'px)');
												}
											} else {
												if (_n2.b.$ === 1) {
													var minSize = _n2.a.a;
													var _n5 = _n2.b;
													return 'minmax(' + (elm$core$String$fromInt(minSize) + ('px, ' + 'max-content)'));
												} else {
													var minSize = _n2.a.a;
													var maxSize = _n2.b.a;
													return 'minmax(' + (elm$core$String$fromInt(minSize) + ('px, ' + (elm$core$String$fromInt(maxSize) + 'px)')));
												}
											}
										case 2:
											var i = x.a;
											var _n7 = _Utils_Tuple2(minimum, maximum);
											if (_n7.a.$ === 1) {
												if (_n7.b.$ === 1) {
													var _n8 = _n7.a;
													var _n9 = _n7.b;
													return elm$core$String$fromInt(i) + 'fr';
												} else {
													var _n11 = _n7.a;
													var maxSize = _n7.b.a;
													return 'minmax(max-content, ' + (elm$core$String$fromInt(maxSize) + 'px)');
												}
											} else {
												if (_n7.b.$ === 1) {
													var minSize = _n7.a.a;
													var _n10 = _n7.b;
													return 'minmax(' + (elm$core$String$fromInt(minSize) + ('px, ' + (elm$core$String$fromInt(i) + ('fr' + 'fr)'))));
												} else {
													var minSize = _n7.a.a;
													var maxSize = _n7.b.a;
													return 'minmax(' + (elm$core$String$fromInt(minSize) + ('px, ' + (elm$core$String$fromInt(maxSize) + 'px)')));
												}
											}
										case 3:
											var m = x.a;
											var len = x.b;
											var $temp$minimum = elm$core$Maybe$Just(m),
												$temp$maximum = maximum,
												$temp$x = len;
											minimum = $temp$minimum;
											maximum = $temp$maximum;
											x = $temp$x;
											continue toGridLengthHelper;
										default:
											var m = x.a;
											var len = x.b;
											var $temp$minimum = minimum,
												$temp$maximum = elm$core$Maybe$Just(m),
												$temp$x = len;
											minimum = $temp$minimum;
											maximum = $temp$maximum;
											x = $temp$x;
											continue toGridLengthHelper;
									}
								}
							});
						var toGridLength = function (x) {
							return A3(toGridLengthHelper, elm$core$Maybe$Nothing, elm$core$Maybe$Nothing, x);
						};
						var xSpacing = toGridLength(template.g0.a);
						var ySpacing = toGridLength(template.g0.b);
						var rows = function (x) {
							return 'grid-template-rows: ' + (x + ';');
						}(
							A2(
								elm$core$String$join,
								' ',
								A2(elm$core$List$map, toGridLength, template.gM)));
						var msRows = function (x) {
							return '-ms-grid-rows: ' + (x + ';');
						}(
							A2(
								elm$core$String$join,
								ySpacing,
								A2(elm$core$List$map, toGridLength, template.e6)));
						var msColumns = function (x) {
							return '-ms-grid-columns: ' + (x + ';');
						}(
							A2(
								elm$core$String$join,
								ySpacing,
								A2(elm$core$List$map, toGridLength, template.e6)));
						var gapY = 'grid-row-gap:' + (toGridLength(template.g0.b) + ';');
						var gapX = 'grid-column-gap:' + (toGridLength(template.g0.a) + ';');
						var columns = function (x) {
							return 'grid-template-columns: ' + (x + ';');
						}(
							A2(
								elm$core$String$join,
								' ',
								A2(elm$core$List$map, toGridLength, template.e6)));
						var _class = '.grid-rows-' + (A2(
							elm$core$String$join,
							'-',
							A2(elm$core$List$map, mdgriffith$elm_ui$Internal$Model$lengthClassName, template.gM)) + ('-cols-' + (A2(
							elm$core$String$join,
							'-',
							A2(elm$core$List$map, mdgriffith$elm_ui$Internal$Model$lengthClassName, template.e6)) + ('-space-x-' + (mdgriffith$elm_ui$Internal$Model$lengthClassName(template.g0.a) + ('-space-y-' + mdgriffith$elm_ui$Internal$Model$lengthClassName(template.g0.b)))))));
						var modernGrid = _class + ('{' + (columns + (rows + (gapX + (gapY + '}')))));
						var supports = '@supports (display:grid) {' + (modernGrid + '}');
						var base = _class + ('{' + (msColumns + (msRows + '}')));
						return _Utils_ap(base, supports);
					case 9:
						var position = rule.a;
						var msPosition = A2(
							elm$core$String$join,
							' ',
							_List_fromArray(
								[
									'-ms-grid-row: ' + (elm$core$String$fromInt(position.d$) + ';'),
									'-ms-grid-row-span: ' + (elm$core$String$fromInt(position.fL) + ';'),
									'-ms-grid-column: ' + (elm$core$String$fromInt(position.c7) + ';'),
									'-ms-grid-column-span: ' + (elm$core$String$fromInt(position.hL) + ';')
								]));
						var modernPosition = A2(
							elm$core$String$join,
							' ',
							_List_fromArray(
								[
									'grid-row: ' + (elm$core$String$fromInt(position.d$) + (' / ' + (elm$core$String$fromInt(position.d$ + position.fL) + ';'))),
									'grid-column: ' + (elm$core$String$fromInt(position.c7) + (' / ' + (elm$core$String$fromInt(position.c7 + position.hL) + ';')))
								]));
						var _class = '.grid-pos-' + (elm$core$String$fromInt(position.d$) + ('-' + (elm$core$String$fromInt(position.c7) + ('-' + (elm$core$String$fromInt(position.hL) + ('-' + elm$core$String$fromInt(position.fL)))))));
						var modernGrid = _class + ('{' + (modernPosition + '}'));
						var supports = '@supports (display:grid) {' + (modernGrid + '}');
						var base = _class + ('{' + (msPosition + '}'));
						return _Utils_ap(base, supports);
					case 11:
						var _class = rule.a;
						var styles = rule.b;
						var renderPseudoRule = function (style) {
							return A2(
								renderStyleRule,
								style,
								elm$core$Maybe$Just(_class));
						};
						return A2(
							elm$core$String$join,
							' ',
							A2(elm$core$List$map, renderPseudoRule, styles));
					default:
						var transform = rule.a;
						var val = mdgriffith$elm_ui$Internal$Model$transformValue(transform);
						var _class = mdgriffith$elm_ui$Internal$Model$transformClass(transform);
						var _n12 = _Utils_Tuple2(_class, val);
						if ((!_n12.a.$) && (!_n12.b.$)) {
							var cls = _n12.a.a;
							var v = _n12.b.a;
							return A3(
								renderStyle,
								maybePseudo,
								'.' + cls,
								_List_fromArray(
									[
										A2(mdgriffith$elm_ui$Internal$Model$Property, 'transform', v)
									]));
						} else {
							return '';
						}
				}
			});
		var combine = F2(
			function (style, rendered) {
				return {
					ch: _Utils_ap(
						rendered.ch,
						A2(renderStyleRule, style, elm$core$Maybe$Nothing)),
					bL: function () {
						var _n14 = mdgriffith$elm_ui$Internal$Model$topLevelValue(style);
						if (_n14.$ === 1) {
							return rendered.bL;
						} else {
							var topLevel = _n14.a;
							return A2(elm$core$List$cons, topLevel, rendered.bL);
						}
					}()
				};
			});
		var _n13 = A3(
			elm$core$List$foldl,
			combine,
			{ch: '', bL: _List_Nil},
			stylesheet);
		var topLevel = _n13.bL;
		var rules = _n13.ch;
		return _Utils_ap(
			mdgriffith$elm_ui$Internal$Model$renderTopLevelValues(topLevel),
			rules);
	});
var mdgriffith$elm_ui$Internal$Model$toStyleSheet = F2(
	function (options, styleSheet) {
		return A3(
			elm$virtual_dom$VirtualDom$node,
			'style',
			_List_Nil,
			_List_fromArray(
				[
					elm$virtual_dom$VirtualDom$text(
					A2(mdgriffith$elm_ui$Internal$Model$toStyleSheetString, options, styleSheet))
				]));
	});
var mdgriffith$elm_ui$Internal$Model$embedKeyed = F4(
	function (_static, opts, styles, children) {
		return _static ? A2(
			elm$core$List$cons,
			_Utils_Tuple2('static-stylesheet', mdgriffith$elm_ui$Internal$Model$staticRoot),
			A2(
				elm$core$List$cons,
				_Utils_Tuple2(
					'dynamic-stylesheet',
					A2(
						mdgriffith$elm_ui$Internal$Model$toStyleSheet,
						opts,
						A3(
							elm$core$List$foldl,
							mdgriffith$elm_ui$Internal$Model$reduceStyles,
							_Utils_Tuple2(
								elm$core$Set$empty,
								_List_fromArray(
									[
										mdgriffith$elm_ui$Internal$Model$renderFocusStyle(opts.fC)
									])),
							styles).b)),
				children)) : A2(
			elm$core$List$cons,
			_Utils_Tuple2(
				'dynamic-stylesheet',
				A2(
					mdgriffith$elm_ui$Internal$Model$toStyleSheet,
					opts,
					A3(
						elm$core$List$foldl,
						mdgriffith$elm_ui$Internal$Model$reduceStyles,
						_Utils_Tuple2(
							elm$core$Set$empty,
							_List_fromArray(
								[
									mdgriffith$elm_ui$Internal$Model$renderFocusStyle(opts.fC)
								])),
						styles).b)),
			children);
	});
var mdgriffith$elm_ui$Internal$Model$embedWith = F4(
	function (_static, opts, styles, children) {
		return _static ? A2(
			elm$core$List$cons,
			mdgriffith$elm_ui$Internal$Model$staticRoot,
			A2(
				elm$core$List$cons,
				A2(
					mdgriffith$elm_ui$Internal$Model$toStyleSheet,
					opts,
					A3(
						elm$core$List$foldl,
						mdgriffith$elm_ui$Internal$Model$reduceStyles,
						_Utils_Tuple2(
							elm$core$Set$empty,
							_List_fromArray(
								[
									mdgriffith$elm_ui$Internal$Model$renderFocusStyle(opts.fC)
								])),
						styles).b),
				children)) : A2(
			elm$core$List$cons,
			A2(
				mdgriffith$elm_ui$Internal$Model$toStyleSheet,
				opts,
				A3(
					elm$core$List$foldl,
					mdgriffith$elm_ui$Internal$Model$reduceStyles,
					_Utils_Tuple2(
						elm$core$Set$empty,
						_List_fromArray(
							[
								mdgriffith$elm_ui$Internal$Model$renderFocusStyle(opts.fC)
							])),
					styles).b),
			children);
	});
var mdgriffith$elm_ui$Internal$Model$finalizeNode = F6(
	function (has, node, attributes, children, embedMode, parentContext) {
		var createNode = F2(
			function (nodeName, attrs) {
				if (children.$ === 1) {
					var keyed = children.a;
					return A3(
						elm$virtual_dom$VirtualDom$keyedNode,
						nodeName,
						attrs,
						function () {
							switch (embedMode.$) {
								case 0:
									return keyed;
								case 2:
									var opts = embedMode.a;
									var styles = embedMode.b;
									return A4(mdgriffith$elm_ui$Internal$Model$embedKeyed, false, opts, styles, keyed);
								default:
									var opts = embedMode.a;
									var styles = embedMode.b;
									return A4(mdgriffith$elm_ui$Internal$Model$embedKeyed, true, opts, styles, keyed);
							}
						}());
				} else {
					var unkeyed = children.a;
					return A2(
						function () {
							switch (nodeName) {
								case 'div':
									return elm$html$Html$div;
								case 'p':
									return elm$html$Html$p;
								default:
									return elm$virtual_dom$VirtualDom$node(nodeName);
							}
						}(),
						attrs,
						function () {
							switch (embedMode.$) {
								case 0:
									return unkeyed;
								case 2:
									var opts = embedMode.a;
									var styles = embedMode.b;
									return A4(mdgriffith$elm_ui$Internal$Model$embedWith, false, opts, styles, unkeyed);
								default:
									var opts = embedMode.a;
									var styles = embedMode.b;
									return A4(mdgriffith$elm_ui$Internal$Model$embedWith, true, opts, styles, unkeyed);
							}
						}());
				}
			});
		var html = function () {
			switch (node.$) {
				case 0:
					return A2(createNode, 'div', attributes);
				case 1:
					var nodeName = node.a;
					return A2(createNode, nodeName, attributes);
				default:
					var nodeName = node.a;
					var internal = node.b;
					return A3(
						elm$virtual_dom$VirtualDom$node,
						nodeName,
						attributes,
						_List_fromArray(
							[
								A2(
								createNode,
								internal,
								_List_fromArray(
									[
										elm$html$Html$Attributes$class(mdgriffith$elm_ui$Internal$Style$classes.eA + (' ' + mdgriffith$elm_ui$Internal$Style$classes.gY))
									]))
							]));
			}
		}();
		switch (parentContext) {
			case 0:
				return (A2(mdgriffith$elm_ui$Internal$Flag$present, mdgriffith$elm_ui$Internal$Flag$widthFill, has) && (!A2(mdgriffith$elm_ui$Internal$Flag$present, mdgriffith$elm_ui$Internal$Flag$widthBetween, has))) ? html : (A2(mdgriffith$elm_ui$Internal$Flag$present, mdgriffith$elm_ui$Internal$Flag$alignRight, has) ? A2(
					elm$html$Html$u,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class(
							A2(
								elm$core$String$join,
								' ',
								_List_fromArray(
									[mdgriffith$elm_ui$Internal$Style$classes.eA, mdgriffith$elm_ui$Internal$Style$classes.gY, mdgriffith$elm_ui$Internal$Style$classes.bU, mdgriffith$elm_ui$Internal$Style$classes.ax, mdgriffith$elm_ui$Internal$Style$classes.ew])))
						]),
					_List_fromArray(
						[html])) : (A2(mdgriffith$elm_ui$Internal$Flag$present, mdgriffith$elm_ui$Internal$Flag$centerX, has) ? A2(
					elm$html$Html$s,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class(
							A2(
								elm$core$String$join,
								' ',
								_List_fromArray(
									[mdgriffith$elm_ui$Internal$Style$classes.eA, mdgriffith$elm_ui$Internal$Style$classes.gY, mdgriffith$elm_ui$Internal$Style$classes.bU, mdgriffith$elm_ui$Internal$Style$classes.ax, mdgriffith$elm_ui$Internal$Style$classes.eu])))
						]),
					_List_fromArray(
						[html])) : html));
			case 1:
				return (A2(mdgriffith$elm_ui$Internal$Flag$present, mdgriffith$elm_ui$Internal$Flag$heightFill, has) && (!A2(mdgriffith$elm_ui$Internal$Flag$present, mdgriffith$elm_ui$Internal$Flag$heightBetween, has))) ? html : (A2(mdgriffith$elm_ui$Internal$Flag$present, mdgriffith$elm_ui$Internal$Flag$centerY, has) ? A2(
					elm$html$Html$s,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class(
							A2(
								elm$core$String$join,
								' ',
								_List_fromArray(
									[mdgriffith$elm_ui$Internal$Style$classes.eA, mdgriffith$elm_ui$Internal$Style$classes.gY, mdgriffith$elm_ui$Internal$Style$classes.bU, mdgriffith$elm_ui$Internal$Style$classes.ev])))
						]),
					_List_fromArray(
						[html])) : (A2(mdgriffith$elm_ui$Internal$Flag$present, mdgriffith$elm_ui$Internal$Flag$alignBottom, has) ? A2(
					elm$html$Html$u,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class(
							A2(
								elm$core$String$join,
								' ',
								_List_fromArray(
									[mdgriffith$elm_ui$Internal$Style$classes.eA, mdgriffith$elm_ui$Internal$Style$classes.gY, mdgriffith$elm_ui$Internal$Style$classes.bU, mdgriffith$elm_ui$Internal$Style$classes.et])))
						]),
					_List_fromArray(
						[html])) : html));
			default:
				return html;
		}
	});
var elm$html$Html$text = elm$virtual_dom$VirtualDom$text;
var mdgriffith$elm_ui$Internal$Model$textElement = function (str) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class(
				A2(
					elm$core$String$join,
					' ',
					_List_fromArray(
						[mdgriffith$elm_ui$Internal$Style$classes.eA, mdgriffith$elm_ui$Internal$Style$classes.ec, mdgriffith$elm_ui$Internal$Style$classes.cY, mdgriffith$elm_ui$Internal$Style$classes.b3])))
			]),
		_List_fromArray(
			[
				elm$html$Html$text(str)
			]));
};
var mdgriffith$elm_ui$Internal$Model$textElementFill = function (str) {
	return A3(
		elm$virtual_dom$VirtualDom$node,
		'div',
		_List_fromArray(
			[
				elm$html$Html$Attributes$class(
				A2(
					elm$core$String$join,
					' ',
					_List_fromArray(
						[mdgriffith$elm_ui$Internal$Style$classes.eA, mdgriffith$elm_ui$Internal$Style$classes.ec, mdgriffith$elm_ui$Internal$Style$classes.cZ, mdgriffith$elm_ui$Internal$Style$classes.cI])))
			]),
		_List_fromArray(
			[
				elm$virtual_dom$VirtualDom$text(str)
			]));
};
var mdgriffith$elm_ui$Internal$Model$createElement = F3(
	function (context, children, rendered) {
		var gatherKeyed = F2(
			function (_n8, _n9) {
				var key = _n8.a;
				var child = _n8.b;
				var htmls = _n9.a;
				var existingStyles = _n9.b;
				switch (child.$) {
					case 0:
						var html = child.a;
						return _Utils_eq(context, mdgriffith$elm_ui$Internal$Model$asParagraph) ? _Utils_Tuple2(
							A2(
								elm$core$List$cons,
								_Utils_Tuple2(
									key,
									html(context)),
								htmls),
							existingStyles) : _Utils_Tuple2(
							A2(
								elm$core$List$cons,
								_Utils_Tuple2(
									key,
									html(context)),
								htmls),
							existingStyles);
					case 1:
						var styled = child.a;
						return _Utils_eq(context, mdgriffith$elm_ui$Internal$Model$asParagraph) ? _Utils_Tuple2(
							A2(
								elm$core$List$cons,
								_Utils_Tuple2(
									key,
									A2(styled.fP, mdgriffith$elm_ui$Internal$Model$NoStyleSheet, context)),
								htmls),
							elm$core$List$isEmpty(existingStyles) ? styled.g9 : _Utils_ap(styled.g9, existingStyles)) : _Utils_Tuple2(
							A2(
								elm$core$List$cons,
								_Utils_Tuple2(
									key,
									A2(styled.fP, mdgriffith$elm_ui$Internal$Model$NoStyleSheet, context)),
								htmls),
							elm$core$List$isEmpty(existingStyles) ? styled.g9 : _Utils_ap(styled.g9, existingStyles));
					case 2:
						var str = child.a;
						return _Utils_Tuple2(
							A2(
								elm$core$List$cons,
								_Utils_Tuple2(
									key,
									_Utils_eq(context, mdgriffith$elm_ui$Internal$Model$asEl) ? mdgriffith$elm_ui$Internal$Model$textElementFill(str) : mdgriffith$elm_ui$Internal$Model$textElement(str)),
								htmls),
							existingStyles);
					default:
						return _Utils_Tuple2(htmls, existingStyles);
				}
			});
		var gather = F2(
			function (child, _n6) {
				var htmls = _n6.a;
				var existingStyles = _n6.b;
				switch (child.$) {
					case 0:
						var html = child.a;
						return _Utils_eq(context, mdgriffith$elm_ui$Internal$Model$asParagraph) ? _Utils_Tuple2(
							A2(
								elm$core$List$cons,
								html(context),
								htmls),
							existingStyles) : _Utils_Tuple2(
							A2(
								elm$core$List$cons,
								html(context),
								htmls),
							existingStyles);
					case 1:
						var styled = child.a;
						return _Utils_eq(context, mdgriffith$elm_ui$Internal$Model$asParagraph) ? _Utils_Tuple2(
							A2(
								elm$core$List$cons,
								A2(styled.fP, mdgriffith$elm_ui$Internal$Model$NoStyleSheet, context),
								htmls),
							elm$core$List$isEmpty(existingStyles) ? styled.g9 : _Utils_ap(styled.g9, existingStyles)) : _Utils_Tuple2(
							A2(
								elm$core$List$cons,
								A2(styled.fP, mdgriffith$elm_ui$Internal$Model$NoStyleSheet, context),
								htmls),
							elm$core$List$isEmpty(existingStyles) ? styled.g9 : _Utils_ap(styled.g9, existingStyles));
					case 2:
						var str = child.a;
						return _Utils_Tuple2(
							A2(
								elm$core$List$cons,
								_Utils_eq(context, mdgriffith$elm_ui$Internal$Model$asEl) ? mdgriffith$elm_ui$Internal$Model$textElementFill(str) : mdgriffith$elm_ui$Internal$Model$textElement(str),
								htmls),
							existingStyles);
					default:
						return _Utils_Tuple2(htmls, existingStyles);
				}
			});
		if (children.$ === 1) {
			var keyedChildren = children.a;
			var _n1 = A3(
				elm$core$List$foldr,
				gatherKeyed,
				_Utils_Tuple2(_List_Nil, _List_Nil),
				keyedChildren);
			var keyed = _n1.a;
			var styles = _n1.b;
			var newStyles = elm$core$List$isEmpty(styles) ? rendered.g9 : _Utils_ap(rendered.g9, styles);
			if (!newStyles.b) {
				return mdgriffith$elm_ui$Internal$Model$Unstyled(
					A5(
						mdgriffith$elm_ui$Internal$Model$finalizeNode,
						rendered.aX,
						rendered.a4,
						rendered.aQ,
						mdgriffith$elm_ui$Internal$Model$Keyed(
							A3(mdgriffith$elm_ui$Internal$Model$addKeyedChildren, 'nearby-element-pls', keyed, rendered.aR)),
						mdgriffith$elm_ui$Internal$Model$NoStyleSheet));
			} else {
				var allStyles = newStyles;
				return mdgriffith$elm_ui$Internal$Model$Styled(
					{
						fP: A4(
							mdgriffith$elm_ui$Internal$Model$finalizeNode,
							rendered.aX,
							rendered.a4,
							rendered.aQ,
							mdgriffith$elm_ui$Internal$Model$Keyed(
								A3(mdgriffith$elm_ui$Internal$Model$addKeyedChildren, 'nearby-element-pls', keyed, rendered.aR))),
						g9: allStyles
					});
			}
		} else {
			var unkeyedChildren = children.a;
			var _n3 = A3(
				elm$core$List$foldr,
				gather,
				_Utils_Tuple2(_List_Nil, _List_Nil),
				unkeyedChildren);
			var unkeyed = _n3.a;
			var styles = _n3.b;
			var newStyles = elm$core$List$isEmpty(styles) ? rendered.g9 : _Utils_ap(rendered.g9, styles);
			if (!newStyles.b) {
				return mdgriffith$elm_ui$Internal$Model$Unstyled(
					A5(
						mdgriffith$elm_ui$Internal$Model$finalizeNode,
						rendered.aX,
						rendered.a4,
						rendered.aQ,
						mdgriffith$elm_ui$Internal$Model$Unkeyed(
							A2(mdgriffith$elm_ui$Internal$Model$addChildren, unkeyed, rendered.aR)),
						mdgriffith$elm_ui$Internal$Model$NoStyleSheet));
			} else {
				var allStyles = newStyles;
				return mdgriffith$elm_ui$Internal$Model$Styled(
					{
						fP: A4(
							mdgriffith$elm_ui$Internal$Model$finalizeNode,
							rendered.aX,
							rendered.a4,
							rendered.aQ,
							mdgriffith$elm_ui$Internal$Model$Unkeyed(
								A2(mdgriffith$elm_ui$Internal$Model$addChildren, unkeyed, rendered.aR))),
						g9: allStyles
					});
			}
		}
	});
var elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var elm$core$Bitwise$or = _Bitwise_or;
var mdgriffith$elm_ui$Internal$Flag$add = F2(
	function (myFlag, _n0) {
		var one = _n0.a;
		var two = _n0.b;
		if (!myFlag.$) {
			var first = myFlag.a;
			return A2(mdgriffith$elm_ui$Internal$Flag$Field, first | one, two);
		} else {
			var second = myFlag.a;
			return A2(mdgriffith$elm_ui$Internal$Flag$Field, one, second | two);
		}
	});
var mdgriffith$elm_ui$Internal$Flag$height = mdgriffith$elm_ui$Internal$Flag$flag(7);
var mdgriffith$elm_ui$Internal$Flag$heightContent = mdgriffith$elm_ui$Internal$Flag$flag(36);
var mdgriffith$elm_ui$Internal$Flag$merge = F2(
	function (_n0, _n1) {
		var one = _n0.a;
		var two = _n0.b;
		var three = _n1.a;
		var four = _n1.b;
		return A2(mdgriffith$elm_ui$Internal$Flag$Field, one | three, two | four);
	});
var mdgriffith$elm_ui$Internal$Flag$width = mdgriffith$elm_ui$Internal$Flag$flag(6);
var mdgriffith$elm_ui$Internal$Flag$widthContent = mdgriffith$elm_ui$Internal$Flag$flag(38);
var mdgriffith$elm_ui$Internal$Flag$xAlign = mdgriffith$elm_ui$Internal$Flag$flag(30);
var mdgriffith$elm_ui$Internal$Flag$yAlign = mdgriffith$elm_ui$Internal$Flag$flag(29);
var mdgriffith$elm_ui$Internal$Model$Embedded = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var mdgriffith$elm_ui$Internal$Model$NodeName = function (a) {
	return {$: 1, a: a};
};
var mdgriffith$elm_ui$Internal$Model$Transform = function (a) {
	return {$: 10, a: a};
};
var mdgriffith$elm_ui$Internal$Model$ChildrenBehind = function (a) {
	return {$: 1, a: a};
};
var mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var mdgriffith$elm_ui$Internal$Model$ChildrenInFront = function (a) {
	return {$: 2, a: a};
};
var mdgriffith$elm_ui$Internal$Model$nearbyElement = F2(
	function (location, elem) {
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class(
					function () {
						switch (location) {
							case 0:
								return A2(
									elm$core$String$join,
									' ',
									_List_fromArray(
										[mdgriffith$elm_ui$Internal$Style$classes.bi, mdgriffith$elm_ui$Internal$Style$classes.gY, mdgriffith$elm_ui$Internal$Style$classes.en]));
							case 1:
								return A2(
									elm$core$String$join,
									' ',
									_List_fromArray(
										[mdgriffith$elm_ui$Internal$Style$classes.bi, mdgriffith$elm_ui$Internal$Style$classes.gY, mdgriffith$elm_ui$Internal$Style$classes.eG]));
							case 2:
								return A2(
									elm$core$String$join,
									' ',
									_List_fromArray(
										[mdgriffith$elm_ui$Internal$Style$classes.bi, mdgriffith$elm_ui$Internal$Style$classes.gY, mdgriffith$elm_ui$Internal$Style$classes.gr]));
							case 3:
								return A2(
									elm$core$String$join,
									' ',
									_List_fromArray(
										[mdgriffith$elm_ui$Internal$Style$classes.bi, mdgriffith$elm_ui$Internal$Style$classes.gY, mdgriffith$elm_ui$Internal$Style$classes.gp]));
							case 4:
								return A2(
									elm$core$String$join,
									' ',
									_List_fromArray(
										[mdgriffith$elm_ui$Internal$Style$classes.bi, mdgriffith$elm_ui$Internal$Style$classes.gY, mdgriffith$elm_ui$Internal$Style$classes.fX]));
							default:
								return A2(
									elm$core$String$join,
									' ',
									_List_fromArray(
										[mdgriffith$elm_ui$Internal$Style$classes.bi, mdgriffith$elm_ui$Internal$Style$classes.gY, mdgriffith$elm_ui$Internal$Style$classes.eF]));
						}
					}())
				]),
			_List_fromArray(
				[
					function () {
					switch (elem.$) {
						case 3:
							return elm$virtual_dom$VirtualDom$text('');
						case 2:
							var str = elem.a;
							return mdgriffith$elm_ui$Internal$Model$textElement(str);
						case 0:
							var html = elem.a;
							return html(mdgriffith$elm_ui$Internal$Model$asEl);
						default:
							var styled = elem.a;
							return A2(styled.fP, mdgriffith$elm_ui$Internal$Model$NoStyleSheet, mdgriffith$elm_ui$Internal$Model$asEl);
					}
				}()
				]));
	});
var mdgriffith$elm_ui$Internal$Model$addNearbyElement = F3(
	function (location, elem, existing) {
		var nearby = A2(mdgriffith$elm_ui$Internal$Model$nearbyElement, location, elem);
		switch (existing.$) {
			case 0:
				if (location === 5) {
					return mdgriffith$elm_ui$Internal$Model$ChildrenBehind(
						_List_fromArray(
							[nearby]));
				} else {
					return mdgriffith$elm_ui$Internal$Model$ChildrenInFront(
						_List_fromArray(
							[nearby]));
				}
			case 1:
				var existingBehind = existing.a;
				if (location === 5) {
					return mdgriffith$elm_ui$Internal$Model$ChildrenBehind(
						A2(elm$core$List$cons, nearby, existingBehind));
				} else {
					return A2(
						mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront,
						existingBehind,
						_List_fromArray(
							[nearby]));
				}
			case 2:
				var existingInFront = existing.a;
				if (location === 5) {
					return A2(
						mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront,
						_List_fromArray(
							[nearby]),
						existingInFront);
				} else {
					return mdgriffith$elm_ui$Internal$Model$ChildrenInFront(
						A2(elm$core$List$cons, nearby, existingInFront));
				}
			default:
				var existingBehind = existing.a;
				var existingInFront = existing.b;
				if (location === 5) {
					return A2(
						mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront,
						A2(elm$core$List$cons, nearby, existingBehind),
						existingInFront);
				} else {
					return A2(
						mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront,
						existingBehind,
						A2(elm$core$List$cons, nearby, existingInFront));
				}
		}
	});
var mdgriffith$elm_ui$Internal$Model$addNodeName = F2(
	function (newNode, old) {
		switch (old.$) {
			case 0:
				return mdgriffith$elm_ui$Internal$Model$NodeName(newNode);
			case 1:
				var name = old.a;
				return A2(mdgriffith$elm_ui$Internal$Model$Embedded, name, newNode);
			default:
				var x = old.a;
				var y = old.b;
				return A2(mdgriffith$elm_ui$Internal$Model$Embedded, x, y);
		}
	});
var mdgriffith$elm_ui$Internal$Model$alignXName = function (align) {
	switch (align) {
		case 0:
			return mdgriffith$elm_ui$Internal$Style$classes.co + (' ' + mdgriffith$elm_ui$Internal$Style$classes.c2);
		case 2:
			return mdgriffith$elm_ui$Internal$Style$classes.co + (' ' + mdgriffith$elm_ui$Internal$Style$classes.c3);
		default:
			return mdgriffith$elm_ui$Internal$Style$classes.co + (' ' + mdgriffith$elm_ui$Internal$Style$classes.er);
	}
};
var mdgriffith$elm_ui$Internal$Model$alignYName = function (align) {
	switch (align) {
		case 0:
			return mdgriffith$elm_ui$Internal$Style$classes.cp + (' ' + mdgriffith$elm_ui$Internal$Style$classes.ex);
		case 2:
			return mdgriffith$elm_ui$Internal$Style$classes.cp + (' ' + mdgriffith$elm_ui$Internal$Style$classes.eq);
		default:
			return mdgriffith$elm_ui$Internal$Style$classes.cp + (' ' + mdgriffith$elm_ui$Internal$Style$classes.es);
	}
};
var mdgriffith$elm_ui$Internal$Model$FullTransform = F4(
	function (a, b, c, d) {
		return {$: 2, a: a, b: b, c: c, d: d};
	});
var mdgriffith$elm_ui$Internal$Model$Moved = function (a) {
	return {$: 1, a: a};
};
var mdgriffith$elm_ui$Internal$Model$composeTransformation = F2(
	function (transform, component) {
		switch (transform.$) {
			case 0:
				switch (component.$) {
					case 0:
						var x = component.a;
						return mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(x, 0, 0));
					case 1:
						var y = component.a;
						return mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(0, y, 0));
					case 2:
						var z = component.a;
						return mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(0, 0, z));
					case 3:
						var xyz = component.a;
						return mdgriffith$elm_ui$Internal$Model$Moved(xyz);
					case 4:
						var xyz = component.a;
						var angle = component.b;
						return A4(
							mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(0, 0, 0),
							_Utils_Tuple3(1, 1, 1),
							xyz,
							angle);
					default:
						var xyz = component.a;
						return A4(
							mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(0, 0, 0),
							xyz,
							_Utils_Tuple3(0, 0, 1),
							0);
				}
			case 1:
				var moved = transform.a;
				var x = moved.a;
				var y = moved.b;
				var z = moved.c;
				switch (component.$) {
					case 0:
						var newX = component.a;
						return mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(newX, y, z));
					case 1:
						var newY = component.a;
						return mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(x, newY, z));
					case 2:
						var newZ = component.a;
						return mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(x, y, newZ));
					case 3:
						var xyz = component.a;
						return mdgriffith$elm_ui$Internal$Model$Moved(xyz);
					case 4:
						var xyz = component.a;
						var angle = component.b;
						return A4(
							mdgriffith$elm_ui$Internal$Model$FullTransform,
							moved,
							_Utils_Tuple3(1, 1, 1),
							xyz,
							angle);
					default:
						var scale = component.a;
						return A4(
							mdgriffith$elm_ui$Internal$Model$FullTransform,
							moved,
							scale,
							_Utils_Tuple3(0, 0, 1),
							0);
				}
			default:
				var moved = transform.a;
				var x = moved.a;
				var y = moved.b;
				var z = moved.c;
				var scaled = transform.b;
				var origin = transform.c;
				var angle = transform.d;
				switch (component.$) {
					case 0:
						var newX = component.a;
						return A4(
							mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(newX, y, z),
							scaled,
							origin,
							angle);
					case 1:
						var newY = component.a;
						return A4(
							mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(x, newY, z),
							scaled,
							origin,
							angle);
					case 2:
						var newZ = component.a;
						return A4(
							mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(x, y, newZ),
							scaled,
							origin,
							angle);
					case 3:
						var newMove = component.a;
						return A4(mdgriffith$elm_ui$Internal$Model$FullTransform, newMove, scaled, origin, angle);
					case 4:
						var newOrigin = component.a;
						var newAngle = component.b;
						return A4(mdgriffith$elm_ui$Internal$Model$FullTransform, moved, scaled, newOrigin, newAngle);
					default:
						var newScale = component.a;
						return A4(mdgriffith$elm_ui$Internal$Model$FullTransform, moved, newScale, origin, angle);
				}
		}
	});
var mdgriffith$elm_ui$Internal$Model$renderHeight = function (h) {
	switch (h.$) {
		case 0:
			var px = h.a;
			var val = elm$core$String$fromInt(px);
			var name = 'height-px-' + val;
			return _Utils_Tuple3(
				mdgriffith$elm_ui$Internal$Flag$none,
				name,
				_List_fromArray(
					[
						A3(mdgriffith$elm_ui$Internal$Model$Single, name, 'height', val + 'px')
					]));
		case 1:
			return _Utils_Tuple3(
				A2(mdgriffith$elm_ui$Internal$Flag$add, mdgriffith$elm_ui$Internal$Flag$heightContent, mdgriffith$elm_ui$Internal$Flag$none),
				mdgriffith$elm_ui$Internal$Style$classes.b3,
				_List_Nil);
		case 2:
			var portion = h.a;
			return (portion === 1) ? _Utils_Tuple3(
				A2(mdgriffith$elm_ui$Internal$Flag$add, mdgriffith$elm_ui$Internal$Flag$heightFill, mdgriffith$elm_ui$Internal$Flag$none),
				mdgriffith$elm_ui$Internal$Style$classes.cI,
				_List_Nil) : _Utils_Tuple3(
				A2(mdgriffith$elm_ui$Internal$Flag$add, mdgriffith$elm_ui$Internal$Flag$heightFill, mdgriffith$elm_ui$Internal$Flag$none),
				mdgriffith$elm_ui$Internal$Style$classes.$7 + (' height-fill-' + elm$core$String$fromInt(portion)),
				_List_fromArray(
					[
						A3(
						mdgriffith$elm_ui$Internal$Model$Single,
						mdgriffith$elm_ui$Internal$Style$classes.eA + ('.' + (mdgriffith$elm_ui$Internal$Style$classes.d$ + (' > ' + mdgriffith$elm_ui$Internal$Style$dot(
							'height-fill-' + elm$core$String$fromInt(portion))))),
						'flex-grow',
						elm$core$String$fromInt(portion * 100000))
					]));
		case 3:
			var minSize = h.a;
			var len = h.b;
			var cls = 'min-height-' + elm$core$String$fromInt(minSize);
			var style = A3(
				mdgriffith$elm_ui$Internal$Model$Single,
				cls,
				'min-height',
				elm$core$String$fromInt(minSize) + 'px');
			var _n1 = mdgriffith$elm_ui$Internal$Model$renderHeight(len);
			var newFlag = _n1.a;
			var newAttrs = _n1.b;
			var newStyle = _n1.c;
			return _Utils_Tuple3(
				A2(mdgriffith$elm_ui$Internal$Flag$add, mdgriffith$elm_ui$Internal$Flag$heightBetween, newFlag),
				cls + (' ' + newAttrs),
				A2(elm$core$List$cons, style, newStyle));
		default:
			var maxSize = h.a;
			var len = h.b;
			var cls = 'max-height-' + elm$core$String$fromInt(maxSize);
			var style = A3(
				mdgriffith$elm_ui$Internal$Model$Single,
				cls,
				'max-height',
				elm$core$String$fromInt(maxSize) + 'px');
			var _n2 = mdgriffith$elm_ui$Internal$Model$renderHeight(len);
			var newFlag = _n2.a;
			var newAttrs = _n2.b;
			var newStyle = _n2.c;
			return _Utils_Tuple3(
				A2(mdgriffith$elm_ui$Internal$Flag$add, mdgriffith$elm_ui$Internal$Flag$heightBetween, newFlag),
				cls + (' ' + newAttrs),
				A2(elm$core$List$cons, style, newStyle));
	}
};
var mdgriffith$elm_ui$Internal$Model$renderWidth = function (w) {
	switch (w.$) {
		case 0:
			var px = w.a;
			return _Utils_Tuple3(
				mdgriffith$elm_ui$Internal$Flag$none,
				mdgriffith$elm_ui$Internal$Style$classes.ei + (' width-px-' + elm$core$String$fromInt(px)),
				_List_fromArray(
					[
						A3(
						mdgriffith$elm_ui$Internal$Model$Single,
						'width-px-' + elm$core$String$fromInt(px),
						'width',
						elm$core$String$fromInt(px) + 'px')
					]));
		case 1:
			return _Utils_Tuple3(
				A2(mdgriffith$elm_ui$Internal$Flag$add, mdgriffith$elm_ui$Internal$Flag$widthContent, mdgriffith$elm_ui$Internal$Flag$none),
				mdgriffith$elm_ui$Internal$Style$classes.cY,
				_List_Nil);
		case 2:
			var portion = w.a;
			return (portion === 1) ? _Utils_Tuple3(
				A2(mdgriffith$elm_ui$Internal$Flag$add, mdgriffith$elm_ui$Internal$Flag$widthFill, mdgriffith$elm_ui$Internal$Flag$none),
				mdgriffith$elm_ui$Internal$Style$classes.cZ,
				_List_Nil) : _Utils_Tuple3(
				A2(mdgriffith$elm_ui$Internal$Flag$add, mdgriffith$elm_ui$Internal$Flag$widthFill, mdgriffith$elm_ui$Internal$Flag$none),
				mdgriffith$elm_ui$Internal$Style$classes.ej + (' width-fill-' + elm$core$String$fromInt(portion)),
				_List_fromArray(
					[
						A3(
						mdgriffith$elm_ui$Internal$Model$Single,
						mdgriffith$elm_ui$Internal$Style$classes.eA + ('.' + (mdgriffith$elm_ui$Internal$Style$classes.d$ + (' > ' + mdgriffith$elm_ui$Internal$Style$dot(
							'width-fill-' + elm$core$String$fromInt(portion))))),
						'flex-grow',
						elm$core$String$fromInt(portion * 100000))
					]));
		case 3:
			var minSize = w.a;
			var len = w.b;
			var cls = 'min-width-' + elm$core$String$fromInt(minSize);
			var style = A3(
				mdgriffith$elm_ui$Internal$Model$Single,
				cls,
				'min-width',
				elm$core$String$fromInt(minSize) + 'px');
			var _n1 = mdgriffith$elm_ui$Internal$Model$renderWidth(len);
			var newFlag = _n1.a;
			var newAttrs = _n1.b;
			var newStyle = _n1.c;
			return _Utils_Tuple3(
				A2(mdgriffith$elm_ui$Internal$Flag$add, mdgriffith$elm_ui$Internal$Flag$widthBetween, newFlag),
				cls + (' ' + newAttrs),
				A2(elm$core$List$cons, style, newStyle));
		default:
			var maxSize = w.a;
			var len = w.b;
			var cls = 'max-width-' + elm$core$String$fromInt(maxSize);
			var style = A3(
				mdgriffith$elm_ui$Internal$Model$Single,
				cls,
				'max-width',
				elm$core$String$fromInt(maxSize) + 'px');
			var _n2 = mdgriffith$elm_ui$Internal$Model$renderWidth(len);
			var newFlag = _n2.a;
			var newAttrs = _n2.b;
			var newStyle = _n2.c;
			return _Utils_Tuple3(
				A2(mdgriffith$elm_ui$Internal$Flag$add, mdgriffith$elm_ui$Internal$Flag$widthBetween, newFlag),
				cls + (' ' + newAttrs),
				A2(elm$core$List$cons, style, newStyle));
	}
};
var mdgriffith$elm_ui$Internal$Model$skippable = F2(
	function (flag, style) {
		if (_Utils_eq(flag, mdgriffith$elm_ui$Internal$Flag$borderWidth)) {
			if (style.$ === 3) {
				var val = style.c;
				switch (val) {
					case '0px':
						return true;
					case '1px':
						return true;
					case '2px':
						return true;
					case '3px':
						return true;
					case '4px':
						return true;
					case '5px':
						return true;
					case '6px':
						return true;
					default:
						return false;
				}
			} else {
				return false;
			}
		} else {
			switch (style.$) {
				case 2:
					var i = style.a;
					return (i >= 8) && (i <= 32);
				case 7:
					var name = style.a;
					var t = style.b;
					var r = style.c;
					var b = style.d;
					var l = style.e;
					return _Utils_eq(t, b) && (_Utils_eq(t, r) && (_Utils_eq(t, l) && ((t >= 0) && (t <= 24))));
				default:
					return false;
			}
		}
	});
var mdgriffith$elm_ui$Internal$Model$gatherAttrRecursive = F8(
	function (classes, node, has, transform, styles, attrs, children, elementAttrs) {
		gatherAttrRecursive:
		while (true) {
			if (!elementAttrs.b) {
				var _n1 = mdgriffith$elm_ui$Internal$Model$transformClass(transform);
				if (_n1.$ === 1) {
					return {
						aQ: A2(
							elm$core$List$cons,
							elm$html$Html$Attributes$class(classes),
							attrs),
						aR: children,
						aX: has,
						a4: node,
						g9: styles
					};
				} else {
					var _class = _n1.a;
					return {
						aQ: A2(
							elm$core$List$cons,
							elm$html$Html$Attributes$class(classes + (' ' + _class)),
							attrs),
						aR: children,
						aX: has,
						a4: node,
						g9: A2(
							elm$core$List$cons,
							mdgriffith$elm_ui$Internal$Model$Transform(transform),
							styles)
					};
				}
			} else {
				var attribute = elementAttrs.a;
				var remaining = elementAttrs.b;
				switch (attribute.$) {
					case 0:
						var $temp$classes = classes,
							$temp$node = node,
							$temp$has = has,
							$temp$transform = transform,
							$temp$styles = styles,
							$temp$attrs = attrs,
							$temp$children = children,
							$temp$elementAttrs = remaining;
						classes = $temp$classes;
						node = $temp$node;
						has = $temp$has;
						transform = $temp$transform;
						styles = $temp$styles;
						attrs = $temp$attrs;
						children = $temp$children;
						elementAttrs = $temp$elementAttrs;
						continue gatherAttrRecursive;
					case 3:
						var flag = attribute.a;
						var exactClassName = attribute.b;
						if (A2(mdgriffith$elm_ui$Internal$Flag$present, flag, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							var $temp$classes = exactClassName + (' ' + classes),
								$temp$node = node,
								$temp$has = A2(mdgriffith$elm_ui$Internal$Flag$add, flag, has),
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						}
					case 1:
						var actualAttribute = attribute.a;
						var $temp$classes = classes,
							$temp$node = node,
							$temp$has = has,
							$temp$transform = transform,
							$temp$styles = styles,
							$temp$attrs = A2(elm$core$List$cons, actualAttribute, attrs),
							$temp$children = children,
							$temp$elementAttrs = remaining;
						classes = $temp$classes;
						node = $temp$node;
						has = $temp$has;
						transform = $temp$transform;
						styles = $temp$styles;
						attrs = $temp$attrs;
						children = $temp$children;
						elementAttrs = $temp$elementAttrs;
						continue gatherAttrRecursive;
					case 4:
						var flag = attribute.a;
						var style = attribute.b;
						if (A2(mdgriffith$elm_ui$Internal$Flag$present, flag, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							if (A2(mdgriffith$elm_ui$Internal$Model$skippable, flag, style)) {
								var $temp$classes = mdgriffith$elm_ui$Internal$Model$getStyleName(style) + (' ' + classes),
									$temp$node = node,
									$temp$has = A2(mdgriffith$elm_ui$Internal$Flag$add, flag, has),
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							} else {
								var $temp$classes = mdgriffith$elm_ui$Internal$Model$getStyleName(style) + (' ' + classes),
									$temp$node = node,
									$temp$has = A2(mdgriffith$elm_ui$Internal$Flag$add, flag, has),
									$temp$transform = transform,
									$temp$styles = A2(elm$core$List$cons, style, styles),
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							}
						}
					case 10:
						var flag = attribute.a;
						var component = attribute.b;
						var $temp$classes = classes,
							$temp$node = node,
							$temp$has = A2(mdgriffith$elm_ui$Internal$Flag$add, flag, has),
							$temp$transform = A2(mdgriffith$elm_ui$Internal$Model$composeTransformation, transform, component),
							$temp$styles = styles,
							$temp$attrs = attrs,
							$temp$children = children,
							$temp$elementAttrs = remaining;
						classes = $temp$classes;
						node = $temp$node;
						has = $temp$has;
						transform = $temp$transform;
						styles = $temp$styles;
						attrs = $temp$attrs;
						children = $temp$children;
						elementAttrs = $temp$elementAttrs;
						continue gatherAttrRecursive;
					case 7:
						var width = attribute.a;
						if (A2(mdgriffith$elm_ui$Internal$Flag$present, mdgriffith$elm_ui$Internal$Flag$width, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							switch (width.$) {
								case 0:
									var px = width.a;
									var $temp$classes = (mdgriffith$elm_ui$Internal$Style$classes.ei + (' width-px-' + elm$core$String$fromInt(px))) + (' ' + classes),
										$temp$node = node,
										$temp$has = A2(mdgriffith$elm_ui$Internal$Flag$add, mdgriffith$elm_ui$Internal$Flag$width, has),
										$temp$transform = transform,
										$temp$styles = A2(
										elm$core$List$cons,
										A3(
											mdgriffith$elm_ui$Internal$Model$Single,
											'width-px-' + elm$core$String$fromInt(px),
											'width',
											elm$core$String$fromInt(px) + 'px'),
										styles),
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
								case 1:
									var $temp$classes = classes + (' ' + mdgriffith$elm_ui$Internal$Style$classes.cY),
										$temp$node = node,
										$temp$has = A2(
										mdgriffith$elm_ui$Internal$Flag$add,
										mdgriffith$elm_ui$Internal$Flag$widthContent,
										A2(mdgriffith$elm_ui$Internal$Flag$add, mdgriffith$elm_ui$Internal$Flag$width, has)),
										$temp$transform = transform,
										$temp$styles = styles,
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
								case 2:
									var portion = width.a;
									if (portion === 1) {
										var $temp$classes = classes + (' ' + mdgriffith$elm_ui$Internal$Style$classes.cZ),
											$temp$node = node,
											$temp$has = A2(
											mdgriffith$elm_ui$Internal$Flag$add,
											mdgriffith$elm_ui$Internal$Flag$widthFill,
											A2(mdgriffith$elm_ui$Internal$Flag$add, mdgriffith$elm_ui$Internal$Flag$width, has)),
											$temp$transform = transform,
											$temp$styles = styles,
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									} else {
										var $temp$classes = classes + (' ' + (mdgriffith$elm_ui$Internal$Style$classes.ej + (' width-fill-' + elm$core$String$fromInt(portion)))),
											$temp$node = node,
											$temp$has = A2(
											mdgriffith$elm_ui$Internal$Flag$add,
											mdgriffith$elm_ui$Internal$Flag$widthFill,
											A2(mdgriffith$elm_ui$Internal$Flag$add, mdgriffith$elm_ui$Internal$Flag$width, has)),
											$temp$transform = transform,
											$temp$styles = A2(
											elm$core$List$cons,
											A3(
												mdgriffith$elm_ui$Internal$Model$Single,
												mdgriffith$elm_ui$Internal$Style$classes.eA + ('.' + (mdgriffith$elm_ui$Internal$Style$classes.d$ + (' > ' + mdgriffith$elm_ui$Internal$Style$dot(
													'width-fill-' + elm$core$String$fromInt(portion))))),
												'flex-grow',
												elm$core$String$fromInt(portion * 100000)),
											styles),
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									}
								default:
									var _n4 = mdgriffith$elm_ui$Internal$Model$renderWidth(width);
									var addToFlags = _n4.a;
									var newClass = _n4.b;
									var newStyles = _n4.c;
									var $temp$classes = classes + (' ' + newClass),
										$temp$node = node,
										$temp$has = A2(mdgriffith$elm_ui$Internal$Flag$merge, addToFlags, has),
										$temp$transform = transform,
										$temp$styles = _Utils_ap(newStyles, styles),
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
							}
						}
					case 8:
						var height = attribute.a;
						if (A2(mdgriffith$elm_ui$Internal$Flag$present, mdgriffith$elm_ui$Internal$Flag$height, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							switch (height.$) {
								case 0:
									var px = height.a;
									var val = elm$core$String$fromInt(px) + 'px';
									var name = 'height-px-' + val;
									var $temp$classes = name + (' ' + classes),
										$temp$node = node,
										$temp$has = A2(mdgriffith$elm_ui$Internal$Flag$add, mdgriffith$elm_ui$Internal$Flag$height, has),
										$temp$transform = transform,
										$temp$styles = A2(
										elm$core$List$cons,
										A3(mdgriffith$elm_ui$Internal$Model$Single, name, 'height ', val),
										styles),
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
								case 1:
									var $temp$classes = mdgriffith$elm_ui$Internal$Style$classes.b3 + (' ' + classes),
										$temp$node = node,
										$temp$has = A2(
										mdgriffith$elm_ui$Internal$Flag$add,
										mdgriffith$elm_ui$Internal$Flag$heightContent,
										A2(mdgriffith$elm_ui$Internal$Flag$add, mdgriffith$elm_ui$Internal$Flag$height, has)),
										$temp$transform = transform,
										$temp$styles = styles,
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
								case 2:
									var portion = height.a;
									if (portion === 1) {
										var $temp$classes = mdgriffith$elm_ui$Internal$Style$classes.cI + (' ' + classes),
											$temp$node = node,
											$temp$has = A2(
											mdgriffith$elm_ui$Internal$Flag$add,
											mdgriffith$elm_ui$Internal$Flag$heightFill,
											A2(mdgriffith$elm_ui$Internal$Flag$add, mdgriffith$elm_ui$Internal$Flag$height, has)),
											$temp$transform = transform,
											$temp$styles = styles,
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									} else {
										var $temp$classes = classes + (' ' + (mdgriffith$elm_ui$Internal$Style$classes.$7 + (' height-fill-' + elm$core$String$fromInt(portion)))),
											$temp$node = node,
											$temp$has = A2(
											mdgriffith$elm_ui$Internal$Flag$add,
											mdgriffith$elm_ui$Internal$Flag$heightFill,
											A2(mdgriffith$elm_ui$Internal$Flag$add, mdgriffith$elm_ui$Internal$Flag$height, has)),
											$temp$transform = transform,
											$temp$styles = A2(
											elm$core$List$cons,
											A3(
												mdgriffith$elm_ui$Internal$Model$Single,
												mdgriffith$elm_ui$Internal$Style$classes.eA + ('.' + (mdgriffith$elm_ui$Internal$Style$classes.aw + (' > ' + mdgriffith$elm_ui$Internal$Style$dot(
													'height-fill-' + elm$core$String$fromInt(portion))))),
												'flex-grow',
												elm$core$String$fromInt(portion * 100000)),
											styles),
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									}
								default:
									var _n6 = mdgriffith$elm_ui$Internal$Model$renderHeight(height);
									var addToFlags = _n6.a;
									var newClass = _n6.b;
									var newStyles = _n6.c;
									var $temp$classes = classes + (' ' + newClass),
										$temp$node = node,
										$temp$has = A2(mdgriffith$elm_ui$Internal$Flag$merge, addToFlags, has),
										$temp$transform = transform,
										$temp$styles = _Utils_ap(newStyles, styles),
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
							}
						}
					case 2:
						var description = attribute.a;
						switch (description.$) {
							case 0:
								var $temp$classes = classes,
									$temp$node = A2(mdgriffith$elm_ui$Internal$Model$addNodeName, 'main', node),
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 1:
								var $temp$classes = classes,
									$temp$node = A2(mdgriffith$elm_ui$Internal$Model$addNodeName, 'nav', node),
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 2:
								var $temp$classes = classes,
									$temp$node = A2(mdgriffith$elm_ui$Internal$Model$addNodeName, 'footer', node),
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 3:
								var $temp$classes = classes,
									$temp$node = A2(mdgriffith$elm_ui$Internal$Model$addNodeName, 'aside', node),
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 4:
								var i = description.a;
								if (i <= 1) {
									var $temp$classes = classes,
										$temp$node = A2(mdgriffith$elm_ui$Internal$Model$addNodeName, 'h1', node),
										$temp$has = has,
										$temp$transform = transform,
										$temp$styles = styles,
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
								} else {
									if (i < 7) {
										var $temp$classes = classes,
											$temp$node = A2(
											mdgriffith$elm_ui$Internal$Model$addNodeName,
											'h' + elm$core$String$fromInt(i),
											node),
											$temp$has = has,
											$temp$transform = transform,
											$temp$styles = styles,
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									} else {
										var $temp$classes = classes,
											$temp$node = A2(mdgriffith$elm_ui$Internal$Model$addNodeName, 'h6', node),
											$temp$has = has,
											$temp$transform = transform,
											$temp$styles = styles,
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									}
								}
							case 9:
								var newNode = function () {
									switch (node.$) {
										case 0:
											return mdgriffith$elm_ui$Internal$Model$NodeName('p');
										case 1:
											var name = node.a;
											return mdgriffith$elm_ui$Internal$Model$NodeName(name);
										default:
											var x = node.a;
											var y = node.b;
											return A2(mdgriffith$elm_ui$Internal$Model$Embedded, x, y);
									}
								}();
								var $temp$classes = classes,
									$temp$node = newNode,
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 8:
								var $temp$classes = classes,
									$temp$node = node,
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = A2(
									elm$core$List$cons,
									A2(elm$virtual_dom$VirtualDom$attribute, 'role', 'button'),
									attrs),
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 5:
								var label = description.a;
								var $temp$classes = classes,
									$temp$node = node,
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = A2(
									elm$core$List$cons,
									A2(elm$virtual_dom$VirtualDom$attribute, 'aria-label', label),
									attrs),
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 6:
								var $temp$classes = classes,
									$temp$node = node,
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = A2(
									elm$core$List$cons,
									A2(elm$virtual_dom$VirtualDom$attribute, 'aria-live', 'polite'),
									attrs),
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							default:
								var $temp$classes = classes,
									$temp$node = node,
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = A2(
									elm$core$List$cons,
									A2(elm$virtual_dom$VirtualDom$attribute, 'aria-live', 'assertive'),
									attrs),
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
						}
					case 9:
						var location = attribute.a;
						var elem = attribute.b;
						var newStyles = function () {
							switch (elem.$) {
								case 3:
									return styles;
								case 2:
									var str = elem.a;
									return styles;
								case 0:
									var html = elem.a;
									return styles;
								default:
									var styled = elem.a;
									return _Utils_ap(styles, styled.g9);
							}
						}();
						var $temp$classes = classes,
							$temp$node = node,
							$temp$has = has,
							$temp$transform = transform,
							$temp$styles = newStyles,
							$temp$attrs = attrs,
							$temp$children = A3(mdgriffith$elm_ui$Internal$Model$addNearbyElement, location, elem, children),
							$temp$elementAttrs = remaining;
						classes = $temp$classes;
						node = $temp$node;
						has = $temp$has;
						transform = $temp$transform;
						styles = $temp$styles;
						attrs = $temp$attrs;
						children = $temp$children;
						elementAttrs = $temp$elementAttrs;
						continue gatherAttrRecursive;
					case 6:
						var x = attribute.a;
						if (A2(mdgriffith$elm_ui$Internal$Flag$present, mdgriffith$elm_ui$Internal$Flag$xAlign, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							var $temp$classes = mdgriffith$elm_ui$Internal$Model$alignXName(x) + (' ' + classes),
								$temp$node = node,
								$temp$has = function (flags) {
								switch (x) {
									case 1:
										return A2(mdgriffith$elm_ui$Internal$Flag$add, mdgriffith$elm_ui$Internal$Flag$centerX, flags);
									case 2:
										return A2(mdgriffith$elm_ui$Internal$Flag$add, mdgriffith$elm_ui$Internal$Flag$alignRight, flags);
									default:
										return flags;
								}
							}(
								A2(mdgriffith$elm_ui$Internal$Flag$add, mdgriffith$elm_ui$Internal$Flag$xAlign, has)),
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						}
					default:
						var y = attribute.a;
						if (A2(mdgriffith$elm_ui$Internal$Flag$present, mdgriffith$elm_ui$Internal$Flag$yAlign, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							var $temp$classes = mdgriffith$elm_ui$Internal$Model$alignYName(y) + (' ' + classes),
								$temp$node = node,
								$temp$has = function (flags) {
								switch (y) {
									case 1:
										return A2(mdgriffith$elm_ui$Internal$Flag$add, mdgriffith$elm_ui$Internal$Flag$centerY, flags);
									case 2:
										return A2(mdgriffith$elm_ui$Internal$Flag$add, mdgriffith$elm_ui$Internal$Flag$alignBottom, flags);
									default:
										return flags;
								}
							}(
								A2(mdgriffith$elm_ui$Internal$Flag$add, mdgriffith$elm_ui$Internal$Flag$yAlign, has)),
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						}
				}
			}
		}
	});
var mdgriffith$elm_ui$Internal$Model$Untransformed = {$: 0};
var mdgriffith$elm_ui$Internal$Model$untransformed = mdgriffith$elm_ui$Internal$Model$Untransformed;
var mdgriffith$elm_ui$Internal$Model$element = F4(
	function (context, node, attributes, children) {
		return A3(
			mdgriffith$elm_ui$Internal$Model$createElement,
			context,
			children,
			A8(
				mdgriffith$elm_ui$Internal$Model$gatherAttrRecursive,
				mdgriffith$elm_ui$Internal$Model$contextClasses(context),
				node,
				mdgriffith$elm_ui$Internal$Flag$none,
				mdgriffith$elm_ui$Internal$Model$untransformed,
				_List_Nil,
				_List_Nil,
				mdgriffith$elm_ui$Internal$Model$NoNearbyChildren,
				elm$core$List$reverse(attributes)));
	});
var mdgriffith$elm_ui$Element$el = F2(
	function (attrs, child) {
		return A4(
			mdgriffith$elm_ui$Internal$Model$element,
			mdgriffith$elm_ui$Internal$Model$asEl,
			mdgriffith$elm_ui$Internal$Model$div,
			A2(
				elm$core$List$cons,
				mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$shrink),
				A2(
					elm$core$List$cons,
					mdgriffith$elm_ui$Element$height(mdgriffith$elm_ui$Element$shrink),
					attrs)),
			mdgriffith$elm_ui$Internal$Model$Unkeyed(
				_List_fromArray(
					[child])));
	});
var mdgriffith$elm_ui$Internal$Model$AsRow = 0;
var mdgriffith$elm_ui$Internal$Model$asRow = 0;
var mdgriffith$elm_ui$Internal$Model$Attr = function (a) {
	return {$: 1, a: a};
};
var mdgriffith$elm_ui$Internal$Model$htmlClass = function (cls) {
	return mdgriffith$elm_ui$Internal$Model$Attr(
		elm$html$Html$Attributes$class(cls));
};
var mdgriffith$elm_ui$Element$row = F2(
	function (attrs, children) {
		return A4(
			mdgriffith$elm_ui$Internal$Model$element,
			mdgriffith$elm_ui$Internal$Model$asRow,
			mdgriffith$elm_ui$Internal$Model$div,
			A2(
				elm$core$List$cons,
				mdgriffith$elm_ui$Internal$Model$htmlClass(mdgriffith$elm_ui$Internal$Style$classes.bv + (' ' + mdgriffith$elm_ui$Internal$Style$classes.ax)),
				A2(
					elm$core$List$cons,
					mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$shrink),
					A2(
						elm$core$List$cons,
						mdgriffith$elm_ui$Element$height(mdgriffith$elm_ui$Element$shrink),
						attrs))),
			mdgriffith$elm_ui$Internal$Model$Unkeyed(children));
	});
var mdgriffith$elm_ui$Internal$Model$Text = function (a) {
	return {$: 2, a: a};
};
var mdgriffith$elm_ui$Element$text = function (content) {
	return mdgriffith$elm_ui$Internal$Model$Text(content);
};
var author$project$DocumentStructView$prefix = function (offsets) {
	var attrs = function (sel) {
		return _List_fromArray(
			[
				sel ? mdgriffith$elm_ui$Element$Font$color(
				A4(mdgriffith$elm_ui$Element$rgba, 0, 0, 1, 1)) : mdgriffith$elm_ui$Element$Font$color(
				A4(mdgriffith$elm_ui$Element$rgba, 0.8, 0.8, 0.8, 1))
			]);
	};
	var helper = F2(
		function (acc, indexes) {
			helper:
			while (true) {
				if (!indexes.b) {
					return _List_fromArray(
						[
							A2(mdgriffith$elm_ui$Element$row, _List_Nil, acc)
						]);
				} else {
					if (!indexes.a.$) {
						if (!indexes.b.b) {
							var sel = indexes.a.a;
							return _Utils_ap(
								acc,
								_List_fromArray(
									[
										A2(
										mdgriffith$elm_ui$Element$el,
										attrs(sel),
										mdgriffith$elm_ui$Element$text(
											A2(elm$core$String$repeat, 3, ' ') + '└─ '))
									]));
						} else {
							var sel = indexes.a.a;
							var xs = indexes.b;
							var $temp$acc = _Utils_ap(
								acc,
								_List_fromArray(
									[
										A2(
										mdgriffith$elm_ui$Element$row,
										attrs(sel),
										_List_fromArray(
											[
												mdgriffith$elm_ui$Element$text(
												A2(elm$core$String$repeat, 3, ' ') + ' ')
											]))
									])),
								$temp$indexes = xs;
							acc = $temp$acc;
							indexes = $temp$indexes;
							continue helper;
						}
					} else {
						if (!indexes.b.b) {
							var sel = indexes.a.a;
							return _Utils_ap(
								acc,
								_List_fromArray(
									[
										A2(
										mdgriffith$elm_ui$Element$el,
										attrs(sel),
										mdgriffith$elm_ui$Element$text(
											A2(elm$core$String$repeat, 3, ' ') + '├─ '))
									]));
						} else {
							var sel = indexes.a.a;
							var xs = indexes.b;
							var $temp$acc = _Utils_ap(
								acc,
								_List_fromArray(
									[
										A2(
										mdgriffith$elm_ui$Element$el,
										attrs(sel),
										mdgriffith$elm_ui$Element$text(
											A2(elm$core$String$repeat, 3, ' ') + '│'))
									])),
								$temp$indexes = xs;
							acc = $temp$acc;
							indexes = $temp$indexes;
							continue helper;
						}
					}
				}
			}
		});
	return A2(
		helper,
		_List_Nil,
		elm$core$List$reverse(offsets));
};
var mdgriffith$elm_ui$Internal$Flag$hover = mdgriffith$elm_ui$Internal$Flag$flag(33);
var mdgriffith$elm_ui$Internal$Model$Hover = 1;
var mdgriffith$elm_ui$Internal$Model$PseudoSelector = F2(
	function (a, b) {
		return {$: 11, a: a, b: b};
	});
var elm$virtual_dom$VirtualDom$mapAttribute = _VirtualDom_mapAttribute;
var mdgriffith$elm_ui$Internal$Model$AlignY = function (a) {
	return {$: 5, a: a};
};
var mdgriffith$elm_ui$Internal$Model$Describe = function (a) {
	return {$: 2, a: a};
};
var mdgriffith$elm_ui$Internal$Model$Nearby = F2(
	function (a, b) {
		return {$: 9, a: a, b: b};
	});
var mdgriffith$elm_ui$Internal$Model$NoAttribute = {$: 0};
var mdgriffith$elm_ui$Internal$Model$TransformComponent = F2(
	function (a, b) {
		return {$: 10, a: a, b: b};
	});
var elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var mdgriffith$elm_ui$Internal$Model$Empty = {$: 3};
var mdgriffith$elm_ui$Internal$Model$map = F2(
	function (fn, el) {
		switch (el.$) {
			case 1:
				var styled = el.a;
				return mdgriffith$elm_ui$Internal$Model$Styled(
					{
						fP: F2(
							function (add, context) {
								return A2(
									elm$virtual_dom$VirtualDom$map,
									fn,
									A2(styled.fP, add, context));
							}),
						g9: styled.g9
					});
			case 0:
				var html = el.a;
				return mdgriffith$elm_ui$Internal$Model$Unstyled(
					A2(
						elm$core$Basics$composeL,
						elm$virtual_dom$VirtualDom$map(fn),
						html));
			case 2:
				var str = el.a;
				return mdgriffith$elm_ui$Internal$Model$Text(str);
			default:
				return mdgriffith$elm_ui$Internal$Model$Empty;
		}
	});
var mdgriffith$elm_ui$Internal$Model$mapAttrFromStyle = F2(
	function (fn, attr) {
		switch (attr.$) {
			case 0:
				return mdgriffith$elm_ui$Internal$Model$NoAttribute;
			case 2:
				var description = attr.a;
				return mdgriffith$elm_ui$Internal$Model$Describe(description);
			case 6:
				var x = attr.a;
				return mdgriffith$elm_ui$Internal$Model$AlignX(x);
			case 5:
				var y = attr.a;
				return mdgriffith$elm_ui$Internal$Model$AlignY(y);
			case 7:
				var x = attr.a;
				return mdgriffith$elm_ui$Internal$Model$Width(x);
			case 8:
				var x = attr.a;
				return mdgriffith$elm_ui$Internal$Model$Height(x);
			case 3:
				var x = attr.a;
				var y = attr.b;
				return A2(mdgriffith$elm_ui$Internal$Model$Class, x, y);
			case 4:
				var flag = attr.a;
				var style = attr.b;
				return A2(mdgriffith$elm_ui$Internal$Model$StyleClass, flag, style);
			case 9:
				var location = attr.a;
				var elem = attr.b;
				return A2(
					mdgriffith$elm_ui$Internal$Model$Nearby,
					location,
					A2(mdgriffith$elm_ui$Internal$Model$map, fn, elem));
			case 1:
				var htmlAttr = attr.a;
				return mdgriffith$elm_ui$Internal$Model$Attr(
					A2(elm$virtual_dom$VirtualDom$mapAttribute, fn, htmlAttr));
			default:
				var fl = attr.a;
				var trans = attr.b;
				return A2(mdgriffith$elm_ui$Internal$Model$TransformComponent, fl, trans);
		}
	});
var mdgriffith$elm_ui$Internal$Model$removeNever = function (style) {
	return A2(mdgriffith$elm_ui$Internal$Model$mapAttrFromStyle, elm$core$Basics$never, style);
};
var mdgriffith$elm_ui$Internal$Model$unwrapDecsHelper = F2(
	function (attr, _n0) {
		var styles = _n0.a;
		var trans = _n0.b;
		var _n1 = mdgriffith$elm_ui$Internal$Model$removeNever(attr);
		switch (_n1.$) {
			case 4:
				var style = _n1.b;
				return _Utils_Tuple2(
					A2(elm$core$List$cons, style, styles),
					trans);
			case 10:
				var flag = _n1.a;
				var component = _n1.b;
				return _Utils_Tuple2(
					styles,
					A2(mdgriffith$elm_ui$Internal$Model$composeTransformation, trans, component));
			default:
				return _Utils_Tuple2(styles, trans);
		}
	});
var mdgriffith$elm_ui$Internal$Model$unwrapDecorations = function (attrs) {
	var _n0 = A3(
		elm$core$List$foldl,
		mdgriffith$elm_ui$Internal$Model$unwrapDecsHelper,
		_Utils_Tuple2(_List_Nil, mdgriffith$elm_ui$Internal$Model$Untransformed),
		attrs);
	var styles = _n0.a;
	var transform = _n0.b;
	return A2(
		elm$core$List$cons,
		mdgriffith$elm_ui$Internal$Model$Transform(transform),
		styles);
};
var mdgriffith$elm_ui$Element$mouseOver = function (decs) {
	return A2(
		mdgriffith$elm_ui$Internal$Model$StyleClass,
		mdgriffith$elm_ui$Internal$Flag$hover,
		A2(
			mdgriffith$elm_ui$Internal$Model$PseudoSelector,
			1,
			mdgriffith$elm_ui$Internal$Model$unwrapDecorations(decs)));
};
var mdgriffith$elm_ui$Internal$Flag$cursor = mdgriffith$elm_ui$Internal$Flag$flag(21);
var mdgriffith$elm_ui$Element$pointer = A2(mdgriffith$elm_ui$Internal$Model$Class, mdgriffith$elm_ui$Internal$Flag$cursor, mdgriffith$elm_ui$Internal$Style$classes.fj);
var elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			elm$virtual_dom$VirtualDom$on,
			event,
			elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var elm$html$Html$Events$onClick = function (msg) {
	return A2(
		elm$html$Html$Events$on,
		'click',
		elm$json$Json$Decode$succeed(msg));
};
var mdgriffith$elm_ui$Element$Events$onClick = A2(elm$core$Basics$composeL, mdgriffith$elm_ui$Internal$Model$Attr, elm$html$Html$Events$onClick);
var author$project$DocumentStructView$docTreeView = F4(
	function (config, offsets, _n0, document) {
		var sContainer = _n0.a;
		var selection = _n0.b;
		var sel = selection || function (i) {
			return _Utils_eq(
				i,
				author$project$Document$getUid(document));
		}(sContainer);
		var labelFontColor = sel ? mdgriffith$elm_ui$Element$Font$color(
			A4(mdgriffith$elm_ui$Element$rgba, 0, 0, 0, 1)) : mdgriffith$elm_ui$Element$Font$color(
			A4(mdgriffith$elm_ui$Element$rgba, 0.8, 0.8, 0.8, 1));
		if (!document.$) {
			var containerLabel = document.a.ak;
			var id = document.a.c;
			var attrs = document.a.p;
			var xs = document.b;
			var l = elm$core$List$length(xs);
			var _n2 = _Utils_Tuple2(
				A2(elm$core$List$take, l - 1, xs),
				A2(elm$core$List$drop, l - 1, xs));
			var firsts = _n2.a;
			var last = _n2.b;
			return _Utils_ap(
				_List_fromArray(
					[
						A2(
						mdgriffith$elm_ui$Element$row,
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill)
							]),
						_Utils_ap(
							author$project$DocumentStructView$prefix(offsets),
							_List_fromArray(
								[
									A2(
									mdgriffith$elm_ui$Element$el,
									_Utils_ap(
										_List_fromArray(
											[
												(config.fc && sel) ? mdgriffith$elm_ui$Element$Font$color(
												author$project$DocumentStructView$containerLabelToColor(containerLabel)) : labelFontColor
											]),
										config.dv ? _List_fromArray(
											[
												mdgriffith$elm_ui$Element$Events$onClick(
												config.em(id.bc)),
												mdgriffith$elm_ui$Element$pointer,
												mdgriffith$elm_ui$Element$mouseOver(
												_List_fromArray(
													[
														mdgriffith$elm_ui$Element$Font$color(
														A4(mdgriffith$elm_ui$Element$rgba, 0, 0, 1, 1))
													]))
											]) : _List_Nil),
									mdgriffith$elm_ui$Element$text(
										author$project$DocumentStructView$containerLabelToString(containerLabel)))
								])))
					]),
				_Utils_ap(
					A2(
						elm$core$List$concatMap,
						A3(
							author$project$DocumentStructView$docTreeView,
							config,
							A2(
								elm$core$List$cons,
								author$project$DocumentStructView$NotLastChild(sel),
								offsets),
							_Utils_Tuple2(sContainer, sel)),
						firsts),
					A2(
						elm$core$List$concatMap,
						A3(
							author$project$DocumentStructView$docTreeView,
							config,
							A2(
								elm$core$List$cons,
								author$project$DocumentStructView$LastChild(sel),
								offsets),
							_Utils_Tuple2(sContainer, sel)),
						last)));
		} else {
			var cellContent = document.a.aa;
			var id = document.a.c;
			var attrs = document.a.p;
			return _List_fromArray(
				[
					A2(
					mdgriffith$elm_ui$Element$row,
					_List_Nil,
					_Utils_ap(
						author$project$DocumentStructView$prefix(offsets),
						_List_fromArray(
							[
								A2(
								mdgriffith$elm_ui$Element$el,
								_Utils_ap(
									_List_fromArray(
										[labelFontColor]),
									config.dv ? _List_fromArray(
										[
											mdgriffith$elm_ui$Element$Events$onClick(
											config.em(id.bc)),
											mdgriffith$elm_ui$Element$pointer,
											mdgriffith$elm_ui$Element$mouseOver(
											_List_fromArray(
												[
													mdgriffith$elm_ui$Element$Font$color(
													A4(mdgriffith$elm_ui$Element$rgba, 0, 0, 1, 1))
												]))
										]) : _List_Nil),
								mdgriffith$elm_ui$Element$text(
									author$project$DocumentStructView$cellContentToString(cellContent)))
							])))
				]);
		}
	});
var mdgriffith$elm_ui$Internal$Model$AsColumn = 1;
var mdgriffith$elm_ui$Internal$Model$asColumn = 1;
var mdgriffith$elm_ui$Element$column = F2(
	function (attrs, children) {
		return A4(
			mdgriffith$elm_ui$Internal$Model$element,
			mdgriffith$elm_ui$Internal$Model$asColumn,
			mdgriffith$elm_ui$Internal$Model$div,
			A2(
				elm$core$List$cons,
				mdgriffith$elm_ui$Internal$Model$htmlClass(mdgriffith$elm_ui$Internal$Style$classes.fd + (' ' + mdgriffith$elm_ui$Internal$Style$classes.bv)),
				A2(
					elm$core$List$cons,
					mdgriffith$elm_ui$Element$height(mdgriffith$elm_ui$Element$shrink),
					A2(
						elm$core$List$cons,
						mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$shrink),
						attrs))),
			mdgriffith$elm_ui$Internal$Model$Unkeyed(children));
	});
var author$project$DocumentStructView$mainPanel = F3(
	function (config, selectedContainer, document) {
		return A2(
			mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					mdgriffith$elm_ui$Element$spacing(2),
					mdgriffith$elm_ui$Element$padding(15)
				]),
			A4(
				author$project$DocumentStructView$docTreeView,
				config,
				_List_Nil,
				_Utils_Tuple2(selectedContainer, false),
				document));
	});
var author$project$DocumentStructView$menuView = function (config) {
	return A2(
		mdgriffith$elm_ui$Element$row,
		_List_fromArray(
			[
				mdgriffith$elm_ui$Element$spacing(15)
			]),
		_List_Nil);
};
var mdgriffith$elm_ui$Internal$Model$Top = 0;
var mdgriffith$elm_ui$Element$alignTop = mdgriffith$elm_ui$Internal$Model$AlignY(0);
var mdgriffith$elm_ui$Element$scrollbars = A2(mdgriffith$elm_ui$Internal$Model$Class, mdgriffith$elm_ui$Internal$Flag$overflow, mdgriffith$elm_ui$Internal$Style$classes.gO);
var mdgriffith$elm_ui$Internal$Model$Monospace = {$: 2};
var mdgriffith$elm_ui$Element$Font$monospace = mdgriffith$elm_ui$Internal$Model$Monospace;
var author$project$DocumentStructView$documentStructView = F3(
	function (config, selectedContainer, document) {
		return A2(
			mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					mdgriffith$elm_ui$Element$spacing(15),
					mdgriffith$elm_ui$Element$scrollbars,
					mdgriffith$elm_ui$Element$width(
					A2(mdgriffith$elm_ui$Element$maximum, 330, mdgriffith$elm_ui$Element$fill)),
					mdgriffith$elm_ui$Element$height(mdgriffith$elm_ui$Element$fill),
					mdgriffith$elm_ui$Element$alignTop,
					mdgriffith$elm_ui$Element$Font$size(14),
					mdgriffith$elm_ui$Element$Font$family(
					_List_fromArray(
						[mdgriffith$elm_ui$Element$Font$monospace]))
				]),
			_List_fromArray(
				[
					author$project$DocumentStructView$menuView(config),
					A3(author$project$DocumentStructView$mainPanel, config, selectedContainer, document)
				]));
	});
var author$project$Editor$MenuClickOff = {$: 28};
var author$project$Editor$ZipToUid = function (a) {
	return {$: 9, a: a};
};
var author$project$Document$containsOnly = F2(
	function (p, document) {
		if (!document.$) {
			var nv = document.a;
			var children = document.b;
			return A3(
				elm$core$List$foldr,
				F2(
					function (d, acc) {
						return p(d) && acc;
					}),
				true,
				children);
		} else {
			return false;
		}
	});
var author$project$Document$isImage = function (document) {
	if (document.$ === 1) {
		var lv = document.a;
		var _n1 = lv.aa;
		if (!_n1.$) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
};
var author$project$DocumentResponsive$flipTable = function (_n0) {
	var style = _n0.g7;
	var nbrRows = _n0.gj;
	var nbrCols = _n0.gi;
	var data = _n0.fn;
	var uncons = function (xs) {
		if (xs.b) {
			var x = xs.a;
			var xs_ = xs.b;
			return elm$core$Maybe$Just(
				_Utils_Tuple2(x, xs_));
		} else {
			return elm$core$Maybe$Nothing;
		}
	};
	var inverse = F2(
		function (acc, xs) {
			inverse:
			while (true) {
				if (!xs.b) {
					return elm$core$List$reverse(acc);
				} else {
					var xs_ = xs;
					var _n2 = A3(
						elm$core$List$foldr,
						F2(
							function (_n3, _n4) {
								var h = _n3.a;
								var t = _n3.b;
								var hs = _n4.a;
								var ts = _n4.b;
								return _Utils_Tuple2(
									A2(elm$core$List$cons, h, hs),
									A2(elm$core$List$cons, t, ts));
							}),
						_Utils_Tuple2(_List_Nil, _List_Nil),
						A2(elm$core$List$filterMap, uncons, xs_));
					var heads = _n2.a;
					var tails = _n2.b;
					var tails_ = A2(elm$core$List$member, _List_Nil, tails) ? _List_Nil : tails;
					var $temp$acc = A2(elm$core$List$cons, heads, acc),
						$temp$xs = tails_;
					acc = $temp$acc;
					xs = $temp$xs;
					continue inverse;
				}
			}
		});
	var newData = A2(
		elm$core$List$map,
		elm$core$Array$fromList,
		A2(
			inverse,
			_List_Nil,
			A2(elm$core$List$map, elm$core$Array$toList, data)));
	return {fn: newData, gi: nbrRows, gj: nbrCols, g7: style};
};
var elm$core$List$sortBy = _List_sortBy;
var elm$core$List$sort = function (xs) {
	return A2(elm$core$List$sortBy, elm$core$Basics$identity, xs);
};
var author$project$DocumentResponsive$renderSameHeightImgRow = F2(
	function (containerWidth, document) {
		if (document.$ === 1) {
			return document;
		} else {
			var id_ = document.a;
			var children = document.b;
			var spacingOffset = (containerWidth > 500) ? 20 : 15;
			var imgSizes = function (imgs) {
				return A2(
					elm$core$List$map,
					function (i) {
						return i.bz.d7;
					},
					imgs);
			};
			var minHeight = function (imgs) {
				return A2(
					elm$core$Maybe$withDefault,
					0,
					elm$core$List$head(
						elm$core$List$sort(
							A2(
								elm$core$List$map,
								function ($) {
									return $.fU;
								},
								imgSizes(imgs)))));
			};
			var images = A3(
				elm$core$List$foldr,
				F2(
					function (doc, acc) {
						if (!doc.$) {
							return acc;
						} else {
							var lv = doc.a;
							var _n3 = lv.aa;
							if (!_n3.$) {
								var meta = _n3.a;
								var src = meta.d9;
								var caption = meta.eV;
								var size = meta.d7;
								return A2(
									elm$core$List$cons,
									{p: lv.p, c: lv.c, bz: meta, bA: 0, bj: 0},
									acc);
							} else {
								return acc;
							}
						}
					}),
				_List_Nil,
				children);
			var imgsScaledToMinHeight = function () {
				var mh = minHeight(images);
				var scale = function (_n1) {
					var meta = _n1.bz;
					var attrs = _n1.p;
					var id = _n1.c;
					return {p: attrs, c: id, bz: meta, bA: mh + 5, bj: (mh * meta.d7.fV) / meta.d7.fU};
				};
				return A2(elm$core$List$map, scale, images);
			}();
			var totalImgWidth = A3(
				elm$core$List$foldr,
				F2(
					function (i, n) {
						return i.bj + n;
					}),
				0,
				imgsScaledToMinHeight);
			var scalingFactor = (_Utils_cmp(
				containerWidth,
				totalImgWidth + (elm$core$List$length(images) * spacingOffset)) < 0) ? ((containerWidth - (elm$core$List$length(images) * spacingOffset)) / totalImgWidth) : 1;
			var imgsScaledToFitContainer = A2(
				elm$core$List$map,
				function (im) {
					return _Utils_update(
						im,
						{bA: im.bA * scalingFactor, bj: im.bj * scalingFactor});
				},
				imgsScaledToMinHeight);
			return A2(
				author$project$Document$Container,
				id_,
				A2(
					elm$core$List$map,
					function (im) {
						return author$project$Document$Cell(
							{
								p: _Utils_ap(
									_List_fromArray(
										[
											author$project$Document$Height(
											elm$core$Basics$floor(im.bA)),
											author$project$Document$Width(
											elm$core$Basics$floor(im.bj))
										]),
									im.p),
								aa: author$project$Document$Image(im.bz),
								c: im.c
							});
					},
					imgsScaledToFitContainer));
		}
	});
var mdgriffith$elm_ui$Element$Phone = 0;
var mdgriffith$elm_ui$Element$Tablet = 1;
var mdgriffith$elm_ui$Element$BigDesktop = 3;
var mdgriffith$elm_ui$Element$Desktop = 2;
var mdgriffith$elm_ui$Element$Landscape = 1;
var mdgriffith$elm_ui$Element$Portrait = 0;
var mdgriffith$elm_ui$Element$classifyDevice = function (window) {
	return {
		be: (window.hL <= 600) ? 0 : (((window.hL > 600) && (window.hL <= 1200)) ? 1 : (((window.hL > 1200) && (window.hL <= 1800)) ? 2 : 3)),
		dJ: (_Utils_cmp(window.hL, window.fL) < 0) ? 0 : 1
	};
};
var author$project$DocumentResponsive$responsivePreFormat = F2(
	function (config, document) {
		var device = mdgriffith$elm_ui$Element$classifyDevice(config);
		if (!document.$) {
			var nv = document.a;
			var containerLabel = nv.ak;
			var id = nv.c;
			var attrs = nv.p;
			var children = document.b;
			switch (containerLabel) {
				case 0:
					var addColImgClass = function (doc) {
						if (doc.$ === 1) {
							var l = doc;
							var lv = l.a;
							var _n3 = lv.aa;
							if (!_n3.$) {
								var meta = _n3.a;
								var lId = lv.c;
								return author$project$Document$Cell(
									{
										p: lv.p,
										aa: lv.aa,
										c: _Utils_update(
											lId,
											{
												aj: A2(elm$core$Set$insert, 'colImg', lId.aj)
											})
									});
							} else {
								return l;
							}
						} else {
							var doc_ = doc;
							return doc_;
						}
					};
					var children_ = A2(elm$core$List$map, addColImgClass, children);
					return A2(
						author$project$Document$Container,
						nv,
						A2(
							elm$core$List$map,
							author$project$DocumentResponsive$responsivePreFormat(config),
							children_));
				case 1:
					if (A2(author$project$Document$hasClass, 'sameHeightImgsRow', document) && A2(author$project$Document$containsOnly, author$project$Document$isImage, document)) {
						var _n4 = A2(elm$core$Dict$get, id.bc, config.g_);
						if (!_n4.$) {
							var docWidth = _n4.a.ft;
							var docHeight = _n4.a.fs;
							return A2(author$project$DocumentResponsive$renderSameHeightImgRow, docWidth, document);
						} else {
							return A2(author$project$DocumentResponsive$renderSameHeightImgRow, config.hL, document);
						}
					} else {
						if ((!device.be) || (device.be === 1)) {
							return A2(
								author$project$DocumentResponsive$responsivePreFormat,
								config,
								A2(
									author$project$Document$Container,
									_Utils_update(
										nv,
										{ak: 0}),
									children));
						} else {
							return A2(
								author$project$Document$Container,
								nv,
								A2(
									elm$core$List$map,
									author$project$DocumentResponsive$responsivePreFormat(config),
									children));
						}
					}
				case 2:
					return ((!device.be) || (device.be === 1)) ? A2(
						author$project$DocumentResponsive$responsivePreFormat,
						config,
						A2(
							author$project$Document$Container,
							_Utils_update(
								nv,
								{ak: 0}),
							children)) : A2(
						author$project$Document$Container,
						nv,
						A2(
							elm$core$List$map,
							author$project$DocumentResponsive$responsivePreFormat(config),
							children));
				default:
					return A2(
						author$project$Document$Container,
						nv,
						A2(
							elm$core$List$map,
							author$project$DocumentResponsive$responsivePreFormat(config),
							children));
			}
		} else {
			var l = document;
			var cellContent = l.a.aa;
			var id = l.a.c;
			var attrs = l.a.p;
			switch (cellContent.$) {
				case 0:
					var meta = cellContent.a;
					return l;
				case 1:
					var meta = cellContent.a;
					return l;
				case 4:
					var xs = cellContent.a;
					return l;
				case 2:
					var meta = cellContent.a;
					return (((!device.be) || (device.be === 1)) && (_Utils_cmp(meta.gi, meta.gj) > 0)) ? author$project$Document$Cell(
						{
							p: attrs,
							aa: author$project$Document$Table(
								author$project$DocumentResponsive$flipTable(meta)),
							c: id
						}) : l;
				case 3:
					var s = cellContent.a;
					return l;
				default:
					return l;
			}
		}
	});
var elm$html$Html$Attributes$id = elm$html$Html$Attributes$stringProperty('id');
var mdgriffith$elm_ui$Element$htmlAttribute = mdgriffith$elm_ui$Internal$Model$Attr;
var author$project$DocumentView$idStyle = F2(
	function (_n0, _n1) {
		var customStyles = _n0.fm;
		var uid = _n1.bc;
		var docStyleId = _n1.al;
		var htmlId = _n1.ao;
		var classes = _n1.aj;
		return _Utils_ap(
			A2(
				elm$core$Maybe$withDefault,
				_List_Nil,
				A2(
					elm$core$Maybe$andThen,
					function (id) {
						return A2(elm$core$Dict$get, id, customStyles.fQ);
					},
					docStyleId)),
			_Utils_ap(
				A2(
					elm$core$Maybe$withDefault,
					_List_Nil,
					A2(
						elm$core$Maybe$map,
						function (hid) {
							return _List_fromArray(
								[
									mdgriffith$elm_ui$Element$htmlAttribute(
									elm$html$Html$Attributes$id(hid))
								]);
						},
						htmlId)),
				elm$core$List$concat(
					A2(
						elm$core$List$filterMap,
						function (c) {
							return A2(elm$core$Dict$get, c, customStyles.aj);
						},
						elm$core$Set$toList(classes)))));
	});
var author$project$Document$toSeColor = function (_n0) {
	var r = _n0.a;
	var g = _n0.b;
	var b = _n0.c;
	return A3(mdgriffith$elm_ui$Element$rgb, r, g, b);
};
var elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var elm$html$Html$Attributes$style = elm$virtual_dom$VirtualDom$style;
var mdgriffith$elm_ui$Internal$Model$Left = 0;
var mdgriffith$elm_ui$Element$alignLeft = mdgriffith$elm_ui$Internal$Model$AlignX(0);
var mdgriffith$elm_ui$Internal$Model$Right = 2;
var mdgriffith$elm_ui$Element$alignRight = mdgriffith$elm_ui$Internal$Model$AlignX(2);
var mdgriffith$elm_ui$Internal$Model$paddingName = F4(
	function (top, right, bottom, left) {
		return 'pad-' + (elm$core$String$fromInt(top) + ('-' + (elm$core$String$fromInt(right) + ('-' + (elm$core$String$fromInt(bottom) + ('-' + elm$core$String$fromInt(left)))))));
	});
var mdgriffith$elm_ui$Element$paddingEach = function (_n0) {
	var top = _n0.hA;
	var right = _n0.gK;
	var bottom = _n0.eO;
	var left = _n0.f5;
	return (_Utils_eq(top, right) && (_Utils_eq(top, bottom) && _Utils_eq(top, left))) ? A2(
		mdgriffith$elm_ui$Internal$Model$StyleClass,
		mdgriffith$elm_ui$Internal$Flag$padding,
		A5(
			mdgriffith$elm_ui$Internal$Model$PaddingStyle,
			'p-' + elm$core$String$fromInt(top),
			top,
			top,
			top,
			top)) : A2(
		mdgriffith$elm_ui$Internal$Model$StyleClass,
		mdgriffith$elm_ui$Internal$Flag$padding,
		A5(
			mdgriffith$elm_ui$Internal$Model$PaddingStyle,
			A4(mdgriffith$elm_ui$Internal$Model$paddingName, top, right, bottom, left),
			top,
			right,
			bottom,
			left));
};
var mdgriffith$elm_ui$Internal$Model$Px = function (a) {
	return {$: 0, a: a};
};
var mdgriffith$elm_ui$Element$px = mdgriffith$elm_ui$Internal$Model$Px;
var mdgriffith$elm_ui$Element$spacingXY = F2(
	function (x, y) {
		return A2(
			mdgriffith$elm_ui$Internal$Model$StyleClass,
			mdgriffith$elm_ui$Internal$Flag$spacing,
			A3(
				mdgriffith$elm_ui$Internal$Model$SpacingStyle,
				A2(mdgriffith$elm_ui$Internal$Model$spacingName, x, y),
				x,
				y));
	});
var mdgriffith$elm_ui$Internal$Flag$borderStyle = mdgriffith$elm_ui$Internal$Flag$flag(11);
var mdgriffith$elm_ui$Element$Border$solid = A2(mdgriffith$elm_ui$Internal$Model$Class, mdgriffith$elm_ui$Internal$Flag$borderStyle, mdgriffith$elm_ui$Internal$Style$classes.eN);
var elm$html$Html$Events$onDoubleClick = function (msg) {
	return A2(
		elm$html$Html$Events$on,
		'dblclick',
		elm$json$Json$Decode$succeed(msg));
};
var mdgriffith$elm_ui$Element$Events$onDoubleClick = A2(elm$core$Basics$composeL, mdgriffith$elm_ui$Internal$Model$Attr, elm$html$Html$Events$onDoubleClick);
var mdgriffith$elm_ui$Element$Font$alignLeft = A2(mdgriffith$elm_ui$Internal$Model$Class, mdgriffith$elm_ui$Internal$Flag$fontAlignment, mdgriffith$elm_ui$Internal$Style$classes.hn);
var mdgriffith$elm_ui$Element$Font$alignRight = A2(mdgriffith$elm_ui$Internal$Model$Class, mdgriffith$elm_ui$Internal$Flag$fontAlignment, mdgriffith$elm_ui$Internal$Style$classes.hr);
var mdgriffith$elm_ui$Element$Font$italic = mdgriffith$elm_ui$Internal$Model$htmlClass(mdgriffith$elm_ui$Internal$Style$classes.f2);
var mdgriffith$elm_ui$Element$Font$justify = A2(mdgriffith$elm_ui$Internal$Model$Class, mdgriffith$elm_ui$Internal$Flag$fontAlignment, mdgriffith$elm_ui$Internal$Style$classes.hm);
var author$project$DocumentView$renderAttrs = F2(
	function (config, attrs) {
		var device = mdgriffith$elm_ui$Element$classifyDevice(config);
		var renderAttr = function (attr) {
			switch (attr.$) {
				case 0:
					var pad = attr.a;
					return _List_fromArray(
						[
							mdgriffith$elm_ui$Element$paddingEach(pad)
						]);
				case 1:
					var spcX = attr.a;
					var spcY = attr.b;
					return _List_fromArray(
						[
							A2(mdgriffith$elm_ui$Element$spacingXY, spcX, spcY)
						]);
				case 2:
					return ((!device.be) || (device.be === 1)) ? _List_fromArray(
						[mdgriffith$elm_ui$Element$centerX]) : _Utils_ap(
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$alignRight,
								mdgriffith$elm_ui$Element$paddingEach(
								{eO: 0, f5: 15, gK: 0, hA: 0})
							]),
						config.fu ? _List_fromArray(
							[
								mdgriffith$elm_ui$Element$htmlAttribute(
								A2(elm$html$Html$Attributes$style, 'z-index', '1'))
							]) : _List_Nil);
				case 3:
					return ((!device.be) || (device.be === 1)) ? _List_fromArray(
						[mdgriffith$elm_ui$Element$centerX]) : _Utils_ap(
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$alignLeft,
								mdgriffith$elm_ui$Element$paddingEach(
								{eO: 0, f5: 0, gK: 15, hA: 0})
							]),
						config.fu ? _List_fromArray(
							[
								mdgriffith$elm_ui$Element$htmlAttribute(
								A2(elm$html$Html$Attributes$style, 'z-index', '1'))
							]) : _List_Nil);
				case 4:
					return _List_fromArray(
						[mdgriffith$elm_ui$Element$pointer]);
				case 5:
					var color = attr.a;
					return _List_fromArray(
						[
							mdgriffith$elm_ui$Element$Background$color(
							author$project$Document$toSeColor(color))
						]);
				case 6:
					var n = attr.a;
					return _List_fromArray(
						[
							mdgriffith$elm_ui$Element$width(
							mdgriffith$elm_ui$Element$px(n))
						]);
				case 7:
					var n = attr.a;
					return _List_fromArray(
						[
							mdgriffith$elm_ui$Element$height(
							mdgriffith$elm_ui$Element$px(n))
						]);
				case 8:
					return _List_fromArray(
						[
							mdgriffith$elm_ui$Element$Border$color(
							A3(mdgriffith$elm_ui$Element$rgb, 127, 127, 127)),
							mdgriffith$elm_ui$Element$Border$width(1),
							mdgriffith$elm_ui$Element$Border$solid
						]);
				case 10:
					var color = attr.a;
					return _List_fromArray(
						[
							mdgriffith$elm_ui$Element$Font$color(
							author$project$Document$toSeColor(color))
						]);
				case 9:
					var s = attr.a;
					return _List_fromArray(
						[
							mdgriffith$elm_ui$Element$Font$family(
							_List_fromArray(
								[
									mdgriffith$elm_ui$Element$Font$typeface(s)
								]))
						]);
				case 13:
					return _List_fromArray(
						[mdgriffith$elm_ui$Element$Font$alignRight]);
				case 12:
					return _List_fromArray(
						[mdgriffith$elm_ui$Element$Font$alignLeft]);
				case 11:
					var n = attr.a;
					return _List_fromArray(
						[
							mdgriffith$elm_ui$Element$Font$size(n)
						]);
				case 14:
					return _List_fromArray(
						[mdgriffith$elm_ui$Element$Font$center]);
				case 15:
					return _List_fromArray(
						[mdgriffith$elm_ui$Element$Font$justify]);
				case 16:
					return _List_fromArray(
						[mdgriffith$elm_ui$Element$Font$bold]);
				case 17:
					return _List_fromArray(
						[mdgriffith$elm_ui$Element$Font$italic]);
				default:
					var uid = attr.a;
					var zipperEventHandler = attr.b;
					var _n1 = config.hN;
					if (_n1.$ === 1) {
						return _List_Nil;
					} else {
						var handlers = _n1.a;
						switch (zipperEventHandler) {
							case 0:
								return _List_fromArray(
									[
										mdgriffith$elm_ui$Element$Events$onClick(
										handlers.e8(uid))
									]);
							case 1:
								return _List_fromArray(
									[
										mdgriffith$elm_ui$Element$Events$onDoubleClick(
										handlers.e9(uid))
									]);
							case 2:
								return _List_fromArray(
									[
										mdgriffith$elm_ui$Element$mouseOver(
										_List_fromArray(
											[
												mdgriffith$elm_ui$Element$Background$color(
												A4(mdgriffith$elm_ui$Element$rgba, 0.8, 0.8, 0.8, 0.5))
											])),
										mdgriffith$elm_ui$Element$pointer,
										mdgriffith$elm_ui$Element$htmlAttribute(
										A2(elm$html$Html$Attributes$style, 'transition', '0.3s'))
									]);
							case 4:
								return _List_fromArray(
									[
										mdgriffith$elm_ui$Element$pointer,
										mdgriffith$elm_ui$Element$mouseOver(
										_List_fromArray(
											[
												mdgriffith$elm_ui$Element$Background$color(
												A4(mdgriffith$elm_ui$Element$rgba, 0.8, 0.8, 0.8, 0.5))
											])),
										mdgriffith$elm_ui$Element$htmlAttribute(
										A2(elm$html$Html$Attributes$style, 'transition', '0.3s')),
										mdgriffith$elm_ui$Element$Events$onDoubleClick(handlers.eW)
									]);
							default:
								return _List_fromArray(
									[
										mdgriffith$elm_ui$Element$Events$onClick(
										handlers.gk(uid)),
										mdgriffith$elm_ui$Element$pointer
									]);
						}
					}
			}
		};
		return A2(elm$core$List$concatMap, renderAttr, attrs);
	});
var mdgriffith$elm_ui$Element$none = mdgriffith$elm_ui$Internal$Model$Empty;
var author$project$DocumentView$renderCustomElement = F4(
	function (config, id, attrs, s) {
		return _List_fromArray(
			[
				A2(
				elm$core$Maybe$withDefault,
				mdgriffith$elm_ui$Element$none,
				A2(elm$core$Dict$get, s, config.fl))
			]);
	});
var mdgriffith$elm_ui$Internal$Model$CenterY = 1;
var mdgriffith$elm_ui$Element$centerY = mdgriffith$elm_ui$Internal$Model$AlignY(1);
var author$project$DocumentView$renderEmptyCell = F3(
	function (config, id, attrs) {
		return _List_fromArray(
			[
				A2(
				mdgriffith$elm_ui$Element$row,
				_Utils_ap(
					_List_fromArray(
						[
							mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill),
							mdgriffith$elm_ui$Element$height(
							mdgriffith$elm_ui$Element$px(100)),
							mdgriffith$elm_ui$Element$Background$color(
							A4(mdgriffith$elm_ui$Element$rgba, 0, 0, 1, 0.2))
						]),
					_Utils_ap(
						A2(author$project$DocumentView$idStyle, config.g8, id),
						A2(author$project$DocumentView$renderAttrs, config, attrs))),
				_List_fromArray(
					[
						A2(
						mdgriffith$elm_ui$Element$el,
						_List_fromArray(
							[mdgriffith$elm_ui$Element$centerX, mdgriffith$elm_ui$Element$centerY]),
						mdgriffith$elm_ui$Element$text('Cellule vide'))
					]))
			]);
	});
var elm$html$Html$img = _VirtualDom_node('img');
var elm$html$Html$Attributes$src = function (url) {
	return A2(
		elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var mdgriffith$elm_ui$Internal$Model$unstyled = A2(elm$core$Basics$composeL, mdgriffith$elm_ui$Internal$Model$Unstyled, elm$core$Basics$always);
var mdgriffith$elm_ui$Element$html = mdgriffith$elm_ui$Internal$Model$unstyled;
var author$project$DocumentView$renderImage = F4(
	function (config, id, attrs, _n0) {
		var uid = id.bc;
		var docStyleId = id.al;
		var classes = id.aj;
		var src = _n0.d9;
		var caption = _n0.eV;
		var size = _n0.d7;
		var src_ = function () {
			if (src.$ === 1) {
				var f = src.a;
				var s = src.b;
				return s;
			} else {
				var s = src.a;
				return s;
			}
		}();
		var device = mdgriffith$elm_ui$Element$classifyDevice(config);
		var attrs_ = _Utils_ap(
			_List_fromArray(
				[
					mdgriffith$elm_ui$Element$width(
					A2(mdgriffith$elm_ui$Element$maximum, size.fV, mdgriffith$elm_ui$Element$fill))
				]),
			_Utils_ap(
				config.g8.fT,
				_Utils_ap(
					A2(author$project$DocumentView$idStyle, config.g8, id),
					A2(author$project$DocumentView$renderAttrs, config, attrs))));
		return _List_fromArray(
			[
				A2(
				mdgriffith$elm_ui$Element$el,
				attrs_,
				mdgriffith$elm_ui$Element$html(
					A2(
						elm$html$Html$img,
						_List_fromArray(
							[
								A2(elm$html$Html$Attributes$style, 'width', '100%'),
								A2(elm$html$Html$Attributes$style, 'height', 'auto'),
								A2(
								elm$html$Html$Events$on,
								'load',
								elm$json$Json$Decode$succeed(
									config.gq(uid))),
								elm$html$Html$Attributes$src(src_)
							]),
						_List_Nil)))
			]);
	});
var mdgriffith$elm_ui$Element$InternalIndexedColumn = function (a) {
	return {$: 0, a: a};
};
var elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			elm$core$List$any,
			A2(elm$core$Basics$composeL, elm$core$Basics$not, isOkay),
			list);
	});
var elm$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (n <= 0) {
				return result;
			} else {
				var $temp$result = A2(elm$core$List$cons, value, result),
					$temp$n = n - 1,
					$temp$value = value;
				result = $temp$result;
				n = $temp$n;
				value = $temp$value;
				continue repeatHelp;
			}
		}
	});
var elm$core$List$repeat = F2(
	function (n, value) {
		return A3(elm$core$List$repeatHelp, _List_Nil, n, value);
	});
var mdgriffith$elm_ui$Internal$Flag$gridPosition = mdgriffith$elm_ui$Internal$Flag$flag(35);
var mdgriffith$elm_ui$Internal$Flag$gridTemplate = mdgriffith$elm_ui$Internal$Flag$flag(34);
var mdgriffith$elm_ui$Internal$Model$GridPosition = function (a) {
	return {$: 9, a: a};
};
var mdgriffith$elm_ui$Internal$Model$GridTemplateStyle = function (a) {
	return {$: 8, a: a};
};
var mdgriffith$elm_ui$Internal$Model$AsGrid = 3;
var mdgriffith$elm_ui$Internal$Model$asGrid = 3;
var mdgriffith$elm_ui$Internal$Model$getSpacing = F2(
	function (attrs, _default) {
		return A2(
			elm$core$Maybe$withDefault,
			_default,
			A3(
				elm$core$List$foldr,
				F2(
					function (attr, acc) {
						if (!acc.$) {
							var x = acc.a;
							return elm$core$Maybe$Just(x);
						} else {
							if ((attr.$ === 4) && (attr.b.$ === 5)) {
								var _n2 = attr.b;
								var x = _n2.b;
								var y = _n2.c;
								return elm$core$Maybe$Just(
									_Utils_Tuple2(x, y));
							} else {
								return elm$core$Maybe$Nothing;
							}
						}
					}),
				elm$core$Maybe$Nothing,
				attrs));
	});
var mdgriffith$elm_ui$Element$tableHelper = F2(
	function (attrs, config) {
		var onGrid = F3(
			function (rowLevel, columnLevel, elem) {
				return A4(
					mdgriffith$elm_ui$Internal$Model$element,
					mdgriffith$elm_ui$Internal$Model$asEl,
					mdgriffith$elm_ui$Internal$Model$div,
					_List_fromArray(
						[
							A2(
							mdgriffith$elm_ui$Internal$Model$StyleClass,
							mdgriffith$elm_ui$Internal$Flag$gridPosition,
							mdgriffith$elm_ui$Internal$Model$GridPosition(
								{c7: columnLevel, fL: 1, d$: rowLevel, hL: 1}))
						]),
					mdgriffith$elm_ui$Internal$Model$Unkeyed(
						_List_fromArray(
							[elem])));
			});
		var columnWidth = function (col) {
			if (!col.$) {
				var colConfig = col.a;
				return colConfig.hL;
			} else {
				var colConfig = col.a;
				return colConfig.hL;
			}
		};
		var columnHeader = function (col) {
			if (!col.$) {
				var colConfig = col.a;
				return colConfig.fJ;
			} else {
				var colConfig = col.a;
				return colConfig.fJ;
			}
		};
		var maybeHeaders = function (headers) {
			return A2(
				elm$core$List$all,
				elm$core$Basics$eq(mdgriffith$elm_ui$Internal$Model$Empty),
				headers) ? elm$core$Maybe$Nothing : elm$core$Maybe$Just(
				A2(
					elm$core$List$indexedMap,
					F2(
						function (col, header) {
							return A3(onGrid, 1, col + 1, header);
						}),
					headers));
		}(
			A2(elm$core$List$map, columnHeader, config.e6));
		var add = F3(
			function (cell, columnConfig, cursor) {
				if (!columnConfig.$) {
					var col = columnConfig.a;
					return _Utils_update(
						cursor,
						{
							aw: cursor.aw + 1,
							am: A2(
								elm$core$List$cons,
								A3(
									onGrid,
									cursor.d$,
									cursor.aw,
									A2(
										col.hJ,
										_Utils_eq(maybeHeaders, elm$core$Maybe$Nothing) ? (cursor.d$ - 1) : (cursor.d$ - 2),
										cell)),
								cursor.am)
						});
				} else {
					var col = columnConfig.a;
					return {
						aw: cursor.aw + 1,
						am: A2(
							elm$core$List$cons,
							A3(
								onGrid,
								cursor.d$,
								cursor.aw,
								col.hJ(cell)),
							cursor.am),
						d$: cursor.d$
					};
				}
			});
		var build = F3(
			function (columns, rowData, cursor) {
				var newCursor = A3(
					elm$core$List$foldl,
					add(rowData),
					cursor,
					columns);
				return {aw: 1, am: newCursor.am, d$: cursor.d$ + 1};
			});
		var children = A3(
			elm$core$List$foldl,
			build(config.e6),
			{
				aw: 1,
				am: _List_Nil,
				d$: _Utils_eq(maybeHeaders, elm$core$Maybe$Nothing) ? 1 : 2
			},
			config.fn);
		var _n0 = A2(
			mdgriffith$elm_ui$Internal$Model$getSpacing,
			attrs,
			_Utils_Tuple2(0, 0));
		var sX = _n0.a;
		var sY = _n0.b;
		var template = A2(
			mdgriffith$elm_ui$Internal$Model$StyleClass,
			mdgriffith$elm_ui$Internal$Flag$gridTemplate,
			mdgriffith$elm_ui$Internal$Model$GridTemplateStyle(
				{
					e6: A2(elm$core$List$map, columnWidth, config.e6),
					gM: A2(
						elm$core$List$repeat,
						elm$core$List$length(config.fn),
						mdgriffith$elm_ui$Internal$Model$Content),
					g0: _Utils_Tuple2(
						mdgriffith$elm_ui$Element$px(sX),
						mdgriffith$elm_ui$Element$px(sY))
				}));
		return A4(
			mdgriffith$elm_ui$Internal$Model$element,
			mdgriffith$elm_ui$Internal$Model$asGrid,
			mdgriffith$elm_ui$Internal$Model$div,
			A2(
				elm$core$List$cons,
				mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill),
				A2(elm$core$List$cons, template, attrs)),
			mdgriffith$elm_ui$Internal$Model$Unkeyed(
				function () {
					if (maybeHeaders.$ === 1) {
						return children.am;
					} else {
						var renderedHeaders = maybeHeaders.a;
						return _Utils_ap(
							renderedHeaders,
							elm$core$List$reverse(children.am));
					}
				}()));
	});
var mdgriffith$elm_ui$Element$indexedTable = F2(
	function (attrs, config) {
		return A2(
			mdgriffith$elm_ui$Element$tableHelper,
			attrs,
			{
				e6: A2(elm$core$List$map, mdgriffith$elm_ui$Element$InternalIndexedColumn, config.e6),
				fn: config.fn
			});
	});
var mdgriffith$elm_ui$Internal$Model$Min = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var mdgriffith$elm_ui$Element$minimum = F2(
	function (i, l) {
		return A2(mdgriffith$elm_ui$Internal$Model$Min, i, l);
	});
var mdgriffith$elm_ui$Internal$Model$Paragraph = {$: 9};
var mdgriffith$elm_ui$Element$paragraph = F2(
	function (attrs, children) {
		return A4(
			mdgriffith$elm_ui$Internal$Model$element,
			mdgriffith$elm_ui$Internal$Model$asParagraph,
			mdgriffith$elm_ui$Internal$Model$div,
			A2(
				elm$core$List$cons,
				mdgriffith$elm_ui$Internal$Model$Describe(mdgriffith$elm_ui$Internal$Model$Paragraph),
				A2(
					elm$core$List$cons,
					mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill),
					A2(
						elm$core$List$cons,
						mdgriffith$elm_ui$Element$spacing(5),
						attrs))),
			mdgriffith$elm_ui$Internal$Model$Unkeyed(children));
	});
var mdgriffith$elm_ui$Element$scrollbarX = A2(mdgriffith$elm_ui$Internal$Model$Class, mdgriffith$elm_ui$Internal$Flag$overflow, mdgriffith$elm_ui$Internal$Style$classes.gP);
var author$project$DocumentView$renderTable = F4(
	function (config, id, attrs, _n0) {
		var style = _n0.g7;
		var nbrRows = _n0.gj;
		var nbrCols = _n0.gi;
		var data = _n0.fn;
		var columns = A2(
			elm$core$List$map,
			function (ci) {
				return {
					fJ: mdgriffith$elm_ui$Element$none,
					hJ: F2(
						function (ri, row) {
							return A2(
								mdgriffith$elm_ui$Element$el,
								function (s) {
									return A2(
										elm$core$List$cons,
										mdgriffith$elm_ui$Element$height(mdgriffith$elm_ui$Element$fill),
										s);
								}(
									A2(
										elm$core$Maybe$withDefault,
										_List_Nil,
										A2(
											elm$core$Maybe$map,
											function ($) {
												return $.fa;
											},
											A2(elm$core$Dict$get, style, author$project$StyleSheets$tableStyles)))),
								A2(
									mdgriffith$elm_ui$Element$el,
									_Utils_ap(
										A2(
											elm$core$Maybe$withDefault,
											function (_n1) {
												return _List_Nil;
											},
											A2(
												elm$core$Maybe$map,
												function ($) {
													return $.eX;
												},
												A2(elm$core$Dict$get, style, author$project$StyleSheets$tableStyles)))(ri),
										_List_fromArray(
											[
												A2(mdgriffith$elm_ui$Element$paddingXY, 15, 5),
												mdgriffith$elm_ui$Element$height(
												A2(mdgriffith$elm_ui$Element$minimum, 30, mdgriffith$elm_ui$Element$fill))
											])),
									A2(
										mdgriffith$elm_ui$Element$paragraph,
										_List_Nil,
										_List_fromArray(
											[
												mdgriffith$elm_ui$Element$text(
												A2(
													elm$core$Maybe$withDefault,
													'',
													A2(elm$core$Array$get, ci, row)))
											]))));
						}),
					hL: mdgriffith$elm_ui$Element$fill
				};
			},
			A2(elm$core$List$range, 0, nbrCols - 1));
		return _List_fromArray(
			[
				A2(
				mdgriffith$elm_ui$Element$indexedTable,
				_Utils_ap(
					A2(
						elm$core$Maybe$withDefault,
						_List_Nil,
						A2(
							elm$core$Maybe$map,
							function ($) {
								return $.hd;
							},
							A2(elm$core$Dict$get, style, author$project$StyleSheets$tableStyles))),
					_Utils_ap(
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill),
								mdgriffith$elm_ui$Element$scrollbarX
							]),
						_Utils_ap(
							A2(author$project$DocumentView$idStyle, config.g8, id),
							A2(author$project$DocumentView$renderAttrs, config, attrs)))),
				{e6: columns, fn: data})
			]);
	});
var elm$html$Html$Attributes$href = function (url) {
	return A2(
		elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var elm$html$Html$Attributes$rel = _VirtualDom_attribute('rel');
var mdgriffith$elm_ui$Element$link = F2(
	function (attrs, _n0) {
		var url = _n0.hG;
		var label = _n0.b4;
		return A4(
			mdgriffith$elm_ui$Internal$Model$element,
			mdgriffith$elm_ui$Internal$Model$asEl,
			mdgriffith$elm_ui$Internal$Model$NodeName('a'),
			A2(
				elm$core$List$cons,
				mdgriffith$elm_ui$Internal$Model$Attr(
					elm$html$Html$Attributes$href(url)),
				A2(
					elm$core$List$cons,
					mdgriffith$elm_ui$Internal$Model$Attr(
						elm$html$Html$Attributes$rel('noopener noreferrer')),
					A2(
						elm$core$List$cons,
						mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$shrink),
						A2(
							elm$core$List$cons,
							mdgriffith$elm_ui$Element$height(mdgriffith$elm_ui$Element$shrink),
							A2(
								elm$core$List$cons,
								mdgriffith$elm_ui$Internal$Model$htmlClass(mdgriffith$elm_ui$Internal$Style$classes.bW + (' ' + mdgriffith$elm_ui$Internal$Style$classes.ax)),
								attrs))))),
			mdgriffith$elm_ui$Internal$Model$Unkeyed(
				_List_fromArray(
					[label])));
	});
var elm$html$Html$Attributes$target = elm$html$Html$Attributes$stringProperty('target');
var mdgriffith$elm_ui$Element$newTabLink = F2(
	function (attrs, _n0) {
		var url = _n0.hG;
		var label = _n0.b4;
		return A4(
			mdgriffith$elm_ui$Internal$Model$element,
			mdgriffith$elm_ui$Internal$Model$asEl,
			mdgriffith$elm_ui$Internal$Model$NodeName('a'),
			A2(
				elm$core$List$cons,
				mdgriffith$elm_ui$Internal$Model$Attr(
					elm$html$Html$Attributes$href(url)),
				A2(
					elm$core$List$cons,
					mdgriffith$elm_ui$Internal$Model$Attr(
						elm$html$Html$Attributes$rel('noopener noreferrer')),
					A2(
						elm$core$List$cons,
						mdgriffith$elm_ui$Internal$Model$Attr(
							elm$html$Html$Attributes$target('_blank')),
						A2(
							elm$core$List$cons,
							mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$shrink),
							A2(
								elm$core$List$cons,
								mdgriffith$elm_ui$Element$height(mdgriffith$elm_ui$Element$shrink),
								A2(
									elm$core$List$cons,
									mdgriffith$elm_ui$Internal$Model$htmlClass(mdgriffith$elm_ui$Internal$Style$classes.bW + (' ' + mdgriffith$elm_ui$Internal$Style$classes.ax)),
									attrs)))))),
			mdgriffith$elm_ui$Internal$Model$Unkeyed(
				_List_fromArray(
					[label])));
	});
var author$project$DocumentView$renderTextBlockPrimitive = F3(
	function (config, tbAttrs, p) {
		if (!p.$) {
			var attrs = p.a;
			var s = p.b;
			return A2(
				mdgriffith$elm_ui$Element$el,
				_Utils_ap(
					config.g8.ht,
					_Utils_ap(
						A2(author$project$DocumentView$renderAttrs, config, tbAttrs),
						A2(author$project$DocumentView$renderAttrs, config, attrs))),
				mdgriffith$elm_ui$Element$text(s));
		} else {
			var attrs = p.a;
			var targetBlank = p.b.hf;
			var url = p.b.hG;
			var label = p.b.b4;
			var linkFun = targetBlank ? mdgriffith$elm_ui$Element$newTabLink : mdgriffith$elm_ui$Element$link;
			return A2(
				linkFun,
				_Utils_ap(
					config.g8.f6,
					_Utils_ap(
						A2(author$project$DocumentView$renderAttrs, config, tbAttrs),
						A2(author$project$DocumentView$renderAttrs, config, attrs))),
				{
					b4: mdgriffith$elm_ui$Element$text(label),
					hG: url
				});
		}
	});
var author$project$DocumentView$renderLi = F3(
	function (config, tbAttrs, li) {
		return A2(
			mdgriffith$elm_ui$Element$paragraph,
			_Utils_ap(
				_List_fromArray(
					[
						mdgriffith$elm_ui$Element$paddingEach(
						{eO: 0, f5: 20, gK: 0, hA: 0})
					]),
				A2(author$project$DocumentView$renderAttrs, config, tbAttrs)),
			_Utils_ap(
				_List_fromArray(
					[
						A2(
						mdgriffith$elm_ui$Element$el,
						_List_Nil,
						mdgriffith$elm_ui$Element$text('•  '))
					]),
				A2(
					elm$core$List$map,
					A2(author$project$DocumentView$renderTextBlockPrimitive, config, tbAttrs),
					li)));
	});
var mdgriffith$elm_ui$Internal$Model$Heading = function (a) {
	return {$: 4, a: a};
};
var mdgriffith$elm_ui$Element$Region$heading = A2(elm$core$Basics$composeL, mdgriffith$elm_ui$Internal$Model$Describe, mdgriffith$elm_ui$Internal$Model$Heading);
var author$project$DocumentView$renderTextBlockElement = F4(
	function (config, id, tbAttrs, tbe) {
		switch (tbe.$) {
			case 0:
				var attrs = tbe.a;
				var xs = tbe.b;
				return A2(
					mdgriffith$elm_ui$Element$paragraph,
					_Utils_ap(
						config.g8.gy,
						_Utils_ap(
							A2(author$project$DocumentView$idStyle, config.g8, id),
							_Utils_ap(
								A2(author$project$DocumentView$renderAttrs, config, tbAttrs),
								A2(author$project$DocumentView$renderAttrs, config, attrs)))),
					A2(
						elm$core$List$map,
						A2(author$project$DocumentView$renderTextBlockPrimitive, config, tbAttrs),
						xs));
			case 1:
				var attrs = tbe.a;
				var xs = tbe.b;
				return A2(
					mdgriffith$elm_ui$Element$paragraph,
					_Utils_ap(
						A2(author$project$DocumentView$renderAttrs, config, tbAttrs),
						_Utils_ap(
							A2(author$project$DocumentView$idStyle, config.g8, id),
							_Utils_ap(
								A2(author$project$DocumentView$renderAttrs, config, attrs),
								_List_fromArray(
									[
										mdgriffith$elm_ui$Element$spacing(10)
									])))),
					A2(
						elm$core$List$map,
						A2(author$project$DocumentView$renderLi, config, tbAttrs),
						xs));
			case 2:
				var attrs = tbe.a;
				var _n1 = tbe.b;
				var level = _n1.a;
				var s = _n1.b;
				var headingStyle = A2(
					elm$core$Maybe$withDefault,
					_List_Nil,
					A2(elm$core$Dict$get, level, config.g8.fK));
				return A2(
					mdgriffith$elm_ui$Element$paragraph,
					_Utils_ap(
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$Region$heading(level)
							]),
						_Utils_ap(
							headingStyle,
							_Utils_ap(
								A2(author$project$DocumentView$idStyle, config.g8, id),
								_Utils_ap(
									A2(author$project$DocumentView$renderAttrs, config, tbAttrs),
									A2(author$project$DocumentView$renderAttrs, config, attrs))))),
					_List_fromArray(
						[
							mdgriffith$elm_ui$Element$text(s)
						]));
			default:
				var p = tbe.a;
				return A2(
					mdgriffith$elm_ui$Element$el,
					A2(author$project$DocumentView$idStyle, config.g8, id),
					A3(author$project$DocumentView$renderTextBlockPrimitive, config, tbAttrs, p));
		}
	});
var author$project$DocumentView$renderTextBlock = F4(
	function (config, id, attrs, xs) {
		return A2(
			elm$core$List$map,
			A3(author$project$DocumentView$renderTextBlockElement, config, id, attrs),
			xs);
	});
var author$project$DocumentEditorHelpers$buildYoutubeUrl = F2(
	function (src, videoMeta) {
		var params = function (s) {
			return (s === '') ? s : ('?' + s);
		}(
			A2(
				elm$core$String$join,
				'&',
				A2(
					elm$core$List$filterMap,
					elm$core$Basics$identity,
					_List_fromArray(
						[
							A2(
							elm$core$Maybe$map,
							function (n) {
								return 'start=' + elm$core$String$fromInt(n);
							},
							videoMeta.g2),
							(!videoMeta.fE) ? elm$core$Maybe$Just('frameborder=0') : elm$core$Maybe$Nothing,
							(!videoMeta.hc) ? elm$core$Maybe$Just('rel=0') : elm$core$Maybe$Nothing,
							(!videoMeta.ff) ? elm$core$Maybe$Just('controls=0') : elm$core$Maybe$Nothing,
							(!videoMeta.hz) ? elm$core$Maybe$Just('showinfo=0') : elm$core$Maybe$Nothing
						]))));
		return 'https://www.youtube' + ((videoMeta.gF ? '-nocookie' : '') + ('.com/embed/' + (src + params)));
	});
var author$project$DocumentEditorHelpers$noHtmlAttr = elm$html$Html$Attributes$class('');
var elm$html$Html$iframe = _VirtualDom_node('iframe');
var elm$html$Html$Attributes$attribute = elm$virtual_dom$VirtualDom$attribute;
var elm$html$Html$Attributes$height = function (n) {
	return A2(
		_VirtualDom_attribute,
		'height',
		elm$core$String$fromInt(n));
};
var elm$html$Html$Attributes$width = function (n) {
	return A2(
		_VirtualDom_attribute,
		'width',
		elm$core$String$fromInt(n));
};
var author$project$DocumentView$renderVideo = F4(
	function (config, id, attrs, vidMeta) {
		var uid = id.bc;
		var docStyleId = id.al;
		var classes = id.aj;
		var attrs_ = _Utils_ap(
			A2(author$project$DocumentView$idStyle, config.g8, id),
			A2(author$project$DocumentView$renderAttrs, config, attrs));
		return _List_fromArray(
			[
				A2(
				mdgriffith$elm_ui$Element$el,
				attrs_,
				mdgriffith$elm_ui$Element$html(
					A2(
						elm$html$Html$iframe,
						_List_fromArray(
							[
								elm$html$Html$Attributes$src(
								A2(author$project$DocumentEditorHelpers$buildYoutubeUrl, vidMeta.d9, vidMeta)),
								elm$html$Html$Attributes$width(vidMeta.d7.hI),
								elm$html$Html$Attributes$height(vidMeta.d7.hH),
								vidMeta.fE ? author$project$DocumentEditorHelpers$noHtmlAttr : A2(elm$html$Html$Attributes$attribute, 'frameborder', '0'),
								A2(elm$html$Html$Attributes$attribute, 'allowfullscreen', 'true'),
								A2(elm$html$Html$Attributes$attribute, 'allow', 'autoplay; encrypted-media')
							]),
						_List_Nil)))
			]);
	});
var mdgriffith$elm_ui$Internal$Model$AsTextColumn = 5;
var mdgriffith$elm_ui$Internal$Model$asTextColumn = 5;
var mdgriffith$elm_ui$Element$textColumn = F2(
	function (attrs, children) {
		return A4(
			mdgriffith$elm_ui$Internal$Model$element,
			mdgriffith$elm_ui$Internal$Model$asTextColumn,
			mdgriffith$elm_ui$Internal$Model$div,
			A2(
				elm$core$List$cons,
				mdgriffith$elm_ui$Element$width(
					A2(
						mdgriffith$elm_ui$Element$maximum,
						750,
						A2(mdgriffith$elm_ui$Element$minimum, 500, mdgriffith$elm_ui$Element$fill))),
				attrs),
			mdgriffith$elm_ui$Internal$Model$Unkeyed(children));
	});
var author$project$DocumentView$renderColumn = F4(
	function (config, id, attrs, children) {
		return _List_fromArray(
			[
				A2(
				mdgriffith$elm_ui$Element$column,
				_Utils_ap(
					config.g8.e5,
					_Utils_ap(
						config.fb ? _List_fromArray(
							[
								mdgriffith$elm_ui$Element$Background$color(
								A4(mdgriffith$elm_ui$Element$rgba, 0, 1, 0, 0.3))
							]) : _List_Nil,
						_Utils_ap(
							A2(author$project$DocumentView$idStyle, config.g8, id),
							_Utils_ap(
								_List_fromArray(
									[
										mdgriffith$elm_ui$Element$width(
										A2(mdgriffith$elm_ui$Element$maximum, config.hL, mdgriffith$elm_ui$Element$fill))
									]),
								A2(author$project$DocumentView$renderAttrs, config, attrs))))),
				A2(
					elm$core$List$concatMap,
					author$project$DocumentView$renderDoc(config),
					children))
			]);
	});
var author$project$DocumentView$renderDoc = F2(
	function (config, document) {
		var device = mdgriffith$elm_ui$Element$classifyDevice(config);
		if (!document.$) {
			var containerLabel = document.a.ak;
			var id = document.a.c;
			var attrs = document.a.p;
			var children = document.b;
			switch (containerLabel) {
				case 0:
					return A4(author$project$DocumentView$renderColumn, config, id, attrs, children);
				case 1:
					return A4(author$project$DocumentView$renderRow, config, id, attrs, children);
				case 2:
					return A4(author$project$DocumentView$renderTextColumn, config, id, attrs, children);
				default:
					return A4(author$project$DocumentView$renderResponsiveBloc, config, id, attrs, children);
			}
		} else {
			var cellContent = document.a.aa;
			var id = document.a.c;
			var attrs = document.a.p;
			switch (cellContent.$) {
				case 0:
					var meta = cellContent.a;
					return A4(author$project$DocumentView$renderImage, config, id, attrs, meta);
				case 1:
					var meta = cellContent.a;
					return A4(author$project$DocumentView$renderVideo, config, id, attrs, meta);
				case 4:
					var xs = cellContent.a;
					return A4(author$project$DocumentView$renderTextBlock, config, id, attrs, xs);
				case 2:
					var meta = cellContent.a;
					return A4(author$project$DocumentView$renderTable, config, id, attrs, meta);
				case 3:
					var s = cellContent.a;
					return A4(author$project$DocumentView$renderCustomElement, config, id, attrs, s);
				default:
					return A3(author$project$DocumentView$renderEmptyCell, config, id, attrs);
			}
		}
	});
var author$project$DocumentView$renderResponsiveBloc = F4(
	function (config, id, attrs, children) {
		return _List_fromArray(
			[
				A2(
				mdgriffith$elm_ui$Element$row,
				_Utils_ap(
					config.g8.gI,
					_Utils_ap(
						A2(author$project$DocumentView$idStyle, config.g8, id),
						A2(author$project$DocumentView$renderAttrs, config, attrs))),
				A2(
					elm$core$List$concatMap,
					author$project$DocumentView$renderDoc(config),
					children))
			]);
	});
var author$project$DocumentView$renderRow = F4(
	function (config, id, attrs, children) {
		return _List_fromArray(
			[
				A2(
				mdgriffith$elm_ui$Element$row,
				_Utils_ap(
					config.g8.gL,
					_Utils_ap(
						config.fb ? _List_fromArray(
							[
								mdgriffith$elm_ui$Element$Background$color(
								A4(mdgriffith$elm_ui$Element$rgba, 1, 0, 0, 0.3))
							]) : _List_Nil,
						_Utils_ap(
							A2(author$project$DocumentView$idStyle, config.g8, id),
							A2(author$project$DocumentView$renderAttrs, config, attrs)))),
				A2(
					elm$core$List$concatMap,
					author$project$DocumentView$renderDoc(config),
					children))
			]);
	});
var author$project$DocumentView$renderTextColumn = F4(
	function (config, id, attrs, children) {
		return _List_fromArray(
			[
				A2(
				mdgriffith$elm_ui$Element$textColumn,
				_Utils_ap(
					config.g8.hi,
					_Utils_ap(
						config.fb ? _List_fromArray(
							[
								mdgriffith$elm_ui$Element$Background$color(
								A4(mdgriffith$elm_ui$Element$rgba, 0, 0, 1, 0.3))
							]) : _List_Nil,
						_Utils_ap(
							A2(author$project$DocumentView$idStyle, config.g8, id),
							A2(author$project$DocumentView$renderAttrs, config, attrs)))),
				A2(
					elm$core$List$concatMap,
					author$project$DocumentView$renderDoc(config),
					children))
			]);
	});
var author$project$Document$OnCellClick = 4;
var author$project$Document$OnContainerClick = 0;
var author$project$Document$OnContainerDblClick = 1;
var author$project$Document$OnContainerMouseOver = 2;
var author$project$Document$OnNeighbourClick = 3;
var author$project$Document$ZipperAttr = F2(
	function (a, b) {
		return {$: 18, a: a, b: b};
	});
var author$project$Document$addAttrs = F2(
	function (doc, newAttrs) {
		if (doc.$ === 1) {
			var lv = doc.a;
			var cellContent = lv.aa;
			var id = lv.c;
			var attrs = lv.p;
			return author$project$Document$Cell(
				_Utils_update(
					lv,
					{
						p: _Utils_ap(newAttrs, attrs)
					}));
		} else {
			var nv = doc.a;
			var containerLabel = nv.ak;
			var id = nv.c;
			var attrs = nv.p;
			var children = doc.b;
			return A2(
				author$project$Document$Container,
				_Utils_update(
					nv,
					{
						p: _Utils_ap(newAttrs, attrs)
					}),
				children);
		}
	});
var elm$core$Set$remove = F2(
	function (key, _n0) {
		var dict = _n0;
		return A2(elm$core$Dict$remove, key, dict);
	});
var author$project$Document$toogleClass = F2(
	function (_class, document) {
		var newId = function (id) {
			return _Utils_update(
				id,
				{
					aj: A2(elm$core$Set$member, _class, id.aj) ? A2(elm$core$Set$remove, _class, id.aj) : A2(elm$core$Set$insert, _class, id.aj)
				});
		};
		if (!document.$) {
			var nv = document.a;
			var children = document.b;
			return A2(
				author$project$Document$Container,
				_Utils_update(
					nv,
					{
						c: newId(nv.c)
					}),
				children);
		} else {
			var lv = document.a;
			return author$project$Document$Cell(
				_Utils_update(
					lv,
					{
						c: newId(lv.c)
					}));
		}
	});
var author$project$DocumentZipper$applyToContexts = F3(
	function (f, path, zipper) {
		var uid = author$project$Document$getUid(
			author$project$DocumentZipper$extractDoc(zipper));
		var shouldNotApply = function (currentUid) {
			return A2(elm$core$List$member, currentUid, path) || _Utils_eq(currentUid, uid);
		};
		var helper = function (doc) {
			var currentUid = author$project$Document$getUid(doc);
			if (doc.$ === 1) {
				var lv = doc.a;
				return _Utils_eq(currentUid, uid) ? doc : f(doc);
			} else {
				var cv = doc.a;
				var xs = doc.b;
				return A2(elm$core$List$member, currentUid, path) ? (_Utils_eq(currentUid, uid) ? doc : A2(
					author$project$Document$Container,
					cv,
					A2(elm$core$List$map, helper, xs))) : f(
					A2(
						author$project$Document$Container,
						cv,
						A2(elm$core$List$map, helper, xs)));
			}
		};
		var document = author$project$DocumentZipper$extractDoc(
			author$project$DocumentZipper$rewind(zipper));
		return author$project$DocumentZipper$initZip(
			helper(document));
	});
var author$project$DocumentZipper$getPath = function (document) {
	var helper = F2(
		function (doc, acc) {
			helper:
			while (true) {
				var _n0 = author$project$DocumentZipper$zipUp(doc);
				if (_n0.$ === 1) {
					return _Utils_Tuple2(
						A2(
							elm$core$List$cons,
							author$project$Document$getUid(
								author$project$DocumentZipper$extractDoc(doc)),
							acc),
						doc);
				} else {
					var parent = _n0.a;
					var $temp$doc = parent,
						$temp$acc = A2(
						elm$core$List$cons,
						author$project$Document$getUid(
							author$project$DocumentZipper$extractDoc(doc)),
						acc);
					doc = $temp$doc;
					acc = $temp$acc;
					continue helper;
				}
			}
		});
	return A2(helper, document, _List_Nil);
};
var author$project$DocumentZipper$zipDownPath = F2(
	function (path, document) {
		zipDownPath:
		while (true) {
			if (!path.b) {
				return elm$core$Maybe$Just(document);
			} else {
				var uid = path.a;
				var xs = path.b;
				var _n1 = A2(
					author$project$DocumentZipper$zipDown,
					author$project$Document$hasUid(uid),
					document);
				if (_n1.$ === 1) {
					return elm$core$Maybe$Nothing;
				} else {
					var child = _n1.a;
					var $temp$path = xs,
						$temp$document = child;
					path = $temp$path;
					document = $temp$document;
					continue zipDownPath;
				}
			}
		}
	});
var author$project$DocumentZipper$addZipperHandlers = function (dz) {
	var handlers = function (uid) {
		return _List_fromArray(
			[
				A2(author$project$Document$ZipperAttr, uid, 0),
				A2(author$project$Document$ZipperAttr, uid, 1),
				A2(author$project$Document$ZipperAttr, uid, 2)
			]);
	};
	var addHandlersToChild = function (doc) {
		return A2(
			author$project$Document$addAttrs,
			doc,
			handlers(
				author$project$Document$getUid(doc)));
	};
	var addHandlerToNeighbours = function (doc) {
		var path = A2(
			elm$core$Maybe$withDefault,
			_List_Nil,
			elm$core$List$tail(
				author$project$DocumentZipper$getPath(doc).a));
		var newDoc = A3(
			author$project$DocumentZipper$applyToContexts,
			function (d) {
				return A2(
					author$project$Document$addAttrs,
					d,
					_List_fromArray(
						[
							A2(
							author$project$Document$ZipperAttr,
							author$project$Document$getUid(d),
							3)
						]));
			},
			author$project$DocumentZipper$getPath(doc).a,
			doc);
		return A2(
			elm$core$Maybe$withDefault,
			doc,
			A2(author$project$DocumentZipper$zipDownPath, path, newDoc));
	};
	var _n0 = addHandlerToNeighbours(dz);
	var current = _n0.f;
	var contexts = _n0.e;
	var currentWithCssSelectors = A2(author$project$Document$toogleClass, 'selected', current);
	if (!currentWithCssSelectors.$) {
		var nv = currentWithCssSelectors.a;
		var children = currentWithCssSelectors.b;
		return {
			e: contexts,
			f: A2(
				author$project$Document$Container,
				nv,
				A2(elm$core$List$map, addHandlersToChild, children))
		};
	} else {
		var lv = currentWithCssSelectors.a;
		var cellContent = lv.aa;
		var id = lv.c;
		var attrs = lv.p;
		var newCell = author$project$Document$Cell(
			_Utils_update(
				lv,
				{
					p: A2(
						elm$core$List$cons,
						A2(author$project$Document$ZipperAttr, id.bc, 4),
						attrs)
				}));
		return {e: contexts, f: newCell};
	}
};
var mdgriffith$elm_ui$Element$scrollbarY = A2(mdgriffith$elm_ui$Internal$Model$Class, mdgriffith$elm_ui$Internal$Flag$overflow, mdgriffith$elm_ui$Internal$Style$classes.gQ);
var author$project$Editor$documentView = function (model) {
	return A2(
		mdgriffith$elm_ui$Element$column,
		_List_fromArray(
			[
				mdgriffith$elm_ui$Element$scrollbarY,
				mdgriffith$elm_ui$Element$height(mdgriffith$elm_ui$Element$fill),
				mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill),
				mdgriffith$elm_ui$Element$htmlAttribute(
				elm$html$Html$Attributes$id('documentContainer')),
				function () {
				var _n0 = model.Y;
				switch (_n0) {
					case 0:
						return mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill);
					case 1:
						return mdgriffith$elm_ui$Element$width(
							mdgriffith$elm_ui$Element$px(1268));
					case 2:
						return mdgriffith$elm_ui$Element$width(
							mdgriffith$elm_ui$Element$px(1024));
					default:
						return mdgriffith$elm_ui$Element$width(
							mdgriffith$elm_ui$Element$px(480));
				}
			}(),
				mdgriffith$elm_ui$Element$centerX
			]),
		A2(
			author$project$DocumentView$renderDoc,
			model.l,
			A2(
				author$project$DocumentResponsive$responsivePreFormat,
				model.l,
				author$project$DocumentZipper$extractDoc(
					author$project$DocumentZipper$rewind(
						author$project$DocumentZipper$addZipperHandlers(model.a))))));
};
var author$project$Editor$AddNewInside = {$: 17};
var author$project$Editor$AddNewLeft = {$: 18};
var author$project$Editor$AddNewRight = {$: 19};
var author$project$Editor$DeleteSelected = {$: 22};
var author$project$Editor$EditContainer = {$: 15};
var author$project$Editor$SwapLeft = {$: 12};
var author$project$Editor$SwapRight = {$: 13};
var author$project$Editor$iconSize = 18;
var author$project$Editor$Copy = {$: 23};
var author$project$Editor$Cut = {$: 24};
var author$project$Editor$MenuClick = {$: 27};
var author$project$Editor$Paste = {$: 25};
var author$project$Editor$PreviewPhone = 3;
var author$project$Editor$PreviewScreen = 1;
var author$project$Editor$PreviewTablet = 2;
var author$project$Editor$SetEditorPlugin = function (a) {
	return {$: 32, a: a};
};
var author$project$Editor$SetPreviewMode = function (a) {
	return {$: 30, a: a};
};
var author$project$Editor$ToogleCountainersColors = {$: 31};
var author$project$Editor$ToogleFileSys = {$: 33};
var author$project$Editor$TopEntryFocused = function (a) {
	return {$: 29, a: a};
};
var author$project$Editor$Undo = {$: 26};
var elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var elm$svg$Svg$svg = elm$svg$Svg$trustedNode('svg');
var elm$svg$Svg$Attributes$class = _VirtualDom_attribute('class');
var elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var elm$svg$Svg$Attributes$stroke = _VirtualDom_attribute('stroke');
var elm$svg$Svg$Attributes$strokeLinecap = _VirtualDom_attribute('stroke-linecap');
var elm$svg$Svg$Attributes$strokeLinejoin = _VirtualDom_attribute('stroke-linejoin');
var elm$svg$Svg$Attributes$strokeWidth = _VirtualDom_attribute('stroke-width');
var elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var author$project$Icons$customSvgFeatherIcon = F2(
	function (size, className) {
		return elm$svg$Svg$svg(
			_List_fromArray(
				[
					elm$svg$Svg$Attributes$class('feather feather-' + className),
					elm$svg$Svg$Attributes$fill('none'),
					elm$svg$Svg$Attributes$height(
					elm$core$String$fromInt(size)),
					elm$svg$Svg$Attributes$stroke('currentColor'),
					elm$svg$Svg$Attributes$strokeLinecap('round'),
					elm$svg$Svg$Attributes$strokeLinejoin('round'),
					elm$svg$Svg$Attributes$strokeWidth('2'),
					elm$svg$Svg$Attributes$viewBox('0 0 24 24'),
					elm$svg$Svg$Attributes$width(
					elm$core$String$fromInt(size))
				]));
	});
var elm$svg$Svg$path = elm$svg$Svg$trustedNode('path');
var elm$svg$Svg$polyline = elm$svg$Svg$trustedNode('polyline');
var elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var elm$svg$Svg$Attributes$points = _VirtualDom_attribute('points');
var author$project$Icons$checkSquare = function (size) {
	return A3(
		author$project$Icons$customSvgFeatherIcon,
		size,
		'check-square',
		_List_fromArray(
			[
				A2(
				elm$svg$Svg$polyline,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$points('9 11 12 14 22 4')
					]),
				_List_Nil),
				A2(
				elm$svg$Svg$path,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$d('M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11')
					]),
				_List_Nil)
			]));
};
var elm$svg$Svg$rect = elm$svg$Svg$trustedNode('rect');
var elm$svg$Svg$Attributes$rx = _VirtualDom_attribute('rx');
var elm$svg$Svg$Attributes$ry = _VirtualDom_attribute('ry');
var elm$svg$Svg$Attributes$x = _VirtualDom_attribute('x');
var elm$svg$Svg$Attributes$y = _VirtualDom_attribute('y');
var author$project$Icons$square = function (size) {
	return A3(
		author$project$Icons$customSvgFeatherIcon,
		size,
		'square',
		_List_fromArray(
			[
				A2(
				elm$svg$Svg$rect,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$x('3'),
						elm$svg$Svg$Attributes$y('3'),
						elm$svg$Svg$Attributes$width('18'),
						elm$svg$Svg$Attributes$height('18'),
						elm$svg$Svg$Attributes$rx('2'),
						elm$svg$Svg$Attributes$ry('2')
					]),
				_List_Nil)
			]));
};
var elm$core$List$intersperse = F2(
	function (sep, xs) {
		if (!xs.b) {
			return _List_Nil;
		} else {
			var hd = xs.a;
			var tl = xs.b;
			var step = F2(
				function (x, rest) {
					return A2(
						elm$core$List$cons,
						sep,
						A2(elm$core$List$cons, x, rest));
				});
			var spersed = A3(elm$core$List$foldr, step, _List_Nil, tl);
			return A2(elm$core$List$cons, hd, spersed);
		}
	});
var mdgriffith$elm_ui$Internal$Model$Below = 1;
var mdgriffith$elm_ui$Element$below = function (element) {
	return A2(mdgriffith$elm_ui$Internal$Model$Nearby, 1, element);
};
var elm$html$Html$Events$onMouseEnter = function (msg) {
	return A2(
		elm$html$Html$Events$on,
		'mouseenter',
		elm$json$Json$Decode$succeed(msg));
};
var mdgriffith$elm_ui$Element$Events$onMouseEnter = A2(elm$core$Basics$composeL, mdgriffith$elm_ui$Internal$Model$Attr, elm$html$Html$Events$onMouseEnter);
var author$project$Editor$mainMenu = function (config) {
	var menuEntry = function (_n1) {
		var label = _n1.b4;
		var msg = _n1.k;
		var icon = _n1.dr;
		var isActive = _n1.dv;
		var isSelected = _n1.aB;
		var isSelectable = _n1.ac;
		return A2(
			mdgriffith$elm_ui$Element$row,
			_Utils_ap(
				_List_fromArray(
					[
						mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill),
						A2(mdgriffith$elm_ui$Element$paddingXY, 10, 5),
						mdgriffith$elm_ui$Element$mouseOver(
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$Background$color(
								A3(mdgriffith$elm_ui$Element$rgb, 0.9, 0.9, 0.9))
							])),
						mdgriffith$elm_ui$Element$spacing(5)
					]),
				isActive ? _List_fromArray(
					[
						mdgriffith$elm_ui$Element$Events$onClick(msg),
						mdgriffith$elm_ui$Element$pointer
					]) : _List_fromArray(
					[
						mdgriffith$elm_ui$Element$Font$color(
						A3(mdgriffith$elm_ui$Element$rgb, 0.7, 0.7, 0.7)),
						mdgriffith$elm_ui$Element$htmlAttribute(
						A2(elm$html$Html$Attributes$style, 'cursor', 'default'))
					])),
			isSelected ? _List_fromArray(
				[
					A2(
					mdgriffith$elm_ui$Element$el,
					_List_Nil,
					mdgriffith$elm_ui$Element$html(
						author$project$Icons$checkSquare(15))),
					mdgriffith$elm_ui$Element$text(label)
				]) : (isSelectable ? _List_fromArray(
				[
					A2(
					mdgriffith$elm_ui$Element$el,
					_List_Nil,
					mdgriffith$elm_ui$Element$html(
						author$project$Icons$square(15))),
					mdgriffith$elm_ui$Element$text(label)
				]) : _List_fromArray(
				[
					mdgriffith$elm_ui$Element$text(label)
				])));
	};
	var groupEntry = function (group) {
		return A2(
			mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					mdgriffith$elm_ui$Element$spacing(0),
					mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill)
				]),
			A2(elm$core$List$map, menuEntry, group));
	};
	var topEntry = function (_n0) {
		var label = _n0.a;
		var submenu = _n0.b;
		return A2(
			mdgriffith$elm_ui$Element$el,
			_Utils_ap(
				_List_fromArray(
					[
						mdgriffith$elm_ui$Element$mouseOver(
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$Background$color(
								A3(mdgriffith$elm_ui$Element$rgb, 0.9, 0.9, 0.9))
							])),
						mdgriffith$elm_ui$Element$Events$onMouseEnter(
						author$project$Editor$TopEntryFocused(label)),
						mdgriffith$elm_ui$Element$Events$onClick(author$project$Editor$MenuClick),
						A2(mdgriffith$elm_ui$Element$paddingXY, 10, 5)
					]),
				(config.cs && _Utils_eq(config.cu, label)) ? _List_fromArray(
					[
						mdgriffith$elm_ui$Element$below(
						A2(
							mdgriffith$elm_ui$Element$column,
							_List_fromArray(
								[
									mdgriffith$elm_ui$Element$spacing(5),
									A2(mdgriffith$elm_ui$Element$paddingXY, 0, 5),
									mdgriffith$elm_ui$Element$Background$color(
									A3(mdgriffith$elm_ui$Element$rgb, 1, 1, 1)),
									mdgriffith$elm_ui$Element$Border$width(1),
									mdgriffith$elm_ui$Element$Border$color(
									A3(mdgriffith$elm_ui$Element$rgb, 0.8, 0.8, 0.8))
								]),
							A2(
								elm$core$List$intersperse,
								A2(
									mdgriffith$elm_ui$Element$el,
									_List_fromArray(
										[
											mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill),
											mdgriffith$elm_ui$Element$Font$center,
											mdgriffith$elm_ui$Element$Border$widthEach(
											{eO: 0, f5: 0, gK: 0, hA: 1}),
											mdgriffith$elm_ui$Element$Border$color(
											A3(mdgriffith$elm_ui$Element$rgb, 0.9, 0.9, 0.9))
										]),
									mdgriffith$elm_ui$Element$none),
								A2(elm$core$List$map, groupEntry, submenu)))),
						mdgriffith$elm_ui$Element$Background$color(
						A3(mdgriffith$elm_ui$Element$rgb, 0.9, 0.9, 0.9))
					]) : _List_Nil),
			A2(
				mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[mdgriffith$elm_ui$Element$pointer]),
				mdgriffith$elm_ui$Element$text(label)));
	};
	var defEntry = {dr: elm$core$Maybe$Nothing, dv: true, ac: false, aB: false, b4: '', k: author$project$Editor$NoOp};
	var menuData = _List_fromArray(
		[
			_Utils_Tuple2(
			'Fichier',
			_List_fromArray(
				[
					_List_fromArray(
					[
						_Utils_update(
						defEntry,
						{
							dv: !config.s,
							b4: 'Ouvrir page',
							k: author$project$Editor$SetEditorPlugin(
								elm$core$Maybe$Just(7))
						}),
						_Utils_update(
						defEntry,
						{
							dv: !config.s,
							b4: 'Sauvegarder',
							k: author$project$Editor$SetEditorPlugin(
								elm$core$Maybe$Just(7))
						})
					]),
					_List_fromArray(
					[
						_Utils_update(
						defEntry,
						{dv: false && (!config.s), b4: 'Retour menu principal'})
					])
				])),
			_Utils_Tuple2(
			'Mise en page',
			_List_fromArray(
				[
					_List_fromArray(
					[
						_Utils_update(
						defEntry,
						{dv: !config.s, b4: 'Copier', k: author$project$Editor$Copy}),
						_Utils_update(
						defEntry,
						{dv: !config.s, b4: 'Couper', k: author$project$Editor$Cut}),
						_Utils_update(
						defEntry,
						{dv: (!config.ct) && (!config.s), b4: 'Coller', k: author$project$Editor$Paste})
					]),
					_List_fromArray(
					[
						_Utils_update(
						defEntry,
						{dv: (!config.cX) && (!config.s), b4: 'Annuler', k: author$project$Editor$Undo})
					]),
					_List_fromArray(
					[
						_Utils_update(
						defEntry,
						{dv: (!config.s) && (!config.ag), b4: 'Supprimer'}),
						_Utils_update(
						defEntry,
						{dv: (!config.s) && ((!config.bD) && (!config.ag)), b4: 'Modifier selection', k: author$project$Editor$EditCell})
					])
				])),
			_Utils_Tuple2(
			'Affichage',
			_List_fromArray(
				[
					_List_fromArray(
					[
						_Utils_update(
						defEntry,
						{dv: false, ac: true, b4: 'Structure du document'}),
						_Utils_update(
						defEntry,
						{dv: false, ac: true, b4: 'Editeur de feuille de style'}),
						_Utils_update(
						defEntry,
						{dv: true, ac: true, aB: config.cA, b4: 'Système de fichier', k: author$project$Editor$ToogleFileSys})
					]),
					_List_fromArray(
					[
						_Utils_update(
						defEntry,
						{
							ac: true,
							aB: !config.Y,
							b4: 'Grand écran',
							k: author$project$Editor$SetPreviewMode(0)
						}),
						_Utils_update(
						defEntry,
						{
							ac: true,
							aB: config.Y === 1,
							b4: 'Petit écran',
							k: author$project$Editor$SetPreviewMode(1)
						}),
						_Utils_update(
						defEntry,
						{
							ac: true,
							aB: config.Y === 2,
							b4: 'Tablette',
							k: author$project$Editor$SetPreviewMode(2)
						}),
						_Utils_update(
						defEntry,
						{
							ac: true,
							aB: config.Y === 3,
							b4: 'Téléphone',
							k: author$project$Editor$SetPreviewMode(3)
						})
					]),
					_List_fromArray(
					[
						_Utils_update(
						defEntry,
						{ac: true, aB: config.fb, b4: 'Couleurs conteneurs', k: author$project$Editor$ToogleCountainersColors})
					])
				])),
			_Utils_Tuple2(
			'Aide',
			_List_fromArray(
				[
					_List_fromArray(
					[
						_Utils_update(
						defEntry,
						{dv: false, b4: 'A propos'})
					])
				]))
		]);
	return A2(
		mdgriffith$elm_ui$Element$row,
		_List_Nil,
		A2(elm$core$List$map, topEntry, menuData));
};
var author$project$Icons$chevronsDown = function (size) {
	return A3(
		author$project$Icons$customSvgFeatherIcon,
		size,
		'chevrons-down',
		_List_fromArray(
			[
				A2(
				elm$svg$Svg$polyline,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$points('7 13 12 18 17 13')
					]),
				_List_Nil),
				A2(
				elm$svg$Svg$polyline,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$points('7 6 12 11 17 6')
					]),
				_List_Nil)
			]));
};
var author$project$Icons$chevronsUp = function (size) {
	return A3(
		author$project$Icons$customSvgFeatherIcon,
		size,
		'chevrons-up',
		_List_fromArray(
			[
				A2(
				elm$svg$Svg$polyline,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$points('17 11 12 6 7 11')
					]),
				_List_Nil),
				A2(
				elm$svg$Svg$polyline,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$points('17 18 12 13 7 18')
					]),
				_List_Nil)
			]));
};
var elm$svg$Svg$polygon = elm$svg$Svg$trustedNode('polygon');
var author$project$Icons$edit = function (size) {
	return A3(
		author$project$Icons$customSvgFeatherIcon,
		size,
		'edit',
		_List_fromArray(
			[
				A2(
				elm$svg$Svg$path,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$d('M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34')
					]),
				_List_Nil),
				A2(
				elm$svg$Svg$polygon,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$points('18 2 22 6 12 16 8 16 8 12 18 2')
					]),
				_List_Nil)
			]));
};
var elm$svg$Svg$line = elm$svg$Svg$trustedNode('line');
var elm$svg$Svg$Attributes$x1 = _VirtualDom_attribute('x1');
var elm$svg$Svg$Attributes$x2 = _VirtualDom_attribute('x2');
var elm$svg$Svg$Attributes$y1 = _VirtualDom_attribute('y1');
var elm$svg$Svg$Attributes$y2 = _VirtualDom_attribute('y2');
var author$project$Icons$plusSquare = function (size) {
	return A3(
		author$project$Icons$customSvgFeatherIcon,
		size,
		'plus-square',
		_List_fromArray(
			[
				A2(
				elm$svg$Svg$rect,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$x('3'),
						elm$svg$Svg$Attributes$y('3'),
						elm$svg$Svg$Attributes$width('18'),
						elm$svg$Svg$Attributes$height('18'),
						elm$svg$Svg$Attributes$rx('2'),
						elm$svg$Svg$Attributes$ry('2')
					]),
				_List_Nil),
				A2(
				elm$svg$Svg$line,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$x1('12'),
						elm$svg$Svg$Attributes$y1('8'),
						elm$svg$Svg$Attributes$x2('12'),
						elm$svg$Svg$Attributes$y2('16')
					]),
				_List_Nil),
				A2(
				elm$svg$Svg$line,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$x1('8'),
						elm$svg$Svg$Attributes$y1('12'),
						elm$svg$Svg$Attributes$x2('16'),
						elm$svg$Svg$Attributes$y2('12')
					]),
				_List_Nil)
			]));
};
var author$project$Icons$refreshCw = function (size) {
	return A3(
		author$project$Icons$customSvgFeatherIcon,
		size,
		'refresh-cw',
		_List_fromArray(
			[
				A2(
				elm$svg$Svg$polyline,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$points('23 4 23 10 17 10')
					]),
				_List_Nil),
				A2(
				elm$svg$Svg$polyline,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$points('1 20 1 14 7 14')
					]),
				_List_Nil),
				A2(
				elm$svg$Svg$path,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$d('M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15')
					]),
				_List_Nil)
			]));
};
var elm$svg$Svg$circle = elm$svg$Svg$trustedNode('circle');
var elm$svg$Svg$Attributes$cx = _VirtualDom_attribute('cx');
var elm$svg$Svg$Attributes$cy = _VirtualDom_attribute('cy');
var elm$svg$Svg$Attributes$r = _VirtualDom_attribute('r');
var author$project$Icons$settings = function (size) {
	return A3(
		author$project$Icons$customSvgFeatherIcon,
		size,
		'settings',
		_List_fromArray(
			[
				A2(
				elm$svg$Svg$circle,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$cx('12'),
						elm$svg$Svg$Attributes$cy('12'),
						elm$svg$Svg$Attributes$r('3')
					]),
				_List_Nil),
				A2(
				elm$svg$Svg$path,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$d('M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z')
					]),
				_List_Nil)
			]));
};
var author$project$Icons$xSquare = function (size) {
	return A3(
		author$project$Icons$customSvgFeatherIcon,
		size,
		'x-square',
		_List_fromArray(
			[
				A2(
				elm$svg$Svg$rect,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$x('3'),
						elm$svg$Svg$Attributes$y('3'),
						elm$svg$Svg$Attributes$width('18'),
						elm$svg$Svg$Attributes$height('18'),
						elm$svg$Svg$Attributes$rx('2'),
						elm$svg$Svg$Attributes$ry('2')
					]),
				_List_Nil),
				A2(
				elm$svg$Svg$line,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$x1('9'),
						elm$svg$Svg$Attributes$y1('9'),
						elm$svg$Svg$Attributes$x2('15'),
						elm$svg$Svg$Attributes$y2('15')
					]),
				_List_Nil),
				A2(
				elm$svg$Svg$line,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$x1('15'),
						elm$svg$Svg$Attributes$y1('9'),
						elm$svg$Svg$Attributes$x2('9'),
						elm$svg$Svg$Attributes$y2('15')
					]),
				_List_Nil)
			]));
};
var mdgriffith$elm_ui$Internal$Flag$borderRound = mdgriffith$elm_ui$Internal$Flag$flag(17);
var mdgriffith$elm_ui$Element$Border$rounded = function (radius) {
	return A2(
		mdgriffith$elm_ui$Internal$Model$StyleClass,
		mdgriffith$elm_ui$Internal$Flag$borderRound,
		A3(
			mdgriffith$elm_ui$Internal$Model$Single,
			'br-' + elm$core$String$fromInt(radius),
			'border-radius',
			elm$core$String$fromInt(radius) + 'px'));
};
var elm$json$Json$Encode$bool = _Json_wrap;
var elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			elm$json$Json$Encode$bool(bool));
	});
var elm$html$Html$Attributes$disabled = elm$html$Html$Attributes$boolProperty('disabled');
var elm$html$Html$Attributes$tabindex = function (n) {
	return A2(
		_VirtualDom_attribute,
		'tabIndex',
		elm$core$String$fromInt(n));
};
var mdgriffith$elm_ui$Element$Input$hasFocusStyle = function (attr) {
	if (((attr.$ === 4) && (attr.b.$ === 11)) && (!attr.b.a)) {
		var _n1 = attr.b;
		var _n2 = _n1.a;
		return true;
	} else {
		return false;
	}
};
var mdgriffith$elm_ui$Element$Input$focusDefault = function (attrs) {
	return A2(elm$core$List$any, mdgriffith$elm_ui$Element$Input$hasFocusStyle, attrs) ? mdgriffith$elm_ui$Internal$Model$NoAttribute : mdgriffith$elm_ui$Internal$Model$htmlClass('focusable');
};
var mdgriffith$elm_ui$Element$Input$enter = 'Enter';
var elm$virtual_dom$VirtualDom$MayPreventDefault = function (a) {
	return {$: 2, a: a};
};
var elm$html$Html$Events$preventDefaultOn = F2(
	function (event, decoder) {
		return A2(
			elm$virtual_dom$VirtualDom$on,
			event,
			elm$virtual_dom$VirtualDom$MayPreventDefault(decoder));
	});
var mdgriffith$elm_ui$Element$Input$onKey = F2(
	function (desiredCode, msg) {
		var decode = function (code) {
			return _Utils_eq(code, desiredCode) ? elm$json$Json$Decode$succeed(msg) : elm$json$Json$Decode$fail('Not the enter key');
		};
		var isKey = A2(
			elm$json$Json$Decode$andThen,
			decode,
			A2(elm$json$Json$Decode$field, 'key', elm$json$Json$Decode$string));
		return mdgriffith$elm_ui$Internal$Model$Attr(
			A2(
				elm$html$Html$Events$preventDefaultOn,
				'keyup',
				A2(
					elm$json$Json$Decode$map,
					function (fired) {
						return _Utils_Tuple2(fired, true);
					},
					isKey)));
	});
var mdgriffith$elm_ui$Element$Input$onEnter = function (msg) {
	return A2(mdgriffith$elm_ui$Element$Input$onKey, mdgriffith$elm_ui$Element$Input$enter, msg);
};
var mdgriffith$elm_ui$Internal$Model$Button = {$: 8};
var mdgriffith$elm_ui$Element$Input$button = F2(
	function (attrs, _n0) {
		var onPress = _n0.cf;
		var label = _n0.b4;
		return A4(
			mdgriffith$elm_ui$Internal$Model$element,
			mdgriffith$elm_ui$Internal$Model$asEl,
			mdgriffith$elm_ui$Internal$Model$div,
			A2(
				elm$core$List$cons,
				mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$shrink),
				A2(
					elm$core$List$cons,
					mdgriffith$elm_ui$Element$height(mdgriffith$elm_ui$Element$shrink),
					A2(
						elm$core$List$cons,
						mdgriffith$elm_ui$Internal$Model$htmlClass(mdgriffith$elm_ui$Internal$Style$classes.bW + (' ' + (mdgriffith$elm_ui$Internal$Style$classes.ax + (' ' + (mdgriffith$elm_ui$Internal$Style$classes.gR + (' ' + mdgriffith$elm_ui$Internal$Style$classes.dE)))))),
						A2(
							elm$core$List$cons,
							mdgriffith$elm_ui$Element$pointer,
							A2(
								elm$core$List$cons,
								mdgriffith$elm_ui$Element$Input$focusDefault(attrs),
								A2(
									elm$core$List$cons,
									mdgriffith$elm_ui$Internal$Model$Describe(mdgriffith$elm_ui$Internal$Model$Button),
									A2(
										elm$core$List$cons,
										mdgriffith$elm_ui$Internal$Model$Attr(
											elm$html$Html$Attributes$tabindex(0)),
										function () {
											if (onPress.$ === 1) {
												return A2(
													elm$core$List$cons,
													mdgriffith$elm_ui$Internal$Model$Attr(
														elm$html$Html$Attributes$disabled(true)),
													attrs);
											} else {
												var msg = onPress.a;
												return A2(
													elm$core$List$cons,
													mdgriffith$elm_ui$Element$Events$onClick(msg),
													A2(
														elm$core$List$cons,
														mdgriffith$elm_ui$Element$Input$onEnter(msg),
														attrs));
											}
										}()))))))),
			mdgriffith$elm_ui$Internal$Model$Unkeyed(
				_List_fromArray(
					[label])));
	});
var author$project$Editor$mainInterface = function (config) {
	var menuButtonStyle = function (isActive) {
		return _Utils_ap(
			_List_fromArray(
				[
					mdgriffith$elm_ui$Element$Border$rounded(5),
					mdgriffith$elm_ui$Element$Font$center,
					mdgriffith$elm_ui$Element$centerY,
					A2(mdgriffith$elm_ui$Element$paddingXY, 5, 3),
					mdgriffith$elm_ui$Element$mouseOver(
					_List_fromArray(
						[
							mdgriffith$elm_ui$Element$Background$color(
							A3(mdgriffith$elm_ui$Element$rgb, 0.95, 0.95, 0.95))
						]))
				]),
			isActive ? _List_fromArray(
				[mdgriffith$elm_ui$Element$pointer]) : _List_fromArray(
				[
					mdgriffith$elm_ui$Element$Font$color(
					A3(mdgriffith$elm_ui$Element$rgb, 0.7, 0.7, 0.7)),
					mdgriffith$elm_ui$Element$htmlAttribute(
					A2(elm$html$Html$Attributes$style, 'cursor', 'default'))
				]));
	};
	var interfaceButton = function (buttonConfig) {
		return A2(
			mdgriffith$elm_ui$Element$Input$button,
			menuButtonStyle(buttonConfig.dv),
			{
				b4: function () {
					var _n0 = buttonConfig.T;
					if (!_n0.b) {
						return A2(
							mdgriffith$elm_ui$Element$el,
							_List_Nil,
							mdgriffith$elm_ui$Element$text(buttonConfig.L));
					} else {
						var icons_ = _n0;
						return A2(
							mdgriffith$elm_ui$Element$row,
							_List_fromArray(
								[
									mdgriffith$elm_ui$Element$spacing(10)
								]),
							_List_fromArray(
								[
									A2(
									mdgriffith$elm_ui$Element$row,
									_List_Nil,
									A2(
										elm$core$List$map,
										function (i) {
											return A2(
												mdgriffith$elm_ui$Element$el,
												_List_Nil,
												mdgriffith$elm_ui$Element$html(i));
										},
										icons_)),
									mdgriffith$elm_ui$Element$text(buttonConfig.L)
								]));
					}
				}(),
				cf: buttonConfig.dv ? buttonConfig.k : elm$core$Maybe$Nothing
			});
	};
	var defButtonConfig = {T: _List_Nil, dv: !config.s, L: '', k: elm$core$Maybe$Nothing};
	return A2(
		mdgriffith$elm_ui$Element$column,
		_List_fromArray(
			[
				mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill),
				mdgriffith$elm_ui$Element$Font$size(15),
				mdgriffith$elm_ui$Element$htmlAttribute(
				elm$html$Html$Attributes$id('mainInterface'))
			]),
		_List_fromArray(
			[
				author$project$Editor$mainMenu(config),
				A2(
				mdgriffith$elm_ui$Element$row,
				_List_fromArray(
					[
						mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill),
						mdgriffith$elm_ui$Element$spacing(15),
						A2(mdgriffith$elm_ui$Element$paddingXY, 15, 10),
						mdgriffith$elm_ui$Element$Background$color(
						A3(mdgriffith$elm_ui$Element$rgb, 0.9, 0.9, 0.9))
					]),
				A2(
					elm$core$List$map,
					interfaceButton,
					_List_fromArray(
						[
							_Utils_update(
							defButtonConfig,
							{
								T: _List_fromArray(
									[
										author$project$Icons$plusSquare(author$project$Editor$iconSize)
									]),
								dv: (!config.s) && config.bD,
								L: 'Ajouter',
								k: elm$core$Maybe$Just(author$project$Editor$AddNewInside)
							}),
							_Utils_update(
							defButtonConfig,
							{
								T: _List_fromArray(
									[
										author$project$Icons$plusSquare(author$project$Editor$iconSize),
										author$project$Icons$chevronsUp(author$project$Editor$iconSize)
									]),
								dv: (!config.s) && (!config.ag),
								L: 'Ajouter au dessus',
								k: elm$core$Maybe$Just(author$project$Editor$AddNewLeft)
							}),
							_Utils_update(
							defButtonConfig,
							{
								T: _List_fromArray(
									[
										author$project$Icons$plusSquare(author$project$Editor$iconSize),
										author$project$Icons$chevronsDown(author$project$Editor$iconSize)
									]),
								dv: (!config.s) && (!config.ag),
								L: 'Ajouter en dessous',
								k: elm$core$Maybe$Just(author$project$Editor$AddNewRight)
							}),
							_Utils_update(
							defButtonConfig,
							{
								T: _List_fromArray(
									[
										author$project$Icons$edit(author$project$Editor$iconSize)
									]),
								dv: (!config.s) && (!config.ag),
								L: 'Modifier',
								k: config.bD ? elm$core$Maybe$Just(author$project$Editor$EditContainer) : elm$core$Maybe$Just(author$project$Editor$EditCell)
							}),
							_Utils_update(
							defButtonConfig,
							{
								T: _List_fromArray(
									[
										author$project$Icons$xSquare(author$project$Editor$iconSize)
									]),
								dv: (!config.s) && (!config.ag),
								L: 'Supprimer',
								k: elm$core$Maybe$Just(author$project$Editor$DeleteSelected)
							}),
							_Utils_update(
							defButtonConfig,
							{
								T: _List_fromArray(
									[
										author$project$Icons$chevronsUp(author$project$Editor$iconSize)
									]),
								dv: (!config.s) && (!config.ag),
								L: 'Monter',
								k: elm$core$Maybe$Just(author$project$Editor$SwapLeft)
							}),
							_Utils_update(
							defButtonConfig,
							{
								T: _List_fromArray(
									[
										author$project$Icons$chevronsDown(author$project$Editor$iconSize)
									]),
								dv: (!config.s) && (!config.ag),
								L: 'Descendre',
								k: elm$core$Maybe$Just(author$project$Editor$SwapRight)
							}),
							_Utils_update(
							defButtonConfig,
							{
								T: _List_fromArray(
									[
										author$project$Icons$refreshCw(author$project$Editor$iconSize)
									]),
								dv: true,
								L: 'Rafraichir',
								k: elm$core$Maybe$Just(author$project$Editor$RefreshSizes)
							}),
							_Utils_update(
							defButtonConfig,
							{
								T: _List_fromArray(
									[
										author$project$Icons$settings(author$project$Editor$iconSize)
									]),
								dv: false,
								L: 'Préférences',
								k: elm$core$Maybe$Nothing
							})
						])))
			]));
};
var author$project$ContainerEditPlugin$containerLabelToString = function (cl) {
	switch (cl) {
		case 0:
			return 'Colonne';
		case 1:
			return 'Ligne';
		case 2:
			return 'Colonne de texte';
		default:
			return 'Bloc réactif';
	}
};
var mdgriffith$elm_ui$Internal$Flag$focus = mdgriffith$elm_ui$Internal$Flag$flag(31);
var mdgriffith$elm_ui$Internal$Model$Focus = 0;
var mdgriffith$elm_ui$Element$focused = function (decs) {
	return A2(
		mdgriffith$elm_ui$Internal$Model$StyleClass,
		mdgriffith$elm_ui$Internal$Flag$focus,
		A2(
			mdgriffith$elm_ui$Internal$Model$PseudoSelector,
			0,
			mdgriffith$elm_ui$Internal$Model$unwrapDecorations(decs)));
};
var mdgriffith$elm_ui$Element$Border$glow = F2(
	function (clr, size) {
		return mdgriffith$elm_ui$Element$Border$shadow(
			{
				eH: size * 2,
				e4: clr,
				gn: _Utils_Tuple2(0, 0),
				d7: size
			});
	});
var author$project$DocumentEditorHelpers$buttonStyle = function (isActive) {
	return _Utils_ap(
		_List_fromArray(
			[
				mdgriffith$elm_ui$Element$Border$rounded(5),
				mdgriffith$elm_ui$Element$Font$center,
				mdgriffith$elm_ui$Element$centerY,
				mdgriffith$elm_ui$Element$padding(5),
				mdgriffith$elm_ui$Element$focused(
				_List_fromArray(
					[
						A2(
						mdgriffith$elm_ui$Element$Border$glow,
						A3(mdgriffith$elm_ui$Element$rgb, 1, 1, 1),
						0)
					]))
			]),
		isActive ? _List_fromArray(
			[
				mdgriffith$elm_ui$Element$Background$color(
				A3(mdgriffith$elm_ui$Element$rgb, 0.9, 0.9, 0.9)),
				mdgriffith$elm_ui$Element$mouseOver(
				_List_fromArray(
					[
						mdgriffith$elm_ui$Element$Font$color(
						A3(mdgriffith$elm_ui$Element$rgb, 255, 255, 255))
					])),
				mdgriffith$elm_ui$Element$Border$width(1),
				mdgriffith$elm_ui$Element$Border$color(
				A3(mdgriffith$elm_ui$Element$rgb, 0.9, 0.9, 0.9))
			]) : _List_fromArray(
			[
				mdgriffith$elm_ui$Element$Background$color(
				A3(mdgriffith$elm_ui$Element$rgb, 0.95, 0.95, 0.95)),
				mdgriffith$elm_ui$Element$Font$color(
				A3(mdgriffith$elm_ui$Element$rgb, 0.7, 0.7, 0.7)),
				mdgriffith$elm_ui$Element$htmlAttribute(
				A2(elm$html$Html$Attributes$style, 'cursor', 'default')),
				mdgriffith$elm_ui$Element$Border$width(1),
				mdgriffith$elm_ui$Element$Border$color(
				A3(mdgriffith$elm_ui$Element$rgb, 0.95, 0.95, 0.95))
			]));
};
var author$project$ContainerEditPlugin$view = function (config) {
	return A2(
		mdgriffith$elm_ui$Element$column,
		_List_fromArray(
			[
				mdgriffith$elm_ui$Element$padding(15),
				mdgriffith$elm_ui$Element$spacing(15),
				mdgriffith$elm_ui$Element$Font$size(16),
				mdgriffith$elm_ui$Element$alignTop
			]),
		_List_fromArray(
			[
				mdgriffith$elm_ui$Element$text('Modification du type de containeur: '),
				mdgriffith$elm_ui$Element$text(
				'Transformer ' + (author$project$ContainerEditPlugin$containerLabelToString(config.aU) + ' en: ')),
				A2(
				mdgriffith$elm_ui$Element$row,
				_List_fromArray(
					[
						mdgriffith$elm_ui$Element$spacing(15)
					]),
				_List_fromArray(
					[
						A2(
						mdgriffith$elm_ui$Element$Input$button,
						author$project$DocumentEditorHelpers$buttonStyle(config.aU),
						{
							b4: A2(
								mdgriffith$elm_ui$Element$row,
								_List_fromArray(
									[
										mdgriffith$elm_ui$Element$spacing(10)
									]),
								_List_fromArray(
									[
										mdgriffith$elm_ui$Element$text('Colonne')
									])),
							cf: config.aU ? elm$core$Maybe$Just(
								config.cV(0)) : elm$core$Maybe$Nothing
						}),
						A2(
						mdgriffith$elm_ui$Element$Input$button,
						author$project$DocumentEditorHelpers$buttonStyle(config.aU !== 1),
						{
							b4: A2(
								mdgriffith$elm_ui$Element$row,
								_List_fromArray(
									[
										mdgriffith$elm_ui$Element$spacing(10)
									]),
								_List_fromArray(
									[
										mdgriffith$elm_ui$Element$text('Ligne')
									])),
							cf: (config.aU !== 1) ? elm$core$Maybe$Just(
								config.cV(1)) : elm$core$Maybe$Nothing
						}),
						A2(
						mdgriffith$elm_ui$Element$Input$button,
						author$project$DocumentEditorHelpers$buttonStyle(config.aU !== 2),
						{
							b4: A2(
								mdgriffith$elm_ui$Element$row,
								_List_fromArray(
									[
										mdgriffith$elm_ui$Element$spacing(10)
									]),
								_List_fromArray(
									[
										mdgriffith$elm_ui$Element$text('Colonne de texte')
									])),
							cf: (config.aU !== 2) ? elm$core$Maybe$Just(
								config.cV(2)) : elm$core$Maybe$Nothing
						})
					])),
				A2(
				mdgriffith$elm_ui$Element$Input$button,
				author$project$DocumentEditorHelpers$buttonStyle(true),
				{
					b4: A2(
						mdgriffith$elm_ui$Element$row,
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$spacing(10)
							]),
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$text('Retour')
							])),
					cf: elm$core$Maybe$Just(config.fH)
				})
			]));
};
var author$project$Editor$ClearLocalStorage = {$: 46};
var author$project$Editor$CreateNewCell = function (a) {
	return {$: 21, a: a};
};
var author$project$Editor$CreateNewContainer = function (a) {
	return {$: 20, a: a};
};
var author$project$Editor$GetFromLocalStorage = {$: 43};
var author$project$Editor$LoadDocument = {$: 39};
var author$project$Editor$PutInLocalStorage = {$: 44};
var author$project$Editor$RemoveFromLocalStorage = {$: 45};
var author$project$Editor$SetJsonBuffer = function (a) {
	return {$: 42, a: a};
};
var author$project$Editor$SetLocalStorageKey = function (a) {
	return {$: 40, a: a};
};
var author$project$Editor$SetLocalStorageValue = function (a) {
	return {$: 41, a: a};
};
var author$project$Editor$SwapContainerType = function (a) {
	return {$: 16, a: a};
};
var author$project$FilesysPlugin$GoTo = function (a) {
	return {$: 3, a: a};
};
var author$project$FilesysPlugin$SelectFile = function (a) {
	return {$: 4, a: a};
};
var elm$core$List$partition = F2(
	function (pred, list) {
		var step = F2(
			function (x, _n0) {
				var trues = _n0.a;
				var falses = _n0.b;
				return pred(x) ? _Utils_Tuple2(
					A2(elm$core$List$cons, x, trues),
					falses) : _Utils_Tuple2(
					trues,
					A2(elm$core$List$cons, x, falses));
			});
		return A3(
			elm$core$List$foldr,
			step,
			_Utils_Tuple2(_List_Nil, _List_Nil),
			list);
	});
var mdgriffith$elm_ui$Element$Background$uncropped = function (src) {
	return mdgriffith$elm_ui$Internal$Model$Attr(
		A2(elm$virtual_dom$VirtualDom$style, 'background', 'url(\"' + (src + '\") center / contain no-repeat')));
};
var author$project$FilesysPlugin$filesysView = F2(
	function (model, config) {
		var iEv = F2(
			function (handler, msg) {
				return handler(
					model.fx(msg));
			});
		var folderView = function (_n7) {
			var name = _n7.X;
			var path = _n7.af;
			return A2(
				mdgriffith$elm_ui$Element$column,
				_List_fromArray(
					[
						mdgriffith$elm_ui$Element$padding(7),
						mdgriffith$elm_ui$Element$pointer,
						mdgriffith$elm_ui$Element$mouseOver(
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$Background$color(
								A4(mdgriffith$elm_ui$Element$rgba, 0.3, 0.4, 0.6, 0.3))
							])),
						mdgriffith$elm_ui$Element$htmlAttribute(
						A2(elm$html$Html$Attributes$style, 'transition', '0.1s'))
					]),
				_List_fromArray(
					[
						A2(
						mdgriffith$elm_ui$Element$el,
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$width(
								mdgriffith$elm_ui$Element$px(80)),
								mdgriffith$elm_ui$Element$height(
								mdgriffith$elm_ui$Element$px(80)),
								mdgriffith$elm_ui$Element$Background$color(
								A3(mdgriffith$elm_ui$Element$rgb, 1, 1, 1)),
								mdgriffith$elm_ui$Element$Background$uncropped('assets/images/folder.svg'),
								A2(
								iEv,
								mdgriffith$elm_ui$Element$Events$onClick,
								author$project$FilesysPlugin$GoTo(path))
							]),
						mdgriffith$elm_ui$Element$none),
						A2(
						mdgriffith$elm_ui$Element$paragraph,
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$width(
								mdgriffith$elm_ui$Element$px(80)),
								mdgriffith$elm_ui$Element$clip,
								mdgriffith$elm_ui$Element$Font$size(14)
							]),
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$text(name)
							]))
					]));
		};
		var fileView = function (_n6) {
			var name = _n6.X;
			var path = _n6.af;
			var _n5 = model.cT;
			if (!_n5) {
				return A2(
					mdgriffith$elm_ui$Element$column,
					_Utils_ap(
						_List_fromArray(
							[mdgriffith$elm_ui$Element$pointer]),
						_Utils_eq(model.cj, path) ? _List_fromArray(
							[
								mdgriffith$elm_ui$Element$Border$width(1),
								mdgriffith$elm_ui$Element$Border$color(
								A3(mdgriffith$elm_ui$Element$rgb, 0.8, 0.8, 0.8)),
								mdgriffith$elm_ui$Element$padding(6)
							]) : _List_fromArray(
							[
								mdgriffith$elm_ui$Element$padding(7)
							])),
					_List_fromArray(
						[
							A2(
							mdgriffith$elm_ui$Element$el,
							_List_fromArray(
								[
									mdgriffith$elm_ui$Element$width(
									mdgriffith$elm_ui$Element$px(100)),
									mdgriffith$elm_ui$Element$height(
									mdgriffith$elm_ui$Element$px(100)),
									mdgriffith$elm_ui$Element$Background$uncropped(
									A2(elm$core$String$join, '/', path)),
									A2(
									iEv,
									mdgriffith$elm_ui$Element$Events$onClick,
									author$project$FilesysPlugin$SelectFile(path))
								]),
							mdgriffith$elm_ui$Element$none),
							A2(
							mdgriffith$elm_ui$Element$paragraph,
							_List_fromArray(
								[
									mdgriffith$elm_ui$Element$width(
									mdgriffith$elm_ui$Element$px(100)),
									mdgriffith$elm_ui$Element$clip,
									mdgriffith$elm_ui$Element$Font$size(12),
									A2(mdgriffith$elm_ui$Element$paddingXY, 0, 5)
								]),
							_List_fromArray(
								[
									mdgriffith$elm_ui$Element$text(name)
								]))
						]));
			} else {
				return A2(
					mdgriffith$elm_ui$Element$column,
					_List_fromArray(
						[
							mdgriffith$elm_ui$Element$padding(7)
						]),
					_List_fromArray(
						[
							A2(
							mdgriffith$elm_ui$Element$el,
							_List_fromArray(
								[
									mdgriffith$elm_ui$Element$width(
									mdgriffith$elm_ui$Element$px(80)),
									mdgriffith$elm_ui$Element$height(
									mdgriffith$elm_ui$Element$px(80)),
									mdgriffith$elm_ui$Element$Border$width(1),
									mdgriffith$elm_ui$Element$Border$color(
									A3(mdgriffith$elm_ui$Element$rgb, 0.8, 0.8, 0.8)),
									mdgriffith$elm_ui$Element$Background$color(
									A3(mdgriffith$elm_ui$Element$rgb, 1, 1, 1)),
									A2(
									iEv,
									mdgriffith$elm_ui$Element$Events$onClick,
									author$project$FilesysPlugin$SelectFile(path))
								]),
							mdgriffith$elm_ui$Element$none),
							A2(
							mdgriffith$elm_ui$Element$el,
							_List_fromArray(
								[
									mdgriffith$elm_ui$Element$htmlAttribute(
									A2(elm$html$Html$Attributes$style, 'word-wrap', 'break-word')),
									mdgriffith$elm_ui$Element$width(
									mdgriffith$elm_ui$Element$px(80))
								]),
							mdgriffith$elm_ui$Element$text(name))
						]));
			}
		};
		var contentView = function (fsItem) {
			if (fsItem.$ === 1) {
				var meta = fsItem.a;
				return fileView(meta);
			} else {
				var meta = fsItem.a;
				return folderView(meta);
			}
		};
		var _n0 = model.n;
		if (_n0.$ === 1) {
			return mdgriffith$elm_ui$Element$text('Erreur système de fichier');
		} else {
			var filesys = _n0.a;
			var _n1 = author$project$FilesysPlugin$extractFsItem(filesys);
			if (_n1.$ === 1) {
				var meta = _n1.a;
				return fileView(meta);
			} else {
				var meta = _n1.a;
				var contents = _n1.b;
				return A2(
					mdgriffith$elm_ui$Element$paragraph,
					_List_Nil,
					A2(
						elm$core$List$map,
						contentView,
						function (_n3) {
							var files = _n3.a;
							var folders = _n3.b;
							return _Utils_ap(
								A2(elm$core$List$sortBy, author$project$FilesysPlugin$getName, folders),
								A2(elm$core$List$sortBy, author$project$FilesysPlugin$getName, files));
						}(
							A2(
								elm$core$List$partition,
								function (f) {
									if (f.$ === 1) {
										return true;
									} else {
										return false;
									}
								},
								contents))));
			}
		}
	});
var author$project$FilesysPlugin$GoHome = {$: 0};
var author$project$FilesysPlugin$GoNext = {$: 1};
var author$project$FilesysPlugin$GoPrev = {$: 2};
var author$project$Icons$chevronLeft = function (size) {
	return A3(
		author$project$Icons$customSvgFeatherIcon,
		size,
		'chevron-left',
		_List_fromArray(
			[
				A2(
				elm$svg$Svg$polyline,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$points('15 18 9 12 15 6')
					]),
				_List_Nil)
			]));
};
var author$project$Icons$chevronRight = function (size) {
	return A3(
		author$project$Icons$customSvgFeatherIcon,
		size,
		'chevron-right',
		_List_fromArray(
			[
				A2(
				elm$svg$Svg$polyline,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$points('9 18 15 12 9 6')
					]),
				_List_Nil)
			]));
};
var author$project$Icons$home = function (size) {
	return A3(
		author$project$Icons$customSvgFeatherIcon,
		size,
		'home',
		_List_fromArray(
			[
				A2(
				elm$svg$Svg$path,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$d('M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z')
					]),
				_List_Nil),
				A2(
				elm$svg$Svg$polyline,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$points('9 22 9 12 15 12 15 22')
					]),
				_List_Nil)
			]));
};
var author$project$FilesysPlugin$mainInterface = F2(
	function (model, config) {
		var iconSize = 22;
		return A2(
			mdgriffith$elm_ui$Element$row,
			_List_fromArray(
				[
					mdgriffith$elm_ui$Element$spacing(15)
				]),
			_List_fromArray(
				[
					A2(
					mdgriffith$elm_ui$Element$Input$button,
					author$project$DocumentEditorHelpers$buttonStyle(true),
					{
						b4: A2(
							mdgriffith$elm_ui$Element$row,
							_List_fromArray(
								[
									mdgriffith$elm_ui$Element$spacing(10)
								]),
							_List_fromArray(
								[
									mdgriffith$elm_ui$Element$html(
									author$project$Icons$chevronLeft(iconSize))
								])),
						cf: elm$core$Maybe$Just(
							model.fx(author$project$FilesysPlugin$GoPrev))
					}),
					A2(
					mdgriffith$elm_ui$Element$Input$button,
					author$project$DocumentEditorHelpers$buttonStyle(
						!_Utils_eq(model.U, _List_Nil)),
					{
						b4: A2(
							mdgriffith$elm_ui$Element$row,
							_List_fromArray(
								[
									mdgriffith$elm_ui$Element$spacing(10)
								]),
							_List_fromArray(
								[
									mdgriffith$elm_ui$Element$html(
									author$project$Icons$chevronRight(iconSize))
								])),
						cf: (!_Utils_eq(model.U, _List_Nil)) ? elm$core$Maybe$Just(
							model.fx(author$project$FilesysPlugin$GoNext)) : elm$core$Maybe$Nothing
					}),
					A2(
					mdgriffith$elm_ui$Element$Input$button,
					author$project$DocumentEditorHelpers$buttonStyle(true),
					{
						b4: A2(
							mdgriffith$elm_ui$Element$row,
							_List_fromArray(
								[
									mdgriffith$elm_ui$Element$spacing(10)
								]),
							_List_fromArray(
								[
									mdgriffith$elm_ui$Element$html(
									author$project$Icons$home(iconSize))
								])),
						cf: elm$core$Maybe$Just(
							model.fx(author$project$FilesysPlugin$GoHome))
					})
				]));
	});
var author$project$FilesysPlugin$view = F2(
	function (config, model) {
		return A2(
			mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					mdgriffith$elm_ui$Element$spacing(20),
					mdgriffith$elm_ui$Element$Font$size(16),
					mdgriffith$elm_ui$Element$Font$family(
					_List_fromArray(
						[mdgriffith$elm_ui$Element$Font$monospace])),
					mdgriffith$elm_ui$Element$alignTop,
					mdgriffith$elm_ui$Element$padding(15),
					mdgriffith$elm_ui$Element$scrollbarY,
					mdgriffith$elm_ui$Element$height(
					A2(mdgriffith$elm_ui$Element$minimum, config.gc, mdgriffith$elm_ui$Element$fill)),
					mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill)
				]),
			_List_fromArray(
				[
					A2(author$project$FilesysPlugin$mainInterface, model, config),
					A2(author$project$FilesysPlugin$filesysView, model, config)
				]));
	});
var author$project$DocumentEditorHelpers$textInputStyle = _List_fromArray(
	[
		mdgriffith$elm_ui$Element$width(
		mdgriffith$elm_ui$Element$px(250)),
		A2(mdgriffith$elm_ui$Element$paddingXY, 5, 5),
		mdgriffith$elm_ui$Element$spacing(15),
		mdgriffith$elm_ui$Element$focused(
		_List_fromArray(
			[
				A2(
				mdgriffith$elm_ui$Element$Border$glow,
				A3(mdgriffith$elm_ui$Element$rgb, 1, 1, 1),
				0)
			]))
	]);
var author$project$DocumentEditorHelpers$toogleButtonStyle = F2(
	function (isPressed, isActive) {
		return _Utils_ap(
			_List_fromArray(
				[
					mdgriffith$elm_ui$Element$Border$rounded(5),
					mdgriffith$elm_ui$Element$Font$center,
					mdgriffith$elm_ui$Element$centerY,
					mdgriffith$elm_ui$Element$padding(5),
					mdgriffith$elm_ui$Element$focused(
					_List_fromArray(
						[
							A2(
							mdgriffith$elm_ui$Element$Border$glow,
							A3(mdgriffith$elm_ui$Element$rgb, 1, 1, 1),
							0)
						]))
				]),
			isActive ? _Utils_ap(
				_List_fromArray(
					[
						mdgriffith$elm_ui$Element$Background$color(
						A3(mdgriffith$elm_ui$Element$rgb, 0.9, 0.9, 0.9)),
						mdgriffith$elm_ui$Element$Border$width(1),
						mdgriffith$elm_ui$Element$Border$color(
						A3(mdgriffith$elm_ui$Element$rgb, 0.9, 0.9, 0.9)),
						mdgriffith$elm_ui$Element$mouseOver(
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$Font$color(
								A3(mdgriffith$elm_ui$Element$rgb, 0.3, 0.3, 0.3))
							]))
					]),
				isPressed ? _List_Nil : _List_fromArray(
					[
						mdgriffith$elm_ui$Element$Background$color(
						A3(mdgriffith$elm_ui$Element$rgb, 1, 1, 1)),
						mdgriffith$elm_ui$Element$Border$width(1),
						mdgriffith$elm_ui$Element$Border$color(
						A3(mdgriffith$elm_ui$Element$rgb, 0.9, 0.9, 0.9))
					])) : _List_fromArray(
				[
					mdgriffith$elm_ui$Element$Background$color(
					A3(mdgriffith$elm_ui$Element$rgb, 0.95, 0.95, 0.95)),
					mdgriffith$elm_ui$Element$Font$color(
					A3(mdgriffith$elm_ui$Element$rgb, 0.7, 0.7, 0.7)),
					mdgriffith$elm_ui$Element$htmlAttribute(
					A2(elm$html$Html$Attributes$style, 'cursor', 'default')),
					mdgriffith$elm_ui$Element$Border$width(1),
					mdgriffith$elm_ui$Element$Border$color(
					A3(mdgriffith$elm_ui$Element$rgb, 0.95, 0.95, 0.95))
				]));
	});
var author$project$Icons$alignCenter = function (size) {
	return A3(
		author$project$Icons$customSvgFeatherIcon,
		size,
		'align-center',
		_List_fromArray(
			[
				A2(
				elm$svg$Svg$line,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$x1('18'),
						elm$svg$Svg$Attributes$y1('10'),
						elm$svg$Svg$Attributes$x2('6'),
						elm$svg$Svg$Attributes$y2('10')
					]),
				_List_Nil),
				A2(
				elm$svg$Svg$line,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$x1('21'),
						elm$svg$Svg$Attributes$y1('6'),
						elm$svg$Svg$Attributes$x2('3'),
						elm$svg$Svg$Attributes$y2('6')
					]),
				_List_Nil),
				A2(
				elm$svg$Svg$line,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$x1('21'),
						elm$svg$Svg$Attributes$y1('14'),
						elm$svg$Svg$Attributes$x2('3'),
						elm$svg$Svg$Attributes$y2('14')
					]),
				_List_Nil),
				A2(
				elm$svg$Svg$line,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$x1('18'),
						elm$svg$Svg$Attributes$y1('18'),
						elm$svg$Svg$Attributes$x2('6'),
						elm$svg$Svg$Attributes$y2('18')
					]),
				_List_Nil)
			]));
};
var author$project$Icons$alignLeft = function (size) {
	return A3(
		author$project$Icons$customSvgFeatherIcon,
		size,
		'align-left',
		_List_fromArray(
			[
				A2(
				elm$svg$Svg$line,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$x1('17'),
						elm$svg$Svg$Attributes$y1('10'),
						elm$svg$Svg$Attributes$x2('3'),
						elm$svg$Svg$Attributes$y2('10')
					]),
				_List_Nil),
				A2(
				elm$svg$Svg$line,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$x1('21'),
						elm$svg$Svg$Attributes$y1('6'),
						elm$svg$Svg$Attributes$x2('3'),
						elm$svg$Svg$Attributes$y2('6')
					]),
				_List_Nil),
				A2(
				elm$svg$Svg$line,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$x1('21'),
						elm$svg$Svg$Attributes$y1('14'),
						elm$svg$Svg$Attributes$x2('3'),
						elm$svg$Svg$Attributes$y2('14')
					]),
				_List_Nil),
				A2(
				elm$svg$Svg$line,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$x1('17'),
						elm$svg$Svg$Attributes$y1('18'),
						elm$svg$Svg$Attributes$x2('3'),
						elm$svg$Svg$Attributes$y2('18')
					]),
				_List_Nil)
			]));
};
var author$project$Icons$alignRight = function (size) {
	return A3(
		author$project$Icons$customSvgFeatherIcon,
		size,
		'align-right',
		_List_fromArray(
			[
				A2(
				elm$svg$Svg$line,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$x1('21'),
						elm$svg$Svg$Attributes$y1('10'),
						elm$svg$Svg$Attributes$x2('7'),
						elm$svg$Svg$Attributes$y2('10')
					]),
				_List_Nil),
				A2(
				elm$svg$Svg$line,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$x1('21'),
						elm$svg$Svg$Attributes$y1('6'),
						elm$svg$Svg$Attributes$x2('3'),
						elm$svg$Svg$Attributes$y2('6')
					]),
				_List_Nil),
				A2(
				elm$svg$Svg$line,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$x1('21'),
						elm$svg$Svg$Attributes$y1('14'),
						elm$svg$Svg$Attributes$x2('3'),
						elm$svg$Svg$Attributes$y2('14')
					]),
				_List_Nil),
				A2(
				elm$svg$Svg$line,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$x1('21'),
						elm$svg$Svg$Attributes$y1('18'),
						elm$svg$Svg$Attributes$x2('7'),
						elm$svg$Svg$Attributes$y2('18')
					]),
				_List_Nil)
			]));
};
var author$project$ImagePlugin$ChangeMode = function (a) {
	return {$: 14, a: a};
};
var author$project$ImagePlugin$ImagePicker = {$: 1};
var author$project$ImagePlugin$Quit = {$: 16};
var author$project$ImagePlugin$SaveAndQuit = {$: 15};
var author$project$ImagePlugin$SetAlignment = function (a) {
	return {$: 0, a: a};
};
var author$project$ImagePlugin$SetCaption = function (a) {
	return {$: 1, a: a};
};
var author$project$ImagePlugin$iconSize = 18;
var elm$html$Html$Attributes$alt = elm$html$Html$Attributes$stringProperty('alt');
var mdgriffith$elm_ui$Element$image = F2(
	function (attrs, _n0) {
		var src = _n0.d9;
		var description = _n0.db;
		var imageAttributes = A2(
			elm$core$List$filter,
			function (a) {
				switch (a.$) {
					case 7:
						return true;
					case 8:
						return true;
					default:
						return false;
				}
			},
			attrs);
		return A4(
			mdgriffith$elm_ui$Internal$Model$element,
			mdgriffith$elm_ui$Internal$Model$asEl,
			mdgriffith$elm_ui$Internal$Model$div,
			A2(
				elm$core$List$cons,
				mdgriffith$elm_ui$Internal$Model$htmlClass(mdgriffith$elm_ui$Internal$Style$classes.fS),
				attrs),
			mdgriffith$elm_ui$Internal$Model$Unkeyed(
				_List_fromArray(
					[
						A4(
						mdgriffith$elm_ui$Internal$Model$element,
						mdgriffith$elm_ui$Internal$Model$asEl,
						mdgriffith$elm_ui$Internal$Model$NodeName('img'),
						_Utils_ap(
							_List_fromArray(
								[
									mdgriffith$elm_ui$Internal$Model$Attr(
									elm$html$Html$Attributes$src(src)),
									mdgriffith$elm_ui$Internal$Model$Attr(
									elm$html$Html$Attributes$alt(description))
								]),
							imageAttributes),
						mdgriffith$elm_ui$Internal$Model$Unkeyed(_List_Nil))
					])));
	});
var mdgriffith$elm_ui$Element$Input$Label = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var mdgriffith$elm_ui$Element$Input$OnLeft = 1;
var mdgriffith$elm_ui$Element$Input$labelLeft = mdgriffith$elm_ui$Element$Input$Label(1);
var mdgriffith$elm_ui$Element$Input$TextInputNode = function (a) {
	return {$: 0, a: a};
};
var elm$html$Html$Attributes$type_ = elm$html$Html$Attributes$stringProperty('type');
var elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			elm$virtual_dom$VirtualDom$on,
			event,
			elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var elm$html$Html$Events$targetValue = A2(
	elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	elm$json$Json$Decode$string);
var elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			elm$json$Json$Decode$map,
			elm$html$Html$Events$alwaysStop,
			A2(elm$json$Json$Decode$map, tagger, elm$html$Html$Events$targetValue)));
};
var mdgriffith$elm_ui$Internal$Flag$transparency = mdgriffith$elm_ui$Internal$Flag$flag(0);
var mdgriffith$elm_ui$Internal$Model$Transparency = F2(
	function (a, b) {
		return {$: 12, a: a, b: b};
	});
var mdgriffith$elm_ui$Element$alpha = function (o) {
	var transparency = function (x) {
		return 1 - x;
	}(
		A2(
			elm$core$Basics$min,
			1.0,
			A2(elm$core$Basics$max, 0.0, o)));
	return A2(
		mdgriffith$elm_ui$Internal$Model$StyleClass,
		mdgriffith$elm_ui$Internal$Flag$transparency,
		A2(
			mdgriffith$elm_ui$Internal$Model$Transparency,
			'transparency-' + mdgriffith$elm_ui$Internal$Model$floatClass(transparency),
			transparency));
};
var mdgriffith$elm_ui$Internal$Model$InFront = 4;
var mdgriffith$elm_ui$Element$inFront = function (element) {
	return A2(mdgriffith$elm_ui$Internal$Model$Nearby, 4, element);
};
var mdgriffith$elm_ui$Element$Input$Padding = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var mdgriffith$elm_ui$Element$Input$applyLabel = F3(
	function (attrs, label, input) {
		if (label.$ === 1) {
			var labelText = label.a;
			return A4(
				mdgriffith$elm_ui$Internal$Model$element,
				mdgriffith$elm_ui$Internal$Model$asColumn,
				mdgriffith$elm_ui$Internal$Model$NodeName('label'),
				attrs,
				mdgriffith$elm_ui$Internal$Model$Unkeyed(
					_List_fromArray(
						[input])));
		} else {
			var position = label.a;
			var labelAttrs = label.b;
			var labelChild = label.c;
			var labelElement = A4(
				mdgriffith$elm_ui$Internal$Model$element,
				mdgriffith$elm_ui$Internal$Model$asEl,
				mdgriffith$elm_ui$Internal$Model$div,
				labelAttrs,
				mdgriffith$elm_ui$Internal$Model$Unkeyed(
					_List_fromArray(
						[labelChild])));
			switch (position) {
				case 2:
					return A4(
						mdgriffith$elm_ui$Internal$Model$element,
						mdgriffith$elm_ui$Internal$Model$asColumn,
						mdgriffith$elm_ui$Internal$Model$NodeName('label'),
						attrs,
						mdgriffith$elm_ui$Internal$Model$Unkeyed(
							_List_fromArray(
								[labelElement, input])));
				case 3:
					return A4(
						mdgriffith$elm_ui$Internal$Model$element,
						mdgriffith$elm_ui$Internal$Model$asColumn,
						mdgriffith$elm_ui$Internal$Model$NodeName('label'),
						attrs,
						mdgriffith$elm_ui$Internal$Model$Unkeyed(
							_List_fromArray(
								[input, labelElement])));
				case 0:
					return A4(
						mdgriffith$elm_ui$Internal$Model$element,
						mdgriffith$elm_ui$Internal$Model$asRow,
						mdgriffith$elm_ui$Internal$Model$NodeName('label'),
						attrs,
						mdgriffith$elm_ui$Internal$Model$Unkeyed(
							_List_fromArray(
								[input, labelElement])));
				default:
					return A4(
						mdgriffith$elm_ui$Internal$Model$element,
						mdgriffith$elm_ui$Internal$Model$asRow,
						mdgriffith$elm_ui$Internal$Model$NodeName('label'),
						attrs,
						mdgriffith$elm_ui$Internal$Model$Unkeyed(
							_List_fromArray(
								[labelElement, input])));
			}
		}
	});
var mdgriffith$elm_ui$Element$Input$autofill = A2(
	elm$core$Basics$composeL,
	mdgriffith$elm_ui$Internal$Model$Attr,
	elm$html$Html$Attributes$attribute('autocomplete'));
var mdgriffith$elm_ui$Element$Input$charcoal = A3(mdgriffith$elm_ui$Element$rgb, 136 / 255, 138 / 255, 133 / 255);
var mdgriffith$elm_ui$Element$Input$darkGrey = A3(mdgriffith$elm_ui$Element$rgb, 186 / 255, 189 / 255, 182 / 255);
var mdgriffith$elm_ui$Element$Input$defaultTextPadding = A2(mdgriffith$elm_ui$Element$paddingXY, 12, 12);
var mdgriffith$elm_ui$Element$Input$white = A3(mdgriffith$elm_ui$Element$rgb, 1, 1, 1);
var mdgriffith$elm_ui$Element$Input$defaultTextBoxStyle = _List_fromArray(
	[
		mdgriffith$elm_ui$Element$Input$defaultTextPadding,
		mdgriffith$elm_ui$Element$Border$rounded(3),
		mdgriffith$elm_ui$Element$Border$color(mdgriffith$elm_ui$Element$Input$darkGrey),
		mdgriffith$elm_ui$Element$Background$color(mdgriffith$elm_ui$Element$Input$white),
		mdgriffith$elm_ui$Element$Border$width(1),
		mdgriffith$elm_ui$Element$spacing(3),
		mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill)
	]);
var mdgriffith$elm_ui$Internal$Model$Label = function (a) {
	return {$: 5, a: a};
};
var mdgriffith$elm_ui$Element$Input$hiddenLabelAttribute = function (label) {
	if (label.$ === 1) {
		var textLabel = label.a;
		return mdgriffith$elm_ui$Internal$Model$Describe(
			mdgriffith$elm_ui$Internal$Model$Label(textLabel));
	} else {
		return mdgriffith$elm_ui$Internal$Model$NoAttribute;
	}
};
var mdgriffith$elm_ui$Element$Input$inheritablePlaceholderAttributes = function (attr) {
	_n0$3:
	while (true) {
		if (attr.$ === 4) {
			switch (attr.b.$) {
				case 7:
					var _n1 = attr.b;
					return true;
				case 6:
					var _n2 = attr.b;
					return true;
				case 10:
					return true;
				default:
					break _n0$3;
			}
		} else {
			break _n0$3;
		}
	}
	return false;
};
var mdgriffith$elm_ui$Element$Input$isHiddenLabel = function (label) {
	if (label.$ === 1) {
		return true;
	} else {
		return false;
	}
};
var elm$html$Html$Attributes$spellcheck = elm$html$Html$Attributes$boolProperty('spellcheck');
var mdgriffith$elm_ui$Element$Input$spellcheck = A2(elm$core$Basics$composeL, mdgriffith$elm_ui$Internal$Model$Attr, elm$html$Html$Attributes$spellcheck);
var elm$core$String$lines = _String_lines;
var mdgriffith$elm_ui$Internal$Flag$heightTextAreaContent = mdgriffith$elm_ui$Internal$Flag$flag(47);
var mdgriffith$elm_ui$Element$Input$textHeightContent = F4(
	function (textValue, spacing, maybePadding, maybeBorder) {
		var topBottom = function (_n0) {
			var t = _n0.a;
			var b = _n0.c;
			return t + b;
		};
		var newlineCount = function (x) {
			return (x < 1) ? 1 : x;
		}(
			elm$core$List$length(
				elm$core$String$lines(textValue)));
		var additionalSpacing = (((newlineCount - 1) * spacing) + A2(
			elm$core$Maybe$withDefault,
			0,
			A2(elm$core$Maybe$map, topBottom, maybePadding))) + A2(
			elm$core$Maybe$withDefault,
			0,
			A2(elm$core$Maybe$map, topBottom, maybeBorder));
		var heightValue = function (count) {
			return 'calc(' + (elm$core$String$fromInt(count) + ('em + ' + (elm$core$String$fromInt(additionalSpacing) + 'px) !important')));
		};
		return A2(
			mdgriffith$elm_ui$Internal$Model$StyleClass,
			mdgriffith$elm_ui$Internal$Flag$heightTextAreaContent,
			A3(
				mdgriffith$elm_ui$Internal$Model$Single,
				'textarea-height-' + elm$core$String$fromInt(newlineCount),
				'height',
				heightValue(newlineCount)));
	});
var elm$html$Html$Attributes$value = elm$html$Html$Attributes$stringProperty('value');
var mdgriffith$elm_ui$Element$Input$value = A2(elm$core$Basics$composeL, mdgriffith$elm_ui$Internal$Model$Attr, elm$html$Html$Attributes$value);
var mdgriffith$elm_ui$Internal$Model$LivePolite = {$: 6};
var mdgriffith$elm_ui$Element$Region$announce = mdgriffith$elm_ui$Internal$Model$Describe(mdgriffith$elm_ui$Internal$Model$LivePolite);
var mdgriffith$elm_ui$Internal$Model$filter = function (attrs) {
	return A3(
		elm$core$List$foldr,
		F2(
			function (x, _n0) {
				var found = _n0.a;
				var has = _n0.b;
				switch (x.$) {
					case 0:
						return _Utils_Tuple2(found, has);
					case 3:
						var key = x.a;
						return _Utils_Tuple2(
							A2(elm$core$List$cons, x, found),
							has);
					case 1:
						var attr = x.a;
						return _Utils_Tuple2(
							A2(elm$core$List$cons, x, found),
							has);
					case 4:
						var style = x.b;
						return _Utils_Tuple2(
							A2(elm$core$List$cons, x, found),
							has);
					case 7:
						var width = x.a;
						return A2(elm$core$Set$member, 'width', has) ? _Utils_Tuple2(found, has) : _Utils_Tuple2(
							A2(elm$core$List$cons, x, found),
							A2(elm$core$Set$insert, 'width', has));
					case 8:
						var height = x.a;
						return A2(elm$core$Set$member, 'height', has) ? _Utils_Tuple2(found, has) : _Utils_Tuple2(
							A2(elm$core$List$cons, x, found),
							A2(elm$core$Set$insert, 'height', has));
					case 2:
						var description = x.a;
						return A2(elm$core$Set$member, 'described', has) ? _Utils_Tuple2(found, has) : _Utils_Tuple2(
							A2(elm$core$List$cons, x, found),
							A2(elm$core$Set$insert, 'described', has));
					case 9:
						var location = x.a;
						var elem = x.b;
						return _Utils_Tuple2(
							A2(elm$core$List$cons, x, found),
							has);
					case 6:
						return A2(elm$core$Set$member, 'align-x', has) ? _Utils_Tuple2(found, has) : _Utils_Tuple2(
							A2(elm$core$List$cons, x, found),
							A2(elm$core$Set$insert, 'align-x', has));
					case 5:
						return A2(elm$core$Set$member, 'align-y', has) ? _Utils_Tuple2(found, has) : _Utils_Tuple2(
							A2(elm$core$List$cons, x, found),
							A2(elm$core$Set$insert, 'align-y', has));
					default:
						return A2(elm$core$Set$member, 'transform', has) ? _Utils_Tuple2(found, has) : _Utils_Tuple2(
							A2(elm$core$List$cons, x, found),
							A2(elm$core$Set$insert, 'transform', has));
				}
			}),
		_Utils_Tuple2(_List_Nil, elm$core$Set$empty),
		attrs).a;
};
var mdgriffith$elm_ui$Internal$Model$get = F2(
	function (attrs, isAttr) {
		return A3(
			elm$core$List$foldr,
			F2(
				function (x, found) {
					return isAttr(x) ? A2(elm$core$List$cons, x, found) : found;
				}),
			_List_Nil,
			mdgriffith$elm_ui$Internal$Model$filter(attrs));
	});
var mdgriffith$elm_ui$Internal$Model$isContent = function (len) {
	isContent:
	while (true) {
		switch (len.$) {
			case 1:
				return true;
			case 4:
				var l = len.b;
				var $temp$len = l;
				len = $temp$len;
				continue isContent;
			case 3:
				var l = len.b;
				var $temp$len = l;
				len = $temp$len;
				continue isContent;
			default:
				return false;
		}
	}
};
var mdgriffith$elm_ui$Element$Input$textHelper = F3(
	function (textInput, attrs, textOptions) {
		var forNearby = function (attr) {
			if (attr.$ === 9) {
				return true;
			} else {
				return false;
			}
		};
		var behavior = _List_fromArray(
			[
				mdgriffith$elm_ui$Internal$Model$Attr(
				elm$html$Html$Events$onInput(textOptions.cQ))
			]);
		var attributes = _Utils_ap(mdgriffith$elm_ui$Element$Input$defaultTextBoxStyle, attrs);
		var attributesFromChild = A2(
			mdgriffith$elm_ui$Internal$Model$get,
			attributes,
			function (attr) {
				_n21$7:
				while (true) {
					switch (attr.$) {
						case 7:
							if (attr.a.$ === 2) {
								return true;
							} else {
								break _n21$7;
							}
						case 8:
							if (attr.a.$ === 2) {
								return true;
							} else {
								break _n21$7;
							}
						case 6:
							return true;
						case 5:
							return true;
						case 4:
							switch (attr.b.$) {
								case 5:
									var _n22 = attr.b;
									return true;
								case 2:
									return true;
								case 1:
									var _n23 = attr.b;
									return true;
								default:
									break _n21$7;
							}
						default:
							break _n21$7;
					}
				}
				return false;
			});
		var forPlaceholder = A2(elm$core$List$filter, mdgriffith$elm_ui$Element$Input$inheritablePlaceholderAttributes, attributes);
		var heightFillFromChild = A2(
			mdgriffith$elm_ui$Internal$Model$get,
			attributes,
			function (attr) {
				if ((attr.$ === 8) && (attr.a.$ === 2)) {
					return true;
				} else {
					return false;
				}
			});
		var inputPadding = A2(
			mdgriffith$elm_ui$Internal$Model$get,
			attributes,
			function (attr) {
				if ((attr.$ === 4) && (attr.b.$ === 7)) {
					var _n19 = attr.b;
					return true;
				} else {
					return false;
				}
			});
		var nearbys = A2(
			mdgriffith$elm_ui$Internal$Model$get,
			attributes,
			function (attr) {
				if (attr.$ === 9) {
					return true;
				} else {
					return false;
				}
			});
		var noNearbys = A2(
			elm$core$List$filter,
			A2(elm$core$Basics$composeL, elm$core$Basics$not, forNearby),
			attributes);
		var _n0 = function () {
			var _n1 = textInput.ai;
			if (!_n1.$) {
				var inputType = _n1.a;
				return _Utils_Tuple3(
					'input',
					_Utils_ap(
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$Input$value(textOptions.ec),
								mdgriffith$elm_ui$Internal$Model$Attr(
								elm$html$Html$Attributes$type_(inputType)),
								mdgriffith$elm_ui$Element$Input$spellcheck(textInput.Z),
								mdgriffith$elm_ui$Internal$Model$htmlClass(mdgriffith$elm_ui$Internal$Style$classes.f$),
								function () {
								var _n2 = textInput.O;
								if (_n2.$ === 1) {
									return mdgriffith$elm_ui$Internal$Model$NoAttribute;
								} else {
									var fill = _n2.a;
									return mdgriffith$elm_ui$Element$Input$autofill(fill);
								}
							}()
							]),
						noNearbys),
					_List_Nil);
			} else {
				var _n3 = A3(
					elm$core$List$foldr,
					F2(
						function (attr, found) {
							_n4$5:
							while (true) {
								switch (attr.$) {
									case 2:
										return found;
									case 8:
										var len = attr.a;
										var _n5 = found.b3;
										if (_n5.$ === 1) {
											return _Utils_update(
												found,
												{
													J: A2(elm$core$List$cons, attr, found.J),
													b3: elm$core$Maybe$Just(
														mdgriffith$elm_ui$Internal$Model$isContent(len))
												});
										} else {
											return found;
										}
									case 4:
										switch (attr.b.$) {
											case 6:
												var _n6 = attr.b;
												var t = _n6.b;
												var r = _n6.c;
												var b = _n6.d;
												var l = _n6.e;
												var _n7 = found.b5;
												if (_n7.$ === 1) {
													return _Utils_update(
														found,
														{
															J: A2(elm$core$List$cons, attr, found.J),
															b5: elm$core$Maybe$Just(
																A4(mdgriffith$elm_ui$Element$Input$Padding, t, r, b, l))
														});
												} else {
													return found;
												}
											case 7:
												var _n8 = attr.b;
												var t = _n8.b;
												var r = _n8.c;
												var b = _n8.d;
												var l = _n8.e;
												var _n9 = found.b6;
												if (_n9.$ === 1) {
													return _Utils_update(
														found,
														{
															J: found.J,
															b6: elm$core$Maybe$Just(
																A4(mdgriffith$elm_ui$Element$Input$Padding, t, r, b, l))
														});
												} else {
													return found;
												}
											case 5:
												var _n10 = attr.b;
												var x = _n10.b;
												var y = _n10.c;
												var _n11 = found.b7;
												if (_n11.$ === 1) {
													return _Utils_update(
														found,
														{
															J: A2(elm$core$List$cons, attr, found.J),
															b7: elm$core$Maybe$Just(y)
														});
												} else {
													return found;
												}
											default:
												break _n4$5;
										}
									default:
										break _n4$5;
								}
							}
							return _Utils_update(
								found,
								{
									J: A2(elm$core$List$cons, attr, found.J)
								});
						}),
					{J: _List_Nil, b3: elm$core$Maybe$Nothing, b5: elm$core$Maybe$Nothing, b6: elm$core$Maybe$Nothing, b7: elm$core$Maybe$Nothing},
					attributes);
				var maybePadding = _n3.b6;
				var heightContent = _n3.b3;
				var maybeSpacing = _n3.b7;
				var adjustedAttributes = _n3.J;
				var maybeBorder = _n3.b5;
				var spacing = A2(elm$core$Maybe$withDefault, 5, maybeSpacing);
				return _Utils_Tuple3(
					'textarea',
					_Utils_ap(
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$Input$spellcheck(textInput.Z),
								mdgriffith$elm_ui$Internal$Model$htmlClass(mdgriffith$elm_ui$Internal$Style$classes.f_),
								A2(
								elm$core$Maybe$withDefault,
								mdgriffith$elm_ui$Internal$Model$NoAttribute,
								A2(elm$core$Maybe$map, mdgriffith$elm_ui$Element$Input$autofill, textInput.O)),
								function () {
								if (maybePadding.$ === 1) {
									return mdgriffith$elm_ui$Internal$Model$NoAttribute;
								} else {
									var _n13 = maybePadding.a;
									var t = _n13.a;
									var r = _n13.b;
									var b = _n13.c;
									var l = _n13.d;
									return mdgriffith$elm_ui$Element$paddingEach(
										{
											eO: A2(elm$core$Basics$max, 0, b - ((spacing / 2) | 0)),
											f5: l,
											gK: r,
											hA: A2(elm$core$Basics$max, 0, t - ((spacing / 2) | 0))
										});
								}
							}(),
								function () {
								if (heightContent.$ === 1) {
									return mdgriffith$elm_ui$Internal$Model$NoAttribute;
								} else {
									if (heightContent.a) {
										return A4(mdgriffith$elm_ui$Element$Input$textHeightContent, textOptions.ec, spacing, maybePadding, maybeBorder);
									} else {
										return mdgriffith$elm_ui$Internal$Model$NoAttribute;
									}
								}
							}()
							]),
						adjustedAttributes),
					_List_fromArray(
						[
							mdgriffith$elm_ui$Internal$Model$unstyled(
							elm$html$Html$text(textOptions.ec))
						]));
			}
		}();
		var inputNode = _n0.a;
		var inputAttrs = _n0.b;
		var inputChildren = _n0.c;
		var inputElement = A4(
			mdgriffith$elm_ui$Internal$Model$element,
			mdgriffith$elm_ui$Internal$Model$asEl,
			mdgriffith$elm_ui$Internal$Model$div,
			A2(
				elm$core$List$cons,
				mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill),
				elm$core$List$concat(
					_List_fromArray(
						[
							nearbys,
							heightFillFromChild,
							function () {
							var _n15 = textOptions.dO;
							if (_n15.$ === 1) {
								return _List_Nil;
							} else {
								var _n16 = _n15.a;
								var placeholderAttrs = _n16.a;
								var placeholderEl = _n16.b;
								return _List_fromArray(
									[
										mdgriffith$elm_ui$Element$inFront(
										A2(
											mdgriffith$elm_ui$Element$el,
											A2(
												elm$core$List$cons,
												mdgriffith$elm_ui$Element$Input$defaultTextPadding,
												_Utils_ap(
													forPlaceholder,
													_Utils_ap(
														_List_fromArray(
															[
																mdgriffith$elm_ui$Element$Font$color(mdgriffith$elm_ui$Element$Input$charcoal),
																mdgriffith$elm_ui$Internal$Model$htmlClass(mdgriffith$elm_ui$Internal$Style$classes.dE + (' ' + mdgriffith$elm_ui$Internal$Style$classes.gz)),
																mdgriffith$elm_ui$Element$Border$color(
																A4(mdgriffith$elm_ui$Element$rgba, 0, 0, 0, 0)),
																mdgriffith$elm_ui$Element$Background$color(
																A4(mdgriffith$elm_ui$Element$rgba, 0, 0, 0, 0)),
																mdgriffith$elm_ui$Element$height(mdgriffith$elm_ui$Element$fill),
																mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill),
																mdgriffith$elm_ui$Element$alpha(
																(textOptions.ec === '') ? 1 : 0)
															]),
														placeholderAttrs))),
											placeholderEl))
									]);
							}
						}()
						]))),
			mdgriffith$elm_ui$Internal$Model$Unkeyed(
				_List_fromArray(
					[
						A4(
						mdgriffith$elm_ui$Internal$Model$element,
						mdgriffith$elm_ui$Internal$Model$asEl,
						mdgriffith$elm_ui$Internal$Model$NodeName(inputNode),
						elm$core$List$concat(
							_List_fromArray(
								[
									_List_fromArray(
									[
										mdgriffith$elm_ui$Element$Input$focusDefault(attrs),
										mdgriffith$elm_ui$Element$Input$hiddenLabelAttribute(textOptions.b4)
									]),
									inputAttrs,
									behavior
								])),
						mdgriffith$elm_ui$Internal$Model$Unkeyed(inputChildren))
					])));
		return A3(
			mdgriffith$elm_ui$Element$Input$applyLabel,
			A2(
				elm$core$List$cons,
				A2(mdgriffith$elm_ui$Internal$Model$Class, mdgriffith$elm_ui$Internal$Flag$cursor, mdgriffith$elm_ui$Internal$Style$classes.fk),
				A2(
					elm$core$List$cons,
					mdgriffith$elm_ui$Element$Input$isHiddenLabel(textOptions.b4) ? mdgriffith$elm_ui$Internal$Model$NoAttribute : mdgriffith$elm_ui$Element$spacing(5),
					A2(elm$core$List$cons, mdgriffith$elm_ui$Element$Region$announce, attributesFromChild))),
			textOptions.b4,
			inputElement);
	});
var mdgriffith$elm_ui$Element$Input$text = mdgriffith$elm_ui$Element$Input$textHelper(
	{
		O: elm$core$Maybe$Nothing,
		Z: false,
		ai: mdgriffith$elm_ui$Element$Input$TextInputNode('text')
	});
var author$project$ImagePlugin$imageAttributeEditorView = F2(
	function (config, model) {
		return A2(
			mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					mdgriffith$elm_ui$Element$spacing(15),
					mdgriffith$elm_ui$Element$Font$size(16),
					mdgriffith$elm_ui$Element$padding(15),
					mdgriffith$elm_ui$Element$alignTop
				]),
			_List_fromArray(
				[
					mdgriffith$elm_ui$Element$text('Insérer / Modifier une Image:'),
					mdgriffith$elm_ui$Element$text('Alignement: '),
					A2(
					mdgriffith$elm_ui$Element$row,
					_List_fromArray(
						[
							mdgriffith$elm_ui$Element$spacing(15)
						]),
					_List_fromArray(
						[
							A2(
							mdgriffith$elm_ui$Element$Input$button,
							A2(author$project$DocumentEditorHelpers$toogleButtonStyle, model.aP === 2, true),
							{
								b4: A2(
									mdgriffith$elm_ui$Element$el,
									_List_Nil,
									mdgriffith$elm_ui$Element$html(
										author$project$Icons$alignLeft(author$project$ImagePlugin$iconSize))),
								cf: elm$core$Maybe$Just(
									author$project$ImagePlugin$SetAlignment(2))
							}),
							A2(
							mdgriffith$elm_ui$Element$Input$button,
							A2(author$project$DocumentEditorHelpers$toogleButtonStyle, model.aP === 1, true),
							{
								b4: A2(
									mdgriffith$elm_ui$Element$el,
									_List_Nil,
									mdgriffith$elm_ui$Element$html(
										author$project$Icons$alignCenter(author$project$ImagePlugin$iconSize))),
								cf: elm$core$Maybe$Just(
									author$project$ImagePlugin$SetAlignment(1))
							}),
							A2(
							mdgriffith$elm_ui$Element$Input$button,
							A2(author$project$DocumentEditorHelpers$toogleButtonStyle, !model.aP, true),
							{
								b4: A2(
									mdgriffith$elm_ui$Element$el,
									_List_Nil,
									mdgriffith$elm_ui$Element$html(
										author$project$Icons$alignRight(author$project$ImagePlugin$iconSize))),
								cf: elm$core$Maybe$Just(
									author$project$ImagePlugin$SetAlignment(0))
							})
						])),
					A2(
					mdgriffith$elm_ui$Element$row,
					_List_fromArray(
						[
							mdgriffith$elm_ui$Element$spacing(15)
						]),
					_List_fromArray(
						[
							A2(
							mdgriffith$elm_ui$Element$Input$text,
							author$project$DocumentEditorHelpers$textInputStyle,
							{
								b4: A2(
									mdgriffith$elm_ui$Element$Input$labelLeft,
									_List_fromArray(
										[mdgriffith$elm_ui$Element$centerY]),
									A2(
										mdgriffith$elm_ui$Element$el,
										_List_fromArray(
											[
												mdgriffith$elm_ui$Element$width(
												mdgriffith$elm_ui$Element$px(110))
											]),
										mdgriffith$elm_ui$Element$text('Légende: '))),
								cQ: author$project$ImagePlugin$SetCaption,
								dO: elm$core$Maybe$Nothing,
								ec: A2(elm$core$Maybe$withDefault, '', model.a_)
							})
						])),
					A2(
					mdgriffith$elm_ui$Element$row,
					_List_fromArray(
						[
							mdgriffith$elm_ui$Element$spacing(15)
						]),
					_List_fromArray(
						[
							function () {
							var _n0 = model.aC;
							if (_n0.$ === 1) {
								return mdgriffith$elm_ui$Element$none;
							} else {
								return mdgriffith$elm_ui$Element$text('Aperçu: ');
							}
						}(),
							A2(
							mdgriffith$elm_ui$Element$Input$button,
							author$project$DocumentEditorHelpers$buttonStyle(true),
							{
								b4: function () {
									var _n1 = model.aC;
									if (_n1.$ === 1) {
										return A2(
											mdgriffith$elm_ui$Element$el,
											_List_Nil,
											mdgriffith$elm_ui$Element$text('Nouvelle Image'));
									} else {
										return A2(
											mdgriffith$elm_ui$Element$el,
											_List_Nil,
											mdgriffith$elm_ui$Element$text('Remplacer Image'));
									}
								}(),
								cf: elm$core$Maybe$Just(
									author$project$ImagePlugin$ChangeMode(author$project$ImagePlugin$ImagePicker))
							})
						])),
					A2(
					mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							mdgriffith$elm_ui$Element$width(
							A2(mdgriffith$elm_ui$Element$maximum, 650, mdgriffith$elm_ui$Element$fill)),
							mdgriffith$elm_ui$Element$height(
							A2(mdgriffith$elm_ui$Element$maximum, 550, mdgriffith$elm_ui$Element$fill)),
							mdgriffith$elm_ui$Element$scrollbars
						]),
					A2(
						mdgriffith$elm_ui$Element$image,
						_List_fromArray(
							[mdgriffith$elm_ui$Element$centerY, mdgriffith$elm_ui$Element$centerX]),
						{
							db: A2(elm$core$Maybe$withDefault, '', model.a_),
							d9: A2(
								elm$core$Maybe$withDefault,
								'',
								A2(
									elm$core$Maybe$map,
									function (src) {
										if (src.$ === 1) {
											var base64 = src.b;
											return base64;
										} else {
											var url = src.a;
											return url;
										}
									},
									A2(
										elm$core$Maybe$map,
										function ($) {
											return $.d9;
										},
										model.aC)))
						})),
					A2(
					mdgriffith$elm_ui$Element$row,
					_List_fromArray(
						[
							mdgriffith$elm_ui$Element$spacing(15)
						]),
					_List_fromArray(
						[
							A2(
							mdgriffith$elm_ui$Element$Input$button,
							author$project$DocumentEditorHelpers$buttonStyle(true),
							{
								b4: mdgriffith$elm_ui$Element$text('Quitter'),
								cf: elm$core$Maybe$Just(author$project$ImagePlugin$Quit)
							}),
							A2(
							mdgriffith$elm_ui$Element$Input$button,
							author$project$DocumentEditorHelpers$buttonStyle(true),
							{
								b4: mdgriffith$elm_ui$Element$text('Valider et Quitter'),
								cf: elm$core$Maybe$Just(author$project$ImagePlugin$SaveAndQuit)
							})
						]))
				]));
	});
var author$project$ImagePlugin$FileRead = function (a) {
	return {$: 4, a: a};
};
var author$project$ImagePlugin$ImageRead = function (a) {
	return {$: 5, a: a};
};
var author$project$ImagePlugin$ImageFromFile = F5(
	function (contents, filename, width, height, filesize) {
		return {aT: contents, ay: filename, aV: filesize, fL: height, hL: width};
	});
var elm$json$Json$Decode$map5 = _Json_map5;
var author$project$ImagePlugin$decodeImageData = function (msg) {
	return A2(
		elm$json$Json$Decode$at,
		_List_fromArray(
			['target', 'fileData']),
		A2(
			elm$json$Json$Decode$map,
			msg,
			A6(
				elm$json$Json$Decode$map5,
				author$project$ImagePlugin$ImageFromFile,
				A2(elm$json$Json$Decode$field, 'contents', elm$json$Json$Decode$string),
				A2(elm$json$Json$Decode$field, 'filename', elm$json$Json$Decode$string),
				A2(elm$json$Json$Decode$field, 'width', elm$json$Json$Decode$int),
				A2(elm$json$Json$Decode$field, 'height', elm$json$Json$Decode$int),
				A2(elm$json$Json$Decode$field, 'filesize', elm$json$Json$Decode$int))));
};
var author$project$Icons$rotateCcw = function (size) {
	return A3(
		author$project$Icons$customSvgFeatherIcon,
		size,
		'rotate-ccw',
		_List_fromArray(
			[
				A2(
				elm$svg$Svg$polyline,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$points('1 4 1 10 7 10')
					]),
				_List_Nil),
				A2(
				elm$svg$Svg$path,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$d('M3.51 15a9 9 0 1 0 2.13-9.36L1 10')
					]),
				_List_Nil)
			]));
};
var author$project$Icons$rotateCw = function (size) {
	return A3(
		author$project$Icons$customSvgFeatherIcon,
		size,
		'rotate-cw',
		_List_fromArray(
			[
				A2(
				elm$svg$Svg$polyline,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$points('23 4 23 10 17 10')
					]),
				_List_Nil),
				A2(
				elm$svg$Svg$path,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$d('M20.49 15a9 9 0 1 1-2.12-9.36L23 10')
					]),
				_List_Nil)
			]));
};
var author$project$ImagePlugin$ConfirmNewImage = {$: 13};
var author$project$ImagePlugin$ResetImageController = {$: 12};
var author$project$ImagePlugin$Resize = function (a) {
	return {$: 9, a: a};
};
var author$project$ImagePlugin$RotateLeft = {$: 8};
var author$project$ImagePlugin$RotateRight = {$: 7};
var author$project$ImagePlugin$SetFilename = function (a) {
	return {$: 11, a: a};
};
var author$project$ImagePlugin$SetResize = {$: 10};
var mdgriffith$elm_ui$Internal$Model$Behind = 5;
var mdgriffith$elm_ui$Element$behindContent = function (element) {
	return A2(mdgriffith$elm_ui$Internal$Model$Nearby, 5, element);
};
var mdgriffith$elm_ui$Element$Input$Thumb = elm$core$Basics$identity;
var mdgriffith$elm_ui$Element$Input$defaultThumb = _List_fromArray(
	[
		mdgriffith$elm_ui$Element$width(
		mdgriffith$elm_ui$Element$px(16)),
		mdgriffith$elm_ui$Element$height(
		mdgriffith$elm_ui$Element$px(16)),
		mdgriffith$elm_ui$Element$Border$rounded(8),
		mdgriffith$elm_ui$Element$Border$width(1),
		mdgriffith$elm_ui$Element$Border$color(
		A3(mdgriffith$elm_ui$Element$rgb, 0.5, 0.5, 0.5)),
		mdgriffith$elm_ui$Element$Background$color(
		A3(mdgriffith$elm_ui$Element$rgb, 1, 1, 1))
	]);
var elm$html$Html$Attributes$max = elm$html$Html$Attributes$stringProperty('max');
var elm$html$Html$Attributes$min = elm$html$Html$Attributes$stringProperty('min');
var elm$html$Html$Attributes$step = function (n) {
	return A2(elm$html$Html$Attributes$stringProperty, 'step', n);
};
var elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var mdgriffith$elm_ui$Element$fillPortion = mdgriffith$elm_ui$Internal$Model$Fill;
var mdgriffith$elm_ui$Internal$Model$mapAttr = F2(
	function (fn, attr) {
		switch (attr.$) {
			case 0:
				return mdgriffith$elm_ui$Internal$Model$NoAttribute;
			case 2:
				var description = attr.a;
				return mdgriffith$elm_ui$Internal$Model$Describe(description);
			case 6:
				var x = attr.a;
				return mdgriffith$elm_ui$Internal$Model$AlignX(x);
			case 5:
				var y = attr.a;
				return mdgriffith$elm_ui$Internal$Model$AlignY(y);
			case 7:
				var x = attr.a;
				return mdgriffith$elm_ui$Internal$Model$Width(x);
			case 8:
				var x = attr.a;
				return mdgriffith$elm_ui$Internal$Model$Height(x);
			case 3:
				var x = attr.a;
				var y = attr.b;
				return A2(mdgriffith$elm_ui$Internal$Model$Class, x, y);
			case 4:
				var flag = attr.a;
				var style = attr.b;
				return A2(mdgriffith$elm_ui$Internal$Model$StyleClass, flag, style);
			case 9:
				var location = attr.a;
				var elem = attr.b;
				return A2(
					mdgriffith$elm_ui$Internal$Model$Nearby,
					location,
					A2(mdgriffith$elm_ui$Internal$Model$map, fn, elem));
			case 1:
				var htmlAttr = attr.a;
				return mdgriffith$elm_ui$Internal$Model$Attr(
					A2(elm$virtual_dom$VirtualDom$mapAttribute, fn, htmlAttr));
			default:
				var fl = attr.a;
				var trans = attr.b;
				return A2(mdgriffith$elm_ui$Internal$Model$TransformComponent, fl, trans);
		}
	});
var mdgriffith$elm_ui$Element$Input$viewHorizontalThumb = F3(
	function (factor, thumbAttributes, trackHeight) {
		return A2(
			mdgriffith$elm_ui$Element$row,
			_List_fromArray(
				[
					mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill),
					mdgriffith$elm_ui$Element$height(
					A2(elm$core$Maybe$withDefault, mdgriffith$elm_ui$Element$fill, trackHeight)),
					mdgriffith$elm_ui$Element$centerY
				]),
			_List_fromArray(
				[
					A2(
					mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							mdgriffith$elm_ui$Element$width(
							mdgriffith$elm_ui$Element$fillPortion(
								elm$core$Basics$round(factor * 10000)))
						]),
					mdgriffith$elm_ui$Element$none),
					A2(
					mdgriffith$elm_ui$Element$el,
					A2(
						elm$core$List$cons,
						mdgriffith$elm_ui$Element$centerY,
						A2(
							elm$core$List$map,
							mdgriffith$elm_ui$Internal$Model$mapAttr(elm$core$Basics$never),
							thumbAttributes)),
					mdgriffith$elm_ui$Element$none),
					A2(
					mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							mdgriffith$elm_ui$Element$width(
							mdgriffith$elm_ui$Element$fillPortion(
								elm$core$Basics$round(
									elm$core$Basics$abs(1 - factor) * 10000)))
						]),
					mdgriffith$elm_ui$Element$none)
				]));
	});
var mdgriffith$elm_ui$Element$Input$viewVerticalThumb = F3(
	function (factor, thumbAttributes, trackWidth) {
		return A2(
			mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					mdgriffith$elm_ui$Element$height(mdgriffith$elm_ui$Element$fill),
					mdgriffith$elm_ui$Element$width(
					A2(elm$core$Maybe$withDefault, mdgriffith$elm_ui$Element$fill, trackWidth)),
					mdgriffith$elm_ui$Element$centerX
				]),
			_List_fromArray(
				[
					A2(
					mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							mdgriffith$elm_ui$Element$height(
							mdgriffith$elm_ui$Element$fillPortion(
								elm$core$Basics$round(
									elm$core$Basics$abs(1 - factor) * 10000)))
						]),
					mdgriffith$elm_ui$Element$none),
					A2(
					mdgriffith$elm_ui$Element$el,
					A2(
						elm$core$List$cons,
						mdgriffith$elm_ui$Element$centerX,
						A2(
							elm$core$List$map,
							mdgriffith$elm_ui$Internal$Model$mapAttr(elm$core$Basics$never),
							thumbAttributes)),
					mdgriffith$elm_ui$Element$none),
					A2(
					mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							mdgriffith$elm_ui$Element$height(
							mdgriffith$elm_ui$Element$fillPortion(
								elm$core$Basics$round(factor * 10000)))
						]),
					mdgriffith$elm_ui$Element$none)
				]));
	});
var mdgriffith$elm_ui$Internal$Flag$active = mdgriffith$elm_ui$Internal$Flag$flag(32);
var mdgriffith$elm_ui$Internal$Model$getHeight = function (attrs) {
	return A3(
		elm$core$List$foldr,
		F2(
			function (attr, acc) {
				if (!acc.$) {
					var x = acc.a;
					return elm$core$Maybe$Just(x);
				} else {
					if (attr.$ === 8) {
						var len = attr.a;
						return elm$core$Maybe$Just(len);
					} else {
						return elm$core$Maybe$Nothing;
					}
				}
			}),
		elm$core$Maybe$Nothing,
		attrs);
};
var mdgriffith$elm_ui$Internal$Model$getWidth = function (attrs) {
	return A3(
		elm$core$List$foldr,
		F2(
			function (attr, acc) {
				if (!acc.$) {
					var x = acc.a;
					return elm$core$Maybe$Just(x);
				} else {
					if (attr.$ === 7) {
						var len = attr.a;
						return elm$core$Maybe$Just(len);
					} else {
						return elm$core$Maybe$Nothing;
					}
				}
			}),
		elm$core$Maybe$Nothing,
		attrs);
};
var mdgriffith$elm_ui$Element$Input$slider = F2(
	function (attributes, input) {
		var trackWidth = mdgriffith$elm_ui$Internal$Model$getWidth(attributes);
		var trackHeight = mdgriffith$elm_ui$Internal$Model$getHeight(attributes);
		var vertical = function () {
			var _n8 = _Utils_Tuple2(trackWidth, trackHeight);
			_n8$3:
			while (true) {
				if (_n8.a.$ === 1) {
					if (_n8.b.$ === 1) {
						var _n9 = _n8.a;
						var _n10 = _n8.b;
						return false;
					} else {
						break _n8$3;
					}
				} else {
					if ((!_n8.a.a.$) && (!_n8.b.$)) {
						switch (_n8.b.a.$) {
							case 0:
								var w = _n8.a.a.a;
								var h = _n8.b.a.a;
								return _Utils_cmp(h, w) > 0;
							case 2:
								return true;
							default:
								break _n8$3;
						}
					} else {
						break _n8$3;
					}
				}
			}
			return false;
		}();
		var factor = (input.ef - input.ge) / (input.gb - input.ge);
		var _n0 = input.hw;
		var thumbAttributes = _n0;
		var height = mdgriffith$elm_ui$Internal$Model$getHeight(thumbAttributes);
		var thumbHeightString = function () {
			if (height.$ === 1) {
				return '20px';
			} else {
				if (!height.a.$) {
					var px = height.a.a;
					return elm$core$String$fromInt(px) + 'px';
				} else {
					return '100%';
				}
			}
		}();
		var width = mdgriffith$elm_ui$Internal$Model$getWidth(thumbAttributes);
		var thumbWidthString = function () {
			if (width.$ === 1) {
				return '20px';
			} else {
				if (!width.a.$) {
					var px = width.a.a;
					return elm$core$String$fromInt(px) + 'px';
				} else {
					return '100%';
				}
			}
		}();
		var className = 'thmb-' + (thumbWidthString + ('-' + thumbHeightString));
		var thumbShadowStyle = _List_fromArray(
			[
				A2(mdgriffith$elm_ui$Internal$Model$Property, 'width', thumbWidthString),
				A2(mdgriffith$elm_ui$Internal$Model$Property, 'height', thumbHeightString)
			]);
		var _n1 = A2(
			mdgriffith$elm_ui$Internal$Model$getSpacing,
			attributes,
			_Utils_Tuple2(5, 5));
		var spacingX = _n1.a;
		var spacingY = _n1.b;
		return A3(
			mdgriffith$elm_ui$Element$Input$applyLabel,
			_List_fromArray(
				[
					mdgriffith$elm_ui$Element$Input$isHiddenLabel(input.b4) ? mdgriffith$elm_ui$Internal$Model$NoAttribute : A2(mdgriffith$elm_ui$Element$spacingXY, spacingX, spacingY),
					mdgriffith$elm_ui$Element$Region$announce,
					mdgriffith$elm_ui$Element$width(
					function () {
						if (trackWidth.$ === 1) {
							return mdgriffith$elm_ui$Element$fill;
						} else {
							if (!trackWidth.a.$) {
								return mdgriffith$elm_ui$Element$shrink;
							} else {
								var x = trackWidth.a;
								return x;
							}
						}
					}()),
					mdgriffith$elm_ui$Element$height(
					function () {
						if (trackHeight.$ === 1) {
							return mdgriffith$elm_ui$Element$shrink;
						} else {
							if (!trackHeight.a.$) {
								return mdgriffith$elm_ui$Element$shrink;
							} else {
								var x = trackHeight.a;
								return x;
							}
						}
					}())
				]),
			input.b4,
			A2(
				mdgriffith$elm_ui$Element$row,
				_List_fromArray(
					[
						mdgriffith$elm_ui$Element$width(
						A2(elm$core$Maybe$withDefault, mdgriffith$elm_ui$Element$fill, trackWidth)),
						mdgriffith$elm_ui$Element$height(
						A2(
							elm$core$Maybe$withDefault,
							mdgriffith$elm_ui$Element$px(20),
							trackHeight))
					]),
				_List_fromArray(
					[
						A4(
						mdgriffith$elm_ui$Internal$Model$element,
						mdgriffith$elm_ui$Internal$Model$asEl,
						mdgriffith$elm_ui$Internal$Model$NodeName('input'),
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$Input$hiddenLabelAttribute(input.b4),
								A2(
								mdgriffith$elm_ui$Internal$Model$StyleClass,
								mdgriffith$elm_ui$Internal$Flag$active,
								A2(mdgriffith$elm_ui$Internal$Model$Style, 'input[type=\"range\"].' + (className + '::-moz-range-thumb'), thumbShadowStyle)),
								A2(
								mdgriffith$elm_ui$Internal$Model$StyleClass,
								mdgriffith$elm_ui$Internal$Flag$hover,
								A2(mdgriffith$elm_ui$Internal$Model$Style, 'input[type=\"range\"].' + (className + '::-webkit-slider-thumb'), thumbShadowStyle)),
								A2(
								mdgriffith$elm_ui$Internal$Model$StyleClass,
								mdgriffith$elm_ui$Internal$Flag$focus,
								A2(mdgriffith$elm_ui$Internal$Model$Style, 'input[type=\"range\"].' + (className + '::-ms-thumb'), thumbShadowStyle)),
								mdgriffith$elm_ui$Internal$Model$Attr(
								elm$html$Html$Attributes$class(className + ' focusable-parent')),
								mdgriffith$elm_ui$Internal$Model$Attr(
								elm$html$Html$Events$onInput(
									function (str) {
										var _n4 = elm$core$String$toFloat(str);
										if (_n4.$ === 1) {
											return input.cQ(0);
										} else {
											var val = _n4.a;
											return input.cQ(val);
										}
									})),
								mdgriffith$elm_ui$Internal$Model$Attr(
								elm$html$Html$Attributes$type_('range')),
								mdgriffith$elm_ui$Internal$Model$Attr(
								elm$html$Html$Attributes$step(
									function () {
										var _n5 = input.g4;
										if (_n5.$ === 1) {
											return 'any';
										} else {
											var step = _n5.a;
											return elm$core$String$fromFloat(step);
										}
									}())),
								mdgriffith$elm_ui$Internal$Model$Attr(
								elm$html$Html$Attributes$min(
									elm$core$String$fromFloat(input.ge))),
								mdgriffith$elm_ui$Internal$Model$Attr(
								elm$html$Html$Attributes$max(
									elm$core$String$fromFloat(input.gb))),
								mdgriffith$elm_ui$Internal$Model$Attr(
								elm$html$Html$Attributes$value(
									elm$core$String$fromFloat(input.ef))),
								vertical ? mdgriffith$elm_ui$Internal$Model$Attr(
								A2(elm$html$Html$Attributes$attribute, 'orient', 'vertical')) : mdgriffith$elm_ui$Internal$Model$NoAttribute,
								mdgriffith$elm_ui$Element$width(
								vertical ? A2(
									elm$core$Maybe$withDefault,
									mdgriffith$elm_ui$Element$px(20),
									trackHeight) : A2(elm$core$Maybe$withDefault, mdgriffith$elm_ui$Element$fill, trackWidth)),
								mdgriffith$elm_ui$Element$height(
								vertical ? A2(elm$core$Maybe$withDefault, mdgriffith$elm_ui$Element$fill, trackWidth) : A2(
									elm$core$Maybe$withDefault,
									mdgriffith$elm_ui$Element$px(20),
									trackHeight))
							]),
						mdgriffith$elm_ui$Internal$Model$Unkeyed(_List_Nil)),
						A2(
						mdgriffith$elm_ui$Element$el,
						A2(
							elm$core$List$cons,
							mdgriffith$elm_ui$Element$width(
								A2(elm$core$Maybe$withDefault, mdgriffith$elm_ui$Element$fill, trackWidth)),
							A2(
								elm$core$List$cons,
								mdgriffith$elm_ui$Element$height(
									A2(
										elm$core$Maybe$withDefault,
										mdgriffith$elm_ui$Element$px(20),
										trackHeight)),
								_Utils_ap(
									attributes,
									_List_fromArray(
										[
											mdgriffith$elm_ui$Element$behindContent(
											vertical ? A3(mdgriffith$elm_ui$Element$Input$viewVerticalThumb, factor, thumbAttributes, trackWidth) : A3(mdgriffith$elm_ui$Element$Input$viewHorizontalThumb, factor, thumbAttributes, trackHeight))
										])))),
						mdgriffith$elm_ui$Element$none)
					])));
	});
var author$project$ImagePlugin$editView = function (model) {
	var _n0 = _Utils_Tuple3(model.aq, model.W, model.V);
	if (((!_n0.a.$) && (!_n0.b.$)) && (!_n0.c.$)) {
		var f = _n0.a.a;
		var oriW = _n0.b.a;
		var oriH = _n0.c.a;
		return A2(
			mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					mdgriffith$elm_ui$Element$spacing(15)
				]),
			_List_fromArray(
				[
					A2(
					mdgriffith$elm_ui$Element$row,
					_List_fromArray(
						[
							mdgriffith$elm_ui$Element$spacing(15)
						]),
					_List_fromArray(
						[
							A2(
							mdgriffith$elm_ui$Element$row,
							_List_fromArray(
								[
									mdgriffith$elm_ui$Element$spacing(10),
									mdgriffith$elm_ui$Element$width(
									mdgriffith$elm_ui$Element$px(500))
								]),
							_List_fromArray(
								[
									A2(
									mdgriffith$elm_ui$Element$Input$text,
									author$project$DocumentEditorHelpers$textInputStyle,
									{
										b4: A2(
											mdgriffith$elm_ui$Element$Input$labelLeft,
											_List_fromArray(
												[mdgriffith$elm_ui$Element$centerY]),
											A2(
												mdgriffith$elm_ui$Element$el,
												_List_fromArray(
													[
														mdgriffith$elm_ui$Element$width(
														mdgriffith$elm_ui$Element$px(110))
													]),
												mdgriffith$elm_ui$Element$text('Nom de fichier: '))),
										cQ: author$project$ImagePlugin$SetFilename,
										dO: elm$core$Maybe$Nothing,
										ec: A2(elm$core$Maybe$withDefault, f.ay, model.b_)
									})
								])),
							A2(
							mdgriffith$elm_ui$Element$Input$button,
							author$project$DocumentEditorHelpers$buttonStyle(true),
							{
								b4: A2(
									mdgriffith$elm_ui$Element$el,
									_List_Nil,
									mdgriffith$elm_ui$Element$html(
										author$project$Icons$rotateCcw(author$project$ImagePlugin$iconSize))),
								cf: elm$core$Maybe$Just(author$project$ImagePlugin$RotateLeft)
							}),
							A2(
							mdgriffith$elm_ui$Element$Input$button,
							author$project$DocumentEditorHelpers$buttonStyle(true),
							{
								b4: A2(
									mdgriffith$elm_ui$Element$el,
									_List_Nil,
									mdgriffith$elm_ui$Element$html(
										author$project$Icons$rotateCw(author$project$ImagePlugin$iconSize))),
								cf: elm$core$Maybe$Just(author$project$ImagePlugin$RotateRight)
							})
						])),
					A2(
					mdgriffith$elm_ui$Element$row,
					_List_fromArray(
						[
							mdgriffith$elm_ui$Element$spacing(15)
						]),
					_List_fromArray(
						[
							A2(
							mdgriffith$elm_ui$Element$row,
							_List_fromArray(
								[
									mdgriffith$elm_ui$Element$spacing(10),
									mdgriffith$elm_ui$Element$width(
									mdgriffith$elm_ui$Element$px(500))
								]),
							_List_fromArray(
								[
									A2(
									mdgriffith$elm_ui$Element$el,
									_List_fromArray(
										[
											mdgriffith$elm_ui$Element$width(
											mdgriffith$elm_ui$Element$px(110))
										]),
									mdgriffith$elm_ui$Element$text('Dimensions: ')),
									A2(
									mdgriffith$elm_ui$Element$Input$slider,
									_List_fromArray(
										[
											mdgriffith$elm_ui$Element$height(
											mdgriffith$elm_ui$Element$px(30)),
											mdgriffith$elm_ui$Element$width(
											mdgriffith$elm_ui$Element$px(250)),
											mdgriffith$elm_ui$Element$behindContent(
											A2(
												mdgriffith$elm_ui$Element$el,
												_List_fromArray(
													[
														mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill),
														mdgriffith$elm_ui$Element$height(
														mdgriffith$elm_ui$Element$px(2)),
														mdgriffith$elm_ui$Element$centerY,
														mdgriffith$elm_ui$Element$Background$color(
														A3(mdgriffith$elm_ui$Element$rgb, 0.9, 0.9, 0.9)),
														mdgriffith$elm_ui$Element$Border$rounded(2)
													]),
												mdgriffith$elm_ui$Element$none))
										]),
									{
										b4: A2(
											mdgriffith$elm_ui$Element$Input$labelLeft,
											_List_fromArray(
												[mdgriffith$elm_ui$Element$centerY]),
											mdgriffith$elm_ui$Element$none),
										gb: 100,
										ge: 0,
										cQ: author$project$ImagePlugin$Resize,
										g4: elm$core$Maybe$Just(1),
										hw: mdgriffith$elm_ui$Element$Input$defaultThumb,
										ef: model.bo
									}),
									A2(
									mdgriffith$elm_ui$Element$el,
									_List_fromArray(
										[
											mdgriffith$elm_ui$Element$width(
											mdgriffith$elm_ui$Element$px(100))
										]),
									mdgriffith$elm_ui$Element$text(
										A2(
											elm$core$Maybe$withDefault,
											elm$core$String$fromInt(oriW),
											A2(elm$core$Maybe$map, elm$core$String$fromInt, model.S)) + ('x' + A2(
											elm$core$Maybe$withDefault,
											elm$core$String$fromInt(oriH),
											A2(elm$core$Maybe$map, elm$core$String$fromInt, model.Q)))))
								])),
							A2(
							mdgriffith$elm_ui$Element$Input$button,
							author$project$DocumentEditorHelpers$buttonStyle(model.av),
							{
								b4: mdgriffith$elm_ui$Element$text('Redimensionner'),
								cf: model.av ? elm$core$Maybe$Just(author$project$ImagePlugin$SetResize) : elm$core$Maybe$Nothing
							})
						])),
					A2(
					mdgriffith$elm_ui$Element$row,
					_List_fromArray(
						[
							mdgriffith$elm_ui$Element$spacing(15)
						]),
					_List_fromArray(
						[
							A2(
							mdgriffith$elm_ui$Element$row,
							_List_fromArray(
								[
									mdgriffith$elm_ui$Element$spacing(5)
								]),
							_List_fromArray(
								[
									A2(
									mdgriffith$elm_ui$Element$el,
									_List_Nil,
									mdgriffith$elm_ui$Element$text('Taille originale: ')),
									A2(
									mdgriffith$elm_ui$Element$el,
									_List_Nil,
									mdgriffith$elm_ui$Element$text(
										A2(
											elm$core$Maybe$withDefault,
											'0 kb',
											A2(
												elm$core$Maybe$map,
												function (s) {
													return s + ' kb';
												},
												A2(elm$core$Maybe$map, elm$core$String$fromInt, model.bh)))))
								])),
							A2(
							mdgriffith$elm_ui$Element$row,
							_List_fromArray(
								[
									mdgriffith$elm_ui$Element$spacing(5)
								]),
							_List_fromArray(
								[
									A2(
									mdgriffith$elm_ui$Element$el,
									_List_Nil,
									mdgriffith$elm_ui$Element$text('Taille actuelle: ')),
									A2(
									mdgriffith$elm_ui$Element$el,
									_List_Nil,
									mdgriffith$elm_ui$Element$text(
										A2(
											elm$core$Maybe$withDefault,
											'0 kb',
											A2(
												elm$core$Maybe$map,
												function (s) {
													return s + ' kb';
												},
												A2(
													elm$core$Maybe$map,
													elm$core$String$fromInt,
													A2(
														elm$core$Maybe$map,
														function ($) {
															return $.aV;
														},
														model.aq))))))
								]))
						])),
					A2(
					mdgriffith$elm_ui$Element$row,
					_List_fromArray(
						[
							mdgriffith$elm_ui$Element$spacing(15)
						]),
					_List_fromArray(
						[
							A2(
							mdgriffith$elm_ui$Element$Input$button,
							author$project$DocumentEditorHelpers$buttonStyle(true),
							{
								b4: mdgriffith$elm_ui$Element$text('Nouveau fichier'),
								cf: elm$core$Maybe$Just(author$project$ImagePlugin$ResetImageController)
							}),
							A2(
							mdgriffith$elm_ui$Element$Input$button,
							author$project$DocumentEditorHelpers$buttonStyle(true),
							{
								b4: mdgriffith$elm_ui$Element$text('Retour'),
								cf: elm$core$Maybe$Just(
									author$project$ImagePlugin$ChangeMode(author$project$ImagePlugin$ImagePicker))
							}),
							A2(
							mdgriffith$elm_ui$Element$Input$button,
							author$project$DocumentEditorHelpers$buttonStyle(true),
							{
								b4: mdgriffith$elm_ui$Element$text('Valider'),
								cf: elm$core$Maybe$Just(author$project$ImagePlugin$ConfirmNewImage)
							})
						])),
					mdgriffith$elm_ui$Element$text('Aperçu: '),
					A2(
					mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							mdgriffith$elm_ui$Element$width(
							A2(mdgriffith$elm_ui$Element$maximum, 650, mdgriffith$elm_ui$Element$fill)),
							mdgriffith$elm_ui$Element$height(
							A2(mdgriffith$elm_ui$Element$maximum, 550, mdgriffith$elm_ui$Element$fill)),
							mdgriffith$elm_ui$Element$scrollbars
						]),
					A2(
						mdgriffith$elm_ui$Element$image,
						_List_fromArray(
							[mdgriffith$elm_ui$Element$centerY, mdgriffith$elm_ui$Element$centerX]),
						{db: f.ay, d9: f.aT}))
				]));
	} else {
		return mdgriffith$elm_ui$Element$text('no file data');
	}
};
var author$project$ImagePlugin$fileReaderView = function (model) {
	return A2(
		mdgriffith$elm_ui$Element$column,
		_List_fromArray(
			[
				mdgriffith$elm_ui$Element$spacing(15)
			]),
		_List_fromArray(
			[
				A2(
				mdgriffith$elm_ui$Element$row,
				_List_fromArray(
					[
						mdgriffith$elm_ui$Element$spacing(15)
					]),
				_List_fromArray(
					[
						A2(
						mdgriffith$elm_ui$Element$el,
						_List_Nil,
						mdgriffith$elm_ui$Element$text('Charger une image depuis votre PC: '))
					]))
			]));
};
var elm$html$Html$input = _VirtualDom_node('input');
var elm$html$Html$node = elm$virtual_dom$VirtualDom$node;
var author$project$ImagePlugin$imageController = function (attributes) {
	return A2(
		mdgriffith$elm_ui$Element$el,
		_List_Nil,
		mdgriffith$elm_ui$Element$html(
			A3(
				elm$html$Html$node,
				'image-controller',
				attributes,
				_List_fromArray(
					[
						A2(
						elm$html$Html$input,
						_List_fromArray(
							[
								elm$html$Html$Attributes$type_('file')
							]),
						_List_Nil)
					]))));
};
var elm$html$Html$Attributes$hidden = elm$html$Html$Attributes$boolProperty('hidden');
var elm$virtual_dom$VirtualDom$property = F2(
	function (key, value) {
		return A2(
			_VirtualDom_property,
			_VirtualDom_noInnerHtmlOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var elm$html$Html$Attributes$property = elm$virtual_dom$VirtualDom$property;
var author$project$ImagePlugin$imageControllerView = F2(
	function (model, imgContMode) {
		return A2(
			mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					mdgriffith$elm_ui$Element$spacing(15),
					mdgriffith$elm_ui$Element$Font$size(16),
					mdgriffith$elm_ui$Element$padding(15),
					mdgriffith$elm_ui$Element$alignTop
				]),
			_List_fromArray(
				[
					function () {
					if (!imgContMode) {
						return author$project$ImagePlugin$fileReaderView(model);
					} else {
						return author$project$ImagePlugin$editView(model);
					}
				}(),
					author$project$ImagePlugin$imageController(
					_Utils_ap(
						_List_fromArray(
							[
								A2(elm$html$Html$Attributes$style, 'id', model.c),
								A2(
								elm$html$Html$Events$on,
								'fileRead',
								author$project$ImagePlugin$decodeImageData(author$project$ImagePlugin$FileRead)),
								A2(
								elm$html$Html$Events$on,
								'imageRead',
								author$project$ImagePlugin$decodeImageData(author$project$ImagePlugin$ImageRead)),
								imgContMode ? elm$html$Html$Attributes$hidden(true) : author$project$DocumentEditorHelpers$noHtmlAttr,
								model.aF ? A2(
								elm$html$Html$Attributes$property,
								'rotationAngle',
								elm$json$Json$Encode$int(model.R)) : author$project$DocumentEditorHelpers$noHtmlAttr
							]),
						model.aE ? _List_fromArray(
							[
								A2(
								elm$core$Maybe$withDefault,
								author$project$DocumentEditorHelpers$noHtmlAttr,
								A2(
									elm$core$Maybe$map,
									function (val) {
										return A2(elm$html$Html$Attributes$property, 'desiredSize', val);
									},
									A2(
										elm$core$Maybe$map,
										function (h) {
											return elm$json$Json$Encode$int(h);
										},
										((model.R === 90) || (model.R === 270)) ? model.S : model.Q)))
							]) : _List_Nil)),
					function () {
					if (!imgContMode) {
						return A2(
							mdgriffith$elm_ui$Element$Input$button,
							author$project$DocumentEditorHelpers$buttonStyle(true),
							{
								b4: mdgriffith$elm_ui$Element$text('Retour'),
								cf: elm$core$Maybe$Just(
									author$project$ImagePlugin$ChangeMode(author$project$ImagePlugin$ImageAttributeEditor))
							});
					} else {
						return mdgriffith$elm_ui$Element$none;
					}
				}()
				]));
	});
var author$project$DocumentEditorHelpers$noAttr = mdgriffith$elm_ui$Element$htmlAttribute(
	elm$html$Html$Attributes$class(''));
var author$project$DummyFileSys$dummyImageList = _List_fromArray(
	[
		_Utils_Tuple2(
		'2 Murol, le bourg.jpg',
		_Utils_Tuple2(300, 300)),
		_Utils_Tuple2(
		'automne_bg2.jpg',
		_Utils_Tuple2(1920, 1080)),
		_Utils_Tuple2(
		'automne_bg.jpg',
		_Utils_Tuple2(1920, 1080)),
		_Utils_Tuple2(
		'banner_automne_1149.jpg',
		_Utils_Tuple2(1149, 200)),
		_Utils_Tuple2(
		'banner_automne_1567.jpg',
		_Utils_Tuple2(1567, 350)),
		_Utils_Tuple2(
		'bannerbgf.jpg',
		_Utils_Tuple2(1000, 410)),
		_Utils_Tuple2(
		'bannerbg.jpg',
		_Utils_Tuple2(1000, 400)),
		_Utils_Tuple2(
		'banner.jpg',
		_Utils_Tuple2(1000, 400)),
		_Utils_Tuple2(
		'bannerS.jpg',
		_Utils_Tuple2(1000, 410)),
		_Utils_Tuple2(
		'banner_winter_1149.jpg',
		_Utils_Tuple2(1149, 200)),
		_Utils_Tuple2(
		'banner_winter_1567.jpg',
		_Utils_Tuple2(1567, 200)),
		_Utils_Tuple2(
		'banner_winter2_1149.jpg',
		_Utils_Tuple2(1149, 200)),
		_Utils_Tuple2(
		'banner_winter2_1567.jpg',
		_Utils_Tuple2(1567, 200)),
		_Utils_Tuple2(
		'bgblue.jpg',
		_Utils_Tuple2(500, 300)),
		_Utils_Tuple2(
		'bourg2.jpg',
		_Utils_Tuple2(377, 250)),
		_Utils_Tuple2(
		'bourgHiver.jpg',
		_Utils_Tuple2(333, 250)),
		_Utils_Tuple2(
		'bourg.jpg',
		_Utils_Tuple2(333, 250)),
		_Utils_Tuple2(
		'calendVac.jpg',
		_Utils_Tuple2(370, 505)),
		_Utils_Tuple2(
		'carteZones.jpg',
		_Utils_Tuple2(370, 506)),
		_Utils_Tuple2(
		'Cézallier-Neige-2.jpg',
		_Utils_Tuple2(600, 400)),
		_Utils_Tuple2(
		'chassagne1.jpg',
		_Utils_Tuple2(292, 219)),
		_Utils_Tuple2(
		'chassagne2.jpg',
		_Utils_Tuple2(331, 219)),
		_Utils_Tuple2(
		'chassagne3.jpg',
		_Utils_Tuple2(332, 219)),
		_Utils_Tuple2(
		'chassagne.jpg',
		_Utils_Tuple2(400, 246)),
		_Utils_Tuple2(
		'chateau1.jpg',
		_Utils_Tuple2(375, 500)),
		_Utils_Tuple2(
		'Cloth.jpg',
		_Utils_Tuple2(300, 300)),
		_Utils_Tuple2(
		'drinks.jpg',
		_Utils_Tuple2(999, 711)),
		_Utils_Tuple2(
		'famillePlus.jpg',
		_Utils_Tuple2(156, 143)),
		_Utils_Tuple2(
		'four à pain Beaune.jpg',
		_Utils_Tuple2(538, 406)),
		_Utils_Tuple2(
		'groire1.jpg',
		_Utils_Tuple2(300, 225)),
		_Utils_Tuple2(
		'groire2.jpg',
		_Utils_Tuple2(300, 225)),
		_Utils_Tuple2(
		'groire3.jpg',
		_Utils_Tuple2(300, 225)),
		_Utils_Tuple2(
		'hori2.jpg',
		_Utils_Tuple2(300, 240)),
		_Utils_Tuple2(
		'horizon3.jpg',
		_Utils_Tuple2(315, 240)),
		_Utils_Tuple2(
		'illustration animations estivales.jpg',
		_Utils_Tuple2(576, 772)),
		_Utils_Tuple2(
		'lac1.jpg',
		_Utils_Tuple2(333, 250)),
		_Utils_Tuple2(
		'lac2.jpg',
		_Utils_Tuple2(333, 250)),
		_Utils_Tuple2(
		'lac3.jpg',
		_Utils_Tuple2(377, 250)),
		_Utils_Tuple2(
		'lake.jpg',
		_Utils_Tuple2(1840, 537)),
		_Utils_Tuple2(
		'landscape1920.jpg',
		_Utils_Tuple2(1920, 530)),
		_Utils_Tuple2(
		'Logo_LABEL_FamillePlus_RVB.jpg',
		_Utils_Tuple2(200, 183)),
		_Utils_Tuple2(
		'Mairie.jpg',
		_Utils_Tuple2(450, 600)),
		_Utils_Tuple2(
		'maisonSante.jpg',
		_Utils_Tuple2(500, 258)),
		_Utils_Tuple2(
		'mapBig.jpg',
		_Utils_Tuple2(1600, 770)),
		_Utils_Tuple2(
		'mapSmall.jpg',
		_Utils_Tuple2(400, 193)),
		_Utils_Tuple2(
		'murol vue générale.jpg',
		_Utils_Tuple2(640, 459)),
		_Utils_Tuple2(
		'musée archéologique.jpg',
		_Utils_Tuple2(333, 250)),
		_Utils_Tuple2(
		'OT.jpg',
		_Utils_Tuple2(400, 300)),
		_Utils_Tuple2(
		'panoTartaret.jpg',
		_Utils_Tuple2(376, 250)),
		_Utils_Tuple2(
		'parcoursSportBig.jpg',
		_Utils_Tuple2(1187, 869)),
		_Utils_Tuple2(
		'parcoursSportSmall.jpg',
		_Utils_Tuple2(341, 250)),
		_Utils_Tuple2(
		'picLac01.jpg',
		_Utils_Tuple2(345, 210)),
		_Utils_Tuple2(
		'picLac02.jpg',
		_Utils_Tuple2(434, 210)),
		_Utils_Tuple2(
		'picLac03.jpg',
		_Utils_Tuple2(307, 210)),
		_Utils_Tuple2(
		'prélong.jpg',
		_Utils_Tuple2(333, 250)),
		_Utils_Tuple2(
		'programme2016.jpg',
		_Utils_Tuple2(800, 566)),
		_Utils_Tuple2(
		'rajat.jpg',
		_Utils_Tuple2(300, 240)),
		_Utils_Tuple2(
		'restaurants.jpg',
		_Utils_Tuple2(350, 242)),
		_Utils_Tuple2(
		'routes.jpg',
		_Utils_Tuple2(140, 175)),
		_Utils_Tuple2(
		'sancy_hiver.jpg',
		_Utils_Tuple2(125, 167)),
		_Utils_Tuple2(
		'seismes.jpg',
		_Utils_Tuple2(767, 1107)),
		_Utils_Tuple2(
		'springbanner1149.jpg',
		_Utils_Tuple2(1149, 200)),
		_Utils_Tuple2(
		'springbanner1567.jpg',
		_Utils_Tuple2(1567, 200)),
		_Utils_Tuple2(
		'springbg2017.jpg',
		_Utils_Tuple2(3215, 888)),
		_Utils_Tuple2(
		'Station_Tourisme_RVB.jpg',
		_Utils_Tuple2(100, 143)),
		_Utils_Tuple2(
		'StationVertegf.jpg',
		_Utils_Tuple2(150, 143)),
		_Utils_Tuple2(
		'tartaretBois.jpg',
		_Utils_Tuple2(166, 250)),
		_Utils_Tuple2(
		'trail.jpg',
		_Utils_Tuple2(568, 413)),
		_Utils_Tuple2(
		'Village fleuri.jpg',
		_Utils_Tuple2(356, 143)),
		_Utils_Tuple2(
		'visiteVirt.jpg',
		_Utils_Tuple2(200, 160)),
		_Utils_Tuple2(
		'voie1.jpg',
		_Utils_Tuple2(500, 375)),
		_Utils_Tuple2(
		'voie2.jpg',
		_Utils_Tuple2(501, 375)),
		_Utils_Tuple2(
		'winter_bg.jpg',
		_Utils_Tuple2(1920, 523)),
		_Utils_Tuple2(
		'wtreesbg.jpg',
		_Utils_Tuple2(1000, 500)),
		_Utils_Tuple2(
		'automne_iconbg02.gif',
		_Utils_Tuple2(169, 115)),
		_Utils_Tuple2(
		'automne_iconbg.gif',
		_Utils_Tuple2(169, 115)),
		_Utils_Tuple2(
		'FamillePlus2.gif',
		_Utils_Tuple2(100, 92)),
		_Utils_Tuple2(
		'Mairiebg.gif',
		_Utils_Tuple2(483, 600)),
		_Utils_Tuple2(
		'menubg.gif',
		_Utils_Tuple2(50, 50)),
		_Utils_Tuple2(
		'seismes.gif',
		_Utils_Tuple2(790, 1144)),
		_Utils_Tuple2(
		'winter_iconbgB.gif',
		_Utils_Tuple2(169, 115)),
		_Utils_Tuple2(
		'winter_iconbgS.gif',
		_Utils_Tuple2(169, 115)),
		_Utils_Tuple2(
		'bannerbgf.png',
		_Utils_Tuple2(1000, 500)),
		_Utils_Tuple2(
		'bgLeaf2.png',
		_Utils_Tuple2(1400, 500)),
		_Utils_Tuple2(
		'bgLeafOLD.png',
		_Utils_Tuple2(1233, 410)),
		_Utils_Tuple2(
		'bgLeaf.png',
		_Utils_Tuple2(1233, 410)),
		_Utils_Tuple2(
		'bgLeafwithflowers.png',
		_Utils_Tuple2(1400, 500)),
		_Utils_Tuple2(
		'dicrim.png',
		_Utils_Tuple2(200, 127)),
		_Utils_Tuple2(
		'famillesPlus.png',
		_Utils_Tuple2(200, 200)),
		_Utils_Tuple2(
		'fleurie.png',
		_Utils_Tuple2(1058, 793)),
		_Utils_Tuple2(
		'icon2017blur.png',
		_Utils_Tuple2(100, 100)),
		_Utils_Tuple2(
		'icon2017leaf.png',
		_Utils_Tuple2(100, 100)),
		_Utils_Tuple2(
		'icon2017L.png',
		_Utils_Tuple2(100, 100)),
		_Utils_Tuple2(
		'icon2017.png',
		_Utils_Tuple2(100, 100)),
		_Utils_Tuple2(
		'jachère fleurie.png',
		_Utils_Tuple2(962, 721)),
		_Utils_Tuple2(
		'lake.png',
		_Utils_Tuple2(1840, 537)),
		_Utils_Tuple2(
		'landscapebottomO.png',
		_Utils_Tuple2(500, 630)),
		_Utils_Tuple2(
		'landscapebottom.png',
		_Utils_Tuple2(500, 630)),
		_Utils_Tuple2(
		'logo-chateau-de-murol-800.png',
		_Utils_Tuple2(167, 96)),
		_Utils_Tuple2(
		'logosmurol.png',
		_Utils_Tuple2(496, 136)),
		_Utils_Tuple2(
		'lonelyplanet.png',
		_Utils_Tuple2(171, 95)),
		_Utils_Tuple2(
		'PAVILLON BLEU LOGO 2.png',
		_Utils_Tuple2(162, 143)),
		_Utils_Tuple2(
		'peintres.png',
		_Utils_Tuple2(167, 96)),
		_Utils_Tuple2(
		'Recycling.png',
		_Utils_Tuple2(30, 29)),
		_Utils_Tuple2(
		'snowflake1.png',
		_Utils_Tuple2(100, 100)),
		_Utils_Tuple2(
		'summertopbannerwater.png',
		_Utils_Tuple2(1400, 500)),
		_Utils_Tuple2(
		'Village fleuri.png',
		_Utils_Tuple2(356, 143))
	]);
var author$project$ImagePlugin$ConfirmSelected = {$: 3};
var author$project$ImagePlugin$SelectImage = function (a) {
	return {$: 2, a: a};
};
var author$project$ImagePlugin$entryView = F3(
	function (mbSel, msg, e) {
		var url = e.a;
		var _n0 = e.b;
		var w = _n0.a;
		var h = _n0.b;
		return A2(
			mdgriffith$elm_ui$Element$el,
			_List_fromArray(
				[
					mdgriffith$elm_ui$Element$Events$onClick(
					msg(e)),
					mdgriffith$elm_ui$Element$pointer,
					mdgriffith$elm_ui$Element$mouseOver(
					_List_fromArray(
						[
							mdgriffith$elm_ui$Element$Font$color(
							A3(mdgriffith$elm_ui$Element$rgb, 1, 1, 1)),
							mdgriffith$elm_ui$Element$Background$color(
							A3(mdgriffith$elm_ui$Element$rgb, 0.7, 0.7, 0.7))
						])),
					function () {
					if (!mbSel.$) {
						var sel = mbSel.a;
						return _Utils_eq(sel, e) ? mdgriffith$elm_ui$Element$Background$color(
							A3(mdgriffith$elm_ui$Element$rgb, 0.8, 0.8, 0.8)) : mdgriffith$elm_ui$Element$Background$color(
							A3(mdgriffith$elm_ui$Element$rgb, 1, 1, 1));
					} else {
						return mdgriffith$elm_ui$Element$Background$color(
							A3(mdgriffith$elm_ui$Element$rgb, 1, 1, 1));
					}
				}(),
					mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill),
					A2(mdgriffith$elm_ui$Element$paddingXY, 15, 5)
				]),
			mdgriffith$elm_ui$Element$text(url));
	});
var author$project$ImagePlugin$imagePickerView = F2(
	function (config, model) {
		return A2(
			mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					mdgriffith$elm_ui$Element$spacing(15),
					mdgriffith$elm_ui$Element$Font$size(16),
					mdgriffith$elm_ui$Element$padding(15),
					mdgriffith$elm_ui$Element$alignTop
				]),
			_List_fromArray(
				[
					A2(
					mdgriffith$elm_ui$Element$row,
					_List_fromArray(
						[
							mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill)
						]),
					_List_fromArray(
						[
							mdgriffith$elm_ui$Element$text('Choisir image existante: '),
							A2(
							elm$core$Maybe$withDefault,
							mdgriffith$elm_ui$Element$none,
							A2(
								elm$core$Maybe$map,
								function (_n0) {
									var url = _n0.a;
									var _n1 = _n0.b;
									var w = _n1.a;
									var h = _n1.b;
									return A2(
										mdgriffith$elm_ui$Element$el,
										_List_fromArray(
											[mdgriffith$elm_ui$Element$alignRight]),
										mdgriffith$elm_ui$Element$text(
											elm$core$String$fromInt(w) + ('x' + elm$core$String$fromInt(h))));
								},
								model.ba))
						])),
					A2(
					mdgriffith$elm_ui$Element$row,
					_List_fromArray(
						[
							mdgriffith$elm_ui$Element$spacing(15)
						]),
					_List_fromArray(
						[
							A2(
							mdgriffith$elm_ui$Element$column,
							_List_fromArray(
								[
									mdgriffith$elm_ui$Element$width(
									mdgriffith$elm_ui$Element$px(200)),
									mdgriffith$elm_ui$Element$height(
									mdgriffith$elm_ui$Element$px(300)),
									mdgriffith$elm_ui$Element$Border$width(1),
									mdgriffith$elm_ui$Element$Border$color(
									A3(mdgriffith$elm_ui$Element$rgb, 0.8, 0.8, 0.8)),
									mdgriffith$elm_ui$Element$scrollbarY,
									mdgriffith$elm_ui$Element$Background$color(
									A3(mdgriffith$elm_ui$Element$rgb, 1, 1, 1))
								]),
							A2(
								elm$core$List$map,
								A2(author$project$ImagePlugin$entryView, model.ba, author$project$ImagePlugin$SelectImage),
								author$project$DummyFileSys$dummyImageList)),
							A2(
							mdgriffith$elm_ui$Element$el,
							_List_fromArray(
								[
									mdgriffith$elm_ui$Element$width(
									mdgriffith$elm_ui$Element$px(350)),
									mdgriffith$elm_ui$Element$height(
									mdgriffith$elm_ui$Element$px(300)),
									mdgriffith$elm_ui$Element$Border$width(1),
									mdgriffith$elm_ui$Element$Border$color(
									A3(mdgriffith$elm_ui$Element$rgb, 0.8, 0.8, 0.8)),
									mdgriffith$elm_ui$Element$Background$color(
									A3(mdgriffith$elm_ui$Element$rgb, 1, 1, 1)),
									function () {
									var _n2 = model.ba;
									if (_n2.$ === 1) {
										return author$project$DocumentEditorHelpers$noAttr;
									} else {
										var _n3 = _n2.a;
										var url = _n3.a;
										var _n4 = _n3.b;
										var w = _n4.a;
										var h = _n4.b;
										return mdgriffith$elm_ui$Element$Background$uncropped('images/' + url);
									}
								}()
								]),
							mdgriffith$elm_ui$Element$none)
						])),
					A2(
					mdgriffith$elm_ui$Element$row,
					_List_fromArray(
						[
							mdgriffith$elm_ui$Element$spacing(15)
						]),
					_List_fromArray(
						[
							A2(
							mdgriffith$elm_ui$Element$Input$button,
							author$project$DocumentEditorHelpers$buttonStyle(true),
							{
								b4: mdgriffith$elm_ui$Element$text('Charger une nouvelle image'),
								cf: elm$core$Maybe$Just(
									author$project$ImagePlugin$ChangeMode(
										author$project$ImagePlugin$ImageController(0)))
							}),
							A2(
							mdgriffith$elm_ui$Element$Input$button,
							author$project$DocumentEditorHelpers$buttonStyle(true),
							{
								b4: mdgriffith$elm_ui$Element$text('Retour'),
								cf: elm$core$Maybe$Just(
									author$project$ImagePlugin$ChangeMode(author$project$ImagePlugin$ImageAttributeEditor))
							}),
							A2(
							mdgriffith$elm_ui$Element$Input$button,
							author$project$DocumentEditorHelpers$buttonStyle(true),
							{
								b4: mdgriffith$elm_ui$Element$text('Valider'),
								cf: elm$core$Maybe$Just(author$project$ImagePlugin$ConfirmSelected)
							})
						]))
				]));
	});
var mdgriffith$elm_ui$Element$map = mdgriffith$elm_ui$Internal$Model$map;
var author$project$ImagePlugin$view = F2(
	function (config, model) {
		return A2(
			mdgriffith$elm_ui$Element$map,
			model.fx,
			function () {
				var _n0 = model.ar;
				switch (_n0.$) {
					case 0:
						return A2(author$project$ImagePlugin$imageAttributeEditorView, config, model);
					case 1:
						return A2(author$project$ImagePlugin$imagePickerView, config, model);
					default:
						var imgContMode = _n0.a;
						return A2(author$project$ImagePlugin$imageControllerView, model, imgContMode);
				}
			}());
	});
var author$project$NewDocPlugin$view = function (config) {
	return A2(
		mdgriffith$elm_ui$Element$column,
		_List_fromArray(
			[
				mdgriffith$elm_ui$Element$Font$size(16),
				mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill),
				mdgriffith$elm_ui$Element$alignTop,
				mdgriffith$elm_ui$Element$spacing(20),
				mdgriffith$elm_ui$Element$padding(15)
			]),
		_List_fromArray(
			[
				A2(
				mdgriffith$elm_ui$Element$column,
				_List_fromArray(
					[
						mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill),
						mdgriffith$elm_ui$Element$spacing(15),
						mdgriffith$elm_ui$Element$Border$width(1),
						mdgriffith$elm_ui$Element$Border$color(
						A4(mdgriffith$elm_ui$Element$rgba, 0.9, 0.9, 0.9, 1)),
						mdgriffith$elm_ui$Element$padding(15)
					]),
				_List_fromArray(
					[
						A2(
						mdgriffith$elm_ui$Element$el,
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$Font$size(18)
							]),
						mdgriffith$elm_ui$Element$text('Nouveau conteneur')),
						A2(
						mdgriffith$elm_ui$Element$row,
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$spacing(15)
							]),
						_List_fromArray(
							[
								A2(
								mdgriffith$elm_ui$Element$Input$button,
								author$project$DocumentEditorHelpers$buttonStyle(true),
								{
									b4: A2(
										mdgriffith$elm_ui$Element$row,
										_List_fromArray(
											[
												mdgriffith$elm_ui$Element$spacing(10)
											]),
										_List_fromArray(
											[
												mdgriffith$elm_ui$Element$text('Créer colonne')
											])),
									cf: elm$core$Maybe$Just(
										config.fh(0))
								}),
								A2(
								mdgriffith$elm_ui$Element$Input$button,
								author$project$DocumentEditorHelpers$buttonStyle(true),
								{
									b4: A2(
										mdgriffith$elm_ui$Element$row,
										_List_fromArray(
											[
												mdgriffith$elm_ui$Element$spacing(10)
											]),
										_List_fromArray(
											[
												mdgriffith$elm_ui$Element$text('Créer ligne')
											])),
									cf: elm$core$Maybe$Just(
										config.fh(1))
								}),
								A2(
								mdgriffith$elm_ui$Element$Input$button,
								author$project$DocumentEditorHelpers$buttonStyle(true),
								{
									b4: A2(
										mdgriffith$elm_ui$Element$row,
										_List_fromArray(
											[
												mdgriffith$elm_ui$Element$spacing(10)
											]),
										_List_fromArray(
											[
												mdgriffith$elm_ui$Element$text('Créer colonne de texte')
											])),
									cf: elm$core$Maybe$Just(
										config.fh(2))
								})
							]))
					])),
				A2(
				mdgriffith$elm_ui$Element$column,
				_List_fromArray(
					[
						mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill),
						mdgriffith$elm_ui$Element$spacing(15),
						mdgriffith$elm_ui$Element$padding(15),
						mdgriffith$elm_ui$Element$Border$width(1),
						mdgriffith$elm_ui$Element$Border$color(
						A4(mdgriffith$elm_ui$Element$rgba, 0.9, 0.9, 0.9, 1))
					]),
				_List_fromArray(
					[
						A2(
						mdgriffith$elm_ui$Element$el,
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$Font$size(18)
							]),
						mdgriffith$elm_ui$Element$text('Nouvelle cellule')),
						A2(
						mdgriffith$elm_ui$Element$row,
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$spacing(15)
							]),
						_List_fromArray(
							[
								A2(
								mdgriffith$elm_ui$Element$Input$button,
								author$project$DocumentEditorHelpers$buttonStyle(true),
								{
									b4: A2(
										mdgriffith$elm_ui$Element$row,
										_List_fromArray(
											[
												mdgriffith$elm_ui$Element$spacing(10)
											]),
										_List_fromArray(
											[
												mdgriffith$elm_ui$Element$text('Créer bloc de texte')
											])),
									cf: elm$core$Maybe$Just(
										config.fg(4))
								}),
								A2(
								mdgriffith$elm_ui$Element$Input$button,
								author$project$DocumentEditorHelpers$buttonStyle(true),
								{
									b4: A2(
										mdgriffith$elm_ui$Element$row,
										_List_fromArray(
											[
												mdgriffith$elm_ui$Element$spacing(10)
											]),
										_List_fromArray(
											[
												mdgriffith$elm_ui$Element$text('Image')
											])),
									cf: elm$core$Maybe$Just(
										config.fg(0))
								}),
								A2(
								mdgriffith$elm_ui$Element$Input$button,
								author$project$DocumentEditorHelpers$buttonStyle(true),
								{
									b4: A2(
										mdgriffith$elm_ui$Element$row,
										_List_fromArray(
											[
												mdgriffith$elm_ui$Element$spacing(10)
											]),
										_List_fromArray(
											[
												mdgriffith$elm_ui$Element$text('Video')
											])),
									cf: elm$core$Maybe$Just(
										config.fg(1))
								}),
								A2(
								mdgriffith$elm_ui$Element$Input$button,
								author$project$DocumentEditorHelpers$buttonStyle(true),
								{
									b4: A2(
										mdgriffith$elm_ui$Element$row,
										_List_fromArray(
											[
												mdgriffith$elm_ui$Element$spacing(10)
											]),
										_List_fromArray(
											[
												mdgriffith$elm_ui$Element$text('Tableau')
											])),
									cf: elm$core$Maybe$Just(
										config.fg(2))
								})
							]))
					])),
				A2(
				mdgriffith$elm_ui$Element$Input$button,
				author$project$DocumentEditorHelpers$buttonStyle(true),
				{
					b4: A2(
						mdgriffith$elm_ui$Element$row,
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$spacing(10)
							]),
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$text('Retour')
							])),
					cf: elm$core$Maybe$Just(config.fH)
				})
			]));
};
var author$project$DocumentSerializer$encodeImageSize = function (_n0) {
	var imgWidth = _n0.fV;
	var imgHeight = _n0.fU;
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'imgWidth',
				elm$json$Json$Encode$int(imgWidth)),
				_Utils_Tuple2(
				'imgHeight',
				elm$json$Json$Encode$int(imgHeight))
			]));
};
var author$project$DocumentSerializer$encodeImgSource = function (imgSrc) {
	if (!imgSrc.$) {
		var s = imgSrc.a;
		return elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'UrlSrc',
					elm$json$Json$Encode$string(s))
				]));
	} else {
		var filename = imgSrc.a;
		var contents = imgSrc.b;
		return elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'Inline',
					elm$json$Json$Encode$object(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'filename',
								elm$json$Json$Encode$string(filename)),
								_Utils_Tuple2(
								'contents',
								elm$json$Json$Encode$string(contents))
							])))
				]));
	}
};
var author$project$DocumentSerializer$encodeImageMeta = function (_n0) {
	var src = _n0.d9;
	var caption = _n0.eV;
	var size = _n0.d7;
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'src',
				author$project$DocumentSerializer$encodeImgSource(src)),
				_Utils_Tuple2(
				'caption',
				A2(
					elm$core$Maybe$withDefault,
					elm$json$Json$Encode$null,
					A2(elm$core$Maybe$map, elm$json$Json$Encode$string, caption))),
				_Utils_Tuple2(
				'size',
				author$project$DocumentSerializer$encodeImageSize(size))
			]));
};
var author$project$DocumentSerializer$encodeTableMeta = function (_n0) {
	var style = _n0.g7;
	var nbrRows = _n0.gj;
	var nbrCols = _n0.gi;
	var data = _n0.fn;
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'style',
				elm$json$Json$Encode$string(style)),
				_Utils_Tuple2(
				'nbrRows',
				elm$json$Json$Encode$int(nbrRows)),
				_Utils_Tuple2(
				'nbrCols',
				elm$json$Json$Encode$int(nbrCols)),
				_Utils_Tuple2(
				'data',
				A2(
					elm$json$Json$Encode$list,
					elm$core$Basics$identity,
					A2(
						elm$core$List$map,
						elm$json$Json$Encode$list(elm$json$Json$Encode$string),
						A2(elm$core$List$map, elm$core$Array$toList, data))))
			]));
};
var elm$json$Json$Encode$float = _Json_wrap;
var author$project$DocumentSerializer$encodeDocColor = function (_n0) {
	var r = _n0.a;
	var g = _n0.b;
	var b = _n0.c;
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'DocColor',
				elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'red',
							elm$json$Json$Encode$float(r)),
							_Utils_Tuple2(
							'green',
							elm$json$Json$Encode$float(g)),
							_Utils_Tuple2(
							'blue',
							elm$json$Json$Encode$float(b))
						])))
			]));
};
var author$project$DocumentSerializer$encodeDocAttribute = function (docAttr) {
	switch (docAttr.$) {
		case 0:
			var bottom = docAttr.a.eO;
			var left = docAttr.a.f5;
			var right = docAttr.a.gK;
			var top = docAttr.a.hA;
			return elm$core$Maybe$Just(
				elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'PaddingEach',
							elm$json$Json$Encode$object(
								_List_fromArray(
									[
										_Utils_Tuple2(
										'bottom',
										elm$json$Json$Encode$int(bottom)),
										_Utils_Tuple2(
										'left',
										elm$json$Json$Encode$int(left)),
										_Utils_Tuple2(
										'right',
										elm$json$Json$Encode$int(right)),
										_Utils_Tuple2(
										'top',
										elm$json$Json$Encode$int(top))
									])))
						])));
		case 1:
			var x = docAttr.a;
			var y = docAttr.b;
			return elm$core$Maybe$Just(
				elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'SpacingXY',
							elm$json$Json$Encode$object(
								_List_fromArray(
									[
										_Utils_Tuple2(
										'X',
										elm$json$Json$Encode$int(x)),
										_Utils_Tuple2(
										'Y',
										elm$json$Json$Encode$int(y))
									])))
						])));
		case 2:
			return elm$core$Maybe$Just(
				elm$json$Json$Encode$string('AlignRight'));
		case 3:
			return elm$core$Maybe$Just(
				elm$json$Json$Encode$string('AlignLeft'));
		case 4:
			return elm$core$Maybe$Just(
				elm$json$Json$Encode$string('Pointer'));
		case 5:
			var color = docAttr.a;
			return elm$core$Maybe$Just(
				elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'BackgroundColor',
							author$project$DocumentSerializer$encodeDocColor(color))
						])));
		case 6:
			var w = docAttr.a;
			return elm$core$Maybe$Just(
				elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'Width',
							elm$json$Json$Encode$int(w))
						])));
		case 7:
			var h = docAttr.a;
			return elm$core$Maybe$Just(
				elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'Height',
							elm$json$Json$Encode$int(h))
						])));
		case 8:
			return elm$core$Maybe$Just(
				elm$json$Json$Encode$string('Border'));
		case 9:
			var s = docAttr.a;
			return elm$core$Maybe$Just(
				elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'Font',
							elm$json$Json$Encode$string(s))
						])));
		case 10:
			var color = docAttr.a;
			return elm$core$Maybe$Just(
				elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'FontColor',
							author$project$DocumentSerializer$encodeDocColor(color))
						])));
		case 11:
			var s = docAttr.a;
			return elm$core$Maybe$Just(
				elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'FontSize',
							elm$json$Json$Encode$int(s))
						])));
		case 12:
			return elm$core$Maybe$Just(
				elm$json$Json$Encode$string('FontAlignLeft'));
		case 13:
			return elm$core$Maybe$Just(
				elm$json$Json$Encode$string('FontAlignRight'));
		case 14:
			return elm$core$Maybe$Just(
				elm$json$Json$Encode$string('Center'));
		case 15:
			return elm$core$Maybe$Just(
				elm$json$Json$Encode$string('Justify'));
		case 16:
			return elm$core$Maybe$Just(
				elm$json$Json$Encode$string('Bold'));
		case 17:
			return elm$core$Maybe$Just(
				elm$json$Json$Encode$string('Italic'));
		default:
			return elm$core$Maybe$Nothing;
	}
};
var author$project$DocumentSerializer$encodeDocAttributes = function (attrs) {
	return A2(
		elm$json$Json$Encode$list,
		elm$core$Basics$identity,
		A2(elm$core$List$filterMap, author$project$DocumentSerializer$encodeDocAttribute, attrs));
};
var author$project$DocumentSerializer$encodeLinkMeta = function (_n0) {
	var targetBlank = _n0.hf;
	var url = _n0.hG;
	var label = _n0.b4;
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'targetBlank',
				elm$json$Json$Encode$bool(targetBlank)),
				_Utils_Tuple2(
				'url',
				elm$json$Json$Encode$string(url)),
				_Utils_Tuple2(
				'label',
				elm$json$Json$Encode$string(label))
			]));
};
var author$project$DocumentSerializer$encodeTextBlockPrimitive = function (tbPrim) {
	if (!tbPrim.$) {
		var attrs = tbPrim.a;
		var s = tbPrim.b;
		return elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'Text',
					elm$json$Json$Encode$object(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'attrs',
								author$project$DocumentSerializer$encodeDocAttributes(attrs)),
								_Utils_Tuple2(
								'value',
								elm$json$Json$Encode$string(s))
							])))
				]));
	} else {
		var attrs = tbPrim.a;
		var lm = tbPrim.b;
		return elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'Link',
					elm$json$Json$Encode$object(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'attrs',
								author$project$DocumentSerializer$encodeDocAttributes(attrs)),
								_Utils_Tuple2(
								'linkMeta',
								author$project$DocumentSerializer$encodeLinkMeta(lm))
							])))
				]));
	}
};
var author$project$DocumentSerializer$encodeTextBlockElement = function (tbElem) {
	switch (tbElem.$) {
		case 0:
			var attrs = tbElem.a;
			var prims = tbElem.b;
			return elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'Paragraph',
						elm$json$Json$Encode$object(
							_List_fromArray(
								[
									_Utils_Tuple2(
									'attrs',
									author$project$DocumentSerializer$encodeDocAttributes(attrs)),
									_Utils_Tuple2(
									'prims',
									A2(elm$json$Json$Encode$list, author$project$DocumentSerializer$encodeTextBlockPrimitive, prims))
								])))
					]));
		case 1:
			var attrs = tbElem.a;
			var liList = tbElem.b;
			return elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'UList',
						elm$json$Json$Encode$object(
							_List_fromArray(
								[
									_Utils_Tuple2(
									'attrs',
									author$project$DocumentSerializer$encodeDocAttributes(attrs)),
									_Utils_Tuple2(
									'liList',
									A2(
										elm$json$Json$Encode$list,
										function (li) {
											return elm$json$Json$Encode$object(
												_List_fromArray(
													[
														_Utils_Tuple2('li', li)
													]));
										},
										A2(
											elm$core$List$map,
											elm$json$Json$Encode$list(author$project$DocumentSerializer$encodeTextBlockPrimitive),
											liList)))
								])))
					]));
		case 2:
			var attrs = tbElem.a;
			var _n1 = tbElem.b;
			var level = _n1.a;
			var s = _n1.b;
			return elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'Heading',
						elm$json$Json$Encode$object(
							_List_fromArray(
								[
									_Utils_Tuple2(
									'attrs',
									author$project$DocumentSerializer$encodeDocAttributes(attrs)),
									_Utils_Tuple2(
									'level',
									elm$json$Json$Encode$int(level)),
									_Utils_Tuple2(
									'value',
									elm$json$Json$Encode$string(s))
								])))
					]));
		default:
			var prim = tbElem.a;
			return elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'TBPrimitive',
						author$project$DocumentSerializer$encodeTextBlockPrimitive(prim))
					]));
	}
};
var author$project$DocumentSerializer$encodeVideoHost = function (host) {
	return elm$json$Json$Encode$string('Youtube');
};
var author$project$DocumentSerializer$encodeVideoSize = function (_n0) {
	var videoWidth = _n0.hI;
	var videoHeight = _n0.hH;
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'videoWidth',
				elm$json$Json$Encode$int(videoWidth)),
				_Utils_Tuple2(
				'videoHeight',
				elm$json$Json$Encode$int(videoHeight))
			]));
};
var author$project$DocumentSerializer$encodeVideoMeta = function (_n0) {
	var src = _n0.d9;
	var size = _n0.d7;
	var frameBorder = _n0.fE;
	var suggestions = _n0.hc;
	var controls = _n0.ff;
	var privacy = _n0.gF;
	var title = _n0.hz;
	var startAt = _n0.g2;
	var hosting = _n0.fN;
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'src',
				elm$json$Json$Encode$string(src)),
				_Utils_Tuple2(
				'size',
				author$project$DocumentSerializer$encodeVideoSize(size)),
				_Utils_Tuple2(
				'frameBorder',
				elm$json$Json$Encode$bool(frameBorder)),
				_Utils_Tuple2(
				'suggestions',
				elm$json$Json$Encode$bool(suggestions)),
				_Utils_Tuple2(
				'controls',
				elm$json$Json$Encode$bool(controls)),
				_Utils_Tuple2(
				'privacy',
				elm$json$Json$Encode$bool(privacy)),
				_Utils_Tuple2(
				'title',
				elm$json$Json$Encode$bool(title)),
				_Utils_Tuple2(
				'startAt',
				A2(
					elm$core$Maybe$withDefault,
					elm$json$Json$Encode$null,
					A2(elm$core$Maybe$map, elm$json$Json$Encode$int, startAt))),
				_Utils_Tuple2(
				'hosting',
				author$project$DocumentSerializer$encodeVideoHost(hosting))
			]));
};
var author$project$DocumentSerializer$encodeCellContent = function (cellContent) {
	switch (cellContent.$) {
		case 0:
			var im = cellContent.a;
			return elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'Image',
						author$project$DocumentSerializer$encodeImageMeta(im))
					]));
		case 1:
			var vm = cellContent.a;
			return elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'Video',
						author$project$DocumentSerializer$encodeVideoMeta(vm))
					]));
		case 2:
			var tm = cellContent.a;
			return elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'Table',
						author$project$DocumentSerializer$encodeTableMeta(tm))
					]));
		case 3:
			var s = cellContent.a;
			return elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'CustomElement',
						elm$json$Json$Encode$string(s))
					]));
		case 4:
			var tbElems = cellContent.a;
			return elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'TextBlock',
						A2(elm$json$Json$Encode$list, author$project$DocumentSerializer$encodeTextBlockElement, tbElems))
					]));
		default:
			return elm$json$Json$Encode$string('EmptyCell');
	}
};
var elm$core$Set$foldl = F3(
	function (func, initialState, _n0) {
		var dict = _n0;
		return A3(
			elm$core$Dict$foldl,
			F3(
				function (key, _n1, state) {
					return A2(func, key, state);
				}),
			initialState,
			dict);
	});
var elm$json$Json$Encode$set = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				elm$core$Set$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
var author$project$DocumentSerializer$encodeId = function (_n0) {
	var uid = _n0.bc;
	var docStyleId = _n0.al;
	var htmlId = _n0.ao;
	var classes = _n0.aj;
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'uid',
				elm$json$Json$Encode$int(uid)),
				_Utils_Tuple2(
				'docStyleId',
				A2(
					elm$core$Maybe$withDefault,
					elm$json$Json$Encode$null,
					A2(elm$core$Maybe$map, elm$json$Json$Encode$string, docStyleId))),
				_Utils_Tuple2(
				'htmlId',
				A2(
					elm$core$Maybe$withDefault,
					elm$json$Json$Encode$null,
					A2(elm$core$Maybe$map, elm$json$Json$Encode$string, htmlId))),
				_Utils_Tuple2(
				'classes',
				A2(elm$json$Json$Encode$set, elm$json$Json$Encode$string, classes))
			]));
};
var author$project$DocumentSerializer$encodeCellValue = function (_n0) {
	var cellContent = _n0.aa;
	var id = _n0.c;
	var attrs = _n0.p;
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'cellContent',
				author$project$DocumentSerializer$encodeCellContent(cellContent)),
				_Utils_Tuple2(
				'id',
				author$project$DocumentSerializer$encodeId(id)),
				_Utils_Tuple2(
				'attrs',
				author$project$DocumentSerializer$encodeDocAttributes(attrs))
			]));
};
var author$project$DocumentSerializer$encodeContainerLabel = function (cLabel) {
	switch (cLabel) {
		case 0:
			return elm$json$Json$Encode$string('DocColumn');
		case 1:
			return elm$json$Json$Encode$string('DocRow');
		case 2:
			return elm$json$Json$Encode$string('TextColumn');
		default:
			return elm$json$Json$Encode$string('ResponsiveBloc');
	}
};
var author$project$DocumentSerializer$encodeContainerValue = function (_n0) {
	var containerLabel = _n0.ak;
	var id = _n0.c;
	var attrs = _n0.p;
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'containerLabel',
				author$project$DocumentSerializer$encodeContainerLabel(containerLabel)),
				_Utils_Tuple2(
				'id',
				author$project$DocumentSerializer$encodeId(id)),
				_Utils_Tuple2(
				'attrs',
				author$project$DocumentSerializer$encodeDocAttributes(attrs))
			]));
};
var author$project$DocumentSerializer$encodeDocument = function (doc) {
	if (!doc.$) {
		var cv = doc.a;
		var docs = doc.b;
		return elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'Container',
					elm$json$Json$Encode$object(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'ContainerValue',
								author$project$DocumentSerializer$encodeContainerValue(cv)),
								_Utils_Tuple2(
								'children',
								A2(elm$json$Json$Encode$list, author$project$DocumentSerializer$encodeDocument, docs))
							])))
				]));
	} else {
		var cv = doc.a;
		return elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'Cell',
					author$project$DocumentSerializer$encodeCellValue(cv))
				]));
	}
};
var author$project$PersistencePlugin$buttonStyle = _List_fromArray(
	[
		mdgriffith$elm_ui$Element$Border$rounded(5),
		mdgriffith$elm_ui$Element$Font$center,
		mdgriffith$elm_ui$Element$centerY,
		A2(mdgriffith$elm_ui$Element$paddingXY, 5, 3),
		mdgriffith$elm_ui$Element$Background$color(
		A3(mdgriffith$elm_ui$Element$rgb, 0.9, 0.9, 0.9)),
		mdgriffith$elm_ui$Element$mouseOver(
		_List_fromArray(
			[
				mdgriffith$elm_ui$Element$Background$color(
				A3(mdgriffith$elm_ui$Element$rgb, 0.95, 0.95, 0.95))
			]))
	]);
var mdgriffith$elm_ui$Element$Input$TextArea = {$: 1};
var mdgriffith$elm_ui$Element$Input$multiline = F2(
	function (attrs, multi) {
		return A3(
			mdgriffith$elm_ui$Element$Input$textHelper,
			{O: elm$core$Maybe$Nothing, Z: multi.g1, ai: mdgriffith$elm_ui$Element$Input$TextArea},
			attrs,
			{b4: multi.b4, cQ: multi.cQ, dO: multi.dO, ec: multi.ec});
	});
var mdgriffith$elm_ui$Element$Keyed$el = F2(
	function (attrs, child) {
		return A4(
			mdgriffith$elm_ui$Internal$Model$element,
			mdgriffith$elm_ui$Internal$Model$asEl,
			mdgriffith$elm_ui$Internal$Model$div,
			A2(
				elm$core$List$cons,
				mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$shrink),
				A2(
					elm$core$List$cons,
					mdgriffith$elm_ui$Element$height(mdgriffith$elm_ui$Element$shrink),
					attrs)),
			mdgriffith$elm_ui$Internal$Model$Keyed(
				_List_fromArray(
					[child])));
	});
var author$project$PersistencePlugin$view = function (config) {
	return A2(
		mdgriffith$elm_ui$Element$column,
		_List_fromArray(
			[
				mdgriffith$elm_ui$Element$spacing(15),
				mdgriffith$elm_ui$Element$padding(15),
				mdgriffith$elm_ui$Element$Font$size(16)
			]),
		_List_fromArray(
			[
				A2(
				mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[
						mdgriffith$elm_ui$Element$Font$bold,
						mdgriffith$elm_ui$Element$Font$size(18)
					]),
				mdgriffith$elm_ui$Element$text('Persistence dans le cache du navigateur')),
				A2(
				mdgriffith$elm_ui$Element$column,
				_List_fromArray(
					[
						mdgriffith$elm_ui$Element$spacing(15),
						mdgriffith$elm_ui$Element$Background$color(
						A3(mdgriffith$elm_ui$Element$rgb, 0.95, 0.95, 0.95)),
						mdgriffith$elm_ui$Element$padding(10),
						mdgriffith$elm_ui$Element$width(
						mdgriffith$elm_ui$Element$px(500))
					]),
				_List_fromArray(
					[
						mdgriffith$elm_ui$Element$text('Fichiers disponibles:'),
						A2(
						mdgriffith$elm_ui$Element$column,
						_List_fromArray(
							[
								A2(mdgriffith$elm_ui$Element$spacingXY, 15, 0),
								mdgriffith$elm_ui$Element$Background$color(
								A3(mdgriffith$elm_ui$Element$rgb, 1, 1, 1)),
								mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill),
								mdgriffith$elm_ui$Element$height(
								mdgriffith$elm_ui$Element$px(150)),
								mdgriffith$elm_ui$Element$scrollbars
							]),
						A2(
							elm$core$List$map,
							function (f) {
								return A2(
									mdgriffith$elm_ui$Element$el,
									_Utils_ap(
										_List_fromArray(
											[
												mdgriffith$elm_ui$Element$Events$onClick(
												config.gU(f)),
												mdgriffith$elm_ui$Element$pointer,
												A2(mdgriffith$elm_ui$Element$paddingXY, 5, 3)
											]),
										_Utils_eq(f, config.ap) ? _List_fromArray(
											[
												mdgriffith$elm_ui$Element$Background$color(
												A4(mdgriffith$elm_ui$Element$rgba, 0.3, 0, 1, 0.3))
											]) : _List_Nil),
									mdgriffith$elm_ui$Element$text(f));
							},
							config.by)),
						A2(
						mdgriffith$elm_ui$Element$row,
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$spacing(15)
							]),
						_List_fromArray(
							[
								A2(
								mdgriffith$elm_ui$Element$Input$button,
								author$project$PersistencePlugin$buttonStyle,
								{
									b4: A2(
										mdgriffith$elm_ui$Element$row,
										_List_fromArray(
											[
												mdgriffith$elm_ui$Element$spacing(10)
											]),
										_List_fromArray(
											[
												mdgriffith$elm_ui$Element$text('Effacer fichier')
											])),
									cf: elm$core$Maybe$Just(config.gH)
								}),
								A2(
								mdgriffith$elm_ui$Element$Input$button,
								author$project$PersistencePlugin$buttonStyle,
								{
									b4: A2(
										mdgriffith$elm_ui$Element$row,
										_List_fromArray(
											[
												mdgriffith$elm_ui$Element$spacing(10)
											]),
										_List_fromArray(
											[
												mdgriffith$elm_ui$Element$text('Vider cache')
											])),
									cf: elm$core$Maybe$Just(config.e_)
								})
							])),
						A2(
						mdgriffith$elm_ui$Element$row,
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$spacing(15)
							]),
						_List_fromArray(
							[
								A2(
								mdgriffith$elm_ui$Element$Input$button,
								author$project$PersistencePlugin$buttonStyle,
								{
									b4: A2(
										mdgriffith$elm_ui$Element$row,
										_List_fromArray(
											[
												mdgriffith$elm_ui$Element$spacing(10)
											]),
										_List_fromArray(
											[
												mdgriffith$elm_ui$Element$text('Charger fichier')
											])),
									cf: elm$core$Maybe$Just(config.fG)
								}),
								A2(
								mdgriffith$elm_ui$Element$Input$button,
								author$project$PersistencePlugin$buttonStyle,
								{
									b4: A2(
										mdgriffith$elm_ui$Element$row,
										_List_fromArray(
											[
												mdgriffith$elm_ui$Element$spacing(10)
											]),
										_List_fromArray(
											[
												mdgriffith$elm_ui$Element$text('Conversion Json -> Document')
											])),
									cf: elm$core$Maybe$Just(config.f7)
								})
							]))
					])),
				A2(
				mdgriffith$elm_ui$Element$row,
				_List_fromArray(
					[
						mdgriffith$elm_ui$Element$spacing(15)
					]),
				_List_fromArray(
					[
						A2(
						mdgriffith$elm_ui$Element$el,
						_List_Nil,
						mdgriffith$elm_ui$Element$text('Prévisualisation Json: '))
					])),
				A2(
				mdgriffith$elm_ui$Element$column,
				_List_fromArray(
					[
						mdgriffith$elm_ui$Element$spacing(15)
					]),
				_List_fromArray(
					[
						A2(
						mdgriffith$elm_ui$Element$Keyed$el,
						_List_Nil,
						_Utils_Tuple2(
							config.aZ,
							A2(
								mdgriffith$elm_ui$Element$Input$multiline,
								_List_fromArray(
									[
										mdgriffith$elm_ui$Element$width(
										mdgriffith$elm_ui$Element$px(500)),
										mdgriffith$elm_ui$Element$height(
										mdgriffith$elm_ui$Element$px(350)),
										mdgriffith$elm_ui$Element$scrollbars,
										mdgriffith$elm_ui$Element$htmlAttribute(
										A2(elm$html$Html$Attributes$style, 'background-color', 'Beige')),
										mdgriffith$elm_ui$Element$Font$size(14),
										mdgriffith$elm_ui$Element$padding(10)
									]),
								{
									b4: A2(mdgriffith$elm_ui$Element$Input$labelLeft, _List_Nil, mdgriffith$elm_ui$Element$none),
									cQ: config.gT,
									dO: elm$core$Maybe$Nothing,
									g1: false,
									ec: config.aZ
								}))),
						A2(
						mdgriffith$elm_ui$Element$row,
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$spacing(15)
							]),
						_List_fromArray(
							[
								A2(
								mdgriffith$elm_ui$Element$Input$text,
								_List_fromArray(
									[
										mdgriffith$elm_ui$Element$width(
										mdgriffith$elm_ui$Element$px(150)),
										mdgriffith$elm_ui$Element$spacing(5),
										A2(mdgriffith$elm_ui$Element$paddingXY, 15, 5),
										mdgriffith$elm_ui$Element$focused(
										_List_fromArray(
											[
												A2(
												mdgriffith$elm_ui$Element$Border$glow,
												A3(mdgriffith$elm_ui$Element$rgb, 1, 1, 1),
												0)
											])),
										mdgriffith$elm_ui$Element$Font$family(
										_List_fromArray(
											[mdgriffith$elm_ui$Element$Font$monospace]))
									]),
								{
									b4: A2(
										mdgriffith$elm_ui$Element$Input$labelLeft,
										_List_fromArray(
											[mdgriffith$elm_ui$Element$centerY, mdgriffith$elm_ui$Element$Font$bold]),
										mdgriffith$elm_ui$Element$text('Nom du fichier: ')),
									cQ: config.gU,
									dO: elm$core$Maybe$Nothing,
									ec: config.ap
								}),
								A2(
								mdgriffith$elm_ui$Element$Input$button,
								author$project$PersistencePlugin$buttonStyle,
								{
									b4: A2(
										mdgriffith$elm_ui$Element$row,
										_List_fromArray(
											[
												mdgriffith$elm_ui$Element$spacing(10)
											]),
										_List_fromArray(
											[
												mdgriffith$elm_ui$Element$text('Conversion Document -> Json')
											])),
									cf: elm$core$Maybe$Just(
										config.gV(
											author$project$DocumentSerializer$encodeDocument(config.a)))
								}),
								A2(
								mdgriffith$elm_ui$Element$Input$button,
								author$project$PersistencePlugin$buttonStyle,
								{
									b4: A2(
										mdgriffith$elm_ui$Element$row,
										_List_fromArray(
											[
												mdgriffith$elm_ui$Element$spacing(10)
											]),
										_List_fromArray(
											[
												mdgriffith$elm_ui$Element$text('Sauvegarder')
											])),
									cf: elm$core$Maybe$Just(config.gG)
								})
							]))
					])),
				A2(
				mdgriffith$elm_ui$Element$Input$button,
				author$project$PersistencePlugin$buttonStyle,
				{
					b4: A2(
						mdgriffith$elm_ui$Element$row,
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$spacing(10)
							]),
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$text('Retour')
							])),
					cf: elm$core$Maybe$Just(
						config.gS(elm$core$Maybe$Nothing))
				})
			]));
};
var author$project$TablePlugin$StyleSelectorClickOff = {$: 4};
var author$project$TablePlugin$SwapDisplayMode = {$: 11};
var author$project$TablePlugin$displayOnlyView = function (model) {
	var interfaceView = A2(
		mdgriffith$elm_ui$Element$column,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				mdgriffith$elm_ui$Element$row,
				_List_fromArray(
					[
						mdgriffith$elm_ui$Element$spacing(15)
					]),
				_List_fromArray(
					[
						A2(
						mdgriffith$elm_ui$Element$Input$button,
						author$project$DocumentEditorHelpers$buttonStyle(true),
						{
							b4: mdgriffith$elm_ui$Element$text('Modifier'),
							cf: elm$core$Maybe$Just(author$project$TablePlugin$SwapDisplayMode)
						})
					]))
			]));
	var dataForTable = elm$core$Array$toList(model.fn);
	var columns = A2(
		elm$core$List$map,
		function (ci) {
			return {
				fJ: mdgriffith$elm_ui$Element$none,
				hJ: F2(
					function (ri, row) {
						return A2(
							mdgriffith$elm_ui$Element$el,
							function (s) {
								return A2(
									elm$core$List$cons,
									mdgriffith$elm_ui$Element$height(mdgriffith$elm_ui$Element$fill),
									s);
							}(
								A2(
									elm$core$Maybe$withDefault,
									_List_Nil,
									A2(
										elm$core$Maybe$map,
										function ($) {
											return $.fa;
										},
										A2(elm$core$Dict$get, model.E, author$project$StyleSheets$tableStyles)))),
							A2(
								mdgriffith$elm_ui$Element$el,
								_Utils_ap(
									A2(
										elm$core$Maybe$withDefault,
										function (_n0) {
											return _List_Nil;
										},
										A2(
											elm$core$Maybe$map,
											function ($) {
												return $.eX;
											},
											A2(elm$core$Dict$get, model.E, author$project$StyleSheets$tableStyles)))(ri),
									_List_fromArray(
										[
											A2(mdgriffith$elm_ui$Element$paddingXY, 15, 5),
											mdgriffith$elm_ui$Element$height(
											A2(mdgriffith$elm_ui$Element$minimum, 30, mdgriffith$elm_ui$Element$fill))
										])),
								mdgriffith$elm_ui$Element$text(
									A2(
										elm$core$Maybe$withDefault,
										'',
										A2(elm$core$Array$get, ci, row)))));
					}),
				hL: mdgriffith$elm_ui$Element$fill
			};
		},
		A2(elm$core$List$range, 0, model.gi - 1));
	var tableView = model.aI ? A2(
		mdgriffith$elm_ui$Element$indexedTable,
		A2(
			elm$core$Maybe$withDefault,
			_List_Nil,
			A2(
				elm$core$Maybe$map,
				function ($) {
					return $.hd;
				},
				A2(elm$core$Dict$get, model.E, author$project$StyleSheets$tableStyles))),
		{e6: columns, fn: dataForTable}) : mdgriffith$elm_ui$Element$none;
	return A2(
		mdgriffith$elm_ui$Element$column,
		_List_fromArray(
			[
				mdgriffith$elm_ui$Element$spacing(15),
				mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill)
			]),
		_List_fromArray(
			[interfaceView, tableView]));
};
var author$project$TablePlugin$AddNew = function (a) {
	return {$: 10, a: a};
};
var author$project$TablePlugin$CellFocused = function (a) {
	return {$: 7, a: a};
};
var author$project$TablePlugin$DataInput = F2(
	function (a, b) {
		return {$: 6, a: a, b: b};
	});
var author$project$TablePlugin$Down = 1;
var author$project$TablePlugin$InitializeTable = {$: 5};
var author$project$TablePlugin$Left = 2;
var author$project$TablePlugin$Quit = {$: 13};
var author$project$TablePlugin$RemoveSelectedCol = {$: 9};
var author$project$TablePlugin$RemoveSelectedRow = {$: 8};
var author$project$TablePlugin$Right = 3;
var author$project$TablePlugin$SaveAndQuit = {$: 12};
var author$project$TablePlugin$SetNbrCols = function (a) {
	return {$: 1, a: a};
};
var author$project$TablePlugin$SetNbrRows = function (a) {
	return {$: 0, a: a};
};
var author$project$TablePlugin$Up = 0;
var author$project$TablePlugin$focusIsValid = F2(
	function (mbFocus, data) {
		return A2(
			elm$core$Maybe$withDefault,
			false,
			A2(
				elm$core$Maybe$map,
				function (_n1) {
					return true;
				},
				A2(
					elm$core$Maybe$andThen,
					function (_n0) {
						var i = _n0.a;
						var j = _n0.b;
						return A2(
							elm$core$Maybe$map,
							function (row) {
								return A2(elm$core$Array$get, j, row);
							},
							A2(elm$core$Array$get, i, data));
					},
					mbFocus)));
	});
var author$project$TablePlugin$SetStyle = function (a) {
	return {$: 2, a: a};
};
var author$project$TablePlugin$StyleSelectorClick = {$: 3};
var mdgriffith$elm_ui$Element$Input$Placeholder = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var mdgriffith$elm_ui$Element$Input$placeholder = mdgriffith$elm_ui$Element$Input$Placeholder;
var author$project$TablePlugin$styleSelector = function (model) {
	return A2(
		mdgriffith$elm_ui$Element$row,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				mdgriffith$elm_ui$Element$Input$text,
				_List_fromArray(
					[
						mdgriffith$elm_ui$Element$Events$onClick(author$project$TablePlugin$StyleSelectorClick),
						mdgriffith$elm_ui$Element$width(
						mdgriffith$elm_ui$Element$px(150)),
						mdgriffith$elm_ui$Element$below(
						model.aK ? A2(
							mdgriffith$elm_ui$Element$column,
							_List_Nil,
							A2(
								elm$core$List$map,
								function (s) {
									return A2(
										mdgriffith$elm_ui$Element$el,
										_List_fromArray(
											[
												mdgriffith$elm_ui$Element$Events$onClick(
												author$project$TablePlugin$SetStyle(s)),
												mdgriffith$elm_ui$Element$pointer,
												mdgriffith$elm_ui$Element$mouseOver(
												_List_fromArray(
													[
														mdgriffith$elm_ui$Element$Font$color(
														A3(mdgriffith$elm_ui$Element$rgb, 1, 1, 1)),
														mdgriffith$elm_ui$Element$Background$color(
														A3(mdgriffith$elm_ui$Element$rgb, 0.7, 0.7, 0.7))
													])),
												mdgriffith$elm_ui$Element$Background$color(
												A3(mdgriffith$elm_ui$Element$rgb, 1, 1, 1)),
												mdgriffith$elm_ui$Element$width(
												mdgriffith$elm_ui$Element$px(150)),
												A2(mdgriffith$elm_ui$Element$paddingXY, 15, 5)
											]),
										mdgriffith$elm_ui$Element$text(s));
								},
								elm$core$Dict$keys(author$project$StyleSheets$tableStyles))) : mdgriffith$elm_ui$Element$none),
						mdgriffith$elm_ui$Element$spacing(15),
						A2(mdgriffith$elm_ui$Element$paddingXY, 15, 5),
						mdgriffith$elm_ui$Element$focused(
						_List_fromArray(
							[
								A2(
								mdgriffith$elm_ui$Element$Border$glow,
								A3(mdgriffith$elm_ui$Element$rgb, 1, 1, 1),
								0)
							]))
					]),
				{
					b4: A2(
						mdgriffith$elm_ui$Element$Input$labelLeft,
						_List_fromArray(
							[mdgriffith$elm_ui$Element$centerY]),
						A2(
							mdgriffith$elm_ui$Element$el,
							_List_Nil,
							mdgriffith$elm_ui$Element$text('Style'))),
					cQ: author$project$TablePlugin$SetStyle,
					dO: elm$core$Maybe$Just(
						A2(
							mdgriffith$elm_ui$Element$Input$placeholder,
							_List_Nil,
							A2(
								mdgriffith$elm_ui$Element$el,
								_List_Nil,
								mdgriffith$elm_ui$Element$text(model.E)))),
					ec: model.bG
				})
			]));
};
var author$project$TablePlugin$textInputStyle = _List_fromArray(
	[
		mdgriffith$elm_ui$Element$width(
		mdgriffith$elm_ui$Element$px(50)),
		A2(mdgriffith$elm_ui$Element$paddingXY, 5, 5),
		mdgriffith$elm_ui$Element$spacing(15)
	]);
var mdgriffith$elm_ui$Element$Input$Above = 2;
var mdgriffith$elm_ui$Element$Input$labelAbove = mdgriffith$elm_ui$Element$Input$Label(2);
var author$project$TablePlugin$editView = function (model) {
	var dataForTable = elm$core$Array$toList(model.fn);
	var columns = A2(
		elm$core$List$map,
		function (ci) {
			return {
				fJ: mdgriffith$elm_ui$Element$none,
				hJ: F2(
					function (ri, row) {
						return A2(
							mdgriffith$elm_ui$Element$el,
							A2(
								elm$core$Maybe$withDefault,
								_List_Nil,
								A2(
									elm$core$Maybe$map,
									function ($) {
										return $.fa;
									},
									A2(elm$core$Dict$get, model.E, author$project$StyleSheets$tableStyles))),
							A2(
								mdgriffith$elm_ui$Element$Keyed$el,
								_Utils_ap(
									A2(
										elm$core$Maybe$withDefault,
										function (_n0) {
											return _List_Nil;
										},
										A2(
											elm$core$Maybe$map,
											function ($) {
												return $.eX;
											},
											A2(elm$core$Dict$get, model.E, author$project$StyleSheets$tableStyles)))(ri),
									function () {
										var _n1 = model.w;
										if (_n1.$ === 1) {
											return _List_Nil;
										} else {
											var _n2 = _n1.a;
											var i = _n2.a;
											var j = _n2.b;
											return (_Utils_eq(i, ri) && _Utils_eq(j, ci)) ? _List_fromArray(
												[
													mdgriffith$elm_ui$Element$Background$color(
													A4(mdgriffith$elm_ui$Element$rgba, 0, 0, 1, 0.2))
												]) : _List_Nil;
										}
									}()),
								_Utils_Tuple2(
									elm$core$String$fromInt((ri * 100) + ci),
									A2(
										mdgriffith$elm_ui$Element$Input$multiline,
										_List_fromArray(
											[
												mdgriffith$elm_ui$Element$Border$width(0),
												mdgriffith$elm_ui$Element$centerY,
												mdgriffith$elm_ui$Element$Background$color(
												A4(mdgriffith$elm_ui$Element$rgba, 1, 1, 1, 0)),
												mdgriffith$elm_ui$Element$Events$onClick(
												author$project$TablePlugin$CellFocused(
													elm$core$Maybe$Just(
														_Utils_Tuple2(ri, ci)))),
												mdgriffith$elm_ui$Element$focused(
												_List_fromArray(
													[
														A2(
														mdgriffith$elm_ui$Element$Border$glow,
														A3(mdgriffith$elm_ui$Element$rgb, 1, 1, 1),
														0)
													]))
											]),
										{
											b4: A2(mdgriffith$elm_ui$Element$Input$labelAbove, _List_Nil, mdgriffith$elm_ui$Element$none),
											cQ: author$project$TablePlugin$DataInput(
												_Utils_Tuple2(ri, ci)),
											dO: elm$core$Maybe$Nothing,
											g1: false,
											ec: A2(
												elm$core$Maybe$withDefault,
												'',
												A2(elm$core$Array$get, ci, row))
										}))));
					}),
				hL: mdgriffith$elm_ui$Element$fill
			};
		},
		A2(elm$core$List$range, 0, model.gi - 1));
	var tableView = model.aI ? A2(
		mdgriffith$elm_ui$Element$indexedTable,
		A2(
			elm$core$Maybe$withDefault,
			_List_Nil,
			A2(
				elm$core$Maybe$map,
				function ($) {
					return $.hd;
				},
				A2(elm$core$Dict$get, model.E, author$project$StyleSheets$tableStyles))),
		{e6: columns, fn: dataForTable}) : mdgriffith$elm_ui$Element$none;
	var canRemove = A2(author$project$TablePlugin$focusIsValid, model.w, model.fn);
	var interfaceView = model.aI ? A2(
		mdgriffith$elm_ui$Element$column,
		_List_fromArray(
			[
				mdgriffith$elm_ui$Element$spacing(15)
			]),
		_List_fromArray(
			[
				A2(
				mdgriffith$elm_ui$Element$row,
				_List_fromArray(
					[
						mdgriffith$elm_ui$Element$spacing(15)
					]),
				_List_fromArray(
					[
						A2(
						mdgriffith$elm_ui$Element$Input$button,
						author$project$DocumentEditorHelpers$buttonStyle(true),
						{
							b4: mdgriffith$elm_ui$Element$text('Aperçu'),
							cf: elm$core$Maybe$Just(author$project$TablePlugin$SwapDisplayMode)
						}),
						author$project$TablePlugin$styleSelector(model),
						A2(
						mdgriffith$elm_ui$Element$Input$button,
						author$project$DocumentEditorHelpers$buttonStyle(canRemove),
						{
							b4: mdgriffith$elm_ui$Element$text('Supprimer ligne'),
							cf: canRemove ? elm$core$Maybe$Just(author$project$TablePlugin$RemoveSelectedRow) : elm$core$Maybe$Nothing
						}),
						A2(
						mdgriffith$elm_ui$Element$Input$button,
						author$project$DocumentEditorHelpers$buttonStyle(canRemove),
						{
							b4: mdgriffith$elm_ui$Element$text('Supprimer colonne'),
							cf: canRemove ? elm$core$Maybe$Just(author$project$TablePlugin$RemoveSelectedCol) : elm$core$Maybe$Nothing
						})
					])),
				A2(
				mdgriffith$elm_ui$Element$row,
				_List_fromArray(
					[
						mdgriffith$elm_ui$Element$spacing(15)
					]),
				_List_fromArray(
					[
						A2(
						mdgriffith$elm_ui$Element$Input$button,
						author$project$DocumentEditorHelpers$buttonStyle(true),
						{
							b4: mdgriffith$elm_ui$Element$text('Insérer au dessus'),
							cf: elm$core$Maybe$Just(
								author$project$TablePlugin$AddNew(0))
						}),
						A2(
						mdgriffith$elm_ui$Element$Input$button,
						author$project$DocumentEditorHelpers$buttonStyle(true),
						{
							b4: mdgriffith$elm_ui$Element$text('Insérer en dessous'),
							cf: elm$core$Maybe$Just(
								author$project$TablePlugin$AddNew(1))
						}),
						A2(
						mdgriffith$elm_ui$Element$Input$button,
						author$project$DocumentEditorHelpers$buttonStyle(true),
						{
							b4: mdgriffith$elm_ui$Element$text('Insérer à gauche'),
							cf: elm$core$Maybe$Just(
								author$project$TablePlugin$AddNew(2))
						}),
						A2(
						mdgriffith$elm_ui$Element$Input$button,
						author$project$DocumentEditorHelpers$buttonStyle(true),
						{
							b4: mdgriffith$elm_ui$Element$text('Insérer à droite'),
							cf: elm$core$Maybe$Just(
								author$project$TablePlugin$AddNew(3))
						})
					]))
			])) : A2(
		mdgriffith$elm_ui$Element$column,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				mdgriffith$elm_ui$Element$row,
				_List_fromArray(
					[
						mdgriffith$elm_ui$Element$spacing(15)
					]),
				_List_fromArray(
					[
						A2(
						mdgriffith$elm_ui$Element$Input$text,
						author$project$TablePlugin$textInputStyle,
						{
							b4: A2(
								mdgriffith$elm_ui$Element$Input$labelLeft,
								_List_fromArray(
									[mdgriffith$elm_ui$Element$centerY]),
								A2(
									mdgriffith$elm_ui$Element$el,
									_List_Nil,
									mdgriffith$elm_ui$Element$text('Nbr colonnes'))),
							cQ: author$project$TablePlugin$SetNbrCols,
							dO: elm$core$Maybe$Nothing,
							ec: model.a1
						}),
						A2(
						mdgriffith$elm_ui$Element$Input$text,
						author$project$TablePlugin$textInputStyle,
						{
							b4: A2(
								mdgriffith$elm_ui$Element$Input$labelLeft,
								_List_fromArray(
									[mdgriffith$elm_ui$Element$centerY]),
								A2(
									mdgriffith$elm_ui$Element$el,
									_List_Nil,
									mdgriffith$elm_ui$Element$text('Nbr lignes'))),
							cQ: author$project$TablePlugin$SetNbrRows,
							dO: elm$core$Maybe$Nothing,
							ec: model.a2
						}),
						A2(
						mdgriffith$elm_ui$Element$Input$button,
						author$project$DocumentEditorHelpers$buttonStyle(true),
						{
							b4: mdgriffith$elm_ui$Element$text('Créer table'),
							cf: elm$core$Maybe$Just(author$project$TablePlugin$InitializeTable)
						})
					])),
				A2(
				mdgriffith$elm_ui$Element$el,
				_List_Nil,
				mdgriffith$elm_ui$Element$text(model.cy))
			]));
	return A2(
		mdgriffith$elm_ui$Element$column,
		_List_fromArray(
			[
				mdgriffith$elm_ui$Element$spacing(15),
				mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill)
			]),
		_List_fromArray(
			[
				interfaceView,
				tableView,
				model.aI ? A2(
				mdgriffith$elm_ui$Element$row,
				_List_fromArray(
					[
						mdgriffith$elm_ui$Element$spacing(15)
					]),
				_List_fromArray(
					[
						A2(
						mdgriffith$elm_ui$Element$Input$button,
						author$project$DocumentEditorHelpers$buttonStyle(true),
						{
							b4: mdgriffith$elm_ui$Element$text('Quitter'),
							cf: elm$core$Maybe$Just(author$project$TablePlugin$Quit)
						}),
						A2(
						mdgriffith$elm_ui$Element$Input$button,
						author$project$DocumentEditorHelpers$buttonStyle(true),
						{
							b4: mdgriffith$elm_ui$Element$text('Valider et Quitter'),
							cf: elm$core$Maybe$Just(author$project$TablePlugin$SaveAndQuit)
						})
					])) : mdgriffith$elm_ui$Element$none
			]));
};
var author$project$TablePlugin$view = function (model) {
	return A2(
		mdgriffith$elm_ui$Element$map,
		model.fx,
		A2(
			mdgriffith$elm_ui$Element$column,
			_Utils_ap(
				_List_fromArray(
					[
						mdgriffith$elm_ui$Element$Font$size(16),
						mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill),
						mdgriffith$elm_ui$Element$alignTop,
						mdgriffith$elm_ui$Element$padding(15),
						mdgriffith$elm_ui$Element$spacing(15)
					]),
				model.aK ? _List_fromArray(
					[
						mdgriffith$elm_ui$Element$Events$onClick(author$project$TablePlugin$StyleSelectorClickOff)
					]) : _List_Nil),
			_List_fromArray(
				[
					mdgriffith$elm_ui$Element$text('Insérer / Modifier un tableau: '),
					function () {
					var _n0 = model.ar;
					if (!_n0) {
						return author$project$TablePlugin$displayOnlyView(model);
					} else {
						return author$project$TablePlugin$editView(model);
					}
				}()
				])));
};
var author$project$TextBlockPlugin$ColorPickerClickOff = {$: 27};
var author$project$TextBlockPlugin$InternalUrlSelectorClickOff = {$: 14};
var author$project$TextBlockPlugin$Quit = {$: 29};
var author$project$TextBlockPlugin$SaveAndQuit = {$: 28};
var author$project$TextBlockPlugin$TextInput = function (a) {
	return {$: 0, a: a};
};
var author$project$TextBlockPlugin$NewSelection = function (a) {
	return {$: 2, a: a};
};
var author$project$TextBlockPlugin$Selection = F3(
	function (start, finish, sel) {
		return {az: finish, d2: sel, o: start};
	});
var author$project$TextBlockPlugin$decodeSelection = A2(
	elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'selection']),
	A2(
		elm$json$Json$Decode$map,
		author$project$TextBlockPlugin$NewSelection,
		A4(
			elm$json$Json$Decode$map3,
			author$project$TextBlockPlugin$Selection,
			A2(elm$json$Json$Decode$field, 'start', elm$json$Json$Decode$int),
			A2(elm$json$Json$Decode$field, 'finish', elm$json$Json$Decode$int),
			A2(elm$json$Json$Decode$field, 'sel', elm$json$Json$Decode$string))));
var elm$html$Html$textarea = _VirtualDom_node('textarea');
var elm$html$Html$Attributes$cols = function (n) {
	return A2(
		_VirtualDom_attribute,
		'cols',
		elm$core$String$fromInt(n));
};
var author$project$TextBlockPlugin$customTextArea = F4(
	function (attrs, cursorPos, setSelection, rawInput) {
		return A2(
			mdgriffith$elm_ui$Element$el,
			attrs,
			mdgriffith$elm_ui$Element$html(
				A3(
					elm$html$Html$node,
					'custom-textarea',
					_Utils_ap(
						_List_fromArray(
							[
								elm$html$Html$Events$onInput(author$project$TextBlockPlugin$TextInput),
								A2(elm$html$Html$Events$on, 'Selection', author$project$TextBlockPlugin$decodeSelection)
							]),
						function () {
							if (!setSelection.$) {
								var selection = setSelection.a;
								return _List_fromArray(
									[
										A2(elm$html$Html$Attributes$property, 'selection', selection)
									]);
							} else {
								return _List_Nil;
							}
						}()),
					_List_fromArray(
						[
							A2(
							elm$html$Html$textarea,
							_List_fromArray(
								[
									A2(elm$html$Html$Attributes$style, 'font-family', 'Arial'),
									A2(elm$html$Html$Attributes$style, 'font-size', '16px'),
									elm$html$Html$Attributes$cols(60),
									A2(elm$html$Html$Attributes$style, 'height', '500px'),
									A2(elm$html$Html$Attributes$style, 'spellcheck', 'false'),
									A2(elm$html$Html$Attributes$style, 'background-color', 'Beige'),
									elm$html$Html$Attributes$value(rawInput)
								]),
							_List_Nil)
						]))));
	});
var author$project$Icons$externalLink = function (size) {
	return A3(
		author$project$Icons$customSvgFeatherIcon,
		size,
		'external-link',
		_List_fromArray(
			[
				A2(
				elm$svg$Svg$path,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$d('M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6')
					]),
				_List_Nil),
				A2(
				elm$svg$Svg$polyline,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$points('15 3 21 3 21 9')
					]),
				_List_Nil),
				A2(
				elm$svg$Svg$line,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$x1('10'),
						elm$svg$Svg$Attributes$y1('14'),
						elm$svg$Svg$Attributes$x2('21'),
						elm$svg$Svg$Attributes$y2('3')
					]),
				_List_Nil)
			]));
};
var author$project$Icons$link2 = function (size) {
	return A3(
		author$project$Icons$customSvgFeatherIcon,
		size,
		'link-2',
		_List_fromArray(
			[
				A2(
				elm$svg$Svg$path,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$d('M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3')
					]),
				_List_Nil),
				A2(
				elm$svg$Svg$line,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$x1('8'),
						elm$svg$Svg$Attributes$y1('12'),
						elm$svg$Svg$Attributes$x2('16'),
						elm$svg$Svg$Attributes$y2('12')
					]),
				_List_Nil)
			]));
};
var author$project$Icons$tag = function (size) {
	return A3(
		author$project$Icons$customSvgFeatherIcon,
		size,
		'tag',
		_List_fromArray(
			[
				A2(
				elm$svg$Svg$path,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$d('M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z')
					]),
				_List_Nil),
				A2(
				elm$svg$Svg$line,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$x1('7'),
						elm$svg$Svg$Attributes$y1('7'),
						elm$svg$Svg$Attributes$x2('7'),
						elm$svg$Svg$Attributes$y2('7')
					]),
				_List_Nil)
			]));
};
var author$project$Icons$type_ = function (size) {
	return A3(
		author$project$Icons$customSvgFeatherIcon,
		size,
		'type',
		_List_fromArray(
			[
				A2(
				elm$svg$Svg$polyline,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$points('4 7 4 4 20 4 20 7')
					]),
				_List_Nil),
				A2(
				elm$svg$Svg$line,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$x1('9'),
						elm$svg$Svg$Attributes$y1('20'),
						elm$svg$Svg$Attributes$x2('15'),
						elm$svg$Svg$Attributes$y2('20')
					]),
				_List_Nil),
				A2(
				elm$svg$Svg$line,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$x1('12'),
						elm$svg$Svg$Attributes$y1('4'),
						elm$svg$Svg$Attributes$x2('12'),
						elm$svg$Svg$Attributes$y2('20')
					]),
				_List_Nil)
			]));
};
var author$project$TextBlockPlugin$InsertTrackingTag = function (a) {
	return {$: 1, a: a};
};
var author$project$TextBlockPlugin$dummyFileList = elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2(
			'ados',
			_List_fromArray(
				['Document d\'information argent de poche.pdf', 'Dossier d\'inscription argent de poche 2018.pdf', 'Dossier d\'inscription argent de poche.pdf', 'plaquette été 2018 argent de poche.pdf', 'plaquette printemps 2017 argent de poche.pdf'])),
			_Utils_Tuple2(
			'animation',
			_List_fromArray(
				['affiche14juillet2016.pdf', 'affiche14juillet2017.pdf', 'affiche14juillet2018.pdf', 'afficheFestivalArt2018.pdf', 'animations SIVOM 2017.pdf', 'concert église 19-8-18.pdf', 'expo 2018 amis du vieux murol.pdf', 'expos estivales 2017.pdf', 'programme1 2016.pdf', 'programme 1 juillet 2017.pdf', 'programme2 2016.pdf', 'programme 2 juillet 2017.pdf', 'programme3 2016.pdf', 'programme3 aout 2017.pdf', 'programme4 2016.pdf', 'programme 4 aout 2017.pdf', 'programme des animations de la vallée verte juillet 2018.pdf', 'programme Médiévales 2018.pdf', 'www.villes-et-villages-fleuris.com_presse_presentationFR.pdf'])),
			_Utils_Tuple2('bulletin', _List_Nil),
			_Utils_Tuple2('commerces', _List_Nil),
			_Utils_Tuple2('conseilMunicipal', _List_Nil),
			_Utils_Tuple2('decouvrirMurol', _List_Nil),
			_Utils_Tuple2('DeliberationsConseil', _List_Nil),
			_Utils_Tuple2('environnement', _List_Nil),
			_Utils_Tuple2('murolInfo', _List_Nil),
			_Utils_Tuple2('offresEmploi', _List_Nil),
			_Utils_Tuple2('periscolaire', _List_Nil),
			_Utils_Tuple2('villageFleuri', _List_Nil)
		]));
var author$project$TextBlockPlugin$dummyInternalPageList = _List_fromArray(
	['Agriculture', 'AnimationEstivale', 'Animation', 'Animaux', 'Annee2016', 'Annee2017', 'Annee2018', 'Artistes', 'Associations', 'AutomneHiver', 'LaCommune', 'LesSeniors', 'Patrimoine', 'PériEtExtra-scolaire', 'PatrimoinePhoto', 'Photothèque', 'Restaurants', 'Sortir', 'Transports', 'VieScolaire', 'VillageFleuri']);
var author$project$TextBlockPlugin$SetUrl = F2(
	function (a, b) {
		return {$: 11, a: a, b: b};
	});
var author$project$TextBlockPlugin$externalLinkView = F2(
	function (url, _n0) {
		var meta = _n0.bz;
		var attrs = _n0.p;
		var dataKind = _n0.d;
		return A2(
			mdgriffith$elm_ui$Element$row,
			_List_fromArray(
				[
					mdgriffith$elm_ui$Element$spacing(15)
				]),
			_List_fromArray(
				[
					A2(
					mdgriffith$elm_ui$Element$row,
					_List_fromArray(
						[
							mdgriffith$elm_ui$Element$spacing(5)
						]),
					_List_fromArray(
						[
							A2(
							mdgriffith$elm_ui$Element$el,
							_List_fromArray(
								[mdgriffith$elm_ui$Element$Font$bold]),
							mdgriffith$elm_ui$Element$text('Lien pour: ')),
							A2(
							mdgriffith$elm_ui$Element$el,
							_List_Nil,
							mdgriffith$elm_ui$Element$text(meta.ef))
						])),
					A2(
					mdgriffith$elm_ui$Element$Input$text,
					_List_fromArray(
						[
							mdgriffith$elm_ui$Element$width(
							mdgriffith$elm_ui$Element$px(150)),
							mdgriffith$elm_ui$Element$spacing(5),
							A2(mdgriffith$elm_ui$Element$paddingXY, 15, 5),
							mdgriffith$elm_ui$Element$focused(
							_List_fromArray(
								[
									A2(
									mdgriffith$elm_ui$Element$Border$glow,
									A3(mdgriffith$elm_ui$Element$rgb, 1, 1, 1),
									0)
								])),
							mdgriffith$elm_ui$Element$Font$family(
							_List_fromArray(
								[mdgriffith$elm_ui$Element$Font$monospace]))
						]),
					{
						b4: A2(
							mdgriffith$elm_ui$Element$Input$labelLeft,
							_List_fromArray(
								[mdgriffith$elm_ui$Element$centerY, mdgriffith$elm_ui$Element$Font$bold]),
							mdgriffith$elm_ui$Element$text('Url: ')),
						cQ: author$project$TextBlockPlugin$SetUrl(meta.bc),
						dO: elm$core$Maybe$Nothing,
						ec: url
					})
				]));
	});
var author$project$TextBlockPlugin$ConfirmHeadingLevel = function (a) {
	return {$: 10, a: a};
};
var author$project$TextBlockPlugin$SelectHeadingLevel = function (a) {
	return {$: 9, a: a};
};
var author$project$TextBlockPlugin$iconSize = 18;
var elm$html$Html$option = _VirtualDom_node('option');
var elm$html$Html$select = _VirtualDom_node('select');
var elm$html$Html$Attributes$selected = elm$html$Html$Attributes$boolProperty('selected');
var author$project$TextBlockPlugin$headingView = F2(
	function (level, _n0) {
		var meta = _n0.bz;
		var attrs = _n0.p;
		var dataKind = _n0.d;
		return A2(
			mdgriffith$elm_ui$Element$row,
			_List_fromArray(
				[
					mdgriffith$elm_ui$Element$spacing(15)
				]),
			_List_fromArray(
				[
					A2(
					mdgriffith$elm_ui$Element$el,
					_List_Nil,
					mdgriffith$elm_ui$Element$html(
						A2(
							elm$html$Html$select,
							_List_fromArray(
								[
									elm$html$Html$Events$onInput(author$project$TextBlockPlugin$SelectHeadingLevel)
								]),
							_List_fromArray(
								[
									A2(
									elm$html$Html$option,
									_List_fromArray(
										[
											elm$html$Html$Attributes$value('1'),
											elm$html$Html$Attributes$selected(
											_Utils_eq(
												dataKind,
												author$project$TextBlockPlugin$Heading(1)))
										]),
									_List_fromArray(
										[
											elm$html$Html$text('Niveau 1')
										])),
									A2(
									elm$html$Html$option,
									_List_fromArray(
										[
											elm$html$Html$Attributes$value('2'),
											elm$html$Html$Attributes$selected(
											_Utils_eq(
												dataKind,
												author$project$TextBlockPlugin$Heading(2)))
										]),
									_List_fromArray(
										[
											elm$html$Html$text('Niveau 2')
										])),
									A2(
									elm$html$Html$option,
									_List_fromArray(
										[
											elm$html$Html$Attributes$value('3'),
											elm$html$Html$Attributes$selected(
											_Utils_eq(
												dataKind,
												author$project$TextBlockPlugin$Heading(3)))
										]),
									_List_fromArray(
										[
											elm$html$Html$text('Niveau 3')
										]))
								])))),
					A2(
					mdgriffith$elm_ui$Element$Input$button,
					_Utils_ap(
						author$project$DocumentEditorHelpers$buttonStyle(
							!_Utils_eq(level, elm$core$Maybe$Nothing)),
						_List_fromArray(
							[mdgriffith$elm_ui$Element$alignTop])),
					{
						b4: A2(
							mdgriffith$elm_ui$Element$row,
							_List_fromArray(
								[
									mdgriffith$elm_ui$Element$spacing(5)
								]),
							_List_fromArray(
								[
									A2(
									mdgriffith$elm_ui$Element$el,
									_List_Nil,
									mdgriffith$elm_ui$Element$html(
										author$project$Icons$externalLink(author$project$TextBlockPlugin$iconSize))),
									A2(
									mdgriffith$elm_ui$Element$el,
									_List_Nil,
									mdgriffith$elm_ui$Element$text('Valider'))
								])),
						cf: elm$core$Maybe$Just(
							author$project$TextBlockPlugin$ConfirmHeadingLevel(meta.bc))
					})
				]));
	});
var author$project$Icons$bold = function (size) {
	return A3(
		author$project$Icons$customSvgFeatherIcon,
		size,
		'bold',
		_List_fromArray(
			[
				A2(
				elm$svg$Svg$path,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$d('M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z')
					]),
				_List_Nil),
				A2(
				elm$svg$Svg$path,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$d('M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z')
					]),
				_List_Nil)
			]));
};
var author$project$Icons$italic = function (size) {
	return A3(
		author$project$Icons$customSvgFeatherIcon,
		size,
		'italic',
		_List_fromArray(
			[
				A2(
				elm$svg$Svg$line,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$x1('19'),
						elm$svg$Svg$Attributes$y1('4'),
						elm$svg$Svg$Attributes$x2('10'),
						elm$svg$Svg$Attributes$y2('4')
					]),
				_List_Nil),
				A2(
				elm$svg$Svg$line,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$x1('14'),
						elm$svg$Svg$Attributes$y1('20'),
						elm$svg$Svg$Attributes$x2('5'),
						elm$svg$Svg$Attributes$y2('20')
					]),
				_List_Nil),
				A2(
				elm$svg$Svg$line,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$x1('15'),
						elm$svg$Svg$Attributes$y1('4'),
						elm$svg$Svg$Attributes$x2('9'),
						elm$svg$Svg$Attributes$y2('20')
					]),
				_List_Nil)
			]));
};
var author$project$TextBlockPlugin$SetBackgroundColor = F2(
	function (a, b) {
		return {$: 21, a: a, b: b};
	});
var author$project$TextBlockPlugin$SetInlineBold = function (a) {
	return {$: 24, a: a};
};
var author$project$TextBlockPlugin$SetInlineFont = F2(
	function (a, b) {
		return {$: 22, a: a, b: b};
	});
var author$project$TextBlockPlugin$SetInlineFontSize = F2(
	function (a, b) {
		return {$: 23, a: a, b: b};
	});
var author$project$TextBlockPlugin$SetInlineItalic = function (a) {
	return {$: 25, a: a};
};
var author$project$TextBlockPlugin$SetTextColor = F2(
	function (a, b) {
		return {$: 20, a: a, b: b};
	});
var author$project$TextBlockPlugin$ColorPickerClick = function (a) {
	return {$: 26, a: a};
};
var author$project$TextBlockPlugin$chunks = F2(
	function (n, xs) {
		var helper = F2(
			function (acc, ys) {
				helper:
				while (true) {
					if (!ys.b) {
						return elm$core$List$reverse(acc);
					} else {
						var $temp$acc = A2(
							elm$core$List$cons,
							A2(elm$core$List$take, n, ys),
							acc),
							$temp$ys = A2(elm$core$List$drop, n, ys);
						acc = $temp$acc;
						ys = $temp$ys;
						continue helper;
					}
				}
			});
		return A2(helper, _List_Nil, xs);
	});
var author$project$TextBlockPlugin$hexToColor = function (hexColor) {
	var hexColor_ = elm$core$String$toLower(hexColor);
	var red = A2(
		elm$core$Result$withDefault,
		0,
		rtfeldman$elm_hex$Hex$fromString(
			A2(elm$core$String$left, 2, hexColor_)));
	var green = A2(
		elm$core$Result$withDefault,
		0,
		rtfeldman$elm_hex$Hex$fromString(
			A2(
				elm$core$String$left,
				2,
				A2(elm$core$String$dropLeft, 2, hexColor_))));
	var blue = A2(
		elm$core$Result$withDefault,
		0,
		rtfeldman$elm_hex$Hex$fromString(
			A2(
				elm$core$String$left,
				2,
				A2(elm$core$String$dropLeft, 4, hexColor_))));
	return A3(mdgriffith$elm_ui$Element$rgb, red / 255, green / 255, blue / 255);
};
var author$project$TextBlockPlugin$webColors = _List_fromArray(
	[
		_Utils_Tuple2('maroon', '800000'),
		_Utils_Tuple2('dark red', '8B0000'),
		_Utils_Tuple2('brown', 'A52A2A'),
		_Utils_Tuple2('firebrick', 'B22222'),
		_Utils_Tuple2('crimson', 'DC143C'),
		_Utils_Tuple2('red', 'FF0000'),
		_Utils_Tuple2('tomato', 'FF6347'),
		_Utils_Tuple2('coral', 'FF7F50'),
		_Utils_Tuple2('indian red', 'CD5C5C'),
		_Utils_Tuple2('light coral', 'F08080'),
		_Utils_Tuple2('dark salmon', 'E9967A'),
		_Utils_Tuple2('salmon', 'FA8072'),
		_Utils_Tuple2('light salmon', 'FFA07A'),
		_Utils_Tuple2('orange red', 'FF4500'),
		_Utils_Tuple2('dark orange', 'FF8C00'),
		_Utils_Tuple2('orange', 'FFA500'),
		_Utils_Tuple2('gold', 'FFD700'),
		_Utils_Tuple2('dark golden rod', 'B8860B'),
		_Utils_Tuple2('golden rod', 'DAA520'),
		_Utils_Tuple2('pale golden rod', 'EEE8AA'),
		_Utils_Tuple2('dark khaki', 'BDB76B'),
		_Utils_Tuple2('khaki', 'F0E68C'),
		_Utils_Tuple2('olive', '808000'),
		_Utils_Tuple2('yellow', 'FFFF00'),
		_Utils_Tuple2('yellow green', '9ACD32'),
		_Utils_Tuple2('dark olive green', '556B2F'),
		_Utils_Tuple2('olive drab', '6B8E23'),
		_Utils_Tuple2('lawn green', '7CFC00'),
		_Utils_Tuple2('chart reuse', '7FFF00'),
		_Utils_Tuple2('green yellow', 'ADFF2F'),
		_Utils_Tuple2('dark green', '006400'),
		_Utils_Tuple2('green', '008000'),
		_Utils_Tuple2('forest green', '228B22'),
		_Utils_Tuple2('lime', '00FF00'),
		_Utils_Tuple2('lime green', '32CD32'),
		_Utils_Tuple2('light green', '90EE90'),
		_Utils_Tuple2('pale green', '98FB98'),
		_Utils_Tuple2('dark sea green', '8FBC8F'),
		_Utils_Tuple2('medium spring green', '00FA9A'),
		_Utils_Tuple2('spring green', '0F0FF7F'),
		_Utils_Tuple2('sea green', '2E8B57'),
		_Utils_Tuple2('medium aqua marine', '66CDAA'),
		_Utils_Tuple2('medium sea green', '3CB371'),
		_Utils_Tuple2('light sea green', '20B2AA'),
		_Utils_Tuple2('dark slate gray', '2F4F4F'),
		_Utils_Tuple2('teal', '008080'),
		_Utils_Tuple2('dark cyan', '008B8B'),
		_Utils_Tuple2('aqua', '00FFFF'),
		_Utils_Tuple2('cyan', '00FFFF'),
		_Utils_Tuple2('light cyan', 'E0FFFF'),
		_Utils_Tuple2('dark turquoise', '00CED1'),
		_Utils_Tuple2('turquoise', '40E0D0'),
		_Utils_Tuple2('medium turquoise', '48D1CC'),
		_Utils_Tuple2('pale turquoise', 'AFEEEE'),
		_Utils_Tuple2('aqua marine', '7FFFD4'),
		_Utils_Tuple2('powder blue', 'B0E0E6'),
		_Utils_Tuple2('cadet blue', '5F9EA0'),
		_Utils_Tuple2('steel blue', '4682B4'),
		_Utils_Tuple2('corn flower blue', '6495ED'),
		_Utils_Tuple2('deep sky blue', '00BFFF'),
		_Utils_Tuple2('dodger blue', '1E90FF'),
		_Utils_Tuple2('light blue', 'ADD8E6'),
		_Utils_Tuple2('sky blue', '87CEEB'),
		_Utils_Tuple2('light sky blue', '87CEFA'),
		_Utils_Tuple2('midnight blue', '191970'),
		_Utils_Tuple2('navy', '000080'),
		_Utils_Tuple2('dark blue', '00008B'),
		_Utils_Tuple2('medium blue', '0000CD'),
		_Utils_Tuple2('blue', '0000FF'),
		_Utils_Tuple2('royal blue', '4169E1'),
		_Utils_Tuple2('blue violet', '8A2BE2'),
		_Utils_Tuple2('indigo', '4B0082'),
		_Utils_Tuple2('dark slate blue', '483D8B'),
		_Utils_Tuple2('slate blue', '6A5ACD'),
		_Utils_Tuple2('medium slate blue', '7B68EE'),
		_Utils_Tuple2('medium purple', '9370DB'),
		_Utils_Tuple2('dark magenta', '8B008B'),
		_Utils_Tuple2('dark violet', '9400D3'),
		_Utils_Tuple2('dark orchid', '9932CC'),
		_Utils_Tuple2('medium orchid', 'BA55D3'),
		_Utils_Tuple2('purple', '800080'),
		_Utils_Tuple2('thistle', 'D8BFD8'),
		_Utils_Tuple2('plum', 'DDA0DD'),
		_Utils_Tuple2('violet', 'EE82EE'),
		_Utils_Tuple2('magenta / fuchsia', 'FF00FF'),
		_Utils_Tuple2('orchid', 'DA70D6'),
		_Utils_Tuple2('medium violet red', 'C71585'),
		_Utils_Tuple2('pale violet red', 'DB7093'),
		_Utils_Tuple2('deep pink', 'FF1493'),
		_Utils_Tuple2('hot pink', 'FF69B4'),
		_Utils_Tuple2('light pink', 'FFB6C1'),
		_Utils_Tuple2('pink', 'FFC0CB'),
		_Utils_Tuple2('antique white', 'FAEBD7'),
		_Utils_Tuple2('beige', 'F5F5DC'),
		_Utils_Tuple2('bisque', 'FFE4C4'),
		_Utils_Tuple2('blanched almond', 'FFEBCD'),
		_Utils_Tuple2('wheat', 'F5DEB3'),
		_Utils_Tuple2('corn silk', 'FFF8DC'),
		_Utils_Tuple2('lemon chiffon', 'FFFACD'),
		_Utils_Tuple2('light golden rod yellow', 'FAFAD2'),
		_Utils_Tuple2('light yellow', 'FFFFE0'),
		_Utils_Tuple2('saddle brown', '8B4513'),
		_Utils_Tuple2('sienna', 'A0522D'),
		_Utils_Tuple2('chocolate', 'D2691E'),
		_Utils_Tuple2('peru', 'CD853F'),
		_Utils_Tuple2('sandy brown', 'F4A460'),
		_Utils_Tuple2('burly wood', 'DEB887'),
		_Utils_Tuple2('tan', 'D2B48C'),
		_Utils_Tuple2('rosy brown', 'BC8F8F'),
		_Utils_Tuple2('moccasin', 'FFE4B5'),
		_Utils_Tuple2('navajo white', 'FFDEAD'),
		_Utils_Tuple2('peach puff', 'FFDAB9'),
		_Utils_Tuple2('misty rose', 'FFE4E1'),
		_Utils_Tuple2('lavender blush', 'FFF0F5'),
		_Utils_Tuple2('linen', 'FAF0E6'),
		_Utils_Tuple2('old lace', 'FDF5E6'),
		_Utils_Tuple2('papaya whip', 'FFEFD5'),
		_Utils_Tuple2('sea shell', 'FFF5EE'),
		_Utils_Tuple2('mint cream', 'F5FFFA'),
		_Utils_Tuple2('slate gray', '708090'),
		_Utils_Tuple2('light slate gray', '778899'),
		_Utils_Tuple2('light steel blue', 'B0C4DE'),
		_Utils_Tuple2('lavender', 'E6E6FA'),
		_Utils_Tuple2('floral white', 'FFFAF0'),
		_Utils_Tuple2('alice blue', 'F0F8FF'),
		_Utils_Tuple2('ghost white', 'F8F8FF'),
		_Utils_Tuple2('honeydew', 'F0FFF0'),
		_Utils_Tuple2('ivory', 'FFFFF0'),
		_Utils_Tuple2('azure', 'F0FFFF'),
		_Utils_Tuple2('snow', 'FFFAFA'),
		_Utils_Tuple2('black', '000000'),
		_Utils_Tuple2('dim gray / dim grey', '696969'),
		_Utils_Tuple2('gray / grey', '808080'),
		_Utils_Tuple2('dark gray / dark grey', 'A9A9A9'),
		_Utils_Tuple2('silver', 'C0C0C0'),
		_Utils_Tuple2('light gray / light grey', 'D3D3D3'),
		_Utils_Tuple2('gainsboro', 'DCDCDC'),
		_Utils_Tuple2('white smoke', 'F5F5F5'),
		_Utils_Tuple2('white', 'FFFFFF')
	]);
var author$project$TextBlockPlugin$colorPicker = F5(
	function (colorPickerOpen, currentColor, label, msg, uid) {
		var currentColor_ = function () {
			_n3$2:
			while (true) {
				if (!currentColor.$) {
					switch (currentColor.a.$) {
						case 10:
							var _n4 = currentColor.a.a;
							var r = _n4.a;
							var g = _n4.b;
							var b = _n4.c;
							return A3(mdgriffith$elm_ui$Element$rgb, r, g, b);
						case 5:
							var _n5 = currentColor.a.a;
							var r = _n5.a;
							var g = _n5.b;
							var b = _n5.c;
							return A3(mdgriffith$elm_ui$Element$rgb, r, g, b);
						default:
							break _n3$2;
					}
				} else {
					break _n3$2;
				}
			}
			return A3(mdgriffith$elm_ui$Element$rgb, 1, 1, 1);
		}();
		var colorPanView = F2(
			function (mbMsg, color) {
				return A2(
					mdgriffith$elm_ui$Element$el,
					_Utils_ap(
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$width(
								mdgriffith$elm_ui$Element$px(14)),
								mdgriffith$elm_ui$Element$height(
								mdgriffith$elm_ui$Element$px(14)),
								mdgriffith$elm_ui$Element$Background$color(
								author$project$TextBlockPlugin$hexToColor(color)),
								mdgriffith$elm_ui$Element$Border$width(1),
								mdgriffith$elm_ui$Element$Border$color(
								A3(mdgriffith$elm_ui$Element$rgb, 0, 0, 0)),
								mdgriffith$elm_ui$Element$pointer,
								mdgriffith$elm_ui$Element$mouseOver(
								_List_fromArray(
									[
										mdgriffith$elm_ui$Element$Border$color(
										A3(mdgriffith$elm_ui$Element$rgb, 0.9, 0.9, 0.9))
									]))
							]),
						function () {
							if (!mbMsg.$) {
								var msg_ = mbMsg.a;
								return _List_fromArray(
									[
										mdgriffith$elm_ui$Element$Events$onClick(
										A2(msg_, uid, color))
									]);
							} else {
								return _List_Nil;
							}
						}()),
					mdgriffith$elm_ui$Element$none);
			});
		var colors = A2(
			elm$core$List$map,
			function (r) {
				return A2(
					mdgriffith$elm_ui$Element$row,
					_List_fromArray(
						[
							mdgriffith$elm_ui$Element$spacing(3)
						]),
					A2(
						elm$core$List$map,
						function (_n1) {
							var n = _n1.a;
							var c = _n1.b;
							return A2(
								colorPanView,
								elm$core$Maybe$Just(msg),
								c);
						},
						r));
			},
			A2(author$project$TextBlockPlugin$chunks, 12, author$project$TextBlockPlugin$webColors));
		return A2(
			mdgriffith$elm_ui$Element$el,
			_List_fromArray(
				[
					mdgriffith$elm_ui$Element$below(
					A2(
						mdgriffith$elm_ui$Element$el,
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$Background$color(
								A3(mdgriffith$elm_ui$Element$rgb, 0.95, 0.95, 0.95))
							]),
						function () {
							if (!colorPickerOpen.$) {
								var l = colorPickerOpen.a;
								return _Utils_eq(l, label) ? A2(
									mdgriffith$elm_ui$Element$column,
									_List_fromArray(
										[
											mdgriffith$elm_ui$Element$spacing(3),
											mdgriffith$elm_ui$Element$padding(10)
										]),
									colors) : mdgriffith$elm_ui$Element$none;
							} else {
								return mdgriffith$elm_ui$Element$none;
							}
						}()))
				]),
			A2(
				mdgriffith$elm_ui$Element$Input$button,
				author$project$DocumentEditorHelpers$buttonStyle(true),
				{
					b4: A2(
						mdgriffith$elm_ui$Element$row,
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$spacing(10)
							]),
						_List_fromArray(
							[
								A2(
								mdgriffith$elm_ui$Element$el,
								_List_Nil,
								mdgriffith$elm_ui$Element$text(label)),
								A2(
								mdgriffith$elm_ui$Element$el,
								_List_fromArray(
									[
										mdgriffith$elm_ui$Element$width(
										mdgriffith$elm_ui$Element$px(14)),
										mdgriffith$elm_ui$Element$height(
										mdgriffith$elm_ui$Element$px(14)),
										mdgriffith$elm_ui$Element$Background$color(currentColor_),
										mdgriffith$elm_ui$Element$Border$width(1),
										mdgriffith$elm_ui$Element$Border$color(
										A3(mdgriffith$elm_ui$Element$rgb, 0, 0, 0))
									]),
								mdgriffith$elm_ui$Element$none)
							])),
					cf: elm$core$Maybe$Just(
						author$project$TextBlockPlugin$ColorPickerClick(label))
				}));
	});
var author$project$TextBlockPlugin$fontSizes = _List_fromArray(
	['6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '18', '20', '22', '24', '26', '28', '32', '36', '40', '44', '48', '54', '60', '66', '72', '80', '88', '96']);
var author$project$TextBlockPlugin$fonts = _List_fromArray(
	['Arial', 'Helvetica', 'Times New Roman', 'Times', 'Courier New', 'Courier', 'Verdana', 'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS', 'Trebuchet MS', 'Arial Black', 'Impact']);
var author$project$TextBlockPlugin$inlineStyleView = F2(
	function (model, td) {
		var meta = td.bz;
		var attrs = td.p;
		var dataKind = td.d;
		var fontSizeOptionView = F2(
			function (selectedSize, fs) {
				var selected = A2(
					elm$core$Maybe$withDefault,
					false,
					A2(
						elm$core$Maybe$map,
						function (fs_) {
							return _Utils_eq(
								selectedSize,
								elm$core$Maybe$Just(
									author$project$Document$FontSize(fs_)));
						},
						elm$core$String$toInt(fs)));
				return A2(
					elm$html$Html$option,
					_List_fromArray(
						[
							elm$html$Html$Attributes$value(fs),
							elm$html$Html$Attributes$selected(selected)
						]),
					_List_fromArray(
						[
							elm$html$Html$text(fs)
						]));
			});
		var fontOptionView = F2(
			function (selectedFont, f) {
				return A2(
					elm$html$Html$option,
					_List_fromArray(
						[
							elm$html$Html$Attributes$value(f),
							elm$html$Html$Attributes$selected(
							_Utils_eq(
								selectedFont,
								elm$core$Maybe$Just(
									author$project$Document$Font(f))))
						]),
					_List_fromArray(
						[
							elm$html$Html$text(f)
						]));
			});
		return A2(
			mdgriffith$elm_ui$Element$row,
			_List_fromArray(
				[
					mdgriffith$elm_ui$Element$spacing(15)
				]),
			_List_fromArray(
				[
					A2(
					mdgriffith$elm_ui$Element$Input$button,
					A2(
						author$project$DocumentEditorHelpers$toogleButtonStyle,
						A2(elm$core$List$member, author$project$Document$Bold, attrs),
						true),
					{
						b4: A2(
							mdgriffith$elm_ui$Element$row,
							_List_fromArray(
								[
									mdgriffith$elm_ui$Element$spacing(5)
								]),
							_List_fromArray(
								[
									A2(
									mdgriffith$elm_ui$Element$el,
									_List_Nil,
									mdgriffith$elm_ui$Element$html(
										author$project$Icons$bold(author$project$TextBlockPlugin$iconSize)))
								])),
						cf: elm$core$Maybe$Just(
							author$project$TextBlockPlugin$SetInlineBold(meta.bc))
					}),
					A2(
					mdgriffith$elm_ui$Element$Input$button,
					A2(
						author$project$DocumentEditorHelpers$toogleButtonStyle,
						A2(elm$core$List$member, author$project$Document$Italic, attrs),
						true),
					{
						b4: A2(
							mdgriffith$elm_ui$Element$row,
							_List_fromArray(
								[
									mdgriffith$elm_ui$Element$spacing(5)
								]),
							_List_fromArray(
								[
									A2(
									mdgriffith$elm_ui$Element$el,
									_List_Nil,
									mdgriffith$elm_ui$Element$html(
										author$project$Icons$italic(author$project$TextBlockPlugin$iconSize)))
								])),
						cf: elm$core$Maybe$Just(
							author$project$TextBlockPlugin$SetInlineItalic(meta.bc))
					}),
					A2(
					mdgriffith$elm_ui$Element$el,
					_List_Nil,
					mdgriffith$elm_ui$Element$html(
						A2(
							elm$html$Html$select,
							_List_fromArray(
								[
									elm$html$Html$Events$onInput(
									author$project$TextBlockPlugin$SetInlineFont(meta.bc))
								]),
							A2(
								elm$core$List$map,
								fontOptionView(
									elm$core$List$head(
										A2(elm$core$List$filter, author$project$TextBlockPlugin$isFontAttr, attrs))),
								author$project$TextBlockPlugin$fonts)))),
					A2(
					mdgriffith$elm_ui$Element$el,
					_List_Nil,
					mdgriffith$elm_ui$Element$html(
						A2(
							elm$html$Html$select,
							_List_fromArray(
								[
									elm$html$Html$Events$onInput(
									author$project$TextBlockPlugin$SetInlineFontSize(meta.bc))
								]),
							A2(
								elm$core$List$map,
								fontSizeOptionView(
									elm$core$List$head(
										A2(elm$core$List$filter, author$project$TextBlockPlugin$isFontSizeAttr, attrs))),
								author$project$TextBlockPlugin$fontSizes)))),
					A5(
					author$project$TextBlockPlugin$colorPicker,
					model.P,
					elm$core$List$head(
						A2(elm$core$List$filter, author$project$TextBlockPlugin$isFontColorAttr, attrs)),
					'Couleur du texte',
					author$project$TextBlockPlugin$SetTextColor,
					meta.bc),
					A5(
					author$project$TextBlockPlugin$colorPicker,
					model.P,
					elm$core$List$head(
						A2(elm$core$List$filter, author$project$TextBlockPlugin$isBackgroundColorAttr, attrs)),
					'Couleur du fond',
					author$project$TextBlockPlugin$SetBackgroundColor,
					meta.bc)
				]));
	});
var author$project$TextBlockPlugin$InternalUrlSelectorClick = {$: 13};
var author$project$TextBlockPlugin$NoOp = {$: 30};
var author$project$TextBlockPlugin$SetInternalLinkKind = F2(
	function (a, b) {
		return {$: 12, a: a, b: b};
	});
var author$project$TextBlockPlugin$ConfirmFileUrl = function (a) {
	return {$: 19, a: a};
};
var author$project$TextBlockPlugin$SelectFile = function (a) {
	return {$: 18, a: a};
};
var author$project$TextBlockPlugin$SelectFolder = function (a) {
	return {$: 17, a: a};
};
var author$project$TextBlockPlugin$entryView = F3(
	function (mbSel, msg, e) {
		return A2(
			mdgriffith$elm_ui$Element$el,
			_List_fromArray(
				[
					mdgriffith$elm_ui$Element$Events$onClick(
					msg(e)),
					mdgriffith$elm_ui$Element$pointer,
					mdgriffith$elm_ui$Element$mouseOver(
					_List_fromArray(
						[
							mdgriffith$elm_ui$Element$Font$color(
							A3(mdgriffith$elm_ui$Element$rgb, 1, 1, 1)),
							mdgriffith$elm_ui$Element$Background$color(
							A3(mdgriffith$elm_ui$Element$rgb, 0.7, 0.7, 0.7))
						])),
					function () {
					if (!mbSel.$) {
						var sel = mbSel.a;
						return _Utils_eq(sel, e) ? mdgriffith$elm_ui$Element$Background$color(
							A3(mdgriffith$elm_ui$Element$rgb, 0.8, 0.8, 0.8)) : mdgriffith$elm_ui$Element$Background$color(
							A3(mdgriffith$elm_ui$Element$rgb, 1, 1, 1));
					} else {
						return mdgriffith$elm_ui$Element$Background$color(
							A3(mdgriffith$elm_ui$Element$rgb, 1, 1, 1));
					}
				}(),
					mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill),
					A2(mdgriffith$elm_ui$Element$paddingXY, 15, 5)
				]),
			mdgriffith$elm_ui$Element$text(e));
	});
var mdgriffith$elm_ui$Element$clipX = A2(mdgriffith$elm_ui$Internal$Model$Class, mdgriffith$elm_ui$Internal$Flag$overflow, mdgriffith$elm_ui$Internal$Style$classes.e1);
var author$project$TextBlockPlugin$chooseDocView = F4(
	function (uid, mbFolder, mbFile, fileList) {
		return A2(
			mdgriffith$elm_ui$Element$row,
			_List_fromArray(
				[
					mdgriffith$elm_ui$Element$padding(15),
					mdgriffith$elm_ui$Element$spacing(15)
				]),
			_List_fromArray(
				[
					A2(
					mdgriffith$elm_ui$Element$column,
					_List_fromArray(
						[
							mdgriffith$elm_ui$Element$width(
							mdgriffith$elm_ui$Element$px(200)),
							mdgriffith$elm_ui$Element$height(
							mdgriffith$elm_ui$Element$px(150)),
							mdgriffith$elm_ui$Element$Border$width(1),
							mdgriffith$elm_ui$Element$Border$color(
							A3(mdgriffith$elm_ui$Element$rgb, 0.8, 0.8, 0.8)),
							mdgriffith$elm_ui$Element$scrollbarY,
							mdgriffith$elm_ui$Element$Background$color(
							A3(mdgriffith$elm_ui$Element$rgb, 1, 1, 1))
						]),
					A2(
						elm$core$List$map,
						A2(author$project$TextBlockPlugin$entryView, mbFolder, author$project$TextBlockPlugin$SelectFolder),
						elm$core$Dict$keys(fileList))),
					A2(
					mdgriffith$elm_ui$Element$column,
					_List_fromArray(
						[
							mdgriffith$elm_ui$Element$width(
							mdgriffith$elm_ui$Element$px(350)),
							mdgriffith$elm_ui$Element$height(
							mdgriffith$elm_ui$Element$px(150)),
							mdgriffith$elm_ui$Element$Border$width(1),
							mdgriffith$elm_ui$Element$Border$color(
							A3(mdgriffith$elm_ui$Element$rgb, 0.8, 0.8, 0.8)),
							mdgriffith$elm_ui$Element$clipX,
							mdgriffith$elm_ui$Element$scrollbarY,
							mdgriffith$elm_ui$Element$Background$color(
							A3(mdgriffith$elm_ui$Element$rgb, 1, 1, 1))
						]),
					A2(
						elm$core$Maybe$withDefault,
						_List_Nil,
						A2(
							elm$core$Maybe$map,
							elm$core$List$map(
								A2(author$project$TextBlockPlugin$entryView, mbFile, author$project$TextBlockPlugin$SelectFile)),
							A2(
								elm$core$Maybe$andThen,
								function (folder) {
									return A2(elm$core$Dict$get, folder, fileList);
								},
								mbFolder)))),
					A2(
					mdgriffith$elm_ui$Element$Input$button,
					_Utils_ap(
						author$project$DocumentEditorHelpers$buttonStyle(
							!_Utils_eq(mbFile, elm$core$Maybe$Nothing)),
						_List_fromArray(
							[mdgriffith$elm_ui$Element$alignTop])),
					{
						b4: A2(
							mdgriffith$elm_ui$Element$row,
							_List_fromArray(
								[
									mdgriffith$elm_ui$Element$spacing(5)
								]),
							_List_fromArray(
								[
									A2(
									mdgriffith$elm_ui$Element$el,
									_List_Nil,
									mdgriffith$elm_ui$Element$html(
										author$project$Icons$externalLink(author$project$TextBlockPlugin$iconSize))),
									A2(
									mdgriffith$elm_ui$Element$el,
									_List_Nil,
									mdgriffith$elm_ui$Element$text('Valider'))
								])),
						cf: (!_Utils_eq(mbFile, elm$core$Maybe$Nothing)) ? elm$core$Maybe$Just(
							author$project$TextBlockPlugin$ConfirmFileUrl(uid)) : elm$core$Maybe$Nothing
					})
				]));
	});
var author$project$TextBlockPlugin$ConfirmInternalPageUrl = function (a) {
	return {$: 16, a: a};
};
var author$project$TextBlockPlugin$SelectInternalPage = function (a) {
	return {$: 15, a: a};
};
var author$project$TextBlockPlugin$chooseInternalPageView = F3(
	function (uid, mbSelected, pagesList) {
		return A2(
			mdgriffith$elm_ui$Element$row,
			_List_fromArray(
				[
					mdgriffith$elm_ui$Element$padding(15),
					mdgriffith$elm_ui$Element$spacing(15)
				]),
			_List_fromArray(
				[
					A2(
					mdgriffith$elm_ui$Element$column,
					_List_fromArray(
						[
							mdgriffith$elm_ui$Element$width(
							mdgriffith$elm_ui$Element$px(200)),
							mdgriffith$elm_ui$Element$height(
							mdgriffith$elm_ui$Element$px(150)),
							mdgriffith$elm_ui$Element$Border$width(1),
							mdgriffith$elm_ui$Element$Border$color(
							A3(mdgriffith$elm_ui$Element$rgb, 0.8, 0.8, 0.8)),
							mdgriffith$elm_ui$Element$scrollbarY
						]),
					A2(
						elm$core$List$map,
						A2(author$project$TextBlockPlugin$entryView, mbSelected, author$project$TextBlockPlugin$SelectInternalPage),
						pagesList)),
					A2(
					mdgriffith$elm_ui$Element$Input$button,
					_Utils_ap(
						author$project$DocumentEditorHelpers$buttonStyle(
							!_Utils_eq(mbSelected, elm$core$Maybe$Nothing)),
						_List_fromArray(
							[mdgriffith$elm_ui$Element$alignTop])),
					{
						b4: A2(
							mdgriffith$elm_ui$Element$row,
							_List_fromArray(
								[
									mdgriffith$elm_ui$Element$spacing(5)
								]),
							_List_fromArray(
								[
									A2(
									mdgriffith$elm_ui$Element$el,
									_List_Nil,
									mdgriffith$elm_ui$Element$html(
										author$project$Icons$externalLink(author$project$TextBlockPlugin$iconSize))),
									A2(
									mdgriffith$elm_ui$Element$el,
									_List_Nil,
									mdgriffith$elm_ui$Element$text('Valider'))
								])),
						cf: (!_Utils_eq(mbSelected, elm$core$Maybe$Nothing)) ? elm$core$Maybe$Just(
							author$project$TextBlockPlugin$ConfirmInternalPageUrl(uid)) : elm$core$Maybe$Nothing
					})
				]));
	});
var mdgriffith$elm_ui$Element$Input$Option = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var mdgriffith$elm_ui$Element$Input$defaultRadioOption = F2(
	function (optionLabel, status) {
		return A2(
			mdgriffith$elm_ui$Element$row,
			_List_fromArray(
				[
					mdgriffith$elm_ui$Element$spacing(10),
					mdgriffith$elm_ui$Element$alignLeft,
					mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$shrink)
				]),
			_List_fromArray(
				[
					A2(
					mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							mdgriffith$elm_ui$Element$width(
							mdgriffith$elm_ui$Element$px(14)),
							mdgriffith$elm_ui$Element$height(
							mdgriffith$elm_ui$Element$px(14)),
							mdgriffith$elm_ui$Element$Background$color(mdgriffith$elm_ui$Element$Input$white),
							mdgriffith$elm_ui$Element$Border$rounded(7),
							function () {
							if (status === 2) {
								return mdgriffith$elm_ui$Internal$Model$htmlClass('focusable');
							} else {
								return mdgriffith$elm_ui$Internal$Model$NoAttribute;
							}
						}(),
							mdgriffith$elm_ui$Element$Border$width(
							function () {
								switch (status) {
									case 0:
										return 1;
									case 1:
										return 1;
									default:
										return 5;
								}
							}()),
							mdgriffith$elm_ui$Element$Border$color(
							function () {
								switch (status) {
									case 0:
										return A3(mdgriffith$elm_ui$Element$rgb, 208 / 255, 208 / 255, 208 / 255);
									case 1:
										return A3(mdgriffith$elm_ui$Element$rgb, 208 / 255, 208 / 255, 208 / 255);
									default:
										return A3(mdgriffith$elm_ui$Element$rgb, 59 / 255, 153 / 255, 252 / 255);
								}
							}())
						]),
					mdgriffith$elm_ui$Element$none),
					A2(
					mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill),
							mdgriffith$elm_ui$Internal$Model$htmlClass('unfocusable')
						]),
					optionLabel)
				]));
	});
var mdgriffith$elm_ui$Element$Input$option = F2(
	function (val, txt) {
		return A2(
			mdgriffith$elm_ui$Element$Input$Option,
			val,
			mdgriffith$elm_ui$Element$Input$defaultRadioOption(txt));
	});
var mdgriffith$elm_ui$Element$Input$Row = 0;
var mdgriffith$elm_ui$Element$Input$AfterFound = 2;
var mdgriffith$elm_ui$Element$Input$BeforeFound = 1;
var mdgriffith$elm_ui$Element$Input$Idle = 0;
var mdgriffith$elm_ui$Element$Input$NotFound = 0;
var mdgriffith$elm_ui$Element$Input$Selected = 2;
var mdgriffith$elm_ui$Element$Input$column = F2(
	function (attributes, children) {
		return A4(
			mdgriffith$elm_ui$Internal$Model$element,
			mdgriffith$elm_ui$Internal$Model$asColumn,
			mdgriffith$elm_ui$Internal$Model$div,
			A2(
				elm$core$List$cons,
				mdgriffith$elm_ui$Element$height(mdgriffith$elm_ui$Element$shrink),
				A2(
					elm$core$List$cons,
					mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill),
					attributes)),
			mdgriffith$elm_ui$Internal$Model$Unkeyed(children));
	});
var mdgriffith$elm_ui$Element$Input$downArrow = 'ArrowDown';
var mdgriffith$elm_ui$Element$Input$leftArrow = 'ArrowLeft';
var mdgriffith$elm_ui$Element$Input$onKeyLookup = function (lookup) {
	var decode = function (code) {
		var _n0 = lookup(code);
		if (_n0.$ === 1) {
			return elm$json$Json$Decode$fail('No key matched');
		} else {
			var msg = _n0.a;
			return elm$json$Json$Decode$succeed(msg);
		}
	};
	var isKey = A2(
		elm$json$Json$Decode$andThen,
		decode,
		A2(elm$json$Json$Decode$field, 'key', elm$json$Json$Decode$string));
	return mdgriffith$elm_ui$Internal$Model$Attr(
		A2(elm$html$Html$Events$on, 'keyup', isKey));
};
var mdgriffith$elm_ui$Element$Input$rightArrow = 'ArrowRight';
var mdgriffith$elm_ui$Element$Input$row = F2(
	function (attributes, children) {
		return A4(
			mdgriffith$elm_ui$Internal$Model$element,
			mdgriffith$elm_ui$Internal$Model$asRow,
			mdgriffith$elm_ui$Internal$Model$div,
			A2(
				elm$core$List$cons,
				mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill),
				attributes),
			mdgriffith$elm_ui$Internal$Model$Unkeyed(children));
	});
var mdgriffith$elm_ui$Element$Input$space = ' ';
var mdgriffith$elm_ui$Element$Input$tabindex = A2(elm$core$Basics$composeL, mdgriffith$elm_ui$Internal$Model$Attr, elm$html$Html$Attributes$tabindex);
var mdgriffith$elm_ui$Element$Input$upArrow = 'ArrowUp';
var mdgriffith$elm_ui$Element$Input$radioHelper = F3(
	function (orientation, attrs, input) {
		var track = F2(
			function (opt, _n14) {
				var found = _n14.a;
				var prev = _n14.b;
				var nxt = _n14.c;
				var val = opt.a;
				switch (found) {
					case 0:
						return _Utils_eq(
							elm$core$Maybe$Just(val),
							input.H) ? _Utils_Tuple3(1, prev, nxt) : _Utils_Tuple3(found, val, nxt);
					case 1:
						return _Utils_Tuple3(2, prev, val);
					default:
						return _Utils_Tuple3(found, prev, nxt);
				}
			});
		var renderOption = function (_n11) {
			var val = _n11.a;
			var view = _n11.b;
			var status = _Utils_eq(
				elm$core$Maybe$Just(val),
				input.H) ? 2 : 0;
			return A2(
				mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[
						mdgriffith$elm_ui$Element$pointer,
						function () {
						if (!orientation) {
							return mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$shrink);
						} else {
							return mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill);
						}
					}(),
						mdgriffith$elm_ui$Element$Events$onClick(
						input.cQ(val)),
						function () {
						if (status === 2) {
							return mdgriffith$elm_ui$Internal$Model$Attr(
								A2(elm$html$Html$Attributes$attribute, 'aria-checked', 'true'));
						} else {
							return mdgriffith$elm_ui$Internal$Model$Attr(
								A2(elm$html$Html$Attributes$attribute, 'aria-checked', 'false'));
						}
					}(),
						mdgriffith$elm_ui$Internal$Model$Attr(
						A2(elm$html$Html$Attributes$attribute, 'role', 'radio'))
					]),
				view(status));
		};
		var prevNext = function () {
			var _n5 = input.gv;
			if (!_n5.b) {
				return elm$core$Maybe$Nothing;
			} else {
				var _n6 = _n5.a;
				var val = _n6.a;
				return function (_n7) {
					var found = _n7.a;
					var b = _n7.b;
					var a = _n7.c;
					switch (found) {
						case 0:
							return elm$core$Maybe$Just(
								_Utils_Tuple2(b, val));
						case 1:
							return elm$core$Maybe$Just(
								_Utils_Tuple2(b, val));
						default:
							return elm$core$Maybe$Just(
								_Utils_Tuple2(b, a));
					}
				}(
					A3(
						elm$core$List$foldl,
						track,
						_Utils_Tuple3(0, val, val),
						input.gv));
			}
		}();
		var optionArea = function () {
			if (!orientation) {
				return A2(
					mdgriffith$elm_ui$Element$Input$row,
					A2(
						elm$core$List$cons,
						mdgriffith$elm_ui$Element$Input$hiddenLabelAttribute(input.b4),
						attrs),
					A2(elm$core$List$map, renderOption, input.gv));
			} else {
				return A2(
					mdgriffith$elm_ui$Element$Input$column,
					A2(
						elm$core$List$cons,
						mdgriffith$elm_ui$Element$Input$hiddenLabelAttribute(input.b4),
						attrs),
					A2(elm$core$List$map, renderOption, input.gv));
			}
		}();
		var events = A2(
			mdgriffith$elm_ui$Internal$Model$get,
			attrs,
			function (attr) {
				_n3$3:
				while (true) {
					switch (attr.$) {
						case 7:
							if (attr.a.$ === 2) {
								return true;
							} else {
								break _n3$3;
							}
						case 8:
							if (attr.a.$ === 2) {
								return true;
							} else {
								break _n3$3;
							}
						case 1:
							return true;
						default:
							break _n3$3;
					}
				}
				return false;
			});
		return A3(
			mdgriffith$elm_ui$Element$Input$applyLabel,
			_Utils_ap(
				A2(
					elm$core$List$filterMap,
					elm$core$Basics$identity,
					_List_fromArray(
						[
							elm$core$Maybe$Just(mdgriffith$elm_ui$Element$alignLeft),
							elm$core$Maybe$Just(
							mdgriffith$elm_ui$Element$Input$tabindex(0)),
							elm$core$Maybe$Just(
							mdgriffith$elm_ui$Internal$Model$htmlClass('focus')),
							elm$core$Maybe$Just(mdgriffith$elm_ui$Element$Region$announce),
							elm$core$Maybe$Just(
							mdgriffith$elm_ui$Internal$Model$Attr(
								A2(elm$html$Html$Attributes$attribute, 'role', 'radiogroup'))),
							function () {
							if (prevNext.$ === 1) {
								return elm$core$Maybe$Nothing;
							} else {
								var _n1 = prevNext.a;
								var prev = _n1.a;
								var next = _n1.b;
								return elm$core$Maybe$Just(
									mdgriffith$elm_ui$Element$Input$onKeyLookup(
										function (code) {
											if (_Utils_eq(code, mdgriffith$elm_ui$Element$Input$leftArrow)) {
												return elm$core$Maybe$Just(
													input.cQ(prev));
											} else {
												if (_Utils_eq(code, mdgriffith$elm_ui$Element$Input$upArrow)) {
													return elm$core$Maybe$Just(
														input.cQ(prev));
												} else {
													if (_Utils_eq(code, mdgriffith$elm_ui$Element$Input$rightArrow)) {
														return elm$core$Maybe$Just(
															input.cQ(next));
													} else {
														if (_Utils_eq(code, mdgriffith$elm_ui$Element$Input$downArrow)) {
															return elm$core$Maybe$Just(
																input.cQ(next));
														} else {
															if (_Utils_eq(code, mdgriffith$elm_ui$Element$Input$space)) {
																var _n2 = input.H;
																if (_n2.$ === 1) {
																	return elm$core$Maybe$Just(
																		input.cQ(prev));
																} else {
																	return elm$core$Maybe$Nothing;
																}
															} else {
																return elm$core$Maybe$Nothing;
															}
														}
													}
												}
											}
										}));
							}
						}()
						])),
				events),
			input.b4,
			optionArea);
	});
var mdgriffith$elm_ui$Element$Input$radioRow = mdgriffith$elm_ui$Element$Input$radioHelper(0);
var author$project$TextBlockPlugin$internalLinkView = function (config) {
	return A2(
		mdgriffith$elm_ui$Element$row,
		_List_fromArray(
			[
				mdgriffith$elm_ui$Element$spacing(15),
				mdgriffith$elm_ui$Element$below(
				config.d3 ? A2(
					mdgriffith$elm_ui$Element$column,
					_List_fromArray(
						[
							mdgriffith$elm_ui$Element$htmlAttribute(
							A2(
								elm$html$Html$Events$stopPropagationOn,
								'click',
								elm$json$Json$Decode$succeed(
									_Utils_Tuple2(author$project$TextBlockPlugin$NoOp, true)))),
							mdgriffith$elm_ui$Element$Background$color(
							A3(mdgriffith$elm_ui$Element$rgb, 0.95, 0.95, 0.95))
						]),
					_List_fromArray(
						[
							config.cL ? A4(author$project$TextBlockPlugin$chooseDocView, config.bq.bz.bc, config.a9, config.cj, config.fz) : A3(author$project$TextBlockPlugin$chooseInternalPageView, config.bq.bz.bc, config.as, config.dL)
						])) : mdgriffith$elm_ui$Element$none)
			]),
		_List_fromArray(
			[
				A2(
				mdgriffith$elm_ui$Element$row,
				_List_fromArray(
					[
						mdgriffith$elm_ui$Element$spacing(5)
					]),
				_List_fromArray(
					[
						A2(
						mdgriffith$elm_ui$Element$el,
						_List_fromArray(
							[mdgriffith$elm_ui$Element$Font$bold]),
						mdgriffith$elm_ui$Element$text('Lien pour: ')),
						A2(
						mdgriffith$elm_ui$Element$el,
						_List_Nil,
						mdgriffith$elm_ui$Element$text(config.bq.bz.ef))
					])),
				A2(
				mdgriffith$elm_ui$Element$Input$text,
				_List_fromArray(
					[
						mdgriffith$elm_ui$Element$width(
						mdgriffith$elm_ui$Element$px(150)),
						mdgriffith$elm_ui$Element$spacing(5),
						A2(mdgriffith$elm_ui$Element$paddingXY, 15, 5),
						mdgriffith$elm_ui$Element$focused(
						_List_fromArray(
							[
								A2(
								mdgriffith$elm_ui$Element$Border$glow,
								A3(mdgriffith$elm_ui$Element$rgb, 1, 1, 1),
								0)
							])),
						mdgriffith$elm_ui$Element$Font$family(
						_List_fromArray(
							[mdgriffith$elm_ui$Element$Font$monospace])),
						mdgriffith$elm_ui$Element$Events$onClick(author$project$TextBlockPlugin$InternalUrlSelectorClick)
					]),
				{
					b4: A2(
						mdgriffith$elm_ui$Element$Input$labelLeft,
						_List_fromArray(
							[mdgriffith$elm_ui$Element$centerY, mdgriffith$elm_ui$Element$Font$bold]),
						mdgriffith$elm_ui$Element$text('Url: ')),
					cQ: author$project$TextBlockPlugin$SetUrl(config.bq.bz.bc),
					dO: elm$core$Maybe$Nothing,
					ec: config.hG
				}),
				A2(
				mdgriffith$elm_ui$Element$Input$radioRow,
				_List_fromArray(
					[
						mdgriffith$elm_ui$Element$spacing(15)
					]),
				{
					b4: A2(mdgriffith$elm_ui$Element$Input$labelLeft, _List_Nil, mdgriffith$elm_ui$Element$none),
					cQ: author$project$TextBlockPlugin$SetInternalLinkKind(config.bq.bz.bc),
					gv: _List_fromArray(
						[
							A2(
							mdgriffith$elm_ui$Element$Input$option,
							false,
							mdgriffith$elm_ui$Element$text('page interne')),
							A2(
							mdgriffith$elm_ui$Element$Input$option,
							true,
							mdgriffith$elm_ui$Element$text('document'))
						]),
					H: elm$core$Maybe$Just(config.cL)
				})
			]));
};
var author$project$TextBlockPlugin$selectionContainsTrackedData = F2(
	function (mbSelection, trackedData) {
		if (mbSelection.$ === 1) {
			return true;
		} else {
			var start = mbSelection.a.o;
			var finish = mbSelection.a.az;
			var selectionContainsTd = function (_n1) {
				var meta = _n1.bz;
				return (_Utils_cmp(meta.o, start) > -1) && (_Utils_cmp(meta._, finish) < 1);
			};
			return A3(
				elm$core$Dict$foldr,
				F3(
					function (k, v, acc) {
						return selectionContainsTd(v) || acc;
					}),
				false,
				trackedData);
		}
	});
var author$project$TextBlockPlugin$selectionInTrackedData = F2(
	function (mbSelection, trackedData) {
		if (mbSelection.$ === 1) {
			return true;
		} else {
			var start = mbSelection.a.o;
			var finish = mbSelection.a.az;
			var selectionContainsTd = function (_n1) {
				var meta = _n1.bz;
				return (_Utils_cmp(meta.o, start) < 1) && (_Utils_cmp(meta._, finish) > -1);
			};
			return A3(
				elm$core$Dict$foldr,
				F3(
					function (k, v, acc) {
						return selectionContainsTd(v) || acc;
					}),
				false,
				trackedData);
		}
	});
var author$project$Icons$alignJustify = function (size) {
	return A3(
		author$project$Icons$customSvgFeatherIcon,
		size,
		'align-justify',
		_List_fromArray(
			[
				A2(
				elm$svg$Svg$line,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$x1('21'),
						elm$svg$Svg$Attributes$y1('10'),
						elm$svg$Svg$Attributes$x2('3'),
						elm$svg$Svg$Attributes$y2('10')
					]),
				_List_Nil),
				A2(
				elm$svg$Svg$line,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$x1('21'),
						elm$svg$Svg$Attributes$y1('6'),
						elm$svg$Svg$Attributes$x2('3'),
						elm$svg$Svg$Attributes$y2('6')
					]),
				_List_Nil),
				A2(
				elm$svg$Svg$line,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$x1('21'),
						elm$svg$Svg$Attributes$y1('14'),
						elm$svg$Svg$Attributes$x2('3'),
						elm$svg$Svg$Attributes$y2('14')
					]),
				_List_Nil),
				A2(
				elm$svg$Svg$line,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$x1('21'),
						elm$svg$Svg$Attributes$y1('18'),
						elm$svg$Svg$Attributes$x2('3'),
						elm$svg$Svg$Attributes$y2('18')
					]),
				_List_Nil)
			]));
};
var author$project$TextBlockPlugin$SetTextBlocAlignment = {$: 6};
var author$project$TextBlockPlugin$SetTextBlocBold = {$: 7};
var author$project$TextBlockPlugin$SetTextBlocFont = function (a) {
	return {$: 4, a: a};
};
var author$project$TextBlockPlugin$SetTextBlocFontSize = function (a) {
	return {$: 5, a: a};
};
var author$project$TextBlockPlugin$SetTextBlocItalic = {$: 8};
var author$project$TextBlockPlugin$textBlockStyleView = function (model) {
	var fontSizeOptionView = F2(
		function (selectedSize, fs) {
			var selected = A2(
				elm$core$Maybe$withDefault,
				false,
				A2(
					elm$core$Maybe$map,
					function (fs_) {
						return _Utils_eq(
							selectedSize,
							elm$core$Maybe$Just(
								author$project$Document$FontSize(fs_)));
					},
					elm$core$String$toInt(fs)));
			return A2(
				elm$html$Html$option,
				_List_fromArray(
					[
						elm$html$Html$Attributes$value(fs),
						elm$html$Html$Attributes$selected(selected)
					]),
				_List_fromArray(
					[
						elm$html$Html$text(fs)
					]));
		});
	var fontOptionView = F2(
		function (selectedFont, f) {
			return A2(
				elm$html$Html$option,
				_List_fromArray(
					[
						elm$html$Html$Attributes$value(f),
						elm$html$Html$Attributes$selected(
						_Utils_eq(
							selectedFont,
							elm$core$Maybe$Just(
								author$project$Document$Font(f))))
					]),
				_List_fromArray(
					[
						elm$html$Html$text(f)
					]));
		});
	return A2(
		mdgriffith$elm_ui$Element$row,
		_List_fromArray(
			[
				mdgriffith$elm_ui$Element$spacing(15)
			]),
		_List_fromArray(
			[
				A2(
				mdgriffith$elm_ui$Element$el,
				_List_Nil,
				mdgriffith$elm_ui$Element$html(
					A2(
						elm$html$Html$select,
						_List_fromArray(
							[
								elm$html$Html$Events$onInput(author$project$TextBlockPlugin$SetTextBlocFont)
							]),
						A2(
							elm$core$List$map,
							fontOptionView(
								elm$core$List$head(
									A2(elm$core$List$filter, author$project$TextBlockPlugin$isFontAttr, model.q))),
							author$project$TextBlockPlugin$fonts)))),
				A2(
				mdgriffith$elm_ui$Element$el,
				_List_Nil,
				mdgriffith$elm_ui$Element$html(
					A2(
						elm$html$Html$select,
						_List_fromArray(
							[
								elm$html$Html$Events$onInput(author$project$TextBlockPlugin$SetTextBlocFontSize)
							]),
						A2(
							elm$core$List$map,
							fontSizeOptionView(
								elm$core$List$head(
									A2(elm$core$List$filter, author$project$TextBlockPlugin$isFontSizeAttr, model.q))),
							author$project$TextBlockPlugin$fontSizes)))),
				A2(
				mdgriffith$elm_ui$Element$Input$button,
				A2(
					author$project$DocumentEditorHelpers$toogleButtonStyle,
					A2(elm$core$List$member, author$project$Document$Justify, model.q),
					_Utils_eq(model.H, elm$core$Maybe$Nothing)),
				{
					b4: A2(
						mdgriffith$elm_ui$Element$row,
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$spacing(5)
							]),
						_List_fromArray(
							[
								A2(
								mdgriffith$elm_ui$Element$el,
								_List_Nil,
								mdgriffith$elm_ui$Element$html(
									author$project$Icons$alignJustify(author$project$TextBlockPlugin$iconSize)))
							])),
					cf: elm$core$Maybe$Just(author$project$TextBlockPlugin$SetTextBlocAlignment)
				}),
				A2(
				mdgriffith$elm_ui$Element$Input$button,
				A2(
					author$project$DocumentEditorHelpers$toogleButtonStyle,
					A2(elm$core$List$member, author$project$Document$Bold, model.q),
					_Utils_eq(model.H, elm$core$Maybe$Nothing)),
				{
					b4: A2(
						mdgriffith$elm_ui$Element$row,
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$spacing(5)
							]),
						_List_fromArray(
							[
								A2(
								mdgriffith$elm_ui$Element$el,
								_List_Nil,
								mdgriffith$elm_ui$Element$html(
									author$project$Icons$bold(author$project$TextBlockPlugin$iconSize)))
							])),
					cf: elm$core$Maybe$Just(author$project$TextBlockPlugin$SetTextBlocBold)
				}),
				A2(
				mdgriffith$elm_ui$Element$Input$button,
				A2(
					author$project$DocumentEditorHelpers$toogleButtonStyle,
					A2(elm$core$List$member, author$project$Document$Italic, model.q),
					_Utils_eq(model.H, elm$core$Maybe$Nothing)),
				{
					b4: A2(
						mdgriffith$elm_ui$Element$row,
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$spacing(5)
							]),
						_List_fromArray(
							[
								A2(
								mdgriffith$elm_ui$Element$el,
								_List_Nil,
								mdgriffith$elm_ui$Element$html(
									author$project$Icons$italic(author$project$TextBlockPlugin$iconSize)))
							])),
					cf: elm$core$Maybe$Just(author$project$TextBlockPlugin$SetTextBlocItalic)
				})
			]));
};
var author$project$TextBlockPlugin$interfaceView = function (model) {
	var isActive = (!_Utils_eq(model.H, elm$core$Maybe$Nothing)) && ((!A2(author$project$TextBlockPlugin$selectionContainsTrackedData, model.H, model.b)) && (!A2(author$project$TextBlockPlugin$selectionInTrackedData, model.H, model.b)));
	return A2(
		mdgriffith$elm_ui$Element$column,
		_List_fromArray(
			[
				mdgriffith$elm_ui$Element$spacing(15)
			]),
		_List_fromArray(
			[
				A2(
				mdgriffith$elm_ui$Element$row,
				_List_fromArray(
					[
						mdgriffith$elm_ui$Element$spacing(15),
						mdgriffith$elm_ui$Element$Font$size(16),
						mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill)
					]),
				_List_fromArray(
					[
						A2(
						mdgriffith$elm_ui$Element$Input$button,
						author$project$DocumentEditorHelpers$buttonStyle(isActive),
						{
							b4: A2(
								mdgriffith$elm_ui$Element$row,
								_List_fromArray(
									[
										mdgriffith$elm_ui$Element$spacing(5)
									]),
								_List_fromArray(
									[
										A2(
										mdgriffith$elm_ui$Element$el,
										_List_Nil,
										mdgriffith$elm_ui$Element$html(
											author$project$Icons$type_(author$project$TextBlockPlugin$iconSize))),
										A2(
										mdgriffith$elm_ui$Element$el,
										_List_Nil,
										mdgriffith$elm_ui$Element$text('Titre'))
									])),
							cf: isActive ? elm$core$Maybe$Just(
								author$project$TextBlockPlugin$InsertTrackingTag(
									author$project$TextBlockPlugin$Heading(1))) : elm$core$Maybe$Nothing
						}),
						A2(
						mdgriffith$elm_ui$Element$Input$button,
						author$project$DocumentEditorHelpers$buttonStyle(isActive),
						{
							b4: A2(
								mdgriffith$elm_ui$Element$row,
								_List_fromArray(
									[
										mdgriffith$elm_ui$Element$spacing(5)
									]),
								_List_fromArray(
									[
										A2(
										mdgriffith$elm_ui$Element$el,
										_List_Nil,
										mdgriffith$elm_ui$Element$html(
											author$project$Icons$link2(author$project$TextBlockPlugin$iconSize))),
										A2(
										mdgriffith$elm_ui$Element$el,
										_List_Nil,
										mdgriffith$elm_ui$Element$text('Lien interne'))
									])),
							cf: isActive ? elm$core$Maybe$Just(
								author$project$TextBlockPlugin$InsertTrackingTag(
									A2(author$project$TextBlockPlugin$InternalLink, false, ''))) : elm$core$Maybe$Nothing
						}),
						A2(
						mdgriffith$elm_ui$Element$Input$button,
						author$project$DocumentEditorHelpers$buttonStyle(isActive),
						{
							b4: A2(
								mdgriffith$elm_ui$Element$row,
								_List_fromArray(
									[
										mdgriffith$elm_ui$Element$spacing(5)
									]),
								_List_fromArray(
									[
										A2(
										mdgriffith$elm_ui$Element$el,
										_List_Nil,
										mdgriffith$elm_ui$Element$html(
											author$project$Icons$externalLink(author$project$TextBlockPlugin$iconSize))),
										A2(
										mdgriffith$elm_ui$Element$el,
										_List_Nil,
										mdgriffith$elm_ui$Element$text('lien externe'))
									])),
							cf: isActive ? elm$core$Maybe$Just(
								author$project$TextBlockPlugin$InsertTrackingTag(
									author$project$TextBlockPlugin$ExternalLink(''))) : elm$core$Maybe$Nothing
						}),
						A2(
						mdgriffith$elm_ui$Element$Input$button,
						author$project$DocumentEditorHelpers$buttonStyle(isActive),
						{
							b4: A2(
								mdgriffith$elm_ui$Element$row,
								_List_fromArray(
									[
										mdgriffith$elm_ui$Element$spacing(5)
									]),
								_List_fromArray(
									[
										A2(
										mdgriffith$elm_ui$Element$el,
										_List_Nil,
										mdgriffith$elm_ui$Element$html(
											author$project$Icons$tag(author$project$TextBlockPlugin$iconSize))),
										A2(
										mdgriffith$elm_ui$Element$el,
										_List_Nil,
										mdgriffith$elm_ui$Element$text('Tag'))
									])),
							cf: isActive ? elm$core$Maybe$Just(
								author$project$TextBlockPlugin$InsertTrackingTag(author$project$TextBlockPlugin$InlineStyled)) : elm$core$Maybe$Nothing
						})
					])),
				A2(
				mdgriffith$elm_ui$Element$row,
				_List_fromArray(
					[
						mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill),
						mdgriffith$elm_ui$Element$height(
						mdgriffith$elm_ui$Element$px(30)),
						mdgriffith$elm_ui$Element$Font$size(16)
					]),
				_List_fromArray(
					[
						function () {
						var _n0 = model.r;
						if (_n0.$ === 1) {
							return author$project$TextBlockPlugin$textBlockStyleView(model);
						} else {
							var td = _n0.a;
							var meta = td.bz;
							var attrs = td.p;
							var dataKind = td.d;
							switch (dataKind.$) {
								case 2:
									var level = dataKind.a;
									return A2(author$project$TextBlockPlugin$headingView, model.aY, td);
								case 0:
									var isDoc = dataKind.a;
									var url = dataKind.b;
									return author$project$TextBlockPlugin$internalLinkView(
										{fz: author$project$TextBlockPlugin$dummyFileList, cL: isDoc, dL: author$project$TextBlockPlugin$dummyInternalPageList, cj: model.cj, a9: model.a9, as: model.as, d3: model.ab, bq: td, hG: url});
								case 1:
									var url = dataKind.a;
									return A2(author$project$TextBlockPlugin$externalLinkView, url, td);
								default:
									return A2(author$project$TextBlockPlugin$inlineStyleView, model, td);
							}
						}
					}()
					]))
			]));
};
var author$project$TextBlockPlugin$textBlocPreview = F2(
	function (model, config) {
		return A2(
			mdgriffith$elm_ui$Element$map,
			function (_n0) {
				return author$project$TextBlockPlugin$NoOp;
			},
			A2(
				mdgriffith$elm_ui$Element$column,
				_List_fromArray(
					[
						mdgriffith$elm_ui$Element$width(
						A2(
							mdgriffith$elm_ui$Element$minimum,
							500,
							A2(mdgriffith$elm_ui$Element$maximum, 700, mdgriffith$elm_ui$Element$fill))),
						mdgriffith$elm_ui$Element$height(
						A2(mdgriffith$elm_ui$Element$maximum, 500, mdgriffith$elm_ui$Element$fill)),
						mdgriffith$elm_ui$Element$scrollbarY,
						mdgriffith$elm_ui$Element$spacing(20),
						mdgriffith$elm_ui$Element$alignTop,
						mdgriffith$elm_ui$Element$Border$shadow(
						{
							eH: 10,
							e4: A4(mdgriffith$elm_ui$Element$rgba, 0, 0, 0, 0.16),
							gn: _Utils_Tuple2(4, 4),
							d7: 5
						}),
						mdgriffith$elm_ui$Element$padding(15)
					]),
				A4(
					author$project$DocumentView$renderTextBlock,
					config,
					{aj: elm$core$Set$empty, al: elm$core$Maybe$Nothing, ao: elm$core$Maybe$Nothing, bc: -1},
					model.q,
					model.i)));
	});
var author$project$TextBlockPlugin$view = F2(
	function (model, config) {
		return A2(
			mdgriffith$elm_ui$Element$map,
			model.fx,
			A2(
				mdgriffith$elm_ui$Element$column,
				_Utils_ap(
					_List_fromArray(
						[
							mdgriffith$elm_ui$Element$padding(15),
							mdgriffith$elm_ui$Element$spacing(15),
							mdgriffith$elm_ui$Element$scrollbarY,
							mdgriffith$elm_ui$Element$height(
							A2(mdgriffith$elm_ui$Element$minimum, config.fL - config.f9, mdgriffith$elm_ui$Element$fill)),
							mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill)
						]),
					_Utils_ap(
						model.ab ? _List_fromArray(
							[
								mdgriffith$elm_ui$Element$Events$onClick(author$project$TextBlockPlugin$InternalUrlSelectorClickOff)
							]) : _List_Nil,
						(!_Utils_eq(model.P, elm$core$Maybe$Nothing)) ? _List_fromArray(
							[
								mdgriffith$elm_ui$Element$Events$onClick(author$project$TextBlockPlugin$ColorPickerClickOff)
							]) : _List_Nil)),
				_List_fromArray(
					[
						author$project$TextBlockPlugin$interfaceView(model),
						A2(
						(config.hL < 1600) ? mdgriffith$elm_ui$Element$column : mdgriffith$elm_ui$Element$row,
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$spacing(30)
							]),
						_List_fromArray(
							[
								A2(
								mdgriffith$elm_ui$Element$column,
								_List_fromArray(
									[
										mdgriffith$elm_ui$Element$alignTop,
										mdgriffith$elm_ui$Element$spacing(20)
									]),
								_List_fromArray(
									[
										A4(
										author$project$TextBlockPlugin$customTextArea,
										_List_fromArray(
											[
												mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill)
											]),
										model.bf,
										model.bn,
										model.a8),
										A2(
										mdgriffith$elm_ui$Element$row,
										_List_fromArray(
											[
												mdgriffith$elm_ui$Element$spacing(15),
												mdgriffith$elm_ui$Element$Font$size(16)
											]),
										_List_fromArray(
											[
												A2(
												mdgriffith$elm_ui$Element$Input$button,
												author$project$DocumentEditorHelpers$buttonStyle(true),
												{
													b4: mdgriffith$elm_ui$Element$text('Quitter'),
													cf: elm$core$Maybe$Just(author$project$TextBlockPlugin$Quit)
												}),
												A2(
												mdgriffith$elm_ui$Element$Input$button,
												author$project$DocumentEditorHelpers$buttonStyle(true),
												{
													b4: mdgriffith$elm_ui$Element$text('Valider et Quitter'),
													cf: elm$core$Maybe$Just(author$project$TextBlockPlugin$SaveAndQuit)
												})
											]))
									])),
								A2(author$project$TextBlockPlugin$textBlocPreview, model, config)
							]))
					])));
	});
var author$project$VideoPlugin$CheckControls = function (a) {
	return {$: 4, a: a};
};
var author$project$VideoPlugin$CheckFrameBorder = function (a) {
	return {$: 3, a: a};
};
var author$project$VideoPlugin$CheckPrivacy = function (a) {
	return {$: 5, a: a};
};
var author$project$VideoPlugin$CheckSuggestions = function (a) {
	return {$: 7, a: a};
};
var author$project$VideoPlugin$CheckTitle = function (a) {
	return {$: 6, a: a};
};
var author$project$VideoPlugin$ParseHtml = {$: 1};
var author$project$VideoPlugin$Quit = {$: 11};
var author$project$VideoPlugin$SaveAndQuit = {$: 12};
var author$project$VideoPlugin$SetAlignment = function (a) {
	return {$: 2, a: a};
};
var author$project$VideoPlugin$SetEmbedString = function (a) {
	return {$: 0, a: a};
};
var author$project$VideoPlugin$SetHeight = function (a) {
	return {$: 10, a: a};
};
var author$project$VideoPlugin$SetStartAt = function (a) {
	return {$: 8, a: a};
};
var author$project$VideoPlugin$SetWidth = function (a) {
	return {$: 9, a: a};
};
var author$project$VideoPlugin$checkIcon = function (c) {
	return c ? mdgriffith$elm_ui$Element$html(
		author$project$Icons$checkSquare(15)) : mdgriffith$elm_ui$Element$html(
		author$project$Icons$square(15));
};
var author$project$VideoPlugin$iconSize = 18;
var mdgriffith$elm_ui$Element$Input$checkbox = F2(
	function (attrs, _n0) {
		var label = _n0.b4;
		var icon = _n0.dr;
		var checked = _n0.bu;
		var onChange = _n0.cQ;
		var attributes = _Utils_ap(
			_List_fromArray(
				[
					mdgriffith$elm_ui$Element$Input$isHiddenLabel(label) ? mdgriffith$elm_ui$Internal$Model$NoAttribute : mdgriffith$elm_ui$Element$spacing(6),
					mdgriffith$elm_ui$Internal$Model$Attr(
					elm$html$Html$Events$onClick(
						onChange(!checked))),
					mdgriffith$elm_ui$Element$Region$announce,
					mdgriffith$elm_ui$Element$Input$onKeyLookup(
					function (code) {
						return _Utils_eq(code, mdgriffith$elm_ui$Element$Input$enter) ? elm$core$Maybe$Just(
							onChange(!checked)) : (_Utils_eq(code, mdgriffith$elm_ui$Element$Input$space) ? elm$core$Maybe$Just(
							onChange(!checked)) : elm$core$Maybe$Nothing);
					}),
					mdgriffith$elm_ui$Element$Input$tabindex(0),
					mdgriffith$elm_ui$Element$pointer,
					mdgriffith$elm_ui$Element$alignLeft,
					mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill)
				]),
			attrs);
		return A3(
			mdgriffith$elm_ui$Element$Input$applyLabel,
			attributes,
			label,
			A4(
				mdgriffith$elm_ui$Internal$Model$element,
				mdgriffith$elm_ui$Internal$Model$asEl,
				mdgriffith$elm_ui$Internal$Model$div,
				_List_fromArray(
					[
						mdgriffith$elm_ui$Internal$Model$Attr(
						A2(elm$html$Html$Attributes$attribute, 'role', 'checkbox')),
						mdgriffith$elm_ui$Internal$Model$Attr(
						A2(
							elm$html$Html$Attributes$attribute,
							'aria-checked',
							checked ? 'true' : 'false')),
						mdgriffith$elm_ui$Element$Input$hiddenLabelAttribute(label),
						mdgriffith$elm_ui$Element$centerY,
						mdgriffith$elm_ui$Element$height(mdgriffith$elm_ui$Element$fill),
						mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$shrink)
					]),
				mdgriffith$elm_ui$Internal$Model$Unkeyed(
					_List_fromArray(
						[
							icon(checked)
						]))));
	});
var author$project$VideoPlugin$view = F2(
	function (config, model) {
		return A2(
			mdgriffith$elm_ui$Element$map,
			model.fx,
			A2(
				mdgriffith$elm_ui$Element$column,
				_List_fromArray(
					[
						mdgriffith$elm_ui$Element$spacing(15),
						mdgriffith$elm_ui$Element$padding(15),
						mdgriffith$elm_ui$Element$alignTop,
						mdgriffith$elm_ui$Element$Font$size(16),
						mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill),
						mdgriffith$elm_ui$Element$height(mdgriffith$elm_ui$Element$fill),
						mdgriffith$elm_ui$Element$scrollbars
					]),
				_List_fromArray(
					[
						mdgriffith$elm_ui$Element$text('Insérer / Modifier une video:'),
						A2(
						mdgriffith$elm_ui$Element$column,
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$spacing(10),
								mdgriffith$elm_ui$Element$width(
								mdgriffith$elm_ui$Element$px(500))
							]),
						_List_fromArray(
							[
								A2(
								mdgriffith$elm_ui$Element$Input$multiline,
								_List_fromArray(
									[
										mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill)
									]),
								{
									b4: A2(
										mdgriffith$elm_ui$Element$Input$labelAbove,
										_List_Nil,
										mdgriffith$elm_ui$Element$text('Copier ici le code d\'intégration:')),
									cQ: author$project$VideoPlugin$SetEmbedString,
									dO: elm$core$Maybe$Nothing,
									g1: false,
									ec: A2(elm$core$Maybe$withDefault, '', model.a7)
								}),
								A2(
								mdgriffith$elm_ui$Element$Input$button,
								author$project$DocumentEditorHelpers$buttonStyle(
									!_Utils_eq(model.a7, elm$core$Maybe$Nothing)),
								{
									b4: mdgriffith$elm_ui$Element$text('Valider'),
									cf: (!_Utils_eq(model.a7, elm$core$Maybe$Nothing)) ? elm$core$Maybe$Just(author$project$VideoPlugin$ParseHtml) : elm$core$Maybe$Nothing
								})
							])),
						A2(
						mdgriffith$elm_ui$Element$column,
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$spacing(15)
							]),
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$text('Alignement: '),
								A2(
								mdgriffith$elm_ui$Element$row,
								_List_fromArray(
									[
										mdgriffith$elm_ui$Element$spacing(15)
									]),
								_List_fromArray(
									[
										A2(
										mdgriffith$elm_ui$Element$Input$button,
										A2(author$project$DocumentEditorHelpers$toogleButtonStyle, model.aP === 2, true),
										{
											b4: A2(
												mdgriffith$elm_ui$Element$el,
												_List_Nil,
												mdgriffith$elm_ui$Element$html(
													author$project$Icons$alignLeft(author$project$VideoPlugin$iconSize))),
											cf: elm$core$Maybe$Just(
												author$project$VideoPlugin$SetAlignment(2))
										}),
										A2(
										mdgriffith$elm_ui$Element$Input$button,
										A2(author$project$DocumentEditorHelpers$toogleButtonStyle, model.aP === 1, true),
										{
											b4: A2(
												mdgriffith$elm_ui$Element$el,
												_List_Nil,
												mdgriffith$elm_ui$Element$html(
													author$project$Icons$alignCenter(author$project$VideoPlugin$iconSize))),
											cf: elm$core$Maybe$Just(
												author$project$VideoPlugin$SetAlignment(1))
										}),
										A2(
										mdgriffith$elm_ui$Element$Input$button,
										A2(author$project$DocumentEditorHelpers$toogleButtonStyle, !model.aP, true),
										{
											b4: A2(
												mdgriffith$elm_ui$Element$el,
												_List_Nil,
												mdgriffith$elm_ui$Element$html(
													author$project$Icons$alignRight(author$project$VideoPlugin$iconSize))),
											cf: elm$core$Maybe$Just(
												author$project$VideoPlugin$SetAlignment(0))
										})
									])),
								mdgriffith$elm_ui$Element$text('Options: '),
								A2(
								mdgriffith$elm_ui$Element$row,
								_List_fromArray(
									[
										mdgriffith$elm_ui$Element$spacing(15)
									]),
								_List_fromArray(
									[
										A2(
										mdgriffith$elm_ui$Element$Input$checkbox,
										_List_Nil,
										{
											bu: model.fE,
											dr: author$project$VideoPlugin$checkIcon,
											b4: A2(
												mdgriffith$elm_ui$Element$Input$labelLeft,
												_List_Nil,
												mdgriffith$elm_ui$Element$text('Bordure')),
											cQ: author$project$VideoPlugin$CheckFrameBorder
										}),
										A2(
										mdgriffith$elm_ui$Element$Input$checkbox,
										_List_Nil,
										{
											bu: model.hz,
											dr: author$project$VideoPlugin$checkIcon,
											b4: A2(
												mdgriffith$elm_ui$Element$Input$labelLeft,
												_List_Nil,
												mdgriffith$elm_ui$Element$text('Afficher titre')),
											cQ: author$project$VideoPlugin$CheckTitle
										}),
										A2(
										mdgriffith$elm_ui$Element$Input$checkbox,
										_List_Nil,
										{
											bu: model.ff,
											dr: author$project$VideoPlugin$checkIcon,
											b4: A2(
												mdgriffith$elm_ui$Element$Input$labelLeft,
												_List_Nil,
												mdgriffith$elm_ui$Element$text('Commandes')),
											cQ: author$project$VideoPlugin$CheckControls
										}),
										A2(
										mdgriffith$elm_ui$Element$Input$checkbox,
										_List_Nil,
										{
											bu: model.hc,
											dr: author$project$VideoPlugin$checkIcon,
											b4: A2(
												mdgriffith$elm_ui$Element$Input$labelLeft,
												_List_Nil,
												mdgriffith$elm_ui$Element$text('Suggestions')),
											cQ: author$project$VideoPlugin$CheckSuggestions
										}),
										A2(
										mdgriffith$elm_ui$Element$Input$checkbox,
										_List_Nil,
										{
											bu: model.gF,
											dr: author$project$VideoPlugin$checkIcon,
											b4: A2(
												mdgriffith$elm_ui$Element$Input$labelLeft,
												_List_Nil,
												mdgriffith$elm_ui$Element$text('Mode privé')),
											cQ: author$project$VideoPlugin$CheckPrivacy
										})
									])),
								A2(
								mdgriffith$elm_ui$Element$row,
								_List_fromArray(
									[
										mdgriffith$elm_ui$Element$spacing(15)
									]),
								_List_fromArray(
									[
										A2(
										mdgriffith$elm_ui$Element$Input$text,
										_Utils_ap(
											author$project$DocumentEditorHelpers$textInputStyle,
											_List_fromArray(
												[
													mdgriffith$elm_ui$Element$width(
													mdgriffith$elm_ui$Element$px(50))
												])),
										{
											b4: A2(
												mdgriffith$elm_ui$Element$Input$labelLeft,
												_List_fromArray(
													[mdgriffith$elm_ui$Element$centerY]),
												mdgriffith$elm_ui$Element$text('largeur: ')),
											cQ: author$project$VideoPlugin$SetWidth,
											dO: elm$core$Maybe$Nothing,
											ec: elm$core$String$fromInt(model.d7.hI)
										}),
										A2(
										mdgriffith$elm_ui$Element$Input$text,
										_Utils_ap(
											author$project$DocumentEditorHelpers$textInputStyle,
											_List_fromArray(
												[
													mdgriffith$elm_ui$Element$width(
													mdgriffith$elm_ui$Element$px(50))
												])),
										{
											b4: A2(
												mdgriffith$elm_ui$Element$Input$labelLeft,
												_List_fromArray(
													[mdgriffith$elm_ui$Element$centerY]),
												mdgriffith$elm_ui$Element$text('hauteur: ')),
											cQ: author$project$VideoPlugin$SetHeight,
											dO: elm$core$Maybe$Nothing,
											ec: elm$core$String$fromInt(model.d7.hH)
										}),
										A2(
										mdgriffith$elm_ui$Element$Input$text,
										_Utils_ap(
											author$project$DocumentEditorHelpers$textInputStyle,
											_List_fromArray(
												[
													mdgriffith$elm_ui$Element$width(
													mdgriffith$elm_ui$Element$px(100))
												])),
										{
											b4: A2(
												mdgriffith$elm_ui$Element$Input$labelLeft,
												_List_fromArray(
													[mdgriffith$elm_ui$Element$centerY]),
												mdgriffith$elm_ui$Element$text('Commencer lecture à: ')),
											cQ: author$project$VideoPlugin$SetStartAt,
											dO: elm$core$Maybe$Just(
												A2(
													mdgriffith$elm_ui$Element$Input$placeholder,
													_List_Nil,
													mdgriffith$elm_ui$Element$text('hh:mm:ss'))),
											ec: A2(
												elm$core$Maybe$withDefault,
												'',
												A2(elm$core$Maybe$map, elm$core$String$fromInt, model.g2))
										})
									]))
							])),
						function () {
						var _n0 = model.a3;
						if (!_n0.$) {
							var url = _n0.a;
							return A2(
								mdgriffith$elm_ui$Element$el,
								_List_Nil,
								mdgriffith$elm_ui$Element$html(
									A2(
										elm$html$Html$iframe,
										_List_fromArray(
											[
												elm$html$Html$Attributes$src(
												A2(author$project$DocumentEditorHelpers$buildYoutubeUrl, url, model)),
												elm$html$Html$Attributes$width(model.d7.hI),
												elm$html$Html$Attributes$height(model.d7.hH),
												model.fE ? author$project$DocumentEditorHelpers$noHtmlAttr : A2(elm$html$Html$Attributes$attribute, 'frameborder', '0'),
												A2(elm$html$Html$Attributes$attribute, 'allowfullscreen', 'true'),
												A2(elm$html$Html$Attributes$attribute, 'allow', 'autoplay; encrypted-media')
											]),
										_List_Nil)));
						} else {
							var _n1 = model.b8;
							if (!_n1.$) {
								var vidMeta = _n1.a;
								return A2(
									mdgriffith$elm_ui$Element$el,
									_List_Nil,
									mdgriffith$elm_ui$Element$html(
										A2(
											elm$html$Html$iframe,
											_List_fromArray(
												[
													elm$html$Html$Attributes$src(
													A2(author$project$DocumentEditorHelpers$buildYoutubeUrl, vidMeta.d9, model)),
													elm$html$Html$Attributes$width(model.d7.hI),
													elm$html$Html$Attributes$height(model.d7.hH),
													model.fE ? author$project$DocumentEditorHelpers$noHtmlAttr : A2(elm$html$Html$Attributes$attribute, 'frameborder', '0'),
													A2(elm$html$Html$Attributes$attribute, 'allowfullscreen', 'true'),
													A2(elm$html$Html$Attributes$attribute, 'allow', 'autoplay; encrypted-media')
												]),
											_List_Nil)));
							} else {
								return mdgriffith$elm_ui$Element$none;
							}
						}
					}(),
						A2(
						mdgriffith$elm_ui$Element$row,
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$spacing(15)
							]),
						_List_fromArray(
							[
								A2(
								mdgriffith$elm_ui$Element$Input$button,
								author$project$DocumentEditorHelpers$buttonStyle(true),
								{
									b4: mdgriffith$elm_ui$Element$text('Quitter'),
									cf: elm$core$Maybe$Just(author$project$VideoPlugin$Quit)
								}),
								A2(
								mdgriffith$elm_ui$Element$Input$button,
								author$project$DocumentEditorHelpers$buttonStyle(true),
								{
									b4: mdgriffith$elm_ui$Element$text('Valider et Quitter'),
									cf: elm$core$Maybe$Just(author$project$VideoPlugin$SaveAndQuit)
								})
							]))
					])));
	});
var author$project$Editor$pluginView = F2(
	function (model, plugin) {
		switch (plugin) {
			case 0:
				return A2(
					author$project$ImagePlugin$view,
					{fx: author$project$Editor$ImagePluginMsg, gA: _List_Nil},
					model.aA);
			case 2:
				return author$project$TablePlugin$view(model.aL);
			case 3:
				return A2(
					mdgriffith$elm_ui$Element$el,
					_List_Nil,
					mdgriffith$elm_ui$Element$text('Nothing  here yet!'));
			case 4:
				return A2(author$project$TextBlockPlugin$view, model.aM, model.l);
			case 5:
				return author$project$NewDocPlugin$view(
					{
						fg: author$project$Editor$CreateNewCell,
						fh: author$project$Editor$CreateNewContainer,
						fH: author$project$Editor$SetEditorPlugin(elm$core$Maybe$Nothing),
						m: model.m
					});
			case 6:
				var _n1 = author$project$DocumentZipper$extractDoc(model.a);
				if (!_n1.$) {
					var cv = _n1.a;
					return author$project$ContainerEditPlugin$view(
						{
							aU: cv.ak,
							fH: author$project$Editor$SetEditorPlugin(elm$core$Maybe$Nothing),
							cV: author$project$Editor$SwapContainerType
						});
				} else {
					return mdgriffith$elm_ui$Element$text('Aucun containeur sélectionné');
				}
			case 1:
				return A2(author$project$VideoPlugin$view, _List_Nil, model.aO);
			case 7:
				return author$project$PersistencePlugin$view(
					{
						e_: author$project$Editor$ClearLocalStorage,
						a: author$project$DocumentZipper$extractDoc(
							author$project$DocumentZipper$rewind(model.a)),
						fG: author$project$Editor$GetFromLocalStorage,
						aZ: model.aZ,
						f7: author$project$Editor$LoadDocument,
						ap: model.ap,
						by: model.by,
						ad: model.ad,
						gl: author$project$Editor$NoOp,
						gG: author$project$Editor$PutInLocalStorage,
						gH: author$project$Editor$RemoveFromLocalStorage,
						gS: author$project$Editor$SetEditorPlugin,
						gT: author$project$Editor$SetJsonBuffer,
						gU: author$project$Editor$SetLocalStorageKey,
						gV: author$project$Editor$SetLocalStorageValue
					});
			default:
				return A2(
					author$project$FilesysPlugin$view,
					{gc: model.l.fL - model.l.f9},
					model.bw);
		}
	});
var mdgriffith$elm_ui$Internal$Model$OnlyDynamic = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var mdgriffith$elm_ui$Internal$Model$StaticRootAndDynamic = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var mdgriffith$elm_ui$Internal$Model$AllowHover = 1;
var mdgriffith$elm_ui$Internal$Model$Layout = 1;
var mdgriffith$elm_ui$Internal$Model$focusDefaultStyle = {
	eD: elm$core$Maybe$Nothing,
	eK: elm$core$Maybe$Nothing,
	gW: elm$core$Maybe$Just(
		{
			eH: 3,
			e4: A4(mdgriffith$elm_ui$Internal$Model$Rgba, 155 / 255, 203 / 255, 1, 1),
			gn: _Utils_Tuple2(0, 0),
			d7: 3
		})
};
var mdgriffith$elm_ui$Internal$Model$optionsToRecord = function (options) {
	var combine = F2(
		function (opt, record) {
			switch (opt.$) {
				case 0:
					var hoverable = opt.a;
					var _n4 = record.fO;
					if (_n4.$ === 1) {
						return _Utils_update(
							record,
							{
								fO: elm$core$Maybe$Just(hoverable)
							});
					} else {
						return record;
					}
				case 1:
					var focusStyle = opt.a;
					var _n5 = record.fC;
					if (_n5.$ === 1) {
						return _Utils_update(
							record,
							{
								fC: elm$core$Maybe$Just(focusStyle)
							});
					} else {
						return record;
					}
				default:
					var renderMode = opt.a;
					var _n6 = record.ar;
					if (_n6.$ === 1) {
						return _Utils_update(
							record,
							{
								ar: elm$core$Maybe$Just(renderMode)
							});
					} else {
						return record;
					}
			}
		});
	var andFinally = function (record) {
		return {
			fC: function () {
				var _n0 = record.fC;
				if (_n0.$ === 1) {
					return mdgriffith$elm_ui$Internal$Model$focusDefaultStyle;
				} else {
					var focusable = _n0.a;
					return focusable;
				}
			}(),
			fO: function () {
				var _n1 = record.fO;
				if (_n1.$ === 1) {
					return 1;
				} else {
					var hoverable = _n1.a;
					return hoverable;
				}
			}(),
			ar: function () {
				var _n2 = record.ar;
				if (_n2.$ === 1) {
					return 1;
				} else {
					var actualMode = _n2.a;
					return actualMode;
				}
			}()
		};
	};
	return andFinally(
		A3(
			elm$core$List$foldr,
			combine,
			{fC: elm$core$Maybe$Nothing, fO: elm$core$Maybe$Nothing, ar: elm$core$Maybe$Nothing},
			options));
};
var mdgriffith$elm_ui$Internal$Model$toHtml = F2(
	function (mode, el) {
		switch (el.$) {
			case 0:
				var html = el.a;
				return html(mdgriffith$elm_ui$Internal$Model$asEl);
			case 1:
				var styles = el.a.g9;
				var html = el.a.fP;
				return A2(
					html,
					mode(styles),
					mdgriffith$elm_ui$Internal$Model$asEl);
			case 2:
				var text = el.a;
				return mdgriffith$elm_ui$Internal$Model$textElement(text);
			default:
				return mdgriffith$elm_ui$Internal$Model$textElement('');
		}
	});
var mdgriffith$elm_ui$Internal$Model$renderRoot = F3(
	function (optionList, attributes, child) {
		var options = mdgriffith$elm_ui$Internal$Model$optionsToRecord(optionList);
		var embedStyle = function () {
			var _n0 = options.ar;
			if (_n0 === 2) {
				return mdgriffith$elm_ui$Internal$Model$OnlyDynamic(options);
			} else {
				return mdgriffith$elm_ui$Internal$Model$StaticRootAndDynamic(options);
			}
		}();
		return A2(
			mdgriffith$elm_ui$Internal$Model$toHtml,
			embedStyle,
			A4(
				mdgriffith$elm_ui$Internal$Model$element,
				mdgriffith$elm_ui$Internal$Model$asEl,
				mdgriffith$elm_ui$Internal$Model$div,
				attributes,
				mdgriffith$elm_ui$Internal$Model$Unkeyed(
					_List_fromArray(
						[child]))));
	});
var mdgriffith$elm_ui$Internal$Model$SansSerif = {$: 1};
var mdgriffith$elm_ui$Internal$Model$rootStyle = function () {
	var families = _List_fromArray(
		[
			mdgriffith$elm_ui$Internal$Model$Typeface('Open Sans'),
			mdgriffith$elm_ui$Internal$Model$Typeface('Helvetica'),
			mdgriffith$elm_ui$Internal$Model$Typeface('Verdana'),
			mdgriffith$elm_ui$Internal$Model$SansSerif
		]);
	return _List_fromArray(
		[
			A2(
			mdgriffith$elm_ui$Internal$Model$StyleClass,
			mdgriffith$elm_ui$Internal$Flag$bgColor,
			A3(
				mdgriffith$elm_ui$Internal$Model$Colored,
				'bg-color-' + mdgriffith$elm_ui$Internal$Model$formatColorClass(
					A4(mdgriffith$elm_ui$Internal$Model$Rgba, 1, 1, 1, 0)),
				'background-color',
				A4(mdgriffith$elm_ui$Internal$Model$Rgba, 1, 1, 1, 0))),
			A2(
			mdgriffith$elm_ui$Internal$Model$StyleClass,
			mdgriffith$elm_ui$Internal$Flag$fontColor,
			A3(
				mdgriffith$elm_ui$Internal$Model$Colored,
				'font-color-' + mdgriffith$elm_ui$Internal$Model$formatColorClass(
					A4(mdgriffith$elm_ui$Internal$Model$Rgba, 0, 0, 0, 1)),
				'color',
				A4(mdgriffith$elm_ui$Internal$Model$Rgba, 0, 0, 0, 1))),
			A2(
			mdgriffith$elm_ui$Internal$Model$StyleClass,
			mdgriffith$elm_ui$Internal$Flag$fontSize,
			mdgriffith$elm_ui$Internal$Model$FontSize(20)),
			A2(
			mdgriffith$elm_ui$Internal$Model$StyleClass,
			mdgriffith$elm_ui$Internal$Flag$fontFamily,
			A2(
				mdgriffith$elm_ui$Internal$Model$FontFamily,
				A3(elm$core$List$foldl, mdgriffith$elm_ui$Internal$Model$renderFontClassName, 'font-', families),
				families))
		]);
}();
var mdgriffith$elm_ui$Element$layoutWith = F3(
	function (_n0, attrs, child) {
		var options = _n0.gv;
		return A3(
			mdgriffith$elm_ui$Internal$Model$renderRoot,
			options,
			A2(
				elm$core$List$cons,
				mdgriffith$elm_ui$Internal$Model$htmlClass(
					A2(
						elm$core$String$join,
						' ',
						_List_fromArray(
							[mdgriffith$elm_ui$Internal$Style$classes.cT, mdgriffith$elm_ui$Internal$Style$classes.eA, mdgriffith$elm_ui$Internal$Style$classes.gY]))),
				_Utils_ap(mdgriffith$elm_ui$Internal$Model$rootStyle, attrs)),
			child);
	});
var mdgriffith$elm_ui$Element$layout = mdgriffith$elm_ui$Element$layoutWith(
	{gv: _List_Nil});
var author$project$Editor$view = function (model) {
	return {
		eI: _List_fromArray(
			[
				A2(
				mdgriffith$elm_ui$Element$layout,
				_List_Nil,
				A2(
					mdgriffith$elm_ui$Element$column,
					_Utils_ap(
						_List_fromArray(
							[
								mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill),
								mdgriffith$elm_ui$Element$height(
								A2(mdgriffith$elm_ui$Element$maximum, model.l.fL, mdgriffith$elm_ui$Element$fill))
							]),
						model.a$ ? _List_fromArray(
							[
								mdgriffith$elm_ui$Element$Events$onClick(author$project$Editor$MenuClickOff)
							]) : _List_Nil),
					_List_fromArray(
						[
							author$project$Editor$mainInterface(
							{
								cs: model.a$,
								ct: _Utils_eq(model.aS, elm$core$Maybe$Nothing),
								fb: model.l.fb,
								cu: model.b9,
								cA: _Utils_eq(
									model.h,
									elm$core$Maybe$Just(8)),
								s: !_Utils_eq(model.h, elm$core$Maybe$Nothing),
								Y: model.Y,
								bD: author$project$Document$isContainer(
									author$project$DocumentZipper$extractDoc(model.a)),
								ag: _Utils_eq(
									author$project$DocumentZipper$zipUp(model.a),
									elm$core$Maybe$Nothing),
								cX: _Utils_eq(model.au, _List_Nil)
							}),
							A2(
							mdgriffith$elm_ui$Element$row,
							_List_fromArray(
								[
									mdgriffith$elm_ui$Element$width(mdgriffith$elm_ui$Element$fill),
									mdgriffith$elm_ui$Element$clip,
									mdgriffith$elm_ui$Element$htmlAttribute(
									A2(elm$html$Html$Attributes$style, 'flex-shrink', '1')),
									mdgriffith$elm_ui$Element$height(mdgriffith$elm_ui$Element$fill)
								]),
							_List_fromArray(
								[
									A3(
									author$project$DocumentStructView$documentStructView,
									{
										fc: model.l.fb,
										dv: _Utils_eq(model.h, elm$core$Maybe$Nothing),
										em: author$project$Editor$ZipToUid
									},
									author$project$Document$getUid(
										author$project$DocumentZipper$extractDoc(model.a)),
									author$project$DocumentZipper$extractDoc(
										author$project$DocumentZipper$rewind(model.a))),
									function () {
									var _n0 = model.h;
									if (_n0.$ === 1) {
										return author$project$Editor$documentView(model);
									} else {
										var plugin = _n0.a;
										return A2(author$project$Editor$pluginView, model, plugin);
									}
								}()
								]))
						])))
			]),
		hz: 'editor'
	};
};
var author$project$SampleDocs$emptyDoc = A2(
	author$project$Document$Container,
	{
		p: _List_Nil,
		ak: 0,
		c: {
			aj: elm$core$Set$fromList(_List_Nil),
			al: elm$core$Maybe$Just('root'),
			ao: elm$core$Maybe$Just('mainContainer'),
			bc: 0
		}
	},
	_List_fromArray(
		[
			author$project$Document$Cell(
			{
				p: _List_Nil,
				aa: author$project$Document$EmptyCell,
				c: {
					aj: elm$core$Set$fromList(_List_Nil),
					al: elm$core$Maybe$Nothing,
					ao: elm$core$Maybe$Nothing,
					bc: 1
				}
			})
		]));
var elm$browser$Browser$document = _Browser_document;
var author$project$Editor$main = elm$browser$Browser$document(
	{
		fZ: author$project$Editor$init(author$project$SampleDocs$emptyDoc),
		hb: author$project$Editor$subscriptions,
		hF: author$project$Editor$update,
		hJ: author$project$Editor$view
	});
_Platform_export({'Editor':{'init':author$project$Editor$main(
	elm$json$Json$Decode$succeed(0))(0)}});}(this));