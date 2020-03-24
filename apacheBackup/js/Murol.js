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

	if (typeof File !== 'undefined' && value instanceof File)
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
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
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
	if (region.aZ.cL === region.aM.cL)
	{
		return 'on line ' + region.aZ.cL;
	}
	return 'on lines ' + region.aZ.cL + ' through ' + region.aM.cL;
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
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
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
	return !isNaN(word)
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
		impl.iA,
		impl.kU,
		impl.kr,
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
		_Platform_enqueueEffects(managers, result.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, result.b, subscriptions(model));

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
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


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
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
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
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

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
		u: converter,
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
	var converter = _Platform_effectManagers[name].u;

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
		cP: func(record.cP),
		eM: record.eM,
		eA: record.eA
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
		var message = !tag ? value : tag < 3 ? value.a : value.cP;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.eM;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.eA) && event.preventDefault(),
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
		impl.iA,
		impl.kU,
		impl.kr,
		function(sendToApp, initialModel) {
			var view = impl.kY;
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
		impl.iA,
		impl.kU,
		impl.kr,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.eI && impl.eI(sendToApp)
			var view = impl.kY;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.d1);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.eO) && (_VirtualDom_doc.title = title = doc.eO);
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
	var onUrlChange = impl.jl;
	var onUrlRequest = impl.jm;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		eI: function(sendToApp)
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
							&& curr.f7 === next.f7
							&& curr.fu === next.fu
							&& curr.f3.a === next.f3.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		iA: function(flags)
		{
			return A3(impl.iA, flags, _Browser_getUrl(), key);
		},
		kY: impl.kY,
		kU: impl.kU,
		kr: impl.kr
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
		? { im: 'hidden', hk: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { im: 'mozHidden', hk: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { im: 'msHidden', hk: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { im: 'webkitHidden', hk: 'webkitvisibilitychange' }
		: { im: 'hidden', hk: 'visibilitychange' };
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
		gg: _Browser_getScene(),
		gD: {
			X: _Browser_window.pageXOffset,
			k2: _Browser_window.pageYOffset,
			k0: _Browser_doc.documentElement.clientWidth,
			il: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		k0: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		il: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
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
			gg: {
				k0: node.scrollWidth,
				il: node.scrollHeight
			},
			gD: {
				X: node.scrollLeft,
				k2: node.scrollTop,
				k0: node.clientWidth,
				il: node.clientHeight
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
			gg: _Browser_getScene(),
			gD: {
				X: x,
				k2: y,
				k0: _Browser_doc.documentElement.clientWidth,
				il: _Browser_doc.documentElement.clientHeight
			},
			hV: {
				X: x + rect.left,
				k2: y + rect.top,
				k0: rect.width,
				il: rect.height
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
			callback(toTask(request.cE.a(response)));
		}

		var xhr = new XMLHttpRequest();
		xhr.addEventListener('error', function() { done($elm$http$Http$NetworkError_); });
		xhr.addEventListener('timeout', function() { done($elm$http$Http$Timeout_); });
		xhr.addEventListener('load', function() { done(_Http_toResponse(request.cE.b, xhr)); });
		$elm$core$Maybe$isJust(request.gw) && _Http_track(router, xhr, request.gw.a);

		try {
			xhr.open(request.fK, request.c6, true);
		} catch (e) {
			return done($elm$http$Http$BadUrl_(request.c6));
		}

		_Http_configureRequest(xhr, request);

		request.d1.a && xhr.setRequestHeader('Content-Type', request.d1.a);
		xhr.send(request.d1.b);

		return function() { xhr.c = true; xhr.abort(); };
	});
});


// CONFIGURE

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.fq; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}
	xhr.timeout = request.gt.a || 0;
	xhr.responseType = request.cE.d;
	xhr.withCredentials = request.gV;
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
		c6: xhr.responseURL,
		kk: xhr.status,
		kl: xhr.statusText,
		fq: _Http_parseHeaders(xhr.getAllResponseHeaders())
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
			j8: event.loaded,
			eK: event.total
		}))));
	});
	xhr.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Receiving({
			jF: event.loaded,
			eK: event.lengthComputable ? $elm$core$Maybe$Just(event.total) : $elm$core$Maybe$Nothing
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
}



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
var $author$project$Murol$ChangeUrl = function (a) {
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
		if (!builder.t) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.A),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.A);
		} else {
			var treeLen = builder.t * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.E) : builder.E;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.t);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.A) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.A);
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
					{E: nodeList, t: (len / $elm$core$Array$branchFactor) | 0, A: tail});
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
		return {fk: fragment, fu: host, z: path, f3: port_, f7: protocol, f8: query};
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
		return {hc: bulletins, hM: delibs, i0: murolInfos};
	});
var $author$project$Document$Document$BulletinMeta = F4(
	function (issue, date, cover, index) {
		return {hD: cover, dk: date, fx: index, fC: issue};
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
	function (date, index) {
		return {dk: date, fx: index};
	});
var $author$project$Publications$Publications$decodeDelib = function () {
	var decodeIndexEntry = A3(
		$elm$json$Json$Decode$map2,
		$elm$core$Tuple$pair,
		A2($elm$json$Json$Decode$field, 'topic', $elm$json$Json$Decode$string),
		A2($elm$json$Json$Decode$field, 'page', $elm$json$Json$Decode$int));
	return A3(
		$elm$json$Json$Decode$map2,
		$author$project$Document$Document$DelibMeta,
		A2(
			$elm$json$Json$Decode$field,
			'date',
			A2($elm$json$Json$Decode$map, $elm$time$Time$millisToPosix, $elm$json$Json$Decode$int)),
		A2(
			$elm$json$Json$Decode$field,
			'index',
			$elm$json$Json$Decode$list(decodeIndexEntry)));
}();
var $author$project$Document$Document$MurolInfoMeta = F3(
	function (issue, date, topics) {
		return {dk: date, fC: issue, kS: topics};
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
						return _Utils_Tuple2(mi.fC, mi);
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
							$elm$time$Time$posixToMillis(d.dk),
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
						return _Utils_Tuple2(b.fC, b);
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
					$elm$http$Http$BadStatus(metadata.kk));
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
		return {ga: reqs, gp: subs};
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
							var _v4 = req.gw;
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
			A3($elm$http$Http$updateReqs, router, cmds, state.ga));
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
					state.gp)));
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
					gV: r.gV,
					d1: r.d1,
					cE: A2(_Http_mapExpect, func, r.cE),
					fq: r.fq,
					fK: r.fK,
					gt: r.gt,
					gw: r.gw,
					c6: r.c6
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
			{gV: false, d1: r.d1, cE: r.cE, fq: r.fq, fK: r.fK, gt: r.gt, gw: r.gw, c6: r.c6}));
};
var $elm$http$Http$post = function (r) {
	return $elm$http$Http$request(
		{d1: r.d1, cE: r.cE, fq: _List_Nil, fK: 'POST', gt: $elm$core$Maybe$Nothing, gw: $elm$core$Maybe$Nothing, c6: r.c6});
};
var $author$project$Publications$Publications$getAllPublications = function (msg) {
	var body = $elm$http$Http$jsonBody(
		$elm$json$Json$Encode$object(_List_Nil));
	return $elm$http$Http$post(
		{
			d1: body,
			cE: A2($elm$http$Http$expectJson, msg, $author$project$Publications$Publications$decodePublications),
			c6: '/getAllPublications.php'
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
			d1: body,
			cE: A2($elm$http$Http$expectJson, $author$project$Murol$LoadPages, $elm$json$Json$Decode$value),
			c6: '/getPageTree.php'
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
		return {b: id, eL: src};
	});
var $elm$browser$Browser$Events$Visible = 0;
var $author$project$Internals$Streams$BiStream = F6(
	function (value, leftStr, rightStr, prev, size, index) {
		return {fx: index, cK: leftStr, bT: prev, cZ: rightStr, eK: size, gA: value};
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
		return $.gA;
	}(bs);
};
var $author$project$Internals$Streams$next = function (_v0) {
	var s = _v0;
	return s(0);
};
var $author$project$Internals$Streams$right = function (_v0) {
	var value = _v0.gA;
	var leftStr = _v0.cK;
	var rightStr = _v0.cZ;
	var prev = _v0.bT;
	var size = _v0.eK;
	var index = _v0.fx;
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
		var value = bs.gA;
		var leftStr = bs.cK;
		var rightStr = bs.cZ;
		var prev = bs.bT;
		var size = bs.eK;
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
		return {b2: 0, bl: externalMsg, iu: stream, cN: $elm$core$Set$empty, m: $elm$core$Maybe$Nothing, ar: $elm$core$Maybe$Nothing, dW: 0};
	});
var $author$project$Internals$Contact$init = function (externalMsg) {
	return {db: false, cA: '', cB: '', hW: '', $7: '', bl: externalMsg, cP: '', y: '', cW: '', dN: false, j8: false, cu: ''};
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
				if (_Utils_cmp(era.aZ, posixMinutes) < 0) {
					return posixMinutes + era.jh;
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
		d7: (dayOfYear - ((((153 * mp) + 2) / 5) | 0)) + 1,
		eu: month,
		eV: year + ((month <= 2) ? 1 : 0)
	};
};
var $elm$time$Time$toDay = F2(
	function (zone, time) {
		return $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).d7;
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
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).eu;
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
		var _v0 = url.f7;
		if (!_v0) {
			return 'http://';
		} else {
			return 'https://';
		}
	}();
	return A3(
		$elm$url$Url$addPrefixed,
		'#',
		url.fk,
		A3(
			$elm$url$Url$addPrefixed,
			'?',
			url.f8,
			_Utils_ap(
				A2(
					$elm$url$Url$addPort,
					url.f3,
					_Utils_ap(http, url.fu)),
				url.z)));
};
var $elm$time$Time$utc = A2($elm$time$Time$Zone, 0, _List_Nil);
var $author$project$Murol$init = F3(
	function (flags, url, key) {
		var url_ = (url.z === '/') ? _Utils_update(
			url,
			{z: '/accueil'}) : url;
		var season = A2(
			$author$project$Document$DocumentViews$StyleSheets$timeToSeason,
			$elm$time$Time$utc,
			$elm$time$Time$millisToPosix(flags.hF));
		var headerGallerySize = 11;
		var contact = $author$project$Internals$Contact$init($author$project$Murol$ContactMsg);
		var config = {
			d4: false,
			hF: $elm$time$Time$millisToPosix(flags.hF),
			hI: $elm$core$Dict$empty,
			Z: false,
			h6: $elm$core$Dict$empty,
			ib: $elm$core$Dict$empty,
			il: flags.il,
			iU: 0,
			fP: $elm$core$Dict$empty,
			jo: $author$project$Murol$ToogleFiche,
			jp: $author$project$Murol$ToogleNews,
			jq: $elm$core$Set$empty,
			fZ: $elm$core$Set$empty,
			cV: $elm$core$Dict$empty,
			dL: 1,
			eC: $elm$core$Maybe$Nothing,
			jW: season,
			k0: flags.k0,
			k3: $elm$core$Maybe$Nothing,
			eW: $elm$time$Time$utc
		};
		var _v0 = A2(
			$elm$random$Random$step,
			A2(
				$elm$random$Random$list,
				headerGallerySize,
				A2($elm$random$Random$float, 0, 1)),
			$elm$random$Random$initialSeed(flags.hF));
		var randomOrder = _v0.a;
		var seed = _v0.b;
		return _Utils_Tuple2(
			{
				a: config,
				b3: contact,
				d8: '',
				ca: A2(
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
				ds: false,
				dt: key,
				cg: $elm$core$Maybe$Nothing,
				aT: $elm$core$Dict$empty,
				dR: $elm$core$Maybe$Nothing,
				bV: 0,
				cm: '',
				jY: seed,
				c3: $elm$core$Maybe$Nothing,
				c6: url_
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
		return {f2: pids, gp: subs};
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
		return {ff: event, dt: key};
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
			state.f2,
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
		var key = _v0.dt;
		var event = _v0.ff;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.gp);
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
		return {ey: oldTime, gb: request, gp: subs};
	});
var $elm$browser$Browser$AnimationManager$init = $elm$core$Task$succeed(
	A3($elm$browser$Browser$AnimationManager$State, _List_Nil, $elm$core$Maybe$Nothing, 0));
var $elm$browser$Browser$AnimationManager$now = _Browser_now(0);
var $elm$browser$Browser$AnimationManager$rAF = _Browser_rAF(0);
var $elm$browser$Browser$AnimationManager$onEffects = F3(
	function (router, subs, _v0) {
		var request = _v0.gb;
		var oldTime = _v0.ey;
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
		var subs = _v0.gp;
		var oldTime = _v0.ey;
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
				model.bW ? $elm$browser$Browser$Events$onAnimationFrame($author$project$Gallery$Gallery$Tick) : ((_Utils_eq(model.m, $elm$core$Maybe$Nothing) && _Utils_eq(model.ar, $elm$core$Maybe$Nothing)) ? $elm$core$Platform$Sub$none : $elm$browser$Browser$Events$onAnimationFrame($author$project$Gallery$Gallery$Tick))
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
		return {f6: processes, gr: taggers};
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
		var processes = _v0.f6;
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
		var _v0 = A2($elm$core$Dict$get, interval, state.gr);
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
		info.hk,
		A2(
			$elm$json$Json$Decode$map,
			$elm$browser$Browser$Events$withHidden(func),
			A2(
				$elm$json$Json$Decode$field,
				'target',
				A2($elm$json$Json$Decode$field, info.im, $elm$json$Json$Decode$bool))));
};
var $author$project$Gallery$HeaderGallery$subscriptions = function (model) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				(_Utils_eq(model.m, $elm$core$Maybe$Nothing) && _Utils_eq(model.ar, $elm$core$Maybe$Nothing)) ? $elm$core$Platform$Sub$none : $elm$browser$Browser$Events$onAnimationFrame($author$project$Gallery$HeaderGallery$Tick),
				((model.dW === 1) || ((!_Utils_eq(model.m, $elm$core$Maybe$Nothing)) || (!_Utils_eq(model.ar, $elm$core$Maybe$Nothing)))) ? $elm$core$Platform$Sub$none : A2(
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
		model.bl,
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
					$author$project$Gallery$HeaderGallery$subscriptions(model.ca)),
					$author$project$Internals$Contact$subscriptions(model.b3)
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
					model.a.ib))));
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
var $author$project$PageTreeEditor$PageTreeEditor$Content = F3(
	function (contentId, jsonContent, docContent) {
		return {hz: contentId, hS: docContent, fF: jsonContent};
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
		return {p: attrs, ag: cellContent, b: id};
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
		return {iv: img, c6: url};
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
		return {ir: image, B: label, gs: targetBlank, c6: url};
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
		return {io: hq, iu: images, eO: title, eQ: uuid};
	});
var $author$project$Document$Document$ImageMeta = F3(
	function (src, caption, size) {
		return {e5: caption, eK: size, eL: src};
	});
var $author$project$Document$Document$ImgSize = F2(
	function (imgWidth, imgHeight) {
		return {iw: imgHeight, ix: imgWidth};
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
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
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
var $TSFoster$elm_uuid$UUID$WrongFormat = 0;
var $TSFoster$elm_uuid$UUID$WrongLength = 1;
var $elm$core$String$endsWith = _String_endsWith;
var $TSFoster$elm_uuid$UUID$IsNil = 3;
var $TSFoster$elm_uuid$UUID$NoVersion = 4;
var $TSFoster$elm_uuid$UUID$UUID = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $TSFoster$elm_uuid$UUID$UnsupportedVariant = 2;
var $TSFoster$elm_uuid$UUID$isVariant1 = function (_v0) {
	var c = _v0.c;
	return (c >>> 30) === 2;
};
var $elm$core$Basics$not = _Basics_not;
var $TSFoster$elm_uuid$UUID$version = function (_v0) {
	var b = _v0.b;
	return 15 & (b >>> 12);
};
var $TSFoster$elm_uuid$UUID$fromInt32s = F4(
	function (a, b, c, d) {
		var wouldBeUUID = A4($TSFoster$elm_uuid$UUID$UUID, a, b, c, d);
		return ((!a) && ((!b) && ((!c) && (!d)))) ? $elm$core$Result$Err(3) : (($TSFoster$elm_uuid$UUID$version(wouldBeUUID) > 5) ? $elm$core$Result$Err(4) : ((!$TSFoster$elm_uuid$UUID$isVariant1(wouldBeUUID)) ? $elm$core$Result$Err(2) : $elm$core$Result$Ok(wouldBeUUID)));
	});
var $TSFoster$elm_uuid$UUID$forceUnsigned = $elm$core$Bitwise$shiftRightZfBy(0);
var $elm$core$Bitwise$or = _Bitwise_or;
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $TSFoster$elm_uuid$UUID$nibbleValuesToU32 = F8(
	function (a, b, c, d, e, f, g, h) {
		return $TSFoster$elm_uuid$UUID$forceUnsigned((a << 28) | ((b << 24) | ((c << 20) | ((d << 16) | ((e << 12) | ((f << 8) | ((g << 4) | h)))))));
	});
var $elm$core$String$replace = F3(
	function (before, after, string) {
		return A2(
			$elm$core$String$join,
			after,
			A2($elm$core$String$split, before, string));
	});
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $elm$core$String$toLower = _String_toLower;
var $TSFoster$elm_uuid$UUID$toNibbleValue = function (_char) {
	switch (_char) {
		case '0':
			return $elm$core$Maybe$Just(0);
		case '1':
			return $elm$core$Maybe$Just(1);
		case '2':
			return $elm$core$Maybe$Just(2);
		case '3':
			return $elm$core$Maybe$Just(3);
		case '4':
			return $elm$core$Maybe$Just(4);
		case '5':
			return $elm$core$Maybe$Just(5);
		case '6':
			return $elm$core$Maybe$Just(6);
		case '7':
			return $elm$core$Maybe$Just(7);
		case '8':
			return $elm$core$Maybe$Just(8);
		case '9':
			return $elm$core$Maybe$Just(9);
		case 'a':
			return $elm$core$Maybe$Just(10);
		case 'b':
			return $elm$core$Maybe$Just(11);
		case 'c':
			return $elm$core$Maybe$Just(12);
		case 'd':
			return $elm$core$Maybe$Just(13);
		case 'e':
			return $elm$core$Maybe$Just(14);
		case 'f':
			return $elm$core$Maybe$Just(15);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $TSFoster$elm_uuid$UUID$fromString = function (string) {
	var normalized = function (str) {
		return A2($elm$core$String$startsWith, 'urn:uuid:', str) ? A2($elm$core$String$dropLeft, 9, str) : ((A2($elm$core$String$startsWith, '{', str) && A2($elm$core$String$endsWith, '}', str)) ? A3($elm$core$String$slice, 1, -1, str) : str);
	}(
		$elm$core$String$toLower(
			A3(
				$elm$core$String$replace,
				'-',
				'',
				A3(
					$elm$core$String$replace,
					' ',
					'',
					A3(
						$elm$core$String$replace,
						'\t',
						'',
						A3($elm$core$String$replace, '\n', '', string))))));
	if ($elm$core$String$length(normalized) !== 32) {
		return $elm$core$Result$Err(1);
	} else {
		var _v0 = A2(
			$elm$core$List$filterMap,
			$TSFoster$elm_uuid$UUID$toNibbleValue,
			$elm$core$String$toList(normalized));
		if ((((((((((((((((((((((((((((((((_v0.b && _v0.b.b) && _v0.b.b.b) && _v0.b.b.b.b) && _v0.b.b.b.b.b) && _v0.b.b.b.b.b.b) && _v0.b.b.b.b.b.b.b) && _v0.b.b.b.b.b.b.b.b) && _v0.b.b.b.b.b.b.b.b.b) && _v0.b.b.b.b.b.b.b.b.b.b) && _v0.b.b.b.b.b.b.b.b.b.b.b) && _v0.b.b.b.b.b.b.b.b.b.b.b.b) && _v0.b.b.b.b.b.b.b.b.b.b.b.b.b) && _v0.b.b.b.b.b.b.b.b.b.b.b.b.b.b) && _v0.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b) && _v0.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b) && _v0.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b) && _v0.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b) && _v0.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b) && _v0.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b) && _v0.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b) && _v0.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b) && _v0.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b) && _v0.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b) && _v0.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b) && _v0.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b) && _v0.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b) && _v0.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b) && _v0.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b) && _v0.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b) && _v0.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b) && _v0.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b) && (!_v0.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b.b)) {
			var a1 = _v0.a;
			var _v1 = _v0.b;
			var a2 = _v1.a;
			var _v2 = _v1.b;
			var a3 = _v2.a;
			var _v3 = _v2.b;
			var a4 = _v3.a;
			var _v4 = _v3.b;
			var a5 = _v4.a;
			var _v5 = _v4.b;
			var a6 = _v5.a;
			var _v6 = _v5.b;
			var a7 = _v6.a;
			var _v7 = _v6.b;
			var a8 = _v7.a;
			var _v8 = _v7.b;
			var b1 = _v8.a;
			var _v9 = _v8.b;
			var b2 = _v9.a;
			var _v10 = _v9.b;
			var b3 = _v10.a;
			var _v11 = _v10.b;
			var b4 = _v11.a;
			var _v12 = _v11.b;
			var b5 = _v12.a;
			var _v13 = _v12.b;
			var b6 = _v13.a;
			var _v14 = _v13.b;
			var b7 = _v14.a;
			var _v15 = _v14.b;
			var b8 = _v15.a;
			var _v16 = _v15.b;
			var c1 = _v16.a;
			var _v17 = _v16.b;
			var c2 = _v17.a;
			var _v18 = _v17.b;
			var c3 = _v18.a;
			var _v19 = _v18.b;
			var c4 = _v19.a;
			var _v20 = _v19.b;
			var c5 = _v20.a;
			var _v21 = _v20.b;
			var c6 = _v21.a;
			var _v22 = _v21.b;
			var c7 = _v22.a;
			var _v23 = _v22.b;
			var c8 = _v23.a;
			var _v24 = _v23.b;
			var d1 = _v24.a;
			var _v25 = _v24.b;
			var d2 = _v25.a;
			var _v26 = _v25.b;
			var d3 = _v26.a;
			var _v27 = _v26.b;
			var d4 = _v27.a;
			var _v28 = _v27.b;
			var d5 = _v28.a;
			var _v29 = _v28.b;
			var d6 = _v29.a;
			var _v30 = _v29.b;
			var d7 = _v30.a;
			var _v31 = _v30.b;
			var d8 = _v31.a;
			return A4(
				$TSFoster$elm_uuid$UUID$fromInt32s,
				A8($TSFoster$elm_uuid$UUID$nibbleValuesToU32, a1, a2, a3, a4, a5, a6, a7, a8),
				A8($TSFoster$elm_uuid$UUID$nibbleValuesToU32, b1, b2, b3, b4, b5, b6, b7, b8),
				A8($TSFoster$elm_uuid$UUID$nibbleValuesToU32, c1, c2, c3, c4, c5, c6, c7, c8),
				A8($TSFoster$elm_uuid$UUID$nibbleValuesToU32, d1, d2, d3, d4, d5, d6, d7, d8));
		} else {
			return $elm$core$Result$Err(0);
		}
	}
};
var $author$project$Document$Json$DocumentDecoder$decodeUUID = A2(
	$elm$json$Json$Decode$andThen,
	A2(
		$elm$core$Basics$composeR,
		$TSFoster$elm_uuid$UUID$fromString,
		A2(
			$elm$core$Basics$composeR,
			$elm$core$Result$mapError(
				$elm$core$Basics$always('UUID error')),
			$elm_community$json_extra$Json$Decode$Extra$fromResult)),
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
		return {hK: data, i4: nbrCols, i5: nbrRows, kp: style};
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
					{E: nodeList, t: nodeListSize, A: jsArray});
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
var $author$project$Document$Document$TrixHtml = function (a) {
	return {$: 4, a: a};
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
var $author$project$Document$Document$Other = function (a) {
	return {$: 21, a: a};
};
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
										{aK: b, aO: l, aX: r, a_: t});
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
					case 'Other':
						return A3(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
							_List_fromArray(
								['Other', 'value']),
							$elm$json$Json$Decode$string,
							A3(
								$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
								_List_fromArray(
									['Other', 'attribute']),
								$elm$json$Json$Decode$string,
								$elm$json$Json$Decode$succeed(
									F2(
										function (value, attribute) {
											return $author$project$Document$Document$Other(
												_Utils_Tuple2(value, attribute));
										}))));
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
		return {B: label, gs: targetBlank, c6: url};
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
									return {p: a, fH: l, gA: v};
								}))))),
			$elm$json$Json$Decode$succeed(
				function (res) {
					return A2(
						$author$project$Document$Document$Heading,
						res.p,
						_Utils_Tuple2(res.fH, res.gA));
				})),
			A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'TBPrimitive',
			$author$project$Document$Json$DocumentDecoder$decodeTextBlockPrimitive,
			$elm$json$Json$Decode$succeed($author$project$Document$Document$TBPrimitive)),
			A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'TrixHtml',
			$elm$json$Json$Decode$string,
			$elm$json$Json$Decode$succeed($author$project$Document$Document$TrixHtml))
		]));
var $author$project$Document$Document$VideoMeta = F9(
	function (src, size, frameBorder, suggestions, controls, privacy, title, startAt, hosting) {
		return {hC: controls, h9: frameBorder, $9: hosting, jD: privacy, eK: size, eL: src, kj: startAt, ks: suggestions, eO: title};
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
		return {kW: videoHeight, kX: videoWidth};
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
		return {a$: classes, a4: docStyleId, a7: htmlId, bY: uid};
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
		return {p: attrs, a0: containerLabel, b: id};
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
	A2(
		$elm$core$Basics$composeR,
		$TSFoster$elm_uuid$UUID$fromString,
		A2(
			$elm$core$Basics$composeR,
			$elm$core$Result$mapError(
				$elm$core$Basics$always('UUID error')),
			$elm_community$json_extra$Json$Decode$Extra$fromResult)),
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
		return {fJ: mbContentId, y: name, z: path};
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
var $elm$core$String$fromList = _String_fromList;
var $TSFoster$elm_uuid$UUID$toHex = F2(
	function (acc, _int) {
		toHex:
		while (true) {
			if (!_int) {
				return $elm$core$String$fromList(acc);
			} else {
				var _char = function () {
					var _v0 = 15 & _int;
					switch (_v0) {
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
						default:
							return 'f';
					}
				}();
				var $temp$acc = A2($elm$core$List$cons, _char, acc),
					$temp$int = _int >>> 4;
				acc = $temp$acc;
				_int = $temp$int;
				continue toHex;
			}
		}
	});
var $TSFoster$elm_uuid$UUID$toString = function (_v0) {
	var a = _v0.a;
	var b = _v0.b;
	var c = _v0.c;
	var d = _v0.d;
	return A3(
		$elm$core$String$padLeft,
		8,
		'0',
		A2($TSFoster$elm_uuid$UUID$toHex, _List_Nil, a)) + ('-' + (A3(
		$elm$core$String$padLeft,
		4,
		'0',
		A2($TSFoster$elm_uuid$UUID$toHex, _List_Nil, b >>> 16)) + ('-' + (A3(
		$elm$core$String$padLeft,
		4,
		'0',
		A2($TSFoster$elm_uuid$UUID$toHex, _List_Nil, 65535 & b)) + ('-' + (A3(
		$elm$core$String$padLeft,
		4,
		'0',
		A2($TSFoster$elm_uuid$UUID$toHex, _List_Nil, c >>> 16)) + ('-' + (A3(
		$elm$core$String$padLeft,
		4,
		'0',
		A2($TSFoster$elm_uuid$UUID$toHex, _List_Nil, 65535 & c)) + A3(
		$elm$core$String$padLeft,
		8,
		'0',
		A2($TSFoster$elm_uuid$UUID$toHex, _List_Nil, d))))))))));
};
var $author$project$Murol$pageToPages = function (page) {
	var toList = function (_v0) {
		var pageInfo = _v0.a;
		var xs = _v0.b;
		var _v1 = pageInfo.fJ;
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
					strPath(pageInfo.z),
					pageInfo.y,
					$TSFoster$elm_uuid$UUID$toString(contentId)),
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
			var cellContent = doc.a.ag;
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
			var cellContent = doc.a.ag;
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
			$TSFoster$elm_uuid$UUID$toString,
			function ($) {
				return $.eQ;
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
			d1: body,
			cE: A2(
				$elm$http$Http$expectJson,
				$author$project$Murol$LoadContent(
					_Utils_Tuple3(path, contentId, name)),
				$elm$json$Json$Decode$value),
			c6: '/getContent.php'
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
																			return {gM: adresse, b$: categories, ec: description, hW: email, h4: fax, B: label, cJ: lastEdit, iQ: linkedDocs, i3: natureActiv, jf: nomEntite, jr: ouverture, cX: pjaun, jE: rank, jH: refOt, jM: responsables, kc: site, kz: telNumber, eQ: uuid, k_: visuel};
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
		return {iO: lien, iS: logo, je: nom};
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
						return {il: h, c6: u, k0: w};
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
		return {hQ: descr, h$: expiryDate, B: label, c6: url};
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
		return {fe: epis, ki: stars};
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
		return {je: nom, jB: poste, ky: tel};
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
	A2(
		$elm$core$Basics$composeR,
		$TSFoster$elm_uuid$UUID$fromString,
		A2(
			$elm$core$Basics$composeR,
			$elm$core$Result$mapError(
				$elm$core$Basics$always('UUID error')),
			$elm_community$json_extra$Json$Decode$Extra$fromResult)),
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
			d1: body,
			cE: A2(
				$elm$http$Http$expectJson,
				$author$project$Murol$LoadFiches,
				A2(
					$elm$json$Json$Decode$map,
					$elm$core$List$filterMap($elm$core$Basics$identity),
					$elm$json$Json$Decode$list(
						$elm$json$Json$Decode$maybe($author$project$GeneralDirectoryEditor$GeneralDirJson$decodeFiche)))),
			c6: '/getFiche.php'
		});
};
var $author$project$Murol$LoadNews = function (a) {
	return {$: 5, a: a};
};
var $author$project$Document$Document$News = F6(
	function (title, date, content, pic, uuid, expiry) {
		return {hy: content, dk: date, h_: expiry, jw: pic, eO: title, eQ: uuid};
	});
var $author$project$Document$Document$Pic = F3(
	function (url, width, height) {
		return {il: height, c6: url, k0: width};
	});
var $author$project$Document$Document$NewsContent = F2(
	function (tbElems, attrs) {
		return {p: attrs, kx: tbElems};
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
			d1: body,
			cE: A2(
				$elm$http$Http$expectJson,
				$author$project$Murol$LoadNews,
				$elm$json$Json$Decode$list($author$project$Document$Json$DocumentDecoder$decodeNews)),
			c6: '/getNews.php'
		});
};
var $author$project$Gallery$Gallery$DisplayImage = 0;
var $author$project$Document$Document$dummyPic = {
	e5: $elm$core$Maybe$Nothing,
	eK: A2($author$project$Document$Document$ImgSize, 0, 0),
	eL: A2($author$project$Document$Document$Inline, '', '')
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
			b2: 0,
			bj: 0,
			bl: externalMsg,
			ek: hd,
			en: A2(
				$elm$core$List$map,
				function ($) {
					return $.eL;
				},
				images),
			T: stream,
			cN: $elm$core$Set$empty,
			cO: $elm$core$Set$empty,
			m: $elm$core$Maybe$Nothing,
			ar: $elm$core$Maybe$Nothing,
			bW: false,
			eO: title
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
var $elm$core$Result$toMaybe = function (result) {
	if (!result.$) {
		var v = result.a;
		return $elm$core$Maybe$Just(v);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
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
		return {Y: delay_, I: dos, a6: ease_, v: from_, aW: ramp, aZ: start, n: to_};
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
			{a6: x});
	});
var $mgold$elm_animation$Animation$from = F2(
	function (x, _v0) {
		var a = _v0;
		return _Utils_update(
			a,
			{v: x, aW: $elm$core$Maybe$Nothing});
	});
var $author$project$Internals$Streams$updatePrev = F2(
	function (newPrev, bs) {
		return _Utils_update(
			bs,
			{bT: newPrev});
	});
var $author$project$Internals$Streams$goTo = F2(
	function (bs, p) {
		var value = bs.gA;
		var leftStr = bs.cK;
		var rightStr = bs.cZ;
		var prev = bs.bT;
		var size = bs.eK;
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
var $elm$core$Basics$pow = _Basics_pow;
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
	var from_ = _v0.v;
	var to_ = _v0.n;
	return _Utils_eq(from_, to_);
};
var $mgold$elm_animation$Animation$isDone = F2(
	function (clock, u) {
		var start = u.aZ;
		var delay_ = u.Y;
		var dos = u.I;
		var from_ = u.v;
		var to_ = u.n;
		var duration_ = A3($mgold$elm_animation$Animation$dur, dos, from_, to_);
		return $mgold$elm_animation$Animation$isStatic(u) || (_Utils_cmp(clock, (start + delay_) + duration_) > -1);
	});
var $author$project$Internals$Streams$left = function (_v0) {
	var value = _v0.gA;
	var leftStr = _v0.cK;
	var rightStr = _v0.cZ;
	var prev = _v0.bT;
	var size = _v0.eK;
	var index = _v0.fx;
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
		b1: function () {
			var shortSide = A2($elm$core$Basics$min, window.k0, window.il);
			var longSide = A2($elm$core$Basics$max, window.k0, window.il);
			return (shortSide < 600) ? 0 : ((longSide <= 1200) ? 1 : (((longSide > 1200) && (longSide <= 1920)) ? 2 : 3));
		}(),
		dG: (_Utils_cmp(window.k0, window.il) < 0) ? 0 : 1
	};
};
var $author$project$Document$DocumentViews$StyleSheets$docMaxWidth = F3(
	function (_v0, editMode, previewMode) {
		var winWidth = _v0.a;
		var winHeight = _v0.b;
		var device = $mdgriffith$elm_ui$Element$classifyDevice(
			{il: winHeight, k0: winWidth});
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
			if (device.b1 === 3) {
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
			config.k0,
			A3(
				$author$project$Document$DocumentViews$StyleSheets$docMaxWidth,
				_Utils_Tuple2(config.k0, config.il),
				config.Z,
				config.dL)) - 40);
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
				I: $mgold$elm_animation$Animation$Speed(
					$elm$core$Basics$abs(x))
			});
	});
var $mgold$elm_animation$Animation$to = F2(
	function (x, _v0) {
		var a = _v0;
		return _Utils_update(
			a,
			{aW: $elm$core$Maybe$Nothing, n: x});
	});
var $author$project$Gallery$Gallery$update = F3(
	function (config, msg, model) {
		switch (msg.$) {
			case 0:
				var _v1 = model.bj;
				if (!_v1) {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{bj: 1}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{bj: 0}),
						$elm$core$Platform$Cmd$none);
				}
			case 1:
				var src = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							bj: 0,
							T: A2(
								$author$project$Internals$Streams$goTo,
								model.T,
								function (chunk) {
									if (((chunk.b && chunk.b.b) && chunk.b.b.b) && (!chunk.b.b.b.b)) {
										var l = chunk.a;
										var _v3 = chunk.b;
										var c = _v3.a;
										var _v4 = _v3.b;
										var r = _v4.a;
										return _Utils_eq(c.eL, src);
									} else {
										return false;
									}
								})
						}),
					$elm$core$Platform$Cmd$none);
			case 2:
				var _v5 = model.m;
				if (!_v5.$) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{m: $elm$core$Maybe$Nothing, bW: true}),
						A2(
							$elm$core$Platform$Cmd$map,
							model.bl,
							A2(
								$elm$core$Task$perform,
								$author$project$Gallery$Gallery$Animate(0),
								$elm$time$Time$now)));
				}
			case 3:
				var _v6 = model.m;
				if (!_v6.$) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{m: $elm$core$Maybe$Nothing, bW: true}),
						A2(
							$elm$core$Platform$Cmd$map,
							model.bl,
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
					var _v7 = model.m;
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
						{m: newAnim}),
					$elm$core$Platform$Cmd$none);
			case 5:
				var position = msg.a;
				var _v8 = model.m;
				if (_v8.$ === 1) {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								ar: $elm$core$Maybe$Just(
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
				var _v9 = model.m;
				if (_v9.$ === 1) {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								ar: A2(
									$elm$core$Maybe$map,
									updateDrag(position),
									model.ar)
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 7:
				var _v11 = _Utils_Tuple2(model.m, model.ar);
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
										$mgold$elm_animation$Animation$animation(model.b2)))));
					};
					if ((start.X - current_.X) > 10) {
						var newAnim = function () {
							var _v14 = model.m;
							if (_v14.$ === 1) {
								return $elm$core$Maybe$Just(
									_Utils_Tuple2(
										newAnimFun(start.X - current_.X),
										0));
							} else {
								return $elm$core$Maybe$Nothing;
							}
						}();
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{m: newAnim, ar: $elm$core$Maybe$Nothing}),
							$elm$core$Platform$Cmd$none);
					} else {
						if (_Utils_cmp(start.X - current_.X, -10) < 0) {
							var newAnim = function () {
								var _v15 = model.m;
								if (_v15.$ === 1) {
									return $elm$core$Maybe$Just(
										_Utils_Tuple2(
											newAnimFun(
												$elm$core$Basics$abs(start.X - current_.X)),
											1));
								} else {
									return $elm$core$Maybe$Nothing;
								}
							}();
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{m: newAnim, ar: $elm$core$Maybe$Nothing}),
								$elm$core$Platform$Cmd$none);
						} else {
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{ar: $elm$core$Maybe$Nothing}),
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
					var _v17 = model.m;
					if (!_v17.$) {
						if (!_v17.a.b) {
							var _v18 = _v17.a;
							var anim = _v18.a;
							var _v19 = _v18.b;
							return A2($mgold$elm_animation$Animation$isDone, newClock, anim) ? _Utils_Tuple3(
								$elm$core$Maybe$Nothing,
								$author$project$Internals$Streams$right(
									function ($) {
										return $.T;
									}(model)),
								false) : _Utils_Tuple3(model.m, model.T, true);
						} else {
							var _v20 = _v17.a;
							var anim = _v20.a;
							var _v21 = _v20.b;
							return A2($mgold$elm_animation$Animation$isDone, newClock, anim) ? _Utils_Tuple3(
								$elm$core$Maybe$Nothing,
								$author$project$Internals$Streams$left(
									function ($) {
										return $.T;
									}(model)),
								false) : _Utils_Tuple3(model.m, model.T, true);
						}
					} else {
						return _Utils_Tuple3(model.m, model.T, model.bW);
					}
				}();
				var newAnim = _v16.a;
				var newImages = _v16.b;
				var tickSubOn = _v16.c;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{b2: newClock, T: newImages, m: newAnim, bW: tickSubOn}),
					$elm$core$Platform$Cmd$none);
			case 8:
				var src = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							cN: A2($elm$core$Set$insert, src, model.cN)
						}),
					$elm$core$Platform$Cmd$none);
			case 9:
				var src = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							cO: A2($elm$core$Set$insert, src, model.cO)
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
				I: $mgold$elm_animation$Animation$Duration(x)
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
					var _v1 = _Utils_Tuple2(model.m, dir);
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
														config.aa,
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
					{m: newAnim});
			case 1:
				var position = msg.a;
				var _v6 = model.m;
				if (_v6.$ === 1) {
					return _Utils_update(
						model,
						{
							ar: $elm$core$Maybe$Just(
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
				var _v7 = model.m;
				if (_v7.$ === 1) {
					return _Utils_update(
						model,
						{
							ar: A2(
								$elm$core$Maybe$map,
								updateDrag(position),
								model.ar)
						});
				} else {
					return model;
				}
			case 3:
				var _v9 = _Utils_Tuple2(model.m, model.ar);
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
									config.aa,
									A2(
										$mgold$elm_animation$Animation$from,
										x,
										$mgold$elm_animation$Animation$animation(model.b2)))));
					};
					if ((start.X - current_.X) > 10) {
						var newAnim = function () {
							var _v12 = model.m;
							if (_v12.$ === 1) {
								return $elm$core$Maybe$Just(
									_Utils_Tuple2(
										newAnimFun(start.X - current_.X),
										0));
							} else {
								return $elm$core$Maybe$Nothing;
							}
						}();
						return _Utils_update(
							model,
							{m: newAnim, ar: $elm$core$Maybe$Nothing});
					} else {
						if (_Utils_cmp(start.X - current_.X, -10) < 0) {
							var newAnim = function () {
								var _v13 = model.m;
								if (_v13.$ === 1) {
									return $elm$core$Maybe$Just(
										_Utils_Tuple2(
											newAnimFun(
												$elm$core$Basics$abs(start.X - current_.X)),
											1));
								} else {
									return $elm$core$Maybe$Nothing;
								}
							}();
							return _Utils_update(
								model,
								{m: newAnim, ar: $elm$core$Maybe$Nothing});
						} else {
							return _Utils_update(
								model,
								{ar: $elm$core$Maybe$Nothing});
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
						cN: A2($elm$core$Set$insert, src, model.cN)
					});
			case 4:
				var t = msg.a;
				var newClock = $elm$time$Time$posixToMillis(t);
				var _v14 = function () {
					var _v15 = model.m;
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
											return $.iu;
										}(model))) : _Utils_Tuple2(model.m, model.iu);
							case 1:
								var _v18 = _v15.a;
								var anim = _v18.a;
								var _v19 = _v18.b;
								return A2($mgold$elm_animation$Animation$isDone, newClock, anim) ? _Utils_Tuple2(
									$elm$core$Maybe$Nothing,
									$author$project$Internals$Streams$left(
										function ($) {
											return $.iu;
										}(model))) : _Utils_Tuple2(model.m, model.iu);
							default:
								var _v20 = _v15.a;
								var anim = _v20.a;
								var _v21 = _v20.b;
								return A2($mgold$elm_animation$Animation$isDone, newClock, anim) ? _Utils_Tuple2(
									$elm$core$Maybe$Nothing,
									$author$project$Internals$Streams$left(
										function ($) {
											return $.iu;
										}(model))) : _Utils_Tuple2(model.m, model.iu);
						}
					} else {
						return _Utils_Tuple2(model.m, model.iu);
					}
				}();
				var newAnim = _v14.a;
				var newImages = _v14.b;
				return _Utils_update(
					model,
					{b2: newClock, iu: newImages, m: newAnim});
			case 6:
				var visibility = msg.a;
				return _Utils_update(
					model,
					{dW: visibility});
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
var $author$project$Internals$Contact$canLoadCaptcha = function (model) {
	return (!$elm$core$String$isEmpty(model.y)) && ((!$elm$core$String$isEmpty(model.hW)) && ((!$elm$core$String$isEmpty(model.cu)) && (!$elm$core$String$isEmpty(model.cP))));
};
var $author$project$Internals$Contact$toCmd = F2(
	function (model, c) {
		return A2(
			$elm$core$Task$perform,
			function (_v0) {
				return model.bl(c);
			},
			$elm$core$Task$succeed(''));
	});
var $author$project$Internals$Contact$loadCaptcha_ = function (model) {
	return ((!model.db) && $author$project$Internals$Contact$canLoadCaptcha(model)) ? A2($author$project$Internals$Contact$toCmd, model, $author$project$Internals$Contact$LoadCaptcha) : $elm$core$Platform$Cmd$none;
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
								return $.y;
							}(model))),
						_Utils_Tuple2(
						'company',
						$elm$json$Json$Encode$string(
							function ($) {
								return $.cB;
							}(model))),
						_Utils_Tuple2(
						'email',
						$elm$json$Json$Encode$string(
							function ($) {
								return $.hW;
							}(model))),
						_Utils_Tuple2(
						'phone',
						$elm$json$Json$Encode$string(
							function ($) {
								return $.cW;
							}(model))),
						_Utils_Tuple2(
						'topic',
						$elm$json$Json$Encode$string(
							function ($) {
								return $.cu;
							}(model))),
						_Utils_Tuple2(
						'message',
						$elm$json$Json$Encode$string(
							function ($) {
								return $.cP;
							}(model))),
						_Utils_Tuple2(
						'captchaResponse',
						$elm$json$Json$Encode$string(resp))
					])));
		return $elm$http$Http$post(
			{
				d1: body,
				cE: A2($elm$http$Http$expectJson, $author$project$Internals$Contact$ProcessHttpResult, $author$project$Internals$Contact$decodeRes),
				c6: '/contact.php'
			});
	});
var $author$project$Internals$Contact$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var s = msg.a;
				var newModel = _Utils_update(
					model,
					{y: s});
				return _Utils_Tuple2(
					newModel,
					$author$project$Internals$Contact$loadCaptcha_(newModel));
			case 1:
				var s = msg.a;
				var newModel = _Utils_update(
					model,
					{cB: s});
				return _Utils_Tuple2(
					newModel,
					$author$project$Internals$Contact$loadCaptcha_(newModel));
			case 2:
				var s = msg.a;
				var newModel = _Utils_update(
					model,
					{hW: s});
				return _Utils_Tuple2(
					newModel,
					$author$project$Internals$Contact$loadCaptcha_(newModel));
			case 3:
				var s = msg.a;
				var newModel = _Utils_update(
					model,
					{cW: s});
				return _Utils_Tuple2(
					newModel,
					$author$project$Internals$Contact$loadCaptcha_(newModel));
			case 4:
				var s = msg.a;
				var newModel = _Utils_update(
					model,
					{cu: s});
				return _Utils_Tuple2(
					newModel,
					$author$project$Internals$Contact$loadCaptcha_(newModel));
			case 5:
				var s = msg.a;
				var newModel = _Utils_update(
					model,
					{cP: s});
				return _Utils_Tuple2(
					newModel,
					$author$project$Internals$Contact$loadCaptcha_(newModel));
			case 6:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{db: true}),
					A2(
						$elm$core$Platform$Cmd$map,
						model.bl,
						$author$project$Internals$Contact$loadCaptcha(0)));
			case 7:
				var s = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{cA: s}),
					$elm$core$Platform$Cmd$none);
			case 9:
				var res = msg.a;
				var newModel = function () {
					if (res.$ === 1) {
						var e = res.a;
						return _Utils_update(
							model,
							{
								$7: $author$project$Internals$CommonHelpers$httpErrorToString(e)
							});
					} else {
						if (res.a.$ === 1) {
							var e = res.a.a;
							return _Utils_update(
								model,
								{$7: e});
						} else {
							var m = res.a.a;
							return _Utils_update(
								model,
								{dN: true, j8: false});
						}
					}
				}();
				return _Utils_Tuple2(newModel, $elm$core$Platform$Cmd$none);
			case 8:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{j8: true}),
					A2(
						$elm$core$Platform$Cmd$map,
						model.bl,
						A2(
							$author$project$Internals$Contact$sendContactInfo,
							model,
							function ($) {
								return $.cA;
							}(model))));
			default:
				return _Utils_Tuple2(
					$author$project$Internals$Contact$init(model.bl),
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
									model.dt,
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
				var _v3 = A2($elm$core$Dict$get, url.z, model.aT);
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
									aT: A3(
										$elm$core$Dict$insert,
										url.z,
										_Utils_Tuple3(cId, name, $author$project$Murol$Loading),
										model.aT),
									c6: url
								}),
							$elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										$author$project$Murol$getContent(
										_Utils_Tuple3(url.z, cId, name))
									])));
					} else {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{c6: url}),
							$elm$core$Platform$Cmd$none);
					}
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{c6: url}),
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
										{cV: pageIndex}),
									cg: $elm$core$Maybe$Just(pageTree),
									aT: pages
								}),
							function () {
								var _v9 = A2($elm$core$Dict$get, model.c6.z, pages);
								if (!_v9.$) {
									if (!_v9.a.c.$) {
										var _v10 = _v9.a;
										var cId = _v10.a;
										var name = _v10.b;
										var _v11 = _v10.c;
										return $author$project$Murol$getContent(
											_Utils_Tuple3(model.c6.z, cId, name));
									} else {
										return $elm$core$Platform$Cmd$none;
									}
								} else {
									if ((model.c6.z === '/accueil/plan%20de%20site') || ((model.c6.z === '/accueil/contact') || (model.c6.z === '/accueil/mentions%20l%C3%A9gales'))) {
										return $elm$core$Platform$Cmd$none;
									} else {
										var url = model.c6;
										return A2(
											$elm$browser$Browser$Navigation$pushUrl,
											model.dt,
											$elm$url$Url$toString(
												_Utils_update(
													url,
													{z: '/accueil'})));
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
						var contentId = _v15.a.hz;
						var docContent = _v15.a.hS;
						var galleryMetas = $author$project$Document$Document$gatherGalleryMeta(docContent);
						var newGalleries = A3(
							$elm$core$List$foldr,
							F2(
								function (gm, acc) {
									return A3(
										$elm$core$Dict$insert,
										$TSFoster$elm_uuid$UUID$toString(gm.eQ),
										A4(
											$author$project$Gallery$Gallery$init,
											gm.eO,
											gm.io,
											gm.iu,
											$author$project$Murol$GalleryMsg(
												$TSFoster$elm_uuid$UUID$toString(gm.eQ))),
										acc);
								}),
							model.a.ib,
							galleryMetas);
						var fichesIds = $author$project$Document$Document$gatherFichesIds(docContent);
						var fichesToDownload = A3(
							$elm$core$List$foldr,
							F2(
								function (id, acc) {
									return A2($elm$core$Dict$member, id, model.a.h6) ? acc : A2($elm$core$List$cons, id, acc);
								}),
							_List_Nil,
							fichesIds);
						var config = model.a;
						var newConfig = _Utils_update(
							config,
							{ib: newGalleries});
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									a: newConfig,
									ds: true,
									aT: A3(
										$elm$core$Dict$insert,
										path,
										_Utils_Tuple3(
											cId,
											name,
											$author$project$Murol$Loaded(docContent)),
										model.aT)
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
									$TSFoster$elm_uuid$UUID$toString(f.eQ),
									f,
									acc);
							}),
						config.h6,
						fiches);
					var newConfig = _Utils_update(
						config,
						{h6: newFiches});
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
									$TSFoster$elm_uuid$UUID$toString(n.eQ),
									n,
									acc);
							}),
						$elm$core$Dict$empty,
						news);
					var config = model.a;
					var newConfig = _Utils_update(
						config,
						{fP: newsDict});
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
							eC: $elm$core$Maybe$Just(publications)
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
						{cm: s}),
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
						{bV: 1}),
					$author$project$Murol$toSearchEngine(
						A2(
							$elm$json$Json$Encode$encode,
							0,
							$elm$json$Json$Encode$string('<Cmd -> Search>'))));
			case 9:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bV: 0, cm: ''}),
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
							dR: $elm$core$Result$toMaybe(
								A2($elm$json$Json$Decode$decodeString, $author$project$Murol$decodeSearchResults, s)),
							bV: 2
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
								{hF: t})
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
								{jW: season})
						}),
					$elm$core$Platform$Cmd$none);
			case 13:
				var width = msg.a;
				var height = msg.b;
				var cfg = model.a;
				var newConfig = _Utils_update(
					cfg,
					{il: height, k0: width});
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
						jq: A2($elm$core$Set$member, fId, config.jq) ? A2($elm$core$Set$remove, fId, config.jq) : A2($elm$core$Set$insert, fId, config.jq)
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
						fZ: A2($elm$core$Set$member, nId, config.fZ) ? A2($elm$core$Set$remove, nId, config.fZ) : A2($elm$core$Set$insert, nId, config.fZ)
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
						{c3: $elm$core$Maybe$Nothing}),
					$elm$core$Platform$Cmd$none);
			case 17:
				var s = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							c3: $elm$core$Maybe$Just(s)
						}),
					$elm$core$Platform$Cmd$none);
			case 18:
				var z = msg.a;
				var cfg = model.a;
				var newConfig = _Utils_update(
					cfg,
					{eW: z});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: newConfig}),
					$elm$core$Platform$Cmd$none);
			case 19:
				var contactMsg = msg.a;
				var _v19 = A2($author$project$Internals$Contact$update, contactMsg, model.b3);
				var contact = _v19.a;
				var contactCmd = _v19.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{b3: contact}),
					contactCmd);
			case 20:
				var hgMsg = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							ca: A3(
								$author$project$Gallery$HeaderGallery$update,
								{
									aa: A2($elm$core$Basics$min, 1000, model.a.k0)
								},
								hgMsg,
								model.ca)
						}),
					$elm$core$Platform$Cmd$none);
			case 21:
				var uuid = msg.a;
				var galMsg = msg.b;
				var _v20 = A2($elm$core$Dict$get, uuid, model.a.ib);
				if (!_v20.$) {
					var gallery = _v20.a;
					var config = model.a;
					var _v21 = A3($author$project$Gallery$Gallery$update, model.a, galMsg, gallery);
					var newGallery = _v21.a;
					var cmds = _v21.b;
					var newConfig = _Utils_update(
						config,
						{
							ib: A3($elm$core$Dict$insert, uuid, newGallery, config.ib)
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
var $mdgriffith$elm_ui$Internal$Style$classes = {gG: 'a', dX: 'atv', gN: 'ab', gO: 'cx', gP: 'cy', gQ: 'acb', gR: 'accx', gS: 'accy', gT: 'acr', eZ: 'al', e_: 'ar', gU: 'at', dZ: 'ah', d_: 'av', gY: 's', g2: 'bh', g3: 'b', g6: 'w7', g8: 'bd', g9: 'bdt', c9: 'bn', ha: 'bs', dc: 'cpe', ho: 'cp', hp: 'cpx', hq: 'cpy', d3: 'c', de: 'ctr', df: 'cb', dg: 'ccx', bi: 'ccy', cD: 'cl', dh: 'cr', hA: 'ct', hG: 'cptr', hH: 'ctxt', fi: 'fcs', fj: 'focus-within', ia: 'fs', ih: 'g', ej: 'hbh', el: 'hc', fr: 'he', em: 'hf', fs: 'hfp', S: 'hv', is: 'ic', iz: 'fr', iB: 'iml', iC: 'imlf', iD: 'imlp', iE: 'implw', iF: 'it', iI: 'i', cM: 'lnk', cf: 'nb', fR: 'notxt', jj: 'ol', jk: 'or', bQ: 'oq', js: 'oh', f$: 'pg', f0: 'p', jv: 'ppe', M: 'ui', gd: 'r', jS: 'sb', jT: 'sbx', jU: 'sby', jV: 'sbt', kb: 'e', kd: 'cap', kf: 'sev', ko: 'sk', c$: 't', kA: 'tc', kC: 'w8', kD: 'w2', kE: 'w9', kF: 'tj', dV: 'tja', kG: 'tl', kH: 'w3', kI: 'w5', kJ: 'w4', kK: 'tr', kL: 'w6', kN: 'w1', kO: 'tun', gy: 'ts', bX: 'clr', gz: 'u', eR: 'wc', gE: 'we', eS: 'wf', gF: 'wfp', eT: 'wrp'};
var $mdgriffith$elm_ui$Internal$Model$Generic = {$: 0};
var $mdgriffith$elm_ui$Internal$Model$div = $mdgriffith$elm_ui$Internal$Model$Generic;
var $mdgriffith$elm_ui$Internal$Model$NoNearbyChildren = {$: 0};
var $mdgriffith$elm_ui$Internal$Model$columnClass = $mdgriffith$elm_ui$Internal$Style$classes.gY + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.d3);
var $mdgriffith$elm_ui$Internal$Model$gridClass = $mdgriffith$elm_ui$Internal$Style$classes.gY + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.ih);
var $mdgriffith$elm_ui$Internal$Model$pageClass = $mdgriffith$elm_ui$Internal$Style$classes.gY + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.f$);
var $mdgriffith$elm_ui$Internal$Model$paragraphClass = $mdgriffith$elm_ui$Internal$Style$classes.gY + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.f0);
var $mdgriffith$elm_ui$Internal$Model$rowClass = $mdgriffith$elm_ui$Internal$Style$classes.gY + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.gd);
var $mdgriffith$elm_ui$Internal$Model$singleClass = $mdgriffith$elm_ui$Internal$Style$classes.gY + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.kb);
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
				A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$lengthClassName, template.jQ)) + ('-cols-' + (A2(
				$elm$core$String$join,
				'-',
				A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$lengthClassName, template.ht)) + ('-space-x-' + ($mdgriffith$elm_ui$Internal$Model$lengthClassName(template.kg.a) + ('-space-y-' + $mdgriffith$elm_ui$Internal$Model$lengthClassName(template.kg.b)))))));
		case 9:
			var pos = style.a;
			return 'gp grid-pos-' + ($elm$core$String$fromInt(pos.gd) + ('-' + ($elm$core$String$fromInt(pos.fa) + ('-' + ($elm$core$String$fromInt(pos.k0) + ('-' + $elm$core$String$fromInt(pos.il)))))));
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
					shadow.fz ? $elm$core$Maybe$Just('inset') : $elm$core$Maybe$Nothing,
					$elm$core$Maybe$Just(
					$elm$core$String$fromFloat(shadow.jh.a) + 'px'),
					$elm$core$Maybe$Just(
					$elm$core$String$fromFloat(shadow.jh.b) + 'px'),
					$elm$core$Maybe$Just(
					$elm$core$String$fromFloat(shadow.g5) + 'px'),
					$elm$core$Maybe$Just(
					$elm$core$String$fromFloat(shadow.eK) + 'px'),
					$elm$core$Maybe$Just(
					$mdgriffith$elm_ui$Internal$Model$formatColor(shadow.hr))
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
	return _List_fromArray(
		[
			A2(
			$mdgriffith$elm_ui$Internal$Model$Style,
			$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.fj) + ':focus-within',
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
						focus.g7),
						A2(
						$elm$core$Maybe$map,
						function (color) {
							return A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'background-color',
								$mdgriffith$elm_ui$Internal$Model$formatColor(color));
						},
						focus.g$),
						A2(
						$elm$core$Maybe$map,
						function (shadow) {
							return A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'box-shadow',
								$mdgriffith$elm_ui$Internal$Model$formatBoxShadow(
									{
										g5: shadow.g5,
										hr: shadow.hr,
										fz: false,
										jh: A2(
											$elm$core$Tuple$mapSecond,
											$elm$core$Basics$toFloat,
											A2($elm$core$Tuple$mapFirst, $elm$core$Basics$toFloat, shadow.jh)),
										eK: shadow.eK
									}));
						},
						focus.ka),
						$elm$core$Maybe$Just(
						A2($mdgriffith$elm_ui$Internal$Model$Property, 'outline', 'none'))
					]))),
			A2(
			$mdgriffith$elm_ui$Internal$Model$Style,
			$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gY) + (':focus .focusable, ' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gY) + '.focusable:focus')),
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
						focus.g7),
						A2(
						$elm$core$Maybe$map,
						function (color) {
							return A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'background-color',
								$mdgriffith$elm_ui$Internal$Model$formatColor(color));
						},
						focus.g$),
						A2(
						$elm$core$Maybe$map,
						function (shadow) {
							return A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'box-shadow',
								$mdgriffith$elm_ui$Internal$Model$formatBoxShadow(
									{
										g5: shadow.g5,
										hr: shadow.hr,
										fz: false,
										jh: A2(
											$elm$core$Tuple$mapSecond,
											$elm$core$Basics$toFloat,
											A2($elm$core$Tuple$mapFirst, $elm$core$Basics$toFloat, shadow.jh)),
										eK: shadow.eK
									}));
						},
						focus.ka),
						$elm$core$Maybe$Just(
						A2($mdgriffith$elm_ui$Internal$Model$Property, 'outline', 'none'))
					])))
		]);
};
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$virtual_dom$VirtualDom$property = F2(
	function (key, value) {
		return A2(
			_VirtualDom_property,
			_VirtualDom_noInnerHtmlOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
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
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hA);
		case 1:
			var _v2 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.df);
		case 2:
			var _v3 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dh);
		case 3:
			var _v4 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cD);
		case 4:
			var _v5 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dg);
		default:
			var _v6 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bi);
	}
};
var $mdgriffith$elm_ui$Internal$Style$selfName = function (desc) {
	switch (desc) {
		case 0:
			var _v1 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gU);
		case 1:
			var _v2 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gN);
		case 2:
			var _v3 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.e_);
		case 3:
			var _v4 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eZ);
		case 4:
			var _v5 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gO);
		default:
			var _v6 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gP);
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
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gY),
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
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ej),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '0'),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g2),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '-1')
					]))
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Descriptor,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.jV),
		_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.c$),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.em),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eS),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'auto !important')
							]))
					]))
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.el),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', 'auto')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.em),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '100000')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eS),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gF),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eR),
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
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gY),
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
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gY),
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
			$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gY),
			_Utils_ap(
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kb),
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.is))),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'block')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gY) + ':focus',
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'outline', 'none')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.M),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', 'auto'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'min-height', '100%'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '0'),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				_Utils_ap(
					$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gY),
					$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.em)),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.em),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.iz),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cf),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'fixed')
							]))
					]))
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cf),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'relative'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border', 'none'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'row'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto'),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kb),
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
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gG),
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
											$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.em),
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', 'auto')
												])),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eS),
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
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g3),
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
											$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.em),
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', 'auto')
												]))
										]));
							case 2:
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.jk),
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
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.jj),
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
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.iz),
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
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g2),
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
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gY),
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
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eT),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-wrap', 'wrap')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.fR),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, '-moz-user-select', 'none'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, '-webkit-user-select', 'none'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, '-ms-user-select', 'none'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'user-select', 'none')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hG),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'cursor', 'pointer')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hH),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'cursor', 'text')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.jv),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none !important')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dc),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto !important')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bX),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.bQ),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.S, $mdgriffith$elm_ui$Internal$Style$classes.bX)) + ':hover',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.S, $mdgriffith$elm_ui$Internal$Style$classes.bQ)) + ':hover',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.fi, $mdgriffith$elm_ui$Internal$Style$classes.bX)) + ':focus',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.fi, $mdgriffith$elm_ui$Internal$Style$classes.bQ)) + ':focus',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.dX, $mdgriffith$elm_ui$Internal$Style$classes.bX)) + ':active',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.dX, $mdgriffith$elm_ui$Internal$Style$classes.bQ)) + ':active',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gy),
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
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.jS),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow', 'auto'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.jT),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-x', 'auto'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gd),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '1')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.jU),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-y', 'auto'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.d3),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '1')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kb),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '1')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ho),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow', 'hidden')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hp),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-x', 'hidden')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.hq),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-y', 'hidden')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eR),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', 'auto')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.c9),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-width', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g8),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-style', 'dashed')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g9),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-style', 'dotted')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ha),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-style', 'solid')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.c$),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline-block')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.iF),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'line-height', '1.05'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'background', 'transparent')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kb),
				$mdgriffith$elm_ui$Internal$Style$elDescription),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gd),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'row'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gY),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', '0%'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gE),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.cM),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.em),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'stretch !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.fs),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'stretch !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eS),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '100000')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.de),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'stretch')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'u:first-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.gT,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:first-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.gR,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gO),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-left', 'auto !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:last-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.gR,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gO),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-right', 'auto !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:only-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.gR,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gP),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:last-of-type.' + ($mdgriffith$elm_ui$Internal$Style$classes.gR + ' ~ u'),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'u:first-of-type.' + ($mdgriffith$elm_ui$Internal$Style$classes.gT + (' ~ s.' + $mdgriffith$elm_ui$Internal$Style$classes.gR)),
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
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kf),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'space-between')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.d3),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'column'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gY),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', '0%'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.fr),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.d3),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.em),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '100000')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eS),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gF),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eR),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'u:first-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.gQ,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:first-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.gS,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gP),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', '0 !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:last-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.gS,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gP),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', '0 !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:only-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.gS,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gP),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:last-of-type.' + ($mdgriffith$elm_ui$Internal$Style$classes.gS + ' ~ u'),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'u:first-of-type.' + ($mdgriffith$elm_ui$Internal$Style$classes.gQ + (' ~ s.' + $mdgriffith$elm_ui$Internal$Style$classes.gS)),
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
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.de),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'stretch !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kf),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'space-between')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ih),
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
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gY),
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
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.f$),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'block'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gY + ':first-child'),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot(
							$mdgriffith$elm_ui$Internal$Style$classes.gY + ($mdgriffith$elm_ui$Internal$Style$selfName(3) + (':first-child + .' + $mdgriffith$elm_ui$Internal$Style$classes.gY))),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot(
							$mdgriffith$elm_ui$Internal$Style$classes.gY + ($mdgriffith$elm_ui$Internal$Style$selfName(2) + (':first-child + .' + $mdgriffith$elm_ui$Internal$Style$classes.gY))),
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
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.iB),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre-wrap'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'background-color', 'transparent')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.iE),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kb),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.iD),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre-wrap'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'cursor', 'text'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.iC),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre-wrap'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'color', 'transparent')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.f0),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'block'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ej),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '0'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g2),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '-1')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.c$),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kb),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.iz),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g2),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gG),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g3),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.jk),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.jj),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.c$),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kb),
								_List_fromArray(
									[
										A2(
										$mdgriffith$elm_ui$Internal$Style$Child,
										$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.c$),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline'),
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal')
											]))
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gd),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline-flex')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.d3),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline-flex')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ih),
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
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kN),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '100')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kD),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '200')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kH),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '300')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kJ),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '400')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kI),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '500')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kL),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '600')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.g6),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '700')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kC),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '800')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kE),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '900')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.iI),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-style', 'italic')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ko),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration', 'line-through')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gz),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration', 'underline'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration-skip-ink', 'auto'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration-skip', 'ink')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				_Utils_ap(
					$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gz),
					$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ko)),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration', 'line-through underline'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration-skip-ink', 'auto'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration-skip', 'ink')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kO),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-style', 'normal')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kF),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'justify')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dV),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'justify-all')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kA),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'center')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kK),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'right')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.kG),
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
var $mdgriffith$elm_ui$Internal$Style$explainer = '\n.explain {\n    border: 6px solid rgb(174, 121, 15) !important;\n}\n.explain > .' + ($mdgriffith$elm_ui$Internal$Style$classes.gY + (' {\n    border: 4px dashed rgb(0, 151, 167) !important;\n}\n\n.ctr {\n    border: none !important;\n}\n.explain > .ctr > .' + ($mdgriffith$elm_ui$Internal$Style$classes.gY + ' {\n    border: 4px dashed rgb(0, 151, 167) !important;\n}\n\n')));
var $mdgriffith$elm_ui$Internal$Style$inputTextReset = '\ninput[type="search"],\ninput[type="search"]::-webkit-search-decoration,\ninput[type="search"]::-webkit-search-cancel-button,\ninput[type="search"]::-webkit-search-results-button,\ninput[type="search"]::-webkit-search-results-decoration {\n  -webkit-appearance:none;\n}\n';
var $mdgriffith$elm_ui$Internal$Style$sliderReset = '\ninput[type=range] {\n  -webkit-appearance: none; \n  background: transparent;\n  position:absolute;\n  left:0;\n  top:0;\n  z-index:10;\n  width: 100%;\n  outline: dashed 1px;\n  height: 100%;\n  opacity: 0;\n}\n';
var $mdgriffith$elm_ui$Internal$Style$thumbReset = '\ninput[type=range]::-webkit-slider-thumb {\n    -webkit-appearance: none;\n    opacity: 0.5;\n    width: 80px;\n    height: 80px;\n    background-color: black;\n    border:none;\n    border-radius: 5px;\n}\ninput[type=range]::-moz-range-thumb {\n    opacity: 0.5;\n    width: 80px;\n    height: 80px;\n    background-color: black;\n    border:none;\n    border-radius: 5px;\n}\ninput[type=range]::-ms-thumb {\n    opacity: 0.5;\n    width: 80px;\n    height: 80px;\n    background-color: black;\n    border:none;\n    border-radius: 5px;\n}\ninput[type=range][orient=vertical]{\n    writing-mode: bt-lr; /* IE */\n    -webkit-appearance: slider-vertical;  /* WebKit */\n}\n';
var $mdgriffith$elm_ui$Internal$Style$trackReset = '\ninput[type=range]::-moz-range-track {\n    background: transparent;\n    cursor: pointer;\n}\ninput[type=range]::-ms-track {\n    background: transparent;\n    cursor: pointer;\n}\ninput[type=range]::-webkit-slider-runnable-track {\n    background: transparent;\n    cursor: pointer;\n}\n';
var $mdgriffith$elm_ui$Internal$Style$overrides = '@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gY) + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gd) + (' > ' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gY) + (' { flex-basis: auto !important; } ' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gY) + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gd) + (' > ' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.gY) + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.de) + (' { flex-basis: auto !important; }}' + ($mdgriffith$elm_ui$Internal$Style$inputTextReset + ($mdgriffith$elm_ui$Internal$Style$sliderReset + ($mdgriffith$elm_ui$Internal$Style$trackReset + ($mdgriffith$elm_ui$Internal$Style$thumbReset + $mdgriffith$elm_ui$Internal$Style$explainer)))))))))))))));
var $elm$core$String$concat = function (strings) {
	return A2($elm$core$String$join, '', strings);
};
var $mdgriffith$elm_ui$Internal$Style$Intermediate = $elm$core$Basics$identity;
var $mdgriffith$elm_ui$Internal$Style$emptyIntermediate = F2(
	function (selector, closing) {
		return {dd: closing, V: _List_Nil, by: _List_Nil, be: selector};
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
								by: A2(
									$elm$core$List$cons,
									_Utils_Tuple2(name, val),
									rendered.by)
							});
					case 2:
						var _v2 = rule.a;
						var prop = _v2.a;
						var value = _v2.b;
						var props = rule.b;
						return _Utils_update(
							rendered,
							{
								V: A2(
									$elm$core$List$cons,
									{dd: '\n}', V: _List_Nil, by: props, be: '@supports (' + (prop + (':' + (value + (') {' + parent.be))))},
									rendered.V)
							});
					case 4:
						var selector = rule.a;
						var adjRules = rule.b;
						return _Utils_update(
							rendered,
							{
								V: A2(
									$elm$core$List$cons,
									A2(
										$mdgriffith$elm_ui$Internal$Style$renderRules,
										A2($mdgriffith$elm_ui$Internal$Style$emptyIntermediate, parent.be + (' + ' + selector), ''),
										adjRules),
									rendered.V)
							});
					case 1:
						var child = rule.a;
						var childRules = rule.b;
						return _Utils_update(
							rendered,
							{
								V: A2(
									$elm$core$List$cons,
									A2(
										$mdgriffith$elm_ui$Internal$Style$renderRules,
										A2($mdgriffith$elm_ui$Internal$Style$emptyIntermediate, parent.be + (' > ' + child), ''),
										childRules),
									rendered.V)
							});
					case 3:
						var descriptor = rule.a;
						var descriptorRules = rule.b;
						return _Utils_update(
							rendered,
							{
								V: A2(
									$elm$core$List$cons,
									A2(
										$mdgriffith$elm_ui$Internal$Style$renderRules,
										A2(
											$mdgriffith$elm_ui$Internal$Style$emptyIntermediate,
											_Utils_ap(parent.be, descriptor),
											''),
										descriptorRules),
									rendered.V)
							});
					default:
						var batched = rule.a;
						return _Utils_update(
							rendered,
							{
								V: A2(
									$elm$core$List$cons,
									A2(
										$mdgriffith$elm_ui$Internal$Style$renderRules,
										A2($mdgriffith$elm_ui$Internal$Style$emptyIntermediate, parent.be, ''),
										batched),
									rendered.V)
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
		var _v2 = rule.by;
		if (!_v2.b) {
			return '';
		} else {
			return rule.be + ('{' + (renderValues(rule.by) + (rule.dd + '}')));
		}
	};
	var renderIntermediate = function (_v0) {
		var rule = _v0;
		return _Utils_ap(
			renderClass(rule),
			$elm$core$String$concat(
				A2($elm$core$List$map, renderIntermediate, rule.V)));
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
var $mdgriffith$elm_ui$Internal$Model$staticRoot = function (opts) {
	var _v0 = opts.e;
	switch (_v0) {
		case 0:
			return A3(
				$elm$virtual_dom$VirtualDom$node,
				'div',
				_List_Nil,
				_List_fromArray(
					[
						A3(
						$elm$virtual_dom$VirtualDom$node,
						'style',
						_List_Nil,
						_List_fromArray(
							[
								$elm$virtual_dom$VirtualDom$text($mdgriffith$elm_ui$Internal$Style$rules)
							]))
					]));
		case 1:
			return $elm$virtual_dom$VirtualDom$text('');
		default:
			return A3(
				$elm$virtual_dom$VirtualDom$node,
				'elm-ui-static-rules',
				_List_fromArray(
					[
						A2(
						$elm$virtual_dom$VirtualDom$property,
						'rules',
						$elm$json$Json$Encode$string($mdgriffith$elm_ui$Internal$Style$rules))
					]),
				_List_Nil);
	}
};
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
			var name = font.a.y;
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
		return A2($elm$core$List$any, $mdgriffith$elm_ui$Internal$Model$isSmallCaps, font.gB);
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
var $mdgriffith$elm_ui$Internal$Model$renderStyle = F4(
	function (options, maybePseudo, selector, props) {
		if (maybePseudo.$ === 1) {
			return _List_fromArray(
				[
					selector + ('{' + (A3(
					$elm$core$List$foldl,
					$mdgriffith$elm_ui$Internal$Model$renderProps(false),
					'',
					props) + '\n}'))
				]);
		} else {
			var pseudo = maybePseudo.a;
			switch (pseudo) {
				case 1:
					var _v2 = options.S;
					switch (_v2) {
						case 0:
							return _List_Nil;
						case 2:
							return _List_fromArray(
								[
									selector + ('-hv {' + (A3(
									$elm$core$List$foldl,
									$mdgriffith$elm_ui$Internal$Model$renderProps(true),
									'',
									props) + '\n}'))
								]);
						default:
							return _List_fromArray(
								[
									selector + ('-hv:hover {' + (A3(
									$elm$core$List$foldl,
									$mdgriffith$elm_ui$Internal$Model$renderProps(false),
									'',
									props) + '\n}'))
								]);
					}
				case 0:
					var renderedProps = A3(
						$elm$core$List$foldl,
						$mdgriffith$elm_ui$Internal$Model$renderProps(false),
						'',
						props);
					return _List_fromArray(
						[selector + ('-fs:focus {' + (renderedProps + '\n}')), '.' + ($mdgriffith$elm_ui$Internal$Style$classes.gY + (':focus ~ ' + (selector + ('-fs:not(.focus)  {' + (renderedProps + '\n}'))))), '.' + ($mdgriffith$elm_ui$Internal$Style$classes.gY + (':focus ' + (selector + ('-fs  {' + (renderedProps + '\n}'))))), selector + ('-fs:focus-within {' + (renderedProps + '\n}')), '.focusable-parent:focus ~ ' + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.gY + (' ' + (selector + ('-fs {' + (renderedProps + '\n}'))))))]);
				default:
					return _List_fromArray(
						[
							selector + ('-act:active {' + (A3(
							$elm$core$List$foldl,
							$mdgriffith$elm_ui$Internal$Model$renderProps(false),
							'',
							props) + '\n}'))
						]);
			}
		}
	});
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
				A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$renderVariant, font.gB)));
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
var $mdgriffith$elm_ui$Internal$Model$renderStyleRule = F3(
	function (options, rule, maybePseudo) {
		switch (rule.$) {
			case 0:
				var selector = rule.a;
				var props = rule.b;
				return A4($mdgriffith$elm_ui$Internal$Model$renderStyle, options, maybePseudo, selector, props);
			case 13:
				var name = rule.a;
				var prop = rule.b;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
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
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
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
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
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
				return A4($mdgriffith$elm_ui$Internal$Model$renderStyle, options, maybePseudo, '.' + name, families);
			case 3:
				var _class = rule.a;
				var prop = rule.b;
				var val = rule.c;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
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
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
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
				var single = '.' + $mdgriffith$elm_ui$Internal$Style$classes.kb;
				var row = '.' + $mdgriffith$elm_ui$Internal$Style$classes.gd;
				var wrappedRow = '.' + ($mdgriffith$elm_ui$Internal$Style$classes.eT + row);
				var right = '.' + $mdgriffith$elm_ui$Internal$Style$classes.e_;
				var paragraph = '.' + $mdgriffith$elm_ui$Internal$Style$classes.f0;
				var page = '.' + $mdgriffith$elm_ui$Internal$Style$classes.f$;
				var left = '.' + $mdgriffith$elm_ui$Internal$Style$classes.eZ;
				var halfY = $elm$core$String$fromFloat(y / 2) + 'px';
				var halfX = $elm$core$String$fromFloat(x / 2) + 'px';
				var column = '.' + $mdgriffith$elm_ui$Internal$Style$classes.d3;
				var _class = '.' + cls;
				var any = '.' + $mdgriffith$elm_ui$Internal$Style$classes.gY;
				return $elm$core$List$concat(
					_List_fromArray(
						[
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (row + (' > ' + (any + (' + ' + any)))),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-left', xPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (wrappedRow + (' > ' + any)),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin', halfY + (' ' + halfX))
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (column + (' > ' + (any + (' + ' + any)))),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-top', yPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (page + (' > ' + (any + (' + ' + any)))),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-top', yPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (page + (' > ' + left)),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-right', xPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (page + (' > ' + right)),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-left', xPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_Utils_ap(_class, paragraph),
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Internal$Model$Property,
									'line-height',
									'calc(1em + ' + ($elm$core$String$fromInt(y) + 'px)'))
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							'textarea' + (any + _class),
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Internal$Model$Property,
									'line-height',
									'calc(1em + ' + ($elm$core$String$fromInt(y) + 'px)')),
									A2(
									$mdgriffith$elm_ui$Internal$Model$Property,
									'height',
									'calc(100% + ' + ($elm$core$String$fromInt(y) + 'px)'))
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (paragraph + (' > ' + left)),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-right', xPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (paragraph + (' > ' + right)),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-left', xPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
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
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
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
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
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
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
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
				var xSpacing = toGridLength(template.kg.a);
				var ySpacing = toGridLength(template.kg.b);
				var rows = function (x) {
					return 'grid-template-rows: ' + (x + ';');
				}(
					A2(
						$elm$core$String$join,
						' ',
						A2($elm$core$List$map, toGridLength, template.jQ)));
				var msRows = function (x) {
					return '-ms-grid-rows: ' + (x + ';');
				}(
					A2(
						$elm$core$String$join,
						ySpacing,
						A2($elm$core$List$map, toGridLength, template.ht)));
				var msColumns = function (x) {
					return '-ms-grid-columns: ' + (x + ';');
				}(
					A2(
						$elm$core$String$join,
						ySpacing,
						A2($elm$core$List$map, toGridLength, template.ht)));
				var gapY = 'grid-row-gap:' + (toGridLength(template.kg.b) + ';');
				var gapX = 'grid-column-gap:' + (toGridLength(template.kg.a) + ';');
				var columns = function (x) {
					return 'grid-template-columns: ' + (x + ';');
				}(
					A2(
						$elm$core$String$join,
						' ',
						A2($elm$core$List$map, toGridLength, template.ht)));
				var _class = '.grid-rows-' + (A2(
					$elm$core$String$join,
					'-',
					A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$lengthClassName, template.jQ)) + ('-cols-' + (A2(
					$elm$core$String$join,
					'-',
					A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$lengthClassName, template.ht)) + ('-space-x-' + ($mdgriffith$elm_ui$Internal$Model$lengthClassName(template.kg.a) + ('-space-y-' + $mdgriffith$elm_ui$Internal$Model$lengthClassName(template.kg.b)))))));
				var modernGrid = _class + ('{' + (columns + (rows + (gapX + (gapY + '}')))));
				var supports = '@supports (display:grid) {' + (modernGrid + '}');
				var base = _class + ('{' + (msColumns + (msRows + '}')));
				return _List_fromArray(
					[base, supports]);
			case 9:
				var position = rule.a;
				var msPosition = A2(
					$elm$core$String$join,
					' ',
					_List_fromArray(
						[
							'-ms-grid-row: ' + ($elm$core$String$fromInt(position.gd) + ';'),
							'-ms-grid-row-span: ' + ($elm$core$String$fromInt(position.il) + ';'),
							'-ms-grid-column: ' + ($elm$core$String$fromInt(position.fa) + ';'),
							'-ms-grid-column-span: ' + ($elm$core$String$fromInt(position.k0) + ';')
						]));
				var modernPosition = A2(
					$elm$core$String$join,
					' ',
					_List_fromArray(
						[
							'grid-row: ' + ($elm$core$String$fromInt(position.gd) + (' / ' + ($elm$core$String$fromInt(position.gd + position.il) + ';'))),
							'grid-column: ' + ($elm$core$String$fromInt(position.fa) + (' / ' + ($elm$core$String$fromInt(position.fa + position.k0) + ';')))
						]));
				var _class = '.grid-pos-' + ($elm$core$String$fromInt(position.gd) + ('-' + ($elm$core$String$fromInt(position.fa) + ('-' + ($elm$core$String$fromInt(position.k0) + ('-' + $elm$core$String$fromInt(position.il)))))));
				var modernGrid = _class + ('{' + (modernPosition + '}'));
				var supports = '@supports (display:grid) {' + (modernGrid + '}');
				var base = _class + ('{' + (msPosition + '}'));
				return _List_fromArray(
					[base, supports]);
			case 11:
				var _class = rule.a;
				var styles = rule.b;
				var renderPseudoRule = function (style) {
					return A3(
						$mdgriffith$elm_ui$Internal$Model$renderStyleRule,
						options,
						style,
						$elm$core$Maybe$Just(_class));
				};
				return A2($elm$core$List$concatMap, renderPseudoRule, styles);
			default:
				var transform = rule.a;
				var val = $mdgriffith$elm_ui$Internal$Model$transformValue(transform);
				var _class = $mdgriffith$elm_ui$Internal$Model$transformClass(transform);
				var _v12 = _Utils_Tuple2(_class, val);
				if ((!_v12.a.$) && (!_v12.b.$)) {
					var cls = _v12.a.a;
					var v = _v12.b.a;
					return A4(
						$mdgriffith$elm_ui$Internal$Model$renderStyle,
						options,
						maybePseudo,
						'.' + cls,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Model$Property, 'transform', v)
							]));
				} else {
					return _List_Nil;
				}
		}
	});
var $mdgriffith$elm_ui$Internal$Model$encodeStyles = F2(
	function (options, stylesheet) {
		return $elm$json$Json$Encode$object(
			A2(
				$elm$core$List$map,
				function (style) {
					var styled = A3($mdgriffith$elm_ui$Internal$Model$renderStyleRule, options, style, $elm$core$Maybe$Nothing);
					return _Utils_Tuple2(
						$mdgriffith$elm_ui$Internal$Model$getStyleName(style),
						A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, styled));
				},
				stylesheet));
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
				A2($mdgriffith$elm_ui$Internal$Model$bracket, '.' + (name + ('.' + (modifier + ('> .' + ($mdgriffith$elm_ui$Internal$Style$classes.c$ + (', .' + (name + (' .' + (modifier + (' > .' + $mdgriffith$elm_ui$Internal$Style$classes.c$)))))))))), textAdjustment)
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
				A3($mdgriffith$elm_ui$Internal$Model$fontRule, name, $mdgriffith$elm_ui$Internal$Style$classes.kd, capital),
				A3($mdgriffith$elm_ui$Internal$Model$fontRule, name, $mdgriffith$elm_ui$Internal$Style$classes.ia, full)));
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
					'.' + (name + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.kd + (', ' + ('.' + (name + (' .' + $mdgriffith$elm_ui$Internal$Style$classes.kd))))))),
					_List_fromArray(
						[
							_Utils_Tuple2('line-height', '1')
						])),
					A2(
					$mdgriffith$elm_ui$Internal$Model$bracket,
					'.' + (name + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.kd + ('> .' + ($mdgriffith$elm_ui$Internal$Style$classes.c$ + (', .' + (name + (' .' + ($mdgriffith$elm_ui$Internal$Style$classes.kd + (' > .' + $mdgriffith$elm_ui$Internal$Style$classes.c$)))))))))),
					_List_fromArray(
						[
							_Utils_Tuple2('vertical-align', '0'),
							_Utils_Tuple2('line-height', '1')
						]))
				]));
	});
var $mdgriffith$elm_ui$Internal$Model$adjust = F3(
	function (size, height, vertical) {
		return {il: height / size, eK: size, gC: vertical};
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
		[adjustment.he, adjustment.g1, adjustment.hP, adjustment.iT]);
	var lineHeight = 1.5;
	var normalDescender = (lineHeight - 1) / 2;
	var oldMiddle = lineHeight / 2;
	var descender = A2(
		$elm$core$Maybe$withDefault,
		adjustment.hP,
		$elm$core$List$minimum(lines));
	var newBaseline = A2(
		$elm$core$Maybe$withDefault,
		adjustment.g1,
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
		adjustment.he,
		$elm$core$List$maximum(lines));
	var capitalSize = 1 / (ascender - newBaseline);
	var capitalVertical = 1 - ascender;
	var fullSize = 1 / (ascender - descender);
	var fullVertical = 1 - ascender;
	var newCapitalMiddle = ((ascender - newBaseline) / 2) + newBaseline;
	var newFullMiddle = ((ascender - descender) / 2) + descender;
	return {
		he: A3($mdgriffith$elm_ui$Internal$Model$adjust, capitalSize, ascender - newBaseline, capitalVertical),
		fl: A3($mdgriffith$elm_ui$Internal$Model$adjust, fullSize, ascender - descender, fullVertical)
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
				$elm$core$String$fromFloat(converted.il)),
				_Utils_Tuple2(
				'vertical-align',
				$elm$core$String$fromFloat(converted.gC) + 'em'),
				_Utils_Tuple2(
				'font-size',
				$elm$core$String$fromFloat(converted.eK) + 'em')
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
						var _v2 = _with.gL;
						if (_v2.$ === 1) {
							return found;
						} else {
							var adjustment = _v2.a;
							return $elm$core$Maybe$Just(
								_Utils_Tuple2(
									$mdgriffith$elm_ui$Internal$Model$fontAdjustmentRules(
										function ($) {
											return $.fl;
										}(
											$mdgriffith$elm_ui$Internal$Model$convertAdjustment(adjustment))),
									$mdgriffith$elm_ui$Internal$Model$fontAdjustmentRules(
										function ($) {
											return $.he;
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
var $mdgriffith$elm_ui$Internal$Model$toStyleSheetString = F2(
	function (options, stylesheet) {
		var combine = F2(
			function (style, rendered) {
				return {
					dS: _Utils_ap(
						rendered.dS,
						A3($mdgriffith$elm_ui$Internal$Model$renderStyleRule, options, style, $elm$core$Maybe$Nothing)),
					c1: function () {
						var _v1 = $mdgriffith$elm_ui$Internal$Model$topLevelValue(style);
						if (_v1.$ === 1) {
							return rendered.c1;
						} else {
							var topLevel = _v1.a;
							return A2($elm$core$List$cons, topLevel, rendered.c1);
						}
					}()
				};
			});
		var _v0 = A3(
			$elm$core$List$foldl,
			combine,
			{dS: _List_Nil, c1: _List_Nil},
			stylesheet);
		var topLevel = _v0.c1;
		var rules = _v0.dS;
		return _Utils_ap(
			$mdgriffith$elm_ui$Internal$Model$renderTopLevelValues(topLevel),
			$elm$core$String$concat(rules));
	});
var $mdgriffith$elm_ui$Internal$Model$toStyleSheet = F2(
	function (options, styleSheet) {
		var _v0 = options.e;
		switch (_v0) {
			case 0:
				return A3(
					$elm$virtual_dom$VirtualDom$node,
					'div',
					_List_Nil,
					_List_fromArray(
						[
							A3(
							$elm$virtual_dom$VirtualDom$node,
							'style',
							_List_Nil,
							_List_fromArray(
								[
									$elm$virtual_dom$VirtualDom$text(
									A2($mdgriffith$elm_ui$Internal$Model$toStyleSheetString, options, styleSheet))
								]))
						]));
			case 1:
				return A3(
					$elm$virtual_dom$VirtualDom$node,
					'div',
					_List_Nil,
					_List_fromArray(
						[
							A3(
							$elm$virtual_dom$VirtualDom$node,
							'style',
							_List_Nil,
							_List_fromArray(
								[
									$elm$virtual_dom$VirtualDom$text(
									A2($mdgriffith$elm_ui$Internal$Model$toStyleSheetString, options, styleSheet))
								]))
						]));
			default:
				return A3(
					$elm$virtual_dom$VirtualDom$node,
					'elm-ui-rules',
					_List_fromArray(
						[
							A2(
							$elm$virtual_dom$VirtualDom$property,
							'rules',
							A2($mdgriffith$elm_ui$Internal$Model$encodeStyles, options, styleSheet))
						]),
					_List_Nil);
		}
	});
var $mdgriffith$elm_ui$Internal$Model$embedKeyed = F4(
	function (_static, opts, styles, children) {
		var dynamicStyleSheet = A2(
			$mdgriffith$elm_ui$Internal$Model$toStyleSheet,
			opts,
			A3(
				$elm$core$List$foldl,
				$mdgriffith$elm_ui$Internal$Model$reduceStyles,
				_Utils_Tuple2(
					$elm$core$Set$empty,
					$mdgriffith$elm_ui$Internal$Model$renderFocusStyle(opts.fi)),
				styles).b);
		return _static ? A2(
			$elm$core$List$cons,
			_Utils_Tuple2(
				'static-stylesheet',
				$mdgriffith$elm_ui$Internal$Model$staticRoot(opts)),
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2('dynamic-stylesheet', dynamicStyleSheet),
				children)) : A2(
			$elm$core$List$cons,
			_Utils_Tuple2('dynamic-stylesheet', dynamicStyleSheet),
			children);
	});
var $mdgriffith$elm_ui$Internal$Model$embedWith = F4(
	function (_static, opts, styles, children) {
		var dynamicStyleSheet = A2(
			$mdgriffith$elm_ui$Internal$Model$toStyleSheet,
			opts,
			A3(
				$elm$core$List$foldl,
				$mdgriffith$elm_ui$Internal$Model$reduceStyles,
				_Utils_Tuple2(
					$elm$core$Set$empty,
					$mdgriffith$elm_ui$Internal$Model$renderFocusStyle(opts.fi)),
				styles).b);
		return _static ? A2(
			$elm$core$List$cons,
			$mdgriffith$elm_ui$Internal$Model$staticRoot(opts),
			A2($elm$core$List$cons, dynamicStyleSheet, children)) : A2($elm$core$List$cons, dynamicStyleSheet, children);
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
										$elm$html$Html$Attributes$class($mdgriffith$elm_ui$Internal$Style$classes.gY + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.kb))
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
									[$mdgriffith$elm_ui$Internal$Style$classes.gY, $mdgriffith$elm_ui$Internal$Style$classes.kb, $mdgriffith$elm_ui$Internal$Style$classes.de, $mdgriffith$elm_ui$Internal$Style$classes.bi, $mdgriffith$elm_ui$Internal$Style$classes.gT])))
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
									[$mdgriffith$elm_ui$Internal$Style$classes.gY, $mdgriffith$elm_ui$Internal$Style$classes.kb, $mdgriffith$elm_ui$Internal$Style$classes.de, $mdgriffith$elm_ui$Internal$Style$classes.bi, $mdgriffith$elm_ui$Internal$Style$classes.gR])))
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
									[$mdgriffith$elm_ui$Internal$Style$classes.gY, $mdgriffith$elm_ui$Internal$Style$classes.kb, $mdgriffith$elm_ui$Internal$Style$classes.de, $mdgriffith$elm_ui$Internal$Style$classes.gS])))
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
									[$mdgriffith$elm_ui$Internal$Style$classes.gY, $mdgriffith$elm_ui$Internal$Style$classes.kb, $mdgriffith$elm_ui$Internal$Style$classes.de, $mdgriffith$elm_ui$Internal$Style$classes.gQ])))
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
var $mdgriffith$elm_ui$Internal$Model$textElementClasses = $mdgriffith$elm_ui$Internal$Style$classes.gY + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.c$ + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.eR + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.el)))));
var $mdgriffith$elm_ui$Internal$Model$textElement = function (str) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class($mdgriffith$elm_ui$Internal$Model$textElementClasses)
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(str)
			]));
};
var $mdgriffith$elm_ui$Internal$Model$textElementFillClasses = $mdgriffith$elm_ui$Internal$Style$classes.gY + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.c$ + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.eS + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.em)))));
var $mdgriffith$elm_ui$Internal$Model$textElementFill = function (str) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class($mdgriffith$elm_ui$Internal$Model$textElementFillClasses)
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(str)
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
									A2(styled.fw, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, context)),
								htmls),
							$elm$core$List$isEmpty(existingStyles) ? styled.go : _Utils_ap(styled.go, existingStyles)) : _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									A2(styled.fw, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, context)),
								htmls),
							$elm$core$List$isEmpty(existingStyles) ? styled.go : _Utils_ap(styled.go, existingStyles));
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
								A2(styled.fw, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, context),
								htmls),
							$elm$core$List$isEmpty(existingStyles) ? styled.go : _Utils_ap(styled.go, existingStyles)) : _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								A2(styled.fw, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, context),
								htmls),
							$elm$core$List$isEmpty(existingStyles) ? styled.go : _Utils_ap(styled.go, existingStyles));
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
			var newStyles = $elm$core$List$isEmpty(styles) ? rendered.go : _Utils_ap(rendered.go, styles);
			if (!newStyles.b) {
				return $mdgriffith$elm_ui$Internal$Model$Unstyled(
					A5(
						$mdgriffith$elm_ui$Internal$Model$finalizeNode,
						rendered.bM,
						rendered.fS,
						rendered.bD,
						$mdgriffith$elm_ui$Internal$Model$Keyed(
							A3($mdgriffith$elm_ui$Internal$Model$addKeyedChildren, 'nearby-element-pls', keyed, rendered.hm)),
						$mdgriffith$elm_ui$Internal$Model$NoStyleSheet));
			} else {
				var allStyles = newStyles;
				return $mdgriffith$elm_ui$Internal$Model$Styled(
					{
						fw: A4(
							$mdgriffith$elm_ui$Internal$Model$finalizeNode,
							rendered.bM,
							rendered.fS,
							rendered.bD,
							$mdgriffith$elm_ui$Internal$Model$Keyed(
								A3($mdgriffith$elm_ui$Internal$Model$addKeyedChildren, 'nearby-element-pls', keyed, rendered.hm))),
						go: allStyles
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
			var newStyles = $elm$core$List$isEmpty(styles) ? rendered.go : _Utils_ap(rendered.go, styles);
			if (!newStyles.b) {
				return $mdgriffith$elm_ui$Internal$Model$Unstyled(
					A5(
						$mdgriffith$elm_ui$Internal$Model$finalizeNode,
						rendered.bM,
						rendered.fS,
						rendered.bD,
						$mdgriffith$elm_ui$Internal$Model$Unkeyed(
							A2($mdgriffith$elm_ui$Internal$Model$addChildren, unkeyed, rendered.hm)),
						$mdgriffith$elm_ui$Internal$Model$NoStyleSheet));
			} else {
				var allStyles = newStyles;
				return $mdgriffith$elm_ui$Internal$Model$Styled(
					{
						fw: A4(
							$mdgriffith$elm_ui$Internal$Model$finalizeNode,
							rendered.bM,
							rendered.fS,
							rendered.bD,
							$mdgriffith$elm_ui$Internal$Model$Unkeyed(
								A2($mdgriffith$elm_ui$Internal$Model$addChildren, unkeyed, rendered.hm))),
						go: allStyles
					});
			}
		}
	});
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
										[$mdgriffith$elm_ui$Internal$Style$classes.cf, $mdgriffith$elm_ui$Internal$Style$classes.kb, $mdgriffith$elm_ui$Internal$Style$classes.gG]));
							case 1:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.cf, $mdgriffith$elm_ui$Internal$Style$classes.kb, $mdgriffith$elm_ui$Internal$Style$classes.g3]));
							case 2:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.cf, $mdgriffith$elm_ui$Internal$Style$classes.kb, $mdgriffith$elm_ui$Internal$Style$classes.jk]));
							case 3:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.cf, $mdgriffith$elm_ui$Internal$Style$classes.kb, $mdgriffith$elm_ui$Internal$Style$classes.jj]));
							case 4:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.cf, $mdgriffith$elm_ui$Internal$Style$classes.kb, $mdgriffith$elm_ui$Internal$Style$classes.iz]));
							default:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.cf, $mdgriffith$elm_ui$Internal$Style$classes.kb, $mdgriffith$elm_ui$Internal$Style$classes.g2]));
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
							return A2(styled.fw, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, $mdgriffith$elm_ui$Internal$Model$asEl);
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
var $mdgriffith$elm_ui$Internal$Model$Embedded = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$NodeName = function (a) {
	return {$: 1, a: a};
};
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
			return $mdgriffith$elm_ui$Internal$Style$classes.dZ + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.eZ);
		case 2:
			return $mdgriffith$elm_ui$Internal$Style$classes.dZ + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.e_);
		default:
			return $mdgriffith$elm_ui$Internal$Style$classes.dZ + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.gO);
	}
};
var $mdgriffith$elm_ui$Internal$Model$alignYName = function (align) {
	switch (align) {
		case 0:
			return $mdgriffith$elm_ui$Internal$Style$classes.d_ + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.gU);
		case 2:
			return $mdgriffith$elm_ui$Internal$Style$classes.d_ + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.gN);
		default:
			return $mdgriffith$elm_ui$Internal$Style$classes.d_ + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.gP);
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
				$mdgriffith$elm_ui$Internal$Style$classes.fr + (' ' + name),
				_List_fromArray(
					[
						A3($mdgriffith$elm_ui$Internal$Model$Single, name, 'height', val + 'px')
					]));
		case 1:
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightContent, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.el,
				_List_Nil);
		case 2:
			var portion = h.a;
			return (portion === 1) ? _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightFill, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.em,
				_List_Nil) : _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightFill, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.fs + (' height-fill-' + $elm$core$String$fromInt(portion)),
				_List_fromArray(
					[
						A3(
						$mdgriffith$elm_ui$Internal$Model$Single,
						$mdgriffith$elm_ui$Internal$Style$classes.gY + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.d3 + (' > ' + $mdgriffith$elm_ui$Internal$Style$dot(
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
				$mdgriffith$elm_ui$Internal$Style$classes.gE + (' width-px-' + $elm$core$String$fromInt(px)),
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
				$mdgriffith$elm_ui$Internal$Style$classes.eR,
				_List_Nil);
		case 2:
			var portion = w.a;
			return (portion === 1) ? _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthFill, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.eS,
				_List_Nil) : _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthFill, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.gF + (' width-fill-' + $elm$core$String$fromInt(portion)),
				_List_fromArray(
					[
						A3(
						$mdgriffith$elm_ui$Internal$Model$Single,
						$mdgriffith$elm_ui$Internal$Style$classes.gY + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.gd + (' > ' + $mdgriffith$elm_ui$Internal$Style$dot(
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
						bD: A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$class(classes),
							attrs),
						hm: children,
						bM: has,
						fS: node,
						go: styles
					};
				} else {
					var _class = _v1.a;
					return {
						bD: A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$class(classes + (' ' + _class)),
							attrs),
						hm: children,
						bM: has,
						fS: node,
						go: A2(
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
									var $temp$classes = ($mdgriffith$elm_ui$Internal$Style$classes.gE + (' width-px-' + $elm$core$String$fromInt(px))) + (' ' + classes),
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
									var $temp$classes = classes + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.eR),
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
										var $temp$classes = classes + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.eS),
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
										var $temp$classes = classes + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.gF + (' width-fill-' + $elm$core$String$fromInt(portion)))),
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
												$mdgriffith$elm_ui$Internal$Style$classes.gY + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.gd + (' > ' + $mdgriffith$elm_ui$Internal$Style$dot(
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
										$temp$has = A2(
										$mdgriffith$elm_ui$Internal$Flag$merge,
										addToFlags,
										A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$width, has)),
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
									var $temp$classes = $mdgriffith$elm_ui$Internal$Style$classes.fr + (' ' + (name + (' ' + classes))),
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
									var $temp$classes = $mdgriffith$elm_ui$Internal$Style$classes.el + (' ' + classes),
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
										var $temp$classes = $mdgriffith$elm_ui$Internal$Style$classes.em + (' ' + classes),
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
										var $temp$classes = classes + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.fs + (' height-fill-' + $elm$core$String$fromInt(portion)))),
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
												$mdgriffith$elm_ui$Internal$Style$classes.gY + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.d3 + (' > ' + $mdgriffith$elm_ui$Internal$Style$dot(
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
										$temp$has = A2(
										$mdgriffith$elm_ui$Internal$Flag$merge,
										addToFlags,
										A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$height, has)),
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
									return _Utils_ap(styles, styled.go);
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
				$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.hA + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.cD)),
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
						var name = font.a.y;
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
		var url = _v0.c6;
		var label = _v0.B;
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
								$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.dg + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.bi + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.cM)))),
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
						fw: F2(
							function (add, context) {
								return A2(
									$elm$virtual_dom$VirtualDom$map,
									fn,
									A2(styled.fw, add, context));
							}),
						go: styled.go
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
	var top = _v0.a_;
	var right = _v0.aX;
	var bottom = _v0.aK;
	var left = _v0.aO;
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
					$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.cD + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.bi + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.eT)))),
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
							{aK: b - ((y / 2) | 0), aO: l - ((x / 2) | 0), aX: r - ((x / 2) | 0), a_: t - ((y / 2) | 0)})) : $elm$core$Maybe$Nothing;
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
						$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.cD + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.bi + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.eT)))),
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
									$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.cD + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.bi + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.eT)))),
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
					B: A2(
						$mdgriffith$elm_ui$Element$el,
						_List_Nil,
						$mdgriffith$elm_ui$Element$text(
							$elm_community$string_extra$String$Extra$toSentenceCase(
								A2(
									$elm$core$Maybe$withDefault,
									n,
									$elm$url$Url$percentDecode(n))))),
					c6: strPath(p)
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
											A2($elm$core$String$dropLeft, 1, model.c6.z))))))))
				]));
	});
var $mdgriffith$elm_ui$Internal$Flag$overflow = $mdgriffith$elm_ui$Internal$Flag$flag(20);
var $mdgriffith$elm_ui$Element$clip = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$overflow, $mdgriffith$elm_ui$Internal$Style$classes.ho);
var $mdgriffith$elm_ui$Internal$Model$Top = 0;
var $mdgriffith$elm_ui$Element$alignTop = $mdgriffith$elm_ui$Internal$Model$AlignY(0);
var $mdgriffith$elm_ui$Internal$Flag$fontWeight = $mdgriffith$elm_ui$Internal$Flag$flag(13);
var $mdgriffith$elm_ui$Element$Font$bold = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$fontWeight, $mdgriffith$elm_ui$Internal$Style$classes.g6);
var $mdgriffith$elm_ui$Element$rgba255 = F4(
	function (red, green, blue, a) {
		return A4($mdgriffith$elm_ui$Internal$Model$Rgba, red / 255, green / 255, blue / 255, a);
	});
var $author$project$Murol$footerStyle = function (season) {
	switch (season) {
		case 0:
			return {
				ae: A4($mdgriffith$elm_ui$Element$rgba255, 76, 115, 56, 1),
				ay: A4($mdgriffith$elm_ui$Element$rgba255, 0, 0, 0, 1),
				b7: A4($mdgriffith$elm_ui$Element$rgba255, 41, 80, 0, 1),
				b8: A4($mdgriffith$elm_ui$Element$rgba, 255, 248, 255, 1),
				S: A4($mdgriffith$elm_ui$Element$rgba255, 226, 242, 211, 0.6)
			};
		case 1:
			return {
				ae: A4($mdgriffith$elm_ui$Element$rgba255, 186, 172, 145, 1),
				ay: A4($mdgriffith$elm_ui$Element$rgba255, 0, 0, 0, 1),
				b7: A4($mdgriffith$elm_ui$Element$rgba255, 38, 110, 182, 1),
				b8: A4($mdgriffith$elm_ui$Element$rgba, 255, 248, 255, 1),
				S: A4($mdgriffith$elm_ui$Element$rgba255, 226, 242, 211, 1)
			};
		case 2:
			return {
				ae: A4($mdgriffith$elm_ui$Element$rgba255, 255, 211, 37, 1),
				ay: A4($mdgriffith$elm_ui$Element$rgba255, 0, 0, 0, 1),
				b7: A4($mdgriffith$elm_ui$Element$rgba255, 69, 22, 6, 255),
				b8: A4($mdgriffith$elm_ui$Element$rgba255, 240, 248, 255, 1),
				S: A4($mdgriffith$elm_ui$Element$rgba255, 255, 237, 167, 1)
			};
		default:
			return {
				ae: A4($mdgriffith$elm_ui$Element$rgba255, 128, 128, 170, 1),
				ay: A4($mdgriffith$elm_ui$Element$rgba255, 0, 0, 0, 1),
				b7: A4($mdgriffith$elm_ui$Element$rgba255, 51, 51, 102, 1),
				b8: A4($mdgriffith$elm_ui$Element$rgba255, 240, 248, 255, 1),
				S: A4($mdgriffith$elm_ui$Element$rgba255, 227, 233, 255, 1)
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
				$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.cD + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.bi)),
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
var $mdgriffith$elm_ui$Element$spaceEvenly = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$spacing, $mdgriffith$elm_ui$Internal$Style$classes.kf);
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
var $mdgriffith$elm_ui$Element$Font$underline = $mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.gz);
var $author$project$Murol$footerView = function (model) {
	var _v0 = model.cg;
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
								$author$project$Murol$footerStyle(model.a.jW).S)
							])),
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
					]),
				{
					B: A2(
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
									$elm_community$string_extra$String$Extra$toSentenceCase(pageInfo.y)))
							])),
					c6: strPath(pageInfo.z)
				});
		};
		var maxWidth = A3(
			$author$project$Document$DocumentViews$StyleSheets$docMaxWidth,
			_Utils_Tuple2(model.a.k0, model.a.il),
			false,
			model.a.dL);
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
								{aK: 10, aO: 0, aX: 0, a_: 10}),
								$mdgriffith$elm_ui$Element$mouseOver(
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$Background$color(
										$author$project$Murol$footerStyle(model.a.jW).S)
									])),
								$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
							]),
						{
							B: A2(
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
											$elm_community$string_extra$String$Extra$toSentenceCase(pageInfo.y)))
									])),
							c6: strPath(pageInfo.z)
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
							$author$project$Murol$footerStyle(model.a.jW).b7),
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
									$author$project$Murol$footerStyle(model.a.jW).b8),
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
							$author$project$Murol$footerStyle(model.a.jW).ae),
							A2($mdgriffith$elm_ui$Element$paddingXY, 15, 0)
						]),
					A2($elm$core$List$map, mainCatView, xs_)),
					A2(
					$mdgriffith$elm_ui$Element$wrappedRow,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Background$color(
							$author$project$Murol$footerStyle(model.a.jW).b7),
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
								B: A2(
									$mdgriffith$elm_ui$Element$el,
									_List_fromArray(
										[
											$mdgriffith$elm_ui$Element$Font$color(
											$author$project$Murol$footerStyle(model.a.jW).b8),
											$mdgriffith$elm_ui$Element$Font$underline
										]),
									$mdgriffith$elm_ui$Element$text('Plan de site')),
								c6: '/accueil/plan de site'
							}),
							A2(
							$mdgriffith$elm_ui$Element$link,
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Element$paddingXY, 0, 5)
								]),
							{
								B: A2(
									$mdgriffith$elm_ui$Element$el,
									_List_fromArray(
										[
											$mdgriffith$elm_ui$Element$Font$color(
											A3($mdgriffith$elm_ui$Element$rgb, 1, 1, 1)),
											$mdgriffith$elm_ui$Element$Font$underline
										]),
									$mdgriffith$elm_ui$Element$text('Contacter le webmaster')),
								c6: '/accueil/contact'
							}),
							A2(
							$mdgriffith$elm_ui$Element$link,
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Element$paddingXY, 0, 5)
								]),
							{
								B: A2(
									$mdgriffith$elm_ui$Element$el,
									_List_fromArray(
										[
											$mdgriffith$elm_ui$Element$Font$color(
											A3($mdgriffith$elm_ui$Element$rgb, 1, 1, 1)),
											$mdgriffith$elm_ui$Element$Font$underline
										]),
									$mdgriffith$elm_ui$Element$text('Mentions légales')),
								c6: '/accueil/mentions légales'
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
var $mdgriffith$elm_ui$Internal$Model$Layout = 0;
var $mdgriffith$elm_ui$Internal$Model$focusDefaultStyle = {
	g$: $elm$core$Maybe$Nothing,
	g7: $elm$core$Maybe$Nothing,
	ka: $elm$core$Maybe$Just(
		{
			g5: 0,
			hr: A4($mdgriffith$elm_ui$Internal$Model$Rgba, 155 / 255, 203 / 255, 1, 1),
			jh: _Utils_Tuple2(0, 0),
			eK: 3
		})
};
var $mdgriffith$elm_ui$Internal$Model$optionsToRecord = function (options) {
	var combine = F2(
		function (opt, record) {
			switch (opt.$) {
				case 0:
					var hoverable = opt.a;
					var _v4 = record.S;
					if (_v4.$ === 1) {
						return _Utils_update(
							record,
							{
								S: $elm$core$Maybe$Just(hoverable)
							});
					} else {
						return record;
					}
				case 1:
					var focusStyle = opt.a;
					var _v5 = record.fi;
					if (_v5.$ === 1) {
						return _Utils_update(
							record,
							{
								fi: $elm$core$Maybe$Just(focusStyle)
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
			fi: function () {
				var _v0 = record.fi;
				if (_v0.$ === 1) {
					return $mdgriffith$elm_ui$Internal$Model$focusDefaultStyle;
				} else {
					var focusable = _v0.a;
					return focusable;
				}
			}(),
			S: function () {
				var _v1 = record.S;
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
					return 0;
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
			{fi: $elm$core$Maybe$Nothing, S: $elm$core$Maybe$Nothing, e: $elm$core$Maybe$Nothing},
			options));
};
var $mdgriffith$elm_ui$Internal$Model$toHtml = F2(
	function (mode, el) {
		switch (el.$) {
			case 0:
				var html = el.a;
				return html($mdgriffith$elm_ui$Internal$Model$asEl);
			case 1:
				var styles = el.a.go;
				var html = el.a.fw;
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
			if (_v0 === 1) {
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
				'bg-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(
					A4($mdgriffith$elm_ui$Internal$Model$Rgba, 1, 1, 1, 0)),
				'background-color',
				A4($mdgriffith$elm_ui$Internal$Model$Rgba, 1, 1, 1, 0))),
			A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$fontColor,
			A3(
				$mdgriffith$elm_ui$Internal$Model$Colored,
				'fc-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(
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
		var options = _v0.f_;
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
							[$mdgriffith$elm_ui$Internal$Style$classes.M, $mdgriffith$elm_ui$Internal$Style$classes.gY, $mdgriffith$elm_ui$Internal$Style$classes.kb]))),
				_Utils_ap($mdgriffith$elm_ui$Internal$Model$rootStyle, attrs)),
			child);
	});
var $mdgriffith$elm_ui$Element$layout = $mdgriffith$elm_ui$Element$layoutWith(
	{f_: _List_Nil});
var $mdgriffith$elm_ui$Internal$Model$CenterY = 1;
var $mdgriffith$elm_ui$Element$centerY = $mdgriffith$elm_ui$Internal$Model$AlignY(1);
var $mdgriffith$elm_ui$Element$clipX = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$overflow, $mdgriffith$elm_ui$Internal$Style$classes.hp);
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $mdgriffith$elm_ui$Internal$Flag$fontAlignment = $mdgriffith$elm_ui$Internal$Flag$flag(12);
var $mdgriffith$elm_ui$Element$Font$center = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$fontAlignment, $mdgriffith$elm_ui$Internal$Style$classes.kA);
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
var $mdgriffith$elm_ui$Internal$Model$boxShadowClass = function (shadow) {
	return $elm$core$String$concat(
		_List_fromArray(
			[
				shadow.fz ? 'box-inset' : 'box-',
				$mdgriffith$elm_ui$Internal$Model$floatClass(shadow.jh.a) + 'px',
				$mdgriffith$elm_ui$Internal$Model$floatClass(shadow.jh.b) + 'px',
				$mdgriffith$elm_ui$Internal$Model$floatClass(shadow.g5) + 'px',
				$mdgriffith$elm_ui$Internal$Model$floatClass(shadow.eK) + 'px',
				$mdgriffith$elm_ui$Internal$Model$formatColorClass(shadow.hr)
			]));
};
var $mdgriffith$elm_ui$Internal$Flag$shadows = $mdgriffith$elm_ui$Internal$Flag$flag(19);
var $mdgriffith$elm_ui$Element$Border$shadow = function (almostShade) {
	var shade = {g5: almostShade.g5, hr: almostShade.hr, fz: false, jh: almostShade.jh, eK: almostShade.eK};
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$shadows,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Single,
			$mdgriffith$elm_ui$Internal$Model$boxShadowClass(shade),
			'box-shadow',
			$mdgriffith$elm_ui$Internal$Model$formatBoxShadow(shade)));
};
var $author$project$Document$DocumentViews$StyleSheets$defaultStyleSheet = function (config) {
	return {
		g4: _List_Nil,
		hs: _List_fromArray(
			[
				$mdgriffith$elm_ui$Element$spacing(15),
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
			]),
		hJ: {
			a$: $elm$core$Dict$fromList(
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
									g5: 10,
									hr: A4($mdgriffith$elm_ui$Element$rgba, 0, 0, 0, 0.45),
									jh: _Utils_Tuple2(4, 4),
									eK: 5
								})
							]))
					])),
			ip: $elm$core$Dict$fromList(
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
										_Utils_Tuple2(config.k0, config.il),
										config.Z,
										config.dL),
									$mdgriffith$elm_ui$Element$fill)),
								$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
								$mdgriffith$elm_ui$Element$centerX
							]))
					]))
		},
		ij: A3(
			$author$project$Document$DocumentViews$StyleSheets$headingStyles,
			config.jW,
			_Utils_Tuple2(config.k0, config.il),
			config.Z),
		it: _List_Nil,
		fI: _List_fromArray(
			[
				$mdgriffith$elm_ui$Element$Font$color(
				A3($mdgriffith$elm_ui$Element$rgb, 0, 0.5, 0.5))
			]),
		ju: _List_fromArray(
			[
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
			]),
		jx: function () {
			var _v0 = config.jW;
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
		jK: _List_Nil,
		jP: _List_fromArray(
			[
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
				$mdgriffith$elm_ui$Element$spacing(15)
			]),
		kB: _List_fromArray(
			[
				$mdgriffith$elm_ui$Element$spacing(15),
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
			]),
		kM: _List_Nil
	};
};
var $author$project$Document$DocumentViews$StyleSheets$docAttrToCss = function (attr) {
	switch (attr.$) {
		case 0:
			var padding = attr.a;
			return _List_Nil;
		case 1:
			var x = attr.a;
			var y = attr.b;
			return _List_Nil;
		case 2:
			return _List_fromArray(
				[
					_Utils_Tuple2('float', 'right')
				]);
		case 3:
			return _List_fromArray(
				[
					_Utils_Tuple2('float', 'left')
				]);
		case 4:
			return _List_Nil;
		case 5:
			var _v1 = attr.a;
			var r = _v1.a;
			var g = _v1.b;
			var b = _v1.c;
			var _v2 = _Utils_Tuple3(
				$elm$core$String$fromInt(
					$elm$core$Basics$round(r * 255)),
				$elm$core$String$fromInt(
					$elm$core$Basics$round(g * 255)),
				$elm$core$String$fromInt(
					$elm$core$Basics$round(b * 255)));
			var r_ = _v2.a;
			var g_ = _v2.b;
			var b_ = _v2.c;
			return _List_fromArray(
				[
					_Utils_Tuple2('background-color', 'rgb(' + (r_ + (',' + (g_ + (',' + (b_ + ')'))))))
				]);
		case 6:
			return _List_fromArray(
				[
					_Utils_Tuple2('width', '100%')
				]);
		case 7:
			return _List_Nil;
		case 8:
			var n = attr.a;
			return _List_fromArray(
				[
					_Utils_Tuple2(
					'width',
					$elm$core$String$fromInt(n) + 'px')
				]);
		case 9:
			var n = attr.a;
			return _List_fromArray(
				[
					_Utils_Tuple2(
					'height',
					$elm$core$String$fromInt(n) + 'px')
				]);
		case 10:
			var n = attr.a;
			return _List_Nil;
		case 11:
			return _List_fromArray(
				[
					_Utils_Tuple2('border-style', 'solid'),
					_Utils_Tuple2('border-width', '1px'),
					_Utils_Tuple2('border-color', 'rgb(127,127,127)')
				]);
		case 12:
			var font = attr.a;
			return _List_fromArray(
				[
					_Utils_Tuple2('font-family', font)
				]);
		case 13:
			var _v3 = attr.a;
			var r = _v3.a;
			var g = _v3.b;
			var b = _v3.c;
			var _v4 = _Utils_Tuple3(
				$elm$core$String$fromInt(
					$elm$core$Basics$round(r * 255)),
				$elm$core$String$fromInt(
					$elm$core$Basics$round(g * 255)),
				$elm$core$String$fromInt(
					$elm$core$Basics$round(b * 255)));
			var r_ = _v4.a;
			var g_ = _v4.b;
			var b_ = _v4.c;
			return _List_fromArray(
				[
					_Utils_Tuple2('color', 'rgb(' + (r_ + (',' + (g_ + (',' + (b_ + ')'))))))
				]);
		case 14:
			var n = attr.a;
			return _List_fromArray(
				[
					_Utils_Tuple2(
					'font-size',
					$elm$core$String$fromInt(n) + 'px')
				]);
		case 15:
			return _List_fromArray(
				[
					_Utils_Tuple2('text-align', 'left')
				]);
		case 16:
			return _List_fromArray(
				[
					_Utils_Tuple2('text-align', 'right')
				]);
		case 17:
			return _List_fromArray(
				[
					_Utils_Tuple2('text-align', 'center')
				]);
		case 18:
			return _List_fromArray(
				[
					_Utils_Tuple2('text-align', 'justify')
				]);
		case 19:
			return _List_fromArray(
				[
					_Utils_Tuple2('font-weight', 'bold')
				]);
		case 20:
			return _List_fromArray(
				[
					_Utils_Tuple2('font-style', 'italic')
				]);
		case 21:
			var attrs = attr.a;
			return _List_fromArray(
				[attrs]);
		default:
			var n = attr.a;
			var handler = attr.b;
			return _List_Nil;
	}
};
var $author$project$Document$DocumentViews$StyleSheets$defaultStyleSheetCss = function (config) {
	var tags = $elm$core$Dict$fromList(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'p',
				_List_fromArray(
					[
						_Utils_Tuple2('width', '100%')
					])),
				_Utils_Tuple2(
				'a',
				_List_fromArray(
					[
						_Utils_Tuple2('color', 'rgb(0,127,127)'),
						_Utils_Tuple2('text-decoration', 'none')
					]))
			]));
	var headings = function () {
		var seasonAttr = function () {
			var _v1 = config.jW;
			switch (_v1) {
				case 0:
					return $elm$core$Dict$fromList(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'h1',
								_List_fromArray(
									[
										_Utils_Tuple2('background-color', 'rgb(102 153 140)'),
										_Utils_Tuple2('color', 'rgb(240 248 255)')
									])),
								_Utils_Tuple2(
								'h2',
								_List_fromArray(
									[
										_Utils_Tuple2('background-color', 'rgb(102 153 140)'),
										_Utils_Tuple2('color', 'rgb(240 248 255)')
									])),
								_Utils_Tuple2('h3', _List_Nil)
							]));
				case 1:
					return $elm$core$Dict$fromList(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'h1',
								_List_fromArray(
									[
										_Utils_Tuple2('background-color', 'rgb(186 172 145)'),
										_Utils_Tuple2('color', 'rgb(0 0 0)')
									])),
								_Utils_Tuple2(
								'h2',
								_List_fromArray(
									[
										_Utils_Tuple2('background-color', 'rgb(255 193 58)'),
										_Utils_Tuple2('color', 'rgb(0 0 0)')
									])),
								_Utils_Tuple2('h3', _List_Nil)
							]));
				case 2:
					return $elm$core$Dict$fromList(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'h1',
								_List_fromArray(
									[
										_Utils_Tuple2('background-color', 'rgb(205 133 63)'),
										_Utils_Tuple2('color', 'rgb(67 46 42)')
									])),
								_Utils_Tuple2(
								'h2',
								_List_fromArray(
									[
										_Utils_Tuple2('background-color', 'rgb(205 133 63)'),
										_Utils_Tuple2('color', 'rgb(67 46 42)')
									])),
								_Utils_Tuple2('h3', _List_Nil)
							]));
				default:
					return $elm$core$Dict$fromList(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'h1',
								_List_fromArray(
									[
										_Utils_Tuple2('background-color', 'rgb(51 51 102)'),
										_Utils_Tuple2('color', 'rgb(240 248 255)')
									])),
								_Utils_Tuple2(
								'h2',
								_List_fromArray(
									[
										_Utils_Tuple2('background-color', 'rgb(51 51 102)'),
										_Utils_Tuple2('color', 'rgb(240 248 255)')
									])),
								_Utils_Tuple2('h3', _List_Nil)
							]));
			}
		}();
		var commonAttr = $elm$core$Dict$fromList(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'h1',
					_List_fromArray(
						[
							_Utils_Tuple2('font-size', '18px'),
							_Utils_Tuple2('text-align', 'center'),
							_Utils_Tuple2('font-weight', 'bold'),
							_Utils_Tuple2('padding', '10px 0px'),
							_Utils_Tuple2('margin-bottom', '15px'),
							_Utils_Tuple2('width', '100%')
						])),
					_Utils_Tuple2(
					'h2',
					_List_fromArray(
						[
							_Utils_Tuple2('font-size', '16px'),
							_Utils_Tuple2('text-align', 'center'),
							_Utils_Tuple2('font-weight', 'bold'),
							_Utils_Tuple2('padding', '2px 0px'),
							_Utils_Tuple2('width', '100%'),
							_Utils_Tuple2('margin-bottom', '15px'),
							_Utils_Tuple2('margin-top', '15px')
						])),
					_Utils_Tuple2(
					'h3',
					_List_fromArray(
						[
							_Utils_Tuple2('font-size', '16px'),
							_Utils_Tuple2('color', 'rgb(0 127 0)'),
							_Utils_Tuple2('font-weight', 'bold'),
							_Utils_Tuple2('margin-bottom', '15px'),
							_Utils_Tuple2('margin-top', '15px')
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
	}();
	return A3(
		$elm$core$List$foldr,
		$elm$core$Dict$union,
		$elm$core$Dict$empty,
		_List_fromArray(
			[headings, tags]));
};
var $mdgriffith$elm_ui$Internal$Model$unstyled = A2($elm$core$Basics$composeL, $mdgriffith$elm_ui$Internal$Model$Unstyled, $elm$core$Basics$always);
var $mdgriffith$elm_ui$Element$html = $mdgriffith$elm_ui$Internal$Model$unstyled;
var $elm$html$Html$node = $elm$virtual_dom$VirtualDom$node;
var $author$project$Document$DocumentViews$StyleSheets$stringifyAttributes = function (attributes) {
	return A2(
		$elm$core$String$join,
		' ',
		A2(
			$elm$core$List$map,
			function (_v0) {
				var attr = _v0.a;
				var value = _v0.b;
				return attr + (': ' + (value + ';'));
			},
			attributes));
};
var $author$project$Document$DocumentViews$StyleSheets$embeddedStyleSheet = F2(
	function (renderConfig, wholeTextBlocAttr) {
		var templateStylesheet = function () {
			var className = renderConfig.Z ? '.trix-content-editor ' : '.trix-content ';
			var tagStyle = function (_v1) {
				var tag = _v1.a;
				var styles = _v1.b;
				return function (s) {
					return className + (tag + ('{' + (s + '}')));
				}(
					A2(
						$elm$core$String$join,
						' ',
						A2(
							$elm$core$List$map,
							function (_v0) {
								var a = _v0.a;
								var v = _v0.b;
								return a + (':' + (v + ';'));
							},
							styles)));
			};
			return A2(
				$elm$core$String$join,
				' ',
				A2(
					$elm$core$List$map,
					tagStyle,
					$elm$core$Dict$toList(
						$author$project$Document$DocumentViews$StyleSheets$defaultStyleSheetCss(renderConfig))));
		}();
		var styleSheet = A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A3(
					$elm$html$Html$node,
					'style',
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(
							templateStylesheet + (' .trix-content-editor{' + ($author$project$Document$DocumentViews$StyleSheets$stringifyAttributes(
								A2($elm$core$List$concatMap, $author$project$Document$DocumentViews$StyleSheets$docAttrToCss, wholeTextBlocAttr)) + ('\n                                }\n                            ' + ' \n\n                            .trix-content-editor p {\n                                display: block;\n                                margin: 0;\n                                padding : 0;\n                                line-height: 150%;\n                            }\n                            .trix-content p {\n                                display: block;\n                                margin: 0;\n                                padding : 0;\n                                line-height: 150%;\n                            }\n                            \n                    '))))
						]))
				]));
		return A2(
			$mdgriffith$elm_ui$Element$el,
			_List_Nil,
			$mdgriffith$elm_ui$Element$html(styleSheet));
	});
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
		var customStyles = _v0.hJ;
		var uid = _v1.bY;
		var docStyleId = _v1.a4;
		var htmlId = _v1.a7;
		var classes = _v1.a$;
		return _Utils_ap(
			A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				A2(
					$elm$core$Maybe$andThen,
					function (id) {
						return A2($elm$core$Dict$get, id, customStyles.ip);
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
							return A2($elm$core$Dict$get, c, customStyles.a$);
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
var $hecrj$html_parser$Html$Parser$Comment = function (a) {
	return {$: 2, a: a};
};
var $hecrj$html_parser$Html$Parser$Element = F3(
	function (a, b, c) {
		return {$: 1, a: a, b: b, c: c};
	});
var $hecrj$html_parser$Html$Parser$Text = function (a) {
	return {$: 0, a: a};
};
var $author$project$Document$DocumentViews$DocumentView$processLinks = F2(
	function (config, node) {
		var processLinkAttrs = F2(
			function (processed, toProcess) {
				processLinkAttrs:
				while (true) {
					if (toProcess.b) {
						if (toProcess.a.a === 'href') {
							var _v1 = toProcess.a;
							var url = _v1.b;
							var xs = toProcess.b;
							return config.Z ? _Utils_ap(
								$elm$core$List$reverse(processed),
								xs) : (A2($elm$core$String$startsWith, 'lien-interne:', url) ? A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									'href',
									A2(
										$elm$core$Maybe$withDefault,
										url,
										function (cId) {
											return A2($elm$core$Dict$get, cId, config.cV);
										}(
											A2(
												$elm$core$String$dropLeft,
												$elm$core$String$length('lien-interne:'),
												url)))),
								_Utils_ap(
									$elm$core$List$reverse(processed),
									xs)) : (A2($elm$core$String$startsWith, 'doc:', url) ? A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									'href',
									A2(
										$elm$core$String$dropLeft,
										$elm$core$String$length('doc:'),
										url)),
								A2(
									$elm$core$List$cons,
									_Utils_Tuple2('target', '_blank'),
									_Utils_ap(
										$elm$core$List$reverse(processed),
										xs))) : (A2($elm$core$Dict$member, url, config.cV) ? A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									'href',
									A2(
										$elm$core$Maybe$withDefault,
										'',
										A2($elm$core$Dict$get, url, config.cV))),
								_Utils_ap(
									$elm$core$List$reverse(processed),
									xs)) : A2(
								$elm$core$List$cons,
								_Utils_Tuple2('href', url),
								A2(
									$elm$core$List$cons,
									_Utils_Tuple2('target', '_blank'),
									_Utils_ap(
										$elm$core$List$reverse(processed),
										xs))))));
						} else {
							var other = toProcess.a;
							var xs = toProcess.b;
							var $temp$processed = A2($elm$core$List$cons, other, processed),
								$temp$toProcess = xs;
							processed = $temp$processed;
							toProcess = $temp$toProcess;
							continue processLinkAttrs;
						}
					} else {
						return processed;
					}
				}
			});
		switch (node.$) {
			case 1:
				if (node.a === 'a') {
					var attrs = node.b;
					var nodes = node.c;
					return A3(
						$hecrj$html_parser$Html$Parser$Element,
						'a',
						A2(processLinkAttrs, _List_Nil, attrs),
						A2(
							$elm$core$List$map,
							$author$project$Document$DocumentViews$DocumentView$processLinks(config),
							nodes));
				} else {
					var tag = node.a;
					var attrs = node.b;
					var nodes = node.c;
					return A3(
						$hecrj$html_parser$Html$Parser$Element,
						tag,
						attrs,
						A2(
							$elm$core$List$map,
							$author$project$Document$DocumentViews$DocumentView$processLinks(config),
							nodes));
				}
			case 0:
				var value = node.a;
				return $hecrj$html_parser$Html$Parser$Text(value);
			default:
				var value = node.a;
				return $hecrj$html_parser$Html$Parser$Comment(value);
		}
	});
var $mdgriffith$elm_ui$Internal$Model$Left = 0;
var $mdgriffith$elm_ui$Element$alignLeft = $mdgriffith$elm_ui$Internal$Model$AlignX(0);
var $mdgriffith$elm_ui$Element$Font$alignLeft = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$fontAlignment, $mdgriffith$elm_ui$Internal$Style$classes.kG);
var $mdgriffith$elm_ui$Internal$Model$Right = 2;
var $mdgriffith$elm_ui$Element$alignRight = $mdgriffith$elm_ui$Internal$Model$AlignX(2);
var $mdgriffith$elm_ui$Element$Font$alignRight = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$fontAlignment, $mdgriffith$elm_ui$Internal$Style$classes.kK);
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
	if (config.Z) {
		var _v0 = config.dL;
		switch (_v0) {
			case 0:
				return {b1: 3, dG: 1};
			case 1:
				return {b1: 2, dG: 1};
			case 2:
				return {b1: 1, dG: 0};
			default:
				return {b1: 0, dG: 0};
		}
	} else {
		return $mdgriffith$elm_ui$Element$classifyDevice(
			{il: config.il, k0: config.k0});
	}
};
var $mdgriffith$elm_ui$Element$Font$italic = $mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.iI);
var $mdgriffith$elm_ui$Element$Font$justify = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$fontAlignment, $mdgriffith$elm_ui$Internal$Style$classes.kF);
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
var $mdgriffith$elm_ui$Element$pointer = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$cursor, $mdgriffith$elm_ui$Internal$Style$classes.hG);
var $mdgriffith$elm_ui$Internal$Model$Px = function (a) {
	return {$: 0, a: a};
};
var $mdgriffith$elm_ui$Element$px = $mdgriffith$elm_ui$Internal$Model$Px;
var $mdgriffith$elm_ui$Internal$Flag$borderStyle = $mdgriffith$elm_ui$Internal$Flag$flag(11);
var $mdgriffith$elm_ui$Element$Border$solid = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$borderStyle, $mdgriffith$elm_ui$Internal$Style$classes.ha);
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
					return ((!device.b1) || (device.b1 === 1)) ? _List_fromArray(
						[$mdgriffith$elm_ui$Element$centerX]) : _Utils_ap(
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$alignRight,
								$mdgriffith$elm_ui$Element$paddingEach(
								{aK: 0, aO: 15, aX: 0, a_: 0})
							]),
						config.Z ? _List_fromArray(
							[
								$mdgriffith$elm_ui$Element$htmlAttribute(
								A2($elm$html$Html$Attributes$style, 'z-index', '1'))
							]) : _List_Nil);
				case 3:
					return ((!device.b1) || (device.b1 === 1)) ? _List_fromArray(
						[$mdgriffith$elm_ui$Element$centerX]) : _Utils_ap(
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$alignLeft,
								$mdgriffith$elm_ui$Element$paddingEach(
								{aK: 0, aO: 0, aX: 15, a_: 0})
							]),
						config.Z ? _List_fromArray(
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
					var _v1 = device.b1;
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
				case 21:
					return _List_Nil;
				default:
					var uid = attr.a;
					var zipperEventHandler = attr.b;
					var _v2 = config.k3;
					if (_v2.$ === 1) {
						return _List_Nil;
					} else {
						var handlers = _v2.a;
						switch (zipperEventHandler) {
							case 0:
								return _List_fromArray(
									[
										$mdgriffith$elm_ui$Element$Events$onClick(
										handlers.hv(uid))
									]);
							case 1:
								return _List_fromArray(
									[
										$mdgriffith$elm_ui$Element$Events$onDoubleClick(
										handlers.hw(uid))
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
										$mdgriffith$elm_ui$Element$Events$onDoubleClick(handlers.hi)
									]);
							default:
								return _List_fromArray(
									[
										$mdgriffith$elm_ui$Element$Events$onClick(
										handlers.i6(uid)),
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
		var url = _v0.c6;
		var label = _v0.B;
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
									$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.dg + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.bi + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.cM)))),
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
					styleSheet.kM,
					_Utils_ap(
						A2($author$project$Document$DocumentViews$DocumentView$renderAttrs, config, tbAttrs),
						A2($author$project$Document$DocumentViews$DocumentView$renderAttrs, config, attrs))),
				$mdgriffith$elm_ui$Element$text(s));
		} else {
			var attrs = p.a;
			var targetBlank = p.b.gs;
			var url = p.b.c6;
			var label = p.b.B;
			var url_ = targetBlank ? url : A2(
				$elm$core$Maybe$withDefault,
				'',
				A2($elm$core$Dict$get, url, config.cV));
			var linkFun = targetBlank ? $mdgriffith$elm_ui$Element$newTabLink : $mdgriffith$elm_ui$Element$link;
			return config.Z ? A2(
				$mdgriffith$elm_ui$Element$el,
				_Utils_ap(
					styleSheet.fI,
					_Utils_ap(
						A2($author$project$Document$DocumentViews$DocumentView$renderAttrs, config, tbAttrs),
						A2($author$project$Document$DocumentViews$DocumentView$renderAttrs, config, attrs))),
				$mdgriffith$elm_ui$Element$text(label)) : A2(
				linkFun,
				_Utils_ap(
					styleSheet.fI,
					_Utils_ap(
						A2($author$project$Document$DocumentViews$DocumentView$renderAttrs, config, tbAttrs),
						A2($author$project$Document$DocumentViews$DocumentView$renderAttrs, config, attrs))),
				{
					B: $mdgriffith$elm_ui$Element$text(label),
					c6: url_
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
						{aK: 0, aO: 20, aX: 0, a_: 0})
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
var $elm$parser$Parser$Advanced$Bad = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$Good = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$parser$Parser$Advanced$Parser = $elm$core$Basics$identity;
var $elm$parser$Parser$Advanced$andThen = F2(
	function (callback, _v0) {
		var parseA = _v0;
		return function (s0) {
			var _v1 = parseA(s0);
			if (_v1.$ === 1) {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p1 = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				var _v2 = callback(a);
				var parseB = _v2;
				var _v3 = parseB(s1);
				if (_v3.$ === 1) {
					var p2 = _v3.a;
					var x = _v3.b;
					return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
				} else {
					var p2 = _v3.a;
					var b = _v3.b;
					var s2 = _v3.c;
					return A3($elm$parser$Parser$Advanced$Good, p1 || p2, b, s2);
				}
			}
		};
	});
var $elm$parser$Parser$andThen = $elm$parser$Parser$Advanced$andThen;
var $elm$parser$Parser$Advanced$backtrackable = function (_v0) {
	var parse = _v0;
	return function (s0) {
		var _v1 = parse(s0);
		if (_v1.$ === 1) {
			var x = _v1.b;
			return A2($elm$parser$Parser$Advanced$Bad, false, x);
		} else {
			var a = _v1.b;
			var s1 = _v1.c;
			return A3($elm$parser$Parser$Advanced$Good, false, a, s1);
		}
	};
};
var $elm$parser$Parser$backtrackable = $elm$parser$Parser$Advanced$backtrackable;
var $elm$parser$Parser$UnexpectedChar = {$: 11};
var $elm$parser$Parser$Advanced$AddRight = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$DeadEnd = F4(
	function (row, col, problem, contextStack) {
		return {fa: col, hB: contextStack, f4: problem, gd: row};
	});
var $elm$parser$Parser$Advanced$Empty = {$: 0};
var $elm$parser$Parser$Advanced$fromState = F2(
	function (s, x) {
		return A2(
			$elm$parser$Parser$Advanced$AddRight,
			$elm$parser$Parser$Advanced$Empty,
			A4($elm$parser$Parser$Advanced$DeadEnd, s.gd, s.fa, x, s.c));
	});
var $elm$parser$Parser$Advanced$isSubChar = _Parser_isSubChar;
var $elm$parser$Parser$Advanced$chompIf = F2(
	function (isGood, expecting) {
		return function (s) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, s.jh, s.eL);
			return _Utils_eq(newOffset, -1) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : (_Utils_eq(newOffset, -2) ? A3(
				$elm$parser$Parser$Advanced$Good,
				true,
				0,
				{fa: 1, c: s.c, eo: s.eo, jh: s.jh + 1, gd: s.gd + 1, eL: s.eL}) : A3(
				$elm$parser$Parser$Advanced$Good,
				true,
				0,
				{fa: s.fa + 1, c: s.c, eo: s.eo, jh: newOffset, gd: s.gd, eL: s.eL}));
		};
	});
var $elm$parser$Parser$chompIf = function (isGood) {
	return A2($elm$parser$Parser$Advanced$chompIf, isGood, $elm$parser$Parser$UnexpectedChar);
};
var $elm$parser$Parser$Advanced$chompWhileHelp = F5(
	function (isGood, offset, row, col, s0) {
		chompWhileHelp:
		while (true) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, offset, s0.eL);
			if (_Utils_eq(newOffset, -1)) {
				return A3(
					$elm$parser$Parser$Advanced$Good,
					_Utils_cmp(s0.jh, offset) < 0,
					0,
					{fa: col, c: s0.c, eo: s0.eo, jh: offset, gd: row, eL: s0.eL});
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
var $elm$parser$Parser$Advanced$chompWhile = function (isGood) {
	return function (s) {
		return A5($elm$parser$Parser$Advanced$chompWhileHelp, isGood, s.jh, s.gd, s.fa, s);
	};
};
var $elm$parser$Parser$chompWhile = $elm$parser$Parser$Advanced$chompWhile;
var $elm$parser$Parser$Advanced$map2 = F3(
	function (func, _v0, _v1) {
		var parseA = _v0;
		var parseB = _v1;
		return function (s0) {
			var _v2 = parseA(s0);
			if (_v2.$ === 1) {
				var p = _v2.a;
				var x = _v2.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p1 = _v2.a;
				var a = _v2.b;
				var s1 = _v2.c;
				var _v3 = parseB(s1);
				if (_v3.$ === 1) {
					var p2 = _v3.a;
					var x = _v3.b;
					return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
				} else {
					var p2 = _v3.a;
					var b = _v3.b;
					var s2 = _v3.c;
					return A3(
						$elm$parser$Parser$Advanced$Good,
						p1 || p2,
						A2(func, a, b),
						s2);
				}
			}
		};
	});
var $elm$parser$Parser$Advanced$ignorer = F2(
	function (keepParser, ignoreParser) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$always, keepParser, ignoreParser);
	});
var $elm$parser$Parser$ignorer = $elm$parser$Parser$Advanced$ignorer;
var $hecrj$html_parser$Html$Parser$chompOneOrMore = function (fn) {
	return A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$chompIf(fn),
		$elm$parser$Parser$chompWhile(fn));
};
var $elm$parser$Parser$Advanced$mapChompedString = F2(
	function (func, _v0) {
		var parse = _v0;
		return function (s0) {
			var _v1 = parse(s0);
			if (_v1.$ === 1) {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				return A3(
					$elm$parser$Parser$Advanced$Good,
					p,
					A2(
						func,
						A3($elm$core$String$slice, s0.jh, s1.jh, s0.eL),
						a),
					s1);
			}
		};
	});
var $elm$parser$Parser$Advanced$getChompedString = function (parser) {
	return A2($elm$parser$Parser$Advanced$mapChompedString, $elm$core$Basics$always, parser);
};
var $elm$parser$Parser$getChompedString = $elm$parser$Parser$Advanced$getChompedString;
var $hecrj$html_parser$Html$Parser$isSpaceCharacter = function (c) {
	return (c === ' ') || ((c === '\t') || ((c === '\n') || ((c === '\u000D') || ((c === '\u000C') || (c === '\u00A0')))));
};
var $elm$parser$Parser$Problem = function (a) {
	return {$: 12, a: a};
};
var $elm$parser$Parser$Advanced$problem = function (x) {
	return function (s) {
		return A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, x));
	};
};
var $elm$parser$Parser$problem = function (msg) {
	return $elm$parser$Parser$Advanced$problem(
		$elm$parser$Parser$Problem(msg));
};
var $elm$parser$Parser$Advanced$succeed = function (a) {
	return function (s) {
		return A3($elm$parser$Parser$Advanced$Good, false, a, s);
	};
};
var $elm$parser$Parser$succeed = $elm$parser$Parser$Advanced$succeed;
var $hecrj$html_parser$Html$Parser$closingTag = function (name) {
	var chompName = A2(
		$elm$parser$Parser$andThen,
		function (closingName) {
			return _Utils_eq(
				$elm$core$String$toLower(closingName),
				name) ? $elm$parser$Parser$succeed(0) : $elm$parser$Parser$problem('closing tag does not match opening tag: ' + name);
		},
		$elm$parser$Parser$getChompedString(
			$hecrj$html_parser$Html$Parser$chompOneOrMore(
				function (c) {
					return (!$hecrj$html_parser$Html$Parser$isSpaceCharacter(c)) && (c !== '>');
				})));
	return A2(
		$elm$parser$Parser$ignorer,
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$chompIf(
						$elm$core$Basics$eq('<')),
					$elm$parser$Parser$chompIf(
						$elm$core$Basics$eq('/'))),
				chompName),
			$elm$parser$Parser$chompWhile($hecrj$html_parser$Html$Parser$isSpaceCharacter)),
		$elm$parser$Parser$chompIf(
			$elm$core$Basics$eq('>')));
};
var $elm$parser$Parser$Advanced$findSubString = _Parser_findSubString;
var $elm$parser$Parser$Advanced$fromInfo = F4(
	function (row, col, x, context) {
		return A2(
			$elm$parser$Parser$Advanced$AddRight,
			$elm$parser$Parser$Advanced$Empty,
			A4($elm$parser$Parser$Advanced$DeadEnd, row, col, x, context));
	});
var $elm$parser$Parser$Advanced$chompUntil = function (_v0) {
	var str = _v0.a;
	var expecting = _v0.b;
	return function (s) {
		var _v1 = A5($elm$parser$Parser$Advanced$findSubString, str, s.jh, s.gd, s.fa, s.eL);
		var newOffset = _v1.a;
		var newRow = _v1.b;
		var newCol = _v1.c;
		return _Utils_eq(newOffset, -1) ? A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A4($elm$parser$Parser$Advanced$fromInfo, newRow, newCol, expecting, s.c)) : A3(
			$elm$parser$Parser$Advanced$Good,
			_Utils_cmp(s.jh, newOffset) < 0,
			0,
			{fa: newCol, c: s.c, eo: s.eo, jh: newOffset, gd: newRow, eL: s.eL});
	};
};
var $elm$parser$Parser$Expecting = function (a) {
	return {$: 0, a: a};
};
var $elm$parser$Parser$Advanced$Token = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$parser$Parser$toToken = function (str) {
	return A2(
		$elm$parser$Parser$Advanced$Token,
		str,
		$elm$parser$Parser$Expecting(str));
};
var $elm$parser$Parser$chompUntil = function (str) {
	return $elm$parser$Parser$Advanced$chompUntil(
		$elm$parser$Parser$toToken(str));
};
var $elm$parser$Parser$Advanced$keeper = F2(
	function (parseFunc, parseArg) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$apL, parseFunc, parseArg);
	});
var $elm$parser$Parser$keeper = $elm$parser$Parser$Advanced$keeper;
var $elm$parser$Parser$Advanced$isSubString = _Parser_isSubString;
var $elm$parser$Parser$Advanced$token = function (_v0) {
	var str = _v0.a;
	var expecting = _v0.b;
	var progress = !$elm$core$String$isEmpty(str);
	return function (s) {
		var _v1 = A5($elm$parser$Parser$Advanced$isSubString, str, s.jh, s.gd, s.fa, s.eL);
		var newOffset = _v1.a;
		var newRow = _v1.b;
		var newCol = _v1.c;
		return _Utils_eq(newOffset, -1) ? A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : A3(
			$elm$parser$Parser$Advanced$Good,
			progress,
			0,
			{fa: newCol, c: s.c, eo: s.eo, jh: newOffset, gd: newRow, eL: s.eL});
	};
};
var $elm$parser$Parser$token = function (str) {
	return $elm$parser$Parser$Advanced$token(
		$elm$parser$Parser$toToken(str));
};
var $hecrj$html_parser$Html$Parser$comment = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed($hecrj$html_parser$Html$Parser$Comment),
			$elm$parser$Parser$token('<!')),
		$elm$parser$Parser$token('--')),
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$getChompedString(
			$elm$parser$Parser$chompUntil('-->')),
		$elm$parser$Parser$token('-->')));
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $hecrj$html_parser$Html$Parser$voidElements = _List_fromArray(
	['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
var $hecrj$html_parser$Html$Parser$isVoidElement = function (name) {
	return A2($elm$core$List$member, name, $hecrj$html_parser$Html$Parser$voidElements);
};
var $elm$parser$Parser$Done = function (a) {
	return {$: 1, a: a};
};
var $elm$parser$Parser$Loop = function (a) {
	return {$: 0, a: a};
};
var $elm$parser$Parser$Advanced$loopHelp = F4(
	function (p, state, callback, s0) {
		loopHelp:
		while (true) {
			var _v0 = callback(state);
			var parse = _v0;
			var _v1 = parse(s0);
			if (!_v1.$) {
				var p1 = _v1.a;
				var step = _v1.b;
				var s1 = _v1.c;
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
					return A3($elm$parser$Parser$Advanced$Good, p || p1, result, s1);
				}
			} else {
				var p1 = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p || p1, x);
			}
		}
	});
var $elm$parser$Parser$Advanced$loop = F2(
	function (state, callback) {
		return function (s) {
			return A4($elm$parser$Parser$Advanced$loopHelp, false, state, callback, s);
		};
	});
var $elm$parser$Parser$Advanced$map = F2(
	function (func, _v0) {
		var parse = _v0;
		return function (s0) {
			var _v1 = parse(s0);
			if (!_v1.$) {
				var p = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				return A3(
					$elm$parser$Parser$Advanced$Good,
					p,
					func(a),
					s1);
			} else {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			}
		};
	});
var $elm$parser$Parser$map = $elm$parser$Parser$Advanced$map;
var $elm$parser$Parser$Advanced$Done = function (a) {
	return {$: 1, a: a};
};
var $elm$parser$Parser$Advanced$Loop = function (a) {
	return {$: 0, a: a};
};
var $elm$parser$Parser$toAdvancedStep = function (step) {
	if (!step.$) {
		var s = step.a;
		return $elm$parser$Parser$Advanced$Loop(s);
	} else {
		var a = step.a;
		return $elm$parser$Parser$Advanced$Done(a);
	}
};
var $elm$parser$Parser$loop = F2(
	function (state, callback) {
		return A2(
			$elm$parser$Parser$Advanced$loop,
			state,
			function (s) {
				return A2(
					$elm$parser$Parser$map,
					$elm$parser$Parser$toAdvancedStep,
					callback(s));
			});
	});
var $elm$parser$Parser$Advanced$Append = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$oneOfHelp = F3(
	function (s0, bag, parsers) {
		oneOfHelp:
		while (true) {
			if (!parsers.b) {
				return A2($elm$parser$Parser$Advanced$Bad, false, bag);
			} else {
				var parse = parsers.a;
				var remainingParsers = parsers.b;
				var _v1 = parse(s0);
				if (!_v1.$) {
					var step = _v1;
					return step;
				} else {
					var step = _v1;
					var p = step.a;
					var x = step.b;
					if (p) {
						return step;
					} else {
						var $temp$s0 = s0,
							$temp$bag = A2($elm$parser$Parser$Advanced$Append, bag, x),
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
var $elm$parser$Parser$Advanced$oneOf = function (parsers) {
	return function (s) {
		return A3($elm$parser$Parser$Advanced$oneOfHelp, s, $elm$parser$Parser$Advanced$Empty, parsers);
	};
};
var $elm$parser$Parser$oneOf = $elm$parser$Parser$Advanced$oneOf;
var $hecrj$html_parser$Html$Parser$many = function (parser_) {
	return A2(
		$elm$parser$Parser$loop,
		_List_Nil,
		function (list) {
			return $elm$parser$Parser$oneOf(
				_List_fromArray(
					[
						A2(
						$elm$parser$Parser$map,
						function (_new) {
							return $elm$parser$Parser$Loop(
								A2($elm$core$List$cons, _new, list));
						},
						parser_),
						$elm$parser$Parser$succeed(
						$elm$parser$Parser$Done(
							$elm$core$List$reverse(list)))
					]));
		});
};
var $hecrj$html_parser$Html$Parser$isTagAttributeCharacter = function (c) {
	return (!$hecrj$html_parser$Html$Parser$isSpaceCharacter(c)) && ((c !== '\"') && ((c !== '\'') && ((c !== '>') && ((c !== '/') && (c !== '=')))));
};
var $hecrj$html_parser$Html$Parser$tagAttributeName = A2(
	$elm$parser$Parser$map,
	$elm$core$String$toLower,
	$elm$parser$Parser$getChompedString(
		$hecrj$html_parser$Html$Parser$chompOneOrMore($hecrj$html_parser$Html$Parser$isTagAttributeCharacter)));
var $hecrj$html_parser$Html$Parser$chompSemicolon = $elm$parser$Parser$chompIf(
	$elm$core$Basics$eq(';'));
var $hecrj$html_parser$Html$Parser$NamedCharacterReferences$dict = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2('Aacute', 'Á'),
			_Utils_Tuple2('aacute', 'á'),
			_Utils_Tuple2('Abreve', 'Ă'),
			_Utils_Tuple2('abreve', 'ă'),
			_Utils_Tuple2('ac', '∾'),
			_Utils_Tuple2('acd', '∿'),
			_Utils_Tuple2('acE', '∾̳'),
			_Utils_Tuple2('Acirc', 'Â'),
			_Utils_Tuple2('acirc', 'â'),
			_Utils_Tuple2('acute', '´'),
			_Utils_Tuple2('Acy', 'А'),
			_Utils_Tuple2('acy', 'а'),
			_Utils_Tuple2('AElig', 'Æ'),
			_Utils_Tuple2('aelig', 'æ'),
			_Utils_Tuple2('af', '\u2061'),
			_Utils_Tuple2('Afr', '\uD835\uDD04'),
			_Utils_Tuple2('afr', '\uD835\uDD1E'),
			_Utils_Tuple2('Agrave', 'À'),
			_Utils_Tuple2('agrave', 'à'),
			_Utils_Tuple2('alefsym', 'ℵ'),
			_Utils_Tuple2('aleph', 'ℵ'),
			_Utils_Tuple2('Alpha', 'Α'),
			_Utils_Tuple2('alpha', 'α'),
			_Utils_Tuple2('Amacr', 'Ā'),
			_Utils_Tuple2('amacr', 'ā'),
			_Utils_Tuple2('amalg', '⨿'),
			_Utils_Tuple2('amp', '&'),
			_Utils_Tuple2('AMP', '&'),
			_Utils_Tuple2('andand', '⩕'),
			_Utils_Tuple2('And', '⩓'),
			_Utils_Tuple2('and', '∧'),
			_Utils_Tuple2('andd', '⩜'),
			_Utils_Tuple2('andslope', '⩘'),
			_Utils_Tuple2('andv', '⩚'),
			_Utils_Tuple2('ang', '∠'),
			_Utils_Tuple2('ange', '⦤'),
			_Utils_Tuple2('angle', '∠'),
			_Utils_Tuple2('angmsdaa', '⦨'),
			_Utils_Tuple2('angmsdab', '⦩'),
			_Utils_Tuple2('angmsdac', '⦪'),
			_Utils_Tuple2('angmsdad', '⦫'),
			_Utils_Tuple2('angmsdae', '⦬'),
			_Utils_Tuple2('angmsdaf', '⦭'),
			_Utils_Tuple2('angmsdag', '⦮'),
			_Utils_Tuple2('angmsdah', '⦯'),
			_Utils_Tuple2('angmsd', '∡'),
			_Utils_Tuple2('angrt', '∟'),
			_Utils_Tuple2('angrtvb', '⊾'),
			_Utils_Tuple2('angrtvbd', '⦝'),
			_Utils_Tuple2('angsph', '∢'),
			_Utils_Tuple2('angst', 'Å'),
			_Utils_Tuple2('angzarr', '⍼'),
			_Utils_Tuple2('Aogon', 'Ą'),
			_Utils_Tuple2('aogon', 'ą'),
			_Utils_Tuple2('Aopf', '\uD835\uDD38'),
			_Utils_Tuple2('aopf', '\uD835\uDD52'),
			_Utils_Tuple2('apacir', '⩯'),
			_Utils_Tuple2('ap', '≈'),
			_Utils_Tuple2('apE', '⩰'),
			_Utils_Tuple2('ape', '≊'),
			_Utils_Tuple2('apid', '≋'),
			_Utils_Tuple2('apos', '\''),
			_Utils_Tuple2('ApplyFunction', '\u2061'),
			_Utils_Tuple2('approx', '≈'),
			_Utils_Tuple2('approxeq', '≊'),
			_Utils_Tuple2('Aring', 'Å'),
			_Utils_Tuple2('aring', 'å'),
			_Utils_Tuple2('Ascr', '\uD835\uDC9C'),
			_Utils_Tuple2('ascr', '\uD835\uDCB6'),
			_Utils_Tuple2('Assign', '≔'),
			_Utils_Tuple2('ast', '*'),
			_Utils_Tuple2('asymp', '≈'),
			_Utils_Tuple2('asympeq', '≍'),
			_Utils_Tuple2('Atilde', 'Ã'),
			_Utils_Tuple2('atilde', 'ã'),
			_Utils_Tuple2('Auml', 'Ä'),
			_Utils_Tuple2('auml', 'ä'),
			_Utils_Tuple2('awconint', '∳'),
			_Utils_Tuple2('awint', '⨑'),
			_Utils_Tuple2('backcong', '≌'),
			_Utils_Tuple2('backepsilon', '϶'),
			_Utils_Tuple2('backprime', '‵'),
			_Utils_Tuple2('backsim', '∽'),
			_Utils_Tuple2('backsimeq', '⋍'),
			_Utils_Tuple2('Backslash', '∖'),
			_Utils_Tuple2('Barv', '⫧'),
			_Utils_Tuple2('barvee', '⊽'),
			_Utils_Tuple2('barwed', '⌅'),
			_Utils_Tuple2('Barwed', '⌆'),
			_Utils_Tuple2('barwedge', '⌅'),
			_Utils_Tuple2('bbrk', '⎵'),
			_Utils_Tuple2('bbrktbrk', '⎶'),
			_Utils_Tuple2('bcong', '≌'),
			_Utils_Tuple2('Bcy', 'Б'),
			_Utils_Tuple2('bcy', 'б'),
			_Utils_Tuple2('bdquo', '„'),
			_Utils_Tuple2('becaus', '∵'),
			_Utils_Tuple2('because', '∵'),
			_Utils_Tuple2('Because', '∵'),
			_Utils_Tuple2('bemptyv', '⦰'),
			_Utils_Tuple2('bepsi', '϶'),
			_Utils_Tuple2('bernou', 'ℬ'),
			_Utils_Tuple2('Bernoullis', 'ℬ'),
			_Utils_Tuple2('Beta', 'Β'),
			_Utils_Tuple2('beta', 'β'),
			_Utils_Tuple2('beth', 'ℶ'),
			_Utils_Tuple2('between', '≬'),
			_Utils_Tuple2('Bfr', '\uD835\uDD05'),
			_Utils_Tuple2('bfr', '\uD835\uDD1F'),
			_Utils_Tuple2('bigcap', '⋂'),
			_Utils_Tuple2('bigcirc', '◯'),
			_Utils_Tuple2('bigcup', '⋃'),
			_Utils_Tuple2('bigodot', '⨀'),
			_Utils_Tuple2('bigoplus', '⨁'),
			_Utils_Tuple2('bigotimes', '⨂'),
			_Utils_Tuple2('bigsqcup', '⨆'),
			_Utils_Tuple2('bigstar', '★'),
			_Utils_Tuple2('bigtriangledown', '▽'),
			_Utils_Tuple2('bigtriangleup', '△'),
			_Utils_Tuple2('biguplus', '⨄'),
			_Utils_Tuple2('bigvee', '⋁'),
			_Utils_Tuple2('bigwedge', '⋀'),
			_Utils_Tuple2('bkarow', '⤍'),
			_Utils_Tuple2('blacklozenge', '⧫'),
			_Utils_Tuple2('blacksquare', '▪'),
			_Utils_Tuple2('blacktriangle', '▴'),
			_Utils_Tuple2('blacktriangledown', '▾'),
			_Utils_Tuple2('blacktriangleleft', '◂'),
			_Utils_Tuple2('blacktriangleright', '▸'),
			_Utils_Tuple2('blank', '␣'),
			_Utils_Tuple2('blk12', '▒'),
			_Utils_Tuple2('blk14', '░'),
			_Utils_Tuple2('blk34', '▓'),
			_Utils_Tuple2('block', '█'),
			_Utils_Tuple2('bne', '=⃥'),
			_Utils_Tuple2('bnequiv', '≡⃥'),
			_Utils_Tuple2('bNot', '⫭'),
			_Utils_Tuple2('bnot', '⌐'),
			_Utils_Tuple2('Bopf', '\uD835\uDD39'),
			_Utils_Tuple2('bopf', '\uD835\uDD53'),
			_Utils_Tuple2('bot', '⊥'),
			_Utils_Tuple2('bottom', '⊥'),
			_Utils_Tuple2('bowtie', '⋈'),
			_Utils_Tuple2('boxbox', '⧉'),
			_Utils_Tuple2('boxdl', '┐'),
			_Utils_Tuple2('boxdL', '╕'),
			_Utils_Tuple2('boxDl', '╖'),
			_Utils_Tuple2('boxDL', '╗'),
			_Utils_Tuple2('boxdr', '┌'),
			_Utils_Tuple2('boxdR', '╒'),
			_Utils_Tuple2('boxDr', '╓'),
			_Utils_Tuple2('boxDR', '╔'),
			_Utils_Tuple2('boxh', '─'),
			_Utils_Tuple2('boxH', '═'),
			_Utils_Tuple2('boxhd', '┬'),
			_Utils_Tuple2('boxHd', '╤'),
			_Utils_Tuple2('boxhD', '╥'),
			_Utils_Tuple2('boxHD', '╦'),
			_Utils_Tuple2('boxhu', '┴'),
			_Utils_Tuple2('boxHu', '╧'),
			_Utils_Tuple2('boxhU', '╨'),
			_Utils_Tuple2('boxHU', '╩'),
			_Utils_Tuple2('boxminus', '⊟'),
			_Utils_Tuple2('boxplus', '⊞'),
			_Utils_Tuple2('boxtimes', '⊠'),
			_Utils_Tuple2('boxul', '┘'),
			_Utils_Tuple2('boxuL', '╛'),
			_Utils_Tuple2('boxUl', '╜'),
			_Utils_Tuple2('boxUL', '╝'),
			_Utils_Tuple2('boxur', '└'),
			_Utils_Tuple2('boxuR', '╘'),
			_Utils_Tuple2('boxUr', '╙'),
			_Utils_Tuple2('boxUR', '╚'),
			_Utils_Tuple2('boxv', '│'),
			_Utils_Tuple2('boxV', '║'),
			_Utils_Tuple2('boxvh', '┼'),
			_Utils_Tuple2('boxvH', '╪'),
			_Utils_Tuple2('boxVh', '╫'),
			_Utils_Tuple2('boxVH', '╬'),
			_Utils_Tuple2('boxvl', '┤'),
			_Utils_Tuple2('boxvL', '╡'),
			_Utils_Tuple2('boxVl', '╢'),
			_Utils_Tuple2('boxVL', '╣'),
			_Utils_Tuple2('boxvr', '├'),
			_Utils_Tuple2('boxvR', '╞'),
			_Utils_Tuple2('boxVr', '╟'),
			_Utils_Tuple2('boxVR', '╠'),
			_Utils_Tuple2('bprime', '‵'),
			_Utils_Tuple2('breve', '˘'),
			_Utils_Tuple2('Breve', '˘'),
			_Utils_Tuple2('brvbar', '¦'),
			_Utils_Tuple2('bscr', '\uD835\uDCB7'),
			_Utils_Tuple2('Bscr', 'ℬ'),
			_Utils_Tuple2('bsemi', '⁏'),
			_Utils_Tuple2('bsim', '∽'),
			_Utils_Tuple2('bsime', '⋍'),
			_Utils_Tuple2('bsolb', '⧅'),
			_Utils_Tuple2('bsol', '\\'),
			_Utils_Tuple2('bsolhsub', '⟈'),
			_Utils_Tuple2('bull', '•'),
			_Utils_Tuple2('bullet', '•'),
			_Utils_Tuple2('bump', '≎'),
			_Utils_Tuple2('bumpE', '⪮'),
			_Utils_Tuple2('bumpe', '≏'),
			_Utils_Tuple2('Bumpeq', '≎'),
			_Utils_Tuple2('bumpeq', '≏'),
			_Utils_Tuple2('Cacute', 'Ć'),
			_Utils_Tuple2('cacute', 'ć'),
			_Utils_Tuple2('capand', '⩄'),
			_Utils_Tuple2('capbrcup', '⩉'),
			_Utils_Tuple2('capcap', '⩋'),
			_Utils_Tuple2('cap', '∩'),
			_Utils_Tuple2('Cap', '⋒'),
			_Utils_Tuple2('capcup', '⩇'),
			_Utils_Tuple2('capdot', '⩀'),
			_Utils_Tuple2('CapitalDifferentialD', 'ⅅ'),
			_Utils_Tuple2('caps', '∩︀'),
			_Utils_Tuple2('caret', '⁁'),
			_Utils_Tuple2('caron', 'ˇ'),
			_Utils_Tuple2('Cayleys', 'ℭ'),
			_Utils_Tuple2('ccaps', '⩍'),
			_Utils_Tuple2('Ccaron', 'Č'),
			_Utils_Tuple2('ccaron', 'č'),
			_Utils_Tuple2('Ccedil', 'Ç'),
			_Utils_Tuple2('ccedil', 'ç'),
			_Utils_Tuple2('Ccirc', 'Ĉ'),
			_Utils_Tuple2('ccirc', 'ĉ'),
			_Utils_Tuple2('Cconint', '∰'),
			_Utils_Tuple2('ccups', '⩌'),
			_Utils_Tuple2('ccupssm', '⩐'),
			_Utils_Tuple2('Cdot', 'Ċ'),
			_Utils_Tuple2('cdot', 'ċ'),
			_Utils_Tuple2('cedil', '¸'),
			_Utils_Tuple2('Cedilla', '¸'),
			_Utils_Tuple2('cemptyv', '⦲'),
			_Utils_Tuple2('cent', '¢'),
			_Utils_Tuple2('centerdot', '·'),
			_Utils_Tuple2('CenterDot', '·'),
			_Utils_Tuple2('cfr', '\uD835\uDD20'),
			_Utils_Tuple2('Cfr', 'ℭ'),
			_Utils_Tuple2('CHcy', 'Ч'),
			_Utils_Tuple2('chcy', 'ч'),
			_Utils_Tuple2('check', '✓'),
			_Utils_Tuple2('checkmark', '✓'),
			_Utils_Tuple2('Chi', 'Χ'),
			_Utils_Tuple2('chi', 'χ'),
			_Utils_Tuple2('circ', 'ˆ'),
			_Utils_Tuple2('circeq', '≗'),
			_Utils_Tuple2('circlearrowleft', '↺'),
			_Utils_Tuple2('circlearrowright', '↻'),
			_Utils_Tuple2('circledast', '⊛'),
			_Utils_Tuple2('circledcirc', '⊚'),
			_Utils_Tuple2('circleddash', '⊝'),
			_Utils_Tuple2('CircleDot', '⊙'),
			_Utils_Tuple2('circledR', '®'),
			_Utils_Tuple2('circledS', 'Ⓢ'),
			_Utils_Tuple2('CircleMinus', '⊖'),
			_Utils_Tuple2('CirclePlus', '⊕'),
			_Utils_Tuple2('CircleTimes', '⊗'),
			_Utils_Tuple2('cir', '○'),
			_Utils_Tuple2('cirE', '⧃'),
			_Utils_Tuple2('cire', '≗'),
			_Utils_Tuple2('cirfnint', '⨐'),
			_Utils_Tuple2('cirmid', '⫯'),
			_Utils_Tuple2('cirscir', '⧂'),
			_Utils_Tuple2('ClockwiseContourIntegral', '∲'),
			_Utils_Tuple2('CloseCurlyDoubleQuote', '”'),
			_Utils_Tuple2('CloseCurlyQuote', '’'),
			_Utils_Tuple2('clubs', '♣'),
			_Utils_Tuple2('clubsuit', '♣'),
			_Utils_Tuple2('colon', ':'),
			_Utils_Tuple2('Colon', '∷'),
			_Utils_Tuple2('Colone', '⩴'),
			_Utils_Tuple2('colone', '≔'),
			_Utils_Tuple2('coloneq', '≔'),
			_Utils_Tuple2('comma', ','),
			_Utils_Tuple2('commat', '@'),
			_Utils_Tuple2('comp', '∁'),
			_Utils_Tuple2('compfn', '∘'),
			_Utils_Tuple2('complement', '∁'),
			_Utils_Tuple2('complexes', 'ℂ'),
			_Utils_Tuple2('cong', '≅'),
			_Utils_Tuple2('congdot', '⩭'),
			_Utils_Tuple2('Congruent', '≡'),
			_Utils_Tuple2('conint', '∮'),
			_Utils_Tuple2('Conint', '∯'),
			_Utils_Tuple2('ContourIntegral', '∮'),
			_Utils_Tuple2('copf', '\uD835\uDD54'),
			_Utils_Tuple2('Copf', 'ℂ'),
			_Utils_Tuple2('coprod', '∐'),
			_Utils_Tuple2('Coproduct', '∐'),
			_Utils_Tuple2('copy', '©'),
			_Utils_Tuple2('COPY', '©'),
			_Utils_Tuple2('copysr', '℗'),
			_Utils_Tuple2('CounterClockwiseContourIntegral', '∳'),
			_Utils_Tuple2('crarr', '↵'),
			_Utils_Tuple2('cross', '✗'),
			_Utils_Tuple2('Cross', '⨯'),
			_Utils_Tuple2('Cscr', '\uD835\uDC9E'),
			_Utils_Tuple2('cscr', '\uD835\uDCB8'),
			_Utils_Tuple2('csub', '⫏'),
			_Utils_Tuple2('csube', '⫑'),
			_Utils_Tuple2('csup', '⫐'),
			_Utils_Tuple2('csupe', '⫒'),
			_Utils_Tuple2('ctdot', '⋯'),
			_Utils_Tuple2('cudarrl', '⤸'),
			_Utils_Tuple2('cudarrr', '⤵'),
			_Utils_Tuple2('cuepr', '⋞'),
			_Utils_Tuple2('cuesc', '⋟'),
			_Utils_Tuple2('cularr', '↶'),
			_Utils_Tuple2('cularrp', '⤽'),
			_Utils_Tuple2('cupbrcap', '⩈'),
			_Utils_Tuple2('cupcap', '⩆'),
			_Utils_Tuple2('CupCap', '≍'),
			_Utils_Tuple2('cup', '∪'),
			_Utils_Tuple2('Cup', '⋓'),
			_Utils_Tuple2('cupcup', '⩊'),
			_Utils_Tuple2('cupdot', '⊍'),
			_Utils_Tuple2('cupor', '⩅'),
			_Utils_Tuple2('cups', '∪︀'),
			_Utils_Tuple2('curarr', '↷'),
			_Utils_Tuple2('curarrm', '⤼'),
			_Utils_Tuple2('curlyeqprec', '⋞'),
			_Utils_Tuple2('curlyeqsucc', '⋟'),
			_Utils_Tuple2('curlyvee', '⋎'),
			_Utils_Tuple2('curlywedge', '⋏'),
			_Utils_Tuple2('curren', '¤'),
			_Utils_Tuple2('curvearrowleft', '↶'),
			_Utils_Tuple2('curvearrowright', '↷'),
			_Utils_Tuple2('cuvee', '⋎'),
			_Utils_Tuple2('cuwed', '⋏'),
			_Utils_Tuple2('cwconint', '∲'),
			_Utils_Tuple2('cwint', '∱'),
			_Utils_Tuple2('cylcty', '⌭'),
			_Utils_Tuple2('dagger', '†'),
			_Utils_Tuple2('Dagger', '‡'),
			_Utils_Tuple2('daleth', 'ℸ'),
			_Utils_Tuple2('darr', '↓'),
			_Utils_Tuple2('Darr', '↡'),
			_Utils_Tuple2('dArr', '⇓'),
			_Utils_Tuple2('dash', '‐'),
			_Utils_Tuple2('Dashv', '⫤'),
			_Utils_Tuple2('dashv', '⊣'),
			_Utils_Tuple2('dbkarow', '⤏'),
			_Utils_Tuple2('dblac', '˝'),
			_Utils_Tuple2('Dcaron', 'Ď'),
			_Utils_Tuple2('dcaron', 'ď'),
			_Utils_Tuple2('Dcy', 'Д'),
			_Utils_Tuple2('dcy', 'д'),
			_Utils_Tuple2('ddagger', '‡'),
			_Utils_Tuple2('ddarr', '⇊'),
			_Utils_Tuple2('DD', 'ⅅ'),
			_Utils_Tuple2('dd', 'ⅆ'),
			_Utils_Tuple2('DDotrahd', '⤑'),
			_Utils_Tuple2('ddotseq', '⩷'),
			_Utils_Tuple2('deg', '°'),
			_Utils_Tuple2('Del', '∇'),
			_Utils_Tuple2('Delta', 'Δ'),
			_Utils_Tuple2('delta', 'δ'),
			_Utils_Tuple2('demptyv', '⦱'),
			_Utils_Tuple2('dfisht', '⥿'),
			_Utils_Tuple2('Dfr', '\uD835\uDD07'),
			_Utils_Tuple2('dfr', '\uD835\uDD21'),
			_Utils_Tuple2('dHar', '⥥'),
			_Utils_Tuple2('dharl', '⇃'),
			_Utils_Tuple2('dharr', '⇂'),
			_Utils_Tuple2('DiacriticalAcute', '´'),
			_Utils_Tuple2('DiacriticalDot', '˙'),
			_Utils_Tuple2('DiacriticalDoubleAcute', '˝'),
			_Utils_Tuple2('DiacriticalGrave', '`'),
			_Utils_Tuple2('DiacriticalTilde', '˜'),
			_Utils_Tuple2('diam', '⋄'),
			_Utils_Tuple2('diamond', '⋄'),
			_Utils_Tuple2('Diamond', '⋄'),
			_Utils_Tuple2('diamondsuit', '♦'),
			_Utils_Tuple2('diams', '♦'),
			_Utils_Tuple2('die', '¨'),
			_Utils_Tuple2('DifferentialD', 'ⅆ'),
			_Utils_Tuple2('digamma', 'ϝ'),
			_Utils_Tuple2('disin', '⋲'),
			_Utils_Tuple2('div', '÷'),
			_Utils_Tuple2('divide', '÷'),
			_Utils_Tuple2('divideontimes', '⋇'),
			_Utils_Tuple2('divonx', '⋇'),
			_Utils_Tuple2('DJcy', 'Ђ'),
			_Utils_Tuple2('djcy', 'ђ'),
			_Utils_Tuple2('dlcorn', '⌞'),
			_Utils_Tuple2('dlcrop', '⌍'),
			_Utils_Tuple2('dollar', '$'),
			_Utils_Tuple2('Dopf', '\uD835\uDD3B'),
			_Utils_Tuple2('dopf', '\uD835\uDD55'),
			_Utils_Tuple2('Dot', '¨'),
			_Utils_Tuple2('dot', '˙'),
			_Utils_Tuple2('DotDot', '⃜'),
			_Utils_Tuple2('doteq', '≐'),
			_Utils_Tuple2('doteqdot', '≑'),
			_Utils_Tuple2('DotEqual', '≐'),
			_Utils_Tuple2('dotminus', '∸'),
			_Utils_Tuple2('dotplus', '∔'),
			_Utils_Tuple2('dotsquare', '⊡'),
			_Utils_Tuple2('doublebarwedge', '⌆'),
			_Utils_Tuple2('DoubleContourIntegral', '∯'),
			_Utils_Tuple2('DoubleDot', '¨'),
			_Utils_Tuple2('DoubleDownArrow', '⇓'),
			_Utils_Tuple2('DoubleLeftArrow', '⇐'),
			_Utils_Tuple2('DoubleLeftRightArrow', '⇔'),
			_Utils_Tuple2('DoubleLeftTee', '⫤'),
			_Utils_Tuple2('DoubleLongLeftArrow', '⟸'),
			_Utils_Tuple2('DoubleLongLeftRightArrow', '⟺'),
			_Utils_Tuple2('DoubleLongRightArrow', '⟹'),
			_Utils_Tuple2('DoubleRightArrow', '⇒'),
			_Utils_Tuple2('DoubleRightTee', '⊨'),
			_Utils_Tuple2('DoubleUpArrow', '⇑'),
			_Utils_Tuple2('DoubleUpDownArrow', '⇕'),
			_Utils_Tuple2('DoubleVerticalBar', '∥'),
			_Utils_Tuple2('DownArrowBar', '⤓'),
			_Utils_Tuple2('downarrow', '↓'),
			_Utils_Tuple2('DownArrow', '↓'),
			_Utils_Tuple2('Downarrow', '⇓'),
			_Utils_Tuple2('DownArrowUpArrow', '⇵'),
			_Utils_Tuple2('DownBreve', '̑'),
			_Utils_Tuple2('downdownarrows', '⇊'),
			_Utils_Tuple2('downharpoonleft', '⇃'),
			_Utils_Tuple2('downharpoonright', '⇂'),
			_Utils_Tuple2('DownLeftRightVector', '⥐'),
			_Utils_Tuple2('DownLeftTeeVector', '⥞'),
			_Utils_Tuple2('DownLeftVectorBar', '⥖'),
			_Utils_Tuple2('DownLeftVector', '↽'),
			_Utils_Tuple2('DownRightTeeVector', '⥟'),
			_Utils_Tuple2('DownRightVectorBar', '⥗'),
			_Utils_Tuple2('DownRightVector', '⇁'),
			_Utils_Tuple2('DownTeeArrow', '↧'),
			_Utils_Tuple2('DownTee', '⊤'),
			_Utils_Tuple2('drbkarow', '⤐'),
			_Utils_Tuple2('drcorn', '⌟'),
			_Utils_Tuple2('drcrop', '⌌'),
			_Utils_Tuple2('Dscr', '\uD835\uDC9F'),
			_Utils_Tuple2('dscr', '\uD835\uDCB9'),
			_Utils_Tuple2('DScy', 'Ѕ'),
			_Utils_Tuple2('dscy', 'ѕ'),
			_Utils_Tuple2('dsol', '⧶'),
			_Utils_Tuple2('Dstrok', 'Đ'),
			_Utils_Tuple2('dstrok', 'đ'),
			_Utils_Tuple2('dtdot', '⋱'),
			_Utils_Tuple2('dtri', '▿'),
			_Utils_Tuple2('dtrif', '▾'),
			_Utils_Tuple2('duarr', '⇵'),
			_Utils_Tuple2('duhar', '⥯'),
			_Utils_Tuple2('dwangle', '⦦'),
			_Utils_Tuple2('DZcy', 'Џ'),
			_Utils_Tuple2('dzcy', 'џ'),
			_Utils_Tuple2('dzigrarr', '⟿'),
			_Utils_Tuple2('Eacute', 'É'),
			_Utils_Tuple2('eacute', 'é'),
			_Utils_Tuple2('easter', '⩮'),
			_Utils_Tuple2('Ecaron', 'Ě'),
			_Utils_Tuple2('ecaron', 'ě'),
			_Utils_Tuple2('Ecirc', 'Ê'),
			_Utils_Tuple2('ecirc', 'ê'),
			_Utils_Tuple2('ecir', '≖'),
			_Utils_Tuple2('ecolon', '≕'),
			_Utils_Tuple2('Ecy', 'Э'),
			_Utils_Tuple2('ecy', 'э'),
			_Utils_Tuple2('eDDot', '⩷'),
			_Utils_Tuple2('Edot', 'Ė'),
			_Utils_Tuple2('edot', 'ė'),
			_Utils_Tuple2('eDot', '≑'),
			_Utils_Tuple2('ee', 'ⅇ'),
			_Utils_Tuple2('efDot', '≒'),
			_Utils_Tuple2('Efr', '\uD835\uDD08'),
			_Utils_Tuple2('efr', '\uD835\uDD22'),
			_Utils_Tuple2('eg', '⪚'),
			_Utils_Tuple2('Egrave', 'È'),
			_Utils_Tuple2('egrave', 'è'),
			_Utils_Tuple2('egs', '⪖'),
			_Utils_Tuple2('egsdot', '⪘'),
			_Utils_Tuple2('el', '⪙'),
			_Utils_Tuple2('Element', '∈'),
			_Utils_Tuple2('elinters', '⏧'),
			_Utils_Tuple2('ell', 'ℓ'),
			_Utils_Tuple2('els', '⪕'),
			_Utils_Tuple2('elsdot', '⪗'),
			_Utils_Tuple2('Emacr', 'Ē'),
			_Utils_Tuple2('emacr', 'ē'),
			_Utils_Tuple2('empty', '∅'),
			_Utils_Tuple2('emptyset', '∅'),
			_Utils_Tuple2('EmptySmallSquare', '◻'),
			_Utils_Tuple2('emptyv', '∅'),
			_Utils_Tuple2('EmptyVerySmallSquare', '▫'),
			_Utils_Tuple2('emsp13', '\u2004'),
			_Utils_Tuple2('emsp14', '\u2005'),
			_Utils_Tuple2('emsp', '\u2003'),
			_Utils_Tuple2('ENG', 'Ŋ'),
			_Utils_Tuple2('eng', 'ŋ'),
			_Utils_Tuple2('ensp', '\u2002'),
			_Utils_Tuple2('Eogon', 'Ę'),
			_Utils_Tuple2('eogon', 'ę'),
			_Utils_Tuple2('Eopf', '\uD835\uDD3C'),
			_Utils_Tuple2('eopf', '\uD835\uDD56'),
			_Utils_Tuple2('epar', '⋕'),
			_Utils_Tuple2('eparsl', '⧣'),
			_Utils_Tuple2('eplus', '⩱'),
			_Utils_Tuple2('epsi', 'ε'),
			_Utils_Tuple2('Epsilon', 'Ε'),
			_Utils_Tuple2('epsilon', 'ε'),
			_Utils_Tuple2('epsiv', 'ϵ'),
			_Utils_Tuple2('eqcirc', '≖'),
			_Utils_Tuple2('eqcolon', '≕'),
			_Utils_Tuple2('eqsim', '≂'),
			_Utils_Tuple2('eqslantgtr', '⪖'),
			_Utils_Tuple2('eqslantless', '⪕'),
			_Utils_Tuple2('Equal', '⩵'),
			_Utils_Tuple2('equals', '='),
			_Utils_Tuple2('EqualTilde', '≂'),
			_Utils_Tuple2('equest', '≟'),
			_Utils_Tuple2('Equilibrium', '⇌'),
			_Utils_Tuple2('equiv', '≡'),
			_Utils_Tuple2('equivDD', '⩸'),
			_Utils_Tuple2('eqvparsl', '⧥'),
			_Utils_Tuple2('erarr', '⥱'),
			_Utils_Tuple2('erDot', '≓'),
			_Utils_Tuple2('escr', 'ℯ'),
			_Utils_Tuple2('Escr', 'ℰ'),
			_Utils_Tuple2('esdot', '≐'),
			_Utils_Tuple2('Esim', '⩳'),
			_Utils_Tuple2('esim', '≂'),
			_Utils_Tuple2('Eta', 'Η'),
			_Utils_Tuple2('eta', 'η'),
			_Utils_Tuple2('ETH', 'Ð'),
			_Utils_Tuple2('eth', 'ð'),
			_Utils_Tuple2('Euml', 'Ë'),
			_Utils_Tuple2('euml', 'ë'),
			_Utils_Tuple2('euro', '€'),
			_Utils_Tuple2('excl', '!'),
			_Utils_Tuple2('exist', '∃'),
			_Utils_Tuple2('Exists', '∃'),
			_Utils_Tuple2('expectation', 'ℰ'),
			_Utils_Tuple2('exponentiale', 'ⅇ'),
			_Utils_Tuple2('ExponentialE', 'ⅇ'),
			_Utils_Tuple2('fallingdotseq', '≒'),
			_Utils_Tuple2('Fcy', 'Ф'),
			_Utils_Tuple2('fcy', 'ф'),
			_Utils_Tuple2('female', '♀'),
			_Utils_Tuple2('ffilig', 'ﬃ'),
			_Utils_Tuple2('fflig', 'ﬀ'),
			_Utils_Tuple2('ffllig', 'ﬄ'),
			_Utils_Tuple2('Ffr', '\uD835\uDD09'),
			_Utils_Tuple2('ffr', '\uD835\uDD23'),
			_Utils_Tuple2('filig', 'ﬁ'),
			_Utils_Tuple2('FilledSmallSquare', '◼'),
			_Utils_Tuple2('FilledVerySmallSquare', '▪'),
			_Utils_Tuple2('fjlig', 'fj'),
			_Utils_Tuple2('flat', '♭'),
			_Utils_Tuple2('fllig', 'ﬂ'),
			_Utils_Tuple2('fltns', '▱'),
			_Utils_Tuple2('fnof', 'ƒ'),
			_Utils_Tuple2('Fopf', '\uD835\uDD3D'),
			_Utils_Tuple2('fopf', '\uD835\uDD57'),
			_Utils_Tuple2('forall', '∀'),
			_Utils_Tuple2('ForAll', '∀'),
			_Utils_Tuple2('fork', '⋔'),
			_Utils_Tuple2('forkv', '⫙'),
			_Utils_Tuple2('Fouriertrf', 'ℱ'),
			_Utils_Tuple2('fpartint', '⨍'),
			_Utils_Tuple2('frac12', '½'),
			_Utils_Tuple2('frac13', '⅓'),
			_Utils_Tuple2('frac14', '¼'),
			_Utils_Tuple2('frac15', '⅕'),
			_Utils_Tuple2('frac16', '⅙'),
			_Utils_Tuple2('frac18', '⅛'),
			_Utils_Tuple2('frac23', '⅔'),
			_Utils_Tuple2('frac25', '⅖'),
			_Utils_Tuple2('frac34', '¾'),
			_Utils_Tuple2('frac35', '⅗'),
			_Utils_Tuple2('frac38', '⅜'),
			_Utils_Tuple2('frac45', '⅘'),
			_Utils_Tuple2('frac56', '⅚'),
			_Utils_Tuple2('frac58', '⅝'),
			_Utils_Tuple2('frac78', '⅞'),
			_Utils_Tuple2('frasl', '⁄'),
			_Utils_Tuple2('frown', '⌢'),
			_Utils_Tuple2('fscr', '\uD835\uDCBB'),
			_Utils_Tuple2('Fscr', 'ℱ'),
			_Utils_Tuple2('gacute', 'ǵ'),
			_Utils_Tuple2('Gamma', 'Γ'),
			_Utils_Tuple2('gamma', 'γ'),
			_Utils_Tuple2('Gammad', 'Ϝ'),
			_Utils_Tuple2('gammad', 'ϝ'),
			_Utils_Tuple2('gap', '⪆'),
			_Utils_Tuple2('Gbreve', 'Ğ'),
			_Utils_Tuple2('gbreve', 'ğ'),
			_Utils_Tuple2('Gcedil', 'Ģ'),
			_Utils_Tuple2('Gcirc', 'Ĝ'),
			_Utils_Tuple2('gcirc', 'ĝ'),
			_Utils_Tuple2('Gcy', 'Г'),
			_Utils_Tuple2('gcy', 'г'),
			_Utils_Tuple2('Gdot', 'Ġ'),
			_Utils_Tuple2('gdot', 'ġ'),
			_Utils_Tuple2('ge', '≥'),
			_Utils_Tuple2('gE', '≧'),
			_Utils_Tuple2('gEl', '⪌'),
			_Utils_Tuple2('gel', '⋛'),
			_Utils_Tuple2('geq', '≥'),
			_Utils_Tuple2('geqq', '≧'),
			_Utils_Tuple2('geqslant', '⩾'),
			_Utils_Tuple2('gescc', '⪩'),
			_Utils_Tuple2('ges', '⩾'),
			_Utils_Tuple2('gesdot', '⪀'),
			_Utils_Tuple2('gesdoto', '⪂'),
			_Utils_Tuple2('gesdotol', '⪄'),
			_Utils_Tuple2('gesl', '⋛︀'),
			_Utils_Tuple2('gesles', '⪔'),
			_Utils_Tuple2('Gfr', '\uD835\uDD0A'),
			_Utils_Tuple2('gfr', '\uD835\uDD24'),
			_Utils_Tuple2('gg', '≫'),
			_Utils_Tuple2('Gg', '⋙'),
			_Utils_Tuple2('ggg', '⋙'),
			_Utils_Tuple2('gimel', 'ℷ'),
			_Utils_Tuple2('GJcy', 'Ѓ'),
			_Utils_Tuple2('gjcy', 'ѓ'),
			_Utils_Tuple2('gla', '⪥'),
			_Utils_Tuple2('gl', '≷'),
			_Utils_Tuple2('glE', '⪒'),
			_Utils_Tuple2('glj', '⪤'),
			_Utils_Tuple2('gnap', '⪊'),
			_Utils_Tuple2('gnapprox', '⪊'),
			_Utils_Tuple2('gne', '⪈'),
			_Utils_Tuple2('gnE', '≩'),
			_Utils_Tuple2('gneq', '⪈'),
			_Utils_Tuple2('gneqq', '≩'),
			_Utils_Tuple2('gnsim', '⋧'),
			_Utils_Tuple2('Gopf', '\uD835\uDD3E'),
			_Utils_Tuple2('gopf', '\uD835\uDD58'),
			_Utils_Tuple2('grave', '`'),
			_Utils_Tuple2('GreaterEqual', '≥'),
			_Utils_Tuple2('GreaterEqualLess', '⋛'),
			_Utils_Tuple2('GreaterFullEqual', '≧'),
			_Utils_Tuple2('GreaterGreater', '⪢'),
			_Utils_Tuple2('GreaterLess', '≷'),
			_Utils_Tuple2('GreaterSlantEqual', '⩾'),
			_Utils_Tuple2('GreaterTilde', '≳'),
			_Utils_Tuple2('Gscr', '\uD835\uDCA2'),
			_Utils_Tuple2('gscr', 'ℊ'),
			_Utils_Tuple2('gsim', '≳'),
			_Utils_Tuple2('gsime', '⪎'),
			_Utils_Tuple2('gsiml', '⪐'),
			_Utils_Tuple2('gtcc', '⪧'),
			_Utils_Tuple2('gtcir', '⩺'),
			_Utils_Tuple2('gt', '>'),
			_Utils_Tuple2('GT', '>'),
			_Utils_Tuple2('Gt', '≫'),
			_Utils_Tuple2('gtdot', '⋗'),
			_Utils_Tuple2('gtlPar', '⦕'),
			_Utils_Tuple2('gtquest', '⩼'),
			_Utils_Tuple2('gtrapprox', '⪆'),
			_Utils_Tuple2('gtrarr', '⥸'),
			_Utils_Tuple2('gtrdot', '⋗'),
			_Utils_Tuple2('gtreqless', '⋛'),
			_Utils_Tuple2('gtreqqless', '⪌'),
			_Utils_Tuple2('gtrless', '≷'),
			_Utils_Tuple2('gtrsim', '≳'),
			_Utils_Tuple2('gvertneqq', '≩︀'),
			_Utils_Tuple2('gvnE', '≩︀'),
			_Utils_Tuple2('Hacek', 'ˇ'),
			_Utils_Tuple2('hairsp', '\u200A'),
			_Utils_Tuple2('half', '½'),
			_Utils_Tuple2('hamilt', 'ℋ'),
			_Utils_Tuple2('HARDcy', 'Ъ'),
			_Utils_Tuple2('hardcy', 'ъ'),
			_Utils_Tuple2('harrcir', '⥈'),
			_Utils_Tuple2('harr', '↔'),
			_Utils_Tuple2('hArr', '⇔'),
			_Utils_Tuple2('harrw', '↭'),
			_Utils_Tuple2('Hat', '^'),
			_Utils_Tuple2('hbar', 'ℏ'),
			_Utils_Tuple2('Hcirc', 'Ĥ'),
			_Utils_Tuple2('hcirc', 'ĥ'),
			_Utils_Tuple2('hearts', '♥'),
			_Utils_Tuple2('heartsuit', '♥'),
			_Utils_Tuple2('hellip', '…'),
			_Utils_Tuple2('hercon', '⊹'),
			_Utils_Tuple2('hfr', '\uD835\uDD25'),
			_Utils_Tuple2('Hfr', 'ℌ'),
			_Utils_Tuple2('HilbertSpace', 'ℋ'),
			_Utils_Tuple2('hksearow', '⤥'),
			_Utils_Tuple2('hkswarow', '⤦'),
			_Utils_Tuple2('hoarr', '⇿'),
			_Utils_Tuple2('homtht', '∻'),
			_Utils_Tuple2('hookleftarrow', '↩'),
			_Utils_Tuple2('hookrightarrow', '↪'),
			_Utils_Tuple2('hopf', '\uD835\uDD59'),
			_Utils_Tuple2('Hopf', 'ℍ'),
			_Utils_Tuple2('horbar', '―'),
			_Utils_Tuple2('HorizontalLine', '─'),
			_Utils_Tuple2('hscr', '\uD835\uDCBD'),
			_Utils_Tuple2('Hscr', 'ℋ'),
			_Utils_Tuple2('hslash', 'ℏ'),
			_Utils_Tuple2('Hstrok', 'Ħ'),
			_Utils_Tuple2('hstrok', 'ħ'),
			_Utils_Tuple2('HumpDownHump', '≎'),
			_Utils_Tuple2('HumpEqual', '≏'),
			_Utils_Tuple2('hybull', '⁃'),
			_Utils_Tuple2('hyphen', '‐'),
			_Utils_Tuple2('Iacute', 'Í'),
			_Utils_Tuple2('iacute', 'í'),
			_Utils_Tuple2('ic', '\u2063'),
			_Utils_Tuple2('Icirc', 'Î'),
			_Utils_Tuple2('icirc', 'î'),
			_Utils_Tuple2('Icy', 'И'),
			_Utils_Tuple2('icy', 'и'),
			_Utils_Tuple2('Idot', 'İ'),
			_Utils_Tuple2('IEcy', 'Е'),
			_Utils_Tuple2('iecy', 'е'),
			_Utils_Tuple2('iexcl', '¡'),
			_Utils_Tuple2('iff', '⇔'),
			_Utils_Tuple2('ifr', '\uD835\uDD26'),
			_Utils_Tuple2('Ifr', 'ℑ'),
			_Utils_Tuple2('Igrave', 'Ì'),
			_Utils_Tuple2('igrave', 'ì'),
			_Utils_Tuple2('ii', 'ⅈ'),
			_Utils_Tuple2('iiiint', '⨌'),
			_Utils_Tuple2('iiint', '∭'),
			_Utils_Tuple2('iinfin', '⧜'),
			_Utils_Tuple2('iiota', '℩'),
			_Utils_Tuple2('IJlig', 'Ĳ'),
			_Utils_Tuple2('ijlig', 'ĳ'),
			_Utils_Tuple2('Imacr', 'Ī'),
			_Utils_Tuple2('imacr', 'ī'),
			_Utils_Tuple2('image', 'ℑ'),
			_Utils_Tuple2('ImaginaryI', 'ⅈ'),
			_Utils_Tuple2('imagline', 'ℐ'),
			_Utils_Tuple2('imagpart', 'ℑ'),
			_Utils_Tuple2('imath', 'ı'),
			_Utils_Tuple2('Im', 'ℑ'),
			_Utils_Tuple2('imof', '⊷'),
			_Utils_Tuple2('imped', 'Ƶ'),
			_Utils_Tuple2('Implies', '⇒'),
			_Utils_Tuple2('incare', '℅'),
			_Utils_Tuple2('in', '∈'),
			_Utils_Tuple2('infin', '∞'),
			_Utils_Tuple2('infintie', '⧝'),
			_Utils_Tuple2('inodot', 'ı'),
			_Utils_Tuple2('intcal', '⊺'),
			_Utils_Tuple2('int', '∫'),
			_Utils_Tuple2('Int', '∬'),
			_Utils_Tuple2('integers', 'ℤ'),
			_Utils_Tuple2('Integral', '∫'),
			_Utils_Tuple2('intercal', '⊺'),
			_Utils_Tuple2('Intersection', '⋂'),
			_Utils_Tuple2('intlarhk', '⨗'),
			_Utils_Tuple2('intprod', '⨼'),
			_Utils_Tuple2('InvisibleComma', '\u2063'),
			_Utils_Tuple2('InvisibleTimes', '\u2062'),
			_Utils_Tuple2('IOcy', 'Ё'),
			_Utils_Tuple2('iocy', 'ё'),
			_Utils_Tuple2('Iogon', 'Į'),
			_Utils_Tuple2('iogon', 'į'),
			_Utils_Tuple2('Iopf', '\uD835\uDD40'),
			_Utils_Tuple2('iopf', '\uD835\uDD5A'),
			_Utils_Tuple2('Iota', 'Ι'),
			_Utils_Tuple2('iota', 'ι'),
			_Utils_Tuple2('iprod', '⨼'),
			_Utils_Tuple2('iquest', '¿'),
			_Utils_Tuple2('iscr', '\uD835\uDCBE'),
			_Utils_Tuple2('Iscr', 'ℐ'),
			_Utils_Tuple2('isin', '∈'),
			_Utils_Tuple2('isindot', '⋵'),
			_Utils_Tuple2('isinE', '⋹'),
			_Utils_Tuple2('isins', '⋴'),
			_Utils_Tuple2('isinsv', '⋳'),
			_Utils_Tuple2('isinv', '∈'),
			_Utils_Tuple2('it', '\u2062'),
			_Utils_Tuple2('Itilde', 'Ĩ'),
			_Utils_Tuple2('itilde', 'ĩ'),
			_Utils_Tuple2('Iukcy', 'І'),
			_Utils_Tuple2('iukcy', 'і'),
			_Utils_Tuple2('Iuml', 'Ï'),
			_Utils_Tuple2('iuml', 'ï'),
			_Utils_Tuple2('Jcirc', 'Ĵ'),
			_Utils_Tuple2('jcirc', 'ĵ'),
			_Utils_Tuple2('Jcy', 'Й'),
			_Utils_Tuple2('jcy', 'й'),
			_Utils_Tuple2('Jfr', '\uD835\uDD0D'),
			_Utils_Tuple2('jfr', '\uD835\uDD27'),
			_Utils_Tuple2('jmath', 'ȷ'),
			_Utils_Tuple2('Jopf', '\uD835\uDD41'),
			_Utils_Tuple2('jopf', '\uD835\uDD5B'),
			_Utils_Tuple2('Jscr', '\uD835\uDCA5'),
			_Utils_Tuple2('jscr', '\uD835\uDCBF'),
			_Utils_Tuple2('Jsercy', 'Ј'),
			_Utils_Tuple2('jsercy', 'ј'),
			_Utils_Tuple2('Jukcy', 'Є'),
			_Utils_Tuple2('jukcy', 'є'),
			_Utils_Tuple2('Kappa', 'Κ'),
			_Utils_Tuple2('kappa', 'κ'),
			_Utils_Tuple2('kappav', 'ϰ'),
			_Utils_Tuple2('Kcedil', 'Ķ'),
			_Utils_Tuple2('kcedil', 'ķ'),
			_Utils_Tuple2('Kcy', 'К'),
			_Utils_Tuple2('kcy', 'к'),
			_Utils_Tuple2('Kfr', '\uD835\uDD0E'),
			_Utils_Tuple2('kfr', '\uD835\uDD28'),
			_Utils_Tuple2('kgreen', 'ĸ'),
			_Utils_Tuple2('KHcy', 'Х'),
			_Utils_Tuple2('khcy', 'х'),
			_Utils_Tuple2('KJcy', 'Ќ'),
			_Utils_Tuple2('kjcy', 'ќ'),
			_Utils_Tuple2('Kopf', '\uD835\uDD42'),
			_Utils_Tuple2('kopf', '\uD835\uDD5C'),
			_Utils_Tuple2('Kscr', '\uD835\uDCA6'),
			_Utils_Tuple2('kscr', '\uD835\uDCC0'),
			_Utils_Tuple2('lAarr', '⇚'),
			_Utils_Tuple2('Lacute', 'Ĺ'),
			_Utils_Tuple2('lacute', 'ĺ'),
			_Utils_Tuple2('laemptyv', '⦴'),
			_Utils_Tuple2('lagran', 'ℒ'),
			_Utils_Tuple2('Lambda', 'Λ'),
			_Utils_Tuple2('lambda', 'λ'),
			_Utils_Tuple2('lang', '⟨'),
			_Utils_Tuple2('Lang', '⟪'),
			_Utils_Tuple2('langd', '⦑'),
			_Utils_Tuple2('langle', '⟨'),
			_Utils_Tuple2('lap', '⪅'),
			_Utils_Tuple2('Laplacetrf', 'ℒ'),
			_Utils_Tuple2('laquo', '«'),
			_Utils_Tuple2('larrb', '⇤'),
			_Utils_Tuple2('larrbfs', '⤟'),
			_Utils_Tuple2('larr', '←'),
			_Utils_Tuple2('Larr', '↞'),
			_Utils_Tuple2('lArr', '⇐'),
			_Utils_Tuple2('larrfs', '⤝'),
			_Utils_Tuple2('larrhk', '↩'),
			_Utils_Tuple2('larrlp', '↫'),
			_Utils_Tuple2('larrpl', '⤹'),
			_Utils_Tuple2('larrsim', '⥳'),
			_Utils_Tuple2('larrtl', '↢'),
			_Utils_Tuple2('latail', '⤙'),
			_Utils_Tuple2('lAtail', '⤛'),
			_Utils_Tuple2('lat', '⪫'),
			_Utils_Tuple2('late', '⪭'),
			_Utils_Tuple2('lates', '⪭︀'),
			_Utils_Tuple2('lbarr', '⤌'),
			_Utils_Tuple2('lBarr', '⤎'),
			_Utils_Tuple2('lbbrk', '❲'),
			_Utils_Tuple2('lbrace', '{'),
			_Utils_Tuple2('lbrack', '['),
			_Utils_Tuple2('lbrke', '⦋'),
			_Utils_Tuple2('lbrksld', '⦏'),
			_Utils_Tuple2('lbrkslu', '⦍'),
			_Utils_Tuple2('Lcaron', 'Ľ'),
			_Utils_Tuple2('lcaron', 'ľ'),
			_Utils_Tuple2('Lcedil', 'Ļ'),
			_Utils_Tuple2('lcedil', 'ļ'),
			_Utils_Tuple2('lceil', '⌈'),
			_Utils_Tuple2('lcub', '{'),
			_Utils_Tuple2('Lcy', 'Л'),
			_Utils_Tuple2('lcy', 'л'),
			_Utils_Tuple2('ldca', '⤶'),
			_Utils_Tuple2('ldquo', '“'),
			_Utils_Tuple2('ldquor', '„'),
			_Utils_Tuple2('ldrdhar', '⥧'),
			_Utils_Tuple2('ldrushar', '⥋'),
			_Utils_Tuple2('ldsh', '↲'),
			_Utils_Tuple2('le', '≤'),
			_Utils_Tuple2('lE', '≦'),
			_Utils_Tuple2('LeftAngleBracket', '⟨'),
			_Utils_Tuple2('LeftArrowBar', '⇤'),
			_Utils_Tuple2('leftarrow', '←'),
			_Utils_Tuple2('LeftArrow', '←'),
			_Utils_Tuple2('Leftarrow', '⇐'),
			_Utils_Tuple2('LeftArrowRightArrow', '⇆'),
			_Utils_Tuple2('leftarrowtail', '↢'),
			_Utils_Tuple2('LeftCeiling', '⌈'),
			_Utils_Tuple2('LeftDoubleBracket', '⟦'),
			_Utils_Tuple2('LeftDownTeeVector', '⥡'),
			_Utils_Tuple2('LeftDownVectorBar', '⥙'),
			_Utils_Tuple2('LeftDownVector', '⇃'),
			_Utils_Tuple2('LeftFloor', '⌊'),
			_Utils_Tuple2('leftharpoondown', '↽'),
			_Utils_Tuple2('leftharpoonup', '↼'),
			_Utils_Tuple2('leftleftarrows', '⇇'),
			_Utils_Tuple2('leftrightarrow', '↔'),
			_Utils_Tuple2('LeftRightArrow', '↔'),
			_Utils_Tuple2('Leftrightarrow', '⇔'),
			_Utils_Tuple2('leftrightarrows', '⇆'),
			_Utils_Tuple2('leftrightharpoons', '⇋'),
			_Utils_Tuple2('leftrightsquigarrow', '↭'),
			_Utils_Tuple2('LeftRightVector', '⥎'),
			_Utils_Tuple2('LeftTeeArrow', '↤'),
			_Utils_Tuple2('LeftTee', '⊣'),
			_Utils_Tuple2('LeftTeeVector', '⥚'),
			_Utils_Tuple2('leftthreetimes', '⋋'),
			_Utils_Tuple2('LeftTriangleBar', '⧏'),
			_Utils_Tuple2('LeftTriangle', '⊲'),
			_Utils_Tuple2('LeftTriangleEqual', '⊴'),
			_Utils_Tuple2('LeftUpDownVector', '⥑'),
			_Utils_Tuple2('LeftUpTeeVector', '⥠'),
			_Utils_Tuple2('LeftUpVectorBar', '⥘'),
			_Utils_Tuple2('LeftUpVector', '↿'),
			_Utils_Tuple2('LeftVectorBar', '⥒'),
			_Utils_Tuple2('LeftVector', '↼'),
			_Utils_Tuple2('lEg', '⪋'),
			_Utils_Tuple2('leg', '⋚'),
			_Utils_Tuple2('leq', '≤'),
			_Utils_Tuple2('leqq', '≦'),
			_Utils_Tuple2('leqslant', '⩽'),
			_Utils_Tuple2('lescc', '⪨'),
			_Utils_Tuple2('les', '⩽'),
			_Utils_Tuple2('lesdot', '⩿'),
			_Utils_Tuple2('lesdoto', '⪁'),
			_Utils_Tuple2('lesdotor', '⪃'),
			_Utils_Tuple2('lesg', '⋚︀'),
			_Utils_Tuple2('lesges', '⪓'),
			_Utils_Tuple2('lessapprox', '⪅'),
			_Utils_Tuple2('lessdot', '⋖'),
			_Utils_Tuple2('lesseqgtr', '⋚'),
			_Utils_Tuple2('lesseqqgtr', '⪋'),
			_Utils_Tuple2('LessEqualGreater', '⋚'),
			_Utils_Tuple2('LessFullEqual', '≦'),
			_Utils_Tuple2('LessGreater', '≶'),
			_Utils_Tuple2('lessgtr', '≶'),
			_Utils_Tuple2('LessLess', '⪡'),
			_Utils_Tuple2('lesssim', '≲'),
			_Utils_Tuple2('LessSlantEqual', '⩽'),
			_Utils_Tuple2('LessTilde', '≲'),
			_Utils_Tuple2('lfisht', '⥼'),
			_Utils_Tuple2('lfloor', '⌊'),
			_Utils_Tuple2('Lfr', '\uD835\uDD0F'),
			_Utils_Tuple2('lfr', '\uD835\uDD29'),
			_Utils_Tuple2('lg', '≶'),
			_Utils_Tuple2('lgE', '⪑'),
			_Utils_Tuple2('lHar', '⥢'),
			_Utils_Tuple2('lhard', '↽'),
			_Utils_Tuple2('lharu', '↼'),
			_Utils_Tuple2('lharul', '⥪'),
			_Utils_Tuple2('lhblk', '▄'),
			_Utils_Tuple2('LJcy', 'Љ'),
			_Utils_Tuple2('ljcy', 'љ'),
			_Utils_Tuple2('llarr', '⇇'),
			_Utils_Tuple2('ll', '≪'),
			_Utils_Tuple2('Ll', '⋘'),
			_Utils_Tuple2('llcorner', '⌞'),
			_Utils_Tuple2('Lleftarrow', '⇚'),
			_Utils_Tuple2('llhard', '⥫'),
			_Utils_Tuple2('lltri', '◺'),
			_Utils_Tuple2('Lmidot', 'Ŀ'),
			_Utils_Tuple2('lmidot', 'ŀ'),
			_Utils_Tuple2('lmoustache', '⎰'),
			_Utils_Tuple2('lmoust', '⎰'),
			_Utils_Tuple2('lnap', '⪉'),
			_Utils_Tuple2('lnapprox', '⪉'),
			_Utils_Tuple2('lne', '⪇'),
			_Utils_Tuple2('lnE', '≨'),
			_Utils_Tuple2('lneq', '⪇'),
			_Utils_Tuple2('lneqq', '≨'),
			_Utils_Tuple2('lnsim', '⋦'),
			_Utils_Tuple2('loang', '⟬'),
			_Utils_Tuple2('loarr', '⇽'),
			_Utils_Tuple2('lobrk', '⟦'),
			_Utils_Tuple2('longleftarrow', '⟵'),
			_Utils_Tuple2('LongLeftArrow', '⟵'),
			_Utils_Tuple2('Longleftarrow', '⟸'),
			_Utils_Tuple2('longleftrightarrow', '⟷'),
			_Utils_Tuple2('LongLeftRightArrow', '⟷'),
			_Utils_Tuple2('Longleftrightarrow', '⟺'),
			_Utils_Tuple2('longmapsto', '⟼'),
			_Utils_Tuple2('longrightarrow', '⟶'),
			_Utils_Tuple2('LongRightArrow', '⟶'),
			_Utils_Tuple2('Longrightarrow', '⟹'),
			_Utils_Tuple2('looparrowleft', '↫'),
			_Utils_Tuple2('looparrowright', '↬'),
			_Utils_Tuple2('lopar', '⦅'),
			_Utils_Tuple2('Lopf', '\uD835\uDD43'),
			_Utils_Tuple2('lopf', '\uD835\uDD5D'),
			_Utils_Tuple2('loplus', '⨭'),
			_Utils_Tuple2('lotimes', '⨴'),
			_Utils_Tuple2('lowast', '∗'),
			_Utils_Tuple2('lowbar', '_'),
			_Utils_Tuple2('LowerLeftArrow', '↙'),
			_Utils_Tuple2('LowerRightArrow', '↘'),
			_Utils_Tuple2('loz', '◊'),
			_Utils_Tuple2('lozenge', '◊'),
			_Utils_Tuple2('lozf', '⧫'),
			_Utils_Tuple2('lpar', '('),
			_Utils_Tuple2('lparlt', '⦓'),
			_Utils_Tuple2('lrarr', '⇆'),
			_Utils_Tuple2('lrcorner', '⌟'),
			_Utils_Tuple2('lrhar', '⇋'),
			_Utils_Tuple2('lrhard', '⥭'),
			_Utils_Tuple2('lrm', '\u200E'),
			_Utils_Tuple2('lrtri', '⊿'),
			_Utils_Tuple2('lsaquo', '‹'),
			_Utils_Tuple2('lscr', '\uD835\uDCC1'),
			_Utils_Tuple2('Lscr', 'ℒ'),
			_Utils_Tuple2('lsh', '↰'),
			_Utils_Tuple2('Lsh', '↰'),
			_Utils_Tuple2('lsim', '≲'),
			_Utils_Tuple2('lsime', '⪍'),
			_Utils_Tuple2('lsimg', '⪏'),
			_Utils_Tuple2('lsqb', '['),
			_Utils_Tuple2('lsquo', '‘'),
			_Utils_Tuple2('lsquor', '‚'),
			_Utils_Tuple2('Lstrok', 'Ł'),
			_Utils_Tuple2('lstrok', 'ł'),
			_Utils_Tuple2('ltcc', '⪦'),
			_Utils_Tuple2('ltcir', '⩹'),
			_Utils_Tuple2('lt', '<'),
			_Utils_Tuple2('LT', '<'),
			_Utils_Tuple2('Lt', '≪'),
			_Utils_Tuple2('ltdot', '⋖'),
			_Utils_Tuple2('lthree', '⋋'),
			_Utils_Tuple2('ltimes', '⋉'),
			_Utils_Tuple2('ltlarr', '⥶'),
			_Utils_Tuple2('ltquest', '⩻'),
			_Utils_Tuple2('ltri', '◃'),
			_Utils_Tuple2('ltrie', '⊴'),
			_Utils_Tuple2('ltrif', '◂'),
			_Utils_Tuple2('ltrPar', '⦖'),
			_Utils_Tuple2('lurdshar', '⥊'),
			_Utils_Tuple2('luruhar', '⥦'),
			_Utils_Tuple2('lvertneqq', '≨︀'),
			_Utils_Tuple2('lvnE', '≨︀'),
			_Utils_Tuple2('macr', '¯'),
			_Utils_Tuple2('male', '♂'),
			_Utils_Tuple2('malt', '✠'),
			_Utils_Tuple2('maltese', '✠'),
			_Utils_Tuple2('Map', '⤅'),
			_Utils_Tuple2('map', '↦'),
			_Utils_Tuple2('mapsto', '↦'),
			_Utils_Tuple2('mapstodown', '↧'),
			_Utils_Tuple2('mapstoleft', '↤'),
			_Utils_Tuple2('mapstoup', '↥'),
			_Utils_Tuple2('marker', '▮'),
			_Utils_Tuple2('mcomma', '⨩'),
			_Utils_Tuple2('Mcy', 'М'),
			_Utils_Tuple2('mcy', 'м'),
			_Utils_Tuple2('mdash', '—'),
			_Utils_Tuple2('mDDot', '∺'),
			_Utils_Tuple2('measuredangle', '∡'),
			_Utils_Tuple2('MediumSpace', '\u205F'),
			_Utils_Tuple2('Mellintrf', 'ℳ'),
			_Utils_Tuple2('Mfr', '\uD835\uDD10'),
			_Utils_Tuple2('mfr', '\uD835\uDD2A'),
			_Utils_Tuple2('mho', '℧'),
			_Utils_Tuple2('micro', 'µ'),
			_Utils_Tuple2('midast', '*'),
			_Utils_Tuple2('midcir', '⫰'),
			_Utils_Tuple2('mid', '∣'),
			_Utils_Tuple2('middot', '·'),
			_Utils_Tuple2('minusb', '⊟'),
			_Utils_Tuple2('minus', '−'),
			_Utils_Tuple2('minusd', '∸'),
			_Utils_Tuple2('minusdu', '⨪'),
			_Utils_Tuple2('MinusPlus', '∓'),
			_Utils_Tuple2('mlcp', '⫛'),
			_Utils_Tuple2('mldr', '…'),
			_Utils_Tuple2('mnplus', '∓'),
			_Utils_Tuple2('models', '⊧'),
			_Utils_Tuple2('Mopf', '\uD835\uDD44'),
			_Utils_Tuple2('mopf', '\uD835\uDD5E'),
			_Utils_Tuple2('mp', '∓'),
			_Utils_Tuple2('mscr', '\uD835\uDCC2'),
			_Utils_Tuple2('Mscr', 'ℳ'),
			_Utils_Tuple2('mstpos', '∾'),
			_Utils_Tuple2('Mu', 'Μ'),
			_Utils_Tuple2('mu', 'μ'),
			_Utils_Tuple2('multimap', '⊸'),
			_Utils_Tuple2('mumap', '⊸'),
			_Utils_Tuple2('nabla', '∇'),
			_Utils_Tuple2('Nacute', 'Ń'),
			_Utils_Tuple2('nacute', 'ń'),
			_Utils_Tuple2('nang', '∠⃒'),
			_Utils_Tuple2('nap', '≉'),
			_Utils_Tuple2('napE', '⩰̸'),
			_Utils_Tuple2('napid', '≋̸'),
			_Utils_Tuple2('napos', 'ŉ'),
			_Utils_Tuple2('napprox', '≉'),
			_Utils_Tuple2('natural', '♮'),
			_Utils_Tuple2('naturals', 'ℕ'),
			_Utils_Tuple2('natur', '♮'),
			_Utils_Tuple2('nbsp', '\u00A0'),
			_Utils_Tuple2('nbump', '≎̸'),
			_Utils_Tuple2('nbumpe', '≏̸'),
			_Utils_Tuple2('ncap', '⩃'),
			_Utils_Tuple2('Ncaron', 'Ň'),
			_Utils_Tuple2('ncaron', 'ň'),
			_Utils_Tuple2('Ncedil', 'Ņ'),
			_Utils_Tuple2('ncedil', 'ņ'),
			_Utils_Tuple2('ncong', '≇'),
			_Utils_Tuple2('ncongdot', '⩭̸'),
			_Utils_Tuple2('ncup', '⩂'),
			_Utils_Tuple2('Ncy', 'Н'),
			_Utils_Tuple2('ncy', 'н'),
			_Utils_Tuple2('ndash', '–'),
			_Utils_Tuple2('nearhk', '⤤'),
			_Utils_Tuple2('nearr', '↗'),
			_Utils_Tuple2('neArr', '⇗'),
			_Utils_Tuple2('nearrow', '↗'),
			_Utils_Tuple2('ne', '≠'),
			_Utils_Tuple2('nedot', '≐̸'),
			_Utils_Tuple2('NegativeMediumSpace', '\u200B'),
			_Utils_Tuple2('NegativeThickSpace', '\u200B'),
			_Utils_Tuple2('NegativeThinSpace', '\u200B'),
			_Utils_Tuple2('NegativeVeryThinSpace', '\u200B'),
			_Utils_Tuple2('nequiv', '≢'),
			_Utils_Tuple2('nesear', '⤨'),
			_Utils_Tuple2('nesim', '≂̸'),
			_Utils_Tuple2('NestedGreaterGreater', '≫'),
			_Utils_Tuple2('NestedLessLess', '≪'),
			_Utils_Tuple2('NewLine', '\n'),
			_Utils_Tuple2('nexist', '∄'),
			_Utils_Tuple2('nexists', '∄'),
			_Utils_Tuple2('Nfr', '\uD835\uDD11'),
			_Utils_Tuple2('nfr', '\uD835\uDD2B'),
			_Utils_Tuple2('ngE', '≧̸'),
			_Utils_Tuple2('nge', '≱'),
			_Utils_Tuple2('ngeq', '≱'),
			_Utils_Tuple2('ngeqq', '≧̸'),
			_Utils_Tuple2('ngeqslant', '⩾̸'),
			_Utils_Tuple2('nges', '⩾̸'),
			_Utils_Tuple2('nGg', '⋙̸'),
			_Utils_Tuple2('ngsim', '≵'),
			_Utils_Tuple2('nGt', '≫⃒'),
			_Utils_Tuple2('ngt', '≯'),
			_Utils_Tuple2('ngtr', '≯'),
			_Utils_Tuple2('nGtv', '≫̸'),
			_Utils_Tuple2('nharr', '↮'),
			_Utils_Tuple2('nhArr', '⇎'),
			_Utils_Tuple2('nhpar', '⫲'),
			_Utils_Tuple2('ni', '∋'),
			_Utils_Tuple2('nis', '⋼'),
			_Utils_Tuple2('nisd', '⋺'),
			_Utils_Tuple2('niv', '∋'),
			_Utils_Tuple2('NJcy', 'Њ'),
			_Utils_Tuple2('njcy', 'њ'),
			_Utils_Tuple2('nlarr', '↚'),
			_Utils_Tuple2('nlArr', '⇍'),
			_Utils_Tuple2('nldr', '‥'),
			_Utils_Tuple2('nlE', '≦̸'),
			_Utils_Tuple2('nle', '≰'),
			_Utils_Tuple2('nleftarrow', '↚'),
			_Utils_Tuple2('nLeftarrow', '⇍'),
			_Utils_Tuple2('nleftrightarrow', '↮'),
			_Utils_Tuple2('nLeftrightarrow', '⇎'),
			_Utils_Tuple2('nleq', '≰'),
			_Utils_Tuple2('nleqq', '≦̸'),
			_Utils_Tuple2('nleqslant', '⩽̸'),
			_Utils_Tuple2('nles', '⩽̸'),
			_Utils_Tuple2('nless', '≮'),
			_Utils_Tuple2('nLl', '⋘̸'),
			_Utils_Tuple2('nlsim', '≴'),
			_Utils_Tuple2('nLt', '≪⃒'),
			_Utils_Tuple2('nlt', '≮'),
			_Utils_Tuple2('nltri', '⋪'),
			_Utils_Tuple2('nltrie', '⋬'),
			_Utils_Tuple2('nLtv', '≪̸'),
			_Utils_Tuple2('nmid', '∤'),
			_Utils_Tuple2('NoBreak', '\u2060'),
			_Utils_Tuple2('NonBreakingSpace', '\u00A0'),
			_Utils_Tuple2('nopf', '\uD835\uDD5F'),
			_Utils_Tuple2('Nopf', 'ℕ'),
			_Utils_Tuple2('Not', '⫬'),
			_Utils_Tuple2('not', '¬'),
			_Utils_Tuple2('NotCongruent', '≢'),
			_Utils_Tuple2('NotCupCap', '≭'),
			_Utils_Tuple2('NotDoubleVerticalBar', '∦'),
			_Utils_Tuple2('NotElement', '∉'),
			_Utils_Tuple2('NotEqual', '≠'),
			_Utils_Tuple2('NotEqualTilde', '≂̸'),
			_Utils_Tuple2('NotExists', '∄'),
			_Utils_Tuple2('NotGreater', '≯'),
			_Utils_Tuple2('NotGreaterEqual', '≱'),
			_Utils_Tuple2('NotGreaterFullEqual', '≧̸'),
			_Utils_Tuple2('NotGreaterGreater', '≫̸'),
			_Utils_Tuple2('NotGreaterLess', '≹'),
			_Utils_Tuple2('NotGreaterSlantEqual', '⩾̸'),
			_Utils_Tuple2('NotGreaterTilde', '≵'),
			_Utils_Tuple2('NotHumpDownHump', '≎̸'),
			_Utils_Tuple2('NotHumpEqual', '≏̸'),
			_Utils_Tuple2('notin', '∉'),
			_Utils_Tuple2('notindot', '⋵̸'),
			_Utils_Tuple2('notinE', '⋹̸'),
			_Utils_Tuple2('notinva', '∉'),
			_Utils_Tuple2('notinvb', '⋷'),
			_Utils_Tuple2('notinvc', '⋶'),
			_Utils_Tuple2('NotLeftTriangleBar', '⧏̸'),
			_Utils_Tuple2('NotLeftTriangle', '⋪'),
			_Utils_Tuple2('NotLeftTriangleEqual', '⋬'),
			_Utils_Tuple2('NotLess', '≮'),
			_Utils_Tuple2('NotLessEqual', '≰'),
			_Utils_Tuple2('NotLessGreater', '≸'),
			_Utils_Tuple2('NotLessLess', '≪̸'),
			_Utils_Tuple2('NotLessSlantEqual', '⩽̸'),
			_Utils_Tuple2('NotLessTilde', '≴'),
			_Utils_Tuple2('NotNestedGreaterGreater', '⪢̸'),
			_Utils_Tuple2('NotNestedLessLess', '⪡̸'),
			_Utils_Tuple2('notni', '∌'),
			_Utils_Tuple2('notniva', '∌'),
			_Utils_Tuple2('notnivb', '⋾'),
			_Utils_Tuple2('notnivc', '⋽'),
			_Utils_Tuple2('NotPrecedes', '⊀'),
			_Utils_Tuple2('NotPrecedesEqual', '⪯̸'),
			_Utils_Tuple2('NotPrecedesSlantEqual', '⋠'),
			_Utils_Tuple2('NotReverseElement', '∌'),
			_Utils_Tuple2('NotRightTriangleBar', '⧐̸'),
			_Utils_Tuple2('NotRightTriangle', '⋫'),
			_Utils_Tuple2('NotRightTriangleEqual', '⋭'),
			_Utils_Tuple2('NotSquareSubset', '⊏̸'),
			_Utils_Tuple2('NotSquareSubsetEqual', '⋢'),
			_Utils_Tuple2('NotSquareSuperset', '⊐̸'),
			_Utils_Tuple2('NotSquareSupersetEqual', '⋣'),
			_Utils_Tuple2('NotSubset', '⊂⃒'),
			_Utils_Tuple2('NotSubsetEqual', '⊈'),
			_Utils_Tuple2('NotSucceeds', '⊁'),
			_Utils_Tuple2('NotSucceedsEqual', '⪰̸'),
			_Utils_Tuple2('NotSucceedsSlantEqual', '⋡'),
			_Utils_Tuple2('NotSucceedsTilde', '≿̸'),
			_Utils_Tuple2('NotSuperset', '⊃⃒'),
			_Utils_Tuple2('NotSupersetEqual', '⊉'),
			_Utils_Tuple2('NotTilde', '≁'),
			_Utils_Tuple2('NotTildeEqual', '≄'),
			_Utils_Tuple2('NotTildeFullEqual', '≇'),
			_Utils_Tuple2('NotTildeTilde', '≉'),
			_Utils_Tuple2('NotVerticalBar', '∤'),
			_Utils_Tuple2('nparallel', '∦'),
			_Utils_Tuple2('npar', '∦'),
			_Utils_Tuple2('nparsl', '⫽⃥'),
			_Utils_Tuple2('npart', '∂̸'),
			_Utils_Tuple2('npolint', '⨔'),
			_Utils_Tuple2('npr', '⊀'),
			_Utils_Tuple2('nprcue', '⋠'),
			_Utils_Tuple2('nprec', '⊀'),
			_Utils_Tuple2('npreceq', '⪯̸'),
			_Utils_Tuple2('npre', '⪯̸'),
			_Utils_Tuple2('nrarrc', '⤳̸'),
			_Utils_Tuple2('nrarr', '↛'),
			_Utils_Tuple2('nrArr', '⇏'),
			_Utils_Tuple2('nrarrw', '↝̸'),
			_Utils_Tuple2('nrightarrow', '↛'),
			_Utils_Tuple2('nRightarrow', '⇏'),
			_Utils_Tuple2('nrtri', '⋫'),
			_Utils_Tuple2('nrtrie', '⋭'),
			_Utils_Tuple2('nsc', '⊁'),
			_Utils_Tuple2('nsccue', '⋡'),
			_Utils_Tuple2('nsce', '⪰̸'),
			_Utils_Tuple2('Nscr', '\uD835\uDCA9'),
			_Utils_Tuple2('nscr', '\uD835\uDCC3'),
			_Utils_Tuple2('nshortmid', '∤'),
			_Utils_Tuple2('nshortparallel', '∦'),
			_Utils_Tuple2('nsim', '≁'),
			_Utils_Tuple2('nsime', '≄'),
			_Utils_Tuple2('nsimeq', '≄'),
			_Utils_Tuple2('nsmid', '∤'),
			_Utils_Tuple2('nspar', '∦'),
			_Utils_Tuple2('nsqsube', '⋢'),
			_Utils_Tuple2('nsqsupe', '⋣'),
			_Utils_Tuple2('nsub', '⊄'),
			_Utils_Tuple2('nsubE', '⫅̸'),
			_Utils_Tuple2('nsube', '⊈'),
			_Utils_Tuple2('nsubset', '⊂⃒'),
			_Utils_Tuple2('nsubseteq', '⊈'),
			_Utils_Tuple2('nsubseteqq', '⫅̸'),
			_Utils_Tuple2('nsucc', '⊁'),
			_Utils_Tuple2('nsucceq', '⪰̸'),
			_Utils_Tuple2('nsup', '⊅'),
			_Utils_Tuple2('nsupE', '⫆̸'),
			_Utils_Tuple2('nsupe', '⊉'),
			_Utils_Tuple2('nsupset', '⊃⃒'),
			_Utils_Tuple2('nsupseteq', '⊉'),
			_Utils_Tuple2('nsupseteqq', '⫆̸'),
			_Utils_Tuple2('ntgl', '≹'),
			_Utils_Tuple2('Ntilde', 'Ñ'),
			_Utils_Tuple2('ntilde', 'ñ'),
			_Utils_Tuple2('ntlg', '≸'),
			_Utils_Tuple2('ntriangleleft', '⋪'),
			_Utils_Tuple2('ntrianglelefteq', '⋬'),
			_Utils_Tuple2('ntriangleright', '⋫'),
			_Utils_Tuple2('ntrianglerighteq', '⋭'),
			_Utils_Tuple2('Nu', 'Ν'),
			_Utils_Tuple2('nu', 'ν'),
			_Utils_Tuple2('num', '#'),
			_Utils_Tuple2('numero', '№'),
			_Utils_Tuple2('numsp', '\u2007'),
			_Utils_Tuple2('nvap', '≍⃒'),
			_Utils_Tuple2('nvdash', '⊬'),
			_Utils_Tuple2('nvDash', '⊭'),
			_Utils_Tuple2('nVdash', '⊮'),
			_Utils_Tuple2('nVDash', '⊯'),
			_Utils_Tuple2('nvge', '≥⃒'),
			_Utils_Tuple2('nvgt', '>⃒'),
			_Utils_Tuple2('nvHarr', '⤄'),
			_Utils_Tuple2('nvinfin', '⧞'),
			_Utils_Tuple2('nvlArr', '⤂'),
			_Utils_Tuple2('nvle', '≤⃒'),
			_Utils_Tuple2('nvlt', '<⃒'),
			_Utils_Tuple2('nvltrie', '⊴⃒'),
			_Utils_Tuple2('nvrArr', '⤃'),
			_Utils_Tuple2('nvrtrie', '⊵⃒'),
			_Utils_Tuple2('nvsim', '∼⃒'),
			_Utils_Tuple2('nwarhk', '⤣'),
			_Utils_Tuple2('nwarr', '↖'),
			_Utils_Tuple2('nwArr', '⇖'),
			_Utils_Tuple2('nwarrow', '↖'),
			_Utils_Tuple2('nwnear', '⤧'),
			_Utils_Tuple2('Oacute', 'Ó'),
			_Utils_Tuple2('oacute', 'ó'),
			_Utils_Tuple2('oast', '⊛'),
			_Utils_Tuple2('Ocirc', 'Ô'),
			_Utils_Tuple2('ocirc', 'ô'),
			_Utils_Tuple2('ocir', '⊚'),
			_Utils_Tuple2('Ocy', 'О'),
			_Utils_Tuple2('ocy', 'о'),
			_Utils_Tuple2('odash', '⊝'),
			_Utils_Tuple2('Odblac', 'Ő'),
			_Utils_Tuple2('odblac', 'ő'),
			_Utils_Tuple2('odiv', '⨸'),
			_Utils_Tuple2('odot', '⊙'),
			_Utils_Tuple2('odsold', '⦼'),
			_Utils_Tuple2('OElig', 'Œ'),
			_Utils_Tuple2('oelig', 'œ'),
			_Utils_Tuple2('ofcir', '⦿'),
			_Utils_Tuple2('Ofr', '\uD835\uDD12'),
			_Utils_Tuple2('ofr', '\uD835\uDD2C'),
			_Utils_Tuple2('ogon', '˛'),
			_Utils_Tuple2('Ograve', 'Ò'),
			_Utils_Tuple2('ograve', 'ò'),
			_Utils_Tuple2('ogt', '⧁'),
			_Utils_Tuple2('ohbar', '⦵'),
			_Utils_Tuple2('ohm', 'Ω'),
			_Utils_Tuple2('oint', '∮'),
			_Utils_Tuple2('olarr', '↺'),
			_Utils_Tuple2('olcir', '⦾'),
			_Utils_Tuple2('olcross', '⦻'),
			_Utils_Tuple2('oline', '‾'),
			_Utils_Tuple2('olt', '⧀'),
			_Utils_Tuple2('Omacr', 'Ō'),
			_Utils_Tuple2('omacr', 'ō'),
			_Utils_Tuple2('Omega', 'Ω'),
			_Utils_Tuple2('omega', 'ω'),
			_Utils_Tuple2('Omicron', 'Ο'),
			_Utils_Tuple2('omicron', 'ο'),
			_Utils_Tuple2('omid', '⦶'),
			_Utils_Tuple2('ominus', '⊖'),
			_Utils_Tuple2('Oopf', '\uD835\uDD46'),
			_Utils_Tuple2('oopf', '\uD835\uDD60'),
			_Utils_Tuple2('opar', '⦷'),
			_Utils_Tuple2('OpenCurlyDoubleQuote', '“'),
			_Utils_Tuple2('OpenCurlyQuote', '‘'),
			_Utils_Tuple2('operp', '⦹'),
			_Utils_Tuple2('oplus', '⊕'),
			_Utils_Tuple2('orarr', '↻'),
			_Utils_Tuple2('Or', '⩔'),
			_Utils_Tuple2('or', '∨'),
			_Utils_Tuple2('ord', '⩝'),
			_Utils_Tuple2('order', 'ℴ'),
			_Utils_Tuple2('orderof', 'ℴ'),
			_Utils_Tuple2('ordf', 'ª'),
			_Utils_Tuple2('ordm', 'º'),
			_Utils_Tuple2('origof', '⊶'),
			_Utils_Tuple2('oror', '⩖'),
			_Utils_Tuple2('orslope', '⩗'),
			_Utils_Tuple2('orv', '⩛'),
			_Utils_Tuple2('oS', 'Ⓢ'),
			_Utils_Tuple2('Oscr', '\uD835\uDCAA'),
			_Utils_Tuple2('oscr', 'ℴ'),
			_Utils_Tuple2('Oslash', 'Ø'),
			_Utils_Tuple2('oslash', 'ø'),
			_Utils_Tuple2('osol', '⊘'),
			_Utils_Tuple2('Otilde', 'Õ'),
			_Utils_Tuple2('otilde', 'õ'),
			_Utils_Tuple2('otimesas', '⨶'),
			_Utils_Tuple2('Otimes', '⨷'),
			_Utils_Tuple2('otimes', '⊗'),
			_Utils_Tuple2('Ouml', 'Ö'),
			_Utils_Tuple2('ouml', 'ö'),
			_Utils_Tuple2('ovbar', '⌽'),
			_Utils_Tuple2('OverBar', '‾'),
			_Utils_Tuple2('OverBrace', '⏞'),
			_Utils_Tuple2('OverBracket', '⎴'),
			_Utils_Tuple2('OverParenthesis', '⏜'),
			_Utils_Tuple2('para', '¶'),
			_Utils_Tuple2('parallel', '∥'),
			_Utils_Tuple2('par', '∥'),
			_Utils_Tuple2('parsim', '⫳'),
			_Utils_Tuple2('parsl', '⫽'),
			_Utils_Tuple2('part', '∂'),
			_Utils_Tuple2('PartialD', '∂'),
			_Utils_Tuple2('Pcy', 'П'),
			_Utils_Tuple2('pcy', 'п'),
			_Utils_Tuple2('percnt', '%'),
			_Utils_Tuple2('period', '.'),
			_Utils_Tuple2('permil', '‰'),
			_Utils_Tuple2('perp', '⊥'),
			_Utils_Tuple2('pertenk', '‱'),
			_Utils_Tuple2('Pfr', '\uD835\uDD13'),
			_Utils_Tuple2('pfr', '\uD835\uDD2D'),
			_Utils_Tuple2('Phi', 'Φ'),
			_Utils_Tuple2('phi', 'φ'),
			_Utils_Tuple2('phiv', 'ϕ'),
			_Utils_Tuple2('phmmat', 'ℳ'),
			_Utils_Tuple2('phone', '☎'),
			_Utils_Tuple2('Pi', 'Π'),
			_Utils_Tuple2('pi', 'π'),
			_Utils_Tuple2('pitchfork', '⋔'),
			_Utils_Tuple2('piv', 'ϖ'),
			_Utils_Tuple2('planck', 'ℏ'),
			_Utils_Tuple2('planckh', 'ℎ'),
			_Utils_Tuple2('plankv', 'ℏ'),
			_Utils_Tuple2('plusacir', '⨣'),
			_Utils_Tuple2('plusb', '⊞'),
			_Utils_Tuple2('pluscir', '⨢'),
			_Utils_Tuple2('plus', '+'),
			_Utils_Tuple2('plusdo', '∔'),
			_Utils_Tuple2('plusdu', '⨥'),
			_Utils_Tuple2('pluse', '⩲'),
			_Utils_Tuple2('PlusMinus', '±'),
			_Utils_Tuple2('plusmn', '±'),
			_Utils_Tuple2('plussim', '⨦'),
			_Utils_Tuple2('plustwo', '⨧'),
			_Utils_Tuple2('pm', '±'),
			_Utils_Tuple2('Poincareplane', 'ℌ'),
			_Utils_Tuple2('pointint', '⨕'),
			_Utils_Tuple2('popf', '\uD835\uDD61'),
			_Utils_Tuple2('Popf', 'ℙ'),
			_Utils_Tuple2('pound', '£'),
			_Utils_Tuple2('prap', '⪷'),
			_Utils_Tuple2('Pr', '⪻'),
			_Utils_Tuple2('pr', '≺'),
			_Utils_Tuple2('prcue', '≼'),
			_Utils_Tuple2('precapprox', '⪷'),
			_Utils_Tuple2('prec', '≺'),
			_Utils_Tuple2('preccurlyeq', '≼'),
			_Utils_Tuple2('Precedes', '≺'),
			_Utils_Tuple2('PrecedesEqual', '⪯'),
			_Utils_Tuple2('PrecedesSlantEqual', '≼'),
			_Utils_Tuple2('PrecedesTilde', '≾'),
			_Utils_Tuple2('preceq', '⪯'),
			_Utils_Tuple2('precnapprox', '⪹'),
			_Utils_Tuple2('precneqq', '⪵'),
			_Utils_Tuple2('precnsim', '⋨'),
			_Utils_Tuple2('pre', '⪯'),
			_Utils_Tuple2('prE', '⪳'),
			_Utils_Tuple2('precsim', '≾'),
			_Utils_Tuple2('prime', '′'),
			_Utils_Tuple2('Prime', '″'),
			_Utils_Tuple2('primes', 'ℙ'),
			_Utils_Tuple2('prnap', '⪹'),
			_Utils_Tuple2('prnE', '⪵'),
			_Utils_Tuple2('prnsim', '⋨'),
			_Utils_Tuple2('prod', '∏'),
			_Utils_Tuple2('Product', '∏'),
			_Utils_Tuple2('profalar', '⌮'),
			_Utils_Tuple2('profline', '⌒'),
			_Utils_Tuple2('profsurf', '⌓'),
			_Utils_Tuple2('prop', '∝'),
			_Utils_Tuple2('Proportional', '∝'),
			_Utils_Tuple2('Proportion', '∷'),
			_Utils_Tuple2('propto', '∝'),
			_Utils_Tuple2('prsim', '≾'),
			_Utils_Tuple2('prurel', '⊰'),
			_Utils_Tuple2('Pscr', '\uD835\uDCAB'),
			_Utils_Tuple2('pscr', '\uD835\uDCC5'),
			_Utils_Tuple2('Psi', 'Ψ'),
			_Utils_Tuple2('psi', 'ψ'),
			_Utils_Tuple2('puncsp', '\u2008'),
			_Utils_Tuple2('Qfr', '\uD835\uDD14'),
			_Utils_Tuple2('qfr', '\uD835\uDD2E'),
			_Utils_Tuple2('qint', '⨌'),
			_Utils_Tuple2('qopf', '\uD835\uDD62'),
			_Utils_Tuple2('Qopf', 'ℚ'),
			_Utils_Tuple2('qprime', '⁗'),
			_Utils_Tuple2('Qscr', '\uD835\uDCAC'),
			_Utils_Tuple2('qscr', '\uD835\uDCC6'),
			_Utils_Tuple2('quaternions', 'ℍ'),
			_Utils_Tuple2('quatint', '⨖'),
			_Utils_Tuple2('quest', '?'),
			_Utils_Tuple2('questeq', '≟'),
			_Utils_Tuple2('quot', '\"'),
			_Utils_Tuple2('QUOT', '\"'),
			_Utils_Tuple2('rAarr', '⇛'),
			_Utils_Tuple2('race', '∽̱'),
			_Utils_Tuple2('Racute', 'Ŕ'),
			_Utils_Tuple2('racute', 'ŕ'),
			_Utils_Tuple2('radic', '√'),
			_Utils_Tuple2('raemptyv', '⦳'),
			_Utils_Tuple2('rang', '⟩'),
			_Utils_Tuple2('Rang', '⟫'),
			_Utils_Tuple2('rangd', '⦒'),
			_Utils_Tuple2('range', '⦥'),
			_Utils_Tuple2('rangle', '⟩'),
			_Utils_Tuple2('raquo', '»'),
			_Utils_Tuple2('rarrap', '⥵'),
			_Utils_Tuple2('rarrb', '⇥'),
			_Utils_Tuple2('rarrbfs', '⤠'),
			_Utils_Tuple2('rarrc', '⤳'),
			_Utils_Tuple2('rarr', '→'),
			_Utils_Tuple2('Rarr', '↠'),
			_Utils_Tuple2('rArr', '⇒'),
			_Utils_Tuple2('rarrfs', '⤞'),
			_Utils_Tuple2('rarrhk', '↪'),
			_Utils_Tuple2('rarrlp', '↬'),
			_Utils_Tuple2('rarrpl', '⥅'),
			_Utils_Tuple2('rarrsim', '⥴'),
			_Utils_Tuple2('Rarrtl', '⤖'),
			_Utils_Tuple2('rarrtl', '↣'),
			_Utils_Tuple2('rarrw', '↝'),
			_Utils_Tuple2('ratail', '⤚'),
			_Utils_Tuple2('rAtail', '⤜'),
			_Utils_Tuple2('ratio', '∶'),
			_Utils_Tuple2('rationals', 'ℚ'),
			_Utils_Tuple2('rbarr', '⤍'),
			_Utils_Tuple2('rBarr', '⤏'),
			_Utils_Tuple2('RBarr', '⤐'),
			_Utils_Tuple2('rbbrk', '❳'),
			_Utils_Tuple2('rbrace', '}'),
			_Utils_Tuple2('rbrack', ']'),
			_Utils_Tuple2('rbrke', '⦌'),
			_Utils_Tuple2('rbrksld', '⦎'),
			_Utils_Tuple2('rbrkslu', '⦐'),
			_Utils_Tuple2('Rcaron', 'Ř'),
			_Utils_Tuple2('rcaron', 'ř'),
			_Utils_Tuple2('Rcedil', 'Ŗ'),
			_Utils_Tuple2('rcedil', 'ŗ'),
			_Utils_Tuple2('rceil', '⌉'),
			_Utils_Tuple2('rcub', '}'),
			_Utils_Tuple2('Rcy', 'Р'),
			_Utils_Tuple2('rcy', 'р'),
			_Utils_Tuple2('rdca', '⤷'),
			_Utils_Tuple2('rdldhar', '⥩'),
			_Utils_Tuple2('rdquo', '”'),
			_Utils_Tuple2('rdquor', '”'),
			_Utils_Tuple2('rdsh', '↳'),
			_Utils_Tuple2('real', 'ℜ'),
			_Utils_Tuple2('realine', 'ℛ'),
			_Utils_Tuple2('realpart', 'ℜ'),
			_Utils_Tuple2('reals', 'ℝ'),
			_Utils_Tuple2('Re', 'ℜ'),
			_Utils_Tuple2('rect', '▭'),
			_Utils_Tuple2('reg', '®'),
			_Utils_Tuple2('REG', '®'),
			_Utils_Tuple2('ReverseElement', '∋'),
			_Utils_Tuple2('ReverseEquilibrium', '⇋'),
			_Utils_Tuple2('ReverseUpEquilibrium', '⥯'),
			_Utils_Tuple2('rfisht', '⥽'),
			_Utils_Tuple2('rfloor', '⌋'),
			_Utils_Tuple2('rfr', '\uD835\uDD2F'),
			_Utils_Tuple2('Rfr', 'ℜ'),
			_Utils_Tuple2('rHar', '⥤'),
			_Utils_Tuple2('rhard', '⇁'),
			_Utils_Tuple2('rharu', '⇀'),
			_Utils_Tuple2('rharul', '⥬'),
			_Utils_Tuple2('Rho', 'Ρ'),
			_Utils_Tuple2('rho', 'ρ'),
			_Utils_Tuple2('rhov', 'ϱ'),
			_Utils_Tuple2('RightAngleBracket', '⟩'),
			_Utils_Tuple2('RightArrowBar', '⇥'),
			_Utils_Tuple2('rightarrow', '→'),
			_Utils_Tuple2('RightArrow', '→'),
			_Utils_Tuple2('Rightarrow', '⇒'),
			_Utils_Tuple2('RightArrowLeftArrow', '⇄'),
			_Utils_Tuple2('rightarrowtail', '↣'),
			_Utils_Tuple2('RightCeiling', '⌉'),
			_Utils_Tuple2('RightDoubleBracket', '⟧'),
			_Utils_Tuple2('RightDownTeeVector', '⥝'),
			_Utils_Tuple2('RightDownVectorBar', '⥕'),
			_Utils_Tuple2('RightDownVector', '⇂'),
			_Utils_Tuple2('RightFloor', '⌋'),
			_Utils_Tuple2('rightharpoondown', '⇁'),
			_Utils_Tuple2('rightharpoonup', '⇀'),
			_Utils_Tuple2('rightleftarrows', '⇄'),
			_Utils_Tuple2('rightleftharpoons', '⇌'),
			_Utils_Tuple2('rightrightarrows', '⇉'),
			_Utils_Tuple2('rightsquigarrow', '↝'),
			_Utils_Tuple2('RightTeeArrow', '↦'),
			_Utils_Tuple2('RightTee', '⊢'),
			_Utils_Tuple2('RightTeeVector', '⥛'),
			_Utils_Tuple2('rightthreetimes', '⋌'),
			_Utils_Tuple2('RightTriangleBar', '⧐'),
			_Utils_Tuple2('RightTriangle', '⊳'),
			_Utils_Tuple2('RightTriangleEqual', '⊵'),
			_Utils_Tuple2('RightUpDownVector', '⥏'),
			_Utils_Tuple2('RightUpTeeVector', '⥜'),
			_Utils_Tuple2('RightUpVectorBar', '⥔'),
			_Utils_Tuple2('RightUpVector', '↾'),
			_Utils_Tuple2('RightVectorBar', '⥓'),
			_Utils_Tuple2('RightVector', '⇀'),
			_Utils_Tuple2('ring', '˚'),
			_Utils_Tuple2('risingdotseq', '≓'),
			_Utils_Tuple2('rlarr', '⇄'),
			_Utils_Tuple2('rlhar', '⇌'),
			_Utils_Tuple2('rlm', '\u200F'),
			_Utils_Tuple2('rmoustache', '⎱'),
			_Utils_Tuple2('rmoust', '⎱'),
			_Utils_Tuple2('rnmid', '⫮'),
			_Utils_Tuple2('roang', '⟭'),
			_Utils_Tuple2('roarr', '⇾'),
			_Utils_Tuple2('robrk', '⟧'),
			_Utils_Tuple2('ropar', '⦆'),
			_Utils_Tuple2('ropf', '\uD835\uDD63'),
			_Utils_Tuple2('Ropf', 'ℝ'),
			_Utils_Tuple2('roplus', '⨮'),
			_Utils_Tuple2('rotimes', '⨵'),
			_Utils_Tuple2('RoundImplies', '⥰'),
			_Utils_Tuple2('rpar', ')'),
			_Utils_Tuple2('rpargt', '⦔'),
			_Utils_Tuple2('rppolint', '⨒'),
			_Utils_Tuple2('rrarr', '⇉'),
			_Utils_Tuple2('Rrightarrow', '⇛'),
			_Utils_Tuple2('rsaquo', '›'),
			_Utils_Tuple2('rscr', '\uD835\uDCC7'),
			_Utils_Tuple2('Rscr', 'ℛ'),
			_Utils_Tuple2('rsh', '↱'),
			_Utils_Tuple2('Rsh', '↱'),
			_Utils_Tuple2('rsqb', ']'),
			_Utils_Tuple2('rsquo', '’'),
			_Utils_Tuple2('rsquor', '’'),
			_Utils_Tuple2('rthree', '⋌'),
			_Utils_Tuple2('rtimes', '⋊'),
			_Utils_Tuple2('rtri', '▹'),
			_Utils_Tuple2('rtrie', '⊵'),
			_Utils_Tuple2('rtrif', '▸'),
			_Utils_Tuple2('rtriltri', '⧎'),
			_Utils_Tuple2('RuleDelayed', '⧴'),
			_Utils_Tuple2('ruluhar', '⥨'),
			_Utils_Tuple2('rx', '℞'),
			_Utils_Tuple2('Sacute', 'Ś'),
			_Utils_Tuple2('sacute', 'ś'),
			_Utils_Tuple2('sbquo', '‚'),
			_Utils_Tuple2('scap', '⪸'),
			_Utils_Tuple2('Scaron', 'Š'),
			_Utils_Tuple2('scaron', 'š'),
			_Utils_Tuple2('Sc', '⪼'),
			_Utils_Tuple2('sc', '≻'),
			_Utils_Tuple2('sccue', '≽'),
			_Utils_Tuple2('sce', '⪰'),
			_Utils_Tuple2('scE', '⪴'),
			_Utils_Tuple2('Scedil', 'Ş'),
			_Utils_Tuple2('scedil', 'ş'),
			_Utils_Tuple2('Scirc', 'Ŝ'),
			_Utils_Tuple2('scirc', 'ŝ'),
			_Utils_Tuple2('scnap', '⪺'),
			_Utils_Tuple2('scnE', '⪶'),
			_Utils_Tuple2('scnsim', '⋩'),
			_Utils_Tuple2('scpolint', '⨓'),
			_Utils_Tuple2('scsim', '≿'),
			_Utils_Tuple2('Scy', 'С'),
			_Utils_Tuple2('scy', 'с'),
			_Utils_Tuple2('sdotb', '⊡'),
			_Utils_Tuple2('sdot', '⋅'),
			_Utils_Tuple2('sdote', '⩦'),
			_Utils_Tuple2('searhk', '⤥'),
			_Utils_Tuple2('searr', '↘'),
			_Utils_Tuple2('seArr', '⇘'),
			_Utils_Tuple2('searrow', '↘'),
			_Utils_Tuple2('sect', '§'),
			_Utils_Tuple2('semi', ';'),
			_Utils_Tuple2('seswar', '⤩'),
			_Utils_Tuple2('setminus', '∖'),
			_Utils_Tuple2('setmn', '∖'),
			_Utils_Tuple2('sext', '✶'),
			_Utils_Tuple2('Sfr', '\uD835\uDD16'),
			_Utils_Tuple2('sfr', '\uD835\uDD30'),
			_Utils_Tuple2('sfrown', '⌢'),
			_Utils_Tuple2('sharp', '♯'),
			_Utils_Tuple2('SHCHcy', 'Щ'),
			_Utils_Tuple2('shchcy', 'щ'),
			_Utils_Tuple2('SHcy', 'Ш'),
			_Utils_Tuple2('shcy', 'ш'),
			_Utils_Tuple2('ShortDownArrow', '↓'),
			_Utils_Tuple2('ShortLeftArrow', '←'),
			_Utils_Tuple2('shortmid', '∣'),
			_Utils_Tuple2('shortparallel', '∥'),
			_Utils_Tuple2('ShortRightArrow', '→'),
			_Utils_Tuple2('ShortUpArrow', '↑'),
			_Utils_Tuple2('shy', '\u00AD'),
			_Utils_Tuple2('Sigma', 'Σ'),
			_Utils_Tuple2('sigma', 'σ'),
			_Utils_Tuple2('sigmaf', 'ς'),
			_Utils_Tuple2('sigmav', 'ς'),
			_Utils_Tuple2('sim', '∼'),
			_Utils_Tuple2('simdot', '⩪'),
			_Utils_Tuple2('sime', '≃'),
			_Utils_Tuple2('simeq', '≃'),
			_Utils_Tuple2('simg', '⪞'),
			_Utils_Tuple2('simgE', '⪠'),
			_Utils_Tuple2('siml', '⪝'),
			_Utils_Tuple2('simlE', '⪟'),
			_Utils_Tuple2('simne', '≆'),
			_Utils_Tuple2('simplus', '⨤'),
			_Utils_Tuple2('simrarr', '⥲'),
			_Utils_Tuple2('slarr', '←'),
			_Utils_Tuple2('SmallCircle', '∘'),
			_Utils_Tuple2('smallsetminus', '∖'),
			_Utils_Tuple2('smashp', '⨳'),
			_Utils_Tuple2('smeparsl', '⧤'),
			_Utils_Tuple2('smid', '∣'),
			_Utils_Tuple2('smile', '⌣'),
			_Utils_Tuple2('smt', '⪪'),
			_Utils_Tuple2('smte', '⪬'),
			_Utils_Tuple2('smtes', '⪬︀'),
			_Utils_Tuple2('SOFTcy', 'Ь'),
			_Utils_Tuple2('softcy', 'ь'),
			_Utils_Tuple2('solbar', '⌿'),
			_Utils_Tuple2('solb', '⧄'),
			_Utils_Tuple2('sol', '/'),
			_Utils_Tuple2('Sopf', '\uD835\uDD4A'),
			_Utils_Tuple2('sopf', '\uD835\uDD64'),
			_Utils_Tuple2('spades', '♠'),
			_Utils_Tuple2('spadesuit', '♠'),
			_Utils_Tuple2('spar', '∥'),
			_Utils_Tuple2('sqcap', '⊓'),
			_Utils_Tuple2('sqcaps', '⊓︀'),
			_Utils_Tuple2('sqcup', '⊔'),
			_Utils_Tuple2('sqcups', '⊔︀'),
			_Utils_Tuple2('Sqrt', '√'),
			_Utils_Tuple2('sqsub', '⊏'),
			_Utils_Tuple2('sqsube', '⊑'),
			_Utils_Tuple2('sqsubset', '⊏'),
			_Utils_Tuple2('sqsubseteq', '⊑'),
			_Utils_Tuple2('sqsup', '⊐'),
			_Utils_Tuple2('sqsupe', '⊒'),
			_Utils_Tuple2('sqsupset', '⊐'),
			_Utils_Tuple2('sqsupseteq', '⊒'),
			_Utils_Tuple2('square', '□'),
			_Utils_Tuple2('Square', '□'),
			_Utils_Tuple2('SquareIntersection', '⊓'),
			_Utils_Tuple2('SquareSubset', '⊏'),
			_Utils_Tuple2('SquareSubsetEqual', '⊑'),
			_Utils_Tuple2('SquareSuperset', '⊐'),
			_Utils_Tuple2('SquareSupersetEqual', '⊒'),
			_Utils_Tuple2('SquareUnion', '⊔'),
			_Utils_Tuple2('squarf', '▪'),
			_Utils_Tuple2('squ', '□'),
			_Utils_Tuple2('squf', '▪'),
			_Utils_Tuple2('srarr', '→'),
			_Utils_Tuple2('Sscr', '\uD835\uDCAE'),
			_Utils_Tuple2('sscr', '\uD835\uDCC8'),
			_Utils_Tuple2('ssetmn', '∖'),
			_Utils_Tuple2('ssmile', '⌣'),
			_Utils_Tuple2('sstarf', '⋆'),
			_Utils_Tuple2('Star', '⋆'),
			_Utils_Tuple2('star', '☆'),
			_Utils_Tuple2('starf', '★'),
			_Utils_Tuple2('straightepsilon', 'ϵ'),
			_Utils_Tuple2('straightphi', 'ϕ'),
			_Utils_Tuple2('strns', '¯'),
			_Utils_Tuple2('sub', '⊂'),
			_Utils_Tuple2('Sub', '⋐'),
			_Utils_Tuple2('subdot', '⪽'),
			_Utils_Tuple2('subE', '⫅'),
			_Utils_Tuple2('sube', '⊆'),
			_Utils_Tuple2('subedot', '⫃'),
			_Utils_Tuple2('submult', '⫁'),
			_Utils_Tuple2('subnE', '⫋'),
			_Utils_Tuple2('subne', '⊊'),
			_Utils_Tuple2('subplus', '⪿'),
			_Utils_Tuple2('subrarr', '⥹'),
			_Utils_Tuple2('subset', '⊂'),
			_Utils_Tuple2('Subset', '⋐'),
			_Utils_Tuple2('subseteq', '⊆'),
			_Utils_Tuple2('subseteqq', '⫅'),
			_Utils_Tuple2('SubsetEqual', '⊆'),
			_Utils_Tuple2('subsetneq', '⊊'),
			_Utils_Tuple2('subsetneqq', '⫋'),
			_Utils_Tuple2('subsim', '⫇'),
			_Utils_Tuple2('subsub', '⫕'),
			_Utils_Tuple2('subsup', '⫓'),
			_Utils_Tuple2('succapprox', '⪸'),
			_Utils_Tuple2('succ', '≻'),
			_Utils_Tuple2('succcurlyeq', '≽'),
			_Utils_Tuple2('Succeeds', '≻'),
			_Utils_Tuple2('SucceedsEqual', '⪰'),
			_Utils_Tuple2('SucceedsSlantEqual', '≽'),
			_Utils_Tuple2('SucceedsTilde', '≿'),
			_Utils_Tuple2('succeq', '⪰'),
			_Utils_Tuple2('succnapprox', '⪺'),
			_Utils_Tuple2('succneqq', '⪶'),
			_Utils_Tuple2('succnsim', '⋩'),
			_Utils_Tuple2('succsim', '≿'),
			_Utils_Tuple2('SuchThat', '∋'),
			_Utils_Tuple2('sum', '∑'),
			_Utils_Tuple2('Sum', '∑'),
			_Utils_Tuple2('sung', '♪'),
			_Utils_Tuple2('sup1', '¹'),
			_Utils_Tuple2('sup2', '²'),
			_Utils_Tuple2('sup3', '³'),
			_Utils_Tuple2('sup', '⊃'),
			_Utils_Tuple2('Sup', '⋑'),
			_Utils_Tuple2('supdot', '⪾'),
			_Utils_Tuple2('supdsub', '⫘'),
			_Utils_Tuple2('supE', '⫆'),
			_Utils_Tuple2('supe', '⊇'),
			_Utils_Tuple2('supedot', '⫄'),
			_Utils_Tuple2('Superset', '⊃'),
			_Utils_Tuple2('SupersetEqual', '⊇'),
			_Utils_Tuple2('suphsol', '⟉'),
			_Utils_Tuple2('suphsub', '⫗'),
			_Utils_Tuple2('suplarr', '⥻'),
			_Utils_Tuple2('supmult', '⫂'),
			_Utils_Tuple2('supnE', '⫌'),
			_Utils_Tuple2('supne', '⊋'),
			_Utils_Tuple2('supplus', '⫀'),
			_Utils_Tuple2('supset', '⊃'),
			_Utils_Tuple2('Supset', '⋑'),
			_Utils_Tuple2('supseteq', '⊇'),
			_Utils_Tuple2('supseteqq', '⫆'),
			_Utils_Tuple2('supsetneq', '⊋'),
			_Utils_Tuple2('supsetneqq', '⫌'),
			_Utils_Tuple2('supsim', '⫈'),
			_Utils_Tuple2('supsub', '⫔'),
			_Utils_Tuple2('supsup', '⫖'),
			_Utils_Tuple2('swarhk', '⤦'),
			_Utils_Tuple2('swarr', '↙'),
			_Utils_Tuple2('swArr', '⇙'),
			_Utils_Tuple2('swarrow', '↙'),
			_Utils_Tuple2('swnwar', '⤪'),
			_Utils_Tuple2('szlig', 'ß'),
			_Utils_Tuple2('Tab', '\t'),
			_Utils_Tuple2('target', '⌖'),
			_Utils_Tuple2('Tau', 'Τ'),
			_Utils_Tuple2('tau', 'τ'),
			_Utils_Tuple2('tbrk', '⎴'),
			_Utils_Tuple2('Tcaron', 'Ť'),
			_Utils_Tuple2('tcaron', 'ť'),
			_Utils_Tuple2('Tcedil', 'Ţ'),
			_Utils_Tuple2('tcedil', 'ţ'),
			_Utils_Tuple2('Tcy', 'Т'),
			_Utils_Tuple2('tcy', 'т'),
			_Utils_Tuple2('tdot', '⃛'),
			_Utils_Tuple2('telrec', '⌕'),
			_Utils_Tuple2('Tfr', '\uD835\uDD17'),
			_Utils_Tuple2('tfr', '\uD835\uDD31'),
			_Utils_Tuple2('there4', '∴'),
			_Utils_Tuple2('therefore', '∴'),
			_Utils_Tuple2('Therefore', '∴'),
			_Utils_Tuple2('Theta', 'Θ'),
			_Utils_Tuple2('theta', 'θ'),
			_Utils_Tuple2('thetasym', 'ϑ'),
			_Utils_Tuple2('thetav', 'ϑ'),
			_Utils_Tuple2('thickapprox', '≈'),
			_Utils_Tuple2('thicksim', '∼'),
			_Utils_Tuple2('ThickSpace', '\u205F\u200A'),
			_Utils_Tuple2('ThinSpace', '\u2009'),
			_Utils_Tuple2('thinsp', '\u2009'),
			_Utils_Tuple2('thkap', '≈'),
			_Utils_Tuple2('thksim', '∼'),
			_Utils_Tuple2('THORN', 'Þ'),
			_Utils_Tuple2('thorn', 'þ'),
			_Utils_Tuple2('tilde', '˜'),
			_Utils_Tuple2('Tilde', '∼'),
			_Utils_Tuple2('TildeEqual', '≃'),
			_Utils_Tuple2('TildeFullEqual', '≅'),
			_Utils_Tuple2('TildeTilde', '≈'),
			_Utils_Tuple2('timesbar', '⨱'),
			_Utils_Tuple2('timesb', '⊠'),
			_Utils_Tuple2('times', '×'),
			_Utils_Tuple2('timesd', '⨰'),
			_Utils_Tuple2('tint', '∭'),
			_Utils_Tuple2('toea', '⤨'),
			_Utils_Tuple2('topbot', '⌶'),
			_Utils_Tuple2('topcir', '⫱'),
			_Utils_Tuple2('top', '⊤'),
			_Utils_Tuple2('Topf', '\uD835\uDD4B'),
			_Utils_Tuple2('topf', '\uD835\uDD65'),
			_Utils_Tuple2('topfork', '⫚'),
			_Utils_Tuple2('tosa', '⤩'),
			_Utils_Tuple2('tprime', '‴'),
			_Utils_Tuple2('trade', '™'),
			_Utils_Tuple2('TRADE', '™'),
			_Utils_Tuple2('triangle', '▵'),
			_Utils_Tuple2('triangledown', '▿'),
			_Utils_Tuple2('triangleleft', '◃'),
			_Utils_Tuple2('trianglelefteq', '⊴'),
			_Utils_Tuple2('triangleq', '≜'),
			_Utils_Tuple2('triangleright', '▹'),
			_Utils_Tuple2('trianglerighteq', '⊵'),
			_Utils_Tuple2('tridot', '◬'),
			_Utils_Tuple2('trie', '≜'),
			_Utils_Tuple2('triminus', '⨺'),
			_Utils_Tuple2('TripleDot', '⃛'),
			_Utils_Tuple2('triplus', '⨹'),
			_Utils_Tuple2('trisb', '⧍'),
			_Utils_Tuple2('tritime', '⨻'),
			_Utils_Tuple2('trpezium', '⏢'),
			_Utils_Tuple2('Tscr', '\uD835\uDCAF'),
			_Utils_Tuple2('tscr', '\uD835\uDCC9'),
			_Utils_Tuple2('TScy', 'Ц'),
			_Utils_Tuple2('tscy', 'ц'),
			_Utils_Tuple2('TSHcy', 'Ћ'),
			_Utils_Tuple2('tshcy', 'ћ'),
			_Utils_Tuple2('Tstrok', 'Ŧ'),
			_Utils_Tuple2('tstrok', 'ŧ'),
			_Utils_Tuple2('twixt', '≬'),
			_Utils_Tuple2('twoheadleftarrow', '↞'),
			_Utils_Tuple2('twoheadrightarrow', '↠'),
			_Utils_Tuple2('Uacute', 'Ú'),
			_Utils_Tuple2('uacute', 'ú'),
			_Utils_Tuple2('uarr', '↑'),
			_Utils_Tuple2('Uarr', '↟'),
			_Utils_Tuple2('uArr', '⇑'),
			_Utils_Tuple2('Uarrocir', '⥉'),
			_Utils_Tuple2('Ubrcy', 'Ў'),
			_Utils_Tuple2('ubrcy', 'ў'),
			_Utils_Tuple2('Ubreve', 'Ŭ'),
			_Utils_Tuple2('ubreve', 'ŭ'),
			_Utils_Tuple2('Ucirc', 'Û'),
			_Utils_Tuple2('ucirc', 'û'),
			_Utils_Tuple2('Ucy', 'У'),
			_Utils_Tuple2('ucy', 'у'),
			_Utils_Tuple2('udarr', '⇅'),
			_Utils_Tuple2('Udblac', 'Ű'),
			_Utils_Tuple2('udblac', 'ű'),
			_Utils_Tuple2('udhar', '⥮'),
			_Utils_Tuple2('ufisht', '⥾'),
			_Utils_Tuple2('Ufr', '\uD835\uDD18'),
			_Utils_Tuple2('ufr', '\uD835\uDD32'),
			_Utils_Tuple2('Ugrave', 'Ù'),
			_Utils_Tuple2('ugrave', 'ù'),
			_Utils_Tuple2('uHar', '⥣'),
			_Utils_Tuple2('uharl', '↿'),
			_Utils_Tuple2('uharr', '↾'),
			_Utils_Tuple2('uhblk', '▀'),
			_Utils_Tuple2('ulcorn', '⌜'),
			_Utils_Tuple2('ulcorner', '⌜'),
			_Utils_Tuple2('ulcrop', '⌏'),
			_Utils_Tuple2('ultri', '◸'),
			_Utils_Tuple2('Umacr', 'Ū'),
			_Utils_Tuple2('umacr', 'ū'),
			_Utils_Tuple2('uml', '¨'),
			_Utils_Tuple2('UnderBar', '_'),
			_Utils_Tuple2('UnderBrace', '⏟'),
			_Utils_Tuple2('UnderBracket', '⎵'),
			_Utils_Tuple2('UnderParenthesis', '⏝'),
			_Utils_Tuple2('Union', '⋃'),
			_Utils_Tuple2('UnionPlus', '⊎'),
			_Utils_Tuple2('Uogon', 'Ų'),
			_Utils_Tuple2('uogon', 'ų'),
			_Utils_Tuple2('Uopf', '\uD835\uDD4C'),
			_Utils_Tuple2('uopf', '\uD835\uDD66'),
			_Utils_Tuple2('UpArrowBar', '⤒'),
			_Utils_Tuple2('uparrow', '↑'),
			_Utils_Tuple2('UpArrow', '↑'),
			_Utils_Tuple2('Uparrow', '⇑'),
			_Utils_Tuple2('UpArrowDownArrow', '⇅'),
			_Utils_Tuple2('updownarrow', '↕'),
			_Utils_Tuple2('UpDownArrow', '↕'),
			_Utils_Tuple2('Updownarrow', '⇕'),
			_Utils_Tuple2('UpEquilibrium', '⥮'),
			_Utils_Tuple2('upharpoonleft', '↿'),
			_Utils_Tuple2('upharpoonright', '↾'),
			_Utils_Tuple2('uplus', '⊎'),
			_Utils_Tuple2('UpperLeftArrow', '↖'),
			_Utils_Tuple2('UpperRightArrow', '↗'),
			_Utils_Tuple2('upsi', 'υ'),
			_Utils_Tuple2('Upsi', 'ϒ'),
			_Utils_Tuple2('upsih', 'ϒ'),
			_Utils_Tuple2('Upsilon', 'Υ'),
			_Utils_Tuple2('upsilon', 'υ'),
			_Utils_Tuple2('UpTeeArrow', '↥'),
			_Utils_Tuple2('UpTee', '⊥'),
			_Utils_Tuple2('upuparrows', '⇈'),
			_Utils_Tuple2('urcorn', '⌝'),
			_Utils_Tuple2('urcorner', '⌝'),
			_Utils_Tuple2('urcrop', '⌎'),
			_Utils_Tuple2('Uring', 'Ů'),
			_Utils_Tuple2('uring', 'ů'),
			_Utils_Tuple2('urtri', '◹'),
			_Utils_Tuple2('Uscr', '\uD835\uDCB0'),
			_Utils_Tuple2('uscr', '\uD835\uDCCA'),
			_Utils_Tuple2('utdot', '⋰'),
			_Utils_Tuple2('Utilde', 'Ũ'),
			_Utils_Tuple2('utilde', 'ũ'),
			_Utils_Tuple2('utri', '▵'),
			_Utils_Tuple2('utrif', '▴'),
			_Utils_Tuple2('uuarr', '⇈'),
			_Utils_Tuple2('Uuml', 'Ü'),
			_Utils_Tuple2('uuml', 'ü'),
			_Utils_Tuple2('uwangle', '⦧'),
			_Utils_Tuple2('vangrt', '⦜'),
			_Utils_Tuple2('varepsilon', 'ϵ'),
			_Utils_Tuple2('varkappa', 'ϰ'),
			_Utils_Tuple2('varnothing', '∅'),
			_Utils_Tuple2('varphi', 'ϕ'),
			_Utils_Tuple2('varpi', 'ϖ'),
			_Utils_Tuple2('varpropto', '∝'),
			_Utils_Tuple2('varr', '↕'),
			_Utils_Tuple2('vArr', '⇕'),
			_Utils_Tuple2('varrho', 'ϱ'),
			_Utils_Tuple2('varsigma', 'ς'),
			_Utils_Tuple2('varsubsetneq', '⊊︀'),
			_Utils_Tuple2('varsubsetneqq', '⫋︀'),
			_Utils_Tuple2('varsupsetneq', '⊋︀'),
			_Utils_Tuple2('varsupsetneqq', '⫌︀'),
			_Utils_Tuple2('vartheta', 'ϑ'),
			_Utils_Tuple2('vartriangleleft', '⊲'),
			_Utils_Tuple2('vartriangleright', '⊳'),
			_Utils_Tuple2('vBar', '⫨'),
			_Utils_Tuple2('Vbar', '⫫'),
			_Utils_Tuple2('vBarv', '⫩'),
			_Utils_Tuple2('Vcy', 'В'),
			_Utils_Tuple2('vcy', 'в'),
			_Utils_Tuple2('vdash', '⊢'),
			_Utils_Tuple2('vDash', '⊨'),
			_Utils_Tuple2('Vdash', '⊩'),
			_Utils_Tuple2('VDash', '⊫'),
			_Utils_Tuple2('Vdashl', '⫦'),
			_Utils_Tuple2('veebar', '⊻'),
			_Utils_Tuple2('vee', '∨'),
			_Utils_Tuple2('Vee', '⋁'),
			_Utils_Tuple2('veeeq', '≚'),
			_Utils_Tuple2('vellip', '⋮'),
			_Utils_Tuple2('verbar', '|'),
			_Utils_Tuple2('Verbar', '‖'),
			_Utils_Tuple2('vert', '|'),
			_Utils_Tuple2('Vert', '‖'),
			_Utils_Tuple2('VerticalBar', '∣'),
			_Utils_Tuple2('VerticalLine', '|'),
			_Utils_Tuple2('VerticalSeparator', '❘'),
			_Utils_Tuple2('VerticalTilde', '≀'),
			_Utils_Tuple2('VeryThinSpace', '\u200A'),
			_Utils_Tuple2('Vfr', '\uD835\uDD19'),
			_Utils_Tuple2('vfr', '\uD835\uDD33'),
			_Utils_Tuple2('vltri', '⊲'),
			_Utils_Tuple2('vnsub', '⊂⃒'),
			_Utils_Tuple2('vnsup', '⊃⃒'),
			_Utils_Tuple2('Vopf', '\uD835\uDD4D'),
			_Utils_Tuple2('vopf', '\uD835\uDD67'),
			_Utils_Tuple2('vprop', '∝'),
			_Utils_Tuple2('vrtri', '⊳'),
			_Utils_Tuple2('Vscr', '\uD835\uDCB1'),
			_Utils_Tuple2('vscr', '\uD835\uDCCB'),
			_Utils_Tuple2('vsubnE', '⫋︀'),
			_Utils_Tuple2('vsubne', '⊊︀'),
			_Utils_Tuple2('vsupnE', '⫌︀'),
			_Utils_Tuple2('vsupne', '⊋︀'),
			_Utils_Tuple2('Vvdash', '⊪'),
			_Utils_Tuple2('vzigzag', '⦚'),
			_Utils_Tuple2('Wcirc', 'Ŵ'),
			_Utils_Tuple2('wcirc', 'ŵ'),
			_Utils_Tuple2('wedbar', '⩟'),
			_Utils_Tuple2('wedge', '∧'),
			_Utils_Tuple2('Wedge', '⋀'),
			_Utils_Tuple2('wedgeq', '≙'),
			_Utils_Tuple2('weierp', '℘'),
			_Utils_Tuple2('Wfr', '\uD835\uDD1A'),
			_Utils_Tuple2('wfr', '\uD835\uDD34'),
			_Utils_Tuple2('Wopf', '\uD835\uDD4E'),
			_Utils_Tuple2('wopf', '\uD835\uDD68'),
			_Utils_Tuple2('wp', '℘'),
			_Utils_Tuple2('wr', '≀'),
			_Utils_Tuple2('wreath', '≀'),
			_Utils_Tuple2('Wscr', '\uD835\uDCB2'),
			_Utils_Tuple2('wscr', '\uD835\uDCCC'),
			_Utils_Tuple2('xcap', '⋂'),
			_Utils_Tuple2('xcirc', '◯'),
			_Utils_Tuple2('xcup', '⋃'),
			_Utils_Tuple2('xdtri', '▽'),
			_Utils_Tuple2('Xfr', '\uD835\uDD1B'),
			_Utils_Tuple2('xfr', '\uD835\uDD35'),
			_Utils_Tuple2('xharr', '⟷'),
			_Utils_Tuple2('xhArr', '⟺'),
			_Utils_Tuple2('Xi', 'Ξ'),
			_Utils_Tuple2('xi', 'ξ'),
			_Utils_Tuple2('xlarr', '⟵'),
			_Utils_Tuple2('xlArr', '⟸'),
			_Utils_Tuple2('xmap', '⟼'),
			_Utils_Tuple2('xnis', '⋻'),
			_Utils_Tuple2('xodot', '⨀'),
			_Utils_Tuple2('Xopf', '\uD835\uDD4F'),
			_Utils_Tuple2('xopf', '\uD835\uDD69'),
			_Utils_Tuple2('xoplus', '⨁'),
			_Utils_Tuple2('xotime', '⨂'),
			_Utils_Tuple2('xrarr', '⟶'),
			_Utils_Tuple2('xrArr', '⟹'),
			_Utils_Tuple2('Xscr', '\uD835\uDCB3'),
			_Utils_Tuple2('xscr', '\uD835\uDCCD'),
			_Utils_Tuple2('xsqcup', '⨆'),
			_Utils_Tuple2('xuplus', '⨄'),
			_Utils_Tuple2('xutri', '△'),
			_Utils_Tuple2('xvee', '⋁'),
			_Utils_Tuple2('xwedge', '⋀'),
			_Utils_Tuple2('Yacute', 'Ý'),
			_Utils_Tuple2('yacute', 'ý'),
			_Utils_Tuple2('YAcy', 'Я'),
			_Utils_Tuple2('yacy', 'я'),
			_Utils_Tuple2('Ycirc', 'Ŷ'),
			_Utils_Tuple2('ycirc', 'ŷ'),
			_Utils_Tuple2('Ycy', 'Ы'),
			_Utils_Tuple2('ycy', 'ы'),
			_Utils_Tuple2('yen', '¥'),
			_Utils_Tuple2('Yfr', '\uD835\uDD1C'),
			_Utils_Tuple2('yfr', '\uD835\uDD36'),
			_Utils_Tuple2('YIcy', 'Ї'),
			_Utils_Tuple2('yicy', 'ї'),
			_Utils_Tuple2('Yopf', '\uD835\uDD50'),
			_Utils_Tuple2('yopf', '\uD835\uDD6A'),
			_Utils_Tuple2('Yscr', '\uD835\uDCB4'),
			_Utils_Tuple2('yscr', '\uD835\uDCCE'),
			_Utils_Tuple2('YUcy', 'Ю'),
			_Utils_Tuple2('yucy', 'ю'),
			_Utils_Tuple2('yuml', 'ÿ'),
			_Utils_Tuple2('Yuml', 'Ÿ'),
			_Utils_Tuple2('Zacute', 'Ź'),
			_Utils_Tuple2('zacute', 'ź'),
			_Utils_Tuple2('Zcaron', 'Ž'),
			_Utils_Tuple2('zcaron', 'ž'),
			_Utils_Tuple2('Zcy', 'З'),
			_Utils_Tuple2('zcy', 'з'),
			_Utils_Tuple2('Zdot', 'Ż'),
			_Utils_Tuple2('zdot', 'ż'),
			_Utils_Tuple2('zeetrf', 'ℨ'),
			_Utils_Tuple2('ZeroWidthSpace', '\u200B'),
			_Utils_Tuple2('Zeta', 'Ζ'),
			_Utils_Tuple2('zeta', 'ζ'),
			_Utils_Tuple2('zfr', '\uD835\uDD37'),
			_Utils_Tuple2('Zfr', 'ℨ'),
			_Utils_Tuple2('ZHcy', 'Ж'),
			_Utils_Tuple2('zhcy', 'ж'),
			_Utils_Tuple2('zigrarr', '⇝'),
			_Utils_Tuple2('zopf', '\uD835\uDD6B'),
			_Utils_Tuple2('Zopf', 'ℤ'),
			_Utils_Tuple2('Zscr', '\uD835\uDCB5'),
			_Utils_Tuple2('zscr', '\uD835\uDCCF'),
			_Utils_Tuple2('zwj', '\u200D'),
			_Utils_Tuple2('zwnj', '\u200C')
		]));
var $hecrj$html_parser$Html$Parser$namedCharacterReference = A2(
	$elm$parser$Parser$map,
	function (reference) {
		return A2(
			$elm$core$Maybe$withDefault,
			'&' + (reference + ';'),
			A2($elm$core$Dict$get, reference, $hecrj$html_parser$Html$Parser$NamedCharacterReferences$dict));
	},
	$elm$parser$Parser$getChompedString(
		$hecrj$html_parser$Html$Parser$chompOneOrMore($elm$core$Char$isAlpha)));
var $elm$core$Char$fromCode = _Char_fromCode;
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
var $elm$core$Char$isHexDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return ((48 <= code) && (code <= 57)) || (((65 <= code) && (code <= 70)) || ((97 <= code) && (code <= 102)));
};
var $hecrj$html_parser$Html$Parser$hexadecimal = A2(
	$elm$parser$Parser$andThen,
	function (hex) {
		var _v0 = $rtfeldman$elm_hex$Hex$fromString(
			$elm$core$String$toLower(hex));
		if (!_v0.$) {
			var value = _v0.a;
			return $elm$parser$Parser$succeed(value);
		} else {
			var error = _v0.a;
			return $elm$parser$Parser$problem(error);
		}
	},
	$elm$parser$Parser$getChompedString(
		$hecrj$html_parser$Html$Parser$chompOneOrMore($elm$core$Char$isHexDigit)));
var $elm$parser$Parser$ExpectingInt = {$: 1};
var $elm$parser$Parser$Advanced$consumeBase = _Parser_consumeBase;
var $elm$parser$Parser$Advanced$consumeBase16 = _Parser_consumeBase16;
var $elm$parser$Parser$Advanced$bumpOffset = F2(
	function (newOffset, s) {
		return {fa: s.fa + (newOffset - s.jh), c: s.c, eo: s.eo, jh: newOffset, gd: s.gd, eL: s.eL};
	});
var $elm$parser$Parser$Advanced$chompBase10 = _Parser_chompBase10;
var $elm$parser$Parser$Advanced$isAsciiCode = _Parser_isAsciiCode;
var $elm$parser$Parser$Advanced$consumeExp = F2(
	function (offset, src) {
		if (A3($elm$parser$Parser$Advanced$isAsciiCode, 101, offset, src) || A3($elm$parser$Parser$Advanced$isAsciiCode, 69, offset, src)) {
			var eOffset = offset + 1;
			var expOffset = (A3($elm$parser$Parser$Advanced$isAsciiCode, 43, eOffset, src) || A3($elm$parser$Parser$Advanced$isAsciiCode, 45, eOffset, src)) ? (eOffset + 1) : eOffset;
			var newOffset = A2($elm$parser$Parser$Advanced$chompBase10, expOffset, src);
			return _Utils_eq(expOffset, newOffset) ? (-newOffset) : newOffset;
		} else {
			return offset;
		}
	});
var $elm$parser$Parser$Advanced$consumeDotAndExp = F2(
	function (offset, src) {
		return A3($elm$parser$Parser$Advanced$isAsciiCode, 46, offset, src) ? A2(
			$elm$parser$Parser$Advanced$consumeExp,
			A2($elm$parser$Parser$Advanced$chompBase10, offset + 1, src),
			src) : A2($elm$parser$Parser$Advanced$consumeExp, offset, src);
	});
var $elm$parser$Parser$Advanced$finalizeInt = F5(
	function (invalid, handler, startOffset, _v0, s) {
		var endOffset = _v0.a;
		var n = _v0.b;
		if (handler.$ === 1) {
			var x = handler.a;
			return A2(
				$elm$parser$Parser$Advanced$Bad,
				true,
				A2($elm$parser$Parser$Advanced$fromState, s, x));
		} else {
			var toValue = handler.a;
			return _Utils_eq(startOffset, endOffset) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				_Utils_cmp(s.jh, startOffset) < 0,
				A2($elm$parser$Parser$Advanced$fromState, s, invalid)) : A3(
				$elm$parser$Parser$Advanced$Good,
				true,
				toValue(n),
				A2($elm$parser$Parser$Advanced$bumpOffset, endOffset, s));
		}
	});
var $elm$core$String$toFloat = _String_toFloat;
var $elm$parser$Parser$Advanced$finalizeFloat = F6(
	function (invalid, expecting, intSettings, floatSettings, intPair, s) {
		var intOffset = intPair.a;
		var floatOffset = A2($elm$parser$Parser$Advanced$consumeDotAndExp, intOffset, s.eL);
		if (floatOffset < 0) {
			return A2(
				$elm$parser$Parser$Advanced$Bad,
				true,
				A4($elm$parser$Parser$Advanced$fromInfo, s.gd, s.fa - (floatOffset + s.jh), invalid, s.c));
		} else {
			if (_Utils_eq(s.jh, floatOffset)) {
				return A2(
					$elm$parser$Parser$Advanced$Bad,
					false,
					A2($elm$parser$Parser$Advanced$fromState, s, expecting));
			} else {
				if (_Utils_eq(intOffset, floatOffset)) {
					return A5($elm$parser$Parser$Advanced$finalizeInt, invalid, intSettings, s.jh, intPair, s);
				} else {
					if (floatSettings.$ === 1) {
						var x = floatSettings.a;
						return A2(
							$elm$parser$Parser$Advanced$Bad,
							true,
							A2($elm$parser$Parser$Advanced$fromState, s, invalid));
					} else {
						var toValue = floatSettings.a;
						var _v1 = $elm$core$String$toFloat(
							A3($elm$core$String$slice, s.jh, floatOffset, s.eL));
						if (_v1.$ === 1) {
							return A2(
								$elm$parser$Parser$Advanced$Bad,
								true,
								A2($elm$parser$Parser$Advanced$fromState, s, invalid));
						} else {
							var n = _v1.a;
							return A3(
								$elm$parser$Parser$Advanced$Good,
								true,
								toValue(n),
								A2($elm$parser$Parser$Advanced$bumpOffset, floatOffset, s));
						}
					}
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$number = function (c) {
	return function (s) {
		if (A3($elm$parser$Parser$Advanced$isAsciiCode, 48, s.jh, s.eL)) {
			var zeroOffset = s.jh + 1;
			var baseOffset = zeroOffset + 1;
			return A3($elm$parser$Parser$Advanced$isAsciiCode, 120, zeroOffset, s.eL) ? A5(
				$elm$parser$Parser$Advanced$finalizeInt,
				c.iG,
				c.ft,
				baseOffset,
				A2($elm$parser$Parser$Advanced$consumeBase16, baseOffset, s.eL),
				s) : (A3($elm$parser$Parser$Advanced$isAsciiCode, 111, zeroOffset, s.eL) ? A5(
				$elm$parser$Parser$Advanced$finalizeInt,
				c.iG,
				c.fU,
				baseOffset,
				A3($elm$parser$Parser$Advanced$consumeBase, 8, baseOffset, s.eL),
				s) : (A3($elm$parser$Parser$Advanced$isAsciiCode, 98, zeroOffset, s.eL) ? A5(
				$elm$parser$Parser$Advanced$finalizeInt,
				c.iG,
				c.e1,
				baseOffset,
				A3($elm$parser$Parser$Advanced$consumeBase, 2, baseOffset, s.eL),
				s) : A6(
				$elm$parser$Parser$Advanced$finalizeFloat,
				c.iG,
				c.fg,
				c.fA,
				c.fh,
				_Utils_Tuple2(zeroOffset, 0),
				s)));
		} else {
			return A6(
				$elm$parser$Parser$Advanced$finalizeFloat,
				c.iG,
				c.fg,
				c.fA,
				c.fh,
				A3($elm$parser$Parser$Advanced$consumeBase, 10, s.jh, s.eL),
				s);
		}
	};
};
var $elm$parser$Parser$Advanced$int = F2(
	function (expecting, invalid) {
		return $elm$parser$Parser$Advanced$number(
			{
				e1: $elm$core$Result$Err(invalid),
				fg: expecting,
				fh: $elm$core$Result$Err(invalid),
				ft: $elm$core$Result$Err(invalid),
				fA: $elm$core$Result$Ok($elm$core$Basics$identity),
				iG: invalid,
				fU: $elm$core$Result$Err(invalid)
			});
	});
var $elm$parser$Parser$int = A2($elm$parser$Parser$Advanced$int, $elm$parser$Parser$ExpectingInt, $elm$parser$Parser$ExpectingInt);
var $hecrj$html_parser$Html$Parser$numericCharacterReference = function () {
	var codepoint = $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed($elm$core$Basics$identity),
					$elm$parser$Parser$chompIf(
						function (c) {
							return (c === 'x') || (c === 'X');
						})),
				$hecrj$html_parser$Html$Parser$hexadecimal),
				A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed($elm$core$Basics$identity),
					$elm$parser$Parser$chompWhile(
						$elm$core$Basics$eq('0'))),
				$elm$parser$Parser$int)
			]));
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed($elm$core$Basics$identity),
			$elm$parser$Parser$chompIf(
				$elm$core$Basics$eq('#'))),
		A2(
			$elm$parser$Parser$map,
			A2($elm$core$Basics$composeR, $elm$core$Char$fromCode, $elm$core$String$fromChar),
			codepoint));
}();
var $hecrj$html_parser$Html$Parser$characterReference = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed($elm$core$Basics$identity),
		$elm$parser$Parser$chompIf(
			$elm$core$Basics$eq('&'))),
	$elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$backtrackable($hecrj$html_parser$Html$Parser$namedCharacterReference),
				$hecrj$html_parser$Html$Parser$chompSemicolon),
				A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$backtrackable($hecrj$html_parser$Html$Parser$numericCharacterReference),
				$hecrj$html_parser$Html$Parser$chompSemicolon),
				$elm$parser$Parser$succeed('&')
			])));
var $hecrj$html_parser$Html$Parser$tagAttributeQuotedValue = function (quote) {
	var isQuotedValueChar = function (c) {
		return (!_Utils_eq(c, quote)) && (c !== '&');
	};
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed($elm$core$Basics$identity),
			$elm$parser$Parser$chompIf(
				$elm$core$Basics$eq(quote))),
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$map,
				$elm$core$String$join(''),
				$hecrj$html_parser$Html$Parser$many(
					$elm$parser$Parser$oneOf(
						_List_fromArray(
							[
								$elm$parser$Parser$getChompedString(
								$hecrj$html_parser$Html$Parser$chompOneOrMore(isQuotedValueChar)),
								$hecrj$html_parser$Html$Parser$characterReference
							])))),
			$elm$parser$Parser$chompIf(
				$elm$core$Basics$eq(quote))));
};
var $hecrj$html_parser$Html$Parser$oneOrMore = F2(
	function (type_, parser_) {
		return A2(
			$elm$parser$Parser$loop,
			_List_Nil,
			function (list) {
				return $elm$parser$Parser$oneOf(
					_List_fromArray(
						[
							A2(
							$elm$parser$Parser$map,
							function (_new) {
								return $elm$parser$Parser$Loop(
									A2($elm$core$List$cons, _new, list));
							},
							parser_),
							$elm$core$List$isEmpty(list) ? $elm$parser$Parser$problem('expecting at least one ' + type_) : $elm$parser$Parser$succeed(
							$elm$parser$Parser$Done(
								$elm$core$List$reverse(list)))
						]));
			});
	});
var $hecrj$html_parser$Html$Parser$tagAttributeUnquotedValue = function () {
	var isUnquotedValueChar = function (c) {
		return (!$hecrj$html_parser$Html$Parser$isSpaceCharacter(c)) && ((c !== '\"') && ((c !== '\'') && ((c !== '=') && ((c !== '<') && ((c !== '>') && ((c !== '`') && (c !== '&')))))));
	};
	return A2(
		$elm$parser$Parser$map,
		$elm$core$String$join(''),
		A2(
			$hecrj$html_parser$Html$Parser$oneOrMore,
			'attribute value',
			$elm$parser$Parser$oneOf(
				_List_fromArray(
					[
						$elm$parser$Parser$getChompedString(
						$hecrj$html_parser$Html$Parser$chompOneOrMore(isUnquotedValueChar)),
						$hecrj$html_parser$Html$Parser$characterReference
					]))));
}();
var $hecrj$html_parser$Html$Parser$tagAttributeValue = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed($elm$core$Basics$identity),
					$elm$parser$Parser$chompIf(
						$elm$core$Basics$eq('='))),
				$elm$parser$Parser$chompWhile($hecrj$html_parser$Html$Parser$isSpaceCharacter)),
			$elm$parser$Parser$oneOf(
				_List_fromArray(
					[
						$hecrj$html_parser$Html$Parser$tagAttributeUnquotedValue,
						$hecrj$html_parser$Html$Parser$tagAttributeQuotedValue('\"'),
						$hecrj$html_parser$Html$Parser$tagAttributeQuotedValue('\'')
					]))),
			$elm$parser$Parser$succeed('')
		]));
var $hecrj$html_parser$Html$Parser$tagAttribute = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		$elm$parser$Parser$succeed($elm$core$Tuple$pair),
		A2(
			$elm$parser$Parser$ignorer,
			$hecrj$html_parser$Html$Parser$tagAttributeName,
			$elm$parser$Parser$chompWhile($hecrj$html_parser$Html$Parser$isSpaceCharacter))),
	A2(
		$elm$parser$Parser$ignorer,
		$hecrj$html_parser$Html$Parser$tagAttributeValue,
		$elm$parser$Parser$chompWhile($hecrj$html_parser$Html$Parser$isSpaceCharacter)));
var $hecrj$html_parser$Html$Parser$tagAttributes = $hecrj$html_parser$Html$Parser$many($hecrj$html_parser$Html$Parser$tagAttribute);
var $hecrj$html_parser$Html$Parser$tagName = A2(
	$elm$parser$Parser$map,
	$elm$core$String$toLower,
	$elm$parser$Parser$getChompedString(
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$chompIf($elm$core$Char$isAlphaNum),
			$elm$parser$Parser$chompWhile(
				function (c) {
					return $elm$core$Char$isAlphaNum(c) || (c === '-');
				}))));
var $hecrj$html_parser$Html$Parser$text = A2(
	$elm$parser$Parser$map,
	A2(
		$elm$core$Basics$composeR,
		$elm$core$String$join(''),
		$hecrj$html_parser$Html$Parser$Text),
	A2(
		$hecrj$html_parser$Html$Parser$oneOrMore,
		'text element',
		$elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					$elm$parser$Parser$getChompedString(
					$hecrj$html_parser$Html$Parser$chompOneOrMore(
						function (c) {
							return (c !== '<') && (c !== '&');
						})),
					$hecrj$html_parser$Html$Parser$characterReference
				]))));
function $hecrj$html_parser$Html$Parser$cyclic$node() {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$hecrj$html_parser$Html$Parser$text,
				$hecrj$html_parser$Html$Parser$comment,
				$hecrj$html_parser$Html$Parser$cyclic$element()
			]));
}
function $hecrj$html_parser$Html$Parser$cyclic$element() {
	return A2(
		$elm$parser$Parser$andThen,
		function (_v0) {
			var name = _v0.a;
			var attributes = _v0.b;
			return $hecrj$html_parser$Html$Parser$isVoidElement(name) ? A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(
						A3($hecrj$html_parser$Html$Parser$Element, name, attributes, _List_Nil)),
					$elm$parser$Parser$oneOf(
						_List_fromArray(
							[
								$elm$parser$Parser$chompIf(
								$elm$core$Basics$eq('/')),
								$elm$parser$Parser$succeed(0)
							]))),
				$elm$parser$Parser$chompIf(
					$elm$core$Basics$eq('>'))) : A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(
						A2($hecrj$html_parser$Html$Parser$Element, name, attributes)),
					$elm$parser$Parser$chompIf(
						$elm$core$Basics$eq('>'))),
				A2(
					$elm$parser$Parser$ignorer,
					$hecrj$html_parser$Html$Parser$many(
						$elm$parser$Parser$backtrackable(
							$hecrj$html_parser$Html$Parser$cyclic$node())),
					$hecrj$html_parser$Html$Parser$closingTag(name)));
		},
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed($elm$core$Tuple$pair),
					$elm$parser$Parser$chompIf(
						$elm$core$Basics$eq('<'))),
				A2(
					$elm$parser$Parser$ignorer,
					$hecrj$html_parser$Html$Parser$tagName,
					$elm$parser$Parser$chompWhile($hecrj$html_parser$Html$Parser$isSpaceCharacter))),
			$hecrj$html_parser$Html$Parser$tagAttributes));
}
var $hecrj$html_parser$Html$Parser$node = $hecrj$html_parser$Html$Parser$cyclic$node();
$hecrj$html_parser$Html$Parser$cyclic$node = function () {
	return $hecrj$html_parser$Html$Parser$node;
};
var $hecrj$html_parser$Html$Parser$element = $hecrj$html_parser$Html$Parser$cyclic$element();
$hecrj$html_parser$Html$Parser$cyclic$element = function () {
	return $hecrj$html_parser$Html$Parser$element;
};
var $elm$parser$Parser$DeadEnd = F3(
	function (row, col, problem) {
		return {fa: col, f4: problem, gd: row};
	});
var $elm$parser$Parser$problemToDeadEnd = function (p) {
	return A3($elm$parser$Parser$DeadEnd, p.gd, p.fa, p.f4);
};
var $elm$parser$Parser$Advanced$bagToList = F2(
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
						$temp$list = A2($elm$core$List$cons, x, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
				default:
					var bag1 = bag.a;
					var bag2 = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$parser$Parser$Advanced$bagToList, bag2, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
			}
		}
	});
var $elm$parser$Parser$Advanced$run = F2(
	function (_v0, src) {
		var parse = _v0;
		var _v1 = parse(
			{fa: 1, c: _List_Nil, eo: 1, jh: 0, gd: 1, eL: src});
		if (!_v1.$) {
			var value = _v1.b;
			return $elm$core$Result$Ok(value);
		} else {
			var bag = _v1.b;
			return $elm$core$Result$Err(
				A2($elm$parser$Parser$Advanced$bagToList, bag, _List_Nil));
		}
	});
var $elm$parser$Parser$run = F2(
	function (parser, source) {
		var _v0 = A2($elm$parser$Parser$Advanced$run, parser, source);
		if (!_v0.$) {
			var a = _v0.a;
			return $elm$core$Result$Ok(a);
		} else {
			var problems = _v0.a;
			return $elm$core$Result$Err(
				A2($elm$core$List$map, $elm$parser$Parser$problemToDeadEnd, problems));
		}
	});
var $hecrj$html_parser$Html$Parser$run = function (str) {
	return $elm$core$String$isEmpty(str) ? $elm$core$Result$Ok(_List_Nil) : A2(
		$elm$parser$Parser$run,
		A2($hecrj$html_parser$Html$Parser$oneOrMore, 'node', $hecrj$html_parser$Html$Parser$node),
		str);
};
var $elm$html$Html$span = _VirtualDom_node('span');
var $author$project$Document$DocumentViews$DocumentView$toHtml = F3(
	function (config, level, node) {
		switch (node.$) {
			case 1:
				var tag = node.a;
				var attrs = node.b;
				var nodes = node.c;
				var templateTagAttr = function (s) {
					return A2($elm$html$Html$Attributes$attribute, 'style', s);
				}(
					A2(
						$elm$core$String$join,
						' ',
						A2(
							$elm$core$List$map,
							function (_v2) {
								var a = _v2.a;
								var v = _v2.b;
								return a + (':' + (v + ';'));
							},
							A2(
								$elm$core$Maybe$withDefault,
								_List_Nil,
								A2(
									$elm$core$Dict$get,
									tag,
									$author$project$Document$DocumentViews$StyleSheets$defaultStyleSheetCss(config))))));
				var attrs_ = A2(
					$elm$core$List$cons,
					templateTagAttr,
					A2(
						$elm$core$List$map,
						function (_v1) {
							var a = _v1.a;
							var v = _v1.b;
							return A2($elm$html$Html$Attributes$attribute, a, v);
						},
						attrs));
				return A3(
					$elm$html$Html$node,
					tag,
					attrs_,
					A2(
						$elm$core$List$map,
						A2($author$project$Document$DocumentViews$DocumentView$toHtml, config, level),
						nodes));
			case 0:
				var value = node.a;
				return $elm$html$Html$text(value);
			default:
				var value = node.a;
				return A2($elm$html$Html$span, _List_Nil, _List_Nil);
		}
	});
var $elm$core$Result$withDefault = F2(
	function (def, result) {
		if (!result.$) {
			var a = result.a;
			return a;
		} else {
			return def;
		}
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
						styleSheet.ju,
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
					A2($elm$core$Dict$get, level, styleSheet.ij));
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
			case 3:
				var p = tbe.a;
				return A2(
					$mdgriffith$elm_ui$Element$el,
					A2($author$project$Document$DocumentViews$DocumentView$idStyle, styleSheet, id),
					A3($author$project$Document$DocumentViews$DocumentView$renderTextBlockPrimitive, config, tbAttrs, p));
			default:
				var html = tbe.a;
				return function (r) {
					return A2(
						$mdgriffith$elm_ui$Element$paragraph,
						_Utils_ap(
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
								]),
							_Utils_ap(
								A2($author$project$Document$DocumentViews$DocumentView$idStyle, styleSheet, id),
								A2($author$project$Document$DocumentViews$DocumentView$renderAttrs, config, tbAttrs))),
						_List_fromArray(
							[
								A2($author$project$Document$DocumentViews$StyleSheets$embeddedStyleSheet, config, tbAttrs),
								$mdgriffith$elm_ui$Element$html(r)
							]));
				}(
					A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('trix-content'),
								A2(
								$elm$html$Html$Attributes$attribute,
								'style',
								'width: 100%;' + $author$project$Document$DocumentViews$StyleSheets$stringifyAttributes(
									A2($elm$core$List$concatMap, $author$project$Document$DocumentViews$StyleSheets$docAttrToCss, tbAttrs)))
							]),
						A2(
							$elm$core$List$map,
							A2($author$project$Document$DocumentViews$DocumentView$toHtml, config, 0),
							A2(
								$elm$core$List$map,
								$author$project$Document$DocumentViews$DocumentView$processLinks(config),
								A2(
									$elm$core$Result$withDefault,
									_List_Nil,
									$hecrj$html_parser$Html$Parser$run(html))))));
		}
	});
var $author$project$Document$DocumentViews$DocumentView$customHeading = F4(
	function (config, level, attrs, title) {
		return A4(
			$author$project$Document$DocumentViews$DocumentView$renderTextBlockElement,
			config,
			{
				a$: $elm$core$Set$empty,
				a4: $elm$core$Maybe$Nothing,
				a7: $elm$core$Maybe$Just(
					'defaultHtmlId' + $elm$core$String$fromInt(0)),
				bY: 0
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
		var onPress = _v0.as;
		var label = _v0.B;
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
						$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.dg + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.bi + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.jV + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.fR)))))),
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
				g5: size * 2,
				hr: clr,
				jh: _Utils_Tuple2(0, 0),
				eK: size
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
						$mdgriffith$elm_ui$Element$Background$color(
						A3($mdgriffith$elm_ui$Element$rgb, 0.85, 0.85, 0.85))
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
var $mdgriffith$elm_ui$Element$Input$autofill = A2(
	$elm$core$Basics$composeL,
	$mdgriffith$elm_ui$Internal$Model$Attr,
	$elm$html$Html$Attributes$attribute('autocomplete'));
var $mdgriffith$elm_ui$Internal$Model$Behind = 5;
var $mdgriffith$elm_ui$Element$createNearby = F2(
	function (loc, element) {
		if (element.$ === 3) {
			return $mdgriffith$elm_ui$Internal$Model$NoAttribute;
		} else {
			return A2($mdgriffith$elm_ui$Internal$Model$Nearby, loc, element);
		}
	});
var $mdgriffith$elm_ui$Element$behindContent = function (element) {
	return A2($mdgriffith$elm_ui$Element$createNearby, 5, element);
};
var $mdgriffith$elm_ui$Internal$Model$MoveY = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Flag$moveY = $mdgriffith$elm_ui$Internal$Flag$flag(26);
var $mdgriffith$elm_ui$Element$moveUp = function (y) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$TransformComponent,
		$mdgriffith$elm_ui$Internal$Flag$moveY,
		$mdgriffith$elm_ui$Internal$Model$MoveY(-y));
};
var $mdgriffith$elm_ui$Element$Input$calcMoveToCompensateForPadding = function (attrs) {
	var gatherSpacing = F2(
		function (attr, found) {
			if ((attr.$ === 4) && (attr.b.$ === 5)) {
				var _v2 = attr.b;
				var x = _v2.b;
				var y = _v2.c;
				if (found.$ === 1) {
					return $elm$core$Maybe$Just(y);
				} else {
					return found;
				}
			} else {
				return found;
			}
		});
	var _v0 = A3($elm$core$List$foldr, gatherSpacing, $elm$core$Maybe$Nothing, attrs);
	if (_v0.$ === 1) {
		return $mdgriffith$elm_ui$Internal$Model$NoAttribute;
	} else {
		var vSpace = _v0.a;
		return $mdgriffith$elm_ui$Element$moveUp(
			$elm$core$Basics$floor(vSpace / 2));
	}
};
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
		$mdgriffith$elm_ui$Element$spacing(5),
		$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
		$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink)
	]);
var $mdgriffith$elm_ui$Element$Input$getHeight = function (attr) {
	if (attr.$ === 8) {
		var h = attr.a;
		return $elm$core$Maybe$Just(h);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
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
	return A2($mdgriffith$elm_ui$Element$createNearby, 4, element);
};
var $mdgriffith$elm_ui$Element$Input$isConstrained = function (len) {
	isConstrained:
	while (true) {
		switch (len.$) {
			case 1:
				return false;
			case 0:
				return true;
			case 2:
				return true;
			case 3:
				var l = len.b;
				var $temp$len = l;
				len = $temp$len;
				continue isConstrained;
			default:
				var l = len.b;
				return true;
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
var $mdgriffith$elm_ui$Element$Input$isStacked = function (label) {
	if (!label.$) {
		var loc = label.a;
		switch (loc) {
			case 0:
				return false;
			case 1:
				return false;
			case 2:
				return true;
			default:
				return true;
		}
	} else {
		return true;
	}
};
var $mdgriffith$elm_ui$Element$Input$negateBox = function (box) {
	return {aK: -box.aK, aO: -box.aO, aX: -box.aX, a_: -box.a_};
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
var $mdgriffith$elm_ui$Element$Input$isFill = function (len) {
	isFill:
	while (true) {
		switch (len.$) {
			case 2:
				return true;
			case 1:
				return false;
			case 0:
				return false;
			case 3:
				var l = len.b;
				var $temp$len = l;
				len = $temp$len;
				continue isFill;
			default:
				var l = len.b;
				var $temp$len = l;
				len = $temp$len;
				continue isFill;
		}
	}
};
var $mdgriffith$elm_ui$Element$Input$isPixel = function (len) {
	isPixel:
	while (true) {
		switch (len.$) {
			case 1:
				return false;
			case 0:
				return true;
			case 2:
				return false;
			case 3:
				var l = len.b;
				var $temp$len = l;
				len = $temp$len;
				continue isPixel;
			default:
				var l = len.b;
				var $temp$len = l;
				len = $temp$len;
				continue isPixel;
		}
	}
};
var $mdgriffith$elm_ui$Element$Input$redistributeOver = F4(
	function (isMultiline, stacked, attr, els) {
		switch (attr.$) {
			case 9:
				return _Utils_update(
					els,
					{
						dJ: A2($elm$core$List$cons, attr, els.dJ)
					});
			case 7:
				var width = attr.a;
				return $mdgriffith$elm_ui$Element$Input$isFill(width) ? _Utils_update(
					els,
					{
						l: A2($elm$core$List$cons, attr, els.l),
						J: A2($elm$core$List$cons, attr, els.J),
						dJ: A2($elm$core$List$cons, attr, els.dJ)
					}) : (stacked ? _Utils_update(
					els,
					{
						l: A2($elm$core$List$cons, attr, els.l)
					}) : _Utils_update(
					els,
					{
						dJ: A2($elm$core$List$cons, attr, els.dJ)
					}));
			case 8:
				var height = attr.a;
				return (!stacked) ? _Utils_update(
					els,
					{
						l: A2($elm$core$List$cons, attr, els.l),
						dJ: A2($elm$core$List$cons, attr, els.dJ)
					}) : ($mdgriffith$elm_ui$Element$Input$isFill(height) ? _Utils_update(
					els,
					{
						l: A2($elm$core$List$cons, attr, els.l),
						dJ: A2($elm$core$List$cons, attr, els.dJ)
					}) : ($mdgriffith$elm_ui$Element$Input$isPixel(height) ? _Utils_update(
					els,
					{
						dJ: A2($elm$core$List$cons, attr, els.dJ)
					}) : _Utils_update(
					els,
					{
						dJ: A2($elm$core$List$cons, attr, els.dJ)
					})));
			case 6:
				return _Utils_update(
					els,
					{
						l: A2($elm$core$List$cons, attr, els.l)
					});
			case 5:
				return _Utils_update(
					els,
					{
						l: A2($elm$core$List$cons, attr, els.l)
					});
			case 4:
				switch (attr.b.$) {
					case 5:
						var _v1 = attr.b;
						return _Utils_update(
							els,
							{
								l: A2($elm$core$List$cons, attr, els.l),
								J: A2($elm$core$List$cons, attr, els.J),
								dJ: A2($elm$core$List$cons, attr, els.dJ),
								cw: A2($elm$core$List$cons, attr, els.cw)
							});
					case 7:
						var cls = attr.a;
						var _v2 = attr.b;
						var pad = _v2.a;
						var t = _v2.b;
						var r = _v2.c;
						var b = _v2.d;
						var l = _v2.e;
						if (isMultiline) {
							return _Utils_update(
								els,
								{
									hD: A2($elm$core$List$cons, attr, els.hD),
									dJ: A2($elm$core$List$cons, attr, els.dJ)
								});
						} else {
							var reducedVerticalPadding = $mdgriffith$elm_ui$Element$paddingEach(
								{
									aK: b - A2($elm$core$Basics$min, t, b),
									aO: l,
									aX: r,
									a_: t - A2($elm$core$Basics$min, t, b)
								});
							var newLineHeight = $mdgriffith$elm_ui$Element$htmlAttribute(
								A2(
									$elm$html$Html$Attributes$style,
									'line-height',
									'calc(1.0em + ' + ($elm$core$String$fromInt(
										2 * A2($elm$core$Basics$min, t, b)) + 'px)')));
							var newHeight = $mdgriffith$elm_ui$Element$htmlAttribute(
								A2(
									$elm$html$Html$Attributes$style,
									'height',
									'calc(1.0em + ' + ($elm$core$String$fromInt(
										2 * A2($elm$core$Basics$min, t, b)) + 'px)')));
							return _Utils_update(
								els,
								{
									hD: A2($elm$core$List$cons, attr, els.hD),
									J: A2(
										$elm$core$List$cons,
										newHeight,
										A2($elm$core$List$cons, newLineHeight, els.J)),
									dJ: A2($elm$core$List$cons, reducedVerticalPadding, els.dJ)
								});
						}
					case 6:
						var _v3 = attr.b;
						return _Utils_update(
							els,
							{
								hD: A2($elm$core$List$cons, attr, els.hD),
								dJ: A2($elm$core$List$cons, attr, els.dJ)
							});
					case 10:
						return _Utils_update(
							els,
							{
								hD: A2($elm$core$List$cons, attr, els.hD),
								dJ: A2($elm$core$List$cons, attr, els.dJ)
							});
					case 2:
						return _Utils_update(
							els,
							{
								l: A2($elm$core$List$cons, attr, els.l)
							});
					case 1:
						var _v4 = attr.b;
						return _Utils_update(
							els,
							{
								l: A2($elm$core$List$cons, attr, els.l)
							});
					default:
						var flag = attr.a;
						var cls = attr.b;
						return _Utils_update(
							els,
							{
								dJ: A2($elm$core$List$cons, attr, els.dJ)
							});
				}
			case 0:
				return els;
			case 1:
				var a = attr.a;
				return _Utils_update(
					els,
					{
						J: A2($elm$core$List$cons, attr, els.J)
					});
			case 2:
				return _Utils_update(
					els,
					{
						J: A2($elm$core$List$cons, attr, els.J)
					});
			case 3:
				return _Utils_update(
					els,
					{
						dJ: A2($elm$core$List$cons, attr, els.dJ)
					});
			default:
				return _Utils_update(
					els,
					{
						J: A2($elm$core$List$cons, attr, els.J)
					});
		}
	});
var $mdgriffith$elm_ui$Element$Input$redistribute = F3(
	function (isMultiline, stacked, attrs) {
		return function (redist) {
			return {
				hD: $elm$core$List$reverse(redist.hD),
				l: $elm$core$List$reverse(redist.l),
				J: $elm$core$List$reverse(redist.J),
				dJ: $elm$core$List$reverse(redist.dJ),
				cw: $elm$core$List$reverse(redist.cw)
			};
		}(
			A3(
				$elm$core$List$foldl,
				A2($mdgriffith$elm_ui$Element$Input$redistributeOver, isMultiline, stacked),
				{hD: _List_Nil, l: _List_Nil, J: _List_Nil, dJ: _List_Nil, cw: _List_Nil},
				attrs));
	});
var $mdgriffith$elm_ui$Element$Input$renderBox = function (_v0) {
	var top = _v0.a_;
	var right = _v0.aX;
	var bottom = _v0.aK;
	var left = _v0.aO;
	return $elm$core$String$fromInt(top) + ('px ' + ($elm$core$String$fromInt(right) + ('px ' + ($elm$core$String$fromInt(bottom) + ('px ' + ($elm$core$String$fromInt(left) + 'px'))))));
};
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
var $mdgriffith$elm_ui$Element$Input$charcoal = A3($mdgriffith$elm_ui$Element$rgb, 136 / 255, 138 / 255, 133 / 255);
var $mdgriffith$elm_ui$Element$Input$renderPlaceholder = F3(
	function (_v0, forPlaceholder, on) {
		var placeholderAttrs = _v0.a;
		var placeholderEl = _v0.b;
		return A2(
			$mdgriffith$elm_ui$Element$el,
			_Utils_ap(
				forPlaceholder,
				_Utils_ap(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Font$color($mdgriffith$elm_ui$Element$Input$charcoal),
							$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.fR + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.jv)),
							$mdgriffith$elm_ui$Element$clip,
							$mdgriffith$elm_ui$Element$Border$color(
							A4($mdgriffith$elm_ui$Element$rgba, 0, 0, 0, 0)),
							$mdgriffith$elm_ui$Element$Background$color(
							A4($mdgriffith$elm_ui$Element$rgba, 0, 0, 0, 0)),
							$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$alpha(
							on ? 1 : 0)
						]),
					placeholderAttrs)),
			placeholderEl);
	});
var $mdgriffith$elm_ui$Element$scrollbarY = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$overflow, $mdgriffith$elm_ui$Internal$Style$classes.jU);
var $elm$html$Html$Attributes$spellcheck = $elm$html$Html$Attributes$boolProperty('spellcheck');
var $mdgriffith$elm_ui$Element$Input$spellcheck = A2($elm$core$Basics$composeL, $mdgriffith$elm_ui$Internal$Model$Attr, $elm$html$Html$Attributes$spellcheck);
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $mdgriffith$elm_ui$Element$Input$value = A2($elm$core$Basics$composeL, $mdgriffith$elm_ui$Internal$Model$Attr, $elm$html$Html$Attributes$value);
var $mdgriffith$elm_ui$Element$Input$textHelper = F3(
	function (textInput, attrs, textOptions) {
		var withDefaults = _Utils_ap($mdgriffith$elm_ui$Element$Input$defaultTextBoxStyle, attrs);
		var redistributed = A3(
			$mdgriffith$elm_ui$Element$Input$redistribute,
			_Utils_eq(textInput.W, $mdgriffith$elm_ui$Element$Input$TextArea),
			$mdgriffith$elm_ui$Element$Input$isStacked(textOptions.B),
			withDefaults);
		var onlySpacing = function (attr) {
			if ((attr.$ === 4) && (attr.b.$ === 5)) {
				var _v9 = attr.b;
				return true;
			} else {
				return false;
			}
		};
		var heightConstrained = function () {
			var _v7 = textInput.W;
			if (!_v7.$) {
				var inputType = _v7.a;
				return false;
			} else {
				return A2(
					$elm$core$Maybe$withDefault,
					false,
					A2(
						$elm$core$Maybe$map,
						$mdgriffith$elm_ui$Element$Input$isConstrained,
						$elm$core$List$head(
							$elm$core$List$reverse(
								A2($elm$core$List$filterMap, $mdgriffith$elm_ui$Element$Input$getHeight, withDefaults)))));
			}
		}();
		var getPadding = function (attr) {
			if ((attr.$ === 4) && (attr.b.$ === 7)) {
				var cls = attr.a;
				var _v6 = attr.b;
				var pad = _v6.a;
				var t = _v6.b;
				var r = _v6.c;
				var b = _v6.d;
				var l = _v6.e;
				return $elm$core$Maybe$Just(
					{
						aK: A2(
							$elm$core$Basics$max,
							0,
							$elm$core$Basics$floor(b - 3)),
						aO: A2(
							$elm$core$Basics$max,
							0,
							$elm$core$Basics$floor(l - 3)),
						aX: A2(
							$elm$core$Basics$max,
							0,
							$elm$core$Basics$floor(r - 3)),
						a_: A2(
							$elm$core$Basics$max,
							0,
							$elm$core$Basics$floor(t - 3))
					});
			} else {
				return $elm$core$Maybe$Nothing;
			}
		};
		var parentPadding = A2(
			$elm$core$Maybe$withDefault,
			{aK: 0, aO: 0, aX: 0, a_: 0},
			$elm$core$List$head(
				$elm$core$List$reverse(
					A2($elm$core$List$filterMap, getPadding, withDefaults))));
		var inputElement = A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asEl,
			function () {
				var _v3 = textInput.W;
				if (!_v3.$) {
					var inputType = _v3.a;
					return $mdgriffith$elm_ui$Internal$Model$NodeName('input');
				} else {
					return $mdgriffith$elm_ui$Internal$Model$NodeName('textarea');
				}
			}(),
			_Utils_ap(
				function () {
					var _v4 = textInput.W;
					if (!_v4.$) {
						var inputType = _v4.a;
						return _List_fromArray(
							[
								$mdgriffith$elm_ui$Internal$Model$Attr(
								$elm$html$Html$Attributes$type_(inputType)),
								$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.iF)
							]);
					} else {
						return _List_fromArray(
							[
								$mdgriffith$elm_ui$Element$clip,
								$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
								$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.iB),
								$mdgriffith$elm_ui$Element$Input$calcMoveToCompensateForPadding(withDefaults),
								$mdgriffith$elm_ui$Element$paddingEach(parentPadding),
								$mdgriffith$elm_ui$Internal$Model$Attr(
								A2(
									$elm$html$Html$Attributes$style,
									'margin',
									$mdgriffith$elm_ui$Element$Input$renderBox(
										$mdgriffith$elm_ui$Element$Input$negateBox(parentPadding)))),
								$mdgriffith$elm_ui$Internal$Model$Attr(
								A2($elm$html$Html$Attributes$style, 'box-sizing', 'content-box'))
							]);
					}
				}(),
				_Utils_ap(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Input$value(textOptions.c$),
							$mdgriffith$elm_ui$Internal$Model$Attr(
							$elm$html$Html$Events$onInput(textOptions.cS)),
							$mdgriffith$elm_ui$Element$Input$hiddenLabelAttribute(textOptions.B),
							$mdgriffith$elm_ui$Element$Input$spellcheck(textInput.aY),
							A2(
							$elm$core$Maybe$withDefault,
							$mdgriffith$elm_ui$Internal$Model$NoAttribute,
							A2($elm$core$Maybe$map, $mdgriffith$elm_ui$Element$Input$autofill, textInput.aJ))
						]),
					redistributed.J)),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(_List_Nil));
		var wrappedInput = function () {
			var _v0 = textInput.W;
			if (_v0.$ === 1) {
				return A4(
					$mdgriffith$elm_ui$Internal$Model$element,
					$mdgriffith$elm_ui$Internal$Model$asEl,
					$mdgriffith$elm_ui$Internal$Model$div,
					_Utils_ap(
						(heightConstrained ? $elm$core$List$cons($mdgriffith$elm_ui$Element$scrollbarY) : $elm$core$Basics$identity)(
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
									A2($elm$core$List$any, $mdgriffith$elm_ui$Element$Input$hasFocusStyle, withDefaults) ? $mdgriffith$elm_ui$Internal$Model$NoAttribute : $mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.fj),
									$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.iE)
								])),
						redistributed.dJ),
					$mdgriffith$elm_ui$Internal$Model$Unkeyed(
						_List_fromArray(
							[
								A4(
								$mdgriffith$elm_ui$Internal$Model$element,
								$mdgriffith$elm_ui$Internal$Model$asParagraph,
								$mdgriffith$elm_ui$Internal$Model$div,
								A2(
									$elm$core$List$cons,
									$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
									A2(
										$elm$core$List$cons,
										$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
										A2(
											$elm$core$List$cons,
											$mdgriffith$elm_ui$Element$inFront(inputElement),
											A2(
												$elm$core$List$cons,
												$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.iD),
												redistributed.cw)))),
								$mdgriffith$elm_ui$Internal$Model$Unkeyed(
									function () {
										if (textOptions.c$ === '') {
											var _v1 = textOptions.cY;
											if (_v1.$ === 1) {
												return _List_fromArray(
													[
														$mdgriffith$elm_ui$Element$text('\u00A0')
													]);
											} else {
												var place = _v1.a;
												return _List_fromArray(
													[
														A3($mdgriffith$elm_ui$Element$Input$renderPlaceholder, place, _List_Nil, textOptions.c$ === '')
													]);
											}
										} else {
											return _List_fromArray(
												[
													$mdgriffith$elm_ui$Internal$Model$unstyled(
													A2(
														$elm$html$Html$span,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class($mdgriffith$elm_ui$Internal$Style$classes.iC)
															]),
														_List_fromArray(
															[
																$elm$html$Html$text(textOptions.c$ + '\u00A0')
															])))
												]);
										}
									}()))
							])));
			} else {
				var inputType = _v0.a;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$element,
					$mdgriffith$elm_ui$Internal$Model$asEl,
					$mdgriffith$elm_ui$Internal$Model$div,
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
						A2(
							$elm$core$List$cons,
							A2($elm$core$List$any, $mdgriffith$elm_ui$Element$Input$hasFocusStyle, withDefaults) ? $mdgriffith$elm_ui$Internal$Model$NoAttribute : $mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.fj),
							$elm$core$List$concat(
								_List_fromArray(
									[
										redistributed.dJ,
										function () {
										var _v2 = textOptions.cY;
										if (_v2.$ === 1) {
											return _List_Nil;
										} else {
											var place = _v2.a;
											return _List_fromArray(
												[
													$mdgriffith$elm_ui$Element$behindContent(
													A3($mdgriffith$elm_ui$Element$Input$renderPlaceholder, place, redistributed.hD, textOptions.c$ === ''))
												]);
										}
									}()
									])))),
					$mdgriffith$elm_ui$Internal$Model$Unkeyed(
						_List_fromArray(
							[inputElement])));
			}
		}();
		return A3(
			$mdgriffith$elm_ui$Element$Input$applyLabel,
			A2(
				$elm$core$List$cons,
				A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$cursor, $mdgriffith$elm_ui$Internal$Style$classes.hH),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$Input$isHiddenLabel(textOptions.B) ? $mdgriffith$elm_ui$Internal$Model$NoAttribute : $mdgriffith$elm_ui$Element$spacing(5),
					A2($elm$core$List$cons, $mdgriffith$elm_ui$Element$Region$announce, redistributed.l))),
			textOptions.B,
			wrappedInput);
	});
var $mdgriffith$elm_ui$Element$Input$multiline = F2(
	function (attrs, multi) {
		return A3(
			$mdgriffith$elm_ui$Element$Input$textHelper,
			{aJ: $elm$core$Maybe$Nothing, aY: multi.kh, W: $mdgriffith$elm_ui$Element$Input$TextArea},
			attrs,
			{B: multi.B, cS: multi.cS, cY: multi.cY, c$: multi.c$});
	});
var $mdgriffith$elm_ui$Element$Input$TextInputNode = function (a) {
	return {$: 0, a: a};
};
var $mdgriffith$elm_ui$Element$Input$text = $mdgriffith$elm_ui$Element$Input$textHelper(
	{
		aJ: $elm$core$Maybe$Nothing,
		aY: false,
		W: $mdgriffith$elm_ui$Element$Input$TextInputNode('text')
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
	return $author$project$Internals$Contact$canLoadCaptcha(model) && (!$elm$core$String$isEmpty(model.cA));
};
var $author$project$Internals$Contact$view = function (model) {
	return A2(
		$mdgriffith$elm_ui$Element$map,
		model.bl,
		function ($) {
			return $.dN;
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
						B: $mdgriffith$elm_ui$Element$text('Nouveau message'),
						as: $elm$core$Maybe$Just($author$project$Internals$Contact$Reset)
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
								B: $author$project$Internals$Contact$mandatoryLabel('Nom et prénom:'),
								cS: $author$project$Internals$Contact$SetName,
								cY: $elm$core$Maybe$Nothing,
								c$: model.y
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
								B: A2(
									$mdgriffith$elm_ui$Element$Input$labelAbove,
									_List_Nil,
									$mdgriffith$elm_ui$Element$text('Société:')),
								cS: $author$project$Internals$Contact$SetCompany,
								cY: $elm$core$Maybe$Nothing,
								c$: model.cB
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
								B: $author$project$Internals$Contact$mandatoryLabel('Email:'),
								cS: $author$project$Internals$Contact$SetEmail,
								cY: $elm$core$Maybe$Nothing,
								c$: model.hW
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
								B: A2(
									$mdgriffith$elm_ui$Element$Input$labelAbove,
									_List_Nil,
									$mdgriffith$elm_ui$Element$text('Téléphone:')),
								cS: $author$project$Internals$Contact$SetPhone,
								cY: $elm$core$Maybe$Nothing,
								c$: model.cW
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
								B: $author$project$Internals$Contact$mandatoryLabel('Sujet:'),
								cS: $author$project$Internals$Contact$SetTopic,
								cY: $elm$core$Maybe$Nothing,
								c$: model.cu
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
						B: $author$project$Internals$Contact$mandatoryLabel('Votre message:'),
						cS: $author$project$Internals$Contact$SetMessage,
						cY: $elm$core$Maybe$Nothing,
						kh: false,
						c$: model.cP
					}),
					function ($) {
					return $.j8;
				}(model) ? $mdgriffith$elm_ui$Element$none : A2(
					$mdgriffith$elm_ui$Element$el,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$htmlAttribute(
							$elm$html$Html$Attributes$class('g-recaptcha'))
						]),
					$mdgriffith$elm_ui$Element$none),
					function ($) {
					return $.j8;
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
						B: $mdgriffith$elm_ui$Element$text('Envoyer'),
						as: $author$project$Internals$Contact$validate(model) ? $elm$core$Maybe$Just($author$project$Internals$Contact$Send) : $elm$core$Maybe$Nothing
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
					$author$project$Internals$Contact$view(model.b3))
				]));
	});
var $hecrj$html_parser$Html$Parser$nodeToString = function (node_) {
	var attributeToString = function (_v2) {
		var attr = _v2.a;
		var value = _v2.b;
		return attr + ('=\"' + (value + '\"'));
	};
	switch (node_.$) {
		case 0:
			var text_ = node_.a;
			return text_;
		case 1:
			var name = node_.a;
			var attributes = node_.b;
			var children = node_.c;
			var maybeAttributes = function () {
				if (!attributes.b) {
					return '';
				} else {
					return ' ' + A2(
						$elm$core$String$join,
						' ',
						A2($elm$core$List$map, attributeToString, attributes));
				}
			}();
			return $hecrj$html_parser$Html$Parser$isVoidElement(name) ? $elm$core$String$concat(
				_List_fromArray(
					['<', name, maybeAttributes, '>'])) : $elm$core$String$concat(
				_List_fromArray(
					[
						'<',
						name,
						maybeAttributes,
						'>',
						A2(
						$elm$core$String$join,
						'',
						A2($elm$core$List$map, $hecrj$html_parser$Html$Parser$nodeToString, children)),
						'</',
						name,
						'>'
					]));
		default:
			var comment_ = node_.a;
			return '<!-- ' + (comment_ + ' -->');
	}
};
var $author$project$PageEditor$EditorPlugins$TrixTextBlockPlugin$styleAttr = function (attrs) {
	return function (r) {
		return _List_fromArray(
			[
				_Utils_Tuple2('style', r)
			]);
	}(
		A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				function (_v0) {
					var a = _v0.a;
					var v = _v0.b;
					return a + (': ' + (v + ';'));
				},
				A2($elm$core$List$concatMap, $author$project$Document$DocumentViews$StyleSheets$docAttrToCss, attrs))));
};
var $author$project$PageEditor$EditorPlugins$TrixTextBlockPlugin$textBlockPrimToNode = F2(
	function (pageIndex, tbp) {
		if (!tbp.$) {
			if (!tbp.a.b) {
				var s = tbp.b;
				return $hecrj$html_parser$Html$Parser$Text(s);
			} else {
				var attrs = tbp.a;
				var s = tbp.b;
				return A3(
					$hecrj$html_parser$Html$Parser$Element,
					'span',
					$author$project$PageEditor$EditorPlugins$TrixTextBlockPlugin$styleAttr(attrs),
					_List_fromArray(
						[
							$hecrj$html_parser$Html$Parser$Text(s)
						]));
			}
		} else {
			var attrs = tbp.a;
			var targetBlank = tbp.b.gs;
			var url = tbp.b.c6;
			var label = tbp.b.B;
			var url_ = function () {
				var _v1 = A2($elm$core$Dict$get, url, pageIndex);
				if (!_v1.$) {
					return 'lien-interne:' + url;
				} else {
					return A2($elm$core$String$startsWith, '/baseDocumentaire', url) ? ('doc:' + url) : url;
				}
			}();
			return A3(
				$hecrj$html_parser$Html$Parser$Element,
				'a',
				_Utils_ap(
					$author$project$PageEditor$EditorPlugins$TrixTextBlockPlugin$styleAttr(attrs),
					_Utils_ap(
						_List_fromArray(
							[
								_Utils_Tuple2('href', url_)
							]),
						targetBlank ? _List_fromArray(
							[
								_Utils_Tuple2('target', 'blank')
							]) : _List_Nil)),
				_List_fromArray(
					[
						$hecrj$html_parser$Html$Parser$Text(label)
					]));
		}
	});
var $author$project$PageEditor$EditorPlugins$TrixTextBlockPlugin$textBlockElementToNode = F2(
	function (pageIndex, tbe) {
		switch (tbe.$) {
			case 0:
				var attrs = tbe.a;
				var prims = tbe.b;
				return _List_fromArray(
					[
						A3(
						$hecrj$html_parser$Html$Parser$Element,
						'p',
						$author$project$PageEditor$EditorPlugins$TrixTextBlockPlugin$styleAttr(attrs),
						A2(
							$elm$core$List$map,
							$author$project$PageEditor$EditorPlugins$TrixTextBlockPlugin$textBlockPrimToNode(pageIndex),
							prims))
					]);
			case 1:
				var attrs = tbe.a;
				var lis = tbe.b;
				return _List_fromArray(
					[
						A3(
						$hecrj$html_parser$Html$Parser$Element,
						'ul',
						$author$project$PageEditor$EditorPlugins$TrixTextBlockPlugin$styleAttr(attrs),
						A2(
							$elm$core$List$map,
							function (li) {
								return A3(
									$hecrj$html_parser$Html$Parser$Element,
									'li',
									_List_Nil,
									A2(
										$elm$core$List$map,
										$author$project$PageEditor$EditorPlugins$TrixTextBlockPlugin$textBlockPrimToNode(pageIndex),
										li));
							},
							lis))
					]);
			case 2:
				switch (tbe.b.a) {
					case 1:
						var attrs = tbe.a;
						var _v1 = tbe.b;
						var s = _v1.b;
						return _List_fromArray(
							[
								A3(
								$hecrj$html_parser$Html$Parser$Element,
								'h1',
								$author$project$PageEditor$EditorPlugins$TrixTextBlockPlugin$styleAttr(attrs),
								_List_fromArray(
									[
										$hecrj$html_parser$Html$Parser$Text(s)
									]))
							]);
					case 2:
						var attrs = tbe.a;
						var _v2 = tbe.b;
						var s = _v2.b;
						return _List_fromArray(
							[
								A3(
								$hecrj$html_parser$Html$Parser$Element,
								'h2',
								$author$project$PageEditor$EditorPlugins$TrixTextBlockPlugin$styleAttr(attrs),
								_List_fromArray(
									[
										$hecrj$html_parser$Html$Parser$Text(s)
									]))
							]);
					case 3:
						var attrs = tbe.a;
						var _v3 = tbe.b;
						var s = _v3.b;
						return _List_fromArray(
							[
								A3(
								$hecrj$html_parser$Html$Parser$Element,
								'h3',
								$author$project$PageEditor$EditorPlugins$TrixTextBlockPlugin$styleAttr(attrs),
								_List_fromArray(
									[
										$hecrj$html_parser$Html$Parser$Text(s)
									]))
							]);
					default:
						return _List_Nil;
				}
			case 3:
				var prim = tbe.a;
				return _List_fromArray(
					[
						A2($author$project$PageEditor$EditorPlugins$TrixTextBlockPlugin$textBlockPrimToNode, pageIndex, prim)
					]);
			default:
				var html = tbe.a;
				return A2(
					$elm$core$Result$withDefault,
					_List_Nil,
					$hecrj$html_parser$Html$Parser$run(html));
		}
	});
var $author$project$PageEditor$EditorPlugins$TrixTextBlockPlugin$convertTextBlocks = F2(
	function (pageIndex, doc) {
		if (!doc.$) {
			var value = doc.a;
			var docs = doc.b;
			return A2(
				$author$project$Document$Document$Container,
				value,
				A2(
					$elm$core$List$map,
					$author$project$PageEditor$EditorPlugins$TrixTextBlockPlugin$convertTextBlocks(pageIndex),
					docs));
		} else {
			var cellContent = doc.a.ag;
			var id = doc.a.b;
			var attrs = doc.a.p;
			if (cellContent.$ === 6) {
				var tbElements = cellContent.a;
				return $author$project$Document$Document$Cell(
					{
						p: attrs,
						ag: $author$project$Document$Document$TextBlock(
							_List_fromArray(
								[
									$author$project$Document$Document$TrixHtml(
									A2(
										$elm$core$String$join,
										'',
										A2(
											$elm$core$List$map,
											$hecrj$html_parser$Html$Parser$nodeToString,
											A2(
												$elm$core$List$concatMap,
												$author$project$PageEditor$EditorPlugins$TrixTextBlockPlugin$textBlockElementToNode(pageIndex),
												tbElements))))
								])),
						b: id
					});
			} else {
				var other = cellContent;
				return $author$project$Document$Document$Cell(
					{p: attrs, ag: other, b: id});
			}
		}
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
												B: $mdgriffith$elm_ui$Element$text('gillardinformatique.net'),
												c6: 'http://www.gillardinformatique.net'
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
		var _v0 = device.b1;
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
	if (config.Z) {
		var _v0 = config.dL;
		switch (_v0) {
			case 1:
				return 980;
			case 2:
				return 800;
			case 3:
				return 350;
			default:
				return config.k0;
		}
	} else {
		return config.k0;
	}
};
var $Skinney$murmur3$Murmur3$HashData = F4(
	function (shift, seed, hash, charsProcessed) {
		return {b0: charsProcessed, b9: hash, jY: seed, cn: shift};
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
	var acc = (!(!data.b9)) ? (data.jY ^ A2(
		$Skinney$murmur3$Murmur3$multiplyBy,
		$Skinney$murmur3$Murmur3$c2,
		A2(
			$Skinney$murmur3$Murmur3$rotlBy,
			15,
			A2($Skinney$murmur3$Murmur3$multiplyBy, $Skinney$murmur3$Murmur3$c1, data.b9)))) : data.jY;
	var h0 = acc ^ data.b0;
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
		var res = data.b9 | ((255 & $elm$core$Char$toCode(c)) << data.cn);
		var _v0 = data.cn;
		if (_v0 === 24) {
			return {
				b0: data.b0 + 1,
				b9: 0,
				jY: A2($Skinney$murmur3$Murmur3$mix, data.jY, res),
				cn: 0
			};
		} else {
			return {b0: data.b0 + 1, b9: res, jY: data.jY, cn: data.cn + 8};
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
		var image = _v0.ir;
		var label = _v0.B;
		var targetBlank = _v0.gs;
		var url = _v0.c6;
		var url_ = targetBlank ? url : A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Dict$get, url, config.cV));
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
				styleSheet.g4,
				_Utils_ap(
					A2($author$project$Document$DocumentViews$DocumentView$renderAttrs, config, attrs),
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width(
							$mdgriffith$elm_ui$Element$px(bw)),
							$mdgriffith$elm_ui$Element$height(
							$mdgriffith$elm_ui$Element$px(bh)),
							$mdgriffith$elm_ui$Element$Background$color($author$project$Internals$CommonStyleHelpers$blockLinkGrey),
							(!config.Z) ? $mdgriffith$elm_ui$Element$mouseOver(
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
		return config.Z ? A2(
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
			{B: block, c6: url_});
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
			_Utils_Tuple2(config.k0, config.il),
			config.Z,
			config.dL);
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
		return {d7: day, fv: hour, dz: millis, fL: minute, eu: month, jX: second, eV: year, eW: zone};
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
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).eV;
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
	var y = dateRecord.eV - ((dateRecord.eu <= 2) ? 1 : 0);
	var time = ((((dateRecord.fv * 3600) * 1000) + ((dateRecord.fL * 60) * 1000)) + (dateRecord.jX * 1000)) + dateRecord.dz;
	var mp = A2($elm$core$Basics$modBy, 12, dateRecord.eu + 9);
	var era = $elm$core$Basics$floor(y / 400);
	var yoe = y - (era * 400);
	var doy = (((((153 * mp) + 2) / 5) | 0) + dateRecord.d7) - 1;
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
		d7: (dayOfYear - ((((153 * mp) + 2) / 5) | 0)) + 1,
		fv: hour,
		dz: millis,
		fL: minute,
		eu: month,
		jX: second,
		eV: year + ((month <= 2) ? 1 : 0),
		eW: $elm$time$Time$utc
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
			$elm$core$String$fromInt(dateRec.d7)) + ('/' + (A3(
			$elm$core$String$padLeft,
			2,
			'0',
			$elm$core$String$fromInt(dateRec.eu)) + ('/' + $elm$core$String$fromInt(dateRec.eV))));
	});
var $elm$html$Html$Attributes$download = function (fileName) {
	return A2($elm$html$Html$Attributes$stringProperty, 'download', fileName);
};
var $mdgriffith$elm_ui$Element$download = F2(
	function (attrs, _v0) {
		var url = _v0.c6;
		var label = _v0.B;
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
								$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.dg),
								A2(
									$elm$core$List$cons,
									$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.bi),
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
		var src = _v0.eL;
		var description = _v0.ec;
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
				$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.is),
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
						B: A2(
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
						c6: '/baseDocumentaire/publications/bulletins/' + function (s) {
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
		config.k0,
		A3(
			$author$project$Document$DocumentViews$StyleSheets$docMaxWidth,
			_Utils_Tuple2(config.k0, config.il),
			config.Z,
			config.dL)) - 40;
};
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
	var bottom = _v0.aK;
	var top = _v0.a_;
	var left = _v0.aO;
	var right = _v0.aX;
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
							{aK: 5, aO: 0, aX: 0, a_: 0}),
							$mdgriffith$elm_ui$Element$Border$widthEach(
							{aK: 1, aO: 0, aX: 0, a_: 0}),
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
		var issue = _v2.fC;
		var date = _v2.dk;
		var cover = _v2.hD;
		var index = _v2.fx;
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
								A2($author$project$Internals$CommonHelpers$dateToStr, config.eW, date))),
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
								B: $mdgriffith$elm_ui$Element$text('Télécharger'),
								c6: '/baseDocumentaire/publications/bulletins/' + function (s) {
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
							{ec: '', eL: cover}),
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
	var _v0 = config.eC;
	if (!_v0.$) {
		var bulletins = _v0.a.hc;
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
								A2($elm$time$Time$toYear, config.eW, k.dk),
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
		var _v0 = config.eC;
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
			var delibs = _v0.a.hM;
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
				_Utils_Tuple2(config.k0, config.il),
				config.Z,
				config.dL),
			config.k0) - 40;
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
				_Utils_Tuple2(config.k0, config.il),
				config.Z,
				config.dL),
			config.k0) - 40;
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
				_Utils_Tuple2(config.k0, config.il),
				config.Z,
				config.dL),
			config.k0) - 40;
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
			var _v0 = device.b1;
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
				A2($elm$core$Dict$get, s, config.hI))
			]);
	});
var $author$project$Publications$PublicationsView$delibTopicView = F3(
	function (issue, n, _v0) {
		var topic = _v0.a;
		var page = _v0.b;
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
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$pointer
						]),
					{
						B: A2(
							$mdgriffith$elm_ui$Element$paragraph,
							_List_Nil,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$text(topic)
								])),
						c6: '/baseDocumentaire/publications/delibs/' + function (s) {
							return s + ('.pdf#page=' + $elm$core$String$fromInt(page));
						}(issue)
					})
				]));
	});
var $author$project$Publications$PublicationsView$delibsView = function (config) {
	var delibView = function (_v2) {
		var date = _v2.dk;
		var index = _v2.fx;
		var issue = A3(
			$elm$core$String$replace,
			'/',
			'-',
			A2($author$project$Internals$CommonHelpers$dateToStr, config.eW, date));
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
									A2($author$project$Internals$CommonHelpers$dateToStr, config.eW, date))),
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
									B: $mdgriffith$elm_ui$Element$text('Télécharger'),
									c6: '/baseDocumentaire/publications/delibs/' + function (s) {
										return s + '.pdf';
									}(issue)
								})
							]))
					]),
				A2(
					$elm$core$List$indexedMap,
					$author$project$Publications$PublicationsView$delibTopicView(issue),
					index)));
	};
	var _v0 = config.eC;
	if (!_v0.$) {
		var delibs = _v0.a.hM;
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
								A2($elm$time$Time$toYear, config.eW, k.dk),
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
		var _v0 = config.eC;
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
			var delibs = _v0.a.hM;
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
			var _v0 = device.b1;
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
									B: A2(
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
									c6: 'visite/visite-virtuelle-aerienne-murol.html'
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
											B: $mdgriffith$elm_ui$Element$text('W3D\'s'),
											c6: 'https://www.w3ds.fr/'
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
	var natureActiv = _v0.i3;
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
		var nom = _v1.je;
		var poste = _v1.jB;
		var tel = _v1.ky;
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
	var adresse = _v0.gM;
	var telNumber = _v0.kz;
	var fax = _v0.h4;
	var email = _v0.hW;
	var site = _v0.kc;
	var responsables = _v0.jM;
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
										B: $mdgriffith$elm_ui$Element$text(siteName),
										c6: siteUrl
									})
								]));
					},
					site)),
				$author$project$GeneralDirectoryEditor$FichePreview$responsablesView(responsables)
			]));
};
var $author$project$GeneralDirectoryEditor$FichePreview$descriptionView = function (_v0) {
	var description = _v0.ec;
	var ouverture = _v0.jr;
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
		var linkedDocs = _v0.iQ;
		if (!linkedDocs.b) {
			return $mdgriffith$elm_ui$Element$none;
		} else {
			var ldocs = linkedDocs;
			var ldView = function (_v3) {
				var url = _v3.c6;
				var label = _v3.B;
				var descr = _v3.hQ;
				var expiryDate = _v3.h$;
				var resView = A2(
					$mdgriffith$elm_ui$Element$column,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$spacing(7),
							$mdgriffith$elm_ui$Element$Border$widthEach(
							{aK: 1, aO: 0, aX: 0, a_: 0}),
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
								B: A2(
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
								c6: url
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
var $elm$core$List$sort = function (xs) {
	return A2($elm$core$List$sortBy, $elm$core$Basics$identity, xs);
};
var $mdgriffith$elm_ui$Internal$Flag$bgGradient = $mdgriffith$elm_ui$Internal$Flag$flag(10);
var $mdgriffith$elm_ui$Element$Background$gradient = function (_v0) {
	var angle = _v0.gX;
	var steps = _v0.kn;
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
				$elm$core$String$fromFloat(shadow.jh.a) + 'px',
				$elm$core$String$fromFloat(shadow.jh.b) + 'px',
				$elm$core$String$fromFloat(shadow.g5) + 'px',
				$mdgriffith$elm_ui$Internal$Model$formatColor(shadow.hr)
			]));
};
var $mdgriffith$elm_ui$Internal$Model$textShadowClass = function (shadow) {
	return $elm$core$String$concat(
		_List_fromArray(
			[
				'txt',
				$mdgriffith$elm_ui$Internal$Model$floatClass(shadow.jh.a) + 'px',
				$mdgriffith$elm_ui$Internal$Model$floatClass(shadow.jh.b) + 'px',
				$mdgriffith$elm_ui$Internal$Model$floatClass(shadow.g5) + 'px',
				$mdgriffith$elm_ui$Internal$Model$formatColorClass(shadow.hr)
			]));
};
var $mdgriffith$elm_ui$Internal$Flag$txtShadows = $mdgriffith$elm_ui$Internal$Flag$flag(18);
var $mdgriffith$elm_ui$Element$Font$shadow = function (shade) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$txtShadows,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Single,
			$mdgriffith$elm_ui$Internal$Model$textShadowClass(shade),
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
					gX: 0,
					kn: _List_fromArray(
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
						{aK: 0, aO: 0, aX: 0, a_: 5}),
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
									g5: 1,
									hr: A3($mdgriffith$elm_ui$Element$rgb255, 25, 21, 0),
									jh: _Utils_Tuple2(1, 0)
								})
							]),
						$mdgriffith$elm_ui$Element$text(
							A2($elm$core$String$repeat, n, '🟊')))
					]))
			]));
};
var $author$project$GeneralDirectoryEditor$FichePreview$refView = F2(
	function (maxWidth, _v0) {
		var refOt = _v0.jH;
		var label = _v0.B;
		var rank = _v0.jE;
		var toImage = function (_v8) {
			var lien = _v8.iO;
			var logo = _v8.iS;
			return {il: logo.il, cM: lien, c6: logo.c6, k0: logo.k0};
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
								B: $mdgriffith$elm_ui$Element$text(
									$elm$core$String$fromInt(ref)),
								c6: link
							})
						]));
			} else {
				return $mdgriffith$elm_ui$Element$none;
			}
		}();
		var _v1 = function () {
			var _v2 = rank.ki;
			if (!_v2.$) {
				var n = _v2.a;
				return _Utils_Tuple2(
					_List_fromArray(
						[
							{il: 50, cM: 'https://etoiles-de-france.fr/', c6: 'stars', k0: 80}
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
								return $.il;
							},
							images)))));
		var imgsScaledToMinHeight = function () {
			var scale = function (_v5) {
				var url = _v5.c6;
				var width = _v5.k0;
				var height = _v5.il;
				var link = _v5.cM;
				return {il: minHeight + 5, cM: link, c6: url, k0: (minHeight * width) / height};
			};
			return A2($elm$core$List$map, scale, images);
		}();
		var totalImgWidth = A3(
			$elm$core$List$foldr,
			F2(
				function (i, n) {
					return i.k0 + n;
				}),
			0,
			imgsScaledToMinHeight);
		var logoView = function (_v4) {
			var url = _v4.c6;
			var width = _v4.k0;
			var height = _v4.il;
			var link = _v4.cM;
			return A2(
				$mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[
						(_Utils_cmp(totalImgWidth, maxWidth) < 0) ? $mdgriffith$elm_ui$Element$width(
						$mdgriffith$elm_ui$Element$px(
							$elm$core$Basics$round(width))) : $mdgriffith$elm_ui$Element$width(
						$mdgriffith$elm_ui$Element$fillPortion(
							$elm$core$Basics$floor((10000 * width) / totalImgWidth)))
					]),
				A2(
					$mdgriffith$elm_ui$Element$newTabLink,
					_List_Nil,
					{
						B: (url === 'stars') ? $author$project$GeneralDirectoryEditor$FichePreview$starsView(nbrStars) : A2(
							$mdgriffith$elm_ui$Element$image,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
								]),
							{ec: '', eL: url}),
						c6: link
					}));
		};
		var logosView = function () {
			if (!images.b) {
				return $mdgriffith$elm_ui$Element$none;
			} else {
				return A2(
					$mdgriffith$elm_ui$Element$row,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$spacing(10)
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
		var uuid = _v0.eQ;
		var nomEntite = _v0.jf;
		var visuel = _v0.k_;
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
						$TSFoster$elm_uuid$UUID$toString(uuid))),
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
				return A2($elm$core$Dict$get, fId, config.h6);
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
				config.jo,
				config.hF,
				maxWidth,
				config.Z || A2(
					$elm$core$Set$member,
					$TSFoster$elm_uuid$UUID$toString(f.eQ),
					config.jq),
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
							return $.jf;
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
		var _v0 = $author$project$Internals$Streams$current(model.T);
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
						$mdgriffith$elm_ui$Element$spacing(20)
					]),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$paragraph,
						_List_Nil,
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$text(
								A2($elm$core$Maybe$withDefault, ' ', c.e5))
							])),
						function () {
						var _v3 = _Utils_Tuple2(c.eL, model.ek);
						if ((!_v3.a.$) && _v3.b) {
							var src = _v3.a.a;
							return A2(
								$mdgriffith$elm_ui$Element$download,
								_Utils_ap(
									_List_fromArray(
										[$mdgriffith$elm_ui$Element$alignRight]),
									$author$project$Internals$CommonStyleHelpers$buttonStyle(true)),
								{
									B: A2(
										$mdgriffith$elm_ui$Element$el,
										_List_fromArray(
											[
												$mdgriffith$elm_ui$Element$Font$color(
												A3($mdgriffith$elm_ui$Element$rgb, 0, 0, 1)),
												$mdgriffith$elm_ui$Element$Font$underline
											]),
										$mdgriffith$elm_ui$Element$text('Télécharger version HD')),
									c6: $author$project$Internals$CommonHelpers$hdSrc(src)
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
								$elm$core$String$fromInt(1 + model.T.fx)) + ('/' + A3(
								$elm$core$String$padLeft,
								2,
								'0',
								$elm$core$String$fromInt(model.T.eK)))))
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
		return {X: x, k2: y};
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
			return styled.fw(
				A2(
					$mdgriffith$elm_ui$Internal$Model$OnlyDynamic,
					{
						fi: {g$: $elm$core$Maybe$Nothing, g7: $elm$core$Maybe$Nothing, ka: $elm$core$Maybe$Nothing},
						S: 1,
						e: 0
					},
					styled.go));
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
		var start = _v0.aZ;
		var delay_ = _v0.Y;
		var dos = _v0.I;
		var ramp = _v0.aW;
		var from_ = _v0.v;
		var to_ = _v0.n;
		var ease_ = _v0.a6;
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
			var _v2 = model.m;
			if (_v2.$ === 1) {
				return $mdgriffith$elm_ui$Element$moveLeft(w);
			} else {
				if (!_v2.a.b) {
					var _v3 = _v2.a;
					var anim = _v3.a;
					var _v4 = _v3.b;
					return $mdgriffith$elm_ui$Element$moveLeft(
						w + A2($mgold$elm_animation$Animation$animate, model.b2, anim));
				} else {
					var _v5 = _v2.a;
					var anim = _v5.a;
					var _v6 = _v5.b;
					return $mdgriffith$elm_ui$Element$moveRight(
						((-1) * w) + A2($mgold$elm_animation$Animation$animate, model.b2, anim));
				}
			}
		}();
		var _v0 = model.ar;
		if (_v0.$ === 1) {
			return animFun;
		} else {
			var _v1 = _v0.a;
			var start = _v1.a;
			var stop = _v1.b;
			return ((start.X - stop.X) <= 0) ? $mdgriffith$elm_ui$Element$moveRight(
				((-1) * w) + $elm$core$Basics$abs(start.X - stop.X)) : $mdgriffith$elm_ui$Element$moveLeft((w + start.X) - stop.X);
		}
	});
var $author$project$Gallery$Gallery$ImgLoaded = function (a) {
	return {$: 8, a: a};
};
var $elm$html$Html$Attributes$hidden = $elm$html$Html$Attributes$boolProperty('hidden');
var $elm$html$Html$img = _VirtualDom_node('img');
var $author$project$Gallery$Gallery$picView = F3(
	function (config, model, _v0) {
		var src = _v0.eL;
		var size = _v0.eK;
		var w = $author$project$Gallery$Gallery$maxWidth(config);
		var h = A2(
			$elm$core$Basics$min,
			600,
			$elm$core$Basics$round(w / 1.333333));
		if (!src.$) {
			var src_ = src.a;
			return A2($elm$core$Set$member, src_, model.cN) ? A2(
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
						{ec: 'chargement en cours', eL: '/assets/images/loading.gif'}),
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
								model.ar,
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
								(config.k0 > 750) ? $mdgriffith$elm_ui$Element$width(
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
								(config.k0 > 750) ? 55 : 40))));
			});
		return A2(
			$mdgriffith$elm_ui$Element$el,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$centerX,
					$mdgriffith$elm_ui$Element$clipX,
					$mdgriffith$elm_ui$Element$width(
					$mdgriffith$elm_ui$Element$px(w)),
					$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
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
				$author$project$Internals$Streams$current(model.T)));
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
				return A2($elm$core$Set$member, src_, model.cO) ? A2(
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
							{ec: 'chargement', eL: '/assets/images/loading.gif'})
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
				A2($elm$core$List$map, thumbView, model.en)));
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
						$elm_community$string_extra$String$Extra$toSentenceCase(model.eO))),
					A2(
					$mdgriffith$elm_ui$Element$Input$button,
					_Utils_ap(
						$author$project$Internals$CommonStyleHelpers$buttonStyle(true),
						_List_fromArray(
							[$mdgriffith$elm_ui$Element$alignRight])),
					{
						B: A2(
							$mdgriffith$elm_ui$Element$el,
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Element$paddingXY, 0, 0)
								]),
							$mdgriffith$elm_ui$Element$html(
								function () {
									var _v0 = model.bj;
									if (!_v0) {
										return $author$project$Internals$Icons$grid(22);
									} else {
										return $author$project$Internals$Icons$imageIcon(22);
									}
								}())),
						as: $elm$core$Maybe$Just($author$project$Gallery$Gallery$ToogleDisplayMode)
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
			model.bl,
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
						var _v0 = model.bj;
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
			$TSFoster$elm_uuid$UUID$toString(galleryMeta.eQ),
			config.ib);
		if (!_v0.$) {
			var gallery = _v0.a;
			return _List_fromArray(
				[
					A2($author$project$Gallery$Gallery$view, config, gallery)
				]);
		} else {
			return config.Z ? _List_fromArray(
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
										$elm_community$string_extra$String$Extra$toSentenceCase(galleryMeta.eO))),
									A2(
									$mdgriffith$elm_ui$Element$el,
									_List_fromArray(
										[$mdgriffith$elm_ui$Element$alignRight]),
									$mdgriffith$elm_ui$Element$text(
										$elm$core$String$fromInt(
											$elm$core$List$length(galleryMeta.iu)) + ' images'))
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
													return $.eL;
												},
												$elm$core$List$head(galleryMeta.iu));
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
		var uid = id.bY;
		var docStyleId = id.a4;
		var classes = id.a$;
		var src = _v0.eL;
		var caption = _v0.e5;
		var size = _v0.eK;
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
					A2($mdgriffith$elm_ui$Element$maximum, size.ix, $mdgriffith$elm_ui$Element$fill))
				]),
			_Utils_ap(
				styleSheet.it,
				_Utils_ap(
					A2($author$project$Document$DocumentViews$DocumentView$idStyle, styleSheet, id),
					A2($author$project$Document$DocumentViews$DocumentView$renderAttrs, config, attrs))));
		return _List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$el,
				attrs_,
				A2(
					$mdgriffith$elm_ui$Element$column,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Element$image,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
								]),
							{
								ec: A2($elm$core$Maybe$withDefault, '', caption),
								eL: src_
							}),
							function () {
							if (!caption.$) {
								var c = caption.a;
								return A2(
									$mdgriffith$elm_ui$Element$paragraph,
									_List_fromArray(
										[
											$mdgriffith$elm_ui$Element$Font$italic,
											$mdgriffith$elm_ui$Element$Font$size(14),
											$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
											$mdgriffith$elm_ui$Element$Font$center,
											A2($mdgriffith$elm_ui$Element$paddingXY, 0, 5)
										]),
									_List_fromArray(
										[
											$mdgriffith$elm_ui$Element$text(c)
										]));
							} else {
								return $mdgriffith$elm_ui$Element$none;
							}
						}()
						])))
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
var $author$project$Publications$PublicationsView$murolInfosView = function (config) {
	var murolInfoView = function (_v2) {
		var issue = _v2.fC;
		var date = _v2.dk;
		var topics = _v2.kS;
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
										A2($author$project$Internals$CommonHelpers$dateToStr, config.eW, date)))),
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
									B: $mdgriffith$elm_ui$Element$text('Télécharger'),
									c6: '/baseDocumentaire/publications/murolInfos/' + function (s) {
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
	var _v0 = config.eC;
	if (!_v0.$) {
		var murolInfos = _v0.a.i0;
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
									return $.fC;
								},
								v);
						}),
					A3(
						$elm$core$List$foldr,
						F2(
							function (k, acc) {
								return A3(
									$elm$core$Dict$update,
									A2($elm$time$Time$toYear, config.eW, k.dk),
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
		var _v0 = config.eC;
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
			var murolInfos = _v0.a.i0;
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
	var topLeft = _v0.gu;
	var topRight = _v0.gv;
	var bottomLeft = _v0.e3;
	var bottomRight = _v0.e4;
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
						return $.dk;
					}),
				$elm$core$Dict$values(config.fP)));
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
									return $.dk;
								}),
							$elm$core$Dict$values(config.fP))))));
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
						{e3: 5, e4: 5, gu: 0, gv: 0}),
						$mdgriffith$elm_ui$Element$Border$color($author$project$Internals$CommonStyleHelpers$grey4),
						$mdgriffith$elm_ui$Element$Border$widthEach(
						{aK: 1, aO: 1, aX: 1, a_: 0})
					]);
				if (A2(
					$elm$core$Set$member,
					$TSFoster$elm_uuid$UUID$toString(uuid),
					config.fZ)) {
					var _v3 = _Utils_Tuple2(pic, device.b1);
					if (!_v3.a.$) {
						if (!_v3.b) {
							var url = _v3.a.a.c6;
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
										A4($author$project$Document$DocumentViews$DocumentView$renderTextBlock, config, id, content.p, content.kx)))
								]);
						} else {
							var url = _v3.a.a.c6;
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
														{aK: 0, aO: 0, aX: 10, a_: 0}),
														$mdgriffith$elm_ui$Element$alignLeft
													]),
												picView(url))
											]),
										A4($author$project$Document$DocumentViews$DocumentView$renderTextBlock, config, id, content.p, content.kx)))
								]);
						}
					} else {
						var _v5 = _v3.a;
						return _List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Element$column,
								bodyAttr,
								A4($author$project$Document$DocumentViews$DocumentView$renderTextBlock, config, id, content.p, content.kx))
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
							{aK: 0, aO: 0, aX: 0, a_: 0})
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
						config.jp(
							$TSFoster$elm_uuid$UUID$toString(uuid))),
						$mdgriffith$elm_ui$Element$pointer,
						$mdgriffith$elm_ui$Element$paddingEach(
						{aK: 5, aO: 5, aX: 0, a_: 5}),
						$mdgriffith$elm_ui$Element$Border$roundEach(
						{e3: 0, e4: 0, gu: 2, gv: 2}),
						$mdgriffith$elm_ui$Element$Border$widthEach(
						{aK: 1, aO: 0, aX: 0, a_: 0}),
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
						{aK: 0, aO: 1, aX: 0, a_: 0}),
						$mdgriffith$elm_ui$Element$paddingEach(
						{aK: 5, aO: 9, aX: 5, a_: 5})
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
							$TSFoster$elm_uuid$UUID$toString(uuid),
							config.fZ) ? $author$project$Internals$Icons$chevronsUp(18) : $author$project$Internals$Icons$chevronsDown(18)));
				var _v2 = device.b1;
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
											A2($author$project$Internals$CommonHelpers$dateToStr, config.eW, date))),
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
											A2($author$project$Internals$CommonHelpers$dateToStr, config.eW, date)))
									]))
							]));
				}
			});
		var renderNewsItem = function (_v1) {
			var uuid = _v1.eQ;
			var title = _v1.eO;
			var content = _v1.hy;
			var date = _v1.dk;
			var pic = _v1.jw;
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
												'Dernière mise à jour le ' + A2($author$project$Internals$CommonHelpers$dateToFrench, config.eW, lastUp))
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
										return $.iw;
									},
									function ($) {
										return $.eK;
									}),
								function ($) {
									return $.iv;
								}),
							picLinks)))));
		var imgsScaledToMinHeight = function () {
			var scale = function (picLink) {
				var img = picLink.iv;
				return _Utils_update(
					picLink,
					{
						iv: _Utils_update(
							img,
							{
								eK: {
									iw: minHeight + 5,
									ix: $elm$core$Basics$round((minHeight * img.eK.ix) / img.eK.iw)
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
					return pl.iv.eK.ix + n;
				}),
			0,
			imgsScaledToMinHeight);
		var logoView = function (_v3) {
			var url = _v3.c6;
			var img = _v3.iv;
			return config.Z ? A2(
				$mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$width(
						$mdgriffith$elm_ui$Element$fillPortion(
							$elm$core$Basics$floor((10000 * img.eK.ix) / totalImgWidth)))
					]),
				A2(
					$mdgriffith$elm_ui$Element$image,
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill)
						]),
					{
						ec: '',
						eL: function () {
							var _v1 = img.eL;
							if (!_v1.$) {
								var urlSrc = _v1.a;
								return urlSrc;
							} else {
								return '';
							}
						}()
					})) : A2(
				$mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$width(
						$mdgriffith$elm_ui$Element$fillPortion(
							$elm$core$Basics$floor((10000 * img.eK.ix) / totalImgWidth)))
					]),
				A2(
					$mdgriffith$elm_ui$Element$newTabLink,
					_List_fromArray(
						[
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
						B: A2(
							$mdgriffith$elm_ui$Element$image,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
								]),
							{
								ec: '',
								eL: function () {
									var _v2 = img.eL;
									if (!_v2.$) {
										var urlSrc = _v2.a;
										return urlSrc;
									} else {
										return '';
									}
								}()
							}),
						c6: url
					}));
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
								$mdgriffith$elm_ui$Element$padding(10)
							]),
						_Utils_ap(
							styleSheet.jx,
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
								{fa: columnLevel, il: 1, gd: rowLevel, k0: 1}))
						]),
					$mdgriffith$elm_ui$Internal$Model$Unkeyed(
						_List_fromArray(
							[elem])));
			});
		var columnWidth = function (col) {
			if (!col.$) {
				var colConfig = col.a;
				return colConfig.k0;
			} else {
				var colConfig = col.a;
				return colConfig.k0;
			}
		};
		var columnHeader = function (col) {
			if (!col.$) {
				var colConfig = col.a;
				return colConfig.ii;
			} else {
				var colConfig = col.a;
				return colConfig.ii;
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
			A2($elm$core$List$map, columnHeader, config.ht));
		var add = F3(
			function (cell, columnConfig, cursor) {
				if (!columnConfig.$) {
					var col = columnConfig.a;
					return _Utils_update(
						cursor,
						{
							d3: cursor.d3 + 1,
							O: A2(
								$elm$core$List$cons,
								A3(
									onGrid,
									cursor.gd,
									cursor.d3,
									A2(
										col.kY,
										_Utils_eq(maybeHeaders, $elm$core$Maybe$Nothing) ? (cursor.gd - 1) : (cursor.gd - 2),
										cell)),
								cursor.O)
						});
				} else {
					var col = columnConfig.a;
					return {
						d3: cursor.d3 + 1,
						O: A2(
							$elm$core$List$cons,
							A3(
								onGrid,
								cursor.gd,
								cursor.d3,
								col.kY(cell)),
							cursor.O),
						gd: cursor.gd
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
				return {d3: 1, O: newCursor.O, gd: cursor.gd + 1};
			});
		var children = A3(
			$elm$core$List$foldl,
			build(config.ht),
			{
				d3: 1,
				O: _List_Nil,
				gd: _Utils_eq(maybeHeaders, $elm$core$Maybe$Nothing) ? 1 : 2
			},
			config.hK);
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
					ht: A2($elm$core$List$map, columnWidth, config.ht),
					jQ: A2(
						$elm$core$List$repeat,
						$elm$core$List$length(config.hK),
						$mdgriffith$elm_ui$Internal$Model$Content),
					kg: _Utils_Tuple2(
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
						return children.O;
					} else {
						var renderedHeaders = maybeHeaders.a;
						return _Utils_ap(
							renderedHeaders,
							$elm$core$List$reverse(children.O));
					}
				}()));
	});
var $mdgriffith$elm_ui$Element$indexedTable = F2(
	function (attrs, config) {
		return A2(
			$mdgriffith$elm_ui$Element$tableHelper,
			attrs,
			{
				ht: A2($elm$core$List$map, $mdgriffith$elm_ui$Element$InternalIndexedColumn, config.ht),
				hK: config.hK
			});
	});
var $mdgriffith$elm_ui$Element$scrollbarX = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$overflow, $mdgriffith$elm_ui$Internal$Style$classes.jT);
var $author$project$Document$DocumentViews$StyleSheets$tableStyles = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2(
			'default',
			{
				hj: function (ri) {
					return _List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Border$widthEach(
							{aK: 1, aO: 0, aX: 1, a_: 0}),
							$mdgriffith$elm_ui$Element$Background$color(
							(!A2($elm$core$Basics$modBy, 2, ri)) ? A3($mdgriffith$elm_ui$Element$rgb, 0.8, 0.8, 0.8) : A3($mdgriffith$elm_ui$Element$rgb, 1, 1, 1)),
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
						]);
				},
				hx: _List_Nil,
				kt: _List_fromArray(
					[
						$mdgriffith$elm_ui$Element$Border$widthEach(
						{aK: 0, aO: 1, aX: 0, a_: 1})
					])
			}),
			_Utils_Tuple2(
			'souligné',
			{
				hj: function (ri) {
					return _List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Border$widthEach(
							{aK: 1, aO: 0, aX: 0, a_: 0}),
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
						]);
				},
				hx: _List_fromArray(
					[
						A2($mdgriffith$elm_ui$Element$paddingXY, 1, 0)
					]),
				kt: _List_Nil
			}),
			_Utils_Tuple2(
			'gris-vert',
			{
				hj: function (ri) {
					return _List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Border$widthEach(
							{aK: 1, aO: 0, aX: 0, a_: 0}),
							$mdgriffith$elm_ui$Element$Border$color(
							A4($mdgriffith$elm_ui$Element$rgba, 0.5, 0.5, 0.5, 1)),
							$mdgriffith$elm_ui$Element$Background$color(
							(!A2($elm$core$Basics$modBy, 2, ri)) ? A3($mdgriffith$elm_ui$Element$rgb, 0.83, 0.83, 0.83) : A3($mdgriffith$elm_ui$Element$rgb, 0.58, 0.93, 0.58)),
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
						]);
				},
				hx: _List_fromArray(
					[
						A2($mdgriffith$elm_ui$Element$paddingXY, 1, 1)
					]),
				kt: _List_Nil
			}),
			_Utils_Tuple2(
			'bleu-blanc',
			{
				hj: function (ri) {
					return _List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Border$widthEach(
							{aK: 1, aO: 0, aX: 0, a_: 0}),
							$mdgriffith$elm_ui$Element$Border$color(
							A3($mdgriffith$elm_ui$Element$rgb, 0.5, 0.5, 0.5)),
							$mdgriffith$elm_ui$Element$Background$color(
							(!A2($elm$core$Basics$modBy, 2, ri)) ? A3($mdgriffith$elm_ui$Element$rgb, 0.53, 0.81, 0.92) : A3($mdgriffith$elm_ui$Element$rgb, 0.92, 0.92, 0.84)),
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
						]);
				},
				hx: _List_fromArray(
					[
						A2($mdgriffith$elm_ui$Element$paddingXY, 1, 1)
					]),
				kt: _List_fromArray(
					[
						$mdgriffith$elm_ui$Element$Border$width(1)
					])
			})
		]));
var $author$project$Document$DocumentViews$DocumentView$renderTable = F4(
	function (config, id, attrs, _v0) {
		var style = _v0.kp;
		var nbrRows = _v0.i5;
		var nbrCols = _v0.i4;
		var data = _v0.hK;
		var styleSheet = $author$project$Document$DocumentViews$StyleSheets$defaultStyleSheet(config);
		var containerWidth = $author$project$Document$DocumentViews$StyleSheets$getContainerWidth(config);
		var maxWidth = containerWidth - 40;
		var columns = A2(
			$elm$core$List$map,
			function (ci) {
				return {
					ii: $mdgriffith$elm_ui$Element$none,
					kY: F2(
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
												return $.hx;
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
													return $.hj;
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
					k0: $mdgriffith$elm_ui$Element$fill
				};
			},
			A2($elm$core$List$range, 0, nbrCols - 1));
		return _List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$el,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$width(
						A2($mdgriffith$elm_ui$Element$maximum, maxWidth, $mdgriffith$elm_ui$Element$fill))
					]),
				A2(
					$mdgriffith$elm_ui$Element$indexedTable,
					_Utils_ap(
						A2(
							$elm$core$Maybe$withDefault,
							_List_Nil,
							A2(
								$elm$core$Maybe$map,
								function ($) {
									return $.kt;
								},
								A2($elm$core$Dict$get, style, $author$project$Document$DocumentViews$StyleSheets$tableStyles))),
						_Utils_ap(
							_List_fromArray(
								[$mdgriffith$elm_ui$Element$clipX, $mdgriffith$elm_ui$Element$scrollbarX]),
							_Utils_ap(
								A2($author$project$Document$DocumentViews$DocumentView$idStyle, styleSheet, id),
								A2($author$project$Document$DocumentViews$DocumentView$renderAttrs, config, attrs)))),
					{ht: columns, hK: data}))
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
							videoMeta.kj),
							(!videoMeta.h9) ? $elm$core$Maybe$Just('frameborder=0') : $elm$core$Maybe$Nothing,
							(!videoMeta.ks) ? $elm$core$Maybe$Just('rel=0') : $elm$core$Maybe$Nothing,
							(!videoMeta.hC) ? $elm$core$Maybe$Just('controls=0') : $elm$core$Maybe$Nothing,
							(!videoMeta.eO) ? $elm$core$Maybe$Just('showinfo=0') : $elm$core$Maybe$Nothing
						]))));
		return 'https://www.youtube' + ((videoMeta.jD ? '-nocookie' : '') + ('.com/embed/' + (src + params)));
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
		var uid = id.bY;
		var docStyleId = id.a4;
		var classes = id.a$;
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
								A2($author$project$PageEditor$Internals$DocumentEditorHelpers$buildYoutubeUrl, vidMeta.eL, vidMeta)),
								$elm$html$Html$Attributes$width(vidMeta.eK.kX),
								$elm$html$Html$Attributes$height(vidMeta.eK.kW),
								vidMeta.h9 ? $author$project$Internals$CommonStyleHelpers$noHtmlAttr : A2($elm$html$Html$Attributes$attribute, 'frameborder', '0'),
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
			var _v0 = device.b1;
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
					styleSheet.hs,
					_Utils_ap(
						config.d4 ? _List_fromArray(
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
										A2($mdgriffith$elm_ui$Element$maximum, config.k0, $mdgriffith$elm_ui$Element$fill)),
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
			var containerLabel = document.a.a0;
			var id = document.a.b;
			var attrs = document.a.p;
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
			var cellContent = document.a.ag;
			var id = document.a.b;
			var attrs = document.a.p;
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
					styleSheet.jK,
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
					styleSheet.jP,
					_Utils_ap(
						config.d4 ? _List_fromArray(
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
					styleSheet.kB,
					_Utils_ap(
						config.d4 ? _List_fromArray(
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
var $author$project$Document$DocumentViews$DocumentResponsive$flipTable = function (_v0) {
	var style = _v0.kp;
	var nbrRows = _v0.i5;
	var nbrCols = _v0.i4;
	var data = _v0.hK;
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
	return {hK: newData, i4: nbrRows, i5: nbrCols, kp: style};
};
var $author$project$Document$Document$isImage = function (document) {
	if (document.$ === 1) {
		var lv = document.a;
		var _v1 = lv.ag;
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
						return i.cQ.eK;
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
									return $.iw;
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
							var _v3 = lv.ag;
							if (!_v3.$) {
								var meta = _v3.a;
								var src = meta.eL;
								var caption = meta.e5;
								var size = meta.eK;
								return A2(
									$elm$core$List$cons,
									{p: lv.p, b: lv.b, cQ: meta, fO: 0, dB: 0},
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
					var meta = _v1.cQ;
					var attrs = _v1.p;
					var id = _v1.b;
					return {p: attrs, b: id, cQ: meta, fO: mh + 5, dB: (mh * meta.eK.ix) / meta.eK.iw};
				};
				return A2($elm$core$List$map, scale, images);
			}();
			var totalImgWidth = A3(
				$elm$core$List$foldr,
				F2(
					function (i, n) {
						return i.dB + n;
					}),
				0,
				imgsScaledToMinHeight);
			return A2(
				$author$project$Document$Document$Container,
				_Utils_update(
					id_,
					{
						p: _Utils_ap(
							id_.p,
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
								p: _Utils_ap(
									_List_fromArray(
										[
											$author$project$Document$Document$FillPortion(
											$elm$core$Basics$floor((10000 * im.dB) / totalImgWidth))
										]),
									im.p),
								ag: $author$project$Document$Document$Image(im.cQ),
								b: im.b
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
			var containerLabel = nv.a0;
			var id = nv.b;
			var attrs = nv.p;
			var children = document.b;
			switch (containerLabel) {
				case 0:
					var addColImgClass = function (doc) {
						if (doc.$ === 1) {
							var l = doc;
							var lv = l.a;
							var _v3 = lv.ag;
							if (!_v3.$) {
								var meta = _v3.a;
								var lId = lv.b;
								return $author$project$Document$Document$Cell(
									{
										p: lv.p,
										ag: lv.ag,
										b: _Utils_update(
											lId,
											{
												a$: A2($elm$core$Set$insert, 'colImg', lId.a$)
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
					return ((!device.b1) || (device.b1 === 1)) ? A2(
						$author$project$Document$DocumentViews$DocumentResponsive$responsivePreFormat,
						config,
						A2(
							$author$project$Document$Document$Container,
							_Utils_update(
								nv,
								{a0: 0}),
							children)) : (A2($author$project$Document$Document$containsOnly, $author$project$Document$Document$isImage, document) ? A2($author$project$Document$DocumentViews$DocumentResponsive$renderSameHeightImgRow, config.k0, document) : A2(
						$author$project$Document$Document$Container,
						nv,
						A2(
							$elm$core$List$map,
							$author$project$Document$DocumentViews$DocumentResponsive$responsivePreFormat(config),
							children)));
				case 2:
					return ((!device.b1) || (device.b1 === 1)) ? A2(
						$author$project$Document$DocumentViews$DocumentResponsive$responsivePreFormat,
						config,
						A2(
							$author$project$Document$Document$Container,
							_Utils_update(
								nv,
								{a0: 0}),
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
			var cellContent = l.a.ag;
			var id = l.a.b;
			var attrs = l.a.p;
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
					return (((!device.b1) || (device.b1 === 1)) && (_Utils_cmp(meta.i4, meta.i5) > 0)) ? $author$project$Document$Document$Cell(
						{
							p: attrs,
							ag: $author$project$Document$Document$Table(
								$author$project$Document$DocumentViews$DocumentResponsive$flipTable(meta)),
							b: id
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
									A2($elm$core$String$join, '/', pageInfo.z),
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
											B: $mdgriffith$elm_ui$Element$text(
												$elm_community$string_extra$String$Extra$toSentenceCase(pageInfo.y)),
											c6: '/' + A2($elm$core$String$join, '/', pageInfo.z)
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
							model.cg)))
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
		var _v0 = A2($elm$core$Dict$get, model.c6.z, model.aT);
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
								A2(
									$author$project$Document$DocumentViews$DocumentResponsive$responsivePreFormat,
									model.a,
									A2(
										$author$project$PageEditor$EditorPlugins$TrixTextBlockPlugin$convertTextBlocks,
										A2(
											$elm$core$Dict$map,
											F2(
												function (k, v) {
													return {y: '', z: v};
												}),
											model.a.cV),
										doc))));
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
		return (model.c6.z === '/accueil/plan%20de%20site') ? A2($author$project$Murol$sitemapView, model, maxWidth) : ((model.c6.z === '/accueil/contact') ? A2($author$project$Murol$contactView, model, maxWidth) : ((model.c6.z === '/accueil/mentions%20l%C3%A9gales') ? A2($author$project$Murol$legalView, model, maxWidth) : (model.ds ? A2(
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
			var _v0 = model.a.jW;
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
						{aK: 10, aO: 0, aX: 0, a_: 7})
					]),
				seasonAttr),
			{
				B: $mdgriffith$elm_ui$Element$text('Murol'),
				c6: '/accueil'
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
							{aK: 2, aO: 5, aX: 5, a_: 2}),
							$mdgriffith$elm_ui$Element$Border$roundEach(
							{e3: 0, e4: 0, gu: 5, gv: 0})
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
						{aK: 0, aO: 0, aX: 0, a_: 1}),
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
							B: A2(
								$mdgriffith$elm_ui$Element$el,
								_List_fromArray(
									[
										$mdgriffith$elm_ui$Element$Font$color(
										A3($mdgriffith$elm_ui$Element$rgb, 0, 0.5, 0.5))
									]),
								$mdgriffith$elm_ui$Element$text(name)),
							c6: path
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
			model.aT);
		return A2(
			$mdgriffith$elm_ui$Element$column,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$spacing(15),
					$mdgriffith$elm_ui$Element$centerX,
					$mdgriffith$elm_ui$Element$width(
					A2($mdgriffith$elm_ui$Element$maximum, maxWidth, $mdgriffith$elm_ui$Element$fill)),
					$mdgriffith$elm_ui$Element$paddingEach(
					{aK: 0, aO: 20, aX: 20, a_: 15}),
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
							{aK: 0, aO: 0, aX: 0, a_: 5})
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
									(model.a.k0 < 500) ? $mdgriffith$elm_ui$Element$width(
									$mdgriffith$elm_ui$Element$px(150)) : $mdgriffith$elm_ui$Element$width(
									$mdgriffith$elm_ui$Element$px(270)),
									$author$project$Murol$onKeyEvent
								]),
							{
								B: A2($mdgriffith$elm_ui$Element$Input$labelLeft, _List_Nil, $mdgriffith$elm_ui$Element$none),
								cS: $author$project$Murol$SearchPromptInput,
								cY: $elm$core$Maybe$Just(
									A2(
										$mdgriffith$elm_ui$Element$Input$placeholder,
										_List_Nil,
										$mdgriffith$elm_ui$Element$text('mot clés'))),
								c$: model.cm
							}),
							A2(
							$mdgriffith$elm_ui$Element$Input$button,
							$author$project$Internals$CommonStyleHelpers$buttonStyle((model.cm !== '') && (model.bV !== 1)),
							{
								B: A2(
									$mdgriffith$elm_ui$Element$el,
									_List_Nil,
									$mdgriffith$elm_ui$Element$text('Rechercher')),
								as: $elm$core$Maybe$Just($author$project$Murol$Search)
							})
						])),
					function () {
					var _v0 = model.bV;
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
							var _v1 = model.dR;
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
			var _v0 = model.a.jW;
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
						{aK: 8, aO: 0, aX: 0, a_: 3})
					]),
				seasonAttr),
			A2(
				$mdgriffith$elm_ui$Element$paragraph,
				_List_Nil,
				_List_fromArray(
					[
						(!A2($elm$time$Time$toMonth, model.a.eW, model.a.hF)) ? $mdgriffith$elm_ui$Element$text(
						'La municipalité de Murol vous souhaite une bonne année ' + $elm$core$String$fromInt(
							A2($elm$time$Time$toYear, model.a.eW, model.a.hF))) : $mdgriffith$elm_ui$Element$text('La municipalité de Murol vous souhaite la bienvenue')
					])));
	});
var $author$project$Murol$FoldTopic = {$: 16};
var $author$project$Murol$UnfoldTopic = function (a) {
	return {$: 17, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$Below = 1;
var $mdgriffith$elm_ui$Element$below = function (element) {
	return A2($mdgriffith$elm_ui$Element$createNearby, 1, element);
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
				ae: A4($mdgriffith$elm_ui$Element$rgba255, 76, 115, 56, 1),
				ay: A4($mdgriffith$elm_ui$Element$rgba255, 0, 0, 0, 1),
				S: A4($mdgriffith$elm_ui$Element$rgba255, 226, 242, 211, 1),
				cs: A4($mdgriffith$elm_ui$Element$rgba255, 206, 222, 191, 1)
			};
		case 1:
			return {
				ae: A4($mdgriffith$elm_ui$Element$rgba255, 186, 172, 145, 1),
				ay: A4($mdgriffith$elm_ui$Element$rgba255, 0, 0, 0, 1),
				S: A4($mdgriffith$elm_ui$Element$rgba255, 206, 192, 165, 1),
				cs: A4($mdgriffith$elm_ui$Element$rgba255, 196, 182, 155, 1)
			};
		case 2:
			return {
				ae: A4($mdgriffith$elm_ui$Element$rgba255, 255, 211, 37, 1),
				ay: A4($mdgriffith$elm_ui$Element$rgba255, 0, 0, 0, 1),
				S: A4($mdgriffith$elm_ui$Element$rgba255, 255, 237, 167, 1),
				cs: A4($mdgriffith$elm_ui$Element$rgba255, 229, 189, 33, 1)
			};
		default:
			return {
				ae: A4($mdgriffith$elm_ui$Element$rgba255, 128, 128, 170, 1),
				ay: A4($mdgriffith$elm_ui$Element$rgba255, 0, 0, 0, 1),
				S: A4($mdgriffith$elm_ui$Element$rgba255, 227, 233, 255, 1),
				cs: A4($mdgriffith$elm_ui$Element$rgba255, 197, 200, 248, 1)
			};
	}
};
var $author$project$Murol$topMenuView = function (model) {
	var _v0 = model.cg;
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
						$author$project$Murol$topMenuStyle(model.a.jW).cs),
						$mdgriffith$elm_ui$Element$mouseOver(
						_List_fromArray(
							[
								$mdgriffith$elm_ui$Element$Background$color(
								$author$project$Murol$topMenuStyle(model.a.jW).S)
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
							$author$project$Murol$topMenuStyle(model.a.jW).ay)
						]),
					{
						B: A2(
							$mdgriffith$elm_ui$Element$el,
							_List_Nil,
							$mdgriffith$elm_ui$Element$text(
								$elm_community$string_extra$String$Extra$toSentenceCase(pageInfo.y))),
						c6: strPath(pageInfo.z)
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
								$author$project$Murol$topMenuStyle(model.a.jW).S)
							])),
						$mdgriffith$elm_ui$Element$Background$color(
						$author$project$Murol$topMenuStyle(model.a.jW).ae),
						$mdgriffith$elm_ui$Element$Font$color(
						$author$project$Murol$topMenuStyle(model.a.jW).ay),
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
						B: A2(
							$mdgriffith$elm_ui$Element$el,
							_List_fromArray(
								[$mdgriffith$elm_ui$Element$Font$bold]),
							$mdgriffith$elm_ui$Element$text(
								$elm_community$string_extra$String$Extra$toSentenceCase(pageInfo.y))),
						c6: strPath(pageInfo.z)
					}));
		};
		var menu = A2(
			$elm$core$List$cons,
			A2(
				$author$project$PageTreeEditor$PageTreeEditor$Page,
				{
					fJ: $elm$core$Maybe$Nothing,
					y: 'accueil',
					z: _List_fromArray(
						['accueil'])
				},
				_List_Nil),
			xs_);
		var maxWidth = A3(
			$author$project$Document$DocumentViews$StyleSheets$docMaxWidth,
			_Utils_Tuple2(model.a.k0, model.a.il),
			false,
			model.a.dL);
		var mainCatView = function (_v2) {
			var pageInfo = _v2.a;
			var xs = _v2.b;
			return A2(
				$mdgriffith$elm_ui$Element$column,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$alignTop,
						(model.a.k0 >= 1000) ? $mdgriffith$elm_ui$Element$Events$onMouseEnter(
						$author$project$Murol$UnfoldTopic(pageInfo.y)) : $author$project$Murol$noAttr,
						(model.a.k0 >= 1000) ? $mdgriffith$elm_ui$Element$Events$onMouseLeave($author$project$Murol$FoldTopic) : $author$project$Murol$noAttr,
						_Utils_eq(
						model.c3,
						$elm$core$Maybe$Just(pageInfo.y)) ? $mdgriffith$elm_ui$Element$below(
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
										$author$project$Murol$topMenuStyle(model.a.jW).S)
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
								B: A2(
									$mdgriffith$elm_ui$Element$el,
									_List_fromArray(
										[$mdgriffith$elm_ui$Element$Font$bold]),
									$mdgriffith$elm_ui$Element$text(
										$elm_community$string_extra$String$Extra$toSentenceCase(pageInfo.y))),
								c6: strPath(pageInfo.z)
							}))
					]));
		};
		return (model.a.k0 <= 800) ? A2(
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
					$author$project$Murol$topMenuStyle(model.a.jW).ae)
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
var $author$project$Gallery$HeaderGallery$moveChunk = F2(
	function (config, model) {
		var animFun = function () {
			var _v2 = model.m;
			_v2$2:
			while (true) {
				if (!_v2.$) {
					switch (_v2.a.b) {
						case 0:
							var _v3 = _v2.a;
							var anim = _v3.a;
							var _v4 = _v3.b;
							return $mdgriffith$elm_ui$Element$moveLeft(
								config.aa + A2($mgold$elm_animation$Animation$animate, model.b2, anim));
						case 1:
							var _v5 = _v2.a;
							var anim = _v5.a;
							var _v6 = _v5.b;
							return $mdgriffith$elm_ui$Element$moveRight(
								((-1) * config.aa) + A2($mgold$elm_animation$Animation$animate, model.b2, anim));
						default:
							break _v2$2;
					}
				} else {
					break _v2$2;
				}
			}
			return $mdgriffith$elm_ui$Element$moveLeft(config.aa);
		}();
		var _v0 = model.ar;
		if (_v0.$ === 1) {
			return animFun;
		} else {
			var _v1 = _v0.a;
			var start = _v1.a;
			var stop = _v1.b;
			return ((start.X - stop.X) <= 0) ? $mdgriffith$elm_ui$Element$moveRight(
				((-1) * config.aa) + $elm$core$Basics$abs(start.X - stop.X)) : $mdgriffith$elm_ui$Element$moveLeft((config.aa + start.X) - stop.X);
		}
	});
var $author$project$Gallery$HeaderGallery$ImgLoaded = function (a) {
	return {$: 5, a: a};
};
var $author$project$Gallery$HeaderGallery$picView = F4(
	function (model, config, _v0, attrs) {
		var src = _v0.eL;
		return A2($elm$core$Set$member, src, model.cN) ? A2(
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
								$mdgriffith$elm_ui$Element$px(config.aa)),
								$mdgriffith$elm_ui$Element$height(
								$mdgriffith$elm_ui$Element$px(
									$elm$core$Basics$round(config.aa / 5))),
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
					$mdgriffith$elm_ui$Element$px(config.aa)),
					$mdgriffith$elm_ui$Element$height(
					$mdgriffith$elm_ui$Element$px(
						$elm$core$Basics$round(config.aa / 5)))
				]),
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$image,
					_List_fromArray(
						[$mdgriffith$elm_ui$Element$centerX, $mdgriffith$elm_ui$Element$centerY, $mdgriffith$elm_ui$Element$clip]),
					{ec: 'chargement en cours', eL: '/assets/images/loading.gif'}),
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
			var _v6 = model.m;
			if ((!_v6.$) && (_v6.a.b === 2)) {
				var _v7 = _v6.a;
				var anim = _v7.a;
				var _v8 = _v7.b;
				return $mdgriffith$elm_ui$Element$alpha(
					A2($mgold$elm_animation$Animation$animate, model.b2, anim));
			} else {
				return $mdgriffith$elm_ui$Element$alpha(1);
			}
		}();
		var backOpacity = function () {
			var _v3 = model.m;
			if ((!_v3.$) && (_v3.a.b === 2)) {
				var _v4 = _v3.a;
				var anim = _v4.a;
				var _v5 = _v4.b;
				return $mdgriffith$elm_ui$Element$alpha(
					1 - A2($mgold$elm_animation$Animation$animate, model.b2, anim));
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
								model.ar,
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
					$mdgriffith$elm_ui$Element$px(config.aa)),
					$mdgriffith$elm_ui$Element$height(
					$mdgriffith$elm_ui$Element$px(
						$elm$core$Basics$round(config.aa / 5)))
				]),
			A3(
				$author$project$Gallery$HeaderGallery$chunkView,
				model,
				config,
				$author$project$Internals$Streams$current(model.iu)));
	});
var $author$project$Gallery$HeaderGallery$view = F2(
	function (config, model) {
		return A2(
			$mdgriffith$elm_ui$Element$map,
			model.bl,
			A2($author$project$Gallery$HeaderGallery$galleryView, model, config));
	});
var $author$project$Murol$view = function (model) {
	return {
		d1: function () {
			var maxWidth = A3(
				$author$project$Document$DocumentViews$StyleSheets$docMaxWidth,
				_Utils_Tuple2(model.a.k0, model.a.il),
				false,
				model.a.dL);
			var device = $mdgriffith$elm_ui$Element$classifyDevice(
				{il: model.a.il, k0: model.a.k0});
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
								$mdgriffith$elm_ui$Element$px(model.a.il)),
								$mdgriffith$elm_ui$Element$clip,
								$mdgriffith$elm_ui$Element$Background$image(
								$author$project$Document$DocumentViews$StyleSheets$backgroundImage(model.a.jW))
							]),
						A2(
							$mdgriffith$elm_ui$Element$column,
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
									$mdgriffith$elm_ui$Element$scrollbarY,
									$mdgriffith$elm_ui$Element$htmlAttribute(
									A2($elm$html$Html$Attributes$style, '-webkit-overflow-scrolling', 'touch')),
									(model.a.k0 > 500) ? $author$project$Murol$noAttr : $mdgriffith$elm_ui$Element$htmlAttribute(
									$elm$html$Html$Attributes$id('topAnchor'))
								]),
							_List_fromArray(
								[
									A2($author$project$Murol$pageTitleView, maxWidth, model),
									A2($author$project$Murol$subTitleView, maxWidth, model),
									(model.a.k0 > 500) ? A2(
									$author$project$Gallery$HeaderGallery$view,
									{
										aa: A2($elm$core$Basics$min, 1000, model.a.k0)
									},
									model.ca) : $mdgriffith$elm_ui$Element$none,
									A2($author$project$Murol$clickablePath, maxWidth, model),
									$author$project$Murol$topMenuView(model),
									A2($author$project$Murol$searchEngineView, maxWidth, model),
									A2($author$project$Murol$mainView, maxWidth, model),
									$author$project$Murol$footerView(model)
								]))))
				]);
		}(),
		eO: 'La commune de Murol'
	};
};
var $author$project$Murol$main = $elm$browser$Browser$application(
	{iA: $author$project$Murol$init, jl: $author$project$Murol$ChangeUrl, jm: $author$project$Murol$ClickedLink, kr: $author$project$Murol$subscriptions, kU: $author$project$Murol$update, kY: $author$project$Murol$view});
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
								{hF: currentTime, il: height, k0: width});
						},
						A2($elm$json$Json$Decode$field, 'currentTime', $elm$json$Json$Decode$int));
				},
				A2($elm$json$Json$Decode$field, 'height', $elm$json$Json$Decode$int));
		},
		A2($elm$json$Json$Decode$field, 'width', $elm$json$Json$Decode$int)))(0)}});}(this));