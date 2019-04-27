const assert = require('assert');
describe('Testing', function() {
  it('Test mocha', function() {
    assert.equal(1==1,true);
  });
  it('Test mocha 2', function() {
    assert.equal(1==1,true);
    return '666';
  });
});