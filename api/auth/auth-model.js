const db = require('../../data/dbConfig')

async function add(user) {
const [id] = await db('users').insert(user)
return db('users') 
.select('id', 'username')
.where('id', id)
.first()
}

function findBy(filter) {
return db('users').where(filter)

}


function find() {
return db('users').select('id', 'username')
}

module.exports = {
    add, findBy, find
}