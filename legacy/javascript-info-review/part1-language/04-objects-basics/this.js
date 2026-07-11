// "this" — the TypeScript lens
// Run: npx tsx this.ts
// TS can TYPE `this` and catch detachment bugs at compile time.
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// ── `this` parameter: a fake first parameter, erased at runtime ──
function sayHi() {
    console.log("Hi, I'm ".concat(this.name));
}
var user = { name: "John", sayHi: sayHi };
user.sayHi(); // OK — this is { name: string }
// sayHi();   // TS error: The 'this' context of type 'void' is not assignable
// ── `this: void` forbids using this — good for callbacks you'll detach ──
function onTick() {
    console.log("tick");
}
setTimeout(onTick, 0); // safe by construction
var testUser = { onTick: onTick };
setTimeout(testUser.onTick, 0); // TS error: The 'this' context of type '{ onTick: () => void; }' is not assignable to method's 'this' of type 'void'.
// ── Classes + strict mode: TS still can't stop runtime detachment... ──
var Counter = /** @class */ (function () {
    function Counter() {
        var _this = this;
        this.n = 0;
        // Arrow property: `this` is bound per-instance at construction time.
        // Costs one closure per instance, but survives detachment.
        this.reset = function () {
            _this.n = 0;
        };
    }
    Counter.prototype.inc = function () {
        this.n++;
        return this;
    };
    return Counter;
}());
var c = new Counter();
var inc = c.inc;
try {
    inc(); // compiles (method type doesn't track its receiver) — runtime TypeError
}
catch (e) {
    console.log(e.constructor.name); // TypeError
}
var reset = c.reset;
reset(); // fine — arrow captured the instance
console.log(c.n); // 0
// ── Polymorphic `this` type: fluent APIs that survive subclassing ──
var QueryBuilder = /** @class */ (function () {
    function QueryBuilder() {
        this.parts = [];
    }
    QueryBuilder.prototype.where = function (clause) {
        // `this` type, not `QueryBuilder`
        this.parts.push(clause);
        return this;
    };
    return QueryBuilder;
}());
var SqlQueryBuilder = /** @class */ (function (_super) {
    __extends(SqlQueryBuilder, _super);
    function SqlQueryBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SqlQueryBuilder.prototype.orderBy = function (col) {
        this.parts.push("ORDER BY ".concat(col));
        return this;
    };
    return SqlQueryBuilder;
}(QueryBuilder));
// Because where() returns `this` (not QueryBuilder), chaining keeps the subtype:
var q = new SqlQueryBuilder().where("x = 1").orderBy("y"); // OK
console.log(q.parts); // [ 'x = 1', 'ORDER BY y' ]
