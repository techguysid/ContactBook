var should = require('chai').should(),
expect = require('chai').expect,
supertest = require('supertest'),
api = supertest('http://localhost:8080');


describe('Contact', function(){

	it('create index',  function(done){
		api.get('/')
		.set('Accept', 'application/json')
		.expect(200, done);
	});

	it('add contact and expect status code 200 response',  function(done){
		api.post('/contact/')
	    .set('Accept', 'application/json')
	    .send({
		     name: "sidd",
		     email: "sidd123@examaple.com",
		     phone: "1234567890"
	    })
	    .expect(200,done);
	});

	it('add contact and expect status code 200 response',  function(done){
		api.post('/contact/')
	    .set('Accept', 'application/json')
	    .send({
		     name: "abc",
		     email: "abc@examaple.com",
		     phone: "1234567800"
	    })
	    .expect(200,done);
	});

	it('cross check contact', function(done) {
	    api.get('/contact/abc')
	    .set('Accept', 'application/json')
	    .expect(200)
	    .end(function(err, res) {
	      	expect(res.body).to.include.members( { name: 'abc',
        email: "abc@examaple.com",
        phone: "1234567800"
    		 } );
 	      	done()
    	})

  	})

	it('updates a contact', function(done) {
	    api.put('/contact/abc')
	    .set('Accept', 'application/json')
	    .send({oldname: 'abc', newname: 'abcd'})
	    .expect(200,done);
	 })

	it('get all contacts', function(done) {
	    api.get('/contact/?pageSize=10&page=1&query=abc@example.com')
	    .set('Accept', 'application/json')
	    .send({
		     pageSize: "10",
		     pageNum: "1",
		     query: "abc@example.com",
		    })
	    .expect(200,done);
	 })
})
