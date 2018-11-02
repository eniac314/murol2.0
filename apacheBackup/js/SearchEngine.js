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
	if (region.bx.al === region.bS.al)
	{
		return 'on line ' + region.bx.al;
	}
	return 'on lines ' + region.bx.al + ' through ' + region.bS.al;
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
			callback(_Http_handleResponse(xhr, request.be.a));
		});

		try
		{
			xhr.open(request.bq, request.e7, true);
		}
		catch (e)
		{
			return callback(_Scheduler_fail(elm$http$Http$BadUrl(request.e7)));
		}

		_Http_configureRequest(xhr, request);

		var body = request.dd;
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
			dm: event.loaded,
			dn: event.total
		}));
	});
}

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.aO; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}

	xhr.responseType = request.be.b;
	xhr.withCredentials = request.bC;

	elm$core$Maybe$isJust(request.bz) && (xhr.timeout = request.bz.a);
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
		e7: xhr.responseURL,
		eE: { dv: xhr.status, G: xhr.statusText },
		aO: _Http_parseHeaders(xhr.getAllResponseHeaders()),
		dd: xhr.response
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
		impl.dZ,
		impl.e6,
		impl.eK,
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
var author$project$SearchEngine$LoadKeywords = function (a) {
	return {$: 0, a: a};
};
var elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var elm$core$Array$branchFactor = 32;
var elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var elm$core$Basics$EQ = 1;
var elm$core$Basics$GT = 2;
var elm$core$Basics$LT = 0;
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
var elm$core$List$cons = _List_cons;
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
var elm$core$Array$toList = function (array) {
	return A3(elm$core$Array$foldr, elm$core$List$cons, _List_Nil, array);
};
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
var elm$core$Basics$add = _Basics_add;
var elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var elm$core$Basics$floor = _Basics_floor;
var elm$core$Basics$gt = _Utils_gt;
var elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var elm$core$Basics$mul = _Basics_mul;
var elm$core$Basics$sub = _Basics_sub;
var elm$core$Elm$JsArray$length = _JsArray_length;
var elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.d) {
			return A4(
				elm$core$Array$Array_elm_builtin,
				elm$core$Elm$JsArray$length(builder.g),
				elm$core$Array$shiftStep,
				elm$core$Elm$JsArray$empty,
				builder.g);
		} else {
			var treeLen = builder.d * elm$core$Array$branchFactor;
			var depth = elm$core$Basics$floor(
				A2(elm$core$Basics$logBase, elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? elm$core$List$reverse(builder.i) : builder.i;
			var tree = A2(elm$core$Array$treeFromBuilder, correctNodeList, builder.d);
			return A4(
				elm$core$Array$Array_elm_builtin,
				elm$core$Elm$JsArray$length(builder.g) + treeLen,
				A2(elm$core$Basics$max, 5, depth * elm$core$Array$shiftStep),
				tree,
				builder.g);
		}
	});
var elm$core$Basics$False = 1;
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
					{i: nodeList, d: (len / elm$core$Array$branchFactor) | 0, g: tail});
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
var elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var elm$core$Maybe$Nothing = {$: 1};
var elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var elm$core$Basics$True = 0;
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
var elm$core$Basics$append = _Utils_append;
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
var elm$core$String$fromInt = _String_fromNumber;
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
var elm$json$Json$Decode$string = _Json_decodeString;
var elm$json$Json$Decode$succeed = _Json_succeed;
var author$project$SearchEngine$decodeKeyword = A3(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'contentId',
	elm$json$Json$Decode$string,
	A3(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'keyword',
		elm$json$Json$Decode$string,
		elm$json$Json$Decode$succeed(
			F2(
				function (k, cid) {
					return _Utils_Tuple2(k, cid);
				}))));
var elm$core$Basics$identity = function (x) {
	return x;
};
var elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var elm$core$Dict$empty = elm$core$Dict$RBEmpty_elm_builtin;
var elm$core$Set$Set_elm_builtin = elm$core$Basics$identity;
var elm$core$Set$empty = elm$core$Dict$empty;
var elm$core$Dict$Black = 1;
var elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var elm$core$Basics$compare = _Utils_compare;
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
var elm$core$Set$insert = F2(
	function (key, _n0) {
		var dict = _n0;
		return A3(elm$core$Dict$insert, key, 0, dict);
	});
var elm$core$Set$fromList = function (list) {
	return A3(elm$core$List$foldl, elm$core$Set$insert, elm$core$Set$empty, list);
};
var elm$json$Json$Decode$list = _Json_decodeList;
var elm$json$Json$Decode$map = _Json_map1;
var author$project$SearchEngine$decodeKeywords = A2(
	elm$json$Json$Decode$map,
	elm$core$Set$fromList,
	elm$json$Json$Decode$list(author$project$SearchEngine$decodeKeyword));
