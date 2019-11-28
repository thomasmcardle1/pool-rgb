'use strict'

const Schema = use('Schema')

class ColorsSchema extends Schema {
  up () {
    this.create('colors', (table) => {
      table.increments()
      table.string('name', 255).notNullable().unique().index()
      table.integer('white', 255).notNullable()
      table.integer('red', 255).notNullable()
      table.integer('green', 255).notNullable()
      table.integer('blue', 255).notNullable()
    })
  }

  down () {
    this.drop('colors')
  }
}

module.exports = ColorsSchema
