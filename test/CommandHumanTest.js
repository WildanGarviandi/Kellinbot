/**
 * Created by wildangarviandi on 6/4/16.
 */
var assert = require('chai').assert;

describe('Array', function() {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            assert.equal(-1, [1,2,3].indexOf(5));
            assert.equal(-1, [1,2,3].indexOf(0));
        });
    });
});

describe('CommandHumanBot', function () {
    var xml = null;
    describe('convertXMLtoJSON', function () {
        beforeEach(function(done) {
            xml = "<response> <message> <to>081615468107</to> <status>0</status> <text>Success</text> <balance>0</balance> </message> </response>";
            done();
        });
        it('it should return JSON object from XML response', function () {
            var controllerHuman = require('../controller/CommandHumanBot');
            var json = controllerHuman.convertXMLtoJSON(xml);
            assert.equal(json, xml, "hohoho ");
        });
    });
});