var elm$http$Http$Internal$StringBody = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var elm$http$Http$jsonBody = function (value) {
	return A2(
		elm$http$Http$Internal$StringBody,
		'application/json',
		A2(elm$json$Json$Encode$encode, 0, value));
};
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
			var _n0 = A2(elm$json$Json$Decode$decodeString, decoder, response.dd);
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
var elm$http$Http$post = F3(
	function (url, body, decoder) {
		return elm$http$Http$request(
			{
				dd: body,
				be: elm$http$Http$expectJson(decoder),
				aO: _List_Nil,
				bq: 'POST',
				bz: elm$core$Maybe$Nothing,
				e7: url,
				bC: false
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
var author$project$SearchEngine$getKeywords = function () {
	var body = elm$http$Http$jsonBody(
		elm$json$Json$Encode$object(_List_Nil));
	var request = A3(elm$http$Http$post, 'getKeywords.php', body, author$project$SearchEngine$decodeKeywords);
	return A2(elm$http$Http$send, author$project$SearchEngine$LoadKeywords, request);
}();
var author$project$SearchEngine$init = function (flags) {
	return _Utils_Tuple2(
		{bp: elm$core$Dict$empty, bv: '', a1: _List_Nil},
		author$project$SearchEngine$getKeywords);
};
var author$project$SearchEngine$inbound = _Platform_incomingPort('inbound', elm$json$Json$Decode$string);
var author$project$SearchEngine$NoOp = {$: 4};
var author$project$SearchEngine$Reset = {$: 3};
var author$project$SearchEngine$Search = {$: 2};
var elm$json$Json$Decode$andThen = _Json_andThen;
var elm$json$Json$Decode$fail = _Json_fail;
var author$project$SearchEngine$decodeAction = A2(
	elm$json$Json$Decode$andThen,
	function (str) {
		switch (str) {
			case '<Cmd -> Search>':
				return elm$json$Json$Decode$succeed(author$project$SearchEngine$Search);
			case '<Cmd -> Reset>':
				return elm$json$Json$Decode$succeed(author$project$SearchEngine$Reset);
			default:
				return elm$json$Json$Decode$fail('Unknown command');
		}
	},
	elm$json$Json$Decode$string);
var author$project$SearchEngine$SearchStr = function (a) {
	return {$: 1, a: a};
};
var author$project$SearchEngine$decodeSearchStr = A2(
	elm$json$Json$Decode$map,
	author$project$SearchEngine$SearchStr,
	A2(elm$json$Json$Decode$field, 'SearchStr', elm$json$Json$Decode$string));
var elm$core$Result$withDefault = F2(
	function (def, result) {
		if (!result.$) {
			var a = result.a;
			return a;
		} else {
			return def;
		}
	});
var elm$json$Json$Decode$oneOf = _Json_oneOf;
var author$project$SearchEngine$processInput = function (s) {
	return A2(
		elm$core$Result$withDefault,
		author$project$SearchEngine$NoOp,
		A2(
			elm$json$Json$Decode$decodeString,
			elm$json$Json$Decode$oneOf(
				_List_fromArray(
					[author$project$SearchEngine$decodeAction, author$project$SearchEngine$decodeSearchStr])),
			s));
};
var author$project$SearchEngine$subscriptions = function (model) {
	return author$project$SearchEngine$inbound(author$project$SearchEngine$processInput);
};
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
var elm$json$Json$Encode$dict = F3(
	function (toKey, toValue, dictionary) {
		return _Json_wrap(
			A3(
				elm$core$Dict$foldl,
				F3(
					function (key, value, obj) {
						return A3(
							_Json_addField,
							toKey(key),
							toValue(value),
							obj);
					}),
				_Json_emptyObject(0),
				dictionary));
	});
var elm$json$Json$Encode$int = _Json_wrap;
var elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
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
var elm$json$Json$Encode$string = _Json_wrap;
var author$project$SearchEngine$encodeSearchResult = function (_n0) {
	var keywords = _n0.a;
	var results = _n0.b;
	return A2(
		elm$json$Json$Encode$encode,
		0,
		elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'keywords',
					A2(elm$json$Json$Encode$list, elm$json$Json$Encode$string, keywords)),
					_Utils_Tuple2(
					'results',
					A3(
						elm$json$Json$Encode$dict,
						elm$core$Basics$identity,
						function (_n1) {
							var score = _n1.a;
							var keywords_ = _n1.b;
							return elm$json$Json$Encode$object(
								_List_fromArray(
									[
										_Utils_Tuple2(
										'score',
										elm$json$Json$Encode$int(score)),
										_Utils_Tuple2(
										'keywords',
										A2(elm$json$Json$Encode$set, elm$json$Json$Encode$string, keywords_))
									]));
						},
						results))
				])));
};
var elm$core$Basics$neq = _Utils_notEqual;
var author$project$SearchEngine$irrelevant = function (w) {
	return (w !== 'et') && ((w !== 'de') && ((w !== 'des') && ((w !== 'le') && ((w !== 'la') && ((w !== 'les') && ((w !== 'a') && ((w !== 'au') && ((w !== 'en') && ((w !== 'dans') && (w !== 'se'))))))))));
};
var elm$core$Set$foldr = F3(
	function (func, initialState, _n0) {
		var dict = _n0;
		return A3(
			elm$core$Dict$foldr,
			F3(
				function (key, _n1, state) {
					return A2(func, key, state);
				}),
			initialState,
			dict);
	});
var author$project$SearchEngine$keywordsToMetadata = function (keywords) {
	return A3(
		elm$core$Set$foldr,
		F2(
			function (_n0, acc) {
				var keyword = _n0.a;
				var uuid = _n0.b;
				return A3(
					elm$core$Dict$update,
					keyword,
					function (mbUuids) {
						if (!mbUuids.$) {
							var uuids = mbUuids.a;
							return elm$core$Maybe$Just(
								A2(elm$core$List$cons, uuid, uuids));
						} else {
							return elm$core$Maybe$Just(
								_List_fromArray(
									[uuid]));
						}
					},
					acc);
			}),
		elm$core$Dict$empty,
		keywords);
};
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
var elm$core$Dict$map = F2(
	function (func, dict) {
		if (dict.$ === -2) {
			return elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			return A5(
				elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				A2(func, key, value),
				A2(elm$core$Dict$map, func, left),
				A2(elm$core$Dict$map, func, right));
		}
	});
