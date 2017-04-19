/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 */
/* global describe, it */
import chai from 'chai';
import arightLexicon from 'aright-lexicon';
import '../src/index';

const v = arightLexicon.initializer();
const expect = chai.expect;
//________________ is* family

describe("is string success", () => {
	const result = v.isString().$validate('abcdef');
	it("should", () => {
		expect(result).to.equals(true);
	});
});

describe("is string fail", () => {
	const result = v.isString().$validate(12);
	it("should", () => {
		expect(result).to.not.equals(true);
	});
});

describe("is number success", () => {
	const result = v.isNumber().$validate(12);
	it("should", () => {
		expect(result).to.equals(true);
	});
});
describe("is number fail", () => {
	const result = v.isNumber().$validate(true);
	it("should", () => {
		expect(result).to.not.equals(true);
	});
});

describe("is bool success", () => {
	const result = v.isBoolean().$validate(true);
	it("should", () => {
		expect(result).to.equals(true);
	});
});
describe("is bool fail", () => {
	const result = v.isBoolean().$validate(1);
	it("should", () => {
		expect(result).to.not.equals(true);
	});
});

describe("is func success", () => {
	const result = v.isFunction().$validate(() => {});
	it("should", () => {
		expect(result).to.equals(true);
	});
});
describe("is func fail", () => {
	const result = v.isFunction().$validate(1);
	it("should", () => {
		expect(result).to.not.equals(true);
	});
});

describe("isArray success", () => {
	const result = v.isArray().$validate([]);
	it("should", () => {
		expect(result).to.equals(true);
	});
});
describe("isArray fail", () => {
	const result = v.isArray().$validate({});
	it("should", () => {
		expect(result).to.not.equals(true);
	});
});
describe("isArray (sub object) success", () => {
	const result = v.object('test', v.array('arr', v.item(v.isString()))).$validate({ test: { arr: ['hello'] } });
	it("should", () => {
		expect(result).to.equals(true);
	});
});
describe("isObject success", () => {
	const result = v.isObject().$validate({});
	it("should", () => {
		expect(result).to.equals(true);
	});
});
describe("isObject fail", () => {
	const result = v.isObject().$validate(true);
	it("should", () => {
		expect(result).to.not.equals(true);
	});
});
describe("sub object's rule success", () => {
	const result = v.object('test', v.object('obj', v.string('foo'))).$validate({ test: { obj: { foo: 'hello' } } });
	it("should", () => {
		expect(result).to.equals(true);
	});
});
//________________ properties family

describe("string success", () => {
	const result = v.string('test').$validate({
		test: 'abcdef'
	});
	it("should", () => {
		expect(result).to.equals(true);
	});
});
describe("string fail", () => {
	const result = v.string('test').$validate({
		test: 1
	});
	it("should", () => {
		expect(result).to.not.equals(true);
	});
});

describe("string undefined so fail", () => {
	const result = v.string('test').$validate({});
	it("should", () => {
		expect(result).to.not.equals(true);
	});
});


describe("number success", () => {
	const result = v.number('test').$validate({
		test: 1
	});
	it("should", () => {
		expect(result).to.equals(true);
	});
});
describe("number fail", () => {
	const result = v.number('test').$validate({
		test: true
	});
	it("should", () => {
		expect(result).to.not.equals(true);
	});
});

describe("bool success", () => {
	const result = v.boolean('test').$validate({
		test: true
	});
	it("should", () => {
		expect(result).to.equals(true);
	});
});
describe("bool fail", () => {
	const result = v.boolean('test').$validate({
		test: 1
	});
	it("should", () => {
		expect(result).to.not.equals(true);
	});
});

describe("function success", () => {
	const result = v.function('test').$validate({
		test() {}
	});
	it("should", () => {
		expect(result).to.equals(true);
	});
});
describe("function fail", () => {
	const result = v.function('test').$validate({
		test: true
	});
	it("should", () => {
		expect(result).to.not.equals(true);
	});
});

