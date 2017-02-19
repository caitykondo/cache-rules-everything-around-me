const server = require('./../server');
const supertest = require('supertest');
const chai = require('chai');
chai.should();

const agent = supertest.agent(server);

describe('sanity', () => {
  it('should be true', () => {
    true.should.equal(true);
  });
});

describe('/slow', () => {

  it('should eventually return a page', done => {
    agent.get('/slow')
      .expect('Content-Type', /html/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        res.text.should.equal('<h1>THIS IS THE API ROUTE</h1><p>super slow :<</p>');
      });
      done();
  });
});