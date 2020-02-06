const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

class Owner {
  static findOwnerPets(owner_id){
    return database('pets')
      .where('pets.owner_id', owner_id)
      .select()
    }

  static allOwners(){
    return database('owners').select()
  }

  static findOwner(id){
    return database('owners').where({id: id}).first()
  }
}

module.exports = Owner;
