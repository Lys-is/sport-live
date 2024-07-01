require('dotenv').config()

const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

class DbService {
   async getAggregate(schema, req) {
        let filter = getFilters(req);
        console.log(filter)
        let docs = null
        if (!filter) 
            return await schema.find()

        docs = await schema.aggregate(filter);
        console.log(docs)
        let n_docs = await Promise.all(docs.map(async doc => {
            return await schema.findOne({_id: doc._id})
        })).then(docs => docs)
        return n_docs
   }
}




function collectAutopopulatePaths(schema, prefix = '') {
    let paths = [];
    
    for (const path in schema.paths) {
      if (schema.paths[path].instance === 'ObjectID' && schema.paths[path].options && schema.paths[path].options.autopopulate) {
        paths.push(prefix ? `${prefix}.${path}` : path);
      } else if (schema.paths[path].schema) {
        const nestedPaths = collectAutopopulatePaths(schema.paths[path].schema, prefix ? `${prefix}.${path}` : path);
        paths = paths.concat(nestedPaths);
      }
    }
  
    return paths;
  }

function getFilters(req) {
    let query = req.query
    console.log(query)
    if ( (Object.keys(query).length != 0)) {
        let filter = {}
        for(let key in query) {
            if(key.includes('filter')) {
                filter[key.replace('filter_', '').toString()] = query[key]
            }
            if(key == 'creator') {
                filter[key.toString()+'._id'] = query[key]
            }
            if(key.includes('page')) {
                req.page = query[key]
            }
        }
        console.log(filter)
       return buildAggregatePipeline(filter)
    }
    else {
        return null
    }
}

function buildAggregatePipeline(filters, pageNumber = 1, pageSize = 5) {
    const pipeline = [];
    const matchStage = {};
    const skipStage = { $skip: (+pageNumber - 1) * +pageSize };
    const limitStage = { $limit: +pageSize };

    for (const key in filters) {
      const [base, ...nested] = key.split('.');

      if (nested.length > 0) {
        const detailsField = base;

        pipeline.push({
          $lookup: {
            from: `${getModelName(base)}s`, // pluralizing collection name, ensure this matches your actual collection names
            localField: base,
            foreignField: '_id',
            as: detailsField,
          },
        });

        pipeline.push({ $unwind: `$${detailsField}` });

        const filterValue = filters[key];
        const nestedField = nested.join('.');
        const regex = /._id$/;
        if (regex.test(key)) 
            matchStage[`${detailsField}.${nestedField}`] = new ObjectId(filters[key])  
        else
            matchStage[`${detailsField}.${nestedField}`] = { $regex: new RegExp(filterValue, 'i') };

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
function getModelName(value) {
    baseCollectionMapping = {
        'creator': 'user',

    }
    let models =  mongoose.modelNames()
    const checker = value =>
        !models.some(element => value.toLowerCase().includes(element.toLowerCase()));

    let a =  value.split('_')[0]

    if(checker(a)) {
        a = baseCollectionMapping[value]
    }
    console.log(a);
    return a
}
module.exports = new DbService();
