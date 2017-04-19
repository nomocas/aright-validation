/**
 * @author Gilles Coomans
 * @licence MIT
 * @copyright 2016-2017 Gilles Coomans
 */

/*
	@Todo : haltOnFirstError (default false) flag
		or, not, optional check : haltOnFirstError = true


	@Todo :	how ask question on sentence ?
			ex: nullable

			first solution : as lexems :
			string, nullableString, optionalNullableString

			second solution
				string('foo', v.nullable())
					==> but there : we should be able to ask question after string failure : 
						if(rule && isNullable(rule))
							==> ok
						else
							==> error

				other possible question : 
					isRequired
					getDefault
			

	@Todo :	Wrap rule in is* call
		v
		.isObject(v.object('foo', v.string('bar')))
		.isString(v.object())
		.isBoolean();


	@Todo :	.belongsToMe() ==> custom check on session.userId and userId field

	@Todo :	.updateDate() ==> custom handler that set date


 */

import babelute from 'babelute';
import arightLexicon from 'aright-lexicon';

const replaceShouldBeRegExp = /%s/g,
	i18n = function(rule, language) {
		const space = i18n.data[language || i18n.currentLanguage];
		return space[rule];
	},
	formats = {
		email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
		uri: null
	};

i18n.currentLanguage = 'en';
i18n.data = {
	en: {
		string: 'should be a string',
		object: 'should be an object',
		array: 'should be an array',
		boolean: 'should be a boolean',
		number: 'should be a number',
		null: 'should be null',
		enum: 'enum failed (should be one of : %s)',
		equal: 'equality failed (should be : %s)',
		format: 'format failed',
		unmanaged: 'unmanaged property',
		missing: 'missing property',
		minLength: 'too short (length should be at least : %s)',
		maxLength: 'too long (length should be at max : %s)',
		minimum: 'too small (should be at minimum : %s)',
		maximum: 'too big (should be at max : %s)',
		instanceOf: 'should be instance of %s',
		or: '"or" rule not satisfied (%s)',
		not: '"not" rule not satisfied (!%s)'
	}
};

function error(errors, rule, parent, key, path, shouldBe = null) {
	if (!path)
		path = '';
	if (path && key)
		path += '.';
	path = key ? (path + key) : path;

	errors.valid = false;
	errors.map[path] = errors.map[path] || {
		value: (parent && key) ? parent[key] : parent,
		errors: []
	};
	let msg = i18n(rule);
	if (!msg)
		msg = 'missing error message for ' + rule;
	if (shouldBe)
		msg = msg.replace(replaceShouldBeRegExp, shouldBe);
	errors.map[path].errors.push(msg);
	return false;
}


const engine = babelute.createPragmatics({ aright: true }, {
	//______________________________________________________
	is(input, path, args /* type */ , errors) {
		const type = args[0];
		// if (type === 'object') {
		// 	checkObject(input, path);
		// } else 
		if (typeof input !== type)
			error(errors, type, input, null, path, type);
	},
	has(input, path, args /* name, type, rule */ , errors) {
		const name = args[0],
			type = args[1],
			rule = args[2];
		if (!input)
			error(errors, 'missing', input, name, path, type);
		else {
			const value = input[name],
				actualType = typeof value;

			if (actualType === 'undefined')
				error(errors, 'missing', input, name, path);
			else if (actualType !== type)
				error(errors, type, input, name, path, type);
			else if (rule)
				engine.$output(rule, value, path ? (path + '.' + name) : name, errors);
		}
	},
	or(input, path, rules, errors) {
		const ok = rules.some((rule) => {
			const errors = {
				map: {},
				valid: true
			};
			engine.$output(rule, input, path, errors);
			return errors.valid;
		});
		if (!ok)
			error(errors, 'or', input, null, path, rules.join(' || '));
	},
	not(input, path, args /* rule */ , errors) {
		const rule = args[0],
			err = {
				map: {},
				valid: true
			}; // fake error object
		engine.$output(rule, input, path, err);
		if (err.valid)
			error(errors, 'not', input, null, path, rule);
	},
	optional( /* input, path, args, errors */ ) {

	},
	switch (input, path, args /* name, map */ , errors) {
		const name = args[0],
			map = args[1],
			value = input[name],
			rule = map[value] || map['default'];
		if (rule)
			engine.$output(rule, input, path /* ? (path + '.' + name) : name*/ , errors);
		else
			error(errors, 'switch', input, null, path);
	},
	//____________________________________ ARRAY
	isArray(input, path, args, errors) {
		if (typeof input !== 'object' || !input.forEach)
			error(errors, 'array', input, null, path);
	},
	array(input, path, args /* name, rule */ , errors) {
		const name = args[0],
			rule = args[1],
			value = input[name],
			type = typeof value;
		if (type === 'undefined')
			error(errors, 'missing', input, name, path);
		else if (!Array.isArray(input[name]))
			error(errors, 'array', input, name, path);
		else if (rule)
			engine.$output(rule, value, path ? (path + '.' + name) : name, errors);
	},
	item(input, path, args /* rule */ , errors) {
		for (let i = 0, len = input.length; i < len; ++i)
			engine.$output(args[0], input[i], path + '.' + i, errors);
	},
	// ________________________________ SIMPLE CHECKS
	maximum(input, path, args /* max */ , errors) {
		if (input > args[0])
			error(errors, 'maximum', input, null, path);
	},
	minimum(input, path, args /* min */ , errors) {
		if (input < args[0])
			error(errors, 'minimum', input, null, path);
	},
	equal(input, path, args /* value */ , errors) {
		if (input !== args[0])
			error(errors, 'equal', input, null, path, args[0]);
	},
	instanceOf(input, path, args /* Class */ , errors) {
		if (!(input instanceof args[0]))
			error(errors, 'instanceOf', input, null, path);
	},
	maxLength(input, path, args /* max */ , errors) {
		if (input.length > args[0])
			error(errors, 'maxLength', input, null, path);
	},
	minLength(input, path, args /* min */ , errors) {
		if (input.length < args[0])
			error(errors, 'minLength', input, null, path);
	},
	format(input, path, args /* regexp format */ , errors) {
		let exp = args[0];
		if (typeof exp === 'string')
			exp = formats[exp];
		if (!exp.test(input))
			error(errors, 'format', input, null, path);
	},
	enum(input, path, args /* values */ , errors) {
		const values = args[0];
		if (values.indexOf(input) === -1)
			error(errors, 'enum', input, null, path, values.join(', '));
	},
	null(input, path, args, errors) {
		if (input[args[0]] !== null)
			error(errors, 'null', input, args[0], path);
	},
	$output(babelute, input, path = null, errors = { map: {}, valid: true }) {
		babelute._lexems.forEach((lexem) => {
			this._targets[lexem.lexicon] && this[lexem.name] && this[lexem.name](input, path, lexem.args, errors);
		});
		return errors.valid === false ? errors : true;
	}
});

export default {
	engine,
	i18n,
	formats,
	error
};

arightLexicon.addAliases({
	$validate(value) {
		return engine.$output(this, value);
	}
});

