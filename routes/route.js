'use strict'

const elasticsearch = require('elasticsearch');
const express= require('express');
const router= express.Router();
const bodyParser = require('body-parser');


let client = new elasticsearch.Client({
  host: 'localhost:9200',   //default port
});

let indexName = 'plivotest'

function authenticate(req,res,next) {
  console.log("Authenticating")
  console.log(req.headers.authorization)
  if(req.headers.authorization=='Basic Og==')
    next();
  else{
    res.send("You are not authorized")
  }
}

router.get('/',authenticate,function(req, res) {
      return client.indices.putMapping({  // mapping
        index: indexName,
        type: "contact",
        body: {
            properties: {
                name: { type: "text" },
                phone: { type: "text"},
                email: {type: "text" },
               }
        }
    }, function(err, response){
        if(err){
            console.log(err);
            res.sendStatus(500);
        }
        else{
            res.status(200).send({ message: 'Setup Done' });
        }
    });
});

router.get('/contact/:name',authenticate,function(req, res) {
          let input = req.params.name;

          client.search({       //searching the elasticsearch index
                index: indexName,
                type: 'contact',
                body: {
                    query: {
                        query_string:{
                           query: input // the query string is the name of the contact
                        }
                    }
                }
        }).then(function (resp) {
             let results = resp.hits.hits.map(function(hit){
                return hit._source;
            });
            console.log('GET results',results); //returns the list of the search
            console.log(resp);
            res.status(200).send(results);

        });
     });
router.get('/contactByEmail/:email',authenticate,function(req, res) {
         let input = req.params.email;

         client.search({       //searching the elasticsearch index
               index: indexName,
               type: 'contact',
               body: {
                 "query": {
                 "match": {
                   "email":input
                 }
                 }
               }
       }).then(function (resp) {
            let results = resp.hits.hits.map(function(hit){
               return hit._source;
           });
           console.log('GET results',results); //returns the list of the search
           console.log(resp);
           res.status(200).send(results);

       });
    });
router.get('/contact',authenticate,function(req, res) {
  let pageNum = parseInt(req.query.page)?parseInt(req.query.page):1; //parse parameters from the req param
  let perPage = parseInt(req.query.pageSize)?parseInt(req.query.pageSize):10;
  let searchbody;
  if(req.query.query){
    searchbody = {
      "query": {
      "match": {
        "email":req.query.query
      }
      }
    }
  }else{
    searchbody = {
      "query":{
        "match_all":{

        }
      }
    }
  }
  let searchParams = {
    index: indexName,
    from: (pageNum - 1) * perPage,
    size: perPage,
    body: searchbody
      };
  console.log('search parameters', searchParams);
  client.search(searchParams, function (err, resp) {
      if (err) {
        throw err;
    }
  console.log('search_results', {
    results: resp.hits.hits,
    page: pageNum,
    pages: Math.ceil(resp.hits.total / perPage)
  });
  let results = resp.hits.hits.map(function(hit){
        return hit._source.name + " " + hit._source.email;
        });
       console.log(results);
       res.status(200).send(results);
  });
});

router.post('/contact',authenticate,function(req, res) {

    	  let input = req.body;
            client.index({
                index: indexName,
                type: 'contact',
                body: {

                        name: input.name,
                        email: input.email,
                        phone: input.phone

                }
        }, function (error,response) {
              if(error) return console.log('ERROR',error);
              else{
                console.log(response);
                res.sendStatus(200);
              }

        });
    });
router.put('/contact/:name',authenticate,function(req, res) {
        let input = req.body;

    	 client.updateByQuery({
           index: indexName,
           type: 'contact',
           body: {
              "query": { "match": { "name": input.oldname } },
              "script":  {"inline":"ctx._source.name =  "+ "'"+input.newname +"'"+";"}
           }
        }, function(err, response) {
            if (err) {
               console.log(err);
               res.sendStatus(500);
            }else{
              console.log(response);
              res.status(200).send(response);
            }

        }
    )
    });

 router.delete('/contact/:name',authenticate,function(req, res) {
    let input = req.params.name;
    client.deleteByQuery({
        index: indexName,
        type: 'contact',
        body: {
           query: {
               match: { name: input }
           }
        }
      }, function (error, response) {

          if(error){
            console.log(error);
            res.sendStatus(500);
          }

            else{
                res.status(200).send(response);
            }
      });
    });


module.exports = router;