describe("array success", () => {
	const result = v.array('test').$validate({
		test: []
	});
	it("should", () => {
		expect(result).to.equals(true);
	});
});
describe("array fail", () => {
	const result = v.array('test').$validate({
		test: true
	});
	it("should", () => {
		expect(result).to.not.equals(true);
	});
});

describe("array fail because undefined", () => {
	const result = v.array('test').$validate({});
	it("should", () => {
		expect(result).to.not.equals(true);
	});
});

describe("object success", () => {
	const result = v.object('test').$validate({
		test: {}
	});
	it("should", () => {
		expect(result).to.equals(true);
	});
});
describe("object fail", () => {
	const result = v.object('test').$validate({
		test: true
	});
	it("should", () => {
		expect(result).to.not.equals(true);
	});
});

describe("null success", () => {
	const result = v.null('test').$validate({
		test: null
	});
	it("should", () => {
		expect(result).to.equals(true);
	});
});
describe("null fail", () => {
	const result = v.null('test').$validate({
		test: true
	});
	it("should", () => {
		expect(result).to.not.equals(true);
	});
});

//_______________________________ CONSTRAINTS

describe("enumerable fail", () => {
	const result = v.enum(['bloupi', 'foo']).$validate('bloup');
	it("should", () => {
		expect(result).to.not.equals(true);
	});
});

describe("enumerable success", () => {
	const result = v.enum(['bloupi', 'foo']).$validate('bloupi');
	it("should", () => {
		expect(result).to.equals(true);
	});
});


describe("max fail", () => {
	const result = v.maximum(3).$validate(4);
	it("should", () => {
		expect(result).to.not.equals(true);
	});
});

describe("max success", () => {
	const result = v.maximum(3).$validate(2);
	it("should", () => {
		expect(result).to.equals(true);
	});
});

describe("min fail", () => {
	const result = v.minimum(3).$validate(2);
	it("should", () => {
		expect(result).to.not.equals(true);
	});
});

describe("min success", () => {
	const result = v.minimum(3).$validate(4);
	it("should", () => {
		expect(result).to.equals(true);
	});
});


describe("maxLength fail", () => {
	const result = v.maxLength(3).$validate('abcd');
	it("should", () => {
		expect(result).to.not.equals(true);
	});
});

describe("maxLength success", () => {
	const result = v.maxLength(3).$validate('ab');
	it("should", () => {
		expect(result).to.equals(true);
	});
});

describe("minLength fail", () => {
	const result = v.minLength(3).$validate('ab');
	it("should", () => {
		expect(result).to.not.equals(true);
	});
});

describe("minLength success", () => {
	const result = v.minLength(3).$validate('abc');
	it("should", () => {
		expect(result).to.equals(true);
	});
});

describe("equal fail", () => {
	const result = v.equal(3).$validate(2);
	it("should", () => {
		expect(result).to.not.equals(true);
	});
});

describe("equal success", () => {
	const result = v.equal(3).$validate(3);
	it("should", () => {
		expect(result).to.equals(true);
	});
});



//_____________________ format

describe("email fail", () => {
	const result = v.email().$validate('abcdef');
	it("should", () => {
		expect(result).to.not.equals(true);
	});
});

describe("email success", () => {
	const result = v.email().$validate('john@doe.com');
	it("should", () => {
		expect(result).to.equals(true);
	});
});

//_______________________ OR

describe("or success", () => {
	const rule = v.or(v.isString(), v.isNumber()),
		result = rule.$validate('john@doe.com') && rule.$validate(1);
	it("should", () => {
		expect(result).to.equals(true);
	});
});

describe("or fail", () => {
	const rule = v.or(v.isString(), v.isNumber()),
		result = rule.$validate([]);
	it("should", () => {
		expect(result).to.not.equals(true);
	});
});
//_______________________ NOT

describe("not success", () => {
	const rule = v.not(v.isString(), v.isNumber()),
		result = rule.$validate([]) && rule.$validate(true);
	it("should", () => {
		expect(result).to.equals(true);
	});
});

