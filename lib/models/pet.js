const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

class Pet {
  static findOwnerOfPet(owner_id){
    return database('pets')
      .join('owners', {'pets.owner_id': 'owners.id'})
      .where('owners.id', owner_id)
      .first()
  }

  static petByID(id){
    return database('pets').where({id: id}).first()
  }

  static allPets(){
    return database('pets').select()
  }

  static addPet(info){
    return database('pets')
      .returning('*')
      .insert({
        name: info.name,
        age: info.age,
        animal_type: info.animal_type,
        breed: info.breed,
        favorite_treat: info.favorite_treat,
        owner_id: info.owner_id
      })
      .then(result => result[0])
      .catch(error => error)
  }

  static deletePet(id){
    return database('pets')
      .where('id', id)
      .del()
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

module.exports = Pet;
