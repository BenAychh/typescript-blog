var server = require('../app');
var request = require('supertest')(server);
var expect = require('expect.js');
var should = require('should');
var superagent = require('superagent');
var agent = superagent.agent();
var models = require('../models');
var sequelize = models.sequelize;
var Sequelize = models.Sequelize;
var fixture = require('sequelize-fixtures');

describe('Without authentication', function () {
  beforeEach((done) => {
    sequelize.sync({ force: true })
    .then(() => fixture.loadFile('fixtures/seedData.js', models))
    .then(() => done())
    .catch((err) => console.log('error!', err));
  });

  it('should get all blogs', (done) => {
    request
    .get('/posts')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      res.error.should.equal(false);
      res.body.should.be.an.instanceOf(Array);
      res.body.length.should.equal(6);
      res.body[2].id.should.equal(4);
      res.body[2].userId.should.equal(1);
      res.body[2].blogText.should.equal('Test post');
      res.body[2].published.should.equal(true);
      res.body[2].createdAt.should.equal('1985-01-19T10:18:00.000Z');
      res.body[2].user.id.should.equal(1);
      res.body[2].user.userName.should.equal('BenAychh');
      done();
    });
  });

  it('should get a single blog', (done) => {
    request
    .get('/posts/4')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      res.error.should.equal(false);
      res.body.should.be.an.instanceOf(Object);
      res.body.id.should.equal(4);
      res.body.userId.should.equal(1);
      res.body.blogText.should.equal('Test post');
      res.body.published.should.equal(true);
      res.body.createdAt.should.equal('1985-01-19T10:18:00.000Z');
      res.body.user.id.should.equal(1);
      res.body.user.userName.should.equal('BenAychh');
      done();
    });
  });

  it('should not even be able to get to the create blog page', (done) => {
    request
    .get('/posts/create')
    .expect(302)
    .end(done());
  });

  it('should not be able to post a blog', (done) => {
    request
    .post('/posts/create')
    .send({
      blogText: 'This is a posting test',
      published: true,
    })
    .expect(302)
    .end(done());
  });
});

describe('With authentication', function () {
  before((done) => {
    request
    .get('/auth/test')
    .end((err, res) => {
      agent.saveCookies(res);
      done();
    });
  });

  beforeEach((done) => {
    sequelize.sync({ force: true })
    .then(() => fixture.loadFile('fixtures/seedData.js', models))
    .then(() => done())
    .catch((err) => console.log('error!', err));
  });

  it('Should be able to get to the new blog page', (done) => {
    var req = request.get('/posts/create');
    agent.attachCookies(req);
    req.expect(200)
    .end((err, res) => {
      console.log(res.body);
      done();
    });
  });

  it('Should be able to post a blog', (done) => {
    var req = request.post('/posts/create')
    agent.attachCookies(req);
    req.send({
      blogText: 'This is a posting test',
      published: true,
    })
    .expect(200)
    .end((err, entry) => {
      request
      .get('/posts/' + entry.body.id)
      .expect(200)
      .end((error, res) => {
        res.error.should.equal(false);
        res.body.should.be.an.instanceOf(Object);
        res.body.id.should.equal(entry.body.id);
        res.body.userId.should.equal(1);
        res.body.blogText.should.equal('This is a posting test');
        res.body.published.should.equal(true);
        res.body.createdAt.should.equal(entry.body.createdAt);
        res.body.user.id.should.equal(1);
        res.body.user.userName.should.equal('BenAychh');
        done();
      });
    });
  });
});