describe("not fail", () => {
	const rule = v.not(v.isString(), v.isNumber()),
		result = rule.$validate('bloupi');
	it("should", () => {
		expect(result).to.not.equals(true);
	});
});

//_______________________ SWITCH

describe("switch string", () => {
	const rule = v
		.switch('type', {
			string: v.string('foo'),
			number: v.number('foo')
		})
		.strict(false),
		result = rule.$validate({
			type: 'string',
			foo: 'bar'
		});
	it("should", () => {
		expect(result).to.equals(true);
	});
});

describe("switch number fail", () => {
	const rule = v.switch('type', {
			string: v.string('foo'),
			number: v.number('foo')
		}),
		result = rule.$validate({
			type: 'number',
			foo: 'bar'
		});
	it("should", () => {
		expect(result).to.not.equals(true);
	});
});

describe("switch number with default rule", () => {
	const rule = v.switch('type', {
			string: v.string('foo'),
			default: v.number('foo')
		}),
		result = rule.$validate({
			type: 'number',
			foo: 1
		});
	it("should", () => {
		expect(result).to.equal(true);
	});
});
describe("switch fail because no rules", () => {
	const rule = v.switch('type', {
			string: v.string('foo'),
			number: v.number('foo')
		}),
		result = rule.$validate({
			type: 'boolean',
			foo: true
		});
	it("should", () => {
		expect(result).to.not.equals(true);
	});
});

//_____________________ instanceof

describe("instanceOf success", () => {
	const rule = v.instanceOf(Date),
		result = rule.$validate(new Date());
	it("should", () => {
		expect(result).to.equals(true);
	});
});

describe("instanceOf fail", () => {
	const rule = v.instanceOf(Date),
		result = rule.$validate(true);
	it("should", () => {
		expect(result).to.not.equals(true);
	});
});


// ____________________ full rules

describe("string + format + minLength", () => {
	const result = v.isString().format(/abc/).minLength(6).$validate('abcdef');
	it("should", () => {
		expect(result).to.equals(true);
	});
});

describe("string + format + maxLength fail", () => {
	const result = v.isString().format(/abc/).maxLength(6).$validate('abcdefgh');
	it("should", () => {
		expect(result).to.not.equals(true);
	});
});

describe("full rule", () => {
	const rule = v
		.isObject()
		.string('email', v.format('email'))
		.number('index', v.equal(24))
		.boolean('flag')
		.array('collection',
			v.item(
				v.isString()
			)
		)
		.object('child',
			v.string('title')
		)
		.boolean('test');

	const result = rule.$validate({
		email: 'aaa@bbb.com',
		index: 24,
		flag: true,
		collection: ['hello'],
		child: {
			title: 'hello'
		},
		test: true
	});

	it("should", () => {
		expect(result).to.equals(true);
	});
});

describe("full rule fail with report check", () => {
	const rule = v
		.isObject()
		.string('email', v.format('email'))
		.number('index', v.equal(24))
		.boolean('flag')
		.array('collection',
			v.item(
				v.isString()
			)
		)
		.object('child',
			v.string('title')
		)
		.boolean('test');

	const result = rule.$validate({
		email: 'aaa@bbb',
		index: 1,
		flag: 'hello',
		collection: [1],
		child: null,
		test: 3
	});

	it("should", () => {
		expect(result).to.deep.equals({
			valid: false,
			map: {
				email: {
					value: "aaa@bbb",
					errors: [
						"format failed"
					]
				},
				index: {
					value: 1,
					errors: [
						"equality failed (should be : 24)"
					]
				},
				flag: {
					value: "hello",
					errors: [
						"should be a boolean"
					]
				},
				"collection.0": {
					value: 1,
					errors: [
						"should be a string"
					]
				},
				"child.title": {
					value: null,
					errors: [
						"missing property"
					]
				},
				test: {
					value: 3,
					errors: [
						"should be a boolean"
					]
				}
			}
		});
	});
});

