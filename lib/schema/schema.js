const Pet = require('../models/pet')
const Owner = require('../models/owner')

const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull
} = graphql;

const OwnerType = new GraphQLObjectType({
  name: 'Owner',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    age: {type: GraphQLInt},
    pets: {
      type: new GraphQLList(PetType),
      resolve(parent, args){
        return Owner.findPetsOfOwner(parent.id)
      }
    }
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
        return Pet.findOwnerOfPet(parent.owner_id)
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
        return Pet.petByID(args.id)
      }
    },
    pets: {
      type: new GraphQLList(PetType),
      resolve(parent, args){
        return Pet.allPets()
      }
    },
    owners: {
      type: new GraphQLList(OwnerType),
      resolve(parent, args){
        return Owner.allOwners()
      }
    },
    owner: {
      type: OwnerType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args){
        return Owner.ownerByID(args.id)
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addOwner: {
      type: OwnerType,
      args: {
        name: {type: GraphQLNonNull(GraphQLString)},
        age: {type: GraphQLNonNull(GraphQLInt)}
      },
      resolve(parent, args){
        return Owner.addOwner(args)
        .then(result => result[0])
        .catch(error => error)
      }
    },
    deleteOwner: {
      type: GraphQLString,
      args: {id: {type: GraphQLNonNull(GraphQLID)}},
      resolve(parent, args){
        return Owner.deleteOwner(args.id)
        .then((result) => {
          if(result === 1){
            return "Success!"
          } else {
            return "Something went wrong, please check the id and try again."
          }
        })
        .catch(error => error)
      }
    },
    addPet: {
      type: PetType,
      //I required all fields because I have no defaults set up.
      args: {
        name: {type: GraphQLNonNull(GraphQLString)},
        age: {type: GraphQLNonNull(GraphQLInt)},
        animal_type: {type: GraphQLNonNull(GraphQLString)},
        breed: {type: GraphQLNonNull(GraphQLString)},
        favorite_treat: {type: GraphQLNonNull(GraphQLString)},
        owner_id: {type: GraphQLNonNull(GraphQLID)}
      },
      resolve(parent, args){
        return Pet.addPet(args)
        .then(result => result[0])
        .catch(error => error)
      }
    },
    deletePet: {
      type: GraphQLString,
      args: {id: {type: GraphQLNonNull(GraphQLID)}},
      resolve(parent, args){
        return Pet.deletePet(args.id)
        .then((result) => {
          if(result === 1){
            return "Success!"
          } else {
            return "Something went wrong, please check the id and try again."
          }
        })
        .catch(error => error)
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