var author$project$SearchEngine$metadata = A2(
	elm$core$Dict$map,
	F2(
		function (k, v) {
			return A2(
				elm$core$List$map,
				function (_n0) {
					var p = _n0.a;
					var n = _n0.b;
					return n;
				},
				v);
		}),
	elm$core$Dict$fromList(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'accueil',
				_List_fromArray(
					[
						_Utils_Tuple2('index.html', 'Page d\'accueil')
					])),
				_Utils_Tuple2(
				'actualités',
				_List_fromArray(
					[
						_Utils_Tuple2('index.html', 'Page d\'accueil')
					])),
				_Utils_Tuple2(
				'agenda',
				_List_fromArray(
					[
						_Utils_Tuple2('Animation.html', 'Animation'),
						_Utils_Tuple2('index.html', 'Page d\'accueil')
					])),
				_Utils_Tuple2(
				'animation',
				_List_fromArray(
					[
						_Utils_Tuple2('Animation.html', 'Animation'),
						_Utils_Tuple2('AnimationEstivale.html', 'Animation estivale'),
						_Utils_Tuple2('LesSeniors.html', 'Les seniors')
					])),
				_Utils_Tuple2(
				'tourisme',
				_List_fromArray(
					[
						_Utils_Tuple2('OfficeDeTourisme.html', 'Office de tourisme'),
						_Utils_Tuple2('DécouvrirMurol.html', 'Découvrir Murol'),
						_Utils_Tuple2('Hébergements.html', 'Hébergements'),
						_Utils_Tuple2('Restaurants.html', 'Restaurants'),
						_Utils_Tuple2('Carte&Plan.html', 'Carte et plan'),
						_Utils_Tuple2('AnimationEstivale.html', 'AnimationEstivale')
					])),
				_Utils_Tuple2(
				'découvrir',
				_List_fromArray(
					[
						_Utils_Tuple2('DécouvrirMurol.html', 'Découvrir Murol'),
						_Utils_Tuple2('LaCommune.html', 'La commune')
					])),
				_Utils_Tuple2(
				'château',
				_List_fromArray(
					[
						_Utils_Tuple2('DécouvrirMurol.html', 'Découvrir Murol'),
						_Utils_Tuple2('Sortir.html', 'Sortir'),
						_Utils_Tuple2('Patrimoine.html', 'Patrimoine'),
						_Utils_Tuple2('Photothèque.html', 'Photothèque')
					])),
				_Utils_Tuple2(
				'beaune',
				_List_fromArray(
					[
						_Utils_Tuple2('DécouvrirMurol.html?bloc=02', 'Beaune le froid'),
						_Utils_Tuple2('DécouvrirMurol.html', 'Découvrir Murol'),
						_Utils_Tuple2('Patrimoine.html', 'Patrimoine')
					])),
				_Utils_Tuple2(
				'volcan',
				_List_fromArray(
					[
						_Utils_Tuple2('DécouvrirMurol.html', 'Découvrir Murol'),
						_Utils_Tuple2('Patrimoine.html', 'Patrimoine')
					])),
				_Utils_Tuple2(
				'tartaret',
				_List_fromArray(
					[
						_Utils_Tuple2('DécouvrirMurol.html', 'Découvrir Murol'),
						_Utils_Tuple2('Patrimoine.html', 'Patrimoine')
					])),
				_Utils_Tuple2(
				'lac chambon',
				_List_fromArray(
					[
						_Utils_Tuple2('DécouvrirMurol.html', 'Découvrir Murol')
					])),
				_Utils_Tuple2(
				'promener',
				_List_fromArray(
					[
						_Utils_Tuple2('DécouvrirMurol.html', 'Découvrir Murol')
					])),
				_Utils_Tuple2(
				'promenade',
				_List_fromArray(
					[
						_Utils_Tuple2('DécouvrirMurol.html', 'Découvrir Murol')
					])),
				_Utils_Tuple2(
				'voie verte',
				_List_fromArray(
					[
						_Utils_Tuple2('DécouvrirMurol.html', 'Découvrir Murol')
					])),
				_Utils_Tuple2(
				'chautignat',
				_List_fromArray(
					[
						_Utils_Tuple2('DécouvrirMurol.html', 'Découvrir Murol')
					])),
				_Utils_Tuple2(
				'groire',
				_List_fromArray(
					[
						_Utils_Tuple2('DécouvrirMurol.html', 'Découvrir Murol')
					])),
				_Utils_Tuple2(
				'chassagne',
				_List_fromArray(
					[
						_Utils_Tuple2('DécouvrirMurol.html', 'Découvrir Murol')
					])),
				_Utils_Tuple2(
				'ballats',
				_List_fromArray(
					[
						_Utils_Tuple2('DécouvrirMurol.html', 'Découvrir Murol')
					])),
				_Utils_Tuple2(
				'hébergements',
				_List_fromArray(
					[
						_Utils_Tuple2('Hébergements.html', 'Hébergements')
					])),
				_Utils_Tuple2(
				'logement',
				_List_fromArray(
					[
						_Utils_Tuple2('Hébergements.html', 'Hébergements')
					])),
				_Utils_Tuple2(
				'loger',
				_List_fromArray(
					[
						_Utils_Tuple2('Hébergements.html', 'Hébergements')
					])),
				_Utils_Tuple2(
				'hotels',
				_List_fromArray(
					[
						_Utils_Tuple2('Hébergements.html', 'Hébergements')
					])),
				_Utils_Tuple2(
				'camping',
				_List_fromArray(
					[
						_Utils_Tuple2('Hébergements.html', 'Hébergements')
					])),
				_Utils_Tuple2(
				'résidence',
				_List_fromArray(
					[
						_Utils_Tuple2('Hébergements.html', 'Hébergements')
					])),
				_Utils_Tuple2(
				'chambres',
				_List_fromArray(
					[
						_Utils_Tuple2('Hébergements.html', 'Hébergements')
					])),
				_Utils_Tuple2(
				'gite',
				_List_fromArray(
					[
						_Utils_Tuple2('Hébergements.html', 'Hébergements')
					])),
				_Utils_Tuple2(
				'meublé',
				_List_fromArray(
					[
						_Utils_Tuple2('Hébergements.html', 'Hébergements')
					])),
				_Utils_Tuple2(
				'villages vacances',
				_List_fromArray(
					[
						_Utils_Tuple2('Hébergements.html', 'Hébergements')
					])),
				_Utils_Tuple2(
				'famille plus',
				_List_fromArray(
					[
						_Utils_Tuple2('Hébergements.html', 'Hébergements'),
						_Utils_Tuple2('Restaurants.html', 'Restaurants')
					])),
				_Utils_Tuple2(
				'camping-car',
				_List_fromArray(
					[
						_Utils_Tuple2('Hébergements.html', 'Hébergements')
					])),
				_Utils_Tuple2(
				'restaurants',
				_List_fromArray(
					[
						_Utils_Tuple2('Restaurants.html', 'Restaurants')
					])),
				_Utils_Tuple2(
				'bar',
				_List_fromArray(
					[
						_Utils_Tuple2('Restaurants.html', 'Restaurants')
					])),
				_Utils_Tuple2(
				'brasserie',
				_List_fromArray(
					[
						_Utils_Tuple2('Restaurants.html', 'Restaurants')
					])),
				_Utils_Tuple2(
				'carte',
				_List_fromArray(
					[
						_Utils_Tuple2('Carte&Plan.html', 'Carte & Plan')
					])),
				_Utils_Tuple2(
				'plan',
				_List_fromArray(
					[
						_Utils_Tuple2('Carte&Plan.html', 'Carte & Plan')
					])),
				_Utils_Tuple2(
				'accès',
				_List_fromArray(
					[
						_Utils_Tuple2('Carte&Plan.html', 'Carte & Plan')
					])),
				_Utils_Tuple2(
				'route',
				_List_fromArray(
					[
						_Utils_Tuple2('Carte&Plan.html', 'Carte & Plan')
					])),
				_Utils_Tuple2(
				'vie locale',
				_List_fromArray(
					[
						_Utils_Tuple2('VieScolaire.html', 'Vie scolaire'),
						_Utils_Tuple2('PériEtExtra-scolaire.html', 'Péri et extra-scolaire'),
						_Utils_Tuple2('LesAdos.html', 'Les ados'),
						_Utils_Tuple2('LesSeniors.html', 'Les seniors'),
						_Utils_Tuple2('Santé.html', 'Santé'),
						_Utils_Tuple2('Transports.html', 'Transports'),
						_Utils_Tuple2('GestionDesDéchets.html', 'Gestion des déchets'),
						_Utils_Tuple2('Animaux.html', 'Animaux')
					])),
				_Utils_Tuple2(
				'école',
				_List_fromArray(
					[
						_Utils_Tuple2('VieScolaire.html', 'Vie scolaire'),
						_Utils_Tuple2('PériEtExtra-scolaire.html', 'Péri et extra-scolaire')
					])),
				_Utils_Tuple2(
				'périscolaire',
				_List_fromArray(
					[
						_Utils_Tuple2('PériEtExtra-scolaire.html', 'Péri et extra-scolaire')
					])),
				_Utils_Tuple2(
				'maternelle',
				_List_fromArray(
					[
						_Utils_Tuple2('VieScolaire.html', 'Vie scolaire')
					])),
				_Utils_Tuple2(
				'élémentaire',
				_List_fromArray(
					[
						_Utils_Tuple2('VieScolaire.html', 'Vie scolaire')
					])),
				_Utils_Tuple2(
				'secondaire',
				_List_fromArray(
					[
						_Utils_Tuple2('VieScolaire.html', 'Vie scolaire')
					])),
				_Utils_Tuple2(
				'collège',
				_List_fromArray(
					[
						_Utils_Tuple2('VieScolaire.html', 'Vie scolaire')
					])),
				_Utils_Tuple2(
				'cantine',
				_List_fromArray(
					[
						_Utils_Tuple2('PériEtExtra-scolaire.html', 'Péri et extra-scolaire')
					])),
				_Utils_Tuple2(
				'restaurant scolaire',
				_List_fromArray(
					[
						_Utils_Tuple2('PériEtExtra-scolaire.html', 'Péri et extra-scolaire')
					])),
				_Utils_Tuple2(
				'garderie',
				_List_fromArray(
					[
						_Utils_Tuple2('PériEtExtra-scolaire.html', 'Péri et extra-scolaire')
					])),
				_Utils_Tuple2(
				'tap',
				_List_fromArray(
					[
						_Utils_Tuple2('PériEtExtra-scolaire.html', 'Péri et extra-scolaire')
					])),
				_Utils_Tuple2(
				'temps d\'activités périscolaire',
				_List_fromArray(
					[
						_Utils_Tuple2('PériEtExtra-scolaire.html', 'Péri et extra-scolaire')
					])),
				_Utils_Tuple2(
				'centre loisirs',
				_List_fromArray(
					[
						_Utils_Tuple2('PériEtExtra-scolaire.html', 'Péri et extra-scolaire')
					])),
				_Utils_Tuple2(
				'transports scolaire',
				_List_fromArray(
					[
						_Utils_Tuple2('PériEtExtra-scolaire.html', 'Péri et extra-scolaire')
					])),
				_Utils_Tuple2(
				'activités jeunesse',
				_List_fromArray(
					[
						_Utils_Tuple2('PériEtExtra-scolaire.html', 'Péri et extra-scolaire')
					])),
				_Utils_Tuple2(
				'sivom',
				_List_fromArray(
					[
						_Utils_Tuple2('PériEtExtra-scolaire.html', 'Péri et extra-scolaire'),
						_Utils_Tuple2('LesSeniors.html', 'Les seniors')
					])),
				_Utils_Tuple2(
				'ados',
				_List_fromArray(
					[
						_Utils_Tuple2('LesAdos.html', 'Les ados')
					])),
				_Utils_Tuple2(
				'jeunes',
				_List_fromArray(
					[
						_Utils_Tuple2('LesAdos.html', 'Les ados')
					])),
				_Utils_Tuple2(
				'argent de poche',
				_List_fromArray(
					[
						_Utils_Tuple2('LesAdos.html', 'Les ados')
					])),
				_Utils_Tuple2(
				'séniors',
				_List_fromArray(
					[
						_Utils_Tuple2('LesSeniors.html', 'Les seniors')
					])),
				_Utils_Tuple2(
				'actvités',
				_List_fromArray(
					[
						_Utils_Tuple2('LesSeniors.html', 'Les seniors')
					])),
				_Utils_Tuple2(
				'service',
				_List_fromArray(
					[
						_Utils_Tuple2('LesSeniors.html', 'Les seniors')
					])),
				_Utils_Tuple2(
				'santé',
				_List_fromArray(
					[
						_Utils_Tuple2('Santé.html', 'Santé')
					])),
				_Utils_Tuple2(
				'médecin',
				_List_fromArray(
					[
						_Utils_Tuple2('Santé.html', 'Santé')
					])),
				_Utils_Tuple2(
				'infirmier',
				_List_fromArray(
					[
						_Utils_Tuple2('Santé.html', 'Santé')
					])),
				_Utils_Tuple2(
				'dentiste',
				_List_fromArray(
					[
						_Utils_Tuple2('Santé.html', 'Santé')
					])),
				_Utils_Tuple2(
				'kiné',
				_List_fromArray(
					[
						_Utils_Tuple2('Santé.html', 'Santé')
					])),
				_Utils_Tuple2(
				'cabinet médical',
				_List_fromArray(
					[
						_Utils_Tuple2('Santé.html', 'Santé')
					])),
				_Utils_Tuple2(
				'pédicure',
				_List_fromArray(
					[
						_Utils_Tuple2('Santé.html', 'Santé')
					])),
				_Utils_Tuple2(
				'podologue',
				_List_fromArray(
					[
						_Utils_Tuple2('Santé.html', 'Santé')
					])),
				_Utils_Tuple2(
				'pharmacie',
				_List_fromArray(
					[
						_Utils_Tuple2('Santé.html', 'Santé'),
						_Utils_Tuple2('Commerces.html', 'Commerces')
					])),
				_Utils_Tuple2(
				'transport',
				_List_fromArray(
					[
						_Utils_Tuple2('Transports.html', 'Transports'),
						_Utils_Tuple2('PériEtExtra-scolaire.html', 'Péri et extra-scolaire'),
						_Utils_Tuple2('Commerces.html', 'Commerces')
					])),
				_Utils_Tuple2(
				'desserte',
				_List_fromArray(
					[
						_Utils_Tuple2('Transports.html', 'Transports')
					])),
				_Utils_Tuple2(
				'covoiturage',
				_List_fromArray(
					[
						_Utils_Tuple2('Transports.html', 'Transports')
					])),
				_Utils_Tuple2(
				'déneigement',
				_List_fromArray(
					[
						_Utils_Tuple2('Transports.html', 'Transports')
					])),
				_Utils_Tuple2(
				'vie économique',
				_List_fromArray(
					[
						_Utils_Tuple2('Agriculture.html', 'Agriculture'),
						_Utils_Tuple2('Commerces.html', 'Commerces'),
						_Utils_Tuple2('Entreprises.html', 'Entreprises'),
						_Utils_Tuple2('OffresD\'emploi.html', 'Offres d\'emploi')
					])),
				_Utils_Tuple2(
				'agriculture',
				_List_fromArray(
					[
						_Utils_Tuple2('Agriculture.html', 'Agriculture')
					])),
				_Utils_Tuple2(
				'fromage',
				_List_fromArray(
					[
						_Utils_Tuple2('Agriculture.html', 'Agriculture')
					])),
				_Utils_Tuple2(
				'commerce',
				_List_fromArray(
					[
						_Utils_Tuple2('Commerces.html', 'Commerces')
					])),
				_Utils_Tuple2(
				'informatique',
				_List_fromArray(
					[
						_Utils_Tuple2('Commerces.html', 'Commerces')
					])),
				_Utils_Tuple2(
				'boucherie',
				_List_fromArray(
					[
						_Utils_Tuple2('Commerces.html', 'Commerces')
					])),
				_Utils_Tuple2(
				'garage',
				_List_fromArray(
					[
						_Utils_Tuple2('Commerces.html', 'Commerces')
					])),
				_Utils_Tuple2(
				'alimentation',
				_List_fromArray(
					[
						_Utils_Tuple2('Commerces.html', 'Commerces')
					])),
				_Utils_Tuple2(
				'supermarché',
				_List_fromArray(
					[
						_Utils_Tuple2('Commerces.html', 'Commerces')
					])),
				_Utils_Tuple2(
				'poste',
				_List_fromArray(
					[
						_Utils_Tuple2('Commerces.html', 'Commerces')
					])),
				_Utils_Tuple2(
				'banque',
				_List_fromArray(
					[
						_Utils_Tuple2('Commerces.html', 'Commerces')
					])),
				_Utils_Tuple2(
				'terroir',
				_List_fromArray(
					[
						_Utils_Tuple2('Commerces.html', 'Commerces')
					])),
				_Utils_Tuple2(
				'souvenir',
				_List_fromArray(
					[
						_Utils_Tuple2('Commerces.html', 'Commerces')
					])),
				_Utils_Tuple2(
				'artisanat',
				_List_fromArray(
					[
						_Utils_Tuple2('Commerces.html', 'Commerces')
					])),
				_Utils_Tuple2(
				'assurance',
				_List_fromArray(
					[
						_Utils_Tuple2('Commerces.html', 'Commerces')
					])),
				_Utils_Tuple2(
				'location',
				_List_fromArray(
					[
						_Utils_Tuple2('Commerces.html', 'Commerces'),
						_Utils_Tuple2('SallesMunicipales.html', 'Salles municipales')
					])),
				_Utils_Tuple2(
				'vêtement',
				_List_fromArray(
					[
						_Utils_Tuple2('Commerces.html', 'Commerces')
					])),
				_Utils_Tuple2(
				'entreprise',
				_List_fromArray(
					[
						_Utils_Tuple2('Entreprises.html', 'Entreprises')
					])),
				_Utils_Tuple2(
				'electricien',
				_List_fromArray(
					[
						_Utils_Tuple2('Entreprises.html', 'Entreprises')
					])),
				_Utils_Tuple2(
				'maçon',
				_List_fromArray(
					[
						_Utils_Tuple2('Entreprises.html', 'Entreprises')
					])),
				_Utils_Tuple2(
				'quincallerie',
				_List_fromArray(
					[
						_Utils_Tuple2('Entreprises.html', 'Entreprises')
					])),
				_Utils_Tuple2(
				'plomberie',
				_List_fromArray(
					[
						_Utils_Tuple2('Entreprises.html', 'Entreprises')
					])),
				_Utils_Tuple2(
				'peintre',
				_List_fromArray(
					[
						_Utils_Tuple2('Entreprises.html', 'Entreprises')
					])),
				_Utils_Tuple2(
				'mairie',
				_List_fromArray(
					[
						_Utils_Tuple2('LaCommune.html', 'La commune'),
						_Utils_Tuple2('ConseilMunicipal.html', 'Conseil municipal'),
						_Utils_Tuple2('Délibérations.html', 'Délibérations'),
						_Utils_Tuple2('Commissions.html', 'Commissions'),
						_Utils_Tuple2('CCAS.html', 'CCAS'),
						_Utils_Tuple2('VosDémarches.html', 'Vos démarches'),
						_Utils_Tuple2('SallesMunicipales.html', 'Salles municipales'),
						_Utils_Tuple2('HorairesEtContact.html.html', 'Horaires et contact')
					])),
				_Utils_Tuple2(
				'conseil municipal',
				_List_fromArray(
					[
						_Utils_Tuple2('ConseilMunicipal.html', 'Conseil municipal')
					])),
				_Utils_Tuple2(
				'maire',
				_List_fromArray(
					[
						_Utils_Tuple2('ConseilMunicipal.html', 'Conseil municipal')
					])),
				_Utils_Tuple2(
				'adjoint',
				_List_fromArray(
					[
						_Utils_Tuple2('ConseilMunicipal.html', 'Conseil municipal')
					])),
				_Utils_Tuple2(
				'conseillers municipaux',
				_List_fromArray(
					[
						_Utils_Tuple2('ConseilMunicipal.html', 'Conseil municipal')
					])),
				_Utils_Tuple2(
				'délibérations',
				_List_fromArray(
					[
						_Utils_Tuple2('Délibérations.html', 'Délibérations')
					])),
				_Utils_Tuple2(
				'commission',
				_List_fromArray(
					[
						_Utils_Tuple2('Commissions.html', 'Commissions')
					])),
				_Utils_Tuple2(
				'ccas',
				_List_fromArray(
					[
						_Utils_Tuple2('CCAS.html', 'CCAS')
					])),
				_Utils_Tuple2(
				'centre communal d\'action sociale',
				_List_fromArray(
					[
						_Utils_Tuple2('CCAS.html', 'CCAS')
					])),
				_Utils_Tuple2(
				'aide',
				_List_fromArray(
					[
						_Utils_Tuple2('CCAS.html', 'CCAS')
					])),
				_Utils_Tuple2(
				'secours',
				_List_fromArray(
					[
						_Utils_Tuple2('CCAS.html', 'CCAS')
					])),
				_Utils_Tuple2(
				'démarches',
				_List_fromArray(
					[
						_Utils_Tuple2('VosDémarches.html', 'Vos démarches')
					])),
				_Utils_Tuple2(
				'papiers',
				_List_fromArray(
					[
						_Utils_Tuple2('VosDémarches.html', 'Vos démarches')
					])),
				_Utils_Tuple2(
				'documents',
				_List_fromArray(
					[
						_Utils_Tuple2('VosDémarches.html', 'Vos démarches')
					])),
				_Utils_Tuple2(
				'carte identité',
				_List_fromArray(
					[
						_Utils_Tuple2('VosDémarches.html', 'Vos démarches')
					])),
				_Utils_Tuple2(
				'passeport',
				_List_fromArray(
					[
						_Utils_Tuple2('VosDémarches.html', 'Vos démarches')
					])),
				_Utils_Tuple2(
				'permis de conduire',
				_List_fromArray(
					[
						_Utils_Tuple2('VosDémarches.html', 'Vos démarches')
					])),
				_Utils_Tuple2(
				'véhicule',
				_List_fromArray(
					[
						_Utils_Tuple2('VosDémarches.html', 'Vos démarches')
					])),
				_Utils_Tuple2(
				'etat civil',
				_List_fromArray(
					[
						_Utils_Tuple2('VosDémarches.html', 'Vos démarches')
					])),
				_Utils_Tuple2(
				'liste électorale',
				_List_fromArray(
					[
						_Utils_Tuple2('VosDémarches.html', 'Vos démarches')
					])),
				_Utils_Tuple2(
				'service civique',
				_List_fromArray(
					[
						_Utils_Tuple2('VosDémarches.html', 'Vos démarches')
					])),
				_Utils_Tuple2(
				'salle',
				_List_fromArray(
					[
						_Utils_Tuple2('SallesMunicipales.html', 'Salles municipales')
					])),
				_Utils_Tuple2(
				'matériel',
				_List_fromArray(
					[
						_Utils_Tuple2('SallesMunicipales.html', 'Salles municipales')
					])),
				_Utils_Tuple2(
				'horaires',
				_List_fromArray(
					[
						_Utils_Tuple2('HorairesEtContact.html', 'Horaires et contact')
					])),
				_Utils_Tuple2(
				'contact',
				_List_fromArray(
					[
						_Utils_Tuple2('HorairesEtContact.html', 'Horaires et contact')
					])),
				_Utils_Tuple2(
				'téléphone',
				_List_fromArray(
					[
						_Utils_Tuple2('HorairesEtContact.html', 'Horaires et contact')
					])),
				_Utils_Tuple2(
				'mail',
				_List_fromArray(
					[
						_Utils_Tuple2('HorairesEtContact.html', 'Horaires et contact')
					])),
				_Utils_Tuple2(
				'culture et loisirs',
				_List_fromArray(
					[
						_Utils_Tuple2('Artistes.html', 'Artistes'),
						_Utils_Tuple2('Associations.html', 'Associations'),
						_Utils_Tuple2('Sortir.html', 'Sortir'),
						_Utils_Tuple2('Patrimoine.html', 'Patrimoine'),
						_Utils_Tuple2('SportsEtDétente.html', 'Sports et détente'),
						_Utils_Tuple2('Photothèque.html', 'Photothèque')
					])),
				_Utils_Tuple2(
				'artiste',
				_List_fromArray(
					[
						_Utils_Tuple2('Artistes.html', 'Artistes')
					])),
				_Utils_Tuple2(
				'festival d\'art',
				_List_fromArray(
					[
						_Utils_Tuple2('Artistes.html', 'Artistes'),
						_Utils_Tuple2('Photothèque.html', 'Photothèque')
					])),
				_Utils_Tuple2(
				'associations',
				_List_fromArray(
					[
						_Utils_Tuple2('Associations.html', 'Associations')
					])),
				_Utils_Tuple2(
				'culture',
				_List_fromArray(
					[
						_Utils_Tuple2('Associations.html', 'Associations')
					])),
				_Utils_Tuple2(
				'solidarité',
				_List_fromArray(
					[
						_Utils_Tuple2('Associations.html', 'Associations')
					])),
				_Utils_Tuple2(
				'sport',
				_List_fromArray(
					[
						_Utils_Tuple2('Associations.html', 'Associations'),
						_Utils_Tuple2('SportsEtDétente.html', 'Sports et détente')
					])),
				_Utils_Tuple2(
				'professionnel',
				_List_fromArray(
					[
						_Utils_Tuple2('Associations.html', 'Associations')
					])),
				_Utils_Tuple2(
				'sortir',
				_List_fromArray(
					[
						_Utils_Tuple2('Sortir.html', 'Sortir')
					])),
				_Utils_Tuple2(
				'musée des peintres',
				_List_fromArray(
					[
						_Utils_Tuple2('Sortir.html', 'Sortir'),
						_Utils_Tuple2('Patrimoine.html', 'Patrimoine')
					])),
				_Utils_Tuple2(
				'environs',
				_List_fromArray(
					[
						_Utils_Tuple2('Sortir.html', 'Sortir')
					])),
				_Utils_Tuple2(
				'cinéma',
				_List_fromArray(
					[
						_Utils_Tuple2('Sortir.html', 'Sortir')
					])),
				_Utils_Tuple2(
				'patrimoine',
				_List_fromArray(
					[
						_Utils_Tuple2('Patrimoine.html', 'Patrimoine')
					])),
				_Utils_Tuple2(
				'parc',
				_List_fromArray(
					[
						_Utils_Tuple2('Patrimoine.html', 'Patrimoine')
					])),
				_Utils_Tuple2(
				'prélong',
				_List_fromArray(
					[
						_Utils_Tuple2('Patrimoine.html', 'Patrimoine')
					])),
				_Utils_Tuple2(
				'église',
				_List_fromArray(
					[
						_Utils_Tuple2('Patrimoine.html', 'Patrimoine')
					])),
				_Utils_Tuple2(
				'moulin',
				_List_fromArray(
					[
						_Utils_Tuple2('Patrimoine.html', 'Patrimoine')
					])),
				_Utils_Tuple2(
				'archéologie',
				_List_fromArray(
					[
						_Utils_Tuple2('Patrimoine.html', 'Patrimoine')
					])),
				_Utils_Tuple2(
				'détente',
				_List_fromArray(
					[
						_Utils_Tuple2('SportsEtDétente.html', 'Sports et détente')
					])),
				_Utils_Tuple2(
				'rugby',
				_List_fromArray(
					[
						_Utils_Tuple2('SportsEtDétente.html', 'Sports et détente')
					])),
				_Utils_Tuple2(
				'tennis de table',
				_List_fromArray(
					[
						_Utils_Tuple2('SportsEtDétente.html', 'Sports et détente')
					])),
				_Utils_Tuple2(
				'gymnastique',
				_List_fromArray(
					[
						_Utils_Tuple2('SportsEtDétente.html', 'Sports et détente')
					])),
				_Utils_Tuple2(
				'qi gong',
				_List_fromArray(
					[
						_Utils_Tuple2('SportsEtDétente.html', 'Sports et détente')
					])),
				_Utils_Tuple2(
				'équitation',
				_List_fromArray(
					[
						_Utils_Tuple2('SportsEtDétente.html', 'Sports et détente')
					])),
				_Utils_Tuple2(
				'chorale',
				_List_fromArray(
					[
						_Utils_Tuple2('SportsEtDétente.html', 'Sports et détente')
					])),
				_Utils_Tuple2(
				'tarot',
				_List_fromArray(
					[
						_Utils_Tuple2('SportsEtDétente.html', 'Sports et détente')
					])),
				_Utils_Tuple2(
				'photothèque',
				_List_fromArray(
					[
						_Utils_Tuple2('Photothèque.html', 'Photothèque')
					])),
				_Utils_Tuple2(
				'paysage',
				_List_fromArray(
					[
						_Utils_Tuple2('Photothèque.html', 'Photothèque')
					])),
				_Utils_Tuple2(
				'médiévales',
				_List_fromArray(
					[
						_Utils_Tuple2('Photothèque.html', 'Photothèque')
					])),
				_Utils_Tuple2(
				'14 juillet',
				_List_fromArray(
					[
						_Utils_Tuple2('Photothèque.html', 'Photothèque')
					])),
				_Utils_Tuple2(
				'révolution',
				_List_fromArray(
					[
						_Utils_Tuple2('Photothèque.html', 'Photothèque')
					])),
				_Utils_Tuple2(
				'journée des murolais',
				_List_fromArray(
					[
						_Utils_Tuple2('Photothèque.html', 'Photothèque')
					])),
				_Utils_Tuple2(
				'diaporama',
				_List_fromArray(
					[
						_Utils_Tuple2('Photothèque.html', 'Photothèque')
					])),
				_Utils_Tuple2(
				'documentation',
				_List_fromArray(
					[
						_Utils_Tuple2('BulletinsMunicipaux.html', 'Bulletins municipaux'),
						_Utils_Tuple2('MurolInfos.html', 'Murol Infos'),
						_Utils_Tuple2('Délibérations.html', 'Délibérations'),
						_Utils_Tuple2('GestionDesRisques.html', 'Gestion des risques'),
						_Utils_Tuple2('Elections.html', 'Elections'),
						_Utils_Tuple2('AutresPublications.html', 'Autres publications'),
						_Utils_Tuple2('VillageFleuri.html', 'Village fleuri')
					])),
				_Utils_Tuple2(
				'bulletin',
				_List_fromArray(
					[
						_Utils_Tuple2('BulletinsMunicipaux.html', 'Bulletins municipaux')
					])),
				_Utils_Tuple2(
				'murol infos',
				_List_fromArray(
					[
						_Utils_Tuple2('MurolInfos.html', 'Murol Infos')
					])),
				_Utils_Tuple2(
				'risques',
				_List_fromArray(
					[
						_Utils_Tuple2('GestionDesRisques.html', 'Gestion des risques')
					])),
				_Utils_Tuple2(
				'dicrim',
				_List_fromArray(
					[
						_Utils_Tuple2('GestionDesRisques.html', 'Gestion des risques')
					])),
				_Utils_Tuple2(
				'élections',
				_List_fromArray(
					[
						_Utils_Tuple2('Elections.html', 'Elections')
					])),
				_Utils_Tuple2(
				'publications',
				_List_fromArray(
					[
						_Utils_Tuple2('AutresPublications.html', 'Autres publications')
					])),
				_Utils_Tuple2(
				'développement durable',
				_List_fromArray(
					[
						_Utils_Tuple2('AutresPublications.html', 'Autres publications')
					])),
				_Utils_Tuple2(
				'compostage',
				_List_fromArray(
					[
						_Utils_Tuple2('AutresPublications.html', 'Autres publications')
					])),
				_Utils_Tuple2(
				'station tourisme',
				_List_fromArray(
					[
						_Utils_Tuple2('AutresPublications.html', 'Autres publications')
					])),
				_Utils_Tuple2(
				'pavillon bleu',
				_List_fromArray(
					[
						_Utils_Tuple2('AutresPublications.html', 'Autres publications')
					])),
				_Utils_Tuple2(
				'fleuri',
				_List_fromArray(
					[
						_Utils_Tuple2('VillageFleuri.html', 'Village fleuri')
					])),
				_Utils_Tuple2(
				'petites annonces',
				_List_fromArray(
					[
						_Utils_Tuple2('PetitesAnnonces.html', 'Petites annonces')
					]))
			])));
