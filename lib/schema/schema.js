const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLSchema
} = graphql;

const OwnerType = new GraphQLObjectType({
  name: 'Owner',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    age: {type: GraphQLInt}
  })
});

const PetType = new GraphQLObjectType({
  name: 'Pet',
  //It is important that the fields is a function when we add our relationship later.
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    animal_type: {type: GraphQLString},
    breed: {type: GraphQLString},
    age: {type: GraphQLInt},
    favorite_treat: {type: GraphQLString},
    owner: {
      type: OwnerType,
      resolve(parent, args){
        return database('pets')
          .join('owners', {'pets.owner_id': 'owners.id'})
          .where('owners.id', parent.owner_id)
          .first()
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields:{
    pet: {
      type: PetType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args){
        return database('pets').where({id: args.id}).first()
      }
    },
    pets: {
      type: new GraphQLList(PetType),
      resolve(parent, args){
        return database('pets').select()
      }
    },
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
})
