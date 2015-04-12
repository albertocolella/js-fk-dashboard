describe('BDD example testing', function () {
  it('should bar', function () {
    // This test will only run in Node.
    expect(3).to.not.equal('three');
  });
  it('shold baz', function () {
    // This test will run everywhere.
    expect('foo').to.be.a('string');
  });
});
