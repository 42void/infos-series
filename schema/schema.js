const graphql = require("graphql");
const _ = require("lodash");
const datas = require("../write.json");

const fetchDatas = require("../createDataFile");
require('dotenv').config()
setInterval(() => fetchDatas.init(), 1000 * 60 * 60 * 24) //24h
// fetchDatas.init()

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
} = graphql;

var ImageType = new GraphQLObjectType({
  name: 'Image',
  fields: {
    show: { type: GraphQLString },
    banner:{ type: GraphQLString },
    box: { type: GraphQLString },
    poster: { type: GraphQLString }
  }
});

const SerieType = new GraphQLObjectType({
  name : "Serie",
  fields: () => ({
    id : { type: GraphQLID },
    title : { type: GraphQLString },
    description: {type : GraphQLString},
    images : {type : ImageType},
    followers: { type: GraphQLInt },
    seasons : { type: GraphQLInt },
    episodes : { type: GraphQLInt },
    creation : { type: GraphQLString },
    length : { type: GraphQLInt },
    network : { type: GraphQLString },
    status: { type: GraphQLString },
  })
})


const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    series: {
      type: new GraphQLList(SerieType),
      resolve(parent, args){
        return datas
      }
    },
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
