'use strict'

const Schema = use('Schema')

class ColorSchemeSchema extends Schema {
  up () {
    this.create('color_schemes', (table) => {
      table.increments()
      table.string('name', 255).notNullable().index()
    })
  }

  down () {
    this.drop('color_schemes')
  }
}

module.exports = ColorSchemeSchema
