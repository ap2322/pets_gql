const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

class Pet {

  static findPetOwners(owner_id){
    return database('pets')
        .join('owners', {'pets.owner_id': 'owners.id'})
        .where('owners.id', owner_id)
        .first()
    }

  static findPet(pet_id){
    return database('pets').where({id: pet_id}).first()
  }

  static allPets(){
    return database('pets').select()
  }

}

module.exports = Pet;
