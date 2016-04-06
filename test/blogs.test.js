var server = require('../app');
var expect = require('expect.js');
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var models = require('../models');
var sequelize = models.sequelize;
var Sequelize = models.Sequelize;
var fixture = require('sequelize-fixtures');

chai.use(chaiHttp);

describe('API', function () {
  beforeEach(function (done) {
    sequelize.sync({ force: true })
    .then(function () {
      return fixture.loadFile('fixtures/seedData.js', models);
    })
    .then(function () {
      done();
    })
    .catch(function (err) {
      console.log('error!', err);
    });
  });

  it('should get all blogs', function (done) {
    chai.request(server)
    .get('/authors')
    .end(function (err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');
      res.body.length.should.equal(10);
      done();
    });
  });
});
