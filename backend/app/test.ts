
import chai from 'chai';
import chaiHttp from "chai-http";
let server = require('./server');
let signUpController = require('./controllers/signup.controller');
let user = require('./models/user.model');


/*
/!*var should = require('should');
var request = require('request');
var expect = require('chai').expect;
var baseUrl= 'localhost:4200';
var util = require('util');
// var router = require('./controllers/signup.controller.ts');
//requrie (app) from "../server.ts";*!/

var app = require('./server');
describe('Index Test', () =>{
it ('should always pass', function () {
  expect(true).to.equal(true);});
});

it('test post', async function () {
  const res = await request(app).get('/signup/');
  expect(res.statusCode).to.equal(201);

})



//in server // sequelize.addModels([UserModel]); // TODO entkommentieren




describe('Post Event for Signup',function () {
  it ( 'returns signup success', async  function(){
    const res= await request(app).get('http://localhost:3000/signUp/');
    expect(res.statusCode).to.equal(201);

  });



  it ('returns verify your email',function (done) {
    request.post({url:baseUrl + '/signup/'},
      function (error : any ,res: any, body: any) {
      expect(res.statusCode).to.equal(201);
      console.log(body);
      done();

      });

  });

});*/






chai.use(chaiHttp);
const expect = chai.expect;
const assert= chai.assert;
const should = chai.should();



describe( 'POST Event for Signup',() => {
  it('should return "please verify your email"', function(done){
    chai.request(server)
      .post('/signup')
      .end((err, res)=> {
        res.should.have.status (201);

        res.body.error.should.equal(false);
        done();
         });
  });
});
