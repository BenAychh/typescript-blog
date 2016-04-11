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
  beforeEach((done) => {
    sequelize.sync({ force: true })
    .then(() => fixture.loadFile('fixtures/seedData.js', models))
    .then(() => done())
    .catch((err) => console.log('error!', err));
  });

  it('should get all blogs', (done) => {
    chai.request(server)
    .get('/posts')
    .end((err, data) => {
      data.should.have.status(200);
      data.should.be.json;
      data.body.should.be.a('array');
      data.body.length.should.equal(6);
      data.body[2].id.should.equal(4);
      data.body[2].authorId.should.equal(1);
      data.body[2].blogText.should.equal('Test post');
      data.body[2].published.should.equal(true);
      data.body[2].createdAt.should.equal('1985-01-19T10:18:00.000Z');
      data.body[2].author.id.should.equal(1);
      data.body[2].author.displayName.should.equal('BenAychh');
      done();
    });
  });

  it('should get a single blog', (done) => {
    chai.request(server)
    .get('/posts/4')
    .end((err, data) => {
      data.should.have.status(200);
      data.should.be.json;
      data.body.should.be.a('object');
      data.body.id.should.equal(4);
      data.body.authorId.should.equal(1);
      data.body.blogText.should.equal('Test post');
      data.body.published.should.equal(true);
      data.body.createdAt.should.equal('1985-01-19T10:18:00.000Z');
      data.body.author.id.should.equal(1);
      data.body.author.displayName.should.equal('BenAychh');
      done();
    });
  });

  it('should post a blog', (done) => {
    chai.request(server)
    .post('/posts/create')
    .send({
      authorId: 1,
      blogText: 'This is a posting test',
      published: true,
    })
    .end((err, data) => {
      chai.request(server)
      .get('/posts/' + data.body.id)
      .end((err, moreData) => {
        moreData.body.should.be.a('object');
        moreData.body.id.should.equal(data.body.id);
        moreData.body.authorId.should.equal(1);
        moreData.body.blogText.should.equal('This is a posting test');
        moreData.body.published.should.equal(true);
        moreData.body.createdAt.should.equal(data.body.createdAt);
        moreData.body.author.id.should.equal(1);
        moreData.body.author.displayName.should.equal('BenAychh');
        done();
      });
    });
  });
});
