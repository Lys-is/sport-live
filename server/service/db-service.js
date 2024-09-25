require('dotenv').config()

const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

class DbService {
   async getAggregate(schema, req) {
    //console.log(schema)
      if(!schema)
        return [[], 0]
       // await schema.updateMany({}, {status_doc: 'active'})
        let filter = getFilters(req, schema);
        let aggregate = buildAggregatePipeline(filter, req.page_n),
            count_aggregate = buildCountPipeline(filter)
     //   console.log(filter)
        let docs = null
        if (!filter) 
          return [null, 0]

        docs = await schema.aggregate(aggregate)
       // console.log(docs)
        let n_docs = await Promise.all(docs.map(async doc => {
            return await schema.findOne({_id: doc._id})
        })).then(docs => docs)
        let count = await schema.aggregate(count_aggregate)
        let totalCount = count[0] ? count[0].totalCount : 0
        //console.log(count)
        //console.log(totalCount)
        return [n_docs, totalCount]
   }
}



function getFilters(req, schema) {
    let query = req.query
    //console.log(query)
    if(!query.page_n)
        query.page_n = 1
    if ( (Object.keys(query).length != 0)) {
        let filter = {}
        for(let key in query) {
            //console.log(key)
            if(key.includes('filter')) {
                filter[key.replace('filter_', '').toString()] = query[key]
            }
            if(key == 'creator') {
                filter[key.toString()+'._id'] = query[key]
            }
            if(key == 'page_n') {
                req.page_n = query[key]
            }
            if(key == 'status') {
              filter.status_doc = query[key]
            }


        }
        //console.log(schema)
        
        if(!filter.status_doc && schema.schema?.paths.status_doc) {
            filter.status_doc = 'active'
        }
        ////console.log(req)
        // let page_n
        // if(req.page_n)
        //     page_n = req.page
        //console.log(filter)
        return filter
       return buildAggregatePipeline(filter, req.page_n)
    }
    else {
        return null
    }
}

function buildAggregatePipeline(filters, pageNumber = 1, pageSize = process.env.PAGE_SIZE || 20) {
    const pipeline = [];
    const matchStage = {};
    const skipStage = { $skip: (+pageNumber - 1) * +pageSize };
    const limitStage = { $limit: +pageSize };
  
    for (const key in filters) {
      const [base, ...nested] = key.split('.');
  
      if (nested.length > 0) {
        const detailsField = base;
  
        if (Array.isArray(filters[base])) {
          pipeline.push({
            $unwind: `$${detailsField}`,
          });
        }
        let modelName = getModelName(base)
        if(modelName){
            pipeline.push({
            $lookup: {
                from: `${modelName}s`, 
                localField: base,
                foreignField: '_id',
                as: detailsField,
            },
            });
        }
        pipeline.push({ $unwind: `$${detailsField}` });
  
        const filterValue = filters[key];
        const nestedField = nested.join('.');
        const regex = /._id$/;
  
        if (regex.test(key)) {
          matchStage[`${detailsField}.${nestedField}`] = new ObjectId(filterValue);
        } else {
          matchStage[`${detailsField}.${nestedField}`] = { $regex: new RegExp(filterValue, 'i') };
        }
      } else {
        const filterValue = filters[key];
        matchStage[key] = { $regex: new RegExp(filterValue, 'i') };
      }
    }
  
    pipeline.push({ $match: matchStage });
    pipeline.push(skipStage);
    pipeline.push(limitStage);
  
    console.log(JSON.stringify(pipeline, null, 2));
    return pipeline;
  }
function buildCountPipeline(filters) {
  const pipeline = [];
  const matchStage = {};
  for (const key in filters) {
    const [base, ...nested] = key.split('.');

    if (nested.length > 0) {
      const detailsField = base;

      if (Array.isArray(filters[base])) {
        pipeline.push({
          $unwind: `$${detailsField}`,
        });
      }
      let modelName = getModelName(base)
      if(modelName){
          pipeline.push({
          $lookup: {
              from: `${modelName}s`, 
              localField: base,
              foreignField: '_id',
              as: detailsField,
          },
          });
      }
      pipeline.push({ $unwind: `$${detailsField}` });

      const filterValue = filters[key];
      const nestedField = nested.join('.');
      const regex = /._id$/;

      if (regex.test(key)) {
        matchStage[`${detailsField}.${nestedField}`] = new ObjectId(filterValue);
      } else {
        matchStage[`${detailsField}.${nestedField}`] = { $regex: new RegExp(filterValue, 'i') };
      }
    } else {
      const filterValue = filters[key];
      matchStage[key] = { $regex: new RegExp(filterValue, 'i') };
    }
  }


  pipeline.push({ $match: matchStage });
  pipeline.push({ $count: 'totalCount' });

  //console.log(JSON.stringify(pipeline, null, 2));
  return pipeline;
}
function getModelName(value) {
    baseCollectionMapping = {
        'creator': 'user',
        'team_from': 'team',
        'team_to': 'team',
    }
    let models = mongoose.modelNames()
    const checker = value =>
        !models.some(element => value.toLowerCase().includes(element.toLowerCase()));

    let a =  value.split('_')[0]

    if(checker(a)) {
        a = baseCollectionMapping[value]
    }

    //console.log(a);
    return a
}
module.exports = new DbService();
