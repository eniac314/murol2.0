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
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
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

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File === 'function' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
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

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
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
	if (region.j.cQ === region.fm.cQ)
	{
		return 'on line ' + region.j.cQ;
	}
	return 'on lines ' + region.j.cQ + ' through ' + region.fm.cQ;
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
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
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
	if (typeof x.$ === 'undefined')
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
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
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
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



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
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
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
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
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
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
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
	return $elm$json$Json$Decode$errorToString(error);
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

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
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
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
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
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
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
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
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

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
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
		impl.iM,
		impl.k3,
		impl.kC,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
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

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

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
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
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
		cT: func(record.cT),
		eU: record.eU,
		eI: record.eI
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
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
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

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.cT;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.eU;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.eI) && event.preventDefault(),
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
		impl.iM,
		impl.k3,
		impl.kC,
		function(sendToApp, initialModel) {
			var view = impl.k7;
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
		impl.iM,
		impl.k3,
		impl.kC,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.eQ && impl.eQ(sendToApp)
			var view = impl.k7;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.d8);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.d0) && (_VirtualDom_doc.title = title = doc.d0);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


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
	var onUrlChange = impl.jw;
	var onUrlRequest = impl.jx;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		eQ: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.gd === next.gd
							&& curr.fC === next.fC
							&& curr.f9.a === next.f9.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		iM: function(flags)
		{
			return A3(impl.iM, flags, _Browser_getUrl(), key);
		},
		k7: impl.k7,
		k3: impl.k3,
		kC: impl.kC
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
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
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { iv: 'hidden', hu: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { iv: 'mozHidden', hu: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { iv: 'msHidden', hu: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { iv: 'webkitHidden', hu: 'webkitvisibilitychange' }
		: { iv: 'hidden', hu: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
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
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
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
		gm: _Browser_getScene(),
		gM: {
			_: _Browser_window.pageXOffset,
			ld: _Browser_window.pageYOffset,
			lb: _Browser_doc.documentElement.clientWidth,
			iu: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		lb: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		iu: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
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
			gm: {
				lb: node.scrollWidth,
				iu: node.scrollHeight
			},
			gM: {
				_: node.scrollLeft,
				ld: node.scrollTop,
				lb: node.clientWidth,
				iu: node.clientHeight
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
			gm: _Browser_getScene(),
			gM: {
				_: x,
				ld: y,
				lb: _Browser_doc.documentElement.clientWidth,
				iu: _Browser_doc.documentElement.clientHeight
			},
			h2: {
				_: x + rect.left,
				ld: y + rect.top,
				lb: rect.width,
				iu: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
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



// SEND REQUEST

var _Http_toTask = F3(function(router, toTask, request)
{
	return _Scheduler_binding(function(callback)
	{
		function done(response) {
			callback(toTask(request.cJ.a(response)));
		}

		var xhr = new XMLHttpRequest();
		xhr.addEventListener('error', function() { done($elm$http$Http$NetworkError_); });
		xhr.addEventListener('timeout', function() { done($elm$http$Http$Timeout_); });
		xhr.addEventListener('load', function() { done(_Http_toResponse(request.cJ.b, xhr)); });
		$elm$core$Maybe$isJust(request.gF) && _Http_track(router, xhr, request.gF.a);

		try {
			xhr.open(request.i4, request.da, true);
		} catch (e) {
			return done($elm$http$Http$BadUrl_(request.da));
		}

		_Http_configureRequest(xhr, request);

		request.d8.a && xhr.setRequestHeader('Content-Type', request.d8.a);
		xhr.send(request.d8.b);

		return function() { xhr.c = true; xhr.abort(); };
	});
});


// CONFIGURE

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.ir; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}
	xhr.timeout = request.k1.a || 0;
	xhr.responseType = request.cJ.d;
	xhr.withCredentials = request.g3;
}


// RESPONSES

function _Http_toResponse(toBody, xhr)
{
	return A2(
		200 <= xhr.status && xhr.status < 300 ? $elm$http$Http$GoodStatus_ : $elm$http$Http$BadStatus_,
		_Http_toMetadata(xhr),
		toBody(xhr.response)
	);
}


// METADATA

function _Http_toMetadata(xhr)
{
	return {
		da: xhr.responseURL,
		kv: xhr.status,
		kw: xhr.statusText,
		ir: _Http_parseHeaders(xhr.getAllResponseHeaders())
	};
}


// HEADERS

function _Http_parseHeaders(rawHeaders)
{
	if (!rawHeaders)
	{
		return $elm$core$Dict$empty;
	}

	var headers = $elm$core$Dict$empty;
	var headerPairs = rawHeaders.split('\r\n');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf(': ');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3($elm$core$Dict$update, key, function(oldValue) {
				return $elm$core$Maybe$Just($elm$core$Maybe$isJust(oldValue)
					? value + ', ' + oldValue.a
					: value
				);
			}, headers);
		}
	}
	return headers;
}


// EXPECT

var _Http_expect = F3(function(type, toBody, toValue)
{
	return {
		$: 0,
		d: type,
		b: toBody,
		a: toValue
	};
});

var _Http_mapExpect = F2(function(func, expect)
{
	return {
		$: 0,
		d: expect.d,
		b: expect.b,
		a: function(x) { return func(expect.a(x)); }
	};
});

function _Http_toDataView(arrayBuffer)
{
	return new DataView(arrayBuffer);
}


// BODY and PARTS

var _Http_emptyBody = { $: 0 };
var _Http_pair = F2(function(a, b) { return { $: 0, a: a, b: b }; });

function _Http_toFormData(parts)
{
	for (var formData = new FormData(); parts.b; parts = parts.b) // WHILE_CONS
	{
		var part = parts.a;
		formData.append(part.a, part.b);
	}
	return formData;
}

var _Http_bytesToBlob = F2(function(mime, bytes)
{
	return new Blob([bytes], { type: mime });
});


// PROGRESS

function _Http_track(router, xhr, tracker)
{
	// TODO check out lengthComputable on loadstart event

	xhr.upload.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Sending({
			cs: event.loaded,
			eS: event.total
		}))));
	});
	xhr.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Receiving({
			jQ: event.loaded,
			eS: event.lengthComputable ? $elm$core$Maybe$Just(event.total) : $elm$core$Maybe$Nothing
		}))));
	});
}


function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}


function _Url_percentEncode(string)
{
	return encodeURIComponent(string);
}

function _Url_percentDecode(string)
{
	try
	{
		return $elm$core$Maybe$Just(decodeURIComponent(string));
	}
	catch (e)
	{
		return $elm$core$Maybe$Nothing;
	}
}var $author$project$Murol$ChangeUrl = function (a) {
	return {$: 0, a: a};
};
var $author$project$Murol$ClickedLink = function (a) {
	return {$: 1, a: a};
};
var $elm$core$List$cons = _List_cons;
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Dict$foldr = F3(
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
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
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
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
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
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
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
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
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
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.y) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.E),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.E);
		} else {
			var treeLen = builder.y * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.H) : builder.H;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.y);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.E) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.E);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{H: nodeList, y: (len / $elm$core$Array$branchFactor) | 0, E: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
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
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
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
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {ft: fragment, fC: host, D: path, f9: port_, gd: protocol, ge: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
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
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
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
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$application = _Browser_application;
var $elm$json$Json$Decode$field = _Json_decodeField;
var $author$project$Murol$ContactMsg = function (a) {
	return {$: 19, a: a};
};
var $author$project$Murol$HGmsg = function (a) {
	return {$: 20, a: a};
};
var $author$project$Murol$LoadPublications = function (a) {
	return {$: 6, a: a};
};
var $author$project$Document$DocumentViews$StyleSheets$PreviewScreen = 1;
var $author$project$Murol$SetSeason = function (a) {
	return {$: 12, a: a};
};
var $author$project$Murol$SetTime = function (a) {
	return {$: 11, a: a};
};
var $author$project$Murol$SetZone = function (a) {
	return {$: 18, a: a};
};
var $author$project$Murol$Standby = 0;
var $author$project$Murol$ToogleFiche = function (a) {
	return {$: 14, a: a};
};
var $author$project$Murol$ToogleNews = function (a) {
	return {$: 15, a: a};
};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Set$Set_elm_builtin = $elm$core$Basics$identity;
var $elm$core$Set$empty = $elm$core$Dict$empty;
var $elm$random$Random$Generator = $elm$core$Basics$identity;
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$random$Random$Seed = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$random$Random$next = function (_v0) {
	var state0 = _v0.a;
	var incr = _v0.b;
	return A2($elm$random$Random$Seed, ((state0 * 1664525) + incr) >>> 0, incr);
};
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $elm$random$Random$peel = function (_v0) {
	var state = _v0.a;
	var word = (state ^ (state >>> ((state >>> 28) + 4))) * 277803737;
	return ((word >>> 22) ^ word) >>> 0;
};
var $elm$random$Random$float = F2(
	function (a, b) {
		return function (seed0) {
			var seed1 = $elm$random$Random$next(seed0);
			var range = $elm$core$Basics$abs(b - a);
			var n1 = $elm$random$Random$peel(seed1);
			var n0 = $elm$random$Random$peel(seed0);
			var lo = (134217727 & n1) * 1.0;
			var hi = (67108863 & n0) * 1.0;
			var val = ((hi * 134217728.0) + lo) / 9007199254740992.0;
			var scaled = (val * range) + a;
			return _Utils_Tuple2(
				scaled,
				$elm$random$Random$next(seed1));
		};
	});
var $author$project$Document$Document$Publications = F3(
	function (murolInfos, delibs, bulletins) {
		return {hm: bulletins, hV: delibs, jb: murolInfos};
	});
var $author$project$Document$Document$BulletinMeta = F4(
	function (issue, date, cover, index) {
		return {hM: cover, cI: date, iL: index, fG: issue};
	});
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			$elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var $elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3($elm$core$String$repeatHelp, n, chunk, '');
	});
var $elm$core$String$padLeft = F3(
	function (n, _char, string) {
		return _Utils_ap(
			A2(
				$elm$core$String$repeat,
				n - $elm$core$String$length(string),
				$elm$core$String$fromChar(_char)),
			string);
	});
var $author$project$Publications$Publications$coverFilename = function (n) {
	return function (s) {
		return '/baseDocumentaire/publications/bulletins/miniatures/' + (s + '.jpg');
	}(
		A3(
			$elm$core$String$padLeft,
			3,
			'0',
			$elm$core$String$fromInt(n)));
};
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$json$Json$Decode$list = _Json_decodeList;
var $elm$json$Json$Decode$map4 = _Json_map4;
var $elm$time$Time$Posix = $elm$core$Basics$identity;
var $elm$time$Time$millisToPosix = $elm$core$Basics$identity;
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Publications$Publications$decodeBulletin = function () {
	var decodeIndexEntry = A3(
		$elm$json$Json$Decode$map2,
		$elm$core$Tuple$pair,
		A2($elm$json$Json$Decode$field, 'topic', $elm$json$Json$Decode$string),
		A2($elm$json$Json$Decode$field, 'page', $elm$json$Json$Decode$int));
	return A5(
		$elm$json$Json$Decode$map4,
		$author$project$Document$Document$BulletinMeta,
		A2($elm$json$Json$Decode$field, 'issue', $elm$json$Json$Decode$int),
		A2(
			$elm$json$Json$Decode$field,
			'date',
			A2($elm$json$Json$Decode$map, $elm$time$Time$millisToPosix, $elm$json$Json$Decode$int)),
		A2(
			$elm$json$Json$Decode$map,
			$author$project$Publications$Publications$coverFilename,
			A2($elm$json$Json$Decode$field, 'issue', $elm$json$Json$Decode$int)),
		A2(
			$elm$json$Json$Decode$field,
			'index',
			$elm$json$Json$Decode$list(decodeIndexEntry)));
}();
var $author$project$Document$Document$DelibMeta = F2(
	function (date, topics) {
		return {cI: date, gD: topics};
	});
var $author$project$Publications$Publications$decodeDelib = A3(
	$elm$json$Json$Decode$map2,
	$author$project$Document$Document$DelibMeta,
	A2(
		$elm$json$Json$Decode$field,
		'date',
		A2($elm$json$Json$Decode$map, $elm$time$Time$millisToPosix, $elm$json$Json$Decode$int)),
	A2(
		$elm$json$Json$Decode$field,
		'topics',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string)));
var $author$project$Document$Document$MurolInfoMeta = F3(
	function (issue, date, topics) {
		return {cI: date, fG: issue, gD: topics};
	});
var $elm$json$Json$Decode$map3 = _Json_map3;
var $author$project$Publications$Publications$decodeMurolInfo = A4(
	$elm$json$Json$Decode$map3,
	$author$project$Document$Document$MurolInfoMeta,
	A2($elm$json$Json$Decode$field, 'issue', $elm$json$Json$Decode$int),
	A2(
		$elm$json$Json$Decode$field,
		'date',
		A2($elm$json$Json$Decode$map, $elm$time$Time$millisToPosix, $elm$json$Json$Decode$int)),
	A2(
		$elm$json$Json$Decode$field,
		'topics',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string)));
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0;
	return millis;
};
var $author$project$Publications$Publications$decodePublications = A4(
	$elm$json$Json$Decode$map3,
	$author$project$Document$Document$Publications,
	A2(
		$elm$json$Json$Decode$field,
		'murolInfos',
		A2(
			$elm$json$Json$Decode$map,
			$elm$core$Dict$fromList,
			A2(
				$elm$json$Json$Decode$map,
				$elm$core$List$map(
					function (mi) {
						return _Utils_Tuple2(mi.fG, mi);
					}),
				$elm$json$Json$Decode$list($author$project$Publications$Publications$decodeMurolInfo)))),
	A2(
		$elm$json$Json$Decode$field,
		'delibs',
		A2(
			$elm$json$Json$Decode$map,
			$elm$core$Dict$fromList,
			A2(
				$elm$json$Json$Decode$map,
				$elm$core$List$map(
					function (d) {
						return _Utils_Tuple2(
							$elm$time$Time$posixToMillis(d.cI),
							d);
					}),
				$elm$json$Json$Decode$list($author$project$Publications$Publications$decodeDelib)))),
	A2(
		$elm$json$Json$Decode$field,
		'bulletins',
		A2(
			$elm$json$Json$Decode$map,
			$elm$core$Dict$fromList,
			A2(
				$elm$json$Json$Decode$map,
				$elm$core$List$map(
					function (b) {
						return _Utils_Tuple2(b.fG, b);
					}),
				$elm$json$Json$Decode$list($author$project$Publications$Publications$decodeBulletin)))));
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $elm$http$Http$BadStatus_ = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$http$Http$BadUrl_ = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$GoodStatus_ = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $elm$http$Http$NetworkError_ = {$: 2};
var $elm$http$Http$Receiving = function (a) {
	return {$: 1, a: a};
};
var $elm$http$Http$Sending = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$Timeout_ = {$: 1};
var $elm$core$Maybe$isJust = function (maybe) {
	if (!maybe.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
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
var $elm$core$Dict$getMin = function (dict) {
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
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
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
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === -1) {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === -1) {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === -1) {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (!_v0.$) {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$http$Http$expectStringResponse = F2(
	function (toMsg, toResult) {
		return A3(
			_Http_expect,
			'',
			$elm$core$Basics$identity,
			A2($elm$core$Basics$composeR, toResult, toMsg));
	});
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (!result.$) {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $elm$http$Http$BadBody = function (a) {
	return {$: 4, a: a};
};
var $elm$http$Http$BadStatus = function (a) {
	return {$: 3, a: a};
};
var $elm$http$Http$BadUrl = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$NetworkError = {$: 2};
var $elm$http$Http$Timeout = {$: 1};
var $elm$http$Http$resolve = F2(
	function (toResult, response) {
		switch (response.$) {
			case 0:
				var url = response.a;
				return $elm$core$Result$Err(
					$elm$http$Http$BadUrl(url));
			case 1:
				return $elm$core$Result$Err($elm$http$Http$Timeout);
			case 2:
				return $elm$core$Result$Err($elm$http$Http$NetworkError);
			case 3:
				var metadata = response.a;
				return $elm$core$Result$Err(
					$elm$http$Http$BadStatus(metadata.kv));
			default:
				var body = response.b;
				return A2(
					$elm$core$Result$mapError,
					$elm$http$Http$BadBody,
					toResult(body));
		}
	});
var $elm$http$Http$expectJson = F2(
	function (toMsg, decoder) {
		return A2(
			$elm$http$Http$expectStringResponse,
			toMsg,
			$elm$http$Http$resolve(
				function (string) {
					return A2(
						$elm$core$Result$mapError,
						$elm$json$Json$Decode$errorToString,
						A2($elm$json$Json$Decode$decodeString, decoder, string));
				}));
	});
var $elm$http$Http$jsonBody = function (value) {
	return A2(
		_Http_pair,
		'application/json',
		A2($elm$json$Json$Encode$encode, 0, value));
};
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(0),
			pairs));
};
var $elm$http$Http$Request = function (a) {
	return {$: 1, a: a};
};
var $elm$http$Http$State = F2(
	function (reqs, subs) {
		return {gg: reqs, gx: subs};
	});
var $elm$http$Http$init = $elm$core$Task$succeed(
	A2($elm$http$Http$State, $elm$core$Dict$empty, _List_Nil));
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$http$Http$updateReqs = F3(
	function (router, cmds, reqs) {
		updateReqs:
		while (true) {
			if (!cmds.b) {
				return $elm$core$Task$succeed(reqs);
			} else {
				var cmd = cmds.a;
				var otherCmds = cmds.b;
				if (!cmd.$) {
					var tracker = cmd.a;
					var _v2 = A2($elm$core$Dict$get, tracker, reqs);
					if (_v2.$ === 1) {
						var $temp$router = router,
							$temp$cmds = otherCmds,
							$temp$reqs = reqs;
						router = $temp$router;
						cmds = $temp$cmds;
						reqs = $temp$reqs;
						continue updateReqs;
					} else {
						var pid = _v2.a;
						return A2(
							$elm$core$Task$andThen,
							function (_v3) {
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A2($elm$core$Dict$remove, tracker, reqs));
							},
							$elm$core$Process$kill(pid));
					}
				} else {
					var req = cmd.a;
					return A2(
						$elm$core$Task$andThen,
						function (pid) {
							var _v4 = req.gF;
							if (_v4.$ === 1) {
								return A3($elm$http$Http$updateReqs, router, otherCmds, reqs);
							} else {
								var tracker = _v4.a;
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A3($elm$core$Dict$insert, tracker, pid, reqs));
							}
						},
						$elm$core$Process$spawn(
							A3(
								_Http_toTask,
								router,
								$elm$core$Platform$sendToApp(router),
								req)));
				}
			}
		}
	});
var $elm$http$Http$onEffects = F4(
	function (router, cmds, subs, state) {
		return A2(
			$elm$core$Task$andThen,
			function (reqs) {
				return $elm$core$Task$succeed(
					A2($elm$http$Http$State, reqs, subs));
			},
			A3($elm$http$Http$updateReqs, router, cmds, state.gg));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$http$Http$maybeSend = F4(
	function (router, desiredTracker, progress, _v0) {
		var actualTracker = _v0.a;
		var toMsg = _v0.b;
		return _Utils_eq(desiredTracker, actualTracker) ? $elm$core$Maybe$Just(
			A2(
				$elm$core$Platform$sendToApp,
				router,
				toMsg(progress))) : $elm$core$Maybe$Nothing;
	});
var $elm$http$Http$onSelfMsg = F3(
	function (router, _v0, state) {
		var tracker = _v0.a;
		var progress = _v0.b;
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$filterMap,
					A3($elm$http$Http$maybeSend, router, tracker, progress),
					state.gx)));
	});
var $elm$http$Http$Cancel = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$cmdMap = F2(
	function (func, cmd) {
		if (!cmd.$) {
			var tracker = cmd.a;
			return $elm$http$Http$Cancel(tracker);
		} else {
			var r = cmd.a;
			return $elm$http$Http$Request(
				{
					g3: r.g3,
					d8: r.d8,
					cJ: A2(_Http_mapExpect, func, r.cJ),
					ir: r.ir,
					i4: r.i4,
					k1: r.k1,
					gF: r.gF,
					da: r.da
				});
		}
	});
var $elm$http$Http$MySub = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$http$Http$subMap = F2(
	function (func, _v0) {
		var tracker = _v0.a;
		var toMsg = _v0.b;
		return A2(
			$elm$http$Http$MySub,
			tracker,
			A2($elm$core$Basics$composeR, toMsg, func));
	});
_Platform_effectManagers['Http'] = _Platform_createManager($elm$http$Http$init, $elm$http$Http$onEffects, $elm$http$Http$onSelfMsg, $elm$http$Http$cmdMap, $elm$http$Http$subMap);
var $elm$http$Http$command = _Platform_leaf('Http');
var $elm$http$Http$subscription = _Platform_leaf('Http');
var $elm$http$Http$request = function (r) {
	return $elm$http$Http$command(
		$elm$http$Http$Request(
			{g3: false, d8: r.d8, cJ: r.cJ, ir: r.ir, i4: r.i4, k1: r.k1, gF: r.gF, da: r.da}));
};
var $elm$http$Http$post = function (r) {
	return $elm$http$Http$request(
		{d8: r.d8, cJ: r.cJ, ir: _List_Nil, i4: 'POST', k1: $elm$core$Maybe$Nothing, gF: $elm$core$Maybe$Nothing, da: r.da});
};
var $author$project$Publications$Publications$getAllPublications = function (msg) {
	var body = $elm$http$Http$jsonBody(
		$elm$json$Json$Encode$object(_List_Nil));
	return $elm$http$Http$post(
		{
			d8: body,
			cJ: A2($elm$http$Http$expectJson, msg, $author$project$Publications$Publications$decodePublications),
			da: '/getAllPublications.php'
		});
};
var $author$project$Murol$LoadPages = function (a) {
	return {$: 3, a: a};
};
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $author$project$Murol$getPages = function () {
	var body = $elm$http$Http$jsonBody(
		$elm$json$Json$Encode$object(_List_Nil));
	return $elm$http$Http$post(
		{
			d8: body,
			cJ: A2($elm$http$Http$expectJson, $author$project$Murol$LoadPages, $elm$json$Json$Decode$value),
			da: '/getPageTree.php'
		});
}();
var $elm$time$Time$Name = function (a) {
	return {$: 0, a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 1, a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$here = _Time_here(0);
var $author$project$Gallery$HeaderGallery$Image = F2(
	function (src, id) {
		return {c: id, eT: src};
	});
var $elm$browser$Browser$Events$Visible = 0;
var $author$project$Internals$Streams$BiStream = F6(
	function (value, leftStr, rightStr, prev, size, index) {
		return {iL: index, cP: leftStr, bW: prev, c1: rightStr, eS: size, gJ: value};
	});
var $author$project$Internals$Streams$Stream = $elm$core$Basics$identity;
var $elm$core$Basics$modBy = _Basics_modBy;
var $author$project$Internals$Streams$tag = function (xs) {
	var go = F2(
		function (n, xs_) {
			if (!xs_.b) {
				return _List_Nil;
			} else {
				var x = xs_.a;
				var ys = xs_.b;
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(n, x),
					A2(go, n + 1, ys));
			}
		});
	return A2(go, 0, xs);
};
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Internals$Streams$cycle = F2(
	function (xs, def) {
		var l = $elm$core$List$length(xs);
		var dict = $elm$core$Dict$fromList(
			$author$project$Internals$Streams$tag(xs));
		var safeGet = function (i) {
			return A2(
				$elm$core$Maybe$withDefault,
				def,
				A2(
					$elm$core$Dict$get,
					A2($elm$core$Basics$modBy, l, i),
					dict));
		};
		var f = function (n) {
			return function (_v0) {
				return _Utils_Tuple2(
					safeGet(n),
					f(n + 1));
			};
		};
		return f(0);
	});
var $author$project$Internals$Streams$biStream = F2(
	function (xs, def) {
		if (!xs.b) {
			return A6(
				$author$project$Internals$Streams$BiStream,
				def,
				A2($author$project$Internals$Streams$cycle, _List_Nil, def),
				A2($author$project$Internals$Streams$cycle, _List_Nil, def),
				$elm$core$Maybe$Nothing,
				0,
				0);
		} else {
			var x = xs.a;
			var l = $elm$core$List$length(xs);
			var dict = $elm$core$Dict$fromList(
				$author$project$Internals$Streams$tag(xs));
			var safeGet = function (i) {
				return A2(
					$elm$core$Maybe$withDefault,
					def,
					A2(
						$elm$core$Dict$get,
						A2($elm$core$Basics$modBy, l, i),
						dict));
			};
			var leftStr = function (n) {
				return function (_v1) {
					return _Utils_Tuple2(
						safeGet(l - n),
						leftStr(n + 1));
				};
			};
			var rightStr = function (n) {
				return function (_v2) {
					return _Utils_Tuple2(
						safeGet(n),
						rightStr(n + 1));
				};
			};
			return A6(
				$author$project$Internals$Streams$BiStream,
				x,
				leftStr(1),
				rightStr(1),
				$elm$core$Maybe$Nothing,
				l,
				0);
		}
	});
var $author$project$Internals$Streams$current = function (bs) {
	return function ($) {
		return $.gJ;
	}(bs);
};
var $author$project$Internals$Streams$next = function (_v0) {
	var s = _v0;
	return s(0);
};
var $author$project$Internals$Streams$right = function (_v0) {
	var value = _v0.gJ;
	var leftStr = _v0.cP;
	var rightStr = _v0.c1;
	var prev = _v0.bW;
	var size = _v0.eS;
	var index = _v0.iL;
	var newLeft = function (_v2) {
		return _Utils_Tuple2(value, leftStr);
	};
	var _v1 = $author$project$Internals$Streams$next(rightStr);
	var newCurrent = _v1.a;
	var newRight = _v1.b;
	return A6(
		$author$project$Internals$Streams$BiStream,
		newCurrent,
		newLeft,
		newRight,
		$elm$core$Maybe$Just(value),
		size,
		A2($elm$core$Basics$modBy, size, index + 1));
};
var $author$project$Internals$Streams$chunkBiStream = F2(
	function (n, bs) {
		var value = bs.gJ;
		var leftStr = bs.cP;
		var rightStr = bs.c1;
		var prev = bs.bW;
		var size = bs.eS;
		var takeN = F3(
			function (n_, bs_, acc) {
				takeN:
				while (true) {
					if (!n_) {
						return $elm$core$List$reverse(acc);
					} else {
						var $temp$n_ = n_ - 1,
							$temp$bs_ = $author$project$Internals$Streams$right(bs_),
							$temp$acc = A2(
							$elm$core$List$cons,
							$author$project$Internals$Streams$current(bs_),
							acc);
						n_ = $temp$n_;
						bs_ = $temp$bs_;
						acc = $temp$acc;
						continue takeN;
					}
				}
			});
		var takeMChunk = F3(
			function (m, bs_, acc) {
				takeMChunk:
				while (true) {
					if (!m) {
						return $elm$core$List$reverse(acc);
					} else {
						var $temp$m = m - 1,
							$temp$bs_ = $author$project$Internals$Streams$right(bs_),
							$temp$acc = A2(
							$elm$core$List$cons,
							A3(takeN, n, bs_, _List_Nil),
							acc);
						m = $temp$m;
						bs_ = $temp$bs_;
						acc = $temp$acc;
						continue takeMChunk;
					}
				}
			});
		return A2(
			$author$project$Internals$Streams$biStream,
			A3(takeMChunk, size, bs, _List_Nil),
			_List_Nil);
	});
var $author$project$Gallery$HeaderGallery$init = F2(
	function (imgs, externalMsg) {
		var stream = A2(
			$author$project$Internals$Streams$chunkBiStream,
			3,
			function (xs) {
				return A2(
					$author$project$Internals$Streams$biStream,
					xs,
					A2($author$project$Gallery$HeaderGallery$Image, '', -1));
			}(
				A2(
					$elm$core$List$indexedMap,
					F2(
						function (n, s) {
							return A2($author$project$Gallery$HeaderGallery$Image, s, n);
						}),
					imgs)));
		return {b7: 0, cK: externalMsg, iF: stream, fO: $elm$core$Set$empty, q: $elm$core$Maybe$Nothing, aw: $elm$core$Maybe$Nothing, d2: 0};
	});
var $author$project$Internals$Contact$init = function (externalMsg) {
	return {df: false, cE: '', cF: '', h3: '', dt: '', cK: externalMsg, cT: '', C: '', c$: '', dV: false, cs: false, cB: ''};
};
var $elm$random$Random$initialSeed = function (x) {
	var _v0 = $elm$random$Random$next(
		A2($elm$random$Random$Seed, 0, 1013904223));
	var state1 = _v0.a;
	var incr = _v0.b;
	var state2 = (state1 + x) >>> 0;
	return $elm$random$Random$next(
		A2($elm$random$Random$Seed, state2, incr));
};
var $elm$random$Random$listHelp = F4(
	function (revList, n, gen, seed) {
		listHelp:
		while (true) {
			if (n < 1) {
				return _Utils_Tuple2(revList, seed);
			} else {
				var _v0 = gen(seed);
				var value = _v0.a;
				var newSeed = _v0.b;
				var $temp$revList = A2($elm$core$List$cons, value, revList),
					$temp$n = n - 1,
					$temp$gen = gen,
					$temp$seed = newSeed;
				revList = $temp$revList;
				n = $temp$n;
				gen = $temp$gen;
				seed = $temp$seed;
				continue listHelp;
			}
		}
	});
var $elm$random$Random$list = F2(
	function (n, _v0) {
		var gen = _v0;
		return function (seed) {
			return A4($elm$random$Random$listHelp, _List_Nil, n, gen, seed);
		};
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$browser$Browser$Navigation$pushUrl = _Browser_pushUrl;
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $elm$core$List$sortBy = _List_sortBy;
var $elm$random$Random$step = F2(
	function (_v0, seed) {
		var generator = _v0;
		return generator(seed);
	});
var $author$project$Document$DocumentViews$StyleSheets$Autumn = 2;
var $author$project$Document$DocumentViews$StyleSheets$Spring = 0;
var $author$project$Document$DocumentViews$StyleSheets$Summer = 1;
var $author$project$Document$DocumentViews$StyleSheets$Winter = 3;
var $elm$time$Time$flooredDiv = F2(
	function (numerator, denominator) {
		return $elm$core$Basics$floor(numerator / denominator);
	});
var $elm$time$Time$toAdjustedMinutesHelp = F3(
	function (defaultOffset, posixMinutes, eras) {
		toAdjustedMinutesHelp:
		while (true) {
			if (!eras.b) {
				return posixMinutes + defaultOffset;
			} else {
				var era = eras.a;
				var olderEras = eras.b;
				if (_Utils_cmp(era.j, posixMinutes) < 0) {
					return posixMinutes + era.js;
				} else {
					var $temp$defaultOffset = defaultOffset,
						$temp$posixMinutes = posixMinutes,
						$temp$eras = olderEras;
					defaultOffset = $temp$defaultOffset;
					posixMinutes = $temp$posixMinutes;
					eras = $temp$eras;
					continue toAdjustedMinutesHelp;
				}
			}
		}
	});
var $elm$time$Time$toAdjustedMinutes = F2(
	function (_v0, time) {
		var defaultOffset = _v0.a;
		var eras = _v0.b;
		return A3(
			$elm$time$Time$toAdjustedMinutesHelp,
			defaultOffset,
			A2(
				$elm$time$Time$flooredDiv,
				$elm$time$Time$posixToMillis(time),
				60000),
			eras);
	});
var $elm$core$Basics$ge = _Utils_ge;
var $elm$time$Time$toCivil = function (minutes) {
	var rawDay = A2($elm$time$Time$flooredDiv, minutes, 60 * 24) + 719468;
	var era = (((rawDay >= 0) ? rawDay : (rawDay - 146096)) / 146097) | 0;
	var dayOfEra = rawDay - (era * 146097);
	var yearOfEra = ((((dayOfEra - ((dayOfEra / 1460) | 0)) + ((dayOfEra / 36524) | 0)) - ((dayOfEra / 146096) | 0)) / 365) | 0;
	var dayOfYear = dayOfEra - (((365 * yearOfEra) + ((yearOfEra / 4) | 0)) - ((yearOfEra / 100) | 0));
	var mp = (((5 * dayOfYear) + 2) / 153) | 0;
	var month = mp + ((mp < 10) ? 3 : (-9));
	var year = yearOfEra + (era * 400);
	return {
		fk: (dayOfYear - ((((153 * mp) + 2) / 5) | 0)) + 1,
		fR: month,
		gP: year + ((month <= 2) ? 1 : 0)
	};
};
var $elm$time$Time$toDay = F2(
	function (zone, time) {
		return $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).fk;
	});
var $elm$time$Time$Apr = 3;
var $elm$time$Time$Aug = 7;
var $elm$time$Time$Dec = 11;
var $elm$time$Time$Feb = 1;
var $elm$time$Time$Jan = 0;
var $elm$time$Time$Jul = 6;
var $elm$time$Time$Jun = 5;
var $elm$time$Time$Mar = 2;
var $elm$time$Time$May = 4;
var $elm$time$Time$Nov = 10;
var $elm$time$Time$Oct = 9;
var $elm$time$Time$Sep = 8;
var $elm$time$Time$toMonth = F2(
	function (zone, time) {
		var _v0 = $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).fR;
		switch (_v0) {
			case 1:
				return 0;
			case 2:
				return 1;
			case 3:
				return 2;
			case 4:
				return 3;
			case 5:
				return 4;
			case 6:
				return 5;
			case 7:
				return 6;
			case 8:
				return 7;
			case 9:
				return 8;
			case 10:
				return 9;
			case 11:
				return 10;
			default:
				return 11;
		}
	});
var $author$project$Document$DocumentViews$StyleSheets$timeToSeason = F2(
	function (zone, time) {
		var month = A2($elm$time$Time$toMonth, zone, time);
		var day = A2($elm$time$Time$toDay, zone, time);
		switch (month) {
			case 0:
				return 3;
			case 1:
				return 3;
			case 2:
				return (day < 21) ? 3 : 0;
			case 3:
				return 0;
			case 4:
				return 0;
			case 5:
				return (day < 21) ? 0 : 1;
			case 6:
				return 1;
			case 7:
				return 1;
			case 8:
				return (day < 21) ? 1 : 2;
			case 9:
				return 2;
			case 10:
				return 2;
			default:
				return (day < 21) ? 2 : 3;
		}
	});
var $elm$url$Url$addPort = F2(
	function (maybePort, starter) {
		if (maybePort.$ === 1) {
			return starter;
		} else {
			var port_ = maybePort.a;
			return starter + (':' + $elm$core$String$fromInt(port_));
		}
	});
var $elm$url$Url$addPrefixed = F3(
	function (prefix, maybeSegment, starter) {
		if (maybeSegment.$ === 1) {
			return starter;
		} else {
			var segment = maybeSegment.a;
			return _Utils_ap(
				starter,
				_Utils_ap(prefix, segment));
		}
	});
var $elm$url$Url$toString = function (url) {
	var http = function () {
		var _v0 = url.gd;
		if (!_v0) {
			return 'http://';
		} else {
			return 'https://';
		}
	}();
	return A3(
		$elm$url$Url$addPrefixed,
		'#',
		url.ft,
		A3(
			$elm$url$Url$addPrefixed,
			'?',
			url.ge,
			_Utils_ap(
				A2(
					$elm$url$Url$addPort,
					url.f9,
					_Utils_ap(http, url.fC)),
				url.D)));
};
var $elm$time$Time$utc = A2($elm$time$Time$Zone, 0, _List_Nil);
var $author$project$Murol$init = F3(
	function (flags, url, key) {
		var url_ = (url.D === '/') ? _Utils_update(
			url,
			{D: '/accueil'}) : url;
		var season = A2(
			$author$project$Document$DocumentViews$StyleSheets$timeToSeason,
			$elm$time$Time$utc,
			$elm$time$Time$millisToPosix(flags.hO));
		var headerGallerySize = 11;
		var contact = $author$project$Internals$Contact$init($author$project$Murol$ContactMsg);
		var config = {
			eb: false,
			hO: $elm$time$Time$millisToPosix(flags.hO),
			hR: $elm$core$Dict$empty,
			an: false,
			ie: $elm$core$Dict$empty,
			ij: $elm$core$Dict$empty,
			iu: flags.iu,
			i1: 0,
			fU: $elm$core$Dict$empty,
			jz: $author$project$Murol$ToogleFiche,
			jA: $author$project$Murol$ToogleNews,
			jB: $elm$core$Set$empty,
			f1: $elm$core$Set$empty,
			f3: $elm$core$Dict$empty,
			dT: 1,
			eK: $elm$core$Maybe$Nothing,
			j5: season,
			lb: flags.lb,
			le: $elm$core$Maybe$Nothing,
			e0: $elm$time$Time$utc
		};
		var _v0 = A2(
			$elm$random$Random$step,
			A2(
				$elm$random$Random$list,
				headerGallerySize,
				A2($elm$random$Random$float, 0, 1)),
			$elm$random$Random$initialSeed(flags.hO));
		var randomOrder = _v0.a;
		var seed = _v0.b;
		return _Utils_Tuple2(
			{
				a: config,
				b8: contact,
				ee: '',
				ch: A2(
					$author$project$Gallery$HeaderGallery$init,
					A2(
						$elm$core$List$map,
						$elm$core$Tuple$second,
						A2(
							$elm$core$List$sortBy,
							$elm$core$Tuple$first,
							A3(
								$elm$core$List$map2,
								$elm$core$Tuple$pair,
								randomOrder,
								A2(
									$elm$core$List$map,
									function (s) {
										return '/assets/images/headerGallery/' + (s + '.jpg');
									},
									A2(
										$elm$core$List$map,
										function (n) {
											return A3(
												$elm$core$String$padLeft,
												3,
												'0',
												$elm$core$String$fromInt(n));
										},
										A2($elm$core$List$range, 1, headerGallerySize)))))),
					$author$project$Murol$HGmsg),
				dy: false,
				dz: key,
				cm: $elm$core$Maybe$Nothing,
				aY: $elm$core$Dict$empty,
				dY: $elm$core$Maybe$Nothing,
				bY: 0,
				cr: '',
				j7: seed,
				c7: $elm$core$Maybe$Nothing,
				da: url_
			},
			$elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						$author$project$Murol$getPages,
						$author$project$Publications$Publications$getAllPublications($author$project$Murol$LoadPublications),
						(!_Utils_eq(url, url_)) ? A2(
						$elm$browser$Browser$Navigation$pushUrl,
						key,
						$elm$url$Url$toString(url_)) : $elm$core$Platform$Cmd$none,
						A2($elm$core$Task$perform, $author$project$Murol$SetTime, $elm$time$Time$now),
						A2($elm$core$Task$perform, $author$project$Murol$SetZone, $elm$time$Time$here),
						A2(
						$elm$core$Task$perform,
						$author$project$Murol$SetSeason,
						A2(
							$elm$core$Task$andThen,
							function (t) {
								return A2(
									$elm$core$Task$andThen,
									function (h) {
										return $elm$core$Task$succeed(
											A2($author$project$Document$DocumentViews$StyleSheets$timeToSeason, h, t));
									},
									$elm$time$Time$here);
							},
							$elm$time$Time$now))
					])));
	});
var $author$project$Murol$GalleryMsg = F2(
	function (a, b) {
		return {$: 21, a: a, b: b};
	});
var $author$project$Murol$ProcessSearchResult = function (a) {
	return {$: 10, a: a};
};
var $author$project$Murol$WinResize = F2(
	function (a, b) {
		return {$: 13, a: a, b: b};
	});
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Dict$map = F2(
	function (func, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				A2(func, key, value),
				A2($elm$core$Dict$map, func, left),
				A2($elm$core$Dict$map, func, right));
		}
	});
var $elm$core$Platform$Sub$map = _Platform_map;
var $elm$browser$Browser$Events$Window = 1;
var $elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {f7: pids, gx: subs};
	});
var $elm$browser$Browser$Events$init = $elm$core$Task$succeed(
	A2($elm$browser$Browser$Events$State, _List_Nil, $elm$core$Dict$empty));
var $elm$browser$Browser$Events$nodeToKey = function (node) {
	if (!node) {
		return 'd_';
	} else {
		return 'w_';
	}
};
var $elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			$elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var $elm$core$Dict$foldl = F3(
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
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
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
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {fo: event, dz: key};
	});
var $elm$browser$Browser$Events$spawn = F3(
	function (router, key, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var actualNode = function () {
			if (!node) {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			$elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						$elm$core$Platform$sendToSelf,
						router,
						A2($elm$browser$Browser$Events$Event, key, event));
				}));
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _v6) {
				var deads = _v6.a;
				var lives = _v6.b;
				var news = _v6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						$elm$core$List$cons,
						A3($elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_v4, pid, _v5) {
				var deads = _v5.a;
				var lives = _v5.b;
				var news = _v5.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _v2, _v3) {
				var deads = _v3.a;
				var lives = _v3.b;
				var news = _v3.c;
				return _Utils_Tuple3(
					deads,
					A3($elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2($elm$core$List$map, $elm$browser$Browser$Events$addKey, subs);
		var _v0 = A6(
			$elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.f7,
			$elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, $elm$core$Dict$empty, _List_Nil));
		var deadPids = _v0.a;
		var livePids = _v0.b;
		var makeNewPids = _v0.c;
		return A2(
			$elm$core$Task$andThen,
			function (pids) {
				return $elm$core$Task$succeed(
					A2(
						$elm$browser$Browser$Events$State,
						newSubs,
						A2(
							$elm$core$Dict$union,
							livePids,
							$elm$core$Dict$fromList(pids))));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$sequence(makeNewPids);
				},
				$elm$core$Task$sequence(
					A2($elm$core$List$map, $elm$core$Process$kill, deadPids))));
	});
var $elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _v0, state) {
		var key = _v0.dz;
		var event = _v0.fo;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.gx);
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Platform$sendToApp(router),
					messages)));
	});
var $elm$browser$Browser$Events$subMap = F2(
	function (func, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var decoder = _v0.c;
		return A3(
			$elm$browser$Browser$Events$MySub,
			node,
			name,
			A2($elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager($elm$browser$Browser$Events$init, $elm$browser$Browser$Events$onEffects, $elm$browser$Browser$Events$onSelfMsg, 0, $elm$browser$Browser$Events$subMap);
var $elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var $elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return $elm$browser$Browser$Events$subscription(
			A3($elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var $elm$browser$Browser$Events$onResize = function (func) {
	return A3(
		$elm$browser$Browser$Events$on,
		1,
		'resize',
		A2(
			$elm$json$Json$Decode$field,
			'target',
			A3(
				$elm$json$Json$Decode$map2,
				func,
				A2($elm$json$Json$Decode$field, 'innerWidth', $elm$json$Json$Decode$int),
				A2($elm$json$Json$Decode$field, 'innerHeight', $elm$json$Json$Decode$int))));
};
var $author$project$Murol$searchResult = _Platform_incomingPort('searchResult', $elm$json$Json$Decode$string);
var $author$project$Gallery$Gallery$Tick = function (a) {
	return {$: 10, a: a};
};
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $elm$browser$Browser$AnimationManager$Time = function (a) {
	return {$: 0, a: a};
};
var $elm$browser$Browser$AnimationManager$State = F3(
	function (subs, request, oldTime) {
		return {eG: oldTime, gh: request, gx: subs};
	});
var $elm$browser$Browser$AnimationManager$init = $elm$core$Task$succeed(
	A3($elm$browser$Browser$AnimationManager$State, _List_Nil, $elm$core$Maybe$Nothing, 0));
var $elm$browser$Browser$AnimationManager$now = _Browser_now(0);
var $elm$browser$Browser$AnimationManager$rAF = _Browser_rAF(0);
var $elm$browser$Browser$AnimationManager$onEffects = F3(
	function (router, subs, _v0) {
		var request = _v0.gh;
		var oldTime = _v0.eG;
		var _v1 = _Utils_Tuple2(request, subs);
		if (_v1.a.$ === 1) {
			if (!_v1.b.b) {
				var _v2 = _v1.a;
				return $elm$browser$Browser$AnimationManager$init;
			} else {
				var _v4 = _v1.a;
				return A2(
					$elm$core$Task$andThen,
					function (pid) {
						return A2(
							$elm$core$Task$andThen,
							function (time) {
								return $elm$core$Task$succeed(
									A3(
										$elm$browser$Browser$AnimationManager$State,
										subs,
										$elm$core$Maybe$Just(pid),
										time));
							},
							$elm$browser$Browser$AnimationManager$now);
					},
					$elm$core$Process$spawn(
						A2(
							$elm$core$Task$andThen,
							$elm$core$Platform$sendToSelf(router),
							$elm$browser$Browser$AnimationManager$rAF)));
			}
		} else {
			if (!_v1.b.b) {
				var pid = _v1.a.a;
				return A2(
					$elm$core$Task$andThen,
					function (_v3) {
						return $elm$browser$Browser$AnimationManager$init;
					},
					$elm$core$Process$kill(pid));
			} else {
				return $elm$core$Task$succeed(
					A3($elm$browser$Browser$AnimationManager$State, subs, request, oldTime));
			}
		}
	});
var $elm$browser$Browser$AnimationManager$onSelfMsg = F3(
	function (router, newTime, _v0) {
		var subs = _v0.gx;
		var oldTime = _v0.eG;
		var send = function (sub) {
			if (!sub.$) {
				var tagger = sub.a;
				return A2(
					$elm$core$Platform$sendToApp,
					router,
					tagger(
						$elm$time$Time$millisToPosix(newTime)));
			} else {
				var tagger = sub.a;
				return A2(
					$elm$core$Platform$sendToApp,
					router,
					tagger(newTime - oldTime));
			}
		};
		return A2(
			$elm$core$Task$andThen,
			function (pid) {
				return A2(
					$elm$core$Task$andThen,
					function (_v1) {
						return $elm$core$Task$succeed(
							A3(
								$elm$browser$Browser$AnimationManager$State,
								subs,
								$elm$core$Maybe$Just(pid),
								newTime));
					},
					$elm$core$Task$sequence(
						A2($elm$core$List$map, send, subs)));
			},
			$elm$core$Process$spawn(
				A2(
					$elm$core$Task$andThen,
					$elm$core$Platform$sendToSelf(router),
					$elm$browser$Browser$AnimationManager$rAF)));
	});
var $elm$browser$Browser$AnimationManager$Delta = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$browser$Browser$AnimationManager$subMap = F2(
	function (func, sub) {
		if (!sub.$) {
			var tagger = sub.a;
			return $elm$browser$Browser$AnimationManager$Time(
				A2($elm$core$Basics$composeL, func, tagger));
		} else {
			var tagger = sub.a;
			return $elm$browser$Browser$AnimationManager$Delta(
				A2($elm$core$Basics$composeL, func, tagger));
		}
	});
_Platform_effectManagers['Browser.AnimationManager'] = _Platform_createManager($elm$browser$Browser$AnimationManager$init, $elm$browser$Browser$AnimationManager$onEffects, $elm$browser$Browser$AnimationManager$onSelfMsg, 0, $elm$browser$Browser$AnimationManager$subMap);
var $elm$browser$Browser$AnimationManager$subscription = _Platform_leaf('Browser.AnimationManager');
var $elm$browser$Browser$AnimationManager$onAnimationFrame = function (tagger) {
	return $elm$browser$Browser$AnimationManager$subscription(
		$elm$browser$Browser$AnimationManager$Time(tagger));
};
var $elm$browser$Browser$Events$onAnimationFrame = $elm$browser$Browser$AnimationManager$onAnimationFrame;
var $author$project$Gallery$Gallery$subscriptions = function (model) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				model.b_ ? $elm$browser$Browser$Events$onAnimationFrame($author$project$Gallery$Gallery$Tick) : ((_Utils_eq(model.q, $elm$core$Maybe$Nothing) && _Utils_eq(model.aw, $elm$core$Maybe$Nothing)) ? $elm$core$Platform$Sub$none : $elm$browser$Browser$Events$onAnimationFrame($author$project$Gallery$Gallery$Tick))
			]));
};
var $author$project$Gallery$HeaderGallery$AlphaFade = 2;
var $author$project$Gallery$HeaderGallery$Animate = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$browser$Browser$Events$Hidden = 1;
var $author$project$Gallery$HeaderGallery$Tick = function (a) {
	return {$: 4, a: a};
};
var $author$project$Gallery$HeaderGallery$VisibilityChange = function (a) {
	return {$: 6, a: a};
};
var $elm$time$Time$Every = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$State = F2(
	function (taggers, processes) {
		return {gc: processes, gz: taggers};
	});
var $elm$time$Time$init = $elm$core$Task$succeed(
	A2($elm$time$Time$State, $elm$core$Dict$empty, $elm$core$Dict$empty));
var $elm$time$Time$addMySub = F2(
	function (_v0, state) {
		var interval = _v0.a;
		var tagger = _v0.b;
		var _v1 = A2($elm$core$Dict$get, interval, state);
		if (_v1.$ === 1) {
			return A3(
				$elm$core$Dict$insert,
				interval,
				_List_fromArray(
					[tagger]),
				state);
		} else {
			var taggers = _v1.a;
			return A3(
				$elm$core$Dict$insert,
				interval,
				A2($elm$core$List$cons, tagger, taggers),
				state);
		}
	});
var $elm$time$Time$setInterval = _Time_setInterval;
var $elm$time$Time$spawnHelp = F3(
	function (router, intervals, processes) {
		if (!intervals.b) {
			return $elm$core$Task$succeed(processes);
		} else {
			var interval = intervals.a;
			var rest = intervals.b;
			var spawnTimer = $elm$core$Process$spawn(
				A2(
					$elm$time$Time$setInterval,
					interval,
					A2($elm$core$Platform$sendToSelf, router, interval)));
			var spawnRest = function (id) {
				return A3(
					$elm$time$Time$spawnHelp,
					router,
					rest,
					A3($elm$core$Dict$insert, interval, id, processes));
			};
			return A2($elm$core$Task$andThen, spawnRest, spawnTimer);
		}
	});
var $elm$time$Time$onEffects = F3(
	function (router, subs, _v0) {
		var processes = _v0.gc;
		var rightStep = F3(
			function (_v6, id, _v7) {
				var spawns = _v7.a;
				var existing = _v7.b;
				var kills = _v7.c;
				return _Utils_Tuple3(
					spawns,
					existing,
					A2(
						$elm$core$Task$andThen,
						function (_v5) {
							return kills;
						},
						$elm$core$Process$kill(id)));
			});
		var newTaggers = A3($elm$core$List$foldl, $elm$time$Time$addMySub, $elm$core$Dict$empty, subs);
		var leftStep = F3(
			function (interval, taggers, _v4) {
				var spawns = _v4.a;
				var existing = _v4.b;
				var kills = _v4.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, interval, spawns),
					existing,
					kills);
			});
		var bothStep = F4(
			function (interval, taggers, id, _v3) {
				var spawns = _v3.a;
				var existing = _v3.b;
				var kills = _v3.c;
				return _Utils_Tuple3(
					spawns,
					A3($elm$core$Dict$insert, interval, id, existing),
					kills);
			});
		var _v1 = A6(
			$elm$core$Dict$merge,
			leftStep,
			bothStep,
			rightStep,
			newTaggers,
			processes,
			_Utils_Tuple3(
				_List_Nil,
				$elm$core$Dict$empty,
				$elm$core$Task$succeed(0)));
		var spawnList = _v1.a;
		var existingDict = _v1.b;
		var killTask = _v1.c;
		return A2(
			$elm$core$Task$andThen,
			function (newProcesses) {
				return $elm$core$Task$succeed(
					A2($elm$time$Time$State, newTaggers, newProcesses));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$time$Time$spawnHelp, router, spawnList, existingDict);
				},
				killTask));
	});
var $elm$time$Time$onSelfMsg = F3(
	function (router, interval, state) {
		var _v0 = A2($elm$core$Dict$get, interval, state.gz);
		if (_v0.$ === 1) {
			return $elm$core$Task$succeed(state);
		} else {
			var taggers = _v0.a;
			var tellTaggers = function (time) {
				return $elm$core$Task$sequence(
					A2(
						$elm$core$List$map,
						function (tagger) {
							return A2(
								$elm$core$Platform$sendToApp,
								router,
								tagger(time));
						},
						taggers));
			};
			return A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$succeed(state);
				},
				A2($elm$core$Task$andThen, tellTaggers, $elm$time$Time$now));
		}
	});
var $elm$time$Time$subMap = F2(
	function (f, _v0) {
		var interval = _v0.a;
		var tagger = _v0.b;
		return A2(
			$elm$time$Time$Every,
			interval,
			A2($elm$core$Basics$composeL, f, tagger));
	});
_Platform_effectManagers['Time'] = _Platform_createManager($elm$time$Time$init, $elm$time$Time$onEffects, $elm$time$Time$onSelfMsg, 0, $elm$time$Time$subMap);
var $elm$time$Time$subscription = _Platform_leaf('Time');
var $elm$time$Time$every = F2(
	function (interval, tagger) {
		return $elm$time$Time$subscription(
			A2($elm$time$Time$Every, interval, tagger));
	});
var $elm$browser$Browser$Events$Document = 0;
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $elm$browser$Browser$Events$withHidden = F2(
	function (func, isHidden) {
		return func(
			isHidden ? 1 : 0);
	});
var $elm$browser$Browser$Events$onVisibilityChange = function (func) {
	var info = _Browser_visibilityInfo(0);
	return A3(
		$elm$browser$Browser$Events$on,
		0,
		info.hu,
		A2(
			$elm$json$Json$Decode$map,
			$elm$browser$Browser$Events$withHidden(func),
			A2(
				$elm$json$Json$Decode$field,
				'target',
				A2($elm$json$Json$Decode$field, info.iv, $elm$json$Json$Decode$bool))));
};
var $author$project$Gallery$HeaderGallery$subscriptions = function (model) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				(_Utils_eq(model.q, $elm$core$Maybe$Nothing) && _Utils_eq(model.aw, $elm$core$Maybe$Nothing)) ? $elm$core$Platform$Sub$none : $elm$browser$Browser$Events$onAnimationFrame($author$project$Gallery$HeaderGallery$Tick),
				((model.d2 === 1) || ((!_Utils_eq(model.q, $elm$core$Maybe$Nothing)) || (!_Utils_eq(model.aw, $elm$core$Maybe$Nothing)))) ? $elm$core$Platform$Sub$none : A2(
				$elm$time$Time$every,
				10000,
				$author$project$Gallery$HeaderGallery$Animate(2)),
				$elm$browser$Browser$Events$onVisibilityChange($author$project$Gallery$HeaderGallery$VisibilityChange)
			]));
};
var $author$project$Internals$Contact$CaptchaResponse = function (a) {
	return {$: 7, a: a};
};
var $author$project$Internals$Contact$captcha_port = _Platform_incomingPort('captcha_port', $elm$json$Json$Decode$string);
var $author$project$Internals$Contact$subscriptions = function (model) {
	return A2(
		$elm$core$Platform$Sub$map,
		model.cK,
		$author$project$Internals$Contact$captcha_port($author$project$Internals$Contact$CaptchaResponse));
};
var $elm$core$Dict$values = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, valueList) {
				return A2($elm$core$List$cons, value, valueList);
			}),
		_List_Nil,
		dict);
};
var $author$project$Murol$subscriptions = function (model) {
	return $elm$core$Platform$Sub$batch(
		_Utils_ap(
			_List_fromArray(
				[
					$elm$browser$Browser$Events$onResize($author$project$Murol$WinResize),
					$author$project$Murol$searchResult($author$project$Murol$ProcessSearchResult),
					A2(
					$elm$core$Platform$Sub$map,
					$author$project$Murol$HGmsg,
					$author$project$Gallery$HeaderGallery$subscriptions(model.ch)),
					$author$project$Internals$Contact$subscriptions(model.b8)
				]),
			$elm$core$Dict$values(
				A2(
					$elm$core$Dict$map,
					F2(
						function (uuid, gallery) {
							return A2(
								$elm$core$Platform$Sub$map,
								$author$project$Murol$GalleryMsg(uuid),
								$author$project$Gallery$Gallery$subscriptions(gallery));
						}),
					model.a.ij))));
};
var $author$project$Murol$DisplayResult = 2;
var $author$project$Murol$Loaded = function (a) {
	return {$: 2, a: a};
};
var $author$project$Murol$Loading = {$: 1};
var $author$project$Murol$NoOp = {$: 22};
var $author$project$Murol$Searching = 1;
var $elm$core$Task$onError = _Scheduler_onError;
var $elm$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return $elm$core$Task$command(
			A2(
				$elm$core$Task$onError,
				A2(
					$elm$core$Basics$composeL,
					A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
					$elm$core$Result$Err),
				A2(
					$elm$core$Task$andThen,
					A2(
						$elm$core$Basics$composeL,
						A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
						$elm$core$Result$Ok),
					task)));
	});
var $elm_community$string_extra$String$Extra$breaker = F3(
	function (width, string, acc) {
		breaker:
		while (true) {
			if (string === '') {
				return $elm$core$List$reverse(acc);
			} else {
				var $temp$width = width,
					$temp$string = A2($elm$core$String$dropLeft, width, string),
					$temp$acc = A2(
					$elm$core$List$cons,
					A3($elm$core$String$slice, 0, width, string),
					acc);
				width = $temp$width;
				string = $temp$string;
				acc = $temp$acc;
				continue breaker;
			}
		}
	});
var $elm_community$string_extra$String$Extra$break = F2(
	function (width, string) {
		return ((!width) || (string === '')) ? _List_fromArray(
			[string]) : A3($elm_community$string_extra$String$Extra$breaker, width, string, _List_Nil);
	});
var $elm$core$String$concat = function (strings) {
	return A2($elm$core$String$join, '', strings);
};
var $elm$core$String$fromList = _String_fromList;
var $rtfeldman$elm_hex$Hex$unsafeToDigit = function (num) {
	unsafeToDigit:
	while (true) {
		switch (num) {
			case 0:
				return '0';
			case 1:
				return '1';
			case 2:
				return '2';
			case 3:
				return '3';
			case 4:
				return '4';
			case 5:
				return '5';
			case 6:
				return '6';
			case 7:
				return '7';
			case 8:
				return '8';
			case 9:
				return '9';
			case 10:
				return 'a';
			case 11:
				return 'b';
			case 12:
				return 'c';
			case 13:
				return 'd';
			case 14:
				return 'e';
			case 15:
				return 'f';
			default:
				var $temp$num = num;
				num = $temp$num;
				continue unsafeToDigit;
		}
	}
};
var $rtfeldman$elm_hex$Hex$unsafePositiveToDigits = F2(
	function (digits, num) {
		unsafePositiveToDigits:
		while (true) {
			if (num < 16) {
				return A2(
					$elm$core$List$cons,
					$rtfeldman$elm_hex$Hex$unsafeToDigit(num),
					digits);
			} else {
				var $temp$digits = A2(
					$elm$core$List$cons,
					$rtfeldman$elm_hex$Hex$unsafeToDigit(
						A2($elm$core$Basics$modBy, 16, num)),
					digits),
					$temp$num = (num / 16) | 0;
				digits = $temp$digits;
				num = $temp$num;
				continue unsafePositiveToDigits;
			}
		}
	});
var $rtfeldman$elm_hex$Hex$toString = function (num) {
	return $elm$core$String$fromList(
		(num < 0) ? A2(
			$elm$core$List$cons,
			'-',
			A2($rtfeldman$elm_hex$Hex$unsafePositiveToDigits, _List_Nil, -num)) : A2($rtfeldman$elm_hex$Hex$unsafePositiveToDigits, _List_Nil, num));
};
var $TSFoster$elm_uuid$UUID$canonical = function (_v0) {
	var bytes = _v0;
	var strings = A2(
		$elm_community$string_extra$String$Extra$break,
		4,
		$elm$core$String$concat(
			A2(
				$elm$core$List$map,
				A2($elm$core$String$padLeft, 2, '0'),
				A2($elm$core$List$map, $rtfeldman$elm_hex$Hex$toString, bytes))));
	if ((((((((strings.b && strings.b.b) && strings.b.b.b) && strings.b.b.b.b) && strings.b.b.b.b.b) && strings.b.b.b.b.b.b) && strings.b.b.b.b.b.b.b) && strings.b.b.b.b.b.b.b.b) && (!strings.b.b.b.b.b.b.b.b.b)) {
		var a = strings.a;
		var _v2 = strings.b;
		var b = _v2.a;
		var _v3 = _v2.b;
		var c = _v3.a;
		var _v4 = _v3.b;
		var d = _v4.a;
		var _v5 = _v4.b;
		var e = _v5.a;
		var _v6 = _v5.b;
		var f = _v6.a;
		var _v7 = _v6.b;
		var g = _v7.a;
		var _v8 = _v7.b;
		var h = _v8.a;
		return a + (b + ('-' + (c + ('-' + (d + ('-' + (e + ('-' + (f + (g + h))))))))));
	} else {
		return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
	}
};
var $author$project$PageTreeEditor$PageTreeEditor$Content = F3(
	function (contentId, jsonContent, docContent) {
		return {hI: contentId, h0: docContent, fJ: jsonContent};
	});
var $author$project$Document$Document$Cell = function (a) {
	return {$: 1, a: a};
};
var $author$project$Document$Document$Container = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Document$Document$CellValue = F3(
	function (cellContent, id, attrs) {
		return {s: attrs, aj: cellContent, c: id};
	});
var $author$project$Document$Document$BlockLinks = function (a) {
	return {$: 4, a: a};
};
var $author$project$Document$Document$Bulletin = {$: 18};
var $author$project$Document$Document$Calendar = {$: 9};
var $author$project$Document$Document$CalendarSalleBeaune = {$: 11};
var $author$project$Document$Document$CalendarSalleMurol = {$: 10};
var $author$project$Document$Document$CalendarWidget = {$: 8};
var $author$project$Document$Document$CustomElement = function (a) {
	return {$: 3, a: a};
};
var $author$project$Document$Document$Delib = {$: 17};
var $author$project$Document$Document$DronePanorama = {$: 13};
var $author$project$Document$Document$EmptyCell = {$: 19};
var $author$project$Document$Document$Fiches = function (a) {
	return {$: 5, a: a};
};
var $author$project$Document$Document$Gallery = function (a) {
	return {$: 15, a: a};
};
var $author$project$Document$Document$Image = function (a) {
	return {$: 0, a: a};
};
var $author$project$Document$Document$MurolInfo = {$: 16};
var $author$project$Document$Document$NewsBlock = {$: 7};
var $author$project$Document$Document$PictureLink = F2(
	function (url, img) {
		return {iG: img, da: url};
	});
var $author$project$Document$Document$PictureLinks = function (a) {
	return {$: 14, a: a};
};
var $author$project$Document$Document$Table = function (a) {
	return {$: 2, a: a};
};
var $author$project$Document$Document$TextBlock = function (a) {
	return {$: 6, a: a};
};
var $author$project$Document$Document$Video = function (a) {
	return {$: 1, a: a};
};
var $author$project$Document$Document$WeatherWidget = {$: 12};
var $author$project$Document$Document$BlockLinkMeta = F4(
	function (image, label, targetBlank, url) {
		return {iC: image, F: label, gA: targetBlank, da: url};
	});
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom = $elm$json$Json$Decode$map2($elm$core$Basics$apR);
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required = F3(
	function (key, valDecoder, decoder) {
		return A2(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A2($elm$json$Json$Decode$field, key, valDecoder),
			decoder);
	});
var $author$project$Document$Json$DocumentDecoder$decodeBlockLink = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'url',
	$elm$json$Json$Decode$string,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'targetBlank',
		$elm$json$Json$Decode$bool,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'label',
			$elm$json$Json$Decode$string,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'image',
				$elm$json$Json$Decode$string,
				$elm$json$Json$Decode$succeed($author$project$Document$Document$BlockLinkMeta)))));
var $author$project$Document$Document$GalleryMeta = F4(
	function (uuid, title, images, hq) {
		return {iy: hq, iF: images, d0: title, d1: uuid};
	});
var $author$project$Document$Document$ImageMeta = F3(
	function (src, caption, size) {
		return {fb: caption, eS: size, eT: src};
	});
var $author$project$Document$Document$ImgSize = F2(
	function (imgWidth, imgHeight) {
		return {iH: imgHeight, iI: imgWidth};
	});
var $author$project$Document$Json$DocumentDecoder$decodeImageSize = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'imgHeight',
	$elm$json$Json$Decode$int,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'imgWidth',
		$elm$json$Json$Decode$int,
		$elm$json$Json$Decode$succeed($author$project$Document$Document$ImgSize)));
var $author$project$Document$Document$Inline = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$Document$Document$UrlSrc = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt = F3(
	function (path, valDecoder, decoder) {
		return A2(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A2($elm$json$Json$Decode$at, path, valDecoder),
			decoder);
	});
var $author$project$Document$Json$DocumentDecoder$decodeImgSource = $elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'UrlSrc',
			$elm$json$Json$Decode$string,
			$elm$json$Json$Decode$succeed($author$project$Document$Document$UrlSrc)),
			A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
			_List_fromArray(
				['Inline', 'contents']),
			$elm$json$Json$Decode$string,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
				_List_fromArray(
					['Inline', 'filename']),
				$elm$json$Json$Decode$string,
				$elm$json$Json$Decode$succeed($author$project$Document$Document$Inline)))
		]));
var $elm$json$Json$Decode$null = _Json_decodeNull;
var $elm$json$Json$Decode$nullable = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				$elm$json$Json$Decode$null($elm$core$Maybe$Nothing),
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder)
			]));
};
var $author$project$Document$Json$DocumentDecoder$decodeImageMeta = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'size',
	$author$project$Document$Json$DocumentDecoder$decodeImageSize,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'caption',
		$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string),
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'src',
			$author$project$Document$Json$DocumentDecoder$decodeImgSource,
			$elm$json$Json$Decode$succeed($author$project$Document$Document$ImageMeta))));
var $elm$json$Json$Decode$fail = _Json_fail;
var $elm_community$json_extra$Json$Decode$Extra$fromResult = function (result) {
	if (!result.$) {
		var successValue = result.a;
		return $elm$json$Json$Decode$succeed(successValue);
	} else {
		var errorMessage = result.a;
		return $elm$json$Json$Decode$fail(errorMessage);
	}
};
var $TSFoster$elm_uuid$UUID$UUID = $elm$core$Basics$identity;
var $elm$core$List$any = F2(
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
var $elm$core$String$endsWith = _String_endsWith;
var $elm$core$Basics$pow = _Basics_pow;
var $rtfeldman$elm_hex$Hex$fromStringHelp = F3(
	function (position, chars, accumulated) {
		fromStringHelp:
		while (true) {
			if (!chars.b) {
				return $elm$core$Result$Ok(accumulated);
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
							$temp$accumulated = accumulated + A2($elm$core$Basics$pow, 16, position);
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '2':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (2 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '3':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (3 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '4':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (4 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '5':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (5 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '6':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (6 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '7':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (7 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '8':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (8 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '9':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (9 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'a':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (10 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'b':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (11 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'c':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (12 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'd':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (13 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'e':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (14 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'f':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (15 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					default:
						var nonHex = _char;
						return $elm$core$Result$Err(
							$elm$core$String$fromChar(nonHex) + ' is not a valid hexadecimal character.');
				}
			}
		}
	});
var $elm$core$Result$map = F2(
	function (func, ra) {
		if (!ra.$) {
			var a = ra.a;
			return $elm$core$Result$Ok(
				func(a));
		} else {
			var e = ra.a;
			return $elm$core$Result$Err(e);
		}
	});
var $elm$core$List$tail = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(xs);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $rtfeldman$elm_hex$Hex$fromString = function (str) {
	if ($elm$core$String$isEmpty(str)) {
		return $elm$core$Result$Err('Empty strings are not valid hexadecimal strings.');
	} else {
		var result = function () {
			if (A2($elm$core$String$startsWith, '-', str)) {
				var list = A2(
					$elm$core$Maybe$withDefault,
					_List_Nil,
					$elm$core$List$tail(
						$elm$core$String$toList(str)));
				return A2(
					$elm$core$Result$map,
					$elm$core$Basics$negate,
					A3(
						$rtfeldman$elm_hex$Hex$fromStringHelp,
						$elm$core$List$length(list) - 1,
						list,
						0));
			} else {
				return A3(
					$rtfeldman$elm_hex$Hex$fromStringHelp,
					$elm$core$String$length(str) - 1,
					$elm$core$String$toList(str),
					0);
			}
		}();
		var formatError = function (err) {
			return A2(
				$elm$core$String$join,
				' ',
				_List_fromArray(
					['\"' + (str + '\"'), 'is not a valid hexadecimal string because', err]));
		};
		return A2($elm$core$Result$mapError, formatError, result);
	}
};
var $elm$core$String$replace = F3(
	function (before, after, string) {
		return A2(
			$elm$core$String$join,
			after,
			A2($elm$core$String$split, before, string));
	});
var $elm$core$String$toLower = _String_toLower;
var $elm$core$Result$toMaybe = function (result) {
	if (!result.$) {
		var v = result.a;
		return $elm$core$Maybe$Just(v);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$String$trim = _String_trim;
var $elm_community$maybe_extra$Maybe$Extra$foldrValues = F2(
	function (item, list) {
		if (item.$ === 1) {
			return list;
		} else {
			var v = item.a;
			return A2($elm$core$List$cons, v, list);
		}
	});
var $elm_community$maybe_extra$Maybe$Extra$values = A2($elm$core$List$foldr, $elm_community$maybe_extra$Maybe$Extra$foldrValues, _List_Nil);
var $TSFoster$elm_uuid$UUID$fromString = A2(
	$elm$core$Basics$composeR,
	$elm$core$String$toLower,
	A2(
		$elm$core$Basics$composeR,
		$elm$core$String$trim,
		A2(
			$elm$core$Basics$composeR,
			A2($elm$core$String$replace, ' ', ''),
			A2(
				$elm$core$Basics$composeR,
				A2($elm$core$String$replace, '-', ''),
				A2(
					$elm$core$Basics$composeR,
					function (string) {
						return (A2($elm$core$String$startsWith, '{', string) && A2($elm$core$String$endsWith, '}', string)) ? A3($elm$core$String$slice, 1, -1, string) : string;
					},
					A2(
						$elm$core$Basics$composeR,
						function (string) {
							return A2($elm$core$String$startsWith, 'urn:uuid:', string) ? A2($elm$core$String$dropLeft, 9, string) : string;
						},
						A2(
							$elm$core$Basics$composeR,
							$elm_community$string_extra$String$Extra$break(2),
							A2(
								$elm$core$Basics$composeR,
								$elm$core$List$map(
									A2($elm$core$Basics$composeR, $rtfeldman$elm_hex$Hex$fromString, $elm$core$Result$toMaybe)),
								function (ints) {
									return A2(
										$elm$core$List$any,
										$elm$core$Basics$eq($elm$core$Maybe$Nothing),
										ints) ? $elm$core$Result$Err('UUID contained non-hexadecimal digits') : (($elm$core$List$length(ints) !== 16) ? $elm$core$Result$Err('UUID was not correct length') : $elm$core$Result$Ok(
										$elm_community$maybe_extra$Maybe$Extra$values(ints)));
								}))))))));
var $author$project$Document$Json$DocumentDecoder$decodeUUID = A2(
	$elm$json$Json$Decode$andThen,
	A2($elm$core$Basics$composeL, $elm_community$json_extra$Json$Decode$Extra$fromResult, $TSFoster$elm_uuid$UUID$fromString),
	$elm$json$Json$Decode$string);
var $author$project$Document$Json$DocumentDecoder$decodeGalleryMeta = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'hq',
	$elm$json$Json$Decode$bool,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'images',
		$elm$json$Json$Decode$list($author$project$Document$Json$DocumentDecoder$decodeImageMeta),
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'title',
			$elm$json$Json$Decode$string,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'uuid',
				$author$project$Document$Json$DocumentDecoder$decodeUUID,
				$elm$json$Json$Decode$succeed($author$project$Document$Document$GalleryMeta)))));
var $author$project$Document$Document$TableMeta = F4(
	function (style, nbrRows, nbrCols, data) {
		return {hT: data, jf: nbrCols, jg: nbrRows, kA: style};
	});
var $elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
			var jsArray = _v0.a;
			var remainingItems = _v0.b;
			if (_Utils_cmp(
				$elm$core$Elm$JsArray$length(jsArray),
				$elm$core$Array$branchFactor) < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					true,
					{H: nodeList, y: nodeListSize, E: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					$elm$core$List$cons,
					$elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var $elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return $elm$core$Array$empty;
	} else {
		return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var $author$project$Document$Json$DocumentDecoder$decodeTableMeta = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'data',
	$elm$json$Json$Decode$list(
		A2(
			$elm$json$Json$Decode$map,
			$elm$core$Array$fromList,
			$elm$json$Json$Decode$list($elm$json$Json$Decode$string))),
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'nbrCols',
		$elm$json$Json$Decode$int,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'nbrRows',
			$elm$json$Json$Decode$int,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'style',
				$elm$json$Json$Decode$string,
				$elm$json$Json$Decode$succeed($author$project$Document$Document$TableMeta)))));
var $author$project$Document$Document$Heading = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $author$project$Document$Document$Paragraph = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Document$Document$TBPrimitive = function (a) {
	return {$: 3, a: a};
};
var $author$project$Document$Document$UList = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$Document$Document$AlignLeft = {$: 3};
var $author$project$Document$Document$AlignRight = {$: 2};
var $author$project$Document$Document$BackgroundColor = function (a) {
	return {$: 5, a: a};
};
var $author$project$Document$Document$Bold = {$: 19};
var $author$project$Document$Document$Border = {$: 11};
var $author$project$Document$Document$Center = {$: 17};
var $author$project$Document$Document$FillPortion = function (a) {
	return {$: 10, a: a};
};
var $author$project$Document$Document$Font = function (a) {
	return {$: 12, a: a};
};
var $author$project$Document$Document$FontAlignLeft = {$: 15};
var $author$project$Document$Document$FontAlignRight = {$: 16};
var $author$project$Document$Document$FontColor = function (a) {
	return {$: 13, a: a};
};
var $author$project$Document$Document$FontSize = function (a) {
	return {$: 14, a: a};
};
var $author$project$Document$Document$Height = function (a) {
	return {$: 9, a: a};
};
var $author$project$Document$Document$Italic = {$: 20};
var $author$project$Document$Document$Justify = {$: 18};
var $author$project$Document$Document$PaddingEach = function (a) {
	return {$: 0, a: a};
};
var $author$project$Document$Document$Pointer = {$: 4};
var $author$project$Document$Document$SpacingXY = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$Document$Document$Width = function (a) {
	return {$: 8, a: a};
};
var $author$project$Document$Document$WidthFill = {$: 6};
var $author$project$Document$Document$WidthShrink = {$: 7};
var $author$project$Document$Document$DocColor = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $author$project$Document$Json$DocumentDecoder$decodeDocColor = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
	_List_fromArray(
		['DocColor', 'blue']),
	$elm$json$Json$Decode$float,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
		_List_fromArray(
			['DocColor', 'green']),
		$elm$json$Json$Decode$float,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
			_List_fromArray(
				['DocColor', 'red']),
			$elm$json$Json$Decode$float,
			$elm$json$Json$Decode$succeed($author$project$Document$Document$DocColor))));
var $author$project$Document$Json$DocumentDecoder$decodeDocAttribute = $elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
			_List_fromArray(
				['PaddingEach', 'top']),
			$elm$json$Json$Decode$int,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
				_List_fromArray(
					['PaddingEach', 'right']),
				$elm$json$Json$Decode$int,
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
					_List_fromArray(
						['PaddingEach', 'left']),
					$elm$json$Json$Decode$int,
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
						_List_fromArray(
							['PaddingEach', 'bottom']),
						$elm$json$Json$Decode$int,
						$elm$json$Json$Decode$succeed(
							F4(
								function (b, l, r, t) {
									return $author$project$Document$Document$PaddingEach(
										{aR: b, aU: l, a0: r, a1: t});
								})))))),
			A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
			_List_fromArray(
				['SpacingXY', 'Y']),
			$elm$json$Json$Decode$int,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
				_List_fromArray(
					['SpacingXY', 'X']),
				$elm$json$Json$Decode$int,
				$elm$json$Json$Decode$succeed($author$project$Document$Document$SpacingXY))),
			A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'BackgroundColor',
			$author$project$Document$Json$DocumentDecoder$decodeDocColor,
			$elm$json$Json$Decode$succeed($author$project$Document$Document$BackgroundColor)),
			A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'Width',
			$elm$json$Json$Decode$int,
			$elm$json$Json$Decode$succeed($author$project$Document$Document$Width)),
			A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'Height',
			$elm$json$Json$Decode$int,
			$elm$json$Json$Decode$succeed($author$project$Document$Document$Height)),
			A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'FillPortion',
			$elm$json$Json$Decode$int,
			$elm$json$Json$Decode$succeed($author$project$Document$Document$FillPortion)),
			A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'Font',
			$elm$json$Json$Decode$string,
			$elm$json$Json$Decode$succeed($author$project$Document$Document$Font)),
			A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'FontColor',
			$author$project$Document$Json$DocumentDecoder$decodeDocColor,
			$elm$json$Json$Decode$succeed($author$project$Document$Document$FontColor)),
			A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'FontSize',
			$elm$json$Json$Decode$int,
			$elm$json$Json$Decode$succeed($author$project$Document$Document$FontSize)),
			A2(
			$elm$json$Json$Decode$andThen,
			function (str) {
				switch (str) {
					case 'WidthShrink':
						return $elm$json$Json$Decode$succeed($author$project$Document$Document$WidthShrink);
					case 'WidthFill':
						return $elm$json$Json$Decode$succeed($author$project$Document$Document$WidthFill);
					case 'AlignRight':
						return $elm$json$Json$Decode$succeed($author$project$Document$Document$AlignRight);
					case 'AlignLeft':
						return $elm$json$Json$Decode$succeed($author$project$Document$Document$AlignLeft);
					case 'Pointer':
						return $elm$json$Json$Decode$succeed($author$project$Document$Document$Pointer);
					case 'Border':
						return $elm$json$Json$Decode$succeed($author$project$Document$Document$Border);
					case 'FontAlignLeft':
						return $elm$json$Json$Decode$succeed($author$project$Document$Document$FontAlignLeft);
					case 'FontAlignRight':
						return $elm$json$Json$Decode$succeed($author$project$Document$Document$FontAlignRight);
					case 'Center':
						return $elm$json$Json$Decode$succeed($author$project$Document$Document$Center);
					case 'Justify':
						return $elm$json$Json$Decode$succeed($author$project$Document$Document$Justify);
					case 'Bold':
						return $elm$json$Json$Decode$succeed($author$project$Document$Document$Bold);
					case 'Italic':
						return $elm$json$Json$Decode$succeed($author$project$Document$Document$Italic);
					default:
						var somethingElse = str;
						return $elm$json$Json$Decode$fail('Unknown DocAttribute: ' + somethingElse);
				}
			},
			$elm$json$Json$Decode$string)
		]));
var $author$project$Document$Json$DocumentDecoder$decodeDocAttributes = $elm$json$Json$Decode$list($author$project$Document$Json$DocumentDecoder$decodeDocAttribute);
var $author$project$Document$Document$Link = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$Document$Document$Text = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Document$Document$LinkMeta = F3(
	function (targetBlank, url, label) {
		return {F: label, gA: targetBlank, da: url};
	});
var $author$project$Document$Json$DocumentDecoder$decodeLinkMeta = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'label',
	$elm$json$Json$Decode$string,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'url',
		$elm$json$Json$Decode$string,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'targetBlank',
			$elm$json$Json$Decode$bool,
			$elm$json$Json$Decode$succeed($author$project$Document$Document$LinkMeta))));
var $author$project$Document$Json$DocumentDecoder$decodeTextBlockPrimitive = $elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
			_List_fromArray(
				['Text', 'value']),
			$elm$json$Json$Decode$string,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
				_List_fromArray(
					['Text', 'attrs']),
				$author$project$Document$Json$DocumentDecoder$decodeDocAttributes,
				$elm$json$Json$Decode$succeed($author$project$Document$Document$Text))),
			A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
			_List_fromArray(
				['Link', 'linkMeta']),
			$author$project$Document$Json$DocumentDecoder$decodeLinkMeta,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
				_List_fromArray(
					['Link', 'attrs']),
				$author$project$Document$Json$DocumentDecoder$decodeDocAttributes,
				$elm$json$Json$Decode$succeed($author$project$Document$Document$Link)))
		]));
var $author$project$Document$Json$DocumentDecoder$decodeTextBlockElement = $elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
			_List_fromArray(
				['Paragraph', 'prims']),
			$elm$json$Json$Decode$list($author$project$Document$Json$DocumentDecoder$decodeTextBlockPrimitive),
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
				_List_fromArray(
					['Paragraph', 'attrs']),
				$author$project$Document$Json$DocumentDecoder$decodeDocAttributes,
				$elm$json$Json$Decode$succeed($author$project$Document$Document$Paragraph))),
			A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
			_List_fromArray(
				['UList', 'liList']),
			$elm$json$Json$Decode$list(
				A2(
					$elm$json$Json$Decode$field,
					'li',
					$elm$json$Json$Decode$list($author$project$Document$Json$DocumentDecoder$decodeTextBlockPrimitive))),
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
				_List_fromArray(
					['UList', 'attrs']),
				$author$project$Document$Json$DocumentDecoder$decodeDocAttributes,
				$elm$json$Json$Decode$succeed($author$project$Document$Document$UList))),
			A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'Heading',
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'value',
				$elm$json$Json$Decode$string,
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'level',
					$elm$json$Json$Decode$int,
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'attrs',
						$author$project$Document$Json$DocumentDecoder$decodeDocAttributes,
						$elm$json$Json$Decode$succeed(
							F3(
								function (a, l, v) {
									return {s: a, fM: l, gJ: v};
								}))))),
			$elm$json$Json$Decode$succeed(
				function (res) {
					return A2(
						$author$project$Document$Document$Heading,
						res.s,
						_Utils_Tuple2(res.fM, res.gJ));
				})),
			A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'TBPrimitive',
			$author$project$Document$Json$DocumentDecoder$decodeTextBlockPrimitive,
			$elm$json$Json$Decode$succeed($author$project$Document$Document$TBPrimitive))
		]));
var $author$project$Document$Document$VideoMeta = F9(
	function (src, size, frameBorder, suggestions, controls, privacy, title, startAt, hosting) {
		return {hL: controls, ih: frameBorder, iw: hosting, jO: privacy, eS: size, eT: src, ku: startAt, kD: suggestions, d0: title};
	});
var $author$project$Document$Document$Youtube = 0;
var $author$project$Document$Json$DocumentDecoder$decodeVideoHost = A2(
	$elm$json$Json$Decode$andThen,
	function (str) {
		if (str === 'Youtube') {
			return $elm$json$Json$Decode$succeed(0);
		} else {
			var somethingElse = str;
			return $elm$json$Json$Decode$fail('Unknown VideoHost: ' + somethingElse);
		}
	},
	$elm$json$Json$Decode$string);
var $author$project$Document$Document$VideoSize = F2(
	function (videoWidth, videoHeight) {
		return {k5: videoHeight, k6: videoWidth};
	});
var $author$project$Document$Json$DocumentDecoder$decodeVideoSize = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'videoHeight',
	$elm$json$Json$Decode$int,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'videoWidth',
		$elm$json$Json$Decode$int,
		$elm$json$Json$Decode$succeed($author$project$Document$Document$VideoSize)));
var $author$project$Document$Json$DocumentDecoder$decodeVideoMeta = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'hosting',
	$author$project$Document$Json$DocumentDecoder$decodeVideoHost,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'startAt',
		$elm$json$Json$Decode$nullable($elm$json$Json$Decode$int),
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'title',
			$elm$json$Json$Decode$bool,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'privacy',
				$elm$json$Json$Decode$bool,
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'controls',
					$elm$json$Json$Decode$bool,
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'suggestions',
						$elm$json$Json$Decode$bool,
						A3(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'frameBorder',
							$elm$json$Json$Decode$bool,
							A3(
								$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
								'size',
								$author$project$Document$Json$DocumentDecoder$decodeVideoSize,
								A3(
									$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
									'src',
									$elm$json$Json$Decode$string,
									$elm$json$Json$Decode$succeed($author$project$Document$Document$VideoMeta))))))))));
var $author$project$Document$Json$DocumentDecoder$decodeCellContent = $elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'Image',
			$author$project$Document$Json$DocumentDecoder$decodeImageMeta,
			$elm$json$Json$Decode$succeed($author$project$Document$Document$Image)),
			A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'Video',
			$author$project$Document$Json$DocumentDecoder$decodeVideoMeta,
			$elm$json$Json$Decode$succeed($author$project$Document$Document$Video)),
			A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'Table',
			$author$project$Document$Json$DocumentDecoder$decodeTableMeta,
			$elm$json$Json$Decode$succeed($author$project$Document$Document$Table)),
			A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'CustomElement',
			$elm$json$Json$Decode$string,
			$elm$json$Json$Decode$succeed($author$project$Document$Document$CustomElement)),
			A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'BlockLinks',
			$elm$json$Json$Decode$list($author$project$Document$Json$DocumentDecoder$decodeBlockLink),
			$elm$json$Json$Decode$succeed($author$project$Document$Document$BlockLinks)),
			A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'Fiches',
			$elm$json$Json$Decode$list($elm$json$Json$Decode$string),
			$elm$json$Json$Decode$succeed($author$project$Document$Document$Fiches)),
			A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'TextBlock',
			$elm$json$Json$Decode$list($author$project$Document$Json$DocumentDecoder$decodeTextBlockElement),
			$elm$json$Json$Decode$succeed($author$project$Document$Document$TextBlock)),
			A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'PictureLinks',
			$elm$json$Json$Decode$list(
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'img',
					$author$project$Document$Json$DocumentDecoder$decodeImageMeta,
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'url',
						$elm$json$Json$Decode$string,
						$elm$json$Json$Decode$succeed($author$project$Document$Document$PictureLink)))),
			$elm$json$Json$Decode$succeed($author$project$Document$Document$PictureLinks)),
			A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'Gallery',
			$author$project$Document$Json$DocumentDecoder$decodeGalleryMeta,
			$elm$json$Json$Decode$succeed($author$project$Document$Document$Gallery)),
			A2(
			$elm$json$Json$Decode$andThen,
			function (str) {
				switch (str) {
					case 'EmptyCell':
						return $elm$json$Json$Decode$succeed($author$project$Document$Document$EmptyCell);
					case 'NewsBlock':
						return $elm$json$Json$Decode$succeed($author$project$Document$Document$NewsBlock);
					case 'Calendar':
						return $elm$json$Json$Decode$succeed($author$project$Document$Document$Calendar);
					case 'CalendarSalleMurol':
						return $elm$json$Json$Decode$succeed($author$project$Document$Document$CalendarSalleMurol);
					case 'CalendarSalleBeaune':
						return $elm$json$Json$Decode$succeed($author$project$Document$Document$CalendarSalleBeaune);
					case 'CalendarWidget':
						return $elm$json$Json$Decode$succeed($author$project$Document$Document$CalendarWidget);
					case 'DronePanorama':
						return $elm$json$Json$Decode$succeed($author$project$Document$Document$DronePanorama);
					case 'WeatherWidget':
						return $elm$json$Json$Decode$succeed($author$project$Document$Document$WeatherWidget);
					case 'MurolInfo':
						return $elm$json$Json$Decode$succeed($author$project$Document$Document$MurolInfo);
					case 'Delib':
						return $elm$json$Json$Decode$succeed($author$project$Document$Document$Delib);
					case 'Bulletin':
						return $elm$json$Json$Decode$succeed($author$project$Document$Document$Bulletin);
					default:
						var somethingElse = str;
						return $elm$json$Json$Decode$fail('Unknown CellContent: ' + somethingElse);
				}
			},
			$elm$json$Json$Decode$string)
		]));
var $author$project$Document$Document$Id = F4(
	function (uid, docStyleId, htmlId, classes) {
		return {a3: classes, a8: docStyleId, bc: htmlId, b0: uid};
	});
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0;
		return A3($elm$core$Dict$insert, key, 0, dict);
	});
var $elm$core$Set$fromList = function (list) {
	return A3($elm$core$List$foldl, $elm$core$Set$insert, $elm$core$Set$empty, list);
};
var $author$project$Document$Json$DocumentDecoder$decodeId = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'classes',
	A2(
		$elm$json$Json$Decode$map,
		$elm$core$Set$fromList,
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'htmlId',
		$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string),
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'docStyleId',
			$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string),
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'uid',
				$elm$json$Json$Decode$int,
				$elm$json$Json$Decode$succeed($author$project$Document$Document$Id)))));
var $author$project$Document$Json$DocumentDecoder$decodeCellValue = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'attrs',
	$author$project$Document$Json$DocumentDecoder$decodeDocAttributes,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'id',
		$author$project$Document$Json$DocumentDecoder$decodeId,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'cellContent',
			$author$project$Document$Json$DocumentDecoder$decodeCellContent,
			$elm$json$Json$Decode$succeed($author$project$Document$Document$CellValue))));
var $author$project$Document$Document$ContainerValue = F3(
	function (containerLabel, id, attrs) {
		return {s: attrs, a4: containerLabel, c: id};
	});
var $author$project$Document$Document$DocColumn = 0;
var $author$project$Document$Document$DocRow = 1;
var $author$project$Document$Document$ResponsiveBloc = 3;
var $author$project$Document$Document$TextColumn = 2;
var $author$project$Document$Json$DocumentDecoder$decodeContainerLabel = A2(
	$elm$json$Json$Decode$andThen,
	function (str) {
		switch (str) {
			case 'DocColumn':
				return $elm$json$Json$Decode$succeed(0);
			case 'DocRow':
				return $elm$json$Json$Decode$succeed(1);
			case 'TextColumn':
				return $elm$json$Json$Decode$succeed(2);
			case 'ResponsiveBloc':
				return $elm$json$Json$Decode$succeed(3);
			default:
				var somethingElse = str;
				return $elm$json$Json$Decode$fail('Unknown ContainerLabel: ' + somethingElse);
		}
	},
	$elm$json$Json$Decode$string);
var $author$project$Document$Json$DocumentDecoder$decodeContainerValue = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'attrs',
	$author$project$Document$Json$DocumentDecoder$decodeDocAttributes,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'id',
		$author$project$Document$Json$DocumentDecoder$decodeId,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'containerLabel',
			$author$project$Document$Json$DocumentDecoder$decodeContainerLabel,
			$elm$json$Json$Decode$succeed($author$project$Document$Document$ContainerValue))));
var $elm$json$Json$Decode$lazy = function (thunk) {
	return A2(
		$elm$json$Json$Decode$andThen,
		thunk,
		$elm$json$Json$Decode$succeed(0));
};
function $author$project$Document$Json$DocumentDecoder$cyclic$decodeDocument() {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
				_List_fromArray(
					['Container', 'children']),
				$elm$json$Json$Decode$list(
					$elm$json$Json$Decode$lazy(
						function (_v0) {
							return $author$project$Document$Json$DocumentDecoder$cyclic$decodeDocument();
						})),
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
					_List_fromArray(
						['Container', 'ContainerValue']),
					$author$project$Document$Json$DocumentDecoder$decodeContainerValue,
					$elm$json$Json$Decode$succeed($author$project$Document$Document$Container))),
				A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'Cell',
				$author$project$Document$Json$DocumentDecoder$decodeCellValue,
				$elm$json$Json$Decode$succeed($author$project$Document$Document$Cell))
			]));
}
var $author$project$Document$Json$DocumentDecoder$decodeDocument = $author$project$Document$Json$DocumentDecoder$cyclic$decodeDocument();
$author$project$Document$Json$DocumentDecoder$cyclic$decodeDocument = function () {
	return $author$project$Document$Json$DocumentDecoder$decodeDocument;
};
var $author$project$PageTreeEditor$PageTreeEditor$decodeUUID = A2(
	$elm$json$Json$Decode$andThen,
	A2($elm$core$Basics$composeL, $elm_community$json_extra$Json$Decode$Extra$fromResult, $TSFoster$elm_uuid$UUID$fromString),
	$elm$json$Json$Decode$string);
var $author$project$PageTreeEditor$PageTreeEditor$decodeContent = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'jsonContent',
	$author$project$Document$Json$DocumentDecoder$decodeDocument,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'jsonContent',
		$elm$json$Json$Decode$value,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'contentId',
			$author$project$PageTreeEditor$PageTreeEditor$decodeUUID,
			$elm$json$Json$Decode$succeed($author$project$PageTreeEditor$PageTreeEditor$Content))));
var $author$project$PageTreeEditor$PageTreeEditor$Page = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$PageTreeEditor$PageTreeEditor$PageInfo = F3(
	function (name, path, mbContentId) {
		return {fP: mbContentId, C: name, D: path};
	});
var $author$project$PageTreeEditor$PageTreeEditor$decodePageInfo = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'mbContentId',
	$elm$json$Json$Decode$nullable($author$project$PageTreeEditor$PageTreeEditor$decodeUUID),
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'path',
		A2(
			$elm$json$Json$Decode$map,
			$elm$core$String$split('/'),
			$elm$json$Json$Decode$string),
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'name',
			$elm$json$Json$Decode$string,
			$elm$json$Json$Decode$succeed($author$project$PageTreeEditor$PageTreeEditor$PageInfo))));
function $author$project$PageTreeEditor$PageTreeEditor$cyclic$decodePage() {
	return A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
		_List_fromArray(
			['Page', 'children']),
		$elm$json$Json$Decode$list(
			$elm$json$Json$Decode$lazy(
				function (_v0) {
					return $author$project$PageTreeEditor$PageTreeEditor$cyclic$decodePage();
				})),
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
			_List_fromArray(
				['Page', 'pageInfo']),
			$author$project$PageTreeEditor$PageTreeEditor$decodePageInfo,
			$elm$json$Json$Decode$succeed($author$project$PageTreeEditor$PageTreeEditor$Page)));
}
var $author$project$PageTreeEditor$PageTreeEditor$decodePage = $author$project$PageTreeEditor$PageTreeEditor$cyclic$decodePage();
$author$project$PageTreeEditor$PageTreeEditor$cyclic$decodePage = function () {
	return $author$project$PageTreeEditor$PageTreeEditor$decodePage;
};
var $author$project$Murol$NotLoaded = {$: 0};
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm$url$Url$percentEncode = _Url_percentEncode;
var $author$project$Murol$pageToPages = function (page) {
	var toList = function (_v0) {
		var pageInfo = _v0.a;
		var xs = _v0.b;
		var _v1 = pageInfo.fP;
		if (_v1.$ === 1) {
			return A2($elm$core$List$concatMap, toList, xs);
		} else {
			var contentId = _v1.a;
			var strPath = function (path) {
				return function (p) {
					return '/' + p;
				}(
					A2(
						$elm$core$String$join,
						'/',
						A2($elm$core$List$map, $elm$url$Url$percentEncode, path)));
			};
			return A2(
				$elm$core$List$cons,
				_Utils_Tuple3(
					strPath(pageInfo.D),
					pageInfo.C,
					$TSFoster$elm_uuid$UUID$canonical(contentId)),
				A2($elm$core$List$concatMap, toList, xs));
		}
	};
	return $elm$core$Dict$fromList(
		A2(
			$elm$core$List$map,
			function (_v2) {
				var p = _v2.a;
				var n = _v2.b;
				var cId = _v2.c;
				return _Utils_Tuple2(
					p,
					_Utils_Tuple3(cId, n, $author$project$Murol$NotLoaded));
			},
			toList(page)));
};
var $author$project$Murol$decodePages = A2(
	$elm$json$Json$Decode$map,
	function (p) {
		return _Utils_Tuple2(
			$author$project$Murol$pageToPages(p),
			p);
	},
	$author$project$PageTreeEditor$PageTreeEditor$decodePage);
var $elm$json$Json$Decode$keyValuePairs = _Json_decodeKeyValuePairs;
var $elm$json$Json$Decode$dict = function (decoder) {
	return A2(
		$elm$json$Json$Decode$map,
		$elm$core$Dict$fromList,
		$elm$json$Json$Decode$keyValuePairs(decoder));
};
var $author$project$Murol$decodeSearchResults = function () {
	var decodeRes = A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'keywords',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string),
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'score',
			$elm$json$Json$Decode$int,
			$elm$json$Json$Decode$succeed(
				F2(
					function (s, k) {
						return _Utils_Tuple2(
							s,
							$elm$core$Set$fromList(k));
					}))));
	return A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'results',
		$elm$json$Json$Decode$dict(decodeRes),
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'keywords',
			$elm$json$Json$Decode$list($elm$json$Json$Decode$string),
			$elm$json$Json$Decode$succeed(
				F2(
					function (k, r) {
						return _Utils_Tuple2(k, r);
					}))));
}();
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (!_v0.$) {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Set$member = F2(
	function (key, _v0) {
		var dict = _v0;
		return A2($elm$core$Dict$member, key, dict);
	});
var $elm_community$list_extra$List$Extra$uniqueHelp = F4(
	function (f, existing, remaining, accumulator) {
		uniqueHelp:
		while (true) {
			if (!remaining.b) {
				return $elm$core$List$reverse(accumulator);
			} else {
				var first = remaining.a;
				var rest = remaining.b;
				var computedFirst = f(first);
				if (A2($elm$core$Set$member, computedFirst, existing)) {
					var $temp$f = f,
						$temp$existing = existing,
						$temp$remaining = rest,
						$temp$accumulator = accumulator;
					f = $temp$f;
					existing = $temp$existing;
					remaining = $temp$remaining;
					accumulator = $temp$accumulator;
					continue uniqueHelp;
				} else {
					var $temp$f = f,
						$temp$existing = A2($elm$core$Set$insert, computedFirst, existing),
						$temp$remaining = rest,
						$temp$accumulator = A2($elm$core$List$cons, first, accumulator);
					f = $temp$f;
					existing = $temp$existing;
					remaining = $temp$remaining;
					accumulator = $temp$accumulator;
					continue uniqueHelp;
				}
			}
		}
	});
var $elm_community$list_extra$List$Extra$unique = function (list) {
	return A4($elm_community$list_extra$List$Extra$uniqueHelp, $elm$core$Basics$identity, $elm$core$Set$empty, list, _List_Nil);
};
var $author$project$Document$Document$gatherFichesIds = function (document) {
	var helper = function (doc) {
		if (doc.$ === 1) {
			var cellContent = doc.a.aj;
			if (cellContent.$ === 5) {
				var ids = cellContent.a;
				return ids;
			} else {
				return _List_Nil;
			}
		} else {
			var children = doc.b;
			return A2($elm$core$List$concatMap, helper, children);
		}
	};
	return $elm_community$list_extra$List$Extra$unique(
		helper(document));
};
var $elm_community$list_extra$List$Extra$uniqueBy = F2(
	function (f, list) {
		return A4($elm_community$list_extra$List$Extra$uniqueHelp, f, $elm$core$Set$empty, list, _List_Nil);
	});
var $author$project$Document$Document$gatherGalleryMeta = function (document) {
	var helper = function (doc) {
		if (doc.$ === 1) {
			var cellContent = doc.a.aj;
			if (cellContent.$ === 15) {
				var galleryMeta = cellContent.a;
				return _List_fromArray(
					[galleryMeta]);
			} else {
				return _List_Nil;
			}
		} else {
			var children = doc.b;
			return A2($elm$core$List$concatMap, helper, children);
		}
	};
	return A2(
		$elm_community$list_extra$List$Extra$uniqueBy,
		A2(
			$elm$core$Basics$composeL,
			$TSFoster$elm_uuid$UUID$canonical,
			function ($) {
				return $.d1;
			}),
		helper(document));
};
var $author$project$Murol$LoadContent = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Murol$getContent = function (_v0) {
	var path = _v0.a;
	var contentId = _v0.b;
	var name = _v0.c;
	var body = $elm$http$Http$jsonBody(
		$elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'contentId',
					$elm$json$Json$Encode$string(contentId))
				])));
	return $elm$http$Http$post(
		{
			d8: body,
			cJ: A2(
				$elm$http$Http$expectJson,
				$author$project$Murol$LoadContent(
					_Utils_Tuple3(path, contentId, name)),
				$elm$json$Json$Decode$value),
			da: '/getContent.php'
		});
};
var $author$project$Murol$LoadFiches = function (a) {
	return {$: 4, a: a};
};
var $author$project$GeneralDirectoryEditor$GeneralDirCommonTypes$Fiche = function (uuid) {
	return function (categories) {
		return function (natureActiv) {
			return function (refOt) {
				return function (label) {
					return function (rank) {
						return function (nomEntite) {
							return function (responsables) {
								return function (adresse) {
									return function (telNumber) {
										return function (fax) {
											return function (email) {
												return function (site) {
													return function (pjaun) {
														return function (visuel) {
															return function (description) {
																return function (linkedDocs) {
																	return function (ouverture) {
																		return function (lastEdit) {
																			return {gW: adresse, d9: categories, h$: description, h3: email, ic: fax, F: label, fL: lastEdit, iZ: linkedDocs, je: natureActiv, jq: nomEntite, jD: ouverture, f8: pjaun, jP: rank, jS: refOt, jX: responsables, kn: site, kK: telNumber, d1: uuid, k9: visuel};
																		};
																	};
																};
															};
														};
													};
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$GeneralDirectoryEditor$GeneralDirCommonTypes$Label = F3(
	function (nom, logo, lien) {
		return {iX: lien, i$: logo, jp: nom};
	});
var $author$project$GeneralDirectoryEditor$GeneralDirJson$decodeLogo = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'height',
	$elm$json$Json$Decode$int,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'width',
		$elm$json$Json$Decode$int,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'url',
			$elm$json$Json$Decode$string,
			$elm$json$Json$Decode$succeed(
				F3(
					function (u, w, h) {
						return {iu: h, da: u, lb: w};
					})))));
var $author$project$GeneralDirectoryEditor$GeneralDirJson$decodeLabel = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'lien',
	$elm$json$Json$Decode$string,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'logo',
		$author$project$GeneralDirectoryEditor$GeneralDirJson$decodeLogo,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'nom',
			$elm$json$Json$Decode$string,
			$elm$json$Json$Decode$succeed($author$project$GeneralDirectoryEditor$GeneralDirCommonTypes$Label))));
var $author$project$GeneralDirectoryEditor$GeneralDirCommonTypes$LinkedDoc = F4(
	function (url, label, descr, expiryDate) {
		return {hZ: descr, h7: expiryDate, F: label, da: url};
	});
var $author$project$GeneralDirectoryEditor$GeneralDirJson$decodeLinkedDoc = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'expiryDate',
	$elm$json$Json$Decode$nullable(
		A2($elm$json$Json$Decode$map, $elm$time$Time$millisToPosix, $elm$json$Json$Decode$int)),
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'descr',
		$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string),
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'label',
			$elm$json$Json$Decode$string,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'url',
				$elm$json$Json$Decode$string,
				$elm$json$Json$Decode$succeed($author$project$GeneralDirectoryEditor$GeneralDirCommonTypes$LinkedDoc)))));
var $author$project$GeneralDirectoryEditor$GeneralDirCommonTypes$Saisonniere = 0;
var $author$project$GeneralDirectoryEditor$GeneralDirCommonTypes$TteAnnee = 1;
var $author$project$GeneralDirectoryEditor$GeneralDirJson$decodeOuverture = A2(
	$elm$json$Json$Decode$andThen,
	function (str) {
		switch (str) {
			case 'Saisonniere':
				return $elm$json$Json$Decode$succeed(0);
			case 'TteAnnee':
				return $elm$json$Json$Decode$succeed(1);
			default:
				var somethingElse = str;
				return $elm$json$Json$Decode$fail('Unknown ouverture: ' + somethingElse);
		}
	},
	$elm$json$Json$Decode$string);
var $author$project$GeneralDirectoryEditor$GeneralDirCommonTypes$Rank = F2(
	function (stars, epis) {
		return {fn: epis, kt: stars};
	});
var $author$project$GeneralDirectoryEditor$GeneralDirJson$decodeRank = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'epis',
	$elm$json$Json$Decode$nullable($elm$json$Json$Decode$int),
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'stars',
		$elm$json$Json$Decode$nullable($elm$json$Json$Decode$int),
		$elm$json$Json$Decode$succeed($author$project$GeneralDirectoryEditor$GeneralDirCommonTypes$Rank)));
var $author$project$GeneralDirectoryEditor$GeneralDirJson$decodeRefOt = $elm$json$Json$Decode$nullable(
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'link',
		$elm$json$Json$Decode$string,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'ref',
			$elm$json$Json$Decode$int,
			$elm$json$Json$Decode$succeed($elm$core$Tuple$pair))));
var $author$project$GeneralDirectoryEditor$GeneralDirCommonTypes$Responsable = F3(
	function (poste, nom, tel) {
		return {jp: nom, jM: poste, kJ: tel};
	});
var $author$project$GeneralDirectoryEditor$GeneralDirCommonTypes$TelBoth = function (a) {
	return {$: 2, a: a};
};
var $author$project$GeneralDirectoryEditor$GeneralDirCommonTypes$TelFixe = function (a) {
	return {$: 0, a: a};
};
var $author$project$GeneralDirectoryEditor$GeneralDirCommonTypes$TelPortable = function (a) {
	return {$: 1, a: a};
};
var $author$project$GeneralDirectoryEditor$GeneralDirJson$decodeTel = $elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'TelFixe',
			$elm$json$Json$Decode$string,
			$elm$json$Json$Decode$succeed($author$project$GeneralDirectoryEditor$GeneralDirCommonTypes$TelFixe)),
			A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'TelPortable',
			$elm$json$Json$Decode$string,
			$elm$json$Json$Decode$succeed($author$project$GeneralDirectoryEditor$GeneralDirCommonTypes$TelPortable)),
			A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'TelBoth',
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'TelPortable',
				$elm$json$Json$Decode$string,
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'TelFixe',
					$elm$json$Json$Decode$string,
					$elm$json$Json$Decode$succeed($elm$core$Tuple$pair))),
			$elm$json$Json$Decode$succeed($author$project$GeneralDirectoryEditor$GeneralDirCommonTypes$TelBoth))
		]));
var $author$project$GeneralDirectoryEditor$GeneralDirJson$decodeResp = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'tel',
	$author$project$GeneralDirectoryEditor$GeneralDirJson$decodeTel,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'nom',
		$elm$json$Json$Decode$string,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'poste',
			$elm$json$Json$Decode$string,
			$elm$json$Json$Decode$succeed($author$project$GeneralDirectoryEditor$GeneralDirCommonTypes$Responsable))));
var $author$project$GeneralDirectoryEditor$GeneralDirJson$decodeSite = $elm$json$Json$Decode$nullable(
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'url',
		$elm$json$Json$Decode$string,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'label',
			$elm$json$Json$Decode$string,
			$elm$json$Json$Decode$succeed($elm$core$Tuple$pair))));
var $author$project$GeneralDirectoryEditor$GeneralDirJson$decodeUUID = A2(
	$elm$json$Json$Decode$andThen,
	A2($elm$core$Basics$composeL, $elm_community$json_extra$Json$Decode$Extra$fromResult, $TSFoster$elm_uuid$UUID$fromString),
	$elm$json$Json$Decode$string);
var $author$project$GeneralDirectoryEditor$GeneralDirJson$decodeFiche = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'lastEdit',
	A2($elm$json$Json$Decode$map, $elm$time$Time$millisToPosix, $elm$json$Json$Decode$int),
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'ouverture',
		$elm$json$Json$Decode$nullable($author$project$GeneralDirectoryEditor$GeneralDirJson$decodeOuverture),
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'linkedDocs',
			$elm$json$Json$Decode$list($author$project$GeneralDirectoryEditor$GeneralDirJson$decodeLinkedDoc),
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'description',
				$elm$json$Json$Decode$list($elm$json$Json$Decode$string),
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'visuel',
					$elm$json$Json$Decode$string,
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'pjaun',
						$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string),
						A3(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'site',
							$author$project$GeneralDirectoryEditor$GeneralDirJson$decodeSite,
							A3(
								$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
								'email',
								$elm$json$Json$Decode$list($elm$json$Json$Decode$string),
								A3(
									$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
									'fax',
									$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string),
									A3(
										$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
										'telNumber',
										$elm$json$Json$Decode$nullable($author$project$GeneralDirectoryEditor$GeneralDirJson$decodeTel),
										A3(
											$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
											'adresse',
											$elm$json$Json$Decode$string,
											A3(
												$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
												'responsables',
												$elm$json$Json$Decode$list($author$project$GeneralDirectoryEditor$GeneralDirJson$decodeResp),
												A3(
													$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
													'nomEntite',
													$elm$json$Json$Decode$string,
													A3(
														$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
														'rank',
														$author$project$GeneralDirectoryEditor$GeneralDirJson$decodeRank,
														A3(
															$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
															'label',
															$elm$json$Json$Decode$list($author$project$GeneralDirectoryEditor$GeneralDirJson$decodeLabel),
															A3(
																$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
																'refOt',
																$author$project$GeneralDirectoryEditor$GeneralDirJson$decodeRefOt,
																A3(
																	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
																	'natureActiv',
																	$elm$json$Json$Decode$list($elm$json$Json$Decode$string),
																	A3(
																		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
																		'categories',
																		$elm$json$Json$Decode$list($elm$json$Json$Decode$string),
																		A3(
																			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
																			'uuid',
																			$author$project$GeneralDirectoryEditor$GeneralDirJson$decodeUUID,
																			$elm$json$Json$Decode$succeed($author$project$GeneralDirectoryEditor$GeneralDirCommonTypes$Fiche))))))))))))))))))));
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
var $elm$json$Json$Decode$maybe = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder),
				$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing)
			]));
};
var $author$project$Murol$getFiches = function (fichesIds) {
	var body = $elm$http$Http$jsonBody(
		$elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'fichesIds',
					A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, fichesIds))
				])));
	return $elm$http$Http$post(
		{
			d8: body,
			cJ: A2(
				$elm$http$Http$expectJson,
				$author$project$Murol$LoadFiches,
				A2(
					$elm$json$Json$Decode$map,
					$elm$core$List$filterMap($elm$core$Basics$identity),
					$elm$json$Json$Decode$list(
						$elm$json$Json$Decode$maybe($author$project$GeneralDirectoryEditor$GeneralDirJson$decodeFiche)))),
			da: '/getFiche.php'
		});
};
var $author$project$Murol$LoadNews = function (a) {
	return {$: 5, a: a};
};
var $author$project$Document$Document$News = F6(
	function (title, date, content, pic, uuid, expiry) {
		return {fi: content, cI: date, fq: expiry, f6: pic, d0: title, d1: uuid};
	});
var $author$project$Document$Document$Pic = F3(
	function (url, width, height) {
		return {iu: height, da: url, lb: width};
	});
var $author$project$Document$Document$NewsContent = F2(
	function (tbElems, attrs) {
		return {s: attrs, kI: tbElems};
	});
var $author$project$Document$Json$DocumentDecoder$decodeNewsContent = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'attrs',
	$author$project$Document$Json$DocumentDecoder$decodeDocAttributes,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'tbElems',
		$elm$json$Json$Decode$list($author$project$Document$Json$DocumentDecoder$decodeTextBlockElement),
		$elm$json$Json$Decode$succeed($author$project$Document$Document$NewsContent)));
var $author$project$Document$Json$DocumentDecoder$decodeNews = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'expiry',
	A2($elm$json$Json$Decode$map, $elm$time$Time$millisToPosix, $elm$json$Json$Decode$int),
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'uuid',
		$author$project$Document$Json$DocumentDecoder$decodeUUID,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'pic',
			$elm$json$Json$Decode$nullable(
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'height',
					$elm$json$Json$Decode$int,
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'width',
						$elm$json$Json$Decode$int,
						A3(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'url',
							$elm$json$Json$Decode$string,
							$elm$json$Json$Decode$succeed($author$project$Document$Document$Pic))))),
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'content',
				$elm$json$Json$Decode$nullable($author$project$Document$Json$DocumentDecoder$decodeNewsContent),
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'date',
					A2($elm$json$Json$Decode$map, $elm$time$Time$millisToPosix, $elm$json$Json$Decode$int),
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'title',
						$elm$json$Json$Decode$string,
						$elm$json$Json$Decode$succeed($author$project$Document$Document$News)))))));
var $elm$json$Json$Encode$int = _Json_wrap;
var $author$project$Murol$getNews = function (currentTime) {
	var body = $elm$http$Http$jsonBody(
		$elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'currentTime',
					$elm$json$Json$Encode$int(
						$elm$time$Time$posixToMillis(currentTime)))
				])));
	return $elm$http$Http$post(
		{
			d8: body,
			cJ: A2(
				$elm$http$Http$expectJson,
				$author$project$Murol$LoadNews,
				$elm$json$Json$Decode$list($author$project$Document$Json$DocumentDecoder$decodeNews)),
			da: '/getNews.php'
		});
};
var $author$project$Gallery$Gallery$DisplayImage = 0;
var $author$project$Document$Document$dummyPic = {
	fb: $elm$core$Maybe$Nothing,
	eS: A2($author$project$Document$Document$ImgSize, 0, 0),
	eT: A2($author$project$Document$Document$Inline, '', '')
};
var $author$project$Gallery$Gallery$init = F4(
	function (title, hd, images, externalMsg) {
		var images_ = function () {
			var _v0 = $elm$core$List$reverse(images);
			if (_v0.b) {
				var h = _v0.a;
				var t = _v0.b;
				return $elm$core$List$reverse(
					_Utils_ap(
						t,
						_List_fromArray(
							[h])));
			} else {
				return images;
			}
		}();
		var stream = A2(
			$author$project$Internals$Streams$chunkBiStream,
			3,
			function (xs) {
				return A2($author$project$Internals$Streams$biStream, xs, $author$project$Document$Document$dummyPic);
			}(images_));
		return {
			b7: 0,
			bm: 0,
			cK: externalMsg,
			eu: hd,
			ew: A2(
				$elm$core$List$map,
				function ($) {
					return $.eT;
				},
				images),
			X: stream,
			fO: $elm$core$Set$empty,
			cS: $elm$core$Set$empty,
			q: $elm$core$Maybe$Nothing,
			aw: $elm$core$Maybe$Nothing,
			b_: false,
			d0: title
		};
	});
var $elm$browser$Browser$Navigation$load = _Browser_load;
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $elm$core$Set$remove = F2(
	function (key, _v0) {
		var dict = _v0;
		return A2($elm$core$Dict$remove, key, dict);
	});
var $elm$browser$Browser$Dom$setViewportOf = _Browser_setViewportOf;
var $author$project$Murol$toSearchEngine = _Platform_outgoingPort('toSearchEngine', $elm$json$Json$Encode$string);
var $author$project$Gallery$Gallery$Animate = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $author$project$Gallery$GalleryHelpers$AnimateLeft = 0;
var $author$project$Gallery$GalleryHelpers$AnimateRight = 1;
var $author$project$Gallery$Gallery$DisplayGrid = 1;
var $author$project$Gallery$GalleryHelpers$Drag = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $mgold$elm_animation$Animation$A = $elm$core$Basics$identity;
var $mgold$elm_animation$Animation$AnimRecord = F7(
	function (start, delay_, dos, ramp, ease_, from_, to_) {
		return {ab: delay_, M: dos, a9: ease_, z: from_, a$: ramp, j: start, r: to_};
	});
var $mgold$elm_animation$Animation$Duration = function (a) {
	return {$: 0, a: a};
};
var $mgold$elm_animation$Animation$defaultDuration = $mgold$elm_animation$Animation$Duration(750);
var $elm$core$Basics$cos = _Basics_cos;
var $elm$core$Basics$pi = _Basics_pi;
var $mgold$elm_animation$Animation$defaultEase = function (x) {
	return (1 - $elm$core$Basics$cos($elm$core$Basics$pi * x)) / 2;
};
var $mgold$elm_animation$Animation$animation = function (t) {
	return A7($mgold$elm_animation$Animation$AnimRecord, t, 0, $mgold$elm_animation$Animation$defaultDuration, $elm$core$Maybe$Nothing, $mgold$elm_animation$Animation$defaultEase, 0, 1);
};
var $mgold$elm_animation$Animation$ease = F2(
	function (x, _v0) {
		var a = _v0;
		return _Utils_update(
			a,
			{a9: x});
	});
var $mgold$elm_animation$Animation$from = F2(
	function (x, _v0) {
		var a = _v0;
		return _Utils_update(
			a,
			{z: x, a$: $elm$core$Maybe$Nothing});
	});
var $author$project$Internals$Streams$updatePrev = F2(
	function (newPrev, bs) {
		return _Utils_update(
			bs,
			{bW: newPrev});
	});
var $author$project$Internals$Streams$goTo = F2(
	function (bs, p) {
		var value = bs.gJ;
		var leftStr = bs.cP;
		var rightStr = bs.c1;
		var prev = bs.bW;
		var size = bs.eS;
		var helper = function (bs_) {
			helper:
			while (true) {
				if (p(
					$author$project$Internals$Streams$current(bs_))) {
					return A2($author$project$Internals$Streams$updatePrev, prev, bs_);
				} else {
					var $temp$bs_ = $author$project$Internals$Streams$right(bs_);
					bs_ = $temp$bs_;
					continue helper;
				}
			}
		};
		return helper(bs);
	});
var $elm_community$easing_functions$Ease$flip = F2(
	function (easing, time) {
		return 1 - easing(1 - time);
	});
var $elm$core$Basics$sqrt = _Basics_sqrt;
var $elm_community$easing_functions$Ease$outCirc = function (time) {
	return $elm$core$Basics$sqrt(
		1 - A2($elm$core$Basics$pow, time - 1, 2));
};
var $elm_community$easing_functions$Ease$inCirc = $elm_community$easing_functions$Ease$flip($elm_community$easing_functions$Ease$outCirc);
var $elm_community$easing_functions$Ease$inOut = F3(
	function (e1, e2, time) {
		return (time < 0.5) ? (e1(time * 2) / 2) : (0.5 + (e2((time - 0.5) * 2) / 2));
	});
var $elm_community$easing_functions$Ease$inOutCirc = A2($elm_community$easing_functions$Ease$inOut, $elm_community$easing_functions$Ease$inCirc, $elm_community$easing_functions$Ease$outCirc);
var $mgold$elm_animation$Animation$dur = F3(
	function (dos, from_, to_) {
		if (!dos.$) {
			var t = dos.a;
			return t;
		} else {
			var s = dos.a;
			return $elm$core$Basics$abs(to_ - from_) / s;
		}
	});
var $mgold$elm_animation$Animation$isStatic = function (_v0) {
	var from_ = _v0.z;
	var to_ = _v0.r;
	return _Utils_eq(from_, to_);
};
var $mgold$elm_animation$Animation$isDone = F2(
	function (clock, u) {
		var start = u.j;
		var delay_ = u.ab;
		var dos = u.M;
		var from_ = u.z;
		var to_ = u.r;
		var duration_ = A3($mgold$elm_animation$Animation$dur, dos, from_, to_);
		return $mgold$elm_animation$Animation$isStatic(u) || (_Utils_cmp(clock, (start + delay_) + duration_) > -1);
	});
var $author$project$Internals$Streams$left = function (_v0) {
	var value = _v0.gJ;
	var leftStr = _v0.cP;
	var rightStr = _v0.c1;
	var prev = _v0.bW;
	var size = _v0.eS;
	var index = _v0.iL;
	var newRight = function (_v2) {
		return _Utils_Tuple2(value, rightStr);
	};
	var _v1 = $author$project$Internals$Streams$next(leftStr);
	var newCurrent = _v1.a;
	var newLeft = _v1.b;
	return A6(
		$author$project$Internals$Streams$BiStream,
		newCurrent,
		newLeft,
		newRight,
		$elm$core$Maybe$Just(value),
		size,
		A2($elm$core$Basics$modBy, size, index - 1));
};
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Platform$Cmd$map = _Platform_map;
var $mdgriffith$elm_ui$Element$BigDesktop = 3;
var $mdgriffith$elm_ui$Element$Desktop = 2;
var $mdgriffith$elm_ui$Element$Landscape = 1;
var $mdgriffith$elm_ui$Element$Phone = 0;
var $mdgriffith$elm_ui$Element$Portrait = 0;
var $mdgriffith$elm_ui$Element$Tablet = 1;
var $mdgriffith$elm_ui$Element$classifyDevice = function (window) {
	return {
		b6: (window.lb <= 600) ? 0 : (((window.lb > 600) && (window.lb <= 1200)) ? 1 : (((window.lb > 1200) && (window.lb <= 1800)) ? 2 : 3)),
		dP: (_Utils_cmp(window.lb, window.iu) < 0) ? 0 : 1
	};
};
var $author$project$Document$DocumentViews$StyleSheets$docMaxWidth = F3(
	function (_v0, editMode, previewMode) {
		var winWidth = _v0.a;
		var winHeight = _v0.b;
		var device = $mdgriffith$elm_ui$Element$classifyDevice(
			{iu: winHeight, lb: winWidth});
		if (editMode) {
			switch (previewMode) {
				case 0:
					return 1000;
				case 2:
					return 768;
				case 3:
					return 320;
				default:
					return 950;
			}
		} else {
			if (device.b6 === 3) {
				return 1000;
			} else {
				return 1000;
			}
		}
	});
var $author$project$Gallery$Gallery$maxWidth = function (config) {
	return A2(
		$elm$core$Basics$min,
		650,
		A2(
			$elm$core$Basics$min,
			config.lb,
			A3(
				$author$project$Document$DocumentViews$StyleSheets$docMaxWidth,
				_Utils_Tuple2(config.lb, config.iu),
				config.an,
				config.dT)) - 40);
};
var $mgold$elm_animation$Animation$Speed = function (a) {
	return {$: 1, a: a};
};
var $mgold$elm_animation$Animation$speed = F2(
	function (x, _v0) {
		var a = _v0;
		return _Utils_update(
			a,
			{
				M: $mgold$elm_animation$Animation$Speed(
					$elm$core$Basics$abs(x))
			});
	});
var $mgold$elm_animation$Animation$to = F2(
	function (x, _v0) {
		var a = _v0;
		return _Utils_update(
			a,
			{a$: $elm$core$Maybe$Nothing, r: x});
	});
var $author$project$Gallery$Gallery$update = F3(
	function (config, msg, model) {
		switch (msg.$) {
			case 0:
				var _v1 = model.bm;
				if (!_v1) {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{bm: 1}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{bm: 0}),
						$elm$core$Platform$Cmd$none);
				}
			case 1:
				var src = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							bm: 0,
							X: A2(
								$author$project$Internals$Streams$goTo,
								model.X,
								function (chunk) {
									if (((chunk.b && chunk.b.b) && chunk.b.b.b) && (!chunk.b.b.b.b)) {
										var l = chunk.a;
										var _v3 = chunk.b;
										var c = _v3.a;
										var _v4 = _v3.b;
										var r = _v4.a;
										return _Utils_eq(c.eT, src);
									} else {
										return false;
									}
								})
						}),
					$elm$core$Platform$Cmd$none);
			case 2:
				var _v5 = model.q;
				if (!_v5.$) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{q: $elm$core$Maybe$Nothing, b_: true}),
						A2(
							$elm$core$Platform$Cmd$map,
							model.cK,
							A2(
								$elm$core$Task$perform,
								$author$project$Gallery$Gallery$Animate(0),
								$elm$time$Time$now)));
				}
			case 3:
				var _v6 = model.q;
				if (!_v6.$) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{q: $elm$core$Maybe$Nothing, b_: true}),
						A2(
							$elm$core$Platform$Cmd$map,
							model.cK,
							A2(
								$elm$core$Task$perform,
								$author$project$Gallery$Gallery$Animate(1),
								$elm$time$Time$now)));
				}
			case 4:
				var dir = msg.a;
				var t = msg.b;
				var newClock = $elm$time$Time$posixToMillis(t);
				var newAnim = function () {
					var _v7 = model.q;
					if (_v7.$ === 1) {
						return $elm$core$Maybe$Just(
							_Utils_Tuple2(
								A2(
									$mgold$elm_animation$Animation$ease,
									$elm_community$easing_functions$Ease$inOutCirc,
									A2(
										$mgold$elm_animation$Animation$speed,
										1,
										A2(
											$mgold$elm_animation$Animation$to,
											$author$project$Gallery$Gallery$maxWidth(config),
											A2(
												$mgold$elm_animation$Animation$from,
												0,
												$mgold$elm_animation$Animation$animation(newClock))))),
								dir));
					} else {
						return $elm$core$Maybe$Nothing;
					}
				}();
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{q: newAnim}),
					$elm$core$Platform$Cmd$none);
			case 5:
				var position = msg.a;
				var _v8 = model.q;
				if (_v8.$ === 1) {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								aw: $elm$core$Maybe$Just(
									A2($author$project$Gallery$GalleryHelpers$Drag, position, position))
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 6:
				var position = msg.a;
				var updateDrag = F2(
					function (current_, _v10) {
						var start = _v10.a;
						return A2($author$project$Gallery$GalleryHelpers$Drag, start, current_);
					});
				var _v9 = model.q;
				if (_v9.$ === 1) {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								aw: A2(
									$elm$core$Maybe$map,
									updateDrag(position),
									model.aw)
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 7:
				var _v11 = _Utils_Tuple2(model.q, model.aw);
				if ((_v11.a.$ === 1) && (!_v11.b.$)) {
					var _v12 = _v11.a;
					var _v13 = _v11.b.a;
					var start = _v13.a;
					var current_ = _v13.b;
					var newAnimFun = function (x) {
						return A2(
							$mgold$elm_animation$Animation$ease,
							$elm_community$easing_functions$Ease$inOutCirc,
							A2(
								$mgold$elm_animation$Animation$speed,
								1,
								A2(
									$mgold$elm_animation$Animation$to,
									$author$project$Gallery$Gallery$maxWidth(config),
									A2(
										$mgold$elm_animation$Animation$from,
										x,
										$mgold$elm_animation$Animation$animation(model.b7)))));
					};
					if ((start._ - current_._) > 10) {
						var newAnim = function () {
							var _v14 = model.q;
							if (_v14.$ === 1) {
								return $elm$core$Maybe$Just(
									_Utils_Tuple2(
										newAnimFun(start._ - current_._),
										0));
							} else {
								return $elm$core$Maybe$Nothing;
							}
						}();
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{q: newAnim, aw: $elm$core$Maybe$Nothing}),
							$elm$core$Platform$Cmd$none);
					} else {
						if (_Utils_cmp(start._ - current_._, -10) < 0) {
							var newAnim = function () {
								var _v15 = model.q;
								if (_v15.$ === 1) {
									return $elm$core$Maybe$Just(
										_Utils_Tuple2(
											newAnimFun(
												$elm$core$Basics$abs(start._ - current_._)),
											1));
								} else {
									return $elm$core$Maybe$Nothing;
								}
							}();
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{q: newAnim, aw: $elm$core$Maybe$Nothing}),
								$elm$core$Platform$Cmd$none);
						} else {
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{aw: $elm$core$Maybe$Nothing}),
								$elm$core$Platform$Cmd$none);
						}
					}
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 10:
				var t = msg.a;
				var newClock = $elm$time$Time$posixToMillis(t);
				var _v16 = function () {
					var _v17 = model.q;
					if (!_v17.$) {
						if (!_v17.a.b) {
							var _v18 = _v17.a;
							var anim = _v18.a;
							var _v19 = _v18.b;
							return A2($mgold$elm_animation$Animation$isDone, newClock, anim) ? _Utils_Tuple3(
								$elm$core$Maybe$Nothing,
								$author$project$Internals$Streams$right(
									function ($) {
										return $.X;
									}(model)),
								false) : _Utils_Tuple3(model.q, model.X, true);
						} else {
							var _v20 = _v17.a;
							var anim = _v20.a;
							var _v21 = _v20.b;
							return A2($mgold$elm_animation$Animation$isDone, newClock, anim) ? _Utils_Tuple3(
								$elm$core$Maybe$Nothing,
								$author$project$Internals$Streams$left(
									function ($) {
										return $.X;
									}(model)),
								false) : _Utils_Tuple3(model.q, model.X, true);
						}
					} else {
						return _Utils_Tuple3(model.q, model.X, model.b_);
					}
				}();
				var newAnim = _v16.a;
				var newImages = _v16.b;
				var tickSubOn = _v16.c;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{b7: newClock, X: newImages, q: newAnim, b_: tickSubOn}),
					$elm$core$Platform$Cmd$none);
			case 8:
				var src = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							fO: A2($elm$core$Set$insert, src, model.fO)
						}),
					$elm$core$Platform$Cmd$none);
			case 9:
				var src = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							cS: A2($elm$core$Set$insert, src, model.cS)
						}),
					$elm$core$Platform$Cmd$none);
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Gallery$HeaderGallery$AnimateLeft = 0;
var $author$project$Gallery$HeaderGallery$AnimateRight = 1;
var $mgold$elm_animation$Animation$duration = F2(
	function (x, _v0) {
		var a = _v0;
		return _Utils_update(
			a,
			{
				M: $mgold$elm_animation$Animation$Duration(x)
			});
	});
var $elm_community$easing_functions$Ease$inExpo = function (time) {
	return (time === 0.0) ? 0.0 : A2($elm$core$Basics$pow, 2, 10 * (time - 1));
};
var $elm_community$easing_functions$Ease$outExpo = $elm_community$easing_functions$Ease$flip($elm_community$easing_functions$Ease$inExpo);
var $elm_community$easing_functions$Ease$inOutExpo = A2($elm_community$easing_functions$Ease$inOut, $elm_community$easing_functions$Ease$inExpo, $elm_community$easing_functions$Ease$outExpo);
var $elm_community$easing_functions$Ease$linear = $elm$core$Basics$identity;
var $author$project$Gallery$HeaderGallery$update = F3(
	function (config, msg, model) {
		switch (msg.$) {
			case 0:
				var dir = msg.a;
				var t = msg.b;
				var newClock = $elm$time$Time$posixToMillis(t);
				var newAnim = function () {
					var _v1 = _Utils_Tuple2(model.q, dir);
					_v1$2:
					while (true) {
						if (_v1.a.$ === 1) {
							switch (_v1.b) {
								case 0:
									var _v2 = _v1.a;
									var _v3 = _v1.b;
									return $elm$core$Maybe$Just(
										_Utils_Tuple2(
											A2(
												$mgold$elm_animation$Animation$ease,
												$elm_community$easing_functions$Ease$inOutExpo,
												A2(
													$mgold$elm_animation$Animation$speed,
													1,
													A2(
														$mgold$elm_animation$Animation$to,
														config.ad,
														A2(
															$mgold$elm_animation$Animation$from,
															0,
															$mgold$elm_animation$Animation$animation(newClock))))),
											0));
								case 2:
									var _v4 = _v1.a;
									var _v5 = _v1.b;
									return $elm$core$Maybe$Just(
										_Utils_Tuple2(
											A2(
												$mgold$elm_animation$Animation$ease,
												$elm_community$easing_functions$Ease$linear,
												A2(
													$mgold$elm_animation$Animation$duration,
													1500,
													A2(
														$mgold$elm_animation$Animation$to,
														0,
														A2(
															$mgold$elm_animation$Animation$from,
															1,
															$mgold$elm_animation$Animation$animation(newClock))))),
											2));
								default:
									break _v1$2;
							}
						} else {
							break _v1$2;
						}
					}
					return $elm$core$Maybe$Nothing;
				}();
				return _Utils_update(
					model,
					{q: newAnim});
			case 1:
				var position = msg.a;
				var _v6 = model.q;
				if (_v6.$ === 1) {
					return _Utils_update(
						model,
						{
							aw: $elm$core$Maybe$Just(
								A2($author$project$Gallery$GalleryHelpers$Drag, position, position))
						});
				} else {
					return model;
				}
			case 2:
				var position = msg.a;
				var updateDrag = F2(
					function (current_, _v8) {
						var start = _v8.a;
						return A2($author$project$Gallery$GalleryHelpers$Drag, start, current_);
					});
				var _v7 = model.q;
				if (_v7.$ === 1) {
					return _Utils_update(
						model,
						{
							aw: A2(
								$elm$core$Maybe$map,
								updateDrag(position),
								model.aw)
						});
				} else {
					return model;
				}
			case 3:
				var _v9 = _Utils_Tuple2(model.q, model.aw);
				if ((_v9.a.$ === 1) && (!_v9.b.$)) {
					var _v10 = _v9.a;
					var _v11 = _v9.b.a;
					var start = _v11.a;
					var current_ = _v11.b;
					var newAnimFun = function (x) {
						return A2(
							$mgold$elm_animation$Animation$ease,
							$elm_community$easing_functions$Ease$inOutExpo,
							A2(
								$mgold$elm_animation$Animation$speed,
								1,
								A2(
									$mgold$elm_animation$Animation$to,
									config.ad,
									A2(
										$mgold$elm_animation$Animation$from,
										x,
										$mgold$elm_animation$Animation$animation(model.b7)))));
					};
					if ((start._ - current_._) > 10) {
						var newAnim = function () {
							var _v12 = model.q;
							if (_v12.$ === 1) {
								return $elm$core$Maybe$Just(
									_Utils_Tuple2(
										newAnimFun(start._ - current_._),
										0));
							} else {
								return $elm$core$Maybe$Nothing;
							}
						}();
						return _Utils_update(
							model,
							{q: newAnim, aw: $elm$core$Maybe$Nothing});
					} else {
						if (_Utils_cmp(start._ - current_._, -10) < 0) {
							var newAnim = function () {
								var _v13 = model.q;
								if (_v13.$ === 1) {
									return $elm$core$Maybe$Just(
										_Utils_Tuple2(
											newAnimFun(
												$elm$core$Basics$abs(start._ - current_._)),
											1));
								} else {
									return $elm$core$Maybe$Nothing;
								}
							}();
							return _Utils_update(
								model,
								{q: newAnim, aw: $elm$core$Maybe$Nothing});
						} else {
							return _Utils_update(
								model,
								{aw: $elm$core$Maybe$Nothing});
						}
					}
				} else {
					return model;
				}
			case 5:
				var src = msg.a;
				return _Utils_update(
					model,
					{
						fO: A2($elm$core$Set$insert, src, model.fO)
					});
			case 4:
				var t = msg.a;
				var newClock = $elm$time$Time$posixToMillis(t);
				var _v14 = function () {
					var _v15 = model.q;
					if (!_v15.$) {
						switch (_v15.a.b) {
							case 0:
								var _v16 = _v15.a;
								var anim = _v16.a;
								var _v17 = _v16.b;
								return A2($mgold$elm_animation$Animation$isDone, newClock, anim) ? _Utils_Tuple2(
									$elm$core$Maybe$Nothing,
									$author$project$Internals$Streams$right(
										function ($) {
											return $.iF;
										}(model))) : _Utils_Tuple2(model.q, model.iF);
							case 1:
								var _v18 = _v15.a;
								var anim = _v18.a;
								var _v19 = _v18.b;
								return A2($mgold$elm_animation$Animation$isDone, newClock, anim) ? _Utils_Tuple2(
									$elm$core$Maybe$Nothing,
									$author$project$Internals$Streams$left(
										function ($) {
											return $.iF;
										}(model))) : _Utils_Tuple2(model.q, model.iF);
							default:
								var _v20 = _v15.a;
								var anim = _v20.a;
								var _v21 = _v20.b;
								return A2($mgold$elm_animation$Animation$isDone, newClock, anim) ? _Utils_Tuple2(
									$elm$core$Maybe$Nothing,
									$author$project$Internals$Streams$left(
										function ($) {
											return $.iF;
										}(model))) : _Utils_Tuple2(model.q, model.iF);
						}
					} else {
						return _Utils_Tuple2(model.q, model.iF);
					}
				}();
				var newAnim = _v14.a;
				var newImages = _v14.b;
				return _Utils_update(
					model,
					{b7: newClock, iF: newImages, q: newAnim});
			case 6:
				var visibility = msg.a;
				return _Utils_update(
					model,
					{d2: visibility});
			default:
				return model;
		}
	});
var $author$project$Internals$CommonHelpers$httpErrorToString = function (e) {
	switch (e.$) {
		case 0:
			var s = e.a;
			return 'Url invalide: ' + s;
		case 1:
			return 'Délai d\'attente dépassé';
		case 2:
			return 'Erreur de réseau';
		case 3:
			var statusCode = e.a;
			return 'Erreur serveur: ' + $elm$core$String$fromInt(statusCode);
		default:
			var details = e.a;
			return 'Erreur décodage: ' + details;
	}
};
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $author$project$Internals$Contact$loadCaptcha = _Platform_outgoingPort(
	'loadCaptcha',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Internals$Contact$LoadCaptcha = {$: 6};
var $elm$core$Basics$not = _Basics_not;
var $author$project$Internals$Contact$canLoadCaptcha = function (model) {
	return (!$elm$core$String$isEmpty(model.C)) && ((!$elm$core$String$isEmpty(model.h3)) && ((!$elm$core$String$isEmpty(model.cB)) && (!$elm$core$String$isEmpty(model.cT))));
};
var $author$project$Internals$Contact$toCmd = F2(
	function (model, c) {
		return A2(
			$elm$core$Task$perform,
			function (_v0) {
				return model.cK(c);
			},
			$elm$core$Task$succeed(''));
	});
var $author$project$Internals$Contact$loadCaptcha_ = function (model) {
	return ((!model.df) && $author$project$Internals$Contact$canLoadCaptcha(model)) ? A2($author$project$Internals$Contact$toCmd, model, $author$project$Internals$Contact$LoadCaptcha) : $elm$core$Platform$Cmd$none;
};
var $author$project$Internals$Contact$ProcessHttpResult = function (a) {
	return {$: 9, a: a};
};
var $author$project$Internals$Contact$ServerCom = function (a) {
	return {$: 0, a: a};
};
var $author$project$Internals$Contact$decodeServerCom = A2(
	$elm$json$Json$Decode$map,
	$author$project$Internals$Contact$ServerCom,
	A2($elm$json$Json$Decode$field, 'message', $elm$json$Json$Decode$string));
var $author$project$Internals$Contact$ServerError = function (a) {
	return {$: 1, a: a};
};
var $author$project$Internals$Contact$decodeServerError = A2(
	$elm$json$Json$Decode$map,
	$author$project$Internals$Contact$ServerError,
	A2($elm$json$Json$Decode$field, 'serverError', $elm$json$Json$Decode$string));
var $author$project$Internals$Contact$decodeRes = $elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[$author$project$Internals$Contact$decodeServerCom, $author$project$Internals$Contact$decodeServerError]));
var $author$project$Internals$Contact$sendContactInfo = F2(
	function (model, resp) {
		var body = $elm$http$Http$jsonBody(
			$elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'name',
						$elm$json$Json$Encode$string(
							function ($) {
								return $.C;
							}(model))),
						_Utils_Tuple2(
						'company',
						$elm$json$Json$Encode$string(
							function ($) {
								return $.cF;
							}(model))),
						_Utils_Tuple2(
						'email',
						$elm$json$Json$Encode$string(
							function ($) {
								return $.h3;
							}(model))),
						_Utils_Tuple2(
						'phone',
						$elm$json$Json$Encode$string(
							function ($) {
								return $.c$;
							}(model))),
						_Utils_Tuple2(
						'topic',
						$elm$json$Json$Encode$string(
							function ($) {
								return $.cB;
							}(model))),
						_Utils_Tuple2(
						'message',
						$elm$json$Json$Encode$string(
							function ($) {
								return $.cT;
							}(model))),
						_Utils_Tuple2(
						'captchaResponse',
						$elm$json$Json$Encode$string(resp))
					])));
		return $elm$http$Http$post(
			{
				d8: body,
				cJ: A2($elm$http$Http$expectJson, $author$project$Internals$Contact$ProcessHttpResult, $author$project$Internals$Contact$decodeRes),
				da: '/contact.php'
			});
	});
var $author$project$Internals$Contact$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var s = msg.a;
				var newModel = _Utils_update(
					model,
					{C: s});
				return _Utils_Tuple2(
					newModel,
					$author$project$Internals$Contact$loadCaptcha_(newModel));
			case 1:
				var s = msg.a;
				var newModel = _Utils_update(
					model,
					{cF: s});
				return _Utils_Tuple2(
					newModel,
					$author$project$Internals$Contact$loadCaptcha_(newModel));
			case 2:
				var s = msg.a;
				var newModel = _Utils_update(
					model,
					{h3: s});
				return _Utils_Tuple2(
					newModel,
					$author$project$Internals$Contact$loadCaptcha_(newModel));
			case 3:
				var s = msg.a;
				var newModel = _Utils_update(
					model,
					{c$: s});
				return _Utils_Tuple2(
					newModel,
					$author$project$Internals$Contact$loadCaptcha_(newModel));
			case 4:
				var s = msg.a;
				var newModel = _Utils_update(
					model,
					{cB: s});
				return _Utils_Tuple2(
					newModel,
					$author$project$Internals$Contact$loadCaptcha_(newModel));
			case 5:
				var s = msg.a;
				var newModel = _Utils_update(
					model,
					{cT: s});
				return _Utils_Tuple2(
					newModel,
					$author$project$Internals$Contact$loadCaptcha_(newModel));
			case 6:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{df: true}),
					A2(
						$elm$core$Platform$Cmd$map,
						model.cK,
						$author$project$Internals$Contact$loadCaptcha(0)));
			case 7:
				var s = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{cE: s}),
					$elm$core$Platform$Cmd$none);
			case 9:
				var res = msg.a;
				var newModel = function () {
					if (res.$ === 1) {
						var e = res.a;
						return _Utils_update(
							model,
							{
								dt: $author$project$Internals$CommonHelpers$httpErrorToString(e)
							});
					} else {
						if (res.a.$ === 1) {
							var e = res.a.a;
							return _Utils_update(
								model,
								{dt: e});
						} else {
							var m = res.a.a;
							return _Utils_update(
								model,
								{dV: true, cs: false});
						}
					}
				}();
				return _Utils_Tuple2(newModel, $elm$core$Platform$Cmd$none);
			case 8:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{cs: true}),
					A2(
						$elm$core$Platform$Cmd$map,
						model.cK,
						A2(
							$author$project$Internals$Contact$sendContactInfo,
							model,
							function ($) {
								return $.cE;
							}(model))));
			default:
				return _Utils_Tuple2(
					$author$project$Internals$Contact$init(model.cK),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Murol$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 1:
				var urlRequest = msg.a;
				if (!urlRequest.$) {
					var url = urlRequest.a;
					return _Utils_Tuple2(
						model,
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									A2(
									$elm$browser$Browser$Navigation$pushUrl,
									model.dz,
									$elm$url$Url$toString(url)),
									A2(
									$elm$core$Task$attempt,
									function (_v2) {
										return $author$project$Murol$NoOp;
									},
									A3($elm$browser$Browser$Dom$setViewportOf, 'topAnchor', 0, 127))
								])));
				} else {
					var url = urlRequest.a;
					return _Utils_Tuple2(
						model,
						$elm$browser$Browser$Navigation$load(url));
				}
			case 0:
				var url = msg.a;
				var _v3 = A2($elm$core$Dict$get, url.D, model.aY);
				if (!_v3.$) {
					if (!_v3.a.c.$) {
						var _v4 = _v3.a;
						var cId = _v4.a;
						var name = _v4.b;
						var _v5 = _v4.c;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									aY: A3(
										$elm$core$Dict$insert,
										url.D,
										_Utils_Tuple3(cId, name, $author$project$Murol$Loading),
										model.aY),
									da: url
								}),
							$elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										$author$project$Murol$getContent(
										_Utils_Tuple3(url.D, cId, name))
									])));
					} else {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{da: url}),
							$elm$core$Platform$Cmd$none);
					}
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{da: url}),
						$elm$core$Platform$Cmd$none);
				}
			case 3:
				var res = msg.a;
				if (!res.$) {
					var jsonVal = res.a;
					var _v7 = A2($elm$json$Json$Decode$decodeValue, $author$project$Murol$decodePages, jsonVal);
					if (!_v7.$) {
						var _v8 = _v7.a;
						var pages = _v8.a;
						var pageTree = _v8.b;
						var pageIndex = A3(
							$elm$core$Dict$foldr,
							F3(
								function (path, _v12, acc) {
									var cId = _v12.a;
									return A3($elm$core$Dict$insert, cId, path, acc);
								}),
							$elm$core$Dict$empty,
							pages);
						var config = model.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									a: _Utils_update(
										config,
										{f3: pageIndex}),
									cm: $elm$core$Maybe$Just(pageTree),
									aY: pages
								}),
							function () {
								var _v9 = A2($elm$core$Dict$get, model.da.D, pages);
								if (!_v9.$) {
									if (!_v9.a.c.$) {
										var _v10 = _v9.a;
										var cId = _v10.a;
										var name = _v10.b;
										var _v11 = _v10.c;
										return $author$project$Murol$getContent(
											_Utils_Tuple3(model.da.D, cId, name));
									} else {
										return $elm$core$Platform$Cmd$none;
									}
								} else {
									if ((model.da.D === '/accueil/plan%20de%20site') || ((model.da.D === '/accueil/contact') || (model.da.D === '/accueil/mentions%20l%C3%A9gales'))) {
										return $elm$core$Platform$Cmd$none;
									} else {
										var url = model.da;
										return A2(
											$elm$browser$Browser$Navigation$pushUrl,
											model.dz,
											$elm$url$Url$toString(
												_Utils_update(
													url,
													{D: '/accueil'})));
									}
								}
							}());
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 2:
				var _v13 = msg.a;
				var path = _v13.a;
				var cId = _v13.b;
				var name = _v13.c;
				var res = msg.b;
				if (!res.$) {
					var jsonVal = res.a;
					var _v15 = A2($elm$json$Json$Decode$decodeValue, $author$project$PageTreeEditor$PageTreeEditor$decodeContent, jsonVal);
					if (!_v15.$) {
						var contentId = _v15.a.hI;
						var docContent = _v15.a.h0;
						var galleryMetas = $author$project$Document$Document$gatherGalleryMeta(docContent);
						var newGalleries = A3(
							$elm$core$List$foldr,
							F2(
								function (gm, acc) {
									return A3(
										$elm$core$Dict$insert,
										$TSFoster$elm_uuid$UUID$canonical(gm.d1),
										A4(
											$author$project$Gallery$Gallery$init,
											gm.d0,
											gm.iy,
											gm.iF,
											$author$project$Murol$GalleryMsg(
												$TSFoster$elm_uuid$UUID$canonical(gm.d1))),
										acc);
								}),
							model.a.ij,
							galleryMetas);
						var fichesIds = $author$project$Document$Document$gatherFichesIds(docContent);
						var fichesToDownload = A3(
							$elm$core$List$foldr,
							F2(
								function (id, acc) {
									return A2($elm$core$Dict$member, id, model.a.ie) ? acc : A2($elm$core$List$cons, id, acc);
								}),
							_List_Nil,
							fichesIds);
						var config = model.a;
						var newConfig = _Utils_update(
							config,
							{ij: newGalleries});
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									a: newConfig,
									dy: true,
									aY: A3(
										$elm$core$Dict$insert,
										path,
										_Utils_Tuple3(
											cId,
											name,
											$author$project$Murol$Loaded(docContent)),
										model.aY)
								}),
							(!_Utils_eq(fichesToDownload, _List_Nil)) ? $author$project$Murol$getFiches(fichesToDownload) : $elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 4:
				var res = msg.a;
				if (!res.$) {
					var fiches = res.a;
					var config = model.a;
					var newFiches = A3(
						$elm$core$List$foldr,
						F2(
							function (f, acc) {
								return A3(
									$elm$core$Dict$insert,
									$TSFoster$elm_uuid$UUID$canonical(f.d1),
									f,
									acc);
							}),
						config.ie,
						fiches);
					var newConfig = _Utils_update(
						config,
						{ie: newFiches});
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{a: newConfig}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 5:
				var res = msg.a;
				if (!res.$) {
					var news = res.a;
					var newsDict = A3(
						$elm$core$List$foldr,
						F2(
							function (n, acc) {
								return A3(
									$elm$core$Dict$insert,
									$TSFoster$elm_uuid$UUID$canonical(n.d1),
									n,
									acc);
							}),
						$elm$core$Dict$empty,
						news);
					var config = model.a;
					var newConfig = _Utils_update(
						config,
						{fU: newsDict});
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{a: newConfig}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 6:
				var res = msg.a;
				if (!res.$) {
					var publications = res.a;
					var config = model.a;
					var newConfig = _Utils_update(
						config,
						{
							eK: $elm$core$Maybe$Just(publications)
						});
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{a: newConfig}),
						$elm$core$Platform$Cmd$none);
				} else {
					var e = res.a;
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 7:
				var s = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{cr: s}),
					$author$project$Murol$toSearchEngine(
						A2(
							$elm$json$Json$Encode$encode,
							0,
							$elm$json$Json$Encode$object(
								_List_fromArray(
									[
										_Utils_Tuple2(
										'SearchStr',
										$elm$json$Json$Encode$string(s))
									])))));
			case 8:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bY: 1}),
					$author$project$Murol$toSearchEngine(
						A2(
							$elm$json$Json$Encode$encode,
							0,
							$elm$json$Json$Encode$string('<Cmd -> Search>'))));
			case 9:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bY: 0, cr: ''}),
					$author$project$Murol$toSearchEngine(
						A2(
							$elm$json$Json$Encode$encode,
							0,
							$elm$json$Json$Encode$string('<Cmd -> Reset>'))));
			case 10:
				var s = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							dY: $elm$core$Result$toMaybe(
								A2($elm$json$Json$Decode$decodeString, $author$project$Murol$decodeSearchResults, s)),
							bY: 2
						}),
					$elm$core$Platform$Cmd$none);
			case 11:
				var t = msg.a;
				var config = model.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							a: _Utils_update(
								config,
								{hO: t})
						}),
					$author$project$Murol$getNews(t));
			case 12:
				var season = msg.a;
				var config = model.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							a: _Utils_update(
								config,
								{j5: season})
						}),
					$elm$core$Platform$Cmd$none);
			case 13:
				var width = msg.a;
				var height = msg.b;
				var cfg = model.a;
				var newConfig = _Utils_update(
					cfg,
					{iu: height, lb: width});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: newConfig}),
					$elm$core$Platform$Cmd$batch(_List_Nil));
			case 14:
				var fId = msg.a;
				var config = model.a;
				var newConfig = _Utils_update(
					config,
					{
						jB: A2($elm$core$Set$member, fId, config.jB) ? A2($elm$core$Set$remove, fId, config.jB) : A2($elm$core$Set$insert, fId, config.jB)
					});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: newConfig}),
					$elm$core$Platform$Cmd$none);
			case 15:
				var nId = msg.a;
				var config = model.a;
				var newConfig = _Utils_update(
					config,
					{
						f1: A2($elm$core$Set$member, nId, config.f1) ? A2($elm$core$Set$remove, nId, config.f1) : A2($elm$core$Set$insert, nId, config.f1)
					});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: newConfig}),
					$elm$core$Platform$Cmd$none);
			case 16:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{c7: $elm$core$Maybe$Nothing}),
					$elm$core$Platform$Cmd$none);
			case 17:
				var s = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							c7: $elm$core$Maybe$Just(s)
						}),
					$elm$core$Platform$Cmd$none);
			case 18:
				var z = msg.a;
				var cfg = model.a;
				var newConfig = _Utils_update(
					cfg,
					{e0: z});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: newConfig}),
					$elm$core$Platform$Cmd$none);
			case 19:
				var contactMsg = msg.a;
				var _v19 = A2($author$project$Internals$Contact$update, contactMsg, model.b8);
				var contact = _v19.a;
				var contactCmd = _v19.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{b8: contact}),
					contactCmd);
			case 20:
				var hgMsg = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							ch: A3(
								$author$project$Gallery$HeaderGallery$update,
								{
									ad: A2($elm$core$Basics$min, 1000, model.a.lb)
								},
								hgMsg,
								model.ch)
						}),
					$elm$core$Platform$Cmd$none);
			case 21:
				var uuid = msg.a;
				var galMsg = msg.b;
				var _v20 = A2($elm$core$Dict$get, uuid, model.a.ij);
				if (!_v20.$) {
					var gallery = _v20.a;
					var config = model.a;
					var _v21 = A3($author$project$Gallery$Gallery$update, model.a, galMsg, gallery);
					var newGallery = _v21.a;
					var cmds = _v21.b;
					var newConfig = _Utils_update(
						config,
						{
							ij: A3($elm$core$Dict$insert, uuid, newGallery, config.ij)
						});
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{a: newConfig}),
						cmds);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Document$DocumentViews$StyleSheets$backgroundImage = function (season) {
	switch (season) {
		case 0:
			return '/assets/images/backgrounds/springbg2017.jpg';
		case 1:
			return '/assets/images/backgrounds/summer.jpg';
		case 3:
			return '/assets/images/backgrounds/winter_bg.jpg';
		default:
			return '/assets/images/backgrounds/automne_bg2.jpg';
	}
};
var $mdgriffith$elm_ui$Internal$Model$AlignX = function (a) {
	return {$: 6, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$CenterX = 1;
var $mdgriffith$elm_ui$Element$centerX = $mdgriffith$elm_ui$Internal$Model$AlignX(1);
var $mdgriffith$elm_ui$Internal$Model$Colored = F3(
	function (a, b, c) {
		return {$: 4, a: a, b: b, c: c};
	});
var $mdgriffith$elm_ui$Internal$Model$StyleClass = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Flag$Flag = function (a) {
	return {$: 0, a: a};
};
var $mdgriffith$elm_ui$Internal$Flag$Second = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $mdgriffith$elm_ui$Internal$Flag$flag = function (i) {
	return (i > 31) ? $mdgriffith$elm_ui$Internal$Flag$Second(1 << (i - 32)) : $mdgriffith$elm_ui$Internal$Flag$Flag(1 << i);
};
var $mdgriffith$elm_ui$Internal$Flag$bgColor = $mdgriffith$elm_ui$Internal$Flag$flag(8);
var $elm$core$Basics$round = _Basics_round;
var $mdgriffith$elm_ui$Internal$Model$floatClass = function (x) {
	return $elm$core$String$fromInt(
		$elm$core$Basics$round(x * 255));
};
var $mdgriffith$elm_ui$Internal$Model$formatColorClass = function (_v0) {
	var red = _v0.a;
	var green = _v0.b;
	var blue = _v0.c;
	var alpha = _v0.d;
	return $mdgriffith$elm_ui$Internal$Model$floatClass(red) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(green) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(blue) + ('-' + $mdgriffith$elm_ui$Internal$Model$floatClass(alpha))))));
};
var $mdgriffith$elm_ui$Element$Background$color = function (clr) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$bgColor,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Colored,
			'bg-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(clr),
			'background-color',
			clr));
};
var $mdgriffith$elm_ui$Internal$Flag$fontColor = $mdgriffith$elm_ui$Internal$Flag$flag(14);
var $mdgriffith$elm_ui$Element$Font$color = function (fontColor) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$fontColor,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Colored,
			'fc-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(fontColor),
			'color',
			fontColor));
};
var $mdgriffith$elm_ui$Internal$Model$Unkeyed = function (a) {
	return {$: 0, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$AsColumn = 1;
var $mdgriffith$elm_ui$Internal$Model$asColumn = 1;
var $mdgriffith$elm_ui$Internal$Style$classes = {gQ: 'a', d3: 'atv', gX: 'ab', gY: 'cx', gZ: 'cy', g_: 'acb', g$: 'accx', g0: 'accy', g1: 'acr', e3: 'al', e4: 'ar', g2: 'at', d4: 'ah', d5: 'av', g6: 's', hc: 'bh', hd: 'b', hg: 'w7', hi: 'bd', hj: 'bdt', dd: 'bn', hk: 'bs', dg: 'cpe', hy: 'cp', hz: 'cpx', hA: 'cpy', ea: 'c', di: 'ctr', dj: 'cb', dk: 'ccx', bl: 'ccy', cH: 'cl', dl: 'cr', hJ: 'ct', hP: 'cptr', hQ: 'ctxt', fs: 'fcs', ii: 'fs', ip: 'g', et: 'hbh', dv: 'hc', ev: 'hf', fA: 'hfp', W: 'hv', iD: 'ic', iK: 'fr', iN: 'iml', iO: 'it', iR: 'i', cl: 'nb', fV: 'notxt', ju: 'ol', jv: 'or', bU: 'oq', jE: 'oh', f2: 'pg', f4: 'p', jH: 'ppe', I: 'ui', gj: 'r', j1: 'sb', j2: 'sbx', j3: 'sby', j4: 'sbt', km: 'e', ko: 'cap', kq: 'sev', kz: 'sk', c3: 't', kL: 'tc', kN: 'w8', kO: 'w2', kP: 'w9', kQ: 'tj', d$: 'tja', kR: 'tl', kS: 'w3', kT: 'w5', kU: 'w4', kV: 'tr', kW: 'w6', kY: 'w1', kZ: 'tun', gH: 'ts', b$: 'clr', gI: 'u', eY: 'wc', gN: 'we', eZ: 'wf', gO: 'wfp', e_: 'wrp'};
var $mdgriffith$elm_ui$Internal$Model$Generic = {$: 0};
var $mdgriffith$elm_ui$Internal$Model$div = $mdgriffith$elm_ui$Internal$Model$Generic;
var $mdgriffith$elm_ui$Internal$Model$NoNearbyChildren = {$: 0};
var $mdgriffith$elm_ui$Internal$Model$columnClass = $mdgriffith$elm_ui$Internal$Style$classes.g6 + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.ea);
var $mdgriffith$elm_ui$Internal$Model$gridClass = $mdgriffith$elm_ui$Internal$Style$classes.g6 + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.ip);
var $mdgriffith$elm_ui$Internal$Model$pageClass = $mdgriffith$elm_ui$Internal$Style$classes.g6 + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.f2);
var $mdgriffith$elm_ui$Internal$Model$paragraphClass = $mdgriffith$elm_ui$Internal$Style$classes.g6 + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.f4);
var $mdgriffith$elm_ui$Internal$Model$rowClass = $mdgriffith$elm_ui$Internal$Style$classes.g6 + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.gj);
var $mdgriffith$elm_ui$Internal$Model$singleClass = $mdgriffith$elm_ui$Internal$Style$classes.g6 + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.km);
var $mdgriffith$elm_ui$Internal$Model$contextClasses = function (context) {
	switch (context) {
		case 0:
			return $mdgriffith$elm_ui$Internal$Model$rowClass;
		case 1:
			return $mdgriffith$elm_ui$Internal$Model$columnClass;
		case 2:
			return $mdgriffith$elm_ui$Internal$Model$singleClass;
		case 3:
			return $mdgriffith$elm_ui$Internal$Model$gridClass;
		case 4:
			return $mdgriffith$elm_ui$Internal$Model$paragraphClass;
		default:
			return $mdgriffith$elm_ui$Internal$Model$pageClass;
	}
};
var $mdgriffith$elm_ui$Internal$Model$Keyed = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$NoStyleSheet = {$: 0};
var $mdgriffith$elm_ui$Internal$Model$Styled = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$Unstyled = function (a) {
	return {$: 0, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$addChildren = F2(
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
var $mdgriffith$elm_ui$Internal$Model$addKeyedChildren = F3(
	function (key, existing, nearbyChildren) {
		switch (nearbyChildren.$) {
			case 0:
				return existing;
			case 1:
				var behind = nearbyChildren.a;
				return _Utils_ap(
					A2(
						$elm$core$List$map,
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
						$elm$core$List$map,
						function (x) {
							return _Utils_Tuple2(key, x);
						},
						inFront));
			default:
				var behind = nearbyChildren.a;
				var inFront = nearbyChildren.b;
				return _Utils_ap(
					A2(
						$elm$core$List$map,
						function (x) {
							return _Utils_Tuple2(key, x);
						},
						behind),
					_Utils_ap(
						existing,
						A2(
							$elm$core$List$map,
							function (x) {
								return _Utils_Tuple2(key, x);
							},
							inFront)));
		}
	});
var $mdgriffith$elm_ui$Internal$Model$AsEl = 2;
var $mdgriffith$elm_ui$Internal$Model$asEl = 2;
var $mdgriffith$elm_ui$Internal$Model$AsParagraph = 4;
var $mdgriffith$elm_ui$Internal$Model$asParagraph = 4;
var $mdgriffith$elm_ui$Internal$Flag$alignBottom = $mdgriffith$elm_ui$Internal$Flag$flag(41);
var $mdgriffith$elm_ui$Internal$Flag$alignRight = $mdgriffith$elm_ui$Internal$Flag$flag(40);
var $mdgriffith$elm_ui$Internal$Flag$centerX = $mdgriffith$elm_ui$Internal$Flag$flag(42);
var $mdgriffith$elm_ui$Internal$Flag$centerY = $mdgriffith$elm_ui$Internal$Flag$flag(43);
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$div = _VirtualDom_node('div');
var $mdgriffith$elm_ui$Internal$Model$lengthClassName = function (x) {
	switch (x.$) {
		case 0:
			var px = x.a;
			return $elm$core$String$fromInt(px) + 'px';
		case 1:
			return 'auto';
		case 2:
			var i = x.a;
			return $elm$core$String$fromInt(i) + 'fr';
		case 3:
			var min = x.a;
			var len = x.b;
			return 'min' + ($elm$core$String$fromInt(min) + $mdgriffith$elm_ui$Internal$Model$lengthClassName(len));
		default:
			var max = x.a;
			var len = x.b;
			return 'max' + ($elm$core$String$fromInt(max) + $mdgriffith$elm_ui$Internal$Model$lengthClassName(len));
	}
};
var $mdgriffith$elm_ui$Internal$Model$transformClass = function (transform) {
	switch (transform.$) {
		case 0:
			return $elm$core$Maybe$Nothing;
		case 1:
			var _v1 = transform.a;
			var x = _v1.a;
			var y = _v1.b;
			var z = _v1.c;
			return $elm$core$Maybe$Just(
				'mv-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(x) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(y) + ('-' + $mdgriffith$elm_ui$Internal$Model$floatClass(z))))));
		default:
			var _v2 = transform.a;
			var tx = _v2.a;
			var ty = _v2.b;
			var tz = _v2.c;
			var _v3 = transform.b;
			var sx = _v3.a;
			var sy = _v3.b;
			var sz = _v3.c;
			var _v4 = transform.c;
			var ox = _v4.a;
			var oy = _v4.b;
			var oz = _v4.c;
			var angle = transform.d;
			return $elm$core$Maybe$Just(
				'tfrm-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(tx) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(ty) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(tz) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(sx) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(sy) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(sz) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(ox) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(oy) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(oz) + ('-' + $mdgriffith$elm_ui$Internal$Model$floatClass(angle))))))))))))))))))));
	}
};
var $mdgriffith$elm_ui$Internal$Model$getStyleName = function (style) {
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
			return 'font-size-' + $elm$core$String$fromInt(i);
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
				$elm$core$String$join,
				'-',
				A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$lengthClassName, template.j$)) + ('-cols-' + (A2(
				$elm$core$String$join,
				'-',
				A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$lengthClassName, template.hD)) + ('-space-x-' + ($mdgriffith$elm_ui$Internal$Model$lengthClassName(template.kr.a) + ('-space-y-' + $mdgriffith$elm_ui$Internal$Model$lengthClassName(template.kr.b)))))));
		case 9:
			var pos = style.a;
			return 'gp grid-pos-' + ($elm$core$String$fromInt(pos.gj) + ('-' + ($elm$core$String$fromInt(pos.fg) + ('-' + ($elm$core$String$fromInt(pos.lb) + ('-' + $elm$core$String$fromInt(pos.iu)))))));
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
				$elm$core$String$join,
				' ',
				A2(
					$elm$core$List$map,
					function (sty) {
						var _v1 = $mdgriffith$elm_ui$Internal$Model$getStyleName(sty);
						if (_v1 === '') {
							return '';
						} else {
							var styleName = _v1;
							return styleName + ('-' + name);
						}
					},
					subStyle));
		default:
			var x = style.a;
			return A2(
				$elm$core$Maybe$withDefault,
				'',
				$mdgriffith$elm_ui$Internal$Model$transformClass(x));
	}
};
var $mdgriffith$elm_ui$Internal$Model$reduceStyles = F2(
	function (style, nevermind) {
		var cache = nevermind.a;
		var existing = nevermind.b;
		var styleName = $mdgriffith$elm_ui$Internal$Model$getStyleName(style);
		return A2($elm$core$Set$member, styleName, cache) ? nevermind : _Utils_Tuple2(
			A2($elm$core$Set$insert, styleName, cache),
			A2($elm$core$List$cons, style, existing));
	});
var $mdgriffith$elm_ui$Internal$Model$Property = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$Style = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$dot = function (c) {
	return '.' + c;
};
var $elm$core$String$fromFloat = _String_fromNumber;
var $mdgriffith$elm_ui$Internal$Model$formatColor = function (_v0) {
	var red = _v0.a;
	var green = _v0.b;
	var blue = _v0.c;
	var alpha = _v0.d;
	return 'rgba(' + ($elm$core$String$fromInt(
		$elm$core$Basics$round(red * 255)) + ((',' + $elm$core$String$fromInt(
		$elm$core$Basics$round(green * 255))) + ((',' + $elm$core$String$fromInt(
		$elm$core$Basics$round(blue * 255))) + (',' + ($elm$core$String$fromFloat(alpha) + ')')))));
};
var $mdgriffith$elm_ui$Internal$Model$formatBoxShadow = function (shadow) {
	return A2(
		$elm$core$String$join,
		' ',
		A2(
			$elm$core$List$filterMap,
			$elm$core$Basics$identity,
			_List_fromArray(
				[
					shadow.fE ? $elm$core$Maybe$Just('inset') : $elm$core$Maybe$Nothing,
					$elm$core$Maybe$Just(
					$elm$core$String$fromFloat(shadow.js.a) + 'px'),
					$elm$core$Maybe$Just(
					$elm$core$String$fromFloat(shadow.js.b) + 'px'),
					$elm$core$Maybe$Just(
					$elm$core$String$fromFloat(shadow.hf) + 'px'),
					$elm$core$Maybe$Just(
					$elm$core$String$fromFloat(shadow.eS) + 'px'),
					$elm$core$Maybe$Just(
					$mdgriffith$elm_ui$Internal$Model$formatColor(shadow.hB))
				])));
};
var $elm$core$Tuple$mapFirst = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			func(x),
			y);
	});
var $elm$core$Tuple$mapSecond = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			x,
			func(y));
	});
var $mdgriffith$elm_ui$Internal$Model$renderFocusStyle = function (focus) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$Style,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g6) + (':focus .focusable, ' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g6) + '.focusable:focus')),
		A2(
			$elm$core$List$filterMap,
			$elm$core$Basics$identity,
			_List_fromArray(
				[
					A2(
					$elm$core$Maybe$map,
					function (color) {
						return A2(
							$mdgriffith$elm_ui$Internal$Model$Property,
							'border-color',
							$mdgriffith$elm_ui$Internal$Model$formatColor(color));
					},
					focus.hh),
					A2(
					$elm$core$Maybe$map,
					function (color) {
						return A2(
							$mdgriffith$elm_ui$Internal$Model$Property,
							'background-color',
							$mdgriffith$elm_ui$Internal$Model$formatColor(color));
					},
					focus.g9),
					A2(
					$elm$core$Maybe$map,
					function (shadow) {
						return A2(
							$mdgriffith$elm_ui$Internal$Model$Property,
							'box-shadow',
							$mdgriffith$elm_ui$Internal$Model$formatBoxShadow(
								{
									hf: shadow.hf,
									hB: shadow.hB,
									fE: false,
									js: A2(
										$elm$core$Tuple$mapSecond,
										$elm$core$Basics$toFloat,
										A2($elm$core$Tuple$mapFirst, $elm$core$Basics$toFloat, shadow.js)),
									eS: shadow.eS
								}));
					},
					focus.kl),
					$elm$core$Maybe$Just(
					A2($mdgriffith$elm_ui$Internal$Model$Property, 'outline', 'none'))
				])));
};
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $mdgriffith$elm_ui$Internal$Style$Batch = function (a) {
	return {$: 5, a: a};
};
var $mdgriffith$elm_ui$Internal$Style$Child = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Class = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Descriptor = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Left = 3;
var $mdgriffith$elm_ui$Internal$Style$Prop = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Right = 2;
var $mdgriffith$elm_ui$Internal$Style$Self = $elm$core$Basics$identity;
var $mdgriffith$elm_ui$Internal$Style$Supports = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Content = $elm$core$Basics$identity;
var $mdgriffith$elm_ui$Internal$Style$Bottom = 1;
var $mdgriffith$elm_ui$Internal$Style$CenterX = 4;
var $mdgriffith$elm_ui$Internal$Style$CenterY = 5;
var $mdgriffith$elm_ui$Internal$Style$Top = 0;
var $mdgriffith$elm_ui$Internal$Style$alignments = _List_fromArray(
	[0, 1, 2, 3, 4, 5]);
var $mdgriffith$elm_ui$Internal$Style$contentName = function (desc) {
	switch (desc) {
		case 0:
			var _v1 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hJ);
		case 1:
			var _v2 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dj);
		case 2:
			var _v3 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dl);
		case 3:
			var _v4 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cH);
		case 4:
			var _v5 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dk);
		default:
			var _v6 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bl);
	}
};
var $mdgriffith$elm_ui$Internal$Style$selfName = function (desc) {
	switch (desc) {
		case 0:
			var _v1 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g2);
		case 1:
			var _v2 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gX);
		case 2:
			var _v3 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.e4);
		case 3:
			var _v4 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.e3);
		case 4:
			var _v5 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gY);
		default:
			var _v6 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gZ);
	}
};
var $mdgriffith$elm_ui$Internal$Style$describeAlignment = function (values) {
	var createDescription = function (alignment) {
		var _v0 = values(alignment);
		var content = _v0.a;
		var indiv = _v0.b;
		return _List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$contentName(alignment),
				content),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g6),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$selfName(alignment),
						indiv)
					]))
			]);
	};
	return $mdgriffith$elm_ui$Internal$Style$Batch(
		A2($elm$core$List$concatMap, createDescription, $mdgriffith$elm_ui$Internal$Style$alignments));
};
var $mdgriffith$elm_ui$Internal$Style$elDescription = _List_fromArray(
	[
		A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
		A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'column'),
		A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre'),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Descriptor,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.et),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '0'),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hc),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '-1')
					]))
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Descriptor,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.j4),
		_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.c3),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ev),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eZ),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'auto !important')
							]))
					]))
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dv),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', 'auto')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ev),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '100000')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eZ),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eY),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
			])),
		$mdgriffith$elm_ui$Internal$Style$describeAlignment(
		function (alignment) {
			switch (alignment) {
				case 0:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-start')
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', '0 !important')
							]));
				case 1:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-end')
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', '0 !important')
							]));
				case 2:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-end')
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-end')
							]));
				case 3:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-start')
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
							]));
				case 4:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'center')
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'center')
							]));
				default:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g6),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto')
									]))
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important')
							]));
			}
		})
	]);
var $mdgriffith$elm_ui$Internal$Style$gridAlignments = function (values) {
	var createDescription = function (alignment) {
		return _List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g6),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$selfName(alignment),
						values(alignment))
					]))
			]);
	};
	return $mdgriffith$elm_ui$Internal$Style$Batch(
		A2($elm$core$List$concatMap, createDescription, $mdgriffith$elm_ui$Internal$Style$alignments));
};
var $mdgriffith$elm_ui$Internal$Style$Above = 0;
var $mdgriffith$elm_ui$Internal$Style$Behind = 5;
var $mdgriffith$elm_ui$Internal$Style$Below = 1;
var $mdgriffith$elm_ui$Internal$Style$OnLeft = 3;
var $mdgriffith$elm_ui$Internal$Style$OnRight = 2;
var $mdgriffith$elm_ui$Internal$Style$Within = 4;
var $mdgriffith$elm_ui$Internal$Style$locations = function () {
	var loc = 0;
	var _v0 = function () {
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
var $mdgriffith$elm_ui$Internal$Style$baseSheet = _List_fromArray(
	[
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		'html,body',
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'padding', '0'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		_Utils_ap(
			$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g6),
			_Utils_ap(
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.km),
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.iD))),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'block')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g6) + ':focus',
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'outline', 'none')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.I),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', 'auto'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'min-height', '100%'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '0'),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				_Utils_ap(
					$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g6),
					$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ev)),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ev),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.iK),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cl),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'fixed')
							]))
					]))
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cl),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'relative'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border', 'none'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'row'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto'),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.km),
				$mdgriffith$elm_ui$Internal$Style$elDescription),
				$mdgriffith$elm_ui$Internal$Style$Batch(
				function (fn) {
					return A2($elm$core$List$map, fn, $mdgriffith$elm_ui$Internal$Style$locations);
				}(
					function (loc) {
						switch (loc) {
							case 0:
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gQ),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'bottom', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '20'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ev),
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', 'auto')
												])),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eZ),
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
												])),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
							case 1:
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hd),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'bottom', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '20'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												])),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ev),
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', 'auto')
												]))
										]));
							case 2:
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.jv),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '20'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
							case 3:
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ju),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'right', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '20'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
							case 4:
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.iK),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
							default:
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hc),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
						}
					}))
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g6),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'relative'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border', 'none'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '0'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'row'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'resize', 'none'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-feature-settings', 'inherit'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'box-sizing', 'border-box'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'padding', '0'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-width', '0'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-style', 'solid'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-size', 'inherit'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'color', 'inherit'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-family', 'inherit'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'line-height', '1'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', 'inherit'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration', 'none'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-style', 'inherit'),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.e_),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-wrap', 'wrap')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.fV),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, '-moz-user-select', 'none'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, '-webkit-user-select', 'none'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, '-ms-user-select', 'none'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'user-select', 'none')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hP),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'cursor', 'pointer')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hQ),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'cursor', 'text')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.jH),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none !important')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dg),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto !important')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.b$),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bU),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.W, $mdgriffith$elm_ui$Internal$Style$classes.b$)) + ':hover',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.W, $mdgriffith$elm_ui$Internal$Style$classes.bU)) + ':hover',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.fs, $mdgriffith$elm_ui$Internal$Style$classes.b$)) + ':focus',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.fs, $mdgriffith$elm_ui$Internal$Style$classes.bU)) + ':focus',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.d3, $mdgriffith$elm_ui$Internal$Style$classes.b$)) + ':active',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.d3, $mdgriffith$elm_ui$Internal$Style$classes.bU)) + ':active',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gH),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Prop,
						'transition',
						A2(
							$elm$core$String$join,
							', ',
							A2(
								$elm$core$List$map,
								function (x) {
									return x + ' 160ms';
								},
								_List_fromArray(
									['transform', 'opacity', 'filter', 'background-color', 'color', 'font-size']))))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.j1),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow', 'auto'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.j2),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-x', 'auto'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gj),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '1')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.j3),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-y', 'auto'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ea),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '1')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.km),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '1')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hy),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow', 'hidden')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hz),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-x', 'hidden')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hA),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-y', 'hidden')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eY),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', 'auto')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dd),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-width', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hi),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-style', 'dashed')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hj),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-style', 'dotted')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hk),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-style', 'solid')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.c3),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline-block')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.iO),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'line-height', '1.05')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.km),
				$mdgriffith$elm_ui$Internal$Style$elDescription),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gj),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'row'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g6),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', '0%'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gN),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ev),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'stretch !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.fA),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'stretch !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eZ),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '100000')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.di),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'stretch')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'u:first-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.g1,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:first-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.g$,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gY),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-left', 'auto !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:last-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.g$,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gY),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-right', 'auto !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:only-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.g$,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gZ),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:last-of-type.' + ($mdgriffith$elm_ui$Internal$Style$classes.g$ + ' ~ u'),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'u:first-of-type.' + ($mdgriffith$elm_ui$Internal$Style$classes.g1 + (' ~ s.' + $mdgriffith$elm_ui$Internal$Style$classes.g$)),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						$mdgriffith$elm_ui$Internal$Style$describeAlignment(
						function (alignment) {
							switch (alignment) {
								case 0:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-start')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
											]));
								case 1:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-end')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-end')
											]));
								case 2:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-end')
											]),
										_List_Nil);
								case 3:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-start')
											]),
										_List_Nil);
								case 4:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'center')
											]),
										_List_Nil);
								default:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'center')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'center')
											]));
							}
						}),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kq),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'space-between')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ea),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'column'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ev),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '100000')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eZ),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gO),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eY),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'u:first-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.g_,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:first-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.g0,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gZ),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', '0 !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:last-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.g0,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gZ),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', '0 !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:only-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.g0,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gZ),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:last-of-type.' + ($mdgriffith$elm_ui$Internal$Style$classes.g0 + ' ~ u'),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'u:first-of-type.' + ($mdgriffith$elm_ui$Internal$Style$classes.g_ + (' ~ s.' + $mdgriffith$elm_ui$Internal$Style$classes.g0)),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						$mdgriffith$elm_ui$Internal$Style$describeAlignment(
						function (alignment) {
							switch (alignment) {
								case 0:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-start')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto')
											]));
								case 1:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-end')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto')
											]));
								case 2:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-end')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-end')
											]));
								case 3:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-start')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
											]));
								case 4:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'center')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'center')
											]));
								default:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'center')
											]),
										_List_Nil);
							}
						}),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.di),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'stretch !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kq),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'space-between')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ip),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', '-ms-grid'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'.gp',
						_List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g6),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Supports,
						_Utils_Tuple2('display', 'grid'),
						_List_fromArray(
							[
								_Utils_Tuple2('display', 'grid')
							])),
						$mdgriffith$elm_ui$Internal$Style$gridAlignments(
						function (alignment) {
							switch (alignment) {
								case 0:
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-start')
										]);
								case 1:
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-end')
										]);
								case 2:
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-end')
										]);
								case 3:
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-start')
										]);
								case 4:
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'center')
										]);
								default:
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'center')
										]);
							}
						})
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.f2),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'block'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g6 + ':first-child'),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot(
							$mdgriffith$elm_ui$Internal$Style$classes.g6 + ($mdgriffith$elm_ui$Internal$Style$selfName(3) + (':first-child + .' + $mdgriffith$elm_ui$Internal$Style$classes.g6))),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot(
							$mdgriffith$elm_ui$Internal$Style$classes.g6 + ($mdgriffith$elm_ui$Internal$Style$selfName(2) + (':first-child + .' + $mdgriffith$elm_ui$Internal$Style$classes.g6))),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important')
							])),
						$mdgriffith$elm_ui$Internal$Style$describeAlignment(
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
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'float', 'right'),
												A2(
												$mdgriffith$elm_ui$Internal$Style$Descriptor,
												'::after',
												_List_fromArray(
													[
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'content', '\"\"'),
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'table'),
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'clear', 'both')
													]))
											]));
								case 3:
									return _Utils_Tuple2(
										_List_Nil,
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'float', 'left'),
												A2(
												$mdgriffith$elm_ui$Internal$Style$Descriptor,
												'::after',
												_List_fromArray(
													[
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'content', '\"\"'),
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'table'),
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'clear', 'both')
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
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.iN),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre-wrap')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.f4),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'block'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.et),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '0'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hc),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '-1')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.c3),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.km),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.iK),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hc),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gQ),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hd),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.jv),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ju),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.c3),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gj),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline-flex')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ea),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline-flex')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ip),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline-grid')
							])),
						$mdgriffith$elm_ui$Internal$Style$describeAlignment(
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
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'float', 'right')
											]));
								case 3:
									return _Utils_Tuple2(
										_List_Nil,
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'float', 'left')
											]));
								case 4:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								default:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
							}
						})
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				'.hidden',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'none')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kY),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '100')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kO),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '200')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kS),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '300')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kU),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '400')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kT),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '500')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kW),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '600')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hg),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '700')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kN),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '800')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kP),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '900')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.iR),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-style', 'italic')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kz),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration', 'line-through')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gI),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration', 'underline'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration-skip-ink', 'auto'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration-skip', 'ink')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				_Utils_ap(
					$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gI),
					$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kz)),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration', 'line-through underline'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration-skip-ink', 'auto'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration-skip', 'ink')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kZ),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-style', 'normal')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kQ),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'justify')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.d$),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'justify-all')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kL),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'center')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kV),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'right')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kR),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'left')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				'.modal',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'fixed'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none')
					]))
			]))
	]);
var $mdgriffith$elm_ui$Internal$Style$fontVariant = function (_var) {
	return _List_fromArray(
		[
			A2(
			$mdgriffith$elm_ui$Internal$Style$Class,
			'.v-' + _var,
			_List_fromArray(
				[
					A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-feature-settings', '\"' + (_var + '\"'))
				])),
			A2(
			$mdgriffith$elm_ui$Internal$Style$Class,
			'.v-' + (_var + '-off'),
			_List_fromArray(
				[
					A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-feature-settings', '\"' + (_var + '\" 0'))
				]))
		]);
};
var $mdgriffith$elm_ui$Internal$Style$commonValues = $elm$core$List$concat(
	_List_fromArray(
		[
			A2(
			$elm$core$List$map,
			function (x) {
				return A2(
					$mdgriffith$elm_ui$Internal$Style$Class,
					'.border-' + $elm$core$String$fromInt(x),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Style$Prop,
							'border-width',
							$elm$core$String$fromInt(x) + 'px')
						]));
			},
			A2($elm$core$List$range, 0, 6)),
			A2(
			$elm$core$List$map,
			function (i) {
				return A2(
					$mdgriffith$elm_ui$Internal$Style$Class,
					'.font-size-' + $elm$core$String$fromInt(i),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Style$Prop,
							'font-size',
							$elm$core$String$fromInt(i) + 'px')
						]));
			},
			A2($elm$core$List$range, 8, 32)),
			A2(
			$elm$core$List$map,
			function (i) {
				return A2(
					$mdgriffith$elm_ui$Internal$Style$Class,
					'.p-' + $elm$core$String$fromInt(i),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Style$Prop,
							'padding',
							$elm$core$String$fromInt(i) + 'px')
						]));
			},
			A2($elm$core$List$range, 0, 24)),
			_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Internal$Style$Class,
				'.v-smcp',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-variant', 'small-caps')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Class,
				'.v-smcp-off',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-variant', 'normal')
					]))
			]),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('zero'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('onum'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('liga'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('dlig'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('ordn'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('tnum'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('afrc'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('frac')
		]));
var $mdgriffith$elm_ui$Internal$Style$explainer = '\n.explain {\n    border: 6px solid rgb(174, 121, 15) !important;\n}\n.explain > .' + ($mdgriffith$elm_ui$Internal$Style$classes.g6 + (' {\n    border: 4px dashed rgb(0, 151, 167) !important;\n}\n\n.ctr {\n    border: none !important;\n}\n.explain > .ctr > .' + ($mdgriffith$elm_ui$Internal$Style$classes.g6 + ' {\n    border: 4px dashed rgb(0, 151, 167) !important;\n}\n\n')));
var $mdgriffith$elm_ui$Internal$Style$sliderOverrides = '\n\n/* General Input Reset */\ninput[type=range] {\n  -webkit-appearance: none; /* Hides the slider so that custom slider can be made */\n  /* width: 100%;  Specific width is required for Firefox. */\n  background: transparent; /* Otherwise white in Chrome */\n  position:absolute;\n  left:0;\n  top:0;\n  z-index:10;\n  width: 100%;\n  outline: dashed 1px;\n  height: 100%;\n  opacity: 0;\n}\n\n/* Hide all syling for track */\ninput[type=range]::-moz-range-track {\n    background: transparent;\n    cursor: pointer;\n}\ninput[type=range]::-ms-track {\n    background: transparent;\n    cursor: pointer;\n}\ninput[type=range]::-webkit-slider-runnable-track {\n    background: transparent;\n    cursor: pointer;\n}\n\n/* Thumbs */\ninput[type=range]::-webkit-slider-thumb {\n    -webkit-appearance: none;\n    opacity: 0.5;\n    width: 80px;\n    height: 80px;\n    background-color: black;\n    border:none;\n    border-radius: 5px;\n}\ninput[type=range]::-moz-range-thumb {\n    opacity: 0.5;\n    width: 80px;\n    height: 80px;\n    background-color: black;\n    border:none;\n    border-radius: 5px;\n}\ninput[type=range]::-ms-thumb {\n    opacity: 0.5;\n    width: 80px;\n    height: 80px;\n    background-color: black;\n    border:none;\n    border-radius: 5px;\n}\ninput[type=range][orient=vertical]{\n    writing-mode: bt-lr; /* IE */\n    -webkit-appearance: slider-vertical;  /* WebKit */\n}\n';
var $mdgriffith$elm_ui$Internal$Style$overrides = '@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g6) + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gj) + (' > ' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g6) + (' { flex-basis: auto !important; } ' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g6) + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gj) + (' > ' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g6) + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.di) + (' { flex-basis: auto !important; }}' + ($mdgriffith$elm_ui$Internal$Style$sliderOverrides + $mdgriffith$elm_ui$Internal$Style$explainer))))))))))));
var $mdgriffith$elm_ui$Internal$Style$Intermediate = $elm$core$Basics$identity;
var $mdgriffith$elm_ui$Internal$Style$emptyIntermediate = F2(
	function (selector, closing) {
		return {dh: closing, Z: _List_Nil, bz: _List_Nil, bh: selector};
	});
var $mdgriffith$elm_ui$Internal$Style$renderRules = F2(
	function (_v0, rulesToRender) {
		var parent = _v0;
		var generateIntermediates = F2(
			function (rule, rendered) {
				switch (rule.$) {
					case 0:
						var name = rule.a;
						var val = rule.b;
						return _Utils_update(
							rendered,
							{
								bz: A2(
									$elm$core$List$cons,
									_Utils_Tuple2(name, val),
									rendered.bz)
							});
					case 2:
						var _v2 = rule.a;
						var prop = _v2.a;
						var value = _v2.b;
						var props = rule.b;
						return _Utils_update(
							rendered,
							{
								Z: A2(
									$elm$core$List$cons,
									{dh: '\n}', Z: _List_Nil, bz: props, bh: '@supports (' + (prop + (':' + (value + (') {' + parent.bh))))},
									rendered.Z)
							});
					case 4:
						var selector = rule.a;
						var adjRules = rule.b;
						return _Utils_update(
							rendered,
							{
								Z: A2(
									$elm$core$List$cons,
									A2(
										$mdgriffith$elm_ui$Internal$Style$renderRules,
										A2($mdgriffith$elm_ui$Internal$Style$emptyIntermediate, parent.bh + (' + ' + selector), ''),
										adjRules),
									rendered.Z)
							});
					case 1:
						var child = rule.a;
						var childRules = rule.b;
						return _Utils_update(
							rendered,
							{
								Z: A2(
									$elm$core$List$cons,
									A2(
										$mdgriffith$elm_ui$Internal$Style$renderRules,
										A2($mdgriffith$elm_ui$Internal$Style$emptyIntermediate, parent.bh + (' > ' + child), ''),
										childRules),
									rendered.Z)
							});
					case 3:
						var descriptor = rule.a;
						var descriptorRules = rule.b;
						return _Utils_update(
							rendered,
							{
								Z: A2(
									$elm$core$List$cons,
									A2(
										$mdgriffith$elm_ui$Internal$Style$renderRules,
										A2(
											$mdgriffith$elm_ui$Internal$Style$emptyIntermediate,
											_Utils_ap(parent.bh, descriptor),
											''),
										descriptorRules),
									rendered.Z)
							});
					default:
						var batched = rule.a;
						return _Utils_update(
							rendered,
							{
								Z: A2(
									$elm$core$List$cons,
									A2(
										$mdgriffith$elm_ui$Internal$Style$renderRules,
										A2($mdgriffith$elm_ui$Internal$Style$emptyIntermediate, parent.bh, ''),
										batched),
									rendered.Z)
							});
				}
			});
		return A3($elm$core$List$foldr, generateIntermediates, parent, rulesToRender);
	});
var $mdgriffith$elm_ui$Internal$Style$renderCompact = function (styleClasses) {
	var renderValues = function (values) {
		return $elm$core$String$concat(
			A2(
				$elm$core$List$map,
				function (_v3) {
					var x = _v3.a;
					var y = _v3.b;
					return x + (':' + (y + ';'));
				},
				values));
	};
	var renderClass = function (rule) {
		var _v2 = rule.bz;
		if (!_v2.b) {
			return '';
		} else {
			return rule.bh + ('{' + (renderValues(rule.bz) + (rule.dh + '}')));
		}
	};
	var renderIntermediate = function (_v0) {
		var rule = _v0;
		return _Utils_ap(
			renderClass(rule),
			$elm$core$String$concat(
				A2($elm$core$List$map, renderIntermediate, rule.Z)));
	};
	return $elm$core$String$concat(
		A2(
			$elm$core$List$map,
			renderIntermediate,
			A3(
				$elm$core$List$foldr,
				F2(
					function (_v1, existing) {
						var name = _v1.a;
						var styleRules = _v1.b;
						return A2(
							$elm$core$List$cons,
							A2(
								$mdgriffith$elm_ui$Internal$Style$renderRules,
								A2($mdgriffith$elm_ui$Internal$Style$emptyIntermediate, name, ''),
								styleRules),
							existing);
					}),
				_List_Nil,
				styleClasses)));
};
var $mdgriffith$elm_ui$Internal$Style$rules = _Utils_ap(
	$mdgriffith$elm_ui$Internal$Style$overrides,
	$mdgriffith$elm_ui$Internal$Style$renderCompact(
		_Utils_ap($mdgriffith$elm_ui$Internal$Style$baseSheet, $mdgriffith$elm_ui$Internal$Style$commonValues)));
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $mdgriffith$elm_ui$Internal$Model$staticRoot = A3(
	$elm$virtual_dom$VirtualDom$node,
	'style',
	_List_Nil,
	_List_fromArray(
		[
			$elm$virtual_dom$VirtualDom$text($mdgriffith$elm_ui$Internal$Style$rules)
		]));
var $mdgriffith$elm_ui$Internal$Model$fontName = function (font) {
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
			var name = font.a.C;
			return '\"' + (name + '\"');
	}
};
var $mdgriffith$elm_ui$Internal$Model$isSmallCaps = function (_var) {
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
var $mdgriffith$elm_ui$Internal$Model$hasSmallCaps = function (typeface) {
	if (typeface.$ === 5) {
		var font = typeface.a;
		return A2($elm$core$List$any, $mdgriffith$elm_ui$Internal$Model$isSmallCaps, font.gK);
	} else {
		return false;
	}
};
var $mdgriffith$elm_ui$Internal$Model$renderProps = F3(
	function (force, _v0, existing) {
		var key = _v0.a;
		var val = _v0.b;
		return force ? (existing + ('\n  ' + (key + (': ' + (val + ' !important;'))))) : (existing + ('\n  ' + (key + (': ' + (val + ';')))));
	});
var $mdgriffith$elm_ui$Internal$Model$bracket = F2(
	function (selector, rules) {
		var renderPair = function (_v0) {
			var name = _v0.a;
			var val = _v0.b;
			return name + (': ' + (val + ';'));
		};
		return selector + (' {' + (A2(
			$elm$core$String$join,
			'',
			A2($elm$core$List$map, renderPair, rules)) + '}'));
	});
var $mdgriffith$elm_ui$Internal$Model$fontRule = F3(
	function (name, modifier, _v0) {
		var parentAdj = _v0.a;
		var textAdjustment = _v0.b;
		return _List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Model$bracket, '.' + (name + ('.' + (modifier + (', ' + ('.' + (name + (' .' + modifier))))))), parentAdj),
				A2($mdgriffith$elm_ui$Internal$Model$bracket, '.' + (name + ('.' + (modifier + ('> .' + ($mdgriffith$elm_ui$Internal$Style$classes.c3 + (', .' + (name + (' .' + (modifier + (' > .' + $mdgriffith$elm_ui$Internal$Style$classes.c3)))))))))), textAdjustment)
			]);
	});
var $mdgriffith$elm_ui$Internal$Model$renderFontAdjustmentRule = F3(
	function (fontToAdjust, _v0, otherFontName) {
		var full = _v0.a;
		var capital = _v0.b;
		var name = _Utils_eq(fontToAdjust, otherFontName) ? fontToAdjust : (otherFontName + (' .' + fontToAdjust));
		return A2(
			$elm$core$String$join,
			' ',
			_Utils_ap(
				A3($mdgriffith$elm_ui$Internal$Model$fontRule, name, $mdgriffith$elm_ui$Internal$Style$classes.ko, capital),
				A3($mdgriffith$elm_ui$Internal$Model$fontRule, name, $mdgriffith$elm_ui$Internal$Style$classes.ii, full)));
	});
var $mdgriffith$elm_ui$Internal$Model$renderNullAdjustmentRule = F2(
	function (fontToAdjust, otherFontName) {
		var name = _Utils_eq(fontToAdjust, otherFontName) ? fontToAdjust : (otherFontName + (' .' + fontToAdjust));
		return A2(
			$elm$core$String$join,
			' ',
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Internal$Model$bracket,
					'.' + (name + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.ko + (', ' + ('.' + (name + (' .' + $mdgriffith$elm_ui$Internal$Style$classes.ko))))))),
					_List_fromArray(
						[
							_Utils_Tuple2('line-height', '1')
						])),
					A2(
					$mdgriffith$elm_ui$Internal$Model$bracket,
					'.' + (name + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.ko + ('> .' + ($mdgriffith$elm_ui$Internal$Style$classes.c3 + (', .' + (name + (' .' + ($mdgriffith$elm_ui$Internal$Style$classes.ko + (' > .' + $mdgriffith$elm_ui$Internal$Style$classes.c3)))))))))),
					_List_fromArray(
						[
							_Utils_Tuple2('vertical-align', '0'),
							_Utils_Tuple2('line-height', '1')
						]))
				]));
	});
var $mdgriffith$elm_ui$Internal$Model$adjust = F3(
	function (size, height, vertical) {
		return {iu: height / size, eS: size, gL: vertical};
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$List$maximum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$max, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$List$minimum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$min, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $mdgriffith$elm_ui$Internal$Model$convertAdjustment = function (adjustment) {
	var lines = _List_fromArray(
		[adjustment.ho, adjustment.hb, adjustment.hY, adjustment.i0]);
	var lineHeight = 1.5;
	var normalDescender = (lineHeight - 1) / 2;
	var oldMiddle = lineHeight / 2;
	var descender = A2(
		$elm$core$Maybe$withDefault,
		adjustment.hY,
		$elm$core$List$minimum(lines));
	var newBaseline = A2(
		$elm$core$Maybe$withDefault,
		adjustment.hb,
		$elm$core$List$minimum(
			A2(
				$elm$core$List$filter,
				function (x) {
					return !_Utils_eq(x, descender);
				},
				lines)));
	var base = lineHeight;
	var ascender = A2(
		$elm$core$Maybe$withDefault,
		adjustment.ho,
		$elm$core$List$maximum(lines));
	var capitalSize = 1 / (ascender - newBaseline);
	var capitalVertical = 1 - ascender;
	var fullSize = 1 / (ascender - descender);
	var fullVertical = 1 - ascender;
	var newCapitalMiddle = ((ascender - newBaseline) / 2) + newBaseline;
	var newFullMiddle = ((ascender - descender) / 2) + descender;
	return {
		ho: A3($mdgriffith$elm_ui$Internal$Model$adjust, capitalSize, ascender - newBaseline, capitalVertical),
		fu: A3($mdgriffith$elm_ui$Internal$Model$adjust, fullSize, ascender - descender, fullVertical)
	};
};
var $mdgriffith$elm_ui$Internal$Model$fontAdjustmentRules = function (converted) {
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
				$elm$core$String$fromFloat(converted.iu)),
				_Utils_Tuple2(
				'vertical-align',
				$elm$core$String$fromFloat(converted.gL) + 'em'),
				_Utils_Tuple2(
				'font-size',
				$elm$core$String$fromFloat(converted.eS) + 'em')
			]));
};
var $mdgriffith$elm_ui$Internal$Model$typefaceAdjustment = function (typefaces) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (face, found) {
				if (found.$ === 1) {
					if (face.$ === 5) {
						var _with = face.a;
						var _v2 = _with.gV;
						if (_v2.$ === 1) {
							return found;
						} else {
							var adjustment = _v2.a;
							return $elm$core$Maybe$Just(
								_Utils_Tuple2(
									$mdgriffith$elm_ui$Internal$Model$fontAdjustmentRules(
										function ($) {
											return $.fu;
										}(
											$mdgriffith$elm_ui$Internal$Model$convertAdjustment(adjustment))),
									$mdgriffith$elm_ui$Internal$Model$fontAdjustmentRules(
										function ($) {
											return $.ho;
										}(
											$mdgriffith$elm_ui$Internal$Model$convertAdjustment(adjustment)))));
						}
					} else {
						return found;
					}
				} else {
					return found;
				}
			}),
		$elm$core$Maybe$Nothing,
		typefaces);
};
var $mdgriffith$elm_ui$Internal$Model$renderTopLevelValues = function (rules) {
	var withImport = function (font) {
		if (font.$ === 4) {
			var url = font.b;
			return $elm$core$Maybe$Just('@import url(\'' + (url + '\');'));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	};
	var fontImports = function (_v2) {
		var name = _v2.a;
		var typefaces = _v2.b;
		var imports = A2(
			$elm$core$String$join,
			'\n',
			A2($elm$core$List$filterMap, withImport, typefaces));
		return imports;
	};
	var allNames = A2($elm$core$List$map, $elm$core$Tuple$first, rules);
	var fontAdjustments = function (_v1) {
		var name = _v1.a;
		var typefaces = _v1.b;
		var _v0 = $mdgriffith$elm_ui$Internal$Model$typefaceAdjustment(typefaces);
		if (_v0.$ === 1) {
			return A2(
				$elm$core$String$join,
				'',
				A2(
					$elm$core$List$map,
					$mdgriffith$elm_ui$Internal$Model$renderNullAdjustmentRule(name),
					allNames));
		} else {
			var adjustment = _v0.a;
			return A2(
				$elm$core$String$join,
				'',
				A2(
					$elm$core$List$map,
					A2($mdgriffith$elm_ui$Internal$Model$renderFontAdjustmentRule, name, adjustment),
					allNames));
		}
	};
	return _Utils_ap(
		A2(
			$elm$core$String$join,
			'\n',
			A2($elm$core$List$map, fontImports, rules)),
		A2(
			$elm$core$String$join,
			'\n',
			A2($elm$core$List$map, fontAdjustments, rules)));
};
var $mdgriffith$elm_ui$Internal$Model$renderVariant = function (_var) {
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
			return '\"' + (name + ('\" ' + $elm$core$String$fromInt(index)));
	}
};
var $mdgriffith$elm_ui$Internal$Model$renderVariants = function (typeface) {
	if (typeface.$ === 5) {
		var font = typeface.a;
		return $elm$core$Maybe$Just(
			A2(
				$elm$core$String$join,
				', ',
				A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$renderVariant, font.gK)));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $mdgriffith$elm_ui$Internal$Model$topLevelValue = function (rule) {
	if (rule.$ === 1) {
		var name = rule.a;
		var typefaces = rule.b;
		return $elm$core$Maybe$Just(
			_Utils_Tuple2(name, typefaces));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $mdgriffith$elm_ui$Internal$Model$transformValue = function (transform) {
	switch (transform.$) {
		case 0:
			return $elm$core$Maybe$Nothing;
		case 1:
			var _v1 = transform.a;
			var x = _v1.a;
			var y = _v1.b;
			var z = _v1.c;
			return $elm$core$Maybe$Just(
				'translate3d(' + ($elm$core$String$fromFloat(x) + ('px, ' + ($elm$core$String$fromFloat(y) + ('px, ' + ($elm$core$String$fromFloat(z) + 'px)'))))));
		default:
			var _v2 = transform.a;
			var tx = _v2.a;
			var ty = _v2.b;
			var tz = _v2.c;
			var _v3 = transform.b;
			var sx = _v3.a;
			var sy = _v3.b;
			var sz = _v3.c;
			var _v4 = transform.c;
			var ox = _v4.a;
			var oy = _v4.b;
			var oz = _v4.c;
			var angle = transform.d;
			var translate = 'translate3d(' + ($elm$core$String$fromFloat(tx) + ('px, ' + ($elm$core$String$fromFloat(ty) + ('px, ' + ($elm$core$String$fromFloat(tz) + 'px)')))));
			var scale = 'scale3d(' + ($elm$core$String$fromFloat(sx) + (', ' + ($elm$core$String$fromFloat(sy) + (', ' + ($elm$core$String$fromFloat(sz) + ')')))));
			var rotate = 'rotate3d(' + ($elm$core$String$fromFloat(ox) + (', ' + ($elm$core$String$fromFloat(oy) + (', ' + ($elm$core$String$fromFloat(oz) + (', ' + ($elm$core$String$fromFloat(angle) + 'rad)')))))));
			return $elm$core$Maybe$Just(translate + (' ' + (scale + (' ' + rotate))));
	}
};
var $mdgriffith$elm_ui$Internal$Model$toStyleSheetString = F2(
	function (options, stylesheet) {
		var renderStyle = F3(
			function (maybePseudo, selector, props) {
				if (maybePseudo.$ === 1) {
					return selector + ('{' + (A3(
						$elm$core$List$foldl,
						$mdgriffith$elm_ui$Internal$Model$renderProps(false),
						'',
						props) + '\n}'));
				} else {
					var pseudo = maybePseudo.a;
					switch (pseudo) {
						case 1:
							var _v17 = options.W;
							switch (_v17) {
								case 0:
									return '';
								case 2:
									return selector + ('-hv {' + (A3(
										$elm$core$List$foldl,
										$mdgriffith$elm_ui$Internal$Model$renderProps(true),
										'',
										props) + '\n}'));
								default:
									return selector + ('-hv:hover {' + (A3(
										$elm$core$List$foldl,
										$mdgriffith$elm_ui$Internal$Model$renderProps(false),
										'',
										props) + '\n}'));
							}
						case 0:
							var renderedProps = A3(
								$elm$core$List$foldl,
								$mdgriffith$elm_ui$Internal$Model$renderProps(false),
								'',
								props);
							return A2(
								$elm$core$String$join,
								'\n',
								_List_fromArray(
									[selector + ('-fs:focus {' + (renderedProps + '\n}')), '.' + ($mdgriffith$elm_ui$Internal$Style$classes.g6 + (':focus ~ ' + (selector + ('-fs:not(.focus)  {' + (renderedProps + '\n}'))))), '.' + ($mdgriffith$elm_ui$Internal$Style$classes.g6 + (':focus ' + (selector + ('-fs  {' + (renderedProps + '\n}'))))), '.focusable-parent:focus ~ ' + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.g6 + (' ' + (selector + ('-fs {' + (renderedProps + '\n}'))))))]));
						default:
							return selector + ('-act:active {' + (A3(
								$elm$core$List$foldl,
								$mdgriffith$elm_ui$Internal$Model$renderProps(false),
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
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'box-shadow', prop)
								]));
					case 12:
						var name = rule.a;
						var transparency = rule.b;
						var opacity = A2(
							$elm$core$Basics$max,
							0,
							A2($elm$core$Basics$min, 1, 1 - transparency));
						return A3(
							renderStyle,
							maybePseudo,
							'.' + name,
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Internal$Model$Property,
									'opacity',
									$elm$core$String$fromFloat(opacity))
								]));
					case 2:
						var i = rule.a;
						return A3(
							renderStyle,
							maybePseudo,
							'.font-size-' + $elm$core$String$fromInt(i),
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Internal$Model$Property,
									'font-size',
									$elm$core$String$fromInt(i) + 'px')
								]));
					case 1:
						var name = rule.a;
						var typefaces = rule.b;
						var features = A2(
							$elm$core$String$join,
							', ',
							A2($elm$core$List$filterMap, $mdgriffith$elm_ui$Internal$Model$renderVariants, typefaces));
						var families = _List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'font-family',
								A2(
									$elm$core$String$join,
									', ',
									A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$fontName, typefaces))),
								A2($mdgriffith$elm_ui$Internal$Model$Property, 'font-feature-settings', features),
								A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'font-variant',
								A2($elm$core$List$any, $mdgriffith$elm_ui$Internal$Model$hasSmallCaps, typefaces) ? 'small-caps' : 'normal')
							]);
						return A2(
							$elm$core$String$join,
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
									A2($mdgriffith$elm_ui$Internal$Model$Property, prop, val)
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
									$mdgriffith$elm_ui$Internal$Model$Property,
									prop,
									$mdgriffith$elm_ui$Internal$Model$formatColor(color))
								]));
					case 5:
						var cls = rule.a;
						var x = rule.b;
						var y = rule.c;
						var yPx = $elm$core$String$fromInt(y) + 'px';
						var xPx = $elm$core$String$fromInt(x) + 'px';
						var single = '.' + $mdgriffith$elm_ui$Internal$Style$classes.km;
						var row = '.' + $mdgriffith$elm_ui$Internal$Style$classes.gj;
						var wrappedRow = '.' + ($mdgriffith$elm_ui$Internal$Style$classes.e_ + row);
						var right = '.' + $mdgriffith$elm_ui$Internal$Style$classes.e4;
						var paragraph = '.' + $mdgriffith$elm_ui$Internal$Style$classes.f4;
						var page = '.' + $mdgriffith$elm_ui$Internal$Style$classes.f2;
						var left = '.' + $mdgriffith$elm_ui$Internal$Style$classes.e3;
						var halfY = $elm$core$String$fromFloat(y / 2) + 'px';
						var halfX = $elm$core$String$fromFloat(x / 2) + 'px';
						var column = '.' + $mdgriffith$elm_ui$Internal$Style$classes.ea;
						var _class = '.' + cls;
						var any = '.' + $mdgriffith$elm_ui$Internal$Style$classes.g6;
						return $elm$core$String$concat(
							_List_fromArray(
								[
									A3(
									renderStyle,
									maybePseudo,
									_class + (row + (' > ' + (any + (' + ' + any)))),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-left', xPx)
										])),
									A3(
									renderStyle,
									maybePseudo,
									_class + (wrappedRow + (' > ' + any)),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin', halfY + (' ' + halfX))
										])),
									A3(
									renderStyle,
									maybePseudo,
									_class + (column + (' > ' + (any + (' + ' + any)))),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-top', yPx)
										])),
									A3(
									renderStyle,
									maybePseudo,
									_class + (page + (' > ' + (any + (' + ' + any)))),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-top', yPx)
										])),
									A3(
									renderStyle,
									maybePseudo,
									_class + (page + (' > ' + left)),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-right', xPx)
										])),
									A3(
									renderStyle,
									maybePseudo,
									_class + (page + (' > ' + right)),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-left', xPx)
										])),
									A3(
									renderStyle,
									maybePseudo,
									_Utils_ap(_class, paragraph),
									_List_fromArray(
										[
											A2(
											$mdgriffith$elm_ui$Internal$Model$Property,
											'line-height',
											'calc(1em + ' + ($elm$core$String$fromInt(y) + 'px)'))
										])),
									A3(
									renderStyle,
									maybePseudo,
									'textarea' + _class,
									_List_fromArray(
										[
											A2(
											$mdgriffith$elm_ui$Internal$Model$Property,
											'line-height',
											'calc(1em + ' + ($elm$core$String$fromInt(y) + 'px)'))
										])),
									A3(
									renderStyle,
									maybePseudo,
									_class + (paragraph + (' > ' + left)),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-right', xPx)
										])),
									A3(
									renderStyle,
									maybePseudo,
									_class + (paragraph + (' > ' + right)),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-left', xPx)
										])),
									A3(
									renderStyle,
									maybePseudo,
									_class + (paragraph + '::after'),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Model$Property, 'content', '\'\''),
											A2($mdgriffith$elm_ui$Internal$Model$Property, 'display', 'block'),
											A2($mdgriffith$elm_ui$Internal$Model$Property, 'height', '0'),
											A2($mdgriffith$elm_ui$Internal$Model$Property, 'width', '0'),
											A2(
											$mdgriffith$elm_ui$Internal$Model$Property,
											'margin-top',
											$elm$core$String$fromInt((-1) * ((y / 2) | 0)) + 'px')
										])),
									A3(
									renderStyle,
									maybePseudo,
									_class + (paragraph + '::before'),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Model$Property, 'content', '\'\''),
											A2($mdgriffith$elm_ui$Internal$Model$Property, 'display', 'block'),
											A2($mdgriffith$elm_ui$Internal$Model$Property, 'height', '0'),
											A2($mdgriffith$elm_ui$Internal$Model$Property, 'width', '0'),
											A2(
											$mdgriffith$elm_ui$Internal$Model$Property,
											'margin-bottom',
											$elm$core$String$fromInt((-1) * ((y / 2) | 0)) + 'px')
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
									$mdgriffith$elm_ui$Internal$Model$Property,
									'padding',
									$elm$core$String$fromInt(top) + ('px ' + ($elm$core$String$fromInt(right) + ('px ' + ($elm$core$String$fromInt(bottom) + ('px ' + ($elm$core$String$fromInt(left) + 'px')))))))
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
									$mdgriffith$elm_ui$Internal$Model$Property,
									'border-width',
									$elm$core$String$fromInt(top) + ('px ' + ($elm$core$String$fromInt(right) + ('px ' + ($elm$core$String$fromInt(bottom) + ('px ' + ($elm$core$String$fromInt(left) + 'px')))))))
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
											return $elm$core$String$fromInt(px) + 'px';
										case 1:
											var _v2 = _Utils_Tuple2(minimum, maximum);
											if (_v2.a.$ === 1) {
												if (_v2.b.$ === 1) {
													var _v3 = _v2.a;
													var _v4 = _v2.b;
													return 'max-content';
												} else {
													var _v6 = _v2.a;
													var maxSize = _v2.b.a;
													return 'minmax(max-content, ' + ($elm$core$String$fromInt(maxSize) + 'px)');
												}
											} else {
												if (_v2.b.$ === 1) {
													var minSize = _v2.a.a;
													var _v5 = _v2.b;
													return 'minmax(' + ($elm$core$String$fromInt(minSize) + ('px, ' + 'max-content)'));
												} else {
													var minSize = _v2.a.a;
													var maxSize = _v2.b.a;
													return 'minmax(' + ($elm$core$String$fromInt(minSize) + ('px, ' + ($elm$core$String$fromInt(maxSize) + 'px)')));
												}
											}
										case 2:
											var i = x.a;
											var _v7 = _Utils_Tuple2(minimum, maximum);
											if (_v7.a.$ === 1) {
												if (_v7.b.$ === 1) {
													var _v8 = _v7.a;
													var _v9 = _v7.b;
													return $elm$core$String$fromInt(i) + 'fr';
												} else {
													var _v11 = _v7.a;
													var maxSize = _v7.b.a;
													return 'minmax(max-content, ' + ($elm$core$String$fromInt(maxSize) + 'px)');
												}
											} else {
												if (_v7.b.$ === 1) {
													var minSize = _v7.a.a;
													var _v10 = _v7.b;
													return 'minmax(' + ($elm$core$String$fromInt(minSize) + ('px, ' + ($elm$core$String$fromInt(i) + ('fr' + 'fr)'))));
												} else {
													var minSize = _v7.a.a;
													var maxSize = _v7.b.a;
													return 'minmax(' + ($elm$core$String$fromInt(minSize) + ('px, ' + ($elm$core$String$fromInt(maxSize) + 'px)')));
												}
											}
										case 3:
											var m = x.a;
											var len = x.b;
											var $temp$minimum = $elm$core$Maybe$Just(m),
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
												$temp$maximum = $elm$core$Maybe$Just(m),
												$temp$x = len;
											minimum = $temp$minimum;
											maximum = $temp$maximum;
											x = $temp$x;
											continue toGridLengthHelper;
									}
								}
							});
						var toGridLength = function (x) {
							return A3(toGridLengthHelper, $elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing, x);
						};
						var xSpacing = toGridLength(template.kr.a);
						var ySpacing = toGridLength(template.kr.b);
						var rows = function (x) {
							return 'grid-template-rows: ' + (x + ';');
						}(
							A2(
								$elm$core$String$join,
								' ',
								A2($elm$core$List$map, toGridLength, template.j$)));
						var msRows = function (x) {
							return '-ms-grid-rows: ' + (x + ';');
						}(
							A2(
								$elm$core$String$join,
								ySpacing,
								A2($elm$core$List$map, toGridLength, template.hD)));
						var msColumns = function (x) {
							return '-ms-grid-columns: ' + (x + ';');
						}(
							A2(
								$elm$core$String$join,
								ySpacing,
								A2($elm$core$List$map, toGridLength, template.hD)));
						var gapY = 'grid-row-gap:' + (toGridLength(template.kr.b) + ';');
						var gapX = 'grid-column-gap:' + (toGridLength(template.kr.a) + ';');
						var columns = function (x) {
							return 'grid-template-columns: ' + (x + ';');
						}(
							A2(
								$elm$core$String$join,
								' ',
								A2($elm$core$List$map, toGridLength, template.hD)));
						var _class = '.grid-rows-' + (A2(
							$elm$core$String$join,
							'-',
							A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$lengthClassName, template.j$)) + ('-cols-' + (A2(
							$elm$core$String$join,
							'-',
							A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$lengthClassName, template.hD)) + ('-space-x-' + ($mdgriffith$elm_ui$Internal$Model$lengthClassName(template.kr.a) + ('-space-y-' + $mdgriffith$elm_ui$Internal$Model$lengthClassName(template.kr.b)))))));
						var modernGrid = _class + ('{' + (columns + (rows + (gapX + (gapY + '}')))));
						var supports = '@supports (display:grid) {' + (modernGrid + '}');
						var base = _class + ('{' + (msColumns + (msRows + '}')));
						return _Utils_ap(base, supports);
					case 9:
						var position = rule.a;
						var msPosition = A2(
							$elm$core$String$join,
							' ',
							_List_fromArray(
								[
									'-ms-grid-row: ' + ($elm$core$String$fromInt(position.gj) + ';'),
									'-ms-grid-row-span: ' + ($elm$core$String$fromInt(position.iu) + ';'),
									'-ms-grid-column: ' + ($elm$core$String$fromInt(position.fg) + ';'),
									'-ms-grid-column-span: ' + ($elm$core$String$fromInt(position.lb) + ';')
								]));
						var modernPosition = A2(
							$elm$core$String$join,
							' ',
							_List_fromArray(
								[
									'grid-row: ' + ($elm$core$String$fromInt(position.gj) + (' / ' + ($elm$core$String$fromInt(position.gj + position.iu) + ';'))),
									'grid-column: ' + ($elm$core$String$fromInt(position.fg) + (' / ' + ($elm$core$String$fromInt(position.fg + position.lb) + ';')))
								]));
						var _class = '.grid-pos-' + ($elm$core$String$fromInt(position.gj) + ('-' + ($elm$core$String$fromInt(position.fg) + ('-' + ($elm$core$String$fromInt(position.lb) + ('-' + $elm$core$String$fromInt(position.iu)))))));
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
								$elm$core$Maybe$Just(_class));
						};
						return A2(
							$elm$core$String$join,
							' ',
							A2($elm$core$List$map, renderPseudoRule, styles));
					default:
						var transform = rule.a;
						var val = $mdgriffith$elm_ui$Internal$Model$transformValue(transform);
						var _class = $mdgriffith$elm_ui$Internal$Model$transformClass(transform);
						var _v12 = _Utils_Tuple2(_class, val);
						if ((!_v12.a.$) && (!_v12.b.$)) {
							var cls = _v12.a.a;
							var v = _v12.b.a;
							return A3(
								renderStyle,
								maybePseudo,
								'.' + cls,
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Model$Property, 'transform', v)
									]));
						} else {
							return '';
						}
				}
			});
		var combine = F2(
			function (style, rendered) {
				return {
					dZ: _Utils_ap(
						rendered.dZ,
						A2(renderStyleRule, style, $elm$core$Maybe$Nothing)),
					c5: function () {
						var _v14 = $mdgriffith$elm_ui$Internal$Model$topLevelValue(style);
						if (_v14.$ === 1) {
							return rendered.c5;
						} else {
							var topLevel = _v14.a;
							return A2($elm$core$List$cons, topLevel, rendered.c5);
						}
					}()
				};
			});
		var _v13 = A3(
			$elm$core$List$foldl,
			combine,
			{dZ: '', c5: _List_Nil},
			stylesheet);
		var topLevel = _v13.c5;
		var rules = _v13.dZ;
		return _Utils_ap(
			$mdgriffith$elm_ui$Internal$Model$renderTopLevelValues(topLevel),
			rules);
	});
var $mdgriffith$elm_ui$Internal$Model$toStyleSheet = F2(
	function (options, styleSheet) {
		return A3(
			$elm$virtual_dom$VirtualDom$node,
			'style',
			_List_Nil,
			_List_fromArray(
				[
					$elm$virtual_dom$VirtualDom$text(
					A2($mdgriffith$elm_ui$Internal$Model$toStyleSheetString, options, styleSheet))
				]));
	});
var $mdgriffith$elm_ui$Internal$Model$embedKeyed = F4(
	function (_static, opts, styles, children) {
		return _static ? A2(
			$elm$core$List$cons,
			_Utils_Tuple2('static-stylesheet', $mdgriffith$elm_ui$Internal$Model$staticRoot),
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					'dynamic-stylesheet',
					A2(
						$mdgriffith$elm_ui$Internal$Model$toStyleSheet,
						opts,
						A3(
							$elm$core$List$foldl,
							$mdgriffith$elm_ui$Internal$Model$reduceStyles,
							_Utils_Tuple2(
								$elm$core$Set$empty,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Internal$Model$renderFocusStyle(opts.fs)
									])),
							styles).b)),
				children)) : A2(
			$elm$core$List$cons,
			_Utils_Tuple2(
				'dynamic-stylesheet',
				A2(
					$mdgriffith$elm_ui$Internal$Model$toStyleSheet,
					opts,
					A3(
						$elm$core$List$foldl,
						$mdgriffith$elm_ui$Internal$Model$reduceStyles,
						_Utils_Tuple2(
							$elm$core$Set$empty,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Internal$Model$renderFocusStyle(opts.fs)
								])),
						styles).b)),
			children);
	});
var $mdgriffith$elm_ui$Internal$Model$embedWith = F4(
	function (_static, opts, styles, children) {
		return _static ? A2(
			$elm$core$List$cons,
			$mdgriffith$elm_ui$Internal$Model$staticRoot,
			A2(
				$elm$core$List$cons,
				A2(
					$mdgriffith$elm_ui$Internal$Model$toStyleSheet,
					opts,
					A3(
						$elm$core$List$foldl,
						$mdgriffith$elm_ui$Internal$Model$reduceStyles,
						_Utils_Tuple2(
							$elm$core$Set$empty,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Internal$Model$renderFocusStyle(opts.fs)
								])),
						styles).b),
				children)) : A2(
			$elm$core$List$cons,
			A2(
				$mdgriffith$elm_ui$Internal$Model$toStyleSheet,
				opts,
				A3(
					$elm$core$List$foldl,
					$mdgriffith$elm_ui$Internal$Model$reduceStyles,
					_Utils_Tuple2(
						$elm$core$Set$empty,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Internal$Model$renderFocusStyle(opts.fs)
							])),
					styles).b),
			children);
	});
var $mdgriffith$elm_ui$Internal$Flag$heightBetween = $mdgriffith$elm_ui$Internal$Flag$flag(45);
var $mdgriffith$elm_ui$Internal$Flag$heightFill = $mdgriffith$elm_ui$Internal$Flag$flag(37);
var $elm$virtual_dom$VirtualDom$keyedNode = function (tag) {
	return _VirtualDom_keyedNode(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$p = _VirtualDom_node('p');
var $mdgriffith$elm_ui$Internal$Flag$present = F2(
	function (myFlag, _v0) {
		var fieldOne = _v0.a;
		var fieldTwo = _v0.b;
		if (!myFlag.$) {
			var first = myFlag.a;
			return _Utils_eq(first & fieldOne, first);
		} else {
			var second = myFlag.a;
			return _Utils_eq(second & fieldTwo, second);
		}
	});
var $elm$html$Html$s = _VirtualDom_node('s');
var $elm$html$Html$u = _VirtualDom_node('u');
var $mdgriffith$elm_ui$Internal$Flag$widthBetween = $mdgriffith$elm_ui$Internal$Flag$flag(44);
var $mdgriffith$elm_ui$Internal$Flag$widthFill = $mdgriffith$elm_ui$Internal$Flag$flag(39);
var $mdgriffith$elm_ui$Internal$Model$finalizeNode = F6(
	function (has, node, attributes, children, embedMode, parentContext) {
		var createNode = F2(
			function (nodeName, attrs) {
				if (children.$ === 1) {
					var keyed = children.a;
					return A3(
						$elm$virtual_dom$VirtualDom$keyedNode,
						nodeName,
						attrs,
						function () {
							switch (embedMode.$) {
								case 0:
									return keyed;
								case 2:
									var opts = embedMode.a;
									var styles = embedMode.b;
									return A4($mdgriffith$elm_ui$Internal$Model$embedKeyed, false, opts, styles, keyed);
								default:
									var opts = embedMode.a;
									var styles = embedMode.b;
									return A4($mdgriffith$elm_ui$Internal$Model$embedKeyed, true, opts, styles, keyed);
							}
						}());
				} else {
					var unkeyed = children.a;
					return A2(
						function () {
							switch (nodeName) {
								case 'div':
									return $elm$html$Html$div;
								case 'p':
									return $elm$html$Html$p;
								default:
									return $elm$virtual_dom$VirtualDom$node(nodeName);
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
									return A4($mdgriffith$elm_ui$Internal$Model$embedWith, false, opts, styles, unkeyed);
								default:
									var opts = embedMode.a;
									var styles = embedMode.b;
									return A4($mdgriffith$elm_ui$Internal$Model$embedWith, true, opts, styles, unkeyed);
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
						$elm$virtual_dom$VirtualDom$node,
						nodeName,
						attributes,
						_List_fromArray(
							[
								A2(
								createNode,
								internal,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class($mdgriffith$elm_ui$Internal$Style$classes.g6 + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.km))
									]))
							]));
			}
		}();
		switch (parentContext) {
			case 0:
				return (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$widthFill, has) && (!A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$widthBetween, has))) ? html : (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$alignRight, has) ? A2(
					$elm$html$Html$u,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							A2(
								$elm$core$String$join,
								' ',
								_List_fromArray(
									[$mdgriffith$elm_ui$Internal$Style$classes.g6, $mdgriffith$elm_ui$Internal$Style$classes.km, $mdgriffith$elm_ui$Internal$Style$classes.di, $mdgriffith$elm_ui$Internal$Style$classes.bl, $mdgriffith$elm_ui$Internal$Style$classes.g1])))
						]),
					_List_fromArray(
						[html])) : (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$centerX, has) ? A2(
					$elm$html$Html$s,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							A2(
								$elm$core$String$join,
								' ',
								_List_fromArray(
									[$mdgriffith$elm_ui$Internal$Style$classes.g6, $mdgriffith$elm_ui$Internal$Style$classes.km, $mdgriffith$elm_ui$Internal$Style$classes.di, $mdgriffith$elm_ui$Internal$Style$classes.bl, $mdgriffith$elm_ui$Internal$Style$classes.g$])))
						]),
					_List_fromArray(
						[html])) : html));
			case 1:
				return (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$heightFill, has) && (!A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$heightBetween, has))) ? html : (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$centerY, has) ? A2(
					$elm$html$Html$s,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							A2(
								$elm$core$String$join,
								' ',
								_List_fromArray(
									[$mdgriffith$elm_ui$Internal$Style$classes.g6, $mdgriffith$elm_ui$Internal$Style$classes.km, $mdgriffith$elm_ui$Internal$Style$classes.di, $mdgriffith$elm_ui$Internal$Style$classes.g0])))
						]),
					_List_fromArray(
						[html])) : (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$alignBottom, has) ? A2(
					$elm$html$Html$u,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							A2(
								$elm$core$String$join,
								' ',
								_List_fromArray(
									[$mdgriffith$elm_ui$Internal$Style$classes.g6, $mdgriffith$elm_ui$Internal$Style$classes.km, $mdgriffith$elm_ui$Internal$Style$classes.di, $mdgriffith$elm_ui$Internal$Style$classes.g_])))
						]),
					_List_fromArray(
						[html])) : html));
			default:
				return html;
		}
	});
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $mdgriffith$elm_ui$Internal$Model$textElement = function (str) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class(
				A2(
					$elm$core$String$join,
					' ',
					_List_fromArray(
						[$mdgriffith$elm_ui$Internal$Style$classes.g6, $mdgriffith$elm_ui$Internal$Style$classes.c3, $mdgriffith$elm_ui$Internal$Style$classes.eY, $mdgriffith$elm_ui$Internal$Style$classes.dv])))
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(str)
			]));
};
var $mdgriffith$elm_ui$Internal$Model$textElementFill = function (str) {
	return A3(
		$elm$virtual_dom$VirtualDom$node,
		'div',
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class(
				A2(
					$elm$core$String$join,
					' ',
					_List_fromArray(
						[$mdgriffith$elm_ui$Internal$Style$classes.g6, $mdgriffith$elm_ui$Internal$Style$classes.c3, $mdgriffith$elm_ui$Internal$Style$classes.eZ, $mdgriffith$elm_ui$Internal$Style$classes.ev])))
			]),
		_List_fromArray(
			[
				$elm$virtual_dom$VirtualDom$text(str)
			]));
};
var $mdgriffith$elm_ui$Internal$Model$createElement = F3(
	function (context, children, rendered) {
		var gatherKeyed = F2(
			function (_v8, _v9) {
				var key = _v8.a;
				var child = _v8.b;
				var htmls = _v9.a;
				var existingStyles = _v9.b;
				switch (child.$) {
					case 0:
						var html = child.a;
						return _Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asParagraph) ? _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									html(context)),
								htmls),
							existingStyles) : _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									html(context)),
								htmls),
							existingStyles);
					case 1:
						var styled = child.a;
						return _Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asParagraph) ? _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									A2(styled.iz, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, context)),
								htmls),
							$elm$core$List$isEmpty(existingStyles) ? styled.gw : _Utils_ap(styled.gw, existingStyles)) : _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									A2(styled.iz, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, context)),
								htmls),
							$elm$core$List$isEmpty(existingStyles) ? styled.gw : _Utils_ap(styled.gw, existingStyles));
					case 2:
						var str = child.a;
						return _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									_Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asEl) ? $mdgriffith$elm_ui$Internal$Model$textElementFill(str) : $mdgriffith$elm_ui$Internal$Model$textElement(str)),
								htmls),
							existingStyles);
					default:
						return _Utils_Tuple2(htmls, existingStyles);
				}
			});
		var gather = F2(
			function (child, _v6) {
				var htmls = _v6.a;
				var existingStyles = _v6.b;
				switch (child.$) {
					case 0:
						var html = child.a;
						return _Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asParagraph) ? _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								html(context),
								htmls),
							existingStyles) : _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								html(context),
								htmls),
							existingStyles);
					case 1:
						var styled = child.a;
						return _Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asParagraph) ? _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								A2(styled.iz, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, context),
								htmls),
							$elm$core$List$isEmpty(existingStyles) ? styled.gw : _Utils_ap(styled.gw, existingStyles)) : _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								A2(styled.iz, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, context),
								htmls),
							$elm$core$List$isEmpty(existingStyles) ? styled.gw : _Utils_ap(styled.gw, existingStyles));
					case 2:
						var str = child.a;
						return _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asEl) ? $mdgriffith$elm_ui$Internal$Model$textElementFill(str) : $mdgriffith$elm_ui$Internal$Model$textElement(str),
								htmls),
							existingStyles);
					default:
						return _Utils_Tuple2(htmls, existingStyles);
				}
			});
		if (children.$ === 1) {
			var keyedChildren = children.a;
			var _v1 = A3(
				$elm$core$List$foldr,
				gatherKeyed,
				_Utils_Tuple2(_List_Nil, _List_Nil),
				keyedChildren);
			var keyed = _v1.a;
			var styles = _v1.b;
			var newStyles = $elm$core$List$isEmpty(styles) ? rendered.gw : _Utils_ap(rendered.gw, styles);
			if (!newStyles.b) {
				return $mdgriffith$elm_ui$Internal$Model$Unstyled(
					A5(
						$mdgriffith$elm_ui$Internal$Model$finalizeNode,
						rendered.bN,
						rendered.fW,
						rendered.bG,
						$mdgriffith$elm_ui$Internal$Model$Keyed(
							A3($mdgriffith$elm_ui$Internal$Model$addKeyedChildren, 'nearby-element-pls', keyed, rendered.hw)),
						$mdgriffith$elm_ui$Internal$Model$NoStyleSheet));
			} else {
				var allStyles = newStyles;
				return $mdgriffith$elm_ui$Internal$Model$Styled(
					{
						iz: A4(
							$mdgriffith$elm_ui$Internal$Model$finalizeNode,
							rendered.bN,
							rendered.fW,
							rendered.bG,
							$mdgriffith$elm_ui$Internal$Model$Keyed(
								A3($mdgriffith$elm_ui$Internal$Model$addKeyedChildren, 'nearby-element-pls', keyed, rendered.hw))),
						gw: allStyles
					});
			}
		} else {
			var unkeyedChildren = children.a;
			var _v3 = A3(
				$elm$core$List$foldr,
				gather,
				_Utils_Tuple2(_List_Nil, _List_Nil),
				unkeyedChildren);
			var unkeyed = _v3.a;
			var styles = _v3.b;
			var newStyles = $elm$core$List$isEmpty(styles) ? rendered.gw : _Utils_ap(rendered.gw, styles);
			if (!newStyles.b) {
				return $mdgriffith$elm_ui$Internal$Model$Unstyled(
					A5(
						$mdgriffith$elm_ui$Internal$Model$finalizeNode,
						rendered.bN,
						rendered.fW,
						rendered.bG,
						$mdgriffith$elm_ui$Internal$Model$Unkeyed(
							A2($mdgriffith$elm_ui$Internal$Model$addChildren, unkeyed, rendered.hw)),
						$mdgriffith$elm_ui$Internal$Model$NoStyleSheet));
			} else {
				var allStyles = newStyles;
				return $mdgriffith$elm_ui$Internal$Model$Styled(
					{
						iz: A4(
							$mdgriffith$elm_ui$Internal$Model$finalizeNode,
							rendered.bN,
							rendered.fW,
							rendered.bG,
							$mdgriffith$elm_ui$Internal$Model$Unkeyed(
								A2($mdgriffith$elm_ui$Internal$Model$addChildren, unkeyed, rendered.hw))),
						gw: allStyles
					});
			}
		}
	});
var $mdgriffith$elm_ui$Internal$Model$Embedded = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$NodeName = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$Single = F3(
	function (a, b, c) {
		return {$: 3, a: a, b: b, c: c};
	});
var $mdgriffith$elm_ui$Internal$Model$Transform = function (a) {
	return {$: 10, a: a};
};
var $mdgriffith$elm_ui$Internal$Flag$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$core$Bitwise$or = _Bitwise_or;
var $mdgriffith$elm_ui$Internal$Flag$add = F2(
	function (myFlag, _v0) {
		var one = _v0.a;
		var two = _v0.b;
		if (!myFlag.$) {
			var first = myFlag.a;
			return A2($mdgriffith$elm_ui$Internal$Flag$Field, first | one, two);
		} else {
			var second = myFlag.a;
			return A2($mdgriffith$elm_ui$Internal$Flag$Field, one, second | two);
		}
	});
var $mdgriffith$elm_ui$Internal$Model$ChildrenBehind = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$ChildrenInFront = function (a) {
	return {$: 2, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$nearbyElement = F2(
	function (location, elem) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					function () {
						switch (location) {
							case 0:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.cl, $mdgriffith$elm_ui$Internal$Style$classes.km, $mdgriffith$elm_ui$Internal$Style$classes.gQ]));
							case 1:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.cl, $mdgriffith$elm_ui$Internal$Style$classes.km, $mdgriffith$elm_ui$Internal$Style$classes.hd]));
							case 2:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.cl, $mdgriffith$elm_ui$Internal$Style$classes.km, $mdgriffith$elm_ui$Internal$Style$classes.jv]));
							case 3:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.cl, $mdgriffith$elm_ui$Internal$Style$classes.km, $mdgriffith$elm_ui$Internal$Style$classes.ju]));
							case 4:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.cl, $mdgriffith$elm_ui$Internal$Style$classes.km, $mdgriffith$elm_ui$Internal$Style$classes.iK]));
							default:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.cl, $mdgriffith$elm_ui$Internal$Style$classes.km, $mdgriffith$elm_ui$Internal$Style$classes.hc]));
						}
					}())
				]),
			_List_fromArray(
				[
					function () {
					switch (elem.$) {
						case 3:
							return $elm$virtual_dom$VirtualDom$text('');
						case 2:
							var str = elem.a;
							return $mdgriffith$elm_ui$Internal$Model$textElement(str);
						case 0:
							var html = elem.a;
							return html($mdgriffith$elm_ui$Internal$Model$asEl);
						default:
							var styled = elem.a;
							return A2(styled.iz, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, $mdgriffith$elm_ui$Internal$Model$asEl);
					}
				}()
				]));
	});
var $mdgriffith$elm_ui$Internal$Model$addNearbyElement = F3(
	function (location, elem, existing) {
		var nearby = A2($mdgriffith$elm_ui$Internal$Model$nearbyElement, location, elem);
		switch (existing.$) {
			case 0:
				if (location === 5) {
					return $mdgriffith$elm_ui$Internal$Model$ChildrenBehind(
						_List_fromArray(
							[nearby]));
				} else {
					return $mdgriffith$elm_ui$Internal$Model$ChildrenInFront(
						_List_fromArray(
							[nearby]));
				}
			case 1:
				var existingBehind = existing.a;
				if (location === 5) {
					return $mdgriffith$elm_ui$Internal$Model$ChildrenBehind(
						A2($elm$core$List$cons, nearby, existingBehind));
				} else {
					return A2(
						$mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront,
						existingBehind,
						_List_fromArray(
							[nearby]));
				}
			case 2:
				var existingInFront = existing.a;
				if (location === 5) {
					return A2(
						$mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront,
						_List_fromArray(
							[nearby]),
						existingInFront);
				} else {
					return $mdgriffith$elm_ui$Internal$Model$ChildrenInFront(
						A2($elm$core$List$cons, nearby, existingInFront));
				}
			default:
				var existingBehind = existing.a;
				var existingInFront = existing.b;
				if (location === 5) {
					return A2(
						$mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront,
						A2($elm$core$List$cons, nearby, existingBehind),
						existingInFront);
				} else {
					return A2(
						$mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront,
						existingBehind,
						A2($elm$core$List$cons, nearby, existingInFront));
				}
		}
	});
var $mdgriffith$elm_ui$Internal$Model$addNodeName = F2(
	function (newNode, old) {
		switch (old.$) {
			case 0:
				return $mdgriffith$elm_ui$Internal$Model$NodeName(newNode);
			case 1:
				var name = old.a;
				return A2($mdgriffith$elm_ui$Internal$Model$Embedded, name, newNode);
			default:
				var x = old.a;
				var y = old.b;
				return A2($mdgriffith$elm_ui$Internal$Model$Embedded, x, y);
		}
	});
var $mdgriffith$elm_ui$Internal$Model$alignXName = function (align) {
	switch (align) {
		case 0:
			return $mdgriffith$elm_ui$Internal$Style$classes.d4 + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.e3);
		case 2:
			return $mdgriffith$elm_ui$Internal$Style$classes.d4 + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.e4);
		default:
			return $mdgriffith$elm_ui$Internal$Style$classes.d4 + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.gY);
	}
};
var $mdgriffith$elm_ui$Internal$Model$alignYName = function (align) {
	switch (align) {
		case 0:
			return $mdgriffith$elm_ui$Internal$Style$classes.d5 + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.g2);
		case 2:
			return $mdgriffith$elm_ui$Internal$Style$classes.d5 + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.gX);
		default:
			return $mdgriffith$elm_ui$Internal$Style$classes.d5 + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.gZ);
	}
};
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $mdgriffith$elm_ui$Internal$Model$FullTransform = F4(
	function (a, b, c, d) {
		return {$: 2, a: a, b: b, c: c, d: d};
	});
var $mdgriffith$elm_ui$Internal$Model$Moved = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$composeTransformation = F2(
	function (transform, component) {
		switch (transform.$) {
			case 0:
				switch (component.$) {
					case 0:
						var x = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(x, 0, 0));
					case 1:
						var y = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(0, y, 0));
					case 2:
						var z = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(0, 0, z));
					case 3:
						var xyz = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(xyz);
					case 4:
						var xyz = component.a;
						var angle = component.b;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(0, 0, 0),
							_Utils_Tuple3(1, 1, 1),
							xyz,
							angle);
					default:
						var xyz = component.a;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
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
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(newX, y, z));
					case 1:
						var newY = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(x, newY, z));
					case 2:
						var newZ = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(x, y, newZ));
					case 3:
						var xyz = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(xyz);
					case 4:
						var xyz = component.a;
						var angle = component.b;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							moved,
							_Utils_Tuple3(1, 1, 1),
							xyz,
							angle);
					default:
						var scale = component.a;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
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
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(newX, y, z),
							scaled,
							origin,
							angle);
					case 1:
						var newY = component.a;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(x, newY, z),
							scaled,
							origin,
							angle);
					case 2:
						var newZ = component.a;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(x, y, newZ),
							scaled,
							origin,
							angle);
					case 3:
						var newMove = component.a;
						return A4($mdgriffith$elm_ui$Internal$Model$FullTransform, newMove, scaled, origin, angle);
					case 4:
						var newOrigin = component.a;
						var newAngle = component.b;
						return A4($mdgriffith$elm_ui$Internal$Model$FullTransform, moved, scaled, newOrigin, newAngle);
					default:
						var newScale = component.a;
						return A4($mdgriffith$elm_ui$Internal$Model$FullTransform, moved, newScale, origin, angle);
				}
		}
	});
var $mdgriffith$elm_ui$Internal$Flag$height = $mdgriffith$elm_ui$Internal$Flag$flag(7);
var $mdgriffith$elm_ui$Internal$Flag$heightContent = $mdgriffith$elm_ui$Internal$Flag$flag(36);
var $mdgriffith$elm_ui$Internal$Flag$merge = F2(
	function (_v0, _v1) {
		var one = _v0.a;
		var two = _v0.b;
		var three = _v1.a;
		var four = _v1.b;
		return A2($mdgriffith$elm_ui$Internal$Flag$Field, one | three, two | four);
	});
var $mdgriffith$elm_ui$Internal$Flag$none = A2($mdgriffith$elm_ui$Internal$Flag$Field, 0, 0);
var $mdgriffith$elm_ui$Internal$Model$renderHeight = function (h) {
	switch (h.$) {
		case 0:
			var px = h.a;
			var val = $elm$core$String$fromInt(px);
			var name = 'height-px-' + val;
			return _Utils_Tuple3(
				$mdgriffith$elm_ui$Internal$Flag$none,
				name,
				_List_fromArray(
					[
						A3($mdgriffith$elm_ui$Internal$Model$Single, name, 'height', val + 'px')
					]));
		case 1:
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightContent, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.dv,
				_List_Nil);
		case 2:
			var portion = h.a;
			return (portion === 1) ? _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightFill, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.ev,
				_List_Nil) : _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightFill, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.fA + (' height-fill-' + $elm$core$String$fromInt(portion)),
				_List_fromArray(
					[
						A3(
						$mdgriffith$elm_ui$Internal$Model$Single,
						$mdgriffith$elm_ui$Internal$Style$classes.g6 + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.gj + (' > ' + $mdgriffith$elm_ui$Internal$Style$dot(
							'height-fill-' + $elm$core$String$fromInt(portion))))),
						'flex-grow',
						$elm$core$String$fromInt(portion * 100000))
					]));
		case 3:
			var minSize = h.a;
			var len = h.b;
			var cls = 'min-height-' + $elm$core$String$fromInt(minSize);
			var style = A3(
				$mdgriffith$elm_ui$Internal$Model$Single,
				cls,
				'min-height',
				$elm$core$String$fromInt(minSize) + 'px');
			var _v1 = $mdgriffith$elm_ui$Internal$Model$renderHeight(len);
			var newFlag = _v1.a;
			var newAttrs = _v1.b;
			var newStyle = _v1.c;
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightBetween, newFlag),
				cls + (' ' + newAttrs),
				A2($elm$core$List$cons, style, newStyle));
		default:
			var maxSize = h.a;
			var len = h.b;
			var cls = 'max-height-' + $elm$core$String$fromInt(maxSize);
			var style = A3(
				$mdgriffith$elm_ui$Internal$Model$Single,
				cls,
				'max-height',
				$elm$core$String$fromInt(maxSize) + 'px');
			var _v2 = $mdgriffith$elm_ui$Internal$Model$renderHeight(len);
			var newFlag = _v2.a;
			var newAttrs = _v2.b;
			var newStyle = _v2.c;
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightBetween, newFlag),
				cls + (' ' + newAttrs),
				A2($elm$core$List$cons, style, newStyle));
	}
};
var $mdgriffith$elm_ui$Internal$Flag$widthContent = $mdgriffith$elm_ui$Internal$Flag$flag(38);
var $mdgriffith$elm_ui$Internal$Model$renderWidth = function (w) {
	switch (w.$) {
		case 0:
			var px = w.a;
			return _Utils_Tuple3(
				$mdgriffith$elm_ui$Internal$Flag$none,
				$mdgriffith$elm_ui$Internal$Style$classes.gN + (' width-px-' + $elm$core$String$fromInt(px)),
				_List_fromArray(
					[
						A3(
						$mdgriffith$elm_ui$Internal$Model$Single,
						'width-px-' + $elm$core$String$fromInt(px),
						'width',
						$elm$core$String$fromInt(px) + 'px')
					]));
		case 1:
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthContent, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.eY,
				_List_Nil);
		case 2:
			var portion = w.a;
			return (portion === 1) ? _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthFill, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.eZ,
				_List_Nil) : _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthFill, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.gO + (' width-fill-' + $elm$core$String$fromInt(portion)),
				_List_fromArray(
					[
						A3(
						$mdgriffith$elm_ui$Internal$Model$Single,
						$mdgriffith$elm_ui$Internal$Style$classes.g6 + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.gj + (' > ' + $mdgriffith$elm_ui$Internal$Style$dot(
							'width-fill-' + $elm$core$String$fromInt(portion))))),
						'flex-grow',
						$elm$core$String$fromInt(portion * 100000))
					]));
		case 3:
			var minSize = w.a;
			var len = w.b;
			var cls = 'min-width-' + $elm$core$String$fromInt(minSize);
			var style = A3(
				$mdgriffith$elm_ui$Internal$Model$Single,
				cls,
				'min-width',
				$elm$core$String$fromInt(minSize) + 'px');
			var _v1 = $mdgriffith$elm_ui$Internal$Model$renderWidth(len);
			var newFlag = _v1.a;
			var newAttrs = _v1.b;
			var newStyle = _v1.c;
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthBetween, newFlag),
				cls + (' ' + newAttrs),
				A2($elm$core$List$cons, style, newStyle));
		default:
			var maxSize = w.a;
			var len = w.b;
			var cls = 'max-width-' + $elm$core$String$fromInt(maxSize);
			var style = A3(
				$mdgriffith$elm_ui$Internal$Model$Single,
				cls,
				'max-width',
				$elm$core$String$fromInt(maxSize) + 'px');
			var _v2 = $mdgriffith$elm_ui$Internal$Model$renderWidth(len);
			var newFlag = _v2.a;
			var newAttrs = _v2.b;
			var newStyle = _v2.c;
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthBetween, newFlag),
				cls + (' ' + newAttrs),
				A2($elm$core$List$cons, style, newStyle));
	}
};
var $mdgriffith$elm_ui$Internal$Flag$borderWidth = $mdgriffith$elm_ui$Internal$Flag$flag(27);
var $mdgriffith$elm_ui$Internal$Model$skippable = F2(
	function (flag, style) {
		if (_Utils_eq(flag, $mdgriffith$elm_ui$Internal$Flag$borderWidth)) {
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
var $mdgriffith$elm_ui$Internal$Flag$width = $mdgriffith$elm_ui$Internal$Flag$flag(6);
var $mdgriffith$elm_ui$Internal$Flag$xAlign = $mdgriffith$elm_ui$Internal$Flag$flag(30);
var $mdgriffith$elm_ui$Internal$Flag$yAlign = $mdgriffith$elm_ui$Internal$Flag$flag(29);
var $mdgriffith$elm_ui$Internal$Model$gatherAttrRecursive = F8(
	function (classes, node, has, transform, styles, attrs, children, elementAttrs) {
		gatherAttrRecursive:
		while (true) {
			if (!elementAttrs.b) {
				var _v1 = $mdgriffith$elm_ui$Internal$Model$transformClass(transform);
				if (_v1.$ === 1) {
					return {
						bG: A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$class(classes),
							attrs),
						hw: children,
						bN: has,
						fW: node,
						gw: styles
					};
				} else {
					var _class = _v1.a;
					return {
						bG: A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$class(classes + (' ' + _class)),
							attrs),
						hw: children,
						bN: has,
						fW: node,
						gw: A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Internal$Model$Transform(transform),
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
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, flag, has)) {
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
								$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, flag, has),
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
							$temp$attrs = A2($elm$core$List$cons, actualAttribute, attrs),
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
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, flag, has)) {
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
							if (A2($mdgriffith$elm_ui$Internal$Model$skippable, flag, style)) {
								var $temp$classes = $mdgriffith$elm_ui$Internal$Model$getStyleName(style) + (' ' + classes),
									$temp$node = node,
									$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, flag, has),
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
								var $temp$classes = $mdgriffith$elm_ui$Internal$Model$getStyleName(style) + (' ' + classes),
									$temp$node = node,
									$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, flag, has),
									$temp$transform = transform,
									$temp$styles = A2($elm$core$List$cons, style, styles),
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
							$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, flag, has),
							$temp$transform = A2($mdgriffith$elm_ui$Internal$Model$composeTransformation, transform, component),
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
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$width, has)) {
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
									var $temp$classes = ($mdgriffith$elm_ui$Internal$Style$classes.gN + (' width-px-' + $elm$core$String$fromInt(px))) + (' ' + classes),
										$temp$node = node,
										$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$width, has),
										$temp$transform = transform,
										$temp$styles = A2(
										$elm$core$List$cons,
										A3(
											$mdgriffith$elm_ui$Internal$Model$Single,
											'width-px-' + $elm$core$String$fromInt(px),
											'width',
											$elm$core$String$fromInt(px) + 'px'),
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
									var $temp$classes = classes + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.eY),
										$temp$node = node,
										$temp$has = A2(
										$mdgriffith$elm_ui$Internal$Flag$add,
										$mdgriffith$elm_ui$Internal$Flag$widthContent,
										A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$width, has)),
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
										var $temp$classes = classes + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.eZ),
											$temp$node = node,
											$temp$has = A2(
											$mdgriffith$elm_ui$Internal$Flag$add,
											$mdgriffith$elm_ui$Internal$Flag$widthFill,
											A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$width, has)),
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
										var $temp$classes = classes + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.gO + (' width-fill-' + $elm$core$String$fromInt(portion)))),
											$temp$node = node,
											$temp$has = A2(
											$mdgriffith$elm_ui$Internal$Flag$add,
											$mdgriffith$elm_ui$Internal$Flag$widthFill,
											A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$width, has)),
											$temp$transform = transform,
											$temp$styles = A2(
											$elm$core$List$cons,
											A3(
												$mdgriffith$elm_ui$Internal$Model$Single,
												$mdgriffith$elm_ui$Internal$Style$classes.g6 + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.gj + (' > ' + $mdgriffith$elm_ui$Internal$Style$dot(
													'width-fill-' + $elm$core$String$fromInt(portion))))),
												'flex-grow',
												$elm$core$String$fromInt(portion * 100000)),
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
									var _v4 = $mdgriffith$elm_ui$Internal$Model$renderWidth(width);
									var addToFlags = _v4.a;
									var newClass = _v4.b;
									var newStyles = _v4.c;
									var $temp$classes = classes + (' ' + newClass),
										$temp$node = node,
										$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$merge, addToFlags, has),
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
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$height, has)) {
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
									var val = $elm$core$String$fromInt(px) + 'px';
									var name = 'height-px-' + val;
									var $temp$classes = name + (' ' + classes),
										$temp$node = node,
										$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$height, has),
										$temp$transform = transform,
										$temp$styles = A2(
										$elm$core$List$cons,
										A3($mdgriffith$elm_ui$Internal$Model$Single, name, 'height ', val),
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
									var $temp$classes = $mdgriffith$elm_ui$Internal$Style$classes.dv + (' ' + classes),
										$temp$node = node,
										$temp$has = A2(
										$mdgriffith$elm_ui$Internal$Flag$add,
										$mdgriffith$elm_ui$Internal$Flag$heightContent,
										A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$height, has)),
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
										var $temp$classes = $mdgriffith$elm_ui$Internal$Style$classes.ev + (' ' + classes),
											$temp$node = node,
											$temp$has = A2(
											$mdgriffith$elm_ui$Internal$Flag$add,
											$mdgriffith$elm_ui$Internal$Flag$heightFill,
											A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$height, has)),
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
										var $temp$classes = classes + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.fA + (' height-fill-' + $elm$core$String$fromInt(portion)))),
											$temp$node = node,
											$temp$has = A2(
											$mdgriffith$elm_ui$Internal$Flag$add,
											$mdgriffith$elm_ui$Internal$Flag$heightFill,
											A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$height, has)),
											$temp$transform = transform,
											$temp$styles = A2(
											$elm$core$List$cons,
											A3(
												$mdgriffith$elm_ui$Internal$Model$Single,
												$mdgriffith$elm_ui$Internal$Style$classes.g6 + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.ea + (' > ' + $mdgriffith$elm_ui$Internal$Style$dot(
													'height-fill-' + $elm$core$String$fromInt(portion))))),
												'flex-grow',
												$elm$core$String$fromInt(portion * 100000)),
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
									var _v6 = $mdgriffith$elm_ui$Internal$Model$renderHeight(height);
									var addToFlags = _v6.a;
									var newClass = _v6.b;
									var newStyles = _v6.c;
									var $temp$classes = classes + (' ' + newClass),
										$temp$node = node,
										$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$merge, addToFlags, has),
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
									$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'main', node),
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
									$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'nav', node),
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
									$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'footer', node),
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
									$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'aside', node),
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
										$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'h1', node),
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
											$mdgriffith$elm_ui$Internal$Model$addNodeName,
											'h' + $elm$core$String$fromInt(i),
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
											$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'h6', node),
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
											return $mdgriffith$elm_ui$Internal$Model$NodeName('p');
										case 1:
											var name = node.a;
											return $mdgriffith$elm_ui$Internal$Model$NodeName(name);
										default:
											var x = node.a;
											var y = node.b;
											return A2($mdgriffith$elm_ui$Internal$Model$Embedded, x, y);
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
									$elm$core$List$cons,
									A2($elm$virtual_dom$VirtualDom$attribute, 'role', 'button'),
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
									$elm$core$List$cons,
									A2($elm$virtual_dom$VirtualDom$attribute, 'aria-label', label),
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
									$elm$core$List$cons,
									A2($elm$virtual_dom$VirtualDom$attribute, 'aria-live', 'polite'),
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
									$elm$core$List$cons,
									A2($elm$virtual_dom$VirtualDom$attribute, 'aria-live', 'assertive'),
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
									return _Utils_ap(styles, styled.gw);
							}
						}();
						var $temp$classes = classes,
							$temp$node = node,
							$temp$has = has,
							$temp$transform = transform,
							$temp$styles = newStyles,
							$temp$attrs = attrs,
							$temp$children = A3($mdgriffith$elm_ui$Internal$Model$addNearbyElement, location, elem, children),
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
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$xAlign, has)) {
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
							var $temp$classes = $mdgriffith$elm_ui$Internal$Model$alignXName(x) + (' ' + classes),
								$temp$node = node,
								$temp$has = function (flags) {
								switch (x) {
									case 1:
										return A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$centerX, flags);
									case 2:
										return A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$alignRight, flags);
									default:
										return flags;
								}
							}(
								A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$xAlign, has)),
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
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$yAlign, has)) {
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
							var $temp$classes = $mdgriffith$elm_ui$Internal$Model$alignYName(y) + (' ' + classes),
								$temp$node = node,
								$temp$has = function (flags) {
								switch (y) {
									case 1:
										return A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$centerY, flags);
									case 2:
										return A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$alignBottom, flags);
									default:
										return flags;
								}
							}(
								A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$yAlign, has)),
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
var $mdgriffith$elm_ui$Internal$Model$Untransformed = {$: 0};
var $mdgriffith$elm_ui$Internal$Model$untransformed = $mdgriffith$elm_ui$Internal$Model$Untransformed;
var $mdgriffith$elm_ui$Internal$Model$element = F4(
	function (context, node, attributes, children) {
		return A3(
			$mdgriffith$elm_ui$Internal$Model$createElement,
			context,
			children,
			A8(
				$mdgriffith$elm_ui$Internal$Model$gatherAttrRecursive,
				$mdgriffith$elm_ui$Internal$Model$contextClasses(context),
				node,
				$mdgriffith$elm_ui$Internal$Flag$none,
				$mdgriffith$elm_ui$Internal$Model$untransformed,
				_List_Nil,
				_List_Nil,
				$mdgriffith$elm_ui$Internal$Model$NoNearbyChildren,
				$elm$core$List$reverse(attributes)));
	});
var $mdgriffith$elm_ui$Internal$Model$Height = function (a) {
	return {$: 8, a: a};
};
var $mdgriffith$elm_ui$Element$height = $mdgriffith$elm_ui$Internal$Model$Height;
var $mdgriffith$elm_ui$Internal$Model$Attr = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$htmlClass = function (cls) {
	return $mdgriffith$elm_ui$Internal$Model$Attr(
		$elm$html$Html$Attributes$class(cls));
};
var $mdgriffith$elm_ui$Internal$Model$Content = {$: 1};
var $mdgriffith$elm_ui$Element$shrink = $mdgriffith$elm_ui$Internal$Model$Content;
var $mdgriffith$elm_ui$Internal$Model$Width = function (a) {
	return {$: 7, a: a};
};
var $mdgriffith$elm_ui$Element$width = $mdgriffith$elm_ui$Internal$Model$Width;
var $mdgriffith$elm_ui$Element$column = F2(
	function (attrs, children) {
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asColumn,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.hJ + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.cH)),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
						attrs))),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(children));
	});
var $mdgriffith$elm_ui$Element$el = F2(
	function (attrs, child) {
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asEl,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
					attrs)),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(
				_List_fromArray(
					[child])));
	});
var $mdgriffith$elm_ui$Internal$Model$FontFamily = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Flag$fontFamily = $mdgriffith$elm_ui$Internal$Flag$flag(5);
var $elm$core$String$words = _String_words;
var $mdgriffith$elm_ui$Internal$Model$renderFontClassName = F2(
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
							$elm$core$String$join,
							'-',
							$elm$core$String$words(
								$elm$core$String$toLower(name)));
					case 4:
						var name = font.a;
						var url = font.b;
						return A2(
							$elm$core$String$join,
							'-',
							$elm$core$String$words(
								$elm$core$String$toLower(name)));
					default:
						var name = font.a.C;
						return A2(
							$elm$core$String$join,
							'-',
							$elm$core$String$words(
								$elm$core$String$toLower(name)));
				}
			}());
	});
var $mdgriffith$elm_ui$Element$Font$family = function (families) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$fontFamily,
		A2(
			$mdgriffith$elm_ui$Internal$Model$FontFamily,
			A3($elm$core$List$foldl, $mdgriffith$elm_ui$Internal$Model$renderFontClassName, 'ff-', families),
			families));
};
var $mdgriffith$elm_ui$Internal$Model$Fill = function (a) {
	return {$: 2, a: a};
};
var $mdgriffith$elm_ui$Element$fill = $mdgriffith$elm_ui$Internal$Model$Fill(1);
var $elm$core$List$intersperse = F2(
	function (sep, xs) {
		if (!xs.b) {
			return _List_Nil;
		} else {
			var hd = xs.a;
			var tl = xs.b;
			var step = F2(
				function (x, rest) {
					return A2(
						$elm$core$List$cons,
						sep,
						A2($elm$core$List$cons, x, rest));
				});
			var spersed = A3($elm$core$List$foldr, step, _List_Nil, tl);
			return A2($elm$core$List$cons, hd, spersed);
		}
	});
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$html$Html$Attributes$rel = _VirtualDom_attribute('rel');
var $mdgriffith$elm_ui$Element$link = F2(
	function (attrs, _v0) {
		var url = _v0.da;
		var label = _v0.F;
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asEl,
			$mdgriffith$elm_ui$Internal$Model$NodeName('a'),
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Internal$Model$Attr(
					$elm$html$Html$Attributes$href(url)),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Internal$Model$Attr(
						$elm$html$Html$Attributes$rel('noopener noreferrer')),
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
							A2(
								$elm$core$List$cons,
								$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.dk + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.bl)),
								attrs))))),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(
				_List_fromArray(
					[label])));
	});
var $mdgriffith$elm_ui$Internal$Model$Max = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $mdgriffith$elm_ui$Element$maximum = F2(
	function (i, l) {
		return A2($mdgriffith$elm_ui$Internal$Model$Max, i, l);
	});
var $mdgriffith$elm_ui$Internal$Model$Hover = 1;
var $mdgriffith$elm_ui$Internal$Model$PseudoSelector = F2(
	function (a, b) {
		return {$: 11, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Flag$hover = $mdgriffith$elm_ui$Internal$Flag$flag(33);
var $mdgriffith$elm_ui$Internal$Model$AlignY = function (a) {
	return {$: 5, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$Class = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$Describe = function (a) {
	return {$: 2, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$Nearby = F2(
	function (a, b) {
		return {$: 9, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$NoAttribute = {$: 0};
var $mdgriffith$elm_ui$Internal$Model$TransformComponent = F2(
	function (a, b) {
		return {$: 10, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$Empty = {$: 3};
var $mdgriffith$elm_ui$Internal$Model$Text = function (a) {
	return {$: 2, a: a};
};
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $mdgriffith$elm_ui$Internal$Model$map = F2(
	function (fn, el) {
		switch (el.$) {
			case 1:
				var styled = el.a;
				return $mdgriffith$elm_ui$Internal$Model$Styled(
					{
						iz: F2(
							function (add, context) {
								return A2(
									$elm$virtual_dom$VirtualDom$map,
									fn,
									A2(styled.iz, add, context));
							}),
						gw: styled.gw
					});
			case 0:
				var html = el.a;
				return $mdgriffith$elm_ui$Internal$Model$Unstyled(
					A2(
						$elm$core$Basics$composeL,
						$elm$virtual_dom$VirtualDom$map(fn),
						html));
			case 2:
				var str = el.a;
				return $mdgriffith$elm_ui$Internal$Model$Text(str);
			default:
				return $mdgriffith$elm_ui$Internal$Model$Empty;
		}
	});
var $elm$virtual_dom$VirtualDom$mapAttribute = _VirtualDom_mapAttribute;
var $mdgriffith$elm_ui$Internal$Model$mapAttrFromStyle = F2(
	function (fn, attr) {
		switch (attr.$) {
			case 0:
				return $mdgriffith$elm_ui$Internal$Model$NoAttribute;
			case 2:
				var description = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$Describe(description);
			case 6:
				var x = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$AlignX(x);
			case 5:
				var y = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$AlignY(y);
			case 7:
				var x = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$Width(x);
			case 8:
				var x = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$Height(x);
			case 3:
				var x = attr.a;
				var y = attr.b;
				return A2($mdgriffith$elm_ui$Internal$Model$Class, x, y);
			case 4:
				var flag = attr.a;
				var style = attr.b;
				return A2($mdgriffith$elm_ui$Internal$Model$StyleClass, flag, style);
			case 9:
				var location = attr.a;
				var elem = attr.b;
				return A2(
					$mdgriffith$elm_ui$Internal$Model$Nearby,
					location,
					A2($mdgriffith$elm_ui$Internal$Model$map, fn, elem));
			case 1:
				var htmlAttr = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$Attr(
					A2($elm$virtual_dom$VirtualDom$mapAttribute, fn, htmlAttr));
			default:
				var fl = attr.a;
				var trans = attr.b;
				return A2($mdgriffith$elm_ui$Internal$Model$TransformComponent, fl, trans);
		}
	});
var $mdgriffith$elm_ui$Internal$Model$removeNever = function (style) {
	return A2($mdgriffith$elm_ui$Internal$Model$mapAttrFromStyle, $elm$core$Basics$never, style);
};
var $mdgriffith$elm_ui$Internal$Model$unwrapDecsHelper = F2(
	function (attr, _v0) {
		var styles = _v0.a;
		var trans = _v0.b;
		var _v1 = $mdgriffith$elm_ui$Internal$Model$removeNever(attr);
		switch (_v1.$) {
			case 4:
				var style = _v1.b;
				return _Utils_Tuple2(
					A2($elm$core$List$cons, style, styles),
					trans);
			case 10:
				var flag = _v1.a;
				var component = _v1.b;
				return _Utils_Tuple2(
					styles,
					A2($mdgriffith$elm_ui$Internal$Model$composeTransformation, trans, component));
			default:
				return _Utils_Tuple2(styles, trans);
		}
	});
var $mdgriffith$elm_ui$Internal$Model$unwrapDecorations = function (attrs) {
	var _v0 = A3(
		$elm$core$List$foldl,
		$mdgriffith$elm_ui$Internal$Model$unwrapDecsHelper,
		_Utils_Tuple2(_List_Nil, $mdgriffith$elm_ui$Internal$Model$Untransformed),
		attrs);
	var styles = _v0.a;
	var transform = _v0.b;
	return A2(
		$elm$core$List$cons,
		$mdgriffith$elm_ui$Internal$Model$Transform(transform),
		styles);
};
var $mdgriffith$elm_ui$Element$mouseOver = function (decs) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$hover,
		A2(
			$mdgriffith$elm_ui$Internal$Model$PseudoSelector,
			1,
			$mdgriffith$elm_ui$Internal$Model$unwrapDecorations(decs)));
};
var $mdgriffith$elm_ui$Internal$Model$PaddingStyle = F5(
	function (a, b, c, d, e) {
		return {$: 7, a: a, b: b, c: c, d: d, e: e};
	});
var $mdgriffith$elm_ui$Internal$Flag$padding = $mdgriffith$elm_ui$Internal$Flag$flag(2);
var $mdgriffith$elm_ui$Element$padding = function (x) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$padding,
		A5(
			$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
			'p-' + $elm$core$String$fromInt(x),
			x,
			x,
			x,
			x));
};
var $mdgriffith$elm_ui$Element$paddingXY = F2(
	function (x, y) {
		return _Utils_eq(x, y) ? A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$padding,
			A5(
				$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
				'p-' + $elm$core$String$fromInt(x),
				x,
				x,
				x,
				x)) : A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$padding,
			A5(
				$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
				'p-' + ($elm$core$String$fromInt(x) + ('-' + $elm$core$String$fromInt(y))),
				y,
				x,
				y,
				x));
	});
var $elm$url$Url$percentDecode = _Url_percentDecode;
var $mdgriffith$elm_ui$Internal$Model$Rgba = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $mdgriffith$elm_ui$Element$rgb = F3(
	function (r, g, b) {
		return A4($mdgriffith$elm_ui$Internal$Model$Rgba, r, g, b, 1);
	});
var $mdgriffith$elm_ui$Element$rgba = $mdgriffith$elm_ui$Internal$Model$Rgba;
var $mdgriffith$elm_ui$Internal$Flag$borderRound = $mdgriffith$elm_ui$Internal$Flag$flag(17);
var $mdgriffith$elm_ui$Element$Border$rounded = function (radius) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$borderRound,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Single,
			'br-' + $elm$core$String$fromInt(radius),
			'border-radius',
			$elm$core$String$fromInt(radius) + 'px'));
};
var $mdgriffith$elm_ui$Element$text = function (content) {
	return $mdgriffith$elm_ui$Internal$Model$Text(content);
};
var $elm_community$string_extra$String$Extra$changeCase = F2(
	function (mutator, word) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2(
				$elm$core$Maybe$map,
				function (_v0) {
					var head = _v0.a;
					var tail = _v0.b;
					return A2(
						$elm$core$String$cons,
						mutator(head),
						tail);
				},
				$elm$core$String$uncons(word)));
	});
var $elm$core$Char$toUpper = _Char_toUpper;
var $elm_community$string_extra$String$Extra$toSentenceCase = function (word) {
	return A2($elm_community$string_extra$String$Extra$changeCase, $elm$core$Char$toUpper, word);
};
var $mdgriffith$elm_ui$Internal$Model$Typeface = function (a) {
	return {$: 3, a: a};
};
var $mdgriffith$elm_ui$Element$Font$typeface = $mdgriffith$elm_ui$Internal$Model$Typeface;
var $mdgriffith$elm_ui$Internal$Model$SpacingStyle = F3(
	function (a, b, c) {
		return {$: 5, a: a, b: b, c: c};
	});
var $mdgriffith$elm_ui$Internal$Model$AsRow = 0;
var $mdgriffith$elm_ui$Internal$Model$asRow = 0;
var $mdgriffith$elm_ui$Internal$Model$Padding = F5(
	function (a, b, c, d, e) {
		return {$: 0, a: a, b: b, c: c, d: d, e: e};
	});
var $mdgriffith$elm_ui$Internal$Model$Spaced = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $mdgriffith$elm_ui$Internal$Model$extractSpacingAndPadding = function (attrs) {
	return A3(
		$elm$core$List$foldr,
		F2(
			function (attr, _v0) {
				var pad = _v0.a;
				var spacing = _v0.b;
				return _Utils_Tuple2(
					function () {
						if (!pad.$) {
							var x = pad.a;
							return pad;
						} else {
							if ((attr.$ === 4) && (attr.b.$ === 7)) {
								var _v3 = attr.b;
								var name = _v3.a;
								var t = _v3.b;
								var r = _v3.c;
								var b = _v3.d;
								var l = _v3.e;
								return $elm$core$Maybe$Just(
									A5($mdgriffith$elm_ui$Internal$Model$Padding, name, t, r, b, l));
							} else {
								return $elm$core$Maybe$Nothing;
							}
						}
					}(),
					function () {
						if (!spacing.$) {
							var x = spacing.a;
							return spacing;
						} else {
							if ((attr.$ === 4) && (attr.b.$ === 5)) {
								var _v6 = attr.b;
								var name = _v6.a;
								var x = _v6.b;
								var y = _v6.c;
								return $elm$core$Maybe$Just(
									A3($mdgriffith$elm_ui$Internal$Model$Spaced, name, x, y));
							} else {
								return $elm$core$Maybe$Nothing;
							}
						}
					}());
			}),
		_Utils_Tuple2($elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing),
		attrs);
};
var $mdgriffith$elm_ui$Internal$Model$paddingName = F4(
	function (top, right, bottom, left) {
		return 'pad-' + ($elm$core$String$fromInt(top) + ('-' + ($elm$core$String$fromInt(right) + ('-' + ($elm$core$String$fromInt(bottom) + ('-' + $elm$core$String$fromInt(left)))))));
	});
var $mdgriffith$elm_ui$Element$paddingEach = function (_v0) {
	var top = _v0.a1;
	var right = _v0.a0;
	var bottom = _v0.aR;
	var left = _v0.aU;
	return (_Utils_eq(top, right) && (_Utils_eq(top, bottom) && _Utils_eq(top, left))) ? A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$padding,
		A5(
			$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
			'p-' + $elm$core$String$fromInt(top),
			top,
			top,
			top,
			top)) : A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$padding,
		A5(
			$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
			A4($mdgriffith$elm_ui$Internal$Model$paddingName, top, right, bottom, left),
			top,
			right,
			bottom,
			left));
};
var $mdgriffith$elm_ui$Internal$Flag$spacing = $mdgriffith$elm_ui$Internal$Flag$flag(3);
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $mdgriffith$elm_ui$Element$wrappedRow = F2(
	function (attrs, children) {
		var _v0 = $mdgriffith$elm_ui$Internal$Model$extractSpacingAndPadding(attrs);
		var padded = _v0.a;
		var spaced = _v0.b;
		if (spaced.$ === 1) {
			return A4(
				$mdgriffith$elm_ui$Internal$Model$element,
				$mdgriffith$elm_ui$Internal$Model$asRow,
				$mdgriffith$elm_ui$Internal$Model$div,
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.cH + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.bl + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.e_)))),
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
							attrs))),
				$mdgriffith$elm_ui$Internal$Model$Unkeyed(children));
		} else {
			var _v2 = spaced.a;
			var spaceName = _v2.a;
			var x = _v2.b;
			var y = _v2.c;
			var newPadding = function () {
				if (!padded.$) {
					var _v5 = padded.a;
					var name = _v5.a;
					var t = _v5.b;
					var r = _v5.c;
					var b = _v5.d;
					var l = _v5.e;
					return ((_Utils_cmp(r, (x / 2) | 0) > -1) && (_Utils_cmp(b, (y / 2) | 0) > -1)) ? $elm$core$Maybe$Just(
						$mdgriffith$elm_ui$Element$paddingEach(
							{aR: b - ((y / 2) | 0), aU: l - ((x / 2) | 0), a0: r - ((x / 2) | 0), a1: t - ((y / 2) | 0)})) : $elm$core$Maybe$Nothing;
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}();
			if (!newPadding.$) {
				var pad = newPadding.a;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$element,
					$mdgriffith$elm_ui$Internal$Model$asRow,
					$mdgriffith$elm_ui$Internal$Model$div,
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.cH + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.bl + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.e_)))),
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
							A2(
								$elm$core$List$cons,
								$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
								_Utils_ap(
									attrs,
									_List_fromArray(
										[pad]))))),
					$mdgriffith$elm_ui$Internal$Model$Unkeyed(children));
			} else {
				var halfY = -(y / 2);
				var halfX = -(x / 2);
				return A4(
					$mdgriffith$elm_ui$Internal$Model$element,
					$mdgriffith$elm_ui$Internal$Model$asEl,
					$mdgriffith$elm_ui$Internal$Model$div,
					attrs,
					$mdgriffith$elm_ui$Internal$Model$Unkeyed(
						_List_fromArray(
							[
								A4(
								$mdgriffith$elm_ui$Internal$Model$element,
								$mdgriffith$elm_ui$Internal$Model$asRow,
								$mdgriffith$elm_ui$Internal$Model$div,
								A2(
									$elm$core$List$cons,
									$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.cH + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.bl + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.e_)))),
									A2(
										$elm$core$List$cons,
										$mdgriffith$elm_ui$Internal$Model$Attr(
											A2(
												$elm$html$Html$Attributes$style,
												'margin',
												$elm$core$String$fromFloat(halfY) + ('px' + (' ' + ($elm$core$String$fromFloat(halfX) + 'px'))))),
										A2(
											$elm$core$List$cons,
											$mdgriffith$elm_ui$Internal$Model$Attr(
												A2(
													$elm$html$Html$Attributes$style,
													'width',
													'calc(100% + ' + ($elm$core$String$fromInt(x) + 'px)'))),
											A2(
												$elm$core$List$cons,
												$mdgriffith$elm_ui$Internal$Model$Attr(
													A2(
														$elm$html$Html$Attributes$style,
														'height',
														'calc(100% + ' + ($elm$core$String$fromInt(y) + 'px)'))),
												A2(
													$elm$core$List$cons,
													A2(
														$mdgriffith$elm_ui$Internal$Model$StyleClass,
														$mdgriffith$elm_ui$Internal$Flag$spacing,
														A3($mdgriffith$elm_ui$Internal$Model$SpacingStyle, spaceName, x, y)),
													_List_Nil))))),
								$mdgriffith$elm_ui$Internal$Model$Unkeyed(children))
							])));
			}
		}
	});
var $author$project$Murol$clickablePath = F2(
	function (maxWidth, model) {
		var strPath = function (path) {
			return function (p) {
				return '/' + p;
			}(
				A2($elm$core$String$join, '/', path));
		};
		var linkView = function (_v1) {
			var n = _v1.a;
			var p = _v1.b;
			return A2(
				$mdgriffith$elm_ui$Element$link,
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Element$paddingXY, 2, 4),
						$mdgriffith$elm_ui$Element$mouseOver(
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$Font$color(
								A4($mdgriffith$elm_ui$Element$rgba, 0.3, 0.4, 0.6, 0.5))
							]))
					]),
				{
					F: A2(
						$mdgriffith$elm_ui$Element$el,
						_List_Nil,
						$mdgriffith$elm_ui$Element$text(
							$elm_community$string_extra$String$Extra$toSentenceCase(
								A2(
									$elm$core$Maybe$withDefault,
									n,
									$elm$url$Url$percentDecode(n))))),
					da: strPath(p)
				});
		};
		var getEveryPaths = F2(
			function (acc, path) {
				getEveryPaths:
				while (true) {
					if (!path.b) {
						return acc;
					} else {
						var current = path.a;
						var rest = path.b;
						var $temp$acc = A2(
							$elm$core$List$cons,
							_Utils_Tuple2(
								current,
								$elm$core$List$reverse(path)),
							acc),
							$temp$path = rest;
						acc = $temp$acc;
						path = $temp$path;
						continue getEveryPaths;
					}
				}
			});
		return A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					A2($mdgriffith$elm_ui$Element$paddingXY, 15, 10),
					$mdgriffith$elm_ui$Element$Background$color(
					A3($mdgriffith$elm_ui$Element$rgb, 0.95, 0.95, 0.95)),
					$mdgriffith$elm_ui$Element$width(
					A2($mdgriffith$elm_ui$Element$maximum, maxWidth, $mdgriffith$elm_ui$Element$fill)),
					$mdgriffith$elm_ui$Element$centerX
				]),
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$wrappedRow,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$Background$color(
							A3($mdgriffith$elm_ui$Element$rgb, 1, 1, 1)),
							$mdgriffith$elm_ui$Element$padding(4),
							$mdgriffith$elm_ui$Element$Border$rounded(5),
							$mdgriffith$elm_ui$Element$Font$family(
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$Font$typeface('Roboto')
								]))
						]),
					function (res) {
						return A2(
							$elm$core$List$cons,
							A2(
								$mdgriffith$elm_ui$Element$el,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$Font$color(
										A3($mdgriffith$elm_ui$Element$rgb, 0.5, 0.5, 0.5))
									]),
								$mdgriffith$elm_ui$Element$text('/')),
							res);
					}(
						A2(
							$elm$core$List$intersperse,
							A2(
								$mdgriffith$elm_ui$Element$el,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$Font$color(
										A3($mdgriffith$elm_ui$Element$rgb, 0.5, 0.5, 0.5))
									]),
								$mdgriffith$elm_ui$Element$text('/')),
							A2(
								$elm$core$List$map,
								linkView,
								A2(
									getEveryPaths,
									_List_Nil,
									$elm$core$List$reverse(
										A2(
											$elm$core$String$split,
											'/',
											A2($elm$core$String$dropLeft, 1, model.da.D))))))))
				]));
	});
var $mdgriffith$elm_ui$Internal$Flag$overflow = $mdgriffith$elm_ui$Internal$Flag$flag(20);
var $mdgriffith$elm_ui$Element$clip = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$overflow, $mdgriffith$elm_ui$Internal$Style$classes.hy);
var $mdgriffith$elm_ui$Internal$Model$Top = 0;
var $mdgriffith$elm_ui$Element$alignTop = $mdgriffith$elm_ui$Internal$Model$AlignY(0);
var $mdgriffith$elm_ui$Internal$Flag$fontWeight = $mdgriffith$elm_ui$Internal$Flag$flag(13);
var $mdgriffith$elm_ui$Element$Font$bold = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$fontWeight, $mdgriffith$elm_ui$Internal$Style$classes.hg);
var $mdgriffith$elm_ui$Element$rgba255 = F4(
	function (red, green, blue, a) {
		return A4($mdgriffith$elm_ui$Internal$Model$Rgba, red / 255, green / 255, blue / 255, a);
	});
var $author$project$Murol$footerStyle = function (season) {
	switch (season) {
		case 0:
			return {
				ah: A4($mdgriffith$elm_ui$Element$rgba255, 76, 115, 56, 1),
				aF: A4($mdgriffith$elm_ui$Element$rgba255, 0, 0, 0, 1),
				ce: A4($mdgriffith$elm_ui$Element$rgba255, 41, 80, 0, 1),
				cf: A4($mdgriffith$elm_ui$Element$rgba, 255, 248, 255, 1),
				W: A4($mdgriffith$elm_ui$Element$rgba255, 226, 242, 211, 0.6)
			};
		case 1:
			return {
				ah: A4($mdgriffith$elm_ui$Element$rgba255, 186, 172, 145, 1),
				aF: A4($mdgriffith$elm_ui$Element$rgba255, 0, 0, 0, 1),
				ce: A4($mdgriffith$elm_ui$Element$rgba255, 38, 110, 182, 1),
				cf: A4($mdgriffith$elm_ui$Element$rgba, 255, 248, 255, 1),
				W: A4($mdgriffith$elm_ui$Element$rgba255, 226, 242, 211, 1)
			};
		case 2:
			return {
				ah: A4($mdgriffith$elm_ui$Element$rgba255, 255, 211, 37, 1),
				aF: A4($mdgriffith$elm_ui$Element$rgba255, 0, 0, 0, 1),
				ce: A4($mdgriffith$elm_ui$Element$rgba255, 69, 22, 6, 255),
				cf: A4($mdgriffith$elm_ui$Element$rgba255, 240, 248, 255, 1),
				W: A4($mdgriffith$elm_ui$Element$rgba255, 255, 237, 167, 1)
			};
		default:
			return {
				ah: A4($mdgriffith$elm_ui$Element$rgba255, 128, 128, 170, 1),
				aF: A4($mdgriffith$elm_ui$Element$rgba255, 0, 0, 0, 1),
				ce: A4($mdgriffith$elm_ui$Element$rgba255, 51, 51, 102, 1),
				cf: A4($mdgriffith$elm_ui$Element$rgba255, 240, 248, 255, 1),
				W: A4($mdgriffith$elm_ui$Element$rgba255, 227, 233, 255, 1)
			};
	}
};
var $mdgriffith$elm_ui$Element$none = $mdgriffith$elm_ui$Internal$Model$Empty;
var $mdgriffith$elm_ui$Element$row = F2(
	function (attrs, children) {
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asRow,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.cH + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.bl)),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
						attrs))),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(children));
	});
var $mdgriffith$elm_ui$Internal$Model$FontSize = function (a) {
	return {$: 2, a: a};
};
var $mdgriffith$elm_ui$Internal$Flag$fontSize = $mdgriffith$elm_ui$Internal$Flag$flag(4);
var $mdgriffith$elm_ui$Element$Font$size = function (i) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$fontSize,
		$mdgriffith$elm_ui$Internal$Model$FontSize(i));
};
var $mdgriffith$elm_ui$Element$spaceEvenly = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$spacing, $mdgriffith$elm_ui$Internal$Style$classes.kq);
var $mdgriffith$elm_ui$Internal$Model$spacingName = F2(
	function (x, y) {
		return 'spacing-' + ($elm$core$String$fromInt(x) + ('-' + $elm$core$String$fromInt(y)));
	});
var $mdgriffith$elm_ui$Element$spacing = function (x) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$spacing,
		A3(
			$mdgriffith$elm_ui$Internal$Model$SpacingStyle,
			A2($mdgriffith$elm_ui$Internal$Model$spacingName, x, x),
			x,
			x));
};
var $mdgriffith$elm_ui$Element$Font$underline = $mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.gI);
var $author$project$Murol$footerView = function (model) {
	var _v0 = model.cm;
	if (!_v0.$) {
		var _v1 = _v0.a;
		var xs_ = _v1.b;
		var strPath = function (path) {
			return function (p) {
				return '/' + p;
			}(
				A2(
					$elm$core$String$join,
					'/',
					A2($elm$core$List$map, $elm$url$Url$percentEncode, path)));
		};
		var subCatView = function (_v3) {
			var pageInfo = _v3.a;
			return A2(
				$mdgriffith$elm_ui$Element$link,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$mouseOver(
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$Background$color(
								$author$project$Murol$footerStyle(model.a.j5).W)
							])),
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
					]),
				{
					F: A2(
						$mdgriffith$elm_ui$Element$row,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Element$el,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$Font$size(24)
									]),
								$mdgriffith$elm_ui$Element$text('›')),
								A2(
								$mdgriffith$elm_ui$Element$el,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$padding(6)
									]),
								$mdgriffith$elm_ui$Element$text(
									$elm_community$string_extra$String$Extra$toSentenceCase(pageInfo.C)))
							])),
					da: strPath(pageInfo.D)
				});
		};
		var maxWidth = A3(
			$author$project$Document$DocumentViews$StyleSheets$docMaxWidth,
			_Utils_Tuple2(model.a.lb, model.a.iu),
			false,
			model.a.dT);
		var mainCatView = function (_v2) {
			var pageInfo = _v2.a;
			var xs = _v2.b;
			return A2(
				$mdgriffith$elm_ui$Element$column,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$alignTop,
						$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
						A2($mdgriffith$elm_ui$Element$paddingXY, 0, 5)
					]),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$link,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$paddingEach(
								{aR: 10, aU: 0, a0: 0, a1: 10}),
								$mdgriffith$elm_ui$Element$mouseOver(
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$Background$color(
										$author$project$Murol$footerStyle(model.a.j5).W)
									])),
								$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
							]),
						{
							F: A2(
								$mdgriffith$elm_ui$Element$row,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$spacing(6)
									]),
								_List_fromArray(
									[
										A2(
										$mdgriffith$elm_ui$Element$el,
										_List_fromArray(
											[
												$mdgriffith$elm_ui$Element$Font$size(24)
											]),
										$mdgriffith$elm_ui$Element$text('›')),
										A2(
										$mdgriffith$elm_ui$Element$el,
										_List_fromArray(
											[$mdgriffith$elm_ui$Element$Font$bold, $mdgriffith$elm_ui$Element$Font$underline]),
										$mdgriffith$elm_ui$Element$text(
											$elm_community$string_extra$String$Extra$toSentenceCase(pageInfo.C)))
									])),
							da: strPath(pageInfo.D)
						}),
						A2(
						$mdgriffith$elm_ui$Element$column,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill)
							]),
						A2($elm$core$List$map, subCatView, xs))
					]));
		};
		return A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
				]),
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$row,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							$author$project$Murol$footerStyle(model.a.j5).ce),
							$mdgriffith$elm_ui$Element$width(
							A2($mdgriffith$elm_ui$Element$maximum, maxWidth, $mdgriffith$elm_ui$Element$fill)),
							$mdgriffith$elm_ui$Element$centerX,
							A2($mdgriffith$elm_ui$Element$paddingXY, 15, 5)
						]),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Element$el,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$Font$color(
									$author$project$Murol$footerStyle(model.a.j5).cf),
									$mdgriffith$elm_ui$Element$Font$size(18)
								]),
							$mdgriffith$elm_ui$Element$text('Raccourcis pages principales: '))
						])),
					A2(
					$mdgriffith$elm_ui$Element$wrappedRow,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width(
							A2($mdgriffith$elm_ui$Element$maximum, maxWidth, $mdgriffith$elm_ui$Element$fill)),
							$mdgriffith$elm_ui$Element$centerX,
							$mdgriffith$elm_ui$Element$spaceEvenly,
							$mdgriffith$elm_ui$Element$Background$color(
							$author$project$Murol$footerStyle(model.a.j5).ah),
							A2($mdgriffith$elm_ui$Element$paddingXY, 15, 0)
						]),
					A2($elm$core$List$map, mainCatView, xs_)),
					A2(
					$mdgriffith$elm_ui$Element$wrappedRow,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							$author$project$Murol$footerStyle(model.a.j5).ce),
							$mdgriffith$elm_ui$Element$width(
							A2($mdgriffith$elm_ui$Element$maximum, maxWidth, $mdgriffith$elm_ui$Element$fill)),
							$mdgriffith$elm_ui$Element$centerX,
							$mdgriffith$elm_ui$Element$spaceEvenly,
							A2($mdgriffith$elm_ui$Element$paddingXY, 15, 5)
						]),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Element$link,
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Element$paddingXY, 0, 5)
								]),
							{
								F: A2(
									$mdgriffith$elm_ui$Element$el,
									_List_fromArray(
										[
											$mdgriffith$elm_ui$Element$Font$color(
											$author$project$Murol$footerStyle(model.a.j5).cf),
											$mdgriffith$elm_ui$Element$Font$underline
										]),
									$mdgriffith$elm_ui$Element$text('Plan de site')),
								da: '/accueil/plan de site'
							}),
							A2(
							$mdgriffith$elm_ui$Element$link,
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Element$paddingXY, 0, 5)
								]),
							{
								F: A2(
									$mdgriffith$elm_ui$Element$el,
									_List_fromArray(
										[
											$mdgriffith$elm_ui$Element$Font$color(
											A3($mdgriffith$elm_ui$Element$rgb, 1, 1, 1)),
											$mdgriffith$elm_ui$Element$Font$underline
										]),
									$mdgriffith$elm_ui$Element$text('Contacter le webmaster')),
								da: '/accueil/contact'
							}),
							A2(
							$mdgriffith$elm_ui$Element$link,
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Element$paddingXY, 0, 5)
								]),
							{
								F: A2(
									$mdgriffith$elm_ui$Element$el,
									_List_fromArray(
										[
											$mdgriffith$elm_ui$Element$Font$color(
											A3($mdgriffith$elm_ui$Element$rgb, 1, 1, 1)),
											$mdgriffith$elm_ui$Element$Font$underline
										]),
									$mdgriffith$elm_ui$Element$text('Mentions légales')),
								da: '/accueil/mentions légales'
							})
						]))
				]));
	} else {
		return $mdgriffith$elm_ui$Element$none;
	}
};
var $mdgriffith$elm_ui$Element$htmlAttribute = $mdgriffith$elm_ui$Internal$Model$Attr;
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $mdgriffith$elm_ui$Element$Background$image = function (src) {
	return $mdgriffith$elm_ui$Internal$Model$Attr(
		A2($elm$virtual_dom$VirtualDom$style, 'background', 'url(\"' + (src + '\") center / cover no-repeat')));
};
var $mdgriffith$elm_ui$Internal$Model$OnlyDynamic = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$StaticRootAndDynamic = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$AllowHover = 1;
var $mdgriffith$elm_ui$Internal$Model$Layout = 1;
var $mdgriffith$elm_ui$Internal$Model$focusDefaultStyle = {
	g9: $elm$core$Maybe$Nothing,
	hh: $elm$core$Maybe$Nothing,
	kl: $elm$core$Maybe$Just(
		{
			hf: 3,
			hB: A4($mdgriffith$elm_ui$Internal$Model$Rgba, 155 / 255, 203 / 255, 1, 1),
			js: _Utils_Tuple2(0, 0),
			eS: 3
		})
};
var $mdgriffith$elm_ui$Internal$Model$optionsToRecord = function (options) {
	var combine = F2(
		function (opt, record) {
			switch (opt.$) {
				case 0:
					var hoverable = opt.a;
					var _v4 = record.W;
					if (_v4.$ === 1) {
						return _Utils_update(
							record,
							{
								W: $elm$core$Maybe$Just(hoverable)
							});
					} else {
						return record;
					}
				case 1:
					var focusStyle = opt.a;
					var _v5 = record.fs;
					if (_v5.$ === 1) {
						return _Utils_update(
							record,
							{
								fs: $elm$core$Maybe$Just(focusStyle)
							});
					} else {
						return record;
					}
				default:
					var renderMode = opt.a;
					var _v6 = record.e;
					if (_v6.$ === 1) {
						return _Utils_update(
							record,
							{
								e: $elm$core$Maybe$Just(renderMode)
							});
					} else {
						return record;
					}
			}
		});
	var andFinally = function (record) {
		return {
			fs: function () {
				var _v0 = record.fs;
				if (_v0.$ === 1) {
					return $mdgriffith$elm_ui$Internal$Model$focusDefaultStyle;
				} else {
					var focusable = _v0.a;
					return focusable;
				}
			}(),
			W: function () {
				var _v1 = record.W;
				if (_v1.$ === 1) {
					return 1;
				} else {
					var hoverable = _v1.a;
					return hoverable;
				}
			}(),
			e: function () {
				var _v2 = record.e;
				if (_v2.$ === 1) {
					return 1;
				} else {
					var actualMode = _v2.a;
					return actualMode;
				}
			}()
		};
	};
	return andFinally(
		A3(
			$elm$core$List$foldr,
			combine,
			{fs: $elm$core$Maybe$Nothing, W: $elm$core$Maybe$Nothing, e: $elm$core$Maybe$Nothing},
			options));
};
var $mdgriffith$elm_ui$Internal$Model$toHtml = F2(
	function (mode, el) {
		switch (el.$) {
			case 0:
				var html = el.a;
				return html($mdgriffith$elm_ui$Internal$Model$asEl);
			case 1:
				var styles = el.a.gw;
				var html = el.a.iz;
				return A2(
					html,
					mode(styles),
					$mdgriffith$elm_ui$Internal$Model$asEl);
			case 2:
				var text = el.a;
				return $mdgriffith$elm_ui$Internal$Model$textElement(text);
			default:
				return $mdgriffith$elm_ui$Internal$Model$textElement('');
		}
	});
var $mdgriffith$elm_ui$Internal$Model$renderRoot = F3(
	function (optionList, attributes, child) {
		var options = $mdgriffith$elm_ui$Internal$Model$optionsToRecord(optionList);
		var embedStyle = function () {
			var _v0 = options.e;
			if (_v0 === 2) {
				return $mdgriffith$elm_ui$Internal$Model$OnlyDynamic(options);
			} else {
				return $mdgriffith$elm_ui$Internal$Model$StaticRootAndDynamic(options);
			}
		}();
		return A2(
			$mdgriffith$elm_ui$Internal$Model$toHtml,
			embedStyle,
			A4(
				$mdgriffith$elm_ui$Internal$Model$element,
				$mdgriffith$elm_ui$Internal$Model$asEl,
				$mdgriffith$elm_ui$Internal$Model$div,
				attributes,
				$mdgriffith$elm_ui$Internal$Model$Unkeyed(
					_List_fromArray(
						[child]))));
	});
var $mdgriffith$elm_ui$Internal$Model$SansSerif = {$: 1};
var $mdgriffith$elm_ui$Internal$Model$rootStyle = function () {
	var families = _List_fromArray(
		[
			$mdgriffith$elm_ui$Internal$Model$Typeface('Open Sans'),
			$mdgriffith$elm_ui$Internal$Model$Typeface('Helvetica'),
			$mdgriffith$elm_ui$Internal$Model$Typeface('Verdana'),
			$mdgriffith$elm_ui$Internal$Model$SansSerif
		]);
	return _List_fromArray(
		[
			A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$bgColor,
			A3(
				$mdgriffith$elm_ui$Internal$Model$Colored,
				'bg-color-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(
					A4($mdgriffith$elm_ui$Internal$Model$Rgba, 1, 1, 1, 0)),
				'background-color',
				A4($mdgriffith$elm_ui$Internal$Model$Rgba, 1, 1, 1, 0))),
			A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$fontColor,
			A3(
				$mdgriffith$elm_ui$Internal$Model$Colored,
				'font-color-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(
					A4($mdgriffith$elm_ui$Internal$Model$Rgba, 0, 0, 0, 1)),
				'color',
				A4($mdgriffith$elm_ui$Internal$Model$Rgba, 0, 0, 0, 1))),
			A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$fontSize,
			$mdgriffith$elm_ui$Internal$Model$FontSize(20)),
			A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$fontFamily,
			A2(
				$mdgriffith$elm_ui$Internal$Model$FontFamily,
				A3($elm$core$List$foldl, $mdgriffith$elm_ui$Internal$Model$renderFontClassName, 'font-', families),
				families))
		]);
}();
var $mdgriffith$elm_ui$Element$layoutWith = F3(
	function (_v0, attrs, child) {
		var options = _v0.jC;
		return A3(
			$mdgriffith$elm_ui$Internal$Model$renderRoot,
			options,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Internal$Model$htmlClass(
					A2(
						$elm$core$String$join,
						' ',
						_List_fromArray(
							[$mdgriffith$elm_ui$Internal$Style$classes.I, $mdgriffith$elm_ui$Internal$Style$classes.g6, $mdgriffith$elm_ui$Internal$Style$classes.km]))),
				_Utils_ap($mdgriffith$elm_ui$Internal$Model$rootStyle, attrs)),
			child);
	});
var $mdgriffith$elm_ui$Element$layout = $mdgriffith$elm_ui$Element$layoutWith(
	{jC: _List_Nil});
var $mdgriffith$elm_ui$Internal$Model$CenterY = 1;
var $mdgriffith$elm_ui$Element$centerY = $mdgriffith$elm_ui$Internal$Model$AlignY(1);
var $mdgriffith$elm_ui$Element$clipX = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$overflow, $mdgriffith$elm_ui$Internal$Style$classes.hz);
var $mdgriffith$elm_ui$Internal$Flag$fontAlignment = $mdgriffith$elm_ui$Internal$Flag$flag(12);
var $mdgriffith$elm_ui$Element$Font$center = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$fontAlignment, $mdgriffith$elm_ui$Internal$Style$classes.kL);
var $author$project$Document$DocumentViews$StyleSheets$headingStyles = F3(
	function (season, _v0, editMode) {
		var winWidth = _v0.a;
		var winHeight = _v0.b;
		var seasonAttr = function () {
			switch (season) {
				case 0:
					return $elm$core$Dict$fromList(
						_List_fromArray(
							[
								_Utils_Tuple2(
								1,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$Background$color(
										A4($mdgriffith$elm_ui$Element$rgba255, 102, 153, 140, 1)),
										$mdgriffith$elm_ui$Element$Font$color(
										A4($mdgriffith$elm_ui$Element$rgba255, 240, 248, 255, 1))
									])),
								_Utils_Tuple2(
								2,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$Background$color(
										A4($mdgriffith$elm_ui$Element$rgba255, 102, 153, 140, 1)),
										$mdgriffith$elm_ui$Element$Font$color(
										A4($mdgriffith$elm_ui$Element$rgba255, 240, 248, 255, 1))
									])),
								_Utils_Tuple2(3, _List_Nil)
							]));
				case 1:
					return $elm$core$Dict$fromList(
						_List_fromArray(
							[
								_Utils_Tuple2(
								1,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$Background$color(
										A4($mdgriffith$elm_ui$Element$rgba255, 186, 172, 145, 1)),
										$mdgriffith$elm_ui$Element$Font$color(
										A4($mdgriffith$elm_ui$Element$rgba255, 0, 0, 0, 1))
									])),
								_Utils_Tuple2(
								2,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$Background$color(
										A4($mdgriffith$elm_ui$Element$rgba255, 255, 193, 58, 1)),
										$mdgriffith$elm_ui$Element$Font$color(
										A4($mdgriffith$elm_ui$Element$rgba255, 0, 0, 0, 1))
									])),
								_Utils_Tuple2(3, _List_Nil)
							]));
				case 2:
					return $elm$core$Dict$fromList(
						_List_fromArray(
							[
								_Utils_Tuple2(
								1,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$Background$color(
										A4($mdgriffith$elm_ui$Element$rgba255, 205, 133, 63, 1)),
										$mdgriffith$elm_ui$Element$Font$color(
										A4($mdgriffith$elm_ui$Element$rgba255, 67, 46, 42, 1))
									])),
								_Utils_Tuple2(
								2,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$Background$color(
										A4($mdgriffith$elm_ui$Element$rgba255, 205, 133, 63, 1)),
										$mdgriffith$elm_ui$Element$Font$color(
										A4($mdgriffith$elm_ui$Element$rgba255, 67, 46, 42, 1))
									])),
								_Utils_Tuple2(3, _List_Nil)
							]));
				default:
					return $elm$core$Dict$fromList(
						_List_fromArray(
							[
								_Utils_Tuple2(
								1,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$Background$color(
										A4($mdgriffith$elm_ui$Element$rgba255, 51, 51, 102, 1)),
										$mdgriffith$elm_ui$Element$Font$color(
										A4($mdgriffith$elm_ui$Element$rgba255, 240, 248, 255, 1))
									])),
								_Utils_Tuple2(
								2,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$Background$color(
										A4($mdgriffith$elm_ui$Element$rgba255, 51, 51, 102, 1)),
										$mdgriffith$elm_ui$Element$Font$color(
										A4($mdgriffith$elm_ui$Element$rgba255, 240, 248, 255, 1))
									])),
								_Utils_Tuple2(3, _List_Nil)
							]));
			}
		}();
		var commonAttr = $elm$core$Dict$fromList(
			_List_fromArray(
				[
					_Utils_Tuple2(
					1,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Font$size(18),
							$mdgriffith$elm_ui$Element$Font$center,
							$mdgriffith$elm_ui$Element$Font$bold,
							A2($mdgriffith$elm_ui$Element$paddingXY, 0, 10),
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
						])),
					_Utils_Tuple2(
					2,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Font$size(16),
							$mdgriffith$elm_ui$Element$Font$center,
							$mdgriffith$elm_ui$Element$Font$bold,
							A2($mdgriffith$elm_ui$Element$paddingXY, 0, 2),
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
						])),
					_Utils_Tuple2(
					3,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Font$size(16),
							$mdgriffith$elm_ui$Element$Font$color(
							A3($mdgriffith$elm_ui$Element$rgb, 0, 0.5, 0)),
							$mdgriffith$elm_ui$Element$Font$bold
						]))
				]));
		return A3(
			$elm$core$Dict$foldr,
			F3(
				function (k, v, acc) {
					return A3(
						$elm$core$Dict$update,
						k,
						function (mbSeasonAttr) {
							if (!mbSeasonAttr.$) {
								var attrs = mbSeasonAttr.a;
								return $elm$core$Maybe$Just(
									_Utils_ap(v, attrs));
							} else {
								return $elm$core$Maybe$Just(v);
							}
						},
						acc);
				}),
			commonAttr,
			seasonAttr);
	});
var $mdgriffith$elm_ui$Element$rgb255 = F3(
	function (red, green, blue) {
		return A4($mdgriffith$elm_ui$Internal$Model$Rgba, red / 255, green / 255, blue / 255, 1);
	});
var $mdgriffith$elm_ui$Internal$Model$boxShadowName = function (shadow) {
	return $elm$core$String$concat(
		_List_fromArray(
			[
				shadow.fE ? 'box-inset' : 'box-',
				$elm$core$String$fromFloat(shadow.js.a) + 'px',
				$elm$core$String$fromFloat(shadow.js.b) + 'px',
				$elm$core$String$fromFloat(shadow.hf) + 'px',
				$elm$core$String$fromFloat(shadow.eS) + 'px',
				$mdgriffith$elm_ui$Internal$Model$formatColorClass(shadow.hB)
			]));
};
var $mdgriffith$elm_ui$Internal$Flag$shadows = $mdgriffith$elm_ui$Internal$Flag$flag(19);
var $mdgriffith$elm_ui$Element$Border$shadow = function (almostShade) {
	var shade = {hf: almostShade.hf, hB: almostShade.hB, fE: false, js: almostShade.js, eS: almostShade.eS};
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$shadows,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Single,
			$mdgriffith$elm_ui$Internal$Model$boxShadowName(shade),
			'box-shadow',
			$mdgriffith$elm_ui$Internal$Model$formatBoxShadow(shade)));
};
var $author$project$Document$DocumentViews$StyleSheets$defaultStyleSheet = function (config) {
	return {
		he: _List_Nil,
		hC: _List_fromArray(
			[
				$mdgriffith$elm_ui$Element$spacing(15),
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
			]),
		hS: {
			a3: $elm$core$Dict$fromList(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'colImg',
						_List_fromArray(
							[$mdgriffith$elm_ui$Element$centerX])),
						_Utils_Tuple2('rowImg', _List_Nil),
						_Utils_Tuple2(
						'selected',
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$Border$shadow(
								{
									hf: 10,
									hB: A4($mdgriffith$elm_ui$Element$rgba, 0, 0, 0, 0.45),
									js: _Utils_Tuple2(4, 4),
									eS: 5
								})
							]))
					])),
			iA: $elm$core$Dict$fromList(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'root',
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$padding(20),
								$mdgriffith$elm_ui$Element$spacing(15),
								$mdgriffith$elm_ui$Element$Font$family(
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$Font$typeface('Arial')
									])),
								$mdgriffith$elm_ui$Element$Font$size(16),
								$mdgriffith$elm_ui$Element$width(
								A2(
									$mdgriffith$elm_ui$Element$maximum,
									A3(
										$author$project$Document$DocumentViews$StyleSheets$docMaxWidth,
										_Utils_Tuple2(config.lb, config.iu),
										config.an,
										config.dT),
									$mdgriffith$elm_ui$Element$fill)),
								$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
								$mdgriffith$elm_ui$Element$centerX
							]))
					]))
		},
		is: A3(
			$author$project$Document$DocumentViews$StyleSheets$headingStyles,
			config.j5,
			_Utils_Tuple2(config.lb, config.iu),
			config.an),
		iE: _List_Nil,
		fN: _List_fromArray(
			[
				$mdgriffith$elm_ui$Element$Font$color(
				A3($mdgriffith$elm_ui$Element$rgb, 0, 0.5, 0.5))
			]),
		jG: _List_fromArray(
			[
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
			]),
		jI: function () {
			var _v0 = config.j5;
			switch (_v0) {
				case 0:
					return _List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							A3($mdgriffith$elm_ui$Element$rgb255, 41, 80, 0))
						]);
				case 1:
					return _List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							A4($mdgriffith$elm_ui$Element$rgba255, 255, 193, 58, 1))
						]);
				case 2:
					return _List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							A3($mdgriffith$elm_ui$Element$rgb255, 255, 211, 37))
						]);
				default:
					return _List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							A3($mdgriffith$elm_ui$Element$rgb255, 0, 128, 128))
						]);
			}
		}(),
		jV: _List_Nil,
		j_: _List_fromArray(
			[
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
				$mdgriffith$elm_ui$Element$spacing(15)
			]),
		kM: _List_fromArray(
			[
				$mdgriffith$elm_ui$Element$spacing(15),
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
			]),
		kX: _List_Nil
	};
};
var $mdgriffith$elm_ui$Internal$Model$Heading = function (a) {
	return {$: 4, a: a};
};
var $mdgriffith$elm_ui$Element$Region$heading = A2($elm$core$Basics$composeL, $mdgriffith$elm_ui$Internal$Model$Describe, $mdgriffith$elm_ui$Internal$Model$Heading);
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (!maybeValue.$) {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Document$DocumentViews$DocumentView$idStyle = F2(
	function (_v0, _v1) {
		var customStyles = _v0.hS;
		var uid = _v1.b0;
		var docStyleId = _v1.a8;
		var htmlId = _v1.bc;
		var classes = _v1.a3;
		return _Utils_ap(
			A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				A2(
					$elm$core$Maybe$andThen,
					function (id) {
						return A2($elm$core$Dict$get, id, customStyles.iA);
					},
					docStyleId)),
			_Utils_ap(
				A2(
					$elm$core$Maybe$withDefault,
					_List_Nil,
					A2(
						$elm$core$Maybe$map,
						function (hid) {
							return _List_fromArray(
								[
									$mdgriffith$elm_ui$Element$htmlAttribute(
									$elm$html$Html$Attributes$id(hid))
								]);
						},
						htmlId)),
				$elm$core$List$concat(
					A2(
						$elm$core$List$filterMap,
						function (c) {
							return A2($elm$core$Dict$get, c, customStyles.a3);
						},
						$elm$core$Set$toList(classes)))));
	});
var $mdgriffith$elm_ui$Internal$Model$Paragraph = {$: 9};
var $mdgriffith$elm_ui$Element$paragraph = F2(
	function (attrs, children) {
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asParagraph,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Internal$Model$Describe($mdgriffith$elm_ui$Internal$Model$Paragraph),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Element$spacing(5),
						attrs))),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(children));
	});
var $mdgriffith$elm_ui$Internal$Model$Left = 0;
var $mdgriffith$elm_ui$Element$alignLeft = $mdgriffith$elm_ui$Internal$Model$AlignX(0);
var $mdgriffith$elm_ui$Element$Font$alignLeft = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$fontAlignment, $mdgriffith$elm_ui$Internal$Style$classes.kR);
var $mdgriffith$elm_ui$Internal$Model$Right = 2;
var $mdgriffith$elm_ui$Element$alignRight = $mdgriffith$elm_ui$Internal$Model$AlignX(2);
var $mdgriffith$elm_ui$Element$Font$alignRight = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$fontAlignment, $mdgriffith$elm_ui$Internal$Style$classes.kV);
var $mdgriffith$elm_ui$Internal$Flag$borderColor = $mdgriffith$elm_ui$Internal$Flag$flag(28);
var $mdgriffith$elm_ui$Element$Border$color = function (clr) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$borderColor,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Colored,
			'bc-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(clr),
			'border-color',
			clr));
};
var $mdgriffith$elm_ui$Element$fillPortion = $mdgriffith$elm_ui$Internal$Model$Fill;
var $author$project$Document$DocumentViews$StyleSheets$getDevice = function (config) {
	if (config.an) {
		var _v0 = config.dT;
		switch (_v0) {
			case 0:
				return {b6: 3, dP: 1};
			case 1:
				return {b6: 2, dP: 1};
			case 2:
				return {b6: 1, dP: 0};
			default:
				return {b6: 0, dP: 0};
		}
	} else {
		return $mdgriffith$elm_ui$Element$classifyDevice(
			{iu: config.iu, lb: config.lb});
	}
};
var $mdgriffith$elm_ui$Element$Font$italic = $mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.iR);
var $mdgriffith$elm_ui$Element$Font$justify = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$fontAlignment, $mdgriffith$elm_ui$Internal$Style$classes.kQ);
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $mdgriffith$elm_ui$Element$Events$onClick = A2($elm$core$Basics$composeL, $mdgriffith$elm_ui$Internal$Model$Attr, $elm$html$Html$Events$onClick);
var $elm$html$Html$Events$onDoubleClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'dblclick',
		$elm$json$Json$Decode$succeed(msg));
};
var $mdgriffith$elm_ui$Element$Events$onDoubleClick = A2($elm$core$Basics$composeL, $mdgriffith$elm_ui$Internal$Model$Attr, $elm$html$Html$Events$onDoubleClick);
var $mdgriffith$elm_ui$Internal$Flag$cursor = $mdgriffith$elm_ui$Internal$Flag$flag(21);
var $mdgriffith$elm_ui$Element$pointer = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$cursor, $mdgriffith$elm_ui$Internal$Style$classes.hP);
var $mdgriffith$elm_ui$Internal$Model$Px = function (a) {
	return {$: 0, a: a};
};
var $mdgriffith$elm_ui$Element$px = $mdgriffith$elm_ui$Internal$Model$Px;
var $mdgriffith$elm_ui$Internal$Flag$borderStyle = $mdgriffith$elm_ui$Internal$Flag$flag(11);
var $mdgriffith$elm_ui$Element$Border$solid = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$borderStyle, $mdgriffith$elm_ui$Internal$Style$classes.hk);
var $mdgriffith$elm_ui$Element$spacingXY = F2(
	function (x, y) {
		return A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$spacing,
			A3(
				$mdgriffith$elm_ui$Internal$Model$SpacingStyle,
				A2($mdgriffith$elm_ui$Internal$Model$spacingName, x, y),
				x,
				y));
	});
var $author$project$Document$Document$toSeColor = function (_v0) {
	var r = _v0.a;
	var g = _v0.b;
	var b = _v0.c;
	return A3($mdgriffith$elm_ui$Element$rgb, r, g, b);
};
var $mdgriffith$elm_ui$Internal$Model$BorderWidth = F5(
	function (a, b, c, d, e) {
		return {$: 6, a: a, b: b, c: c, d: d, e: e};
	});
var $mdgriffith$elm_ui$Element$Border$width = function (v) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$borderWidth,
		A5(
			$mdgriffith$elm_ui$Internal$Model$BorderWidth,
			'b-' + $elm$core$String$fromInt(v),
			v,
			v,
			v,
			v));
};
var $author$project$Document$DocumentViews$DocumentView$renderAttrs = F2(
	function (config, attrs) {
		var device = $author$project$Document$DocumentViews$StyleSheets$getDevice(config);
		var renderAttr = function (attr) {
			switch (attr.$) {
				case 0:
					var pad = attr.a;
					return _List_fromArray(
						[
							$mdgriffith$elm_ui$Element$paddingEach(pad)
						]);
				case 1:
					var spcX = attr.a;
					var spcY = attr.b;
					return _List_fromArray(
						[
							A2($mdgriffith$elm_ui$Element$spacingXY, spcX, spcY)
						]);
				case 2:
					return ((!device.b6) || (device.b6 === 1)) ? _List_fromArray(
						[$mdgriffith$elm_ui$Element$centerX]) : _Utils_ap(
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$alignRight,
								$mdgriffith$elm_ui$Element$paddingEach(
								{aR: 0, aU: 15, a0: 0, a1: 0})
							]),
						config.an ? _List_fromArray(
							[
								$mdgriffith$elm_ui$Element$htmlAttribute(
								A2($elm$html$Html$Attributes$style, 'z-index', '1'))
							]) : _List_Nil);
				case 3:
					return ((!device.b6) || (device.b6 === 1)) ? _List_fromArray(
						[$mdgriffith$elm_ui$Element$centerX]) : _Utils_ap(
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$alignLeft,
								$mdgriffith$elm_ui$Element$paddingEach(
								{aR: 0, aU: 0, a0: 15, a1: 0})
							]),
						config.an ? _List_fromArray(
							[
								$mdgriffith$elm_ui$Element$htmlAttribute(
								A2($elm$html$Html$Attributes$style, 'z-index', '1'))
							]) : _List_Nil);
				case 4:
					return _List_fromArray(
						[$mdgriffith$elm_ui$Element$pointer]);
				case 5:
					var color = attr.a;
					return _List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							$author$project$Document$Document$toSeColor(color))
						]);
				case 8:
					var n = attr.a;
					return _List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width(
							$mdgriffith$elm_ui$Element$px(n))
						]);
				case 9:
					var n = attr.a;
					return _List_fromArray(
						[
							$mdgriffith$elm_ui$Element$height(
							$mdgriffith$elm_ui$Element$px(n))
						]);
				case 7:
					var _v1 = device.b6;
					switch (_v1) {
						case 0:
							return _List_Nil;
						case 1:
							return _List_Nil;
						default:
							return _List_fromArray(
								[
									$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink)
								]);
					}
				case 6:
					return _List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
						]);
				case 10:
					var n = attr.a;
					return _List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width(
							$mdgriffith$elm_ui$Element$fillPortion(n))
						]);
				case 11:
					return _List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Border$color(
							A3($mdgriffith$elm_ui$Element$rgb, 127, 127, 127)),
							$mdgriffith$elm_ui$Element$Border$width(1),
							$mdgriffith$elm_ui$Element$Border$solid
						]);
				case 13:
					var color = attr.a;
					return _List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Font$color(
							$author$project$Document$Document$toSeColor(color))
						]);
				case 12:
					var s = attr.a;
					return _List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Font$family(
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$Font$typeface(s)
								]))
						]);
				case 16:
					return _List_fromArray(
						[$mdgriffith$elm_ui$Element$Font$alignRight]);
				case 15:
					return _List_fromArray(
						[$mdgriffith$elm_ui$Element$Font$alignLeft]);
				case 14:
					var n = attr.a;
					return _List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Font$size(n)
						]);
				case 17:
					return _List_fromArray(
						[$mdgriffith$elm_ui$Element$Font$center]);
				case 18:
					return _List_fromArray(
						[$mdgriffith$elm_ui$Element$Font$justify]);
				case 19:
					return _List_fromArray(
						[$mdgriffith$elm_ui$Element$Font$bold]);
				case 20:
					return _List_fromArray(
						[$mdgriffith$elm_ui$Element$Font$italic]);
				default:
					var uid = attr.a;
					var zipperEventHandler = attr.b;
					var _v2 = config.le;
					if (_v2.$ === 1) {
						return _List_Nil;
					} else {
						var handlers = _v2.a;
						switch (zipperEventHandler) {
							case 0:
								return _List_fromArray(
									[
										$mdgriffith$elm_ui$Element$Events$onClick(
										handlers.hF(uid))
									]);
							case 1:
								return _List_fromArray(
									[
										$mdgriffith$elm_ui$Element$Events$onDoubleClick(
										handlers.hG(uid))
									]);
							case 2:
								return _List_fromArray(
									[
										$mdgriffith$elm_ui$Element$mouseOver(
										_List_fromArray(
											[
												$mdgriffith$elm_ui$Element$Background$color(
												A4($mdgriffith$elm_ui$Element$rgba, 0.8, 0.8, 0.8, 0.5))
											])),
										$mdgriffith$elm_ui$Element$pointer,
										$mdgriffith$elm_ui$Element$htmlAttribute(
										A2($elm$html$Html$Attributes$style, 'transition', '0.3s'))
									]);
							case 4:
								return _List_fromArray(
									[
										$mdgriffith$elm_ui$Element$pointer,
										$mdgriffith$elm_ui$Element$mouseOver(
										_List_fromArray(
											[
												$mdgriffith$elm_ui$Element$Background$color(
												A4($mdgriffith$elm_ui$Element$rgba, 0.8, 0.8, 0.8, 0.5))
											])),
										$mdgriffith$elm_ui$Element$htmlAttribute(
										A2($elm$html$Html$Attributes$style, 'transition', '0.3s')),
										$mdgriffith$elm_ui$Element$Events$onDoubleClick(handlers.hs)
									]);
							default:
								return _List_fromArray(
									[
										$mdgriffith$elm_ui$Element$Events$onClick(
										handlers.jh(uid)),
										$mdgriffith$elm_ui$Element$pointer
									]);
						}
					}
			}
		};
		return A2($elm$core$List$concatMap, renderAttr, attrs);
	});
var $elm$html$Html$Attributes$target = $elm$html$Html$Attributes$stringProperty('target');
var $mdgriffith$elm_ui$Element$newTabLink = F2(
	function (attrs, _v0) {
		var url = _v0.da;
		var label = _v0.F;
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asEl,
			$mdgriffith$elm_ui$Internal$Model$NodeName('a'),
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Internal$Model$Attr(
					$elm$html$Html$Attributes$href(url)),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Internal$Model$Attr(
						$elm$html$Html$Attributes$rel('noopener noreferrer')),
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Internal$Model$Attr(
							$elm$html$Html$Attributes$target('_blank')),
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
							A2(
								$elm$core$List$cons,
								$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
								A2(
									$elm$core$List$cons,
									$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.dk + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.bl)),
									attrs)))))),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(
				_List_fromArray(
					[label])));
	});
var $author$project$Document$DocumentViews$DocumentView$renderTextBlockPrimitive = F3(
	function (config, tbAttrs, p) {
		var styleSheet = $author$project$Document$DocumentViews$StyleSheets$defaultStyleSheet(config);
		if (!p.$) {
			var attrs = p.a;
			var s = p.b;
			return A2(
				$mdgriffith$elm_ui$Element$el,
				_Utils_ap(
					styleSheet.kX,
					_Utils_ap(
						A2($author$project$Document$DocumentViews$DocumentView$renderAttrs, config, tbAttrs),
						A2($author$project$Document$DocumentViews$DocumentView$renderAttrs, config, attrs))),
				$mdgriffith$elm_ui$Element$text(s));
		} else {
			var attrs = p.a;
			var targetBlank = p.b.gA;
			var url = p.b.da;
			var label = p.b.F;
			var url_ = targetBlank ? url : A2(
				$elm$core$Maybe$withDefault,
				'',
				A2($elm$core$Dict$get, url, config.f3));
			var linkFun = targetBlank ? $mdgriffith$elm_ui$Element$newTabLink : $mdgriffith$elm_ui$Element$link;
			return config.an ? A2(
				$mdgriffith$elm_ui$Element$el,
				_Utils_ap(
					styleSheet.fN,
					_Utils_ap(
						A2($author$project$Document$DocumentViews$DocumentView$renderAttrs, config, tbAttrs),
						A2($author$project$Document$DocumentViews$DocumentView$renderAttrs, config, attrs))),
				$mdgriffith$elm_ui$Element$text(label)) : A2(
				linkFun,
				_Utils_ap(
					styleSheet.fN,
					_Utils_ap(
						A2($author$project$Document$DocumentViews$DocumentView$renderAttrs, config, tbAttrs),
						A2($author$project$Document$DocumentViews$DocumentView$renderAttrs, config, attrs))),
				{
					F: $mdgriffith$elm_ui$Element$text(label),
					da: url_
				});
		}
	});
var $author$project$Document$DocumentViews$DocumentView$renderLi = F3(
	function (config, tbAttrs, li) {
		return A2(
			$mdgriffith$elm_ui$Element$paragraph,
			_Utils_ap(
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$paddingEach(
						{aR: 0, aU: 20, a0: 0, a1: 0})
					]),
				A2($author$project$Document$DocumentViews$DocumentView$renderAttrs, config, tbAttrs)),
			_Utils_ap(
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$el,
						_List_Nil,
						$mdgriffith$elm_ui$Element$text('•  '))
					]),
				A2(
					$elm$core$List$map,
					A2($author$project$Document$DocumentViews$DocumentView$renderTextBlockPrimitive, config, tbAttrs),
					li)));
	});
var $author$project$Document$DocumentViews$DocumentView$renderTextBlockElement = F4(
	function (config, id, tbAttrs, tbe) {
		var styleSheet = $author$project$Document$DocumentViews$StyleSheets$defaultStyleSheet(config);
		switch (tbe.$) {
			case 0:
				var attrs = tbe.a;
				var xs = tbe.b;
				return A2(
					$mdgriffith$elm_ui$Element$paragraph,
					_Utils_ap(
						styleSheet.jG,
						_Utils_ap(
							A2($author$project$Document$DocumentViews$DocumentView$idStyle, styleSheet, id),
							_Utils_ap(
								A2($author$project$Document$DocumentViews$DocumentView$renderAttrs, config, tbAttrs),
								A2($author$project$Document$DocumentViews$DocumentView$renderAttrs, config, attrs)))),
					A2(
						$elm$core$List$map,
						A2($author$project$Document$DocumentViews$DocumentView$renderTextBlockPrimitive, config, tbAttrs),
						xs));
			case 1:
				var attrs = tbe.a;
				var xs = tbe.b;
				return A2(
					$mdgriffith$elm_ui$Element$paragraph,
					_Utils_ap(
						A2($author$project$Document$DocumentViews$DocumentView$renderAttrs, config, tbAttrs),
						_Utils_ap(
							A2($author$project$Document$DocumentViews$DocumentView$idStyle, styleSheet, id),
							_Utils_ap(
								A2($author$project$Document$DocumentViews$DocumentView$renderAttrs, config, attrs),
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$spacing(10)
									])))),
					A2(
						$elm$core$List$map,
						A2($author$project$Document$DocumentViews$DocumentView$renderLi, config, tbAttrs),
						xs));
			case 2:
				var attrs = tbe.a;
				var _v1 = tbe.b;
				var level = _v1.a;
				var s = _v1.b;
				var headingStyle = A2(
					$elm$core$Maybe$withDefault,
					_List_Nil,
					A2($elm$core$Dict$get, level, styleSheet.is));
				return A2(
					$mdgriffith$elm_ui$Element$paragraph,
					_Utils_ap(
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$Region$heading(level)
							]),
						_Utils_ap(
							headingStyle,
							_Utils_ap(
								A2($author$project$Document$DocumentViews$DocumentView$idStyle, styleSheet, id),
								_Utils_ap(
									A2($author$project$Document$DocumentViews$DocumentView$renderAttrs, config, tbAttrs),
									A2($author$project$Document$DocumentViews$DocumentView$renderAttrs, config, attrs))))),
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$text(s)
						]));
			default:
				var p = tbe.a;
				return A2(
					$mdgriffith$elm_ui$Element$el,
					A2($author$project$Document$DocumentViews$DocumentView$idStyle, styleSheet, id),
					A3($author$project$Document$DocumentViews$DocumentView$renderTextBlockPrimitive, config, tbAttrs, p));
		}
	});
var $author$project$Document$DocumentViews$DocumentView$customHeading = F4(
	function (config, level, attrs, title) {
		return A4(
			$author$project$Document$DocumentViews$DocumentView$renderTextBlockElement,
			config,
			{
				a3: $elm$core$Set$empty,
				a8: $elm$core$Maybe$Nothing,
				bc: $elm$core$Maybe$Just(
					'defaultHtmlId' + $elm$core$String$fromInt(0)),
				b0: 0
			},
			_List_Nil,
			A2(
				$author$project$Document$Document$Heading,
				attrs,
				_Utils_Tuple2(level, title)));
	});
var $mdgriffith$elm_ui$Internal$Model$Min = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $mdgriffith$elm_ui$Element$minimum = F2(
	function (i, l) {
		return A2($mdgriffith$elm_ui$Internal$Model$Min, i, l);
	});
var $author$project$Internals$Contact$Reset = {$: 10};
var $author$project$Internals$Contact$Send = {$: 8};
var $author$project$Internals$Contact$SetCompany = function (a) {
	return {$: 1, a: a};
};
var $author$project$Internals$Contact$SetEmail = function (a) {
	return {$: 2, a: a};
};
var $author$project$Internals$Contact$SetMessage = function (a) {
	return {$: 5, a: a};
};
var $author$project$Internals$Contact$SetName = function (a) {
	return {$: 0, a: a};
};
var $author$project$Internals$Contact$SetPhone = function (a) {
	return {$: 3, a: a};
};
var $author$project$Internals$Contact$SetTopic = function (a) {
	return {$: 4, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$Button = {$: 8};
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $mdgriffith$elm_ui$Element$Input$hasFocusStyle = function (attr) {
	if (((attr.$ === 4) && (attr.b.$ === 11)) && (!attr.b.a)) {
		var _v1 = attr.b;
		var _v2 = _v1.a;
		return true;
	} else {
		return false;
	}
};
var $mdgriffith$elm_ui$Element$Input$focusDefault = function (attrs) {
	return A2($elm$core$List$any, $mdgriffith$elm_ui$Element$Input$hasFocusStyle, attrs) ? $mdgriffith$elm_ui$Internal$Model$NoAttribute : $mdgriffith$elm_ui$Internal$Model$htmlClass('focusable');
};
var $mdgriffith$elm_ui$Element$Input$enter = 'Enter';
var $elm$virtual_dom$VirtualDom$MayPreventDefault = function (a) {
	return {$: 2, a: a};
};
var $elm$html$Html$Events$preventDefaultOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayPreventDefault(decoder));
	});
var $mdgriffith$elm_ui$Element$Input$onKey = F2(
	function (desiredCode, msg) {
		var decode = function (code) {
			return _Utils_eq(code, desiredCode) ? $elm$json$Json$Decode$succeed(msg) : $elm$json$Json$Decode$fail('Not the enter key');
		};
		var isKey = A2(
			$elm$json$Json$Decode$andThen,
			decode,
			A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string));
		return $mdgriffith$elm_ui$Internal$Model$Attr(
			A2(
				$elm$html$Html$Events$preventDefaultOn,
				'keyup',
				A2(
					$elm$json$Json$Decode$map,
					function (fired) {
						return _Utils_Tuple2(fired, true);
					},
					isKey)));
	});
var $mdgriffith$elm_ui$Element$Input$onEnter = function (msg) {
	return A2($mdgriffith$elm_ui$Element$Input$onKey, $mdgriffith$elm_ui$Element$Input$enter, msg);
};
var $elm$html$Html$Attributes$tabindex = function (n) {
	return A2(
		_VirtualDom_attribute,
		'tabIndex',
		$elm$core$String$fromInt(n));
};
var $mdgriffith$elm_ui$Element$Input$button = F2(
	function (attrs, _v0) {
		var onPress = _v0.ax;
		var label = _v0.F;
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asEl,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.dk + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.bl + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.j4 + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.fV)))))),
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Element$pointer,
							A2(
								$elm$core$List$cons,
								$mdgriffith$elm_ui$Element$Input$focusDefault(attrs),
								A2(
									$elm$core$List$cons,
									$mdgriffith$elm_ui$Internal$Model$Describe($mdgriffith$elm_ui$Internal$Model$Button),
									A2(
										$elm$core$List$cons,
										$mdgriffith$elm_ui$Internal$Model$Attr(
											$elm$html$Html$Attributes$tabindex(0)),
										function () {
											if (onPress.$ === 1) {
												return A2(
													$elm$core$List$cons,
													$mdgriffith$elm_ui$Internal$Model$Attr(
														$elm$html$Html$Attributes$disabled(true)),
													attrs);
											} else {
												var msg = onPress.a;
												return A2(
													$elm$core$List$cons,
													$mdgriffith$elm_ui$Element$Events$onClick(msg),
													A2(
														$elm$core$List$cons,
														$mdgriffith$elm_ui$Element$Input$onEnter(msg),
														attrs));
											}
										}()))))))),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(
				_List_fromArray(
					[label])));
	});
var $mdgriffith$elm_ui$Internal$Model$Focus = 0;
var $mdgriffith$elm_ui$Internal$Flag$focus = $mdgriffith$elm_ui$Internal$Flag$flag(31);
var $mdgriffith$elm_ui$Element$focused = function (decs) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$focus,
		A2(
			$mdgriffith$elm_ui$Internal$Model$PseudoSelector,
			0,
			$mdgriffith$elm_ui$Internal$Model$unwrapDecorations(decs)));
};
var $mdgriffith$elm_ui$Element$Border$glow = F2(
	function (clr, size) {
		return $mdgriffith$elm_ui$Element$Border$shadow(
			{
				hf: size * 2,
				hB: clr,
				js: _Utils_Tuple2(0, 0),
				eS: size
			});
	});
var $author$project$Internals$CommonStyleHelpers$buttonStyle = function (isActive) {
	return _Utils_ap(
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$Border$rounded(5),
				$mdgriffith$elm_ui$Element$Font$center,
				$mdgriffith$elm_ui$Element$centerY,
				$mdgriffith$elm_ui$Element$padding(5),
				$mdgriffith$elm_ui$Element$focused(
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$Border$glow,
						A3($mdgriffith$elm_ui$Element$rgb, 1, 1, 1),
						0)
					]))
			]),
		isActive ? _List_fromArray(
			[
				$mdgriffith$elm_ui$Element$Background$color(
				A3($mdgriffith$elm_ui$Element$rgb, 0.9, 0.9, 0.9)),
				$mdgriffith$elm_ui$Element$mouseOver(
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$Font$color(
						A3($mdgriffith$elm_ui$Element$rgb, 255, 255, 255))
					])),
				$mdgriffith$elm_ui$Element$Border$width(1),
				$mdgriffith$elm_ui$Element$Border$color(
				A3($mdgriffith$elm_ui$Element$rgb, 0.9, 0.9, 0.9))
			]) : _List_fromArray(
			[
				$mdgriffith$elm_ui$Element$Background$color(
				A3($mdgriffith$elm_ui$Element$rgb, 0.95, 0.95, 0.95)),
				$mdgriffith$elm_ui$Element$Font$color(
				A3($mdgriffith$elm_ui$Element$rgb, 0.7, 0.7, 0.7)),
				$mdgriffith$elm_ui$Element$htmlAttribute(
				A2($elm$html$Html$Attributes$style, 'cursor', 'default')),
				$mdgriffith$elm_ui$Element$Border$width(1),
				$mdgriffith$elm_ui$Element$Border$color(
				A3($mdgriffith$elm_ui$Element$rgb, 0.95, 0.95, 0.95))
			]));
};
var $author$project$Internals$CommonStyleHelpers$grey7 = A3($mdgriffith$elm_ui$Element$rgb255, 248, 249, 250);
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $mdgriffith$elm_ui$Internal$Model$unstyled = A2($elm$core$Basics$composeL, $mdgriffith$elm_ui$Internal$Model$Unstyled, $elm$core$Basics$always);
var $mdgriffith$elm_ui$Element$html = $mdgriffith$elm_ui$Internal$Model$unstyled;
var $elm$html$Html$i = _VirtualDom_node('i');
var $mdgriffith$elm_ui$Element$Input$Above = 2;
var $mdgriffith$elm_ui$Element$Input$Label = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $mdgriffith$elm_ui$Element$Input$labelAbove = $mdgriffith$elm_ui$Element$Input$Label(2);
var $author$project$Internals$CommonStyleHelpers$red4 = A3($mdgriffith$elm_ui$Element$rgb255, 220, 48, 48);
var $author$project$Internals$Contact$mandatoryLabel = function (s) {
	return A2(
		$mdgriffith$elm_ui$Element$Input$labelAbove,
		_List_Nil,
		A2(
			$mdgriffith$elm_ui$Element$row,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width(
					$mdgriffith$elm_ui$Element$px(270))
				]),
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$text(s),
					A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Font$color($author$project$Internals$CommonStyleHelpers$red4)
						]),
					$mdgriffith$elm_ui$Element$text('*'))
				])));
};
var $mdgriffith$elm_ui$Element$map = $mdgriffith$elm_ui$Internal$Model$map;
var $mdgriffith$elm_ui$Element$Input$TextArea = {$: 1};
var $mdgriffith$elm_ui$Element$Input$Padding = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $mdgriffith$elm_ui$Internal$Model$Transparency = F2(
	function (a, b) {
		return {$: 12, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Flag$transparency = $mdgriffith$elm_ui$Internal$Flag$flag(0);
var $mdgriffith$elm_ui$Element$alpha = function (o) {
	var transparency = function (x) {
		return 1 - x;
	}(
		A2(
			$elm$core$Basics$min,
			1.0,
			A2($elm$core$Basics$max, 0.0, o)));
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$transparency,
		A2(
			$mdgriffith$elm_ui$Internal$Model$Transparency,
			'transparency-' + $mdgriffith$elm_ui$Internal$Model$floatClass(transparency),
			transparency));
};
var $mdgriffith$elm_ui$Internal$Model$LivePolite = {$: 6};
var $mdgriffith$elm_ui$Element$Region$announce = $mdgriffith$elm_ui$Internal$Model$Describe($mdgriffith$elm_ui$Internal$Model$LivePolite);
var $mdgriffith$elm_ui$Element$Input$applyLabel = F3(
	function (attrs, label, input) {
		if (label.$ === 1) {
			var labelText = label.a;
			return A4(
				$mdgriffith$elm_ui$Internal$Model$element,
				$mdgriffith$elm_ui$Internal$Model$asColumn,
				$mdgriffith$elm_ui$Internal$Model$NodeName('label'),
				attrs,
				$mdgriffith$elm_ui$Internal$Model$Unkeyed(
					_List_fromArray(
						[input])));
		} else {
			var position = label.a;
			var labelAttrs = label.b;
			var labelChild = label.c;
			var labelElement = A4(
				$mdgriffith$elm_ui$Internal$Model$element,
				$mdgriffith$elm_ui$Internal$Model$asEl,
				$mdgriffith$elm_ui$Internal$Model$div,
				labelAttrs,
				$mdgriffith$elm_ui$Internal$Model$Unkeyed(
					_List_fromArray(
						[labelChild])));
			switch (position) {
				case 2:
					return A4(
						$mdgriffith$elm_ui$Internal$Model$element,
						$mdgriffith$elm_ui$Internal$Model$asColumn,
						$mdgriffith$elm_ui$Internal$Model$NodeName('label'),
						attrs,
						$mdgriffith$elm_ui$Internal$Model$Unkeyed(
							_List_fromArray(
								[labelElement, input])));
				case 3:
					return A4(
						$mdgriffith$elm_ui$Internal$Model$element,
						$mdgriffith$elm_ui$Internal$Model$asColumn,
						$mdgriffith$elm_ui$Internal$Model$NodeName('label'),
						attrs,
						$mdgriffith$elm_ui$Internal$Model$Unkeyed(
							_List_fromArray(
								[input, labelElement])));
				case 0:
					return A4(
						$mdgriffith$elm_ui$Internal$Model$element,
						$mdgriffith$elm_ui$Internal$Model$asRow,
						$mdgriffith$elm_ui$Internal$Model$NodeName('label'),
						attrs,
						$mdgriffith$elm_ui$Internal$Model$Unkeyed(
							_List_fromArray(
								[input, labelElement])));
				default:
					return A4(
						$mdgriffith$elm_ui$Internal$Model$element,
						$mdgriffith$elm_ui$Internal$Model$asRow,
						$mdgriffith$elm_ui$Internal$Model$NodeName('label'),
						attrs,
						$mdgriffith$elm_ui$Internal$Model$Unkeyed(
							_List_fromArray(
								[labelElement, input])));
			}
		}
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $mdgriffith$elm_ui$Element$Input$autofill = A2(
	$elm$core$Basics$composeL,
	$mdgriffith$elm_ui$Internal$Model$Attr,
	$elm$html$Html$Attributes$attribute('autocomplete'));
var $mdgriffith$elm_ui$Element$Input$charcoal = A3($mdgriffith$elm_ui$Element$rgb, 136 / 255, 138 / 255, 133 / 255);
var $mdgriffith$elm_ui$Element$Input$darkGrey = A3($mdgriffith$elm_ui$Element$rgb, 186 / 255, 189 / 255, 182 / 255);
var $mdgriffith$elm_ui$Element$Input$defaultTextPadding = A2($mdgriffith$elm_ui$Element$paddingXY, 12, 12);
var $mdgriffith$elm_ui$Element$Input$white = A3($mdgriffith$elm_ui$Element$rgb, 1, 1, 1);
var $mdgriffith$elm_ui$Element$Input$defaultTextBoxStyle = _List_fromArray(
	[
		$mdgriffith$elm_ui$Element$Input$defaultTextPadding,
		$mdgriffith$elm_ui$Element$Border$rounded(3),
		$mdgriffith$elm_ui$Element$Border$color($mdgriffith$elm_ui$Element$Input$darkGrey),
		$mdgriffith$elm_ui$Element$Background$color($mdgriffith$elm_ui$Element$Input$white),
		$mdgriffith$elm_ui$Element$Border$width(1),
		$mdgriffith$elm_ui$Element$spacing(3),
		$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
	]);
var $mdgriffith$elm_ui$Internal$Model$filter = function (attrs) {
	return A3(
		$elm$core$List$foldr,
		F2(
			function (x, _v0) {
				var found = _v0.a;
				var has = _v0.b;
				switch (x.$) {
					case 0:
						return _Utils_Tuple2(found, has);
					case 3:
						var key = x.a;
						return _Utils_Tuple2(
							A2($elm$core$List$cons, x, found),
							has);
					case 1:
						var attr = x.a;
						return _Utils_Tuple2(
							A2($elm$core$List$cons, x, found),
							has);
					case 4:
						var style = x.b;
						return _Utils_Tuple2(
							A2($elm$core$List$cons, x, found),
							has);
					case 7:
						var width = x.a;
						return A2($elm$core$Set$member, 'width', has) ? _Utils_Tuple2(found, has) : _Utils_Tuple2(
							A2($elm$core$List$cons, x, found),
							A2($elm$core$Set$insert, 'width', has));
					case 8:
						var height = x.a;
						return A2($elm$core$Set$member, 'height', has) ? _Utils_Tuple2(found, has) : _Utils_Tuple2(
							A2($elm$core$List$cons, x, found),
							A2($elm$core$Set$insert, 'height', has));
					case 2:
						var description = x.a;
						return A2($elm$core$Set$member, 'described', has) ? _Utils_Tuple2(found, has) : _Utils_Tuple2(
							A2($elm$core$List$cons, x, found),
							A2($elm$core$Set$insert, 'described', has));
					case 9:
						var location = x.a;
						var elem = x.b;
						return _Utils_Tuple2(
							A2($elm$core$List$cons, x, found),
							has);
					case 6:
						return A2($elm$core$Set$member, 'align-x', has) ? _Utils_Tuple2(found, has) : _Utils_Tuple2(
							A2($elm$core$List$cons, x, found),
							A2($elm$core$Set$insert, 'align-x', has));
					case 5:
						return A2($elm$core$Set$member, 'align-y', has) ? _Utils_Tuple2(found, has) : _Utils_Tuple2(
							A2($elm$core$List$cons, x, found),
							A2($elm$core$Set$insert, 'align-y', has));
					default:
						return A2($elm$core$Set$member, 'transform', has) ? _Utils_Tuple2(found, has) : _Utils_Tuple2(
							A2($elm$core$List$cons, x, found),
							A2($elm$core$Set$insert, 'transform', has));
				}
			}),
		_Utils_Tuple2(_List_Nil, $elm$core$Set$empty),
		attrs).a;
};
var $mdgriffith$elm_ui$Internal$Model$get = F2(
	function (attrs, isAttr) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, found) {
					return isAttr(x) ? A2($elm$core$List$cons, x, found) : found;
				}),
			_List_Nil,
			$mdgriffith$elm_ui$Internal$Model$filter(attrs));
	});
var $mdgriffith$elm_ui$Internal$Model$Label = function (a) {
	return {$: 5, a: a};
};
var $mdgriffith$elm_ui$Element$Input$hiddenLabelAttribute = function (label) {
	if (label.$ === 1) {
		var textLabel = label.a;
		return $mdgriffith$elm_ui$Internal$Model$Describe(
			$mdgriffith$elm_ui$Internal$Model$Label(textLabel));
	} else {
		return $mdgriffith$elm_ui$Internal$Model$NoAttribute;
	}
};
var $mdgriffith$elm_ui$Internal$Model$InFront = 4;
var $mdgriffith$elm_ui$Element$inFront = function (element) {
	return A2($mdgriffith$elm_ui$Internal$Model$Nearby, 4, element);
};
var $mdgriffith$elm_ui$Element$Input$inheritablePlaceholderAttributes = function (attr) {
	_v0$3:
	while (true) {
		if (attr.$ === 4) {
			switch (attr.b.$) {
				case 7:
					var _v1 = attr.b;
					return true;
				case 6:
					var _v2 = attr.b;
					return true;
				case 10:
					return true;
				default:
					break _v0$3;
			}
		} else {
			break _v0$3;
		}
	}
	return false;
};
var $mdgriffith$elm_ui$Internal$Model$isContent = function (len) {
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
var $mdgriffith$elm_ui$Element$Input$isHiddenLabel = function (label) {
	if (label.$ === 1) {
		return true;
	} else {
		return false;
	}
};
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$Attributes$spellcheck = $elm$html$Html$Attributes$boolProperty('spellcheck');
var $mdgriffith$elm_ui$Element$Input$spellcheck = A2($elm$core$Basics$composeL, $mdgriffith$elm_ui$Internal$Model$Attr, $elm$html$Html$Attributes$spellcheck);
var $mdgriffith$elm_ui$Internal$Flag$heightTextAreaContent = $mdgriffith$elm_ui$Internal$Flag$flag(47);
var $elm$core$String$lines = _String_lines;
var $mdgriffith$elm_ui$Element$Input$textHeightContent = F4(
	function (textValue, spacing, maybePadding, maybeBorder) {
		var topBottom = function (_v0) {
			var t = _v0.a;
			var b = _v0.c;
			return t + b;
		};
		var newlineCount = function (x) {
			return (x < 1) ? 1 : x;
		}(
			$elm$core$List$length(
				$elm$core$String$lines(textValue)));
		var additionalSpacing = (((newlineCount - 1) * spacing) + A2(
			$elm$core$Maybe$withDefault,
			0,
			A2($elm$core$Maybe$map, topBottom, maybePadding))) + A2(
			$elm$core$Maybe$withDefault,
			0,
			A2($elm$core$Maybe$map, topBottom, maybeBorder));
		var heightValue = function (count) {
			return 'calc(' + ($elm$core$String$fromInt(count) + ('em + ' + ($elm$core$String$fromInt(additionalSpacing) + 'px) !important')));
		};
		return A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$heightTextAreaContent,
			A3(
				$mdgriffith$elm_ui$Internal$Model$Single,
				'textarea-height-' + $elm$core$String$fromInt(newlineCount),
				'height',
				heightValue(newlineCount)));
	});
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $mdgriffith$elm_ui$Element$Input$value = A2($elm$core$Basics$composeL, $mdgriffith$elm_ui$Internal$Model$Attr, $elm$html$Html$Attributes$value);
var $mdgriffith$elm_ui$Element$Input$textHelper = F3(
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
				$mdgriffith$elm_ui$Internal$Model$Attr(
				$elm$html$Html$Events$onInput(textOptions.cW))
			]);
		var attributes = _Utils_ap($mdgriffith$elm_ui$Element$Input$defaultTextBoxStyle, attrs);
		var attributesFromChild = A2(
			$mdgriffith$elm_ui$Internal$Model$get,
			attributes,
			function (attr) {
				_v21$7:
				while (true) {
					switch (attr.$) {
						case 7:
							if (attr.a.$ === 2) {
								return true;
							} else {
								break _v21$7;
							}
						case 8:
							if (attr.a.$ === 2) {
								return true;
							} else {
								break _v21$7;
							}
						case 6:
							return true;
						case 5:
							return true;
						case 4:
							switch (attr.b.$) {
								case 5:
									var _v22 = attr.b;
									return true;
								case 2:
									return true;
								case 1:
									var _v23 = attr.b;
									return true;
								default:
									break _v21$7;
							}
						default:
							break _v21$7;
					}
				}
				return false;
			});
		var forPlaceholder = A2($elm$core$List$filter, $mdgriffith$elm_ui$Element$Input$inheritablePlaceholderAttributes, attributes);
		var heightFillFromChild = A2(
			$mdgriffith$elm_ui$Internal$Model$get,
			attributes,
			function (attr) {
				if ((attr.$ === 8) && (attr.a.$ === 2)) {
					return true;
				} else {
					return false;
				}
			});
		var inputPadding = A2(
			$mdgriffith$elm_ui$Internal$Model$get,
			attributes,
			function (attr) {
				if ((attr.$ === 4) && (attr.b.$ === 7)) {
					var _v19 = attr.b;
					return true;
				} else {
					return false;
				}
			});
		var nearbys = A2(
			$mdgriffith$elm_ui$Internal$Model$get,
			attributes,
			function (attr) {
				if (attr.$ === 9) {
					return true;
				} else {
					return false;
				}
			});
		var noNearbys = A2(
			$elm$core$List$filter,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, forNearby),
			attributes);
		var _v0 = function () {
			var _v1 = textInput.a2;
			if (!_v1.$) {
				var inputType = _v1.a;
				return _Utils_Tuple3(
					'input',
					_Utils_ap(
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$Input$value(textOptions.c3),
								$mdgriffith$elm_ui$Internal$Model$Attr(
								$elm$html$Html$Attributes$type_(inputType)),
								$mdgriffith$elm_ui$Element$Input$spellcheck(textInput.aQ),
								$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.iO),
								function () {
								var _v2 = textInput.aA;
								if (_v2.$ === 1) {
									return $mdgriffith$elm_ui$Internal$Model$NoAttribute;
								} else {
									var fill = _v2.a;
									return $mdgriffith$elm_ui$Element$Input$autofill(fill);
								}
							}()
							]),
						noNearbys),
					_List_Nil);
			} else {
				var _v3 = A3(
					$elm$core$List$foldr,
					F2(
						function (attr, found) {
							_v4$5:
							while (true) {
								switch (attr.$) {
									case 2:
										return found;
									case 8:
										var len = attr.a;
										var _v5 = found.dv;
										if (_v5.$ === 1) {
											return _Utils_update(
												found,
												{
													ag: A2($elm$core$List$cons, attr, found.ag),
													dv: $elm$core$Maybe$Just(
														$mdgriffith$elm_ui$Internal$Model$isContent(len))
												});
										} else {
											return found;
										}
									case 4:
										switch (attr.b.$) {
											case 6:
												var _v6 = attr.b;
												var t = _v6.b;
												var r = _v6.c;
												var b = _v6.d;
												var l = _v6.e;
												var _v7 = found.dD;
												if (_v7.$ === 1) {
													return _Utils_update(
														found,
														{
															ag: A2($elm$core$List$cons, attr, found.ag),
															dD: $elm$core$Maybe$Just(
																A4($mdgriffith$elm_ui$Element$Input$Padding, t, r, b, l))
														});
												} else {
													return found;
												}
											case 7:
												var _v8 = attr.b;
												var t = _v8.b;
												var r = _v8.c;
												var b = _v8.d;
												var l = _v8.e;
												var _v9 = found.dE;
												if (_v9.$ === 1) {
													return _Utils_update(
														found,
														{
															ag: found.ag,
															dE: $elm$core$Maybe$Just(
																A4($mdgriffith$elm_ui$Element$Input$Padding, t, r, b, l))
														});
												} else {
													return found;
												}
											case 5:
												var _v10 = attr.b;
												var x = _v10.b;
												var y = _v10.c;
												var _v11 = found.dF;
												if (_v11.$ === 1) {
													return _Utils_update(
														found,
														{
															ag: A2($elm$core$List$cons, attr, found.ag),
															dF: $elm$core$Maybe$Just(y)
														});
												} else {
													return found;
												}
											default:
												break _v4$5;
										}
									default:
										break _v4$5;
								}
							}
							return _Utils_update(
								found,
								{
									ag: A2($elm$core$List$cons, attr, found.ag)
								});
						}),
					{ag: _List_Nil, dv: $elm$core$Maybe$Nothing, dD: $elm$core$Maybe$Nothing, dE: $elm$core$Maybe$Nothing, dF: $elm$core$Maybe$Nothing},
					attributes);
				var maybePadding = _v3.dE;
				var heightContent = _v3.dv;
				var maybeSpacing = _v3.dF;
				var adjustedAttributes = _v3.ag;
				var maybeBorder = _v3.dD;
				var spacing = A2($elm$core$Maybe$withDefault, 5, maybeSpacing);
				return _Utils_Tuple3(
					'textarea',
					_Utils_ap(
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$Input$spellcheck(textInput.aQ),
								$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.iN),
								A2(
								$elm$core$Maybe$withDefault,
								$mdgriffith$elm_ui$Internal$Model$NoAttribute,
								A2($elm$core$Maybe$map, $mdgriffith$elm_ui$Element$Input$autofill, textInput.aA)),
								function () {
								if (maybePadding.$ === 1) {
									return $mdgriffith$elm_ui$Internal$Model$NoAttribute;
								} else {
									var _v13 = maybePadding.a;
									var t = _v13.a;
									var r = _v13.b;
									var b = _v13.c;
									var l = _v13.d;
									return $mdgriffith$elm_ui$Element$paddingEach(
										{
											aR: A2($elm$core$Basics$max, 0, b - ((spacing / 2) | 0)),
											aU: l,
											a0: r,
											a1: A2($elm$core$Basics$max, 0, t - ((spacing / 2) | 0))
										});
								}
							}(),
								function () {
								if (heightContent.$ === 1) {
									return $mdgriffith$elm_ui$Internal$Model$NoAttribute;
								} else {
									if (heightContent.a) {
										return A4($mdgriffith$elm_ui$Element$Input$textHeightContent, textOptions.c3, spacing, maybePadding, maybeBorder);
									} else {
										return $mdgriffith$elm_ui$Internal$Model$NoAttribute;
									}
								}
							}()
							]),
						adjustedAttributes),
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Internal$Model$unstyled(
							$elm$html$Html$text(textOptions.c3))
						]));
			}
		}();
		var inputNode = _v0.a;
		var inputAttrs = _v0.b;
		var inputChildren = _v0.c;
		var inputElement = A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asEl,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
				$elm$core$List$concat(
					_List_fromArray(
						[
							nearbys,
							heightFillFromChild,
							function () {
							var _v15 = textOptions.c0;
							if (_v15.$ === 1) {
								return _List_Nil;
							} else {
								var _v16 = _v15.a;
								var placeholderAttrs = _v16.a;
								var placeholderEl = _v16.b;
								return _List_fromArray(
									[
										$mdgriffith$elm_ui$Element$inFront(
										A2(
											$mdgriffith$elm_ui$Element$el,
											A2(
												$elm$core$List$cons,
												$mdgriffith$elm_ui$Element$Input$defaultTextPadding,
												_Utils_ap(
													forPlaceholder,
													_Utils_ap(
														_List_fromArray(
															[
																$mdgriffith$elm_ui$Element$Font$color($mdgriffith$elm_ui$Element$Input$charcoal),
																$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.fV + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.jH)),
																$mdgriffith$elm_ui$Element$Border$color(
																A4($mdgriffith$elm_ui$Element$rgba, 0, 0, 0, 0)),
																$mdgriffith$elm_ui$Element$Background$color(
																A4($mdgriffith$elm_ui$Element$rgba, 0, 0, 0, 0)),
																$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
																$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
																$mdgriffith$elm_ui$Element$alpha(
																(textOptions.c3 === '') ? 1 : 0)
															]),
														placeholderAttrs))),
											placeholderEl))
									]);
							}
						}()
						]))),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(
				_List_fromArray(
					[
						A4(
						$mdgriffith$elm_ui$Internal$Model$element,
						$mdgriffith$elm_ui$Internal$Model$asEl,
						$mdgriffith$elm_ui$Internal$Model$NodeName(inputNode),
						$elm$core$List$concat(
							_List_fromArray(
								[
									_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$Input$focusDefault(attrs),
										$mdgriffith$elm_ui$Element$Input$hiddenLabelAttribute(textOptions.F)
									]),
									inputAttrs,
									behavior
								])),
						$mdgriffith$elm_ui$Internal$Model$Unkeyed(inputChildren))
					])));
		return A3(
			$mdgriffith$elm_ui$Element$Input$applyLabel,
			A2(
				$elm$core$List$cons,
				A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$cursor, $mdgriffith$elm_ui$Internal$Style$classes.hQ),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$Input$isHiddenLabel(textOptions.F) ? $mdgriffith$elm_ui$Internal$Model$NoAttribute : $mdgriffith$elm_ui$Element$spacing(5),
					A2($elm$core$List$cons, $mdgriffith$elm_ui$Element$Region$announce, attributesFromChild))),
			textOptions.F,
			inputElement);
	});
var $mdgriffith$elm_ui$Element$Input$multiline = F2(
	function (attrs, multi) {
		return A3(
			$mdgriffith$elm_ui$Element$Input$textHelper,
			{aA: $elm$core$Maybe$Nothing, aQ: multi.ks, a2: $mdgriffith$elm_ui$Element$Input$TextArea},
			attrs,
			{F: multi.F, cW: multi.cW, c0: multi.c0, c3: multi.c3});
	});
var $mdgriffith$elm_ui$Element$Input$TextInputNode = function (a) {
	return {$: 0, a: a};
};
var $mdgriffith$elm_ui$Element$Input$text = $mdgriffith$elm_ui$Element$Input$textHelper(
	{
		aA: $elm$core$Maybe$Nothing,
		aQ: false,
		a2: $mdgriffith$elm_ui$Element$Input$TextInputNode('text')
	});
var $author$project$Internals$CommonStyleHelpers$textInputStyle = _List_fromArray(
	[
		$mdgriffith$elm_ui$Element$width(
		$mdgriffith$elm_ui$Element$px(250)),
		A2($mdgriffith$elm_ui$Element$paddingXY, 5, 5),
		$mdgriffith$elm_ui$Element$spacing(15),
		$mdgriffith$elm_ui$Element$focused(
		_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$Border$glow,
				A3($mdgriffith$elm_ui$Element$rgb, 1, 1, 1),
				0)
			]))
	]);
var $author$project$Internals$Contact$validate = function (model) {
	return $author$project$Internals$Contact$canLoadCaptcha(model) && (!$elm$core$String$isEmpty(model.cE));
};
var $author$project$Internals$Contact$view = function (model) {
	return A2(
		$mdgriffith$elm_ui$Element$map,
		model.cK,
		function ($) {
			return $.dV;
		}(model) ? A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$spacing(20),
					$mdgriffith$elm_ui$Element$padding(10),
					$mdgriffith$elm_ui$Element$width(
					$mdgriffith$elm_ui$Element$px(600)),
					$mdgriffith$elm_ui$Element$Border$rounded(5),
					$mdgriffith$elm_ui$Element$Background$color(
					A3($mdgriffith$elm_ui$Element$rgb, 1, 1, 1))
				]),
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$text('Votre message à bien été envoyé'),
					A2(
					$mdgriffith$elm_ui$Element$Input$button,
					_Utils_ap(
						$author$project$Internals$CommonStyleHelpers$buttonStyle(true),
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$width(
								$mdgriffith$elm_ui$Element$px(150))
							])),
					{
						F: $mdgriffith$elm_ui$Element$text('Nouveau message'),
						ax: $elm$core$Maybe$Just($author$project$Internals$Contact$Reset)
					})
				])) : A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$spacing(20),
					$mdgriffith$elm_ui$Element$padding(10),
					$mdgriffith$elm_ui$Element$width(
					$mdgriffith$elm_ui$Element$px(600)),
					$mdgriffith$elm_ui$Element$Border$rounded(5),
					$mdgriffith$elm_ui$Element$Background$color(
					A3($mdgriffith$elm_ui$Element$rgb, 1, 1, 1))
				]),
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$wrappedRow,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$spacing(15)
						]),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Element$Input$text,
							_Utils_ap(
								$author$project$Internals$CommonStyleHelpers$textInputStyle,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$width(
										$mdgriffith$elm_ui$Element$px(270)),
										$mdgriffith$elm_ui$Element$Background$color($author$project$Internals$CommonStyleHelpers$grey7)
									])),
							{
								F: $author$project$Internals$Contact$mandatoryLabel('Nom et prénom:'),
								cW: $author$project$Internals$Contact$SetName,
								c0: $elm$core$Maybe$Nothing,
								c3: model.C
							}),
							A2(
							$mdgriffith$elm_ui$Element$Input$text,
							_Utils_ap(
								$author$project$Internals$CommonStyleHelpers$textInputStyle,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$width(
										$mdgriffith$elm_ui$Element$px(270)),
										$mdgriffith$elm_ui$Element$Background$color($author$project$Internals$CommonStyleHelpers$grey7)
									])),
							{
								F: A2(
									$mdgriffith$elm_ui$Element$Input$labelAbove,
									_List_Nil,
									$mdgriffith$elm_ui$Element$text('Société:')),
								cW: $author$project$Internals$Contact$SetCompany,
								c0: $elm$core$Maybe$Nothing,
								c3: model.cF
							})
						])),
					A2(
					$mdgriffith$elm_ui$Element$wrappedRow,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$spacing(15)
						]),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Element$Input$text,
							_Utils_ap(
								$author$project$Internals$CommonStyleHelpers$textInputStyle,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$width(
										$mdgriffith$elm_ui$Element$px(270)),
										$mdgriffith$elm_ui$Element$Background$color($author$project$Internals$CommonStyleHelpers$grey7)
									])),
							{
								F: $author$project$Internals$Contact$mandatoryLabel('Email:'),
								cW: $author$project$Internals$Contact$SetEmail,
								c0: $elm$core$Maybe$Nothing,
								c3: model.h3
							}),
							A2(
							$mdgriffith$elm_ui$Element$Input$text,
							_Utils_ap(
								$author$project$Internals$CommonStyleHelpers$textInputStyle,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$width(
										$mdgriffith$elm_ui$Element$px(270)),
										$mdgriffith$elm_ui$Element$Background$color($author$project$Internals$CommonStyleHelpers$grey7)
									])),
							{
								F: A2(
									$mdgriffith$elm_ui$Element$Input$labelAbove,
									_List_Nil,
									$mdgriffith$elm_ui$Element$text('Téléphone:')),
								cW: $author$project$Internals$Contact$SetPhone,
								c0: $elm$core$Maybe$Nothing,
								c3: model.c$
							})
						])),
					A2(
					$mdgriffith$elm_ui$Element$row,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Element$Input$text,
							_Utils_ap(
								$author$project$Internals$CommonStyleHelpers$textInputStyle,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$width(
										$mdgriffith$elm_ui$Element$px(270)),
										$mdgriffith$elm_ui$Element$Background$color($author$project$Internals$CommonStyleHelpers$grey7)
									])),
							{
								F: $author$project$Internals$Contact$mandatoryLabel('Sujet:'),
								cW: $author$project$Internals$Contact$SetTopic,
								c0: $elm$core$Maybe$Nothing,
								c3: model.cB
							})
						])),
					A2(
					$mdgriffith$elm_ui$Element$Input$multiline,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$spacing(5),
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$padding(5),
							$mdgriffith$elm_ui$Element$height(
							$mdgriffith$elm_ui$Element$px(100)),
							$mdgriffith$elm_ui$Element$Background$color($author$project$Internals$CommonStyleHelpers$grey7)
						]),
					{
						F: $author$project$Internals$Contact$mandatoryLabel('Votre message:'),
						cW: $author$project$Internals$Contact$SetMessage,
						c0: $elm$core$Maybe$Nothing,
						ks: false,
						c3: model.cT
					}),
					function ($) {
					return $.cs;
				}(model) ? $mdgriffith$elm_ui$Element$none : A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$htmlAttribute(
							$elm$html$Html$Attributes$class('g-recaptcha'))
						]),
					$mdgriffith$elm_ui$Element$none),
					function ($) {
					return $.cs;
				}(model) ? A2(
					$mdgriffith$elm_ui$Element$row,
					_List_Nil,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$text('Traitement en cours, veuillez patienter... '),
							$mdgriffith$elm_ui$Element$html(
							A2(
								$elm$html$Html$i,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('fa fa-spinner fa-pulse')
									]),
								_List_Nil))
						])) : A2(
					$mdgriffith$elm_ui$Element$Input$button,
					_Utils_ap(
						$author$project$Internals$CommonStyleHelpers$buttonStyle(
							$author$project$Internals$Contact$validate(model)),
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$width(
								$mdgriffith$elm_ui$Element$px(150))
							])),
					{
						F: $mdgriffith$elm_ui$Element$text('Envoyer'),
						ax: $author$project$Internals$Contact$validate(model) ? $elm$core$Maybe$Just($author$project$Internals$Contact$Send) : $elm$core$Maybe$Nothing
					})
				])));
};
var $author$project$Murol$contactView = F2(
	function (model, maxWidth) {
		return A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$centerX,
					$mdgriffith$elm_ui$Element$width(
					A2($mdgriffith$elm_ui$Element$maximum, maxWidth, $mdgriffith$elm_ui$Element$fill)),
					$mdgriffith$elm_ui$Element$Background$color(
					A4($mdgriffith$elm_ui$Element$rgba, 1, 1, 1, 0.9)),
					$mdgriffith$elm_ui$Element$padding(15),
					$mdgriffith$elm_ui$Element$height(
					A2($mdgriffith$elm_ui$Element$minimum, 300, $mdgriffith$elm_ui$Element$fill))
				]),
			_List_fromArray(
				[
					A4($author$project$Document$DocumentViews$DocumentView$customHeading, model.a, 1, _List_Nil, 'Contact'),
					A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							A2($mdgriffith$elm_ui$Element$paddingXY, 0, 15)
						]),
					$author$project$Internals$Contact$view(model.b8))
				]));
	});
var $author$project$Internals$CommonStyleHelpers$blue4 = A3($mdgriffith$elm_ui$Element$rgb255, 49, 131, 200);
var $author$project$Internals$CommonStyleHelpers$blue5 = A3($mdgriffith$elm_ui$Element$rgb255, 99, 162, 216);
var $author$project$Murol$legalView = F2(
	function (model, maxWidth) {
		return A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$centerX,
					$mdgriffith$elm_ui$Element$width(
					A2($mdgriffith$elm_ui$Element$maximum, maxWidth, $mdgriffith$elm_ui$Element$fill)),
					$mdgriffith$elm_ui$Element$Background$color(
					A4($mdgriffith$elm_ui$Element$rgba, 1, 1, 1, 0.9)),
					$mdgriffith$elm_ui$Element$padding(15),
					$mdgriffith$elm_ui$Element$height(
					A2($mdgriffith$elm_ui$Element$minimum, 300, $mdgriffith$elm_ui$Element$fill)),
					$mdgriffith$elm_ui$Element$spacing(15)
				]),
			_List_fromArray(
				[
					A4($author$project$Document$DocumentViews$DocumentView$customHeading, model.a, 1, _List_Nil, 'Mentions légales'),
					A4($author$project$Document$DocumentViews$DocumentView$customHeading, model.a, 2, _List_Nil, 'Conception'),
					A2(
					$mdgriffith$elm_ui$Element$wrappedRow,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$spacing(15)
						]),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Element$el,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$Background$image('/assets/images/logoCropped.gif'),
									$mdgriffith$elm_ui$Element$width(
									$mdgriffith$elm_ui$Element$px(150)),
									$mdgriffith$elm_ui$Element$height(
									$mdgriffith$elm_ui$Element$px(150)),
									$mdgriffith$elm_ui$Element$Border$rounded(10)
								]),
							$mdgriffith$elm_ui$Element$none),
							A2(
							$mdgriffith$elm_ui$Element$column,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$spacing(5),
									$mdgriffith$elm_ui$Element$alignTop
								]),
							_List_fromArray(
								[
									A4($author$project$Document$DocumentViews$DocumentView$customHeading, model.a, 3, _List_Nil, 'Gillard Informatique'),
									A2(
									$mdgriffith$elm_ui$Element$el,
									_List_Nil,
									$mdgriffith$elm_ui$Element$text('5 Place de l\'église')),
									A2(
									$mdgriffith$elm_ui$Element$el,
									_List_Nil,
									$mdgriffith$elm_ui$Element$text('89520 Lainsecq')),
									A2(
									$mdgriffith$elm_ui$Element$el,
									_List_Nil,
									$mdgriffith$elm_ui$Element$text('Tel +33 (0)3 86 74 72 64')),
									A2(
									$mdgriffith$elm_ui$Element$el,
									_List_Nil,
									$mdgriffith$elm_ui$Element$text('Mobile +33 (0)6 52 11 05 72')),
									A2(
									$mdgriffith$elm_ui$Element$el,
									_List_Nil,
									$mdgriffith$elm_ui$Element$text('Siret: 823 705 009 00020')),
									A2(
									$mdgriffith$elm_ui$Element$row,
									_List_fromArray(
										[
											$mdgriffith$elm_ui$Element$spacing(10)
										]),
									_List_fromArray(
										[
											A2(
											$mdgriffith$elm_ui$Element$el,
											_List_Nil,
											$mdgriffith$elm_ui$Element$text('Site officiel:')),
											A2(
											$mdgriffith$elm_ui$Element$newTabLink,
											_List_fromArray(
												[
													$mdgriffith$elm_ui$Element$Font$color($author$project$Internals$CommonStyleHelpers$blue4),
													$mdgriffith$elm_ui$Element$mouseOver(
													_List_fromArray(
														[
															$mdgriffith$elm_ui$Element$Font$color($author$project$Internals$CommonStyleHelpers$blue5)
														]))
												]),
											{
												F: $mdgriffith$elm_ui$Element$text('gillardinformatique.net'),
												da: 'http://www.gillardinformatique.net'
											})
										]))
								]))
						])),
					A4($author$project$Document$DocumentViews$DocumentView$customHeading, model.a, 2, _List_Nil, 'Hébergement'),
					A2(
					$mdgriffith$elm_ui$Element$el,
					_List_Nil,
					$mdgriffith$elm_ui$Element$text('Ionos 1&1 Internet')),
					A4($author$project$Document$DocumentViews$DocumentView$customHeading, model.a, 2, _List_Nil, 'Données personnelles'),
					A2(
					$mdgriffith$elm_ui$Element$paragraph,
					_List_Nil,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$text('Les données personnelles collectées par ce site via le formulaire de contact sont uniquement destinées à un usage interne. En aucun cas ces données ne seront cédées, communiquées ou vendues à des tiers. ')
						]))
				]));
	});
var $author$project$Document$DocumentViews$StyleSheets$chunkBy = F5(
	function (config, n1, n2, n3, n4) {
		var device = $author$project$Document$DocumentViews$StyleSheets$getDevice(config);
		var _v0 = device.b6;
		switch (_v0) {
			case 0:
				return n1;
			case 1:
				return n2;
			case 2:
				return n3;
			default:
				return n4;
		}
	});
var $elm$core$List$drop = F2(
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
var $elm$core$List$takeReverse = F3(
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
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $author$project$Internals$CommonHelpers$chunks = F2(
	function (n, xs) {
		var helper = F2(
			function (acc, ys) {
				helper:
				while (true) {
					if (!ys.b) {
						return $elm$core$List$reverse(acc);
					} else {
						var $temp$acc = A2(
							$elm$core$List$cons,
							A2($elm$core$List$take, n, ys),
							acc),
							$temp$ys = A2($elm$core$List$drop, n, ys);
						acc = $temp$acc;
						ys = $temp$ys;
						continue helper;
					}
				}
			});
		return A2(helper, _List_Nil, xs);
	});
var $author$project$Internals$CommonStyleHelpers$aliceBlue = A4($mdgriffith$elm_ui$Element$rgba255, 240, 248, 255, 1);
var $mdgriffith$elm_ui$Internal$Model$Bottom = 2;
var $mdgriffith$elm_ui$Element$alignBottom = $mdgriffith$elm_ui$Internal$Model$AlignY(2);
var $author$project$Internals$CommonStyleHelpers$blockLinkGrey = A3($mdgriffith$elm_ui$Element$rgb255, 119, 136, 153);
var $author$project$Internals$CommonStyleHelpers$blockLinkGreyAlpha = function (a) {
	return A4($mdgriffith$elm_ui$Element$rgba255, 119, 136, 153, a);
};
var $mdgriffith$elm_ui$Element$Keyed$el = F2(
	function (attrs, child) {
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asEl,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
					attrs)),
			$mdgriffith$elm_ui$Internal$Model$Keyed(
				_List_fromArray(
					[child])));
	});
var $elm$svg$Svg$Attributes$class = _VirtualDom_attribute('class');
var $elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var $elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var $elm$svg$Svg$Attributes$stroke = _VirtualDom_attribute('stroke');
var $elm$svg$Svg$Attributes$strokeLinecap = _VirtualDom_attribute('stroke-linecap');
var $elm$svg$Svg$Attributes$strokeLinejoin = _VirtualDom_attribute('stroke-linejoin');
var $elm$svg$Svg$Attributes$strokeWidth = _VirtualDom_attribute('stroke-width');
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var $elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var $author$project$Internals$Icons$customSvgFeatherIcon = F2(
	function (size, className) {
		return $elm$svg$Svg$svg(
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('feather feather-' + className),
					$elm$svg$Svg$Attributes$fill('none'),
					$elm$svg$Svg$Attributes$height(
					$elm$core$String$fromInt(size)),
					$elm$svg$Svg$Attributes$stroke('currentColor'),
					$elm$svg$Svg$Attributes$strokeLinecap('round'),
					$elm$svg$Svg$Attributes$strokeLinejoin('round'),
					$elm$svg$Svg$Attributes$strokeWidth('2'),
					$elm$svg$Svg$Attributes$viewBox('0 0 24 24'),
					$elm$svg$Svg$Attributes$width(
					$elm$core$String$fromInt(size))
				]));
	});
var $elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var $elm$svg$Svg$line = $elm$svg$Svg$trustedNode('line');
var $elm$svg$Svg$path = $elm$svg$Svg$trustedNode('path');
var $elm$svg$Svg$Attributes$points = _VirtualDom_attribute('points');
var $elm$svg$Svg$polyline = $elm$svg$Svg$trustedNode('polyline');
var $elm$svg$Svg$Attributes$x1 = _VirtualDom_attribute('x1');
var $elm$svg$Svg$Attributes$x2 = _VirtualDom_attribute('x2');
var $elm$svg$Svg$Attributes$y1 = _VirtualDom_attribute('y1');
var $elm$svg$Svg$Attributes$y2 = _VirtualDom_attribute('y2');
var $author$project$Internals$Icons$externalLink = function (size) {
	return A3(
		$author$project$Internals$Icons$customSvgFeatherIcon,
		size,
		'external-link',
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$path,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$d('M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$polyline,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$points('15 3 21 3 21 9')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$line,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x1('10'),
						$elm$svg$Svg$Attributes$y1('14'),
						$elm$svg$Svg$Attributes$x2('21'),
						$elm$svg$Svg$Attributes$y2('3')
					]),
				_List_Nil)
			]));
};
var $author$project$Document$DocumentViews$StyleSheets$getContainerWidth = function (config) {
	if (config.an) {
		var _v0 = config.dT;
		switch (_v0) {
			case 1:
				return 980;
			case 2:
				return 800;
			case 3:
				return 350;
			default:
				return config.lb;
		}
	} else {
		return config.lb;
	}
};
var $Skinney$murmur3$Murmur3$HashData = F4(
	function (shift, seed, hash, charsProcessed) {
		return {b5: charsProcessed, cg: hash, j7: seed, ct: shift};
	});
var $Skinney$murmur3$Murmur3$c1 = 3432918353;
var $Skinney$murmur3$Murmur3$c2 = 461845907;
var $Skinney$murmur3$Murmur3$multiplyBy = F2(
	function (b, a) {
		return ((a & 65535) * b) + ((((a >>> 16) * b) & 65535) << 16);
	});
var $Skinney$murmur3$Murmur3$rotlBy = F2(
	function (b, a) {
		return (a << b) | (a >>> (32 - b));
	});
var $Skinney$murmur3$Murmur3$finalize = function (data) {
	var acc = (!(!data.cg)) ? (data.j7 ^ A2(
		$Skinney$murmur3$Murmur3$multiplyBy,
		$Skinney$murmur3$Murmur3$c2,
		A2(
			$Skinney$murmur3$Murmur3$rotlBy,
			15,
			A2($Skinney$murmur3$Murmur3$multiplyBy, $Skinney$murmur3$Murmur3$c1, data.cg)))) : data.j7;
	var h0 = acc ^ data.b5;
	var h1 = A2($Skinney$murmur3$Murmur3$multiplyBy, 2246822507, h0 ^ (h0 >>> 16));
	var h2 = A2($Skinney$murmur3$Murmur3$multiplyBy, 3266489909, h1 ^ (h1 >>> 13));
	return (h2 ^ (h2 >>> 16)) >>> 0;
};
var $elm$core$String$foldl = _String_foldl;
var $Skinney$murmur3$Murmur3$mix = F2(
	function (h1, k1) {
		return A2(
			$Skinney$murmur3$Murmur3$multiplyBy,
			5,
			A2(
				$Skinney$murmur3$Murmur3$rotlBy,
				13,
				h1 ^ A2(
					$Skinney$murmur3$Murmur3$multiplyBy,
					$Skinney$murmur3$Murmur3$c2,
					A2(
						$Skinney$murmur3$Murmur3$rotlBy,
						15,
						A2($Skinney$murmur3$Murmur3$multiplyBy, $Skinney$murmur3$Murmur3$c1, k1))))) + 3864292196;
	});
var $Skinney$murmur3$Murmur3$hashFold = F2(
	function (c, data) {
		var res = data.cg | ((255 & $elm$core$Char$toCode(c)) << data.ct);
		var _v0 = data.ct;
		if (_v0 === 24) {
			return {
				b5: data.b5 + 1,
				cg: 0,
				j7: A2($Skinney$murmur3$Murmur3$mix, data.j7, res),
				ct: 0
			};
		} else {
			return {b5: data.b5 + 1, cg: res, j7: data.j7, ct: data.ct + 8};
		}
	});
var $Skinney$murmur3$Murmur3$hashString = F2(
	function (seed, str) {
		return $Skinney$murmur3$Murmur3$finalize(
			A3(
				$elm$core$String$foldl,
				$Skinney$murmur3$Murmur3$hashFold,
				A4($Skinney$murmur3$Murmur3$HashData, 0, seed, 0, 0),
				str));
	});
var $author$project$Internals$CommonStyleHelpers$noAttr = $mdgriffith$elm_ui$Element$htmlAttribute(
	$elm$html$Html$Attributes$class(''));
var $author$project$Internals$CommonStyleHelpers$unselectable = A2(
	$elm$core$List$map,
	$mdgriffith$elm_ui$Element$htmlAttribute,
	_List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, '-webkit-touch-callout', 'none'),
			A2($elm$html$Html$Attributes$style, '-webkit-user-select', 'none'),
			A2($elm$html$Html$Attributes$style, '-khtml-user-select', 'none'),
			A2($elm$html$Html$Attributes$style, '-moz-user-select', 'none'),
			A2($elm$html$Html$Attributes$style, '-ms-user-select', 'none'),
			A2($elm$html$Html$Attributes$style, 'user-select', 'none')
		]));
var $author$project$Document$DocumentViews$DocumentView$renderBlocksLinksMeta = F5(
	function (nbrChunks, config, id, attrs, _v0) {
		var image = _v0.iC;
		var label = _v0.F;
		var targetBlank = _v0.gA;
		var url = _v0.da;
		var url_ = targetBlank ? url : A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Dict$get, url, config.f3));
		var styleSheet = $author$project$Document$DocumentViews$StyleSheets$defaultStyleSheet(config);
		var linkFun = targetBlank ? $mdgriffith$elm_ui$Element$newTabLink : $mdgriffith$elm_ui$Element$link;
		var containerWidth = $author$project$Document$DocumentViews$StyleSheets$getContainerWidth(config);
		var maxWidth = function () {
			var spacing = 10;
			var padding = 40;
			return A2($elm$core$Basics$min, ((containerWidth - padding) - ((nbrChunks - 1) * padding)) / nbrChunks, 300);
		}();
		var bw = $elm$core$Basics$round(maxWidth);
		var bh = $elm$core$Basics$round(maxWidth / (300 / 225));
		var block = A2(
			$mdgriffith$elm_ui$Element$el,
			_Utils_ap(
				styleSheet.he,
				_Utils_ap(
					A2($author$project$Document$DocumentViews$DocumentView$renderAttrs, config, attrs),
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width(
							$mdgriffith$elm_ui$Element$px(bw)),
							$mdgriffith$elm_ui$Element$height(
							$mdgriffith$elm_ui$Element$px(bh)),
							$mdgriffith$elm_ui$Element$Background$color($author$project$Internals$CommonStyleHelpers$blockLinkGrey),
							(!config.an) ? $mdgriffith$elm_ui$Element$mouseOver(
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$Background$color(
									$author$project$Internals$CommonStyleHelpers$blockLinkGreyAlpha(0.5))
								])) : $author$project$Internals$CommonStyleHelpers$noAttr
						]))),
			A2(
				$mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$width(
						$mdgriffith$elm_ui$Element$px(bw - 12)),
						$mdgriffith$elm_ui$Element$height(
						$mdgriffith$elm_ui$Element$px(bh - 12)),
						$mdgriffith$elm_ui$Element$centerX,
						$mdgriffith$elm_ui$Element$centerY,
						$mdgriffith$elm_ui$Element$Background$image(image),
						$mdgriffith$elm_ui$Element$inFront(
						A2(
							$mdgriffith$elm_ui$Element$el,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$alignBottom,
									$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
									$mdgriffith$elm_ui$Element$padding(10),
									$mdgriffith$elm_ui$Element$Background$color(
									$author$project$Internals$CommonStyleHelpers$blockLinkGreyAlpha(0.8)),
									$mdgriffith$elm_ui$Element$Font$color($author$project$Internals$CommonStyleHelpers$aliceBlue)
								]),
							A2(
								$mdgriffith$elm_ui$Element$row,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
									]),
								_List_fromArray(
									[
										A2(
										$mdgriffith$elm_ui$Element$el,
										_Utils_ap(
											_List_fromArray(
												[
													$mdgriffith$elm_ui$Element$Font$center,
													$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
												]),
											$author$project$Internals$CommonStyleHelpers$unselectable),
										$mdgriffith$elm_ui$Element$text(
											$elm_community$string_extra$String$Extra$toSentenceCase(label))),
										targetBlank ? A2(
										$mdgriffith$elm_ui$Element$el,
										_List_fromArray(
											[
												$mdgriffith$elm_ui$Element$alignRight,
												$mdgriffith$elm_ui$Element$Font$color(
												A3($mdgriffith$elm_ui$Element$rgb, 1, 1, 1))
											]),
										$mdgriffith$elm_ui$Element$html(
											$author$project$Internals$Icons$externalLink(16))) : $mdgriffith$elm_ui$Element$none
									]))))
					]),
				$mdgriffith$elm_ui$Element$none));
		return config.an ? A2(
			$mdgriffith$elm_ui$Element$Keyed$el,
			_List_Nil,
			_Utils_Tuple2(
				$elm$core$String$fromInt(
					A2(
						$Skinney$murmur3$Murmur3$hashString,
						0,
						_Utils_ap(
							image,
							_Utils_ap(url, label)))),
				block)) : A2(
			linkFun,
			_List_Nil,
			{F: block, da: url_});
	});
var $author$project$Document$DocumentViews$DocumentView$renderBlockLinks = F4(
	function (config, id, attrs, meta) {
		var styleSheet = $author$project$Document$DocumentViews$StyleSheets$defaultStyleSheet(config);
		var nbrChunks = A5($author$project$Document$DocumentViews$StyleSheets$chunkBy, config, 1, 2, 3, 3);
		var rows = A2(
			$elm$core$List$map,
			$mdgriffith$elm_ui$Element$row(
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$centerX,
						$mdgriffith$elm_ui$Element$spacing(10)
					])),
			A2(
				$author$project$Internals$CommonHelpers$chunks,
				nbrChunks,
				A2(
					$elm$core$List$map,
					A4($author$project$Document$DocumentViews$DocumentView$renderBlocksLinksMeta, nbrChunks, config, id, attrs),
					meta)));
		var maxWidth = A3(
			$author$project$Document$DocumentViews$StyleSheets$docMaxWidth,
			_Utils_Tuple2(config.lb, config.iu),
			config.an,
			config.dT);
		return _List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$column,
				_Utils_ap(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$spacing(10)
						]),
					_Utils_ap(
						A2($author$project$Document$DocumentViews$DocumentView$idStyle, styleSheet, id),
						A2($author$project$Document$DocumentViews$DocumentView$renderAttrs, config, attrs))),
				rows)
			]);
	});
var $AdrianRibao$elm_derberos_date$Derberos$Date$Core$monthToNumber1based = function (month) {
	switch (month) {
		case 0:
			return 1;
		case 1:
			return 2;
		case 2:
			return 3;
		case 3:
			return 4;
		case 4:
			return 5;
		case 5:
			return 6;
		case 6:
			return 7;
		case 7:
			return 8;
		case 8:
			return 9;
		case 9:
			return 10;
		case 10:
			return 11;
		default:
			return 12;
	}
};
var $AdrianRibao$elm_derberos_date$Derberos$Date$Core$newDateRecord = F8(
	function (year, month, day, hour, minute, second, millis, zone) {
		return {fk: day, ix: hour, dI: millis, i6: minute, fR: month, j6: second, gP: year, e0: zone};
	});
var $elm$time$Time$toHour = F2(
	function (zone, time) {
		return A2(
			$elm$core$Basics$modBy,
			24,
			A2(
				$elm$time$Time$flooredDiv,
				A2($elm$time$Time$toAdjustedMinutes, zone, time),
				60));
	});
var $elm$time$Time$toMillis = F2(
	function (_v0, time) {
		return A2(
			$elm$core$Basics$modBy,
			1000,
			$elm$time$Time$posixToMillis(time));
	});
var $elm$time$Time$toMinute = F2(
	function (zone, time) {
		return A2(
			$elm$core$Basics$modBy,
			60,
			A2($elm$time$Time$toAdjustedMinutes, zone, time));
	});
var $elm$time$Time$toSecond = F2(
	function (_v0, time) {
		return A2(
			$elm$core$Basics$modBy,
			60,
			A2(
				$elm$time$Time$flooredDiv,
				$elm$time$Time$posixToMillis(time),
				1000));
	});
var $elm$time$Time$toYear = F2(
	function (zone, time) {
		return $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).gP;
	});
var $AdrianRibao$elm_derberos_date$Derberos$Date$Core$civilFromPosixWithTimezone = F2(
	function (tz, time) {
		var zeroOffset = A2($elm$time$Time$customZone, 0, _List_Nil);
		var year = A2($elm$time$Time$toYear, tz, time);
		var second = A2($elm$time$Time$toSecond, tz, time);
		var month = $AdrianRibao$elm_derberos_date$Derberos$Date$Core$monthToNumber1based(
			A2($elm$time$Time$toMonth, tz, time));
		var minute = A2($elm$time$Time$toMinute, tz, time);
		var millis = A2($elm$time$Time$toMillis, tz, time);
		var hour = A2($elm$time$Time$toHour, tz, time);
		var day = A2($elm$time$Time$toDay, tz, time);
		return A8($AdrianRibao$elm_derberos_date$Derberos$Date$Core$newDateRecord, year, month, day, hour, minute, second, millis, zeroOffset);
	});
var $AdrianRibao$elm_derberos_date$Derberos$Date$Core$civilToPosixUnadjusted = function (dateRecord) {
	var y = dateRecord.gP - ((dateRecord.fR <= 2) ? 1 : 0);
	var time = ((((dateRecord.ix * 3600) * 1000) + ((dateRecord.i6 * 60) * 1000)) + (dateRecord.j6 * 1000)) + dateRecord.dI;
	var mp = A2($elm$core$Basics$modBy, 12, dateRecord.fR + 9);
	var era = $elm$core$Basics$floor(y / 400);
	var yoe = y - (era * 400);
	var doy = (((((153 * mp) + 2) / 5) | 0) + dateRecord.fk) - 1;
	var doe = (((yoe * 365) + ((yoe / 4) | 0)) - ((yoe / 100) | 0)) + doy;
	var days = ((era * 146097) + doe) - 719468;
	var resultInMilliseconds = (((days * 24) * 3600) * 1000) + time;
	return $elm$time$Time$millisToPosix(resultInMilliseconds);
};
var $AdrianRibao$elm_derberos_date$Derberos$Date$Core$getTzOffset = F2(
	function (zone, time) {
		var utcMillis = $elm$time$Time$posixToMillis(time);
		var localMillis = $elm$time$Time$posixToMillis(
			$AdrianRibao$elm_derberos_date$Derberos$Date$Core$civilToPosixUnadjusted(
				A2($AdrianRibao$elm_derberos_date$Derberos$Date$Core$civilFromPosixWithTimezone, zone, time)));
		return ((localMillis - utcMillis) / 60000) | 0;
	});
var $AdrianRibao$elm_derberos_date$Derberos$Date$Core$addTimezoneMilliseconds = F2(
	function (zone, time) {
		var offset = A2($AdrianRibao$elm_derberos_date$Derberos$Date$Core$getTzOffset, zone, time);
		var millis = $elm$time$Time$posixToMillis(time);
		return $elm$time$Time$millisToPosix(millis + (offset * 60000));
	});
var $AdrianRibao$elm_derberos_date$Derberos$Date$Core$posixToCivil = function (time) {
	var milliseconds = $elm$time$Time$posixToMillis(time);
	var minute = A2(
		$elm$core$Basics$modBy,
		60,
		$elm$core$Basics$floor(milliseconds / (60 * 1000)));
	var minutes = $elm$core$Basics$floor(milliseconds / (60 * 1000));
	var rawDay = $elm$core$Basics$floor((minutes / (60 * 24)) + 719468);
	var second = A2(
		$elm$core$Basics$modBy,
		60,
		$elm$core$Basics$floor(milliseconds / 1000));
	var millis = A2($elm$core$Basics$modBy, 1000, milliseconds);
	var hour = A2(
		$elm$core$Basics$modBy,
		24,
		$elm$core$Basics$floor(milliseconds / ((60 * 60) * 1000)));
	var era = (((rawDay >= 0) ? rawDay : (rawDay - 146096)) / 146097) | 0;
	var dayOfEra = rawDay - (era * 146097);
	var yearOfEra = ((((dayOfEra - ((dayOfEra / 1460) | 0)) + ((dayOfEra / 36524) | 0)) - ((dayOfEra / 146096) | 0)) / 365) | 0;
	var dayOfYear = dayOfEra - (((365 * yearOfEra) + ((yearOfEra / 4) | 0)) - ((yearOfEra / 100) | 0));
	var mp = (((5 * dayOfYear) + 2) / 153) | 0;
	var month = mp + ((mp < 10) ? 3 : (-9));
	var year = yearOfEra + (era * 400);
	return {
		fk: (dayOfYear - ((((153 * mp) + 2) / 5) | 0)) + 1,
		ix: hour,
		dI: millis,
		i6: minute,
		fR: month,
		j6: second,
		gP: year + ((month <= 2) ? 1 : 0),
		e0: $elm$time$Time$utc
	};
};
var $author$project$Internals$CommonHelpers$dateToStr = F2(
	function (zone, d) {
		var dateRec = $AdrianRibao$elm_derberos_date$Derberos$Date$Core$posixToCivil(
			A2($AdrianRibao$elm_derberos_date$Derberos$Date$Core$addTimezoneMilliseconds, zone, d));
		return A3(
			$elm$core$String$padLeft,
			2,
			'0',
			$elm$core$String$fromInt(dateRec.fk)) + ('/' + (A3(
			$elm$core$String$padLeft,
			2,
			'0',
			$elm$core$String$fromInt(dateRec.fR)) + ('/' + $elm$core$String$fromInt(dateRec.gP))));
	});
var $elm$html$Html$Attributes$download = function (fileName) {
	return A2($elm$html$Html$Attributes$stringProperty, 'download', fileName);
};
var $mdgriffith$elm_ui$Element$download = F2(
	function (attrs, _v0) {
		var url = _v0.da;
		var label = _v0.F;
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asEl,
			$mdgriffith$elm_ui$Internal$Model$NodeName('a'),
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Internal$Model$Attr(
					$elm$html$Html$Attributes$href(url)),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Internal$Model$Attr(
						$elm$html$Html$Attributes$download('')),
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
							A2(
								$elm$core$List$cons,
								$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.dk),
								A2(
									$elm$core$List$cons,
									$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.bl),
									attrs)))))),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(
				_List_fromArray(
					[label])));
	});
var $author$project$Internals$CommonStyleHelpers$grey5 = A3($mdgriffith$elm_ui$Element$rgb255, 207, 214, 222);
var $author$project$Internals$CommonStyleHelpers$grey6 = A3($mdgriffith$elm_ui$Element$rgb255, 225, 231, 236);
var $elm$html$Html$Attributes$alt = $elm$html$Html$Attributes$stringProperty('alt');
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $mdgriffith$elm_ui$Element$image = F2(
	function (attrs, _v0) {
		var src = _v0.eT;
		var description = _v0.h$;
		var imageAttributes = A2(
			$elm$core$List$filter,
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
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asEl,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.iD),
				attrs),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(
				_List_fromArray(
					[
						A4(
						$mdgriffith$elm_ui$Internal$Model$element,
						$mdgriffith$elm_ui$Internal$Model$asEl,
						$mdgriffith$elm_ui$Internal$Model$NodeName('img'),
						_Utils_ap(
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Internal$Model$Attr(
									$elm$html$Html$Attributes$src(src)),
									$mdgriffith$elm_ui$Internal$Model$Attr(
									$elm$html$Html$Attributes$alt(description))
								]),
							imageAttributes),
						$mdgriffith$elm_ui$Internal$Model$Unkeyed(_List_Nil))
					])));
	});
var $author$project$Internals$CommonStyleHelpers$grey1 = A3($mdgriffith$elm_ui$Element$rgb255, 33, 41, 52);
var $author$project$Publications$PublicationsView$indexView = F3(
	function (issue, n, _v0) {
		var topic = _v0.a;
		var page = _v0.b;
		return A2(
			$mdgriffith$elm_ui$Element$paragraph,
			_List_fromArray(
				[
					(!A2($elm$core$Basics$modBy, 2, n)) ? $mdgriffith$elm_ui$Element$Background$color($author$project$Internals$CommonStyleHelpers$grey7) : $mdgriffith$elm_ui$Element$Background$color(
					A3($mdgriffith$elm_ui$Element$rgb255, 221, 221, 221)),
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
					A2($mdgriffith$elm_ui$Element$paddingXY, 10, 5),
					$mdgriffith$elm_ui$Element$Font$size(16),
					$mdgriffith$elm_ui$Element$Font$color($author$project$Internals$CommonStyleHelpers$grey1)
				]),
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$newTabLink,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$mouseOver(
							_List_fromArray(
								[
									(!A2($elm$core$Basics$modBy, 2, n)) ? $mdgriffith$elm_ui$Element$Font$color($author$project$Internals$CommonStyleHelpers$grey5) : $mdgriffith$elm_ui$Element$Font$color(
									A3($mdgriffith$elm_ui$Element$rgb, 1, 1, 1))
								])),
							$mdgriffith$elm_ui$Element$pointer,
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
						]),
					{
						F: A2(
							$mdgriffith$elm_ui$Element$row,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$spacing(10)
								]),
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$text('●'),
									A2(
									$mdgriffith$elm_ui$Element$paragraph,
									_List_Nil,
									_List_fromArray(
										[
											$mdgriffith$elm_ui$Element$text(topic)
										]))
								])),
						da: '/baseDocumentaire/publications/bulletins/' + function (s) {
							return s + ('.pdf#page=' + $elm$core$String$fromInt(page));
						}(
							A3(
								$elm$core$String$padLeft,
								3,
								'0',
								$elm$core$String$fromInt(issue)))
					})
				]));
	});
var $author$project$Publications$PublicationsView$maxWidth = function (config) {
	return A2(
		$elm$core$Basics$min,
		config.lb,
		A3(
			$author$project$Document$DocumentViews$StyleSheets$docMaxWidth,
			_Utils_Tuple2(config.lb, config.iu),
			config.an,
			config.dT)) - 40;
};
var $mdgriffith$elm_ui$Element$scrollbarY = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$overflow, $mdgriffith$elm_ui$Internal$Style$classes.j3);
var $author$project$Internals$CommonStyleHelpers$teal4 = A3($mdgriffith$elm_ui$Element$rgb255, 60, 174, 163);
var $author$project$Internals$CommonStyleHelpers$grey4 = A3($mdgriffith$elm_ui$Element$rgb255, 184, 196, 206);
var $mdgriffith$elm_ui$Element$Border$widthXY = F2(
	function (x, y) {
		return A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$borderWidth,
			A5(
				$mdgriffith$elm_ui$Internal$Model$BorderWidth,
				'b-' + ($elm$core$String$fromInt(x) + ('-' + $elm$core$String$fromInt(y))),
				y,
				x,
				y,
				x));
	});
var $mdgriffith$elm_ui$Element$Border$widthEach = function (_v0) {
	var bottom = _v0.aR;
	var top = _v0.a1;
	var left = _v0.aU;
	var right = _v0.a0;
	return (_Utils_eq(top, bottom) && _Utils_eq(left, right)) ? (_Utils_eq(top, right) ? $mdgriffith$elm_ui$Element$Border$width(top) : A2($mdgriffith$elm_ui$Element$Border$widthXY, left, top)) : A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$borderWidth,
		A5(
			$mdgriffith$elm_ui$Internal$Model$BorderWidth,
			'b-' + ($elm$core$String$fromInt(top) + ('-' + ($elm$core$String$fromInt(right) + ('-' + ($elm$core$String$fromInt(bottom) + ('-' + $elm$core$String$fromInt(left))))))),
			top,
			right,
			bottom,
			left));
};
var $author$project$Publications$PublicationsView$yearView = F3(
	function (year, xs, f) {
		return A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
					$mdgriffith$elm_ui$Element$spacing(10)
				]),
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Font$size(20),
							$mdgriffith$elm_ui$Element$Font$color(
							A3($mdgriffith$elm_ui$Element$rgb, 0, 0.5, 0)),
							$mdgriffith$elm_ui$Element$Font$bold,
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$paddingEach(
							{aR: 5, aU: 0, a0: 0, a1: 0}),
							$mdgriffith$elm_ui$Element$Border$widthEach(
							{aR: 1, aU: 0, a0: 0, a1: 0}),
							$mdgriffith$elm_ui$Element$Border$color($author$project$Internals$CommonStyleHelpers$grey4)
						]),
					$mdgriffith$elm_ui$Element$text(
						$elm$core$String$fromInt(year))),
					A2(
					$mdgriffith$elm_ui$Element$column,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$spacing(15),
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
						]),
					A2(
						$elm$core$List$map,
						f,
						$elm$core$List$reverse(xs)))
				]));
	});
var $author$project$Publications$PublicationsView$bulletinsView = function (config) {
	var bulletinView = function (_v2) {
		var issue = _v2.fG;
		var date = _v2.cI;
		var cover = _v2.hM;
		var index = _v2.iL;
		return A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$spacing(10),
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
				]),
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$row,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$spacing(15)
						]),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Element$row,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Element$el,
									_List_fromArray(
										[$mdgriffith$elm_ui$Element$Font$bold]),
									$mdgriffith$elm_ui$Element$text('Numéro: ')),
									A2(
									$mdgriffith$elm_ui$Element$el,
									_List_Nil,
									$mdgriffith$elm_ui$Element$text(
										$elm$core$String$fromInt(issue)))
								])),
							A2(
							$mdgriffith$elm_ui$Element$el,
							_List_fromArray(
								[$mdgriffith$elm_ui$Element$alignRight]),
							$mdgriffith$elm_ui$Element$text(
								A2($author$project$Internals$CommonHelpers$dateToStr, config.e0, date))),
							A2(
							$mdgriffith$elm_ui$Element$download,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$alignRight,
									$mdgriffith$elm_ui$Element$Background$color($author$project$Internals$CommonStyleHelpers$teal4),
									$mdgriffith$elm_ui$Element$mouseOver(
									_List_fromArray(
										[
											$mdgriffith$elm_ui$Element$Font$color(
											A3($mdgriffith$elm_ui$Element$rgb, 1, 1, 1))
										])),
									$mdgriffith$elm_ui$Element$pointer,
									$mdgriffith$elm_ui$Element$Border$rounded(5),
									A2($mdgriffith$elm_ui$Element$paddingXY, 7, 5)
								]),
							{
								F: $mdgriffith$elm_ui$Element$text('Télécharger'),
								da: '/baseDocumentaire/publications/bulletins/' + function (s) {
									return s + '.pdf';
								}(
									A3(
										$elm$core$String$padLeft,
										3,
										'0',
										$elm$core$String$fromInt(issue)))
							})
						])),
					(($author$project$Publications$PublicationsView$maxWidth(config) < 800) ? $mdgriffith$elm_ui$Element$column(
					_List_fromArray(
						[$mdgriffith$elm_ui$Element$centerX])) : $mdgriffith$elm_ui$Element$row(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$Background$color($author$project$Internals$CommonStyleHelpers$grey6)
						])))(
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Element$image,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$width(
									A2($mdgriffith$elm_ui$Element$maximum, 595, $mdgriffith$elm_ui$Element$fill)),
									$mdgriffith$elm_ui$Element$alignTop
								]),
							{h$: '', eT: cover}),
							A2(
							$mdgriffith$elm_ui$Element$column,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$alignTop,
									$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
									$mdgriffith$elm_ui$Element$height(
									A2($mdgriffith$elm_ui$Element$maximum, 842, $mdgriffith$elm_ui$Element$fill)),
									$mdgriffith$elm_ui$Element$scrollbarY
								]),
							_Utils_ap(
								_List_fromArray(
									[
										A2(
										$mdgriffith$elm_ui$Element$el,
										_List_fromArray(
											[
												$mdgriffith$elm_ui$Element$Font$bold,
												$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
												A2($mdgriffith$elm_ui$Element$paddingXY, 10, 5),
												$mdgriffith$elm_ui$Element$Background$color($author$project$Internals$CommonStyleHelpers$grey5)
											]),
										$mdgriffith$elm_ui$Element$text('Dans ce numéro: '))
									]),
								A2(
									$elm$core$List$indexedMap,
									$author$project$Publications$PublicationsView$indexView(issue),
									index)))
						]))
				]));
	};
	var _v0 = config.eK;
	if (!_v0.$) {
		var bulletins = _v0.a.hm;
		return A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$spacing(40),
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
				]),
			A3(
				$elm$core$Dict$foldl,
				F3(
					function (k, v, acc) {
						return A2(
							$elm$core$List$cons,
							A3($author$project$Publications$PublicationsView$yearView, k, v, bulletinView),
							acc);
					}),
				_List_Nil,
				A3(
					$elm$core$List$foldr,
					F2(
						function (k, acc) {
							return A3(
								$elm$core$Dict$update,
								A2($elm$time$Time$toYear, config.e0, k.cI),
								function (mbVal) {
									if (mbVal.$ === 1) {
										return $elm$core$Maybe$Just(
											_List_fromArray(
												[k]));
									} else {
										var xs = mbVal.a;
										return $elm$core$Maybe$Just(
											A2($elm$core$List$cons, k, xs));
									}
								},
								acc);
						}),
					$elm$core$Dict$empty,
					$elm$core$Dict$values(bulletins))));
	} else {
		return $mdgriffith$elm_ui$Element$none;
	}
};
var $author$project$Document$DocumentViews$DocumentView$renderBulletin = F3(
	function (config, id, attrs) {
		var _v0 = config.eK;
		if (_v0.$ === 1) {
			return _List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$Background$color($author$project$Internals$CommonStyleHelpers$grey6),
							A2($mdgriffith$elm_ui$Element$paddingXY, 0, 7),
							$mdgriffith$elm_ui$Element$Font$center
						]),
					$mdgriffith$elm_ui$Element$text('Bulletins municipaux'))
				]);
		} else {
			var delibs = _v0.a.hV;
			return _List_fromArray(
				[
					$author$project$Publications$PublicationsView$bulletinsView(config)
				]);
		}
	});
var $elm$html$Html$Attributes$height = function (n) {
	return A2(
		_VirtualDom_attribute,
		'height',
		$elm$core$String$fromInt(n));
};
var $elm$html$Html$iframe = _VirtualDom_node('iframe');
var $author$project$Document$DocumentViews$DocumentView$renderCalendar = F3(
	function (config, id, attrs) {
		var maxWidth = A2(
			$elm$core$Basics$min,
			A3(
				$author$project$Document$DocumentViews$StyleSheets$docMaxWidth,
				_Utils_Tuple2(config.lb, config.iu),
				config.an,
				config.dT),
			config.lb) - 40;
		return _List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$column,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$width(
						$mdgriffith$elm_ui$Element$px(maxWidth)),
						$mdgriffith$elm_ui$Element$centerX,
						$mdgriffith$elm_ui$Element$spacing(15)
					]),
				_List_fromArray(
					[
						A4($author$project$Document$DocumentViews$DocumentView$customHeading, config, 1, _List_Nil, 'Calendrier'),
						A2(
						$mdgriffith$elm_ui$Element$el,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$centerX,
								$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
								$mdgriffith$elm_ui$Element$height(
								A3($elm$core$Basics$composeL, $mdgriffith$elm_ui$Element$px, $elm$core$Basics$round, maxWidth / 1.333333))
							]),
						(maxWidth <= 500) ? $mdgriffith$elm_ui$Element$html(
							A2(
								$elm$html$Html$iframe,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$src('https://calendar.google.com/calendar/embed?showTitle=0&showTabs=0&showNav=0&showPrint=0&showCalendars=0&showTz=0&mode=AGENDA&height=150&wkst=2&hl=fr&bgcolor=%23FFFFFF&src=1claq68scg7llpg29j2fasprtk%40group.calendar.google.com&;color=%23fe3b00&;src=n1jce3hgvarkt6n3o69c6nl66g%40group.calendar.google.com&;color=%23007451&;src=r46rbonnui234n2b2glau5btoo%40group.calendar.google.com&;color=%2305f2ff&ctz=Europe%2FParis'),
										A2($elm$html$Html$Attributes$style, 'border-width', '0')
									]),
								_List_Nil)) : $mdgriffith$elm_ui$Element$html(
							A2(
								$elm$html$Html$iframe,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$src(
										'https://calendar.google.com/calendar/embed?showTitle=0&height=' + (A3($elm$core$Basics$composeL, $elm$core$String$fromInt, $elm$core$Basics$round, maxWidth / 1.333333) + '&wkst=1&;bgcolor=%23FFFFFF&src=1claq68scg7llpg29j2fasprtk%40group.calendar.google.com&;color=%23fe3b00&;src=n1jce3hgvarkt6n3o69c6nl66g%40group.calendar.google.com&;color=%23007451&;src=r46rbonnui234n2b2glau5btoo%40group.calendar.google.com&;color=%2305f2ff&ctz=Europe%2FParis')),
										$elm$html$Html$Attributes$height(
										$elm$core$Basics$round(maxWidth / 1.333333)),
										A2($elm$html$Html$Attributes$style, 'border-width', '0')
									]),
								_List_Nil)))
					]))
			]);
	});
var $author$project$Document$DocumentViews$DocumentView$renderCalendarSalleBeaune = F3(
	function (config, id, attrs) {
		var maxWidth = A2(
			$elm$core$Basics$min,
			A3(
				$author$project$Document$DocumentViews$StyleSheets$docMaxWidth,
				_Utils_Tuple2(config.lb, config.iu),
				config.an,
				config.dT),
			config.lb) - 40;
		return _List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$column,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$width(
						$mdgriffith$elm_ui$Element$px(maxWidth)),
						$mdgriffith$elm_ui$Element$centerX,
						$mdgriffith$elm_ui$Element$spacing(15)
					]),
				_List_fromArray(
					[
						A4($author$project$Document$DocumentViews$DocumentView$customHeading, config, 1, _List_Nil, 'Calendrier'),
						A2(
						$mdgriffith$elm_ui$Element$el,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$centerX,
								$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
								$mdgriffith$elm_ui$Element$height(
								A3($elm$core$Basics$composeL, $mdgriffith$elm_ui$Element$px, $elm$core$Basics$round, maxWidth / 1.333333))
							]),
						(maxWidth <= 500) ? $mdgriffith$elm_ui$Element$html(
							A2(
								$elm$html$Html$iframe,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$src('https://calendar.google.com/calendar/embed?showTitle=0&showTabs=0&showNav=0&showPrint=0&showCalendars=0&showTz=0&mode=AGENDA&height=150&wkst=2&hl=fr&bgcolor=%23FFFFFF&src=n1jce3hgvarkt6n3o69c6nl66g%40group.calendar.google.com&ctz=Europe%2FParis'),
										A2($elm$html$Html$Attributes$style, 'border-width', '0')
									]),
								_List_Nil)) : $mdgriffith$elm_ui$Element$html(
							A2(
								$elm$html$Html$iframe,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$src(
										'https://calendar.google.com/calendar/embed?showTitle=0&height=' + (A3($elm$core$Basics$composeL, $elm$core$String$fromInt, $elm$core$Basics$round, maxWidth / 1.333333) + '&wkst=1&;bgcolor=%23FFFFFF&src=n1jce3hgvarkt6n3o69c6nl66g%40group.calendar.google.com&ctz=Europe%2FParis')),
										$elm$html$Html$Attributes$height(
										$elm$core$Basics$round(maxWidth / 1.333333)),
										A2($elm$html$Html$Attributes$style, 'border-width', '0')
									]),
								_List_Nil)))
					]))
			]);
	});
var $author$project$Document$DocumentViews$DocumentView$renderCalendarSalleMurol = F3(
	function (config, id, attrs) {
		var maxWidth = A2(
			$elm$core$Basics$min,
			A3(
				$author$project$Document$DocumentViews$StyleSheets$docMaxWidth,
				_Utils_Tuple2(config.lb, config.iu),
				config.an,
				config.dT),
			config.lb) - 40;
		return _List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$column,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$width(
						$mdgriffith$elm_ui$Element$px(maxWidth)),
						$mdgriffith$elm_ui$Element$centerX,
						$mdgriffith$elm_ui$Element$spacing(15)
					]),
				_List_fromArray(
					[
						A4($author$project$Document$DocumentViews$DocumentView$customHeading, config, 1, _List_Nil, 'Calendrier'),
						A2(
						$mdgriffith$elm_ui$Element$el,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$centerX,
								$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
								$mdgriffith$elm_ui$Element$height(
								A3($elm$core$Basics$composeL, $mdgriffith$elm_ui$Element$px, $elm$core$Basics$round, maxWidth / 1.333333))
							]),
						(maxWidth <= 500) ? $mdgriffith$elm_ui$Element$html(
							A2(
								$elm$html$Html$iframe,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$src('https://calendar.google.com/calendar/embed?showTitle=0&showTabs=0&showNav=0&showPrint=0&showCalendars=0&showTz=0&mode=AGENDA&height=150&wkst=2&hl=fr&bgcolor=%23FFFFFF&src=r46rbonnui234n2b2glau5btoo%40group.calendar.google.com&ctz=Europe%2FParis'),
										A2($elm$html$Html$Attributes$style, 'border-width', '0')
									]),
								_List_Nil)) : $mdgriffith$elm_ui$Element$html(
							A2(
								$elm$html$Html$iframe,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$src(
										'https://calendar.google.com/calendar/embed?showTitle=0&height=' + (A3($elm$core$Basics$composeL, $elm$core$String$fromInt, $elm$core$Basics$round, maxWidth / 1.333333) + '&wkst=1&;bgcolor=%23FFFFFF&src=r46rbonnui234n2b2glau5btoo%40group.calendar.google.com&ctz=Europe%2FParis')),
										$elm$html$Html$Attributes$height(
										$elm$core$Basics$round(maxWidth / 1.333333)),
										A2($elm$html$Html$Attributes$style, 'border-width', '0')
									]),
								_List_Nil)))
					]))
			]);
	});
var $author$project$Document$DocumentViews$DocumentView$renderCalendarWidget = F3(
	function (config, id, attrs) {
		var device = $author$project$Document$DocumentViews$StyleSheets$getDevice(config);
		var widgetWidth = function () {
			var _v0 = device.b6;
			switch (_v0) {
				case 0:
					return $mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill);
				case 1:
					return $mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill);
				default:
					return $mdgriffith$elm_ui$Element$width(
						$mdgriffith$elm_ui$Element$px(300));
			}
		}();
		var containerWidth = $author$project$Document$DocumentViews$StyleSheets$getContainerWidth(config);
		var maxWidth = containerWidth - 40;
		return _List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$column,
				_Utils_ap(
					_List_fromArray(
						[
							widgetWidth,
							$mdgriffith$elm_ui$Element$alignTop,
							$mdgriffith$elm_ui$Element$centerX,
							$mdgriffith$elm_ui$Element$spacing(10)
						]),
					_Utils_ap(
						A2(
							$author$project$Document$DocumentViews$DocumentView$idStyle,
							$author$project$Document$DocumentViews$StyleSheets$defaultStyleSheet(config),
							id),
						A2($author$project$Document$DocumentViews$DocumentView$renderAttrs, config, attrs))),
				_List_fromArray(
					[
						A4($author$project$Document$DocumentViews$DocumentView$customHeading, config, 1, _List_Nil, 'AGENDA'),
						A2(
						$mdgriffith$elm_ui$Element$el,
						_List_fromArray(
							[$mdgriffith$elm_ui$Element$centerX]),
						$mdgriffith$elm_ui$Element$html(
							A2(
								$elm$html$Html$iframe,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$src('https://calendar.google.com/calendar/embed?showTitle=0&showTabs=0&showNav=0&showPrint=0&showCalendars=0&showTz=0&mode=AGENDA&height=150&wkst=2&hl=fr&bgcolor=%23FFFFFF&src=1claq68scg7llpg29j2fasprtk%40group.calendar.google.com&;color=%23fe3b00&;src=n1jce3hgvarkt6n3o69c6nl66g%40group.calendar.google.com&;color=%23007451&;src=r46rbonnui234n2b2glau5btoo%40group.calendar.google.com&;color=%2305f2ff&ctz=Europe%2FParis'),
										A2($elm$html$Html$Attributes$style, 'border-width', '0')
									]),
								_List_Nil)))
					]))
			]);
	});
var $author$project$Document$DocumentViews$DocumentView$renderCustomElement = F4(
	function (config, id, attrs, s) {
		return _List_fromArray(
			[
				A2(
				$elm$core$Maybe$withDefault,
				$mdgriffith$elm_ui$Element$none,
				A2($elm$core$Dict$get, s, config.hR))
			]);
	});
var $author$project$Publications$PublicationsView$topicView = F2(
	function (n, s) {
		return A2(
			$mdgriffith$elm_ui$Element$paragraph,
			_List_fromArray(
				[
					(!A2($elm$core$Basics$modBy, 2, n)) ? $mdgriffith$elm_ui$Element$Background$color($author$project$Internals$CommonStyleHelpers$grey6) : $mdgriffith$elm_ui$Element$Background$color(
					A3($mdgriffith$elm_ui$Element$rgb255, 221, 221, 221)),
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
					A2($mdgriffith$elm_ui$Element$paddingXY, 10, 5),
					$mdgriffith$elm_ui$Element$Font$size(16),
					$mdgriffith$elm_ui$Element$Font$color($author$project$Internals$CommonStyleHelpers$grey1)
				]),
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$text(s)
				]));
	});
var $author$project$Publications$PublicationsView$delibsView = function (config) {
	var delibView = function (_v2) {
		var date = _v2.cI;
		var topics = _v2.gD;
		return A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$spacing(10),
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
				]),
			_Utils_ap(
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$row,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
								$mdgriffith$elm_ui$Element$spacing(15)
							]),
						_List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Element$el,
								_List_Nil,
								$mdgriffith$elm_ui$Element$text(
									A2(
										$elm$core$String$dropLeft,
										3,
										A2($author$project$Internals$CommonHelpers$dateToStr, config.e0, date)))),
								A2(
								$mdgriffith$elm_ui$Element$newTabLink,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$alignRight,
										$mdgriffith$elm_ui$Element$Background$color($author$project$Internals$CommonStyleHelpers$teal4),
										$mdgriffith$elm_ui$Element$mouseOver(
										_List_fromArray(
											[
												$mdgriffith$elm_ui$Element$Font$color(
												A3($mdgriffith$elm_ui$Element$rgb, 1, 1, 1))
											])),
										$mdgriffith$elm_ui$Element$pointer,
										$mdgriffith$elm_ui$Element$Border$rounded(5),
										A2($mdgriffith$elm_ui$Element$paddingXY, 7, 5)
									]),
								{
									F: $mdgriffith$elm_ui$Element$text('Télécharger'),
									da: '/baseDocumentaire/publications/delibs/' + function (s) {
										return s + '.pdf';
									}(
										A3(
											$elm$core$String$replace,
											'/',
											'-',
											A2($author$project$Internals$CommonHelpers$dateToStr, config.e0, date)))
								})
							]))
					]),
				A2($elm$core$List$indexedMap, $author$project$Publications$PublicationsView$topicView, topics)));
	};
	var _v0 = config.eK;
	if (!_v0.$) {
		var delibs = _v0.a.hV;
		return A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$spacing(40),
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
				]),
			A3(
				$elm$core$Dict$foldl,
				F3(
					function (k, v, acc) {
						return A2(
							$elm$core$List$cons,
							A3($author$project$Publications$PublicationsView$yearView, k, v, delibView),
							acc);
					}),
				_List_Nil,
				A3(
					$elm$core$List$foldr,
					F2(
						function (k, acc) {
							return A3(
								$elm$core$Dict$update,
								A2($elm$time$Time$toYear, config.e0, k.cI),
								function (mbVal) {
									if (mbVal.$ === 1) {
										return $elm$core$Maybe$Just(
											_List_fromArray(
												[k]));
									} else {
										var xs = mbVal.a;
										return $elm$core$Maybe$Just(
											A2($elm$core$List$cons, k, xs));
									}
								},
								acc);
						}),
					$elm$core$Dict$empty,
					$elm$core$Dict$values(delibs))));
	} else {
		return $mdgriffith$elm_ui$Element$none;
	}
};
var $author$project$Document$DocumentViews$DocumentView$renderDelib = F3(
	function (config, id, attrs) {
		var _v0 = config.eK;
		if (_v0.$ === 1) {
			return _List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$Background$color($author$project$Internals$CommonStyleHelpers$grey6),
							A2($mdgriffith$elm_ui$Element$paddingXY, 0, 7),
							$mdgriffith$elm_ui$Element$Font$center
						]),
					$mdgriffith$elm_ui$Element$text('Délibérations'))
				]);
		} else {
			var delibs = _v0.a.hV;
			return _List_fromArray(
				[
					$author$project$Publications$PublicationsView$delibsView(config)
				]);
		}
	});
var $author$project$Internals$CommonStyleHelpers$teal3 = A3($mdgriffith$elm_ui$Element$rgb255, 42, 145, 135);
var $author$project$Document$DocumentViews$DocumentView$renderDronePanorama = F3(
	function (config, id, attrs) {
		var device = $author$project$Document$DocumentViews$StyleSheets$getDevice(config);
		var widgetWidth = function () {
			var _v0 = device.b6;
			switch (_v0) {
				case 0:
					return $mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill);
				case 1:
					return $mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill);
				default:
					return $mdgriffith$elm_ui$Element$width(
						$mdgriffith$elm_ui$Element$px(300));
			}
		}();
		var containerWidth = $author$project$Document$DocumentViews$StyleSheets$getContainerWidth(config);
		var maxWidth = containerWidth - 40;
		return _List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$column,
				_Utils_ap(
					_List_fromArray(
						[
							widgetWidth,
							$mdgriffith$elm_ui$Element$alignTop,
							$mdgriffith$elm_ui$Element$centerX,
							$mdgriffith$elm_ui$Element$spacing(10)
						]),
					_Utils_ap(
						A2(
							$author$project$Document$DocumentViews$DocumentView$idStyle,
							$author$project$Document$DocumentViews$StyleSheets$defaultStyleSheet(config),
							id),
						A2($author$project$Document$DocumentViews$DocumentView$renderAttrs, config, attrs))),
				_List_fromArray(
					[
						A4($author$project$Document$DocumentViews$DocumentView$customHeading, config, 1, _List_Nil, 'VISITE VIRTUELLE AERIENNE'),
						A2(
						$mdgriffith$elm_ui$Element$column,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$Background$color(
								A3($mdgriffith$elm_ui$Element$rgb255, 169, 169, 169)),
								$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
								$mdgriffith$elm_ui$Element$padding(15),
								$mdgriffith$elm_ui$Element$spacing(15)
							]),
						_List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Element$newTabLink,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
										$mdgriffith$elm_ui$Element$centerX
									]),
								{
									F: A2(
										$mdgriffith$elm_ui$Element$el,
										_List_fromArray(
											[
												$mdgriffith$elm_ui$Element$width(
												$mdgriffith$elm_ui$Element$px(200)),
												$mdgriffith$elm_ui$Element$height(
												$mdgriffith$elm_ui$Element$px(160)),
												$mdgriffith$elm_ui$Element$Background$image('assets/images/misc/visiteVirt.jpg'),
												$mdgriffith$elm_ui$Element$Border$width(5),
												$mdgriffith$elm_ui$Element$Border$color(
												A3($mdgriffith$elm_ui$Element$rgb, 1, 1, 1))
											]),
										$mdgriffith$elm_ui$Element$none),
									da: 'visite/visite-virtuelle-aerienne-murol.html'
								}),
								A2(
								$mdgriffith$elm_ui$Element$row,
								_List_fromArray(
									[$mdgriffith$elm_ui$Element$centerX]),
								_List_fromArray(
									[
										A2(
										$mdgriffith$elm_ui$Element$el,
										_List_Nil,
										$mdgriffith$elm_ui$Element$text('Réalisée par la société ')),
										A2(
										$mdgriffith$elm_ui$Element$newTabLink,
										_List_fromArray(
											[
												$mdgriffith$elm_ui$Element$Font$color($author$project$Internals$CommonStyleHelpers$teal3)
											]),
										{
											F: $mdgriffith$elm_ui$Element$text('W3D\'s'),
											da: 'https://www.w3ds.fr/'
										})
									]))
							]))
					]))
			]);
	});
var $author$project$Document$DocumentViews$DocumentView$renderEmptyCell = F3(
	function (config, id, attrs) {
		var styleSheet = $author$project$Document$DocumentViews$StyleSheets$defaultStyleSheet(config);
		return _List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$row,
				_Utils_ap(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$height(
							$mdgriffith$elm_ui$Element$px(100)),
							$mdgriffith$elm_ui$Element$Background$color(
							A4($mdgriffith$elm_ui$Element$rgba, 0, 0, 1, 0.2))
						]),
					_Utils_ap(
						A2($author$project$Document$DocumentViews$DocumentView$idStyle, styleSheet, id),
						A2($author$project$Document$DocumentViews$DocumentView$renderAttrs, config, attrs))),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$el,
						_List_fromArray(
							[$mdgriffith$elm_ui$Element$centerX, $mdgriffith$elm_ui$Element$centerY]),
						$mdgriffith$elm_ui$Element$text('Cellule vide'))
					]))
			]);
	});
var $author$project$GeneralDirectoryEditor$FichePreview$subBlockStyle = _List_fromArray(
	[
		$mdgriffith$elm_ui$Element$padding(10),
		$mdgriffith$elm_ui$Element$Background$color($author$project$Internals$CommonStyleHelpers$grey7),
		$mdgriffith$elm_ui$Element$Border$rounded(5),
		$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
	]);
var $author$project$GeneralDirectoryEditor$FichePreview$activView = function (_v0) {
	var natureActiv = _v0.je;
	return A2(
		$mdgriffith$elm_ui$Element$paragraph,
		_Utils_ap(
			$author$project$GeneralDirectoryEditor$FichePreview$subBlockStyle,
			_List_fromArray(
				[$mdgriffith$elm_ui$Element$Font$bold, $mdgriffith$elm_ui$Element$Font$center])),
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$text(
				A2($elm$core$String$join, ', ', natureActiv))
			]));
};
var $author$project$GeneralDirectoryEditor$FichePreview$telPreview = function (tel) {
	return A2(
		$mdgriffith$elm_ui$Element$column,
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$spacing(10)
			]),
		function () {
			switch (tel.$) {
				case 0:
					var s = tel.a;
					return (s === '') ? _List_Nil : _List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Element$paragraph,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Element$el,
									_List_fromArray(
										[$mdgriffith$elm_ui$Element$Font$bold]),
									$mdgriffith$elm_ui$Element$text('Tel. fixe: ')),
									A2(
									$mdgriffith$elm_ui$Element$el,
									_List_Nil,
									$mdgriffith$elm_ui$Element$text(s))
								]))
						]);
				case 1:
					var s = tel.a;
					return (s === '') ? _List_Nil : _List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Element$paragraph,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Element$el,
									_List_fromArray(
										[$mdgriffith$elm_ui$Element$Font$bold]),
									$mdgriffith$elm_ui$Element$text('Tel. portable: ')),
									A2(
									$mdgriffith$elm_ui$Element$el,
									_List_Nil,
									$mdgriffith$elm_ui$Element$text(s))
								]))
						]);
				default:
					var _v1 = tel.a;
					var s1 = _v1.a;
					var s2 = _v1.b;
					return _List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Element$paragraph,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Element$el,
									_List_fromArray(
										[$mdgriffith$elm_ui$Element$Font$bold]),
									$mdgriffith$elm_ui$Element$text('Tel. fixe: ')),
									A2(
									$mdgriffith$elm_ui$Element$el,
									_List_Nil,
									$mdgriffith$elm_ui$Element$text(s1))
								])),
							A2(
							$mdgriffith$elm_ui$Element$paragraph,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Element$el,
									_List_fromArray(
										[$mdgriffith$elm_ui$Element$Font$bold]),
									$mdgriffith$elm_ui$Element$text('Tel. portable: ')),
									A2(
									$mdgriffith$elm_ui$Element$el,
									_List_Nil,
									$mdgriffith$elm_ui$Element$text(s2))
								]))
						]);
			}
		}());
};
var $author$project$GeneralDirectoryEditor$FichePreview$responsablesView = function (responsables) {
	var respView = function (_v1) {
		var nom = _v1.jp;
		var poste = _v1.jM;
		var tel = _v1.kJ;
		return A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$spacing(7),
					$mdgriffith$elm_ui$Element$padding(5),
					$mdgriffith$elm_ui$Element$Background$color($author$project$Internals$CommonStyleHelpers$grey6)
				]),
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$paragraph,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Element$el,
							_List_Nil,
							$mdgriffith$elm_ui$Element$text(poste)),
							(poste === '') ? $mdgriffith$elm_ui$Element$none : $mdgriffith$elm_ui$Element$text(', '),
							A2(
							$mdgriffith$elm_ui$Element$el,
							_List_Nil,
							$mdgriffith$elm_ui$Element$text(nom))
						])),
					$author$project$GeneralDirectoryEditor$FichePreview$telPreview(tel)
				]));
	};
	if (!responsables.b) {
		return $mdgriffith$elm_ui$Element$none;
	} else {
		if (!responsables.b.b) {
			var resp = responsables.a;
			return A2(
				$mdgriffith$elm_ui$Element$column,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$spacing(10)
					]),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$el,
						_List_fromArray(
							[$mdgriffith$elm_ui$Element$Font$bold]),
						$mdgriffith$elm_ui$Element$text('Responsable:')),
						respView(resp)
					]));
		} else {
			var resps = responsables;
			return A2(
				$mdgriffith$elm_ui$Element$column,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$spacing(10)
					]),
				_Utils_ap(
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Element$el,
							_List_fromArray(
								[$mdgriffith$elm_ui$Element$Font$bold]),
							$mdgriffith$elm_ui$Element$text('Responsables:'))
						]),
					A2($elm$core$List$map, respView, resps)));
		}
	}
};
var $author$project$GeneralDirectoryEditor$FichePreview$contactView = function (_v0) {
	var adresse = _v0.gW;
	var telNumber = _v0.kK;
	var fax = _v0.ic;
	var email = _v0.h3;
	var site = _v0.kn;
	var responsables = _v0.jX;
	return A2(
		$mdgriffith$elm_ui$Element$column,
		_Utils_ap(
			$author$project$GeneralDirectoryEditor$FichePreview$subBlockStyle,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$spacing(10)
				])),
		_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$paragraph,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$spacing(5)
					]),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$el,
						_List_fromArray(
							[$mdgriffith$elm_ui$Element$Font$bold]),
						$mdgriffith$elm_ui$Element$text('Adresse: ')),
						A2(
						$mdgriffith$elm_ui$Element$el,
						_List_Nil,
						$mdgriffith$elm_ui$Element$text(adresse))
					])),
				A2(
				$elm$core$Maybe$withDefault,
				$mdgriffith$elm_ui$Element$none,
				A2($elm$core$Maybe$map, $author$project$GeneralDirectoryEditor$FichePreview$telPreview, telNumber)),
				A2(
				$elm$core$Maybe$withDefault,
				$mdgriffith$elm_ui$Element$none,
				A2(
					$elm$core$Maybe$map,
					function (f) {
						return A2(
							$mdgriffith$elm_ui$Element$row,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$spacing(5)
								]),
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Element$el,
									_List_fromArray(
										[$mdgriffith$elm_ui$Element$Font$bold]),
									$mdgriffith$elm_ui$Element$text('Fax:')),
									$mdgriffith$elm_ui$Element$text(f)
								]));
					},
					fax)),
				function () {
				if (!email.b) {
					return $mdgriffith$elm_ui$Element$none;
				} else {
					if (!email.b.b) {
						var mail = email.a;
						return A2(
							$mdgriffith$elm_ui$Element$row,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$spacing(5)
								]),
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Element$el,
									_List_fromArray(
										[$mdgriffith$elm_ui$Element$Font$bold]),
									$mdgriffith$elm_ui$Element$text('Email:')),
									$mdgriffith$elm_ui$Element$text(mail)
								]));
					} else {
						var emails = email;
						return A2(
							$mdgriffith$elm_ui$Element$paragraph,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Element$el,
									_List_fromArray(
										[$mdgriffith$elm_ui$Element$Font$bold]),
									$mdgriffith$elm_ui$Element$text('Emails: ')),
									A2(
									$mdgriffith$elm_ui$Element$el,
									_List_Nil,
									$mdgriffith$elm_ui$Element$text(
										A2($elm$core$String$join, ', ', emails)))
								]));
					}
				}
			}(),
				A2(
				$elm$core$Maybe$withDefault,
				$mdgriffith$elm_ui$Element$none,
				A2(
					$elm$core$Maybe$map,
					function (_v2) {
						var siteName = _v2.a;
						var siteUrl = _v2.b;
						return A2(
							$mdgriffith$elm_ui$Element$paragraph,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Element$el,
									_List_fromArray(
										[$mdgriffith$elm_ui$Element$Font$bold]),
									$mdgriffith$elm_ui$Element$text('Site: ')),
									A2(
									$mdgriffith$elm_ui$Element$newTabLink,
									_List_fromArray(
										[
											$mdgriffith$elm_ui$Element$Font$color($author$project$Internals$CommonStyleHelpers$teal4)
										]),
									{
										F: $mdgriffith$elm_ui$Element$text(siteName),
										da: siteUrl
									})
								]));
					},
					site)),
				$author$project$GeneralDirectoryEditor$FichePreview$responsablesView(responsables)
			]));
};
var $author$project$GeneralDirectoryEditor$FichePreview$descriptionView = function (_v0) {
	var description = _v0.h$;
	var ouverture = _v0.jD;
	var _v1 = function () {
		if ((!ouverture.$) && (!ouverture.a)) {
			var _v3 = ouverture.a;
			return _Utils_Tuple2(
				true,
				A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[$mdgriffith$elm_ui$Element$Font$bold]),
					$mdgriffith$elm_ui$Element$text('Ouverture saisonniere')));
		} else {
			return _Utils_Tuple2(false, $mdgriffith$elm_ui$Element$none);
		}
	}();
	var displayOuv = _v1.a;
	var ouvertureView = _v1.b;
	if (!description.b) {
		return displayOuv ? A2(
			$mdgriffith$elm_ui$Element$column,
			$author$project$GeneralDirectoryEditor$FichePreview$subBlockStyle,
			_List_fromArray(
				[ouvertureView])) : $mdgriffith$elm_ui$Element$none;
	} else {
		var descr = description;
		var descrView = function (d) {
			return A2(
				$mdgriffith$elm_ui$Element$paragraph,
				_List_fromArray(
					[$mdgriffith$elm_ui$Element$Font$italic]),
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$text(
						$elm_community$string_extra$String$Extra$toSentenceCase(d))
					]));
		};
		return A2(
			$mdgriffith$elm_ui$Element$column,
			_Utils_ap(
				$author$project$GeneralDirectoryEditor$FichePreview$subBlockStyle,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
						$mdgriffith$elm_ui$Element$spacing(10)
					])),
			_Utils_ap(
				A2($elm$core$List$map, descrView, descr),
				_List_fromArray(
					[ouvertureView])));
	}
};
var $mdgriffith$elm_ui$Element$Background$uncropped = function (src) {
	return $mdgriffith$elm_ui$Internal$Model$Attr(
		A2($elm$virtual_dom$VirtualDom$style, 'background', 'url(\"' + (src + '\") center / contain no-repeat')));
};
var $author$project$GeneralDirectoryEditor$FichePreview$linkedDocsView = F2(
	function (currentTime, _v0) {
		var linkedDocs = _v0.iZ;
		if (!linkedDocs.b) {
			return $mdgriffith$elm_ui$Element$none;
		} else {
			var ldocs = linkedDocs;
			var ldView = function (_v3) {
				var url = _v3.da;
				var label = _v3.F;
				var descr = _v3.hZ;
				var expiryDate = _v3.h7;
				var resView = A2(
					$mdgriffith$elm_ui$Element$column,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$spacing(7),
							$mdgriffith$elm_ui$Element$Border$widthEach(
							{aR: 1, aU: 0, a0: 0, a1: 0}),
							$mdgriffith$elm_ui$Element$Border$color($author$project$Internals$CommonStyleHelpers$grey6),
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							A2($mdgriffith$elm_ui$Element$paddingXY, 0, 5)
						]),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Element$newTabLink,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$Font$color($author$project$Internals$CommonStyleHelpers$teal4)
								]),
							{
								F: A2(
									$mdgriffith$elm_ui$Element$row,
									_List_fromArray(
										[
											$mdgriffith$elm_ui$Element$spacing(5)
										]),
									_List_fromArray(
										[
											A2(
											$mdgriffith$elm_ui$Element$el,
											_List_fromArray(
												[
													$mdgriffith$elm_ui$Element$width(
													$mdgriffith$elm_ui$Element$px(16)),
													$mdgriffith$elm_ui$Element$height(
													$mdgriffith$elm_ui$Element$px(16)),
													$mdgriffith$elm_ui$Element$Background$uncropped('/assets/images/pdf.svg')
												]),
											$mdgriffith$elm_ui$Element$none),
											$mdgriffith$elm_ui$Element$text(label)
										])),
								da: url
							}),
							A2(
							$elm$core$Maybe$withDefault,
							$mdgriffith$elm_ui$Element$none,
							A2(
								$elm$core$Maybe$map,
								function (d) {
									return A2(
										$mdgriffith$elm_ui$Element$paragraph,
										_List_fromArray(
											[
												$mdgriffith$elm_ui$Element$Font$size(14)
											]),
										_List_fromArray(
											[
												$mdgriffith$elm_ui$Element$text(d)
											]));
								},
								descr))
						]));
				if (expiryDate.$ === 1) {
					return resView;
				} else {
					var ed = expiryDate.a;
					return (_Utils_cmp(
						$elm$time$Time$posixToMillis(ed),
						$elm$time$Time$posixToMillis(currentTime)) < 0) ? $mdgriffith$elm_ui$Element$none : resView;
				}
			};
			return A2(
				$mdgriffith$elm_ui$Element$column,
				_Utils_ap(
					$author$project$GeneralDirectoryEditor$FichePreview$subBlockStyle,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$spacing(10)
						])),
				_Utils_ap(
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Element$row,
							_List_fromArray(
								[$mdgriffith$elm_ui$Element$Font$bold]),
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Element$el,
									_List_Nil,
									$mdgriffith$elm_ui$Element$text('EN SAVOIR PLUS'))
								]))
						]),
					A2($elm$core$List$map, ldView, ldocs)));
		}
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$html$Html$img = _VirtualDom_node('img');
var $elm$core$List$sort = function (xs) {
	return A2($elm$core$List$sortBy, $elm$core$Basics$identity, xs);
};
var $mdgriffith$elm_ui$Internal$Flag$bgGradient = $mdgriffith$elm_ui$Internal$Flag$flag(10);
var $mdgriffith$elm_ui$Element$Background$gradient = function (_v0) {
	var angle = _v0.g5;
	var steps = _v0.ky;
	if (!steps.b) {
		return $mdgriffith$elm_ui$Internal$Model$NoAttribute;
	} else {
		if (!steps.b.b) {
			var clr = steps.a;
			return A2(
				$mdgriffith$elm_ui$Internal$Model$StyleClass,
				$mdgriffith$elm_ui$Internal$Flag$bgColor,
				A3(
					$mdgriffith$elm_ui$Internal$Model$Colored,
					'bg-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(clr),
					'background-color',
					clr));
		} else {
			return A2(
				$mdgriffith$elm_ui$Internal$Model$StyleClass,
				$mdgriffith$elm_ui$Internal$Flag$bgGradient,
				A3(
					$mdgriffith$elm_ui$Internal$Model$Single,
					'bg-grad-' + A2(
						$elm$core$String$join,
						'-',
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Internal$Model$floatClass(angle),
							A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$formatColorClass, steps))),
					'background-image',
					'linear-gradient(' + (A2(
						$elm$core$String$join,
						', ',
						A2(
							$elm$core$List$cons,
							$elm$core$String$fromFloat(angle) + 'rad',
							A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$formatColor, steps))) + ')')));
		}
	}
};
var $mdgriffith$elm_ui$Internal$Model$formatTextShadow = function (shadow) {
	return A2(
		$elm$core$String$join,
		' ',
		_List_fromArray(
			[
				$elm$core$String$fromFloat(shadow.js.a) + 'px',
				$elm$core$String$fromFloat(shadow.js.b) + 'px',
				$elm$core$String$fromFloat(shadow.hf) + 'px',
				$mdgriffith$elm_ui$Internal$Model$formatColor(shadow.hB)
			]));
};
var $mdgriffith$elm_ui$Internal$Model$textShadowName = function (shadow) {
	return $elm$core$String$concat(
		_List_fromArray(
			[
				'txt',
				$elm$core$String$fromFloat(shadow.js.a) + 'px',
				$elm$core$String$fromFloat(shadow.js.b) + 'px',
				$elm$core$String$fromFloat(shadow.hf) + 'px',
				$mdgriffith$elm_ui$Internal$Model$formatColorClass(shadow.hB)
			]));
};
var $mdgriffith$elm_ui$Internal$Flag$txtShadows = $mdgriffith$elm_ui$Internal$Flag$flag(18);
var $mdgriffith$elm_ui$Element$Font$shadow = function (shade) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$txtShadows,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Single,
			$mdgriffith$elm_ui$Internal$Model$textShadowName(shade),
			'text-shadow',
			$mdgriffith$elm_ui$Internal$Model$formatTextShadow(shade)));
};
var $author$project$GeneralDirectoryEditor$FichePreview$starsView = function (n) {
	return A2(
		$mdgriffith$elm_ui$Element$column,
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$width(
				$mdgriffith$elm_ui$Element$px(80)),
				$mdgriffith$elm_ui$Element$height(
				$mdgriffith$elm_ui$Element$px(50)),
				$mdgriffith$elm_ui$Element$Background$gradient(
				{
					g5: 0,
					ky: _List_fromArray(
						[
							A3($mdgriffith$elm_ui$Element$rgb255, 85, 112, 83),
							A3($mdgriffith$elm_ui$Element$rgb255, 143, 188, 139),
							A3($mdgriffith$elm_ui$Element$rgb255, 85, 112, 83)
						])
				})
			]),
		_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$alignTop,
						$mdgriffith$elm_ui$Element$paddingEach(
						{aR: 0, aU: 0, a0: 0, a1: 5}),
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
						$mdgriffith$elm_ui$Element$Font$center,
						$mdgriffith$elm_ui$Element$Font$size(12),
						$mdgriffith$elm_ui$Element$Font$color(
						A3($mdgriffith$elm_ui$Element$rgb255, 255, 255, 255))
					]),
				$mdgriffith$elm_ui$Element$text('Classement')),
				A2(
				$mdgriffith$elm_ui$Element$column,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
					]),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$el,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
								$mdgriffith$elm_ui$Element$centerY,
								$mdgriffith$elm_ui$Element$Font$center,
								$mdgriffith$elm_ui$Element$Font$size(18),
								$mdgriffith$elm_ui$Element$Font$color(
								A3($mdgriffith$elm_ui$Element$rgb255, 255, 215, 0)),
								$mdgriffith$elm_ui$Element$Font$shadow(
								{
									hf: 1,
									hB: A3($mdgriffith$elm_ui$Element$rgb255, 25, 21, 0),
									js: _Utils_Tuple2(1, 0)
								})
							]),
						$mdgriffith$elm_ui$Element$text(
							A2($elm$core$String$repeat, n, '🟊')))
					]))
			]));
};
var $author$project$GeneralDirectoryEditor$FichePreview$refView = F2(
	function (maxWidth, _v0) {
		var refOt = _v0.jS;
		var label = _v0.F;
		var rank = _v0.jP;
		var toImage = function (_v8) {
			var lien = _v8.iX;
			var logo = _v8.i$;
			return {iu: logo.iu, cR: lien, da: logo.da, lb: logo.lb};
		};
		var refOtView = function () {
			if (!refOt.$) {
				var _v7 = refOt.a;
				var ref = _v7.a;
				var link = _v7.b;
				return A2(
					$mdgriffith$elm_ui$Element$wrappedRow,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$spacing(5)
						]),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Element$el,
							_List_fromArray(
								[$mdgriffith$elm_ui$Element$Font$bold]),
							$mdgriffith$elm_ui$Element$text('Référence office de tourisme:  ')),
							A2(
							$mdgriffith$elm_ui$Element$newTabLink,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$Font$color($author$project$Internals$CommonStyleHelpers$teal4)
								]),
							{
								F: $mdgriffith$elm_ui$Element$text(
									$elm$core$String$fromInt(ref)),
								da: link
							})
						]));
			} else {
				return $mdgriffith$elm_ui$Element$none;
			}
		}();
		var _v1 = function () {
			var _v2 = rank.kt;
			if (!_v2.$) {
				var n = _v2.a;
				return _Utils_Tuple2(
					_List_fromArray(
						[
							{iu: 50, cR: 'https://etoiles-de-france.fr/', da: 'stars', lb: 80}
						]),
					n);
			} else {
				return _Utils_Tuple2(_List_Nil, 0);
			}
		}();
		var stars = _v1.a;
		var nbrStars = _v1.b;
		var images = _Utils_ap(
			stars,
			A2($elm$core$List$map, toImage, label));
		var minHeight = A2(
			$elm$core$Maybe$withDefault,
			0,
			A2(
				$elm$core$Maybe$map,
				$elm$core$Basics$min(50),
				$elm$core$List$head(
					$elm$core$List$sort(
						A2(
							$elm$core$List$map,
							function ($) {
								return $.iu;
							},
							images)))));
		var imgsScaledToMinHeight = function () {
			var scale = function (_v5) {
				var url = _v5.da;
				var width = _v5.lb;
				var height = _v5.iu;
				var link = _v5.cR;
				return {iu: minHeight + 5, cR: link, da: url, lb: (minHeight * width) / height};
			};
			return A2($elm$core$List$map, scale, images);
		}();
		var totalImgWidth = A3(
			$elm$core$List$foldr,
			F2(
				function (i, n) {
					return i.lb + n;
				}),
			0,
			imgsScaledToMinHeight);
		var logoView = function (_v4) {
			var url = _v4.da;
			var width = _v4.lb;
			var height = _v4.iu;
			var link = _v4.cR;
			return A2(
				$mdgriffith$elm_ui$Element$newTabLink,
				_List_fromArray(
					[
						(_Utils_cmp(totalImgWidth, maxWidth) < 0) ? $mdgriffith$elm_ui$Element$width(
						$mdgriffith$elm_ui$Element$px(
							$elm$core$Basics$round(width))) : $mdgriffith$elm_ui$Element$width(
						$mdgriffith$elm_ui$Element$fillPortion(
							$elm$core$Basics$floor((10000 * width) / totalImgWidth)))
					]),
				{
					F: (url === 'stars') ? $author$project$GeneralDirectoryEditor$FichePreview$starsView(nbrStars) : $mdgriffith$elm_ui$Element$html(
						A2(
							$elm$html$Html$img,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'width', '100%'),
									A2($elm$html$Html$Attributes$style, 'height', 'auto'),
									$elm$html$Html$Attributes$src(url)
								]),
							_List_Nil)),
					da: link
				});
		};
		var logosView = function () {
			if (!images.b) {
				return $mdgriffith$elm_ui$Element$none;
			} else {
				return A2(
					$mdgriffith$elm_ui$Element$row,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$spacing(10),
							$mdgriffith$elm_ui$Element$clip
						]),
					A2($elm$core$List$map, logoView, imgsScaledToMinHeight));
			}
		}();
		return (_Utils_eq(refOt, $elm$core$Maybe$Nothing) && _Utils_eq(images, _List_Nil)) ? $mdgriffith$elm_ui$Element$none : A2(
			$mdgriffith$elm_ui$Element$column,
			_Utils_ap(
				$author$project$GeneralDirectoryEditor$FichePreview$subBlockStyle,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
						$mdgriffith$elm_ui$Element$spacing(10)
					])),
			_List_fromArray(
				[refOtView, logosView]));
	});
var $author$project$GeneralDirectoryEditor$FichePreview$visualPreview = F3(
	function (handler, maxWidth, _v0) {
		var uuid = _v0.d1;
		var nomEntite = _v0.jq;
		var visuel = _v0.k9;
		var w = $elm$core$Basics$round(maxWidth);
		var h = $elm$core$Basics$round(maxWidth / 1.333333333);
		return A2(
			$mdgriffith$elm_ui$Element$el,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width(
					$mdgriffith$elm_ui$Element$px(w)),
					$mdgriffith$elm_ui$Element$height(
					$mdgriffith$elm_ui$Element$px(h)),
					$mdgriffith$elm_ui$Element$Background$color($author$project$Internals$CommonStyleHelpers$blockLinkGrey),
					$mdgriffith$elm_ui$Element$mouseOver(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							$author$project$Internals$CommonStyleHelpers$blockLinkGreyAlpha(0.5))
						])),
					$mdgriffith$elm_ui$Element$Events$onClick(
					handler(
						$TSFoster$elm_uuid$UUID$canonical(uuid))),
					$mdgriffith$elm_ui$Element$pointer
				]),
			A2(
				$mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$width(
						$mdgriffith$elm_ui$Element$px(w - 12)),
						$mdgriffith$elm_ui$Element$height(
						$mdgriffith$elm_ui$Element$px(h - 12)),
						$mdgriffith$elm_ui$Element$centerX,
						$mdgriffith$elm_ui$Element$centerY,
						$mdgriffith$elm_ui$Element$Background$image(visuel),
						$mdgriffith$elm_ui$Element$inFront(
						A2(
							$mdgriffith$elm_ui$Element$el,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$alignBottom,
									$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
									$mdgriffith$elm_ui$Element$padding(10),
									$mdgriffith$elm_ui$Element$Background$color(
									$author$project$Internals$CommonStyleHelpers$blockLinkGreyAlpha(0.8)),
									$mdgriffith$elm_ui$Element$Font$color($author$project$Internals$CommonStyleHelpers$aliceBlue)
								]),
							A2(
								$mdgriffith$elm_ui$Element$el,
								_Utils_ap(
									_List_fromArray(
										[
											$mdgriffith$elm_ui$Element$Font$center,
											$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
										]),
									$author$project$Internals$CommonStyleHelpers$unselectable),
								A2(
									$mdgriffith$elm_ui$Element$paragraph,
									_List_Nil,
									_List_fromArray(
										[
											$mdgriffith$elm_ui$Element$text(nomEntite)
										])))))
					]),
				$mdgriffith$elm_ui$Element$none));
	});
var $author$project$GeneralDirectoryEditor$FichePreview$wrapperStyle = _List_fromArray(
	[
		$mdgriffith$elm_ui$Element$padding(10),
		$mdgriffith$elm_ui$Element$Background$color($author$project$Internals$CommonStyleHelpers$grey6),
		$mdgriffith$elm_ui$Element$Border$rounded(5),
		$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
	]);
var $author$project$GeneralDirectoryEditor$FichePreview$ficheView = F5(
	function (handler, currentTime, maxWidth, isOpen, fiche) {
		return A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width(
					$mdgriffith$elm_ui$Element$px(
						$elm$core$Basics$round(maxWidth))),
					$mdgriffith$elm_ui$Element$clip
				]),
			_List_fromArray(
				[
					A3($author$project$GeneralDirectoryEditor$FichePreview$visualPreview, handler, maxWidth, fiche),
					isOpen ? A2(
					$mdgriffith$elm_ui$Element$column,
					_Utils_ap(
						$author$project$GeneralDirectoryEditor$FichePreview$wrapperStyle,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$spacing(10)
							])),
					_List_fromArray(
						[
							$author$project$GeneralDirectoryEditor$FichePreview$activView(fiche),
							A2($author$project$GeneralDirectoryEditor$FichePreview$refView, maxWidth, fiche),
							$author$project$GeneralDirectoryEditor$FichePreview$contactView(fiche),
							$author$project$GeneralDirectoryEditor$FichePreview$descriptionView(fiche),
							A2($author$project$GeneralDirectoryEditor$FichePreview$linkedDocsView, currentTime, fiche)
						])) : $mdgriffith$elm_ui$Element$none
				]));
	});
var $author$project$Document$DocumentViews$DocumentView$renderFiches = F4(
	function (config, id, attrs, fichesId) {
		var styleSheet = $author$project$Document$DocumentViews$StyleSheets$defaultStyleSheet(config);
		var nbrCols = A5($author$project$Document$DocumentViews$StyleSheets$chunkBy, config, 1, 2, 2, 2);
		var mw = function () {
			switch (nbrCols) {
				case 3:
					return 300;
				case 2:
					return 440;
				default:
					return 440;
			}
		}();
		var fiches = A2(
			$elm$core$List$filterMap,
			function (fId) {
				return A2($elm$core$Dict$get, fId, config.ie);
			},
			fichesId);
		var containerWidth = $author$project$Document$DocumentViews$StyleSheets$getContainerWidth(config);
		var maxWidth = function () {
			var spacing = 10;
			var padding = 40;
			return A2($elm$core$Basics$min, ((containerWidth - padding) - ((nbrCols - 1) * padding)) / nbrCols, mw);
		}();
		var ficheView_ = function (f) {
			return A5(
				$author$project$GeneralDirectoryEditor$FichePreview$ficheView,
				config.jz,
				config.hO,
				maxWidth,
				config.an || A2(
					$elm$core$Set$member,
					$TSFoster$elm_uuid$UUID$canonical(f.d1),
					config.jB),
				f);
		};
		var cols = A2(
			$elm$core$List$map,
			$mdgriffith$elm_ui$Element$column(
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$alignTop,
						$mdgriffith$elm_ui$Element$spacing(10)
					])),
			A2(
				$author$project$Internals$CommonHelpers$chunks,
				$elm$core$Basics$ceiling(
					$elm$core$List$length(fiches) / nbrCols),
				A2(
					$elm$core$List$map,
					ficheView_,
					A2(
						$elm$core$List$sortBy,
						function ($) {
							return $.jq;
						},
						fiches))));
		return _List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$row,
				_Utils_ap(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$centerX,
							$mdgriffith$elm_ui$Element$spacing(10)
						]),
					_Utils_ap(
						A2($author$project$Document$DocumentViews$DocumentView$idStyle, styleSheet, id),
						A2($author$project$Document$DocumentViews$DocumentView$renderAttrs, config, attrs))),
				cols)
			]);
	});
var $elm_community$string_extra$String$Extra$replaceSlice = F4(
	function (substitution, start, end, string) {
		return _Utils_ap(
			A3($elm$core$String$slice, 0, start, string),
			_Utils_ap(
				substitution,
				A3(
					$elm$core$String$slice,
					end,
					$elm$core$String$length(string),
					string)));
	});
var $elm_community$string_extra$String$Extra$insertAt = F3(
	function (insert, pos, string) {
		return A4($elm_community$string_extra$String$Extra$replaceSlice, insert, pos, pos, string);
	});
var $author$project$Internals$CommonHelpers$hdSrc = function (s) {
	var _v0 = $elm$core$List$reverse(
		A2($elm$core$String$indexes, '/', s));
	if (!_v0.b) {
		return s;
	} else {
		var n = _v0.a;
		return A3($elm_community$string_extra$String$Extra$insertAt, '/HQ', n, s);
	}
};
var $author$project$Gallery$Gallery$captionRow = F2(
	function (config, model) {
		var w = $author$project$Gallery$Gallery$maxWidth(config);
		var _v0 = $author$project$Internals$Streams$current(model.X);
		if (((_v0.b && _v0.b.b) && _v0.b.b.b) && (!_v0.b.b.b.b)) {
			var l = _v0.a;
			var _v1 = _v0.b;
			var c = _v1.a;
			var _v2 = _v1.b;
			var r = _v2.a;
			return A2(
				$mdgriffith$elm_ui$Element$row,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$width(
						A2($mdgriffith$elm_ui$Element$maximum, w, $mdgriffith$elm_ui$Element$fill)),
						$mdgriffith$elm_ui$Element$padding(15),
						$mdgriffith$elm_ui$Element$spacing(20),
						$mdgriffith$elm_ui$Element$height(
						A2($mdgriffith$elm_ui$Element$minimum, 20, $mdgriffith$elm_ui$Element$fill))
					]),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$paragraph,
						_List_Nil,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$text(
								A2($elm$core$Maybe$withDefault, ' ', c.fb))
							])),
						function () {
						var _v3 = _Utils_Tuple2(c.eT, model.eu);
						if ((!_v3.a.$) && _v3.b) {
							var src = _v3.a.a;
							return A2(
								$mdgriffith$elm_ui$Element$download,
								_Utils_ap(
									_List_fromArray(
										[$mdgriffith$elm_ui$Element$alignRight]),
									$author$project$Internals$CommonStyleHelpers$buttonStyle(true)),
								{
									F: A2(
										$mdgriffith$elm_ui$Element$el,
										_List_fromArray(
											[
												$mdgriffith$elm_ui$Element$Font$color(
												A3($mdgriffith$elm_ui$Element$rgb, 0, 0, 1)),
												$mdgriffith$elm_ui$Element$Font$underline
											]),
										$mdgriffith$elm_ui$Element$text('Télécharger version HD')),
									da: $author$project$Internals$CommonHelpers$hdSrc(src)
								});
						} else {
							return $mdgriffith$elm_ui$Element$none;
						}
					}(),
						A2(
						$mdgriffith$elm_ui$Element$el,
						_List_fromArray(
							[$mdgriffith$elm_ui$Element$alignRight]),
						$mdgriffith$elm_ui$Element$text(
							A3(
								$elm$core$String$padLeft,
								2,
								'0',
								$elm$core$String$fromInt(1 + model.X.iL)) + ('/' + A3(
								$elm$core$String$padLeft,
								2,
								'0',
								$elm$core$String$fromInt(model.X.eS)))))
					]));
		} else {
			return $mdgriffith$elm_ui$Element$none;
		}
	});
var $author$project$Gallery$Gallery$Next = {$: 2};
var $author$project$Gallery$Gallery$Previous = {$: 3};
var $author$project$Internals$Icons$chevronLeft = function (size) {
	return A3(
		$author$project$Internals$Icons$customSvgFeatherIcon,
		size,
		'chevron-left',
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$polyline,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$points('15 18 9 12 15 6')
					]),
				_List_Nil)
			]));
};
var $author$project$Internals$Icons$chevronRight = function (size) {
	return A3(
		$author$project$Internals$Icons$customSvgFeatherIcon,
		size,
		'chevron-right',
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$polyline,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$points('9 18 15 12 9 6')
					]),
				_List_Nil)
			]));
};
var $author$project$Gallery$Gallery$DragAt = function (a) {
	return {$: 6, a: a};
};
var $author$project$Gallery$Gallery$DragEnd = {$: 7};
var $author$project$Gallery$Gallery$DragStart = function (a) {
	return {$: 5, a: a};
};
var $author$project$Gallery$GalleryHelpers$Position = F2(
	function (x, y) {
		return {_: x, ld: y};
	});
var $author$project$Gallery$GalleryHelpers$decodePosition = function () {
	var decoder = A3(
		$elm$json$Json$Decode$map2,
		$author$project$Gallery$GalleryHelpers$Position,
		A2(
			$elm$json$Json$Decode$field,
			'pageX',
			A2($elm$json$Json$Decode$map, $elm$core$Basics$floor, $elm$json$Json$Decode$float)),
		A2(
			$elm$json$Json$Decode$field,
			'pageY',
			A2($elm$json$Json$Decode$map, $elm$core$Basics$floor, $elm$json$Json$Decode$float)));
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				decoder,
				A2(
				$elm$json$Json$Decode$at,
				_List_fromArray(
					['touches', '0']),
				decoder)
			]));
}();
var $author$project$Gallery$GalleryHelpers$moveEvent = F2(
	function (drag, _v0) {
		var dragStart = _v0.a;
		var dragAt = _v0.b;
		var dragEnd = _v0.c;
		if (!drag.$) {
			return _List_fromArray(
				[
					A2(
					$elm$html$Html$Events$preventDefaultOn,
					'mousemove',
					A2(
						$elm$json$Json$Decode$map,
						function (p) {
							return _Utils_Tuple2(
								dragAt(p),
								true);
						},
						$author$project$Gallery$GalleryHelpers$decodePosition)),
					A2(
					$elm$html$Html$Events$preventDefaultOn,
					'touchmove',
					A2(
						$elm$json$Json$Decode$map,
						function (p) {
							return _Utils_Tuple2(
								dragAt(p),
								true);
						},
						$author$project$Gallery$GalleryHelpers$decodePosition)),
					A2(
					$elm$html$Html$Events$on,
					'mouseup',
					$elm$json$Json$Decode$succeed(dragEnd)),
					A2(
					$elm$html$Html$Events$on,
					'mouseleave',
					$elm$json$Json$Decode$succeed(dragEnd)),
					A2(
					$elm$html$Html$Events$on,
					'touchend',
					$elm$json$Json$Decode$succeed(dragEnd)),
					A2(
					$elm$html$Html$Events$on,
					'touchcancel',
					$elm$json$Json$Decode$succeed(dragEnd))
				]);
		} else {
			return _List_Nil;
		}
	});
var $author$project$Gallery$GalleryHelpers$events = F2(
	function (drag, _v0) {
		var dragStart = _v0.a;
		var dragAt = _v0.b;
		var dragEnd = _v0.c;
		return A2(
			$elm$core$List$map,
			$mdgriffith$elm_ui$Element$htmlAttribute,
			_Utils_ap(
				A2(
					$author$project$Gallery$GalleryHelpers$moveEvent,
					drag,
					_Utils_Tuple3(dragStart, dragAt, dragEnd)),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$Events$on,
						'mousedown',
						A2($elm$json$Json$Decode$map, dragStart, $author$project$Gallery$GalleryHelpers$decodePosition)),
						A2(
						$elm$html$Html$Events$on,
						'touchstart',
						A2($elm$json$Json$Decode$map, dragStart, $author$project$Gallery$GalleryHelpers$decodePosition))
					])));
	});
var $mdgriffith$elm_ui$Element$Lazy$embed = function (x) {
	switch (x.$) {
		case 0:
			var html = x.a;
			return html;
		case 1:
			var styled = x.a;
			return styled.iz(
				A2(
					$mdgriffith$elm_ui$Internal$Model$OnlyDynamic,
					{
						fs: {g9: $elm$core$Maybe$Nothing, hh: $elm$core$Maybe$Nothing, kl: $elm$core$Maybe$Nothing},
						W: 1,
						e: 1
					},
					styled.gw));
		case 2:
			var text = x.a;
			return $elm$core$Basics$always(
				$elm$virtual_dom$VirtualDom$text(text));
		default:
			return $elm$core$Basics$always(
				$elm$virtual_dom$VirtualDom$text(''));
	}
};
var $mdgriffith$elm_ui$Element$Lazy$apply1 = F2(
	function (fn, a) {
		return $mdgriffith$elm_ui$Element$Lazy$embed(
			fn(a));
	});
var $elm$virtual_dom$VirtualDom$lazy3 = _VirtualDom_lazy3;
var $mdgriffith$elm_ui$Element$Lazy$lazy = F2(
	function (fn, a) {
		return $mdgriffith$elm_ui$Internal$Model$Unstyled(
			A3($elm$virtual_dom$VirtualDom$lazy3, $mdgriffith$elm_ui$Element$Lazy$apply1, fn, a));
	});
var $elm$core$Basics$clamp = F3(
	function (low, high, number) {
		return (_Utils_cmp(number, low) < 0) ? low : ((_Utils_cmp(number, high) > 0) ? high : number);
	});
var $mgold$elm_animation$Animation$animate = F2(
	function (clock, _v0) {
		var start = _v0.j;
		var delay_ = _v0.ab;
		var dos = _v0.M;
		var ramp = _v0.a$;
		var from_ = _v0.z;
		var to_ = _v0.r;
		var ease_ = _v0.a9;
		var duration_ = A3($mgold$elm_animation$Animation$dur, dos, from_, to_);
		var fr = A3($elm$core$Basics$clamp, 0, 1, ((clock - start) - delay_) / duration_);
		var eased = ease_(fr);
		var correction = function () {
			if (ramp.$ === 1) {
				return 0;
			} else {
				var vel = ramp.a;
				var from__ = vel * (clock - start);
				var eased_ = $mgold$elm_animation$Animation$defaultEase(fr);
				return from__ - (from__ * eased_);
			}
		}();
		return (from_ + ((to_ - from_) * eased)) + correction;
	});
var $mdgriffith$elm_ui$Internal$Model$MoveX = function (a) {
	return {$: 0, a: a};
};
var $mdgriffith$elm_ui$Internal$Flag$moveX = $mdgriffith$elm_ui$Internal$Flag$flag(25);
var $mdgriffith$elm_ui$Element$moveLeft = function (x) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$TransformComponent,
		$mdgriffith$elm_ui$Internal$Flag$moveX,
		$mdgriffith$elm_ui$Internal$Model$MoveX(-x));
};
var $mdgriffith$elm_ui$Element$moveRight = function (x) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$TransformComponent,
		$mdgriffith$elm_ui$Internal$Flag$moveX,
		$mdgriffith$elm_ui$Internal$Model$MoveX(x));
};
var $author$project$Gallery$Gallery$moveChunk = F2(
	function (config, model) {
		var w = $author$project$Gallery$Gallery$maxWidth(config);
		var animFun = function () {
			var _v2 = model.q;
			if (_v2.$ === 1) {
				return $mdgriffith$elm_ui$Element$moveLeft(w);
			} else {
				if (!_v2.a.b) {
					var _v3 = _v2.a;
					var anim = _v3.a;
					var _v4 = _v3.b;
					return $mdgriffith$elm_ui$Element$moveLeft(
						w + A2($mgold$elm_animation$Animation$animate, model.b7, anim));
				} else {
					var _v5 = _v2.a;
					var anim = _v5.a;
					var _v6 = _v5.b;
					return $mdgriffith$elm_ui$Element$moveRight(
						((-1) * w) + A2($mgold$elm_animation$Animation$animate, model.b7, anim));
				}
			}
		}();
		var _v0 = model.aw;
		if (_v0.$ === 1) {
			return animFun;
		} else {
			var _v1 = _v0.a;
			var start = _v1.a;
			var stop = _v1.b;
			return ((start._ - stop._) <= 0) ? $mdgriffith$elm_ui$Element$moveRight(
				((-1) * w) + $elm$core$Basics$abs(start._ - stop._)) : $mdgriffith$elm_ui$Element$moveLeft((w + start._) - stop._);
		}
	});
var $author$project$Gallery$Gallery$ImgLoaded = function (a) {
	return {$: 8, a: a};
};
var $elm$html$Html$Attributes$hidden = $elm$html$Html$Attributes$boolProperty('hidden');
var $author$project$Gallery$Gallery$picView = F3(
	function (config, model, _v0) {
		var src = _v0.eT;
		var size = _v0.eS;
		var w = $author$project$Gallery$Gallery$maxWidth(config);
		var h = A2(
			$elm$core$Basics$min,
			600,
			$elm$core$Basics$round(w / 1.333333));
		if (!src.$) {
			var src_ = src.a;
			return A2($elm$core$Set$member, src_, model.fO) ? A2(
				$mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$Background$color($author$project$Internals$CommonStyleHelpers$grey5)
					]),
				A2(
					$mdgriffith$elm_ui$Element$el,
					_Utils_ap(
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$width(
								$mdgriffith$elm_ui$Element$px(w)),
								$mdgriffith$elm_ui$Element$height(
								$mdgriffith$elm_ui$Element$px(h)),
								$mdgriffith$elm_ui$Element$Background$uncropped(src_)
							]),
						$author$project$Internals$CommonStyleHelpers$unselectable),
					$mdgriffith$elm_ui$Element$none)) : A2(
				$mdgriffith$elm_ui$Element$column,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$Background$color($author$project$Internals$CommonStyleHelpers$grey5),
						$mdgriffith$elm_ui$Element$width(
						$mdgriffith$elm_ui$Element$px(w)),
						$mdgriffith$elm_ui$Element$height(
						$mdgriffith$elm_ui$Element$px(h))
					]),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$image,
						_List_fromArray(
							[$mdgriffith$elm_ui$Element$centerX, $mdgriffith$elm_ui$Element$centerY, $mdgriffith$elm_ui$Element$clip]),
						{h$: 'chargement en cours', eT: '/assets/images/loading.gif'}),
						$mdgriffith$elm_ui$Element$html(
						A2(
							$elm$html$Html$img,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$hidden(true),
									A2(
									$elm$html$Html$Events$on,
									'load',
									$elm$json$Json$Decode$succeed(
										$author$project$Gallery$Gallery$ImgLoaded(src_))),
									$elm$html$Html$Attributes$src(src_)
								]),
							_List_Nil))
					]));
		} else {
			return $mdgriffith$elm_ui$Element$none;
		}
	});
var $author$project$Gallery$Gallery$chunkView = F3(
	function (config, model, chunk) {
		var w = $author$project$Gallery$Gallery$maxWidth(config);
		var h = A2(
			$elm$core$Basics$min,
			600,
			$elm$core$Basics$round(w / 1.333333));
		if (((chunk.b && chunk.b.b) && chunk.b.b.b) && (!chunk.b.b.b.b)) {
			var l = chunk.a;
			var _v1 = chunk.b;
			var c = _v1.a;
			var _v2 = _v1.b;
			var r = _v2.a;
			return A2(
				$mdgriffith$elm_ui$Element$Lazy$lazy,
				function (mc) {
					return A2(
						$mdgriffith$elm_ui$Element$row,
						_Utils_ap(
							A2(
								$author$project$Gallery$GalleryHelpers$events,
								model.aw,
								_Utils_Tuple3($author$project$Gallery$Gallery$DragStart, $author$project$Gallery$Gallery$DragAt, $author$project$Gallery$Gallery$DragEnd)),
							_List_fromArray(
								[mc])),
						_List_fromArray(
							[
								A3($author$project$Gallery$Gallery$picView, config, model, l),
								A3($author$project$Gallery$Gallery$picView, config, model, c),
								A3($author$project$Gallery$Gallery$picView, config, model, r)
							]));
				},
				A2($author$project$Gallery$Gallery$moveChunk, config, model));
		} else {
			return $mdgriffith$elm_ui$Element$none;
		}
	});
var $author$project$Gallery$Gallery$galleryView = F2(
	function (config, model) {
		var w = $author$project$Gallery$Gallery$maxWidth(config);
		var h = A2(
			$elm$core$Basics$min,
			600,
			$elm$core$Basics$round(w / 1.333333));
		var controlPanel = F3(
			function (attr, msg, icon) {
				return A2(
					$mdgriffith$elm_ui$Element$el,
					_Utils_ap(
						_List_fromArray(
							[
								(config.lb > 750) ? $mdgriffith$elm_ui$Element$width(
								$mdgriffith$elm_ui$Element$px((w / 3) | 0)) : $mdgriffith$elm_ui$Element$width(
								$mdgriffith$elm_ui$Element$px(50)),
								$mdgriffith$elm_ui$Element$height(
								$mdgriffith$elm_ui$Element$px(h)),
								$mdgriffith$elm_ui$Element$pointer,
								$mdgriffith$elm_ui$Element$alpha(0),
								$mdgriffith$elm_ui$Element$mouseOver(
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$alpha(1)
									])),
								$mdgriffith$elm_ui$Element$Events$onClick(msg),
								A2($mdgriffith$elm_ui$Element$paddingXY, 5, 0)
							]),
						attr),
					A2(
						$mdgriffith$elm_ui$Element$el,
						_Utils_ap(
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$Font$bold,
									$mdgriffith$elm_ui$Element$centerY,
									$mdgriffith$elm_ui$Element$Font$color(
									A3($mdgriffith$elm_ui$Element$rgb255, 255, 255, 255)),
									$mdgriffith$elm_ui$Element$Border$rounded(20),
									$mdgriffith$elm_ui$Element$Background$color(
									A4($mdgriffith$elm_ui$Element$rgba, 255, 255, 255, 0.5))
								]),
							attr),
						$mdgriffith$elm_ui$Element$html(
							icon(
								(config.lb > 750) ? 55 : 40))));
			});
		return A2(
			$mdgriffith$elm_ui$Element$el,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$centerX,
					$mdgriffith$elm_ui$Element$clipX,
					$mdgriffith$elm_ui$Element$width(
					$mdgriffith$elm_ui$Element$px(w)),
					$mdgriffith$elm_ui$Element$inFront(
					A3(controlPanel, _List_Nil, $author$project$Gallery$Gallery$Previous, $author$project$Internals$Icons$chevronLeft)),
					$mdgriffith$elm_ui$Element$inFront(
					A3(
						controlPanel,
						_List_fromArray(
							[$mdgriffith$elm_ui$Element$alignRight]),
						$author$project$Gallery$Gallery$Next,
						$author$project$Internals$Icons$chevronRight))
				]),
			A3(
				$author$project$Gallery$Gallery$chunkView,
				config,
				model,
				$author$project$Internals$Streams$current(model.X)));
	});
var $author$project$Gallery$Gallery$Select = function (a) {
	return {$: 1, a: a};
};
var $author$project$Gallery$Gallery$ThumbLoaded = function (a) {
	return {$: 9, a: a};
};
var $author$project$Internals$CommonHelpers$thumbSrc = function (s) {
	var _v0 = $elm$core$List$reverse(
		A2($elm$core$String$indexes, '/', s));
	if (!_v0.b) {
		return s;
	} else {
		var n = _v0.a;
		return A3($elm_community$string_extra$String$Extra$insertAt, '/thumbs', n, s);
	}
};
var $author$project$Gallery$Gallery$gridView = F2(
	function (config, model) {
		var w = $author$project$Gallery$Gallery$maxWidth(config);
		var thumbSize = 135;
		var thumbView = function (src) {
			if (!src.$) {
				var src_ = src.a;
				return A2($elm$core$Set$member, src_, model.cS) ? A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$padding(5),
							$mdgriffith$elm_ui$Element$Background$color($author$project$Internals$CommonStyleHelpers$grey6),
							$mdgriffith$elm_ui$Element$mouseOver(
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$Background$color($author$project$Internals$CommonStyleHelpers$grey4)
								])),
							$mdgriffith$elm_ui$Element$Border$rounded(5),
							$mdgriffith$elm_ui$Element$Events$onClick(
							$author$project$Gallery$Gallery$Select(src)),
							$mdgriffith$elm_ui$Element$pointer
						]),
					A2(
						$mdgriffith$elm_ui$Element$el,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$width(
								$mdgriffith$elm_ui$Element$px(thumbSize)),
								$mdgriffith$elm_ui$Element$height(
								$mdgriffith$elm_ui$Element$px(thumbSize)),
								$mdgriffith$elm_ui$Element$centerX,
								$mdgriffith$elm_ui$Element$mouseOver(
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$alpha(0.5)
									])),
								$mdgriffith$elm_ui$Element$Background$uncropped(
								$author$project$Internals$CommonHelpers$thumbSrc(src_))
							]),
						$mdgriffith$elm_ui$Element$none)) : A2(
					$mdgriffith$elm_ui$Element$column,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$padding(5),
							$mdgriffith$elm_ui$Element$Background$color($author$project$Internals$CommonStyleHelpers$grey6),
							$mdgriffith$elm_ui$Element$mouseOver(
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$Background$color($author$project$Internals$CommonStyleHelpers$grey4)
								])),
							$mdgriffith$elm_ui$Element$Border$rounded(5),
							$mdgriffith$elm_ui$Element$pointer,
							$mdgriffith$elm_ui$Element$width(
							$mdgriffith$elm_ui$Element$px(thumbSize + 10)),
							$mdgriffith$elm_ui$Element$height(
							$mdgriffith$elm_ui$Element$px(thumbSize + 10))
						]),
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$html(
							A2(
								$elm$html$Html$img,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$hidden(true),
										A2(
										$elm$html$Html$Events$on,
										'load',
										$elm$json$Json$Decode$succeed(
											$author$project$Gallery$Gallery$ThumbLoaded(src_))),
										$elm$html$Html$Attributes$src(
										$author$project$Internals$CommonHelpers$thumbSrc(src_))
									]),
								_List_Nil)),
							A2(
							$mdgriffith$elm_ui$Element$image,
							_List_fromArray(
								[$mdgriffith$elm_ui$Element$centerX, $mdgriffith$elm_ui$Element$centerY]),
							{h$: 'chargement', eT: '/assets/images/loading.gif'})
						]));
			} else {
				return $mdgriffith$elm_ui$Element$none;
			}
		};
		var h = A2(
			$elm$core$Basics$min,
			600,
			$elm$core$Basics$round(w / 1.333333));
		var chunkSize = ((w - 15) / (thumbSize + 10)) | 0;
		var rows = A2(
			$elm$core$List$map,
			$mdgriffith$elm_ui$Element$row(
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
						$mdgriffith$elm_ui$Element$spaceEvenly,
						A2($mdgriffith$elm_ui$Element$paddingXY, 10, 0)
					])),
			A2(
				$author$project$Internals$CommonHelpers$chunks,
				chunkSize,
				A2($elm$core$List$map, thumbView, model.ew)));
		return A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Background$color($author$project$Internals$CommonStyleHelpers$grey5),
					$mdgriffith$elm_ui$Element$width(
					$mdgriffith$elm_ui$Element$px(w)),
					$mdgriffith$elm_ui$Element$height(
					$mdgriffith$elm_ui$Element$px(h)),
					$mdgriffith$elm_ui$Element$scrollbarY,
					$mdgriffith$elm_ui$Element$spacing(10),
					A2($mdgriffith$elm_ui$Element$paddingXY, 0, 10)
				]),
			rows);
	});
var $author$project$Gallery$Gallery$ToogleDisplayMode = {$: 0};
var $elm$svg$Svg$rect = $elm$svg$Svg$trustedNode('rect');
var $elm$svg$Svg$Attributes$x = _VirtualDom_attribute('x');
var $elm$svg$Svg$Attributes$y = _VirtualDom_attribute('y');
var $author$project$Internals$Icons$grid = function (size) {
	return A3(
		$author$project$Internals$Icons$customSvgFeatherIcon,
		size,
		'grid',
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$rect,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x('3'),
						$elm$svg$Svg$Attributes$y('3'),
						$elm$svg$Svg$Attributes$width('7'),
						$elm$svg$Svg$Attributes$height('7')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$rect,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x('14'),
						$elm$svg$Svg$Attributes$y('3'),
						$elm$svg$Svg$Attributes$width('7'),
						$elm$svg$Svg$Attributes$height('7')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$rect,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x('14'),
						$elm$svg$Svg$Attributes$y('14'),
						$elm$svg$Svg$Attributes$width('7'),
						$elm$svg$Svg$Attributes$height('7')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$rect,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x('3'),
						$elm$svg$Svg$Attributes$y('14'),
						$elm$svg$Svg$Attributes$width('7'),
						$elm$svg$Svg$Attributes$height('7')
					]),
				_List_Nil)
			]));
};
var $elm$svg$Svg$circle = $elm$svg$Svg$trustedNode('circle');
var $elm$svg$Svg$Attributes$cx = _VirtualDom_attribute('cx');
var $elm$svg$Svg$Attributes$cy = _VirtualDom_attribute('cy');
var $elm$svg$Svg$Attributes$r = _VirtualDom_attribute('r');
var $elm$svg$Svg$Attributes$rx = _VirtualDom_attribute('rx');
var $elm$svg$Svg$Attributes$ry = _VirtualDom_attribute('ry');
var $author$project$Internals$Icons$imageIcon = function (size) {
	return A3(
		$author$project$Internals$Icons$customSvgFeatherIcon,
		size,
		'image',
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$rect,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x('3'),
						$elm$svg$Svg$Attributes$y('3'),
						$elm$svg$Svg$Attributes$width('18'),
						$elm$svg$Svg$Attributes$height('18'),
						$elm$svg$Svg$Attributes$rx('2'),
						$elm$svg$Svg$Attributes$ry('2')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$circle,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$cx('8.5'),
						$elm$svg$Svg$Attributes$cy('8.5'),
						$elm$svg$Svg$Attributes$r('1.5')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$polyline,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$points('21 15 16 10 5 21')
					]),
				_List_Nil)
			]));
};
var $author$project$Gallery$Gallery$titleRow = F2(
	function (config, model) {
		var w = $author$project$Gallery$Gallery$maxWidth(config);
		return A2(
			$mdgriffith$elm_ui$Element$row,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width(
					A2($mdgriffith$elm_ui$Element$maximum, w, $mdgriffith$elm_ui$Element$fill)),
					A2($mdgriffith$elm_ui$Element$paddingXY, 15, 5),
					$mdgriffith$elm_ui$Element$spacing(20)
				]),
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Font$size(16),
							$mdgriffith$elm_ui$Element$Font$color(
							A3($mdgriffith$elm_ui$Element$rgb, 0, 0.5, 0)),
							$mdgriffith$elm_ui$Element$Font$bold
						]),
					$mdgriffith$elm_ui$Element$text(
						$elm_community$string_extra$String$Extra$toSentenceCase(model.d0))),
					A2(
					$mdgriffith$elm_ui$Element$Input$button,
					_Utils_ap(
						$author$project$Internals$CommonStyleHelpers$buttonStyle(true),
						_List_fromArray(
							[$mdgriffith$elm_ui$Element$alignRight])),
					{
						F: A2(
							$mdgriffith$elm_ui$Element$el,
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Element$paddingXY, 0, 0)
								]),
							$mdgriffith$elm_ui$Element$html(
								function () {
									var _v0 = model.bm;
									if (!_v0) {
										return $author$project$Internals$Icons$grid(22);
									} else {
										return $author$project$Internals$Icons$imageIcon(22);
									}
								}())),
						ax: $elm$core$Maybe$Just($author$project$Gallery$Gallery$ToogleDisplayMode)
					})
				]));
	});
var $author$project$Gallery$Gallery$view = F2(
	function (config, model) {
		var w = $author$project$Gallery$Gallery$maxWidth(config);
		var h = A2(
			$elm$core$Basics$min,
			600,
			$elm$core$Basics$round(w / 1.333333));
		return A2(
			$mdgriffith$elm_ui$Element$map,
			model.cK,
			A2(
				$mdgriffith$elm_ui$Element$column,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$Background$color($author$project$Internals$CommonStyleHelpers$grey6),
						$mdgriffith$elm_ui$Element$Border$rounded(5),
						$mdgriffith$elm_ui$Element$centerX
					]),
				_List_fromArray(
					[
						A2($author$project$Gallery$Gallery$titleRow, config, model),
						function () {
						var _v0 = model.bm;
						if (!_v0) {
							return A2($author$project$Gallery$Gallery$galleryView, config, model);
						} else {
							return A2($author$project$Gallery$Gallery$gridView, config, model);
						}
					}(),
						A2($author$project$Gallery$Gallery$captionRow, config, model)
					])));
	});
var $author$project$Document$DocumentViews$DocumentView$renderGallery = F4(
	function (config, id, attrs, galleryMeta) {
		var _v0 = A2(
			$elm$core$Dict$get,
			$TSFoster$elm_uuid$UUID$canonical(galleryMeta.d1),
			config.ij);
		if (!_v0.$) {
			var gallery = _v0.a;
			return _List_fromArray(
				[
					A2($author$project$Gallery$Gallery$view, config, gallery)
				]);
		} else {
			return config.an ? _List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$column,
					_Utils_ap(
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$width(
								$mdgriffith$elm_ui$Element$px(400)),
								$mdgriffith$elm_ui$Element$Background$color($author$project$Internals$CommonStyleHelpers$grey6),
								$mdgriffith$elm_ui$Element$Border$rounded(5),
								$mdgriffith$elm_ui$Element$centerX
							]),
						A2($author$project$Document$DocumentViews$DocumentView$renderAttrs, config, attrs)),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Element$row,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
									A2($mdgriffith$elm_ui$Element$paddingXY, 15, 5)
								]),
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Element$el,
									_List_fromArray(
										[
											$mdgriffith$elm_ui$Element$Font$size(16),
											$mdgriffith$elm_ui$Element$Font$color(
											A3($mdgriffith$elm_ui$Element$rgb, 0, 0.5, 0)),
											$mdgriffith$elm_ui$Element$Font$bold
										]),
									$mdgriffith$elm_ui$Element$text(
										$elm_community$string_extra$String$Extra$toSentenceCase(galleryMeta.d0))),
									A2(
									$mdgriffith$elm_ui$Element$el,
									_List_fromArray(
										[$mdgriffith$elm_ui$Element$alignRight]),
									$mdgriffith$elm_ui$Element$text(
										$elm$core$String$fromInt(
											$elm$core$List$length(galleryMeta.iF)) + ' images'))
								])),
							A2(
							$mdgriffith$elm_ui$Element$el,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$Background$color($author$project$Internals$CommonStyleHelpers$grey7)
								]),
							A2(
								$mdgriffith$elm_ui$Element$el,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$width(
										$mdgriffith$elm_ui$Element$px(400)),
										$mdgriffith$elm_ui$Element$height(
										$mdgriffith$elm_ui$Element$px(
											$elm$core$Basics$round(400 / 1.333333))),
										$mdgriffith$elm_ui$Element$Background$uncropped(
										function () {
											var _v1 = A2(
												$elm$core$Maybe$map,
												function ($) {
													return $.eT;
												},
												$elm$core$List$head(galleryMeta.iF));
											if ((!_v1.$) && (!_v1.a.$)) {
												var src = _v1.a.a;
												return src;
											} else {
												return '';
											}
										}())
									]),
								$mdgriffith$elm_ui$Element$none))
						]))
				]) : _List_Nil;
		}
	});
var $author$project$Document$DocumentViews$DocumentView$renderImage = F4(
	function (config, id, attrs, _v0) {
		var uid = id.b0;
		var docStyleId = id.a8;
		var classes = id.a3;
		var src = _v0.eT;
		var caption = _v0.fb;
		var size = _v0.eS;
		var styleSheet = $author$project$Document$DocumentViews$StyleSheets$defaultStyleSheet(config);
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
		var attrs_ = _Utils_ap(
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width(
					A2($mdgriffith$elm_ui$Element$maximum, size.iI, $mdgriffith$elm_ui$Element$fill))
				]),
			_Utils_ap(
				styleSheet.iE,
				_Utils_ap(
					A2($author$project$Document$DocumentViews$DocumentView$idStyle, styleSheet, id),
					A2($author$project$Document$DocumentViews$DocumentView$renderAttrs, config, attrs))));
		return _List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$el,
				attrs_,
				$mdgriffith$elm_ui$Element$html(
					A2(
						$elm$html$Html$img,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'width', '100%'),
								A2($elm$html$Html$Attributes$style, 'height', 'auto'),
								$elm$html$Html$Attributes$src(src_)
							]),
						_List_Nil)))
			]);
	});
var $author$project$Publications$PublicationsView$murolInfosView = function (config) {
	var murolInfoView = function (_v2) {
		var issue = _v2.fG;
		var date = _v2.cI;
		var topics = _v2.gD;
		return A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$spacing(10),
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
				]),
			_Utils_ap(
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$row,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
								$mdgriffith$elm_ui$Element$spacing(15)
							]),
						_List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Element$row,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$mdgriffith$elm_ui$Element$el,
										_List_fromArray(
											[$mdgriffith$elm_ui$Element$Font$bold]),
										$mdgriffith$elm_ui$Element$text('Numéro: ')),
										A2(
										$mdgriffith$elm_ui$Element$el,
										_List_Nil,
										$mdgriffith$elm_ui$Element$text(
											$elm$core$String$fromInt(issue)))
									])),
								A2(
								$mdgriffith$elm_ui$Element$el,
								_List_fromArray(
									[$mdgriffith$elm_ui$Element$alignRight]),
								$mdgriffith$elm_ui$Element$text(
									A2(
										$elm$core$String$dropLeft,
										3,
										A2($author$project$Internals$CommonHelpers$dateToStr, config.e0, date)))),
								A2(
								$mdgriffith$elm_ui$Element$newTabLink,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$alignRight,
										$mdgriffith$elm_ui$Element$Background$color($author$project$Internals$CommonStyleHelpers$teal4),
										$mdgriffith$elm_ui$Element$mouseOver(
										_List_fromArray(
											[
												$mdgriffith$elm_ui$Element$Font$color(
												A3($mdgriffith$elm_ui$Element$rgb, 1, 1, 1))
											])),
										$mdgriffith$elm_ui$Element$pointer,
										$mdgriffith$elm_ui$Element$Border$rounded(5),
										A2($mdgriffith$elm_ui$Element$paddingXY, 7, 5)
									]),
								{
									F: $mdgriffith$elm_ui$Element$text('Télécharger'),
									da: '/baseDocumentaire/publications/murolInfos/' + function (s) {
										return s + '.pdf';
									}(
										A3(
											$elm$core$String$padLeft,
											3,
											'0',
											$elm$core$String$fromInt(issue)))
								})
							]))
					]),
				A2($elm$core$List$indexedMap, $author$project$Publications$PublicationsView$topicView, topics)));
	};
	var _v0 = config.eK;
	if (!_v0.$) {
		var murolInfos = _v0.a.jb;
		return A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$spacing(40),
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
				]),
			A3(
				$elm$core$Dict$foldl,
				F3(
					function (k, v, acc) {
						return A2(
							$elm$core$List$cons,
							A3($author$project$Publications$PublicationsView$yearView, k, v, murolInfoView),
							acc);
					}),
				_List_Nil,
				A2(
					$elm$core$Dict$map,
					F2(
						function (k, v) {
							return A2(
								$elm$core$List$sortBy,
								function ($) {
									return $.fG;
								},
								v);
						}),
					A3(
						$elm$core$List$foldr,
						F2(
							function (k, acc) {
								return A3(
									$elm$core$Dict$update,
									A2($elm$time$Time$toYear, config.e0, k.cI),
									function (mbVal) {
										if (mbVal.$ === 1) {
											return $elm$core$Maybe$Just(
												_List_fromArray(
													[k]));
										} else {
											var xs = mbVal.a;
											return $elm$core$Maybe$Just(
												A2($elm$core$List$cons, k, xs));
										}
									},
									acc);
							}),
						$elm$core$Dict$empty,
						$elm$core$Dict$values(murolInfos)))));
	} else {
		return $mdgriffith$elm_ui$Element$none;
	}
};
var $author$project$Document$DocumentViews$DocumentView$renderMurolInfo = F3(
	function (config, id, attrs) {
		var _v0 = config.eK;
		if (_v0.$ === 1) {
			return _List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$Background$color($author$project$Internals$CommonStyleHelpers$grey6),
							A2($mdgriffith$elm_ui$Element$paddingXY, 0, 7),
							$mdgriffith$elm_ui$Element$Font$center
						]),
					$mdgriffith$elm_ui$Element$text('Murol infos'))
				]);
		} else {
			var murolInfos = _v0.a.jb;
			return _List_fromArray(
				[
					$author$project$Publications$PublicationsView$murolInfosView(config)
				]);
		}
	});
var $author$project$Internals$Icons$chevronsDown = function (size) {
	return A3(
		$author$project$Internals$Icons$customSvgFeatherIcon,
		size,
		'chevrons-down',
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$polyline,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$points('7 13 12 18 17 13')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$polyline,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$points('7 6 12 11 17 6')
					]),
				_List_Nil)
			]));
};
var $author$project$Internals$Icons$chevronsUp = function (size) {
	return A3(
		$author$project$Internals$Icons$customSvgFeatherIcon,
		size,
		'chevrons-up',
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$polyline,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$points('17 11 12 6 7 11')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$polyline,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$points('17 18 12 13 7 18')
					]),
				_List_Nil)
			]));
};
var $elm$time$Time$Fri = 4;
var $elm$time$Time$Mon = 0;
var $elm$time$Time$Sat = 5;
var $elm$time$Time$Sun = 6;
var $elm$time$Time$Thu = 3;
var $elm$time$Time$Tue = 1;
var $elm$time$Time$Wed = 2;
var $elm$time$Time$toWeekday = F2(
	function (zone, time) {
		var _v0 = A2(
			$elm$core$Basics$modBy,
			7,
			A2(
				$elm$time$Time$flooredDiv,
				A2($elm$time$Time$toAdjustedMinutes, zone, time),
				60 * 24));
		switch (_v0) {
			case 0:
				return 3;
			case 1:
				return 4;
			case 2:
				return 5;
			case 3:
				return 6;
			case 4:
				return 0;
			case 5:
				return 1;
			default:
				return 2;
		}
	});
var $author$project$Internals$CommonHelpers$dateToFrench = F2(
	function (zone, t) {
		var currentYear = $elm$core$String$fromInt(
			A2($elm$time$Time$toYear, zone, t));
		var currentWeekday = function () {
			var _v1 = A2($elm$time$Time$toWeekday, zone, t);
			switch (_v1) {
				case 0:
					return 'lundi';
				case 1:
					return 'mardi';
				case 2:
					return 'mercredi';
				case 3:
					return 'jeudi';
				case 4:
					return 'vendredi';
				case 5:
					return 'samedi';
				default:
					return 'dimanche';
			}
		}();
		var currentMonth = function () {
			var _v0 = A2($elm$time$Time$toMonth, zone, t);
			switch (_v0) {
				case 0:
					return 'janvier';
				case 1:
					return 'février';
				case 2:
					return 'mars';
				case 3:
					return 'avril';
				case 4:
					return 'mai';
				case 5:
					return 'juin';
				case 6:
					return 'juillet';
				case 7:
					return 'août';
				case 8:
					return 'septembre';
				case 9:
					return 'octobre';
				case 10:
					return 'novembre';
				default:
					return 'décembre';
			}
		}();
		var currentDay = $elm$core$String$fromInt(
			A2($elm$time$Time$toDay, zone, t));
		return currentWeekday + (' ' + (currentDay + (' ' + (currentMonth + (' ' + currentYear)))));
	});
var $author$project$Internals$CommonStyleHelpers$grey3 = A3($mdgriffith$elm_ui$Element$rgb255, 136, 149, 167);
var $author$project$Document$DocumentViews$DocumentView$renderTextBlock = F4(
	function (config, id, attrs, xs) {
		return A2(
			$elm$core$List$map,
			A3($author$project$Document$DocumentViews$DocumentView$renderTextBlockElement, config, id, attrs),
			xs);
	});
var $mdgriffith$elm_ui$Element$Border$roundEach = function (_v0) {
	var topLeft = _v0.gB;
	var topRight = _v0.gC;
	var bottomLeft = _v0.e9;
	var bottomRight = _v0.fa;
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$borderRound,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Single,
			'br-' + ($elm$core$String$fromInt(topLeft) + ('-' + ($elm$core$String$fromInt(topRight) + ($elm$core$String$fromInt(bottomLeft) + ('-' + $elm$core$String$fromInt(bottomRight)))))),
			'border-radius',
			$elm$core$String$fromInt(topLeft) + ('px ' + ($elm$core$String$fromInt(topRight) + ('px ' + ($elm$core$String$fromInt(bottomRight) + ('px ' + ($elm$core$String$fromInt(bottomLeft) + 'px'))))))));
};
var $mdgriffith$elm_ui$Internal$Model$AsTextColumn = 5;
var $mdgriffith$elm_ui$Internal$Model$asTextColumn = 5;
var $mdgriffith$elm_ui$Element$textColumn = F2(
	function (attrs, children) {
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asTextColumn,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Element$width(
					A2(
						$mdgriffith$elm_ui$Element$maximum,
						750,
						A2($mdgriffith$elm_ui$Element$minimum, 500, $mdgriffith$elm_ui$Element$fill))),
				attrs),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(children));
	});
var $author$project$Document$DocumentViews$DocumentView$renderNews = F3(
	function (config, id, attrs) {
		var styleSheet = $author$project$Document$DocumentViews$StyleSheets$defaultStyleSheet(config);
		var sortedNews = $elm$core$List$reverse(
			A2(
				$elm$core$List$sortBy,
				A2(
					$elm$core$Basics$composeL,
					$elm$time$Time$posixToMillis,
					function ($) {
						return $.cI;
					}),
				$elm$core$Dict$values(config.fU)));
		var lastUpdate = A2(
			$elm$core$Maybe$map,
			$elm$time$Time$millisToPosix,
			$elm$core$List$head(
				$elm$core$List$reverse(
					$elm$core$List$sort(
						A2(
							$elm$core$List$map,
							A2(
								$elm$core$Basics$composeL,
								$elm$time$Time$posixToMillis,
								function ($) {
									return $.cI;
								}),
							$elm$core$Dict$values(config.fU))))));
		var device = $author$project$Document$DocumentViews$StyleSheets$getDevice(config);
		var renderNewsBody = F3(
			function (uuid, pic, content) {
				var picView = function (url) {
					return A2(
						$mdgriffith$elm_ui$Element$el,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$width(
								$mdgriffith$elm_ui$Element$px(266)),
								$mdgriffith$elm_ui$Element$height(
								$mdgriffith$elm_ui$Element$px(200)),
								$mdgriffith$elm_ui$Element$Background$uncropped(url)
							]),
						$mdgriffith$elm_ui$Element$none);
				};
				var bodyAttr = _List_fromArray(
					[
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
						$mdgriffith$elm_ui$Element$Background$color(
						A3($mdgriffith$elm_ui$Element$rgb255, 255, 255, 255)),
						$mdgriffith$elm_ui$Element$spacing(15),
						$mdgriffith$elm_ui$Element$padding(10),
						$mdgriffith$elm_ui$Element$Border$roundEach(
						{e9: 5, fa: 5, gB: 0, gC: 0}),
						$mdgriffith$elm_ui$Element$Border$color($author$project$Internals$CommonStyleHelpers$grey4),
						$mdgriffith$elm_ui$Element$Border$widthEach(
						{aR: 1, aU: 1, a0: 1, a1: 0})
					]);
				if (A2(
					$elm$core$Set$member,
					$TSFoster$elm_uuid$UUID$canonical(uuid),
					config.f1)) {
					var _v3 = _Utils_Tuple2(pic, device.b6);
					if (!_v3.a.$) {
						if (!_v3.b) {
							var url = _v3.a.a.da;
							var _v4 = _v3.b;
							return _List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Element$column,
									bodyAttr,
									_Utils_ap(
										_List_fromArray(
											[
												A2(
												$mdgriffith$elm_ui$Element$el,
												_List_fromArray(
													[$mdgriffith$elm_ui$Element$centerX]),
												picView(url))
											]),
										A4($author$project$Document$DocumentViews$DocumentView$renderTextBlock, config, id, content.s, content.kI)))
								]);
						} else {
							var url = _v3.a.a.da;
							return _List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Element$textColumn,
									bodyAttr,
									_Utils_ap(
										_List_fromArray(
											[
												A2(
												$mdgriffith$elm_ui$Element$el,
												_List_fromArray(
													[
														$mdgriffith$elm_ui$Element$paddingEach(
														{aR: 0, aU: 0, a0: 10, a1: 0}),
														$mdgriffith$elm_ui$Element$alignLeft
													]),
												picView(url))
											]),
										A4($author$project$Document$DocumentViews$DocumentView$renderTextBlock, config, id, content.s, content.kI)))
								]);
						}
					} else {
						var _v5 = _v3.a;
						return _List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Element$column,
								bodyAttr,
								A4($author$project$Document$DocumentViews$DocumentView$renderTextBlock, config, id, content.s, content.kI))
							]);
					}
				} else {
					return _List_Nil;
				}
			});
		var renderNewsHeader = F3(
			function (uuid, title, date) {
				var titleView = A2(
					$mdgriffith$elm_ui$Element$paragraph,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$Font$color($author$project$Internals$CommonStyleHelpers$grey1),
							$mdgriffith$elm_ui$Element$paddingEach(
							{aR: 0, aU: 0, a0: 0, a1: 0})
						]),
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$text(
							$elm_community$string_extra$String$Extra$toSentenceCase(title))
						]));
				var headerAttr = _List_fromArray(
					[
						$mdgriffith$elm_ui$Element$spacing(15),
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
						$mdgriffith$elm_ui$Element$Events$onClick(
						config.jA(
							$TSFoster$elm_uuid$UUID$canonical(uuid))),
						$mdgriffith$elm_ui$Element$pointer,
						$mdgriffith$elm_ui$Element$paddingEach(
						{aR: 5, aU: 5, a0: 0, a1: 5}),
						$mdgriffith$elm_ui$Element$Border$roundEach(
						{e9: 0, fa: 0, gB: 2, gC: 2}),
						$mdgriffith$elm_ui$Element$Border$widthEach(
						{aR: 1, aU: 0, a0: 0, a1: 0}),
						$mdgriffith$elm_ui$Element$Border$color($author$project$Internals$CommonStyleHelpers$grey6),
						$mdgriffith$elm_ui$Element$Background$color($author$project$Internals$CommonStyleHelpers$grey5),
						$mdgriffith$elm_ui$Element$mouseOver(
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$Background$color($author$project$Internals$CommonStyleHelpers$grey6)
							]))
					]);
				var dateAttr = _List_fromArray(
					[
						$mdgriffith$elm_ui$Element$Border$color($author$project$Internals$CommonStyleHelpers$grey6),
						$mdgriffith$elm_ui$Element$Border$widthEach(
						{aR: 0, aU: 1, a0: 0, a1: 0}),
						$mdgriffith$elm_ui$Element$paddingEach(
						{aR: 5, aU: 9, a0: 5, a1: 5})
					]);
				var chevronsView = A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$alignRight,
							$mdgriffith$elm_ui$Element$Font$color($author$project$Internals$CommonStyleHelpers$grey3)
						]),
					$mdgriffith$elm_ui$Element$html(
						A2(
							$elm$core$Set$member,
							$TSFoster$elm_uuid$UUID$canonical(uuid),
							config.f1) ? $author$project$Internals$Icons$chevronsUp(18) : $author$project$Internals$Icons$chevronsDown(18)));
				var _v2 = device.b6;
				if (!_v2) {
					return A2(
						$mdgriffith$elm_ui$Element$column,
						headerAttr,
						_List_fromArray(
							[
								titleView,
								A2(
								$mdgriffith$elm_ui$Element$row,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
									]),
								_List_fromArray(
									[
										A2(
										$mdgriffith$elm_ui$Element$el,
										dateAttr,
										$mdgriffith$elm_ui$Element$text(
											A2($author$project$Internals$CommonHelpers$dateToStr, config.e0, date))),
										chevronsView
									]))
							]));
				} else {
					return A2(
						$mdgriffith$elm_ui$Element$row,
						headerAttr,
						_List_fromArray(
							[
								titleView,
								A2(
								$mdgriffith$elm_ui$Element$row,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$spacing(7)
									]),
								_List_fromArray(
									[
										chevronsView,
										A2(
										$mdgriffith$elm_ui$Element$el,
										_Utils_ap(
											dateAttr,
											_List_fromArray(
												[$mdgriffith$elm_ui$Element$alignRight])),
										$mdgriffith$elm_ui$Element$text(
											A2($author$project$Internals$CommonHelpers$dateToStr, config.e0, date)))
									]))
							]));
				}
			});
		var renderNewsItem = function (_v1) {
			var uuid = _v1.d1;
			var title = _v1.d0;
			var content = _v1.fi;
			var date = _v1.cI;
			var pic = _v1.f6;
			return A2(
				$mdgriffith$elm_ui$Element$column,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
					]),
				_Utils_ap(
					_List_fromArray(
						[
							A3(renderNewsHeader, uuid, title, date)
						]),
					function () {
						if (!content.$) {
							var c = content.a;
							return A3(renderNewsBody, uuid, pic, c);
						} else {
							return _List_Nil;
						}
					}()));
		};
		return _List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$column,
				_Utils_ap(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$centerX,
							$mdgriffith$elm_ui$Element$spacing(15),
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$alignTop
						]),
					_Utils_ap(
						A2($author$project$Document$DocumentViews$DocumentView$idStyle, styleSheet, id),
						A2($author$project$Document$DocumentViews$DocumentView$renderAttrs, config, attrs))),
				_Utils_ap(
					_List_fromArray(
						[
							A4($author$project$Document$DocumentViews$DocumentView$customHeading, config, 1, _List_Nil, 'ACTUALITES DE LA COMMUNE'),
							A2(
							$elm$core$Maybe$withDefault,
							$mdgriffith$elm_ui$Element$none,
							A2(
								$elm$core$Maybe$map,
								function (lastUp) {
									return A2(
										$mdgriffith$elm_ui$Element$paragraph,
										_List_Nil,
										_List_fromArray(
											[
												$mdgriffith$elm_ui$Element$text(
												'Dernière mise à jour le ' + A2($author$project$Internals$CommonHelpers$dateToFrench, config.e0, lastUp))
											]));
								},
								lastUpdate))
						]),
					A2($elm$core$List$map, renderNewsItem, sortedNews)))
			]);
	});
var $author$project$Document$DocumentViews$DocumentView$renderPictureLinks = F4(
	function (config, id, attrs, picLinks) {
		var styleSheet = $author$project$Document$DocumentViews$StyleSheets$defaultStyleSheet(config);
		var minHeight = A2(
			$elm$core$Maybe$withDefault,
			0,
			A2(
				$elm$core$Maybe$map,
				$elm$core$Basics$min(50),
				$elm$core$List$head(
					$elm$core$List$sort(
						A2(
							$elm$core$List$map,
							A2(
								$elm$core$Basics$composeL,
								A2(
									$elm$core$Basics$composeL,
									function ($) {
										return $.iH;
									},
									function ($) {
										return $.eS;
									}),
								function ($) {
									return $.iG;
								}),
							picLinks)))));
		var imgsScaledToMinHeight = function () {
			var scale = function (picLink) {
				var img = picLink.iG;
				return _Utils_update(
					picLink,
					{
						iG: _Utils_update(
							img,
							{
								eS: {
									iH: minHeight + 5,
									iI: $elm$core$Basics$round((minHeight * img.eS.iI) / img.eS.iH)
								}
							})
					});
			};
			return A2($elm$core$List$map, scale, picLinks);
		}();
		var totalImgWidth = A3(
			$elm$core$List$foldr,
			F2(
				function (pl, n) {
					return pl.iG.eS.iI + n;
				}),
			0,
			imgsScaledToMinHeight);
		var logoView = function (_v3) {
			var url = _v3.da;
			var img = _v3.iG;
			return config.an ? A2(
				$mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$width(
						$mdgriffith$elm_ui$Element$fillPortion(
							$elm$core$Basics$floor((10000 * img.eS.iI) / totalImgWidth)))
					]),
				$mdgriffith$elm_ui$Element$html(
					A2(
						$elm$html$Html$img,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'width', '100%'),
								A2($elm$html$Html$Attributes$style, 'height', 'auto'),
								function () {
								var _v1 = img.eT;
								if (!_v1.$) {
									var urlSrc = _v1.a;
									return $elm$html$Html$Attributes$src(urlSrc);
								} else {
									return A2($elm$html$Html$Attributes$style, '', '');
								}
							}()
							]),
						_List_Nil))) : A2(
				$mdgriffith$elm_ui$Element$newTabLink,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$width(
						$mdgriffith$elm_ui$Element$fillPortion(
							$elm$core$Basics$floor((10000 * img.eS.iI) / totalImgWidth))),
						$mdgriffith$elm_ui$Element$pointer,
						$mdgriffith$elm_ui$Element$Border$width(2),
						$mdgriffith$elm_ui$Element$Border$color(
						A4($mdgriffith$elm_ui$Element$rgba255, 255, 255, 255, 0)),
						$mdgriffith$elm_ui$Element$Border$rounded(2),
						$mdgriffith$elm_ui$Element$mouseOver(
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$Border$color(
								A3($mdgriffith$elm_ui$Element$rgb255, 255, 255, 255))
							]))
					]),
				{
					F: $mdgriffith$elm_ui$Element$html(
						A2(
							$elm$html$Html$img,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'width', '100%'),
									A2($elm$html$Html$Attributes$style, 'height', 'auto'),
									function () {
									var _v2 = img.eT;
									if (!_v2.$) {
										var urlSrc = _v2.a;
										return $elm$html$Html$Attributes$src(urlSrc);
									} else {
										return A2($elm$html$Html$Attributes$style, '', '');
									}
								}()
								]),
							_List_Nil)),
					da: url
				});
		};
		if (!picLinks.b) {
			return _List_Nil;
		} else {
			return _List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$row,
					_Utils_ap(
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$spacing(10),
								$mdgriffith$elm_ui$Element$padding(10),
								$mdgriffith$elm_ui$Element$clip
							]),
						_Utils_ap(
							styleSheet.jI,
							_Utils_ap(
								A2($author$project$Document$DocumentViews$DocumentView$idStyle, styleSheet, id),
								A2($author$project$Document$DocumentViews$DocumentView$renderAttrs, config, attrs)))),
					A2($elm$core$List$map, logoView, imgsScaledToMinHeight))
				]);
		}
	});
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!_v0.$) {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $mdgriffith$elm_ui$Element$InternalIndexedColumn = function (a) {
	return {$: 0, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$GridPosition = function (a) {
	return {$: 9, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$GridTemplateStyle = function (a) {
	return {$: 8, a: a};
};
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $mdgriffith$elm_ui$Internal$Model$AsGrid = 3;
var $mdgriffith$elm_ui$Internal$Model$asGrid = 3;
var $mdgriffith$elm_ui$Internal$Model$getSpacing = F2(
	function (attrs, _default) {
		return A2(
			$elm$core$Maybe$withDefault,
			_default,
			A3(
				$elm$core$List$foldr,
				F2(
					function (attr, acc) {
						if (!acc.$) {
							var x = acc.a;
							return $elm$core$Maybe$Just(x);
						} else {
							if ((attr.$ === 4) && (attr.b.$ === 5)) {
								var _v2 = attr.b;
								var x = _v2.b;
								var y = _v2.c;
								return $elm$core$Maybe$Just(
									_Utils_Tuple2(x, y));
							} else {
								return $elm$core$Maybe$Nothing;
							}
						}
					}),
				$elm$core$Maybe$Nothing,
				attrs));
	});
var $mdgriffith$elm_ui$Internal$Flag$gridPosition = $mdgriffith$elm_ui$Internal$Flag$flag(35);
var $mdgriffith$elm_ui$Internal$Flag$gridTemplate = $mdgriffith$elm_ui$Internal$Flag$flag(34);
var $elm$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (n <= 0) {
				return result;
			} else {
				var $temp$result = A2($elm$core$List$cons, value, result),
					$temp$n = n - 1,
					$temp$value = value;
				result = $temp$result;
				n = $temp$n;
				value = $temp$value;
				continue repeatHelp;
			}
		}
	});
var $elm$core$List$repeat = F2(
	function (n, value) {
		return A3($elm$core$List$repeatHelp, _List_Nil, n, value);
	});
var $mdgriffith$elm_ui$Element$tableHelper = F2(
	function (attrs, config) {
		var onGrid = F3(
			function (rowLevel, columnLevel, elem) {
				return A4(
					$mdgriffith$elm_ui$Internal$Model$element,
					$mdgriffith$elm_ui$Internal$Model$asEl,
					$mdgriffith$elm_ui$Internal$Model$div,
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Model$StyleClass,
							$mdgriffith$elm_ui$Internal$Flag$gridPosition,
							$mdgriffith$elm_ui$Internal$Model$GridPosition(
								{fg: columnLevel, iu: 1, gj: rowLevel, lb: 1}))
						]),
					$mdgriffith$elm_ui$Internal$Model$Unkeyed(
						_List_fromArray(
							[elem])));
			});
		var columnWidth = function (col) {
			if (!col.$) {
				var colConfig = col.a;
				return colConfig.lb;
			} else {
				var colConfig = col.a;
				return colConfig.lb;
			}
		};
		var columnHeader = function (col) {
			if (!col.$) {
				var colConfig = col.a;
				return colConfig.iq;
			} else {
				var colConfig = col.a;
				return colConfig.iq;
			}
		};
		var maybeHeaders = function (headers) {
			return A2(
				$elm$core$List$all,
				$elm$core$Basics$eq($mdgriffith$elm_ui$Internal$Model$Empty),
				headers) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
				A2(
					$elm$core$List$indexedMap,
					F2(
						function (col, header) {
							return A3(onGrid, 1, col + 1, header);
						}),
					headers));
		}(
			A2($elm$core$List$map, columnHeader, config.hD));
		var add = F3(
			function (cell, columnConfig, cursor) {
				if (!columnConfig.$) {
					var col = columnConfig.a;
					return _Utils_update(
						cursor,
						{
							ea: cursor.ea + 1,
							R: A2(
								$elm$core$List$cons,
								A3(
									onGrid,
									cursor.gj,
									cursor.ea,
									A2(
										col.k7,
										_Utils_eq(maybeHeaders, $elm$core$Maybe$Nothing) ? (cursor.gj - 1) : (cursor.gj - 2),
										cell)),
								cursor.R)
						});
				} else {
					var col = columnConfig.a;
					return {
						ea: cursor.ea + 1,
						R: A2(
							$elm$core$List$cons,
							A3(
								onGrid,
								cursor.gj,
								cursor.ea,
								col.k7(cell)),
							cursor.R),
						gj: cursor.gj
					};
				}
			});
		var build = F3(
			function (columns, rowData, cursor) {
				var newCursor = A3(
					$elm$core$List$foldl,
					add(rowData),
					cursor,
					columns);
				return {ea: 1, R: newCursor.R, gj: cursor.gj + 1};
			});
		var children = A3(
			$elm$core$List$foldl,
			build(config.hD),
			{
				ea: 1,
				R: _List_Nil,
				gj: _Utils_eq(maybeHeaders, $elm$core$Maybe$Nothing) ? 1 : 2
			},
			config.hT);
		var _v0 = A2(
			$mdgriffith$elm_ui$Internal$Model$getSpacing,
			attrs,
			_Utils_Tuple2(0, 0));
		var sX = _v0.a;
		var sY = _v0.b;
		var template = A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$gridTemplate,
			$mdgriffith$elm_ui$Internal$Model$GridTemplateStyle(
				{
					hD: A2($elm$core$List$map, columnWidth, config.hD),
					j$: A2(
						$elm$core$List$repeat,
						$elm$core$List$length(config.hT),
						$mdgriffith$elm_ui$Internal$Model$Content),
					kr: _Utils_Tuple2(
						$mdgriffith$elm_ui$Element$px(sX),
						$mdgriffith$elm_ui$Element$px(sY))
				}));
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asGrid,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
				A2($elm$core$List$cons, template, attrs)),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(
				function () {
					if (maybeHeaders.$ === 1) {
						return children.R;
					} else {
						var renderedHeaders = maybeHeaders.a;
						return _Utils_ap(
							renderedHeaders,
							$elm$core$List$reverse(children.R));
					}
				}()));
	});
var $mdgriffith$elm_ui$Element$indexedTable = F2(
	function (attrs, config) {
		return A2(
			$mdgriffith$elm_ui$Element$tableHelper,
			attrs,
			{
				hD: A2($elm$core$List$map, $mdgriffith$elm_ui$Element$InternalIndexedColumn, config.hD),
				hT: config.hT
			});
	});
var $mdgriffith$elm_ui$Element$scrollbarX = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$overflow, $mdgriffith$elm_ui$Internal$Style$classes.j2);
var $author$project$Document$DocumentViews$StyleSheets$tableStyles = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2(
			'default',
			{
				ht: function (ri) {
					return _List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Border$widthEach(
							{aR: 1, aU: 0, a0: 1, a1: 0}),
							$mdgriffith$elm_ui$Element$Background$color(
							(!A2($elm$core$Basics$modBy, 2, ri)) ? A3($mdgriffith$elm_ui$Element$rgb, 0.8, 0.8, 0.8) : A3($mdgriffith$elm_ui$Element$rgb, 1, 1, 1)),
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
						]);
				},
				hH: _List_Nil,
				kE: _List_fromArray(
					[
						$mdgriffith$elm_ui$Element$Border$widthEach(
						{aR: 0, aU: 1, a0: 0, a1: 1})
					])
			}),
			_Utils_Tuple2(
			'souligné',
			{
				ht: function (ri) {
					return _List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Border$widthEach(
							{aR: 1, aU: 0, a0: 0, a1: 0}),
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
						]);
				},
				hH: _List_fromArray(
					[
						A2($mdgriffith$elm_ui$Element$paddingXY, 1, 0)
					]),
				kE: _List_Nil
			}),
			_Utils_Tuple2(
			'gris-vert',
			{
				ht: function (ri) {
					return _List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Border$widthEach(
							{aR: 1, aU: 0, a0: 0, a1: 0}),
							$mdgriffith$elm_ui$Element$Border$color(
							A4($mdgriffith$elm_ui$Element$rgba, 0.5, 0.5, 0.5, 1)),
							$mdgriffith$elm_ui$Element$Background$color(
							(!A2($elm$core$Basics$modBy, 2, ri)) ? A3($mdgriffith$elm_ui$Element$rgb, 0.83, 0.83, 0.83) : A3($mdgriffith$elm_ui$Element$rgb, 0.58, 0.93, 0.58)),
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
						]);
				},
				hH: _List_fromArray(
					[
						A2($mdgriffith$elm_ui$Element$paddingXY, 1, 1)
					]),
				kE: _List_Nil
			}),
			_Utils_Tuple2(
			'bleu-blanc',
			{
				ht: function (ri) {
					return _List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Border$widthEach(
							{aR: 1, aU: 0, a0: 0, a1: 0}),
							$mdgriffith$elm_ui$Element$Border$color(
							A3($mdgriffith$elm_ui$Element$rgb, 0.5, 0.5, 0.5)),
							$mdgriffith$elm_ui$Element$Background$color(
							(!A2($elm$core$Basics$modBy, 2, ri)) ? A3($mdgriffith$elm_ui$Element$rgb, 0.53, 0.81, 0.92) : A3($mdgriffith$elm_ui$Element$rgb, 0.92, 0.92, 0.84)),
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
						]);
				},
				hH: _List_fromArray(
					[
						A2($mdgriffith$elm_ui$Element$paddingXY, 1, 1)
					]),
				kE: _List_fromArray(
					[
						$mdgriffith$elm_ui$Element$Border$width(1)
					])
			})
		]));
var $author$project$Document$DocumentViews$DocumentView$renderTable = F4(
	function (config, id, attrs, _v0) {
		var style = _v0.kA;
		var nbrRows = _v0.jg;
		var nbrCols = _v0.jf;
		var data = _v0.hT;
		var styleSheet = $author$project$Document$DocumentViews$StyleSheets$defaultStyleSheet(config);
		var columns = A2(
			$elm$core$List$map,
			function (ci) {
				return {
					iq: $mdgriffith$elm_ui$Element$none,
					k7: F2(
						function (ri, row) {
							return A2(
								$mdgriffith$elm_ui$Element$el,
								function (s) {
									return A2(
										$elm$core$List$cons,
										$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
										s);
								}(
									A2(
										$elm$core$Maybe$withDefault,
										_List_Nil,
										A2(
											$elm$core$Maybe$map,
											function ($) {
												return $.hH;
											},
											A2($elm$core$Dict$get, style, $author$project$Document$DocumentViews$StyleSheets$tableStyles)))),
								A2(
									$mdgriffith$elm_ui$Element$el,
									_Utils_ap(
										A2(
											$elm$core$Maybe$withDefault,
											function (_v1) {
												return _List_Nil;
											},
											A2(
												$elm$core$Maybe$map,
												function ($) {
													return $.ht;
												},
												A2($elm$core$Dict$get, style, $author$project$Document$DocumentViews$StyleSheets$tableStyles)))(ri),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Element$paddingXY, 15, 5),
												$mdgriffith$elm_ui$Element$height(
												A2($mdgriffith$elm_ui$Element$minimum, 30, $mdgriffith$elm_ui$Element$fill))
											])),
									A2(
										$mdgriffith$elm_ui$Element$paragraph,
										_List_Nil,
										_List_fromArray(
											[
												$mdgriffith$elm_ui$Element$text(
												A2(
													$elm$core$Maybe$withDefault,
													'',
													A2($elm$core$Array$get, ci, row)))
											]))));
						}),
					lb: $mdgriffith$elm_ui$Element$fill
				};
			},
			A2($elm$core$List$range, 0, nbrCols - 1));
		return _List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$indexedTable,
				_Utils_ap(
					A2(
						$elm$core$Maybe$withDefault,
						_List_Nil,
						A2(
							$elm$core$Maybe$map,
							function ($) {
								return $.kE;
							},
							A2($elm$core$Dict$get, style, $author$project$Document$DocumentViews$StyleSheets$tableStyles))),
					_Utils_ap(
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
								$mdgriffith$elm_ui$Element$scrollbarX
							]),
						_Utils_ap(
							A2($author$project$Document$DocumentViews$DocumentView$idStyle, styleSheet, id),
							A2($author$project$Document$DocumentViews$DocumentView$renderAttrs, config, attrs)))),
				{hD: columns, hT: data})
			]);
	});
var $author$project$PageEditor$Internals$DocumentEditorHelpers$buildYoutubeUrl = F2(
	function (src, videoMeta) {
		var params = function (s) {
			return (s === '') ? s : ('?' + s);
		}(
			A2(
				$elm$core$String$join,
				'&',
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							A2(
							$elm$core$Maybe$map,
							function (n) {
								return 'start=' + $elm$core$String$fromInt(n);
							},
							videoMeta.ku),
							(!videoMeta.ih) ? $elm$core$Maybe$Just('frameborder=0') : $elm$core$Maybe$Nothing,
							(!videoMeta.kD) ? $elm$core$Maybe$Just('rel=0') : $elm$core$Maybe$Nothing,
							(!videoMeta.hL) ? $elm$core$Maybe$Just('controls=0') : $elm$core$Maybe$Nothing,
							(!videoMeta.d0) ? $elm$core$Maybe$Just('showinfo=0') : $elm$core$Maybe$Nothing
						]))));
		return 'https://www.youtube' + ((videoMeta.jO ? '-nocookie' : '') + ('.com/embed/' + (src + params)));
	});
var $author$project$Internals$CommonStyleHelpers$noHtmlAttr = $elm$html$Html$Attributes$class('');
var $elm$html$Html$Attributes$width = function (n) {
	return A2(
		_VirtualDom_attribute,
		'width',
		$elm$core$String$fromInt(n));
};
var $author$project$Document$DocumentViews$DocumentView$renderVideo = F4(
	function (config, id, attrs, vidMeta) {
		var uid = id.b0;
		var docStyleId = id.a8;
		var classes = id.a3;
		var styleSheet = $author$project$Document$DocumentViews$StyleSheets$defaultStyleSheet(config);
		var attrs_ = _Utils_ap(
			A2($author$project$Document$DocumentViews$DocumentView$idStyle, styleSheet, id),
			A2($author$project$Document$DocumentViews$DocumentView$renderAttrs, config, attrs));
		return _List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$el,
				_Utils_ap(
					_List_fromArray(
						[$mdgriffith$elm_ui$Element$centerX]),
					attrs_),
				$mdgriffith$elm_ui$Element$html(
					A2(
						$elm$html$Html$iframe,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$src(
								A2($author$project$PageEditor$Internals$DocumentEditorHelpers$buildYoutubeUrl, vidMeta.eT, vidMeta)),
								$elm$html$Html$Attributes$width(vidMeta.eS.k6),
								$elm$html$Html$Attributes$height(vidMeta.eS.k5),
								vidMeta.ih ? $author$project$Internals$CommonStyleHelpers$noHtmlAttr : A2($elm$html$Html$Attributes$attribute, 'frameborder', '0'),
								A2($elm$html$Html$Attributes$attribute, 'allowfullscreen', 'true'),
								A2($elm$html$Html$Attributes$attribute, 'allow', 'autoplay; encrypted-media')
							]),
						_List_Nil)))
			]);
	});
var $author$project$Document$DocumentViews$DocumentView$renderWeatherWidget = F3(
	function (config, id, attrs) {
		var device = $author$project$Document$DocumentViews$StyleSheets$getDevice(config);
		var widgetWidth = function () {
			var _v0 = device.b6;
			switch (_v0) {
				case 0:
					return $mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill);
				case 1:
					return $mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill);
				default:
					return $mdgriffith$elm_ui$Element$width(
						$mdgriffith$elm_ui$Element$px(300));
			}
		}();
		var containerWidth = $author$project$Document$DocumentViews$StyleSheets$getContainerWidth(config);
		var maxWidth = containerWidth - 40;
		return _List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$column,
				_Utils_ap(
					_List_fromArray(
						[
							widgetWidth,
							$mdgriffith$elm_ui$Element$alignTop,
							$mdgriffith$elm_ui$Element$centerX,
							$mdgriffith$elm_ui$Element$spacing(10)
						]),
					_Utils_ap(
						A2(
							$author$project$Document$DocumentViews$DocumentView$idStyle,
							$author$project$Document$DocumentViews$StyleSheets$defaultStyleSheet(config),
							id),
						A2($author$project$Document$DocumentViews$DocumentView$renderAttrs, config, attrs))),
				_List_fromArray(
					[
						A4($author$project$Document$DocumentViews$DocumentView$customHeading, config, 1, _List_Nil, 'METEO'),
						A2(
						$mdgriffith$elm_ui$Element$el,
						_List_fromArray(
							[$mdgriffith$elm_ui$Element$centerX]),
						$mdgriffith$elm_ui$Element$html(
							A2(
								$elm$html$Html$iframe,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'border-width', '0'),
										A2($elm$html$Html$Attributes$style, 'width', '300'),
										$elm$html$Html$Attributes$src('/meteo.html')
									]),
								_List_Nil)))
					]))
			]);
	});
var $author$project$Document$DocumentViews$DocumentView$renderColumn = F4(
	function (config, id, attrs, children) {
		var styleSheet = $author$project$Document$DocumentViews$StyleSheets$defaultStyleSheet(config);
		return _List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$column,
				_Utils_ap(
					styleSheet.hC,
					_Utils_ap(
						config.eb ? _List_fromArray(
							[
								$mdgriffith$elm_ui$Element$Background$color(
								A4($mdgriffith$elm_ui$Element$rgba, 0, 1, 0, 0.3))
							]) : _List_Nil,
						_Utils_ap(
							A2($author$project$Document$DocumentViews$DocumentView$idStyle, styleSheet, id),
							_Utils_ap(
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$width(
										A2($mdgriffith$elm_ui$Element$maximum, config.lb, $mdgriffith$elm_ui$Element$fill)),
										$mdgriffith$elm_ui$Element$alignTop
									]),
								A2($author$project$Document$DocumentViews$DocumentView$renderAttrs, config, attrs))))),
				A2(
					$elm$core$List$concatMap,
					$author$project$Document$DocumentViews$DocumentView$renderDoc(config),
					children))
			]);
	});
var $author$project$Document$DocumentViews$DocumentView$renderDoc = F2(
	function (config, document) {
		if (!document.$) {
			var containerLabel = document.a.a4;
			var id = document.a.c;
			var attrs = document.a.s;
			var children = document.b;
			switch (containerLabel) {
				case 0:
					return A4($author$project$Document$DocumentViews$DocumentView$renderColumn, config, id, attrs, children);
				case 1:
					return A4($author$project$Document$DocumentViews$DocumentView$renderRow, config, id, attrs, children);
				case 2:
					return A4($author$project$Document$DocumentViews$DocumentView$renderTextColumn, config, id, attrs, children);
				default:
					return A4($author$project$Document$DocumentViews$DocumentView$renderResponsiveBloc, config, id, attrs, children);
			}
		} else {
			var cellContent = document.a.aj;
			var id = document.a.c;
			var attrs = document.a.s;
			switch (cellContent.$) {
				case 0:
					var meta = cellContent.a;
					return A4($author$project$Document$DocumentViews$DocumentView$renderImage, config, id, attrs, meta);
				case 1:
					var meta = cellContent.a;
					return A4($author$project$Document$DocumentViews$DocumentView$renderVideo, config, id, attrs, meta);
				case 4:
					var meta = cellContent.a;
					return A4($author$project$Document$DocumentViews$DocumentView$renderBlockLinks, config, id, attrs, meta);
				case 5:
					var fichesId = cellContent.a;
					return A4($author$project$Document$DocumentViews$DocumentView$renderFiches, config, id, attrs, fichesId);
				case 7:
					return A3($author$project$Document$DocumentViews$DocumentView$renderNews, config, id, attrs);
				case 6:
					var xs = cellContent.a;
					return A4($author$project$Document$DocumentViews$DocumentView$renderTextBlock, config, id, attrs, xs);
				case 2:
					var meta = cellContent.a;
					return A4($author$project$Document$DocumentViews$DocumentView$renderTable, config, id, attrs, meta);
				case 3:
					var s = cellContent.a;
					return A4($author$project$Document$DocumentViews$DocumentView$renderCustomElement, config, id, attrs, s);
				case 14:
					var picLinks = cellContent.a;
					return A4($author$project$Document$DocumentViews$DocumentView$renderPictureLinks, config, id, attrs, picLinks);
				case 15:
					var galleryMeta = cellContent.a;
					return A4($author$project$Document$DocumentViews$DocumentView$renderGallery, config, id, attrs, galleryMeta);
				case 8:
					return A3($author$project$Document$DocumentViews$DocumentView$renderCalendarWidget, config, id, attrs);
				case 9:
					return A3($author$project$Document$DocumentViews$DocumentView$renderCalendar, config, id, attrs);
				case 10:
					return A3($author$project$Document$DocumentViews$DocumentView$renderCalendarSalleMurol, config, id, attrs);
				case 11:
					return A3($author$project$Document$DocumentViews$DocumentView$renderCalendarSalleBeaune, config, id, attrs);
				case 12:
					return A3($author$project$Document$DocumentViews$DocumentView$renderWeatherWidget, config, id, attrs);
				case 13:
					return A3($author$project$Document$DocumentViews$DocumentView$renderDronePanorama, config, id, attrs);
				case 16:
					return A3($author$project$Document$DocumentViews$DocumentView$renderMurolInfo, config, id, attrs);
				case 17:
					return A3($author$project$Document$DocumentViews$DocumentView$renderDelib, config, id, attrs);
				case 18:
					return A3($author$project$Document$DocumentViews$DocumentView$renderBulletin, config, id, attrs);
				default:
					return A3($author$project$Document$DocumentViews$DocumentView$renderEmptyCell, config, id, attrs);
			}
		}
	});
var $author$project$Document$DocumentViews$DocumentView$renderResponsiveBloc = F4(
	function (config, id, attrs, children) {
		var styleSheet = $author$project$Document$DocumentViews$StyleSheets$defaultStyleSheet(config);
		return _List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$row,
				_Utils_ap(
					styleSheet.jV,
					_Utils_ap(
						A2($author$project$Document$DocumentViews$DocumentView$idStyle, styleSheet, id),
						A2($author$project$Document$DocumentViews$DocumentView$renderAttrs, config, attrs))),
				A2(
					$elm$core$List$concatMap,
					$author$project$Document$DocumentViews$DocumentView$renderDoc(config),
					children))
			]);
	});
var $author$project$Document$DocumentViews$DocumentView$renderRow = F4(
	function (config, id, attrs, children) {
		var styleSheet = $author$project$Document$DocumentViews$StyleSheets$defaultStyleSheet(config);
		return _List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$row,
				_Utils_ap(
					styleSheet.j_,
					_Utils_ap(
						config.eb ? _List_fromArray(
							[
								$mdgriffith$elm_ui$Element$Background$color(
								A4($mdgriffith$elm_ui$Element$rgba, 1, 0, 0, 0.3))
							]) : _List_Nil,
						_Utils_ap(
							A2($author$project$Document$DocumentViews$DocumentView$idStyle, styleSheet, id),
							A2($author$project$Document$DocumentViews$DocumentView$renderAttrs, config, attrs)))),
				A2(
					$elm$core$List$concatMap,
					$author$project$Document$DocumentViews$DocumentView$renderDoc(config),
					children))
			]);
	});
var $author$project$Document$DocumentViews$DocumentView$renderTextColumn = F4(
	function (config, id, attrs, children) {
		var styleSheet = $author$project$Document$DocumentViews$StyleSheets$defaultStyleSheet(config);
		return _List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$textColumn,
				_Utils_ap(
					styleSheet.kM,
					_Utils_ap(
						config.eb ? _List_fromArray(
							[
								$mdgriffith$elm_ui$Element$Background$color(
								A4($mdgriffith$elm_ui$Element$rgba, 0, 0, 1, 0.3))
							]) : _List_Nil,
						_Utils_ap(
							A2($author$project$Document$DocumentViews$DocumentView$idStyle, styleSheet, id),
							A2($author$project$Document$DocumentViews$DocumentView$renderAttrs, config, attrs)))),
				A2(
					$elm$core$List$concatMap,
					$author$project$Document$DocumentViews$DocumentView$renderDoc(config),
					children))
			]);
	});
var $author$project$Document$Document$containsOnly = F2(
	function (p, document) {
		if (!document.$) {
			var nv = document.a;
			var children = document.b;
			return A3(
				$elm$core$List$foldr,
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
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $author$project$Document$DocumentViews$DocumentResponsive$flipTable = function (_v0) {
	var style = _v0.kA;
	var nbrRows = _v0.jg;
	var nbrCols = _v0.jf;
	var data = _v0.hT;
	var uncons = function (xs) {
		if (xs.b) {
			var x = xs.a;
			var xs_ = xs.b;
			return $elm$core$Maybe$Just(
				_Utils_Tuple2(x, xs_));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	};
	var inverse = F2(
		function (acc, xs) {
			inverse:
			while (true) {
				if (!xs.b) {
					return $elm$core$List$reverse(acc);
				} else {
					var xs_ = xs;
					var _v2 = A3(
						$elm$core$List$foldr,
						F2(
							function (_v3, _v4) {
								var h = _v3.a;
								var t = _v3.b;
								var hs = _v4.a;
								var ts = _v4.b;
								return _Utils_Tuple2(
									A2($elm$core$List$cons, h, hs),
									A2($elm$core$List$cons, t, ts));
							}),
						_Utils_Tuple2(_List_Nil, _List_Nil),
						A2($elm$core$List$filterMap, uncons, xs_));
					var heads = _v2.a;
					var tails = _v2.b;
					var tails_ = A2($elm$core$List$member, _List_Nil, tails) ? _List_Nil : tails;
					var $temp$acc = A2($elm$core$List$cons, heads, acc),
						$temp$xs = tails_;
					acc = $temp$acc;
					xs = $temp$xs;
					continue inverse;
				}
			}
		});
	var newData = A2(
		$elm$core$List$map,
		$elm$core$Array$fromList,
		A2(
			inverse,
			_List_Nil,
			A2($elm$core$List$map, $elm$core$Array$toList, data)));
	return {hT: newData, jf: nbrRows, jg: nbrCols, kA: style};
};
var $author$project$Document$Document$isImage = function (document) {
	if (document.$ === 1) {
		var lv = document.a;
		var _v1 = lv.aj;
		if (!_v1.$) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
};
var $author$project$Document$DocumentViews$DocumentResponsive$renderSameHeightImgRow = F2(
	function (containerWidth, document) {
		if (document.$ === 1) {
			return document;
		} else {
			var id_ = document.a;
			var children = document.b;
			var imgSizes = function (imgs) {
				return A2(
					$elm$core$List$map,
					function (i) {
						return i.cU.eS;
					},
					imgs);
			};
			var minHeight = function (imgs) {
				return A2(
					$elm$core$Maybe$withDefault,
					0,
					$elm$core$List$head(
						$elm$core$List$sort(
							A2(
								$elm$core$List$map,
								function ($) {
									return $.iH;
								},
								imgSizes(imgs)))));
			};
			var images = A3(
				$elm$core$List$foldr,
				F2(
					function (doc, acc) {
						if (!doc.$) {
							return acc;
						} else {
							var lv = doc.a;
							var _v3 = lv.aj;
							if (!_v3.$) {
								var meta = _v3.a;
								var src = meta.eT;
								var caption = meta.fb;
								var size = meta.eS;
								return A2(
									$elm$core$List$cons,
									{s: lv.s, c: lv.c, cU: meta, fT: 0, dK: 0},
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
				var scale = function (_v1) {
					var meta = _v1.cU;
					var attrs = _v1.s;
					var id = _v1.c;
					return {s: attrs, c: id, cU: meta, fT: mh + 5, dK: (mh * meta.eS.iI) / meta.eS.iH};
				};
				return A2($elm$core$List$map, scale, images);
			}();
			var totalImgWidth = A3(
				$elm$core$List$foldr,
				F2(
					function (i, n) {
						return i.dK + n;
					}),
				0,
				imgsScaledToMinHeight);
			return A2(
				$author$project$Document$Document$Container,
				_Utils_update(
					id_,
					{
						s: _Utils_ap(
							id_.s,
							_List_fromArray(
								[
									A2($author$project$Document$Document$SpacingXY, 7, 0)
								]))
					}),
				A2(
					$elm$core$List$map,
					function (im) {
						return $author$project$Document$Document$Cell(
							{
								s: _Utils_ap(
									_List_fromArray(
										[
											$author$project$Document$Document$FillPortion(
											$elm$core$Basics$floor((10000 * im.dK) / totalImgWidth))
										]),
									im.s),
								aj: $author$project$Document$Document$Image(im.cU),
								c: im.c
							});
					},
					imgsScaledToMinHeight));
		}
	});
var $author$project$Document$DocumentViews$DocumentResponsive$responsivePreFormat = F2(
	function (config, document) {
		var device = $author$project$Document$DocumentViews$StyleSheets$getDevice(config);
		if (!document.$) {
			var nv = document.a;
			var containerLabel = nv.a4;
			var id = nv.c;
			var attrs = nv.s;
			var children = document.b;
			switch (containerLabel) {
				case 0:
					var addColImgClass = function (doc) {
						if (doc.$ === 1) {
							var l = doc;
							var lv = l.a;
							var _v3 = lv.aj;
							if (!_v3.$) {
								var meta = _v3.a;
								var lId = lv.c;
								return $author$project$Document$Document$Cell(
									{
										s: lv.s,
										aj: lv.aj,
										c: _Utils_update(
											lId,
											{
												a3: A2($elm$core$Set$insert, 'colImg', lId.a3)
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
					var children_ = A2($elm$core$List$map, addColImgClass, children);
					return A2(
						$author$project$Document$Document$Container,
						nv,
						A2(
							$elm$core$List$map,
							$author$project$Document$DocumentViews$DocumentResponsive$responsivePreFormat(config),
							children_));
				case 1:
					return ((!device.b6) || (device.b6 === 1)) ? A2(
						$author$project$Document$DocumentViews$DocumentResponsive$responsivePreFormat,
						config,
						A2(
							$author$project$Document$Document$Container,
							_Utils_update(
								nv,
								{a4: 0}),
							children)) : (A2($author$project$Document$Document$containsOnly, $author$project$Document$Document$isImage, document) ? A2($author$project$Document$DocumentViews$DocumentResponsive$renderSameHeightImgRow, config.lb, document) : A2(
						$author$project$Document$Document$Container,
						nv,
						A2(
							$elm$core$List$map,
							$author$project$Document$DocumentViews$DocumentResponsive$responsivePreFormat(config),
							children)));
				case 2:
					return ((!device.b6) || (device.b6 === 1)) ? A2(
						$author$project$Document$DocumentViews$DocumentResponsive$responsivePreFormat,
						config,
						A2(
							$author$project$Document$Document$Container,
							_Utils_update(
								nv,
								{a4: 0}),
							children)) : A2(
						$author$project$Document$Document$Container,
						nv,
						A2(
							$elm$core$List$map,
							$author$project$Document$DocumentViews$DocumentResponsive$responsivePreFormat(config),
							children));
				default:
					return A2(
						$author$project$Document$Document$Container,
						nv,
						A2(
							$elm$core$List$map,
							$author$project$Document$DocumentViews$DocumentResponsive$responsivePreFormat(config),
							children));
			}
		} else {
			var l = document;
			var cellContent = l.a.aj;
			var id = l.a.c;
			var attrs = l.a.s;
			switch (cellContent.$) {
				case 0:
					var meta = cellContent.a;
					return l;
				case 1:
					var meta = cellContent.a;
					return l;
				case 4:
					var meta = cellContent.a;
					return l;
				case 5:
					var f = cellContent.a;
					return l;
				case 7:
					return l;
				case 6:
					var xs = cellContent.a;
					return l;
				case 2:
					var meta = cellContent.a;
					return (((!device.b6) || (device.b6 === 1)) && (_Utils_cmp(meta.jf, meta.jg) > 0)) ? $author$project$Document$Document$Cell(
						{
							s: attrs,
							aj: $author$project$Document$Document$Table(
								$author$project$Document$DocumentViews$DocumentResponsive$flipTable(meta)),
							c: id
						}) : l;
				case 3:
					var s = cellContent.a;
					return l;
				case 19:
					return l;
				default:
					return l;
			}
		}
	});
var $author$project$PageTreeEditor$PageTreeEditor$LastChild = function (a) {
	return {$: 0, a: a};
};
var $author$project$PageTreeEditor$PageTreeEditor$NotLastChild = function (a) {
	return {$: 1, a: a};
};
var $author$project$PageTreeEditor$PageTreeEditor$prefix = function (offsets) {
	var attrs = function (sel) {
		return _List_fromArray(
			[
				sel ? $mdgriffith$elm_ui$Element$Font$color(
				A4($mdgriffith$elm_ui$Element$rgba, 0, 0, 1, 1)) : $mdgriffith$elm_ui$Element$Font$color(
				A4($mdgriffith$elm_ui$Element$rgba, 0.8, 0.8, 0.8, 1))
			]);
	};
	var helper = F2(
		function (acc, indexes) {
			helper:
			while (true) {
				if (!indexes.b) {
					return _List_fromArray(
						[
							A2($mdgriffith$elm_ui$Element$row, _List_Nil, acc)
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
										$mdgriffith$elm_ui$Element$el,
										attrs(sel),
										$mdgriffith$elm_ui$Element$text(
											A2($elm$core$String$repeat, 3, ' ') + '└─ '))
									]));
						} else {
							var sel = indexes.a.a;
							var xs = indexes.b;
							var $temp$acc = _Utils_ap(
								acc,
								_List_fromArray(
									[
										A2(
										$mdgriffith$elm_ui$Element$row,
										attrs(sel),
										_List_fromArray(
											[
												$mdgriffith$elm_ui$Element$text(
												A2($elm$core$String$repeat, 3, ' ') + ' ')
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
										$mdgriffith$elm_ui$Element$el,
										attrs(sel),
										$mdgriffith$elm_ui$Element$text(
											A2($elm$core$String$repeat, 3, ' ') + '├─ '))
									]));
						} else {
							var sel = indexes.a.a;
							var xs = indexes.b;
							var $temp$acc = _Utils_ap(
								acc,
								_List_fromArray(
									[
										A2(
										$mdgriffith$elm_ui$Element$el,
										attrs(sel),
										$mdgriffith$elm_ui$Element$text(
											A2($elm$core$String$repeat, 3, ' ') + '│'))
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
		$elm$core$List$reverse(offsets));
};
var $author$project$Murol$pageTreeView = F2(
	function (offsets, _v0) {
		var pageInfo = _v0.a;
		var children = _v0.b;
		var l = $elm$core$List$length(children);
		var _v1 = _Utils_Tuple2(
			A2($elm$core$List$take, l - 1, children),
			A2($elm$core$List$drop, l - 1, children));
		var firsts = _v1.a;
		var last = _v1.b;
		return _Utils_ap(
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$row,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
						]),
					_Utils_ap(
						$author$project$PageTreeEditor$PageTreeEditor$prefix(offsets),
						_List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Element$Keyed$el,
								_List_Nil,
								_Utils_Tuple2(
									A2($elm$core$String$join, '/', pageInfo.D),
									A2(
										$mdgriffith$elm_ui$Element$link,
										_List_fromArray(
											[
												$mdgriffith$elm_ui$Element$mouseOver(
												_List_fromArray(
													[
														$mdgriffith$elm_ui$Element$Font$color(
														A3($mdgriffith$elm_ui$Element$rgb255, 136, 149, 167))
													]))
											]),
										{
											F: $mdgriffith$elm_ui$Element$text(
												$elm_community$string_extra$String$Extra$toSentenceCase(pageInfo.C)),
											da: '/' + A2($elm$core$String$join, '/', pageInfo.D)
										})))
							])))
				]),
			_Utils_ap(
				A2(
					$elm$core$List$concatMap,
					$author$project$Murol$pageTreeView(
						A2(
							$elm$core$List$cons,
							$author$project$PageTreeEditor$PageTreeEditor$NotLastChild(true),
							offsets)),
					firsts),
				A2(
					$elm$core$List$concatMap,
					$author$project$Murol$pageTreeView(
						A2(
							$elm$core$List$cons,
							$author$project$PageTreeEditor$PageTreeEditor$LastChild(true),
							offsets)),
					last)));
	});
var $author$project$Murol$sitemapView = F2(
	function (model, maxWidth) {
		return A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$centerX,
					$mdgriffith$elm_ui$Element$width(
					A2($mdgriffith$elm_ui$Element$maximum, maxWidth, $mdgriffith$elm_ui$Element$fill)),
					$mdgriffith$elm_ui$Element$Background$color(
					A4($mdgriffith$elm_ui$Element$rgba, 1, 1, 1, 0.9)),
					$mdgriffith$elm_ui$Element$padding(15),
					$mdgriffith$elm_ui$Element$height(
					A2($mdgriffith$elm_ui$Element$minimum, 300, $mdgriffith$elm_ui$Element$fill))
				]),
			_List_fromArray(
				[
					A4($author$project$Document$DocumentViews$DocumentView$customHeading, model.a, 1, _List_Nil, 'Plan de site'),
					A2(
					$mdgriffith$elm_ui$Element$column,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$spacing(2),
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$Font$size(16),
							$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$padding(15)
						]),
					A2(
						$elm$core$Maybe$withDefault,
						_List_Nil,
						A2(
							$elm$core$Maybe$map,
							$author$project$Murol$pageTreeView(_List_Nil),
							model.cm)))
				]));
	});
var $author$project$Murol$mainView = F2(
	function (maxWidth, model) {
		var loadingView = A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$centerX,
					$mdgriffith$elm_ui$Element$width(
					A2($mdgriffith$elm_ui$Element$maximum, maxWidth, $mdgriffith$elm_ui$Element$fill)),
					$mdgriffith$elm_ui$Element$Background$color(
					A4($mdgriffith$elm_ui$Element$rgba, 1, 1, 1, 0.9)),
					$mdgriffith$elm_ui$Element$clipX,
					$mdgriffith$elm_ui$Element$padding(15),
					$mdgriffith$elm_ui$Element$height(
					$mdgriffith$elm_ui$Element$px(300))
				]),
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$column,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$centerY,
							$mdgriffith$elm_ui$Element$centerX,
							$mdgriffith$elm_ui$Element$spacing(15)
						]),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Element$el,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$centerX,
									$mdgriffith$elm_ui$Element$width(
									$mdgriffith$elm_ui$Element$px(100)),
									$mdgriffith$elm_ui$Element$height(
									$mdgriffith$elm_ui$Element$px(100)),
									$mdgriffith$elm_ui$Element$Background$image('/assets/images/loading.gif')
								]),
							$mdgriffith$elm_ui$Element$none),
							A2(
							$mdgriffith$elm_ui$Element$el,
							_List_fromArray(
								[$mdgriffith$elm_ui$Element$centerX]),
							$mdgriffith$elm_ui$Element$text('Chargement en cours...'))
						]))
				]));
		var _v0 = A2($elm$core$Dict$get, model.da.D, model.aY);
		_v0$2:
		while (true) {
			if (!_v0.$) {
				switch (_v0.a.c.$) {
					case 2:
						var _v1 = _v0.a;
						var cId = _v1.a;
						var name = _v1.b;
						var doc = _v1.c.a;
						return A2(
							$mdgriffith$elm_ui$Element$column,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$centerX,
									$mdgriffith$elm_ui$Element$width(
									A2($mdgriffith$elm_ui$Element$maximum, maxWidth, $mdgriffith$elm_ui$Element$fill)),
									$mdgriffith$elm_ui$Element$Background$color(
									A4($mdgriffith$elm_ui$Element$rgba, 1, 1, 1, 0.9)),
									$mdgriffith$elm_ui$Element$clipX
								]),
							A2(
								$author$project$Document$DocumentViews$DocumentView$renderDoc,
								model.a,
								A2($author$project$Document$DocumentViews$DocumentResponsive$responsivePreFormat, model.a, doc)));
					case 1:
						var _v2 = _v0.a;
						var cId = _v2.a;
						var name = _v2.b;
						var _v3 = _v2.c;
						return loadingView;
					default:
						break _v0$2;
				}
			} else {
				break _v0$2;
			}
		}
		return (model.da.D === '/accueil/plan%20de%20site') ? A2($author$project$Murol$sitemapView, model, maxWidth) : ((model.da.D === '/accueil/contact') ? A2($author$project$Murol$contactView, model, maxWidth) : ((model.da.D === '/accueil/mentions%20l%C3%A9gales') ? A2($author$project$Murol$legalView, model, maxWidth) : (model.dy ? A2(
			$mdgriffith$elm_ui$Element$el,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$centerX,
					$mdgriffith$elm_ui$Element$width(
					A2($mdgriffith$elm_ui$Element$maximum, maxWidth, $mdgriffith$elm_ui$Element$fill)),
					$mdgriffith$elm_ui$Element$Background$color(
					A4($mdgriffith$elm_ui$Element$rgba, 1, 1, 1, 0.9)),
					$mdgriffith$elm_ui$Element$padding(15),
					$mdgriffith$elm_ui$Element$height(
					$mdgriffith$elm_ui$Element$px(300))
				]),
			$mdgriffith$elm_ui$Element$text('Pas de contenu.')) : loadingView)));
	});
var $author$project$Murol$noAttr = $mdgriffith$elm_ui$Element$htmlAttribute(
	$elm$html$Html$Attributes$class(''));
var $mdgriffith$elm_ui$Internal$Model$Serif = {$: 0};
var $mdgriffith$elm_ui$Element$Font$serif = $mdgriffith$elm_ui$Internal$Model$Serif;
var $author$project$Murol$pageTitleView = F2(
	function (maxWidth, model) {
		var seasonAttr = function () {
			var _v0 = model.a.j5;
			switch (_v0) {
				case 0:
					return _List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							A4($mdgriffith$elm_ui$Element$rgba255, 76, 115, 56, 255))
						]);
				case 1:
					return _List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							A4($mdgriffith$elm_ui$Element$rgba255, 19, 46, 117, 255)),
							$mdgriffith$elm_ui$Element$Font$color(
							A4($mdgriffith$elm_ui$Element$rgba255, 240, 248, 255, 1))
						]);
				case 2:
					return _List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							A4($mdgriffith$elm_ui$Element$rgba255, 255, 211, 37, 255))
						]);
				default:
					return _List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							A4($mdgriffith$elm_ui$Element$rgba255, 0, 0, 51, 255)),
							$mdgriffith$elm_ui$Element$Font$color(
							A4($mdgriffith$elm_ui$Element$rgba255, 240, 248, 255, 1))
						]);
			}
		}();
		return A2(
			$mdgriffith$elm_ui$Element$link,
			_Utils_ap(
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$Font$size(45),
						$mdgriffith$elm_ui$Element$Font$center,
						$mdgriffith$elm_ui$Element$width(
						A2($mdgriffith$elm_ui$Element$maximum, maxWidth, $mdgriffith$elm_ui$Element$fill)),
						$mdgriffith$elm_ui$Element$centerX,
						$mdgriffith$elm_ui$Element$Font$italic,
						$mdgriffith$elm_ui$Element$Font$family(
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$Font$typeface('lora'),
								$mdgriffith$elm_ui$Element$Font$serif
							])),
						$mdgriffith$elm_ui$Element$paddingEach(
						{aR: 10, aU: 0, a0: 0, a1: 7})
					]),
				seasonAttr),
			{
				F: $mdgriffith$elm_ui$Element$text('Murol'),
				da: '/accueil'
			});
	});
var $author$project$Murol$Search = {$: 8};
var $author$project$Murol$SearchPromptInput = function (a) {
	return {$: 7, a: a};
};
var $mdgriffith$elm_ui$Element$Input$OnLeft = 1;
var $mdgriffith$elm_ui$Element$Input$labelLeft = $mdgriffith$elm_ui$Element$Input$Label(1);
var $author$project$Murol$ResetSearchEngine = {$: 9};
var $elm$html$Html$Events$keyCode = A2($elm$json$Json$Decode$field, 'keyCode', $elm$json$Json$Decode$int);
var $author$project$Murol$onKeyEvent = $mdgriffith$elm_ui$Element$htmlAttribute(
	A2(
		$elm$html$Html$Events$on,
		'keyup',
		A2(
			$elm$json$Json$Decode$map,
			function (kc) {
				return (kc === 13) ? $author$project$Murol$Search : ((kc === 27) ? $author$project$Murol$ResetSearchEngine : $author$project$Murol$NoOp);
			},
			$elm$html$Html$Events$keyCode)));
var $mdgriffith$elm_ui$Element$Input$Placeholder = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $mdgriffith$elm_ui$Element$Input$placeholder = $mdgriffith$elm_ui$Element$Input$Placeholder;
var $author$project$Murol$resView = F3(
	function (pagesIndex, cId, _v0) {
		var score = _v0.a;
		var keywords = _v0.b;
		var _v1 = A2($elm$core$Dict$get, cId, pagesIndex);
		if (!_v1.$) {
			var _v2 = _v1.a;
			var name = _v2.a;
			var path = _v2.b;
			var keywordView = function (keyword) {
				return A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$pointer,
							$mdgriffith$elm_ui$Element$Events$onClick(
							$author$project$Murol$SearchPromptInput(keyword)),
							$mdgriffith$elm_ui$Element$Background$color(
							A4($mdgriffith$elm_ui$Element$rgba255, 119, 136, 153, 0.8)),
							$mdgriffith$elm_ui$Element$Font$color(
							A3($mdgriffith$elm_ui$Element$rgb, 1, 1, 1)),
							$mdgriffith$elm_ui$Element$paddingEach(
							{aR: 2, aU: 5, a0: 5, a1: 2}),
							$mdgriffith$elm_ui$Element$Border$roundEach(
							{e9: 0, fa: 0, gB: 5, gC: 0})
						]),
					$mdgriffith$elm_ui$Element$text(keyword));
			};
			return A2(
				$mdgriffith$elm_ui$Element$column,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$spacing(10),
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
						$mdgriffith$elm_ui$Element$Border$widthEach(
						{aR: 0, aU: 0, a0: 0, a1: 1}),
						$mdgriffith$elm_ui$Element$Border$color(
						A3($mdgriffith$elm_ui$Element$rgb, 0.8, 0.8, 0.8)),
						A2($mdgriffith$elm_ui$Element$paddingXY, 0, 10)
					]),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$link,
						_List_Nil,
						{
							F: A2(
								$mdgriffith$elm_ui$Element$el,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$Font$color(
										A3($mdgriffith$elm_ui$Element$rgb, 0, 0.5, 0.5))
									]),
								$mdgriffith$elm_ui$Element$text(name)),
							da: path
						}),
						A2(
						$mdgriffith$elm_ui$Element$wrappedRow,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$spacing(10)
							]),
						A2(
							$elm$core$List$map,
							keywordView,
							$elm$core$Set$toList(keywords)))
					]));
		} else {
			return $mdgriffith$elm_ui$Element$none;
		}
	});
var $author$project$Murol$searchEngineView = F2(
	function (maxWidth, model) {
		var pagesIndex = A3(
			$elm$core$Dict$foldr,
			F3(
				function (path, _v6, acc) {
					var cId = _v6.a;
					var name = _v6.b;
					var l = _v6.c;
					return A3(
						$elm$core$Dict$insert,
						cId,
						_Utils_Tuple2(name, path),
						acc);
				}),
			$elm$core$Dict$empty,
			model.aY);
		return A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$spacing(15),
					$mdgriffith$elm_ui$Element$centerX,
					$mdgriffith$elm_ui$Element$width(
					A2($mdgriffith$elm_ui$Element$maximum, maxWidth, $mdgriffith$elm_ui$Element$fill)),
					$mdgriffith$elm_ui$Element$paddingEach(
					{aR: 0, aU: 20, a0: 20, a1: 15}),
					$mdgriffith$elm_ui$Element$Background$color(
					A4($mdgriffith$elm_ui$Element$rgba, 1, 1, 1, 0.9))
				]),
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$row,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$spacing(15),
							$mdgriffith$elm_ui$Element$width(
							A2($mdgriffith$elm_ui$Element$maximum, maxWidth, $mdgriffith$elm_ui$Element$fill)),
							$mdgriffith$elm_ui$Element$paddingEach(
							{aR: 0, aU: 0, a0: 0, a1: 5})
						]),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Element$Input$text,
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Element$paddingXY, 5, 5),
									$mdgriffith$elm_ui$Element$spacing(15),
									$mdgriffith$elm_ui$Element$focused(
									_List_fromArray(
										[
											A2(
											$mdgriffith$elm_ui$Element$Border$glow,
											A3($mdgriffith$elm_ui$Element$rgb, 1, 1, 1),
											0)
										])),
									(model.a.lb < 500) ? $mdgriffith$elm_ui$Element$width(
									$mdgriffith$elm_ui$Element$px(150)) : $mdgriffith$elm_ui$Element$width(
									$mdgriffith$elm_ui$Element$px(270)),
									$author$project$Murol$onKeyEvent
								]),
							{
								F: A2($mdgriffith$elm_ui$Element$Input$labelLeft, _List_Nil, $mdgriffith$elm_ui$Element$none),
								cW: $author$project$Murol$SearchPromptInput,
								c0: $elm$core$Maybe$Just(
									A2(
										$mdgriffith$elm_ui$Element$Input$placeholder,
										_List_Nil,
										$mdgriffith$elm_ui$Element$text('mot clés'))),
								c3: model.cr
							}),
							A2(
							$mdgriffith$elm_ui$Element$Input$button,
							$author$project$Internals$CommonStyleHelpers$buttonStyle((model.cr !== '') && (model.bY !== 1)),
							{
								F: A2(
									$mdgriffith$elm_ui$Element$el,
									_List_Nil,
									$mdgriffith$elm_ui$Element$text('Rechercher')),
								ax: $elm$core$Maybe$Just($author$project$Murol$Search)
							})
						])),
					function () {
					var _v0 = model.bY;
					switch (_v0) {
						case 1:
							return A2(
								$mdgriffith$elm_ui$Element$el,
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Element$paddingXY, 15, 0)
									]),
								$mdgriffith$elm_ui$Element$text('recherche en cours...'));
						case 2:
							var _v1 = model.dY;
							if (!_v1.$) {
								var _v2 = _v1.a;
								var keywords = _v2.a;
								var results = _v2.b;
								return _Utils_eq(results, $elm$core$Dict$empty) ? A2(
									$mdgriffith$elm_ui$Element$el,
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Element$paddingXY, 15, 0)
										]),
									$mdgriffith$elm_ui$Element$text('pas de resultats')) : A2(
									$mdgriffith$elm_ui$Element$column,
									_List_fromArray(
										[
											$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
											$mdgriffith$elm_ui$Element$height(
											A2($mdgriffith$elm_ui$Element$maximum, 200, $mdgriffith$elm_ui$Element$fill)),
											$mdgriffith$elm_ui$Element$clip,
											$mdgriffith$elm_ui$Element$scrollbarY,
											A2($mdgriffith$elm_ui$Element$paddingXY, 15, 0)
										]),
									A2(
										$elm$core$List$map,
										function (_v5) {
											var cId = _v5.a;
											var v = _v5.b;
											return A3($author$project$Murol$resView, pagesIndex, cId, v);
										},
										$elm$core$List$reverse(
											A2(
												$elm$core$List$sortBy,
												function (_v3) {
													var k = _v3.a;
													var _v4 = _v3.b;
													var score = _v4.a;
													return score;
												},
												$elm$core$Dict$toList(results)))));
							} else {
								return A2(
									$mdgriffith$elm_ui$Element$el,
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Element$paddingXY, 15, 0)
										]),
									$mdgriffith$elm_ui$Element$text('pas de resultats'));
							}
						default:
							return $mdgriffith$elm_ui$Element$none;
					}
				}()
				]));
	});
var $author$project$Murol$subTitleView = F2(
	function (maxWidth, model) {
		var seasonAttr = function () {
			var _v0 = model.a.j5;
			switch (_v0) {
				case 0:
					return _List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							A4($mdgriffith$elm_ui$Element$rgba255, 41, 80, 0, 1)),
							$mdgriffith$elm_ui$Element$Font$color(
							A4($mdgriffith$elm_ui$Element$rgba255, 240, 248, 255, 255))
						]);
				case 1:
					return _List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							A4($mdgriffith$elm_ui$Element$rgba255, 38, 110, 182, 1)),
							$mdgriffith$elm_ui$Element$Font$color(
							A4($mdgriffith$elm_ui$Element$rgba255, 240, 248, 255, 1))
						]);
				case 2:
					return _List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							A4($mdgriffith$elm_ui$Element$rgba255, 69, 22, 6, 1)),
							$mdgriffith$elm_ui$Element$Font$color(
							A4($mdgriffith$elm_ui$Element$rgba255, 240, 248, 255, 255))
						]);
				default:
					return _List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							A4($mdgriffith$elm_ui$Element$rgba255, 240, 248, 255, 1)),
							$mdgriffith$elm_ui$Element$Font$color(
							A4($mdgriffith$elm_ui$Element$rgba255, 0, 0, 51, 255))
						]);
			}
		}();
		return A2(
			$mdgriffith$elm_ui$Element$el,
			_Utils_ap(
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$Font$size(24),
						$mdgriffith$elm_ui$Element$Font$family(
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$Font$typeface('lora'),
								$mdgriffith$elm_ui$Element$Font$serif
							])),
						$mdgriffith$elm_ui$Element$Font$center,
						$mdgriffith$elm_ui$Element$Font$italic,
						$mdgriffith$elm_ui$Element$width(
						A2($mdgriffith$elm_ui$Element$maximum, maxWidth, $mdgriffith$elm_ui$Element$fill)),
						$mdgriffith$elm_ui$Element$centerX,
						$mdgriffith$elm_ui$Element$paddingEach(
						{aR: 8, aU: 0, a0: 0, a1: 3})
					]),
				seasonAttr),
			A2(
				$mdgriffith$elm_ui$Element$paragraph,
				_List_Nil,
				_List_fromArray(
					[
						(!A2($elm$time$Time$toMonth, model.a.e0, model.a.hO)) ? $mdgriffith$elm_ui$Element$text(
						'La municipalité de Murol vous souhaite une bonne année ' + $elm$core$String$fromInt(
							A2($elm$time$Time$toYear, model.a.e0, model.a.hO))) : $mdgriffith$elm_ui$Element$text('La municipalité de Murol vous souhaite la bienvenue')
					])));
	});
var $author$project$Murol$FoldTopic = {$: 16};
var $author$project$Murol$UnfoldTopic = function (a) {
	return {$: 17, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$Below = 1;
var $mdgriffith$elm_ui$Element$below = function (element) {
	return A2($mdgriffith$elm_ui$Internal$Model$Nearby, 1, element);
};
var $elm$html$Html$Events$onMouseEnter = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseenter',
		$elm$json$Json$Decode$succeed(msg));
};
var $mdgriffith$elm_ui$Element$Events$onMouseEnter = A2($elm$core$Basics$composeL, $mdgriffith$elm_ui$Internal$Model$Attr, $elm$html$Html$Events$onMouseEnter);
var $elm$html$Html$Events$onMouseLeave = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseleave',
		$elm$json$Json$Decode$succeed(msg));
};
var $mdgriffith$elm_ui$Element$Events$onMouseLeave = A2($elm$core$Basics$composeL, $mdgriffith$elm_ui$Internal$Model$Attr, $elm$html$Html$Events$onMouseLeave);
var $author$project$Murol$topMenuStyle = function (season) {
	switch (season) {
		case 0:
			return {
				ah: A4($mdgriffith$elm_ui$Element$rgba255, 76, 115, 56, 1),
				aF: A4($mdgriffith$elm_ui$Element$rgba255, 0, 0, 0, 1),
				W: A4($mdgriffith$elm_ui$Element$rgba255, 226, 242, 211, 1),
				cy: A4($mdgriffith$elm_ui$Element$rgba255, 206, 222, 191, 1)
			};
		case 1:
			return {
				ah: A4($mdgriffith$elm_ui$Element$rgba255, 186, 172, 145, 1),
				aF: A4($mdgriffith$elm_ui$Element$rgba255, 0, 0, 0, 1),
				W: A4($mdgriffith$elm_ui$Element$rgba255, 206, 192, 165, 1),
				cy: A4($mdgriffith$elm_ui$Element$rgba255, 196, 182, 155, 1)
			};
		case 2:
			return {
				ah: A4($mdgriffith$elm_ui$Element$rgba255, 255, 211, 37, 1),
				aF: A4($mdgriffith$elm_ui$Element$rgba255, 0, 0, 0, 1),
				W: A4($mdgriffith$elm_ui$Element$rgba255, 255, 237, 167, 1),
				cy: A4($mdgriffith$elm_ui$Element$rgba255, 229, 189, 33, 1)
			};
		default:
			return {
				ah: A4($mdgriffith$elm_ui$Element$rgba255, 128, 128, 170, 1),
				aF: A4($mdgriffith$elm_ui$Element$rgba255, 0, 0, 0, 1),
				W: A4($mdgriffith$elm_ui$Element$rgba255, 227, 233, 255, 1),
				cy: A4($mdgriffith$elm_ui$Element$rgba255, 197, 200, 248, 1)
			};
	}
};
var $author$project$Murol$topMenuView = function (model) {
	var _v0 = model.cm;
	if (!_v0.$) {
		var _v1 = _v0.a;
		var xs_ = _v1.b;
		var strPath = function (path) {
			return function (p) {
				return '/' + p;
			}(
				A2(
					$elm$core$String$join,
					'/',
					A2($elm$core$List$map, $elm$url$Url$percentEncode, path)));
		};
		var subCatView = function (_v4) {
			var pageInfo = _v4.a;
			return A2(
				$mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$Background$color(
						$author$project$Murol$topMenuStyle(model.a.j5).cy),
						$mdgriffith$elm_ui$Element$mouseOver(
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$Background$color(
								$author$project$Murol$topMenuStyle(model.a.j5).W)
							])),
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
					]),
				A2(
					$mdgriffith$elm_ui$Element$link,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$padding(10),
							$mdgriffith$elm_ui$Element$Font$color(
							$author$project$Murol$topMenuStyle(model.a.j5).aF)
						]),
					{
						F: A2(
							$mdgriffith$elm_ui$Element$el,
							_List_Nil,
							$mdgriffith$elm_ui$Element$text(
								$elm_community$string_extra$String$Extra$toSentenceCase(pageInfo.C))),
						da: strPath(pageInfo.D)
					}));
		};
		var mobileMainCatView = function (_v3) {
			var pageInfo = _v3.a;
			var xs = _v3.b;
			return A2(
				$mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$mouseOver(
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$Background$color(
								$author$project$Murol$topMenuStyle(model.a.j5).W)
							])),
						$mdgriffith$elm_ui$Element$Background$color(
						$author$project$Murol$topMenuStyle(model.a.j5).ah),
						$mdgriffith$elm_ui$Element$Font$color(
						$author$project$Murol$topMenuStyle(model.a.j5).aF),
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
					]),
				A2(
					$mdgriffith$elm_ui$Element$link,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$padding(15)
						]),
					{
						F: A2(
							$mdgriffith$elm_ui$Element$el,
							_List_fromArray(
								[$mdgriffith$elm_ui$Element$Font$bold]),
							$mdgriffith$elm_ui$Element$text(
								$elm_community$string_extra$String$Extra$toSentenceCase(pageInfo.C))),
						da: strPath(pageInfo.D)
					}));
		};
		var menu = A2(
			$elm$core$List$cons,
			A2(
				$author$project$PageTreeEditor$PageTreeEditor$Page,
				{
					fP: $elm$core$Maybe$Nothing,
					C: 'accueil',
					D: _List_fromArray(
						['accueil'])
				},
				_List_Nil),
			xs_);
		var maxWidth = A3(
			$author$project$Document$DocumentViews$StyleSheets$docMaxWidth,
			_Utils_Tuple2(model.a.lb, model.a.iu),
			false,
			model.a.dT);
		var mainCatView = function (_v2) {
			var pageInfo = _v2.a;
			var xs = _v2.b;
			return A2(
				$mdgriffith$elm_ui$Element$column,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$alignTop,
						(model.a.lb >= 1000) ? $mdgriffith$elm_ui$Element$Events$onMouseEnter(
						$author$project$Murol$UnfoldTopic(pageInfo.C)) : $author$project$Murol$noAttr,
						(model.a.lb >= 1000) ? $mdgriffith$elm_ui$Element$Events$onMouseLeave($author$project$Murol$FoldTopic) : $author$project$Murol$noAttr,
						_Utils_eq(
						model.c7,
						$elm$core$Maybe$Just(pageInfo.C)) ? $mdgriffith$elm_ui$Element$below(
						A2(
							$mdgriffith$elm_ui$Element$column,
							_List_Nil,
							A2($elm$core$List$map, subCatView, xs))) : $author$project$Murol$noAttr
					]),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$el,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$mouseOver(
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$Background$color(
										$author$project$Murol$topMenuStyle(model.a.j5).W)
									])),
								$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
							]),
						A2(
							$mdgriffith$elm_ui$Element$link,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
									$mdgriffith$elm_ui$Element$padding(15)
								]),
							{
								F: A2(
									$mdgriffith$elm_ui$Element$el,
									_List_fromArray(
										[$mdgriffith$elm_ui$Element$Font$bold]),
									$mdgriffith$elm_ui$Element$text(
										$elm_community$string_extra$String$Extra$toSentenceCase(pageInfo.C))),
								da: strPath(pageInfo.D)
							}))
					]));
		};
		return (model.a.lb <= 800) ? A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$width(
					A2($mdgriffith$elm_ui$Element$maximum, maxWidth, $mdgriffith$elm_ui$Element$fill)),
					$mdgriffith$elm_ui$Element$spacing(5),
					A2($mdgriffith$elm_ui$Element$paddingXY, 15, 0),
					$mdgriffith$elm_ui$Element$Background$color(
					A4($mdgriffith$elm_ui$Element$rgba, 1, 1, 1, 0.9))
				]),
			A2($elm$core$List$map, mobileMainCatView, menu)) : A2(
			$mdgriffith$elm_ui$Element$row,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$centerX,
					$mdgriffith$elm_ui$Element$width(
					A2($mdgriffith$elm_ui$Element$maximum, maxWidth, $mdgriffith$elm_ui$Element$fill)),
					$mdgriffith$elm_ui$Element$Background$color(
					$author$project$Murol$topMenuStyle(model.a.j5).ah)
				]),
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$row,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$centerX,
							$mdgriffith$elm_ui$Element$spacing(40)
						]),
					A2($elm$core$List$map, mainCatView, menu))
				]));
	} else {
		return $mdgriffith$elm_ui$Element$none;
	}
};
var $author$project$Gallery$HeaderGallery$DragAt = function (a) {
	return {$: 2, a: a};
};
var $author$project$Gallery$HeaderGallery$DragEnd = {$: 3};
var $author$project$Gallery$HeaderGallery$DragStart = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$Behind = 5;
var $mdgriffith$elm_ui$Element$behindContent = function (element) {
	return A2($mdgriffith$elm_ui$Internal$Model$Nearby, 5, element);
};
var $author$project$Gallery$HeaderGallery$moveChunk = F2(
	function (config, model) {
		var animFun = function () {
			var _v2 = model.q;
			_v2$2:
			while (true) {
				if (!_v2.$) {
					switch (_v2.a.b) {
						case 0:
							var _v3 = _v2.a;
							var anim = _v3.a;
							var _v4 = _v3.b;
							return $mdgriffith$elm_ui$Element$moveLeft(
								config.ad + A2($mgold$elm_animation$Animation$animate, model.b7, anim));
						case 1:
							var _v5 = _v2.a;
							var anim = _v5.a;
							var _v6 = _v5.b;
							return $mdgriffith$elm_ui$Element$moveRight(
								((-1) * config.ad) + A2($mgold$elm_animation$Animation$animate, model.b7, anim));
						default:
							break _v2$2;
					}
				} else {
					break _v2$2;
				}
			}
			return $mdgriffith$elm_ui$Element$moveLeft(config.ad);
		}();
		var _v0 = model.aw;
		if (_v0.$ === 1) {
			return animFun;
		} else {
			var _v1 = _v0.a;
			var start = _v1.a;
			var stop = _v1.b;
			return ((start._ - stop._) <= 0) ? $mdgriffith$elm_ui$Element$moveRight(
				((-1) * config.ad) + $elm$core$Basics$abs(start._ - stop._)) : $mdgriffith$elm_ui$Element$moveLeft((config.ad + start._) - stop._);
		}
	});
var $author$project$Gallery$HeaderGallery$ImgLoaded = function (a) {
	return {$: 5, a: a};
};
var $author$project$Gallery$HeaderGallery$picView = F4(
	function (model, config, _v0, attrs) {
		var src = _v0.eT;
		return A2($elm$core$Set$member, src, model.fO) ? A2(
			$mdgriffith$elm_ui$Element$column,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$el,
					_Utils_ap(
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$width(
								$mdgriffith$elm_ui$Element$px(config.ad)),
								$mdgriffith$elm_ui$Element$height(
								$mdgriffith$elm_ui$Element$px(
									$elm$core$Basics$round(config.ad / 5))),
								$mdgriffith$elm_ui$Element$Background$image(src)
							]),
						_Utils_ap(attrs, $author$project$Internals$CommonStyleHelpers$unselectable)),
					$mdgriffith$elm_ui$Element$none)
				])) : A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Background$color($author$project$Internals$CommonStyleHelpers$grey5),
					$mdgriffith$elm_ui$Element$width(
					$mdgriffith$elm_ui$Element$px(config.ad)),
					$mdgriffith$elm_ui$Element$height(
					$mdgriffith$elm_ui$Element$px(
						$elm$core$Basics$round(config.ad / 5)))
				]),
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$image,
					_List_fromArray(
						[$mdgriffith$elm_ui$Element$centerX, $mdgriffith$elm_ui$Element$centerY, $mdgriffith$elm_ui$Element$clip]),
					{h$: 'chargement en cours', eT: '/assets/images/loading.gif'}),
					$mdgriffith$elm_ui$Element$html(
					A2(
						$elm$html$Html$img,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$hidden(true),
								A2(
								$elm$html$Html$Events$on,
								'load',
								$elm$json$Json$Decode$succeed(
									$author$project$Gallery$HeaderGallery$ImgLoaded(src))),
								$elm$html$Html$Attributes$src(src)
							]),
						_List_Nil))
				]));
	});
var $author$project$Gallery$HeaderGallery$chunkView = F3(
	function (model, config, chunk) {
		var frontOpacity = function () {
			var _v6 = model.q;
			if ((!_v6.$) && (_v6.a.b === 2)) {
				var _v7 = _v6.a;
				var anim = _v7.a;
				var _v8 = _v7.b;
				return $mdgriffith$elm_ui$Element$alpha(
					A2($mgold$elm_animation$Animation$animate, model.b7, anim));
			} else {
				return $mdgriffith$elm_ui$Element$alpha(1);
			}
		}();
		var backOpacity = function () {
			var _v3 = model.q;
			if ((!_v3.$) && (_v3.a.b === 2)) {
				var _v4 = _v3.a;
				var anim = _v4.a;
				var _v5 = _v4.b;
				return $mdgriffith$elm_ui$Element$alpha(
					1 - A2($mgold$elm_animation$Animation$animate, model.b7, anim));
			} else {
				return $mdgriffith$elm_ui$Element$alpha(0);
			}
		}();
		if (((chunk.b && chunk.b.b) && chunk.b.b.b) && (!chunk.b.b.b.b)) {
			var l = chunk.a;
			var _v1 = chunk.b;
			var c = _v1.a;
			var _v2 = _v1.b;
			var r = _v2.a;
			return A2(
				$mdgriffith$elm_ui$Element$Lazy$lazy,
				function (mc) {
					return A2(
						$mdgriffith$elm_ui$Element$row,
						_Utils_ap(
							A2(
								$author$project$Gallery$GalleryHelpers$events,
								model.aw,
								_Utils_Tuple3($author$project$Gallery$HeaderGallery$DragStart, $author$project$Gallery$HeaderGallery$DragAt, $author$project$Gallery$HeaderGallery$DragEnd)),
							_List_fromArray(
								[mc])),
						_List_fromArray(
							[
								A4($author$project$Gallery$HeaderGallery$picView, model, config, l, _List_Nil),
								A2(
								$mdgriffith$elm_ui$Element$el,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$behindContent(
										A4(
											$author$project$Gallery$HeaderGallery$picView,
											model,
											config,
											l,
											_List_fromArray(
												[backOpacity])))
									]),
								A4(
									$author$project$Gallery$HeaderGallery$picView,
									model,
									config,
									c,
									_List_fromArray(
										[frontOpacity]))),
								A4($author$project$Gallery$HeaderGallery$picView, model, config, r, _List_Nil)
							]));
				},
				A2($author$project$Gallery$HeaderGallery$moveChunk, config, model));
		} else {
			return $mdgriffith$elm_ui$Element$none;
		}
	});
var $author$project$Gallery$HeaderGallery$galleryView = F2(
	function (model, config) {
		return A2(
			$mdgriffith$elm_ui$Element$el,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$centerX,
					$mdgriffith$elm_ui$Element$clipX,
					$mdgriffith$elm_ui$Element$width(
					$mdgriffith$elm_ui$Element$px(config.ad)),
					$mdgriffith$elm_ui$Element$height(
					$mdgriffith$elm_ui$Element$px(
						$elm$core$Basics$round(config.ad / 5)))
				]),
			A3(
				$author$project$Gallery$HeaderGallery$chunkView,
				model,
				config,
				$author$project$Internals$Streams$current(model.iF)));
	});
var $author$project$Gallery$HeaderGallery$view = F2(
	function (config, model) {
		return A2(
			$mdgriffith$elm_ui$Element$map,
			model.cK,
			A2($author$project$Gallery$HeaderGallery$galleryView, model, config));
	});
var $author$project$Murol$view = function (model) {
	return {
		d8: function () {
			var maxWidth = A3(
				$author$project$Document$DocumentViews$StyleSheets$docMaxWidth,
				_Utils_Tuple2(model.a.lb, model.a.iu),
				false,
				model.a.dT);
			var device = $mdgriffith$elm_ui$Element$classifyDevice(
				{iu: model.a.iu, lb: model.a.lb});
			return _List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$layout,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$Font$size(16)
						]),
					A2(
						$mdgriffith$elm_ui$Element$el,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
								$mdgriffith$elm_ui$Element$height(
								$mdgriffith$elm_ui$Element$px(model.a.iu)),
								$mdgriffith$elm_ui$Element$clip,
								$mdgriffith$elm_ui$Element$Background$image(
								$author$project$Document$DocumentViews$StyleSheets$backgroundImage(model.a.j5))
							]),
						A2(
							$mdgriffith$elm_ui$Element$column,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
									$mdgriffith$elm_ui$Element$scrollbarY,
									$mdgriffith$elm_ui$Element$htmlAttribute(
									A2($elm$html$Html$Attributes$style, '-webkit-overflow-scrolling', 'touch')),
									(model.a.lb > 500) ? $author$project$Murol$noAttr : $mdgriffith$elm_ui$Element$htmlAttribute(
									$elm$html$Html$Attributes$id('topAnchor'))
								]),
							_List_fromArray(
								[
									A2($author$project$Murol$pageTitleView, maxWidth, model),
									A2($author$project$Murol$subTitleView, maxWidth, model),
									(model.a.lb > 500) ? A2(
									$author$project$Gallery$HeaderGallery$view,
									{
										ad: A2($elm$core$Basics$min, 1000, model.a.lb)
									},
									model.ch) : $mdgriffith$elm_ui$Element$none,
									A2($author$project$Murol$clickablePath, maxWidth, model),
									$author$project$Murol$topMenuView(model),
									A2($author$project$Murol$searchEngineView, maxWidth, model),
									A2($author$project$Murol$mainView, maxWidth, model),
									$author$project$Murol$footerView(model)
								]))))
				]);
		}(),
		d0: 'La commune de Murol'
	};
};
var $author$project$Murol$main = $elm$browser$Browser$application(
	{iM: $author$project$Murol$init, jw: $author$project$Murol$ChangeUrl, jx: $author$project$Murol$ClickedLink, kC: $author$project$Murol$subscriptions, k3: $author$project$Murol$update, k7: $author$project$Murol$view});
_Platform_export({'Murol':{'init':$author$project$Murol$main(
	A2(
		$elm$json$Json$Decode$andThen,
		function (width) {
			return A2(
				$elm$json$Json$Decode$andThen,
				function (height) {
					return A2(
						$elm$json$Json$Decode$andThen,
						function (currentTime) {
							return $elm$json$Json$Decode$succeed(
								{hO: currentTime, iu: height, lb: width});
						},
						A2($elm$json$Json$Decode$field, 'currentTime', $elm$json$Json$Decode$int));
				},
				A2($elm$json$Json$Decode$field, 'height', $elm$json$Json$Decode$int));
		},
		A2($elm$json$Json$Decode$field, 'width', $elm$json$Json$Decode$int)))(0)}});}(this));