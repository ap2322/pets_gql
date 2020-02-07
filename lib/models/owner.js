const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

class Owner {
  static findPetsOfOwner(id){
    return database('pets')
      .where('pets.owner_id', id)
      .select()
  }

  static allOwners(){
    return database('owners').select()
  }

  static ownerByID(id){
    return database('owners').where({id: id}).first()
  }

  static addOwner(info){
    return database('owners')
      .returning('*')
      .insert({
        name: info.name,
        age: info.age
      })
      .then(result => result[0])
      .catch(error => error)
  }

  static deleteOwner(id){
    return database('owners')
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

module.exports = Owner;