var author$project$SearchEngine$outbound = _Platform_outgoingPort('outbound', elm$json$Json$Encode$string);
var author$project$SearchEngine$consIfEqual = F3(
	function (x, y, _n0) {
		var listLen = _n0.a;
		var list = _n0.b;
		return _Utils_eq(x, y) ? _Utils_Tuple2(
			listLen + 1,
			A2(elm$core$List$cons, x, list)) : _Utils_Tuple2(listLen, list);
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
var author$project$SearchEngine$get = F2(
	function (position, memo) {
		return A2(
			elm$core$Maybe$withDefault,
			_Utils_Tuple2(0, _List_Nil),
			A2(elm$core$Dict$get, position, memo));
	});
var author$project$SearchEngine$maxListTuple = F2(
	function (_n0, _n1) {
		var xLen = _n0.a;
		var xs = _n0.b;
		var yLen = _n1.a;
		var ys = _n1.b;
		return (_Utils_cmp(yLen, xLen) > 0) ? _Utils_Tuple2(yLen, ys) : _Utils_Tuple2(xLen, xs);
	});
var elm$core$Tuple$mapFirst = F2(
	function (func, _n0) {
		var x = _n0.a;
		var y = _n0.b;
		return _Utils_Tuple2(
			func(x),
			y);
	});
var elm$core$Tuple$mapSecond = F2(
	function (func, _n0) {
		var x = _n0.a;
		var y = _n0.b;
		return _Utils_Tuple2(
			x,
			func(y));
	});
var author$project$SearchEngine$lcsHelper = F4(
	function (xs, ys, position, memo) {
		var _n0 = _Utils_Tuple3(
			A2(elm$core$Dict$get, position, memo),
			xs,
			ys);
		if (((_n0.a.$ === 1) && _n0.b.b) && _n0.c.b) {
			var _n1 = _n0.a;
			var _n2 = _n0.b;
			var x = _n2.a;
			var xRest = _n2.b;
			var _n3 = _n0.c;
			var y = _n3.a;
			var yRest = _n3.b;
			var nextYPos = A2(
				elm$core$Tuple$mapSecond,
				elm$core$Basics$add(1),
				position);
			var nextXPos = A2(
				elm$core$Tuple$mapFirst,
				elm$core$Basics$add(1),
				position);
			var newMemo = A4(
				author$project$SearchEngine$lcsHelper,
				xRest,
				ys,
				nextXPos,
				A4(author$project$SearchEngine$lcsHelper, xs, yRest, nextYPos, memo));
			var best = A3(
				author$project$SearchEngine$consIfEqual,
				x,
				y,
				A2(
					author$project$SearchEngine$maxListTuple,
					A2(author$project$SearchEngine$get, nextXPos, newMemo),
					A2(author$project$SearchEngine$get, nextYPos, newMemo)));
			return A3(elm$core$Dict$insert, position, best, newMemo);
		} else {
			return memo;
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
var elm$core$Tuple$second = function (_n0) {
	var y = _n0.b;
	return y;
};
var author$project$SearchEngine$lcs = F2(
	function (xs, ys) {
		return A2(
			elm$core$Maybe$withDefault,
			_List_Nil,
			A2(
				elm$core$Maybe$map,
				elm$core$Tuple$second,
				A2(
					elm$core$Dict$get,
					_Utils_Tuple2(0, 0),
					A4(
						author$project$SearchEngine$lcsHelper,
						xs,
						ys,
						_Utils_Tuple2(0, 0),
						elm$core$Dict$empty))));
	});
var elm$core$String$length = _String_length;
var elm$core$String$foldr = _String_foldr;
var elm$core$String$toList = function (string) {
	return A3(elm$core$String$foldr, elm$core$List$cons, _List_Nil, string);
};
var author$project$SearchEngine$sift3Distance = F2(
	function (s1, s2) {
		var s2Len = elm$core$String$length(s2);
		var s1Len = elm$core$String$length(s1);
		if (!s1Len) {
			return s2Len;
		} else {
			if (!s2Len) {
				return s1Len;
			} else {
				var common = A2(
					author$project$SearchEngine$lcs,
					elm$core$String$toList(s1),
					elm$core$String$toList(s2));
				return ((s1Len + s2Len) / 2) - elm$core$List$length(common);
			}
		}
	});
var elm$core$Basics$round = _Basics_round;
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
var elm$core$Dict$singleton = F2(
	function (key, value) {
		return A5(elm$core$Dict$RBNode_elm_builtin, 1, key, value, elm$core$Dict$RBEmpty_elm_builtin, elm$core$Dict$RBEmpty_elm_builtin);
	});
var elm$core$Set$singleton = function (key) {
	return A2(elm$core$Dict$singleton, key, 0);
};
var elm$core$String$words = _String_words;
var author$project$SearchEngine$search = F2(
	function (meta, key) {
		var l = elm$core$String$length(key);
		var incrOccur = F3(
			function (k, m, val) {
				if (val.$ === 1) {
					return elm$core$Maybe$Just(
						_Utils_Tuple2(
							m,
							elm$core$Set$singleton(k)));
				} else {
					var _n4 = val.a;
					var n = _n4.a;
					var keySet = _n4.b;
					return elm$core$Maybe$Just(
						_Utils_Tuple2(
							n + 5,
							A2(elm$core$Set$insert, k, keySet)));
				}
			});
		var filterMatch = F2(
			function (_n2, acc) {
				var w = _n2.a;
				var k = _n2.b;
				var score = A2(author$project$SearchEngine$sift3Distance, w, key);
				return (score < 1.5) ? A2(
					elm$core$List$cons,
					_Utils_Tuple2(
						k,
						15 - (elm$core$Basics$round(score) * 10)),
					acc) : acc;
			});
		var burst = function (s) {
			return A2(
				elm$core$List$map,
				function (v) {
					return _Utils_Tuple2(v, s);
				},
				A2(
					elm$core$List$filter,
					author$project$SearchEngine$irrelevant,
					elm$core$String$words(s)));
		};
		var toTrim = A3(
			elm$core$List$foldr,
			F2(
				function (k, acc) {
					return _Utils_ap(
						burst(k),
						acc);
				}),
			_List_Nil,
			elm$core$Dict$keys(meta));
		var trimmed = A3(elm$core$List$foldr, filterMatch, _List_Nil, toTrim);
		return _Utils_Tuple2(
			A2(elm$core$List$map, elm$core$Tuple$first, trimmed),
			A3(
				elm$core$List$foldr,
				F2(
					function (_n0, acc) {
						var k = _n0.a;
						var m = _n0.b;
						var _n1 = A2(elm$core$Dict$get, k, meta);
						if (_n1.$ === 1) {
							return acc;
						} else {
							var vs = _n1.a;
							return A3(
								elm$core$List$foldr,
								F2(
									function (uuid, acc_) {
										return A3(
											elm$core$Dict$update,
											uuid,
											A2(incrOccur, k, m),
											acc_);
									}),
								acc,
								vs);
						}
					}),
				elm$core$Dict$empty,
				trimmed));
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
var elm$core$Set$union = F2(
	function (_n0, _n1) {
		var dict1 = _n0;
		var dict2 = _n1;
		return A2(elm$core$Dict$union, dict1, dict2);
	});
var author$project$SearchEngine$searchM = F2(
	function (meta, keys) {
		var results = A2(
			elm$core$List$map,
			author$project$SearchEngine$search(meta),
			keys);
		var combineWeigtedRes = F2(
			function (oldDict, newDict) {
				var onlyRight = F3(
					function (k, v2, acc) {
						return A3(elm$core$Dict$insert, k, v2, acc);
					});
				var onlyLeft = F3(
					function (k, v1, acc) {
						return A3(elm$core$Dict$insert, k, v1, acc);
					});
				var inBoth = F4(
					function (k, _n3, _n4, acc) {
						var v1 = _n3.a;
						var ks1 = _n3.b;
						var v2 = _n4.a;
						var ks2 = _n4.b;
						return A3(
							elm$core$Dict$insert,
							k,
							_Utils_Tuple2(
								v1 + v2,
								A2(elm$core$Set$union, ks1, ks2)),
							acc);
					});
				return A6(elm$core$Dict$merge, onlyLeft, inBoth, onlyRight, oldDict, newDict, elm$core$Dict$empty);
			});
		var _n0 = A3(
			elm$core$List$foldr,
			F2(
				function (_n1, _n2) {
					var kwds = _n1.a;
					var res = _n1.b;
					var kwdsAcc = _n2.a;
					var resAcc = _n2.b;
					return _Utils_Tuple2(
						A2(
							elm$core$Set$union,
							kwdsAcc,
							elm$core$Set$fromList(kwds)),
						A2(combineWeigtedRes, resAcc, res));
				}),
			_Utils_Tuple2(elm$core$Set$empty, elm$core$Dict$empty),
			results);
		var keySet = _n0.a;
		var combRes = _n0.b;
		return _Utils_Tuple2(
			elm$core$Set$toList(keySet),
			combRes);
	});
var elm$core$Platform$Cmd$batch = _Platform_batch;
var elm$core$Platform$Cmd$none = elm$core$Platform$Cmd$batch(_List_Nil);
var elm$core$String$toLower = _String_toLower;
var author$project$SearchEngine$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var res = msg.a;
				if (!res.$) {
					var keywords = res.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								bp: author$project$SearchEngine$keywordsToMetadata(keywords)
							}),
						elm$core$Platform$Cmd$none);
				} else {
					var e = res.a;
					return _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
				}
			case 1:
				var s = msg.a;
				var lower = elm$core$String$toLower(s);
				var wrds = elm$core$String$words(lower);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bv: lower, a1: wrds}),
					elm$core$Platform$Cmd$none);
			case 2:
				return _Utils_Tuple2(
					model,
					author$project$SearchEngine$outbound(
						author$project$SearchEngine$encodeSearchResult(
							A2(
								author$project$SearchEngine$searchM,
								author$project$SearchEngine$metadata,
								A2(
									elm$core$List$filter,
									author$project$SearchEngine$irrelevant,
									function ($) {
										return $.a1;
									}(model))))));
			case 3:
				return author$project$SearchEngine$init(0);
			default:
				return _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
		}
	});
var elm$core$Platform$worker = _Platform_worker;
var author$project$SearchEngine$main = elm$core$Platform$worker(
	{dZ: author$project$SearchEngine$init, eK: author$project$SearchEngine$subscriptions, e6: author$project$SearchEngine$update});
_Platform_export({'SearchEngine':{'init':author$project$SearchEngine$main(
	elm$json$Json$Decode$succeed(0))(0)}});}(this));